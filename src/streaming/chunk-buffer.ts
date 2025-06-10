export type ChunkingStrategy =
  | "character"
  | "word"
  | "sentence"
  // A custom chunker returns processed chunks and the remaining unprocessed text.
  | ((text: string) => { chunks: string[]; remainder: string });

export class ChunkBuffer {
  private buffer = "";

  // ----- Configurable Guards -----
  private static readonly MAX_WORD_LEN = 50; // Breaks up extremely long "words" (e.g., URLs, code).
  private static readonly MAX_BUFFER_NO_BREAK = 400; // Hard limit for any run without a natural break.
  // --------------------------------

  private readonly graphemeSeg: Intl.Segmenter;
  private readonly wordSeg: Intl.Segmenter;
  private readonly sentenceSeg: Intl.Segmenter;

  private readonly customChunker?: (text: string) => {
    chunks: string[];
    remainder: string;
  };
  private readonly strategy: "character" | "word" | "sentence" | "custom";

  constructor(strategy: ChunkingStrategy) {
    if (typeof strategy === "function") {
      this.customChunker = strategy;
      this.strategy = "custom";
    } else {
      this.strategy = strategy;
    }

    this.graphemeSeg = new Intl.Segmenter(undefined, {
      granularity: "grapheme",
    });
    this.wordSeg = new Intl.Segmenter(undefined, { granularity: "word" });
    this.sentenceSeg = new Intl.Segmenter(undefined, {
      granularity: "sentence",
    });
  }

  /** Feed one LLM token, receive zero-or-more flushed chunks. */
  addToken(token: string): string[] {
    this.buffer += token;

    if (this.customChunker) {
      return this.flushCustom();
    }

    // Pre-emptively flush any overly long runs of text that haven't found a natural break.
    const longRunChunks = this.flushLongRuns();

    let newChunks: string[] = [];
    switch (this.strategy) {
      case "character":
        newChunks = this.flushGraphemes();
        break;
      case "word":
        newChunks = this.flushWords();
        break;
      case "sentence":
        newChunks = this.flushSentences();
        break;
    }
    return [...longRunChunks, ...newChunks];
  }

  /** Flush whatever is left in the buffer when the stream finishes. */
  flush(): string[] {
    if (!this.buffer) return [];

    let finalChunks: string[] = [];
    if (this.customChunker) {
      // For custom chunkers, flush everything by treating the whole buffer as input.
      const { chunks, remainder } = this.customChunker(this.buffer);
      finalChunks.push(...chunks);
      if (remainder) {
        finalChunks.push(remainder);
      }
    } else {
      // For built-in strategies, the remaining buffer is the final chunk.
      finalChunks.push(this.buffer);
    }

    this.buffer = "";
    // Ensure no empty strings are returned.
    return finalChunks.filter((c) => c.length > 0);
  }

  // ────────────────────────────────────────────────────────────────
  //  Internals
  // ────────────────────────────────────────────────────────────────

  private flushGraphemes(): string[] {
    const segments = Array.from(this.graphemeSeg.segment(this.buffer)).map(
      (s) => s.segment
    );
    // If there's only one segment, it might be incomplete. Wait for more.
    if (segments.length <= 1) {
      return [];
    }

    // Flush all but the last segment, which becomes the new buffer.
    const chunksToFlush = segments.slice(0, -1);
    this.buffer = segments[segments.length - 1];
    return chunksToFlush;
  }

  private flushWords(): string[] {
    const chunks: string[] = [];
    let currentWord = ""; // Accumulates the word part (e.g., "quick")
    let currentNonWord = ""; // Accumulates trailing spaces/punctuation (e.g., " ")

    // Iterate through all segments of the current buffer.
    const segments = Array.from(this.wordSeg.segment(this.buffer));

    // Process segments to form "word + non-word" chunks.
    for (let i = 0; i < segments.length; i++) {
      const part = segments[i];

      if (part.isWordLike) {
        // If we just finished a word and accumulated non-word characters,
        // it means the previous "word + non-word" chunk is complete.
        if (currentWord.length > 0 && currentNonWord.length > 0) {
          chunks.push(currentWord + currentNonWord);
          currentWord = "";
          currentNonWord = "";
        }
        currentWord += part.segment;
      } else {
        // This is a non-word segment (space, punctuation).
        currentNonWord += part.segment;
      }

      // Guard against extremely long words (e.g., a URL) that don't have natural breaks.
      // This flushes the accumulated word part even if it's not followed by a non-word yet.
      if (currentWord.length > ChunkBuffer.MAX_WORD_LEN) {
        chunks.push(currentWord + currentNonWord);
        currentWord = "";
        currentNonWord = "";
      }
    }

    // After the loop, whatever remains in currentWord and currentNonWord
    // is the incomplete part of the stream. This becomes the new buffer.
    this.buffer = currentWord + currentNonWord;

    // Filter out any empty strings that might result from edge cases.
    return chunks.filter((c) => c.length > 0);
  }

  private flushSentences(): string[] {
    // This hybrid approach is more robust for sentence-ending punctuation.
    // 1. Use a regex to find the last definitive sentence boundary.
    // This is more reliable than Intl.Segmenter alone for partial streams.
    const sentenceBoundaryRegex = /.*?[.?!](\s+|$)/g;
    let lastMatchIndex = -1;
    let match;
    while ((match = sentenceBoundaryRegex.exec(this.buffer)) !== null) {
      lastMatchIndex = match.index + match[0].length;
    }

    if (lastMatchIndex === -1) {
      // No definitive sentence boundary found yet.
      return [];
    }

    // 2. The text to be flushed is everything up to that boundary.
    const textToFlush = this.buffer.substring(0, lastMatchIndex);
    this.buffer = this.buffer.substring(lastMatchIndex);

    // 3. Now, use Intl.Segmenter on the confirmed text to correctly split it.
    // This handles cases where `textToFlush` contains multiple sentences.
    return Array.from(this.sentenceSeg.segment(textToFlush))
      .map((s) => s.segment)
      .filter((c) => c.length > 0);
  }

  /** Fallback guard to break up very long runs of text with no natural breaks. */
  private flushLongRuns(): string[] {
    const chunks: string[] = [];
    // If the buffer is very long and contains no spaces (e.g., a single long word/URL),
    // force a break to prevent excessive buffering.
    if (
      this.buffer.length > ChunkBuffer.MAX_BUFFER_NO_BREAK &&
      !/\s/.test(this.buffer)
    ) {
      chunks.push(this.buffer.slice(0, ChunkBuffer.MAX_BUFFER_NO_BREAK));
      this.buffer = this.buffer.slice(ChunkBuffer.MAX_BUFFER_NO_BREAK);
    }
    return chunks;
  }

  private flushCustom(): string[] {
    try {
      const { chunks, remainder } = this.customChunker!(this.buffer);
      this.buffer = remainder;
      return chunks;
    } catch (err) {
      console.error(
        "Custom chunker failed. Flushing entire buffer to avoid data loss.",
        err
      );
      const all = this.buffer;
      this.buffer = "";
      return [all];
    }
  }
}

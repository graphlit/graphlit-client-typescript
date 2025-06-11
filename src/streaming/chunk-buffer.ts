/**
 * Breaks an LLM’s streaming token deltas into character, word, or sentence
 * chunks – or lets you plug in your own chunker.
 *
 * Usage
 * -----
 *   const buf = new ChunkBuffer('sentence');
 *   stream.on('delta', d => buf.addToken(d).forEach(pushToUI));
 *   stream.on('end',   () => buf.flush().forEach(pushToUI));
 */

export type ChunkingStrategy =
  | "character"
  | "word"
  | "sentence"
  | ((text: string) => { chunks: string[]; remainder: string });

export interface ChunkerOpts {
  /** Flush “words” longer than this (default = 50 chars). */
  maxWordLen?: number;
  /** Force a break after this many chars with no whitespace (default = 400). */
  maxBufferNoBreak?: number;
}

const hasSegmenter = typeof Intl !== "undefined" && "Segmenter" in Intl;

export class ChunkBuffer {
  // ────────────────────────────────────────────────────────────────────
  // public API
  // ────────────────────────────────────────────────────────────────────
  constructor(strategy: ChunkingStrategy, opts: ChunkerOpts = {}) {
    if (typeof strategy === "function") {
      this.customChunker = strategy;
      this.strategy = "custom";
    } else {
      this.strategy = strategy;
    }

    this.MAX_WORD_LEN = opts.maxWordLen ?? 50;
    this.MAX_BUFFER_NO_BREAK = opts.maxBufferNoBreak ?? 400;

    if (hasSegmenter) {
      this.graphemeSeg = new Intl.Segmenter(undefined, {
        granularity: "grapheme",
      });
      this.wordSeg = new Intl.Segmenter(undefined, { granularity: "word" });
      this.sentenceSeg = new Intl.Segmenter(undefined, {
        granularity: "sentence",
      });
    }
  }

  /** Feed one LLM delta; receive zero‑or‑more flushed chunks. */
  addToken(token: string): string[] {
    this.buffer += token;

    if (this.customChunker) return this.flushCustom();

    // emergency bailout for giant uninterrupted text
    const forced = this.flushLongRuns();

    const fresh =
      this.strategy === "character"
        ? this.flushGraphemes()
        : this.strategy === "word"
          ? this.flushWords()
          : this.flushSentences();

    return forced.concat(fresh);
  }

  /** Call when the stream closes to emit the final remainder. */
  flush(): string[] {
    if (!this.buffer.length) return [];

    if (this.customChunker) {
      const { chunks, remainder } = this.customChunker(this.buffer);
      this.buffer = "";
      return [...chunks, remainder].filter(Boolean);
    }

    // Re‑use the normal strategy until nothing more flushes.
    const out: string[] = [];
    while (true) {
      const next =
        this.strategy === "character"
          ? this.flushGraphemes()
          : this.strategy === "word"
            ? this.flushWords()
            : this.flushSentences();
      if (!next.length) break;
      out.push(...next);
    }
    if (this.buffer) out.push(this.buffer);
    this.buffer = "";
    return out;
  }

  // ────────────────────────────────────────────────────────────────────
  // internals
  // ────────────────────────────────────────────────────────────────────
  private buffer = "";

  private readonly strategy: "character" | "word" | "sentence" | "custom";
  private readonly customChunker?: (t: string) => {
    chunks: string[];
    remainder: string;
  };

  private readonly MAX_WORD_LEN: number;
  private readonly MAX_BUFFER_NO_BREAK: number;

  // These are only defined when Intl.Segmenter exists.
  private readonly graphemeSeg?: Intl.Segmenter;
  private readonly wordSeg?: Intl.Segmenter;
  private readonly sentenceSeg?: Intl.Segmenter;

  // -- character ------------------------------------------------------
  private flushGraphemes(): string[] {
    if (!hasSegmenter) return []; // unreachable on modern runtimes

    const segs = Array.from(this.graphemeSeg!.segment(this.buffer)).map(
      (s) => s.segment
    );

    /* Strategy: always keep exactly one segment in the buffer.
       If we only have one segment so far, we don’t know whether it’s
       complete (could be half a surrogate pair). Wait for more. */
    if (segs.length <= 1) return [];

    const emit = segs.slice(0, -1);
    this.buffer = segs[segs.length - 1];
    return emit;
  }

  // -- word -----------------------------------------------------------
  private flushWords(): string[] {
    if (!hasSegmenter) return []; // unreachable on modern runtimes

    const chunks: string[] = [];
    let leadNonWord = "";
    let word = "";
    let tailNonWord = "";

    for (const s of this.wordSeg!.segment(this.buffer)) {
      if (s.isWordLike) {
        if (word && tailNonWord) {
          // previous word finished
          chunks.push(word + tailNonWord);
          word = tailNonWord = "";
        }
        word += s.segment;
        if (word.length > this.MAX_WORD_LEN) {
          // force‑break huge “word”
          chunks.push(word + tailNonWord);
          word = tailNonWord = "";
        }
      } else {
        // non‑word segment (space / punctuation)
        if (!word) {
          leadNonWord += s.segment; // leading whitespace
        } else {
          tailNonWord += s.segment; // trailing whitespace
        }
      }
    }

    // flush leading non‑word if present and some word followed
    if (leadNonWord && word) {
      chunks.push(leadNonWord);
      leadNonWord = "";
    }

    this.buffer = leadNonWord + word + tailNonWord;
    return chunks.filter(Boolean);
  }

  // -- sentence -------------------------------------------------------
  private flushSentences(): string[] {
    if (!hasSegmenter) return []; // unreachable on modern runtimes

    // find last confirmed boundary with regex (includes CJK punctuation)
    const boundary = /.*?[.?!。！？](\s+|$)/g; // negative‑look‑behind ellipsis left out for perf
    let last = -1,
      m: RegExpExecArray | null;
    while ((m = boundary.exec(this.buffer))) last = boundary.lastIndex;
    if (last === -1) return [];

    const slice = this.buffer.slice(0, last);
    this.buffer = this.buffer.slice(last);

    return Array.from(this.sentenceSeg!.segment(slice))
      .map((s) => s.segment)
      .filter(Boolean);
  }

  // -- long‑run bailout ----------------------------------------------
  private flushLongRuns(): string[] {
    if (
      this.buffer.length > this.MAX_BUFFER_NO_BREAK &&
      !/\s/.test(this.buffer)
    ) {
      const head = this.buffer.slice(0, this.MAX_BUFFER_NO_BREAK);
      this.buffer = this.buffer.slice(this.MAX_BUFFER_NO_BREAK);
      return [head];
    }
    return [];
  }

  // -- custom ---------------------------------------------------------
  private flushCustom(): string[] {
    try {
      const { chunks, remainder } = this.customChunker!(this.buffer);
      this.buffer = remainder;
      return chunks;
    } catch (err) {
      console.error(
        "Custom chunker failed – flushing whole buffer to avoid data loss",
        err
      );
      const all = this.buffer;
      this.buffer = "";
      return [all];
    }
  }
}

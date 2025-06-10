// Test the word chunking function
const createWordChunker = () => {
  return (buf: string) => {
    // Match optional leading spaces followed by a word
    const match = buf.match(/^(\s*\S+)/);
    console.log(
      `  Trying to match: "${buf.substring(0, 20)}..." -> ${match ? `"${match[0]}"` : "null"}`
    );
    return match ? match[0] : null;
  };
};

// Test with a sample LLM token
const testToken = " quick brown fox jumps over the lazy dog.";
console.log(`Testing word extraction from: "${testToken}"`);
console.log(`Token length: ${testToken.length} chars\n`);

const wordChunker = createWordChunker();
let buffer = testToken;
const words: string[] = [];

while (buffer.length > 0) {
  const word = wordChunker(buffer);
  if (word) {
    words.push(word);
    buffer = buffer.slice(word.length);
    console.log(
      `Extracted word ${words.length}: "${word}" (remaining: "${buffer}")`
    );
  } else {
    break;
  }
}

console.log(`\nTotal words extracted: ${words.length}`);
console.log("Words:", words);
console.log(
  "Word lengths:",
  words.map((w) => w.length)
);

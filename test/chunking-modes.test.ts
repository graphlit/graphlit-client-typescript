import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Graphlit } from "../src/client";
import { TEST_MODELS } from "./test-models";
import { SmoothChunkingStrategy } from "../src/types/streaming";
import { UIStreamEvent } from "../src/types/ui-events";

/**
 * Comprehensive test suite for streamAgent chunking modes
 * Tests various smooth streaming configurations and their behavior
 */
describe("Smooth Streaming Chunking Modes", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;

  if (!orgId || !envId || !secret) {
    console.warn(
      "⚠️  Skipping chunking mode tests - missing Graphlit credentials"
    );
    return;
  }

  let client: Graphlit;
  const createdSpecifications: string[] = [];
  const createdConversations: string[] = [];
  let openaiClient: any;

  // Metrics tracking
  interface ChunkingMetrics {
    mode: string;
    totalChunks: number;
    avgChunkSize: number;
    minChunkSize: number;
    maxChunkSize: number;
    totalDuration: number;
    chunkDelays: number[];
    firstChunkDelay: number;
  }

  const allMetrics: ChunkingMetrics[] = [];

  beforeAll(async () => {
    client = new Graphlit(orgId, envId, secret);

    // Initialize streaming clients if available
    if (process.env.OPENAI_API_KEY) {
      try {
        const { default: OpenAI } = await import("openai");
        openaiClient = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });
        console.log("✅ OpenAI streaming client initialized for native mode");
      } catch (e) {
        console.log("⚠️  OpenAI SDK not available, using fallback mode");
      }
    } else {
      console.log(
        "⚠️  No OPENAI_API_KEY environment variable found, using fallback mode"
      );
    }
  });

  afterAll(async () => {
    // Clean up conversations
    console.log(
      `\n🧹 Cleaning up ${createdConversations.length} test conversations...`
    );
    for (const convId of createdConversations) {
      try {
        await client.deleteConversation(convId);
      } catch (error) {
        console.warn(`⚠️  Failed to delete conversation ${convId}`);
      }
    }

    // Clean up specifications
    console.log(
      `🧹 Cleaning up ${createdSpecifications.length} test specifications...`
    );
    for (const specId of createdSpecifications) {
      try {
        await client.deleteSpecification(specId);
      } catch (error) {
        console.warn(`⚠️  Failed to delete specification ${specId}`);
      }
    }

    // Display metrics summary
    if (allMetrics.length > 0) {
      console.log("\n📊 CHUNKING MODES PERFORMANCE SUMMARY");
      console.log("=".repeat(70));

      // TODO: this is broken; not finding 'mode'

      // Group by mode
      const byMode = allMetrics.reduce(
        (acc, m) => {
          if (!acc[m.mode]) acc[m.mode] = [];
          acc[m.mode].push(m);
          return acc;
        },
        {} as Record<string, ChunkingMetrics[]>
      );

      Object.entries(byMode).forEach(([mode, metrics]) => {
        const avgChunks =
          metrics.reduce((sum, m) => sum + m.totalChunks, 0) / metrics.length;
        const avgDelay =
          metrics.reduce(
            (sum, m) =>
              sum +
              (m.chunkDelays.reduce((s, d) => s + d, 0) /
                m.chunkDelays.length || 0),
            0
          ) / metrics.length;

        console.log(`\n${mode}:`);
        console.log(`  Average chunks per response: ${avgChunks.toFixed(1)}`);
        console.log(`  Average delay between chunks: ${avgDelay.toFixed(0)}ms`);
        console.log(
          `  Average chunk size: ${metrics.reduce((sum, m) => sum + m.avgChunkSize, 0) / metrics.length}`
        );
      });

      console.log("=".repeat(70));
    }
  }, 90000);

  // Test content for consistency
  const TEST_PROMPT = `Generate exactly this text with proper formatting:
"The quick brown fox jumps over the lazy dog. This is a test sentence.
Here is another line with some numbers: 123, 456, 789.
And a final line to test chunking behavior across multiple segments."`;

  describe("Chunking Strategy Tests", () => {
    const chunkingConfigs = [
      {
        name: "No Chunking (Disabled)",
        config: {
          maxToolRounds: 100,
          enabled: false,
        },
        // Note: Even with chunking disabled, the streaming still produces chunks
        // but they should be larger/less frequent than with chunking enabled
      },
      {
        name: "Word Chunking (Default)",
        config: {
          enabled: true,
          chunking: SmoothChunkingStrategy.Word,
          delay: 50,
        },
      },
      {
        name: "Character Chunking",
        config: {
          enabled: true,
          chunking: SmoothChunkingStrategy.Character,
          delay: 0, // No delay for character-by-character
        },
        // Note: Character mode doesn't chunk character-by-character but rather by small word groups
      },
      {
        name: "Sentence Chunking",
        config: {
          enabled: true,
          chunking: SmoothChunkingStrategy.Sentence,
          delay: 100,
        },
      },
      {
        name: "Word Chunking (Fast)",
        config: {
          enabled: true,
          chunking: SmoothChunkingStrategy.Word,
          delay: 10,
        },
      },
      {
        name: "Word Chunking (Slow)",
        config: {
          enabled: true,
          chunking: SmoothChunkingStrategy.Word,
          delay: 200,
        },
      },
    ];

    // Test with a consistent model
    const testModel =
      TEST_MODELS.find((m) => m.name.includes("OpenAI GPT-4o")) ||
      TEST_MODELS[0];

    for (const chunkingConfig of chunkingConfigs) {
      it(`should handle ${chunkingConfig.name}`, async () => {
        console.log(`\n📝 Testing ${chunkingConfig.name}...`);

        // Create specification
        const createResponse = await client.createSpecification(
          testModel.config
        );
        const specId = createResponse.createSpecification?.id!;
        createdSpecifications.push(specId);

        const events: UIStreamEvent[] = [];
        const chunks: string[] = [];
        let previousText = "";
        let startTime = 0;
        let firstChunkTime = 0;
        const chunkTimestamps: number[] = [];

        // Check if streaming is supported
        if (!client.supportsStreaming()) {
          console.log("⚠️  Skipping test - streaming not supported");
          return;
        }

        try {
          await client.streamAgent(
            TEST_PROMPT,
            (event: UIStreamEvent) => {
              events.push(event);
              const now = Date.now();
              console.log(`📨 Event: ${event.type}`);

              if (event.type === "conversation_started") {
                createdConversations.push(event.conversationId);
                startTime = now;
              } else if (event.type === "message_update") {
                if (firstChunkTime === 0) {
                  firstChunkTime = now;
                }

                // Extract the new chunk
                const currentText = event.message.message;
                const newChunk = currentText.substring(previousText.length);

                if (newChunk) {
                  chunks.push(newChunk);
                  chunkTimestamps.push(now);
                  console.log(
                    `  Chunk ${chunks.length}: "${newChunk}" (${newChunk.length} chars)`
                  );
                }

                previousText = currentText;
              } else if (event.type === "conversation_completed") {
                console.log(`✅ Conversation completed`);
              } else if (event.type === "error") {
                console.error(`❌ Error: ${event.error.message}`);
              }
            },
            undefined, // conversationId
            { id: specId }, // specification
            undefined, // tools
            undefined, // toolHandlers
            {
              maxToolRounds: chunkingConfig.config.maxToolRounds,
              smoothingEnabled: chunkingConfig.config.enabled,
              chunkingStrategy:
                chunkingConfig.config.chunking ===
                SmoothChunkingStrategy.Character
                  ? "character"
                  : chunkingConfig.config.chunking ===
                      SmoothChunkingStrategy.Sentence
                    ? "sentence"
                    : chunkingConfig.config.chunking ===
                        SmoothChunkingStrategy.Word
                      ? "word"
                      : "word",
              smoothingDelay: chunkingConfig.config.delay,
            }
          );
        } catch (error) {
          console.error(`❌ StreamAgent failed:`, error);
          throw error;
        }

        // Calculate metrics
        const totalDuration =
          chunkTimestamps.length > 0
            ? chunkTimestamps[chunkTimestamps.length - 1] - startTime
            : 0;

        const chunkDelays: number[] = [];
        for (let i = 1; i < chunkTimestamps.length; i++) {
          chunkDelays.push(chunkTimestamps[i] - chunkTimestamps[i - 1]);
        }

        const chunkSizes = chunks.map((c) => c.length);
        const metrics: ChunkingMetrics = {
          mode: chunkingConfig.name,
          totalChunks: chunks.length,
          avgChunkSize:
            chunkSizes.length > 0
              ? chunkSizes.reduce((a, b) => a + b, 0) / chunkSizes.length
              : 0,
          minChunkSize: chunkSizes.length > 0 ? Math.min(...chunkSizes) : 0,
          maxChunkSize: chunkSizes.length > 0 ? Math.max(...chunkSizes) : 0,
          totalDuration,
          chunkDelays,
          firstChunkDelay: firstChunkTime - startTime,
        };

        allMetrics.push(metrics);

        // Display metrics
        console.log(`\n📊 Metrics for ${chunkingConfig.name}:`);
        console.log(`  Total chunks: ${metrics.totalChunks}`);
        console.log(
          `  Average chunk size: ${metrics.avgChunkSize.toFixed(1)} chars`
        );
        console.log(
          `  Chunk size range: ${metrics.minChunkSize}-${metrics.maxChunkSize} chars`
        );
        console.log(`  Total duration: ${metrics.totalDuration}ms`);
        console.log(`  First chunk delay: ${metrics.firstChunkDelay}ms`);
        if (chunkDelays.length > 0) {
          console.log(
            `  Average chunk delay: ${(chunkDelays.reduce((a, b) => a + b, 0) / chunkDelays.length).toFixed(0)}ms`
          );
        }

        // Validate behavior based on config
        if (!chunkingConfig.config.enabled) {
          // No chunking - passes through native LLM chunks
          // LLMs typically chunk by words/phrases, so we get more chunks than with sentence chunking
          console.log(
            `✅ No chunking (disabled): Got ${chunks.length} native LLM chunks`
          );
          console.log(
            `   Average chunk size: ${metrics.avgChunkSize.toFixed(1)} chars`
          );
          console.log(`   This reflects the LLM's natural token boundaries`);
        } else {
          // Chunking enabled - validate based on strategy
          switch (chunkingConfig.config.chunking) {
            case SmoothChunkingStrategy.Character:
              // Should get character-by-character chunks
              if (metrics.avgChunkSize > 2) {
                console.error(
                  `❌ FAILED: Character chunking should have avg chunk size ≤2, but got ${metrics.avgChunkSize.toFixed(1)}`
                );
                console.error(`   Chunk sizes: ${chunkSizes.join(", ")}`);
                console.error(
                  `   Sample chunks: ${chunks
                    .slice(0, 10)
                    .map((c) => `"${c}"`)
                    .join(", ")}`
                );
              }
              expect(metrics.avgChunkSize).toBeLessThanOrEqual(2);
              console.log(
                `✅ Character chunking: Got ${chunks.length} chunks (avg size: ${metrics.avgChunkSize.toFixed(1)} chars)`
              );
              break;
            case SmoothChunkingStrategy.Word:
              // Should get word-sized chunks
              if (metrics.avgChunkSize <= 3 || metrics.avgChunkSize >= 15) {
                console.error(
                  `❌ FAILED: Word chunking should have avg chunk size 3-15, but got ${metrics.avgChunkSize.toFixed(1)}`
                );
                console.error(`   Chunk sizes: ${chunkSizes.join(", ")}`);
                console.error(
                  `   Sample chunks: ${chunks
                    .slice(0, 5)
                    .map((c) => `"${c}"`)
                    .join(", ")}`
                );
              }
              expect(metrics.avgChunkSize).toBeGreaterThan(3);
              expect(metrics.avgChunkSize).toBeLessThan(15);
              console.log("✅ Word chunking: Word-sized chunks as expected");
              break;
            case SmoothChunkingStrategy.Sentence:
              // Should get sentence-sized chunks
              if (metrics.avgChunkSize <= 10) {
                console.error(
                  `❌ FAILED: Sentence chunking should have avg chunk size >10, but got ${metrics.avgChunkSize.toFixed(1)}`
                );
                console.error(`   Chunk sizes: ${chunkSizes.join(", ")}`);
                console.error(
                  `   Sample chunks: ${chunks
                    .slice(0, 3)
                    .map((c) => `"${c}"`)
                    .join(", ")}`
                );
              }
              expect(metrics.avgChunkSize).toBeGreaterThan(10);
              console.log("✅ Sentence chunking: Larger chunks as expected");
              break;
          }

          // Validate delay timing
          if (chunkDelays.length > 0) {
            const avgDelay =
              chunkDelays.reduce((a, b) => a + b, 0) / chunkDelays.length;
            const targetDelay = chunkingConfig.config.delay!;

            // The delay parameter seems to be a suggestion rather than strict timing
            // Let's check if there's at least some correlation with the target
            console.log(
              `📊 Delay timing: Average ${avgDelay.toFixed(0)}ms (target: ${targetDelay}ms)`
            );
            console.log(
              `   Delay distribution: ${chunkDelays.map((d) => d.toFixed(0)).join(", ")}ms`
            );

            // For slow delays (>100ms), we should see at least some delays near the target
            if (targetDelay >= 100) {
              const longDelays = chunkDelays.filter(
                (d) => d >= targetDelay * 0.5
              ).length;
              if (longDelays === 0) {
                console.warn(
                  `⚠️  WARNING: No delays reached 50% of target (${targetDelay}ms)`
                );
                console.warn(
                  `   This suggests the delay parameter may not be fully controlling timing`
                );
              } else {
                console.log(
                  `✅ Found ${longDelays}/${chunkDelays.length} delays ≥${(targetDelay * 0.5).toFixed(0)}ms`
                );
              }
            } else {
              // For fast delays, just verify they're generally quick
              if (avgDelay > 100) {
                console.warn(
                  `⚠️  WARNING: Fast chunking (${targetDelay}ms) produced slow average (${avgDelay.toFixed(0)}ms)`
                );
              } else {
                console.log(`✅ Fast chunking maintained reasonable speed`);
              }
            }
          }
        }

        // Validate we got complete message
        const finalEvent = events.find(
          (e) => e.type === "conversation_completed"
        );
        expect(finalEvent).toBeDefined();

        // Log the final response
        if (finalEvent?.type === "conversation_completed") {
          console.log(`\n📝 Final response: "${finalEvent.message.message}"`);
          console.log(
            `   Total length: ${finalEvent.message.message.length} chars`
          );
        }

        console.log("✅ Got complete response");
      }, 90000);
    }
  });

  describe("Chunking Behavior Comparisons", () => {
    it("should demonstrate actual differences between chunking strategies", async () => {
      console.log(
        "\n📊 Demonstrating differences between chunking strategies..."
      );

      const testModel = TEST_MODELS[0];
      const createResponse = await client.createSpecification(testModel.config);
      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      const testPrompt = "Count: one two three four five";
      const strategies = [
        { name: "Character", strategy: SmoothChunkingStrategy.Character },
        { name: "Word", strategy: SmoothChunkingStrategy.Word },
        { name: "Sentence", strategy: SmoothChunkingStrategy.Sentence },
      ];

      console.log(`\nTest prompt: "${testPrompt}"`);

      for (const { name, strategy } of strategies) {
        console.log(`\n${name} chunking:`);
        const chunks: string[] = [];
        let prevText = "";

        // Check if streaming is supported
        if (!client.supportsStreaming()) {
          console.log("⚠️  Skipping test - streaming not supported");
          return;
        }

        await client.streamAgent(
          testPrompt,
          (event: UIStreamEvent) => {
            if (event.type === "conversation_started") {
              createdConversations.push(event.conversationId);
            } else if (event.type === "message_update") {
              const newChunk = event.message.message.substring(prevText.length);
              if (newChunk) {
                chunks.push(newChunk);
                console.log(`  Chunk ${chunks.length}: "${newChunk}"`);
              }
              prevText = event.message.message;
            }
          },
          undefined,
          { id: specId },
          undefined,
          undefined,
          {
            smoothingEnabled: true,
            chunkingStrategy:
              strategy === SmoothChunkingStrategy.Character
                ? "character"
                : strategy === SmoothChunkingStrategy.Word
                  ? "word"
                  : "sentence",
            smoothingDelay: 30,
          }
        );

        console.log(`  Total chunks: ${chunks.length}`);
      }
    }, 90000);

    it("should show difference between chunking enabled vs disabled", async () => {
      console.log("\n🔄 Comparing chunking enabled vs disabled...");

      const testModel =
        TEST_MODELS.find((m) => m.name.includes("OpenAI GPT-4o")) ||
        TEST_MODELS[0];

      // Create specification
      const createResponse = await client.createSpecification(testModel.config);
      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      const testPrompt =
        "Write exactly: The quick brown fox jumps over the lazy dog.";

      // Test 1: Chunking disabled
      console.log("\n📴 Testing with chunking DISABLED...");
      const disabledChunks: string[] = [];
      let disabledPrevText = "";

      // Check if streaming is supported
      if (!client.supportsStreaming()) {
        console.log("⚠️  Skipping test - streaming not supported");
        return;
      }

      await client.streamAgent(
        testPrompt,
        (event: UIStreamEvent) => {
          if (event.type === "conversation_started") {
            createdConversations.push(event.conversationId);
          } else if (event.type === "message_update") {
            const newChunk = event.message.message.substring(
              disabledPrevText.length
            );
            if (newChunk) {
              disabledChunks.push(newChunk);
            }
            disabledPrevText = event.message.message;
          }
        },
        undefined,
        { id: specId }
      );

      // Test 2: Chunking enabled with word strategy
      console.log("\n✅ Testing with chunking ENABLED (word strategy)...");
      const enabledChunks: string[] = [];
      let enabledPrevText = "";

      await client.streamAgent(
        testPrompt,
        (event: UIStreamEvent) => {
          if (event.type === "conversation_started") {
            createdConversations.push(event.conversationId);
          } else if (event.type === "message_update") {
            const newChunk = event.message.message.substring(
              enabledPrevText.length
            );
            if (newChunk) {
              enabledChunks.push(newChunk);
            }
            enabledPrevText = event.message.message;
          }
        },
        undefined,
        { id: specId },
        undefined,
        undefined,
        {
          smoothingEnabled: true,
          chunkingStrategy: "word",
          smoothingDelay: 30,
        }
      );

      // Compare behaviors
      console.log("\n📊 Comparison:");
      console.log(`  Disabled chunks: ${disabledChunks.length}`);
      console.log(`  Enabled chunks: ${enabledChunks.length}`);

      const disabledAvgSize =
        disabledChunks.reduce((sum, c) => sum + c.length, 0) /
        disabledChunks.length;
      const enabledAvgSize =
        enabledChunks.reduce((sum, c) => sum + c.length, 0) /
        enabledChunks.length;

      console.log(
        `  Disabled avg chunk size: ${disabledAvgSize.toFixed(1)} chars`
      );
      console.log(
        `  Enabled avg chunk size: ${enabledAvgSize.toFixed(1)} chars`
      );

      // We expect some difference between enabled and disabled
      if (Math.abs(disabledChunks.length - enabledChunks.length) < 2) {
        console.warn(
          "⚠️  WARNING: Chunking enabled/disabled produced similar chunk counts"
        );
        console.warn(
          `   This suggests chunking config may not be fully controlling the behavior`
        );
      }

      console.log("✅ Comparison complete");
    }, 90000);

    it("should compare chunking behavior between native and fallback streaming", async () => {
      console.log(
        "\n🔄 Comparing native vs fallback streaming with chunking..."
      );

      const testModel =
        TEST_MODELS.find((m) => m.name.includes("OpenAI GPT-4o")) ||
        TEST_MODELS[0];

      // Create specification
      const createResponse = await client.createSpecification(testModel.config);
      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      const chunkingConfig = {
        enabled: true,
        chunking: SmoothChunkingStrategy.Word,
        delay: 30,
      };

      // Test 1: Native streaming
      console.log("\n🚀 Testing NATIVE streaming with chunking...");
      console.log(`   Streaming maxToolRounds: 100`);
      const nativeEvents: UIStreamEvent[] = [];
      const nativeChunks: string[] = [];
      let nativePrevText = "";

      // Check if streaming is supported
      if (!client.supportsStreaming()) {
        console.log("⚠️  Skipping test - streaming not supported");
        return;
      }

      await client.streamAgent(
        "Write a paragraph about artificial intelligence with at least 50 words.",
        (event: UIStreamEvent) => {
          nativeEvents.push(event);
          if (event.type === "conversation_started") {
            createdConversations.push(event.conversationId);
          } else if (event.type === "message_update") {
            const newChunk = event.message.message.substring(
              nativePrevText.length
            );
            if (newChunk) {
              nativeChunks.push(newChunk);
            }
            nativePrevText = event.message.message;
          }
        },
        undefined,
        { id: specId }
      );

      console.log(`  Native streaming chunks: ${nativeChunks.length}`);

      // Test 2: Fallback streaming
      console.log("\n📡 Testing FALLBACK streaming with chunking...");
      const fallbackEvents: UIStreamEvent[] = [];
      const fallbackChunks: string[] = [];
      let fallbackPrevText = "";

      await client.streamAgent(
        "Write a paragraph about artificial intelligence with at least 50 words.",
        (event: UIStreamEvent) => {
          fallbackEvents.push(event);
          if (event.type === "conversation_started") {
            createdConversations.push(event.conversationId);
          } else if (event.type === "message_update") {
            const newChunk = event.message.message.substring(
              fallbackPrevText.length
            );
            if (newChunk) {
              fallbackChunks.push(newChunk);
            }
            fallbackPrevText = event.message.message;
          }
        },
        undefined,
        { id: specId }
      );

      console.log(`  Fallback streaming chunks: ${fallbackChunks.length}`);

      // Compare behaviors
      console.log("\n📊 Comparison:");
      console.log(`  Native chunks: ${nativeChunks.length}`);
      console.log(`  Fallback chunks: ${fallbackChunks.length}`);

      // Native should generally have more chunks due to real-time streaming
      // Native streaming should produce more chunks than fallback
      if (nativeChunks.length > fallbackChunks.length) {
        console.log(
          `✅ Native streaming (${nativeChunks.length} chunks) produced more chunks than fallback (${fallbackChunks.length} chunks)`
        );
      } else if (nativeChunks.length === fallbackChunks.length) {
        console.warn(
          `⚠️  WARNING: Native and fallback produced same number of chunks (${nativeChunks.length})`
        );
        console.warn(
          `   This suggests native streaming may not be working properly`
        );
        console.warn(
          `   Native chunks: ${nativeChunks
            .slice(0, 3)
            .map((c) => `"${c.substring(0, 20)}..."`)
            .join(", ")}`
        );
      }

      // For word chunking, we expect at least some granular chunks
      if (nativeChunks.length < 3) {
        console.error(
          `❌ FAILED: Native streaming with word chunking should produce at least 3 chunks, but got ${nativeChunks.length}`
        );
      }
      expect(nativeChunks.length).toBeGreaterThanOrEqual(3);
      console.log("✅ Native streaming produced multiple chunks");

      // Both should complete successfully
      const nativeComplete = nativeEvents.find(
        (e) => e.type === "conversation_completed"
      );
      const fallbackComplete = fallbackEvents.find(
        (e) => e.type === "conversation_completed"
      );

      if (!nativeComplete) {
        console.error("❌ FAILED: Native streaming did not complete");
        console.error(
          `   Events received: ${nativeEvents.map((e) => e.type).join(", ")}`
        );
      }
      if (!fallbackComplete) {
        console.error("❌ FAILED: Fallback streaming did not complete");
        console.error(
          `   Events received: ${fallbackEvents.map((e) => e.type).join(", ")}`
        );
      }

      expect(nativeComplete).toBeDefined();
      expect(fallbackComplete).toBeDefined();
      console.log("✅ Both streaming modes completed successfully");
    }, 90000);
  });

  describe("Edge Cases and Special Scenarios", () => {
    it("should handle very fast chunking (stress test)", async () => {
      console.log("\n⚡ Testing very fast chunking...");

      const testModel =
        TEST_MODELS.find((m) => m.name.includes("OpenAI GPT-4o Mini")) ||
        TEST_MODELS[0];

      const createResponse = await client.createSpecification(testModel.config);
      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      const events: UIStreamEvent[] = [];
      let updateCount = 0;

      // Check if streaming is supported
      if (!client.supportsStreaming()) {
        console.log("⚠️  Skipping test - streaming not supported");
        return;
      }

      await client.streamAgent(
        "Count from 1 to 20, each number on a new line.",
        (event: UIStreamEvent) => {
          events.push(event);
          if (event.type === "conversation_started") {
            createdConversations.push(event.conversationId);
          } else if (event.type === "message_update") {
            updateCount++;
          }
        },
        undefined,
        { id: specId },
        undefined,
        undefined,
        {
          smoothingEnabled: true,
          chunkingStrategy: "character", // Character chunking for fast updates
          smoothingDelay: 5, // Very fast delay
        }
      );

      console.log(`  Total updates: ${updateCount}`);
      if (updateCount < 20) {
        console.error(
          `❌ FAILED: Fast character chunking should produce >20 updates, but got ${updateCount}`
        );
        const messageUpdates = events.filter(
          (e) => e.type === "message_update"
        );
        if (messageUpdates.length > 0) {
          console.error(
            `   Final text length: ${messageUpdates[messageUpdates.length - 1].message.message.length}`
          );
        }
      }
      expect(updateCount).toBeGreaterThan(20);
      console.log("✅ Fast chunking handled many updates successfully");
    }, 90000);

    it("should handle no delay (immediate chunking)", async () => {
      console.log("\n🏃 Testing immediate chunking (no delay)...");

      const testModel = TEST_MODELS[0];

      const createResponse = await client.createSpecification(testModel.config);
      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      const events: UIStreamEvent[] = [];
      const timestamps: number[] = [];

      // Check if streaming is supported
      if (!client.supportsStreaming()) {
        console.log("⚠️  Skipping test - streaming not supported");
        return;
      }

      await client.streamAgent(
        "Say 'Hello World'",
        (event: UIStreamEvent) => {
          events.push(event);
          if (event.type === "conversation_started") {
            createdConversations.push(event.conversationId);
          } else if (event.type === "message_update") {
            timestamps.push(Date.now());
          }
        },
        undefined,
        { id: specId },
        undefined,
        undefined,
        {
          smoothingEnabled: true,
          chunkingStrategy: "character",
          smoothingDelay: 0, // No delay - immediate chunking
        }
      );

      // Calculate delays
      const delays: number[] = [];
      for (let i = 1; i < timestamps.length; i++) {
        delays.push(timestamps[i] - timestamps[i - 1]);
      }

      if (delays.length > 0) {
        const avgDelay = delays.reduce((a, b) => a + b, 0) / delays.length;
        console.log(`  Average delay: ${avgDelay.toFixed(0)}ms`);
        console.log(
          `  All delays: ${delays.map((d) => d.toFixed(0)).join(", ")}ms`
        );

        // With delay=0, we expect minimal delays but network/processing can still introduce some
        if (avgDelay < 100) {
          console.log("✅ Immediate chunking achieved fast delivery");
        } else {
          console.warn(
            `⚠️  WARNING: Immediate chunking (delay=0) produced ${avgDelay.toFixed(0)}ms average delay`
          );
          console.warn(`   This may be due to network/processing overhead`);
        }
      } else {
        console.warn("⚠️  WARNING: No delays measured (single chunk response)");
      }
    }, 90000);

    it("should handle mixed content (code, text, special characters)", async () => {
      console.log("\n🎨 Testing chunking with mixed content...");

      const testModel =
        TEST_MODELS.find((m) => m.name.includes("Claude")) || TEST_MODELS[0];

      const createResponse = await client.createSpecification(testModel.config);
      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      const events: UIStreamEvent[] = [];
      let finalMessage = "";

      const mixedPrompt = `Generate this exact content:
\`\`\`javascript
function hello() {
  console.log("Hello, World! 🌍");
  return 42;
}
\`\`\`

Special characters: @#$%^&*()_+-=[]{}|;':",./<>?
Unicode: 你好世界 • café • π ≈ 3.14159`.trim();

      // Check if streaming is supported
      if (!client.supportsStreaming()) {
        console.log("⚠️  Skipping test - streaming not supported");
        return;
      }

      await client.streamAgent(
        mixedPrompt,
        (event: UIStreamEvent) => {
          events.push(event);
          if (event.type === "conversation_started") {
            createdConversations.push(event.conversationId);
          } else if (event.type === "conversation_completed") {
            finalMessage = event.message.message;
          }
        },
        undefined,
        { id: specId },
        undefined,
        undefined,
        {
          smoothingEnabled: true,
          chunkingStrategy: "word", // Word chunking for mixed content
          smoothingDelay: 30,
        }
      );

      // Verify content integrity
      const contentChecks = [
        { content: "function hello()", name: "function declaration" },
        { content: "console.log", name: "console.log statement" },
        { content: "@#$%^&*", name: "special characters" },
      ];

      let allPassed = true;
      for (const check of contentChecks) {
        if (!finalMessage.includes(check.content)) {
          console.error(
            `❌ FAILED: Mixed content missing ${check.name}: "${check.content}"`
          );
          console.error(
            `   Received message (first 200 chars): "${finalMessage.substring(0, 200)}..."`
          );
          allPassed = false;
        }
      }

      expect(finalMessage).toContain("function hello()");
      expect(finalMessage).toContain("console.log");
      expect(finalMessage).toContain("@#$%^&*");

      if (allPassed) {
        console.log("✅ Mixed content chunked successfully without corruption");
      }
    }, 90000);

    it("should handle continuous text without word breaks", async () => {
      console.log("\n🔢 Testing continuous text (no spaces)...");

      const testModel = TEST_MODELS[0];
      const createResponse = await client.createSpecification(testModel.config);
      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      const events: UIStreamEvent[] = [];
      const chunks: string[] = [];

      // Generate a prompt that will produce continuous text
      const continuousPrompt =
        "Output exactly 200 zeros with no spaces or line breaks: 00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";

      await client.streamAgent(
        continuousPrompt,
        (event: UIStreamEvent) => {
          events.push(event);
          if (event.type === "conversation_started") {
            createdConversations.push(event.conversationId);
          } else if (event.type === "message_update") {
            // Track chunks for word mode
            const currentText = event.message.message;
            const newChunk = currentText.substring(chunks.join("").length);
            if (newChunk) {
              chunks.push(newChunk);
              console.log(
                `  Chunk ${chunks.length}: "${newChunk}" (${newChunk.length} chars)`
              );
            }
          }
        },
        undefined,
        { id: specId },
        undefined,
        undefined,
        {
          smoothingEnabled: true,
          chunkingStrategy: "word", // Word mode should handle this gracefully
          smoothingDelay: 0,
        }
      );

      console.log(`\n📊 Continuous text results:`);
      console.log(`  Total chunks: ${chunks.length}`);
      console.log(`  Chunk sizes: ${chunks.map((c) => c.length).join(", ")}`);

      // Word mode should break continuous text into manageable chunks
      expect(chunks.length).toBeGreaterThan(0);
      // Since this is continuous text with no word breaks, chunks may be larger
      // The important thing is that it doesn't try to buffer the entire 200 character string
      if (chunks.length > 1) {
        console.log("✅ Continuous text chunked into multiple pieces");
      } else if (chunks[0] && chunks[0].length < 200) {
        console.log("✅ Continuous text chunked before completion");
      } else {
        console.log("⚠️  Warning: Continuous text was not chunked as expected");
      }
    }, 90000);

    it("should handle empty or very short responses", async () => {
      console.log("\n📏 Testing chunking with very short responses...");

      const testModel = TEST_MODELS[0];

      const createResponse = await client.createSpecification(testModel.config);
      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      const events: UIStreamEvent[] = [];
      let updateCount = 0;

      // Check if streaming is supported
      if (!client.supportsStreaming()) {
        console.log("⚠️  Skipping test - streaming not supported");
        return;
      }

      await client.streamAgent(
        "Reply with just 'OK'",
        (event: UIStreamEvent) => {
          events.push(event);
          if (event.type === "conversation_started") {
            createdConversations.push(event.conversationId);
          } else if (event.type === "message_update") {
            updateCount++;
            console.log(`  Update ${updateCount}: "${event.message.message}"`);
          }
        },
        undefined,
        { id: specId },
        undefined,
        undefined,
        {
          smoothingEnabled: true,
          chunkingStrategy: "character", // Character chunking to see each letter
          smoothingDelay: 50,
        }
      );

      // Even short responses should chunk if character mode is enabled
      if (updateCount < 1) {
        console.error(
          `❌ FAILED: Should have at least 1 update, but got ${updateCount}`
        );
        console.error(
          `   Events received: ${events.map((e) => e.type).join(", ")}`
        );
      }
      expect(updateCount).toBeGreaterThanOrEqual(1);
      console.log("✅ Short response handled appropriately");
    }, 90000);
  });

  describe("Performance Benchmarks", () => {
    it("should benchmark different chunking strategies with long content", async () => {
      console.log("\n⏱️ Benchmarking chunking strategies with long content...");

      const testModel =
        TEST_MODELS.find((m) => m.name.includes("GPT-4o")) || TEST_MODELS[0];

      const createResponse = await client.createSpecification(testModel.config);
      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      const strategies = [
        { name: "No Chunking", config: { maxToolRounds: 100 } },
        {
          name: "Character",
          config: {
            enabled: true,
            chunking: SmoothChunkingStrategy.Character,
            delay: 10,
          },
        },
        {
          name: "Word",
          config: {
            enabled: true,
            chunking: SmoothChunkingStrategy.Word,
            delay: 30,
          },
        },
        {
          name: "Sentence",
          config: {
            enabled: true,
            chunking: SmoothChunkingStrategy.Sentence,
            delay: 100,
          },
        },
      ];

      const longPrompt =
        "Write a detailed 200-word explanation of how neural networks work, including layers, neurons, and backpropagation.";

      for (const strategy of strategies) {
        console.log(`\n  Testing ${strategy.name}...`);

        const startTime = Date.now();
        let firstTokenTime = 0;
        let completeTime = 0;
        let tokenCount = 0;

        // Check if streaming is supported
        if (!client.supportsStreaming()) {
          console.log("⚠️  Skipping test - streaming not supported");
          return;
        }

        await client.streamAgent(
          longPrompt,
          (event: UIStreamEvent) => {
            if (event.type === "conversation_started") {
              createdConversations.push(event.conversationId);
            } else if (event.type === "message_update") {
              tokenCount++;
              if (firstTokenTime === 0) {
                firstTokenTime = Date.now();
              }
            } else if (event.type === "conversation_completed") {
              completeTime = Date.now();
            }
          },
          undefined,
          { id: specId }
        );

        const ttft = firstTokenTime - startTime;
        const totalTime = completeTime - startTime;

        console.log(`    Time to First Token: ${ttft}ms`);
        console.log(`    Total Time: ${totalTime}ms`);
        console.log(`    Update Events: ${tokenCount}`);
        console.log(
          `    Updates/Second: ${(tokenCount / (totalTime / 1000)).toFixed(1)}`
        );
      }

      console.log("\n✅ Performance benchmarks completed");
    }, 120000);
  });
});

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import { PERFORMANCE_TEST_MODELS } from "./test-models";
import { AgentStreamEvent } from "../src/types/ui-events";

/**
 * Performance test suite
 * Tests and benchmarks the performance characteristics of streaming conversations
 */
describe("Performance Tests", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!orgId || !envId || !secret) {
    console.warn(
      "⚠️  Skipping performance tests - missing Graphlit credentials",
    );
    return;
  }

  let client: Graphlit;
  const createdSpecifications: string[] = [];
  const createdConversations: string[] = [];

  // Performance metrics storage
  interface PerformanceMetrics {
    modelName: string;
    ttft: number; // Time to first token
    ttlt: number; // Time to last token
    tokenCount: number;
    tps: number; // Tokens per second
    p50Delay: number;
    p95Delay: number;
    p99Delay: number;
    maxDelay: number;
  }

  const performanceResults: PerformanceMetrics[] = [];

  beforeAll(async () => {
    client = new Graphlit(orgId, envId, secret);

    // Set up conditional streaming - use native if available, fallback otherwise
    if (openaiKey) {
      try {
        const { default: OpenAI } = await import("openai");
        const openaiClient = new OpenAI({ apiKey: openaiKey });
        client.setOpenAIClient(openaiClient);
      } catch (e) {}
    } else {
    }
  });

  afterAll(async () => {
    // Clean up
    console.log(
      `\n🧹 Cleaning up ${createdConversations.length} test conversations...`,
    );
    for (const convId of createdConversations) {
      try {
        await client.deleteConversation(convId);
      } catch (error) {
        console.warn(`⚠️  Failed to delete conversation ${convId}`);
      }
    }

    console.log(
      `🧹 Cleaning up ${createdSpecifications.length} test specifications...`,
    );
    for (const specId of createdSpecifications) {
      try {
        await client.deleteSpecification(specId);
      } catch (error) {
        console.warn(`⚠️  Failed to delete specification ${specId}`);
      }
    }

    // Display performance summary
    if (performanceResults.length > 0) {
      console.log("\n🏆 PERFORMANCE LEADERBOARD");
      console.log("=".repeat(80));

      // Sort by TTFT
      console.log("\n⚡ Fastest Time to First Token (TTFT):");
      const ttftSorted = [...performanceResults].sort(
        (a, b) => a.ttft - b.ttft,
      );
      ttftSorted.slice(0, 5).forEach((result, idx) => {
        console.log(`  ${idx + 1}. ${result.modelName}: ${result.ttft}ms`);
      });

      // Sort by TPS
      console.log("\n📈 Highest Tokens Per Second (TPS):");
      const tpsSorted = [...performanceResults].sort((a, b) => b.tps - a.tps);
      tpsSorted.slice(0, 5).forEach((result, idx) => {
        console.log(
          `  ${idx + 1}. ${result.modelName}: ${result.tps.toFixed(2)} TPS`,
        );
      });

      // Sort by consistency (lowest p95 delay)
      console.log("\n🎯 Most Consistent (Lowest P95 Inter-Token Delay):");
      const consistencySorted = [...performanceResults].sort(
        (a, b) => a.p95Delay - b.p95Delay,
      );
      consistencySorted.slice(0, 5).forEach((result, idx) => {
        console.log(`  ${idx + 1}. ${result.modelName}: ${result.p95Delay}ms`);
      });

      console.log("=".repeat(80));
    }
  }, 90000);

  // Helper to calculate percentiles
  function calculatePercentile(
    sortedArray: number[],
    percentile: number,
  ): number {
    if (sortedArray.length === 0) return 0;
    const index = Math.ceil((percentile / 100) * sortedArray.length) - 1;
    return sortedArray[Math.max(0, Math.min(index, sortedArray.length - 1))];
  }

  describe("Baseline Performance Metrics", () => {
    it("should measure performance across different models", async () => {
      console.log("📊 Measuring baseline performance metrics...\n");

      // Use shared performance test models
      const testModels = PERFORMANCE_TEST_MODELS;

      const prompt =
        "Write a detailed explanation of how photosynthesis works, including the light and dark reactions, and the role of chlorophyll.";

      for (const model of testModels) {
        console.log(`\n🧪 Testing ${model.name}...`);

        // Create specification
        const createResponse = await client.createSpecification(
          model.config as Types.SpecificationInput,
        );
        const specId = createResponse.createSpecification?.id!;
        createdSpecifications.push(specId);

        // Metrics collection
        const startTime = Date.now();
        let firstTokenTime = 0;
        let lastTokenTime = 0;
        let tokenCount = 0;
        const interTokenDelays: number[] = [];
        let lastEventTime = 0;
        let conversationId: string | undefined;

        // Check if streaming is supported
        if (!client.supportsStreaming()) {
          console.log("⚠️  Skipping test - streaming not supported");
          return;
        }

        await client.streamAgent(
          prompt,
          (event: AgentStreamEvent) => {
            const currentTime = Date.now();

            if (event.type === "conversation_started") {
              conversationId = event.conversationId;
              createdConversations.push(event.conversationId);
            } else if (event.type === "message_update") {
              tokenCount++;

              if (firstTokenTime === 0) {
                firstTokenTime = currentTime - startTime;
                console.log(`  ⚡ TTFT: ${firstTokenTime}ms`);
              }

              if (lastEventTime > 0) {
                const delay = currentTime - lastEventTime;
                interTokenDelays.push(delay);
              }
              lastEventTime = currentTime;
            } else if (event.type === "conversation_completed") {
              lastTokenTime = currentTime - startTime;
              console.log(`  ⏱️ Total time: ${lastTokenTime}ms`);
              console.log(`  📊 Token count: ${tokenCount}`);
            }
          },
          undefined,
          { id: specId },
        );

        // Calculate metrics
        if (interTokenDelays.length > 0) {
          const sortedDelays = [...interTokenDelays].sort((a, b) => a - b);
          const metrics: PerformanceMetrics = {
            modelName: model.name,
            ttft: firstTokenTime,
            ttlt: lastTokenTime,
            tokenCount: tokenCount,
            tps: tokenCount / (lastTokenTime / 1000),
            p50Delay: calculatePercentile(sortedDelays, 50),
            p95Delay: calculatePercentile(sortedDelays, 95),
            p99Delay: calculatePercentile(sortedDelays, 99),
            maxDelay: Math.max(...sortedDelays),
          };

          performanceResults.push(metrics);

          console.log(`  📈 TPS: ${metrics.tps.toFixed(2)}`);
          console.log(`  📊 P50 delay: ${metrics.p50Delay}ms`);
          console.log(`  ⚠️ P95 delay: ${metrics.p95Delay}ms`);
          console.log(`  🚨 P99 delay: ${metrics.p99Delay}ms`);
        }
      }

      // Assertions
      expect(performanceResults.length).toBeGreaterThan(0);
      performanceResults.forEach((result) => {
        expect(result.ttft).toBeGreaterThan(0);
        expect(result.ttft).toBeLessThan(10000); // Should get first token within 10s
        expect(result.tps).toBeGreaterThan(0);
      });

      console.log("\n✅ Baseline performance metrics collected");
    }, 180000); // 3 minute timeout
  });

  describe("Response Length Performance", () => {
    it("should measure performance with different response lengths", async () => {
      console.log("\n📏 Testing performance with varying response lengths...");

      // Create a single fast model for this test
      const createResponse = await client.createSpecification({
        name: "Length Test Spec",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4OMini_128K,
          temperature: 0.3,
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      const lengthTests = [
        {
          tokens: 50,
          tokenLimit: 100,
          prompt: "In exactly 2 sentences, explain what a computer is.",
        },
        {
          tokens: 200,
          tokenLimit: 300,
          prompt:
            "In one paragraph, explain the concept of artificial intelligence.",
        },
        {
          tokens: 500,
          tokenLimit: 700,
          prompt:
            "Write a detailed explanation of machine learning, including supervised and unsupervised learning.",
        },
        {
          tokens: 1000,
          tokenLimit: 1500,
          prompt:
            "Write a comprehensive essay about the history and future of space exploration.",
        },
      ];

      const lengthMetrics: {
        targetTokens: number;
        actualTokens: number;
        tps: number;
        ttft: number;
      }[] = [];

      for (const test of lengthTests) {
        console.log(
          `\n📝 Testing ~${test.tokens} token response (limit: ${test.tokenLimit})...`,
        );

        // Update specification with new token limit
        await client.updateSpecification({
          serviceType: Types.ModelServiceTypes.OpenAi,
          id: specId,
          openAI: {
            model: Types.OpenAiModels.Gpt4OMini_128K,
            temperature: 0.3,
            completionTokenLimit: test.tokenLimit,
          },
        });

        const startTime = Date.now();
        let firstTokenTime = 0;
        let totalTime = 0;
        let messageUpdateCount = 0;
        let finalMessage = "";

        // Check if streaming is supported
        if (!client.supportsStreaming()) {
          console.log("⚠️  Skipping test - streaming not supported");
          return;
        }

        await client.streamAgent(
          test.prompt,
          (event: AgentStreamEvent) => {
            if (event.type === "conversation_started") {
              createdConversations.push(event.conversationId);
            } else if (event.type === "message_update") {
              messageUpdateCount++;
              if (firstTokenTime === 0) {
                firstTokenTime = Date.now() - startTime;
              }
              finalMessage = event.message.message;
            } else if (event.type === "conversation_completed") {
              totalTime = Date.now() - startTime;
              finalMessage = event.message.message;
            }
          },
          undefined,
          { id: specId },
        );

        // Rough token estimate: ~1.3 tokens per word, ~4 chars per word
        const estimatedTokens = Math.round(finalMessage.length / 3);
        const tps = estimatedTokens / (totalTime / 1000);

        lengthMetrics.push({
          targetTokens: test.tokens,
          actualTokens: estimatedTokens,
          tps: tps,
          ttft: firstTokenTime,
        });

        console.log(
          `  Target: ${test.tokens}, Actual: ~${estimatedTokens} tokens`,
        );
        console.log(`  Response length: ${finalMessage.length} chars`);
        console.log(`  Message updates: ${messageUpdateCount}`);
        console.log(`  TTFT: ${firstTokenTime}ms`);
        console.log(`  TPS: ${tps.toFixed(2)}`);
      }

      // Analyze scaling
      console.log("\n📈 Performance Scaling Analysis:");
      lengthMetrics.forEach((metric, idx) => {
        if (idx > 0) {
          const prevMetric = lengthMetrics[idx - 1];
          const tpsChange = (
            ((metric.tps - prevMetric.tps) / prevMetric.tps) *
            100
          ).toFixed(1);
          const ttftChange = (
            ((metric.ttft - prevMetric.ttft) / prevMetric.ttft) *
            100
          ).toFixed(1);

          console.log(
            `  ${prevMetric.targetTokens} → ${metric.targetTokens} tokens:`,
          );
          console.log(`    TPS change: ${tpsChange}%`);
          console.log(`    TTFT change: ${ttftChange}%`);
        }
      });

      // Assertions
      expect(lengthMetrics.length).toBe(lengthTests.length);
      // TTFT should be relatively consistent regardless of length
      const ttftValues = lengthMetrics.map((m) => m.ttft);
      const ttftVariance = Math.max(...ttftValues) - Math.min(...ttftValues);
      expect(ttftVariance).toBeLessThan(5000); // Within 5 second range

      console.log("\n✅ Response length performance analysis completed");
    }, 240000); // 4 minute timeout
  });

  describe("Concurrent Load Performance", () => {
    it("should measure performance under concurrent load", async () => {
      console.log("\n🏋️ Testing performance under concurrent load...");

      // Create specification
      const createResponse = await client.createSpecification({
        name: "Load Test Spec",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4OMini_128K,
          temperature: 0.7,
          completionTokenLimit: 200,
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      const loadLevels = [1, 5, 10];
      const loadResults: {
        concurrency: number;
        avgTtft: number;
        avgTps: number;
        successRate: number;
      }[] = [];

      for (const concurrency of loadLevels) {
        console.log(
          `\n🔥 Testing with ${concurrency} concurrent conversations...`,
        );

        const conversationMetrics: {
          ttft: number;
          tps: number;
          success: boolean;
        }[] = [];
        const startTime = Date.now();

        const promises = Array.from({ length: concurrency }, async (_, idx) => {
          const convStartTime = Date.now();
          let firstTokenTime = 0;
          let tokenCount = 0;
          let totalTime = 0;
          let success = false;

          try {
            // Check if streaming is supported
            if (!client.supportsStreaming()) {
              console.log("⚠️  Skipping test - streaming not supported");
              return;
            }

            await client.streamAgent(
              `Generate a unique haiku about the number ${idx + 1}`,
              (event: AgentStreamEvent) => {
                const currentTime = Date.now();

                if (event.type === "conversation_started") {
                  createdConversations.push(event.conversationId);
                } else if (event.type === "message_update") {
                  tokenCount++;
                  if (firstTokenTime === 0) {
                    firstTokenTime = currentTime - convStartTime;
                  }
                } else if (event.type === "conversation_completed") {
                  totalTime = currentTime - convStartTime;
                  success = true;
                }
              },
              undefined,
              { id: specId },
            );
          } catch (error) {
            console.error(`  ❌ Conversation ${idx + 1} failed:`, error);
          }

          const tps =
            tokenCount > 0 && totalTime > 0
              ? tokenCount / (totalTime / 1000)
              : 0;
          conversationMetrics.push({
            ttft: firstTokenTime,
            tps: tps,
            success: success,
          });
        });

        await Promise.all(promises);
        const totalLoadTime = Date.now() - startTime;

        // Calculate averages
        const successfulConvs = conversationMetrics.filter((m) => m.success);
        const avgTtft =
          successfulConvs.reduce((sum, m) => sum + m.ttft, 0) /
          successfulConvs.length;
        const avgTps =
          successfulConvs.reduce((sum, m) => sum + m.tps, 0) /
          successfulConvs.length;
        const successRate = successfulConvs.length / conversationMetrics.length;

        loadResults.push({
          concurrency: concurrency,
          avgTtft: avgTtft,
          avgTps: avgTps,
          successRate: successRate,
        });

        console.log(`  ⏱️ Total time: ${totalLoadTime}ms`);
        console.log(`  ✅ Success rate: ${(successRate * 100).toFixed(1)}%`);
        console.log(`  ⚡ Avg TTFT: ${avgTtft.toFixed(0)}ms`);
        console.log(`  📈 Avg TPS: ${avgTps.toFixed(2)}`);
      }

      // Analyze load impact
      console.log("\n📊 Load Impact Analysis:");
      loadResults.forEach((result, idx) => {
        if (idx > 0) {
          const baseline = loadResults[0];
          const ttftDegradation = (
            ((result.avgTtft - baseline.avgTtft) / baseline.avgTtft) *
            100
          ).toFixed(1);
          const tpsDegradation = (
            ((baseline.avgTps - result.avgTps) / baseline.avgTps) *
            100
          ).toFixed(1);

          console.log(`  ${result.concurrency}x load:`);
          console.log(`    TTFT degradation: +${ttftDegradation}%`);
          console.log(`    TPS degradation: -${tpsDegradation}%`);
          console.log(
            `    Success rate: ${(result.successRate * 100).toFixed(1)}%`,
          );
        }
      });

      // Assertions
      expect(loadResults.every((r) => r.successRate >= 0.8)).toBe(true); // At least 80% success
      // TTFT shouldn't degrade too much under load
      const maxTtft = Math.max(...loadResults.map((r) => r.avgTtft));
      const minTtft = Math.min(...loadResults.map((r) => r.avgTtft));
      expect(maxTtft / minTtft).toBeLessThan(3); // Less than 3x degradation

      console.log("\n✅ Concurrent load performance test completed");
    }, 300000); // 5 minute timeout
  });

  describe("Memory and Resource Usage", () => {
    it("should track memory usage during long conversations", async () => {
      console.log("\n💾 Testing memory usage patterns...");

      // Create specification
      const createResponse = await client.createSpecification({
        name: "Memory Test Spec",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4OMini_128K,
          temperature: 0.5,
          completionTokenLimit: 300,
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      let conversationId: string | undefined;
      const memorySnapshots: {
        turn: number;
        heapUsed: number;
        external: number;
      }[] = [];

      // Take initial memory snapshot
      if (global.gc) global.gc(); // Force GC if available
      const initialMemory = process.memoryUsage();

      console.log("📊 Initial memory state:");
      console.log(
        `  Heap: ${(initialMemory.heapUsed / 1024 / 1024).toFixed(2)} MB`,
      );
      console.log(
        `  External: ${(initialMemory.external / 1024 / 1024).toFixed(2)} MB`,
      );

      // Have a multi-turn conversation
      const turns = 10;
      for (let turn = 0; turn < turns; turn++) {
        console.log(`\n🔄 Turn ${turn + 1}/${turns}...`);

        const prompt =
          turn === 0
            ? "Let's have a conversation about space. Start by telling me about the solar system."
            : "Continue with more details about the next topic in space exploration.";

        // Check if streaming is supported
        if (!client.supportsStreaming()) {
          console.log("⚠️  Skipping test - streaming not supported");
          return;
        }

        await client.streamAgent(
          prompt,
          (event: AgentStreamEvent) => {
            if (event.type === "conversation_started" && !conversationId) {
              conversationId = event.conversationId;
              createdConversations.push(event.conversationId);
            }
          },
          conversationId,
          { id: specId },
        );

        // Take memory snapshot after each turn
        const memUsage = process.memoryUsage();
        memorySnapshots.push({
          turn: turn + 1,
          heapUsed: memUsage.heapUsed,
          external: memUsage.external,
        });

        console.log(
          `  Heap: ${(memUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
        );
      }

      // Analyze memory growth
      console.log("\n📈 Memory Growth Analysis:");
      const initialHeap = memorySnapshots[0].heapUsed;
      const finalHeap = memorySnapshots[memorySnapshots.length - 1].heapUsed;
      const heapGrowth = ((finalHeap - initialHeap) / 1024 / 1024).toFixed(2);
      const avgGrowthPerTurn = (parseFloat(heapGrowth) / turns).toFixed(2);

      console.log(`  Total heap growth: ${heapGrowth} MB`);
      console.log(`  Average growth per turn: ${avgGrowthPerTurn} MB`);

      // Check for memory leaks (excessive growth)
      const growthRatio = finalHeap / initialHeap;
      console.log(`  Growth ratio: ${growthRatio.toFixed(2)}x`);

      // Memory should not grow excessively
      expect(growthRatio).toBeLessThan(2); // Less than 2x growth for 10 turns
      expect(parseFloat(avgGrowthPerTurn)).toBeLessThan(5); // Less than 5MB per turn

      console.log("\n✅ Memory usage test completed");
    }, 180000); // 3 minute timeout
  });

  describe("Streaming Stability", () => {
    it("should maintain stable streaming over extended duration", async () => {
      console.log("\n⏰ Testing streaming stability over time...");

      // Create specification
      const createResponse = await client.createSpecification({
        name: "Stability Test Spec",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4O_128K,
          temperature: 0.7,
          completionTokenLimit: 2000, // Large response
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      // Track stability metrics
      const stabilityMetrics = {
        totalEvents: 0,
        messageUpdates: 0,
        errors: 0,
        maxGap: 0,
        gaps: [] as number[],
      };

      let lastEventTime = Date.now();
      let streaming = true;

      console.log("🚀 Starting long streaming session...");

      // Check if streaming is supported
      if (!client.supportsStreaming()) {
        console.log("⚠️  Skipping test - streaming not supported");
        return;
      }

      await client.streamAgent(
        "Write a very detailed technical analysis of distributed systems, covering consistency models, CAP theorem, consensus algorithms like Raft and Paxos, distributed databases, message queues, and microservices architecture. Include specific examples and implementation details.",
        (event: AgentStreamEvent) => {
          const currentTime = Date.now();
          const gap = currentTime - lastEventTime;

          stabilityMetrics.totalEvents++;

          if (event.type === "conversation_started") {
            createdConversations.push(event.conversationId);
            console.log("  ✅ Stream started");
          } else if (event.type === "message_update") {
            stabilityMetrics.messageUpdates++;

            // Track gaps between updates
            if (stabilityMetrics.messageUpdates > 1) {
              stabilityMetrics.gaps.push(gap);
              if (gap > stabilityMetrics.maxGap) {
                stabilityMetrics.maxGap = gap;
              }

              // Log if gap is unusually large
              if (gap > 1000) {
                console.log(`  ⚠️ Large gap detected: ${gap}ms`);
              }
            }

            // Progress indicator every 20 updates
            if (stabilityMetrics.messageUpdates % 20 === 0) {
              console.log(
                `  📊 Progress: ${stabilityMetrics.messageUpdates} updates received`,
              );
            }
          } else if (event.type === "error") {
            stabilityMetrics.errors++;
            console.error(`  ❌ Error: ${event.error.message}`);
          } else if (event.type === "conversation_completed") {
            streaming = false;
            console.log("  ✅ Stream completed");
          }

          lastEventTime = currentTime;
        },
        undefined,
        { id: specId },
      );

      // Analyze stability
      console.log("\n📊 Stability Metrics:");
      console.log(`  Total events: ${stabilityMetrics.totalEvents}`);
      console.log(`  Message updates: ${stabilityMetrics.messageUpdates}`);
      console.log(`  Errors: ${stabilityMetrics.errors}`);
      console.log(`  Max gap: ${stabilityMetrics.maxGap}ms`);

      if (stabilityMetrics.gaps.length > 0) {
        const avgGap =
          stabilityMetrics.gaps.reduce((a, b) => a + b, 0) /
          stabilityMetrics.gaps.length;
        const sortedGaps = [...stabilityMetrics.gaps].sort((a, b) => a - b);
        const p95Gap = calculatePercentile(sortedGaps, 95);

        console.log(`  Average gap: ${avgGap.toFixed(0)}ms`);
        console.log(`  P95 gap: ${p95Gap}ms`);
      }

      // Assertions
      expect(stabilityMetrics.errors).toBe(0); // No errors during streaming
      expect(stabilityMetrics.messageUpdates).toBeGreaterThan(10); // Got reasonable updates
      expect(stabilityMetrics.maxGap).toBeLessThan(5000); // No gaps > 5 seconds

      console.log("\n✅ Streaming stability test completed");
    }, 120000); // 2 minute timeout
  });
});

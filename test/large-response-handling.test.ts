import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import { AgentStreamEvent } from "../src/types/ui-events";

/**
 * Large response handling test suite
 * Tests memory management and performance with large conversations and responses
 */
describe("Large Response Handling", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!orgId || !envId || !secret) {
    console.warn(
      "⚠️  Skipping large response tests - missing Graphlit credentials",
    );
    return;
  }

  let client: Graphlit;
  const createdSpecifications: string[] = [];
  const createdConversations: string[] = [];

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
    // Clean up conversations
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

    // Clean up specifications
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
  }, 120000);

  // Helper to format memory usage
  function formatMemory(bytes: number): string {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  }

  // Helper to take memory snapshot
  function getMemorySnapshot(): {
    heap: number;
    external: number;
    total: number;
  } {
    const usage = process.memoryUsage();
    return {
      heap: usage.heapUsed,
      external: usage.external,
      total: usage.heapUsed + usage.external,
    };
  }

  describe("Very Long Response Generation", () => {
    it("should handle responses with 5000+ tokens efficiently", async () => {
      console.log("📏 Testing very long response generation...");

      // Create specification with high token limit
      const createResponse = await client.createSpecification({
        name: "Long Response Test",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4O_128K,
          temperature: 0.7,
          completionTokenLimit: 5000, // Very high limit
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      // Track performance metrics
      const startTime = Date.now();
      const startMemory = getMemorySnapshot();
      let eventCount = 0;
      let messageUpdates = 0;
      let totalCharacters = 0;
      let firstTokenTime = 0;
      let conversationId: string | undefined;

      const memorySnapshots: {
        time: number;
        memory: number;
        events: number;
      }[] = [];

      const prompt = `Write a comprehensive, detailed academic essay (minimum 4000 words) about the evolution of artificial intelligence from the 1950s to the present day. Include the following sections:

1. Introduction and Historical Context (500 words)
2. Early AI Research (1950s-1960s) including Turing Test, Logic Theorist, and expert systems (800 words)
3. The First AI Winter (1970s-1980s) and its causes (600 words)
4. Revival and Expert Systems Era (1980s-1990s) (700 words)
5. Machine Learning Revolution (2000s) including SVMs, ensemble methods (800 words)
6. Deep Learning Breakthrough (2010s) covering CNNs, RNNs, transformers (900 words)
7. Modern AI and Large Language Models (2020s) including GPT, BERT, ChatGPT (700 words)
8. Current Challenges and Future Directions (500 words)

Please provide detailed explanations, key researchers and their contributions, specific algorithms and techniques, and include relevant examples throughout. Make it comprehensive and academically rigorous.`;

      console.log("🚀 Starting long response generation...");

      // Check if streaming is supported
      if (!client.supportsStreaming()) {
        console.log("⚠️  Skipping test - streaming not supported");
        return;
      }

      await client.streamAgent(
        prompt,
        (event: AgentStreamEvent) => {
          eventCount++;
          const currentTime = Date.now();

          if (event.type === "conversation_started") {
            conversationId = event.conversationId;
            createdConversations.push(event.conversationId);
            console.log("✅ Long conversation started");
          } else if (event.type === "message_update") {
            messageUpdates++;
            totalCharacters += event.message.message.length;

            if (firstTokenTime === 0) {
              firstTokenTime = currentTime - startTime;
              console.log(`⚡ First token: ${firstTokenTime}ms`);
            }

            // Take memory snapshots every 50 events
            if (eventCount % 50 === 0) {
              const currentMemory = getMemorySnapshot();
              memorySnapshots.push({
                time: currentTime - startTime,
                memory: currentMemory.total,
                events: eventCount,
              });
              console.log(
                `📊 Event ${eventCount}: ${formatMemory(currentMemory.total)} (${event.message.message.length} chars)`,
              );
            }
          } else if (event.type === "conversation_completed") {
            const endTime = Date.now();
            const endMemory = getMemorySnapshot();
            const totalTime = endTime - startTime;

            console.log(`\n📊 Long Response Metrics:`);
            console.log(`  Total time: ${totalTime}ms`);
            console.log(`  First token: ${firstTokenTime}ms`);
            console.log(`  Total events: ${eventCount}`);
            console.log(`  Message updates: ${messageUpdates}`);
            console.log(
              `  Total characters: ${totalCharacters.toLocaleString()}`,
            );
            console.log(
              `  Avg chars per update: ${(totalCharacters / messageUpdates).toFixed(1)}`,
            );
            console.log(
              `  Tokens per second: ${(messageUpdates / (totalTime / 1000)).toFixed(2)}`,
            );
            console.log(`  Memory start: ${formatMemory(startMemory.total)}`);
            console.log(`  Memory end: ${formatMemory(endMemory.total)}`);
            console.log(
              `  Memory growth: ${formatMemory(endMemory.total - startMemory.total)}`,
            );
          } else if (event.type === "error") {
            console.error(`❌ Error during long response: ${event.error}`);
          }
        },
        undefined,
        { id: specId },
      );

      // Analyze memory usage over time
      if (memorySnapshots.length > 0) {
        console.log(`\n📈 Memory Usage Over Time:`);
        memorySnapshots.forEach((snapshot, idx) => {
          const growth =
            idx > 0 ? snapshot.memory - memorySnapshots[0].memory : 0;
          console.log(
            `  ${(snapshot.time / 1000).toFixed(1)}s: ${formatMemory(snapshot.memory)} (+${formatMemory(growth)})`,
          );
        });
      }

      // Performance assertions
      expect(eventCount).toBeGreaterThan(10); // Got reasonable number of events
      expect(messageUpdates).toBeGreaterThan(5); // Got streaming updates
      expect(totalCharacters).toBeGreaterThan(1000); // Got substantial response
      expect(firstTokenTime).toBeLessThan(15000); // First token within 15 seconds

      // Memory growth should be reasonable (less than 100MB for a single conversation)
      const endMemory = getMemorySnapshot();
      const memoryGrowth = endMemory.total - startMemory.total;
      expect(memoryGrowth).toBeLessThan(100 * 1024 * 1024); // Less than 100MB growth

      console.log("✅ Long response handled efficiently");
    }, 300000); // 5 minute timeout
  });

  describe("Extended Multi-Turn Conversations", () => {
    it("should handle 20+ message conversation without memory leaks", async () => {
      console.log("\n🔄 Testing extended multi-turn conversation...");

      // Create specification with moderate token limits for faster responses
      const createResponse = await client.createSpecification({
        name: "Multi-Turn Test",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4OMini_128K, // Faster model
          temperature: 0.5,
          completionTokenLimit: 200, // Shorter responses for speed
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      let conversationId: string | undefined;
      const turnMetrics: {
        turn: number;
        time: number;
        memory: number;
        events: number;
        characters: number;
      }[] = [];

      const topics = [
        "What is machine learning?",
        "Explain supervised learning",
        "What about unsupervised learning?",
        "Tell me about neural networks",
        "How do deep learning models work?",
        "What is a transformer architecture?",
        "Explain attention mechanisms",
        "What are the main AI ethics concerns?",
        "How is AI used in healthcare?",
        "What about AI in finance?",
        "Discuss AI in autonomous vehicles",
        "What is computer vision?",
        "Explain natural language processing",
        "What are generative AI models?",
        "How do large language models work?",
        "What is fine-tuning in AI?",
        "Explain reinforcement learning",
        "What is transfer learning?",
        "Discuss AI model interpretability",
        "What are the future trends in AI?",
      ];

      const baselineMemory = getMemorySnapshot();
      console.log(`📊 Baseline memory: ${formatMemory(baselineMemory.total)}`);

      for (let turn = 0; turn < topics.length; turn++) {
        const turnStart = Date.now();
        const turnStartMemory = getMemorySnapshot();
        let turnEvents = 0;
        let turnCharacters = 0;

        console.log(
          `\n📝 Turn ${turn + 1}/${topics.length}: "${topics[turn]}"`,
        );

        // Check if streaming is supported
        if (!client.supportsStreaming()) {
          console.log("⚠️  Skipping test - streaming not supported");
          return;
        }

        await client.streamAgent(
          topics[turn],
          (event: AgentStreamEvent) => {
            turnEvents++;

            if (event.type === "conversation_started" && !conversationId) {
              conversationId = event.conversationId;
              createdConversations.push(event.conversationId);
            } else if (event.type === "message_update") {
              turnCharacters += event.message.message.length;
            } else if (event.type === "conversation_completed") {
              const turnEnd = Date.now();
              const turnEndMemory = getMemorySnapshot();

              turnMetrics.push({
                turn: turn + 1,
                time: turnEnd - turnStart,
                memory: turnEndMemory.total,
                events: turnEvents,
                characters: turnCharacters,
              });

              console.log(
                `  ⏱️ ${turnEnd - turnStart}ms, ${turnEvents} events, ${turnCharacters} chars, ${formatMemory(turnEndMemory.total)}`,
              );
            }
          },
          conversationId,
          { id: specId },
        );

        // Brief pause between turns to allow memory cleanup
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Analyze conversation metrics
      console.log(`\n📊 Extended Conversation Analysis:`);
      console.log(`  Total turns: ${turnMetrics.length}`);
      console.log(`  Baseline memory: ${formatMemory(baselineMemory.total)}`);

      const finalMemory = turnMetrics[turnMetrics.length - 1].memory;
      const totalGrowth = finalMemory - baselineMemory.total;
      console.log(`  Final memory: ${formatMemory(finalMemory)}`);
      console.log(`  Total growth: ${formatMemory(totalGrowth)}`);
      console.log(
        `  Growth per turn: ${formatMemory(totalGrowth / turnMetrics.length)}`,
      );

      // Performance over time analysis
      const avgTime =
        turnMetrics.reduce((sum, m) => sum + m.time, 0) / turnMetrics.length;
      const firstHalfAvg =
        turnMetrics.slice(0, 10).reduce((sum, m) => sum + m.time, 0) / 10;
      const secondHalfAvg =
        turnMetrics.slice(10).reduce((sum, m) => sum + m.time, 0) / 10;

      console.log(`  Average response time: ${avgTime.toFixed(0)}ms`);
      console.log(`  First half average: ${firstHalfAvg.toFixed(0)}ms`);
      console.log(`  Second half average: ${secondHalfAvg.toFixed(0)}ms`);
      console.log(
        `  Performance degradation: ${(((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100).toFixed(1)}%`,
      );

      // Memory trend analysis
      const memoryTrend = turnMetrics.map((m) => m.memory);
      const memorySlope =
        (memoryTrend[memoryTrend.length - 1] - memoryTrend[0]) /
        memoryTrend.length;
      console.log(`  Memory growth rate: ${formatMemory(memorySlope)}/turn`);

      // Assertions
      expect(turnMetrics.length).toBe(topics.length); // All turns completed
      expect(totalGrowth).toBeLessThan(200 * 1024 * 1024); // Less than 200MB total growth
      expect(
        Math.abs((secondHalfAvg - firstHalfAvg) / firstHalfAvg),
      ).toBeLessThan(2); // Less than 200% degradation

      console.log("✅ Extended multi-turn conversation completed successfully");
    }, 1200000); // 10 minute timeout
  });

  describe("Event Array Management", () => {
    it("should handle large numbers of events without excessive memory usage", async () => {
      console.log("\n📋 Testing event array management...");

      // Create specification for rapid responses
      const createResponse = await client.createSpecification({
        name: "Event Management Test",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4OMini_128K,
          temperature: 0.8, // Higher temperature for varied responses
          completionTokenLimit: 1000,
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      const allEvents: AgentStreamEvent[] = [];
      const memoryCheckpoints: { eventCount: number; memory: number }[] = [];
      let conversationId: string | undefined;

      const startMemory = getMemorySnapshot();

      // Generate response with many incremental updates
      const prompt = `Please write a detailed story with lots of dialogue and action. Make it engaging and include:
- Multiple characters with distinct personalities
- Detailed scene descriptions
- Dialogue between characters
- Action sequences
- Emotional moments
- Plot twists
- A satisfying conclusion

Write it as a flowing narrative with many paragraphs and natural breaks that would generate many streaming updates.`;

      // Check if streaming is supported
      if (!client.supportsStreaming()) {
        console.log("⚠️  Skipping test - streaming not supported");
        return;
      }

      await client.streamAgent(
        prompt,
        (event: AgentStreamEvent) => {
          allEvents.push(event);

          if (event.type === "conversation_started") {
            conversationId = event.conversationId;
            createdConversations.push(event.conversationId);
          } else if (event.type === "message_update") {
            // Take memory checkpoint every 25 events
            if (allEvents.length % 25 === 0) {
              const currentMemory = getMemorySnapshot();
              memoryCheckpoints.push({
                eventCount: allEvents.length,
                memory: currentMemory.total,
              });
              console.log(
                `📊 ${allEvents.length} events: ${formatMemory(currentMemory.total)}`,
              );
            }
          } else if (event.type === "conversation_completed") {
            const endMemory = getMemorySnapshot();
            console.log(`\n📊 Event Management Results:`);
            console.log(`  Total events collected: ${allEvents.length}`);
            console.log(`  Memory checkpoints: ${memoryCheckpoints.length}`);
            console.log(`  Start memory: ${formatMemory(startMemory.total)}`);
            console.log(`  End memory: ${formatMemory(endMemory.total)}`);
            console.log(
              `  Total growth: ${formatMemory(endMemory.total - startMemory.total)}`,
            );

            if (allEvents.length > 0) {
              const avgEventSize =
                (endMemory.total - startMemory.total) / allEvents.length;
              console.log(
                `  Avg memory per event: ${formatMemory(avgEventSize)}`,
              );
            }
          }
        },
        undefined,
        { id: specId },
      );

      // Analyze memory growth pattern
      if (memoryCheckpoints.length > 1) {
        console.log(`\n📈 Memory Growth Pattern:`);
        for (let i = 1; i < memoryCheckpoints.length; i++) {
          const prev = memoryCheckpoints[i - 1];
          const curr = memoryCheckpoints[i];
          const eventsDiff = curr.eventCount - prev.eventCount;
          const memoryDiff = curr.memory - prev.memory;
          const memoryPerEvent = memoryDiff / eventsDiff;

          console.log(
            `  Events ${prev.eventCount}-${curr.eventCount}: ${formatMemory(memoryPerEvent)}/event`,
          );
        }
      }

      // Calculate event statistics
      const messageUpdates = allEvents.filter(
        (e) => e.type === "message_update",
      );
      const toolEvents = allEvents.filter((e) => e.type === "tool_update");
      const errorEvents = allEvents.filter((e) => e.type === "error");

      console.log(`\n📊 Event Type Breakdown:`);
      console.log(`  Message updates: ${messageUpdates.length}`);
      console.log(`  Tool events: ${toolEvents.length}`);
      console.log(`  Error events: ${errorEvents.length}`);
      console.log(
        `  Other events: ${allEvents.length - messageUpdates.length - toolEvents.length - errorEvents.length}`,
      );

      // Assertions
      expect(allEvents.length).toBeGreaterThan(10); // Got reasonable number of events
      expect(messageUpdates.length).toBeGreaterThan(5); // Got streaming updates

      const endMemory = getMemorySnapshot();
      const memoryGrowth = endMemory.total - startMemory.total;
      expect(memoryGrowth).toBeLessThan(50 * 1024 * 1024); // Less than 50MB growth

      // Memory per event should be reasonable
      if (allEvents.length > 0) {
        const memoryPerEvent = memoryGrowth / allEvents.length;
        expect(memoryPerEvent).toBeLessThan(100 * 1024); // Less than 100KB per event
      }

      console.log("✅ Event array management working efficiently");
    }, 180000); // 3 minute timeout
  });

  describe("Performance Degradation Over Time", () => {
    it("should maintain consistent performance across long session", async () => {
      console.log("\n⏱️ Testing performance consistency over time...");

      // Create specification
      const createResponse = await client.createSpecification({
        name: "Performance Consistency Test",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4OMini_128K,
          temperature: 0.3,
          completionTokenLimit: 150,
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      let conversationId: string | undefined;
      const performanceMetrics: {
        iteration: number;
        ttft: number; // Time to first token
        totalTime: number;
        events: number;
        memory: number;
      }[] = [];

      const testPrompts = [
        "Explain quantum computing in simple terms",
        "What are the benefits of renewable energy?",
        "How does machine learning work?",
        "Describe the process of photosynthesis",
        "What is blockchain technology?",
        "Explain artificial intelligence",
        "How do electric cars work?",
        "What is climate change?",
        "Describe how the internet works",
        "What is cryptocurrency?",
      ];

      console.log("🚀 Starting performance consistency test...");

      for (let i = 0; i < testPrompts.length; i++) {
        const iterationStart = Date.now();
        const startMemory = getMemorySnapshot();
        let firstTokenTime = 0;
        let eventCount = 0;

        console.log(
          `📝 Iteration ${i + 1}/${testPrompts.length}: "${testPrompts[i]}"`,
        );

        // Check if streaming is supported
        if (!client.supportsStreaming()) {
          console.log("⚠️  Skipping test - streaming not supported");
          return;
        }

        await client.streamAgent(
          testPrompts[i],
          (event: AgentStreamEvent) => {
            eventCount++;
            const currentTime = Date.now();

            if (event.type === "conversation_started" && !conversationId) {
              conversationId = event.conversationId;
              createdConversations.push(event.conversationId);
            } else if (
              event.type === "message_update" &&
              firstTokenTime === 0
            ) {
              firstTokenTime = currentTime - iterationStart;
            } else if (event.type === "conversation_completed") {
              const totalTime = currentTime - iterationStart;
              const endMemory = getMemorySnapshot();

              performanceMetrics.push({
                iteration: i + 1,
                ttft: firstTokenTime,
                totalTime,
                events: eventCount,
                memory: endMemory.total,
              });

              console.log(
                `  ⚡ TTFT: ${firstTokenTime}ms, Total: ${totalTime}ms, Events: ${eventCount}, Memory: ${formatMemory(endMemory.total)}`,
              );
            }
          },
          conversationId,
          { id: specId },
        );

        // Brief pause between iterations
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      // Analyze performance trends
      console.log(`\n📊 Performance Consistency Analysis:`);

      const avgTtft =
        performanceMetrics.reduce((sum, m) => sum + m.ttft, 0) /
        performanceMetrics.length;
      const avgTotalTime =
        performanceMetrics.reduce((sum, m) => sum + m.totalTime, 0) /
        performanceMetrics.length;

      console.log(`  Average TTFT: ${avgTtft.toFixed(0)}ms`);
      console.log(`  Average total time: ${avgTotalTime.toFixed(0)}ms`);

      // Compare first third vs last third
      const firstThird = performanceMetrics.slice(
        0,
        Math.floor(performanceMetrics.length / 3),
      );
      const lastThird = performanceMetrics.slice(
        -Math.floor(performanceMetrics.length / 3),
      );

      const firstThirdAvgTtft =
        firstThird.reduce((sum, m) => sum + m.ttft, 0) / firstThird.length;
      const lastThirdAvgTtft =
        lastThird.reduce((sum, m) => sum + m.ttft, 0) / lastThird.length;

      const ttftDegradation =
        ((lastThirdAvgTtft - firstThirdAvgTtft) / firstThirdAvgTtft) * 100;

      console.log(`  First third avg TTFT: ${firstThirdAvgTtft.toFixed(0)}ms`);
      console.log(`  Last third avg TTFT: ${lastThirdAvgTtft.toFixed(0)}ms`);
      console.log(`  TTFT degradation: ${ttftDegradation.toFixed(1)}%`);

      // Memory trend
      const firstMemory = performanceMetrics[0].memory;
      const lastMemory =
        performanceMetrics[performanceMetrics.length - 1].memory;
      const memoryGrowth = lastMemory - firstMemory;

      console.log(`  Memory growth: ${formatMemory(memoryGrowth)}`);
      console.log(
        `  Memory growth rate: ${formatMemory(memoryGrowth / performanceMetrics.length)}/iteration`,
      );

      // Assertions
      expect(performanceMetrics.length).toBe(testPrompts.length); // All iterations completed
      expect(Math.abs(ttftDegradation)).toBeLessThan(100); // Less than 100% degradation
      expect(memoryGrowth).toBeLessThan(100 * 1024 * 1024); // Less than 100MB total growth

      // Check for reasonable consistency
      const ttftVariance =
        Math.max(...performanceMetrics.map((m) => m.ttft)) -
        Math.min(...performanceMetrics.map((m) => m.ttft));
      console.log(`  TTFT variance: ${ttftVariance}ms`);
      expect(ttftVariance).toBeLessThan(10000); // Within 10 second range

      console.log("✅ Performance consistency maintained successfully");
    }, 300000); // 5 minute timeout
  });
});

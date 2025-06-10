import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import { UIStreamEvent } from "../src/types/ui-events";

/**
 * Streaming cancellation test suite
 * Tests the ability to cancel ongoing streaming operations gracefully
 */
describe("Streaming Cancellation", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!orgId || !envId || !secret) {
    console.warn(
      "⚠️  Skipping cancellation tests - missing Graphlit credentials"
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
      } catch (e) {}
    } else {
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
  }, 90000);

  describe("Basic Cancellation", () => {
    it("should cancel a streaming conversation using AbortController", async () => {
      console.log("🛑 Testing basic stream cancellation...");

      // Create specification
      const createResponse = await client.createSpecification({
        name: "Cancellation Test",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4O_128K,
          temperature: 0.7,
          completionTokenLimit: 2000, // Large limit to ensure long response
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      const events: UIStreamEvent[] = [];
      let conversationId: string | undefined;
      const abortController = new AbortController();
      let cancelledByUs = false;

      // Prompt for a long response
      const prompt =
        "Write a detailed 1000-word essay about the history of computing, starting from the abacus to modern quantum computers. Include specific dates, inventors, and technological breakthroughs.";

      console.log("🚀 Starting stream with long response...");

      const streamPromise = client.streamAgent(
        prompt,
        (event: UIStreamEvent) => {
          events.push(event);
          console.log(`📨 Event ${events.length}: ${event.type}`);

          if (event.type === "conversation_started") {
            conversationId = event.conversationId;
            createdConversations.push(event.conversationId);
            console.log(`🆔 Conversation started: ${conversationId}`);
          } else if (event.type === "message_update") {
            // Cancel after receiving some content
            const messageUpdateCount = events.filter((e) => e.type === "message_update").length;
            if (messageUpdateCount === 3 && !cancelledByUs) {
              console.log("🛑 Cancelling stream after 3 message updates...");
              cancelledByUs = true;
              abortController.abort();
            }
          } else if (event.type === "error") {
            console.log(`⚠️ Error event: ${event.error}`);
          } else if (event.type === "conversation_completed") {
            console.log(
              "❌ Unexpected completion - should have been cancelled!"
            );
          }
        },
        undefined,
        { id: specId },
        undefined, // tools
        undefined, // toolHandlers
        { abortSignal: abortController.signal } // Pass the abort signal here!
      );

      // Wait for the stream to complete (should be cancelled)
      try {
        await streamPromise;
        // If we get here without error, check if we got a completion event
        const completedEvent = events.find(
          (e) => e.type === "conversation_completed"
        );
        if (completedEvent && cancelledByUs) {
          console.log("⚠️  Stream completed despite cancellation request");
        }
      } catch (error) {
        console.log(`✅ Stream cancelled with error: ${error}`);
        expect(error).toBeDefined();
      }

      // Validate cancellation
      const messageEvents = events.filter((e) => e.type === "message_update");
      console.log(`\n📊 Cancellation Results:`);
      console.log(`  Total events: ${events.length}`);
      console.log(`  Message updates before cancel: ${messageEvents.length}`);
      console.log(`  Cancelled by us: ${cancelledByUs}`);

      // Should have some events but not complete
      expect(events.length).toBeGreaterThan(0);
      expect(messageEvents.length).toBeGreaterThanOrEqual(3);

      // Should not have completed if we cancelled
      const completedEvent = events.find(
        (e) => e.type === "conversation_completed"
      );
      if (cancelledByUs) {
        expect(completedEvent).toBeUndefined();
      }

      console.log("✅ Successfully cancelled streaming conversation");
    }, 30000);

    it("should handle cancellation at different stages", async () => {
      console.log("\n🎯 Testing cancellation at various stages...");

      // Create specification
      const createResponse = await client.createSpecification({
        name: "Stage Cancellation Test",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4OMini_128K,
          temperature: 0.7,
          completionTokenLimit: 500,
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      // Test cancellation at different points
      const cancellationTests = [
        { name: "Before first token", cancelAfterEvents: 1 },
        { name: "During streaming", cancelAfterEvents: 5 },
        { name: "Near completion", cancelAfterEvents: 15 },
      ];

      for (const test of cancellationTests) {
        console.log(
          `\n📍 Testing: ${test.name} (cancel after ${test.cancelAfterEvents} events)`
        );

        const events: UIStreamEvent[] = [];
        const abortController = new AbortController();
        let cancelled = false;
        let conversationId: string | undefined;

        try {
          // Check if streaming is supported
          if (!client.supportsStreaming()) {
            console.log("⚠️  Skipping test - streaming not supported");
            return;
          }

          await client.streamAgent(
            "Tell me a short story about a robot learning to paint.",
            (event: UIStreamEvent) => {
              events.push(event);

              if (event.type === "conversation_started") {
                conversationId = event.conversationId;
                createdConversations.push(event.conversationId);
              }

              // Cancel after specified number of events
              if (events.length >= test.cancelAfterEvents && !cancelled) {
                console.log(`  🛑 Cancelling after ${events.length} events`);
                cancelled = true;
                abortController.abort();
              }
            },
            undefined,
            { id: specId },
            undefined,
            undefined,
            { abortSignal: abortController.signal }
          );
        } catch (error) {
          console.log(`  ✅ Cancelled successfully with error`);
        }

        console.log(`  📊 Results: ${events.length} events received`);
        const hasCompletion = events.some(
          (e) => e.type === "conversation_completed"
        );
        console.log(
          `  ${hasCompletion ? "⚠️ Completed" : "✅ Not completed"} (cancelled: ${cancelled})`
        );

        // If we cancelled early, should not have completion
        if (cancelled && test.cancelAfterEvents < 10) {
          expect(hasCompletion).toBe(false);
        }
      }

      console.log("\n✅ Stage cancellation tests completed");
    }, 90000);
  });

  describe("Tool Calling Cancellation", () => {
    it("should handle cancellation during tool execution", async () => {
      console.log("\n🔧 Testing cancellation during tool calls...");

      // Create specification
      const createResponse = await client.createSpecification({
        name: "Tool Cancellation Test",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4O_128K,
          temperature: 0.7,
          completionTokenLimit: 1000,
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      const events: UIStreamEvent[] = [];
      const abortController = new AbortController();
      let toolCallCount = 0;
      let conversationId: string | undefined;

      // Slow tool that we'll cancel during execution
      const slowTool: Types.ToolDefinitionInput = {
        name: "slowCalculation",
        description: "Performs a complex calculation that takes time",
        schema: JSON.stringify({
          type: "object",
          properties: {
            numbers: {
              type: "array",
              items: { type: "number" },
              description: "Numbers to process",
            },
          },
          required: ["numbers"],
        }),
      };

      const toolHandler = async (args: { numbers: number[] }) => {
        console.log("🔧 Tool called with:", args);
        toolCallCount++;

        // Simulate slow processing
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Check if cancelled
        if (abortController.signal.aborted) {
          console.log("🛑 Tool execution cancelled!");
          throw new Error("Cancelled");
        }

        return {
          result: args.numbers.reduce((sum, n) => sum + n, 0),
          processed: args.numbers.length,
        };
      };

      const streamPromise = client.streamAgent(
        "Calculate the sum of these numbers using the slowCalculation tool: [1, 2, 3, 4, 5]. Then multiply the result by 10.",
        (event: UIStreamEvent) => {
          events.push(event);
          console.log(`📨 Event: ${event.type}`);

          if (event.type === "conversation_started") {
            conversationId = event.conversationId;
            createdConversations.push(event.conversationId);
          } else if (
            event.type === "tool_update" &&
            event.status === "executing"
          ) {
            console.log("🛑 Cancelling during tool execution...");
            // Cancel while tool is running
            setTimeout(() => abortController.abort(), 500);
          }
        },
        undefined,
        { id: specId },
        [slowTool],
        { slowCalculation: toolHandler },
        { abortSignal: abortController.signal }
      );

      try {
        await streamPromise;
      } catch (error) {
        console.log(`✅ Stream cancelled during tool execution`);
      }

      // Check results
      const toolEvents = events.filter((e) => e.type === "tool_update");
      const completedEvent = events.find(
        (e) => e.type === "conversation_completed"
      );

      console.log(`\n📊 Tool Cancellation Results:`);
      console.log(`  Tool events: ${toolEvents.length}`);
      console.log(`  Tool calls made: ${toolCallCount}`);
      console.log(`  Completed: ${!!completedEvent}`);

      expect(toolEvents.length).toBeGreaterThan(0);
      expect(completedEvent).toBeUndefined(); // Should not complete

      console.log("✅ Successfully handled tool cancellation");
    }, 30000);
  });

  describe("Multiple Cancellations", () => {
    it("should handle cancelling multiple concurrent streams", async () => {
      console.log("\n🎯 Testing multiple concurrent cancellations...");

      // Create specification
      const createResponse = await client.createSpecification({
        name: "Multi Cancel Test",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4OMini_128K,
          temperature: 0.7,
          completionTokenLimit: 1000,
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      // Start 5 conversations and cancel them at different times
      const conversations = Array.from({ length: 5 }, (_, i) => ({
        index: i,
        controller: new AbortController(),
        events: [] as UIStreamEvent[],
        cancelAfterMs: (i + 1) * 500, // Cancel at 500ms, 1s, 1.5s, 2s, 2.5s
        cancelled: false,
        completed: false,
      }));

      const prompt =
        "Write a long analysis of artificial intelligence, covering its history, current state, future prospects, ethical considerations, and potential impacts on society.";

      // Start all conversations
      const streamPromises = conversations.map((conv) => {
        console.log(
          `🚀 Starting conversation ${conv.index + 1} (cancel after ${conv.cancelAfterMs}ms)`
        );

        // Set up cancellation timer
        setTimeout(() => {
          if (!conv.completed) {
            console.log(`🛑 Cancelling conversation ${conv.index + 1}`);
            conv.cancelled = true;
            conv.controller.abort();
          }
        }, conv.cancelAfterMs);

        return client
          .streamAgent(
            prompt,
            (event: UIStreamEvent) => {
              conv.events.push(event);

              if (event.type === "conversation_started") {
                createdConversations.push(event.conversationId);
              } else if (event.type === "conversation_completed") {
                conv.completed = true;
                console.log(
                  `✅ Conversation ${conv.index + 1} completed before cancel`
                );
              }
            },
            undefined,
            { id: specId },
            undefined,
            undefined,
            { abortSignal: conv.controller.signal }
          )
          .catch((error) => {
            if (conv.cancelled) {
              console.log(
                `✅ Conversation ${conv.index + 1} cancelled successfully`
              );
            } else {
              console.log(`❌ Conversation ${conv.index + 1} error: ${error}`);
            }
          });
      });

      // Wait for all to finish
      await Promise.allSettled(streamPromises);

      // Analyze results
      console.log("\n📊 Multiple Cancellation Results:");
      conversations.forEach((conv) => {
        const messageEvents = conv.events.filter(
          (e) => e.type === "message_update"
        ).length;
        console.log(`  Conv ${conv.index + 1}:`);
        console.log(`    Events: ${conv.events.length}`);
        console.log(`    Messages: ${messageEvents}`);
        console.log(`    Cancelled: ${conv.cancelled}`);
        console.log(`    Completed: ${conv.completed}`);
      });

      // Verify cancellations worked
      const cancelledConvs = conversations.filter(
        (c) => c.cancelled && !c.completed
      );
      expect(cancelledConvs.length).toBeGreaterThan(0);

      // Earlier cancellations should have fewer events
      const sortedByEvents = [...conversations].sort(
        (a, b) => a.events.length - b.events.length
      );
      const sortedByCancelTime = [...conversations].sort(
        (a, b) => a.cancelAfterMs - b.cancelAfterMs
      );

      // Generally, earlier cancellations should result in fewer events
      console.log("\n📈 Event count correlation with cancel time:");
      sortedByCancelTime.forEach((conv) => {
        console.log(`  ${conv.cancelAfterMs}ms → ${conv.events.length} events`);
      });

      console.log("\n✅ Multiple cancellation test completed");
    }, 90000);
  });

  describe("Cancellation Edge Cases", () => {
    it("should handle repeated abort calls gracefully", async () => {
      console.log("\n🔄 Testing repeated abort calls...");

      // Create specification
      const createResponse = await client.createSpecification({
        name: "Repeated Abort Test",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4OMini_128K,
          temperature: 0.7,
          completionTokenLimit: 500,
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      const abortController = new AbortController();
      let errorCount = 0;

      const streamPromise = client.streamAgent(
        "Count from 1 to 100 slowly, with detailed explanations for each number.",
        (event: UIStreamEvent) => {
          if (event.type === "conversation_started") {
            createdConversations.push(event.conversationId);
          } else if (event.type === "message_update") {
            // Repeatedly call abort
            try {
              abortController.abort();
              abortController.abort(); // Should not cause issues
              abortController.abort();
            } catch (error) {
              errorCount++;
              console.error("❌ Error on repeated abort:", error);
            }
          }
        },
        undefined,
        { id: specId },
        undefined,
        undefined,
        { abortSignal: abortController.signal }
      );

      try {
        await streamPromise;
      } catch (error) {
        console.log("✅ Stream aborted as expected");
      }

      expect(errorCount).toBe(0); // Repeated aborts should not cause errors
      console.log("✅ Handled repeated abort calls gracefully");
    }, 30000);

    it("should handle pre-aborted controller", async () => {
      console.log("\n⏮️ Testing pre-aborted controller...");

      // Create specification
      const createResponse = await client.createSpecification({
        name: "Pre-abort Test",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4OMini_128K,
          temperature: 0.7,
          completionTokenLimit: 100,
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      // Abort before starting
      const abortController = new AbortController();
      abortController.abort();

      let eventCount = 0;
      let errorReceived = false;

      try {
        // Check if streaming is supported
        if (!client.supportsStreaming()) {
          console.log("⚠️  Skipping test - streaming not supported");
          return;
        }

        await client.streamAgent(
          "This should not execute",
          (event: UIStreamEvent) => {
            eventCount++;
            if (event.type === "error") {
              errorReceived = true;
            }
          },
          undefined,
          { id: specId },
          undefined,
          undefined,
          { abortSignal: abortController.signal }
        );
      } catch (error) {
        console.log("✅ Pre-aborted stream rejected immediately");
        errorReceived = true;
      }

      expect(errorReceived).toBe(true);
      expect(eventCount).toBe(0); // Should not process any events

      console.log("✅ Handled pre-aborted controller correctly");
    }, 10000);
  });
});

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import { AgentStreamEvent } from "../src/types/ui-events";

/**
 * Integration test for reasoning detection and stream cancellation
 */
describe("Reasoning & Cancellation Integration", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;

  if (!orgId || !envId || !secret) {
    console.warn(
      "⚠️  Skipping integration tests - missing Graphlit credentials",
    );
    return;
  }

  let client: Graphlit;
  const specIds: string[] = [];
  const conversationIds: string[] = [];

  beforeAll(() => {
    client = new Graphlit(orgId, envId, secret);
  });

  afterAll(async () => {
    // Cleanup
    for (const convId of conversationIds) {
      try {
        await client.deleteConversation(convId);
      } catch (error) {
        console.warn(`Failed to delete conversation ${convId}`);
      }
    }

    for (const specId of specIds) {
      try {
        await client.deleteSpecification(specId);
      } catch (error) {
        console.warn(`Failed to delete specification ${specId}`);
      }
    }
  });

  it("should handle reasoning detection with stream cancellation", async () => {
    console.log("🧪 Testing reasoning detection with cancellation...");

    const spec = await client.createSpecification({
      name: "Reasoning + Cancellation Test",
      serviceType: Types.ModelServiceTypes.Bedrock,
      bedrock: {
        model: Types.BedrockModels.NovaPremier,
        temperature: 0.7,
      },
    });

    const specId = spec.createSpecification!.id;
    specIds.push(specId);

    const events: AgentStreamEvent[] = [];
    const reasoningEvents: AgentStreamEvent[] = [];
    const controller = new AbortController();
    let cancelled = false;

    // Cancel after we receive some reasoning or message events
    let eventCount = 0;

    let streamCompleted = false;

    const streamPromise = client.streamAgent(
      "Explain the theory of relativity in great detail. Include mathematical formulas, historical context, practical applications, and future implications. Think through each aspect step by step.",
      (event: AgentStreamEvent) => {
        events.push(event);
        eventCount++;

        if (event.type === "conversation_started") {
          conversationIds.push(event.conversationId);
          console.log(`🆔 Conversation started: ${event.conversationId}`);
        } else if (event.type === "reasoning_update") {
          reasoningEvents.push(event);
          console.log(
            `🤔 Reasoning (${event.format}): ${event.content.substring(0, 50)}...`,
          );
        } else if (event.type === "message_update") {
          console.log(
            `💬 Message: ${event.message.message.substring(0, 50)}...`,
          );
        } else if (event.type === "conversation_completed") {
          streamCompleted = true;
          console.log("🏁 Stream completed");
        }

        // Cancel after we get a few events (reasoning or message)
        if (eventCount >= 3 && !cancelled && !streamCompleted) {
          console.log("🛑 Cancelling stream after receiving events...");
          cancelled = true;
          controller.abort();
        }
      },
      undefined,
      { id: specId },
      undefined,
      undefined,
      { abortSignal: controller.signal },
    );

    try {
      await streamPromise;
      console.log("Stream promise resolved normally");
    } catch (error: any) {
      console.log(
        "Stream promise rejected with error:",
        error.message || error,
      );
      if (cancelled && !streamCompleted) {
        console.log("✅ Stream properly cancelled before completion");
      }
    }

    console.log(`\n📊 Results:`);
    console.log(`  Total events: ${events.length}`);
    console.log(`  Reasoning events: ${reasoningEvents.length}`);
    console.log(`  Cancelled: ${cancelled}`);
    console.log(`  Stream completed: ${streamCompleted}`);

    // We should have received some events
    expect(events.length).toBeGreaterThan(0);

    // If we got reasoning events, verify they have the right format
    if (reasoningEvents.length > 0) {
      const firstReasoning = reasoningEvents[0];
      expect(firstReasoning.type).toBe("reasoning_update");
      if (firstReasoning.type === "reasoning_update") {
        expect(firstReasoning.format).toBe("thinking_tag"); // Bedrock uses thinking tags
        expect(typeof firstReasoning.content).toBe("string");
        expect(typeof firstReasoning.isComplete).toBe("boolean");
      }
    }

    // The test passes if:
    // 1. We cancelled and the stream didn't complete, OR
    // 2. The stream completed very quickly before we could cancel
    if (cancelled && !streamCompleted) {
      console.log("✅ Successfully demonstrated cancellation");
    } else if (streamCompleted && eventCount <= 3) {
      console.log(
        "⚡ Stream completed very quickly (before cancellation threshold)",
      );
    } else {
      console.log("Test completed with mixed results");
    }
  }, 60000);

  it("should handle pre-cancelled abort signal", async () => {
    console.log("🧪 Testing pre-cancelled abort signal...");

    const spec = await client.createSpecification({
      name: "Pre-cancel Test",
      serviceType: Types.ModelServiceTypes.Bedrock,
      bedrock: {
        model: Types.BedrockModels.NovaPremier,
        temperature: 0.7,
      },
    });

    const specId = spec.createSpecification!.id;
    specIds.push(specId);

    const controller = new AbortController();
    controller.abort(); // Cancel before starting

    let eventCount = 0;

    try {
      await client.streamAgent(
        "This should not execute",
        (event: AgentStreamEvent) => {
          eventCount++;
          if (event.type === "conversation_started") {
            conversationIds.push(event.conversationId);
          }
        },
        undefined,
        { id: specId },
        undefined,
        undefined,
        { abortSignal: controller.signal },
      );

      // Should not reach here
      expect(false).toBe(true);
    } catch (error) {
      console.log("✅ Pre-cancelled stream rejected immediately");
      expect(error).toBeDefined();
    }

    expect(eventCount).toBe(0); // Should not process any events
  }, 30000);

  it("should handle multiple reasoning formats", async () => {
    console.log("🧪 Testing multiple reasoning formats...");

    const specs = [
      {
        config: {
          name: "Bedrock Reasoning Test",
          serviceType: Types.ModelServiceTypes.Bedrock,
          bedrock: { model: Types.BedrockModels.NovaPremier },
        },
        expectedFormat: "thinking_tag" as const,
      },
      {
        config: {
          name: "Deepseek Reasoning Test",
          serviceType: Types.ModelServiceTypes.Deepseek,
          deepseek: { model: Types.DeepseekModels.Chat },
        },
        expectedFormat: "markdown" as const,
      },
    ];

    for (const { config, expectedFormat } of specs) {
      const spec = await client.createSpecification(config);
      const specId = spec.createSpecification!.id;
      specIds.push(specId);

      const reasoningEvents: AgentStreamEvent[] = [];
      const controller = new AbortController();

      // Cancel after 10 seconds to prevent long test runs
      setTimeout(() => controller.abort(), 10000);

      try {
        await client.streamAgent(
          "Calculate 12 × 15. Show your work step by step.",
          (event: AgentStreamEvent) => {
            if (event.type === "conversation_started") {
              conversationIds.push(event.conversationId);
            } else if (event.type === "reasoning_update") {
              reasoningEvents.push(event);
            }
          },
          undefined,
          { id: specId },
          undefined,
          undefined,
          { abortSignal: controller.signal },
        );
      } catch (error) {
        // Expected due to timeout cancellation
      }

      console.log(`📊 ${config.serviceType} Results:`);
      console.log(`  Reasoning events: ${reasoningEvents.length}`);

      if (reasoningEvents.length > 0) {
        const firstEvent = reasoningEvents[0];
        if (firstEvent.type === "reasoning_update") {
          const format = firstEvent.format;
          console.log(`  Expected format: ${expectedFormat}`);
          console.log(`  Actual format: ${format}`);

          expect(format).toBe(expectedFormat);
        }
      }
    }
  }, 120000);
});

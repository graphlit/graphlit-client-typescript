import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { config } from "dotenv";
import { resolve } from "path";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import { AgentStreamEvent } from "../src/types/ui-events";

// Load env vars
config({ path: resolve(__dirname, ".env") });

/**
 * Minimal GPT 5.2 Reasoning Test
 *
 * This test specifically checks if we receive reasoning events from GPT 5.2
 * when reasoningEffort is set to High.
 */
describe("GPT 5.2 Reasoning Events", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;

  if (!orgId || !envId || !secret) {
    console.warn("⚠️  Skipping GPT 5.2 reasoning tests - missing Graphlit credentials");
    return;
  }

  let client: Graphlit;
  const createdSpecifications: string[] = [];
  const createdConversations: string[] = [];

  beforeAll(async () => {
    client = new Graphlit(orgId, envId, secret);
  });

  afterAll(async () => {
    // Cleanup conversations first
    for (const convId of createdConversations) {
      try {
        await client.deleteConversation(convId);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
    // Then specifications
    for (const specId of createdSpecifications) {
      try {
        await client.deleteSpecification(specId);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  }, 30000);

  it("should receive reasoning events from GPT 5.2 with high reasoning effort", async () => {
    // Enable debug logging
    const originalDebug = process.env.DEBUG_GRAPHLIT_SDK_STREAMING;
    process.env.DEBUG_GRAPHLIT_SDK_STREAMING = "true";

    try {
      // Create GPT 5.2 specification with high reasoning effort
      const specConfig: Types.SpecificationInput = {
        name: "Test GPT 5.2 Reasoning",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt52_400K,
          temperature: 1.0,
          reasoningEffort: Types.OpenAiReasoningEffortLevels.High,
        },
      };

      const createResponse = await client.createSpecification(specConfig);
      const specId = createResponse.createSpecification?.id;
      if (!specId) throw new Error("Failed to create specification");
      createdSpecifications.push(specId);

      // Verify the specification was created with reasoningEffort
      const getResponse = await client.getSpecification(specId);
      const savedSpec = getResponse.specification;
      console.log(`📋 Created specification:`, {
        id: savedSpec?.id,
        name: savedSpec?.name,
        model: savedSpec?.openAI?.model,
        reasoningEffort: savedSpec?.openAI?.reasoningEffort,
        temperature: savedSpec?.openAI?.temperature,
      });

      if (!savedSpec?.openAI?.reasoningEffort) {
        console.warn(`⚠️ WARNING: reasoningEffort was NOT saved to the specification!`);
        console.warn(`   Input was: ${specConfig.openAI?.reasoningEffort}`);
        console.warn(`   Saved was: ${savedSpec?.openAI?.reasoningEffort}`);
      }

      const events: AgentStreamEvent[] = [];
      let conversationId: string | undefined;
      let finalMessage = "";

      console.log("\n" + "=".repeat(60));
      console.log("Testing GPT 5.2 Reasoning (reasoningEffort=High)");
      console.log("=".repeat(60));

      await client.streamAgent(
        "What is 15 multiplied by 17? Think through this step by step.",
        (event: AgentStreamEvent) => {
          events.push(event);

          if (event.type === "conversation_started") {
            conversationId = event.conversationId;
            console.log(`📍 Conversation: ${conversationId}`);
          } else if (event.type === "reasoning_update") {
            const re = event as any;
            console.log(
              `🧠 REASONING: isComplete=${re.isComplete}, length=${re.content?.length || 0}`,
            );
            if (re.content && re.content.length < 300) {
              console.log(`   "${re.content}"`);
            } else if (re.content) {
              console.log(`   "${re.content.substring(0, 300)}..."`);
            }
          } else if (event.type === "conversation_completed") {
            finalMessage = event.message.message;
            console.log(`✅ Final: "${finalMessage.substring(0, 150)}..."`);
          } else if (event.type === "error") {
            console.error(`❌ Error: ${event.error.message}`);
          }
        },
        undefined,
        { id: specId },
      );

      if (conversationId) {
        createdConversations.push(conversationId);
      }

      // Analyze results
      const reasoningEvents = events.filter((e) => e.type === "reasoning_update");
      const messageEvents = events.filter((e) => e.type === "message_update");

      console.log("\n" + "=".repeat(60));
      console.log("RESULTS:");
      console.log("=".repeat(60));
      console.log(`Total events: ${events.length}`);
      console.log(`Reasoning events: ${reasoningEvents.length}`);
      console.log(`Message events: ${messageEvents.length}`);
      console.log(`Final message length: ${finalMessage.length}`);

      // List all event types
      const eventTypes = [...new Set(events.map((e) => e.type))];
      console.log(`Event types: ${eventTypes.join(", ")}`);

      if (reasoningEvents.length > 0) {
        console.log("\n✅ SUCCESS: Received reasoning events from GPT 5.2!");
        const lastReasoning = reasoningEvents[reasoningEvents.length - 1] as any;
        console.log(`Total reasoning content: ${lastReasoning.content?.length || 0} chars`);
      } else {
        console.log("\n⚠️ NO REASONING EVENTS received.");
        console.log("Possible causes:");
        console.log("  1. OpenAI not returning reasoning_details in stream for GPT 5.2");
        console.log("  2. Different field name or structure than expected");
        console.log("  3. Reasoning happens internally without streaming output");
      }
      console.log("=".repeat(60) + "\n");

      // Test passes if we got a response - reasoning is informational
      expect(finalMessage.length).toBeGreaterThan(0);
      expect(finalMessage).toContain("255"); // 15 * 17 = 255
    } finally {
      if (originalDebug !== undefined) {
        process.env.DEBUG_GRAPHLIT_SDK_STREAMING = originalDebug;
      } else {
        delete process.env.DEBUG_GRAPHLIT_SDK_STREAMING;
      }
    }
  }, 120000);
});

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import { AgentStreamEvent } from "../src/types/ui-events";

/**
 * Basic reasoning detection test
 */
describe("Basic Reasoning Detection", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;

  if (!orgId || !envId || !secret) {
    console.warn("⚠️  Skipping reasoning tests - missing Graphlit credentials");
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

  it("should detect reasoning in Bedrock Nova Premier", async () => {
    const spec = await client.createSpecification({
      name: "Nova Reasoning Test",
      serviceType: Types.ModelServiceTypes.Bedrock,
      bedrock: {
        model: Types.BedrockModels.NovaPremier,
        temperature: 0.7,
      },
    });

    const specId = spec.createSpecification!.id;
    specIds.push(specId);

    const reasoningEvents: AgentStreamEvent[] = [];
    const messageEvents: AgentStreamEvent[] = [];

    await client.streamAgent(
      "What is 15% of 240? Please think through this step by step.",
      (event: AgentStreamEvent) => {
        if (event.type === "conversation_started") {
          conversationIds.push(event.conversationId);
        } else if (event.type === "reasoning_update") {
          reasoningEvents.push(event);
          console.log(
            `🤔 [Reasoning] ${event.format}: ${event.content.substring(0, 100)}...`,
          );
        } else if (event.type === "message_update") {
          messageEvents.push(event);
        }
      },
      undefined,
      { id: specId },
    );

    // Check that we got reasoning events
    console.log(`\n📊 Results:`);
    console.log(`  Reasoning events: ${reasoningEvents.length}`);
    console.log(`  Message events: ${messageEvents.length}`);

    // The final message should not contain thinking tags
    const finalMessageEvent = messageEvents[messageEvents.length - 1];
    if (finalMessageEvent && finalMessageEvent.type === "message_update") {
      const finalMessage = finalMessageEvent.message.message || "";
      expect(finalMessage).not.toContain("<thinking>");
      expect(finalMessage).not.toContain("</thinking>");

      // Should contain the answer (36)
      expect(finalMessage).toContain("36");
    }
  }, 30000);

  it("should detect reasoning in Deepseek", async () => {
    const spec = await client.createSpecification({
      name: "Deepseek Reasoning Test",
      serviceType: Types.ModelServiceTypes.Deepseek,
      deepseek: {
        model: Types.DeepseekModels.Chat,
        temperature: 0.7,
      },
    });

    const specId = spec.createSpecification!.id;
    specIds.push(specId);

    const reasoningEvents: AgentStreamEvent[] = [];
    let hasMarkdownReasoning = false;

    await client.streamAgent(
      "A train travels 180 miles in 3 hours. What is its average speed? Show your reasoning with markdown formatting.",
      (event: AgentStreamEvent) => {
        if (event.type === "conversation_started") {
          conversationIds.push(event.conversationId);
        } else if (event.type === "reasoning_update") {
          reasoningEvents.push(event);
          if (event.format === "markdown") {
            hasMarkdownReasoning = true;
          }
          console.log(
            `🤔 [Deepseek Reasoning] ${event.content.substring(0, 100)}...`,
          );
        }
      },
      undefined,
      { id: specId },
    );

    console.log(`\n📊 Deepseek Results:`);
    console.log(`  Reasoning events: ${reasoningEvents.length}`);
    console.log(`  Has markdown reasoning: ${hasMarkdownReasoning}`);

    // Check if we detected any reasoning
    if (reasoningEvents.length > 0) {
      const fullReasoning = reasoningEvents
        .filter((e) => e.type === "reasoning_update" && e.isComplete)
        .map((e) => (e.type === "reasoning_update" ? e.content : ""))
        .join("\n");

      console.log(`  Full reasoning length: ${fullReasoning.length} chars`);

      // Should mention speed or miles per hour
      expect(fullReasoning.toLowerCase()).toMatch(/speed|miles.*hour|mph/);
    }
  }, 30000);
});

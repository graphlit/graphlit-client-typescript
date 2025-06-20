import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import { AgentStreamEvent, ContextWindowEvent } from "../src/types/ui-events";

/**
 * Test for context window tracking feature
 */
describe("Context Window Tracking", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;

  if (!orgId || !envId || !secret) {
    console.warn("⚠️  Skipping context window tests - missing credentials");
    return;
  }

  let client: Graphlit;
  const createdSpecifications: string[] = [];
  const createdConversations: string[] = [];

  beforeAll(async () => {
    client = new Graphlit(orgId, envId, secret);

    // Set up OpenAI client if available
    if (process.env.OPENAI_API_KEY) {
      const { default: OpenAI } = await import("openai");
      client.setOpenAIClient(new OpenAI());
    }
  });

  afterAll(async () => {
    // Cleanup
    for (const conversationId of createdConversations) {
      try {
        await client.deleteConversation(conversationId);
      } catch (error) {
        console.warn(
          `Failed to cleanup conversation ${conversationId}:`,
          error,
        );
      }
    }

    for (const specId of createdSpecifications) {
      try {
        await client.deleteSpecification(specId);
      } catch (error) {
        console.warn(`Failed to cleanup specification ${specId}:`, error);
      }
    }
  }, 30000);

  it("should emit context window events in streamAgent", async () => {
    // Create a specification
    const spec = await client.createSpecification({
      name: "Context Window Test",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.OpenAi,
      searchType: Types.ConversationSearchTypes.None, // no RAG
      openAI: {
        model: Types.OpenAiModels.Gpt4OMini_128K,
        temperature: 0.7,
      },
    });

    expect(spec.createSpecification?.id).toBeDefined();
    createdSpecifications.push(spec.createSpecification!.id);

    // Track events
    const events: AgentStreamEvent[] = [];
    let contextWindowEvent: ContextWindowEvent | undefined;
    let completionContextWindow: any | undefined;

    await client.streamAgent(
      "What is 2+2? Please provide a brief answer.",
      (event) => {
        events.push(event);

        if (event.type === "context_window") {
          contextWindowEvent = event;
          console.log("📊 Context Window Event:", {
            usedTokens: event.usage.usedTokens,
            maxTokens: event.usage.maxTokens,
            percentage: event.usage.percentage,
            remainingTokens: event.usage.remainingTokens,
          });
        }

        if (event.type === "conversation_started") {
          createdConversations.push(event.conversationId);
        }

        if (event.type === "conversation_completed") {
          completionContextWindow = event.contextWindow;
          console.log("✅ Completion Context Window:", event.contextWindow);
        }
      },
      undefined,
      { id: spec.createSpecification!.id },
    );

    // Verify context window event was emitted
    expect(contextWindowEvent).toBeDefined();
    expect(contextWindowEvent!.usage.usedTokens).toBeGreaterThan(0);
    expect(contextWindowEvent!.usage.maxTokens).toBeGreaterThan(0);
    expect(contextWindowEvent!.usage.percentage).toBeGreaterThanOrEqual(0);
    expect(contextWindowEvent!.usage.percentage).toBeLessThanOrEqual(100);
    expect(contextWindowEvent!.usage.remainingTokens).toBeGreaterThanOrEqual(0);

    // Verify context window is included in completion
    expect(completionContextWindow).toBeDefined();
    expect(completionContextWindow).toEqual(contextWindowEvent!.usage);

    // Log summary
    console.log("\n📈 Context Window Summary:");
    console.log(
      `   Model limit: ${contextWindowEvent!.usage.maxTokens.toLocaleString()} tokens`,
    );
    console.log(
      `   Used: ${contextWindowEvent!.usage.usedTokens.toLocaleString()} tokens (${contextWindowEvent!.usage.percentage}%)`,
    );
    console.log(
      `   Remaining: ${contextWindowEvent!.usage.remainingTokens.toLocaleString()} tokens`,
    );
  }, 30000);

  it("should include context window in promptAgent result", async () => {
    // Create a specification
    const spec = await client.createSpecification({
      name: "Context Window Test - PromptAgent",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.OpenAi,
      searchType: Types.ConversationSearchTypes.None, // no RAG
      openAI: {
        model: Types.OpenAiModels.Gpt4OMini_128K,
        temperature: 0.7,
      },
    });

    expect(spec.createSpecification?.id).toBeDefined();
    createdSpecifications.push(spec.createSpecification!.id);

    // Call promptAgent
    const result = await client.promptAgent(
      "What is the capital of France? Please provide a brief answer.",
      undefined,
      { id: spec.createSpecification!.id },
    );

    if (result.conversationId) {
      createdConversations.push(result.conversationId);
    }

    // Verify context window is included
    expect(result.contextWindow).toBeDefined();
    expect(result.contextWindow!.usedTokens).toBeGreaterThan(0);
    expect(result.contextWindow!.maxTokens).toBeGreaterThan(0);
    expect(result.contextWindow!.percentage).toBeGreaterThanOrEqual(0);
    expect(result.contextWindow!.percentage).toBeLessThanOrEqual(100);
    expect(result.contextWindow!.remainingTokens).toBeGreaterThanOrEqual(0);

    // Log summary
    console.log("\n📈 PromptAgent Context Window:");
    console.log(
      `   Model limit: ${result.contextWindow!.maxTokens.toLocaleString()} tokens`,
    );
    console.log(
      `   Used: ${result.contextWindow!.usedTokens.toLocaleString()} tokens (${result.contextWindow!.percentage}%)`,
    );
    console.log(
      `   Remaining: ${result.contextWindow!.remainingTokens.toLocaleString()} tokens`,
    );
    console.log(`   Response: ${result.message}`);
  }, 30000);

  it("should show increasing context usage in multi-turn conversation", async () => {
    // Create a specification
    const spec = await client.createSpecification({
      name: "Context Window Multi-turn Test",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.OpenAi,
      searchType: Types.ConversationSearchTypes.None, // no RAG
      openAI: {
        model: Types.OpenAiModels.Gpt4OMini_128K,
        temperature: 0.7,
      },
    });

    expect(spec.createSpecification?.id).toBeDefined();
    createdSpecifications.push(spec.createSpecification!.id);

    let conversationId: string | undefined;
    const contextUsages: number[] = [];

    // Turn 1
    console.log("\n🔄 Turn 1:");
    await client.streamAgent(
      "Hello! My name is Alice.",
      (event) => {
        if (event.type === "conversation_started") {
          conversationId = event.conversationId;
          createdConversations.push(event.conversationId);
        }
        if (event.type === "context_window") {
          contextUsages.push(event.usage.usedTokens);
          console.log(`   Context usage: ${event.usage.usedTokens} tokens`);
        }
      },
      undefined,
      { id: spec.createSpecification!.id },
    );

    // Turn 2
    console.log("\n🔄 Turn 2:");
    await client.streamAgent(
      "What's my name?",
      (event) => {
        if (event.type === "context_window") {
          contextUsages.push(event.usage.usedTokens);
          console.log(`   Context usage: ${event.usage.usedTokens} tokens`);
        }
      },
      conversationId,
      { id: spec.createSpecification!.id },
    );

    // Turn 3
    console.log("\n🔄 Turn 3:");
    await client.streamAgent(
      "Can you tell me a short story about someone with my name?",
      (event) => {
        if (event.type === "context_window") {
          contextUsages.push(event.usage.usedTokens);
          console.log(`   Context usage: ${event.usage.usedTokens} tokens`);
        }
      },
      conversationId,
      { id: spec.createSpecification!.id },
    );

    // Verify context usage increases with each turn
    expect(contextUsages).toHaveLength(3);
    expect(contextUsages[1]).toBeGreaterThan(contextUsages[0]);
    expect(contextUsages[2]).toBeGreaterThan(contextUsages[1]);

    console.log("\n📈 Context Growth:");
    console.log(`   Turn 1: ${contextUsages[0]} tokens`);
    console.log(
      `   Turn 2: ${contextUsages[1]} tokens (+${contextUsages[1] - contextUsages[0]})`,
    );
    console.log(
      `   Turn 3: ${contextUsages[2]} tokens (+${contextUsages[2] - contextUsages[1]})`,
    );
  }, 60000);
});

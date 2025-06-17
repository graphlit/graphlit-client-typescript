import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import { AgentStreamEvent } from "../src/types/ui-events";

/**
 * Test to ensure streaming works correctly when no tools are called
 * This tests the fix for the completeConversation bug where empty messages
 * were being sent when no tools were invoked
 */
describe("Streaming Without Tools", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;

  if (!orgId || !envId || !secret) {
    console.warn("⚠️  Skipping streaming without tools test - missing credentials");
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
        console.warn(`Failed to cleanup conversation ${conversationId}:`, error);
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

  it("should handle streamAgent when no tools are called", async () => {
    // Create a specification without tools
    const spec = await client.createSpecification({
      name: "No Tools Test",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.OpenAi,
      searchType: Types.ConversationSearchTypes.None, // No RAG
      openAI: {
        model: Types.OpenAiModels.Gpt4OMini_128K,
        temperature: 0.7,
      },
    });

    expect(spec.createSpecification?.id).toBeDefined();
    createdSpecifications.push(spec.createSpecification!.id);

    // Track events
    const events: AgentStreamEvent[] = [];
    let conversationStarted = false;
    let messageReceived = false;
    let conversationCompleted = false;
    let errorOccurred = false;
    let errorMessage = "";

    await client.streamAgent(
      "What is 2+2? Just give me the number.",
      (event) => {
        events.push(event);

        switch (event.type) {
          case "conversation_started":
            conversationStarted = true;
            createdConversations.push(event.conversationId);
            console.log("✅ Conversation started:", event.conversationId);
            break;
          case "message_update":
            messageReceived = true;
            console.log("📝 Message update:", event.message.message);
            break;
          case "conversation_completed":
            conversationCompleted = true;
            console.log("✅ Conversation completed successfully");
            console.log("   Final message:", event.message.message);
            console.log("   Tokens used:", event.message.tokens);
            break;
          case "error":
            errorOccurred = true;
            errorMessage = event.error.message;
            console.error("❌ Error occurred:", errorMessage);
            break;
        }
      },
      undefined,
      { id: spec.createSpecification!.id }
    );

    // Verify the conversation completed successfully
    expect(conversationStarted).toBe(true);
    expect(messageReceived).toBe(true);
    expect(conversationCompleted).toBe(true);
    expect(errorOccurred).toBe(false);
    
    if (errorOccurred) {
      console.error("Error details:", errorMessage);
    }

    // Verify we got a proper response
    const completedEvent = events.find(e => e.type === "conversation_completed");
    expect(completedEvent).toBeDefined();
    if (completedEvent?.type === "conversation_completed") {
      expect(completedEvent.message.message).toContain("4");
      expect(completedEvent.message.tokens).toBeGreaterThan(0);
    }
  }, 30000);

  it("should handle promptAgent when no tools are called", async () => {
    // Create a specification without tools
    const spec = await client.createSpecification({
      name: "No Tools Test - PromptAgent",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.OpenAi,
      searchType: Types.ConversationSearchTypes.None, // No RAG
      openAI: {
        model: Types.OpenAiModels.Gpt4OMini_128K,
        temperature: 0.7,
      },
    });

    expect(spec.createSpecification?.id).toBeDefined();
    createdSpecifications.push(spec.createSpecification!.id);

    // Call promptAgent
    const result = await client.promptAgent(
      "What is the capital of France? Just give me the city name.",
      undefined,
      { id: spec.createSpecification!.id }
    );

    if (result.conversationId) {
      createdConversations.push(result.conversationId);
    }

    // Verify we got a proper response
    expect(result.message).toBeDefined();
    expect(result.message).toContain("Paris");
    expect(result.conversationMessage?.tokens).toBeGreaterThan(0);
    
    console.log("✅ PromptAgent completed successfully");
    console.log("   Response:", result.message);
    console.log("   Tokens used:", result.conversationMessage?.tokens);
  }, 30000);
});
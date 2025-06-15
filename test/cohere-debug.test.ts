import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import { AgentStreamEvent } from "../src/types/ui-events";

/**
 * Debug test for Cohere "No valid last message" error
 */

describe("Cohere Debug Test", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;

  if (!orgId || !envId || !secret) {
    console.warn(
      "⚠️  Skipping Cohere debug test - missing Graphlit credentials",
    );
    return;
  }

  if (!process.env.COHERE_API_KEY) {
    console.warn("⚠️  Skipping Cohere debug test - missing COHERE_API_KEY");
    return;
  }

  let client: Graphlit;
  const createdSpecifications: string[] = [];
  const createdConversations: string[] = [];

  beforeAll(async () => {
    // Enable debug logging
    process.env.DEBUG_GRAPHLIT_SDK_STREAMING = "true";
    process.env.DEBUG_GRAPHLIT_SDK_STREAMING_MESSAGES = "true";

    client = new Graphlit(orgId, envId, secret);

    const { CohereClient } = await import("cohere-ai");
    client.setCohereClient(
      new CohereClient({ token: process.env.COHERE_API_KEY }),
    );
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

  const SIMPLE_TOOL: Types.ToolDefinitionInput = {
    name: "Weather",
    description: "Get current weather for a location",
    schema: JSON.stringify({
      type: "object",
      properties: {
        location: { type: "string", description: "City name" },
      },
      required: ["location"],
    }),
  };

  const TOOL_HANDLERS = {
    Weather: async (args: any) => {
      return {
        location: args.location,
        temperature: 22,
        condition: "Sunny",
      };
    },
  };

  it("should debug Cohere Command A with tools", async () => {
    console.log("\n🧪 Testing Cohere Command A with debug logging...");

    const spec = await client.createSpecification({
      name: "Cohere Command A Debug Test",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.Cohere,
      cohere: {
        model: Types.CohereModels.CommandA,
        temperature: 0.7,
      },
    });

    expect(spec.createSpecification?.id).toBeDefined();
    createdSpecifications.push(spec.createSpecification.id);

    let conversationId: string | undefined;
    let errorCount = 0;
    let errorMessage = "";
    let toolCallCount = 0;
    let messageTokens = 0;

    try {
      await client.streamAgent(
        "What's the weather like in Tokyo?",
        (event: AgentStreamEvent) => {
          console.log(`📨 Event: ${event.type}`);

          switch (event.type) {
            case "conversation_started":
              conversationId = event.conversationId;
              break;
            case "message_update":
              messageTokens++;
              break;
            case "tool_update":
              console.log(`🔧 Tool: ${event.toolCall.name} - ${event.status}`);
              if (event.status === "completed") {
                toolCallCount++;
              }
              break;
            case "error":
              console.error(`❌ Error: ${event.error.message}`);
              errorCount++;
              errorMessage = event.error.message;
              break;
          }
        },
        undefined,
        { id: spec.createSpecification.id },
        [SIMPLE_TOOL],
        TOOL_HANDLERS,
      );
    } catch (error: any) {
      console.error(`❌ Stream Agent Error: ${error.message}`);
      errorMessage = error.message;
      errorCount++;
    }

    if (conversationId) {
      createdConversations.push(conversationId);
    }

    console.log(
      `📊 Results: ${messageTokens} tokens, ${toolCallCount} tool calls, ${errorCount} errors`,
    );
    if (errorMessage) {
      console.log(`❌ Error message: ${errorMessage}`);
    }

    // This test is for debugging - we want to see what happens
    // The error should be resolved with our fixes
  }, 60000);

  it("should test Cohere Command R+ as a working comparison", async () => {
    console.log("\n🧪 Testing Cohere Command R+ (known working)...");

    const spec = await client.createSpecification({
      name: "Cohere Command R+ Debug Test",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.Cohere,
      cohere: {
        model: Types.CohereModels.CommandRPlus,
        temperature: 0.7,
      },
    });

    expect(spec.createSpecification?.id).toBeDefined();
    createdSpecifications.push(spec.createSpecification.id);

    let conversationId: string | undefined;
    let errorCount = 0;
    let toolCallCount = 0;
    let messageTokens = 0;

    await client.streamAgent(
      "What's the weather like in Tokyo?",
      (event: AgentStreamEvent) => {
        switch (event.type) {
          case "conversation_started":
            conversationId = event.conversationId;
            break;
          case "message_update":
            messageTokens++;
            break;
          case "tool_update":
            if (event.status === "completed") {
              toolCallCount++;
            }
            break;
          case "error":
            console.error(`❌ Error: ${event.error.message}`);
            errorCount++;
            break;
        }
      },
      undefined,
      { id: spec.createSpecification.id },
      [SIMPLE_TOOL],
      TOOL_HANDLERS,
    );

    if (conversationId) {
      createdConversations.push(conversationId);
    }

    console.log(
      `📊 Command R+ Results: ${messageTokens} tokens, ${toolCallCount} tool calls, ${errorCount} errors`,
    );

    expect(errorCount).toBe(0);
    expect(messageTokens).toBeGreaterThan(0);
  }, 60000);
});

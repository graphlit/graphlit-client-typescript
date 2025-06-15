import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import { AgentStreamEvent } from "../src/types/ui-events";

/**
 * Test to verify tool schema fixes for Google Gemini and other providers
 */

describe("Tool Schema Fixes", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;

  if (!orgId || !envId || !secret) {
    console.warn("⚠️  Skipping tool schema tests - missing Graphlit credentials");
    return;
  }

  let client: Graphlit;
  const createdSpecifications: string[] = [];
  const createdConversations: string[] = [];

  beforeAll(async () => {
    client = new Graphlit(orgId, envId, secret);

    // Set up streaming clients
    if (process.env.GOOGLE_API_KEY) {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      client.setGoogleClient(
        new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
      );
    }

    if (process.env.COHERE_API_KEY) {
      const { CohereClient } = await import("cohere-ai");
      client.setCohereClient(
        new CohereClient({ token: process.env.COHERE_API_KEY })
      );
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

  // Tool definition with problematic "date" format that caused Google Gemini errors
  const PROBLEMATIC_TOOL: Types.ToolDefinitionInput = {
    name: "OpeningHours",
    description: "Get current opening hours for a specific place",
    schema: JSON.stringify({
      type: "object",
      properties: {
        placeName: { type: "string", description: "Name of the place" },
        date: {
          type: "string",
          description: "Date to check (YYYY-MM-DD)",
          format: "date", // This format caused the Google Gemini error
        },
      },
      required: ["placeName"],
    }),
  };

  const TOOL_HANDLERS = {
    OpeningHours: async (args: any) => {
      return {
        place: args.placeName,
        hours: "10:00 AM - 6:00 PM",
        date: args.date || "today"
      };
    },
  };

  it("should handle Google Gemini with fixed date format schema", async () => {
    if (!process.env.GOOGLE_API_KEY) {
      console.log("⏭️  Skipping Google test - no API key");
      return;
    }

    console.log("\n🧪 Testing Google Gemini 2.5 Flash with fixed tool schema...");

    const spec = await client.createSpecification({
      name: "Google Gemini Tool Schema Fix Test",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.Google,
      google: { 
        model: Types.GoogleModels.Gemini_2_5FlashPreview, 
        temperature: 0.7 
      },
    });

    expect(spec.createSpecification?.id).toBeDefined();
    createdSpecifications.push(spec.createSpecification.id);

    let conversationId: string | undefined;
    let errorCount = 0;
    let toolCallCount = 0;
    let messageTokens = 0;

    await client.streamAgent(
      "What are the opening hours for Tokyo Skytree today?",
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
      [PROBLEMATIC_TOOL],
      TOOL_HANDLERS
    );

    if (conversationId) {
      createdConversations.push(conversationId);
    }

    console.log(`📊 Results: ${messageTokens} tokens, ${toolCallCount} tool calls, ${errorCount} errors`);

    // The fix should allow this to work without schema errors
    expect(errorCount).toBe(0);
    expect(messageTokens).toBeGreaterThan(0);

  }, 60000);

  it("should handle Cohere Command R+ (working model)", async () => {
    if (!process.env.COHERE_API_KEY) {
      console.log("⏭️  Skipping Cohere test - no API key");
      return;
    }

    console.log("\n🧪 Testing Cohere Command R+ (should work)...");

    const spec = await client.createSpecification({
      name: "Cohere Command R+ Test",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.Cohere,
      cohere: { 
        model: Types.CohereModels.CommandRPlus, 
        temperature: 0.7 
      },
    });

    expect(spec.createSpecification?.id).toBeDefined();
    createdSpecifications.push(spec.createSpecification.id);

    let conversationId: string | undefined;
    let errorCount = 0;
    let toolCallCount = 0;
    let messageTokens = 0;

    await client.streamAgent(
      "What are the opening hours for Tokyo Skytree?",
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
      [PROBLEMATIC_TOOL],
      TOOL_HANDLERS
    );

    if (conversationId) {
      createdConversations.push(conversationId);
    }

    console.log(`📊 Results: ${messageTokens} tokens, ${toolCallCount} tool calls, ${errorCount} errors`);

    expect(errorCount).toBe(0);
    expect(messageTokens).toBeGreaterThan(0);

  }, 60000);

  it("should handle Cohere Command A with fixed model mapping", async () => {
    if (!process.env.COHERE_API_KEY) {
      console.log("⏭️  Skipping Cohere Command A test - no API key");
      return;
    }

    console.log("\n🧪 Testing Cohere Command A with corrected model name...");

    const spec = await client.createSpecification({
      name: "Cohere Command A Test",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.Cohere,
      cohere: { 
        model: Types.CohereModels.CommandA, 
        temperature: 0.7 
      },
    });

    expect(spec.createSpecification?.id).toBeDefined();
    createdSpecifications.push(spec.createSpecification.id);

    let conversationId: string | undefined;
    let errorCount = 0;
    let toolCallCount = 0;
    let messageTokens = 0;

    await client.streamAgent(
      "What are the opening hours for Tokyo Skytree?",
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
            console.log(`Expected error: ${event.error.message}`);
            errorCount++;
            break;
        }
      },
      undefined,
      { id: spec.createSpecification.id },
      [PROBLEMATIC_TOOL],
      TOOL_HANDLERS
    );

    if (conversationId) {
      createdConversations.push(conversationId);
    }

    console.log(`📊 Results: ${messageTokens} tokens, ${toolCallCount} tool calls, ${errorCount} errors`);

    // With the corrected model mapping, Command A should now work
    expect(errorCount).toBe(0);
    expect(messageTokens).toBeGreaterThan(0);

  }, 60000);
});
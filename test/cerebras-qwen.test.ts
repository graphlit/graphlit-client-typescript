import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import { AgentStreamEvent } from "../src/types/ui-events";
import { config } from "dotenv";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load test environment variables
config({ path: resolve(__dirname, ".env") });

// Skip tests if environment variables are not set
const skipTests =
  !process.env.GRAPHLIT_ORGANIZATION_ID ||
  !process.env.GRAPHLIT_ENVIRONMENT_ID ||
  !process.env.GRAPHLIT_JWT_SECRET;

// Enable debug logging for these tests
process.env.DEBUG_GRAPHLIT_SDK_STREAMING = 'true';

describe.skipIf(skipTests)("Cerebras Qwen 3 Tests", () => {
  let client: Graphlit;
  let createdConversationIds: string[] = [];
  let createdSpecIds: string[] = [];
  let cerebrasSpecId: string;

  beforeEach(async () => {
    client = new Graphlit(
      process.env.GRAPHLIT_ORGANIZATION_ID,
      process.env.GRAPHLIT_ENVIRONMENT_ID,
      process.env.GRAPHLIT_JWT_SECRET,
    );
    createdConversationIds = [];
    createdSpecIds = [];

    // Create Cerebras Qwen 3 specification for testing
    const specResponse = await client.createSpecification({
      name: "Test Cerebras Qwen 3",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.Cerebras,
      cerebras: {
        model: Types.CerebrasModels.Qwen_3_32B,
      },
    });

    cerebrasSpecId = specResponse.createSpecification?.id!;
    createdSpecIds.push(cerebrasSpecId);
  });

  afterEach(async () => {
    // Clean up conversations
    for (const conversationId of createdConversationIds) {
      try {
        await client.deleteConversation(conversationId);
      } catch (error) {
        // Ignore errors - conversation might not exist
      }
    }

    // Clean up specifications
    for (const specId of createdSpecIds) {
      try {
        await client.deleteSpecification(specId);
      } catch (error) {
        // Ignore errors - spec might still be in use
      }
    }
  });

  describe("Without tools", () => {
    it("should work with simple prompts", async () => {
      const events: AgentStreamEvent[] = [];
      let finalMessage = "";

      await client.streamAgent(
        "What is the 2025 Home Run Derby? Just tell me what you know about it.",
        (event) => {
          events.push(event);
          
          if (event.type === "conversation_started") {
            createdConversationIds.push(event.conversationId);
          }
          
          if (event.type === "conversation_completed" && event.message) {
            finalMessage = event.message.message || "";
          }
        },
        undefined, // conversationId
        { id: cerebrasSpecId }, // specification
        undefined, // tools
        undefined, // toolHandlers
        undefined // options
      );

      expect(finalMessage).toBeTruthy();
      expect(events.some(e => e.type === "conversation_started")).toBe(true);
      expect(events.some(e => e.type === "conversation_completed")).toBe(true);
    });
  });

  describe("With tools", () => {
    it("should handle web search tool - or provide detailed error", async () => {
      const events: AgentStreamEvent[] = [];
      let error: Error | null = null;
      let errorDetails: any = null;

      // Mock tool handler
      const toolHandler = async (toolCall: any) => {
        console.log(`Tool called: ${toolCall.name}`, JSON.parse(toolCall.arguments));
        
        if (toolCall.name === 'webSearch') {
          return [
            {
              uri: "https://en.wikipedia.org/wiki/2025_Major_League_Baseball_Home_Run_Derby",
              text: "2025 Major League Baseball Home Run Derby - Wikipedia. Date: July 14, 2025. The 2025 Major League Baseball Home Run Derby is a home run hitting contest between eight batters from Major League Baseball (MLB).",
              title: "2025 Major League Baseball Home Run Derby - Wikipedia",
              score: 0.9039154,
              __typename: "WebSearchResult"
            },
            {
              uri: "https://www.mlb.com/news/2025-home-run-derby-results",
              text: "Cal Raleigh made history as the first catcher to win the T-Mobile Home Run Derby, defeating 22-year-old Junior Caminero in the finals on Monday",
              title: "2025 Home Run Derby results - MLB.com",
              score: 0.6829338,
              __typename: "WebSearchResult"
            }
          ];
        }
        
        return null;
      };

      try {
        await client.streamAgent(
          "Search for information about the 2025 Home Run Derby and tell me the key details.",
          (event) => {
            events.push(event);
            
            if (event.type === "conversation_started") {
              createdConversationIds.push(event.conversationId);
            }
            
            if (event.type === "error") {
              console.log("Error event:", event.error);
              errorDetails = event.error;
            }
            
            if (event.type === "tool_update") {
              console.log(`Tool update: ${event.toolCall.name} - ${event.status}`);
            }
          },
          undefined, // conversationId
          { id: cerebrasSpecId }, // specification
          [
            {
              name: 'webSearch',
              description: 'Search the web for information',
              schema: JSON.stringify({
                type: 'object',
                properties: {
                  query: {
                    type: 'string',
                    description: 'The search query'
                  },
                  limit: {
                    type: 'number',
                    description: 'Maximum number of results to return',
                    default: 5
                  }
                },
                required: ['query']
              })
            }
          ], // tools
          { webSearch: toolHandler } // toolHandlers
        );

        // If we get here, no error occurred
        expect(events.some(e => e.type === "conversation_completed")).toBe(true);
        
      } catch (err: any) {
        error = err;
        console.error("Caught error:", {
          message: err.message,
          status: err.status || err.statusCode,
          error: err.error,
          type: err.type,
          code: err.code
        });
      }

      // If we got an error, it should have more details than just "400 status code (no body)"
      if (error) {
        expect(error.message).toBeDefined();
        
        // Check if we're getting our enhanced error message
        if (error.message.includes("400 status code (no body)")) {
          console.error("Still getting generic error message - enhanced error handling not working");
        } else {
          console.log("Enhanced error message:", error.message);
        }
        
        // This test should fail since Cerebras doesn't support tools properly
        throw new Error(`Cerebras returned error: ${error.message}`);
      } else {
        // If no error, the request succeeded
        expect(events.some(e => e.type === "conversation_completed")).toBe(true);
      }
    });

    it("should handle many tools or show enhanced error details", async () => {
      let capturedError: any = null;

      try {
        // Send many tools to potentially trigger error
        const tools = Array.from({ length: 23 }, (_, i) => ({
          name: `tool${i}`,
          description: `Test tool ${i}`,
          schema: JSON.stringify({
            type: 'object',
            properties: {
              param: { type: 'string', description: `Parameter for tool ${i}` }
            },
            required: ['param']
          })
        }));

        await client.streamAgent(
          "Hello, please use a tool.",
          (event) => {
            if (event.type === "conversation_started") {
              createdConversationIds.push(event.conversationId);
            }
          },
          undefined, // conversationId
          { id: cerebrasSpecId }, // specification
          tools // tools
        );

      } catch (error: any) {
        capturedError = error;
      }

      if (capturedError) {
        console.log("=== Error Details ===");
        console.log("Message:", capturedError.message);
        console.log("Status:", capturedError.status || capturedError.statusCode);
        
        // Verify we're getting better error details
        expect(capturedError.message).toBeDefined();
        expect(capturedError.message).not.toBe("400 status code (no body)");
        
        // We got a 400 error, which means Cerebras rejected our request
        throw new Error(`Cerebras returned 400 error: ${capturedError.message}`);
      } else {
        // No error means the request succeeded, which is also fine
        console.log("No error - request succeeded with many tools");
      }
    });
  });
});
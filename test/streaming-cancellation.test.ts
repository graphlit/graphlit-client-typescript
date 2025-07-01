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
const skipTests = !process.env.GRAPHLIT_ORGANIZATION_ID || 
                 !process.env.GRAPHLIT_ENVIRONMENT_ID || 
                 !process.env.GRAPHLIT_JWT_SECRET;

describe.skipIf(skipTests)("Streaming Cancellation Tests", () => {
  let client: Graphlit;
  let createdSpecIds: string[] = [];
  let createdConversationIds: string[] = [];

  beforeEach(() => {
    client = new Graphlit(
      process.env.GRAPHLIT_ORGANIZATION_ID,
      process.env.GRAPHLIT_ENVIRONMENT_ID,
      process.env.GRAPHLIT_JWT_SECRET,
    );
    createdSpecIds = [];
    createdConversationIds = [];
  });

  afterEach(async () => {
    // First delete conversations
    for (const conversationId of createdConversationIds) {
      try {
        await client.deleteConversation(conversationId);
      } catch (error) {
        // Ignore errors - conversation might not exist
      }
    }
    
    // Then delete specifications
    for (const specId of createdSpecIds) {
      try {
        await client.deleteSpecification(specId);
      } catch (error) {
        // Ignore errors - spec might still be in use
      }
    }
  });

  describe("AbortController cancellation", () => {
    it("should cancel streamAgent when abort signal is triggered", async () => {
      const abortController = new AbortController();
      const events: AgentStreamEvent[] = [];
      let error: Error | null = null;

      // Create a simple specification
      const specResponse = await client.createSpecification({
        name: "Test Cancellation Spec",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4OMini_128K,
          temperature: 0.7,
        },
      });

      const specId = specResponse.createSpecification?.id;
      expect(specId).toBeDefined();
      createdSpecIds.push(specId!);

      // Start streaming with a long prompt that will take time
      const streamPromise = client.streamAgent(
        "Write a very detailed essay about the history of computer science, including all major milestones, key figures, and technological breakthroughs. Make it at least 1000 words.",
        (event) => {
          events.push(event);
          
          // Capture conversation ID
          if (event.type === "conversation_started") {
            createdConversationIds.push(event.conversationId);
          }
          
          // Cancel after receiving the first message update
          if (event.type === "message_update" && events.filter(e => e.type === "message_update").length === 2) {
            abortController.abort();
          }
        },
        undefined, // conversationId
        { id: specId }, // specification
        undefined, // tools
        undefined, // toolHandlers
        { abortSignal: abortController.signal } // options with abort signal
      ).catch((e) => {
        error = e;
      });

      await streamPromise;

      // Verify cancellation behavior
      expect(events.some(e => e.type === "conversation_started")).toBe(true);
      expect(events.some(e => e.type === "message_update")).toBe(true);
      
      // Should not have completed normally if aborted early
      const hasCompleted = events.some(e => e.type === "conversation_completed");
      
      // Either we aborted successfully (no completion) or got an abort error
      if (hasCompleted) {
        // If it completed, the message should be cut short
        const lastMessage = events.filter(e => e.type === "message_update").pop();
        expect(lastMessage?.message.message.length).toBeLessThan(1000); // Should be incomplete
      } else {
        // Should have received an abort error
        expect(error).toBeDefined();
        expect(error?.message || error?.name).toMatch(/abort/i);
      }
    }, 30000);

    it("should handle immediate cancellation gracefully", async () => {
      const abortController = new AbortController();
      const events: AgentStreamEvent[] = [];
      let error: Error | null = null;

      // Create a specification
      const specResponse = await client.createSpecification({
        name: "Test Immediate Cancel Spec",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4OMini_128K,
          temperature: 0.7,
        },
      });

      const specId = specResponse.createSpecification?.id;
      expect(specId).toBeDefined();
      createdSpecIds.push(specId!);

      // Abort immediately
      abortController.abort();

      // Try to stream with already aborted signal
      await client.streamAgent(
        "Hello",
        (event) => {
          events.push(event);
          if (event.type === "conversation_started") {
            createdConversationIds.push(event.conversationId);
          }
        },
        undefined,
        { id: specId },
        undefined,
        undefined,
        { abortSignal: abortController.signal }
      ).catch((e) => {
        error = e;
      });

      // Should fail immediately with abort error
      expect(error).toBeDefined();
      expect(error?.message || error?.name).toMatch(/abort/i);
      expect(events.length).toBe(0); // No events should be emitted
    }, 10000);

    it("should allow multiple streams with different abort controllers", async () => {
      const controller1 = new AbortController();
      const controller2 = new AbortController();
      const events1: AgentStreamEvent[] = [];
      const events2: AgentStreamEvent[] = [];

      // Create specifications
      const spec1Response = await client.createSpecification({
        name: "Test Multi Stream Spec 1",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4OMini_128K,
          temperature: 0.7,
        },
      });

      const spec2Response = await client.createSpecification({
        name: "Test Multi Stream Spec 2",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4OMini_128K,
          temperature: 0.7,
        },
      });

      const specId1 = spec1Response.createSpecification?.id!;
      const specId2 = spec2Response.createSpecification?.id!;
      createdSpecIds.push(specId1, specId2);

      // Start two streams concurrently
      const stream1Promise = client.streamAgent(
        "Write a very long essay about quantum physics, including detailed explanations of quantum mechanics, quantum entanglement, and quantum computing. Make it at least 2000 words.",
        (event) => {
          events1.push(event);
          if (event.type === "conversation_started") {
            createdConversationIds.push(event.conversationId);
          }
          // Cancel stream 1 after receiving some content
          if (event.type === "message_update" && event.message.message.length > 100) {
            controller1.abort();
          }
        },
        undefined,
        { id: specId1 },
        undefined,
        undefined,
        { abortSignal: controller1.signal }
      ).catch(() => {});

      const stream2Promise = client.streamAgent(
        "Say hello",
        (event) => {
          events2.push(event);
          if (event.type === "conversation_started") {
            createdConversationIds.push(event.conversationId);
          }
        },
        undefined,
        { id: specId2 },
        undefined,
        undefined,
        { abortSignal: controller2.signal }
      );

      await Promise.all([stream1Promise, stream2Promise]);

      // Stream 1 should have started
      expect(events1.some(e => e.type === "conversation_started")).toBe(true);
      
      // Stream 1 should either be cancelled or have a truncated message
      const stream1Completed = events1.some(e => e.type === "conversation_completed");
      if (stream1Completed) {
        // If it completed, the message should be relatively short (aborted early)
        const lastMessage1 = events1.filter(e => e.type === "message_update").pop();
        expect(lastMessage1?.message.message.length).toBeLessThan(500);
      }

      // Stream 2 should complete normally
      expect(events2.some(e => e.type === "conversation_started")).toBe(true);
      expect(events2.some(e => e.type === "conversation_completed")).toBe(true);
    }, 30000);
  });

  describe("Provider-specific cancellation", () => {
    it("should cancel OpenAI streaming correctly", async () => {
      const abortController = new AbortController();
      let messageLength = 0;

      // Create OpenAI specification
      const specResponse = await client.createSpecification({
        name: "Test OpenAI Cancel",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4OMini_128K,
          temperature: 0.7,
        },
      });

      const specId = specResponse.createSpecification?.id!;
      createdSpecIds.push(specId);

      await client.streamAgent(
        "Generate a long story",
        (event) => {
          if (event.type === "conversation_started") {
            createdConversationIds.push(event.conversationId);
          }
          if (event.type === "message_update") {
            messageLength = event.message.message.length;
            // Cancel after receiving some content
            if (messageLength > 50) {
              abortController.abort();
            }
          }
        },
        undefined,
        { id: specId },
        undefined,
        undefined,
        { abortSignal: abortController.signal }
      ).catch(() => {});

      // Message should be partially generated
      expect(messageLength).toBeGreaterThan(50);
      expect(messageLength).toBeLessThan(500); // Should not complete full story
    }, 20000);

    // Add similar tests for other providers if needed
  });

  describe("Error handling during cancellation", () => {
    it("should handle cancellation during tool calls", async () => {
      const abortController = new AbortController();
      const events: AgentStreamEvent[] = [];

      // Define a test tool
      const testTool: Types.ToolDefinitionInput = {
        name: "slowOperation",
        description: "A slow operation that can be cancelled",
        schema: JSON.stringify({
          type: "object",
          properties: {
            duration: { type: "number" },
          },
          required: ["duration"],
        }),
      };

      const toolHandlers = {
        slowOperation: async (args: { duration: number }) => {
          // Simulate slow operation
          await new Promise(resolve => setTimeout(resolve, args.duration));
          return { result: "completed" };
        },
      };

      // Create specification
      const specResponse = await client.createSpecification({
        name: "Test Tool Cancel",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4OMini_128K,
          temperature: 0,
        },
      });

      const specId = specResponse.createSpecification?.id!;
      createdSpecIds.push(specId);

      await client.streamAgent(
        "Use the slowOperation tool with duration 5000",
        (event) => {
          events.push(event);
          if (event.type === "conversation_started") {
            createdConversationIds.push(event.conversationId);
          }
          // Cancel during tool execution
          if (event.type === "tool_update" && event.status === "executing") {
            abortController.abort();
          }
        },
        undefined,
        { id: specId },
        [testTool],
        toolHandlers,
        { abortSignal: abortController.signal }
      ).catch(() => {});

      // Should have started but not completed
      expect(events.some(e => e.type === "conversation_started")).toBe(true);
      expect(events.some(e => e.type === "tool_update" && e.status === "executing")).toBe(true);
      expect(events.some(e => e.type === "conversation_completed")).toBe(false);
    }, 20000);
  });
});
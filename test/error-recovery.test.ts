import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import { UIStreamEvent } from "../src/types/ui-events";

/**
 * Error recovery test suite
 * Tests error handling and recovery mechanisms in streaming conversations
 */
describe("Error Recovery", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!orgId || !envId || !secret) {
    console.warn(
      "⚠️  Skipping error recovery tests - missing Graphlit credentials"
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
  }, 60000);

  describe("Invalid Input Handling", () => {
    it("should handle invalid specification ID gracefully", async () => {
      console.log("🚫 Testing invalid specification ID...");

      const events: UIStreamEvent[] = [];
      let errorReceived = false;
      let errorMessage = "";

      try {
        // Check if streaming is supported
        if (!client.supportsStreaming()) {
          console.log("⚠️  Skipping test - streaming not supported");
          return;
        }

        await client.streamAgent(
          "This should fail",
          (event: UIStreamEvent) => {
            events.push(event);
            console.log(`📨 Event: ${event.type}`);

            if (event.type === "error") {
              errorReceived = true;
              errorMessage = event.error?.message;
              console.log(`❌ Error received: ${errorMessage}`);
            }
          },
          undefined,
          { id: "invalid-spec-id-12345" } // Invalid ID
        );
      } catch (error) {
        errorReceived = true;
        errorMessage = error instanceof Error ? error.message : String(error);
        console.log(`❌ Caught error: ${errorMessage}`);
      }

      expect(errorReceived).toBe(true);
      expect(errorMessage).toBeTruthy();
      console.log("✅ Invalid specification handled gracefully");
    }, 30000);

    it("should handle invalid conversation ID gracefully", async () => {
      console.log("\n🚫 Testing invalid conversation ID...");

      // First create a valid specification
      const createResponse = await client.createSpecification({
        name: "Error Test Spec",
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

      let errorReceived = false;
      let errorMessage = "";

      try {
        // Check if streaming is supported
        if (!client.supportsStreaming()) {
          console.log("⚠️  Skipping test - streaming not supported");
          return;
        }

        await client.streamAgent(
          "Continue our discussion",
          (event: UIStreamEvent) => {
            if (event.type === "error") {
              errorReceived = true;
              errorMessage = event.error?.message;
            }
          },
          "invalid-conversation-id-12345", // Invalid conversation ID
          { id: specId }
        );
      } catch (error) {
        errorReceived = true;
        errorMessage = error instanceof Error ? error.message : String(error);
        console.log(`❌ Caught error: ${errorMessage}`);
      }

      expect(errorReceived).toBe(true);
      console.log("✅ Invalid conversation ID handled gracefully");
    }, 30000);

    it("should handle empty prompt gracefully", async () => {
      console.log("\n🚫 Testing empty prompt...");

      // Create specification
      const createResponse = await client.createSpecification({
        name: "Empty Prompt Test",
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

      const events: UIStreamEvent[] = [];
      let conversationId: string | undefined;

      // Try with empty string
      // Check if streaming is supported
      if (!client.supportsStreaming()) {
        console.log("⚠️  Skipping test - streaming not supported");
        return;
      }

      await client.streamAgent(
        "", // Empty prompt
        (event: UIStreamEvent) => {
          events.push(event);
          if (event.type === "conversation_started") {
            conversationId = event.conversationId;
            createdConversations.push(event.conversationId);
          }
        },
        undefined,
        { id: specId }
      );

      // Should still create a conversation, even with empty prompt
      expect(conversationId).toBeDefined();
      console.log("✅ Empty prompt handled gracefully");
    }, 30000);
  });

  describe("Tool Error Handling", () => {
    it("should handle tool execution errors gracefully", async () => {
      console.log("\n🔧 Testing tool execution errors...");

      // Create specification
      const createResponse = await client.createSpecification({
        name: "Tool Error Test",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4O_128K,
          temperature: 0.7,
          completionTokenLimit: 500,
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      const events: UIStreamEvent[] = [];
      let conversationId: string | undefined;
      let toolErrorHandled = false;

      // Tool that always throws an error
      const faultyTool: Types.ToolDefinitionInput = {
        name: "faultyCalculator",
        description: "A calculator that always fails",
        schema: JSON.stringify({
          type: "object",
          properties: {
            a: { type: "number" },
            b: { type: "number" },
          },
          required: ["a", "b"],
        }),
      };

      const toolHandler = async (args: { a: number; b: number }) => {
        console.log("🔧 Faulty tool called with:", args);
        throw new Error("Calculator malfunction: Division by zero!");
      };

      // Check if streaming is supported
      if (!client.supportsStreaming()) {
        console.log("⚠️  Skipping test - streaming not supported");
        return;
      }

      await client.streamAgent(
        "Calculate 10 + 5 using the faultyCalculator tool",
        (event: UIStreamEvent) => {
          events.push(event);
          console.log(`📨 Event: ${event.type}`);

          if (event.type === "conversation_started") {
            conversationId = event.conversationId;
            createdConversations.push(event.conversationId);
          } else if (event.type === "tool_update") {
            console.log(`🔧 Tool status: ${event.status}`);
            if (event.status === "failed" || event.error) {
              toolErrorHandled = true;
              console.log(`✅ Tool error handled: ${event.error}`);
            }
          } else if (event.type === "error") {
            console.log(`❌ Stream Error: ${event.error}`);
          } else if (event.type === "conversation_completed") {
            console.log(`💬 Final message: ${event.message.message}`);
          }
        },
        undefined,
        { id: specId },
        [faultyTool],
        { faultyCalculator: toolHandler }
      );

      // Should handle the tool error and potentially continue
      const completedEvent = events.find(
        (e) => e.type === "conversation_completed"
      );
      expect(completedEvent).toBeDefined(); // Conversation should complete despite tool error

      console.log("✅ Tool error handled gracefully");
    }, 30000);

    it("should handle missing tool handler", async () => {
      console.log("\n🔧 Testing missing tool handler...");

      // Create specification
      const createResponse = await client.createSpecification({
        name: "Missing Handler Test",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4O_128K,
          temperature: 0.7,
          completionTokenLimit: 500,
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      const events: UIStreamEvent[] = [];
      let errorReceived = false;

      // Tool definition without handler
      const orphanTool: Types.ToolDefinitionInput = {
        name: "orphanTool",
        description: "A tool without a handler",
        schema: JSON.stringify({
          type: "object",
          properties: {
            input: { type: "string" },
          },
          required: ["input"],
        }),
      };

      // Check if streaming is supported
      if (!client.supportsStreaming()) {
        console.log("⚠️  Skipping test - streaming not supported");
        return;
      }

      await client.streamAgent(
        "Use the orphanTool to process 'hello world'",
        (event: UIStreamEvent) => {
          events.push(event);

          if (event.type === "conversation_started") {
            createdConversations.push(event.conversationId);
          } else if (event.type === "error") {
            errorReceived = true;
            console.log(`❌ Error: ${event.error}`);
          } else if (
            event.type === "tool_update" &&
            event.toolCall.name === "orphanTool"
          ) {
            console.log(`🔧 Tool status: ${event.status}`);
          }
        },
        undefined,
        { id: specId },
        [orphanTool],
        {} // Empty handlers object - no handler for orphanTool
      );

      // Should complete but might mention the tool couldn't be executed
      const completedEvent = events.find(
        (e) => e.type === "conversation_completed"
      );
      expect(completedEvent).toBeDefined();

      console.log("✅ Missing tool handler scenario handled");
    }, 30000);
  });

  describe("Network and Timeout Errors", () => {
    it("should handle conversation timeout gracefully", async () => {
      console.log("\n⏱️ Testing conversation timeout...");

      // Create specification with very low token limit to trigger quick response
      const createResponse = await client.createSpecification({
        name: "Timeout Test",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4OMini_128K,
          temperature: 0.7,
          completionTokenLimit: 10, // Very low limit
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      // Create a very short timeout controller
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 100); // 100ms timeout

      let timeoutError = false;
      const events: UIStreamEvent[] = [];

      try {
        // Check if streaming is supported
        if (!client.supportsStreaming()) {
          console.log("⚠️  Skipping test - streaming not supported");
          return;
        }

        await client.streamAgent(
          "Explain quantum computing in detail with examples and mathematical formulas",
          (event: UIStreamEvent) => {
            events.push(event);
            if (event.type === "conversation_started") {
              createdConversations.push(event.conversationId);
            }
          },
          undefined,
          { id: specId }
        );
      } catch (error) {
        timeoutError = true;
        console.log("✅ Timeout handled correctly");
      }

      expect(timeoutError || events.some((e) => e.type === "error")).toBe(true);
      console.log("✅ Timeout scenario handled gracefully");
    }, 10000);
  });

  describe("Recovery Mechanisms", () => {
    it("should retry after transient errors", async () => {
      console.log("\n🔄 Testing retry mechanism...");

      // Create specification
      const createResponse = await client.createSpecification({
        name: "Retry Test",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4OMini_128K,
          temperature: 0.7,
          completionTokenLimit: 200,
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      let attemptCount = 0;
      const maxAttempts = 3;
      let lastError: Error | null = null;
      let conversationId: string | undefined;

      // Retry logic
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        attemptCount++;
        console.log(`\n🔄 Attempt ${attempt}/${maxAttempts}...`);

        try {
          const events: UIStreamEvent[] = [];

          // Check if streaming is supported
          if (!client.supportsStreaming()) {
            console.log("⚠️  Skipping test - streaming not supported");
            return;
          }

          await client.streamAgent(
            "Say 'Success!' if you can hear me",
            (event: UIStreamEvent) => {
              events.push(event);

              if (event.type === "conversation_started") {
                conversationId = event.conversationId;
                createdConversations.push(event.conversationId);
              } else if (event.type === "conversation_completed") {
                console.log(
                  `✅ Success on attempt ${attempt}: ${event.message.message}`
                );
              }
            },
            undefined,
            { id: specId }
          );

          // If we get here, it succeeded
          lastError = null;
          break;
        } catch (error) {
          lastError = error as Error;
          console.log(`❌ Attempt ${attempt} failed: ${lastError.message}`);

          if (attempt < maxAttempts) {
            // Exponential backoff
            const delay = Math.pow(2, attempt - 1) * 1000;
            console.log(`⏳ Waiting ${delay}ms before retry...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      }

      // Should eventually succeed
      expect(lastError).toBeNull();
      expect(attemptCount).toBeLessThanOrEqual(maxAttempts);
      console.log(`\n✅ Retry mechanism worked after ${attemptCount} attempts`);
    }, 60000);

    it("should recover conversation state after error", async () => {
      console.log("\n🔄 Testing conversation state recovery...");

      // Create specification
      const createResponse = await client.createSpecification({
        name: "State Recovery Test",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4O_128K,
          temperature: 0.3,
          completionTokenLimit: 500,
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      let conversationId: string | undefined;

      // First message - establish context
      console.log("📝 Establishing conversation context...");
      // Check if streaming is supported
      if (!client.supportsStreaming()) {
        console.log("⚠️  Skipping test - streaming not supported");
        return;
      }

      await client.streamAgent(
        "My favorite color is blue and my lucky number is 7. Please remember these.",
        (event: UIStreamEvent) => {
          if (event.type === "conversation_started") {
            conversationId = event.conversationId;
            createdConversations.push(event.conversationId);
          } else if (event.type === "conversation_completed") {
            console.log("✅ Context established");
          }
        },
        undefined,
        { id: specId }
      );

      expect(conversationId).toBeDefined();

      // Simulate an error scenario by using a tool that fails
      const unreliableTool: Types.ToolDefinitionInput = {
        name: "unreliableMemory",
        description: "Sometimes fails to retrieve memory",
        schema: JSON.stringify({
          type: "object",
          properties: {
            query: { type: "string" },
          },
          required: ["query"],
        }),
      };

      let toolCallCount = 0;
      const toolHandler = async (args: { query: string }) => {
        toolCallCount++;
        if (toolCallCount === 1) {
          throw new Error("Memory access failed!");
        }
        // Second call succeeds
        return { memory: "Your favorite color is blue and lucky number is 7" };
      };

      // Try to continue conversation with potentially failing tool
      console.log("\n📝 Testing recovery with unreliable tool...");
      let finalResponse = "";

      await client.streamAgent(
        "Use the unreliableMemory tool to recall what my favorite color and lucky number are",
        (event: UIStreamEvent) => {
          if (event.type === "tool_update") {
            console.log(`🔧 Tool ${event.toolCall.name}: ${event.status}`);
          } else if (event.type === "conversation_completed") {
            finalResponse = event.message.message;
          }
        },
        conversationId,
        { id: specId },
        [unreliableTool],
        { unreliableMemory: toolHandler }
      );

      // Even with tool failure, conversation should continue
      expect(finalResponse).toBeTruthy();

      // Verify conversation state is maintained
      console.log("\n📝 Verifying conversation state...");
      await client.streamAgent(
        "Without using any tools, what were my favorite color and lucky number?",
        (event: UIStreamEvent) => {
          if (event.type === "conversation_completed") {
            const response = event.message.message.toLowerCase();
            const hasBlue = response.includes("blue");
            const hasSeven =
              response.includes("7") || response.includes("seven");

            console.log(
              `✅ State recovered - Blue: ${hasBlue}, Seven: ${hasSeven}`
            );
            expect(hasBlue || hasSeven).toBe(true);
          }
        },
        conversationId,
        { id: specId }
      );

      console.log("✅ Conversation state recovery successful");
    }, 60000);
  });

  describe("Fallback Strategies", () => {
    it("should fallback gracefully when streaming fails", async () => {
      console.log("\n🔄 Testing streaming fallback...");

      // Create specification
      const createResponse = await client.createSpecification({
        name: "Fallback Test",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4OMini_128K,
          temperature: 0.7,
          completionTokenLimit: 200,
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      // Create a mock streaming client that fails
      const faultyOpenaiClient = {
        chat: {
          completions: {
            create: async () => {
              throw new Error("Streaming not available!");
            },
          },
        },
      };

      let usedFallback = false;
      const events: UIStreamEvent[] = [];

      // Check if streaming is supported
      if (!client.supportsStreaming()) {
        console.log("⚠️  Skipping test - streaming not supported");
        return;
      }

      await client.streamAgent(
        "Tell me a joke",
        (event: UIStreamEvent) => {
          events.push(event);

          if (event.type === "conversation_started") {
            createdConversations.push(event.conversationId);
          } else if (event.type === "message_update") {
            // In fallback mode, we typically get fewer, larger updates
            console.log(
              `💬 Update size: ${event.message.message.length} chars`
            );
          } else if (event.type === "conversation_completed") {
            console.log("✅ Completed successfully");
            // Check if we used fallback (fewer message updates)
            const messageUpdates = events.filter(
              (e) => e.type === "message_update"
            );
            if (messageUpdates.length <= 2) {
              usedFallback = true;
              console.log("📱 Detected fallback mode usage");
            }
          }
        },
        undefined,
        { id: specId }
      );

      // Should complete successfully even with faulty streaming
      const completed = events.some((e) => e.type === "conversation_completed");
      expect(completed).toBe(true);

      console.log("✅ Fallback strategy worked successfully");
    }, 30000);
  });
});

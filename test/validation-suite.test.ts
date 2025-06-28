import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { GraphlitClient } from "../src/index.js";
import * as Types from "../src/generated/graphql-types.js";
import { TEST_MODELS, TestModelConfig } from "./test-models.js";
import { clearEnvironment } from "./setup.js";

describe("Validation Test Suite", () => {
  let client: GraphlitClient;

  beforeAll(async () => {
    await clearEnvironment();
    client = new GraphlitClient();
  });

  afterAll(async () => {
    await clearEnvironment();
  });

  describe("Quick Provider Validation", () => {
    // Select one model from each provider for quick validation
    const validationModels = [
      TEST_MODELS.find((m) => m.name === "OpenAI GPT-4o Mini"),
      TEST_MODELS.find((m) => m.name === "Anthropic Claude 3.5 Haiku"),
      TEST_MODELS.find((m) => m.name === "Google Gemini 2.5 Flash"),
      TEST_MODELS.find((m) => m.name === "Groq LLaMA 3.3 70B"),
      TEST_MODELS.find((m) => m.name === "Cohere Command R"),
      TEST_MODELS.find((m) => m.name === "Mistral Large"),
      TEST_MODELS.find((m) => m.name === "Deepseek Chat"),
    ].filter(Boolean) as TestModelConfig[];

    it.each(validationModels)(
      "should validate basic streaming with $name",
      async ({ config }) => {
        const conversationId = await client.createConversation();
        const specification = await client.createSpecification(config);

        let tokenCount = 0;
        let messageStarted = false;
        let messageCompleted = false;

        const result = await client.streamAgent({
          conversationId,
          specificationId: specification.id,
          messagePrompt: "Say 'Hello from [your model name]' where [your model name] is your actual model name.",
          onEvent: (event) => {
            if (event.type === "message_start") {
              messageStarted = true;
            } else if (event.type === "token") {
              tokenCount++;
            } else if (event.type === "message_complete") {
              messageCompleted = true;
            }
          },
        });

        expect(result.messageText).toBeTruthy();
        expect(messageStarted).toBe(true);
        expect(messageCompleted).toBe(true);
        expect(tokenCount).toBeGreaterThan(0);
        expect(result.messageText.toLowerCase()).toMatch(/hello/);
      },
      { timeout: 30000 },
    );
  });

  describe("README Example Validation", () => {
    it("should execute basic usage example", async () => {
      // This mirrors the basic example from README
      const conversationId = await client.createConversation();
      const specificationId = await client.createSpecification({
        name: "Test OpenAI GPT-4o Mini",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4OMini_128K,
        },
      });

      const result = await client.streamAgent({
        conversationId,
        specificationId: specificationId.id,
        messagePrompt: "What is the capital of France?",
      });

      expect(result.messageText).toBeTruthy();
      expect(result.messageText.toLowerCase()).toMatch(/paris/);
    });

    it("should execute streaming with events example", async () => {
      const conversationId = await client.createConversation();
      const specificationId = await client.createSpecification({
        name: "Test Streaming",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4OMini_128K,
        },
      });

      let events: string[] = [];

      const result = await client.streamAgent({
        conversationId,
        specificationId: specificationId.id,
        messagePrompt: "Count to 3",
        onEvent: (event) => {
          events.push(event.type);
        },
      });

      expect(result.messageText).toBeTruthy();
      expect(events).toContain("message_start");
      expect(events).toContain("token");
      expect(events).toContain("message_complete");
    });

    it("should execute tool calling example", async () => {
      const tools: Types.ToolDefinitionInput[] = [
        {
          name: "get_weather",
          description: "Get the weather for a location",
          schema: JSON.stringify({
            type: "object",
            properties: {
              location: { type: "string" },
            },
            required: ["location"],
          }),
        },
      ];

      const conversationId = await client.createConversation();
      const specificationId = await client.createSpecification({
        name: "Test Tool Calling",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4OMini_128K,
        },
      });

      let toolCalled = false;

      const result = await client.streamAgent({
        conversationId,
        specificationId: specificationId.id,
        messagePrompt: "What's the weather in Paris?",
        tools,
        toolHandler: async (call) => {
          toolCalled = true;
          expect(call.name).toBe("get_weather");
          const args = JSON.parse(call.arguments);
          expect(args.location.toLowerCase()).toMatch(/paris/);
          return { temperature: 22, condition: "Sunny" };
        },
      });

      expect(result.messageText).toBeTruthy();
      expect(toolCalled).toBe(true);
      expect(result.messageText).toMatch(/22|sunny/i);
    });

    it("should validate different model configurations", async () => {
      // Test that we can create specifications for different providers
      const providers = [
        {
          serviceType: Types.ModelServiceTypes.OpenAi,
          openAI: { model: Types.OpenAiModels.Gpt4OMini_128K },
        },
        {
          serviceType: Types.ModelServiceTypes.Anthropic,
          anthropic: { model: Types.AnthropicModels.Claude_3_5Haiku },
        },
        {
          serviceType: Types.ModelServiceTypes.Google,
          google: { model: Types.GoogleModels.Gemini_2_5FlashPreview },
        },
      ];

      for (const config of providers) {
        const spec = await client.createSpecification({
          name: `Test ${config.serviceType}`,
          type: Types.SpecificationTypes.Completion,
          ...config,
        });

        expect(spec.id).toBeTruthy();
        expect(spec.serviceType).toBe(config.serviceType);
      }
    });
  });

  describe("API Method Validation", () => {
    it("should validate conversation management", async () => {
      // Create conversation
      const conversationId = await client.createConversation("Test Conversation");
      expect(conversationId).toBeTruthy();

      // Get conversation
      const conversation = await client.getConversation(conversationId);
      expect(conversation.id).toBe(conversationId);
      expect(conversation.name).toBe("Test Conversation");

      // Update conversation
      const updated = await client.updateConversation(conversationId, {
        name: "Updated Conversation",
      });
      expect(updated.name).toBe("Updated Conversation");

      // Delete conversation
      const deleted = await client.deleteConversation(conversationId);
      expect(deleted).toBe(conversationId);
    });

    it("should validate specification management", async () => {
      // Create specification
      const spec = await client.createSpecification({
        name: "Test Spec",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4OMini_128K,
          temperature: 0.7,
        },
      });
      expect(spec.id).toBeTruthy();
      expect(spec.name).toBe("Test Spec");

      // Get specification
      const fetched = await client.getSpecification(spec.id);
      expect(fetched.id).toBe(spec.id);
      expect(fetched.openAI?.temperature).toBe(0.7);

      // Update specification
      const updated = await client.updateSpecification(spec.id, {
        name: "Updated Spec",
        openAI: {
          temperature: 0.5,
        },
      });
      expect(updated.name).toBe("Updated Spec");
      expect(updated.openAI?.temperature).toBe(0.5);

      // Delete specification
      const deleted = await client.deleteSpecification(spec.id);
      expect(deleted).toBe(spec.id);
    });
  });
});
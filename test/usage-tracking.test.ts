import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import { AgentStreamEvent } from "../src/types/ui-events";
import { TokenUsage } from "../src/types/token-usage";
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

describe.skipIf(skipTests)("Usage Tracking Integration Tests", () => {
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
    // Clean up conversations first
    for (const conversationId of createdConversationIds) {
      try {
        await client.deleteConversation(conversationId);
      } catch (error) {
        // Ignore errors
      }
    }

    // Clean up specifications
    for (const specId of createdSpecIds) {
      try {
        await client.deleteSpecification(specId);
      } catch (error) {
        // Ignore errors
      }
    }
  });

  describe("OpenAI Usage Tracking", () => {
    it("should track token usage for OpenAI streaming", async () => {
      const usageData: TokenUsage[] = [];
      let finalUsage: TokenUsage | undefined;

      // Create OpenAI specification
      const specResponse = await client.createSpecification({
        name: "Test OpenAI Usage Tracking",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4OMini_128K,
          temperature: 0.7,
          completionTokenLimit: 100,
        },
      });

      const specId = specResponse.createSpecification?.id;
      expect(specId).toBeDefined();
      createdSpecIds.push(specId!);

      await client.streamAgent(
        "Write a short paragraph about artificial intelligence.",
        (event: AgentStreamEvent) => {
          if (event.type === "conversation_started") {
            createdConversationIds.push(event.conversationId);
          } else if (event.type === "conversation_completed") {
            if (event.usage) {
              finalUsage = event.usage;
              usageData.push(event.usage);
            }
          }
        },
        undefined,
        { id: specId },
      );

      // Verify usage data was captured
      expect(finalUsage).toBeDefined();
      expect(finalUsage?.promptTokens).toBeGreaterThan(0);
      expect(finalUsage?.completionTokens).toBeGreaterThan(0);
      expect(finalUsage?.totalTokens).toBeGreaterThan(0);
      expect(finalUsage?.totalTokens).toBe(
        finalUsage?.promptTokens + finalUsage?.completionTokens,
      );
      expect(finalUsage?.provider).toBe("OPEN_AI");
      expect(finalUsage?.model).toBeDefined();

      console.log(`\n📊 OpenAI Usage:`, finalUsage);
    }, 30000);

    it("should track usage for multiple OpenAI models", async () => {
      const models = [
        {
          name: "GPT-4o Mini",
          model: Types.OpenAiModels.Gpt4OMini_128K,
        },
        {
          name: "GPT-4o",
          model: Types.OpenAiModels.Gpt4O_128K,
        },
      ];

      const results: Array<{
        model: string;
        usage: TokenUsage;
      }> = [];

      for (const { name, model } of models) {
        const specResponse = await client.createSpecification({
          name: `Test ${name} Usage`,
          type: Types.SpecificationTypes.Completion,
          serviceType: Types.ModelServiceTypes.OpenAi,
          openAI: {
            model: model,
            temperature: 0.7,
            completionTokenLimit: 50,
          },
        });

        const specId = specResponse.createSpecification?.id;
        expect(specId).toBeDefined();
        createdSpecIds.push(specId!);

        let modelUsage: TokenUsage | undefined;

        await client.streamAgent(
          "Count from 1 to 5.",
          (event: AgentStreamEvent) => {
            if (event.type === "conversation_started") {
              createdConversationIds.push(event.conversationId);
            } else if (event.type === "conversation_completed" && event.usage) {
              modelUsage = event.usage;
            }
          },
          undefined,
          { id: specId },
        );

        expect(modelUsage).toBeDefined();
        results.push({ model: name, usage: modelUsage! });
      }

      // Display usage comparison
      console.log("\n📊 OpenAI Model Usage Comparison:");
      console.log(
        "┌─────────────────┬──────────────┬─────────────────┬──────────────┐",
      );
      console.log(
        "│ Model           │ Prompt Tokens│ Completion Tokens│ Total Tokens │",
      );
      console.log(
        "├─────────────────┼──────────────┼─────────────────┼──────────────┤",
      );

      for (const { model, usage } of results) {
        const modelName = model.padEnd(15);
        const promptTokens = usage.promptTokens.toString().padEnd(12);
        const completionTokens = usage.completionTokens.toString().padEnd(15);
        const totalTokens = usage.totalTokens.toString().padEnd(12);

        console.log(
          `│ ${modelName} │ ${promptTokens} │ ${completionTokens} │ ${totalTokens} │`,
        );
      }
      console.log(
        "└─────────────────┴──────────────┴─────────────────┴──────────────┘",
      );

      // All models should have usage data
      expect(results.every((r) => r.usage.promptTokens > 0)).toBe(true);
      expect(results.every((r) => r.usage.completionTokens > 0)).toBe(true);
      expect(results.every((r) => r.usage.totalTokens > 0)).toBe(true);
    }, 60000);
  });

  describe("Anthropic Usage Tracking", () => {
    it("should track token usage for Anthropic streaming", async () => {
      let finalUsage: TokenUsage | undefined;

      // Create Anthropic specification
      const specResponse = await client.createSpecification({
        name: "Test Anthropic Usage Tracking",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.Anthropic,
        anthropic: {
          model: Types.AnthropicModels.Claude_3_5Sonnet,
          temperature: 0.7,
          completionTokenLimit: 100,
        },
      });

      const specId = specResponse.createSpecification?.id;
      expect(specId).toBeDefined();
      createdSpecIds.push(specId!);

      await client.streamAgent(
        "Write a short paragraph about machine learning.",
        (event: AgentStreamEvent) => {
          if (event.type === "conversation_started") {
            createdConversationIds.push(event.conversationId);
          } else if (event.type === "conversation_completed" && event.usage) {
            finalUsage = event.usage;
          }
        },
        undefined,
        { id: specId },
      );

      // Verify usage data was captured
      expect(finalUsage).toBeDefined();
      expect(finalUsage?.promptTokens).toBeGreaterThan(0);
      expect(finalUsage?.completionTokens).toBeGreaterThan(0);
      expect(finalUsage?.totalTokens).toBeGreaterThan(0);
      expect(finalUsage?.provider).toBe("ANTHROPIC");
      expect(finalUsage?.model).toBeDefined();

      console.log(`\n📊 Anthropic Usage:`, finalUsage);
    }, 30000);
  });

  describe("Google Usage Tracking", () => {
    it("should track token usage for Google streaming", async () => {
      let finalUsage: TokenUsage | undefined;

      // Create Google specification
      const specResponse = await client.createSpecification({
        name: "Test Google Usage Tracking",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.Google,
        google: {
          model: Types.GoogleModels.Gemini_2_0Flash,
          temperature: 0.7,
          completionTokenLimit: 100,
        },
      });

      const specId = specResponse.createSpecification?.id;
      expect(specId).toBeDefined();
      createdSpecIds.push(specId!);

      await client.streamAgent(
        "Write a short paragraph about robotics.",
        (event: AgentStreamEvent) => {
          if (event.type === "conversation_started") {
            createdConversationIds.push(event.conversationId);
          } else if (event.type === "conversation_completed" && event.usage) {
            finalUsage = event.usage;
          }
        },
        undefined,
        { id: specId },
      );

      // Verify usage data was captured
      expect(finalUsage).toBeDefined();
      expect(finalUsage?.promptTokens).toBeGreaterThan(0);
      expect(finalUsage?.completionTokens).toBeGreaterThan(0);
      expect(finalUsage?.totalTokens).toBeGreaterThan(0);
      expect(finalUsage?.provider).toBe("GOOGLE");
      expect(finalUsage?.model).toBeDefined();

      console.log(`\n📊 Google Usage:`, finalUsage);
    }, 30000);
  });

  describe("Bedrock Usage Tracking", () => {
    it("should track token usage for Bedrock streaming", async () => {
      let finalUsage: TokenUsage | undefined;

      // Create Bedrock specification
      const specResponse = await client.createSpecification({
        name: "Test Bedrock Usage Tracking",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.Bedrock,
        bedrock: {
          model: Types.BedrockModels.Claude_3_7Sonnet,
          temperature: 0.7,
          completionTokenLimit: 100,
        },
      });

      const specId = specResponse.createSpecification?.id;
      expect(specId).toBeDefined();
      createdSpecIds.push(specId!);

      await client.streamAgent(
        "Write a short paragraph about cloud computing.",
        (event: AgentStreamEvent) => {
          if (event.type === "conversation_started") {
            createdConversationIds.push(event.conversationId);
          } else if (event.type === "conversation_completed" && event.usage) {
            finalUsage = event.usage;
          }
        },
        undefined,
        { id: specId },
      );

      // Verify usage data was captured
      expect(finalUsage).toBeDefined();
      expect(finalUsage?.promptTokens).toBeGreaterThan(0);
      expect(finalUsage?.completionTokens).toBeGreaterThan(0);
      expect(finalUsage?.totalTokens).toBeGreaterThan(0);
      expect(finalUsage?.provider).toBe("BEDROCK");
      expect(finalUsage?.model).toBeDefined();

      console.log(`\n📊 Bedrock Usage:`, finalUsage);
    }, 30000);
  });

  describe("Groq Usage Tracking", () => {
    it("should track token usage for Groq streaming", async () => {
      let finalUsage: TokenUsage | undefined;

      // Create Groq specification
      const specResponse = await client.createSpecification({
        name: "Test Groq Usage Tracking",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.Groq,
        groq: {
          model: Types.GroqModels.Llama_3_3_70B,
          temperature: 0.7,
          completionTokenLimit: 100,
        },
      });

      const specId = specResponse.createSpecification?.id;
      expect(specId).toBeDefined();
      createdSpecIds.push(specId!);

      await client.streamAgent(
        "Write a short paragraph about data science.",
        (event: AgentStreamEvent) => {
          if (event.type === "conversation_started") {
            createdConversationIds.push(event.conversationId);
          } else if (event.type === "conversation_completed" && event.usage) {
            finalUsage = event.usage;
          }
        },
        undefined,
        { id: specId },
      );

      // Verify usage data was captured
      expect(finalUsage).toBeDefined();
      expect(finalUsage?.promptTokens).toBeGreaterThan(0);
      expect(finalUsage?.completionTokens).toBeGreaterThan(0);
      expect(finalUsage?.totalTokens).toBeGreaterThan(0);
      expect(finalUsage?.provider).toBe("GROQ");
      expect(finalUsage?.model).toBeDefined();

      console.log(`\n📊 Groq Usage:`, finalUsage);
    }, 30000);
  });

  describe("Cross-Provider Usage Comparison", () => {
    it("should compare usage across different providers", async () => {
      const providers = [
        {
          name: "OpenAI",
          serviceType: Types.ModelServiceTypes.OpenAi,
          config: {
            openAI: {
              model: Types.OpenAiModels.Gpt4OMini_128K,
              temperature: 0.7,
              completionTokenLimit: 50,
            },
          },
        },
        {
          name: "Anthropic",
          serviceType: Types.ModelServiceTypes.Anthropic,
          config: {
            anthropic: {
              model: Types.AnthropicModels.Claude_3_5Sonnet,
              temperature: 0.7,
              completionTokenLimit: 50,
            },
          },
        },
        {
          name: "Google",
          serviceType: Types.ModelServiceTypes.Google,
          config: {
            google: {
              model: Types.GoogleModels.Gemini_2_0Flash,
              temperature: 0.7,
              completionTokenLimit: 50,
            },
          },
        },
      ];

      const results: Array<{
        provider: string;
        usage: TokenUsage;
        responseLength: number;
      }> = [];

      const testPrompt = "Explain quantum computing in exactly 3 sentences.";

      for (const { name, serviceType, config } of providers) {
        const specResponse = await client.createSpecification({
          name: `Test ${name} Comparison`,
          type: Types.SpecificationTypes.Completion,
          serviceType: serviceType,
          ...config,
        });

        const specId = specResponse.createSpecification?.id;
        expect(specId).toBeDefined();
        createdSpecIds.push(specId!);

        let providerUsage: TokenUsage | undefined;
        let responseLength = 0;

        await client.streamAgent(
          testPrompt,
          (event: AgentStreamEvent) => {
            if (event.type === "conversation_started") {
              createdConversationIds.push(event.conversationId);
            } else if (event.type === "conversation_completed") {
              if (event.usage) {
                providerUsage = event.usage;
              }
              responseLength = event.message.message.length;
            }
          },
          undefined,
          { id: specId },
        );

        expect(providerUsage).toBeDefined();
        results.push({
          provider: name,
          usage: providerUsage!,
          responseLength,
        });
      }

      // Display comparison
      console.log("\n📊 Cross-Provider Usage Comparison:");
      console.log(
        "┌─────────────┬──────────────┬─────────────────┬──────────────┬─────────────────┐",
      );
      console.log(
        "│ Provider    │ Prompt Tokens│ Completion Tokens│ Total Tokens │ Response Length │",
      );
      console.log(
        "├─────────────┼──────────────┼─────────────────┼──────────────┼─────────────────┤",
      );

      for (const { provider, usage, responseLength } of results) {
        const providerName = provider.padEnd(11);
        const promptTokens = usage.promptTokens.toString().padEnd(12);
        const completionTokens = usage.completionTokens.toString().padEnd(15);
        const totalTokens = usage.totalTokens.toString().padEnd(12);
        const respLength = responseLength.toString().padEnd(15);

        console.log(
          `│ ${providerName} │ ${promptTokens} │ ${completionTokens} │ ${totalTokens} │ ${respLength} │`,
        );
      }
      console.log(
        "└─────────────┴──────────────┴─────────────────┴──────────────┴─────────────────┘",
      );

      // All providers should have usage data
      expect(results.every((r) => r.usage.promptTokens > 0)).toBe(true);
      expect(results.every((r) => r.usage.completionTokens > 0)).toBe(true);
      expect(results.every((r) => r.usage.totalTokens > 0)).toBe(true);
      expect(results.every((r) => r.responseLength > 0)).toBe(true);
    }, 120000);
  });

  describe("Usage Tracking with Tools", () => {
    it("should track usage when using tools", async () => {
      let finalUsage: TokenUsage | undefined;

      // Define a simple tool
      const testTool: Types.ToolDefinitionInput = {
        name: "getCurrentTime",
        description: "Get the current time",
        schema: JSON.stringify({
          type: "object",
          properties: {},
          required: [],
        }),
      };

      const toolHandlers = {
        getCurrentTime: async () => {
          return { currentTime: new Date().toISOString() };
        },
      };

      // Create specification with tool support
      const specResponse = await client.createSpecification({
        name: "Test Usage with Tools",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4OMini_128K,
          temperature: 0.7,
          completionTokenLimit: 150,
        },
      });

      const specId = specResponse.createSpecification?.id;
      expect(specId).toBeDefined();
      createdSpecIds.push(specId!);

      await client.streamAgent(
        "What time is it? Use the getCurrentTime tool to find out.",
        (event: AgentStreamEvent) => {
          if (event.type === "conversation_started") {
            createdConversationIds.push(event.conversationId);
          } else if (event.type === "conversation_completed" && event.usage) {
            finalUsage = event.usage;
          }
        },
        undefined,
        { id: specId },
        [testTool],
        toolHandlers,
      );

      // Verify usage data includes tool usage
      expect(finalUsage).toBeDefined();
      expect(finalUsage?.promptTokens).toBeGreaterThan(0);
      expect(finalUsage?.completionTokens).toBeGreaterThan(0);
      expect(finalUsage?.totalTokens).toBeGreaterThan(0);
      expect(finalUsage?.provider).toBe("OPEN_AI");

      console.log(`\n📊 Usage with Tools:`, finalUsage);
    }, 30000);
  });

  describe("Usage Tracking Edge Cases", () => {
    it("should handle missing usage data gracefully", async () => {
      let conversationCompleted = false;
      let hasUsageData = false;

      // Create a minimal specification
      const specResponse = await client.createSpecification({
        name: "Test Missing Usage",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4OMini_128K,
          temperature: 0.7,
          completionTokenLimit: 10,
        },
      });

      const specId = specResponse.createSpecification?.id;
      expect(specId).toBeDefined();
      createdSpecIds.push(specId!);

      await client.streamAgent(
        "Hi",
        (event: AgentStreamEvent) => {
          if (event.type === "conversation_started") {
            createdConversationIds.push(event.conversationId);
          } else if (event.type === "conversation_completed") {
            conversationCompleted = true;
            hasUsageData = !!event.usage;
          }
        },
        undefined,
        { id: specId },
      );

      // Should complete regardless of usage data availability
      expect(conversationCompleted).toBe(true);

      // Usage data should be present for successful completions
      expect(hasUsageData).toBe(true);
    }, 20000);

    it("should track usage for very short completions", async () => {
      let finalUsage: TokenUsage | undefined;

      const specResponse = await client.createSpecification({
        name: "Test Short Completion Usage",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4OMini_128K,
          temperature: 0,
          completionTokenLimit: 5,
        },
      });

      const specId = specResponse.createSpecification?.id;
      expect(specId).toBeDefined();
      createdSpecIds.push(specId!);

      await client.streamAgent(
        "Say 'yes'",
        (event: AgentStreamEvent) => {
          if (event.type === "conversation_started") {
            createdConversationIds.push(event.conversationId);
          } else if (event.type === "conversation_completed" && event.usage) {
            finalUsage = event.usage;
          }
        },
        undefined,
        { id: specId },
      );

      // Should have usage data even for very short completions
      expect(finalUsage).toBeDefined();
      expect(finalUsage?.promptTokens).toBeGreaterThan(0);
      expect(finalUsage?.completionTokens).toBeGreaterThan(0);
      expect(finalUsage?.totalTokens).toBeGreaterThan(0);

      console.log(`\n📊 Short Completion Usage:`, finalUsage);
    }, 20000);
  });
});

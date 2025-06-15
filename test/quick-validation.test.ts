console.log(`⏰ [${new Date().toISOString()}] Test file loading started`);

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import { AgentStreamEvent } from "../src/types/ui-events";

console.log(`⏰ [${new Date().toISOString()}] Test imports completed`);

/**
 * Quick validation test for all streaming providers
 *
 * This test quickly verifies that each provider can:
 * 1. Create a specification
 * 2. Stream a simple response
 * 3. Receive tokens and complete successfully
 *
 * Run with: npm test quick-validation.test.ts
 */
describe("Quick Provider Validation", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;

  if (!orgId || !envId || !secret) {
    console.warn(
      "⚠️  Skipping validation tests - missing Graphlit credentials"
    );
    return;
  }

  let client: Graphlit;
  const createdSpecifications: string[] = [];
  const createdConversations: string[] = [];

  beforeAll(async () => {
    console.log("⏱️  Starting beforeAll setup...");
    const setupStart = Date.now();

    client = new Graphlit(orgId, envId, secret);
    console.log(`✅ Graphlit client created (${Date.now() - setupStart}ms)`);

    // Set up streaming clients if API keys are available
    try {
      if (process.env.OPENAI_API_KEY) {
        console.log("⏳ Importing OpenAI SDK...");
        const importStart = Date.now();
        const { default: OpenAI } = await import("openai");
        console.log(`✅ OpenAI imported (${Date.now() - importStart}ms)`);
        client.setOpenAIClient(
          new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
        );
      }

      if (process.env.ANTHROPIC_API_KEY) {
        console.log("⏳ Importing Anthropic SDK...");
        const importStart = Date.now();
        const { default: Anthropic } = await import("@anthropic-ai/sdk");
        console.log(`✅ Anthropic imported (${Date.now() - importStart}ms)`);
        client.setAnthropicClient(
          new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
        );
      }

      if (process.env.GOOGLE_API_KEY) {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        client.setGoogleClient(
          new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
        );
      }

      if (process.env.GROQ_API_KEY) {
        const { default: Groq } = await import("groq-sdk");
        client.setGroqClient(new Groq({ apiKey: process.env.GROQ_API_KEY }));
      }

      if (process.env.CEREBRAS_API_KEY) {
        const { default: OpenAI } = await import("openai");
        client.setCerebrasClient(
          new OpenAI({
            baseURL: "https://api.cerebras.ai/v1",
            apiKey: process.env.CEREBRAS_API_KEY,
          })
        );
      }

      if (process.env.COHERE_API_KEY) {
        const { CohereClient } = await import("cohere-ai");
        client.setCohereClient(
          new CohereClient({ token: process.env.COHERE_API_KEY })
        );
      }

      if (process.env.MISTRAL_API_KEY) {
        const { Mistral } = await import("@mistralai/mistralai");
        client.setMistralClient(
          new Mistral({ apiKey: process.env.MISTRAL_API_KEY })
        );
      }

      if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
        const { BedrockRuntimeClient } = await import(
          "@aws-sdk/client-bedrock-runtime"
        );
        client.setBedrockClient(
          new BedrockRuntimeClient({
            region: process.env.AWS_REGION || "us-east-2",
            credentials: {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
          })
        );
      }

      if (process.env.DEEPSEEK_API_KEY) {
        const { default: OpenAI } = await import("openai");
        client.setDeepseekClient(
          new OpenAI({
            baseURL: "https://api.deepseek.com",
            apiKey: process.env.DEEPSEEK_API_KEY,
          })
        );
      }
    } catch (error) {
      console.warn("⚠️  Some streaming clients failed to initialize:", error);
    }

    console.log(
      `✅ beforeAll setup completed (${Date.now() - setupStart}ms total)`
    );
  }, 60000);

  afterAll(async () => {
    // Cleanup conversations first (they depend on specifications)
    for (const conversationId of createdConversations) {
      try {
        await client.deleteConversation(conversationId);
      } catch (error) {
        console.warn(
          `Failed to cleanup conversation ${conversationId}:`,
          error
        );
      }
    }

    // Then cleanup specifications
    for (const specId of createdSpecifications) {
      try {
        await client.deleteSpecification(specId);
      } catch (error) {
        console.warn(`Failed to cleanup specification ${specId}:`, error);
      }
    }
  }, 30000);

  // Test data for quick validation
  const testProviders = [
    {
      name: "OpenAI GPT-4o Mini",
      serviceType: Types.ModelServiceTypes.OpenAi,
      config: {
        openAI: { model: Types.OpenAiModels.Gpt4OMini_128K, temperature: 0.3 },
      },
      envKey: "OPENAI_API_KEY",
    },
    {
      name: "Anthropic Claude 3.5 Haiku",
      serviceType: Types.ModelServiceTypes.Anthropic,
      config: {
        anthropic: {
          model: Types.AnthropicModels.Claude_3_5Haiku,
          temperature: 0.3,
        },
      },
      envKey: "ANTHROPIC_API_KEY",
    },
    {
      name: "Google Gemini 2.5 Flash",
      serviceType: Types.ModelServiceTypes.Google,
      config: {
        google: {
          model: Types.GoogleModels.Gemini_2_5FlashPreview,
          temperature: 0.3,
        },
      },
      envKey: "GOOGLE_API_KEY",
    },
    {
      name: "Groq LLaMA 3.3 70B",
      serviceType: Types.ModelServiceTypes.Groq,
      config: {
        groq: { model: Types.GroqModels.Llama_3_3_70B, temperature: 0.3 },
      },
      envKey: "GROQ_API_KEY",
    },
    {
      name: "Cerebras LLaMA 3.3 70B",
      serviceType: Types.ModelServiceTypes.Cerebras,
      config: {
        cerebras: {
          model: Types.CerebrasModels.Llama_3_3_70B,
          temperature: 0.3,
        },
      },
      envKey: "CEREBRAS_API_KEY",
    },
    {
      name: "Cohere Command R",
      serviceType: Types.ModelServiceTypes.Cohere,
      config: {
        cohere: { model: Types.CohereModels.CommandR, temperature: 0.3 },
      },
      envKey: "COHERE_API_KEY",
    },
    {
      name: "Mistral Small",
      serviceType: Types.ModelServiceTypes.Mistral,
      config: {
        mistral: { model: Types.MistralModels.MistralSmall, temperature: 0.3 },
      },
      envKey: "MISTRAL_API_KEY",
    },
    {
      name: "Bedrock Nova Pro",
      serviceType: Types.ModelServiceTypes.Bedrock,
      config: {
        bedrock: { model: Types.BedrockModels.NovaPro, temperature: 0.3 },
      },
      envKey: "AWS_ACCESS_KEY_ID",
    },
    {
      name: "Deepseek Chat",
      serviceType: Types.ModelServiceTypes.Deepseek,
      config: {
        deepseek: { model: Types.DeepseekModels.Chat, temperature: 0.3 },
      },
      envKey: "DEEPSEEK_API_KEY",
    },
  ];

  // Generate individual test cases for each provider
  for (const provider of testProviders) {
    it(`should stream successfully with ${provider.name}`, async () => {
      // Skip if API key not provided
      if (!process.env[provider.envKey]) {
        console.log(
          `⏭️  Skipping ${provider.name} - missing ${provider.envKey}`
        );
        return;
      }

      console.log(`🧪 Testing ${provider.name}...`);

      // Create specification
      const specInput = {
        name: `Quick Test ${provider.name}`,
        type: Types.SpecificationTypes.Completion,
        serviceType: provider.serviceType,
        ...provider.config,
      };

      console.log(
        `🔍 [Test] Creating specification for ${provider.name}:`,
        JSON.stringify(specInput, null, 2)
      );

      const spec = await client.createSpecification(specInput);

      console.log(
        `🔍 [Test] Created specification response for ${provider.name}:`,
        JSON.stringify(spec.createSpecification, null, 2)
      );

      expect(spec.createSpecification?.id).toBeDefined();
      createdSpecifications.push(spec.createSpecification.id);

      // Test streaming
      let tokenCount = 0;
      let fullMessage = "";
      let conversationStarted = false;
      let conversationCompleted = false;
      const startTime = Date.now();

      await client.streamAgent(
        "Say 'Hello from' followed by your model name. Be brief.",
        (event: AgentStreamEvent) => {
          switch (event.type) {
            case "conversation_started":
              conversationStarted = true;
              // Track conversation for cleanup
              createdConversations.push(event.conversationId);
              break;
            case "message_update":
              tokenCount++;
              fullMessage = event.message.message;
              break;
            case "conversation_completed":
              conversationCompleted = true;
              break;
            case "error":
              throw new Error(`Streaming error: ${event.error.message}`);
          }
        },
        undefined, // conversationId
        { id: spec.createSpecification.id }
      );

      const duration = Date.now() - startTime;

      // Validation checks
      expect(conversationStarted).toBe(true);
      expect(conversationCompleted).toBe(true);
      expect(tokenCount).toBeGreaterThan(0);
      expect(fullMessage.length).toBeGreaterThan(0);
      expect(fullMessage.toLowerCase()).toContain("hello");

      console.log(
        `✅ ${provider.name}: ${tokenCount} tokens, ${fullMessage.length} chars, ${duration}ms`
      );
      console.log(
        `   Response: "${fullMessage.substring(0, 100)}${fullMessage.length > 100 ? "..." : ""}"`
      );
    }, 30000); // 30 second timeout per provider
  }

  // Summary test that shows which providers are available
  it("should show provider availability summary", async () => {
    console.log("\n📋 Provider Availability Summary:");

    let availableCount = 0;
    let totalCount = testProviders.length;

    for (const provider of testProviders) {
      const available = !!process.env[provider.envKey];
      const status = available ? "✅ Available" : "❌ Missing key";
      console.log(`   ${provider.name.padEnd(25)} ${status}`);
      if (available) availableCount++;
    }

    console.log(
      `\n🎯 Total: ${availableCount}/${totalCount} providers configured`
    );

    if (availableCount === 0) {
      console.warn("⚠️  No providers configured - add API keys to .env file");
    } else {
      console.log(`🚀 Ready to test ${availableCount} streaming providers!`);
    }

    expect(availableCount).toBeGreaterThan(0);
  });
});

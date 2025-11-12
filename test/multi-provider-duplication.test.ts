import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
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

describe.skipIf(skipTests)("Multi-Provider Duplication Tests", () => {
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
    // Cleanup created resources
    for (const id of createdConversationIds) {
      try {
        await client.deleteConversation(id);
      } catch (error) {
        console.error(`Failed to delete conversation ${id}:`, error);
      }
    }
    for (const id of createdSpecIds) {
      try {
        await client.deleteSpecification(id);
      } catch (error) {
        console.error(`Failed to delete specification ${id}:`, error);
      }
    }
  });

  const testProviders = [
    {
      name: "OpenAI GPT-4o Mini",
      spec: {
        name: "OpenAI GPT-4o Mini Test",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4OMini_128K,
          temperature: 0.7,
        },
      },
    },
    {
      name: "Anthropic Claude 3.5 Haiku",
      spec: {
        name: "Anthropic Claude 3.5 Haiku Test",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.Anthropic,
        anthropic: {
          model: Types.AnthropicModels.Claude_3_5Haiku,
          temperature: 0.7,
        },
      },
    },
    {
      name: "Google Gemini 2.0 Flash",
      spec: {
        name: "Google Gemini 2.0 Flash Test",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.Google,
        google: {
          model: Types.GoogleModels.Gemini_2_0Flash,
          temperature: 0.7,
        },
      },
    },
    {
      name: "Mistral Small",
      spec: {
        name: "Mistral Small Test",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.Mistral,
        mistral: {
          model: Types.MistralModels.MistralSmall,
          temperature: 0.7,
        },
      },
    },
  ];

  testProviders.forEach((provider) => {
    it(`should not duplicate response with ${provider.name}`, async () => {
      console.log(`\n🧪 Testing ${provider.name}...`);

      // Create specification
      const specResponse = await client.createSpecification(
        provider.spec as Types.SpecificationInput,
      );
      expect(specResponse.createSpecification?.id).toBeDefined();
      const specId = specResponse.createSpecification!.id;
      createdSpecIds.push(specId);

      // Stream agent with NO tools
      const messageChunks: string[] = [];
      const fullMessage = await new Promise<string>((resolve, reject) => {
        let completeMessage = "";
        let lastChunkWasFullMessage = false;

        client.streamAgent(
          "Tell me a fun fact about computers in exactly one sentence.",
          (event) => {
            if (event.type === "conversation_started") {
              createdConversationIds.push(event.conversationId);
            }

            if (event.type === "message_update" && event.message?.message) {
              const previousLength = completeMessage.length;
              const newLength = event.message.message.length;
              const delta = newLength - previousLength;

              messageChunks.push(event.message.message);
              completeMessage = event.message.message;

              // Check if this chunk is the entire message (no delta)
              if (delta === 0 && newLength > 0) {
                lastChunkWasFullMessage = true;
                console.log(
                  `  ⚠️  ${provider.name}: Last chunk contains entire message (${newLength} chars)`,
                );
              }
            }

            if (event.type === "conversation_completed") {
              resolve(completeMessage);
            }

            if (event.type === "error") {
              reject(new Error(event.error.message || "Conversation failed"));
            }
          },
          undefined, // conversationId (create new)
          { id: specId }, // Pass specification as object
        );
      });

      console.log(
        `  ✅ ${provider.name}: Final message length: ${fullMessage.length}`,
      );
      console.log(
        `  📊 ${provider.name}: Total chunks: ${messageChunks.length}`,
      );

      // Check for exact duplication
      const halfLength = Math.floor(fullMessage.length / 2);
      const exactDuplication =
        fullMessage.substring(0, halfLength) ===
        fullMessage.substring(halfLength, halfLength * 2);

      if (exactDuplication) {
        console.error(`  ❌ ${provider.name}: EXACT DUPLICATION DETECTED!`);
      }

      // Check if any chunk contains the full message
      const fullMessageChunks = messageChunks.filter(
        (chunk) => chunk === fullMessage,
      );
      if (fullMessageChunks.length > 0) {
        console.log(
          `  ⚠️  ${provider.name}: ${fullMessageChunks.length} chunk(s) contain the full message`,
        );
      }

      // Assertions
      expect(exactDuplication).toBe(false);
      expect(fullMessageChunks.length).toBeLessThanOrEqual(1);
    }, 30000); // 30 second timeout per provider
  });
});

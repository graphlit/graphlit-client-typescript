import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { GraphlitClient } from "../src/index.js";
import * as Types from "../src/generated/graphql-types.js";
import { TEST_MODELS, TestModelConfig } from "./test-models.js";
import { clearEnvironment, getEnvironment } from "./setup.js";

describe("Provider-Specific Test Suite", () => {
  let client: GraphlitClient;

  beforeAll(async () => {
    await clearEnvironment();
    client = new GraphlitClient();
  });

  afterAll(async () => {
    await clearEnvironment();
  });

  describe("Bedrock-Specific Tests", () => {
    const bedrockModels = TEST_MODELS.filter(
      (m) => m.name.includes("Bedrock"),
    );

    it.each(bedrockModels)(
      "should handle Bedrock streaming with $name",
      async ({ config }) => {
        const conversationId = await client.createConversation();
        const specification = await client.createSpecification(config);

        let tokenCount = 0;
        const result = await client.streamAgent({
          conversationId,
          specificationId: specification.id,
          messagePrompt: "Write a haiku about AWS.",
          onEvent: (event) => {
            if (event.type === "token") {
              tokenCount++;
            }
          },
        });

        expect(result.messageText).toBeTruthy();
        expect(tokenCount).toBeGreaterThan(0);
        // Verify it's actually a haiku (roughly)
        const lines = result.messageText.split('\n').filter(l => l.trim());
        expect(lines.length).toBeGreaterThanOrEqual(3);
      },
      { timeout: 60000 },
    );

    // Bedrock tool calling test
    const bedrockToolModels = bedrockModels.filter(
      (m) => m.supportsTools !== false,
    );

    if (bedrockToolModels.length > 0) {
      it.each(bedrockToolModels)(
        "should handle Bedrock tool calling with $name",
        async ({ config }) => {
          const tools: Types.ToolDefinitionInput[] = [
            {
              name: "get_time",
              description: "Get the current time",
              schema: JSON.stringify({
                type: "object",
                properties: {
                  timezone: { type: "string" },
                },
              }),
            },
          ];

          const conversationId = await client.createConversation();
          const specification = await client.createSpecification(config);

          let toolCalled = false;
          const result = await client.streamAgent({
            conversationId,
            specificationId: specification.id,
            messagePrompt: "What time is it in New York?",
            tools,
            toolHandler: async (call) => {
              toolCalled = true;
              return { time: "2:30 PM EST", timezone: "America/New_York" };
            },
          });

          expect(result.messageText).toBeTruthy();
          expect(toolCalled).toBe(true);
          expect(result.messageText).toMatch(/2:30|14:30/);
        },
        { timeout: 60000 },
      );
    }
  });

  describe("Deepseek-Specific Tests", () => {
    const deepseekModels = TEST_MODELS.filter(
      (m) => m.name.includes("Deepseek"),
    );

    it.each(deepseekModels)(
      "should handle Deepseek streaming with $name",
      async ({ config }) => {
        const conversationId = await client.createConversation();
        const specification = await client.createSpecification(config);

        let hasReasoningEvents = false;
        const result = await client.streamAgent({
          conversationId,
          specificationId: specification.id,
          messagePrompt: "Solve step by step: What is 15% of 80?",
          onEvent: (event) => {
            if (event.type === "reasoning_start" || event.type === "reasoning_delta") {
              hasReasoningEvents = true;
            }
          },
        });

        expect(result.messageText).toBeTruthy();
        expect(result.messageText).toMatch(/12/); // 15% of 80 = 12
        
        // Deepseek Reasoner should have reasoning events
        if (config.name.includes("Reasoner")) {
          expect(hasReasoningEvents).toBe(true);
        }
      },
      { timeout: 60000 },
    );
  });

  describe("Mistral-Specific Tests", () => {
    const mistralModels = TEST_MODELS.filter(
      (m) => m.name.includes("Mistral"),
    );

    it.each(mistralModels)(
      "should handle Mistral streaming with $name",
      async ({ config }) => {
        const conversationId = await client.createConversation();
        const specification = await client.createSpecification(config);

        const result = await client.streamAgent({
          conversationId,
          specificationId: specification.id,
          messagePrompt: "Write a brief description of Paris in French.",
        });

        expect(result.messageText).toBeTruthy();
        // Should contain some French text
        expect(result.messageText).toMatch(/paris|ville|france|capitale/i);
      },
      { timeout: 60000 },
    );

    // Test Mistral tool calling separately
    const mistralToolModels = mistralModels.filter(
      (m) => m.supportsTools !== false,
    );

    if (mistralToolModels.length > 0) {
      it.each(mistralToolModels)(
        "should handle Mistral tool calling with $name",
        async ({ config }) => {
          const tools: Types.ToolDefinitionInput[] = [
            {
              name: "translate",
              description: "Translate text between languages",
              schema: JSON.stringify({
                type: "object",
                properties: {
                  text: { type: "string" },
                  from: { type: "string" },
                  to: { type: "string" },
                },
                required: ["text", "from", "to"],
              }),
            },
          ];

          const conversationId = await client.createConversation();
          const specification = await client.createSpecification(config);

          let toolCalled = false;
          const result = await client.streamAgent({
            conversationId,
            specificationId: specification.id,
            messagePrompt: "Translate 'Hello world' from English to Spanish",
            tools,
            toolHandler: async (call) => {
              toolCalled = true;
              return { translation: "Hola mundo" };
            },
          });

          expect(result.messageText).toBeTruthy();
          expect(toolCalled).toBe(true);
          expect(result.messageText).toMatch(/hola mundo/i);
        },
        { timeout: 60000 },
      );
    }
  });

  describe("Groq-Specific Tests", () => {
    const groqModels = TEST_MODELS.filter(
      (m) => m.name.includes("Groq"),
    ).slice(0, 1);

    it.each(groqModels)(
      "should handle Groq high-speed streaming with $name",
      async ({ config }) => {
        const conversationId = await client.createConversation();
        const specification = await client.createSpecification(config);

        const startTime = Date.now();
        let firstTokenTime = 0;
        let tokenCount = 0;

        const result = await client.streamAgent({
          conversationId,
          specificationId: specification.id,
          messagePrompt: "List 5 programming languages quickly.",
          onEvent: (event) => {
            if (event.type === "token") {
              if (firstTokenTime === 0) {
                firstTokenTime = Date.now() - startTime;
              }
              tokenCount++;
            }
          },
        });

        expect(result.messageText).toBeTruthy();
        expect(tokenCount).toBeGreaterThan(0);
        
        // Groq should be very fast
        expect(firstTokenTime).toBeLessThan(1000); // First token within 1 second
        
        // Should list programming languages
        const languages = ["python", "javascript", "java", "c++", "ruby", "go", "rust"];
        const mentionedLanguages = languages.filter(lang => 
          result.messageText.toLowerCase().includes(lang)
        );
        expect(mentionedLanguages.length).toBeGreaterThanOrEqual(3);
      },
      { timeout: 30000 },
    );
  });

  describe("Cohere-Specific Tests", () => {
    const cohereModels = TEST_MODELS.filter(
      (m) => m.name.includes("Cohere"),
    ).slice(0, 1);

    it.each(cohereModels)(
      "should handle Cohere v2 API with $name",
      async ({ config }) => {
        const conversationId = await client.createConversation();
        const specification = await client.createSpecification(config);

        // Test basic streaming
        const result = await client.streamAgent({
          conversationId,
          specificationId: specification.id,
          messagePrompt: "What is the capital of France?",
        });

        expect(result.messageText).toBeTruthy();
        expect(result.messageText.toLowerCase()).toMatch(/paris/);

        // Test conversation continuity
        const result2 = await client.streamAgent({
          conversationId,
          specificationId: specification.id,
          messagePrompt: "What country's capital did I just ask about?",
        });

        expect(result2.messageText).toBeTruthy();
        expect(result2.messageText.toLowerCase()).toMatch(/france/);
      },
      { timeout: 60000 },
    );
  });
});
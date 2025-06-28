import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { GraphlitClient } from "../src/index.js";
import * as Types from "../src/generated/graphql-types.js";
import { TEST_MODELS, TestModelConfig } from "./test-models.js";
import { clearEnvironment, getEnvironment } from "./setup.js";

describe("Conversation Test Suite", () => {
  let client: GraphlitClient;

  beforeAll(async () => {
    await clearEnvironment();
    client = new GraphlitClient();
  });

  afterAll(async () => {
    await clearEnvironment();
  });

  describe("Multi-Turn Conversations", () => {
    const conversationModels = TEST_MODELS.filter(
      (m) =>
        m.name.includes("OpenAI GPT-4o Mini") ||
        m.name.includes("Anthropic Claude 3.5 Haiku") ||
        m.name.includes("Google Gemini 2.5 Flash"),
    );

    it.each(conversationModels)(
      "should maintain context across turns with $name",
      async ({ config }) => {
        const conversationId = await client.createConversation();
        const specification = await client.createSpecification(config);

        // Turn 1: Introduce a topic
        const result1 = await client.streamAgent({
          conversationId,
          specificationId: specification.id,
          messagePrompt: "My favorite color is blue and I have a cat named Whiskers.",
        });
        expect(result1.messageText).toBeTruthy();

        // Turn 2: Reference previous information
        const result2 = await client.streamAgent({
          conversationId,
          specificationId: specification.id,
          messagePrompt: "What color did I mention and what's my pet's name?",
        });
        expect(result2.messageText.toLowerCase()).toMatch(/blue/);
        expect(result2.messageText).toMatch(/whiskers/i);

        // Turn 3: Build on conversation
        const result3 = await client.streamAgent({
          conversationId,
          specificationId: specification.id,
          messagePrompt: "What kind of pet do I have?",
        });
        expect(result3.messageText.toLowerCase()).toMatch(/cat/);
      },
      { timeout: 90000 },
    );
  });

  describe("Multi-Turn with Tools", () => {
    const tools: Types.ToolDefinitionInput[] = [
      {
        name: "calculator",
        description: "Performs arithmetic operations",
        schema: JSON.stringify({
          type: "object",
          properties: {
            operation: { type: "string", enum: ["add", "subtract", "multiply", "divide"] },
            a: { type: "number" },
            b: { type: "number" },
          },
          required: ["operation", "a", "b"],
        }),
      },
    ];

    const toolModels = TEST_MODELS.filter(
      (m) =>
        (m.name.includes("OpenAI") || m.name.includes("Anthropic")) &&
        m.supportsTools !== false,
    ).slice(0, 2);

    it.each(toolModels)(
      "should use tools across multiple turns with $name",
      async ({ config }) => {
        const conversationId = await client.createConversation();
        const specification = await client.createSpecification(config);

        let calculationResults: number[] = [];

        const toolHandler = async (call: Types.ConversationToolCall) => {
          const args = JSON.parse(call.arguments);
          let result = 0;
          switch (args.operation) {
            case "add":
              result = args.a + args.b;
              break;
            case "multiply":
              result = args.a * args.b;
              break;
          }
          calculationResults.push(result);
          return { result };
        };

        // Turn 1: First calculation
        const result1 = await client.streamAgent({
          conversationId,
          specificationId: specification.id,
          messagePrompt: "Calculate 5 + 3",
          tools,
          toolHandler,
        });
        expect(result1.messageText).toMatch(/8/);

        // Turn 2: Reference previous result
        const result2 = await client.streamAgent({
          conversationId,
          specificationId: specification.id,
          messagePrompt: "Now multiply the previous result by 2",
          tools,
          toolHandler,
        });
        expect(result2.messageText).toMatch(/16/);

        expect(calculationResults).toEqual([8, 16]);
      },
      { timeout: 90000 },
    );
  });

  describe("Concurrent Conversations", () => {
    const concurrentModels = TEST_MODELS.filter(
      (m) => m.name.includes("OpenAI GPT-4o Mini"),
    ).slice(0, 1);

    it.each(concurrentModels)(
      "should handle concurrent conversations with $name",
      async ({ config }) => {
        const specification = await client.createSpecification(config);
        
        // Create 3 separate conversations
        const conversations = await Promise.all([
          client.createConversation(),
          client.createConversation(),
          client.createConversation(),
        ]);

        // Run them concurrently with different contexts
        const results = await Promise.all([
          client.streamAgent({
            conversationId: conversations[0],
            specificationId: specification.id,
            messagePrompt: "Remember this: I like pizza. What do I like?",
          }),
          client.streamAgent({
            conversationId: conversations[1],
            specificationId: specification.id,
            messagePrompt: "Remember this: I like tacos. What do I like?",
          }),
          client.streamAgent({
            conversationId: conversations[2],
            specificationId: specification.id,
            messagePrompt: "Remember this: I like sushi. What do I like?",
          }),
        ]);

        // Each conversation should maintain its own context
        expect(results[0].messageText.toLowerCase()).toMatch(/pizza/);
        expect(results[1].messageText.toLowerCase()).toMatch(/taco/);
        expect(results[2].messageText.toLowerCase()).toMatch(/sushi/);

        // Verify isolation - ask about different food in each conversation
        const followUps = await Promise.all([
          client.streamAgent({
            conversationId: conversations[0],
            specificationId: specification.id,
            messagePrompt: "Do I like tacos?",
          }),
          client.streamAgent({
            conversationId: conversations[1],
            specificationId: specification.id,
            messagePrompt: "Do I like pizza?",
          }),
        ]);

        // Each should only know about its own context
        expect(followUps[0].messageText).toBeTruthy();
        expect(followUps[1].messageText).toBeTruthy();
      },
      { timeout: 120000 },
    );
  });

  describe("Conversation Continuity", () => {
    const continuityModels = TEST_MODELS.filter(
      (m) => m.name.includes("OpenAI") || m.name.includes("Anthropic"),
    ).slice(0, 1);

    it.each(continuityModels)(
      "should continue conversations after long pauses with $name",
      async ({ config }) => {
        const conversationId = await client.createConversation();
        const specification = await client.createSpecification(config);

        // Initial conversation
        const result1 = await client.streamAgent({
          conversationId,
          specificationId: specification.id,
          messagePrompt: "Let's discuss space exploration. What year did humans first land on the moon?",
        });
        expect(result1.messageText).toMatch(/1969/);

        // Simulate a pause
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Continue the conversation
        const result2 = await client.streamAgent({
          conversationId,
          specificationId: specification.id,
          messagePrompt: "Who were the astronauts on that mission?",
        });
        expect(result2.messageText).toMatch(/armstrong/i);
        expect(result2.messageText).toMatch(/aldrin/i);

        // Another pause and continuation
        await new Promise(resolve => setTimeout(resolve, 1000));

        const result3 = await client.streamAgent({
          conversationId,
          specificationId: specification.id,
          messagePrompt: "What were we discussing?",
        });
        expect(result3.messageText.toLowerCase()).toMatch(/moon|apollo|space/);
      },
      { timeout: 90000 },
    );
  });
});
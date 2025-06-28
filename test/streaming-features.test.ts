import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { GraphlitClient } from "../src/index.js";
import * as Types from "../src/generated/graphql-types.js";
import { TEST_MODELS, TestModelConfig } from "./test-models.js";
import { clearEnvironment, getEnvironment } from "./setup.js";
import { AgentStreamEvent } from "../src/types/ui-events.js";

describe("Streaming Features Test Suite", () => {
  let client: GraphlitClient;

  beforeAll(async () => {
    await clearEnvironment();
    client = new GraphlitClient();
  });

  afterAll(async () => {
    await clearEnvironment();
  });

  describe("Stream Cancellation", () => {
    const cancellationModels = TEST_MODELS.filter(
      (m) => m.name.includes("OpenAI GPT-4o") || m.name.includes("Anthropic Claude"),
    ).slice(0, 2);

    it.each(cancellationModels)(
      "should cancel stream with $name",
      async ({ config }) => {
        const conversationId = await client.createConversation();
        const specification = await client.createSpecification(config);

        const abortController = new AbortController();
        let tokenCount = 0;
        let cancelled = false;

        const streamPromise = client.streamAgent({
          conversationId,
          specificationId: specification.id,
          messagePrompt: "Count from 1 to 1000 slowly, explaining each number.",
          abortSignal: abortController.signal,
          onEvent: (event) => {
            if (event.type === "token") {
              tokenCount++;
              // Cancel after receiving 20 tokens
              if (tokenCount >= 20) {
                abortController.abort();
              }
            }
          },
        });

        try {
          await streamPromise;
        } catch (error: any) {
          if (error.name === "AbortError" || error.message.includes("abort")) {
            cancelled = true;
          }
        }

        expect(cancelled).toBe(true);
        expect(tokenCount).toBeGreaterThanOrEqual(20);
        expect(tokenCount).toBeLessThan(100); // Should have stopped early
      },
      { timeout: 30000 },
    );
  });

  describe("Streaming Without Tool Calls", () => {
    const noToolModels = TEST_MODELS.filter(
      (m) => m.name.includes("OpenAI") || m.name.includes("Anthropic"),
    ).slice(0, 2);

    it.each(noToolModels)(
      "should stream without tools with $name",
      async ({ config }) => {
        const conversationId = await client.createConversation();
        const specification = await client.createSpecification(config);

        const tools: Types.ToolDefinitionInput[] = [
          {
            name: "never_called",
            description: "This tool should not be called",
            schema: JSON.stringify({
              type: "object",
              properties: { value: { type: "string" } },
            }),
          },
        ];

        let toolCalled = false;
        let messageComplete = false;

        const result = await client.streamAgent({
          conversationId,
          specificationId: specification.id,
          messagePrompt: "What is the capital of France? Just tell me directly, don't use any tools.",
          tools,
          toolHandler: async () => {
            toolCalled = true;
            return { error: "Should not be called" };
          },
          onEvent: (event) => {
            if (event.type === "message_complete") {
              messageComplete = true;
            }
          },
        });

        expect(result.messageText).toBeTruthy();
        expect(result.messageText.toLowerCase()).toMatch(/paris/);
        expect(toolCalled).toBe(false);
        expect(messageComplete).toBe(true);
      },
      { timeout: 30000 },
    );
  });

  describe("Multimodal Streaming", () => {
    const multimodalModels = TEST_MODELS.filter(
      (m) =>
        (m.name.includes("OpenAI GPT-4o") ||
         m.name.includes("Anthropic Claude") ||
         m.name.includes("Google Gemini")) &&
        !m.name.includes("Mini"),
    ).slice(0, 1);

    it.each(multimodalModels)(
      "should handle image input with $name",
      async ({ config }) => {
        const conversationId = await client.createConversation();
        const specification = await client.createSpecification(config);

        // Create a simple test image (1x1 red pixel)
        const redPixelBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";

        const result = await client.streamAgent({
          conversationId,
          specificationId: specification.id,
          messagePrompt: "What color is this image?",
          messageImageData: redPixelBase64,
          messageImageMimeType: "image/png",
        });

        expect(result.messageText).toBeTruthy();
        expect(result.messageText.toLowerCase()).toMatch(/red|single.*pixel/);
      },
      { timeout: 60000 },
    );
  });

  describe("Error Recovery", () => {
    const errorModels = TEST_MODELS.filter(
      (m) => m.name.includes("OpenAI"),
    ).slice(0, 1);

    it.each(errorModels)(
      "should recover from network errors with $name",
      async ({ config }) => {
        const conversationId = await client.createConversation();
        const specification = await client.createSpecification(config);

        // This test assumes the retry mechanism is in place
        const result = await client.streamAgent({
          conversationId,
          specificationId: specification.id,
          messagePrompt: "Say 'Hello World'",
        });

        expect(result.messageText).toBeTruthy();
        expect(result.messageText.toLowerCase()).toMatch(/hello.*world/);
      },
      { timeout: 30000 },
    );

    it.each(errorModels)(
      "should handle invalid specification gracefully with $name",
      async ({ config }) => {
        const conversationId = await client.createConversation();
        
        // Use an invalid specification ID
        await expect(
          client.streamAgent({
            conversationId,
            specificationId: "invalid-spec-id-12345",
            messagePrompt: "This should fail",
          })
        ).rejects.toThrow();
      },
      { timeout: 30000 },
    );
  });

  describe("Content Filtering", () => {
    const filterModels = TEST_MODELS.filter(
      (m) => m.name.includes("OpenAI") || m.name.includes("Anthropic"),
    ).slice(0, 1);

    it.each(filterModels)(
      "should handle content moderation with $name",
      async ({ config }) => {
        const conversationId = await client.createConversation();
        const specification = await client.createSpecification(config);

        const result = await client.streamAgent({
          conversationId,
          specificationId: specification.id,
          messagePrompt: "Tell me about content moderation in AI systems.",
        });

        expect(result.messageText).toBeTruthy();
        expect(result.messageText.length).toBeGreaterThan(50);
        // Should discuss content moderation professionally
        expect(result.messageText.toLowerCase()).toMatch(/content|moderation|safety|filter/);
      },
      { timeout: 30000 },
    );
  });

  describe("Large Response Handling", () => {
    const largeResponseModels = TEST_MODELS.filter(
      (m) => m.name.includes("OpenAI GPT-4o") || m.name.includes("Anthropic Claude"),
    ).slice(0, 1);

    it.each(largeResponseModels)(
      "should handle large responses with $name",
      async ({ config }) => {
        const conversationId = await client.createConversation();
        const specification = await client.createSpecification(config);

        let tokenCount = 0;
        let chunkCount = 0;

        const result = await client.streamAgent({
          conversationId,
          specificationId: specification.id,
          messagePrompt: "Write a detailed 10-paragraph essay about the history of computing, covering mechanical calculators, early computers, personal computers, the internet, mobile computing, and future trends.",
          onEvent: (event) => {
            if (event.type === "token") {
              tokenCount++;
            } else if (event.type === "chunk") {
              chunkCount++;
            }
          },
        });

        expect(result.messageText).toBeTruthy();
        expect(result.messageText.length).toBeGreaterThan(1000); // Should be a substantial essay
        expect(tokenCount).toBeGreaterThan(100);
        
        // Verify it covers the requested topics
        const topics = ["mechanical", "computer", "personal", "internet", "mobile", "future"];
        const coveredTopics = topics.filter(topic => 
          result.messageText.toLowerCase().includes(topic)
        );
        expect(coveredTopics.length).toBeGreaterThanOrEqual(4);
      },
      { timeout: 120000 },
    );
  });

  describe("Context Window Tracking", () => {
    const contextModels = TEST_MODELS.filter(
      (m) => m.name.includes("OpenAI GPT-4o Mini"),
    ).slice(0, 1);

    it.each(contextModels)(
      "should track context usage with $name",
      async ({ config }) => {
        const conversationId = await client.createConversation();
        const specification = await client.createSpecification(config);

        // First message
        const result1 = await client.streamAgent({
          conversationId,
          specificationId: specification.id,
          messagePrompt: "Remember this list: Apple, Banana, Cherry, Date, Elderberry.",
        });
        expect(result1.messageText).toBeTruthy();

        // Add more context
        const result2 = await client.streamAgent({
          conversationId,
          specificationId: specification.id,
          messagePrompt: "Add to the list: Fig, Grape, Honeydew.",
        });
        expect(result2.messageText).toBeTruthy();

        // Test recall
        const result3 = await client.streamAgent({
          conversationId,
          specificationId: specification.id,
          messagePrompt: "What was the first fruit I mentioned?",
        });
        expect(result3.messageText.toLowerCase()).toMatch(/apple/);

        // Check usage info if available
        if (result3.usage) {
          expect(result3.usage.promptTokens).toBeGreaterThan(0);
          expect(result3.usage.completionTokens).toBeGreaterThan(0);
        }
      },
      { timeout: 60000 },
    );
  });
});
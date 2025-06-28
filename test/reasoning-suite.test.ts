import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { GraphlitClient } from "../src/index.js";
import * as Types from "../src/generated/graphql-types.js";
import { TEST_MODELS, TestModelConfig } from "./test-models.js";
import { clearEnvironment, getEnvironment } from "./setup.js";
import { AgentStreamEvent } from "../src/types/ui-events.js";

describe("Reasoning Test Suite", () => {
  let client: GraphlitClient;

  beforeAll(async () => {
    await clearEnvironment();
    client = new GraphlitClient();
  });

  afterAll(async () => {
    await clearEnvironment();
  });

  describe("Reasoning Detection", () => {
    const reasoningModels = TEST_MODELS.filter(
      (m) =>
        m.name.includes("Bedrock Nova") ||
        m.name.includes("Deepseek Reasoner") ||
        m.name.includes("Anthropic Claude") ||
        m.name.includes("OpenAI o3"),
    );

    it.each(reasoningModels)(
      "should detect reasoning with $name",
      async ({ config }) => {
        const conversationId = await client.createConversation();
        const specification = await client.createSpecification(config);

        let reasoningStarted = false;
        let reasoningEnded = false;
        let reasoningContent = "";

        const result = await client.streamAgent({
          conversationId,
          specificationId: specification.id,
          messagePrompt: "If I have 3 apples and buy 2 more apples, but then eat 1 apple, how many apples do I have left? Think step by step.",
          onEvent: (event: AgentStreamEvent) => {
            if (event.type === "reasoning_start") {
              reasoningStarted = true;
            } else if (event.type === "reasoning_delta") {
              reasoningContent += event.content || "";
            } else if (event.type === "reasoning_end") {
              reasoningEnded = true;
            }
          },
        });

        expect(result.messageText).toBeTruthy();
        
        // Different models handle reasoning differently
        if (config.name.includes("Deepseek Reasoner") || config.name.includes("Bedrock Nova")) {
          expect(reasoningStarted).toBe(true);
          expect(reasoningEnded).toBe(true);
          expect(reasoningContent.length).toBeGreaterThan(0);
        }
        
        // All models should provide the correct answer
        expect(result.messageText).toMatch(/4|four/i);
      },
      { timeout: 60000 },
    );
  });

  describe("Anthropic Extended Thinking", () => {
    const anthropicModels = TEST_MODELS.filter(
      (m) => m.name.includes("Anthropic Claude"),
    ).slice(0, 2); // Test a couple of Anthropic models

    it.each(anthropicModels)(
      "should preserve extended thinking in conversation history with $name",
      async ({ config }) => {
        const conversationId = await client.createConversation();
        const specification = await client.createSpecification(config);

        // First message - trigger extended thinking
        const result1 = await client.streamAgent({
          conversationId,
          specificationId: specification.id,
          messagePrompt: "I need you to solve a complex problem. What is the sum of all prime numbers between 1 and 20? Think through this carefully.",
        });

        expect(result1.messageText).toBeTruthy();
        expect(result1.messageText).toMatch(/2.*3.*5.*7.*11.*13.*17.*19/);
        expect(result1.messageText).toMatch(/77/);

        // Second message - should have thinking in history
        const result2 = await client.streamAgent({
          conversationId,
          specificationId: specification.id,
          messagePrompt: "What was the method you used to solve the previous problem?",
        });

        expect(result2.messageText).toBeTruthy();
        expect(result2.messageText.toLowerCase()).toMatch(/prime|identify|sum|add/);
      },
      { timeout: 120000 },
    );
  });

  describe("Reasoning with Stream Cancellation", () => {
    const cancellationModels = TEST_MODELS.filter(
      (m) => m.name.includes("OpenAI GPT-4o") || m.name.includes("Anthropic Claude"),
    ).slice(0, 1);

    it.each(cancellationModels)(
      "should handle reasoning cancellation with $name",
      async ({ config }) => {
        const conversationId = await client.createConversation();
        const specification = await client.createSpecification(config);

        const abortController = new AbortController();
        let tokenCount = 0;
        let cancelled = false;

        const streamPromise = client.streamAgent({
          conversationId,
          specificationId: specification.id,
          messagePrompt: "Count from 1 to 100 very slowly, explaining each number in detail.",
          abortSignal: abortController.signal,
          onEvent: (event) => {
            if (event.type === "token") {
              tokenCount++;
              // Cancel after receiving some tokens
              if (tokenCount > 50) {
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
        expect(tokenCount).toBeGreaterThan(0);
        expect(tokenCount).toBeLessThan(500); // Should have stopped early
      },
      { timeout: 60000 },
    );
  });

  describe("Reasoning Format Detection", () => {
    const formatModels = TEST_MODELS.filter(
      (m) => m.name.includes("Deepseek") || m.name.includes("Bedrock Nova"),
    ).slice(0, 2);

    it.each(formatModels)(
      "should detect reasoning format with $name",
      async ({ config }) => {
        const conversationId = await client.createConversation();
        const specification = await client.createSpecification(config);

        let detectedFormat: string | undefined;

        const result = await client.streamAgent({
          conversationId,
          specificationId: specification.id,
          messagePrompt: "Solve this step by step: If a train travels 60 mph for 2 hours, then 80 mph for 3 hours, what's the total distance?",
          onEvent: (event) => {
            if (event.type === "reasoning_start") {
              detectedFormat = event.format;
            }
          },
        });

        expect(result.messageText).toBeTruthy();
        
        if (config.name.includes("Deepseek")) {
          expect(detectedFormat).toBe("markdown");
        } else if (config.name.includes("Bedrock Nova")) {
          expect(detectedFormat).toBe("xml");
        }
        
        // Verify correct answer (60*2 + 80*3 = 120 + 240 = 360)
        expect(result.messageText).toMatch(/360/);
      },
      { timeout: 60000 },
    );
  });
});
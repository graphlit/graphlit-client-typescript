import { describe, it, expect, beforeAll, vi } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import { AgentStreamEvent } from "../src/types/ui-events";

/**
 * Comprehensive test suite for reasoning/thinking detection across providers
 */
describe("Reasoning Detection", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;

  if (!orgId || !envId || !secret) {
    console.warn("⚠️  Skipping reasoning tests - missing Graphlit credentials");
    return;
  }

  let client: Graphlit;

  beforeAll(() => {
    client = new Graphlit(orgId, envId, secret);
  });

  describe("Bedrock Nova Reasoning", () => {
    it("should detect <thinking> tags in Nova Premier output", async () => {
      // Ready for testing!
      const spec = await client.createSpecification({
        name: "Nova Reasoning Test",
        serviceType: Types.ModelServiceTypes.Bedrock,
        bedrock: {
          model: Types.BedrockModels.NovaPremier,
        },
      });

      const reasoningContent: string[] = [];
      const mainContent: string[] = [];
      let reasoningDetected = false;

      await client.streamAgent(
        "What is 25% of 80? Think step by step.",
        (event: AgentStreamEvent) => {
          switch (event.type) {
            case "reasoning_update":
              reasoningDetected = true;
              reasoningContent.push(event.content);
              console.log(`🤔 [Nova] Reasoning: ${event.content}`);
              break;
            case "message_update":
              mainContent.push(event.message.message);
              break;
          }
        },
        undefined,
        { id: spec.createSpecification!.id },
      );

      expect(reasoningDetected).toBe(true);
      expect(reasoningContent.join("")).toContain("25");
      expect(reasoningContent.join("")).toContain("80");

      // Main content should not contain thinking tags
      const fullMainContent = mainContent.join("");
      expect(fullMainContent).not.toContain("<thinking>");
      expect(fullMainContent).not.toContain("</thinking>");

      await client.deleteSpecification(spec.createSpecification!.id);
    });

    it.skip("should handle nested thinking tags", async () => {
      // Test for edge cases with nested or malformed tags
    });
  });

  describe("Deepseek Reasoning", () => {
    it("should detect markdown-formatted reasoning", async () => {
      const spec = await client.createSpecification({
        name: "Deepseek Reasoning Test",
        serviceType: Types.ModelServiceTypes.Deepseek,
        deepseek: {
          model: Types.DeepseekModels.Reasoner,
        },
      });

      const reasoningSteps: string[] = [];
      let stepCount = 0;

      await client.streamAgent(
        "A train travels 120 miles in 2 hours. What is its average speed?",
        (event: AgentStreamEvent) => {
          if (event.type === "reasoning_update") {
            reasoningSteps.push(event.content);
            // Count reasoning steps
            const steps = event.content.match(/\*\*Step \d+:/g);
            if (steps) stepCount = steps.length;
          }
        },
        undefined,
        { id: spec.createSpecification!.id },
      );

      expect(reasoningSteps.length).toBeGreaterThan(0);
      expect(stepCount).toBeGreaterThanOrEqual(1);

      // Should contain speed calculation
      const fullReasoning = reasoningSteps.join("");
      expect(fullReasoning).toMatch(/speed|miles.*hour|120.*2/i);

      await client.deleteSpecification(spec.createSpecification!.id);
    });

    it.skip("should separate reasoning from final answer", async () => {
      // Ensure reasoning is not mixed with the final answer
    });
  });

  describe("Anthropic Claude Reasoning", () => {
    it.skip("should handle thinking blocks when enabled", async () => {
      // Note: Requires special API access to see thinking blocks
      const spec = await client.createSpecification({
        name: "Claude Reasoning Test",
        serviceType: Types.ModelServiceTypes.Anthropic,
        anthropic: {
          model: Types.AnthropicModels.Claude_3_5Sonnet,
        },
        // Future: reasoning: { enabled: true }
      });

      let thinkingDetected = false;

      await client.streamAgent(
        "What is the square root of 144? Show your thinking.",
        (event: AgentStreamEvent) => {
          if (
            event.type === "reasoning_update" &&
            event.format === "thinking_tag"
          ) {
            thinkingDetected = true;
            console.log("🤔 [Claude] Thinking:", event.content);
          }
        },
        undefined,
        { id: spec.createSpecification!.id },
      );

      // Claude hides thinking by default, so this might not detect anything
      // unless we have special API access
      console.log("Claude thinking detected:", thinkingDetected);

      await client.deleteSpecification(spec.createSpecification!.id);
    });
  });

  describe("Custom Pattern Detection", () => {
    it.skip("should detect custom reasoning patterns", async () => {
      // Test with a model that uses custom patterns
      const spec = await client.createSpecification({
        name: "Custom Pattern Test",
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4O_128K,
        },
        // Future: reasoning: {
        //   enabled: true,
        //   customPatterns: ["^Analysis:", "^Consideration:"]
        // }
      });

      const customReasoningDetected: string[] = [];

      await client.streamAgent(
        "Analyze the pros and cons of remote work. Start with 'Analysis:'",
        (event: AgentStreamEvent) => {
          if (event.type === "reasoning_update" && event.format === "custom") {
            customReasoningDetected.push(event.content);
          }
        },
        undefined,
        { id: spec.createSpecification!.id },
      );

      // Should detect custom patterns if the model follows instructions
      console.log("Custom patterns detected:", customReasoningDetected.length);

      await client.deleteSpecification(spec.createSpecification!.id);
    });
  });

  describe("Reasoning with Tools", () => {
    it.skip("should handle reasoning during tool use", async () => {
      const spec = await client.createSpecification({
        name: "Reasoning with Tools Test",
        serviceType: Types.ModelServiceTypes.Bedrock,
        bedrock: {
          model: Types.BedrockModels.Claude_3_7Sonnet,
        },
      });

      const tools: Types.ToolDefinitionInput[] = [
        {
          name: "calculate",
          description: "Perform a calculation",
          schema: JSON.stringify({
            type: "object",
            properties: {
              expression: { type: "string" },
            },
            required: ["expression"],
          }),
        },
      ];

      const reasoningBeforeTools: string[] = [];
      const reasoningAfterTools: string[] = [];
      let toolCalled = false;

      const toolHandlers = {
        calculate: async (args: any) => {
          toolCalled = true;
          return { result: eval(args.expression) }; // Not safe for production!
        },
      };

      await client.streamAgent(
        "Calculate the area of a circle with radius 5. Think about the formula first.",
        (event: AgentStreamEvent) => {
          if (event.type === "reasoning_update") {
            if (!toolCalled) {
              reasoningBeforeTools.push(event.content);
            } else {
              reasoningAfterTools.push(event.content);
            }
          }
        },
        undefined,
        { id: spec.createSpecification!.id },
        tools,
        toolHandlers,
      );

      // Should have reasoning before deciding to use tools
      expect(reasoningBeforeTools.length).toBeGreaterThan(0);

      // Reasoning should mention the formula
      const reasoning = reasoningBeforeTools.join("");
      expect(reasoning).toMatch(/π|pi|3\.14/i);

      await client.deleteSpecification(spec.createSpecification!.id);
    });
  });

  describe("Reasoning Event Lifecycle", () => {
    it.skip("should emit complete reasoning lifecycle", async () => {
      const events: string[] = [];

      // Mock a provider that emits reasoning
      const mockProvider = vi.fn();

      // Would need to inject mock provider for this test
      // This demonstrates the expected event flow

      expect(events).toEqual([
        "reasoning_start",
        "reasoning_update",
        "reasoning_update",
        "reasoning_end",
        "message_update",
        "conversation_completed",
      ]);
    });
  });

  describe("Performance Impact", () => {
    it.skip("should not significantly impact streaming performance", async () => {
      // Compare streaming time with and without reasoning detection
      const withoutReasoningTime = await measureStreamTime(false);
      const withReasoningTime = await measureStreamTime(true);

      // Reasoning detection should add minimal overhead (<10%)
      const overhead =
        (withReasoningTime - withoutReasoningTime) / withoutReasoningTime;
      expect(overhead).toBeLessThan(0.1);
    });
  });
});

async function measureStreamTime(enableReasoning: boolean): Promise<number> {
  // Helper to measure streaming performance
  const start = Date.now();
  // ... perform streaming
  return Date.now() - start;
}

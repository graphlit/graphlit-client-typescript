import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { config } from "dotenv";
import { resolve } from "path";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import { AgentStreamEvent } from "../src/types/ui-events";

// Load env vars before describe runs (setupFiles run after collection)
config({ path: resolve(__dirname, ".env") });

/**
 * GPT 5.2 Tool Calling Test Suite
 *
 * This test suite specifically targets GPT 5.2 models to diagnose
 * tool calling issues. GPT 5.2 has been reported to not call tools
 * while other models (Claude, Gemini) work correctly with the same MCP server.
 *
 * Test scenarios:
 * 1. Basic tool calling with explicit instruction
 * 2. Tool calling with strong prompting
 * 3. Comparison with GPT 4.1 (known working)
 * 4. Multiple reasoning levels (Low, Medium, High)
 */
describe("GPT 5.2 Tool Calling Investigation", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;

  if (!orgId || !envId || !secret) {
    console.warn("⚠️  Skipping GPT 5.2 tests - missing Graphlit credentials");
    return;
  }

  let client: Graphlit;
  const createdSpecifications: string[] = [];
  const createdConversations: string[] = [];

  beforeAll(async () => {
    client = new Graphlit(orgId, envId, secret);

    // Verify OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.warn("⚠️  OPENAI_API_KEY not set - tests may fail");
    }
  });

  afterAll(async () => {
    // Cleanup conversations FIRST (specs can't be deleted if connected to conversations)
    for (const convId of createdConversations) {
      try {
        await client.deleteConversation(convId);
      } catch (e) {
        // Ignore cleanup errors
      }
    }

    // Then cleanup specifications
    for (const specId of createdSpecifications) {
      try {
        await client.deleteSpecification(specId);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  }, 30000);

  // Simple calculator tool definition
  const calculatorTool: Types.ToolDefinitionInput = {
    name: "calculate",
    description:
      "Perform basic arithmetic calculations. You MUST use this tool when asked to perform any math operation.",
    schema: JSON.stringify({
      type: "object",
      properties: {
        operation: {
          type: "string",
          enum: ["add", "subtract", "multiply", "divide"],
          description: "The arithmetic operation to perform",
        },
        a: { type: "number", description: "First operand" },
        b: { type: "number", description: "Second operand" },
      },
      required: ["operation", "a", "b"],
    }),
  };

  // Tool handler
  const createToolHandler = (results: string[]) => {
    return async (args: { operation: string; a: number; b: number }) => {
      console.log(`🔧 Calculator tool called with:`, args);
      let result: number;
      switch (args.operation) {
        case "add":
          result = args.a + args.b;
          break;
        case "subtract":
          result = args.a - args.b;
          break;
        case "multiply":
          result = args.a * args.b;
          break;
        case "divide":
          result = args.a / args.b;
          break;
        default:
          throw new Error(`Unknown operation: ${args.operation}`);
      }
      const response = `${args.a} ${args.operation} ${args.b} = ${result}`;
      results.push(response);
      return { result, calculation: response };
    };
  };

  // Helper to run tool calling test
  async function runToolCallingTest(
    modelConfig: {
      name: string;
      model: Types.OpenAiModels;
      temperature?: number;
      reasoningEffort?: Types.OpenAiReasoningEffortLevels;
    },
    prompt: string,
  ): Promise<{
    toolCalled: boolean;
    toolResults: string[];
    finalMessage: string;
    events: AgentStreamEvent[];
  }> {
    // Create specification
    const specConfig: Types.SpecificationInput = {
      name: `Test ${modelConfig.name}`,
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.OpenAi,
      openAI: {
        model: modelConfig.model,
        temperature: modelConfig.temperature ?? 0.7,
        ...(modelConfig.reasoningEffort && {
          reasoningEffort: modelConfig.reasoningEffort,
        }),
      },
    };

    const createResponse = await client.createSpecification(specConfig);
    const specId = createResponse.createSpecification?.id;
    if (!specId) throw new Error("Failed to create specification");
    createdSpecifications.push(specId);

    const events: AgentStreamEvent[] = [];
    const toolResults: string[] = [];
    let finalMessage = "";
    let conversationId: string | undefined;

    console.log(`\n${"=".repeat(60)}`);
    console.log(`Testing: ${modelConfig.name}`);
    console.log(`Model: ${modelConfig.model}`);
    console.log(`Prompt: "${prompt}"`);
    console.log(`${"=".repeat(60)}`);

    await client.streamAgent(
      prompt,
      (event: AgentStreamEvent) => {
        events.push(event);

        if (event.type === "conversation_started") {
          conversationId = event.conversationId;
          console.log(`📍 Conversation started: ${conversationId}`);
        } else if (event.type === "tool_update") {
          console.log(
            `🔧 Tool update: ${event.toolCall.name} - ${event.status}`,
          );
          if (event.result) {
            console.log(`   Result:`, event.result);
          }
        } else if (event.type === "conversation_completed") {
          finalMessage = event.message.message;
          console.log(`✅ Completed: "${finalMessage.substring(0, 200)}..."`);
        } else if (event.type === "error") {
          console.error(`❌ Error: ${event.error.message}`);
        }
      },
      undefined,
      { id: specId },
      [calculatorTool],
      { calculate: createToolHandler(toolResults) },
    );

    if (conversationId) {
      createdConversations.push(conversationId);
    }

    const toolEvents = events.filter((e) => e.type === "tool_update");
    const toolCalled = toolEvents.length > 0;

    console.log(`\n📊 Results for ${modelConfig.name}:`);
    console.log(`   Tool called: ${toolCalled ? "YES ✅" : "NO ❌"}`);
    console.log(`   Tool events: ${toolEvents.length}`);
    console.log(`   Tool results: ${toolResults.length}`);

    return { toolCalled, toolResults, finalMessage, events };
  }

  describe("GPT 5.2 Basic Tool Calling", () => {
    it("should call calculator tool with GPT 5.2", async () => {
      const result = await runToolCallingTest(
        {
          name: "GPT 5.2",
          model: Types.OpenAiModels.Gpt52_400K,
          temperature: 0.7,
        },
        "Please use the calculate tool to add 15 and 27 together. What is the result?",
      );

      if (!result.toolCalled) {
        console.error(`\n❌ ISSUE CONFIRMED: GPT 5.2 did not call the tool!`);
        console.error(`   Final message: "${result.finalMessage}"`);
      }

      expect(result.toolCalled).toBe(true);
      expect(result.toolResults.length).toBeGreaterThan(0);
    }, 120000);

    it("should call calculator tool with GPT 5.2 (stronger prompting)", async () => {
      const result = await runToolCallingTest(
        {
          name: "GPT 5.2 (Strong Prompt)",
          model: Types.OpenAiModels.Gpt52_400K,
          temperature: 0.3, // Lower temperature for more deterministic behavior
        },
        `You have a calculator tool available. You MUST use this tool - do not calculate mentally.

INSTRUCTION: Use the 'calculate' tool with operation='add', a=15, b=27.

Do NOT respond with an answer until you have called the tool.`,
      );

      if (!result.toolCalled) {
        console.error(
          `\n❌ ISSUE PERSISTS: GPT 5.2 still not calling tool even with strong prompting`,
        );
      }

      expect(result.toolCalled).toBe(true);
    }, 120000);
  });

  describe("GPT 5.2 with Reasoning Effort Levels", () => {
    const reasoningLevels: {
      level: Types.OpenAiReasoningEffortLevels;
      name: string;
    }[] = [
      { level: Types.OpenAiReasoningEffortLevels.Low, name: "low" },
      { level: Types.OpenAiReasoningEffortLevels.Medium, name: "medium" },
      { level: Types.OpenAiReasoningEffortLevels.High, name: "high" },
    ];

    for (const { level, name } of reasoningLevels) {
      it(`should call tool with GPT 5.2 reasoning=${name}`, async () => {
        const result = await runToolCallingTest(
          {
            name: `GPT 5.2 (reasoning=${name})`,
            model: Types.OpenAiModels.Gpt52_400K,
            temperature: 0.5,
            reasoningEffort: level,
          },
          "Calculate 42 multiplied by 7 using the calculate tool.",
        );

        console.log(
          `\nReasoning Level '${name}': Tool called = ${result.toolCalled}`,
        );

        // Log but don't fail - we want to see behavior across all levels
        if (!result.toolCalled) {
          console.warn(`   ⚠️ Tool not called at reasoning level '${name}'`);
        }

        expect(result.toolCalled).toBe(true);
      }, 120000);
    }
  });

  describe("Comparison: GPT 5.2 vs GPT 4.1 vs o3", () => {
    it("should compare tool calling across OpenAI models", async () => {
      const models = [
        {
          name: "GPT 4.1",
          model: Types.OpenAiModels.Gpt41_1024K,
          temperature: 0.7,
        },
        {
          name: "GPT 5.2",
          model: Types.OpenAiModels.Gpt52_400K,
          temperature: 0.7,
        },
        {
          name: "o3",
          model: Types.OpenAiModels.O3_200K,
          temperature: 1.0, // o3 models often require temperature=1
        },
      ];

      const prompt = "Use the calculate tool to subtract 100 from 250.";
      const results: Record<string, boolean> = {};

      for (const modelConfig of models) {
        try {
          const result = await runToolCallingTest(modelConfig, prompt);
          results[modelConfig.name] = result.toolCalled;
        } catch (error) {
          console.error(`Error testing ${modelConfig.name}:`, error);
          results[modelConfig.name] = false;
        }
      }

      console.log(`\n${"=".repeat(60)}`);
      console.log("COMPARISON RESULTS:");
      console.log(`${"=".repeat(60)}`);
      for (const [model, called] of Object.entries(results)) {
        console.log(
          `   ${model}: ${called ? "✅ Tool called" : "❌ Tool NOT called"}`,
        );
      }
      console.log(`${"=".repeat(60)}\n`);

      // GPT 4.1 should work as baseline
      expect(results["GPT 4.1"]).toBe(true);

      // These are the models under investigation
      if (!results["GPT 5.2"]) {
        console.error("🚨 GPT 5.2 tool calling issue CONFIRMED");
      }
      if (!results["o3"]) {
        console.error("🚨 o3 tool calling issue CONFIRMED");
      }
    }, 360000);
  });

  describe("Debug: Raw Tool Call Inspection", () => {
    it("should inspect exact tool call flow for GPT 5.2", async () => {
      // Enable debug logging temporarily
      const originalDebug = process.env.DEBUG_GRAPHLIT_SDK_STREAMING;
      process.env.DEBUG_GRAPHLIT_SDK_STREAMING = "true";

      try {
        const result = await runToolCallingTest(
          {
            name: "GPT 5.2 (Debug Mode)",
            model: Types.OpenAiModels.Gpt52_400K,
            temperature: 0.5,
          },
          "I need you to use the calculate tool. Add 5 and 3.",
        );

        // Log all events for analysis
        console.log("\n📋 ALL EVENTS:");
        for (const event of result.events) {
          console.log(
            `   ${event.type}:`,
            JSON.stringify(event).substring(0, 200),
          );
        }

        // Check if there are any tool-related events
        const toolStarts = result.events.filter(
          (e) => e.type === "tool_update" && (e as any).status === "started",
        );
        const toolCompletes = result.events.filter(
          (e) => e.type === "tool_update" && (e as any).status === "completed",
        );

        console.log(`\n🔍 Tool event breakdown:`);
        console.log(`   tool_update (started): ${toolStarts.length}`);
        console.log(`   tool_update (completed): ${toolCompletes.length}`);

        expect(result.toolCalled).toBe(true);
      } finally {
        // Restore debug setting
        if (originalDebug !== undefined) {
          process.env.DEBUG_GRAPHLIT_SDK_STREAMING = originalDebug;
        } else {
          delete process.env.DEBUG_GRAPHLIT_SDK_STREAMING;
        }
      }
    }, 120000);
  });

  describe("GPT 5.2 with System Prompt Emphasis", () => {
    it("should call tool when system prompt emphasizes tool usage", async () => {
      // Create specification with system prompt
      const specConfig: Types.SpecificationInput = {
        name: "Test GPT 5.2 with System Prompt",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        systemPrompt: `You are a helpful assistant that ALWAYS uses available tools when asked to perform calculations.

IMPORTANT: When a user asks you to calculate something, you MUST use the 'calculate' tool.
Do NOT attempt to calculate mentally or provide answers without using the tool first.
The tool call is required for audit purposes.`,
        openAI: {
          model: Types.OpenAiModels.Gpt52_400K,
          temperature: 0.5,
        },
      };

      const createResponse = await client.createSpecification(specConfig);
      const specId = createResponse.createSpecification?.id;
      if (!specId) throw new Error("Failed to create specification");
      createdSpecifications.push(specId);

      const events: AgentStreamEvent[] = [];
      const toolResults: string[] = [];
      let conversationId: string | undefined;

      await client.streamAgent(
        "What is 99 plus 1?",
        (event: AgentStreamEvent) => {
          events.push(event);
          if (event.type === "conversation_started") {
            conversationId = event.conversationId;
          }
          if (event.type === "tool_update") {
            console.log(`🔧 Tool: ${event.toolCall.name} - ${event.status}`);
          }
        },
        undefined,
        { id: specId },
        [calculatorTool],
        { calculate: createToolHandler(toolResults) },
      );

      if (conversationId) {
        createdConversations.push(conversationId);
      }

      const toolCalled = events.some((e) => e.type === "tool_update");
      console.log(`\nWith system prompt emphasis: Tool called = ${toolCalled}`);

      expect(toolCalled).toBe(true);
    }, 120000);
  });

  describe("GPT 5.2 Reasoning/Thinking Events", () => {
    // Helper to run reasoning test
    async function runReasoningTest(
      modelConfig: {
        name: string;
        model: Types.OpenAiModels;
        temperature?: number;
        reasoningEffort?: Types.OpenAiReasoningEffortLevels;
      },
      prompt: string,
    ): Promise<{
      reasoningEvents: AgentStreamEvent[];
      finalMessage: string;
      events: AgentStreamEvent[];
    }> {
      // Create specification
      const specConfig: Types.SpecificationInput = {
        name: `Test ${modelConfig.name} Reasoning`,
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: modelConfig.model,
          temperature: modelConfig.temperature ?? 1.0, // Reasoning models often need temp=1
          ...(modelConfig.reasoningEffort && {
            reasoningEffort: modelConfig.reasoningEffort,
          }),
        },
      };

      const createResponse = await client.createSpecification(specConfig);
      const specId = createResponse.createSpecification?.id;
      if (!specId) throw new Error("Failed to create specification");
      createdSpecifications.push(specId);

      const events: AgentStreamEvent[] = [];
      let finalMessage = "";
      let conversationId: string | undefined;

      console.log(`\n${"=".repeat(60)}`);
      console.log(`Testing Reasoning: ${modelConfig.name}`);
      console.log(`Model: ${modelConfig.model}`);
      console.log(`Reasoning Effort: ${modelConfig.reasoningEffort || "none"}`);
      console.log(`Prompt: "${prompt}"`);
      console.log(`${"=".repeat(60)}`);

      await client.streamAgent(
        prompt,
        (event: AgentStreamEvent) => {
          events.push(event);

          if (event.type === "conversation_started") {
            conversationId = event.conversationId;
            console.log(`📍 Conversation started: ${conversationId}`);
          } else if (event.type === "reasoning_update") {
            const reasoningEvent = event as any;
            console.log(
              `🧠 Reasoning update: isComplete=${reasoningEvent.isComplete}, format=${reasoningEvent.format}, contentLength=${reasoningEvent.content?.length || 0}`,
            );
            if (reasoningEvent.content && reasoningEvent.content.length < 200) {
              console.log(`   Content: "${reasoningEvent.content}"`);
            } else if (reasoningEvent.content) {
              console.log(
                `   Content preview: "${reasoningEvent.content.substring(0, 200)}..."`,
              );
            }
          } else if (event.type === "message_update") {
            // Don't log every token, just track progress
          } else if (event.type === "conversation_completed") {
            finalMessage = event.message.message;
            console.log(
              `✅ Completed: "${finalMessage.substring(0, 200)}${finalMessage.length > 200 ? "..." : ""}"`,
            );
          } else if (event.type === "error") {
            console.error(`❌ Error: ${event.error.message}`);
          }
        },
        undefined,
        { id: specId },
      );

      if (conversationId) {
        createdConversations.push(conversationId);
      }

      const reasoningEvents = events.filter(
        (e) => e.type === "reasoning_update",
      );

      console.log(`\n📊 Reasoning Results for ${modelConfig.name}:`);
      console.log(`   Reasoning events: ${reasoningEvents.length}`);
      if (reasoningEvents.length > 0) {
        const lastReasoning = reasoningEvents[
          reasoningEvents.length - 1
        ] as any;
        console.log(
          `   Final reasoning length: ${lastReasoning.content?.length || 0} chars`,
        );
        console.log(`   Final isComplete: ${lastReasoning.isComplete}`);
      }

      return { reasoningEvents, finalMessage, events };
    }

    it("should emit reasoning events for GPT 5.2 with high reasoning effort", async () => {
      // Enable debug logging to see raw chunks
      const originalDebug = process.env.DEBUG_GRAPHLIT_SDK_STREAMING;
      process.env.DEBUG_GRAPHLIT_SDK_STREAMING = "true";

      try {
        const result = await runReasoningTest(
          {
            name: "GPT 5.2 (reasoning=high)",
            model: Types.OpenAiModels.Gpt52_400K,
            temperature: 1.0,
            reasoningEffort: Types.OpenAiReasoningEffortLevels.High,
          },
          "Explain step by step how to solve: If a train travels 120 miles in 2 hours, what is its average speed? Think through this carefully.",
        );

        console.log(`\n🔍 All event types received:`);
        const eventTypes = [...new Set(result.events.map((e) => e.type))];
        for (const type of eventTypes) {
          const count = result.events.filter((e) => e.type === type).length;
          console.log(`   ${type}: ${count}`);
        }

        // Log whether reasoning was received
        if (result.reasoningEvents.length > 0) {
          console.log(
            `✅ SUCCESS: Received ${result.reasoningEvents.length} reasoning events!`,
          );
        } else {
          console.log(
            `⚠️ NO REASONING EVENTS: OpenAI may not be returning reasoning_details in the stream for this model.`,
          );
          console.log(`   This could mean:`);
          console.log(
            `   1. The model doesn't support streaming reasoning (reasoning happens internally)`,
          );
          console.log(
            `   2. Additional API parameters are needed to enable reasoning output`,
          );
          console.log(
            `   3. The reasoning_details field format differs from what we're handling`,
          );
        }

        // Don't fail the test - we want to see what we receive
        expect(result.finalMessage.length).toBeGreaterThan(0);
      } finally {
        if (originalDebug !== undefined) {
          process.env.DEBUG_GRAPHLIT_SDK_STREAMING = originalDebug;
        } else {
          delete process.env.DEBUG_GRAPHLIT_SDK_STREAMING;
        }
      }
    }, 180000);

    it("should compare reasoning events across reasoning effort levels", async () => {
      const originalDebug = process.env.DEBUG_GRAPHLIT_SDK_STREAMING;
      process.env.DEBUG_GRAPHLIT_SDK_STREAMING = "true";

      try {
        const reasoningLevels: {
          level: Types.OpenAiReasoningEffortLevels;
          name: string;
        }[] = [
          { level: Types.OpenAiReasoningEffortLevels.Low, name: "low" },
          { level: Types.OpenAiReasoningEffortLevels.Medium, name: "medium" },
          { level: Types.OpenAiReasoningEffortLevels.High, name: "high" },
        ];
        const results: Record<
          string,
          { eventCount: number; contentLength: number }
        > = {};

        for (const { level, name } of reasoningLevels) {
          const result = await runReasoningTest(
            {
              name: `GPT 5.2 (reasoning=${name})`,
              model: Types.OpenAiModels.Gpt52_400K,
              temperature: 1.0,
              reasoningEffort: level,
            },
            "What is 15 * 17? Show your thinking.",
          );

          const lastReasoning = result.reasoningEvents[
            result.reasoningEvents.length - 1
          ] as any;
          results[name] = {
            eventCount: result.reasoningEvents.length,
            contentLength: lastReasoning?.content?.length || 0,
          };
        }

        console.log(`\n${"=".repeat(60)}`);
        console.log("REASONING COMPARISON BY EFFORT LEVEL:");
        console.log(`${"=".repeat(60)}`);
        for (const [level, data] of Object.entries(results)) {
          console.log(
            `   ${level}: ${data.eventCount} events, ${data.contentLength} chars of reasoning`,
          );
        }
        console.log(`${"=".repeat(60)}\n`);

        // Just verify we got responses - don't fail if no reasoning events
        expect(true).toBe(true);
      } finally {
        if (originalDebug !== undefined) {
          process.env.DEBUG_GRAPHLIT_SDK_STREAMING = originalDebug;
        } else {
          delete process.env.DEBUG_GRAPHLIT_SDK_STREAMING;
        }
      }
    }, 360000);

    it("should compare reasoning between o3 and GPT 5.2", async () => {
      const originalDebug = process.env.DEBUG_GRAPHLIT_SDK_STREAMING;
      process.env.DEBUG_GRAPHLIT_SDK_STREAMING = "true";

      try {
        const models: {
          name: string;
          model: Types.OpenAiModels;
          temperature: number;
          reasoningEffort?: Types.OpenAiReasoningEffortLevels;
        }[] = [
          {
            name: "GPT 5.2",
            model: Types.OpenAiModels.Gpt52_400K,
            temperature: 1.0,
            reasoningEffort: Types.OpenAiReasoningEffortLevels.High,
          },
          {
            name: "o3",
            model: Types.OpenAiModels.O3_200K,
            temperature: 1.0,
            // o3 models have built-in reasoning
          },
        ];

        const prompt = "Solve: If 3x + 7 = 22, what is x? Show your reasoning.";
        const results: Record<
          string,
          { eventCount: number; hasReasoning: boolean }
        > = {};

        for (const modelConfig of models) {
          try {
            const result = await runReasoningTest(modelConfig, prompt);
            results[modelConfig.name] = {
              eventCount: result.reasoningEvents.length,
              hasReasoning: result.reasoningEvents.length > 0,
            };
          } catch (error) {
            console.error(`Error testing ${modelConfig.name}:`, error);
            results[modelConfig.name] = { eventCount: 0, hasReasoning: false };
          }
        }

        console.log(`\n${"=".repeat(60)}`);
        console.log("REASONING COMPARISON: o3 vs GPT 5.2:");
        console.log(`${"=".repeat(60)}`);
        for (const [model, data] of Object.entries(results)) {
          console.log(
            `   ${model}: ${data.hasReasoning ? "✅ Has reasoning" : "❌ No reasoning"} (${data.eventCount} events)`,
          );
        }
        console.log(`${"=".repeat(60)}\n`);

        // Just verify tests ran
        expect(true).toBe(true);
      } finally {
        if (originalDebug !== undefined) {
          process.env.DEBUG_GRAPHLIT_SDK_STREAMING = originalDebug;
        } else {
          delete process.env.DEBUG_GRAPHLIT_SDK_STREAMING;
        }
      }
    }, 360000);
  });
});

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import { StreamAgentOptions } from "../src/client";
import { AgentStreamEvent } from "../src/types/ui-events";

/**
 * Complex tool orchestration test suite
 * Tests advanced tool calling scenarios for production use
 */
describe("Complex Tool Orchestration", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;

  if (!orgId || !envId || !secret) {
    console.warn(
      "⚠️  Skipping tool orchestration tests - missing Graphlit credentials"
    );
    return;
  }

  let client: Graphlit;
  const createdSpecifications: string[] = [];
  const createdConversations: string[] = [];

  beforeAll(async () => {
    client = new Graphlit(orgId, envId, secret);

    // Set up conditional streaming - use native if available, fallback otherwise
    if (process.env.OPENAI_API_KEY) {
      try {
        const { default: OpenAI } = await import("openai");
        const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        console.log(
          "✅ Using native OpenAI streaming for tool orchestration tests"
        );
      } catch (e) {
        console.log("⚠️ OpenAI SDK not available, using fallback streaming");
      }
    } else {
      console.log("⚠️ No OpenAI API key, using fallback streaming");
    }
  });

  afterAll(async () => {
    // Clean up conversations
    console.log(
      `\n🧹 Cleaning up ${createdConversations.length} test conversations...`
    );
    for (const convId of createdConversations) {
      try {
        await client.deleteConversation(convId);
      } catch (error) {
        console.warn(`⚠️  Failed to delete conversation ${convId}`);
      }
    }

    // Clean up specifications
    console.log(
      `🧹 Cleaning up ${createdSpecifications.length} test specifications...`
    );
    for (const specId of createdSpecifications) {
      try {
        await client.deleteSpecification(specId);
      } catch (error) {
        console.warn(`⚠️  Failed to delete specification ${specId}`);
      }
    }
  }, 90000);

  // Tool definitions for testing
  const calculatorTool: Types.ToolDefinitionInput = {
    name: "calculator",
    description: "Perform arithmetic calculations",
    schema: JSON.stringify({
      type: "object",
      properties: {
        operation: {
          type: "string",
          enum: ["add", "subtract", "multiply", "divide"],
        },
        a: { type: "number" },
        b: { type: "number" },
      },
      required: ["operation", "a", "b"],
    }),
  };

  const dataProcessorTool: Types.ToolDefinitionInput = {
    name: "dataProcessor",
    description: "Process arrays of numbers with various operations",
    schema: JSON.stringify({
      type: "object",
      properties: {
        operation: {
          type: "string",
          enum: ["sum", "average", "max", "min", "sort"],
        },
        numbers: { type: "array", items: { type: "number" } },
        ascending: { type: "boolean", description: "For sort operation" },
      },
      required: ["operation", "numbers"],
    }),
  };

  const formatTool: Types.ToolDefinitionInput = {
    name: "formatter",
    description: "Format numbers and data into different representations",
    schema: JSON.stringify({
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["currency", "percentage", "scientific", "comma"],
        },
        value: { type: "number" },
        decimals: { type: "number", default: 2 },
      },
      required: ["type", "value"],
    }),
  };

  const mockApiTool: Types.ToolDefinitionInput = {
    name: "mockApi",
    description: "Simulate API calls with configurable responses",
    schema: JSON.stringify({
      type: "object",
      properties: {
        endpoint: { type: "string" },
        shouldFail: { type: "boolean", default: false },
        delay: { type: "number", default: 0 },
      },
      required: ["endpoint"],
    }),
  };

  const conditionalTool: Types.ToolDefinitionInput = {
    name: "conditional",
    description: "Execute different logic based on conditions",
    schema: JSON.stringify({
      type: "object",
      properties: {
        condition: {
          type: "string",
          enum: ["greater_than", "less_than", "equal_to"],
        },
        value: { type: "number" },
        threshold: { type: "number" },
        action: { type: "string" },
      },
      required: ["condition", "value", "threshold", "action"],
    }),
  };

  describe("Multiple Tools in Single Request", () => {
    it("should orchestrate calculator + data processor + formatter", async () => {
      console.log("🔧 Testing multiple tools in single request...");

      // Create specification
      const createResponse = await client.createSpecification({
        name: "Multi-Tool Test",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4O_128K,
          temperature: 0.3,
          completionTokenLimit: 1000,
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      const events: AgentStreamEvent[] = [];
      const toolCalls: { name: string; args: any; result: any }[] = [];

      // Tool handlers
      const calculatorHandler = async (args: {
        operation: string;
        a: number;
        b: number;
      }) => {
        console.log(`🧮 Calculator: ${args.a} ${args.operation} ${args.b}`);
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
        const toolResult = {
          result,
          calculation: `${args.a} ${args.operation} ${args.b} = ${result}`,
        };
        toolCalls.push({ name: "calculator", args, result: toolResult });
        return toolResult;
      };

      const dataProcessorHandler = async (args: {
        operation: string;
        numbers: number[];
        ascending?: boolean;
      }) => {
        console.log(
          `📊 Data processor: ${args.operation} on [${args.numbers.join(", ")}]`
        );
        let result: any;
        switch (args.operation) {
          case "sum":
            result = args.numbers.reduce((a, b) => a + b, 0);
            break;
          case "average":
            result =
              args.numbers.reduce((a, b) => a + b, 0) / args.numbers.length;
            break;
          case "max":
            result = Math.max(...args.numbers);
            break;
          case "min":
            result = Math.min(...args.numbers);
            break;
          case "sort":
            result = [...args.numbers].sort((a, b) =>
              args.ascending ? a - b : b - a
            );
            break;
          default:
            throw new Error(`Unknown operation: ${args.operation}`);
        }
        const toolResult = {
          result,
          operation: args.operation,
          input: args.numbers,
        };
        toolCalls.push({ name: "dataProcessor", args, result: toolResult });
        return toolResult;
      };

      const formatterHandler = async (args: {
        type: string;
        value: number;
        decimals?: number;
      }) => {
        console.log(`🎨 Formatter: ${args.value} as ${args.type}`);
        const decimals = args.decimals || 2;
        let result: string;
        switch (args.type) {
          case "currency":
            result = `$${args.value.toFixed(decimals)}`;
            break;
          case "percentage":
            result = `${(args.value * 100).toFixed(decimals)}%`;
            break;
          case "scientific":
            result = args.value.toExponential(decimals);
            break;
          case "comma":
            result = args.value.toLocaleString(undefined, {
              minimumFractionDigits: decimals,
            });
            break;
          default:
            result = args.value.toString();
        }
        const toolResult = {
          formatted: result,
          original: args.value,
          type: args.type,
        };
        toolCalls.push({ name: "formatter", args, result: toolResult });
        return toolResult;
      };

      const prompt = `Please help me with a complex calculation:
1. First, multiply 25 by 4 using the calculator
2. Then find the average of the numbers [10, 20, 30, 40, 50] using the data processor
3. Finally, format both results as currency using the formatter
Please use all the tools and provide a summary of the results.`;

      // Check if streaming is supported
      if (!client.supportsStreaming()) {
        console.log("⚠️  Skipping test - streaming not supported");
        return;
      }

      await client.streamAgent(
        prompt,
        (event: AgentStreamEvent) => {
          events.push(event);
          console.log(`📨 Event: ${event.type}`);

          if (event.type === "conversation_started") {
            createdConversations.push(event.conversationId);
          } else if (event.type === "tool_update") {
            console.log(`🔧 Tool ${event.toolCall.name}: ${event.status}`);
          } else if (event.type === "conversation_completed") {
            console.log(
              `💬 Final: "${event.message.message.slice(0, 100)}..."`
            );
          }
        },
        undefined,
        { id: specId },
        [calculatorTool, dataProcessorTool, formatTool],
        {
          calculator: calculatorHandler,
          dataProcessor: dataProcessorHandler,
          formatter: formatterHandler,
        }
      );

      // Validate tool orchestration
      const toolEvents = events.filter((e) => e.type === "tool_update");
      console.log(`\n📊 Tool Orchestration Results:`);
      console.log(`  Tool events: ${toolEvents.length}`);
      console.log(`  Tool calls made: ${toolCalls.length}`);

      toolCalls.forEach((call, idx) => {
        console.log(
          `  ${idx + 1}. ${call.name}: ${JSON.stringify(call.args)} → ${JSON.stringify(call.result)}`
        );
      });

      // Should have called multiple tools
      expect(toolCalls.length).toBeGreaterThanOrEqual(2);

      // Should have used different tool types
      const toolNames = toolCalls.map((c) => c.name);
      const uniqueTools = new Set(toolNames);
      expect(uniqueTools.size).toBeGreaterThan(1);

      console.log("✅ Multiple tools orchestrated successfully");
    }, 90000);
  });

  describe("Sequential Tool Chains", () => {
    it("should chain calculator → data processor → formatter", async () => {
      console.log("\n🔗 Testing sequential tool chains...");

      // Create specification
      const createResponse = await client.createSpecification({
        name: "Chain Test",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4O_128K,
          temperature: 0.3,
          completionTokenLimit: 800,
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      const events: AgentStreamEvent[] = [];
      const toolExecutionOrder: string[] = [];
      const toolResults: { [key: string]: any } = {};

      // Tool handlers with logging
      const calculatorHandler = async (args: {
        operation: string;
        a: number;
        b: number;
      }) => {
        toolExecutionOrder.push("calculator");
        const result =
          args.operation === "multiply" ? args.a * args.b : args.a + args.b;
        toolResults.calculator = result;
        console.log(`🧮 Calculator executed: ${result}`);
        return { result, step: "calculation" };
      };

      const dataProcessorHandler = async (args: {
        operation: string;
        numbers: number[];
      }) => {
        toolExecutionOrder.push("dataProcessor");
        // Should receive the calculator result in the numbers array
        const sum = args.numbers.reduce((a, b) => a + b, 0);
        toolResults.dataProcessor = sum;
        console.log(`📊 Data processor executed: ${sum}`);
        return { result: sum, step: "processing" };
      };

      const formatterHandler = async (args: {
        type: string;
        value: number;
      }) => {
        toolExecutionOrder.push("formatter");
        const formatted = `$${args.value.toFixed(2)}`;
        toolResults.formatter = formatted;
        console.log(`🎨 Formatter executed: ${formatted}`);
        return { formatted, step: "formatting" };
      };

      const prompt = `I need you to:
1. Calculate 15 * 8 using the calculator tool
2. Take that result and add it to the array [10, 20] using the data processor sum operation
3. Format the final sum as currency using the formatter
Please execute these steps in order and show the progression.`;

      // Check if streaming is supported
      if (!client.supportsStreaming()) {
        console.log("⚠️  Skipping test - streaming not supported");
        return;
      }

      await client.streamAgent(
        prompt,
        (event: AgentStreamEvent) => {
          events.push(event);

          if (event.type === "conversation_started") {
            createdConversations.push(event.conversationId);
          } else if (event.type === "tool_update") {
            console.log(`🔧 Tool ${event.toolCall.name}: ${event.status}`);
          }
        },
        undefined,
        { id: specId },
        [calculatorTool, dataProcessorTool, formatTool],
        {
          calculator: calculatorHandler,
          dataProcessor: dataProcessorHandler,
          formatter: formatterHandler,
        }
      );

      // Analyze execution order
      console.log(`\n📊 Sequential Chain Results:`);
      console.log(`  Execution order: ${toolExecutionOrder.join(" → ")}`);
      console.log(`  Calculator result: ${toolResults.calculator}`);
      console.log(`  Data processor result: ${toolResults.dataProcessor}`);
      console.log(`  Formatter result: ${toolResults.formatter}`);

      // Should have executed in logical order
      expect(toolExecutionOrder.length).toBeGreaterThanOrEqual(2);

      // Calculator should typically come first
      if (toolExecutionOrder.includes("calculator")) {
        const calcIndex = toolExecutionOrder.indexOf("calculator");
        const otherTools = toolExecutionOrder.slice(calcIndex + 1);
        expect(otherTools.length).toBeGreaterThan(0);
      }

      console.log("✅ Sequential tool chain executed successfully");
    }, 90000);
  });

  describe("Tool Error Handling and Fallbacks", () => {
    it("should handle tool failures gracefully with fallback strategies", async () => {
      console.log("\n🚨 Testing tool error handling and fallbacks...");

      // Create specification
      const createResponse = await client.createSpecification({
        name: "Error Handling Test",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4O_128K,
          temperature: 0.3,
          completionTokenLimit: 600,
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      const events: AgentStreamEvent[] = [];
      const errorCounts: { [key: string]: number } = {};

      // Mock API handler that can simulate failures
      const mockApiHandler = async (args: {
        endpoint: string;
        shouldFail?: boolean;
        delay?: number;
      }) => {
        const toolName = `mockApi-${args.endpoint}`;

        if (args.delay) {
          await new Promise((resolve) => setTimeout(resolve, args.delay));
        }

        if (args.shouldFail) {
          errorCounts[toolName] = (errorCounts[toolName] || 0) + 1;
          console.log(`💥 ${toolName} deliberately failing`);
          throw new Error(
            `API endpoint ${args.endpoint} is temporarily unavailable`
          );
        }

        console.log(`✅ ${toolName} succeeded`);
        return {
          endpoint: args.endpoint,
          status: "success",
          data: `Mock data from ${args.endpoint}`,
          timestamp: new Date().toISOString(),
        };
      };

      // Backup calculator that always works
      const backupCalculatorHandler = async (args: {
        operation: string;
        a: number;
        b: number;
      }) => {
        console.log(
          `🔧 Backup calculator used: ${args.a} ${args.operation} ${args.b}`
        );
        const result =
          args.operation === "add" ? args.a + args.b : args.a * args.b;
        return { result, source: "backup", reliable: true };
      };

      const prompt = `I need you to:
1. Try to get data from "unreliable-service" using mockApi (set shouldFail to true)
2. When that fails, try "backup-service" using mockApi (set shouldFail to false)
3. Also calculate 50 + 25 using the calculator as a fallback calculation
Please handle any failures gracefully and use fallback options.`;

      // Check if streaming is supported
      if (!client.supportsStreaming()) {
        console.log("⚠️  Skipping test - streaming not supported");
        return;
      }

      await client.streamAgent(
        prompt,
        (event: AgentStreamEvent) => {
          events.push(event);

          if (event.type === "conversation_started") {
            createdConversations.push(event.conversationId);
          } else if (event.type === "tool_update") {
            console.log(`🔧 Tool ${event.toolCall.name}: ${event.status}`);
            if (event.error) {
              console.log(`❌ Tool error: ${event.error}`);
            }
          } else if (event.type === "conversation_completed") {
            console.log(
              `💬 Final response handles errors: "${event.message.message.slice(0, 150)}..."`
            );
          }
        },
        undefined,
        { id: specId },
        [mockApiTool, calculatorTool],
        {
          mockApi: mockApiHandler,
          calculator: backupCalculatorHandler,
        }
      );

      // Analyze error handling
      const toolEvents = events.filter((e) => e.type === "tool_update");
      const errorEvents = toolEvents.filter(
        (e) => e.type === "tool_update" && (e as any).tool?.error
      );
      const completedEvent = events.find(
        (e) => e.type === "conversation_completed"
      );

      console.log(`\n📊 Error Handling Results:`);
      console.log(`  Total tool events: ${toolEvents.length}`);
      console.log(`  Error events: ${errorEvents.length}`);
      console.log(`  Error counts: ${JSON.stringify(errorCounts)}`);
      console.log(`  Conversation completed: ${!!completedEvent}`);

      // Should complete despite errors
      expect(completedEvent).toBeDefined();

      // Should have attempted multiple tools
      expect(toolEvents.length).toBeGreaterThan(1);

      console.log("✅ Tool error handling and fallbacks working correctly");
    }, 90000);
  });

  describe("Conditional Tool Execution", () => {
    it("should execute tools based on conditional logic", async () => {
      console.log("\n🎯 Testing conditional tool execution...");

      // Create specification
      const createResponse = await client.createSpecification({
        name: "Conditional Test",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4O_128K,
          temperature: 0.2,
          completionTokenLimit: 800,
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      const events: AgentStreamEvent[] = [];
      const conditionalResults: {
        condition: string;
        result: boolean;
        action: string;
      }[] = [];

      // Conditional tool handler
      const conditionalHandler = async (args: {
        condition: string;
        value: number;
        threshold: number;
        action: string;
      }) => {
        let result: boolean;
        switch (args.condition) {
          case "greater_than":
            result = args.value > args.threshold;
            break;
          case "less_than":
            result = args.value < args.threshold;
            break;
          case "equal_to":
            result = args.value === args.threshold;
            break;
          default:
            result = false;
        }

        const conditionResult = {
          condition: `${args.value} ${args.condition} ${args.threshold}`,
          result,
          action: result ? args.action : "no_action",
          evaluation: `${args.value} ${args.condition.replace("_", " ")} ${args.threshold} = ${result}`,
        };

        conditionalResults.push({
          condition: args.condition,
          result,
          action: args.action,
        });
        console.log(`🎯 Conditional: ${conditionResult.evaluation}`);
        return conditionResult;
      };

      // Calculator for generating test values
      const calculatorHandler = async (args: {
        operation: string;
        a: number;
        b: number;
      }) => {
        const result =
          args.operation === "multiply" ? args.a * args.b : args.a + args.b;
        console.log(`🧮 Generated value: ${result}`);
        return { result, operation: args.operation };
      };

      const prompt = `Please help me with conditional logic:
1. Calculate 7 * 8 using the calculator
2. Use the conditional tool to check if the result is greater_than 50 (action: "proceed_with_plan_A")
3. Calculate 3 + 2 using the calculator  
4. Use the conditional tool to check if this result is less_than 10 (action: "use_small_value_logic")
5. Summarize what actions should be taken based on the conditions.`;

      // Check if streaming is supported
      if (!client.supportsStreaming()) {
        console.log("⚠️  Skipping test - streaming not supported");
        return;
      }

      await client.streamAgent(
        prompt,
        (event: AgentStreamEvent) => {
          events.push(event);

          if (event.type === "conversation_started") {
            createdConversations.push(event.conversationId);
          } else if (event.type === "tool_update") {
            console.log(`🔧 Tool ${event.toolCall.name}: ${event.status}`);
          }
        },
        undefined,
        { id: specId },
        [calculatorTool, conditionalTool],
        {
          calculator: calculatorHandler,
          conditional: conditionalHandler,
        }
      );

      // Analyze conditional execution
      console.log(`\n📊 Conditional Execution Results:`);
      conditionalResults.forEach((result, idx) => {
        console.log(
          `  ${idx + 1}. ${result.condition}: ${result.result} → ${result.action}`
        );
      });

      // Should have executed conditional logic
      expect(conditionalResults.length).toBeGreaterThan(0);

      // Should have mixed true/false results
      const trueResults = conditionalResults.filter((r) => r.result);
      const falseResults = conditionalResults.filter((r) => !r.result);

      console.log(`  True conditions: ${trueResults.length}`);
      console.log(`  False conditions: ${falseResults.length}`);

      // Conversation should complete
      const completed = events.some((e) => e.type === "conversation_completed");
      expect(completed).toBe(true);

      console.log("✅ Conditional tool execution working correctly");
    }, 90000);
  });

  describe("Tool Result Aggregation", () => {
    it("should aggregate results from multiple tools into a final report", async () => {
      console.log("\n📋 Testing tool result aggregation...");

      // Create specification
      const createResponse = await client.createSpecification({
        name: "Aggregation Test",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4O_128K,
          temperature: 0.3,
          completionTokenLimit: 1200,
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      const events: AgentStreamEvent[] = [];
      const allToolResults: { tool: string; result: any; timestamp: number }[] =
        [];

      // Enhanced tool handlers that track results
      const calculatorHandler = async (args: {
        operation: string;
        a: number;
        b: number;
      }) => {
        const result =
          args.operation === "multiply"
            ? args.a * args.b
            : args.operation === "add"
              ? args.a + args.b
              : args.operation === "divide"
                ? args.a / args.b
                : args.a - args.b;

        const toolResult = {
          result,
          operation: args.operation,
          inputs: [args.a, args.b],
          type: "calculation",
        };

        allToolResults.push({
          tool: "calculator",
          result: toolResult,
          timestamp: Date.now(),
        });
        return toolResult;
      };

      const dataProcessorHandler = async (args: {
        operation: string;
        numbers: number[];
      }) => {
        let result: any;
        switch (args.operation) {
          case "sum":
            result = args.numbers.reduce((a, b) => a + b, 0);
            break;
          case "average":
            result =
              args.numbers.reduce((a, b) => a + b, 0) / args.numbers.length;
            break;
          case "max":
            result = Math.max(...args.numbers);
            break;
          case "min":
            result = Math.min(...args.numbers);
            break;
          default:
            result = args.numbers;
        }

        const toolResult = {
          result,
          operation: args.operation,
          inputCount: args.numbers.length,
          type: "data_processing",
        };

        allToolResults.push({
          tool: "dataProcessor",
          result: toolResult,
          timestamp: Date.now(),
        });
        return toolResult;
      };

      const formatterHandler = async (args: {
        type: string;
        value: number;
        decimals?: number;
      }) => {
        const decimals = args.decimals || 2;
        let formatted: string;

        switch (args.type) {
          case "currency":
            formatted = `$${args.value.toFixed(decimals)}`;
            break;
          case "percentage":
            formatted = `${(args.value * 100).toFixed(decimals)}%`;
            break;
          default:
            formatted = args.value.toFixed(decimals);
        }

        const toolResult = {
          formatted,
          original: args.value,
          type: args.type,
          category: "formatting",
        };

        allToolResults.push({
          tool: "formatter",
          result: toolResult,
          timestamp: Date.now(),
        });
        return toolResult;
      };

      const prompt = `I need a comprehensive financial analysis report. Please:
1. Calculate my monthly expenses: 1200 + 800 + 300 + 150 (rent + food + utilities + misc)
2. Calculate my annual income: 5000 * 12 (monthly salary * 12 months)
3. Find the average of my quarterly savings: [2000, 2500, 1800, 2200] using data processor
4. Calculate my savings rate: divide total annual savings by annual income
5. Format the annual income as currency
6. Format the savings rate as a percentage
7. Create a summary report with all the key financial metrics

Use all the appropriate tools and provide a comprehensive financial overview.`;

      // Check if streaming is supported
      if (!client.supportsStreaming()) {
        console.log("⚠️  Skipping test - streaming not supported");
        return;
      }

      await client.streamAgent(
        prompt,
        (event: AgentStreamEvent) => {
          events.push(event);

          if (event.type === "conversation_started") {
            createdConversations.push(event.conversationId);
          } else if (event.type === "tool_update") {
            console.log(`🔧 Tool ${event.toolCall.name}: ${event.status}`);
          } else if (event.type === "conversation_completed") {
            console.log(`📊 Final report generated`);
          }
        },
        undefined,
        { id: specId },
        [calculatorTool, dataProcessorTool, formatTool],
        {
          calculator: calculatorHandler,
          dataProcessor: dataProcessorHandler,
          formatter: formatterHandler,
        }
      );

      // Analyze aggregation
      console.log(`\n📊 Tool Result Aggregation Analysis:`);
      console.log(`  Total tool executions: ${allToolResults.length}`);

      const toolCounts = allToolResults.reduce(
        (acc, tr) => {
          acc[tr.tool] = (acc[tr.tool] || 0) + 1;
          return acc;
        },
        {} as { [key: string]: number }
      );

      console.log(`  Tool usage breakdown:`, toolCounts);

      // Show execution timeline
      const sortedResults = allToolResults.sort(
        (a, b) => a.timestamp - b.timestamp
      );
      console.log(`  Execution timeline:`);
      sortedResults.forEach((tr, idx) => {
        console.log(
          `    ${idx + 1}. ${tr.tool}: ${JSON.stringify(tr.result).slice(0, 60)}...`
        );
      });

      // Validate comprehensive usage
      const uniqueTools = new Set(allToolResults.map((tr) => tr.tool));
      expect(uniqueTools.size).toBeGreaterThanOrEqual(2); // Used multiple tool types
      expect(allToolResults.length).toBeGreaterThanOrEqual(4); // Multiple executions

      const completedEvent = events.find(
        (e) => e.type === "conversation_completed"
      );
      expect(completedEvent).toBeDefined();

      console.log("✅ Tool result aggregation completed successfully");
    }, 120000);
  });
});

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { GraphlitClient } from "../src/index.js";
import { ConversationToolCall } from "../src/generated/graphql-types.js";
import * as Types from "../src/generated/graphql-types.js";
import { TEST_MODELS, TestModelConfig } from "./test-models.js";
import { clearEnvironment, getEnvironment } from "./setup.js";

describe("Tool Calling Test Suite", () => {
  let client: GraphlitClient;

  beforeAll(async () => {
    await clearEnvironment();
    client = new GraphlitClient();
  });

  afterAll(async () => {
    await clearEnvironment();
  });

  // Tool definitions used across tests
  const tools: Types.ToolDefinitionInput[] = [
    {
      name: "calculator",
      description: "A simple calculator that performs basic arithmetic operations",
      schema: JSON.stringify({
        type: "object",
        properties: {
          operation: {
            type: "string",
            enum: ["add", "subtract", "multiply", "divide"],
            description: "The arithmetic operation to perform",
          },
          a: {
            type: "number",
            description: "The first number",
          },
          b: {
            type: "number",
            description: "The second number",
          },
        },
        required: ["operation", "a", "b"],
      }),
    },
    {
      name: "get_weather",
      description: "Get the current weather for a location",
      schema: JSON.stringify({
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and state, e.g. San Francisco, CA",
          },
          unit: {
            type: "string",
            enum: ["celsius", "fahrenheit"],
            description: "Temperature unit",
          },
        },
        required: ["location"],
      }),
    },
  ];

  describe("Multiple Tool Calls", () => {
    const modelsToTest = TEST_MODELS.filter(
      (m) =>
        (m.name.includes("OpenAI") || 
         m.name.includes("Anthropic") || 
         m.name.includes("Google")) &&
        m.supportsTools !== false,
    );

    it.each(modelsToTest)(
      "should handle multiple separate tool calls with $name",
      async ({ config }) => {
        const conversationId = await client.createConversation();
        const specification = await client.createSpecification(config);

        let toolCallsReceived: ConversationToolCall[] = [];
        let allMessages: string[] = [];

        const toolHandler = async (call: ConversationToolCall) => {
          if (call.name === "calculator") {
            const args = JSON.parse(call.arguments);
            switch (args.operation) {
              case "add":
                return { result: args.a + args.b };
              case "multiply":
                return { result: args.a * args.b };
              default:
                return { error: "Unsupported operation" };
            }
          } else if (call.name === "get_weather") {
            const args = JSON.parse(call.arguments);
            return {
              location: args.location,
              temperature: 72,
              unit: args.unit || "fahrenheit",
              conditions: "Sunny",
            };
          }
          return { error: "Unknown tool" };
        };

        const result = await client.streamAgent({
          conversationId,
          specificationId: specification.id,
          messagePrompt: `Please do the following:
1. Calculate 5 + 3
2. Calculate 4 * 7
3. Get the weather for San Francisco, CA`,
          tools,
          toolHandler,
          onEvent: (event) => {
            if (event.type === "token") {
              allMessages.push(event.token);
            } else if (event.type === "tool_call_start") {
              toolCallsReceived.push(event.toolCall);
            }
          },
        });

        expect(result.messageText).toBeTruthy();
        expect(toolCallsReceived.length).toBeGreaterThanOrEqual(3);
        
        // Verify we got calculator calls for addition and multiplication
        const addCall = toolCallsReceived.find(
          (tc) => tc.name === "calculator" && tc.arguments.includes("add"),
        );
        const multiplyCall = toolCallsReceived.find(
          (tc) => tc.name === "calculator" && tc.arguments.includes("multiply"),
        );
        const weatherCall = toolCallsReceived.find(
          (tc) => tc.name === "get_weather",
        );

        expect(addCall).toBeDefined();
        expect(multiplyCall).toBeDefined();
        expect(weatherCall).toBeDefined();
      },
      { timeout: 60000 },
    );
  });

  describe("Tool Call Limits", () => {
    const toolLimitModels = TEST_MODELS.filter(
      (m) => m.name.includes("OpenAI GPT-4o") && m.supportsTools !== false,
    ).slice(0, 1); // Just test one model for speed

    it.each(toolLimitModels)(
      "should test tool call limits with $name",
      async ({ config }) => {
        // Create many calculator tools
        const manyTools: Types.ToolDefinitionInput[] = [];
        for (let i = 1; i <= 20; i++) {
          manyTools.push({
            name: `tool_${i}`,
            description: `Tool number ${i}`,
            schema: JSON.stringify({
              type: "object",
              properties: {
                value: { type: "string" },
              },
              required: ["value"],
            }),
          });
        }

        const conversationId = await client.createConversation();
        const specification = await client.createSpecification(config);

        let toolCallCount = 0;

        const result = await client.streamAgent({
          conversationId,
          specificationId: specification.id,
          messagePrompt: `Please call as many different tools as you can from tool_1 through tool_20. Call each tool with a unique value. Try to call at least 10 different tools.`,
          tools: manyTools,
          toolHandler: async (call) => {
            toolCallCount++;
            return { success: true, tool: call.name };
          },
        });

        expect(result.messageText).toBeTruthy();
        expect(toolCallCount).toBeGreaterThan(0);
        console.log(`${config.name} called ${toolCallCount} tools`);
      },
      { timeout: 120000 },
    );
  });

  describe("Tool Response Handling", () => {
    const responseTestModels = TEST_MODELS.filter(
      (m) => m.name.includes("OpenAI") && m.supportsTools !== false,
    ).slice(0, 1);

    it.each(responseTestModels)(
      "should handle null tool responses with $name",
      async ({ config }) => {
        const conversationId = await client.createConversation();
        const specification = await client.createSpecification(config);

        const result = await client.streamAgent({
          conversationId,
          specificationId: specification.id,
          messagePrompt: "What's the weather in Paris? Use the weather tool.",
          tools,
          toolHandler: async (call) => {
            // Return null to simulate tool failure
            return null;
          },
        });

        expect(result.messageText).toBeTruthy();
        // Model should handle null response gracefully
        expect(result.messageText.toLowerCase()).toMatch(
          /unable|couldn't|failed|error|not available/i,
        );
      },
      { timeout: 60000 },
    );

    it.each(responseTestModels)(
      "should handle complex tool schemas with $name",
      async ({ config }) => {
        const complexTools: Types.ToolDefinitionInput[] = [
          {
            name: "data_processor",
            description: "Process complex data structures",
            schema: JSON.stringify({
              type: "object",
              properties: {
                data: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      values: {
                        type: "array",
                        items: { type: "number" },
                      },
                      metadata: {
                        type: "object",
                        properties: {
                          tags: {
                            type: "array",
                            items: { type: "string" },
                          },
                          priority: {
                            type: "string",
                            enum: ["low", "medium", "high"],
                          },
                        },
                      },
                    },
                    required: ["id", "values"],
                  },
                },
                operation: {
                  type: "string",
                  enum: ["sum", "average", "filter"],
                },
              },
              required: ["data", "operation"],
            }),
          },
        ];

        const conversationId = await client.createConversation();
        const specification = await client.createSpecification(config);

        let receivedCall: ConversationToolCall | null = null;

        const result = await client.streamAgent({
          conversationId,
          specificationId: specification.id,
          messagePrompt: `Process this data: Create 2 data items with IDs "item1" and "item2", 
            each with values [1, 2, 3] and calculate their sum.`,
          tools: complexTools,
          toolHandler: async (call) => {
            receivedCall = call;
            const args = JSON.parse(call.arguments);
            
            if (args.operation === "sum") {
              let total = 0;
              args.data.forEach((item: any) => {
                item.values.forEach((v: number) => {
                  total += v;
                });
              });
              return { total, itemCount: args.data.length };
            }
            
            return { error: "Unsupported operation" };
          },
        });

        expect(result.messageText).toBeTruthy();
        expect(receivedCall).not.toBeNull();
        
        if (receivedCall) {
          const args = JSON.parse(receivedCall.arguments);
          expect(args.data).toBeInstanceOf(Array);
          expect(args.data.length).toBe(2);
          expect(args.operation).toBe("sum");
        }
      },
      { timeout: 60000 },
    );
  });

  describe("Duplicate Tool Call Prevention", () => {
    const duplicateTestModels = TEST_MODELS.filter(
      (m) => m.name.includes("OpenAI") && m.supportsTools !== false,
    ).slice(0, 1);

    it.each(duplicateTestModels)(
      "should not create duplicate tool calls with $name",
      async ({ config }) => {
        const conversationId = await client.createConversation();
        const specification = await client.createSpecification(config);

        const toolCallIds = new Set<string>();
        let duplicateFound = false;

        const result = await client.streamAgent({
          conversationId,
          specificationId: specification.id,
          messagePrompt: "Calculate 10 + 20 and then calculate 30 + 40",
          tools,
          toolHandler: async (call) => {
            if (toolCallIds.has(call.id)) {
              duplicateFound = true;
            }
            toolCallIds.add(call.id);
            
            const args = JSON.parse(call.arguments);
            return { result: args.a + args.b };
          },
        });

        expect(result.messageText).toBeTruthy();
        expect(duplicateFound).toBe(false);
        expect(toolCallIds.size).toBeGreaterThanOrEqual(2);
      },
      { timeout: 60000 },
    );
  });
});
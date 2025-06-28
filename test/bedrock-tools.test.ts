import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import { AgentStreamEvent } from "../src/types/ui-events";

/**
 * Test specifically for Bedrock tool calling functionality
 */
describe("Bedrock Tool Calling", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;

  if (!orgId || !envId || !secret) {
    console.warn("⚠️  Skipping Bedrock tests - missing Graphlit credentials");
    return;
  }

  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.warn("⚠️  Skipping Bedrock tests - missing AWS credentials");
    return;
  }

  let client: Graphlit;
  const createdSpecIds: string[] = [];

  beforeAll(async () => {
    client = new Graphlit(orgId, envId, secret);

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
      }),
    );
  });

  afterAll(async () => {
    // Clean up any specs that might have been created but not deleted
    for (const specId of createdSpecIds) {
      try {
        await client.deleteSpecification(specId);
        console.log(`✅ Cleaned up specification: ${specId}`);
      } catch (error) {
        // Ignore errors - spec might already be deleted
      }
    }
  });

  // Define all Bedrock models to test
  const bedrockModels = [
    { model: Types.BedrockModels.Claude_3_7Sonnet, name: "Claude 3.7 Sonnet" },
    { model: Types.BedrockModels.NovaPremier, name: "Nova Premier" },
    { model: Types.BedrockModels.NovaPro, name: "Nova Pro" },
    {
      model: Types.BedrockModels.Llama_4Maverick_17B,
      name: "Llama 4 Maverick 17B",
    },
    { model: Types.BedrockModels.Llama_4Scout_17B, name: "Llama 4 Scout 17B" },
  ];

  // Test each model
  bedrockModels.forEach(({ model, name }) => {
    it(`should handle tool calls with Bedrock ${name}`, async () => {
      console.log(`\n🚀 Testing Bedrock ${name}`);

      // Enable debug logging for this test
      process.env.DEBUG_GRAPHLIT_SDK_STREAMING = "true";

      let spec;
      try {
        spec = await client.createSpecification({
          name: `Bedrock ${name} Tool Test`,
          type: Types.SpecificationTypes.Completion,
          serviceType: Types.ModelServiceTypes.Bedrock,
          bedrock: {
            model: model,
            temperature: 0.7,
          },
        });
      } catch (error: any) {
        console.warn(
          `⚠️  Skipping ${name} - model not available: ${error.message}`,
        );
        return;
      }

      expect(spec.createSpecification?.id).toBeDefined();
      createdSpecIds.push(spec.createSpecification.id);

      const tools: Types.ToolDefinitionInput[] = [
        {
          name: "Weather",
          description: "Get current weather for a location",
          schema: JSON.stringify({
            type: "object",
            properties: {
              location: { type: "string", description: "City name" },
            },
            required: ["location"],
          }),
        },
      ];

      const toolHandlers = {
        Weather: async (args: any) => {
          console.log(`🔧 [${name}] Weather tool called with:`, args);
          return {
            location: args.location,
            temperature: 72,
            condition: "Sunny",
          };
        },
      };

      let toolCallCount = 0;
      let errorCount = 0;
      let toolArguments = "";
      let conversationId: string | undefined;
      let streamCompleted = false;

      try {
        await client.streamAgent(
          "What's the weather in Tokyo?",
          (event: AgentStreamEvent) => {
            switch (event.type) {
              case "conversation_started":
                conversationId = event.conversationId;
                console.log(
                  `📝 [${name}] Conversation started: ${conversationId}`,
                );
                break;
              case "tool_update":
                console.log(
                  `🔧 [${name}] Tool update: ${event.toolCall.name} - ${event.status}`,
                );
                if (event.status === "completed") {
                  toolCallCount++;
                  // Capture the arguments that were sent to the tool
                  if (event.toolCall.arguments) {
                    toolArguments = event.toolCall.arguments;
                    console.log(
                      `📝 [${name}] Tool arguments: ${toolArguments}`,
                    );
                  }
                }
                break;
              case "error":
                console.error(`❌ [${name}] Error: ${event.error.message}`);
                errorCount++;
                break;
              case "conversation_completed":
                streamCompleted = true;
                console.log(`✅ [${name}] Stream completed`);
                break;
            }
          },
          undefined,
          { id: spec.createSpecification.id },
          tools,
          toolHandlers,
        );

        // Cleanup - delete conversation first, then specification
        if (conversationId) {
          try {
            await client.deleteConversation(conversationId);
            console.log(`🗑️ [${name}] Deleted conversation: ${conversationId}`);
          } catch (e) {
            console.log(
              `⚠️ [${name}] Failed to delete conversation: ${conversationId}`,
            );
          }
        }

        // Remove from tracking array before deleting
        const specIndex = createdSpecIds.indexOf(spec.createSpecification.id);
        if (specIndex > -1) {
          createdSpecIds.splice(specIndex, 1);
        }

        try {
          await client.deleteSpecification(spec.createSpecification.id);
          console.log(
            `🗑️ [${name}] Deleted specification: ${spec.createSpecification.id}`,
          );
        } catch (e) {
          console.log(
            `⚠️ [${name}] Failed to delete specification: ${spec.createSpecification.id}`,
          );
        }

        // Verify the test results
        expect(streamCompleted).toBe(true);
        expect(errorCount).toBe(0);

        // Llama models don't support tools - we filter them out
        if (
          model === Types.BedrockModels.Llama_4Maverick_17B ||
          model === Types.BedrockModels.Llama_4Scout_17B
        ) {
          expect(toolCallCount).toBe(0);
          console.log(
            `✅ Bedrock ${name} completed without tools (as expected - tools filtered out)`,
          );
        } else {
          expect(toolCallCount).toBeGreaterThan(0);
          expect(toolArguments).toBeTruthy();
          expect(toolArguments).toContain("Tokyo");
          console.log(
            `✅ Bedrock ${name} successfully called ${toolCallCount} tool(s)`,
          );
        }
      } catch (error: any) {
        // Clean up on error (but check if not already cleaned up)
        if (conversationId) {
          try {
            await client.deleteConversation(conversationId);
            console.log(
              `🗑️ [${name}] Deleted conversation on error: ${conversationId}`,
            );
          } catch (e) {
            // Ignore cleanup errors
          }
        }

        // Only delete spec if it's still in the tracking array
        const specIndex = createdSpecIds.indexOf(spec.createSpecification.id);
        if (specIndex > -1) {
          createdSpecIds.splice(specIndex, 1);
          try {
            await client.deleteSpecification(spec.createSpecification.id);
            console.log(
              `🗑️ [${name}] Deleted specification on error: ${spec.createSpecification.id}`,
            );
          } catch (e) {
            // Ignore cleanup errors
          }
        }

        // Check if it's a model availability issue
        if (
          error.message?.includes("not available") ||
          error.message?.includes("not found")
        ) {
          console.warn(`⚠️  Skipping ${name} - model not available in region`);
          return;
        }

        throw error;
      }
    }, 60000);
  });

  // Additional test for multiple tool types
  it("should handle multiple tool types with Bedrock Claude", async () => {
    console.log("\n🚀 Testing multiple tools with Bedrock Claude");

    const spec = await client.createSpecification({
      name: "Bedrock Claude Multi-Tool Test",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.Bedrock,
      bedrock: {
        model: Types.BedrockModels.Claude_3_7Sonnet,
        temperature: 0.7,
      },
    });

    expect(spec.createSpecification?.id).toBeDefined();
    createdSpecIds.push(spec.createSpecification.id);

    const tools: Types.ToolDefinitionInput[] = [
      {
        name: "Calculator",
        description: "Perform mathematical calculations",
        schema: JSON.stringify({
          type: "object",
          properties: {
            expression: {
              type: "string",
              description: "Mathematical expression to evaluate",
            },
          },
          required: ["expression"],
        }),
      },
      {
        name: "UnitConverter",
        description: "Convert units of measurement",
        schema: JSON.stringify({
          type: "object",
          properties: {
            value: { type: "number", description: "Value to convert" },
            fromUnit: { type: "string", description: "Unit to convert from" },
            toUnit: { type: "string", description: "Unit to convert to" },
          },
          required: ["value", "fromUnit", "toUnit"],
        }),
      },
    ];

    const toolCalls: any[] = [];
    const toolHandlers = {
      Calculator: async (args: any) => {
        console.log("🧮 Calculator called with:", args);
        toolCalls.push({ tool: "Calculator", args });
        // Simple eval for demo purposes (not production safe!)
        try {
          const result = eval(args.expression.replace(/[^0-9+\-*/().\s]/g, ""));
          return { result };
        } catch (e) {
          return { error: "Invalid expression" };
        }
      },
      UnitConverter: async (args: any) => {
        console.log("📏 UnitConverter called with:", args);
        toolCalls.push({ tool: "UnitConverter", args });
        // Simple conversion for demo
        if (args.fromUnit === "celsius" && args.toUnit === "fahrenheit") {
          return { result: (args.value * 9) / 5 + 32 };
        }
        return { error: "Conversion not supported" };
      },
    };

    let conversationId: string | undefined;

    await client.streamAgent(
      "What is 25 degrees Celsius in Fahrenheit? Also, what is 15 + 27?",
      (event: AgentStreamEvent) => {
        if (event.type === "conversation_started") {
          conversationId = event.conversationId;
        }
      },
      undefined,
      { id: spec.createSpecification.id },
      tools,
      toolHandlers,
    );

    // Cleanup
    if (conversationId) {
      try {
        await client.deleteConversation(conversationId);
        console.log(
          `🗑️ Deleted multi-tool test conversation: ${conversationId}`,
        );
      } catch (e) {
        console.log(
          `⚠️ Failed to delete multi-tool test conversation: ${conversationId}`,
        );
      }
    }

    // Remove from tracking array before deleting
    const specIndex = createdSpecIds.indexOf(spec.createSpecification.id);
    if (specIndex > -1) {
      createdSpecIds.splice(specIndex, 1);
    }

    try {
      await client.deleteSpecification(spec.createSpecification.id);
      console.log(
        `🗑️ Deleted multi-tool test specification: ${spec.createSpecification.id}`,
      );
    } catch (e) {
      console.log(
        `⚠️ Failed to delete multi-tool test specification: ${spec.createSpecification.id}`,
      );
    }

    // Should have called both tools
    expect(toolCalls.length).toBeGreaterThanOrEqual(2);
    expect(toolCalls.some((call) => call.tool === "Calculator")).toBe(true);
    expect(toolCalls.some((call) => call.tool === "UnitConverter")).toBe(true);

    console.log("✅ Claude successfully handled multiple tool types");
  }, 60000);
});

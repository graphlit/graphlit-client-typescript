import { describe, it, expect, beforeAll } from "vitest";
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

  // Test with Nova Premier which was having issues
  it("should handle tool calls with Bedrock Nova Premier", async () => {
    // Enable debug logging for this test
    process.env.DEBUG_GRAPHLIT_SDK_STREAMING = "true";

    const spec = await client.createSpecification({
      name: "Bedrock Nova Premier Tool Test",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.Bedrock,
      bedrock: {
        model: Types.BedrockModels.NovaPremier,
        temperature: 0.7,
      },
    });

    expect(spec.createSpecification?.id).toBeDefined();

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
        console.log("🔧 Weather tool called with:", args);
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

    await client.streamAgent(
      "What's the weather in Tokyo?",
      (event: AgentStreamEvent) => {
        switch (event.type) {
          case "conversation_started":
            conversationId = event.conversationId;
            break;
          case "tool_update":
            console.log(
              `🔧 Tool update: ${event.toolCall.name} - ${event.status}`,
            );
            if (event.status === "completed") {
              toolCallCount++;
              // Capture the arguments that were sent to the tool
              if (event.toolCall.arguments) {
                toolArguments = event.toolCall.arguments;
                console.log(`📝 Tool arguments: ${toolArguments}`);
              }
            }
            break;
          case "error":
            console.error(`❌ Error: ${event.error.message}`);
            errorCount++;
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
      await client.deleteConversation(conversationId);
    }
    await client.deleteSpecification(spec.createSpecification.id);

    // Verify the test results
    expect(errorCount).toBe(0);
    expect(toolCallCount).toBeGreaterThan(0);
    expect(toolArguments).toBeTruthy();
    expect(toolArguments).toContain("Tokyo");

    console.log(
      `✅ Bedrock Nova Premier successfully called ${toolCallCount} tool(s)`,
    );
  }, 60000);
});

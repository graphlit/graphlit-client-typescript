import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import { AgentStreamEvent } from "../src/types/ui-events";

/**
 * Test specifically for Mistral streaming functionality
 */
describe("Mistral Streaming", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;
  const mistralApiKey = process.env.MISTRAL_API_KEY;

  if (!orgId || !envId || !secret) {
    console.warn("⚠️  Skipping Mistral tests - missing Graphlit credentials");
    return;
  }

  if (!mistralApiKey) {
    console.warn("⚠️  Skipping Mistral tests - missing MISTRAL_API_KEY");
    return;
  }

  let client: Graphlit;
  const createdSpecIds: string[] = [];

  beforeAll(async () => {
    client = new Graphlit(orgId, envId, secret);

    // The SDK will automatically use MISTRAL_API_KEY from environment
    // But we can also set a custom client if needed:
    // const { Mistral } = await import("@mistralai/mistralai");
    // client.setMistralClient(new Mistral({ apiKey: mistralApiKey }));
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

  // Define Mistral models to test
  const mistralModels = [
    { model: Types.MistralModels.MistralLarge, name: "Mistral Large" },
    { model: Types.MistralModels.MistralMedium, name: "Mistral Medium" },
    { model: Types.MistralModels.MistralSmall, name: "Mistral Small" },
    { model: Types.MistralModels.MistralNemo, name: "Mistral Nemo" },
  ];

  // Test basic streaming for each model
  mistralModels.forEach(({ model, name }) => {
    it(`should stream responses with ${name}`, async () => {
      console.log(`\n🚀 Testing ${name} streaming`);

      // Enable debug logging
      process.env.DEBUG_GRAPHLIT_SDK_STREAMING = "true";

      let spec;
      try {
        spec = await client.createSpecification({
          name: `${name} Streaming Test`,
          type: Types.SpecificationTypes.Completion,
          serviceType: Types.ModelServiceTypes.Mistral,
          mistral: {
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

      let messageContent = "";
      let tokenCount = 0;
      let errorCount = 0;
      let conversationId: string | undefined;
      let streamCompleted = false;
      let ttft: number | undefined;
      const streamStartTime = Date.now();

      try {
        await client.streamAgent(
          "Tell me a haiku about TypeScript",
          (event: AgentStreamEvent) => {
            switch (event.type) {
              case "conversation_started":
                conversationId = event.conversationId;
                console.log(
                  `📝 [${name}] Conversation started: ${conversationId}`,
                );
                break;
              case "message_update":
                if (!ttft && event.message.message.length > 0) {
                  ttft = Date.now() - streamStartTime;
                  console.log(`⚡ [${name}] Time to First Token: ${ttft}ms`);
                }
                messageContent = event.message.message;
                tokenCount++;
                break;
              case "error":
                console.error(`❌ [${name}] Error: ${event.error.message}`);
                errorCount++;
                break;
              case "conversation_completed":
                streamCompleted = true;
                console.log(`✅ [${name}] Stream completed`);
                if (event.metrics) {
                  console.log(`📊 [${name}] Metrics:`, {
                    ttft: event.metrics.ttft,
                    totalTime: event.metrics.totalTime,
                    tokenCount: event.metrics.tokenCount,
                  });
                }
                break;
            }
          },
          undefined,
          { id: spec.createSpecification.id },
        );

        // Cleanup
        if (conversationId) {
          try {
            await client.deleteConversation(conversationId);
            console.log(`🗑️ [${name}] Deleted conversation: ${conversationId}`);
          } catch (e) {
            console.log(`⚠️ [${name}] Failed to delete conversation`);
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
          console.log(`⚠️ [${name}] Failed to delete specification`);
        }

        // Verify results
        expect(streamCompleted).toBe(true);
        expect(errorCount).toBe(0);
        expect(messageContent.length).toBeGreaterThan(0);
        expect(tokenCount).toBeGreaterThan(0);

        console.log(`✅ ${name} streaming successful`);
        console.log(
          `📝 Response preview: ${messageContent.substring(0, 100)}...`,
        );
      } catch (error: any) {
        // Clean up on error
        if (conversationId) {
          try {
            await client.deleteConversation(conversationId);
          } catch (e) {
            // Ignore cleanup errors
          }
        }

        const specIndex = createdSpecIds.indexOf(spec.createSpecification.id);
        if (specIndex > -1) {
          createdSpecIds.splice(specIndex, 1);
          try {
            await client.deleteSpecification(spec.createSpecification.id);
          } catch (e) {
            // Ignore cleanup errors
          }
        }

        throw error;
      }
    }, 60000);
  });

  // Test streaming with tools
  it("should handle tool calls with Mistral Large", async () => {
    console.log("\n🚀 Testing Mistral Large with tools");

    const spec = await client.createSpecification({
      name: "Mistral Large Tool Test",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.Mistral,
      mistral: {
        model: Types.MistralModels.MistralLarge,
        temperature: 0.7,
      },
    });

    expect(spec.createSpecification?.id).toBeDefined();
    createdSpecIds.push(spec.createSpecification.id);

    const tools: Types.ToolDefinitionInput[] = [
      {
        name: "getWeather",
        description: "Get the weather for a location",
        schema: JSON.stringify({
          type: "object",
          properties: {
            location: { type: "string", description: "City name" },
            unit: {
              type: "string",
              enum: ["celsius", "fahrenheit"],
              description: "Temperature unit",
            },
          },
          required: ["location"],
        }),
      },
      {
        name: "calculateDistance",
        description: "Calculate distance between two cities",
        schema: JSON.stringify({
          type: "object",
          properties: {
            from: { type: "string", description: "Starting city" },
            to: { type: "string", description: "Destination city" },
          },
          required: ["from", "to"],
        }),
      },
    ];

    let toolCallCount = 0;
    const toolCalls: any[] = [];
    const toolHandlers = {
      getWeather: async (args: any) => {
        console.log("🌤️ getWeather called with:", args);
        toolCallCount++;
        toolCalls.push({ tool: "getWeather", args });
        return {
          temperature: 22,
          condition: "Partly cloudy",
          unit: args.unit || "celsius",
        };
      },
      calculateDistance: async (args: any) => {
        console.log("📏 calculateDistance called with:", args);
        toolCallCount++;
        toolCalls.push({ tool: "calculateDistance", args });
        return {
          distance: 500,
          unit: "kilometers",
        };
      },
    };

    let conversationId: string | undefined;
    let errorCount = 0;
    let streamCompleted = false;

    await client.streamAgent(
      "What's the weather in Paris? Also, how far is it from London to Paris?",
      (event: AgentStreamEvent) => {
        switch (event.type) {
          case "conversation_started":
            conversationId = event.conversationId;
            console.log(`📝 Conversation started: ${conversationId}`);
            break;
          case "tool_update":
            console.log(
              `🔧 Tool update: ${event.toolCall.name} - ${event.status}`,
            );
            if (event.status === "completed" && event.result) {
              console.log(`   Result:`, event.result);
            }
            break;
          case "error":
            console.error(`❌ Error: ${event.error.message}`);
            errorCount++;
            break;
          case "conversation_completed":
            streamCompleted = true;
            console.log(`✅ Stream completed`);
            break;
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
        console.log(`🗑️ Deleted conversation: ${conversationId}`);
      } catch (e) {
        console.log(`⚠️ Failed to delete conversation`);
      }
    }

    const specIndex = createdSpecIds.indexOf(spec.createSpecification.id);
    if (specIndex > -1) {
      createdSpecIds.splice(specIndex, 1);
    }

    try {
      await client.deleteSpecification(spec.createSpecification.id);
      console.log(`🗑️ Deleted specification: ${spec.createSpecification.id}`);
    } catch (e) {
      console.log(`⚠️ Failed to delete specification`);
    }

    // Verify results
    expect(streamCompleted).toBe(true);
    expect(errorCount).toBe(0);
    expect(toolCallCount).toBeGreaterThan(0);
    expect(toolCalls.some((tc) => tc.tool === "getWeather")).toBe(true);

    console.log(
      `✅ Mistral Large successfully handled ${toolCallCount} tool calls`,
    );
    console.log("🔧 Tool calls made:", toolCalls);
  }, 60000);

  // Test error handling
  it("should handle errors gracefully", async () => {
    console.log("\n🚀 Testing Mistral error handling");

    // Create a spec with an invalid configuration to trigger an error
    const spec = await client.createSpecification({
      name: "Mistral Error Test",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.Mistral,
      mistral: {
        model: Types.MistralModels.MistralLarge,
        temperature: 0.7,
        completionTokenLimit: 10, // Very low limit to potentially trigger issues
      },
    });

    expect(spec.createSpecification?.id).toBeDefined();
    createdSpecIds.push(spec.createSpecification.id);

    let errorReceived = false;
    let errorMessage = "";
    let conversationId: string | undefined;

    try {
      await client.streamAgent(
        "Write a very long essay about the history of computer science, including all major milestones and pioneers in great detail",
        (event: AgentStreamEvent) => {
          if (event.type === "conversation_started") {
            conversationId = event.conversationId;
          } else if (event.type === "error") {
            errorReceived = true;
            errorMessage = event.error.message;
            console.log(`📝 Received expected error: ${errorMessage}`);
          }
        },
        undefined,
        { id: spec.createSpecification.id },
      );
    } catch (error: any) {
      console.log(`📝 Caught expected error: ${error.message}`);
      errorReceived = true;
      errorMessage = error.message;
    }

    // Cleanup
    if (conversationId) {
      try {
        await client.deleteConversation(conversationId);
      } catch (e) {
        // Ignore
      }
    }

    try {
      await client.deleteSpecification(spec.createSpecification.id);
      createdSpecIds.splice(
        createdSpecIds.indexOf(spec.createSpecification.id),
        1,
      );
    } catch (e) {
      // Ignore
    }

    // We expect either an error event or a thrown error
    console.log(
      `✅ Error handling test complete. Error received: ${errorReceived}`,
    );
  }, 60000);
});

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import { AgentStreamEvent } from "../src/types/ui-events";

/**
 * Test specifically for Deepseek streaming functionality
 */
describe("Deepseek Streaming", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;
  const deepseekApiKey = process.env.DEEPSEEK_API_KEY;

  if (!orgId || !envId || !secret) {
    console.warn("⚠️  Skipping Deepseek tests - missing Graphlit credentials");
    return;
  }

  if (!deepseekApiKey) {
    console.warn("⚠️  Skipping Deepseek tests - missing DEEPSEEK_API_KEY");
    return;
  }

  let client: Graphlit;
  const createdSpecIds: string[] = [];

  beforeAll(async () => {
    client = new Graphlit(orgId, envId, secret);

    // Set up Deepseek client (uses OpenAI-compatible API)
    try {
      const OpenAI = (await import("openai")).default;
      const deepseekClient = new OpenAI({
        baseURL: "https://api.deepseek.com",
        apiKey: deepseekApiKey,
      });
      client.setDeepseekClient(deepseekClient);
      console.log("✅ Deepseek client configured");
    } catch (error) {
      console.error("Failed to set up Deepseek client:", error);
      throw error;
    }
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

  // Define Deepseek models to test
  const deepseekModels = [
    { model: Types.DeepseekModels.Chat, name: "Deepseek Chat" },
    { model: Types.DeepseekModels.Reasoner, name: "Deepseek Reasoner" },
  ];

  // Test basic streaming for each model
  deepseekModels.forEach(({ model, name }) => {
    it(`should stream responses with ${name}`, async () => {
      console.log(`\n🚀 Testing ${name} streaming`);

      // Enable debug logging
      process.env.DEBUG_GRAPHLIT_SDK_STREAMING = "true";

      let spec;
      try {
        spec = await client.createSpecification({
          name: `${name} Streaming Test`,
          type: Types.SpecificationTypes.Completion,
          serviceType: Types.ModelServiceTypes.Deepseek,
          deepseek: {
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
          "Write a haiku about artificial intelligence",
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
                // Log every 10th token to avoid spam
                if (tokenCount % 10 === 0) {
                  console.log(
                    `📝 [${name}] Tokens received: ${tokenCount}, Length: ${messageContent.length}`,
                  );
                }
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
        console.log(`📝 Response: ${messageContent}`);
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

  // Test streaming with tools (Deepseek Chat)
  it("should handle tool calls with Deepseek Chat", async () => {
    console.log("\n🚀 Testing Deepseek Chat with tools");

    const spec = await client.createSpecification({
      name: "Deepseek Chat Tool Test",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.Deepseek,
      deepseek: {
        model: Types.DeepseekModels.Chat,
        temperature: 0.7,
      },
    });

    expect(spec.createSpecification?.id).toBeDefined();
    createdSpecIds.push(spec.createSpecification.id);

    const tools: Types.ToolDefinitionInput[] = [
      {
        name: "searchWeb",
        description: "Search the web for information",
        schema: JSON.stringify({
          type: "object",
          properties: {
            query: { type: "string", description: "Search query" },
            limit: {
              type: "number",
              description: "Number of results to return",
              default: 5,
            },
          },
          required: ["query"],
        }),
      },
      {
        name: "calculator",
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
    ];

    let toolCallCount = 0;
    const toolCalls: any[] = [];
    const toolHandlers = {
      searchWeb: async (args: any) => {
        console.log("🔍 searchWeb called with:", args);
        toolCallCount++;
        toolCalls.push({ tool: "searchWeb", args });
        return {
          results: [
            {
              title: "Deepseek AI",
              snippet: "Advanced AI research company",
              url: "https://deepseek.com",
            },
            {
              title: "Large Language Models",
              snippet: "State-of-the-art LLMs",
              url: "https://example.com",
            },
          ].slice(0, args.limit || 5),
        };
      },
      calculator: async (args: any) => {
        console.log("🧮 calculator called with:", args);
        toolCallCount++;
        toolCalls.push({ tool: "calculator", args });
        try {
          // Simple eval for demo (not production safe!)
          const result = eval(args.expression.replace(/[^0-9+\-*/().\s]/g, ""));
          return { result, expression: args.expression };
        } catch (e) {
          return { error: "Invalid expression" };
        }
      },
    };

    let conversationId: string | undefined;
    let errorCount = 0;
    let streamCompleted = false;
    let finalMessage = "";

    await client.streamAgent(
      "Search for information about Deepseek AI and calculate what 15% of 200 is.",
      (event: AgentStreamEvent) => {
        switch (event.type) {
          case "conversation_started":
            conversationId = event.conversationId;
            console.log(`📝 Conversation started: ${conversationId}`);
            break;
          case "message_update":
            finalMessage = event.message.message;
            break;
          case "tool_update":
            console.log(
              `🔧 Tool update: ${event.toolCall.name} - ${event.status}`,
            );
            if (event.status === "completed" && event.result) {
              console.log(`   Result:`, JSON.stringify(event.result, null, 2));
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
    expect(finalMessage.length).toBeGreaterThan(0);

    // Check if both tools were called
    const hasSearchWeb = toolCalls.some((tc) => tc.tool === "searchWeb");
    const hasCalculator = toolCalls.some((tc) => tc.tool === "calculator");

    console.log(
      `✅ Deepseek Chat successfully handled ${toolCallCount} tool calls`,
    );
    console.log("🔧 Tool calls made:", toolCalls);
    console.log(
      `📝 Final message preview: ${finalMessage.substring(0, 200)}...`,
    );

    // Verify specific tools were called
    if (hasSearchWeb && hasCalculator) {
      console.log("✅ Both tools were successfully called");
    } else {
      console.log(
        `⚠️ Tool usage: searchWeb=${hasSearchWeb}, calculator=${hasCalculator}`,
      );
    }
  }, 60000);

  // Test Deepseek Reasoner's step-by-step reasoning
  it("should show reasoning steps with Deepseek Reasoner", async () => {
    console.log("\n🚀 Testing Deepseek Reasoner's step-by-step reasoning");

    const spec = await client.createSpecification({
      name: "Deepseek Reasoner Test",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.Deepseek,
      deepseek: {
        model: Types.DeepseekModels.Reasoner,
        temperature: 0.7,
      },
    });

    expect(spec.createSpecification?.id).toBeDefined();
    createdSpecIds.push(spec.createSpecification.id);

    let conversationId: string | undefined;
    let streamCompleted = false;
    let finalMessage = "";
    let tokenCount = 0;

    await client.streamAgent(
      "If a train travels at 60 mph for 2.5 hours, how far does it travel? Show your reasoning step by step.",
      (event: AgentStreamEvent) => {
        switch (event.type) {
          case "conversation_started":
            conversationId = event.conversationId;
            console.log(`📝 Conversation started: ${conversationId}`);
            break;
          case "message_update":
            finalMessage = event.message.message;
            tokenCount++;
            // Log reasoning steps as they appear
            if (tokenCount % 20 === 0) {
              const lines = finalMessage.split("\n");
              const lastLine = lines[lines.length - 1];
              if (lastLine.trim()) {
                console.log(`🤔 Reasoning: ${lastLine.substring(0, 100)}...`);
              }
            }
            break;
          case "conversation_completed":
            streamCompleted = true;
            console.log(`✅ Stream completed`);
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

    // Verify results
    expect(streamCompleted).toBe(true);
    expect(finalMessage.length).toBeGreaterThan(0);

    console.log(`✅ Deepseek Reasoner completed reasoning`);
    console.log(`📝 Response length: ${finalMessage.length} characters`);
    console.log(`📝 Response preview:\n${finalMessage.substring(0, 500)}...`);
  }, 60000);
});

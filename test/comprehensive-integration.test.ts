import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import { TEST_MODELS } from "./test-models";
import { UIStreamEvent } from "../src/types/ui-events";

// Performance metrics interface
interface StreamingMetrics {
  startTime: number;
  timeToFirstToken: number;
  timeToLastToken: number;
  tokenCount: number;
  interTokenDelays: number[];
  lastEventTime: number;
  streamType: "fallback" | "native";
}

/**
 * Comprehensive integration test for streamAgent across all supported LLM providers
 *
 * Tests the same functionality across different specifications to ensure consistent behavior
 */
describe("Comprehensive streamAgent Integration Tests", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;

  if (!orgId || !envId || !secret) {
    console.warn(
      "⚠️  Skipping comprehensive tests - missing Graphlit credentials"
    );
    return;
  }

  let client: Graphlit;
  const createdSpecifications: string[] = [];
  let openaiClient: any;
  let anthropicClient: any;
  let googleClient: any;
  const allMetrics: { modelName: string; metrics: StreamingMetrics }[] = [];

  beforeAll(async () => {
    client = new Graphlit(orgId, envId, secret);

    // Initialize streaming clients if API keys are available
    if (process.env.OPENAI_API_KEY) {
      try {
        const { default: OpenAI } = await import("openai");
        openaiClient = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });
        console.log("✅ OpenAI streaming client initialized");
      } catch (e) {
        console.log("⚠️  OpenAI SDK not available");
      }
    }

    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const { default: Anthropic } = await import("@anthropic-ai/sdk");
        anthropicClient = new Anthropic({
          apiKey: process.env.ANTHROPIC_API_KEY,
        });
        console.log("✅ Anthropic streaming client initialized");
      } catch (e) {
        console.log("⚠️  Anthropic SDK not available");
      }
    }

    if (process.env.GOOGLE_API_KEY) {
      try {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        googleClient = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        console.log("✅ Google streaming client initialized");
      } catch (e) {
        console.log("⚠️  Google SDK not available");
      }
    }
  });

  afterAll(async () => {
    // Clean up created specifications
    console.log(
      `\n🧹 Cleaning up ${createdSpecifications.length} test specifications...`
    );
    let cleanupCount = 0;
    for (const specId of createdSpecifications) {
      try {
        await client.deleteSpecification(specId);
        cleanupCount++;
      } catch (error) {
        console.warn(`⚠️  Failed to delete specification ${specId}`);
      }
    }
    console.log(
      `✅ Successfully cleaned up ${cleanupCount}/${createdSpecifications.length} specifications\n`
    );

    // Display comparative metrics summary
    if (allMetrics.length > 0) {
      console.log("\n🎯 PERFORMANCE SUMMARY ACROSS ALL MODELS:");
      console.log("=".repeat(80));

      // Sort by TTFT for comparison
      const sortedByTTFT = [...allMetrics]
        .filter((m) => m.metrics.timeToFirstToken > 0)
        .sort(
          (a, b) => a.metrics.timeToFirstToken - b.metrics.timeToFirstToken
        );

      console.log("\n⚡ Fastest Time to First Token (TTFT):");
      sortedByTTFT.slice(0, 3).forEach((item, idx) => {
        console.log(
          `  ${idx + 1}. ${item.modelName} (${item.metrics.streamType}): ${item.metrics.timeToFirstToken}ms`
        );
      });

      // Sort by TPS for comparison
      const withTPS = allMetrics
        .map((item) => ({
          ...item,
          tps:
            item.metrics.tokenCount > 0 && item.metrics.timeToLastToken > 0
              ? item.metrics.tokenCount / (item.metrics.timeToLastToken / 1000)
              : 0,
        }))
        .filter((item) => item.tps > 0)
        .sort((a, b) => b.tps - a.tps);

      console.log("\n📈 Highest Tokens Per Second (TPS):");
      withTPS.slice(0, 3).forEach((item, idx) => {
        console.log(
          `  ${idx + 1}. ${item.modelName} (${item.metrics.streamType}): ${item.tps.toFixed(2)} TPS`
        );
      });

      console.log("\n📊 Native vs Fallback Comparison:");
      const nativeMetrics = allMetrics.filter(
        (m) => m.metrics.streamType === "native"
      );
      const fallbackMetrics = allMetrics.filter(
        (m) => m.metrics.streamType === "fallback"
      );

      if (nativeMetrics.length > 0) {
        const avgNativeTTFT =
          nativeMetrics.reduce(
            (sum, m) => sum + m.metrics.timeToFirstToken,
            0
          ) / nativeMetrics.length;
        console.log(`  Native Avg TTFT: ${avgNativeTTFT.toFixed(0)}ms`);
      }

      if (fallbackMetrics.length > 0) {
        const avgFallbackTTFT =
          fallbackMetrics.reduce(
            (sum, m) => sum + m.metrics.timeToFirstToken,
            0
          ) / fallbackMetrics.length;
        console.log(`  Fallback Avg TTFT: ${avgFallbackTTFT.toFixed(0)}ms`);
      }

      console.log("=".repeat(80));
    }
  }, 90000);

  // Helper function to clean up conversation
  async function cleanupConversation(conversationId: string | undefined) {
    if (conversationId) {
      try {
        await client.deleteConversation(conversationId);
        console.log(`🗑️  Deleted conversation: ${conversationId}`);
      } catch (error) {
        console.warn(`⚠️  Failed to delete conversation ${conversationId}`);
      }
    }
  }

  // Helper function to calculate and display metrics
  function displayMetrics(metrics: StreamingMetrics, modelName: string) {
    const avgInterTokenDelay =
      metrics.interTokenDelays.length > 0
        ? metrics.interTokenDelays.reduce((a, b) => a + b, 0) /
          metrics.interTokenDelays.length
        : 0;

    const p95InterTokenDelay =
      metrics.interTokenDelays.length > 0
        ? metrics.interTokenDelays.sort((a, b) => a - b)[
            Math.floor(metrics.interTokenDelays.length * 0.95)
          ]
        : 0;

    const tokensPerSecond =
      metrics.tokenCount > 0 && metrics.timeToLastToken > 0
        ? (metrics.tokenCount / (metrics.timeToLastToken / 1000)).toFixed(2)
        : "N/A";

    console.log(
      `\n📊 Performance Metrics for ${modelName} (${metrics.streamType}):`
    );
    console.log(
      `   ⏱️  Time to First Token (TTFT): ${metrics.timeToFirstToken}ms`
    );
    console.log(`   ⏱️  Time to Last Token: ${metrics.timeToLastToken}ms`);
    console.log(`   📈 Tokens Per Second: ${tokensPerSecond} TPS`);
    console.log(`   📊 Total Message Updates: ${metrics.tokenCount}`);
    console.log(
      `   ⚡ Avg Inter-Token Delay: ${avgInterTokenDelay.toFixed(2)}ms`
    );
    console.log(
      `   ⚠️  P95 Inter-Token Delay: ${p95InterTokenDelay.toFixed(2)}ms`
    );

    // Save metrics for summary
    allMetrics.push({ modelName, metrics: { ...metrics } });
  }

  // Use shared test model configurations
  const testSpecifications = TEST_MODELS;

  describe("Fallback Streaming (No Native SDK)", () => {
    testSpecifications.forEach((testSpec) => {
      it(`should handle fallback streaming with ${testSpec.name}`, async () => {
        console.log(`🧪 Testing FALLBACK streaming with ${testSpec.name}...`);

        // Create specification
        const createResponse = await client.createSpecification(
          testSpec.config
        );
        const specId = createResponse.createSpecification?.id;
        expect(specId).toBeDefined();
        createdSpecifications.push(specId!);

        console.log(`📋 Created specification: ${specId}`);

        const events: UIStreamEvent[] = [];
        let finalMessage = "";
        let conversationId: string | undefined;

        // Initialize metrics
        const metrics: StreamingMetrics = {
          startTime: Date.now(),
          timeToFirstToken: 0,
          timeToLastToken: 0,
          tokenCount: 0,
          interTokenDelays: [],
          lastEventTime: 0,
          streamType: "fallback",
        };

        const prompt = `Please introduce yourself as a helpful raccoon named McPoogle who loves to collect shiny objects`;
        console.log(`📝 Prompt: "${prompt}"`);

        // Check if streaming is supported
        if (!client.supportsStreaming()) {
          console.log("⚠️  Skipping test - streaming not supported");
          return;
        }

        await client.streamAgent(
          prompt,
          (event: UIStreamEvent) => {
            events.push(event);
            const currentTime = Date.now();

            console.log(`📨 ${testSpec.name} Event: ${event.type}`);

            if (event.type === "conversation_started") {
              conversationId = event.conversationId;
            } else if (event.type === "message_update") {
              console.log(`💬 Message: "${event.message.message}"`);

              // Track metrics
              metrics.tokenCount++;
              if (metrics.timeToFirstToken === 0) {
                metrics.timeToFirstToken = currentTime - metrics.startTime;
              }

              if (metrics.lastEventTime > 0) {
                metrics.interTokenDelays.push(
                  currentTime - metrics.lastEventTime
                );
              }
              metrics.lastEventTime = currentTime;
            } else if (event.type === "conversation_completed") {
              finalMessage = event.message.message;
              metrics.timeToLastToken = currentTime - metrics.startTime;
              console.log(`✅ Final: "${finalMessage}"`);
            } else if (event.type === "tool_update") {
              console.log(`🔧 Tool: ${event.toolCall.name} - ${event.status}`);
            } else if (event.type === "error") {
              console.error(`❌ Error: ${event.error}`);
            }
          },
          undefined, // conversationId
          { id: specId }, // specification
          undefined, // tools
          undefined // toolHandlers
        );

        // Validate event sequence
        expect(events.length).toBeGreaterThan(0);

        const startEvent = events.find(
          (e) => e.type === "conversation_started"
        );
        expect(startEvent).toBeDefined();
        expect(startEvent!.conversationId).not.toBe("new");
        console.log(
          `✅ ${testSpec.name}: Got conversation_started event with real ID`
        );

        const messageEvents = events.filter((e) => e.type === "message_update");
        expect(messageEvents.length).toBeGreaterThan(0);
        console.log(
          `✅ ${testSpec.name}: Got ${messageEvents.length} message_update events`
        );

        const completeEvent = events.find(
          (e) => e.type === "conversation_completed"
        );
        expect(completeEvent).toBeDefined();
        console.log(`✅ ${testSpec.name}: Got conversation_completed event`);

        // Validate message content - check for our unique character
        const lowerMessage = finalMessage.toLowerCase();
        const mentionsRaccoon = lowerMessage.includes("raccoon");
        const mentionsMcPoogle = lowerMessage.includes("mcpoogle");
        const isValidResponse = mentionsRaccoon || mentionsMcPoogle;

        expect(isValidResponse).toBe(true);
        console.log(
          `✅ ${testSpec.name}: Response includes character reference (raccoon: ${mentionsRaccoon}, McPoogle: ${mentionsMcPoogle})`
        );

        // Display performance metrics
        displayMetrics(metrics, testSpec.name);

        // Clean up conversation
        await cleanupConversation(conversationId);
      }, 60000); // 60 second timeout per test
    });
  });

  describe("Native SDK Streaming", () => {
    testSpecifications.forEach((testSpec) => {
      it(`should handle native streaming with ${testSpec.name}`, async () => {
        // Determine streaming mode for this provider
        const serviceType = testSpec.config.serviceType;

        console.log(`🧪 Testing NATIVE streaming with ${testSpec.name}...`);

        // Create specification
        const createResponse = await client.createSpecification(
          testSpec.config
        );
        const specId = createResponse.createSpecification?.id;
        expect(specId).toBeDefined();
        createdSpecifications.push(specId!);

        console.log(`📋 Created specification: ${specId}`);

        const events: UIStreamEvent[] = [];
        let finalMessage = "";
        let conversationId: string | undefined;

        // Initialize metrics
        const metrics: StreamingMetrics = {
          startTime: Date.now(),
          timeToFirstToken: 0,
          timeToLastToken: 0,
          tokenCount: 0,
          interTokenDelays: [],
          lastEventTime: 0,
          streamType: "native",
        };

        const prompt = `Please introduce yourself as a helpful raccoon named McPoogle who loves to collect shiny objects`;
        console.log(`📝 Prompt: "${prompt}"`);

        // Check if streaming is supported
        if (!client.supportsStreaming()) {
          console.log("⚠️  Skipping test - streaming not supported");
          return;
        }

        await client.streamAgent(
          prompt,
          (event: UIStreamEvent) => {
            events.push(event);
            const currentTime = Date.now();

            console.log(`📨 ${testSpec.name} Event: ${event.type}`);

            if (event.type === "conversation_started") {
              conversationId = event.conversationId;
            } else if (event.type === "message_update") {
              console.log(`💬 Message: "${event.message.message}"`);

              // Track metrics
              metrics.tokenCount++;
              if (metrics.timeToFirstToken === 0) {
                metrics.timeToFirstToken = currentTime - metrics.startTime;
              }

              if (metrics.lastEventTime > 0) {
                metrics.interTokenDelays.push(
                  currentTime - metrics.lastEventTime
                );
              }
              metrics.lastEventTime = currentTime;
            } else if (event.type === "conversation_completed") {
              finalMessage = event.message.message;
              metrics.timeToLastToken = currentTime - metrics.startTime;
              console.log(`✅ Final: "${finalMessage}"`);
            } else if (event.type === "tool_update") {
              console.log(`🔧 Tool: ${event.toolCall.name} - ${event.status}`);
            } else if (event.type === "error") {
              console.error(`❌ Error: ${event.error}`);
            }
          },
          undefined, // conversationId
          { id: specId } // specification
        );

        // Validate event sequence
        expect(events.length).toBeGreaterThan(0);

        const startEvent = events.find(
          (e) => e.type === "conversation_started"
        );
        expect(startEvent).toBeDefined();
        console.log(`✅ ${testSpec.name}: Got conversation_started event`);

        // Native streaming should have MORE message updates than fallback
        const messageEvents = events.filter((e) => e.type === "message_update");
        expect(messageEvents.length).toBeGreaterThan(2); // Expect more granular updates
        console.log(
          `✅ ${testSpec.name}: Got ${messageEvents.length} message_update events (native streaming)`
        );

        const completeEvent = events.find(
          (e) => e.type === "conversation_completed"
        );
        expect(completeEvent).toBeDefined();
        console.log(`✅ ${testSpec.name}: Got conversation_completed event`);

        // Validate message content - check for our unique character
        const lowerMessage = finalMessage.toLowerCase();
        const mentionsRaccoon = lowerMessage.includes("raccoon");
        const mentionsMcPoogle = lowerMessage.includes("mcpoogle");
        const isValidResponse = mentionsRaccoon || mentionsMcPoogle;

        expect(isValidResponse).toBe(true);
        console.log(
          `✅ ${testSpec.name}: Response includes character reference (raccoon: ${mentionsRaccoon}, McPoogle: ${mentionsMcPoogle})`
        );

        // Display performance metrics
        displayMetrics(metrics, testSpec.name);

        // Clean up conversation
        await cleanupConversation(conversationId);
      }, 60000);
    });
  });

  describe("Tool Calling Functionality (Fallback)", () => {
    testSpecifications.forEach((testSpec) => {
      it(`should handle tool calling with ${testSpec.name} (fallback)`, async () => {
        console.log(`🧪 Testing tool calling with ${testSpec.name}...`);

        // Create specification
        const createResponse = await client.createSpecification(
          testSpec.config
        );
        const specId = createResponse.createSpecification?.id;
        expect(specId).toBeDefined();
        createdSpecifications.push(specId!);

        const events: UIStreamEvent[] = [];
        const toolResults: string[] = [];
        let conversationId: string | undefined;

        // Simple calculator tool
        const calculatorTool: Types.ToolDefinitionInput = {
          name: "calculate",
          description: "Perform basic arithmetic calculations",
          schema: JSON.stringify({
            type: "object",
            properties: {
              operation: {
                type: "string",
                enum: ["add", "subtract", "multiply", "divide"],
                description: "The arithmetic operation to perform",
              },
              a: { type: "number", description: "First number" },
              b: { type: "number", description: "Second number" },
            },
            required: ["operation", "a", "b"],
          }),
        };

        const toolHandler = async (args: {
          operation: string;
          a: number;
          b: number;
        }) => {
          console.log(`🔧 ${testSpec.name} - Calculator tool called:`, args);
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
          toolResults.push(response);
          return { result, calculation: response };
        };

        const toolPrompt =
          "You are a helpful raccoon accountant named McPoogle. Please calculate 15 + 27 using the calculator tool and tell me the result";
        console.log(`📝 Tool Prompt: "${toolPrompt}"`);

        // Check if streaming is supported
        if (!client.supportsStreaming()) {
          console.log("⚠️  Skipping test - streaming not supported");
          return;
        }

        await client.streamAgent(
          toolPrompt,
          (event: UIStreamEvent) => {
            events.push(event);
            console.log(`📨 ${testSpec.name} Tool Event: ${event.type}`);

            if (event.type === "conversation_started") {
              conversationId = event.conversationId;
            } else if (event.type === "message_update") {
              console.log(`💬 Tool Message: "${event.message.message}"`);
            } else if (event.type === "tool_update") {
              console.log(`🔧 Tool: ${event.toolCall.name} - ${event.status}`);
              if (event.result) {
                console.log(`🔧 Result:`, event.result);
              }
            } else if (event.type === "conversation_completed") {
              console.log(`💭 Final response: "${event.message.message}"`);
            } else if (event.type === "error") {
              console.error(`❌ Error: ${event.error}`);
            }
          },
          undefined, // conversationId
          { id: specId }, // specification
          [calculatorTool], // tools
          { calculate: toolHandler } // toolHandlers
        );

        // Validate tool execution
        const toolEvents = events.filter((e) => e.type === "tool_update");
        console.log(`${testSpec.name}: Got ${toolEvents.length} tool events`);

        // Tool calling should work for all models
        if (toolEvents.length === 0) {
          const finalEvent = events.find(
            (e) => e.type === "conversation_completed"
          );
          const response = finalEvent
            ? (finalEvent as any).finalMessage
            : "No response";
          console.error(
            `❌ ${testSpec.name}: Tool was NOT called. Model responded with: "${response}"`
          );
        }
        expect(toolEvents.length).toBeGreaterThan(0);
        console.log(`✅ ${testSpec.name}: Tool calling working`);

        expect(toolResults.length).toBeGreaterThan(0);
        expect(toolResults[0]).toContain("15");
        expect(toolResults[0]).toContain("27");
        console.log(
          `✅ ${testSpec.name}: Tool executed with correct parameters`
        );

        const finalEvent = events.find(
          (e) => e.type === "conversation_completed"
        );
        expect(finalEvent).toBeDefined();
        console.log(`✅ ${testSpec.name}: Conversation completed successfully`);

        // Clean up conversation
        await cleanupConversation(conversationId);
      }, 60000);
    });
  });

  describe("Tool Calling Functionality (Native SDK)", () => {
    testSpecifications.forEach((testSpec) => {
      it(`should handle tool calling with ${testSpec.name} (native)`, async () => {
        // Determine streaming mode for this provider
        console.log(`🧪 Testing NATIVE tool calling with ${testSpec.name}...`);

        // Create specification
        const createResponse = await client.createSpecification(
          testSpec.config
        );
        const specId = createResponse.createSpecification?.id;
        expect(specId).toBeDefined();
        createdSpecifications.push(specId!);

        const events: UIStreamEvent[] = [];
        const toolResults: string[] = [];
        let conversationId: string | undefined;

        // Simple calculator tool
        const calculatorTool: Types.ToolDefinitionInput = {
          name: "calculate",
          description: "Perform basic arithmetic calculations",
          schema: JSON.stringify({
            type: "object",
            properties: {
              operation: {
                type: "string",
                enum: ["add", "subtract", "multiply", "divide"],
                description: "The arithmetic operation to perform",
              },
              a: { type: "number", description: "First number" },
              b: { type: "number", description: "Second number" },
            },
            required: ["operation", "a", "b"],
          }),
        };

        const toolHandler = async (args: {
          operation: string;
          a: number;
          b: number;
        }) => {
          console.log(`🔧 ${testSpec.name} - Calculator tool called:`, args);
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
          toolResults.push(response);
          return { result, calculation: response };
        };

        const toolPrompt =
          "You are a helpful raccoon accountant named McPoogle. Please calculate 15 + 27 using the calculator tool and tell me the result";
        console.log(`📝 Tool Prompt: "${toolPrompt}"`);

        // Check if streaming is supported
        if (!client.supportsStreaming()) {
          console.log("⚠️  Skipping test - streaming not supported");
          return;
        }

        await client.streamAgent(
          toolPrompt,
          (event: UIStreamEvent) => {
            events.push(event);
            console.log(`📨 ${testSpec.name} Tool Event: ${event.type}`);

            if (event.type === "conversation_started") {
              conversationId = event.conversationId;
            } else if (event.type === "message_update") {
              console.log(`💬 Tool Message: "${event.message.message}"`);
            } else if (event.type === "tool_update") {
              console.log(`🔧 Tool: ${event.toolCall.name} - ${event.status}`);
              if (event.result) {
                console.log(`🔧 Result:`, event.result);
              }
            } else if (event.type === "conversation_completed") {
              console.log(`💭 Final response: "${event.message.message}"`);
            } else if (event.type === "error") {
              console.error(`❌ Error: ${event.error}`);
            }
          },
          undefined, // conversationId
          { id: specId }, // specification
          [calculatorTool], // tools
          { calculate: toolHandler } // toolHandlers
        );

        // Validate tool execution
        const toolEvents = events.filter((e) => e.type === "tool_update");
        console.log(`${testSpec.name}: Got ${toolEvents.length} tool events`);

        if (toolEvents.length > 0) {
          console.log(
            `✅ ${testSpec.name}: Tool calling working with native SDK`
          );
          expect(toolResults.length).toBeGreaterThan(0);
          expect(toolResults[0]).toContain("15");
          expect(toolResults[0]).toContain("27");
          console.log(
            `✅ ${testSpec.name}: Tool executed with correct parameters`
          );
        } else {
          console.log(
            `ℹ️  ${testSpec.name}: No tool events (may not support tool calling)`
          );
        }

        const finalEvent = events.find(
          (e) => e.type === "conversation_completed"
        );
        expect(finalEvent).toBeDefined();
        console.log(
          `✅ ${testSpec.name}: Conversation completed successfully with native SDK`
        );

        // Clean up conversation
        await cleanupConversation(conversationId);
      }, 60000);
    });
  });

  describe("Conversation Continuity (Fallback)", () => {
    testSpecifications.forEach((testSpec) => {
      it(`should maintain conversation context with ${testSpec.name} (fallback)`, async () => {
        console.log(
          `🧪 Testing conversation continuity with ${testSpec.name}...`
        );

        // Create specification
        const createResponse = await client.createSpecification(
          testSpec.config
        );
        const specId = createResponse.createSpecification?.id;
        expect(specId).toBeDefined();
        createdSpecifications.push(specId!);

        let actualConversationId: string;

        // First message
        const firstEvents: UIStreamEvent[] = [];
        const firstPrompt =
          "You are a forgetful raccoon named McPoogle. Please remember this very important number: 42. It's the number of shiny objects in your collection.";
        console.log(`📝 First Prompt: "${firstPrompt}"`);

        // Check if streaming is supported
        if (!client.supportsStreaming()) {
          console.log("⚠️  Skipping test - streaming not supported");
          return;
        }

        await client.streamAgent(
          firstPrompt,
          (event: UIStreamEvent) => {
            firstEvents.push(event);
            if (event.type === "conversation_started") {
              actualConversationId = event.conversationId;
              console.log(
                `🆔 ${testSpec.name} Conversation ID: ${actualConversationId}`
              );
            }
          },
          undefined, // conversationId
          { id: specId } // specification
        );

        expect(actualConversationId!).toBeDefined();
        expect(actualConversationId).not.toBe("new");
        expect(actualConversationId).not.toBe("temp-id");

        // Follow-up message in same conversation
        const events: UIStreamEvent[] = [];
        const followUpPrompt =
          "McPoogle, how many shiny objects are in your collection? What was that important number?";
        console.log(`📝 Follow-up Prompt: "${followUpPrompt}"`);

        await client.streamAgent(
          followUpPrompt,
          (event: UIStreamEvent) => {
            events.push(event);
            if (event.type === "conversation_completed") {
              console.log(
                `💬 ${testSpec.name} Response: "${event.message.message}"`
              );
            }
          },
          actualConversationId, // Continue same conversation
          { id: specId } // specification
        );

        const finalEvent = events.find(
          (e) => e.type === "conversation_completed"
        );
        expect(finalEvent).toBeDefined();
        const response = (finalEvent as any).finalMessage.toLowerCase();
        const remembered =
          response.includes("42") || response.includes("forty-two");
        if (!remembered) {
          console.log(
            `⚠️  ${testSpec.name}: AI may have forgotten or played forgetful character`
          );
        }
        expect(remembered).toBe(true);
        console.log(`✅ ${testSpec.name}: AI remembered conversation context`);

        // Clean up conversation
        await cleanupConversation(actualConversationId);
      }, 60000);
    });
  });

  describe("Conversation Continuity (Native SDK)", () => {
    testSpecifications.forEach((testSpec) => {
      it(`should maintain conversation context with ${testSpec.name} (native)`, async () => {
        console.log(
          `🧪 Testing NATIVE conversation continuity with ${testSpec.name}...`
        );

        // Create specification
        const createResponse = await client.createSpecification(
          testSpec.config
        );
        const specId = createResponse.createSpecification?.id;
        expect(specId).toBeDefined();
        createdSpecifications.push(specId!);

        let actualConversationId: string;

        // First message with native SDK
        const firstEvents: UIStreamEvent[] = [];
        const firstPrompt =
          "You are a forgetful raccoon named McPoogle. Please remember this very important number: 42. It's the number of shiny objects in your collection.";
        console.log(`📝 First Prompt: "${firstPrompt}"`);

        // Check if streaming is supported
        if (!client.supportsStreaming()) {
          console.log("⚠️  Skipping test - streaming not supported");
          return;
        }

        await client.streamAgent(
          firstPrompt,
          (event: UIStreamEvent) => {
            firstEvents.push(event);
            if (event.type === "conversation_started") {
              actualConversationId = event.conversationId;
              console.log(
                `🆔 ${testSpec.name} Conversation ID: ${actualConversationId}`
              );
            }
          },
          undefined, // conversationId
          { id: specId } // specification
        );

        expect(actualConversationId!).toBeDefined();
        expect(actualConversationId).not.toBe("new");
        expect(actualConversationId).not.toBe("temp-id");

        // Follow-up message in same conversation with native SDK
        const events: UIStreamEvent[] = [];
        const followUpPrompt =
          "McPoogle, how many shiny objects are in your collection? What was that important number?";
        console.log(`📝 Follow-up Prompt: "${followUpPrompt}"`);

        await client.streamAgent(
          followUpPrompt,
          (event: UIStreamEvent) => {
            events.push(event);
            if (event.type === "conversation_completed") {
              console.log(
                `💬 ${testSpec.name} Response: "${event.message.message}"`
              );
            }
          },
          actualConversationId, // Continue same conversation
          { id: specId } // specification
        );

        const finalEvent = events.find(
          (e) => e.type === "conversation_completed"
        );
        expect(finalEvent).toBeDefined();
        const response = (finalEvent as any).finalMessage.toLowerCase();
        const remembered =
          response.includes("42") || response.includes("forty-two");
        if (!remembered) {
          console.log(
            `⚠️  ${testSpec.name}: AI may have forgotten or played forgetful character`
          );
        }
        expect(remembered).toBe(true);
        console.log(
          `✅ ${testSpec.name}: AI remembered conversation context with native SDK`
        );

        // Clean up conversation
        await cleanupConversation(actualConversationId);
      }, 60000);
    });
  });
});

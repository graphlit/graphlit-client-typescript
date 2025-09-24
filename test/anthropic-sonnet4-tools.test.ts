import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import { AgentStreamEvent } from "../src/types/ui-events";

/**
 * Test to reproduce the issue where Anthropic Sonnet 4 with thinking
 * causes the stream to close immediately after tool calls
 */
describe("Anthropic Sonnet 4 - Thinking + Tool Calls Issue", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (!orgId || !envId || !secret || !anthropicKey) {
    console.warn(
      "⚠️  Skipping Anthropic Sonnet 4 tests - missing credentials",
    );
    return;
  }

  let client: Graphlit;
  let anthropicClient: any;
  let specificationId: string | undefined;
  let conversationId: string | undefined;

  beforeAll(async () => {
    client = new Graphlit(orgId, envId, secret);

    // Initialize Anthropic client
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    anthropicClient = new Anthropic({
      apiKey: anthropicKey,
    });
    client.setAnthropicClient(anthropicClient);
    console.log("✅ Anthropic client initialized for Sonnet 4");

    // Create a specification for Claude 4 Sonnet (with thinking support)
    const specInput: Types.SpecificationInput = {
      name: "Test - Claude 4 Sonnet",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.Anthropic,
      anthropic: {
        model: Types.AnthropicModels.Claude_4Sonnet_20250514,
        temperature: 0.5,
        enableThinking: true, // Enable thinking for Sonnet 4
      },
    };

    const createSpecResponse = await client.createSpecification(specInput);
    specificationId = createSpecResponse.createSpecification?.id;
    expect(specificationId).toBeTruthy();
    console.log("✅ Created specification:", specificationId);
  });

  afterAll(async () => {
    // Clean up
    if (conversationId) {
      try {
        await client.deleteConversation(conversationId);
        console.log("✅ Cleaned up conversation:", conversationId);
      } catch (error) {
        console.warn("⚠️  Failed to delete conversation:", conversationId);
      }
    }

    if (specificationId) {
      try {
        await client.deleteSpecification(specificationId);
        console.log("✅ Cleaned up specification:", specificationId);
      } catch (error) {
        console.warn("⚠️  Failed to delete specification:", specificationId);
      }
    }
  });

  it("should handle thinking + tool calls without closing stream prematurely", { timeout: 60000 }, async () => {
    // Define a simple tool that lists resources
    const tools: Types.ToolDefinitionInput[] = [
      {
        name: "platform__list_resources",
        description: "List available resources in the platform",
        schema: JSON.stringify({
          type: "object",
          properties: {},
        }),
      },
    ];

    // Tool handler that returns mock data
    const toolHandlers = {
      platform__list_resources: async () => {
        console.log("  🔧 Tool called: platform__list_resources");
        return {
          resources: [
            { id: "1", name: "Resource 1", type: "document" },
            { id: "2", name: "Resource 2", type: "image" },
          ],
        };
      },
    };

    // Track all events to understand the flow
    const events: { type: string; timestamp: number; details?: any }[] = [];
    let hasThinking = false;
    let hasToolCalls = false;
    let hasConversationCompleted = false;
    let streamClosedPrematurely = false;
    let toolExecutionStarted = false;
    let toolExecutionCompleted = false;
    let finalMessageReceived = false;

    console.log("\n🚀 Starting test with prompt that triggers thinking + tools...");

    // Use the exact same prompt that causes issues
    const prompt = "give me an essay about john the kitten";

    await client.streamAgent(
      prompt,
      (event: AgentStreamEvent) => {
        const timestamp = Date.now();
        const eventLog = { type: event.type, timestamp, details: {} };

        switch (event.type) {
          case "conversation_started":
            conversationId = event.conversationId;
            console.log(`  📝 Conversation started: ${conversationId}`);
            break;

          case "reasoning_update":
            hasThinking = true;
            const reasoningEvent = event as any;
            eventLog.details = {
              isComplete: reasoningEvent.isComplete,
              contentLength: reasoningEvent.content?.length || 0,
            };
            if (!reasoningEvent.isComplete) {
              console.log(`  🤔 Thinking... (${reasoningEvent.content?.length || 0} chars)`);
            } else {
              console.log(`  ✅ Thinking complete (${reasoningEvent.content?.length || 0} chars)`);
            }
            break;

          case "message_update":
            const messageEvent = event as any;
            eventLog.details = {
              isStreaming: messageEvent.isStreaming,
              messageLength: messageEvent.message?.message?.length || 0,
            };
            if (messageEvent.message?.message?.length > 0) {
              console.log(`  💬 Message update (${messageEvent.message.message.length} chars, streaming: ${messageEvent.isStreaming})`);
            }
            break;

          case "tool_update":
            const toolEvent = event as any;
            hasToolCalls = true;
            eventLog.details = {
              toolName: toolEvent.toolCall?.name,
              status: toolEvent.status,
            };

            if (toolEvent.status === "preparing") {
              console.log(`  🔧 Tool preparing: ${toolEvent.toolCall?.name}`);
              toolExecutionStarted = true;
            } else if (toolEvent.status === "executing") {
              console.log(`  🔧 Tool executing: ${toolEvent.toolCall?.name}`);
            } else if (toolEvent.status === "completed") {
              console.log(`  ✅ Tool completed: ${toolEvent.toolCall?.name}`);
              toolExecutionCompleted = true;
            } else if (toolEvent.status === "failed") {
              console.log(`  ❌ Tool failed: ${toolEvent.toolCall?.name}`);
            }
            break;

          case "conversation_completed":
            hasConversationCompleted = true;
            const completedEvent = event as any;
            finalMessageReceived = true;

            // Check if there are pending tool calls
            const hasPendingTools = completedEvent.message?.toolCalls?.length > 0;

            console.log(`  🏁 Conversation completed event received`);
            console.log(`     - Has tool calls: ${hasPendingTools}`);
            console.log(`     - Tool execution completed: ${toolExecutionCompleted}`);

            if (hasPendingTools && !toolExecutionCompleted) {
              console.log(`  ⚠️  ISSUE DETECTED: conversation_completed with pending tools!`);
              streamClosedPrematurely = true;
            }

            eventLog.details = {
              hasPendingTools,
              toolExecutionCompleted,
              messageLength: completedEvent.message?.message?.length || 0,
            };
            break;

          case "error":
            console.log(`  ❌ Error: ${(event as any).error?.message}`);
            break;
        }

        events.push(eventLog);
      },
      undefined, // conversationId
      { id: specificationId },
      tools,
      toolHandlers,
      {
        // Enable detailed debugging
        chunkingStrategy: "sentence",
      },
    );

    // Analyze the event flow
    console.log("\n📊 Event Analysis:");
    console.log(`  Total events: ${events.length}`);
    console.log(`  Unique event types: ${[...new Set(events.map(e => e.type))].join(", ")}`);

    // Check for the specific issue pattern
    const conversationCompletedIndex = events.findIndex(e => e.type === "conversation_completed");
    const lastToolUpdateIndex = events.map((e, i) => e.type === "tool_update" ? i : -1).filter(i => i >= 0).pop() || -1;

    console.log(`\n🔍 Issue Detection:`);
    console.log(`  Has thinking: ${hasThinking}`);
    console.log(`  Has tool calls: ${hasToolCalls}`);
    console.log(`  Tool execution started: ${toolExecutionStarted}`);
    console.log(`  Tool execution completed: ${toolExecutionCompleted}`);
    console.log(`  Conversation completed index: ${conversationCompletedIndex}`);
    console.log(`  Last tool update index: ${lastToolUpdateIndex}`);

    if (conversationCompletedIndex > 0 && lastToolUpdateIndex > 0) {
      if (conversationCompletedIndex < lastToolUpdateIndex) {
        console.log(`  ✅ GOOD: Tool updates continued after conversation_completed`);
      } else {
        console.log(`  ⚠️  ISSUE: conversation_completed came after last tool update`);

        // Check if tool was actually completed
        const lastToolEvent = events[lastToolUpdateIndex];
        if (lastToolEvent.details?.status !== "completed") {
          console.log(`  ❌ PROBLEM CONFIRMED: Stream closed with tool in '${lastToolEvent.details?.status}' status`);
          streamClosedPrematurely = true;
        }
      }
    }

    // Print timeline for debugging
    console.log("\n📅 Event Timeline:");
    const startTime = events[0]?.timestamp || 0;
    events.forEach((e, i) => {
      const relativeTime = e.timestamp - startTime;
      const details = e.details ? ` - ${JSON.stringify(e.details)}` : "";
      console.log(`  ${relativeTime}ms: ${e.type}${details}`);
    });

    // Assertions
    expect(hasThinking).toBe(true); // Should have thinking events with Sonnet 4
    expect(hasToolCalls).toBe(true); // Should have tool call events
    expect(toolExecutionStarted).toBe(true); // Tool execution should start

    // The main issue we're testing for
    if (hasToolCalls) {
      expect(toolExecutionCompleted).toBe(true); // Tool execution should complete before stream ends
      expect(streamClosedPrematurely).toBe(false); // Stream should not close with pending tools
    }

    expect(hasConversationCompleted).toBe(true); // Should receive conversation_completed event
    expect(finalMessageReceived).toBe(true); // Should receive final message

    // Verify the flow makes sense
    const reasoningEvents = events.filter(e => e.type === "reasoning_update");
    const messageEvents = events.filter(e => e.type === "message_update");
    const toolEvents = events.filter(e => e.type === "tool_update");

    console.log("\n📈 Flow Summary:");
    console.log(`  Reasoning events: ${reasoningEvents.length}`);
    console.log(`  Message events: ${messageEvents.length}`);
    console.log(`  Tool events: ${toolEvents.length}`);

    // With thinking enabled, we expect:
    // 1. Reasoning updates first
    // 2. Then a message update
    // 3. Then tool calls
    // 4. Tool execution should complete
    // 5. Possibly more message updates with results
    // 6. Finally conversation_completed

    if (reasoningEvents.length > 0 && toolEvents.length > 0) {
      const firstReasoningTime = reasoningEvents[0].timestamp;
      const firstToolTime = toolEvents[0].timestamp;
      expect(firstReasoningTime).toBeLessThan(firstToolTime); // Reasoning should come before tools
    }
  });

  it("should properly handle multiple rounds with thinking", { timeout: 60000 }, async () => {
    // Test with a tool that will require multiple rounds
    const tools: Types.ToolDefinitionInput[] = [
      {
        name: "search",
        description: "Search for information",
        schema: JSON.stringify({
          type: "object",
          properties: {
            query: { type: "string", description: "Search query" },
          },
          required: ["query"],
        }),
      },
      {
        name: "calculate",
        description: "Perform calculations",
        schema: JSON.stringify({
          type: "object",
          properties: {
            expression: { type: "string", description: "Math expression" },
          },
          required: ["expression"],
        }),
      },
    ];

    const toolHandlers = {
      search: async (args: { query: string }) => {
        console.log(`  🔍 Searching for: ${args.query}`);
        // Return data that will require follow-up calculation
        return {
          result: "The speed of light is 186,282 miles per second",
          needsCalculation: true
        };
      },
      calculate: async (args: { expression: string }) => {
        console.log(`  🧮 Calculating: ${args.expression}`);
        return { result: "8.3 minutes" };
      },
    };

    let rounds = 0;
    let toolCallCount = 0;
    const roundMarkers: number[] = [];

    await client.streamAgent(
      "Search for the speed of light, then calculate how long it takes light to travel from the sun to Earth (93 million miles). Think about your approach first.",
      (event: AgentStreamEvent) => {
        if (event.type === "conversation_started") {
          conversationId = event.conversationId;
        } else if (event.type === "tool_update") {
          const toolEvent = event as any;
          if (toolEvent.status === "executing") {
            toolCallCount++;
            console.log(`  Round marker: Tool #${toolCallCount} executing`);
            roundMarkers.push(Date.now());
          }
        } else if (event.type === "message_update") {
          // Track potential round transitions
          const messageEvent = event as any;
          if (!messageEvent.isStreaming && toolCallCount > 0) {
            rounds = Math.max(rounds, Math.ceil(toolCallCount / 2));
          }
        }
      },
      undefined,
      { id: specificationId },
      tools,
      toolHandlers,
    );

    console.log(`\n📊 Multi-round Results:`);
    console.log(`  Tool calls made: ${toolCallCount}`);
    console.log(`  Estimated rounds: ${rounds}`);

    expect(toolCallCount).toBeGreaterThanOrEqual(1); // Should make at least one tool call

    // If multiple tools were called, verify they happened in sequence
    if (roundMarkers.length > 1) {
      for (let i = 1; i < roundMarkers.length; i++) {
        const gap = roundMarkers[i] - roundMarkers[i-1];
        console.log(`  Time between tool ${i} and ${i+1}: ${gap}ms`);
      }
    }
  });
});
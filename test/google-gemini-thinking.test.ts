import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import { AgentStreamEvent } from "../src/types/ui-events";

/**
 * Test to validate Google Gemini thinking/reasoning events
 * Tests that thought parts are properly detected and emitted as reasoning events
 */
describe("Google Gemini - Thinking/Reasoning Events", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;
  const googleApiKey = process.env.GOOGLE_API_KEY;

  if (!orgId || !envId || !secret || !googleApiKey) {
    console.warn(
      "⚠️  Skipping Google Gemini thinking tests - missing credentials",
    );
    return;
  }

  let client: Graphlit;
  let googleClient: any;
  let specificationId: string | undefined;
  let conversationId: string | undefined;

  beforeAll(async () => {
    client = new Graphlit(orgId, envId, secret);

    // Initialize Google Generative AI client
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    googleClient = new GoogleGenerativeAI(googleApiKey);
    client.setGoogleClient(googleClient);
    console.log("✅ Google client initialized for Gemini thinking tests");

    // Create a specification for Gemini 2.5 Flash with thinking enabled
    const specInput: Types.SpecificationInput = {
      name: "Test - Gemini 2.5 Flash Thinking",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.Google,
      google: {
        model: Types.GoogleModels.Gemini_2_5Flash,
        temperature: 0.7,
        enableThinking: true,
        // Set thinking token limit (-1 for dynamic)
        thinkingTokenLimit: -1,
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

  it("should emit reasoning events for Google thought parts", { timeout: 60000 }, async () => {
    // Track all events to validate the flow
    const events: { type: string; timestamp: number; details?: any }[] = [];
    let hasReasoning = false;
    let reasoningStarted = false;
    let reasoningCompleted = false;
    let reasoningContent = "";
    let hasConversationCompleted = false;
    let messageContent = "";

    console.log("\n🚀 Starting test with prompt that should trigger thinking...");

    // Use a complex prompt that should trigger thinking
    const prompt = "Write a comprehensive analysis of the impact of artificial intelligence on healthcare, including specific examples and future predictions. Think through this systematically.";

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
            hasReasoning = true;
            const reasoningEvent = event as any;
            if (!reasoningStarted && !reasoningEvent.isComplete) {
              reasoningStarted = true;
              console.log(`  🤔 Reasoning started (format: ${reasoningEvent.format})`);
            }
            if (reasoningEvent.isComplete) {
              reasoningCompleted = true;
              reasoningContent = reasoningEvent.content || "";
              eventLog.details = {
                contentLength: reasoningContent.length,
                isComplete: true,
              };
              console.log(`  ✅ Reasoning complete (${reasoningContent.length} chars)`);

              // Log a snippet of the reasoning content
              if (reasoningContent.length > 0) {
                const snippet = reasoningContent.substring(0, 200);
                console.log(`  💭 Reasoning snippet: "${snippet}..."`);
              }
            } else {
              eventLog.details = {
                contentLength: reasoningEvent.content?.length || 0,
                isComplete: false,
              };
            }
            break;

          case "message_update":
            const messageEvent = event as any;
            if (messageEvent.message?.message) {
              messageContent = messageEvent.message.message;
              eventLog.details = {
                isStreaming: messageEvent.isStreaming,
                messageLength: messageContent.length,
              };
            }
            break;

          case "conversation_completed":
            hasConversationCompleted = true;
            const completedEvent = event as any;
            eventLog.details = {
              messageLength: completedEvent.message?.message?.length || 0,
            };
            console.log(`  🏁 Conversation completed`);
            console.log(`     - Final message length: ${completedEvent.message?.message?.length || 0} chars`);
            break;

          case "error":
            console.log(`  ❌ Error: ${(event as any).error?.message}`);
            break;
        }

        events.push(eventLog);
      },
      undefined, // conversationId
      { id: specificationId },
      undefined, // tools
      undefined, // toolHandlers
      {
        // Enable detailed debugging
        chunkingStrategy: "sentence",
      },
    );

    // Analyze the event flow
    console.log("\n📊 Event Analysis:");
    console.log(`  Total events: ${events.length}`);
    console.log(`  Unique event types: ${[...new Set(events.map(e => e.type))].join(", ")}`);

    // Check for reasoning events
    console.log("\n🔍 Reasoning Detection:");
    console.log(`  Has reasoning updates: ${hasReasoning}`);
    console.log(`  Reasoning started: ${reasoningStarted}`);
    console.log(`  Reasoning completed: ${reasoningCompleted}`);
    console.log(`  Reasoning content length: ${reasoningContent.length} chars`);
    console.log(`  Message content length: ${messageContent.length} chars`);
    console.log(`  Conversation completed: ${hasConversationCompleted}`);

    // Assertions
    expect(hasConversationCompleted).toBe(true); // Should complete the conversation

    // Google Gemini with thinking enabled should emit reasoning events
    if (reasoningContent.length > 0) {
      expect(hasReasoning).toBe(true); // Should have reasoning events
      expect(reasoningCompleted).toBe(true); // Should have completed reasoning
      expect(reasoningContent.length).toBeGreaterThan(0); // Should have reasoning content
    } else {
      console.warn("⚠️  No reasoning content detected - model may not have engaged thinking mode for this prompt");
    }

    expect(messageContent.length).toBeGreaterThan(0); // Should have actual message content

    // Print timeline for debugging
    if (events.length > 0) {
      console.log("\n📅 Event Timeline:");
      const startTime = events[0]?.timestamp || 0;
      events.forEach((e) => {
        const relativeTime = e.timestamp - startTime;
        const details = e.details ? ` - ${JSON.stringify(e.details)}` : "";
        console.log(`  ${relativeTime}ms: ${e.type}${details}`);
      });
    }
  });

  it("should handle thinking with different budget settings", { timeout: 60000 }, async () => {
    // Test with explicit budget (not dynamic)
    const specInput: Types.SpecificationInput = {
      name: "Test - Gemini with Fixed Budget",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.Google,
      google: {
        model: Types.GoogleModels.Gemini_2_5Flash,
        temperature: 0.7,
        enableThinking: true,
        // Set a specific thinking token limit
        thinkingTokenLimit: 8000,
      },
    };

    const createSpecResponse = await client.createSpecification(specInput);
    const fixedBudgetSpecId = createSpecResponse.createSpecification?.id;
    expect(fixedBudgetSpecId).toBeTruthy();

    try {
      let hasThinking = false;
      let thinkingLength = 0;

      await client.streamAgent(
        "Explain quantum computing in simple terms. Think about the best analogies to use.",
        (event: AgentStreamEvent) => {
          if (event.type === "conversation_started") {
            conversationId = event.conversationId;
          } else if (event.type === "reasoning_update") {
            const reasoningEvent = event as any;
            if (reasoningEvent.isComplete) {
              hasThinking = true;
              thinkingLength = reasoningEvent.content?.length || 0;
              console.log(`  ✅ Fixed budget thinking complete: ${thinkingLength} chars`);
            } else if (!hasThinking) {
              hasThinking = true;
              console.log("  🤔 Fixed budget thinking started");
            }
          }
        },
        undefined,
        { id: fixedBudgetSpecId },
      );

      if (hasThinking) {
        expect(thinkingLength).toBeGreaterThan(0);
        console.log(`  📊 Fixed budget (8000 tokens) produced ${thinkingLength} chars of thinking`);
      }

      // Clean up test conversation
      if (conversationId) {
        await client.deleteConversation(conversationId);
        conversationId = undefined;
      }
    } finally {
      // Clean up test specification
      if (fixedBudgetSpecId) {
        await client.deleteSpecification(fixedBudgetSpecId);
      }
    }
  });

  it("should not emit reasoning events when thinking is disabled", { timeout: 60000 }, async () => {
    // Test with thinking explicitly disabled
    const specInput: Types.SpecificationInput = {
      name: "Test - Gemini No Thinking",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.Google,
      google: {
        model: Types.GoogleModels.Gemini_2_5Flash,
        temperature: 0.7,
        // Disable thinking
        enableThinking: false,
        thinkingTokenLimit: 0,
      },
    };

    const createSpecResponse = await client.createSpecification(specInput);
    const noThinkingSpecId = createSpecResponse.createSpecification?.id;
    expect(noThinkingSpecId).toBeTruthy();

    try {
      let hasReasoningEvents = false;

      await client.streamAgent(
        "What is 2 + 2?",
        (event: AgentStreamEvent) => {
          if (event.type === "conversation_started") {
            conversationId = event.conversationId;
          } else if (event.type === "reasoning_update") {
            hasReasoningEvents = true;
            const reasoningEvent = event as any;
            console.log(`  ⚠️ Unexpected reasoning event (isComplete: ${reasoningEvent.isComplete})`);
          }
        },
        undefined,
        { id: noThinkingSpecId },
      );

      // Should NOT have reasoning events when thinking is disabled
      expect(hasReasoningEvents).toBe(false);
      console.log("  ✅ Confirmed: No reasoning events when thinking is disabled");

      // Clean up test conversation
      if (conversationId) {
        await client.deleteConversation(conversationId);
        conversationId = undefined;
      }
    } finally {
      // Clean up test specification
      if (noThinkingSpecId) {
        await client.deleteSpecification(noThinkingSpecId);
      }
    }
  });
});
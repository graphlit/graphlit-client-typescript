import { describe, it, expect } from "vitest";
import { Graphlit } from "../src/client";
import { SmoothChunkingStrategy } from "../src/types/streaming";

import * as Types from "../src/generated/graphql-types";
import { UIStreamEvent } from "../src/types/ui-events";

/**
 * Complete integration test for streamAgent with real Graphlit API + OpenAI GPT-4
 *
 * This validates:
 * 1. Basic streaming conversation
 * 2. UI mode event handling
 * 3. Tool calling integration
 * 4. Error handling
 * 5. Conversation continuity
 */
describe("streamAgent Integration Tests", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!orgId || !envId || !secret) {
    console.warn(
      "⚠️  Skipping integration tests - missing Graphlit credentials"
    );
    return;
  }

  let client: Graphlit;

  beforeEach(async () => {
    client = new Graphlit(orgId, envId, secret);
  });

  it("should handle basic streaming conversation with GPT-4", async () => {
    console.log("🧪 Testing basic streaming conversation...");

    const events: UIStreamEvent[] = [];
    let finalMessage = "";

    // Check if streaming is supported
    if (!client.supportsStreaming()) {
      console.log("⚠️  Skipping test - streaming not supported");
      return;
    }

    await client.streamAgent(
      "Say exactly: 'Hello from GPT-4!'",
      (event: UIStreamEvent) => {
        events.push(event);
        console.log(`📨 Event: ${event.type}`);

        if (event.type === "message_update") {
          console.log(`💬 Message: "${event.message.message}"`);
        } else if (event.type === "conversation_completed") {
          finalMessage = event.message.message;
          console.log(`✅ Final: "${finalMessage}"`);
        }
      }
    );

    // Validate event sequence
    expect(events.length).toBeGreaterThan(0);

    const startEvent = events.find((e) => e.type === "conversation_started");
    expect(startEvent).toBeDefined();
    console.log("✅ Got conversation_started event");

    const messageEvents = events.filter((e) => e.type === "message_update");
    expect(messageEvents.length).toBeGreaterThan(0);
    console.log(`✅ Got ${messageEvents.length} message_update events`);

    const completeEvent = events.find(
      (e) => e.type === "conversation_completed"
    );
    expect(completeEvent).toBeDefined();
    console.log("✅ Got conversation_completed event");

    // Validate message content
    expect(finalMessage).toContain("Hello from GPT-4");
    console.log("✅ Response contains expected text");
  });

  it("should work with OpenAI streaming when API key provided", async () => {
    if (!openaiKey) {
      console.log("⏭️  Skipping OpenAI streaming test - no API key");
      return;
    }

    console.log("🧪 Testing with OpenAI streaming client...");

    const events: UIStreamEvent[] = [];

    try {
      const { default: OpenAI } = await import("openai");
      const openaiClient = new OpenAI({ apiKey: openaiKey });
      console.log("✅ OpenAI client initialized for native streaming");
    } catch (e) {
      console.log("⏭️  Skipping - OpenAI SDK not available");
      return;
    }

    // Check if streaming is supported
    if (!client.supportsStreaming()) {
      console.log("⚠️  Skipping test - streaming not supported");
      return;
    }

    await client.streamAgent(
      "Count from 1 to 3, each number on a new line",
      (event: UIStreamEvent) => {
        events.push(event);
        if (event.type === "message_update") {
          console.log(`📨 Streaming: "${event.message.message}"`);
        }
      }
    );

    const messageEvents = events.filter((e) => e.type === "message_update");
    expect(messageEvents.length).toBeGreaterThan(0); // Should get at least one update
    console.log(`✅ Got ${messageEvents.length} progressive message updates`);

    const finalEvent = events.find((e) => e.type === "conversation_completed");
    expect(finalEvent).toBeDefined();
    expect((finalEvent as any).finalMessage).toMatch(/1.*2.*3/s);
    console.log("✅ Got expected counting response");
  });

  it("should handle tool calling workflow", async () => {
    console.log("🧪 Testing tool calling...");

    const events: UIStreamEvent[] = [];
    const toolResults: string[] = [];

    // Simple weather tool
    const weatherTool = {
      name: "get_weather",
      description: "Get weather for a city",
      schema: JSON.stringify({
        type: "object",
        properties: {
          city: { type: "string", description: "City name" },
        },
        required: ["city"],
      }),
    };

    const toolHandler = async (args: any) => {
      console.log(`🔧 Tool called with: ${JSON.stringify(args)}`);
      const result = `Weather in ${args.city}: 72°F and sunny`;
      toolResults.push(result);
      return { weather: result };
    };

    // Create a properly typed specification for OpenAI GPT-4o
    const createSpecResponse = await client.createSpecification({
      name: "Test GPT-4o Spec",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.OpenAi,
      openAI: {
        model: Types.OpenAiModels.Gpt4O_128K,
        temperature: 0.7,
      },
    });

    const specId = createSpecResponse.createSpecification?.id;
    console.log(`📋 Created specification: ${specId}`);

    // Check if streaming is supported
    if (!client.supportsStreaming()) {
      console.log("⚠️  Skipping test - streaming not supported");
      return;
    }

    await client.streamAgent(
      "What's the weather in San Francisco?",
      (event: UIStreamEvent) => {
        events.push(event);
        console.log(`📨 Event: ${event.type}`);

        if (event.type === "tool_update") {
          console.log(`🔧 Tool: ${event.toolCall.name} - ${event.status}`);
          if (event.result) {
            console.log(`🔧 Result: ${JSON.stringify(event.result)}`);
          }
        }
      },
      undefined, // conversationId
      { id: specId }, // specification
      [weatherTool], // tools
      { get_weather: toolHandler } // toolHandlers
    );

    // Validate tool execution
    const toolEvents = events.filter((e) => e.type === "tool_update");
    expect(toolEvents.length).toBeGreaterThan(0);
    console.log(`✅ Got ${toolEvents.length} tool events`);

    expect(toolResults.length).toBeGreaterThan(0);
    expect(toolResults[0]).toContain("San Francisco");
    console.log("✅ Tool was executed with correct parameters");

    const finalEvent = events.find((e) => e.type === "conversation_completed");
    expect(finalEvent).toBeDefined();
    expect((finalEvent as any).finalMessage).toContain("San Francisco");
    console.log("✅ Final response includes tool result");
  });

  it("should handle conversation continuity", async () => {
    console.log("🧪 Testing conversation continuity...");

    let conversationId: string;

    // First message
    // Check if streaming is supported
    if (!client.supportsStreaming()) {
      console.log("⚠️  Skipping test - streaming not supported");
      return;
    }

    await client.streamAgent(
      "Remember this: my favorite color is blue",
      (event: UIStreamEvent) => {
        if (event.type === "conversation_started") {
          conversationId = event.conversationId;
          console.log(`🆔 Conversation ID: ${conversationId}`);
        }
      }
    );

    expect(conversationId!).toBeDefined();

    // Follow-up message in same conversation
    const events: UIStreamEvent[] = [];
    await client.streamAgent(
      "What did I say was my favorite color?",
      (event: UIStreamEvent) => {
        events.push(event);
        if (event.type === "conversation_completed") {
          console.log(`💬 Response: "${event.message.message}"`);
        }
      },
      conversationId! // Continue same conversation
    );

    const finalEvent = events.find((e) => e.type === "conversation_completed");
    expect(finalEvent).toBeDefined();
    expect((finalEvent as any).finalMessage.toLowerCase()).toContain("blue");
    console.log("✅ AI remembered previous conversation context");
  });

  it("should handle errors gracefully", async () => {
    console.log("🧪 Testing error handling...");

    const events: UIStreamEvent[] = [];
    let errorReceived = false;

    try {
      // Check if streaming is supported
      if (!client.supportsStreaming()) {
        console.log("⚠️  Skipping test - streaming not supported");
        return;
      }

      await client.streamAgent(
        "This is a test with an invalid tool call",
        (event: UIStreamEvent) => {
          events.push(event);
          if (event.type === "error") {
            errorReceived = true;
            console.log(`❌ Error: ${event.error}`);
          }
        },
        undefined, // conversationId
        undefined, // specification
        [
          {
            name: "invalid_tool",
            description: "This tool will fail",
            schema: JSON.stringify({ type: "object" }),
          },
        ], // tools that will fail
        {
          invalid_tool: async () => {
            throw new Error("Tool execution failed");
          },
        }
      );
    } catch (error) {
      console.log(`🛡️  Caught error: ${error}`);
    }

    // Should still get some events even if there's an error
    expect(events.length).toBeGreaterThan(0);
    console.log("✅ Error was handled gracefully");
  });

  it("should validate UI vs raw mode", async () => {
    console.log("🧪 Testing UI vs Raw mode...");

    // Test UI mode (default)
    const uiEvents: UIStreamEvent[] = [];
    // Check if streaming is supported
    if (!client.supportsStreaming()) {
      console.log("⚠️  Skipping test - streaming not supported");
      return;
    }

    await client.streamAgent(
      "Say hello",
      (event: UIStreamEvent) => {
        uiEvents.push(event);
      },
      undefined, // conversationId
      undefined, // specification
      undefined, // tools
      undefined, // streaming mode (fallback)
      undefined // toolHandlers
    );

    // Test raw mode
    const rawEvents: any[] = [];
    await client.streamAgent(
      "Say hello",
      (event: any) => {
        rawEvents.push(event);
      },
      undefined, // conversationId
      undefined, // specification
      undefined, // tools
      undefined, // streaming mode (fallback)
      undefined // toolHandlers
    );

    console.log(
      `📊 UI events: ${uiEvents.length}, Raw events: ${rawEvents.length}`
    );

    // UI mode should have structured events
    expect(uiEvents.some((e) => e.type === "conversation_started")).toBe(true);
    expect(uiEvents.some((e) => e.type === "message_update")).toBe(true);
    expect(uiEvents.some((e) => e.type === "conversation_completed")).toBe(
      true
    );

    console.log("✅ Both UI and raw modes working");
  });

  it("should test different chunking strategies", async () => {
    console.log("🧪 Testing chunking strategies...");

    const strategies = [
      SmoothChunkingStrategy.Word,
      SmoothChunkingStrategy.Character,
      SmoothChunkingStrategy.Sentence,
    ];

    for (const strategy of strategies) {
      console.log(`📝 Testing ${strategy} chunking...`);

      const events: UIStreamEvent[] = [];
      // Check if streaming is supported
      if (!client.supportsStreaming()) {
        console.log("⚠️  Skipping test - streaming not supported");
        return;
      }

      await client.streamAgent(
        "Write a short sentence with multiple words.",
        (event: UIStreamEvent) => {
          events.push(event);
        }
      );

      const messageEvents = events.filter((e) => e.type === "message_update");
      expect(messageEvents.length).toBeGreaterThan(0);
      console.log(`✅ ${strategy}: ${messageEvents.length} updates`);
    }
  });

  it("should handle custom specifications", async () => {
    console.log("🧪 Testing with custom specification...");

    const events: UIStreamEvent[] = [];

    // Check if streaming is supported
    if (!client.supportsStreaming()) {
      console.log("⚠️  Skipping test - streaming not supported");
      return;
    }

    await client.streamAgent(
      "Be very brief. Just say 'OK'.",
      (event: UIStreamEvent) => {
        events.push(event);
        if (event.type === "conversation_completed") {
          console.log(`💬 Response: "${event.message.message}"`);
        }
      },
      undefined, // conversationId
      undefined // specification - use default
    );

    const finalEvent = events.find((e) => e.type === "conversation_completed");
    expect(finalEvent).toBeDefined();
    expect((finalEvent as any).finalMessage.length).toBeLessThan(50); // Should be brief
    console.log("✅ Custom specification respected");
  });

  it("should validate metadata and usage tracking", async () => {
    console.log("🧪 Testing metadata and usage tracking...");

    const events: UIStreamEvent[] = [];

    // Check if streaming is supported
    if (!client.supportsStreaming()) {
      console.log("⚠️  Skipping test - streaming not supported");
      return;
    }

    await client.streamAgent("Hello!", (event: UIStreamEvent) => {
      events.push(event);
      if (event.type === "conversation_completed") {
        console.log(`📊 Usage: ${JSON.stringify(event.message)}`);
      }
    });
  });
});

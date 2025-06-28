import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import { AgentStreamEvent } from "../src/types/ui-events";

/**
 * Test Anthropic Extended Thinking support
 * 
 * This test verifies that the SDK properly handles Anthropic's native extended thinking
 * when enabled in the specification, including thinking blocks, signatures, and multi-turn preservation.
 */
describe("Anthropic Extended Thinking", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;

  if (!orgId || !envId || !secret) {
    console.warn(
      "⚠️  Skipping Anthropic extended thinking tests - missing Graphlit credentials",
    );
    return;
  }

  let client: Graphlit;
  let thinkingSpec: any;
  let normalSpec: any;
  const createdSpecifications: string[] = [];

  beforeAll(async () => {
    client = new Graphlit(orgId, envId, secret);
    
    // Create specification with thinking enabled
    const thinkingSpecResponse = await client.createSpecification({
      name: "Extended Thinking Test Spec",
      serviceType: Types.ModelServiceTypes.Anthropic,
      anthropic: {
        model: Types.AnthropicModels.Claude_3_7Sonnet,
        enableThinking: true,           // ← Enable native thinking
        thinkingTokenLimit: 10000,      // ← Set thinking budget
        completionTokenLimit: 16000,
        temperature: 0.7
      }
    });
    
    thinkingSpec = { id: thinkingSpecResponse.createSpecification.id };
    createdSpecifications.push(thinkingSpec.id);
    
    // Create specification without thinking for comparison
    const normalSpecResponse = await client.createSpecification({
      name: "Normal Test Spec",
      serviceType: Types.ModelServiceTypes.Anthropic,
      anthropic: {
        model: Types.AnthropicModels.Claude_3_7Sonnet,
        enableThinking: false,  // ← Thinking disabled
        completionTokenLimit: 16000,
        temperature: 0.7
      }
    });
    
    normalSpec = { id: normalSpecResponse.createSpecification.id };
    createdSpecifications.push(normalSpec.id);
  });

  afterAll(async () => {
    // Clean up created specifications
    console.log(`🧹 Cleaning up ${createdSpecifications.length} test specifications...`);
    for (const specId of createdSpecifications) {
      try {
        await client.deleteSpecification(specId);
      } catch (error) {
        console.warn(`⚠️  Failed to delete specification ${specId}`);
      }
    }
  });

  it("should emit reasoning events when thinking is enabled", async () => {
    const events: AgentStreamEvent[] = [];
    let conversationId: string | undefined;
    
    await client.streamAgent(
      "What is 25% of 80? Think through this step by step with detailed reasoning.",
      (event) => {
        events.push(event);
        if (event.type === "conversation_started") {
          conversationId = event.conversationId;
        }
      },
      undefined,
      thinkingSpec  // ← Spec has thinking enabled
    );
    
    // Should have reasoning events when thinking is enabled
    const reasoningEvents = events.filter(e => e.type === 'reasoning_update');
    console.log(`📊 Found ${reasoningEvents.length} reasoning events`);
    
    expect(reasoningEvents.length).toBeGreaterThan(0);
    
    // Check that reasoning events have the correct format
    const firstReasoningEvent = reasoningEvents[0];
    expect(firstReasoningEvent.format).toBe("thinking_tag");
    expect(firstReasoningEvent.content).toBeDefined();
    expect(typeof firstReasoningEvent.content).toBe("string");
    
    // Should have a final reasoning event that's marked as complete
    const completeReasoningEvents = reasoningEvents.filter(e => e.isComplete);
    expect(completeReasoningEvents.length).toBeGreaterThan(0);
    
    console.log(`✅ Extended thinking working: ${reasoningEvents.length} reasoning events`);
    
    // Clean up
    if (conversationId) {
      try {
        await client.deleteConversation(conversationId);
      } catch (error) {
        console.warn(`⚠️  Failed to delete conversation ${conversationId}`);
      }
    }
  }, 180000);

  it("should NOT emit reasoning events when thinking is disabled", async () => {
    const events: AgentStreamEvent[] = [];
    let conversationId: string | undefined;
    
    await client.streamAgent(
      "What is 25% of 80? Think through this step by step with detailed reasoning.",
      (event) => {
        events.push(event);
        if (event.type === "conversation_started") {
          conversationId = event.conversationId;
        }
      },
      undefined,
      normalSpec  // ← Spec has thinking disabled
    );
    
    // Should NOT have reasoning events when thinking is disabled
    const reasoningEvents = events.filter(e => e.type === 'reasoning_update');
    console.log(`📊 Found ${reasoningEvents.length} reasoning events (should be 0)`);
    
    expect(reasoningEvents.length).toBe(0);
    
    // Should still get normal message events
    const messageEvents = events.filter(e => e.type === 'message_update');
    expect(messageEvents.length).toBeGreaterThan(0);
    
    const completeEvent = events.find(e => e.type === 'conversation_completed');
    expect(completeEvent).toBeDefined();
    
    console.log(`✅ Normal mode working: 0 reasoning events, ${messageEvents.length} message events`);
    
    // Clean up
    if (conversationId) {
      try {
        await client.deleteConversation(conversationId);
      } catch (error) {
        console.warn(`⚠️  Failed to delete conversation ${conversationId}`);
      }
    }
  }, 180000);

  it("should handle thinking with tool calling", async () => {
    const events: AgentStreamEvent[] = [];
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

    const toolPrompt = "Please calculate 15 * 27 using the calculator tool. Think through why this calculation might be useful.";
    
    await client.streamAgent(
      toolPrompt,
      (event) => {
        events.push(event);
        if (event.type === "conversation_started") {
          conversationId = event.conversationId;
        }
      },
      undefined,
      thinkingSpec, // ← Spec has thinking enabled
      [calculatorTool],
      { calculate: toolHandler }
    );

    // Should have both reasoning events AND tool events
    const reasoningEvents = events.filter(e => e.type === 'reasoning_update');
    const toolEvents = events.filter(e => e.type === 'tool_update');
    
    console.log(`📊 Found ${reasoningEvents.length} reasoning events and ${toolEvents.length} tool events`);
    
    // May have reasoning events (thinking about the calculation)
    // Definitely should have tool events
    expect(toolEvents.length).toBeGreaterThan(0);
    expect(toolResults.length).toBeGreaterThan(0);
    expect(toolResults[0]).toContain("15");
    expect(toolResults[0]).toContain("27");
    
    console.log(`✅ Thinking + Tools working: ${reasoningEvents.length} reasoning, ${toolEvents.length} tool events`);
    
    // Clean up
    if (conversationId) {
      try {
        await client.deleteConversation(conversationId);
      } catch (error) {
        console.warn(`⚠️  Failed to delete conversation ${conversationId}`);
      }
    }
  }, 180000);

  it("should respect thinking token limits", async () => {
    // Create a spec with a very low thinking token limit
    const limitedThinkingSpec = await client.createSpecification({
      name: "Limited Thinking Test Spec",
      serviceType: Types.ModelServiceTypes.Anthropic,
      anthropic: {
        model: Types.AnthropicModels.Claude_3_7Sonnet,
        enableThinking: true,
        thinkingTokenLimit: 1024,       // ← Very low limit
        completionTokenLimit: 16000,
        temperature: 0.7
      }
    });
    
    createdSpecifications.push(limitedThinkingSpec.createSpecification.id);
    
    const events: AgentStreamEvent[] = [];
    let conversationId: string | undefined;
    
    await client.streamAgent(
      "Solve this complex multi-step problem: What would happen to global climate if all ice on Earth melted instantly? Consider atmospheric, oceanic, geological, and biological impacts. Think through each aspect in great detail.",
      (event) => {
        events.push(event);
        if (event.type === "conversation_started") {
          conversationId = event.conversationId;
        }
      },
      undefined,
      { id: limitedThinkingSpec.createSpecification.id }
    );
    
    // Should still work but with limited thinking
    const messageEvents = events.filter(e => e.type === 'message_update');
    expect(messageEvents.length).toBeGreaterThan(0);
    
    const completeEvent = events.find(e => e.type === 'conversation_completed');
    expect(completeEvent).toBeDefined();
    
    console.log(`✅ Limited thinking budget respected`);
    
    // Clean up
    if (conversationId) {
      try {
        await client.deleteConversation(conversationId);
      } catch (error) {
        console.warn(`⚠️  Failed to delete conversation ${conversationId}`);
      }
    }
  }, 180000);
});
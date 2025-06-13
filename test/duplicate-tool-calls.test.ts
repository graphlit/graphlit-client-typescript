import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Graphlit } from "../src/client.js";
import * as Types from "../src/generated/graphql-types.js";
import { AgentStreamEvent } from "../src/types/ui-events.js";

describe("Duplicate Tool Calls Investigation", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;

  if (!orgId || !envId || !secret) {
    console.warn(
      "⚠️  Skipping duplicate tool calls tests - missing Graphlit credentials",
    );
    return;
  }

  let client: Graphlit;
  let specId: string;
  let conversationId: string;
  const capturedToolCalls: Array<{
    id: string;
    name: string;
    parameters: string;
    status: string;
    response: any;
    timestamp: number;
  }> = [];
  const toolHandlerCalls: Array<{
    id: string;
    timestamp: number;
    args: any;
    result?: any;
    error?: string;
  }> = [];

  beforeAll(async () => {
    client = new Graphlit(orgId, envId, secret);

    // Create a specification with web search capability
    const specResult = await client.createSpecification({
      name: `Duplicate Tool Call Test Spec ${Date.now()}`,
      type: Types.SpecificationTypes.Extraction,
      serviceType: Types.ModelServiceTypes.Anthropic,
      anthropic: {
        model: Types.AnthropicModels.Claude_3_5Sonnet,
        temperature: 0.7,
        completionTokenLimit: 2048,
      },
    });

    if (!specResult.createSpecification?.id) {
      throw new Error("Failed to create specification");
    }

    specId = specResult.createSpecification.id;
  });

  afterAll(async () => {
    // Delete conversation first, then specification
    if (conversationId) {
      try {
        await client.deleteConversation(conversationId);
        console.log("✅ Deleted test conversation");
      } catch (error) {
        console.warn(`⚠️  Failed to delete conversation ${conversationId}`);
      }
    }

    if (specId) {
      try {
        await client.deleteSpecification(specId);
        console.log("✅ Deleted test specification");
      } catch (error) {
        console.warn(`⚠️  Failed to delete specification ${specId}`);
      }
    }
  });

  it("should investigate duplicate webSearch tool calls", async () => {
    const tools: Types.ToolDefinitionInput[] = [
      {
        name: "webSearch",
        description: "Search the web for current information",
        schema: JSON.stringify({
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search query to find relevant information",
            },
            limit: {
              type: "number",
              description: "Maximum number of results to return",
              default: 5,
            },
          },
          required: ["query"],
        }),
      },
    ];

    // Mock web search results to simulate real behavior
    const mockWebSearchResults = {
      content: [
        {
          type: "text",
          text: "Connor McDavid has been exceptional in the 2025 playoffs, leading the Edmonton Oilers with outstanding performance...",
          title: "Connor McDavid Playoff Performance 2025",
          uri: "https://example.com/mcdavid-playoffs-2025",
          score: 0.95,
          __typename: "WebSearchResult",
        },
      ],
    };

    const toolHandlers = {
      webSearch: async (args: any) => {
        const callId = `handler-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const timestamp = Date.now();

        console.log(`🔍 [WebSearch Handler] Called with ID: ${callId}`);
        console.log(
          `🔍 [WebSearch Handler] Args:`,
          JSON.stringify(args, null, 2),
        );
        console.log(`🔍 [WebSearch Handler] Timestamp: ${timestamp}`);

        // Track this handler call
        const handlerCall: {
          id: string;
          timestamp: number;
          args: any;
          result?: any;
          error?: string;
        } = {
          id: callId,
          timestamp,
          args,
        };

        try {
          // Simulate a small delay like a real web search
          await new Promise((resolve) => setTimeout(resolve, 100));

          const result = mockWebSearchResults;
          handlerCall.result = result;
          toolHandlerCalls.push(handlerCall);

          console.log(
            `✅ [WebSearch Handler] ${callId} completed with ${result.content.length} results`,
          );
          return result;
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : "Unknown error";
          handlerCall.error = errorMsg;
          toolHandlerCalls.push(handlerCall);

          console.error(`❌ [WebSearch Handler] ${callId} failed:`, error);
          throw error;
        }
      },
    };

    const streamEvents: AgentStreamEvent[] = [];
    let roundCount = 0;

    await client.streamAgent(
      "how about connor mcdavid in the playoffs, right?",
      (event) => {
        streamEvents.push(event);

        // Log all events for debugging
        console.log(`📡 [Stream Event] ${event.type}`);

        // Capture conversation ID
        if (event.type === "conversation_started") {
          conversationId = event.conversationId;
          console.log(`🆔 [Conversation] Started: ${conversationId}`);
        }

        // Track tool call events
        if (event.type === "tool_update") {
          console.log(
            `🔧 [Tool Update] ${event.toolCall.name} (${event.toolCall.id}) - Status: ${event.status}`,
          );
          console.log(
            `🔧 [Tool Update] Arguments: ${event.toolCall.arguments}`,
          );
          if (event.result) {
            console.log(`🔧 [Tool Update] Has result: ${typeof event.result}`);
          }
          if (event.error) {
            console.log(`🔧 [Tool Update] Error: ${event.error}`);
          }
        }

        // Capture final tool calls from completed conversations
        if (
          event.type === "conversation_completed" &&
          event.message.toolCalls
        ) {
          roundCount++;
          console.log(
            `\n📊 [Round ${roundCount}] Found ${event.message.toolCalls.length} tool calls:`,
          );

          event.message.toolCalls.forEach((tc, idx) => {
            const toolCall = {
              id: tc.id,
              name: tc.name,
              parameters: tc.arguments || "{}",
              status: "complete", // from conversation_completed event
              response: null, // We need to track this from tool_update events
              timestamp: Date.now(),
            };

            capturedToolCalls.push(toolCall);

            console.log(`  ${idx + 1}. ID: ${tc.id}`);
            console.log(`     Name: ${tc.name}`);
            console.log(`     Args: ${tc.arguments}`);
            console.log(`     Args Length: ${tc.arguments?.length || 0}`);
          });
        }
      },
      undefined, // conversationId
      { id: specId },
      tools,
      toolHandlers,
      {
        maxToolRounds: 2,
        smoothingEnabled: false,
      },
    );

    // Analysis
    console.log(`\n🔍 ANALYSIS:`);
    console.log(`📊 Total tool handler calls: ${toolHandlerCalls.length}`);
    console.log(`📊 Total captured tool calls: ${capturedToolCalls.length}`);
    console.log(`📊 Total stream events: ${streamEvents.length}`);

    // Check for duplicate tool calls
    const toolCallsByQuery = new Map<string, typeof capturedToolCalls>();
    capturedToolCalls.forEach((tc) => {
      try {
        const params = JSON.parse(tc.parameters);
        const query = params.query || "unknown";
        if (!toolCallsByQuery.has(query)) {
          toolCallsByQuery.set(query, []);
        }
        toolCallsByQuery.get(query)!.push(tc);
      } catch (e) {
        console.warn(
          `⚠️  Failed to parse tool call parameters: ${tc.parameters}`,
        );
      }
    });

    console.log(`\n🔍 DUPLICATE ANALYSIS:`);
    toolCallsByQuery.forEach((calls, query) => {
      if (calls.length > 1) {
        console.log(`❗ Found ${calls.length} calls for query: "${query}"`);
        calls.forEach((call, idx) => {
          console.log(
            `  ${idx + 1}. ID: ${call.id} | Response: ${call.response ? "YES" : "NO"}`,
          );
        });
      } else {
        console.log(`✅ Single call for query: "${query}"`);
      }
    });

    console.log(`\n🔍 HANDLER CALL ANALYSIS:`);
    toolHandlerCalls.forEach((call, idx) => {
      console.log(
        `  ${idx + 1}. ID: ${call.id} | Args: ${JSON.stringify(call.args)} | Result: ${call.result ? "YES" : "NO"} | Error: ${call.error || "NO"}`,
      );
    });

    // Look for tool_update events with results
    const toolUpdateEvents = streamEvents.filter(
      (e) => e.type === "tool_update",
    ) as any[];
    console.log(`\n🔍 TOOL UPDATE EVENTS: ${toolUpdateEvents.length}`);
    toolUpdateEvents.forEach((event, idx) => {
      console.log(
        `  ${idx + 1}. ID: ${event.toolCall.id} | Status: ${event.status} | Has Result: ${!!event.result} | Has Error: ${!!event.error}`,
      );
    });

    // Assertions
    expect(capturedToolCalls.length).toBeGreaterThan(0);

    // Check if we have the problematic pattern
    const duplicateQueries = Array.from(toolCallsByQuery.entries()).filter(
      ([query, calls]) => calls.length > 1,
    );

    if (duplicateQueries.length > 0) {
      console.log(
        `\n❗ FOUND DUPLICATE TOOL CALLS - This reproduces the issue!`,
      );
      duplicateQueries.forEach(([query, calls]) => {
        console.log(`Query: "${query}" has ${calls.length} calls`);

        // Check if one has response and one doesn't
        const withResponse = calls.filter((c) => c.response);
        const withoutResponse = calls.filter((c) => !c.response);

        if (withResponse.length > 0 && withoutResponse.length > 0) {
          console.log(
            `  ⚠️  PATTERN DETECTED: ${withResponse.length} with response, ${withoutResponse.length} without`,
          );
        }
      });
    } else {
      console.log(`\n✅ No duplicate tool calls found`);
    }

    // Verify tool handler was called the expected number of times
    console.log(`\n🔍 EXPECTED vs ACTUAL:`);
    console.log(`Expected handler calls: ${capturedToolCalls.length}`);
    console.log(`Actual handler calls: ${toolHandlerCalls.length}`);

    if (toolHandlerCalls.length !== capturedToolCalls.length) {
      console.log(
        `❗ MISMATCH: Handler calls (${toolHandlerCalls.length}) != Tool calls (${capturedToolCalls.length})`,
      );
    }
  }, 60000);
});

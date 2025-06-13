import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Graphlit } from "../src/client.js";
import * as Types from "../src/generated/graphql-types.js";
import { AgentStreamEvent } from "../src/types/ui-events.js";

describe("Tool Response Null Investigation", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;

  if (!orgId || !envId || !secret) {
    console.warn(
      "⚠️  Skipping tool response null tests - missing Graphlit credentials",
    );
    return;
  }

  let client: Graphlit;
  let specId: string;
  let conversationId: string;

  beforeAll(async () => {
    client = new Graphlit(orgId, envId, secret);

    // Create a specification
    const specResult = await client.createSpecification({
      name: `Tool Response Null Test ${Date.now()}`,
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
    if (conversationId) {
      try {
        await client.deleteConversation(conversationId);
      } catch (error) {
        console.warn(`Failed to delete conversation ${conversationId}`);
      }
    }

    if (specId) {
      try {
        await client.deleteSpecification(specId);
      } catch (error) {
        console.warn(`Failed to delete specification ${specId}`);
      }
    }
  });

  it("should investigate why tool response is null", async () => {
    // Define webSearch tool with limit parameter
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

    // Track all handler calls and their lifecycle
    const handlerCalls: Array<{
      callId: string;
      timestamp: number;
      args: any;
      startTime: number;
      endTime?: number;
      duration?: number;
      result?: any;
      error?: any;
      returned?: boolean;
    }> = [];

    // Track all tool-related events
    const toolEvents: Array<{
      type: string;
      timestamp: number;
      toolCallId?: string;
      status?: string;
      hasResult?: boolean;
      hasError?: boolean;
      details?: any;
    }> = [];

    const toolHandlers = {
      webSearch: async (args: any) => {
        const callId = `handler-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const startTime = Date.now();

        const handlerCall: {
          callId: string;
          timestamp: number;
          args: any;
          startTime: number;
          endTime?: number;
          duration?: number;
          result?: any;
          error?: any;
          returned: boolean;
        } = {
          callId,
          timestamp: startTime,
          args,
          startTime,
          returned: false,
        };

        handlerCalls.push(handlerCall);

        console.log(`\n🔍 [WebSearch Handler] STARTED`);
        console.log(`   Call ID: ${callId}`);
        console.log(`   Args: ${JSON.stringify(args, null, 2)}`);
        console.log(`   Timestamp: ${new Date(startTime).toISOString()}`);

        try {
          // Validate arguments
          if (!args.query) {
            throw new Error("Missing required parameter: query");
          }

          console.log(`   Query: "${args.query}"`);
          console.log(
            `   Limit: ${args.limit || "not specified (using default)"}`,
          );

          // Simulate web search with delay
          await new Promise((resolve) => setTimeout(resolve, 200));

          // Mock results
          const mockResults = {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  [
                    {
                      uri: "https://example.com/mcdavid-playoffs-2025",
                      text: `Connor McDavid 2025 playoffs performance with limit ${args.limit || 5}...`,
                      title: "McDavid Playoff Stats 2025",
                      score: 0.95,
                      __typename: "WebSearchResult",
                    },
                  ],
                  null,
                  2,
                ),
              },
            ],
          };

          const endTime = Date.now();
          handlerCall.endTime = endTime;
          handlerCall.duration = endTime - startTime;
          handlerCall.result = mockResults;
          handlerCall.returned = true;

          console.log(`✅ [WebSearch Handler] SUCCESS`);
          console.log(`   Duration: ${handlerCall.duration}ms`);
          console.log(`   Result type: ${typeof mockResults}`);
          console.log(`   Result content items: ${mockResults.content.length}`);
          console.log(`   Returning result...`);

          return mockResults;
        } catch (error) {
          const endTime = Date.now();
          handlerCall.endTime = endTime;
          handlerCall.duration = endTime - startTime;
          handlerCall.error = error;
          handlerCall.returned = true;

          console.error(`❌ [WebSearch Handler] ERROR`);
          console.error(`   Duration: ${handlerCall.duration}ms`);
          console.error(`   Error:`, error);
          console.error(`   Throwing error...`);

          throw error;
        }
      },
    };

    // Capture all events
    const allEvents: AgentStreamEvent[] = [];

    console.log("\n🚀 Starting streamAgent...");

    await client.streamAgent(
      "Search for Connor McDavid's performance in the 2025 NHL playoffs, limit to 5 results",
      (event) => {
        allEvents.push(event);

        const timestamp = Date.now();

        // Log basic event
        console.log(`\n📡 [Event ${allEvents.length}] ${event.type}`);

        if (event.type === "conversation_started") {
          conversationId = event.conversationId;
          console.log(`   Conversation ID: ${conversationId}`);
        }

        // Track tool events in detail
        if (event.type === "tool_update") {
          const toolEvent = {
            type: event.type,
            timestamp,
            toolCallId: event.toolCall.id,
            status: event.status,
            hasResult: !!event.result,
            hasError: !!event.error,
            details: {
              toolName: event.toolCall.name,
              arguments: event.toolCall.arguments,
              status: event.status,
              result: event.result,
              error: event.error,
            },
          };

          toolEvents.push(toolEvent);

          console.log(`   Tool: ${event.toolCall.name} (${event.toolCall.id})`);
          console.log(`   Status: ${event.status}`);
          console.log(`   Arguments: ${event.toolCall.arguments}`);
          console.log(`   Has Result: ${toolEvent.hasResult}`);
          console.log(`   Has Error: ${toolEvent.hasError}`);

          if (event.result) {
            console.log(`   Result Type: ${typeof event.result}`);
            console.log(
              `   Result: ${JSON.stringify(event.result).substring(0, 100)}...`,
            );
          }

          if (event.error) {
            console.log(`   Error: ${event.error}`);
          }
        }

        if (event.type === "conversation_completed") {
          console.log(
            `   Message length: ${event.message.message?.length || 0}`,
          );
          console.log(`   Tool calls: ${event.message.toolCalls?.length || 0}`);

          if (event.message.toolCalls) {
            event.message.toolCalls.forEach((tc, idx) => {
              console.log(`\n   Tool Call ${idx + 1}:`);
              console.log(`     ID: ${tc.id}`);
              console.log(`     Name: ${tc.name}`);
              console.log(`     Arguments: ${tc.arguments}`);
            });
          }
        }
      },
      undefined,
      { id: specId },
      tools,
      toolHandlers,
      {
        maxToolRounds: 1,
        smoothingEnabled: false,
      },
    );

    // Analysis
    console.log("\n\n📊 ANALYSIS RESULTS:");
    console.log("=".repeat(80));

    console.log("\n🔧 Tool Handler Calls:");
    console.log(`Total calls: ${handlerCalls.length}`);
    handlerCalls.forEach((call, idx) => {
      console.log(`\n${idx + 1}. Handler Call:`);
      console.log(`   Call ID: ${call.callId}`);
      console.log(`   Args: ${JSON.stringify(call.args)}`);
      console.log(`   Duration: ${call.duration || "N/A"}ms`);
      console.log(`   Returned: ${call.returned ? "YES" : "NO"}`);
      console.log(`   Has Result: ${!!call.result}`);
      console.log(`   Has Error: ${!!call.error}`);
    });

    console.log("\n📡 Tool Events:");
    console.log(`Total events: ${toolEvents.length}`);
    toolEvents.forEach((event, idx) => {
      console.log(`\n${idx + 1}. Tool Event:`);
      console.log(`   Type: ${event.type}`);
      console.log(`   Tool Call ID: ${event.toolCallId}`);
      console.log(`   Status: ${event.status}`);
      console.log(`   Has Result: ${event.hasResult}`);
      console.log(`   Has Error: ${event.hasError}`);
    });

    // Check for the null response pattern
    console.log("\n🔍 NULL RESPONSE ANALYSIS:");

    const completedToolUpdates = toolEvents.filter(
      (e) => e.type === "tool_update" && e.status === "completed",
    );

    console.log(`Completed tool updates: ${completedToolUpdates.length}`);

    completedToolUpdates.forEach((event, idx) => {
      console.log(`\n${idx + 1}. Completed Tool Update:`);
      console.log(`   Tool Call ID: ${event.toolCallId}`);
      console.log(`   Has Result: ${event.hasResult}`);

      if (!event.hasResult) {
        console.log(`   ⚠️  NULL RESPONSE DETECTED!`);

        // Find corresponding handler call
        const handlerCall = handlerCalls.find(
          (call) =>
            // Match by timing or other criteria
            Math.abs(call.timestamp - event.timestamp) < 1000,
        );

        if (handlerCall) {
          console.log(`   Matching handler call found:`);
          console.log(`     Handler returned: ${handlerCall.returned}`);
          console.log(`     Handler had result: ${!!handlerCall.result}`);
          console.log(`     Handler had error: ${!!handlerCall.error}`);
        } else {
          console.log(`   ❌ No matching handler call found!`);
        }
      }
    });

    // Check timing patterns
    console.log("\n⏱️ TIMING ANALYSIS:");
    if (handlerCalls.length > 0 && toolEvents.length > 0) {
      const firstHandlerCall = handlerCalls[0].timestamp;
      const firstToolEvent = toolEvents[0].timestamp;
      console.log(
        `First handler call: ${new Date(firstHandlerCall).toISOString()}`,
      );
      console.log(
        `First tool event: ${new Date(firstToolEvent).toISOString()}`,
      );
      console.log(
        `Time difference: ${Math.abs(firstToolEvent - firstHandlerCall)}ms`,
      );
    }

    // Assertions
    expect(handlerCalls.length).toBeGreaterThan(0);

    // Check if handler returned but response is null
    const handlersWithResults = handlerCalls.filter(
      (c) => c.result && c.returned,
    );
    const toolUpdatesWithNullResponse = completedToolUpdates.filter(
      (e) => !e.hasResult,
    );

    if (
      handlersWithResults.length > 0 &&
      toolUpdatesWithNullResponse.length > 0
    ) {
      console.log("\n❗ ISSUE REPRODUCED:");
      console.log(`   ${handlersWithResults.length} handlers returned results`);
      console.log(
        `   ${toolUpdatesWithNullResponse.length} tool updates have null response`,
      );
      console.log(
        `   This indicates the result is being lost between handler and client!`,
      );
    }
  }, 60000);
});

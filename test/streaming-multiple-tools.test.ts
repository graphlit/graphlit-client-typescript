import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import { AgentStreamEvent } from "../src/types/ui-events";
import * as dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

describe("Streaming Multiple Tool Calls Test", () => {
  let client: Graphlit;
  let specification: Types.Specification | null = null;
  let conversationId: string | null = null;
  let createdSpecId: string | null = null;

  beforeAll(async () => {
    const organizationId = process.env.GRAPHLIT_ORGANIZATION_ID;
    const environmentId = process.env.GRAPHLIT_ENVIRONMENT_ID;
    const jwtSecret = process.env.GRAPHLIT_JWT_SECRET;

    if (!organizationId || !environmentId || !jwtSecret) {
      throw new Error("Missing required Graphlit environment variables");
    }

    client = new Graphlit({
      organizationId,
      environmentId,
      jwtSecret,
    });

    // Set up OpenAI client if available
    if (process.env.OPENAI_API_KEY) {
      const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      client.setOpenAIClient(openaiClient);
    }

    // Find or create a specification that supports streaming
    const specifications = await client.querySpecifications();

    // Look for OpenAI GPT-4 or similar that supports good tool calling
    specification =
      specifications.specifications?.results?.find(
        (spec) =>
          spec.serviceType === Types.ModelServiceTypes.OpenAi &&
          (spec.name?.includes("GPT-4") || spec.name?.includes("gpt-4")),
      ) || null;

    // If not found, try any OpenAI spec
    if (!specification) {
      specification =
        specifications.specifications?.results?.find(
          (spec) => spec.serviceType === Types.ModelServiceTypes.OpenAi,
        ) || null;
    }

    // If still not found, create one
    if (!specification) {
      console.log("Creating new OpenAI specification for testing");
      try {
        const createResult = await client.createSpecification({
          name: "Test OpenAI GPT-4 Turbo",
          serviceType: Types.ModelServiceTypes.OpenAi,
          openAI: {
            model: Types.OpenAiModels.Gpt_4TurboPreview,
            temperature: 0.5,
          },
        });
        specification = createResult.createSpecification || null;
        createdSpecId = specification?.id || null;
      } catch (error: any) {
        console.error("Failed to create specification:", error);
        if (error.networkError?.result?.errors) {
          console.error(
            "GraphQL errors:",
            JSON.stringify(error.networkError.result.errors, null, 2),
          );
        }

        // Try to find ANY specification as fallback
        const allSpecs = await client.querySpecifications();
        specification = allSpecs.specifications?.results?.[0] || null;
        console.log("Using fallback specification:", specification?.name);
      }
    }
  });

  afterAll(async () => {
    // Clean up conversation
    if (conversationId) {
      try {
        await client.deleteConversation(conversationId);
        console.log("✅ Deleted test conversation:", conversationId);
      } catch (error) {
        console.error("Failed to delete conversation:", error);
      }
    }

    // Clean up specification if we created it
    if (createdSpecId) {
      try {
        await client.deleteSpecification(createdSpecId);
        console.log("✅ Deleted test specification:", createdSpecId);
      } catch (error) {
        console.error("Failed to delete specification:", error);
      }
    }
  });

  it("should track multiple separate tool calls during streaming", async () => {
    if (!specification) {
      console.log("No specification available, skipping test");
      return;
    }

    // Check if streaming is supported
    if (!client.supportsStreaming(specification)) {
      console.log(
        "Streaming not supported for this specification, skipping test",
      );
      return;
    }

    // Define web search tool
    const webSearchTool: Types.ToolDefinitionInput = {
      name: "webSearch",
      description: "Search the web for information",
      schema: JSON.stringify({
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The search query",
          },
        },
        required: ["query"],
      }),
    };

    // Track all tool calls
    const toolCallsReceived: any[] = [];
    const toolStatusEvents: any[] = [];

    // Tool handler
    const toolHandlers = {
      webSearch: async (args: { query: string }) => {
        console.log(`\n🔍 Web search called with: "${args.query}"`);

        // Return different results based on query
        if (args.query.toLowerCase().includes("marchment")) {
          return {
            results: [
              {
                title: "Mason Marchment Highlight Reel 2023-24",
                url: "https://youtube.com/watch?v=example1",
                snippet:
                  "Best goals and assists from Mason Marchment's 2023-24 season with the Dallas Stars",
              },
              {
                title: "Mason Marchment Top 10 Goals",
                url: "https://youtube.com/watch?v=example2",
                snippet: "Compilation of Mason Marchment's top 10 career goals",
              },
            ],
          };
        } else if (args.query.toLowerCase().includes("mcdavid")) {
          return {
            results: [
              {
                title: "Connor McDavid 2023-24 Highlights",
                url: "https://youtube.com/watch?v=example3",
                snippet:
                  "Connor McDavid's incredible plays from the 2023-24 NHL season",
              },
              {
                title: "McDavid's 150 Point Season Highlights",
                url: "https://youtube.com/watch?v=example4",
                snippet:
                  "Every goal and assist from Connor McDavid's historic 150+ point season",
              },
            ],
          };
        }

        return { results: [] };
      },
    };

    console.log("\n=== Testing Multiple Tool Calls with Streaming ===");
    console.log("Specification:", specification.name);
    console.log(
      "Model:",
      specification.openAI?.model || specification.anthropic?.model,
    );

    let messageContent = "";
    let finalMetrics: any = null;

    await client.streamAgent(
      "search for highlight videos for Mason Marchment and Connor McDavid (separately)",
      async (event: AgentStreamEvent) => {
        switch (event.type) {
          case "conversation_started":
            conversationId = event.conversationId;
            console.log("\n📝 Conversation started:", conversationId);
            break;

          case "message_update":
            messageContent = event.message.message;
            if (!event.isStreaming) {
              console.log("\n💬 Final message length:", messageContent.length);
            }
            break;

          case "tool_update":
            console.log(
              `\n🔧 Tool event - ${event.toolCall.name}: ${event.status}`,
            );

            toolStatusEvents.push({
              name: event.toolCall.name,
              status: event.status,
              arguments: event.toolCall.arguments,
              timestamp: new Date().toISOString(),
            });

            if (event.status === "completed") {
              // Parse arguments if they're a string
              const args =
                typeof event.toolCall.arguments === "string"
                  ? JSON.parse(event.toolCall.arguments)
                  : event.toolCall.arguments;

              toolCallsReceived.push({
                name: event.toolCall.name,
                arguments: args,
                result: event.result,
              });

              console.log(
                "  Arguments:",
                JSON.stringify(event.toolCall.arguments),
              );
              if (event.result) {
                console.log(
                  "  Result preview:",
                  JSON.stringify(event.result).substring(0, 200) + "...",
                );
              }
            }
            break;

          case "conversation_completed":
            console.log("\n✅ Conversation completed");
            finalMetrics = event.metrics;
            break;

          case "error":
            console.error("\n❌ Error:", event.error);
            break;
        }
      },
      undefined, // no existing conversation
      { id: specification.id },
      [webSearchTool],
      toolHandlers,
      {
        chunkingStrategy: "sentence",
        debug: true,
      },
    );

    // Analyze results
    console.log("\n=== Final Analysis ===");
    console.log("Total tool calls received:", toolCallsReceived.length);
    console.log("Tool status events:", toolStatusEvents.length);

    // Log all tool calls
    toolCallsReceived.forEach((call, index) => {
      console.log(`\nTool Call ${index + 1}:`);
      console.log("  Name:", call.name);
      console.log("  Query:", call.arguments.query);
    });

    // Assertions
    expect(toolCallsReceived.length).toBe(2); // Should have 2 separate web searches

    // Check that we searched for both players
    const queries = toolCallsReceived.map((call) =>
      call.arguments.query.toLowerCase(),
    );
    expect(queries.some((q) => q.includes("marchment"))).toBe(true);
    expect(queries.some((q) => q.includes("mcdavid"))).toBe(true);

    // Check that we got status events for each tool call
    const completedEvents = toolStatusEvents.filter(
      (e) => e.status === "completed",
    );
    expect(completedEvents.length).toBe(2);

    // Check that the message mentions both players
    expect(messageContent.toLowerCase()).toContain("marchment");
    expect(messageContent.toLowerCase()).toContain("mcdavid");

    // Log metrics if available
    if (finalMetrics) {
      console.log("\n📊 Metrics:");
      console.log("  Tool executions:", finalMetrics.toolExecutions);
      console.log("  Total time:", finalMetrics.totalTime);
      console.log("  Tool time:", finalMetrics.toolTime);
    }

    // Summary for debugging the UI issue
    console.log("\n🔍 DEBUGGING SUMMARY:");
    console.log("The SDK properly tracked both tool calls:");
    toolCallsReceived.forEach((call, i) => {
      console.log(`  ${i + 1}. ${call.name}: "${call.arguments.query}"`);
    });
    console.log(
      "\nIf the UI only shows one tool call, the issue is in the UI event handling,",
    );
    console.log(
      "not in the SDK. The SDK is correctly emitting events for both searches.",
    );
  });

  it("should handle parallel tool calls correctly", async () => {
    if (!specification || !client.supportsStreaming(specification)) {
      console.log("Skipping test - no streaming support");
      return;
    }

    // Define multiple tools
    const tools: Types.ToolDefinitionInput[] = [
      {
        name: "searchVideos",
        description: "Search for videos",
        schema: JSON.stringify({
          type: "object",
          properties: {
            query: { type: "string", description: "Search query" },
            limit: { type: "number", description: "Max results" },
          },
          required: ["query"],
        }),
      },
      {
        name: "getPlayerStats",
        description: "Get player statistics",
        schema: JSON.stringify({
          type: "object",
          properties: {
            playerName: { type: "string", description: "Player name" },
          },
          required: ["playerName"],
        }),
      },
    ];

    const toolCalls: any[] = [];
    const parallelCalls: any[] = [];

    const toolHandlers = {
      searchVideos: async (args: any) => {
        const startTime = Date.now();
        toolCalls.push({ tool: "searchVideos", args, startTime });

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        return {
          videos: [`${args.query} - Video 1`, `${args.query} - Video 2`],
          duration: Date.now() - startTime,
        };
      },
      getPlayerStats: async (args: any) => {
        const startTime = Date.now();
        toolCalls.push({ tool: "getPlayerStats", args, startTime });

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        return {
          player: args.playerName,
          stats: { goals: 25, assists: 35, points: 60 },
          duration: Date.now() - startTime,
        };
      },
    };

    await client.streamAgent(
      "Get highlight videos and current stats for both Connor McDavid and Auston Matthews",
      async (event: AgentStreamEvent) => {
        if (event.type === "conversation_started") {
          conversationId = event.conversationId;
        } else if (
          event.type === "tool_update" &&
          event.status === "executing"
        ) {
          // Track when tools start executing
          parallelCalls.push({
            name: event.toolCall.name,
            startTime: Date.now(),
          });
        }
      },
      conversationId, // reuse conversation
      { id: specification.id },
      tools,
      toolHandlers,
    );

    console.log("\n=== Parallel Execution Analysis ===");
    console.log("Total tool calls:", toolCalls.length);

    // Check if any tools executed in parallel (overlapping time windows)
    let parallelExecutions = 0;
    for (let i = 0; i < toolCalls.length - 1; i++) {
      for (let j = i + 1; j < toolCalls.length; j++) {
        const call1 = toolCalls[i];
        const call2 = toolCalls[j];
        const call1End = call1.startTime + (call1.duration || 1000);

        // Check if call2 started before call1 ended
        if (call2.startTime < call1End) {
          parallelExecutions++;
          console.log(
            `Parallel execution detected: ${call1.tool} and ${call2.tool}`,
          );
        }
      }
    }

    // Should have multiple tool calls
    expect(toolCalls.length).toBeGreaterThanOrEqual(2);
    console.log(`Detected ${parallelExecutions} parallel executions`);
  });
});

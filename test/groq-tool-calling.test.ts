import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import * as dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;

describe("Groq Tool Calling Tests", () => {
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

    // Set up Groq client if available
    if (GROQ_API_KEY) {
      const groqClient = new Groq({ apiKey: GROQ_API_KEY });
      client.setGroqClient(groqClient);
    }

    // Always create a fresh Groq specification for testing
    console.log(
      "\n=== Creating Groq Llama 4 Maverick specification for testing ===",
    );
    try {
      const createResult = await client.createSpecification({
        name: "Test Groq Llama 4 Maverick",
        serviceType: Types.ModelServiceTypes.Groq,
        groq: {
          model: Types.GroqModels.Llama_4Maverick_17B,
          temperature: 0.5,
        },
      });
      console.log("Create result:", JSON.stringify(createResult, null, 2));
      specification = createResult.createSpecification || null;
      createdSpecId = specification?.id || null;
      console.log(
        "✅ Created specification:",
        specification?.name,
        "ID:",
        createdSpecId,
      );
    } catch (error: any) {
      console.error("Failed to create Groq specification:", error);
      if (error.networkError?.result?.errors) {
        console.error(
          "GraphQL errors:",
          JSON.stringify(error.networkError.result.errors, null, 2),
        );
      }
    }
  });

  afterAll(async () => {
    // Clean up: Delete conversation if created
    if (conversationId) {
      try {
        await client.deleteConversation(conversationId);
        console.log("✅ Deleted test conversation:", conversationId);
      } catch (error) {
        console.error("Failed to delete conversation:", error);
      }
    }

    // Clean up: Delete specification if created
    if (createdSpecId) {
      try {
        await client.deleteSpecification(createdSpecId);
        console.log("✅ Deleted test specification:", createdSpecId);
      } catch (error) {
        console.error("Failed to delete specification:", error);
      }
    }
  });

  it("should call web search tool when requested with Groq", async () => {
    if (!specification) {
      console.log("❌ No Groq specification available, skipping test");
      return;
    }

    if (!GROQ_API_KEY) {
      console.log("❌ No GROQ_API_KEY found, skipping test");
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

    // Tool handler that logs calls
    const toolCalls: any[] = [];
    const toolHandlers = {
      webSearch: async (args: { query: string }) => {
        console.log("Web search called with:", args);
        toolCalls.push({ tool: "webSearch", args });

        // Return mock NHL stats data
        return {
          results: [
            {
              title: "Mason Marchment Stats",
              snippet:
                "Mason Marchment has played in the NHL since 2019-20 season. Career stats: 250+ games played, 100+ points.",
              url: "https://example.com/marchment-stats",
            },
          ],
        };
      },
    };

    console.log("\n=== Testing Groq Tool Calling ===");
    console.log("Specification:", specification.name);
    console.log("Model:", specification.groq?.model);
    console.log("Service Type:", specification.serviceType);

    try {
      const result = await client.promptAgent(
        "How long has Mason Marchment played in the NHL? Make me a table of his stats, via web search",
        undefined, // no conversation ID
        { id: specification.id }, // specification reference
        [webSearchTool], // available tools
        toolHandlers, // tool implementations
        {
          debug: true,
          maxToolRounds: 5,
        },
      );

      // Store conversation ID for cleanup
      conversationId = result.conversationId || null;

      console.log("\n=== Agent Response ===");
      console.log("Message:", result.message);
      console.log("\nTool calls made:", toolCalls.length);
      console.log("Tool calls:", JSON.stringify(toolCalls, null, 2));

      // Log detailed tool information
      if (result.toolCalls && result.toolCalls.length > 0) {
        console.log("\n=== Detailed Tool Calls ===");
        result.toolCalls.forEach((call, index) => {
          console.log(`Tool Call ${index + 1}:`);
          console.log("  Name:", call.name);
          console.log("  Arguments:", JSON.stringify(call.arguments));
        });
      }

      if (result.toolResults && result.toolResults.length > 0) {
        console.log("\n=== Tool Results ===");
        result.toolResults.forEach((result, index) => {
          console.log(`Tool Result ${index + 1}:`);
          console.log("  Name:", result.name);
          console.log("  Result:", JSON.stringify(result.result));
          if (result.error) {
            console.log("  Error:", result.error);
          }
        });
      }

      // Assertions
      expect(toolCalls.length).toBeGreaterThan(0);
      expect(toolCalls.some((call) => call.tool === "webSearch")).toBe(true);

      // Check that the query mentions Mason Marchment
      const webSearchCall = toolCalls.find((call) => call.tool === "webSearch");
      expect(webSearchCall).toBeDefined();
      expect(webSearchCall?.args.query.toLowerCase()).toContain(
        "mason marchment",
      );
    } catch (error) {
      console.error("\n=== Error ===");
      console.error("Error details:", error);
      throw error;
    }
  });

  it("should handle multiple tool types with Groq", async () => {
    if (!specification || !GROQ_API_KEY) {
      console.log("❌ No Groq specification or API key, skipping test");
      return;
    }

    // Define multiple tools
    const tools: Types.ToolDefinitionInput[] = [
      {
        name: "webSearch",
        description: "Search the web for current information",
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
      },
      {
        name: "formatTable",
        description: "Format data into a markdown table",
        schema: JSON.stringify({
          type: "object",
          properties: {
            headers: {
              type: "array",
              items: { type: "string" },
              description: "Table headers",
            },
            rows: {
              type: "array",
              items: {
                type: "array",
                items: { type: "string" },
              },
              description: "Table rows",
            },
          },
          required: ["headers", "rows"],
        }),
      },
    ];

    const toolCalls: any[] = [];
    const toolHandlers = {
      webSearch: async (args: { query: string }) => {
        toolCalls.push({ tool: "webSearch", args });
        return {
          results: [
            {
              title: "NHL Player Stats",
              snippet: "Season stats available",
              data: {
                seasons: [
                  "2019-20",
                  "2020-21",
                  "2021-22",
                  "2022-23",
                  "2023-24",
                ],
                games: [4, 33, 54, 81, 82],
                goals: [0, 5, 18, 20, 25],
                assists: [0, 4, 29, 37, 35],
              },
            },
          ],
        };
      },
      formatTable: async (args: { headers: string[]; rows: string[][] }) => {
        toolCalls.push({ tool: "formatTable", args });

        // Create markdown table
        let table = "| " + args.headers.join(" | ") + " |\n";
        table += "| " + args.headers.map(() => "---").join(" | ") + " |\n";
        args.rows.forEach((row) => {
          table += "| " + row.join(" | ") + " |\n";
        });

        return { table };
      },
    };

    console.log("\n=== Testing Multiple Tools with Groq ===");

    const result = await client.promptAgent(
      "Search for Mason Marchment's NHL career stats and create a formatted table showing his statistics by season",
      undefined,
      { id: specification.id },
      tools,
      toolHandlers,
    );

    // Update conversation ID for cleanup if new conversation was created
    if (result.conversationId && result.conversationId !== conversationId) {
      conversationId = result.conversationId;
    }

    console.log("\n=== Results ===");
    console.log("Tool calls made:", toolCalls.length);
    console.log(
      "Tools used:",
      toolCalls.map((c) => c.tool),
    );
    console.log(
      "\nFinal message preview:",
      result.message.substring(0, 200) + "...",
    );

    // Should use both tools
    expect(toolCalls.length).toBeGreaterThanOrEqual(1);
    expect(toolCalls.some((call) => call.tool === "webSearch")).toBe(true);
  });

  it("should work without tools when not needed", async () => {
    if (!specification || !GROQ_API_KEY) {
      console.log("❌ No Groq specification or API key, skipping test");
      return;
    }

    console.log("\n=== Testing Groq without Tools ===");

    const result = await client.promptAgent(
      "What is 2 + 2? Just give me the answer.",
      undefined,
      { id: specification.id },
      [], // No tools
      {}, // No handlers
    );

    // Update conversation ID for cleanup if new conversation was created
    if (result.conversationId && result.conversationId !== conversationId) {
      conversationId = result.conversationId;
    }

    console.log("Response:", result.message);

    // Should get a simple answer without tool calls
    expect(result.toolCalls?.length || 0).toBe(0);
    expect(result.message).toContain("4");
  });
});

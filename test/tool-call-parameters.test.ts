import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Graphlit } from "../src/client.js";
import * as Types from "../src/generated/graphql-types.js";
import { AgentStreamEvent } from "../src/types/ui-events.js";

describe("Tool Call Parameters Test", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;

  if (!orgId || !envId || !secret) {
    console.warn(
      "⚠️  Skipping tool parameter tests - missing Graphlit credentials",
    );
    return;
  }

  let client: Graphlit;
  let specId: string;
  let conversationId: string;
  const capturedToolCalls: { round: number; toolCalls: any[] }[] = [];

  beforeAll(async () => {
    client = new Graphlit(orgId, envId, secret);

    // Create a specification with tool support
    const specResult = await client.createSpecification({
      name: `Tool Parameter Test Spec ${Date.now()}`,
      type: Types.SpecificationTypes.Extraction,
      serviceType: Types.ModelServiceTypes.Anthropic,
      anthropic: {
        model: Types.AnthropicModels.Claude_4Sonnet,
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

  it("should preserve tool call parameters across multiple rounds", async () => {
    const tools: Types.ToolDefinitionInput[] = [
      {
        name: "search",
        description: "Search for information",
        schema: JSON.stringify({
          type: "object",
          properties: {
            query: { type: "string", description: "Search query" },
            limit: { type: "number", description: "Maximum results" },
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
            precision: { type: "number", description: "Decimal places" },
          },
          required: ["expression"],
        }),
      },
    ];

    const toolHandlers = {
      search: async (args: any) => {
        console.log("🔍 Search tool called with:", args);
        return `Found 3 results for "${args.query}"${args.limit ? ` (limited to ${args.limit})` : ""}`;
      },
      calculate: async (args: any) => {
        console.log("🧮 Calculate tool called with:", args);
        return `Result: 42${args.precision ? ` (${args.precision} decimal places)` : ""}`;
      },
    };

    let currentRound = 0;
    const events: AgentStreamEvent[] = [];

    await client.streamAgent(
      'First search for "climate change" with a limit of 5 results, then calculate "2 + 2" with 2 decimal places precision',
      (event) => {
        events.push(event);

        // Capture conversation ID
        if (event.type === "conversation_started") {
          conversationId = event.conversationId;
        }

        if (
          event.type === "conversation_completed" &&
          event.message.toolCalls
        ) {
          currentRound++;
          capturedToolCalls.push({
            round: currentRound,
            toolCalls: event.message.toolCalls.map((tc) => ({
              name: tc.name,
              arguments: tc.arguments,
              parsedArgs: tc.arguments ? JSON.parse(tc.arguments) : {},
            })),
          });

          console.log(
            `\n📊 Round ${currentRound} tool calls:`,
            JSON.stringify(
              capturedToolCalls[capturedToolCalls.length - 1],
              null,
              2,
            ),
          );
        }
      },
      undefined,
      { id: specId },
      tools,
      toolHandlers,
      {
        maxToolRounds: 3,
        smoothingEnabled: false,
      },
    );

    // Check that we have tool calls
    expect(capturedToolCalls.length).toBeGreaterThan(0);

    // Check each round's tool calls
    capturedToolCalls.forEach((round, idx) => {
      console.log(`\n🔍 Checking round ${idx + 1}:`, round);

      round.toolCalls.forEach((toolCall) => {
        console.log(`  Tool: ${toolCall.name}`);
        console.log(`  Arguments: ${toolCall.arguments}`);
        console.log(`  Parsed: ${JSON.stringify(toolCall.parsedArgs)}`);

        // Verify arguments are not empty
        expect(toolCall.arguments).toBeTruthy();
        expect(toolCall.arguments.length).toBeGreaterThan(2); // More than just '{}'

        // Verify we can parse the arguments
        expect(() => JSON.parse(toolCall.arguments)).not.toThrow();

        // Verify the parsed arguments have the expected properties
        if (toolCall.name === "search") {
          expect(toolCall.parsedArgs.query).toBeTruthy();
        } else if (toolCall.name === "calculate") {
          expect(toolCall.parsedArgs.expression).toBeTruthy();
        }
      });
    });
  }, 60000);
});

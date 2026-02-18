import { describe, it, expect, beforeAll, afterAll } from "vitest";
import {
  estimateTokens,
  truncateToolResult,
  isAccurateTokenCounting,
  TokenBudgetTracker,
} from "../src/helpers/context-management";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import { AgentStreamEvent } from "../src/types/ui-events";

// ─── Unit tests: tiktoken integration ────────────────────────────────────────

describe("Token Counting (tiktoken integration)", () => {
  it("should report accurate token counting when js-tiktoken is installed", () => {
    // js-tiktoken is in optionalDependencies, so it should be available in this test env
    expect(isAccurateTokenCounting()).toBe(true);
  });

  it("should return 0 for empty / falsy input", () => {
    expect(estimateTokens("")).toBe(0);
    expect(estimateTokens(null as unknown as string)).toBe(0);
    expect(estimateTokens(undefined as unknown as string)).toBe(0);
  });

  it("should tokenize a simple English sentence", () => {
    const text = "Hello, world!";
    const tokens = estimateTokens(text);

    // With o200k_base encoding, "Hello, world!" is 4 tokens.
    // The heuristic would give ceil(13/3.5) = 4 — same for this short string,
    // but we're really testing that the encoder path is exercised.
    expect(tokens).toBeGreaterThan(0);
    expect(tokens).toBeLessThanOrEqual(text.length); // Never more tokens than chars
  });

  it("should be significantly more accurate than the heuristic for longer text", () => {
    const text =
      "The quick brown fox jumps over the lazy dog. " +
      "This is a longer sentence to demonstrate the difference between accurate BPE " +
      "tokenization and the character-based heuristic estimation that divides by 3.5. " +
      "With real tokenization we get much more accurate token counts which helps with " +
      "context window management and prevents premature truncation of tool results.";

    const accurate = estimateTokens(text);
    const heuristic = Math.ceil(text.length / 3.5);

    console.log(`  Text length: ${text.length} chars`);
    console.log(`  Accurate tokens: ${accurate}`);
    console.log(`  Heuristic tokens: ${heuristic}`);
    console.log(
      `  Overestimate: ${((heuristic / accurate) * 100 - 100).toFixed(1)}%`,
    );

    // The heuristic should overestimate by at least 20% for normal English prose
    expect(heuristic).toBeGreaterThan(accurate * 1.2);
  });

  it("should handle code/JSON content", () => {
    const json = JSON.stringify(
      {
        users: [
          { id: 1, name: "Alice", email: "alice@example.com" },
          { id: 2, name: "Bob", email: "bob@example.com" },
          { id: 3, name: "Charlie", email: "charlie@example.com" },
        ],
        pagination: { page: 1, perPage: 10, total: 3 },
      },
      null,
      2,
    );

    const tokens = estimateTokens(json);
    expect(tokens).toBeGreaterThan(0);

    // JSON has lots of punctuation/structure — tokens should still be less than char count
    expect(tokens).toBeLessThan(json.length);

    console.log(
      `  JSON: ${json.length} chars -> ${tokens} tokens (${(json.length / tokens).toFixed(1)} chars/token)`,
    );
  });
});

// ─── Unit tests: truncateToolResult with accurate counting ───────────────────

describe("truncateToolResult (tiktoken-aware)", () => {
  it("should not truncate results within budget", () => {
    const text = "Short result";
    const result = truncateToolResult(text, 1000, "test-tool");
    expect(result).toBe(text);
  });

  it("should truncate long results and append marker", () => {
    // Generate a string that definitely exceeds 50 tokens
    const text = "The quick brown fox jumps over the lazy dog. ".repeat(50);
    const result = truncateToolResult(text, 50, "test-tool");

    expect(result.length).toBeLessThan(text.length);
    expect(result).toContain("[truncated by test-tool:");
  });

  it("should produce more precise truncation with tiktoken than heuristic", () => {
    // With tiktoken, the char-per-token ratio is computed from the actual text,
    // so the truncated output should land closer to the target token count.
    const text = "word ".repeat(500); // ~500 tokens with BPE
    const targetTokens = 100;

    const truncated = truncateToolResult(text, targetTokens, "precision-test");

    // The truncated body (before the marker) should be roughly targetTokens worth
    const bodyEnd = truncated.indexOf("\n\n[truncated by");
    const body = bodyEnd >= 0 ? truncated.substring(0, bodyEnd) : truncated;
    const bodyTokens = estimateTokens(body);

    console.log(
      `  Target: ${targetTokens} tokens, body got: ${bodyTokens} tokens`,
    );

    // Should be within 30% of target (generous for break-point seeking)
    expect(bodyTokens).toBeLessThan(targetTokens * 1.3);
    // Should use at least 50% of budget (not wildly conservative)
    expect(bodyTokens).toBeGreaterThan(targetTokens * 0.5);
  });

  it("should truncate JSON and find a clean break point", () => {
    const items = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
      description: `This is a detailed description for item number ${i}`,
    }));
    const json = JSON.stringify(items, null, 2);

    const result = truncateToolResult(json, 200, "json-tool");

    expect(result.length).toBeLessThan(json.length);
    expect(result).toContain("[truncated by json-tool:");

    // Should have found a clean JSON break point (ends with } or ])
    const bodyEnd = result.indexOf("\n\n[truncated by");
    const body = bodyEnd >= 0 ? result.substring(0, bodyEnd) : result;
    const lastChar = body.trim().slice(-1);
    expect(["}","]"]).toContain(lastChar);
  });
});

// ─── Unit tests: TokenBudgetTracker with accurate counting ───────────────────

describe("TokenBudgetTracker (tiktoken-aware)", () => {
  it("should use accurate token counting in addMessage when no server count provided", () => {
    const tracker = new TokenBudgetTracker(128000, 4096, 0);

    const message =
      "This is a test message that we want to track accurately for token usage.";
    tracker.addMessage(message);

    const accurateTokens = estimateTokens(message);
    expect(tracker.usedTokens).toBe(accurateTokens);

    // Verify it's using the real tokenizer, not the heuristic
    const heuristicTokens = Math.ceil(message.length / 3.5);
    if (isAccurateTokenCounting()) {
      expect(tracker.usedTokens).not.toBe(heuristicTokens);
    }
  });

  it("should prefer server-provided token count over local estimation", () => {
    const tracker = new TokenBudgetTracker(128000, 4096, 0);

    tracker.addMessage("any text", 42);
    expect(tracker.usedTokens).toBe(42);
  });
});

// ─── Integration test: streamAgent with GPT-5.2 + context management ─────────

const hasCredentials =
  !!process.env.GRAPHLIT_ORGANIZATION_ID &&
  !!process.env.GRAPHLIT_ENVIRONMENT_ID &&
  !!process.env.GRAPHLIT_JWT_SECRET &&
  !!process.env.OPENAI_API_KEY;

describe.skipIf(!hasCredentials)(
  "Context Management - OpenAI GPT-5.2",
  () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID!;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID!;
  const secret = process.env.GRAPHLIT_JWT_SECRET!;
  const openaiKey = process.env.OPENAI_API_KEY!;

  let client: Graphlit;
  let specificationId: string | undefined;
  let conversationId: string | undefined;

  beforeAll(async () => {
    client = new Graphlit(orgId, envId, secret);

    const { default: OpenAI } = await import("openai");
    client.setOpenAIClient(
      new OpenAI({ apiKey: openaiKey }),
    );
    console.log("OpenAI client initialized for GPT-5.2");

    const specInput: Types.SpecificationInput = {
      name: "Test - Context Management - GPT-5.2",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.OpenAi,
      openAI: {
        model: Types.OpenAiModels.Gpt52_400K,
        temperature: 0.7,
      },
    };

    const resp = await client.createSpecification(specInput);
    specificationId = resp.createSpecification?.id;
    expect(specificationId).toBeTruthy();
    console.log("Created specification:", specificationId);
  });

  afterAll(async () => {
    // Delete conversation first — the backend won't allow deleting a
    // specification that still has conversations linked to it.
    if (conversationId) {
      try {
        await client.deleteConversation(conversationId);
        // Brief pause so the backend fully unlinks the conversation
        await new Promise((r) => setTimeout(r, 2000));
      } catch {
        // best-effort
      }
    }
    if (specificationId) {
      try {
        await client.deleteSpecification(specificationId);
      } catch {
        // best-effort
      }
    }
  });

  it(
    "should complete a multi-tool-round conversation and track token budget",
    { timeout: 120000 },
    async () => {
      const tools: Types.ToolDefinitionInput[] = [
        {
          name: "lookup_data",
          description: "Look up data by category name",
          schema: JSON.stringify({
            type: "object",
            properties: {
              category: {
                type: "string",
                description: "The category to look up",
              },
            },
            required: ["category"],
          }),
        },
      ];

      // Return a sizeable payload so context management actually matters
      const toolHandlers = {
        lookup_data: async (args: { category: string }) => {
          console.log(`  Tool called: lookup_data(${args.category})`);
          const items = Array.from({ length: 20 }, (_, i) => ({
            id: `${args.category}-${i}`,
            title: `${args.category} item #${i}`,
            summary: `Detailed information about ${args.category} item number ${i}. This contains enough text to exercise token counting properly.`,
          }));
          return { category: args.category, items, total: items.length };
        },
      };

      const events: AgentStreamEvent[] = [];
      let toolCallCount = 0;

      const prompt =
        "Look up data for the category 'widgets' using the lookup_data tool, then briefly summarize what you found.";

      await client.streamAgent(
        prompt,
        (event: AgentStreamEvent) => {
          events.push(event);

          if (event.type === "conversation_started") {
            conversationId = event.conversationId;
            console.log(`  Conversation: ${conversationId}`);
          } else if (event.type === "tool_update") {
            if (event.status === "executing") toolCallCount++;
            console.log(`  Tool: ${event.toolCall.name} [${event.status}]`);
          } else if (event.type === "conversation_completed") {
            console.log(
              `  Completed (${event.message.message.length} chars)`,
            );
          } else if (event.type === "error") {
            console.error(`  Error: ${event.error.message}`);
          }
        },
        undefined,
        { id: specificationId },
        tools,
        toolHandlers,
      );

      // Basic flow assertions
      expect(
        events.find((e) => e.type === "conversation_started"),
      ).toBeDefined();

      const completed = events.find(
        (e) => e.type === "conversation_completed",
      );
      expect(completed).toBeDefined();

      // The model should have called our tool at least once
      expect(toolCallCount).toBeGreaterThanOrEqual(1);

      // Final message should reference the data
      const finalMessage = completed!.message.message.toLowerCase();
      expect(finalMessage).toContain("widget");

      // Verify token counting is accurate for the final message
      const finalTokens = estimateTokens(completed!.message.message);
      const heuristicTokens = Math.ceil(
        completed!.message.message.length / 3.5,
      );

      console.log(
        `  Final message: ${finalTokens} accurate tokens vs ${heuristicTokens} heuristic`,
      );

      if (isAccurateTokenCounting()) {
        // Accurate counting should yield fewer tokens than the conservative heuristic
        expect(finalTokens).toBeLessThanOrEqual(heuristicTokens);
      }
    },
  );
});

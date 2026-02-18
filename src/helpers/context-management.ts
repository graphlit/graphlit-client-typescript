import { createRequire } from "node:module";
import * as Types from "../generated/graphql-types.js";

// Minimal interface matching the subset of tiktoken's Tiktoken we use.
// Avoids a compile-time dependency on js-tiktoken types.
interface TiktokenEncoder {
  encode(text: string): number[];
}

// ── Singleton tiktoken encoder (best-effort load) ───────────────────────────
let encoder: TiktokenEncoder | undefined;

try {
  const require = createRequire(import.meta.url);
  const { Tiktoken } = require("js-tiktoken/lite") as {
    Tiktoken: new (ranks: Record<string, unknown>) => TiktokenEncoder;
  };
  const ranks = require("js-tiktoken/ranks/o200k_base") as Record<
    string,
    unknown
  >;
  encoder = new Tiktoken(ranks);

  if (process.env.DEBUG_GRAPHLIT_SDK_INITIALIZATION) {
    console.debug(
      "[graphlit-sdk] tiktoken encoder loaded (o200k_base) — accurate token counting enabled",
    );
  }
} catch {
  // js-tiktoken not installed — fall back to heuristic
  if (process.env.DEBUG_GRAPHLIT_SDK_INITIALIZATION) {
    console.debug(
      "[graphlit-sdk] js-tiktoken not available — using heuristic token estimation (chars / 3.5)",
    );
  }
}

/** Returns `true` when js-tiktoken is installed and the encoder loaded successfully. */
export function isAccurateTokenCounting(): boolean {
  return encoder !== undefined;
}

/**
 * Token estimation.
 *
 * When js-tiktoken is installed, returns an accurate BPE token count (o200k_base encoding).
 * Otherwise falls back to a conservative heuristic: chars / 3.5.
 */
export function estimateTokens(text: string): number {
  if (!text) return 0;
  if (encoder) return encoder.encode(text).length;
  return Math.ceil(text.length / 3.5);
}

/**
 * Configuration for context window management during agentic tool loops.
 * Values can be provided by the server (via ConversationStrategy) or set client-side.
 */
export interface ContextStrategyConfig {
  /** Max tokens for any single tool result. Results exceeding this are truncated. Default: 8192 */
  toolResultTokenLimit: number;
  /** Max tool call/response rounds to keep in context. Older rounds are dropped FIFO. Default: 10 */
  toolRoundLimit: number;
  /** Fraction of token budget at which client-side windowing is triggered. Default: 0.75 */
  rebudgetThreshold: number;
}

export const DEFAULT_CONTEXT_STRATEGY: ContextStrategyConfig = {
  toolResultTokenLimit: 8192,
  toolRoundLimit: 10,
  rebudgetThreshold: 0.75,
};

/**
 * Tracks token budget during streaming agent tool loops.
 *
 * Initialized from server-provided accurate token counts (via formatConversation details),
 * then uses character-based heuristic estimation for incremental additions during the loop.
 */
export class TokenBudgetTracker {
  private readonly tokenLimit: number;
  private readonly completionTokenLimit: number;
  private _usedTokens: number;

  constructor(
    tokenLimit: number,
    completionTokenLimit: number,
    initialUsedTokens: number,
  ) {
    this.tokenLimit = tokenLimit;
    this.completionTokenLimit = completionTokenLimit;
    this._usedTokens = initialUsedTokens;
  }

  /**
   * Create a tracker from formatConversation response details.
   * Returns undefined if the details lack token information.
   */
  static fromDetails(details: {
    tokenLimit?: number | null;
    completionTokenLimit?: number | null;
    messages?: Array<{ tokens?: number | null } | null> | null;
  }): TokenBudgetTracker | undefined {
    if (!details.tokenLimit) return undefined;

    const tokenLimit = details.tokenLimit;
    const completionTokenLimit = details.completionTokenLimit ?? 4096;
    const usedTokens =
      details.messages?.reduce((sum, msg) => sum + (msg?.tokens ?? 0), 0) ?? 0;

    return new TokenBudgetTracker(tokenLimit, completionTokenLimit, usedTokens);
  }

  /** Total available token budget (tokenLimit - completionTokenLimit, at 95% ceiling) */
  get budget(): number {
    return Math.floor((this.tokenLimit - this.completionTokenLimit) * 0.95);
  }

  /** Current estimated token usage */
  get usedTokens(): number {
    return this._usedTokens;
  }

  /** Remaining tokens before budget is exhausted */
  get remaining(): number {
    return Math.max(0, this.budget - this._usedTokens);
  }

  /** Current usage as a percentage (0-100) */
  get usagePercent(): number {
    if (this.budget <= 0) return 100;
    return Math.round((this._usedTokens / this.budget) * 100);
  }

  /** Model's full context token limit */
  get maxTokens(): number {
    return this.tokenLimit;
  }

  /** Track addition of new message content */
  addMessage(text: string, serverTokenCount?: number): void {
    this._usedTokens += serverTokenCount ?? estimateTokens(text);
  }

  /** Check if we need to trigger windowing/re-budgeting */
  needsRebudget(threshold: number): boolean {
    return this.usagePercent >= threshold * 100;
  }

  /** Reset tracker from a fresh set of messages (after windowing) */
  resetFromMessages(
    messages: Array<{ message?: string | null; tokens?: number | null }>,
  ): void {
    this._usedTokens = messages.reduce((sum, msg) => {
      if (msg.tokens) return sum + msg.tokens;
      return sum + estimateTokens(msg.message ?? "");
    }, 0);
  }

  /** Get current usage snapshot for emitting events */
  getUsageSnapshot(): {
    usedTokens: number;
    maxTokens: number;
    percentage: number;
    remainingTokens: number;
  } {
    return {
      usedTokens: this._usedTokens,
      maxTokens: this.tokenLimit,
      percentage: this.usagePercent,
      remainingTokens: this.remaining,
    };
  }
}

/**
 * Truncates a tool result to fit within a token budget.
 *
 * Attempts to find a clean break point (JSON boundary or newline).
 * Appends a [truncated] marker so the LLM knows data was cut.
 */
export function truncateToolResult(
  result: unknown,
  maxTokens: number,
  toolName: string,
): string {
  const text = typeof result === "string" ? result : JSON.stringify(result);

  if (!text) return "";

  const estimatedTokens = estimateTokens(text);

  if (estimatedTokens <= maxTokens) return text;

  // When tiktoken is available, compute the actual chars-per-token ratio for
  // this specific text instead of using the hardcoded 3.5 heuristic.
  const charsPerToken =
    encoder && estimatedTokens > 0
      ? text.length / estimatedTokens
      : 3.5;
  const maxChars = Math.floor(maxTokens * charsPerToken);

  let truncated = text.substring(0, maxChars);

  // Try to find a clean break point
  if (text.startsWith("{") || text.startsWith("[")) {
    // For JSON, try to close at a valid boundary
    const lastComplete = Math.max(
      truncated.lastIndexOf("},"),
      truncated.lastIndexOf("}\n"),
      truncated.lastIndexOf("],"),
      truncated.lastIndexOf("]\n"),
    );
    if (lastComplete > maxChars * 0.5) {
      truncated = truncated.substring(0, lastComplete + 1);
    }
  } else {
    // For plain text, break at newline
    const lastNewline = truncated.lastIndexOf("\n");
    if (lastNewline > maxChars * 0.5) {
      truncated = truncated.substring(0, lastNewline);
    }
  }

  const truncatedTokens = estimateTokens(truncated);

  return `${truncated}\n\n[truncated by ${toolName}: original ~${estimatedTokens} tokens, showing first ~${truncatedTokens} tokens]`;
}

/**
 * Identifies the boundary between "header" messages (system prompt, conversation history,
 * initial user message) and "tool round" messages (assistant+tool pairs from the agentic loop).
 *
 * Tool rounds start at the first assistant message that has tool calls.
 */
function findToolRoundStart(messages: Types.ConversationMessage[]): number {
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (
      msg.role === Types.ConversationRoleTypes.Assistant &&
      msg.toolCalls &&
      msg.toolCalls.length > 0
    ) {
      return i;
    }
  }
  return messages.length; // No tool rounds found
}

/**
 * Groups tool-round messages into logical rounds.
 * Each round = one assistant message (with tool calls) + all subsequent tool response messages.
 */
function groupToolRounds(
  toolMessages: Types.ConversationMessage[],
): Types.ConversationMessage[][] {
  const rounds: Types.ConversationMessage[][] = [];
  let currentRound: Types.ConversationMessage[] = [];

  for (const msg of toolMessages) {
    if (
      msg.role === Types.ConversationRoleTypes.Assistant &&
      currentRound.length > 0
    ) {
      // New assistant message starts a new round
      rounds.push(currentRound);
      currentRound = [msg];
    } else {
      currentRound.push(msg);
    }
  }

  if (currentRound.length > 0) {
    rounds.push(currentRound);
  }

  return rounds;
}

/**
 * Windows tool rounds to keep the messages array within budget.
 *
 * Preserves:
 * - "Header" messages (system prompt, conversation history, initial user message)
 * - The most recent `keepRounds` tool rounds
 *
 * Drops older tool rounds and inserts a system message noting what was removed.
 *
 * @returns The windowed messages array
 */
export function windowToolRounds(
  messages: Types.ConversationMessage[],
  keepRounds: number,
): Types.ConversationMessage[] {
  const headerEnd = findToolRoundStart(messages);
  const header = messages.slice(0, headerEnd);
  const toolMessages = messages.slice(headerEnd);

  const rounds = groupToolRounds(toolMessages);

  if (rounds.length <= keepRounds) return messages;

  const keptRounds = rounds.slice(-keepRounds);
  const droppedCount = rounds.length - keepRounds;

  // Summary marker so the LLM knows context was trimmed
  const summaryMessage: Types.ConversationMessage = {
    __typename: "ConversationMessage" as const,
    role: Types.ConversationRoleTypes.System,
    message: `[Context management: ${droppedCount} earlier tool calling round(s) were removed to stay within token limits. The most recent ${keepRounds} round(s) are preserved below.]`,
    timestamp: new Date().toISOString(),
  };

  return [...header, summaryMessage, ...keptRounds.flat()];
}

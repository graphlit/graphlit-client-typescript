/**
 * Internal types used by the streaming implementation
 * These are not exported to consumers of the library
 */

import { ContextManagementAction } from "./agent.js";

type ToolCallStreamData = {
  id: string;
  name: string;
  arguments?: string;
  startedAt?: string | null;
  completedAt?: string | null;
  durationMs?: number | null;
  failedAt?: string | null;
  firstStatusAt?: string | null;
};

/**
 * Low-level streaming events used internally by providers
 * These get transformed into AgentStreamEvent by UIEventAdapter
 */
export type StreamEvent =
  | { type: "start"; conversationId: string }
  | { type: "token"; token: string }
  | { type: "message"; message: string }
  | { type: "tool_call_start"; toolCall: ToolCallStreamData }
  | { type: "tool_call_delta"; toolCallId: string; argumentDelta: string }
  | {
      type: "tool_call_parsed"; // Tool arguments have been fully parsed from LLM stream
      toolCall: ToolCallStreamData & { arguments: string };
    }
  | {
      type: "tool_call_executing"; // Tool handler execution has started
      toolCall: ToolCallStreamData & { arguments: string };
    }
  | {
      type: "tool_call_complete"; // Tool has been executed with result
      toolCall: ToolCallStreamData & { arguments: string };
      result?: unknown;
      error?: string;
    }
  | {
      type: "complete";
      messageId?: string;
      conversationId?: string;
      tokens?: number;
      usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
        model?: string;
        provider?: string;
      };
    }
  | { type: "error"; error: string }
  | {
      type: "context_window";
      usage: {
        usedTokens: number;
        maxTokens: number;
        percentage: number;
        remainingTokens: number;
      };
    }
  | {
      type: "context_management";
      action: ContextManagementAction;
      usage: {
        usedTokens: number;
        maxTokens: number;
        percentage: number;
        remainingTokens: number;
      };
      timestamp: Date;
    }
  | {
      type: "reasoning_start";
      format: "thinking_tag" | "markdown" | "custom";
    }
  | {
      type: "reasoning_delta";
      content: string;
      format: "thinking_tag" | "markdown" | "custom";
    }
  | {
      type: "reasoning_end";
      fullContent: string;
      signature?: string; // For Anthropic extended thinking
    };

/**
 * Normalized error from an LLM provider. Carries structured metadata
 * so the retry layer can make decisions without parsing error messages.
 */
export class ProviderError extends Error {
  readonly provider: string;
  readonly statusCode: number;
  readonly retryable: boolean;
  readonly requestId?: string;

  constructor(
    message: string,
    opts: {
      provider: string;
      statusCode: number;
      retryable: boolean;
      requestId?: string;
      cause?: Error;
    },
  ) {
    super(message, { cause: opts.cause });
    this.name = "ProviderError";
    this.provider = opts.provider;
    this.statusCode = opts.statusCode;
    this.retryable = opts.retryable;
    this.requestId = opts.requestId;
  }
}

/**
 * Detect common retryable server errors across providers.
 * Used as a catch-all after provider-specific error classification.
 */
export function isRetryableServerError(error: any): boolean {
  const status = error.status ?? error.statusCode;
  if (typeof status === "number" && status >= 500) return true;

  const msg: string = (error.message || "").toLowerCase();
  const type: string = (error.type || "").toLowerCase();

  if (type === "api_error" || type === "server_error") return true;

  return (
    msg.includes("internal server error") ||
    msg.includes("service unavailable") ||
    msg.includes("bad gateway") ||
    msg.includes("gateway timeout")
  );
}

/**
 * Detect rate-limit / overloaded errors across providers.
 */
export function isRateLimitError(error: any): boolean {
  const status = error.status ?? error.statusCode;
  if (status === 429) return true;

  const type: string = (error.type || "").toLowerCase();
  if (type === "rate_limit_error" || type === "overloaded_error") return true;

  if (error.code === "rate_limit_exceeded") return true;

  const msg: string = (error.message || "").toLowerCase();
  return msg.includes("rate limit") || msg.includes("overloaded");
}

/**
 * Detect transient network errors.
 */
export function isNetworkError(error: any): boolean {
  const msg: string = error.message || "";
  return (
    msg.includes("fetch failed") ||
    error.code === "ECONNRESET" ||
    error.code === "ETIMEDOUT" ||
    error.code === "ECONNREFUSED"
  );
}

/** Extract a request ID from a provider error, if present. */
export function extractRequestId(error: any): string | undefined {
  return error.request_id ?? error.requestId ?? error.headers?.["x-request-id"];
}

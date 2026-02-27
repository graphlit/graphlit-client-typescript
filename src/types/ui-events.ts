import {
  ConversationMessage,
  ConversationToolCall,
} from "../generated/graphql-types.js";
import { ContextManagementAction } from "./agent.js";

/**
 * Tool execution status for streaming
 */
export type ToolExecutionStatus =
  | "preparing"
  | "executing"
  | "ready" // Tool has been parsed and is ready for execution
  | "completed"
  | "failed";

/**
 * Reasoning format types
 */
export type ReasoningFormat = "thinking_tag" | "markdown" | "custom";

/**
 * Context window usage event - emitted at start of agent interaction
 */
export type ContextWindowEvent = {
  type: "context_window";
  usage: {
    usedTokens: number; // Total tokens in current context
    maxTokens: number; // Model's context limit
    percentage: number; // Usage percentage (0-100)
    remainingTokens: number; // Tokens available for response
  };
  timestamp: Date;
};

/**
 * Structured reasoning/thinking metadata.
 * Provides a canonical representation across all providers so the UI
 * can decide whether and how to render model reasoning.
 */
export type ReasoningMetadata = {
  content: string; // Clean thinking text (no XML tags or markdown fencing)
  format: ReasoningFormat; // How the provider originally expressed reasoning
  signature?: string; // Anthropic extended-thinking signature (needed for API round-tripping)
};

/**
 * Extended conversation message with additional streaming metadata
 */
export type StreamingConversationMessage = Partial<ConversationMessage> & {
  message: string; // Ensure message text is always present
  modelName?: string; // Raw model name from API (e.g., "claude-sonnet-4-0")
  isThinking?: boolean; // True when the message includes model reasoning/thinking content
  thinkingContent?: string; // Clean thinking text (no XML tags or markdown fencing)
};

/**
 * Simplified UI-focused streaming events using GraphQL types
 */
export type AgentStreamEvent =
  | {
      type: "conversation_started";
      conversationId: string;
      timestamp: Date;
      model?: string;
    }
  | {
      // Emitted when a message is sent while a previous response is still
      // in-flight. The call will be processed in order once the current
      // response completes.
      type: "conversation_queued";
      conversationId: string;
      timestamp: Date;
    }
  | {
      // Emitted when a queued or in-flight streamAgent call is cancelled via
      // AbortSignal (e.g. user hits ESC). No error event is emitted.
      type: "conversation_cancelled";
      conversationId: string;
      timestamp: Date;
    }
  | ContextWindowEvent
  | {
      // Emitted when context management takes action (tool result truncation,
      // tool round windowing). Informational — the SDK handled it automatically.
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
      type: "message_update";
      message: StreamingConversationMessage;
      isStreaming: boolean;
      reasoning?: ReasoningMetadata; // Present when model reasoning has been detected so far
      metrics?: {
        ttft?: number; // Time to first token (ms)
        elapsedTime: number; // Streaming elapsed time (ms)
        conversationDuration: number; // Total time from user message to now (ms)
        tokenCount?: number; // Number of tokens received
        avgTokenDelay?: number; // Average delay between tokens (ms)
        streamingThroughput?: number; // Characters per second (excludes TTFT)
      };
    }
  | {
      type: "tool_update";
      toolCall: ConversationToolCall;
      status: ToolExecutionStatus;
      result?: unknown;
      error?: string;
    }
  | {
      type: "reasoning_update";
      content: string; // Accumulated reasoning content
      format: ReasoningFormat;
      isComplete: boolean;
    }
  | {
      type: "conversation_completed";
      message: StreamingConversationMessage;
      reasoning?: ReasoningMetadata; // Present when the response included model reasoning/thinking
      metrics?: {
        ttft?: number; // Time to first token (ms)
        totalTime: number; // Total streaming time (ms)
        conversationDuration: number; // Total time from user message to completion (ms)
        tokenCount?: number; // Streaming chunks received
        llmTokens?: number; // Actual LLM tokens consumed
        avgTokenDelay?: number; // Average delay between tokens (ms)
        streamingThroughput?: number; // Characters per second (excludes TTFT)
      };
      contextWindow?: {
        usedTokens: number; // Total tokens after completion
        maxTokens: number; // Model's context limit
        percentage: number; // Usage percentage (0-100)
        remainingTokens: number; // Tokens available
      };
      usage?: {
        promptTokens: number; // Input tokens from native provider
        completionTokens: number; // Output tokens from native provider
        totalTokens: number; // Total tokens (prompt + completion)
        model?: string; // Model identifier from provider
        provider?: string; // Provider name (OpenAI, Groq, etc.)
      };
    }
  | {
      type: "error";
      error: {
        message: string;
        code?: string;
        recoverable?: boolean;
      };
      conversationId: string;
      timestamp: Date;
    };

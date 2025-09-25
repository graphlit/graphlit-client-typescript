import {
  ConversationMessage,
  ConversationToolCall,
} from "../generated/graphql-types.js";

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
 * Extended conversation message with additional streaming metadata
 */
export type StreamingConversationMessage = Partial<ConversationMessage> & {
  message: string; // Ensure message text is always present
  modelName?: string; // Raw model name from API (e.g., "claude-sonnet-4-0")
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
  | ContextWindowEvent
  | {
      type: "message_update";
      message: StreamingConversationMessage;
      isStreaming: boolean;
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

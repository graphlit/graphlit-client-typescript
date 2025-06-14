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
      type: "message_update";
      message: Partial<ConversationMessage> & {
        message: string; // Ensure message text is always present
      };
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
      type: "conversation_completed";
      message: ConversationMessage;
      metrics?: {
        ttft?: number; // Time to first token (ms)
        totalTime: number; // Total streaming time (ms)
        conversationDuration: number; // Total time from user message to completion (ms)
        tokenCount?: number; // Streaming chunks received
        llmTokens?: number; // Actual LLM tokens consumed
        avgTokenDelay?: number; // Average delay between tokens (ms)
        streamingThroughput?: number; // Characters per second (excludes TTFT)
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

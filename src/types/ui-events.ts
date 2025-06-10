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

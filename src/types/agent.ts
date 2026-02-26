import { SmoothStreamOptions } from "./streaming.js";
import {
  ConversationMessage,
  ConversationToolCall,
} from "../generated/graphql-types.js";

// Collects artifact promises from tool handlers for association with the completed message.
// Handlers register async ingestion work via addPending(); the SDK awaits all promises
// before calling completeConversation so content IDs are available at completion time.
export interface ArtifactCollector {
  addPending(promise: Promise<{ id: string } | undefined>): void;
  resolve(): Promise<{ id: string }[]>;
}

// Tool handler function type
export type ToolHandler = (
  args: any,
  artifacts?: ArtifactCollector,
  abortSignal?: AbortSignal,
) => Promise<any>;

// Context strategy for managing token budgets during agentic tool loops.
// These values can also be driven by the server-side ConversationStrategy on the specification.
export interface ContextStrategy {
  /** Max tokens for any single tool result. Results exceeding this are truncated. Default: 8192 */
  toolResultTokenLimit?: number;
  /** Max tool call/response rounds to keep in context. Older rounds are dropped FIFO. Default: 10 */
  toolRoundLimit?: number;
  /** Fraction of token budget (0.0-1.0) at which client-side windowing is triggered. Default: 0.75 */
  rebudgetThreshold?: number;
}

// Agent options for non-streaming calls
export interface AgentOptions {
  maxToolRounds?: number; // default: 100
  timeout?: number; // milliseconds
  contextStrategy?: ContextStrategy;
}

// Performance metrics for agent execution
export interface AgentMetrics {
  totalTime: number; // Total execution time in ms
  llmTime?: number; // Time spent waiting for LLM responses
  toolTime?: number; // Time spent executing tools
  ttft?: number; // Time to first token (streaming only)
  tokensPerSecond?: number; // Token generation rate
  toolExecutions?: number; // Number of tool executions
  rounds?: number; // Number of tool calling rounds
}

// Context window usage information
export interface ContextWindowUsage {
  usedTokens: number; // Total tokens in current context
  maxTokens: number; // Model's context limit
  percentage: number; // Usage percentage (0-100)
  remainingTokens: number; // Tokens available for response
}

// Describes a context management action taken by the SDK
export type ContextManagementAction =
  | {
      type: "truncated_tool_result";
      toolName: string;
      originalTokens: number;
      truncatedTokens: number;
    }
  | {
      type: "windowed_tool_rounds";
      droppedRounds: number;
      keptRounds: number;
    };

// Result from promptAgent with full conversation details
export interface AgentResult {
  // Core response
  message: string; // The final message text
  conversationId: string;

  // Full conversation message with metadata
  conversationMessage?: ConversationMessage;

  // Tool calling information
  toolCalls?: ConversationToolCall[];
  toolResults?: ToolCallResult[];

  // Performance metrics
  metrics?: AgentMetrics;

  // Usage information
  usage?: UsageInfo;

  // Context window usage at end of interaction
  contextWindow?: ContextWindowUsage;

  // Context management actions taken during this interaction
  contextActions?: ContextManagementAction[];

  // Error if any
  error?: AgentError;
}

// Options for streamAgent
export interface StreamAgentOptions {
  maxToolRounds?: number; // default: 100
  abortSignal?: AbortSignal;
  smoothingEnabled?: boolean; // default: true
  chunkingStrategy?: "character" | "word" | "sentence"; // default: 'word'
  smoothingDelay?: number; // default: 30ms
  contextStrategy?: ContextStrategy;
}

// Tool call result
export interface ToolCallResult {
  id: string;
  name: string;
  arguments: any;
  result?: any;
  error?: string;
  duration?: number; // milliseconds
}

// Usage information
export interface UsageInfo {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost?: number;
  model?: string;
}

// Agent error
export interface AgentError {
  message: string;
  code?: string;
  recoverable: boolean;
  details?: any;
}

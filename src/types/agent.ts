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
) => Promise<any>;

// Agent options for non-streaming calls
export interface AgentOptions {
  maxToolRounds?: number; // default: 1000
  timeout?: number; // milliseconds
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

  // Context window usage at start of interaction
  contextWindow?: ContextWindowUsage;

  // Error if any
  error?: AgentError;
}

// Options for streamAgent
export interface StreamAgentOptions {
  maxToolRounds?: number; // default: 1000
  abortSignal?: AbortSignal;
  smoothingEnabled?: boolean; // default: true
  chunkingStrategy?: "character" | "word" | "sentence"; // default: 'word'
  smoothingDelay?: number; // default: 30ms
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

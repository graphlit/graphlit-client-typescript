import { SmoothStreamOptions } from "./streaming.js";

// Tool handler function type
export type ToolHandler = (args: any) => Promise<any>;

// Agent options for non-streaming calls
export interface AgentOptions {
  maxToolRounds?: number; // default: 10
  timeout?: number; // milliseconds
}

// Result from promptAgent
export interface AgentResult {
  message: string;
  conversationId: string;
  error?: AgentError;
}

// Options for streamAgent
export interface StreamAgentOptions {
  maxToolRounds?: number; // default: 100
  abortSignal?: AbortSignal;
  showTokenStream?: boolean; // default: true
  smoothingEnabled?: boolean; // default: true
  chunkingStrategy?: 'character' | 'word' | 'sentence'; // default: 'word'
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

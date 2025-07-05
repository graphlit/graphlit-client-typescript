/**
 * Token usage information from streaming providers
 */
export interface TokenUsage {
  /** Number of tokens in the prompt/input */
  promptTokens: number;
  
  /** Number of tokens in the completion/output */
  completionTokens: number;
  
  /** Total tokens (prompt + completion) */
  totalTokens: number;
  
  /** Provider-specific model identifier */
  model?: string;
  
  /** Provider name (OpenAI, Anthropic, etc.) */
  provider?: string;
  
  /** Additional provider-specific usage data */
  metadata?: Record<string, any>;
}

/**
 * Extended token usage with timing information
 */
export interface ExtendedTokenUsage extends TokenUsage {
  /** Time to generate the completion (ms) */
  completionTime?: number;
  
  /** Time to process the prompt (ms) */
  promptTime?: number;
  
  /** Queue time before processing (ms) */
  queueTime?: number;
  
  /** Tokens per second throughput */
  tokensPerSecond?: number;
}
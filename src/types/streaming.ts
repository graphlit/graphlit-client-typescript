// Smooth streaming configuration
export enum SmoothChunkingStrategy {
  Word = "word",
  Sentence = "sentence",
  Character = "char",
}

export interface SmoothStreamOptions {
  /** Enable smooth streaming. Set to false to get raw tokens. Default: true */
  enabled?: boolean;

  /** Delay between chunk emissions in milliseconds. Default varies by provider */
  delay?: number;

  /** How to break up content into chunks */
  chunking?:
    | SmoothChunkingStrategy
    | RegExp
    | ((buffer: string) => string | null);
}

/**
 * Configuration options for UI streaming mode
 */
export interface StreamOptions {
  /**
   * Enable UI-focused streaming mode
   * @default true (simplified events for better DX)
   */
  enabled?: boolean;

  /**
   * Whether to show real-time token streaming in the UI
   * @default true
   */
  showTokenStream?: boolean;

  /**
   * Minimum interval between message updates (in milliseconds)
   * Helps prevent UI flicker with very fast token streams
   * @default 30
   */
  updateInterval?: number;

  /**
   * Whether to include token usage information in metadata
   * @default false
   */
  includeUsage?: boolean;

  /**
   * Custom tool descriptions for better UI display
   * Maps tool names to human-readable descriptions
   */
  toolDescriptions?: Record<string, string>;

  /**
   * Whether to automatically retry on recoverable errors
   * @default true
   */
  autoRetry?: boolean;

  /**
   * Maximum number of retry attempts
   * @default 3
   */
  maxRetries?: number;

  /**
   * Smooth streaming options
   */
  smooth?: SmoothStreamOptions;
}

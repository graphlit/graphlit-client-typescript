here's our current TS code for 'streamConversation' which kicks off the LLM tool calling loop, and has optional chunking on top of the SSE streaming.  read over this and prepare advice on ways to clean this up, or anything logically that it's doing wrong.


/**
 * Simplified event types for UI-focused streaming
 * These events map directly to common chat UI patterns
 */

export interface UIStreamMessage {
  /** Current accumulated message text */
  text: string;
  /** Whether the message is still being generated */
  isStreaming: boolean;
  /** Unique message ID */
  messageId?: string;
}

export interface UIStreamToolCall {
  /** Tool being called */
  name: string;
  /** Human-readable description of what the tool is doing */
  description?: string;
  /** Current status of the tool execution */
  status: "preparing" | "executing" | "completed" | "failed";
  /** Result of the tool call (when completed) */
  result?: any;
  /** Error message (when failed) */
  error?: string;
}

export interface UIStreamMetadata {
  /** Conversation ID */
  conversationId: string;
  /** Timestamp of the event */
  timestamp: Date;
  /** Model being used */
  model?: string;
  /** Token usage information */
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

/**
 * Simplified UI-focused streaming events
 */
export type UIStreamEvent =
  | {
      type: "conversation_started";
      metadata: UIStreamMetadata;
    }
  | {
      type: "message_update";
      message: UIStreamMessage;
      metadata: UIStreamMetadata;
    }
  | {
      type: "tool_update";
      tool: UIStreamToolCall;
      metadata: UIStreamMetadata;
    }
  | {
      type: "conversation_completed";
      finalMessage: string;
      tools?: UIStreamToolCall[];
      metadata: UIStreamMetadata;
    }
  | {
      type: "error";
      error: {
        message: string;
        code?: string;
        recoverable?: boolean;
      };
      metadata: UIStreamMetadata;
    };


/**
 * Streaming mode configuration for conversation streaming
 * Explicitly defines whether to use native provider streaming or fallback to GraphQL
 */
export type StreamingMode =
  | { mode: "fallback" }
  | { mode: "native"; openai: any } // Will be OpenAI type when available
  | { mode: "native"; anthropic: any } // Will be Anthropic type when available
  | { mode: "native"; google: any }; // Will be GoogleGenerativeAI type when available

/**
 * Helper type guards for streaming mode
 */
export function isNativeMode(
  streaming?: StreamingMode
): streaming is Extract<StreamingMode, { mode: "native" }> {
  return streaming?.mode === "native";
}

export function isFallbackMode(
  streaming?: StreamingMode
): streaming is Extract<StreamingMode, { mode: "fallback" }> {
  return streaming?.mode === "fallback" || !streaming;
}

// Smooth streaming configuration
export enum SmoothChunkingStrategy {
  Word = "word",
  Line = "line",
  Sentence = "sentence",
  Character = "character",
  JsonAware = "json-aware",
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
import { StreamEvent } from "../client.js";
import { SmoothChunkingStrategy, StreamOptions } from "../types/streaming.js";
import {
  UIStreamEvent,
  UIStreamMessage,
  UIStreamToolCall,
  UIStreamMetadata,
} from "../types/ui-events.js";

/**
 * Adapter that transforms low-level streaming events into high-level UI events
 */
export class UIEventAdapter {
  private options: Required<StreamOptions>;
  private metadata: UIStreamMetadata;
  private currentMessage: string = "";
  private activeToolCalls: Map<string, UIStreamToolCall> = new Map();
  private lastUpdateTime: number = 0;
  private updateTimer?: ReturnType<typeof globalThis.setTimeout>;
  private pendingMessageUpdate?: UIStreamMessage;
  private isStreaming: boolean = false;
  private errorCount: number = 0;

  // Smooth streaming support
  private tokenBuffer: string = "";
  private smoothOptions?: any;
  private chunkingFunction?: (buffer: string) => string | null;
  private chunkDelay: number = 30;
  private chunkQueue: string[] = [];
  private chunkTimer?: ReturnType<typeof globalThis.setTimeout>;
  private _loggedOnce?: boolean;

  constructor(
    private onUIEvent: (event: UIStreamEvent) => void,
    options: StreamOptions = {},
    conversationId: string,
    model?: string
  ) {
    // Apply defaults
    this.options = {
      enabled: true,
      showTokenStream: true,
      updateInterval: 30,
      includeUsage: false,
      toolDescriptions: {},
      autoRetry: true,
      maxRetries: 3,
      smooth: {},
      ...options,
    };

    this.metadata = {
      conversationId,
      timestamp: new Date(),
      model,
    };

    // Initialize smooth streaming if provided
    if (options?.smooth?.enabled !== false) {
      this.smoothOptions = options.smooth;
      this.chunkDelay = options.smooth?.delay || 30;
      this.chunkingFunction = this.createChunkingFunction(
        options.smooth?.chunking
      );
      console.log(🔷 UIEventAdapter: Smooth streaming initialized with:, {
        enabled: true, // enabled !== false is always true here
        chunking: options.smooth?.chunking || 'word (default)',
        delay: this.chunkDelay
      });
    } else {
      console.log(🔷 UIEventAdapter: Smooth streaming disabled);
    }
  }

  private createChunkingFunction(
    chunking: any
  ): (buffer: string) => string | null {
    if (typeof chunking === "function") {
      return chunking;
    }

    switch (chunking) {
      case SmoothChunkingStrategy.Word:
        return (buf: string) => {
          // Match optional leading spaces followed by a word
          const match = buf.match(/^(\s*\S+)/);
          return match ? match[0] : null;
        };

      case SmoothChunkingStrategy.Character:
        // Always return exactly one character
        return (buf: string) => (buf.length > 0 ? buf.charAt(0) : null);

      case SmoothChunkingStrategy.Sentence:
        return (buf: string) => {
          const match = buf.match(/([^.!?]*[.!?]\s*)/);
          return match ? match[0] : null;
        };

      default:
        // Default to word chunking
        return (buf: string) => {
          const match = buf.match(/^(\S+\s?)/);
          return match ? match[0] : null;
        };
    }
  }

  /**
   * Set tool execution result directly (for tool handlers)
   */
  public setToolResult(toolCallId: string, result: any, error?: string): void {
    const uiToolCall = this.activeToolCalls.get(toolCallId);
    if (uiToolCall) {
      if (error) {
        uiToolCall.status = "failed";
        uiToolCall.error = error;
      } else {
        uiToolCall.status = "completed";
        uiToolCall.result = result;
      }

      this.emitUIEvent({
        type: "tool_update",
        tool: { ...uiToolCall },
        metadata: { ...this.metadata },
      });
    }
  }

  /**
   * Process a raw streaming event and emit appropriate UI events
   */
  public handleEvent(event: StreamEvent): void {
    switch (event.type) {
      case "start":
        this.handleStart(event.conversationId);
        break;

      case "token":
        if (this.options.showTokenStream) {
          this.handleToken(event.token);
        }
        break;

      case "message":
        this.handleMessage(event.message);
        break;

      case "tool_call_start":
        this.handleToolCallStart(event.toolCall);
        break;

      case "tool_call_delta":
        this.handleToolCallDelta(event.toolCallId, event.argumentDelta);
        break;

      case "tool_call_complete":
        this.handleToolCallComplete(event.toolCall);
        break;

      case "complete":
        this.handleComplete(event.messageId, event.conversationId);
        break;

      case "error":
        this.handleError(event.error);
        break;
    }
  }

  private handleStart(conversationId: string): void {
    this.conversationId = conversationId;
    this.metadata.timestamp = new Date();
    this.isStreaming = true;

    this.emitUIEvent({
      type: "conversation_started",
      metadata: { ...this.metadata },
    });
  }

  private handleToken(token: string): void {
    // Check if we should use chunking
    const shouldUseChunking = this.chunkingFunction && this.smoothOptions?.enabled !== false;
    
    // Debug logging - comment out after fixing
    if (!this._loggedOnce) {
      console.log(🔷 UIEventAdapter.handleToken: First token received, {
        tokenLength: token.length,
        shouldUseChunking,
        hasChunkingFunction: !!this.chunkingFunction,
        smoothEnabled: this.smoothOptions?.enabled !== false,
        chunking: this.smoothOptions?.chunking
      });
      this._loggedOnce = true;
    }
    
    if (!shouldUseChunking) {
      // When smooth streaming is disabled or no chunking function, pass through native LLM chunks
      // Each token from the LLM is treated as a complete chunk
      this.currentMessage += token;
      this.scheduleMessageUpdate();
    } else {
      // Use smooth streaming with chunking strategy
      // Add token to buffer first
      this.tokenBuffer += token;

      // For word and character chunking, we need to queue chunks
      if (
        this.smoothOptions?.chunking === SmoothChunkingStrategy.Character ||
        this.smoothOptions?.chunking === SmoothChunkingStrategy.Word
      ) {
        // Extract all available chunks and add to queue
        let chunk: string | null;
        const wasEmpty = this.chunkQueue.length === 0;

        while ((chunk = this.chunkingFunction!(this.tokenBuffer)) !== null) {
          this.chunkQueue.push(chunk);
          this.tokenBuffer = this.tokenBuffer.slice(chunk.length);
        }

        // Only start processing if queue was empty and timer isn't running
        // This ensures proper delays between all chunks
        if (wasEmpty && !this.chunkTimer) {
          this.processChunkQueue();
        }
      } else {
        // For sentence chunking, process normally
        let chunk: string | null;
        while ((chunk = this.chunkingFunction!(this.tokenBuffer)) !== null) {
          this.currentMessage += chunk;
          this.tokenBuffer = this.tokenBuffer.slice(chunk.length);
          this.scheduleMessageUpdate();
        }
      }
    }
  }

  private processChunkQueue(): void {
    // If already processing or no chunks, return
    if (this.chunkTimer || this.chunkQueue.length === 0) {
      return;
    }

    // For consistent delays, always use setTimeout even for the current chunk
    // This ensures the delay is applied between ALL chunks
    this.chunkTimer = globalThis.setTimeout(() => {
      this.chunkTimer = undefined;

      // Process next chunk
      const nextChunk = this.chunkQueue.shift();
      if (nextChunk) {
        this.currentMessage += nextChunk;
        this.emitMessageUpdate(true);

        // Process next chunk if any
        if (this.chunkQueue.length > 0) {
          this.processChunkQueue();
        }
      }
    }, this.chunkDelay);
  }

  private handleMessage(message: string): void {
    this.currentMessage = message;
    this.emitMessageUpdate(false);
  }

  private handleToolCallStart(toolCall: { id: string; name: string }): void {
    const description =
      this.options.toolDescriptions[toolCall.name] ||
      Executing ${toolCall.name};

    const uiToolCall: UIStreamToolCall = {
      name: toolCall.name,
      description,
      status: "preparing",
    };

    this.activeToolCalls.set(toolCall.id, uiToolCall);

    this.emitUIEvent({
      type: "tool_update",
      tool: { ...uiToolCall },
      metadata: { ...this.metadata },
    });
  }

  private handleToolCallDelta(toolCallId: string, argumentDelta: string): void {
    const toolCall = this.activeToolCalls.get(toolCallId);
    if (toolCall && toolCall.status === "preparing") {
      toolCall.status = "executing";

      this.emitUIEvent({
        type: "tool_update",
        tool: { ...toolCall },
        metadata: { ...this.metadata },
      });
    }
  }

  private handleToolCallComplete(toolCall: {
    id: string;
    name: string;
    arguments: string;
  }): void {
    const uiToolCall = this.activeToolCalls.get(toolCall.id);
    if (uiToolCall) {
      try {
        uiToolCall.result = JSON.parse(toolCall.arguments);
        uiToolCall.status = "completed";
      } catch (e) {
        uiToolCall.status = "failed";
        uiToolCall.error = "Failed to parse tool response";
      }

      this.emitUIEvent({
        type: "tool_update",
        tool: { ...uiToolCall },
        metadata: { ...this.metadata },
      });
    }
  }

  private handleComplete(messageId?: string, conversationId?: string): void {
    // Clear chunk timer if active
    if (this.chunkTimer) {
      globalThis.clearTimeout(this.chunkTimer);
      this.chunkTimer = undefined;
    }

    // Process any remaining chunks in the queue immediately
    while (this.chunkQueue.length > 0) {
      const chunk = this.chunkQueue.shift();
      if (chunk) {
        this.currentMessage += chunk;
      }
    }

    // Flush any remaining tokens in the buffer
    if (this.smoothOptions?.enabled && this.tokenBuffer.length > 0) {
      this.currentMessage += this.tokenBuffer;
      this.tokenBuffer = "";
    }

    // Clear any pending updates
    if (this.updateTimer) {
      globalThis.clearTimeout(this.updateTimer);
      this.updateTimer = undefined;
    }

    // Emit final message update if needed
    if (this.pendingMessageUpdate || this.tokenBuffer.length > 0) {
      this.emitMessageUpdate(false);
    }

    this.isStreaming = false;

    // Collect all tool calls
    const tools = Array.from(this.activeToolCalls.values());

    this.emitUIEvent({
      type: "conversation_completed",
      finalMessage: this.currentMessage,
      tools: tools.length > 0 ? tools : undefined,
      metadata: {
        ...this.metadata,
        conversationId: conversationId || this.conversationId,
      },
    });
  }

  private handleError(error: string): void {
    this.errorCount++;
    const isRecoverable =
      this.options.autoRetry && this.errorCount < this.options.maxRetries;

    this.emitUIEvent({
      type: "error",
      error: {
        message: error,
        recoverable: isRecoverable,
      },
      metadata: { ...this.metadata },
    });

    if (!isRecoverable) {
      this.isStreaming = false;
    }
  }

  private scheduleMessageUpdate(): void {
    const now = Date.now();
    const timeSinceLastUpdate = now - this.lastUpdateTime;

    // Use chunk delay if smooth streaming is enabled
    const updateInterval = this.smoothOptions?.enabled
      ? this.chunkDelay
      : this.options.updateInterval;

    // Store pending update
    this.pendingMessageUpdate = {
      text: this.currentMessage,
      isStreaming: this.isStreaming,
      messageId: this.conversationId,
    };

    // If enough time has passed, update immediately
    if (timeSinceLastUpdate >= updateInterval) {
      this.emitMessageUpdate(true);
      return;
    }

    // Otherwise, schedule an update
    if (!this.updateTimer) {
      const delay = updateInterval - timeSinceLastUpdate;
      this.updateTimer = globalThis.setTimeout(() => {
        this.emitMessageUpdate(true);
      }, delay);
    }
  }

  private emitMessageUpdate(isStreaming: boolean): void {
    this.lastUpdateTime = Date.now();

    if (this.updateTimer) {
      globalThis.clearTimeout(this.updateTimer);
      this.updateTimer = undefined;
    }

    const message: UIStreamMessage = {
      text: this.currentMessage,
      isStreaming,
      messageId: this.conversationId,
    };

    this.emitUIEvent({
      type: "message_update",
      message,
      metadata: { ...this.metadata },
    });

    this.pendingMessageUpdate = undefined;
  }

  private emitUIEvent(event: UIStreamEvent): void {
    // Update timestamp for each event
    event.metadata.timestamp = new Date();
    this.onUIEvent(event);
  }

  /**
   * Clean up any pending timers
   */
  public dispose(): void {
    if (this.updateTimer) {
      globalThis.clearTimeout(this.updateTimer);
      this.updateTimer = undefined;
    }
    if (this.chunkTimer) {
      globalThis.clearTimeout(this.chunkTimer);
      this.chunkTimer = undefined;
    }
    this.activeToolCalls.clear();
    this.chunkQueue = [];
  }
}





  /**
   * Stream a conversation using native LLM clients for real-time token streaming
   *
   * @param prompt - The user prompt to send
   * @param onEvent - Callback function to handle streaming events (UIStreamEvent by default, StreamEvent if ui.enabled=false)
   * @param conversationId - Optional existing conversation ID to continue
   * @param specification - Specification object with at least an id property
   * @param tools - Optional array of tool definitions
   * @param streaming - Streaming mode configuration
   * @param toolHandlers - Optional tool handler functions
   * @param options - Streaming options including UI mode configuration (UI mode is enabled by default)
   * @param mimeType - Optional MIME type for data
   * @param data - Optional base64 encoded data
   *
   * @example
   * // Default: UI streaming mode (simplified events)
   * await client.streamConversation(
   *   "Hello!",
   *   (event: UIStreamEvent) => {
   *     if (event.type === 'message_update') {
   *       console.log(event.message.message);
   *     }
   *   }
   * );
   *
   * @example
   * // Opt-out to get raw streaming events
   * await client.streamConversation(
   *   "Hello!",
   *   (event: StreamEvent) => {
   *     if (event.type === 'token') {
   *       console.log(event.token);
   *     }
   *   },
   *   undefined,
   *   undefined,
   *   undefined,
   *   undefined,
   *   undefined,
   *   { ui: { enabled: false } }
   * );
   */
  public async streamConversation(
    prompt: string,
    onEvent: ((event: StreamEvent) => void) | ((event: UIStreamEvent) => void),
    conversationId?: string,
    specification?: Types.EntityReferenceInput,
    tools?: Types.ToolDefinitionInput[],
    toolHandlers?: ToolHandlers,
    streaming?: StreamingMode,
    options?: StreamOptions,
    mimeType?: string,
    data?: string,
    correlationId?: string
  ): Promise<void> {
    // Get the full specification details if only ID is provided
    let fullSpecification: Types.Specification | undefined;
    let uiAdapter: UIEventAdapter | undefined;

    // Extract streaming clients from StreamingMode
    let streamingClients:
      | { openai?: any; anthropic?: any; google?: any }
      | undefined;
    if (streaming?.mode === "native") {
      streamingClients = {
        openai: (streaming as any).openai,
        anthropic: (streaming as any).anthropic,
        google: (streaming as any).google,
      };
    }
    // If mode is 'fallback' or undefined, streamingClients remains undefined

    try {
      if (specification?.id) {
        const specResponse = await this.getSpecification(specification.id);
        fullSpecification = specResponse.specification as Types.Specification;
      }

      // Get service type and model name for streaming configuration
      const serviceType = getServiceType(fullSpecification) as
        | Types.ModelServiceTypes
        | undefined;
      const modelName = getModelName(fullSpecification);

      // If no conversation ID, create one first to get the REAL ID
      let actualConversationId: string;
      if (!conversationId) {
        const createResponse = await this.createConversation(
          {
            name: Streaming conversation,
            specification: specification,
            tools: tools,
          },
          correlationId
        );
        const newConversationId = createResponse.createConversation?.id;
        if (!newConversationId) {
          throw new Error("Failed to create conversation");
        }
        actualConversationId = newConversationId;
      } else {
        actualConversationId = conversationId;
      }

      // Create UI event handler with REAL conversation ID
      const { handler: eventHandler, adapter } = this.createUIEventHandler(
        onEvent,
        options,
        actualConversationId,
        modelName
      );
      uiAdapter = adapter;

      let smoothEventHandler: (event: StreamEvent) => void;

      // Apply smooth streaming if in raw mode (UI mode is now default)
      const uiEnabled = options?.enabled !== false; // Default to true

      if (!uiEnabled) {
        // Raw mode - apply smooth streaming
        const smoothOptions: SmoothStreamOptions = {
          enabled: true, // Default to enabled
          ...options?.smooth,
        };
        smoothEventHandler = createSmoothEventHandler(
          eventHandler,
          smoothOptions,
          serviceType
        );
      } else {
        // UI mode (default) - use the UI event handler directly
        smoothEventHandler = eventHandler;
      }

      // Check if streaming is supported
      const streamingSupportedForSpec =
        fullSpecification && isStreamingSupported(serviceType);

      if (!streamingSupportedForSpec) {
        // Fall back to regular promptConversation
        smoothEventHandler({
          type: "start",
          conversationId: actualConversationId,
        });

        const response = await this.promptConversation(
          prompt,
          actualConversationId,
          specification,
          mimeType,
          data,
          tools,
          false,
          false,
          correlationId
        );

        const message = response.promptConversation?.message;
        if (message?.message) {
          smoothEventHandler({ type: "message", message: message.message });
        }

        if (message?.toolCalls) {
          for (const toolCall of message.toolCalls) {
            if (toolCall) {
              smoothEventHandler({
                type: "tool_call_complete",
                toolCall: {
                  id: toolCall.id || "",
                  name: toolCall.name || "",
                  arguments: toolCall.arguments || "",
                },
              });
            }
          }
        }

        smoothEventHandler({
          type: "complete",
          messageId: undefined, // Message doesn't have id in this context
          conversationId: actualConversationId,
        });
        return;
      }

      // Prepare for streaming - we'll handle formatting differently for fallback vs native
      let formattedPrompt: string | undefined;
      let formatResponse: any;

      // Build messages array for LLM SDK
      let formattedMessages: any[] = [];

      // Start streaming based on the model service
      smoothEventHandler({
        type: "start",
        conversationId: actualConversationId!,
      });

      let fullMessage = "";
      let toolCalls: any[] = [];

      if (
        serviceType === Types.ModelServiceTypes.OpenAi &&
        streamingClients?.openai &&
        fullSpecification
      ) {
        // Native streaming path: Use formatConversation
        console.log(
          🔷 SDK: Calling formatConversation for conversation ${actualConversationId}
        );
        formatResponse = await this.formatConversation(
          prompt,
          actualConversationId,
          specification,
          tools,
          true,
          correlationId
        );

        // Get the formatted prompt from formatConversation
        formattedPrompt = formatResponse.formatConversation?.message?.message;
        if (!formattedPrompt) {
          throw new Error("Failed to format conversation for streaming");
        }

        // Add system prompt if specified
        if (fullSpecification.systemPrompt) {
          formattedMessages.push({
            role: "system",
            content: fullSpecification.systemPrompt,
          });
        }

        // Get existing conversation messages if this is a continued conversation
        if (conversationId) {
          const conversationResponse = await this.getConversation(
            actualConversationId!
          );
          const conversation = conversationResponse.conversation;

          if (conversation?.messages && conversation.messages.length > 0) {
            // Add previous messages (excluding the current one we just added with formatConversation)
            const previousMessages = this.formatMessagesForLLM(
              conversation.messages.slice(0, -1) as Types.ConversationMessage[]
            );
            formattedMessages.push(...previousMessages);
          }
        }

        // Add the current formatted user message
        formattedMessages.push({
          role: "user",
          content: formattedPrompt,
        });

        await this.streamWithOpenAI(
          fullSpecification,
          formattedMessages,
          tools,
          streamingClients.openai,
          smoothEventHandler,
          (message, calls) => {
            fullMessage = message;
            toolCalls = calls;
          }
        );
      } else if (
        serviceType === Types.ModelServiceTypes.Anthropic &&
        streamingClients?.anthropic &&
        fullSpecification
      ) {
        // Native streaming path: Use formatConversation
        console.log(
          🔷 SDK: Calling formatConversation for conversation ${actualConversationId}
        );
        formatResponse = await this.formatConversation(
          prompt,
          actualConversationId,
          specification,
          tools,
          true,
          correlationId
        );

        // Get the formatted prompt from formatConversation
        formattedPrompt = formatResponse.formatConversation?.message?.message;
        if (!formattedPrompt) {
          throw new Error("Failed to format conversation for streaming");
        }

        // Add system prompt if specified
        if (fullSpecification.systemPrompt) {
          formattedMessages.push({
            role: "system",
            content: fullSpecification.systemPrompt,
          });
        }

        // Get existing conversation messages if this is a continued conversation
        if (conversationId) {
          const conversationResponse = await this.getConversation(
            actualConversationId!
          );
          const conversation = conversationResponse.conversation;

          if (conversation?.messages && conversation.messages.length > 0) {
            // Add previous messages (excluding the current one we just added with formatConversation)
            const previousMessages = this.formatMessagesForLLM(
              conversation.messages.slice(0, -1) as Types.ConversationMessage[]
            );
            formattedMessages.push(...previousMessages);
          }
        }

        // Add the current formatted user message
        formattedMessages.push({
          role: "user",
          content: formattedPrompt,
        });

        await this.streamWithAnthropic(
          fullSpecification,
          formattedMessages,
          tools,
          streamingClients.anthropic,
          smoothEventHandler,
          (message, calls) => {
            fullMessage = message;
            toolCalls = calls;
          }
        );
      } else if (
        serviceType === Types.ModelServiceTypes.Google &&
        streamingClients?.google &&
        fullSpecification
      ) {
        // Native streaming path: Use formatConversation
        console.log(
          🔷 SDK: Calling formatConversation for conversation ${actualConversationId}
        );
        formatResponse = await this.formatConversation(
          prompt,
          actualConversationId,
          specification,
          tools,
          true,
          correlationId
        );

        // Get the formatted prompt from formatConversation
        formattedPrompt = formatResponse.formatConversation?.message?.message;
        if (!formattedPrompt) {
          throw new Error("Failed to format conversation for streaming");
        }

        // Add system prompt if specified
        if (fullSpecification.systemPrompt) {
          formattedMessages.push({
            role: "system",
            content: fullSpecification.systemPrompt,
          });
        }

        // Get existing conversation messages if this is a continued conversation
        if (conversationId) {
          const conversationResponse = await this.getConversation(
            actualConversationId!
          );
          const conversation = conversationResponse.conversation;

          if (conversation?.messages && conversation.messages.length > 0) {
            // Add previous messages (excluding the current one we just added with formatConversation)
            const previousMessages = this.formatMessagesForLLM(
              conversation.messages.slice(0, -1) as Types.ConversationMessage[]
            );
            formattedMessages.push(...previousMessages);
          }
        }

        // Add the current formatted user message
        formattedMessages.push({
          role: "user",
          content: formattedPrompt,
        });

        await this.streamWithGoogle(
          fullSpecification,
          formattedMessages,
          prompt,
          streamingClients.google,
          smoothEventHandler,
          (message) => {
            fullMessage = message;
          }
        );
      } else {
        // Fall back to regular promptConversation when streaming client is not available
        console.log(
          📱 Fallback: No streaming client available for ${serviceType}, using regular API
        );

        console.log(
          🔷 SDK: Calling promptConversation (fallback mode) for conversation ${actualConversationId}
        );
        const response = await this.promptConversation(
          prompt,
          actualConversationId,
          specification,
          mimeType,
          data,
          tools,
          false,
          false,
          correlationId
        );

        const message = response.promptConversation?.message;
        if (message?.message) {
          // Simulate streaming by breaking the message into appropriate "tokens"
          const content = message.message;

          // Check if the content looks like JSON
          const isJsonLike =
            content.trim().startsWith("{") || content.trim().startsWith("[");

          if (isJsonLike) {
            // For JSON-like content, split by characters but respect structure
            let currentToken = "";
            let inString = false;
            let escapeNext = false;

            for (let i = 0; i < content.length; i++) {
              const char = content[i];
              currentToken += char;

              if (escapeNext) {
                escapeNext = false;
                continue;
              }

              if (char === "\\") {
                escapeNext = true;
                continue;
              }

              if (char === '"') {
                inString = !inString;
              }

              // Emit token at logical boundaries
              if (
                !inString &&
                (char === "," || char === "}" || char === "]" || char === "\n")
              ) {
                smoothEventHandler({ type: "token", token: currentToken });
                currentToken = "";
              } else if (currentToken.length >= 10) {
                // Emit chunks of reasonable size to simulate streaming
                smoothEventHandler({ type: "token", token: currentToken });
                currentToken = "";
              }
            }

            // Emit any remaining content
            if (currentToken) {
              smoothEventHandler({ type: "token", token: currentToken });
            }
          } else {
            // For regular text, split by words as before
            const words = content.split(" ");
            for (let i = 0; i < words.length; i++) {
              const token = i === 0 ? words[i] : " " + words[i];
              smoothEventHandler({ type: "token", token });
            }
          }

          // Send the complete message
          smoothEventHandler({ type: "message", message: content });
          fullMessage = content;
        }

        // Handle tool calls if any
        if (message?.toolCalls && message.toolCalls.length > 0) {
          // Store tool calls for processing
          toolCalls = message.toolCalls.map((tc: any) => ({
            id: tc.id || tool-${Date.now()},
            name: tc.name || "",
            arguments: tc.arguments || "",
          }));

          // Emit tool call events
          for (const toolCall of toolCalls) {
            smoothEventHandler({
              type: "tool_call_start",
              toolCall: {
                id: toolCall.id,
                name: toolCall.name,
              },
            });
          }
        }

        // Don't return early - continue to tool execution below
      }

      // Fire message event with the complete message
      if (fullMessage) {
        smoothEventHandler({
          type: "message",
          message: fullMessage,
        });
      }

      // If we have tool calls, handle them (both for native streaming and fallback)
      if (toolCalls.length > 0 && toolHandlers) {
        // Execute tools locally with proper event emission
        const toolResults = await Promise.all(
          toolCalls.map(async (toolCall) => {
            const handler = toolHandlers[toolCall.name];
            if (!handler) {
              // If UI adapter exists, set the tool error directly
              if (uiAdapter) {
                uiAdapter.setToolResult(
                  toolCall.id,
                  null,
                  No handler for tool: ${toolCall.name}
                );
              }

              // Emit tool completion without result/error (will be handled by UI adapter)
              smoothEventHandler({
                type: "tool_call_complete",
                toolCall: {
                  id: toolCall.id,
                  name: toolCall.name,
                  arguments: toolCall.arguments,
                },
              });

              return {
                role: "tool" as const,
                tool_call_id: toolCall.id,
                content: JSON.stringify({
                  error: No handler for tool: ${toolCall.name},
                }),
              };
            }

            try {
              const args =
                typeof toolCall.arguments === "string"
                  ? JSON.parse(toolCall.arguments)
                  : toolCall.arguments;

              const result = await handler(args);

              // If UI adapter exists, set the tool result directly
              if (uiAdapter) {
                uiAdapter.setToolResult(toolCall.id, result);
              }

              // Emit tool execution complete event for raw mode
              smoothEventHandler({
                type: "tool_call_complete",
                toolCall: {
                  id: toolCall.id,
                  name: toolCall.name,
                  arguments: toolCall.arguments,
                },
              });

              return {
                role: "tool" as const,
                tool_call_id: toolCall.id,
                content: JSON.stringify(result),
              };
            } catch (error) {
              // If UI adapter exists, set the tool error directly
              if (uiAdapter) {
                uiAdapter.setToolResult(
                  toolCall.id,
                  null,
                  error instanceof Error ? error.message : String(error)
                );
              }

              // Emit tool error event
              smoothEventHandler({
                type: "tool_call_complete",
                toolCall: {
                  id: toolCall.id,
                  name: toolCall.name,
                  arguments: toolCall.arguments,
                },
              });

              return {
                role: "tool" as const,
                tool_call_id: toolCall.id,
                content: JSON.stringify({
                  error:
                    error instanceof Error
                      ? error.message
                      : "Tool execution failed",
                }),
              };
            }
          })
        );

        // Continue streaming directly with the LLM (not through backend)
        // Add the assistant message with tool calls and tool responses to the messages
        let updatedMessages: any[];

        if (serviceType === Types.ModelServiceTypes.Anthropic) {
          // Anthropic expects tool results to be part of a user message
          updatedMessages = [
            ...formattedMessages,
            {
              role: "assistant",
              content: fullMessage || "",
              tool_use: toolCalls.map((tc) => ({
                id: tc.id,
                name: tc.name,
                input:
                  typeof tc.arguments === "string"
                    ? (() => {
                        try {
                          return JSON.parse(tc.arguments);
                        } catch (e) {
                          console.warn(
                            Invalid JSON arguments for tool ${tc.name}:,
                            e
                          );
                          return {};
                        }
                      })()
                    : tc.arguments,
              })),
            },
            {
              role: "user",
              content: toolResults.map((result) => ({
                type: "tool_result",
                tool_use_id: result.tool_call_id,
                content: result.content,
              })),
            },
          ];
        } else {
          // OpenAI format
          updatedMessages = [
            ...formattedMessages,
            {
              role: "assistant",
              content: fullMessage || "",
              tool_calls: toolCalls.map((tc) => ({
                id: tc.id,
                type: "function",
                function: {
                  name: tc.name,
                  arguments: tc.arguments,
                },
              })),
            },
            ...toolResults,
          ];
        }

        // Stream again with tool results to get final response
        let finalMessage = "";
        let finalToolCalls: any[] = [];

        if (
          serviceType === Types.ModelServiceTypes.OpenAi &&
          streamingClients?.openai &&
          fullSpecification
        ) {
          await this.streamWithOpenAI(
            fullSpecification,
            updatedMessages,
            tools,
            streamingClients.openai,
            smoothEventHandler,
            (message, calls) => {
              finalMessage = message;
              finalToolCalls = calls;
            }
          );
        } else if (
          serviceType === Types.ModelServiceTypes.Anthropic &&
          streamingClients?.anthropic &&
          fullSpecification
        ) {
          await this.streamWithAnthropic(
            fullSpecification,
            updatedMessages,
            tools,
            streamingClients.anthropic,
            smoothEventHandler,
            (message, calls) => {
              finalMessage = message;
              finalToolCalls = calls;
            }
          );
        } else {
          // Fallback mode: Continue conversation with tool results
          console.log("📱 Continuing fallback conversation with tool results");

          // Format the tool results for the API
          const toolResponses: Types.ConversationToolResponseInput[] =
            toolResults.map((r) => {
              const toolCallId = r.tool_call_id;
              const content = r.content;

              return {
                id: toolCallId,
                content: content,
              };
            });

          // Continue the conversation with tool results
          console.log(
            🔷 SDK: Calling continueConversation with ${toolResponses.length} tool responses for conversation ${actualConversationId}
          );
          const continueResponse = await this.continueConversation(
            actualConversationId,
            toolResponses,
            correlationId
          );

          const continuedMessage =
            continueResponse.continueConversation?.message;
          if (continuedMessage?.message) {
            finalMessage = continuedMessage.message;

            // Simulate streaming the continued response
            const words = finalMessage.split(" ");
            for (let i = 0; i < words.length; i++) {
              const token = i === 0 ? words[i] : " " + words[i];
              smoothEventHandler({ type: "token", token });
            }
          }
        }

        // Update fullMessage with the final response after tool execution
        fullMessage = finalMessage || fullMessage;
        toolCalls = finalToolCalls.length > 0 ? finalToolCalls : toolCalls;

        // Emit the final message event after tool execution
        if (fullMessage) {
          smoothEventHandler({
            type: "message",
            message: fullMessage,
          });
        }
      }

      // Complete the conversation with the full message (only for native streaming)
      if (actualConversationId) {
        // Only call completeConversation if we used formatConversation (native streaming path)
        if (fullMessage && formatResponse) {
          try {
            console.log(
              🔷 SDK: Calling completeConversation with message for conversation ${actualConversationId}
            );
            const completeResponse = await this.completeConversation(
              fullMessage,
              actualConversationId,
              correlationId
            );
          } catch (completeError) {
            console.error(
              ❌ SDK: Failed to complete conversation ${actualConversationId}:,
              completeError
            );

            // Get conversation state for debugging
            try {
              console.log(
                🔷 SDK: Getting conversation state for debugging...
              );
              const convState =
                await this.getConversation(actualConversationId);
              console.log(
                📋 Conversation state:,
                JSON.stringify(convState.conversation, null, 2)
              );
            } catch (getError) {
              console.error(
                ❌ SDK: Failed to get conversation state:,
                getError
              );
            }

            throw completeError;
          }
        }

        smoothEventHandler({
          type: "complete",
          messageId: undefined,
          conversationId: actualConversationId,
        });
      }
    } catch (error) {
      throw error; // Re-throw to ensure proper error handling
    } finally {
      // Clean up UI adapter if it was created
      if (uiAdapter) {
        uiAdapter.dispose();
      }
    }
  }
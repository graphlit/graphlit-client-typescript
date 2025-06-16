import {
  ConversationMessage,
  ConversationToolCall,
  ConversationRoleTypes,
} from "../generated/graphql-types.js";
import { AgentStreamEvent, ToolExecutionStatus } from "../types/ui-events.js";
import { StreamEvent } from "../types/internal.js";
import { ChunkBuffer, ChunkingStrategy } from "./chunk-buffer.js";

/**
 * Adapter that transforms low-level streaming events into high-level UI events
 * using GraphQL types for type safety
 */
export class UIEventAdapter {
  private conversationId: string;
  private model?: string;
  private modelService?: string;
  private tokenCount: number = 0;
  private currentMessage: string = "";
  private isStreaming: boolean = false;
  private conversationStartTime: number = 0; // When user sent the message
  private streamStartTime: number = 0; // When streaming actually began
  private firstTokenTime: number = 0;
  private lastTokenTime: number = 0;
  private tokenDelays: number[] = [];
  private activeToolCalls: Map<
    string,
    { toolCall: ConversationToolCall; status: ToolExecutionStatus }
  > = new Map();
  private lastUpdateTime: number = 0;
  private updateTimer?: ReturnType<typeof globalThis.setTimeout>;
  private chunkBuffer?: ChunkBuffer;
  private smoothingDelay: number = 30;
  private chunkQueue: string[] = []; // Queue of chunks waiting to be emitted
  private contextWindowUsage?: {
    usedTokens: number;
    maxTokens: number;
    percentage: number;
    remainingTokens: number;
  };

  constructor(
    private onEvent: (event: AgentStreamEvent) => void,
    conversationId: string,
    options: {
      smoothingEnabled?: boolean;
      chunkingStrategy?: ChunkingStrategy;
      smoothingDelay?: number;
      model?: string;
      modelService?: string;
    } = {},
  ) {
    this.conversationId = conversationId;
    this.smoothingDelay = options.smoothingDelay ?? 30;
    this.model = options.model;
    this.modelService = options.modelService;
    this.conversationStartTime = Date.now(); // Capture when conversation began

    if (options.smoothingEnabled) {
      this.chunkBuffer = new ChunkBuffer(options.chunkingStrategy || "word");
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
        this.handleToken(event.token);
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

      case "tool_call_parsed":
        this.handleToolCallParsed(event.toolCall);
        break;

      case "tool_call_complete":
        this.handleToolCallComplete(event.toolCall, event.result, event.error);
        break;

      case "complete":
        this.handleComplete(event.tokens);
        break;

      case "error":
        this.handleError(event.error);
        break;

      case "context_window":
        this.handleContextWindow(event.usage);
        break;
    }
  }

  private handleStart(conversationId: string): void {
    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `🚀 [UIEventAdapter] Handle start - Conversation ID: ${conversationId}`,
      );
      console.log(
        `🚀 [UIEventAdapter] Active tool calls at start: ${this.activeToolCalls.size}`,
      );
    }

    this.conversationId = conversationId;
    this.isStreaming = true;
    this.streamStartTime = Date.now();
    this.firstTokenTime = 0;
    this.lastTokenTime = 0;
    this.tokenCount = 0;
    this.tokenDelays = [];

    // Note: We only clear tool calls here if this is truly a new conversation start
    // For multi-round tool calling, handleStart is only called once at the beginning
    if (this.activeToolCalls.size > 0) {
      console.log(
        `🚀 [UIEventAdapter] Warning: ${this.activeToolCalls.size} tool calls still active at start`,
      );
    }
    this.activeToolCalls.clear();

    this.emitUIEvent({
      type: "conversation_started",
      conversationId,
      timestamp: new Date(),
      model: this.model,
    });
  }

  private handleToken(token: string): void {
    // Track timing for first token
    const now = Date.now();
    if (this.firstTokenTime === 0) {
      this.firstTokenTime = now;
    }

    // Track inter-token delays
    if (this.lastTokenTime > 0) {
      this.tokenDelays.push(now - this.lastTokenTime);
    }
    this.lastTokenTime = now;
    this.tokenCount++;

    if (this.chunkBuffer) {
      const chunks = this.chunkBuffer.addToken(token);
      // Add chunks to queue for all chunking modes (character, word, sentence)
      this.chunkQueue.push(...chunks);
      this.scheduleChunkEmission();
    } else {
      // No chunking - emit tokens directly
      this.currentMessage += token;
      this.scheduleMessageUpdate();
    }
  }

  private handleMessage(message: string): void {
    this.currentMessage = message;
    this.emitMessageUpdate(false);
  }

  private handleToolCallStart(toolCall: { id: string; name: string }): void {
    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `🔧 [UIEventAdapter] Tool call start - ID: ${toolCall.id}, Name: ${toolCall.name}`,
      );
      console.log(
        `🔧 [UIEventAdapter] Active tool calls before: ${this.activeToolCalls.size}`,
      );
    }

    const conversationToolCall: ConversationToolCall = {
      __typename: "ConversationToolCall",
      id: toolCall.id,
      name: toolCall.name,
      arguments: "",
    };

    this.activeToolCalls.set(toolCall.id, {
      toolCall: conversationToolCall,
      status: "preparing",
    });

    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `🔧 [UIEventAdapter] Active tool calls after: ${this.activeToolCalls.size}`,
      );
    }

    this.emitUIEvent({
      type: "tool_update",
      toolCall: conversationToolCall,
      status: "preparing",
    });
  }

  private handleToolCallDelta(toolCallId: string, argumentDelta: string): void {
    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `🔧 [UIEventAdapter] Tool call delta - ID: ${toolCallId}, Delta length: ${argumentDelta.length}`,
      );
      console.log(
        `🔧 [UIEventAdapter] Delta content: ${argumentDelta.substring(0, 100)}...`,
      );
    }

    const toolData = this.activeToolCalls.get(toolCallId);
    if (toolData) {
      toolData.toolCall.arguments += argumentDelta;

      if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
        console.log(
          `🔧 [UIEventAdapter] Tool ${toolCallId} accumulated args length: ${toolData.toolCall.arguments.length}`,
        );
      }

      if (toolData.status === "preparing") {
        toolData.status = "executing";
      }

      this.emitUIEvent({
        type: "tool_update",
        toolCall: toolData.toolCall,
        status: "executing",
      });
    } else {
      console.warn(
        `🔧 [UIEventAdapter] WARNING: Tool call delta for unknown tool ID: ${toolCallId}`,
      );
    }
  }

  private handleToolCallParsed(toolCall: {
    id: string;
    name: string;
    arguments: string;
  }): void {
    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `🔧 [UIEventAdapter] Tool call parsed - ID: ${toolCall.id}, Name: ${toolCall.name}`,
      );
      console.log(
        `🔧 [UIEventAdapter] Final arguments length: ${toolCall.arguments.length}`,
      );
      console.log(
        `🔧 [UIEventAdapter] Final arguments: ${toolCall.arguments.substring(0, 200)}...`,
      );
    }

    const toolData = this.activeToolCalls.get(toolCall.id);
    if (toolData) {
      // Update the arguments with the final complete version
      toolData.toolCall.arguments = toolCall.arguments;
      // Mark as ready for execution, not completed
      toolData.status = "ready";

      this.emitUIEvent({
        type: "tool_update",
        toolCall: toolData.toolCall,
        status: "ready",
      });
    } else {
      // If we don't have this tool call tracked, create it now
      console.warn(
        `🔧 [UIEventAdapter] Tool call parsed for untracked tool ID: ${toolCall.id}, creating entry`,
      );

      const conversationToolCall: ConversationToolCall = {
        __typename: "ConversationToolCall",
        id: toolCall.id,
        name: toolCall.name,
        arguments: toolCall.arguments,
      };

      this.activeToolCalls.set(toolCall.id, {
        toolCall: conversationToolCall,
        status: "ready",
      });

      this.emitUIEvent({
        type: "tool_update",
        toolCall: conversationToolCall,
        status: "ready",
      });
    }
  }

  private handleToolCallComplete(
    toolCall: {
      id: string;
      name: string;
      arguments: string;
    },
    result?: unknown,
    error?: string,
  ): void {
    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `🔧 [UIEventAdapter] Tool call complete - ID: ${toolCall.id}, Name: ${toolCall.name}`,
      );
      console.log(
        `🔧 [UIEventAdapter] Has result: ${!!result}, Has error: ${!!error}`,
      );
    }

    const toolData = this.activeToolCalls.get(toolCall.id);
    if (toolData) {
      // Update with execution result
      toolData.status = error ? "failed" : "completed";

      this.emitUIEvent({
        type: "tool_update",
        toolCall: toolData.toolCall,
        status: toolData.status,
        result: result,
        error: error,
      });
    } else {
      console.warn(
        `🔧 [UIEventAdapter] Tool call complete for unknown tool ID: ${toolCall.id}`,
      );
    }
  }

  private handleComplete(tokens?: number): void {
    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `🔚 [UIEventAdapter] Handle complete - Active tool calls: ${this.activeToolCalls.size}`,
      );
      this.activeToolCalls.forEach((toolData, id) => {
        console.log(
          `🔚 [UIEventAdapter] Tool ${id}: ${toolData.toolCall.name}, Status: ${toolData.status}, Args length: ${toolData.toolCall.arguments.length}`,
        );
      });
    }

    // Clear any pending updates
    if (this.updateTimer) {
      globalThis.clearTimeout(this.updateTimer);
      this.updateTimer = undefined;
    }

    // Process any remaining chunks before completing
    if (this.chunkQueue.length > 0) {
      // Add all remaining chunks to current message
      const remainingChunks = this.chunkQueue.join("");
      const chunkCount = this.chunkQueue.length;
      this.currentMessage += remainingChunks;
      this.chunkQueue.length = 0; // Clear the queue after processing

      if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
        console.log(
          `🔚 [UIEventAdapter] Processed ${chunkCount} remaining chunks: "${remainingChunks}"`,
        );
      }
    }

    // Flush any remaining content from the buffer
    if (this.chunkBuffer) {
      const finalChunks = this.chunkBuffer.flush();
      if (finalChunks.length > 0) {
        const finalContent = finalChunks.join("");
        this.currentMessage += finalContent;

        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
          console.log(
            `🔚 [UIEventAdapter] Flushed buffer with ${finalChunks.length} chunks: "${finalContent}"`,
          );
        }
      }
    }

    this.isStreaming = false;

    // Create final message with metadata
    const finalMessage: ConversationMessage = {
      __typename: "ConversationMessage",
      role: ConversationRoleTypes.Assistant,
      message: this.currentMessage,
      timestamp: new Date().toISOString(),
      tokens: tokens, // Now we have the actual LLM token count!
      toolCalls: Array.from(this.activeToolCalls.values()).map(
        (t) => t.toolCall,
      ),
      model: this.model,
      modelService: this.modelService as any,
    };

    // Add final timing metadata
    if (this.streamStartTime > 0) {
      const totalTime = Date.now() - this.streamStartTime;

      // Final throughput (chars/second) - includes entire duration
      finalMessage.throughput =
        totalTime > 0
          ? Math.round((this.currentMessage.length / totalTime) * 1000)
          : 0;

      // Total completion time in seconds
      finalMessage.completionTime = totalTime / 1000;

      // Add time to first token if we have it (useful metric)
      if (this.firstTokenTime > 0) {
        const ttft = this.firstTokenTime - this.streamStartTime;
        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
          console.log(
            `⏱️ [UIEventAdapter] TTFT: ${ttft}ms | Total: ${totalTime}ms | Throughput: ${finalMessage.throughput} chars/s`,
          );
        }
      }
    }

    // Build final metrics
    const completionTime = Date.now();
    const finalMetrics: any = {
      totalTime:
        this.streamStartTime > 0 ? completionTime - this.streamStartTime : 0,
      conversationDuration:
        this.conversationStartTime > 0
          ? completionTime - this.conversationStartTime
          : 0,
    };

    // Add TTFT if we have it
    if (this.firstTokenTime > 0 && this.streamStartTime > 0) {
      finalMetrics.ttft = this.firstTokenTime - this.streamStartTime;
    }

    // Add token counts
    if (this.tokenCount > 0) {
      finalMetrics.tokenCount = this.tokenCount; // Streaming chunks
    }
    if (tokens) {
      finalMetrics.llmTokens = tokens; // Actual LLM tokens used
    }

    // Calculate average token delay
    if (this.tokenDelays.length > 0) {
      const avgDelay =
        this.tokenDelays.reduce((a, b) => a + b, 0) / this.tokenDelays.length;
      finalMetrics.avgTokenDelay = Math.round(avgDelay);
    }

    // Calculate streaming throughput (excludes TTFT)
    if (this.firstTokenTime > 0 && this.streamStartTime > 0) {
      const streamingTime = completionTime - this.firstTokenTime;
      if (streamingTime > 0) {
        finalMetrics.streamingThroughput = Math.round(
          (this.currentMessage.length / streamingTime) * 1000,
        );
      }
    }

    // Include context window usage if available
    const event: AgentStreamEvent = {
      type: "conversation_completed",
      message: finalMessage,
      metrics: finalMetrics,
    };

    if (this.contextWindowUsage) {
      event.contextWindow = this.contextWindowUsage;
    }

    this.emitUIEvent(event);
  }

  private handleError(error: string): void {
    this.isStreaming = false;

    this.emitUIEvent({
      type: "error",
      error: {
        message: error,
        recoverable: false,
      },
      conversationId: this.conversationId,
      timestamp: new Date(),
    });
  }

  private scheduleMessageUpdate(): void {
    const now = Date.now();
    const timeSinceLastUpdate = now - this.lastUpdateTime;

    // If enough time has passed, update immediately
    if (timeSinceLastUpdate >= this.smoothingDelay) {
      this.emitMessageUpdate(true);
      return;
    }

    // Otherwise, schedule an update
    if (!this.updateTimer) {
      const delay = this.smoothingDelay - timeSinceLastUpdate;
      this.updateTimer = globalThis.setTimeout(() => {
        this.emitMessageUpdate(true);
      }, delay);
    }
  }

  private scheduleChunkEmission(): void {
    // If timer is already running, let it handle the queue
    if (this.updateTimer) {
      return;
    }

    // If queue is empty, nothing to do
    if (this.chunkQueue.length === 0) {
      return;
    }

    const now = Date.now();
    const timeSinceLastUpdate = now - this.lastUpdateTime;

    // If enough time has passed, emit a chunk immediately
    if (timeSinceLastUpdate >= this.smoothingDelay) {
      this.emitNextChunk();
      return;
    }

    // Otherwise, schedule the next chunk emission
    const delay = this.smoothingDelay - timeSinceLastUpdate;
    this.updateTimer = globalThis.setTimeout(() => {
      this.emitNextChunk();
    }, delay);
  }

  private emitNextChunk(): void {
    if (this.chunkQueue.length === 0) {
      this.updateTimer = undefined;
      return;
    }

    // Take one chunk from the queue
    const chunk = this.chunkQueue.shift()!;
    this.currentMessage += chunk;

    // Emit the update
    this.emitMessageUpdate(true);

    // Schedule next chunk if queue is not empty
    if (this.chunkQueue.length > 0) {
      this.updateTimer = globalThis.setTimeout(() => {
        this.emitNextChunk();
      }, this.smoothingDelay);
    } else {
      this.updateTimer = undefined;
    }
  }

  private emitMessageUpdate(isStreaming: boolean): void {
    this.lastUpdateTime = Date.now();

    if (this.updateTimer) {
      globalThis.clearTimeout(this.updateTimer);
      this.updateTimer = undefined;
    }

    const message: Partial<ConversationMessage> & { message: string } = {
      __typename: "ConversationMessage",
      role: ConversationRoleTypes.Assistant,
      message: this.currentMessage,
      timestamp: new Date().toISOString(),
    };

    // Add model metadata if available
    if (this.model) {
      message.model = this.model;
    }
    if (this.modelService) {
      message.modelService = this.modelService as any;
    }

    // Add timing metadata if streaming has started
    if (this.streamStartTime > 0) {
      const now = Date.now();
      const elapsedTime = now - this.streamStartTime;

      // Calculate throughput (chars/second)
      const throughput =
        elapsedTime > 0
          ? Math.round((this.currentMessage.length / elapsedTime) * 1000)
          : 0;

      message.throughput = throughput;

      // Add completion time if we have it (in seconds to match API)
      if (elapsedTime > 0) {
        message.completionTime = elapsedTime / 1000;
      }
    }

    // Build metrics object
    const now = Date.now();
    const metrics: any = {
      elapsedTime: this.streamStartTime > 0 ? now - this.streamStartTime : 0,
      conversationDuration:
        this.conversationStartTime > 0 ? now - this.conversationStartTime : 0,
    };

    // Add TTFT if we have it
    if (this.firstTokenTime > 0 && this.streamStartTime > 0) {
      metrics.ttft = this.firstTokenTime - this.streamStartTime;
    }

    // Add token count if available
    if (this.tokenCount > 0) {
      metrics.tokenCount = this.tokenCount;
    }

    // Calculate average token delay
    if (this.tokenDelays.length > 0) {
      const avgDelay =
        this.tokenDelays.reduce((a, b) => a + b, 0) / this.tokenDelays.length;
      metrics.avgTokenDelay = Math.round(avgDelay);
    }

    // Calculate streaming throughput (excludes TTFT)
    if (this.firstTokenTime > 0 && this.streamStartTime > 0) {
      const streamingTime = now - this.firstTokenTime;
      if (streamingTime > 0) {
        metrics.streamingThroughput = Math.round(
          (this.currentMessage.length / streamingTime) * 1000,
        );
      }
    }

    this.emitUIEvent({
      type: "message_update",
      message,
      isStreaming,
      metrics,
    });
  }

  private emitUIEvent(event: AgentStreamEvent): void {
    this.onEvent(event);
  }

  private handleContextWindow(usage: {
    usedTokens: number;
    maxTokens: number;
    percentage: number;
    remainingTokens: number;
  }): void {
    // Store for later inclusion in completion event
    this.contextWindowUsage = usage;

    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `📊 [UIEventAdapter] Context window: ${usage.usedTokens}/${usage.maxTokens} (${usage.percentage}%)`,
      );
    }

    this.emitUIEvent({
      type: "context_window",
      usage,
      timestamp: new Date(),
    });
  }

  /**
   * Clean up any pending timers
   */
  public dispose(): void {
    if (this.updateTimer) {
      globalThis.clearTimeout(this.updateTimer);
      this.updateTimer = undefined;
    }
    this.activeToolCalls.clear();
  }
}

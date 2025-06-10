import {
  ConversationMessage,
  ConversationToolCall,
  ConversationRoleTypes,
} from "../generated/graphql-types.js";
import { AgentStreamEvent, ToolExecutionStatus } from "../types/ui-events.js";
import { StreamEvent } from "../client.js";
import { ChunkBuffer, ChunkingStrategy } from "./chunk-buffer.js";

/**
 * Adapter that transforms low-level streaming events into high-level UI events
 * using GraphQL types for type safety
 */
export class UIEventAdapter {
  private conversationId: string;
  private model?: string;
  private currentMessage: string = "";
  private isStreaming: boolean = false;
  private activeToolCalls: Map<
    string,
    { toolCall: ConversationToolCall; status: ToolExecutionStatus }
  > = new Map();
  private lastUpdateTime: number = 0;
  private updateTimer?: ReturnType<typeof globalThis.setTimeout>;
  private chunkBuffer?: ChunkBuffer;
  private smoothingDelay: number = 30;
  private chunkQueue: string[] = []; // Queue of chunks waiting to be emitted

  constructor(
    private onEvent: (event: AgentStreamEvent) => void,
    conversationId: string,
    options: {
      smoothingEnabled?: boolean;
      chunkingStrategy?: ChunkingStrategy;
      smoothingDelay?: number;
    } = {}
  ) {
    this.conversationId = conversationId;
    this.smoothingDelay = options.smoothingDelay ?? 30;

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

      case "tool_call_complete":
        this.handleToolCallComplete(event.toolCall);
        break;

      case "complete":
        this.handleComplete();
        break;

      case "error":
        this.handleError(event.error);
        break;
    }
  }

  /**
   * Set tool execution result directly (for tool handlers)
   */
  public setToolResult(
    toolCallId: string,
    result: unknown,
    error?: string
  ): void {
    const toolData = this.activeToolCalls.get(toolCallId);
    if (toolData) {
      if (error) {
        toolData.status = "failed";
        this.emitUIEvent({
          type: "tool_update",
          toolCall: toolData.toolCall,
          status: "failed",
          error,
        });
      } else {
        toolData.status = "completed";
        this.emitUIEvent({
          type: "tool_update",
          toolCall: toolData.toolCall,
          status: "completed",
          result,
        });
      }
    }
  }

  private handleStart(conversationId: string): void {
    this.conversationId = conversationId;
    this.isStreaming = true;

    this.emitUIEvent({
      type: "conversation_started",
      conversationId,
      timestamp: new Date(),
      model: this.model,
    });
  }

  private handleToken(token: string): void {
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

    this.emitUIEvent({
      type: "tool_update",
      toolCall: conversationToolCall,
      status: "preparing",
    });
  }

  private handleToolCallDelta(toolCallId: string, argumentDelta: string): void {
    const toolData = this.activeToolCalls.get(toolCallId);
    if (toolData && toolData.status === "preparing") {
      toolData.toolCall.arguments += argumentDelta;
      toolData.status = "executing";

      this.emitUIEvent({
        type: "tool_update",
        toolCall: toolData.toolCall,
        status: "executing",
      });
    }
  }

  private handleToolCallComplete(toolCall: {
    id: string;
    name: string;
    arguments: string;
  }): void {
    const toolData = this.activeToolCalls.get(toolCall.id);
    if (toolData) {
      toolData.toolCall.arguments = toolCall.arguments;
      toolData.status = "completed";

      this.emitUIEvent({
        type: "tool_update",
        toolCall: toolData.toolCall,
        status: "completed",
      });
    }
  }

  private handleComplete(): void {
    // Flush any remaining chunks from buffer
    if (this.chunkBuffer) {
      const remaining = this.chunkBuffer.flush();
      this.chunkQueue.push(...remaining);
    }

    // Clear any pending updates
    if (this.updateTimer) {
      globalThis.clearTimeout(this.updateTimer);
      this.updateTimer = undefined;
    }

    // Immediately flush all queued chunks
    while (this.chunkQueue.length > 0) {
      const chunk = this.chunkQueue.shift()!;
      this.currentMessage += chunk;
    }

    this.isStreaming = false;

    // Create final message
    const finalMessage: ConversationMessage = {
      __typename: "ConversationMessage",
      role: ConversationRoleTypes.Assistant,
      message: this.currentMessage,
      timestamp: new Date().toISOString(),
      tokens: undefined, // Will be set by caller if available
      toolCalls: Array.from(this.activeToolCalls.values()).map(
        (t) => t.toolCall
      ),
    };

    this.emitUIEvent({
      type: "conversation_completed",
      message: finalMessage,
    });
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

    this.emitUIEvent({
      type: "message_update",
      message,
      isStreaming,
    });
  }

  private emitUIEvent(event: AgentStreamEvent): void {
    this.onEvent(event);
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

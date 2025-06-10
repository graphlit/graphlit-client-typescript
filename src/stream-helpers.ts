import { StreamEvent } from "./client.js";
import {
  ConversationRoleTypes,
  ConversationMessage,
} from "./generated/graphql-types.js";

/**
 * Helper class for aggregating streaming events into complete messages
 * This handles the complexity of buffering tool calls until they're complete
 */
interface ToolCallBuffer {
  id: string;
  name: string;
  argumentsBuffer: string;
  isComplete: boolean;
  startTime: number;
}

export class StreamEventAggregator {
  private conversationId: string = "";
  private messageBuffer: string = "";
  private toolCallsBuffer: Map<string, ToolCallBuffer> = new Map();
  private isFirstAssistantMessage: boolean = true;
  private hasReceivedToolCalls: boolean = false;
  private tokenBuffer: string[] = [];

  /**
   * Process a stream event and return any complete messages ready for the UI
   */
  public processEvent(event: StreamEvent): AggregatedEvent | null {
    switch (event.type) {
      case "start":
        this.conversationId = event.conversationId;
        return {
          type: "conversationStarted",
          conversationId: event.conversationId,
        };

      case "token":
        this.messageBuffer += event.token;
        this.tokenBuffer.push(event.token);
        return {
          type: "token",
          token: event.token,
          accumulated: this.messageBuffer,
        };

      case "message":
        // SDK provides accumulated message - we can use this instead of our buffer
        this.messageBuffer = event.message;
        return null; // Don't emit, wait for complete event

      case "tool_call_start":
        this.hasReceivedToolCalls = true;
        this.toolCallsBuffer.set(event.toolCall.id, {
          id: event.toolCall.id,
          name: event.toolCall.name,
          argumentsBuffer: "",
          isComplete: false,
          startTime: Date.now(),
        });
        return null; // Buffer until complete

      case "tool_call_delta":
        const toolCall = this.toolCallsBuffer.get(event.toolCallId);
        if (toolCall) {
          toolCall.argumentsBuffer += event.argumentDelta;
        }
        return null; // Buffer until complete

      case "tool_call_complete":
        const completeToolCall = this.toolCallsBuffer.get(event.toolCall.id);
        if (completeToolCall) {
          completeToolCall.argumentsBuffer = event.toolCall.arguments;
          completeToolCall.isComplete = true;
        }

        // Check if all tool calls are complete
        const allComplete = Array.from(this.toolCallsBuffer.values()).every(
          (tc) => tc.isComplete,
        );

        if (
          allComplete &&
          this.hasReceivedToolCalls &&
          this.isFirstAssistantMessage
        ) {
          // Emit complete assistant message with all tool calls
          const toolCalls = Array.from(this.toolCallsBuffer.values()).map(
            (tc) => ({
              id: tc.id,
              name: tc.name,
              arguments: tc.argumentsBuffer,
              status: "pending" as const,
            }),
          );

          this.isFirstAssistantMessage = false;

          return {
            type: "assistantMessage",
            message: {
              message: this.messageBuffer,
              role: ConversationRoleTypes.Assistant,
              toolCalls,
            },
            isFinal: false,
          };
        }
        return null;

      case "complete":
        // If we haven't sent a message yet (no tool calls), send it now
        if (this.isFirstAssistantMessage && !this.hasReceivedToolCalls) {
          return {
            type: "assistantMessage",
            message: {
              message: this.messageBuffer,
              role: ConversationRoleTypes.Assistant,
            },
            isFinal: true,
            conversationId: event.conversationId,
          };
        }
        return { type: "streamComplete", conversationId: event.conversationId };

      case "error":
        return { type: "error", error: event.error };

      default:
        return null;
    }
  }

  /**
   * Reset the aggregator for a new conversation
   */
  public reset(): void {
    this.conversationId = "";
    this.messageBuffer = "";
    this.toolCallsBuffer.clear();
    this.isFirstAssistantMessage = true;
    this.hasReceivedToolCalls = false;
    this.tokenBuffer = [];
  }

  /**
   * Get current state (useful for debugging)
   */
  public getState() {
    return {
      conversationId: this.conversationId,
      messageBuffer: this.messageBuffer,
      toolCallsCount: this.toolCallsBuffer.size,
      hasReceivedToolCalls: this.hasReceivedToolCalls,
      isFirstAssistantMessage: this.isFirstAssistantMessage,
      tokenCount: this.tokenBuffer.length,
    };
  }
}

/**
 * Aggregated event types that are ready for UI consumption
 */
export type AggregatedEvent =
  | { type: "conversationStarted"; conversationId: string }
  | { type: "token"; token: string; accumulated: string }
  | {
      type: "assistantMessage";
      message: {
        message?: string | null;
        role?: ConversationRoleTypes | null;
        toolCalls?: any[];
      };
      isFinal: boolean;
      conversationId?: string;
    }
  | { type: "streamComplete"; conversationId?: string }
  | { type: "error"; error: string };

/**
 * Helper to create an SSE response with proper formatting
 */
export function formatSSEEvent(
  data: any,
  eventName: string = "message",
): string {
  if (typeof data === "string") {
    return `event: ${eventName}\ndata: ${data}\n\n`;
  }
  return `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
}

/**
 * Helper to create a TransformStream for SSE with built-in ping support
 */
export function createSSEStream(options?: { pingInterval?: number }) {
  const encoder = new TextEncoder();
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  let pingInterval: ReturnType<typeof globalThis.setInterval> | null = null;

  if (options?.pingInterval) {
    pingInterval = globalThis.setInterval(() => {
      writer.write(encoder.encode(":\n\n")).catch(() => {
        // Ignore errors on ping
      });
    }, options.pingInterval);
  }

  const sendEvent = (data: any, eventName: string = "message") => {
    const formatted = formatSSEEvent(data, eventName);
    return writer.write(encoder.encode(formatted));
  };

  const close = async () => {
    if (pingInterval) {
      globalThis.clearInterval(pingInterval);
    }
    await writer.close();
  };

  return {
    readable,
    sendEvent,
    close,
    writer,
  };
}

/**
 * Helper to wrap tool handlers with result emission
 */
export interface ToolResultEmitter {
  (
    toolCallId: string,
    result: any,
    status: "complete" | "error" | "blocked",
    duration: number,
  ): void;
}

export function wrapToolHandlers(
  handlers: Record<string, (args: any) => Promise<any>>,
  emitResult: ToolResultEmitter,
): Record<string, (args: any) => Promise<any>> {
  const wrapped: Record<string, (args: any) => Promise<any>> = {};

  Object.entries(handlers).forEach(([name, handler]) => {
    wrapped[name] = async (args: any) => {
      const toolCallId = `tool_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const startTime = Date.now();

      try {
        const result = await handler(args);
        const duration = Date.now() - startTime;

        // Emit success result
        emitResult(
          toolCallId,
          { status: "success", result },
          "complete",
          duration,
        );

        return result;
      } catch (error) {
        const duration = Date.now() - startTime;

        // Emit error result
        emitResult(
          toolCallId,
          {
            status: "error",
            error: error instanceof Error ? error.message : String(error),
          },
          "error",
          duration,
        );

        throw error;
      }
    };
  });

  return wrapped;
}

/**
 * Helper to enhance tool calls with server information
 */
export interface ServerMapping {
  toolName: string;
  serverName: string;
  serverId: string;
}

export function enhanceToolCalls(
  toolCalls: any[],
  serverMappings: ServerMapping[],
): any[] {
  const mappingDict = serverMappings.reduce(
    (acc, mapping) => {
      acc[mapping.toolName] = {
        serverName: mapping.serverName,
        serverId: mapping.serverId,
      };
      return acc;
    },
    {} as Record<string, { serverName: string; serverId: string }>,
  );

  return toolCalls.map((toolCall) => ({
    ...toolCall,
    serverName: mappingDict[toolCall.name]?.serverName,
    serverId: mappingDict[toolCall.name]?.serverId,
  }));
}

/**
 * Helper to track conversation metrics
 */
export class ConversationMetrics {
  private startTime: number = Date.now();
  private tokenCount: number = 0;
  private toolCallCount: number = 0;
  private errorCount: number = 0;

  public recordToken(): void {
    this.tokenCount++;
  }

  public recordToolCall(): void {
    this.toolCallCount++;
  }

  public recordError(): void {
    this.errorCount++;
  }

  public getMetrics() {
    const duration = Date.now() - this.startTime;
    return {
      duration,
      tokenCount: this.tokenCount,
      toolCallCount: this.toolCallCount,
      errorCount: this.errorCount,
      tokensPerSecond: this.tokenCount / (duration / 1000),
    };
  }

  public reset(): void {
    this.startTime = Date.now();
    this.tokenCount = 0;
    this.toolCallCount = 0;
    this.errorCount = 0;
  }
}

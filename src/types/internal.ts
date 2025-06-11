/**
 * Internal types used by the streaming implementation
 * These are not exported to consumers of the library
 */

/**
 * Low-level streaming events used internally by providers
 * These get transformed into AgentStreamEvent by UIEventAdapter
 */
export type StreamEvent =
  | { type: "start"; conversationId: string }
  | { type: "token"; token: string }
  | { type: "message"; message: string }
  | { type: "tool_call_start"; toolCall: { id: string; name: string } }
  | { type: "tool_call_delta"; toolCallId: string; argumentDelta: string }
  | {
      type: "tool_call_complete";
      toolCall: { id: string; name: string; arguments: string };
    }
  | { type: "complete"; messageId?: string; conversationId?: string }
  | { type: "error"; error: string };
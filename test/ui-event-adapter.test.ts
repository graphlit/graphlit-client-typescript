import { describe, expect, it } from "vitest";
import { UIEventAdapter } from "../src/streaming/ui-event-adapter";
import type { AgentStreamEvent } from "../src/types/ui-events";

function conversationCompletedEvents(events: AgentStreamEvent[]) {
  return events.filter(
    (
      event,
    ): event is Extract<AgentStreamEvent, { type: "conversation_completed" }> =>
      event.type === "conversation_completed",
  );
}

function messageUpdateEvents(events: AgentStreamEvent[]) {
  return events.filter(
    (event): event is Extract<AgentStreamEvent, { type: "message_update" }> =>
      event.type === "message_update",
  );
}

describe("UIEventAdapter completion handling", () => {
  it("flushes provider completion without ending the conversation or reporting stale usage", () => {
    const events: AgentStreamEvent[] = [];
    const adapter = new UIEventAdapter((event) => events.push(event), "conv-1", {
      smoothingEnabled: false,
      model: "GPT55_1024K",
      modelName: "gpt-5.5",
      modelService: "OPEN_AI",
    });

    try {
      adapter.handleEvent({
        type: "start",
        conversationId: "conv-1",
      });
      adapter.setUsageData({
        input_tokens: 8314,
        output_tokens: 71,
        total_tokens: 8385,
      });
      adapter.handleEvent({
        type: "token",
        token: "Final answer.",
      });

      adapter.handleEvent({
        type: "complete",
        isFinal: false,
        tokens: 211,
      });

      expect(conversationCompletedEvents(events)).toHaveLength(0);

      adapter.setUsageData({
        input_tokens: 11119,
        input_tokens_details: {
          cached_tokens: 8192,
        },
        output_tokens: 319,
        total_tokens: 11438,
      });
      adapter.handleEvent({
        type: "complete",
        tokens: 213,
      });

      const completed = conversationCompletedEvents(events);
      expect(completed).toHaveLength(1);
      expect(completed[0].message.message).toBe("Final answer.");
      expect(completed[0].message.tokens).toBe(213);
      expect(completed[0].usage).toMatchObject({
        promptTokens: 11119,
        completionTokens: 319,
        totalTokens: 11438,
        cachedInputTokens: 8192,
      });

      const nonStreamingUpdates = messageUpdateEvents(events).filter(
        (event) => event.isStreaming === false,
      );
      expect(nonStreamingUpdates).toHaveLength(0);
    } finally {
      adapter.dispose();
    }
  });
});

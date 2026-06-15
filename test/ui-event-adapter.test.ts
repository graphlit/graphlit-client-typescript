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

  it("emits aggregate streaming usage with provider round details", () => {
    const events: AgentStreamEvent[] = [];
    const adapter = new UIEventAdapter((event) => events.push(event), "conv-2", {
      smoothingEnabled: false,
      model: "CLAUDE_4_8_OPUS",
      modelName: "claude-opus-4-8",
      modelService: "ANTHROPIC",
    });

    try {
      adapter.handleEvent({
        type: "start",
        conversationId: "conv-2",
      });
      adapter.setUsageData({
        promptTokens: 300,
        completionTokens: 75,
        totalTokens: 375,
        model: "claude-opus-4-8",
        provider: "ANTHROPIC",
        cachedInputTokens: 50,
        cacheCreationInputTokens: 20,
        cacheReadInputTokens: 30,
        rounds: [
          {
            round: 0,
            promptTokens: 100,
            completionTokens: 25,
            totalTokens: 125,
            provider: "ANTHROPIC",
          },
          {
            round: 1,
            promptTokens: 200,
            completionTokens: 50,
            totalTokens: 250,
            provider: "ANTHROPIC",
          },
        ],
        metadata: {
          providerRounds: [],
        },
      });
      adapter.handleEvent({
        type: "token",
        token: "Done.",
      });
      adapter.handleEvent({
        type: "complete",
        tokens: 5,
      });

      const completed = conversationCompletedEvents(events);
      expect(completed).toHaveLength(1);
      expect(completed[0].usage).toMatchObject({
        promptTokens: 300,
        completionTokens: 75,
        totalTokens: 375,
        model: "claude-opus-4-8",
        provider: "ANTHROPIC",
        cachedInputTokens: 50,
        cacheCreationInputTokens: 20,
        cacheReadInputTokens: 30,
      });
      expect(completed[0].usage?.rounds).toHaveLength(2);
      expect(completed[0].usage?.rounds?.[1]).toMatchObject({
        round: 1,
        promptTokens: 200,
        completionTokens: 50,
        totalTokens: 250,
      });
    } finally {
      adapter.dispose();
    }
  });

  it("includes Anthropic cache write and read tokens in raw usage totals", () => {
    const events: AgentStreamEvent[] = [];
    const adapter = new UIEventAdapter((event) => events.push(event), "conv-3", {
      smoothingEnabled: false,
      model: "CLAUDE_4_8_OPUS",
      modelName: "claude-opus-4-8",
      modelService: "ANTHROPIC",
    });

    try {
      adapter.handleEvent({
        type: "start",
        conversationId: "conv-3",
      });
      adapter.setUsageData({
        input_tokens: 100,
        output_tokens: 25,
        cache_creation_input_tokens: 40,
        cache_read_input_tokens: 60,
      });
      adapter.handleEvent({
        type: "token",
        token: "Done.",
      });
      adapter.handleEvent({
        type: "complete",
        tokens: 5,
      });

      const completed = conversationCompletedEvents(events);
      expect(completed).toHaveLength(1);
      expect(completed[0].usage).toMatchObject({
        promptTokens: 200,
        completionTokens: 25,
        totalTokens: 225,
        cachedInputTokens: 60,
        cacheCreationInputTokens: 40,
        cacheReadInputTokens: 60,
      });
    } finally {
      adapter.dispose();
    }
  });
});

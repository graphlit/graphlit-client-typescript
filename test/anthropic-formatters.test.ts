import { describe, expect, it } from "vitest";
import * as Types from "../src/generated/graphql-types";
import { formatMessagesForAnthropic } from "../src/streaming/llm-formatters";

describe("Anthropic formatters", () => {
  it("groups consecutive tool results into the next Anthropic user message", () => {
    const formatted = formatMessagesForAnthropic([
      {
        __typename: "ConversationMessage",
        role: Types.ConversationRoleTypes.User,
        message: "Check two things.",
        timestamp: "2026-04-25T00:00:00Z",
      },
      {
        __typename: "ConversationMessage",
        role: Types.ConversationRoleTypes.Assistant,
        message: "",
        timestamp: "2026-04-25T00:00:01Z",
        toolCalls: [
          {
            __typename: "ConversationToolCall",
            id: "toolu_1",
            name: "search",
            arguments: JSON.stringify({ query: "alpha" }),
          },
          {
            __typename: "ConversationToolCall",
            id: "toolu_2",
            name: "search",
            arguments: JSON.stringify({ query: "beta" }),
          },
        ],
      },
      {
        __typename: "ConversationMessage",
        role: Types.ConversationRoleTypes.Tool,
        message: "alpha result",
        toolCallId: "toolu_1",
        timestamp: "2026-04-25T00:00:02Z",
      },
      {
        __typename: "ConversationMessage",
        role: Types.ConversationRoleTypes.Tool,
        message: "beta result",
        toolCallId: "toolu_2",
        timestamp: "2026-04-25T00:00:03Z",
      },
    ]).messages;

    expect(formatted).toHaveLength(3);
    expect(formatted[1].role).toBe("assistant");
    expect(
      Array.isArray(formatted[1].content)
        ? formatted[1].content.map((part) => part.type)
        : [],
    ).toEqual(["tool_use", "tool_use"]);
    expect(formatted[2].role).toBe("user");
    expect(
      Array.isArray(formatted[2].content)
        ? formatted[2].content.map((part) => part.type)
        : [],
    ).toEqual(["tool_result", "tool_result"]);
    expect(
      Array.isArray(formatted[2].content)
        ? formatted[2].content.map((part) => part.tool_use_id)
        : [],
    ).toEqual(["toolu_1", "toolu_2"]);
  });

  it("omits orphaned historical tool uses that are missing tool results", () => {
    const formatted = formatMessagesForAnthropic([
      {
        __typename: "ConversationMessage",
        role: Types.ConversationRoleTypes.Assistant,
        message: "Here is the final answer.",
        timestamp: "2026-04-25T00:00:00Z",
        toolCalls: [
          {
            __typename: "ConversationToolCall",
            id: "toolu_missing",
            name: "task_complete",
            arguments: JSON.stringify({}),
          },
        ],
      },
      {
        __typename: "ConversationMessage",
        role: Types.ConversationRoleTypes.User,
        message: "Follow up on that.",
        timestamp: "2026-04-25T00:00:01Z",
      },
    ]).messages;

    expect(formatted).toHaveLength(2);
    expect(formatted[0].role).toBe("assistant");
    expect(
      Array.isArray(formatted[0].content)
        ? formatted[0].content.map((part) => part.type)
        : [],
    ).toEqual(["text"]);
    expect(formatted[1]).toEqual({
      role: "user",
      content: "Follow up on that.",
    });
  });
});

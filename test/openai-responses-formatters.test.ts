import { describe, expect, it } from "vitest";
import * as Types from "../src/generated/graphql-types";
import {
  buildOpenAIResponsesFunctionCallOutputItems,
  extractInstructionsForOpenAIResponses,
  formatMessagesForOpenAIResponsesInitialRound,
  formatToolsForOpenAIResponses,
} from "../src/streaming/llm-formatters";

describe("OpenAI Responses formatters", () => {
  it("extracts system messages into instructions", () => {
    const instructions = extractInstructionsForOpenAIResponses([
      {
        __typename: "ConversationMessage",
        role: Types.ConversationRoleTypes.System,
        message: "System A",
        timestamp: "2026-04-08T00:00:00Z",
      },
      {
        __typename: "ConversationMessage",
        role: Types.ConversationRoleTypes.System,
        message: "System B",
        timestamp: "2026-04-08T00:00:01Z",
      },
    ]);

    expect(instructions).toBe("System A\n\nSystem B");
  });

  it("formats assistant tool calls and tool outputs for Responses input", () => {
    const input = formatMessagesForOpenAIResponsesInitialRound([
      {
        __typename: "ConversationMessage",
        role: Types.ConversationRoleTypes.User,
        message: "What is 2 + 2?",
        timestamp: "2026-04-08T00:00:00Z",
      },
      {
        __typename: "ConversationMessage",
        role: Types.ConversationRoleTypes.Assistant,
        message: "",
        timestamp: "2026-04-08T00:00:01Z",
        toolCalls: [
          {
            __typename: "ConversationToolCall",
            id: "call_123",
            name: "calculate",
            arguments: "{\"a\":2,\"b\":2}",
          },
        ],
      },
      {
        __typename: "ConversationMessage",
        role: Types.ConversationRoleTypes.Tool,
        message: "{\"result\":4}",
        toolCallId: "call_123",
        timestamp: "2026-04-08T00:00:02Z",
      },
    ]);

    expect(input).toEqual([
      {
        type: "message",
        role: "user",
        content: "What is 2 + 2?",
      },
      {
        type: "function_call",
        id: "call_123",
        call_id: "call_123",
        name: "calculate",
        arguments: "{\"a\":2,\"b\":2}",
      },
      {
        type: "function_call_output",
        call_id: "call_123",
        output: "{\"result\":4}",
      },
    ]);
  });

  it("formats custom tools with strict false", () => {
    const tools = formatToolsForOpenAIResponses([
      {
        name: "lookup_weather",
        description: "Look up weather data",
        schema: JSON.stringify({
          type: "object",
          properties: {
            city: { type: "string" },
          },
          required: ["city"],
        }),
      },
    ]);

    expect(tools).toEqual([
      {
        type: "function",
        name: "lookup_weather",
        description: "Look up weather data",
        parameters: {
          type: "object",
          properties: {
            city: { type: "string" },
          },
          required: ["city"],
        },
        strict: false,
      },
    ]);
  });

  it("builds function_call_output items from tool messages only", () => {
    const outputs = buildOpenAIResponsesFunctionCallOutputItems([
      {
        __typename: "ConversationMessage",
        role: Types.ConversationRoleTypes.Assistant,
        message: "ignored",
        timestamp: "2026-04-08T00:00:00Z",
      },
      {
        __typename: "ConversationMessage",
        role: Types.ConversationRoleTypes.Tool,
        message: "tool result",
        toolCallId: "call_456",
        timestamp: "2026-04-08T00:00:01Z",
      },
    ]);

    expect(outputs).toEqual([
      {
        type: "function_call_output",
        call_id: "call_456",
        output: "tool result",
      },
    ]);
  });
});

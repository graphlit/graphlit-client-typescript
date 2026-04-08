import { describe, expect, it, vi } from "vitest";
import * as Types from "../src/generated/graphql-types";
import { formatToolsForOpenAIResponses } from "../src/streaming/llm-formatters";
import { streamWithOpenAIResponses } from "../src/streaming/openai-responses";
import type { StreamEvent } from "../src/types/internal";

async function* makeStream(events: any[]) {
  for (const event of events) {
    yield event;
  }
}

const TEST_SPEC = {
  __typename: "Specification",
  id: "spec-1",
  name: "OpenAI Responses Test",
  serviceType: Types.ModelServiceTypes.OpenAi,
  openAI: {
    model: Types.OpenAiModels.Gpt54_1024K,
    temperature: 0.2,
  },
} as Types.Specification;

describe("OpenAI Responses provider", () => {
  it("maps streaming tool and text events into the existing internal event surface", async () => {
    const events: StreamEvent[] = [];
    const openaiClient = {
      responses: {
        create: vi.fn().mockResolvedValue(
          makeStream([
            {
              type: "response.output_item.added",
              output_index: 0,
              sequence_number: 1,
              item: {
                type: "function_call",
                id: "item_1",
                call_id: "call_1",
                name: "get_weather",
                arguments: "",
              },
            },
            {
              type: "response.function_call_arguments.delta",
              item_id: "item_1",
              output_index: 0,
              sequence_number: 2,
              delta: '{"city":"San',
            },
            {
              type: "response.function_call_arguments.done",
              item_id: "item_1",
              output_index: 0,
              sequence_number: 3,
              arguments: '{"city":"San Francisco"}',
            },
            {
              type: "response.output_text.delta",
              item_id: "msg_1",
              output_index: 1,
              content_index: 0,
              sequence_number: 4,
              delta: "Looking up weather.",
              logprobs: [],
            },
            {
              type: "response.completed",
              sequence_number: 5,
              response: {
                id: "resp_1",
                output_text: "Looking up weather.",
                output: [
                  {
                    type: "function_call",
                    id: "item_1",
                    call_id: "call_1",
                    name: "get_weather",
                    arguments: '{"city":"San Francisco"}',
                    status: "completed",
                  },
                ],
                usage: {
                  input_tokens: 11,
                  output_tokens: 7,
                  total_tokens: 18,
                },
              },
            },
          ]),
        ),
      },
    };

    const result = await streamWithOpenAIResponses(
      TEST_SPEC,
      undefined,
      [
        {
          type: "message",
          role: "user",
          content: "Weather in San Francisco?",
        },
      ],
      formatToolsForOpenAIResponses([
        {
          name: "get_weather",
          description: "Get weather",
          schema: JSON.stringify({
            type: "object",
            properties: { city: { type: "string" } },
          }),
        },
      ] as Types.ToolDefinitionInput[]),
      openaiClient,
      (event) => events.push(event),
    );

    expect(result.message).toBe("Looking up weather.");
    expect(result.toolCalls).toEqual([
      {
        __typename: "ConversationToolCall",
        id: "call_1",
        name: "get_weather",
        arguments: '{"city":"San Francisco"}',
      },
    ]);
    expect(result.usage).toEqual({
      input_tokens: 11,
      output_tokens: 7,
      total_tokens: 18,
    });
    expect(result.outputItems).toHaveLength(1);

    expect(events).toEqual([
      {
        type: "tool_call_start",
        toolCall: {
          id: "call_1",
          name: "get_weather",
        },
      },
      {
        type: "tool_call_delta",
        toolCallId: "call_1",
        argumentDelta: '{"city":"San',
      },
      {
        type: "tool_call_parsed",
        toolCall: {
          id: "call_1",
          name: "get_weather",
          arguments: '{"city":"San Francisco"}',
        },
      },
      {
        type: "token",
        token: "Looking up weather.",
      },
      {
        type: "complete",
        tokens: 1,
      },
    ]);

    expect(openaiClient.responses.create).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "gpt-5.4",
        store: false,
        stream: true,
        include: ["reasoning.encrypted_content"],
        input: [
          {
            type: "message",
            role: "user",
            content: "Weather in San Francisco?",
          },
        ],
      }),
      { signal: undefined },
    );
  });

  it("accepts prior function call items and function_call_output items in the request", async () => {
    const openaiClient = {
      responses: {
        create: vi.fn().mockResolvedValue(
          makeStream([
            {
              type: "response.completed",
              sequence_number: 1,
              response: {
                id: "resp_2",
                output_text: "Done",
                output: [],
                usage: {
                  input_tokens: 3,
                  output_tokens: 1,
                  total_tokens: 4,
                },
              },
            },
          ]),
        ),
      },
    };

    await streamWithOpenAIResponses(
      TEST_SPEC,
      "Be concise.",
      [
        {
          type: "message",
          role: "user",
          content: "Continue",
        },
        {
          type: "function_call",
          id: "item_1",
          call_id: "call_1",
          name: "get_weather",
          arguments: '{"city":"San Francisco"}',
        },
        {
          type: "function_call_output",
          call_id: "call_1",
          output: '{"forecast":"Sunny"}',
        },
      ],
      undefined,
      openaiClient,
      () => {},
    );

    expect(openaiClient.responses.create).toHaveBeenCalledWith(
      expect.objectContaining({
        instructions: "Be concise.",
        input: [
          {
            type: "message",
            role: "user",
            content: "Continue",
          },
          {
            type: "function_call",
            id: "item_1",
            call_id: "call_1",
            name: "get_weather",
            arguments: '{"city":"San Francisco"}',
          },
          {
            type: "function_call_output",
            call_id: "call_1",
            output: '{"forecast":"Sunny"}',
          },
        ],
      }),
      { signal: undefined },
    );
  });

  it("passes reasoning effort through to Responses requests", async () => {
    const openaiClient = {
      responses: {
        create: vi.fn().mockResolvedValue(
          makeStream([
            {
              type: "response.completed",
              sequence_number: 1,
              response: {
                id: "resp_3",
                output_text: "Done",
                output: [],
                usage: {
                  input_tokens: 3,
                  output_tokens: 1,
                  total_tokens: 4,
                },
              },
            },
          ]),
        ),
      },
    };

    await streamWithOpenAIResponses(
      {
        ...TEST_SPEC,
        openAI: {
          ...TEST_SPEC.openAI,
          reasoningEffort: Types.ReasoningEffortTypes.Medium,
        },
      } as Types.Specification,
      undefined,
      [
        {
          type: "message",
          role: "user",
          content: "Think carefully",
        },
      ],
      formatToolsForOpenAIResponses([
        {
          name: "search_docs",
          description: "Search docs",
          schema: JSON.stringify({
            type: "object",
            properties: { query: { type: "string" } },
            required: ["query"],
          }),
        },
      ] as Types.ToolDefinitionInput[]),
      openaiClient,
      () => {},
      undefined,
      Types.ReasoningEffortTypes.Medium,
    );

    expect(openaiClient.responses.create).toHaveBeenCalledWith(
      expect.objectContaining({
        reasoning: { effort: "medium" },
        tools: [
          {
            type: "function",
            name: "search_docs",
            description: "Search docs",
            parameters: {
              type: "object",
              properties: {
                query: { type: "string" },
              },
              required: ["query"],
            },
            strict: false,
          },
        ],
      }),
      { signal: undefined },
    );
  });

  it("reconstructs tool calls from completed output when streaming events omit them", async () => {
    const events: StreamEvent[] = [];
    const openaiClient = {
      responses: {
        create: vi.fn().mockResolvedValue(
          makeStream([
            {
              type: "response.completed",
              sequence_number: 1,
              response: {
                id: "resp_4",
                output_text: "",
                output: [
                  {
                    type: "function_call",
                    id: "item_2",
                    call_id: "call_2",
                    name: "search_docs",
                    arguments: '{"query":"pricing"}',
                    status: "completed",
                  },
                ],
                usage: {
                  input_tokens: 5,
                  output_tokens: 2,
                  total_tokens: 7,
                },
              },
            },
          ]),
        ),
      },
    };

    const result = await streamWithOpenAIResponses(
      TEST_SPEC,
      undefined,
      [
        {
          type: "message",
          role: "user",
          content: "Use the docs tool",
        },
      ],
      formatToolsForOpenAIResponses([
        {
          name: "search_docs",
          description: "Search docs",
          schema: JSON.stringify({
            type: "object",
            properties: { query: { type: "string" } },
            required: ["query"],
          }),
        },
      ] as Types.ToolDefinitionInput[]),
      openaiClient,
      (event) => events.push(event),
    );

    expect(result.toolCalls).toEqual([
      {
        __typename: "ConversationToolCall",
        id: "call_2",
        name: "search_docs",
        arguments: '{"query":"pricing"}',
      },
    ]);
    expect(events).toContainEqual({
      type: "tool_call_parsed",
      toolCall: {
        id: "call_2",
        name: "search_docs",
        arguments: '{"query":"pricing"}',
      },
    });
  });
});

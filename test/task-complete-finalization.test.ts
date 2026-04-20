import { describe, it, expect, vi, afterEach } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import { formatMessagesForAnthropic } from "../src/streaming/llm-formatters";
import { UIEventAdapter } from "../src/streaming/ui-event-adapter";
import type { StreamingLoopResult } from "../src/types/agent";

const TEST_SPEC: Types.Specification = {
  __typename: "Specification",
  id: "spec-1",
  name: "Test Spec",
  serviceType: Types.ModelServiceTypes.OpenAi,
} as Types.Specification;

const TASK_COMPLETE_LOOP_RESULT: StreamingLoopResult = {
  fullMessage: "",
  finalAssistantMessage: "Hello! How can I help you today?",
  toolCallCount: 1,
  toolCallNames: ["task_complete"],
  errors: [],
  contextActions: [],
  intermediateMessages: [
    {
      role: Types.ConversationRoleTypes.Assistant,
      message: "",
      timestamp: "2026-04-03T16:16:07.000Z",
      toolCalls: [
        {
          id: "toolu_1",
          name: "task_complete",
          arguments: JSON.stringify({}),
        },
      ],
    },
  ],
  lastRoundReasoning: undefined,
};

describe("Task Complete Finalization", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("streamAgent persists the last non-empty assistant answer after task_complete", async () => {
    const client = new Graphlit({ token: "test-token" });

    vi.spyOn(client as any, "getSpecification").mockResolvedValue({
      specification: TEST_SPEC,
    });
    vi.spyOn(client as any, "supportsStreaming").mockReturnValue(true);
    vi.spyOn(client as any, "formatConversation").mockResolvedValue({
      formatConversation: {
        message: {
          role: Types.ConversationRoleTypes.User,
          message: "hello?",
          timestamp: "2026-04-03T16:16:03.000Z",
        },
      },
    });
    vi.spyOn(client as any, "executeStreamingLoop").mockResolvedValue(
      TASK_COMPLETE_LOOP_RESULT,
    );

    const completeConversationSpy = vi
      .spyOn(client, "completeConversation")
      .mockResolvedValue({
        completeConversation: {
          message: {
            tokens: 42,
          },
        },
      } as Types.CompleteConversationMutation);

    await client.streamAgent("hello?", () => {}, "conv-1", {
      id: TEST_SPEC.id,
    });

    expect(completeConversationSpy).toHaveBeenCalledTimes(1);
    expect(completeConversationSpy).toHaveBeenCalledWith(
      "Hello! How can I help you today?",
      "conv-1",
      undefined,
      undefined,
      undefined,
      undefined,
      expect.any(Array),
      undefined,
    );
  });

  it("runAgent returns and persists the last non-empty assistant answer after task_complete", async () => {
    const client = new Graphlit({ token: "test-token" });

    vi.spyOn(client, "createAgent").mockResolvedValue({
      createAgent: { id: "agent-1" },
    } as Types.CreateAgentMutation);
    vi.spyOn(client, "createConversation").mockResolvedValue({
      createConversation: { id: "conv-1" },
    } as Types.CreateConversationMutation);
    vi.spyOn(client as any, "formatConversation").mockResolvedValue({
      formatConversation: {
        message: {
          role: Types.ConversationRoleTypes.User,
          message: "hello?",
          timestamp: "2026-04-03T16:16:03.000Z",
        },
      },
    });
    vi.spyOn(client as any, "executeStreamingLoop").mockResolvedValue(
      TASK_COMPLETE_LOOP_RESULT,
    );

    const completeConversationSpy = vi
      .spyOn(client, "completeConversation")
      .mockResolvedValue({
        completeConversation: {
          message: {
            tokens: 42,
          },
        },
      } as Types.CompleteConversationMutation);

    const result = await client.runAgent(
      "hello?",
      () => {},
      undefined,
      undefined,
      { maxTurns: 1 },
    );

    expect(completeConversationSpy).toHaveBeenCalledTimes(1);
    expect(completeConversationSpy).toHaveBeenCalledWith(
      "Hello! How can I help you today?",
      "conv-1",
      undefined,
      undefined,
      undefined,
      undefined,
      expect.any(Array),
      undefined,
    );
    expect(result.finalMessage).toBe("Hello! How can I help you today?");
    expect(result.status).toBe("completed");
  });

  it("executeStreamingLoop executes task_complete, persists its tool result, and stops before a filler round", async () => {
    const client = new Graphlit({ token: "test-token" });
    client.setOpenAIClient({});

    const uiAdapter = new UIEventAdapter(() => {}, "conv-1");
    const taskCompleteHandler = vi
      .fn()
      .mockResolvedValue("Task completion acknowledged.");
    const streamWithOpenAISpy = vi
      .spyOn(client as any, "streamWithOpenAI")
      .mockImplementation(
        async (
          _specification: Types.Specification,
          _messages: unknown,
          _tools: Types.ToolDefinitionInput[] | undefined,
          _uiAdapter: UIEventAdapter,
          onComplete: (
            message: string,
            toolCalls: Types.ConversationToolCall[],
          ) => void,
        ) => {
          onComplete("This is the real final answer.", [
            {
              __typename: "ConversationToolCall",
              id: "toolu_1",
              name: "task_complete",
              arguments: JSON.stringify({}),
            },
          ]);
        },
      );

    try {
      const result = await (client as any).executeStreamingLoop({
        conversationId: "conv-1",
        specification: TEST_SPEC,
        messages: [
          {
            __typename: "ConversationMessage",
            role: Types.ConversationRoleTypes.User,
            message: "Finish the task",
            timestamp: new Date().toISOString(),
          },
        ],
        tools: [
          {
            name: "task_complete",
            description: "Signal task completion.",
            schema: JSON.stringify({ type: "object", properties: {} }),
          },
        ],
        toolHandlers: {
          task_complete: taskCompleteHandler,
        },
        uiAdapter,
        budgetTracker: undefined,
        contextStrategy: {
          toolResultTokenLimit: 8192,
          toolRoundLimit: 10,
          rebudgetThreshold: 0.75,
        },
        maxRounds: 4,
        abortSignal: undefined,
      });

      expect(streamWithOpenAISpy).toHaveBeenCalledTimes(1);
      expect(taskCompleteHandler).toHaveBeenCalledTimes(1);
      expect(taskCompleteHandler).toHaveBeenCalledWith(
        {},
        expect.any(Object),
        undefined,
      );
      expect(result.finalAssistantMessage).toBe(
        "This is the real final answer.",
      );
      expect(result.fullMessage).toBe("This is the real final answer.");
      expect(result.toolCallCount).toBe(1);
      expect(result.intermediateMessages).toHaveLength(2);
      expect(result.intermediateMessages[0].role).toBe(
        Types.ConversationRoleTypes.Assistant,
      );
      expect(result.intermediateMessages[0].message).toBe(
        "This is the real final answer.",
      );
      expect(result.intermediateMessages[0].toolCalls?.[0]?.name).toBe(
        "task_complete",
      );
      expect(result.intermediateMessages[0].toolCalls?.[0]?.status).toBe(
        Types.ToolExecutionStatus.Completed,
      );
      expect(result.intermediateMessages[1].role).toBe(
        Types.ConversationRoleTypes.Tool,
      );
      expect(result.intermediateMessages[1].toolCallId).toBe("toolu_1");
      expect(result.intermediateMessages[1].message).toBe(
        "Task completion acknowledged.",
      );

      const anthropicMessages = formatMessagesForAnthropic(
        result.intermediateMessages as Types.ConversationMessage[],
      ).messages;
      expect(anthropicMessages[0].role).toBe("assistant");
      expect(
        Array.isArray(anthropicMessages[0].content)
          ? anthropicMessages[0].content.map((part) => part.type)
          : [],
      ).toContain("tool_use");
      expect(anthropicMessages[1].role).toBe("user");
      expect(
        Array.isArray(anthropicMessages[1].content)
          ? anthropicMessages[1].content[0]?.type
          : undefined,
      ).toBe("tool_result");
    } finally {
      uiAdapter.dispose();
    }
  });

  it("executeStreamingLoop preserves legacy final_message from wrapped task_complete while still persisting a tool result", async () => {
    const client = new Graphlit({ token: "test-token" });
    client.setOpenAIClient({});

    const uiAdapter = new UIEventAdapter(() => {}, "conv-1");
    const executeToolHandler = vi
      .fn()
      .mockResolvedValue("Task completion acknowledged.");
    const streamWithOpenAISpy = vi
      .spyOn(client as any, "streamWithOpenAI")
      .mockImplementation(
        async (
          _specification: Types.Specification,
          _messages: unknown,
          _tools: Types.ToolDefinitionInput[] | undefined,
          _uiAdapter: UIEventAdapter,
          onComplete: (
            message: string,
            toolCalls: Types.ConversationToolCall[],
          ) => void,
        ) => {
          onComplete("", [
            {
              __typename: "ConversationToolCall",
              id: "toolu_1",
              name: "execute_tool",
              arguments: JSON.stringify({
                tool: "task_complete",
                parameters: {
                  final_message: "Legacy answer from stale prompt.",
                },
              }),
            },
          ]);
        },
      );

    try {
      const result = await (client as any).executeStreamingLoop({
        conversationId: "conv-1",
        specification: TEST_SPEC,
        messages: [
          {
            __typename: "ConversationMessage",
            role: Types.ConversationRoleTypes.User,
            message: "Finish the task",
            timestamp: new Date().toISOString(),
          },
        ],
        tools: [
          {
            name: "execute_tool",
            description: "Execute one underlying tool.",
            schema: JSON.stringify({
              type: "object",
              properties: {
                tool: { type: "string" },
                parameters: { type: "object" },
              },
            }),
          },
        ],
        toolHandlers: {
          execute_tool: executeToolHandler,
        },
        uiAdapter,
        budgetTracker: undefined,
        contextStrategy: {
          toolResultTokenLimit: 8192,
          toolRoundLimit: 10,
          rebudgetThreshold: 0.75,
        },
        maxRounds: 4,
        abortSignal: undefined,
      });

      expect(streamWithOpenAISpy).toHaveBeenCalledTimes(1);
      expect(executeToolHandler).toHaveBeenCalledTimes(1);
      expect(executeToolHandler).toHaveBeenCalledWith(
        {
          tool: "task_complete",
          parameters: {},
        },
        expect.any(Object),
        undefined,
      );
      expect(result.finalAssistantMessage).toBe(
        "Legacy answer from stale prompt.",
      );
      expect(result.fullMessage).toBe("Legacy answer from stale prompt.");
      expect(result.toolCallNames).toEqual(["execute_tool"]);
      expect(result.intermediateMessages).toHaveLength(2);
      expect(result.intermediateMessages[0].message).toBe(
        "Legacy answer from stale prompt.",
      );

      const persistedToolCall = result.intermediateMessages[0].toolCalls?.[0];
      expect(persistedToolCall?.name).toBe("execute_tool");
      expect(persistedToolCall?.status).toBe(
        Types.ToolExecutionStatus.Completed,
      );

      const persistedArguments = JSON.parse(
        persistedToolCall?.arguments ?? "{}",
      ) as {
        tool?: string;
        parameters?: {
          final_message?: string;
        };
      };
      expect(persistedArguments.tool).toBe("task_complete");
      expect(persistedArguments.parameters?.final_message).toBeUndefined();
      expect(result.intermediateMessages[1].role).toBe(
        Types.ConversationRoleTypes.Tool,
      );
      expect(result.intermediateMessages[1].toolCallId).toBe("toolu_1");
      expect(result.intermediateMessages[1].message).toBe(
        "Task completion acknowledged.",
      );
    } finally {
      uiAdapter.dispose();
    }
  });
});

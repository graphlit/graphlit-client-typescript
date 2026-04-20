import { describe, it, expect, vi, afterEach } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
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

  it("executeStreamingLoop stops on task_complete without invoking its handler or starting a filler round", async () => {
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
      expect(taskCompleteHandler).not.toHaveBeenCalled();
      expect(result.finalAssistantMessage).toBe(
        "This is the real final answer.",
      );
      expect(result.fullMessage).toBe("This is the real final answer.");
      expect(result.toolCallCount).toBe(1);
      expect(result.intermediateMessages).toHaveLength(1);
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
    } finally {
      uiAdapter.dispose();
    }
  });
});

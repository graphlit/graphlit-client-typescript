import { describe, it, expect, vi, afterEach } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
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
          arguments: JSON.stringify({ summary: "Responded to user greeting." }),
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

    await client.streamAgent(
      "hello?",
      () => {},
      "conv-1",
      { id: TEST_SPEC.id },
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
});

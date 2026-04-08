import { describe, expect, it, vi } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import {
  isOpenAIResponsesEligibleModel,
  shouldUseOpenAIResponsesModel,
} from "../src/model-mapping";
import { UIEventAdapter } from "../src/streaming/ui-event-adapter";

describe("OpenAI Responses routing", () => {
  it("flags GPT-5.4+ models as eligible", () => {
    const gpt54Spec = {
      serviceType: Types.ModelServiceTypes.OpenAi,
      openAI: { model: Types.OpenAiModels.Gpt54_1024K },
    };
    const gpt54MiniSpec = {
      serviceType: Types.ModelServiceTypes.OpenAi,
      openAI: { model: Types.OpenAiModels.Gpt54Mini_400K },
    };
    const gpt52Spec = {
      serviceType: Types.ModelServiceTypes.OpenAi,
      openAI: { model: Types.OpenAiModels.Gpt52_400K },
    };

    expect(isOpenAIResponsesEligibleModel(gpt54Spec)).toBe(true);
    expect(shouldUseOpenAIResponsesModel(gpt54Spec)).toBe(true);
    expect(isOpenAIResponsesEligibleModel(gpt54MiniSpec)).toBe(true);
    expect(shouldUseOpenAIResponsesModel(gpt54MiniSpec)).toBe(true);
    expect(isOpenAIResponsesEligibleModel(gpt52Spec)).toBe(false);
    expect(shouldUseOpenAIResponsesModel(gpt52Spec)).toBe(false);
  });

  it("treats custom GPT-5.4+ model names as eligible", () => {
    const gpt54Spec = {
      serviceType: Types.ModelServiceTypes.OpenAi,
      openAI: {
        modelName: "gpt-5.4-2026-03-05",
      },
    };
    const gpt55Spec = {
      serviceType: Types.ModelServiceTypes.OpenAi,
      openAI: {
        modelName: "gpt-5.5",
      },
    };
    const gpt6Spec = {
      serviceType: Types.ModelServiceTypes.OpenAi,
      openAI: {
        modelName: "gpt-6",
      },
    };
    const gpt5Spec = {
      serviceType: Types.ModelServiceTypes.OpenAi,
      openAI: {
        modelName: "gpt-5",
      },
    };

    expect(isOpenAIResponsesEligibleModel(gpt54Spec)).toBe(true);
    expect(shouldUseOpenAIResponsesModel(gpt54Spec)).toBe(true);
    expect(isOpenAIResponsesEligibleModel(gpt55Spec)).toBe(true);
    expect(shouldUseOpenAIResponsesModel(gpt55Spec)).toBe(true);
    expect(isOpenAIResponsesEligibleModel(gpt6Spec)).toBe(true);
    expect(shouldUseOpenAIResponsesModel(gpt6Spec)).toBe(true);
    expect(isOpenAIResponsesEligibleModel(gpt5Spec)).toBe(false);
    expect(shouldUseOpenAIResponsesModel(gpt5Spec)).toBe(false);
  });

  it("routes eligible OpenAI models to Responses by default", async () => {
    const client = new Graphlit({ token: "test-token" });
    client.setOpenAIClient({});
    const uiAdapter = new UIEventAdapter(() => {}, "conv_test");

    const responsesSpy = vi
      .spyOn(client as any, "streamWithOpenAIResponses")
      .mockResolvedValue({
        message: "responses path",
        toolCalls: [],
        state: {
          instructions: undefined,
          initialInput: [],
          continuationItems: [],
        },
      });

    const openAISpy = vi
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
          onComplete("chat path", []);
        },
      );

    try {
      const result = await (client as any).executeStreamingLoop({
        conversationId: "conv_test",
        specification: {
          id: "spec_1",
          name: "Responses spec",
          serviceType: Types.ModelServiceTypes.OpenAi,
          openAI: {
            model: Types.OpenAiModels.Gpt54_1024K,
            temperature: 0.2,
          },
        },
        messages: [
          {
            __typename: "ConversationMessage",
            role: Types.ConversationRoleTypes.User,
            message: "Hi there",
            timestamp: new Date().toISOString(),
          },
        ],
        tools: undefined,
        toolHandlers: undefined,
        uiAdapter,
        budgetTracker: undefined,
        contextStrategy: {
          toolResultTokenLimit: 8192,
          toolRoundLimit: 10,
          rebudgetThreshold: 0.75,
        },
        maxRounds: 1,
        abortSignal: undefined,
      });

      expect(responsesSpy).toHaveBeenCalledTimes(1);
      expect(openAISpy).not.toHaveBeenCalled();
      expect(result.finalAssistantMessage).toBe("responses path");
    } finally {
      uiAdapter.dispose();
    }
  });

  it("routes to Responses when explicitly opted in", async () => {
    const client = new Graphlit({ token: "test-token" });
    client.setOpenAIClient({});
    const uiAdapter = new UIEventAdapter(() => {}, "conv_test");

    const responsesSpy = vi
      .spyOn(client as any, "streamWithOpenAIResponses")
      .mockResolvedValue({
        message: "responses path",
        toolCalls: [],
        state: {
          instructions: undefined,
          initialInput: [],
          continuationItems: [],
        },
      });

    const openAISpy = vi
      .spyOn(client as any, "streamWithOpenAI")
      .mockImplementation(async () => {});

    try {
      const result = await (client as any).executeStreamingLoop({
        conversationId: "conv_test",
        specification: {
          id: "spec_1",
          name: "Responses spec",
          serviceType: Types.ModelServiceTypes.OpenAi,
          openAI: {
            model: Types.OpenAiModels.Gpt54_1024K,
            temperature: 0.2,
          },
        },
        messages: [
          {
            __typename: "ConversationMessage",
            role: Types.ConversationRoleTypes.User,
            message: "Hi there",
            timestamp: new Date().toISOString(),
          },
        ],
        tools: undefined,
        toolHandlers: undefined,
        uiAdapter,
        budgetTracker: undefined,
        contextStrategy: {
          toolResultTokenLimit: 8192,
          toolRoundLimit: 10,
          rebudgetThreshold: 0.75,
        },
        maxRounds: 1,
        abortSignal: undefined,
        useResponsesApi: true,
      });

      expect(responsesSpy).toHaveBeenCalledTimes(1);
      expect(openAISpy).not.toHaveBeenCalled();
      expect(result.finalAssistantMessage).toBe("responses path");
    } finally {
      uiAdapter.dispose();
    }
  });
});

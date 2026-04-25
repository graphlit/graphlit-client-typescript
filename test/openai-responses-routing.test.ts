import { describe, expect, it, vi } from "vitest";
import { Graphlit, ProviderError } from "../src/client";
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

  it("fails over to the next streaming specification after retryable provider exhaustion", async () => {
    const client = new Graphlit({ token: "test-token" });
    client.setAnthropicClient({});
    client.setOpenAIClient({});
    const uiAdapter = new UIEventAdapter(() => {}, "conv_test");
    const timeoutSpy = vi
      .spyOn(globalThis, "setTimeout")
      .mockImplementation(((handler: TimerHandler) => {
        if (typeof handler === "function") {
          handler();
        }
        return 0 as any;
      }) as typeof setTimeout);

    const anthropicSpy = vi
      .spyOn(client as any, "streamWithAnthropic")
      .mockRejectedValue(
        new ProviderError("Anthropic rate limit exceeded: overloaded", {
          provider: "Anthropic",
          statusCode: 529,
          retryable: true,
        }),
      );

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
          onComplete("fallback path", []);
        },
      );

    const primarySpec = {
      id: "spec_anthropic",
      name: "Primary Anthropic",
      serviceType: Types.ModelServiceTypes.Anthropic,
      systemPrompt: "Primary system",
      anthropic: {
        model: Types.AnthropicModels.Claude_4Sonnet,
      },
    } as Types.Specification;
    const fallbackSpec = {
      id: "spec_openai",
      name: "Fallback OpenAI",
      serviceType: Types.ModelServiceTypes.OpenAi,
      systemPrompt: "Fallback system",
      openAI: {
        model: Types.OpenAiModels.Gpt52_400K,
      },
    } as Types.Specification;

    try {
      const result = await (client as any).executeStreamingLoop({
        conversationId: "conv_test",
        specification: primarySpec,
        fallbackSpecifications: [fallbackSpec],
        messages: [
          {
            __typename: "ConversationMessage",
            role: Types.ConversationRoleTypes.System,
            message: primarySpec.systemPrompt,
            timestamp: new Date().toISOString(),
          },
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

      expect(anthropicSpy).toHaveBeenCalledTimes(4);
      expect(openAISpy).toHaveBeenCalledTimes(1);
      expect(openAISpy.mock.calls[0][0]).toMatchObject({
        id: fallbackSpec.id,
      });
      expect(openAISpy.mock.calls[0][1][0]).toMatchObject({
        role: "system",
        message: fallbackSpec.systemPrompt,
      });
      expect(result.finalAssistantMessage).toBe("fallback path");
      expect(result.usedSpecification?.id).toBe(fallbackSpec.id);
    } finally {
      timeoutSpy.mockRestore();
      uiAdapter.dispose();
    }
  });
});

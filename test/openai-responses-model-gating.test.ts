import { describe, expect, it } from "vitest";
import * as Types from "../src/generated/graphql-types";
import {
  getModelName,
  isOpenAIResponsesEligibleModel,
} from "../src/model-mapping";

describe("OpenAI Responses model gating", () => {
  it("allows GPT-5.4+ OpenAI specs", () => {
    expect(
      isOpenAIResponsesEligibleModel({
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: { model: Types.OpenAiModels.Gpt54_1024K },
      }),
    ).toBe(true);

    expect(
      isOpenAIResponsesEligibleModel({
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: { model: Types.OpenAiModels.Gpt54Mini_400K_20260317 },
      }),
    ).toBe(true);

    expect(
      isOpenAIResponsesEligibleModel({
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: { model: Types.OpenAiModels.Gpt55_1024K },
      }),
    ).toBe(true);
  });

  it("maps GPT-5.5 enum values to OpenAI model names", () => {
    expect(
      getModelName({
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: { model: Types.OpenAiModels.Gpt55_1024K },
      }),
    ).toBe("gpt-5.5");

    expect(
      getModelName({
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: { model: Types.OpenAiModels.Gpt55_1024K_20260423 },
      }),
    ).toBe("gpt-5.5-2026-04-23");
  });

  it("allows newer custom GPT model names", () => {
    expect(
      isOpenAIResponsesEligibleModel({
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: { modelName: "gpt-5.5" },
      }),
    ).toBe(true);

    expect(
      isOpenAIResponsesEligibleModel({
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: { modelName: "gpt-6" },
      }),
    ).toBe(true);
  });

  it("rejects older OpenAI models and non-OpenAI services", () => {
    expect(
      isOpenAIResponsesEligibleModel({
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: { model: Types.OpenAiModels.Gpt52_400K },
      }),
    ).toBe(false);

    expect(
      isOpenAIResponsesEligibleModel({
        serviceType: Types.ModelServiceTypes.Anthropic,
        anthropic: { model: Types.AnthropicModels.Claude_4Sonnet },
      }),
    ).toBe(false);
  });
});

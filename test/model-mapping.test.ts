import { describe, expect, it } from "vitest";
import * as Types from "../src/generated/graphql-types";
import {
  getModelName,
  isAnthropicAdaptiveThinkingOnlyModel,
} from "../src/model-mapping";

describe("model mapping", () => {
  it("maps Gemini 3.5 Flash to the Google model name", () => {
    expect(
      getModelName({
        serviceType: Types.ModelServiceTypes.Google,
        google: { model: Types.GoogleModels.Gemini_3_5Flash },
      }),
    ).toBe("gemini-3.5-flash");
  });

  it("maps Claude Opus 4.8 to the Anthropic model name", () => {
    expect(
      getModelName({
        serviceType: Types.ModelServiceTypes.Anthropic,
        anthropic: { model: Types.AnthropicModels.Claude_4_8Opus },
      }),
    ).toBe("claude-opus-4-8");
  });

  it("detects adaptive-thinking-only Anthropic Opus models", () => {
    expect(
      isAnthropicAdaptiveThinkingOnlyModel({
        serviceType: Types.ModelServiceTypes.Anthropic,
        anthropic: { model: Types.AnthropicModels.Claude_4_7Opus },
      }),
    ).toBe(true);

    expect(
      isAnthropicAdaptiveThinkingOnlyModel({
        serviceType: Types.ModelServiceTypes.Anthropic,
        anthropic: { model: Types.AnthropicModels.Claude_4_8Opus },
      }),
    ).toBe(true);

    expect(
      isAnthropicAdaptiveThinkingOnlyModel({
        serviceType: Types.ModelServiceTypes.Anthropic,
        anthropic: { modelName: "claude-opus-4-8" },
      }),
    ).toBe(true);

    expect(
      isAnthropicAdaptiveThinkingOnlyModel({
        serviceType: Types.ModelServiceTypes.Anthropic,
        anthropic: { model: Types.AnthropicModels.Claude_4_6Opus },
      }),
    ).toBe(false);
  });
});

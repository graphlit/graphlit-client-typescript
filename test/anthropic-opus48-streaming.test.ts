import { describe, expect, it, vi } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import { streamWithAnthropic } from "../src/streaming/providers";

describe("Anthropic Opus 4.8 streaming", () => {
  it("uses adaptive thinking config for Claude Opus 4.8", () => {
    const client = new Graphlit({ token: "test-token" });

    const thinkingConfig = (client as any).getThinkingConfig({
      serviceType: Types.ModelServiceTypes.Anthropic,
      anthropic: {
        model: Types.AnthropicModels.Claude_4_8Opus,
        enableThinking: true,
        effort: Types.AnthropicEffortLevels.High,
      },
    });

    expect(thinkingConfig).toEqual({
      type: "adaptive",
      effort: "high",
    });
  });

  it("omits temperature for Claude Opus 4.8 streaming requests", async () => {
    const create = vi.fn().mockResolvedValue({
      async *[Symbol.asyncIterator]() {},
    });
    const onComplete = vi.fn();

    await streamWithAnthropic(
      {
        name: "Claude Opus 4.8",
        serviceType: Types.ModelServiceTypes.Anthropic,
        anthropic: {
          model: Types.AnthropicModels.Claude_4_8Opus,
          temperature: 0.2,
        },
      } as Types.Specification,
      [{ role: "user", content: "Hello" }] as any,
      undefined,
      undefined,
      { messages: { create } } as any,
      () => {},
      onComplete,
    );

    expect(create).toHaveBeenCalledTimes(1);
    expect(create.mock.calls[0]?.[0]).toMatchObject({
      model: "claude-opus-4-8",
      messages: [{ role: "user", content: "Hello" }],
      max_tokens: 8192,
      stream: true,
    });
    expect(create.mock.calls[0]?.[0]).not.toHaveProperty("temperature");
    expect(onComplete).toHaveBeenCalledWith("", [], null, undefined);
  });
});

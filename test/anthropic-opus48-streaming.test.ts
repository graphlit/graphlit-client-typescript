import { describe, expect, it, vi } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import { streamWithAnthropic } from "../src/streaming/providers";

describe("Anthropic adaptive thinking streaming", () => {
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
      display: "summarized",
    });
  });

  it("uses adaptive thinking config for Claude Fable 5", () => {
    const client = new Graphlit({ token: "test-token" });

    const thinkingConfig = (client as any).getThinkingConfig({
      serviceType: Types.ModelServiceTypes.Anthropic,
      anthropic: {
        model: Types.AnthropicModels.Claude_5Fable,
        enableThinking: true,
        effort: Types.AnthropicEffortLevels.XHigh,
      },
    });

    expect(thinkingConfig).toEqual({
      type: "adaptive",
      effort: "xhigh",
      display: "summarized",
    });
  });

  it("uses adaptive thinking config for Claude Sonnet 5", () => {
    const client = new Graphlit({ token: "test-token" });

    const thinkingConfig = (client as any).getThinkingConfig({
      serviceType: Types.ModelServiceTypes.Anthropic,
      anthropic: {
        model: Types.AnthropicModels.Claude_5Sonnet,
        enableThinking: true,
        effort: Types.AnthropicEffortLevels.High,
      },
    });

    expect(thinkingConfig).toEqual({
      type: "adaptive",
      effort: "high",
      display: "summarized",
    });
  });

  it("adds summarized display for Claude 4 manual thinking models", () => {
    const client = new Graphlit({ token: "test-token" });

    const thinkingConfig = (client as any).getThinkingConfig({
      serviceType: Types.ModelServiceTypes.Anthropic,
      anthropic: {
        model: Types.AnthropicModels.Claude_4Sonnet,
        enableThinking: true,
        thinkingTokenLimit: 8000,
      },
    });

    expect(thinkingConfig).toEqual({
      type: "enabled",
      budget_tokens: 8000,
      display: "summarized",
    });
  });

  it("does not add display for older non-Claude-4 thinking models", () => {
    const client = new Graphlit({ token: "test-token" });

    const thinkingConfig = (client as any).getThinkingConfig({
      serviceType: Types.ModelServiceTypes.Anthropic,
      anthropic: {
        model: Types.AnthropicModels.Claude_3_7Sonnet,
        enableThinking: true,
        thinkingTokenLimit: 8000,
      },
    });

    expect(thinkingConfig).toEqual({
      type: "enabled",
      budget_tokens: 8000,
    });
  });

  it("omits temperature for Claude Opus 4.8 streaming requests", async () => {
    const create = vi.fn().mockResolvedValue({
      async *[Symbol.asyncIterator]() { },
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
      () => { },
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

  it("omits temperature for Claude Fable 5 streaming requests", async () => {
    const create = vi.fn().mockResolvedValue({
      async *[Symbol.asyncIterator]() { },
    });
    const onComplete = vi.fn();

    await streamWithAnthropic(
      {
        name: "Claude Fable 5",
        serviceType: Types.ModelServiceTypes.Anthropic,
        anthropic: {
          modelName: "claude-fable-5",
          temperature: 0.2,
        },
      } as Types.Specification,
      [{ role: "user", content: "Hello" }] as any,
      undefined,
      undefined,
      { messages: { create } } as any,
      () => { },
      onComplete,
    );

    expect(create).toHaveBeenCalledTimes(1);
    expect(create.mock.calls[0]?.[0]).toMatchObject({
      model: "claude-fable-5",
      messages: [{ role: "user", content: "Hello" }],
      max_tokens: 8192,
      stream: true,
    });
    expect(create.mock.calls[0]?.[0]).not.toHaveProperty("temperature");
    expect(onComplete).toHaveBeenCalledWith("", [], null, undefined);
  });

  it("omits temperature for Claude Sonnet 5 streaming requests", async () => {
    const create = vi.fn().mockResolvedValue({
      async *[Symbol.asyncIterator]() { },
    });
    const onComplete = vi.fn();

    await streamWithAnthropic(
      {
        name: "Claude Sonnet 5",
        serviceType: Types.ModelServiceTypes.Anthropic,
        anthropic: {
          modelName: "claude-sonnet-5",
          temperature: 0.2,
        },
      } as Types.Specification,
      [{ role: "user", content: "Hello" }] as any,
      undefined,
      undefined,
      { messages: { create } } as any,
      () => { },
      onComplete,
    );

    expect(create).toHaveBeenCalledTimes(1);
    expect(create.mock.calls[0]?.[0]).toMatchObject({
      model: "claude-sonnet-5",
      messages: [{ role: "user", content: "Hello" }],
      max_tokens: 8192,
      stream: true,
    });
    expect(create.mock.calls[0]?.[0]).not.toHaveProperty("temperature");
    expect(onComplete).toHaveBeenCalledWith("", [], null, undefined);
  });

  it("passes summarized display through Anthropic adaptive thinking requests", async () => {
    const create = vi.fn().mockResolvedValue({
      async *[Symbol.asyncIterator]() { },
    });

    await streamWithAnthropic(
      {
        name: "Claude Opus 4.8",
        serviceType: Types.ModelServiceTypes.Anthropic,
        anthropic: {
          model: Types.AnthropicModels.Claude_4_8Opus,
        },
      } as Types.Specification,
      [{ role: "user", content: "Hello" }] as any,
      undefined,
      undefined,
      { messages: { create } } as any,
      () => { },
      vi.fn(),
      undefined,
      {
        type: "adaptive",
        effort: "medium",
        display: "summarized",
      },
    );

    expect(create).toHaveBeenCalledTimes(1);
    expect(create.mock.calls[0]?.[0]).toMatchObject({
      thinking: {
        type: "adaptive",
        display: "summarized",
      },
      output_config: {
        effort: "medium",
      },
    });
  });
});

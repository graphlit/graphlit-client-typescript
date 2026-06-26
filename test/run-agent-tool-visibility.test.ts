import { describe, expect, it } from "vitest";
import {
  RequiredToolChoiceError,
  assertRequiredToolChoiceConfig,
  deriveProviderToolChoicePolicy,
  normalizeToolVisibilityResult,
  toAnthropicToolChoice,
  toGoogleToolConfig,
  toOpenAIChatToolChoice,
  toOpenAIResponsesToolChoice,
  validateRequiredToolChoice,
} from "../src/helpers/tool-visibility";
import type {
  ConversationToolCall,
  ToolDefinitionInput,
} from "../src/generated/graphql-types";
import type {
  RunAgentOptions,
  StreamAgentOptions,
  ToolVisibilityResolver,
} from "../src/types/agent";

const makeTool = (name: string): ToolDefinitionInput => ({
  name,
  description: `${name} tool`,
  schema: JSON.stringify({
    type: "object",
    properties: {},
  }),
});

const makeToolCall = (name: string): ConversationToolCall => ({
  id: `call-${name}`,
  name,
  arguments: "{}",
});

describe("agent tool visibility", () => {
  it("uses fallback tools when the resolver returns undefined", () => {
    const fallbackTools = [makeTool("analyze_prompt"), makeTool("search_tools")];

    const result = normalizeToolVisibilityResult(fallbackTools, undefined);

    expect(result.tools).toBe(fallbackTools);
    expect(result.requireTool).toBeUndefined();
    expect(result.requiredToolName).toBeUndefined();
  });

  it("accepts an array as shorthand for visible tools", () => {
    const fallbackTools = [makeTool("analyze_prompt"), makeTool("search_tools")];
    const visibleTools = [fallbackTools[0]];

    const result = normalizeToolVisibilityResult(fallbackTools, visibleTools);

    expect(result.tools).toBe(visibleTools);
  });

  it("preserves tool-choice hints while defaulting missing tools to fallback", () => {
    const fallbackTools = [makeTool("analyze_prompt"), makeTool("search_tools")];

    const result = normalizeToolVisibilityResult(fallbackTools, {
      requireTool: true,
      requiredToolName: "analyze_prompt",
    });

    expect(result.tools).toBe(fallbackTools);
    expect(result.requireTool).toBe(true);
    expect(result.requiredToolName).toBe("analyze_prompt");
  });

  it("supports additive resolveTools fields on existing options shapes", () => {
    const resolver: ToolVisibilityResolver = ({ tools }) =>
      tools.filter((tool) => tool.name === "analyze_prompt");

    const runOptions: RunAgentOptions = {
      tools: [makeTool("analyze_prompt")],
      toolHandlers: {},
      completionMode: "allow_terminal_text",
      resolveTools: resolver,
    };

    const streamOptions: StreamAgentOptions = {
      maxToolRounds: 1,
      resolveTools: resolver,
    };

    expect(runOptions.resolveTools).toBe(resolver);
    expect(streamOptions.resolveTools).toBe(resolver);
  });

  it("derives provider tool choice policy from required visibility", () => {
    const visibility = normalizeToolVisibilityResult([], {
      tools: [makeTool("analyze_prompt")],
      requireTool: true,
      requiredToolName: "analyze_prompt",
    });

    expect(deriveProviderToolChoicePolicy(visibility)).toEqual({
      requireTool: true,
      requiredToolName: "analyze_prompt",
    });
  });

  it("rejects required tool visibility with no visible tools", () => {
    expect(() =>
      assertRequiredToolChoiceConfig({ tools: [], requireTool: true }),
    ).toThrow(RequiredToolChoiceError);
  });

  it("rejects required tool names that are not visible", () => {
    expect(() =>
      assertRequiredToolChoiceConfig({
        tools: [makeTool("search_tools")],
        requireTool: true,
        requiredToolName: "analyze_prompt",
      }),
    ).toThrow(RequiredToolChoiceError);
  });

  it("rejects terminal text when a tool is required", () => {
    expect(() =>
      validateRequiredToolChoice(
        { tools: [makeTool("analyze_prompt")], requireTool: true },
        [],
      ),
    ).toThrow(RequiredToolChoiceError);
  });

  it("rejects the wrong returned tool when a specific tool is required", () => {
    expect(() =>
      validateRequiredToolChoice(
        {
          tools: [makeTool("analyze_prompt")],
          requireTool: true,
          requiredToolName: "analyze_prompt",
        },
        [makeToolCall("search_tools")],
      ),
    ).toThrow(RequiredToolChoiceError);
  });

  it("accepts the required returned tool", () => {
    expect(() =>
      validateRequiredToolChoice(
        {
          tools: [makeTool("analyze_prompt")],
          requireTool: true,
          requiredToolName: "analyze_prompt",
        },
        [makeToolCall("analyze_prompt")],
      ),
    ).not.toThrow();
  });

  it("maps required tool policy to provider tool-choice shapes", () => {
    const policy = {
      requireTool: true,
      requiredToolName: "analyze_prompt",
    };

    expect(toOpenAIChatToolChoice(policy)).toEqual({
      type: "function",
      function: { name: "analyze_prompt" },
    });
    expect(toOpenAIResponsesToolChoice(policy)).toEqual({
      type: "function",
      name: "analyze_prompt",
    });
    expect(toAnthropicToolChoice(policy)).toEqual({
      type: "tool",
      name: "analyze_prompt",
    });
    expect(toGoogleToolConfig(policy)).toEqual({
      functionCallingConfig: {
        mode: "ANY",
        allowedFunctionNames: ["analyze_prompt"],
      },
    });
  });
});

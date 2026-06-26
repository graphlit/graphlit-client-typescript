import { describe, expect, it } from "vitest";
import { normalizeToolVisibilityResult } from "../src/helpers/tool-visibility";
import type { ToolDefinitionInput } from "../src/generated/graphql-types";
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
});

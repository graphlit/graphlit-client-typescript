import type { ToolDefinitionInput } from "../generated/graphql-types.js";
import type { ToolVisibilityResult } from "../types/agent.js";

export function normalizeToolVisibilityResult(
  fallbackTools: ToolDefinitionInput[] | undefined,
  result: ToolDefinitionInput[] | ToolVisibilityResult | undefined,
): ToolVisibilityResult {
  if (!result) return { tools: fallbackTools };
  if (Array.isArray(result)) return { tools: result };

  return {
    tools: result.tools ?? fallbackTools,
    requireTool: result.requireTool,
    requiredToolName: result.requiredToolName,
  };
}

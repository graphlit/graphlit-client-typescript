import type {
  ConversationToolCall,
  ToolDefinitionInput,
} from "../generated/graphql-types.js";
import type { ToolVisibilityResult } from "../types/agent.js";

export interface ProviderToolChoicePolicy {
  requireTool: boolean;
  requiredToolName?: string;
}

export class RequiredToolChoiceError extends Error {
  readonly code = "required_tool_choice_violation";
  readonly requiredToolName?: string;
  readonly actualToolNames: string[];

  constructor(args: {
    message: string;
    requiredToolName?: string;
    actualToolNames?: string[];
  }) {
    super(args.message);
    this.name = "RequiredToolChoiceError";
    this.requiredToolName = args.requiredToolName;
    this.actualToolNames = args.actualToolNames ?? [];
  }
}

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

export function deriveProviderToolChoicePolicy(
  visibility: ToolVisibilityResult,
): ProviderToolChoicePolicy | undefined {
  if (!visibility.requireTool && !visibility.requiredToolName) return undefined;

  return {
    requireTool: visibility.requireTool === true || !!visibility.requiredToolName,
    requiredToolName: visibility.requiredToolName,
  };
}

export function assertRequiredToolChoiceConfig(
  visibility: ToolVisibilityResult,
): void {
  const policy = deriveProviderToolChoicePolicy(visibility);
  if (!policy?.requireTool) return;

  const visibleToolNames = new Set((visibility.tools ?? []).map((tool) => tool.name));
  if (visibleToolNames.size === 0) {
    throw new RequiredToolChoiceError({
      message: "Tool visibility required a tool call, but no tools were visible.",
      requiredToolName: policy.requiredToolName,
    });
  }

  if (policy.requiredToolName && !visibleToolNames.has(policy.requiredToolName)) {
    throw new RequiredToolChoiceError({
      message: `Tool visibility required ${policy.requiredToolName}, but that tool was not visible.`,
      requiredToolName: policy.requiredToolName,
    });
  }
}

export function validateRequiredToolChoice(
  visibility: ToolVisibilityResult,
  toolCalls: ConversationToolCall[] | undefined,
): void {
  const policy = deriveProviderToolChoicePolicy(visibility);
  if (!policy?.requireTool) return;

  const actualToolNames = (toolCalls ?? [])
    .map((toolCall) => toolCall.name)
    .filter((name): name is string => !!name);

  if (actualToolNames.length === 0) {
    throw new RequiredToolChoiceError({
      message: policy.requiredToolName
        ? `Expected tool call ${policy.requiredToolName}, but the provider returned no tool calls.`
        : "Expected a tool call, but the provider returned no tool calls.",
      requiredToolName: policy.requiredToolName,
      actualToolNames,
    });
  }

  if (
    policy.requiredToolName &&
    actualToolNames.some((name) => name !== policy.requiredToolName)
  ) {
    throw new RequiredToolChoiceError({
      message: `Expected tool call ${policy.requiredToolName}, but the provider returned ${actualToolNames.join(", ")}.`,
      requiredToolName: policy.requiredToolName,
      actualToolNames,
    });
  }
}

export function toOpenAIChatToolChoice(
  policy: ProviderToolChoicePolicy | undefined,
): unknown | undefined {
  if (!policy?.requireTool) return undefined;
  if (policy.requiredToolName) {
    return {
      type: "function",
      function: { name: policy.requiredToolName },
    };
  }
  return "required";
}

export function toOpenAIResponsesToolChoice(
  policy: ProviderToolChoicePolicy | undefined,
): unknown | undefined {
  if (!policy?.requireTool) return undefined;
  if (policy.requiredToolName) {
    return {
      type: "function",
      name: policy.requiredToolName,
    };
  }
  return "required";
}

export function toAnthropicToolChoice(
  policy: ProviderToolChoicePolicy | undefined,
): unknown | undefined {
  if (!policy?.requireTool) return undefined;
  if (policy.requiredToolName) {
    return {
      type: "tool",
      name: policy.requiredToolName,
    };
  }
  return { type: "any" };
}

export function toGoogleToolConfig(
  policy: ProviderToolChoicePolicy | undefined,
): unknown | undefined {
  if (!policy?.requireTool) return undefined;
  return {
    functionCallingConfig: {
      mode: "ANY",
      ...(policy.requiredToolName
        ? { allowedFunctionNames: [policy.requiredToolName] }
        : {}),
    },
  };
}

import {
  ConversationToolCall,
  Specification,
} from "../generated/graphql-types.js";
import { getModelName } from "../model-mapping.js";
import {
  ProviderError,
  StreamEvent,
  extractRequestId,
  isNetworkError,
  isRateLimitError,
  isRetryableServerError,
} from "../types/internal.js";
import type {
  OpenAIResponsesInputItem,
  OpenAIResponsesToolDefinition,
} from "./llm-formatters.js";

export interface OpenAIResponsesRoundResult {
  message: string;
  toolCalls: ConversationToolCall[];
  usage?: unknown;
  outputItems: OpenAIResponsesInputItem[];
}

type FunctionCallEventItem = {
  id?: string;
  call_id?: string;
  name?: string;
  arguments?: string;
  type?: string;
};

function isFunctionCallOutputItem(item: unknown): item is FunctionCallEventItem {
  return (
    typeof item === "object" &&
    item !== null &&
    (item as { type?: string }).type === "function_call"
  );
}

function toToolCallId(
  item: FunctionCallEventItem,
  outputIndex: number,
): string {
  return item.call_id || item.id || `tool_${Date.now()}_${outputIndex}`;
}

export async function streamWithOpenAIResponses(
  specification: Specification,
  instructions: string | undefined,
  input: OpenAIResponsesInputItem[],
  tools: OpenAIResponsesToolDefinition[] | undefined,
  openaiClient: any,
  onEvent: (event: StreamEvent) => void,
  abortSignal?: AbortSignal,
  reasoningEffort?: string,
): Promise<OpenAIResponsesRoundResult> {
  let fullMessage = "";
  let tokenCount = 0;
  let usageData: unknown;
  let outputItems: OpenAIResponsesInputItem[] = [];

  const toolCallsByIndex = new Map<number, ConversationToolCall>();
  const toolCallIdsByItemId = new Map<string, string>();
  const startedToolCallIds = new Set<string>();
  const parsedToolCallIds = new Set<string>();

  const getOrCreateToolCall = (
    outputIndex: number,
    item?: FunctionCallEventItem,
  ): ConversationToolCall => {
    const existing = toolCallsByIndex.get(outputIndex);
    if (existing) {
      if (item?.name) {
        existing.name = item.name;
      }
      if (typeof item?.arguments === "string" && !existing.arguments) {
        existing.arguments = item.arguments;
      }
      return existing;
    }

    const toolCall: ConversationToolCall = {
      __typename: "ConversationToolCall",
      id: toToolCallId(item || {}, outputIndex),
      name: item?.name || "",
      arguments: item?.arguments || "",
    };

    toolCallsByIndex.set(outputIndex, toolCall);
    if (item?.id) {
      toolCallIdsByItemId.set(item.id, toolCall.id);
    }

    return toolCall;
  };

  const emitToolCallStartIfNeeded = (toolCall: ConversationToolCall) => {
    if (startedToolCallIds.has(toolCall.id)) {
      return;
    }

    startedToolCallIds.add(toolCall.id);
    onEvent({
      type: "tool_call_start",
      toolCall: {
        id: toolCall.id,
        name: toolCall.name,
      },
    });
  };

  const emitToolCallParsedIfNeeded = (toolCall: ConversationToolCall) => {
    if (!toolCall.arguments || parsedToolCallIds.has(toolCall.id)) {
      return;
    }

    parsedToolCallIds.add(toolCall.id);
    onEvent({
      type: "tool_call_parsed",
      toolCall: {
        id: toolCall.id,
        name: toolCall.name,
        arguments: toolCall.arguments,
      },
    });
  };

  try {
    const modelName = getModelName(specification);
    if (!modelName) {
      throw new Error(
        `No model name found for specification: ${specification.name} (service: ${specification.serviceType})`,
      );
    }

    const request: any = {
      model: modelName,
      input,
      stream: true,
      store: false,
      include: ["reasoning.encrypted_content"],
    };

    if (instructions?.trim()) {
      request.instructions = instructions.trim();
    }

    // GPT-5.4+: temperature/top_p are only supported with reasoning effort "none".
    // Sending temperature with any other reasoning effort raises an error.
    const effectiveEffort = reasoningEffort?.toLowerCase();
    if (
      specification.openAI?.temperature !== undefined &&
      (!effectiveEffort || effectiveEffort === "none")
    ) {
      request.temperature = specification.openAI.temperature;
    }

    if (specification.openAI?.completionTokenLimit) {
      request.max_output_tokens = specification.openAI.completionTokenLimit;
    }

    if (tools?.length) {
      request.tools = tools;
    }

    if (effectiveEffort && effectiveEffort !== "none") {
      request.reasoning = { effort: effectiveEffort };
    }

    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `🤖 [OpenAI Responses] Model Config: Model=${modelName} | Temperature=${specification.openAI?.temperature} | MaxTokens=${specification.openAI?.completionTokenLimit || "null"} | Tools=${tools?.length || 0} | ReasoningEffort=${reasoningEffort || "none"} | Spec="${specification.name}"`,
      );
      if (tools?.length) {
        console.log(
          `🔧 [OpenAI Responses] Tools: ${tools.map((t) => t.name).join(", ")}`,
        );
      }
    }

    const stream = await openaiClient.responses.create(request, {
      signal: abortSignal,
    });

    for await (const event of stream) {
      switch (event.type) {
        case "response.output_text.delta":
          if (event.delta) {
            fullMessage += event.delta;
            tokenCount++;
            onEvent({ type: "token", token: event.delta });
          }
          break;

        case "response.output_item.added": {
          const item = event.item as FunctionCallEventItem;
          if (item?.type !== "function_call") {
            break;
          }

          const toolCall = getOrCreateToolCall(event.output_index, item);
          emitToolCallStartIfNeeded(toolCall);
          break;
        }

        case "response.function_call_arguments.delta": {
          const toolCallId =
            toolCallIdsByItemId.get(event.item_id) ||
            toolCallsByIndex.get(event.output_index)?.id;
          const toolCall = toolCallsByIndex.get(event.output_index);

          if (!toolCall || !toolCallId) {
            break;
          }

          toolCall.arguments += event.delta;
          onEvent({
            type: "tool_call_delta",
            toolCallId,
            argumentDelta: event.delta,
          });
          break;
        }

        case "response.function_call_arguments.done": {
          const toolCall = toolCallsByIndex.get(event.output_index);
          if (!toolCall) {
            break;
          }

          toolCall.arguments = event.arguments;
          emitToolCallParsedIfNeeded(toolCall);
          break;
        }

        case "response.output_item.done": {
          const item = event.item as FunctionCallEventItem;
          if (item?.type !== "function_call") {
            break;
          }

          const toolCall = getOrCreateToolCall(event.output_index, item);
          if (item.id) {
            toolCallIdsByItemId.set(item.id, toolCall.id);
          }
          emitToolCallStartIfNeeded(toolCall);

          if (typeof item.arguments === "string") {
            toolCall.arguments = item.arguments;
            emitToolCallParsedIfNeeded(toolCall);
          }
          break;
        }

        case "response.completed":
          usageData = event.response?.usage;
          outputItems = (event.response?.output || []) as OpenAIResponsesInputItem[];
          if (Array.isArray(event.response?.output)) {
            (event.response.output as OpenAIResponsesInputItem[]).forEach((
              item: OpenAIResponsesInputItem,
              outputIndex: number,
            ) => {
              if (!isFunctionCallOutputItem(item)) {
                return;
              }

              const toolCall = getOrCreateToolCall(outputIndex, item);
              if (item.id) {
                toolCallIdsByItemId.set(item.id, toolCall.id);
              }
              if (typeof item.arguments === "string") {
                toolCall.arguments = item.arguments;
              }
            });
          }
          if (!fullMessage && typeof event.response?.output_text === "string") {
            fullMessage = event.response.output_text;
          }
          break;

        case "error":
        case "response.error":
          throw new Error(
            event.error?.message || "OpenAI Responses streaming error",
          );

        case "response.failed":
          throw new Error(
            event.response?.error?.message || "OpenAI Responses request failed",
          );
      }
    }

    const orderedToolCalls = Array.from(toolCallsByIndex.entries())
      .sort(([left], [right]) => left - right)
      .map(([, toolCall]) => toolCall);

    for (const toolCall of orderedToolCalls) {
      emitToolCallParsedIfNeeded(toolCall);
    }

    onEvent({
      type: "complete",
      tokens: tokenCount,
    });

    return {
      message: fullMessage,
      toolCalls: orderedToolCalls,
      usage: usageData,
      outputItems,
    };
  } catch (error: any) {
    const errorMessage = error.message || error.toString();

    if (isRateLimitError(error)) {
      throw new ProviderError(`OpenAI rate limit exceeded: ${errorMessage}`, {
        provider: "openai",
        statusCode: 429,
        retryable: true,
        requestId: extractRequestId(error),
        cause: error,
      });
    }

    if (isNetworkError(error)) {
      throw new ProviderError(`OpenAI network error: ${errorMessage}`, {
        provider: "openai",
        statusCode: error.status ?? 0,
        retryable: true,
        requestId: extractRequestId(error),
        cause: error,
      });
    }

    if (isRetryableServerError(error)) {
      throw new ProviderError(`OpenAI server error: ${errorMessage}`, {
        provider: "openai",
        statusCode: error.status ?? error.statusCode ?? 500,
        retryable: true,
        requestId: extractRequestId(error),
        cause: error,
      });
    }

    throw new ProviderError(`OpenAI error: ${errorMessage}`, {
      provider: "openai",
      statusCode: error.status ?? error.statusCode ?? 400,
      retryable: false,
      requestId: extractRequestId(error),
      cause: error,
    });
  }
}

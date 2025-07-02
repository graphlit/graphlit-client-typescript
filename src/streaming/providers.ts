import {
  ConversationToolCall,
  Specification,
  ToolDefinitionInput,
  ConversationMessage,
  ConversationRoleTypes,
} from "../generated/graphql-types.js";
import * as Types from "../generated/graphql-types.js";
import {
  OpenAIMessage,
  AnthropicMessage,
  GoogleMessage,
  CohereMessage,
  MistralMessage,
  BedrockMessage,
} from "./llm-formatters.js";
import { getModelName } from "../model-mapping.js";
import { StreamEvent } from "../types/internal.js";

// Import Cohere SDK types for proper typing
import type { Cohere } from "cohere-ai";

/**
 * Helper to check if a string is valid JSON
 */
function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Simplify schema for Groq by removing complex features that may cause issues
 */
function simplifySchemaForGroq(schema: any): string {
  if (typeof schema !== "object" || schema === null) {
    return JSON.stringify(schema);
  }

  // Remove complex JSON Schema features that Groq might not support
  const simplified: any = {
    type: schema.type || "object",
    properties: {},
    required: schema.required || [],
  };

  // Only keep basic properties and types
  if (schema.properties) {
    for (const [key, value] of Object.entries(schema.properties)) {
      const prop = value as any;
      simplified.properties[key] = {
        type: prop.type || "string",
        description: prop.description || "",
        // Remove complex features like patterns, formats, etc.
      };

      // Keep enum if present (but simplified)
      if (prop.enum && Array.isArray(prop.enum)) {
        simplified.properties[key].enum = prop.enum;
      }
    }
  }

  return JSON.stringify(simplified);
}

/**
 * Clean schema for Google Gemini by removing unsupported fields
 */
function cleanSchemaForGoogle(schema: any): any {
  if (typeof schema !== "object" || schema === null) {
    return schema;
  }

  if (Array.isArray(schema)) {
    return schema.map((item) => cleanSchemaForGoogle(item));
  }

  const cleaned: any = {};
  for (const [key, value] of Object.entries(schema)) {
    // Skip fields that Google doesn't support
    if (key === "$schema" || key === "additionalProperties") {
      continue;
    }

    // Handle format field for string types - Google only supports 'enum' and 'date-time'
    if (key === "format" && typeof value === "string") {
      // Only keep supported formats
      if (value === "enum" || value === "date-time") {
        cleaned[key] = value;
      }
      // Skip unsupported formats like "date", "time", "email", etc.
      continue;
    }

    // Recursively clean nested objects
    cleaned[key] = cleanSchemaForGoogle(value);
  }

  return cleaned;
}

/**
 * Stream with OpenAI SDK
 */
export async function streamWithOpenAI(
  specification: Specification,
  messages: OpenAIMessage[],
  tools: ToolDefinitionInput[] | undefined,
  openaiClient: any, // OpenAI client instance
  onEvent: (event: StreamEvent) => void,
  onComplete: (message: string, toolCalls: ConversationToolCall[]) => void,
  abortSignal?: AbortSignal,
): Promise<void> {
  let fullMessage = "";
  let toolCalls: ConversationToolCall[] = [];

  // Performance metrics
  const startTime = Date.now();
  let firstTokenTime = 0;
  let firstMeaningfulContentTime = 0;
  let tokenCount = 0;
  let toolArgumentTokens = 0;
  let lastEventTime = 0;
  const interTokenDelays: number[] = [];

  // Tool calling metrics
  const toolMetrics = {
    totalTools: 0,
    successfulTools: 0,
    failedTools: 0,
    toolTimes: [] as {
      name: string;
      startTime: number;
      argumentBuildTime: number;
      totalTime: number;
    }[],
    currentToolStart: 0,
    roundStartTime: startTime,
    rounds: [] as {
      roundNumber: number;
      llmTime: number;
      toolTime: number;
      toolCount: number;
    }[],
    currentRound: 1,
  };

  try {
    const modelName = getModelName(specification);
    if (!modelName) {
      throw new Error(
        `No model name found for specification: ${specification.name} (service: ${specification.serviceType})`,
      );
    }

    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `🤖 [OpenAI] Model Config: Service=OpenAI | Model=${modelName} | Temperature=${specification.openAI?.temperature} | MaxTokens=${specification.openAI?.completionTokenLimit || "null"} | Tools=${tools?.length || 0} | Spec="${specification.name}"`,
      );
    }

    const streamConfig: any = {
      model: modelName,
      messages,
      stream: true,
      temperature: specification.openAI?.temperature,
      //top_p: specification.openAI?.probability,
    };

    // Only add max_completion_tokens if it's defined
    if (specification.openAI?.completionTokenLimit) {
      streamConfig.max_completion_tokens =
        specification.openAI.completionTokenLimit;
    }

    // Add tools if provided
    if (tools && tools.length > 0) {
      streamConfig.tools = tools.map((tool) => ({
        type: "function",
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.schema ? JSON.parse(tool.schema) : {},
        },
      }));
    }

    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `⏱️ [OpenAI] Starting LLM call at: ${new Date().toISOString()}`,
      );
    }

    const stream = await openaiClient.chat.completions.create(streamConfig, {
      signal: abortSignal,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta;

      // Debug log chunk details
      if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
        console.log(`[OpenAI] Chunk:`, JSON.stringify(chunk, null, 2));
        if (delta?.content) {
          console.log(
            `[OpenAI] Content delta: "${delta.content}" (${delta.content.length} chars)`,
          );
        }
        if (delta?.tool_calls) {
          console.log(`[OpenAI] Tool calls:`, delta.tool_calls);
        }
        if (chunk.choices[0]?.finish_reason) {
          console.log(
            `[OpenAI] Finish reason: ${chunk.choices[0].finish_reason}`,
          );
        }
      }

      if (delta?.content) {
        fullMessage += delta.content;
        tokenCount++;

        const currentTime = Date.now();

        // Track TTFT (first token regardless of type)
        if (firstTokenTime === 0) {
          firstTokenTime = currentTime - startTime;
          if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
            console.log(
              `\n⚡ [OpenAI] Time to First Token (TTFT): ${firstTokenTime}ms`,
            );
          }
        }

        // Track first meaningful content (excludes tool calls)
        if (firstMeaningfulContentTime === 0 && delta.content.trim()) {
          firstMeaningfulContentTime = currentTime - startTime;
          if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
            console.log(
              `\n🎯 [OpenAI] Time to First Meaningful Content: ${firstMeaningfulContentTime}ms`,
            );
          }
        }

        // Track inter-token delays
        if (lastEventTime > 0) {
          const delay = currentTime - lastEventTime;
          interTokenDelays.push(delay);
        }
        lastEventTime = currentTime;

        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
          console.log(
            `[OpenAI] Token #${tokenCount}: "${delta.content}" | Accumulated: ${fullMessage.length} chars`,
          );
        }
        onEvent({
          type: "token",
          token: delta.content,
        });
      }

      // Handle tool calls
      if (delta?.tool_calls) {
        for (const toolCallDelta of delta.tool_calls) {
          const index = toolCallDelta.index;

          if (!toolCalls[index]) {
            toolCalls[index] = {
              id: toolCallDelta.id || `tool_${Date.now()}_${index}`,
              name: "",
              arguments: "",
            };

            // Track tool metrics
            toolMetrics.totalTools++;
            toolMetrics.currentToolStart = Date.now();
            toolMetrics.toolTimes.push({
              name: toolCallDelta.function?.name || "unknown",
              startTime: toolMetrics.currentToolStart,
              argumentBuildTime: 0,
              totalTime: 0,
            });

            // Track TTFT for first tool if no content yet
            if (firstTokenTime === 0) {
              firstTokenTime = Date.now() - startTime;
              if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
                console.log(
                  `\n⚡ [OpenAI] Time to First Token (Tool Call): ${firstTokenTime}ms`,
                );
              }
            }

            if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
              console.log(
                `[OpenAI] Starting new tool call: ${toolCalls[index].id}`,
              );
            }

            onEvent({
              type: "tool_call_start",
              toolCall: {
                id: toolCalls[index].id,
                name: toolCallDelta.function?.name || "",
              },
            });
          }

          if (toolCallDelta.function?.name) {
            toolCalls[index].name = toolCallDelta.function.name;
            if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
              console.log(`[OpenAI] Tool name: ${toolCallDelta.function.name}`);
            }
          }

          if (toolCallDelta.function?.arguments) {
            toolCalls[index].arguments += toolCallDelta.function.arguments;

            // Count tool argument tokens (rough estimate: ~4 chars per token)
            toolArgumentTokens += Math.ceil(
              toolCallDelta.function.arguments.length / 4,
            );

            // Debug logging for partial JSON accumulation
            if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
              console.log(
                `[OpenAI] Tool ${toolCalls[index].name} - Partial JSON chunk: "${toolCallDelta.function.arguments}"`,
              );
              console.log(
                `[OpenAI] Tool ${toolCalls[index].name} - Total accumulated: ${toolCalls[index].arguments.length} chars`,
              );
            }

            onEvent({
              type: "tool_call_delta",
              toolCallId: toolCalls[index].id,
              argumentDelta: toolCallDelta.function.arguments,
            });
          }
        }
      }
    }

    // Emit complete events for tool calls and finalize metrics
    for (let i = 0; i < toolCalls.length; i++) {
      const toolCall = toolCalls[i];
      const currentTime = Date.now();

      // Update tool metrics
      if (i < toolMetrics.toolTimes.length) {
        const toolTime = toolMetrics.toolTimes[i];
        toolTime.argumentBuildTime = currentTime - toolTime.startTime;
        toolTime.totalTime = toolTime.argumentBuildTime; // For streaming, this is the same
        toolTime.name = toolCall.name; // Update with final name
      }

      // Track tool success/failure
      try {
        JSON.parse(toolCall.arguments);
        toolMetrics.successfulTools++;

        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
          console.log(`[OpenAI] ✅ Valid JSON for ${toolCall.name}`);
        }
      } catch (e) {
        toolMetrics.failedTools++;
        console.error(`[OpenAI] ❌ Invalid JSON for ${toolCall.name}: ${e}`);
      }

      // Log the final JSON for debugging
      if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
        console.log(
          `[OpenAI] Tool ${toolCall.name} complete with arguments (${toolCall.arguments.length} chars):`,
        );
        console.log(toolCall.arguments);
      }

      onEvent({
        type: "tool_call_parsed",
        toolCall: {
          id: toolCall.id,
          name: toolCall.name,
          arguments: toolCall.arguments,
        },
      });
    }

    // Final summary logging
    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING && toolCalls.length > 0) {
      console.log(
        `[OpenAI] Successfully processed ${toolCalls.length} tool calls`,
      );
    }

    // Calculate final metrics including tool calling insights
    const totalTime = Date.now() - startTime;
    const totalTokens = tokenCount + toolArgumentTokens;
    const tokensPerSecond =
      totalTokens > 0 ? totalTokens / (totalTime / 1000) : 0;

    // Finalize round metrics
    if (toolCalls.length > 0) {
      const roundEndTime = Date.now();
      const totalToolTime = toolMetrics.toolTimes.reduce(
        (sum, tool) => sum + tool.totalTime,
        0,
      );
      const llmTime = totalTime - totalToolTime;

      toolMetrics.rounds.push({
        roundNumber: toolMetrics.currentRound,
        llmTime: llmTime,
        toolTime: totalToolTime,
        toolCount: toolCalls.length,
      });
    }

    if (process.env.DEBUG_GRAPHLIT_SDK_METRICS) {
      const metricsData = {
        totalTime: `${totalTime}ms`,
        ttft: `${firstTokenTime}ms`,
        ttfmc:
          firstMeaningfulContentTime > 0
            ? `${firstMeaningfulContentTime}ms`
            : null,
        contentTokens: tokenCount,
        toolTokens: toolArgumentTokens,
        totalTokens: totalTokens,
        tps: tokensPerSecond.toFixed(2),
      };
      console.log(
        `📊 [OpenAI] Performance: Total=${metricsData.totalTime} | TTFT=${metricsData.ttft}${metricsData.ttfmc ? ` | TTFMC=${metricsData.ttfmc}` : ""} | Tokens(content/tool/total)=${metricsData.contentTokens}/${metricsData.toolTokens}/${metricsData.totalTokens} | TPS=${metricsData.tps}`,
      );

      // Tool calling metrics
      if (toolCalls.length > 0) {
        const successRate = (
          (toolMetrics.successfulTools / toolMetrics.totalTools) *
          100
        ).toFixed(1);
        const avgToolTime =
          toolMetrics.toolTimes.reduce((sum, tool) => sum + tool.totalTime, 0) /
          toolMetrics.toolTimes.length;

        console.log(
          `🔧 [OpenAI] Tools: Total=${toolMetrics.totalTools} | Success=${toolMetrics.successfulTools} | Failed=${toolMetrics.failedTools} | SuccessRate=${successRate}% | AvgTime=${avgToolTime.toFixed(2)}ms`,
        );

        // Tool timing details (consolidated)
        const toolTimings = toolMetrics.toolTimes
          .map((tool, idx) => `${tool.name}:${tool.argumentBuildTime}ms`)
          .join(" | ");
        if (toolTimings) {
          console.log(`🔨 [OpenAI] Tool Timings: ${toolTimings}`);
        }

        // Round metrics (consolidated)
        const roundMetrics = toolMetrics.rounds
          .map((round) => {
            const efficiency =
              round.toolCount > 0
                ? (
                    (round.llmTime / (round.llmTime + round.toolTime)) *
                    100
                  ).toFixed(1)
                : 100;
            return `R${round.roundNumber}(LLM:${round.llmTime}ms,Tools:${round.toolTime}ms,Eff:${efficiency}%)`;
          })
          .join(" | ");
        if (roundMetrics) {
          console.log(`🔄 [OpenAI] Rounds: ${roundMetrics}`);
        }
      }

      if (interTokenDelays.length > 0) {
        const avgDelay =
          interTokenDelays.reduce((a, b) => a + b, 0) / interTokenDelays.length;
        const sortedDelays = [...interTokenDelays].sort((a, b) => a - b);
        const p50Delay = sortedDelays[Math.floor(sortedDelays.length * 0.5)];
        const p95Delay = sortedDelays[Math.floor(sortedDelays.length * 0.95)];
        const p99Delay = sortedDelays[Math.floor(sortedDelays.length * 0.99)];

        console.log(
          `⏳ [OpenAI] Inter-Token: Avg=${avgDelay.toFixed(2)}ms | P50=${p50Delay}ms | P95=${p95Delay}ms | P99=${p99Delay}ms`,
        );
      }

      console.log(
        `✅ [OpenAI] Final message (${fullMessage.length} chars): "${fullMessage}"`,
      );
    }
    onComplete(fullMessage, toolCalls);
  } catch (error: any) {
    // Handle OpenAI-specific errors
    const errorMessage = error.message || error.toString();

    // Check for rate limit errors
    if (
      error.status === 429 ||
      error.statusCode === 429 ||
      error.code === "rate_limit_exceeded"
    ) {
      if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
        console.log(`⚠️ [OpenAI] Rate limit hit`);
      }
      const rateLimitError: any = new Error("OpenAI rate limit exceeded");
      rateLimitError.statusCode = 429;
      throw rateLimitError;
    }

    // Check for network errors
    if (
      errorMessage.includes("fetch failed") ||
      error.code === "ECONNRESET" ||
      error.code === "ETIMEDOUT"
    ) {
      if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
        console.log(`⚠️ [OpenAI] Network error: ${errorMessage}`);
      }
      const networkError: any = new Error(
        `OpenAI network error: ${errorMessage}`,
      );
      networkError.statusCode = 503; // Service unavailable
      throw networkError;
    }

    // Don't emit error event here - let the client handle it to avoid duplicates
    throw error;
  }
}

/**
 * Stream with Anthropic SDK
 */
// Import Anthropic types for better type safety
type AnthropicClient = import("@anthropic-ai/sdk").default;

export async function streamWithAnthropic(
  specification: Specification,
  messages: AnthropicMessage[],
  systemPrompt: string | undefined,
  tools: ToolDefinitionInput[] | undefined,
  anthropicClient: AnthropicClient, // Properly typed Anthropic client
  onEvent: (event: StreamEvent) => void,
  onComplete: (message: string, toolCalls: ConversationToolCall[]) => void,
  abortSignal?: AbortSignal,
  thinkingConfig?: { type: "enabled"; budget_tokens: number },
): Promise<void> {
  let fullMessage = "";
  let toolCalls: ConversationToolCall[] = [];

  // Performance metrics
  const startTime = Date.now();
  let firstTokenTime = 0;
  let firstMeaningfulContentTime = 0;
  let tokenCount = 0;
  let toolArgumentTokens = 0;
  let lastEventTime = 0;
  const interTokenDelays: number[] = [];

  // Tool calling metrics
  const toolMetrics = {
    totalTools: 0,
    successfulTools: 0,
    failedTools: 0,
    toolTimes: [] as {
      name: string;
      startTime: number;
      argumentBuildTime: number;
      totalTime: number;
    }[],
    currentToolStart: 0,
    roundStartTime: startTime,
    rounds: [] as {
      roundNumber: number;
      llmTime: number;
      toolTime: number;
      toolCount: number;
    }[],
    currentRound: 1,
  };

  try {
    const modelName = getModelName(specification);
    if (!modelName) {
      throw new Error(
        `No model name found for Anthropic specification: ${specification.name}`,
      );
    }

    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `🤖 [Anthropic] Model Config: Service=Anthropic | Model=${modelName} | Temperature=${specification.anthropic?.temperature} | MaxTokens=${specification.anthropic?.completionTokenLimit || 8192} | SystemPrompt=${systemPrompt ? "Yes" : "No"} | Tools=${tools?.length || 0} | Spec="${specification.name}"`,
      );
    }

    // Use proper Anthropic SDK types for the config
    const streamConfig: any = {
      model: modelName as string,
      messages,
      stream: true,
      max_tokens: specification.anthropic?.completionTokenLimit || 8192, // required
    };

    // Handle temperature based on thinking configuration
    if (thinkingConfig) {
      // When thinking is enabled, temperature must be 1
      streamConfig.temperature = 1;

      if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
        console.log(
          `🧠 [Anthropic] Setting temperature to 1 (required for extended thinking)`,
        );
      }
    } else {
      // Only add temperature if it's defined and valid for non-thinking requests
      if (
        specification.anthropic?.temperature !== undefined &&
        specification.anthropic?.temperature !== null &&
        typeof specification.anthropic?.temperature === "number"
      ) {
        streamConfig.temperature = specification.anthropic.temperature;
      }
    }

    if (systemPrompt) {
      streamConfig.system = systemPrompt;
    }

    // Add tools if provided
    if (tools && tools.length > 0) {
      streamConfig.tools = tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        input_schema: tool.schema ? JSON.parse(tool.schema) : {},
      }));
    }

    // Add thinking config if provided
    if (thinkingConfig) {
      streamConfig.thinking = thinkingConfig;

      if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
        console.log(
          `🧠 [Anthropic] Extended thinking enabled | Budget: ${thinkingConfig.budget_tokens} tokens`,
        );
      }

      // Adjust max_tokens to account for thinking budget
      const totalTokens =
        streamConfig.max_tokens + thinkingConfig.budget_tokens;
      if (totalTokens > 200000) {
        // Claude's context window limit
        console.warn(
          `⚠️ [Anthropic] Total tokens (${totalTokens}) exceeds context window, adjusting completion tokens...`,
        );
        streamConfig.max_tokens = Math.max(
          1000,
          200000 - thinkingConfig.budget_tokens,
        );
      }
    }

    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `⏱️ [Anthropic] Starting LLM call at: ${new Date().toISOString()}`,
      );
    }

    const stream = await anthropicClient.messages.create(
      streamConfig,
      abortSignal ? { signal: abortSignal } : undefined,
    );

    let activeContentBlock = false;
    let currentContentBlockIndex: number | undefined;
    let currentContentBlockType: "text" | "thinking" | "tool_use" | undefined;
    let thinkingContent = "";
    let thinkingSignature = "";
    let completeThinkingContent = ""; // Accumulate all thinking content for conversation history
    let completeThinkingSignature = ""; // Accumulate signature for conversation history

    for await (const chunk of stream as any) {
      // Debug log all chunk types
      if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
        console.log(`[Anthropic] Received chunk type: ${chunk.type}`);
      }

      if (chunk.type === "content_block_start") {
        activeContentBlock = true;
        currentContentBlockIndex = chunk.index;
        currentContentBlockType = chunk.content_block.type;

        if (chunk.content_block.type === "thinking") {
          // Start of thinking block (native extended thinking)
          thinkingContent = "";
          thinkingSignature = "";

          onEvent({
            type: "reasoning_start",
            format: "thinking_tag",
          });

          if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
            console.log("[Anthropic] Extended thinking block started");
          }
        } else if (chunk.content_block.type === "tool_use") {
          const toolCall = {
            id: chunk.content_block.id,
            name: chunk.content_block.name,
            arguments: "",
          };
          toolCalls.push(toolCall);

          // Track tool metrics
          toolMetrics.totalTools++;
          toolMetrics.currentToolStart = Date.now();
          toolMetrics.toolTimes.push({
            name: toolCall.name,
            startTime: toolMetrics.currentToolStart,
            argumentBuildTime: 0,
            totalTime: 0,
          });

          // Track TTFT for first tool if no content yet
          if (firstTokenTime === 0) {
            firstTokenTime = Date.now() - startTime;
            if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
              console.log(
                `\n⚡ [Anthropic] Time to First Token (Tool Call): ${firstTokenTime}ms`,
              );
            }
          }

          onEvent({
            type: "tool_call_start",
            toolCall: {
              id: toolCall.id,
              name: toolCall.name,
            },
          });
        }
      } else if (chunk.type === "content_block_delta") {
        // Handle thinking blocks with native extended thinking
        if (
          chunk.delta.type === "thinking_delta" &&
          "thinking" in chunk.delta
        ) {
          // Accumulate thinking content
          thinkingContent += chunk.delta.thinking;

          // Track first token time
          if (firstTokenTime === 0) {
            firstTokenTime = Date.now() - startTime;
          }

          onEvent({
            type: "reasoning_delta",
            content: chunk.delta.thinking,
            format: "thinking_tag",
          });

          if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
            console.log(
              `[Anthropic] Thinking delta: "${chunk.delta.thinking}"`,
            );
          }
        } else if (
          chunk.delta.type === "signature_delta" &&
          "signature" in chunk.delta
        ) {
          // Handle signature for thinking blocks
          thinkingSignature += chunk.delta.signature;

          if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
            console.log(
              `[Anthropic] Signature delta: "${chunk.delta.signature}"`,
            );
          }
        } else if (chunk.delta.type === "text_delta" && "text" in chunk.delta) {
          fullMessage += chunk.delta.text;
          tokenCount++;

          const currentTime = Date.now();

          // Track TTFT (first token regardless of type)
          if (firstTokenTime === 0) {
            firstTokenTime = currentTime - startTime;
            if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
              console.log(
                `\n⚡ [Anthropic] Time to First Token (TTFT): ${firstTokenTime}ms`,
              );
            }
          }

          // Track first meaningful content (excludes tool calls)
          if (firstMeaningfulContentTime === 0 && chunk.delta.text.trim()) {
            firstMeaningfulContentTime = currentTime - startTime;
            if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
              console.log(
                `\n🎯 [Anthropic] Time to First Meaningful Content: ${firstMeaningfulContentTime}ms`,
              );
            }
          }

          // Track inter-token delays
          if (lastEventTime > 0) {
            const delay = currentTime - lastEventTime;
            interTokenDelays.push(delay);
          }
          lastEventTime = currentTime;

          if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
            console.log(
              `[Anthropic] Token #${tokenCount}: "${chunk.delta.text}" | Accumulated: ${fullMessage.length} chars`,
            );
          }
          onEvent({
            type: "token",
            token: chunk.delta.text,
          });
        } else if (chunk.delta.type === "input_json_delta") {
          // Find the current tool call and append arguments
          const currentTool = toolCalls[toolCalls.length - 1];
          if (currentTool) {
            currentTool.arguments += chunk.delta.partial_json;

            // Count tool argument tokens (rough estimate: ~4 chars per token)
            toolArgumentTokens += Math.ceil(
              chunk.delta.partial_json.length / 4,
            );

            // Debug logging for partial JSON accumulation
            if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
              console.log(
                `[Anthropic] Tool ${currentTool.name} - Partial JSON chunk: "${chunk.delta.partial_json}"`,
              );
              console.log(
                `[Anthropic] Tool ${currentTool.name} - Total accumulated: ${currentTool.arguments.length} chars`,
              );
            }

            onEvent({
              type: "tool_call_delta",
              toolCallId: currentTool.id,
              argumentDelta: chunk.delta.partial_json,
            });
          }
        }
      } else if (chunk.type === "content_block_stop") {
        activeContentBlock = false;

        // Check if we're stopping a thinking block
        if (
          currentContentBlockType === "thinking" &&
          chunk.index === currentContentBlockIndex
        ) {
          // Emit the complete thinking block with signature
          onEvent({
            type: "reasoning_end",
            fullContent: thinkingContent,
            signature: thinkingSignature || undefined,
          });

          // Accumulate thinking content and signature for conversation history preservation
          if (thinkingContent.trim()) {
            completeThinkingContent += thinkingContent;
          }
          if (thinkingSignature.trim()) {
            completeThinkingSignature = thinkingSignature; // Use the last signature
          }

          if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
            console.log(`[Anthropic] Thinking block completed:`, {
              contentLength: thinkingContent.length,
              hasSignature: !!thinkingSignature,
              signature: thinkingSignature,
              totalThinkingLength: completeThinkingContent.length,
            });
          }

          // Reset current thinking state (but keep completeThinkingContent)
          thinkingContent = "";
          thinkingSignature = "";
        }

        currentContentBlockType = undefined;
        currentContentBlockIndex = undefined;

        // Tool call complete
        const currentTool = toolCalls[toolCalls.length - 1];
        if (currentTool && chunk.content_block?.type === "tool_use") {
          const currentTime = Date.now();

          // Update tool metrics
          const toolIndex = toolCalls.length - 1;
          if (toolIndex < toolMetrics.toolTimes.length) {
            const toolTime = toolMetrics.toolTimes[toolIndex];
            toolTime.argumentBuildTime = currentTime - toolTime.startTime;
            toolTime.totalTime = toolTime.argumentBuildTime;
            toolTime.name = currentTool.name;
          }

          // Track tool success/failure
          try {
            JSON.parse(currentTool.arguments);
            toolMetrics.successfulTools++;

            if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
              console.log(`[Anthropic] ✅ Valid JSON for ${currentTool.name}`);
            }
          } catch (e) {
            toolMetrics.failedTools++;
            console.error(
              `[Anthropic] ❌ Invalid JSON for ${currentTool.name}: ${e}`,
            );
          }

          // Log the final JSON for debugging
          if (
            process.env.DEBUG_GRAPHLIT_SDK_STREAMING ||
            !isValidJSON(currentTool.arguments)
          ) {
            console.log(
              `[Anthropic] Tool ${currentTool.name} complete with arguments (${currentTool.arguments.length} chars):`,
            );
            console.log(currentTool.arguments);

            // Check if JSON appears truncated
            const lastChars = currentTool.arguments.slice(-10);
            if (
              !lastChars.includes("}") &&
              currentTool.arguments.length > 100
            ) {
              console.warn(
                `[Anthropic] WARNING: JSON may be truncated - doesn't end with '}': ...${lastChars}`,
              );
            }
          }

          onEvent({
            type: "tool_call_parsed",
            toolCall: {
              id: currentTool.id,
              name: currentTool.name,
              arguments: currentTool.arguments,
            },
          });
        }
      } else if (chunk.type === "message_stop" && activeContentBlock) {
        // Handle Anthropic bug: message_stop without content_block_stop
        console.warn(
          `[Anthropic] Received message_stop without content_block_stop - handling as implicit block stop`,
        );
        activeContentBlock = false;

        // Emit synthetic content_block_stop for the current tool
        const currentTool = toolCalls[toolCalls.length - 1];
        if (currentTool) {
          // Log the incomplete tool
          console.warn(
            `[Anthropic] Synthetic content_block_stop for incomplete tool ${currentTool.name} (${currentTool.arguments.length} chars)`,
          );

          // Only emit tool_call_complete if we have valid JSON
          if (isValidJSON(currentTool.arguments)) {
            onEvent({
              type: "tool_call_parsed",
              toolCall: {
                id: currentTool.id,
                name: currentTool.name,
                arguments: currentTool.arguments,
              },
            });
          } else {
            console.error(
              `[Anthropic] Tool ${currentTool.name} has incomplete JSON, skipping tool_call_complete event`,
            );
          }
        }
      }
    }

    // Final check: filter out any remaining incomplete tool calls
    const validToolCalls = toolCalls.filter((tc, idx) => {
      if (!isValidJSON(tc.arguments)) {
        console.warn(
          `[Anthropic] Filtering out incomplete tool call ${idx} (${tc.name}) with INVALID JSON (${tc.arguments.length} chars)`,
        );
        return false;
      }
      return true;
    });

    if (toolCalls.length !== validToolCalls.length) {
      console.log(
        `[Anthropic] Filtered out ${toolCalls.length - validToolCalls.length} incomplete tool calls`,
      );
      console.log(
        `[Anthropic] Successfully processed ${validToolCalls.length} valid tool calls`,
      );
    }

    // Calculate final metrics including tool calling insights
    const totalTime = Date.now() - startTime;
    const totalTokens = tokenCount + toolArgumentTokens;
    const tokensPerSecond =
      totalTokens > 0 ? totalTokens / (totalTime / 1000) : 0;

    // Finalize round metrics
    if (validToolCalls.length > 0) {
      const roundEndTime = Date.now();
      const totalToolTime = toolMetrics.toolTimes.reduce(
        (sum, tool) => sum + tool.totalTime,
        0,
      );
      const llmTime = totalTime - totalToolTime;

      toolMetrics.rounds.push({
        roundNumber: toolMetrics.currentRound,
        llmTime: llmTime,
        toolTime: totalToolTime,
        toolCount: validToolCalls.length,
      });
    }

    if (process.env.DEBUG_GRAPHLIT_SDK_METRICS) {
      const metricsData = {
        totalTime: `${totalTime}ms`,
        ttft: `${firstTokenTime}ms`,
        ttfmc:
          firstMeaningfulContentTime > 0
            ? `${firstMeaningfulContentTime}ms`
            : null,
        contentTokens: tokenCount,
        toolTokens: toolArgumentTokens,
        totalTokens: totalTokens,
        tps: tokensPerSecond.toFixed(2),
      };
      console.log(
        `📊 [Anthropic] Performance: Total=${metricsData.totalTime} | TTFT=${metricsData.ttft}${metricsData.ttfmc ? ` | TTFMC=${metricsData.ttfmc}` : ""} | Tokens(content/tool/total)=${metricsData.contentTokens}/${metricsData.toolTokens}/${metricsData.totalTokens} | TPS=${metricsData.tps}`,
      );

      // Tool calling metrics
      if (validToolCalls.length > 0) {
        const successRate = (
          (toolMetrics.successfulTools / toolMetrics.totalTools) *
          100
        ).toFixed(1);
        const avgToolTime =
          toolMetrics.toolTimes.reduce((sum, tool) => sum + tool.totalTime, 0) /
          toolMetrics.toolTimes.length;

        console.log(
          `🔧 [Anthropic] Tools: Total=${toolMetrics.totalTools} | Success=${toolMetrics.successfulTools} | Failed=${toolMetrics.failedTools} | SuccessRate=${successRate}% | AvgTime=${avgToolTime.toFixed(2)}ms`,
        );

        // Tool timing details (consolidated)
        const toolTimings = toolMetrics.toolTimes
          .map((tool, idx) => `${tool.name}:${tool.argumentBuildTime}ms`)
          .join(" | ");
        if (toolTimings) {
          console.log(`🔨 [Anthropic] Tool Timings: ${toolTimings}`);
        }

        // Round metrics (consolidated)
        const roundMetrics = toolMetrics.rounds
          .map((round) => {
            const efficiency =
              round.toolCount > 0
                ? (
                    (round.llmTime / (round.llmTime + round.toolTime)) *
                    100
                  ).toFixed(1)
                : 100;
            return `R${round.roundNumber}(LLM:${round.llmTime}ms,Tools:${round.toolTime}ms,Eff:${efficiency}%)`;
          })
          .join(" | ");
        if (roundMetrics) {
          console.log(`🔄 [Anthropic] Rounds: ${roundMetrics}`);
        }
      }

      if (interTokenDelays.length > 0) {
        const avgDelay =
          interTokenDelays.reduce((a, b) => a + b, 0) / interTokenDelays.length;
        const sortedDelays = [...interTokenDelays].sort((a, b) => a - b);
        const p50Delay = sortedDelays[Math.floor(sortedDelays.length * 0.5)];
        const p95Delay = sortedDelays[Math.floor(sortedDelays.length * 0.95)];
        const p99Delay = sortedDelays[Math.floor(sortedDelays.length * 0.99)];

        console.log(
          `⏳ [Anthropic] Inter-Token: Avg=${avgDelay.toFixed(2)}ms | P50=${p50Delay}ms | P95=${p95Delay}ms | P99=${p99Delay}ms`,
        );
      }

      console.log(
        `✅ [Anthropic] Final message (${fullMessage.length} chars): "${fullMessage}"`,
      );
    }

    // Include thinking content in the final message for conversation history preservation
    let finalMessage = fullMessage;
    if (completeThinkingContent.trim()) {
      // Wrap thinking content with signature in special tags that formatMessagesForAnthropic can parse
      const thinkingBlock = completeThinkingSignature.trim()
        ? `<thinking signature="${completeThinkingSignature}">${completeThinkingContent}</thinking>`
        : `<thinking>${completeThinkingContent}</thinking>`;
      finalMessage = `${thinkingBlock}${fullMessage}`;

      if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
        console.log(
          `🧠 [Anthropic] Including thinking content (${completeThinkingContent.length} chars) and signature (${completeThinkingSignature.length} chars) in conversation history`,
        );
      }
    }

    onComplete(finalMessage, validToolCalls);
  } catch (error: any) {
    // Handle Anthropic-specific errors
    const errorMessage = error.message || error.toString();

    // Check for overloaded errors
    if (
      error.type === "overloaded_error" ||
      errorMessage.includes("Overloaded")
    ) {
      if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
        console.log(`⚠️ [Anthropic] Service overloaded`);
      }
      // Treat overloaded as a rate limit error for retry logic
      const overloadError: any = new Error("Anthropic service overloaded");
      overloadError.statusCode = 503; // Service unavailable
      throw overloadError;
    }

    // Check for rate limit errors
    if (
      error.status === 429 ||
      error.statusCode === 429 ||
      error.type === "rate_limit_error"
    ) {
      if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
        console.log(`⚠️ [Anthropic] Rate limit hit`);
      }
      const rateLimitError: any = new Error("Anthropic rate limit exceeded");
      rateLimitError.statusCode = 429;
      throw rateLimitError;
    }

    // Don't emit error event here - let the client handle it to avoid duplicates
    throw error;
  }
}

/**
 * Stream with Google SDK
 */
export async function streamWithGoogle(
  specification: Specification,
  messages: GoogleMessage[],
  systemPrompt: string | undefined,
  tools: ToolDefinitionInput[] | undefined,
  googleClient: any, // Google GenerativeAI client instance
  onEvent: (event: StreamEvent) => void,
  onComplete: (message: string, toolCalls: ConversationToolCall[]) => void,
  abortSignal?: AbortSignal,
): Promise<void> {
  let fullMessage = "";
  let toolCalls: ConversationToolCall[] = [];

  // Performance metrics
  const startTime = Date.now();
  let firstTokenTime = 0;
  let firstMeaningfulContentTime = 0;
  let tokenCount = 0;
  let toolArgumentTokens = 0;
  let lastEventTime = 0;
  const interTokenDelays: number[] = [];

  // Tool calling metrics
  const toolMetrics = {
    totalTools: 0,
    successfulTools: 0,
    failedTools: 0,
    toolTimes: [] as {
      name: string;
      startTime: number;
      argumentBuildTime: number;
      totalTime: number;
    }[],
    currentToolStart: 0,
    roundStartTime: startTime,
    rounds: [] as {
      roundNumber: number;
      llmTime: number;
      toolTime: number;
      toolCount: number;
    }[],
    currentRound: 1,
  };

  try {
    const modelName = getModelName(specification);
    if (!modelName) {
      throw new Error(
        `No model name found for Google specification: ${specification.name}`,
      );
    }

    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `🤖 [Google] Model Config: Service=Google | Model=${modelName} | Temperature=${specification.google?.temperature} | MaxTokens=${specification.google?.completionTokenLimit || "null"} | SystemPrompt=${systemPrompt ? "Yes" : "No"} | Tools=${tools?.length || 0} | Spec="${specification.name}"`,
      );
    }

    const streamConfig: any = {
      model: modelName,
      messages,
      stream: true,
      temperature: specification.google?.temperature,
      //top_p: specification.google?.probability,
    };

    // Only add max_tokens if it's defined
    if (specification.google?.completionTokenLimit) {
      streamConfig.max_tokens = specification.google.completionTokenLimit;
    }

    if (systemPrompt) {
      streamConfig.system = systemPrompt;
    }

    // Add tools if provided
    if (tools && tools.length > 0) {
      streamConfig.tools = tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        input_schema: tool.schema ? JSON.parse(tool.schema) : {},
      }));
    }

    // Configure tools for Google - expects a single array of function declarations
    const googleTools =
      tools && tools.length > 0
        ? [
            {
              functionDeclarations: tools.map((tool) => {
                const rawSchema = tool.schema ? JSON.parse(tool.schema) : {};
                const cleanedSchema = cleanSchemaForGoogle(rawSchema);

                if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
                  const hadCleanup =
                    JSON.stringify(rawSchema) !== JSON.stringify(cleanedSchema);
                  if (hadCleanup) {
                    console.log(
                      `[Google] Cleaned schema for tool ${tool.name} - removed unsupported fields`,
                    );
                  }
                }

                return {
                  name: tool.name,
                  description: tool.description,
                  parameters: cleanedSchema,
                };
              }),
            },
          ]
        : undefined;

    const model = googleClient.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: streamConfig.temperature,
        maxOutputTokens: streamConfig.max_tokens,
      },
      tools: googleTools,
    });

    // Convert messages to Google chat format
    const history = messages.slice(0, -1); // All but last message
    const prompt = messages[messages.length - 1]?.parts[0]?.text || "";

    const chat = model.startChat({ history });
    const result = await chat.sendMessageStream(prompt);

    for await (const chunk of result.stream) {
      const text = chunk.text();

      // Debug log chunk details
      if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
        console.log(`[Google] Raw chunk:`, JSON.stringify(chunk, null, 2));
        if (text) {
          console.log(`[Google] Text delta: "${text}" (${text.length} chars)`);
        }
      }

      if (text) {
        fullMessage += text;
        tokenCount++;

        const currentTime = Date.now();

        // Track TTFT (first token regardless of type)
        if (firstTokenTime === 0) {
          firstTokenTime = currentTime - startTime;
          if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
            console.log(
              `\n⚡ [Google] Time to First Token (TTFT): ${firstTokenTime}ms`,
            );
          }
        }

        // Track first meaningful content
        if (firstMeaningfulContentTime === 0 && text.trim()) {
          firstMeaningfulContentTime = currentTime - startTime;
          if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
            console.log(
              `\n🎯 [Google] Time to First Meaningful Content: ${firstMeaningfulContentTime}ms`,
            );
          }
        }

        onEvent({
          type: "token",
          token: text,
        });
      }

      // Google streams function calls as part of the candidates
      // Check if this chunk contains function calls
      try {
        const candidate = chunk.candidates?.[0];
        if (candidate?.content?.parts) {
          for (const part of candidate.content.parts) {
            if (part.functionCall) {
              if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
                console.log(
                  `[Google] Received function call: ${part.functionCall.name}`,
                );
                console.log(
                  `[Google] Function args:`,
                  JSON.stringify(part.functionCall.args || {}),
                );
              }

              const toolCall: ConversationToolCall = {
                id: `google_tool_${Date.now()}_${toolCalls.length}`,
                name: part.functionCall.name,
                arguments: JSON.stringify(part.functionCall.args || {}),
              };
              toolCalls.push(toolCall);

              // Track tool metrics
              toolMetrics.totalTools++;
              const argumentString = JSON.stringify(
                part.functionCall.args || {},
              );
              toolArgumentTokens += Math.ceil(argumentString.length / 4);

              toolMetrics.toolTimes.push({
                name: part.functionCall.name,
                startTime: Date.now(),
                argumentBuildTime: 0, // Google returns complete args at once
                totalTime: 0,
              });

              // Track TTFT for first tool if no content yet
              if (firstTokenTime === 0) {
                firstTokenTime = Date.now() - startTime;
                if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
                  console.log(
                    `\n⚡ [Google] Time to First Token (Tool Call): ${firstTokenTime}ms`,
                  );
                }
              }

              // Emit tool call events
              onEvent({
                type: "tool_call_start",
                toolCall: {
                  id: toolCall.id,
                  name: toolCall.name,
                },
              });

              onEvent({
                type: "tool_call_delta",
                toolCallId: toolCall.id,
                argumentDelta: toolCall.arguments,
              });

              // Update tool metrics and validate JSON
              const toolIndex = toolCalls.length - 1;
              if (toolIndex < toolMetrics.toolTimes.length) {
                const toolTime = toolMetrics.toolTimes[toolIndex];
                toolTime.totalTime = Date.now() - toolTime.startTime;
                toolTime.argumentBuildTime = toolTime.totalTime; // Google returns complete args
              }

              try {
                JSON.parse(toolCall.arguments);
                toolMetrics.successfulTools++;
                if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
                  console.log(`[Google] ✅ Valid JSON for ${toolCall.name}`);
                }
              } catch (e) {
                toolMetrics.failedTools++;
                console.error(
                  `[Google] ❌ Invalid JSON for ${toolCall.name}: ${e}`,
                );
              }

              // Log completion
              if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
                console.log(
                  `[Google] Tool ${toolCall.name} complete with arguments (${toolCall.arguments.length} chars):`,
                );
                console.log(toolCall.arguments);
              }

              onEvent({
                type: "tool_call_parsed",
                toolCall: {
                  id: toolCall.id,
                  name: toolCall.name,
                  arguments: toolCall.arguments,
                },
              });
            }
          }
        }
      } catch (error) {
        // Silently ignore parsing errors
        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
          console.error(
            `[Google] Error parsing chunk for function calls:`,
            error,
          );
        }
      }
    }

    // Google might also return function calls or additional text in the final response
    try {
      const response = await result.response;
      const candidate = response.candidates?.[0];

      if (
        process.env.DEBUG_GRAPHLIT_SDK_STREAMING &&
        candidate?.content?.parts
      ) {
        console.log(
          `[Google] Processing final response with ${candidate.content.parts.length} parts`,
        );
      }

      if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
          // Check for any final text we might have missed
          if (part.text) {
            const finalText = part.text;
            // Only add if it's not already included in fullMessage
            if (!fullMessage.endsWith(finalText)) {
              if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
                console.log(
                  `[Google] Adding final text: ${finalText.length} chars`,
                );
              }
              fullMessage += finalText;
              onEvent({
                type: "token",
                token: finalText,
              });
            }
          }

          // Check for function calls
          if (
            part.functionCall &&
            !toolCalls.some((tc) => tc.name === part.functionCall.name)
          ) {
            if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
              console.log(
                `[Google] Found function call in final response: ${part.functionCall.name}`,
              );
            }

            const toolCall: ConversationToolCall = {
              id: `google_tool_${Date.now()}_${toolCalls.length}`,
              name: part.functionCall.name,
              arguments: JSON.stringify(part.functionCall.args || {}),
            };
            toolCalls.push(toolCall);

            // Emit events for function calls found in final response
            onEvent({
              type: "tool_call_start",
              toolCall: {
                id: toolCall.id,
                name: toolCall.name,
              },
            });

            onEvent({
              type: "tool_call_parsed",
              toolCall: {
                id: toolCall.id,
                name: toolCall.name,
                arguments: toolCall.arguments,
              },
            });
          }
        }
      }
    } catch (error) {
      // Log parsing errors when debugging
      if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
        console.error(`[Google] Error processing final response:`, error);
      }
    }

    // Final summary logging
    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING && toolCalls.length > 0) {
      console.log(
        `[Google] Successfully processed ${toolCalls.length} tool calls`,
      );
    }

    // Calculate final metrics including tool calling insights
    const totalTime = Date.now() - startTime;
    const totalTokens = tokenCount + toolArgumentTokens;
    const tokensPerSecond =
      totalTokens > 0 ? totalTokens / (totalTime / 1000) : 0;

    // Finalize round metrics
    if (toolCalls.length > 0) {
      const roundEndTime = Date.now();
      const totalToolTime = toolMetrics.toolTimes.reduce(
        (sum, tool) => sum + tool.totalTime,
        0,
      );
      const llmTime = totalTime - totalToolTime;

      toolMetrics.rounds.push({
        roundNumber: toolMetrics.currentRound,
        llmTime: llmTime,
        toolTime: totalToolTime,
        toolCount: toolCalls.length,
      });
    }

    if (process.env.DEBUG_GRAPHLIT_SDK_METRICS) {
      const metricsData = {
        totalTime: `${totalTime}ms`,
        ttft: `${firstTokenTime}ms`,
        ttfmc:
          firstMeaningfulContentTime > 0
            ? `${firstMeaningfulContentTime}ms`
            : null,
        contentTokens: tokenCount,
        toolTokens: toolArgumentTokens,
        totalTokens: totalTokens,
        tps: tokensPerSecond.toFixed(2),
      };
      console.log(
        `📊 [Google] Performance: Total=${metricsData.totalTime} | TTFT=${metricsData.ttft}${metricsData.ttfmc ? ` | TTFMC=${metricsData.ttfmc}` : ""} | Tokens(content/tool/total)=${metricsData.contentTokens}/${metricsData.toolTokens}/${metricsData.totalTokens} | TPS=${metricsData.tps}`,
      );

      // Tool calling metrics
      if (toolCalls.length > 0) {
        const successRate = (
          (toolMetrics.successfulTools / toolMetrics.totalTools) *
          100
        ).toFixed(1);
        const avgToolTime =
          toolMetrics.toolTimes.reduce((sum, tool) => sum + tool.totalTime, 0) /
          toolMetrics.toolTimes.length;

        console.log(
          `🔧 [Google] Tools: Total=${toolMetrics.totalTools} | Success=${toolMetrics.successfulTools} | Failed=${toolMetrics.failedTools} | SuccessRate=${successRate}% | AvgTime=${avgToolTime.toFixed(2)}ms`,
        );

        // Tool timing details (consolidated)
        const toolTimings = toolMetrics.toolTimes
          .map((tool, idx) => `${tool.name}:${tool.argumentBuildTime}ms`)
          .join(" | ");
        if (toolTimings) {
          console.log(`🔨 [Google] Tool Timings: ${toolTimings}`);
        }

        // Round metrics (consolidated)
        const roundMetrics = toolMetrics.rounds
          .map((round) => {
            const efficiency =
              round.toolCount > 0
                ? (
                    (round.llmTime / (round.llmTime + round.toolTime)) *
                    100
                  ).toFixed(1)
                : 100;
            return `R${round.roundNumber}(LLM:${round.llmTime}ms,Tools:${round.toolTime}ms,Eff:${efficiency}%)`;
          })
          .join(" | ");
        if (roundMetrics) {
          console.log(`🔄 [Google] Rounds: ${roundMetrics}`);
        }
      }

      if (interTokenDelays.length > 0) {
        const avgDelay =
          interTokenDelays.reduce((a, b) => a + b, 0) / interTokenDelays.length;
        const sortedDelays = [...interTokenDelays].sort((a, b) => a - b);
        const p50Delay = sortedDelays[Math.floor(sortedDelays.length * 0.5)];
        const p95Delay = sortedDelays[Math.floor(sortedDelays.length * 0.95)];
        const p99Delay = sortedDelays[Math.floor(sortedDelays.length * 0.99)];

        console.log(
          `⏳ [Google] Inter-Token: Avg=${avgDelay.toFixed(2)}ms | P50=${p50Delay}ms | P95=${p95Delay}ms | P99=${p99Delay}ms`,
        );
      }

      console.log(
        `✅ [Google] Final message (${fullMessage.length} chars): "${fullMessage}"`,
      );
    }

    onComplete(fullMessage, toolCalls);
  } catch (error) {
    // Don't emit error event here - let the client handle it to avoid duplicates
    throw error;
  }
}

/**
 * Stream with Groq SDK (OpenAI-compatible)
 */
export async function streamWithGroq(
  specification: Specification,
  messages: OpenAIMessage[],
  tools: ToolDefinitionInput[] | undefined,
  groqClient: any, // Groq client instance (OpenAI-compatible)
  onEvent: (event: StreamEvent) => void,
  onComplete: (message: string, toolCalls: ConversationToolCall[]) => void,
  abortSignal?: AbortSignal,
): Promise<void> {
  try {
    const modelName = getModelName(specification);

    // Filter or simplify tools for Groq models that have issues
    let groqTools = tools;
    if (tools && tools.length > 0) {
      // Some models have tool calling issues - provide fallback prompt
      const problemModels = [
        "llama-3.3",
        "LLAMA_3_3",
        "llama3-groq-70b",
        "llama3-groq-8b",
      ];

      if (
        modelName &&
        problemModels.some((model) =>
          modelName.toLowerCase().includes(model.toLowerCase()),
        )
      ) {
        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
          console.log(
            `⚠️ [Groq] Model ${modelName} has limited tool support - using simplified schemas`,
          );
        }
        // Don't disable tools entirely, but simplify them more aggressively
        groqTools = tools.map((tool) => ({
          ...tool,
          schema: tool.schema
            ? JSON.stringify({
                type: "object",
                properties: JSON.parse(tool.schema).properties || {},
                required: JSON.parse(tool.schema).required || [],
              })
            : tool.schema,
        }));
      } else {
        // For other models, simplify complex schemas
        groqTools = tools.map((tool) => ({
          ...tool,
          schema: tool.schema
            ? simplifySchemaForGroq(JSON.parse(tool.schema))
            : tool.schema,
        }));
      }
    }

    // Groq uses the same API as OpenAI, so we can reuse the OpenAI streaming logic
    return await streamWithOpenAI(
      specification,
      messages,
      groqTools,
      groqClient,
      onEvent,
      onComplete,
      abortSignal,
    );
  } catch (error: any) {
    // Handle Groq-specific errors
    const errorMessage = error.message || error.toString();

    // Check for tool calling errors
    if (
      error.status === 400 &&
      errorMessage.includes("Failed to call a function")
    ) {
      if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
        console.log(`⚠️ [Groq] Tool calling error: ${errorMessage}`);
      }
      // Groq may have limitations with certain tool schemas
      // Re-throw with a more descriptive error
      throw new Error(
        `Groq tool calling error: ${errorMessage}. The model may not support the provided tool schema format.`,
      );
    }

    // Handle rate limits
    if (error.status === 429 || error.statusCode === 429) {
      if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
        console.log(`⚠️ [Groq] Rate limit hit (429)`);
      }
      const rateLimitError: any = new Error("Groq rate limit exceeded");
      rateLimitError.statusCode = 429;
      throw rateLimitError;
    }

    throw error;
  }
}

/**
 * Stream with Cerebras SDK (OpenAI-compatible)
 */
export async function streamWithCerebras(
  specification: Specification,
  messages: OpenAIMessage[],
  tools: ToolDefinitionInput[] | undefined,
  cerebrasClient: any, // OpenAI client instance configured for Cerebras
  onEvent: (event: StreamEvent) => void,
  onComplete: (message: string, toolCalls: ConversationToolCall[]) => void,
  abortSignal?: AbortSignal,
): Promise<void> {
  try {
    const modelName = getModelName(specification);

    // Cerebras has very limited tool support
    let cerebrasTools = tools;
    let filteredMessages = messages;

    if (modelName) {
      const isQwen = modelName.toLowerCase().includes("qwen-3-32b");

      if (tools && tools.length > 0) {
        if (!isQwen) {
          // Only qwen-3-32b supports tools
          if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
            console.log(
              `⚠️ [Cerebras] Disabling tools for ${modelName} - only qwen-3-32b supports tools`,
            );
          }
          cerebrasTools = undefined;
        }
      }

      // For non-qwen models, we need to filter out any assistant messages with tool_calls
      if (!isQwen) {
        filteredMessages = messages.map((msg) => {
          if (
            msg.role === "assistant" &&
            msg.tool_calls &&
            msg.tool_calls.length > 0
          ) {
            // Remove tool_calls from assistant messages for non-qwen models
            const { tool_calls, ...msgWithoutTools } = msg;
            if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
              console.log(
                `⚠️ [Cerebras] Removing tool_calls from assistant message for ${modelName}`,
              );
            }
            return msgWithoutTools;
          }
          return msg;
        });
      }
    }

    // Cerebras uses the same API as OpenAI, so we can reuse the OpenAI streaming logic
    return await streamWithOpenAI(
      specification,
      filteredMessages,
      cerebrasTools,
      cerebrasClient,
      onEvent,
      onComplete,
      abortSignal,
    );
  } catch (error: any) {
    // Handle Cerebras-specific 429 errors
    if (error.status === 429 || error.statusCode === 429) {
      if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
        console.log(`⚠️ [Cerebras] Rate limit hit (429)`);
      }
      // Re-throw with proper status code for retry logic
      const rateLimitError: any = new Error("Cerebras rate limit exceeded");
      rateLimitError.statusCode = 429;
      throw rateLimitError;
    }
    throw error;
  }
}

/**
 * Stream with Deepseek SDK (OpenAI-compatible)
 */
export async function streamWithDeepseek(
  specification: Specification,
  messages: OpenAIMessage[],
  tools: ToolDefinitionInput[] | undefined,
  deepseekClient: any, // OpenAI client instance configured for Deepseek
  onEvent: (event: StreamEvent) => void,
  onComplete: (message: string, toolCalls: ConversationToolCall[]) => void,
  abortSignal?: AbortSignal,
): Promise<void> {
  let fullMessage = "";
  let toolCalls: ConversationToolCall[] = [];

  // Reasoning detection state
  let reasoningLines: string[] = [];
  let currentLine = "";
  const REASONING_PATTERNS = [
    /^🤔\s*Reasoning:/i,
    /^\*\*Step\s+\d+:/i,
    /^\*\*Reasoning:/i,
    /^\*\*Analysis:/i,
    /^\*\*Thought\s+\d+:/i,
    /^\*\*Consideration:/i,
  ];
  let isInReasoning = false;
  let hasEmittedReasoningStart = false;

  // Performance metrics
  const startTime = Date.now();
  let firstTokenTime = 0;
  let firstMeaningfulContentTime = 0;
  let tokenCount = 0;
  let toolArgumentTokens = 0;
  let lastEventTime = 0;
  const interTokenDelays: number[] = [];

  // Tool calling metrics
  const toolMetrics = {
    totalTools: 0,
    successfulTools: 0,
    failedTools: 0,
    toolTimes: [] as {
      name: string;
      startTime: number;
      argumentBuildTime: number;
      totalTime: number;
    }[],
    currentToolStart: 0,
    roundStartTime: startTime,
    rounds: [] as {
      roundNumber: number;
      llmTime: number;
      toolTime: number;
      toolCount: number;
    }[],
    currentRound: 1,
  };

  try {
    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(`🔍 [Deepseek] Specification object:`, {
        name: specification.name,
        serviceType: specification.serviceType,
        deepseek: specification.deepseek,
        hasDeepseekModel: !!specification.deepseek?.model,
        deepseekModelValue: specification.deepseek?.model,
      });
    }

    const modelName = getModelName(specification);
    if (!modelName) {
      console.error(`❌ [Deepseek] Model resolution failed:`, {
        name: specification.name,
        serviceType: specification.serviceType,
        deepseek: specification.deepseek,
        hasCustomModelName: !!specification.deepseek?.modelName,
      });
      throw new Error(
        `No model name found for specification: ${specification.name} (service: ${specification.serviceType})`,
      );
    }

    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `🤖 [Deepseek] Model Config: Service=Deepseek | Model=${modelName} | Temperature=${specification.deepseek?.temperature} | MaxTokens=${specification.deepseek?.completionTokenLimit || "null"} | Tools=${tools?.length || 0} | Spec="${specification.name}"`,
      );
    }

    const streamConfig: any = {
      model: modelName,
      messages,
      stream: true,
      temperature: specification.deepseek?.temperature,
    };

    // Only add max_completion_tokens if it's defined
    if (specification.deepseek?.completionTokenLimit) {
      streamConfig.max_completion_tokens =
        specification.deepseek.completionTokenLimit;
    }

    // Add tools if provided
    if (tools && tools.length > 0) {
      streamConfig.tools = tools.map((tool) => ({
        type: "function",
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.schema ? JSON.parse(tool.schema) : {},
        },
      }));
    }

    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `⏱️ [Deepseek] Starting LLM call at: ${new Date().toISOString()}`,
      );
    }

    const stream = await deepseekClient.chat.completions.create({
      ...streamConfig,
      ...(abortSignal && { signal: abortSignal }),
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta;

      if (!delta) continue;

      const currentTime = Date.now();

      // Track first token time
      if (firstTokenTime === 0) {
        firstTokenTime = currentTime - startTime;
      }

      // Track inter-token delays
      if (lastEventTime > 0) {
        const delay = currentTime - lastEventTime;
        interTokenDelays.push(delay);
      }
      lastEventTime = currentTime;

      // Handle message content
      if (delta.content) {
        tokenCount++;

        // Track first meaningful content
        if (firstMeaningfulContentTime === 0 && fullMessage.trim().length > 0) {
          firstMeaningfulContentTime = currentTime - startTime;
        }

        // Process content for reasoning detection
        const content = delta.content;

        // Build current line for pattern matching
        for (const char of content) {
          if (char === "\n") {
            // Check if this line starts a reasoning section
            const trimmedLine = currentLine.trim();
            const isReasoningLine = REASONING_PATTERNS.some((pattern) =>
              pattern.test(trimmedLine),
            );

            if (isReasoningLine && !isInReasoning) {
              // Start reasoning mode
              isInReasoning = true;
              if (!hasEmittedReasoningStart) {
                onEvent({ type: "reasoning_start", format: "markdown" });
                hasEmittedReasoningStart = true;
              }
              reasoningLines.push(currentLine);
              onEvent({
                type: "reasoning_delta",
                content: currentLine + "\n",
                format: "markdown",
              });
            } else if (isInReasoning) {
              // Continue reasoning if line is indented or continues the pattern
              if (
                currentLine.startsWith("  ") ||
                currentLine.startsWith("\t") ||
                currentLine.trim().startsWith("**") ||
                currentLine.trim() === ""
              ) {
                reasoningLines.push(currentLine);
                onEvent({
                  type: "reasoning_delta",
                  content: currentLine + "\n",
                  format: "markdown",
                });
              } else {
                // End reasoning mode
                isInReasoning = false;
                onEvent({
                  type: "reasoning_end",
                  fullContent: reasoningLines.join("\n"),
                });

                // This line is normal content
                fullMessage += currentLine + "\n";
                onEvent({ type: "token", token: currentLine + "\n" });
              }
            } else {
              // Normal content
              fullMessage += currentLine + "\n";
              onEvent({ type: "token", token: currentLine + "\n" });
            }

            currentLine = "";
          } else {
            currentLine += char;
          }
        }

        // Handle partial line
        if (currentLine && !isInReasoning) {
          // For partial lines, emit as normal content
          fullMessage += currentLine;
          onEvent({ type: "token", token: currentLine });
          currentLine = "";
        }

        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
          console.log(
            `[Deepseek] Token #${tokenCount}: "${delta.content}" | Accumulated: ${fullMessage.length} chars`,
          );
        }

        // Performance metrics tracking (internal only)
        if (tokenCount % 10 === 0) {
          const totalTokens = tokenCount + toolArgumentTokens;
          const tokensPerSecond =
            totalTokens > 0
              ? totalTokens / ((currentTime - startTime) / 1000)
              : 0;
          const avgInterTokenDelay =
            interTokenDelays.length > 0
              ? interTokenDelays.reduce((a, b) => a + b, 0) /
                interTokenDelays.length
              : 0;
        }
      }

      // Handle tool calls
      if (delta.tool_calls) {
        for (const toolCall of delta.tool_calls) {
          const index = toolCall.index;

          // Initialize tool call if it doesn't exist
          if (!toolCalls[index]) {
            toolCalls[index] = {
              id: toolCall.id || `tool_${index}`,
              name: toolCall.function?.name || "",
              arguments: "",
            };

            // Start tool timing
            toolMetrics.totalTools++;
            toolMetrics.currentToolStart = currentTime;

            if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
              console.log(
                `🔧 [Deepseek] Tool call started: ${toolCalls[index].name}`,
              );
            }

            onEvent({
              type: "tool_call_parsed",
              toolCall: { ...toolCalls[index] },
            });
          }

          // Update tool call name if provided
          if (toolCall.function?.name) {
            toolCalls[index].name = toolCall.function.name;
          }

          // Accumulate arguments
          if (toolCall.function?.arguments) {
            toolCalls[index].arguments += toolCall.function.arguments;
            toolArgumentTokens++;
          }

          // Update with current state
          onEvent({
            type: "tool_call_delta",
            toolCallId: toolCalls[index].id,
            argumentDelta: toolCall.function?.arguments || "",
          });
        }
      }
    }

    // Handle any remaining content
    if (currentLine) {
      if (isInReasoning) {
        reasoningLines.push(currentLine);
        onEvent({
          type: "reasoning_delta",
          content: currentLine,
          format: "markdown",
        });
        onEvent({
          type: "reasoning_end",
          fullContent: reasoningLines.join("\n"),
        });
      } else {
        fullMessage += currentLine;
        onEvent({ type: "token", token: currentLine });
      }
    }

    // Process completed tool calls
    const validToolCalls = toolCalls.filter((tc, idx) => {
      if (!isValidJSON(tc.arguments)) {
        console.warn(
          `[Deepseek] Filtering out incomplete tool call ${idx} (${tc.name}) with INVALID JSON (${tc.arguments.length} chars)`,
        );
        return false;
      }
      return true;
    });

    if (toolCalls.length !== validToolCalls.length) {
      console.log(
        `[Deepseek] Filtered out ${toolCalls.length - validToolCalls.length} incomplete tool calls`,
      );
    }

    // Final performance metrics
    const totalTime = Date.now() - startTime;
    const totalTokens = tokenCount + toolArgumentTokens;
    const tokensPerSecond =
      totalTokens > 0 ? totalTokens / (totalTime / 1000) : 0;

    if (process.env.DEBUG_GRAPHLIT_SDK_METRICS) {
      const metricsData = {
        totalTime: `${totalTime}ms`,
        ttft: `${firstTokenTime}ms`,
        ttfmc:
          firstMeaningfulContentTime > 0
            ? `${firstMeaningfulContentTime}ms`
            : null,
        contentTokens: tokenCount,
        toolTokens: toolArgumentTokens,
        totalTokens: totalTokens,
        tps: tokensPerSecond.toFixed(2),
      };
      console.log(
        `📊 [Deepseek] Performance: Total=${metricsData.totalTime} | TTFT=${metricsData.ttft}${metricsData.ttfmc ? ` | TTFMC=${metricsData.ttfmc}` : ""} | Tokens(content/tool/total)=${metricsData.contentTokens}/${metricsData.toolTokens}/${metricsData.totalTokens} | TPS=${metricsData.tps}`,
      );
    }

    // Send completion event
    onEvent({
      type: "complete",
      tokens: totalTokens,
    });

    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `✅ [Deepseek] Stream completed: ${fullMessage.length} chars, ${validToolCalls.length} tools`,
      );
    }

    onComplete(fullMessage, validToolCalls);
  } catch (error) {
    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.error(`❌ [Deepseek] Stream error:`, error);
    }
    onEvent({
      type: "error",
      error: `Deepseek streaming error: ${error}`,
    });
    throw error;
  }
}

/**
 * Stream with Cohere SDK
 */
export async function streamWithCohere(
  specification: Specification,
  messages: ConversationMessage[],
  tools: ToolDefinitionInput[] | undefined,
  cohereClient: any, // CohereClient instance
  onEvent: (event: StreamEvent) => void,
  onComplete: (message: string, toolCalls: ConversationToolCall[]) => void,
  abortSignal?: AbortSignal,
): Promise<void> {
  let fullMessage = "";
  let toolCalls: ConversationToolCall[] = [];

  // Performance metrics
  const startTime = Date.now();
  let firstTokenTime = 0;
  let tokenCount = 0;

  try {
    const modelName = getModelName(specification);
    if (!modelName) {
      throw new Error(
        `No model name found for Cohere specification: ${specification.name}`,
      );
    }

    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `🤖 [Cohere] Model Config: Service=Cohere | Model=${modelName} | Temperature=${specification.cohere?.temperature} | Tools=${tools?.length || 0} | Spec="${specification.name}"`,
      );
    }

    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(`🔍 [Cohere] Messages array length: ${messages.length}`);
      console.log(
        `🔍 [Cohere] All messages:`,
        JSON.stringify(messages, null, 2),
      );
    }

    // V2 API validation
    if (messages.length === 0) {
      throw new Error("No messages found for Cohere streaming");
    }

    // V2 API expects messages array with specific role strings
    interface CohereV2Message {
      role: "system" | "user" | "assistant" | "tool";
      content: string;
      toolCalls?: any[]; // ToolCallV2[]
      toolCallId?: string;
    }

    const v2Messages: CohereV2Message[] = [];

    // Map our GraphQL role types to Cohere v2 role strings
    messages.forEach((msg) => {
      switch (msg.role) {
        case Types.ConversationRoleTypes.System:
          v2Messages.push({
            role: "system",
            content: msg.message || "",
          });
          break;
        case Types.ConversationRoleTypes.User:
          v2Messages.push({
            role: "user",
            content: msg.message || "",
          });
          break;
        case Types.ConversationRoleTypes.Assistant:
          const assistantMsg: CohereV2Message = {
            role: "assistant",
            content: msg.message || "",
          };
          // V2 uses camelCase toolCalls
          if (msg.toolCalls && msg.toolCalls.length > 0) {
            // Convert our internal tool call format to Cohere V2 format
            assistantMsg.toolCalls = msg.toolCalls
              .filter((tc): tc is Types.ConversationToolCall => tc !== null)
              .map((tc) => ({
                id: tc.id,
                type: "function" as const,
                function: {
                  name: tc.name,
                  arguments: tc.arguments,
                },
              }));
          }
          v2Messages.push(assistantMsg);
          break;
        case Types.ConversationRoleTypes.Tool:
          // Tool messages need the tool call ID
          const toolCallId = msg.toolCallId || "";

          if (!toolCallId && process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
            console.warn(`[Cohere] Tool message missing toolCallId:`, {
              message: msg.message?.substring(0, 50),
            });
          }

          v2Messages.push({
            role: "tool",
            content: msg.message || "",
            toolCallId: toolCallId,
          });
          break;
        default:
          console.warn(
            `[Cohere] Unknown message role: ${msg.role}, treating as user`,
          );
          v2Messages.push({
            role: "user",
            content: msg.message || "",
          });
      }
    });

    const streamConfig: any = {
      model: modelName,
      messages: v2Messages,
      stream: true,
    };

    // Only add temperature if it's defined
    if (
      specification.cohere?.temperature !== undefined &&
      specification.cohere.temperature !== null
    ) {
      streamConfig.temperature = specification.cohere.temperature;
    }

    // Add tools if provided - V2 format is different
    if (tools && tools.length > 0) {
      streamConfig.tools = tools.map((tool) => ({
        type: "function",
        function: {
          name: tool.name || "",
          description: tool.description || "",
          parameters: tool.schema ? JSON.parse(tool.schema) : {},
        },
      }));
    }

    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `🔍 [Cohere] Final stream config:`,
        JSON.stringify(streamConfig, null, 2),
      );
      console.log(`🔍 [Cohere] Current message: "${streamConfig.message}"`);
      console.log(
        `🔍 [Cohere] Chat history length: ${streamConfig.chatHistory?.length || 0}`,
      );
      console.log(`🔍 [Cohere] Has tools: ${!!streamConfig.tools}`);
      console.log(
        `⏱️ [Cohere] Starting stream request at: ${new Date().toISOString()}`,
      );
    }

    let stream;
    try {
      // Always log the full config when debugging Command A errors
      if (
        modelName.includes("command-a") ||
        process.env.DEBUG_GRAPHLIT_SDK_STREAMING
      ) {
        console.log(
          `🔍 [Cohere] Full streamConfig for ${modelName}:`,
          JSON.stringify(streamConfig, null, 2),
        );
      }

      stream = await cohereClient.chatStream({
        ...streamConfig,
        ...(abortSignal && { signal: abortSignal }),
      });
    } catch (streamError: any) {
      // Enhanced error logging
      console.error(
        `❌ [Cohere] Stream creation failed for model ${modelName}`,
      );
      console.error(`❌ [Cohere] Error type: ${streamError.constructor.name}`);
      console.error(
        `❌ [Cohere] Status code: ${streamError.statusCode || streamError.status || "unknown"}`,
      );
      console.error(`❌ [Cohere] Error message: ${streamError.message}`);

      // Try to read the body if it's a ReadableStream
      if (
        streamError.body &&
        typeof streamError.body.getReader === "function"
      ) {
        try {
          const reader = streamError.body.getReader();
          let fullBody = "";
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            fullBody += new TextDecoder().decode(value);
          }
          console.error(`❌ [Cohere] Raw error body:`, fullBody);
          try {
            const parsed = JSON.parse(fullBody);
            console.error(
              `❌ [Cohere] Parsed error details:`,
              JSON.stringify(parsed, null, 2),
            );
          } catch (e) {
            console.error(`❌ [Cohere] Could not parse error body as JSON`);
          }
        } catch (e) {
          console.error(`❌ [Cohere] Could not read error body:`, e);
        }
      }

      throw streamError;
    }

    // Track current tool call being built
    let currentToolCallIndex = -1;
    let currentToolCall: ConversationToolCall | null = null;

    for await (const chunk of stream) {
      if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
        console.log(`[Cohere] Event type: ${chunk.type}`);
      }

      // Handle v2 API event types
      if (chunk.type === "content-delta") {
        // Content streaming in response generation step
        const text = chunk.delta?.message?.content?.text;
        if (text) {
          fullMessage += text;
          tokenCount++;

          if (firstTokenTime === 0) {
            firstTokenTime = Date.now() - startTime;
            if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
              console.log(
                `⚡ [Cohere] Time to First Token: ${firstTokenTime}ms`,
              );
            }
          }

          onEvent({
            type: "token",
            token: text,
          });

          // Also emit message update
          onEvent({
            type: "message",
            message: fullMessage,
          });
        }
      } else if (chunk.type === "tool-call-start") {
        // Start of a tool call
        currentToolCallIndex = chunk.index || 0;
        const toolCallData = chunk.delta?.message?.toolCalls; // Note: toolCalls not tool_calls
        if (toolCallData) {
          currentToolCall = {
            id:
              toolCallData.id ||
              `cohere_tool_${Date.now()}_${currentToolCallIndex}`,
            name: toolCallData.function?.name || "",
            arguments: "",
          };

          onEvent({
            type: "tool_call_start",
            toolCall: {
              id: currentToolCall.id,
              name: currentToolCall.name,
            },
          });

          if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
            console.log(`[Cohere] Tool call started: ${currentToolCall.name}`);
          }
        }
      } else if (chunk.type === "tool-call-delta") {
        // Tool call argument streaming
        if (currentToolCall && chunk.index === currentToolCallIndex) {
          const argDelta = chunk.delta?.message?.toolCalls?.function?.arguments;
          if (argDelta) {
            currentToolCall.arguments += argDelta;

            onEvent({
              type: "tool_call_delta",
              toolCallId: currentToolCall.id,
              argumentDelta: argDelta,
            });
          }
        }
      } else if (chunk.type === "tool-call-end") {
        // Tool call complete
        if (currentToolCall && chunk.index === currentToolCallIndex) {
          toolCalls.push(currentToolCall);

          onEvent({
            type: "tool_call_parsed",
            toolCall: currentToolCall,
          });

          if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
            console.log(
              `[Cohere] Tool call completed: ${currentToolCall.name}`,
            );
          }

          currentToolCall = null;
          currentToolCallIndex = -1;
        }
      } else if (chunk.type === "tool-plan-delta") {
        // Handle tool plan delta - Cohere might send this before tool calls
        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
          console.log(`[Cohere] Tool plan delta received`, chunk);
        }
      } else if (chunk.type === "message-start") {
        // Handle message start event
        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
          console.log(`[Cohere] Message start event received`, chunk);
        }
      } else if (chunk.type === "message-end") {
        // Handle message end event
        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
          console.log(`[Cohere] Message end event received`, chunk);
        }
      }
    }

    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `✅ [Cohere] Complete. Total tokens: ${tokenCount} | Message length: ${fullMessage.length} | Tool calls: ${toolCalls.length}`,
      );
    }

    // Emit final complete event
    onEvent({
      type: "complete",
      tokens: tokenCount,
    });

    onComplete(fullMessage, toolCalls);
  } catch (error) {
    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.error(`❌ [Cohere] Stream error:`, error);
      if (error instanceof Error) {
        console.error(`❌ [Cohere] Error message: ${error.message}`);
        console.error(`❌ [Cohere] Error stack: ${error.stack}`);
      }
      // Log additional error details if available
      if ((error as any).response) {
        console.error(
          `❌ [Cohere] Response status: ${(error as any).response.status}`,
        );
        console.error(
          `❌ [Cohere] Response data:`,
          (error as any).response.data,
        );
      }
    }
    throw error;
  }
}

/**
 * Stream with Mistral SDK
 */
export async function streamWithMistral(
  specification: Specification,
  messages: MistralMessage[],
  tools: ToolDefinitionInput[] | undefined,
  mistralClient: any, // Mistral client instance
  onEvent: (event: StreamEvent) => void,
  onComplete: (message: string, toolCalls: ConversationToolCall[]) => void,
  abortSignal?: AbortSignal,
): Promise<void> {
  let fullMessage = "";
  let toolCalls: ConversationToolCall[] = [];

  // Performance metrics
  const startTime = Date.now();
  let firstTokenTime = 0;
  let tokenCount = 0;

  try {
    const modelName = getModelName(specification);
    if (!modelName) {
      throw new Error(
        `No model name found for Mistral specification: ${specification.name}`,
      );
    }

    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `🤖 [Mistral] Model Config: Service=Mistral | Model=${modelName} | Temperature=${specification.mistral?.temperature} | Tools=${tools?.length || 0} | Spec="${specification.name}"`,
      );
      console.log(
        `🔍 [Mistral] Messages being sent (${messages.length} total):`,
      );
      messages.forEach((msg, idx) => {
        const msgWithTools = msg as MistralMessage & {
          tool_calls?: any[];
          tool_call_id?: string;
          toolCallId?: string;
        };
        console.log(
          `  Message ${idx}: role=${msg.role}, hasContent=${!!msg.content}, hasToolCalls=${!!msgWithTools.tool_calls}, tool_call_id=${msgWithTools.tool_call_id}`,
        );
        if (msgWithTools.tool_calls) {
          console.log(
            `    Tool calls: ${JSON.stringify(msgWithTools.tool_calls)}`,
          );
        }
        if (msgWithTools.tool_call_id) {
          console.log(`    Tool call ID: ${msgWithTools.tool_call_id}`);
        }
        // Log full message for debugging
        console.log(`    Full message: ${JSON.stringify(msg)}`);
      });
    }

    const streamConfig: any = {
      model: modelName,
      messages,
      temperature: specification.mistral?.temperature,
    };

    // Add tools if provided
    if (tools && tools.length > 0) {
      streamConfig.tools = tools.map((tool) => ({
        type: "function",
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.schema ? JSON.parse(tool.schema) : {},
        },
      }));
    }

    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `[Mistral] Stream config:`,
        JSON.stringify(
          {
            ...streamConfig,
            messages: streamConfig.messages.map((m: any) => ({
              role: m.role,
              contentLength:
                typeof m.content === "string"
                  ? m.content.length
                  : m.content?.length || 0,
              hasToolCalls: !!m.tool_calls,
              toolCallsCount: m.tool_calls?.length || 0,
              toolCallId: m.tool_call_id,
            })),
          },
          null,
          2,
        ),
      );

      // Log full messages for debugging tool issues
      if (messages.some((m) => m.role === "tool" || m.tool_calls)) {
        console.log(
          `[Mistral] Full messages for tool debugging:`,
          JSON.stringify(messages, null, 2),
        );
      }
    }

    let stream;
    try {
      // Log the full config for debugging tool issues
      if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
        console.log(`[Mistral] About to call stream with:`, {
          model: streamConfig.model,
          messageCount: streamConfig.messages.length,
          hasTools: !!(streamConfig.tools && streamConfig.tools.length > 0),
          toolCount: streamConfig.tools?.length || 0,
        });

        // Log the EXACT payload being sent to Mistral API
        console.log(
          `[Mistral] EXACT API payload:`,
          JSON.stringify(streamConfig, null, 2),
        );

        // Check for tool call/result mismatches
        const toolCallMessages = streamConfig.messages.filter(
          (m: any) => m.tool_calls?.length > 0,
        );
        const toolResultMessages = streamConfig.messages.filter(
          (m: any) => m.role === "tool",
        );

        if (toolCallMessages.length > 0 || toolResultMessages.length > 0) {
          console.log(`[Mistral] Tool message analysis:`, {
            toolCallMessages: toolCallMessages.length,
            toolResultMessages: toolResultMessages.length,
            toolCallsTotal: toolCallMessages.reduce(
              (sum: number, m: any) => sum + (m.tool_calls?.length || 0),
              0,
            ),
          });
        }
      }

      stream = await mistralClient.chat.stream({
        ...streamConfig,
        ...(abortSignal && { signal: abortSignal }),
      });
    } catch (error: any) {
      console.error(`[Mistral] Failed to create stream:`, error);

      // Better error handling for tool mismatch
      if (
        error.message?.includes(
          "Not the same number of function calls and responses",
        )
      ) {
        console.error(
          `[Mistral] Tool call/response mismatch detected. This usually happens when there are unmatched tool calls in the conversation history.`,
        );

        // Analyze the messages to find the mismatch
        const toolCallIds = new Set<string>();
        const toolResponseIds = new Set<string>();

        messages.forEach((msg, idx) => {
          const msgWithTools = msg as MistralMessage & {
            tool_calls?: any[];
            tool_call_id?: string;
          };
          if (msg.role === "assistant" && msgWithTools.tool_calls) {
            msgWithTools.tool_calls.forEach((tc: any) => {
              toolCallIds.add(tc.id);
              console.error(
                `  Message ${idx}: Assistant has tool call with id: ${tc.id}`,
              );
            });
          }
          if (msg.role === "tool") {
            // Check both camelCase and snake_case versions
            const toolId = msgWithTools.tool_call_id;
            if (toolId) {
              toolResponseIds.add(toolId);
              console.error(
                `  Message ${idx}: Tool response for id: ${toolId}`,
              );
            } else {
              console.error(`  Message ${idx}: Tool response missing ID!`);
            }
          }
        });

        console.error(
          `[Mistral] Tool call IDs: ${Array.from(toolCallIds).join(", ")}`,
        );
        console.error(
          `[Mistral] Tool response IDs: ${Array.from(toolResponseIds).join(", ")}`,
        );

        // Find mismatches
        const unmatchedCalls = Array.from(toolCallIds).filter(
          (id) => !toolResponseIds.has(id),
        );
        const unmatchedResponses = Array.from(toolResponseIds).filter(
          (id) => !toolCallIds.has(id),
        );

        if (unmatchedCalls.length > 0) {
          console.error(
            `[Mistral] Tool calls without responses: ${unmatchedCalls.join(", ")}`,
          );
        }
        if (unmatchedResponses.length > 0) {
          console.error(
            `[Mistral] Tool responses without calls: ${unmatchedResponses.join(", ")}`,
          );
        }
      }

      throw new Error(
        `Mistral streaming failed to start: ${error.message || "Unknown error"}`,
      );
    }

    let chunkCount = 0;
    for await (const chunk of stream) {
      chunkCount++;
      if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
        console.log(`[Mistral] Raw chunk:`, JSON.stringify(chunk, null, 2));
      }

      const delta = chunk.data.choices[0]?.delta;

      if (delta?.content) {
        fullMessage += delta.content;
        tokenCount++;

        if (firstTokenTime === 0) {
          firstTokenTime = Date.now() - startTime;
          if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
            console.log(
              `⚡ [Mistral] Time to First Token: ${firstTokenTime}ms`,
            );
          }
        }

        onEvent({
          type: "token",
          token: delta.content,
        });
      }

      // Handle tool calls (Mistral uses camelCase 'toolCalls' not 'tool_calls')
      if (delta?.toolCalls || delta?.tool_calls) {
        const toolCallsArray = delta.toolCalls || delta.tool_calls;
        for (const toolCallDelta of toolCallsArray) {
          const index = toolCallDelta.index || 0;

          // Mistral sends complete tool calls in one chunk
          if (!toolCalls[index]) {
            toolCalls[index] = {
              id:
                toolCallDelta.id ||
                toolCallDelta.function?.id ||
                `tool_${Date.now()}_${index}`,
              name: toolCallDelta.function?.name || "",
              arguments: toolCallDelta.function?.arguments || "",
            };

            if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
              console.log(`[Mistral] Tool call received:`, toolCalls[index]);
            }

            // Emit start event
            onEvent({
              type: "tool_call_start",
              toolCall: {
                id: toolCalls[index].id,
                name: toolCalls[index].name,
              },
            });

            // If arguments are already complete (Mistral sends them all at once)
            if (toolCalls[index].arguments) {
              onEvent({
                type: "tool_call_delta",
                toolCallId: toolCalls[index].id,
                argumentDelta: toolCalls[index].arguments,
              });
            }
          } else {
            // Update existing tool call (though Mistral typically sends complete calls)
            if (toolCallDelta.function?.name) {
              toolCalls[index].name = toolCallDelta.function.name;
            }

            if (toolCallDelta.function?.arguments) {
              toolCalls[index].arguments += toolCallDelta.function.arguments;

              onEvent({
                type: "tool_call_delta",
                toolCallId: toolCalls[index].id,
                argumentDelta: toolCallDelta.function.arguments,
              });
            }
          }
        }
      }
    }

    // Emit complete events for tool calls
    for (const toolCall of toolCalls) {
      if (isValidJSON(toolCall.arguments)) {
        onEvent({
          type: "tool_call_parsed",
          toolCall,
        });
      } else {
        console.warn(
          `[Mistral] Skipping tool call with invalid JSON: ${toolCall.name}`,
          toolCall.arguments,
        );
      }
    }

    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `✅ [Mistral] Complete. Chunks: ${chunkCount} | Tokens: ${tokenCount} | Message length: ${fullMessage.length} | Tool calls: ${toolCalls.length}`,
      );
    }

    onComplete(fullMessage, toolCalls);
  } catch (error: any) {
    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.error(
        `❌ [Mistral] Streaming error:`,
        error.message || error,
        error.stack,
      );
    }

    // Check for common Mistral errors
    if (
      error.message?.includes("401") ||
      error.message?.includes("Unauthorized")
    ) {
      throw new Error(
        "Mistral API authentication failed. Please check your MISTRAL_API_KEY.",
      );
    }

    if (
      error.message?.includes("429") ||
      error.message?.includes("rate limit")
    ) {
      const rateLimitError = new Error(
        "Mistral API rate limit exceeded. Please try again later.",
      );
      (rateLimitError as any).statusCode = 429;
      throw rateLimitError;
    }

    // Re-throw with more context
    throw new Error(
      `Mistral streaming failed: ${error.message || "Unknown error"}`,
    );
  }
}

/**
 * Stream with Bedrock SDK (for Claude models)
 */
export async function streamWithBedrock(
  specification: Specification,
  messages: BedrockMessage[],
  systemPrompt: string | undefined,
  tools: ToolDefinitionInput[] | undefined,
  bedrockClient: any, // BedrockRuntimeClient instance
  onEvent: (event: StreamEvent) => void,
  onComplete: (message: string, toolCalls: ConversationToolCall[]) => void,
  abortSignal?: AbortSignal,
): Promise<void> {
  let fullMessage = "";
  let toolCalls: ConversationToolCall[] = [];
  // Map contentBlockIndex to tool calls for proper correlation
  const toolCallsByIndex = new Map<number, ConversationToolCall>();

  // Performance metrics
  const startTime = Date.now();
  let firstTokenTime = 0;
  let tokenCount = 0;

  // Reasoning detection state
  let isInThinkingTag = false;
  let reasoningContent = "";
  let currentContent = "";
  const THINKING_START = "<thinking>";
  const THINKING_END = "</thinking>";

  // Bedrock delta tracking - Some Bedrock models send accumulated text instead of deltas
  let accumulatedText = "";

  try {
    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `🔍 [Bedrock] Specification object:`,
        JSON.stringify(specification, null, 2),
      );
    }

    const modelName = getModelName(specification);
    if (!modelName) {
      console.error(`❌ [Bedrock] Model resolution failed for specification:`, {
        name: specification.name,
        serviceType: specification.serviceType,
        bedrock: specification.bedrock,
        hasCustomModelName: !!specification.bedrock?.modelName,
      });
      throw new Error(
        `No model name found for Bedrock specification: ${specification.name} (service: ${specification.serviceType}, bedrock.model: ${specification.bedrock?.model})`,
      );
    }

    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `🤖 [Bedrock] Model Config: Service=Bedrock | Model=${modelName} | Temperature=${specification.bedrock?.temperature} | Tools=${tools?.length || 0} | Spec="${specification.name}"`,
      );
    }

    // Import the ConverseStreamCommand for unified API
    const { ConverseStreamCommand } = await import(
      "@aws-sdk/client-bedrock-runtime"
    );

    // Convert messages to Bedrock Converse format
    // The AWS SDK expects content as an array of content blocks
    const converseMessages = messages.map((msg: BedrockMessage) => ({
      role: msg.role,
      content: [
        {
          text:
            typeof msg.content === "string"
              ? msg.content
              : msg.content.toString(),
        },
      ],
    }));

    // Prepare the request using Converse API format
    // Using 'any' type because:
    // 1. We're dynamically importing the SDK (can't import types at compile time)
    // 2. The ConverseStreamCommandInput type has complex union types for system/toolConfig
    // 3. The structure matches the AWS SDK expectations
    const request: any = {
      modelId: modelName,
      messages: converseMessages,
      inferenceConfig: {
        temperature: specification.bedrock?.temperature ?? undefined,
        topP: specification.bedrock?.probability ?? undefined,
        maxTokens: specification.bedrock?.completionTokenLimit || 1000,
      },
    };

    // Add system prompt if provided
    if (systemPrompt) {
      request.system = [{ text: systemPrompt }];
    }

    // Add tools if provided
    if (tools && tools.length > 0) {
      request.toolConfig = {
        tools: tools.map((tool) => ({
          toolSpec: {
            name: tool.name,
            description: tool.description,
            inputSchema: {
              json: tool.schema ? JSON.parse(tool.schema) : {},
            },
          },
        })),
      };
    }

    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `🔍 [Bedrock] Converse request:`,
        JSON.stringify(request, null, 2),
      );
    }

    const command = new ConverseStreamCommand(request);

    const response = await bedrockClient.send(command, {
      ...(abortSignal && { abortSignal }),
    });

    if (response.stream) {
      for await (const event of response.stream) {
        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
          console.log(`🔍 [Bedrock] Stream event:`, JSON.stringify(event));
        }

        // Handle different event types from Converse API
        if (event.contentBlockDelta) {
          const delta = event.contentBlockDelta.delta;
          const contentIndex = event.contentBlockDelta.contentBlockIndex;

          if (delta?.text) {
            let text = delta.text;

            // Bedrock models (especially Nova) may send accumulated text instead of deltas
            // Check if this delta contains all previously accumulated text
            if (
              accumulatedText.length > 0 &&
              delta.text.startsWith(accumulatedText)
            ) {
              // This is accumulated text - extract only the new part
              text = delta.text.substring(accumulatedText.length);
              if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
                console.log(
                  `🔍 [Bedrock] Extracted delta from accumulated text: "${text}" (total: ${delta.text.length}, prev: ${accumulatedText.length})`,
                );
              }
            } else if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
              console.log(`🔍 [Bedrock] Using text as delta: "${text}"`);
            }

            // Update accumulated text
            accumulatedText = accumulatedText + text;

            tokenCount++;

            if (firstTokenTime === 0) {
              firstTokenTime = Date.now() - startTime;
              if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
                console.log(
                  `⚡ [Bedrock] Time to First Token: ${firstTokenTime}ms`,
                );
              }
            }

            // Accumulate content for thinking tag detection
            currentContent += text;

            // Check for thinking tags
            if (!isInThinkingTag && currentContent.includes(THINKING_START)) {
              const startIdx = currentContent.indexOf(THINKING_START);

              // Emit any content before the thinking tag
              const beforeThinking = currentContent.substring(0, startIdx);
              if (beforeThinking) {
                fullMessage += beforeThinking;
                onEvent({ type: "token", token: beforeThinking });
              }

              // Start reasoning mode
              isInThinkingTag = true;
              onEvent({ type: "reasoning_start", format: "thinking_tag" });

              // Process any content after the tag
              currentContent = currentContent.substring(
                startIdx + THINKING_START.length,
              );
              reasoningContent = "";
            }

            if (isInThinkingTag) {
              // Check for end of thinking
              const endIdx = currentContent.indexOf(THINKING_END);
              if (endIdx !== -1) {
                // Add content up to the end tag
                reasoningContent += currentContent.substring(0, endIdx);

                // Emit final reasoning update
                onEvent({
                  type: "reasoning_delta",
                  content: currentContent.substring(0, endIdx),
                  format: "thinking_tag",
                });
                onEvent({
                  type: "reasoning_end",
                  fullContent: reasoningContent,
                });

                // Exit reasoning mode
                isInThinkingTag = false;

                // Continue with remaining content
                currentContent = currentContent.substring(
                  endIdx + THINKING_END.length,
                );

                // Process any remaining text as normal content
                if (currentContent) {
                  fullMessage += currentContent;
                  onEvent({ type: "token", token: currentContent });
                  currentContent = "";
                }
              } else {
                // Still in thinking mode, accumulate reasoning
                reasoningContent += currentContent;
                onEvent({
                  type: "reasoning_delta",
                  content: currentContent,
                  format: "thinking_tag",
                });
                currentContent = "";
              }
            } else {
              // Normal content mode
              fullMessage += currentContent;
              onEvent({ type: "token", token: currentContent });
              currentContent = "";
            }

            // Always emit the current full message (excluding reasoning)
            onEvent({
              type: "message",
              message: fullMessage,
            });
          } else if (delta?.toolUse) {
            // Handle tool use input delta
            if (delta.toolUse.input && contentIndex !== undefined) {
              // Find the corresponding tool call by index
              // Bedrock uses contentBlockIndex to correlate deltas with their starts
              const toolCall = toolCallsByIndex.get(contentIndex);
              if (toolCall) {
                toolCall.arguments += delta.toolUse.input;
              }
            }
          }
        } else if (event.contentBlockStart) {
          // Reset Bedrock tracking for new content blocks
          accumulatedText = "";
          if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
            console.log(
              `🔍 [Bedrock] Reset accumulated text tracking for new content block`,
            );
          }

          // Handle tool use start
          const start = event.contentBlockStart.start;
          const startIndex = event.contentBlockStart.contentBlockIndex;

          if (start?.toolUse && startIndex !== undefined) {
            const toolUse = start.toolUse;
            const id =
              toolUse.toolUseId || `tool_${Date.now()}_${toolCalls.length}`;

            // Initialize the tool call
            const toolCall: ConversationToolCall = {
              id,
              name: toolUse.name || "",
              arguments: "",
            };

            // Store in both array and map
            toolCalls.push(toolCall);
            toolCallsByIndex.set(startIndex, toolCall);

            onEvent({
              type: "tool_call_start",
              toolCall: { id, name: toolUse.name || "" },
            });
          }
        } else if (event.contentBlockStop) {
          // Handle tool use completion
          const stopIndex = event.contentBlockStop.contentBlockIndex;
          if (stopIndex !== undefined) {
            const toolCall = toolCallsByIndex.get(stopIndex);
            if (toolCall) {
              // Emit tool_call_parsed event when tool arguments are complete
              onEvent({
                type: "tool_call_parsed",
                toolCall: toolCall,
              });
            }
          }
        } else if (event.metadata) {
          // Metadata events contain usage information
          if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
            console.log(`📊 [Bedrock] Metadata:`, event.metadata);
          }
        }
      }
    }

    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `✅ [Bedrock] Complete. Total tokens: ${tokenCount} | Message length: ${fullMessage.length}`,
      );
    }

    onEvent({
      type: "complete",
      tokens: tokenCount,
    });

    onComplete(fullMessage, toolCalls);
  } catch (error: any) {
    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.error(`❌ [Bedrock] Stream error:`, error);
    }

    // Handle specific Bedrock errors
    const errorMessage = error.message || error.toString();
    const errorName = error.name || "";

    // Check for throttling errors
    if (
      errorName === "ThrottlingException" ||
      errorMessage.includes("Too many tokens") ||
      errorMessage.includes("Too many requests")
    ) {
      onEvent({
        type: "error",
        error: `Bedrock rate limit: ${errorMessage}`,
      });
      // Re-throw with a specific error type that the retry logic can handle
      const rateLimitError: any = new Error(errorMessage);
      rateLimitError.statusCode = 429; // Treat as rate limit
      throw rateLimitError;
    }

    onEvent({
      type: "error",
      error: `Bedrock streaming error: ${errorMessage}`,
    });
    throw error;
  }
}

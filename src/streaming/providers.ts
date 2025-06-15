import {
  ConversationToolCall,
  Specification,
  ToolDefinitionInput,
} from "../generated/graphql-types.js";
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

    const stream = await openaiClient.chat.completions.create(streamConfig);

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
  } catch (error) {
    // Don't emit error event here - let the client handle it to avoid duplicates
    throw error;
  }
}

/**
 * Stream with Anthropic SDK
 */
export async function streamWithAnthropic(
  specification: Specification,
  messages: AnthropicMessage[],
  systemPrompt: string | undefined,
  tools: ToolDefinitionInput[] | undefined,
  anthropicClient: any, // Anthropic client instance
  onEvent: (event: StreamEvent) => void,
  onComplete: (message: string, toolCalls: ConversationToolCall[]) => void,
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

    const streamConfig: any = {
      model: modelName,
      messages,
      stream: true,
      temperature: specification.anthropic?.temperature,
      //top_p: specification.anthropic?.probability,
      max_tokens: specification.anthropic?.completionTokenLimit || 8192, // required
    };

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

    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `⏱️ [Anthropic] Starting LLM call at: ${new Date().toISOString()}`,
      );
    }

    const stream = await anthropicClient.messages.create(streamConfig);

    let activeContentBlock = false;

    for await (const chunk of stream) {
      // Debug log all chunk types
      if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
        console.log(`[Anthropic] Received chunk type: ${chunk.type}`);
      }

      if (chunk.type === "content_block_start") {
        activeContentBlock = true;
        if (chunk.content_block.type === "tool_use") {
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
        if (chunk.delta.type === "text_delta") {
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
        // Tool call complete
        const currentTool = toolCalls[toolCalls.length - 1];
        if (currentTool) {
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

    onComplete(fullMessage, validToolCalls);
  } catch (error) {
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
): Promise<void> {
  // Groq uses the same API as OpenAI, so we can reuse the OpenAI streaming logic
  return streamWithOpenAI(
    specification,
    messages,
    tools,
    groqClient,
    onEvent,
    onComplete,
  );
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
): Promise<void> {
  // Cerebras uses the same API as OpenAI, so we can reuse the OpenAI streaming logic
  return streamWithOpenAI(
    specification,
    messages,
    tools,
    cerebrasClient,
    onEvent,
    onComplete,
  );
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
    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(`🔍 [Deepseek] Specification object:`, {
        name: specification.name,
        serviceType: specification.serviceType,
        deepseek: specification.deepseek,
        hasDeepseekModel: !!specification.deepseek?.model,
        deepseekModelValue: specification.deepseek?.model
      });
    }
    
    const modelName = getModelName(specification);
    if (!modelName) {
      console.error(`❌ [Deepseek] Model resolution failed:`, {
        name: specification.name,
        serviceType: specification.serviceType,
        deepseek: specification.deepseek,
        hasCustomModelName: !!specification.deepseek?.modelName
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

    const stream = await deepseekClient.chat.completions.create(streamConfig);

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
        fullMessage += delta.content;

        // Track first meaningful content
        if (firstMeaningfulContentTime === 0 && fullMessage.trim().length > 0) {
          firstMeaningfulContentTime = currentTime - startTime;
        }

        onEvent({
          type: "message",
          message: fullMessage,
        });

        // Performance metrics tracking (internal only)
        if (tokenCount % 10 === 0) {
          const totalTokens = tokenCount + toolArgumentTokens;
          const tokensPerSecond =
            totalTokens > 0 ? totalTokens / ((currentTime - startTime) / 1000) : 0;
          const avgInterTokenDelay =
            interTokenDelays.length > 0
              ? interTokenDelays.reduce((a, b) => a + b, 0) / interTokenDelays.length
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
  messages: CohereMessage[],
  tools: ToolDefinitionInput[] | undefined,
  cohereClient: any, // CohereClient instance
  onEvent: (event: StreamEvent) => void,
  onComplete: (message: string, toolCalls: ConversationToolCall[]) => void,
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

    // Prepare the latest user message and chat history
    const lastMessage = messages[messages.length - 1];
    const chatHistory = messages.slice(0, -1);

    const streamConfig: any = {
      model: modelName,
      message: lastMessage.message,
      chatHistory: chatHistory,
      temperature: specification.cohere?.temperature,
    };

    // Add tools if provided
    if (tools && tools.length > 0) {
      streamConfig.tools = tools.map((tool) => {
        if (!tool.schema) {
          return {
            name: tool.name,
            description: tool.description,
            parameterDefinitions: {},
          };
        }

        // Parse the JSON schema
        const schema = JSON.parse(tool.schema);
        
        // Convert JSON Schema to Cohere's expected format
        const parameterDefinitions: Record<string, any> = {};
        
        if (schema.properties) {
          for (const [key, value] of Object.entries(schema.properties)) {
            const prop = value as any;
            parameterDefinitions[key] = {
              type: prop.type || "string",
              description: prop.description || "",
              required: schema.required?.includes(key) || false,
            };
            
            // Add additional properties that Cohere might expect
            if (prop.enum) {
              parameterDefinitions[key].options = prop.enum;
            }
            if (prop.default !== undefined) {
              parameterDefinitions[key].default = prop.default;
            }
            if (prop.items) {
              parameterDefinitions[key].items = prop.items;
            }
          }
        }

        return {
          name: tool.name,
          description: tool.description,
          parameterDefinitions,
        };
      });
    }

    const stream = await cohereClient.chatStream(streamConfig);

    for await (const chunk of stream) {
      if (chunk.eventType === "text-generation") {
        const text = chunk.text;
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
        }
      } else if (chunk.eventType === "tool-calls-generation") {
        // Handle tool calls
        if (chunk.toolCalls) {
          for (const toolCall of chunk.toolCalls) {
            const id = `tool_${Date.now()}_${toolCalls.length}`;
            const formattedToolCall = {
              id,
              name: toolCall.name,
              arguments: JSON.stringify(toolCall.parameters),
            };
            toolCalls.push(formattedToolCall);

            onEvent({
              type: "tool_call_start",
              toolCall: { id, name: toolCall.name },
            });

            onEvent({
              type: "tool_call_parsed",
              toolCall: formattedToolCall,
            });
          }
        }
      }
    }

    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `✅ [Cohere] Complete. Total tokens: ${tokenCount} | Message length: ${fullMessage.length}`,
      );
    }

    onComplete(fullMessage, toolCalls);
  } catch (error) {
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

    const stream = await mistralClient.chat.stream(streamConfig);

    for await (const chunk of stream) {
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

      // Handle tool calls
      if (delta?.tool_calls) {
        for (const toolCallDelta of delta.tool_calls) {
          const index = toolCallDelta.index || 0;

          if (!toolCalls[index]) {
            toolCalls[index] = {
              id: toolCallDelta.id || `tool_${Date.now()}_${index}`,
              name: "",
              arguments: "",
            };

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

    // Emit complete events for tool calls
    for (const toolCall of toolCalls) {
      if (isValidJSON(toolCall.arguments)) {
        onEvent({
          type: "tool_call_parsed",
          toolCall,
        });
      }
    }

    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `✅ [Mistral] Complete. Total tokens: ${tokenCount} | Message length: ${fullMessage.length}`,
      );
    }

    onComplete(fullMessage, toolCalls);
  } catch (error) {
    throw error;
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
): Promise<void> {
  let fullMessage = "";
  let toolCalls: ConversationToolCall[] = [];
  // Map contentBlockIndex to tool calls for proper correlation
  const toolCallsByIndex = new Map<number, ConversationToolCall>();

  // Performance metrics
  const startTime = Date.now();
  let firstTokenTime = 0;
  let tokenCount = 0;

  try {
    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(`🔍 [Bedrock] Specification object:`, JSON.stringify(specification, null, 2));
    }
    
    const modelName = getModelName(specification);
    if (!modelName) {
      console.error(`❌ [Bedrock] Model resolution failed for specification:`, {
        name: specification.name,
        serviceType: specification.serviceType,
        bedrock: specification.bedrock,
        hasCustomModelName: !!specification.bedrock?.modelName
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
      content: [{
        text: typeof msg.content === 'string' ? msg.content : msg.content.toString()
      }]
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
      console.log(`🔍 [Bedrock] Converse request:`, JSON.stringify(request, null, 2));
    }

    const command = new ConverseStreamCommand(request);

    const response = await bedrockClient.send(command);

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
            const text = delta.text;
            fullMessage += text;
            tokenCount++;

            if (firstTokenTime === 0) {
              firstTokenTime = Date.now() - startTime;
              if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
                console.log(
                  `⚡ [Bedrock] Time to First Token: ${firstTokenTime}ms`,
                );
              }
            }

            onEvent({
              type: "token",
              token: text,
            });

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
          // Handle tool use start
          const start = event.contentBlockStart.start;
          const startIndex = event.contentBlockStart.contentBlockIndex;
          
          if (start?.toolUse && startIndex !== undefined) {
            const toolUse = start.toolUse;
            const id = toolUse.toolUseId || `tool_${Date.now()}_${toolCalls.length}`;
            
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
  } catch (error) {
    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.error(`❌ [Bedrock] Stream error:`, error);
    }
    onEvent({
      type: "error",
      error: `Bedrock streaming error: ${error}`,
    });
    throw error;
  }
}

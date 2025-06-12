import {
  ConversationToolCall,
  Specification,
  ToolDefinitionInput,
} from "../generated/graphql-types.js";
import {
  OpenAIMessage,
  AnthropicMessage,
  GoogleMessage,
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
 * Stream with OpenAI SDK
 */
export async function streamWithOpenAI(
  specification: Specification,
  messages: OpenAIMessage[],
  tools: ToolDefinitionInput[] | undefined,
  openaiClient: any, // OpenAI client instance
  onEvent: (event: StreamEvent) => void,
  onComplete: (message: string, toolCalls: ConversationToolCall[]) => void
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
        `No model name found for OpenAI specification: ${specification.name}`
      );
    }

    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `🤖 [OpenAI] Model Config: Service=OpenAI | Model=${modelName} | Temperature=${specification.openAI?.temperature} | MaxTokens=${specification.openAI?.completionTokenLimit || "null"} | Tools=${tools?.length || 0} | Spec="${specification.name}"`
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
        `⏱️ [OpenAI] Starting LLM call at: ${new Date().toISOString()}`
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
            `[OpenAI] Content delta: "${delta.content}" (${delta.content.length} chars)`
          );
        }
        if (delta?.tool_calls) {
          console.log(`[OpenAI] Tool calls:`, delta.tool_calls);
        }
        if (chunk.choices[0]?.finish_reason) {
          console.log(
            `[OpenAI] Finish reason: ${chunk.choices[0].finish_reason}`
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
              `\n⚡ [OpenAI] Time to First Token (TTFT): ${firstTokenTime}ms`
            );
          }
        }

        // Track first meaningful content (excludes tool calls)
        if (firstMeaningfulContentTime === 0 && delta.content.trim()) {
          firstMeaningfulContentTime = currentTime - startTime;
          if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
            console.log(
              `\n🎯 [OpenAI] Time to First Meaningful Content: ${firstMeaningfulContentTime}ms`
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
            `[OpenAI] Token #${tokenCount}: "${delta.content}" | Accumulated: ${fullMessage.length} chars`
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
                  `\n⚡ [OpenAI] Time to First Token (Tool Call): ${firstTokenTime}ms`
                );
              }
            }

            if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
              console.log(
                `[OpenAI] Starting new tool call: ${toolCalls[index].id}`
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
              toolCallDelta.function.arguments.length / 4
            );

            // Debug logging for partial JSON accumulation
            if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
              console.log(
                `[OpenAI] Tool ${toolCalls[index].name} - Partial JSON chunk: "${toolCallDelta.function.arguments}"`
              );
              console.log(
                `[OpenAI] Tool ${toolCalls[index].name} - Total accumulated: ${toolCalls[index].arguments.length} chars`
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
          `[OpenAI] Tool ${toolCall.name} complete with arguments (${toolCall.arguments.length} chars):`
        );
        console.log(toolCall.arguments);
      }

      onEvent({
        type: "tool_call_complete",
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
        `[OpenAI] Successfully processed ${toolCalls.length} tool calls`
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
        0
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
        `📊 [OpenAI] Performance: Total=${metricsData.totalTime} | TTFT=${metricsData.ttft}${metricsData.ttfmc ? ` | TTFMC=${metricsData.ttfmc}` : ""} | Tokens(content/tool/total)=${metricsData.contentTokens}/${metricsData.toolTokens}/${metricsData.totalTokens} | TPS=${metricsData.tps}`
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
          `🔧 [OpenAI] Tools: Total=${toolMetrics.totalTools} | Success=${toolMetrics.successfulTools} | Failed=${toolMetrics.failedTools} | SuccessRate=${successRate}% | AvgTime=${avgToolTime.toFixed(2)}ms`
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
          `⏳ [OpenAI] Inter-Token: Avg=${avgDelay.toFixed(2)}ms | P50=${p50Delay}ms | P95=${p95Delay}ms | P99=${p99Delay}ms`
        );
      }

      console.log(
        `✅ [OpenAI] Final message (${fullMessage.length} chars): "${fullMessage}"`
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
  onComplete: (message: string, toolCalls: ConversationToolCall[]) => void
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
        `No model name found for Anthropic specification: ${specification.name}`
      );
    }

    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `🤖 [Anthropic] Model Config: Service=Anthropic | Model=${modelName} | Temperature=${specification.anthropic?.temperature} | MaxTokens=${specification.anthropic?.completionTokenLimit || 8192} | SystemPrompt=${systemPrompt ? "Yes" : "No"} | Tools=${tools?.length || 0} | Spec="${specification.name}"`
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
        `⏱️ [Anthropic] Starting LLM call at: ${new Date().toISOString()}`
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
                `\n⚡ [Anthropic] Time to First Token (Tool Call): ${firstTokenTime}ms`
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
                `\n⚡ [Anthropic] Time to First Token (TTFT): ${firstTokenTime}ms`
              );
            }
          }

          // Track first meaningful content (excludes tool calls)
          if (firstMeaningfulContentTime === 0 && chunk.delta.text.trim()) {
            firstMeaningfulContentTime = currentTime - startTime;
            if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
              console.log(
                `\n🎯 [Anthropic] Time to First Meaningful Content: ${firstMeaningfulContentTime}ms`
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
              `[Anthropic] Token #${tokenCount}: "${chunk.delta.text}" | Accumulated: ${fullMessage.length} chars`
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
              chunk.delta.partial_json.length / 4
            );

            // Debug logging for partial JSON accumulation
            if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
              console.log(
                `[Anthropic] Tool ${currentTool.name} - Partial JSON chunk: "${chunk.delta.partial_json}"`
              );
              console.log(
                `[Anthropic] Tool ${currentTool.name} - Total accumulated: ${currentTool.arguments.length} chars`
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
              `[Anthropic] ❌ Invalid JSON for ${currentTool.name}: ${e}`
            );
          }

          // Log the final JSON for debugging
          if (
            process.env.DEBUG_GRAPHLIT_SDK_STREAMING ||
            !isValidJSON(currentTool.arguments)
          ) {
            console.log(
              `[Anthropic] Tool ${currentTool.name} complete with arguments (${currentTool.arguments.length} chars):`
            );
            console.log(currentTool.arguments);

            // Check if JSON appears truncated
            const lastChars = currentTool.arguments.slice(-10);
            if (
              !lastChars.includes("}") &&
              currentTool.arguments.length > 100
            ) {
              console.warn(
                `[Anthropic] WARNING: JSON may be truncated - doesn't end with '}': ...${lastChars}`
              );
            }
          }

          onEvent({
            type: "tool_call_complete",
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
          `[Anthropic] Received message_stop without content_block_stop - handling as implicit block stop`
        );
        activeContentBlock = false;

        // Emit synthetic content_block_stop for the current tool
        const currentTool = toolCalls[toolCalls.length - 1];
        if (currentTool) {
          // Log the incomplete tool
          console.warn(
            `[Anthropic] Synthetic content_block_stop for incomplete tool ${currentTool.name} (${currentTool.arguments.length} chars)`
          );

          // Only emit tool_call_complete if we have valid JSON
          if (isValidJSON(currentTool.arguments)) {
            onEvent({
              type: "tool_call_complete",
              toolCall: {
                id: currentTool.id,
                name: currentTool.name,
                arguments: currentTool.arguments,
              },
            });
          } else {
            console.error(
              `[Anthropic] Tool ${currentTool.name} has incomplete JSON, skipping tool_call_complete event`
            );
          }
        }
      }
    }

    // Final check: filter out any remaining incomplete tool calls
    const validToolCalls = toolCalls.filter((tc, idx) => {
      if (!isValidJSON(tc.arguments)) {
        console.warn(
          `[Anthropic] Filtering out incomplete tool call ${idx} (${tc.name}) with INVALID JSON (${tc.arguments.length} chars)`
        );
        return false;
      }
      return true;
    });

    if (toolCalls.length !== validToolCalls.length) {
      console.log(
        `[Anthropic] Filtered out ${toolCalls.length - validToolCalls.length} incomplete tool calls`
      );
      console.log(
        `[Anthropic] Successfully processed ${validToolCalls.length} valid tool calls`
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
        0
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
        `📊 [Anthropic] Performance: Total=${metricsData.totalTime} | TTFT=${metricsData.ttft}${metricsData.ttfmc ? ` | TTFMC=${metricsData.ttfmc}` : ""} | Tokens(content/tool/total)=${metricsData.contentTokens}/${metricsData.toolTokens}/${metricsData.totalTokens} | TPS=${metricsData.tps}`
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
          `🔧 [Anthropic] Tools: Total=${toolMetrics.totalTools} | Success=${toolMetrics.successfulTools} | Failed=${toolMetrics.failedTools} | SuccessRate=${successRate}% | AvgTime=${avgToolTime.toFixed(2)}ms`
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
          `⏳ [Anthropic] Inter-Token: Avg=${avgDelay.toFixed(2)}ms | P50=${p50Delay}ms | P95=${p95Delay}ms | P99=${p99Delay}ms`
        );
      }

      console.log(
        `✅ [Anthropic] Final message (${fullMessage.length} chars): "${fullMessage}"`
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
  onComplete: (message: string, toolCalls: ConversationToolCall[]) => void
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
        `No model name found for Google specification: ${specification.name}`
      );
    }

    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `🤖 [Google] Model Config: Service=Google | Model=${modelName} | Temperature=${specification.google?.temperature} | MaxTokens=${specification.google?.completionTokenLimit || "null"} | SystemPrompt=${systemPrompt ? "Yes" : "No"} | Tools=${tools?.length || 0} | Spec="${specification.name}"`
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
              functionDeclarations: tools.map((tool) => ({
                name: tool.name,
                description: tool.description,
                parameters: tool.schema ? JSON.parse(tool.schema) : {},
              })),
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
              `\n⚡ [Google] Time to First Token (TTFT): ${firstTokenTime}ms`
            );
          }
        }

        // Track first meaningful content
        if (firstMeaningfulContentTime === 0 && text.trim()) {
          firstMeaningfulContentTime = currentTime - startTime;
          if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
            console.log(
              `\n🎯 [Google] Time to First Meaningful Content: ${firstMeaningfulContentTime}ms`
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
                  `[Google] Received function call: ${part.functionCall.name}`
                );
                console.log(
                  `[Google] Function args:`,
                  JSON.stringify(part.functionCall.args || {})
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
                part.functionCall.args || {}
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
                    `\n⚡ [Google] Time to First Token (Tool Call): ${firstTokenTime}ms`
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
                  `[Google] ❌ Invalid JSON for ${toolCall.name}: ${e}`
                );
              }

              // Log completion
              if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
                console.log(
                  `[Google] Tool ${toolCall.name} complete with arguments (${toolCall.arguments.length} chars):`
                );
                console.log(toolCall.arguments);
              }

              onEvent({
                type: "tool_call_complete",
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
            error
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
          `[Google] Processing final response with ${candidate.content.parts.length} parts`
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
                  `[Google] Adding final text: ${finalText.length} chars`
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
                `[Google] Found function call in final response: ${part.functionCall.name}`
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
              type: "tool_call_complete",
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
        `[Google] Successfully processed ${toolCalls.length} tool calls`
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
        0
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
        `📊 [Google] Performance: Total=${metricsData.totalTime} | TTFT=${metricsData.ttft}${metricsData.ttfmc ? ` | TTFMC=${metricsData.ttfmc}` : ""} | Tokens(content/tool/total)=${metricsData.contentTokens}/${metricsData.toolTokens}/${metricsData.totalTokens} | TPS=${metricsData.tps}`
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
          `🔧 [Google] Tools: Total=${toolMetrics.totalTools} | Success=${toolMetrics.successfulTools} | Failed=${toolMetrics.failedTools} | SuccessRate=${successRate}% | AvgTime=${avgToolTime.toFixed(2)}ms`
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
          `⏳ [Google] Inter-Token: Avg=${avgDelay.toFixed(2)}ms | P50=${p50Delay}ms | P95=${p95Delay}ms | P99=${p99Delay}ms`
        );
      }

      console.log(
        `✅ [Google] Final message (${fullMessage.length} chars): "${fullMessage}"`
      );
    }

    onComplete(fullMessage, toolCalls);
  } catch (error) {
    // Don't emit error event here - let the client handle it to avoid duplicates
    throw error;
  }
}

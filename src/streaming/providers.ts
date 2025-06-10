import {
  Specification,
  ToolDefinitionInput,
} from "../generated/graphql-types.js";
import { StreamEvent } from "../client.js";
import {
  OpenAIMessage,
  AnthropicMessage,
  GoogleMessage,
} from "./llm-formatters.js";
import { getModelName } from "../model-mapping.js";

/**
 * Stream with OpenAI SDK
 */
export async function streamWithOpenAI(
  specification: Specification,
  messages: OpenAIMessage[],
  tools: ToolDefinitionInput[] | undefined,
  openaiClient: any, // OpenAI client instance
  onEvent: (event: StreamEvent) => void,
  onComplete: (message: string, toolCalls: any[]) => void
): Promise<void> {
  let fullMessage = "";
  let toolCalls: any[] = [];

  try {
    const modelName = getModelName(specification);
    if (!modelName) {
      throw new Error(
        `No model name found for OpenAI specification: ${specification.name}`
      );
    }

    const streamConfig: any = {
      model: modelName,
      messages,
      stream: true,
      temperature: specification.openAI?.temperature,
      //top_p: specification.openAI?.probability,
      max_completion_tokens: specification.openAI?.completionTokenLimit,
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

    const stream = await openaiClient.chat.completions.create(streamConfig);

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta;

      if (delta?.content) {
        fullMessage += delta.content;
        console.log(`🔍 OpenAI raw token: "${delta.content}"`);
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
      onEvent({
        type: "tool_call_complete",
        toolCall: {
          id: toolCall.id,
          name: toolCall.name,
          arguments: toolCall.arguments,
        },
      });
    }

    onComplete(fullMessage, toolCalls);
  } catch (error) {
    onEvent({
      type: "error",
      error: error instanceof Error ? error.message : "OpenAI streaming failed",
    });
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
  onComplete: (message: string, toolCalls: any[]) => void
): Promise<void> {
  let fullMessage = "";
  let toolCalls: any[] = [];

  try {
    const modelName = getModelName(specification);
    if (!modelName) {
      throw new Error(
        `No model name found for Anthropic specification: ${specification.name}`
      );
    }

    const streamConfig: any = {
      model: modelName,
      messages,
      stream: true,
      temperature: specification.anthropic?.temperature,
      //top_p: specification.anthropic?.probability,
      max_tokens: specification.anthropic?.completionTokenLimit,
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

    console.log(`🚀 Anthropic stream config:`, {
      model: streamConfig.model,
      messageCount: streamConfig.messages.length,
      hasSystem: !!streamConfig.system,
      temperature: streamConfig.temperature,
      max_tokens: streamConfig.max_tokens,
      toolCount: streamConfig.tools?.length || 0
    });

    const stream = await anthropicClient.messages.create(streamConfig);

    for await (const chunk of stream) {
      if (chunk.type === "content_block_start") {
        if (chunk.content_block.type === "tool_use") {
          const toolCall = {
            id: chunk.content_block.id,
            name: chunk.content_block.name,
            arguments: "",
          };
          toolCalls.push(toolCall);

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
          onEvent({
            type: "token",
            token: chunk.delta.text,
          });
        } else if (chunk.delta.type === "input_json_delta") {
          // Find the current tool call and append arguments
          const currentTool = toolCalls[toolCalls.length - 1];
          if (currentTool) {
            currentTool.arguments += chunk.delta.partial_json;
            onEvent({
              type: "tool_call_delta",
              toolCallId: currentTool.id,
              argumentDelta: chunk.delta.partial_json,
            });
          }
        }
      } else if (chunk.type === "content_block_stop") {
        // Tool call complete
        const currentTool = toolCalls[toolCalls.length - 1];
        if (currentTool) {
          onEvent({
            type: "tool_call_complete",
            toolCall: {
              id: currentTool.id,
              name: currentTool.name,
              arguments: currentTool.arguments,
            },
          });
        }
      }
    }

    console.log(`✅ Anthropic streaming complete. Message length: ${fullMessage.length}`);
    if (fullMessage.length === 0) {
      console.warn(`⚠️ Empty response from Anthropic!`);
    }
    onComplete(fullMessage, toolCalls);
  } catch (error) {
    onEvent({
      type: "error",
      error:
        error instanceof Error ? error.message : "Anthropic streaming failed",
    });
    throw error;
  }
}

/**
 * Stream with Google SDK
 */
export async function streamWithGoogle(
  specification: Specification,
  messages: GoogleMessage[],
  googleClient: any, // Google GenerativeAI client instance
  onEvent: (event: StreamEvent) => void,
  onComplete: (message: string) => void
): Promise<void> {
  let fullMessage = "";

  try {
    const modelName = getModelName(specification);
    if (!modelName) {
      throw new Error(
        `No model name found for Google specification: ${specification.name}`
      );
    }

    const model = googleClient.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: specification.google?.temperature ?? 0.1,
        maxOutputTokens: specification.google?.completionTokenLimit ?? 4096,
        topP: specification.google?.probability,
      },
    });

    // Convert messages to Google chat format
    const history = messages.slice(0, -1); // All but last message
    const prompt = messages[messages.length - 1]?.parts[0]?.text || "";

    const chat = model.startChat({ history });
    const result = await chat.sendMessageStream(prompt);

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        fullMessage += text;
        onEvent({
          type: "token",
          token: text,
        });
      }
    }

    onComplete(fullMessage);
  } catch (error) {
    onEvent({
      type: "error",
      error: error instanceof Error ? error.message : "Google streaming failed",
    });
    throw error;
  }
}

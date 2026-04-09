import {
  ConversationMessage,
  ConversationRoleTypes,
  ConversationToolCall,
} from "../generated/graphql-types.js";

/**
 * OpenAI message format
 */
export interface OpenAIMessage {
  role: "system" | "user" | "assistant" | "tool";
  content?:
    | string
    | Array<{
        type: "text" | "image_url";
        text?: string;
        image_url?: {
          url: string; // data:image/jpeg;base64,... format
        };
      }>;
  tool_calls?: Array<{
    id: string;
    type: "function";
    function: {
      name: string;
      arguments: string;
    };
  }>;
  tool_call_id?: string;
}

export interface OpenAIResponsesTextContentPart {
  type: "input_text";
  text: string;
}

export interface OpenAIResponsesImageContentPart {
  type: "input_image";
  image_url: string;
  detail: "low" | "high" | "auto";
}

export type OpenAIResponsesContentPart =
  | OpenAIResponsesTextContentPart
  | OpenAIResponsesImageContentPart;

export interface OpenAIResponsesMessageItem {
  type: "message";
  role: "user" | "assistant";
  content: string | OpenAIResponsesContentPart[];
  phase?: "commentary" | "final_answer";
}

export interface OpenAIResponsesFunctionCallItem {
  type: "function_call";
  call_id: string;
  name: string;
  arguments: string;
  id?: string;
}

export interface OpenAIResponsesFunctionCallOutputItem {
  type: "function_call_output";
  call_id: string;
  output: string;
  id?: string;
}

export type OpenAIResponsesInputItem =
  | OpenAIResponsesMessageItem
  | OpenAIResponsesFunctionCallItem
  | OpenAIResponsesFunctionCallOutputItem
  | Record<string, unknown>;

export interface OpenAIResponsesToolDefinition {
  type: "function";
  name: string;
  description?: string;
  parameters: Record<string, unknown>;
  strict: boolean;
}

/**
 * Anthropic message format
 */
export interface AnthropicMessage {
  role: "user" | "assistant";
  content:
    | string
    | Array<{
        type: "text" | "image" | "tool_use" | "tool_result";
        text?: string;
        source?: {
          type: "base64";
          media_type: string;
          data: string;
        };
        id?: string;
        name?: string;
        input?: unknown;
        tool_use_id?: string;
        content?:
          | string
          | Array<{
              type: "text" | "image";
              text?: string;
              source?: {
                type: "base64";
                media_type: string;
                data: string;
              };
            }>;
      }>;
}

/**
 * Google message format
 */
export interface GoogleMessage {
  role: "user" | "model";
  parts: Array<{
    text?: string;
    inlineData?: {
      mimeType: string;
      data: string; // base64 encoded
    };
    functionCall?: {
      name: string;
      args: unknown;
    };
    functionResponse?: {
      name: string;
      response: unknown;
    };
  }>;
}

/**
 * Parse a tool result message that may contain MCP-style multimodal content.
 * If the message is a JSON-stringified MCP result with image content parts,
 * returns an array of Anthropic content blocks. Otherwise returns the plain string.
 *
 * MCP format: { content: [{ type: "text", text: "..." }, { type: "image", data: "base64...", mimeType: "image/png" }] }
 */
function parseMultimodalToolResult(message: string):
  | string
  | Array<{
      type: "text" | "image";
      text?: string;
      source?: { type: "base64"; media_type: string; data: string };
    }> {
  try {
    const parsed = JSON.parse(message);

    // Check for MCP content array format
    if (parsed?.content && Array.isArray(parsed.content)) {
      const hasImages = parsed.content.some(
        (item: any) => item.type === "image" && item.data && item.mimeType,
      );

      if (hasImages) {
        // Convert MCP content to Anthropic content blocks
        const blocks: Array<{
          type: "text" | "image";
          text?: string;
          source?: { type: "base64"; media_type: string; data: string };
        }> = [];

        for (const item of parsed.content) {
          if (item.type === "text" && item.text) {
            blocks.push({ type: "text", text: item.text });
          } else if (item.type === "image" && item.data && item.mimeType) {
            blocks.push({
              type: "image",
              source: {
                type: "base64",
                media_type: item.mimeType,
                data: item.data,
              },
            });
          }
        }

        return blocks.length > 0 ? blocks : message;
      }
    }
  } catch {
    // Not valid JSON — return as plain string
  }

  return message;
}

/**
 * Strip image content from an MCP-style tool result, keeping only text.
 * Used for providers that don't support multimodal tool results (OpenAI, Cohere, Mistral, etc.)
 */
function stripImagesToText(message: string): string {
  try {
    const parsed = JSON.parse(message);

    if (parsed?.content && Array.isArray(parsed.content)) {
      const hasImages = parsed.content.some(
        (item: any) => item.type === "image",
      );

      if (hasImages) {
        const textParts: string[] = [];

        for (const item of parsed.content) {
          if (item.type === "text" && item.text) {
            textParts.push(item.text);
          } else if (item.type === "image" && item.mimeType) {
            // Replace image data with a description
            const title = item.title || "image";
            textParts.push(
              `[Generated ${title} (${item.mimeType}) — displayed to user]`,
            );
          }
        }

        return textParts.join("\n");
      }
    }
  } catch {
    // Not valid JSON — return as-is
  }

  return message;
}

/**
 * Parse a tool result message for Bedrock Converse API format.
 * Bedrock supports text and image content in tool results.
 */
function parseBedrockToolResult(message: string): Array<{
  text?: string;
  image?: {
    format: "png" | "jpeg" | "gif" | "webp";
    source: { bytes: string };
  };
}> {
  try {
    const parsed = JSON.parse(message);

    if (parsed?.content && Array.isArray(parsed.content)) {
      const blocks: Array<{
        text?: string;
        image?: {
          format: "png" | "jpeg" | "gif" | "webp";
          source: { bytes: string };
        };
      }> = [];

      for (const item of parsed.content) {
        if (item.type === "text" && item.text) {
          blocks.push({ text: item.text });
        } else if (item.type === "image" && item.data && item.mimeType) {
          const format = item.mimeType.split("/")[1] as
            | "png"
            | "jpeg"
            | "gif"
            | "webp";
          blocks.push({
            image: {
              format,
              source: { bytes: item.data },
            },
          });
        }
      }

      if (blocks.length > 0) return blocks;
    }
  } catch {
    // Not valid JSON
  }

  return [{ text: message }];
}

/**
 * Format GraphQL conversation messages for OpenAI SDK
 */
export function formatMessagesForOpenAI(
  messages: ConversationMessage[],
): OpenAIMessage[] {
  const formattedMessages: OpenAIMessage[] = [];

  for (const message of messages) {
    if (!message.role) {
      continue;
    }

    // Allow messages with tool calls even if they have no text content
    const hasContent = message.message?.trim();
    const hasToolCalls = message.toolCalls && message.toolCalls.length > 0;

    if (!hasContent && !hasToolCalls) {
      continue;
    }

    const trimmedMessage = message.message?.trim() || "";

    switch (message.role) {
      case ConversationRoleTypes.System:
        formattedMessages.push({
          role: "system",
          content: trimmedMessage,
        });
        break;

      case ConversationRoleTypes.Assistant:
        const assistantMessage: OpenAIMessage = {
          role: "assistant",
        };

        // Only add content if there's actual text
        if (trimmedMessage) {
          assistantMessage.content = trimmedMessage;
        }

        // Add tool calls if present
        if (message.toolCalls && message.toolCalls.length > 0) {
          assistantMessage.tool_calls = message.toolCalls
            .filter((tc): tc is ConversationToolCall => tc !== null)
            .map((toolCall) => ({
              id: toolCall.id,
              type: "function" as const,
              function: {
                name: toolCall.name,
                arguments: toolCall.arguments,
              },
            }));
        }

        formattedMessages.push(assistantMessage);
        break;

      case ConversationRoleTypes.Tool:
        formattedMessages.push({
          role: "tool",
          content: stripImagesToText(trimmedMessage),
          tool_call_id: message.toolCallId || "",
        });
        break;

      default: // User messages
        // Check if this message has image data
        if (message.mimeType && message.data) {
          // Multi-modal message with image
          const contentParts: Array<{
            type: "text" | "image_url";
            text?: string;
            image_url?: { url: string };
          }> = [];

          // Add text content if present
          if (trimmedMessage) {
            contentParts.push({
              type: "text",
              text: trimmedMessage,
            });
          }

          // Add image content
          contentParts.push({
            type: "image_url",
            image_url: {
              url: `data:${message.mimeType};base64,${message.data}`,
            },
          });

          formattedMessages.push({
            role: "user",
            content: contentParts,
          });
        } else {
          // Text-only message
          formattedMessages.push({
            role: "user",
            content: trimmedMessage,
          });
        }
        break;
    }
  }

  return formattedMessages;
}

export function extractInstructionsForOpenAIResponses(
  messages: ConversationMessage[],
): string | undefined {
  const systemMessages = messages
    .filter((message) => message.role === ConversationRoleTypes.System)
    .map((message) => message.message?.trim() || "")
    .filter((message) => message.length > 0);

  return systemMessages.length > 0
    ? systemMessages.join("\n\n")
    : undefined;
}

export function formatMessagesForOpenAIResponsesInitialRound(
  messages: ConversationMessage[],
): OpenAIResponsesInputItem[] {
  const formattedMessages: OpenAIResponsesInputItem[] = [];

  for (const message of messages) {
    if (!message.role || message.role === ConversationRoleTypes.System) {
      continue;
    }

    const trimmedMessage = message.message?.trim() || "";
    const hasToolCalls = !!message.toolCalls?.length;

    if (!trimmedMessage && !hasToolCalls) {
      continue;
    }

    switch (message.role) {
      case ConversationRoleTypes.Assistant: {
        // GPT-5.4: set phase on assistant messages to avoid early stopping.
        // "commentary" for preambles before tool calls, "final_answer" for completed answers.
        const phase = hasToolCalls ? "commentary" : "final_answer";

        if (trimmedMessage) {
          formattedMessages.push({
            type: "message",
            role: "assistant",
            content: trimmedMessage,
            phase,
          });
        }

        if (message.toolCalls?.length) {
          for (const toolCall of message.toolCalls) {
            if (!toolCall) {
              continue;
            }

            formattedMessages.push({
              type: "function_call",
              id: toolCall.id,
              call_id: toolCall.id,
              name: toolCall.name,
              arguments: toolCall.arguments,
            });
          }
        }
        break;
      }

      case ConversationRoleTypes.Tool: {
        if (!message.toolCallId) {
          continue;
        }

        formattedMessages.push({
          type: "function_call_output",
          call_id: message.toolCallId,
          output: stripImagesToText(trimmedMessage),
        });
        break;
      }

      default: {
        if (message.mimeType && message.data) {
          const contentParts: OpenAIResponsesContentPart[] = [];

          if (trimmedMessage) {
            contentParts.push({
              type: "input_text",
              text: trimmedMessage,
            });
          }

          contentParts.push({
            type: "input_image",
            image_url: `data:${message.mimeType};base64,${message.data}`,
            detail: "auto",
          });

          formattedMessages.push({
            type: "message",
            role: "user",
            content: contentParts,
          });
        } else {
          formattedMessages.push({
            type: "message",
            role: "user",
            content: trimmedMessage,
          });
        }
        break;
      }
    }
  }

  return formattedMessages;
}

export function buildResponsesFunctionCallOutputItems(
  toolMessages: ConversationMessage[],
): OpenAIResponsesFunctionCallOutputItem[] {
  return toolMessages
    .filter(
      (message) =>
        message.role === ConversationRoleTypes.Tool &&
        typeof message.toolCallId === "string" &&
        message.toolCallId.length > 0,
    )
    .map((message) => ({
      type: "function_call_output" as const,
      call_id: message.toolCallId!,
      output: stripImagesToText(message.message?.trim() || ""),
    }));
}

export const buildOpenAIResponsesFunctionCallOutputItems =
  buildResponsesFunctionCallOutputItems;

export function formatToolsForOpenAIResponses(
  tools: Array<{ name: string; description?: string | null; schema?: string | null }> | undefined,
  strict?: boolean,
): OpenAIResponsesToolDefinition[] | undefined {
  if (!tools?.length) {
    return undefined;
  }

  return tools.map((tool) => {
    let parameters: Record<string, unknown> = {};

    if (tool.schema) {
      try {
        parameters = JSON.parse(tool.schema) as Record<string, unknown>;
      } catch {
        parameters = {};
      }
    }

    return {
      type: "function" as const,
      name: tool.name,
      description: tool.description || undefined,
      parameters,
      strict: strict ?? false,
    };
  });
}

/**
 * Format GraphQL conversation messages for Anthropic SDK
 */
export function formatMessagesForAnthropic(messages: ConversationMessage[]): {
  system?: string;
  messages: AnthropicMessage[];
} {
  let systemPrompt: string | undefined;
  const formattedMessages: AnthropicMessage[] = [];

  for (const message of messages) {
    if (!message.role) continue;

    // Allow messages with tool calls even if they have no text content
    const hasContent = message.message?.trim();
    const hasToolCalls = message.toolCalls && message.toolCalls.length > 0;

    if (!hasContent && !hasToolCalls) continue;

    const trimmedMessage = message.message?.trim() || "";

    switch (message.role) {
      case ConversationRoleTypes.System:
        systemPrompt = trimmedMessage;
        break;

      case ConversationRoleTypes.Assistant:
        const content: any[] = [];

        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
          console.log(
            `🔍 [formatMessagesForAnthropic] Processing assistant message: "${trimmedMessage.substring(0, 200)}..."`,
          );
          console.log(
            `🔍 [formatMessagesForAnthropic] Has tool calls: ${message.toolCalls?.length || 0}`,
          );
        }

        // Prefer structured thinking fields (from new schema or in-memory messages)
        // Fall back to XML parsing for old conversations stored with <thinking> tags
        const structuredThinking = message.thinkingContent;
        const structuredSignature = message.thinkingSignature;
        const hasStructuredThinking = !!structuredThinking?.trim();
        const hasXmlThinking =
          !hasStructuredThinking && trimmedMessage.includes("<thinking");

        if (hasStructuredThinking && structuredThinking) {
          // Use structured fields directly (clean separation, no XML parsing needed)
          if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
            console.log(
              `🔍 [formatMessagesForAnthropic] Using structured thinking: ${structuredThinking.length} chars, signature: ${structuredSignature?.length || 0}`,
            );
          }

          // Only include thinking block if we have a signature — Anthropic API
          // requires signature on all thinking blocks in conversation history.
          // Thinking from other providers (Google, Deepseek) won't have a signature,
          // so we skip the thinking block entirely to avoid a 400 error.
          if (structuredSignature) {
            content.push({
              type: "thinking",
              thinking: structuredThinking.trim(),
              signature: structuredSignature,
            });
          }

          // Add text content after thinking block
          if (trimmedMessage) {
            content.push({
              type: "text",
              text: trimmedMessage,
            });
          }
        } else if (hasXmlThinking) {
          // Fallback: parse <thinking> XML from old conversations
          const thinkingMatch = trimmedMessage.match(
            /<thinking(?:\s+signature="([^"]*)")?\s*>(.*?)<\/thinking>/s,
          );
          const thinkingSignature = thinkingMatch ? thinkingMatch[1] : "";
          const thinkingContent = thinkingMatch ? thinkingMatch[2].trim() : "";
          const textContent = trimmedMessage
            .replace(
              /<thinking(?:\s+signature="[^"]*")?\s*>.*?<\/thinking>/s,
              "",
            )
            .trim();

          if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
            console.log(
              `🔍 [formatMessagesForAnthropic] XML fallback - thinking: ${thinkingContent.length} chars, signature: "${thinkingSignature}"`,
            );
          }

          // CRITICAL: When thinking is enabled, thinking block must come first.
          // Only include if we have a signature — Anthropic API requires it.
          if (thinkingContent && thinkingSignature) {
            content.push({
              type: "thinking",
              thinking: thinkingContent,
              signature: thinkingSignature,
            });
          }

          // Add text content after thinking block
          if (textContent) {
            content.push({
              type: "text",
              text: textContent,
            });
          }
        } else if (trimmedMessage) {
          // Regular text content — no thinking detected
          if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
            console.log(
              `🔍 [formatMessagesForAnthropic] No thinking found, adding text content`,
            );
          }
          content.push({
            type: "text",
            text: trimmedMessage,
          });
        }

        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
          console.log(
            `🔍 [formatMessagesForAnthropic] Content array: ${content.map((c) => c.type).join(", ")}`,
          );
        }

        // Add tool uses if present
        if (message.toolCalls && message.toolCalls.length > 0) {
          for (const toolCall of message.toolCalls) {
            if (toolCall) {
              content.push({
                type: "tool_use",
                id: toolCall.id,
                name: toolCall.name,
                input: toolCall.arguments ? JSON.parse(toolCall.arguments) : {},
              });
            }
          }
        }

        formattedMessages.push({
          role: "assistant",
          content,
        });
        break;

      case ConversationRoleTypes.Tool:
        // Anthropic expects tool responses as user messages with tool_result content blocks
        // Check if the message contains MCP-style multimodal content (e.g., images from code execution)
        const toolResultContent = parseMultimodalToolResult(trimmedMessage);

        formattedMessages.push({
          role: "user",
          content: [
            {
              type: "tool_result",
              tool_use_id: message.toolCallId || "",
              content: toolResultContent,
            },
          ],
        });
        break;

      default: // User messages
        // Check if this message has image data
        if (message.mimeType && message.data) {
          // Multi-modal message with image
          const contentParts: Array<{
            type: "text" | "image" | "tool_use" | "tool_result";
            text?: string;
            source?: {
              type: "base64";
              media_type: string;
              data: string;
            };
          }> = [];

          // Add text content if present
          if (trimmedMessage) {
            contentParts.push({
              type: "text",
              text: trimmedMessage,
            });
          }

          // Add image content
          contentParts.push({
            type: "image",
            source: {
              type: "base64",
              media_type: message.mimeType,
              data: message.data,
            },
          });

          formattedMessages.push({
            role: "user",
            content: contentParts,
          });
        } else {
          // Text-only message
          formattedMessages.push({
            role: "user",
            content: trimmedMessage,
          });
        }
        break;
    }
  }

  const result = { system: systemPrompt, messages: formattedMessages };
  return result;
}

/**
 * Format GraphQL conversation messages for Google SDK
 */
export function formatMessagesForGoogle(
  messages: ConversationMessage[],
): GoogleMessage[] {
  const formattedMessages: GoogleMessage[] = [];

  for (const message of messages) {
    if (!message.role) continue;

    // Allow messages with image data even if they have no text content
    const hasContent = message.message?.trim();
    const hasImageData = message.mimeType && message.data;

    if (!hasContent && !hasImageData) continue;

    const trimmedMessage = message.message?.trim() || "";

    switch (message.role) {
      case ConversationRoleTypes.System:
        // Google handles system prompts differently, usually as part of the first user message
        formattedMessages.push({
          role: "user",
          parts: [{ text: trimmedMessage }],
        });
        break;

      case ConversationRoleTypes.Assistant:
        const parts: GoogleMessage["parts"] = [];

        // Add text content
        if (trimmedMessage) {
          parts.push({ text: trimmedMessage });
        }

        // Add function calls if present
        if (message.toolCalls && message.toolCalls.length > 0) {
          for (const toolCall of message.toolCalls) {
            if (toolCall) {
              parts.push({
                functionCall: {
                  name: toolCall.name,
                  args: toolCall.arguments
                    ? JSON.parse(toolCall.arguments)
                    : {},
                },
              });
            }
          }
        }

        formattedMessages.push({
          role: "model",
          parts,
        });
        break;

      case ConversationRoleTypes.Tool: {
        // Google Gemini: tool results are user messages with functionResponse parts
        // Google doesn't support images in function responses, so strip to text
        const googleToolContent = stripImagesToText(trimmedMessage);

        formattedMessages.push({
          role: "user",
          parts: [
            {
              functionResponse: {
                name: (message as any).toolName || "unknown",
                response: { result: googleToolContent },
              },
            },
          ],
        });
        break;
      }

      default: // User messages
        // Check if this message has image data
        if (message.mimeType && message.data) {
          // Multi-modal message with image
          const parts: GoogleMessage["parts"] = [];

          // Add text content if present
          if (trimmedMessage) {
            parts.push({ text: trimmedMessage });
          }

          // Add image content
          parts.push({
            inlineData: {
              mimeType: message.mimeType,
              data: message.data,
            },
          });

          formattedMessages.push({
            role: "user",
            parts,
          });
        } else {
          // Text-only message
          formattedMessages.push({
            role: "user",
            parts: [{ text: trimmedMessage }],
          });
        }
        break;
    }
  }

  return formattedMessages;
}

/**
 * Cohere message format
 * Note: For Cohere v7 SDK, messages are handled differently:
 * - Current message is passed as 'message' parameter
 * - Previous messages are passed as 'chatHistory' array
 */
export interface CohereMessage {
  role: "USER" | "CHATBOT" | "SYSTEM" | "TOOL";
  message: string;
  tool_calls?: Array<{
    id: string;
    name: string;
    parameters: Record<string, any>;
  }>;
  tool_results?: Array<{
    call: {
      name: string;
      parameters: Record<string, any>;
    };
    outputs: Array<{
      output: string;
    }>;
  }>;
}

/**
 * Format GraphQL conversation messages for Cohere SDK
 */
export function formatMessagesForCohere(
  messages: ConversationMessage[],
): CohereMessage[] {
  const formattedMessages: CohereMessage[] = [];

  for (const message of messages) {
    if (!message.role) continue;

    // Allow messages with tool calls even if they have no text content
    const hasContent = message.message?.trim();
    const hasToolCalls = message.toolCalls && message.toolCalls.length > 0;

    if (!hasContent && !hasToolCalls) continue;

    const trimmedMessage = message.message?.trim() || "";

    switch (message.role) {
      case ConversationRoleTypes.System:
        formattedMessages.push({
          role: "SYSTEM",
          message: trimmedMessage,
        });
        break;

      case ConversationRoleTypes.Assistant:
        const assistantMessage: CohereMessage = {
          role: "CHATBOT",
          message: trimmedMessage,
        };

        // Add tool calls if present
        if (message.toolCalls && message.toolCalls.length > 0) {
          assistantMessage.tool_calls = message.toolCalls
            .filter((tc): tc is ConversationToolCall => tc !== null)
            .map((toolCall) => ({
              id: toolCall.id,
              name: toolCall.name,
              parameters: toolCall.arguments
                ? JSON.parse(toolCall.arguments)
                : {},
            }));
        }

        formattedMessages.push(assistantMessage);
        break;

      case ConversationRoleTypes.Tool: {
        // Cohere expects tool results as TOOL messages
        const cohereToolContent = stripImagesToText(trimmedMessage);
        formattedMessages.push({
          role: "TOOL",
          message: cohereToolContent,
          tool_results: [
            {
              call: {
                name: "", // Would need to be tracked from the tool call
                parameters: {},
              },
              outputs: [
                {
                  output: cohereToolContent, // Changed from 'text' to 'output'
                },
              ],
            },
          ],
        });
        break;
      }

      default: // User messages
        formattedMessages.push({
          role: "USER",
          message: trimmedMessage,
        });
        break;
    }
  }

  return formattedMessages;
}

/**
 * Mistral message format
 */
export interface MistralMessage {
  role: "system" | "user" | "assistant" | "tool";
  content:
    | string
    | Array<{
        type: "text" | "image_url";
        text?: string;
        image_url?: string;
      }>;
  tool_calls?: Array<{
    id: string;
    function: {
      name: string;
      arguments: string;
    };
  }>;
  tool_call_id?: string;
}

/**
 * Format GraphQL conversation messages for Mistral SDK
 */
export function formatMessagesForMistral(
  messages: ConversationMessage[],
): MistralMessage[] {
  if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
    console.log(`[Mistral Formatter] Input: ${messages.length} messages`);
    messages.forEach((msg, idx) => {
      console.log(
        `  Input ${idx}: role=${msg.role}, hasToolCalls=${!!msg.toolCalls}, toolCallId=${msg.toolCallId}`,
      );
    });
  }

  const formattedMessages: MistralMessage[] = [];

  for (const message of messages) {
    if (!message.role) continue;

    const hasContent = message.message?.trim();
    const hasToolCalls = message.toolCalls && message.toolCalls.length > 0;

    if (!hasContent && !hasToolCalls) continue;

    const trimmedMessage = message.message?.trim() || "";

    switch (message.role) {
      case ConversationRoleTypes.System:
        formattedMessages.push({
          role: "system",
          content: trimmedMessage,
        });
        break;

      case ConversationRoleTypes.Assistant:
        const assistantMessage: MistralMessage = {
          role: "assistant",
          content: trimmedMessage || "", // Mistral expects string, not null
        };

        // Add tool calls if present
        if (message.toolCalls && message.toolCalls.length > 0) {
          assistantMessage.tool_calls = message.toolCalls
            .filter((tc): tc is ConversationToolCall => tc !== null)
            .map((toolCall) => ({
              id: toolCall.id,
              type: "function",
              function: {
                name: toolCall.name,
                arguments: toolCall.arguments,
              },
            }));
        }

        formattedMessages.push(assistantMessage);
        break;

      case ConversationRoleTypes.Tool:
        if (!message.toolCallId) {
          console.warn(`[Mistral] Tool message missing toolCallId, skipping`);
          break;
        }
        // Mistral expects tool_call_id (snake_case) and a name field
        formattedMessages.push({
          role: "tool",
          name: (message as any).toolName || "unknown", // Access toolName from extended message
          content: stripImagesToText(trimmedMessage),
          tool_call_id: message.toolCallId, // Mistral uses snake_case!
        } as any);
        break;

      default: // User messages
        // Check if this message has image data
        if (message.mimeType && message.data) {
          // Multi-modal message with image
          const contentParts: Array<{
            type: "text" | "image_url";
            text?: string;
            image_url?: string;
          }> = [];

          // Add text content if present
          if (trimmedMessage) {
            contentParts.push({
              type: "text",
              text: trimmedMessage,
            });
          }

          // Add image content
          contentParts.push({
            type: "image_url",
            image_url: `data:${message.mimeType};base64,${message.data}`,
          });

          formattedMessages.push({
            role: "user",
            content: contentParts,
          });
        } else {
          // Text-only message
          formattedMessages.push({
            role: "user",
            content: trimmedMessage,
          });
        }
        break;
    }
  }

  if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
    console.log(
      `[Mistral Formatter] Output: ${formattedMessages.length} messages`,
    );
    formattedMessages.forEach((msg, idx) => {
      const msgWithTools = msg as MistralMessage & {
        tool_calls?: any[];
        tool_call_id?: string;
      };
      console.log(
        `  Output ${idx}: role=${msg.role}, hasToolCalls=${!!msgWithTools.tool_calls}, toolCallId=${msgWithTools.tool_call_id}`,
      );
      if (msgWithTools.tool_calls) {
        console.log(
          `    Tool calls: ${JSON.stringify(msgWithTools.tool_calls)}`,
        );
      }
    });
  }

  return formattedMessages;
}

/**
 * Bedrock Claude message format (Converse API)
 */
export interface BedrockMessage {
  role: "user" | "assistant";
  content:
    | string
    | Array<{
        type?: "text" | "image";
        text?: string;
        image?: {
          format: "png" | "jpeg" | "gif" | "webp";
          source: {
            bytes: string; // base64
          };
        };
        toolUse?: {
          toolUseId: string;
          name: string;
          input: unknown;
        };
        toolResult?: {
          toolUseId: string;
          content: Array<{
            text?: string;
            image?: {
              format: "png" | "jpeg" | "gif" | "webp";
              source: { bytes: string };
            };
          }>;
        };
      }>;
}

/**
 * Format GraphQL conversation messages for Bedrock SDK (Claude models)
 */
export function formatMessagesForBedrock(messages: ConversationMessage[]): {
  system?: string;
  messages: BedrockMessage[];
} {
  let systemPrompt: string | undefined;
  const formattedMessages: BedrockMessage[] = [];

  for (const message of messages) {
    if (!message.role || !message.message?.trim()) continue;

    const trimmedMessage = message.message.trim();

    switch (message.role) {
      case ConversationRoleTypes.System:
        systemPrompt = trimmedMessage;
        break;

      case ConversationRoleTypes.Assistant: {
        // Build content array for assistant messages
        const assistantContent: BedrockMessage["content"] = [];

        if (trimmedMessage) {
          assistantContent.push({ text: trimmedMessage });
        }

        // Add tool use blocks if present
        if (message.toolCalls && message.toolCalls.length > 0) {
          for (const toolCall of message.toolCalls) {
            if (toolCall) {
              assistantContent.push({
                toolUse: {
                  toolUseId: toolCall.id,
                  name: toolCall.name,
                  input: toolCall.arguments
                    ? JSON.parse(toolCall.arguments)
                    : {},
                },
              });
            }
          }
        }

        formattedMessages.push({
          role: "assistant",
          content:
            assistantContent.length > 0 ? assistantContent : trimmedMessage,
        });
        break;
      }

      case ConversationRoleTypes.Tool: {
        // Bedrock Converse API: tool results are user messages with toolResult blocks
        // Bedrock Claude supports images in tool results
        const bedrockToolContent = parseBedrockToolResult(trimmedMessage);

        formattedMessages.push({
          role: "user",
          content: [
            {
              toolResult: {
                toolUseId: message.toolCallId || "",
                content: bedrockToolContent,
              },
            },
          ],
        });
        break;
      }

      default: // User messages
        // Check if this message has image data
        if (message.mimeType && message.data) {
          // Multi-modal message with image
          const contentParts: BedrockMessage["content"] = [];

          // Add text content if present
          if (trimmedMessage) {
            contentParts.push({
              text: trimmedMessage,
            });
          }

          // Add image content
          const format = message.mimeType.split("/")[1] as
            | "png"
            | "jpeg"
            | "gif"
            | "webp";
          contentParts.push({
            image: {
              format,
              source: {
                bytes: message.data,
              },
            },
          });

          formattedMessages.push({
            role: "user",
            content: contentParts,
          });
        } else {
          // Text-only message
          formattedMessages.push({
            role: "user",
            content: trimmedMessage,
          });
        }
        break;
    }
  }

  return { system: systemPrompt, messages: formattedMessages };
}

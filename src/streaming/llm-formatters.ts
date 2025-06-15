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
        content?: string;
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
          content: trimmedMessage,
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
        const content: AnthropicMessage["content"] = [];

        // Add text content
        if (trimmedMessage) {
          content.push({
            type: "text",
            text: trimmedMessage,
          });
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
        formattedMessages.push({
          role: "user",
          content: [
            {
              type: "tool_result",
              tool_use_id: message.toolCallId || "",
              content: trimmedMessage,
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
 */
export interface CohereMessage {
  role: "USER" | "CHATBOT" | "SYSTEM";
  message: string;
}

/**
 * Format GraphQL conversation messages for Cohere SDK
 */
export function formatMessagesForCohere(
  messages: ConversationMessage[],
): CohereMessage[] {
  const formattedMessages: CohereMessage[] = [];

  for (const message of messages) {
    if (!message.role || !message.message?.trim()) continue;

    const trimmedMessage = message.message.trim();

    switch (message.role) {
      case ConversationRoleTypes.System:
        formattedMessages.push({
          role: "SYSTEM",
          message: trimmedMessage,
        });
        break;

      case ConversationRoleTypes.Assistant:
        formattedMessages.push({
          role: "CHATBOT",
          message: trimmedMessage,
        });
        break;

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
          content: trimmedMessage,
        };

        // Add tool calls if present
        if (message.toolCalls && message.toolCalls.length > 0) {
          assistantMessage.tool_calls = message.toolCalls
            .filter((tc): tc is ConversationToolCall => tc !== null)
            .map((toolCall) => ({
              id: toolCall.id,
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
          content: trimmedMessage,
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

  return formattedMessages;
}

/**
 * Bedrock Claude message format (similar to Anthropic)
 */
export interface BedrockMessage {
  role: "user" | "assistant";
  content:
    | string
    | Array<{
        type: "text" | "image";
        text?: string;
        image?: {
          format: "png" | "jpeg" | "gif" | "webp";
          source: {
            bytes: string; // base64
          };
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

      case ConversationRoleTypes.Assistant:
        formattedMessages.push({
          role: "assistant",
          content: trimmedMessage,
        });
        break;

      default: // User messages
        // Check if this message has image data
        if (message.mimeType && message.data) {
          // Multi-modal message with image
          const contentParts: Array<{
            type: "text" | "image";
            text?: string;
            image?: {
              format: "png" | "jpeg" | "gif" | "webp";
              source: {
                bytes: string;
              };
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
          const format = message.mimeType.split("/")[1] as
            | "png"
            | "jpeg"
            | "gif"
            | "webp";
          contentParts.push({
            type: "image",
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
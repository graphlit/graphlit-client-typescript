import { ConversationMessage, ConversationRoleTypes, ConversationToolCall } from "../generated/graphql-types.js";

/**
 * OpenAI message format
 */
export interface OpenAIMessage {
  role: "system" | "user" | "assistant" | "tool";
  content?: string;
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
  content: string | Array<{
    type: "text" | "tool_use" | "tool_result";
    text?: string;
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
export function formatMessagesForOpenAI(messages: ConversationMessage[]): OpenAIMessage[] {
  const formattedMessages: OpenAIMessage[] = [];

  for (const message of messages) {
    if (!message.role || !message.message) continue;

    switch (message.role) {
      case ConversationRoleTypes.System:
        formattedMessages.push({
          role: "system",
          content: message.message
        });
        break;

      case ConversationRoleTypes.Assistant:
        const assistantMessage: OpenAIMessage = {
          role: "assistant",
          content: message.message
        };

        // Add tool calls if present
        if (message.toolCalls && message.toolCalls.length > 0) {
          assistantMessage.tool_calls = message.toolCalls
            .filter((tc): tc is ConversationToolCall => tc !== null)
            .map(toolCall => ({
              id: toolCall.id,
              type: "function" as const,
              function: {
                name: toolCall.name,
                arguments: toolCall.arguments
              }
            }));
        }

        formattedMessages.push(assistantMessage);
        break;

      default: // User messages
        formattedMessages.push({
          role: "user",
          content: message.message
        });
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
  messages: AnthropicMessage[] 
} {
  let systemPrompt: string | undefined;
  const formattedMessages: AnthropicMessage[] = [];

  for (const message of messages) {
    if (!message.role || !message.message) continue;

    switch (message.role) {
      case ConversationRoleTypes.System:
        systemPrompt = message.message;
        break;

      case ConversationRoleTypes.Assistant:
        const content: AnthropicMessage["content"] = [];

        // Add text content
        if (message.message) {
          content.push({
            type: "text",
            text: message.message
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
                input: toolCall.arguments ? JSON.parse(toolCall.arguments) : {}
              });
            }
          }
        }

        formattedMessages.push({
          role: "assistant",
          content
        });
        break;

      default: // User messages
        formattedMessages.push({
          role: "user",
          content: message.message
        });
        break;
    }
  }

  return { system: systemPrompt, messages: formattedMessages };
}

/**
 * Format GraphQL conversation messages for Google SDK
 */
export function formatMessagesForGoogle(messages: ConversationMessage[]): GoogleMessage[] {
  const formattedMessages: GoogleMessage[] = [];

  for (const message of messages) {
    if (!message.role || !message.message) continue;

    switch (message.role) {
      case ConversationRoleTypes.System:
        // Google handles system prompts differently, usually as part of the first user message
        formattedMessages.push({
          role: "user",
          parts: [{ text: message.message }]
        });
        break;

      case ConversationRoleTypes.Assistant:
        const parts: GoogleMessage["parts"] = [];

        // Add text content
        if (message.message) {
          parts.push({ text: message.message });
        }

        // Add function calls if present
        if (message.toolCalls && message.toolCalls.length > 0) {
          for (const toolCall of message.toolCalls) {
            if (toolCall) {
              parts.push({
                functionCall: {
                  name: toolCall.name,
                  args: toolCall.arguments ? JSON.parse(toolCall.arguments) : {}
                }
              });
            }
          }
        }

        formattedMessages.push({
          role: "model",
          parts
        });
        break;

      default: // User messages
        formattedMessages.push({
          role: "user",
          parts: [{ text: message.message }]
        });
        break;
    }
  }

  return formattedMessages;
}
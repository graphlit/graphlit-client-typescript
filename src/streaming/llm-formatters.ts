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
  content:
    | string
    | Array<{
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
export function formatMessagesForOpenAI(
  messages: ConversationMessage[]
): OpenAIMessage[] {
  const formattedMessages: OpenAIMessage[] = [];

  console.log(
    `🔍 formatMessagesForOpenAI: Processing ${messages.length} messages`
  );

  for (const message of messages) {
    if (!message.role) {
      console.log(`🔍 formatMessagesForOpenAI: Invalid message role, skipping`);
      continue;
    }

    // Allow messages with tool calls even if they have no text content
    const hasContent = message.message?.trim();
    const hasToolCalls = message.toolCalls && message.toolCalls.length > 0;

    if (!hasContent && !hasToolCalls) {
      console.log(
        `🔍 formatMessagesForOpenAI: Invalid message, no content and no tool calls, skipping`
      );
      continue;
    }

    const trimmedMessage = message.message?.trim() || "";
    console.log(
      `  📝 Message role: ${message.role}, hasContent: ${!!hasContent}, hasToolCalls: ${hasToolCalls}, toolCallId: ${message.toolCallId || "none"}`
    );

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
        formattedMessages.push({
          role: "user",
          content: trimmedMessage,
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
  messages: AnthropicMessage[];
} {
  let systemPrompt: string | undefined;
  const formattedMessages: AnthropicMessage[] = [];

  console.log(
    `🔍 formatMessagesForAnthropic: Processing ${messages.length} messages`
  );

  for (const message of messages) {
    if (!message.role) continue;

    // Allow messages with tool calls even if they have no text content
    const hasContent = message.message?.trim();
    const hasToolCalls = message.toolCalls && message.toolCalls.length > 0;

    if (!hasContent && !hasToolCalls) continue;

    const trimmedMessage = message.message?.trim() || "";
    console.log(
      `  📝 Message role: ${message.role}, hasContent: ${!!hasContent}, hasToolCalls: ${hasToolCalls}, length: ${trimmedMessage.length}`
    );

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
        formattedMessages.push({
          role: "user",
          content: trimmedMessage,
        });
        break;
    }
  }

  const result = { system: systemPrompt, messages: formattedMessages };
  console.log(
    `  ✅ Formatted ${formattedMessages.length} messages for Anthropic`
  );
  if (systemPrompt) {
    console.log(`  📋 System prompt length: ${systemPrompt.length}`);
  }
  return result;
}

/**
 * Format GraphQL conversation messages for Google SDK
 */
export function formatMessagesForGoogle(
  messages: ConversationMessage[]
): GoogleMessage[] {
  const formattedMessages: GoogleMessage[] = [];

  for (const message of messages) {
    if (!message.role || !message.message?.trim()) continue;

    const trimmedMessage = message.message.trim();

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
        formattedMessages.push({
          role: "user",
          parts: [{ text: trimmedMessage }],
        });
        break;
    }
  }

  return formattedMessages;
}

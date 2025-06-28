# Reasoning/Thinking Support & Stream Cancellation

This document describes the reasoning/thinking detection and stream cancellation features available in the Graphlit TypeScript SDK.

## Reasoning/Thinking Support

The Graphlit SDK can detect and expose reasoning/thinking content from AI models that support it, allowing applications to show users how the AI "thinks" through problems.

### Supported Models and Formats

| Provider      | Models                       | Format         | Description                                                |
| ------------- | ---------------------------- | -------------- | ---------------------------------------------------------- |
| **Bedrock**   | Nova Premier                 | `thinking_tag` | Detects `<thinking>` tags in model output                  |
| **Deepseek**  | Chat, Reasoner               | `markdown`     | Detects markdown-formatted reasoning (e.g., `**Step 1:**`) |
| **Anthropic** | Claude (with special access) | `thinking_tag` | Supports thinking blocks when enabled                      |
| **Others**    | Custom patterns              | `custom`       | Extensible for custom reasoning patterns                   |

### Reasoning Event Types

The SDK emits special events when reasoning content is detected:

```typescript
export type AgentStreamEvent =
  // ... other events
  {
    type: "reasoning_update";
    content: string; // Accumulated reasoning content
    format: ReasoningFormat; // "thinking_tag", "markdown", or "custom"
    isComplete: boolean; // True when reasoning is finished
  };

export type ReasoningFormat = "thinking_tag" | "markdown" | "custom";
```

### Usage Example

```typescript
import { Graphlit } from "graphlit-client";
import * as Types from "graphlit-client/generated/graphql-types";

const client = new Graphlit(orgId, envId, secret);

// Create a specification with a reasoning-capable model
const spec = await client.createSpecification({
  name: "Reasoning Model",
  serviceType: Types.ModelServiceTypes.Bedrock,
  bedrock: {
    model: Types.BedrockModels.NovaPremier,
    temperature: 0.7,
  },
});

// Stream with reasoning detection
await client.streamAgent(
  "What is 25% of 80? Think step by step.",
  (event) => {
    switch (event.type) {
      case "reasoning_update":
        console.log(
          `🤔 [${event.format}] ${event.isComplete ? "Final" : "Partial"} reasoning:`,
        );
        console.log(event.content);
        break;

      case "message_update":
        console.log("💬 Answer:", event.message.message);
        break;

      case "conversation_completed":
        console.log("✅ Complete:", event.message.message);
        break;
    }
  },
  undefined,
  { id: spec.createSpecification!.id },
);
```

### Provider-Specific Behavior

#### Bedrock Nova Premier

- Automatically detects `<thinking>` tags
- Thinking content is **removed** from the main message
- Emits `reasoning_update` events with `format: "thinking_tag"`

#### Deepseek Models

- Detects markdown patterns like:
  - `🤔 Reasoning:`
  - `**Step 1:**`, `**Step 2:**`, etc.
  - `**Reasoning:**`, `**Analysis:**`
  - `**Thought 1:**`, `**Consideration:**`
- Reasoning content is **separated** from the main message
- Emits `reasoning_update` events with `format: "markdown"`

#### Anthropic Claude

- Supports `thinking_delta` events (requires special API access)
- Most users won't see thinking content due to API restrictions
- When available, emits `reasoning_update` events with `format: "thinking_tag"`

### Reasoning Content Handling

- **Separation**: Reasoning content is automatically separated from the final answer
- **Streaming**: Reasoning is streamed as it's generated (incremental updates)
- **Completion**: The `isComplete: true` event contains the full reasoning text
- **Format Detection**: Each provider's format is automatically detected

## Stream Cancellation

The SDK supports cancelling streaming operations using the standard Web API `AbortController`.

### Basic Usage

```typescript
const controller = new AbortController();

// Set up cancellation (e.g., on a "Stop" button)
document.getElementById("stop-button").onclick = () => {
  controller.abort();
};

try {
  await client.streamAgent(
    "Write a long essay about AI...",
    (event) => {
      console.log("Stream event:", event.type);
    },
    undefined,
    specification,
    tools,
    toolHandlers,
    { abortSignal: controller.signal }, // Pass the abort signal
  );
} catch (error) {
  if (controller.signal.aborted) {
    console.log("Stream was cancelled by user");
  } else {
    console.error("Stream error:", error);
  }
}
```

### Cancellation Features

- **Immediate**: Streams are cancelled as soon as possible
- **Provider-Level**: Cancellation is passed down to the AI provider SDKs
- **Tool Interruption**: Tool execution can be cancelled between rounds
- **Clean Cleanup**: Resources are properly cleaned up on cancellation

### Supported Providers

All streaming providers support cancellation:

| Provider  | SDK Support | Implementation                         |
| --------- | ----------- | -------------------------------------- |
| OpenAI    | ✅ Native   | `signal` parameter                     |
| Anthropic | ✅ Native   | `signal` parameter                     |
| Google    | ✅ Native   | SDK-specific                           |
| Groq      | ✅ Native   | `signal` parameter (OpenAI-compatible) |
| Cerebras  | ✅ Native   | `signal` parameter (OpenAI-compatible) |
| Deepseek  | ✅ Native   | `signal` parameter (OpenAI-compatible) |
| Cohere    | ✅ Native   | `signal` parameter                     |
| Mistral   | ✅ Native   | `signal` parameter                     |
| Bedrock   | ✅ Native   | `abortSignal` parameter                |

### Advanced Cancellation

#### Pre-cancelled Signals

```typescript
const controller = new AbortController();
controller.abort(); // Cancel before starting

try {
  await client.streamAgent(/* ... */, { abortSignal: controller.signal });
} catch (error) {
  // Will immediately throw with cancellation error
}
```

#### Timeout-based Cancellation

```typescript
const controller = new AbortController();

// Auto-cancel after 30 seconds
setTimeout(() => controller.abort(), 30000);

await client.streamAgent(/* ... */, { abortSignal: controller.signal });
```

#### Multiple Stream Cancellation

```typescript
const controller = new AbortController();

// Start multiple streams with same controller
const streams = [
  client.streamAgent(
    "Query 1",
    handler1,
    undefined,
    spec1,
    undefined,
    undefined,
    { abortSignal: controller.signal },
  ),
  client.streamAgent(
    "Query 2",
    handler2,
    undefined,
    spec2,
    undefined,
    undefined,
    { abortSignal: controller.signal },
  ),
  client.streamAgent(
    "Query 3",
    handler3,
    undefined,
    spec3,
    undefined,
    undefined,
    { abortSignal: controller.signal },
  ),
];

// Cancel all streams at once
controller.abort();

await Promise.allSettled(streams);
```

## Best Practices

### Reasoning Detection

1. **UI Separation**: Display reasoning content separately from the final answer
2. **Progressive Disclosure**: Allow users to expand/collapse reasoning sections
3. **Format Awareness**: Handle different reasoning formats appropriately
4. **Performance**: Reasoning detection adds minimal overhead (<5%)

### Stream Cancellation

1. **User Feedback**: Provide clear UI feedback when cancellation is in progress
2. **Error Handling**: Always catch and handle cancellation errors appropriately
3. **Cleanup**: Ensure UI state is properly reset after cancellation
4. **Timeouts**: Consider automatic timeouts for long-running streams

### Combined Usage

```typescript
const controller = new AbortController();
const reasoningSteps: string[] = [];

await client.streamAgent(
  "Solve this complex problem step by step...",
  (event) => {
    if (controller.signal.aborted) return; // Early exit

    switch (event.type) {
      case "reasoning_update":
        reasoningSteps.push(event.content);
        updateReasoningUI(reasoningSteps);
        break;

      case "message_update":
        updateAnswerUI(event.message.message);
        break;
    }
  },
  undefined,
  specification,
  tools,
  toolHandlers,
  { abortSignal: controller.signal },
);
```

## Troubleshooting

### Reasoning Not Detected

- **Check Model Support**: Ensure the model supports reasoning (see table above)
- **Check Content**: Some models only show reasoning for complex queries
- **Debug Events**: Log all events to see what's being emitted

### Cancellation Not Working

- **Check Signal**: Ensure `abortSignal` is passed correctly
- **Provider Support**: Verify the provider supports cancellation
- **Error Handling**: Make sure you're catching cancellation errors

### Performance Issues

- **Reasoning Overhead**: Reasoning detection adds <5% overhead
- **Event Frequency**: Consider throttling UI updates for high-frequency events
- **Memory Usage**: Clear reasoning history for long conversations

## Migration Guide

### From Previous Versions

If you're upgrading from a version without reasoning support:

1. **No Breaking Changes**: Reasoning events are additive
2. **Optional Handling**: You can ignore reasoning events if not needed
3. **Existing Code**: All existing streaming code continues to work

### Adding Reasoning Support

```typescript
// Before: Basic streaming
await client.streamAgent(prompt, (event) => {
  if (event.type === "message_update") {
    console.log(event.message.message);
  }
});

// After: With reasoning support
await client.streamAgent(prompt, (event) => {
  switch (event.type) {
    case "reasoning_update": // NEW
      console.log("Reasoning:", event.content);
      break;
    case "message_update":
      console.log("Answer:", event.message.message);
      break;
  }
});
```

### Adding Cancellation Support

```typescript
// Before: No cancellation
await client.streamAgent(prompt, handler);

// After: With cancellation
const controller = new AbortController();
await client.streamAgent(
  prompt,
  handler,
  undefined,
  spec,
  tools,
  toolHandlers,
  {
    abortSignal: controller.signal, // NEW
  },
);
```

# Graphlit TypeScript SDK - Advanced Features

## 🧠 Reasoning/Thinking Support

The Graphlit SDK can detect and expose reasoning content from AI models, giving you insight into how models "think" through problems.

### Quick Start

```typescript
await client.streamAgent(
  "What's 15% of 240? Think step by step.",
  (event) => {
    if (event.type === "reasoning_update") {
      console.log("🤔 Model thinking:", event.content);
    } else if (event.type === "message_update") {
      console.log("💬 Answer:", event.message.message);
    }
  },
  undefined,
  { id: specificationId },
);
```

### Supported Models

| Provider      | Models                  | Output Example                             |
| ------------- | ----------------------- | ------------------------------------------ |
| **Bedrock**   | Nova Premier            | `<thinking>Let me calculate...</thinking>` |
| **Deepseek**  | Chat, Reasoner          | `**Step 1:** First I need to...`           |
| **Anthropic** | Claude (special access) | Internal thinking blocks                   |

## 🛑 Stream Cancellation

Cancel streaming operations instantly with standard Web APIs.

### Quick Start

```typescript
const controller = new AbortController();

// Cancel button
document.getElementById("stop").onclick = () => controller.abort();

try {
  await client.streamAgent(
    "Write a long essay...",
    (event) => console.log(event),
    undefined,
    specification,
    tools,
    toolHandlers,
    { abortSignal: controller.signal },
  );
} catch (error) {
  if (controller.signal.aborted) {
    console.log("Cancelled by user");
  }
}
```

### Features

- ✅ **Instant cancellation** - No waiting for completion
- ✅ **Provider-level support** - Works with all AI providers
- ✅ **Tool interruption** - Stops tool execution between rounds
- ✅ **Clean cleanup** - Proper resource management

## 🔧 Complete Example

```typescript
import { Graphlit } from "graphlit-client";
import * as Types from "graphlit-client/generated/graphql-types";

const client = new Graphlit(orgId, envId, secret);

// Create specification for reasoning model
const spec = await client.createSpecification({
  name: "Reasoning Assistant",
  serviceType: Types.ModelServiceTypes.Bedrock,
  bedrock: {
    model: Types.BedrockModels.NovaPremier,
    temperature: 0.7,
  },
});

// Set up cancellation
const controller = new AbortController();
const reasoningSteps: string[] = [];

// Stream with reasoning detection and cancellation
await client.streamAgent(
  "Analyze the pros and cons of remote work. Think through each aspect carefully.",
  (event) => {
    switch (event.type) {
      case "reasoning_update":
        reasoningSteps.push(event.content);
        updateReasoningDisplay(reasoningSteps, event.isComplete);
        break;

      case "message_update":
        updateAnswerDisplay(event.message.message);
        break;

      case "conversation_completed":
        console.log("Analysis complete!");
        break;

      case "error":
        console.error("Error:", event.error.message);
        break;
    }
  },
  undefined,
  { id: spec.createSpecification!.id },
  undefined, // tools
  undefined, // tool handlers
  { abortSignal: controller.signal },
);

function updateReasoningDisplay(steps: string[], isComplete: boolean) {
  const reasoning = steps.join("\n");
  document.getElementById("reasoning").textContent = reasoning;
  if (isComplete) {
    document.getElementById("reasoning").classList.add("complete");
  }
}

function updateAnswerDisplay(answer: string) {
  document.getElementById("answer").textContent = answer;
}
```

## 📚 Full Documentation

For complete API documentation, examples, and troubleshooting:

- [Reasoning & Cancellation Guide](./reasoning-and-cancellation.md)
- [API Reference](../src/types/ui-events.ts)
- [Test Examples](../test/reasoning-basic.test.ts)

## 🔄 Migration

These features are **backwards compatible**. Existing code continues to work without changes.

### Adding Reasoning Support (Optional)

```typescript
// Add this to your existing event handler
if (event.type === "reasoning_update") {
  showReasoningToUser(event.content, event.format);
}
```

### Adding Cancellation Support (Optional)

```typescript
// Add this to your existing streamAgent call
const options = {
  abortSignal: controller.signal, // Add this line
};
await client.streamAgent(
  prompt,
  handler,
  undefined,
  spec,
  tools,
  toolHandlers,
  options,
);
```

## 🎯 Use Cases

### Reasoning Detection

- **Educational apps**: Show students how AI solves problems
- **Research tools**: Expose model reasoning for analysis
- **Debug assistance**: Understand why models give certain answers
- **Transparency**: Build trust by showing AI thought process

### Stream Cancellation

- **User control**: Stop long-running generations
- **Resource management**: Cancel expensive operations
- **UI responsiveness**: Prevent hanging interfaces
- **Batch operations**: Cancel multiple streams at once

## ⚡ Performance

- **Reasoning detection**: <5% overhead
- **Cancellation**: Instant response
- **Memory usage**: Minimal additional allocation
- **Compatibility**: Works with all providers

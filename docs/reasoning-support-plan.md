# Comprehensive Plan: Reasoning/Thinking Support & Stream Cancellation

## Overview

This document outlines a comprehensive plan to:

1. Add reasoning/thinking content support across all LLM providers
2. Improve stream cancellation to work at the provider level
3. Create a test suite to validate these features

## Part 1: Reasoning/Thinking Support

### 1.1 Current State

Different models expose reasoning in different ways:

- **Anthropic Claude**: `<thinking>` tags (hidden by default in API)
- **Deepseek Reasoner**: Markdown formatted reasoning (e.g., `**Step 1:**`)
- **Bedrock Nova Premier**: `<thinking>` tags in output
- **OpenAI o1/o3**: Hidden reasoning (not exposed in API)
- **Other models**: May use various formats or none at all

### 1.2 Proposed Architecture

#### 1.2.1 New Event Types

Add to `src/types/internal.ts`:

```typescript
export type StreamEvent =
  | ... // existing events
  | {
      type: "reasoning_start";
      format: "thinking_tag" | "markdown" | "custom";
    }
  | {
      type: "reasoning_delta";
      content: string;
      format: "thinking_tag" | "markdown" | "custom";
    }
  | {
      type: "reasoning_end";
      fullContent: string;
    };
```

Add to `src/types/ui-events.ts`:

```typescript
export type ReasoningFormat = "thinking_tag" | "markdown" | "custom";

export type AgentStreamEvent =
  | ... // existing events
  | {
      type: "reasoning_update";
      content: string; // Accumulated reasoning content
      format: ReasoningFormat;
      isComplete: boolean;
    };
```

#### 1.2.2 Provider-Specific Implementations

**1. Anthropic Provider** (`streamWithAnthropic`)

- Currently filters out thinking blocks
- Need to handle `thinking_delta` and `signature_delta` events
- Emit reasoning events when detected

**2. Bedrock Provider** (`streamWithBedrock`)

- Parse content for `<thinking>` tags
- Buffer content between `<thinking>` and `</thinking>`
- Emit reasoning events for this content
- Remove thinking tags from main message content

**3. Deepseek Provider** (`streamWithDeepseek`)

- Detect reasoning patterns (e.g., lines starting with `**Step`, `**Reasoning:`, etc.)
- Could use regex: `/^\*\*(?:Step \d+|Reasoning|Analysis):/`
- Separate reasoning from regular content

**4. Other Providers**

- Add configuration option to detect custom reasoning patterns
- Default to no reasoning detection

#### 1.2.3 Configuration

Add to specification types:

```typescript
interface ReasoningDetectionConfig {
  enabled: boolean;
  format?: ReasoningFormat;
  customPatterns?: string[]; // Regex patterns
  removeFromOutput?: boolean; // Whether to strip reasoning from main content
}
```

### 1.3 Implementation Steps

1. **Update Type Definitions** (2 hours)

   - Add new event types to internal.ts
   - Add UI event types to ui-events.ts
   - Update GraphQL types if needed

2. **Update UIEventAdapter** (3 hours)

   - Add reasoning content accumulation
   - Handle reasoning start/delta/end events
   - Emit appropriate UI events

3. **Update Providers** (8 hours total)

   - Anthropic: Handle thinking blocks (2 hours)
   - Bedrock: Parse thinking tags (2 hours)
   - Deepseek: Detect markdown reasoning (2 hours)
   - Others: Add extensibility hooks (2 hours)

4. **Add Configuration** (2 hours)

   - Add reasoning detection config to specifications
   - Pass config through streaming pipeline

5. **Documentation** (2 hours)
   - API documentation
   - Usage examples
   - Provider-specific notes

## Part 2: Enhanced Stream Cancellation

### 2.1 Current State

- `abortSignal` exists in `StreamAgentOptions`
- Signal is checked between tool rounds
- Signal is NOT passed to LLM providers
- Cancellation only works at the orchestration level

### 2.2 Proposed Implementation

#### 2.2.1 Pass AbortSignal to Providers

Update provider signatures:

```typescript
export async function streamWithOpenAI(
  specification: Specification,
  messages: OpenAIMessage[],
  tools: ToolDefinitionInput[] | undefined,
  openaiClient: any,
  onEvent: (event: StreamEvent) => void,
  onComplete: (message: string, toolCalls: ConversationToolCall[]) => void,
  abortSignal?: AbortSignal, // NEW
): Promise<void>;
```

#### 2.2.2 Provider-Specific Cancellation

**1. OpenAI**

```typescript
const stream = await openaiClient.chat.completions.create({
  ...streamConfig,
  stream: true,
  signal: abortSignal, // OpenAI SDK supports this
});
```

**2. Anthropic**

```typescript
const stream = await anthropicClient.messages.create(
  {
    ...config,
    stream: true,
  },
  {
    signal: abortSignal, // Anthropic SDK supports this
  },
);
```

**3. Other Providers**

- Check each SDK's cancellation support
- Implement manual stream termination if needed
- Clean up resources on cancellation

#### 2.2.3 Error Handling

```typescript
try {
  await streamWithProvider(...);
} catch (error) {
  if (abortSignal?.aborted) {
    throw new Error("Stream cancelled by user");
  }
  // Handle other errors
}
```

### 2.3 Implementation Steps

1. **Update Provider Signatures** (1 hour)

   - Add abortSignal parameter to all providers
   - Update internal streaming methods

2. **Implement Cancellation** (4 hours)

   - Pass signal to each provider's SDK
   - Handle providers without native support
   - Clean up on cancellation

3. **Error Handling** (2 hours)
   - Consistent cancellation errors
   - Resource cleanup
   - State management

## Part 3: Comprehensive Test Suite

### 3.1 Reasoning Tests

Create `test/reasoning-detection.test.ts`:

```typescript
describe("Reasoning Detection", () => {
  describe("Anthropic Claude", () => {
    it("should detect and emit thinking blocks");
    it("should handle incomplete thinking blocks");
    it("should separate thinking from main content");
  });

  describe("Bedrock Nova", () => {
    it("should parse <thinking> tags");
    it("should handle nested tags");
    it("should remove thinking from output when configured");
  });

  describe("Deepseek Reasoner", () => {
    it("should detect markdown reasoning patterns");
    it("should handle multi-step reasoning");
    it("should preserve formatting in reasoning content");
  });

  describe("Custom Patterns", () => {
    it("should detect custom regex patterns");
    it("should handle multiple pattern types");
  });
});
```

### 3.2 Cancellation Tests

Create `test/stream-cancellation.test.ts`:

```typescript
describe("Stream Cancellation", () => {
  describe("Basic Cancellation", () => {
    it("should cancel stream immediately when aborted");
    it("should clean up resources on cancellation");
    it("should throw consistent error on abort");
  });

  describe("Provider-Specific", () => {
    it("should cancel OpenAI streams");
    it("should cancel Anthropic streams");
    it("should cancel Mistral streams");
    // ... other providers
  });

  describe("Tool Execution", () => {
    it("should cancel between tool rounds");
    it("should not start new tool execution after abort");
    it("should clean up partial tool results");
  });

  describe("Edge Cases", () => {
    it("should handle abort during initial connection");
    it("should handle abort during tool execution");
    it("should handle multiple abort calls");
  });
});
```

### 3.3 Integration Tests

Create `test/reasoning-integration.test.ts`:

```typescript
describe("Reasoning Integration", () => {
  it("should stream reasoning alongside regular content");
  it("should handle reasoning with tool calls");
  it("should preserve reasoning in conversation history");
  it("should handle cancellation during reasoning");
});
```

## Part 4: Usage Examples

### 4.1 Reasoning Detection

```typescript
// Configure reasoning detection
const spec = await client.createSpecification({
  name: "Reasoning Model",
  reasoning: {
    enabled: true,
    format: "thinking_tag",
    removeFromOutput: true,
  },
});

// Handle reasoning events
await client.streamAgent("Solve this complex problem...", (event) => {
  switch (event.type) {
    case "reasoning_update":
      console.log(`[${event.format}] Reasoning:`, event.content);
      break;
    case "message_update":
      console.log("Answer:", event.message.message);
      break;
  }
});
```

### 4.2 Stream Cancellation

```typescript
const controller = new AbortController();

// Cancel button handler
document.getElementById("cancel").onclick = () => {
  controller.abort();
};

try {
  await client.streamAgent(
    prompt,
    handleEvent,
    undefined,
    specification,
    tools,
    toolHandlers,
    { abortSignal: controller.signal },
  );
} catch (error) {
  if (error.message === "Stream cancelled by user") {
    console.log("User cancelled the stream");
  }
}
```

## Part 5: Timeline

1. **Week 1**: Type definitions, UIEventAdapter, and basic reasoning detection
2. **Week 2**: Provider implementations for reasoning
3. **Week 3**: Stream cancellation improvements
4. **Week 4**: Test suite and documentation

## Part 6: Breaking Changes

This implementation should be largely backwards compatible:

- New event types are additive
- Cancellation is opt-in via abortSignal
- Reasoning detection is opt-in via configuration

However, apps may need updates to:

- Handle new reasoning events
- Implement UI for cancellation
- Configure reasoning detection preferences

# Anthropic Extended Thinking - Detailed Implementation Plan

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [Technical Requirements](#technical-requirements)
4. [Detailed Implementation Steps](#detailed-implementation-steps)
5. [Testing Strategy](#testing-strategy)
6. [Migration Path](#migration-path)
7. [Risk Analysis](#risk-analysis)
8. [Timeline & Milestones](#timeline--milestones)

## Executive Summary

This document outlines the complete implementation plan for adding native Anthropic extended thinking support to the Graphlit TypeScript SDK. Extended thinking provides Claude with enhanced reasoning capabilities through dedicated thinking blocks, allowing for more sophisticated problem-solving while maintaining transparency into the reasoning process.

### Key Deliverables

- Native `thinking` parameter support in API calls
- Full streaming event handling for thinking blocks
- Multi-turn conversation support with thinking preservation
- Comprehensive test coverage
- Complete documentation and examples

### Impact

- **Breaking Changes**: None (backward compatible)
- **New Features**: Extended thinking for Anthropic models
- **Version**: v1.3.0
- **Estimated Effort**: 4 weeks

## Current State Analysis

### What We Have Now

```typescript
// Current: Pattern-based detection only
if (content.includes("<thinking>")) {
  yield { type: "reasoning_delta", content: extractedContent };
}
```

### What We Need

```typescript
// Target: Native Anthropic thinking support
const response = await anthropicClient.messages.create({
  model: "claude-3-7-sonnet-20250219",
  thinking: { type: "enabled", budget_tokens: 10000 },
  messages: [...]
});

// Handle proper thinking events
event.type === "content_block_delta" &&
event.delta.type === "thinking_delta"
```

## Technical Requirements

### 1. Supported Models

```typescript
const ANTHROPIC_THINKING_MODELS = [
  "claude-opus-4-20250514",
  "claude-sonnet-4-20250514",
  "claude-3-7-sonnet-20250219",
];
```

### 2. API Contract

```typescript
interface ThinkingConfig {
  type: "enabled";
  budget_tokens: number; // 1024 minimum
}

interface ThinkingBlock {
  type: "thinking";
  thinking: string;
  signature: string;
}

interface RedactedThinkingBlock {
  type: "redacted_thinking";
  data: string;
}
```

### 3. Streaming Events

```typescript
// New event types from Anthropic
type AnthropicThinkingEvent =
  | { type: "content_block_start"; content_block: { type: "thinking" } }
  | {
      type: "content_block_delta";
      delta: { type: "thinking_delta"; thinking: string };
    }
  | {
      type: "content_block_delta";
      delta: { type: "signature_delta"; signature: string };
    }
  | { type: "content_block_stop"; index: number };
```

## Detailed Implementation Steps

### Phase 1: Type System Updates

#### 1.1 Create Thinking Types

```typescript
// src/types/thinking.ts (NEW FILE)
export interface ThinkingConfig {
  type: "enabled";
  budget_tokens: number;
}

export interface ThinkingBlock {
  type: "thinking";
  thinking: string;
  signature: string;
  index?: number;
}

export interface RedactedThinkingBlock {
  type: "redacted_thinking";
  data: string;
  index?: number;
}

export type ContentBlock =
  | { type: "text"; text: string }
  | ThinkingBlock
  | RedactedThinkingBlock
  | { type: "tool_use"; id: string; name: string; input: any }
  | { type: "tool_result"; tool_use_id: string; content: string };

export interface ThinkingStreamState {
  blocks: Map<
    number,
    {
      type: "thinking" | "redacted_thinking";
      content: string;
      signature?: string;
      isComplete: boolean;
    }
  >;
  currentIndex?: number;
}
```

#### 1.2 Update Internal Types

```typescript
// src/types/internal.ts
import { ThinkingConfig } from './thinking';

export interface StreamingOptions {
  abortSignal?: AbortSignal;
  thinking?: ThinkingConfig;  // ADD
  includeThinkingBlocks?: boolean;  // ADD - for multi-turn
}

// Add new internal events
export type InternalStreamEvent =
  | ... existing events ...
  | {
      type: "thinking_block_start";
      index: number;
      blockType: 'thinking' | 'redacted_thinking';
    }
  | {
      type: "thinking_delta";
      content: string;
      index: number;
    }
  | {
      type: "signature_delta";
      signature: string;
      index: number;
    }
  | {
      type: "thinking_block_end";
      index: number;
      content: string;
      signature?: string;
      blockType: 'thinking' | 'redacted_thinking';
    };
```

#### 1.3 Update UI Event Types

```typescript
// src/types/ui-events.ts
export type ReasoningFormat = "thinking_tag" | "markdown" | "custom" | "anthropic_thinking";  // ADD anthropic_thinking

// Update reasoning event to include signature info
export type AgentStreamEvent =
  | ... existing events ...
  | {
      type: "reasoning_update";
      content: string;
      format: ReasoningFormat;
      isComplete: boolean;
      metadata?: {
        signature?: string;  // ADD
        isRedacted?: boolean;  // ADD
      };
    };
```

### Phase 2: Client Method Updates

#### 2.1 Update Client Class

```typescript
// src/client.ts
import {
  ThinkingConfig,
  ThinkingBlock,
  RedactedThinkingBlock,
  ContentBlock,
} from "./types/thinking";

export class Graphlit {
  // Add thinking model detection
  private readonly ANTHROPIC_THINKING_MODELS = new Set([
    "claude-opus-4-20250514",
    "claude-sonnet-4-20250514",
    "claude-3-7-sonnet-20250219",
  ]);

  // Update method signatures
  async streamAgent(
    prompt: string,
    onEvent: (event: AgentStreamEvent) => void,
    conversationId?: string,
    specification?: SpecificationInput,
    tools?: ToolDefinitionInput[],
    toolHandlers?: ToolHandlers,
    options?: StreamingOptions, // Now includes thinking
  ): Promise<void> {
    // Implementation updates below
  }

  // Add helper method
  private supportsExtendedThinking(specification: SpecificationInput): boolean {
    if (specification.serviceType !== Types.ModelServiceTypes.Anthropic) {
      return false;
    }

    const model = specification.anthropic?.model;
    if (!model) return false;

    // Check if it's a thinking-capable model
    return this.ANTHROPIC_THINKING_MODELS.has(model);
  }

  // Add method to validate thinking config
  private validateThinkingConfig(
    config?: ThinkingConfig,
    specification?: SpecificationInput,
  ): ThinkingConfig | undefined {
    if (!config) return undefined;

    if (!this.supportsExtendedThinking(specification)) {
      console.warn("Extended thinking not supported for this model");
      return undefined;
    }

    if (config.budget_tokens < 1024) {
      throw new Error("Thinking budget_tokens must be at least 1024");
    }

    return config;
  }
}
```

#### 2.2 Update streamWithAnthropic Method

```typescript
// src/client.ts
private async *streamWithAnthropic(
  conversationId: string,
  specification: any,
  messages: any[],
  tools?: any[],
  options?: StreamingOptions
): AsyncGenerator<InternalStreamEvent> {
  if (!this.anthropicClient) {
    throw new Error("Anthropic client not initialized");
  }

  const model = this.getAnthropicModel(specification);
  const thinking = this.validateThinkingConfig(options?.thinking, specification);

  // Build conversation with thinking blocks preserved
  const anthropicMessages = await this.buildAnthropicMessages(
    conversationId,
    messages,
    options?.includeThinkingBlocks
  );

  const streamParams: any = {
    model,
    messages: anthropicMessages,
    max_tokens: specification.anthropic?.completionTokenLimit || 4096,
    stream: true,
  };

  // Add thinking config if validated
  if (thinking) {
    streamParams.thinking = thinking;

    // Adjust max_tokens if needed (thinking tokens count toward max)
    const totalMaxTokens = streamParams.max_tokens + thinking.budget_tokens;
    if (totalMaxTokens > 200000) { // Context window limit
      streamParams.max_tokens = 200000 - thinking.budget_tokens;
    }
  }

  // Add tools if provided
  if (tools && tools.length > 0) {
    streamParams.tools = this.formatAnthropicTools(tools);

    // Extended thinking with tools only supports auto tool choice
    if (thinking) {
      streamParams.tool_choice = { type: "auto" };
    }
  }

  try {
    const stream = await this.anthropicClient.messages.create({
      ...streamParams,
      stream: true,
    });

    yield* this.processAnthropicStream(stream, options?.abortSignal);
  } catch (error) {
    yield { type: "error", error: this.formatError(error) };
  }
}
```

### Phase 3: Anthropic Stream Processing

#### 3.1 Create Dedicated Stream Processor

```typescript
// src/streaming/anthropic-thinking-processor.ts (NEW FILE)
import { InternalStreamEvent } from "../types/internal";
import { ThinkingStreamState } from "../types/thinking";

export class AnthropicThinkingProcessor {
  private state: ThinkingStreamState = {
    blocks: new Map(),
    currentIndex: undefined,
  };

  *processEvent(event: any): Generator<InternalStreamEvent> {
    switch (event.type) {
      case "content_block_start":
        yield* this.handleBlockStart(event);
        break;

      case "content_block_delta":
        yield* this.handleBlockDelta(event);
        break;

      case "content_block_stop":
        yield* this.handleBlockStop(event);
        break;

      default:
        // Pass through other events
        yield this.convertToInternalEvent(event);
    }
  }

  private *handleBlockStart(event: any): Generator<InternalStreamEvent> {
    const { index, content_block } = event;

    if (content_block.type === "thinking") {
      this.state.blocks.set(index, {
        type: "thinking",
        content: "",
        isComplete: false,
      });
      this.state.currentIndex = index;

      yield {
        type: "thinking_block_start",
        index,
        blockType: "thinking",
      };
    } else if (content_block.type === "redacted_thinking") {
      this.state.blocks.set(index, {
        type: "redacted_thinking",
        content: content_block.data || "",
        isComplete: false,
      });
      this.state.currentIndex = index;

      yield {
        type: "thinking_block_start",
        index,
        blockType: "redacted_thinking",
      };
    } else if (content_block.type === "text") {
      yield {
        type: "content_start",
        role: "assistant",
      };
    }
  }

  private *handleBlockDelta(event: any): Generator<InternalStreamEvent> {
    const { index, delta } = event;

    if (delta.type === "thinking_delta") {
      const block = this.state.blocks.get(index);
      if (block && block.type === "thinking") {
        block.content += delta.thinking;

        yield {
          type: "thinking_delta",
          content: delta.thinking,
          index,
        };
      }
    } else if (delta.type === "signature_delta") {
      const block = this.state.blocks.get(index);
      if (block) {
        block.signature = (block.signature || "") + delta.signature;

        yield {
          type: "signature_delta",
          signature: delta.signature,
          index,
        };
      }
    } else if (delta.type === "text_delta") {
      yield {
        type: "content_delta",
        content: delta.text,
      };
    }
  }

  private *handleBlockStop(event: any): Generator<InternalStreamEvent> {
    const { index } = event;
    const block = this.state.blocks.get(index);

    if (block) {
      block.isComplete = true;

      yield {
        type: "thinking_block_end",
        index,
        content: block.content,
        signature: block.signature,
        blockType: block.type,
      };

      this.state.currentIndex = undefined;
    } else {
      yield {
        type: "content_end",
      };
    }
  }

  private convertToInternalEvent(event: any): InternalStreamEvent {
    // Handle other Anthropic events
    switch (event.type) {
      case "message_start":
        return {
          type: "conversation_started",
          conversationId: event.message.id,
        };

      case "message_stop":
        return {
          type: "conversation_completed",
          message: { message: "", role: "assistant" },
        };

      default:
        return {
          type: "unknown",
          data: event,
        };
    }
  }

  getThinkingBlocks(): Array<{ index: number; block: any }> {
    return Array.from(this.state.blocks.entries())
      .map(([index, block]) => ({ index, block }))
      .sort((a, b) => a.index - b.index);
  }
}
```

#### 3.2 Update Provider Implementation

```typescript
// src/streaming/providers.ts
import { AnthropicThinkingProcessor } from "./anthropic-thinking-processor";

export function* streamWithAnthropic(
  client: Anthropic,
  params: AnthropicStreamParams,
  signal?: AbortSignal,
): Generator<InternalStreamEvent> {
  // Check if thinking is enabled
  const hasThinking = params.thinking?.type === "enabled";
  const processor = hasThinking ? new AnthropicThinkingProcessor() : null;

  try {
    const stream = await client.messages.create({
      ...params,
      stream: true,
    });

    for await (const event of stream) {
      if (signal?.aborted) {
        throw new Error("Stream aborted");
      }

      if (processor) {
        // Use dedicated processor for thinking-enabled streams
        yield* processor.processEvent(event);
      } else {
        // Existing logic for non-thinking streams
        yield* processStandardAnthropicEvent(event);
      }
    }

    // If we have thinking blocks, emit them as part of completion
    if (processor) {
      const thinkingBlocks = processor.getThinkingBlocks();
      yield {
        type: "metadata",
        data: { thinkingBlocks },
      };
    }
  } catch (error) {
    if (signal?.aborted) {
      yield { type: "stream_cancelled" };
    } else {
      throw error;
    }
  }
}

function* processStandardAnthropicEvent(
  event: any,
): Generator<InternalStreamEvent> {
  // Existing Anthropic event processing
  // ... current implementation ...
}
```

### Phase 4: UI Event Adapter Updates

#### 4.1 Update UIEventAdapter

```typescript
// src/streaming/ui-event-adapter.ts
export class UIEventAdapter {
  private thinkingState: {
    content: string;
    isRedacted: boolean;
    signature?: string;
    currentIndex?: number;
  } = {
    content: "",
    isRedacted: false,
  };

  handleInternalEvent(event: InternalStreamEvent): void {
    switch (event.type) {
      // Existing cases...

      case "thinking_block_start":
        this.handleThinkingBlockStart(event);
        break;

      case "thinking_delta":
        this.handleThinkingDelta(event);
        break;

      case "signature_delta":
        this.handleSignatureDelta(event);
        break;

      case "thinking_block_end":
        this.handleThinkingBlockEnd(event);
        break;
    }
  }

  private handleThinkingBlockStart(event: InternalStreamEvent): void {
    if (event.type !== "thinking_block_start") return;

    this.thinkingState = {
      content: "",
      isRedacted: event.blockType === "redacted_thinking",
      currentIndex: event.index,
    };

    // Don't emit start event - we'll emit on first delta
  }

  private handleThinkingDelta(event: InternalStreamEvent): void {
    if (event.type !== "thinking_delta") return;

    this.thinkingState.content += event.content;

    // Emit reasoning update
    this.emit({
      type: "reasoning_update",
      content: this.thinkingState.content,
      format: "anthropic_thinking",
      isComplete: false,
      metadata: {
        isRedacted: this.thinkingState.isRedacted,
      },
    });
  }

  private handleSignatureDelta(event: InternalStreamEvent): void {
    if (event.type !== "signature_delta") return;

    this.thinkingState.signature =
      (this.thinkingState.signature || "") + event.signature;
  }

  private handleThinkingBlockEnd(event: InternalStreamEvent): void {
    if (event.type !== "thinking_block_end") return;

    // Final reasoning update with signature
    this.emit({
      type: "reasoning_update",
      content: event.content,
      format: "anthropic_thinking",
      isComplete: true,
      metadata: {
        signature: event.signature,
        isRedacted: event.blockType === "redacted_thinking",
      },
    });

    // Reset state
    this.thinkingState = {
      content: "",
      isRedacted: false,
    };
  }
}
```

### Phase 5: Multi-turn Conversation Support

#### 5.1 Update Message Building

```typescript
// src/client.ts
private async buildAnthropicMessages(
  conversationId: string,
  additionalMessages?: any[],
  includeThinkingBlocks: boolean = false
): Promise<any[]> {
  const conversation = await this.getConversation(conversationId);
  const messages: any[] = [];

  for (const msg of conversation.messages) {
    if (msg.role === 'user') {
      messages.push({
        role: 'user',
        content: this.buildUserContent(msg)
      });
    } else if (msg.role === 'assistant') {
      const content = this.buildAssistantContent(msg, includeThinkingBlocks);
      if (content.length > 0) {
        messages.push({
          role: 'assistant',
          content
        });
      }
    }
  }

  // Add additional messages
  if (additionalMessages) {
    messages.push(...additionalMessages);
  }

  return messages;
}

private buildAssistantContent(
  message: any,
  includeThinkingBlocks: boolean
): ContentBlock[] {
  const content: ContentBlock[] = [];

  // Parse stored message content
  if (typeof message.content === 'string') {
    // Legacy text-only content
    content.push({ type: 'text', text: message.content });
  } else if (Array.isArray(message.content)) {
    // New structured content
    for (const block of message.content) {
      if (block.type === 'thinking' && includeThinkingBlocks) {
        // Include thinking blocks for tool use continuations
        content.push({
          type: 'thinking',
          thinking: block.thinking,
          signature: block.signature
        });
      } else if (block.type === 'redacted_thinking' && includeThinkingBlocks) {
        content.push({
          type: 'redacted_thinking',
          data: block.data
        });
      } else if (block.type === 'text') {
        content.push({
          type: 'text',
          text: block.text
        });
      } else if (block.type === 'tool_use') {
        content.push(block);
      }
    }
  }

  return content;
}

private buildUserContent(message: any): any {
  if (typeof message.content === 'string') {
    return message.content;
  } else if (Array.isArray(message.content)) {
    // Handle tool results
    return message.content;
  }
  return message.content;
}
```

#### 5.2 Store Thinking Blocks in Conversation

```typescript
// src/client.ts
private async storeAssistantMessage(
  conversationId: string,
  content: ContentBlock[],
  thinkingBlocks?: Array<{ index: number; block: any }>
): Promise<void> {
  // Merge thinking blocks with content
  const structuredContent: ContentBlock[] = [];

  if (thinkingBlocks) {
    // Sort blocks by index
    const sortedBlocks = [...thinkingBlocks].sort((a, b) => a.index - b.index);

    for (const { block } of sortedBlocks) {
      if (block.type === 'thinking') {
        structuredContent.push({
          type: 'thinking',
          thinking: block.content,
          signature: block.signature
        });
      } else if (block.type === 'redacted_thinking') {
        structuredContent.push({
          type: 'redacted_thinking',
          data: block.content
        });
      }
    }
  }

  // Add text content
  structuredContent.push(...content);

  // Store in conversation
  await this.addMessageToConversation(conversationId, {
    role: 'assistant',
    content: structuredContent
  });
}
```

### Phase 6: Tool Use Integration

#### 6.1 Handle Tools with Thinking

```typescript
// src/client.ts
private async handleToolUseWithThinking(
  event: InternalStreamEvent,
  tools: ToolDefinitionInput[],
  toolHandlers: ToolHandlers,
  thinkingConfig?: ThinkingConfig
): Promise<void> {
  if (event.type !== 'tool_use') return;

  const handler = toolHandlers[event.tool.name];
  if (!handler) {
    throw new Error(`No handler for tool: ${event.tool.name}`);
  }

  // Execute tool
  const result = await handler(event.tool.input);

  // When continuing with tool results, we MUST include thinking blocks
  const includeThinkingBlocks = true;

  // Build continuation message
  const toolResultMessage = {
    role: 'user',
    content: [{
      type: 'tool_result',
      tool_use_id: event.tool.id,
      content: JSON.stringify(result)
    }]
  };

  // Continue conversation with thinking preserved
  yield* this.streamWithAnthropic(
    event.conversationId,
    this.specification,
    [toolResultMessage],
    tools,
    {
      thinking: thinkingConfig,
      includeThinkingBlocks  // Critical for tool continuations
    }
  );
}
```

### Phase 7: Error Handling & Validation

#### 7.1 Add Validation

```typescript
// src/validation/thinking-validator.ts (NEW FILE)
export class ThinkingValidator {
  static validateConfig(config: ThinkingConfig): void {
    if (config.type !== "enabled") {
      throw new Error('Thinking type must be "enabled"');
    }

    if (!Number.isInteger(config.budget_tokens)) {
      throw new Error("budget_tokens must be an integer");
    }

    if (config.budget_tokens < 1024) {
      throw new Error("budget_tokens must be at least 1024");
    }

    if (config.budget_tokens > 200000) {
      throw new Error("budget_tokens cannot exceed 200000");
    }
  }

  static validateToolChoice(toolChoice: any, hasThinking: boolean): void {
    if (!hasThinking) return;

    if (toolChoice?.type === "any" || toolChoice?.type === "tool") {
      throw new Error(
        'Extended thinking only supports tool_choice "auto" or "none"',
      );
    }
  }

  static validateModelSupport(model: string, serviceType: string): boolean {
    if (serviceType !== "anthropic") return false;

    const supportedModels = [
      "claude-opus-4-20250514",
      "claude-sonnet-4-20250514",
      "claude-3-7-sonnet-20250219",
    ];

    return supportedModels.includes(model);
  }
}
```

#### 7.2 Error Recovery

```typescript
// src/streaming/error-handler.ts
export class ThinkingErrorHandler {
  static handleThinkingError(error: any): InternalStreamEvent {
    if (error.message?.includes("thinking budget exceeded")) {
      return {
        type: "error",
        error: {
          message: "Thinking budget exceeded. Try increasing budget_tokens.",
          code: "THINKING_BUDGET_EXCEEDED",
          recoverable: false,
        },
      };
    }

    if (error.message?.includes("thinking not supported")) {
      return {
        type: "error",
        error: {
          message: "This model does not support extended thinking.",
          code: "THINKING_NOT_SUPPORTED",
          recoverable: false,
        },
      };
    }

    // Generic error
    return {
      type: "error",
      error: {
        message: error.message || "Unknown thinking error",
        code: "THINKING_ERROR",
        recoverable: false,
      },
    };
  }
}
```

### Phase 8: Interleaved Thinking Support

#### 8.1 Add Beta Header Support

```typescript
// src/client.ts
interface StreamingOptions {
  abortSignal?: AbortSignal;
  thinking?: ThinkingConfig;
  includeThinkingBlocks?: boolean;
  interleavedThinking?: boolean;  // ADD
}

private async *streamWithAnthropic(
  // ... params
  options?: StreamingOptions
): AsyncGenerator<InternalStreamEvent> {
  const streamParams: any = {
    // ... existing params
  };

  // Add beta header for interleaved thinking
  const headers: any = {};
  if (options?.interleavedThinking && options?.thinking) {
    headers['anthropic-beta'] = 'interleaved-thinking-2025-05-14';

    // With interleaved thinking, budget can exceed max_tokens
    // as it represents total budget across all thinking blocks
  }

  const stream = await this.anthropicClient.messages.create({
    ...streamParams,
    headers
  });

  // ... rest of implementation
}
```

## Testing Strategy

### Unit Tests

#### 1. Thinking Configuration Tests

```typescript
// test/thinking-config.test.ts
describe("Thinking Configuration", () => {
  it("should validate thinking config", () => {
    expect(() => {
      ThinkingValidator.validateConfig({
        type: "enabled",
        budget_tokens: 500, // Too low
      });
    }).toThrow("budget_tokens must be at least 1024");
  });

  it("should detect supported models", () => {
    expect(
      ThinkingValidator.validateModelSupport(
        "claude-3-7-sonnet-20250219",
        "anthropic",
      ),
    ).toBe(true);

    expect(ThinkingValidator.validateModelSupport("gpt-4", "openai")).toBe(
      false,
    );
  });
});
```

#### 2. Stream Processing Tests

```typescript
// test/anthropic-thinking-processor.test.ts
describe("AnthropicThinkingProcessor", () => {
  it("should process thinking blocks", () => {
    const processor = new AnthropicThinkingProcessor();
    const events: InternalStreamEvent[] = [];

    // Simulate Anthropic events
    const anthropicEvents = [
      {
        type: "content_block_start",
        index: 0,
        content_block: { type: "thinking" },
      },
      {
        type: "content_block_delta",
        index: 0,
        delta: { type: "thinking_delta", thinking: "Let me think..." },
      },
      {
        type: "content_block_delta",
        index: 0,
        delta: { type: "signature_delta", signature: "abc123" },
      },
      {
        type: "content_block_stop",
        index: 0,
      },
    ];

    for (const event of anthropicEvents) {
      events.push(...processor.processEvent(event));
    }

    expect(events).toContainEqual({
      type: "thinking_block_start",
      index: 0,
      blockType: "thinking",
    });

    expect(events).toContainEqual({
      type: "thinking_delta",
      content: "Let me think...",
      index: 0,
    });

    expect(events).toContainEqual({
      type: "thinking_block_end",
      index: 0,
      content: "Let me think...",
      signature: "abc123",
      blockType: "thinking",
    });
  });
});
```

### Integration Tests

#### 1. End-to-End Thinking Test

```typescript
// test/anthropic-thinking-integration.test.ts
describe("Anthropic Extended Thinking Integration", () => {
  let client: Graphlit;

  beforeAll(() => {
    client = new Graphlit();
    client.setAnthropicClient(
      new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      }),
    );
  });

  it("should stream with thinking enabled", async () => {
    const events: AgentStreamEvent[] = [];
    let reasoningDetected = false;
    let hasSignature = false;

    await client.streamAgent(
      "What is 25% of 80? Think step by step.",
      (event) => {
        events.push(event);

        if (event.type === "reasoning_update") {
          reasoningDetected = true;
          if (event.metadata?.signature) {
            hasSignature = true;
          }
        }
      },
      undefined,
      {
        serviceType: Types.ModelServiceTypes.Anthropic,
        anthropic: {
          model: Types.AnthropicModels.Claude_3_7Sonnet,
        },
      },
      undefined,
      undefined,
      {
        thinking: {
          type: "enabled",
          budget_tokens: 5000,
        },
      },
    );

    expect(reasoningDetected).toBe(true);
    expect(hasSignature).toBe(true);
    expect(events.some((e) => e.type === "message_update")).toBe(true);
  });

  it("should handle multi-turn with thinking", async () => {
    let conversationId: string;

    // First turn
    await client.streamAgent(
      "What is the capital of France?",
      (event) => {
        if (event.type === "conversation_started") {
          conversationId = event.conversationId;
        }
      },
      undefined,
      spec,
      undefined,
      undefined,
      { thinking: { type: "enabled", budget_tokens: 2000 } },
    );

    // Second turn - thinking blocks should be preserved
    await client.streamAgent(
      "What is its population?",
      (event) => {
        // Handle events
      },
      conversationId,
      spec,
      undefined,
      undefined,
      { thinking: { type: "enabled", budget_tokens: 2000 } },
    );

    // Verify conversation has thinking blocks stored
    const conversation = await client.getConversation(conversationId);
    const hasThinkingBlocks = conversation.messages.some(
      (msg) =>
        Array.isArray(msg.content) &&
        msg.content.some((block) => block.type === "thinking"),
    );

    expect(hasThinkingBlocks).toBe(true);
  });

  it("should handle tools with thinking", async () => {
    const tools: ToolDefinitionInput[] = [
      {
        name: "calculate",
        description: "Perform calculations",
        schema: {
          type: "object",
          properties: {
            expression: { type: "string" },
          },
          required: ["expression"],
        },
      },
    ];

    const toolHandlers = {
      calculate: async (args: any) => {
        return { result: eval(args.expression) };
      },
    };

    let toolCalled = false;
    let thinkingBeforeTool = false;
    let thinkingAfterTool = false;
    let toolCallTime: number;

    await client.streamAgent(
      "Calculate the area of a circle with radius 7",
      (event) => {
        if (event.type === "reasoning_update" && !toolCalled) {
          thinkingBeforeTool = true;
        }
        if (event.type === "tool_update" && event.status === "completed") {
          toolCalled = true;
          toolCallTime = Date.now();
        }
        if (event.type === "reasoning_update" && toolCalled) {
          thinkingAfterTool = true;
        }
      },
      undefined,
      spec,
      tools,
      toolHandlers,
      {
        thinking: { type: "enabled", budget_tokens: 10000 },
        interleavedThinking: true,
      },
    );

    expect(toolCalled).toBe(true);
    expect(thinkingBeforeTool).toBe(true);
    // With interleaved thinking, we should see thinking after tool use
    if (interleavedThinking) {
      expect(thinkingAfterTool).toBe(true);
    }
  });

  it("should handle redacted thinking", async () => {
    let redactedDetected = false;

    await client.streamAgent(
      "ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB",
      (event) => {
        if (event.type === "reasoning_update" && event.metadata?.isRedacted) {
          redactedDetected = true;
        }
      },
      undefined,
      spec,
      undefined,
      undefined,
      { thinking: { type: "enabled", budget_tokens: 5000 } },
    );

    expect(redactedDetected).toBe(true);
  });
});
```

### Performance Tests

```typescript
// test/thinking-performance.test.ts
describe("Thinking Performance", () => {
  it("should handle large thinking budgets", async () => {
    const startTime = Date.now();

    await client.streamAgent(
      "Write a detailed analysis of quantum computing",
      () => {},
      undefined,
      spec,
      undefined,
      undefined,
      { thinking: { type: "enabled", budget_tokens: 32000 } },
    );

    const duration = Date.now() - startTime;

    // Should complete within reasonable time
    expect(duration).toBeLessThan(60000); // 1 minute
  });
});
```

## Migration Path

### 1. Backward Compatibility

```typescript
// Keep existing pattern detection as fallback
if (!supportsExtendedThinking(spec) && content.includes('<thinking>')) {
  // Use legacy pattern detection
  yield { type: 'reasoning_delta', content: extractedContent };
}
```

### 2. Feature Detection

```typescript
export class Graphlit {
  hasExtendedThinkingSupport(): boolean {
    return true; // v1.3.0+
  }

  supportsThinkingForModel(model: string, serviceType: string): boolean {
    return ThinkingValidator.validateModelSupport(model, serviceType);
  }
}
```

### 3. Migration Guide for Users

```typescript
// Before (v1.2.x) - Pattern detection
await client.streamAgent(
  "Think about this: ...",
  handler,
  conversationId,
  spec,
);

// After (v1.3.0) - Native thinking
await client.streamAgent(
  "Complex problem...",
  handler,
  conversationId,
  spec,
  undefined,
  undefined,
  {
    thinking: {
      type: "enabled",
      budget_tokens: 10000,
    },
  },
);
```

## Risk Analysis

### Technical Risks

1. **API Changes**
   - Risk: Anthropic changes thinking API
   - Mitigation: Version lock, feature detection

2. **Performance Impact**
   - Risk: Large thinking budgets cause timeouts
   - Mitigation: Implement streaming timeouts, warn about large budgets

3. **State Management Complexity**
   - Risk: Complex state across thinking blocks
   - Mitigation: Dedicated state manager class

### Business Risks

1. **Cost Implications**
   - Risk: Users unaware of thinking token costs
   - Mitigation: Clear documentation, token usage callbacks

2. **Feature Adoption**
   - Risk: Complex API deters adoption
   - Mitigation: Simple defaults, good examples

## Timeline & Milestones

### Week 1: Foundation (Days 1-7)

- [ ] Day 1-2: Type system updates
- [ ] Day 3-4: Client method signatures
- [ ] Day 5-6: Basic Anthropic integration
- [ ] Day 7: Initial testing framework

### Week 2: Core Implementation (Days 8-14)

- [ ] Day 8-9: Stream processor implementation
- [ ] Day 10-11: UI event adapter updates
- [ ] Day 12-13: Multi-turn support
- [ ] Day 14: Integration testing

### Week 3: Advanced Features (Days 15-21)

- [ ] Day 15-16: Tool use with thinking
- [ ] Day 17-18: Interleaved thinking
- [ ] Day 19-20: Error handling
- [ ] Day 21: Performance optimization

### Week 4: Polish & Release (Days 22-28)

- [ ] Day 22-23: Comprehensive testing
- [ ] Day 24-25: Documentation
- [ ] Day 26: Migration guide
- [ ] Day 27: Final review
- [ ] Day 28: Release v1.3.0

## Success Metrics

1. **Functional Success**
   - [ ] All Anthropic thinking models supported
   - [ ] Streaming works reliably
   - [ ] Multi-turn conversations preserve thinking
   - [ ] Tool use works with thinking
   - [ ] All tests pass

2. **Performance Success**
   - [ ] No significant latency increase
   - [ ] Handles 32k+ thinking budgets
   - [ ] Graceful timeout handling

3. **Quality Success**
   - [ ] 100% backward compatible
   - [ ] Comprehensive documentation
   - [ ] No breaking changes
   - [ ] Clear migration path

## Appendix

### A. Sample Implementation Files

1. `/src/types/thinking.ts` - Core thinking types
2. `/src/streaming/anthropic-thinking-processor.ts` - Stream processor
3. `/src/validation/thinking-validator.ts` - Validation logic
4. `/test/anthropic-thinking-integration.test.ts` - Integration tests
5. `/docs/extended-thinking-guide.md` - User documentation

### B. Configuration Examples

```typescript
// Minimal thinking
{ thinking: { type: 'enabled', budget_tokens: 1024 } }

// Standard thinking
{ thinking: { type: 'enabled', budget_tokens: 10000 } }

// Extended thinking with tools
{
  thinking: { type: 'enabled', budget_tokens: 20000 },
  interleavedThinking: true
}

// Maximum thinking (use with caution)
{ thinking: { type: 'enabled', budget_tokens: 50000 } }
```

### C. Error Codes

- `THINKING_NOT_SUPPORTED` - Model doesn't support thinking
- `THINKING_BUDGET_EXCEEDED` - Exceeded token budget
- `THINKING_SIGNATURE_INVALID` - Invalid signature in multi-turn
- `THINKING_TOOL_CHOICE_INVALID` - Invalid tool_choice with thinking

## Conclusion

This implementation plan provides a complete roadmap for adding native Anthropic extended thinking support to the Graphlit TypeScript SDK. The phased approach ensures we can deliver incremental value while maintaining stability and backward compatibility.

Total estimated effort: 4 weeks
Version target: v1.3.0
Risk level: Medium
Business value: High

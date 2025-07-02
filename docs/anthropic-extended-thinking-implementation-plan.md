# Anthropic Extended Thinking Implementation Plan

## Overview

Add full support for Anthropic's extended thinking feature, which provides structured reasoning capabilities with dedicated thinking blocks, signatures, and proper multi-turn conversation support.

## Current State vs Target State

### Current (Pattern Detection Only)

- Simple `<thinking>` tag detection in regular text
- Generic `reasoning_update` events
- No API parameter support
- No proper thinking block handling

### Target (Full Extended Thinking)

- Native `thinking` parameter in API calls
- Proper `thinking_delta` streaming events
- Thinking block preservation for multi-turn
- Signature validation support
- Redacted thinking handling

## Implementation Plan

### Phase 1: API Parameter Support

#### 1.1 Update Type Definitions

```typescript
// src/types/internal.ts
export interface ThinkingConfig {
  type: "enabled";
  budget_tokens: number;
}

// Add to StreamingOptions
export interface StreamingOptions {
  abortSignal?: AbortSignal;
  thinking?: ThinkingConfig; // NEW
}
```

#### 1.2 Update Client Method Signatures

```typescript
// src/client.ts
async streamAgent(
  prompt: string,
  onEvent: (event: AgentStreamEvent) => void,
  conversationId?: string,
  specification?: SpecificationInput,
  tools?: ToolDefinitionInput[],
  toolHandlers?: ToolHandlers,
  options?: StreamingOptions  // Now includes thinking
): Promise<void>
```

### Phase 2: Streaming Event Support

#### 2.1 New Event Types

```typescript
// src/types/internal.ts
export type InternalStreamEvent =
  | ... existing events ...
  | {
      type: "thinking_block_start";
      index: number;
    }
  | {
      type: "thinking_delta";
      thinking: string;
      index: number;
    }
  | {
      type: "signature_delta";
      signature: string;
      index: number;
    }
  | {
      type: "thinking_block_stop";
      index: number;
      signature?: string;
    }
  | {
      type: "redacted_thinking";
      data: string;
      index: number;
    };
```

#### 2.2 Update Anthropic Provider

```typescript
// src/streaming/providers.ts
function* streamWithAnthropic(
  client: Anthropic,
  params: AnthropicStreamParams,
  signal?: AbortSignal,
): Generator<InternalStreamEvent> {
  // Current implementation handles text blocks
  // Need to add handling for:

  // 1. content_block_start with type: "thinking"
  if (event.type === "content_block_start") {
    if (event.content_block.type === "thinking") {
      yield {
        type: "thinking_block_start",
        index: event.index,
      };
    }
  }

  // 2. content_block_delta with thinking_delta
  if (event.type === "content_block_delta") {
    if (event.delta.type === "thinking_delta") {
      yield {
        type: "thinking_delta",
        thinking: event.delta.thinking,
        index: event.index,
      };
    } else if (event.delta.type === "signature_delta") {
      yield {
        type: "signature_delta",
        signature: event.delta.signature,
        index: event.index,
      };
    }
  }

  // 3. Handle thinking block completion
  if (event.type === "content_block_stop") {
    // Need to track if this was a thinking block
    yield {
      type: "thinking_block_stop",
      index: event.index,
      signature: accumulatedSignature,
    };
  }
}
```

### Phase 3: Content Block Management

#### 3.1 Thinking Block State

```typescript
// src/streaming/providers.ts
interface ThinkingBlockState {
  content: string;
  signature?: string;
  isRedacted: boolean;
  index: number;
}

class AnthropicStreamHandler {
  private thinkingBlocks: Map<number, ThinkingBlockState> = new Map();
  private currentBlockType: Map<number, "thinking" | "text" | "tool_use"> =
    new Map();

  handleContentBlockStart(event: any) {
    if (event.content_block.type === "thinking") {
      this.thinkingBlocks.set(event.index, {
        content: "",
        isRedacted: false,
        index: event.index,
      });
      this.currentBlockType.set(event.index, "thinking");
    }
  }

  handleThinkingDelta(event: any) {
    const block = this.thinkingBlocks.get(event.index);
    if (block) {
      block.content += event.delta.thinking;
    }
  }

  handleSignatureDelta(event: any) {
    const block = this.thinkingBlocks.get(event.index);
    if (block) {
      block.signature = (block.signature || "") + event.delta.signature;
    }
  }
}
```

### Phase 4: UI Event Adapter Updates

#### 4.1 Convert to UI Events

```typescript
// src/streaming/ui-event-adapter.ts
function handleThinkingBlockStart(event: InternalStreamEvent): void {
  // Start accumulating thinking content
  this.currentThinking = {
    content: "",
    format: "thinking_tag", // Anthropic uses thinking tags
    hasSignature: false,
  };
}

function handleThinkingDelta(event: InternalStreamEvent): void {
  if (this.currentThinking) {
    this.currentThinking.content += event.thinking;

    // Emit UI event
    this.emit({
      type: "reasoning_update",
      content: this.currentThinking.content,
      format: "thinking_tag",
      isComplete: false,
    });
  }
}

function handleThinkingBlockStop(event: InternalStreamEvent): void {
  if (this.currentThinking) {
    this.emit({
      type: "reasoning_update",
      content: this.currentThinking.content,
      format: "thinking_tag",
      isComplete: true,
    });
  }
}
```

### Phase 5: Multi-turn Support

#### 5.1 Preserve Thinking Blocks

```typescript
// src/client.ts
interface ConversationMessage {
  role: string;
  content: Array<{
    type: 'text' | 'thinking' | 'tool_use' | 'tool_result' | 'redacted_thinking';
    text?: string;
    thinking?: string;
    signature?: string;
    data?: string;  // For redacted thinking
    // ... other fields
  }>;
}

// When building messages for Anthropic:
private buildAnthropicMessages(
  conversation: Conversation
): AnthropicMessage[] {
  return conversation.messages.map(msg => {
    if (msg.role === 'assistant') {
      // Preserve thinking blocks with signatures
      return {
        role: 'assistant',
        content: msg.content.map(block => {
          if (block.type === 'thinking') {
            return {
              type: 'thinking',
              thinking: block.thinking,
              signature: block.signature  // Critical for multi-turn
            };
          }
          // Handle other block types...
        })
      };
    }
    return msg;
  });
}
```

### Phase 6: Provider Detection & Routing

#### 6.1 Update supportsExtendedThinking

```typescript
// src/client.ts
private supportsExtendedThinking(
  model: string,
  serviceType: Types.ModelServiceTypes
): boolean {
  if (serviceType === Types.ModelServiceTypes.Anthropic) {
    // Claude 3.7 and 4 models support extended thinking
    return model.includes('claude-3-7-sonnet') ||
           model.includes('claude-opus-4') ||
           model.includes('claude-sonnet-4');
  }
  return false;
}
```

#### 6.2 Pass Thinking Config to Provider

```typescript
// src/client.ts
private async streamWithAnthropic(
  // ... existing params
  options?: StreamingOptions
): AsyncGenerator<InternalStreamEvent> {
  const messages = this.buildAnthropicMessages(conversation);

  const streamParams: any = {
    model: this.getAnthropicModel(specification),
    messages,
    max_tokens: specification.anthropic?.completionTokenLimit || 4096,
    stream: true,
  };

  // Add thinking config if supported and requested
  if (options?.thinking && this.supportsExtendedThinking(model, serviceType)) {
    streamParams.thinking = options.thinking;
  }

  const stream = await this.anthropicClient.messages.create(streamParams);

  // ... rest of implementation
}
```

### Phase 7: Testing

#### 7.1 Unit Tests

```typescript
// test/anthropic-extended-thinking.test.ts
describe("Anthropic Extended Thinking", () => {
  it("should handle thinking blocks in streaming", async () => {
    const events: AgentStreamEvent[] = [];

    await client.streamAgent(
      "Complex reasoning task",
      (event) => events.push(event),
      undefined,
      {
        serviceType: Types.ModelServiceTypes.Anthropic,
        anthropic: { model: Types.AnthropicModels.Claude_3_7Sonnet },
      },
      undefined,
      undefined,
      {
        thinking: { type: "enabled", budget_tokens: 10000 },
      },
    );

    // Should have reasoning events
    const reasoningEvents = events.filter((e) => e.type === "reasoning_update");
    expect(reasoningEvents.length).toBeGreaterThan(0);
    expect(reasoningEvents[0].format).toBe("thinking_tag");
  });

  it("should preserve thinking blocks in multi-turn", async () => {
    // Test that thinking blocks with signatures are preserved
  });

  it("should handle redacted thinking blocks", async () => {
    // Test with magic string that triggers redaction
  });
});
```

### Phase 8: Documentation Updates

#### 8.1 Update README

- Add section on Anthropic extended thinking
- Show how to enable thinking
- Explain thinking budget tokens
- Document supported models

#### 8.2 Migration Guide

- How to migrate from pattern detection to native thinking
- Breaking changes (if any)
- New event types to handle

## Implementation Order

1. **Week 1**: Type definitions and API parameter support
2. **Week 1**: Update Anthropic provider to handle new events
3. **Week 2**: Implement thinking block state management
4. **Week 2**: Update UI event adapter
5. **Week 3**: Add multi-turn support with signature preservation
6. **Week 3**: Comprehensive testing
7. **Week 4**: Documentation and examples

## Risks & Mitigations

### Risk 1: Breaking Changes

- **Risk**: Existing reasoning detection might conflict
- **Mitigation**: Keep both systems working in parallel initially

### Risk 2: Complex State Management

- **Risk**: Managing thinking blocks across streaming chunks
- **Mitigation**: Create dedicated ThinkingBlockManager class

### Risk 3: API Compatibility

- **Risk**: Anthropic API changes or beta features
- **Mitigation**: Use feature detection and graceful fallbacks

## Success Criteria

1. ✅ Can pass `thinking` parameter to Anthropic models
2. ✅ Properly streams thinking deltas as reasoning events
3. ✅ Preserves thinking blocks with signatures for multi-turn
4. ✅ Handles redacted thinking blocks
5. ✅ All existing tests pass
6. ✅ New tests for extended thinking pass
7. ✅ Documentation is complete

## Notes

- This is a significant feature that touches many parts of the codebase
- We should maintain backward compatibility with existing reasoning detection
- Consider making this a v1.3.0 release due to scope
- May want to implement behind a feature flag initially

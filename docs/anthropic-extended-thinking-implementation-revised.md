# Anthropic Extended Thinking Implementation - Revised Plan

## Key Change: Thinking Configuration

The Graphlit API already supports thinking configuration in the specification object:

```typescript
// Correct approach - thinking is configured in the specification
const spec = await client.createSpecification({
  name: "Thinking Assistant",
  serviceType: Types.ModelServiceTypes.Anthropic,
  anthropic: {
    model: Types.AnthropicModels.Claude_3_7Sonnet,
    enableThinking: true,                    // ← Enable thinking
    thinkingTokenLimit: 10000,              // ← Set thinking budget
    completionTokenLimit: 16000
  }
});

// Then just use streamAgent normally
await client.streamAgent(
  "Complex reasoning task...",
  handleEvents,
  conversationId,
  { id: spec.createSpecification.id }  // Specification contains thinking config
);
```

NOT this:
```typescript
// WRONG - DO NOT add thinking to streamAgent options
await client.streamAgent(
  prompt,
  handler,
  conversationId,
  spec,
  tools,
  toolHandlers,
  { thinking: { ... } }  // ❌ WRONG
);
```

## Updated Implementation Plan

### Phase 1: Client Updates

#### 1.1 Read Thinking Config from Specification
```typescript
// src/client.ts
private getThinkingConfig(specification: any): ThinkingConfig | undefined {
  // Check Anthropic specs
  if (specification.serviceType === Types.ModelServiceTypes.Anthropic) {
    const anthropic = specification.anthropic;
    if (anthropic?.enableThinking) {
      return {
        type: 'enabled',
        budget_tokens: anthropic.thinkingTokenLimit || 10000
      };
    }
  }
  
  // Check Google specs (also supports thinking)
  if (specification.serviceType === Types.ModelServiceTypes.Google) {
    const google = specification.google;
    if (google?.enableThinking) {
      return {
        type: 'enabled',
        budget_tokens: google.thinkingTokenLimit || 10000
      };
    }
  }
  
  return undefined;
}
```

#### 1.2 Update streamWithAnthropic
```typescript
// src/client.ts
private async *streamWithAnthropic(
  conversationId: string,
  specification: any,
  messages: any[],
  tools?: any[],
  signal?: AbortSignal
): AsyncGenerator<InternalStreamEvent> {
  const model = this.getAnthropicModel(specification);
  
  // Get thinking config from specification
  const thinkingConfig = this.getThinkingConfig(specification);
  
  const streamParams: any = {
    model,
    messages,
    max_tokens: specification.anthropic?.completionTokenLimit || 4096,
    stream: true,
  };

  // Add thinking if enabled in specification
  if (thinkingConfig) {
    streamParams.thinking = thinkingConfig;
    
    // Adjust max_tokens to account for thinking budget
    const totalTokens = streamParams.max_tokens + thinkingConfig.budget_tokens;
    if (totalTokens > 200000) {
      console.warn(`Total tokens (${totalTokens}) exceeds context window, adjusting...`);
      streamParams.max_tokens = 200000 - thinkingConfig.budget_tokens;
    }
  }

  // ... rest of implementation
}
```

### Phase 2: Provider Updates

#### 2.1 Detect Thinking Support
```typescript
// src/streaming/providers.ts
function supportsThinking(specification: any): boolean {
  if (specification.serviceType === Types.ModelServiceTypes.Anthropic) {
    const model = specification.anthropic?.model;
    // Check if model supports thinking
    const thinkingModels = [
      Types.AnthropicModels.Claude_3_7Sonnet,
      Types.AnthropicModels.Claude_4Opus,
      Types.AnthropicModels.Claude_4Sonnet
    ];
    return thinkingModels.includes(model) && specification.anthropic?.enableThinking;
  }
  
  if (specification.serviceType === Types.ModelServiceTypes.Google) {
    const model = specification.google?.model;
    // Gemini Flash 2.5+ supports thinking
    return model === Types.GoogleModels.Gemini_2_5Flash && 
           specification.google?.enableThinking;
  }
  
  return false;
}
```

#### 2.2 Pass Thinking to Provider
```typescript
// src/streaming/providers.ts
export function* streamWithAnthropic(
  client: Anthropic,
  params: AnthropicStreamParams,
  signal?: AbortSignal
): Generator<InternalStreamEvent> {
  // Check if thinking is configured
  const hasThinking = params.thinking?.type === 'enabled';
  
  if (hasThinking) {
    // Use thinking-aware processor
    yield* streamWithAnthropicThinking(client, params, signal);
  } else {
    // Use standard processor
    yield* streamWithAnthropicStandard(client, params, signal);
  }
}
```

### Phase 3: Types Updates

#### 3.1 Internal Types (No API Changes)
```typescript
// src/types/internal.ts
// These are internal only - NOT exposed in streamAgent API
export interface ThinkingConfig {
  type: 'enabled';
  budget_tokens: number;
}

export interface ThinkingContext {
  enabled: boolean;
  budgetTokens: number;
  preserveBlocks: boolean;  // For multi-turn
}
```

### Phase 4: Multi-turn Support

#### 4.1 Preserve Thinking Based on Specification
```typescript
// src/client.ts
private shouldPreserveThinking(
  specification: any,
  hasTools: boolean
): boolean {
  // Always preserve thinking blocks if:
  // 1. Thinking is enabled in the spec
  // 2. We're in a tool-use continuation
  const thinkingEnabled = 
    specification.anthropic?.enableThinking || 
    specification.google?.enableThinking;
    
  return thinkingEnabled && hasTools;
}
```

### Phase 5: Testing Examples

#### 5.1 Create Thinking Specification
```typescript
// test/anthropic-thinking.test.ts
describe('Anthropic Extended Thinking', () => {
  let client: Graphlit;
  let thinkingSpec: any;
  
  beforeAll(async () => {
    client = new Graphlit();
    
    // Create specification with thinking enabled
    const spec = await client.createSpecification({
      name: "Thinking Test Spec",
      serviceType: Types.ModelServiceTypes.Anthropic,
      anthropic: {
        model: Types.AnthropicModels.Claude_3_7Sonnet,
        enableThinking: true,           // ← Enable thinking
        thinkingTokenLimit: 10000,      // ← Set budget
        completionTokenLimit: 16000
      }
    });
    
    thinkingSpec = { id: spec.createSpecification.id };
  });
  
  it('should use thinking when enabled in spec', async () => {
    const events: AgentStreamEvent[] = [];
    
    // Just use normal streamAgent - thinking is in the spec
    await client.streamAgent(
      "What is 25% of 80? Think step by step.",
      (event) => events.push(event),
      undefined,
      thinkingSpec  // ← Spec has thinking enabled
    );
    
    // Should have reasoning events
    const reasoningEvents = events.filter(e => e.type === 'reasoning_update');
    expect(reasoningEvents.length).toBeGreaterThan(0);
  });
});
```

#### 5.2 Compare With/Without Thinking
```typescript
it('should only emit thinking when enabled', async () => {
  // Spec WITHOUT thinking
  const normalSpec = await client.createSpecification({
    name: "Normal Spec",
    serviceType: Types.ModelServiceTypes.Anthropic,
    anthropic: {
      model: Types.AnthropicModels.Claude_3_7Sonnet,
      enableThinking: false  // ← Thinking disabled
    }
  });
  
  // Spec WITH thinking
  const thinkingSpec = await client.createSpecification({
    name: "Thinking Spec",
    serviceType: Types.ModelServiceTypes.Anthropic,
    anthropic: {
      model: Types.AnthropicModels.Claude_3_7Sonnet,
      enableThinking: true,
      thinkingTokenLimit: 5000
    }
  });
  
  // Test without thinking
  const eventsWithout: AgentStreamEvent[] = [];
  await client.streamAgent(
    "Complex math problem...",
    (e) => eventsWithout.push(e),
    undefined,
    { id: normalSpec.createSpecification.id }
  );
  
  // Test with thinking
  const eventsWith: AgentStreamEvent[] = [];
  await client.streamAgent(
    "Complex math problem...",
    (e) => eventsWith.push(e),
    undefined,
    { id: thinkingSpec.createSpecification.id }
  );
  
  // Verify
  const reasoningWithout = eventsWithout.filter(e => e.type === 'reasoning_update');
  const reasoningWith = eventsWith.filter(e => e.type === 'reasoning_update');
  
  expect(reasoningWithout.length).toBe(0);
  expect(reasoningWith.length).toBeGreaterThan(0);
});
```

### Phase 6: Documentation

#### User Guide Example
```markdown
## Enabling Extended Thinking

Extended thinking is configured when creating a specification:

```typescript
// Create a specification with thinking enabled
const spec = await client.createSpecification({
  name: "Advanced Reasoning Assistant",
  serviceType: Types.ModelServiceTypes.Anthropic,
  anthropic: {
    model: Types.AnthropicModels.Claude_3_7Sonnet,
    enableThinking: true,          // Enable extended thinking
    thinkingTokenLimit: 20000,     // Set thinking budget (min 1024)
    completionTokenLimit: 16000    // Regular completion tokens
  }
});

// Use the specification - thinking happens automatically
await client.streamAgent(
  "Solve this complex problem step by step...",
  (event) => {
    if (event.type === 'reasoning_update') {
      console.log('AI is thinking:', event.content);
    } else if (event.type === 'message_update') {
      console.log('Answer:', event.message.message);
    }
  },
  undefined,
  { id: spec.createSpecification.id }
);
```

### Supported Models

**Anthropic Models with Thinking:**
- Claude 3.7 Sonnet (`claude-3-7-sonnet-20250219`)
- Claude 4 Opus (`claude-opus-4-20250514`)
- Claude 4 Sonnet (`claude-sonnet-4-20250514`)

**Google Models with Thinking:**
- Gemini 2.5 Flash and higher

### Configuration Options

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| `enableThinking` | boolean | Enable extended thinking | false |
| `thinkingTokenLimit` | number | Max tokens for thinking (min 1024) | 10000 |
```

## Summary of Changes

1. **No API changes to `streamAgent`** - Thinking configuration comes from the specification
2. **Use existing GraphQL fields** - `enableThinking` and `thinkingTokenLimit` 
3. **Support both Anthropic and Google** - Both have thinking support in specs
4. **Cleaner implementation** - No need to pass thinking config through method calls
5. **Better alignment** - Matches how other model parameters work (temperature, etc.)

## Implementation Priority

1. **Week 1**: Core thinking stream processing for Anthropic
2. **Week 2**: Multi-turn conversation support with thinking preservation
3. **Week 3**: Google Gemini thinking support
4. **Week 4**: Testing, documentation, and release

This approach is much cleaner and aligns with how Graphlit already handles model-specific configurations!
# Anthropic Extended Thinking - Implementation Summary

## Overview

Full native Anthropic extended thinking support has been implemented in the Graphlit TypeScript SDK. This provides access to Claude's enhanced reasoning capabilities through dedicated thinking blocks with proper streaming, multi-turn preservation, and signature handling.

## What Was Implemented

### 1. Specification-Based Configuration ✅

- Added `getThinkingConfig()` method in `client.ts` to read thinking settings from specifications
- Supports both Anthropic and Google specifications
- Reads `enableThinking` and `thinkingTokenLimit` from the specification object
- No API changes to `streamAgent` - configuration comes from the specification

### 2. Native API Support ✅

- Updated `streamWithAnthropic()` to accept thinking configuration
- Passes `thinking: { type: 'enabled', budget_tokens: N }` to Anthropic API
- Automatically adjusts `max_tokens` to account for thinking budget
- Prevents context window overflow (200K token limit)

### 3. Thinking Event Handling ✅

- Enhanced Anthropic provider to handle native thinking events:
  - `content_block_start` with `type: "thinking"`
  - `content_block_delta` with `thinking_delta` and `signature_delta`
  - `content_block_stop` for thinking blocks
- Tracks thinking content and signatures separately
- Emits proper reasoning events with thinking format

### 4. UI Event Adapter Updates ✅

- Updated `handleReasoningEnd()` to accept signature parameter
- Stores thinking signatures for potential multi-turn use
- Enhanced logging for thinking events with signature information
- Maintains backward compatibility with existing reasoning detection

### 5. Multi-turn Preservation ✅

- Updated Anthropic message formatter to preserve thinking blocks
- Detects thinking content in message text (for backward compatibility)
- Properly structures thinking blocks with signatures for Anthropic API
- Filters thinking content from regular text display

### 6. Type System Updates ✅

- Added `signature?: string` field to `reasoning_end` events in `internal.ts`
- Updated UI event adapter to handle signature field
- Maintains type safety throughout the thinking pipeline

## How to Use

### Enable Extended Thinking

```typescript
// Create a specification with thinking enabled
const spec = await client.createSpecification({
  name: "Advanced Reasoning Assistant",
  serviceType: Types.ModelServiceTypes.Anthropic,
  anthropic: {
    model: Types.AnthropicModels.Claude_3_7Sonnet,
    enableThinking: true, // Enable extended thinking
    thinkingTokenLimit: 20000, // Set thinking budget
    completionTokenLimit: 16000, // Regular completion tokens
  },
});

// Use the specification - thinking happens automatically
await client.streamAgent(
  "Solve this complex problem step by step...",
  (event) => {
    if (event.type === "reasoning_update") {
      console.log("AI is thinking:", event.content);
      console.log("Is complete:", event.isComplete);
      console.log("Format:", event.format); // "thinking_tag"
    } else if (event.type === "message_update") {
      console.log("Answer:", event.message.message);
    }
  },
  undefined,
  { id: spec.createSpecification.id },
);
```

### Supported Models

**Anthropic Models with Extended Thinking:**

- Claude 3.7 Sonnet (`claude-3-7-sonnet-20250219`)
- Claude 4 Opus (`claude-opus-4-20250514`)
- Claude 4 Sonnet (`claude-sonnet-4-20250514`)

**Configuration Options:**

| Field                | Type    | Description                        | Default |
| -------------------- | ------- | ---------------------------------- | ------- |
| `enableThinking`     | boolean | Enable extended thinking           | false   |
| `thinkingTokenLimit` | number  | Max tokens for thinking (min 1024) | 10000   |

## Key Features

### Native API Integration

- Uses Anthropic's official thinking parameter (not pattern detection)
- Proper streaming of thinking deltas and signatures
- Automatic token budget management

### Multi-turn Conversations

- Preserves thinking blocks between conversation turns
- Maintains thinking signatures for consistency
- Supports tool calling with thinking

### Backward Compatibility

- Existing reasoning detection still works
- No breaking changes to existing APIs
- Graceful fallback for models without thinking support

### Debug Support

- Comprehensive logging with `DEBUG_GRAPHLIT_SDK_STREAMING=1`
- Thinking-specific log messages with 🧠 prefix
- Token budget and performance tracking

## Testing

Run the extended thinking tests:

```bash
npm test test/anthropic-extended-thinking.test.ts
```

Tests cover:

- Basic thinking functionality vs. disabled thinking
- Thinking with tool calling
- Token limit respect
- Multi-turn preservation

## Performance Considerations

- Thinking tokens count toward total context window
- SDK automatically adjusts completion tokens to prevent overflow
- Thinking budget is separate from completion token limit
- Signatures help with multi-turn efficiency

## Implementation Files Modified

1. **`src/client.ts`**
   - Added `getThinkingConfig()` method
   - Updated `streamWithAnthropic()` to pass thinking config

2. **`src/streaming/providers.ts`**
   - Enhanced `streamWithAnthropic()` with thinking parameter
   - Added native thinking event handling
   - Improved content block tracking

3. **`src/types/internal.ts`**
   - Added `signature?` field to `reasoning_end` event

4. **`src/streaming/ui-event-adapter.ts`**
   - Updated reasoning event handlers for signatures
   - Enhanced debugging output

5. **`src/streaming/llm-formatters.ts`**
   - Added thinking block preservation in message formatting
   - Backward compatibility for thinking tag detection

6. **Tests**
   - Created comprehensive test suite for extended thinking

## Next Steps

This implementation provides full native extended thinking support. Future enhancements could include:

1. **Enhanced Multi-turn**: Store thinking blocks and signatures in conversation history
2. **Thinking Analytics**: Expose thinking token usage and performance metrics
3. **Google Gemini**: Implement similar thinking support for Google models
4. **Thinking Controls**: Add API to request specific thinking styles or focus areas

The implementation is production-ready and provides a significant upgrade to Claude's reasoning capabilities in the Graphlit SDK.

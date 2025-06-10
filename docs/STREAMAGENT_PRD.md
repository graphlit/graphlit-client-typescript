# StreamAgent Implementation PRD

## Overview
Implement `streamAgent` method to provide real-time streaming LLM responses with automatic tool execution, smart buffering, and ChatGPT-quality UX. This replaces the broken `streamAgent` stub with a production-ready implementation.

## Goals
1. **Clean Developer Experience**: Simple API with minimal options
2. **ChatGPT-quality Streaming**: Smooth, natural token emission with smart buffering
3. **Robust Tool Execution**: Handle complex multi-round agent workflows
4. **Type Safety**: Reuse existing GraphQL types, avoid custom types
5. **Provider Agnostic**: Work with OpenAI, Anthropic, Google, and fallback mode

## API Design

### Method Signature
```typescript
public async streamAgent(
  prompt: string,
  onEvent: (event: UIStreamEvent) => void,
  conversationId?: string,
  specification?: Types.EntityReferenceInput,
  tools?: Types.ToolDefinitionInput[],
  toolHandlers?: Record<string, ToolHandler>,
  options?: StreamAgentOptions,
  mimeType?: string,
  data?: string, // base64 encoded
  correlationId?: string
): Promise<void>
```

### Simplified Options
```typescript
interface StreamAgentOptions {
  maxToolRounds?: number;        // default: 100
  abortSignal?: AbortSignal;
  showTokenStream?: boolean;     // default: true
}
```

### Event Types (Reusing GraphQL Types)
```typescript
export type UIStreamEvent =
  | {
      type: "conversation_started";
      conversationId: string;
      timestamp: Date;
      model?: string;
    }
  | {
      type: "message_update";
      message: Partial<ConversationMessage>; // Reuse GraphQL type
      isStreaming: boolean;
    }
  | {
      type: "tool_update";
      toolCall: ConversationToolCall; // Reuse GraphQL type
      status: "preparing" | "executing" | "completed" | "failed";
      result?: any;
      error?: string;
    }
  | {
      type: "conversation_completed";
      message: ConversationMessage; // Final complete message with usage
    }
  | {
      type: "error";
      error: {
        message: string;
        code?: string;
        recoverable?: boolean;
      };
      conversationId: string;
    };
```

## Implementation TODOs

### 1. Core Method Structure
- [ ] **TODO-001**: Create main `streamAgent` method with signature
- [ ] **TODO-002**: Add parameter validation and early returns
- [ ] **TODO-003**: Set up abort signal handling and timeout
- [ ] **TODO-004**: Add try/catch with proper error event emission

### 2. Conversation Setup
- [ ] **TODO-005**: Fix `supportsStreaming` to check specification model service type
- [ ] **TODO-006**: Create conversation if conversationId not provided
- [ ] **TODO-007**: Get full specification details if only ID provided
- [ ] **TODO-008**: Determine streaming provider (OpenAI/Anthropic/Google) from specification

### 3. Message Formatting & History
- [ ] **TODO-009**: Call `formatConversation` to get properly formatted prompt with history
- [ ] **TODO-010**: Build message array for LLM SDK (system prompt + history + current prompt)
- [ ] **TODO-011**: Handle multimodal data (mimeType/data parameters)

### 4. Event Emission System
- [ ] **TODO-012**: Create `UIEventEmitter` class to handle event emission
- [ ] **TODO-013**: Implement message accumulation and update interval batching
- [ ] **TODO-014**: Add usage tracking (always include when available)
- [ ] **TODO-015**: Handle `showTokenStream` option (real-time vs batch updates)

### 5. Smart Buffering & Chunking
- [ ] **TODO-016**: Integrate existing `ChunkBuffer` for smooth streaming
- [ ] **TODO-017**: Configure chunking strategy (default to word chunking)
- [ ] **TODO-018**: Add provider-specific delays (OpenAI: 20ms, Anthropic: 30ms, Google: 40ms)
- [ ] **TODO-019**: Handle edge cases (emojis, punctuation, JSON responses)

### 6. Native LLM Streaming
- [ ] **TODO-020**: Implement `streamWithProvider` method for OpenAI
- [ ] **TODO-021**: Implement `streamWithProvider` method for Anthropic  
- [ ] **TODO-022**: Implement `streamWithProvider` method for Google
- [ ] **TODO-023**: Add fallback to `promptConversation` when streaming unavailable
- [ ] **TODO-024**: Handle provider-specific message formats and tool calling

### 7. Tool Execution Loop
- [ ] **TODO-025**: Detect tool calls during streaming
- [ ] **TODO-026**: Accumulate tool call arguments from deltas
- [ ] **TODO-027**: Execute tools with provided handlers when complete
- [ ] **TODO-028**: Emit tool status events (preparing → executing → completed/failed)
- [ ] **TODO-029**: Continue streaming with tool results
- [ ] **TODO-030**: Implement maxToolRounds limit with proper termination

### 8. Conversation Completion
- [ ] **TODO-031**: Call `completeConversation` to save final response
- [ ] **TODO-032**: Emit final `conversation_completed` event with usage stats
- [ ] **TODO-033**: Clean up resources (timers, buffers, abort listeners)

### 9. Error Handling & Recovery
- [ ] **TODO-034**: Handle streaming errors gracefully
- [ ] **TODO-035**: Implement retry logic for transient failures
- [ ] **TODO-036**: Handle tool execution errors without breaking stream
- [ ] **TODO-037**: Ensure proper cleanup on abort signal

### 10. Testing & Validation
- [ ] **TODO-038**: Update existing 100+ tests in /test to match new streamAgent API signature
- [ ] **TODO-039**: Fix any parameter mapping changes in test suite

## Success Criteria

### Functional Requirements
✅ Stream responses with ChatGPT-quality smoothness  
✅ Execute tools automatically during streaming  
✅ Handle complex multi-round agent workflows (up to 100 rounds)  
✅ Support all major LLM providers (OpenAI, Anthropic, Google)  
✅ Graceful fallback when streaming unavailable  
✅ Proper error handling and recovery  

### Developer Experience
✅ Simple API with only essential options  
✅ Type-safe events using existing GraphQL types  
✅ Clear event lifecycle for UI development  
✅ Consistent behavior across providers  
✅ Easy abort/cancellation support  

### Performance Requirements
✅ < 30ms average latency for token emission  
✅ Smooth streaming without flicker  
✅ Efficient memory usage during long conversations  
✅ Proper cleanup of resources  

## Implementation Priority

**Phase 1 (Core)**: TODO-001 through TODO-015  
**Phase 2 (Streaming)**: TODO-016 through TODO-024  
**Phase 3 (Tools)**: TODO-025 through TODO-030  
**Phase 4 (Completion)**: TODO-031 through TODO-037  
**Phase 5 (Testing)**: TODO-038 through TODO-039  

Ready to start with Phase 1?
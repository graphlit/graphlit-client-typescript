# Comprehensive Test Plan for streamConversation Next.js Integration

## Overview

This test plan outlines additional test scenarios needed before integrating `streamConversation` into production Next.js applications. All tests use real SDK calls without mocks to ensure production reliability.

## Test Categories

### 1. Concurrent Conversations & Race Conditions

**Purpose**: Validate multiple simultaneous conversations don't interfere with each other

**Test Cases**:

- Start 5 conversations in parallel with different prompts
- Ensure each maintains separate context and conversation IDs
- Verify no event cross-contamination between conversations
- Test conversation-specific tool calls don't overlap
- Validate proper event routing to correct callbacks

**Key Validations**:

- Unique conversation IDs for each stream
- Isolated message histories
- No shared state between instances
- Correct event handler invocation

### 2. Streaming Cancellation & Cleanup

**Purpose**: Handle user navigation/cancellation gracefully in React environments

**Test Cases**:

- Start streaming, then cancel mid-response using AbortController
- Verify proper cleanup (no memory leaks, dangling promises)
- Test cancellation at different stages:
  - Before first token arrives
  - Mid-stream during content generation
  - During tool call execution
  - After completion but before cleanup
- Ensure cancelled conversations can be resumed
- Test rapid start/cancel cycles

**Key Validations**:

- No console errors on cancellation
- Event listeners properly removed
- Memory usage returns to baseline
- Conversation state preserved for resumption

### 3. Error Recovery & Resilience

**Purpose**: Handle real-world failures gracefully without crashing the UI

**Test Cases**:

- Network timeout simulation (long delays)
- API rate limit errors (429 responses)
- Invalid/expired authentication tokens
- Malformed tool responses
- Server errors (500, 503) with retry logic
- Partial response handling (connection drops mid-stream)
- GraphQL query errors
- Invalid specification IDs

**Key Validations**:

- Appropriate error events emitted
- User-friendly error messages
- Automatic retry with backoff
- Graceful degradation
- No infinite loops or hanging states

### 4. Large Response & Memory Management

**Purpose**: Handle edge cases with content size and long conversations

**Test Cases**:

- Request very long responses (10K+ tokens)
- Monitor memory usage during extended conversations
- Test with 100+ messages in single conversation
- Verify proper cleanup of large event arrays
- Test streaming performance degradation over time
- Handle conversations exceeding context windows

**Key Validations**:

- Linear memory growth (no exponential leaks)
- Consistent streaming performance
- Proper garbage collection
- Event buffer limits respected
- Smooth UI performance maintained

### 5. Complex Tool Orchestration

**Purpose**: Validate advanced tool calling scenarios common in production

**Test Cases**:

- Multiple tools in single request (e.g., search + calculate + format)
- Sequential tool chains (output of A feeds into B)
- Parallel tool execution with dependencies
- Tool error handling and fallback strategies
- Tools with file/image inputs and outputs
- Long-running async tools with progress updates
- Conditional tool execution based on results
- Recursive tool calls with depth limits

**Key Validations**:

- Correct execution order
- Proper parameter passing
- Error propagation
- Progress event accuracy
- Result aggregation

### 6. Multimodal Streaming

**Purpose**: Test image/file handling in streaming conversations

**Test Cases**:

- Stream conversation with image inputs
- Handle image generation responses
- Test file upload progress events
- Binary data in tool responses
- Mixed text/image streaming
- Large file handling (>10MB)
- Multiple images in single message

**Key Validations**:

- Proper base64 encoding/decoding
- Progress event accuracy
- Memory efficiency with large files
- Correct MIME type handling

### 7. Real-time Status & Progress

**Purpose**: Validate UI feedback mechanisms for better UX

**Test Cases**:

- Token counting accuracy during streaming
- Progress indicators for long operations
- Queue position updates for busy models
- Cost estimation events
- Latency monitoring events
- Time-to-first-token measurements
- Throughput metrics (tokens/second)

**Key Validations**:

- Metric accuracy within 5%
- Real-time updates without lag
- No performance impact from monitoring
- Correct aggregation of metrics

### 8. Session & State Management

**Purpose**: Test conversation persistence across sessions

**Test Cases**:

- Resume conversation after connection loss
- Conversation state serialization/deserialization
- Browser refresh handling
- Cross-tab synchronization
- Offline queue for messages
- Local storage integration
- Session timeout handling

**Key Validations**:

- State consistency after recovery
- No duplicate messages
- Proper event replay
- Secure state storage

### 9. Performance Under Load

**Purpose**: Stress test the streaming infrastructure

**Test Cases**:

- 20 rapid sequential messages
- 50 concurrent users simulation
- Memory leak detection over 100+ messages
- Event handler performance with 1000+ events
- Smooth scrolling with rapid updates
- CPU usage monitoring
- Network bandwidth optimization

**Key Validations**:

- Response time < 2s for 95th percentile
- Memory growth < 100MB per conversation
- No UI freezing or jank
- Consistent frame rates

### 10. Next.js Specific Integration

**Purpose**: Validate server/client streaming scenarios

**Test Cases**:

- Server-side streaming through API routes
- Client-side hydration of ongoing streams
- Middleware integration for authentication
- Edge runtime compatibility
- App Router vs Pages Router differences
- Server Components with streaming
- Suspense boundary integration
- ISR/SSG compatibility

**Key Validations**:

- Proper hydration without errors
- SEO-friendly initial content
- Edge function size limits
- Streaming headers correct

### 11. Advanced Streaming Options

**Purpose**: Test all configuration permutations

**Test Cases**:

- Different chunking strategies under load:
  - Character-by-character
  - Word-by-word
  - Sentence-by-sentence
  - Custom regex patterns
- Custom delays and buffering
- Token filtering and transformation
- Event aggregation strategies
- Custom retry policies

**Key Validations**:

- Configuration changes apply correctly
- Performance impact documented
- No option combinations cause errors
- Defaults are optimal

### 12. Conversation Branching

**Purpose**: Test conversation forking functionality

**Test Cases**:

- Branch conversation at specific message
- Maintain separate contexts for each branch
- Switch between branches seamlessly
- Merge conversation branches
- Delete branch without affecting parent
- Branch from tool call results
- Multi-level branching (branch of branch)

**Key Validations**:

- Branch isolation
- Correct parent references
- Memory efficiency
- UI state management

## Implementation Strategy

### Priority Levels

**High Priority** (Week 1):

1. ✅ Concurrent conversations - `concurrent-conversations.test.ts`
2. ✅ Streaming cancellation - `streaming-cancellation.test.ts`
3. ✅ Error recovery - `error-recovery.test.ts`
4. ✅ Basic performance tests - `performance-tests.test.ts`

**Medium Priority** (Week 2): 5. ✅ Multimodal streaming - `multimodal-streaming.test.ts` 6. ✅ Complex tool orchestration - `complex-tool-orchestration.test.ts` 7. ✅ Large response handling - `large-response-handling.test.ts` 8. Real-time status & progress 9. Session & state management

**Lower Priority** (Week 3): 10. Next.js specific tests 11. Advanced options 12. Conversation branching 13. Performance under load (extensive)

### Test Structure

```typescript
describe("Production Scenarios", () => {
  describe("Concurrent Conversations", () => {
    it("should handle 5 parallel conversations without interference", async () => {
      // Implementation
    });

    it("should maintain separate tool contexts", async () => {
      // Implementation
    });
  });

  describe("Streaming Cancellation", () => {
    it("should cleanup properly on abort", async () => {
      // Implementation with AbortController
    });

    it("should allow resumption after cancel", async () => {
      // Implementation
    });
  });

  // Additional test suites...
});
```

### Success Criteria

1. **All tests pass** with real API calls (no mocks)
2. **Performance benchmarks** documented
3. **Memory usage** stays within acceptable bounds
4. **Error scenarios** handled gracefully
5. **Next.js integration** works in both App and Pages routers
6. **Documentation** updated with findings

### Testing Environment

- Node.js 18+ for consistency with Next.js
- Real Graphlit API endpoints
- Multiple LLM providers (OpenAI, Anthropic, Google)
- Vitest for test execution
- Memory/CPU profiling tools
- Network condition simulation

## Deliverables

1. **Test Implementation**: All test cases in `comprehensive-integration.test.ts`
2. **Performance Report**: Benchmarks and optimization recommendations
3. **Integration Guide**: Next.js-specific setup instructions
4. **Error Catalog**: Common errors and solutions
5. **Best Practices**: Do's and don'ts for production use

## Timeline

- **Week 1**: High priority tests + initial performance baseline
- **Week 2**: Medium priority tests + Next.js integration
- **Week 3**: Lower priority tests + documentation
- **Week 4**: Performance optimization + final validation

This comprehensive testing ensures the `streamConversation` feature is production-ready for Next.js applications with proper error handling, performance, and user experience.

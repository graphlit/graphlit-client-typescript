# Streaming Events Flow Documentation

## Overview
This document describes the expected sequence of events when using `streamAgent` with tool calls, particularly for scenarios with multiple tool invocations.

## Event Types

### 1. `conversation_started`
- **When**: Immediately after the conversation begins
- **Data**: `conversationId: string`
- **UI Action**: Store conversation ID, show conversation started indicator

### 2. `message_update`
- **When**: Throughout the streaming response
- **Data**: 
  ```typescript
  {
    message: {
      message: string,      // Incremental content
      role: 'ASSISTANT',
      isStreaming: boolean, // true during streaming, false when complete
      model?: string,
      modelService?: string,
      tokens?: number,
      throughput?: number,
      completionTime?: number
    },
    isFinal: boolean,
    metrics?: AgentMetrics
  }
  ```
- **UI Action**: 
  - If `isStreaming: true` - Append content to display
  - If `isStreaming: false` - Mark message as complete

### 3. `tool_update`
- **When**: For each tool call
- **Data**:
  ```typescript
  {
    toolCall: {
      name: string,
      arguments: string | object  // May be JSON string
    },
    status: 'preparing' | 'executing' | 'ready' | 'completed' | 'failed',
    result?: any,    // Only when status is 'completed'
    error?: string   // Only when status is 'failed'
  }
  ```
- **UI Action**: Update tool status display based on status

### 4. `conversation_completed`
- **When**: After all processing is complete
- **Data**:
  ```typescript
  {
    message: {
      message: string,      // Final complete message
      role: 'ASSISTANT',
      model?: string,
      modelService?: string,
      tokens?: number,
      throughput?: number,
      completionTime?: number
    },
    metrics?: {
      totalTime: number,
      llmTokens: number,
      toolExecutions: number,
      toolTime?: number,
      llmTime?: number,
      rounds?: number,
      ttft?: number,
      streamingThroughput?: number
    },
    contextWindow?: {
      usedTokens: number,
      maxTokens: number
    }
  }
  ```
- **UI Action**: Finalize display, show metrics

### 5. `error`
- **When**: If an error occurs
- **Data**:
  ```typescript
  {
    error: {
      message: string,
      code?: string,
      recoverable?: boolean
    }
  }
  ```
- **UI Action**: Display error message

## Expected Event Sequence for Multiple Tool Calls

For the prompt: **"search for highlight videos for Mason Marchment and Connor McDavid (separately)"**

```
1. conversation_started
   - conversationId: "abc-123..."

2. message_update (streaming starts)
   - message: "I'll search for highlight videos for both..."
   - isStreaming: true

3. tool_update (First tool - Mason Marchment)
   - toolCall.name: "webSearch"
   - status: "preparing"

4. tool_update
   - toolCall.name: "webSearch"
   - toolCall.arguments: {"query": "Mason Marchment highlight videos NHL"}
   - status: "executing"

5. tool_update (Second tool - Connor McDavid)
   - toolCall.name: "webSearch"
   - status: "preparing"

6. tool_update
   - toolCall.name: "webSearch"
   - toolCall.arguments: {"query": "Connor McDavid highlight videos NHL"}
   - status: "executing"

7. tool_update (Tools can execute in parallel)
   - toolCall.name: "webSearch"
   - status: "ready"

8. tool_update
   - toolCall.name: "webSearch"
   - status: "ready"

9. tool_update (First completion)
   - toolCall.name: "webSearch"
   - toolCall.arguments: {"query": "Mason Marchment highlight videos NHL"}
   - status: "completed"
   - result: { results: [...] }

10. tool_update (Second completion)
    - toolCall.name: "webSearch"
    - toolCall.arguments: {"query": "Connor McDavid highlight videos NHL"}
    - status: "completed"
    - result: { results: [...] }

11. message_update (continues streaming)
    - message: "Here are highlight videos for each player:\n\nMason Marchment:..."
    - isStreaming: true

12. message_update (more content)
    - message: "...Connor McDavid:..."
    - isStreaming: true

13. message_update (final)
    - message: "...Would you like me to gather more?"
    - isStreaming: false
    - isFinal: true

14. conversation_completed
    - message: (complete final message)
    - metrics: { toolExecutions: 2, ... }
```

## UI State Management Best Practices

### 1. Tool Calls Array
Maintain an array of tool calls, not a single tool call:

```typescript
interface ToolCallState {
  id: string;           // Generate unique ID
  name: string;
  arguments: any;
  status: 'preparing' | 'executing' | 'ready' | 'completed' | 'failed';
  result?: any;
  error?: string;
  startTime: Date;
  endTime?: Date;
}

const [toolCalls, setToolCalls] = useState<ToolCallState[]>([]);
```

### 2. Handle Tool Updates Correctly
```typescript
case 'tool_update':
  const toolKey = `${event.toolCall.name}-${JSON.stringify(event.toolCall.arguments)}`;
  
  setToolCalls(prev => {
    const existingIndex = prev.findIndex(tc => 
      tc.name === event.toolCall.name && 
      JSON.stringify(tc.arguments) === JSON.stringify(event.toolCall.arguments)
    );
    
    if (existingIndex >= 0) {
      // Update existing tool call
      const updated = [...prev];
      updated[existingIndex] = {
        ...updated[existingIndex],
        status: event.status,
        result: event.result,
        error: event.error,
        endTime: event.status === 'completed' || event.status === 'failed' 
          ? new Date() 
          : undefined
      };
      return updated;
    } else {
      // Add new tool call
      return [...prev, {
        id: generateId(),
        name: event.toolCall.name,
        arguments: event.toolCall.arguments,
        status: event.status,
        result: event.result,
        error: event.error,
        startTime: new Date()
      }];
    }
  });
  break;
```

### 3. Display All Tool Calls
Show all tool calls in the UI, not just the last one:

```tsx
{toolCalls.map(toolCall => (
  <ToolCallDisplay
    key={toolCall.id}
    name={toolCall.name}
    arguments={toolCall.arguments}
    status={toolCall.status}
    result={toolCall.result}
    error={toolCall.error}
  />
))}
```

## Common Pitfalls to Avoid

1. **Don't use a single state variable** for the current tool call
2. **Don't overwrite tool calls** - always append or update by matching
3. **Parse string arguments** - `toolCall.arguments` might be a JSON string
4. **Handle parallel execution** - Tools can run simultaneously
5. **Track completion order** - Tools may complete in different order than started

## Testing Checklist

- [ ] Single tool call displays correctly
- [ ] Multiple sequential tool calls all display
- [ ] Parallel tool calls show proper status
- [ ] Tool results are associated with correct tool call
- [ ] Failed tool calls show error state
- [ ] Tool call history persists through conversation
- [ ] Metrics show correct `toolExecutions` count
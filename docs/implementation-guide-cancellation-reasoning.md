# Implementation Guide: Cancellation & Reasoning Events

This guide helps you implement the new v1.2.0 features in your applications: stream cancellation and reasoning event handling.

## Table of Contents
- [Stream Cancellation](#stream-cancellation)
  - [Basic Cancellation](#basic-cancellation)
  - [UI Integration](#ui-integration)
  - [Advanced Patterns](#advanced-patterns)
- [Reasoning Events](#reasoning-events)
  - [Basic Reasoning Detection](#basic-reasoning-detection)
  - [UI Components](#ui-components)
  - [Provider-Specific Handling](#provider-specific-handling)
- [Combined Implementation](#combined-implementation)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Stream Cancellation

### Basic Cancellation

The simplest way to implement cancellation is using the Web API's `AbortController`:

```typescript
import { Graphlit } from 'graphlit-client';

const client = new Graphlit();

// Create an abort controller
const controller = new AbortController();

// Start streaming
try {
  await client.streamAgent(
    "Write a detailed analysis of climate change...",
    (event) => {
      if (event.type === "message_update") {
        console.log(event.message.message);
      }
    },
    undefined,
    { id: specificationId },
    undefined,
    undefined,
    { abortSignal: controller.signal }
  );
} catch (error) {
  if (controller.signal.aborted) {
    console.log("Stream cancelled by user");
  } else {
    console.error("Stream error:", error);
  }
}

// Cancel the stream at any time
controller.abort();
```

### UI Integration

#### React Example with Cancel Button

```typescript
import React, { useState, useRef } from 'react';
import { Graphlit } from 'graphlit-client';

function ChatComponent() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [response, setResponse] = useState('');
  const controllerRef = useRef<AbortController | null>(null);
  const client = useRef(new Graphlit()).current;

  const startStream = async (prompt: string) => {
    // Cancel any existing stream
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    // Create new controller
    controllerRef.current = new AbortController();
    setIsStreaming(true);
    setResponse('');

    try {
      await client.streamAgent(
        prompt,
        (event) => {
          if (event.type === "message_update") {
            setResponse(prev => prev + event.message.message);
          }
        },
        undefined,
        { id: specificationId },
        undefined,
        undefined,
        { abortSignal: controllerRef.current.signal }
      );
    } catch (error) {
      if (!controllerRef.current?.signal.aborted) {
        console.error('Stream error:', error);
      }
    } finally {
      setIsStreaming(false);
    }
  };

  const cancelStream = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      setIsStreaming(false);
    }
  };

  return (
    <div>
      <button 
        onClick={() => startStream("Explain quantum computing")}
        disabled={isStreaming}
      >
        Start
      </button>
      <button 
        onClick={cancelStream}
        disabled={!isStreaming}
      >
        Stop
      </button>
      <div>{response}</div>
    </div>
  );
}
```

#### Vue.js Example

```vue
<template>
  <div>
    <button @click="startStream" :disabled="isStreaming">
      Generate
    </button>
    <button @click="cancelStream" :disabled="!isStreaming">
      Cancel
    </button>
    <div class="response">{{ response }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Graphlit } from 'graphlit-client';

const client = new Graphlit();
const isStreaming = ref(false);
const response = ref('');
let controller: AbortController | null = null;

const startStream = async () => {
  // Cancel existing stream
  if (controller) {
    controller.abort();
  }

  controller = new AbortController();
  isStreaming.value = true;
  response.value = '';

  try {
    await client.streamAgent(
      "Explain the theory of relativity",
      (event) => {
        if (event.type === "message_update") {
          response.value += event.message.message;
        }
      },
      undefined,
      { id: specificationId },
      undefined,
      undefined,
      { abortSignal: controller.signal }
    );
  } catch (error) {
    if (!controller?.signal.aborted) {
      console.error('Stream error:', error);
    }
  } finally {
    isStreaming.value = false;
  }
};

const cancelStream = () => {
  controller?.abort();
  isStreaming.value = false;
};
</script>
```

### Advanced Patterns

#### Timeout-Based Cancellation

```typescript
class StreamManager {
  private controller?: AbortController;
  private timeoutId?: NodeJS.Timeout;

  async streamWithTimeout(
    client: Graphlit,
    prompt: string,
    timeoutMs: number = 30000
  ) {
    this.cleanup();
    
    this.controller = new AbortController();
    
    // Set timeout
    this.timeoutId = setTimeout(() => {
      this.controller?.abort();
      console.log('Stream timed out');
    }, timeoutMs);

    try {
      await client.streamAgent(
        prompt,
        (event) => {
          // Handle events
        },
        undefined,
        { id: specificationId },
        undefined,
        undefined,
        { abortSignal: this.controller.signal }
      );
    } finally {
      this.cleanup();
    }
  }

  cancel() {
    this.controller?.abort();
    this.cleanup();
  }

  private cleanup() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
    this.controller = undefined;
  }
}
```

#### Multiple Stream Management

```typescript
class MultiStreamManager {
  private streams = new Map<string, AbortController>();

  async startStream(
    id: string,
    client: Graphlit,
    prompt: string,
    onEvent: (event: AgentStreamEvent) => void
  ) {
    // Cancel existing stream with same ID
    this.cancelStream(id);

    const controller = new AbortController();
    this.streams.set(id, controller);

    try {
      await client.streamAgent(
        prompt,
        onEvent,
        undefined,
        { id: specificationId },
        undefined,
        undefined,
        { abortSignal: controller.signal }
      );
    } finally {
      this.streams.delete(id);
    }
  }

  cancelStream(id: string) {
    const controller = this.streams.get(id);
    if (controller) {
      controller.abort();
      this.streams.delete(id);
    }
  }

  cancelAll() {
    for (const controller of this.streams.values()) {
      controller.abort();
    }
    this.streams.clear();
  }
}
```

## Reasoning Events

### Basic Reasoning Detection

Reasoning events let you show the AI's thought process to users:

```typescript
import { Graphlit, AgentStreamEvent } from 'graphlit-client';

const client = new Graphlit();

// Track reasoning separately from the final answer
let reasoning = '';
let answer = '';

await client.streamAgent(
  "What's 15% of 240? Think step by step.",
  (event: AgentStreamEvent) => {
    switch (event.type) {
      case "reasoning_update":
        // Capture the AI's thinking process
        reasoning += event.content;
        console.log(`🤔 Thinking (${event.format}): ${event.content}`);
        
        if (event.isComplete) {
          console.log("✅ Finished thinking");
        }
        break;
        
      case "message_update":
        // The final answer (reasoning removed)
        answer = event.message.message;
        console.log(`💬 Answer: ${answer}`);
        break;
    }
  },
  undefined,
  { id: specificationId }
);
```

### UI Components

#### React Reasoning Display

```tsx
import React, { useState } from 'react';
import { Graphlit, AgentStreamEvent } from 'graphlit-client';

interface ReasoningDisplayProps {
  specificationId: string;
}

function ReasoningDisplay({ specificationId }: ReasoningDisplayProps) {
  const [reasoning, setReasoning] = useState('');
  const [answer, setAnswer] = useState('');
  const [showReasoning, setShowReasoning] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const client = new Graphlit();

  const handleQuery = async (prompt: string) => {
    // Reset state
    setReasoning('');
    setAnswer('');
    setIsThinking(false);

    await client.streamAgent(
      prompt,
      (event: AgentStreamEvent) => {
        switch (event.type) {
          case "reasoning_update":
            setIsThinking(true);
            setReasoning(prev => prev + event.content);
            
            if (event.isComplete) {
              setIsThinking(false);
            }
            break;
            
          case "message_update":
            setAnswer(event.message.message);
            break;
        }
      },
      undefined,
      { id: specificationId }
    );
  };

  return (
    <div className="reasoning-container">
      <button onClick={() => handleQuery("Solve: If 5 machines make 5 widgets in 5 minutes, how long for 100 machines to make 100 widgets?")}>
        Ask Complex Question
      </button>
      
      {reasoning && (
        <div className="reasoning-section">
          <div className="reasoning-header">
            <h3>
              {isThinking ? "🤔 Thinking..." : "💭 Thought Process"}
            </h3>
            <button onClick={() => setShowReasoning(!showReasoning)}>
              {showReasoning ? "Hide" : "Show"}
            </button>
          </div>
          
          {showReasoning && (
            <div className="reasoning-content">
              <pre>{reasoning}</pre>
            </div>
          )}
        </div>
      )}
      
      {answer && (
        <div className="answer-section">
          <h3>✨ Answer</h3>
          <div>{answer}</div>
        </div>
      )}
    </div>
  );
}
```

#### Styled Reasoning Component

```tsx
// ReasoningChat.tsx
import React, { useState, useRef } from 'react';
import { Graphlit, AgentStreamEvent, ReasoningFormat } from 'graphlit-client';
import './ReasoningChat.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  reasoning?: {
    content: string;
    format: ReasoningFormat;
  };
}

function ReasoningChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);
  const client = new Graphlit();

  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    // Create placeholder for assistant message
    const assistantMessage: Message = {
      role: 'assistant',
      content: '',
      reasoning: undefined
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    setIsStreaming(true);

    controllerRef.current = new AbortController();
    let reasoningContent = '';
    let messageContent = '';

    try {
      await client.streamAgent(
        userMessage,
        (event: AgentStreamEvent) => {
          switch (event.type) {
            case "reasoning_update":
              reasoningContent += event.content;
              setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                lastMessage.reasoning = {
                  content: reasoningContent,
                  format: event.format
                };
                return newMessages;
              });
              break;
              
            case "message_update":
              messageContent = event.message.message;
              setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                lastMessage.content = messageContent;
                return newMessages;
              });
              break;
          }
        },
        undefined,
        { id: specificationId },
        undefined,
        undefined,
        { abortSignal: controllerRef.current.signal }
      );
    } catch (error) {
      if (!controllerRef.current?.signal.aborted) {
        console.error('Stream error:', error);
      }
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} />
        ))}
      </div>
      
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask a question..."
          disabled={isStreaming}
        />
        <button onClick={sendMessage} disabled={isStreaming}>
          Send
        </button>
        {isStreaming && (
          <button onClick={() => controllerRef.current?.abort()}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const [showReasoning, setShowReasoning] = useState(false);

  return (
    <div className={`message ${message.role}`}>
      {message.reasoning && (
        <div className="reasoning-toggle">
          <button onClick={() => setShowReasoning(!showReasoning)}>
            {showReasoning ? "Hide" : "Show"} Reasoning
          </button>
        </div>
      )}
      
      {message.reasoning && showReasoning && (
        <div className={`reasoning ${message.reasoning.format}`}>
          <div className="reasoning-label">
            {message.reasoning.format === 'thinking_tag' && "🧠 Thinking"}
            {message.reasoning.format === 'markdown' && "📝 Analysis"}
            {message.reasoning.format === 'custom' && "💭 Processing"}
          </div>
          <pre>{message.reasoning.content}</pre>
        </div>
      )}
      
      <div className="message-content">
        {message.content}
      </div>
    </div>
  );
}
```

```css
/* ReasoningChat.css */
.chat-container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  height: 600px;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  max-width: 70%;
  word-wrap: break-word;
}

.message.user {
  align-self: flex-end;
  background: #007bff;
  color: white;
  padding: 12px 16px;
  border-radius: 18px 18px 4px 18px;
}

.message.assistant {
  align-self: flex-start;
  background: #f1f3f5;
  padding: 12px 16px;
  border-radius: 18px 18px 18px 4px;
}

.reasoning-toggle {
  margin-bottom: 8px;
}

.reasoning-toggle button {
  font-size: 12px;
  background: transparent;
  border: 1px solid #ddd;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
}

.reasoning {
  background: #fff9c4;
  border: 1px solid #f9a825;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
  font-size: 14px;
}

.reasoning.thinking_tag {
  background: #e3f2fd;
  border-color: #1976d2;
}

.reasoning.markdown {
  background: #f3e5f5;
  border-color: #7b1fa2;
}

.reasoning-label {
  font-weight: bold;
  margin-bottom: 8px;
}

.reasoning pre {
  white-space: pre-wrap;
  margin: 0;
  font-family: 'Monaco', 'Consolas', monospace;
}

.input-area {
  display: flex;
  gap: 8px;
  padding: 20px;
  border-top: 1px solid #ddd;
}

.input-area input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 24px;
  outline: none;
}

.input-area button {
  padding: 12px 24px;
  border: none;
  border-radius: 24px;
  background: #007bff;
  color: white;
  cursor: pointer;
}

.input-area button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

### Provider-Specific Handling

Different providers emit reasoning in different formats:

```typescript
interface ReasoningHandler {
  handleReasoning(event: AgentStreamEvent): void;
}

class BedrockReasoningHandler implements ReasoningHandler {
  handleReasoning(event: AgentStreamEvent) {
    if (event.type === "reasoning_update" && event.format === "thinking_tag") {
      // Bedrock Nova uses <thinking> tags
      console.log("Nova thinking:", event.content);
      // Could parse for specific patterns
    }
  }
}

class DeepseekReasoningHandler implements ReasoningHandler {
  handleReasoning(event: AgentStreamEvent) {
    if (event.type === "reasoning_update" && event.format === "markdown") {
      // Deepseek uses markdown formatting
      const steps = event.content.match(/\*\*Step \d+:/g);
      if (steps) {
        console.log(`Deepseek has ${steps.length} reasoning steps`);
      }
    }
  }
}

// Factory pattern for provider-specific handling
function createReasoningHandler(provider: string): ReasoningHandler {
  switch (provider) {
    case 'bedrock':
      return new BedrockReasoningHandler();
    case 'deepseek':
      return new DeepseekReasoningHandler();
    default:
      return {
        handleReasoning: (event) => {
          console.log(`Generic reasoning: ${event.content}`);
        }
      };
  }
}
```

## Combined Implementation

Here's a complete example combining cancellation and reasoning:

```typescript
// StreamingAssistant.ts
import { Graphlit, AgentStreamEvent, Types } from 'graphlit-client';

export class StreamingAssistant {
  private client: Graphlit;
  private controller?: AbortController;
  private onReasoningUpdate?: (content: string, isComplete: boolean) => void;
  private onMessageUpdate?: (message: string) => void;
  private onError?: (error: Error) => void;

  constructor() {
    this.client = new Graphlit();
  }

  // Configure callbacks
  configure(options: {
    onReasoningUpdate?: (content: string, isComplete: boolean) => void;
    onMessageUpdate?: (message: string) => void;
    onError?: (error: Error) => void;
  }) {
    this.onReasoningUpdate = options.onReasoningUpdate;
    this.onMessageUpdate = options.onMessageUpdate;
    this.onError = options.onError;
  }

  async ask(
    prompt: string,
    specificationId: string,
    options?: {
      timeout?: number;
      showReasoning?: boolean;
    }
  ): Promise<void> {
    // Cancel any existing stream
    this.cancel();

    this.controller = new AbortController();
    const { timeout = 60000, showReasoning = true } = options || {};

    // Set timeout if specified
    const timeoutId = timeout ? setTimeout(() => {
      this.controller?.abort();
      this.onError?.(new Error('Stream timed out'));
    }, timeout) : undefined;

    try {
      let reasoningBuffer = '';
      
      await this.client.streamAgent(
        prompt,
        (event: AgentStreamEvent) => {
          switch (event.type) {
            case "reasoning_update":
              if (showReasoning) {
                reasoningBuffer += event.content;
                this.onReasoningUpdate?.(reasoningBuffer, event.isComplete);
              }
              break;
              
            case "message_update":
              this.onMessageUpdate?.(event.message.message);
              break;
              
            case "error":
              this.onError?.(new Error(event.error.message));
              break;
          }
        },
        undefined,
        { id: specificationId },
        undefined,
        undefined,
        { abortSignal: this.controller.signal }
      );
    } catch (error) {
      if (!this.controller?.signal.aborted) {
        this.onError?.(error as Error);
      }
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      this.controller = undefined;
    }
  }

  cancel(): void {
    this.controller?.abort();
  }

  isStreaming(): boolean {
    return !!this.controller;
  }
}

// Usage example
const assistant = new StreamingAssistant();

assistant.configure({
  onReasoningUpdate: (content, isComplete) => {
    console.log('Reasoning:', content);
    if (isComplete) console.log('Reasoning complete!');
  },
  onMessageUpdate: (message) => {
    console.log('Message:', message);
  },
  onError: (error) => {
    console.error('Error:', error);
  }
});

// Start streaming
await assistant.ask(
  "What's the optimal algorithm for sorting 1 million integers?",
  specificationId,
  { timeout: 30000, showReasoning: true }
);

// Cancel if needed
assistant.cancel();
```

## Best Practices

### 1. Always Clean Up Controllers

```typescript
class StreamComponent {
  private controllers = new Set<AbortController>();

  async stream() {
    const controller = new AbortController();
    this.controllers.add(controller);

    try {
      await client.streamAgent(/* ... */);
    } finally {
      this.controllers.delete(controller);
    }
  }

  cleanup() {
    // Cancel all active streams
    for (const controller of this.controllers) {
      controller.abort();
    }
    this.controllers.clear();
  }
}
```

### 2. Handle Edge Cases

```typescript
async function robustStream(client: Graphlit, prompt: string) {
  const controller = new AbortController();
  let hasStarted = false;
  let hasCompleted = false;

  try {
    await client.streamAgent(
      prompt,
      (event) => {
        if (event.type === "conversation_started") {
          hasStarted = true;
        } else if (event.type === "conversation_completed") {
          hasCompleted = true;
        }
      },
      undefined,
      { id: specificationId },
      undefined,
      undefined,
      { abortSignal: controller.signal }
    );
  } catch (error) {
    if (controller.signal.aborted) {
      console.log(`Stream cancelled (started: ${hasStarted}, completed: ${hasCompleted})`);
    } else {
      throw error;
    }
  }
}
```

### 3. Debounce User Actions

```typescript
function useStreamDebounce(delay: number = 300) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const controllerRef = useRef<AbortController>();

  const debouncedStream = useCallback(async (
    client: Graphlit,
    prompt: string,
    handler: (event: AgentStreamEvent) => void
  ) => {
    // Cancel previous timeout and stream
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (controllerRef.current) controllerRef.current.abort();

    timeoutRef.current = setTimeout(async () => {
      controllerRef.current = new AbortController();
      
      try {
        await client.streamAgent(
          prompt,
          handler,
          undefined,
          { id: specificationId },
          undefined,
          undefined,
          { abortSignal: controllerRef.current.signal }
        );
      } catch (error) {
        // Handle error
      }
    }, delay);
  }, [delay]);

  return debouncedStream;
}
```

### 4. Progressive Disclosure for Reasoning

```typescript
interface ReasoningState {
  chunks: Array<{
    content: string;
    timestamp: number;
  }>;
  isComplete: boolean;
}

function useReasoningState() {
  const [reasoning, setReasoning] = useState<ReasoningState>({
    chunks: [],
    isComplete: false
  });

  const handleReasoningUpdate = (event: AgentStreamEvent) => {
    if (event.type === "reasoning_update") {
      setReasoning(prev => ({
        chunks: [...prev.chunks, {
          content: event.content,
          timestamp: Date.now()
        }],
        isComplete: event.isComplete
      }));
    }
  };

  // Show reasoning progressively
  const visibleReasoning = reasoning.chunks
    .filter(chunk => Date.now() - chunk.timestamp > 100) // Small delay
    .map(chunk => chunk.content)
    .join('');

  return { reasoning: visibleReasoning, isComplete: reasoning.isComplete };
}
```

## Troubleshooting

### Common Issues

1. **Stream doesn't cancel immediately**
   ```typescript
   // Check if the stream has actually started
   let streamStarted = false;
   
   await client.streamAgent(
     prompt,
     (event) => {
       if (event.type === "conversation_started") {
         streamStarted = true;
       }
     },
     // ...
   );
   
   // If streamStarted is false, the cancellation might have happened
   // before the stream actually began
   ```

2. **Reasoning events not appearing**
   ```typescript
   // Ensure you're using a model that supports reasoning
   const spec = await client.createSpecification({
     serviceType: Types.ModelServiceTypes.Bedrock,
     bedrock: {
       model: Types.BedrockModels.NovaPremier, // Supports reasoning
     }
   });
   ```

3. **Memory leaks with controllers**
   ```typescript
   // Always clean up in React
   useEffect(() => {
     const controller = new AbortController();
     
     // ... use controller
     
     return () => {
       controller.abort(); // Cleanup on unmount
     };
   }, []);
   ```

### Debug Helper

```typescript
class StreamDebugger {
  private events: Array<{ type: string; timestamp: number }> = [];

  handleEvent(event: AgentStreamEvent) {
    this.events.push({
      type: event.type,
      timestamp: Date.now()
    });

    console.log(`[${event.type}]`, event);
  }

  getEventSummary() {
    const summary = this.events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.table(summary);
    return summary;
  }

  getEventTimeline() {
    const start = this.events[0]?.timestamp || 0;
    return this.events.map(event => ({
      type: event.type,
      elapsed: event.timestamp - start
    }));
  }
}

// Usage
const debugger = new StreamDebugger();
await client.streamAgent(
  prompt,
  (event) => debugger.handleEvent(event),
  // ...
);
debugger.getEventSummary();
```

## Summary

The new cancellation and reasoning features in v1.2.0 enable rich, interactive AI experiences:

- **Cancellation** gives users control over long-running generations
- **Reasoning events** provide transparency into AI thought processes
- Both features work seamlessly together
- Implementation is straightforward with proper cleanup and error handling

Remember to:
- Always provide cancel options for better UX
- Clean up AbortControllers to prevent memory leaks
- Handle reasoning events appropriately for your UI
- Test with different providers as reasoning formats vary

For more examples and the complete API reference, see the [main documentation](./reasoning-and-cancellation.md).
# Node.js Client for Graphlit Platform

## Overview

The Graphlit Client for Node.js enables straightforward interactions with the Graphlit API, allowing developers to execute GraphQL queries and mutations against the Graphlit service. This document outlines the setup process and provides examples of using the client, including advanced streaming capabilities with real-time token delivery and tool calling support.

## Quick Start

Get up and running in 2 minutes:

```bash
# Install the client
npm install graphlit-client

# Set your credentials (get from https://portal.graphlit.dev)
export GRAPHLIT_ORGANIZATION_ID=your_org_id
export GRAPHLIT_ENVIRONMENT_ID=your_env_id  
export GRAPHLIT_JWT_SECRET=your_secret
```

```typescript
import { Graphlit } from "graphlit-client";

const client = new Graphlit();

// Stream a conversation
await client.streamAgent(
  "Hello! Tell me a joke",
  (event) => {
    if (event.type === "message_update") {
      console.log(event.message.message);
    }
  }
);
```

## Prerequisites

Before you begin, ensure you have the following:

- Node.js installed on your system (recommended version 18.x or higher).
- An active account on the [Graphlit Platform](https://portal.graphlit.dev) with access to the API settings dashboard.

## Installation

### Basic Installation

To install the Graphlit Client with core functionality:

```bash
npm install graphlit-client
```

or

```bash
yarn add graphlit-client
```

### Streaming Support (Optional)

For real-time token streaming with LLM conversations, install the desired LLM clients as additional dependencies:

**All streaming providers:**

```bash
npm install graphlit-client openai @anthropic-ai/sdk @google/generative-ai
```

**Selective streaming providers:**

```bash
# OpenAI streaming only
npm install graphlit-client openai

# Anthropic streaming only
npm install graphlit-client @anthropic-ai/sdk

# Google streaming only
npm install graphlit-client @google/generative-ai
```

> **Note:** The LLM client libraries are optional peer dependencies. The base Graphlit client works perfectly without them, but streaming functionality will gracefully fall back to regular API calls.

## Configuration

The Graphlit Client supports environment variables to be set for authentication and configuration:

- `GRAPHLIT_ENVIRONMENT_ID`: Your environment ID.
- `GRAPHLIT_ORGANIZATION_ID`: Your organization ID.
- `GRAPHLIT_JWT_SECRET`: Your JWT secret for signing the JWT token.

Alternately, you can pass these values with the constructor of the Graphlit client.

You can find these values in the API settings dashboard on the [Graphlit Platform](https://portal.graphlit.dev).

### Setting Environment Variables

To set these environment variables on your system, you can place them in a `.env` file at the root of your project:

```env
GRAPHLIT_ENVIRONMENT_ID=your_environment_id_value
GRAPHLIT_ORGANIZATION_ID=your_organization_id_value
GRAPHLIT_JWT_SECRET=your_jwt_secret_value

# Optional: For native streaming support
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GOOGLE_API_KEY=your_google_api_key
```

## Usage

### Basic Client Usage

```typescript
import { Graphlit } from "graphlit-client";

const client = new Graphlit();

// Create a content
const contentResponse = await client.ingestUri({
  uri: "https://example.com/document.pdf",
  name: "My Document"
});

// Query contents
const contents = await client.queryContents({
  filter: { name: { contains: "Document" } }
});
```

### Streaming Conversations with streamAgent

The `streamAgent` method provides real-time streaming responses with automatic UI event handling. It supports both native SDK streaming (when LLM clients are configured) and fallback streaming through the Graphlit API:

```typescript
import { Graphlit, AgentStreamEvent } from "graphlit-client";

const client = new Graphlit();

// Basic streaming conversation
await client.streamAgent(
  "Tell me about artificial intelligence",
  (event: AgentStreamEvent) => {
    switch (event.type) {
      case "conversation_started":
        console.log(`Started conversation: ${event.conversationId}`);
        break;
        
      case "message_update":
        // Complete message text - automatically accumulated
        console.log(`Assistant: ${event.message.message}`);
        break;
        
      case "conversation_completed":
        console.log(`Completed: ${event.message.message}`);
        break;
        
      case "error":
        console.error(`Error: ${event.error.message}`);
        break;
    }
  }
);
```

### Non-Streaming Conversations with promptAgent

For simpler use cases without streaming, use `promptAgent`:

```typescript
const result = await client.promptAgent(
  "What's the weather like?",
  undefined, // conversationId (creates new)
  { id: "your-specification-id" }, // specification
  tools, // optional tools array
  toolHandlers, // optional tool handlers
  { timeout: 30000 } // optional timeout
);

console.log(result.message); // Complete response
console.log(result.conversationId); // For continuing the conversation
```

### Tool Calling with Streaming

`streamAgent` supports sophisticated tool calling with automatic execution and parallel processing:

```typescript
// Define tools
const tools = [{
  name: "get_weather",
  description: "Get weather for a city",
  schema: JSON.stringify({
    type: "object",
    properties: {
      city: { type: "string", description: "City name" }
    },
    required: ["city"]
  })
}];

// Tool handlers
const toolHandlers = {
  get_weather: async (args: { city: string }) => {
    // Your weather API call here
    return { temperature: 72, condition: "sunny" };
  }
};

// Stream with tools
await client.streamAgent(
  "What's the weather in San Francisco?",
  (event: AgentStreamEvent) => {
    if (event.type === "tool_update") {
      console.log(`Tool ${event.toolCall.name}: ${event.status}`);
      if (event.result) {
        console.log(`Result: ${JSON.stringify(event.result)}`);
      }
      if (event.error) {
        console.error(`Tool error: ${event.error}`);
      }
    } else if (event.type === "conversation_completed") {
      console.log(`Final: ${event.message.message}`);
    }
  },
  undefined, // conversationId
  { id: "your-specification-id" }, // specification
  tools,
  toolHandlers
);
```

### Using Custom LLM Clients

You can provide your own configured LLM clients for streaming:

```typescript
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

// Configure custom clients
const openai = new OpenAI({
  apiKey: "your-api-key",
  baseURL: "https://your-proxy.com/v1" // Optional proxy
});

const anthropic = new Anthropic({
  apiKey: "your-api-key",
  baseURL: "https://your-proxy.com" // Optional proxy
});

// Set custom clients
client.setOpenAIClient(openai);
client.setAnthropicClient(anthropic);

// Now streaming will use your custom clients
await client.streamAgent("Hello!", (event) => {
  // Your event handler
});
```

### Streaming Options

Configure streaming behavior with options:

```typescript
await client.streamAgent(
  "Your prompt",
  (event) => { /* handler */ },
  undefined, // conversationId
  { id: "spec-id" }, // specification
  undefined, // tools
  undefined, // toolHandlers
  {
    maxToolRounds: 10,        // Maximum tool calling rounds (default: 1000)
    smoothingEnabled: true,   // Enable smooth streaming (default: true)
    chunkingStrategy: 'word', // 'character' | 'word' | 'sentence' (default: 'word')
    smoothingDelay: 30,       // Milliseconds between chunks (default: 30)
    abortSignal: controller.signal // AbortController signal for cancellation
  }
);
```

### Conversation Continuity

Continue existing conversations by passing the conversation ID:

```typescript
let conversationId: string;

// First message
await client.streamAgent(
  "Remember that my favorite color is blue",
  (event) => {
    if (event.type === "conversation_started") {
      conversationId = event.conversationId;
    }
  }
);

// Continue conversation
await client.streamAgent(
  "What's my favorite color?",
  (event) => {
    if (event.type === "conversation_completed") {
      console.log(event.message.message); // Should mention "blue"
    }
  },
  conversationId // Pass the conversation ID
);
```

### Error Handling

The streaming client provides comprehensive error handling:

```typescript
await client.streamAgent(
  "Your prompt",
  (event) => {
    if (event.type === "error") {
      console.error(`Error: ${event.error.message}`);
      console.log(`Recoverable: ${event.error.recoverable}`);
      
      // Handle specific error types
      if (event.error.code === "RATE_LIMIT") {
        // Implement retry logic
      }
    }
  }
);
```

### Cancelling Streams

Use an AbortController to cancel ongoing streams:

```typescript
const controller = new AbortController();

// Start streaming
client.streamAgent(
  "Write a long story...",
  (event) => {
    // Your handler
  },
  undefined,
  undefined,
  undefined,
  undefined,
  { abortSignal: controller.signal }
);

// Cancel after 5 seconds
setTimeout(() => controller.abort(), 5000);
```

## Advanced Tool Calling

### Multiple Tool Calls

The agent can make multiple tool calls in a single response:

```typescript
const tools = [
  {
    name: "search_web",
    description: "Search the web for information",
    schema: JSON.stringify({
      type: "object",
      properties: {
        query: { type: "string" }
      },
      required: ["query"]
    })
  },
  {
    name: "calculate",
    description: "Perform calculations",
    schema: JSON.stringify({
      type: "object",
      properties: {
        expression: { type: "string" }
      },
      required: ["expression"]
    })
  }
];

const toolHandlers = {
  search_web: async ({ query }) => {
    // Implement web search
    return { results: ["Result 1", "Result 2"] };
  },
  calculate: async ({ expression }) => {
    // Implement calculation
    return { result: eval(expression) }; // Use a proper math parser in production
  }
};

// The agent can use multiple tools to answer complex queries
await client.streamAgent(
  "Search for the current GDP of Japan and calculate 2.5% of it",
  handleStreamEvent,
  undefined,
  { id: specId },
  tools,
  toolHandlers,
  { maxToolRounds: 5 } // Allow multiple rounds of tool calls
);
```

### Tool Calling with Timeouts

Protect against hanging tools with timeouts:

```typescript
const toolHandlers = {
  slow_operation: async (args) => {
    // This will timeout after 30 seconds (default)
    await someSlowOperation(args);
  }
};

// Or set custom timeout in AgentOptions
await client.promptAgent(
  "Run the slow operation",
  undefined,
  { id: specId },
  tools,
  toolHandlers,
  { 
    timeout: 60000, // 60 second timeout for entire operation
    maxToolRounds: 3 
  }
);
```

## Stream Event Reference

### Agent Stream Events

| Event Type | Description | Properties |
|------------|-------------|------------|
| `conversation_started` | Conversation initialized | `conversationId`, `timestamp`, `model?` |
| `message_update` | Message text updated | `message` (complete text), `isStreaming` |
| `tool_update` | Tool execution status | `toolCall`, `status`, `result?`, `error?` |
| `conversation_completed` | Streaming finished | `message` (final) |
| `error` | Error occurred | `error` object with `message`, `code?`, `recoverable` |

### Tool Execution Statuses

- `preparing` - Tool call detected, preparing to execute
- `executing` - Tool handler is running
- `completed` - Tool executed successfully
- `failed` - Tool execution failed

## Examples

### Basic Chat UI Integration

```typescript
// React example
function ChatComponent() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (prompt: string) => {
    setIsLoading(true);
    setMessage("");

    await client.streamAgent(
      prompt,
      (event) => {
        if (event.type === "message_update") {
          setMessage(event.message.message);
        } else if (event.type === "conversation_completed") {
          setIsLoading(false);
        } else if (event.type === "error") {
          setMessage(`Error: ${event.error.message}`);
          setIsLoading(false);
        }
      }
    );
  };

  return (
    <div>
      <div>{message}</div>
      <button onClick={() => handleSend("Hello!")} disabled={isLoading}>
        Send
      </button>
    </div>
  );
}
```

### Multi-Model Support

```typescript
// Create specifications for different models
const gpt4Spec = await client.createSpecification({
  name: "GPT-4",
  type: Types.SpecificationTypes.Completion,
  serviceType: Types.ModelServiceTypes.OpenAi,
  openAI: {
    model: Types.OpenAiModels.Gpt4O_128K,
    temperature: 0.7
  }
});

const claudeSpec = await client.createSpecification({
  name: "Claude",
  type: Types.SpecificationTypes.Completion,
  serviceType: Types.ModelServiceTypes.Anthropic,
  anthropic: {
    model: Types.AnthropicModels.Claude_3_5Haiku,
    temperature: 0.7
  }
});

// Use different models
await client.streamAgent(
  "Hello!",
  handler,
  undefined,
  { id: gpt4Spec.createSpecification.id } // Use GPT-4
);

await client.streamAgent(
  "Hello!",
  handler,
  undefined,
  { id: claudeSpec.createSpecification.id } // Use Claude
);
```

## Best Practices

### 1. Always Handle Errors

```typescript
await client.streamAgent(
  prompt,
  (event) => {
    if (event.type === "error") {
      // Check if error is recoverable
      if (event.error.recoverable) {
        // Could retry or fallback
        console.warn("Recoverable error:", event.error.message);
      } else {
        // Fatal error
        console.error("Fatal error:", event.error.message);
      }
    }
  }
);
```

### 2. Clean Up Resources

```typescript
// Always clean up conversations when done
let conversationId: string;

try {
  await client.streamAgent(
    prompt,
    (event) => {
      if (event.type === "conversation_started") {
        conversationId = event.conversationId;
      }
    }
  );
} finally {
  if (conversationId) {
    await client.deleteConversation(conversationId);
  }
}
```

### 3. Tool Handler Best Practices

```typescript
const toolHandlers = {
  // Always validate inputs
  calculate: async (args) => {
    if (!args.expression || typeof args.expression !== 'string') {
      throw new Error("Invalid expression");
    }
    
    // Return structured data
    return {
      expression: args.expression,
      result: evaluateExpression(args.expression),
      timestamp: new Date().toISOString()
    };
  },
  
  // Handle errors gracefully
  fetch_data: async (args) => {
    try {
      const data = await fetchFromAPI(args.url);
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error.message,
        // Help the LLM understand what went wrong
        suggestion: "The URL might be invalid or the service is down"
      };
    }
  }
};
```

### 4. Optimize for Performance

```typescript
// Use appropriate chunking strategy for your use case
const options = {
  // For code generation or technical content
  chunkingStrategy: 'character' as const,
  
  // For natural conversation (default)
  chunkingStrategy: 'word' as const,
  
  // For long-form content
  chunkingStrategy: 'sentence' as const,
  
  // Adjust smoothing delay for your UI
  smoothingDelay: 20, // Faster updates
  smoothingDelay: 50, // Smoother updates (default: 30)
};
```

## Migration Guide

If you're upgrading from `promptConversation` to `streamAgent` or `promptAgent`:

```typescript
// Before (v1.0)
const response = await client.promptConversation(
  "Your prompt",
  undefined,
  { id: specId }
);
console.log(response.promptConversation.message.message);

// After (v1.1) - Non-streaming
const result = await client.promptAgent(
  "Your prompt",
  undefined,
  { id: specId }
);
console.log(result.message);

// After (v1.1) - Streaming
await client.streamAgent(
  "Your prompt",
  (event) => {
    if (event.type === "conversation_completed") {
      console.log(event.message.message);
    }
  },
  undefined,
  { id: specId }
);
```

## Troubleshooting

### Common Issues

#### 1. Streaming Not Working

```typescript
// Check if streaming is supported
if (!client.supportsStreaming()) {
  console.log("Streaming not supported - using fallback mode");
}

// Ensure LLM clients are properly configured
const hasNativeStreaming = 
  client.hasOpenAIClient() || 
  client.hasAnthropicClient() || 
  client.hasGoogleClient();
```

#### 2. Tool Calls Not Executing

```typescript
// Ensure tool schemas are valid JSON Schema
const validSchema = {
  type: "object",
  properties: {
    param: { type: "string", description: "Parameter description" }
  },
  required: ["param"] // Don't forget required fields
};

// Tool names must match exactly
const tools = [{ name: "my_tool", /* ... */ }];
const toolHandlers = { 
  "my_tool": async (args) => { /* ... */ } // Name must match
};
```

#### 3. Incomplete Streaming Responses

Some LLM providers may truncate responses. The client handles this automatically, but you can enable debug logging:

```bash
DEBUG_STREAMING=true npm start
```

#### 4. Type Errors

Ensure you're importing the correct types:

```typescript
import { 
  Graphlit,
  AgentStreamEvent,  // For streaming events
  AgentResult,       // For promptAgent results
  ToolHandler,       // For tool handler functions
  StreamAgentOptions // For streaming options
} from "graphlit-client";

// Also available if needed
import * as Types from "graphlit-client/generated/graphql-types";
```

## Support

Please refer to the [Graphlit API Documentation](https://docs.graphlit.dev/).

For support with the Graphlit Client, please submit a [GitHub Issue](https://github.com/graphlit/graphlit-client-typescript/issues).

For further support with the Graphlit Platform, please join our [Discord](https://discord.gg/ygFmfjy3Qx) community.
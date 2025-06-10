# Node.js Client for Graphlit Platform

## Overview

The Graphlit Client for Node.js enables straightforward interactions with the Graphlit API, allowing developers to execute GraphQL queries and mutations against the Graphlit service. This document outlines the setup process and provides examples of using the client, including the new streaming capabilities.

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

The new `streamAgent` method provides real-time streaming responses with automatic UI event handling:

```typescript
import { Graphlit, UIStreamEvent } from "graphlit-client";

const client = new Graphlit();

// Basic streaming conversation
await client.streamAgent(
  "Tell me about artificial intelligence",
  (event: UIStreamEvent) => {
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

### Tool Calling with Streaming

`streamAgent` supports tool calling with automatic execution:

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
  (event: UIStreamEvent) => {
    if (event.type === "tool_update") {
      console.log(`Tool ${event.toolCall.name}: ${event.status}`);
      if (event.result) {
        console.log(`Result: ${JSON.stringify(event.result)}`);
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
    maxToolRounds: 10,        // Maximum tool calling rounds (default: 100)
    showTokenStream: true,    // Show individual tokens (default: true)
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

## Stream Event Reference

### UI Stream Events

| Event Type | Description | Properties |
|------------|-------------|------------|
| `conversation_started` | Conversation initialized | `conversationId`, `timestamp` |
| `message_update` | Message text updated | `message` (complete text), `isStreaming` |
| `tool_update` | Tool execution status | `toolCall`, `status`, `result?`, `error?` |
| `conversation_completed` | Streaming finished | `message` (final) |
| `error` | Error occurred | `error` object with `message`, `code`, `recoverable` |

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

## Migration Guide

If you're upgrading from `promptConversation` to `streamAgent`:

```typescript
// Before
const response = await client.promptConversation(
  "Your prompt",
  undefined,
  { id: specId }
);
console.log(response.promptConversation.message.message);

// After
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

## Support

Please refer to the [Graphlit API Documentation](https://docs.graphlit.dev/).

For support with the Graphlit Client, please submit a [GitHub Issue](https://github.com/graphlit/graphlit-client-typescript/issues).

For further support with the Graphlit Platform, please join our [Discord](https://discord.gg/ygFmfjy3Qx) community.
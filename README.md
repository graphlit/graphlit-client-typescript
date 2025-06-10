# Node.js Client for Graphlit Platform

## Overview

The Graphlit Client for Node.js enables straightforward interactions with the Graphlit API, allowing developers to execute GraphQL queries and mutations against the Graphlit service. This document outlines the setup process and provides a basic example of using the client.

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
```

## Usage

### Basic Client Usage

```typescript
import { Graphlit } from "graphlit-client";

const client = new Graphlit();
// Your regular Graphlit operations...
```

### Streaming Conversations

The Graphlit SDK now offers two streaming modes to match your needs:

#### 🎉 UI Streaming Mode (Default) - NEW!

Simplified streaming events optimized for chat UIs:

```typescript
import { Graphlit, UIStreamEvent } from "graphlit-client";
import OpenAI from "openai";

const client = new Graphlit();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

await client.streamConversation(
  "Tell me about artificial intelligence",
  (event: UIStreamEvent) => {
    switch (event.type) {
      case "message_update":
        // Complete message text - no manual accumulation needed!
        setMessage(event.message.text);
        setLoading(event.message.isStreaming);
        break;
      case "tool_update":
        // Human-readable tool status
        console.log(`${event.tool.description}: ${event.tool.status}`);
        break;
      case "conversation_completed":
        setMessage(event.finalMessage);
        setLoading(false);
        break;
      case "error":
        setError(event.error.message);
        break;
    }
  },
  undefined, // conversationId
  { id: "your-specification-id" },
  tools,
  { mode: 'native', openai },
  toolHandlers,
);
```

**Benefits of UI Mode:**

- 70% less code than raw streaming
- Automatic message accumulation
- Built-in flicker prevention
- Human-readable tool statuses
- Automatic retry on errors

#### Raw Streaming Mode (Advanced)

For fine-grained control, you can opt into raw streaming events:

```typescript
await client.streamConversation(
  "Tell me about artificial intelligence",
  (event: StreamEvent) => {
    switch (event.type) {
      case "token":
        process.stdout.write(event.token); // Handle each token
        break;
      case "tool_call_delta":
        // Handle incremental tool arguments
        break;
      // ... other granular events
    }
  },
  undefined,
  { id: "your-specification-id" },
  tools,
  { mode: 'native', openai },
  toolHandlers,
  { ui: { enabled: false } }, // Opt out of UI mode
);
```

### Stream Event Types

#### UI Stream Events (Default)

- `conversation_started` - Conversation begins with metadata
- `message_update` - Complete message text updates (no accumulation needed)
- `tool_update` - Tool execution status with human-readable descriptions
- `conversation_completed` - Final message with usage stats
- `error` - Structured error with recovery info

#### Raw Stream Events (When `ui.enabled = false`)

- `start` - Streaming begins
- `token` - Individual tokens as they arrive
- `message` - Complete message text
- `tool_call_start` - Tool call begins
- `tool_call_delta` - Incremental tool call arguments
- `tool_call_complete` - Tool call completes
- `complete` - Streaming ends
- `error` - Error occurred

### Fallback Behavior

If LLM client libraries are not installed, `streamConversation` automatically falls back to the regular `promptConversation` method while still providing event callbacks for a consistent developer experience.

## Support

Please refer to the [Graphlit API Documentation](https://docs.graphlit.dev/).

For support with the Graphlit Client, please submit a [GitHub Issue](https://github.com/graphlit/graphlit-client-typescript/issues).

For further support with the Graphlit Platform, please join our [Discord](https://discord.gg/ygFmfjy3Qx) community.

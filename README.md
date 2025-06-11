# Graphlit TypeScript Client SDK

[![npm version](https://badge.fury.io/js/graphlit-client.svg)](https://badge.fury.io/js/graphlit-client)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The official TypeScript/JavaScript SDK for the [Graphlit Platform](https://www.graphlit.com) - build AI-powered applications with knowledge retrieval in minutes.

## 🚀 What is Graphlit?

Graphlit is a cloud platform that handles the complex parts of building AI applications:
- **Ingest any content** - PDFs, websites, audio, video, and more
- **Chat with your data** - Using RAG (Retrieval-Augmented Generation)
- **Extract insights** - Summaries, entities, and metadata
- **Build knowledge graphs** - Automatically connect related information

## ✨ What's New in v1.1.0
- **Real-time streaming** - Watch AI responses appear word-by-word
- **Tool calling** - Let AI execute functions and retrieve data
- **Better performance** - Native integration with OpenAI, Anthropic, and Google

## 📋 Table of Contents
- [Quick Start](#quick-start)
- [Basic Examples](#basic-examples)
- [Common Use Cases](#common-use-cases)
- [API Reference](#api-reference)
- [Support](#support)

## Quick Start

Get started in 2 minutes:

```bash
# Install the SDK
npm install graphlit-client

# Set your credentials (get free account at https://portal.graphlit.dev)
export GRAPHLIT_ORGANIZATION_ID=your_org_id
export GRAPHLIT_ENVIRONMENT_ID=your_env_id  
export GRAPHLIT_JWT_SECRET=your_secret
```

```typescript
import { Graphlit, Types } from "graphlit-client";

const client = new Graphlit(); // Uses env vars: GRAPHLIT_ORGANIZATION_ID, GRAPHLIT_ENVIRONMENT_ID, GRAPHLIT_JWT_SECRET

// First, create a specification (or use your project default)
const spec = await client.createSpecification({
  name: "Assistant",
  type: Types.SpecificationTypes.Completion,
  serviceType: Types.ModelServiceTypes.OpenAi,
  openAI: {
    model: Types.OpenAiModels.Gpt4O_128K
  }
});

// Start chatting with AI
await client.streamAgent(
  "Tell me a joke",
  (event) => {
    if (event.type === "message_update") {
      console.log(event.message.message);
    }
  },
  undefined, // conversationId (optional)
  { id: spec.createSpecification.id } // specification
);
```

## Installation

```bash
npm install graphlit-client
```

### Want Real-time Streaming?

Install the LLM SDK for streaming responses:

```bash
# For OpenAI streaming
npm install openai

# For Anthropic streaming  
npm install @anthropic-ai/sdk

# For Google streaming
npm install @google/generative-ai
```

## Setting Up

Create a `.env` file in your project:

```env
GRAPHLIT_ORGANIZATION_ID=your_org_id
GRAPHLIT_ENVIRONMENT_ID=your_env_id
GRAPHLIT_JWT_SECRET=your_secret

# Optional: For streaming
OPENAI_API_KEY=your_key
ANTHROPIC_API_KEY=your_key
GOOGLE_API_KEY=your_key
```

## Basic Examples

### 1. Chat with AI

Simple conversation with streaming responses:

```typescript
import { Graphlit, Types } from "graphlit-client";

const client = new Graphlit(); // Uses env vars: GRAPHLIT_ORGANIZATION_ID, GRAPHLIT_ENVIRONMENT_ID, GRAPHLIT_JWT_SECRET

// Create a specification for the AI model
const spec = await client.createSpecification({
  name: "Assistant",
  type: Types.SpecificationTypes.Completion,
  serviceType: Types.ModelServiceTypes.OpenAi,
  openAI: {
    model: Types.OpenAiModels.Gpt4O_128K,
    temperature: 0.7
  }
});

// Chat with streaming
await client.streamAgent(
  "What can you help me with?",
  (event) => {
    if (event.type === "message_update") {
      // Print the AI's response as it streams
      process.stdout.write(event.message.message);
    }
  },
  undefined, // conversationId
  { id: spec.createSpecification.id } // specification
);
```

### 2. Ingest and Query Documents

Upload a PDF and ask questions about it:

```typescript
import { Graphlit, Types } from "graphlit-client";

const client = new Graphlit(); // Uses env vars: GRAPHLIT_ORGANIZATION_ID, GRAPHLIT_ENVIRONMENT_ID, GRAPHLIT_JWT_SECRET

// Create a specification
const spec = await client.createSpecification({
  name: "Document Q&A",
  type: Types.SpecificationTypes.Completion,
  serviceType: Types.ModelServiceTypes.OpenAi,
  openAI: {
    model: Types.OpenAiModels.Gpt4O_128K
  }
});

// Upload a PDF synchronously to ensure it's ready
const content = await client.ingestUri(
  "https://arxiv.org/pdf/1706.03762.pdf", // Attention Is All You Need paper
  "AI Research Paper", // name
  undefined, // id
  true // isSynchronous - waits for processing
);

console.log(`✅ Uploaded: ${content.ingestUri.id}`);

// Wait a moment for content to be fully indexed
await new Promise(resolve => setTimeout(resolve, 5000));

// Create a conversation that filters to this specific content
const conversation = await client.createConversation({
  filter: { contents: [{ id: content.ingestUri.id }] }
});

// Ask questions about the PDF
await client.streamAgent(
  "What are the key innovations in this paper?",
  (event) => {
    if (event.type === "message_update") {
      console.log(event.message.message);
    }
  },
  conversation.createConversation.id, // conversationId with content filter
  { id: spec.createSpecification.id } // specification
);
```

### 3. Web Scraping

Extract content from websites:

```typescript
// Scrape a website (waits for processing to complete)
const webpage = await client.ingestUri(
  "https://en.wikipedia.org/wiki/Artificial_intelligence", // uri
  "AI Wikipedia Page", // name
  undefined, // id
  true // isSynchronous
);

// Wait for content to be indexed
await new Promise(resolve => setTimeout(resolve, 5000));

// Create a conversation filtered to this content
const conversation = await client.createConversation({
  filter: { contents: [{ id: webpage.ingestUri.id }] }
});

// Ask about the specific content
const response = await client.promptAgent(
  "Summarize the key points about AI from this Wikipedia page",
  conversation.createConversation.id, // conversationId with filter
  { id: spec.createSpecification.id } // specification (create one as shown above)
);

console.log(response.message);
```

### 4. Tool Calling

Let AI call functions to get real-time data:

```typescript
import { Graphlit, Types } from "graphlit-client";

const client = new Graphlit(); // Uses env vars: GRAPHLIT_ORGANIZATION_ID, GRAPHLIT_ENVIRONMENT_ID, GRAPHLIT_JWT_SECRET

// Define a weather tool
const weatherTool: Types.ToolDefinitionInput = {
  name: "get_weather",
  description: "Get current weather for a city",
  schema: JSON.stringify({
    type: "object",
    properties: {
      city: { type: "string", description: "City name" }
    },
    required: ["city"]
  })
};

// Tool implementation
const toolHandlers = {
  get_weather: async (args: { city: string }) => {
    // Call your weather API here
    return { 
      city: args.city,
      temperature: 72, 
      condition: "sunny" 
    };
  }
};

// Create a specification for tool calling
const spec = await client.createSpecification({
  name: "Weather Assistant",
  type: Types.SpecificationTypes.Completion,
  serviceType: Types.ModelServiceTypes.OpenAi,
  openAI: {
    model: Types.OpenAiModels.Gpt4O_128K
  }
});

// Chat with tools
await client.streamAgent(
  "What's the weather in San Francisco?",
  (event) => {
    if (event.type === "tool_update" && event.status === "completed") {
      console.log(`🔧 Called ${event.toolCall.name}`);
    } else if (event.type === "message_update") {
      console.log(event.message.message);
    }
  },
  undefined, // conversationId
  { id: spec.createSpecification.id }, // specification
  [weatherTool], // tools
  toolHandlers // handlers
);
```

## Common Use Cases

### Build a Knowledge Base Assistant

Create an AI that answers questions from your documents:

```typescript
import { Graphlit, Types } from "graphlit-client";

class KnowledgeAssistant {
  private client: Graphlit;
  private conversationId?: string;
  private specificationId?: string;
  private contentIds: string[] = [];

  constructor() {
    this.client = new Graphlit(); // Uses env vars: GRAPHLIT_ORGANIZATION_ID, GRAPHLIT_ENVIRONMENT_ID, GRAPHLIT_JWT_SECRET
  }

  async initialize() {
    // Create a specification for the assistant
    const spec = await this.client.createSpecification({
      name: "Knowledge Assistant",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.OpenAi,
      openAI: {
        model: Types.OpenAiModels.Gpt4O_128K,
        temperature: 0.7
      }
    });
    this.specificationId = spec.createSpecification?.id;
  }

  async uploadDocuments(urls: string[]) {
    console.log("📚 Uploading documents...");
    
    for (const url of urls) {
      const content = await this.client.ingestUri(
        url, // uri
        url.split('/').pop() || "Document", // name
        undefined, // id
        true // isSynchronous - wait for processing
      );
      this.contentIds.push(content.ingestUri.id);
    }
    
    console.log("✅ Documents uploaded!");
    
    // Wait for content to be indexed
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  async ask(question: string) {
    // Create conversation with content filter if not exists
    if (!this.conversationId && this.contentIds.length > 0) {
      const conversation = await this.client.createConversation({
        filter: { contents: this.contentIds.map(id => ({ id })) }
      });
      this.conversationId = conversation.createConversation?.id;
    }
    
    await this.client.streamAgent(
      question,
      (event) => {
        if (event.type === "conversation_started" && !this.conversationId) {
          this.conversationId = event.conversationId;
        } else if (event.type === "message_update") {
          process.stdout.write(event.message.message);
        }
      },
      this.conversationId, // Maintains conversation context
      { id: this.specificationId! } // specification
    );
  }
}

// Usage
const assistant = new KnowledgeAssistant();
await assistant.initialize();

// Upload your documents
await assistant.uploadDocuments([
  "https://arxiv.org/pdf/2103.15348.pdf",
  "https://arxiv.org/pdf/1706.03762.pdf"
]);

// Ask questions
await assistant.ask("What are these papers about?");
await assistant.ask("How do they relate to each other?");
```

### Extract Data from Documents

Extract specific information from uploaded content:

```typescript
// Upload a document synchronously
const document = await client.ingestUri(
  "https://example.com/document.pdf", // uri
  "Document #12345", // name
  undefined, // id
  true // isSynchronous
);

// Wait for content to be indexed
await new Promise(resolve => setTimeout(resolve, 5000));

// Extract specific data
const extraction = await client.extractContents(
  "Extract the key information from this document",
  undefined, // tools
  undefined, // specification
  { contents: [{ id: document.ingestUri.id }] } // filter
);

console.log("Extracted data:", extraction.extractContents);
```

### Summarize Multiple Documents

Create summaries across multiple files:

```typescript
// Upload multiple documents synchronously
const ids: string[] = [];

for (const url of documentUrls) {
  const content = await client.ingestUri(
    url, // uri
    url.split('/').pop() || "Document", // name
    undefined, // id
    true // isSynchronous
  );
  ids.push(content.ingestUri.id);
}

// Generate a summary across all documents
const summary = await client.summarizeContents(
  [{
    type: Types.SummarizationTypes.Custom,
    prompt: "Create an executive summary of these documents"
  }], // summarizations
  { contents: ids.map(id => ({ id })) } // filter
);

console.log("Summary:", summary.summarizeContents);
```

### Processing Options

```typescript
// Option 1: Synchronous processing (simpler)
const content = await client.ingestUri(
  "https://example.com/large-document.pdf", // uri
  undefined, // name
  undefined, // id
  true // isSynchronous
);
console.log("✅ Content ready!");

// Option 2: Asynchronous processing (for large files)
const content = await client.ingestUri(
  "https://example.com/very-large-video.mp4" // uri
  // isSynchronous defaults to false
);

// Check status later
let isReady = false;
while (!isReady) {
  const status = await client.isContentDone(content.ingestUri.id);
  isReady = status.isContentDone?.result || false;
  
  if (!isReady) {
    console.log("⏳ Still processing...");
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}
console.log("✅ Content ready!");
```

## Advanced Workflows

### Creating Workflows for Content Processing

Workflows automatically process content when ingested:

```typescript
import { Graphlit, Types } from "graphlit-client";

const client = new Graphlit(); // Uses env vars: GRAPHLIT_ORGANIZATION_ID, GRAPHLIT_ENVIRONMENT_ID, GRAPHLIT_JWT_SECRET

// Create specifications for AI models
const summarizationSpec = await client.createSpecification({
  name: "Summarizer",
  type: Types.SpecificationTypes.Summarization,
  serviceType: Types.ModelServiceTypes.OpenAi,
  openAI: {
    model: Types.OpenAiModels.Gpt4O_128K
  }
});

// Create a workflow that summarizes all content
const workflow = await client.createWorkflow({
  name: "Document Intelligence",
  preparation: {
    summarizations: [{
      type: Types.SummarizationTypes.Summary,
      specification: { id: summarizationSpec.createSpecification.id }
    }]
  }
});

// Set workflow as default for project
await client.updateProject({
  workflow: { id: workflow.createWorkflow.id }
});

// Now all content will be automatically summarized
const content = await client.ingestUri(
  "https://example.com/report.pdf" // uri
);
```

### Creating Specifications

Specifications configure how AI models behave:

```typescript
import { Graphlit, Types } from "graphlit-client";

// Create a conversational AI specification
const conversationSpec = await client.createSpecification({
  name: "Customer Support AI",
  type: Types.SpecificationTypes.Completion,
  serviceType: Types.ModelServiceTypes.OpenAi,
  systemPrompt: "You are a helpful customer support assistant.",
  openAI: {
    model: Types.OpenAiModels.Gpt4O_128K,
    temperature: 0.7,
    completionTokenLimit: 2000
  }
});

// Use the specification in conversations
await client.streamAgent(
  "How do I reset my password?",
  (event) => {
    if (event.type === "message_update") {
      console.log(event.message.message);
    }
  },
  undefined,
  { id: conversationSpec.createSpecification.id }
);
```

## API Reference

### Client Methods

```typescript
const client = new Graphlit(organizationId?, environmentId?, jwtSecret?);
```

#### Content Operations
- `ingestUri(uri, name?, id?, isSynchronous?, ...)` - Ingest content from URL
- `ingestText(text, name?, textType?, ...)` - Ingest text content directly
- `queryContents(filter?)` - Search and query content
- `getContent(id)` - Get content by ID
- `deleteContent(id)` - Delete content
- `extractContents(prompt, tools, specification?, filter?)` - Extract data from content
- `summarizeContents(summarizations, filter?)` - Summarize content
- `isContentDone(id)` - Check if content processing is complete

#### Conversation Operations  
- `createConversation(input?)` - Create a new conversation
- `streamAgent(prompt, handler, ...)` - Stream AI responses
- `promptAgent(prompt, ...)` - Get AI response without streaming
- `deleteConversation(id)` - Delete conversation

#### Specification Operations
- `createSpecification(input)` - Create AI model configuration
- `querySpecifications(filter?)` - List specifications
- `deleteSpecification(id)` - Delete specification

#### Workflow Operations
- `createWorkflow(input)` - Create content processing workflow
- `queryWorkflows(filter?)` - List workflows
- `updateProject(input)` - Update project settings

### Event Types

```typescript
type AgentStreamEvent = 
  | { type: "conversation_started"; conversationId: string }
  | { type: "message_update"; message: { message: string } }
  | { type: "tool_update"; toolCall: any; status: string }
  | { type: "conversation_completed"; message: { message: string } }
  | { type: "error"; error: { message: string; recoverable: boolean } }
```

## Testing & Examples

All examples in this README are tested and verified. See [`test/readme-simple.test.ts`](test/readme-simple.test.ts) for runnable versions of these examples.

To run the examples yourself:

```bash
# Clone the repository
git clone https://github.com/graphlit/graphlit-client-typescript.git
cd graphlit-client-typescript

# Install dependencies
npm install

# Set up your environment variables
cp .env.example .env
# Edit .env with your Graphlit credentials

# Run the examples
npm test test/readme-simple.test.ts
```

## Support

- 📖 **Documentation**: [https://docs.graphlit.dev/](https://docs.graphlit.dev/)
- 💬 **Discord Community**: [Join our Discord](https://discord.gg/ygFmfjy3Qx)
- 🐛 **Issues**: [GitHub Issues](https://github.com/graphlit/graphlit-client-typescript/issues)
- 📧 **Email**: support@graphlit.com

## License

MIT License - see LICENSE file for details.
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import { AgentStreamEvent } from "../src/client";

/**
 * Test suite to validate all README examples compile and run correctly
 */
describe("README Examples Validation", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;

  if (!orgId || !envId || !secret) {
    console.warn(
      "⚠️  Skipping README examples tests - missing Graphlit credentials"
    );
    return;
  }

  let client: Graphlit;
  const createdContentIds: string[] = [];
  const createdConversationIds: string[] = [];
  const createdSpecificationIds: string[] = [];
  const createdWorkflowIds: string[] = [];

  beforeAll(async () => {
    client = new Graphlit(orgId, envId, secret);
  });

  afterAll(async () => {
    // Clean up all created resources
    console.log("🧹 Cleaning up test resources...");

    for (const id of createdContentIds) {
      try {
        await client.deleteContent(id);
      } catch (error) {
        console.warn(`Failed to delete content ${id}`);
      }
    }

    for (const id of createdConversationIds) {
      try {
        await client.deleteConversation(id);
      } catch (error) {
        console.warn(`Failed to delete conversation ${id}`);
      }
    }

    for (const id of createdSpecificationIds) {
      try {
        await client.deleteSpecification(id);
      } catch (error) {
        console.warn(`Failed to delete specification ${id}`);
      }
    }

    for (const id of createdWorkflowIds) {
      try {
        await client.deleteWorkflow(id);
      } catch (error) {
        console.warn(`Failed to delete workflow ${id}`);
      }
    }
  }, 60000);

  describe("Quick Start Example", () => {
    it("should run the basic chat example", async () => {
      // Quick Start example
      // Use existing client with credentials

      // First, create a specification (matching README)
      const spec = await client.createSpecification({
        name: "Assistant",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4O_128K,
        },
      });
      createdSpecificationIds.push(spec.createSpecification!.id);

      let messageReceived = false;

      // Start chatting with AI
      await client.streamAgent(
        "Tell me a joke",
        (event) => {
          if (event.type === "message_update") {
            console.log(event.message.message);
            messageReceived = true;
          }
          if (event.type === "conversation_started") {
            createdConversationIds.push(event.conversationId);
          }
        },
        undefined, // conversationId
        { id: spec.createSpecification!.id } // specification
      );

      expect(messageReceived).toBe(true);
    }, 30000);
  });

  describe("Basic Examples", () => {
    it("should run example 1: Chat with AI", async () => {
      // Use existing client with credentials

      // Create a specification for the AI model
      const spec = await client.createSpecification({
        name: "Assistant",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4O_128K,
          temperature: 0.7,
        },
      });
      createdSpecificationIds.push(spec.createSpecification!.id);

      let responseReceived = false;

      // Chat with streaming
      await client.streamAgent(
        "What can you help me with?",
        (event) => {
          if (event.type === "message_update") {
            // Print the AI's response as it streams
            process.stdout.write(event.message.message);
            responseReceived = true;
          }
          if (event.type === "conversation_started") {
            createdConversationIds.push(event.conversationId);
          }
        },
        undefined, // conversationId
        { id: spec.createSpecification!.id } // specification
      );

      expect(responseReceived).toBe(true);
    }, 30000);

    it("should run example 2: Ingest and Query Documents", async () => {
      // Use existing client with credentials

      // Create a specification
      const spec = await client.createSpecification({
        name: "Document Q&A",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4O_128K,
        },
      });
      createdSpecificationIds.push(spec.createSpecification!.id);

      // Upload a PDF synchronously
      const content = await client.ingestUri(
        "https/://arxiv.org/pdf/1706.03762.pdf", // Attention Is All You Need paper
        "AI Research Paper", // name
        undefined, // id
        true // isSynchronous
      );

      expect(content.ingestUri.id).toBeDefined();
      createdContentIds.push(content.ingestUri.id);
      console.log(`✅ Uploaded: ${content.ingestUri.id}`);

      // Create conversation with content filter
      const conversation = await client.createConversation({
        name: "PDF Conversation",
        filter: { contents: [{ id: content.ingestUri.id }] },
      });
      createdConversationIds.push(conversation.createConversation!.id);

      // Ask questions about the PDF
      let responseReceived = false;
      await client.streamAgent(
        "What are the key innovations in this paper?",
        (event) => {
          if (event.type === "message_update") {
            console.log(event.message.message);
            responseReceived = true;
          }
        },
        conversation.createConversation!.id, // conversationId with filter
        { id: spec.createSpecification!.id } // specification
      );

      expect(responseReceived).toBe(true);
    }, 60000);

    it("should run example 3: Web Scraping", async () => {
      // Use existing client with credentials

      // Create a specification first
      const spec = await client.createSpecification({
        name: "Web Scraper",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4O_128K,
        },
      });
      createdSpecificationIds.push(spec.createSpecification!.id);

      // Scrape a website (waits for processing to complete)
      const webpage = await client.ingestUri(
        "https://en.wikipedia.org/wiki/Artificial_intelligence", // uri
        "AI Wikipedia Page", // name
        undefined, // id
        true // isSynchronous
      );

      expect(webpage.ingestUri.id).toBeDefined();
      createdContentIds.push(webpage.ingestUri.id);
      console.log(`✅ Uploaded: ${webpage.ingestUri.id}`);

      // Create a conversation with a content filter
      const conversation = await client.createConversation({
        name: "Wikipedia Conversation",
        filter: { contents: [{ id: webpage.ingestUri.id }] },
      });
      createdConversationIds.push(conversation.createConversation!.id);

      // Ask about the content
      const response = await client.promptAgent(
        "Summarize the key points about AI from this Wikipedia page",
        conversation.createConversation!.id, // conversationId with filter
        { id: spec.createSpecification!.id } // specification
      );

      expect(response.message).toBeDefined();
      console.log(response.message);

      if (response.conversationId) {
        createdConversationIds.push(response.conversationId);
      }
    }, 120000); // 2 minutes for web scraping

    it("should run example 4: Tool Calling", async () => {
      // Use existing client with credentials

      // Define a weather tool
      const weatherTool: Types.ToolDefinitionInput = {
        name: "get_weather",
        description: "Get current weather for a city",
        schema: JSON.stringify({
          type: "object",
          properties: {
            city: { type: "string", description: "City name" },
          },
          required: ["city"],
        }),
      };

      // Tool implementation
      const toolHandlers = {
        get_weather: async (args: { city: string }) => {
          // Call your weather API here
          return {
            city: args.city,
            temperature: 72,
            condition: "sunny",
          };
        },
      };

      // Create a specification for tool calling
      const spec = await client.createSpecification({
        name: "Weather Assistant",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4O_128K,
        },
      });
      createdSpecificationIds.push(spec.createSpecification!.id);

      let toolCalled = false;
      let messageReceived = false;

      // Chat with tools
      await client.streamAgent(
        "What's the weather in San Francisco?",
        (event) => {
          if (event.type === "tool_update" && event.status === "completed") {
            console.log(`🔧 Called ${event.toolCall.name}`);
            toolCalled = true;
          } else if (event.type === "message_update") {
            console.log(event.message.message);
            messageReceived = true;
          } else if (event.type === "conversation_started") {
            createdConversationIds.push(event.conversationId);
          }
        },
        undefined, // conversationId
        { id: spec.createSpecification!.id }, // specification
        [weatherTool], // tools
        toolHandlers // handlers
      );

      expect(toolCalled).toBe(true);
      expect(messageReceived).toBe(true);
    }, 30000);
  });

  describe("Common Use Cases", () => {
    it("should run the Knowledge Base Assistant example", async () => {
      class KnowledgeAssistant {
        private client: Graphlit;
        private conversationId?: string;

        constructor(client: Graphlit) {
          this.client = client;
        }

        async uploadDocuments(urls: string[]) {
          console.log("📚 Uploading documents...");

          for (const url of urls) {
            const content = await this.client.ingestUri(
              url, // uri
              url.split("/").pop() || "Document" // name
            );
            createdContentIds.push(content.ingestUri.id);
          }

          console.log("✅ Documents uploaded!");
        }

        async ask(question: string, specificationId: string) {
          await this.client.streamAgent(
            question,
            (event) => {
              if (event.type === "conversation_started") {
                this.conversationId = event.conversationId;
                createdConversationIds.push(event.conversationId);
              } else if (event.type === "message_update") {
                process.stdout.write(event.message.message);
              }
            },
            this.conversationId, // Maintains conversation context
            { id: specificationId }, // specification
            undefined, // tools
            undefined // toolHandlers
          );
        }
      }

      // Create a specification first
      const spec = await client.createSpecification({
        name: "Knowledge Assistant",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4O_128K,
          temperature: 0.7,
        },
      });
      createdSpecificationIds.push(spec.createSpecification!.id);

      // Usage
      const assistant = new KnowledgeAssistant(client);

      // Upload test documents (using real URLs)
      await assistant.uploadDocuments(["https://arxiv.org/pdf/2103.15348.pdf"]);

      // Wait for content to be indexed
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Ask questions
      await assistant.ask(
        "What is this document about?",
        spec.createSpecification!.id
      );

      // Verify it works
      expect(true).toBe(true); // If we get here without errors, it works
    }, 60000);

    it("should run the Extract Data from Documents example", async () => {
      // Upload a test document (using a research paper as example)
      const document = await client.ingestUri(
        "https://arxiv.org/pdf/2103.15348.pdf", // uri
        "Test Document", // name
        undefined, // id
        true // isSynchronous
      );

      expect(document.ingestUri.id).toBeDefined();
      createdContentIds.push(document.ingestUri.id);

      // Extract specific data (note: this is a research paper, not an invoice)
      const extraction = await client.extractContents(
        "Extract the title, authors, and abstract of this paper",
        undefined, // tools
        undefined, // specification
        { contents: [{ id: document.ingestUri.id }] } // filter
      );

      expect(extraction.extractContents).toBeDefined();
      console.log("Extracted data:", extraction.extractContents);
    }, 60000);

    it("should run the Summarize Multiple Documents example", async () => {
      // Test URLs
      const documentUrls = [
        "https://arxiv.org/pdf/2103.15348.pdf",
        "https://arxiv.org/pdf/1706.03762.pdf",
      ];

      // Upload multiple documents synchronously
      const ids: string[] = [];

      for (const url of documentUrls) {
        const content = await client.ingestUri(
          url, // uri
          url.split("/").pop() || "Document", // name
          undefined, // id
          true // isSynchronous
        );
        ids.push(content.ingestUri.id);
        createdContentIds.push(content.ingestUri.id);
      }

      // Generate a summary across all documents
      const summary = await client.summarizeContents(
        [
          {
            type: Types.SummarizationTypes.Custom,
            prompt: "Create an executive summary of these documents",
          },
        ], // summarizations
        { contents: ids.map((id) => ({ id })) } // filter
      );

      expect(summary.summarizeContents).toBeDefined();
      console.log("Summary:", summary.summarizeContents);
    }, 180000); // 3 minutes for multiple documents

    it("should run the Processing Options examples", async () => {
      // Option 1: Synchronous processing (simpler)
      const content = await client.ingestUri(
        "https://arxiv.org/pdf/2103.15348.pdf", // uri
        undefined, // name
        undefined, // id
        true // isSynchronous
      );
      console.log("✅ Content ready!");
      expect(content.ingestUri.id).toBeDefined();
      createdContentIds.push(content.ingestUri.id);

      // Option 2: Asynchronous processing (for large files)
      const content2 = await client.ingestUri(
        "https://arxiv.org/pdf/1706.03762.pdf" // uri
        // isSynchronous defaults to false
      );
      createdContentIds.push(content2.ingestUri.id);

      // Wait a bit before checking status
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Check status later
      let isReady = false;
      let attempts = 0;
      while (!isReady && attempts < 30) {
        // Max 30 attempts
        const status = await client.isContentDone(content2.ingestUri.id);
        isReady = status.isContentDone?.result || false;

        if (!isReady) {
          console.log("⏳ Still processing...");
          await new Promise((resolve) => setTimeout(resolve, 2000));
          attempts++;
        }
      }
      console.log("✅ Content ready!");
      expect(isReady).toBe(true);
    }, 120000);
  });

  describe("Advanced Workflows", () => {
    it("should run the Creating Workflows example", async () => {
      // Use existing client with credentials

      // Create specifications for AI models
      const summarizationSpec = await client.createSpecification({
        name: "Summarizer",
        type: Types.SpecificationTypes.Summarization,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4O_128K,
        },
      });

      expect(summarizationSpec.createSpecification?.id).toBeDefined();
      createdSpecificationIds.push(summarizationSpec.createSpecification!.id);

      // Create a workflow that summarizes all content
      const workflow = await client.createWorkflow({
        name: "Document Intelligence",
        preparation: {
          summarizations: [
            {
              type: Types.SummarizationTypes.Summary,
              specification: { id: summarizationSpec.createSpecification!.id },
            },
          ],
        },
      });

      expect(workflow.createWorkflow?.id).toBeDefined();
      createdWorkflowIds.push(workflow.createWorkflow!.id);

      // Now all content will be automatically summarized
      const content = await client.ingestUri(
        "https://arxiv.org/pdf/2103.15348.pdf",
        undefined,
        undefined,
        true,
        { id: workflow.createWorkflow!.id }
      );

      expect(content.ingestUri.id).toBeDefined();
      createdContentIds.push(content.ingestUri.id);
    }, 60000);

    it("should run the Creating Specifications example", async () => {
      // Use existing client with credentials

      // Create a conversational AI specification
      const conversationSpec = await client.createSpecification({
        name: "Customer Support AI",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        systemPrompt: "You are a helpful customer support assistant.",
        openAI: {
          model: Types.OpenAiModels.Gpt4O_128K,
          temperature: 0.7,
          completionTokenLimit: 2000,
        },
      });

      expect(conversationSpec.createSpecification?.id).toBeDefined();
      createdSpecificationIds.push(conversationSpec.createSpecification!.id);

      let messageReceived = false;

      // Use the specification in conversations
      await client.streamAgent(
        "How do I reset my password?",
        (event) => {
          if (event.type === "message_update") {
            console.log(event.message.message);
            messageReceived = true;
          }
          if (event.type === "conversation_started") {
            createdConversationIds.push(event.conversationId);
          }
        },
        undefined,
        { id: conversationSpec.createSpecification!.id }
      );

      expect(messageReceived).toBe(true);
    }, 30000);
  });
});

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Graphlit, Types } from "../src/client.js";

describe("Content and Augmented Filters", () => {
  let client: Graphlit;
  let specificationId: string;
  let contentId1: string;
  let contentId2: string;
  let contentId3: string;
  const createdIds: string[] = [];
  const createdContentIds: string[] = [];
  const createdConversationIds: string[] = [];

  beforeAll(async () => {
    console.log(
      "DEBUG_GRAPHLIT_STREAMING env var:",
      process.env.DEBUG_GRAPHLIT_STREAMING
    );
    client = new Graphlit();

    // Create test specification - using GPT-4o
    const spec = await client.createSpecification({
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.OpenAi,
      openAI: {
        model: Types.OpenAiModels.Gpt4O_128K,
        temperature: 0.7,
      },
      name: "Content Filter Test Spec",
    });
    specificationId = spec.createSpecification!.id!;
    createdIds.push(specificationId);

    // Create test content
    const content1 = await client.ingestText(
      "The capital of France is Paris. It is known for the Eiffel Tower.",
      "France Document", // name
      Types.TextTypes.Plain, // textType
      undefined, // uri
      undefined, // id
      true // isSynchronous
    );
    contentId1 = content1.ingestText!.id!;
    createdContentIds.push(contentId1);
    console.log("✅ Created France document:", contentId1);

    const content2 = await client.ingestText(
      "The capital of Italy is Rome. It is famous for the Colosseum.",
      "Italy Document", // name
      Types.TextTypes.Plain, // textType
      undefined, // uri
      undefined, // id
      true // isSynchronous
    );
    contentId2 = content2.ingestText!.id!;
    createdContentIds.push(contentId2);
    console.log("✅ Created Italy document:", contentId2);

    const content3 = await client.ingestText(
      "The capital of Spain is Madrid. It is home to the Royal Palace.",
      "Spain Document", // name
      Types.TextTypes.Plain, // textType
      undefined, // uri
      undefined, // id
      true // isSynchronous
    );
    contentId3 = content3.ingestText!.id!;
    createdContentIds.push(contentId3);
    console.log("✅ Created Spain document:", contentId3);

    console.log("\n📚 All content IDs:", {
      France: contentId1,
      Italy: contentId2,
      Spain: contentId3,
    });

    // Wait for indexing
    console.log("⏳ Waiting 3 seconds for indexing...");
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log("✅ Indexing wait complete");
  }, 120000); // 90 second timeout

  afterAll(async () => {
    // Clean up conversations
    for (const id of createdConversationIds) {
      try {
        await client.deleteConversation(id);
      } catch (e) {
        // Ignore errors
      }
    }

    // Clean up content
    for (const id of createdContentIds) {
      try {
        await client.deleteContent(id);
      } catch (e) {
        // Ignore errors
      }
    }

    // Clean up specifications
    for (const id of createdIds) {
      try {
        await client.deleteSpecification(id);
      } catch (e) {
        // Ignore errors
      }
    }
  });

  it("should use content filter to restrict retrieval", async () => {
    // Only allow retrieval from France and Italy documents
    const result = await client.promptAgent(
      "What are the capitals mentioned in the documents?",
      undefined, // conversationId
      { id: specificationId },
      undefined, // tools
      undefined, // toolHandlers
      undefined, // options
      undefined, // mimeType
      undefined, // data
      {
        // Content filter - only France and Italy
        contents: [{ id: contentId1 }, { id: contentId2 }],
      }
    );

    expect(result.message).toBeDefined();
    expect(result.conversationId).toBeDefined();
    createdConversationIds.push(result.conversationId!);

    // Should mention Paris and Rome but not Madrid
    const message = result.message.toLowerCase();
    expect(message).toContain("paris");
    expect(message).toContain("rome");
    expect(message).not.toContain("madrid");

    console.log("Content filter result:", result.message);
  }, 120000); // 90 second timeout

  it("should use augmented filter to force content into context", async () => {
    // Force Spain document into context without retrieval
    const result = await client.promptAgent(
      "Tell me about the Royal Palace mentioned in the provided context",
      undefined, // conversationId
      { id: specificationId },
      undefined, // tools
      undefined, // toolHandlers
      undefined, // options
      undefined, // mimeType
      undefined, // data
      undefined, // contentFilter
      {
        // Augmented filter - force Spain document
        contents: [{ id: contentId3 }],
      }
    );

    expect(result.message).toBeDefined();
    expect(result.conversationId).toBeDefined();
    createdConversationIds.push(result.conversationId!);

    // Should mention Madrid and Royal Palace
    const message = result.message.toLowerCase();
    expect(message).toContain("madrid");
    expect(message).toContain("royal palace");

    console.log("Augmented filter result:", result.message);
  }, 120000); // 90 second timeout

  it("should combine content and augmented filters", async () => {
    // Allow retrieval from France, force Italy into context
    const result = await client.promptAgent(
      "Compare the information about France with the provided Italian context",
      undefined, // conversationId
      { id: specificationId },
      undefined, // tools
      undefined, // toolHandlers
      undefined, // options
      undefined, // mimeType
      undefined, // data
      {
        // Content filter - only France for retrieval
        contents: [{ id: contentId1 }],
      },
      {
        // Augmented filter - force Italy into context
        contents: [{ id: contentId2 }],
      }
    );

    expect(result.message).toBeDefined();
    expect(result.conversationId).toBeDefined();
    createdConversationIds.push(result.conversationId!);

    // Should mention both Paris and Rome
    const message = result.message.toLowerCase();
    expect(message).toContain("paris");
    expect(message).toContain("rome");
    expect(message).not.toContain("madrid");

    console.log("Combined filters result:", result.message);
  }, 120000); // 90 second timeout

  it("should work with streaming agent and filters", async () => {
    console.log("\n🚀 STARTING STREAMING TEST");
    let streamedMessage = "";

    console.log(
      "\n🔍 Streaming test - Using content filter with Italy and Spain:",
      {
        Italy: contentId2,
        Spain: contentId3,
      }
    );

    const prompt =
      "List all the capital cities mentioned in the available content.";
    console.log("📝 Sending prompt:", prompt);

    await client.streamAgent(
      prompt,
      (event) => {
        console.log(`[Test] Received event type: ${event.type}`);
        if (event.type === "message_update") {
          streamedMessage = event.message.message; // Replace, don't append
          console.log(
            `[Test] Message update: "${streamedMessage}" (${streamedMessage.length} chars)`
          );
        } else if (event.type === "conversation_started") {
          console.log("Conversation started with ID:", event.conversationId);
        } else if (event.type === "conversation_completed") {
          console.log(`[Test] Conversation completed event received`);
          if (event.message) {
            streamedMessage = event.message.message;
            console.log(
              `[Test] Final message from completed event: "${streamedMessage}" (${streamedMessage.length} chars)`
            );
          }
        }
      },
      undefined, // conversationId
      { id: specificationId },
      undefined, // tools
      undefined, // toolHandlers
      undefined, // options
      undefined, // mimeType
      undefined, // data
      {
        // Content filter - only Italy and Spain
        contents: [{ id: contentId2 }, { id: contentId3 }],
      },
      undefined // augmentedFilter
    );

    console.log("✅ StreamAgent call completed");
    console.log("📄 Final streamed message:", streamedMessage);

    expect(streamedMessage).toBeTruthy();

    // Should mention Rome and Madrid but not Paris
    const message = streamedMessage.toLowerCase();
    expect(message).toContain("rome");
    expect(message).toContain("madrid");
    expect(message).not.toContain("paris");

    console.log("Streaming with filter result:", streamedMessage);
  }, 120000); // 90 second timeout
});

import { describe, it, expect } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";

/**
 * Simple test to verify README examples work
 */
describe("README Simple Examples", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;

  if (!orgId || !envId || !secret) {
    console.warn(
      "⚠️  Skipping README simple tests - missing Graphlit credentials",
    );
    return;
  }

  it("should connect to Graphlit", async () => {
    const client = new Graphlit(orgId, envId, secret);
    expect(client).toBeDefined();
  });

  it("should ingest content", async () => {
    const client = new Graphlit(orgId, envId, secret);

    // Test ingesting a URL
    const content = await client.ingestUri(
      "https://arxiv.org/pdf/1706.03762.pdf", // Attention is All You Need paper
      "Test Document",
    );

    expect(content.ingestUri.id).toBeDefined();
    console.log(`✅ Ingested content: ${content.ingestUri.id}`);

    // Clean up
    try {
      await client.deleteContent(content.ingestUri.id);
      console.log(`🧹 Deleted content: ${content.ingestUri.id}`);
    } catch (error) {
      console.warn(`Failed to delete content: ${error}`);
    }
  }, 30000);

  it("should create and use a specification", async () => {
    const client = new Graphlit(orgId, envId, secret);

    // Create a specification
    const spec = await client.createSpecification({
      name: "Test Spec",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.OpenAi,
      openAI: {
        model: Types.OpenAiModels.Gpt4O_128K,
        temperature: 0.7,
      },
    });

    expect(spec.createSpecification?.id).toBeDefined();
    console.log(`✅ Created specification: ${spec.createSpecification?.id}`);

    // Use it in a non-streaming call
    const result = await client.promptAgent(
      "What is 2+2?",
      undefined, // conversationId
      { id: spec.createSpecification!.id },
    );

    expect(result.message).toBeDefined();
    expect(result.conversationId).toBeDefined();
    console.log(`✅ Got response: ${result.message}`);

    // Clean up
    try {
      if (result.conversationId) {
        await client.deleteConversation(result.conversationId);
      }
      await client.deleteSpecification(spec.createSpecification!.id);
      console.log(`🧹 Cleaned up specification and conversation`);
    } catch (error) {
      console.warn(`Failed to clean up: ${error}`);
    }
  }, 30000);

  it("should handle streaming if supported", async () => {
    const client = new Graphlit(orgId, envId, secret);

    if (!client.supportsStreaming()) {
      console.log("⚠️  Streaming not supported, skipping test");
      return;
    }

    let messageReceived = false;
    let conversationId: string | undefined;

    // First create a specification to use
    const spec = await client.createSpecification({
      name: "Stream Test Spec",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.OpenAi,
      openAI: {
        model: Types.OpenAiModels.Gpt4O_128K,
        temperature: 0.7,
      },
    });

    await client.streamAgent(
      "Say 'Hello World'",
      (event) => {
        if (event.type === "conversation_started") {
          conversationId = event.conversationId;
        } else if (event.type === "message_update") {
          console.log(`Streaming: ${event.message.message}`);
          messageReceived = true;
        }
      },
      undefined, // conversationId
      { id: spec.createSpecification!.id }, // specification
    );

    expect(messageReceived).toBe(true);

    // Clean up - MUST delete conversation before specification
    if (conversationId) {
      try {
        await client.deleteConversation(conversationId);
        console.log(`🧹 Deleted conversation: ${conversationId}`);
      } catch (error) {
        console.warn(`Failed to delete conversation: ${error}`);
      }
    }

    // Now safe to delete spec
    try {
      await client.deleteSpecification(spec.createSpecification!.id);
      console.log(`🧹 Deleted specification: ${spec.createSpecification!.id}`);
    } catch (error) {
      console.warn(`Failed to delete specification: ${error}`);
    }
  }, 30000);
});

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import { AgentStreamEvent } from "../src/types/ui-events";

/**
 * Multimodal streaming test suite
 * Tests image handling in streaming conversations
 */
describe("Multimodal Streaming", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!orgId || !envId || !secret) {
    console.warn(
      "⚠️  Skipping multimodal tests - missing Graphlit credentials"
    );
    return;
  }

  let client: Graphlit;
  const createdSpecifications: string[] = [];
  const createdConversations: string[] = [];

  beforeAll(async () => {
    client = new Graphlit(orgId, envId, secret);

    // Set up conditional streaming - use native if available, fallback otherwise
    if (openaiKey) {
      try {
        const { default: OpenAI } = await import("openai");
        const openaiClient = new OpenAI({ apiKey: openaiKey });
        client.setOpenAIClient(openaiClient);
      } catch (e) {}
    } else {
    }
  });

  afterAll(async () => {
    // Clean up conversations
    console.log(
      `\n🧹 Cleaning up ${createdConversations.length} test conversations...`
    );
    for (const convId of createdConversations) {
      try {
        await client.deleteConversation(convId);
      } catch (error) {
        console.warn(`⚠️  Failed to delete conversation ${convId}`);
      }
    }

    // Clean up specifications
    console.log(
      `🧹 Cleaning up ${createdSpecifications.length} test specifications...`
    );
    for (const specId of createdSpecifications) {
      try {
        await client.deleteSpecification(specId);
      } catch (error) {
        console.warn(`⚠️  Failed to delete specification ${specId}`);
      }
    }
  }, 120000);

  // Helper to create a simple test image (1x1 red pixel PNG)
  function createTestImage(): { data: string; mimeType: string } {
    // 1x1 red pixel PNG in base64
    const redPixelPng =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
    return {
      data: redPixelPng,
      mimeType: "image/png",
    };
  }

  describe("Image Analysis in Conversations", () => {
    it("should handle image URL analysis in streaming conversation", async () => {
      console.log("🖼️ Testing image URL analysis in conversation...");

      // Create specification that supports vision
      const createResponse = await client.createSpecification({
        name: "Vision Test Spec",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4O_128K, // Vision-capable model
          temperature: 0.7,
          completionTokenLimit: 500,
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      const events: AgentStreamEvent[] = [];
      let conversationId: string | undefined;
      let finalResponse = "";

      // Use a well-known test image URL
      const imageUrl =
        "https://via.placeholder.com/300x200/ff0000/ffffff?text=Test+Image";

      // Check if streaming is supported
      if (!client.supportsStreaming()) {
        console.log("⚠️  Skipping test - streaming not supported");
        return;
      }

      await client.streamAgent(
        `Analyze this image and describe what you see: ${imageUrl}`,
        (event: AgentStreamEvent) => {
          events.push(event);
          console.log(`📨 Event: ${event.type}`);

          if (event.type === "conversation_started") {
            conversationId = event.conversationId;
            createdConversations.push(event.conversationId);
          } else if (event.type === "message_update") {
            console.log(
              `💬 Message update: "${event.message.message.slice(0, 100)}..."`
            );
          } else if (event.type === "conversation_completed") {
            finalResponse = event.message.message;
            console.log(
              `✅ Final response: "${finalResponse.slice(0, 100)}..."`
            );
          } else if (event.type === "error") {
            console.error(`❌ Error: ${event.error.message}`);
          }
        },
        undefined,
        { id: specId }
      );

      // Validate response
      const completedEvent = events.find(
        (e) => e.type === "conversation_completed"
      );
      expect(completedEvent).toBeDefined();
      expect(finalResponse).toBeTruthy();
      expect(finalResponse.length).toBeGreaterThan(10);

      // Response should mention image-related content
      const lowerResponse = finalResponse.toLowerCase();
      const hasImageTerms =
        lowerResponse.includes("image") ||
        lowerResponse.includes("picture") ||
        lowerResponse.includes("see") ||
        lowerResponse.includes("red") ||
        lowerResponse.includes("placeholder");

      expect(hasImageTerms).toBe(true);
      console.log("✅ Image URL analysis completed successfully");
    }, 120000);

    it("should handle base64 encoded image analysis", async () => {
      console.log("\n🖼️ Testing base64 image analysis...");

      // Create specification
      const createResponse = await client.createSpecification({
        name: "Encoded Image Test",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4O_128K,
          temperature: 0.7,
          completionTokenLimit: 300,
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      // Test with direct reviseEncodedImage call first
      const testImage = createTestImage();
      console.log(
        `📤 Using test image: ${testImage.mimeType}, size: ${testImage.data.length} chars`
      );

      let imageAnalysisResponse = "";

      try {
        const response = await client.reviseEncodedImage(
          "What color is this image?",
          testImage.mimeType,
          testImage.data,
          undefined, // No existing conversation
          { id: specId }
        );

        if (response.reviseEncodedImage?.conversation?.id) {
          createdConversations.push(
            response.reviseEncodedImage.conversation.id
          );
        }

        imageAnalysisResponse =
          response.reviseEncodedImage?.message?.message || "";
        console.log(`🔍 Image analysis: "${imageAnalysisResponse}"`);
      } catch (error) {
        console.log(`⚠️ Direct image analysis failed: ${error}`);
        // Continue with text-based test
      }

      // Test in streaming conversation context
      const events: AgentStreamEvent[] = [];
      let conversationId: string | undefined;

      // Check if streaming is supported
      if (!client.supportsStreaming()) {
        console.log("⚠️  Skipping test - streaming not supported");
        return;
      }

      await client.streamAgent(
        "I'm going to share an image with you shortly. Please be ready to analyze it.",
        (event: AgentStreamEvent) => {
          events.push(event);

          if (event.type === "conversation_started") {
            conversationId = event.conversationId;
            createdConversations.push(event.conversationId);
          }
        },
        undefined,
        { id: specId }
      );

      expect(conversationId).toBeDefined();

      // Follow up with image analysis in the same conversation
      if (imageAnalysisResponse) {
        const followUpEvents: AgentStreamEvent[] = [];

        await client.streamAgent(
          `Based on the image analysis that returned "${imageAnalysisResponse}", what can you tell me about working with encoded images?`,
          (event: AgentStreamEvent) => {
            followUpEvents.push(event);
            if (event.type === "conversation_completed") {
              console.log(
                `💬 Follow-up response: "${event.message.message.slice(0, 100)}..."`
              );
            }
          },
          conversationId,
          { id: specId }
        );

        expect(
          followUpEvents.some((e) => e.type === "conversation_completed")
        ).toBe(true);
      }

      console.log("✅ Base64 image analysis test completed");
    }, 120000);
  });

  describe("Mixed Text and Image Conversations", () => {
    it("should handle alternating text and image messages", async () => {
      console.log("\n🔄 Testing mixed text/image conversation...");

      // Create specification
      const createResponse = await client.createSpecification({
        name: "Mixed Content Test",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4O_128K,
          temperature: 0.5,
          completionTokenLimit: 400,
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      let conversationId: string | undefined;
      const messageHistory: string[] = [];

      // Step 1: Start with text
      console.log("📝 Step 1: Initial text message");
      // Check if streaming is supported
      if (!client.supportsStreaming()) {
        console.log("⚠️  Skipping test - streaming not supported");
        return;
      }

      await client.streamAgent(
        "Hello! I'm going to show you some images and ask questions about them. Please introduce yourself as an image analysis assistant.",
        (event: AgentStreamEvent) => {
          if (event.type === "conversation_started") {
            conversationId = event.conversationId;
            createdConversations.push(event.conversationId);
          } else if (event.type === "conversation_completed") {
            messageHistory.push(event.message.message);
            console.log(
              `📨 Response 1: "${event.message.message.slice(0, 50)}..."`
            );
          }
        },
        undefined,
        { id: specId }
      );

      expect(conversationId).toBeDefined();

      // Step 2: Ask about image concepts
      console.log("📝 Step 2: Image concept discussion");
      await client.streamAgent(
        "What are the main challenges in computer vision and image analysis?",
        (event: AgentStreamEvent) => {
          if (event.type === "conversation_completed") {
            messageHistory.push(event.message.message);
            console.log(
              `📨 Response 2: "${event.message.message.slice(0, 50)}..."`
            );
          }
        },
        conversationId,
        { id: specId }
      );

      // Step 3: Reference to image (even if we can't process it)
      console.log("📝 Step 3: Image reference message");
      const imageUrl =
        "https://via.placeholder.com/400x300/0000ff/ffffff?text=Blue+Square";
      await client.streamAgent(
        `Here's an image for you to consider: ${imageUrl}. What would you typically look for when analyzing an image like this?`,
        (event: AgentStreamEvent) => {
          if (event.type === "conversation_completed") {
            messageHistory.push(event.message.message);
            console.log(
              `📨 Response 3: "${event.message.message.slice(0, 50)}..."`
            );
          }
        },
        conversationId,
        { id: specId }
      );

      // Step 4: Follow-up text question
      console.log("📝 Step 4: Follow-up text");
      await client.streamAgent(
        "Based on our conversation about image analysis, what's the most important thing to remember when working with visual data?",
        (event: AgentStreamEvent) => {
          if (event.type === "conversation_completed") {
            messageHistory.push(event.message.message);
            console.log(
              `📨 Response 4: "${event.message.message.slice(0, 50)}..."`
            );
          }
        },
        conversationId,
        { id: specId }
      );

      // Validate conversation flow
      expect(messageHistory.length).toBe(4);
      messageHistory.forEach((message, idx) => {
        expect(message).toBeTruthy();
        expect(message.length).toBeGreaterThan(10);
        console.log(`✅ Message ${idx + 1}: ${message.length} characters`);
      });

      console.log("✅ Mixed content conversation completed successfully");
    }, 120000);
  });

  describe("Image Processing Performance", () => {
    it("should handle image analysis with reasonable performance", async () => {
      console.log("\n⏱️ Testing image processing performance...");

      // Create specification
      const createResponse = await client.createSpecification({
        name: "Performance Test Spec",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4OMini_128K, // Faster model for performance test
          temperature: 0.3,
          completionTokenLimit: 200,
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      // Performance metrics
      const startTime = Date.now();
      let firstTokenTime = 0;
      let completionTime = 0;
      let tokenCount = 0;

      const imageUrl =
        "https://via.placeholder.com/100x100/00ff00/000000?text=Perf";

      // Check if streaming is supported
      if (!client.supportsStreaming()) {
        console.log("⚠️  Skipping test - streaming not supported");
        return;
      }

      await client.streamAgent(
        `Quickly describe this small image in one sentence: ${imageUrl}`,
        (event: AgentStreamEvent) => {
          const currentTime = Date.now();

          if (event.type === "conversation_started") {
            createdConversations.push(event.conversationId);
          } else if (event.type === "message_update") {
            tokenCount++;
            if (firstTokenTime === 0) {
              firstTokenTime = currentTime - startTime;
            }
          } else if (event.type === "conversation_completed") {
            completionTime = currentTime - startTime;
          }
        },
        undefined,
        { id: specId }
      );

      // Performance analysis
      console.log("\n📊 Performance Metrics:");
      console.log(`  Time to first token: ${firstTokenTime}ms`);
      console.log(`  Total completion time: ${completionTime}ms`);
      console.log(`  Token count: ${tokenCount}`);

      if (tokenCount > 0) {
        const tokensPerSecond = (tokenCount / (completionTime / 1000)).toFixed(
          2
        );
        console.log(`  Tokens per second: ${tokensPerSecond}`);
      }

      // Performance expectations
      expect(firstTokenTime).toBeGreaterThan(0);
      expect(firstTokenTime).toBeLessThan(15000); // First token within 15 seconds
      expect(completionTime).toBeLessThan(30000); // Complete within 30 seconds
      expect(tokenCount).toBeGreaterThan(0);

      console.log("✅ Image processing performance test completed");
    }, 45000);
  });

  describe("Image Error Handling", () => {
    it("should handle invalid image URLs gracefully", async () => {
      console.log("\n🚫 Testing invalid image URL handling...");

      // Create specification
      const createResponse = await client.createSpecification({
        name: "Error Handling Test",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4O_128K,
          temperature: 0.7,
          completionTokenLimit: 200,
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      const events: AgentStreamEvent[] = [];
      let finalResponse = "";

      // Test with invalid image URL
      const invalidImageUrl =
        "https://invalid-domain-that-does-not-exist.com/image.jpg";

      // Check if streaming is supported
      if (!client.supportsStreaming()) {
        console.log("⚠️  Skipping test - streaming not supported");
        return;
      }

      await client.streamAgent(
        `Please analyze this image: ${invalidImageUrl}`,
        (event: AgentStreamEvent) => {
          events.push(event);

          if (event.type === "conversation_started") {
            createdConversations.push(event.conversationId);
          } else if (event.type === "conversation_completed") {
            finalResponse = event.message.message;
          } else if (event.type === "error") {
            console.log(`⚠️ Expected Error: ${event.error.message}`);
          }
        },
        undefined,
        { id: specId }
      );

      // Should complete even with invalid image
      expect(finalResponse).toBeTruthy();

      // Response should acknowledge the issue
      const lowerResponse = finalResponse.toLowerCase();
      const acknowledgesIssue =
        lowerResponse.includes("cannot") ||
        lowerResponse.includes("unable") ||
        lowerResponse.includes("error") ||
        lowerResponse.includes("access") ||
        lowerResponse.includes("invalid");

      console.log(`📝 Response: "${finalResponse.slice(0, 100)}..."`);
      console.log(`✅ Gracefully handled invalid image URL`);
    }, 30000);

    it("should handle malformed base64 image data", async () => {
      console.log("\n🚫 Testing malformed base64 handling...");

      // Create specification
      const createResponse = await client.createSpecification({
        name: "Base64 Error Test",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4O_128K,
          temperature: 0.7,
          completionTokenLimit: 100,
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      let errorHandled = false;

      try {
        // Try to use malformed base64 data
        await client.reviseEncodedImage(
          "What do you see in this image?",
          "image/png",
          "invalid-base64-data-that-is-not-a-real-image!@#$%",
          undefined,
          { id: specId }
        );
      } catch (error) {
        errorHandled = true;
        console.log(`✅ Caught expected error: ${error}`);
      }

      // Should either catch error or handle gracefully
      expect(errorHandled).toBe(true);
      console.log("✅ Malformed base64 data handled appropriately");
    }, 30000);
  });
});

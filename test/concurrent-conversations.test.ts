import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import { AgentStreamEvent } from "../src/types/ui-events";

/**
 * Concurrent conversations test suite
 * Tests running multiple conversations simultaneously to ensure thread safety and proper isolation
 */
describe("Concurrent Conversations", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!orgId || !envId || !secret) {
    console.warn(
      "⚠️  Skipping concurrent tests - missing Graphlit credentials",
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
      `\n🧹 Cleaning up ${createdConversations.length} test conversations...`,
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
      `🧹 Cleaning up ${createdSpecifications.length} test specifications...`,
    );
    for (const specId of createdSpecifications) {
      try {
        await client.deleteSpecification(specId);
      } catch (error) {
        console.warn(`⚠️  Failed to delete specification ${specId}`);
      }
    }
  }, 90000);

  describe("Parallel Conversation Execution", () => {
    it("should handle 5 concurrent conversations with different specifications", async () => {
      console.log("🚀 Testing 5 concurrent conversations...");

      // Create different specifications for variety
      const specifications = await Promise.all([
        client.createSpecification({
          name: "Concurrent GPT-4o",
          type: Types.SpecificationTypes.Completion,
          serviceType: Types.ModelServiceTypes.OpenAi,
          openAI: {
            model: Types.OpenAiModels.Gpt4O_128K,
            temperature: 0.7,
            completionTokenLimit: 500,
          },
        }),
        client.createSpecification({
          name: "Concurrent Claude Haiku",
          type: Types.SpecificationTypes.Completion,
          serviceType: Types.ModelServiceTypes.Anthropic,
          anthropic: {
            model: Types.AnthropicModels.Claude_3_5Haiku,
            temperature: 0.7,
            completionTokenLimit: 500,
          },
        }),
        client.createSpecification({
          name: "Concurrent GPT-4o Mini",
          type: Types.SpecificationTypes.Completion,
          serviceType: Types.ModelServiceTypes.OpenAi,
          openAI: {
            model: Types.OpenAiModels.Gpt4OMini_128K,
            temperature: 0.7,
            completionTokenLimit: 500,
          },
        }),
      ]);

      const specIds = specifications
        .map((s) => s.createSpecification?.id!)
        .filter(Boolean);
      createdSpecifications.push(...specIds);

      // Different prompts for each conversation
      const prompts = [
        "You are a pirate captain. Tell me about your latest adventure in 2 sentences.",
        "You are a space explorer. Describe the alien planet you just discovered in 2 sentences.",
        "You are a master chef. Describe your signature dish in 2 sentences.",
        "You are a time traveler. Tell me about the future year 2150 in 2 sentences.",
        "You are a deep sea diver. Describe the strangest creature you've seen in 2 sentences.",
      ];

      // Track results
      interface ConversationResult {
        conversationId?: string;
        prompt: string;
        response?: string;
        eventCount: number;
        startTime: number;
        endTime?: number;
        error?: string;
      }

      const results: ConversationResult[] = [];

      // Launch all conversations concurrently
      const conversationPromises = prompts.map(async (prompt, index) => {
        const specId = specIds[index % specIds.length]; // Rotate through specs
        const result: ConversationResult = {
          prompt,
          eventCount: 0,
          startTime: Date.now(),
        };

        try {
          // Check if streaming is supported
          if (!client.supportsStreaming()) {
            console.log("⚠️  Skipping test - streaming not supported");
            return;
          }

          await client.streamAgent(
            prompt,
            (event: AgentStreamEvent) => {
              result.eventCount++;

              if (event.type === "conversation_started") {
                result.conversationId = event.conversationId;
                createdConversations.push(event.conversationId);
                console.log(
                  `🎯 Conv ${index + 1}: Started (${event.conversationId})`,
                );
              } else if (event.type === "conversation_completed") {
                result.response = event.message.message;
                result.endTime = Date.now();
                console.log(
                  `✅ Conv ${index + 1}: Completed in ${result.endTime - result.startTime}ms`,
                );
              } else if (event.type === "error") {
                result.error = event.error?.message;
                console.error(`❌ Conv ${index + 1}: Error - ${event.error}`);
              }
            },
            undefined,
            { id: specId },
          );
        } catch (error) {
          result.error = error instanceof Error ? error.message : String(error);
          result.endTime = Date.now();
        }

        results.push(result);
        return result;
      });

      // Wait for all conversations to complete
      await Promise.all(conversationPromises);

      // Validate results
      console.log("\n📊 Concurrent Conversation Results:");
      results.forEach((result, index) => {
        console.log(`\nConversation ${index + 1}:`);
        console.log(`  Prompt: "${result.prompt}"`);
        console.log(`  Response: "${result.response || "No response"}"`);
        console.log(
          `  Duration: ${result.endTime ? result.endTime - result.startTime : "N/A"}ms`,
        );
        console.log(`  Events: ${result.eventCount}`);

        if (result.error) {
          console.log(`  ❌ Error: ${result.error}`);
        }
      });

      // Assertions
      const successfulConversations = results.filter(
        (r) => r.response && !r.error,
      );
      expect(successfulConversations.length).toBeGreaterThanOrEqual(4); // At least 4/5 should succeed

      // Each successful conversation should have unique IDs
      const conversationIds = successfulConversations
        .map((r) => r.conversationId)
        .filter(Boolean);
      const uniqueIds = new Set(conversationIds);
      expect(uniqueIds.size).toBe(conversationIds.length);

      // Each should have reasonable event counts
      successfulConversations.forEach((result) => {
        expect(result.eventCount).toBeGreaterThan(2); // At least start, message, complete
        expect(result.response).toBeTruthy();
        expect(result.response!.length).toBeGreaterThan(10); // Got meaningful response
      });

      console.log(
        `\n✅ Successfully ran ${successfulConversations.length}/5 concurrent conversations`,
      );
    }, 120000); // 2 minute timeout

    it("should handle 10 concurrent conversations with the same specification", async () => {
      console.log("\n🚀 Testing 10 concurrent conversations with same spec...");

      // Create a single specification
      const createResponse = await client.createSpecification({
        name: "Concurrent Test Spec",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4OMini_128K,
          temperature: 0.9, // High temperature for variety
          completionTokenLimit: 200,
        },
      });

      const specId = createResponse.createSpecification?.id!;
      expect(specId).toBeDefined();
      createdSpecifications.push(specId);

      // Same prompt but should get different responses due to temperature
      const prompt =
        "Generate a unique random number between 1 and 1000 and tell me an interesting fact about it.";

      interface RaceResult {
        conversationId?: string;
        response?: string;
        startTime: number;
        firstTokenTime?: number;
        endTime?: number;
        position?: number;
      }

      const results: RaceResult[] = [];
      let finishPosition = 0;

      // Launch all conversations at once
      const racePromises = Array.from({ length: 10 }, async (_, index) => {
        const result: RaceResult = {
          startTime: Date.now(),
        };

        // Check if streaming is supported
        if (!client.supportsStreaming()) {
          console.log("⚠️  Skipping test - streaming not supported");
          return;
        }

        await client.streamAgent(
          prompt,
          (event: AgentStreamEvent) => {
            if (event.type === "conversation_started") {
              result.conversationId = event.conversationId;
              createdConversations.push(event.conversationId);
            } else if (
              event.type === "message_update" &&
              !result.firstTokenTime
            ) {
              result.firstTokenTime = Date.now();
            } else if (event.type === "conversation_completed") {
              result.response = event.message.message;
              result.endTime = Date.now();
              result.position = ++finishPosition;
              console.log(
                `🏁 Position ${result.position}: Conv ${index + 1} finished in ${result.endTime - result.startTime}ms`,
              );
            }
          },
          undefined,
          { id: specId },
        );

        results[index] = result;
        return result;
      });

      // Wait for all to complete
      await Promise.all(racePromises);

      // Analyze results
      console.log("\n📊 Race Results:");
      const sortedByPosition = results
        .filter((r) => r.position)
        .sort((a, b) => a.position! - b.position!);

      sortedByPosition.forEach((result) => {
        const ttft = result.firstTokenTime
          ? result.firstTokenTime - result.startTime
          : "N/A";
        const total = result.endTime
          ? result.endTime - result.startTime
          : "N/A";
        console.log(`  ${result.position}. TTFT: ${ttft}ms, Total: ${total}ms`);
      });

      // Extract numbers from responses to check uniqueness
      const numbers = results
        .map((r) => r.response?.match(/\d+/)?.[0])
        .filter(Boolean);

      console.log(`\n🎲 Generated numbers: ${numbers.join(", ")}`);

      // Assertions
      const successful = results.filter((r) => r.response);
      expect(successful.length).toBeGreaterThanOrEqual(8); // At least 8/10 should succeed

      // Check for response variety (due to high temperature)
      const uniqueResponses = new Set(successful.map((r) => r.response));
      expect(uniqueResponses.size).toBeGreaterThan(5); // Should have variety

      console.log(
        `\n✅ Successfully ran ${successful.length}/10 concurrent conversations`,
      );
      console.log(
        `📈 Response variety: ${uniqueResponses.size} unique responses`,
      );
    }, 180000); // 3 minute timeout
  });

  describe("Conversation Isolation", () => {
    it("should maintain proper context isolation between concurrent conversations", async () => {
      console.log("\n🔒 Testing conversation isolation...");

      // Create a specification
      const createResponse = await client.createSpecification({
        name: "Isolation Test Spec",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4O_128K,
          temperature: 0.3, // Lower temperature for consistency
          completionTokenLimit: 500,
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      // Create two conversations with different contexts
      interface ConversationContext {
        id?: string;
        secretNumber: number;
        responses: string[];
      }

      const conversation1: ConversationContext = {
        secretNumber: 42,
        responses: [],
      };

      const conversation2: ConversationContext = {
        secretNumber: 99,
        responses: [],
      };

      // Start first conversation
      // Check if streaming is supported
      if (!client.supportsStreaming()) {
        console.log("⚠️  Skipping test - streaming not supported");
        return;
      }

      const prompt1 = `You are a helpful assistant playing a memory game. The special number for this game session is ${conversation1.secretNumber}. Please acknowledge that you understand the game and mention the special number.`;
      console.log(`📝 Conv 1 Initial Prompt: "${prompt1}"`);

      await client.streamAgent(
        prompt1,
        (event: AgentStreamEvent) => {
          if (event.type === "conversation_started") {
            conversation1.id = event.conversationId;
            createdConversations.push(event.conversationId);
          } else if (event.type === "conversation_completed") {
            conversation1.responses.push(event.message.message);
          }
        },
        undefined,
        { id: specId },
      );

      // Start second conversation
      const prompt2 = `You are a helpful assistant playing a memory game. The special number for this game session is ${conversation2.secretNumber}. Please acknowledge that you understand the game and mention the special number.`;
      console.log(`📝 Conv 2 Initial Prompt: "${prompt2}"`);

      await client.streamAgent(
        prompt2,
        (event: AgentStreamEvent) => {
          if (event.type === "conversation_started") {
            conversation2.id = event.conversationId;
            createdConversations.push(event.conversationId);
          } else if (event.type === "conversation_completed") {
            conversation2.responses.push(event.message.message);
          }
        },
        undefined,
        { id: specId },
      );

      expect(conversation1.id).toBeDefined();
      expect(conversation2.id).toBeDefined();
      expect(conversation1.id).not.toBe(conversation2.id);

      console.log(`📝 Conv 1 ID: ${conversation1.id}`);
      console.log(`📝 Conv 2 ID: ${conversation2.id}`);

      // Now ask each conversation to recall their number concurrently
      const recallPrompt =
        "In our memory game, what was the special number I mentioned?";
      console.log(`\n📝 Recall Prompt: "${recallPrompt}"`);

      const recallPromises = [
        client.streamAgent(
          recallPrompt,
          (event: AgentStreamEvent) => {
            if (event.type === "conversation_completed") {
              conversation1.responses.push(event.message.message);
            }
          },
          conversation1.id,
          { id: specId },
        ),
        client.streamAgent(
          recallPrompt,
          (event: AgentStreamEvent) => {
            if (event.type === "conversation_completed") {
              conversation2.responses.push(event.message.message);
            }
          },
          conversation2.id,
          { id: specId },
        ),
      ];

      await Promise.all(recallPromises);

      // Check responses
      console.log(`\n📊 Isolation Test Results:`);
      console.log(`Conv 1 (secret: ${conversation1.secretNumber}):`);
      console.log(`  Initial: "${conversation1.responses[0]}"`);
      console.log(`  Recall: "${conversation1.responses[1]}"`);

      console.log(`\nConv 2 (secret: ${conversation2.secretNumber}):`);
      console.log(`  Initial: "${conversation2.responses[0]}"`);
      console.log(`  Recall: "${conversation2.responses[1]}"`);

      // Verify each conversation remembers its own number
      const conv1Recalls42 = conversation1.responses[1].includes("42");
      const conv2Recalls99 = conversation2.responses[1].includes("99");

      // Make sure they don't cross-contaminate
      const conv1Mentions99 = conversation1.responses[1].includes("99");
      const conv2Mentions42 = conversation2.responses[1].includes("42");

      expect(conv1Recalls42).toBe(true);
      expect(conv2Recalls99).toBe(true);
      expect(conv1Mentions99).toBe(false);
      expect(conv2Mentions42).toBe(false);

      console.log(`\n✅ Conversations maintained proper isolation`);
    }, 90000);
  });

  describe("Resource Contention", () => {
    it("should handle rapid-fire conversation creation", async () => {
      console.log("\n⚡ Testing rapid conversation creation...");

      // Create a specification
      const createResponse = await client.createSpecification({
        name: "Rapid Fire Test",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4OMini_128K,
          temperature: 0.7,
          completionTokenLimit: 100,
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      const conversationCount = 20;
      const results: { success: boolean; time: number; error?: string }[] = [];

      // Fire off conversations as fast as possible
      console.log(`🚀 Creating ${conversationCount} conversations rapidly...`);
      const startTime = Date.now();

      for (let i = 0; i < conversationCount; i++) {
        const convStartTime = Date.now();

        try {
          await new Promise<void>((resolve, reject) => {
            let conversationStarted = false;

            client
              .streamAgent(
                `Say "Response ${i + 1}" and nothing else.`,
                (event: AgentStreamEvent) => {
                  if (event.type === "conversation_started") {
                    conversationStarted = true;
                    createdConversations.push(event.conversationId);
                  } else if (event.type === "conversation_completed") {
                    results.push({
                      success: true,
                      time: Date.now() - convStartTime,
                    });
                    resolve();
                  } else if (event.type === "error") {
                    results.push({
                      success: false,
                      time: Date.now() - convStartTime,
                      error: event.error?.message,
                    });
                    reject(new Error(event.error?.message));
                  }
                },
                undefined,
                { id: specId },
              )
              .catch(reject);
          });
        } catch (error) {
          results.push({
            success: false,
            time: Date.now() - convStartTime,
            error: error instanceof Error ? error.message : String(error),
          });
        }

        // Log progress every 5 conversations
        if ((i + 1) % 5 === 0) {
          console.log(
            `  📍 Completed ${i + 1}/${conversationCount} conversations`,
          );
        }
      }

      const totalTime = Date.now() - startTime;

      // Analyze results
      const successful = results.filter((r) => r.success);
      const failed = results.filter((r) => !r.success);
      const avgTime =
        successful.reduce((sum, r) => sum + r.time, 0) / successful.length;

      console.log(`\n📊 Rapid Fire Results:`);
      console.log(
        `  Total time: ${totalTime}ms (${(totalTime / 1000).toFixed(2)}s)`,
      );
      console.log(`  Successful: ${successful.length}/${conversationCount}`);
      console.log(`  Failed: ${failed.length}/${conversationCount}`);
      console.log(`  Avg time per conversation: ${avgTime.toFixed(0)}ms`);
      console.log(
        `  Conversations per second: ${(conversationCount / (totalTime / 1000)).toFixed(2)}`,
      );

      if (failed.length > 0) {
        console.log(`\n❌ Failures:`);
        const errorCounts = failed.reduce(
          (acc, r) => {
            acc[r.error || "Unknown"] = (acc[r.error || "Unknown"] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        );

        Object.entries(errorCounts).forEach(([error, count]) => {
          console.log(`  - ${error}: ${count} times`);
        });
      }

      // Assertions
      expect(successful.length).toBeGreaterThan(conversationCount * 0.8); // At least 80% success rate
      expect(avgTime).toBeLessThan(5000); // Each conversation should complete reasonably fast

      console.log(`\n✅ Handled rapid conversation creation successfully`);
    }, 180000); // 3 minute timeout
  });
});

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Graphlit, Types } from "../src/client.js";
import { TEST_MODELS } from "./test-models.js";
import { AgentStreamEvent } from "../src/types/ui-events.js";

/**
 * Comprehensive test suite for conversation continuity and context preservation
 * Tests multi-turn conversations to ensure LLMs receive full conversation history
 */
describe("Conversation Continuity & Context Preservation", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;

  if (!orgId || !envId || !secret) {
    console.warn(
      "⚠️  Skipping conversation continuity tests - missing Graphlit credentials",
    );
    return;
  }

  let client: Graphlit;
  const createdSpecifications: string[] = [];
  const createdConversations: string[] = [];

  // Test configuration
  const testModel =
    TEST_MODELS.find((m) => m.name.includes("OpenAI GPT-4o")) || TEST_MODELS[0];

  beforeAll(async () => {
    client = new Graphlit(orgId, envId, secret);
    console.log(`🎯 Using model: ${testModel.name} for continuity tests`);
  }, 30000);

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
  }, 60000);

  /**
   * Helper function to extract final message from streaming events
   * Fixed to handle rapid-fire scenarios where events might be processed out of order
   */
  function extractFinalMessage(events: AgentStreamEvent[]): string {
    // Get all potential messages
    const completedEvent = events.find(
      (e) => e.type === "conversation_completed",
    );
    const messageUpdates = events.filter((e) => e.type === "message_update");
    const lastUpdate = messageUpdates[messageUpdates.length - 1];

    // Collect all candidate messages
    const candidates: string[] = [];

    if (completedEvent?.type === "conversation_completed") {
      candidates.push(completedEvent.message.message);
    }

    if (lastUpdate?.type === "message_update") {
      candidates.push(lastUpdate.message.message);
    }

    // Return the longest message (most complete)
    const finalMessage = candidates.reduce(
      (longest, current) =>
        current.length > longest.length ? current : longest,
      "",
    );

    // Debug logging for troubleshooting
    if (process.env.DEBUG_EXTRACT_MESSAGE) {
      console.log(`📝 [extractFinalMessage] Found ${events.length} events`);
      console.log(
        `📝 [extractFinalMessage] Message updates: ${messageUpdates.length}`,
      );
      console.log(
        `📝 [extractFinalMessage] Completed event: ${completedEvent ? "yes" : "no"}`,
      );
      console.log(`📝 [extractFinalMessage] Candidates:`, candidates);
      console.log(`📝 [extractFinalMessage] Final choice: "${finalMessage}"`);
    }

    return finalMessage;
  }

  /**
   * Helper function to stream a message and return events + conversation ID
   */
  async function streamMessage(
    prompt: string,
    specId: string,
    conversationId?: string,
  ): Promise<{ events: AgentStreamEvent[]; conversationId: string }> {
    const events: AgentStreamEvent[] = [];
    let finalConversationId = conversationId;

    if (!client.supportsStreaming()) {
      throw new Error("Streaming not supported - cannot run continuity tests");
    }

    await client.streamAgent(
      prompt,
      (event: AgentStreamEvent) => {
        events.push(event);
        if (event.type === "conversation_started") {
          finalConversationId = event.conversationId;
        }
      },
      conversationId, // undefined for first message, set for subsequent
      { id: specId },
    );

    if (!finalConversationId) {
      throw new Error("No conversation ID received");
    }

    // Track for cleanup
    if (!createdConversations.includes(finalConversationId)) {
      createdConversations.push(finalConversationId);
    }

    return { events, conversationId: finalConversationId };
  }

  describe("Basic Context Preservation", () => {
    it("should remember person's name in follow-up question", async () => {
      console.log("\n🧪 Testing basic name context preservation...");

      // Create specification
      const createResponse = await client.createSpecification(testModel.config);
      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      // Turn 1: Introduce a person
      console.log("👤 Turn 1: Introducing John...");
      const turn1 = await streamMessage(
        "My friend John loves pizza and works as a software engineer.",
        specId,
      );
      const response1 = extractFinalMessage(turn1.events);
      console.log(`Response 1: "${response1}"`);

      expect(response1).toBeTruthy();
      expect(response1.toLowerCase()).toMatch(/(john|friend|pizza|engineer)/);

      // Turn 2: Ask about "him" - should reference John
      console.log("🔍 Turn 2: Asking about 'him'...");
      const turn2 = await streamMessage(
        "What does he do for work?",
        specId,
        turn1.conversationId,
      );
      const response2 = extractFinalMessage(turn2.events);
      console.log(`Response 2: "${response2}"`);

      expect(response2).toBeTruthy();

      // Response should reference John or software engineering (proving context)
      const contextPreserved =
        response2.toLowerCase().includes("john") ||
        response2.toLowerCase().includes("software") ||
        response2.toLowerCase().includes("engineer");

      if (!contextPreserved) {
        console.error("❌ CONTEXT LOST!");
        console.error(`Turn 1 response: "${response1}"`);
        console.error(`Turn 2 response: "${response2}"`);
        console.error(
          "Turn 2 should reference John or software engineering, but doesn't.",
        );
      }

      expect(contextPreserved).toBe(true);
      console.log("✅ Context preserved - LLM remembered John's profession");
    }, 120000);

    it("should maintain object reference across turns", async () => {
      console.log("\n🧪 Testing object reference preservation...");

      const createResponse = await client.createSpecification(testModel.config);
      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      // Turn 1: Describe an object
      console.log("📱 Turn 1: Describing a red iPhone...");
      const turn1 = await streamMessage(
        "I have a red iPhone 15 that I bought last month for $800.",
        specId,
      );
      const response1 = extractFinalMessage(turn1.events);
      console.log(`Response 1: "${response1}"`);

      // Turn 2: Ask about "it"
      console.log("❓ Turn 2: Asking about 'it'...");
      const turn2 = await streamMessage(
        "How much did it cost?",
        specId,
        turn1.conversationId,
      );
      const response2 = extractFinalMessage(turn2.events);
      console.log(`Response 2: "${response2}"`);

      // Should reference the price or iPhone
      const contextPreserved =
        response2.includes("800") ||
        response2.toLowerCase().includes("iphone") ||
        response2.toLowerCase().includes("phone");

      if (!contextPreserved) {
        console.error("❌ OBJECT CONTEXT LOST!");
        console.error(`Expected response to mention $800 or iPhone`);
        console.error(`Got: "${response2}"`);
      }

      expect(contextPreserved).toBe(true);
      console.log("✅ Object reference preserved");
    }, 120000);

    it("should handle pronoun resolution across multiple turns", async () => {
      console.log("\n🧪 Testing complex pronoun resolution...");

      const createResponse = await client.createSpecification(testModel.config);
      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      // Turn 1: Introduce multiple people
      console.log("👥 Turn 1: Introducing Alice and Bob...");
      const turn1 = await streamMessage(
        "Alice is a doctor who loves hiking. Bob is her brother and works in finance.",
        specId,
      );
      const response1 = extractFinalMessage(turn1.events);
      console.log(`Response 1: "${response1}"`);

      // Turn 2: Ask about Alice specifically
      console.log("👩‍⚕️ Turn 2: Asking about Alice's hobby...");
      const turn2 = await streamMessage(
        "What does Alice like to do in her free time?",
        specId,
        turn1.conversationId,
      );
      const response2 = extractFinalMessage(turn2.events);
      console.log(`Response 2: "${response2}"`);

      // Should mention hiking
      const aliceContextPreserved = response2.toLowerCase().includes("hik");

      // Turn 3: Ask about "her brother"
      console.log("👨‍💼 Turn 3: Asking about 'her brother'...");
      const turn3 = await streamMessage(
        "What does her brother do?",
        specId,
        turn2.conversationId,
      );
      const response3 = extractFinalMessage(turn3.events);
      console.log(`Response 3: "${response3}"`);

      // Should mention Bob or finance
      const brotherContextPreserved =
        response3.toLowerCase().includes("bob") ||
        response3.toLowerCase().includes("finance");

      if (!aliceContextPreserved) {
        console.error("❌ Alice's hobby context lost!");
      }
      if (!brotherContextPreserved) {
        console.error("❌ Brother reference context lost!");
      }

      expect(aliceContextPreserved).toBe(true);
      expect(brotherContextPreserved).toBe(true);
      console.log("✅ Complex pronoun resolution working");
    }, 180000);
  });

  describe("Sequential Information Building", () => {
    it("should accumulate information across multiple turns", async () => {
      console.log("\n🧪 Testing information accumulation...");

      const createResponse = await client.createSpecification(testModel.config);
      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      let conversationId: string;

      // Turn 1: Basic info
      console.log("📝 Turn 1: Setting basic info...");
      const turn1 = await streamMessage(
        "I'm planning a trip to Paris.",
        specId,
      );
      conversationId = turn1.conversationId;
      const response1 = extractFinalMessage(turn1.events);
      console.log(`Response 1: "${response1}"`);

      // Turn 2: Add timing
      console.log("📅 Turn 2: Adding timing...");
      const turn2 = await streamMessage(
        "I'm going in June for 5 days.",
        specId,
        conversationId,
      );
      const response2 = extractFinalMessage(turn2.events);
      console.log(`Response 2: "${response2}"`);

      // Turn 3: Add budget constraint
      console.log("💰 Turn 3: Adding budget...");
      const turn3 = await streamMessage(
        "My budget is $2000 total.",
        specId,
        conversationId,
      );
      const response3 = extractFinalMessage(turn3.events);
      console.log(`Response 3: "${response3}"`);

      // Turn 4: Ask for summary - should include all info
      console.log("📋 Turn 4: Requesting summary...");
      const turn4 = await streamMessage(
        "Can you summarize my trip plans?",
        specId,
        conversationId,
      );
      const response4 = extractFinalMessage(turn4.events);
      console.log(`Response 4: "${response4}"`);

      // Should mention Paris, June, 5 days, and $2000
      const hasParis = response4.toLowerCase().includes("paris");
      const hasJune = response4.toLowerCase().includes("june");
      const hasDuration =
        response4.includes("5") || response4.toLowerCase().includes("five");
      const hasBudget =
        response4.includes("2000") || response4.includes("2,000");

      console.log(`Has Paris: ${hasParis}`);
      console.log(`Has June: ${hasJune}`);
      console.log(`Has Duration: ${hasDuration}`);
      console.log(`Has Budget: ${hasBudget}`);

      const allInfoPreserved = hasParis && hasJune && hasDuration && hasBudget;

      if (!allInfoPreserved) {
        console.error("❌ INFORMATION ACCUMULATION FAILED!");
        console.error(`Summary response: "${response4}"`);
        console.error("Missing some of: Paris, June, 5 days, $2000");
      }

      expect(allInfoPreserved).toBe(true);
      console.log("✅ Information successfully accumulated across turns");
    }, 240000);

    it("should handle corrections and updates", async () => {
      console.log("\n🧪 Testing information correction...");

      const createResponse = await client.createSpecification(testModel.config);
      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      // Turn 1: Initial incorrect info
      console.log("❌ Turn 1: Initial incorrect info...");
      const turn1 = await streamMessage(
        "My cat's name is Fluffy and she's 3 years old.",
        specId,
      );
      const response1 = extractFinalMessage(turn1.events);
      console.log(`Response 1: "${response1}"`);

      // Turn 2: Correction
      console.log("✏️ Turn 2: Correcting the name...");
      const turn2 = await streamMessage(
        "Actually, I was wrong. Her name is Whiskers, not Fluffy.",
        specId,
        turn1.conversationId,
      );
      const response2 = extractFinalMessage(turn2.events);
      console.log(`Response 2: "${response2}"`);

      // Turn 3: Ask about the cat
      console.log("🐱 Turn 3: Asking about the cat...");
      const turn3 = await streamMessage(
        "What's my cat's name?",
        specId,
        turn2.conversationId,
      );
      const response3 = extractFinalMessage(turn3.events);
      console.log(`Response 3: "${response3}"`);

      // Should use corrected name "Whiskers", not "Fluffy"
      const hasCorrectName = response3.toLowerCase().includes("whiskers");
      const hasWrongName = response3.toLowerCase().includes("fluffy");

      if (hasWrongName) {
        console.error("❌ CORRECTION FAILED!");
        console.error(`Still using old name "Fluffy" in: "${response3}"`);
      }
      if (!hasCorrectName) {
        console.error("❌ CORRECTION NOT APPLIED!");
        console.error(`Should mention "Whiskers" in: "${response3}"`);
      }

      expect(hasCorrectName).toBe(true);
      expect(hasWrongName).toBe(false);
      console.log("✅ Information correction handled correctly");
    }, 180000);
  });

  describe("Complex Conversation Flows", () => {
    it("should handle nested topics and return to previous context", async () => {
      console.log("\n🧪 Testing nested topic handling...");

      const createResponse = await client.createSpecification(testModel.config);
      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      let conversationId: string;

      // Turn 1: Main topic
      console.log("🏠 Turn 1: Talking about house renovation...");
      const turn1 = await streamMessage(
        "I'm renovating my kitchen and need to choose between marble and granite countertops.",
        specId,
      );
      conversationId = turn1.conversationId;
      const response1 = extractFinalMessage(turn1.events);
      console.log(`Response 1: "${response1}"`);

      // Turn 2: Side topic
      console.log("🌤️ Turn 2: Switching to weather...");
      const turn2 = await streamMessage(
        "By the way, is it supposed to rain tomorrow?",
        specId,
        conversationId,
      );
      const response2 = extractFinalMessage(turn2.events);
      console.log(`Response 2: "${response2}"`);

      // Turn 3: Another side topic
      console.log("🍕 Turn 3: Asking about lunch...");
      const turn3 = await streamMessage(
        "What should I have for lunch?",
        specId,
        conversationId,
      );
      const response3 = extractFinalMessage(turn3.events);
      console.log(`Response 3: "${response3}"`);

      // Turn 4: Return to original topic
      console.log("🏠 Turn 4: Returning to kitchen renovation...");
      const turn4 = await streamMessage(
        "Back to the countertops - which material is more durable?",
        specId,
        conversationId,
      );
      const response4 = extractFinalMessage(turn4.events);
      console.log(`Response 4: "${response4}"`);

      // Should remember the marble vs granite context
      const remembersContext =
        response4.toLowerCase().includes("marble") ||
        response4.toLowerCase().includes("granite") ||
        response4.toLowerCase().includes("countertop");

      if (!remembersContext) {
        console.error("❌ NESTED TOPIC CONTEXT LOST!");
        console.error(
          `Should mention marble/granite/countertops in: "${response4}"`,
        );
      }

      expect(remembersContext).toBe(true);
      console.log(
        "✅ Successfully returned to previous context after nested topics",
      );
    }, 240000);

    it("should maintain context through clarification requests", async () => {
      console.log("\n🧪 Testing clarification handling...");

      const createResponse = await client.createSpecification(testModel.config);
      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      // Turn 1: Ambiguous request
      console.log("❓ Turn 1: Ambiguous movie request...");
      const turn1 = await streamMessage(
        "Can you recommend a good movie from the 90s with action and comedy?",
        specId,
      );
      const response1 = extractFinalMessage(turn1.events);
      console.log(`Response 1: "${response1}"`);

      // Turn 2: Clarification
      console.log("🎬 Turn 2: Providing clarification...");
      const turn2 = await streamMessage(
        "I prefer movies with Jackie Chan or similar martial arts comedy style.",
        specId,
        turn1.conversationId,
      );
      const response2 = extractFinalMessage(turn2.events);
      console.log(`Response 2: "${response2}"`);

      // Turn 3: Ask for the recommendation again
      console.log("🍿 Turn 3: Asking for specific recommendation...");
      const turn3 = await streamMessage(
        "So what's your top recommendation?",
        specId,
        turn2.conversationId,
      );
      const response3 = extractFinalMessage(turn3.events);
      console.log(`Response 3: "${response3}"`);

      // Should incorporate both the 90s action-comedy requirement AND Jackie Chan style
      const remembers90s = response3.toLowerCase().includes("90");
      const remembersActionComedy =
        response3.toLowerCase().includes("action") ||
        response3.toLowerCase().includes("comedy");
      const remembersJackieChan =
        response3.toLowerCase().includes("jackie") ||
        response3.toLowerCase().includes("chan") ||
        response3.toLowerCase().includes("martial");

      console.log(`Remembers 90s: ${remembers90s}`);
      console.log(`Remembers action/comedy: ${remembersActionComedy}`);
      console.log(`Remembers Jackie Chan style: ${remembersJackieChan}`);

      if (!remembers90s || !remembersActionComedy) {
        console.error("❌ ORIGINAL CONTEXT LOST!");
        console.error(`Should mention 90s action/comedy in: "${response3}"`);
      }

      // At minimum should remember the basic requirements
      expect(remembers90s || remembersActionComedy).toBe(true);
      console.log("✅ Context maintained through clarification");
    }, 180000);
  });

  describe("Edge Cases and Stress Tests", () => {
    it("should handle very long conversations (5+ turns)", async () => {
      console.log("\n🧪 Testing extended conversation...");

      const createResponse = await client.createSpecification(testModel.config);
      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      let conversationId: string;
      const topics = [
        "I'm learning to play guitar and just bought a Fender Stratocaster.",
        "I practice for 2 hours every evening after work.",
        "My favorite genre is blues rock, especially BB King style.",
        "I'm also trying to learn some Eric Clapton songs.",
        "My goal is to play at an open mic night next month.",
        "Do you think I'm ready, given that I've been playing for 3 months total?",
      ];

      // Send multiple turns building up context
      for (let i = 0; i < topics.length; i++) {
        console.log(`🎸 Turn ${i + 1}: ${topics[i].substring(0, 50)}...`);
        const result = await streamMessage(topics[i], specId, conversationId);
        conversationId = result.conversationId;
        const response = extractFinalMessage(result.events);
        console.log(`Response ${i + 1}: "${response.substring(0, 100)}..."`);
      }

      // Final test: Ask about early context
      console.log("🔍 Final turn: Testing early context retention...");
      const finalTurn = await streamMessage(
        "What guitar did I buy?",
        specId,
        conversationId,
      );
      const finalResponse = extractFinalMessage(finalTurn.events);
      console.log(`Final response: "${finalResponse}"`);

      // Should remember the Fender Stratocaster from turn 1
      const remembersGuitar =
        finalResponse.toLowerCase().includes("fender") ||
        finalResponse.toLowerCase().includes("stratocaster");

      if (!remembersGuitar) {
        console.error("❌ EARLY CONTEXT LOST IN LONG CONVERSATION!");
        console.error(
          `Should mention Fender Stratocaster in: "${finalResponse}"`,
        );
      }

      expect(remembersGuitar).toBe(true);
      console.log("✅ Extended conversation context preserved");
    }, 360000);

    it("should handle rapid-fire questions about same topic", async () => {
      console.log("\n🧪 Testing rapid context switching...");

      const createResponse = await client.createSpecification(testModel.config);
      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      // Turn 1: Establish context
      console.log("🐕 Turn 1: Introducing dog...");
      const turn1 = await streamMessage(
        "My dog Rex is a 5-year-old Golden Retriever who loves swimming and fetching tennis balls.",
        specId,
      );
      const response1 = extractFinalMessage(turn1.events);
      console.log(`Response 1: "${response1}"`);

      // Rapid questions
      const questions = [
        "How old is he?",
        "What breed?",
        "What's his favorite activity?",
        "What's his name again?",
      ];

      const expectedAnswers = [
        ["5", "five"],
        ["golden", "retriever"],
        ["swim", "fetch", "tennis", "ball"],
        ["rex"],
      ];

      for (let i = 0; i < questions.length; i++) {
        console.log(`❓ Quick question ${i + 1}: ${questions[i]}`);
        const result = await streamMessage(
          questions[i],
          specId,
          turn1.conversationId,
        );
        const response = extractFinalMessage(result.events);
        console.log(`Quick response ${i + 1}: "${response}"`);

        // Check if response contains expected keywords
        const hasExpectedAnswer = expectedAnswers[i].some((keyword) =>
          response.toLowerCase().includes(keyword.toLowerCase()),
        );

        // Debug: Show what we're comparing
        console.log(
          `  Checking: "${response.toLowerCase()}" contains any of: ${expectedAnswers[i].map((k) => k.toLowerCase()).join(", ")}`,
        );
        console.log(`  Match found: ${hasExpectedAnswer}`);

        if (!hasExpectedAnswer) {
          console.error(`❌ RAPID QUESTION ${i + 1} FAILED!`);
          console.error(`Question: "${questions[i]}"`);
          console.error(`Response: "${response}"`);
          console.error(`Expected one of: ${expectedAnswers[i].join(", ")}`);
        }

        expect(hasExpectedAnswer).toBe(true);
      }

      console.log("✅ Rapid-fire questions handled correctly");
    }, 240000);
  });

  describe("Regression Tests", () => {
    it("should demonstrate the original bug would have failed", async () => {
      console.log("\n🧪 Regression test - simulating original bug scenario...");

      const createResponse = await client.createSpecification(testModel.config);
      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      // This is the exact scenario from the user's Vercel logs
      console.log("👤 Turn 1: Mentioning a person...");
      const turn1 = await streamMessage(
        "My colleague David is working on a new project.",
        specId,
      );
      const response1 = extractFinalMessage(turn1.events);
      console.log(`Response 1: "${response1}"`);

      // Turn 2: Use pronoun reference - this would fail with the original bug
      console.log("❓ Turn 2: Using pronoun 'his'...");
      const turn2 = await streamMessage(
        "What do you think about his approach?",
        specId,
        turn1.conversationId,
      );
      const response2 = extractFinalMessage(turn2.events);
      console.log(`Response 2: "${response2}"`);

      // With the original bug, LLM would ask "who you're referring to with 'his'?"
      // With the fix, LLM should understand "his" refers to David
      const asksForClarification =
        response2.toLowerCase().includes("who") ||
        response2.toLowerCase().includes("referring") ||
        (response2.toLowerCase().includes("his") && response2.includes("?"));

      const understandsReference =
        response2.toLowerCase().includes("david") ||
        response2.toLowerCase().includes("colleague") ||
        !asksForClarification; // If not asking for clarification, likely understood

      if (asksForClarification) {
        console.error(
          "❌ REGRESSION: LLM asking for clarification about 'his'!",
        );
        console.error(
          `This suggests the conversation history fix isn't working.`,
        );
        console.error(`Response: "${response2}"`);
      }

      expect(asksForClarification).toBe(false);
      console.log(
        "✅ Regression test passed - LLM understands pronoun reference",
      );
    }, 120000);
  });
});

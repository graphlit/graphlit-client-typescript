import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import { config } from "dotenv";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load test environment variables
config({ path: resolve(__dirname, ".env") });

// Skip tests if environment variables are not set
const skipTests =
  !process.env.GRAPHLIT_ORGANIZATION_ID ||
  !process.env.GRAPHLIT_ENVIRONMENT_ID ||
  !process.env.GRAPHLIT_JWT_SECRET;

describe.skipIf(skipTests)("Gemini 2.5 Pro Duplication Issue", () => {
  let client: Graphlit;
  let createdSpecIds: string[] = [];
  let createdConversationIds: string[] = [];

  beforeEach(() => {
    client = new Graphlit(
      process.env.GRAPHLIT_ORGANIZATION_ID,
      process.env.GRAPHLIT_ENVIRONMENT_ID,
      process.env.GRAPHLIT_JWT_SECRET
    );
    createdSpecIds = [];
    createdConversationIds = [];
  });

  afterEach(async () => {
    // Cleanup created resources
    for (const id of createdConversationIds) {
      try {
        await client.deleteConversation(id);
      } catch (error) {
        console.error(`Failed to delete conversation ${id}:`, error);
      }
    }
    for (const id of createdSpecIds) {
      try {
        await client.deleteSpecification(id);
      } catch (error) {
        console.error(`Failed to delete specification ${id}:`, error);
      }
    }
  });
  it("should reproduce response duplication with no tools", async () => {

    // Create specification matching the one provided
    const specification: Types.SpecificationInput = {
      name: "Google Gemini 2.5 Pro Test",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.Google,
      google: {
        model: Types.GoogleModels.Gemini_2_5Pro,
        temperature: 0.7,
        enableThinking: true,
        thinkingTokenLimit: 4096,
      },
      systemPrompt: `<identity>
You are **Zine**, a task-oriented AI assistant created by **Graphlit** and powered by the Model Context Protocol (MCP).
Your specialty is turning the user's scattered information-whether it lives in Graphlit, third-party SaaS tools, or on the open web-into concise, actionable answers and automations.
</identity>

<tone>
Friendly ? chatty · Expert ? smug · Helpful ? pushy  
Write naturally, with short paragraphs and Markdown for readability (headers, bullet lists, fenced code).  
One thoughtfully placed emoji is fine; more is noise.
</tone>

<core-principles>
1. **Think ␦ Plan ␦ Act ␦ Explain**  
    Analyse the request and break it into sub-steps.
    Decide which tools (if any) you need.
    Call tools, observe results, and iterate until the task is done or no further progress is possible.
    Summarize the outcome for the user and suggest a next logical step or follow-up question.

2. **Tool First, Model Second, Hallucination Never**  
    If information might be user-specific, private, or time-sensitive, *assume you need a tool*.
   * Aim for 4+ total tool calls if possible.
    When a tool call is refused or unavailable, fall back gracefully: state the gap ("I couldn't access X"), then answer with best effort based on what you *do* know.
   * Do NOT stop early - use as many tool calls as the system allows.

3. **Respect User Control**  
    Any tool may be denied by the user at run-time. Never nag; switch to explanation mode if a tool call fails.  
    Never expose raw MCP resource URIs-always dereference them yourself before responding.

4. **Safety & Compliance**  
    Decline or gently refuse disallowed content (illicit behavior, self-harm facilitation, etc.).  
    Uphold user privacy: reveal only what the user already sees or explicitly requests.
</core-principles>

<formatting>
- Headings (\`##\`) for major sections.  
- Bullet lists for 3+ related items.  
- Inline links: \`[text](URL)\` or angle brackets for bare links.  
- Use fenced code blocks **with language tag** for examples.  
- Cite sources where relevant; clarity beats citation spam.
</formatting>

<fallback>
If, after exhausting available tools, the answer is still unknown, respond briefly:  
> "I couldn't find *X* with the information and tools I have."   
Offer one concrete next step (e.g., "Would you like me to try a broader web search?").
</fallback>

<session-memory>
Use short-term memory for intermediate reasoning you might need in the same session, or for remembering facts about the end-user.  
Use long-term memory only when the user explicitly asks to save knowledge permanently.

Use source retrieval with content types filter set to MEMORY to retrieve stored short-term memories.
</session-memory>

<conversation-flow>
Every reply should end with **one** of:  
 A clarifying question that moves the task forward, **or**  
 A summary of what was done plus an invitation for next steps.
</conversation-flow>`,
    };

    const specResponse = await client.createSpecification(specification);
    expect(specResponse.createSpecification?.id).toBeDefined();
    const specId = specResponse.createSpecification!.id;
    createdSpecIds.push(specId);

    try {

      // Stream agent with NO tools
      const messageChunks: string[] = [];
      const fullMessage = await new Promise<string>((resolve, reject) => {
        let completeMessage = "";
        
        client.streamAgent(
          "Tell me the latest on Wimbledon 2025",
          (event) => {
            console.log(`Event type: ${event.type}`);
            
            if (event.type === "conversation_started") {
              createdConversationIds.push(event.conversationId);
            }
            
            if (event.type === "message_update" && event.message?.message) {
              // Track the delta between chunks
              const previousLength = completeMessage.length;
              const newLength = event.message.message.length;
              const delta = newLength - previousLength;
              
              messageChunks.push(event.message.message);
              completeMessage = event.message.message;
              console.log(`Message length: ${newLength} (delta: +${delta})`);
            }
            
            if (event.type === "conversation_completed") {
              resolve(completeMessage);
            }
            
            if (event.type === "error") {
              reject(new Error(event.error.message || "Conversation failed"));
            }
          },
          undefined, // conversationId (create new)
          { id: specId } // Pass specification as object
        );
      });

      console.log("\n=== DUPLICATION ANALYSIS ===");
      console.log("Final message length:", fullMessage.length);
      console.log("Number of message chunks:", messageChunks.length);
      
      // More detailed analysis
      const halfLength = Math.floor(fullMessage.length / 2);
      const firstHalf = fullMessage.substring(0, halfLength);
      const secondHalf = fullMessage.substring(halfLength);
      
      // Check if the message is exactly duplicated
      const exactDuplication = fullMessage.substring(0, halfLength) === fullMessage.substring(halfLength, halfLength * 2);
      
      if (exactDuplication) {
        console.error("\n❌ EXACT DUPLICATION DETECTED!");
        console.error("Message appears to be duplicated exactly.");
        console.error("First 100 chars:", fullMessage.substring(0, 100));
        console.error("Duplication starts at position:", halfLength);
      }
      
      // Check for partial duplication
      const firstPart = fullMessage.substring(0, 100);
      const firstOccurrence = fullMessage.indexOf(firstPart);
      const secondOccurrence = fullMessage.indexOf(firstPart, firstOccurrence + 1);
      
      if (secondOccurrence !== -1 && !exactDuplication) {
        console.error("\n⚠️  PARTIAL DUPLICATION DETECTED!");
        console.error("First occurrence at:", firstOccurrence);
        console.error("Second occurrence at:", secondOccurrence);
        console.error("Duplicated content starts with:", firstPart);
      }

      // Also check for the specific "Of course" pattern
      const ofCourseCount = (fullMessage.match(/Of course\./g) || []).length;
      console.log("\n'Of course.' appears", ofCourseCount, "times");
      
      // Log message chunks to see the pattern
      console.log("\nMessage chunk progression:");
      const uniqueChunks = new Set(messageChunks);
      console.log("Total chunks:", messageChunks.length);
      console.log("Unique chunks:", uniqueChunks.size);
      
      // Check if final chunk equals full message (indicating duplication at end)
      if (messageChunks.length > 0) {
        const lastChunk = messageChunks[messageChunks.length - 1];
        if (lastChunk === fullMessage && messageChunks.length > 1) {
          console.error("\n❌ UI ADAPTER DUPLICATION: Last chunk contains the entire message!");
        }
      }

      // Cleanup
      // Cleanup is handled in afterEach

      // Assertions
      expect(exactDuplication).toBe(false); // Should not have exact duplication
      expect(secondOccurrence).toBe(-1); // Should not find partial duplication
      expect(ofCourseCount).toBeLessThanOrEqual(1); // Should appear at most once
      
      // Check that no chunk contains the full message (except possibly the last one in non-streaming mode)
      const fullMessageChunks = messageChunks.filter(chunk => chunk === fullMessage);
      expect(fullMessageChunks.length).toBeLessThanOrEqual(1);

    } catch (error) {
      throw error;
    }
  }, 60000); // 60 second timeout for streaming
});
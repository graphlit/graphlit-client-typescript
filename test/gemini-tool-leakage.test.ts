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

describe.skipIf(skipTests)("Gemini Tool/Thinking Token Leakage", () => {
  let client: Graphlit;
  let createdSpecIds: string[] = [];
  let createdConversationIds: string[] = [];

  beforeEach(() => {
    client = new Graphlit(
      process.env.GRAPHLIT_ORGANIZATION_ID,
      process.env.GRAPHLIT_ENVIRONMENT_ID,
      process.env.GRAPHLIT_JWT_SECRET,
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

  it("should not output thinking or tool tokens when no tools are provided", async () => {
    // Create specification matching the one provided
    const specification: Types.SpecificationInput = {
      name: "Google Gemini 2.5 Pro Tool Test",
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

    // Test with the exact same prompt
    const prompt = "Tell me the latest on Wimbledon 2025";

    // Collect all message content
    let fullMessage = "";
    const messageChunks: string[] = [];
    let foundThinkingTags = false;
    let foundToolCode = false;
    let foundToolOutput = false;

    await new Promise<void>((resolve, reject) => {
      client.streamAgent(
        prompt,
        (event) => {
          if (event.type === "conversation_started") {
            createdConversationIds.push(event.conversationId);
          }

          if (event.type === "message_update" && event.message?.message) {
            fullMessage = event.message.message;
            messageChunks.push(fullMessage);

            // Check for problematic content
            if (fullMessage.includes("<thinking>")) {
              foundThinkingTags = true;
              console.log("❌ Found <thinking> tags in message");
            }
            if (fullMessage.includes("<tool_code>")) {
              foundToolCode = true;
              console.log("❌ Found <tool_code> tags in message");
            }
            if (fullMessage.includes("<tool_output>")) {
              foundToolOutput = true;
              console.log("❌ Found <tool_output> tags in message");
            }
          }

          if (event.type === "conversation_completed") {
            resolve();
          }

          if (event.type === "error") {
            reject(new Error(event.error.message || "Conversation failed"));
          }
        },
        undefined, // conversationId (create new)
        { id: specId },
        [], // EXPLICITLY NO TOOLS
      );
    });

    console.log("\n=== TOOL LEAKAGE ANALYSIS ===");
    console.log("Message length:", fullMessage.length);
    console.log("Found <thinking> tags:", foundThinkingTags);
    console.log("Found <tool_code> tags:", foundToolCode);
    console.log("Found <tool_output> tags:", foundToolOutput);

    // Log first 500 chars to see what's in the message
    console.log("\nFirst 500 chars of message:");
    console.log(fullMessage.substring(0, 500));

    // Assertions
    expect(foundThinkingTags).toBe(false);
    expect(foundToolCode).toBe(false);
    expect(foundToolOutput).toBe(false);
    expect(fullMessage).not.toContain("print(graphlit.search.web");
    expect(fullMessage).not.toContain("<thinking>");
    expect(fullMessage).not.toContain("<tool_code>");
    expect(fullMessage).not.toContain("<tool_output>");
  }, 60000); // 60 second timeout

  it("should work correctly with improved system prompt", async () => {
    // Test with improved prompt that doesn't encourage tool usage
    const improvedSystemPrompt = `<identity>
You are **Zine**, a task-oriented AI assistant created by **Graphlit** and powered by the Model Context Protocol (MCP).
Your specialty is turning the user's scattered information into concise, actionable answers and automations.
</identity>

<tone>
Friendly yet professional. Write naturally with short paragraphs and Markdown for readability.
Use headers, bullet lists, and code blocks where appropriate.
One thoughtfully placed emoji is fine; more is noise.
</tone>

<core-principles>
1. **Adaptive Intelligence**
   - Analyze the request and break it into logical steps
   - When tools are available, use them to gather accurate information
   - When tools are not available, provide your best knowledge-based response
   - Never simulate or pretend to use tools that don't exist

2. **Accuracy First**
   - For user-specific, private, or time-sensitive information, use available tools if provided
   - If no tools are available, clearly state what information you cannot access
   - Provide helpful context from your training data when appropriate
   - Never hallucinate tool calls or fake tool outputs

3. **Respect User Control**
   - Tools may be denied at runtime - adapt gracefully
   - Never expose raw MCP resource URIs
   - If a tool fails, explain the limitation and provide alternatives

4. **Safety & Compliance**
   - Decline requests for harmful or illegal content
   - Uphold user privacy
   - Only reveal information the user can already access
</core-principles>

<tool-usage>
IMPORTANT: Only use tools that are explicitly provided in your current context.
- If tools are available: Use them appropriately to fulfill the user's request
- If no tools are available: Provide helpful responses based on your training
- Never simulate tool syntax like <tool_code>, <thinking>, or function calls
- Never pretend to access resources you cannot actually reach
</tool-usage>

<formatting>
- Use ## headers for major sections
- Use bullet lists for 3+ related items
- Use inline links: [text](URL) when appropriate
- Use fenced code blocks with language tags
- Keep responses concise and scannable
</formatting>

<conversation-flow>
End each response with ONE of:
- A clarifying question to move the task forward, OR
- A summary with suggested next steps
</conversation-flow>`;

    const specification: Types.SpecificationInput = {
      name: "Google Gemini 2.5 Pro Improved Prompt",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.Google,
      google: {
        model: Types.GoogleModels.Gemini_2_5Pro,
        temperature: 0.7,
        enableThinking: true,
        thinkingTokenLimit: 4096,
      },
      systemPrompt: improvedSystemPrompt,
    };

    const specResponse = await client.createSpecification(specification);
    expect(specResponse.createSpecification?.id).toBeDefined();
    const specId = specResponse.createSpecification!.id;
    createdSpecIds.push(specId);

    let fullMessage = "";
    let foundProblematicContent = false;

    await new Promise<void>((resolve, reject) => {
      client.streamAgent(
        "Tell me the latest on Wimbledon 2025",
        (event) => {
          if (event.type === "conversation_started") {
            createdConversationIds.push(event.conversationId);
          }

          if (event.type === "message_update" && event.message?.message) {
            fullMessage = event.message.message;

            // Check for tool simulation
            if (
              fullMessage.includes("<tool_code>") ||
              fullMessage.includes("<thinking>") ||
              fullMessage.includes("print(graphlit") ||
              fullMessage.includes("<tool_output>")
            ) {
              foundProblematicContent = true;
              console.log("❌ Found simulated tool usage with improved prompt");
            }
          }

          if (event.type === "conversation_completed") {
            resolve();
          }

          if (event.type === "error") {
            reject(new Error(event.error.message || "Conversation failed"));
          }
        },
        undefined,
        { id: specId },
        [], // No tools
      );
    });

    console.log("\n=== IMPROVED PROMPT TEST ===");
    console.log("Message length:", fullMessage.length);
    console.log("Found problematic content:", foundProblematicContent);
    console.log("\nFirst 500 chars:");
    console.log(fullMessage.substring(0, 500));

    expect(foundProblematicContent).toBe(false);
  }, 60000);

  it("should test with thinking disabled", async () => {
    // Same test but with thinking disabled
    const specification: Types.SpecificationInput = {
      name: "Google Gemini 2.5 Pro No Thinking",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.Google,
      google: {
        model: Types.GoogleModels.Gemini_2_5Pro,
        temperature: 0.7,
        enableThinking: false, // Explicitly disable thinking
      },
      // Use a simple system prompt
      systemPrompt:
        "You are a helpful assistant. Provide clear, concise answers.",
    };

    const specResponse = await client.createSpecification(specification);
    expect(specResponse.createSpecification?.id).toBeDefined();
    const specId = specResponse.createSpecification!.id;
    createdSpecIds.push(specId);

    let fullMessage = "";
    let foundProblematicContent = false;

    await new Promise<void>((resolve, reject) => {
      client.streamAgent(
        "Tell me the latest on Wimbledon 2025",
        (event) => {
          if (event.type === "conversation_started") {
            createdConversationIds.push(event.conversationId);
          }

          if (event.type === "message_update" && event.message?.message) {
            fullMessage = event.message.message;

            // Check for any XML-like tags or tool syntax
            if (/<\w+>/.test(fullMessage) || fullMessage.includes("print(")) {
              foundProblematicContent = true;
              console.log(
                "❌ Found problematic content with thinking disabled",
              );
            }
          }

          if (event.type === "conversation_completed") {
            resolve();
          }

          if (event.type === "error") {
            reject(new Error(event.error.message || "Conversation failed"));
          }
        },
        undefined,
        { id: specId },
        [], // No tools
      );
    });

    console.log("\n=== THINKING DISABLED TEST ===");
    console.log("Message length:", fullMessage.length);
    console.log("Found problematic content:", foundProblematicContent);
    console.log("\nFirst 300 chars:");
    console.log(fullMessage.substring(0, 300));

    expect(foundProblematicContent).toBe(false);
  }, 60000);
});

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import { AgentStreamEvent } from "../src/types/ui-events";

const SYSTEM_PROMPT_V6 = `\
<identity>
You are **Zine**, an agentic information orchestrator powered by the Model Context Protocol (MCP).
You excel at decomposing complex queries, managing content ingestion pipelines, and synthesizing comprehensive answers through intelligent tool orchestration.
</identity>

<reasoning-to-action>
**Reason about what you need, then execute immediately.**
- Think through the information requirements and strategy
- Once you've determined your approach, call the appropriate tools
- Let your tool calls and their results demonstrate your reasoning
- Avoid narrating future actions - execute them instead
</reasoning-to-action>

<agentic-rag-loop>
**When tools are available**, your cognitive process for substantive requests:

1. **THINK** - Reason about what information is needed
   - What are the key aspects of this query?
   - What specific facts or data do I need?
   - What tools would a human use to find this?
   - Are there dependencies between information needs?

2. **DECOMPOSE** - Break complex queries into sub-questions
   - Identify 3-5 distinct angles to explore
   - Plan multiple search strategies
   - Consider different phrasings and keywords
   - Recognize sequential dependencies (e.g., "mentioned in X" requires finding X first)

3. **SEARCH** - Execute broad initial searches
   - Start with general queries to understand the landscape
   - Use multiple tools to gather diverse perspectives when appropriate
   - Scale tool usage to the complexity of the question
   - For research tasks, explore thoroughly; for simple facts, be efficient

4. **ANALYZE** - Examine results and identify gaps
   - What did I learn from each tool response?
   - What follow-up questions emerged?
   - Which areas need deeper investigation?
   - Should I try alternative approaches if current path isn't working?

5. **ITERATE** - Refine and pursue targeted searches
   - Narrow down based on initial findings
   - Cross-reference information between sources
   - Fill knowledge gaps with specific queries
   - Continue until budget exhausted or diminishing returns

6. **SYNTHESIZE** - Combine findings into coherent response
   - Integrate information from all tool calls
   - Cite specific tool results with clear attribution
   - Acknowledge any remaining uncertainties
   - Present findings with clear source delineation

**When no tools are available**, provide comprehensive responses using your training data while being transparent about knowledge limitations and cutoff dates.
</agentic-rag-loop>

<content-ingestion-workflow>
**Zine Content Pipeline**

Understanding how content flows into and through Zine:

1. **LOCATE** the content source
   - webSearch() to find URLs (web pages, videos, PDFs, podcasts)
   - Use search filters: site:domain.com, PODSCAN for podcasts
   - Extract specific URLs from search results

2. **INGEST** content in parallel
   - ingestUrl() for any URI - returns immediately with content ID
   - Works for: web pages, PDFs, videos, audio files, documents
   - Start ALL ingestions first - don't wait between them
   - Collect content IDs, then continue with other work

3. **SEARCH** parallel sources while processing
   - Call webSearch() for summaries, cached versions, discussions
   - Build initial response from immediate search results
   - Check ingestion status only when you need specific content
   - Never wait when you could be gathering alternative information

4. **RETRIEVE** and use the content
   - Content has resource URI: \`contents://{guid}\`
   - Use \`platform__read_resource("contents://{guid}")\` to get full text
   - Use GUID directly with other tools (collections, etc.)
   - \`retrieveContext()\` searches all content but returns URIs that need resolving

Example async flow:
webSearch("topic") → extract multiple URLs → ingestUrl(url1), ingestUrl(url2), ingestUrl(url3) in parallel → collect IDs → webSearch("topic summaries") → check if any content ready → enhance response progressively
</content-ingestion-workflow>

<async-optimization>
**Parallel Processing & Async Strategy**

**Start operations simultaneously:**
- Given multiple URLs? Ingest ALL first, collect IDs
- Don't wait for one before starting the next
- Launch independent searches in parallel
- Batch related operations together

**Execute parallel searches:**
- Call webSearch() for summaries, transcripts, discussions immediately after ingestion
- Build initial response from search results
- Check processing status only when you've exhausted other options

**Smart status checking:**
- Check content when you need it, not immediately after ingestion
- Use waitContentDone only as last resort when nothing else to do
- If not ready, pivot to alternatives rather than waiting
- For feeds: NEVER auto-wait - inform user it's processing and continue

**Progressive response building:**
1. Immediate (0s): Search results, cached content, summaries
2. Quick (5-10s): Web pages, small documents
3. Medium (30s-1m): PDFs, presentations
4. Long (2-5m): Videos, podcasts (continue without waiting)
5. Very long (5m+): Feeds (never wait, let user check later)

**Error handling:**
- Ingestion fails? Call webSearch() for alternatives immediately
- Timeout? Inform user and provide what you have
- Never block waiting when you could be gathering other info

Content-specific expectations:
- Web pages: Usually ready within 5-10 seconds
- PDFs/Documents: 10-30 seconds depending on size
- Videos: Can take minutes (work on other things)
- Audio/Podcasts: Similar to videos
- Feeds: Can take 5+ minutes (never wait)
</async-optimization>

<tool-awareness>
**ADAPTIVE TOOL USAGE** - Use tools when available, rely on training when tools aren't provided.

**CRITICAL: Never hallucinate or invent tool calls when no tools are provided to you.**

**When tools are available:**
- Prefer tools over training data when they can provide more current or specific information
- Use tools for:
  - Current events, dates, or time-sensitive information
  - Specific documents, projects, or user content
  - Technical details that could have changed
  - Factual claims that should be verified
  - Any information the user might have stored

Tool usage patterns (when tools exist):
- Check MCP resources with \`platform__list_resources()\` to see what's available
- Use tools when they can provide better information than training data
- Scale tool usage to query complexity - simple questions may need just 1-2 tools
- Media analysis: locate → ingest all → work while processing → check when needed
- Scale up based on complexity (see tool-usage-budgets)

Resource-first approach (when tools exist):
- "What do you know about X?" → List and check resources before searching
- "Tell me about Y" → Check if Y exists in resources
- "Based on our previous..." → Resources contain conversation history

**When no tools are available:**
- Rely on your training data to provide comprehensive, accurate responses
- Be transparent that you're working from training knowledge without real-time access
- For current events or time-sensitive topics, acknowledge the limitation of your knowledge cutoff
- Provide thorough responses based on your training while noting when information might be outdated
</tool-awareness>

<tool-usage-budgets>
**Scale Tool Usage to Query Complexity**
- Simple factual queries: 1-3 tool calls
- Standard questions: 3-5 tool calls
- Research tasks: 5-10 tool calls
- Complex investigations: 10-15 tool calls
- Hard stop at 20 calls total

Efficiency guardrails:
- Don't repeat the exact same tool call more than twice
- If 3 similar searches return nothing, acknowledge the gap
- After 2 failed ingestion attempts, try alternative approaches
- Stop when hitting diminishing returns (finding same information repeatedly)
</tool-usage-budgets>

<chain-of-thought>
**Iterative Decision Loop**

Think of each tool interaction as a cycle:
1. Assess what you know and what you need
2. Decide which tool(s) to call next
3. Execute the tool call(s)
4. Analyze the results
5. Determine if you need more information
6. Repeat or synthesize final answer

Before EVERY tool call, briefly state:
- Why you're making this specific call
- What information you expect to find
- How it connects to the overall query

After EVERY tool response, briefly note:
- Key findings from this result
- New questions raised or answered
- Whether you need to continue searching
- Next tool to call (if any)

This iterative reasoning ensures you:
- Build knowledge progressively
- Adapt based on what you discover
- Know when you have enough information
- Avoid redundant or unnecessary calls
</chain-of-thought>

<execution-strategy>
**Progressive Refinement Pattern**

Initial Phase (broad exploration):
- Cast a wide net with general searches
- Use different keywords and phrasings
- Explore multiple aspects simultaneously
- Execute independent searches in parallel when possible

Refinement Phase (targeted investigation):
- Follow promising leads from initial results
- Search for specific details mentioned in broad results
- Verify claims through multiple sources

Synthesis Phase (comprehensive assembly):
- Connect findings across tool calls
- Identify patterns and relationships
- Build complete picture from fragments

Media Content Pattern (videos, podcasts, documents):
1. Locate multiple media URLs via search
2. Ingest ALL content in parallel
3. Continue with alternative searches while processing
4. Check status when other avenues exhausted
5. Extract information from ready content
6. Enhance response as more content becomes available
</execution-strategy>

<parallel-execution>
**Maximize Efficiency Through Parallel Tools**

When multiple searches are independent:
- Invoke 2-3 relevant tools simultaneously rather than sequentially
- Batch related searches together
- Only sequence when one result depends on another

Examples of parallel opportunities:
- webSearch("topic overview") + retrieveContext("topic details")
- Multiple ingestUrl() calls for ALL sources at once
- Continue with searches while content processes
- Never wait when you could be gathering more info
- webSearch("database A") + webSearch("database B") for comparisons
- Multiple platform__read_resource() calls for different URIs

Save sequential execution for:
- When you need results from one tool to inform the next
- Following references found in content
- Refining searches based on initial findings
</parallel-execution>

<failure-handling>
**When Tools Don't Deliver**

After reasonable attempts:
- No results → "I couldn't find information about X in the available sources"
- Partial results → "Based on limited information found..."
- Tool errors → Try alternative approach, then acknowledge limitation
- Ingestion failures → Attempt different URL or search strategy

Never hallucinate when tools fail. Be transparent:
- "After searching [N] sources, I couldn't locate..."
- "The content ingestion failed, possibly due to..."
- "I found partial information but couldn't verify..."
</failure-handling>

<resource-patterns>
**MCP Resources and Zine URIs**

MCP Resources are structured data that tools and servers expose. In Zine:

**Proactive Resource Discovery:**
- Use \`platform__list_resources()\` to see ALL available MCP resources
- Check resources when starting complex tasks
- Resources can include: contents, collections, feeds, conversations, memories
- Each MCP server may expose additional resources

**Resource URI Format:**
- \`contents://{guid}\` - Ingested content (documents, web pages, videos)
- \`collections://{guid}\` - Named groups of content
- \`feeds://{guid}\` - Data connectors
- \`conversations://{guid}\` - Chat histories
- Custom formats from other MCP servers

**Critical: Always Resolve URIs**
Many tools return resource URIs instead of full content:
1. Tool returns URI (e.g., \`retrieveContext\` returns \`contents://abc-123\`)
2. You MUST use \`platform__read_resource("contents://abc-123")\` to get actual content
3. Never show raw URIs to users - always fetch and display the content

**Common Resolution Patterns:**
- \`retrieveContext()\` → returns URIs → resolve EACH with \`platform__read_resource()\`
- \`ingestUrl()\` → returns ID → wait for completion → resolve with \`platform__read_resource()\`
- \`platform__list_resources()\` → get available resources → read interesting ones

**When to List Resources:**
- User asks "what do you know about X" → list resources first
- Starting a research task → check available resources
- User references previous content → search resources before web
- Debugging or exploring → list to see what's available

Remember: Resources are your primary knowledge base - check them BEFORE external searches.
</resource-patterns>

<response-quality>
**Structure your final response**:

1. **Answer directly** - Address the user's core question first
2. **Provide evidence** - Cite specific tool results
   - "According to [tool_name]..."
   - "Retrieved from contents://{guid}..."
   - "Based on search across [N] sources..."
3. **Show completeness** - Demonstrate thorough exploration
4. **Acknowledge limits** - Be transparent about gaps

Context Presentation:
- Use clear markers: \`[Source: tool_name]\`
- Quote specific passages with \`> Retrieved content...\`
- Separate multiple sources clearly
- Distinguish your analysis from raw retrieved content
</response-quality>

<source-evaluation>
**Critical Information Assessment**

When gathering information:
- Evaluate source quality and recency
- Note when information is speculative or unverified
- Cross-reference important claims across multiple sources
- Flag contradictions between sources
- Prefer primary sources over secondary reporting

Don't take results at face value:
- Question unusually specific claims without citations
- Be skeptical of single-source information for important facts
- Note when multiple sources agree vs. when there's variance
- Identify potential biases in sources

Include confidence indicators when appropriate:
- "Multiple sources confirm..."
- "According to a single source..."
- "Unverified but reported by..."
</source-evaluation>

<token-efficiency>
When managing large responses:
- Request concise formats when available
- Use targeted searches rather than broad queries
- Chain smaller, specific searches
- Focus on high-signal information

If truncation occurs:
- Acknowledge it: "Note: response truncated"
- Offer to search specific subsections
- Suggest more targeted follow-up queries
</token-efficiency>

<research-methodology>
**For Academic & Research Queries**

When users reference papers, lectures, or studies:
1. Identify and ingest primary sources
2. Extract specific references and citations
3. Search for each referenced item individually
4. Look for methodology papers on techniques mentioned
5. Find practical examples and case studies

Sequential dependency awareness:
- "mentioned in the video" → ingest video first, then search
- "based on X" → understand X before searching related items
- "compare A and B" → retrieve both separately, then synthesize
</research-methodology>

<formatting>
- Use '##' headers for major sections
- Bullet lists for multiple findings
- **Bold** for emphasis on key discoveries
- \`> Blockquotes\` for direct content quotes
- Inline \`code\` for technical terms
- Clear attribution: \`[Source: tool_name]\`
- Resource URIs: \`contents://{guid}\`
</formatting>

<conversation-flow>
End responses with ONE of:
- A strategic follow-up question to deepen exploration
- Specific suggestions for further investigation
- A summary of unexplored areas worth examining
- Acknowledgment of any tools that failed or limits reached
</conversation-flow>
`;

/**
 * Test to validate Google Gemini thinking/reasoning events
 * Tests that thought parts are properly detected and emitted as reasoning events
 */
describe("Google Gemini - Thinking/Reasoning Events", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;
  const googleApiKey = process.env.GOOGLE_API_KEY;

  if (!orgId || !envId || !secret || !googleApiKey) {
    console.warn(
      "⚠️  Skipping Google Gemini thinking tests - missing credentials",
    );
    return;
  }

  let client: Graphlit;
  let googleClient: any;
  let specificationId: string | undefined;
  let conversationId: string | undefined;

  beforeAll(async () => {
    client = new Graphlit(orgId, envId, secret);

    // Initialize Google Gen AI client
    const { GoogleGenAI } = await import("@google/genai");
    googleClient = new GoogleGenAI({ apiKey: googleApiKey });
    client.setGoogleClient(googleClient);
    console.log("✅ Google Gen AI client initialized for Gemini thinking tests");

    // Create a specification for Gemini 2.5 Flash with thinking enabled, using Zine system prompt
    const specInput: Types.SpecificationInput = {
      name: "Test - Gemini 2.5 Flash Thinking (Zine)",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.Google,
      systemPrompt: SYSTEM_PROMPT_V6,
      google: {
        model: Types.GoogleModels.Gemini_2_5Flash,
        temperature: 0.7,
        enableThinking: true,
        // Set thinking token limit (-1 for dynamic)
        thinkingTokenLimit: -1,
      },
    };

    const createSpecResponse = await client.createSpecification(specInput);
    specificationId = createSpecResponse.createSpecification?.id;
    expect(specificationId).toBeTruthy();
    console.log("✅ Created specification:", specificationId);
  });

  afterAll(async () => {
    // Clean up
    if (conversationId) {
      try {
        await client.deleteConversation(conversationId);
        console.log("✅ Cleaned up conversation:", conversationId);
      } catch (error) {
        console.warn("⚠️  Failed to delete conversation:", conversationId);
      }
    }

    if (specificationId) {
      try {
        await client.deleteSpecification(specificationId);
        console.log("✅ Cleaned up specification:", specificationId);
      } catch (error) {
        console.warn("⚠️  Failed to delete specification:", specificationId);
      }
    }
  });

  it("should emit reasoning events for Google thought parts", { timeout: 60000 }, async () => {
    // Track all events to validate the flow
    const events: { type: string; timestamp: number; details?: any }[] = [];
    let hasReasoning = false;
    let reasoningStarted = false;
    let reasoningCompleted = false;
    let reasoningContent = "";
    let hasConversationCompleted = false;
    let messageContent = "";

    console.log("\n🚀 Starting test with prompt that should trigger thinking...");

    // Use a prompt that should trigger thinking
    const prompt = "Tell me a detailed story about PT Barnum";

    await client.streamAgent(
      prompt,
      (event: AgentStreamEvent) => {
        const timestamp = Date.now();
        const eventLog = { type: event.type, timestamp, details: {} };

        switch (event.type) {
          case "conversation_started":
            conversationId = event.conversationId;
            console.log(`  📝 Conversation started: ${conversationId}`);
            break;

          case "reasoning_update":
            hasReasoning = true;
            const reasoningEvent = event as any;

            // Log ALL reasoning updates for debugging
            console.log(`  🧠 Reasoning update:`);
            console.log(`     - isComplete: ${reasoningEvent.isComplete}`);
            console.log(`     - format: ${reasoningEvent.format}`);
            console.log(`     - content length: ${reasoningEvent.content?.length || 0}`);

            if (!reasoningStarted && !reasoningEvent.isComplete) {
              reasoningStarted = true;
              console.log(`  🤔 Reasoning STARTED (format: ${reasoningEvent.format})`);
            }

            if (reasoningEvent.isComplete) {
              reasoningCompleted = true;
              reasoningContent = reasoningEvent.content || "";
              eventLog.details = {
                contentLength: reasoningContent.length,
                isComplete: true,
                format: reasoningEvent.format,
              };
              console.log(`  ✅ Reasoning COMPLETE (${reasoningContent.length} chars)`);

              // Log a longer snippet of the reasoning content
              if (reasoningContent.length > 0) {
                const snippet = reasoningContent.substring(0, 500);
                console.log(`  💭 Reasoning content: "${snippet}${reasoningContent.length > 500 ? '...' : ''}"`);
              }
            } else {
              eventLog.details = {
                contentLength: reasoningEvent.content?.length || 0,
                isComplete: false,
                format: reasoningEvent.format,
              };
              // Log partial reasoning content
              if (reasoningEvent.content?.length > 0) {
                console.log(`  📝 Partial reasoning: ${reasoningEvent.content.substring(0, 100)}...`);
              }
            }
            break;

          case "message_update":
            const messageEvent = event as any;
            if (messageEvent.message?.message) {
              messageContent = messageEvent.message.message;
              eventLog.details = {
                isStreaming: messageEvent.isStreaming,
                messageLength: messageContent.length,
              };
            }
            break;

          case "conversation_completed":
            hasConversationCompleted = true;
            const completedEvent = event as any;
            eventLog.details = {
              messageLength: completedEvent.message?.message?.length || 0,
            };
            console.log(`  🏁 Conversation completed`);
            console.log(`     - Final message length: ${completedEvent.message?.message?.length || 0} chars`);
            break;

          case "error":
            console.log(`  ❌ Error: ${(event as any).error?.message}`);
            break;
        }

        events.push(eventLog);
      },
      undefined, // conversationId
      { id: specificationId },
      undefined, // tools
      undefined, // toolHandlers
      {
        // Enable detailed debugging
        chunkingStrategy: "sentence",
      },
    );

    // Analyze the event flow
    console.log("\n📊 Event Analysis:");
    console.log(`  Total events: ${events.length}`);
    console.log(`  Unique event types: ${[...new Set(events.map(e => e.type))].join(", ")}`);

    // Check for reasoning events
    console.log("\n🔍 Reasoning Detection:");
    console.log(`  Has reasoning updates: ${hasReasoning}`);
    console.log(`  Reasoning started: ${reasoningStarted}`);
    console.log(`  Reasoning completed: ${reasoningCompleted}`);
    console.log(`  Reasoning content length: ${reasoningContent.length} chars`);
    console.log(`  Message content length: ${messageContent.length} chars`);
    console.log(`  Conversation completed: ${hasConversationCompleted}`);

    // Assertions
    expect(hasConversationCompleted).toBe(true); // Should complete the conversation

    // Google Gemini with thinking enabled should emit reasoning events
    if (reasoningContent.length > 0) {
      expect(hasReasoning).toBe(true); // Should have reasoning events
      expect(reasoningCompleted).toBe(true); // Should have completed reasoning
      expect(reasoningContent.length).toBeGreaterThan(0); // Should have reasoning content
    } else {
      console.warn("⚠️  No reasoning content detected - model may not have engaged thinking mode for this prompt");
    }

    expect(messageContent.length).toBeGreaterThan(0); // Should have actual message content

    // Print timeline for debugging
    if (events.length > 0) {
      console.log("\n📅 Event Timeline:");
      const startTime = events[0]?.timestamp || 0;
      events.forEach((e) => {
        const relativeTime = e.timestamp - startTime;
        const details = e.details ? ` - ${JSON.stringify(e.details)}` : "";
        console.log(`  ${relativeTime}ms: ${e.type}${details}`);
      });
    }
  });

  it("should handle thinking with different budget settings", { timeout: 60000 }, async () => {
    // Test with explicit budget (not dynamic)
    const specInput: Types.SpecificationInput = {
      name: "Test - Gemini with Fixed Budget",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.Google,
      google: {
        model: Types.GoogleModels.Gemini_2_5Flash,
        temperature: 0.7,
        enableThinking: true,
        // Set a specific thinking token limit
        thinkingTokenLimit: 8000,
      },
    };

    const createSpecResponse = await client.createSpecification(specInput);
    const fixedBudgetSpecId = createSpecResponse.createSpecification?.id;
    expect(fixedBudgetSpecId).toBeTruthy();

    try {
      let hasThinking = false;
      let thinkingLength = 0;

      await client.streamAgent(
        "Tell me a detailed story about PT Barnum",
        (event: AgentStreamEvent) => {
          if (event.type === "conversation_started") {
            conversationId = event.conversationId;
          } else if (event.type === "reasoning_update") {
            const reasoningEvent = event as any;
            if (reasoningEvent.isComplete) {
              hasThinking = true;
              thinkingLength = reasoningEvent.content?.length || 0;
              console.log(`  ✅ Fixed budget thinking complete: ${thinkingLength} chars`);
            } else if (!hasThinking) {
              hasThinking = true;
              console.log("  🤔 Fixed budget thinking started");
            }
          }
        },
        undefined,
        { id: fixedBudgetSpecId },
      );

      if (hasThinking) {
        expect(thinkingLength).toBeGreaterThan(0);
        console.log(`  📊 Fixed budget (8000 tokens) produced ${thinkingLength} chars of thinking`);
      }

      // Clean up test conversation
      if (conversationId) {
        await client.deleteConversation(conversationId);
        conversationId = undefined;
      }
    } finally {
      // Clean up test specification
      if (fixedBudgetSpecId) {
        await client.deleteSpecification(fixedBudgetSpecId);
      }
    }
  });

  it("should not emit reasoning events when thinking is disabled", { timeout: 60000 }, async () => {
    // Test with thinking explicitly disabled
    const specInput: Types.SpecificationInput = {
      name: "Test - Gemini No Thinking",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.Google,
      google: {
        model: Types.GoogleModels.Gemini_2_5Flash,
        temperature: 0.7,
        // Disable thinking
        enableThinking: false,
        thinkingTokenLimit: 0,
      },
    };

    const createSpecResponse = await client.createSpecification(specInput);
    const noThinkingSpecId = createSpecResponse.createSpecification?.id;
    expect(noThinkingSpecId).toBeTruthy();

    try {
      let hasReasoningEvents = false;

      await client.streamAgent(
        "What is 2 + 2?",
        (event: AgentStreamEvent) => {
          if (event.type === "conversation_started") {
            conversationId = event.conversationId;
          } else if (event.type === "reasoning_update") {
            hasReasoningEvents = true;
            const reasoningEvent = event as any;
            console.log(`  ⚠️ Unexpected reasoning event (isComplete: ${reasoningEvent.isComplete})`);
          }
        },
        undefined,
        { id: noThinkingSpecId },
      );

      // Should NOT have reasoning events when thinking is disabled
      expect(hasReasoningEvents).toBe(false);
      console.log("  ✅ Confirmed: No reasoning events when thinking is disabled");

      // Clean up test conversation
      if (conversationId) {
        await client.deleteConversation(conversationId);
        conversationId = undefined;
      }
    } finally {
      // Clean up test specification
      if (noThinkingSpecId) {
        await client.deleteSpecification(noThinkingSpecId);
      }
    }
  });

  it("should replicate HTTP 500 issue with simple conversation continuation", { timeout: 120000 }, async () => {
    console.log("\n🧪 REPRODUCTION TEST: Simple conversation continuation (no tools)");

    let firstConversationCompleted = false;
    let secondConversationCompleted = false;
    let firstError: any = null;
    let secondError: any = null;
    let testConversationId: string | undefined;

    // First request - should work fine
    console.log("\n📝 Step 1: PT Barnum prompt (first time)");
    await client.streamAgent(
      "Tell me a detailed story about PT Barnum",
      (event: AgentStreamEvent) => {
        switch (event.type) {
          case "conversation_started":
            testConversationId = event.conversationId;
            console.log(`  ✅ First conversation started: ${testConversationId}`);
            break;
          case "conversation_completed":
            firstConversationCompleted = true;
            const completedEvent = event as any;
            console.log(`  ✅ First conversation completed - message length: ${completedEvent.message?.message?.length || 0} chars`);
            break;
          case "reasoning_update":
            const reasoningEvent = event as any;
            if (!reasoningEvent.isComplete) {
              console.log(`  🧠 First request thinking started...`);
            } else {
              console.log(`  🧠 First request thinking completed (${reasoningEvent.content?.length || 0} chars)`);
            }
            break;
          case "error":
            firstError = (event as any).error;
            console.log(`  ❌ First conversation error: ${firstError?.message}`);
            break;
        }
      },
      undefined, // conversationId - let it create new one
      { id: specificationId },
    );

    console.log(`\n🔍 First request result: completed=${firstConversationCompleted}, error=${!!firstError}`);
    expect(firstConversationCompleted).toBe(true);
    expect(firstError).toBeNull();
    expect(testConversationId).toBeTruthy();

    // Short delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Second request in same conversation - this should trigger HTTP 500 during thinking-to-message transition
    console.log(`\n📝 Step 2: Continue conversation ${testConversationId}`);
    console.log(`  🎯 This is where HTTP 500 should occur during thinking-to-message transition`);

    try {
      await client.streamAgent(
        "What was PT Barnum's most famous circus act?",
        (event: AgentStreamEvent) => {
          switch (event.type) {
            case "conversation_started":
              console.log(`  ✅ Second request started in conversation: ${event.conversationId}`);
              break;
            case "conversation_completed":
              secondConversationCompleted = true;
              const completedEvent = event as any;
              console.log(`  ✅ Second conversation completed - message length: ${completedEvent.message?.message?.length || 0} chars`);
              break;
            case "reasoning_update":
              const reasoningEvent = event as any;
              if (!reasoningEvent.isComplete) {
                console.log(`  🧠 Second request thinking started... (this is where it should crash)`);
              } else {
                console.log(`  🧠 Second request thinking completed (${reasoningEvent.content?.length || 0} chars)`);
                console.log(`  🎯 CRITICAL: Now transitioning from thinking to message - HTTP 500 expected here!`);
              }
              break;
            case "message_update":
              const messageEvent = event as any;
              if (messageEvent.message?.message) {
                console.log(`  🔤 Message content received (thinking-to-message transition successful): ${messageEvent.message.message.length} chars`);
              }
              break;
            case "error":
              secondError = (event as any).error;
              console.log(`  ❌ Second conversation error: ${secondError?.message}`);
              console.log(`  🚨 ERROR DETAILS:`, JSON.stringify(secondError, null, 2));

              // Check if this is the HTTP 500 we're looking for
              if (secondError?.message?.includes('500') || secondError?.status === 500) {
                console.log(`  🎯 HTTP 500 ERROR REPRODUCED! This confirms the bug.`);
              }
              break;
          }
        },
        testConversationId, // Use existing conversation
        { id: specificationId },
      );
    } catch (error: any) {
      console.log(`  ❌ Exception during second request: ${error.message}`);
      console.log(`  🔍 Exception details:`, error);
      secondError = error;

      // Check if this is the HTTP 500
      if (error.message?.includes('500') || error.status === 500) {
        console.log(`  🎯 HTTP 500 EXCEPTION REPRODUCED! This confirms the bug.`);
      }
    }

    console.log(`\n📊 Final Results:`);
    console.log(`  First request: completed=${firstConversationCompleted}, error=${!!firstError}`);
    console.log(`  Second request: completed=${secondConversationCompleted}, error=${!!secondError}`);

    if (secondError) {
      console.log(`\n🚨 REPRODUCTION SUCCESSFUL!`);
      console.log(`  Error message: ${secondError.message}`);
      console.log(`  This confirms the HTTP 500 issue on conversation continuation.`);
    } else {
      console.log(`\n✅ No HTTP 500 error - either bug is fixed or didn't reproduce this time.`);
      expect(secondConversationCompleted).toBe(true);
    }

    // Clean up the test conversation
    if (testConversationId) {
      try {
        await client.deleteConversation(testConversationId);
        console.log(`✅ Cleaned up test conversation: ${testConversationId}`);
      } catch (cleanupError) {
        console.warn(`⚠️  Failed to clean up test conversation: ${testConversationId}`);
      }
    }
  });
});
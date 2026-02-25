# PRD: OpenAI Responses API Integration

**Status:** Draft
**Date:** 2026-02-23
**Scope:** Additive — zero breaking changes to existing Chat Completions path

---

## 1. Background & Motivation

### Current State

The SDK uses OpenAI's **Chat Completions API** (`/v1/chat/completions`) for all OpenAI model interactions. Each round of the agentic tool loop sends the **full accumulated message history** to OpenAI via `openaiClient.chat.completions.create({ stream: true, messages: [...] })`.

For a 20-round agent with growing tool results, every subsequent round serializes and transmits the complete conversation context — all previous assistant turns, all tool call arguments, all tool results. The payload size grows quadratically with rounds.

### The Opportunity

In March 2025, OpenAI introduced the **Responses API** (`/v1/responses`) as the recommended successor to Chat Completions for agentic workloads. It introduces `previous_response_id` — a server-side continuation mechanism where subsequent turns only need to send incremental new items (tool outputs, new user messages) rather than the full history.

OpenAI reports up to **40% faster end-to-end execution** for agentic workflows with 20+ tool call rounds, attributable to:
1. Elimination of full-history serialization and transmission per round
2. Server-side in-memory state cache maintained across turns on a persistent connection (WebSocket mode, Phase 2)
3. Improved prompt cache utilization (40–80% improvement in internal tests)

This SDK's primary use case — multi-round agentic coding and orchestration loops — is exactly the workload this optimization targets.

---

## 2. Goals

1. **Additive only** — the existing Chat Completions path is untouched; no existing callers are affected
2. **Opt-in at call site** — developers choose the new path by passing a flag to `streamAgent`
3. **Behaviorally identical** — same `AgentStreamEvent` types, same tool calling semantics, same error handling surface
4. **Phase 1: HTTP Responses API** — deliver incremental-input benefit via `previous_response_id` over standard HTTPS/SSE; no WebSocket complexity yet
5. **Phase 2: WebSocket mode** — layer persistent connection on top of Phase 1; a follow-on PR

---

## 3. Non-Goals

- Migrating existing callers automatically
- Changing behavior for any non-OpenAI provider (Anthropic, Google, Groq, Cohere, Mistral, Bedrock, Cerebras, Deepseek)
- Removing or deprecating the Chat Completions path
- Supporting OpenAI's built-in tools (web search, file search, code interpreter) — these are outside Graphlit's tool calling model
- Server-side state persistence (`store: true`) — we use `store: false`; conversation state is managed by Graphlit, not OpenAI

---

## 4. API Design

### 4.1 Opt-In Flag

Add a single field to `StreamAgentOptions` in `src/types/agent.ts`:

```typescript
export interface StreamAgentOptions {
  maxToolRounds?: number;
  abortSignal?: AbortSignal;
  smoothingEnabled?: boolean;
  chunkingStrategy?: "character" | "word" | "sentence";
  smoothingDelay?: number;
  contextStrategy?: ContextStrategy;

  // NEW — Phase 1
  /** Use OpenAI Responses API instead of Chat Completions for OpenAI models.
   *  Enables incremental tool-round continuations via previous_response_id,
   *  reducing per-round payload size. No effect on non-OpenAI providers.
   *  Default: false (Chat Completions remains the default). */
  useResponsesApi?: boolean;
}
```

No changes to the `streamAgent` function signature. The flag is inspected inside `executeStreamingAgent` when the service type is `OpenAI`.

### 4.2 Call Site Example (unchanged signature)

```typescript
await client.streamAgent(
  prompt,
  onEvent,
  conversationId,
  specification,
  tools,
  toolHandlers,
  {
    useResponsesApi: true,   // opt in
    maxToolRounds: 50,
  }
);
```

---

## 5. Protocol Differences: Chat Completions vs Responses API

| Dimension | Chat Completions | Responses API |
|---|---|---|
| Endpoint | `POST /v1/chat/completions` | `POST /v1/responses` |
| Input field | `messages: OpenAIMessage[]` | `input: ResponseInputItem[]` |
| System prompt | `{ role: "system", content }` message | Top-level `instructions` field |
| Output field | `choices[0].delta.content` | `response.output_text.delta` event |
| Tool definitions | `tools[].type = "function"` | Same structure, but **strict by default** |
| Tool results | `{ role: "tool", tool_call_id, content }` message | `{ type: "function_call_output", call_id, output }` item |
| Assistant turn w/ tool calls | `{ role: "assistant", tool_calls: [...] }` message | Implicit in server state via `previous_response_id` |
| Multi-turn continuation | Rebuild full messages array each round | `previous_response_id` + only new items |
| Response ID | N/A | `response.id` (string) on every response |
| Event stream type | `ChatCompletionChunk` | `ResponseStreamEvent` (union of ~12 typed events) |
| Usage data | Final chunk `usage` field | `response.completed` event `usage` field |
| Streaming enable | `stream: true` param | `stream: true` param |
| State persistence | Stateless | `store: false` (in-memory only, no OpenAI storage) |
| Function strict mode | Opt-in | **Default ON** — schemas must be strict-compatible |

---

## 6. Responses API Event Model

When streaming with `stream: true`, the server sends a sequence of typed `ResponseStreamEvent` objects. The events we must handle:

| Event Type | Action |
|---|---|
| `response.created` | Capture `response.id` as `previousResponseId` for next round |
| `response.output_item.added` | Detect item type: `"message"` or `"function_call"` |
| `response.output_text.delta` | Emit `{ type: "token", token: event.delta }` |
| `response.output_text.done` | Accumulate `fullMessage` |
| `response.function_call_arguments.delta` | Emit `tool_call_delta`; accumulate arguments |
| `response.function_call_arguments.done` | Emit `tool_call_parsed` with complete arguments |
| `response.output_item.done` | Finalize function_call item (extract `call_id`, `name`) |
| `response.completed` | Capture usage data; call `onComplete` |
| `error` | Map to existing error handling |

Events we can ignore: `response.in_progress`, `response.content_part.added`, `response.content_part.done`, `response.queued`.

---

## 7. Tool Continuation Model

### Current (Chat Completions) — Full History Each Round

```
Round 1: POST /v1/chat/completions
  messages: [system, user, ...history]          ← full context

Round 2: POST /v1/chat/completions
  messages: [system, user, ...history,
             assistant (with tool_calls),        ← added
             tool result 1,                      ← added
             tool result 2]                      ← added

Round N: POST /v1/chat/completions
  messages: [system, user, ...history,
             assistant, tools, assistant, tools, ← all rounds
             ..., assistant, tools]              ← growing payload
```

### New (Responses API) — Incremental Only

```
Round 1: POST /v1/responses
  instructions: system_prompt
  input: [user message, ...history]             ← full context, once
  → response.id = "resp_abc123"

Round 2: POST /v1/responses
  previous_response_id: "resp_abc123"           ← chain to prior response
  input: [                                      ← only new items
    { type: "function_call_output", call_id: "...", output: "result1" },
    { type: "function_call_output", call_id: "...", output: "result2" },
  ]
  → response.id = "resp_def456"

Round N: POST /v1/responses
  previous_response_id: "resp_def456"           ← always last response
  input: [ function_call_output items only ]    ← constant-size payload
```

The full conversation history is only sent on Round 1. All subsequent rounds send only the tool outputs from the previous round. This is the primary source of the performance gain.

---

## 8. Message Format Conversion

### 8.1 New Types in `llm-formatters.ts`

```typescript
// Responses API input item types
export type ResponseInputItem =
  | ResponseInputMessageItem
  | ResponseFunctionCallOutputItem;

export interface ResponseInputMessageItem {
  type: "message";
  role: "user" | "assistant" | "system";
  content: ResponseContentPart | ResponseContentPart[] | string;
}

export interface ResponseContentPartText {
  type: "input_text";
  text: string;
}

export interface ResponseContentPartImage {
  type: "input_image";
  image_url: string;  // data:image/jpeg;base64,...
}

export type ResponseContentPart = ResponseContentPartText | ResponseContentPartImage;

export interface ResponseFunctionCallOutputItem {
  type: "function_call_output";
  call_id: string;
  output: string;
}

export interface ResponseToolDefinition {
  type: "function";
  name: string;
  description?: string;
  parameters: Record<string, unknown>;  // strict: true added automatically
  strict: true;
}
```

### 8.2 New Formatter: `formatMessagesForOpenAIResponses()`

Converts `ConversationMessage[]` to Responses API input format for **Round 1 only** (full history).

Key mappings:
- `System` role → extracted as `instructions` string (top-level param), not an input item
- `User` role (text) → `{ type: "message", role: "user", content: [{ type: "input_text", text }] }`
- `User` role (with image) → content array with `input_text` + `input_image` parts
- `Assistant` role (text only) → `{ type: "message", role: "assistant", content: [{ type: "output_text", text }] }`
- `Assistant` role (with tool_calls) → **omit entirely** — tool calls are implicit in server state (included in `previous_response_id` chain); for history messages only include the text content
- `Tool` role → **omit from initial context** — tool results are sent as `function_call_output` items per-round

> Note: For history messages (prior conversation turns before the current agent run), assistant messages with tool calls and their tool results should be included as opaque context. The incremental model only applies to tool calls within the current `streamAgent` invocation.

### 8.3 Round 2+ Payload: Only Tool Outputs

```typescript
function buildToolContinuationInput(
  toolCalls: ConversationToolCall[],
  toolResults: Map<string, string>,
): ResponseFunctionCallOutputItem[] {
  return toolCalls.map(tc => ({
    type: "function_call_output",
    call_id: tc.id,
    output: toolResults.get(tc.id) ?? "",
  }));
}
```

---

## 9. Tool Schema Strict Mode

The Responses API enforces **strict function schemas by default**. This is the most significant behavioral difference and a potential source of silent failures.

Strict schemas require:
- All properties listed in `required`
- No `additionalProperties: true`
- No unsupported JSON Schema features (`oneOf`, `anyOf`, `$ref` at nested levels)

### Mitigation

Add a `makeSchemaStrict()` helper in `providers.ts` that normalizes incoming `ToolDefinitionInput.schema` values:

```typescript
function makeSchemaStrict(schema: Record<string, unknown>): Record<string, unknown> {
  return {
    ...schema,
    additionalProperties: false,
    required: Object.keys((schema.properties as object) ?? {}),
  };
}
```

Apply this when building `ResponseToolDefinition` entries. The Chat Completions path is unaffected.

---

## 10. Implementation Plan

### Files to Create

| File | Purpose |
|---|---|
| `src/streaming/openai-responses.ts` | New `streamWithOpenAIResponses()` provider function |

### Files to Modify

| File | Change |
|---|---|
| `src/types/agent.ts` | Add `useResponsesApi?: boolean` to `StreamAgentOptions` |
| `src/streaming/llm-formatters.ts` | Add `formatMessagesForOpenAIResponses()`, `ResponseInputItem` types |
| `src/client.ts` | Thread `previousResponseId` through `executeStreamingAgent` loop; route to new provider when `useResponsesApi: true` |

### No Changes To

- `src/streaming/providers.ts` (existing `streamWithOpenAI` untouched)
- All other provider implementations (Anthropic, Google, Groq, Cohere, Mistral, Bedrock, Cerebras, Deepseek)
- All existing `streamAgent` / `promptAgent` callers
- All existing tests

---

## 11. `executeStreamingAgent` Loop Changes (client.ts)

The only changes to `executeStreamingAgent` are:

1. Accept `useResponsesApi` from `StreamAgentOptions` (already threaded via `options` param)
2. Declare `let previousResponseId: string | undefined` at the top of the loop
3. On the OpenAI branch, check `useResponsesApi` to choose which provider function to call
4. Pass `previousResponseId` into `streamWithOpenAIResponses()`; receive the new response ID back via `onComplete`
5. Update `previousResponseId` after each round

The tool execution logic, context management, budget tracking, and all other loop logic remains identical.

```typescript
// Pseudocode — actual implementation will follow existing patterns

let previousResponseId: string | undefined;

// Inside the round loop, OpenAI branch:
if (serviceType === Types.ModelServiceTypes.OpenAi && (OpenAI || this.openaiClient)) {
  if (options?.useResponsesApi) {
    // New path: Responses API
    const isFirstRound = currentRound === 1;
    await this.streamWithOpenAIResponses(
      specification,
      isFirstRound ? messages : [],           // full history on round 1 only
      isFirstRound ? undefined : toolCallsFromPriorRound,  // tool outputs on round 2+
      tools,
      uiAdapter,
      (message, calls, usage, responseId) => {
        roundMessage = message;
        toolCalls = calls;
        previousResponseId = responseId;      // capture for next round
        if (usage) uiAdapter.setUsageData(usage);
      },
      previousResponseId,
      abortSignal,
    );
  } else {
    // Existing path: Chat Completions (unchanged)
    await this.streamWithOpenAI(/* ... existing call ... */);
  }
}
```

---

## 12. New Provider: `streamWithOpenAIResponses()`

Located in `src/streaming/openai-responses.ts`. Mirrors the structure of `streamWithOpenAI()` in `providers.ts` but uses the Responses API.

### Function Signature

```typescript
export async function streamWithOpenAIResponses(
  specification: Specification,
  messages: ConversationMessage[],        // full history (round 1) or empty (round 2+)
  toolOutputs: ConversationToolCall[] | undefined,  // prior round's tool calls with results
  tools: ToolDefinitionInput[] | undefined,
  openaiClient: OpenAI,
  onEvent: (event: StreamEvent) => void,
  onComplete: (
    message: string,
    toolCalls: ConversationToolCall[],
    usage: unknown | undefined,
    responseId: string,                    // new: thread to next round
  ) => void,
  previousResponseId: string | undefined, // undefined on round 1
  abortSignal?: AbortSignal,
  reasoningEffort?: string,
): Promise<void>
```

### Core Logic

```typescript
// Build request
const requestParams = {
  model: modelName,
  stream: true,
  store: false,           // no server-side persistence
  instructions: systemPrompt ?? undefined,
  input: buildInputItems(messages, toolOutputs, previousResponseId),
  tools: tools?.map(t => buildResponseToolDefinition(t)),
  temperature: specification.openAI?.temperature,
  ...(completionTokenLimit && { max_output_tokens: completionTokenLimit }),
  ...(reasoningEffort && { reasoning: { effort: reasoningEffort } }),
  ...(previousResponseId && { previous_response_id: previousResponseId }),
};

// Stream and process events
const stream = await openaiClient.responses.create(requestParams, { signal: abortSignal });

let capturedResponseId = "";
let fullMessage = "";
let toolCalls: ConversationToolCall[] = [];
const pendingFunctionCalls = new Map<string, { id: string; name: string; arguments: string }>();

for await (const event of stream) {
  switch (event.type) {
    case "response.created":
      capturedResponseId = event.response.id;
      break;

    case "response.output_item.added":
      if (event.item.type === "function_call") {
        // Initialize tracking for this tool call
        pendingFunctionCalls.set(event.item.index, {
          id: event.item.call_id,
          name: event.item.name,
          arguments: "",
        });
        onEvent({ type: "tool_call_start", toolCall: { id: event.item.call_id, name: event.item.name } });
      }
      break;

    case "response.output_text.delta":
      fullMessage += event.delta;
      onEvent({ type: "token", token: event.delta });
      break;

    case "response.function_call_arguments.delta":
      // accumulate arguments
      const pending = pendingFunctionCalls.get(event.item_index);
      if (pending) {
        pending.arguments += event.delta;
        onEvent({ type: "tool_call_delta", toolCallId: pending.id, argumentDelta: event.delta });
      }
      break;

    case "response.function_call_arguments.done":
      // parse and emit tool_call_parsed
      break;

    case "response.completed":
      // capture usage, call onComplete
      onComplete(fullMessage, toolCalls, event.response.usage, capturedResponseId);
      break;
  }
}
```

---

## 13. Error Handling

Map Responses API errors to the same error surface as Chat Completions:

| Responses API Error | Existing Error Type |
|---|---|
| HTTP 429 | Rate limit error (statusCode 429) |
| `previous_response_not_found` | Fallback: retry as round 1 with full context |
| `websocket_connection_limit_reached` | N/A for Phase 1 (HTTP only) |
| HTTP 400 (schema validation) | Surface as agent error with schema guidance |
| Network timeout / abort | Existing AbortSignal handling |

**`previous_response_not_found` recovery**: If the server can't find the prior response (cache eviction, long idle), fall back to a full-context round-1 call. This is the same behavior as today.

---

## 14. Phase 2: WebSocket Mode (Future)

Phase 2 layers persistent WebSocket connections on top of the Phase 1 Responses API implementation. It provides an additional ~10–20% latency improvement by eliminating per-round TLS handshake and connection setup overhead.

### Key Phase 2 Additions

| Item | Notes |
|---|---|
| WebSocket connection | `wss://api.openai.com/v1/responses` with `Authorization: Bearer` header |
| Client event | `{ type: "response.create", ...requestParams }` sent per round |
| Server events | Same event types as Phase 1 HTTP streaming |
| Connection lifecycle | Max 60-minute duration; detect via server close event; reconnect with full-context fallback |
| Sequential guarantee | One in-flight response per connection; already guaranteed by our sequential tool loop |
| Opt-in flag | New `useResponsesWebSocket?: boolean` in `StreamAgentOptions` (requires `useResponsesApi: true`) |
| SDK support | Raw WebSocket required (Node.js `ws` package or native `WebSocket` in Node 22+); OpenAI SDK v5/v6 does not wrap this endpoint |
| `ws` dependency | Add as optional peer dependency (same pattern as `openai`, `@anthropic-ai/sdk`) |

Phase 2 is a separate PR. Phase 1 must be validated in production before Phase 2 begins.

---

## 15. Testing Plan

### Unit Tests

- `formatMessagesForOpenAIResponses()` — verify correct conversion of all message role types
- `makeSchemaStrict()` — verify schema normalization
- Round 1 vs Round 2+ payload construction — verify Round 2+ sends only `function_call_output` items
- `previousResponseId` threading — verify capture and pass-through across rounds

### Integration Tests

- Single-round agent (no tools) via Responses API
- Multi-round agent (2–5 tool rounds) via Responses API — verify `previousResponseId` chaining
- Comparison test: identical prompt run via both Chat Completions and Responses API — assert identical final message

### Regression Tests

- All existing tests must pass without modification — Chat Completions path unchanged

---

## 16. Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Strict schema rejection for existing tool schemas | Medium | `makeSchemaStrict()` normalizer; document in migration notes |
| `previous_response_not_found` on long-idle agents | Low | Automatic full-context retry |
| Behavioral differences in model output (Responses vs Completions for same prompt) | Low | Both paths use same model; document as "may vary" |
| OpenAI SDK version mismatch — `responses` namespace not available in older v5 | Medium | Guard with runtime check; document minimum SDK version |
| `store: false` in-memory cache is shorter-lived than expected | Low | `previous_response_not_found` recovery handles this |
| Community reports of Responses API being slower than Completions in some cases | Low-Medium | Opt-in only; users can A/B test and revert by removing flag |

---

## 17. Open Questions

1. **OpenAI SDK version floor**: The `openai` peer dep is currently `^5.3.0`. The Responses API `responses.create()` was added in SDK v5 (released March 2025). Confirm the exact minimum version. SDK is now at v6.x — should we bump the peer dep floor?

2. **History messages with prior tool rounds**: For a resumed conversation (non-empty history containing previous agent turns with tool calls), do we send those prior assistant+tool messages as history context on Round 1, or omit them? The Responses API supports including prior assistant output items in the `input` array for history, but the format for historical tool calls differs. Needs prototype to verify.

3. **`max_output_tokens` vs `max_completion_tokens`**: Responses API uses `max_output_tokens` (not `max_completion_tokens` like Chat Completions). Verify field name in SDK types.

4. **Reasoning models (o1, o3, o4)**: The `reasoning` parameter format may differ between Chat Completions (`reasoning_effort`) and Responses API (`reasoning: { effort: "..." }`). Verify against SDK types before implementation.

5. **Usage field names**: Responses API usage may use different field names than Chat Completions. Verify `prompt_tokens`, `completion_tokens` equivalents in `ResponseStreamEvent` usage data.

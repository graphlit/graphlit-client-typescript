# PRD: OpenAI Responses API Integration

**Status:** Revised Draft
**Date:** 2026-04-08
**Scope:** Additive; zero breaking changes to the existing OpenAI Chat Completions path
**Companion doc:** `docs/openai-responses-api-impl-plan.md`

---

## 1. Summary

This PRD defines an additive OpenAI Responses API integration for the Graphlit TypeScript SDK.

This implementation will:

- add a new OpenAI Responses streaming path beside the existing `streamWithOpenAI()` path
- name that internal provider `streamWithOpenAIResponses()`
- be opt-in at the `streamAgent()` call site
- be limited to GPT-5.4-family OpenAI models
- preserve Graphlit `Conversation` as the only persistence system
- avoid OpenAI `Conversation` objects entirely
- use `store: false` for all Responses requests
- prioritize full behavioral parity over transport-level optimization

This document supersedes earlier assumptions that the integration should be built around OpenAI-managed state, `previous_response_id`, or strict-schema normalization.

---

## 2. Background & Motivation

### Current state

The SDK uses OpenAI Chat Completions (`/v1/chat/completions`) for OpenAI model interactions. In the agentic streaming loop, each round sends the full accumulated conversation history back to OpenAI.

That produces growing payloads across tool rounds:

- prior assistant messages
- prior tool call arguments
- prior tool results
- current prompt/context

This works today and must remain fully intact for existing callers.

### Why Responses API

OpenAI now recommends the Responses API (`/v1/responses`) for modern reasoning and agentic workflows. The docs also make clear that reasoning models, especially GPT-5.4-class models, perform better with Responses than with Chat Completions.

Relevant benefits from the latest docs:

- better reasoning/tool-use behavior on newer models
- richer item-based response structure for tools
- better long-running workflow support
- forward-looking API surface for modern OpenAI models

However, Graphlit already has its own conversation persistence model, so we must adopt Responses in a way that does not create a second durable conversation system.

---

## 3. Product Decision

The product decision is:

- Graphlit remains the sole persistence layer
- OpenAI Responses runs in stateless mode from Graphlit’s point of view
- no OpenAI `Conversation` objects are created
- no OpenAI-side cleanup lifecycle is required
- no behavior changes occur unless the caller explicitly opts in

This means the implementation is **parity-first**, not **maximum-optimization-first**.

---

## 4. Goals

1. **Additive only**
   The existing Chat Completions path remains unchanged and remains the default.

2. **Opt-in at call site**
   Developers choose the Responses path by passing a flag to `streamAgent()`.

3. **Zero impact on current SDK behavior by default**
   Existing OpenAI callers continue using the current provider unless explicitly opted in.

4. **Full parity with the current OpenAI streaming experience**
   The new path must preserve:
   - token streaming
   - tool call streaming events
   - tool execution loop behavior
   - conversation history updates
   - usage reporting
   - error handling surface
   - cancellation behavior

5. **Graphlit-owned persistence only**
   The SDK must not introduce OpenAI-managed durable conversation state.

6. **Scoped model support**
   Support GPT-5.4-family OpenAI models only in this implementation.

---

## 5. Non-Goals

- Migrating existing callers automatically
- Changing behavior for non-OpenAI providers
- Removing or deprecating the existing OpenAI Chat Completions path
- Supporting older OpenAI models
- Using the OpenAI Conversations API
- Synchronizing Graphlit conversations with OpenAI conversations
- Relying on OpenAI-side cleanup or deletion
- Using OpenAI built-in tools such as web search, file search, code interpreter, or computer use
- Implementing Responses WebSocket transport
- Migrating Graphlit tools to strict JSON schema behavior

---

## 6. Scope

### Included

- new `useResponsesApi?: boolean` option on `StreamAgentOptions`
- new GPT-5.4-family routing gate for OpenAI Responses
- new Responses formatter/types/provider
- stateless Responses requests using `store: false`
- local, per-invocation continuation state inside `streamAgent()`
- full parity with the current Graphlit tool loop

### Excluded

- `previous_response_id` as a required continuation primitive
- OpenAI Conversations API integration
- stateful OpenAI persistence
- strict-schema migration
- WebSocket transport

---

## 7. Supported Models

This implementation supports the GPT-5.4 family currently present in the repo’s OpenAI model mapping:

- `gpt-5.4`
- `gpt-5.4-2026-03-05`
- `gpt-5.4-mini`
- `gpt-5.4-mini-2026-03-17`
- `gpt-5.4-nano`
- `gpt-5.4-nano-2026-03-17`

This narrow scope is intentional.

The user explicitly wants to start with GPT-5.4 and forward, and does not care about supporting anything prior. That gives us a crisp routing boundary for this implementation.

---

## 8. API Design

### 8.1 Opt-in flag

Add one field to `StreamAgentOptions`:

```typescript
export interface StreamAgentOptions {
  maxToolRounds?: number;
  abortSignal?: AbortSignal;
  smoothingEnabled?: boolean;
  chunkingStrategy?: "character" | "word" | "sentence";
  smoothingDelay?: number;
  contextStrategy?: ContextStrategy;

  /** Use OpenAI Responses API instead of Chat Completions for eligible OpenAI models.
   *  Limited to GPT-5.4-family models. No effect on non-OpenAI providers.
   *  Default: false. */
  useResponsesApi?: boolean;
}
```

No changes to the `streamAgent()` signature.

### 8.2 Routing rule

The Responses path is used only when all of the following are true:

1. `serviceType === OpenAi`
2. `options.useResponsesApi === true`
3. the resolved model is in the GPT-5.4-family allowlist

If any condition fails, the SDK uses the existing `streamWithOpenAI()` path.

The implementation will require a Responses-capable OpenAI 5.x SDK baseline and will not include runtime feature-probe fallback logic for older OpenAI SDK installations.

---

## 9. Persistence Model

### 9.1 Source of truth

Graphlit `Conversation` remains the sole persistent source of truth.

### 9.2 OpenAI-side persistence

The SDK will not create or manage OpenAI `Conversation` objects.

All Responses requests will set:

```typescript
store: false
```

### 9.3 Why this matters

Using OpenAI Conversations would create a second lifecycle to synchronize:

- create
- append
- delete
- recover after partial failure

That is a poor fit for Graphlit’s architecture. If a process dies mid-run, Graphlit can still recover its own conversation state. It should not also be responsible for best-effort OpenAI-side garbage collection.

Therefore this implementation is explicitly designed to avoid any OpenAI-managed durable conversation state.

---

## 10. Protocol Differences: Chat Completions vs Responses

| Dimension | Chat Completions | Responses in Graphlit |
|---|---|---|
| Endpoint | `POST /v1/chat/completions` | `POST /v1/responses` |
| System prompt | system message | top-level `instructions` |
| Main input | `messages` | `input` items |
| Streaming text | `choices[0].delta.content` | `response.output_text.delta` |
| Tool outputs | tool-role message | `function_call_output` item |
| Persistence | caller-managed only | Graphlit-managed only; `store: false` |
| OpenAI Conversations API | not used | not used |
| Function strictness | non-strict by default | explicitly `strict: false` for parity |

Important nuance:

OpenAI Responses supports both stateful and stateless patterns. Graphlit will intentionally use the stateless pattern from Graphlit’s perspective.

---

## 11. Continuation Model

### 11.1 Existing Chat Completions loop

Today, each tool round rebuilds the full message array.

### 11.2 Responses continuation model

Within a single `streamAgent()` invocation, the SDK will maintain local Responses state in memory and pass prior Responses output items forward manually.

This means:

- Round 1 sends the initial Graphlit conversation as Responses input
- On completion, the provider captures the response `output` items
- If the model calls tools, Graphlit executes them exactly as today
- Round 2+ sends:
  - the original input context
  - the accumulated prior Responses output items
  - the new `function_call_output` items for the tool results

This follows the stateless/manual chaining pattern documented by OpenAI and avoids introducing OpenAI-managed conversation state.

### 11.3 Why this implementation does not depend on `previous_response_id`

Earlier drafts assumed `previous_response_id` would be the primary continuation primitive. We are deliberately not doing that here.

Reasons:

- it pulls the design toward OpenAI-managed state semantics
- it complicates failure recovery analysis
- it is not required for correctness
- parity and architectural safety matter more than transport optimization

---

## 12. Message Formatting

### 12.1 Initial round formatting

We will add Responses-specific formatting helpers in `llm-formatters.ts`.

Core mappings:

- Graphlit system message -> `instructions`
- user text message -> Responses input message item
- user image message -> Responses input message item with text/image parts
- assistant history -> Responses input message item
- tool history -> included via manual output-item continuation rules as needed for the current invocation

### 12.2 Multimodal behavior

The Responses formatter must preserve current OpenAI multimodal behavior for image-capable user messages.

### 12.3 Local continuation state

The provider/client boundary must preserve enough raw Responses output data to construct subsequent rounds without changing the rest of the Graphlit tool loop.

---

## 13. Tool Calling Behavior

### 13.1 Parity requirement

Tool calling must feel identical to the current OpenAI path from the perspective of:

- UI events
- tool handlers
- Graphlit message persistence
- tool execution ordering and retries

### 13.2 Tool schema decision

OpenAI docs now say Responses defaults toward strict mode. That would silently change the semantics of Graphlit’s existing tool schemas.

To preserve parity, this implementation will send custom function tools with:

```typescript
strict: false
```

This is a deliberate deviation from earlier drafts.

### 13.3 Why `strict: false`

Without this, Responses may:

- mark optional fields as required
- reject schemas that currently work in Chat Completions
- change tool-call behavior in subtle ways

---

## 14. Event Model

The Responses provider must map the streaming event model back to Graphlit’s current internal `StreamEvent` surface.

Minimum event handling:

- `response.output_text.delta`
- `response.output_item.added`
- `response.output_item.done`
- `response.function_call_arguments.delta`
- `response.function_call_arguments.done`
- `response.completed`
- `error`

Mapping requirements:

- text deltas -> `token`
- initial tool call detection -> `tool_call_start`
- partial tool arguments -> `tool_call_delta`
- completed tool arguments -> `tool_call_parsed`
- end of stream -> `complete`

The UI adapter and downstream tool loop should not need to know whether the upstream provider was Chat Completions or Responses.

---

## 15. Implementation Approach

### 15.1 Files to create

- `src/streaming/openai-responses.ts`

This file will export `streamWithOpenAIResponses()`.

### 15.2 Files to modify

- `src/types/agent.ts`
- `src/model-mapping.ts`
- `src/streaming/llm-formatters.ts`
- `src/client.ts`

### 15.3 Files to leave untouched if possible

- `src/streaming/providers.ts`

The preferred architecture is side-by-side, not invasive refactoring.

---

## 16. `executeStreamingAgent()` Changes

The intended changes are narrow:

1. read `useResponsesApi` from `StreamAgentOptions`
2. determine whether the current OpenAI model is Responses-eligible
3. if eligible and opted in, route to the new Responses provider
4. maintain local Responses continuation state for the life of the current invocation
5. leave the downstream assistant-message persistence and tool execution loop unchanged

This is a key product requirement: Responses-specific logic should stay isolated to routing, request construction, and stream parsing.

---

## 17. Error Handling

The new provider must map errors back to the same provider-level error model already used by the current OpenAI path.

Required behavior:

- 429 -> retryable rate-limit error
- transient network failures -> retryable
- 5xx -> retryable
- invalid model/schema/request -> surfaced clearly as OpenAI errors

Because this implementation does not depend on `previous_response_id`, we avoid introducing server-cache-miss recovery behavior.

---

## 18. Testing Strategy

### Unit tests

- GPT-5.4-family eligibility helper
- opt-in routing behavior
- formatter behavior for system/user/assistant/image messages
- tool definition construction with `strict: false`
- manual continuation input construction across rounds
- usage normalization

### Streaming/provider tests

- token emission from Responses stream
- tool call start/delta/parsed event mapping
- completion callback behavior
- error normalization

### Integration-style tests

- single-round GPT-5.4 Responses invocation
- multi-round GPT-5.4 Responses invocation with tool calls
- Graphlit message persistence parity
- retry/cancellation parity

### Regression expectation

All existing tests must continue to pass unchanged. The old OpenAI path remains intact and remains the default.

---

## 19. Risks & Tradeoffs

| Risk | Likelihood | Mitigation |
|---|---|---|
| Losing some payload-size optimization by not centering the design on `previous_response_id` | Medium | Accept as part of the current design |
| Responses strict-mode defaults breaking existing tools | High if unhandled | Explicitly set `strict: false` |
| Unsupported external OpenAI SDK install | Low-Medium | Raise the supported OpenAI SDK floor and document no runtime fallback |
| Model behavior differences between Chat Completions and Responses | Medium | Keep the path opt-in and limited to the GPT-5.4 family |
| Accidental regression to existing OpenAI callers | Low-Medium | Side-by-side provider architecture and routing gate |

Main product tradeoff:

We are intentionally trading some possible performance upside for:

- architectural clarity
- simpler failure recovery
- no second persistence system
- lower regression risk

---

## 20. Acceptance Criteria

This PRD is satisfied when:

- an opt-in Responses path exists beside the current OpenAI path
- supported OpenAI models are limited to the GPT-5.4 family
- Graphlit remains the only persistent conversation system
- the implementation does not create OpenAI Conversations
- Responses requests run with `store: false`
- tool schemas are sent with `strict: false` for parity
- the Graphlit streaming/tool loop behaves the same from the caller’s perspective
- existing callers are unaffected unless they explicitly opt in

---

## 21. Source Notes

This revised PRD reflects the latest OpenAI documentation reviewed on 2026-04-08, especially:

- Responses migration guide
- reasoning guide
- conversation state guide
- function calling strict-mode guide

The detailed implementation decisions and review checklist live in:

- `docs/openai-responses-api-impl-plan.md`

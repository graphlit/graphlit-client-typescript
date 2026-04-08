# IMPL Plan: OpenAI Responses API for GPT-5.4+ Streaming

**Status:** Proposed for review  
**Date:** 2026-04-08  
**Scope:** Design-only; no production code changes yet  
**Related doc:** `docs/openai-responses-api-prd.md`

---

## 1. Executive Summary

This document proposes an additive OpenAI Responses API implementation for the Graphlit TypeScript SDK that:

- lives side-by-side with the existing `streamWithOpenAI()` path
- is limited to GPT-5.4-family OpenAI models
- has zero impact on the existing SDK behavior unless explicitly opted into
- keeps Graphlit `Conversation` as the only persistence system
- does **not** create or synchronize OpenAI `Conversation` objects
- does **not** rely on OpenAI-side persisted response chains
- prioritizes behavioral parity over transport-level optimization

The implementation will be review-driven and parity-first. We will introduce the new path behind an explicit flag and only for eligible GPT-5.4-family models. Older OpenAI models, non-OpenAI providers, and all current callers will continue to use the existing code path unchanged.

---

## 2. Key Decisions

### 2.1 Graphlit remains the sole persistence layer

Graphlit already has a `Conversation` object and associated persistence semantics. We will keep that as the single source of truth.

We will **not**:

- create OpenAI `Conversation` objects
- attempt to mirror Graphlit conversation lifecycle into OpenAI
- depend on OpenAI-side cleanup or deletion for correctness

### 2.2 OpenAI Responses will run in stateless mode

All Responses API requests in this implementation will set:

- `store: false`

This avoids creating a second durable state system inside OpenAI and avoids the cleanup/synchronization problem entirely.

### 2.3 No OpenAI Conversations API

The latest OpenAI docs make clear that the Responses API can be used without the Conversations API. The Conversations API is optional and intended for OpenAI-managed persistence. That does not fit Graphlit’s architecture.

### 2.4 No `previous_response_id` dependency for correctness

The original PRD centered on `previous_response_id` as the primary continuation mechanism. After reviewing the latest docs and the Graphlit persistence model, this implementation should **not** depend on `previous_response_id` for correctness.

Instead, this implementation will use local, Graphlit-managed state for continuation between rounds within a single `streamAgent()` invocation by explicitly carrying forward the required Responses `output` items and function outputs.

Rationale:

- avoids OpenAI-side lifecycle management concerns
- keeps failure handling local and deterministic
- makes the Graphlit conversation model authoritative
- reduces architectural risk

### 2.5 Strict mode will be disabled for parity

This is a deliberate change from the PRD.

The latest OpenAI docs say:

- Responses requests normalize function schemas into strict mode by default
- Chat Completions remains non-strict by default
- to keep non-strict best-effort function calling in Responses, set `strict: false`

For full parity with the current SDK, this implementation will send custom function tools with:

- `strict: false`

Rationale:

- avoids silently changing tool-schema semantics
- avoids making previously optional fields required
- avoids schema breakage for existing Graphlit tool definitions

### 2.6 Side-by-side provider architecture

The new implementation will be added beside the current provider instead of refactoring the current OpenAI path.

That means:

- `streamWithOpenAI()` stays intact
- `streamWithAnthropic()` stays intact
- the new Responses path gets its own formatter/types/provider file(s)
- routing happens in `executeStreamingAgent()` based on explicit gating

This keeps regression risk low and makes review easier.

### 2.7 Locked naming and SDK baseline

The internal provider introduced for this work will be named:

- `streamWithOpenAIResponses()`

The public opt-in flag remains:

- `useResponsesApi`

The implementation will require a Responses-capable OpenAI 5.x SDK baseline. We will not add runtime feature-probe logic or silent compatibility fallbacks for older OpenAI SDK installations.

---

## 3. Confirmed External Facts From Latest OpenAI Docs

These points are driving the design:

1. The Responses API does **not** require the Conversations API.
2. Responses are stored by default, but `store: false` disables storage.
3. Responses can be chained either by:
   - passing prior `output` items back manually, or
   - passing `previous_response_id`
4. For stateless reasoning workflows, OpenAI recommends:
   - `store: false`
   - `include: ["reasoning.encrypted_content"]`
5. Reasoning models work better with Responses than Chat Completions.
6. Starting with GPT-5.4, tool calling is not supported in Chat Completions with `reasoning: none`.
7. Responses defaults function calling toward strict mode unless `strict: false` is set.

Primary references:

- https://developers.openai.com/api/docs/guides/migrate-to-responses
- https://developers.openai.com/api/docs/guides/reasoning
- https://developers.openai.com/api/docs/guides/conversation-state
- https://developers.openai.com/api/docs/guides/function-calling#strict-mode

---

## 4. Goals For This Implementation

### 4.1 Must-have goals

- Zero impact on existing SDK behavior by default
- Full parity with the current OpenAI streaming/tool loop from the caller’s perspective
- Explicit opt-in at the `streamAgent()` call site
- Restrict supported OpenAI models to the GPT-5.4 family
- Keep Graphlit as the only persistent conversation system
- Preserve current event surface and tool execution loop semantics

### 4.2 Out of scope

- OpenAI Conversations API integration
- OpenAI-side conversation cleanup logic
- `previous_response_id` as a required continuation primitive
- WebSocket Responses transport
- Built-in OpenAI tools
- strict-schema migration or schema hardening
- support beyond the GPT-5.4 family

---

## 5. Supported Models and Routing Rules

### 5.1 Supported model set

This implementation will support the current GPT-5.4 family represented in `src/model-mapping.ts`:

- `gpt-5.4`
- `gpt-5.4-2026-03-05`
- `gpt-5.4-mini`
- `gpt-5.4-mini-2026-03-17`
- `gpt-5.4-nano`
- `gpt-5.4-nano-2026-03-17`

### 5.2 Routing gate

The Responses path will only be used when **all** of the following are true:

1. `serviceType === OpenAi`
2. `options.useResponsesApi === true`
3. the resolved model is in the GPT-5.4-family allowlist

If any of those conditions fail, the SDK will use the existing `streamWithOpenAI()` path.

### 5.3 Why the gate is intentionally narrow

The user asked to start at GPT-5.4 and newer, and explicitly does not care about anything earlier. The repo’s current enum catalog already gives us a precise, safe GPT-5.4-family boundary. We should take advantage of that and not guess about older or mixed-support models in this implementation.

---

## 6. Parity Requirements

The new path must preserve the externally visible behavior of the current OpenAI path in these areas:

- token streaming
- tool call start/delta/parsed events
- tool execution start/complete events
- conversation history updates
- context management behavior
- usage reporting
- retry behavior for retryable provider failures
- abort handling
- error surface shape
- message/image formatting support already expected by callers

The parity bar is **behavioral parity**, not byte-for-byte API equivalence.

What may differ internally:

- transport endpoint
- request payload shape
- event parsing logic
- usage field mapping source

---

## 7. Proposed Architecture

### 7.1 Files to add

- `docs/openai-responses-api-impl-plan.md`
- `src/streaming/openai-responses.ts`
- `test/openai-responses-routing.test.ts`
- `test/openai-responses-formatters.test.ts`
- `test/openai-responses-streaming.test.ts`

### 7.2 Files to modify

- `src/types/agent.ts`
- `src/model-mapping.ts`
- `src/streaming/llm-formatters.ts`
- `src/client.ts`

### 7.3 Files to leave untouched if possible

- `src/streaming/providers.ts`

Goal: avoid modifying the existing OpenAI streaming provider unless there is a compelling reason. Duplication is acceptable here if it lowers regression risk.

---

## 8. Detailed Design

### 8.1 New option in `StreamAgentOptions`

Add:

```ts
useResponsesApi?: boolean;
```

Semantics:

- `false` or `undefined`: current behavior
- `true`: attempt GPT-5.4-family Responses path when eligible; otherwise fall back to current OpenAI path

### 8.2 New routing helper in `src/model-mapping.ts`

Add a helper that answers:

- is this specification eligible for OpenAI Responses?

Recommended helper names:

- `isOpenAIResponsesEligibleModel(specification)`
- or `shouldUseOpenAIResponsesModel(specification)`

The helper should use the same canonical model resolution logic as `getModelName()` so routing is consistent and reviewable.

### 8.3 New Responses types and formatters in `src/streaming/llm-formatters.ts`

Add separate types for Responses input construction:

- `ResponseInputItem`
- `ResponseMessageItem`
- `ResponseContentPart`
- `ResponseFunctionCallOutputItem`
- `ResponseToolDefinition`

Add formatter helpers:

- `formatMessagesForOpenAIResponsesInitialRound(messages)`
- `buildResponsesFunctionCallOutputItems(toolMessages)`
- `extractInstructionsForOpenAIResponses(messages)`

Important design rule:

- system content becomes top-level `instructions`
- non-system conversation history is converted into Responses `input` items
- multimodal image handling must preserve current OpenAI image behavior

### 8.4 New provider in `src/streaming/openai-responses.ts`

Create a separate provider:

- `streamWithOpenAIResponses()`

This provider will:

- build a Responses request from Graphlit messages and local per-invocation state
- stream typed Responses events
- emit the same internal `StreamEvent` shapes used by the current UI adapter
- return:
  - final assistant text
  - parsed tool calls
  - normalized usage
  - raw `output` items required for subsequent continuation inside the same invocation

### 8.5 No OpenAI Conversations API usage

The provider must not:

- create conversations in OpenAI
- attach responses to conversations
- retrieve/delete conversations

### 8.6 Stateless per-invocation continuation model

Within a single `streamAgent()` invocation, the client will maintain a local Responses state object.

Recommended local state:

```ts
type OpenAIResponsesInvocationState = {
  initialInput: ResponseInputItem[];
  accumulatedOutputItems: unknown[];
};
```

Round behavior:

#### Round 1

Request:

- `model`
- `instructions`
- `input: initialInput`
- `tools`
- `stream: true`
- `store: false`
- `include: ["reasoning.encrypted_content"]`
- `reasoning` when applicable
- `max_output_tokens` when applicable

On completion:

- capture assistant text
- capture tool calls
- capture full `response.output`
- append `response.output` to `accumulatedOutputItems`

#### Round 2+

If tool calls were executed in the previous round:

- create `function_call_output` items from actual tool results
- build the next request input as:
  - `initialInput`
  - prior `accumulatedOutputItems`
  - new `function_call_output` items

On each subsequent completion:

- append the new `response.output` items to `accumulatedOutputItems`

This follows the manual stateless chaining pattern from the current docs and avoids OpenAI-managed conversation state.

### 8.7 Why this implementation will not use `previous_response_id`

We are intentionally not making `previous_response_id` a core design dependency.

Reasons:

- the user explicitly does not want a second persistence system to manage
- `store: false` aligns better with Graphlit’s architecture
- manual chaining keeps the state local and reviewable
- parity and correctness matter more than transport optimization

---

## 9. Request Construction Details

### 9.1 Top-level request fields

The Responses request will use:

- `model`
- `instructions`
- `input`
- `tools`
- `stream: true`
- `store: false`
- `include: ["reasoning.encrypted_content"]`

Optional fields:

- `temperature`
- `max_output_tokens`
- `reasoning: { effort: ... }`

### 9.2 Tool definition shape

For parity, custom tools will be emitted with:

- `type: "function"`
- `name`
- `description`
- `parameters`
- `strict: false`

This is a deliberate parity choice.

### 9.3 Reasoning settings

The current OpenAI path reads `specification.openAI?.reasoningEffort`.

The Responses path should map this to:

```ts
reasoning: { effort: "<mapped value>" }
```

We will not request reasoning summaries because:

- the current OpenAI path does not expose reasoning UI
- summaries are not needed for parity
- this keeps the implementation focused on parity

### 9.4 Usage normalization

Responses usage fields differ from Chat Completions.

The provider will normalize:

- `input_tokens -> promptTokens`
- `output_tokens -> completionTokens`
- `total_tokens -> totalTokens`

If present, reasoning-token details may be captured for debug logging only, not for the public API surface.

---

## 10. Streaming Event Mapping

### 10.1 Event types to handle

The provider should handle at least:

- `response.output_text.delta`
- `response.output_item.added`
- `response.output_item.done`
- `response.function_call_arguments.delta`
- `response.function_call_arguments.done`
- `response.completed`
- `error`

### 10.2 Event mapping to current internal `StreamEvent`

Map as follows:

- text deltas -> `token`
- function call first detection -> `tool_call_start`
- function argument deltas -> `tool_call_delta`
- function arguments done -> `tool_call_parsed`
- response end -> `complete`

### 10.3 Provider output contract

`streamWithOpenAIResponses()` should return enough data to keep the rest of `executeStreamingAgent()` unchanged except for routing and local Responses state tracking.

Recommended completion callback contract:

```ts
onComplete(
  message,
  toolCalls,
  usage,
  continuationItems,
)
```

Where `continuationItems` is the raw `response.output` array or a normalized equivalent safe to pass into the next round’s input builder.

---

## 11. `client.ts` Changes

### 11.1 New local state in `executeStreamingAgent()`

Add a local variable near the top of the loop setup:

```ts
let openAIResponsesState:
  | {
      initialInput: ResponseInputItem[];
      accumulatedOutputItems: unknown[];
    }
  | undefined;
```

This state exists only for the lifetime of the current `streamAgent()` invocation.

### 11.2 Routing branch

In the OpenAI service branch:

- if `useResponsesApi` and model eligible -> call `streamWithOpenAIResponses()`
- else -> call current `streamWithOpenAI()`

### 11.3 Preserve existing downstream tool loop

After the provider returns:

- `roundMessage`
- `toolCalls`

the existing logic that:

- pushes assistant messages
- executes tool handlers
- pushes tool result messages
- updates Graphlit conversation history

should remain the same.

This is critical. We want the Responses-specific logic isolated to request/stream handling and per-invocation continuation state, not to the tool execution loop itself.

### 11.4 SDK baseline expectation

The implementation will raise the supported OpenAI SDK floor for the Responses path and update the package metadata accordingly.

This means:

- no runtime `responses.create` probe
- no silent fallback for older OpenAI SDK installations
- one supported integration contract for the new path

---

## 12. Error Handling Strategy

The new provider must normalize errors back into the same `ProviderError` patterns already used for OpenAI:

- 429 -> retryable rate-limit error
- network/transient -> retryable
- 5xx -> retryable
- 4xx invalid request/schema/model errors -> non-retryable unless explicitly known transient

Additional Responses-specific considerations:

- invalid schema due to tool config should surface clearly as an OpenAI provider error
- unsupported model/parameter combinations should surface clearly
- because this implementation does not depend on `previous_response_id`, we avoid a whole class of server-state cache miss handling

---

## 13. Testing Plan

### 13.1 Unit tests

Add tests for:

- GPT-5.4-family routing eligibility
- non-eligible models staying on current `streamWithOpenAI()` path
- system prompt extraction into `instructions`
- message conversion for text-only and image-capable user messages
- function tool definition construction with `strict: false`
- round-2+ input construction from:
  - initial input
  - accumulated output items
  - new `function_call_output` items
- usage normalization from Responses usage shape to existing `UsageInfo`

### 13.2 Streaming/provider tests

Mock a Responses event stream and verify:

- token events are emitted in order
- tool_call_start is emitted once per call
- tool_call_delta accumulates arguments correctly
- tool_call_parsed emits final argument JSON
- completion callback receives final text, tool calls, usage, and continuation items

### 13.3 Integration-style tests

Add at least one GPT-5.4-specific test file that validates:

- opt-in Responses routing
- multi-round tool loop behavior
- Graphlit messages continue to be persisted exactly as before
- tool failure and retry behavior still works through the existing loop

### 13.4 Regression expectations

Existing tests must continue to pass unchanged, especially:

- streaming cancellation
- context management
- multi-provider duplication/regression tests
- GPT-5.2 tests
- Anthropic and Google streaming tests

---

## 14. Review Checklist

Reviewers should explicitly confirm the following before code starts:

- We agree Graphlit should remain the only persistent conversation system
- We agree this implementation should not use OpenAI Conversations API
- We agree this implementation should run with `store: false`
- We agree this implementation should use manual stateless chaining instead of relying on `previous_response_id`
- We agree parity is more important than optimization
- We agree custom function tools should use `strict: false`
- We agree supported OpenAI models should be limited to the GPT-5.4 family
- We agree the existing `streamWithOpenAI()` provider should remain intact

---

## 15. Risks and Tradeoffs

### 15.1 Main tradeoff

By choosing stateless manual chaining, we likely give up some of the largest payload-size savings that `previous_response_id` could provide.

This is intentional.

We are trading:

- less transport optimization

for:

- lower architectural risk
- no second persistence system
- easier reasoning about cleanup
- easier rollback
- better parity control

### 15.2 Schema compatibility risk

Responses defaults toward strict tool semantics. If we forget to set `strict: false`, parity will break quickly for existing tools.

This must be covered by tests.

### 15.3 SDK baseline change

The repo will move to a Responses-capable OpenAI 5.x SDK baseline for this work. That is a deliberate compatibility contract, not a deferred design question.

### 15.4 Model-behavior differences

Even with equivalent prompts, GPT-5.4 on Responses may behave differently from Chat Completions. That is acceptable as long as:

- event/tool loop parity is preserved
- SDK behavior is stable
- the path remains opt-in

---

## 16. Delivery Scope

This implementation plan covers one review-approved implementation:

- add option flag
- add eligibility helper
- add Responses formatter/types
- add new side-by-side provider
- add client routing
- add tests
- no OpenAI Conversations API
- no `previous_response_id`
- `store: false`
- `strict: false`

Anything not listed above is out of scope for this implementation.

---

## 17. Acceptance Criteria

This design is ready for code implementation when reviewers agree that:

- the persistence model is correct
- the routing model is correct
- the parity strategy is correct
- the narrow initial model scope is acceptable
- the `strict: false` parity decision is acceptable

Once approved, code implementation should follow this document, not the earlier PRD where the two conflict.

---

## 18. Source Links

- PRD: `docs/openai-responses-api-prd.md`
- Migrate to Responses: https://developers.openai.com/api/docs/guides/migrate-to-responses
- Reasoning models: https://developers.openai.com/api/docs/guides/reasoning
- Conversation state: https://developers.openai.com/api/docs/guides/conversation-state
- Function calling strict mode: https://developers.openai.com/api/docs/guides/function-calling#strict-mode
- GPT-5.4 pro model page: https://developers.openai.com/api/docs/models/gpt-5.4-pro

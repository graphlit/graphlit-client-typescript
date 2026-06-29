# IMPL Plan: Google Gemini Tool JSON Schema Parameters

**Status:** Proposed for review  
**Date:** 2026-06-28  
**Scope:** Google/Gemini provider serialization only  
**Related bug report:** `/home/kirk/projects/zine/docs/BUG-gemini-tool-schema-const-discriminator.md`

---

## 1. Executive Summary

Gemini rejects the current `analyze_prompt` tool declaration before model execution because the SDK sends full JSON Schema through Google's typed `FunctionDeclaration.parameters` field.

The failing schema includes JSON Schema constructs emitted by Zod discriminated unions:

- `const`
- `discriminator`
- nested `oneOf`

Those fields are valid in Zine's source schema and useful to providers that accept richer JSON Schema. The likely bug is not the source schema. It is that the Graphlit TypeScript SDK is placing raw JSON Schema into the wrong Google function-declaration field.

The first implementation should switch Google tool declarations from:

```ts
parameters: schema
```

to:

```ts
parametersJsonSchema: schema
```

This is Google-only and should not affect OpenAI, Anthropic, other providers, Graphlit API persistence, or Zine runtime validation.

---

## 2. Why `parametersJsonSchema` First

Google's current `@google/genai` `FunctionDeclaration` supports two mutually exclusive parameter fields:

- `parameters?: Schema`
- `parametersJsonSchema?: unknown`

`parameters` is still valid. It is not an old or deprecated field. It is the typed Google `Schema` path.

`parametersJsonSchema` is the raw JSON Schema path. It is the better fit for Graphlit tool definitions because `ToolDefinitionInput.schema` is already serialized JSON Schema.

Evidence from the installed SDK:

- The type definition documents both fields as mutually exclusive.
- The SDK's MCP adapter maps MCP `inputSchema` to `parametersJsonSchema`.
- The SDK transformer moves `parameters` to `parametersJsonSchema` when a schema has a `$schema` marker.

External references:

- https://googleapis.github.io/js-genai/release_docs/interfaces/types.FunctionDeclaration.html
- https://github.com/googleapis/js-genai

---

## 3. Current Failure Path

### 3.1 Zine schema source

Zine's source schema is:

- `/home/kirk/projects/zine/src/lib/mcp/prompt-analysis/schema.ts`

The important fields are:

- `finalResponse`: `z.discriminatedUnion("mode", [...])`
- `workItems`: `z.array(z.discriminatedUnion("kind", [...]))`

Those compile to valid JSON Schema with branch discriminators.

### 3.2 Graphlit TypeScript SDK path

The Google provider path is:

- `src/client.ts`
- `src/streaming/providers.ts`
- `streamWithGoogle(...)`

The old code built Gemini function declarations with:

```ts
return {
  name: tool.name,
  description: tool.description,
  parameters: cleanedSchema,
};
```

That forces JSON Schema into Google's typed `Schema` field and produces backend errors like:

```text
Unknown name "const" at tools[0].function_declarations[0].parameters...
Unknown name "discriminator" at tools[0].function_declarations[0].parameters...
```

---

## 4. Key Decisions

### 4.1 Do not change the source schema

Zine's `analyze_prompt` schema remains authoritative.

Do not rewrite the Zod discriminated unions, flatten the source schema, or relax runtime validation.

### 4.2 Use `parametersJsonSchema` for Gemini tool declarations

For Google only, build function declarations as:

```ts
{
  name: tool.name,
  description: tool.description,
  parametersJsonSchema: tool.schema ? JSON.parse(tool.schema) : {},
}
```

Do not also send `parameters`. The fields are mutually exclusive.

### 4.3 Preserve raw JSON Schema first

Do not sanitize `const`, `discriminator`, or `oneOf` in the first implementation.

The point of this change is to validate whether Google's JSON Schema path accepts the existing raw schema. If it does, we preserve the richest provider guidance with the smallest behavioral change.

### 4.4 Keep the blast radius Google-only

Do not route this through shared formatter code.

Do not change:

- OpenAI
- Anthropic
- Groq
- Mistral
- Bedrock
- Cohere
- Cerebras
- Deepseek
- xAI
- Graphlit API persistence

### 4.5 Prompt cache must use the same declaration shape

The Google provider can attach tools both to direct generation config and cached-content creation.

Build Google tools once and reuse the same `parametersJsonSchema` declarations for:

- `config.tools`
- `googleClient.caches.create(...).config.tools`

---

## 5. Goals

- Gemini receives raw JSON Schema under `parametersJsonSchema`, not `parameters`.
- The `analyze_prompt` schema keeps `const`, `discriminator`, and `oneOf` when sent through the JSON Schema field.
- Direct generation and cached-content creation use the same tool declaration shape.
- Non-Google provider payloads remain unchanged.
- Runtime validation remains authoritative after a Gemini tool call is returned.

---

## 6. Non-Goals

- No Zine schema rewrite.
- No Google sanitizer in the first implementation.
- No flattening of `finalResponse` or `workItems`.
- No change to generated GraphQL types or documents.
- No broad provider schema normalization.
- No live provider fallback from Gemini to another model.

---

## 7. Proposed Implementation

### 7.1 Add a Google tool declaration helper

Add a file-local or exported-for-test helper in `src/streaming/providers.ts`:

```ts
export function buildGoogleTools(
  tools: ToolDefinitionInput[] | undefined,
): any[] | undefined {
  if (!tools || tools.length === 0) {
    return undefined;
  }

  return [
    {
      functionDeclarations: tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        parametersJsonSchema: tool.schema ? JSON.parse(tool.schema) : {},
      })),
    },
  ];
}
```

### 7.2 Use the helper in `streamWithGoogle`

Replace the old cleaner path with:

```ts
const googleTools = buildGoogleTools(tools);
```

Then continue using `googleTools` in both:

- cached content creation
- direct `config.tools`

### 7.3 Remove dead Google `streamConfig.tools`

The Google provider previously built an OpenAI/Anthropic-shaped `streamConfig.tools` object with `input_schema`, but the actual request uses `googleTools`.

Remove that dead construction while making this change so there is one obvious Google tool path.

---

## 8. Test Plan

Add a focused test file:

- `test/google-json-schema-tools.test.ts`

Coverage:

1. `buildGoogleTools(...)` returns function declarations with:
   - `parametersJsonSchema`
   - no `parameters`
   - preserved tool name and description
2. An `analyze_prompt`-style schema keeps:
   - `const`
   - `discriminator`
   - `oneOf`
   - `additionalProperties`
3. `streamWithGoogle(...)` sends `parametersJsonSchema` in the request captured by a mock `googleClient.models.generateContentStream`.
4. `streamWithGoogle(...)` sends the same declaration shape when creating cached content through a mock `googleClient.caches.create`.

Run:

```bash
npm test -- google-json-schema-tools
npm run build
```

Optional live validation:

- rerun the failing Zine/Durable Gemini smoke case
- confirm the provider no longer reports `Unknown name "const"` under `parameters`
- confirm Gemini reaches the first `analyze_prompt` tool-call attempt

Live validation on 2026-06-28 confirmed the raw `analyze_prompt`-style schema
under `parametersJsonSchema` was accepted by:

- `gemini-2.5-flash-lite`
- `gemini-3.1-pro-preview`
- `gemini-3.5-flash`

All three returned one or more `analyze_prompt` function calls with the expected
top-level argument keys: `prompt`, `finalResponse`, and `workItems`.

---

## 9. Risk Assessment

### 9.1 Overall risk

Risk is low when scoped to Google.

The change does not weaken the schema. It moves the existing raw schema into the field Google provides for raw JSON Schema.

### 9.2 Main uncertainty

Google may still reject some JSON Schema keywords under `parametersJsonSchema`.

This is the key thing to validate live. The local unit test can prove we send the right field. Only a Gemini request can prove the backend accepts this exact schema dialect.

### 9.3 Why this is safer than sanitizer-first

A sanitizer would immediately weaken Gemini's tool guidance by converting or dropping schema keywords.

Using `parametersJsonSchema` first preserves the full schema and tests the intended Google field before accepting semantic downgrade.

---

## 10. Fallback If Google Still Rejects The Schema

If live validation still fails with unsupported JSON Schema keywords under `parametersJsonSchema`, add a Google-only JSON Schema sanitizer as a second step.

Fallback sanitizer rules:

1. Convert `const: "value"` to `enum: ["value"]`.
2. Remove `discriminator`.
3. Convert `oneOf` to `anyOf`.
4. Preserve `type`, `properties`, `required`, `items`, `enum`, `description`, and `nullable`.
5. Apply recursively.
6. Keep the sanitizer inside the Google provider path only.

If even that is too weak or unstable for Gemini, flatten only known discriminated-union fields such as `finalResponse` and `workItems.items` in the Google request, while keeping Zine runtime validation unchanged.

---

## 11. Acceptance Criteria

1. Google function declarations use `parametersJsonSchema`, not `parameters`.
2. Raw JSON Schema keywords from the source schema are preserved in `parametersJsonSchema`.
3. Direct generation and cached-content creation use the same Google tool declaration helper.
4. Focused unit tests pass.
5. `npm run build` passes.
6. OpenAI and Anthropic tool schemas are unchanged.
7. Live Gemini validation, when available, no longer fails with `Unknown name "const"` under `parameters`.

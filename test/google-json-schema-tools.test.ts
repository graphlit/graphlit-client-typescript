import { describe, expect, it, vi } from "vitest";
import * as Types from "../src/generated/graphql-types";
import { buildGoogleTools, streamWithGoogle } from "../src/streaming/providers";
import type { StreamEvent } from "../src/types/internal";

async function* makeGoogleStream(chunks: any[]) {
  for (const chunk of chunks) {
    yield chunk;
  }
}

function snapshotRequest(request: any) {
  return JSON.parse(JSON.stringify(request));
}

const TEST_SPEC = {
  __typename: "Specification",
  id: "google-spec-1",
  name: "Google JSON Schema Test",
  serviceType: Types.ModelServiceTypes.Google,
  google: {
    model: Types.GoogleModels.Gemini_2_5Flash,
    temperature: 0.2,
  },
} as Types.Specification;

const ANALYZE_PROMPT_STYLE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    finalResponse: {
      oneOf: [
        {
          type: "object",
          properties: {
            mode: { type: "string", const: "exact" },
            text: { type: "string" },
          },
          required: ["mode", "text"],
        },
        {
          type: "object",
          properties: {
            mode: { type: "string", const: "freeform" },
            instruction: { type: "string" },
          },
          required: ["mode"],
        },
      ],
      discriminator: { propertyName: "mode" },
    },
    workItems: {
      type: "array",
      items: {
        oneOf: [
          {
            type: "object",
            properties: {
              kind: { type: "string", const: "code_execution" },
              executionProfile: {
                type: "string",
                enum: ["generic_python", "graphlit_python_sdk"],
              },
              sdkQuestion: { type: "string" },
            },
            required: ["kind", "executionProfile"],
          },
          {
            type: "object",
            properties: {
              kind: { type: "string", const: "artifact_collection" },
            },
            required: ["kind"],
          },
        ],
        discriminator: { propertyName: "kind" },
      },
    },
  },
  required: ["finalResponse", "workItems"],
};

const TEST_TOOLS = [
  {
    name: "analyze_prompt",
    description: "Analyze prompt before work.",
    schema: JSON.stringify(ANALYZE_PROMPT_STYLE_SCHEMA),
  },
] as Types.ToolDefinitionInput[];

function expectJsonSchemaFunctionDeclaration(functionDeclaration: any) {
  expect(functionDeclaration.name).toBe("analyze_prompt");
  expect(functionDeclaration.description).toBe("Analyze prompt before work.");
  expect(functionDeclaration.parameters).toBeUndefined();
  expect(functionDeclaration.parametersJsonSchema).toEqual(
    ANALYZE_PROMPT_STYLE_SCHEMA,
  );
  expect(
    functionDeclaration.parametersJsonSchema.properties.finalResponse.oneOf[0]
      .properties.mode.const,
  ).toBe("exact");
  expect(
    functionDeclaration.parametersJsonSchema.properties.finalResponse
      .discriminator.propertyName,
  ).toBe("mode");
  expect(
    functionDeclaration.parametersJsonSchema.properties.workItems.items.oneOf[0]
      .properties.kind.const,
  ).toBe("code_execution");
}

describe("Google JSON Schema tools", () => {
  it("builds function declarations with parametersJsonSchema instead of parameters", () => {
    const googleTools = buildGoogleTools(TEST_TOOLS);

    expect(googleTools).toHaveLength(1);
    expect(googleTools?.[0].functionDeclarations).toHaveLength(1);
    expectJsonSchemaFunctionDeclaration(
      googleTools?.[0].functionDeclarations[0],
    );
  });

  it("passes raw JSON Schema through generateContentStream", async () => {
    const events: StreamEvent[] = [];
    const onComplete = vi.fn();
    const googleClient = {
      models: {
        generateContentStream: vi.fn().mockResolvedValue(
          makeGoogleStream([
            {
              candidates: [
                {
                  content: {
                    parts: [{ text: "Done." }],
                  },
                },
              ],
              usageMetadata: {
                promptTokenCount: 1,
                candidatesTokenCount: 1,
                totalTokenCount: 2,
              },
            },
          ]),
        ),
      },
    };

    await streamWithGoogle(
      TEST_SPEC,
      [{ role: "user", parts: [{ text: "Need analysis." }] }],
      undefined,
      TEST_TOOLS,
      googleClient,
      undefined,
      (event) => events.push(event),
      onComplete,
    );

    const request = googleClient.models.generateContentStream.mock.calls[0][0];
    const functionDeclaration = request.config.tools[0].functionDeclarations[0];

    expectJsonSchemaFunctionDeclaration(functionDeclaration);
    expect(onComplete).toHaveBeenCalledWith(
      "Done.",
      [],
      {
        prompt_tokens: 1,
        completion_tokens: 1,
        total_tokens: 2,
        cachedContentTokenCount: undefined,
      },
      undefined,
    );
    expect(events).toContainEqual({ type: "token", token: "Done." });
    expect(events).toContainEqual({ type: "complete", tokens: 1 });
  });

  // Google rejects any GenerateContent request that combines `cachedContent`
  // with request-level `system_instruction`, `tools`, or `tool_config`:
  //   "CachedContent can not be used with GenerateContent request setting
  //    system_instruction, tools or tool_config."
  // A forced tool choice is a per-round directive, so those rounds must bypass
  // the cache and send everything inline.
  const FORCED_TOOL_CONFIG = {
    functionCallingConfig: {
      mode: "ANY",
      allowedFunctionNames: ["analyze_prompt"],
    },
  };

  it("never combines cachedContent with a request-level tool config", async () => {
    const googleClient = {
      caches: {
        create: vi.fn().mockResolvedValue({ name: "cachedContents/test" }),
      },
      models: {
        generateContentStream: vi.fn().mockResolvedValue(
          makeGoogleStream([
            {
              candidates: [{ content: { parts: [{ text: "ok" }] } }],
            },
          ]),
        ),
      },
    };

    await streamWithGoogle(
      TEST_SPEC,
      [{ role: "user", parts: [{ text: "Use the tool." }] }],
      ["System prompt"],
      TEST_TOOLS,
      googleClient,
      { entries: new Map() },
      vi.fn(),
      vi.fn(),
      undefined, // abortSignal
      undefined, // thinkingConfig
      FORCED_TOOL_CONFIG,
    );

    // Forced-tool rounds must skip the cache entirely.
    expect(googleClient.caches.create).not.toHaveBeenCalled();

    const request = googleClient.models.generateContentStream.mock.calls[0][0];
    expect(request.config.cachedContent).toBeUndefined();
    // System instruction, tools, and tool config are sent inline instead.
    expect(request.config.toolConfig).toEqual(FORCED_TOOL_CONFIG);
    expect(request.config.tools).toBeDefined();
    expect(request.config.systemInstruction).toBeDefined();
  });

  it("uses cachedContent only on rounds without a forced tool choice", async () => {
    const googleClient = {
      caches: {
        create: vi.fn().mockResolvedValue({ name: "cachedContents/test" }),
      },
      models: {
        generateContentStream: vi.fn().mockResolvedValue(
          makeGoogleStream([
            {
              candidates: [{ content: { parts: [{ text: "ok" }] } }],
            },
          ]),
        ),
      },
    };
    const promptCache = { entries: new Map<string, string>() };

    // Round 1 forces a tool choice -> inline request, no cache.
    await streamWithGoogle(
      TEST_SPEC,
      [{ role: "user", parts: [{ text: "Use the tool." }] }],
      ["System prompt"],
      TEST_TOOLS,
      googleClient,
      promptCache,
      vi.fn(),
      vi.fn(),
      undefined,
      undefined,
      FORCED_TOOL_CONFIG,
    );

    expect(googleClient.caches.create).not.toHaveBeenCalled();
    const round1 = googleClient.models.generateContentStream.mock.calls[0][0];
    expect(round1.config.cachedContent).toBeUndefined();
    expect(round1.config.toolConfig).toEqual(FORCED_TOOL_CONFIG);

    // Round 2 has no forced tool choice -> create and use the cache, and never
    // send system instruction / tools / tool config at request level.
    await streamWithGoogle(
      TEST_SPEC,
      [{ role: "user", parts: [{ text: "Continue." }] }],
      ["System prompt"],
      TEST_TOOLS,
      googleClient,
      promptCache,
      vi.fn(),
      vi.fn(),
    );

    expect(googleClient.caches.create).toHaveBeenCalledTimes(1);
    const round2 = googleClient.models.generateContentStream.mock.calls[1][0];
    expect(round2.config.cachedContent).toBe("cachedContents/test");
    expect(round2.config.toolConfig).toBeUndefined();
    expect(round2.config.tools).toBeUndefined();
    expect(round2.config.systemInstruction).toBeUndefined();
  });

  it("uses parametersJsonSchema when creating cached content with tools", async () => {
    const googleClient = {
      caches: {
        create: vi.fn().mockResolvedValue({ name: "cachedContents/test" }),
      },
      models: {
        generateContentStream: vi.fn().mockResolvedValue(
          makeGoogleStream([
            {
              candidates: [
                {
                  content: {
                    parts: [{ text: "Cached." }],
                  },
                },
              ],
            },
          ]),
        ),
      },
    };

    await streamWithGoogle(
      TEST_SPEC,
      [{ role: "user", parts: [{ text: "Need cached analysis." }] }],
      ["System prompt"],
      TEST_TOOLS,
      googleClient,
      { entries: new Map() },
      vi.fn(),
      vi.fn(),
    );

    const cacheRequest = googleClient.caches.create.mock.calls[0][0];
    const cachedFunctionDeclaration =
      cacheRequest.config.tools[0].functionDeclarations[0];

    expectJsonSchemaFunctionDeclaration(cachedFunctionDeclaration);
    expect(googleClient.models.generateContentStream).toHaveBeenCalledWith(
      expect.objectContaining({
        config: expect.objectContaining({
          cachedContent: "cachedContents/test",
        }),
      }),
    );
  });

  it("retries once inline when cachedContent returns Google's 403 not found shape", async () => {
    const googleCachedContent403 = {
      error: {
        message:
          '{\n  "error": {\n    "code": 403,\n    "message": "CachedContent not found (or permission denied)",\n    "status": "PERMISSION_DENIED"\n  }\n}\n',
        code: 403,
        status: "Forbidden",
      },
      code: 403,
      status: 403,
      message:
        '{\n  "error": {\n    "code": 403,\n    "message": "CachedContent not found (or permission denied)",\n    "status": "PERMISSION_DENIED"\n  }\n}\n',
    };
    const generateRequests: any[] = [];
    const onComplete = vi.fn();
    const googleClient = {
      caches: {
        create: vi.fn().mockResolvedValue({ name: "cachedContents/stale" }),
      },
      models: {
        generateContentStream: vi.fn().mockImplementation((request: any) => {
          generateRequests.push(snapshotRequest(request));
          if (generateRequests.length === 1) {
            return Promise.reject(googleCachedContent403);
          }

          return Promise.resolve(
            makeGoogleStream([
              {
                candidates: [
                  {
                    content: {
                      parts: [{ text: "Recovered." }],
                    },
                  },
                ],
                usageMetadata: {
                  promptTokenCount: 2,
                  candidatesTokenCount: 1,
                  totalTokenCount: 3,
                },
              },
            ]),
          );
        }),
      },
    };
    const promptCache = { entries: new Map<string, string>() };

    await streamWithGoogle(
      TEST_SPEC,
      [{ role: "user", parts: [{ text: "Continue after the tool." }] }],
      ["System prompt"],
      TEST_TOOLS,
      googleClient,
      promptCache,
      vi.fn(),
      onComplete,
    );

    expect(googleClient.caches.create).toHaveBeenCalledTimes(1);
    expect(googleClient.models.generateContentStream).toHaveBeenCalledTimes(2);

    expect(generateRequests[0].config.cachedContent).toBe(
      "cachedContents/stale",
    );
    expect(generateRequests[0].config.systemInstruction).toBeUndefined();
    expect(generateRequests[0].config.tools).toBeUndefined();

    expect(generateRequests[1].config.cachedContent).toBeUndefined();
    expect(generateRequests[1].config.systemInstruction).toEqual({
      parts: [{ text: "System prompt" }],
    });
    expectJsonSchemaFunctionDeclaration(
      generateRequests[1].config.tools[0].functionDeclarations[0],
    );
    expect(promptCache.entries.size).toBe(0);
    expect(onComplete).toHaveBeenCalledWith(
      "Recovered.",
      [],
      {
        prompt_tokens: 2,
        completion_tokens: 1,
        total_tokens: 3,
        cachedContentTokenCount: undefined,
      },
      undefined,
    );
  });

  it("does not retry unrelated Google 403 errors", async () => {
    const authError = {
      code: 403,
      status: "Forbidden",
      message: "API key is not authorized for this model",
    };
    const generateRequests: any[] = [];
    const googleClient = {
      caches: {
        create: vi.fn().mockResolvedValue({ name: "cachedContents/test" }),
      },
      models: {
        generateContentStream: vi.fn().mockImplementation((request: any) => {
          generateRequests.push(snapshotRequest(request));
          return Promise.reject(authError);
        }),
      },
    };
    const promptCache = { entries: new Map<string, string>() };

    await expect(
      streamWithGoogle(
        TEST_SPEC,
        [{ role: "user", parts: [{ text: "Continue." }] }],
        ["System prompt"],
        TEST_TOOLS,
        googleClient,
        promptCache,
        vi.fn(),
        vi.fn(),
      ),
    ).rejects.toBe(authError);

    expect(googleClient.models.generateContentStream).toHaveBeenCalledTimes(1);
    expect(generateRequests[0].config.cachedContent).toBe(
      "cachedContents/test",
    );
    expect(promptCache.entries.size).toBe(1);
  });

  it("keeps retrying once for Google 404 cached content errors", async () => {
    const generateRequests: any[] = [];
    const googleClient = {
      caches: {
        create: vi.fn().mockResolvedValue({ name: "cachedContents/stale" }),
      },
      models: {
        generateContentStream: vi.fn().mockImplementation((request: any) => {
          generateRequests.push(snapshotRequest(request));
          if (generateRequests.length === 1) {
            return Promise.reject({
              status: 404,
              message: "CachedContent not found",
            });
          }

          return Promise.resolve(
            makeGoogleStream([
              {
                candidates: [
                  {
                    content: {
                      parts: [{ text: "Recovered from 404." }],
                    },
                  },
                ],
              },
            ]),
          );
        }),
      },
    };

    await streamWithGoogle(
      TEST_SPEC,
      [{ role: "user", parts: [{ text: "Continue." }] }],
      ["System prompt"],
      TEST_TOOLS,
      googleClient,
      { entries: new Map() },
      vi.fn(),
      vi.fn(),
    );

    expect(googleClient.models.generateContentStream).toHaveBeenCalledTimes(2);
    expect(generateRequests[0].config.cachedContent).toBe(
      "cachedContents/stale",
    );
    expect(generateRequests[1].config.cachedContent).toBeUndefined();
    expect(generateRequests[1].config.systemInstruction).toBeDefined();
    expect(generateRequests[1].config.tools).toBeDefined();
  });
});

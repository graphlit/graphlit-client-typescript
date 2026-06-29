import { describe, expect, it, vi } from "vitest";
import * as Types from "../src/generated/graphql-types";
import {
  buildGoogleTools,
  streamWithGoogle,
} from "../src/streaming/providers";
import type { StreamEvent } from "../src/types/internal";

async function* makeGoogleStream(chunks: any[]) {
  for (const chunk of chunks) {
    yield chunk;
  }
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
    const functionDeclaration =
      request.config.tools[0].functionDeclarations[0];

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
});

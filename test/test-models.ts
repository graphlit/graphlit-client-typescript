import * as Types from "../src/generated/graphql-types";

/**
 * Shared test model configurations used across test suites
 */
export interface TestModelConfig {
  name: string;
  config: Types.SpecificationInput;
  skipStreaming?: boolean;
}

/**
 * Complete list of test models including latest versions
 * Note: Some models may require specific API keys to be set in environment
 */
export const TEST_MODELS: TestModelConfig[] = [
  // OpenAI Models
  {
    name: "OpenAI o3",
    config: {
      name: "Test OpenAI o3",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.OpenAi,
      openAI: {
        model: Types.OpenAiModels.O3_200K,
        temperature: 1.0,
      },
      retrievalStrategy: {
        type: Types.RetrievalStrategyTypes.Section,
        disableFallback: true,
      },
    },
  },
  {
    name: "OpenAI o3 Mini",
    config: {
      name: "Test OpenAI o3 Mini",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.OpenAi,
      openAI: {
        model: Types.OpenAiModels.O3Mini_200K,
        temperature: 1.0,
      },
      retrievalStrategy: {
        type: Types.RetrievalStrategyTypes.Section,
        disableFallback: true,
      },
    },
  },
  {
    name: "OpenAI GPT-4.1",
    config: {
      name: "Test OpenAI GPT-4.1",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.OpenAi,
      openAI: {
        model: Types.OpenAiModels.Gpt41_1024K,
        temperature: 0.7,
      },
      retrievalStrategy: {
        type: Types.RetrievalStrategyTypes.Section,
        disableFallback: true,
      },
    },
  },
  {
    name: "OpenAI GPT-4.1 Mini",
    config: {
      name: "Test OpenAI GPT-4.1 Mini",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.OpenAi,
      openAI: {
        model: Types.OpenAiModels.Gpt41Mini_1024K,
        temperature: 0.7,
      },
      retrievalStrategy: {
        type: Types.RetrievalStrategyTypes.Section,
        disableFallback: true,
      },
    },
  },
  {
    name: "OpenAI GPT-4o",
    config: {
      name: "Test OpenAI GPT-4o",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.OpenAi,
      openAI: {
        model: Types.OpenAiModels.Gpt4O_128K,
        temperature: 0.7,
      },
      retrievalStrategy: {
        type: Types.RetrievalStrategyTypes.Section,
        disableFallback: true,
      },
    },
  },
  {
    name: "OpenAI GPT-4o Mini",
    config: {
      name: "Test OpenAI GPT-4o Mini",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.OpenAi,
      openAI: {
        model: Types.OpenAiModels.Gpt4OMini_128K,
        temperature: 0.7,
      },
      retrievalStrategy: {
        type: Types.RetrievalStrategyTypes.Section,
        disableFallback: true,
      },
    },
  },

  // Anthropic Models
  {
    name: "Anthropic Claude 4 Opus",
    config: {
      name: "Test Anthropic Claude 4 Opus",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.Anthropic,
      anthropic: {
        model: Types.AnthropicModels.Claude_4Opus,
        temperature: 0.7,
      },
      retrievalStrategy: {
        type: Types.RetrievalStrategyTypes.Section,
        disableFallback: true,
      },
    },
  },
  {
    name: "Anthropic Claude 4 Sonnet",
    config: {
      name: "Test Anthropic Claude 4 Sonnet",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.Anthropic,
      anthropic: {
        model: Types.AnthropicModels.Claude_4Sonnet,
        temperature: 0.7,
      },
      retrievalStrategy: {
        type: Types.RetrievalStrategyTypes.Section,
        disableFallback: true,
      },
    },
  },
  {
    name: "Anthropic Claude 3.7 Sonnet",
    config: {
      name: "Test Anthropic Claude 3.7 Sonnet",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.Anthropic,
      anthropic: {
        model: Types.AnthropicModels.Claude_3_7Sonnet,
        temperature: 0.7,
      },
      retrievalStrategy: {
        type: Types.RetrievalStrategyTypes.Section,
        disableFallback: true,
      },
    },
  },
  {
    name: "Anthropic Claude 3.5 Haiku",
    config: {
      name: "Test Anthropic Claude 3.5 Haiku",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.Anthropic,
      anthropic: {
        model: Types.AnthropicModels.Claude_3_5Haiku,
        temperature: 0.7,
      },
      retrievalStrategy: {
        type: Types.RetrievalStrategyTypes.Section,
        disableFallback: true,
      },
    },
  },

  // Google Models
  {
    name: "Google Gemini 2.5 Pro",
    config: {
      name: "Test Google Gemini 2.5 Pro",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.Google,
      google: {
        model: Types.GoogleModels.Gemini_2_5ProPreview,
        temperature: 0.7,
      },
      retrievalStrategy: {
        type: Types.RetrievalStrategyTypes.Section,
        disableFallback: true,
      },
    },
  },
  {
    name: "Google Gemini 2.5 Flash",
    config: {
      name: "Test Google Gemini 2.5 Flash",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.Google,
      google: {
        model: Types.GoogleModels.Gemini_2_5FlashPreview,
        temperature: 0.7,
      },
      retrievalStrategy: {
        type: Types.RetrievalStrategyTypes.Section,
        disableFallback: true,
      },
    },
  },

  // Uncomment these if you have API keys configured:
  /*
  {
    name: "Deepseek Chat",
    config: {
      name: "Test Deepseek Chat",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.Deepseek,
      deepseek: {
        model: Types.DeepseekModels.Chat,
        temperature: 0.7,
      },
    },
  },
  {
    name: "Groq LLaMA 3.3 70B",
    config: {
      name: "Test Groq LLaMA 3.3 70B",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.Groq,
      groq: {
        model: Types.GroqModels.Llama_3_3_70B,
        temperature: 0.7,
      },
    },
  },
  {
    name: "Cerebras LLaMA 3.3 70B",
    config: {
      name: "Test Cerebras LLaMA 3.3 70B",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.Cerebras,
      cerebras: {
        model: Types.CerebrasModels.Llama_3_3_70B,
        temperature: 0.7,
      },
    },
  },
  */
];

/**
 * Subset of models for performance testing
 * These are generally faster and more suitable for repeated tests
 */
export const PERFORMANCE_TEST_MODELS: TestModelConfig[] = [
  TEST_MODELS.find((m) => m.name === "OpenAI o3")!,
  TEST_MODELS.find((m) => m.name === "OpenAI o3 Mini")!,
  TEST_MODELS.find((m) => m.name === "OpenAI GPT-4o")!,
  TEST_MODELS.find((m) => m.name === "OpenAI GPT-4o Mini")!,
  TEST_MODELS.find((m) => m.name === "OpenAI GPT-4.1")!,
  TEST_MODELS.find((m) => m.name === "OpenAI GPT-4.1 Mini")!,
  TEST_MODELS.find((m) => m.name === "Anthropic Claude 4 Opus")!,
  TEST_MODELS.find((m) => m.name === "Anthropic Claude 4 Sonnet")!,
  TEST_MODELS.find((m) => m.name === "Google Gemini 2.5 Pro")!,
  TEST_MODELS.find((m) => m.name === "Google Gemini 2.5 Flash")!,
];

/**
 * Subset of models for tool calling limit testing
 * These models have good tool calling support
 */
export const TOOL_LIMIT_TEST_MODELS: TestModelConfig[] = [
  TEST_MODELS.find((m) => m.name === "OpenAI o3")!,
  TEST_MODELS.find((m) => m.name === "OpenAI o3 Mini")!,
  TEST_MODELS.find((m) => m.name === "OpenAI GPT-4o")!,
  TEST_MODELS.find((m) => m.name === "OpenAI GPT-4o Mini")!,
  TEST_MODELS.find((m) => m.name === "OpenAI GPT-4.1")!,
  TEST_MODELS.find((m) => m.name === "OpenAI GPT-4.1 Mini")!,
  TEST_MODELS.find((m) => m.name === "Anthropic Claude 4 Opus")!,
  TEST_MODELS.find((m) => m.name === "Anthropic Claude 4 Sonnet")!,
  TEST_MODELS.find((m) => m.name === "Google Gemini 2.5 Pro")!,
  TEST_MODELS.find((m) => m.name === "Google Gemini 2.5 Flash")!,
];

/**
 * Models that support native streaming with SDK clients
 */
export const NATIVE_STREAMING_MODELS: TestModelConfig[] = TEST_MODELS.filter(
  (m) =>
    m.name.includes("OpenAI") ||
    m.name.includes("Anthropic") ||
    m.name.includes("Google")
);

/**
 * Get model configuration by name
 */
export function getModelByName(name: string): TestModelConfig | undefined {
  return TEST_MODELS.find((m) => m.name === name);
}

/**
 * Get models by service type
 */
export function getModelsByService(
  serviceType: Types.ModelServiceTypes
): TestModelConfig[] {
  return TEST_MODELS.filter((m) => m.config.serviceType === serviceType);
}

/**
 * Clone a model config with custom overrides
 */
export function cloneModelConfig(
  model: TestModelConfig,
  overrides: Partial<Types.SpecificationInput>
): TestModelConfig {
  return {
    ...model,
    config: {
      ...model.config,
      ...overrides,
      // Merge service-specific configs
      openAI:
        model.config.openAI && overrides.openAI
          ? { ...model.config.openAI, ...overrides.openAI }
          : overrides.openAI || model.config.openAI,
      anthropic:
        model.config.anthropic && overrides.anthropic
          ? { ...model.config.anthropic, ...overrides.anthropic }
          : overrides.anthropic || model.config.anthropic,
      google:
        model.config.google && overrides.google
          ? { ...model.config.google, ...overrides.google }
          : overrides.google || model.config.google,
    },
  };
}

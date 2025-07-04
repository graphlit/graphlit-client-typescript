import * as Types from "../src/generated/graphql-types";

/**
 * Shared test model configurations used across test suites
 */
export interface TestModelConfig {
  name: string;
  config: Types.SpecificationInput;
  skipStreaming?: boolean;
  supportsTools?: boolean; // Some models don't support tool calling
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
        model: Types.GoogleModels.Gemini_2_5Pro,
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
        model: Types.GoogleModels.Gemini_2_5Flash,
        temperature: 0.7,
      },
      retrievalStrategy: {
        type: Types.RetrievalStrategyTypes.Section,
        disableFallback: true,
      },
    },
  },

  // Groq Models
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
      retrievalStrategy: {
        type: Types.RetrievalStrategyTypes.Section,
        disableFallback: true,
      },
    },
  },

  // Cerebras Models
  {
    name: "Cerebras LLaMA 3.3 70B",
    supportsTools: false, // Only qwen-3-32b on Cerebras supports tools
    config: {
      name: "Test Cerebras LLaMA 3.3 70B",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.Cerebras,
      cerebras: {
        model: Types.CerebrasModels.Llama_3_3_70B,
        temperature: 0.7,
      },
      retrievalStrategy: {
        type: Types.RetrievalStrategyTypes.Section,
        disableFallback: true,
      },
    },
  },

  // Cohere Models
  {
    name: "Cohere Command R+",
    config: {
      name: "Test Cohere Command R+",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.Cohere,
      cohere: {
        model: Types.CohereModels.CommandRPlus,
        temperature: 0.7,
      },
      retrievalStrategy: {
        type: Types.RetrievalStrategyTypes.Section,
        disableFallback: true,
      },
    },
  },
  {
    name: "Cohere Command R",
    config: {
      name: "Test Cohere Command R",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.Cohere,
      cohere: {
        model: Types.CohereModels.CommandR,
        temperature: 0.7,
      },
      retrievalStrategy: {
        type: Types.RetrievalStrategyTypes.Section,
        disableFallback: true,
      },
    },
  },

  // Mistral Models
  {
    name: "Mistral Large",
    config: {
      name: "Test Mistral Large",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.Mistral,
      mistral: {
        model: Types.MistralModels.MistralLarge,
        temperature: 0.7,
      },
      retrievalStrategy: {
        type: Types.RetrievalStrategyTypes.Section,
        disableFallback: true,
      },
    },
  },
  {
    name: "Mistral Small",
    config: {
      name: "Test Mistral Small",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.Mistral,
      mistral: {
        model: Types.MistralModels.MistralSmall,
        temperature: 0.7,
      },
      retrievalStrategy: {
        type: Types.RetrievalStrategyTypes.Section,
        disableFallback: true,
      },
    },
    supportsTools: false, // Mistral Small appears to not support tool calling
  },

  // Bedrock Models
  {
    name: "Bedrock Nova Premier",
    config: {
      name: "Test Bedrock Nova Premier",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.Bedrock,
      bedrock: {
        model: Types.BedrockModels.NovaPremier,
        temperature: 0.7,
      },
      retrievalStrategy: {
        type: Types.RetrievalStrategyTypes.Section,
        disableFallback: true,
      },
    },
  },
  {
    name: "Bedrock Claude 3.7 Sonnet",
    config: {
      name: "Test Bedrock Claude 3.7 Sonnet",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.Bedrock,
      bedrock: {
        model: Types.BedrockModels.Claude_3_7Sonnet,
        temperature: 0.7,
      },
      retrievalStrategy: {
        type: Types.RetrievalStrategyTypes.Section,
        disableFallback: true,
      },
    },
  },

  // Deepseek Models
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
      retrievalStrategy: {
        type: Types.RetrievalStrategyTypes.Section,
        disableFallback: true,
      },
    },
  },
  {
    name: "Deepseek Reasoner",
    config: {
      name: "Test Deepseek Reasoner",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.Deepseek,
      deepseek: {
        model: Types.DeepseekModels.Reasoner,
        temperature: 0.7,
      },
      retrievalStrategy: {
        type: Types.RetrievalStrategyTypes.Section,
        disableFallback: true,
      },
    },
  },
];

/**
 * Subset of models for performance testing
 * These are generally faster, more reliable, and suitable for repeated tests
 * Excludes models with known issues or availability problems
 */
export const PERFORMANCE_TEST_MODELS: TestModelConfig[] = [
  // OpenAI - Most reliable models
  TEST_MODELS.find((m) => m.name === "OpenAI GPT-4o Mini")!,
  TEST_MODELS.find((m) => m.name === "OpenAI GPT-4o")!,

  // Anthropic - Stable models
  TEST_MODELS.find((m) => m.name === "Anthropic Claude 3.5 Haiku")!,

  // Google - Generally reliable
  TEST_MODELS.find((m) => m.name === "Google Gemini 2.5 Flash")!,

  // Skip problematic models:
  // - OpenAI o3/o3 Mini (may have availability/rate limit issues)
  // - Claude 4 models (may not be available yet)
  // - Cohere Command R+ (recent 422 fix, still testing)
  // - Groq LLaMA 3.3 70B (tool calling issues)
  // - Cerebras/Mistral/Bedrock/Deepseek (not critical for performance baseline)
].filter(Boolean);

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
  TEST_MODELS.find((m) => m.name === "Groq LLaMA 3.3 70B")!,
  TEST_MODELS.find((m) => m.name === "Cerebras LLaMA 3.3 70B")!,
  TEST_MODELS.find((m) => m.name === "Cohere Command R+")!,
  TEST_MODELS.find((m) => m.name === "Mistral Large")!,
  TEST_MODELS.find((m) => m.name === "Bedrock Claude 3.7 Sonnet")!,
  TEST_MODELS.find((m) => m.name === "Deepseek Chat")!,
];

/**
 * Models that support native streaming with SDK clients
 */
export const NATIVE_STREAMING_MODELS: TestModelConfig[] = TEST_MODELS.filter(
  (m) =>
    m.name.includes("OpenAI") ||
    m.name.includes("Anthropic") ||
    m.name.includes("Google") ||
    m.name.includes("Groq") ||
    m.name.includes("Cerebras") ||
    m.name.includes("Cohere") ||
    m.name.includes("Mistral") ||
    m.name.includes("Bedrock") ||
    m.name.includes("Deepseek")
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

import { loggerFor } from "openai/internal/utils/log.js";
import * as Types from "./generated/graphql-types.js";

/**
 * Model mapping utilities to convert Graphlit specification enums
 * to actual model names used by LLM SDKs
 */

// OpenAI model mappings
const OPENAI_MODEL_MAP: Record<string, string> = {
  // GPT-4 Turbo models
  [Types.OpenAiModels.Gpt4Turbo_128K]: "gpt-4-turbo",
  [Types.OpenAiModels.Gpt4Turbo_128K_0125]: "gpt-4-0125-preview",
  [Types.OpenAiModels.Gpt4Turbo_128K_1106]: "gpt-4-1106-preview",
  [Types.OpenAiModels.Gpt4Turbo_128K_20240409]: "gpt-4-turbo-2024-04-09",

  // GPT-4o models
  [Types.OpenAiModels.Gpt4O_128K]: "gpt-4o",
  [Types.OpenAiModels.Gpt4O_128K_20240513]: "gpt-4o-2024-05-13",
  [Types.OpenAiModels.Gpt4O_128K_20240806]: "gpt-4o-2024-08-06",
  [Types.OpenAiModels.Gpt4O_128K_20241120]: "gpt-4o-2024-11-20",
  [Types.OpenAiModels.Gpt4OChat_128K]: "chatgpt-4o-latest",

  // GPT-4o Mini models
  [Types.OpenAiModels.Gpt4OMini_128K]: "gpt-4o-mini",
  [Types.OpenAiModels.Gpt4OMini_128K_20240718]: "gpt-4o-mini-2024-07-18",

  // GPT 4.1 models
  [Types.OpenAiModels.Gpt41_1024K]: "gpt-4.1",
  [Types.OpenAiModels.Gpt41_1024K_20250414]: "gpt-4.1-2025-04-14",
  [Types.OpenAiModels.Gpt41Mini_1024K]: "gpt-4.1-mini",
  [Types.OpenAiModels.Gpt41Mini_1024K_20250414]: "gpt-4.1-mini-2025-04-14",
  [Types.OpenAiModels.Gpt41Nano_1024K]: "gpt-4.1-nano",
  [Types.OpenAiModels.Gpt41Nano_1024K_20250414]: "gpt-4.1-nano-2025-04-14",

  // GPT-4.5 Preview models (deprecated)
  [Types.OpenAiModels.Gpt45Preview_128K]: "gpt-4.5-preview",
  [Types.OpenAiModels.Gpt45Preview_128K_20250227]: "gpt-4.5-preview-2025-02-27",

  // GPT-5 models
  [Types.OpenAiModels.Gpt5_400K]: "gpt-5",
  [Types.OpenAiModels.Gpt5_400K_20250807]: "gpt-5-2025-08-07",
  [Types.OpenAiModels.Gpt5Chat_400K]: "chatgpt-5-latest",
  [Types.OpenAiModels.Gpt5Mini_400K]: "gpt-5-mini",
  [Types.OpenAiModels.Gpt5Mini_400K_20250807]: "gpt-5-mini-2025-08-07",
  [Types.OpenAiModels.Gpt5Nano_400K]: "gpt-5-nano",
  [Types.OpenAiModels.Gpt5Nano_400K_20250807]: "gpt-5-nano-2025-08-07",

  // GPT-5.1 models
  [Types.OpenAiModels.Gpt51_400K]: "gpt-5.1",
  [Types.OpenAiModels.Gpt51_400K_20251113]: "gpt-5.1-2025-11-13",

  // GPT-5.2 models
  [Types.OpenAiModels.Gpt52_400K]: "gpt-5.2",
  [Types.OpenAiModels.Gpt52_400K_20251211]: "gpt-5.2-2025-12-11",

  // O1 models
  [Types.OpenAiModels.O1_200K]: "o1",
  [Types.OpenAiModels.O1_200K_20241217]: "o1-2024-12-17",
  [Types.OpenAiModels.O1Mini_128K]: "o1-mini",
  [Types.OpenAiModels.O1Mini_128K_20240912]: "o1-mini-2024-09-12",
  [Types.OpenAiModels.O1Preview_128K]: "o1-preview",
  [Types.OpenAiModels.O1Preview_128K_20240912]: "o1-preview-2024-09-12",

  // O3 models
  [Types.OpenAiModels.O3Mini_200K]: "o3-mini",
  [Types.OpenAiModels.O3Mini_200K_20250131]: "o3-mini-2025-01-31",
  [Types.OpenAiModels.O3_200K]: "o3",
  [Types.OpenAiModels.O3_200K_20250416]: "o3-2025-04-16",

  // O4 models
  [Types.OpenAiModels.O4Mini_200K]: "o4-mini",
  [Types.OpenAiModels.O4Mini_200K_20250416]: "o4-mini-2025-04-16",
};

// Anthropic model mappings
const ANTHROPIC_MODEL_MAP: Record<string, string> = {
  // Claude 3 models
  [Types.AnthropicModels.Claude_3Opus]: "claude-3-opus-20240229",
  [Types.AnthropicModels.Claude_3Opus_20240229]: "claude-3-opus-20240229",
  [Types.AnthropicModels.Claude_3Sonnet]: "claude-3-sonnet-20240229",
  [Types.AnthropicModels.Claude_3Sonnet_20240229]: "claude-3-sonnet-20240229",
  [Types.AnthropicModels.Claude_3Haiku]: "claude-3-haiku-20240307",
  [Types.AnthropicModels.Claude_3Haiku_20240307]: "claude-3-haiku-20240307",

  // Claude 3.5 models
  [Types.AnthropicModels.Claude_3_5Sonnet]: "claude-3-5-sonnet-latest",
  [Types.AnthropicModels.Claude_3_5Sonnet_20240620]:
    "claude-3-5-sonnet-20240620",
  [Types.AnthropicModels.Claude_3_5Sonnet_20241022]:
    "claude-3-5-sonnet-20241022",
  [Types.AnthropicModels.Claude_3_5Haiku]: "claude-3-5-haiku-latest",
  [Types.AnthropicModels.Claude_3_5Haiku_20241022]: "claude-3-5-haiku-20241022",

  // Claude 3.7 models
  [Types.AnthropicModels.Claude_3_7Sonnet]: "claude-3-7-sonnet-latest",
  [Types.AnthropicModels.Claude_3_7Sonnet_20250219]:
    "claude-3-7-sonnet-20250219",

  // Claude 4 models
  [Types.AnthropicModels.Claude_4Opus]: "claude-opus-4-0",
  [Types.AnthropicModels.Claude_4Opus_20250514]: "claude-opus-4-20250514",
  [Types.AnthropicModels.Claude_4Sonnet]: "claude-sonnet-4-0",
  [Types.AnthropicModels.Claude_4Sonnet_20250514]: "claude-sonnet-4-20250514",

  // Claude 4.1 models
  [Types.AnthropicModels.Claude_4_1Opus]: "claude-opus-4-1",
  [Types.AnthropicModels.Claude_4_1Opus_20250805]: "claude-opus-4-1-20250805",

  // Claude 4.5 models
  [Types.AnthropicModels.Claude_4_5Opus]: "claude-opus-4-5",
  [Types.AnthropicModels.Claude_4_5Opus_20251101]: "claude-opus-4-5-20251101",
  [Types.AnthropicModels.Claude_4_5Sonnet]: "claude-sonnet-4-5",
  [Types.AnthropicModels.Claude_4_5Sonnet_20250929]:
    "claude-sonnet-4-5-20250929",
  [Types.AnthropicModels.Claude_4_5Haiku]: "claude-haiku-4-5",
  [Types.AnthropicModels.Claude_4_5Haiku_20251001]: "claude-haiku-4-5-20251001",

  // Claude 4.6 models (1M variants use the same model ID; context window is a beta flag)
  [Types.AnthropicModels.Claude_4_6Opus]: "claude-opus-4-6",
  [Types.AnthropicModels.Claude_4_6Opus_20260205]: "claude-opus-4-6-20260205",
  [Types.AnthropicModels.Claude_4_6Opus_1M]: "claude-opus-4-6",
  [Types.AnthropicModels.Claude_4_6Opus_1M_20260205]:
    "claude-opus-4-6-20260205",
  [Types.AnthropicModels.Claude_4_6Sonnet]: "claude-sonnet-4-6",
  [Types.AnthropicModels.Claude_4_6Sonnet_20260217]:
    "claude-sonnet-4-6-20260217",
  [Types.AnthropicModels.Claude_4_6Sonnet_1M]: "claude-sonnet-4-6",
  [Types.AnthropicModels.Claude_4_6Sonnet_1M_20260217]:
    "claude-sonnet-4-6-20260217",
};

// Google model mappings
const GOOGLE_MODEL_MAP: Record<string, string> = {
  // Gemini 1.5 Pro models
  [Types.GoogleModels.Gemini_1_5Pro]: "gemini-1.5-pro",
  [Types.GoogleModels.Gemini_1_5Pro_001]: "gemini-1.5-pro-001",
  [Types.GoogleModels.Gemini_1_5Pro_002]: "gemini-1.5-pro-002",

  // Gemini 1.5 Flash models
  [Types.GoogleModels.Gemini_1_5Flash]: "gemini-1.5-flash",
  [Types.GoogleModels.Gemini_1_5Flash_001]: "gemini-1.5-flash-001",
  [Types.GoogleModels.Gemini_1_5Flash_002]: "gemini-1.5-flash-002",

  // Gemini 1.5 Flash 8B models
  [Types.GoogleModels.Gemini_1_5Flash_8B]: "gemini-1.5-flash-8b",
  [Types.GoogleModels.Gemini_1_5Flash_8B_001]: "gemini-1.5-flash-8b-001",

  // Gemini 2.0 Flash models
  [Types.GoogleModels.Gemini_2_0Flash]: "gemini-2.0-flash-exp",
  [Types.GoogleModels.Gemini_2_0Flash_001]: "gemini-2.0-flash-001",
  [Types.GoogleModels.Gemini_2_0FlashExperimental]: "gemini-2.0-flash-exp",
  [Types.GoogleModels.Gemini_2_0FlashThinkingExperimental]:
    "gemini-2.0-flash-thinking-exp",
  [Types.GoogleModels.Gemini_2_0ProExperimental]: "gemini-2.0-pro-exp",

  // Gemini 2.5 models
  [Types.GoogleModels.Gemini_2_5FlashPreview]: "gemini-2.5-flash-preview-05-20",
  [Types.GoogleModels.Gemini_2_5ProPreview]: "gemini-2.5-pro-preview-06-05",
  [Types.GoogleModels.Gemini_2_5ProExperimental]: "gemini-2.5-pro-exp",
  [Types.GoogleModels.Gemini_2_5FlashLite]: "gemini-2.5-flash-lite",
  [Types.GoogleModels.Gemini_2_5Flash]: "gemini-2.5-flash",
  [Types.GoogleModels.Gemini_2_5Pro]: "gemini-2.5-pro",

  // Gemini 3 models
  [Types.GoogleModels.Gemini_3FlashPreview]: "gemini-3-flash-preview",
  [Types.GoogleModels.Gemini_3ProPreview]: "gemini-3-pro-preview",

  // Gemini Latest models
  [Types.GoogleModels.GeminiFlashLatest]: "gemini-flash-latest",
  [Types.GoogleModels.GeminiFlashLiteLatest]: "gemini-flash-lite-latest",
};

// Groq model mappings
const GROQ_MODEL_MAP: Record<string, string> = {
  [Types.GroqModels.Llama_4Scout_17B]:
    "meta-llama/llama-4-scout-17b-16e-instruct",
  [Types.GroqModels.Llama_4Maverick_17B]:
    "meta-llama/llama-4-maverick-17b-128e-instruct",
  [Types.GroqModels.DeepseekR1Llama_70BPreview]:
    "deepseek-r1-distill-llama-70b",
  [Types.GroqModels.Llama_3_3_70B]: "llama-3.3-70b-versatile",
  [Types.GroqModels.Mixtral_8X7BInstruct]: "mixtral-8x7b-32768",
  [Types.GroqModels.Llama_3_1_8B]: "llama-3.1-8b-instant",
  [Types.GroqModels.Llama_3_70B]: "llama3-70b-8192",
  [Types.GroqModels.Llama_3_8B]: "llama3-8b-8192",
  [Types.GroqModels.Qwen_3_32B]: "qwen/qwen3-32b",
  [Types.GroqModels.KimiK2_32B]: "moonshotai/kimi-k2-instruct",
};

// Cerebras model mappings
const CEREBRAS_MODEL_MAP: Record<string, string> = {
  [Types.CerebrasModels.Llama_3_3_70B]: "llama3.3-70b",
  [Types.CerebrasModels.Llama_3_1_8B]: "llama3.1-8b",
  [Types.CerebrasModels.Llama_4Scout_17B]: "llama-4-scout-17b-16e-instruct",
  [Types.CerebrasModels.Qwen_3_32B]: "qwen-3-32b",
};

// Cohere model mappings
const COHERE_MODEL_MAP: Record<string, string> = {
  [Types.CohereModels.CommandRPlus]: "command-r-plus",
  [Types.CohereModels.CommandRPlus_202404]: "command-r-plus-04-2024",
  [Types.CohereModels.CommandRPlus_202408]: "command-r-plus-08-2024",
  [Types.CohereModels.CommandR]: "command-r",
  [Types.CohereModels.CommandR_202403]: "command-r-03-2024",
  [Types.CohereModels.CommandR_202408]: "command-r-08-2024",
  [Types.CohereModels.CommandR7B_202412]: "command-r7b-12-2024",
  [Types.CohereModels.CommandA]: "command-a-03-2025",
  [Types.CohereModels.CommandA_202503]: "command-a-03-2025",
};

// Mistral model mappings
const MISTRAL_MODEL_MAP: Record<string, string> = {
  [Types.MistralModels.MistralEmbed]: "mistral-embed",
  [Types.MistralModels.PixtralLarge]: "pixtral-large-latest",
  [Types.MistralModels.Pixtral_12B_2409]: "pixtral-12b-2409",
  [Types.MistralModels.MistralNemo]: "open-mistral-nemo",
  [Types.MistralModels.MistralSmall]: "mistral-small-latest",
  [Types.MistralModels.MistralMedium]: "mistral-medium-latest",
  [Types.MistralModels.MistralLarge]: "mistral-large-latest",
};

// Bedrock model mappings
// Note: These use "us." prefix for us-east-2 region. For other regions,
// use the modelName field in specification to override with correct region prefix
const BEDROCK_MODEL_MAP: Record<string, string> = {
  [Types.BedrockModels.NovaPremier]: "us.amazon.nova-premier-v1:0",
  [Types.BedrockModels.NovaPro]: "us.amazon.nova-pro-v1:0",
  [Types.BedrockModels.Claude_3_7Sonnet]:
    "us.anthropic.claude-3-7-sonnet-20250219-v1:0",
  [Types.BedrockModels.Llama_4Scout_17B]:
    "us.meta.llama4-scout-17b-instruct-v1:0",
  [Types.BedrockModels.Llama_4Maverick_17B]:
    "us.meta.llama4-maverick-17b-instruct-v1:0",
};

// Deepseek model mappings (uses OpenAI-compatible API)
const DEEPSEEK_MODEL_MAP: Record<string, string> = {
  [Types.DeepseekModels.Chat]: "deepseek-chat",
  [Types.DeepseekModels.Reasoner]: "deepseek-reasoner",
};

// xAI model mappings
const XAI_MODEL_MAP: Record<string, string> = {
  [Types.XaiModels.Grok_4]: "grok-4",
  [Types.XaiModels.Grok_3]: "grok-3",
  [Types.XaiModels.Grok_3Mini]: "grok-3-mini",
};

/**
 * Get the actual model name for a given specification
 * @param specification - The Graphlit specification object
 * @returns The SDK-compatible model name
 */
export function getModelName(specification: any): string | undefined {
  const serviceType = specification?.serviceType;

  // Check for custom model names first
  if (specification?.openAI?.modelName) {
    return specification.openAI.modelName;
  }
  if (specification?.anthropic?.modelName) {
    return specification.anthropic.modelName;
  }
  if (specification?.google?.modelName) {
    return specification.google.modelName;
  }
  if (specification?.groq?.modelName) {
    return specification.groq.modelName;
  }
  if (specification?.cerebras?.modelName) {
    return specification.cerebras.modelName;
  }
  if (specification?.cohere?.modelName) {
    return specification.cohere.modelName;
  }
  if (specification?.mistral?.modelName) {
    return specification.mistral.modelName;
  }
  if (specification?.bedrock?.modelName) {
    return specification.bedrock.modelName;
  }
  if (specification?.deepseek?.modelName) {
    return specification.deepseek.modelName;
  }
  if (specification?.xai?.modelName) {
    return specification.xai.modelName;
  }

  // Map based on service type and model enum
  switch (serviceType) {
    case Types.ModelServiceTypes.OpenAi:
      const openAIModel = specification?.openAI?.model;
      return openAIModel ? OPENAI_MODEL_MAP[openAIModel] : undefined;

    case Types.ModelServiceTypes.Anthropic:
      const anthropicModel = specification?.anthropic?.model;
      return anthropicModel ? ANTHROPIC_MODEL_MAP[anthropicModel] : undefined;

    case Types.ModelServiceTypes.Google:
      const googleModel = specification?.google?.model;
      return googleModel ? GOOGLE_MODEL_MAP[googleModel] : undefined;

    case Types.ModelServiceTypes.Groq:
      const groqModel = specification?.groq?.model;
      return groqModel ? GROQ_MODEL_MAP[groqModel] : undefined;

    case Types.ModelServiceTypes.Cerebras:
      const cerebrasModel = specification?.cerebras?.model;
      return cerebrasModel ? CEREBRAS_MODEL_MAP[cerebrasModel] : undefined;

    case Types.ModelServiceTypes.Cohere:
      const cohereModel = specification?.cohere?.model;
      return cohereModel ? COHERE_MODEL_MAP[cohereModel] : undefined;

    case Types.ModelServiceTypes.Mistral:
      const mistralModel = specification?.mistral?.model;
      return mistralModel ? MISTRAL_MODEL_MAP[mistralModel] : undefined;

    case Types.ModelServiceTypes.Bedrock:
      // For Bedrock, we use the bedrock model field
      const bedrockModel = specification?.bedrock?.model;
      return bedrockModel ? BEDROCK_MODEL_MAP[bedrockModel] : undefined;

    case Types.ModelServiceTypes.Deepseek:
      const deepseekModel = specification?.deepseek?.model;
      return deepseekModel ? DEEPSEEK_MODEL_MAP[deepseekModel] : undefined;

    case Types.ModelServiceTypes.Xai:
      const xaiModel = specification?.xai?.model;
      return xaiModel ? XAI_MODEL_MAP[xaiModel] : undefined;

    default:
      return undefined;
  }
}

/**
 * Check if a service type supports streaming
 * @param serviceType - The model service type
 * @returns True if streaming is supported
 */
export function isStreamingSupported(serviceType?: string): boolean {
  const streamingServices = [
    Types.ModelServiceTypes.OpenAi,
    Types.ModelServiceTypes.Anthropic,
    Types.ModelServiceTypes.Google,
    Types.ModelServiceTypes.Groq,
    Types.ModelServiceTypes.Cerebras,
    Types.ModelServiceTypes.Cohere,
    Types.ModelServiceTypes.Mistral,
    Types.ModelServiceTypes.Bedrock,
    Types.ModelServiceTypes.Deepseek,
    Types.ModelServiceTypes.Xai,
  ];

  return streamingServices.includes(serviceType as Types.ModelServiceTypes);
}

/**
 * Get the service type from specification
 * @param specification - The specification object
 * @returns The service type string
 */
export function getServiceType(specification: any): string | undefined {
  return specification?.serviceType;
}

/**
 * Get the model enum value from specification
 * @param specification - The specification object
 * @returns The model enum value
 */
export function getModelEnum(specification: any): string | undefined {
  const serviceType = specification?.serviceType;

  switch (serviceType) {
    case Types.ModelServiceTypes.OpenAi:
      return specification?.openAI?.model;
    case Types.ModelServiceTypes.Anthropic:
      return specification?.anthropic?.model;
    case Types.ModelServiceTypes.Google:
      return specification?.google?.model;
    case Types.ModelServiceTypes.Groq:
      return specification?.groq?.model;
    case Types.ModelServiceTypes.Cerebras:
      return specification?.cerebras?.model;
    case Types.ModelServiceTypes.Cohere:
      return specification?.cohere?.model;
    case Types.ModelServiceTypes.Mistral:
      return specification?.mistral?.model;
    case Types.ModelServiceTypes.Bedrock:
      return specification?.bedrock?.model;
    case Types.ModelServiceTypes.Deepseek:
      return specification?.deepseek?.model;
    case Types.ModelServiceTypes.Xai:
      return specification?.xai?.model;
    default:
      return undefined;
  }
}

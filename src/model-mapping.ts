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
  
  // O1 models
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
  [Types.AnthropicModels.Claude_3_5Sonnet]: "claude-3-5-sonnet-20241022",
  [Types.AnthropicModels.Claude_3_5Sonnet_20240620]: "claude-3-5-sonnet-20240620",
  [Types.AnthropicModels.Claude_3_5Sonnet_20241022]: "claude-3-5-sonnet-20241022",
  [Types.AnthropicModels.Claude_3_5Haiku]: "claude-3-5-haiku-20241022",
  [Types.AnthropicModels.Claude_3_5Haiku_20241022]: "claude-3-5-haiku-20241022",
  
  // Claude 3.7 models
  [Types.AnthropicModels.Claude_3_7Sonnet]: "claude-3-7-sonnet-20250219",
  [Types.AnthropicModels.Claude_3_7Sonnet_20250219]: "claude-3-7-sonnet-20250219",
  
  // Claude 4 models
  [Types.AnthropicModels.Claude_4Opus]: "claude-4-opus-20250514",
  [Types.AnthropicModels.Claude_4Sonnet]: "claude-4-sonnet-20250514",
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
  
  // Gemini 2.5 models
  [Types.GoogleModels.Gemini_2_5FlashPreview]: "gemini-2.5-flash-preview-05-20",
  [Types.GoogleModels.Gemini_2_5ProPreview]: "gemini-2.5-pro-preview-06-05",
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

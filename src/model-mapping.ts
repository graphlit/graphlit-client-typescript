import * as Types from "./generated/graphql-types.js";

/**
 * Model mapping utilities to convert Graphlit specification enums
 * to actual model names used by LLM SDKs
 */

// OpenAI model mappings
const OPENAI_MODEL_MAP: Record<string, string> = {
  [Types.OpenAiModels.Gpt4]: "gpt-4",
  [Types.OpenAiModels.Gpt4Turbo_128K]: "gpt-4-turbo",
  [Types.OpenAiModels.Gpt4O_128K]: "gpt-4o",
  [Types.OpenAiModels.Gpt4OMini_128K]: "gpt-4o-mini",
  [Types.OpenAiModels.Gpt4OChat_128K]: "chatgpt-4o-latest",
  [Types.OpenAiModels.Gpt35Turbo]: "gpt-3.5-turbo",
  [Types.OpenAiModels.Gpt35Turbo_16K]: "gpt-3.5-turbo-16k",
  [Types.OpenAiModels.Gpt41_1024K]: "gpt-4.1",
  [Types.OpenAiModels.Gpt41Mini_1024K]: "gpt-4.1-mini",
  [Types.OpenAiModels.Gpt41Nano_1024K]: "gpt-4.1-nano",
  [Types.OpenAiModels.O3Mini_200K]: "o3-mini",
  [Types.OpenAiModels.O3_200K]: "o3",
  [Types.OpenAiModels.O4Mini_200K]: "o4-mini",
};

// Anthropic model mappings
const ANTHROPIC_MODEL_MAP: Record<string, string> = {
  [Types.AnthropicModels.Claude_3Opus]: "claude-3-opus-20240229",
  [Types.AnthropicModels.Claude_3Sonnet]: "claude-3-sonnet-20240229",
  [Types.AnthropicModels.Claude_3Haiku]: "claude-3-haiku-20240307",
  [Types.AnthropicModels.Claude_3_5Sonnet]: "claude-3-5-sonnet-20241022",
  [Types.AnthropicModels.Claude_3_5Haiku]: "claude-3-5-haiku-20241022",
  [Types.AnthropicModels.Claude_3_7Sonnet]: "claude-3-7-sonnet-20250219",
  [Types.AnthropicModels.Claude_4Opus]: "claude-4-opus-20250514",
  [Types.AnthropicModels.Claude_4Sonnet]: "claude-4-sonnet-20250514",
};

// Google model mappings
const GOOGLE_MODEL_MAP: Record<string, string> = {
  [Types.GoogleModels.Gemini_1_5Pro]: "gemini-1.5-pro",
  [Types.GoogleModels.Gemini_1_5Flash]: "gemini-1.5-flash",
  [Types.GoogleModels.Gemini_1_5Flash_8B]: "gemini-1.5-flash-8b",
  [Types.GoogleModels.Gemini_2_0Flash]: "gemini-2.0-flash-exp",
  [Types.GoogleModels.Gemini_2_0FlashExperimental]: "gemini-2.0-flash-exp",
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

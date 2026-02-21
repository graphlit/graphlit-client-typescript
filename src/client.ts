import jwt from "jsonwebtoken";

// Apollo core (React-free) - ESM import
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
  ApolloError,
} from "@apollo/client/core/index.js";

// Apollo retry link for resilient error handling
import { RetryLink } from "@apollo/client/link/retry/index.js";

// Additional Apollo types
import type {
  OperationVariables,
  ApolloQueryResult,
  FetchResult,
  NormalizedCacheObject,
} from "@apollo/client/core/index.js";

import { DocumentNode, GraphQLFormattedError } from "graphql";
import { attachPartialErrors } from "./partial-errors.js";
import * as Types from "./generated/graphql-types.js";
import * as Documents from "./generated/graphql-documents.js";
import { getServiceType, getModelName, getModelEnum } from "./model-mapping.js";
import {
  AgentOptions,
  AgentResult,
  ArtifactCollector,
  ContextManagementAction,
  ContextStrategy,
  StreamAgentOptions,
  ToolCallResult,
  ToolHandler,
  AgentMetrics,
  UsageInfo,
} from "./types/agent.js";
import {
  TokenBudgetTracker,
  truncateToolResult,
  windowToolRounds,
  estimateTokens,
  DEFAULT_CONTEXT_STRATEGY,
} from "./helpers/context-management.js";
import { AgentStreamEvent } from "./types/ui-events.js";
import { UIEventAdapter } from "./streaming/ui-event-adapter.js";
import {
  formatMessagesForOpenAI,
  formatMessagesForAnthropic,
  formatMessagesForGoogle,
  formatMessagesForMistral,
  formatMessagesForBedrock,
  OpenAIMessage,
  AnthropicMessage,
  GoogleMessage,
  CohereMessage,
  MistralMessage,
  BedrockMessage,
} from "./streaming/llm-formatters.js";
import {
  streamWithOpenAI,
  streamWithAnthropic,
  streamWithGoogle,
  streamWithGroq,
  streamWithCerebras,
  streamWithCohere,
  streamWithMistral,
  streamWithBedrock,
  streamWithDeepseek,
  streamWithXai,
} from "./streaming/providers.js";
// Optional imports for streaming LLM clients
// These are peer dependencies and may not be installed
// We need to use createRequire for optional dependencies to avoid build errors
import { createRequire } from "node:module";
const optionalRequire = createRequire(import.meta.url);

let OpenAI: typeof import("openai").default | undefined;
let Anthropic: typeof import("@anthropic-ai/sdk").default | undefined;
let GoogleGenAI: typeof import("@google/genai").GoogleGenAI | undefined;
let Groq: typeof import("groq-sdk").default | undefined;
let CohereClient: typeof import("cohere-ai").CohereClient | undefined;
let CohereClientV2: typeof import("cohere-ai").CohereClientV2 | undefined;
let Mistral: typeof import("@mistralai/mistralai").Mistral | undefined;
let BedrockRuntimeClient:
  | typeof import("@aws-sdk/client-bedrock-runtime").BedrockRuntimeClient
  | undefined;
let Cerebras: typeof import("@cerebras/cerebras_cloud_sdk").default | undefined;

try {
  OpenAI = optionalRequire("openai").default || optionalRequire("openai");
  if (process.env.DEBUG_GRAPHLIT_SDK_INITIALIZATION) {
    console.log("[SDK Loading] OpenAI SDK loaded successfully");
  }
} catch (e: any) {
  // OpenAI not installed
  if (process.env.DEBUG_GRAPHLIT_SDK_INITIALIZATION) {
    console.log("[SDK Loading] OpenAI SDK not found:", e.message);
  }
}

try {
  Anthropic =
    optionalRequire("@anthropic-ai/sdk").default ||
    optionalRequire("@anthropic-ai/sdk");
  if (process.env.DEBUG_GRAPHLIT_SDK_INITIALIZATION) {
    console.log("[SDK Loading] Anthropic SDK loaded successfully");
  }
} catch (e: any) {
  // Anthropic SDK not installed
  if (process.env.DEBUG_GRAPHLIT_SDK_INITIALIZATION) {
    console.log("[SDK Loading] Anthropic SDK not found:", e.message);
  }
}

try {
  GoogleGenAI = optionalRequire("@google/genai").GoogleGenAI;
  if (process.env.DEBUG_GRAPHLIT_SDK_INITIALIZATION) {
    console.log("[SDK Loading] Google Gen AI SDK loaded successfully");
  }
} catch (e: any) {
  // Google Gen AI not installed
  if (process.env.DEBUG_GRAPHLIT_SDK_INITIALIZATION) {
    console.log("[SDK Loading] Google Gen AI SDK not found:", e.message);
  }
}

try {
  Groq = optionalRequire("groq-sdk").default || optionalRequire("groq-sdk");
  if (process.env.DEBUG_GRAPHLIT_SDK_INITIALIZATION) {
    console.log("[SDK Loading] Groq SDK loaded successfully");
  }
} catch (e: any) {
  // Groq SDK not installed
  if (process.env.DEBUG_GRAPHLIT_SDK_INITIALIZATION) {
    console.log("[SDK Loading] Groq SDK not found:", e.message);
  }
}

try {
  CohereClient = optionalRequire("cohere-ai").CohereClient;
  CohereClientV2 = optionalRequire("cohere-ai").CohereClientV2;
  if (process.env.DEBUG_GRAPHLIT_SDK_INITIALIZATION) {
    console.log("[SDK Loading] Cohere SDK loaded successfully");
  }
} catch (e: any) {
  // Cohere SDK not installed
  if (process.env.DEBUG_GRAPHLIT_SDK_INITIALIZATION) {
    console.log("[SDK Loading] Cohere SDK not found:", e.message);
  }
}

try {
  Mistral = optionalRequire("@mistralai/mistralai").Mistral;
  if (process.env.DEBUG_GRAPHLIT_SDK_INITIALIZATION) {
    console.log("[SDK Loading] Mistral SDK loaded successfully");
  }
} catch (e: any) {
  // Mistral SDK not installed
  if (process.env.DEBUG_GRAPHLIT_SDK_INITIALIZATION) {
    console.log("[SDK Loading] Mistral SDK not found:", e.message);
  }
}

try {
  BedrockRuntimeClient = optionalRequire(
    "@aws-sdk/client-bedrock-runtime",
  ).BedrockRuntimeClient;
  if (process.env.DEBUG_GRAPHLIT_SDK_INITIALIZATION) {
    console.log("[SDK Loading] Bedrock SDK loaded successfully");
  }
} catch (e: any) {
  // Bedrock SDK not installed
  if (process.env.DEBUG_GRAPHLIT_SDK_INITIALIZATION) {
    console.log("[SDK Loading] Bedrock SDK not found:", e.message);
  }
}

try {
  Cerebras =
    optionalRequire("@cerebras/cerebras_cloud_sdk").default ||
    optionalRequire("@cerebras/cerebras_cloud_sdk");
  if (process.env.DEBUG_GRAPHLIT_SDK_INITIALIZATION) {
    console.log("[SDK Loading] Cerebras SDK loaded successfully");
  }
} catch (e: any) {
  // Cerebras SDK not installed
  if (process.env.DEBUG_GRAPHLIT_SDK_INITIALIZATION) {
    console.log("[SDK Loading] Cerebras SDK not found:", e.message);
  }
}

const DEFAULT_MAX_TOOL_ROUNDS: number = 100;

// Smooth streaming buffer implementation

// Helper to create smooth event handler

// Re-export agent types
export type {
  AgentOptions,
  AgentResult,
  ArtifactCollector,
  ContextStrategy,
  ContextManagementAction,
  StreamAgentOptions,
  ToolCallResult,
  UsageInfo,
  AgentError,
} from "./types/agent.js";

// Re-export context management utilities
export {
  TokenBudgetTracker,
  truncateToolResult,
  estimateTokens,
  isAccurateTokenCounting,
} from "./helpers/context-management.js";

// Re-export UI event types
export type { AgentStreamEvent } from "./types/ui-events.js";

// Retry configuration interface
export interface RetryConfig {
  /** Maximum number of retry attempts (default: 5) */
  maxAttempts?: number;
  /** Initial delay in milliseconds (default: 300) */
  initialDelay?: number;
  /** Maximum delay in milliseconds (default: 30000) */
  maxDelay?: number;
  /** HTTP status codes that should trigger a retry (default: [429, 502, 503, 504]) */
  retryableStatusCodes?: number[];
  /** Whether to use jitter in delay calculation (default: true) */
  jitter?: boolean;
  /** Callback when a retry is attempted */
  onRetry?: (attempt: number, error: any, operation: any) => void;
}

// Client configuration options
export interface GraphlitClientOptions {
  organizationId?: string;
  environmentId?: string;
  jwtSecret?: string;
  ownerId?: string;
  userId?: string;
  apiUri?: string;
  /** Pre-signed JWT token. When provided, jwtSecret is not required. */
  token?: string;
  /** Retry configuration for network errors */
  retryConfig?: RetryConfig;
}

// Helper function to validate GUID format
function isValidGuid(guid: string | undefined): boolean {
  if (!guid) return false;
  // GUID regex pattern: 8-4-4-4-12 hexadecimal characters
  const guidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return guidRegex.test(guid);
}

// Define the Graphlit class
class Graphlit {
  public client: ApolloClient<NormalizedCacheObject> | undefined;
  public token: string | undefined;

  private apiUri: string;
  private organizationId: string | undefined;
  private environmentId: string | undefined;
  private ownerId: string | undefined;
  private userId: string | undefined;
  private jwtSecret: string | undefined;
  private retryConfig: RetryConfig;

  // Streaming client instances (optional - can be provided by user)
  private openaiClient?: any;
  private anthropicClient?: any;
  private googleClient?: any;
  private groqClient?: any;
  private cerebrasClient?: any;
  private cohereClient?: any;
  private mistralClient?: any;
  private bedrockClient?: any;
  private deepseekClient?: any;
  private xaiClient?: any;

  // Serializes streamAgent calls per conversation to prevent race conditions
  // when a user sends a second message before the first response completes.
  private readonly conversationQueues = new Map<string, Promise<void>>();

  constructor(
    organizationIdOrOptions?: string | GraphlitClientOptions,
    environmentId?: string,
    jwtSecret?: string,
    ownerId?: string,
    userId?: string,
    apiUri?: string,
  ) {
    // Handle both old constructor signature and new options object
    let options: GraphlitClientOptions;
    if (
      typeof organizationIdOrOptions === "object" &&
      organizationIdOrOptions !== null
    ) {
      // New constructor with options object
      options = organizationIdOrOptions;
    } else {
      // Legacy constructor with individual parameters
      options = {
        organizationId: organizationIdOrOptions as string,
        environmentId,
        jwtSecret,
        ownerId,
        userId,
        apiUri,
      };
    }

    this.apiUri =
      options.apiUri ||
      (typeof process !== "undefined"
        ? process.env.GRAPHLIT_API_URL
        : undefined) ||
      "https://data-scus.graphlit.io/api/v1/graphql";

    if (typeof process !== "undefined") {
      // Attempt to load dotenv if available (optional dependency)
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require("dotenv").config();
      } catch {
        // dotenv not installed, user must set env vars manually
      }

      this.organizationId =
        options.organizationId || process.env.GRAPHLIT_ORGANIZATION_ID;
      this.environmentId =
        options.environmentId || process.env.GRAPHLIT_ENVIRONMENT_ID;
      this.jwtSecret = options.jwtSecret || process.env.GRAPHLIT_JWT_SECRET;

      // optional: for multi-tenant support
      this.ownerId = options.ownerId || process.env.GRAPHLIT_OWNER_ID;
      this.userId = options.userId || process.env.GRAPHLIT_USER_ID;
    } else {
      this.organizationId = options.organizationId;
      this.environmentId = options.environmentId;
      this.jwtSecret = options.jwtSecret;

      // optional: for multi-tenant support
      this.ownerId = options.ownerId;
      this.userId = options.userId;
    }

    // Set default retry configuration
    this.retryConfig = {
      maxAttempts: 5,
      initialDelay: 300,
      maxDelay: 30000,
      retryableStatusCodes: [429, 500, 502, 503, 504],
      jitter: true,
      ...options.retryConfig,
    };

    // Skip all validation if pre-signed token is provided
    if (!options.token) {
      if (!this.organizationId) {
        throw new Error("Graphlit organization identifier is required.");
      }

      if (!isValidGuid(this.organizationId)) {
        throw new Error(
          `Invalid organization ID format. Expected a valid GUID, but received: '${this.organizationId}'. ` +
            "A valid GUID should be in the format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        );
      }

      if (!this.environmentId) {
        throw new Error("Graphlit environment identifier is required.");
      }

      if (!isValidGuid(this.environmentId)) {
        throw new Error(
          `Invalid environment ID format. Expected a valid GUID, but received: '${this.environmentId}'. ` +
            "A valid GUID should be in the format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        );
      }

      if (!this.jwtSecret) {
        throw new Error("Graphlit environment JWT secret is required.");
      }
    }

    // Validate optional userId if provided (ownerId can be any format)
    if (this.userId && !isValidGuid(this.userId)) {
      throw new Error(
        `Invalid user ID format. Expected a valid GUID, but received: '${this.userId}'. ` +
          "A valid GUID should be in the format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      );
    }

    // If a pre-signed token is provided, use it directly instead of generating one
    if (options.token) {
      this.token = options.token;
      this.initializeClient();
    } else {
      this.refreshClient();
    }
  }

  /**
   * Initialize the Apollo client without regenerating the token.
   * Used when a pre-signed token is provided.
   */
  private initializeClient() {
    this.client = undefined;
    this.setupApolloClient();
  }

  public refreshClient() {
    this.client = undefined;
    this.generateToken();
    this.setupApolloClient();
  }

  private setupApolloClient() {
    const httpLink = createHttpLink({
      uri: this.apiUri,
    });

    // Create retry link with configuration
    const retryLink = new RetryLink({
      delay: {
        initial: this.retryConfig.initialDelay || 300,
        max: this.retryConfig.maxDelay || 30000,
        jitter: this.retryConfig.jitter !== false,
      },
      attempts: {
        max: this.retryConfig.maxAttempts || 5,
        retryIf: (error: any, _operation: any) => {
          // Check if we should retry this error
          if (!error) return false;

          // Check for network errors
          const hasNetworkError = !!error.networkError;
          if (!hasNetworkError) return false;

          // Get status code from different possible locations
          const statusCode =
            error.networkError?.statusCode ||
            error.networkError?.response?.status ||
            error.statusCode;

          // Check if status code is retryable
          if (statusCode && this.retryConfig.retryableStatusCodes) {
            const shouldRetry =
              this.retryConfig.retryableStatusCodes.includes(statusCode);

            // Call onRetry callback if provided
            if (
              shouldRetry &&
              this.retryConfig.onRetry &&
              _operation.getContext().retryCount !== undefined
            ) {
              const attempt = _operation.getContext().retryCount + 1;
              this.retryConfig.onRetry(attempt, error, _operation);
            }

            return shouldRetry;
          }

          // Default: retry on network errors without specific status codes
          return true;
        },
      },
    });

    const authLink = new ApolloLink((operation: any, forward: any) => {
      operation.setContext({
        headers: {
          Authorization: this.token ? `Bearer ${this.token}` : "",
        },
      });

      return forward(operation);
    });

    // Chain links: retry -> auth -> http
    this.client = new ApolloClient({
      link: ApolloLink.from([retryLink, authLink, httpLink]),
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          errorPolicy: "all",
          fetchPolicy: "no-cache",
        },
        query: {
          errorPolicy: "all",
          fetchPolicy: "no-cache",
        },
        mutate: {
          errorPolicy: "all",
          fetchPolicy: "no-cache",
        },
      },
    });
  }

  /**
   * Set a custom OpenAI client instance for streaming
   * @param client - OpenAI client instance (e.g., new OpenAI({ apiKey: "..." }))
   */
  setOpenAIClient(client: any): void {
    this.openaiClient = client;
  }

  /**
   * Set a custom Anthropic client instance for streaming
   * @param client - Anthropic client instance (e.g., new Anthropic({ apiKey: "..." }))
   */
  setAnthropicClient(client: any): void {
    this.anthropicClient = client;
  }

  /**
   * Set a custom Google Generative AI client instance for streaming
   * @param client - Google GenAI client instance (e.g., new GoogleGenAI({apiKey}))
   */
  setGoogleClient(client: any): void {
    this.googleClient = client;
  }

  /**
   * Set a custom Groq client instance for streaming
   * @param client - Groq client instance (e.g., new Groq({ apiKey: "..." }))
   */
  setGroqClient(client: any): void {
    this.groqClient = client;
  }

  /**
   * Set a custom Cerebras client instance for streaming
   * @param client - Cerebras client instance (e.g., new Cerebras({ apiKey: "..." }))
   */
  setCerebrasClient(client: any): void {
    this.cerebrasClient = client;
  }

  /**
   * Set a custom Cohere client instance for streaming
   * @param client - Cohere client instance (e.g., new CohereClient({ token: "..." }))
   */
  setCohereClient(client: any): void {
    this.cohereClient = client;
  }

  /**
   * Set a custom Mistral client instance for streaming
   * @param client - Mistral client instance (e.g., new Mistral({ apiKey: "..." }))
   */
  setMistralClient(client: any): void {
    this.mistralClient = client;
  }

  /**
   * Set a custom Bedrock client instance for streaming
   * @param client - BedrockRuntimeClient instance (e.g., new BedrockRuntimeClient({ region: "us-east-2" }))
   */
  setBedrockClient(client: any): void {
    this.bedrockClient = client;
  }

  /**
   * Set a custom Deepseek client instance for streaming
   * @param client - OpenAI client instance configured for Deepseek (e.g., new OpenAI({ baseURL: "https://api.deepseek.com", apiKey: "..." }))
   */
  setDeepseekClient(client: any): void {
    this.deepseekClient = client;
  }

  /**
   * Set a custom xAI client instance for streaming
   * @param client - OpenAI client instance configured for xAI (e.g., new OpenAI({ baseURL: "https://api.x.ai/v1", apiKey: "..." }))
   */
  setXaiClient(client: any): void {
    this.xaiClient = client;
  }

  /**
   * Update retry configuration and refresh the Apollo client
   * @param retryConfig - New retry configuration
   */
  setRetryConfig(retryConfig: RetryConfig): void {
    this.retryConfig = {
      ...this.retryConfig,
      ...retryConfig,
    };
    // Refresh client to apply new retry configuration
    this.refreshClient();
  }

  private generateToken() {
    if (!this.jwtSecret) {
      throw new Error("Graphlit environment JWT secret is required.");
    }

    const expiration = Math.floor(Date.now() / 1000) + 24 * 60 * 60; // one day from now

    const payload = {
      "https://graphlit.io/jwt/claims": {
        "x-graphlit-organization-id": this.organizationId,
        "x-graphlit-environment-id": this.environmentId,
        ...(this.ownerId && { "x-graphlit-owner-id": this.ownerId }),
        ...(this.userId && { "x-graphlit-user-id": this.userId }),
        "x-graphlit-role": "Owner",
      },
      exp: expiration,
      iss: "graphlit",
      aud: "https://portal.graphlit.io",
    };

    this.token = jwt.sign(payload, this.jwtSecret, { algorithm: "HS256" });
  }

  /**
   * Fetch current project.
   * @returns The project.
   */
  public async getProject(): Promise<Types.GetProjectQuery> {
    return this.queryAndCheckError<
      Types.GetProjectQuery,
      Types.GetProjectQueryVariables
    >(Documents.GetProject, {});
  }

  /**
   * Updates a project.
   * @param project - The project to update.
   * @returns The updated project.
   */
  public async updateProject(
    project: Types.ProjectUpdateInput,
  ): Promise<Types.UpdateProjectMutation> {
    return this.mutateAndCheckError<
      Types.UpdateProjectMutation,
      Types.UpdateProjectMutationVariables
    >(Documents.UpdateProject, { project: project });
  }

  /**
   * Lookup usage records given tenant correlation identifier.
   * @param correlationId - The tenant correlation identifier.
   * @param startDate - The start date of records to be returned, optional. Defaults to last 30 days.
   * @param duration - The duration of records to be returned, optional. Defaults to last 30 days.
   * @returns The project usage records.
   */
  public async lookupProjectUsage(
    correlationId: string,
    startDate?: Types.Scalars["DateTime"]["input"],
    duration?: Types.Scalars["TimeSpan"]["input"],
  ): Promise<Types.LookupUsageQuery> {
    return this.queryAndCheckError<
      Types.LookupUsageQuery,
      Types.LookupUsageQueryVariables
    >(Documents.LookupUsage, {
      correlationId: correlationId,
      startDate: startDate,
      duration: duration,
    });
  }

  /**
   * Lookup credit usage given tenant correlation identifier.
   * @param correlationId - The tenant correlation identifier.
   * @param startDate - The start date of records to be returned, optional. Defaults to last 30 days.
   * @param duration - The duration of records to be returned, optional. Defaults to last 30 days.
   * @returns The project credits.
   */
  public async lookupProjectCredits(
    correlationId: string,
    startDate?: Types.Scalars["DateTime"]["input"],
    duration?: Types.Scalars["TimeSpan"]["input"],
  ): Promise<Types.LookupCreditsQuery> {
    return this.queryAndCheckError<
      Types.LookupCreditsQuery,
      Types.LookupCreditsQueryVariables
    >(Documents.LookupCredits, {
      correlationId: correlationId,
      startDate: startDate,
      duration: duration,
    });
  }

  /**
   * Retrieves project tokens.
   * @param startDate - The start date of tokens to be returned.
   * @param duration - The duration of tokens to be returned.
   * @returns The project tokens.
   */
  public async queryProjectTokens(
    startDate: Types.Scalars["DateTime"]["input"],
    duration: Types.Scalars["TimeSpan"]["input"],
  ): Promise<Types.QueryTokensQuery> {
    return this.queryAndCheckError<
      Types.QueryTokensQuery,
      Types.QueryTokensQueryVariables
    >(Documents.QueryTokens, { startDate: startDate, duration: duration });
  }

  /**
   * Retrieves project usage.
   * @param startDate - The start date of records to be returned.
   * @param duration - The duration of records to be returned.
   * @param names - Filter by allowed usage record names, defaults to 'GraphQL'.
   * @param excludedNames - Filter by excluded usage record names.
   * @param offset - The offset to the records to be returned, defaults to 0.
   * @param limit - The number of records to be returned, defaults to 1000.
   * @returns The project usage records.
   */
  public async queryProjectUsage(
    startDate: Types.Scalars["DateTime"]["input"],
    duration: Types.Scalars["TimeSpan"]["input"],
    names?: string[],
    excludedNames?: string[],
    offset?: Types.Scalars["Int"]["input"],
    limit?: Types.Scalars["Int"]["input"],
  ): Promise<Types.QueryUsageQuery> {
    return this.queryAndCheckError<
      Types.QueryUsageQuery,
      Types.QueryUsageQueryVariables
    >(Documents.QueryUsage, {
      startDate: startDate,
      duration: duration,
      names: names,
      excludedNames: excludedNames,
      offset: offset,
      limit: limit,
    });
  }

  /**
   * Retrieves project credits.
   * @param startDate - The start date of credits to be returned.
   * @param duration - The duration of credits to be returned.
   * @returns The project credits.
   */
  public async queryProjectCredits(
    startDate: Types.Scalars["DateTime"]["input"],
    duration: Types.Scalars["TimeSpan"]["input"],
  ): Promise<Types.QueryCreditsQuery> {
    return this.queryAndCheckError<
      Types.QueryCreditsQuery,
      Types.QueryCreditsQueryVariables
    >(Documents.QueryCredits, { startDate: startDate, duration: duration });
  }

  /**
   * Sends a notification.
   * @param connector - The integration connector used to send the notification.
   * @param text - The notification text.
   * @param textType - The text type, optional.
   * @returns The result of the notification.
   */
  public async sendNotification(
    connector: Types.IntegrationConnectorInput,
    text: string,
    textType?: Types.TextTypes,
  ): Promise<Types.SendNotificationMutation> {
    return this.mutateAndCheckError<
      Types.SendNotificationMutation,
      Types.SendNotificationMutationVariables
    >(Documents.SendNotification, {
      connector: connector,
      text: text,
      textType: textType,
    });
  }

  /**
   * Enumerates the web pages at or beneath the provided URL using web sitemap.
   * @param uri - The URI of the web page to be mapped.
   * @param allowedPaths - The list of regular expressions for URL paths to be crawled, i.e. "^\/public\/blogs\/.*".
   * @param excludedPaths - The list of regular expressions for URL paths to not be crawled, i.e. "^\/internal\/private\/.*".
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The mapped URIs.
   */
  public async mapWeb(
    uri: string,
    allowedPaths?: string[],
    excludedPaths?: string[],
    correlationId?: string,
  ): Promise<Types.MapWebQuery> {
    return this.queryAndCheckError<
      Types.MapWebQuery,
      Types.MapWebQueryVariables
    >(Documents.MapWeb, {
      uri: uri,
      allowedPaths: allowedPaths,
      excludedPaths: excludedPaths,
      correlationId: correlationId,
    });
  }

  /**
   * Searches the web based on the provided properties.
   * @param text - The web search text.
   * @param service - The web search service type, defaults to Tavily.
   * @param limit - The number of web search results to be returned, defaults to 10.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The web search results.
   */
  public async searchWeb(
    text: string,
    service?: Types.SearchServiceTypes,
    limit?: number,
    correlationId?: string,
  ): Promise<Types.SearchWebQuery> {
    return this.queryAndCheckError<
      Types.SearchWebQuery,
      Types.SearchWebQueryVariables
    >(Documents.SearchWeb, {
      text: text,
      service: service,
      limit: limit,
      correlationId: correlationId,
    });
  }

  /**
   * Creates an alert.
   * @param alert - The alert to create.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The created alert.
   */
  public async createAlert(
    alert: Types.AlertInput,
    correlationId?: string,
  ): Promise<Types.CreateAlertMutation> {
    return this.mutateAndCheckError<
      Types.CreateAlertMutation,
      Types.CreateAlertMutationVariables
    >(Documents.CreateAlert, { alert: alert, correlationId: correlationId });
  }

  /**
   * Updates an alert.
   * @param alert - The alert to update.
   * @returns The updated alert.
   */
  public async updateAlert(
    alert: Types.AlertUpdateInput,
  ): Promise<Types.UpdateAlertMutation> {
    return this.mutateAndCheckError<
      Types.UpdateAlertMutation,
      Types.UpdateAlertMutationVariables
    >(Documents.UpdateAlert, { alert: alert });
  }

  /**
   * Creates or updates an alert.
   * @param alert - The alert to create or update.
   * @returns The created or updated alert.
   */
  public async upsertAlert(
    alert: Types.AlertInput,
  ): Promise<Types.UpsertAlertMutation> {
    return this.mutateAndCheckError<
      Types.UpsertAlertMutation,
      Types.UpsertAlertMutationVariables
    >(Documents.UpsertAlert, { alert: alert });
  }

  /**
   * Deletes an alert.
   * @param id - The ID of the alert to delete.
   * @returns The deleted alert.
   */
  public async deleteAlert(id: string): Promise<Types.DeleteAlertMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAlertMutation,
      Types.DeleteAlertMutationVariables
    >(Documents.DeleteAlert, { id: id });
  }

  /**
   * Deletes multiple alerts.
   * @param ids - The IDs of the alerts to delete.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @returns The deleted alerts.
   */
  public async deleteAlerts(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteAlertsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAlertsMutation,
      Types.DeleteAlertsMutationVariables
    >(Documents.DeleteAlerts, { ids: ids, isSynchronous: isSynchronous });
  }

  /**
   * Deletes all alerts based on the provided filter criteria.
   * @param filter - The filter criteria to apply when deleting alerts.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The result of the deletion.
   */
  public async deleteAllAlerts(
    filter?: Types.AlertFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllAlertsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllAlertsMutation,
      Types.DeleteAllAlertsMutationVariables
    >(Documents.DeleteAllAlerts, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  /**
   * Enables an alert.
   * @param id - The ID of the alert to enable.
   * @returns The enabled alert.
   */
  public async enableAlert(id: string): Promise<Types.EnableAlertMutation> {
    return this.mutateAndCheckError<
      Types.EnableAlertMutation,
      Types.EnableAlertMutationVariables
    >(Documents.EnableAlert, { id: id });
  }

  /**
   * Disables an alert.
   * @param id - The ID of the alert to disable.
   * @returns The disabled alert.
   */
  public async disableAlert(id: string): Promise<Types.DisableAlertMutation> {
    return this.mutateAndCheckError<
      Types.DisableAlertMutation,
      Types.DisableAlertMutationVariables
    >(Documents.DisableAlert, { id: id });
  }

  /**
   * Lookup an alert given its ID.
   * @param id - ID of the alert.
   * @returns The alert.
   */
  public async getAlert(id: string): Promise<Types.GetAlertQuery> {
    return this.queryAndCheckError<
      Types.GetAlertQuery,
      Types.GetAlertQueryVariables
    >(Documents.GetAlert, { id: id });
  }

  /**
   * Retrieves alerts based on the provided filter criteria.
   * @param filter - The filter criteria to apply when retrieving alerts.
   * @returns The alerts.
   */
  public async queryAlerts(
    filter?: Types.AlertFilter,
  ): Promise<Types.QueryAlertsQuery> {
    return this.queryAndCheckError<
      Types.QueryAlertsQuery,
      Types.QueryAlertsQueryVariables
    >(Documents.QueryAlerts, { filter: filter });
  }

  /**
   * Counts alerts based on the provided filter criteria.
   * @param filter - The filter criteria to apply when counting alerts.
   * @returns The count of alerts.
   */
  public async countAlerts(
    filter?: Types.AlertFilter,
  ): Promise<Types.CountAlertsQuery> {
    return this.queryAndCheckError<
      Types.CountAlertsQuery,
      Types.CountAlertsQueryVariables
    >(Documents.CountAlerts, { filter: filter });
  }

  /**
   * Creates a fact.
   * @param fact - The fact to create.
   * @returns The created fact.
   */
  public async createFact(
    fact: Types.FactInput,
  ): Promise<Types.CreateFactMutation> {
    return this.mutateAndCheckError<
      Types.CreateFactMutation,
      Types.CreateFactMutationVariables
    >(Documents.CreateFact, { fact: fact });
  }

  /**
   * Updates a fact.
   * @param fact - The fact to update.
   * @returns The updated fact.
   */
  public async updateFact(
    fact: Types.FactUpdateInput,
  ): Promise<Types.UpdateFactMutation> {
    return this.mutateAndCheckError<
      Types.UpdateFactMutation,
      Types.UpdateFactMutationVariables
    >(Documents.UpdateFact, { fact: fact });
  }

  /**
   * Deletes a fact.
   * @param id - The ID of the fact to delete.
   * @returns The deleted fact.
   */
  public async deleteFact(id: string): Promise<Types.DeleteFactMutation> {
    return this.mutateAndCheckError<
      Types.DeleteFactMutation,
      Types.DeleteFactMutationVariables
    >(Documents.DeleteFact, { id: id });
  }

  /**
   * Deletes multiple facts.
   * @param ids - The IDs of the facts to delete.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @returns The deleted facts.
   */
  public async deleteFacts(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteFactsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteFactsMutation,
      Types.DeleteFactsMutationVariables
    >(Documents.DeleteFacts, { ids: ids, isSynchronous: isSynchronous });
  }

  /**
   * Deletes all facts based on the provided filter criteria.
   * @param filter - The filter criteria to apply when deleting facts.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The result of the deletion.
   */
  public async deleteAllFacts(
    filter?: Types.FactFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllFactsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllFactsMutation,
      Types.DeleteAllFactsMutationVariables
    >(Documents.DeleteAllFacts, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  /**
   * Lookup a fact given its ID.
   * @param id - ID of the fact.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The fact.
   */
  public async getFact(
    id: string,
    correlationId?: string,
  ): Promise<Types.GetFactQuery> {
    return this.queryAndCheckError<
      Types.GetFactQuery,
      Types.GetFactQueryVariables
    >(Documents.GetFact, { id: id, correlationId: correlationId });
  }

  /**
   * Retrieves facts based on the provided filter criteria.
   * @param filter - The filter criteria to apply when retrieving facts.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The facts.
   */
  public async queryFacts(
    filter?: Types.FactFilter,
    correlationId?: string,
  ): Promise<Types.QueryFactsQuery> {
    return this.queryAndCheckError<
      Types.QueryFactsQuery,
      Types.QueryFactsQueryVariables
    >(Documents.QueryFacts, { filter: filter, correlationId: correlationId });
  }

  /**
   * Retrieves facts as a knowledge graph.
   * @param filter - The filter criteria to apply when retrieving facts, optional.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The facts graph with nodes and edges.
   */
  public async queryFactsGraph(
    filter?: Types.FactFilter,
    correlationId?: string,
  ): Promise<Types.QueryFactsGraphQuery> {
    return this.queryAndCheckError<
      Types.QueryFactsGraphQuery,
      Types.QueryFactsGraphQueryVariables
    >(Documents.QueryFactsGraph, {
      filter: filter,
      graph: {
        /* return everything */
      },
      correlationId: correlationId,
    });
  }

  /**
   * Retrieves facts with clustering.
   * @param filter - The filter criteria to apply when retrieving facts, optional.
   * @param clusters - The clustering input parameters, optional.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The facts with clusters.
   */
  public async queryFactsClusters(
    filter?: Types.FactFilter,
    clusters?: Types.EntityClustersInput,
    correlationId?: string,
  ): Promise<Types.QueryFactsClustersQuery> {
    return this.queryAndCheckError<
      Types.QueryFactsClustersQuery,
      Types.QueryFactsClustersQueryVariables
    >(Documents.QueryFactsClusters, {
      filter: filter,
      clusters: clusters,
      correlationId: correlationId,
    });
  }

  /**
   * Counts facts based on the provided filter criteria.
   * @param filter - The filter criteria to apply when counting facts.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The count of facts.
   */
  public async countFacts(
    filter?: Types.FactFilter,
    correlationId?: string,
  ): Promise<Types.CountFactsQuery> {
    return this.queryAndCheckError<
      Types.CountFactsQuery,
      Types.CountFactsQueryVariables
    >(Documents.CountFacts, { filter: filter, correlationId: correlationId });
  }

  /**
   * Creates a collection.
   * @param collection - The collection to create.
   * @returns The created collection.
   */
  public async createCollection(
    collection: Types.CollectionInput,
  ): Promise<Types.CreateCollectionMutation> {
    return this.mutateAndCheckError<
      Types.CreateCollectionMutation,
      Types.CreateCollectionMutationVariables
    >(Documents.CreateCollection, { collection: collection });
  }

  /**
   * Updates a collection.
   * @param collection - The collection to update.
   * @returns The updated collection.
   */
  public async updateCollection(
    collection: Types.CollectionUpdateInput,
  ): Promise<Types.UpdateCollectionMutation> {
    return this.mutateAndCheckError<
      Types.UpdateCollectionMutation,
      Types.UpdateCollectionMutationVariables
    >(Documents.UpdateCollection, { collection: collection });
  }

  /**
   * Deletes a collection.
   * @param id - The ID of the collection to delete.
   * @returns The deleted collection.
   */
  public async deleteCollection(
    id: string,
  ): Promise<Types.DeleteCollectionMutation> {
    return this.mutateAndCheckError<
      Types.DeleteCollectionMutation,
      Types.DeleteCollectionMutationVariables
    >(Documents.DeleteCollection, { id: id });
  }

  /**
   * Deletes multiple collections.
   * @param ids - The IDs of the collections to delete.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @returns The deleted collections.
   */
  public async deleteCollections(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteCollectionsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteCollectionsMutation,
      Types.DeleteCollectionsMutationVariables
    >(Documents.DeleteCollections, { ids: ids, isSynchronous: isSynchronous });
  }

  /**
   * Deletes all collections based on the provided filter criteria.
   * @param filter - The filter criteria to apply when deleting collections.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The result of the deletion.
   */
  public async deleteAllCollections(
    filter?: Types.CollectionFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllCollectionsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllCollectionsMutation,
      Types.DeleteAllCollectionsMutationVariables
    >(Documents.DeleteAllCollections, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  /**
   * Adds contents to collections.
   * @param contents - The contents to add.
   * @param collections - The collections to add the contents to.
   * @returns The result of the operation.
   */
  public async addContentsToCollections(
    contents: Types.EntityReferenceInput[],
    collections: Types.EntityReferenceInput[],
  ): Promise<Types.AddContentsToCollectionsMutation> {
    return this.mutateAndCheckError<
      Types.AddContentsToCollectionsMutation,
      Types.AddContentsToCollectionsMutationVariables
    >(Documents.AddContentsToCollections, {
      contents: contents,
      collections: collections,
    });
  }

  /**
   * Removes contents from a collection.
   * @param contents - The contents to remove.
   * @param collection - The collection to remove the contents from.
   * @returns The result of the operation.
   */
  public async removeContentsFromCollection(
    contents: Types.EntityReferenceInput[],
    collection: Types.EntityReferenceInput,
  ): Promise<Types.RemoveContentsFromCollectionMutation> {
    return this.mutateAndCheckError<
      Types.RemoveContentsFromCollectionMutation,
      Types.RemoveContentsFromCollectionMutationVariables
    >(Documents.RemoveContentsFromCollection, {
      contents: contents,
      collection: collection,
    });
  }

  /**
   * Adds conversations to collections.
   * @param conversations - The conversations to add.
   * @param collections - The collections to add the conversations to.
   * @returns The result of the operation.
   */
  public async addConversationsToCollections(
    conversations: Types.EntityReferenceInput[],
    collections: Types.EntityReferenceInput[],
  ): Promise<Types.AddConversationsToCollectionsMutation> {
    return this.mutateAndCheckError<
      Types.AddConversationsToCollectionsMutation,
      Types.AddConversationsToCollectionsMutationVariables
    >(Documents.AddConversationsToCollections, {
      conversations: conversations,
      collections: collections,
    });
  }

  /**
   * Removes conversations from a collection.
   * @param conversations - The conversations to remove.
   * @param collection - The collection to remove the conversations from.
   * @returns The result of the operation.
   */
  public async removeConversationsFromCollection(
    conversations: Types.EntityReferenceInput[],
    collection: Types.EntityReferenceInput,
  ): Promise<Types.RemoveConversationsFromCollectionMutation> {
    return this.mutateAndCheckError<
      Types.RemoveConversationsFromCollectionMutation,
      Types.RemoveConversationsFromCollectionMutationVariables
    >(Documents.RemoveConversationsFromCollection, {
      conversations: conversations,
      collection: collection,
    });
  }

  /**
   * Lookup a collection given its ID.
   * @param id - ID of the collection.
   * @returns The collection.
   */
  public async getCollection(id: string): Promise<Types.GetCollectionQuery> {
    return this.queryAndCheckError<
      Types.GetCollectionQuery,
      Types.GetCollectionQueryVariables
    >(Documents.GetCollection, { id: id });
  }

  /**
   * Retrieves collections based on the provided filter criteria.
   * @param filter - The filter criteria to apply when retrieving collections.
   * @returns The collections.
   */
  public async queryCollections(
    filter?: Types.CollectionFilter,
  ): Promise<Types.QueryCollectionsQuery> {
    return this.queryAndCheckError<
      Types.QueryCollectionsQuery,
      Types.QueryCollectionsQueryVariables
    >(Documents.QueryCollections, { filter: filter });
  }

  /**
   * Counts collections based on the provided filter criteria.
   * @param filter - The filter criteria to apply when counting collections.
   * @returns The count of collections.
   */
  public async countCollections(
    filter?: Types.CollectionFilter,
  ): Promise<Types.CountCollectionsQuery> {
    return this.queryAndCheckError<
      Types.CountCollectionsQuery,
      Types.CountCollectionsQueryVariables
    >(Documents.CountCollections, { filter: filter });
  }

  /**
   * Describes an image using a multimodal LLM.
   * @param prompt - The prompt to use for describing the image.
   * @param uri - The URI of the image to describe.
   * @param specification - The LLM specification to use, optional.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The image description.
   */
  public async describeImage(
    prompt: string,
    uri: string,
    specification?: Types.EntityReferenceInput,
    correlationId?: string,
  ): Promise<Types.DescribeImageMutation> {
    return this.mutateAndCheckError<
      Types.DescribeImageMutation,
      Types.DescribeImageMutationVariables
    >(Documents.DescribeImage, {
      prompt: prompt,
      uri: uri,
      specification: specification,
      correlationId: correlationId,
    });
  }

  /**
   * Describes a base64-encoded image using a multimodal LLM.
   * @param prompt - The prompt to use for describing the image.
   * @param mimeType - The MIME type of the image.
   * @param data - The base64-encoded image data.
   * @param specification - The LLM specification to use, optional.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The image description.
   */
  public async describeEncodedImage(
    prompt: string,
    mimeType: string,
    data: string,
    specification?: Types.EntityReferenceInput,
    correlationId?: string,
  ): Promise<Types.DescribeEncodedImageMutation> {
    return this.mutateAndCheckError<
      Types.DescribeEncodedImageMutation,
      Types.DescribeEncodedImageMutationVariables
    >(Documents.DescribeEncodedImage, {
      prompt: prompt,
      mimeType: mimeType,
      data: data,
      specification: specification,
      correlationId: correlationId,
    });
  }

  /**
   * Takes a screenshot of a web page.
   * @param uri - The URI of the web page to screenshot.
   * @param maximumHeight - The maximum height of the screenshot, optional.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @param workflow - The workflow to use for processing, optional.
   * @param collections - The collections to add the content to, optional.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The screenshot content.
   */
  public async screenshotPage(
    uri: string,
    maximumHeight?: number,
    isSynchronous?: boolean,
    workflow?: Types.EntityReferenceInput,
    collections?: Types.EntityReferenceInput[],
    correlationId?: string,
  ): Promise<Types.ScreenshotPageMutation> {
    return this.mutateAndCheckError<
      Types.ScreenshotPageMutation,
      Types.ScreenshotPageMutationVariables
    >(Documents.ScreenshotPage, {
      uri: uri,
      maximumHeight: maximumHeight,
      isSynchronous: isSynchronous,
      workflow: workflow,
      collections: collections,
      correlationId: correlationId,
    });
  }

  /**
   * Ingests a batch of text contents.
   * @param batch - The batch of text contents to ingest.
   * @param textType - The type of text (plain, markdown, HTML).
   * @param collections - The collections to add the contents to, optional.
   * @param observations - The observations to assign to the contents, optional.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The ingested contents.
   */
  public async ingestTextBatch(
    batch: Types.TextContentInput[],
    textType: Types.TextTypes,
    collections?: Types.EntityReferenceInput[],
    observations?: Types.ObservationReferenceInput[],
    correlationId?: string,
  ): Promise<Types.IngestTextBatchMutation> {
    return this.mutateAndCheckError<
      Types.IngestTextBatchMutation,
      Types.IngestTextBatchMutationVariables
    >(Documents.IngestTextBatch, {
      batch: batch,
      textType: textType,
      collections: collections,
      observations: observations,
      correlationId: correlationId,
    });
  }

  /**
   * Ingests a batch of URIs.
   * @param uris - The URIs to ingest.
   * @param workflow - The workflow to use for processing, optional.
   * @param collections - The collections to add the contents to, optional.
   * @param observations - The observations to assign to the contents, optional.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The ingested contents.
   */
  public async ingestBatch(
    uris: string[],
    workflow?: Types.EntityReferenceInput,
    collections?: Types.EntityReferenceInput[],
    observations?: Types.ObservationReferenceInput[],
    correlationId?: string,
  ): Promise<Types.IngestBatchMutation> {
    return this.mutateAndCheckError<
      Types.IngestBatchMutation,
      Types.IngestBatchMutationVariables
    >(Documents.IngestBatch, {
      uris: uris,
      workflow: workflow,
      collections: collections,
      observations: observations,
      correlationId: correlationId,
    });
  }

  /**
   * Ingests content from a URI.
   * @param uri - The URI of the content to ingest.
   * @param name - The name of the content, optional.
   * @param id - The ID to assign to the content, optional.
   * @param identifier - The external identifier for the content, optional.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @param workflow - The workflow to use for processing, optional.
   * @param collections - The collections to add the content to, optional.
   * @param observations - The observations to assign to the content, optional.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The ingested content.
   */
  public async ingestUri(
    uri: string,
    name?: string,
    id?: string,
    identifier?: string,
    isSynchronous?: boolean,
    workflow?: Types.EntityReferenceInput,
    collections?: Types.EntityReferenceInput[],
    observations?: Types.ObservationReferenceInput[],
    correlationId?: string,
  ): Promise<Types.IngestUriMutation> {
    return this.mutateAndCheckError<
      Types.IngestUriMutation,
      Types.IngestUriMutationVariables
    >(Documents.IngestUri, {
      uri: uri,
      name: name,
      id: id,
      identifier: identifier,
      isSynchronous: isSynchronous,
      workflow: workflow,
      collections: collections,
      observations: observations,
      correlationId: correlationId,
    });
  }

  /**
   * Ingests text content.
   * @param text - The text to ingest.
   * @param name - The name of the content, optional.
   * @param textType - The type of text (plain, markdown, HTML), optional.
   * @param uri - The URI associated with the content, optional.
   * @param id - The ID to assign to the content, optional.
   * @param identifier - The external identifier for the content, optional.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @param workflow - The workflow to use for processing, optional.
   * @param collections - The collections to add the content to, optional.
   * @param observations - The observations to assign to the content, optional.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The ingested content.
   */
  public async ingestText(
    text: string,
    name?: string,
    textType?: Types.TextTypes,
    uri?: string,
    id?: string,
    identifier?: string,
    isSynchronous?: boolean,
    workflow?: Types.EntityReferenceInput,
    collections?: Types.EntityReferenceInput[],
    observations?: Types.ObservationReferenceInput[],
    correlationId?: string,
  ): Promise<Types.IngestTextMutation> {
    return this.mutateAndCheckError<
      Types.IngestTextMutation,
      Types.IngestTextMutationVariables
    >(Documents.IngestText, {
      name: name,
      text: text,
      textType: textType,
      uri: uri,
      id: id,
      identifier: identifier,
      isSynchronous: isSynchronous,
      workflow: workflow,
      collections: collections,
      observations: observations,
      correlationId: correlationId,
    });
  }

  /**
   * Ingests a memory (ephemeral text content).
   * @param text - The text to ingest as memory.
   * @param name - The name of the memory, optional.
   * @param textType - The type of text (plain, markdown, HTML), optional.
   * @param id - The ID to assign to the memory, optional.
   * @param identifier - The external identifier for the memory, optional.
   * @param collections - The collections to add the memory to, optional.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The ingested memory.
   */
  public async ingestMemory(
    text: string,
    name?: string,
    textType?: Types.TextTypes,
    id?: string,
    identifier?: string,
    collections?: Types.EntityReferenceInput[],
    correlationId?: string,
  ): Promise<Types.IngestMemoryMutation> {
    return this.mutateAndCheckError<
      Types.IngestMemoryMutation,
      Types.IngestMemoryMutationVariables
    >(Documents.IngestMemory, {
      name: name,
      text: text,
      textType: textType,
      id: id,
      identifier: identifier,
      collections: collections,
      correlationId: correlationId,
    });
  }

  /**
   * Ingests an event.
   * @param markdown - The markdown content of the event.
   * @param name - The name of the event, optional.
   * @param description - The description of the event, optional.
   * @param eventDate - The date of the event, optional.
   * @param id - The ID to assign to the event, optional.
   * @param identifier - The external identifier for the event, optional.
   * @param collections - The collections to add the event to, optional.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The ingested event.
   */
  public async ingestEvent(
    markdown: string,
    name?: string,
    description?: string,
    eventDate?: Types.Scalars["DateTime"]["input"],
    id?: string,
    identifier?: string,
    collections?: Types.EntityReferenceInput[],
    correlationId?: string,
  ): Promise<Types.IngestEventMutation> {
    return this.mutateAndCheckError<
      Types.IngestEventMutation,
      Types.IngestEventMutationVariables
    >(Documents.IngestEvent, {
      name: name,
      markdown: markdown,
      description: description,
      eventDate: eventDate,
      id: id,
      identifier: identifier,
      collections: collections,
      correlationId: correlationId,
    });
  }

  /**
   * Ingests a base64-encoded file.
   * @param name - The name of the file.
   * @param data - The base64-encoded file data.
   * @param mimeType - The MIME type of the file.
   * @param fileCreationDate - The file creation date, optional.
   * @param fileModifiedDate - The file modified date, optional.
   * @param id - The ID to assign to the content, optional.
   * @param identifier - The external identifier for the content, optional.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @param workflow - The workflow to use for processing, optional.
   * @param collections - The collections to add the content to, optional.
   * @param observations - The observations to assign to the content, optional.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The ingested content.
   */
  public async ingestEncodedFile(
    name: string,
    data: string,
    mimeType: string,
    fileCreationDate?: Types.Scalars["DateTime"]["input"],
    fileModifiedDate?: Types.Scalars["DateTime"]["input"],
    id?: string,
    identifier?: string,
    isSynchronous?: boolean,
    workflow?: Types.EntityReferenceInput,
    collections?: Types.EntityReferenceInput[],
    observations?: Types.ObservationReferenceInput[],
    correlationId?: string,
  ): Promise<Types.IngestEncodedFileMutation> {
    return this.mutateAndCheckError<
      Types.IngestEncodedFileMutation,
      Types.IngestEncodedFileMutationVariables
    >(Documents.IngestEncodedFile, {
      name: name,
      data: data,
      mimeType: mimeType,
      fileCreationDate: fileCreationDate,
      fileModifiedDate: fileModifiedDate,
      id: id,
      identifier: identifier,
      isSynchronous: isSynchronous,
      workflow: workflow,
      collections: collections,
      observations: observations,
      correlationId: correlationId,
    });
  }

  /**
   * Updates content.
   * @param content - The content to update.
   * @returns The updated content.
   */
  public async updateContent(
    content: Types.ContentUpdateInput,
  ): Promise<Types.UpdateContentMutation> {
    return this.mutateAndCheckError<
      Types.UpdateContentMutation,
      Types.UpdateContentMutationVariables
    >(Documents.UpdateContent, { content: content });
  }

  /**
   * Deletes content.
   * @param id - The ID of the content to delete.
   * @returns The deleted content.
   */
  public async deleteContent(id: string): Promise<Types.DeleteContentMutation> {
    return this.mutateAndCheckError<
      Types.DeleteContentMutation,
      Types.DeleteContentMutationVariables
    >(Documents.DeleteContent, { id: id });
  }

  /**
   * Approves content.
   * @param id - The ID of the content to approve.
   * @returns The approved content.
   */
  public async approveContent(
    id: string,
  ): Promise<Types.ApproveContentMutation> {
    return this.mutateAndCheckError<
      Types.ApproveContentMutation,
      Types.ApproveContentMutationVariables
    >(Documents.ApproveContent, { id: id });
  }

  /**
   * Rejects content.
   * @param id - The ID of the content to reject.
   * @param reason - The reason for rejection.
   * @returns The rejected content.
   */
  public async rejectContent(
    id: string,
    reason?: string,
  ): Promise<Types.RejectContentMutation> {
    return this.mutateAndCheckError<
      Types.RejectContentMutation,
      Types.RejectContentMutationVariables
    >(Documents.RejectContent, { id: id, reason: reason });
  }

  /**
   * Restarts content processing.
   * @param id - The ID of the content to restart.
   * @returns The restarted content.
   */
  public async restartContent(
    id: string,
  ): Promise<Types.RestartContentMutation> {
    return this.mutateAndCheckError<
      Types.RestartContentMutation,
      Types.RestartContentMutationVariables
    >(Documents.RestartContent, { id: id });
  }

  /**
   * Deletes multiple contents.
   * @param ids - The IDs of the contents to delete.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @returns The deleted contents.
   */
  public async deleteContents(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteContentsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteContentsMutation,
      Types.DeleteContentsMutationVariables
    >(Documents.DeleteContents, { ids: ids, isSynchronous: isSynchronous });
  }

  /**
   * Deletes all contents based on the provided filter criteria.
   * @param filter - The filter criteria to apply when deleting contents.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The result of the deletion.
   */
  public async deleteAllContents(
    filter?: Types.ContentFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllContentsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllContentsMutation,
      Types.DeleteAllContentsMutationVariables
    >(Documents.DeleteAllContents, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  /**
   * Summarizes text using the specified summarization strategy.
   * @param summarization - The summarization strategy to use.
   * @param text - The text to summarize.
   * @param textType - The type of text (plain, markdown, HTML), optional.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The summarized text.
   */
  public async summarizeText(
    summarization: Types.SummarizationStrategyInput,
    text: string,
    textType?: Types.TextTypes,
    correlationId?: string,
  ): Promise<Types.SummarizeTextMutation> {
    return this.mutateAndCheckError<
      Types.SummarizeTextMutation,
      Types.SummarizeTextMutationVariables
    >(Documents.SummarizeText, {
      summarization: summarization,
      text: text,
      textType: textType,
      correlationId: correlationId,
    });
  }

  /**
   * Summarizes contents using the specified summarization strategies.
   * @param summarizations - The summarization strategies to use.
   * @param filter - The filter criteria to apply when retrieving contents to summarize.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The summarized contents.
   */
  public async summarizeContents(
    summarizations: Types.SummarizationStrategyInput[],
    filter?: Types.ContentFilter,
    correlationId?: string,
  ): Promise<Types.SummarizeContentsMutation> {
    return this.mutateAndCheckError<
      Types.SummarizeContentsMutation,
      Types.SummarizeContentsMutationVariables
    >(Documents.SummarizeContents, {
      summarizations: summarizations,
      filter: filter,
      correlationId: correlationId,
    });
  }

  /**
   * Extracts structured data from text using tool definitions.
   * @param prompt - The prompt to guide extraction.
   * @param text - The text to extract from.
   * @param tools - The tool definitions for extraction.
   * @param specification - The LLM specification to use, optional.
   * @param textType - The type of text (plain, markdown, HTML), optional.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The extracted data.
   */
  public async extractText(
    prompt: string,
    text: string,
    tools: Types.ToolDefinitionInput[],
    specification?: Types.EntityReferenceInput,
    textType?: Types.TextTypes,
    correlationId?: string,
  ): Promise<Types.ExtractTextMutation> {
    return this.mutateAndCheckError<
      Types.ExtractTextMutation,
      Types.ExtractTextMutationVariables
    >(Documents.ExtractText, {
      prompt: prompt,
      text: text,
      textType: textType,
      specification: specification,
      tools: tools,
      correlationId: correlationId,
    });
  }

  /**
   * Extracts structured data from contents using tool definitions.
   * @param prompt - The prompt to guide extraction.
   * @param tools - The tool definitions for extraction.
   * @param specification - The LLM specification to use, optional.
   * @param filter - The filter criteria to apply when retrieving contents.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The extracted data.
   */
  public async extractContents(
    prompt: string,
    tools: Types.ToolDefinitionInput[],
    specification?: Types.EntityReferenceInput,
    filter?: Types.ContentFilter,
    correlationId?: string,
  ): Promise<Types.ExtractContentsMutation> {
    return this.mutateAndCheckError<
      Types.ExtractContentsMutation,
      Types.ExtractContentsMutationVariables
    >(Documents.ExtractContents, {
      prompt: prompt,
      filter: filter,
      specification: specification,
      tools: tools,
      correlationId: correlationId,
    });
  }

  /**
   * Extracts observables (entities) from text.
   * @param text - The text to extract observables from.
   * @param textType - The type of text (plain, markdown, HTML), optional.
   * @param specification - The LLM specification to use, optional.
   * @param observableTypes - The types of observables to extract, optional.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The extracted observables.
   */
  public async extractObservables(
    text: string,
    textType?: Types.TextTypes,
    specification?: Types.EntityReferenceInput,
    observableTypes?: Types.ObservableTypes[],
    correlationId?: string,
  ): Promise<Types.ExtractObservablesMutation> {
    return this.mutateAndCheckError<
      Types.ExtractObservablesMutation,
      Types.ExtractObservablesMutationVariables
    >(Documents.ExtractObservables, {
      text: text,
      textType: textType,
      specification: specification,
      observableTypes: observableTypes,
      correlationId: correlationId,
    });
  }

  /**
   * Publishes contents to an external connector.
   * @param publishPrompt - The prompt for publishing.
   * @param connector - The publishing connector to use.
   * @param summaryPrompt - The prompt for summarizing each content, optional.
   * @param summarySpecification - The LLM specification for summarization, optional.
   * @param publishSpecification - The LLM specification for publishing, optional.
   * @param name - The name of the published content, optional.
   * @param filter - The filter criteria for selecting contents, optional.
   * @param workflow - The workflow to use, optional.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @param includeDetails - Whether to include details in publishing, optional.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The published content.
   */
  public async publishContents(
    publishPrompt: string,
    connector: Types.ContentPublishingConnectorInput,
    summaryPrompt?: string,
    summarySpecification?: Types.EntityReferenceInput,
    publishSpecification?: Types.EntityReferenceInput,
    name?: string,
    filter?: Types.ContentFilter,
    workflow?: Types.EntityReferenceInput,
    isSynchronous?: boolean,
    includeDetails?: boolean,
    correlationId?: string,
  ): Promise<Types.PublishContentsMutation> {
    return this.mutateAndCheckError<
      Types.PublishContentsMutation,
      Types.PublishContentsMutationVariables
    >(Documents.PublishContents, {
      summaryPrompt: summaryPrompt,
      summarySpecification: summarySpecification,
      connector: connector,
      publishPrompt: publishPrompt,
      publishSpecification: publishSpecification,
      name: name,
      filter: filter,
      workflow: workflow,
      isSynchronous: isSynchronous,
      includeDetails: includeDetails,
      correlationId: correlationId,
    });
  }

  /**
   * Publishes text to an external connector.
   * @param text - The text to publish.
   * @param textType - The type of text (plain, markdown, HTML).
   * @param connector - The publishing connector to use.
   * @param name - The name of the published content, optional.
   * @param workflow - The workflow to use, optional.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The published content.
   */
  public async publishText(
    text: string,
    textType: Types.TextTypes,
    connector: Types.ContentPublishingConnectorInput,
    name?: string,
    workflow?: Types.EntityReferenceInput,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.PublishTextMutation> {
    return this.mutateAndCheckError<
      Types.PublishTextMutation,
      Types.PublishTextMutationVariables
    >(Documents.PublishText, {
      text: text,
      textType: textType,
      connector: connector,
      name: name,
      workflow: workflow,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  /**
   * Distributes contents to an external connector.
   * @param connector - The distribution connector to use.
   * @param authentication - The authentication reference for distribution.
   * @param filter - The filter criteria for selecting contents, optional.
   * @param text - The text to distribute, optional.
   * @param textType - The type of text (plain, markdown, HTML), optional.
   * @param name - The name of the distributed content, optional.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The distribution results.
   */
  public async distributeContents(
    connector: Types.DistributionConnectorInput,
    authentication: Types.EntityReferenceInput,
    filter?: Types.ContentFilter,
    text?: string,
    textType?: Types.TextTypes,
    name?: string,
    correlationId?: string,
  ): Promise<Types.DistributeContentsMutation> {
    return this.mutateAndCheckError<
      Types.DistributeContentsMutation,
      Types.DistributeContentsMutationVariables
    >(Documents.DistributeContents, {
      connector: connector,
      authentication: authentication,
      filter: filter,
      text: text,
      textType: textType,
      name: name,
      correlationId: correlationId,
    });
  }

  /**
   * Researches contents and publishes the results.
   * @param connector - The publishing connector to use.
   * @param filter - The filter criteria for selecting contents, optional.
   * @param name - The name of the research output, optional.
   * @param summarySpecification - The LLM specification for summarization, optional.
   * @param publishSpecification - The LLM specification for publishing, optional.
   * @param workflow - The workflow to use, optional.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The research results.
   */
  public async researchContents(
    connector: Types.ContentPublishingConnectorInput,
    filter?: Types.ContentFilter,
    name?: string,
    summarySpecification?: Types.EntityReferenceInput,
    publishSpecification?: Types.EntityReferenceInput,
    workflow?: Types.EntityReferenceInput,
    correlationId?: string,
  ): Promise<Types.ResearchContentsMutation> {
    return this.mutateAndCheckError<
      Types.ResearchContentsMutation,
      Types.ResearchContentsMutationVariables
    >(Documents.ResearchContents, {
      connector: connector,
      filter: filter,
      name: name,
      summarySpecification: summarySpecification,
      publishSpecification: publishSpecification,
      workflow: workflow,
      correlationId: correlationId,
    });
  }

  /**
   * Lookup content given its ID.
   * @param id - ID of the content.
   * @returns The content.
   */
  public async getContent(id: string): Promise<Types.GetContentQuery> {
    return this.queryAndCheckError<
      Types.GetContentQuery,
      Types.GetContentQueryVariables
    >(Documents.GetContent, { id: id });
  }

  /**
   * Lookup multiple contents given their IDs.
   * @param ids - IDs of the contents.
   * @returns The contents.
   */
  public async lookupContents(
    ids: string[],
  ): Promise<Types.LookupContentsQuery> {
    return this.queryAndCheckError<
      Types.LookupContentsQuery,
      Types.LookupContentsQueryVariables
    >(Documents.LookupContents, { ids: ids });
  }

  /**
   * Retrieves observables based on the provided filter criteria.
   * @param filter - The filter criteria to apply when retrieving observables.
   * @returns The observables.
   */
  public async queryObservables(
    filter?: Types.ContentFilter,
  ): Promise<Types.QueryObservablesQuery> {
    return this.queryAndCheckError<
      Types.QueryObservablesQuery,
      Types.QueryObservablesQueryVariables
    >(Documents.QueryObservables, { filter: filter });
  }

  /**
   * Retrieves contents based on the provided filter criteria.
   * @param filter - The filter criteria to apply when retrieving contents.
   * @returns The contents.
   */
  public async queryContents(
    filter?: Types.ContentFilter,
  ): Promise<Types.QueryContentsQuery> {
    return this.queryAndCheckError<
      Types.QueryContentsQuery,
      Types.QueryContentsQueryVariables
    >(Documents.QueryContents, { filter: filter });
  }

  /**
   * Retrieves contents with their observations based on the provided filter criteria.
   * @param filter - The filter criteria to apply when retrieving contents.
   * @returns The contents with observations.
   */
  public async queryContentsObservations(
    filter?: Types.ContentFilter,
  ): Promise<Types.QueryContentsObservationsQuery> {
    return this.queryAndCheckError<
      Types.QueryContentsObservationsQuery,
      Types.QueryContentsObservationsQueryVariables
    >(Documents.QueryContentsObservations, { filter: filter });
  }

  /**
   * Retrieves content facets based on the provided filter criteria.
   * @param filter - The filter criteria to apply when retrieving facets.
   * @returns The content facets.
   */
  public async queryContentsFacets(
    filter?: Types.ContentFilter,
  ): Promise<Types.QueryContentsFacetsQuery> {
    return this.queryAndCheckError<
      Types.QueryContentsFacetsQuery,
      Types.QueryContentsFacetsQueryVariables
    >(Documents.QueryContentsFacets, { filter: filter });
  }

  /**
   * Retrieves the content knowledge graph based on the provided filter criteria.
   * @param filter - The filter criteria to apply when retrieving the graph.
   * @returns The content knowledge graph.
   */
  public async queryContentsGraph(
    filter?: Types.ContentFilter,
  ): Promise<Types.QueryContentsGraphQuery> {
    return this.queryAndCheckError<
      Types.QueryContentsGraphQuery,
      Types.QueryContentsGraphQueryVariables
    >(Documents.QueryContentsGraph, {
      filter: filter,
      graph: {
        /* return everything */
      },
    });
  }

  /**
   * Retrieves the knowledge graph based on the provided filter criteria.
   * @param filter - The filter criteria to apply when retrieving the graph.
   * @param graph - The graph configuration, optional.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The knowledge graph.
   */
  public async queryGraph(
    filter?: Types.GraphFilter,
    graph?: Types.GraphInput,
    correlationId?: string,
  ): Promise<Types.QueryGraphQuery> {
    return this.queryAndCheckError<
      Types.QueryGraphQuery,
      Types.QueryGraphQueryVariables
    >(Documents.QueryGraph, {
      filter: filter,
      graph: graph,
      correlationId: correlationId,
    });
  }

  /**
   * Lookup an entity and its relationships.
   * @param filter - The filter criteria for entity relationships.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The entity with relationships.
   */
  public async lookupEntity(
    filter: Types.EntityRelationshipsFilter,
    correlationId?: string,
  ): Promise<Types.LookupEntityQuery> {
    return this.queryAndCheckError<
      Types.LookupEntityQuery,
      Types.LookupEntityQueryVariables
    >(Documents.LookupEntity, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /**
   * Counts contents based on the provided filter criteria.
   * @param filter - The filter criteria to apply when counting contents.
   * @returns The count of contents.
   */
  public async countContents(
    filter?: Types.ContentFilter,
  ): Promise<Types.CountContentsQuery> {
    return this.queryAndCheckError<
      Types.CountContentsQuery,
      Types.CountContentsQueryVariables
    >(Documents.CountContents, { filter: filter });
  }

  /**
   * Checks if content processing is complete.
   * @param id - ID of the content.
   * @returns Whether the content is done processing.
   */
  public async isContentDone(id: string): Promise<Types.IsContentDoneQuery> {
    return this.queryAndCheckError<
      Types.IsContentDoneQuery,
      Types.IsContentDoneQueryVariables
    >(Documents.IsContentDone, { id: id });
  }

  /**
   * Creates a conversation.
   * @param conversation - The conversation to create.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The created conversation.
   */
  public async createConversation(
    conversation: Types.ConversationInput,
    correlationId?: string,
  ): Promise<Types.CreateConversationMutation> {
    return this.mutateAndCheckError<
      Types.CreateConversationMutation,
      Types.CreateConversationMutationVariables
    >(Documents.CreateConversation, {
      conversation: conversation,
      correlationId: correlationId,
    });
  }

  /**
   * Updates a conversation.
   * @param conversation - The conversation to update.
   * @returns The updated conversation.
   */
  public async updateConversation(
    conversation: Types.ConversationUpdateInput,
  ): Promise<Types.UpdateConversationMutation> {
    return this.mutateAndCheckError<
      Types.UpdateConversationMutation,
      Types.UpdateConversationMutationVariables
    >(Documents.UpdateConversation, { conversation: conversation });
  }

  /**
   * Deletes a conversation.
   * @param id - The ID of the conversation to delete.
   * @returns The deleted conversation.
   */
  public async deleteConversation(
    id: string,
  ): Promise<Types.DeleteConversationMutation> {
    return this.mutateAndCheckError<
      Types.DeleteConversationMutation,
      Types.DeleteConversationMutationVariables
    >(Documents.DeleteConversation, { id: id });
  }

  /**
   * Deletes multiple conversations.
   * @param ids - The IDs of the conversations to delete.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @returns The deleted conversations.
   */
  public async deleteConversations(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteConversationsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteConversationsMutation,
      Types.DeleteConversationsMutationVariables
    >(Documents.DeleteConversations, {
      ids: ids,
      isSynchronous: isSynchronous,
    });
  }

  /**
   * Deletes all conversations based on the provided filter criteria.
   * @param filter - The filter criteria to apply when deleting conversations.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The result of the deletion.
   */
  public async deleteAllConversations(
    filter?: Types.ConversationFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllConversationsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllConversationsMutation,
      Types.DeleteAllConversationsMutationVariables
    >(Documents.DeleteAllConversations, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  /**
   * Clears all messages from a conversation.
   * @param id - The ID of the conversation to clear.
   * @returns The cleared conversation.
   */
  public async clearConversation(
    id: string,
  ): Promise<Types.ClearConversationMutation> {
    return this.mutateAndCheckError<
      Types.ClearConversationMutation,
      Types.ClearConversationMutationVariables
    >(Documents.ClearConversation, { id: id });
  }

  /**
   * Closes a conversation.
   * @param id - The ID of the conversation to close.
   * @returns The closed conversation.
   */
  public async closeConversation(
    id: string,
  ): Promise<Types.CloseConversationMutation> {
    return this.mutateAndCheckError<
      Types.CloseConversationMutation,
      Types.CloseConversationMutationVariables
    >(Documents.CloseConversation, { id: id });
  }

  /**
   * Lookup a conversation given its ID.
   * @param id - ID of the conversation.
   * @returns The conversation.
   */
  public async getConversation(
    id: string,
  ): Promise<Types.GetConversationQuery> {
    return this.queryAndCheckError<
      Types.GetConversationQuery,
      Types.GetConversationQueryVariables
    >(Documents.GetConversation, { id: id });
  }

  /**
   * Retrieves conversations based on the provided filter criteria.
   * @param filter - The filter criteria to apply when retrieving conversations.
   * @returns The conversations.
   */
  public async queryConversations(
    filter?: Types.ConversationFilter,
  ): Promise<Types.QueryConversationsQuery> {
    return this.queryAndCheckError<
      Types.QueryConversationsQuery,
      Types.QueryConversationsQueryVariables
    >(Documents.QueryConversations, { filter: filter });
  }

  /**
   * Retrieves Conversations as a knowledge graph.
   * @param filter - The filter criteria to apply when retrieving Conversations, optional.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The Conversations graph with nodes and edges.
   */
  public async queryConversationsGraph(
    filter?: Types.ConversationFilter,
    correlationId?: string,
  ): Promise<Types.QueryConversationsGraphQuery> {
    return this.queryAndCheckError<
      Types.QueryConversationsGraphQuery,
      Types.QueryConversationsGraphQueryVariables
    >(Documents.QueryConversationsGraph, {
      filter: filter,
      graph: {
        /* return everything */
      },
      correlationId: correlationId,
    });
  }

  /**
   * Retrieves Conversations with clustering.
   * @param filter - The filter criteria to apply when retrieving Conversations, optional.
   * @param clusters - The clustering input parameters, optional.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The Conversations with clusters.
   */
  public async queryConversationsClusters(
    filter?: Types.ConversationFilter,
    clusters?: Types.EntityClustersInput,
    correlationId?: string,
  ): Promise<Types.QueryConversationsClustersQuery> {
    return this.queryAndCheckError<
      Types.QueryConversationsClustersQuery,
      Types.QueryConversationsClustersQueryVariables
    >(Documents.QueryConversationsClusters, {
      filter: filter,
      clusters: clusters,
      correlationId: correlationId,
    });
  }

  /**
   * Counts conversations based on the provided filter criteria.
   * @param filter - The filter criteria to apply when counting conversations.
   * @returns The count of conversations.
   */
  public async countConversations(
    filter?: Types.ConversationFilter,
  ): Promise<Types.CountConversationsQuery> {
    return this.queryAndCheckError<
      Types.CountConversationsQuery,
      Types.CountConversationsQueryVariables
    >(Documents.CountConversations, { filter: filter });
  }

  /**
   * Revises an image in an existing conversation using a multimodal LLM.
   * @param prompt - The prompt to use for revision.
   * @param uri - The URI of the image to revise.
   * @param id - The conversation ID, optional.
   * @param specification - The LLM specification to use, optional.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The revised conversation message.
   */
  public async reviseImage(
    prompt: string,
    uri: string,
    id?: string,
    specification?: Types.EntityReferenceInput,
    correlationId?: string,
  ): Promise<Types.ReviseImageMutation> {
    return this.mutateAndCheckError<
      Types.ReviseImageMutation,
      Types.ReviseImageMutationVariables
    >(Documents.ReviseImage, {
      prompt: prompt,
      uri: uri,
      id: id,
      specification: specification,
      correlationId: correlationId,
    });
  }

  /**
   * Revises a base64-encoded image in an existing conversation using a multimodal LLM.
   * @param prompt - The prompt to use for revision.
   * @param mimeType - The MIME type of the image.
   * @param data - The base64-encoded image data.
   * @param id - The conversation ID, optional.
   * @param specification - The LLM specification to use, optional.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The revised conversation message.
   */
  public async reviseEncodedImage(
    prompt: string,
    mimeType: string,
    data: string,
    id?: string,
    specification?: Types.EntityReferenceInput,
    correlationId?: string,
  ): Promise<Types.ReviseEncodedImageMutation> {
    return this.mutateAndCheckError<
      Types.ReviseEncodedImageMutation,
      Types.ReviseEncodedImageMutationVariables
    >(Documents.ReviseEncodedImage, {
      prompt: prompt,
      mimeType: mimeType,
      data: data,
      id: id,
      specification: specification,
      correlationId: correlationId,
    });
  }

  /**
   * Revises text in an existing conversation.
   * @param prompt - The prompt to use for revision.
   * @param text - The text to revise.
   * @param id - The conversation ID, optional.
   * @param specification - The LLM specification to use, optional.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The revised conversation message.
   */
  public async reviseText(
    prompt: string,
    text: string,
    id?: string,
    specification?: Types.EntityReferenceInput,
    correlationId?: string,
  ): Promise<Types.ReviseTextMutation> {
    return this.mutateAndCheckError<
      Types.ReviseTextMutation,
      Types.ReviseTextMutationVariables
    >(Documents.ReviseText, {
      prompt: prompt,
      text: text,
      id: id,
      specification: specification,
      correlationId: correlationId,
    });
  }

  /**
   * Revises content in an existing conversation.
   * @param prompt - The prompt to use for revision.
   * @param content - The content to revise.
   * @param id - The conversation ID, optional.
   * @param specification - The LLM specification to use, optional.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The revised conversation message.
   */
  public async reviseContent(
    prompt: string,
    content: Types.EntityReferenceInput,
    id?: string,
    specification?: Types.EntityReferenceInput,
    correlationId?: string,
  ): Promise<Types.ReviseContentMutation> {
    return this.mutateAndCheckError<
      Types.ReviseContentMutation,
      Types.ReviseContentMutationVariables
    >(Documents.ReviseContent, {
      prompt: prompt,
      content: content,
      id: id,
      specification: specification,
      correlationId: correlationId,
    });
  }

  /**
   * Prompts an LLM without a conversation context.
   * @param prompt - The prompt text, optional.
   * @param mimeType - The MIME type for multimodal input, optional.
   * @param data - The base64-encoded data for multimodal input, optional.
   * @param specification - The LLM specification to use, optional.
   * @param messages - Previous messages for context, optional.
   * @param tools - Tool definitions for function calling, optional.
   * @param requireTool - Whether to require tool usage, optional.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The LLM response.
   */
  public async prompt(
    prompt?: string,
    mimeType?: string,
    data?: string,
    specification?: Types.EntityReferenceInput,
    messages?: Types.ConversationMessageInput[],
    tools?: Types.ToolDefinitionInput[],
    requireTool?: boolean,
    correlationId?: string,
  ): Promise<Types.PromptMutation> {
    return this.mutateAndCheckError<
      Types.PromptMutation,
      Types.PromptMutationVariables
    >(Documents.Prompt, {
      prompt: prompt,
      mimeType: mimeType,
      data: data,
      specification: specification,
      messages: messages,
      tools: tools,
      requireTool: requireTool,
      correlationId: correlationId,
    });
  }

  /**
   * Retrieves relevant sources from a view for RAG.
   * @param prompt - The prompt to use for retrieval.
   * @param id - The view ID.
   * @param retrievalStrategy - The retrieval strategy, optional.
   * @param rerankingStrategy - The reranking strategy, optional.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The retrieved sources.
   */
  public async retrieveView(
    prompt: string,
    id: string,
    retrievalStrategy?: Types.RetrievalStrategyInput,
    rerankingStrategy?: Types.RerankingStrategyInput,
    correlationId?: string,
  ): Promise<Types.RetrieveViewMutation> {
    return this.mutateAndCheckError<
      Types.RetrieveViewMutation,
      Types.RetrieveViewMutationVariables
    >(Documents.RetrieveView, {
      prompt: prompt,
      id: id,
      retrievalStrategy: retrievalStrategy,
      rerankingStrategy: rerankingStrategy,
      correlationId: correlationId,
    });
  }

  /**
   * Retrieves relevant sources for RAG.
   * @param prompt - The prompt to use for retrieval.
   * @param filter - The filter criteria for selecting contents, optional.
   * @param augmentedFilter - Additional filter for augmented retrieval, optional.
   * @param retrievalStrategy - The retrieval strategy, optional.
   * @param rerankingStrategy - The reranking strategy, optional.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The retrieved sources.
   */
  public async retrieveSources(
    prompt: string,
    filter?: Types.ContentFilter,
    augmentedFilter?: Types.ContentFilter,
    retrievalStrategy?: Types.RetrievalStrategyInput,
    rerankingStrategy?: Types.RerankingStrategyInput,
    correlationId?: string,
  ): Promise<Types.RetrieveSourcesMutation> {
    return this.mutateAndCheckError<
      Types.RetrieveSourcesMutation,
      Types.RetrieveSourcesMutationVariables
    >(Documents.RetrieveSources, {
      prompt: prompt,
      filter: filter,
      augmentedFilter: augmentedFilter,
      retrievalStrategy: retrievalStrategy,
      rerankingStrategy: rerankingStrategy,
      correlationId: correlationId,
    });
  }

  /**
   * Retrieves entities based on the provided prompt.
   * @param prompt - The prompt for entity retrieval.
   * @param types - The observable types to filter by, optional.
   * @param searchType - The search type to use, optional.
   * @param limit - The maximum number of results to return, optional.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The retrieved entities.
   */
  public async retrieveEntities(
    prompt: string,
    types?: Types.ObservableTypes[],
    searchType?: Types.SearchTypes,
    limit?: number,
    correlationId?: string,
  ): Promise<Types.RetrieveEntitiesMutation> {
    return this.mutateAndCheckError<
      Types.RetrieveEntitiesMutation,
      Types.RetrieveEntitiesMutationVariables
    >(Documents.RetrieveEntities, {
      prompt: prompt,
      types: types,
      searchType: searchType,
      limit: limit,
      correlationId: correlationId,
    });
  }

  /**
   * Retrieves facts based on the provided prompt.
   * @param prompt - The prompt for fact retrieval.
   * @param filter - The filter criteria to apply when retrieving facts, optional.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The retrieved facts.
   */
  public async retrieveFacts(
    prompt: string,
    filter?: Types.FactFilter,
    correlationId?: string,
  ): Promise<Types.RetrieveFactsMutation> {
    return this.mutateAndCheckError<
      Types.RetrieveFactsMutation,
      Types.RetrieveFactsMutationVariables
    >(Documents.RetrieveFacts, {
      prompt: prompt,
      filter: filter,
      correlationId: correlationId,
    });
  }

  /**
   * Formats a conversation for external LLM completion.
   * @param prompt - The prompt to format.
   * @param id - The conversation ID, optional.
   * @param specification - The LLM specification to use, optional.
   * @param tools - Tool definitions for function calling, optional.
   * @param systemPrompt - The system prompt, optional.
   * @param includeDetails - Whether to include details, optional.
   * @param correlationId - The tenant correlation identifier, optional.
   * @param persona - The persona to use, optional.
   * @returns The formatted conversation.
   */
  public async formatConversation(
    prompt: string,
    id?: string,
    specification?: Types.EntityReferenceInput,
    tools?: Types.ToolDefinitionInput[],
    systemPrompt?: string,
    includeDetails?: boolean,
    correlationId?: string,
    persona?: Types.EntityReferenceInput,
  ): Promise<Types.FormatConversationMutation> {
    return this.mutateAndCheckError<
      Types.FormatConversationMutation,
      Types.FormatConversationMutationVariables
    >(Documents.FormatConversation, {
      prompt: prompt,
      id: id,
      specification: specification,
      persona: persona,
      tools: tools,
      systemPrompt: systemPrompt,
      includeDetails: includeDetails,
      correlationId: correlationId,
    });
  }

  /**
   * Completes a conversation with an external LLM response.
   * @param completion - The completion text from the external LLM.
   * @param id - The conversation ID.
   * @param completionTime - The time taken for completion, optional.
   * @param ttft - Time to first token, optional.
   * @param throughput - Tokens per second throughput, optional.
   * @param artifacts - The artifacts produced during the completion, optional.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The completed conversation.
   */
  public async completeConversation(
    completion: string,
    id: string,
    completionTime?: Types.Scalars["TimeSpan"]["input"],
    ttft?: Types.Scalars["TimeSpan"]["input"],
    throughput?: Types.Scalars["Float"]["input"],
    artifacts?: Types.EntityReferenceInput[],
    correlationId?: string,
  ): Promise<Types.CompleteConversationMutation> {
    return this.mutateAndCheckError<
      Types.CompleteConversationMutation,
      Types.CompleteConversationMutationVariables
    >(Documents.CompleteConversation, {
      completion: completion,
      id: id,
      completionTime: completionTime,
      ttft: ttft,
      throughput: throughput,
      artifacts: artifacts,
      correlationId: correlationId,
    });
  }

  /**
   * Asks a question about Graphlit SDK usage.
   * @param prompt - The question about Graphlit.
   * @param type - The SDK type (Node.js, Python, .NET), optional.
   * @param id - The conversation ID, optional.
   * @param specification - The LLM specification to use, optional.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The Graphlit answer.
   */
  public async askGraphlit(
    prompt: string,
    type?: Types.SdkTypes,
    id?: string,
    specification?: Types.EntityReferenceInput,
    correlationId?: string,
  ): Promise<Types.AskGraphlitMutation> {
    return this.mutateAndCheckError<
      Types.AskGraphlitMutation,
      Types.AskGraphlitMutationVariables
    >(Documents.AskGraphlit, {
      prompt: prompt,
      type: type,
      id: id,
      specification: specification,
      correlationId: correlationId,
    });
  }

  /**
   * Creates a branch of an existing conversation.
   * @param id - The conversation ID to branch from.
   * @returns The branched conversation.
   */
  public async branchConversation(
    id: string,
  ): Promise<Types.BranchConversationMutation> {
    return this.mutateAndCheckError<
      Types.BranchConversationMutation,
      Types.BranchConversationMutationVariables
    >(Documents.BranchConversation, {
      id: id,
    });
  }

  /**
   * Prompts a conversation with an LLM.
   * @param prompt - The prompt text.
   * @param id - The conversation ID, optional. If not provided, creates a new conversation.
   * @param specification - The LLM specification to use, optional.
   * @param mimeType - The MIME type for multimodal input, optional.
   * @param data - The base64-encoded data for multimodal input, optional.
   * @param tools - Tool definitions for function calling, optional.
   * @param requireTool - Whether to require a tool call, optional.
   * @param systemPrompt - The system prompt, optional.
   * @param includeDetails - Whether to include details, optional.
   * @param correlationId - The tenant correlation identifier, optional.
   * @param persona - The persona to use, optional.
   * @returns The conversation response.
   */
  public async promptConversation(
    prompt: string,
    id?: string,
    specification?: Types.EntityReferenceInput,
    mimeType?: string,
    data?: string,
    tools?: Types.ToolDefinitionInput[],
    requireTool?: boolean,
    systemPrompt?: string,
    includeDetails?: boolean,
    correlationId?: string,
    persona?: Types.EntityReferenceInput,
  ): Promise<Types.PromptConversationMutation> {
    return this.mutateAndCheckError<
      Types.PromptConversationMutation,
      Types.PromptConversationMutationVariables
    >(Documents.PromptConversation, {
      prompt: prompt,
      id: id,
      specification: specification,
      persona: persona,
      mimeType: mimeType,
      data: data,
      tools: tools,
      requireTool: requireTool,
      systemPrompt: systemPrompt,
      includeDetails: includeDetails,
      correlationId: correlationId,
    });
  }

  /**
   * Continues a conversation with tool responses.
   * @param id - The conversation ID.
   * @param responses - The tool call responses.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The continued conversation.
   */
  public async continueConversation(
    id: string,
    responses: Types.ConversationToolResponseInput[],
    correlationId?: string,
  ): Promise<Types.ContinueConversationMutation> {
    return this.mutateAndCheckError<
      Types.ContinueConversationMutation,
      Types.ContinueConversationMutationVariables
    >(Documents.ContinueConversation, {
      id: id,
      responses: responses,
      correlationId: correlationId,
    });
  }

  /**
   * Publishes a conversation to an external connector.
   * @param id - The conversation ID.
   * @param connector - The publishing connector to use.
   * @param name - The name of the published conversation, optional.
   * @param workflow - The workflow to use, optional.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The published conversation.
   */
  public async publishConversation(
    id: string,
    connector: Types.ContentPublishingConnectorInput,
    name?: string,
    workflow?: Types.EntityReferenceInput,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.PublishConversationMutation> {
    return this.mutateAndCheckError<
      Types.PublishConversationMutation,
      Types.PublishConversationMutationVariables
    >(Documents.PublishConversation, {
      id: id,
      connector: connector,
      name: name,
      workflow: workflow,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  /**
   * Suggests follow-up prompts for a conversation.
   * @param id - The conversation ID.
   * @param count - The number of suggestions to generate, optional.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The suggested prompts.
   */
  public async suggestConversation(
    id: string,
    count?: number,
    correlationId?: string,
  ): Promise<Types.SuggestConversationMutation> {
    return this.mutateAndCheckError<
      Types.SuggestConversationMutation,
      Types.SuggestConversationMutationVariables
    >(Documents.SuggestConversation, {
      id: id,
      count: count,
      correlationId: correlationId,
    });
  }

  /**
   * Queries Microsoft calendars.
   * @param properties - The Microsoft calendar query properties.
   * @returns The Microsoft calendars.
   */
  public async queryMicrosoftCalendars(
    properties: Types.MicrosoftCalendarsInput,
  ): Promise<Types.QueryMicrosoftCalendarsQuery> {
    return this.queryAndCheckError<
      Types.QueryMicrosoftCalendarsQuery,
      Types.QueryMicrosoftCalendarsQueryVariables
    >(Documents.QueryMicrosoftCalendars, {
      properties: properties,
    });
  }

  /**
   * Queries Google calendars.
   * @param properties - The Google calendar query properties.
   * @returns The Google calendars.
   */
  public async queryGoogleCalendars(
    properties: Types.GoogleCalendarsInput,
  ): Promise<Types.QueryGoogleCalendarsQuery> {
    return this.queryAndCheckError<
      Types.QueryGoogleCalendarsQuery,
      Types.QueryGoogleCalendarsQueryVariables
    >(Documents.QueryGoogleCalendars, {
      properties: properties,
    });
  }

  /**
   * Queries Box folders.
   * @param properties - The Box folder query properties.
   * @param folderId - The parent folder ID, optional.
   * @returns The Box folders.
   */
  public async queryBoxFolders(
    properties: Types.BoxFoldersInput,
    folderId?: string,
  ): Promise<Types.QueryBoxFoldersQuery> {
    return this.queryAndCheckError<
      Types.QueryBoxFoldersQuery,
      Types.QueryBoxFoldersQueryVariables
    >(Documents.QueryBoxFolders, {
      properties: properties,
      folderId: folderId,
    });
  }

  /**
   * Queries Dropbox folders.
   * @param properties - The Dropbox folder query properties.
   * @param folderPath - The folder path, optional.
   * @returns The Dropbox folders.
   */
  public async queryDropboxFolders(
    properties: Types.DropboxFoldersInput,
    folderPath?: string,
  ): Promise<Types.QueryDropboxFoldersQuery> {
    return this.queryAndCheckError<
      Types.QueryDropboxFoldersQuery,
      Types.QueryDropboxFoldersQueryVariables
    >(Documents.QueryDropboxFolders, {
      properties: properties,
      folderPath: folderPath,
    });
  }

  /**
   * Queries Google Drive folders.
   * @param properties - The Google Drive folder query properties.
   * @param folderId - The parent folder ID, optional.
   * @returns The Google Drive folders.
   */
  public async queryGoogleDriveFolders(
    properties: Types.GoogleDriveFoldersInput,
    folderId?: string,
  ): Promise<Types.QueryGoogleDriveFoldersQuery> {
    return this.queryAndCheckError<
      Types.QueryGoogleDriveFoldersQuery,
      Types.QueryGoogleDriveFoldersQueryVariables
    >(Documents.QueryGoogleDriveFolders, {
      properties: properties,
      folderId: folderId,
    });
  }

  /**
   * Queries OneDrive folders.
   * @param properties - The OneDrive folder query properties.
   * @param folderId - The parent folder ID, optional.
   * @returns The OneDrive folders.
   */
  public async queryOneDriveFolders(
    properties: Types.OneDriveFoldersInput,
    folderId?: string,
  ): Promise<Types.QueryOneDriveFoldersQuery> {
    return this.queryAndCheckError<
      Types.QueryOneDriveFoldersQuery,
      Types.QueryOneDriveFoldersQueryVariables
    >(Documents.QueryOneDriveFolders, {
      properties: properties,
      folderId: folderId,
    });
  }

  /**
   * Queries SharePoint folders.
   * @param properties - The SharePoint folder query properties.
   * @param libraryId - The library ID.
   * @param folderId - The parent folder ID, optional.
   * @returns The SharePoint folders.
   */
  public async querySharePointFolders(
    properties: Types.SharePointFoldersInput,
    libraryId: string,
    folderId?: string,
  ): Promise<Types.QuerySharePointFoldersQuery> {
    return this.queryAndCheckError<
      Types.QuerySharePointFoldersQuery,
      Types.QuerySharePointFoldersQueryVariables
    >(Documents.QuerySharePointFolders, {
      properties: properties,
      libraryId: libraryId,
      folderId: folderId,
    });
  }

  /**
   * Queries SharePoint libraries.
   * @param properties - The SharePoint library query properties.
   * @returns The SharePoint libraries.
   */
  public async querySharePointLibraries(
    properties: Types.SharePointLibrariesInput,
  ): Promise<Types.QuerySharePointLibrariesQuery> {
    return this.queryAndCheckError<
      Types.QuerySharePointLibrariesQuery,
      Types.QuerySharePointLibrariesQueryVariables
    >(Documents.QuerySharePointLibraries, { properties: properties });
  }

  /**
   * Queries Microsoft Teams teams.
   * @param properties - The Microsoft Teams query properties.
   * @returns The Microsoft Teams teams.
   */
  public async queryMicrosoftTeamsTeams(
    properties: Types.MicrosoftTeamsTeamsInput,
  ): Promise<Types.QueryMicrosoftTeamsTeamsQuery> {
    return this.queryAndCheckError<
      Types.QueryMicrosoftTeamsTeamsQuery,
      Types.QueryMicrosoftTeamsTeamsQueryVariables
    >(Documents.QueryMicrosoftTeamsTeams, { properties: properties });
  }

  /**
   * Queries Microsoft Teams channels.
   * @param properties - The Microsoft Teams channel query properties.
   * @param teamId - The team ID.
   * @returns The Microsoft Teams channels.
   */
  public async queryMicrosoftTeamsChannels(
    properties: Types.MicrosoftTeamsChannelsInput,
    teamId: string,
  ): Promise<Types.QueryMicrosoftTeamsChannelsQuery> {
    return this.queryAndCheckError<
      Types.QueryMicrosoftTeamsChannelsQuery,
      Types.QueryMicrosoftTeamsChannelsQueryVariables
    >(Documents.QueryMicrosoftTeamsChannels, {
      properties: properties,
      teamId: teamId,
    });
  }

  /**
   * Queries Discord guilds (servers).
   * @param properties - The Discord guild query properties.
   * @returns The Discord guilds.
   */
  public async queryDiscordGuilds(
    properties: Types.DiscordGuildsInput,
  ): Promise<Types.QueryDiscordGuildsQuery> {
    return this.queryAndCheckError<
      Types.QueryDiscordGuildsQuery,
      Types.QueryDiscordGuildsQueryVariables
    >(Documents.QueryDiscordGuilds, { properties: properties });
  }

  /**
   * Queries Discord channels.
   * @param properties - The Discord channel query properties.
   * @returns The Discord channels.
   */
  public async queryDiscordChannels(
    properties: Types.DiscordChannelsInput,
  ): Promise<Types.QueryDiscordChannelsQuery> {
    return this.queryAndCheckError<
      Types.QueryDiscordChannelsQuery,
      Types.QueryDiscordChannelsQueryVariables
    >(Documents.QueryDiscordChannels, { properties: properties });
  }

  /**
   * Queries Slack channels.
   * @param properties - The Slack channel query properties.
   * @returns The Slack channels.
   */
  public async querySlackChannels(
    properties: Types.SlackChannelsInput,
  ): Promise<Types.QuerySlackChannelsQuery> {
    return this.queryAndCheckError<
      Types.QuerySlackChannelsQuery,
      Types.QuerySlackChannelsQueryVariables
    >(Documents.QuerySlackChannels, { properties: properties });
  }

  /**
   * Queries Linear projects.
   * @param properties - The Linear project query properties.
   * @returns The Linear projects.
   */
  public async queryLinearProjects(
    properties: Types.LinearProjectsInput,
  ): Promise<Types.QueryLinearProjectsQuery> {
    return this.queryAndCheckError<
      Types.QueryLinearProjectsQuery,
      Types.QueryLinearProjectsQueryVariables
    >(Documents.QueryLinearProjects, { properties: properties });
  }

  /**
   * Queries GitHub repositories.
   * @param properties - The GitHub repository query properties.
   * @param sortBy - The sort order, optional.
   * @returns The GitHub repositories.
   */
  public async queryGitHubRepositories(
    properties: Types.GitHubRepositoriesInput,
    sortBy?: Types.GitHubRepositorySortTypes,
  ): Promise<Types.QueryGitHubRepositoriesQuery> {
    return this.queryAndCheckError<
      Types.QueryGitHubRepositoriesQuery,
      Types.QueryGitHubRepositoriesQueryVariables
    >(Documents.QueryGitHubRepositories, {
      properties: properties,
      sortBy: sortBy,
    });
  }

  /**
   * Queries Notion databases.
   * @param properties - The Notion database query properties.
   * @returns The Notion databases.
   */
  public async queryNotionDatabases(
    properties: Types.NotionDatabasesInput,
  ): Promise<Types.QueryNotionDatabasesQuery> {
    return this.queryAndCheckError<
      Types.QueryNotionDatabasesQuery,
      Types.QueryNotionDatabasesQueryVariables
    >(Documents.QueryNotionDatabases, { properties: properties });
  }

  /**
   * Queries Notion pages.
   * @param properties - The Notion page query properties.
   * @param identifier - The Notion database or page identifier.
   * @returns The Notion pages.
   */
  public async queryNotionPages(
    properties: Types.NotionPagesInput,
    identifier: string,
  ): Promise<Types.QueryNotionPagesQuery> {
    return this.queryAndCheckError<
      Types.QueryNotionPagesQuery,
      Types.QueryNotionPagesQueryVariables
    >(Documents.QueryNotionPages, {
      properties: properties,
      identifier: identifier,
    });
  }

  /**
   * Queries Asana projects.
   * @param properties - The Asana project query properties.
   * @returns The Asana projects.
   */
  public async queryAsanaProjects(
    properties: Types.AsanaProjectsInput,
  ): Promise<Types.QueryAsanaProjectsQuery> {
    return this.queryAndCheckError<
      Types.QueryAsanaProjectsQuery,
      Types.QueryAsanaProjectsQueryVariables
    >(Documents.QueryAsanaProjects, { properties: properties });
  }

  /**
   * Queries Asana workspaces.
   * @param properties - The Asana workspace query properties.
   * @returns The Asana workspaces.
   */
  public async queryAsanaWorkspaces(
    properties: Types.AsanaWorkspacesInput,
  ): Promise<Types.QueryAsanaWorkspacesQuery> {
    return this.queryAndCheckError<
      Types.QueryAsanaWorkspacesQuery,
      Types.QueryAsanaWorkspacesQueryVariables
    >(Documents.QueryAsanaWorkspaces, { properties: properties });
  }

  /**
   * Queries BambooHR departments.
   * @param properties - The BambooHR department query properties.
   * @returns The BambooHR departments.
   */
  public async queryBambooHRDepartments(
    properties: Types.BambooHrOptionsInput,
  ): Promise<Types.QueryBambooHrDepartmentsQuery> {
    return this.queryAndCheckError<
      Types.QueryBambooHrDepartmentsQuery,
      Types.QueryBambooHrDepartmentsQueryVariables
    >(Documents.QueryBambooHrDepartments, { properties: properties });
  }

  /**
   * Queries BambooHR divisions.
   * @param properties - The BambooHR division query properties.
   * @returns The BambooHR divisions.
   */
  public async queryBambooHRDivisions(
    properties: Types.BambooHrOptionsInput,
  ): Promise<Types.QueryBambooHrDivisionsQuery> {
    return this.queryAndCheckError<
      Types.QueryBambooHrDivisionsQuery,
      Types.QueryBambooHrDivisionsQueryVariables
    >(Documents.QueryBambooHrDivisions, { properties: properties });
  }

  /**
   * Queries BambooHR employment statuses.
   * @param properties - The BambooHR employment status query properties.
   * @returns The BambooHR employment statuses.
   */
  public async queryBambooHREmploymentStatuses(
    properties: Types.BambooHrOptionsInput,
  ): Promise<Types.QueryBambooHrEmploymentStatusesQuery> {
    return this.queryAndCheckError<
      Types.QueryBambooHrEmploymentStatusesQuery,
      Types.QueryBambooHrEmploymentStatusesQueryVariables
    >(Documents.QueryBambooHrEmploymentStatuses, { properties: properties });
  }

  /**
   * Queries BambooHR locations.
   * @param properties - The BambooHR location query properties.
   * @returns The BambooHR locations.
   */
  public async queryBambooHRLocations(
    properties: Types.BambooHrOptionsInput,
  ): Promise<Types.QueryBambooHrLocationsQuery> {
    return this.queryAndCheckError<
      Types.QueryBambooHrLocationsQuery,
      Types.QueryBambooHrLocationsQueryVariables
    >(Documents.QueryBambooHrLocations, { properties: properties });
  }

  /**
   * Queries Confluence spaces.
   * @param properties - The Confluence space query properties.
   * @returns The Confluence spaces.
   */
  public async queryConfluenceSpaces(
    properties: Types.ConfluenceSpacesInput,
  ): Promise<Types.QueryConfluenceSpacesQuery> {
    return this.queryAndCheckError<
      Types.QueryConfluenceSpacesQuery,
      Types.QueryConfluenceSpacesQueryVariables
    >(Documents.QueryConfluenceSpaces, { properties: properties });
  }

  /**
   * Queries Atlassian sites.
   * @param properties - The Atlassian site query properties.
   * @returns The Atlassian sites.
   */
  public async queryAtlassianSites(
    properties: Types.AtlassianSitesInput,
  ): Promise<Types.QueryAtlassianSitesQuery> {
    return this.queryAndCheckError<
      Types.QueryAtlassianSitesQuery,
      Types.QueryAtlassianSitesQueryVariables
    >(Documents.QueryAtlassianSites, { properties: properties });
  }

  /**
   * Queries Jira projects.
   * @param properties - The Jira project query properties.
   * @returns The Jira projects.
   */
  public async queryJiraProjects(
    properties: Types.JiraProjectsInput,
  ): Promise<Types.QueryJiraProjectsQuery> {
    return this.queryAndCheckError<
      Types.QueryJiraProjectsQuery,
      Types.QueryJiraProjectsQueryVariables
    >(Documents.QueryJiraProjects, { properties: properties });
  }

  /**
   * Queries Gusto companies.
   * @param properties - The Gusto company query properties.
   * @returns The Gusto companies.
   */
  public async queryGustoCompanies(
    properties: Types.GustoCompaniesInput,
  ): Promise<Types.QueryGustoCompaniesQuery> {
    return this.queryAndCheckError<
      Types.QueryGustoCompaniesQuery,
      Types.QueryGustoCompaniesQueryVariables
    >(Documents.QueryGustoCompanies, { properties: properties });
  }

  /**
   * Queries Gusto departments.
   * @param properties - The Gusto department query properties.
   * @returns The Gusto departments.
   */
  public async queryGustoDepartments(
    properties: Types.GustoOptionsInput,
  ): Promise<Types.QueryGustoDepartmentsQuery> {
    return this.queryAndCheckError<
      Types.QueryGustoDepartmentsQuery,
      Types.QueryGustoDepartmentsQueryVariables
    >(Documents.QueryGustoDepartments, { properties: properties });
  }

  /**
   * Queries Gusto locations.
   * @param properties - The Gusto location query properties.
   * @returns The Gusto locations.
   */
  public async queryGustoLocations(
    properties: Types.GustoOptionsInput,
  ): Promise<Types.QueryGustoLocationsQuery> {
    return this.queryAndCheckError<
      Types.QueryGustoLocationsQuery,
      Types.QueryGustoLocationsQueryVariables
    >(Documents.QueryGustoLocations, { properties: properties });
  }

  /**
   * Queries Monday boards.
   * @param properties - The Monday board query properties.
   * @returns The Monday boards.
   */
  public async queryMondayBoards(
    properties: Types.MondayBoardsInput,
  ): Promise<Types.QueryMondayBoardsQuery> {
    return this.queryAndCheckError<
      Types.QueryMondayBoardsQuery,
      Types.QueryMondayBoardsQueryVariables
    >(Documents.QueryMondayBoards, { properties: properties });
  }

  /**
   * Creates a feed.
   * @param feed - The feed to create.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The created feed.
   */
  public async createFeed(
    feed: Types.FeedInput,
    correlationId?: string,
  ): Promise<Types.CreateFeedMutation> {
    return this.mutateAndCheckError<
      Types.CreateFeedMutation,
      Types.CreateFeedMutationVariables
    >(Documents.CreateFeed, { feed: feed, correlationId: correlationId });
  }

  /**
   * Updates a feed.
   * @param feed - The feed to update.
   * @returns The updated feed.
   */
  public async updateFeed(
    feed: Types.FeedUpdateInput,
  ): Promise<Types.UpdateFeedMutation> {
    return this.mutateAndCheckError<
      Types.UpdateFeedMutation,
      Types.UpdateFeedMutationVariables
    >(Documents.UpdateFeed, { feed: feed });
  }

  /**
   * Deletes a feed.
   * @param id - The ID of the feed to delete.
   * @returns The deleted feed.
   */
  public async deleteFeed(id: string): Promise<Types.DeleteFeedMutation> {
    return this.mutateAndCheckError<
      Types.DeleteFeedMutation,
      Types.DeleteFeedMutationVariables
    >(Documents.DeleteFeed, { id: id });
  }

  /**
   * Deletes multiple feeds.
   * @param ids - The IDs of the feeds to delete.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @returns The deleted feeds.
   */
  public async deleteFeeds(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteFeedsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteFeedsMutation,
      Types.DeleteFeedsMutationVariables
    >(Documents.DeleteFeeds, { ids: ids, isSynchronous: isSynchronous });
  }

  /**
   * Deletes all feeds based on the provided filter criteria.
   * @param filter - The filter criteria to apply when deleting feeds.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The result of the deletion.
   */
  public async deleteAllFeeds(
    filter?: Types.FeedFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllFeedsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllFeedsMutation,
      Types.DeleteAllFeedsMutationVariables
    >(Documents.DeleteAllFeeds, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  /**
   * Triggers a feed to run immediately.
   * @param id - The ID of the feed to trigger.
   * @returns The triggered feed.
   */
  public async triggerFeed(id: string): Promise<Types.TriggerFeedMutation> {
    return this.mutateAndCheckError<
      Types.TriggerFeedMutation,
      Types.TriggerFeedMutationVariables
    >(Documents.TriggerFeed, { id: id });
  }

  /**
   * Enables a feed.
   * @param id - The ID of the feed to enable.
   * @returns The enabled feed.
   */
  public async enableFeed(id: string): Promise<Types.EnableFeedMutation> {
    return this.mutateAndCheckError<
      Types.EnableFeedMutation,
      Types.EnableFeedMutationVariables
    >(Documents.EnableFeed, { id: id });
  }

  /**
   * Disables a feed.
   * @param id - The ID of the feed to disable.
   * @returns The disabled feed.
   */
  public async disableFeed(id: string): Promise<Types.DisableFeedMutation> {
    return this.mutateAndCheckError<
      Types.DisableFeedMutation,
      Types.DisableFeedMutationVariables
    >(Documents.DisableFeed, { id: id });
  }

  /**
   * Lookup a feed given its ID.
   * @param id - ID of the feed.
   * @returns The feed.
   */
  public async getFeed(id: string): Promise<Types.GetFeedQuery> {
    return this.queryAndCheckError<
      Types.GetFeedQuery,
      Types.GetFeedQueryVariables
    >(Documents.GetFeed, { id: id });
  }

  /**
   * Retrieves feeds based on the provided filter criteria.
   * @param filter - The filter criteria to apply when retrieving feeds.
   * @returns The feeds.
   */
  public async queryFeeds(
    filter?: Types.FeedFilter,
  ): Promise<Types.QueryFeedsQuery> {
    return this.queryAndCheckError<
      Types.QueryFeedsQuery,
      Types.QueryFeedsQueryVariables
    >(Documents.QueryFeeds, { filter: filter });
  }

  /**
   * Counts feeds based on the provided filter criteria.
   * @param filter - The filter criteria to apply when counting feeds.
   * @returns The count of feeds.
   */
  public async countFeeds(
    filter?: Types.FeedFilter,
  ): Promise<Types.CountFeedsQuery> {
    return this.queryAndCheckError<
      Types.CountFeedsQuery,
      Types.CountFeedsQueryVariables
    >(Documents.CountFeeds, { filter: filter });
  }

  /**
   * Checks if a feed exists based on the provided filter criteria.
   * @param filter - The filter criteria to apply.
   * @returns Whether the feed exists.
   */
  public async feedExists(
    filter?: Types.FeedFilter,
  ): Promise<Types.FeedExistsQuery> {
    return this.queryAndCheckError<
      Types.FeedExistsQuery,
      Types.FeedExistsQueryVariables
    >(Documents.FeedExists, { filter: filter });
  }

  /**
   * Checks if feed processing is complete.
   * @param id - ID of the feed.
   * @returns Whether the feed is done processing.
   */
  public async isFeedDone(id: string): Promise<Types.IsFeedDoneQuery> {
    return this.queryAndCheckError<
      Types.IsFeedDoneQuery,
      Types.IsFeedDoneQueryVariables
    >(Documents.IsFeedDone, { id: id });
  }

  /**
   * Prompts multiple specifications and returns the best response.
   * @param prompt - The prompt to send to each specification.
   * @param ids - The IDs of the specifications to prompt.
   * @returns The best response.
   */
  public async promptSpecifications(
    prompt: string,
    ids: string[],
  ): Promise<Types.PromptSpecificationsMutation> {
    return this.mutateAndCheckError<
      Types.PromptSpecificationsMutation,
      Types.PromptSpecificationsMutationVariables
    >(Documents.PromptSpecifications, { prompt: prompt, ids: ids });
  }

  /**
   * Creates a specification (LLM configuration).
   * @param specification - The specification to create.
   * @returns The created specification.
   */
  public async createSpecification(
    specification: Types.SpecificationInput,
  ): Promise<Types.CreateSpecificationMutation> {
    return this.mutateAndCheckError<
      Types.CreateSpecificationMutation,
      Types.CreateSpecificationMutationVariables
    >(Documents.CreateSpecification, { specification: specification });
  }

  /**
   * Updates a specification.
   * @param specification - The specification to update.
   * @returns The updated specification.
   */
  public async updateSpecification(
    specification: Types.SpecificationUpdateInput,
  ): Promise<Types.UpdateSpecificationMutation> {
    return this.mutateAndCheckError<
      Types.UpdateSpecificationMutation,
      Types.UpdateSpecificationMutationVariables
    >(Documents.UpdateSpecification, { specification: specification });
  }

  /**
   * Creates or updates a specification.
   * @param specification - The specification to create or update.
   * @returns The created or updated specification.
   */
  public async upsertSpecification(
    specification: Types.SpecificationInput,
  ): Promise<Types.UpsertSpecificationMutation> {
    return this.mutateAndCheckError<
      Types.UpsertSpecificationMutation,
      Types.UpsertSpecificationMutationVariables
    >(Documents.UpsertSpecification, { specification: specification });
  }

  /**
   * Deletes a specification.
   * @param id - The ID of the specification to delete.
   * @returns The deleted specification.
   */
  public async deleteSpecification(
    id: string,
  ): Promise<Types.DeleteSpecificationMutation> {
    return this.mutateAndCheckError<
      Types.DeleteSpecificationMutation,
      Types.DeleteSpecificationMutationVariables
    >(Documents.DeleteSpecification, { id: id });
  }

  /**
   * Deletes multiple specifications.
   * @param ids - The IDs of the specifications to delete.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @returns The deleted specifications.
   */
  public async deleteSpecifications(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteSpecificationsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteSpecificationsMutation,
      Types.DeleteSpecificationsMutationVariables
    >(Documents.DeleteSpecifications, {
      ids: ids,
      isSynchronous: isSynchronous,
    });
  }

  /**
   * Deletes all specifications based on the provided filter criteria.
   * @param filter - The filter criteria to apply when deleting specifications.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The result of the deletion.
   */
  public async deleteAllSpecifications(
    filter?: Types.SpecificationFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllSpecificationsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllSpecificationsMutation,
      Types.DeleteAllSpecificationsMutationVariables
    >(Documents.DeleteAllSpecifications, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  /**
   * Lookup a specification given its ID.
   * @param id - ID of the specification.
   * @returns The specification.
   */
  public async getSpecification(
    id: string,
  ): Promise<Types.GetSpecificationQuery> {
    return this.queryAndCheckError<
      Types.GetSpecificationQuery,
      Types.GetSpecificationQueryVariables
    >(Documents.GetSpecification, { id: id });
  }

  /**
   * Retrieves specifications based on the provided filter criteria.
   * @param filter - The filter criteria to apply when retrieving specifications.
   * @returns The specifications.
   */
  public async querySpecifications(
    filter?: Types.SpecificationFilter,
  ): Promise<Types.QuerySpecificationsQuery> {
    return this.queryAndCheckError<
      Types.QuerySpecificationsQuery,
      Types.QuerySpecificationsQueryVariables
    >(Documents.QuerySpecifications, { filter: filter });
  }

  /**
   * Counts specifications based on the provided filter criteria.
   * @param filter - The filter criteria to apply when counting specifications.
   * @returns The count of specifications.
   */
  public async countSpecifications(
    filter?: Types.SpecificationFilter,
  ): Promise<Types.CountSpecificationsQuery> {
    return this.queryAndCheckError<
      Types.CountSpecificationsQuery,
      Types.CountSpecificationsQueryVariables
    >(Documents.CountSpecifications, { filter: filter });
  }

  /**
   * Checks if a specification exists based on the provided filter criteria.
   * @param filter - The filter criteria to apply.
   * @returns Whether the specification exists.
   */
  public async specificationExists(
    filter?: Types.SpecificationFilter,
  ): Promise<Types.SpecificationExistsQuery> {
    return this.queryAndCheckError<
      Types.SpecificationExistsQuery,
      Types.SpecificationExistsQueryVariables
    >(Documents.SpecificationExists, { filter: filter });
  }

  /**
   * Retrieves available LLM models based on the provided filter criteria.
   * @param filter - The filter criteria to apply when retrieving models.
   * @returns The available models.
   */
  public async queryModels(
    filter?: Types.ModelFilter,
  ): Promise<Types.QueryModelsQuery> {
    return this.queryAndCheckError<
      Types.QueryModelsQuery,
      Types.QueryModelsQueryVariables
    >(Documents.QueryModels, { filter: filter });
  }

  /**
   * Creates a connector for external integrations.
   * @param connector - The connector to create.
   * @returns The created connector.
   */
  public async createConnector(
    connector: Types.ConnectorInput,
  ): Promise<Types.CreateConnectorMutation> {
    return this.mutateAndCheckError<
      Types.CreateConnectorMutation,
      Types.CreateConnectorMutationVariables
    >(Documents.CreateConnector, { connector: connector });
  }

  /**
   * Updates a connector.
   * @param connector - The connector to update.
   * @returns The updated connector.
   */
  public async updateConnector(
    connector: Types.ConnectorUpdateInput,
  ): Promise<Types.UpdateConnectorMutation> {
    return this.mutateAndCheckError<
      Types.UpdateConnectorMutation,
      Types.UpdateConnectorMutationVariables
    >(Documents.UpdateConnector, { connector: connector });
  }

  /*
  public async upsertConnector(
    connector: Types.ConnectorInput
  ): Promise<Types.UpsertConnectorMutation> {
    return this.mutateAndCheckError<
      Types.UpsertConnectorMutation,
      { connector: Types.ConnectorInput }
    >(Documents.UpsertConnector, { connector: connector });
  }
  */

  /**
   * Deletes a connector.
   * @param id - The ID of the connector to delete.
   * @returns The deleted connector.
   */
  public async deleteConnector(
    id: string,
  ): Promise<Types.DeleteConnectorMutation> {
    return this.mutateAndCheckError<
      Types.DeleteConnectorMutation,
      Types.DeleteConnectorMutationVariables
    >(Documents.DeleteConnector, { id: id });
  }

  /*
  public async deleteConnectors(
    ids: string[],
    isSynchronous?: boolean
  ): Promise<Types.DeleteConnectorsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteConnectorsMutation,
      { ids: string[]; isSynchronous?: boolean }
    >(Documents.DeleteConnectors, { ids: ids, isSynchronous: isSynchronous });
  }

  public async deleteAllConnectors(
    filter?: Types.ConnectorFilter,
    isSynchronous?: boolean,
    correlationId?: string
  ): Promise<Types.DeleteAllConnectorsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllConnectorsMutation,
      {
        filter?: Types.ConnectorFilter;
        isSynchronous?: boolean;
        correlationId?: string;
      }
    >(Documents.DeleteAllConnectors, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }
  */

  /**
   * Lookup a connector given its ID.
   * @param id - ID of the connector.
   * @returns The connector.
   */
  public async getConnector(id: string): Promise<Types.GetConnectorQuery> {
    return this.queryAndCheckError<
      Types.GetConnectorQuery,
      Types.GetConnectorQueryVariables
    >(Documents.GetConnector, { id: id });
  }

  /**
   * Retrieves connectors based on the provided filter criteria.
   * @param filter - The filter criteria to apply when retrieving connectors.
   * @returns The connectors.
   */
  public async queryConnectors(
    filter?: Types.ConnectorFilter,
  ): Promise<Types.QueryConnectorsQuery> {
    return this.queryAndCheckError<
      Types.QueryConnectorsQuery,
      Types.QueryConnectorsQueryVariables
    >(Documents.QueryConnectors, { filter: filter });
  }

  /**
   * Counts connectors based on the provided filter criteria.
   * @param filter - The filter criteria to apply when counting connectors.
   * @returns The count of connectors.
   */
  public async countConnectors(
    filter?: Types.ConnectorFilter,
  ): Promise<Types.CountConnectorsQuery> {
    return this.queryAndCheckError<
      Types.CountConnectorsQuery,
      Types.CountConnectorsQueryVariables
    >(Documents.CountConnectors, { filter: filter });
  }

  /*
  public async connectorExists(
    filter?: Types.ConnectorFilter
  ): Promise<Types.ConnectorExistsQuery> {
    return this.queryAndCheckError<Types.QueryConnectorsQuery, Types.QueryConnectorsQueryVariables>(Documents.ConnectorExists, { filter: filter });
  }
  */

  /**
   * Creates a view for content filtering.
   * @param view - The view to create.
   * @returns The created view.
   */
  public async createView(
    view: Types.ViewInput,
  ): Promise<Types.CreateViewMutation> {
    return this.mutateAndCheckError<
      Types.CreateViewMutation,
      Types.CreateViewMutationVariables
    >(Documents.CreateView, { view: view });
  }

  /**
   * Updates a view.
   * @param view - The view to update.
   * @returns The updated view.
   */
  public async updateView(
    view: Types.ViewUpdateInput,
  ): Promise<Types.UpdateViewMutation> {
    return this.mutateAndCheckError<
      Types.UpdateViewMutation,
      Types.UpdateViewMutationVariables
    >(Documents.UpdateView, { view: view });
  }

  /**
   * Creates or updates a view.
   * @param view - The view to create or update.
   * @returns The created or updated view.
   */
  public async upsertView(
    view: Types.ViewInput,
  ): Promise<Types.UpsertViewMutation> {
    return this.mutateAndCheckError<
      Types.UpsertViewMutation,
      Types.UpsertViewMutationVariables
    >(Documents.UpsertView, { view: view });
  }

  /**
   * Deletes a view.
   * @param id - The ID of the view to delete.
   * @returns The deleted view.
   */
  public async deleteView(id: string): Promise<Types.DeleteViewMutation> {
    return this.mutateAndCheckError<
      Types.DeleteViewMutation,
      Types.DeleteViewMutationVariables
    >(Documents.DeleteView, { id: id });
  }

  /**
   * Deletes multiple views.
   * @param ids - The IDs of the views to delete.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @returns The deleted views.
   */
  public async deleteViews(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteViewsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteViewsMutation,
      Types.DeleteViewsMutationVariables
    >(Documents.DeleteViews, { ids: ids, isSynchronous: isSynchronous });
  }

  /**
   * Deletes all views based on the provided filter criteria.
   * @param filter - The filter criteria to apply when deleting views.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The result of the deletion.
   */
  public async deleteAllViews(
    filter?: Types.ViewFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllViewsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllViewsMutation,
      Types.DeleteAllViewsMutationVariables
    >(Documents.DeleteAllViews, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  /**
   * Lookup a view given its ID.
   * @param id - ID of the view.
   * @returns The view.
   */
  public async getView(id: string): Promise<Types.GetViewQuery> {
    return this.queryAndCheckError<
      Types.GetViewQuery,
      Types.GetViewQueryVariables
    >(Documents.GetView, { id: id });
  }

  /**
   * Retrieves views based on the provided filter criteria.
   * @param filter - The filter criteria to apply when retrieving views.
   * @returns The views.
   */
  public async queryViews(
    filter?: Types.ViewFilter,
  ): Promise<Types.QueryViewsQuery> {
    return this.queryAndCheckError<
      Types.QueryViewsQuery,
      Types.QueryViewsQueryVariables
    >(Documents.QueryViews, { filter: filter });
  }

  /**
   * Counts views based on the provided filter criteria.
   * @param filter - The filter criteria to apply when counting views.
   * @returns The count of views.
   */
  public async countViews(
    filter?: Types.ViewFilter,
  ): Promise<Types.CountViewsQuery> {
    return this.queryAndCheckError<
      Types.CountViewsQuery,
      Types.CountViewsQueryVariables
    >(Documents.CountViews, { filter: filter });
  }

  /**
   * Checks if a view exists based on the provided filter criteria.
   * @param filter - The filter criteria to apply.
   * @returns Whether the view exists.
   */
  public async viewExists(
    filter?: Types.ViewFilter,
  ): Promise<Types.ViewExistsQuery> {
    return this.queryAndCheckError<
      Types.ViewExistsQuery,
      Types.ViewExistsQueryVariables
    >(Documents.ViewExists, { filter: filter });
  }

  /**
   * Creates a workflow for content processing.
   * @param workflow - The workflow to create.
   * @returns The created workflow.
   */
  public async createWorkflow(
    workflow: Types.WorkflowInput,
  ): Promise<Types.CreateWorkflowMutation> {
    return this.mutateAndCheckError<
      Types.CreateWorkflowMutation,
      Types.CreateWorkflowMutationVariables
    >(Documents.CreateWorkflow, { workflow: workflow });
  }

  /**
   * Updates a workflow.
   * @param workflow - The workflow to update.
   * @returns The updated workflow.
   */
  public async updateWorkflow(
    workflow: Types.WorkflowUpdateInput,
  ): Promise<Types.UpdateWorkflowMutation> {
    return this.mutateAndCheckError<
      Types.UpdateWorkflowMutation,
      Types.UpdateWorkflowMutationVariables
    >(Documents.UpdateWorkflow, { workflow: workflow });
  }

  /**
   * Creates or updates a workflow.
   * @param workflow - The workflow to create or update.
   * @returns The created or updated workflow.
   */
  public async upsertWorkflow(
    workflow: Types.WorkflowInput,
  ): Promise<Types.UpsertWorkflowMutation> {
    return this.mutateAndCheckError<
      Types.UpsertWorkflowMutation,
      Types.UpsertWorkflowMutationVariables
    >(Documents.UpsertWorkflow, { workflow: workflow });
  }

  /**
   * Deletes a workflow.
   * @param id - The ID of the workflow to delete.
   * @returns The deleted workflow.
   */
  public async deleteWorkflow(
    id: string,
  ): Promise<Types.DeleteWorkflowMutation> {
    return this.mutateAndCheckError<
      Types.DeleteWorkflowMutation,
      Types.DeleteWorkflowMutationVariables
    >(Documents.DeleteWorkflow, { id: id });
  }

  /**
   * Deletes multiple workflows.
   * @param ids - The IDs of the workflows to delete.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @returns The deleted workflows.
   */
  public async deleteWorkflows(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteWorkflowsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteWorkflowsMutation,
      Types.DeleteWorkflowsMutationVariables
    >(Documents.DeleteWorkflows, { ids: ids, isSynchronous: isSynchronous });
  }

  /**
   * Deletes all workflows based on the provided filter criteria.
   * @param filter - The filter criteria to apply when deleting workflows.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The result of the deletion.
   */
  public async deleteAllWorkflows(
    filter?: Types.WorkflowFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllWorkflowsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllWorkflowsMutation,
      Types.DeleteAllWorkflowsMutationVariables
    >(Documents.DeleteAllWorkflows, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  /**
   * Lookup a workflow given its ID.
   * @param id - ID of the workflow.
   * @returns The workflow.
   */
  public async getWorkflow(id: string): Promise<Types.GetWorkflowQuery> {
    return this.queryAndCheckError<
      Types.GetWorkflowQuery,
      Types.GetWorkflowQueryVariables
    >(Documents.GetWorkflow, { id: id });
  }

  /**
   * Retrieves workflows based on the provided filter criteria.
   * @param filter - The filter criteria to apply when retrieving workflows.
   * @returns The workflows.
   */
  public async queryWorkflows(
    filter?: Types.WorkflowFilter,
  ): Promise<Types.QueryWorkflowsQuery> {
    return this.queryAndCheckError<
      Types.QueryWorkflowsQuery,
      Types.QueryWorkflowsQueryVariables
    >(Documents.QueryWorkflows, { filter: filter });
  }

  /**
   * Counts workflows based on the provided filter criteria.
   * @param filter - The filter criteria to apply when counting workflows.
   * @returns The count of workflows.
   */
  public async countWorkflows(
    filter?: Types.WorkflowFilter,
  ): Promise<Types.CountWorkflowsQuery> {
    return this.queryAndCheckError<
      Types.CountWorkflowsQuery,
      Types.CountWorkflowsQueryVariables
    >(Documents.CountWorkflows, { filter: filter });
  }

  /**
   * Checks if a workflow exists based on the provided filter criteria.
   * @param filter - The filter criteria to apply.
   * @returns Whether the workflow exists.
   */
  public async workflowExists(
    filter?: Types.WorkflowFilter,
  ): Promise<Types.WorkflowExistsQuery> {
    return this.queryAndCheckError<
      Types.WorkflowExistsQuery,
      Types.WorkflowExistsQueryVariables
    >(Documents.WorkflowExists, { filter: filter });
  }

  /**
   * Creates a user.
   * @param user - The user to create.
   * @returns The created user.
   */
  public async createUser(
    user: Types.UserInput,
  ): Promise<Types.CreateUserMutation> {
    return this.mutateAndCheckError<
      Types.CreateUserMutation,
      Types.CreateUserMutationVariables
    >(Documents.CreateUser, { user: user });
  }

  /**
   * Updates a user.
   * @param user - The user to update.
   * @returns The updated user.
   */
  public async updateUser(
    user: Types.UserUpdateInput,
  ): Promise<Types.UpdateUserMutation> {
    return this.mutateAndCheckError<
      Types.UpdateUserMutation,
      Types.UpdateUserMutationVariables
    >(Documents.UpdateUser, { user: user });
  }

  /**
   * Deletes a user.
   * @param id - The ID of the user to delete.
   * @returns The deleted user.
   */
  public async deleteUser(id: string): Promise<Types.DeleteUserMutation> {
    return this.mutateAndCheckError<
      Types.DeleteUserMutation,
      Types.DeleteUserMutationVariables
    >(Documents.DeleteUser, { id: id });
  }

  /**
   * Lookup a user by their external identifier.
   * @param identifier - The external identifier.
   * @returns The user.
   */
  public async getUserByIdentifier(
    identifier: string,
  ): Promise<Types.GetUserByIdentifierQuery> {
    return this.queryAndCheckError<
      Types.GetUserByIdentifierQuery,
      Types.GetUserByIdentifierQueryVariables
    >(Documents.GetUserByIdentifier, { identifier: identifier });
  }

  /**
   * Gets the current authenticated user.
   * @returns The current user.
   */
  public async getUser(): Promise<Types.GetUserQuery> {
    return this.queryAndCheckError<
      Types.GetUserQuery,
      Types.GetUserQueryVariables
    >(Documents.GetUser, {});
  }

  /**
   * Retrieves users based on the provided filter criteria.
   * @param filter - The filter criteria to apply when retrieving users.
   * @returns The users.
   */
  public async queryUsers(
    filter?: Types.UserFilter,
  ): Promise<Types.QueryUsersQuery> {
    return this.queryAndCheckError<
      Types.QueryUsersQuery,
      Types.QueryUsersQueryVariables
    >(Documents.QueryUsers, { filter: filter });
  }

  /**
   * Counts users based on the provided filter criteria.
   * @param filter - The filter criteria to apply when counting users.
   * @returns The count of users.
   */
  public async countUsers(
    filter?: Types.UserFilter,
  ): Promise<Types.CountUsersQuery> {
    return this.queryAndCheckError<
      Types.CountUsersQuery,
      Types.CountUsersQueryVariables
    >(Documents.CountUsers, { filter: filter });
  }

  /**
   * Enables a user.
   * @param id - The ID of the user to enable.
   * @returns The enabled user.
   */
  public async enableUser(id: string): Promise<Types.EnableUserMutation> {
    return this.mutateAndCheckError<
      Types.EnableUserMutation,
      Types.EnableUserMutationVariables
    >(Documents.EnableUser, { id: id });
  }

  /**
   * Disables a user.
   * @param id - The ID of the user to disable.
   * @returns The disabled user.
   */
  public async disableUser(id: string): Promise<Types.DisableUserMutation> {
    return this.mutateAndCheckError<
      Types.DisableUserMutation,
      Types.DisableUserMutationVariables
    >(Documents.DisableUser, { id: id });
  }

  /**
   * Creates a persona.
   * @param persona - The persona to create.
   * @returns The created persona.
   */
  public async createPersona(
    persona: Types.PersonaInput,
  ): Promise<Types.CreatePersonaMutation> {
    return this.mutateAndCheckError<
      Types.CreatePersonaMutation,
      Types.CreatePersonaMutationVariables
    >(Documents.CreatePersona, { persona: persona });
  }

  /**
   * Updates a persona.
   * @param persona - The persona to update.
   * @returns The updated persona.
   */
  public async updatePersona(
    persona: Types.PersonaUpdateInput,
  ): Promise<Types.UpdatePersonaMutation> {
    return this.mutateAndCheckError<
      Types.UpdatePersonaMutation,
      Types.UpdatePersonaMutationVariables
    >(Documents.UpdatePersona, { persona: persona });
  }

  /**
   * Deletes a persona.
   * @param id - The ID of the persona to delete.
   * @returns The deleted persona.
   */
  public async deletePersona(id: string): Promise<Types.DeletePersonaMutation> {
    return this.mutateAndCheckError<
      Types.DeletePersonaMutation,
      Types.DeletePersonaMutationVariables
    >(Documents.DeletePersona, { id: id });
  }

  /**
   * Deletes multiple personas.
   * @param ids - The IDs of the personas to delete.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @returns The deleted personas.
   */
  public async deletePersonas(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeletePersonasMutation> {
    return this.mutateAndCheckError<
      Types.DeletePersonasMutation,
      Types.DeletePersonasMutationVariables
    >(Documents.DeletePersonas, { ids: ids, isSynchronous: isSynchronous });
  }

  /**
   * Deletes all personas based on the provided filter criteria.
   * @param filter - The filter criteria to apply when deleting personas.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The result of the deletion.
   */
  public async deleteAllPersonas(
    filter?: Types.PersonaFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllPersonasMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllPersonasMutation,
      Types.DeleteAllPersonasMutationVariables
    >(Documents.DeleteAllPersonas, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  /**
   * Lookup a persona given its ID.
   * @param id - ID of the persona.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The persona.
   */
  public async getPersona(
    id: string,
    correlationId?: string,
  ): Promise<Types.GetPersonaQuery> {
    return this.queryAndCheckError<
      Types.GetPersonaQuery,
      Types.GetPersonaQueryVariables
    >(Documents.GetPersona, { id: id, correlationId: correlationId });
  }

  /**
   * Retrieves personas based on the provided filter criteria.
   * @param filter - The filter criteria to apply when retrieving personas.
   * @returns The personas.
   */
  public async queryPersonas(
    filter?: Types.PersonaFilter,
  ): Promise<Types.QueryPersonasQuery> {
    return this.queryAndCheckError<
      Types.QueryPersonasQuery,
      Types.QueryPersonasQueryVariables
    >(Documents.QueryPersonas, { filter: filter });
  }

  /**
   * Counts personas based on the provided filter criteria.
   * @param filter - The filter criteria to apply when counting personas.
   * @returns The count of personas.
   */
  public async countPersonas(
    filter?: Types.PersonaFilter,
  ): Promise<Types.CountPersonasQuery> {
    return this.queryAndCheckError<
      Types.CountPersonasQuery,
      Types.CountPersonasQueryVariables
    >(Documents.CountPersonas, { filter: filter });
  }

  /**
   * Creates a category for content classification.
   * @param category - The category to create.
   * @returns The created category.
   */
  public async createCategory(
    category: Types.CategoryInput,
  ): Promise<Types.CreateCategoryMutation> {
    return this.mutateAndCheckError<
      Types.CreateCategoryMutation,
      Types.CreateCategoryMutationVariables
    >(Documents.CreateCategory, { category: category });
  }

  /**
   * Updates a category.
   * @param category - The category to update.
   * @returns The updated category.
   */
  public async updateCategory(
    category: Types.CategoryUpdateInput,
  ): Promise<Types.UpdateCategoryMutation> {
    return this.mutateAndCheckError<
      Types.UpdateCategoryMutation,
      Types.UpdateCategoryMutationVariables
    >(Documents.UpdateCategory, { category: category });
  }

  /**
   * Creates or updates a category.
   * @param category - The category to create or update.
   * @returns The created or updated category.
   */
  public async upsertCategory(
    category: Types.CategoryInput,
  ): Promise<Types.UpsertCategoryMutation> {
    return this.mutateAndCheckError<
      Types.UpsertCategoryMutation,
      Types.UpsertCategoryMutationVariables
    >(Documents.UpsertCategory, { category: category });
  }

  /**
   * Deletes a category.
   * @param id - The ID of the category to delete.
   * @returns The deleted category.
   */
  public async deleteCategory(
    id: string,
  ): Promise<Types.DeleteCategoryMutation> {
    return this.mutateAndCheckError<
      Types.DeleteCategoryMutation,
      Types.DeleteCategoryMutationVariables
    >(Documents.DeleteCategory, { id: id });
  }

  /**
   * Deletes multiple categories.
   * @param ids - The IDs of the categories to delete.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @returns The deleted categories.
   */
  public async deleteCategories(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteCategoriesMutation> {
    return this.mutateAndCheckError<
      Types.DeleteCategoriesMutation,
      Types.DeleteCategoriesMutationVariables
    >(Documents.DeleteCategories, { ids: ids, isSynchronous: isSynchronous });
  }

  /**
   * Deletes all categories based on the provided filter criteria.
   * @param filter - The filter criteria to apply when deleting categories.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The result of the deletion.
   */
  public async deleteAllCategories(
    filter?: Types.CategoryFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllCategoriesMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllCategoriesMutation,
      Types.DeleteAllCategoriesMutationVariables
    >(Documents.DeleteAllCategories, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  /**
   * Lookup a category given its ID.
   * @param id - ID of the category.
   * @returns The category.
   */
  public async getCategory(id: string): Promise<Types.GetCategoryQuery> {
    return this.queryAndCheckError<
      Types.GetCategoryQuery,
      Types.GetCategoryQueryVariables
    >(Documents.GetCategory, { id: id });
  }

  /**
   * Retrieves categories based on the provided filter criteria.
   * @param filter - The filter criteria to apply when retrieving categories.
   * @returns The categories.
   */
  public async queryCategories(
    filter?: Types.CategoryFilter,
  ): Promise<Types.QueryCategoriesQuery> {
    return this.queryAndCheckError<
      Types.QueryCategoriesQuery,
      Types.QueryCategoriesQueryVariables
    >(Documents.QueryCategories, { filter: filter });
  }

  /**
   * Counts categories based on the provided filter criteria.
   * @param filter - The filter criteria to apply when counting categories.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The count of categories.
   */
  public async countCategories(
    filter?: Types.CategoryFilter,
    correlationId?: string,
  ): Promise<Types.CountCategoriesQuery> {
    return this.queryAndCheckError<
      Types.CountCategoriesQuery,
      Types.CountCategoriesQueryVariables
    >(Documents.CountCategories, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /**
   * Creates a label for content tagging.
   * @param label - The label to create.
   * @returns The created label.
   */
  public async createLabel(
    label: Types.LabelInput,
  ): Promise<Types.CreateLabelMutation> {
    return this.mutateAndCheckError<
      Types.CreateLabelMutation,
      Types.CreateLabelMutationVariables
    >(Documents.CreateLabel, { label: label });
  }

  /**
   * Updates a label.
   * @param label - The label to update.
   * @returns The updated label.
   */
  public async updateLabel(
    label: Types.LabelUpdateInput,
  ): Promise<Types.UpdateLabelMutation> {
    return this.mutateAndCheckError<
      Types.UpdateLabelMutation,
      Types.UpdateLabelMutationVariables
    >(Documents.UpdateLabel, { label: label });
  }

  /**
   * Creates or updates a label.
   * @param label - The label to create or update.
   * @returns The created or updated label.
   */
  public async upsertLabel(
    label: Types.LabelInput,
  ): Promise<Types.UpsertLabelMutation> {
    return this.mutateAndCheckError<
      Types.UpsertLabelMutation,
      Types.UpsertLabelMutationVariables
    >(Documents.UpsertLabel, { label: label });
  }

  /**
   * Deletes a label.
   * @param id - The ID of the label to delete.
   * @returns The deleted label.
   */
  public async deleteLabel(id: string): Promise<Types.DeleteLabelMutation> {
    return this.mutateAndCheckError<
      Types.DeleteLabelMutation,
      Types.DeleteLabelMutationVariables
    >(Documents.DeleteLabel, { id: id });
  }

  /**
   * Deletes multiple labels.
   * @param ids - The IDs of the labels to delete.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @returns The deleted labels.
   */
  public async deleteLabels(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteLabelsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteLabelsMutation,
      Types.DeleteLabelsMutationVariables
    >(Documents.DeleteLabels, { ids: ids, isSynchronous: isSynchronous });
  }

  /**
   * Deletes all labels based on the provided filter criteria.
   * @param filter - The filter criteria to apply when deleting labels.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The result of the deletion.
   */
  public async deleteAllLabels(
    filter?: Types.LabelFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllLabelsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllLabelsMutation,
      Types.DeleteAllLabelsMutationVariables
    >(Documents.DeleteAllLabels, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  /**
   * Lookup a label given its ID.
   * @param id - ID of the label.
   * @returns The label.
   */
  public async getLabel(id: string): Promise<Types.GetLabelQuery> {
    return this.queryAndCheckError<
      Types.GetLabelQuery,
      Types.GetLabelQueryVariables
    >(Documents.GetLabel, { id: id });
  }

  /**
   * Retrieves labels based on the provided filter criteria.
   * @param filter - The filter criteria to apply when retrieving labels.
   * @returns The labels.
   */
  public async queryLabels(
    filter?: Types.LabelFilter,
  ): Promise<Types.QueryLabelsQuery> {
    return this.queryAndCheckError<
      Types.QueryLabelsQuery,
      Types.QueryLabelsQueryVariables
    >(Documents.QueryLabels, { filter: filter });
  }

  /**
   * Counts labels based on the provided filter criteria.
   * @param filter - The filter criteria to apply when counting labels.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The count of labels.
   */
  public async countLabels(
    filter?: Types.LabelFilter,
    correlationId?: string,
  ): Promise<Types.CountLabelsQuery> {
    return this.queryAndCheckError<
      Types.CountLabelsQuery,
      Types.CountLabelsQueryVariables
    >(Documents.CountLabels, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /**
   * Creates a person entity.
   * @param person - The person to create.
   * @returns The created person.
   */
  public async createPerson(
    person: Types.PersonInput,
  ): Promise<Types.CreatePersonMutation> {
    return this.mutateAndCheckError<
      Types.CreatePersonMutation,
      Types.CreatePersonMutationVariables
    >(Documents.CreatePerson, { person: person });
  }

  /**
   * Updates a person entity.
   * @param person - The person to update.
   * @returns The updated person.
   */
  public async updatePerson(
    person: Types.PersonUpdateInput,
  ): Promise<Types.UpdatePersonMutation> {
    return this.mutateAndCheckError<
      Types.UpdatePersonMutation,
      Types.UpdatePersonMutationVariables
    >(Documents.UpdatePerson, { person: person });
  }

  /**
   * Deletes a person entity.
   * @param id - The ID of the person to delete.
   * @returns The deleted person.
   */
  public async deletePerson(id: string): Promise<Types.DeletePersonMutation> {
    return this.mutateAndCheckError<
      Types.DeletePersonMutation,
      Types.DeletePersonMutationVariables
    >(Documents.DeletePerson, { id: id });
  }

  /**
   * Deletes multiple person entities.
   * @param ids - The IDs of the persons to delete.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @returns The deleted persons.
   */
  public async deletePersons(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeletePersonsMutation> {
    return this.mutateAndCheckError<
      Types.DeletePersonsMutation,
      Types.DeletePersonsMutationVariables
    >(Documents.DeletePersons, { ids: ids, isSynchronous: isSynchronous });
  }

  /**
   * Deletes all persons based on the provided filter criteria.
   * @param filter - The filter criteria to apply when deleting persons.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The result of the deletion.
   */
  public async deleteAllPersons(
    filter?: Types.PersonFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllPersonsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllPersonsMutation,
      Types.DeleteAllPersonsMutationVariables
    >(Documents.DeleteAllPersons, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  /**
   * Lookup a person given their ID.
   * @param id - ID of the person.
   * @returns The person.
   */
  public async getPerson(id: string): Promise<Types.GetPersonQuery> {
    return this.queryAndCheckError<
      Types.GetPersonQuery,
      Types.GetPersonQueryVariables
    >(Documents.GetPerson, { id: id });
  }

  /**
   * Retrieves persons based on the provided filter criteria.
   * @param filter - The filter criteria to apply when retrieving persons.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The persons.
   */
  public async queryPersons(
    filter?: Types.PersonFilter,
    correlationId?: string,
  ): Promise<Types.QueryPersonsQuery> {
    return this.queryAndCheckError<
      Types.QueryPersonsQuery,
      Types.QueryPersonsQueryVariables
    >(Documents.QueryPersons, { filter: filter, correlationId: correlationId });
  }

  /**
   * Retrieves persons with clustering information.
   * @param filter - The filter criteria to apply when retrieving persons.
   * @param clusters - The clustering configuration.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The persons with clusters.
   */
  public async queryPersonsClusters(
    filter?: Types.PersonFilter,
    clusters?: Types.EntityClustersInput,
    correlationId?: string,
  ): Promise<Types.QueryPersonsClustersQuery> {
    return this.queryAndCheckError<
      Types.QueryPersonsClustersQuery,
      Types.QueryPersonsClustersQueryVariables
    >(Documents.QueryPersonsClusters, {
      filter: filter,
      clusters: clusters,
      correlationId: correlationId,
    });
  }

  /**
   * Retrieves persons with expanded details.
   * @param filter - The filter criteria to apply when retrieving persons.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The persons with expanded details.
   */
  public async queryPersonsExpanded(
    filter?: Types.PersonFilter,
    correlationId?: string,
  ): Promise<Types.QueryPersonsExpandedQuery> {
    return this.queryAndCheckError<
      Types.QueryPersonsExpandedQuery,
      Types.QueryPersonsExpandedQueryVariables
    >(Documents.QueryPersonsExpanded, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /**
   * Counts persons based on the provided filter criteria.
   * @param filter - The filter criteria to apply when counting persons.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The count of persons.
   */
  public async countPersons(
    filter?: Types.PersonFilter,
    correlationId?: string,
  ): Promise<Types.CountPersonsQuery> {
    return this.queryAndCheckError<
      Types.CountPersonsQuery,
      Types.CountPersonsQueryVariables
    >(Documents.CountPersons, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /**
   * Enriches persons using an external connector.
   * @param connector - The enrichment connector configuration.
   * @param filter - The filter criteria to apply when selecting persons.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The enrichment result.
   */
  public async enrichPersons(
    connector: Types.EntityEnrichmentConnectorInput,
    filter?: Types.PersonFilter,
    correlationId?: string,
  ): Promise<Types.EnrichPersonsMutation> {
    return this.mutateAndCheckError<
      Types.EnrichPersonsMutation,
      Types.EnrichPersonsMutationVariables
    >(Documents.EnrichPersons, {
      connector: connector,
      filter: filter,
      correlationId: correlationId,
    });
  }

  /**
   * Creates an organization entity.
   * @param organization - The organization to create.
   * @returns The created organization.
   */
  public async createOrganization(
    organization: Types.OrganizationInput,
  ): Promise<Types.CreateOrganizationMutation> {
    return this.mutateAndCheckError<
      Types.CreateOrganizationMutation,
      Types.CreateOrganizationMutationVariables
    >(Documents.CreateOrganization, { organization: organization });
  }

  /**
   * Updates an organization entity.
   * @param organization - The organization to update.
   * @returns The updated organization.
   */
  public async updateOrganization(
    organization: Types.OrganizationUpdateInput,
  ): Promise<Types.UpdateOrganizationMutation> {
    return this.mutateAndCheckError<
      Types.UpdateOrganizationMutation,
      Types.UpdateOrganizationMutationVariables
    >(Documents.UpdateOrganization, { organization: organization });
  }

  /**
   * Deletes an organization entity.
   * @param id - The ID of the organization to delete.
   * @returns The deleted organization.
   */
  public async deleteOrganization(
    id: string,
  ): Promise<Types.DeleteOrganizationMutation> {
    return this.mutateAndCheckError<
      Types.DeleteOrganizationMutation,
      Types.DeleteOrganizationMutationVariables
    >(Documents.DeleteOrganization, { id: id });
  }

  /**
   * Deletes multiple organization entities.
   * @param ids - The IDs of the organizations to delete.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @returns The deleted organizations.
   */
  public async deleteOrganizations(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteOrganizationsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteOrganizationsMutation,
      Types.DeleteOrganizationsMutationVariables
    >(Documents.DeleteOrganizations, {
      ids: ids,
      isSynchronous: isSynchronous,
    });
  }

  /**
   * Deletes all organizations based on the provided filter criteria.
   * @param filter - The filter criteria to apply when deleting organizations.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The result of the deletion.
   */
  public async deleteAllOrganizations(
    filter?: Types.OrganizationFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllOrganizationsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllOrganizationsMutation,
      Types.DeleteAllOrganizationsMutationVariables
    >(Documents.DeleteAllOrganizations, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  /**
   * Lookup an organization given its ID.
   * @param id - ID of the organization.
   * @returns The organization.
   */
  public async getOrganization(
    id: string,
  ): Promise<Types.GetOrganizationQuery> {
    return this.queryAndCheckError<
      Types.GetOrganizationQuery,
      Types.GetOrganizationQueryVariables
    >(Documents.GetOrganization, { id: id });
  }

  /**
   * Retrieves organizations based on the provided filter criteria.
   * @param filter - The filter criteria to apply when retrieving organizations.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The organizations.
   */
  public async queryOrganizations(
    filter?: Types.OrganizationFilter,
    correlationId?: string,
  ): Promise<Types.QueryOrganizationsQuery> {
    return this.queryAndCheckError<
      Types.QueryOrganizationsQuery,
      Types.QueryOrganizationsQueryVariables
    >(Documents.QueryOrganizations, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /**
   * Retrieves organizations with clustering information.
   * @param filter - The filter criteria to apply when retrieving organizations.
   * @param clusters - The clustering configuration.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The organizations with clusters.
   */
  public async queryOrganizationsClusters(
    filter?: Types.OrganizationFilter,
    clusters?: Types.EntityClustersInput,
    correlationId?: string,
  ): Promise<Types.QueryOrganizationsClustersQuery> {
    return this.queryAndCheckError<
      Types.QueryOrganizationsClustersQuery,
      Types.QueryOrganizationsClustersQueryVariables
    >(Documents.QueryOrganizationsClusters, {
      filter: filter,
      clusters: clusters,
      correlationId: correlationId,
    });
  }

  /**
   * Retrieves organizations with expanded details.
   * @param filter - The filter criteria to apply when retrieving organizations.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The organizations with expanded details.
   */
  public async queryOrganizationsExpanded(
    filter?: Types.OrganizationFilter,
    correlationId?: string,
  ): Promise<Types.QueryOrganizationsExpandedQuery> {
    return this.queryAndCheckError<
      Types.QueryOrganizationsExpandedQuery,
      Types.QueryOrganizationsExpandedQueryVariables
    >(Documents.QueryOrganizationsExpanded, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /**
   * Counts organizations based on the provided filter criteria.
   * @param filter - The filter criteria to apply when counting organizations.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The count of organizations.
   */
  public async countOrganizations(
    filter?: Types.OrganizationFilter,
    correlationId?: string,
  ): Promise<Types.CountOrganizationsQuery> {
    return this.queryAndCheckError<
      Types.CountOrganizationsQuery,
      Types.CountOrganizationsQueryVariables
    >(Documents.CountOrganizations, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /**
   * Enriches organizations using an external connector.
   * @param connector - The enrichment connector configuration.
   * @param filter - The filter criteria to apply when selecting organizations.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The enrichment result.
   */
  public async enrichOrganizations(
    connector: Types.EntityEnrichmentConnectorInput,
    filter?: Types.OrganizationFilter,
    correlationId?: string,
  ): Promise<Types.EnrichOrganizationsMutation> {
    return this.mutateAndCheckError<
      Types.EnrichOrganizationsMutation,
      Types.EnrichOrganizationsMutationVariables
    >(Documents.EnrichOrganizations, {
      connector: connector,
      filter: filter,
      correlationId: correlationId,
    });
  }

  /**
   * Creates a place entity.
   * @param place - The place to create.
   * @returns The created place.
   */
  public async createPlace(
    place: Types.PlaceInput,
  ): Promise<Types.CreatePlaceMutation> {
    return this.mutateAndCheckError<
      Types.CreatePlaceMutation,
      Types.CreatePlaceMutationVariables
    >(Documents.CreatePlace, { place: place });
  }

  /**
   * Updates a place entity.
   * @param place - The place to update.
   * @returns The updated place.
   */
  public async updatePlace(
    place: Types.PlaceUpdateInput,
  ): Promise<Types.UpdatePlaceMutation> {
    return this.mutateAndCheckError<
      Types.UpdatePlaceMutation,
      Types.UpdatePlaceMutationVariables
    >(Documents.UpdatePlace, { place: place });
  }

  /**
   * Deletes a place entity.
   * @param id - The ID of the place to delete.
   * @returns The deleted place.
   */
  public async deletePlace(id: string): Promise<Types.DeletePlaceMutation> {
    return this.mutateAndCheckError<
      Types.DeletePlaceMutation,
      Types.DeletePlaceMutationVariables
    >(Documents.DeletePlace, { id: id });
  }

  /**
   * Deletes multiple place entities.
   * @param ids - The IDs of the places to delete.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @returns The deleted places.
   */
  public async deletePlaces(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeletePlacesMutation> {
    return this.mutateAndCheckError<
      Types.DeletePlacesMutation,
      Types.DeletePlacesMutationVariables
    >(Documents.DeletePlaces, { ids: ids, isSynchronous: isSynchronous });
  }

  /**
   * Deletes all places based on the provided filter criteria.
   * @param filter - The filter criteria to apply when deleting places.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The result of the deletion.
   */
  public async deleteAllPlaces(
    filter?: Types.PlaceFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllPlacesMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllPlacesMutation,
      Types.DeleteAllPlacesMutationVariables
    >(Documents.DeleteAllPlaces, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  /**
   * Lookup a place given its ID.
   * @param id - ID of the place.
   * @returns The place.
   */
  public async getPlace(id: string): Promise<Types.GetPlaceQuery> {
    return this.queryAndCheckError<
      Types.GetPlaceQuery,
      Types.GetPlaceQueryVariables
    >(Documents.GetPlace, { id: id });
  }

  /**
   * Retrieves places based on the provided filter criteria.
   * @param filter - The filter criteria to apply when retrieving places.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The places.
   */
  public async queryPlaces(
    filter?: Types.PlaceFilter,
    correlationId?: string,
  ): Promise<Types.QueryPlacesQuery> {
    return this.queryAndCheckError<
      Types.QueryPlacesQuery,
      Types.QueryPlacesQueryVariables
    >(Documents.QueryPlaces, { filter: filter, correlationId: correlationId });
  }

  /**
   * Retrieves places with clustering information.
   * @param filter - The filter criteria to apply when retrieving places.
   * @param clusters - The clustering configuration.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The places with clusters.
   */
  public async queryPlacesClusters(
    filter?: Types.PlaceFilter,
    clusters?: Types.EntityClustersInput,
    correlationId?: string,
  ): Promise<Types.QueryPlacesClustersQuery> {
    return this.queryAndCheckError<
      Types.QueryPlacesClustersQuery,
      Types.QueryPlacesClustersQueryVariables
    >(Documents.QueryPlacesClusters, {
      filter: filter,
      clusters: clusters,
      correlationId: correlationId,
    });
  }

  /**
   * Counts places based on the provided filter criteria.
   * @param filter - The filter criteria to apply when counting places.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The count of places.
   */
  public async countPlaces(
    filter?: Types.PlaceFilter,
    correlationId?: string,
  ): Promise<Types.CountPlacesQuery> {
    return this.queryAndCheckError<
      Types.CountPlacesQuery,
      Types.CountPlacesQueryVariables
    >(Documents.CountPlaces, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /**
   * Enriches places using an external connector.
   * @param connector - The enrichment connector configuration.
   * @param filter - The filter criteria to apply when selecting places.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The enrichment result.
   */
  public async enrichPlaces(
    connector: Types.EntityEnrichmentConnectorInput,
    filter?: Types.PlaceFilter,
    correlationId?: string,
  ): Promise<Types.EnrichPlacesMutation> {
    return this.mutateAndCheckError<
      Types.EnrichPlacesMutation,
      Types.EnrichPlacesMutationVariables
    >(Documents.EnrichPlaces, {
      connector: connector,
      filter: filter,
      correlationId: correlationId,
    });
  }

  /**
   * Creates an emotion entity.
   * @param emotion - The emotion to create.
   * @returns The created emotion.
   */
  public async createEmotion(
    emotion: Types.EmotionInput,
  ): Promise<Types.CreateEmotionMutation> {
    return this.mutateAndCheckError<
      Types.CreateEmotionMutation,
      Types.CreateEmotionMutationVariables
    >(Documents.CreateEmotion, { emotion: emotion });
  }

  /**
   * Updates an emotion entity.
   * @param emotion - The emotion to update.
   * @returns The updated emotion.
   */
  public async updateEmotion(
    emotion: Types.EmotionUpdateInput,
  ): Promise<Types.UpdateEmotionMutation> {
    return this.mutateAndCheckError<
      Types.UpdateEmotionMutation,
      Types.UpdateEmotionMutationVariables
    >(Documents.UpdateEmotion, { emotion: emotion });
  }

  /**
   * Deletes an emotion entity.
   * @param id - The ID of the emotion to delete.
   * @returns The deleted emotion.
   */
  public async deleteEmotion(id: string): Promise<Types.DeleteEmotionMutation> {
    return this.mutateAndCheckError<
      Types.DeleteEmotionMutation,
      Types.DeleteEmotionMutationVariables
    >(Documents.DeleteEmotion, { id: id });
  }

  /**
   * Deletes multiple emotion entities.
   * @param ids - The IDs of the emotions to delete.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @returns The deleted emotions.
   */
  public async deleteEmotions(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteEmotionsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteEmotionsMutation,
      Types.DeleteEmotionsMutationVariables
    >(Documents.DeleteEmotions, { ids: ids, isSynchronous: isSynchronous });
  }

  /**
   * Deletes all emotions based on the provided filter criteria.
   * @param filter - The filter criteria to apply when deleting emotions.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The result of the deletion.
   */
  public async deleteAllEmotions(
    filter?: Types.EmotionFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllEmotionsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllEmotionsMutation,
      Types.DeleteAllEmotionsMutationVariables
    >(Documents.DeleteAllEmotions, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  /**
   * Lookup an emotion given its ID.
   * @param id - ID of the emotion.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The emotion.
   */
  public async getEmotion(
    id: string,
    correlationId?: string,
  ): Promise<Types.GetEmotionQuery> {
    return this.queryAndCheckError<
      Types.GetEmotionQuery,
      Types.GetEmotionQueryVariables
    >(Documents.GetEmotion, { id: id, correlationId: correlationId });
  }

  /**
   * Retrieves emotions based on the provided filter criteria.
   * @param filter - The filter criteria to apply when retrieving emotions.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The emotions.
   */
  public async queryEmotions(
    filter?: Types.EmotionFilter,
    correlationId?: string,
  ): Promise<Types.QueryEmotionsQuery> {
    return this.queryAndCheckError<
      Types.QueryEmotionsQuery,
      Types.QueryEmotionsQueryVariables
    >(Documents.QueryEmotions, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /**
   * Counts emotions based on the provided filter criteria.
   * @param filter - The filter criteria to apply when counting emotions.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The count of emotions.
   */
  public async countEmotions(
    filter?: Types.EmotionFilter,
    correlationId?: string,
  ): Promise<Types.CountEmotionsQuery> {
    return this.queryAndCheckError<
      Types.CountEmotionsQuery,
      Types.CountEmotionsQueryVariables
    >(Documents.CountEmotions, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /**
   * Creates an event entity.
   * @param event - The event to create.
   * @returns The created event.
   */
  public async createEvent(
    event: Types.EventInput,
  ): Promise<Types.CreateEventMutation> {
    return this.mutateAndCheckError<
      Types.CreateEventMutation,
      Types.CreateEventMutationVariables
    >(Documents.CreateEvent, { event: event });
  }

  /**
   * Updates an event entity.
   * @param event - The event to update.
   * @returns The updated event.
   */
  public async updateEvent(
    event: Types.EventUpdateInput,
  ): Promise<Types.UpdateEventMutation> {
    return this.mutateAndCheckError<
      Types.UpdateEventMutation,
      Types.UpdateEventMutationVariables
    >(Documents.UpdateEvent, { event: event });
  }

  /**
   * Deletes an event entity.
   * @param id - The ID of the event to delete.
   * @returns The deleted event.
   */
  public async deleteEvent(id: string): Promise<Types.DeleteEventMutation> {
    return this.mutateAndCheckError<
      Types.DeleteEventMutation,
      Types.DeleteEventMutationVariables
    >(Documents.DeleteEvent, { id: id });
  }

  /**
   * Deletes multiple event entities.
   * @param ids - The IDs of the events to delete.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @returns The deleted events.
   */
  public async deleteEvents(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteEventsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteEventsMutation,
      Types.DeleteEventsMutationVariables
    >(Documents.DeleteEvents, { ids: ids, isSynchronous: isSynchronous });
  }

  /**
   * Deletes all events based on the provided filter criteria.
   * @param filter - The filter criteria to apply when deleting events.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The result of the deletion.
   */
  public async deleteAllEvents(
    filter?: Types.EventFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllEventsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllEventsMutation,
      Types.DeleteAllEventsMutationVariables
    >(Documents.DeleteAllEvents, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  /**
   * Lookup an event given its ID.
   * @param id - ID of the event.
   * @returns The event.
   */
  public async getEvent(id: string): Promise<Types.GetEventQuery> {
    return this.queryAndCheckError<
      Types.GetEventQuery,
      Types.GetEventQueryVariables
    >(Documents.GetEvent, { id: id });
  }

  /**
   * Retrieves events based on the provided filter criteria.
   * @param filter - The filter criteria to apply when retrieving events.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The events.
   */
  public async queryEvents(
    filter?: Types.EventFilter,
    correlationId?: string,
  ): Promise<Types.QueryEventsQuery> {
    return this.queryAndCheckError<
      Types.QueryEventsQuery,
      Types.QueryEventsQueryVariables
    >(Documents.QueryEvents, { filter: filter, correlationId: correlationId });
  }

  /**
   * Retrieves events with clustering information.
   * @param filter - The filter criteria to apply when retrieving events.
   * @param clusters - The clustering configuration.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The events with clusters.
   */
  public async queryEventsClusters(
    filter?: Types.EventFilter,
    clusters?: Types.EntityClustersInput,
    correlationId?: string,
  ): Promise<Types.QueryEventsClustersQuery> {
    return this.queryAndCheckError<
      Types.QueryEventsClustersQuery,
      Types.QueryEventsClustersQueryVariables
    >(Documents.QueryEventsClusters, {
      filter: filter,
      clusters: clusters,
      correlationId: correlationId,
    });
  }

  /**
   * Counts events based on the provided filter criteria.
   * @param filter - The filter criteria to apply when counting events.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The count of events.
   */
  public async countEvents(
    filter?: Types.EventFilter,
    correlationId?: string,
  ): Promise<Types.CountEventsQuery> {
    return this.queryAndCheckError<
      Types.CountEventsQuery,
      Types.CountEventsQueryVariables
    >(Documents.CountEvents, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /**
   * Creates a product entity.
   * @param product - The product to create.
   * @returns The created product.
   */
  public async createProduct(
    product: Types.ProductInput,
  ): Promise<Types.CreateProductMutation> {
    return this.mutateAndCheckError<
      Types.CreateProductMutation,
      Types.CreateProductMutationVariables
    >(Documents.CreateProduct, { product: product });
  }

  /**
   * Updates a product entity.
   * @param product - The product to update.
   * @returns The updated product.
   */
  public async updateProduct(
    product: Types.ProductUpdateInput,
  ): Promise<Types.UpdateProductMutation> {
    return this.mutateAndCheckError<
      Types.UpdateProductMutation,
      Types.UpdateProductMutationVariables
    >(Documents.UpdateProduct, { product: product });
  }

  /**
   * Deletes a product entity.
   * @param id - The ID of the product to delete.
   * @returns The deleted product.
   */
  public async deleteProduct(id: string): Promise<Types.DeleteProductMutation> {
    return this.mutateAndCheckError<
      Types.DeleteProductMutation,
      Types.DeleteProductMutationVariables
    >(Documents.DeleteProduct, { id: id });
  }

  /**
   * Deletes multiple product entities.
   * @param ids - The IDs of the products to delete.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @returns The deleted products.
   */
  public async deleteProducts(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteProductsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteProductsMutation,
      Types.DeleteProductsMutationVariables
    >(Documents.DeleteProducts, { ids: ids, isSynchronous: isSynchronous });
  }

  /**
   * Deletes all products based on the provided filter criteria.
   * @param filter - The filter criteria to apply when deleting products.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The result of the deletion.
   */
  public async deleteAllProducts(
    filter?: Types.ProductFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllProductsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllProductsMutation,
      Types.DeleteAllProductsMutationVariables
    >(Documents.DeleteAllProducts, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  /**
   * Lookup a product given its ID.
   * @param id - ID of the product.
   * @returns The product.
   */
  public async getProduct(id: string): Promise<Types.GetProductQuery> {
    return this.queryAndCheckError<
      Types.GetProductQuery,
      Types.GetProductQueryVariables
    >(Documents.GetProduct, { id: id });
  }

  /**
   * Retrieves products based on the provided filter criteria.
   * @param filter - The filter criteria to apply when retrieving products.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The products.
   */
  public async queryProducts(
    filter?: Types.ProductFilter,
    correlationId?: string,
  ): Promise<Types.QueryProductsQuery> {
    return this.queryAndCheckError<
      Types.QueryProductsQuery,
      Types.QueryProductsQueryVariables
    >(Documents.QueryProducts, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /**
   * Retrieves products with clustering information.
   * @param filter - The filter criteria to apply when retrieving products.
   * @param clusters - The clustering configuration.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The products with clusters.
   */
  public async queryProductsClusters(
    filter?: Types.ProductFilter,
    clusters?: Types.EntityClustersInput,
    correlationId?: string,
  ): Promise<Types.QueryProductsClustersQuery> {
    return this.queryAndCheckError<
      Types.QueryProductsClustersQuery,
      Types.QueryProductsClustersQueryVariables
    >(Documents.QueryProductsClusters, {
      filter: filter,
      clusters: clusters,
      correlationId: correlationId,
    });
  }

  /**
   * Counts products based on the provided filter criteria.
   * @param filter - The filter criteria to apply when counting products.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The count of products.
   */
  public async countProducts(
    filter?: Types.ProductFilter,
    correlationId?: string,
  ): Promise<Types.CountProductsQuery> {
    return this.queryAndCheckError<
      Types.CountProductsQuery,
      Types.CountProductsQueryVariables
    >(Documents.CountProducts, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /**
   * Enriches products using an external connector.
   * @param connector - The enrichment connector configuration.
   * @param filter - The filter criteria to apply when selecting products.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The enrichment result.
   */
  public async enrichProducts(
    connector: Types.EntityEnrichmentConnectorInput,
    filter?: Types.ProductFilter,
    correlationId?: string,
  ): Promise<Types.EnrichProductsMutation> {
    return this.mutateAndCheckError<
      Types.EnrichProductsMutation,
      Types.EnrichProductsMutationVariables
    >(Documents.EnrichProducts, {
      connector: connector,
      filter: filter,
      correlationId: correlationId,
    });
  }

  /**
   * Creates a repo (code repository) entity.
   * @param repo - The repo to create.
   * @returns The created repo.
   */
  public async createRepo(
    repo: Types.RepoInput,
  ): Promise<Types.CreateRepoMutation> {
    return this.mutateAndCheckError<
      Types.CreateRepoMutation,
      Types.CreateRepoMutationVariables
    >(Documents.CreateRepo, { repo: repo });
  }

  /**
   * Updates a repo entity.
   * @param repo - The repo to update.
   * @returns The updated repo.
   */
  public async updateRepo(
    repo: Types.RepoUpdateInput,
  ): Promise<Types.UpdateRepoMutation> {
    return this.mutateAndCheckError<
      Types.UpdateRepoMutation,
      Types.UpdateRepoMutationVariables
    >(Documents.UpdateRepo, { repo: repo });
  }

  /**
   * Deletes a repo entity.
   * @param id - The ID of the repo to delete.
   * @returns The deleted repo.
   */
  public async deleteRepo(id: string): Promise<Types.DeleteRepoMutation> {
    return this.mutateAndCheckError<
      Types.DeleteRepoMutation,
      Types.DeleteRepoMutationVariables
    >(Documents.DeleteRepo, { id: id });
  }

  /**
   * Deletes multiple repo entities.
   * @param ids - The IDs of the repos to delete.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @returns The deleted repos.
   */
  public async deleteRepos(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteReposMutation> {
    return this.mutateAndCheckError<
      Types.DeleteReposMutation,
      Types.DeleteReposMutationVariables
    >(Documents.DeleteRepos, { ids: ids, isSynchronous: isSynchronous });
  }

  /**
   * Deletes all repos based on the provided filter criteria.
   * @param filter - The filter criteria to apply when deleting repos.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The result of the deletion.
   */
  public async deleteAllRepos(
    filter?: Types.RepoFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllReposMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllReposMutation,
      Types.DeleteAllReposMutationVariables
    >(Documents.DeleteAllRepos, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  /**
   * Lookup a repo given its ID.
   * @param id - ID of the repo.
   * @returns The repo.
   */
  public async getRepo(id: string): Promise<Types.GetRepoQuery> {
    return this.queryAndCheckError<
      Types.GetRepoQuery,
      Types.GetRepoQueryVariables
    >(Documents.GetRepo, { id: id });
  }

  /**
   * Retrieves repos based on the provided filter criteria.
   * @param filter - The filter criteria to apply when retrieving repos.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The repos.
   */
  public async queryRepos(
    filter?: Types.RepoFilter,
    correlationId?: string,
  ): Promise<Types.QueryReposQuery> {
    return this.queryAndCheckError<
      Types.QueryReposQuery,
      Types.QueryReposQueryVariables
    >(Documents.QueryRepos, { filter: filter, correlationId: correlationId });
  }

  /**
   * Retrieves repos with clustering information.
   * @param filter - The filter criteria to apply when retrieving repos.
   * @param clusters - The clustering configuration.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The repos with clusters.
   */
  public async queryReposClusters(
    filter?: Types.RepoFilter,
    clusters?: Types.EntityClustersInput,
    correlationId?: string,
  ): Promise<Types.QueryReposClustersQuery> {
    return this.queryAndCheckError<
      Types.QueryReposClustersQuery,
      Types.QueryReposClustersQueryVariables
    >(Documents.QueryReposClusters, {
      filter: filter,
      clusters: clusters,
      correlationId: correlationId,
    });
  }

  /**
   * Counts repos based on the provided filter criteria.
   * @param filter - The filter criteria to apply when counting repos.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The count of repos.
   */
  public async countRepos(
    filter?: Types.RepoFilter,
    correlationId?: string,
  ): Promise<Types.CountReposQuery> {
    return this.queryAndCheckError<
      Types.CountReposQuery,
      Types.CountReposQueryVariables
    >(Documents.CountRepos, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /**
   * Creates a software entity.
   * @param software - The software to create.
   * @returns The created software.
   */
  public async createSoftware(
    software: Types.SoftwareInput,
  ): Promise<Types.CreateSoftwareMutation> {
    return this.mutateAndCheckError<
      Types.CreateSoftwareMutation,
      Types.CreateSoftwareMutationVariables
    >(Documents.CreateSoftware, { software: software });
  }

  /**
   * Updates a software entity.
   * @param software - The software to update.
   * @returns The updated software.
   */
  public async updateSoftware(
    software: Types.SoftwareUpdateInput,
  ): Promise<Types.UpdateSoftwareMutation> {
    return this.mutateAndCheckError<
      Types.UpdateSoftwareMutation,
      Types.UpdateSoftwareMutationVariables
    >(Documents.UpdateSoftware, { software: software });
  }

  /**
   * Deletes a software entity.
   * @param id - The ID of the software to delete.
   * @returns The deleted software.
   */
  public async deleteSoftware(
    id: string,
  ): Promise<Types.DeleteSoftwareMutation> {
    return this.mutateAndCheckError<
      Types.DeleteSoftwareMutation,
      Types.DeleteSoftwareMutationVariables
    >(Documents.DeleteSoftware, { id: id });
  }

  /**
   * Deletes multiple software entities.
   * @param ids - The IDs of the software to delete.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @returns The deleted software.
   */
  public async deleteSoftwares(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteSoftwaresMutation> {
    return this.mutateAndCheckError<
      Types.DeleteSoftwaresMutation,
      Types.DeleteSoftwaresMutationVariables
    >(Documents.DeleteSoftwares, { ids: ids, isSynchronous: isSynchronous });
  }

  /**
   * Deletes all software based on the provided filter criteria.
   * @param filter - The filter criteria to apply when deleting software.
   * @param isSynchronous - Whether this mutation is synchronous.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The result of the deletion.
   */
  public async deleteAllSoftwares(
    filter?: Types.SoftwareFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllSoftwaresMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllSoftwaresMutation,
      Types.DeleteAllSoftwaresMutationVariables
    >(Documents.DeleteAllSoftwares, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  /**
   * Lookup a software given its ID.
   * @param id - ID of the software.
   * @returns The software.
   */
  public async getSoftware(id: string): Promise<Types.GetSoftwareQuery> {
    return this.queryAndCheckError<
      Types.GetSoftwareQuery,
      Types.GetSoftwareQueryVariables
    >(Documents.GetSoftware, { id: id });
  }

  /**
   * Retrieves software based on the provided filter criteria.
   * @param filter - The filter criteria to apply when retrieving software.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The software.
   */
  public async querySoftwares(
    filter?: Types.SoftwareFilter,
    correlationId?: string,
  ): Promise<Types.QuerySoftwaresQuery> {
    return this.queryAndCheckError<
      Types.QuerySoftwaresQuery,
      Types.QuerySoftwaresQueryVariables
    >(Documents.QuerySoftwares, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /**
   * Retrieves software with clustering information.
   * @param filter - The filter criteria to apply when retrieving software.
   * @param clusters - The clustering configuration.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The software with clusters.
   */
  public async querySoftwaresClusters(
    filter?: Types.SoftwareFilter,
    clusters?: Types.EntityClustersInput,
    correlationId?: string,
  ): Promise<Types.QuerySoftwaresClustersQuery> {
    return this.queryAndCheckError<
      Types.QuerySoftwaresClustersQuery,
      Types.QuerySoftwaresClustersQueryVariables
    >(Documents.QuerySoftwaresClusters, {
      filter: filter,
      clusters: clusters,
      correlationId: correlationId,
    });
  }

  /**
   * Counts software based on the provided filter criteria.
   * @param filter - The filter criteria to apply when counting software.
   * @param correlationId - The tenant correlation identifier, optional.
   * @returns The count of software.
   */
  public async countSoftwares(
    filter?: Types.SoftwareFilter,
    correlationId?: string,
  ): Promise<Types.CountSoftwaresQuery> {
    return this.queryAndCheckError<
      Types.CountSoftwaresQuery,
      Types.CountSoftwaresQueryVariables
    >(Documents.CountSoftwares, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /** Creates a medical condition entity. */
  public async createMedicalCondition(
    MedicalCondition: Types.MedicalConditionInput,
  ): Promise<Types.CreateMedicalConditionMutation> {
    return this.mutateAndCheckError<
      Types.CreateMedicalConditionMutation,
      Types.CreateMedicalConditionMutationVariables
    >(Documents.CreateMedicalCondition, { medicalCondition: MedicalCondition });
  }

  /** Updates a medical condition entity. */
  public async updateMedicalCondition(
    MedicalCondition: Types.MedicalConditionUpdateInput,
  ): Promise<Types.UpdateMedicalConditionMutation> {
    return this.mutateAndCheckError<
      Types.UpdateMedicalConditionMutation,
      Types.UpdateMedicalConditionMutationVariables
    >(Documents.UpdateMedicalCondition, { medicalCondition: MedicalCondition });
  }

  /** Deletes a medical condition entity. */
  public async deleteMedicalCondition(
    id: string,
  ): Promise<Types.DeleteMedicalConditionMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalConditionMutation,
      Types.DeleteMedicalConditionMutationVariables
    >(Documents.DeleteMedicalCondition, { id: id });
  }

  /** Deletes multiple medical condition entities. */
  public async deleteMedicalConditions(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteMedicalConditionsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalConditionsMutation,
      Types.DeleteMedicalConditionsMutationVariables
    >(Documents.DeleteMedicalConditions, {
      ids: ids,
      isSynchronous: isSynchronous,
    });
  }

  /** Deletes all medical conditions based on filter criteria. */
  public async deleteAllMedicalConditions(
    filter?: Types.MedicalConditionFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllMedicalConditionsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllMedicalConditionsMutation,
      Types.DeleteAllMedicalConditionsMutationVariables
    >(Documents.DeleteAllMedicalConditions, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  /** Lookup a medical condition given its ID. */
  public async getMedicalCondition(
    id: string,
  ): Promise<Types.GetMedicalConditionQuery> {
    return this.queryAndCheckError<
      Types.GetMedicalConditionQuery,
      Types.GetMedicalConditionQueryVariables
    >(Documents.GetMedicalCondition, { id: id });
  }

  /** Retrieves medical conditions based on filter criteria. */
  public async queryMedicalConditions(
    filter?: Types.MedicalConditionFilter,
    correlationId?: string,
  ): Promise<Types.QueryMedicalConditionsQuery> {
    return this.queryAndCheckError<
      Types.QueryMedicalConditionsQuery,
      Types.QueryMedicalConditionsQueryVariables
    >(Documents.QueryMedicalConditions, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /** Retrieves medical conditions with clustering information. */
  public async queryMedicalConditionsClusters(
    filter?: Types.MedicalConditionFilter,
    clusters?: Types.EntityClustersInput,
    correlationId?: string,
  ): Promise<Types.QueryMedicalConditionsClustersQuery> {
    return this.queryAndCheckError<
      Types.QueryMedicalConditionsClustersQuery,
      Types.QueryMedicalConditionsClustersQueryVariables
    >(Documents.QueryMedicalConditionsClusters, {
      filter: filter,
      clusters: clusters,
      correlationId: correlationId,
    });
  }

  /** Counts medical conditions based on filter criteria. */
  public async countMedicalConditions(
    filter?: Types.MedicalConditionFilter,
    correlationId?: string,
  ): Promise<Types.CountMedicalConditionsQuery> {
    return this.queryAndCheckError<
      Types.CountMedicalConditionsQuery,
      Types.CountMedicalConditionsQueryVariables
    >(Documents.CountMedicalConditions, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /** Creates a medical guideline entity. */
  public async createMedicalGuideline(
    MedicalGuideline: Types.MedicalGuidelineInput,
  ): Promise<Types.CreateMedicalGuidelineMutation> {
    return this.mutateAndCheckError<
      Types.CreateMedicalGuidelineMutation,
      Types.CreateMedicalGuidelineMutationVariables
    >(Documents.CreateMedicalGuideline, { medicalGuideline: MedicalGuideline });
  }

  /** Updates a medical guideline entity. */
  public async updateMedicalGuideline(
    MedicalGuideline: Types.MedicalGuidelineUpdateInput,
  ): Promise<Types.UpdateMedicalGuidelineMutation> {
    return this.mutateAndCheckError<
      Types.UpdateMedicalGuidelineMutation,
      Types.UpdateMedicalGuidelineMutationVariables
    >(Documents.UpdateMedicalGuideline, { medicalGuideline: MedicalGuideline });
  }

  /** Deletes a medical guideline entity. */
  public async deleteMedicalGuideline(
    id: string,
  ): Promise<Types.DeleteMedicalGuidelineMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalGuidelineMutation,
      Types.DeleteMedicalGuidelineMutationVariables
    >(Documents.DeleteMedicalGuideline, { id: id });
  }

  /** Deletes multiple medical guideline entities. */
  public async deleteMedicalGuidelines(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteMedicalGuidelinesMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalGuidelinesMutation,
      Types.DeleteMedicalGuidelinesMutationVariables
    >(Documents.DeleteMedicalGuidelines, {
      ids: ids,
      isSynchronous: isSynchronous,
    });
  }

  /** Deletes all medical guidelines based on filter criteria. */
  public async deleteAllMedicalGuidelines(
    filter?: Types.MedicalGuidelineFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllMedicalGuidelinesMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllMedicalGuidelinesMutation,
      Types.DeleteAllMedicalGuidelinesMutationVariables
    >(Documents.DeleteAllMedicalGuidelines, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  /** Lookup a medical guideline given its ID. */
  public async getMedicalGuideline(
    id: string,
  ): Promise<Types.GetMedicalGuidelineQuery> {
    return this.queryAndCheckError<
      Types.GetMedicalGuidelineQuery,
      Types.GetMedicalGuidelineQueryVariables
    >(Documents.GetMedicalGuideline, { id: id });
  }

  /** Retrieves medical guidelines based on filter criteria. */
  public async queryMedicalGuidelines(
    filter?: Types.MedicalGuidelineFilter,
    correlationId?: string,
  ): Promise<Types.QueryMedicalGuidelinesQuery> {
    return this.queryAndCheckError<
      Types.QueryMedicalGuidelinesQuery,
      Types.QueryMedicalGuidelinesQueryVariables
    >(Documents.QueryMedicalGuidelines, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /** Retrieves medical guidelines with clustering information. */
  public async queryMedicalGuidelinesClusters(
    filter?: Types.MedicalGuidelineFilter,
    clusters?: Types.EntityClustersInput,
    correlationId?: string,
  ): Promise<Types.QueryMedicalGuidelinesClustersQuery> {
    return this.queryAndCheckError<
      Types.QueryMedicalGuidelinesClustersQuery,
      Types.QueryMedicalGuidelinesClustersQueryVariables
    >(Documents.QueryMedicalGuidelinesClusters, {
      filter: filter,
      clusters: clusters,
      correlationId: correlationId,
    });
  }

  public async countMedicalGuidelines(
    filter?: Types.MedicalGuidelineFilter,
    correlationId?: string,
  ): Promise<Types.CountMedicalGuidelinesQuery> {
    return this.queryAndCheckError<
      Types.CountMedicalGuidelinesQuery,
      Types.CountMedicalGuidelinesQueryVariables
    >(Documents.CountMedicalGuidelines, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /** Creates a medical drug entity. */
  public async createMedicalDrug(
    MedicalDrug: Types.MedicalDrugInput,
  ): Promise<Types.CreateMedicalDrugMutation> {
    return this.mutateAndCheckError<
      Types.CreateMedicalDrugMutation,
      Types.CreateMedicalDrugMutationVariables
    >(Documents.CreateMedicalDrug, { medicalDrug: MedicalDrug });
  }

  /** Updates a medical drug entity. */
  public async updateMedicalDrug(
    MedicalDrug: Types.MedicalDrugUpdateInput,
  ): Promise<Types.UpdateMedicalDrugMutation> {
    return this.mutateAndCheckError<
      Types.UpdateMedicalDrugMutation,
      Types.UpdateMedicalDrugMutationVariables
    >(Documents.UpdateMedicalDrug, { medicalDrug: MedicalDrug });
  }

  /** Deletes a medical drug entity. */
  public async deleteMedicalDrug(
    id: string,
  ): Promise<Types.DeleteMedicalDrugMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalDrugMutation,
      Types.DeleteMedicalDrugMutationVariables
    >(Documents.DeleteMedicalDrug, { id: id });
  }

  /** Deletes multiple medical drug entities. */
  public async deleteMedicalDrugs(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteMedicalDrugsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalDrugsMutation,
      Types.DeleteMedicalDrugsMutationVariables
    >(Documents.DeleteMedicalDrugs, { ids: ids, isSynchronous: isSynchronous });
  }

  /** Deletes all medical drugs based on filter criteria. */
  public async deleteAllMedicalDrugs(
    filter?: Types.MedicalDrugFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllMedicalDrugsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllMedicalDrugsMutation,
      Types.DeleteAllMedicalDrugsMutationVariables
    >(Documents.DeleteAllMedicalDrugs, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  /** Lookup a medical drug given its ID. */
  public async getMedicalDrug(id: string): Promise<Types.GetMedicalDrugQuery> {
    return this.queryAndCheckError<
      Types.GetMedicalDrugQuery,
      Types.GetMedicalDrugQueryVariables
    >(Documents.GetMedicalDrug, { id: id });
  }

  /** Retrieves medical drugs based on filter criteria. */
  public async queryMedicalDrugs(
    filter?: Types.MedicalDrugFilter,
    correlationId?: string,
  ): Promise<Types.QueryMedicalDrugsQuery> {
    return this.queryAndCheckError<
      Types.QueryMedicalDrugsQuery,
      Types.QueryMedicalDrugsQueryVariables
    >(Documents.QueryMedicalDrugs, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /** Retrieves medical drugs with clustering information. */
  public async queryMedicalDrugsClusters(
    filter?: Types.MedicalDrugFilter,
    clusters?: Types.EntityClustersInput,
    correlationId?: string,
  ): Promise<Types.QueryMedicalDrugsClustersQuery> {
    return this.queryAndCheckError<
      Types.QueryMedicalDrugsClustersQuery,
      Types.QueryMedicalDrugsClustersQueryVariables
    >(Documents.QueryMedicalDrugsClusters, {
      filter: filter,
      clusters: clusters,
      correlationId: correlationId,
    });
  }

  /** Counts medical drugs based on filter criteria. */
  public async countMedicalDrugs(
    filter?: Types.MedicalDrugFilter,
    correlationId?: string,
  ): Promise<Types.CountMedicalDrugsQuery> {
    return this.queryAndCheckError<
      Types.CountMedicalDrugsQuery,
      Types.CountMedicalDrugsQueryVariables
    >(Documents.CountMedicalDrugs, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /** Creates a medical indication entity. */
  public async createMedicalIndication(
    MedicalIndication: Types.MedicalIndicationInput,
  ): Promise<Types.CreateMedicalIndicationMutation> {
    return this.mutateAndCheckError<
      Types.CreateMedicalIndicationMutation,
      Types.CreateMedicalIndicationMutationVariables
    >(Documents.CreateMedicalIndication, {
      medicalIndication: MedicalIndication,
    });
  }

  /** Updates a medical indication entity. */
  public async updateMedicalIndication(
    MedicalIndication: Types.MedicalIndicationUpdateInput,
  ): Promise<Types.UpdateMedicalIndicationMutation> {
    return this.mutateAndCheckError<
      Types.UpdateMedicalIndicationMutation,
      Types.UpdateMedicalIndicationMutationVariables
    >(Documents.UpdateMedicalIndication, {
      medicalIndication: MedicalIndication,
    });
  }

  /** Deletes a medical indication entity. */
  public async deleteMedicalIndication(
    id: string,
  ): Promise<Types.DeleteMedicalIndicationMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalIndicationMutation,
      Types.DeleteMedicalIndicationMutationVariables
    >(Documents.DeleteMedicalIndication, { id: id });
  }

  /** Deletes multiple medical indication entities. */
  public async deleteMedicalIndications(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteMedicalIndicationsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalIndicationsMutation,
      Types.DeleteMedicalIndicationsMutationVariables
    >(Documents.DeleteMedicalIndications, {
      ids: ids,
      isSynchronous: isSynchronous,
    });
  }

  /** Deletes all medical indications based on filter criteria. */
  public async deleteAllMedicalIndications(
    filter?: Types.MedicalIndicationFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllMedicalIndicationsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllMedicalIndicationsMutation,
      Types.DeleteAllMedicalIndicationsMutationVariables
    >(Documents.DeleteAllMedicalIndications, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  /** Lookup a medical indication given its ID. */
  public async getMedicalIndication(
    id: string,
  ): Promise<Types.GetMedicalIndicationQuery> {
    return this.queryAndCheckError<
      Types.GetMedicalIndicationQuery,
      Types.GetMedicalIndicationQueryVariables
    >(Documents.GetMedicalIndication, { id: id });
  }

  /** Retrieves medical indications based on filter criteria. */
  public async queryMedicalIndications(
    filter?: Types.MedicalIndicationFilter,
    correlationId?: string,
  ): Promise<Types.QueryMedicalIndicationsQuery> {
    return this.queryAndCheckError<
      Types.QueryMedicalIndicationsQuery,
      Types.QueryMedicalIndicationsQueryVariables
    >(Documents.QueryMedicalIndications, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /** Retrieves medical indications with clustering information. */
  public async queryMedicalIndicationsClusters(
    filter?: Types.MedicalIndicationFilter,
    clusters?: Types.EntityClustersInput,
    correlationId?: string,
  ): Promise<Types.QueryMedicalIndicationsClustersQuery> {
    return this.queryAndCheckError<
      Types.QueryMedicalIndicationsClustersQuery,
      Types.QueryMedicalIndicationsClustersQueryVariables
    >(Documents.QueryMedicalIndicationsClusters, {
      filter: filter,
      clusters: clusters,
      correlationId: correlationId,
    });
  }

  /** Counts medical indications based on filter criteria. */
  public async countMedicalIndications(
    filter?: Types.MedicalIndicationFilter,
    correlationId?: string,
  ): Promise<Types.CountMedicalIndicationsQuery> {
    return this.queryAndCheckError<
      Types.CountMedicalIndicationsQuery,
      Types.CountMedicalIndicationsQueryVariables
    >(Documents.CountMedicalIndications, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /** Creates a medical contraindication entity. */
  public async createMedicalContraindication(
    MedicalContraindication: Types.MedicalContraindicationInput,
  ): Promise<Types.CreateMedicalContraindicationMutation> {
    return this.mutateAndCheckError<
      Types.CreateMedicalContraindicationMutation,
      Types.CreateMedicalContraindicationMutationVariables
    >(Documents.CreateMedicalContraindication, {
      medicalContraindication: MedicalContraindication,
    });
  }

  /** Updates a medical contraindication entity. */
  public async updateMedicalContraindication(
    MedicalContraindication: Types.MedicalContraindicationUpdateInput,
  ): Promise<Types.UpdateMedicalContraindicationMutation> {
    return this.mutateAndCheckError<
      Types.UpdateMedicalContraindicationMutation,
      Types.UpdateMedicalContraindicationMutationVariables
    >(Documents.UpdateMedicalContraindication, {
      medicalContraindication: MedicalContraindication,
    });
  }

  /** Deletes a medical contraindication entity. */
  public async deleteMedicalContraindication(
    id: string,
  ): Promise<Types.DeleteMedicalContraindicationMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalContraindicationMutation,
      Types.DeleteMedicalContraindicationMutationVariables
    >(Documents.DeleteMedicalContraindication, { id: id });
  }

  /** Deletes multiple medical contraindication entities. */
  public async deleteMedicalContraindications(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteMedicalContraindicationsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalContraindicationsMutation,
      Types.DeleteMedicalContraindicationsMutationVariables
    >(Documents.DeleteMedicalContraindications, {
      ids: ids,
      isSynchronous: isSynchronous,
    });
  }

  /** Deletes all medical contraindications based on filter criteria. */
  public async deleteAllMedicalContraindications(
    filter?: Types.MedicalContraindicationFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllMedicalContraindicationsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllMedicalContraindicationsMutation,
      Types.DeleteAllMedicalContraindicationsMutationVariables
    >(Documents.DeleteAllMedicalContraindications, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  /** Lookup a medical contraindication given its ID. */
  public async getMedicalContraindication(
    id: string,
  ): Promise<Types.GetMedicalContraindicationQuery> {
    return this.queryAndCheckError<
      Types.GetMedicalContraindicationQuery,
      Types.GetMedicalContraindicationQueryVariables
    >(Documents.GetMedicalContraindication, { id: id });
  }

  /** Retrieves medical contraindications based on filter criteria. */
  public async queryMedicalContraindications(
    filter?: Types.MedicalContraindicationFilter,
    correlationId?: string,
  ): Promise<Types.QueryMedicalContraindicationsQuery> {
    return this.queryAndCheckError<
      Types.QueryMedicalContraindicationsQuery,
      Types.QueryMedicalContraindicationsQueryVariables
    >(Documents.QueryMedicalContraindications, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /** Retrieves medical contraindications with clustering information. */
  public async queryMedicalContraindicationsClusters(
    filter?: Types.MedicalContraindicationFilter,
    clusters?: Types.EntityClustersInput,
    correlationId?: string,
  ): Promise<Types.QueryMedicalContraindicationsClustersQuery> {
    return this.queryAndCheckError<
      Types.QueryMedicalContraindicationsClustersQuery,
      Types.QueryMedicalContraindicationsClustersQueryVariables
    >(Documents.QueryMedicalContraindicationsClusters, {
      filter: filter,
      clusters: clusters,
      correlationId: correlationId,
    });
  }

  /** Counts medical contraindications based on filter criteria. */
  public async countMedicalContraindications(
    filter?: Types.MedicalContraindicationFilter,
    correlationId?: string,
  ): Promise<Types.CountMedicalContraindicationsQuery> {
    return this.queryAndCheckError<
      Types.CountMedicalContraindicationsQuery,
      Types.CountMedicalContraindicationsQueryVariables
    >(Documents.CountMedicalContraindications, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /** Creates a medical test entity. */
  public async createMedicalTest(
    MedicalTest: Types.MedicalTestInput,
  ): Promise<Types.CreateMedicalTestMutation> {
    return this.mutateAndCheckError<
      Types.CreateMedicalTestMutation,
      Types.CreateMedicalTestMutationVariables
    >(Documents.CreateMedicalTest, { medicalTest: MedicalTest });
  }

  /** Updates a medical test entity. */
  public async updateMedicalTest(
    MedicalTest: Types.MedicalTestUpdateInput,
  ): Promise<Types.UpdateMedicalTestMutation> {
    return this.mutateAndCheckError<
      Types.UpdateMedicalTestMutation,
      Types.UpdateMedicalTestMutationVariables
    >(Documents.UpdateMedicalTest, { medicalTest: MedicalTest });
  }

  /** Deletes a medical test entity. */
  public async deleteMedicalTest(
    id: string,
  ): Promise<Types.DeleteMedicalTestMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalTestMutation,
      Types.DeleteMedicalTestMutationVariables
    >(Documents.DeleteMedicalTest, { id: id });
  }

  /** Deletes multiple medical test entities. */
  public async deleteMedicalTests(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteMedicalTestsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalTestsMutation,
      Types.DeleteMedicalTestsMutationVariables
    >(Documents.DeleteMedicalTests, { ids: ids, isSynchronous: isSynchronous });
  }

  /** Deletes all medical tests based on filter criteria. */
  public async deleteAllMedicalTests(
    filter?: Types.MedicalTestFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllMedicalTestsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllMedicalTestsMutation,
      Types.DeleteAllMedicalTestsMutationVariables
    >(Documents.DeleteAllMedicalTests, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  /** Lookup a medical test given its ID. */
  public async getMedicalTest(id: string): Promise<Types.GetMedicalTestQuery> {
    return this.queryAndCheckError<
      Types.GetMedicalTestQuery,
      Types.GetMedicalTestQueryVariables
    >(Documents.GetMedicalTest, { id: id });
  }

  /** Retrieves medical tests based on filter criteria. */
  public async queryMedicalTests(
    filter?: Types.MedicalTestFilter,
    correlationId?: string,
  ): Promise<Types.QueryMedicalTestsQuery> {
    return this.queryAndCheckError<
      Types.QueryMedicalTestsQuery,
      Types.QueryMedicalTestsQueryVariables
    >(Documents.QueryMedicalTests, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /** Retrieves medical tests with clustering information. */
  public async queryMedicalTestsClusters(
    filter?: Types.MedicalTestFilter,
    clusters?: Types.EntityClustersInput,
    correlationId?: string,
  ): Promise<Types.QueryMedicalTestsClustersQuery> {
    return this.queryAndCheckError<
      Types.QueryMedicalTestsClustersQuery,
      Types.QueryMedicalTestsClustersQueryVariables
    >(Documents.QueryMedicalTestsClusters, {
      filter: filter,
      clusters: clusters,
      correlationId: correlationId,
    });
  }

  /** Counts medical tests based on filter criteria. */
  public async countMedicalTests(
    filter?: Types.MedicalTestFilter,
    correlationId?: string,
  ): Promise<Types.CountMedicalTestsQuery> {
    return this.queryAndCheckError<
      Types.CountMedicalTestsQuery,
      Types.CountMedicalTestsQueryVariables
    >(Documents.CountMedicalTests, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /** Creates a medical device entity. */
  public async createMedicalDevice(
    MedicalDevice: Types.MedicalDeviceInput,
  ): Promise<Types.CreateMedicalDeviceMutation> {
    return this.mutateAndCheckError<
      Types.CreateMedicalDeviceMutation,
      Types.CreateMedicalDeviceMutationVariables
    >(Documents.CreateMedicalDevice, { medicalDevice: MedicalDevice });
  }

  /** Updates a medical device entity. */
  public async updateMedicalDevice(
    MedicalDevice: Types.MedicalDeviceUpdateInput,
  ): Promise<Types.UpdateMedicalDeviceMutation> {
    return this.mutateAndCheckError<
      Types.UpdateMedicalDeviceMutation,
      Types.UpdateMedicalDeviceMutationVariables
    >(Documents.UpdateMedicalDevice, { medicalDevice: MedicalDevice });
  }

  /** Deletes a medical device entity. */
  public async deleteMedicalDevice(
    id: string,
  ): Promise<Types.DeleteMedicalDeviceMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalDeviceMutation,
      Types.DeleteMedicalDeviceMutationVariables
    >(Documents.DeleteMedicalDevice, { id: id });
  }

  /** Deletes multiple medical device entities. */
  public async deleteMedicalDevices(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteMedicalDevicesMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalDevicesMutation,
      Types.DeleteMedicalDevicesMutationVariables
    >(Documents.DeleteMedicalDevices, {
      ids: ids,
      isSynchronous: isSynchronous,
    });
  }

  /** Deletes all medical devices based on filter criteria. */
  public async deleteAllMedicalDevices(
    filter?: Types.MedicalDeviceFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllMedicalDevicesMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllMedicalDevicesMutation,
      Types.DeleteAllMedicalDevicesMutationVariables
    >(Documents.DeleteAllMedicalDevices, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  /** Lookup a medical device given its ID. */
  public async getMedicalDevice(
    id: string,
  ): Promise<Types.GetMedicalDeviceQuery> {
    return this.queryAndCheckError<
      Types.GetMedicalDeviceQuery,
      Types.GetMedicalDeviceQueryVariables
    >(Documents.GetMedicalDevice, { id: id });
  }

  /** Retrieves medical devices based on filter criteria. */
  public async queryMedicalDevices(
    filter?: Types.MedicalDeviceFilter,
    correlationId?: string,
  ): Promise<Types.QueryMedicalDevicesQuery> {
    return this.queryAndCheckError<
      Types.QueryMedicalDevicesQuery,
      Types.QueryMedicalDevicesQueryVariables
    >(Documents.QueryMedicalDevices, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /** Retrieves medical devices with clustering information. */
  public async queryMedicalDevicesClusters(
    filter?: Types.MedicalDeviceFilter,
    clusters?: Types.EntityClustersInput,
    correlationId?: string,
  ): Promise<Types.QueryMedicalDevicesClustersQuery> {
    return this.queryAndCheckError<
      Types.QueryMedicalDevicesClustersQuery,
      Types.QueryMedicalDevicesClustersQueryVariables
    >(Documents.QueryMedicalDevicesClusters, {
      filter: filter,
      clusters: clusters,
      correlationId: correlationId,
    });
  }

  /** Counts medical devices based on filter criteria. */
  public async countMedicalDevices(
    filter?: Types.MedicalDeviceFilter,
    correlationId?: string,
  ): Promise<Types.CountMedicalDevicesQuery> {
    return this.queryAndCheckError<
      Types.CountMedicalDevicesQuery,
      Types.CountMedicalDevicesQueryVariables
    >(Documents.CountMedicalDevices, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /** Creates a medical procedure entity. */
  public async createMedicalProcedure(
    MedicalProcedure: Types.MedicalProcedureInput,
  ): Promise<Types.CreateMedicalProcedureMutation> {
    return this.mutateAndCheckError<
      Types.CreateMedicalProcedureMutation,
      Types.CreateMedicalProcedureMutationVariables
    >(Documents.CreateMedicalProcedure, { medicalProcedure: MedicalProcedure });
  }

  /** Updates a medical procedure entity. */
  public async updateMedicalProcedure(
    MedicalProcedure: Types.MedicalProcedureUpdateInput,
  ): Promise<Types.UpdateMedicalProcedureMutation> {
    return this.mutateAndCheckError<
      Types.UpdateMedicalProcedureMutation,
      Types.UpdateMedicalProcedureMutationVariables
    >(Documents.UpdateMedicalProcedure, { medicalProcedure: MedicalProcedure });
  }

  /** Deletes a medical procedure entity. */
  public async deleteMedicalProcedure(
    id: string,
  ): Promise<Types.DeleteMedicalProcedureMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalProcedureMutation,
      Types.DeleteMedicalProcedureMutationVariables
    >(Documents.DeleteMedicalProcedure, { id: id });
  }

  /** Deletes multiple medical procedure entities. */
  public async deleteMedicalProcedures(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteMedicalProceduresMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalProceduresMutation,
      Types.DeleteMedicalProceduresMutationVariables
    >(Documents.DeleteMedicalProcedures, {
      ids: ids,
      isSynchronous: isSynchronous,
    });
  }

  /** Deletes all medical procedures based on filter criteria. */
  public async deleteAllMedicalProcedures(
    filter?: Types.MedicalProcedureFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllMedicalProceduresMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllMedicalProceduresMutation,
      Types.DeleteAllMedicalProceduresMutationVariables
    >(Documents.DeleteAllMedicalProcedures, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  /** Lookup a medical procedure given its ID. */
  public async getMedicalProcedure(
    id: string,
  ): Promise<Types.GetMedicalProcedureQuery> {
    return this.queryAndCheckError<
      Types.GetMedicalProcedureQuery,
      Types.GetMedicalProcedureQueryVariables
    >(Documents.GetMedicalProcedure, { id: id });
  }

  /** Retrieves medical procedures based on filter criteria. */
  public async queryMedicalProcedures(
    filter?: Types.MedicalProcedureFilter,
    correlationId?: string,
  ): Promise<Types.QueryMedicalProceduresQuery> {
    return this.queryAndCheckError<
      Types.QueryMedicalProceduresQuery,
      Types.QueryMedicalProceduresQueryVariables
    >(Documents.QueryMedicalProcedures, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /** Retrieves medical procedures with clustering information. */
  public async queryMedicalProceduresClusters(
    filter?: Types.MedicalProcedureFilter,
    clusters?: Types.EntityClustersInput,
    correlationId?: string,
  ): Promise<Types.QueryMedicalProceduresClustersQuery> {
    return this.queryAndCheckError<
      Types.QueryMedicalProceduresClustersQuery,
      Types.QueryMedicalProceduresClustersQueryVariables
    >(Documents.QueryMedicalProceduresClusters, {
      filter: filter,
      clusters: clusters,
      correlationId: correlationId,
    });
  }

  /** Counts medical procedures based on filter criteria. */
  public async countMedicalProcedures(
    filter?: Types.MedicalProcedureFilter,
    correlationId?: string,
  ): Promise<Types.CountMedicalProceduresQuery> {
    return this.queryAndCheckError<
      Types.CountMedicalProceduresQuery,
      Types.CountMedicalProceduresQueryVariables
    >(Documents.CountMedicalProcedures, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /** Creates a medical study entity. */
  public async createMedicalStudy(
    MedicalStudy: Types.MedicalStudyInput,
  ): Promise<Types.CreateMedicalStudyMutation> {
    return this.mutateAndCheckError<
      Types.CreateMedicalStudyMutation,
      Types.CreateMedicalStudyMutationVariables
    >(Documents.CreateMedicalStudy, { medicalStudy: MedicalStudy });
  }

  /** Updates a medical study entity. */
  public async updateMedicalStudy(
    MedicalStudy: Types.MedicalStudyUpdateInput,
  ): Promise<Types.UpdateMedicalStudyMutation> {
    return this.mutateAndCheckError<
      Types.UpdateMedicalStudyMutation,
      Types.UpdateMedicalStudyMutationVariables
    >(Documents.UpdateMedicalStudy, { medicalStudy: MedicalStudy });
  }

  /** Deletes a medical study entity. */
  public async deleteMedicalStudy(
    id: string,
  ): Promise<Types.DeleteMedicalStudyMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalStudyMutation,
      Types.DeleteMedicalStudyMutationVariables
    >(Documents.DeleteMedicalStudy, { id: id });
  }

  /** Deletes multiple medical study entities. */
  public async deleteMedicalStudies(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteMedicalStudiesMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalStudiesMutation,
      Types.DeleteMedicalStudiesMutationVariables
    >(Documents.DeleteMedicalStudies, {
      ids: ids,
      isSynchronous: isSynchronous,
    });
  }

  /** Deletes all medical studies based on filter criteria. */
  public async deleteAllMedicalStudies(
    filter?: Types.MedicalStudyFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllMedicalStudiesMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllMedicalStudiesMutation,
      Types.DeleteAllMedicalStudiesMutationVariables
    >(Documents.DeleteAllMedicalStudies, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  /** Lookup a medical study given its ID. */
  public async getMedicalStudy(
    id: string,
  ): Promise<Types.GetMedicalStudyQuery> {
    return this.queryAndCheckError<
      Types.GetMedicalStudyQuery,
      Types.GetMedicalStudyQueryVariables
    >(Documents.GetMedicalStudy, { id: id });
  }

  /** Retrieves medical studies based on filter criteria. */
  public async queryMedicalStudies(
    filter?: Types.MedicalStudyFilter,
    correlationId?: string,
  ): Promise<Types.QueryMedicalStudiesQuery> {
    return this.queryAndCheckError<
      Types.QueryMedicalStudiesQuery,
      Types.QueryMedicalStudiesQueryVariables
    >(Documents.QueryMedicalStudies, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /** Retrieves medical studies with clustering information. */
  public async queryMedicalStudiesClusters(
    filter?: Types.MedicalStudyFilter,
    clusters?: Types.EntityClustersInput,
    correlationId?: string,
  ): Promise<Types.QueryMedicalStudiesClustersQuery> {
    return this.queryAndCheckError<
      Types.QueryMedicalStudiesClustersQuery,
      Types.QueryMedicalStudiesClustersQueryVariables
    >(Documents.QueryMedicalStudiesClusters, {
      filter: filter,
      clusters: clusters,
      correlationId: correlationId,
    });
  }

  /** Counts medical studies based on filter criteria. */
  public async countMedicalStudies(
    filter?: Types.MedicalStudyFilter,
    correlationId?: string,
  ): Promise<Types.CountMedicalStudiesQuery> {
    return this.queryAndCheckError<
      Types.CountMedicalStudiesQuery,
      Types.CountMedicalStudiesQueryVariables
    >(Documents.CountMedicalStudies, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /** Creates a medical drug class entity. */
  public async createMedicalDrugClass(
    MedicalDrugClass: Types.MedicalDrugClassInput,
  ): Promise<Types.CreateMedicalDrugClassMutation> {
    return this.mutateAndCheckError<
      Types.CreateMedicalDrugClassMutation,
      Types.CreateMedicalDrugClassMutationVariables
    >(Documents.CreateMedicalDrugClass, { medicalDrugClass: MedicalDrugClass });
  }

  /** Updates a medical drug class entity. */
  public async updateMedicalDrugClass(
    MedicalDrugClass: Types.MedicalDrugClassUpdateInput,
  ): Promise<Types.UpdateMedicalDrugClassMutation> {
    return this.mutateAndCheckError<
      Types.UpdateMedicalDrugClassMutation,
      Types.UpdateMedicalDrugClassMutationVariables
    >(Documents.UpdateMedicalDrugClass, { medicalDrugClass: MedicalDrugClass });
  }

  /** Deletes a medical drug class entity. */
  public async deleteMedicalDrugClass(
    id: string,
  ): Promise<Types.DeleteMedicalDrugClassMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalDrugClassMutation,
      Types.DeleteMedicalDrugClassMutationVariables
    >(Documents.DeleteMedicalDrugClass, { id: id });
  }

  /** Deletes multiple medical drug class entities. */
  public async deleteMedicalDrugClasses(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteMedicalDrugClassesMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalDrugClassesMutation,
      Types.DeleteMedicalDrugClassesMutationVariables
    >(Documents.DeleteMedicalDrugClasses, {
      ids: ids,
      isSynchronous: isSynchronous,
    });
  }

  /** Deletes all medical drug classes based on filter criteria. */
  public async deleteAllMedicalDrugClasses(
    filter?: Types.MedicalDrugClassFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllMedicalDrugClassesMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllMedicalDrugClassesMutation,
      Types.DeleteAllMedicalDrugClassesMutationVariables
    >(Documents.DeleteAllMedicalDrugClasses, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  /** Lookup a medical drug class given its ID. */
  public async getMedicalDrugClass(
    id: string,
  ): Promise<Types.GetMedicalDrugClassQuery> {
    return this.queryAndCheckError<
      Types.GetMedicalDrugClassQuery,
      Types.GetMedicalDrugClassQueryVariables
    >(Documents.GetMedicalDrugClass, { id: id });
  }

  /** Retrieves medical drug classes based on filter criteria. */
  public async queryMedicalDrugClasses(
    filter?: Types.MedicalDrugClassFilter,
    correlationId?: string,
  ): Promise<Types.QueryMedicalDrugClassesQuery> {
    return this.queryAndCheckError<
      Types.QueryMedicalDrugClassesQuery,
      Types.QueryMedicalDrugClassesQueryVariables
    >(Documents.QueryMedicalDrugClasses, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /** Retrieves medical drug classes with clustering information. */
  public async queryMedicalDrugClassesClusters(
    filter?: Types.MedicalDrugClassFilter,
    clusters?: Types.EntityClustersInput,
    correlationId?: string,
  ): Promise<Types.QueryMedicalDrugClassesClustersQuery> {
    return this.queryAndCheckError<
      Types.QueryMedicalDrugClassesClustersQuery,
      Types.QueryMedicalDrugClassesClustersQueryVariables
    >(Documents.QueryMedicalDrugClassesClusters, {
      filter: filter,
      clusters: clusters,
      correlationId: correlationId,
    });
  }

  /** Counts medical drug classes based on filter criteria. */
  public async countMedicalDrugClasses(
    filter?: Types.MedicalDrugClassFilter,
    correlationId?: string,
  ): Promise<Types.CountMedicalDrugClassesQuery> {
    return this.queryAndCheckError<
      Types.CountMedicalDrugClassesQuery,
      Types.CountMedicalDrugClassesQueryVariables
    >(Documents.CountMedicalDrugClasses, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /** Creates a medical therapy entity. */
  public async createMedicalTherapy(
    MedicalTherapy: Types.MedicalTherapyInput,
  ): Promise<Types.CreateMedicalTherapyMutation> {
    return this.mutateAndCheckError<
      Types.CreateMedicalTherapyMutation,
      Types.CreateMedicalTherapyMutationVariables
    >(Documents.CreateMedicalTherapy, { medicalTherapy: MedicalTherapy });
  }

  /** Updates a medical therapy entity. */
  public async updateMedicalTherapy(
    MedicalTherapy: Types.MedicalTherapyUpdateInput,
  ): Promise<Types.UpdateMedicalTherapyMutation> {
    return this.mutateAndCheckError<
      Types.UpdateMedicalTherapyMutation,
      Types.UpdateMedicalTherapyMutationVariables
    >(Documents.UpdateMedicalTherapy, { medicalTherapy: MedicalTherapy });
  }

  /** Deletes a medical therapy entity. */
  public async deleteMedicalTherapy(
    id: string,
  ): Promise<Types.DeleteMedicalTherapyMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalTherapyMutation,
      Types.DeleteMedicalTherapyMutationVariables
    >(Documents.DeleteMedicalTherapy, { id: id });
  }

  /** Deletes multiple medical therapy entities. */
  public async deleteMedicalTherapies(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteMedicalTherapiesMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalTherapiesMutation,
      Types.DeleteMedicalTherapiesMutationVariables
    >(Documents.DeleteMedicalTherapies, {
      ids: ids,
      isSynchronous: isSynchronous,
    });
  }

  /** Deletes all medical therapies based on filter criteria. */
  public async deleteAllMedicalTherapies(
    filter?: Types.MedicalTherapyFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllMedicalTherapiesMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllMedicalTherapiesMutation,
      Types.DeleteAllMedicalTherapiesMutationVariables
    >(Documents.DeleteAllMedicalTherapies, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  /** Lookup a medical therapy given its ID. */
  public async getMedicalTherapy(
    id: string,
  ): Promise<Types.GetMedicalTherapyQuery> {
    return this.queryAndCheckError<
      Types.GetMedicalTherapyQuery,
      Types.GetMedicalTherapyQueryVariables
    >(Documents.GetMedicalTherapy, { id: id });
  }

  /** Retrieves medical therapies based on filter criteria. */
  public async queryMedicalTherapies(
    filter?: Types.MedicalTherapyFilter,
    correlationId?: string,
  ): Promise<Types.QueryMedicalTherapiesQuery> {
    return this.queryAndCheckError<
      Types.QueryMedicalTherapiesQuery,
      Types.QueryMedicalTherapiesQueryVariables
    >(Documents.QueryMedicalTherapies, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /** Retrieves medical therapies with clustering information. */
  public async queryMedicalTherapiesClusters(
    filter?: Types.MedicalTherapyFilter,
    clusters?: Types.EntityClustersInput,
    correlationId?: string,
  ): Promise<Types.QueryMedicalTherapiesClustersQuery> {
    return this.queryAndCheckError<
      Types.QueryMedicalTherapiesClustersQuery,
      Types.QueryMedicalTherapiesClustersQueryVariables
    >(Documents.QueryMedicalTherapiesClusters, {
      filter: filter,
      clusters: clusters,
      correlationId: correlationId,
    });
  }

  /** Counts medical therapies based on filter criteria. */
  public async countMedicalTherapies(
    filter?: Types.MedicalTherapyFilter,
    correlationId?: string,
  ): Promise<Types.CountMedicalTherapiesQuery> {
    return this.queryAndCheckError<
      Types.CountMedicalTherapiesQuery,
      Types.CountMedicalTherapiesQueryVariables
    >(Documents.CountMedicalTherapies, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /** Creates an observation entity. */
  public async createObservation(
    observation: Types.ObservationInput,
  ): Promise<Types.CreateObservationMutation> {
    return this.mutateAndCheckError<
      Types.CreateObservationMutation,
      Types.CreateObservationMutationVariables
    >(Documents.CreateObservation, { observation: observation });
  }

  /** Updates an observation entity. */
  public async updateObservation(
    observation: Types.ObservationUpdateInput,
  ): Promise<Types.UpdateObservationMutation> {
    return this.mutateAndCheckError<
      Types.UpdateObservationMutation,
      Types.UpdateObservationMutationVariables
    >(Documents.UpdateObservation, { observation: observation });
  }

  /** Deletes an observation entity. */
  public async deleteObservation(
    id: string,
  ): Promise<Types.DeleteObservationMutation> {
    return this.mutateAndCheckError<
      Types.DeleteObservationMutation,
      Types.DeleteObservationMutationVariables
    >(Documents.DeleteObservation, { id: id });
  }

  /** Matches an observable against candidate entities using AI. */
  public async matchEntity(
    observable: Types.ObservableInput,
    candidates: Types.EntityReferenceInput[],
    specification?: Types.EntityReferenceInput,
    correlationId?: string,
  ): Promise<Types.MatchEntityMutation> {
    return this.mutateAndCheckError<
      Types.MatchEntityMutation,
      Types.MatchEntityMutationVariables
    >(Documents.MatchEntity, {
      observable: observable,
      candidates: candidates,
      specification: specification,
      correlationId: correlationId,
    });
  }

  /** Resolves multiple entities of a given type using AI similarity matching. */
  public async resolveEntities(
    type: Types.ObservableTypes,
    entities: Types.EntityReferenceInput[],
    threshold?: number,
    specification?: Types.EntityReferenceInput,
    correlationId?: string,
  ): Promise<Types.ResolveEntitiesMutation> {
    return this.mutateAndCheckError<
      Types.ResolveEntitiesMutation,
      Types.ResolveEntitiesMutationVariables
    >(Documents.ResolveEntities, {
      type: type,
      entities: entities,
      threshold: threshold,
      specification: specification,
      correlationId: correlationId,
    });
  }

  /** Resolves a source entity against a target entity using AI similarity matching. */
  public async resolveEntity(
    type: Types.ObservableTypes,
    source: Types.EntityReferenceInput,
    target: Types.EntityReferenceInput,
    specification?: Types.EntityReferenceInput,
    correlationId?: string,
  ): Promise<Types.ResolveEntityMutation> {
    return this.mutateAndCheckError<
      Types.ResolveEntityMutation,
      Types.ResolveEntityMutationVariables
    >(Documents.ResolveEntity, {
      type: type,
      source: source,
      target: target,
      specification: specification,
      correlationId: correlationId,
    });
  }

  /** Creates an investment entity. */
  public async createInvestment(
    investment: Types.InvestmentInput,
  ): Promise<Types.CreateInvestmentMutation> {
    return this.mutateAndCheckError<
      Types.CreateInvestmentMutation,
      Types.CreateInvestmentMutationVariables
    >(Documents.CreateInvestment, { investment: investment });
  }

  /** Updates an investment entity. */
  public async updateInvestment(
    investment: Types.InvestmentUpdateInput,
  ): Promise<Types.UpdateInvestmentMutation> {
    return this.mutateAndCheckError<
      Types.UpdateInvestmentMutation,
      Types.UpdateInvestmentMutationVariables
    >(Documents.UpdateInvestment, { investment: investment });
  }

  /** Deletes an investment entity. */
  public async deleteInvestment(
    id: string,
  ): Promise<Types.DeleteInvestmentMutation> {
    return this.mutateAndCheckError<
      Types.DeleteInvestmentMutation,
      Types.DeleteInvestmentMutationVariables
    >(Documents.DeleteInvestment, { id: id });
  }

  /** Deletes multiple investment entities. */
  public async deleteInvestments(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteInvestmentsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteInvestmentsMutation,
      Types.DeleteInvestmentsMutationVariables
    >(Documents.DeleteInvestments, {
      ids: ids,
      isSynchronous: isSynchronous,
    });
  }

  /** Deletes all investments based on filter criteria. */
  public async deleteAllInvestments(
    filter?: Types.InvestmentFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllInvestmentsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllInvestmentsMutation,
      Types.DeleteAllInvestmentsMutationVariables
    >(Documents.DeleteAllInvestments, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  /** Creates an investment fund entity. */
  public async createInvestmentFund(
    investmentFund: Types.InvestmentFundInput,
  ): Promise<Types.CreateInvestmentFundMutation> {
    return this.mutateAndCheckError<
      Types.CreateInvestmentFundMutation,
      Types.CreateInvestmentFundMutationVariables
    >(Documents.CreateInvestmentFund, { investmentFund: investmentFund });
  }

  /** Updates an investment fund entity. */
  public async updateInvestmentFund(
    investmentFund: Types.InvestmentFundUpdateInput,
  ): Promise<Types.UpdateInvestmentFundMutation> {
    return this.mutateAndCheckError<
      Types.UpdateInvestmentFundMutation,
      Types.UpdateInvestmentFundMutationVariables
    >(Documents.UpdateInvestmentFund, { investmentFund: investmentFund });
  }

  /** Deletes an investment fund entity. */
  public async deleteInvestmentFund(
    id: string,
  ): Promise<Types.DeleteInvestmentFundMutation> {
    return this.mutateAndCheckError<
      Types.DeleteInvestmentFundMutation,
      Types.DeleteInvestmentFundMutationVariables
    >(Documents.DeleteInvestmentFund, { id: id });
  }

  /** Deletes multiple investment fund entities. */
  public async deleteInvestmentFunds(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteInvestmentFundsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteInvestmentFundsMutation,
      Types.DeleteInvestmentFundsMutationVariables
    >(Documents.DeleteInvestmentFunds, {
      ids: ids,
      isSynchronous: isSynchronous,
    });
  }

  /** Deletes all investment funds based on filter criteria. */
  public async deleteAllInvestmentFunds(
    filter?: Types.InvestmentFundFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllInvestmentFundsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllInvestmentFundsMutation,
      Types.DeleteAllInvestmentFundsMutationVariables
    >(Documents.DeleteAllInvestmentFunds, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  /** Lookup an investment given its ID. */
  public async getInvestment(
    id: string,
    correlationId?: string,
  ): Promise<Types.GetInvestmentQuery> {
    return this.queryAndCheckError<
      Types.GetInvestmentQuery,
      Types.GetInvestmentQueryVariables
    >(Documents.GetInvestment, { id: id, correlationId: correlationId });
  }

  /** Retrieves investments based on filter criteria. */
  public async queryInvestments(
    filter?: Types.InvestmentFilter,
    correlationId?: string,
  ): Promise<Types.QueryInvestmentsQuery> {
    return this.queryAndCheckError<
      Types.QueryInvestmentsQuery,
      Types.QueryInvestmentsQueryVariables
    >(Documents.QueryInvestments, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /** Retrieves investments with clustering information. */
  public async queryInvestmentsClusters(
    filter?: Types.InvestmentFilter,
    clusters?: Types.EntityClustersInput,
    correlationId?: string,
  ): Promise<Types.QueryInvestmentsClustersQuery> {
    return this.queryAndCheckError<
      Types.QueryInvestmentsClustersQuery,
      Types.QueryInvestmentsClustersQueryVariables
    >(Documents.QueryInvestmentsClusters, {
      filter: filter,
      clusters: clusters,
      correlationId: correlationId,
    });
  }

  /** Retrieves investments with expanded relationship data. */
  public async queryInvestmentsExpanded(
    filter?: Types.InvestmentFilter,
    correlationId?: string,
  ): Promise<Types.QueryInvestmentsExpandedQuery> {
    return this.queryAndCheckError<
      Types.QueryInvestmentsExpandedQuery,
      Types.QueryInvestmentsExpandedQueryVariables
    >(Documents.QueryInvestmentsExpanded, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /** Counts investments based on filter criteria. */
  public async countInvestments(
    filter?: Types.InvestmentFilter,
    correlationId?: string,
  ): Promise<Types.CountInvestmentsQuery> {
    return this.queryAndCheckError<
      Types.CountInvestmentsQuery,
      Types.CountInvestmentsQueryVariables
    >(Documents.CountInvestments, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /** Lookup an investment fund given its ID. */
  public async getInvestmentFund(
    id: string,
    correlationId?: string,
  ): Promise<Types.GetInvestmentFundQuery> {
    return this.queryAndCheckError<
      Types.GetInvestmentFundQuery,
      Types.GetInvestmentFundQueryVariables
    >(Documents.GetInvestmentFund, { id: id, correlationId: correlationId });
  }

  /** Retrieves investment funds based on filter criteria. */
  public async queryInvestmentFunds(
    filter?: Types.InvestmentFundFilter,
    correlationId?: string,
  ): Promise<Types.QueryInvestmentFundsQuery> {
    return this.queryAndCheckError<
      Types.QueryInvestmentFundsQuery,
      Types.QueryInvestmentFundsQueryVariables
    >(Documents.QueryInvestmentFunds, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /** Retrieves investment funds with clustering information. */
  public async queryInvestmentFundsClusters(
    filter?: Types.InvestmentFundFilter,
    clusters?: Types.EntityClustersInput,
    correlationId?: string,
  ): Promise<Types.QueryInvestmentFundsClustersQuery> {
    return this.queryAndCheckError<
      Types.QueryInvestmentFundsClustersQuery,
      Types.QueryInvestmentFundsClustersQueryVariables
    >(Documents.QueryInvestmentFundsClusters, {
      filter: filter,
      clusters: clusters,
      correlationId: correlationId,
    });
  }

  /** Retrieves investment funds with expanded relationship data. */
  public async queryInvestmentFundsExpanded(
    filter?: Types.InvestmentFundFilter,
    correlationId?: string,
  ): Promise<Types.QueryInvestmentFundsExpandedQuery> {
    return this.queryAndCheckError<
      Types.QueryInvestmentFundsExpandedQuery,
      Types.QueryInvestmentFundsExpandedQueryVariables
    >(Documents.QueryInvestmentFundsExpanded, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /** Counts investment funds based on filter criteria. */
  public async countInvestmentFunds(
    filter?: Types.InvestmentFundFilter,
    correlationId?: string,
  ): Promise<Types.CountInvestmentFundsQuery> {
    return this.queryAndCheckError<
      Types.CountInvestmentFundsQuery,
      Types.CountInvestmentFundsQueryVariables
    >(Documents.CountInvestmentFunds, {
      filter: filter,
      correlationId: correlationId,
    });
  }

  /**
   * Creates an event handler that supports UI streaming mode
   * @internal
   */
  /**
   * Check if streaming is supported with the current configuration
   * @param specification - Optional specification to check compatibility
   * @returns true if streaming is available, false otherwise
   */
  public supportsStreaming(
    specification?: Types.Specification,
    tools?: Types.ToolDefinitionInput[],
  ): boolean {
    // If we have a full specification, check its service type
    if (specification) {
      const serviceType = specification.serviceType;

      if (process.env.DEBUG_GRAPHLIT_SDK_INITIALIZATION) {
        console.log("[supportsStreaming] Checking support for specification:", {
          specificationName: specification.name,
          serviceType,
          moduleOpenAI: OpenAI !== undefined,
          instanceOpenAI: this.openaiClient !== undefined,
          moduleAnthropic: Anthropic !== undefined,
          instanceAnthropic: this.anthropicClient !== undefined,
          moduleGoogle: GoogleGenAI !== undefined,
          instanceGoogle: this.googleClient !== undefined,
        });
      }

      switch (serviceType) {
        case Types.ModelServiceTypes.OpenAi:
          return OpenAI !== undefined || this.openaiClient !== undefined;
        case Types.ModelServiceTypes.Anthropic:
          return Anthropic !== undefined || this.anthropicClient !== undefined;
        case Types.ModelServiceTypes.Google:
          return GoogleGenAI !== undefined || this.googleClient !== undefined;
        case Types.ModelServiceTypes.Groq:
          return Groq !== undefined || this.groqClient !== undefined;
        case Types.ModelServiceTypes.Cerebras:
          return Cerebras !== undefined || this.cerebrasClient !== undefined;
        case Types.ModelServiceTypes.Cohere:
          return (
            CohereClient !== undefined ||
            CohereClientV2 !== undefined ||
            this.cohereClient !== undefined
          );
        case Types.ModelServiceTypes.Mistral:
          return Mistral !== undefined || this.mistralClient !== undefined;
        case Types.ModelServiceTypes.Bedrock:
          const hasBedrockClient =
            BedrockRuntimeClient !== undefined ||
            this.bedrockClient !== undefined;

          // Bedrock Llama models don't support tools in streaming mode
          if (hasBedrockClient && tools && tools.length > 0) {
            const bedrockModel = specification.bedrock?.model;
            if (
              bedrockModel === Types.BedrockModels.Llama_4Maverick_17B ||
              bedrockModel === Types.BedrockModels.Llama_4Scout_17B
            ) {
              if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
                console.log(
                  `⚠️ [supportsStreaming] Bedrock Llama model ${bedrockModel} does not support tools in streaming mode - will fallback to non-streaming`,
                );
              }
              return false; // Force fallback to promptAgent for tool support
            }
          }

          return hasBedrockClient;
        case Types.ModelServiceTypes.Deepseek:
          return OpenAI !== undefined || this.deepseekClient !== undefined;
        case Types.ModelServiceTypes.Xai:
          return OpenAI !== undefined || this.xaiClient !== undefined;
        default:
          return false;
      }
    }

    // If we have no specification, check if any client is available
    // Check both module-level SDKs and instance-level clients
    const hasOpenAI = OpenAI !== undefined || this.openaiClient !== undefined;
    const hasAnthropic =
      Anthropic !== undefined || this.anthropicClient !== undefined;
    const hasGoogle =
      GoogleGenAI !== undefined || this.googleClient !== undefined;
    const hasGroq = Groq !== undefined || this.groqClient !== undefined;
    const hasCerebras =
      Cerebras !== undefined || this.cerebrasClient !== undefined;
    const hasCohere =
      CohereClient !== undefined ||
      CohereClientV2 !== undefined ||
      this.cohereClient !== undefined;
    const hasMistral =
      Mistral !== undefined || this.mistralClient !== undefined;
    const hasBedrock =
      BedrockRuntimeClient !== undefined || this.bedrockClient !== undefined;
    const hasDeepseek =
      OpenAI !== undefined || this.deepseekClient !== undefined;
    const hasXai = OpenAI !== undefined || this.xaiClient !== undefined;

    return (
      hasOpenAI ||
      hasAnthropic ||
      hasGoogle ||
      hasGroq ||
      hasCerebras ||
      hasCohere ||
      hasMistral ||
      hasBedrock ||
      hasDeepseek ||
      hasXai
    );
  }

  /**
   * Execute an agent with non-streaming response
   * @param prompt - The user prompt
   * @param conversationId - Optional conversation ID to continue
   * @param specification - Optional specification for the LLM
   * @param tools - Optional tool definitions
   * @param toolHandlers - Optional tool handler functions
   * @param options - Agent options
   * @param mimeType - Optional MIME type for multimodal input
   * @param data - Optional base64 encoded data for multimodal input
   * @param contentFilter - Optional filter for content retrieval during conversation
   * @param augmentedFilter - Optional filter to force specific content into LLM context
   * @param correlationId - Optional correlation ID for tracking
   * @param persona - Optional persona to use
   * @returns Complete agent result with message and tool calls
   */
  public async promptAgent(
    prompt: string,
    conversationId?: string,
    specification?: Types.EntityReferenceInput,
    tools?: Types.ToolDefinitionInput[],
    toolHandlers?: Record<string, ToolHandler>,
    options?: AgentOptions,
    mimeType?: string,
    data?: string, // base64 encoded
    contentFilter?: Types.ContentCriteriaInput,
    augmentedFilter?: Types.ContentCriteriaInput,
    correlationId?: string,
    persona?: Types.EntityReferenceInput,
  ): Promise<AgentResult> {
    const startTime = Date.now();
    const maxRounds = options?.maxToolRounds || DEFAULT_MAX_TOOL_ROUNDS;
    const timeout = options?.timeout || 300000; // 5 minutes default

    // Create abort controller for timeout
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), timeout);

    try {
      // 1. Ensure conversation exists
      let actualConversationId = conversationId;
      if (!actualConversationId) {
        const createResponse = await this.createConversation(
          {
            name: `Agent conversation`,
            specification: specification,
            tools: tools,
            filter: contentFilter,
            augmentedFilter: augmentedFilter,
          },
          correlationId,
        );
        actualConversationId = createResponse.createConversation?.id;
        if (!actualConversationId) {
          throw new Error("Failed to create conversation");
        }
      }

      // 2. Initial prompt
      const promptResponse = await this.promptConversation(
        prompt,
        actualConversationId,
        specification,
        mimeType,
        data,
        tools,
        false, // requireTool
        undefined,
        true, // includeDetails - needed for context window tracking
        correlationId,
        persona,
      );

      let currentMessage = promptResponse.promptConversation?.message;
      if (!currentMessage) {
        throw new Error("No message in prompt response");
      }

      // Calculate and return context window usage in result
      const details = promptResponse.promptConversation?.details;
      let contextWindowUsage: AgentResult["contextWindow"] | undefined;

      if (details?.tokenLimit && details?.messages) {
        // Sum up all message tokens
        const usedTokens = details.messages.reduce(
          (sum, msg) => sum + (msg?.tokens || 0),
          0,
        );

        contextWindowUsage = {
          usedTokens,
          maxTokens: details.tokenLimit,
          percentage: Math.round((usedTokens / details.tokenLimit) * 100),
          remainingTokens: Math.max(0, details.tokenLimit - usedTokens),
        };

        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
          console.log(
            `📊 [Context Window] Using ${usedTokens.toLocaleString()}/${details.tokenLimit.toLocaleString()} tokens (${Math.round((usedTokens / details.tokenLimit) * 100)}%)`,
          );
        }
      }

      // 3. Tool calling loop
      const allToolCalls: ToolCallResult[] = [];
      let rounds = 0;
      let totalTokens = currentMessage?.tokens || 0;
      const toolStartTime = Date.now();
      let toolTime = 0;

      // Context strategy for tool result truncation
      const strategy = options?.contextStrategy ?? {};
      const toolResultTokenLimit =
        strategy.toolResultTokenLimit ??
        DEFAULT_CONTEXT_STRATEGY.toolResultTokenLimit;

      while (
        currentMessage.toolCalls?.length &&
        rounds < maxRounds &&
        !abortController.signal.aborted
      ) {
        rounds++;

        // Execute tools (with truncation)
        const toolExecStart = Date.now();
        const toolResults = await this.executeToolsForPromptAgent(
          currentMessage.toolCalls.filter(
            (tc): tc is Types.ConversationToolCall => tc !== null,
          ),
          toolHandlers || {},
          allToolCalls,
          abortController.signal,
          toolResultTokenLimit,
        );
        toolTime += Date.now() - toolExecStart;

        if (abortController.signal.aborted) {
          throw new Error("Operation timed out");
        }

        // Continue conversation
        const continueResponse = await this.continueConversation(
          actualConversationId,
          toolResults,
          correlationId,
        );

        currentMessage = continueResponse.continueConversation?.message;
        if (!currentMessage) break;

        // Track token usage
        if (continueResponse.continueConversation?.message?.tokens) {
          totalTokens += continueResponse.continueConversation.message.tokens;
        }
      }

      // Calculate metrics
      const totalTime = Date.now() - startTime;
      const llmTime = totalTime - toolTime;

      const metrics: AgentMetrics = {
        totalTime,
        llmTime,
        toolTime,
        toolExecutions: allToolCalls.length,
        rounds,
      };

      // Build usage info if we have token data
      const usage: UsageInfo | undefined =
        totalTokens > 0
          ? {
              promptTokens: 0, // We don't have this breakdown from the API
              completionTokens: totalTokens,
              totalTokens: totalTokens,
              model: currentMessage?.model || undefined,
            }
          : undefined;

      return {
        message: currentMessage?.message || "",
        conversationId: actualConversationId,
        conversationMessage: currentMessage
          ? (currentMessage as Types.ConversationMessage)
          : undefined,
        toolCalls: currentMessage?.toolCalls?.filter(
          (tc): tc is Types.ConversationToolCall => tc !== null,
        ),
        toolResults: allToolCalls,
        metrics,
        usage,
        contextWindow: contextWindowUsage,
      };
    } catch (error: any) {
      // Return partial result with error
      const isTimeout = error.message === "Operation timed out";

      return {
        message: "",
        conversationId: conversationId || "",
        error: {
          message: error.message || "Unknown error",
          code: error.code || (isTimeout ? "TIMEOUT" : "UNKNOWN"),
          recoverable: isTimeout || error.code === "RATE_LIMIT",
          details: error.response?.data,
        },
        // Include partial metrics if available
        metrics: {
          totalTime: Date.now() - startTime,
          llmTime: 0,
          toolTime: 0,
          toolExecutions: 0,
          rounds: 0,
        },
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Serializes async work per conversation ID to prevent concurrent formatConversation /
   * completeConversation calls from racing each other. Each call chains after the previous
   * one for the same conversation, so messages are always processed in order.
   */
  private enqueueForConversation(
    conversationId: string,
    work: () => Promise<void>,
    abortSignal?: AbortSignal,
  ): Promise<void> {
    const previous =
      this.conversationQueues.get(conversationId) ?? Promise.resolve();
    // Swallow errors from the previous call so a failed message doesn't
    // permanently block the queue for this conversation.
    // Check the abort signal before starting work so ESC while queued is instant.
    const next = previous
      .catch(() => {})
      .then(() => {
        if (abortSignal?.aborted) throw new Error("Operation aborted");
        return work();
      });
    this.conversationQueues.set(conversationId, next);
    next.finally(() => {
      if (this.conversationQueues.get(conversationId) === next) {
        this.conversationQueues.delete(conversationId);
      }
    });
    return next;
  }

  /**
   * Execute an agent with streaming response
   * @param prompt - The user prompt
   * @param onEvent - Event handler for streaming events
   * @param conversationId - Optional conversation ID to continue
   * @param specification - Optional specification for the LLM
   * @param tools - Optional tool definitions
   * @param toolHandlers - Optional tool handler functions
   * @param options - Stream agent options
   * @param mimeType - Optional MIME type for multimodal input
   * @param data - Optional base64 encoded data for multimodal input
   * @param contentFilter - Optional filter for content retrieval during conversation
   * @param augmentedFilter - Optional filter to force specific content into LLM context
   * @param correlationId - Optional correlation ID for tracking
   * @param persona - Optional persona to use
   * @throws Error if streaming is not supported
   */
  public async streamAgent(
    prompt: string,
    onEvent: (event: AgentStreamEvent) => void,
    conversationId?: string,
    specification?: Types.EntityReferenceInput,
    tools?: Types.ToolDefinitionInput[],
    toolHandlers?: Record<string, ToolHandler>,
    options?: StreamAgentOptions,
    mimeType?: string,
    data?: string, // base64 encoded
    contentFilter?: Types.ContentCriteriaInput,
    augmentedFilter?: Types.ContentCriteriaInput,
    correlationId?: string,
    persona?: Types.EntityReferenceInput,
  ): Promise<void> {
    const maxRounds = options?.maxToolRounds || DEFAULT_MAX_TOOL_ROUNDS;
    const abortSignal = options?.abortSignal;
    let uiAdapter: UIEventAdapter | undefined;

    // Check if already aborted
    if (abortSignal?.aborted) {
      throw new Error("Operation aborted");
    }

    try {
      // Get full specification if needed
      const fullSpec = specification?.id
        ? ((await this.getSpecification(specification.id))
            .specification as Types.Specification)
        : undefined;

      if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING && fullSpec) {
        console.log(`🔍 [streamAgent] Retrieved full specification:`, {
          id: fullSpec.id,
          name: fullSpec.name,
          serviceType: fullSpec.serviceType,
          hasDeepseek: !!fullSpec.deepseek,
          deepseekModel: fullSpec.deepseek?.model,
          deepseekModelName: fullSpec.deepseek?.modelName,
          deepseekTemperature: fullSpec.deepseek?.temperature,
        });
      }

      // Ensure conversation exists first (before streaming check)
      let actualConversationId = conversationId;
      if (!actualConversationId) {
        const createResponse = await this.createConversation(
          {
            name: `Streaming agent conversation`,
            specification: specification,
            tools: tools,
            filter: contentFilter,
            augmentedFilter: augmentedFilter,
          },
          correlationId,
        );
        actualConversationId = createResponse.createConversation?.id;
        if (!actualConversationId) {
          throw new Error("Failed to create conversation");
        }
      }

      // Serialize execution per-conversation: if the user sends a second message
      // before the first response completes, queue it so formatConversation /
      // completeConversation calls never interleave on the same conversation.
      if (this.conversationQueues.has(actualConversationId)) {
        (onEvent as (event: AgentStreamEvent) => void)({
          type: "conversation_queued",
          conversationId: actualConversationId,
          timestamp: new Date(),
        });
      }
      await this.enqueueForConversation(
        actualConversationId,
        async () => {
          // Check streaming support - fallback to promptAgent if not supported
          if (fullSpec && !this.supportsStreaming(fullSpec, tools)) {
            if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
              console.log(
                "\n⚠️ [streamAgent] Streaming not supported, falling back to promptAgent with same conversation",
              );
            }

            // Fallback to promptAgent using the same conversation and parameters
            const promptResult = await this.promptAgent(
              prompt,
              actualConversationId, // Preserve conversation
              specification,
              tools,
              toolHandlers,
              {
                maxToolRounds: maxRounds,
              },
              mimeType,
              data,
              contentFilter,
              augmentedFilter,
              correlationId,
              persona,
            );

            // Convert promptAgent result to streaming events
            onEvent({
              type: "conversation_started",
              conversationId: actualConversationId,
              timestamp: new Date(),
            });

            // Debug logging for fallback
            if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
              console.log(`📊 [streamAgent fallback] promptAgent result:`, {
                hasMessage: !!promptResult.message,
                messageLength: promptResult.message?.length,
                toolCallsCount: promptResult.toolCalls?.length || 0,
                toolResultsCount: promptResult.toolResults?.length || 0,
                toolCalls: promptResult.toolCalls,
                toolResults: promptResult.toolResults?.map((tr) => ({
                  name: tr.name,
                  hasResult: !!tr.result,
                  hasError: !!tr.error,
                })),
              });
            }

            // Emit tool events if there were tool calls
            if (promptResult.toolCalls && promptResult.toolCalls.length > 0) {
              for (const toolCall of promptResult.toolCalls) {
                onEvent({
                  type: "tool_update",
                  toolCall: toolCall,
                  status: "completed" as const,
                });
              }
            }

            // Emit the final message as a single update (simulating streaming)
            onEvent({
              type: "message_update",
              message: {
                __typename: "ConversationMessage" as const,
                message: promptResult.message,
                role: Types.ConversationRoleTypes.Assistant,
                timestamp: new Date().toISOString(),
                toolCalls: promptResult.toolCalls || [],
              },
              isStreaming: false,
            });

            // Emit completion event
            onEvent({
              type: "conversation_completed",
              message: {
                __typename: "ConversationMessage" as const,
                message: promptResult.message,
                role: Types.ConversationRoleTypes.Assistant,
                timestamp: new Date().toISOString(),
                toolCalls: promptResult.toolCalls || [],
              },
            });

            return; // Exit early after successful fallback
          }

          // Create UI event adapter with model information
          const modelName = fullSpec ? getModelName(fullSpec) : undefined;
          const modelEnum = fullSpec ? getModelEnum(fullSpec) : undefined;
          const serviceType = fullSpec ? getServiceType(fullSpec) : undefined;

          uiAdapter = new UIEventAdapter(
            onEvent as (event: AgentStreamEvent) => void,
            actualConversationId,
            {
              smoothingEnabled: options?.smoothingEnabled ?? true,
              chunkingStrategy: options?.chunkingStrategy ?? "word",
              smoothingDelay: options?.smoothingDelay ?? 30,
              model: modelEnum,
              modelName: modelName,
              modelService: serviceType,
            },
          );

          // Start the streaming conversation
          await this.executeStreamingAgent(
            prompt,
            actualConversationId,
            fullSpec!,
            tools,
            toolHandlers,
            uiAdapter,
            maxRounds,
            abortSignal,
            mimeType,
            data,
            correlationId,
            persona,
            options?.contextStrategy,
          );
        },
        abortSignal,
      );
    } catch (error: unknown) {
      const isAbortError =
        (error instanceof Error && error.message === "Operation aborted") ||
        (error instanceof DOMException && error.name === "AbortError");
      if (isAbortError) {
        (onEvent as (event: AgentStreamEvent) => void)({
          type: "conversation_cancelled",
          conversationId: conversationId || "",
          timestamp: new Date(),
        });
      } else {
        const errorMessage =
          error instanceof Error ? error.message : "Streaming failed";

        if (uiAdapter) {
          uiAdapter.handleEvent({
            type: "error",
            error: errorMessage,
          });
        } else {
          // Fallback error event
          (onEvent as (event: AgentStreamEvent) => void)({
            type: "error",
            error: {
              message: errorMessage,
              recoverable: false,
            },
            conversationId: conversationId || "",
            timestamp: new Date(),
          });
        }
      }

      throw error;
    } finally {
      // Clean up adapter
      if (uiAdapter) {
        uiAdapter.dispose();
      }
    }
  }

  /**
   * Execute the streaming agent workflow with tool calling loop
   */
  private async executeStreamingAgent(
    prompt: string,
    conversationId: string,
    specification: Types.Specification,
    tools: Types.ToolDefinitionInput[] | undefined,
    toolHandlers: Record<string, ToolHandler> | undefined,
    uiAdapter: UIEventAdapter,
    maxRounds: number,
    abortSignal: AbortSignal | undefined,
    mimeType?: string,
    data?: string,
    correlationId?: string,
    persona?: Types.EntityReferenceInput,
    contextStrategy?: ContextStrategy,
  ): Promise<void> {
    let currentRound = 0;
    let fullMessage = "";
    const contextActions: ContextManagementAction[] = [];

    // Collects artifact content IDs from tool handlers (e.g. code_execution).
    // Handlers register async ingestion promises; we await all of them before
    // completeConversation so the IDs are available without blocking the LLM.
    const pendingArtifacts: Promise<{ id: string } | undefined>[] = [];
    const artifactCollector: ArtifactCollector = {
      addPending(p) {
        pendingArtifacts.push(p);
      },
      async resolve() {
        const results = await Promise.all(pendingArtifacts);
        return results.filter((r): r is { id: string } => r != null);
      },
    };

    // Start the conversation
    uiAdapter.handleEvent({
      type: "start",
      conversationId,
    });

    // Format conversation once at the beginning
    const formatResponse = await this.formatConversation(
      prompt,
      conversationId,
      { id: specification.id },
      tools,
      undefined,
      true,
      correlationId,
      persona,
    );

    const formattedMessage = formatResponse.formatConversation?.message;
    const conversationHistory =
      formatResponse.formatConversation?.details?.messages;

    if (!formattedMessage?.message) {
      throw new Error("Failed to format conversation");
    }

    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING_FORMAT) {
      console.log(
        "\n📋 [formatConversation] Full response:",
        JSON.stringify(formatResponse, null, 2),
      );
      console.log(
        "\n📋 [formatConversation] Response - current message:",
        formattedMessage.message,
      );
      console.log(
        `📋 [formatConversation] Conversation history: ${conversationHistory?.length || 0} messages`,
      );
      if (conversationHistory && conversationHistory.length > 0) {
        console.log("📋 [formatConversation] History messages:");
        conversationHistory.forEach((msg, i) => {
          console.log(
            `  ${i + 1}. [${msg?.role}] ${msg?.message?.substring(0, 100)}...`,
          );
        });
      }
    }

    // Emit context window usage event
    const details = formatResponse.formatConversation?.details;
    if (details?.tokenLimit && details?.messages) {
      // Sum up all message tokens
      const usedTokens = details.messages.reduce(
        (sum, msg) => sum + (msg?.tokens || 0),
        0,
      );

      uiAdapter.handleEvent({
        type: "context_window",
        usage: {
          usedTokens,
          maxTokens: details.tokenLimit,
          percentage: Math.round((usedTokens / details.tokenLimit) * 100),
          remainingTokens: Math.max(0, details.tokenLimit - usedTokens),
        },
      });

      if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
        console.log(
          `📊 [Context Window] Using ${usedTokens.toLocaleString()}/${details.tokenLimit.toLocaleString()} tokens (${Math.round((usedTokens / details.tokenLimit) * 100)}%)`,
        );
      }
    }

    // Initialize context management
    const budgetTracker = details
      ? TokenBudgetTracker.fromDetails(details)
      : undefined;

    // Merge: caller overrides > server-side specification strategy > defaults
    const callerStrategy = contextStrategy ?? {};
    const serverStrategy = specification.strategy;
    const toolResultTokenLimit =
      callerStrategy.toolResultTokenLimit ??
      serverStrategy?.toolResultTokenLimit ??
      DEFAULT_CONTEXT_STRATEGY.toolResultTokenLimit;
    const toolRoundLimit =
      callerStrategy.toolRoundLimit ??
      serverStrategy?.toolRoundLimit ??
      DEFAULT_CONTEXT_STRATEGY.toolRoundLimit;
    const rebudgetThreshold =
      callerStrategy.rebudgetThreshold ??
      serverStrategy?.toolBudgetThreshold ??
      DEFAULT_CONTEXT_STRATEGY.rebudgetThreshold;

    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING && budgetTracker) {
      console.log(
        `📊 [Context Management] Initialized budget tracker: ${budgetTracker.usagePercent}% used, ` +
          `${budgetTracker.remaining.toLocaleString()} tokens remaining. ` +
          `Strategy: toolResultLimit=${toolResultTokenLimit}, toolRoundLimit=${toolRoundLimit}, ` +
          `rebudgetThreshold=${rebudgetThreshold}`,
      );
    }

    // Build message array with conversation history
    let messages: Types.ConversationMessage[] = [];

    // Add system prompt if specified
    if (specification.systemPrompt) {
      messages.push({
        __typename: "ConversationMessage" as const,
        role: Types.ConversationRoleTypes.System,
        message: specification.systemPrompt,
        timestamp: new Date().toISOString(),
      });
    }

    // Use the full conversation history from formatConversation if available
    if (conversationHistory && conversationHistory.length > 0) {
      if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
        console.log(
          `🔄 [formatConversation] Using full conversation history with ${conversationHistory.length} messages`,
        );
      }

      for (const historyMessage of conversationHistory) {
        if (historyMessage) {
          const messageToAdd: Types.ConversationMessage = {
            __typename: "ConversationMessage" as const,
            role: historyMessage.role || Types.ConversationRoleTypes.User,
            message: historyMessage.message || "",
            timestamp: historyMessage.timestamp || new Date().toISOString(),
          };

          // Add optional fields if present
          if (historyMessage.author)
            messageToAdd.author = historyMessage.author;
          if (historyMessage.data) messageToAdd.data = historyMessage.data;
          if (historyMessage.mimeType)
            messageToAdd.mimeType = historyMessage.mimeType;
          if (historyMessage.toolCalls)
            messageToAdd.toolCalls = historyMessage.toolCalls;
          if (historyMessage.toolCallId)
            messageToAdd.toolCallId = historyMessage.toolCallId;
          if (historyMessage.toolCallResponse)
            messageToAdd.toolCallResponse = historyMessage.toolCallResponse;

          messages.push(messageToAdd);
        }
      }
    } else {
      // Fallback to single formatted message (for backward compatibility)
      if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
        console.log(
          "⚠️ [formatConversation] No conversation history available, using single formatted message",
        );
      }

      const messageToAdd: Types.ConversationMessage = {
        __typename: "ConversationMessage" as const,
        role: formattedMessage.role || Types.ConversationRoleTypes.User,
        message: formattedMessage.message,
        timestamp: formattedMessage.timestamp || new Date().toISOString(),
      };

      // Add image data if provided
      if (mimeType && data) {
        messageToAdd.mimeType = mimeType;
        messageToAdd.data = data;
        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
          console.log(
            `\n🖼️ [Streaming] Adding image data to message: ${mimeType}, ${data.length} chars`,
          );
        }
      }

      messages.push(messageToAdd);
    }

    const serviceType = getServiceType(specification);

    // Handle tool calling loop locally
    while (currentRound < maxRounds) {
      if (abortSignal?.aborted) {
        throw new Error("Operation aborted");
      }

      // Context window management: check budget before sending to LLM
      if (budgetTracker && currentRound > 0) {
        if (budgetTracker.needsRebudget(rebudgetThreshold)) {
          const beforeUsage = budgetTracker.usagePercent;
          const beforeCount = messages.length;

          messages = windowToolRounds(messages, toolRoundLimit);
          budgetTracker.resetFromMessages(messages);

          const afterUsage = budgetTracker.usagePercent;
          const droppedRounds = Math.max(
            0,
            Math.floor((beforeCount - messages.length) / 2),
          );

          if (droppedRounds > 0) {
            const action: ContextManagementAction = {
              type: "windowed_tool_rounds",
              droppedRounds,
              keptRounds: toolRoundLimit,
            };
            contextActions.push(action);

            // Notify the UI
            uiAdapter.handleEvent({
              type: "context_management",
              action,
              usage: budgetTracker.getUsageSnapshot(),
              timestamp: new Date(),
            });

            if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
              console.log(
                `📊 [Context Management] Windowed tool rounds: dropped ${droppedRounds} round(s), ` +
                  `budget ${beforeUsage}% → ${afterUsage}% (${messages.length} messages)`,
              );
            }
          }

          // Emit updated context window
          uiAdapter.handleEvent({
            type: "context_window",
            usage: budgetTracker.getUsageSnapshot(),
          });
        }
      }

      let toolCalls: Types.ConversationToolCall[] = [];
      let roundMessage = "";

      // Stream with appropriate provider
      if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
        console.log(
          `\n🔀 [Streaming Decision] Service: ${serviceType}, Round: ${currentRound}`,
        );
        console.log(`   OpenAI available: ${!!(OpenAI || this.openaiClient)}`);
        console.log(
          `   Anthropic available: ${!!(Anthropic || this.anthropicClient)}`,
        );
        console.log(
          `   Google available: ${!!(GoogleGenAI || this.googleClient)}`,
        );
      }

      if (
        serviceType === Types.ModelServiceTypes.OpenAi &&
        (OpenAI || this.openaiClient)
      ) {
        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
          console.log(
            `\n✅ [Streaming] Using OpenAI native streaming (Round ${currentRound})`,
          );
        }
        const openaiMessages = formatMessagesForOpenAI(messages);
        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING_MESSAGES) {
          console.log(
            `🔍 [OpenAI] Sending ${openaiMessages.length} messages to LLM: ${JSON.stringify(openaiMessages)}`,
          );
        }
        await this.streamWithOpenAI(
          specification,
          openaiMessages,
          tools,
          uiAdapter,
          (message, calls, usage) => {
            roundMessage = message;
            toolCalls = calls;
            if (usage) {
              uiAdapter.setUsageData(usage);
            }
          },
          abortSignal,
        );
        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
          console.log(
            `\n🏁 [Streaming] OpenAI native streaming completed (Round ${currentRound})`,
          );
        }
      } else if (
        serviceType === Types.ModelServiceTypes.Anthropic &&
        (Anthropic || this.anthropicClient)
      ) {
        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
          console.log(
            `\n✅ [Streaming] Using Anthropic native streaming (Round ${currentRound})`,
          );
        }
        const { system, messages: anthropicMessages } =
          formatMessagesForAnthropic(messages);
        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING_MESSAGES) {
          console.log(
            `🔍 [Anthropic] Sending ${anthropicMessages.length} messages to LLM (system: ${system ? "yes" : "no"}): ${JSON.stringify(anthropicMessages)}`,
          );
        }
        await this.streamWithAnthropic(
          specification,
          anthropicMessages,
          system,
          tools,
          uiAdapter,
          (message, calls, usage) => {
            roundMessage = message;
            toolCalls = calls;
            if (usage) {
              uiAdapter.setUsageData(usage);
            }
          },
          abortSignal,
        );
        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
          console.log(
            `\n🏁 [Streaming] Anthropic native streaming completed (Round ${currentRound})`,
          );
        }
      } else if (
        serviceType === Types.ModelServiceTypes.Google &&
        (GoogleGenAI || this.googleClient)
      ) {
        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
          console.log(
            `\n✅ [Streaming] Using Google native streaming (Round ${currentRound})`,
          );
        }
        const googleMessages = formatMessagesForGoogle(messages);
        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING_MESSAGES) {
          console.log(
            `🔍 [Google] Sending ${googleMessages.length} messages to LLM: ${JSON.stringify(googleMessages)}`,
          );
        }
        // Google doesn't use system prompts separately, they're incorporated into messages
        await this.streamWithGoogle(
          specification,
          googleMessages,
          undefined, // systemPrompt - Google handles this differently
          tools,
          uiAdapter,
          (message, calls, usage) => {
            roundMessage = message;
            toolCalls = calls;
            if (usage) {
              uiAdapter.setUsageData(usage);
            }
          },
          abortSignal,
        );
        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
          console.log(
            `\n🏁 [Streaming] Google native streaming completed (Round ${currentRound})`,
          );
        }
      } else if (
        serviceType === Types.ModelServiceTypes.Groq &&
        (Groq || this.groqClient)
      ) {
        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
          console.log(
            `\n✅ [Streaming] Using Groq native streaming (Round ${currentRound})`,
          );
        }
        const groqMessages = formatMessagesForOpenAI(messages); // Groq uses OpenAI format
        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING_MESSAGES) {
          console.log(
            `🔍 [Groq] Sending ${groqMessages.length} messages to LLM: ${JSON.stringify(groqMessages)}`,
          );
        }
        await this.streamWithGroq(
          specification,
          groqMessages,
          tools,
          uiAdapter,
          (message, calls, usage) => {
            roundMessage = message;
            toolCalls = calls;
            if (usage) {
              uiAdapter.setUsageData(usage);
            }
          },
          abortSignal,
        );
        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
          console.log(
            `\n🏁 [Streaming] Groq native streaming completed (Round ${currentRound})`,
          );
        }
      } else if (
        serviceType === Types.ModelServiceTypes.Cerebras &&
        (Cerebras || this.cerebrasClient)
      ) {
        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
          console.log(
            `\n✅ [Streaming] Using Cerebras native streaming (Round ${currentRound})`,
          );
        }
        const cerebrasMessages = formatMessagesForOpenAI(messages); // Cerebras uses OpenAI format
        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING_MESSAGES) {
          console.log(
            `🔍 [Cerebras] Sending ${cerebrasMessages.length} messages to LLM: ${JSON.stringify(cerebrasMessages)}`,
          );
        }
        await this.streamWithCerebras(
          specification,
          cerebrasMessages,
          tools,
          uiAdapter,
          (message, calls, usage) => {
            roundMessage = message;
            toolCalls = calls;
            if (usage) {
              uiAdapter.setUsageData(usage);
            }
          },
          abortSignal,
        );
        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
          console.log(
            `\n🏁 [Streaming] Cerebras native streaming completed (Round ${currentRound})`,
          );
        }
      } else if (
        serviceType === Types.ModelServiceTypes.Cohere &&
        (CohereClient || CohereClientV2 || this.cohereClient)
      ) {
        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
          console.log(
            `\n✅ [Streaming] Using Cohere native streaming (Round ${currentRound})`,
          );
        }
        // V2 API uses raw messages, not formatted
        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING_MESSAGES) {
          console.log(`🔍 [Cohere] Sending ${messages.length} messages to LLM`);
        }
        await this.streamWithCohere(
          specification,
          messages,
          tools,
          uiAdapter,
          (message, calls, usage) => {
            roundMessage = message;
            toolCalls = calls;
            if (usage) {
              uiAdapter.setUsageData(usage);
            }
          },
          abortSignal,
        );
        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
          console.log(
            `\n🏁 [Streaming] Cohere native streaming completed (Round ${currentRound})`,
          );
        }
      } else if (
        serviceType === Types.ModelServiceTypes.Mistral &&
        (Mistral || this.mistralClient)
      ) {
        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
          console.log(
            `\n✅ [Streaming] Using Mistral native streaming (Round ${currentRound})`,
          );
        }
        const mistralMessages = formatMessagesForMistral(messages);

        // ALWAYS log when there's a tool-related issue for debugging
        const hasToolCalls = mistralMessages.some(
          (m: any) => m.tool_calls?.length > 0,
        );
        const hasToolResponses = mistralMessages.some(
          (m: any) => m.role === "tool",
        );

        // Count tool responses to determine if we should pass tools
        const toolResponseCount = mistralMessages.filter(
          (m: any) => m.role === "tool",
        ).length;

        if (
          hasToolCalls ||
          hasToolResponses ||
          process.env.DEBUG_GRAPHLIT_SDK_STREAMING_MESSAGES
        ) {
          console.log(
            `🔍 [Mistral] Sending ${mistralMessages.length} messages to LLM:`,
          );
          console.log(JSON.stringify(mistralMessages, null, 2));

          // Count tool calls and responses
          const toolCallCount = mistralMessages.reduce(
            (count: number, m: any) => count + (m.tool_calls?.length || 0),
            0,
          );

          console.log(
            `🔍 [Mistral] Tool calls: ${toolCallCount}, Tool responses: ${toolResponseCount}`,
          );

          if (toolResponseCount > 0) {
            console.log(
              `🔍 [Mistral] IMPORTANT: We have tool responses, should we still pass tools?`,
            );
          }
        }

        // Mistral API requires that we don't pass tools when sending tool results
        const shouldPassTools = toolResponseCount === 0 ? tools : undefined;

        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
          console.log(
            `🔍 [Mistral] Passing tools: ${shouldPassTools ? "YES" : "NO"} (tool responses in messages: ${toolResponseCount})`,
          );
        }

        await this.streamWithMistral(
          specification,
          mistralMessages,
          shouldPassTools,
          uiAdapter,
          (message, calls, usage) => {
            roundMessage = message;
            toolCalls = calls;
            if (usage) {
              uiAdapter.setUsageData(usage);
            }
          },
          abortSignal,
        );
        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
          console.log(
            `\n🏁 [Streaming] Mistral native streaming completed (Round ${currentRound})`,
          );
        }
      } else if (
        serviceType === Types.ModelServiceTypes.Bedrock &&
        (BedrockRuntimeClient || this.bedrockClient)
      ) {
        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
          console.log(
            `\n✅ [Streaming] Using Bedrock native streaming (Round ${currentRound})`,
          );
        }
        const { system, messages: bedrockMessages } =
          formatMessagesForBedrock(messages);
        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING_MESSAGES) {
          console.log(
            `🔍 [Bedrock] Sending ${bedrockMessages.length} messages to LLM (system: ${system ? "yes" : "no"}): ${JSON.stringify(bedrockMessages)}`,
          );
        }
        await this.streamWithBedrock(
          specification,
          bedrockMessages,
          system,
          tools,
          uiAdapter,
          (message, calls, usage) => {
            roundMessage = message;
            toolCalls = calls;
            if (usage) {
              uiAdapter.setUsageData(usage);
            }
          },
          abortSignal,
        );
        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
          console.log(
            `\n🏁 [Streaming] Bedrock native streaming completed (Round ${currentRound})`,
          );
        }
      } else if (
        serviceType === Types.ModelServiceTypes.Deepseek &&
        (OpenAI || this.deepseekClient)
      ) {
        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
          console.log(
            `\n✅ [Streaming] Using Deepseek native streaming (Round ${currentRound})`,
          );
        }
        const deepseekMessages = formatMessagesForOpenAI(messages); // Deepseek uses OpenAI format
        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING_MESSAGES) {
          console.log(
            `🔍 [Deepseek] Sending ${deepseekMessages.length} messages to LLM: ${JSON.stringify(deepseekMessages)}`,
          );
        }
        await this.streamWithDeepseek(
          specification,
          deepseekMessages,
          tools,
          uiAdapter,
          (message, calls, usage) => {
            roundMessage = message;
            toolCalls = calls;
            if (usage) {
              uiAdapter.setUsageData(usage);
            }
          },
          abortSignal,
        );
        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
          console.log(
            `\n🏁 [Streaming] Deepseek native streaming completed (Round ${currentRound})`,
          );
        }
      } else if (
        serviceType === Types.ModelServiceTypes.Xai &&
        (OpenAI || this.xaiClient)
      ) {
        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
          console.log(
            `\n✅ [Streaming] Using xAI native streaming (Round ${currentRound})`,
          );
        }
        const xaiMessages = formatMessagesForOpenAI(messages); // xAI uses OpenAI format
        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING_MESSAGES) {
          console.log(
            `🔍 [xAI] Sending ${xaiMessages.length} messages to LLM: ${JSON.stringify(xaiMessages)}`,
          );
        }
        await this.streamWithXai(
          specification,
          xaiMessages,
          tools,
          uiAdapter,
          (message, calls, usage) => {
            roundMessage = message;
            toolCalls = calls;
            if (usage) {
              uiAdapter.setUsageData(usage);
            }
          },
          abortSignal,
        );
        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
          console.log(
            `\n🏁 [Streaming] xAI native streaming completed (Round ${currentRound})`,
          );
        }
      } else {
        // Fallback to non-streaming
        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
          console.log(
            `\n⚠️  [Fallback] No native streaming available for ${serviceType} (Round ${currentRound})`,
          );
          console.log(`   Falling back to non-streaming promptConversation`);
          console.log(`   This should NOT happen if clients are properly set!`);
        }
        await this.fallbackToNonStreaming(
          prompt,
          conversationId,
          specification,
          tools,
          mimeType,
          data,
          uiAdapter,
          correlationId,
          persona,
        );
        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
          console.log(
            `\n🏁 [Fallback] Non-streaming fallback completed (Round ${currentRound})`,
          );
        }
        break;
      }

      // Update the full message
      fullMessage = roundMessage;

      // If no tool calls, we're done
      if (!toolCalls || toolCalls.length === 0) {
        break;
      }

      // Execute tools and prepare for next round
      if (toolHandlers && toolCalls.length > 0) {
        if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
          console.log(
            `\n🔧 [executeStreamingAgent] Round ${currentRound}: Processing ${toolCalls.length} tool calls`,
          );
          toolCalls.forEach((tc, idx) => {
            console.log(
              `  ${idx + 1}. ${tc.name} (${tc.id}) - Args length: ${tc.arguments.length}`,
            );
          });
        }

        // Add assistant message with tool calls to conversation
        const assistantMessage = {
          __typename: "ConversationMessage" as const,
          role: Types.ConversationRoleTypes.Assistant,
          message: roundMessage,
          toolCalls: toolCalls,
          timestamp: new Date().toISOString(),
        };
        messages.push(assistantMessage);

        // Track assistant message in budget (includes tool call arguments)
        if (budgetTracker) {
          const assistantTokens =
            estimateTokens(roundMessage) +
            toolCalls.reduce(
              (sum, tc) => sum + estimateTokens(tc.arguments),
              0,
            );
          budgetTracker.addMessage("", assistantTokens);
        }

        // Execute tools and add responses
        for (const toolCall of toolCalls) {
          const handler = toolHandlers[toolCall.name];
          if (!handler) {
            console.warn(`No handler for tool: ${toolCall.name}`);
            continue;
          }

          try {
            let args: any;
            try {
              args = JSON.parse(toolCall.arguments);
            } catch (parseError) {
              console.error(
                `Failed to parse tool arguments for ${toolCall.name}:`,
              );
              console.error(
                `Arguments (${toolCall.arguments.length} chars):`,
                toolCall.arguments,
              );
              console.error(`Parse error:`, parseError);

              // Check for common truncation patterns
              const lastChars = toolCall.arguments.slice(-20);
              let isTruncated = false;
              if (
                !toolCall.arguments.includes("}") ||
                !lastChars.includes("}")
              ) {
                console.error(
                  `Possible truncation detected - arguments don't end with '}': ...${lastChars}`,
                );
                isTruncated = true;
              }

              // Try to fix truncated JSON by adding missing closing braces
              if (isTruncated) {
                let fixedJson = toolCall.arguments.trim();

                // Count open braces vs close braces to determine how many we need
                const openBraces = (fixedJson.match(/\{/g) || []).length;
                const closeBraces = (fixedJson.match(/\}/g) || []).length;
                const missingBraces = openBraces - closeBraces;

                if (missingBraces > 0) {
                  // Check if we're mid-value (ends with number or boolean)
                  if (
                    fixedJson.match(/:\s*\d+$/) ||
                    fixedJson.match(/:\s*(true|false)$/)
                  ) {
                    // Complete the current property and close
                    fixedJson += ', "content": ""'; // Add empty content field
                  }
                  // Check if we're after a value but missing comma
                  else if (fixedJson.match(/"\s*:\s*[^,}\s]+$/)) {
                    // We have a complete value but no comma, add empty content
                    fixedJson += ', "content": ""';
                  }
                  // Add missing closing quote if the string ends with an unfinished string
                  else if (
                    fixedJson.endsWith('"') === false &&
                    fixedJson.includes('"')
                  ) {
                    const lastQuoteIndex = fixedJson.lastIndexOf('"');
                    const afterLastQuote = fixedJson.slice(lastQuoteIndex + 1);
                    if (!afterLastQuote.includes('"')) {
                      fixedJson += '"';
                    }
                  }

                  // Add missing closing braces
                  fixedJson += "}".repeat(missingBraces);

                  console.log(
                    `Attempting to fix truncated JSON by adding ${missingBraces} closing brace(s):`,
                  );
                  console.log(fixedJson);

                  try {
                    args = JSON.parse(fixedJson);
                    console.log(
                      `✅ Successfully fixed truncated JSON for ${toolCall.name}`,
                    );
                  } catch (fixError) {
                    console.error(
                      `❌ Failed to fix truncated JSON: ${fixError}`,
                    );
                    // Fall through to error handling below
                  }
                }
              }

              // If we couldn't parse or fix the JSON, log details and continue
              if (!args) {
                // Log position mentioned in error if available
                const errorMsg =
                  parseError instanceof Error ? parseError.message : "";
                const posMatch = errorMsg.match(/position (\d+)/);
                if (posMatch) {
                  const pos = parseInt(posMatch[1]);
                  const context = toolCall.arguments.slice(
                    Math.max(0, pos - 20),
                    pos + 20,
                  );
                  console.error(
                    `Error context around position ${pos}: ...${context}...`,
                  );
                }

                // Update UI with error - use StreamEvent error type
                uiAdapter.handleEvent({
                  type: "error",
                  error: `Tool ${toolCall.name} failed: Invalid JSON arguments: ${parseError instanceof Error ? parseError.message : "Unknown error"}`,
                });
                continue;
              }
            }

            // Execute tool
            const result = await handler(args, artifactCollector);

            // Update UI with complete event including result
            uiAdapter.handleEvent({
              type: "tool_call_complete",
              toolCall: {
                id: toolCall.id,
                name: toolCall.name,
                arguments: toolCall.arguments,
              },
              result: result,
            });

            // Add tool response to messages (with truncation)
            const rawResult =
              typeof result === "string" ? result : JSON.stringify(result);
            const truncatedResult = truncateToolResult(
              rawResult,
              toolResultTokenLimit,
              toolCall.name,
            );

            // Track truncation for observability
            if (truncatedResult.length < rawResult.length) {
              const action: ContextManagementAction = {
                type: "truncated_tool_result",
                toolName: toolCall.name,
                originalTokens: estimateTokens(rawResult),
                truncatedTokens: estimateTokens(truncatedResult),
              };
              contextActions.push(action);

              if (budgetTracker) {
                uiAdapter.handleEvent({
                  type: "context_management",
                  action,
                  usage: budgetTracker.getUsageSnapshot(),
                  timestamp: new Date(),
                });
              }

              if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
                console.log(
                  `📊 [Context Management] Truncated tool result for ${toolCall.name}: ` +
                    `${estimateTokens(rawResult)} → ${estimateTokens(truncatedResult)} tokens`,
                );
              }
            }

            const toolMessage: any = {
              __typename: "ConversationMessage" as const,
              role: Types.ConversationRoleTypes.Tool,
              message: truncatedResult,
              toolCallId: toolCall.id,
              timestamp: new Date().toISOString(),
            };
            // Add tool name for Mistral compatibility
            toolMessage.toolName = toolCall.name;
            messages.push(toolMessage);

            // Track budget
            if (budgetTracker) {
              budgetTracker.addMessage(truncatedResult);
            }
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Unknown error";
            console.error(`Tool execution error for ${toolCall.name}:`, error);

            // Update UI with complete event including error
            uiAdapter.handleEvent({
              type: "tool_call_complete",
              toolCall: {
                id: toolCall.id,
                name: toolCall.name,
                arguments: toolCall.arguments,
              },
              error: errorMessage,
            });

            // Add error response
            const errorText = `Error: ${errorMessage}`;
            const errorToolMessage: any = {
              __typename: "ConversationMessage" as const,
              role: Types.ConversationRoleTypes.Tool,
              message: errorText,
              toolCallId: toolCall.id,
              timestamp: new Date().toISOString(),
            };
            // Add tool name for Mistral compatibility
            errorToolMessage.toolName = toolCall.name;
            messages.push(errorToolMessage);

            if (budgetTracker) {
              budgetTracker.addMessage(errorText);
            }
          }
        }
      }

      // Emit context window usage after each tool round
      if (budgetTracker) {
        uiAdapter.handleEvent({
          type: "context_window",
          usage: budgetTracker.getUsageSnapshot(),
        });
      }

      currentRound++;
    }

    // Complete the conversation and get token count
    let finalTokens: number | undefined;
    const trimmedMessage = fullMessage?.trim();
    if (trimmedMessage) {
      // Calculate metrics for completeConversation
      const completionTime = uiAdapter.getCompletionTime(); // Total time in milliseconds
      const ttft = uiAdapter.getTTFT(); // Time to first token in milliseconds
      const throughput = uiAdapter.getThroughput(); // Tokens per second

      // Convert milliseconds to ISO 8601 duration format (e.g., "PT1.5S")
      const millisecondsToTimeSpan = (
        ms: number | undefined,
      ): string | undefined => {
        if (ms === undefined) return undefined;
        const seconds = ms / 1000;
        return `PT${seconds}S`;
      };

      // Await any pending artifact ingestions so content IDs are available
      const collectedArtifacts = await artifactCollector.resolve();

      const completeResponse = await this.completeConversation(
        trimmedMessage,
        conversationId,
        millisecondsToTimeSpan(completionTime),
        millisecondsToTimeSpan(ttft),
        throughput,
        collectedArtifacts.length > 0 ? collectedArtifacts : undefined,
        correlationId,
      );

      // Extract token count from the response
      finalTokens =
        completeResponse.completeConversation?.message?.tokens ?? undefined;

      if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
        console.log(
          `📊 [completeConversation] Tokens used: ${finalTokens || "unknown"}`,
        );
      }
    }

    // Emit completion event with token count
    uiAdapter.handleEvent({
      type: "complete",
      conversationId,
      tokens: finalTokens,
    });
  }

  /**
   * Build message array for LLM from conversation history
   */
  private async buildMessageArray(
    conversationId: string,
    specification: Types.Specification,
    currentPrompt: string,
  ): Promise<Types.ConversationMessage[]> {
    const messages: Types.ConversationMessage[] = [];

    // Add system prompt if present
    if (specification.systemPrompt) {
      const systemMessage = {
        __typename: "ConversationMessage" as const,
        role: Types.ConversationRoleTypes.System,
        message: specification.systemPrompt,
        timestamp: new Date().toISOString(),
      };
      messages.push(systemMessage);
    }

    // Get conversation history
    const conversationResponse = await this.getConversation(conversationId);
    const conversation = conversationResponse.conversation;

    if (conversation?.messages && conversation.messages.length > 0) {
      // Add previous messages (excluding the current one)
      const previousMessages = conversation.messages.slice(
        0,
        -1,
      ) as Types.ConversationMessage[];
      messages.push(...previousMessages);
    }

    // Add current user message
    const currentMessage = {
      __typename: "ConversationMessage" as const,
      role: Types.ConversationRoleTypes.User, // Current prompt is from the user
      message: currentPrompt,
      timestamp: new Date().toISOString(),
    };
    messages.push(currentMessage);

    return messages;
  }

  /**
   * Execute tools during streaming with proper event emission
   */
  private async executeToolsInStream(
    toolCalls: Types.ConversationToolCall[],
    toolHandlers: Record<string, ToolHandler>,
    uiAdapter: UIEventAdapter,
    abortSignal: AbortSignal | undefined,
  ): Promise<void> {
    const toolPromises = toolCalls.map(async (toolCall) => {
      if (abortSignal?.aborted) return;

      const handler = toolHandlers[toolCall.name];
      if (!handler) {
        uiAdapter.handleEvent({
          type: "tool_call_complete",
          toolCall: {
            id: toolCall.id,
            name: toolCall.name,
            arguments: toolCall.arguments,
          },
          error: `No handler for tool: ${toolCall.name}`,
        });
        return;
      }

      try {
        const args = toolCall.arguments ? JSON.parse(toolCall.arguments) : {};
        const result = await handler(args);
        uiAdapter.handleEvent({
          type: "tool_call_complete",
          toolCall: {
            id: toolCall.id,
            name: toolCall.name,
            arguments: toolCall.arguments,
          },
          result: result,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Tool execution failed";
        uiAdapter.handleEvent({
          type: "tool_call_complete",
          toolCall: {
            id: toolCall.id,
            name: toolCall.name,
            arguments: toolCall.arguments,
          },
          error: errorMessage,
        });
      }
    });

    await Promise.all(toolPromises);
  }

  /**
   * Fallback to non-streaming when streaming is not available
   */
  private async fallbackToNonStreaming(
    prompt: string,
    conversationId: string,
    specification: Types.Specification,
    tools: Types.ToolDefinitionInput[] | undefined,
    mimeType: string | undefined,
    data: string | undefined,
    uiAdapter: UIEventAdapter,
    correlationId: string | undefined,
    persona?: Types.EntityReferenceInput,
  ): Promise<void> {
    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `🔄 [Fallback] Starting non-streaming fallback | ConvID: ${conversationId} | Spec: ${specification.name} (${specification.serviceType}) | Prompt: "${prompt.substring(0, 50)}${prompt.length > 50 ? "..." : ""}"`,
      );
    }

    const response = await this.promptConversation(
      prompt,
      conversationId,
      { id: specification.id },
      mimeType,
      data,
      tools,
      false,
      undefined,
      false,
      correlationId,
      persona,
    );

    const message = response.promptConversation?.message;
    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `✅ [Fallback] promptConversation completed | Length: ${message?.message?.length || 0} chars | Preview: "${message?.message?.substring(0, 50) || "NO MESSAGE"}${(message?.message?.length || 0) > 50 ? "..." : ""}"`,
      );
    }

    if (message?.message) {
      // Simulate streaming by emitting tokens
      const words = message.message.split(" ");
      for (let i = 0; i < words.length; i++) {
        const token = i === 0 ? words[i] : " " + words[i];
        uiAdapter.handleEvent({ type: "token", token });
      }

      uiAdapter.handleEvent({ type: "message", message: message.message });

      if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
        console.log(
          `\n🎯 [Fallback] Completed token simulation (${words.length} tokens)`,
        );
      }
    }
  }

  /**
   * Stream with OpenAI client
   */
  private async streamWithOpenAI(
    specification: Types.Specification,
    messages: OpenAIMessage[],
    tools: Types.ToolDefinitionInput[] | undefined,
    uiAdapter: UIEventAdapter,
    onComplete: (
      message: string,
      toolCalls: Types.ConversationToolCall[],
      usage?: any,
    ) => void,
    abortSignal?: AbortSignal,
  ): Promise<void> {
    // Check if we have either the OpenAI module or a provided client
    if (!OpenAI && !this.openaiClient) {
      throw new Error("OpenAI client not available");
    }

    // Use provided client or create a new one
    const openaiClient =
      this.openaiClient ||
      (OpenAI
        ? new OpenAI({
            apiKey: process.env.OPENAI_API_KEY || "",
            maxRetries: 3,
            timeout: 60000, // 60 seconds
          })
        : (() => {
            throw new Error("OpenAI module not available");
          })());

    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `🚀 [Graphlit SDK] Routing to OpenAI streaming provider | Spec: ${specification.name} (${specification.id}) | Messages: ${messages.length} | Tools: ${tools?.length || 0}`,
      );
    }

    // Extract reasoning effort for OpenAI o1 models
    const reasoningEffort = specification.openAI?.reasoningEffort || undefined;

    if (reasoningEffort && process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `🧠 [Graphlit SDK] OpenAI reasoning effort: ${reasoningEffort}`,
      );
    }

    await streamWithOpenAI(
      specification,
      messages,
      tools,
      openaiClient,
      (event) => uiAdapter.handleEvent(event),
      onComplete,
      abortSignal,
      reasoningEffort,
    );
  }

  /**
   * Stream with Anthropic client
   */
  private async streamWithAnthropic(
    specification: Types.Specification,
    messages: AnthropicMessage[],
    systemPrompt: string | undefined,
    tools: Types.ToolDefinitionInput[] | undefined,
    uiAdapter: UIEventAdapter,
    onComplete: (
      message: string,
      toolCalls: Types.ConversationToolCall[],
      usage?: any,
    ) => void,
    abortSignal?: AbortSignal,
  ): Promise<void> {
    // Check if we have either the Anthropic module or a provided client
    if (!Anthropic && !this.anthropicClient) {
      throw new Error("Anthropic client not available");
    }

    // Use provided client or create a new one
    const anthropicClient =
      this.anthropicClient ||
      (Anthropic
        ? new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY || "",
            maxRetries: 3,
            timeout: 60000, // 60 seconds
          })
        : (() => {
            throw new Error("Anthropic module not available");
          })());

    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `🚀 [Graphlit SDK] Routing to Anthropic streaming provider | Spec: ${specification.name} (${specification.id}) | Messages: ${messages.length} | Tools: ${tools?.length || 0} | SystemPrompt: ${systemPrompt ? "Yes" : "No"}`,
      );
    }

    // Get thinking configuration from specification
    const thinkingConfig = this.getThinkingConfig(specification);

    if (thinkingConfig && process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `🧠 [Graphlit SDK] Anthropic thinking enabled | Budget: ${thinkingConfig.budget_tokens} tokens`,
      );
    }

    await streamWithAnthropic(
      specification,
      messages,
      systemPrompt,
      tools,
      anthropicClient,
      (event) => uiAdapter.handleEvent(event),
      onComplete,
      abortSignal,
      thinkingConfig,
    );
  }

  /**
   * Extract thinking configuration from specification
   */
  private getThinkingConfig(
    specification: Types.Specification,
  ): { type: "enabled"; budget_tokens: number } | undefined {
    // Check Anthropic specifications
    if (specification.serviceType === Types.ModelServiceTypes.Anthropic) {
      const anthropic = specification.anthropic;
      if (anthropic?.enableThinking) {
        return {
          type: "enabled",
          budget_tokens: anthropic.thinkingTokenLimit || 10000,
        };
      }
    }

    // Check Google specifications (also supports thinking)
    if (specification.serviceType === Types.ModelServiceTypes.Google) {
      const google = specification.google;
      if (google?.enableThinking) {
        return {
          type: "enabled",
          budget_tokens: google.thinkingTokenLimit || 10000,
        };
      }
    }

    return undefined;
  }

  /**
   * Stream with Google client
   */
  private async streamWithGoogle(
    specification: Types.Specification,
    messages: GoogleMessage[],
    systemPrompt: string | undefined,
    tools: Types.ToolDefinitionInput[] | undefined,
    uiAdapter: UIEventAdapter,
    onComplete: (
      message: string,
      toolCalls: Types.ConversationToolCall[],
      usage?: any,
    ) => void,
    abortSignal?: AbortSignal,
  ): Promise<void> {
    // Check if we have either the Google module or a provided client
    if (!GoogleGenAI && !this.googleClient) {
      throw new Error("Google GenerativeAI client not available");
    }

    // Use provided client or create a new one
    const googleClient =
      this.googleClient ||
      (GoogleGenAI
        ? new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || "" })
        : (() => {
            throw new Error("Google GenerativeAI module not available");
          })());

    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `🚀 [Graphlit SDK] Routing to Google streaming provider | Spec: ${specification.name} (${specification.id}) | Messages: ${messages.length} | Tools: ${tools?.length || 0} | SystemPrompt: ${systemPrompt ? "Yes" : "No"}`,
      );
    }

    // Get thinking configuration from specification
    const thinkingConfig = this.getThinkingConfig(specification);

    if (thinkingConfig && process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `🧠 [Graphlit SDK] Google thinking enabled | Budget: ${thinkingConfig.budget_tokens} tokens`,
      );
    }

    await streamWithGoogle(
      specification,
      messages,
      systemPrompt,
      tools,
      googleClient,
      (event) => uiAdapter.handleEvent(event),
      onComplete,
      abortSignal,
      thinkingConfig,
    );
  }

  /**
   * Stream with Groq client (OpenAI-compatible)
   */
  private async streamWithGroq(
    specification: Types.Specification,
    messages: OpenAIMessage[],
    tools: Types.ToolDefinitionInput[] | undefined,
    uiAdapter: UIEventAdapter,
    onComplete: (
      message: string,
      toolCalls: Types.ConversationToolCall[],
      usage?: any,
    ) => void,
    abortSignal?: AbortSignal,
  ): Promise<void> {
    // Check if we have either the Groq module or a provided client
    if (!Groq && !this.groqClient) {
      throw new Error("Groq client not available");
    }

    // Use provided client or create a new one
    const groqClient =
      this.groqClient ||
      (Groq
        ? new Groq({ apiKey: process.env.GROQ_API_KEY || "" })
        : (() => {
            throw new Error("Groq module not available");
          })());

    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `🚀 [Graphlit SDK] Routing to Groq streaming provider | Spec: ${specification.name} (${specification.id}) | Messages: ${messages.length} | Tools: ${tools?.length || 0}`,
      );
    }

    await streamWithGroq(
      specification,
      messages,
      tools,
      groqClient,
      (event) => uiAdapter.handleEvent(event),
      onComplete,
      abortSignal,
    );
  }

  /**
   * Stream with Cerebras client (native SDK)
   */
  private async streamWithCerebras(
    specification: Types.Specification,
    messages: OpenAIMessage[],
    tools: Types.ToolDefinitionInput[] | undefined,
    uiAdapter: UIEventAdapter,
    onComplete: (
      message: string,
      toolCalls: Types.ConversationToolCall[],
      usage?: any,
    ) => void,
    abortSignal?: AbortSignal,
  ): Promise<void> {
    // Check if we have either the Cerebras module or a provided client
    if (!Cerebras && !this.cerebrasClient) {
      throw new Error("Cerebras client not available");
    }

    // Use provided client or create a new one with Cerebras native SDK
    const cerebrasClient =
      this.cerebrasClient ||
      (Cerebras
        ? new Cerebras({
            apiKey: process.env.CEREBRAS_API_KEY || "",
            maxRetries: 3,
            timeout: 60000, // 60 seconds
          })
        : (() => {
            throw new Error("Cerebras module not available");
          })());

    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `🚀 [Graphlit SDK] Routing to Cerebras streaming provider | Spec: ${specification.name} (${specification.id}) | Messages: ${messages.length} | Tools: ${tools?.length || 0}`,
      );
    }

    await streamWithCerebras(
      specification,
      messages,
      tools,
      cerebrasClient,
      (event) => uiAdapter.handleEvent(event),
      onComplete,
      abortSignal,
    );
  }

  /**
   * Stream with Cohere client
   */
  private async streamWithCohere(
    specification: Types.Specification,
    messages: Types.ConversationMessage[],
    tools: Types.ToolDefinitionInput[] | undefined,
    uiAdapter: UIEventAdapter,
    onComplete: (
      message: string,
      toolCalls: Types.ConversationToolCall[],
      usage?: any,
    ) => void,
    abortSignal?: AbortSignal,
  ): Promise<void> {
    // Check if we have either the Cohere module or a provided client
    if (!CohereClient && !CohereClientV2 && !this.cohereClient) {
      throw new Error("Cohere client not available");
    }

    // Use provided client or create a new one - prefer v2
    const cohereClient =
      this.cohereClient ||
      (CohereClientV2
        ? new CohereClientV2({ token: process.env.COHERE_API_KEY || "" })
        : CohereClient
          ? new CohereClient({ token: process.env.COHERE_API_KEY || "" })
          : (() => {
              throw new Error("Cohere module not available");
            })());

    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `🚀 [Graphlit SDK] Routing to Cohere streaming provider | Spec: ${specification.name} (${specification.id}) | Messages: ${messages.length} | Tools: ${tools?.length || 0}`,
      );
    }

    await streamWithCohere(
      specification,
      messages,
      tools,
      cohereClient,
      (event) => uiAdapter.handleEvent(event),
      onComplete,
      abortSignal,
    );
  }

  /**
   * Stream with Mistral client
   */
  private async streamWithMistral(
    specification: Types.Specification,
    messages: MistralMessage[],
    tools: Types.ToolDefinitionInput[] | undefined,
    uiAdapter: UIEventAdapter,
    onComplete: (
      message: string,
      toolCalls: Types.ConversationToolCall[],
      usage?: any,
    ) => void,
    abortSignal?: AbortSignal,
  ): Promise<void> {
    // Check if we have either the Mistral module or a provided client
    if (!Mistral && !this.mistralClient) {
      throw new Error("Mistral client not available");
    }

    // Use provided client or create a new one
    const mistralClient =
      this.mistralClient ||
      (Mistral
        ? (() => {
            const apiKey = process.env.MISTRAL_API_KEY;
            if (!apiKey) {
              throw new Error(
                "MISTRAL_API_KEY environment variable is required for Mistral streaming",
              );
            }
            return new Mistral({
              apiKey,
              retryConfig: {
                strategy: "backoff",
                backoff: {
                  initialInterval: 1000,
                  maxInterval: 60000,
                  exponent: 2,
                  maxElapsedTime: 300000, // 5 minutes
                },
                retryConnectionErrors: true,
              },
            });
          })()
        : (() => {
            throw new Error("Mistral module not available");
          })());

    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `🚀 [Graphlit SDK] Routing to Mistral streaming provider | Spec: ${specification.name} (${specification.id}) | Messages: ${messages.length} | Tools: ${tools?.length || 0}`,
      );
    }

    await streamWithMistral(
      specification,
      messages,
      tools,
      mistralClient,
      (event) => uiAdapter.handleEvent(event),
      onComplete,
      abortSignal,
    );
  }

  /**
   * Stream with Bedrock client
   */
  private async streamWithBedrock(
    specification: Types.Specification,
    messages: BedrockMessage[],
    systemPrompt: string | undefined,
    tools: Types.ToolDefinitionInput[] | undefined,
    uiAdapter: UIEventAdapter,
    onComplete: (
      message: string,
      toolCalls: Types.ConversationToolCall[],
      usage?: any,
    ) => void,
    abortSignal?: AbortSignal,
  ): Promise<void> {
    // Check if we have either the Bedrock module or a provided client
    if (!BedrockRuntimeClient && !this.bedrockClient) {
      throw new Error("Bedrock client not available");
    }

    // Use provided client or create a new one
    const bedrockClient =
      this.bedrockClient ||
      (BedrockRuntimeClient
        ? new BedrockRuntimeClient({
            region: process.env.AWS_REGION || "us-east-2",
          })
        : (() => {
            throw new Error("Bedrock module not available");
          })());

    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `🚀 [Graphlit SDK] Routing to Bedrock streaming provider | Spec: ${specification.name} (${specification.id}) | Messages: ${messages.length} | Tools: ${tools?.length || 0} | SystemPrompt: ${systemPrompt ? "Yes" : "No"}`,
      );
    }

    await streamWithBedrock(
      specification,
      messages,
      systemPrompt,
      tools,
      bedrockClient,
      (event) => uiAdapter.handleEvent(event),
      onComplete,
      abortSignal,
    );
  }

  /**
   * Stream with Deepseek client
   */
  private async streamWithDeepseek(
    specification: Types.Specification,
    messages: OpenAIMessage[],
    tools: Types.ToolDefinitionInput[] | undefined,
    uiAdapter: UIEventAdapter,
    onComplete: (
      message: string,
      toolCalls: Types.ConversationToolCall[],
      usage?: any,
    ) => void,
    abortSignal?: AbortSignal,
  ): Promise<void> {
    // Check if we have either the OpenAI module or a provided Deepseek client
    if (!OpenAI && !this.deepseekClient) {
      throw new Error("Deepseek client not available (requires OpenAI SDK)");
    }

    // Use provided client or create a new one with Deepseek base URL
    const deepseekClient =
      this.deepseekClient ||
      (OpenAI
        ? new OpenAI({
            baseURL: "https://api.deepseek.com",
            apiKey: process.env.DEEPSEEK_API_KEY || "",
            maxRetries: 3,
            timeout: 60000, // 60 seconds
          })
        : null);

    if (!deepseekClient) {
      throw new Error("Failed to create Deepseek client");
    }

    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `🚀 [Graphlit SDK] Routing to Deepseek streaming provider | Spec: ${specification.name} (${specification.id}) | Messages: ${messages.length} | Tools: ${tools?.length || 0}`,
      );
    }

    await streamWithDeepseek(
      specification,
      messages,
      tools,
      deepseekClient,
      (event) => uiAdapter.handleEvent(event),
      onComplete,
      abortSignal,
    );
  }

  private async streamWithXai(
    specification: Types.Specification,
    messages: OpenAIMessage[],
    tools: Types.ToolDefinitionInput[] | undefined,
    uiAdapter: UIEventAdapter,
    onComplete: (
      message: string,
      toolCalls: Types.ConversationToolCall[],
      usage?: any,
    ) => void,
    abortSignal?: AbortSignal,
  ): Promise<void> {
    // Check if we have either the OpenAI module or a provided xAI client
    if (!OpenAI && !this.xaiClient) {
      throw new Error("xAI client not available (requires OpenAI SDK)");
    }

    // Use provided client or create a new one with xAI base URL
    const xaiClient =
      this.xaiClient ||
      (OpenAI
        ? new OpenAI({
            baseURL: "https://api.x.ai/v1",
            apiKey: process.env.XAI_API_KEY || "",
            maxRetries: 3,
            timeout: 60000, // 60 seconds
          })
        : null);

    if (!xaiClient) {
      throw new Error("Failed to create xAI client");
    }

    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `🚀 [Graphlit SDK] Routing to xAI streaming provider | Spec: ${specification.name} (${specification.id}) | Messages: ${messages.length} | Tools: ${tools?.length || 0}`,
      );
    }

    await streamWithXai(
      specification,
      messages,
      tools,
      xaiClient,
      (event) => uiAdapter.handleEvent(event),
      onComplete,
      abortSignal,
    );
  }

  // Helper method to execute tools for promptAgent
  private async executeToolsForPromptAgent(
    toolCalls: Types.ConversationToolCall[],
    toolHandlers: Record<string, ToolHandler>,
    allToolCalls: ToolCallResult[],
    signal: AbortSignal,
    toolResultTokenLimit: number = DEFAULT_CONTEXT_STRATEGY.toolResultTokenLimit,
  ): Promise<Types.ConversationToolResponseInput[]> {
    const responses: Types.ConversationToolResponseInput[] = [];

    // Execute tools in parallel for better performance
    const toolPromises = toolCalls.map(async (toolCall) => {
      if (!toolCall || signal.aborted) return null;

      const startTime = Date.now();
      const handler = toolHandlers[toolCall.name || ""];

      let result: any;
      let error: string | undefined;

      try {
        if (!handler) {
          throw new Error(`No handler found for tool: ${toolCall.name}`);
        }

        const args = toolCall.arguments ? JSON.parse(toolCall.arguments) : {};

        // Add timeout for individual tool calls (30 seconds)
        const toolTimeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Tool execution timeout")), 30000),
        );

        result = await Promise.race([handler(args), toolTimeout]);
      } catch (e: any) {
        error = e.message || "Tool execution failed";
        console.error(`Tool ${toolCall.name} failed:`, e);
      }

      // Record for result
      const toolResult: ToolCallResult = {
        id: toolCall.id,
        name: toolCall.name || "",
        arguments: toolCall.arguments ? JSON.parse(toolCall.arguments) : {},
        result,
        error,
        duration: Date.now() - startTime,
      };

      allToolCalls.push(toolResult);

      // Truncate oversized tool results before sending to server
      const rawContent = error ? error : result ? JSON.stringify(result) : "";
      const content = truncateToolResult(
        rawContent,
        toolResultTokenLimit,
        toolCall.name || "unknown",
      );

      if (
        content.length < rawContent.length &&
        process.env.DEBUG_GRAPHLIT_SDK_STREAMING
      ) {
        console.log(
          `📊 [Context Management] Truncated tool result for ${toolCall.name}: ` +
            `${estimateTokens(rawContent)} → ${estimateTokens(content)} tokens (promptAgent path)`,
        );
      }

      // Response for API
      return {
        id: toolCall.id,
        content,
      };
    });

    const results = await Promise.all(toolPromises);
    return results.filter(
      (r): r is Types.ConversationToolResponseInput => r !== null,
    ) as Types.ConversationToolResponseInput[];
  }

  // helper functions
  private prettyPrintGraphQLError(err: GraphQLFormattedError): string {
    if (!err) return "Unknown error";

    const parts: string[] = [];

    // Add the base error message
    parts.push(err.message);

    // Add location info if available
    if (err.locations && err.locations.length > 0) {
      parts.push(
        `at line ${err.locations[0].line}, column ${err.locations[0].column}`,
      );
    }

    // Add path info if available
    if (err.path) {
      parts.push(`\n- Path: ${err.path.join(".")}`);
    }

    return parts.join(" ");
  }

  private async mutateAndCheckError<
    TData,
    TVariables extends OperationVariables = OperationVariables,
  >(mutation: DocumentNode, variables?: TVariables): Promise<TData> {
    if (this.client === undefined)
      throw new Error("Apollo Client not configured.");

    try {
      const result: FetchResult<TData> = await this.client.mutate<
        TData,
        TVariables
      >({
        mutation,
        variables: variables || ({} as TVariables),
      });

      if (result.errors && result.errors.length > 0) {
        // Only throw if we have no usable data - allow partial data through
        if (!result.data) {
          const errorMessage = result.errors
            .map((err: any) => this.prettyPrintGraphQLError(err))
            .join("\n");
          throw new Error(errorMessage);
        }
        // Log warning but continue with partial data
        console.warn(
          "GraphQL mutation returned partial data with errors:",
          result.errors
            .map((err: any) => this.prettyPrintGraphQLError(err))
            .join("\n"),
        );
        attachPartialErrors(result.data, result.errors);
      }

      if (!result.data) {
        throw new Error("No data returned from mutation.");
      }

      return result.data;
    } catch (error) {
      if (error instanceof ApolloError && error.graphQLErrors.length > 0) {
        // Check if we have partial data in the error
        const apolloError = error as ApolloError;
        if (apolloError.networkError && "result" in apolloError.networkError) {
          const networkResult = (apolloError.networkError as any).result;
          if (networkResult?.data) {
            console.warn(
              "GraphQL mutation returned partial data with errors:",
              error.graphQLErrors
                .map((err: GraphQLFormattedError) =>
                  this.prettyPrintGraphQLError(err),
                )
                .join("\n"),
            );
            attachPartialErrors(networkResult.data, error.graphQLErrors);
            return networkResult.data as TData;
          }
        }

        const errorMessage = error.graphQLErrors
          .map((err: GraphQLFormattedError) =>
            this.prettyPrintGraphQLError(err),
          )
          .join("\n");

        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      if (error instanceof Error) {
        console.error(error.message);
        throw error;
      } else {
        throw error;
      }
    }
  }

  private async queryAndCheckError<
    TData,
    TVariables extends OperationVariables = OperationVariables,
  >(query: DocumentNode, variables?: TVariables): Promise<TData> {
    if (this.client === undefined)
      throw new Error("Apollo Client not configured.");

    try {
      const result: ApolloQueryResult<TData> = await this.client.query<
        TData,
        TVariables
      >({
        query,
        variables: variables || ({} as TVariables),
      });

      if (result.errors && result.errors.length > 0) {
        // Only throw if we have no usable data - allow partial data through
        if (!result.data) {
          const errorMessage = result.errors
            .map((err: any) => this.prettyPrintGraphQLError(err))
            .join("\n");
          throw new Error(errorMessage);
        }
        // Log warning but continue with partial data
        console.warn(
          "GraphQL query returned partial data with errors:",
          result.errors
            .map((err: any) => this.prettyPrintGraphQLError(err))
            .join("\n"),
        );
        attachPartialErrors(result.data, result.errors);
      }

      if (!result.data) {
        throw new Error("No data returned from query.");
      }

      return result.data;
    } catch (error: unknown) {
      if (error instanceof ApolloError && error.graphQLErrors.length > 0) {
        // Check if we have partial data in the error
        const apolloError = error as ApolloError;
        if (apolloError.networkError && "result" in apolloError.networkError) {
          const networkResult = (apolloError.networkError as any).result;
          if (networkResult?.data) {
            console.warn(
              "GraphQL query returned partial data with errors:",
              error.graphQLErrors
                .map((err: any) => this.prettyPrintGraphQLError(err))
                .join("\n"),
            );
            attachPartialErrors(networkResult.data, error.graphQLErrors);
            return networkResult.data as TData;
          }
        }

        const errorMessage = error.graphQLErrors
          .map((err: any) => this.prettyPrintGraphQLError(err))
          .join("\n");
        console.error(errorMessage);
        throw new Error(errorMessage);
      }
      if (error instanceof Error) {
        console.error(error.message);
        throw error;
      } else {
        throw error;
      }
    }
  }
}

export { Graphlit };
export * as Types from "./generated/graphql-types.js";
export { getPartialErrors, PARTIAL_ERRORS_KEY } from "./partial-errors.js";
export type { PartialGraphQLError } from "./partial-errors.js";

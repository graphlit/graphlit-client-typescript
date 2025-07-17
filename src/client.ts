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
import * as Types from "./generated/graphql-types.js";
import * as Documents from "./generated/graphql-documents.js";
import * as dotenv from "dotenv";
import { getServiceType, getModelName } from "./model-mapping.js";
import {
  AgentOptions,
  AgentResult,
  StreamAgentOptions,
  ToolCallResult,
  ToolHandler,
  AgentMetrics,
  UsageInfo,
} from "./types/agent.js";
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
let GoogleGenerativeAI:
  | typeof import("@google/generative-ai").GoogleGenerativeAI
  | undefined;
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
  GoogleGenerativeAI = optionalRequire(
    "@google/generative-ai",
  ).GoogleGenerativeAI;
  if (process.env.DEBUG_GRAPHLIT_SDK_INITIALIZATION) {
    console.log("[SDK Loading] Google Generative AI SDK loaded successfully");
  }
} catch (e: any) {
  // Google Generative AI not installed
  if (process.env.DEBUG_GRAPHLIT_SDK_INITIALIZATION) {
    console.log("[SDK Loading] Google Generative AI SDK not found:", e.message);
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

const DEFAULT_MAX_TOOL_ROUNDS: number = 1000;

// Smooth streaming buffer implementation

// Helper to create smooth event handler

// Re-export agent types
export type {
  AgentOptions,
  AgentResult,
  StreamAgentOptions,
  ToolCallResult,
  UsageInfo,
  AgentError,
} from "./types/agent.js";

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
  /** Retry configuration for network errors */
  retryConfig?: RetryConfig;
}

// Helper function to validate GUID format
function isValidGuid(guid: string | undefined): boolean {
  if (!guid) return false;
  // GUID regex pattern: 8-4-4-4-12 hexadecimal characters
  const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
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
      dotenv.config();

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
      retryableStatusCodes: [429, 502, 503, 504],
      jitter: true,
      ...options.retryConfig,
    };

    if (!this.organizationId) {
      throw new Error("Graphlit organization identifier is required.");
    }

    if (!isValidGuid(this.organizationId)) {
      throw new Error(
        `Invalid organization ID format. Expected a valid GUID, but received: '${this.organizationId}'. ` +
        "A valid GUID should be in the format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
      );
    }

    if (!this.environmentId) {
      throw new Error("Graphlit environment identifier is required.");
    }

    if (!isValidGuid(this.environmentId)) {
      throw new Error(
        `Invalid environment ID format. Expected a valid GUID, but received: '${this.environmentId}'. ` +
        "A valid GUID should be in the format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
      );
    }

    if (!this.jwtSecret) {
      throw new Error("Graphlit environment JWT secret is required.");
    }

    // Validate optional userId if provided (ownerId can be any format)
    if (this.userId && !isValidGuid(this.userId)) {
      throw new Error(
        `Invalid user ID format. Expected a valid GUID, but received: '${this.userId}'. ` +
        "A valid GUID should be in the format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
      );
    }

    this.refreshClient();
  }

  public refreshClient() {
    this.client = undefined;
    this.generateToken();

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
   * @param client - Google GenerativeAI client instance (e.g., new GoogleGenerativeAI(apiKey))
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

  public async getProject(): Promise<Types.GetProjectQuery> {
    return this.queryAndCheckError<Types.GetProjectQuery, {}>(
      Documents.GetProject,
      {},
    );
  }

  public async updateProject(
    project: Types.ProjectUpdateInput,
  ): Promise<Types.UpdateProjectMutation> {
    return this.mutateAndCheckError<
      Types.UpdateProjectMutation,
      { project: Types.ProjectUpdateInput }
    >(Documents.UpdateProject, { project: project });
  }

  public async lookupProjectUsage(
    correlationId: string,
    startDate?: Types.Scalars["DateTime"]["input"],
    duration?: Types.Scalars["TimeSpan"]["input"],
  ): Promise<Types.LookupUsageQuery> {
    return this.queryAndCheckError<
      Types.LookupUsageQuery,
      {
        correlationId: string;
        startDate?: Types.Scalars["DateTime"]["input"];
        duration?: Types.Scalars["TimeSpan"]["input"];
      }
    >(Documents.LookupUsage, {
      correlationId: correlationId,
      startDate: startDate,
      duration: duration,
    });
  }

  public async lookupProjectCredits(
    correlationId: string,
    startDate?: Types.Scalars["DateTime"]["input"],
    duration?: Types.Scalars["TimeSpan"]["input"],
  ): Promise<Types.LookupCreditsQuery> {
    return this.queryAndCheckError<
      Types.LookupCreditsQuery,
      {
        correlationId: string;
        startDate?: Types.Scalars["DateTime"]["input"];
        duration?: Types.Scalars["TimeSpan"]["input"];
      }
    >(Documents.LookupCredits, {
      correlationId: correlationId,
      startDate: startDate,
      duration: duration,
    });
  }

  public async queryProjectTokens(
    startDate: Types.Scalars["DateTime"]["input"],
    duration: Types.Scalars["TimeSpan"]["input"],
  ): Promise<Types.QueryTokensQuery> {
    return this.queryAndCheckError<
      Types.QueryTokensQuery,
      {
        startDate: Types.Scalars["DateTime"]["input"];
        duration: Types.Scalars["TimeSpan"]["input"];
      }
    >(Documents.QueryTokens, { startDate: startDate, duration: duration });
  }

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
      {
        startDate: Types.Scalars["DateTime"]["input"];
        duration: Types.Scalars["TimeSpan"]["input"];
        names?: string[];
        excludedNames?: string[];
        offset?: Types.Scalars["Int"]["input"];
        limit?: Types.Scalars["Int"]["input"];
      }
    >(Documents.QueryUsage, {
      startDate: startDate,
      duration: duration,
      names: names,
      excludedNames: excludedNames,
      offset: offset,
      limit: limit,
    });
  }

  public async queryProjectCredits(
    startDate: Types.Scalars["DateTime"]["input"],
    duration: Types.Scalars["TimeSpan"]["input"],
  ): Promise<Types.QueryCreditsQuery> {
    return this.queryAndCheckError<
      Types.QueryCreditsQuery,
      {
        startDate: Types.Scalars["DateTime"]["input"];
        duration: Types.Scalars["TimeSpan"]["input"];
      }
    >(Documents.QueryCredits, { startDate: startDate, duration: duration });
  }

  public async sendNotification(
    connector: Types.IntegrationConnectorInput,
    text: string,
    textType?: Types.TextTypes,
  ): Promise<Types.SendNotificationMutation> {
    return this.mutateAndCheckError<
      Types.SendNotificationMutation,
      {
        connector: Types.IntegrationConnectorInput;
        text: string;
        textType?: Types.TextTypes;
      }
    >(Documents.SendNotification, {
      connector: connector,
      text: text,
      textType: textType,
    });
  }

  public async mapWeb(
    uri: string,
    allowedPaths?: string[],
    excludedPaths?: string[],
    correlationId?: string,
  ): Promise<Types.MapWebQuery> {
    return this.queryAndCheckError<
      Types.MapWebQuery,
      {
        uri: string;
        allowedPaths?: string[];
        excludedPaths?: string[];
        correlationId?: string;
      }
    >(Documents.MapWeb, {
      uri: uri,
      allowedPaths: allowedPaths,
      excludedPaths: excludedPaths,
      correlationId: correlationId,
    });
  }

  public async searchWeb(
    text: string,
    service?: Types.SearchServiceTypes,
    limit?: number,
    correlationId?: string,
  ): Promise<Types.SearchWebQuery> {
    return this.queryAndCheckError<
      Types.SearchWebQuery,
      {
        text: string;
        service?: Types.SearchServiceTypes;
        limit?: number;
        correlationId?: string;
      }
    >(Documents.SearchWeb, {
      text: text,
      service: service,
      limit: limit,
      correlationId: correlationId,
    });
  }

  public async createAlert(
    alert: Types.AlertInput,
    correlationId?: string,
  ): Promise<Types.CreateAlertMutation> {
    return this.mutateAndCheckError<
      Types.CreateAlertMutation,
      { alert: Types.AlertInput; correlationId?: string }
    >(Documents.CreateAlert, { alert: alert, correlationId: correlationId });
  }

  public async updateAlert(
    alert: Types.AlertUpdateInput,
  ): Promise<Types.UpdateAlertMutation> {
    return this.mutateAndCheckError<
      Types.UpdateAlertMutation,
      { alert: Types.AlertUpdateInput }
    >(Documents.UpdateAlert, { alert: alert });
  }

  public async deleteAlert(id: string): Promise<Types.DeleteAlertMutation> {
    return this.mutateAndCheckError<Types.DeleteAlertMutation, { id: string }>(
      Documents.DeleteAlert,
      { id: id },
    );
  }

  public async deleteAlerts(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteAlertsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAlertsMutation,
      { ids: string[]; isSynchronous?: boolean }
    >(Documents.DeleteAlerts, { ids: ids, isSynchronous: isSynchronous });
  }

  public async deleteAllAlerts(
    filter?: Types.AlertFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllAlertsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllAlertsMutation,
      {
        filter?: Types.AlertFilter;
        isSynchronous?: boolean;
        correlationId?: string;
      }
    >(Documents.DeleteAllAlerts, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  public async enableAlert(id: string): Promise<Types.EnableAlertMutation> {
    return this.mutateAndCheckError<Types.EnableAlertMutation, { id: string }>(
      Documents.EnableAlert,
      { id: id },
    );
  }

  public async disableAlert(id: string): Promise<Types.DisableAlertMutation> {
    return this.mutateAndCheckError<Types.DisableAlertMutation, { id: string }>(
      Documents.DisableAlert,
      { id: id },
    );
  }

  public async getAlert(id: string): Promise<Types.GetAlertQuery> {
    return this.queryAndCheckError<Types.GetAlertQuery, { id: string }>(
      Documents.GetAlert,
      { id: id },
    );
  }

  public async queryAlerts(
    filter?: Types.AlertFilter,
  ): Promise<Types.QueryAlertsQuery> {
    return this.queryAndCheckError<
      Types.QueryAlertsQuery,
      { filter?: Types.AlertFilter }
    >(Documents.QueryAlerts, { filter: filter });
  }

  public async countAlerts(
    filter?: Types.AlertFilter,
  ): Promise<Types.CountAlertsQuery> {
    return this.queryAndCheckError<
      Types.CountAlertsQuery,
      { filter?: Types.AlertFilter }
    >(Documents.CountAlerts, { filter: filter });
  }

  public async createCollection(
    collection: Types.CollectionInput,
  ): Promise<Types.CreateCollectionMutation> {
    return this.mutateAndCheckError<
      Types.CreateCollectionMutation,
      { collection: Types.CollectionInput }
    >(Documents.CreateCollection, { collection: collection });
  }

  public async updateCollection(
    collection: Types.CollectionUpdateInput,
  ): Promise<Types.UpdateCollectionMutation> {
    return this.mutateAndCheckError<
      Types.UpdateCollectionMutation,
      { collection: Types.CollectionUpdateInput }
    >(Documents.UpdateCollection, { collection: collection });
  }

  public async deleteCollection(
    id: string,
  ): Promise<Types.DeleteCollectionMutation> {
    return this.mutateAndCheckError<
      Types.DeleteCollectionMutation,
      { id: string }
    >(Documents.DeleteCollection, { id: id });
  }

  public async deleteCollections(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteCollectionsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteCollectionsMutation,
      { ids: string[]; isSynchronous?: boolean }
    >(Documents.DeleteCollections, { ids: ids, isSynchronous: isSynchronous });
  }

  public async deleteAllCollections(
    filter?: Types.CollectionFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllCollectionsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllCollectionsMutation,
      {
        filter?: Types.CollectionFilter;
        isSynchronous?: boolean;
        correlationId?: string;
      }
    >(Documents.DeleteAllCollections, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  public async addContentsToCollections(
    contents: Types.EntityReferenceInput[],
    collections: Types.EntityReferenceInput[],
  ): Promise<Types.AddContentsToCollectionsMutation> {
    return this.mutateAndCheckError<
      Types.AddContentsToCollectionsMutation,
      {
        contents: Types.EntityReferenceInput[];
        collections: Types.EntityReferenceInput[];
      }
    >(Documents.AddContentsToCollections, {
      contents: contents,
      collections: collections,
    });
  }

  public async removeContentsFromCollection(
    contents: Types.EntityReferenceInput[],
    collection: Types.EntityReferenceInput,
  ): Promise<Types.RemoveContentsFromCollectionMutation> {
    return this.mutateAndCheckError<
      Types.RemoveContentsFromCollectionMutation,
      {
        contents: Types.EntityReferenceInput[];
        collection: Types.EntityReferenceInput;
      }
    >(Documents.RemoveContentsFromCollection, {
      contents: contents,
      collection: collection,
    });
  }

  public async getCollection(id: string): Promise<Types.GetCollectionQuery> {
    return this.queryAndCheckError<Types.GetCollectionQuery, { id: string }>(
      Documents.GetCollection,
      { id: id },
    );
  }

  public async queryCollections(
    filter?: Types.CollectionFilter,
  ): Promise<Types.QueryCollectionsQuery> {
    return this.queryAndCheckError<
      Types.QueryCollectionsQuery,
      { filter?: Types.CollectionFilter }
    >(Documents.QueryCollections, { filter: filter });
  }

  public async countCollections(
    filter?: Types.CollectionFilter,
  ): Promise<Types.CountCollectionsQuery> {
    return this.queryAndCheckError<
      Types.CountCollectionsQuery,
      { filter?: Types.CollectionFilter }
    >(Documents.CountCollections, { filter: filter });
  }

  public async describeImage(
    prompt: string,
    uri: string,
    specification?: Types.EntityReferenceInput,
    correlationId?: string,
  ): Promise<Types.DescribeImageMutation> {
    return this.mutateAndCheckError<
      Types.DescribeImageMutation,
      {
        prompt: string;
        uri: string;
        specification?: Types.EntityReferenceInput;
        correlationId?: string;
      }
    >(Documents.DescribeImage, {
      prompt: prompt,
      uri: uri,
      specification: specification,
      correlationId: correlationId,
    });
  }

  public async describeEncodedImage(
    prompt: string,
    mimeType: string,
    data: string,
    specification?: Types.EntityReferenceInput,
    correlationId?: string,
  ): Promise<Types.DescribeEncodedImageMutation> {
    return this.mutateAndCheckError<
      Types.DescribeEncodedImageMutation,
      {
        prompt: string;
        mimeType: string;
        data: string;
        specification?: Types.EntityReferenceInput;
        correlationId?: string;
      }
    >(Documents.DescribeEncodedImage, {
      prompt: prompt,
      mimeType: mimeType,
      data: data,
      specification: specification,
      correlationId: correlationId,
    });
  }

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
      {
        uri: string;
        maximumHeight?: number;
        isSynchronous?: boolean;
        workflow?: Types.EntityReferenceInput;
        collections?: Types.EntityReferenceInput[];
        correlationId?: string;
      }
    >(Documents.ScreenshotPage, {
      uri: uri,
      maximumHeight: maximumHeight,
      isSynchronous: isSynchronous,
      workflow: workflow,
      collections: collections,
      correlationId: correlationId,
    });
  }

  public async ingestTextBatch(
    batch: Types.TextContentInput[],
    textType: Types.TextTypes,
    collections?: Types.EntityReferenceInput[],
    observations?: Types.ObservationReferenceInput[],
    correlationId?: string,
  ): Promise<Types.IngestTextBatchMutation> {
    return this.mutateAndCheckError<
      Types.IngestTextBatchMutation,
      {
        batch: Types.TextContentInput[];
        textType: Types.TextTypes;
        workflow?: Types.EntityReferenceInput;
        collections?: Types.EntityReferenceInput[];
        observations?: Types.ObservationReferenceInput[];
        correlationId?: string;
      }
    >(Documents.IngestTextBatch, {
      batch: batch,
      textType: textType,
      collections: collections,
      observations: observations,
      correlationId: correlationId,
    });
  }

  public async ingestBatch(
    uris: string[],
    workflow?: Types.EntityReferenceInput,
    collections?: Types.EntityReferenceInput[],
    observations?: Types.ObservationReferenceInput[],
    correlationId?: string,
  ): Promise<Types.IngestBatchMutation> {
    return this.mutateAndCheckError<
      Types.IngestBatchMutation,
      {
        uris: string[];
        workflow?: Types.EntityReferenceInput;
        collections?: Types.EntityReferenceInput[];
        observations?: Types.ObservationReferenceInput[];
        correlationId?: string;
      }
    >(Documents.IngestBatch, {
      uris: uris,
      workflow: workflow,
      collections: collections,
      observations: observations,
      correlationId: correlationId,
    });
  }

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
      {
        uri: string;
        name?: string;
        id?: string;
        identifier?: string;
        isSynchronous?: boolean;
        workflow?: Types.EntityReferenceInput;
        collections?: Types.EntityReferenceInput[];
        observations?: Types.ObservationReferenceInput[];
        correlationId?: string;
      }
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
      {
        text: string;
        name?: string;
        textType?: Types.TextTypes;
        uri?: string;
        id?: string;
        identifier?: string;
        isSynchronous?: boolean;
        workflow?: Types.EntityReferenceInput;
        collections?: Types.EntityReferenceInput[];
        observations?: Types.ObservationReferenceInput[];
        correlationId?: string;
      }
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
      {
        text: string;
        name?: string;
        textType?: Types.TextTypes;
        id?: string;
        identifier?: string;
        collections?: Types.EntityReferenceInput[];
        correlationId?: string;
      }
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
      {
        markdown: string;
        name?: string;
        description?: string;
        eventDate?: Types.Scalars["DateTime"]["input"];
        id?: string;
        identifier?: string;
        collections?: Types.EntityReferenceInput[];
        correlationId?: string;
      }
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
      {
        name: string;
        data: string;
        mimeType: string;
        fileCreationDate?: Types.Scalars["DateTime"]["input"];
        fileModifiedDate?: Types.Scalars["DateTime"]["input"];
        id?: string;
        identifier?: string;
        isSynchronous?: boolean;
        workflow?: Types.EntityReferenceInput;
        collections?: Types.EntityReferenceInput[];
        observations?: Types.ObservationReferenceInput[];
        correlationId?: string;
      }
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

  public async updateContent(
    content: Types.ContentUpdateInput,
  ): Promise<Types.UpdateContentMutation> {
    return this.mutateAndCheckError<
      Types.UpdateContentMutation,
      { content: Types.ContentUpdateInput }
    >(Documents.UpdateContent, { content: content });
  }

  public async deleteContent(id: string): Promise<Types.DeleteContentMutation> {
    return this.mutateAndCheckError<
      Types.DeleteContentMutation,
      { id: string }
    >(Documents.DeleteContent, { id: id });
  }

  public async deleteContents(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteContentsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteContentsMutation,
      { ids: string[]; isSynchronous?: boolean }
    >(Documents.DeleteContents, { ids: ids, isSynchronous: isSynchronous });
  }

  public async deleteAllContents(
    filter?: Types.ContentFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllContentsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllContentsMutation,
      {
        filter?: Types.ContentFilter;
        isSynchronous?: boolean;
        correlationId?: string;
      }
    >(Documents.DeleteAllContents, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  public async summarizeText(
    summarization: Types.SummarizationStrategyInput,
    text: string,
    textType?: Types.TextTypes,
    correlationId?: string,
  ): Promise<Types.SummarizeTextMutation> {
    return this.mutateAndCheckError<
      Types.SummarizeTextMutation,
      {
        summarization: Types.SummarizationStrategyInput;
        text: string;
        textType?: Types.TextTypes;
        correlationId?: string;
      }
    >(Documents.SummarizeText, {
      summarization: summarization,
      text: text,
      textType: textType,
      correlationId: correlationId,
    });
  }

  public async summarizeContents(
    summarizations: Types.SummarizationStrategyInput[],
    filter?: Types.ContentFilter,
    correlationId?: string,
  ): Promise<Types.SummarizeContentsMutation> {
    return this.mutateAndCheckError<
      Types.SummarizeContentsMutation,
      {
        summarizations: Types.SummarizationStrategyInput[];
        filter?: Types.ContentFilter;
        correlationId?: string;
      }
    >(Documents.SummarizeContents, {
      summarizations: summarizations,
      filter: filter,
      correlationId: correlationId,
    });
  }

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
      {
        prompt: string;
        text: string;
        tools: Types.ToolDefinitionInput[];
        specification?: Types.EntityReferenceInput;
        textType?: Types.TextTypes;
        correlationId?: string;
      }
    >(Documents.ExtractText, {
      prompt: prompt,
      text: text,
      textType: textType,
      specification: specification,
      tools: tools,
      correlationId: correlationId,
    });
  }

  public async extractContents(
    prompt: string,
    tools: Types.ToolDefinitionInput[],
    specification?: Types.EntityReferenceInput,
    filter?: Types.ContentFilter,
    correlationId?: string,
  ): Promise<Types.ExtractContentsMutation> {
    return this.mutateAndCheckError<
      Types.ExtractContentsMutation,
      {
        prompt: string;
        tools: Types.ToolDefinitionInput[];
        specification?: Types.EntityReferenceInput;
        filter?: Types.ContentFilter;
        correlationId?: string;
      }
    >(Documents.ExtractContents, {
      prompt: prompt,
      filter: filter,
      specification: specification,
      tools: tools,
      correlationId: correlationId,
    });
  }

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
      {
        summaryPrompt?: string;
        summarySpecification?: Types.EntityReferenceInput;
        connector: Types.ContentPublishingConnectorInput;
        publishPrompt: string;
        publishSpecification?: Types.EntityReferenceInput;
        name?: string;
        filter?: Types.ContentFilter;
        workflow?: Types.EntityReferenceInput;
        isSynchronous?: boolean;
        includeDetails?: boolean;
        correlationId?: string;
      }
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
      {
        text: string;
        textType: Types.TextTypes;
        connector: Types.ContentPublishingConnectorInput;
        name?: string;
        workflow?: Types.EntityReferenceInput;
        isSynchronous?: boolean;
        correlationId?: string;
      }
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

  public async getContent(id: string): Promise<Types.GetContentQuery> {
    return this.queryAndCheckError<Types.GetContentQuery, { id: string }>(
      Documents.GetContent,
      { id: id },
    );
  }

  public async lookupContents(
    ids: string[],
  ): Promise<Types.LookupContentsResults> {
    return this.queryAndCheckError<
      Types.LookupContentsResults,
      { ids: string[] }
    >(Documents.LookupContents, { ids: ids });
  }

  public async queryObservables(
    filter?: Types.ContentFilter,
  ): Promise<Types.QueryObservablesQuery> {
    return this.queryAndCheckError<
      Types.QueryObservablesQuery,
      { filter?: Types.ContentFilter }
    >(Documents.QueryObservables, { filter: filter });
  }

  public async queryContents(
    filter?: Types.ContentFilter,
  ): Promise<Types.QueryContentsQuery> {
    return this.queryAndCheckError<
      Types.QueryContentsQuery,
      { filter?: Types.ContentFilter }
    >(Documents.QueryContents, { filter: filter });
  }

  public async queryContentsObservations(
    filter?: Types.ContentFilter,
  ): Promise<Types.QueryContentsObservationsQuery> {
    return this.queryAndCheckError<
      Types.QueryContentsObservationsQuery,
      { filter?: Types.ContentFilter }
    >(Documents.QueryContentsObservations, { filter: filter });
  }

  public async queryContentsFacets(
    filter?: Types.ContentFilter,
  ): Promise<Types.QueryContentsFacetsQuery> {
    return this.queryAndCheckError<
      Types.QueryContentsFacetsQuery,
      { filter?: Types.ContentFilter }
    >(Documents.QueryContentsFacets, { filter: filter });
  }

  public async queryContentsGraph(
    filter?: Types.ContentFilter,
  ): Promise<Types.QueryContentsGraphQuery> {
    return this.queryAndCheckError<
      Types.QueryContentsGraphQuery,
      { filter?: Types.ContentFilter; graph?: Types.ContentGraphInput }
    >(Documents.QueryContentsGraph, {
      filter: filter,
      graph: {
        /* return everything */
      },
    });
  }

  public async countContents(
    filter?: Types.ContentFilter,
  ): Promise<Types.CountContentsQuery> {
    return this.queryAndCheckError<
      Types.CountContentsQuery,
      { filter?: Types.ContentFilter }
    >(Documents.CountContents, { filter: filter });
  }

  public async isContentDone(id: string): Promise<Types.IsContentDoneQuery> {
    return this.queryAndCheckError<Types.IsContentDoneQuery, { id: string }>(
      Documents.IsContentDone,
      { id: id },
    );
  }

  public async createConversation(
    conversation: Types.ConversationInput,
    correlationId?: string,
  ): Promise<Types.CreateConversationMutation> {
    return this.mutateAndCheckError<
      Types.CreateConversationMutation,
      { conversation: Types.ConversationInput; correlationId?: string }
    >(Documents.CreateConversation, {
      conversation: conversation,
      correlationId: correlationId,
    });
  }

  public async updateConversation(
    conversation: Types.ConversationUpdateInput,
  ): Promise<Types.UpdateConversationMutation> {
    return this.mutateAndCheckError<
      Types.UpdateConversationMutation,
      { conversation: Types.ConversationUpdateInput }
    >(Documents.UpdateConversation, { conversation: conversation });
  }

  public async deleteConversation(
    id: string,
  ): Promise<Types.DeleteConversationMutation> {
    return this.mutateAndCheckError<
      Types.DeleteConversationMutation,
      { id: string }
    >(Documents.DeleteConversation, { id: id });
  }

  public async deleteConversations(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteConversationsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteConversationsMutation,
      { ids: string[]; isSynchronous?: boolean }
    >(Documents.DeleteConversations, {
      ids: ids,
      isSynchronous: isSynchronous,
    });
  }

  public async deleteAllConversations(
    filter?: Types.ConversationFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllConversationsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllConversationsMutation,
      {
        filter?: Types.ConversationFilter;
        isSynchronous?: boolean;
        correlationId?: string;
      }
    >(Documents.DeleteAllConversations, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  public async clearConversation(
    id: string,
  ): Promise<Types.ClearConversationMutation> {
    return this.mutateAndCheckError<
      Types.ClearConversationMutation,
      { id: string }
    >(Documents.ClearConversation, { id: id });
  }

  public async closeConversation(
    id: string,
  ): Promise<Types.CloseConversationMutation> {
    return this.mutateAndCheckError<
      Types.CloseConversationMutation,
      { id: string }
    >(Documents.CloseConversation, { id: id });
  }

  public async getConversation(
    id: string,
  ): Promise<Types.GetConversationQuery> {
    return this.queryAndCheckError<Types.GetConversationQuery, { id: string }>(
      Documents.GetConversation,
      { id: id },
    );
  }

  public async queryConversations(
    filter?: Types.ConversationFilter,
  ): Promise<Types.QueryConversationsQuery> {
    return this.queryAndCheckError<
      Types.QueryConversationsQuery,
      { filter?: Types.ConversationFilter }
    >(Documents.QueryConversations, { filter: filter });
  }

  public async countConversations(
    filter?: Types.ConversationFilter,
  ): Promise<Types.CountConversationsQuery> {
    return this.queryAndCheckError<
      Types.CountConversationsQuery,
      { filter?: Types.ConversationFilter }
    >(Documents.CountConversations, { filter: filter });
  }

  public async reviseImage(
    prompt: string,
    uri: string,
    id?: string,
    specification?: Types.EntityReferenceInput,
    correlationId?: string,
  ): Promise<Types.ReviseImageMutation> {
    return this.mutateAndCheckError<
      Types.ReviseImageMutation,
      {
        prompt: string;
        uri: string;
        id?: string;
        specification?: Types.EntityReferenceInput;
        correlationId?: string;
      }
    >(Documents.ReviseImage, {
      prompt: prompt,
      uri: uri,
      id: id,
      specification: specification,
      correlationId: correlationId,
    });
  }

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
      {
        prompt: string;
        mimeType: string;
        data: string;
        id?: string;
        specification?: Types.EntityReferenceInput;
        correlationId?: string;
      }
    >(Documents.ReviseEncodedImage, {
      prompt: prompt,
      mimeType: mimeType,
      data: data,
      id: id,
      specification: specification,
      correlationId: correlationId,
    });
  }

  public async reviseText(
    prompt: string,
    text: string,
    id?: string,
    specification?: Types.EntityReferenceInput,
    correlationId?: string,
  ): Promise<Types.ReviseTextMutation> {
    return this.mutateAndCheckError<
      Types.ReviseTextMutation,
      {
        prompt: string;
        text: string;
        id?: string;
        specification?: Types.EntityReferenceInput;
        correlationId?: string;
      }
    >(Documents.ReviseText, {
      prompt: prompt,
      text: text,
      id: id,
      specification: specification,
      correlationId: correlationId,
    });
  }

  public async reviseContent(
    prompt: string,
    content: Types.EntityReferenceInput,
    id?: string,
    specification?: Types.EntityReferenceInput,
    correlationId?: string,
  ): Promise<Types.ReviseContentMutation> {
    return this.mutateAndCheckError<
      Types.ReviseContentMutation,
      {
        prompt: string;
        content: Types.EntityReferenceInput;
        id?: string;
        specification?: Types.EntityReferenceInput;
        correlationId?: string;
      }
    >(Documents.ReviseContent, {
      prompt: prompt,
      content: content,
      id: id,
      specification: specification,
      correlationId: correlationId,
    });
  }

  public async prompt(
    prompt?: string,
    mimeType?: string,
    data?: string,
    specification?: Types.EntityReferenceInput,
    messages?: Types.ConversationMessageInput[],
    correlationId?: string,
  ): Promise<Types.PromptMutation> {
    return this.mutateAndCheckError<
      Types.PromptMutation,
      {
        prompt?: string;
        mimeType?: string;
        data?: string;
        specification?: Types.EntityReferenceInput;
        messages?: Types.ConversationMessageInput[];
        correlationId?: string;
      }
    >(Documents.Prompt, {
      prompt: prompt,
      mimeType: mimeType,
      data: data,
      specification: specification,
      messages: messages,
      correlationId: correlationId,
    });
  }

  public async retrieveView(
    prompt: string,
    id: string,
    retrievalStrategy?: Types.RetrievalStrategyInput,
    rerankingStrategy?: Types.RerankingStrategyInput,
    correlationId?: string,
  ): Promise<Types.RetrieveViewMutation> {
    return this.mutateAndCheckError<
      Types.RetrieveViewMutation,
      {
        prompt: string;
        id: string;
        retrievalStrategy?: Types.RetrievalStrategyInput;
        rerankingStrategy?: Types.RerankingStrategyInput;
        correlationId?: string;
      }
    >(Documents.RetrieveView, {
      prompt: prompt,
      id: id,
      retrievalStrategy: retrievalStrategy,
      rerankingStrategy: rerankingStrategy,
      correlationId: correlationId,
    });
  }

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
      {
        prompt: string;
        filter?: Types.ContentFilter;
        augmentedFilter?: Types.ContentFilter;
        retrievalStrategy?: Types.RetrievalStrategyInput;
        rerankingStrategy?: Types.RerankingStrategyInput;
        correlationId?: string;
      }
    >(Documents.RetrieveSources, {
      prompt: prompt,
      filter: filter,
      augmentedFilter: augmentedFilter,
      retrievalStrategy: retrievalStrategy,
      rerankingStrategy: rerankingStrategy,
      correlationId: correlationId,
    });
  }

  public async formatConversation(
    prompt: string,
    id?: string,
    specification?: Types.EntityReferenceInput,
    tools?: Types.ToolDefinitionInput[],
    systemPrompt?: string,
    includeDetails?: boolean,
    correlationId?: string,
  ): Promise<Types.FormatConversationMutation> {
    return this.mutateAndCheckError<
      Types.FormatConversationMutation,
      {
        prompt: string;
        id?: string;
        specification?: Types.EntityReferenceInput;
        tools?: Types.ToolDefinitionInput[];
        systemPrompt?: string;
        includeDetails?: boolean;
        correlationId?: string;
      }
    >(Documents.FormatConversation, {
      prompt: prompt,
      id: id,
      specification: specification,
      tools: tools,
      systemPrompt: systemPrompt,
      includeDetails: includeDetails,
      correlationId: correlationId,
    });
  }

  public async completeConversation(
    completion: string,
    id: string,
    completionTime?: Types.Scalars["TimeSpan"]["input"],
    ttft?: Types.Scalars["TimeSpan"]["input"],
    throughput?: Types.Scalars["Float"]["input"],
    correlationId?: string,
  ): Promise<Types.CompleteConversationMutation> {
    return this.mutateAndCheckError<
      Types.CompleteConversationMutation,
      {
        completion: string;
        id: string;
        completionTime?: Types.Scalars["TimeSpan"]["input"];
        ttft?: Types.Scalars["TimeSpan"]["input"];
        throughput?: Types.Scalars["Float"]["input"];
        correlationId?: string;
      }
    >(Documents.CompleteConversation, {
      completion: completion,
      id: id,
      completionTime: completionTime,
      ttft: ttft,
      throughput: throughput,
      correlationId: correlationId,
    });
  }

  public async askGraphlit(
    prompt: string,
    type?: Types.SdkTypes,
    id?: string,
    specification?: Types.EntityReferenceInput,
    correlationId?: string,
  ): Promise<Types.AskGraphlitMutation> {
    return this.mutateAndCheckError<
      Types.AskGraphlitMutation,
      {
        prompt: string;
        type?: Types.SdkTypes;
        id?: string;
        specification?: Types.EntityReferenceInput;
        correlationId?: string;
      }
    >(Documents.AskGraphlit, {
      prompt: prompt,
      type: type,
      id: id,
      specification: specification,
      correlationId: correlationId,
    });
  }

  public async branchConversation(
    id: string,
  ): Promise<Types.BranchConversationMutation> {
    return this.mutateAndCheckError<
      Types.BranchConversationMutation,
      {
        id: string;
      }
    >(Documents.BranchConversation, {
      id: id,
    });
  }

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
  ): Promise<Types.PromptConversationMutation> {
    return this.mutateAndCheckError<
      Types.PromptConversationMutation,
      {
        prompt: string;
        id?: string;
        specification?: Types.EntityReferenceInput;
        mimeType?: string;
        data?: string;
        tools?: Types.ToolDefinitionInput[];
        requireTool?: boolean;
        systemPrompt?: string;
        includeDetails?: boolean;
        correlationId?: string;
      }
    >(Documents.PromptConversation, {
      prompt: prompt,
      id: id,
      specification: specification,
      mimeType: mimeType,
      data: data,
      tools: tools,
      requireTool: requireTool,
      systemPrompt: systemPrompt,
      includeDetails: includeDetails,
      correlationId: correlationId,
    });
  }

  public async continueConversation(
    id: string,
    responses: Types.ConversationToolResponseInput[],
    correlationId?: string,
  ): Promise<Types.ContinueConversationMutation> {
    return this.mutateAndCheckError<
      Types.ContinueConversationMutation,
      {
        id: string;
        responses: Types.ConversationToolResponseInput[];
        correlationId?: string;
      }
    >(Documents.ContinueConversation, {
      id: id,
      responses: responses,
      correlationId: correlationId,
    });
  }

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
      {
        id: string;
        connector: Types.ContentPublishingConnectorInput;
        name?: string;
        workflow?: Types.EntityReferenceInput;
        isSynchronous?: boolean;
        correlationId?: string;
      }
    >(Documents.PublishConversation, {
      id: id,
      connector: connector,
      name: name,
      workflow: workflow,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  public async suggestConversation(
    id: string,
    count?: number,
    correlationId?: string,
  ): Promise<Types.SuggestConversationMutation> {
    return this.mutateAndCheckError<
      Types.SuggestConversationMutation,
      { id: string; count?: number; correlationId?: string }
    >(Documents.SuggestConversation, {
      id: id,
      count: count,
      correlationId: correlationId,
    });
  }

  public async queryMicrosoftCalendars(
    properties: Types.MicrosoftCalendarsInput,
  ): Promise<Types.QueryMicrosoftCalendarsQuery> {
    return this.queryAndCheckError<
      Types.QueryMicrosoftCalendarsQuery,
      { properties: Types.MicrosoftCalendarsInput }
    >(Documents.QueryMicrosoftCalendars, {
      properties: properties,
    });
  }

  public async queryGoogleCalendars(
    properties: Types.GoogleCalendarsInput,
  ): Promise<Types.QueryGoogleCalendarsQuery> {
    return this.queryAndCheckError<
      Types.QueryGoogleCalendarsQuery,
      { properties: Types.GoogleCalendarsInput }
    >(Documents.QueryGoogleCalendars, {
      properties: properties,
    });
  }

  public async queryBoxFolders(
    properties: Types.BoxFoldersInput,
    folderId?: string,
  ): Promise<Types.QueryBoxFoldersQuery> {
    return this.queryAndCheckError<
      Types.QueryBoxFoldersQuery,
      { properties: Types.BoxFoldersInput; folderId?: string }
    >(Documents.QueryBoxFolders, {
      properties: properties,
      folderId: folderId,
    });
  }

  public async queryDropboxFolders(
    properties: Types.DropboxFoldersInput,
    folderPath?: string,
  ): Promise<Types.QueryDropboxFoldersQuery> {
    return this.queryAndCheckError<
      Types.QueryDropboxFoldersQuery,
      { properties: Types.DropboxFoldersInput; folderPath?: string }
    >(Documents.QueryDropboxFolders, {
      properties: properties,
      folderPath: folderPath,
    });
  }

  public async queryGoogleDriveFolders(
    properties: Types.GoogleDriveFoldersInput,
    folderId?: string,
  ): Promise<Types.QueryGoogleDriveFoldersQuery> {
    return this.queryAndCheckError<
      Types.QueryGoogleDriveFoldersQuery,
      { properties: Types.GoogleDriveFoldersInput; folderId?: string }
    >(Documents.QueryGoogleDriveFolders, {
      properties: properties,
      folderId: folderId,
    });
  }

  public async queryOneDriveFolders(
    properties: Types.OneDriveFoldersInput,
    folderId?: string,
  ): Promise<Types.QueryOneDriveFoldersQuery> {
    return this.queryAndCheckError<
      Types.QueryOneDriveFoldersQuery,
      { properties: Types.OneDriveFoldersInput; folderId?: string }
    >(Documents.QueryOneDriveFolders, {
      properties: properties,
      folderId: folderId,
    });
  }

  public async querySharePointFolders(
    properties: Types.SharePointFoldersInput,
    libraryId: string,
    folderId?: string,
  ): Promise<Types.QuerySharePointFoldersQuery> {
    return this.queryAndCheckError<
      Types.QuerySharePointFoldersQuery,
      {
        properties: Types.SharePointFoldersInput;
        libraryId: string;
        folderId?: string;
      }
    >(Documents.QuerySharePointFolders, {
      properties: properties,
      libraryId: libraryId,
      folderId: folderId,
    });
  }

  public async querySharePointLibraries(
    properties: Types.SharePointLibrariesInput,
  ): Promise<Types.QuerySharePointLibrariesQuery> {
    return this.queryAndCheckError<
      Types.QuerySharePointLibrariesQuery,
      { properties: Types.SharePointLibrariesInput }
    >(Documents.QuerySharePointLibraries, { properties: properties });
  }

  public async queryMicrosoftTeamsTeams(
    properties: Types.MicrosoftTeamsTeamsInput,
  ): Promise<Types.QueryMicrosoftTeamsTeamsQuery> {
    return this.queryAndCheckError<
      Types.QueryMicrosoftTeamsTeamsQuery,
      { properties: Types.MicrosoftTeamsTeamsInput }
    >(Documents.QueryMicrosoftTeamsTeams, { properties: properties });
  }

  public async queryMicrosoftTeamsChannels(
    properties: Types.MicrosoftTeamsChannelsInput,
    teamId: string,
  ): Promise<Types.QueryMicrosoftTeamsChannelsQuery> {
    return this.queryAndCheckError<
      Types.QueryMicrosoftTeamsChannelsQuery,
      { properties: Types.MicrosoftTeamsChannelsInput; teamId: string }
    >(Documents.QueryMicrosoftTeamsChannels, {
      properties: properties,
      teamId: teamId,
    });
  }

  public async queryDiscordGuilds(
    properties: Types.DiscordGuildsInput,
  ): Promise<Types.QueryDiscordGuildsQuery> {
    return this.queryAndCheckError<
      Types.QueryDiscordGuildsQuery,
      { properties: Types.DiscordGuildsInput }
    >(Documents.QueryDiscordGuilds, { properties: properties });
  }

  public async queryDiscordChannels(
    properties: Types.DiscordChannelsInput,
  ): Promise<Types.QueryDiscordChannelsQuery> {
    return this.queryAndCheckError<
      Types.QueryDiscordChannelsQuery,
      { properties: Types.DiscordChannelsInput }
    >(Documents.QueryDiscordChannels, { properties: properties });
  }

  public async querySlackChannels(
    properties: Types.SlackChannelsInput,
  ): Promise<Types.QuerySlackChannelsQuery> {
    return this.queryAndCheckError<
      Types.QuerySlackChannelsQuery,
      { properties: Types.SlackChannelsInput }
    >(Documents.QuerySlackChannels, { properties: properties });
  }

  public async queryLinearProjects(
    properties: Types.LinearProjectsInput,
  ): Promise<Types.QueryLinearProjectsQuery> {
    return this.queryAndCheckError<
      Types.QueryLinearProjectsQuery,
      { properties: Types.LinearProjectsInput }
    >(Documents.QueryLinearProjects, { properties: properties });
  }

  public async queryNotionDatabases(
    properties: Types.NotionDatabasesInput,
  ): Promise<Types.QueryNotionDatabasesQuery> {
    return this.queryAndCheckError<
      Types.QueryNotionDatabasesQuery,
      { properties: Types.NotionDatabasesInput }
    >(Documents.QueryNotionDatabases, { properties: properties });
  }

  public async queryNotionPages(
    properties: Types.NotionPagesInput,
    identifier: string,
  ): Promise<Types.QueryNotionPagesQuery> {
    return this.queryAndCheckError<
      Types.QueryNotionPagesQuery,
      { properties: Types.NotionPagesInput; identifier: string }
    >(Documents.QueryNotionPages, {
      properties: properties,
      identifier: identifier,
    });
  }

  public async createFeed(
    feed: Types.FeedInput,
    correlationId?: string,
  ): Promise<Types.CreateFeedMutation> {
    return this.mutateAndCheckError<
      Types.CreateFeedMutation,
      { feed: Types.FeedInput; correlationId?: string }
    >(Documents.CreateFeed, { feed: feed, correlationId: correlationId });
  }

  public async updateFeed(
    feed: Types.FeedUpdateInput,
  ): Promise<Types.UpdateFeedMutation> {
    return this.mutateAndCheckError<
      Types.UpdateFeedMutation,
      { feed: Types.FeedUpdateInput }
    >(Documents.UpdateFeed, { feed: feed });
  }

  public async deleteFeed(id: string): Promise<Types.DeleteFeedMutation> {
    return this.mutateAndCheckError<Types.DeleteFeedMutation, { id: string }>(
      Documents.DeleteFeed,
      { id: id },
    );
  }

  public async deleteFeeds(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteFeedsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteFeedsMutation,
      { ids: string[]; isSynchronous?: boolean }
    >(Documents.DeleteFeeds, { ids: ids, isSynchronous: isSynchronous });
  }

  public async deleteAllFeeds(
    filter?: Types.FeedFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllFeedsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllFeedsMutation,
      {
        filter?: Types.FeedFilter;
        isSynchronous?: boolean;
        correlationId?: string;
      }
    >(Documents.DeleteAllFeeds, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  public async enableFeed(id: string): Promise<Types.EnableFeedMutation> {
    return this.mutateAndCheckError<Types.EnableFeedMutation, { id: string }>(
      Documents.EnableFeed,
      { id: id },
    );
  }

  public async disableFeed(id: string): Promise<Types.DeleteFeedMutation> {
    return this.mutateAndCheckError<Types.DeleteFeedMutation, { id: string }>(
      Documents.DisableFeed,
      { id: id },
    );
  }

  public async getFeed(id: string): Promise<Types.GetFeedQuery> {
    return this.queryAndCheckError<Types.GetFeedQuery, { id: string }>(
      Documents.GetFeed,
      { id: id },
    );
  }

  public async queryFeeds(
    filter?: Types.FeedFilter,
  ): Promise<Types.QueryFeedsQuery> {
    return this.queryAndCheckError<
      Types.QueryFeedsQuery,
      { filter?: Types.FeedFilter }
    >(Documents.QueryFeeds, { filter: filter });
  }

  public async countFeeds(
    filter?: Types.FeedFilter,
  ): Promise<Types.CountFeedsQuery> {
    return this.queryAndCheckError<
      Types.CountFeedsQuery,
      { filter?: Types.FeedFilter }
    >(Documents.CountFeeds, { filter: filter });
  }

  public async feedExists(
    filter?: Types.FeedFilter,
  ): Promise<Types.FeedExistsQuery> {
    return this.queryAndCheckError<
      Types.FeedExistsQuery,
      { filter?: Types.FeedFilter }
    >(Documents.FeedExists, { filter: filter });
  }

  public async isFeedDone(id: string): Promise<Types.IsFeedDoneQuery> {
    return this.queryAndCheckError<Types.IsFeedDoneQuery, { id: string }>(
      Documents.IsFeedDone,
      { id: id },
    );
  }

  public async promptSpecifications(
    prompt: string,
    ids: string[],
  ): Promise<Types.PromptSpecificationsMutation> {
    return this.mutateAndCheckError<
      Types.PromptSpecificationsMutation,
      { prompt: string; ids: string[] }
    >(Documents.PromptSpecifications, { prompt: prompt, ids: ids });
  }

  public async createSpecification(
    specification: Types.SpecificationInput,
  ): Promise<Types.CreateSpecificationMutation> {
    return this.mutateAndCheckError<
      Types.CreateSpecificationMutation,
      { specification: Types.SpecificationInput }
    >(Documents.CreateSpecification, { specification: specification });
  }

  public async updateSpecification(
    specification: Types.SpecificationUpdateInput,
  ): Promise<Types.UpdateSpecificationMutation> {
    return this.mutateAndCheckError<
      Types.UpdateSpecificationMutation,
      { specification: Types.SpecificationUpdateInput }
    >(Documents.UpdateSpecification, { specification: specification });
  }

  public async upsertSpecification(
    specification: Types.SpecificationInput,
  ): Promise<Types.UpsertSpecificationMutation> {
    return this.mutateAndCheckError<
      Types.UpsertSpecificationMutation,
      { specification: Types.SpecificationInput }
    >(Documents.UpsertSpecification, { specification: specification });
  }

  public async deleteSpecification(
    id: string,
  ): Promise<Types.DeleteSpecificationMutation> {
    return this.mutateAndCheckError<
      Types.DeleteSpecificationMutation,
      { id: string }
    >(Documents.DeleteSpecification, { id: id });
  }

  public async deleteSpecifications(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteSpecificationsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteSpecificationsMutation,
      { ids: string[]; isSynchronous?: boolean }
    >(Documents.DeleteSpecifications, {
      ids: ids,
      isSynchronous: isSynchronous,
    });
  }

  public async deleteAllSpecifications(
    filter?: Types.SpecificationFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllSpecificationsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllSpecificationsMutation,
      {
        filter?: Types.SpecificationFilter;
        isSynchronous?: boolean;
        correlationId?: string;
      }
    >(Documents.DeleteAllSpecifications, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  public async getSpecification(
    id: string,
  ): Promise<Types.GetSpecificationQuery> {
    return this.queryAndCheckError<Types.GetSpecificationQuery, { id: string }>(
      Documents.GetSpecification,
      { id: id },
    );
  }

  public async querySpecifications(
    filter?: Types.SpecificationFilter,
  ): Promise<Types.QuerySpecificationsQuery> {
    return this.queryAndCheckError<
      Types.QuerySpecificationsQuery,
      { filter?: Types.SpecificationFilter }
    >(Documents.QuerySpecifications, { filter: filter });
  }

  public async countSpecifications(
    filter?: Types.SpecificationFilter,
  ): Promise<Types.CountSpecificationsQuery> {
    return this.queryAndCheckError<
      Types.CountSpecificationsQuery,
      { filter?: Types.SpecificationFilter }
    >(Documents.CountSpecifications, { filter: filter });
  }

  public async specificationExists(
    filter?: Types.SpecificationFilter,
  ): Promise<Types.SpecificationExistsQuery> {
    return this.queryAndCheckError<
      Types.QuerySpecificationsQuery,
      { filter?: Types.SpecificationFilter }
    >(Documents.SpecificationExists, { filter: filter });
  }

  public async queryModels(
    filter?: Types.ModelFilter,
  ): Promise<Types.QueryModelsQuery> {
    return this.queryAndCheckError<
      Types.QueryModelsQuery,
      { filter?: Types.ModelFilter }
    >(Documents.QueryModels, { filter: filter });
  }

  public async createConnector(
    connector: Types.ConnectorInput,
  ): Promise<Types.CreateConnectorMutation> {
    return this.mutateAndCheckError<
      Types.CreateConnectorMutation,
      { connector: Types.ConnectorInput }
    >(Documents.CreateConnector, { connector: connector });
  }

  public async updateConnector(
    connector: Types.ConnectorUpdateInput,
  ): Promise<Types.UpdateConnectorMutation> {
    return this.mutateAndCheckError<
      Types.UpdateConnectorMutation,
      { connector: Types.ConnectorUpdateInput }
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

  public async deleteConnector(
    id: string,
  ): Promise<Types.DeleteConnectorMutation> {
    return this.mutateAndCheckError<
      Types.DeleteConnectorMutation,
      { id: string }
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

  public async getConnector(id: string): Promise<Types.GetConnectorQuery> {
    return this.queryAndCheckError<Types.GetConnectorQuery, { id: string }>(
      Documents.GetConnector,
      { id: id },
    );
  }

  public async queryConnectors(
    filter?: Types.ConnectorFilter,
  ): Promise<Types.QueryConnectorsQuery> {
    return this.queryAndCheckError<
      Types.QueryConnectorsQuery,
      { filter?: Types.ConnectorFilter }
    >(Documents.QueryConnectors, { filter: filter });
  }

  public async countConnectors(
    filter?: Types.ConnectorFilter,
  ): Promise<Types.CountConnectorsQuery> {
    return this.queryAndCheckError<
      Types.CountConnectorsQuery,
      { filter?: Types.ConnectorFilter }
    >(Documents.CountConnectors, { filter: filter });
  }

  /*
  public async connectorExists(
    filter?: Types.ConnectorFilter
  ): Promise<Types.ConnectorExistsQuery> {
    return this.queryAndCheckError<
      Types.QueryConnectorsQuery,
      { filter?: Types.ConnectorFilter }
    >(Documents.ConnectorExists, { filter: filter });
  }
  */

  public async createView(
    view: Types.ViewInput,
  ): Promise<Types.CreateViewMutation> {
    return this.mutateAndCheckError<
      Types.CreateViewMutation,
      { view: Types.ViewInput }
    >(Documents.CreateView, { view: view });
  }

  public async updateView(
    view: Types.ViewUpdateInput,
  ): Promise<Types.UpdateViewMutation> {
    return this.mutateAndCheckError<
      Types.UpdateViewMutation,
      { view: Types.ViewUpdateInput }
    >(Documents.UpdateView, { view: view });
  }

  public async upsertView(
    view: Types.ViewInput,
  ): Promise<Types.UpsertViewMutation> {
    return this.mutateAndCheckError<
      Types.UpsertViewMutation,
      { view: Types.ViewInput }
    >(Documents.UpsertView, { view: view });
  }

  public async deleteView(id: string): Promise<Types.DeleteViewMutation> {
    return this.mutateAndCheckError<Types.DeleteViewMutation, { id: string }>(
      Documents.DeleteView,
      { id: id },
    );
  }

  public async deleteViews(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteViewsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteViewsMutation,
      { ids: string[]; isSynchronous?: boolean }
    >(Documents.DeleteViews, { ids: ids, isSynchronous: isSynchronous });
  }

  public async deleteAllViews(
    filter?: Types.ViewFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllViewsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllViewsMutation,
      {
        filter?: Types.ViewFilter;
        isSynchronous?: boolean;
        correlationId?: string;
      }
    >(Documents.DeleteAllViews, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  public async getView(id: string): Promise<Types.GetViewQuery> {
    return this.queryAndCheckError<Types.GetViewQuery, { id: string }>(
      Documents.GetView,
      { id: id },
    );
  }

  public async queryViews(
    filter?: Types.ViewFilter,
  ): Promise<Types.QueryViewsQuery> {
    return this.queryAndCheckError<
      Types.QueryViewsQuery,
      { filter?: Types.ViewFilter }
    >(Documents.QueryViews, { filter: filter });
  }

  public async countViews(
    filter?: Types.ViewFilter,
  ): Promise<Types.CountViewsQuery> {
    return this.queryAndCheckError<
      Types.CountViewsQuery,
      { filter?: Types.ViewFilter }
    >(Documents.CountViews, { filter: filter });
  }

  public async viewExists(
    filter?: Types.ViewFilter,
  ): Promise<Types.ViewExistsQuery> {
    return this.queryAndCheckError<
      Types.QueryViewsQuery,
      { filter?: Types.ViewFilter }
    >(Documents.ViewExists, { filter: filter });
  }

  public async createWorkflow(
    workflow: Types.WorkflowInput,
  ): Promise<Types.CreateWorkflowMutation> {
    return this.mutateAndCheckError<
      Types.CreateWorkflowMutation,
      { workflow: Types.WorkflowInput }
    >(Documents.CreateWorkflow, { workflow: workflow });
  }

  public async updateWorkflow(
    workflow: Types.WorkflowUpdateInput,
  ): Promise<Types.UpdateWorkflowMutation> {
    return this.mutateAndCheckError<
      Types.UpdateWorkflowMutation,
      { workflow: Types.WorkflowUpdateInput }
    >(Documents.UpdateWorkflow, { workflow: workflow });
  }

  public async upsertWorkflow(
    workflow: Types.WorkflowInput,
  ): Promise<Types.UpsertWorkflowMutation> {
    return this.mutateAndCheckError<
      Types.UpsertWorkflowMutation,
      { workflow: Types.WorkflowInput }
    >(Documents.UpsertWorkflow, { workflow: workflow });
  }

  public async deleteWorkflow(
    id: string,
  ): Promise<Types.DeleteWorkflowMutation> {
    return this.mutateAndCheckError<
      Types.DeleteWorkflowMutation,
      { id: string }
    >(Documents.DeleteWorkflow, { id: id });
  }

  public async deleteWorkflows(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteWorkflowsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteWorkflowsMutation,
      { ids: string[]; isSynchronous?: boolean }
    >(Documents.DeleteWorkflows, { ids: ids, isSynchronous: isSynchronous });
  }

  public async deleteAllWorkflows(
    filter?: Types.WorkflowFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllWorkflowsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllWorkflowsMutation,
      {
        filter?: Types.WorkflowFilter;
        isSynchronous?: boolean;
        correlationId?: string;
      }
    >(Documents.DeleteAllWorkflows, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  public async getWorkflow(id: string): Promise<Types.GetWorkflowQuery> {
    return this.queryAndCheckError<Types.GetWorkflowQuery, { id: string }>(
      Documents.GetWorkflow,
      { id: id },
    );
  }

  public async queryWorkflows(
    filter?: Types.WorkflowFilter,
  ): Promise<Types.QueryWorkflowsQuery> {
    return this.queryAndCheckError<
      Types.QueryWorkflowsQuery,
      { filter?: Types.WorkflowFilter }
    >(Documents.QueryWorkflows, { filter: filter });
  }

  public async countWorkflows(
    filter?: Types.WorkflowFilter,
  ): Promise<Types.CountWorkflowsQuery> {
    return this.queryAndCheckError<
      Types.CountWorkflowsQuery,
      { filter?: Types.WorkflowFilter }
    >(Documents.CountWorkflows, { filter: filter });
  }

  public async workflowExists(
    filter?: Types.WorkflowFilter,
  ): Promise<Types.WorkflowExistsQuery> {
    return this.queryAndCheckError<
      Types.QueryWorkflowsQuery,
      { filter?: Types.WorkflowFilter }
    >(Documents.WorkflowExists, { filter: filter });
  }

  public async createUser(
    user: Types.UserInput,
  ): Promise<Types.CreateUserMutation> {
    return this.mutateAndCheckError<
      Types.CreateUserMutation,
      { user: Types.UserInput }
    >(Documents.CreateUser, { user: user });
  }

  public async updateUser(
    user: Types.UserUpdateInput,
  ): Promise<Types.UpdateUserMutation> {
    return this.mutateAndCheckError<
      Types.UpdateUserMutation,
      { user: Types.UserUpdateInput }
    >(Documents.UpdateUser, { user: user });
  }

  public async deleteUser(id: string): Promise<Types.DeleteUserMutation> {
    return this.mutateAndCheckError<Types.DeleteUserMutation, { id: string }>(
      Documents.DeleteUser,
      { id: id },
    );
  }

  public async getUserByIdentifier(
    identifier: string,
  ): Promise<Types.GetUserByIdentifierQuery> {
    return this.queryAndCheckError<
      Types.GetUserByIdentifierQuery,
      { identifier: string }
    >(Documents.GetUserByIdentifier, { identifier: identifier });
  }

  public async getUser(): Promise<Types.GetUserQuery> {
    return this.queryAndCheckError<Types.GetUserQuery, {}>(
      Documents.GetUser,
      {},
    );
  }

  public async queryUsers(
    filter?: Types.UserFilter,
  ): Promise<Types.QueryUsersQuery> {
    return this.queryAndCheckError<
      Types.QueryUsersQuery,
      { filter?: Types.UserFilter }
    >(Documents.QueryUsers, { filter: filter });
  }

  public async countUsers(
    filter?: Types.UserFilter,
  ): Promise<Types.CountUsersQuery> {
    return this.queryAndCheckError<
      Types.CountUsersQuery,
      { filter?: Types.UserFilter }
    >(Documents.CountUsers, { filter: filter });
  }

  public async enableUser(id: string): Promise<Types.EnableUserMutation> {
    return this.mutateAndCheckError<Types.EnableUserMutation, { id: string }>(
      Documents.EnableUser,
      { id: id },
    );
  }

  public async disableUser(id: string): Promise<Types.DeleteUserMutation> {
    return this.mutateAndCheckError<Types.DeleteUserMutation, { id: string }>(
      Documents.DisableUser,
      { id: id },
    );
  }

  public async createCategory(
    category: Types.CategoryInput,
  ): Promise<Types.CreateCategoryMutation> {
    return this.mutateAndCheckError<
      Types.CreateCategoryMutation,
      { category: Types.CategoryInput }
    >(Documents.CreateCategory, { category: category });
  }

  public async updateCategory(
    category: Types.CategoryUpdateInput,
  ): Promise<Types.UpdateCategoryMutation> {
    return this.mutateAndCheckError<
      Types.UpdateCategoryMutation,
      { category: Types.CategoryUpdateInput }
    >(Documents.UpdateCategory, { category: category });
  }

  public async upsertCategory(
    category: Types.CategoryInput,
  ): Promise<Types.UpsertCategoryMutation> {
    return this.mutateAndCheckError<
      Types.UpsertCategoryMutation,
      { category: Types.CategoryInput }
    >(Documents.UpsertCategory, { category: category });
  }

  public async deleteCategory(
    id: string,
  ): Promise<Types.DeleteCategoryMutation> {
    return this.mutateAndCheckError<
      Types.DeleteCategoryMutation,
      { id: string }
    >(Documents.DeleteCategory, { id: id });
  }

  public async deleteCategories(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteCategoriesMutation> {
    return this.mutateAndCheckError<
      Types.DeleteCategoriesMutation,
      { ids: string[]; isSynchronous?: boolean }
    >(Documents.DeleteCategories, { ids: ids, isSynchronous: isSynchronous });
  }

  public async deleteAllCategories(
    filter?: Types.CategoryFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllCategoriesMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllCategoriesMutation,
      {
        filter?: Types.CategoryFilter;
        isSynchronous?: boolean;
        correlationId?: string;
      }
    >(Documents.DeleteAllCategories, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  public async getCategory(id: string): Promise<Types.GetCategoryQuery> {
    return this.queryAndCheckError<Types.GetCategoryQuery, { id: string }>(
      Documents.GetCategory,
      { id: id },
    );
  }

  public async queryCategories(
    filter?: Types.CategoryFilter,
  ): Promise<Types.QueryCategoriesQuery> {
    return this.queryAndCheckError<
      Types.QueryCategoriesQuery,
      { filter?: Types.CategoryFilter }
    >(Documents.QueryCategories, { filter: filter });
  }

  public async createLabel(
    label: Types.LabelInput,
  ): Promise<Types.CreateLabelMutation> {
    return this.mutateAndCheckError<
      Types.CreateLabelMutation,
      { label: Types.LabelInput }
    >(Documents.CreateLabel, { label: label });
  }

  public async updateLabel(
    label: Types.LabelUpdateInput,
  ): Promise<Types.UpdateLabelMutation> {
    return this.mutateAndCheckError<
      Types.UpdateLabelMutation,
      { label: Types.LabelUpdateInput }
    >(Documents.UpdateLabel, { label: label });
  }

  public async upsertLabel(
    label: Types.LabelInput,
  ): Promise<Types.UpsertLabelMutation> {
    return this.mutateAndCheckError<
      Types.UpsertLabelMutation,
      { label: Types.LabelInput }
    >(Documents.UpsertLabel, { label: label });
  }

  public async deleteLabel(id: string): Promise<Types.DeleteLabelMutation> {
    return this.mutateAndCheckError<Types.DeleteLabelMutation, { id: string }>(
      Documents.DeleteLabel,
      { id: id },
    );
  }

  public async deleteLabels(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteLabelsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteLabelsMutation,
      { ids: string[]; isSynchronous?: boolean }
    >(Documents.DeleteLabels, { ids: ids, isSynchronous: isSynchronous });
  }

  public async deleteAllLabels(
    filter?: Types.LabelFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllLabelsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllLabelsMutation,
      {
        filter?: Types.LabelFilter;
        isSynchronous?: boolean;
        correlationId?: string;
      }
    >(Documents.DeleteAllLabels, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  public async getLabel(id: string): Promise<Types.GetLabelQuery> {
    return this.queryAndCheckError<Types.GetLabelQuery, { id: string }>(
      Documents.GetLabel,
      { id: id },
    );
  }

  public async queryLabels(
    filter?: Types.LabelFilter,
  ): Promise<Types.QueryLabelsQuery> {
    return this.queryAndCheckError<
      Types.QueryLabelsQuery,
      { filter?: Types.LabelFilter }
    >(Documents.QueryLabels, { filter: filter });
  }

  public async createPerson(
    person: Types.PersonInput,
  ): Promise<Types.CreatePersonMutation> {
    return this.mutateAndCheckError<
      Types.CreatePersonMutation,
      { person: Types.PersonInput }
    >(Documents.CreatePerson, { person: person });
  }

  public async updatePerson(
    person: Types.PersonUpdateInput,
  ): Promise<Types.UpdatePersonMutation> {
    return this.mutateAndCheckError<
      Types.UpdatePersonMutation,
      { person: Types.PersonUpdateInput }
    >(Documents.UpdatePerson, { person: person });
  }

  public async deletePerson(id: string): Promise<Types.DeletePersonMutation> {
    return this.mutateAndCheckError<Types.DeletePersonMutation, { id: string }>(
      Documents.DeletePerson,
      { id: id },
    );
  }

  public async deletePersons(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeletePersonsMutation> {
    return this.mutateAndCheckError<
      Types.DeletePersonsMutation,
      { ids: string[]; isSynchronous?: boolean }
    >(Documents.DeletePersons, { ids: ids, isSynchronous: isSynchronous });
  }

  public async deleteAllPersons(
    filter?: Types.PersonFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllPersonsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllPersonsMutation,
      {
        filter?: Types.PersonFilter;
        isSynchronous?: boolean;
        correlationId?: string;
      }
    >(Documents.DeleteAllPersons, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  public async getPerson(id: string): Promise<Types.GetPersonQuery> {
    return this.queryAndCheckError<Types.GetPersonQuery, { id: string }>(
      Documents.GetPerson,
      { id: id },
    );
  }

  public async queryPersons(
    filter?: Types.PersonFilter,
  ): Promise<Types.QueryPersonsQuery> {
    return this.queryAndCheckError<
      Types.QueryPersonsQuery,
      { filter?: Types.PersonFilter }
    >(Documents.QueryPersons, { filter: filter });
  }

  public async createOrganization(
    organization: Types.OrganizationInput,
  ): Promise<Types.CreateOrganizationMutation> {
    return this.mutateAndCheckError<
      Types.CreateOrganizationMutation,
      { organization: Types.OrganizationInput }
    >(Documents.CreateOrganization, { organization: organization });
  }

  public async updateOrganization(
    organization: Types.OrganizationUpdateInput,
  ): Promise<Types.UpdateOrganizationMutation> {
    return this.mutateAndCheckError<
      Types.UpdateOrganizationMutation,
      { organization: Types.OrganizationUpdateInput }
    >(Documents.UpdateOrganization, { organization: organization });
  }

  public async deleteOrganization(
    id: string,
  ): Promise<Types.DeleteOrganizationMutation> {
    return this.mutateAndCheckError<
      Types.DeleteOrganizationMutation,
      { id: string }
    >(Documents.DeleteOrganization, { id: id });
  }

  public async deleteOrganizations(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteOrganizationsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteOrganizationsMutation,
      { ids: string[]; isSynchronous?: boolean }
    >(Documents.DeleteOrganizations, {
      ids: ids,
      isSynchronous: isSynchronous,
    });
  }

  public async deleteAllOrganizations(
    filter?: Types.OrganizationFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllOrganizationsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllOrganizationsMutation,
      {
        filter?: Types.OrganizationFilter;
        isSynchronous?: boolean;
        correlationId?: string;
      }
    >(Documents.DeleteAllOrganizations, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  public async getOrganization(
    id: string,
  ): Promise<Types.GetOrganizationQuery> {
    return this.queryAndCheckError<Types.GetOrganizationQuery, { id: string }>(
      Documents.GetOrganization,
      { id: id },
    );
  }

  public async queryOrganizations(
    filter?: Types.OrganizationFilter,
  ): Promise<Types.QueryOrganizationsQuery> {
    return this.queryAndCheckError<
      Types.QueryOrganizationsQuery,
      { filter?: Types.OrganizationFilter }
    >(Documents.QueryOrganizations, { filter: filter });
  }

  public async createPlace(
    place: Types.PlaceInput,
  ): Promise<Types.CreatePlaceMutation> {
    return this.mutateAndCheckError<
      Types.CreatePlaceMutation,
      { place: Types.PlaceInput }
    >(Documents.CreatePlace, { place: place });
  }

  public async updatePlace(
    place: Types.PlaceUpdateInput,
  ): Promise<Types.UpdatePlaceMutation> {
    return this.mutateAndCheckError<
      Types.UpdatePlaceMutation,
      { place: Types.PlaceUpdateInput }
    >(Documents.UpdatePlace, { place: place });
  }

  public async deletePlace(id: string): Promise<Types.DeletePlaceMutation> {
    return this.mutateAndCheckError<Types.DeletePlaceMutation, { id: string }>(
      Documents.DeletePlace,
      { id: id },
    );
  }

  public async deletePlaces(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeletePlacesMutation> {
    return this.mutateAndCheckError<
      Types.DeletePlacesMutation,
      { ids: string[]; isSynchronous?: boolean }
    >(Documents.DeletePlaces, { ids: ids, isSynchronous: isSynchronous });
  }

  public async deleteAllPlaces(
    filter?: Types.PlaceFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllPlacesMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllPlacesMutation,
      {
        filter?: Types.PlaceFilter;
        isSynchronous?: boolean;
        correlationId?: string;
      }
    >(Documents.DeleteAllPlaces, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  public async getPlace(id: string): Promise<Types.GetPlaceQuery> {
    return this.queryAndCheckError<Types.GetPlaceQuery, { id: string }>(
      Documents.GetPlace,
      { id: id },
    );
  }

  public async queryPlaces(
    filter?: Types.PlaceFilter,
  ): Promise<Types.QueryPlacesQuery> {
    return this.queryAndCheckError<
      Types.QueryPlacesQuery,
      { filter?: Types.PlaceFilter }
    >(Documents.QueryPlaces, { filter: filter });
  }

  public async createEvent(
    event: Types.EventInput,
  ): Promise<Types.CreateEventMutation> {
    return this.mutateAndCheckError<
      Types.CreateEventMutation,
      { event: Types.EventInput }
    >(Documents.CreateEvent, { event: event });
  }

  public async updateEvent(
    event: Types.EventUpdateInput,
  ): Promise<Types.UpdateEventMutation> {
    return this.mutateAndCheckError<
      Types.UpdateEventMutation,
      { event: Types.EventUpdateInput }
    >(Documents.UpdateEvent, { event: event });
  }

  public async deleteEvent(id: string): Promise<Types.DeleteEventMutation> {
    return this.mutateAndCheckError<Types.DeleteEventMutation, { id: string }>(
      Documents.DeleteEvent,
      { id: id },
    );
  }

  public async deleteEvents(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteEventsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteEventsMutation,
      { ids: string[]; isSynchronous?: boolean }
    >(Documents.DeleteEvents, { ids: ids, isSynchronous: isSynchronous });
  }

  public async deleteAllEvents(
    filter?: Types.EventFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllEventsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllEventsMutation,
      {
        filter?: Types.EventFilter;
        isSynchronous?: boolean;
        correlationId?: string;
      }
    >(Documents.DeleteAllEvents, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  public async getEvent(id: string): Promise<Types.GetEventQuery> {
    return this.queryAndCheckError<Types.GetEventQuery, { id: string }>(
      Documents.GetEvent,
      { id: id },
    );
  }

  public async queryEvents(
    filter?: Types.EventFilter,
  ): Promise<Types.QueryEventsQuery> {
    return this.queryAndCheckError<
      Types.QueryEventsQuery,
      { filter?: Types.EventFilter }
    >(Documents.QueryEvents, { filter: filter });
  }

  public async createProduct(
    product: Types.ProductInput,
  ): Promise<Types.CreateProductMutation> {
    return this.mutateAndCheckError<
      Types.CreateProductMutation,
      { product: Types.ProductInput }
    >(Documents.CreateProduct, { product: product });
  }

  public async updateProduct(
    product: Types.ProductUpdateInput,
  ): Promise<Types.UpdateProductMutation> {
    return this.mutateAndCheckError<
      Types.UpdateProductMutation,
      { product: Types.ProductUpdateInput }
    >(Documents.UpdateProduct, { product: product });
  }

  public async deleteProduct(id: string): Promise<Types.DeleteProductMutation> {
    return this.mutateAndCheckError<
      Types.DeleteProductMutation,
      { id: string }
    >(Documents.DeleteProduct, { id: id });
  }

  public async deleteProducts(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteProductsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteProductsMutation,
      { ids: string[]; isSynchronous?: boolean }
    >(Documents.DeleteProducts, { ids: ids, isSynchronous: isSynchronous });
  }

  public async deleteAllProducts(
    filter?: Types.ProductFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllProductsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllProductsMutation,
      {
        filter?: Types.ProductFilter;
        isSynchronous?: boolean;
        correlationId?: string;
      }
    >(Documents.DeleteAllProducts, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  public async getProduct(id: string): Promise<Types.GetProductQuery> {
    return this.queryAndCheckError<Types.GetProductQuery, { id: string }>(
      Documents.GetProduct,
      { id: id },
    );
  }

  public async queryProducts(
    filter?: Types.ProductFilter,
  ): Promise<Types.QueryProductsQuery> {
    return this.queryAndCheckError<
      Types.QueryProductsQuery,
      { filter?: Types.ProductFilter }
    >(Documents.QueryProducts, { filter: filter });
  }

  public async createRepo(
    repo: Types.RepoInput,
  ): Promise<Types.CreateRepoMutation> {
    return this.mutateAndCheckError<
      Types.CreateRepoMutation,
      { repo: Types.RepoInput }
    >(Documents.CreateRepo, { repo: repo });
  }

  public async updateRepo(
    repo: Types.RepoUpdateInput,
  ): Promise<Types.UpdateRepoMutation> {
    return this.mutateAndCheckError<
      Types.UpdateRepoMutation,
      { repo: Types.RepoUpdateInput }
    >(Documents.UpdateRepo, { repo: repo });
  }

  public async deleteRepo(id: string): Promise<Types.DeleteRepoMutation> {
    return this.mutateAndCheckError<Types.DeleteRepoMutation, { id: string }>(
      Documents.DeleteRepo,
      { id: id },
    );
  }

  public async deleteRepos(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteReposMutation> {
    return this.mutateAndCheckError<
      Types.DeleteReposMutation,
      { ids: string[]; isSynchronous?: boolean }
    >(Documents.DeleteRepos, { ids: ids, isSynchronous: isSynchronous });
  }

  public async deleteAllRepos(
    filter?: Types.RepoFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllReposMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllReposMutation,
      {
        filter?: Types.RepoFilter;
        isSynchronous?: boolean;
        correlationId?: string;
      }
    >(Documents.DeleteAllRepos, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  public async getRepo(id: string): Promise<Types.GetRepoQuery> {
    return this.queryAndCheckError<Types.GetRepoQuery, { id: string }>(
      Documents.GetRepo,
      { id: id },
    );
  }

  public async queryRepos(
    filter?: Types.RepoFilter,
  ): Promise<Types.QueryReposQuery> {
    return this.queryAndCheckError<
      Types.QueryReposQuery,
      { filter?: Types.RepoFilter }
    >(Documents.QueryRepos, { filter: filter });
  }

  public async createSoftware(
    software: Types.SoftwareInput,
  ): Promise<Types.CreateSoftwareMutation> {
    return this.mutateAndCheckError<
      Types.CreateSoftwareMutation,
      { software: Types.SoftwareInput }
    >(Documents.CreateSoftware, { software: software });
  }

  public async updateSoftware(
    software: Types.SoftwareUpdateInput,
  ): Promise<Types.UpdateSoftwareMutation> {
    return this.mutateAndCheckError<
      Types.UpdateSoftwareMutation,
      { software: Types.SoftwareUpdateInput }
    >(Documents.UpdateSoftware, { software: software });
  }

  public async deleteSoftware(
    id: string,
  ): Promise<Types.DeleteSoftwareMutation> {
    return this.mutateAndCheckError<
      Types.DeleteSoftwareMutation,
      { id: string }
    >(Documents.DeleteSoftware, { id: id });
  }

  public async deleteSoftwares(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteSoftwaresMutation> {
    return this.mutateAndCheckError<
      Types.DeleteSoftwaresMutation,
      { ids: string[]; isSynchronous?: boolean }
    >(Documents.DeleteSoftwares, { ids: ids, isSynchronous: isSynchronous });
  }

  public async deleteAllSoftwares(
    filter?: Types.SoftwareFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllSoftwaresMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllSoftwaresMutation,
      {
        filter?: Types.SoftwareFilter;
        isSynchronous?: boolean;
        correlationId?: string;
      }
    >(Documents.DeleteAllSoftwares, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  public async getSoftware(id: string): Promise<Types.GetSoftwareQuery> {
    return this.queryAndCheckError<Types.GetSoftwareQuery, { id: string }>(
      Documents.GetSoftware,
      { id: id },
    );
  }

  public async querySoftwares(
    filter?: Types.SoftwareFilter,
  ): Promise<Types.QuerySoftwaresQuery> {
    return this.queryAndCheckError<
      Types.QuerySoftwaresQuery,
      { filter?: Types.SoftwareFilter }
    >(Documents.QuerySoftwares, { filter: filter });
  }

  public async createMedicalCondition(
    MedicalCondition: Types.MedicalConditionInput,
  ): Promise<Types.CreateMedicalConditionMutation> {
    return this.mutateAndCheckError<
      Types.CreateMedicalConditionMutation,
      { MedicalCondition: Types.MedicalConditionInput }
    >(Documents.CreateMedicalCondition, { MedicalCondition: MedicalCondition });
  }

  public async updateMedicalCondition(
    MedicalCondition: Types.MedicalConditionUpdateInput,
  ): Promise<Types.UpdateMedicalConditionMutation> {
    return this.mutateAndCheckError<
      Types.UpdateMedicalConditionMutation,
      { MedicalCondition: Types.MedicalConditionUpdateInput }
    >(Documents.UpdateMedicalCondition, { MedicalCondition: MedicalCondition });
  }

  public async deleteMedicalCondition(
    id: string,
  ): Promise<Types.DeleteMedicalConditionMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalConditionMutation,
      { id: string }
    >(Documents.DeleteMedicalCondition, { id: id });
  }

  public async deleteMedicalConditions(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteMedicalConditionsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalConditionsMutation,
      { ids: string[]; isSynchronous?: boolean }
    >(Documents.DeleteMedicalConditions, {
      ids: ids,
      isSynchronous: isSynchronous,
    });
  }

  public async deleteAllMedicalConditions(
    filter?: Types.MedicalConditionFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllMedicalConditionsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllMedicalConditionsMutation,
      {
        filter?: Types.MedicalConditionFilter;
        isSynchronous?: boolean;
        correlationId?: string;
      }
    >(Documents.DeleteAllMedicalConditions, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  public async getMedicalCondition(
    id: string,
  ): Promise<Types.GetMedicalConditionQuery> {
    return this.queryAndCheckError<
      Types.GetMedicalConditionQuery,
      { id: string }
    >(Documents.GetMedicalCondition, { id: id });
  }

  public async queryMedicalConditions(
    filter?: Types.MedicalConditionFilter,
  ): Promise<Types.QueryMedicalConditionsQuery> {
    return this.queryAndCheckError<
      Types.QueryMedicalConditionsQuery,
      { filter?: Types.MedicalConditionFilter }
    >(Documents.QueryMedicalConditions, { filter: filter });
  }

  public async createMedicalGuideline(
    MedicalGuideline: Types.MedicalGuidelineInput,
  ): Promise<Types.CreateMedicalGuidelineMutation> {
    return this.mutateAndCheckError<
      Types.CreateMedicalGuidelineMutation,
      { MedicalGuideline: Types.MedicalGuidelineInput }
    >(Documents.CreateMedicalGuideline, { MedicalGuideline: MedicalGuideline });
  }

  public async updateMedicalGuideline(
    MedicalGuideline: Types.MedicalGuidelineUpdateInput,
  ): Promise<Types.UpdateMedicalGuidelineMutation> {
    return this.mutateAndCheckError<
      Types.UpdateMedicalGuidelineMutation,
      { MedicalGuideline: Types.MedicalGuidelineUpdateInput }
    >(Documents.UpdateMedicalGuideline, { MedicalGuideline: MedicalGuideline });
  }

  public async deleteMedicalGuideline(
    id: string,
  ): Promise<Types.DeleteMedicalGuidelineMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalGuidelineMutation,
      { id: string }
    >(Documents.DeleteMedicalGuideline, { id: id });
  }

  public async deleteMedicalGuidelines(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteMedicalGuidelinesMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalGuidelinesMutation,
      { ids: string[]; isSynchronous?: boolean }
    >(Documents.DeleteMedicalGuidelines, {
      ids: ids,
      isSynchronous: isSynchronous,
    });
  }

  public async deleteAllMedicalGuidelines(
    filter?: Types.MedicalGuidelineFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllMedicalGuidelinesMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllMedicalGuidelinesMutation,
      {
        filter?: Types.MedicalGuidelineFilter;
        isSynchronous?: boolean;
        correlationId?: string;
      }
    >(Documents.DeleteAllMedicalGuidelines, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  public async getMedicalGuideline(
    id: string,
  ): Promise<Types.GetMedicalGuidelineQuery> {
    return this.queryAndCheckError<
      Types.GetMedicalGuidelineQuery,
      { id: string }
    >(Documents.GetMedicalGuideline, { id: id });
  }

  public async queryMedicalGuidelines(
    filter?: Types.MedicalGuidelineFilter,
  ): Promise<Types.QueryMedicalGuidelinesQuery> {
    return this.queryAndCheckError<
      Types.QueryMedicalGuidelinesQuery,
      { filter?: Types.MedicalGuidelineFilter }
    >(Documents.QueryMedicalGuidelines, { filter: filter });
  }

  public async createMedicalDrug(
    MedicalDrug: Types.MedicalDrugInput,
  ): Promise<Types.CreateMedicalDrugMutation> {
    return this.mutateAndCheckError<
      Types.CreateMedicalDrugMutation,
      { MedicalDrug: Types.MedicalDrugInput }
    >(Documents.CreateMedicalDrug, { MedicalDrug: MedicalDrug });
  }

  public async updateMedicalDrug(
    MedicalDrug: Types.MedicalDrugUpdateInput,
  ): Promise<Types.UpdateMedicalDrugMutation> {
    return this.mutateAndCheckError<
      Types.UpdateMedicalDrugMutation,
      { MedicalDrug: Types.MedicalDrugUpdateInput }
    >(Documents.UpdateMedicalDrug, { MedicalDrug: MedicalDrug });
  }

  public async deleteMedicalDrug(
    id: string,
  ): Promise<Types.DeleteMedicalDrugMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalDrugMutation,
      { id: string }
    >(Documents.DeleteMedicalDrug, { id: id });
  }

  public async deleteMedicalDrugs(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteMedicalDrugsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalDrugsMutation,
      { ids: string[]; isSynchronous?: boolean }
    >(Documents.DeleteMedicalDrugs, { ids: ids, isSynchronous: isSynchronous });
  }

  public async deleteAllMedicalDrugs(
    filter?: Types.MedicalDrugFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllMedicalDrugsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllMedicalDrugsMutation,
      {
        filter?: Types.MedicalDrugFilter;
        isSynchronous?: boolean;
        correlationId?: string;
      }
    >(Documents.DeleteAllMedicalDrugs, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  public async getMedicalDrug(id: string): Promise<Types.GetMedicalDrugQuery> {
    return this.queryAndCheckError<Types.GetMedicalDrugQuery, { id: string }>(
      Documents.GetMedicalDrug,
      { id: id },
    );
  }

  public async queryMedicalDrugs(
    filter?: Types.MedicalDrugFilter,
  ): Promise<Types.QueryMedicalDrugsQuery> {
    return this.queryAndCheckError<
      Types.QueryMedicalDrugsQuery,
      { filter?: Types.MedicalDrugFilter }
    >(Documents.QueryMedicalDrugs, { filter: filter });
  }

  public async createMedicalIndication(
    MedicalIndication: Types.MedicalIndicationInput,
  ): Promise<Types.CreateMedicalIndicationMutation> {
    return this.mutateAndCheckError<
      Types.CreateMedicalIndicationMutation,
      { MedicalIndication: Types.MedicalIndicationInput }
    >(Documents.CreateMedicalIndication, {
      MedicalIndication: MedicalIndication,
    });
  }

  public async updateMedicalIndication(
    MedicalIndication: Types.MedicalIndicationUpdateInput,
  ): Promise<Types.UpdateMedicalIndicationMutation> {
    return this.mutateAndCheckError<
      Types.UpdateMedicalIndicationMutation,
      { MedicalIndication: Types.MedicalIndicationUpdateInput }
    >(Documents.UpdateMedicalIndication, {
      MedicalIndication: MedicalIndication,
    });
  }

  public async deleteMedicalIndication(
    id: string,
  ): Promise<Types.DeleteMedicalIndicationMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalIndicationMutation,
      { id: string }
    >(Documents.DeleteMedicalIndication, { id: id });
  }

  public async deleteMedicalIndications(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteMedicalIndicationsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalIndicationsMutation,
      { ids: string[]; isSynchronous?: boolean }
    >(Documents.DeleteMedicalIndications, {
      ids: ids,
      isSynchronous: isSynchronous,
    });
  }

  public async deleteAllMedicalIndications(
    filter?: Types.MedicalIndicationFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllMedicalIndicationsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllMedicalIndicationsMutation,
      {
        filter?: Types.MedicalIndicationFilter;
        isSynchronous?: boolean;
        correlationId?: string;
      }
    >(Documents.DeleteAllMedicalIndications, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  public async getMedicalIndication(
    id: string,
  ): Promise<Types.GetMedicalIndicationQuery> {
    return this.queryAndCheckError<
      Types.GetMedicalIndicationQuery,
      { id: string }
    >(Documents.GetMedicalIndication, { id: id });
  }

  public async queryMedicalIndications(
    filter?: Types.MedicalIndicationFilter,
  ): Promise<Types.QueryMedicalIndicationsQuery> {
    return this.queryAndCheckError<
      Types.QueryMedicalIndicationsQuery,
      { filter?: Types.MedicalIndicationFilter }
    >(Documents.QueryMedicalIndications, { filter: filter });
  }

  public async createMedicalContraindication(
    MedicalContraindication: Types.MedicalContraindicationInput,
  ): Promise<Types.CreateMedicalContraindicationMutation> {
    return this.mutateAndCheckError<
      Types.CreateMedicalContraindicationMutation,
      { MedicalContraindication: Types.MedicalContraindicationInput }
    >(Documents.CreateMedicalContraindication, {
      MedicalContraindication: MedicalContraindication,
    });
  }

  public async updateMedicalContraindication(
    MedicalContraindication: Types.MedicalContraindicationUpdateInput,
  ): Promise<Types.UpdateMedicalContraindicationMutation> {
    return this.mutateAndCheckError<
      Types.UpdateMedicalContraindicationMutation,
      { MedicalContraindication: Types.MedicalContraindicationUpdateInput }
    >(Documents.UpdateMedicalContraindication, {
      MedicalContraindication: MedicalContraindication,
    });
  }

  public async deleteMedicalContraindication(
    id: string,
  ): Promise<Types.DeleteMedicalContraindicationMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalContraindicationMutation,
      { id: string }
    >(Documents.DeleteMedicalContraindication, { id: id });
  }

  public async deleteMedicalContraindications(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteMedicalContraindicationsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalContraindicationsMutation,
      { ids: string[]; isSynchronous?: boolean }
    >(Documents.DeleteMedicalContraindications, {
      ids: ids,
      isSynchronous: isSynchronous,
    });
  }

  public async deleteAllMedicalContraindications(
    filter?: Types.MedicalContraindicationFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllMedicalContraindicationsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllMedicalContraindicationsMutation,
      {
        filter?: Types.MedicalContraindicationFilter;
        isSynchronous?: boolean;
        correlationId?: string;
      }
    >(Documents.DeleteAllMedicalContraindications, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  public async getMedicalContraindication(
    id: string,
  ): Promise<Types.GetMedicalContraindicationQuery> {
    return this.queryAndCheckError<
      Types.GetMedicalContraindicationQuery,
      { id: string }
    >(Documents.GetMedicalContraindication, { id: id });
  }

  public async queryMedicalContraindications(
    filter?: Types.MedicalContraindicationFilter,
  ): Promise<Types.QueryMedicalContraindicationsQuery> {
    return this.queryAndCheckError<
      Types.QueryMedicalContraindicationsQuery,
      { filter?: Types.MedicalContraindicationFilter }
    >(Documents.QueryMedicalContraindications, { filter: filter });
  }

  public async createMedicalTest(
    MedicalTest: Types.MedicalTestInput,
  ): Promise<Types.CreateMedicalTestMutation> {
    return this.mutateAndCheckError<
      Types.CreateMedicalTestMutation,
      { MedicalTest: Types.MedicalTestInput }
    >(Documents.CreateMedicalTest, { MedicalTest: MedicalTest });
  }

  public async updateMedicalTest(
    MedicalTest: Types.MedicalTestUpdateInput,
  ): Promise<Types.UpdateMedicalTestMutation> {
    return this.mutateAndCheckError<
      Types.UpdateMedicalTestMutation,
      { MedicalTest: Types.MedicalTestUpdateInput }
    >(Documents.UpdateMedicalTest, { MedicalTest: MedicalTest });
  }

  public async deleteMedicalTest(
    id: string,
  ): Promise<Types.DeleteMedicalTestMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalTestMutation,
      { id: string }
    >(Documents.DeleteMedicalTest, { id: id });
  }

  public async deleteMedicalTests(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteMedicalTestsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalTestsMutation,
      { ids: string[]; isSynchronous?: boolean }
    >(Documents.DeleteMedicalTests, { ids: ids, isSynchronous: isSynchronous });
  }

  public async deleteAllMedicalTests(
    filter?: Types.MedicalTestFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllMedicalTestsMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllMedicalTestsMutation,
      {
        filter?: Types.MedicalTestFilter;
        isSynchronous?: boolean;
        correlationId?: string;
      }
    >(Documents.DeleteAllMedicalTests, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  public async getMedicalTest(id: string): Promise<Types.GetMedicalTestQuery> {
    return this.queryAndCheckError<Types.GetMedicalTestQuery, { id: string }>(
      Documents.GetMedicalTest,
      { id: id },
    );
  }

  public async queryMedicalTests(
    filter?: Types.MedicalTestFilter,
  ): Promise<Types.QueryMedicalTestsQuery> {
    return this.queryAndCheckError<
      Types.QueryMedicalTestsQuery,
      { filter?: Types.MedicalTestFilter }
    >(Documents.QueryMedicalTests, { filter: filter });
  }

  public async createMedicalDevice(
    MedicalDevice: Types.MedicalDeviceInput,
  ): Promise<Types.CreateMedicalDeviceMutation> {
    return this.mutateAndCheckError<
      Types.CreateMedicalDeviceMutation,
      { MedicalDevice: Types.MedicalDeviceInput }
    >(Documents.CreateMedicalDevice, { MedicalDevice: MedicalDevice });
  }

  public async updateMedicalDevice(
    MedicalDevice: Types.MedicalDeviceUpdateInput,
  ): Promise<Types.UpdateMedicalDeviceMutation> {
    return this.mutateAndCheckError<
      Types.UpdateMedicalDeviceMutation,
      { MedicalDevice: Types.MedicalDeviceUpdateInput }
    >(Documents.UpdateMedicalDevice, { MedicalDevice: MedicalDevice });
  }

  public async deleteMedicalDevice(
    id: string,
  ): Promise<Types.DeleteMedicalDeviceMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalDeviceMutation,
      { id: string }
    >(Documents.DeleteMedicalDevice, { id: id });
  }

  public async deleteMedicalDevices(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteMedicalDevicesMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalDevicesMutation,
      { ids: string[]; isSynchronous?: boolean }
    >(Documents.DeleteMedicalDevices, {
      ids: ids,
      isSynchronous: isSynchronous,
    });
  }

  public async deleteAllMedicalDevices(
    filter?: Types.MedicalDeviceFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllMedicalDevicesMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllMedicalDevicesMutation,
      {
        filter?: Types.MedicalDeviceFilter;
        isSynchronous?: boolean;
        correlationId?: string;
      }
    >(Documents.DeleteAllMedicalDevices, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  public async getMedicalDevice(
    id: string,
  ): Promise<Types.GetMedicalDeviceQuery> {
    return this.queryAndCheckError<Types.GetMedicalDeviceQuery, { id: string }>(
      Documents.GetMedicalDevice,
      { id: id },
    );
  }

  public async queryMedicalDevices(
    filter?: Types.MedicalDeviceFilter,
  ): Promise<Types.QueryMedicalDevicesQuery> {
    return this.queryAndCheckError<
      Types.QueryMedicalDevicesQuery,
      { filter?: Types.MedicalDeviceFilter }
    >(Documents.QueryMedicalDevices, { filter: filter });
  }

  public async createMedicalProcedure(
    MedicalProcedure: Types.MedicalProcedureInput,
  ): Promise<Types.CreateMedicalProcedureMutation> {
    return this.mutateAndCheckError<
      Types.CreateMedicalProcedureMutation,
      { MedicalProcedure: Types.MedicalProcedureInput }
    >(Documents.CreateMedicalProcedure, { MedicalProcedure: MedicalProcedure });
  }

  public async updateMedicalProcedure(
    MedicalProcedure: Types.MedicalProcedureUpdateInput,
  ): Promise<Types.UpdateMedicalProcedureMutation> {
    return this.mutateAndCheckError<
      Types.UpdateMedicalProcedureMutation,
      { MedicalProcedure: Types.MedicalProcedureUpdateInput }
    >(Documents.UpdateMedicalProcedure, { MedicalProcedure: MedicalProcedure });
  }

  public async deleteMedicalProcedure(
    id: string,
  ): Promise<Types.DeleteMedicalProcedureMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalProcedureMutation,
      { id: string }
    >(Documents.DeleteMedicalProcedure, { id: id });
  }

  public async deleteMedicalProcedures(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteMedicalProceduresMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalProceduresMutation,
      { ids: string[]; isSynchronous?: boolean }
    >(Documents.DeleteMedicalProcedures, {
      ids: ids,
      isSynchronous: isSynchronous,
    });
  }

  public async deleteAllMedicalProcedures(
    filter?: Types.MedicalProcedureFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllMedicalProceduresMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllMedicalProceduresMutation,
      {
        filter?: Types.MedicalProcedureFilter;
        isSynchronous?: boolean;
        correlationId?: string;
      }
    >(Documents.DeleteAllMedicalProcedures, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  public async getMedicalProcedure(
    id: string,
  ): Promise<Types.GetMedicalProcedureQuery> {
    return this.queryAndCheckError<
      Types.GetMedicalProcedureQuery,
      { id: string }
    >(Documents.GetMedicalProcedure, { id: id });
  }

  public async queryMedicalProcedures(
    filter?: Types.MedicalProcedureFilter,
  ): Promise<Types.QueryMedicalProceduresQuery> {
    return this.queryAndCheckError<
      Types.QueryMedicalProceduresQuery,
      { filter?: Types.MedicalProcedureFilter }
    >(Documents.QueryMedicalProcedures, { filter: filter });
  }

  public async createMedicalStudy(
    MedicalStudy: Types.MedicalStudyInput,
  ): Promise<Types.CreateMedicalStudyMutation> {
    return this.mutateAndCheckError<
      Types.CreateMedicalStudyMutation,
      { MedicalStudy: Types.MedicalStudyInput }
    >(Documents.CreateMedicalStudy, { MedicalStudy: MedicalStudy });
  }

  public async updateMedicalStudy(
    MedicalStudy: Types.MedicalStudyUpdateInput,
  ): Promise<Types.UpdateMedicalStudyMutation> {
    return this.mutateAndCheckError<
      Types.UpdateMedicalStudyMutation,
      { MedicalStudy: Types.MedicalStudyUpdateInput }
    >(Documents.UpdateMedicalStudy, { MedicalStudy: MedicalStudy });
  }

  public async deleteMedicalStudy(
    id: string,
  ): Promise<Types.DeleteMedicalStudyMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalStudyMutation,
      { id: string }
    >(Documents.DeleteMedicalStudy, { id: id });
  }

  public async deleteMedicalStudies(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteMedicalStudiesMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalStudiesMutation,
      { ids: string[]; isSynchronous?: boolean }
    >(Documents.DeleteMedicalStudies, {
      ids: ids,
      isSynchronous: isSynchronous,
    });
  }

  public async deleteAllMedicalStudies(
    filter?: Types.MedicalStudyFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllMedicalStudiesMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllMedicalStudiesMutation,
      {
        filter?: Types.MedicalStudyFilter;
        isSynchronous?: boolean;
        correlationId?: string;
      }
    >(Documents.DeleteAllMedicalStudies, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  public async getMedicalStudy(
    id: string,
  ): Promise<Types.GetMedicalStudyQuery> {
    return this.queryAndCheckError<Types.GetMedicalStudyQuery, { id: string }>(
      Documents.GetMedicalStudy,
      { id: id },
    );
  }

  public async queryMedicalStudies(
    filter?: Types.MedicalStudyFilter,
  ): Promise<Types.QueryMedicalStudiesQuery> {
    return this.queryAndCheckError<
      Types.QueryMedicalStudiesQuery,
      { filter?: Types.MedicalStudyFilter }
    >(Documents.QueryMedicalStudies, { filter: filter });
  }

  public async createMedicalDrugClass(
    MedicalDrugClass: Types.MedicalDrugClassInput,
  ): Promise<Types.CreateMedicalDrugClassMutation> {
    return this.mutateAndCheckError<
      Types.CreateMedicalDrugClassMutation,
      { MedicalDrugClass: Types.MedicalDrugClassInput }
    >(Documents.CreateMedicalDrugClass, { MedicalDrugClass: MedicalDrugClass });
  }

  public async updateMedicalDrugClass(
    MedicalDrugClass: Types.MedicalDrugClassUpdateInput,
  ): Promise<Types.UpdateMedicalDrugClassMutation> {
    return this.mutateAndCheckError<
      Types.UpdateMedicalDrugClassMutation,
      { MedicalDrugClass: Types.MedicalDrugClassUpdateInput }
    >(Documents.UpdateMedicalDrugClass, { MedicalDrugClass: MedicalDrugClass });
  }

  public async deleteMedicalDrugClass(
    id: string,
  ): Promise<Types.DeleteMedicalDrugClassMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalDrugClassMutation,
      { id: string }
    >(Documents.DeleteMedicalDrugClass, { id: id });
  }

  public async deleteMedicalDrugClasses(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteMedicalDrugClassesMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalDrugClassesMutation,
      { ids: string[]; isSynchronous?: boolean }
    >(Documents.DeleteMedicalDrugClasses, {
      ids: ids,
      isSynchronous: isSynchronous,
    });
  }

  public async deleteAllMedicalDrugClasses(
    filter?: Types.MedicalDrugClassFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllMedicalDrugClassesMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllMedicalDrugClassesMutation,
      {
        filter?: Types.MedicalDrugClassFilter;
        isSynchronous?: boolean;
        correlationId?: string;
      }
    >(Documents.DeleteAllMedicalDrugClasses, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  public async getMedicalDrugClass(
    id: string,
  ): Promise<Types.GetMedicalDrugClassQuery> {
    return this.queryAndCheckError<
      Types.GetMedicalDrugClassQuery,
      { id: string }
    >(Documents.GetMedicalDrugClass, { id: id });
  }

  public async queryMedicalDrugClasses(
    filter?: Types.MedicalDrugClassFilter,
  ): Promise<Types.QueryMedicalDrugClassesQuery> {
    return this.queryAndCheckError<
      Types.QueryMedicalDrugClassesQuery,
      { filter?: Types.MedicalDrugClassFilter }
    >(Documents.QueryMedicalDrugClasses, { filter: filter });
  }

  public async createMedicalTherapy(
    MedicalTherapy: Types.MedicalTherapyInput,
  ): Promise<Types.CreateMedicalTherapyMutation> {
    return this.mutateAndCheckError<
      Types.CreateMedicalTherapyMutation,
      { MedicalTherapy: Types.MedicalTherapyInput }
    >(Documents.CreateMedicalTherapy, { MedicalTherapy: MedicalTherapy });
  }

  public async updateMedicalTherapy(
    MedicalTherapy: Types.MedicalTherapyUpdateInput,
  ): Promise<Types.UpdateMedicalTherapyMutation> {
    return this.mutateAndCheckError<
      Types.UpdateMedicalTherapyMutation,
      { MedicalTherapy: Types.MedicalTherapyUpdateInput }
    >(Documents.UpdateMedicalTherapy, { MedicalTherapy: MedicalTherapy });
  }

  public async deleteMedicalTherapy(
    id: string,
  ): Promise<Types.DeleteMedicalTherapyMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalTherapyMutation,
      { id: string }
    >(Documents.DeleteMedicalTherapy, { id: id });
  }

  public async deleteMedicalTherapies(
    ids: string[],
    isSynchronous?: boolean,
  ): Promise<Types.DeleteMedicalTherapiesMutation> {
    return this.mutateAndCheckError<
      Types.DeleteMedicalTherapiesMutation,
      { ids: string[]; isSynchronous?: boolean }
    >(Documents.DeleteMedicalTherapies, {
      ids: ids,
      isSynchronous: isSynchronous,
    });
  }

  public async deleteAllMedicalTherapies(
    filter?: Types.MedicalTherapyFilter,
    isSynchronous?: boolean,
    correlationId?: string,
  ): Promise<Types.DeleteAllMedicalTherapiesMutation> {
    return this.mutateAndCheckError<
      Types.DeleteAllMedicalTherapiesMutation,
      {
        filter?: Types.MedicalTherapyFilter;
        isSynchronous?: boolean;
        correlationId?: string;
      }
    >(Documents.DeleteAllMedicalTherapies, {
      filter: filter,
      isSynchronous: isSynchronous,
      correlationId: correlationId,
    });
  }

  public async getMedicalTherapy(
    id: string,
  ): Promise<Types.GetMedicalTherapyQuery> {
    return this.queryAndCheckError<
      Types.GetMedicalTherapyQuery,
      { id: string }
    >(Documents.GetMedicalTherapy, { id: id });
  }

  public async queryMedicalTherapies(
    filter?: Types.MedicalTherapyFilter,
  ): Promise<Types.QueryMedicalTherapiesQuery> {
    return this.queryAndCheckError<
      Types.QueryMedicalTherapiesQuery,
      { filter?: Types.MedicalTherapyFilter }
    >(Documents.QueryMedicalTherapies, { filter: filter });
  }

  public async createObservation(
    observation: Types.ObservationInput,
  ): Promise<Types.CreateObservationMutation> {
    return this.mutateAndCheckError<
      Types.CreateObservationMutation,
      { observation: Types.ObservationInput }
    >(Documents.CreateObservation, { observation: observation });
  }

  public async updateObservation(
    observation: Types.ObservationUpdateInput,
  ): Promise<Types.UpdateObservationMutation> {
    return this.mutateAndCheckError<
      Types.UpdateObservationMutation,
      { observation: Types.ObservationUpdateInput }
    >(Documents.UpdateObservation, { observation: observation });
  }

  public async deleteObservation(
    id: string,
  ): Promise<Types.DeleteObservationMutation> {
    return this.mutateAndCheckError<
      Types.DeleteObservationMutation,
      { id: string }
    >(Documents.DeleteObservation, { id: id });
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
          moduleGoogle: GoogleGenerativeAI !== undefined,
          instanceGoogle: this.googleClient !== undefined,
        });
      }

      switch (serviceType) {
        case Types.ModelServiceTypes.OpenAi:
          return OpenAI !== undefined || this.openaiClient !== undefined;
        case Types.ModelServiceTypes.Anthropic:
          return Anthropic !== undefined || this.anthropicClient !== undefined;
        case Types.ModelServiceTypes.Google:
          return (
            GoogleGenerativeAI !== undefined || this.googleClient !== undefined
          );
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
      GoogleGenerativeAI !== undefined || this.googleClient !== undefined;
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

      while (
        currentMessage.toolCalls?.length &&
        rounds < maxRounds &&
        !abortController.signal.aborted
      ) {
        rounds++;

        // Execute tools
        const toolExecStart = Date.now();
        const toolResults = await this.executeToolsForPromptAgent(
          currentMessage.toolCalls.filter(
            (tc): tc is Types.ConversationToolCall => tc !== null,
          ),
          toolHandlers || {},
          allToolCalls,
          abortController.signal,
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
      const serviceType = fullSpec ? getServiceType(fullSpec) : undefined;

      uiAdapter = new UIEventAdapter(
        onEvent as (event: AgentStreamEvent) => void,
        actualConversationId,
        {
          smoothingEnabled: options?.smoothingEnabled ?? true,
          chunkingStrategy: options?.chunkingStrategy ?? "word",
          smoothingDelay: options?.smoothingDelay ?? 30,
          model: modelName,
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
      );
    } catch (error: unknown) {
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
  ): Promise<void> {
    let currentRound = 0;
    let fullMessage = "";

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

    // Build message array with conversation history
    const messages: Types.ConversationMessage[] = [];

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
          `   Google available: ${!!(GoogleGenerativeAI || this.googleClient)}`,
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
        (GoogleGenerativeAI || this.googleClient)
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
            `🔍 [Mistral] Passing tools: ${shouldPassTools ? 'YES' : 'NO'} (tool responses in messages: ${toolResponseCount})`,
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
            const result = await handler(args);

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

            // Add tool response to messages
            const toolMessage: any = {
              __typename: "ConversationMessage" as const,
              role: Types.ConversationRoleTypes.Tool,
              message:
                typeof result === "string" ? result : JSON.stringify(result),
              toolCallId: toolCall.id,
              timestamp: new Date().toISOString(),
            };
            // Add tool name for Mistral compatibility
            toolMessage.toolName = toolCall.name;
            messages.push(toolMessage);
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
            const errorToolMessage: any = {
              __typename: "ConversationMessage" as const,
              role: Types.ConversationRoleTypes.Tool,
              message: `Error: ${errorMessage}`,
              toolCallId: toolCall.id,
              timestamp: new Date().toISOString(),
            };
            // Add tool name for Mistral compatibility
            errorToolMessage.toolName = toolCall.name;
            messages.push(errorToolMessage);
          }
        }
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

      const completeResponse = await this.completeConversation(
        trimmedMessage,
        conversationId,
        millisecondsToTimeSpan(completionTime),
        millisecondsToTimeSpan(ttft),
        throughput,
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

    await streamWithOpenAI(
      specification,
      messages,
      tools,
      openaiClient,
      (event) => uiAdapter.handleEvent(event),
      onComplete,
      abortSignal,
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
    if (!GoogleGenerativeAI && !this.googleClient) {
      throw new Error("Google GenerativeAI client not available");
    }

    // Use provided client or create a new one
    const googleClient =
      this.googleClient ||
      (GoogleGenerativeAI
        ? new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "")
        : (() => {
            throw new Error("Google GenerativeAI module not available");
          })());

    if (process.env.DEBUG_GRAPHLIT_SDK_STREAMING) {
      console.log(
        `🚀 [Graphlit SDK] Routing to Google streaming provider | Spec: ${specification.name} (${specification.id}) | Messages: ${messages.length} | Tools: ${tools?.length || 0} | SystemPrompt: ${systemPrompt ? "Yes" : "No"}`,
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

      // Response for API
      return {
        id: toolCall.id,
        content: error ? error : result ? JSON.stringify(result) : "",
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

      if (result.errors) {
        const errorMessage = result.errors
          .map((err: any) => this.prettyPrintGraphQLError(err))
          .join("\n");
        throw new Error(errorMessage);
      }

      if (!result.data) {
        throw new Error("No data returned from mutation.");
      }

      return result.data;
    } catch (error) {
      if (error instanceof ApolloError && error.graphQLErrors.length > 0) {
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

      if (result.errors) {
        const errorMessage = result.errors
          .map((err: any) => this.prettyPrintGraphQLError(err))
          .join("\n");
        throw new Error(errorMessage);
      }

      if (!result.data) {
        throw new Error("No data returned from query.");
      }

      return result.data;
    } catch (error: unknown) {
      if (error instanceof ApolloError && error.graphQLErrors.length > 0) {
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

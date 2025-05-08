export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  Decimal: { input: any; output: any; }
  Long: { input: any; output: any; }
  TimeSpan: { input: any; output: any; }
  URL: { input: any; output: any; }
};

/** Represents an address. */
export type Address = {
  __typename?: 'Address';
  /** The city. */
  city?: Maybe<Scalars['String']['output']>;
  /** The country. */
  country?: Maybe<Scalars['String']['output']>;
  /** The zip code or postal code. */
  postalCode?: Maybe<Scalars['String']['output']>;
  /** The state or province. */
  region?: Maybe<Scalars['String']['output']>;
  /** The street address. */
  streetAddress?: Maybe<Scalars['String']['output']>;
};

/** Represents a filter for addresses. */
export type AddressFilter = {
  /** Filter addresses by their city. */
  city?: InputMaybe<Scalars['String']['input']>;
  /** Filter addresses by their country. */
  country?: InputMaybe<Scalars['String']['input']>;
  /** Filter addresses by their zip code or postal code. */
  postalCode?: InputMaybe<Scalars['String']['input']>;
  /** Filter addresses by their state or province. */
  region?: InputMaybe<Scalars['String']['input']>;
  /** Filter addresses by their street address. */
  streetAddress?: InputMaybe<Scalars['String']['input']>;
};

/** Represents an address. */
export type AddressInput = {
  /** The city. */
  city?: InputMaybe<Scalars['String']['input']>;
  /** The country. */
  country?: InputMaybe<Scalars['String']['input']>;
  /** The zip code or postal code. */
  postalCode?: InputMaybe<Scalars['String']['input']>;
  /** The state or province. */
  region?: InputMaybe<Scalars['String']['input']>;
  /** The street address. */
  streetAddress?: InputMaybe<Scalars['String']['input']>;
};

/** Represents an alert. */
export type Alert = {
  __typename?: 'Alert';
  /** The tenant correlation identifier. */
  correlationId?: Maybe<Scalars['String']['output']>;
  /** The creation date of the alert. */
  creationDate: Scalars['DateTime']['output'];
  /** The filter criteria to apply when retrieving contents, optional. */
  filter?: Maybe<ContentCriteria>;
  /** The ID of the alert. */
  id: Scalars['ID']['output'];
  /** The integration connector used by the alert. */
  integration: IntegrationConnector;
  /** The last alert date. */
  lastAlertDate?: Maybe<Scalars['DateTime']['output']>;
  /** The modified date of the alert. */
  modifiedDate?: Maybe<Scalars['DateTime']['output']>;
  /** The name of the alert. */
  name: Scalars['String']['output'];
  /** The owner of the alert. */
  owner: Owner;
  /** The LLM prompt to publish each content. */
  publishPrompt: Scalars['String']['output'];
  /** The LLM specification used for publishing, optional. */
  publishSpecification?: Maybe<EntityReference>;
  /** The content publishing connector used by the alert. */
  publishing: ContentPublishingConnector;
  /** The relevance score of the alert. */
  relevance?: Maybe<Scalars['Float']['output']>;
  /** The alert schedule policy. */
  schedulePolicy?: Maybe<AlertSchedulePolicy>;
  /** The state of the alert (i.e. created, finished). */
  state: EntityState;
  /** The LLM prompt to summarize each content, optional. */
  summaryPrompt?: Maybe<Scalars['String']['output']>;
  /** The LLM specification used for summarization, optional. */
  summarySpecification?: Maybe<EntityReference>;
  /** The alert type. */
  type: AlertTypes;
};

/** Represents a filter for alerts. */
export type AlertFilter = {
  /** Filter by creation date recent timespan. For example, a timespan of one day will return alert(s) created in the last 24 hours. */
  createdInLast?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** Filter alert(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter alert(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of alert(s) to be returned. Defaults to 100. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter alert(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Skip the specified number of alert(s) from the beginning of the result set. Only supported on keyword search. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** Filter alert(s) by searching for similar text. */
  search?: InputMaybe<Scalars['String']['input']>;
  /** Filter alert(s) by their states. */
  states?: InputMaybe<Array<EntityState>>;
  /** Filter by alert types. */
  types?: InputMaybe<Array<InputMaybe<AlertTypes>>>;
};

/** Represents an alert. */
export type AlertInput = {
  /** The filter criteria to apply when retrieving contents, optional. */
  filter?: InputMaybe<ContentCriteriaInput>;
  /** The integration connector used by the alert. */
  integration: IntegrationConnectorInput;
  /** The name of the alert. */
  name: Scalars['String']['input'];
  /** The LLM prompt to publish each content. */
  publishPrompt: Scalars['String']['input'];
  /** The LLM specification used for publishing, optional. */
  publishSpecification?: InputMaybe<EntityReferenceInput>;
  /** The content publishing connector used by the alert. */
  publishing: ContentPublishingConnectorInput;
  /** The alert schedule policy. */
  schedulePolicy?: InputMaybe<AlertSchedulePolicyInput>;
  /** The LLM prompt to summarize each content, optional. */
  summaryPrompt?: InputMaybe<Scalars['String']['input']>;
  /** The LLM specification used for summarization, optional. */
  summarySpecification?: InputMaybe<EntityReferenceInput>;
  /** The alert type. */
  type: AlertTypes;
};

/** Represents alert query results. */
export type AlertResults = {
  __typename?: 'AlertResults';
  /** The list of alert query results. */
  results?: Maybe<Array<Maybe<Alert>>>;
};

/** Represents an alert scheduling policy. */
export type AlertSchedulePolicy = {
  __typename?: 'AlertSchedulePolicy';
  /** If absolute time, the datetime value. */
  absoluteTime?: Maybe<Scalars['DateTime']['output']>;
  /** The delay between recurrences of the alert. */
  delay?: Maybe<Scalars['TimeSpan']['output']>;
  /** The alert recurrence type. */
  recurrenceType?: Maybe<TimedPolicyRecurrenceTypes>;
  /** If relative time, the relative timespan. */
  relativeTime?: Maybe<Scalars['TimeSpan']['output']>;
  /** If a repeated alert, the interval between repetitions. */
  repeatInterval?: Maybe<Scalars['TimeSpan']['output']>;
  /** If a repeated alert, the time to repeat until */
  repeatUntilTime?: Maybe<Scalars['DateTime']['output']>;
  /** The type of time interval. */
  timeType?: Maybe<PolicyTimeTypes>;
};

/** Represents an alert scheduling policy. */
export type AlertSchedulePolicyInput = {
  /** If absolute time, the datetime value. */
  absoluteTime?: InputMaybe<Scalars['DateTime']['input']>;
  /** The delay between recurrences of the alert. */
  delay?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** The alert recurrence type. */
  recurrenceType?: InputMaybe<TimedPolicyRecurrenceTypes>;
  /** If relative time, the relative timespan. */
  relativeTime?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** If a repeated alert, the interval between repetitions. */
  repeatInterval?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** If a repeated alert, the time to repeat until */
  repeatUntilTime?: InputMaybe<Scalars['DateTime']['input']>;
  /** The type of time interval. */
  timeType?: InputMaybe<PolicyTimeTypes>;
};

/** Alert type */
export enum AlertTypes {
  /** LLM Prompt */
  Prompt = 'PROMPT'
}

/** Represents an alert. */
export type AlertUpdateInput = {
  /** The filter criteria to apply when retrieving contents, optional. */
  filter?: InputMaybe<ContentCriteriaInput>;
  /** The ID of the alert to update. */
  id: Scalars['ID']['input'];
  /** The integration connector used by the alert. */
  integration?: InputMaybe<IntegrationConnectorUpdateInput>;
  /** The name of the alert. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The LLM prompt to publish each content. */
  publishPrompt?: InputMaybe<Scalars['String']['input']>;
  /** The LLM specification used for publishing, optional. */
  publishSpecification?: InputMaybe<EntityReferenceInput>;
  /** The content publishing connector used by the alert. */
  publishing?: InputMaybe<ContentPublishingConnectorUpdateInput>;
  /** The alert schedule policy. */
  schedulePolicy?: InputMaybe<AlertSchedulePolicyInput>;
  /** The LLM prompt to summarize each content, optional. */
  summaryPrompt?: InputMaybe<Scalars['String']['input']>;
  /** The LLM specification used for summarization, optional. */
  summarySpecification?: InputMaybe<EntityReferenceInput>;
};

/** Represents Amazon S3 feed properties. */
export type AmazonFeedProperties = {
  __typename?: 'AmazonFeedProperties';
  /** S3 access key ID. */
  accessKey?: Maybe<Scalars['String']['output']>;
  /** S3 bucket name. */
  bucketName?: Maybe<Scalars['String']['output']>;
  /** S3 bucket prefix. */
  prefix?: Maybe<Scalars['String']['output']>;
  /** S3 region. */
  region?: Maybe<Scalars['String']['output']>;
  /** S3 secret access key. */
  secretAccessKey?: Maybe<Scalars['String']['output']>;
};

/** Represents Amazon S3 feed properties. */
export type AmazonFeedPropertiesInput = {
  /** S3 access key. */
  accessKey: Scalars['String']['input'];
  /** S3 bucket name. */
  bucketName: Scalars['String']['input'];
  /** S3 bucket prefix. */
  prefix?: InputMaybe<Scalars['String']['input']>;
  /** S3 region. */
  region?: InputMaybe<Scalars['String']['input']>;
  /** S3 secret access key. */
  secretAccessKey: Scalars['String']['input'];
};

/** Represents Amazon S3 feed properties. */
export type AmazonFeedPropertiesUpdateInput = {
  /** S3 access key. */
  accessKey?: InputMaybe<Scalars['String']['input']>;
  /** S3 bucket name. */
  bucketName?: InputMaybe<Scalars['String']['input']>;
  /** S3 bucket prefix. */
  prefix?: InputMaybe<Scalars['String']['input']>;
  /** S3 region. */
  region?: InputMaybe<Scalars['String']['input']>;
  /** S3 secret access key. */
  secretAccessKey?: InputMaybe<Scalars['String']['input']>;
};

/** Represents Anthropic model properties. */
export type AnthropicModelProperties = {
  __typename?: 'AnthropicModelProperties';
  /** The limit of tokens per embedded text chunk, defaults to 600. */
  chunkTokenLimit?: Maybe<Scalars['Int']['output']>;
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: Maybe<Scalars['Int']['output']>;
  /** Whether Claude's extended thinking is enabled. Applies to Claude 3.7 or higher. */
  enableThinking?: Maybe<Scalars['Boolean']['output']>;
  /** The Anthropic API key, if using developer's own account. */
  key?: Maybe<Scalars['String']['output']>;
  /** The Anthropic model, or custom, when using developer's own account. */
  model: AnthropicModels;
  /** The Anthropic model name, if using developer's own account. */
  modelName?: Maybe<Scalars['String']['output']>;
  /** The model token probability. */
  probability?: Maybe<Scalars['Float']['output']>;
  /** The model temperature. */
  temperature?: Maybe<Scalars['Float']['output']>;
  /** The limit of thinking tokens allowed for Claude's internal reasoning process. */
  thinkingTokenLimit?: Maybe<Scalars['Int']['output']>;
  /** The number of tokens which can provided to the Anthropic model, if using developer's own account. */
  tokenLimit?: Maybe<Scalars['Int']['output']>;
};

/** Represents Anthropic model properties. */
export type AnthropicModelPropertiesInput = {
  /** The limit of tokens per embedded text chunk, defaults to 600. */
  chunkTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** Whether Claude's extended thinking is enabled. Applies to Claude 3.7 or higher. */
  enableThinking?: InputMaybe<Scalars['Boolean']['input']>;
  /** The Anthropic API key, if using developer's own account. */
  key?: InputMaybe<Scalars['String']['input']>;
  /** The Anthropic model, or custom, when using developer's own account. */
  model: AnthropicModels;
  /** The Anthropic model name, if using developer's own account. */
  modelName?: InputMaybe<Scalars['String']['input']>;
  /** The model token probability. */
  probability?: InputMaybe<Scalars['Float']['input']>;
  /** The model temperature. */
  temperature?: InputMaybe<Scalars['Float']['input']>;
  /** The limit of thinking tokens allowed for Claude's internal reasoning process. */
  thinkingTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The number of tokens which can provided to the Anthropic model, if using developer's own account. */
  tokenLimit?: InputMaybe<Scalars['Int']['input']>;
};

/** Represents Anthropic model properties. */
export type AnthropicModelPropertiesUpdateInput = {
  /** The limit of tokens per embedded text chunk, defaults to 600. */
  chunkTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** Whether Claude's extended thinking is enabled. Applies to Claude 3.7 or higher. */
  enableThinking?: InputMaybe<Scalars['Boolean']['input']>;
  /** The Anthropic API key, if using developer's own account. */
  key?: InputMaybe<Scalars['String']['input']>;
  /** The Anthropic model, or custom, when using developer's own account. */
  model?: InputMaybe<AnthropicModels>;
  /** The Anthropic model name, if using developer's own account. */
  modelName?: InputMaybe<Scalars['String']['input']>;
  /** The model token probability. */
  probability?: InputMaybe<Scalars['Float']['input']>;
  /** The model temperature. */
  temperature?: InputMaybe<Scalars['Float']['input']>;
  /** The limit of thinking tokens allowed for Claude's internal reasoning process. */
  thinkingTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The number of tokens which can provided to the Anthropic model, if using developer's own account. */
  tokenLimit?: InputMaybe<Scalars['Int']['input']>;
};

/** Anthropic model type */
export enum AnthropicModels {
  /** @deprecated Use Claude 3.x instead. */
  Claude_2 = 'CLAUDE_2',
  /** @deprecated Use Claude 3.x instead. */
  Claude_2_0 = 'CLAUDE_2_0',
  /** @deprecated Use Claude 3.x instead. */
  Claude_2_1 = 'CLAUDE_2_1',
  /** Claude 3.5 Haiku (Latest) */
  Claude_3_5Haiku = 'CLAUDE_3_5_HAIKU',
  /** Claude 3.5 Haiku (10-22-2024 version) */
  Claude_3_5Haiku_20241022 = 'CLAUDE_3_5_HAIKU_20241022',
  /** Claude 3.5 Sonnet (Latest) */
  Claude_3_5Sonnet = 'CLAUDE_3_5_SONNET',
  /** Claude 3.5 Sonnet (06-20-2024 version) */
  Claude_3_5Sonnet_20240620 = 'CLAUDE_3_5_SONNET_20240620',
  /** Claude 3.5 Sonnet (10-22-2024 version) */
  Claude_3_5Sonnet_20241022 = 'CLAUDE_3_5_SONNET_20241022',
  /** Claude 3.7 Sonnet (Latest) */
  Claude_3_7Sonnet = 'CLAUDE_3_7_SONNET',
  /** Claude 3.7 Sonnet (02-19-2025 version) */
  Claude_3_7Sonnet_20250219 = 'CLAUDE_3_7_SONNET_20250219',
  /** Claude 3 Haiku (Latest) */
  Claude_3Haiku = 'CLAUDE_3_HAIKU',
  /** Claude 3 Haiku (03-07-2024 version) */
  Claude_3Haiku_20240307 = 'CLAUDE_3_HAIKU_20240307',
  /** Claude 3 Opus (Latest) */
  Claude_3Opus = 'CLAUDE_3_OPUS',
  /** Claude 3 Opus (02-29-2024 version) */
  Claude_3Opus_20240229 = 'CLAUDE_3_OPUS_20240229',
  /** Claude 3 Sonnet (Latest) */
  Claude_3Sonnet = 'CLAUDE_3_SONNET',
  /** Claude 3 Sonnet (02-29-2024 version) */
  Claude_3Sonnet_20240229 = 'CLAUDE_3_SONNET_20240229',
  /** @deprecated Use Claude 3.5 Haiku instead. */
  ClaudeInstant_1 = 'CLAUDE_INSTANT_1',
  /** @deprecated Use Claude 3.5 Haiku instead. */
  ClaudeInstant_1_2 = 'CLAUDE_INSTANT_1_2',
  /** Developer-specified model */
  Custom = 'CUSTOM'
}

/** Defines when a policy shall be executed. */
export enum ApplyPolicy {
  /** After the resolver was executed. */
  AfterResolver = 'AFTER_RESOLVER',
  /** Before the resolver was executed. */
  BeforeResolver = 'BEFORE_RESOLVER',
  /** The policy is applied in the validation step before the execution. */
  Validation = 'VALIDATION'
}

/** Represents a prompted question about Graphlit. */
export type AskGraphlit = {
  __typename?: 'AskGraphlit';
  /** The completed conversation. */
  conversation?: Maybe<EntityReference>;
  /** The completed conversation message. */
  message?: Maybe<ConversationMessage>;
  /** The conversation message count, after completion. */
  messageCount?: Maybe<Scalars['Int']['output']>;
};

/** Represents the Assembly.AI preparation properties. */
export type AssemblyAiAudioPreparationProperties = {
  __typename?: 'AssemblyAIAudioPreparationProperties';
  /** Whether to auto-detect the speaker(s) language during Assembly.AI audio transcription. */
  detectLanguage?: Maybe<Scalars['Boolean']['output']>;
  /** Whether to enable redaction during Assembly.AI audio transcription. */
  enableRedaction?: Maybe<Scalars['Boolean']['output']>;
  /** Whether to enable speaker diarization during Assembly.AI audio transcription. */
  enableSpeakerDiarization?: Maybe<Scalars['Boolean']['output']>;
  /** The Assembly.AI API key. */
  key?: Maybe<Scalars['String']['output']>;
  /** Specify the language to transcribe during Assembly.AI audio transcription. Expected language in BCP 47 format, such as 'en' or 'en-US'. */
  language?: Maybe<Scalars['String']['output']>;
  /** The Assembly.AI transcription model. */
  model?: Maybe<AssemblyAiModels>;
};

/** Represents the Assembly.AI preparation properties. */
export type AssemblyAiAudioPreparationPropertiesInput = {
  /** Whether to auto-detect the speaker(s) language during Assembly.AI audio transcription. */
  detectLanguage?: InputMaybe<Scalars['Boolean']['input']>;
  /** Whether to enable redaction during Assembly.AI audio transcription. */
  enableRedaction?: InputMaybe<Scalars['Boolean']['input']>;
  /** Whether to enable speaker diarization during Assembly.AI audio transcription. */
  enableSpeakerDiarization?: InputMaybe<Scalars['Boolean']['input']>;
  /** The Assembly.AI API key, optional. */
  key?: InputMaybe<Scalars['String']['input']>;
  /** Specify the language to transcribe during Assembly.AI audio transcription. Expected language in BCP 47 format, such as 'en' or 'en-US'. */
  language?: InputMaybe<Scalars['String']['input']>;
  /** The Assembly.AI transcription model. */
  model?: InputMaybe<AssemblyAiModels>;
};

/** Assembly.AI models */
export enum AssemblyAiModels {
  /** Best */
  Best = 'BEST',
  /** Nano */
  Nano = 'NANO'
}

/** Represents Atlassian Jira feed properties. */
export type AtlassianJiraFeedProperties = {
  __typename?: 'AtlassianJiraFeedProperties';
  /** Atlassian account email address. */
  email: Scalars['String']['output'];
  /** Atlassian server timezone offset. */
  offset?: Maybe<Scalars['TimeSpan']['output']>;
  /** Atlassian Jira project key, i.e. the short prefix of Jira issues. */
  project: Scalars['String']['output'];
  /** Atlassian API token. */
  token: Scalars['String']['output'];
  /** Atlassian Jira URI. */
  uri: Scalars['URL']['output'];
};

/** Represents Atlassian Jira feed properties. */
export type AtlassianJiraFeedPropertiesInput = {
  /** Atlassian account email address. */
  email: Scalars['String']['input'];
  /** Atlassian server timezone offset, defaults to -08:00:00. */
  offset?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** Atlassian Jira project key, i.e. the short prefix of Jira issues. */
  project: Scalars['String']['input'];
  /** Atlassian API token. */
  token: Scalars['String']['input'];
  /** Atlassian Jira URI. */
  uri: Scalars['URL']['input'];
};

/** Represents Atlassian Jira feed properties. */
export type AtlassianJiraFeedPropertiesUpdateInput = {
  /** Atlassian account email address. */
  email?: InputMaybe<Scalars['String']['input']>;
  /** Atlassian server timezone offset. */
  offset?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** Atlassian Jira project key, i.e. the short prefix of Jira issues. */
  project?: InputMaybe<Scalars['String']['input']>;
  /** Atlassian API token. */
  token?: InputMaybe<Scalars['String']['input']>;
  /** Atlassian Jira URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents audio metadata. */
export type AudioMetadata = {
  __typename?: 'AudioMetadata';
  /** The episode author, if podcast episode. */
  author?: Maybe<Scalars['String']['output']>;
  /** The audio bitrate. */
  bitrate?: Maybe<Scalars['Int']['output']>;
  /** The audio bits/sample. */
  bitsPerSample?: Maybe<Scalars['Int']['output']>;
  /** The audio channels. */
  channels?: Maybe<Scalars['Int']['output']>;
  /** The episode copyright, if podcast episode. */
  copyright?: Maybe<Scalars['String']['output']>;
  /** The audio description. */
  description?: Maybe<Scalars['String']['output']>;
  /** The audio duration. */
  duration?: Maybe<Scalars['TimeSpan']['output']>;
  /** The episode name, if podcast episode. */
  episode?: Maybe<Scalars['String']['output']>;
  /** The episode type, if podcast episode. */
  episodeType?: Maybe<Scalars['String']['output']>;
  /** The audio genre. */
  genre?: Maybe<Scalars['String']['output']>;
  /** The episode keywords, if podcast episode. */
  keywords?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The episode publisher, if podcast episode. */
  publisher?: Maybe<Scalars['String']['output']>;
  /** The audio sample rate. */
  sampleRate?: Maybe<Scalars['Int']['output']>;
  /** The episode season, if podcast episode. */
  season?: Maybe<Scalars['String']['output']>;
  /** The episode series name, if podcast episode. */
  series?: Maybe<Scalars['String']['output']>;
  /** The audio title. */
  title?: Maybe<Scalars['String']['output']>;
};

/** Represents audio metadata. */
export type AudioMetadataInput = {
  /** The episode author, if podcast episode. */
  author?: InputMaybe<Scalars['String']['input']>;
  /** The audio bitrate. */
  bitrate?: InputMaybe<Scalars['Int']['input']>;
  /** The audio bits/sample. */
  bitsPerSample?: InputMaybe<Scalars['Int']['input']>;
  /** The audio channels. */
  channels?: InputMaybe<Scalars['Int']['input']>;
  /** The episode copyright, if podcast episode. */
  copyright?: InputMaybe<Scalars['String']['input']>;
  /** The metadata creation date. */
  creationDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** The audio duration. */
  duration?: InputMaybe<Scalars['String']['input']>;
  /** The episode name, if podcast episode. */
  episode?: InputMaybe<Scalars['String']['input']>;
  /** The episode type, if podcast episode. */
  episodeType?: InputMaybe<Scalars['String']['input']>;
  /** The audio genre. */
  genre?: InputMaybe<Scalars['String']['input']>;
  /** The episode keywords, if podcast episode. */
  keywords?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** The metadata geo-location. */
  location?: InputMaybe<PointInput>;
  /** The metadata modified date. */
  modifiedDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** The episode publisher, if podcast episode. */
  publisher?: InputMaybe<Scalars['String']['input']>;
  /** The audio sample rate. */
  sampleRate?: InputMaybe<Scalars['Int']['input']>;
  /** The episode season, if podcast episode. */
  season?: InputMaybe<Scalars['String']['input']>;
  /** The episode series name, if podcast episode. */
  series?: InputMaybe<Scalars['String']['input']>;
  /** The audio title. */
  title?: InputMaybe<Scalars['String']['input']>;
};

/** Represents an authentication connector. */
export type AuthenticationConnector = {
  __typename?: 'AuthenticationConnector';
  /** Google authentication properties. */
  google?: Maybe<GoogleAuthenticationProperties>;
  /** Microsoft authentication properties. */
  microsoft?: Maybe<MicrosoftAuthenticationProperties>;
  /** Authentication service type. */
  type: AuthenticationServiceTypes;
};

/** Represents an authentication connector. */
export type AuthenticationConnectorInput = {
  /** Google authentication properties. */
  google?: InputMaybe<GoogleAuthenticationPropertiesInput>;
  /** Microsoft authentication properties. */
  microsoft?: InputMaybe<MicrosoftAuthenticationPropertiesInput>;
  /** Authentication service type. */
  type: AuthenticationServiceTypes;
};

/** Authentication service type */
export enum AuthenticationServiceTypes {
  /** Auth0 authentication service */
  Auth0 = 'AUTH0',
  /** Clerk authentication service */
  Clerk = 'CLERK',
  /** Google authentication service */
  Google = 'GOOGLE',
  /** Microsoft Graph authentication service */
  MicrosoftGraph = 'MICROSOFT_GRAPH'
}

/** Represents Azure AI model properties. */
export type AzureAiModelProperties = {
  __typename?: 'AzureAIModelProperties';
  /** The limit of tokens per embedded text chunk, defaults to 600. */
  chunkTokenLimit?: Maybe<Scalars['Int']['output']>;
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: Maybe<Scalars['Int']['output']>;
  /** The Azure AI API endpoint. */
  endpoint: Scalars['URL']['output'];
  /** The Azure AI API key. */
  key: Scalars['String']['output'];
  /** The model token probability. */
  probability?: Maybe<Scalars['Float']['output']>;
  /** The model temperature. */
  temperature?: Maybe<Scalars['Float']['output']>;
  /** The number of tokens which can provided to the model. */
  tokenLimit: Scalars['Int']['output'];
};

/** Represents Azure AI model properties. */
export type AzureAiModelPropertiesInput = {
  /** The limit of tokens per embedded text chunk, defaults to 600. */
  chunkTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The Azure AI API endpoint. */
  endpoint: Scalars['URL']['input'];
  /** The Azure AI API key. */
  key: Scalars['String']['input'];
  /** The model token probability. */
  probability?: InputMaybe<Scalars['Float']['input']>;
  /** The model temperature. */
  temperature?: InputMaybe<Scalars['Float']['input']>;
  /** The number of tokens which can provided to the model. */
  tokenLimit: Scalars['Int']['input'];
};

/** Represents Azure AI model properties. */
export type AzureAiModelPropertiesUpdateInput = {
  /** The limit of tokens per embedded text chunk, defaults to 600. */
  chunkTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The Azure AI API endpoint. */
  endpoint?: InputMaybe<Scalars['URL']['input']>;
  /** The Azure AI API key. */
  key?: InputMaybe<Scalars['String']['input']>;
  /** The model token probability. */
  probability?: InputMaybe<Scalars['Float']['input']>;
  /** The model temperature. */
  temperature?: InputMaybe<Scalars['Float']['input']>;
  /** The number of tokens which can provided to the model. */
  tokenLimit?: InputMaybe<Scalars['Int']['input']>;
};

/** Represents Azure blob feed properties. */
export type AzureBlobFeedProperties = {
  __typename?: 'AzureBlobFeedProperties';
  /** Azure storage account name. */
  accountName?: Maybe<Scalars['String']['output']>;
  /** Azure storage container name. */
  containerName?: Maybe<Scalars['String']['output']>;
  /** Azure storage container prefix. */
  prefix?: Maybe<Scalars['String']['output']>;
  /** Azure storage access key. */
  storageAccessKey?: Maybe<Scalars['String']['output']>;
};

/** Represents Azure blob feed properties. */
export type AzureBlobFeedPropertiesInput = {
  /** Azure storage account name. */
  accountName: Scalars['String']['input'];
  /** Azure storage container name. */
  containerName: Scalars['String']['input'];
  /** Azure storage container prefix. */
  prefix?: InputMaybe<Scalars['String']['input']>;
  /** Azure storage access key. */
  storageAccessKey: Scalars['String']['input'];
};

/** Represents Azure blob feed properties. */
export type AzureBlobFeedPropertiesUpdateInput = {
  /** Azure storage account name. */
  accountName?: InputMaybe<Scalars['String']['input']>;
  /** Azure storage container name. */
  containerName?: InputMaybe<Scalars['String']['input']>;
  /** Azure storage container prefix. */
  prefix?: InputMaybe<Scalars['String']['input']>;
  /** Azure storage access key. */
  storageAccessKey?: InputMaybe<Scalars['String']['input']>;
};

export enum AzureDocumentIntelligenceModels {
  /** Credit Card */
  CreditCard = 'CREDIT_CARD',
  /** ID Document */
  IdentificationDocument = 'IDENTIFICATION_DOCUMENT',
  /** Invoice */
  Invoice = 'INVOICE',
  /** Layout: Document with title, headings, paragraphs, tables */
  Layout = 'LAYOUT',
  /** Read OCR: Document with handwriting or printed text */
  ReadOcr = 'READ_OCR',
  /** Receipt */
  Receipt = 'RECEIPT',
  /** Bank Check (US) */
  UsBankCheck = 'US_BANK_CHECK',
  /** Bank Statement (US) */
  UsBankStatement = 'US_BANK_STATEMENT',
  /** Health Insurance Card (US) */
  UsHealthInsuranceCard = 'US_HEALTH_INSURANCE_CARD',
  /** Marriage Certificate (US) */
  UsMarriageCertificate = 'US_MARRIAGE_CERTIFICATE',
  /** Mortgage 1003 End-User License Agreement (EULA) (US) */
  UsMortgage1003 = 'US_MORTGAGE1003',
  /** Mortgage Form 1008 (US) */
  UsMortgage1008 = 'US_MORTGAGE1008',
  /** Mortgage closing disclosure (US) */
  UsMortgageDisclosure = 'US_MORTGAGE_DISCLOSURE',
  /** Pay Stub (US) */
  UsPayStub = 'US_PAY_STUB',
  /** Unified Tax Form (US) */
  UsTaxForm = 'US_TAX_FORM',
  /** 1098 Form (US) */
  UsTaxForm1098 = 'US_TAX_FORM1098',
  /** 1098E Form (US) */
  UsTaxForm1098E = 'US_TAX_FORM1098_E',
  /** 1098T Form (US) */
  UsTaxForm1098T = 'US_TAX_FORM1098_T',
  /** 1099 Form (US) */
  UsTaxForm1099 = 'US_TAX_FORM1099',
  /** W-2 Form (US) */
  UsTaxFormW2 = 'US_TAX_FORM_W2'
}

export enum AzureDocumentIntelligenceVersions {
  /** 2023-07-31 GA API */
  V2023_07_31 = 'V2023_07_31',
  /**
   * 2024-02-29 Preview API
   * @deprecated Use V2024_07_31_PREVIEW instead.
   */
  V2024_02_29Preview = 'V2024_02_29_PREVIEW',
  /** 2024-07-31 Preview API */
  V2024_07_31Preview = 'V2024_07_31_PREVIEW',
  /** 2024-11-30 GA API */
  V2024_11_30 = 'V2024_11_30'
}

/** Represents the Azure Document Intelligence preparation properties. */
export type AzureDocumentPreparationProperties = {
  __typename?: 'AzureDocumentPreparationProperties';
  /** The Azure Document Intelligence API endpoint, optional. */
  endpoint?: Maybe<Scalars['URL']['output']>;
  /** The Azure Document Intelligence API key, optional. */
  key?: Maybe<Scalars['String']['output']>;
  /** The Azure Document Intelligence model. */
  model?: Maybe<AzureDocumentIntelligenceModels>;
  /** The Azure Document Intelligence API version, optional. */
  version?: Maybe<AzureDocumentIntelligenceVersions>;
};

/** Represents the Azure Document Intelligence preparation properties. */
export type AzureDocumentPreparationPropertiesInput = {
  /** The Azure Document Intelligence API endpoint, optional. */
  endpoint?: InputMaybe<Scalars['URL']['input']>;
  /** The Azure Document Intelligence API key, optional. */
  key?: InputMaybe<Scalars['String']['input']>;
  /** The Azure Document Intelligence model. */
  model?: InputMaybe<AzureDocumentIntelligenceModels>;
  /** The Azure Document Intelligence API version, optional. */
  version?: InputMaybe<AzureDocumentIntelligenceVersions>;
};

/** Represents Azure file share feed properties. */
export type AzureFileFeedProperties = {
  __typename?: 'AzureFileFeedProperties';
  /** Azure storage account name. */
  accountName?: Maybe<Scalars['String']['output']>;
  /** Azure file share prefix. */
  prefix?: Maybe<Scalars['String']['output']>;
  /** Azure file share name. */
  shareName?: Maybe<Scalars['String']['output']>;
  /** Azure storage access key. */
  storageAccessKey?: Maybe<Scalars['String']['output']>;
};

/** Represents Azure file share feed properties. */
export type AzureFileFeedPropertiesInput = {
  /** Azure storage account name. */
  accountName: Scalars['String']['input'];
  /** Azure file share prefix. */
  prefix?: InputMaybe<Scalars['String']['input']>;
  /** Azure file share name. */
  shareName: Scalars['String']['input'];
  /** Azure storage access key. */
  storageAccessKey: Scalars['String']['input'];
};

/** Represents Azure file share feed properties. */
export type AzureFileFeedPropertiesUpdateInput = {
  /** Azure storage account name. */
  accountName?: InputMaybe<Scalars['String']['input']>;
  /** Azure file share prefix. */
  prefix?: InputMaybe<Scalars['String']['input']>;
  /** Azure file share name. */
  shareName?: InputMaybe<Scalars['String']['input']>;
  /** Azure storage access key. */
  storageAccessKey?: InputMaybe<Scalars['String']['input']>;
};

/** Represents an Azure Cognitive Services image entity extraction connector. */
export type AzureImageExtractionProperties = {
  __typename?: 'AzureImageExtractionProperties';
  /** The confidence threshold for entity extraction. */
  confidenceThreshold?: Maybe<Scalars['Float']['output']>;
};

/** Represents an Azure Cognitive Services image entity extraction connector. */
export type AzureImageExtractionPropertiesInput = {
  /** The confidence threshold for entity extraction. */
  confidenceThreshold?: InputMaybe<Scalars['Float']['input']>;
};

/** Represents Azure OpenAI model properties. */
export type AzureOpenAiModelProperties = {
  __typename?: 'AzureOpenAIModelProperties';
  /** The limit of tokens per embedded text chunk, defaults to 600. */
  chunkTokenLimit?: Maybe<Scalars['Int']['output']>;
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: Maybe<Scalars['Int']['output']>;
  /** The Azure OpenAI deployment name, if using developer's own account. */
  deploymentName?: Maybe<Scalars['String']['output']>;
  /** The Azure OpenAI API endpoint, if using developer's own account. */
  endpoint?: Maybe<Scalars['URL']['output']>;
  /** The Azure OpenAI API key, if using developer's own account. */
  key?: Maybe<Scalars['String']['output']>;
  /** The Azure OpenAI model, or custom, when using developer's own account. */
  model: AzureOpenAiModels;
  /** The model token probability. */
  probability?: Maybe<Scalars['Float']['output']>;
  /** The model temperature. */
  temperature?: Maybe<Scalars['Float']['output']>;
  /** The number of tokens which can provided to the OpenAI-compatible model, if using developer's own account. */
  tokenLimit?: Maybe<Scalars['Int']['output']>;
};

/** Represents Azure OpenAI model properties. */
export type AzureOpenAiModelPropertiesInput = {
  /** The limit of tokens per embedded text chunk, defaults to 600. */
  chunkTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The Azure OpenAI deployment name, if using developer's own account. */
  deploymentName?: InputMaybe<Scalars['String']['input']>;
  /** The Azure OpenAI API endpoint, if using developer's own account. */
  endpoint?: InputMaybe<Scalars['URL']['input']>;
  /** The Azure OpenAI API key, if using developer's own account. */
  key?: InputMaybe<Scalars['String']['input']>;
  /** The Azure OpenAI model, or custom, when using developer's own account. */
  model: AzureOpenAiModels;
  /** The model token probability. */
  probability?: InputMaybe<Scalars['Float']['input']>;
  /** The model temperature. */
  temperature?: InputMaybe<Scalars['Float']['input']>;
  /** The number of tokens which can provided to the Azure OpenAI model, if using developer's own account. */
  tokenLimit?: InputMaybe<Scalars['Int']['input']>;
};

/** Represents Azure OpenAI model properties. */
export type AzureOpenAiModelPropertiesUpdateInput = {
  /** The limit of tokens per embedded text chunk, defaults to 600. */
  chunkTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The Azure OpenAI deployment name, if using developer's own account. */
  deploymentName?: InputMaybe<Scalars['String']['input']>;
  /** The Azure OpenAI API endpoint, if using developer's own account. */
  endpoint?: InputMaybe<Scalars['URL']['input']>;
  /** The Azure OpenAI API key, if using developer's own account. */
  key?: InputMaybe<Scalars['String']['input']>;
  /** The Azure OpenAI model, or custom, when using developer's own account. */
  model?: InputMaybe<AzureOpenAiModels>;
  /** The model token probability. */
  probability?: InputMaybe<Scalars['Float']['input']>;
  /** The model temperature. */
  temperature?: InputMaybe<Scalars['Float']['input']>;
  /** The number of tokens which can provided to the Azure OpenAI model, if using developer's own account. */
  tokenLimit?: InputMaybe<Scalars['Int']['input']>;
};

/** Azure OpenAI model type */
export enum AzureOpenAiModels {
  /** Developer-specified deployment */
  Custom = 'CUSTOM',
  /** GPT-4 (Latest) */
  Gpt4 = 'GPT4',
  /** GPT-4 Turbo 128k (Latest) */
  Gpt4Turbo_128K = 'GPT4_TURBO_128K',
  /** GPT-3.5 Turbo 16k (Latest) */
  Gpt35Turbo_16K = 'GPT35_TURBO_16K'
}

/** Represents an Azure Cognitive Services text entity extraction connector. */
export type AzureTextExtractionProperties = {
  __typename?: 'AzureTextExtractionProperties';
  /** The confidence threshold for entity extraction. */
  confidenceThreshold?: Maybe<Scalars['Float']['output']>;
  /** Whether PII categorization is enabled. */
  enablePII?: Maybe<Scalars['Boolean']['output']>;
};

/** Represents an Azure Cognitive Services text entity extraction connector. */
export type AzureTextExtractionPropertiesInput = {
  /** The confidence threshold for entity extraction. */
  confidenceThreshold?: InputMaybe<Scalars['Float']['input']>;
  /** Whether PII categorization is enabled. */
  enablePII?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Represents Amazon Bedrock model properties. */
export type BedrockModelProperties = {
  __typename?: 'BedrockModelProperties';
  /** The Amazon Bedrock access key, if using developer's own account. */
  accessKey?: Maybe<Scalars['String']['output']>;
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: Maybe<Scalars['Int']['output']>;
  /** The Amazon Bedrock model, or custom, when using developer's own account. */
  model: BedrockModels;
  /** The Amazon Bedrock model name, if using developer's own account. */
  modelName?: Maybe<Scalars['String']['output']>;
  /** The model token probability. */
  probability?: Maybe<Scalars['Float']['output']>;
  /** The Amazon Bedrock secret access key, if using developer's own account. */
  secretAccessKey?: Maybe<Scalars['String']['output']>;
  /** The model temperature. */
  temperature?: Maybe<Scalars['Float']['output']>;
  /** The number of tokens which can provided to the Amazon Bedrock model, if using developer's own account. */
  tokenLimit?: Maybe<Scalars['Int']['output']>;
};

/** Represents Amazon Bedrock model properties. */
export type BedrockModelPropertiesInput = {
  /** The Amazon Bedrock access key, if using developer's own account. */
  accessKey?: InputMaybe<Scalars['String']['input']>;
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The Amazon Bedrock model, or custom, when using developer's own account. */
  model: BedrockModels;
  /** The Amazon Bedrock model name, if using developer's own account. */
  modelName?: InputMaybe<Scalars['String']['input']>;
  /** The model token probability. */
  probability?: InputMaybe<Scalars['Float']['input']>;
  /** The Amazon Bedrock secret access key, if using developer's own account. */
  secretAccessKey?: InputMaybe<Scalars['String']['input']>;
  /** The model temperature. */
  temperature?: InputMaybe<Scalars['Float']['input']>;
  /** The number of tokens which can provided to the Amazon Bedrock model, if using developer's own account. */
  tokenLimit?: InputMaybe<Scalars['Int']['input']>;
};

/** Represents Amazon Bedrock model properties. */
export type BedrockModelPropertiesUpdateInput = {
  /** The Amazon Bedrock access key, if using developer's own account. */
  accessKey?: InputMaybe<Scalars['String']['input']>;
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The Amazon Bedrock model, or custom, when using developer's own account. */
  model?: InputMaybe<BedrockModels>;
  /** The Amazon Bedrock model name, if using developer's own account. */
  modelName?: InputMaybe<Scalars['String']['input']>;
  /** The model token probability. */
  probability?: InputMaybe<Scalars['Float']['input']>;
  /** The Amazon Bedrock secret access key, if using developer's own account. */
  secretAccessKey?: InputMaybe<Scalars['String']['input']>;
  /** The model temperature. */
  temperature?: InputMaybe<Scalars['Float']['input']>;
  /** The number of tokens which can provided to the Amazon Bedrock model, if using developer's own account. */
  tokenLimit?: InputMaybe<Scalars['Int']['input']>;
};

/** Amazon Bedrock model type */
export enum BedrockModels {
  /** Developer-specified model */
  Custom = 'CUSTOM'
}

export enum BillableMetrics {
  Bytes = 'BYTES',
  Cost = 'COST',
  Credits = 'CREDITS',
  Length = 'LENGTH',
  Requests = 'REQUESTS',
  Time = 'TIME',
  Tokens = 'TOKENS',
  Units = 'UNITS'
}

/** Represents a boolean result. */
export type BooleanResult = {
  __typename?: 'BooleanResult';
  /** The boolean result. */
  result?: Maybe<Scalars['Boolean']['output']>;
};

/** Represents a bounding box. */
export type BoundingBox = {
  __typename?: 'BoundingBox';
  /** The height of the bounding box. */
  height?: Maybe<Scalars['Float']['output']>;
  /** The left-most point of the bounding box. */
  left?: Maybe<Scalars['Float']['output']>;
  /** The top-most point of the bounding box. */
  top?: Maybe<Scalars['Float']['output']>;
  /** The width of the bounding box. */
  width?: Maybe<Scalars['Float']['output']>;
};

/** Represents a bounding box. */
export type BoundingBoxInput = {
  /** The height of the bounding box. */
  height?: InputMaybe<Scalars['Float']['input']>;
  /** The left-most point of the bounding box. */
  left?: InputMaybe<Scalars['Float']['input']>;
  /** The top-most point of the bounding box. */
  top?: InputMaybe<Scalars['Float']['input']>;
  /** The width of the bounding box. */
  width?: InputMaybe<Scalars['Float']['input']>;
};

/** Represents Box properties. */
export type BoxFeedProperties = {
  __typename?: 'BoxFeedProperties';
  /** Box client identifier. */
  clientId: Scalars['String']['output'];
  /** Box client secret. */
  clientSecret: Scalars['String']['output'];
  /** Box folder identifier. */
  folderId?: Maybe<Scalars['ID']['output']>;
  /** Box redirect URI. */
  redirectUri: Scalars['String']['output'];
  /** Box refresh token. */
  refreshToken: Scalars['String']['output'];
};

/** Represents Box properties. */
export type BoxFeedPropertiesInput = {
  /** Box client identifier. */
  clientId: Scalars['String']['input'];
  /** Box client secret. */
  clientSecret: Scalars['String']['input'];
  /** Box folder identifier. */
  folderId?: InputMaybe<Scalars['ID']['input']>;
  /** Box redirect URI. */
  redirectUri: Scalars['String']['input'];
  /** Box refresh token. */
  refreshToken: Scalars['String']['input'];
};

/** Represents Box properties. */
export type BoxFeedPropertiesUpdateInput = {
  /** Box client identifier. */
  clientId?: InputMaybe<Scalars['String']['input']>;
  /** Box client secret. */
  clientSecret?: InputMaybe<Scalars['String']['input']>;
  /** Box folder identifier. */
  folderId?: InputMaybe<Scalars['ID']['input']>;
  /** Box redirect URI. */
  redirectUri?: InputMaybe<Scalars['String']['input']>;
  /** Box refresh token. */
  refreshToken?: InputMaybe<Scalars['String']['input']>;
};

/** Represents a category. */
export type Category = {
  __typename?: 'Category';
  /** The creation date of the category. */
  creationDate: Scalars['DateTime']['output'];
  /** The category description. */
  description?: Maybe<Scalars['String']['output']>;
  /** The ID of the category. */
  id: Scalars['ID']['output'];
  /** The modified date of the category. */
  modifiedDate?: Maybe<Scalars['DateTime']['output']>;
  /** The name of the category. */
  name: Scalars['String']['output'];
  /** The relevance score of the category. */
  relevance?: Maybe<Scalars['Float']['output']>;
  /** The state of the category (i.e. created, enabled). */
  state: EntityState;
};

/** Represents a category facet. */
export type CategoryFacet = {
  __typename?: 'CategoryFacet';
  /** The facet count. */
  count?: Maybe<Scalars['Long']['output']>;
  /** The category facet type. */
  facet?: Maybe<CategoryFacetTypes>;
  /** The facet value range. */
  range?: Maybe<StringRange>;
  /** The facet value type. */
  type?: Maybe<FacetValueTypes>;
  /** The facet value. */
  value?: Maybe<Scalars['String']['output']>;
};

/** Represents the configuration for category facets. */
export type CategoryFacetInput = {
  /** The category facet type. */
  facet?: InputMaybe<CategoryFacetTypes>;
  /** The facet time interval. */
  timeInterval?: InputMaybe<TimeIntervalTypes>;
  /** The facet time offset (in hours). */
  timeOffset?: InputMaybe<Scalars['Int']['input']>;
};

/** Category facet types */
export enum CategoryFacetTypes {
  /** Creation Date */
  CreationDate = 'CREATION_DATE'
}

/** Represents a filter for categories. */
export type CategoryFilter = {
  /** Filter by creation date recent timespan. For example, a timespan of one day will return category(s) created in the last 24 hours. */
  createdInLast?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** Filter category(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter category(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of category(s) to be returned. Defaults to 100. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter category(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Skip the specified number of category(s) from the beginning of the result set. Only supported on keyword search. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** Filter category(s) by searching for similar text. */
  search?: InputMaybe<Scalars['String']['input']>;
  /** Filter category(s) by their states. */
  states?: InputMaybe<Array<EntityState>>;
};

/** Represents a category. */
export type CategoryInput = {
  /** The category description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The name of the category. */
  name: Scalars['String']['input'];
};

/** Represents category query results. */
export type CategoryResults = {
  __typename?: 'CategoryResults';
  /** The category facets. */
  facets?: Maybe<Array<Maybe<CategoryFacet>>>;
  /** The category results. */
  results?: Maybe<Array<Maybe<Category>>>;
};

/** Represents a category. */
export type CategoryUpdateInput = {
  /** The category description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the category to update. */
  id: Scalars['ID']['input'];
  /** The name of the category. */
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Represents Cerebras model properties. */
export type CerebrasModelProperties = {
  __typename?: 'CerebrasModelProperties';
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: Maybe<Scalars['Int']['output']>;
  /** The Cerebras API endpoint, if using developer's own account. */
  endpoint?: Maybe<Scalars['URL']['output']>;
  /** The Cerebras API key, if using developer's own account. */
  key?: Maybe<Scalars['String']['output']>;
  /** The Cerebras model, or custom, when using developer's own account. */
  model: CerebrasModels;
  /** The Cerebras model name, if using developer's own account. */
  modelName?: Maybe<Scalars['String']['output']>;
  /** The model token probability. */
  probability?: Maybe<Scalars['Float']['output']>;
  /** The model temperature. */
  temperature?: Maybe<Scalars['Float']['output']>;
  /** The number of tokens which can provided to the Cerebras model, if using developer's own account. */
  tokenLimit?: Maybe<Scalars['Int']['output']>;
};

/** Represents Cerebras model properties. */
export type CerebrasModelPropertiesInput = {
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The Cerebras API endpoint, if using developer's own account. */
  endpoint?: InputMaybe<Scalars['URL']['input']>;
  /** The Cerebras API key, if using developer's own account. */
  key?: InputMaybe<Scalars['String']['input']>;
  /** The Cerebras model, or custom, when using developer's own account. */
  model: CerebrasModels;
  /** The Cerebras model name, if using developer's own account. */
  modelName?: InputMaybe<Scalars['String']['input']>;
  /** The model token probability. */
  probability?: InputMaybe<Scalars['Float']['input']>;
  /** The model temperature. */
  temperature?: InputMaybe<Scalars['Float']['input']>;
  /** The number of tokens which can provided to the Cerebras model, if using developer's own account. */
  tokenLimit?: InputMaybe<Scalars['Int']['input']>;
};

/** Represents Cerebras model properties. */
export type CerebrasModelPropertiesUpdateInput = {
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The Cerebras API endpoint, if using developer's own account. */
  endpoint?: InputMaybe<Scalars['URL']['input']>;
  /** The Cerebras API key, if using developer's own account. */
  key?: InputMaybe<Scalars['String']['input']>;
  /** The Cerebras model, or custom, when using developer's own account. */
  model?: InputMaybe<CerebrasModels>;
  /** The Cerebras model name, if using developer's own account. */
  modelName?: InputMaybe<Scalars['String']['input']>;
  /** The model token probability. */
  probability?: InputMaybe<Scalars['Float']['input']>;
  /** The model temperature. */
  temperature?: InputMaybe<Scalars['Float']['input']>;
  /** The number of tokens which can provided to the Cerebras model, if using developer's own account. */
  tokenLimit?: InputMaybe<Scalars['Int']['input']>;
};

/** Cerebras model type */
export enum CerebrasModels {
  /** Developer-specified model */
  Custom = 'CUSTOM',
  /** LLaMA 3.1 8b */
  Llama_3_1_8B = 'LLAMA_3_1_8B',
  /** LLaMA 3.3 70b */
  Llama_3_3_70B = 'LLAMA_3_3_70B'
}

/** Represents a classification workflow job. */
export type ClassificationWorkflowJob = {
  __typename?: 'ClassificationWorkflowJob';
  /** The content classification connector. */
  connector?: Maybe<ContentClassificationConnector>;
};

/** Represents a classification workflow job. */
export type ClassificationWorkflowJobInput = {
  /** The content classification connector. */
  connector?: InputMaybe<ContentClassificationConnectorInput>;
};

/** Represents the classification workflow stage. */
export type ClassificationWorkflowStage = {
  __typename?: 'ClassificationWorkflowStage';
  /** The jobs for the classification workflow stage. */
  jobs?: Maybe<Array<Maybe<ClassificationWorkflowJob>>>;
};

/** Represents the classification workflow stage. */
export type ClassificationWorkflowStageInput = {
  /** The jobs for the classification workflow stage. */
  jobs?: InputMaybe<Array<InputMaybe<ClassificationWorkflowJobInput>>>;
};

/** Represents Cohere model properties. */
export type CohereModelProperties = {
  __typename?: 'CohereModelProperties';
  /** The limit of tokens per embedded text chunk, defaults to 600. */
  chunkTokenLimit?: Maybe<Scalars['Int']['output']>;
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: Maybe<Scalars['Int']['output']>;
  /** The Cohere API key, if using developer's own account. */
  key?: Maybe<Scalars['String']['output']>;
  /** The Cohere model, or custom, when using developer's own account. */
  model: CohereModels;
  /** The Cohere model name, if using developer's own account. */
  modelName?: Maybe<Scalars['String']['output']>;
  /** The model token probability. */
  probability?: Maybe<Scalars['Float']['output']>;
  /** The model temperature. */
  temperature?: Maybe<Scalars['Float']['output']>;
  /** The number of tokens which can provided to the Cohere model, if using developer's own account. */
  tokenLimit?: Maybe<Scalars['Int']['output']>;
};

/** Represents Cohere model properties. */
export type CohereModelPropertiesInput = {
  /** The limit of tokens per embedded text chunk, defaults to 600. */
  chunkTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The Cohere API key, if using developer's own account. */
  key?: InputMaybe<Scalars['String']['input']>;
  /** The Cohere model, or custom, when using developer's own account. */
  model: CohereModels;
  /** The Cohere model name, if using developer's own account. */
  modelName?: InputMaybe<Scalars['String']['input']>;
  /** The model token probability. */
  probability?: InputMaybe<Scalars['Float']['input']>;
  /** The model temperature. */
  temperature?: InputMaybe<Scalars['Float']['input']>;
  /** The number of tokens which can provided to the Cohere model, if using developer's own account. */
  tokenLimit?: InputMaybe<Scalars['Int']['input']>;
};

/** Represents Cohere model properties. */
export type CohereModelPropertiesUpdateInput = {
  /** The limit of tokens per embedded text chunk, defaults to 600. */
  chunkTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The Cohere API key, if using developer's own account. */
  key?: InputMaybe<Scalars['String']['input']>;
  /** The Cohere model, or custom, when using developer's own account. */
  model?: InputMaybe<CohereModels>;
  /** The Cohere model name, if using developer's own account. */
  modelName?: InputMaybe<Scalars['String']['input']>;
  /** The model token probability. */
  probability?: InputMaybe<Scalars['Float']['input']>;
  /** The model temperature. */
  temperature?: InputMaybe<Scalars['Float']['input']>;
  /** The number of tokens which can provided to the Cohere model, if using developer's own account. */
  tokenLimit?: InputMaybe<Scalars['Int']['input']>;
};

/** Cohere model type */
export enum CohereModels {
  /** Command A (Latest) */
  CommandA = 'COMMAND_A',
  /** Command A (2025-03 version) */
  CommandA_202503 = 'COMMAND_A_202503',
  /** Command R (Latest) */
  CommandR = 'COMMAND_R',
  /** Command R7B (2024-12 version) */
  CommandR7B_202412 = 'COMMAND_R7_B_202412',
  /** Command R (2024-03 version) */
  CommandR_202403 = 'COMMAND_R_202403',
  /** Command R (2024-08 version) */
  CommandR_202408 = 'COMMAND_R_202408',
  /** Command R+ (Latest) */
  CommandRPlus = 'COMMAND_R_PLUS',
  /** Command R+ (2024-04 version) */
  CommandRPlus_202404 = 'COMMAND_R_PLUS_202404',
  /** Command R+ (2024-08 version) */
  CommandRPlus_202408 = 'COMMAND_R_PLUS_202408',
  /** Developer-specified model */
  Custom = 'CUSTOM',
  /** Embed English 3.0 */
  EmbedEnglish_3_0 = 'EMBED_ENGLISH_3_0',
  /** Embed Multilingual 3.0 */
  EmbedMultilingual_3_0 = 'EMBED_MULTILINGUAL_3_0'
}

/** Represents a collection. */
export type Collection = {
  __typename?: 'Collection';
  /** The count of the contents contained by the collection. */
  contentCount?: Maybe<Scalars['Int']['output']>;
  /** The contents contained by the collection. */
  contents?: Maybe<Array<Maybe<Content>>>;
  /** The creation date of the collection. */
  creationDate: Scalars['DateTime']['output'];
  /** The expected contents count of the collection. */
  expectedCount?: Maybe<Scalars['Int']['output']>;
  /** The ID of the collection. */
  id: Scalars['ID']['output'];
  /** The modified date of the collection. */
  modifiedDate?: Maybe<Scalars['DateTime']['output']>;
  /** The name of the collection. */
  name: Scalars['String']['output'];
  /** The owner of the collection. */
  owner: Owner;
  /** The relevance score of the collection. */
  relevance?: Maybe<Scalars['Float']['output']>;
  /** The state of the collection (i.e. created, finished). */
  state: EntityState;
  /** The collection type. */
  type?: Maybe<CollectionTypes>;
};

/** Represents a filter for collections. */
export type CollectionFilter = {
  /** Filter by creation date recent timespan. For example, a timespan of one day will return collection(s) created in the last 24 hours. */
  createdInLast?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** Filter collection(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Whether to disable inheritance from project to tenant, upon collection retrieval. Defaults to False. */
  disableInheritance?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter collection(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of collection(s) to be returned. Defaults to 100. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter collection(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Skip the specified number of collection(s) from the beginning of the result set. Only supported on keyword search. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** Filter collection(s) by searching for similar text. */
  search?: InputMaybe<Scalars['String']['input']>;
  /** Filter collection(s) by their states. */
  states?: InputMaybe<Array<EntityState>>;
  /** Filter by collection types. */
  types?: InputMaybe<Array<CollectionTypes>>;
};

/** Represents a collection. */
export type CollectionInput = {
  /** The contents contained by the collection. */
  contents?: InputMaybe<Array<EntityReferenceInput>>;
  /** The expected contents count of the collection. */
  expectedCount?: InputMaybe<Scalars['Int']['input']>;
  /** The name of the collection. */
  name: Scalars['String']['input'];
  /** The collection type. */
  type?: InputMaybe<CollectionTypes>;
};

/** Represents collection query results. */
export type CollectionResults = {
  __typename?: 'CollectionResults';
  /** The list of collection query results. */
  results?: Maybe<Array<Maybe<Collection>>>;
};

/** Collection type */
export enum CollectionTypes {
  /** Content collection */
  Collection = 'COLLECTION',
  /** Email thread */
  Thread = 'THREAD'
}

/** Represents a collection. */
export type CollectionUpdateInput = {
  /** The contents contained by the collection. */
  contents?: InputMaybe<Array<EntityReferenceInput>>;
  /** The expected contents count of the collection. */
  expectedCount?: InputMaybe<Scalars['Int']['input']>;
  /** The ID of the collection to update. */
  id: Scalars['ID']['input'];
  /** The name of the collection. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The collection type. */
  type?: InputMaybe<CollectionTypes>;
};

/** Represents a connector. */
export type Connector = {
  __typename?: 'Connector';
  authentication?: Maybe<AuthenticationConnector>;
  /** The creation date of the connector. */
  creationDate: Scalars['DateTime']['output'];
  /** The ID of the connector. */
  id: Scalars['ID']['output'];
  integration?: Maybe<IntegrationConnector>;
  /** The modified date of the connector. */
  modifiedDate?: Maybe<Scalars['DateTime']['output']>;
  /** The name of the connector. */
  name: Scalars['String']['output'];
  /** The owner of the connector. */
  owner: Owner;
  /** The relevance score of the connector. */
  relevance?: Maybe<Scalars['Float']['output']>;
  /** The state of the connector (i.e. created, finished). */
  state: EntityState;
  /** The connector type. */
  type?: Maybe<ConnectorTypes>;
};

/** Represents a filter for connectors. */
export type ConnectorFilter = {
  /** Filter by creation date recent timespan. For example, a timespan of one day will return connector(s) created in the last 24 hours. */
  createdInLast?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** Filter connector(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter connector(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of connector(s) to be returned. Defaults to 100. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter connector(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Skip the specified number of connector(s) from the beginning of the result set. Only supported on keyword search. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** Filter connector(s) by searching for similar text. */
  search?: InputMaybe<Scalars['String']['input']>;
  /** Filter connector(s) by their states. */
  states?: InputMaybe<Array<EntityState>>;
  /** Filter by connector types. */
  types?: InputMaybe<Array<ConnectorTypes>>;
};

/** Represents a connector. */
export type ConnectorInput = {
  authentication?: InputMaybe<AuthenticationConnectorInput>;
  integration?: InputMaybe<IntegrationConnectorInput>;
  /** The name of the connector. */
  name: Scalars['String']['input'];
  /** The connector type. */
  type: ConnectorTypes;
};

/** Represents connector query results. */
export type ConnectorResults = {
  __typename?: 'ConnectorResults';
  /** The list of connector query results. */
  results?: Maybe<Array<Maybe<Connector>>>;
};

/** Connector type */
export enum ConnectorTypes {
  /** Authentication connector */
  Authentication = 'AUTHENTICATION',
  /** Integration connector */
  Integration = 'INTEGRATION'
}

/** Represents a connector. */
export type ConnectorUpdateInput = {
  authentication?: InputMaybe<AuthenticationConnectorInput>;
  /** The ID of the connector to update. */
  id: Scalars['ID']['input'];
  integration?: InputMaybe<IntegrationConnectorInput>;
  /** The name of the connector. */
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Represents content. */
export type Content = {
  __typename?: 'Content';
  /** The content physical address */
  address?: Maybe<Address>;
  /** The content audio metadata. */
  audio?: Maybe<AudioMetadata>;
  /** The audio mezzanine rendition URI of the content. For audio and video files, this will reference an intermediate MP3 rendition of the content. */
  audioUri?: Maybe<Scalars['URL']['output']>;
  /** The geo-boundary of the content, as GeoJSON Feature with Polygon geometry. */
  boundary?: Maybe<Scalars['String']['output']>;
  /** The summarized content bullet points. */
  bullets?: Maybe<Array<Scalars['String']['output']>>;
  /** The C4ID hash of the content. */
  c4id?: Maybe<Scalars['String']['output']>;
  /** The timestamped chapters summarized from the content transcript. */
  chapters?: Maybe<Array<Scalars['String']['output']>>;
  /** The child contents linked to this content. For unpacked contents, i.e. from ZIP file or PDF document, this will be a list of linked content, such as images in PDF document. For crawled links, this will be a list of crawled web pages or files. */
  children?: Maybe<Array<Maybe<Content>>>;
  /** The collections this content is contained within. */
  collections?: Maybe<Array<Maybe<Collection>>>;
  /** The tenant correlation identifier. */
  correlationId?: Maybe<Scalars['String']['output']>;
  /** The creation date of the content. */
  creationDate: Scalars['DateTime']['output'];
  /** The custom content summary. */
  customSummary?: Maybe<Scalars['String']['output']>;
  /** The content description. */
  description?: Maybe<Scalars['String']['output']>;
  /** The content file device type. */
  deviceType?: Maybe<DeviceTypes>;
  /** The content document metadata. */
  document?: Maybe<DocumentMetadata>;
  /** The content drawing metadata. */
  drawing?: Maybe<DrawingMetadata>;
  /** The content email metadata. */
  email?: Maybe<EmailMetadata>;
  /** The EPSG code for spatial reference of the content. */
  epsgCode?: Maybe<Scalars['Int']['output']>;
  /** If workflow failed, the error message. */
  error?: Maybe<Scalars['String']['output']>;
  /** The feed where this content was sourced from. */
  feed?: Maybe<Feed>;
  /** The content file extension. */
  fileExtension?: Maybe<Scalars['String']['output']>;
  /** The content file name. */
  fileName?: Maybe<Scalars['String']['output']>;
  /** The content file size. */
  fileSize?: Maybe<Scalars['Long']['output']>;
  /** The content file type. */
  fileType?: Maybe<FileTypes>;
  /** The finished date of the content workflow. */
  finishedDate?: Maybe<Scalars['DateTime']['output']>;
  /** The content file format. */
  format?: Maybe<Scalars['String']['output']>;
  /** The content file format name. */
  formatName?: Maybe<Scalars['String']['output']>;
  /** The similar image frames, when using similarity search. */
  frames?: Maybe<Array<TextFrame>>;
  /** The content geometry metadata. */
  geometry?: Maybe<GeometryMetadata>;
  /** The H3 index of the content. */
  h3?: Maybe<H3>;
  /** The summarized content headlines. */
  headlines?: Maybe<Array<Scalars['String']['output']>>;
  /** The ID of the content. */
  id: Scalars['ID']['output'];
  /** The content external identifier. */
  identifier?: Maybe<Scalars['String']['output']>;
  /** The content image metadata. */
  image?: Maybe<ImageMetadata>;
  /** The image rendition URI of the content. For web pages, this will contain a PNG screenshot of the website. For images, this will contain a rescaled JPEG rendition of the content. */
  imageUri?: Maybe<Scalars['URL']['output']>;
  /** The content issue metadata. */
  issue?: Maybe<IssueMetadata>;
  /** The summarized content keywords or key phrases. */
  keywords?: Maybe<Array<Scalars['String']['output']>>;
  /** The content language metadata. */
  language?: Maybe<LanguageMetadata>;
  /** The extracted hyperlinks. */
  links?: Maybe<Array<LinkReference>>;
  /** The geo-location of the content. */
  location?: Maybe<Point>;
  /** The content text formatted as Markdown.  Contains either the extracted text for files, posts, etc., or the raw text for messages, emails, etc. */
  markdown?: Maybe<Scalars['String']['output']>;
  /** The master rendition URI of the content. This references a cached rendition of the source content. */
  masterUri?: Maybe<Scalars['URL']['output']>;
  /** The metadata indexed from this content. */
  metadata?: Maybe<Array<Maybe<Metadata>>>;
  /**
   * The mezzanine rendition URI of the content.
   * @deprecated Use audioUri or textUri instead.
   */
  mezzanineUri?: Maybe<Scalars['URL']['output']>;
  /** The content MIME type. */
  mimeType?: Maybe<Scalars['String']['output']>;
  /** The modified date of the content. */
  modifiedDate?: Maybe<Scalars['DateTime']['output']>;
  /** The name of the content. */
  name: Scalars['String']['output'];
  /** The observations identified within this content. */
  observations?: Maybe<Array<Maybe<Observation>>>;
  /** The original date/time of the content, i.e. when a document was authored, or when an image was taken. */
  originalDate?: Maybe<Scalars['DateTime']['output']>;
  /** The owner of the content. */
  owner: Owner;
  /** The content package metadata. */
  package?: Maybe<PackageMetadata>;
  /** The similar text pages, when using similarity search. */
  pages?: Maybe<Array<TextPage>>;
  /** The parent content linked to this content. For unpacked contents, i.e. from ZIP file or PDF document, this will be the originating content. For crawled links, this will be the web page which originally contained the hyperlinks. */
  parent?: Maybe<Content>;
  /** The geo-path of the content, as GeoJSON Feature with Polygon geometry. */
  path?: Maybe<Scalars['String']['output']>;
  /** The content point cloud metadata. */
  pointCloud?: Maybe<PointCloudMetadata>;
  /** The summarized content social media posts. */
  posts?: Maybe<Array<Scalars['String']['output']>>;
  /** The followup questions which can be asked about the content. */
  questions?: Maybe<Array<Scalars['String']['output']>>;
  /** The relevance score of the content. */
  relevance?: Maybe<Scalars['Float']['output']>;
  /** The renditions generated from this content. */
  renditions?: Maybe<Array<Maybe<Rendition>>>;
  /** The similar text transcript segments, when using similarity search. */
  segments?: Maybe<Array<TextSegment>>;
  /** The content shape metadata. */
  shape?: Maybe<ShapeMetadata>;
  /** The started date of the content workflow. */
  startedDate?: Maybe<Scalars['DateTime']['output']>;
  /** The state of the content (i.e. created, finished). */
  state: EntityState;
  /** The content summary. */
  summary?: Maybe<Scalars['String']['output']>;
  /** The content text formatted as plain text.  Contains either the extracted text for files, posts, etc., or the raw text for messages, emails, etc. */
  text?: Maybe<Scalars['String']['output']>;
  /** The text mezzanine rendition URI of the content. This will reference a JSON rendition of extracted text and tables from the content. */
  textUri?: Maybe<Scalars['URL']['output']>;
  /** The text transcript rendition URI of the content. For audio and video files, this will reference a JSON rendition of transcribed audio segments from the content. */
  transcriptUri?: Maybe<Scalars['URL']['output']>;
  /** The content type. */
  type?: Maybe<ContentTypes>;
  /** The content URI. */
  uri?: Maybe<Scalars['URL']['output']>;
  /** The content video metadata. */
  video?: Maybe<VideoMetadata>;
  workflow?: Maybe<Workflow>;
  /** The workflow duration of the content. */
  workflowDuration?: Maybe<Scalars['TimeSpan']['output']>;
};

/** Represents a content classification connector. */
export type ContentClassificationConnector = {
  __typename?: 'ContentClassificationConnector';
  /** The content type for filtering content classification services. */
  contentType?: Maybe<ContentTypes>;
  /** The file type for filtering content classification services. */
  fileType?: Maybe<FileTypes>;
  /** The specific properties for LLM content classification. */
  model?: Maybe<ModelContentClassificationProperties>;
  /** The specific properties for regex content classification. */
  regex?: Maybe<RegexContentClassificationProperties>;
  /** The content classification service type. */
  type: ContentClassificationServiceTypes;
};

/** Represents a content classification connector. */
export type ContentClassificationConnectorInput = {
  /** The content type for filtering content classification services. */
  contentType?: InputMaybe<ContentTypes>;
  /** The file type for filtering content classification services. */
  fileType?: InputMaybe<FileTypes>;
  /** The specific properties for LLM content classification. */
  model?: InputMaybe<ModelContentClassificationPropertiesInput>;
  /** The specific properties for regex content classification. */
  regex?: InputMaybe<RegexContentClassificationPropertiesInput>;
  /** The entity enrichment service type. */
  type?: InputMaybe<ContentClassificationServiceTypes>;
};

/** Content classification service type */
export enum ContentClassificationServiceTypes {
  /** LLM-based Classification */
  Model = 'MODEL',
  /** Regex-based Classification */
  Regex = 'REGEX'
}

/** Represents a content filter. */
export type ContentCriteria = {
  __typename?: 'ContentCriteria';
  /** List of additional content filters using conjunctive conditions, i.e. 'and' semantics between each filter in list. */
  and?: Maybe<Array<ContentCriteriaLevel>>;
  /** Filter by collections. */
  collections?: Maybe<Array<EntityReference>>;
  /** Filter by contents. */
  contents?: Maybe<Array<EntityReference>>;
  /** Filter by creation date recent timespan. For example, a timespan of one day will return content created in the last 24 hours. */
  createdInLast?: Maybe<Scalars['TimeSpan']['output']>;
  /** Filter by creation date range. */
  creationDateRange?: Maybe<DateRange>;
  /** Filter by original date range. */
  dateRange?: Maybe<DateRange>;
  /** Filter by feeds. */
  feeds?: Maybe<Array<EntityReference>>;
  /** Filter by file extensions. */
  fileExtensions?: Maybe<Array<Scalars['String']['output']>>;
  /** Filter by file types. */
  fileTypes?: Maybe<Array<Maybe<FileTypes>>>;
  /** Filter by file formats. */
  formats?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Filter by original date recent timespan. For example, a timespan of one day will return content authored in the last 24 hours. */
  inLast?: Maybe<Scalars['TimeSpan']['output']>;
  /** Filter by observations. */
  observations?: Maybe<Array<ObservationCriteria>>;
  /** List of additional content filters using disjunctive conditions, i.e. 'or' semantics between each filter in list. */
  or?: Maybe<Array<ContentCriteriaLevel>>;
  /** Filter by similar contents. */
  similarContents?: Maybe<Array<EntityReference>>;
  /** Filter by content types. */
  types?: Maybe<Array<ContentTypes>>;
  /** Filter by users. Only applies to project scope. */
  users?: Maybe<Array<EntityReference>>;
  /** Filter by workflows. */
  workflows?: Maybe<Array<EntityReference>>;
};

/** Represents a content filter. */
export type ContentCriteriaInput = {
  /** List of additional content filters using conjunctive conditions, i.e. 'and' semantics between each filter in list. */
  and?: InputMaybe<Array<ContentCriteriaLevelInput>>;
  /** Filter by collections. */
  collections?: InputMaybe<Array<EntityReferenceInput>>;
  /** Filter by contents. */
  contents?: InputMaybe<Array<EntityReferenceInput>>;
  /** Filter by creation date recent timespan. For example, a timespan of one day will return content created in the last 24 hours. */
  createdInLast?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** Filter by creation date range. */
  creationDateRange?: InputMaybe<DateRangeInput>;
  /** Filter by original date range. */
  dateRange?: InputMaybe<DateRangeInput>;
  /** Filter by feeds. */
  feeds?: InputMaybe<Array<EntityReferenceInput>>;
  /** Filter by file types. */
  fileTypes?: InputMaybe<Array<FileTypes>>;
  /** Filter by original date recent timespan. For example, a timespan of one day will return content authored in the last 24 hours. */
  inLast?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** Filter by observations. */
  observations?: InputMaybe<Array<ObservationCriteriaInput>>;
  /** List of additional content filters using disjunctive conditions, i.e. 'or' semantics between each filter in list. */
  or?: InputMaybe<Array<ContentCriteriaLevelInput>>;
  /** Filter by similar contents. */
  similarContents?: InputMaybe<Array<EntityReferenceInput>>;
  /** Filter by content types. */
  types?: InputMaybe<Array<ContentTypes>>;
  /** Filter by workflows. */
  workflows?: InputMaybe<Array<EntityReferenceInput>>;
};

/** Represents a filter level for contents. */
export type ContentCriteriaLevel = {
  __typename?: 'ContentCriteriaLevel';
  /** Filter by collections. */
  collections?: Maybe<Array<EntityReference>>;
  /** Filter by feeds. */
  feeds?: Maybe<Array<EntityReference>>;
  /** Filter by observations. */
  observations?: Maybe<Array<ObservationCriteria>>;
  /** Filter by users. Only applies to project scope. */
  users?: Maybe<Array<EntityReference>>;
  /** Filter by workflows. */
  workflows?: Maybe<Array<EntityReference>>;
};

/** Represents a filter level for contents. */
export type ContentCriteriaLevelInput = {
  /** Filter by collections. */
  collections?: InputMaybe<Array<EntityReferenceInput>>;
  /** Filter by feeds. */
  feeds?: InputMaybe<Array<EntityReferenceInput>>;
  /** Filter by observations. */
  observations?: InputMaybe<Array<ObservationCriteriaInput>>;
  /** Filter by workflows. */
  workflows?: InputMaybe<Array<EntityReferenceInput>>;
};

/** Represents a content facet. */
export type ContentFacet = {
  __typename?: 'ContentFacet';
  /** The facet count. */
  count?: Maybe<Scalars['Long']['output']>;
  /** The content facet type. */
  facet?: Maybe<ContentFacetTypes>;
  /** The observable facet. */
  observable?: Maybe<ObservableFacet>;
  /** The facet value range. */
  range?: Maybe<StringRange>;
  /** The facet value type. */
  type?: Maybe<FacetValueTypes>;
  /** The facet value. */
  value?: Maybe<Scalars['String']['output']>;
};

/** Represents the configuration for retrieving the content facets. */
export type ContentFacetInput = {
  /** The content facet type. */
  facet?: InputMaybe<ContentFacetTypes>;
  /** The facet time interval. */
  timeInterval?: InputMaybe<TimeIntervalTypes>;
  /** The facet time offset (in hours). */
  timeOffset?: InputMaybe<Scalars['Int']['input']>;
};

/** Content facet types */
export enum ContentFacetTypes {
  /** Audio Author */
  AudioAuthor = 'AUDIO_AUTHOR',
  /** Audio Publisher */
  AudioPublisher = 'AUDIO_PUBLISHER',
  /** Audio Series */
  AudioSeries = 'AUDIO_SERIES',
  /** Content Type */
  ContentType = 'CONTENT_TYPE',
  /** Creation Date */
  CreationDate = 'CREATION_DATE',
  /** Device Type */
  DeviceType = 'DEVICE_TYPE',
  /** Document Author */
  DocumentAuthor = 'DOCUMENT_AUTHOR',
  /** Document Has Digital Signature */
  DocumentHasDigitalSignature = 'DOCUMENT_HAS_DIGITAL_SIGNATURE',
  /** Document Is Encrypted */
  DocumentIsEncrypted = 'DOCUMENT_IS_ENCRYPTED',
  /** Document Publisher */
  DocumentPublisher = 'DOCUMENT_PUBLISHER',
  /** Email Priority */
  EmailPriority = 'EMAIL_PRIORITY',
  /** Email Sensitivity */
  EmailSensitivity = 'EMAIL_SENSITIVITY',
  /** File Extension */
  FileExtension = 'FILE_EXTENSION',
  /** File Size */
  FileSize = 'FILE_SIZE',
  /** File Type */
  FileType = 'FILE_TYPE',
  /** Format */
  Format = 'FORMAT',
  /** Format Name */
  FormatName = 'FORMAT_NAME',
  /** Image Make */
  ImageMake = 'IMAGE_MAKE',
  /** Image Model */
  ImageModel = 'IMAGE_MODEL',
  /** Image Software */
  ImageSoftware = 'IMAGE_SOFTWARE',
  /** Issue Priority */
  IssuePriority = 'ISSUE_PRIORITY',
  /** Issue Project */
  IssueProject = 'ISSUE_PROJECT',
  /** Issue Status */
  IssueStatus = 'ISSUE_STATUS',
  /** Issue Team */
  IssueTeam = 'ISSUE_TEAM',
  /** Issue Type */
  IssueType = 'ISSUE_TYPE',
  /** Observed Entity */
  Observable = 'OBSERVABLE',
  /** Original Date */
  OriginalDate = 'ORIGINAL_DATE',
  /** Video Make */
  VideoMake = 'VIDEO_MAKE',
  /** Video Model */
  VideoModel = 'VIDEO_MODEL',
  /** Video Software */
  VideoSoftware = 'VIDEO_SOFTWARE'
}

/** Represents a filter for contents. */
export type ContentFilter = {
  /** List of additional content filters using conjunctive conditions, i.e. 'and' semantics between each filter in list. */
  and?: InputMaybe<Array<InputMaybe<ContentFilterLevel>>>;
  /** Filter by geo-boundaries, as GeoJSON Feature with Polygon geometry. */
  boundaries?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Filter by collections. */
  collections?: InputMaybe<Array<EntityReferenceFilter>>;
  /** Filter by contents. */
  contents?: InputMaybe<Array<EntityReferenceFilter>>;
  /** Filter by creation date recent timespan. For example, a timespan of one day will return content(s) created in the last 24 hours. */
  createdInLast?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** Filter content(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Whether to disable inheritance from project to tenant, upon content retrieval. Defaults to False. */
  disableInheritance?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by feeds. */
  feeds?: InputMaybe<Array<EntityReferenceFilter>>;
  /** Filter by file extensions. */
  fileExtensions?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Filter by file size range. */
  fileSizeRange?: InputMaybe<Int64RangeFilter>;
  /** Filter by file types. */
  fileTypes?: InputMaybe<Array<FileTypes>>;
  /** Filter by file formats. */
  formats?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Filter by H3 index. */
  h3?: InputMaybe<H3Filter>;
  /** Filter content(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Filter contents by their external identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** Filter by searching for similar Base64-encoded image. Accepts Base64-encoded image as string, which is used to generate image embeddings for similarity search. */
  imageData?: InputMaybe<Scalars['String']['input']>;
  /** MIME type of Base64-encoded image for similarity search. */
  imageMimeType?: InputMaybe<Scalars['String']['input']>;
  /** Filter by original date recent timespan. For example, a timespan of one day will return content authored in the last 24 hours. */
  inLast?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** Limit the number of content(s) to be returned. Defaults to 100. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter by geo-location. */
  location?: InputMaybe<PointFilter>;
  /** Filter content(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** When using similarity search, the number of similar items to be returned. Defaults to 100. */
  numberSimilar?: InputMaybe<Scalars['Int']['input']>;
  /** Filter by observations. */
  observations?: InputMaybe<Array<ObservationReferenceFilter>>;
  /** Skip the specified number of content(s) from the beginning of the result set. Only supported on keyword search. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** List of additional content filters using disjunctive conditions, i.e. 'or' semantics between each filter in list. */
  or?: InputMaybe<Array<InputMaybe<ContentFilterLevel>>>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** Filter by original date range. */
  originalDateRange?: InputMaybe<DateRangeFilter>;
  /** The query syntax for the search text. Defaults to Simple. */
  queryType?: InputMaybe<SearchQueryTypes>;
  /** Filter content(s) by searching for similar text. */
  search?: InputMaybe<Scalars['String']['input']>;
  /** The type of search to be used. Defaults to Vector. */
  searchType?: InputMaybe<SearchTypes>;
  /** Filter by similar contents. */
  similarContents?: InputMaybe<Array<EntityReferenceFilter>>;
  /** Filter content(s) by their states. */
  states?: InputMaybe<Array<EntityState>>;
  /** Filter by content types. */
  types?: InputMaybe<Array<ContentTypes>>;
  /** Filter by content URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
  /** Filter by users. Only applies to project scope. */
  users?: InputMaybe<Array<EntityReferenceFilter>>;
  /** Filter by workflows. */
  workflows?: InputMaybe<Array<EntityReferenceFilter>>;
};

/** Represents a filter level for contents. */
export type ContentFilterLevel = {
  /** Filter by collections. */
  collections?: InputMaybe<Array<EntityReferenceFilter>>;
  /** Filter by feeds. */
  feeds?: InputMaybe<Array<EntityReferenceFilter>>;
  /** Filter by observations. */
  observations?: InputMaybe<Array<ObservationReferenceFilter>>;
  /** Filter by users. Only applies to project scope. */
  users?: InputMaybe<Array<EntityReferenceFilter>>;
  /** Filter by workflows. */
  workflows?: InputMaybe<Array<EntityReferenceFilter>>;
};

/** Represents the configuration for retrieving the knowledge graph. */
export type ContentGraphInput = {
  /** The observable types. */
  types?: InputMaybe<Array<InputMaybe<ObservableTypes>>>;
};

/** Represents a content indexing connector. */
export type ContentIndexingConnector = {
  __typename?: 'ContentIndexingConnector';
  /** The content type for filtering content indexing services. */
  contentType?: Maybe<ContentTypes>;
  /** The file type for filtering content indexing services. */
  fileType?: Maybe<FileTypes>;
  /** The content indexing service type. */
  type?: Maybe<ContentIndexingServiceTypes>;
};

/** Represents a content indexing connector. */
export type ContentIndexingConnectorInput = {
  /** The content type for filtering content indexing services. */
  contentType?: InputMaybe<ContentTypes>;
  /** The file type for filtering content indexing services. */
  fileType?: InputMaybe<FileTypes>;
  /** The entity enrichment service type. */
  type?: InputMaybe<ContentIndexingServiceTypes>;
};

export enum ContentIndexingServiceTypes {
  /** Azure AI Language */
  AzureAiLanguage = 'AZURE_AI_LANGUAGE'
}

/** Represents content. */
export type ContentInput = {
  /** The content description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The content external identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The name of the content. */
  name: Scalars['String']['input'];
  /** The content text. */
  text?: InputMaybe<Scalars['String']['input']>;
  /** The content type. */
  type?: InputMaybe<ContentTypes>;
  /** The content URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
  /** The content workflow. */
  workflow?: InputMaybe<EntityReferenceInput>;
};

/** Represents a content publishing connector. */
export type ContentPublishingConnector = {
  __typename?: 'ContentPublishingConnector';
  /** The specific properties for ElevenLabs Audio publishing. */
  elevenLabs?: Maybe<ElevenLabsPublishingProperties>;
  /** The content publishing format, i.e. MP3, Markdown. */
  format: ContentPublishingFormats;
  /** The specific properties for OpenAI Image publishing. */
  openAIImage?: Maybe<OpenAiImagePublishingProperties>;
  /** The content publishing service type. */
  type: ContentPublishingServiceTypes;
};

/** Represents a content publishing connector. */
export type ContentPublishingConnectorInput = {
  /** The specific properties for ElevenLabs Audio publishing. */
  elevenLabs?: InputMaybe<ElevenLabsPublishingPropertiesInput>;
  /** The content publishing format, i.e. MP3, Markdown. */
  format: ContentPublishingFormats;
  /** The specific properties for OpenAI Image publishing. */
  openAIImage?: InputMaybe<OpenAiImagePublishingPropertiesInput>;
  /** The content publishing service type. */
  type: ContentPublishingServiceTypes;
};

/** Represents a content publishing connector. */
export type ContentPublishingConnectorUpdateInput = {
  /** The specific properties for ElevenLabs Audio publishing. */
  elevenLabs?: InputMaybe<ElevenLabsPublishingPropertiesInput>;
  /** The content publishing format, i.e. MP3, Markdown. */
  format?: InputMaybe<ContentPublishingFormats>;
  /** The specific properties for OpenAI Image publishing. */
  openAIImage?: InputMaybe<OpenAiImagePublishingPropertiesInput>;
  /** The content publishing service type. */
  type?: InputMaybe<ContentPublishingServiceTypes>;
};

export enum ContentPublishingFormats {
  /** HTML */
  Html = 'HTML',
  /** JPEG */
  Jpeg = 'JPEG',
  /** Markdown */
  Markdown = 'MARKDOWN',
  /** MP3 */
  Mp3 = 'MP3',
  /** PNG */
  Png = 'PNG',
  /** Plain Text */
  Text = 'TEXT',
  /** WEBP */
  Webp = 'WEBP'
}

/** Content publishing service type */
export enum ContentPublishingServiceTypes {
  /** ElevenLabs Audio publishing */
  ElevenLabsAudio = 'ELEVEN_LABS_AUDIO',
  /** OpenAI Image publishing */
  OpenAiImage = 'OPEN_AI_IMAGE',
  /** Text publishing */
  Text = 'TEXT'
}

/** Represents content query results. */
export type ContentResults = {
  __typename?: 'ContentResults';
  /** The content facets. */
  facets?: Maybe<Array<Maybe<ContentFacet>>>;
  /** The knowledge graph generated from the retrieved contents. */
  graph?: Maybe<Graph>;
  /** The content H3 facets. */
  h3?: Maybe<H3Facets>;
  /** The content results. */
  results?: Maybe<Array<Maybe<Content>>>;
};

/** Represents a content source. */
export type ContentSource = {
  __typename?: 'ContentSource';
  /** The content source. */
  content: EntityReference;
  /** The end time of the audio transcript segment. */
  endTime?: Maybe<Scalars['TimeSpan']['output']>;
  /** The frame number of the image sequence. */
  frameNumber?: Maybe<Scalars['Int']['output']>;
  /** The content source metadata, in XML format. */
  metadata?: Maybe<Scalars['String']['output']>;
  /** The page number of the text document. */
  pageNumber?: Maybe<Scalars['Int']['output']>;
  /** The relevance score of the content source. */
  relevance: Scalars['Float']['output'];
  /** The start time of the audio transcript segment. */
  startTime?: Maybe<Scalars['TimeSpan']['output']>;
  /** The content source text. */
  text: Scalars['String']['output'];
  /** The content source type. Determines which of the index properties are assigned, i.e. startTime, pageNumber. */
  type?: Maybe<ContentSourceTypes>;
};

/** Represents content source results. */
export type ContentSourceResults = {
  __typename?: 'ContentSourceResults';
  /** The retrieved content sources. */
  results?: Maybe<Array<Maybe<ContentSource>>>;
};

/** Content Source Types */
export enum ContentSourceTypes {
  Document = 'DOCUMENT',
  Frame = 'FRAME',
  Transcript = 'TRANSCRIPT'
}

/** Content type */
export enum ContentTypes {
  /** Email */
  Email = 'EMAIL',
  /** Calendar Event */
  Event = 'EVENT',
  /** File (i.e. document, image) */
  File = 'FILE',
  /** Issue (i.e. JIRA, Linear, GitHub) */
  Issue = 'ISSUE',
  /** Memory (i.e. Agent or User memory) */
  Memory = 'MEMORY',
  /** Message (i.e. Slack, Microsoft Teams) */
  Message = 'MESSAGE',
  /** Web page */
  Page = 'PAGE',
  /** Post (i.e. Reddit, RSS) */
  Post = 'POST',
  /** Text (i.e. Markdown, HTML, plain text) */
  Text = 'TEXT'
}

/** Represents content. */
export type ContentUpdateInput = {
  /** The content audio metadata. */
  audio?: InputMaybe<AudioMetadataInput>;
  /** The summarized content bullet points. */
  bullets?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The timestamped chapters summarized from the content transcript. */
  chapters?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The custom content summary. */
  customSummary?: InputMaybe<Scalars['String']['input']>;
  /** The content description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The content document metadata. */
  document?: InputMaybe<DocumentMetadataInput>;
  /** The content drawing metadata. */
  drawing?: InputMaybe<DrawingMetadataInput>;
  /** The content email metadata. */
  email?: InputMaybe<EmailMetadataInput>;
  /** The content geometry metadata. */
  geometry?: InputMaybe<GeometryMetadataInput>;
  /** The summarized content headlines. */
  headlines?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The ID of the content to update. */
  id: Scalars['ID']['input'];
  /** The content external identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The content image metadata. */
  image?: InputMaybe<ImageMetadataInput>;
  /** The content issue metadata. */
  issue?: InputMaybe<IssueMetadataInput>;
  /** The summarized content keywords or key phrases. */
  keywords?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The content language metadata. */
  language?: InputMaybe<LanguageMetadataInput>;
  /** The name of the content. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The content package metadata. */
  package?: InputMaybe<PackageMetadataInput>;
  /** The content point cloud metadata. */
  pointCloud?: InputMaybe<PointCloudMetadataInput>;
  /** The summarized content social media posts. */
  posts?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The followup questions which can be asked about the content. */
  questions?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The content shape metadata. */
  shape?: InputMaybe<ShapeMetadataInput>;
  /** The content summary. */
  summary?: InputMaybe<Scalars['String']['input']>;
  /** The content video metadata. */
  video?: InputMaybe<VideoMetadataInput>;
};

/** Represents a conversation. */
export type Conversation = {
  __typename?: 'Conversation';
  /** Filter augmented content for conversation. Augmented content will always be added as content sources, without regard to user prompt. */
  augmentedFilter?: Maybe<ContentCriteria>;
  /** The contents referenced by the conversation. */
  contents?: Maybe<Array<Maybe<Content>>>;
  /** The tenant correlation identifier. */
  correlationId?: Maybe<Scalars['String']['output']>;
  /** The creation date of the conversation. */
  creationDate: Scalars['DateTime']['output'];
  /** The LLM fallback specifications used by this conversation. */
  fallbacks?: Maybe<Array<Maybe<Specification>>>;
  /** Filter content for conversation. */
  filter?: Maybe<ContentCriteria>;
  /** The ID of the conversation. */
  id: Scalars['ID']['output'];
  /** The conversation messages. */
  messages?: Maybe<Array<Maybe<ConversationMessage>>>;
  /** The modified date of the conversation. */
  modifiedDate?: Maybe<Scalars['DateTime']['output']>;
  /** The name of the conversation. */
  name: Scalars['String']['output'];
  /** The owner of the conversation. */
  owner: Owner;
  /** The relevance score of the conversation. */
  relevance?: Maybe<Scalars['Float']['output']>;
  /** The LLM specification used by this conversation. */
  specification?: Maybe<Specification>;
  /** The state of the conversation (i.e. created, finished). */
  state: EntityState;
  /** The conversation type. */
  type?: Maybe<ConversationTypes>;
};

/** Represents a conversation citation. */
export type ConversationCitation = {
  __typename?: 'ConversationCitation';
  /** The cited content in the conversation message. */
  content?: Maybe<Content>;
  /** The citation end time, within the referenced audio or video content. */
  endTime?: Maybe<Scalars['TimeSpan']['output']>;
  /** The citation frame number, within the referenced image content. */
  frameNumber?: Maybe<Scalars['Int']['output']>;
  /** The citation index. */
  index?: Maybe<Scalars['Int']['output']>;
  /** The citation page number, within the referenced content. */
  pageNumber?: Maybe<Scalars['Int']['output']>;
  /** The citation start time, within the referenced audio or video content. */
  startTime?: Maybe<Scalars['TimeSpan']['output']>;
  /** The citation text. */
  text: Scalars['String']['output'];
};

/** Represents the RAG pipeline details for a prompted conversation. */
export type ConversationDetails = {
  __typename?: 'ConversationDetails';
  /** The LLM completion token limit. */
  completionTokenLimit?: Maybe<Scalars['Int']['output']>;
  /** The formatted RAG instructions. */
  formattedInstructions?: Maybe<Scalars['String']['output']>;
  /** The formatted observed entities. */
  formattedObservables?: Maybe<Scalars['String']['output']>;
  /** The formatted sources. */
  formattedSources?: Maybe<Scalars['String']['output']>;
  /** The formatted LLM tools. */
  formattedTools?: Maybe<Scalars['String']['output']>;
  /** The LLM conversation messages. */
  messages?: Maybe<Array<Maybe<ConversationMessage>>>;
  /** The LLM model description. */
  model?: Maybe<Scalars['String']['output']>;
  /** The LLM service type. */
  modelService?: Maybe<ModelServiceTypes>;
  /** The number of observable entities after retrieval. */
  observableCount?: Maybe<Scalars['Int']['output']>;
  /** The number of observable entities after reranking. */
  rankedObservableCount?: Maybe<Scalars['Int']['output']>;
  /** The number of content sources after reranking. */
  rankedSourceCount?: Maybe<Scalars['Int']['output']>;
  /** The number of tools after reranking. */
  rankedToolCount?: Maybe<Scalars['Int']['output']>;
  /** The number of observable entities after rendering. */
  renderedObservableCount?: Maybe<Scalars['Int']['output']>;
  /** The number of content sources after rendering. */
  renderedSourceCount?: Maybe<Scalars['Int']['output']>;
  /** The number of tools after rendering. */
  renderedToolCount?: Maybe<Scalars['Int']['output']>;
  /** The number of content sources after retrieval. */
  sourceCount?: Maybe<Scalars['Int']['output']>;
  /** JSON representation of the source to content mapping. */
  sources?: Maybe<Scalars['String']['output']>;
  /** JSON representation of the LLM specification. */
  specification?: Maybe<Scalars['String']['output']>;
  /** Whether the LLM supports tool calling. */
  supportsToolCalling?: Maybe<Scalars['Boolean']['output']>;
  /** The LLM prompt token limit. */
  tokenLimit?: Maybe<Scalars['Int']['output']>;
  /** The number of tools. */
  toolCount?: Maybe<Scalars['Int']['output']>;
};

/** Represents a filter for conversations. */
export type ConversationFilter = {
  /** Filter by conversations. */
  conversations?: InputMaybe<Array<EntityReferenceFilter>>;
  /** Filter by creation date recent timespan. For example, a timespan of one day will return conversation(s) created in the last 24 hours. */
  createdInLast?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** Filter conversation(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter conversation(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of conversation(s) to be returned. Defaults to 100. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter conversation(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** When using similarity search, the number of similar items to be returned. Defaults to 100. */
  numberSimilar?: InputMaybe<Scalars['Int']['input']>;
  /** Skip the specified number of conversation(s) from the beginning of the result set. Only supported on keyword search. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** The query syntax for the search text. Defaults to Simple. */
  queryType?: InputMaybe<SearchQueryTypes>;
  /** Filter conversation(s) by searching for similar text. */
  search?: InputMaybe<Scalars['String']['input']>;
  /** The type of search to be used. Defaults to Vector. */
  searchType?: InputMaybe<SearchTypes>;
  /** Filter by similar conversations. */
  similarConversations?: InputMaybe<Array<EntityReferenceFilter>>;
  /** Filter conversation(s) by their states. */
  states?: InputMaybe<Array<EntityState>>;
  /** Filter by conversation types. */
  types?: InputMaybe<Array<ConversationTypes>>;
};

/** Represents a conversation. */
export type ConversationInput = {
  /** Filter augmented content for conversation, optional. Augmented content will always be added as content sources, without regard to user prompt. */
  augmentedFilter?: InputMaybe<ContentCriteriaInput>;
  /** The LLM fallback specifications used by this conversation, optional. If the conversation fails to prompt the default specification, it will attempt each fallback specification in order. */
  fallbacks?: InputMaybe<Array<InputMaybe<EntityReferenceInput>>>;
  /** Filter content for conversation, optional. */
  filter?: InputMaybe<ContentCriteriaInput>;
  /** The conversation messages. */
  messages?: InputMaybe<Array<ConversationMessageInput>>;
  /** The name of the conversation. */
  name: Scalars['String']['input'];
  /** The LLM specification used by this conversation, optional. */
  specification?: InputMaybe<EntityReferenceInput>;
  /** The conversation type. */
  type?: InputMaybe<ConversationTypes>;
};

/** Represents a conversation message. */
export type ConversationMessage = {
  __typename?: 'ConversationMessage';
  /** The conversation message author. */
  author?: Maybe<Scalars['String']['output']>;
  /** The conversation message citations. */
  citations?: Maybe<Array<Maybe<ConversationCitation>>>;
  /** The elapsed time for the model to complete the prompt, only provided with assistant role. */
  completionTime?: Maybe<Scalars['TimeSpan']['output']>;
  /** The Base64-encoded image which will be supplied to the LLM with the conversation message, optional. */
  data?: Maybe<Scalars['String']['output']>;
  /** The conversation message. */
  message?: Maybe<Scalars['String']['output']>;
  /** The MIME type of the Base64-encoded image, optional. */
  mimeType?: Maybe<Scalars['String']['output']>;
  /** The LLM model description, only provided with assistant role. */
  model?: Maybe<Scalars['String']['output']>;
  /** The LLM service type, only provided with assistant role. */
  modelService?: Maybe<ModelServiceTypes>;
  /** The conversation message role. */
  role: ConversationRoleTypes;
  /** The LLM completion throughput in tokens/second, only provided with assistant role. */
  throughput?: Maybe<Scalars['Float']['output']>;
  /** The conversation message timestamp. */
  timestamp?: Maybe<Scalars['DateTime']['output']>;
  /** The conversation message token usage, not including RAG context tokens. */
  tokens?: Maybe<Scalars['Int']['output']>;
  /** The tools called during the prompting of the conversation. You will need to call continueConversation with the tool responses to continue the conversation. */
  toolCalls?: Maybe<Array<Maybe<ConversationToolCall>>>;
};

/** Represents a conversation message. */
export type ConversationMessageInput = {
  /** The conversation message author. */
  author?: InputMaybe<Scalars['String']['input']>;
  /** The Base64-encoded image which will be supplied to the LLM with the conversation message, optional. */
  data?: InputMaybe<Scalars['String']['input']>;
  /** The conversation message. */
  message: Scalars['String']['input'];
  /** The MIME type of the Base64-encoded image, optional. */
  mimeType?: InputMaybe<Scalars['String']['input']>;
  /** The conversation message role. */
  role: ConversationRoleTypes;
};

/** Represents conversation query results. */
export type ConversationResults = {
  __typename?: 'ConversationResults';
  /** The list of conversation query results. */
  results?: Maybe<Array<Maybe<Conversation>>>;
};

/** Conversation message role type */
export enum ConversationRoleTypes {
  /** LLM assistant message */
  Assistant = 'ASSISTANT',
  /** LLM system message */
  System = 'SYSTEM',
  /** LLM user prompt message */
  User = 'USER'
}

/** Conversation search type */
export enum ConversationSearchTypes {
  /** Hybrid (Vector similarity using user prompt + Keyword search) */
  Hybrid = 'HYBRID',
  /** Ignore user prompt for content retrieval */
  None = 'NONE',
  /** Vector similarity using user prompt */
  Vector = 'VECTOR'
}

/** Represents a conversation strategy. */
export type ConversationStrategy = {
  __typename?: 'ConversationStrategy';
  /** The weight of contents within prompt context, in range [0.0 - 1.0]. */
  contentsWeight?: Maybe<Scalars['Float']['output']>;
  /** Embed content citations into completed converation messages. */
  embedCitations?: Maybe<Scalars['Boolean']['output']>;
  /** Provide content facets with completed conversation. */
  enableFacets?: Maybe<Scalars['Boolean']['output']>;
  /** Flatten content citations such that only one citation is embedded per content. */
  flattenCitations?: Maybe<Scalars['Boolean']['output']>;
  /** The maximum number of retrieval user messages to provide with prompt context. Defaults to 5. */
  messageLimit?: Maybe<Scalars['Int']['output']>;
  /** The weight of conversation messages within prompt context, in range [0.0 - 1.0]. */
  messagesWeight?: Maybe<Scalars['Float']['output']>;
  /** The conversation strategy type. */
  type?: Maybe<ConversationStrategyTypes>;
};

/** Represents a conversation strategy. */
export type ConversationStrategyInput = {
  /** The weight of contents within prompt context, in range [0.0 - 1.0]. */
  contentsWeight?: InputMaybe<Scalars['Float']['input']>;
  /** Embed content citations into completed converation messages. */
  embedCitations?: InputMaybe<Scalars['Boolean']['input']>;
  /** Provide content facets with completed conversation. */
  enableFacets?: InputMaybe<Scalars['Boolean']['input']>;
  /** Flatten content citations such that only one citation is embedded per content. */
  flattenCitations?: InputMaybe<Scalars['Boolean']['input']>;
  /** The maximum number of retrieval user messages to provide with prompt context. Defaults to 5. */
  messageLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The weight of conversation messages within prompt context, in range [0.0 - 1.0]. */
  messagesWeight?: InputMaybe<Scalars['Float']['input']>;
  /** The conversation strategy type. */
  type?: InputMaybe<ConversationStrategyTypes>;
};

/** Conversation strategies */
export enum ConversationStrategyTypes {
  /** Summarized message history */
  Summarized = 'SUMMARIZED',
  /** Windowed message history */
  Windowed = 'WINDOWED'
}

/** Represents a conversation strategy. */
export type ConversationStrategyUpdateInput = {
  /** The weight of contents within prompt context, in range [0.0 - 1.0]. */
  contentsWeight?: InputMaybe<Scalars['Float']['input']>;
  /** Embed content citations into completed converation messages. */
  embedCitations?: InputMaybe<Scalars['Boolean']['input']>;
  /** Provide content facets with completed conversation. */
  enableFacets?: InputMaybe<Scalars['Boolean']['input']>;
  /** Flatten content citations such that only one citation is embedded per content. */
  flattenCitations?: InputMaybe<Scalars['Boolean']['input']>;
  /** The maximum number of retrieval user messages to provide with prompt context. Defaults to 5. */
  messageLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The weight of conversation messages within prompt context, in range [0.0 - 1.0]. */
  messagesWeight?: InputMaybe<Scalars['Float']['input']>;
  /** The conversation strategy type. */
  type?: InputMaybe<ConversationStrategyTypes>;
};

/** Represents a conversation tool call. */
export type ConversationToolCall = {
  __typename?: 'ConversationToolCall';
  /** The tool arguments. */
  arguments: Scalars['String']['output'];
  /** The tool call identifier. */
  id: Scalars['String']['output'];
  /** The tool name. */
  name: Scalars['String']['output'];
};

/** Represents a conversation tool calling response. */
export type ConversationToolResponseInput = {
  /** The provided response to the tool call. Accepts either text or JSON. */
  content: Scalars['String']['input'];
  /** The tool call identifier. */
  id: Scalars['String']['input'];
};

/** Conversation type */
export enum ConversationTypes {
  /** Conversation over content */
  Content = 'CONTENT'
}

/** Represents a conversation. */
export type ConversationUpdateInput = {
  /** Filter augmented content for conversation, optional. Augmented content will always be added as content sources, without regard to user prompt. */
  augmentedFilter?: InputMaybe<ContentCriteriaInput>;
  /** The LLM fallback specifications used by this conversation, optional. If the conversation fails to prompt the default specification, it will attempt each fallback specification in order. */
  fallbacks?: InputMaybe<Array<InputMaybe<EntityReferenceInput>>>;
  /** Filter content for conversation, optional. */
  filter?: InputMaybe<ContentCriteriaInput>;
  /** The ID of the conversation to update. */
  id: Scalars['ID']['input'];
  /** The name of the conversation. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The LLM specification used by this conversation, optional. */
  specification?: InputMaybe<EntityReferenceInput>;
};

/** Represents a count. */
export type CountResult = {
  __typename?: 'CountResult';
  /** The count result. */
  count?: Maybe<Scalars['Long']['output']>;
};

/** Range of date/time values, in UTC format. */
export type DateRange = {
  __typename?: 'DateRange';
  /** Starting value of date range. */
  from?: Maybe<Scalars['DateTime']['output']>;
  /** Ending value of date range. */
  to?: Maybe<Scalars['DateTime']['output']>;
};

/** Represents a filtered range of date/time values, in UTC format. */
export type DateRangeFilter = {
  /** Starting value of date range. */
  from?: InputMaybe<Scalars['DateTime']['input']>;
  /** Ending value of date range. */
  to?: InputMaybe<Scalars['DateTime']['input']>;
};

/** Range of date/time values, in UTC format. */
export type DateRangeInput = {
  /** Starting value of date range. */
  from?: InputMaybe<Scalars['DateTime']['input']>;
  /** Ending value of date range. */
  to?: InputMaybe<Scalars['DateTime']['input']>;
};

/** Represents the Deepgram preparation properties. */
export type DeepgramAudioPreparationProperties = {
  __typename?: 'DeepgramAudioPreparationProperties';
  /** Whether to auto-detect the speaker(s) language during Deepgram audio transcription. */
  detectLanguage?: Maybe<Scalars['Boolean']['output']>;
  /** Whether to enable redaction during Deepgram audio transcription. */
  enableRedaction?: Maybe<Scalars['Boolean']['output']>;
  /** Whether to enable speaker diarization during Deepgram audio transcription. */
  enableSpeakerDiarization?: Maybe<Scalars['Boolean']['output']>;
  /** The Deepgram API key, optional. */
  key?: Maybe<Scalars['String']['output']>;
  /** Specify the language to transcribe during Deepgram audio transcription. Expected language in BCP 47 format, such as 'en' or 'en-US'. */
  language?: Maybe<Scalars['String']['output']>;
  /** The Deepgram transcription model. */
  model?: Maybe<DeepgramModels>;
};

/** Represents the Deepgram preparation properties. */
export type DeepgramAudioPreparationPropertiesInput = {
  /** Whether to auto-detect the speaker(s) language during Deepgram audio transcription. */
  detectLanguage?: InputMaybe<Scalars['Boolean']['input']>;
  /** Whether to enable redaction during Deepgram audio transcription. */
  enableRedaction?: InputMaybe<Scalars['Boolean']['input']>;
  /** Whether to enable speaker diarization during Deepgram audio transcription. */
  enableSpeakerDiarization?: InputMaybe<Scalars['Boolean']['input']>;
  /** The Deepgram API key, optional. */
  key?: InputMaybe<Scalars['String']['input']>;
  /** Specify the language to transcribe during Deepgram audio transcription. Expected language in BCP 47 format, such as 'en' or 'en-US'. */
  language?: InputMaybe<Scalars['String']['input']>;
  /** The Deepgram transcription model. */
  model?: InputMaybe<DeepgramModels>;
};

/** Deepgram models */
export enum DeepgramModels {
  /** Nova 2 (General) */
  Nova2 = 'NOVA2',
  /** Nova 2 (Automotive) */
  Nova2Automotive = 'NOVA2_AUTOMOTIVE',
  /** Nova 2 (Conversational AI) */
  Nova2ConversationalAi = 'NOVA2_CONVERSATIONAL_AI',
  /** Nova 2 (Drivethru) */
  Nova2Drivethru = 'NOVA2_DRIVETHRU',
  /** Nova 2 (Finance) */
  Nova2Finance = 'NOVA2_FINANCE',
  /** Nova 2 (Medical) */
  Nova2Medical = 'NOVA2_MEDICAL',
  /** Nova 2 (Meeting) */
  Nova2Meeting = 'NOVA2_MEETING',
  /** Nova 2 (Phonecall) */
  Nova2Phonecall = 'NOVA2_PHONECALL',
  /** Nova 2 (Video) */
  Nova2Video = 'NOVA2_VIDEO',
  /** Nova 2 (Voicemail) */
  Nova2Voicemail = 'NOVA2_VOICEMAIL',
  /** Nova 3 (General) */
  Nova3 = 'NOVA3',
  /** Whisper (Base) */
  WhisperBase = 'WHISPER_BASE',
  /** Whisper (Large) */
  WhisperLarge = 'WHISPER_LARGE',
  /** Whisper (Medium) */
  WhisperMedium = 'WHISPER_MEDIUM',
  /** Whisper (Small) */
  WhisperSmall = 'WHISPER_SMALL',
  /** Whisper (Tiny) */
  WhisperTiny = 'WHISPER_TINY'
}

/** Represents Deepseek model properties. */
export type DeepseekModelProperties = {
  __typename?: 'DeepseekModelProperties';
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: Maybe<Scalars['Int']['output']>;
  /** The Deepseek API key, if using developer's own account. */
  key?: Maybe<Scalars['String']['output']>;
  /** The Deepseek model, or custom, when using developer's own account. */
  model: DeepseekModels;
  /** The Deepseek model name, if using developer's own account. */
  modelName?: Maybe<Scalars['String']['output']>;
  /** The model token probability. */
  probability?: Maybe<Scalars['Float']['output']>;
  /** The model temperature. */
  temperature?: Maybe<Scalars['Float']['output']>;
  /** The number of tokens which can provided to the Deepseek model, if using developer's own account. */
  tokenLimit?: Maybe<Scalars['Int']['output']>;
};

/** Represents Deepseek model properties. */
export type DeepseekModelPropertiesInput = {
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The Deepseek API key, if using developer's own account. */
  key?: InputMaybe<Scalars['String']['input']>;
  /** The Deepseek model, or custom, when using developer's own account. */
  model: DeepseekModels;
  /** The Deepseek model name, if using developer's own account. */
  modelName?: InputMaybe<Scalars['String']['input']>;
  /** The model token probability. */
  probability?: InputMaybe<Scalars['Float']['input']>;
  /** The model temperature. */
  temperature?: InputMaybe<Scalars['Float']['input']>;
  /** The number of tokens which can provided to the Deepseek model, if using developer's own account. */
  tokenLimit?: InputMaybe<Scalars['Int']['input']>;
};

/** Represents Deepseek model properties. */
export type DeepseekModelPropertiesUpdateInput = {
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The Deepseek API key, if using developer's own account. */
  key?: InputMaybe<Scalars['String']['input']>;
  /** The Deepseek model, or custom, when using developer's own account. */
  model?: InputMaybe<DeepseekModels>;
  /** The Deepseek model name, if using developer's own account. */
  modelName?: InputMaybe<Scalars['String']['input']>;
  /** The model token probability. */
  probability?: InputMaybe<Scalars['Float']['input']>;
  /** The model temperature. */
  temperature?: InputMaybe<Scalars['Float']['input']>;
  /** The number of tokens which can provided to the Deepseek model, if using developer's own account. */
  tokenLimit?: InputMaybe<Scalars['Int']['input']>;
};

/** Deepseek model type */
export enum DeepseekModels {
  /** Deepseek Chat */
  Chat = 'CHAT',
  /**
   * Deepseek Coder
   * @deprecated Deepseek Coder has been merged with Deepseek Chat, as of v2.5. Use Deepseek Chat instead.
   */
  Coder = 'CODER',
  /** Developer-specified model */
  Custom = 'CUSTOM',
  /** Deepseek Reasoner */
  Reasoner = 'REASONER'
}

/** Capture device type */
export enum DeviceTypes {
  /** Digital Camera */
  Camera = 'CAMERA',
  /** Drone */
  Drone = 'DRONE',
  /** Geospatial */
  Geospatial = 'GEOSPATIAL',
  /** Mobile Phone/Tablet */
  Mobile = 'MOBILE',
  /** Robot */
  Robot = 'ROBOT',
  /** Screen Recording */
  Screen = 'SCREEN',
  /** Stream Recording */
  Stream = 'STREAM',
  /** Unknown */
  Unknown = 'UNKNOWN'
}

/** Represents an Diffbot entity enrichment connector. */
export type DiffbotEnrichmentProperties = {
  __typename?: 'DiffbotEnrichmentProperties';
  /** The Diffbot API key. */
  key?: Maybe<Scalars['URL']['output']>;
};

/** Represents an Diffbot entity enrichment connector. */
export type DiffbotEnrichmentPropertiesInput = {
  /** The Diffbot API key. */
  key?: InputMaybe<Scalars['String']['input']>;
};

/** Represents Discord feed properties. */
export type DiscordFeedProperties = {
  __typename?: 'DiscordFeedProperties';
  /** The Discord channel name. */
  channel: Scalars['String']['output'];
  /** Should the Discord feed include attachments. */
  includeAttachments?: Maybe<Scalars['Boolean']['output']>;
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: Maybe<Scalars['Int']['output']>;
  /** The Discord bot token. */
  token: Scalars['String']['output'];
  /** Feed listing type, i.e. past or new messages. */
  type?: Maybe<FeedListingTypes>;
};

/** Represents Discord feed properties. */
export type DiscordFeedPropertiesInput = {
  /** The Discord channel name. */
  channel: Scalars['String']['input'];
  /** Should the Discord feed include attachments. */
  includeAttachments?: InputMaybe<Scalars['Boolean']['input']>;
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The Discord bot token. */
  token: Scalars['String']['input'];
  /** Feed listing type, i.e. past or new messages. */
  type?: InputMaybe<FeedListingTypes>;
};

/** Represents Discord feed properties. */
export type DiscordFeedPropertiesUpdateInput = {
  /** The Discord channel name. */
  channel?: InputMaybe<Scalars['String']['input']>;
  /** Should the Discord feed include attachments. */
  includeAttachments?: InputMaybe<Scalars['Boolean']['input']>;
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The Discord bot token. */
  token?: InputMaybe<Scalars['String']['input']>;
  /** Feed listing type, i.e. past or new messages. */
  type?: InputMaybe<FeedListingTypes>;
};

/** Represents document metadata. */
export type DocumentMetadata = {
  __typename?: 'DocumentMetadata';
  /** The document author. */
  author?: Maybe<Scalars['String']['output']>;
  /** The document character count. */
  characterCount?: Maybe<Scalars['Int']['output']>;
  /** The document comments. */
  comments?: Maybe<Scalars['String']['output']>;
  /** The document description. */
  description?: Maybe<Scalars['String']['output']>;
  /** Whether the document has a digital signature. */
  hasDigitalSignature?: Maybe<Scalars['Boolean']['output']>;
  /** The document identifier. */
  identifier?: Maybe<Scalars['String']['output']>;
  /** Whether the document is encrypted or not. */
  isEncrypted?: Maybe<Scalars['Boolean']['output']>;
  /** The document keywords. */
  keywords?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The document line count. */
  lineCount?: Maybe<Scalars['Int']['output']>;
  /** The document hyperlinks. */
  links?: Maybe<Array<Maybe<Scalars['URL']['output']>>>;
  /** The document page count. */
  pageCount?: Maybe<Scalars['Int']['output']>;
  /** The document paragraph count. */
  paragraphCount?: Maybe<Scalars['Int']['output']>;
  /** The document publisher. */
  publisher?: Maybe<Scalars['String']['output']>;
  /** The document slide count. */
  slideCount?: Maybe<Scalars['Int']['output']>;
  /** The document software. */
  software?: Maybe<Scalars['String']['output']>;
  /** The document subject. */
  subject?: Maybe<Scalars['String']['output']>;
  /** The document summary. */
  summary?: Maybe<Scalars['String']['output']>;
  /** The document title. */
  title?: Maybe<Scalars['String']['output']>;
  /** The document total editing time. */
  totalEditingTime?: Maybe<Scalars['String']['output']>;
  /** The document word count. */
  wordCount?: Maybe<Scalars['Int']['output']>;
  /** The document worksheet count. */
  worksheetCount?: Maybe<Scalars['Int']['output']>;
};

/** Represents document metadata. */
export type DocumentMetadataInput = {
  /** The document author. */
  author?: InputMaybe<Scalars['String']['input']>;
  /** The document character count. */
  characterCount?: InputMaybe<Scalars['Int']['input']>;
  /** The document comments. */
  comments?: InputMaybe<Scalars['String']['input']>;
  /** The metadata creation date. */
  creationDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** The document description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Whether the document has a digital signature. */
  hasDigitalSignature?: InputMaybe<Scalars['Boolean']['input']>;
  /** The document identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** Whether the document is encrypted or not. */
  isEncrypted?: InputMaybe<Scalars['Boolean']['input']>;
  /** The document keywords. */
  keywords?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** The document line count. */
  lineCount?: InputMaybe<Scalars['Int']['input']>;
  /** The document hyperlinks. */
  links?: InputMaybe<Array<InputMaybe<Scalars['URL']['input']>>>;
  /** The metadata geo-location. */
  location?: InputMaybe<PointInput>;
  /** The metadata modified date. */
  modifiedDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** The document page count. */
  pageCount?: InputMaybe<Scalars['Int']['input']>;
  /** The document paragraph count. */
  paragraphCount?: InputMaybe<Scalars['Int']['input']>;
  /** The document publisher. */
  publisher?: InputMaybe<Scalars['String']['input']>;
  /** The document slide count. */
  slideCount?: InputMaybe<Scalars['Int']['input']>;
  /** The document software. */
  software?: InputMaybe<Scalars['String']['input']>;
  /** The document subject. */
  subject?: InputMaybe<Scalars['String']['input']>;
  /** The document summary. */
  summary?: InputMaybe<Scalars['String']['input']>;
  /** The document title. */
  title?: InputMaybe<Scalars['String']['input']>;
  /** The document total editing time. */
  totalEditingTime?: InputMaybe<Scalars['String']['input']>;
  /** The document word count. */
  wordCount?: InputMaybe<Scalars['Int']['input']>;
  /** The document worksheet count. */
  worksheetCount?: InputMaybe<Scalars['Int']['input']>;
};

/** Represents the document preparation properties. */
export type DocumentPreparationProperties = {
  __typename?: 'DocumentPreparationProperties';
  /** Whether to extract images from documents as ingested content. */
  includeImages?: Maybe<Scalars['Boolean']['output']>;
};

/** Represents the document preparation properties. */
export type DocumentPreparationPropertiesInput = {
  /** Whether to extract images from documents as ingested content. */
  includeImages?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Represents drawing metadata. */
export type DrawingMetadata = {
  __typename?: 'DrawingMetadata';
  /** The drawing author. */
  author?: Maybe<Scalars['String']['output']>;
  /** The drawing comments. */
  comments?: Maybe<Scalars['String']['output']>;
  /** The drawing depth. */
  depth?: Maybe<Scalars['Float']['output']>;
  /** The drawing entity count. */
  entityCount?: Maybe<Scalars['Int']['output']>;
  /** The drawing height. */
  height?: Maybe<Scalars['Float']['output']>;
  /** The drawing identifier. */
  identifier?: Maybe<Scalars['String']['output']>;
  /** The drawing keywords. */
  keywords?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The drawing layer count. */
  layerCount?: Maybe<Scalars['Int']['output']>;
  /** The drawing object count. */
  objectCount?: Maybe<Scalars['Int']['output']>;
  /** The drawing page count. */
  pageCount?: Maybe<Scalars['Int']['output']>;
  /** The drawing software. */
  software?: Maybe<Scalars['String']['output']>;
  /** The drawing subject. */
  subject?: Maybe<Scalars['String']['output']>;
  /** The drawing title. */
  title?: Maybe<Scalars['String']['output']>;
  /** The drawing unit type. */
  unitType?: Maybe<UnitTypes>;
  /** The drawing view count. */
  viewCount?: Maybe<Scalars['Int']['output']>;
  /** The drawing width. */
  width?: Maybe<Scalars['Float']['output']>;
  /** The drawing X origin. */
  x?: Maybe<Scalars['Float']['output']>;
  /** The drawing Y origin. */
  y?: Maybe<Scalars['Float']['output']>;
};

/** Represents drawing metadata. */
export type DrawingMetadataInput = {
  /** The metadata creation date. */
  creationDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** The drawing depth. */
  depth?: InputMaybe<Scalars['Float']['input']>;
  /** The drawing height. */
  height?: InputMaybe<Scalars['Float']['input']>;
  /** The metadata geo-location. */
  location?: InputMaybe<PointInput>;
  /** The metadata modified date. */
  modifiedDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** The drawing unit type. */
  unitType?: InputMaybe<UnitTypes>;
  /** The drawing width. */
  width?: InputMaybe<Scalars['Float']['input']>;
  /** The drawing X origin. */
  x?: InputMaybe<Scalars['Float']['input']>;
  /** The drawing Y origin. */
  y?: InputMaybe<Scalars['Float']['input']>;
};

/** Represents Dropbox properties. */
export type DropboxFeedProperties = {
  __typename?: 'DropboxFeedProperties';
  /** Dropbox app key. */
  appKey: Scalars['String']['output'];
  /** Dropbox app secret. */
  appSecret: Scalars['String']['output'];
  /** Dropbox folder path. */
  path?: Maybe<Scalars['ID']['output']>;
  /** Dropbox redirect URI. */
  redirectUri: Scalars['String']['output'];
  /** Dropbox refresh token. */
  refreshToken: Scalars['String']['output'];
};

/** Represents Dropbox properties. */
export type DropboxFeedPropertiesInput = {
  /** Dropbox app key. */
  appKey: Scalars['String']['input'];
  /** Dropbox app secret. */
  appSecret: Scalars['String']['input'];
  /** Dropbox folder path. */
  path?: InputMaybe<Scalars['ID']['input']>;
  /** Dropbox redirect URI. */
  redirectUri: Scalars['String']['input'];
  /** Dropbox refresh token. */
  refreshToken: Scalars['String']['input'];
};

/** Represents Dropbox properties. */
export type DropboxFeedPropertiesUpdateInput = {
  /** Dropbox app key. */
  appKey?: InputMaybe<Scalars['String']['input']>;
  /** Dropbox app secret. */
  appSecret?: InputMaybe<Scalars['String']['input']>;
  /** Dropbox folder path. */
  path?: InputMaybe<Scalars['ID']['input']>;
  /** Dropbox redirect URI. */
  redirectUri?: InputMaybe<Scalars['String']['input']>;
  /** Dropbox refresh token. */
  refreshToken?: InputMaybe<Scalars['String']['input']>;
};

/** ElevenLabs models */
export enum ElevenLabsModels {
  /** Eleven English v1 */
  EnglishV1 = 'ENGLISH_V1',
  /** Eleven Flash v2 */
  FlashV2 = 'FLASH_V2',
  /** Eleven Flash v2.5 */
  FlashV2_5 = 'FLASH_V2_5',
  /** Eleven Multilingual v1 */
  MultilingualV1 = 'MULTILINGUAL_V1',
  /** Eleven Multilingual v2 */
  MultilingualV2 = 'MULTILINGUAL_V2',
  /**
   * Eleven Turbo v2
   * @deprecated Use Flash_V2 instead.
   */
  TurboV2 = 'TURBO_V2',
  /**
   * Eleven Turbo v2.5
   * @deprecated Use Flash_V2_5 instead.
   */
  TurboV2_5 = 'TURBO_V2_5'
}

/** Represents the ElevenLabs Audio publishing properties. */
export type ElevenLabsPublishingProperties = {
  __typename?: 'ElevenLabsPublishingProperties';
  /** The ElevenLabs model. */
  model?: Maybe<ElevenLabsModels>;
  /** The ElevenLabs voice identifier. */
  voice?: Maybe<Scalars['String']['output']>;
};

/** Represents the ElevenLabs Audio publishing properties. */
export type ElevenLabsPublishingPropertiesInput = {
  /** The ElevenLabs model. */
  model?: InputMaybe<ElevenLabsModels>;
  /** The ElevenLabs voice identifier. */
  voice?: InputMaybe<Scalars['String']['input']>;
};

/** Represents email feed properties. */
export type EmailFeedProperties = {
  __typename?: 'EmailFeedProperties';
  /** Feed connector type. */
  connectorType: FeedConnectorTypes;
  /** Google Email properties. */
  google?: Maybe<GoogleEmailFeedProperties>;
  /** Should the email feed include attachments. */
  includeAttachments?: Maybe<Scalars['Boolean']['output']>;
  /** Microsoft Email properties. */
  microsoft?: Maybe<MicrosoftEmailFeedProperties>;
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: Maybe<Scalars['Int']['output']>;
  /** Feed service type. */
  type: FeedServiceTypes;
};

/** Represents email feed properties. */
export type EmailFeedPropertiesInput = {
  /** Google Email properties. */
  google?: InputMaybe<GoogleEmailFeedPropertiesInput>;
  /** Should the email feed include attachments. */
  includeAttachments?: InputMaybe<Scalars['Boolean']['input']>;
  /** Microsoft Email properties. */
  microsoft?: InputMaybe<MicrosoftEmailFeedPropertiesInput>;
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: InputMaybe<Scalars['Int']['input']>;
  /** Feed service type. */
  type: FeedServiceTypes;
};

/** Represents email feed properties. */
export type EmailFeedPropertiesUpdateInput = {
  /** Google Email properties. */
  google?: InputMaybe<GoogleEmailFeedPropertiesUpdateInput>;
  /** Should the email feed include attachments. */
  includeAttachments?: InputMaybe<Scalars['Boolean']['input']>;
  /** Microsoft Email properties. */
  microsoft?: InputMaybe<MicrosoftEmailFeedPropertiesUpdateInput>;
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: InputMaybe<Scalars['Int']['input']>;
};

/** Represents email integration properties. */
export type EmailIntegrationProperties = {
  __typename?: 'EmailIntegrationProperties';
  /** Reply-to Email address. */
  from: Scalars['String']['output'];
  /** Email subject. */
  subject: Scalars['String']['output'];
  /** Email addresses. */
  to: Array<Scalars['String']['output']>;
};

/** Represents email integration properties. */
export type EmailIntegrationPropertiesInput = {
  /** Reply-to Email address. */
  from: Scalars['String']['input'];
  /** Email subject. */
  subject: Scalars['String']['input'];
  /** Email addresses. */
  to: Array<Scalars['String']['input']>;
};

/** Email list type */
export enum EmailListingTypes {
  /** Read new emails */
  New = 'NEW',
  /** Read past emails */
  Past = 'PAST'
}

/** Represents email metadata. */
export type EmailMetadata = {
  __typename?: 'EmailMetadata';
  /** The BCC recipients of the email. */
  bcc?: Maybe<Array<Maybe<PersonReference>>>;
  /** The CC recipients of the email. */
  cc?: Maybe<Array<Maybe<PersonReference>>>;
  /** The from recipients of the email. */
  from?: Maybe<Array<Maybe<PersonReference>>>;
  /** The email identifier. */
  identifier?: Maybe<Scalars['String']['output']>;
  /** The email importance. */
  importance?: Maybe<MailImportance>;
  /** The email labels. */
  labels?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The email hyperlinks. */
  links?: Maybe<Array<Maybe<Scalars['URL']['output']>>>;
  /** The email priority. */
  priority?: Maybe<MailPriority>;
  /** The email sensitivity. */
  sensitivity?: Maybe<MailSensitivity>;
  /** The email subject. */
  subject?: Maybe<Scalars['String']['output']>;
  /** The email thread identifier. */
  threadIdentifier?: Maybe<Scalars['String']['output']>;
  /** The to recipients of the email. */
  to?: Maybe<Array<Maybe<PersonReference>>>;
};

/** Represents email metadata. */
export type EmailMetadataInput = {
  /** The metadata creation date. */
  creationDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** The email identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The email importance. */
  importance?: InputMaybe<MailImportance>;
  /** The email labels. */
  labels?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** The email hyperlinks. */
  links?: InputMaybe<Array<InputMaybe<Scalars['URL']['input']>>>;
  /** The metadata geo-location. */
  location?: InputMaybe<PointInput>;
  /** The metadata modified date. */
  modifiedDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** The email priority. */
  priority?: InputMaybe<MailPriority>;
  /** The email sensitivity. */
  sensitivity?: InputMaybe<MailSensitivity>;
  /** The email subject. */
  subject?: InputMaybe<Scalars['String']['input']>;
  /** The email thread identifier. */
  threadIdentifier?: InputMaybe<Scalars['String']['input']>;
};

/** Represents the email preparation properties. */
export type EmailPreparationProperties = {
  __typename?: 'EmailPreparationProperties';
  /** Whether to extract attachments from emails as ingested content. */
  includeAttachments?: Maybe<Scalars['Boolean']['output']>;
};

/** Represents the email preparation properties. */
export type EmailPreparationPropertiesInput = {
  /** Whether to extract attachments from emails as ingested content. */
  includeAttachments?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Represents the embeddings strategy. */
export type EmbeddingsStrategy = {
  __typename?: 'EmbeddingsStrategy';
  /** @deprecated The limit of tokens per embedded text chunk has been removed from embeddings strategy. Assign in text embeddings specification instead. */
  chunkTokenLimit?: Maybe<Scalars['Int']['output']>;
  /** The LLM specification used for image embeddings, optional. */
  imageSpecification?: Maybe<EntityReference>;
  /** The LLM specification used for text embeddings, optional. */
  textSpecification?: Maybe<EntityReference>;
};

/** Represents the embeddings strategy. */
export type EmbeddingsStrategyInput = {
  /** The LLM specification used for image embeddings, optional. */
  imageSpecification?: InputMaybe<EntityReferenceInput>;
  /** The LLM specification used for text embeddings, optional. */
  textSpecification?: InputMaybe<EntityReferenceInput>;
};

/** Represents an enrichment workflow job. */
export type EnrichmentWorkflowJob = {
  __typename?: 'EnrichmentWorkflowJob';
  /** The entity enrichment connector. */
  connector?: Maybe<EntityEnrichmentConnector>;
};

/** Represents an enrichment workflow job. */
export type EnrichmentWorkflowJobInput = {
  /** The entity enrichment connector. */
  connector?: InputMaybe<EntityEnrichmentConnectorInput>;
};

/** Represents the enrichment workflow stage. */
export type EnrichmentWorkflowStage = {
  __typename?: 'EnrichmentWorkflowStage';
  /** The jobs for the enrichment workflow stage. */
  jobs?: Maybe<Array<Maybe<EnrichmentWorkflowJob>>>;
  /** The content hyperlink strategy. */
  link?: Maybe<LinkStrategy>;
};

/** Represents the enrichment workflow stage. */
export type EnrichmentWorkflowStageInput = {
  /** The jobs for the enrichment workflow stage. */
  jobs?: InputMaybe<Array<InputMaybe<EnrichmentWorkflowJobInput>>>;
  /** The content hyperlink strategy. */
  link?: InputMaybe<LinkStrategyInput>;
};

/** Represents an entity enrichment connector. */
export type EntityEnrichmentConnector = {
  __typename?: 'EntityEnrichmentConnector';
  /** The specific properties for Diffbot entity enrichment. */
  diffbot?: Maybe<DiffbotEnrichmentProperties>;
  /** The observable entity types to be enriched. */
  enrichedTypes?: Maybe<Array<Maybe<ObservableTypes>>>;
  /** The specific properties for FHIR medical entity enrichment. */
  fhir?: Maybe<FhirEnrichmentProperties>;
  /** The entity enrichment service type. */
  type?: Maybe<EntityEnrichmentServiceTypes>;
};

/** Represents an entity enrichment connector. */
export type EntityEnrichmentConnectorInput = {
  /** The specific properties for Diffbot entity enrichment. */
  diffbot?: InputMaybe<DiffbotEnrichmentPropertiesInput>;
  /** The observable entity types to be enriched. */
  enrichedTypes?: InputMaybe<Array<InputMaybe<ObservableTypes>>>;
  /** The specific properties for FHIR medical entity enrichment. */
  fhir?: InputMaybe<FhirEnrichmentPropertiesInput>;
  /** The entity enrichment service type. */
  type: EntityEnrichmentServiceTypes;
};

/** Entity enrichment service types */
export enum EntityEnrichmentServiceTypes {
  /** Crunchbase */
  Crunchbase = 'CRUNCHBASE',
  /** Diffbot */
  Diffbot = 'DIFFBOT',
  /** FHIR */
  Fhir = 'FHIR',
  /** Wikipedia */
  Wikipedia = 'WIKIPEDIA'
}

/** Represents an entity extraction connector. */
export type EntityExtractionConnector = {
  __typename?: 'EntityExtractionConnector';
  /** The specific properties for Azure Cognitive Services image entity extraction. */
  azureImage?: Maybe<AzureImageExtractionProperties>;
  /** The specific properties for Azure Cognitive Services text entity extraction. */
  azureText?: Maybe<AzureTextExtractionProperties>;
  /** The content types to allow for entity extraction. */
  contentTypes?: Maybe<Array<ContentTypes>>;
  /** The maximum number of observable entities to be extracted, per entity type. Defaults to 100. */
  extractedCount?: Maybe<Scalars['Int']['output']>;
  /** The observable entity types to be extracted, defaults to all observable types. */
  extractedTypes?: Maybe<Array<ObservableTypes>>;
  /** The file types to allow for entity extraction. */
  fileTypes?: Maybe<Array<FileTypes>>;
  /** The specific properties for LLM image entity extraction. */
  modelImage?: Maybe<ModelImageExtractionProperties>;
  /** The specific properties for LLM text entity extraction. */
  modelText?: Maybe<ModelTextExtractionProperties>;
  /** @deprecated The specific properties for OpenAI image entity extraction have been removed. Use LLM image entity extraction instead. */
  openAIImage?: Maybe<OpenAiImageExtractionProperties>;
  /** The entity extraction connector service type. */
  type: EntityExtractionServiceTypes;
};

/** Represents an entity extraction connector. */
export type EntityExtractionConnectorInput = {
  /** The specific properties for Azure Cognitive Services image entity extraction. */
  azureImage?: InputMaybe<AzureImageExtractionPropertiesInput>;
  /** The specific properties for Azure Cognitive Services text entity extraction. */
  azureText?: InputMaybe<AzureTextExtractionPropertiesInput>;
  /** The content types to allow for entity extraction. */
  contentTypes?: InputMaybe<Array<ContentTypes>>;
  /** The maximum number of observable entities to be extracted, per entity type. Defaults to 100. */
  extractedCount?: InputMaybe<Scalars['Int']['input']>;
  /** The observable entity types to be extracted, defaults to all observable types. */
  extractedTypes?: InputMaybe<Array<ObservableTypes>>;
  /** The file types to allow for entity extraction. */
  fileTypes?: InputMaybe<Array<FileTypes>>;
  /** The specific properties for LLM image entity extraction. */
  modelImage?: InputMaybe<ModelImageExtractionPropertiesInput>;
  /** The specific properties for LLM text entity extraction. */
  modelText?: InputMaybe<ModelTextExtractionPropertiesInput>;
  /** The entity extraction service type. */
  type: EntityExtractionServiceTypes;
};

/** Entity extraction service type */
export enum EntityExtractionServiceTypes {
  /** Azure AI Vision, fka Azure Cognitive Services Image */
  AzureCognitiveServicesImage = 'AZURE_COGNITIVE_SERVICES_IMAGE',
  /** Azure AI Language, fka Azure Cognitive Services Text */
  AzureCognitiveServicesText = 'AZURE_COGNITIVE_SERVICES_TEXT',
  /** LLM Image */
  ModelImage = 'MODEL_IMAGE',
  /** LLM Text */
  ModelText = 'MODEL_TEXT',
  /**
   * OpenAI Image
   * @deprecated Use MODEL_IMAGE instead.
   */
  OpenAiImage = 'OPEN_AI_IMAGE'
}

/** Represents an entity reference. */
export type EntityReference = {
  __typename?: 'EntityReference';
  /** The ID of the entity. */
  id: Scalars['ID']['output'];
};

/** Represents an entity reference filter. */
export type EntityReferenceFilter = {
  /** The ID of the entity. */
  id: Scalars['ID']['input'];
};

/** Represents an entity reference. */
export type EntityReferenceInput = {
  /** The ID of the entity. */
  id: Scalars['ID']['input'];
};

/** Entity state */
export enum EntityState {
  /** Approved */
  Approved = 'APPROVED',
  /** Archived */
  Archived = 'ARCHIVED',
  /** Changed */
  Changed = 'CHANGED',
  /** Classified */
  Classified = 'CLASSIFIED',
  /** Closed */
  Closed = 'CLOSED',
  /** Created */
  Created = 'CREATED',
  /** Deleted */
  Deleted = 'DELETED',
  /** Disabled */
  Disabled = 'DISABLED',
  /** Enabled */
  Enabled = 'ENABLED',
  /** Enriched */
  Enriched = 'ENRICHED',
  /** Errored */
  Errored = 'ERRORED',
  /** Extracted */
  Extracted = 'EXTRACTED',
  /** Finished */
  Finished = 'FINISHED',
  /** Indexed */
  Indexed = 'INDEXED',
  /** Ingested */
  Ingested = 'INGESTED',
  /** Initialized */
  Initialized = 'INITIALIZED',
  /** Opened */
  Opened = 'OPENED',
  /** Paused */
  Paused = 'PAUSED',
  /** Pending */
  Pending = 'PENDING',
  /** Prepared */
  Prepared = 'PREPARED',
  /** Queued */
  Queued = 'QUEUED',
  /** Rejected */
  Rejected = 'REJECTED',
  /** Restarted */
  Restarted = 'RESTARTED',
  /** Running */
  Running = 'RUNNING',
  /** Sanitized */
  Sanitized = 'SANITIZED',
  /** Subscribed */
  Subscribed = 'SUBSCRIBED'
}

/** Entity type */
export enum EntityTypes {
  /** Activity */
  Activity = 'ACTIVITY',
  /** Alert */
  Alert = 'ALERT',
  /** Category */
  Category = 'CATEGORY',
  /** Collection */
  Collection = 'COLLECTION',
  /** Connector */
  Connector = 'CONNECTOR',
  /** Content */
  Content = 'CONTENT',
  /** Chatbot conversation */
  Conversation = 'CONVERSATION',
  /** Event */
  Event = 'EVENT',
  /** Feed */
  Feed = 'FEED',
  /** Job */
  Job = 'JOB',
  /** Label */
  Label = 'LABEL',
  /** Medical condition */
  MedicalCondition = 'MEDICAL_CONDITION',
  /** Medical contraindication */
  MedicalContraindication = 'MEDICAL_CONTRAINDICATION',
  /** Medical device */
  MedicalDevice = 'MEDICAL_DEVICE',
  /** Medical drug */
  MedicalDrug = 'MEDICAL_DRUG',
  /** Medical drug class */
  MedicalDrugClass = 'MEDICAL_DRUG_CLASS',
  /** Medical guideline */
  MedicalGuideline = 'MEDICAL_GUIDELINE',
  /** Medical indication */
  MedicalIndication = 'MEDICAL_INDICATION',
  /** Medical procedure */
  MedicalProcedure = 'MEDICAL_PROCEDURE',
  /** Medical study */
  MedicalStudy = 'MEDICAL_STUDY',
  /** Medical test */
  MedicalTest = 'MEDICAL_TEST',
  /** Medical therapy */
  MedicalTherapy = 'MEDICAL_THERAPY',
  /** Metadata */
  Metadata = 'METADATA',
  /** Observation */
  Observation = 'OBSERVATION',
  /** Organization */
  Organization = 'ORGANIZATION',
  /** Person */
  Person = 'PERSON',
  /** Place */
  Place = 'PLACE',
  /** Product */
  Product = 'PRODUCT',
  /** Project */
  Project = 'PROJECT',
  /** Rendition */
  Rendition = 'RENDITION',
  /** Code repository */
  Repo = 'REPO',
  /** Cloud storage site */
  Site = 'SITE',
  /** Software */
  Software = 'SOFTWARE',
  /** Model specification */
  Specification = 'SPECIFICATION',
  /** User */
  User = 'USER',
  /** Workflow */
  Workflow = 'WORKFLOW'
}

/** Environment type */
export enum EnvironmentTypes {
  /** Development environment */
  Development = 'DEVELOPMENT',
  /** Production environment */
  Production = 'PRODUCTION'
}

/** Represents an event. */
export type Event = {
  __typename?: 'Event';
  /** The physical address of the event. */
  address?: Maybe<Address>;
  /** The alternate names of the event. */
  alternateNames?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The event availability end date. */
  availabilityEndDate?: Maybe<Scalars['DateTime']['output']>;
  /** The event availability start date. */
  availabilityStartDate?: Maybe<Scalars['DateTime']['output']>;
  /** The geo-boundary of the event, as GeoJSON Feature with Polygon geometry. */
  boundary?: Maybe<Scalars['String']['output']>;
  /** The creation date of the event. */
  creationDate: Scalars['DateTime']['output'];
  /** The event description. */
  description?: Maybe<Scalars['String']['output']>;
  /** The event end date. */
  endDate?: Maybe<Scalars['DateTime']['output']>;
  /** The EPSG code for spatial reference of the event. */
  epsgCode?: Maybe<Scalars['Int']['output']>;
  /** The H3 index of the event. */
  h3?: Maybe<H3>;
  /** The ID of the event. */
  id: Scalars['ID']['output'];
  /** The event external identifier. */
  identifier?: Maybe<Scalars['String']['output']>;
  /** If the event is accessible for free. */
  isAccessibleForFree?: Maybe<Scalars['Boolean']['output']>;
  /** The extracted hyperlinks. */
  links?: Maybe<Array<Maybe<LinkReference>>>;
  /** The geo-location of the event. */
  location?: Maybe<Point>;
  /** The event maximum price. */
  maxPrice?: Maybe<Scalars['Decimal']['output']>;
  /** The event minimum price. */
  minPrice?: Maybe<Scalars['Decimal']['output']>;
  /** The modified date of the event. */
  modifiedDate?: Maybe<Scalars['DateTime']['output']>;
  /** The name of the event. */
  name: Scalars['String']['output'];
  /** The event price. */
  price?: Maybe<Scalars['Decimal']['output']>;
  /** The currency of the event price. */
  priceCurrency?: Maybe<Scalars['String']['output']>;
  /** The relevance score of the event. */
  relevance?: Maybe<Scalars['Float']['output']>;
  /** The event start date. */
  startDate?: Maybe<Scalars['DateTime']['output']>;
  /** The state of the event (i.e. created, enabled). */
  state: EntityState;
  /** The JSON-LD value of the event. */
  thing?: Maybe<Scalars['String']['output']>;
  /** The event typical age range. */
  typicalAgeRange?: Maybe<Scalars['String']['output']>;
  /** The event URI. */
  uri?: Maybe<Scalars['URL']['output']>;
};

/** Represents a event facet. */
export type EventFacet = {
  __typename?: 'EventFacet';
  /** The facet count. */
  count?: Maybe<Scalars['Long']['output']>;
  /** The event facet type. */
  facet?: Maybe<EventFacetTypes>;
  /** The facet value range. */
  range?: Maybe<StringRange>;
  /** The facet value type. */
  type?: Maybe<FacetValueTypes>;
  /** The facet value. */
  value?: Maybe<Scalars['String']['output']>;
};

/** Represents the configuration for event facets. */
export type EventFacetInput = {
  /** The event facet type. */
  facet?: InputMaybe<EventFacetTypes>;
  /** The facet time interval. */
  timeInterval?: InputMaybe<TimeIntervalTypes>;
  /** The facet time offset (in hours). */
  timeOffset?: InputMaybe<Scalars['Int']['input']>;
};

/** Event facet types */
export enum EventFacetTypes {
  /** Creation Date */
  CreationDate = 'CREATION_DATE'
}

/** Represents a filter for events. */
export type EventFilter = {
  /** Filter by observable physical address. */
  address?: InputMaybe<AddressFilter>;
  /** Filter by event availability end date range. */
  availabilityEndDateRange?: InputMaybe<DateRangeFilter>;
  /** Filter by event availability start date range. */
  availabilityStartDateRange?: InputMaybe<DateRangeFilter>;
  /** Filter by observable geo-boundaries, as GeoJSON Feature with Polygon geometry. */
  boundaries?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Filter by creation date recent timespan. For example, a timespan of one day will return event(s) created in the last 24 hours. */
  createdInLast?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** Filter event(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter by event end date range. */
  endDateRange?: InputMaybe<DateRangeFilter>;
  /** Filter by observable H3 index. */
  h3?: InputMaybe<H3Filter>;
  /** Filter event(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Filter by if the event is accessible for free. */
  isAccessibleForFree?: InputMaybe<Scalars['Boolean']['input']>;
  /** Limit the number of event(s) to be returned. Defaults to 100. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter by observable geo-location. */
  location?: InputMaybe<PointFilter>;
  /** Filter by the event maximum price. */
  maxPrice?: InputMaybe<Scalars['Decimal']['input']>;
  /** Filter by the event minimum price. */
  minPrice?: InputMaybe<Scalars['Decimal']['input']>;
  /** Filter event(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** When using similarity search, the number of similar items to be returned. Defaults to 100. */
  numberSimilar?: InputMaybe<Scalars['Int']['input']>;
  /** Skip the specified number of event(s) from the beginning of the result set. Only supported on keyword search. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** Filter by the event price. */
  price?: InputMaybe<Scalars['Decimal']['input']>;
  /** Filter by the currency of the event price. */
  priceCurrency?: InputMaybe<Scalars['String']['input']>;
  /** The query syntax for the search text. Defaults to Simple. */
  queryType?: InputMaybe<SearchQueryTypes>;
  /** Filter event(s) by searching for similar text. */
  search?: InputMaybe<Scalars['String']['input']>;
  /** The type of search to be used. Defaults to Vector. */
  searchType?: InputMaybe<SearchTypes>;
  /** Filter by similar events. */
  similarEvents?: InputMaybe<Array<EntityReferenceFilter>>;
  /** Filter by event start date range. */
  startDateRange?: InputMaybe<DateRangeFilter>;
  /** Filter event(s) by their states. */
  states?: InputMaybe<Array<EntityState>>;
  /** Filter by the event typical age range. */
  typicalAgeRange?: InputMaybe<Scalars['String']['input']>;
};

/** Represents an event. */
export type EventInput = {
  /** The physical address of the event. */
  address?: InputMaybe<AddressInput>;
  /** The event availability end date. */
  availabilityEndDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** The event availability start date. */
  availabilityStartDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** The event geo-boundary, as GeoJSON Feature with Polygon geometry. */
  boundary?: InputMaybe<Scalars['String']['input']>;
  /** The event description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The event end date. */
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** The event external identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** If the event is accessible for free. */
  isAccessibleForFree?: InputMaybe<Scalars['Boolean']['input']>;
  /** The event geo-location. */
  location?: InputMaybe<PointInput>;
  /** The event maximum price. */
  maxPrice?: InputMaybe<Scalars['Decimal']['input']>;
  /** The event minimum price. */
  minPrice?: InputMaybe<Scalars['Decimal']['input']>;
  /** The name of the event. */
  name: Scalars['String']['input'];
  /** The event price. */
  price?: InputMaybe<Scalars['Decimal']['input']>;
  /** The currency of the event price. */
  priceCurrency?: InputMaybe<Scalars['String']['input']>;
  /** The event start date. */
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** The event typical age range. */
  typicalAgeRange?: InputMaybe<Scalars['String']['input']>;
  /** The event URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents event query results. */
export type EventResults = {
  __typename?: 'EventResults';
  /** The event facets. */
  facets?: Maybe<Array<Maybe<EventFacet>>>;
  /** The event H3 facets. */
  h3?: Maybe<H3Facets>;
  /** The event results. */
  results?: Maybe<Array<Maybe<Event>>>;
};

/** Represents an event. */
export type EventUpdateInput = {
  /** The physical address of the event. */
  address?: InputMaybe<AddressInput>;
  /** The event availability end date. */
  availabilityEndDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** The event availability start date. */
  availabilityStartDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** The event geo-boundary, as GeoJSON Feature with Polygon geometry. */
  boundary?: InputMaybe<Scalars['String']['input']>;
  /** The event description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The event end date. */
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** The ID of the event to update. */
  id: Scalars['ID']['input'];
  /** The event external identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** If the event is accessible for free. */
  isAccessibleForFree?: InputMaybe<Scalars['Boolean']['input']>;
  /** The event geo-location. */
  location?: InputMaybe<PointInput>;
  /** The event maximum price. */
  maxPrice?: InputMaybe<Scalars['Decimal']['input']>;
  /** The event minimum price. */
  minPrice?: InputMaybe<Scalars['Decimal']['input']>;
  /** The name of the event. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The event price. */
  price?: InputMaybe<Scalars['Decimal']['input']>;
  /** The currency of the event price. */
  priceCurrency?: InputMaybe<Scalars['String']['input']>;
  /** The event start date. */
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** The event typical age range. */
  typicalAgeRange?: InputMaybe<Scalars['String']['input']>;
  /** The event URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents an prompted LLM data extraction. */
export type ExtractCompletion = {
  __typename?: 'ExtractCompletion';
  /** The content from which data was extracted, optional. */
  content?: Maybe<EntityReference>;
  /** The end time of the audio transcript segment, when extracting from audio content. */
  endTime?: Maybe<Scalars['TimeSpan']['output']>;
  /** If data extraction failed, the error message. */
  error?: Maybe<Scalars['String']['output']>;
  /** The name of the called tool. */
  name: Scalars['String']['output'];
  /** The page index of the text document, when extracting from document content. */
  pageNumber?: Maybe<Scalars['Int']['output']>;
  /** The LLM specification used for data extraction, optional. */
  specification?: Maybe<EntityReference>;
  /** The start time of the audio transcript segment, when extracting from audio content. */
  startTime?: Maybe<Scalars['TimeSpan']['output']>;
  /** The extracted JSON value from the called tool. */
  value: Scalars['String']['output'];
};

/** Represents an extraction workflow job. */
export type ExtractionWorkflowJob = {
  __typename?: 'ExtractionWorkflowJob';
  /** The entity extraction connector. */
  connector?: Maybe<EntityExtractionConnector>;
};

/** Represents an extraction workflow job. */
export type ExtractionWorkflowJobInput = {
  /** The entity extraction connector. */
  connector?: InputMaybe<EntityExtractionConnectorInput>;
};

/** Represents the extraction workflow stage. */
export type ExtractionWorkflowStage = {
  __typename?: 'ExtractionWorkflowStage';
  /** The jobs for the extraction workflow stage. */
  jobs?: Maybe<Array<Maybe<ExtractionWorkflowJob>>>;
};

/** Represents the extraction workflow stage. */
export type ExtractionWorkflowStageInput = {
  /** The jobs for the extraction workflow stage. */
  jobs?: InputMaybe<Array<InputMaybe<ExtractionWorkflowJobInput>>>;
};

/** Represents an FHIR entity enrichment connector. */
export type FhirEnrichmentProperties = {
  __typename?: 'FHIREnrichmentProperties';
  /** The FHIR API endpoint. */
  endpoint?: Maybe<Scalars['URL']['output']>;
};

/** Represents an FHIR entity enrichment connector. */
export type FhirEnrichmentPropertiesInput = {
  /** The FHIR API endpoint. */
  endpoint?: InputMaybe<Scalars['URL']['input']>;
};

/** Facet value types */
export enum FacetValueTypes {
  /** Facet by object */
  Object = 'OBJECT',
  /** Facet by range */
  Range = 'RANGE',
  /** Facet by value */
  Value = 'VALUE'
}

/** Represents a feed. */
export type Feed = {
  __typename?: 'Feed';
  /** The contents sourced from the feed. */
  contents?: Maybe<Array<Maybe<Content>>>;
  /** The tenant correlation identifier. */
  correlationId?: Maybe<Scalars['String']['output']>;
  /** The creation date of the feed. */
  creationDate: Scalars['DateTime']['output'];
  /** The feed description. */
  description?: Maybe<Scalars['String']['output']>;
  /** The Discord feed properties. */
  discord?: Maybe<DiscordFeedProperties>;
  /** The email feed properties. */
  email?: Maybe<EmailFeedProperties>;
  /** If feed failed, the error message. */
  error?: Maybe<Scalars['String']['output']>;
  /** The ID of the feed. */
  id: Scalars['ID']['output'];
  /** The Intercom feed properties. */
  intercom?: Maybe<IntercomFeedProperties>;
  /** The issue feed properties. */
  issue?: Maybe<IssueFeedProperties>;
  /** The date of the last item that was read from the feed. */
  lastPostDate?: Maybe<Scalars['DateTime']['output']>;
  /** The date the feed was last read. */
  lastReadDate?: Maybe<Scalars['DateTime']['output']>;
  /** The Microsoft Teams feed properties. */
  microsoftTeams?: Maybe<MicrosoftTeamsFeedProperties>;
  /** The modified date of the feed. */
  modifiedDate?: Maybe<Scalars['DateTime']['output']>;
  /** The name of the feed. */
  name: Scalars['String']['output'];
  /** The Notion feed properties. */
  notion?: Maybe<NotionFeedProperties>;
  /** The owner of the feed. */
  owner: Owner;
  /** The count of items read from the feed. */
  readCount?: Maybe<Scalars['Int']['output']>;
  /** The Reddit feed properties. */
  reddit?: Maybe<RedditFeedProperties>;
  /** The relevance score of the feed. */
  relevance?: Maybe<Scalars['Float']['output']>;
  /** The RSS feed properties. */
  rss?: Maybe<RssFeedProperties>;
  /** The feed schedule policy. */
  schedulePolicy?: Maybe<FeedSchedulePolicy>;
  /** The web search feed properties. */
  search?: Maybe<SearchFeedProperties>;
  /** The site feed properties. */
  site?: Maybe<SiteFeedProperties>;
  /** The Slack feed properties. */
  slack?: Maybe<SlackFeedProperties>;
  /** The state of the feed (i.e. created, finished). */
  state: EntityState;
  /** The Twitter feed properties. */
  twitter?: Maybe<TwitterFeedProperties>;
  /** The feed type. */
  type: FeedTypes;
  /** The web feed properties. */
  web?: Maybe<WebFeedProperties>;
  workflow?: Maybe<Workflow>;
  /** The YouTube feed properties. */
  youtube?: Maybe<YouTubeFeedProperties>;
  /** The Zendesk feed properties. */
  zendesk?: Maybe<ZendeskFeedProperties>;
};

/** Feed connector type */
export enum FeedConnectorTypes {
  /** Amazon Web Services feed connector */
  Amazon = 'AMAZON',
  /** Atlassian feed connector */
  Atlassian = 'ATLASSIAN',
  /** Microsoft Azure feed connector */
  Azure = 'AZURE',
  /** Box feed connector */
  Box = 'BOX',
  /** Dropbox feed connector */
  Dropbox = 'DROPBOX',
  /** GitHub feed connector */
  GitHub = 'GIT_HUB',
  /** Google Cloud feed connector */
  Google = 'GOOGLE',
  /** Google Drive feed connector */
  GoogleDrive = 'GOOGLE_DRIVE',
  /** Google Mail feed connector */
  GoogleEmail = 'GOOGLE_EMAIL',
  /** Intercom feed connector */
  Intercom = 'INTERCOM',
  /** Linear feed connector */
  Linear = 'LINEAR',
  /** Microsoft Outlook Email feed connector */
  MicrosoftEmail = 'MICROSOFT_EMAIL',
  /** Microsoft OneDrive feed connector */
  OneDrive = 'ONE_DRIVE',
  /** Microsoft SharePoint feed connector */
  SharePoint = 'SHARE_POINT',
  /** Zendesk feed connector */
  Zendesk = 'ZENDESK'
}

/** Represents a filter for feeds. */
export type FeedFilter = {
  /** Filter by creation date recent timespan. For example, a timespan of one day will return feed(s) created in the last 24 hours. */
  createdInLast?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** Filter feed(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter feed(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of feed(s) to be returned. Defaults to 100. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter feed(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Skip the specified number of feed(s) from the beginning of the result set. Only supported on keyword search. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** Filter feed(s) by searching for similar text. */
  search?: InputMaybe<Scalars['String']['input']>;
  /** Filter feed(s) by their states. */
  states?: InputMaybe<Array<EntityState>>;
  /** Filter by feed types. */
  types?: InputMaybe<Array<InputMaybe<FeedTypes>>>;
};

/** Represents a feed. */
export type FeedInput = {
  /** The feed description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The Discord feed properties. */
  discord?: InputMaybe<DiscordFeedPropertiesInput>;
  /** The email feed properties. */
  email?: InputMaybe<EmailFeedPropertiesInput>;
  /** The Intercom feed properties. */
  intercom?: InputMaybe<IntercomFeedPropertiesInput>;
  /** The issue feed properties. */
  issue?: InputMaybe<IssueFeedPropertiesInput>;
  /** The Microsoft Teams feed properties. */
  microsoftTeams?: InputMaybe<MicrosoftTeamsFeedPropertiesInput>;
  /** The name of the feed. */
  name: Scalars['String']['input'];
  /** The Notion feed properties. */
  notion?: InputMaybe<NotionFeedPropertiesInput>;
  /** The Reddit feed properties. */
  reddit?: InputMaybe<RedditFeedPropertiesInput>;
  /** The RSS feed properties. */
  rss?: InputMaybe<RssFeedPropertiesInput>;
  /** The feed schedule policy. */
  schedulePolicy?: InputMaybe<FeedSchedulePolicyInput>;
  /** The web search feed properties. */
  search?: InputMaybe<SearchFeedPropertiesInput>;
  /** The site feed properties. */
  site?: InputMaybe<SiteFeedPropertiesInput>;
  /** The Slack feed properties. */
  slack?: InputMaybe<SlackFeedPropertiesInput>;
  /** The Twitter feed properties. */
  twitter?: InputMaybe<TwitterFeedPropertiesInput>;
  /** The feed type. */
  type: FeedTypes;
  /** The web feed properties. */
  web?: InputMaybe<WebFeedPropertiesInput>;
  /** The content workflow applied to the feed. */
  workflow?: InputMaybe<EntityReferenceInput>;
  /** The YouTube feed properties. */
  youtube?: InputMaybe<YouTubeFeedPropertiesInput>;
  /** The Zendesk feed properties. */
  zendesk?: InputMaybe<ZendeskFeedPropertiesInput>;
};

/** Feed list type */
export enum FeedListingTypes {
  /** Read new items */
  New = 'NEW',
  /** Read past items */
  Past = 'PAST'
}

/** Represents feed query results. */
export type FeedResults = {
  __typename?: 'FeedResults';
  /** The list of feed query results. */
  results?: Maybe<Array<Maybe<Feed>>>;
};

/** Represents a feed schedule policy. */
export type FeedSchedulePolicy = {
  __typename?: 'FeedSchedulePolicy';
  /** The feed recurrence type. */
  recurrenceType?: Maybe<TimedPolicyRecurrenceTypes>;
  /** If a repeated feed, the interval between repetitions. Defaults to 15 minutes. */
  repeatInterval?: Maybe<Scalars['TimeSpan']['output']>;
};

/** Represents a feed schedule policy. */
export type FeedSchedulePolicyInput = {
  /** The feed recurrence type. */
  recurrenceType: TimedPolicyRecurrenceTypes;
  /** If a repeated feed, the interval between repetitions. Defaults to 15 minutes. */
  repeatInterval?: InputMaybe<Scalars['TimeSpan']['input']>;
};

/** Feed service type */
export enum FeedServiceTypes {
  /** Atlassian Jira feed service */
  AtlassianJira = 'ATLASSIAN_JIRA',
  /** Azure Blob feed service */
  AzureBlob = 'AZURE_BLOB',
  /** Azure File feed service */
  AzureFile = 'AZURE_FILE',
  /** Box feed service */
  Box = 'BOX',
  /** Dropbox feed service */
  Dropbox = 'DROPBOX',
  /** GitHub feed service */
  GitHub = 'GIT_HUB',
  /** GitHub Issues feed service */
  GitHubIssues = 'GIT_HUB_ISSUES',
  /** Google Cloud Blob feed service */
  GoogleBlob = 'GOOGLE_BLOB',
  /** Google Drive feed service */
  GoogleDrive = 'GOOGLE_DRIVE',
  /** Google Mail feed service */
  GoogleEmail = 'GOOGLE_EMAIL',
  /** Intercom Articles feed service */
  IntercomArticles = 'INTERCOM_ARTICLES',
  /** Intercom Tickets feed service */
  IntercomTickets = 'INTERCOM_TICKETS',
  /** Linear feed service */
  Linear = 'LINEAR',
  /** Microsoft Outlook Email feed service */
  MicrosoftEmail = 'MICROSOFT_EMAIL',
  /** Microsoft OneDrive feed service */
  OneDrive = 'ONE_DRIVE',
  /** AWS S3 Blob feed service */
  S3Blob = 'S3_BLOB',
  /** Microsoft SharePoint feed service */
  SharePoint = 'SHARE_POINT',
  /** Trello feed service */
  Trello = 'TRELLO',
  /** Zendesk Articles feed service */
  ZendeskArticles = 'ZENDESK_ARTICLES',
  /** Zendesk Tickets feed service */
  ZendeskTickets = 'ZENDESK_TICKETS'
}

/** Feed type */
export enum FeedTypes {
  /** Discord channel feed */
  Discord = 'DISCORD',
  /** Email feed */
  Email = 'EMAIL',
  /** Intercom articles feed */
  Intercom = 'INTERCOM',
  /** Issue feed */
  Issue = 'ISSUE',
  /** Microsoft Teams channel feed */
  MicrosoftTeams = 'MICROSOFT_TEAMS',
  /** Notion feed */
  Notion = 'NOTION',
  /** Reddit feed */
  Reddit = 'REDDIT',
  /** RSS feed */
  Rss = 'RSS',
  /** Web Search feed */
  Search = 'SEARCH',
  /** Cloud storage site feed */
  Site = 'SITE',
  /** Slack channel feed */
  Slack = 'SLACK',
  /** Twitter/X feed */
  Twitter = 'TWITTER',
  /** Web feed */
  Web = 'WEB',
  /** YouTube audio feed */
  YouTube = 'YOU_TUBE',
  /** Zendesk articles feed */
  Zendesk = 'ZENDESK'
}

/** Represents a feed. */
export type FeedUpdateInput = {
  /** The feed description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The Discord feed properties. */
  discord?: InputMaybe<DiscordFeedPropertiesUpdateInput>;
  /** The email feed properties. */
  email?: InputMaybe<EmailFeedPropertiesUpdateInput>;
  /** The ID of the feed to update. */
  id: Scalars['ID']['input'];
  /** The Intercom feed properties. */
  intercom?: InputMaybe<IntercomFeedPropertiesUpdateInput>;
  /** The issue feed properties. */
  issue?: InputMaybe<IssueFeedPropertiesUpdateInput>;
  /** The Microsoft Teams feed properties. */
  microsoftTeams?: InputMaybe<MicrosoftTeamsFeedPropertiesUpdateInput>;
  /** The name of the feed. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The Notion feed properties. */
  notion?: InputMaybe<NotionFeedPropertiesUpdateInput>;
  /** The Reddit feed properties. */
  reddit?: InputMaybe<RedditFeedPropertiesUpdateInput>;
  /** The RSS feed properties. */
  rss?: InputMaybe<RssFeedPropertiesUpdateInput>;
  /** The feed schedule policy. */
  schedulePolicy?: InputMaybe<FeedSchedulePolicyInput>;
  /** The web search feed properties. */
  search?: InputMaybe<SearchFeedPropertiesUpdateInput>;
  /** The site feed properties. */
  site?: InputMaybe<SiteFeedPropertiesUpdateInput>;
  /** The Slack feed properties. */
  slack?: InputMaybe<SlackFeedPropertiesUpdateInput>;
  /** The Twitter feed properties. */
  twitter?: InputMaybe<TwitterFeedPropertiesUpdateInput>;
  /** The feed type. */
  type?: InputMaybe<FeedTypes>;
  /** The web feed properties. */
  web?: InputMaybe<WebFeedPropertiesUpdateInput>;
  /** The content workflow applied to the feed. */
  workflow?: InputMaybe<EntityReferenceInput>;
  /** The YouTube feed properties. */
  youtube?: InputMaybe<YouTubeFeedPropertiesUpdateInput>;
  /** The Zendesk feed properties. */
  zendesk?: InputMaybe<ZendeskFeedPropertiesUpdateInput>;
};

/** Represents a file preparation connector. */
export type FilePreparationConnector = {
  __typename?: 'FilePreparationConnector';
  /** The specific properties for Assembly.AI preparation. */
  assemblyAI?: Maybe<AssemblyAiAudioPreparationProperties>;
  /** The specific properties for Azure Document Intelligence preparation. */
  azureDocument?: Maybe<AzureDocumentPreparationProperties>;
  /** The specific properties for Deepgram preparation. */
  deepgram?: Maybe<DeepgramAudioPreparationProperties>;
  /** The specific properties for document preparation. */
  document?: Maybe<DocumentPreparationProperties>;
  /** The specific properties for email preparation. */
  email?: Maybe<EmailPreparationProperties>;
  /** The file types to be prepared. */
  fileTypes?: Maybe<Array<FileTypes>>;
  /** The specific properties for Mistral document preparation. */
  mistral?: Maybe<MistralDocumentPreparationProperties>;
  /** The specific properties for LLM document preparation. */
  modelDocument?: Maybe<ModelDocumentPreparationProperties>;
  /** The file preparation service type. */
  type: FilePreparationServiceTypes;
};

/** Represents a file preparation connector. */
export type FilePreparationConnectorInput = {
  /** The specific properties for Assembly.AI preparation. */
  assemblyAI?: InputMaybe<AssemblyAiAudioPreparationPropertiesInput>;
  /** The specific properties for Azure Document Intelligence preparation. */
  azureDocument?: InputMaybe<AzureDocumentPreparationPropertiesInput>;
  /** The specific properties for Deepgram preparation. */
  deepgram?: InputMaybe<DeepgramAudioPreparationPropertiesInput>;
  /** The specific properties for document preparation. */
  document?: InputMaybe<DocumentPreparationPropertiesInput>;
  /** The specific properties for email preparation. */
  email?: InputMaybe<EmailPreparationPropertiesInput>;
  /** The file types to be prepared. */
  fileTypes?: InputMaybe<Array<FileTypes>>;
  /** The specific properties for Mistral document preparation. */
  mistral?: InputMaybe<MistralDocumentPreparationPropertiesInput>;
  /** The specific properties for LLM document preparation. */
  modelDocument?: InputMaybe<ModelDocumentPreparationPropertiesInput>;
  /** The file preparation service type. */
  type: FilePreparationServiceTypes;
};

/** File preparation service type */
export enum FilePreparationServiceTypes {
  /** Assembly.AI Audio Transcription */
  AssemblyAi = 'ASSEMBLY_AI',
  /** Azure AI Document Intelligence */
  AzureDocumentIntelligence = 'AZURE_DOCUMENT_INTELLIGENCE',
  /** Deepgram Audio Transcription */
  Deepgram = 'DEEPGRAM',
  /** Document Preparation */
  Document = 'DOCUMENT',
  /** Email Preparation */
  Email = 'EMAIL',
  /** Mistral OCR Document Preparation */
  MistralDocument = 'MISTRAL_DOCUMENT',
  /** LLM Document Preparation */
  ModelDocument = 'MODEL_DOCUMENT'
}

/** File type */
export enum FileTypes {
  /** Animation file */
  Animation = 'ANIMATION',
  /** Audio file */
  Audio = 'AUDIO',
  /** Code file */
  Code = 'CODE',
  /** Data file */
  Data = 'DATA',
  /** Document file */
  Document = 'DOCUMENT',
  /** Drawing file */
  Drawing = 'DRAWING',
  /** Email file */
  Email = 'EMAIL',
  /** Geometry file */
  Geometry = 'GEOMETRY',
  /** Image file */
  Image = 'IMAGE',
  /** HLS/MPEG-DASH manifest file */
  Manifest = 'MANIFEST',
  /** Package file */
  Package = 'PACKAGE',
  /** Point Cloud file */
  PointCloud = 'POINT_CLOUD',
  /** Shape file */
  Shape = 'SHAPE',
  /** Unknown file */
  Unknown = 'UNKNOWN',
  /** Video file */
  Video = 'VIDEO'
}

/** Represents geometry metadata. */
export type GeometryMetadata = {
  __typename?: 'GeometryMetadata';
  /** The geometry triangle count. */
  triangleCount?: Maybe<Scalars['Long']['output']>;
  /** The geometry vertex count. */
  vertexCount?: Maybe<Scalars['Long']['output']>;
};

/** Represents geometry metadata. */
export type GeometryMetadataInput = {
  /** The metadata creation date. */
  creationDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** The metadata geo-location. */
  location?: InputMaybe<PointInput>;
  /** The metadata modified date. */
  modifiedDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** The geometry triangle count. */
  triangleCount?: InputMaybe<Scalars['Long']['input']>;
  /** The geometry vertex count. */
  vertexCount?: InputMaybe<Scalars['Long']['input']>;
};

/** Represents GitHub properties. */
export type GitHubFeedProperties = {
  __typename?: 'GitHubFeedProperties';
  /** GitHub personal access token. Either refresh token or personal access token is required to avoid GitHub rate-limiting. */
  personalAccessToken?: Maybe<Scalars['String']['output']>;
  /** GitHub refresh token. Either refresh token or personal access token is required to avoid GitHub rate-limiting. */
  refreshToken?: Maybe<Scalars['String']['output']>;
  /** GitHub repository name. */
  repositoryName: Scalars['String']['output'];
  /** GitHub repository owner. */
  repositoryOwner: Scalars['String']['output'];
  /** GitHub Enterprise URI, optional. */
  uri?: Maybe<Scalars['URL']['output']>;
};

/** Represents GitHub properties. */
export type GitHubFeedPropertiesInput = {
  /** GitHub personal access token. Either refresh token or personal access token is required to avoid GitHub rate-limiting. */
  personalAccessToken?: InputMaybe<Scalars['String']['input']>;
  /** GitHub refresh token. Either refresh token or personal access token is required to avoid GitHub rate-limiting. */
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  /** GitHub repository name. */
  repositoryName: Scalars['String']['input'];
  /** GitHub repository owner. */
  repositoryOwner: Scalars['String']['input'];
  /** GitHub Enterprise URI, optional. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents GitHub properties. */
export type GitHubFeedPropertiesUpdateInput = {
  /** GitHub personal access token. Either refresh token or personal access token is required to avoid GitHub rate-limiting. */
  personalAccessToken?: InputMaybe<Scalars['String']['input']>;
  /** GitHub refresh token. Either refresh token or personal access token is required to avoid GitHub rate-limiting. */
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  /** GitHub repository name. */
  repositoryName?: InputMaybe<Scalars['String']['input']>;
  /** GitHub repository owner. */
  repositoryOwner?: InputMaybe<Scalars['String']['input']>;
  /** GitHub Enterprise URI, optional. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents GitHub Issues feed properties. */
export type GitHubIssuesFeedProperties = {
  __typename?: 'GitHubIssuesFeedProperties';
  /** GitHub personal access token. Either refresh token or personal access token is required to avoid GitHub rate-limiting. */
  personalAccessToken?: Maybe<Scalars['String']['output']>;
  /** GitHub refresh token. Either refresh token or personal access token is required to avoid GitHub rate-limiting. */
  refreshToken?: Maybe<Scalars['String']['output']>;
  /** GitHub repository name. */
  repositoryName: Scalars['String']['output'];
  /** GitHub repository owner. */
  repositoryOwner: Scalars['String']['output'];
  /** GitHub Enterprise URI, optional. */
  uri?: Maybe<Scalars['URL']['output']>;
};

/** Represents GitHub Issues feed properties. */
export type GitHubIssuesFeedPropertiesInput = {
  /** GitHub personal access token. Either refresh token or personal access token is required to avoid GitHub rate-limiting. */
  personalAccessToken?: InputMaybe<Scalars['String']['input']>;
  /** GitHub refresh token. Either refresh token or personal access token is required to avoid GitHub rate-limiting. */
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  /** GitHub repository name. */
  repositoryName: Scalars['String']['input'];
  /** GitHub repository owner. */
  repositoryOwner: Scalars['String']['input'];
  /** GitHub Enterprise URI, optional. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents GitHub Issues feed properties. */
export type GitHubIssuesFeedPropertiesUpdateInput = {
  /** GitHub personal access token. Either refresh token or personal access token is required to avoid GitHub rate-limiting. */
  personalAccessToken?: InputMaybe<Scalars['String']['input']>;
  /** GitHub refresh token. Either refresh token or personal access token is required to avoid GitHub rate-limiting. */
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  /** GitHub repository name. */
  repositoryName?: InputMaybe<Scalars['String']['input']>;
  /** GitHub repository owner. */
  repositoryOwner?: InputMaybe<Scalars['String']['input']>;
  /** GitHub Enterprise URI, optional. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents Google authentication properties. */
export type GoogleAuthenticationProperties = {
  __typename?: 'GoogleAuthenticationProperties';
  /** Google client ID. */
  clientId: Scalars['String']['output'];
  /** Google client secret. */
  clientSecret: Scalars['String']['output'];
};

/** Represents Google authentication properties. */
export type GoogleAuthenticationPropertiesInput = {
  /** Google client ID. */
  clientId: Scalars['String']['input'];
  /** Google client secret. */
  clientSecret: Scalars['String']['input'];
};

export enum GoogleDriveAuthenticationTypes {
  ServiceAccount = 'SERVICE_ACCOUNT',
  User = 'USER'
}

/** Represents Google Drive properties. */
export type GoogleDriveFeedProperties = {
  __typename?: 'GoogleDriveFeedProperties';
  /** Google Drive authentication type, defaults to User. */
  authenticationType?: Maybe<GoogleDriveAuthenticationTypes>;
  /** Google client identifier, requires User authentication type. */
  clientId?: Maybe<Scalars['String']['output']>;
  /** Google client secret, requires User authentication type. */
  clientSecret?: Maybe<Scalars['String']['output']>;
  /** Google Drive file identifiers. Takes precedence over folder identifier. */
  files?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Google Drive folder identifier. */
  folderId?: Maybe<Scalars['String']['output']>;
  /** Google refresh token, requires User authentication type. */
  refreshToken?: Maybe<Scalars['String']['output']>;
  /** The full JSON contents of your Google service account credentials (not a file path), requires ServiceAccount authentication type. */
  serviceAccountJson?: Maybe<Scalars['String']['output']>;
};

/** Represents Google Drive properties. */
export type GoogleDriveFeedPropertiesInput = {
  /** Google Drive authentication type, defaults to User. */
  authenticationType?: InputMaybe<GoogleDriveAuthenticationTypes>;
  /** Google client identifier, requires User authentication type. */
  clientId?: InputMaybe<Scalars['String']['input']>;
  /** Google client secret, requires User authentication type. */
  clientSecret?: InputMaybe<Scalars['String']['input']>;
  /** Google Drive file identifiers. Takes precedence over folder identifier. */
  files?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Google Drive folder identifier. */
  folderId?: InputMaybe<Scalars['String']['input']>;
  /** Google refresh token, requires User authentication type. */
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  /** The full JSON contents of your Google service account credentials (not a file path), requires ServiceAccount authentication type. */
  serviceAccountJson?: InputMaybe<Scalars['String']['input']>;
};

/** Represents Google Drive properties. */
export type GoogleDriveFeedPropertiesUpdateInput = {
  /** Google Drive authentication type, defaults to User. */
  authenticationType?: InputMaybe<GoogleDriveAuthenticationTypes>;
  /** Google client identifier, requires User authentication type. */
  clientId?: InputMaybe<Scalars['String']['input']>;
  /** Google client secret, requires User authentication type. */
  clientSecret?: InputMaybe<Scalars['String']['input']>;
  /** Google Drive file identifiers. Takes precedence over folder identifier. */
  files?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Google Drive folder identifier. */
  folderId?: InputMaybe<Scalars['String']['input']>;
  /** Google refresh token, requires User authentication type. */
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  /** The full JSON contents of your Google service account credentials (not a file path), requires ServiceAccount authentication type. */
  serviceAccountJson?: InputMaybe<Scalars['String']['input']>;
};

/** Represents Google Email feed properties. */
export type GoogleEmailFeedProperties = {
  __typename?: 'GoogleEmailFeedProperties';
  /** Google Email client identifier. */
  clientId: Scalars['String']['output'];
  /** Google Email client secret. */
  clientSecret: Scalars['String']['output'];
  /** Whether to exclude Sent messages in email listing. Default is False. */
  excludeSentItems?: Maybe<Scalars['Boolean']['output']>;
  /** Whether to only read past emails from Inbox. Default is False. */
  inboxOnly?: Maybe<Scalars['Boolean']['output']>;
  /** Whether to include Deleted messages in email listing. Default is False. */
  includeDeletedItems?: Maybe<Scalars['Boolean']['output']>;
  /** Whether to include Spam messages in email listing. Default is False. */
  includeSpam?: Maybe<Scalars['Boolean']['output']>;
  /** Google Email refresh token. */
  refreshToken?: Maybe<Scalars['String']['output']>;
  /** Email listing type, i.e. past or new emails. */
  type?: Maybe<EmailListingTypes>;
};

/** Represents Google Email feed properties. */
export type GoogleEmailFeedPropertiesInput = {
  /** Google client identifier. */
  clientId: Scalars['String']['input'];
  /** Google client secret. */
  clientSecret: Scalars['String']['input'];
  /** Whether to exclude Sent messages in email listing. Default is False. */
  excludeSentItems?: InputMaybe<Scalars['Boolean']['input']>;
  /** Whether to only read past emails from Inbox. Default is False. */
  inboxOnly?: InputMaybe<Scalars['Boolean']['input']>;
  /** Whether to include Deleted messages in email listing. Default is False. */
  includeDeletedItems?: InputMaybe<Scalars['Boolean']['input']>;
  /** Whether to include Spam messages in email listing. Default is False. */
  includeSpam?: InputMaybe<Scalars['Boolean']['input']>;
  /** Google refresh token. */
  refreshToken: Scalars['String']['input'];
  /** Email listing type, i.e. past or new emails. */
  type?: InputMaybe<EmailListingTypes>;
};

/** Represents Google Email feed properties. */
export type GoogleEmailFeedPropertiesUpdateInput = {
  /** Google client identifier. */
  clientId?: InputMaybe<Scalars['String']['input']>;
  /** Google client secret. */
  clientSecret?: InputMaybe<Scalars['String']['input']>;
  /** Whether to exclude Sent messages in email listing. Default is False. */
  excludeSentItems?: InputMaybe<Scalars['Boolean']['input']>;
  /** Whether to only read past emails from Inbox. Default is False. */
  inboxOnly?: InputMaybe<Scalars['Boolean']['input']>;
  /** Whether to include Deleted messages in email listing. Default is False. */
  includeDeletedItems?: InputMaybe<Scalars['Boolean']['input']>;
  /** Whether to include Spam messages in email listing. Default is False. */
  includeSpam?: InputMaybe<Scalars['Boolean']['input']>;
  /** Google refresh token. */
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  /** Email listing type, i.e. past or new emails. */
  type?: InputMaybe<EmailListingTypes>;
};

/** Represents Google blob feed properties. */
export type GoogleFeedProperties = {
  __typename?: 'GoogleFeedProperties';
  /** Google Cloud storage container name. */
  containerName?: Maybe<Scalars['String']['output']>;
  /** Google Cloud credentials, in JSON format. */
  credentials?: Maybe<Scalars['String']['output']>;
  /** Google Cloud storage container prefix. */
  prefix?: Maybe<Scalars['String']['output']>;
};

/** Represents Google blob feed properties. */
export type GoogleFeedPropertiesInput = {
  /** Google Cloud storage container name. */
  containerName: Scalars['String']['input'];
  /** Google Cloud credentials, in JSON format. */
  credentials: Scalars['String']['input'];
  /** Google Cloud storage container prefix. */
  prefix?: InputMaybe<Scalars['String']['input']>;
};

/** Represents Google blob feed properties. */
export type GoogleFeedPropertiesUpdateInput = {
  /** Google Cloud storage container name. */
  containerName?: InputMaybe<Scalars['String']['input']>;
  /** Google Cloud credentials, in JSON format. */
  credentials?: InputMaybe<Scalars['String']['input']>;
  /** Google Cloud storage container prefix. */
  prefix?: InputMaybe<Scalars['String']['input']>;
};

/** Represents Google model properties. */
export type GoogleModelProperties = {
  __typename?: 'GoogleModelProperties';
  /** The limit of tokens per embedded text chunk, defaults to 600. */
  chunkTokenLimit?: Maybe<Scalars['Int']['output']>;
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: Maybe<Scalars['Int']['output']>;
  /** Whether Gemini's extended thinking is enabled. Applies to Gemini Flash 2.5 or higher. */
  enableThinking?: Maybe<Scalars['Boolean']['output']>;
  /** The Google API key, if using developer's own account. */
  key?: Maybe<Scalars['String']['output']>;
  /** The Google model, or custom, when using developer's own account. */
  model: GoogleModels;
  /** The Google model name, if using developer's own account. */
  modelName?: Maybe<Scalars['String']['output']>;
  /** The model token probability. */
  probability?: Maybe<Scalars['Float']['output']>;
  /** The model temperature. */
  temperature?: Maybe<Scalars['Float']['output']>;
  /** The limit of thinking tokens allowed for Gemini's internal reasoning process. */
  thinkingTokenLimit?: Maybe<Scalars['Int']['output']>;
  /** The number of tokens which can provided to the Google model, if using developer's own account. */
  tokenLimit?: Maybe<Scalars['Int']['output']>;
};

/** Represents Google model properties. */
export type GoogleModelPropertiesInput = {
  /** The limit of tokens per embedded text chunk, defaults to 600. */
  chunkTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** Whether Gemini's extended thinking is enabled. Applies to Gemini Flash 2.5 or higher. */
  enableThinking?: InputMaybe<Scalars['Boolean']['input']>;
  /** The Google API key, if using developer's own account. */
  key?: InputMaybe<Scalars['String']['input']>;
  /** The Google model, or custom, when using developer's own account. */
  model: GoogleModels;
  /** The Google model name, if using developer's own account. */
  modelName?: InputMaybe<Scalars['String']['input']>;
  /** The model token probability. */
  probability?: InputMaybe<Scalars['Float']['input']>;
  /** The model temperature. */
  temperature?: InputMaybe<Scalars['Float']['input']>;
  /** The limit of thinking tokens allowed for Gemini's internal reasoning process. */
  thinkingTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The number of tokens which can provided to the Google model, if using developer's own account. */
  tokenLimit?: InputMaybe<Scalars['Int']['input']>;
};

/** Represents Google model properties. */
export type GoogleModelPropertiesUpdateInput = {
  /** The limit of tokens per embedded text chunk, defaults to 600. */
  chunkTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** Whether Gemini's extended thinking is enabled. Applies to Gemini Flash 2.5 or higher. */
  enableThinking?: InputMaybe<Scalars['Boolean']['input']>;
  /** The Google API key, if using developer's own account. */
  key?: InputMaybe<Scalars['String']['input']>;
  /** The Google model, or custom, when using developer's own account. */
  model?: InputMaybe<GoogleModels>;
  /** The Google model name, if using developer's own account. */
  modelName?: InputMaybe<Scalars['String']['input']>;
  /** The model token probability. */
  probability?: InputMaybe<Scalars['Float']['input']>;
  /** The model temperature. */
  temperature?: InputMaybe<Scalars['Float']['input']>;
  /** The limit of thinking tokens allowed for Gemini's internal reasoning process. */
  thinkingTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The number of tokens which can provided to the Google model, if using developer's own account. */
  tokenLimit?: InputMaybe<Scalars['Int']['input']>;
};

/** Google model type */
export enum GoogleModels {
  /** Developer-specified model */
  Custom = 'CUSTOM',
  /** Embed (004 version) */
  Embedding_004 = 'EMBEDDING_004',
  /** Gemini 1.5 Flash (Latest) */
  Gemini_1_5Flash = 'GEMINI_1_5_FLASH',
  /** Gemini 1.5 Flash (001 version) */
  Gemini_1_5Flash_001 = 'GEMINI_1_5_FLASH_001',
  /** Gemini 1.5 Flash (002 version) */
  Gemini_1_5Flash_002 = 'GEMINI_1_5_FLASH_002',
  /** Gemini 1.5 Flash 8b (Latest) */
  Gemini_1_5Flash_8B = 'GEMINI_1_5_FLASH_8B',
  /** Gemini 1.5 Flash 8b (001 version) */
  Gemini_1_5Flash_8B_001 = 'GEMINI_1_5_FLASH_8B_001',
  /** Gemini 1.5 Pro (Latest) */
  Gemini_1_5Pro = 'GEMINI_1_5_PRO',
  /** Gemini 1.5 Pro (001 version) */
  Gemini_1_5Pro_001 = 'GEMINI_1_5_PRO_001',
  /** Gemini 1.5 Pro (002 version) */
  Gemini_1_5Pro_002 = 'GEMINI_1_5_PRO_002',
  /** Gemini 2.0 Flash (Latest) */
  Gemini_2_0Flash = 'GEMINI_2_0_FLASH',
  /** Gemini 2.0 Flash (001 version) */
  Gemini_2_0Flash_001 = 'GEMINI_2_0_FLASH_001',
  /** Gemini 2.0 Flash (Experimental) */
  Gemini_2_0FlashExperimental = 'GEMINI_2_0_FLASH_EXPERIMENTAL',
  /** Gemini 2.0 Flash Thinking (Experimental) */
  Gemini_2_0FlashThinkingExperimental = 'GEMINI_2_0_FLASH_THINKING_EXPERIMENTAL',
  /**
   * Gemini 2.0 Pro (Experimental)
   * @deprecated Use Gemini 2.5 Pro (Experimental) instead.
   */
  Gemini_2_0ProExperimental = 'GEMINI_2_0_PRO_EXPERIMENTAL',
  /** Gemini 2.5 Flash (Preview) */
  Gemini_2_5FlashPreview = 'GEMINI_2_5_FLASH_PREVIEW',
  /** Gemini 2.5 Pro (Experimental) */
  Gemini_2_5ProExperimental = 'GEMINI_2_5_PRO_EXPERIMENTAL',
  /** Gemini 2.5 Pro (Preview) */
  Gemini_2_5ProPreview = 'GEMINI_2_5_PRO_PREVIEW'
}

/** Represents a knowledge graph. */
export type Graph = {
  __typename?: 'Graph';
  /** The knowledge graph edges. */
  edges?: Maybe<Array<Maybe<GraphEdge>>>;
  /** The knowledge graph nodes. */
  nodes?: Maybe<Array<Maybe<GraphNode>>>;
};

/** Represents a knowledge graph edge. */
export type GraphEdge = {
  __typename?: 'GraphEdge';
  /** The source node identifier of the knowledge graph edge. */
  from: Scalars['ID']['output'];
  /** The edge relationship between the nodes, i.e. A 'relates-to' B. */
  relation?: Maybe<Scalars['String']['output']>;
  /** The destination node identifier of the knowledge graph edge. */
  to: Scalars['ID']['output'];
};

/** Represents a knowledge graph node. */
export type GraphNode = {
  __typename?: 'GraphNode';
  /** The knowledge graph node identifier. */
  id: Scalars['ID']['output'];
  /** The knowledge graph node metadata. */
  metadata?: Maybe<Scalars['String']['output']>;
  /** The knowledge graph node name. */
  name: Scalars['String']['output'];
  /** The knowledge graph node type. */
  type: EntityTypes;
};

/** Represents a GraphRAG strategy. */
export type GraphStrategy = {
  __typename?: 'GraphStrategy';
  /** Whether to generate the knowledge graph nodes and edges with the conversation response, defaults to False. */
  generateGraph?: Maybe<Scalars['Boolean']['output']>;
  /** The maximum number of observed entities to provide with prompt context, defaults to 100. */
  observableLimit?: Maybe<Scalars['Int']['output']>;
  /** The GraphRAG strategy type. */
  type: GraphStrategyTypes;
};

/** Represents a GraphRAG strategy. */
export type GraphStrategyInput = {
  /** Whether to generate the knowledge graph nodes and edges with the conversation response, defaults to False. */
  generateGraph?: InputMaybe<Scalars['Boolean']['input']>;
  /** The maximum number of observed entities to provide with prompt context, defaults to 100. */
  observableLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The GraphRAG strategy type. */
  type?: InputMaybe<GraphStrategyTypes>;
};

/** GraphRAG strategies */
export enum GraphStrategyTypes {
  /** Use GraphRAG. Extract named entities from prompt, assign as observations filter */
  ExtractEntitiesFilter = 'EXTRACT_ENTITIES_FILTER',
  /** Use GraphRAG. Extract named entities from prompt, aggregate vector search and graph query results */
  ExtractEntitiesGraph = 'EXTRACT_ENTITIES_GRAPH',
  /** Use standard RAG */
  None = 'NONE'
}

/** Represents a GraphRAG strategy. */
export type GraphStrategyUpdateInput = {
  /** Whether to generate the knowledge graph nodes and edges with the conversation response, defaults to False. */
  generateGraph?: InputMaybe<Scalars['Boolean']['input']>;
  /** The maximum number of observed entities to provide with prompt context, defaults to 100. */
  observableLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The GraphRAG strategy type. */
  type?: InputMaybe<GraphStrategyTypes>;
};

/** Represents Groq model properties. */
export type GroqModelProperties = {
  __typename?: 'GroqModelProperties';
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: Maybe<Scalars['Int']['output']>;
  /** The Groq API endpoint, if using developer's own account. */
  endpoint?: Maybe<Scalars['URL']['output']>;
  /** The Groq API key, if using developer's own account. */
  key?: Maybe<Scalars['String']['output']>;
  /** The Groq model, or custom, when using developer's own account. */
  model: GroqModels;
  /** The Groq model name, if using developer's own account. */
  modelName?: Maybe<Scalars['String']['output']>;
  /** The model token probability. */
  probability?: Maybe<Scalars['Float']['output']>;
  /** The model temperature. */
  temperature?: Maybe<Scalars['Float']['output']>;
  /** The number of tokens which can provided to the Groq model, if using developer's own account. */
  tokenLimit?: Maybe<Scalars['Int']['output']>;
};

/** Represents Groq model properties. */
export type GroqModelPropertiesInput = {
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The Groq API endpoint, if using developer's own account. */
  endpoint?: InputMaybe<Scalars['URL']['input']>;
  /** The Groq API key, if using developer's own account. */
  key?: InputMaybe<Scalars['String']['input']>;
  /** The Groq model, or custom, when using developer's own account. */
  model: GroqModels;
  /** The Groq model name, if using developer's own account. */
  modelName?: InputMaybe<Scalars['String']['input']>;
  /** The model token probability. */
  probability?: InputMaybe<Scalars['Float']['input']>;
  /** The model temperature. */
  temperature?: InputMaybe<Scalars['Float']['input']>;
  /** The number of tokens which can provided to the Groq model, if using developer's own account. */
  tokenLimit?: InputMaybe<Scalars['Int']['input']>;
};

/** Represents Groq model properties. */
export type GroqModelPropertiesUpdateInput = {
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The Groq API endpoint, if using developer's own account. */
  endpoint?: InputMaybe<Scalars['URL']['input']>;
  /** The Groq API key, if using developer's own account. */
  key?: InputMaybe<Scalars['String']['input']>;
  /** The Groq model, or custom, when using developer's own account. */
  model?: InputMaybe<GroqModels>;
  /** The Groq model name, if using developer's own account. */
  modelName?: InputMaybe<Scalars['String']['input']>;
  /** The model token probability. */
  probability?: InputMaybe<Scalars['Float']['input']>;
  /** The model temperature. */
  temperature?: InputMaybe<Scalars['Float']['input']>;
  /** The number of tokens which can provided to the Groq model, if using developer's own account. */
  tokenLimit?: InputMaybe<Scalars['Int']['input']>;
};

/** Groq model type */
export enum GroqModels {
  /** Developer-specified model */
  Custom = 'CUSTOM',
  /** Deepseek R1 Distill Llama 70b Preview */
  DeepseekR1Llama_70BPreview = 'DEEPSEEK_R1_LLAMA_70B_PREVIEW',
  /** LLaMA 3.1 8b */
  Llama_3_1_8B = 'LLAMA_3_1_8B',
  /**
   * LLaMA 3.2 1b Preview
   * @deprecated Use LLaMa 3.3 or newer model
   */
  Llama_3_2_1BPreview = 'LLAMA_3_2_1B_PREVIEW',
  /**
   * LLaMA 3.2 3b Preview
   * @deprecated Use LLaMa 3.3 or newer model
   */
  Llama_3_2_3BPreview = 'LLAMA_3_2_3B_PREVIEW',
  /**
   * LLaMA 3.2 11b Vision Preview
   * @deprecated Use LLaMa 3.3 or newer model
   */
  Llama_3_2_11BVisionPreview = 'LLAMA_3_2_11B_VISION_PREVIEW',
  /**
   * LLaMA 3.2 90b Vision Preview
   * @deprecated Use LLaMa 3.3 or newer model
   */
  Llama_3_2_90BVisionPreview = 'LLAMA_3_2_90B_VISION_PREVIEW',
  /** LLaMA 3.3 70b */
  Llama_3_3_70B = 'LLAMA_3_3_70B',
  /** LLaMA 3 8b */
  Llama_3_8B = 'LLAMA_3_8B',
  /** LLaMA 3 70b */
  Llama_3_70B = 'LLAMA_3_70B',
  /** LLaMA 4 Maverick 17b */
  Llama_4Maverick_17B = 'LLAMA_4_MAVERICK_17B',
  /** LLaMA 4 Scout 17b */
  Llama_4Scout_17B = 'LLAMA_4_SCOUT_17B',
  /** Mixtral 8x7b Instruct */
  Mixtral_8X7BInstruct = 'MIXTRAL_8X7B_INSTRUCT'
}

/** Represents an H3 index. */
export type H3 = {
  __typename?: 'H3';
  /** The H3R0 index value. */
  h3r0?: Maybe<Scalars['String']['output']>;
  /** The H3R1 index value. */
  h3r1?: Maybe<Scalars['String']['output']>;
  /** The H3R2 index value. */
  h3r2?: Maybe<Scalars['String']['output']>;
  /** The H3R3 index value. */
  h3r3?: Maybe<Scalars['String']['output']>;
  /** The H3R4 index value. */
  h3r4?: Maybe<Scalars['String']['output']>;
  /** The H3R5 index value. */
  h3r5?: Maybe<Scalars['String']['output']>;
  /** The H3R6 index value. */
  h3r6?: Maybe<Scalars['String']['output']>;
  /** The H3R7 index value. */
  h3r7?: Maybe<Scalars['String']['output']>;
  /** The H3R8 index value. */
  h3r8?: Maybe<Scalars['String']['output']>;
  /** The H3R9 index value. */
  h3r9?: Maybe<Scalars['String']['output']>;
  /** The H3R10 index value. */
  h3r10?: Maybe<Scalars['String']['output']>;
  /** The H3R11 index value. */
  h3r11?: Maybe<Scalars['String']['output']>;
  /** The H3R12 index value. */
  h3r12?: Maybe<Scalars['String']['output']>;
  /** The H3R13 index value. */
  h3r13?: Maybe<Scalars['String']['output']>;
  /** The H3R14 index value. */
  h3r14?: Maybe<Scalars['String']['output']>;
  /** The H3R15 index value. */
  h3r15?: Maybe<Scalars['String']['output']>;
};

/** Represents an H3 facet. */
export type H3Facet = {
  __typename?: 'H3Facet';
  /** The H3 count. */
  count?: Maybe<Scalars['Long']['output']>;
  /** The date. */
  date?: Maybe<Scalars['DateTime']['output']>;
  /** The H3 key. */
  key?: Maybe<Scalars['String']['output']>;
  /** The H3 resolution. */
  resolution?: Maybe<H3ResolutionTypes>;
  /** The time interval. */
  timeInterval?: Maybe<TimeIntervalTypes>;
};

/** Represents H3 facets. */
export type H3Facets = {
  __typename?: 'H3Facets';
  /** The facet count. */
  count?: Maybe<Scalars['Long']['output']>;
  /** The H3 facets. */
  facets?: Maybe<Array<H3Facet>>;
};

/** Represents an H3 geospatial filter. */
export type H3Filter = {
  /** The H3 indexes. */
  indexes?: InputMaybe<Array<H3IndexFilter>>;
};

/** Represents an H3 geospatial index filter. */
export type H3IndexFilter = {
  /** The H3 key. */
  key?: InputMaybe<Scalars['String']['input']>;
  /** The H3 resolution. */
  resolution?: InputMaybe<H3ResolutionTypes>;
};

/** H3 index resolution types */
export enum H3ResolutionTypes {
  /** H3R0 */
  R0 = 'R0',
  /** H3R1 */
  R1 = 'R1',
  /** H3R2 */
  R2 = 'R2',
  /** H3R3 */
  R3 = 'R3',
  /** H3R4 */
  R4 = 'R4',
  /** H3R5 */
  R5 = 'R5',
  /** H3R6 */
  R6 = 'R6',
  /** H3R7 */
  R7 = 'R7',
  /** H3R8 */
  R8 = 'R8',
  /** H3R9 */
  R9 = 'R9',
  /** H3R10 */
  R10 = 'R10',
  /** H3R11 */
  R11 = 'R11',
  /** H3R12 */
  R12 = 'R12',
  /** H3R13 */
  R13 = 'R13',
  /** H3R14 */
  R14 = 'R14',
  /** H3R15 */
  R15 = 'R15'
}

/** Represents an embedded image in a text page. */
export type ImageChunk = {
  __typename?: 'ImageChunk';
  /** The bottom offset of the image, within the original document, in pixels. */
  bottom?: Maybe<Scalars['Int']['output']>;
  /** The Base64-encoded data of the image. */
  data?: Maybe<Scalars['String']['output']>;
  /** The image identifier, typically the image filename. */
  id?: Maybe<Scalars['String']['output']>;
  /** The left offset of the image, within the original document, in pixels. */
  left?: Maybe<Scalars['Int']['output']>;
  /** The image MIME type. */
  mimeType?: Maybe<Scalars['String']['output']>;
  /** The right offset of the image, within the original document, in pixels. */
  right?: Maybe<Scalars['Int']['output']>;
  /** The top offset of the image, within the original document, in pixels. */
  top?: Maybe<Scalars['Int']['output']>;
};

/** Represents image metadata. */
export type ImageMetadata = {
  __typename?: 'ImageMetadata';
  /** The image bits/component. */
  bitsPerComponent?: Maybe<Scalars['Int']['output']>;
  /** The image device color space. */
  colorSpace?: Maybe<Scalars['String']['output']>;
  /** The number of image components. */
  components?: Maybe<Scalars['Int']['output']>;
  /** The image description. */
  description?: Maybe<Scalars['String']['output']>;
  /** The image device exposure time. */
  exposureTime?: Maybe<Scalars['String']['output']>;
  /** The image device F/number. */
  fNumber?: Maybe<Scalars['String']['output']>;
  /** The image device focal length. */
  focalLength?: Maybe<Scalars['Float']['output']>;
  /** The image device GPS heading. */
  heading?: Maybe<Scalars['Float']['output']>;
  /** The image height. */
  height?: Maybe<Scalars['Int']['output']>;
  /** The image device identifier. */
  identifier?: Maybe<Scalars['String']['output']>;
  /** The image device ISO rating. */
  iso?: Maybe<Scalars['String']['output']>;
  /** The image device lens. */
  lens?: Maybe<Scalars['String']['output']>;
  /** The image device lens specification. */
  lensSpecification?: Maybe<Scalars['String']['output']>;
  /** The image device make. */
  make?: Maybe<Scalars['String']['output']>;
  /** The image device model. */
  model?: Maybe<Scalars['String']['output']>;
  /** The image orientation. */
  orientation?: Maybe<OrientationTypes>;
  /** The image device GPS pitch. */
  pitch?: Maybe<Scalars['Float']['output']>;
  /** The image projection type. */
  projectionType?: Maybe<ImageProjectionTypes>;
  /** The image X resolution. */
  resolutionX?: Maybe<Scalars['Int']['output']>;
  /** The image Y resolution. */
  resolutionY?: Maybe<Scalars['Int']['output']>;
  /** The image device software. */
  software?: Maybe<Scalars['String']['output']>;
  /** The image width. */
  width?: Maybe<Scalars['Int']['output']>;
};

/** Represents image metadata. */
export type ImageMetadataInput = {
  /** The image bits/component. */
  bitsPerComponent?: InputMaybe<Scalars['Int']['input']>;
  /** The image device color space. */
  colorSpace?: InputMaybe<Scalars['String']['input']>;
  /** The number of image components. */
  components?: InputMaybe<Scalars['Int']['input']>;
  /** The metadata creation date. */
  creationDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** The image description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The image device exposure time. */
  exposureTime?: InputMaybe<Scalars['String']['input']>;
  /** The image device F/number. */
  fNumber?: InputMaybe<Scalars['String']['input']>;
  /** The image device focal length. */
  focalLength?: InputMaybe<Scalars['Float']['input']>;
  /** The image device GPS heading. */
  heading?: InputMaybe<Scalars['Float']['input']>;
  /** The image height. */
  height?: InputMaybe<Scalars['Int']['input']>;
  /** The image device identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The image device ISO rating. */
  iso?: InputMaybe<Scalars['String']['input']>;
  /** The image device lens. */
  lens?: InputMaybe<Scalars['String']['input']>;
  /** The image device lens specification. */
  lensSpecification?: InputMaybe<Scalars['String']['input']>;
  /** The metadata geo-location. */
  location?: InputMaybe<PointInput>;
  /** The image device make. */
  make?: InputMaybe<Scalars['String']['input']>;
  /** The image device model. */
  model?: InputMaybe<Scalars['String']['input']>;
  /** The metadata modified date. */
  modifiedDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** The image orientation. */
  orientation?: InputMaybe<OrientationTypes>;
  /** The image device GPS pitch. */
  pitch?: InputMaybe<Scalars['Float']['input']>;
  /** The image projection type. */
  projectionType?: InputMaybe<ImageProjectionTypes>;
  /** The image X resolution. */
  resolutionX?: InputMaybe<Scalars['Int']['input']>;
  /** The image Y resolution. */
  resolutionY?: InputMaybe<Scalars['Int']['input']>;
  /** The image device software. */
  software?: InputMaybe<Scalars['String']['input']>;
  /** The image width. */
  width?: InputMaybe<Scalars['Int']['input']>;
};

/** Image projection types */
export enum ImageProjectionTypes {
  /** Cylindrical image projection */
  Cylindrical = 'CYLINDRICAL',
  /** Equirectangular mage projection */
  Equirectangular = 'EQUIRECTANGULAR'
}

/** Represents a indexing workflow job. */
export type IndexingWorkflowJob = {
  __typename?: 'IndexingWorkflowJob';
  /** The content indexing connector. */
  connector?: Maybe<ContentIndexingConnector>;
};

/** Represents a indexing workflow job. */
export type IndexingWorkflowJobInput = {
  /** The content indexing connector. */
  connector?: InputMaybe<ContentIndexingConnectorInput>;
};

/** Represents the indexing workflow stage. */
export type IndexingWorkflowStage = {
  __typename?: 'IndexingWorkflowStage';
  /** The jobs for the indexing workflow stage. */
  jobs?: Maybe<Array<Maybe<IndexingWorkflowJob>>>;
};

/** Represents the indexing workflow stage. */
export type IndexingWorkflowStageInput = {
  /** The jobs for the indexing workflow stage. */
  jobs?: InputMaybe<Array<InputMaybe<IndexingWorkflowJobInput>>>;
};

/** Represents an ingestion content filter. */
export type IngestionContentFilter = {
  __typename?: 'IngestionContentFilter';
  /** The list of regular expressions for allowed URL paths, i.e. "^/public/blogs/.*". */
  allowedPaths?: Maybe<Array<Scalars['String']['output']>>;
  /** The list of regular expressions for excluded URL paths, i.e. "^/internal/private/.*". */
  excludedPaths?: Maybe<Array<Scalars['String']['output']>>;
  /** Filter by file extensions. */
  fileExtensions?: Maybe<Array<Scalars['String']['output']>>;
  /** Filter by file types. */
  fileTypes?: Maybe<Array<FileTypes>>;
  /** Filter by file formats. */
  formats?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Filter by content types. */
  types?: Maybe<Array<ContentTypes>>;
};

/** Represents an ingestion content filter. */
export type IngestionContentFilterInput = {
  /** The list of regular expressions for allowed URL paths, i.e. "^/public/blogs/.*". */
  allowedPaths?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The list of regular expressions for excluded URL paths, i.e. "^/internal/private/.*". */
  excludedPaths?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Filter by file extensions. */
  fileExtensions?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Filter by file types. */
  fileTypes?: InputMaybe<Array<FileTypes>>;
  /** Filter by file formats. */
  formats?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Filter by content types. */
  types?: InputMaybe<Array<ContentTypes>>;
};

/** Represents the ingestion workflow stage. */
export type IngestionWorkflowStage = {
  __typename?: 'IngestionWorkflowStage';
  /** The collections to be assigned to ingested content. */
  collections?: Maybe<Array<Maybe<EntityReference>>>;
  /** Whether to create collections for every email thread (aka conversation). Disabled by default. */
  enableEmailCollections?: Maybe<Scalars['Boolean']['output']>;
  /** The ingestion filter. */
  if?: Maybe<IngestionContentFilter>;
  /** The observations to be assigned to ingested content. */
  observations?: Maybe<Array<Maybe<ObservationReference>>>;
};

/** Represents the ingestion workflow stage. */
export type IngestionWorkflowStageInput = {
  /** The collections to be assigned to ingested content. */
  collections?: InputMaybe<Array<InputMaybe<EntityReferenceInput>>>;
  /** Whether to create collections for every email thread (aka conversation). Disabled by default. */
  enableEmailCollections?: InputMaybe<Scalars['Boolean']['input']>;
  /** The ingestion filter. */
  if?: InputMaybe<IngestionContentFilterInput>;
  /** The observations to be assigned to ingested content. */
  observations?: InputMaybe<Array<InputMaybe<ObservationReferenceInput>>>;
};

/** Represents a filter by range of long integer values. */
export type Int64RangeFilter = {
  /** Starting value of long integer range. */
  from?: InputMaybe<Scalars['Long']['input']>;
  /** Starting value of long integer range. */
  to?: InputMaybe<Scalars['Long']['input']>;
};

/** Represents an integer result. */
export type IntResult = {
  __typename?: 'IntResult';
  /** The integer result. */
  result?: Maybe<Scalars['Int']['output']>;
};

/** Represents an integration connector. */
export type IntegrationConnector = {
  __typename?: 'IntegrationConnector';
  /** Email integration properties. */
  email?: Maybe<EmailIntegrationProperties>;
  /** Slack integration properties. */
  slack?: Maybe<SlackIntegrationProperties>;
  /** Twitter integration properties. */
  twitter?: Maybe<TwitterIntegrationProperties>;
  /** Integration service type. */
  type: IntegrationServiceTypes;
  /** The URI for the integration, i.e. webhook URI. */
  uri?: Maybe<Scalars['String']['output']>;
};

/** Represents an integration connector. */
export type IntegrationConnectorInput = {
  /** Email integration properties. */
  email?: InputMaybe<EmailIntegrationPropertiesInput>;
  /** Slack integration properties. */
  slack?: InputMaybe<SlackIntegrationPropertiesInput>;
  /** Twitter integration properties. */
  twitter?: InputMaybe<TwitterIntegrationPropertiesInput>;
  /** Integration service type. */
  type: IntegrationServiceTypes;
  /** The URI for the integration, i.e. webhook URI. */
  uri?: InputMaybe<Scalars['String']['input']>;
};

/** Represents an integration connector. */
export type IntegrationConnectorUpdateInput = {
  /** Email integration properties. */
  email?: InputMaybe<EmailIntegrationPropertiesInput>;
  /** Slack integration properties. */
  slack?: InputMaybe<SlackIntegrationPropertiesInput>;
  /** Twitter integration properties. */
  twitter?: InputMaybe<TwitterIntegrationPropertiesInput>;
  /** The URI for the integration, i.e. webhook URI. */
  uri?: InputMaybe<Scalars['String']['input']>;
};

/** Integration service type */
export enum IntegrationServiceTypes {
  /** Email */
  Email = 'EMAIL',
  /** Slack */
  Slack = 'SLACK',
  /** Twitter/X */
  Twitter = 'TWITTER',
  /** HTTP WebHook integration service */
  WebHook = 'WEB_HOOK'
}

/** Represents Intercom feed properties. */
export type IntercomFeedProperties = {
  __typename?: 'IntercomFeedProperties';
  /** Intercom access token. */
  accessToken: Scalars['String']['output'];
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: Maybe<Scalars['Int']['output']>;
};

/** Represents Intercom feed properties. */
export type IntercomFeedPropertiesInput = {
  /** Intercom access token. */
  accessToken: Scalars['String']['input'];
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: InputMaybe<Scalars['Int']['input']>;
};

/** Represents Intercom feed properties. */
export type IntercomFeedPropertiesUpdateInput = {
  /** Intercom access token. */
  accessToken?: InputMaybe<Scalars['String']['input']>;
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: InputMaybe<Scalars['Int']['input']>;
};

/** Represents Intercom Tickets feed properties. */
export type IntercomTicketsFeedProperties = {
  __typename?: 'IntercomTicketsFeedProperties';
  /** Intercom access token. */
  accessToken: Scalars['String']['output'];
};

/** Represents Intercom Tickets feed properties. */
export type IntercomTicketsFeedPropertiesInput = {
  /** Intercom access token. */
  accessToken: Scalars['String']['input'];
};

/** Represents Intercom Tickets feed properties. */
export type IntercomTicketsFeedPropertiesUpdateInput = {
  /** Intercom access token. */
  accessToken?: InputMaybe<Scalars['String']['input']>;
};

/** Represents issue feed properties. */
export type IssueFeedProperties = {
  __typename?: 'IssueFeedProperties';
  /** Feed connector type. */
  connectorType: FeedConnectorTypes;
  /** GitHub Issues properties. */
  github?: Maybe<GitHubIssuesFeedProperties>;
  /** Should the issue feed include attachments. */
  includeAttachments?: Maybe<Scalars['Boolean']['output']>;
  /** Intercom Tickets properties. */
  intercom?: Maybe<IntercomTicketsFeedProperties>;
  /** Atlassian Jira properties. */
  jira?: Maybe<AtlassianJiraFeedProperties>;
  /** Linear properties. */
  linear?: Maybe<LinearFeedProperties>;
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: Maybe<Scalars['Int']['output']>;
  /** Trello properties. */
  trello?: Maybe<TrelloFeedProperties>;
  /** Feed service type. */
  type: FeedServiceTypes;
  /** Zendesk Tickets properties. */
  zendesk?: Maybe<ZendeskTicketsFeedProperties>;
};

/** Represents issue feed properties. */
export type IssueFeedPropertiesInput = {
  /** GitHub Issues properties. */
  github?: InputMaybe<GitHubIssuesFeedPropertiesInput>;
  /** Should the issue feed include attachments. */
  includeAttachments?: InputMaybe<Scalars['Boolean']['input']>;
  /** Intercom Tickets properties. */
  intercom?: InputMaybe<IntercomTicketsFeedPropertiesInput>;
  /** Atlassian Jira properties. */
  jira?: InputMaybe<AtlassianJiraFeedPropertiesInput>;
  /** Linear properties. */
  linear?: InputMaybe<LinearFeedPropertiesInput>;
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: InputMaybe<Scalars['Int']['input']>;
  /** Trello properties. */
  trello?: InputMaybe<TrelloFeedPropertiesInput>;
  /** Feed service type. */
  type: FeedServiceTypes;
  /** Zendesk Tickets properties. */
  zendesk?: InputMaybe<ZendeskTicketsFeedPropertiesInput>;
};

/** Represents issue feed properties. */
export type IssueFeedPropertiesUpdateInput = {
  /** GitHub Issues properties. */
  github?: InputMaybe<GitHubIssuesFeedPropertiesUpdateInput>;
  /** Should the issue feed include attachments. */
  includeAttachments?: InputMaybe<Scalars['Boolean']['input']>;
  /** Intercom Tickets properties. */
  intercom?: InputMaybe<IntercomTicketsFeedPropertiesUpdateInput>;
  /** Atlassian Jira properties. */
  jira?: InputMaybe<AtlassianJiraFeedPropertiesUpdateInput>;
  /** Linear properties. */
  linear?: InputMaybe<LinearFeedPropertiesUpdateInput>;
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: InputMaybe<Scalars['Int']['input']>;
  /** Trello properties. */
  trello?: InputMaybe<TrelloFeedPropertiesUpdateInput>;
  /** Zendesk Tickets properties. */
  zendesk?: InputMaybe<ZendeskTicketsFeedPropertiesUpdateInput>;
};

/** Represents issue metadata. */
export type IssueMetadata = {
  __typename?: 'IssueMetadata';
  /** The issue identifier. */
  identifier?: Maybe<Scalars['String']['output']>;
  /** The issue labels. */
  labels?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The issue hyperlinks. */
  links?: Maybe<Array<Maybe<Scalars['URL']['output']>>>;
  /** The issue priority. */
  priority?: Maybe<Scalars['String']['output']>;
  /** The issue project name. */
  project?: Maybe<Scalars['String']['output']>;
  /** The issue status. */
  status?: Maybe<Scalars['String']['output']>;
  /** The issue team name. */
  team?: Maybe<Scalars['String']['output']>;
  /** The issue title. */
  title?: Maybe<Scalars['String']['output']>;
  /** The issue type, i.e. epic, story, task. */
  type?: Maybe<Scalars['String']['output']>;
};

/** Represents issue metadata. */
export type IssueMetadataInput = {
  /** The metadata creation date. */
  creationDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** The issue identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The issue labels. */
  labels?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** The issue hyperlinks. */
  links?: InputMaybe<Array<InputMaybe<Scalars['URL']['input']>>>;
  /** The metadata geo-location. */
  location?: InputMaybe<PointInput>;
  /** The metadata modified date. */
  modifiedDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** The issue priority. */
  priority?: InputMaybe<Scalars['String']['input']>;
  /** The issue project name. */
  project?: InputMaybe<Scalars['String']['input']>;
  /** The issue status. */
  status?: InputMaybe<Scalars['String']['input']>;
  /** The issue team name. */
  team?: InputMaybe<Scalars['String']['input']>;
  /** The issue title. */
  title?: InputMaybe<Scalars['String']['input']>;
  /** The issue type, i.e. epic, story, task. */
  type?: InputMaybe<Scalars['String']['input']>;
};

/** Represents Jina model properties. */
export type JinaModelProperties = {
  __typename?: 'JinaModelProperties';
  /** The limit of tokens per embedded text chunk, defaults to 600. */
  chunkTokenLimit?: Maybe<Scalars['Int']['output']>;
  /** The Jina API key, if using developer's own account. */
  key?: Maybe<Scalars['String']['output']>;
  /** The Jina model, or custom, when using developer's own account. */
  model: JinaModels;
  /** The Jina model name, if using developer's own account. */
  modelName?: Maybe<Scalars['String']['output']>;
};

/** Represents Jina model properties. */
export type JinaModelPropertiesInput = {
  /** The limit of tokens per embedded text chunk, defaults to 600. */
  chunkTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The Jina API key, if using developer's own account. */
  key?: InputMaybe<Scalars['String']['input']>;
  /** The Jina model, or custom, when using developer's own account. */
  model: JinaModels;
  /** The Jina model name, if using developer's own account. */
  modelName?: InputMaybe<Scalars['String']['input']>;
};

/** Represents Jina model properties. */
export type JinaModelPropertiesUpdateInput = {
  /** The limit of tokens per embedded text chunk, defaults to 600. */
  chunkTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The Jina API key, if using developer's own account. */
  key?: InputMaybe<Scalars['String']['input']>;
  /** The Jina model, or custom, when using developer's own account. */
  model?: InputMaybe<JinaModels>;
  /** The Jina model name, if using developer's own account. */
  modelName?: InputMaybe<Scalars['String']['input']>;
};

/** Jina model type */
export enum JinaModels {
  /** CLIP Image */
  ClipImage = 'CLIP_IMAGE',
  /** Developer-specified model */
  Custom = 'CUSTOM',
  /** Embed (Latest) */
  Embed = 'EMBED',
  /** Embed 3.0 */
  Embed_3_0 = 'EMBED_3_0'
}

/** Represents a label. */
export type Label = {
  __typename?: 'Label';
  /** The creation date of the label. */
  creationDate: Scalars['DateTime']['output'];
  /** The label description. */
  description?: Maybe<Scalars['String']['output']>;
  /** The ID of the label. */
  id: Scalars['ID']['output'];
  /** The modified date of the label. */
  modifiedDate?: Maybe<Scalars['DateTime']['output']>;
  /** The name of the label. */
  name: Scalars['String']['output'];
  /** The relevance score of the label. */
  relevance?: Maybe<Scalars['Float']['output']>;
  /** The state of the label (i.e. created, enabled). */
  state: EntityState;
};

/** Represents a label facet. */
export type LabelFacet = {
  __typename?: 'LabelFacet';
  /** The facet count. */
  count?: Maybe<Scalars['Long']['output']>;
  /** The label facet type. */
  facet?: Maybe<LabelFacetTypes>;
  /** The facet value range. */
  range?: Maybe<StringRange>;
  /** The facet value type. */
  type?: Maybe<FacetValueTypes>;
  /** The facet value. */
  value?: Maybe<Scalars['String']['output']>;
};

/** Represents the configuration for label facets. */
export type LabelFacetInput = {
  /** The label facet type. */
  facet?: InputMaybe<LabelFacetTypes>;
  /** The facet time interval. */
  timeInterval?: InputMaybe<TimeIntervalTypes>;
  /** The facet time offset (in hours). */
  timeOffset?: InputMaybe<Scalars['Int']['input']>;
};

/** Label facet types */
export enum LabelFacetTypes {
  /** Creation Date */
  CreationDate = 'CREATION_DATE'
}

/** Represents a filter for labels. */
export type LabelFilter = {
  /** Filter by creation date recent timespan. For example, a timespan of one day will return label(s) created in the last 24 hours. */
  createdInLast?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** Filter label(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter label(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of label(s) to be returned. Defaults to 100. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter label(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Skip the specified number of label(s) from the beginning of the result set. Only supported on keyword search. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** Filter label(s) by searching for similar text. */
  search?: InputMaybe<Scalars['String']['input']>;
  /** Filter label(s) by their states. */
  states?: InputMaybe<Array<EntityState>>;
};

/** Represents a label. */
export type LabelInput = {
  /** The label description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The name of the label. */
  name: Scalars['String']['input'];
};

/** Represents label query results. */
export type LabelResults = {
  __typename?: 'LabelResults';
  /** The label facets. */
  facets?: Maybe<Array<Maybe<LabelFacet>>>;
  /** The label results. */
  results?: Maybe<Array<Maybe<Label>>>;
};

/** Represents a label. */
export type LabelUpdateInput = {
  /** The label description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the label to update. */
  id: Scalars['ID']['input'];
  /** The name of the label. */
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Represents language metadata. */
export type LanguageMetadata = {
  __typename?: 'LanguageMetadata';
  /** The content language(s) in ISO 639-1 format, i.e. 'en'. */
  languages?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

/** Represents language metadata. */
export type LanguageMetadataInput = {
  /** The content language(s) in ISO 639-1 format, i.e. 'en'. */
  languages?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

/** Represents Linear feed properties. */
export type LinearFeedProperties = {
  __typename?: 'LinearFeedProperties';
  /** Linear API key. */
  key: Scalars['String']['output'];
  /** Linear project name. */
  project: Scalars['ID']['output'];
};

/** Represents Linear feed properties. */
export type LinearFeedPropertiesInput = {
  /** Linear API key. */
  key: Scalars['String']['input'];
  /** Linear project name. */
  project: Scalars['ID']['input'];
};

/** Represents Linear feed properties. */
export type LinearFeedPropertiesUpdateInput = {
  /** Linear API key. */
  key?: InputMaybe<Scalars['String']['input']>;
  /** Linear project name. */
  project?: InputMaybe<Scalars['ID']['input']>;
};

/** Represents Linear projects properties. */
export type LinearProjectsInput = {
  /** Linear API key. */
  key: Scalars['String']['input'];
};

/** Represents a hyperlink. */
export type LinkReference = {
  __typename?: 'LinkReference';
  /** The hyperlink type. */
  linkType?: Maybe<LinkTypes>;
  /** The hyperlink URI. */
  uri?: Maybe<Scalars['URL']['output']>;
};

/** Represents the content hyperlink strategy. */
export type LinkStrategy = {
  __typename?: 'LinkStrategy';
  /** Whether to crawl the content DNS domain, i.e. hyperlinks to same domain as content page. */
  allowContentDomain?: Maybe<Scalars['Boolean']['output']>;
  /** The list of DNS domains to be crawled, i.e. example.com. */
  allowedDomains?: Maybe<Array<Scalars['String']['output']>>;
  /** The allowed file types. */
  allowedFiles?: Maybe<Array<FileTypes>>;
  /** The allowed link types. */
  allowedLinks?: Maybe<Array<LinkTypes>>;
  /** The list of regular expressions for URL paths to be crawled, i.e. "^/public/blogs/.*". */
  allowedPaths?: Maybe<Array<Scalars['String']['output']>>;
  /** Whether link crawling is enabled. */
  enableCrawling?: Maybe<Scalars['Boolean']['output']>;
  /** The list of DNS domains to not be crawled, i.e. example.com. */
  excludedDomains?: Maybe<Array<Scalars['String']['output']>>;
  /** The excluded link types. */
  excludedFiles?: Maybe<Array<FileTypes>>;
  /** The excluded link types. */
  excludedLinks?: Maybe<Array<LinkTypes>>;
  /** The list of regular expressions for URL paths to not be crawled, i.e. "^/internal/private/.*". */
  excludedPaths?: Maybe<Array<Scalars['String']['output']>>;
  /** The maximum number of links to be crawled, defaults to 25. */
  maximumLinks?: Maybe<Scalars['Int']['output']>;
};

/** Represents the content hyperlink strategy. */
export type LinkStrategyInput = {
  /** Whether to crawl the content DNS domain, i.e. hyperlinks to same domain as content page. */
  allowContentDomain?: InputMaybe<Scalars['Boolean']['input']>;
  /** The list of DNS domains to be crawled, i.e. example.com. */
  allowedDomains?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The allowed file types. */
  allowedFiles?: InputMaybe<Array<FileTypes>>;
  /** The allowed link types. */
  allowedLinks?: InputMaybe<Array<LinkTypes>>;
  /** The list of regular expressions for URL paths to be crawled, i.e. "^/public/blogs/.*". */
  allowedPaths?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Whether link crawling is enabled. */
  enableCrawling?: InputMaybe<Scalars['Boolean']['input']>;
  /** The list of DNS domains to not be crawled, i.e. example.com. */
  excludedDomains?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The excluded link types. */
  excludedFiles?: InputMaybe<Array<FileTypes>>;
  /** The excluded link types. */
  excludedLinks?: InputMaybe<Array<LinkTypes>>;
  /** The list of regular expressions for URL paths to not be crawled, i.e. "^/internal/private/.*". */
  excludedPaths?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The maximum number of links to be crawled, defaults to 25. */
  maximumLinks?: InputMaybe<Scalars['Int']['input']>;
};

/** URI link type */
export enum LinkTypes {
  /** Airtable link */
  Airtable = 'AIRTABLE',
  /** AnchorFM link */
  AnchorFm = 'ANCHOR_FM',
  /** Angelist link */
  AngelList = 'ANGEL_LIST',
  /** Apple link */
  Apple = 'APPLE',
  /** Bandcamp link */
  Bandcamp = 'BANDCAMP',
  /** Crunchbase link */
  Crunchbase = 'CRUNCHBASE',
  /** Diffbot link */
  Diffbot = 'DIFFBOT',
  /** Discord link */
  Discord = 'DISCORD',
  /** Dropbox link */
  Dropbox = 'DROPBOX',
  /** Email link */
  Email = 'EMAIL',
  /** Facebook link */
  Facebook = 'FACEBOOK',
  /** File link */
  File = 'FILE',
  /** GitHub link */
  GitHub = 'GIT_HUB',
  /** GitHub Pages link */
  GitHubPages = 'GIT_HUB_PAGES',
  /** Google link */
  Google = 'GOOGLE',
  /** IFTTT link */
  Ifttt = 'IFTTT',
  /** Instagram link */
  Instagram = 'INSTAGRAM',
  /** iTunes link */
  ITunes = 'I_TUNES',
  /** Linear link */
  Linear = 'LINEAR',
  /** LinkedIn link */
  LinkedIn = 'LINKED_IN',
  /** RSS media link */
  Media = 'MEDIA',
  /** Medium link */
  Medium = 'MEDIUM',
  /** Microsoft Teams link */
  MicrosoftTeams = 'MICROSOFT_TEAMS',
  /** Notion link */
  Notion = 'NOTION',
  /** Pandora link */
  Pandora = 'PANDORA',
  /** PocketCasts link */
  PocketCasts = 'POCKET_CASTS',
  /** Reddit link */
  Reddit = 'REDDIT',
  /** RSS link */
  Rss = 'RSS',
  /** Slack link */
  Slack = 'SLACK',
  /** SoundCloud link */
  SoundCloud = 'SOUND_CLOUD',
  /** Spotify link */
  Spotify = 'SPOTIFY',
  /** Stitcher link */
  Stitcher = 'STITCHER',
  /** TikTok link */
  TikTok = 'TIK_TOK',
  /** TransistorFM link */
  TransistorFm = 'TRANSISTOR_FM',
  /** TuneIn link */
  TuneIn = 'TUNE_IN',
  /** Twitch link */
  Twitch = 'TWITCH',
  /** Twitter link */
  Twitter = 'TWITTER',
  /** TypeForm link */
  TypeForm = 'TYPE_FORM',
  /** Web link */
  Web = 'WEB',
  /** Wikidata link */
  Wikidata = 'WIKIDATA',
  /** Wikimedia link */
  Wikimedia = 'WIKIMEDIA',
  /** Wikipedia link */
  Wikipedia = 'WIKIPEDIA',
  /** X link */
  X = 'X',
  /** YouTube link */
  YouTube = 'YOU_TUBE'
}

/** Represents a long result. */
export type LongResult = {
  __typename?: 'LongResult';
  /** The long result. */
  result?: Maybe<Scalars['Long']['output']>;
};

/** Represents content lookup results. */
export type LookupContentsResults = {
  __typename?: 'LookupContentsResults';
  /** The content results. */
  results?: Maybe<Array<Maybe<Content>>>;
};

/** Mail importance */
export enum MailImportance {
  /** High importance */
  High = 'HIGH',
  /** Low importance */
  Low = 'LOW',
  /** Normal importance */
  Normal = 'NORMAL'
}

/** Mail priority */
export enum MailPriority {
  /** High priority */
  High = 'HIGH',
  /** Low priority */
  Low = 'LOW',
  /** Normal priority */
  Normal = 'NORMAL'
}

/** Mail sensitivity */
export enum MailSensitivity {
  /** Company confidential sensitivity */
  CompanyConfidential = 'COMPANY_CONFIDENTIAL',
  /** No sensitivity */
  None = 'NONE',
  /** Normal sensitivity */
  Normal = 'NORMAL',
  /** Personal sensitivity */
  Personal = 'PERSONAL',
  /** Private sensitivity */
  Private = 'PRIVATE'
}

/** Represents a medical condition. */
export type MedicalCondition = {
  __typename?: 'MedicalCondition';
  /** The alternate names of the medicalcondition. */
  alternateNames?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The geo-boundary of the medicalcondition, as GeoJSON Feature with Polygon geometry. */
  boundary?: Maybe<Scalars['String']['output']>;
  /** The creation date of the medicalcondition. */
  creationDate: Scalars['DateTime']['output'];
  /** The medicalcondition description. */
  description?: Maybe<Scalars['String']['output']>;
  /** The EPSG code for spatial reference of the medicalcondition. */
  epsgCode?: Maybe<Scalars['Int']['output']>;
  /** The H3 index of the medicalcondition. */
  h3?: Maybe<H3>;
  /** The ID of the medicalcondition. */
  id: Scalars['ID']['output'];
  /** The medicalcondition external identifier. */
  identifier?: Maybe<Scalars['String']['output']>;
  /** The extracted hyperlinks. */
  links?: Maybe<Array<Maybe<LinkReference>>>;
  /** The geo-location of the medicalcondition. */
  location?: Maybe<Point>;
  /** The modified date of the medicalcondition. */
  modifiedDate?: Maybe<Scalars['DateTime']['output']>;
  /** The name of the medicalcondition. */
  name: Scalars['String']['output'];
  /** The relevance score of the medicalcondition. */
  relevance?: Maybe<Scalars['Float']['output']>;
  /** The state of the medicalcondition (i.e. created, enabled). */
  state: EntityState;
  /** The JSON-LD value of the medicalcondition. */
  thing?: Maybe<Scalars['String']['output']>;
  /** The medicalcondition URI. */
  uri?: Maybe<Scalars['URL']['output']>;
};

/** Represents a medical condition facet. */
export type MedicalConditionFacet = {
  __typename?: 'MedicalConditionFacet';
  /** The facet count. */
  count?: Maybe<Scalars['Long']['output']>;
  /** The medical condition facet type. */
  facet?: Maybe<MedicalConditionFacetTypes>;
  /** The facet value range. */
  range?: Maybe<StringRange>;
  /** The facet value type. */
  type?: Maybe<FacetValueTypes>;
  /** The facet value. */
  value?: Maybe<Scalars['String']['output']>;
};

/** Represents the configuration for medical condition facets. */
export type MedicalConditionFacetInput = {
  /** The medical condition facet type. */
  facet?: InputMaybe<MedicalConditionFacetTypes>;
  /** The facet time interval. */
  timeInterval?: InputMaybe<TimeIntervalTypes>;
  /** The facet time offset (in hours). */
  timeOffset?: InputMaybe<Scalars['Int']['input']>;
};

/** Medical Condition facet types */
export enum MedicalConditionFacetTypes {
  /** Creation Date */
  CreationDate = 'CREATION_DATE'
}

/** Represents a filter for medical conditions. */
export type MedicalConditionFilter = {
  /** Filter by observable physical address. */
  address?: InputMaybe<AddressFilter>;
  /** Filter by observable geo-boundaries, as GeoJSON Feature with Polygon geometry. */
  boundaries?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Filter by creation date recent timespan. For example, a timespan of one day will return medicalcondition(s) created in the last 24 hours. */
  createdInLast?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** Filter medicalcondition(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter by observable H3 index. */
  h3?: InputMaybe<H3Filter>;
  /** Filter medicalcondition(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of medicalcondition(s) to be returned. Defaults to 100. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter by observable geo-location. */
  location?: InputMaybe<PointFilter>;
  /** Filter medicalcondition(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** When using similarity search, the number of similar items to be returned. Defaults to 100. */
  numberSimilar?: InputMaybe<Scalars['Int']['input']>;
  /** Skip the specified number of medicalcondition(s) from the beginning of the result set. Only supported on keyword search. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** The query syntax for the search text. Defaults to Simple. */
  queryType?: InputMaybe<SearchQueryTypes>;
  /** Filter medicalcondition(s) by searching for similar text. */
  search?: InputMaybe<Scalars['String']['input']>;
  /** The type of search to be used. Defaults to Vector. */
  searchType?: InputMaybe<SearchTypes>;
  /** Filter by similar medical conditions. */
  similarConditions?: InputMaybe<Array<EntityReferenceFilter>>;
  /** Filter medicalcondition(s) by their states. */
  states?: InputMaybe<Array<EntityState>>;
};

/** Represents a medical condition. */
export type MedicalConditionInput = {
  /** The medicalcondition geo-boundary, as GeoJSON Feature with Polygon geometry. */
  boundary?: InputMaybe<Scalars['String']['input']>;
  /** The medicalcondition description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The medicalcondition external identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The medicalcondition geo-location. */
  location?: InputMaybe<PointInput>;
  /** The name of the medicalcondition. */
  name: Scalars['String']['input'];
  /** The medicalcondition URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents medical condition query results. */
export type MedicalConditionResults = {
  __typename?: 'MedicalConditionResults';
  /** The medical condition facets. */
  facets?: Maybe<Array<Maybe<MedicalConditionFacet>>>;
  /** The medical condition results. */
  results?: Maybe<Array<Maybe<MedicalCondition>>>;
};

/** Represents a medical condition. */
export type MedicalConditionUpdateInput = {
  /** The medicalcondition geo-boundary, as GeoJSON Feature with Polygon geometry. */
  boundary?: InputMaybe<Scalars['String']['input']>;
  /** The medicalcondition description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the medicalcondition to update. */
  id: Scalars['ID']['input'];
  /** The medicalcondition external identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The medicalcondition geo-location. */
  location?: InputMaybe<PointInput>;
  /** The name of the medicalcondition. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The medicalcondition URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents a medical contraindication. */
export type MedicalContraindication = {
  __typename?: 'MedicalContraindication';
  /** The alternate names of the medicalcontraindication. */
  alternateNames?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The geo-boundary of the medicalcontraindication, as GeoJSON Feature with Polygon geometry. */
  boundary?: Maybe<Scalars['String']['output']>;
  /** The creation date of the medicalcontraindication. */
  creationDate: Scalars['DateTime']['output'];
  /** The medicalcontraindication description. */
  description?: Maybe<Scalars['String']['output']>;
  /** The EPSG code for spatial reference of the medicalcontraindication. */
  epsgCode?: Maybe<Scalars['Int']['output']>;
  /** The H3 index of the medicalcontraindication. */
  h3?: Maybe<H3>;
  /** The ID of the medicalcontraindication. */
  id: Scalars['ID']['output'];
  /** The medicalcontraindication external identifier. */
  identifier?: Maybe<Scalars['String']['output']>;
  /** The extracted hyperlinks. */
  links?: Maybe<Array<Maybe<LinkReference>>>;
  /** The geo-location of the medicalcontraindication. */
  location?: Maybe<Point>;
  /** The modified date of the medicalcontraindication. */
  modifiedDate?: Maybe<Scalars['DateTime']['output']>;
  /** The name of the medicalcontraindication. */
  name: Scalars['String']['output'];
  /** The relevance score of the medicalcontraindication. */
  relevance?: Maybe<Scalars['Float']['output']>;
  /** The state of the medicalcontraindication (i.e. created, enabled). */
  state: EntityState;
  /** The JSON-LD value of the medicalcontraindication. */
  thing?: Maybe<Scalars['String']['output']>;
  /** The medicalcontraindication URI. */
  uri?: Maybe<Scalars['URL']['output']>;
};

/** Represents a medical contraindication facet. */
export type MedicalContraindicationFacet = {
  __typename?: 'MedicalContraindicationFacet';
  /** The facet count. */
  count?: Maybe<Scalars['Long']['output']>;
  /** The medical contraindication facet type. */
  facet?: Maybe<MedicalContraindicationFacetTypes>;
  /** The facet value range. */
  range?: Maybe<StringRange>;
  /** The facet value type. */
  type?: Maybe<FacetValueTypes>;
  /** The facet value. */
  value?: Maybe<Scalars['String']['output']>;
};

/** Represents the configuration for medical contraindication facets. */
export type MedicalContraindicationFacetInput = {
  /** The medical contraindication facet type. */
  facet?: InputMaybe<MedicalContraindicationFacetTypes>;
  /** The facet time interval. */
  timeInterval?: InputMaybe<TimeIntervalTypes>;
  /** The facet time offset (in hours). */
  timeOffset?: InputMaybe<Scalars['Int']['input']>;
};

/** Medical Contraindication facet types */
export enum MedicalContraindicationFacetTypes {
  /** Creation Date */
  CreationDate = 'CREATION_DATE'
}

/** Represents a filter for medical contraindications. */
export type MedicalContraindicationFilter = {
  /** Filter by observable physical address. */
  address?: InputMaybe<AddressFilter>;
  /** Filter by observable geo-boundaries, as GeoJSON Feature with Polygon geometry. */
  boundaries?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Filter by creation date recent timespan. For example, a timespan of one day will return medicalcontraindication(s) created in the last 24 hours. */
  createdInLast?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** Filter medicalcontraindication(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter by observable H3 index. */
  h3?: InputMaybe<H3Filter>;
  /** Filter medicalcontraindication(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of medicalcontraindication(s) to be returned. Defaults to 100. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter by observable geo-location. */
  location?: InputMaybe<PointFilter>;
  /** Filter medicalcontraindication(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** When using similarity search, the number of similar items to be returned. Defaults to 100. */
  numberSimilar?: InputMaybe<Scalars['Int']['input']>;
  /** Skip the specified number of medicalcontraindication(s) from the beginning of the result set. Only supported on keyword search. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** The query syntax for the search text. Defaults to Simple. */
  queryType?: InputMaybe<SearchQueryTypes>;
  /** Filter medicalcontraindication(s) by searching for similar text. */
  search?: InputMaybe<Scalars['String']['input']>;
  /** The type of search to be used. Defaults to Vector. */
  searchType?: InputMaybe<SearchTypes>;
  /** Filter by similar medical contraindications. */
  similarContraindications?: InputMaybe<Array<EntityReferenceFilter>>;
  /** Filter medicalcontraindication(s) by their states. */
  states?: InputMaybe<Array<EntityState>>;
};

/** Represents a medical contraindication. */
export type MedicalContraindicationInput = {
  /** The medicalcontraindication geo-boundary, as GeoJSON Feature with Polygon geometry. */
  boundary?: InputMaybe<Scalars['String']['input']>;
  /** The medicalcontraindication description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The medicalcontraindication external identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The medicalcontraindication geo-location. */
  location?: InputMaybe<PointInput>;
  /** The name of the medicalcontraindication. */
  name: Scalars['String']['input'];
  /** The medicalcontraindication URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents medical contraindication query results. */
export type MedicalContraindicationResults = {
  __typename?: 'MedicalContraindicationResults';
  /** The medical contraindication facets. */
  facets?: Maybe<Array<Maybe<MedicalContraindicationFacet>>>;
  /** The medical contraindication results. */
  results?: Maybe<Array<Maybe<MedicalContraindication>>>;
};

/** Represents a medical contraindication. */
export type MedicalContraindicationUpdateInput = {
  /** The medicalcontraindication geo-boundary, as GeoJSON Feature with Polygon geometry. */
  boundary?: InputMaybe<Scalars['String']['input']>;
  /** The medicalcontraindication description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the medicalcontraindication to update. */
  id: Scalars['ID']['input'];
  /** The medicalcontraindication external identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The medicalcontraindication geo-location. */
  location?: InputMaybe<PointInput>;
  /** The name of the medicalcontraindication. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The medicalcontraindication URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents a medical device. */
export type MedicalDevice = {
  __typename?: 'MedicalDevice';
  /** The alternate names of the medicaldevice. */
  alternateNames?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The geo-boundary of the medicaldevice, as GeoJSON Feature with Polygon geometry. */
  boundary?: Maybe<Scalars['String']['output']>;
  /** The creation date of the medicaldevice. */
  creationDate: Scalars['DateTime']['output'];
  /** The medicaldevice description. */
  description?: Maybe<Scalars['String']['output']>;
  /** The EPSG code for spatial reference of the medicaldevice. */
  epsgCode?: Maybe<Scalars['Int']['output']>;
  /** The H3 index of the medicaldevice. */
  h3?: Maybe<H3>;
  /** The ID of the medicaldevice. */
  id: Scalars['ID']['output'];
  /** The medicaldevice external identifier. */
  identifier?: Maybe<Scalars['String']['output']>;
  /** The extracted hyperlinks. */
  links?: Maybe<Array<Maybe<LinkReference>>>;
  /** The geo-location of the medicaldevice. */
  location?: Maybe<Point>;
  /** The modified date of the medicaldevice. */
  modifiedDate?: Maybe<Scalars['DateTime']['output']>;
  /** The name of the medicaldevice. */
  name: Scalars['String']['output'];
  /** The relevance score of the medicaldevice. */
  relevance?: Maybe<Scalars['Float']['output']>;
  /** The state of the medicaldevice (i.e. created, enabled). */
  state: EntityState;
  /** The JSON-LD value of the medicaldevice. */
  thing?: Maybe<Scalars['String']['output']>;
  /** The medicaldevice URI. */
  uri?: Maybe<Scalars['URL']['output']>;
};

/** Represents a medical device facet. */
export type MedicalDeviceFacet = {
  __typename?: 'MedicalDeviceFacet';
  /** The facet count. */
  count?: Maybe<Scalars['Long']['output']>;
  /** The medical device facet type. */
  facet?: Maybe<MedicalDeviceFacetTypes>;
  /** The facet value range. */
  range?: Maybe<StringRange>;
  /** The facet value type. */
  type?: Maybe<FacetValueTypes>;
  /** The facet value. */
  value?: Maybe<Scalars['String']['output']>;
};

/** Represents the configuration for medical device facets. */
export type MedicalDeviceFacetInput = {
  /** The medical device facet type. */
  facet?: InputMaybe<MedicalDeviceFacetTypes>;
  /** The facet time interval. */
  timeInterval?: InputMaybe<TimeIntervalTypes>;
  /** The facet time offset (in hours). */
  timeOffset?: InputMaybe<Scalars['Int']['input']>;
};

/** Medical Device facet types */
export enum MedicalDeviceFacetTypes {
  /** Creation Date */
  CreationDate = 'CREATION_DATE'
}

/** Represents a filter for medical devices. */
export type MedicalDeviceFilter = {
  /** Filter by observable physical address. */
  address?: InputMaybe<AddressFilter>;
  /** Filter by observable geo-boundaries, as GeoJSON Feature with Polygon geometry. */
  boundaries?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Filter by creation date recent timespan. For example, a timespan of one day will return medicaldevice(s) created in the last 24 hours. */
  createdInLast?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** Filter medicaldevice(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter by observable H3 index. */
  h3?: InputMaybe<H3Filter>;
  /** Filter medicaldevice(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of medicaldevice(s) to be returned. Defaults to 100. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter by observable geo-location. */
  location?: InputMaybe<PointFilter>;
  /** Filter medicaldevice(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** When using similarity search, the number of similar items to be returned. Defaults to 100. */
  numberSimilar?: InputMaybe<Scalars['Int']['input']>;
  /** Skip the specified number of medicaldevice(s) from the beginning of the result set. Only supported on keyword search. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** The query syntax for the search text. Defaults to Simple. */
  queryType?: InputMaybe<SearchQueryTypes>;
  /** Filter medicaldevice(s) by searching for similar text. */
  search?: InputMaybe<Scalars['String']['input']>;
  /** The type of search to be used. Defaults to Vector. */
  searchType?: InputMaybe<SearchTypes>;
  /** Filter by similar medical devices. */
  similarDevices?: InputMaybe<Array<EntityReferenceFilter>>;
  /** Filter medicaldevice(s) by their states. */
  states?: InputMaybe<Array<EntityState>>;
};

/** Represents a medical device. */
export type MedicalDeviceInput = {
  /** The medicaldevice geo-boundary, as GeoJSON Feature with Polygon geometry. */
  boundary?: InputMaybe<Scalars['String']['input']>;
  /** The medicaldevice description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The medicaldevice external identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The medicaldevice geo-location. */
  location?: InputMaybe<PointInput>;
  /** The name of the medicaldevice. */
  name: Scalars['String']['input'];
  /** The medicaldevice URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents medical device query results. */
export type MedicalDeviceResults = {
  __typename?: 'MedicalDeviceResults';
  /** The medical device facets. */
  facets?: Maybe<Array<Maybe<MedicalDeviceFacet>>>;
  /** The medical device results. */
  results?: Maybe<Array<Maybe<MedicalDevice>>>;
};

/** Represents a medical device. */
export type MedicalDeviceUpdateInput = {
  /** The medicaldevice geo-boundary, as GeoJSON Feature with Polygon geometry. */
  boundary?: InputMaybe<Scalars['String']['input']>;
  /** The medicaldevice description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the medicaldevice to update. */
  id: Scalars['ID']['input'];
  /** The medicaldevice external identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The medicaldevice geo-location. */
  location?: InputMaybe<PointInput>;
  /** The name of the medicaldevice. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The medicaldevice URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents a medical drug. */
export type MedicalDrug = {
  __typename?: 'MedicalDrug';
  /** The alternate names of the medicaldrug. */
  alternateNames?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The geo-boundary of the medicaldrug, as GeoJSON Feature with Polygon geometry. */
  boundary?: Maybe<Scalars['String']['output']>;
  /** The creation date of the medicaldrug. */
  creationDate: Scalars['DateTime']['output'];
  /** The medicaldrug description. */
  description?: Maybe<Scalars['String']['output']>;
  /** The EPSG code for spatial reference of the medicaldrug. */
  epsgCode?: Maybe<Scalars['Int']['output']>;
  /** The H3 index of the medicaldrug. */
  h3?: Maybe<H3>;
  /** The ID of the medicaldrug. */
  id: Scalars['ID']['output'];
  /** The medicaldrug external identifier. */
  identifier?: Maybe<Scalars['String']['output']>;
  /** The extracted hyperlinks. */
  links?: Maybe<Array<Maybe<LinkReference>>>;
  /** The geo-location of the medicaldrug. */
  location?: Maybe<Point>;
  /** The modified date of the medicaldrug. */
  modifiedDate?: Maybe<Scalars['DateTime']['output']>;
  /** The name of the medicaldrug. */
  name: Scalars['String']['output'];
  /** The relevance score of the medicaldrug. */
  relevance?: Maybe<Scalars['Float']['output']>;
  /** The state of the medicaldrug (i.e. created, enabled). */
  state: EntityState;
  /** The JSON-LD value of the medicaldrug. */
  thing?: Maybe<Scalars['String']['output']>;
  /** The medicaldrug URI. */
  uri?: Maybe<Scalars['URL']['output']>;
};

/** Represents a medical drug class. */
export type MedicalDrugClass = {
  __typename?: 'MedicalDrugClass';
  /** The alternate names of the medicaldrugclass. */
  alternateNames?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The geo-boundary of the medicaldrugclass, as GeoJSON Feature with Polygon geometry. */
  boundary?: Maybe<Scalars['String']['output']>;
  /** The creation date of the medicaldrugclass. */
  creationDate: Scalars['DateTime']['output'];
  /** The medicaldrugclass description. */
  description?: Maybe<Scalars['String']['output']>;
  /** The EPSG code for spatial reference of the medicaldrugclass. */
  epsgCode?: Maybe<Scalars['Int']['output']>;
  /** The H3 index of the medicaldrugclass. */
  h3?: Maybe<H3>;
  /** The ID of the medicaldrugclass. */
  id: Scalars['ID']['output'];
  /** The medicaldrugclass external identifier. */
  identifier?: Maybe<Scalars['String']['output']>;
  /** The extracted hyperlinks. */
  links?: Maybe<Array<Maybe<LinkReference>>>;
  /** The geo-location of the medicaldrugclass. */
  location?: Maybe<Point>;
  /** The modified date of the medicaldrugclass. */
  modifiedDate?: Maybe<Scalars['DateTime']['output']>;
  /** The name of the medicaldrugclass. */
  name: Scalars['String']['output'];
  /** The relevance score of the medicaldrugclass. */
  relevance?: Maybe<Scalars['Float']['output']>;
  /** The state of the medicaldrugclass (i.e. created, enabled). */
  state: EntityState;
  /** The JSON-LD value of the medicaldrugclass. */
  thing?: Maybe<Scalars['String']['output']>;
  /** The medicaldrugclass URI. */
  uri?: Maybe<Scalars['URL']['output']>;
};

/** Represents a medical drug class facet. */
export type MedicalDrugClassFacet = {
  __typename?: 'MedicalDrugClassFacet';
  /** The facet count. */
  count?: Maybe<Scalars['Long']['output']>;
  /** The medical drug class facet type. */
  facet?: Maybe<MedicalDrugClassFacetTypes>;
  /** The facet value range. */
  range?: Maybe<StringRange>;
  /** The facet value type. */
  type?: Maybe<FacetValueTypes>;
  /** The facet value. */
  value?: Maybe<Scalars['String']['output']>;
};

/** Represents the configuration for medical drug class facets. */
export type MedicalDrugClassFacetInput = {
  /** The medical drug class facet type. */
  facet?: InputMaybe<MedicalDrugClassFacetTypes>;
  /** The facet time interval. */
  timeInterval?: InputMaybe<TimeIntervalTypes>;
  /** The facet time offset (in hours). */
  timeOffset?: InputMaybe<Scalars['Int']['input']>;
};

/** Medical Drug Class facet types */
export enum MedicalDrugClassFacetTypes {
  /** Creation Date */
  CreationDate = 'CREATION_DATE'
}

/** Represents a filter for medical drug classes. */
export type MedicalDrugClassFilter = {
  /** Filter by observable physical address. */
  address?: InputMaybe<AddressFilter>;
  /** Filter by observable geo-boundaries, as GeoJSON Feature with Polygon geometry. */
  boundaries?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Filter by creation date recent timespan. For example, a timespan of one day will return medicaldrugclass(s) created in the last 24 hours. */
  createdInLast?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** Filter medicaldrugclass(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter by observable H3 index. */
  h3?: InputMaybe<H3Filter>;
  /** Filter medicaldrugclass(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of medicaldrugclass(s) to be returned. Defaults to 100. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter by observable geo-location. */
  location?: InputMaybe<PointFilter>;
  /** Filter medicaldrugclass(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** When using similarity search, the number of similar items to be returned. Defaults to 100. */
  numberSimilar?: InputMaybe<Scalars['Int']['input']>;
  /** Skip the specified number of medicaldrugclass(s) from the beginning of the result set. Only supported on keyword search. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** The query syntax for the search text. Defaults to Simple. */
  queryType?: InputMaybe<SearchQueryTypes>;
  /** Filter medicaldrugclass(s) by searching for similar text. */
  search?: InputMaybe<Scalars['String']['input']>;
  /** The type of search to be used. Defaults to Vector. */
  searchType?: InputMaybe<SearchTypes>;
  /** Filter by similar medical drug classes. */
  similarClasses?: InputMaybe<Array<EntityReferenceFilter>>;
  /** Filter medicaldrugclass(s) by their states. */
  states?: InputMaybe<Array<EntityState>>;
};

/** Represents a medical drug class. */
export type MedicalDrugClassInput = {
  /** The medicaldrugclass geo-boundary, as GeoJSON Feature with Polygon geometry. */
  boundary?: InputMaybe<Scalars['String']['input']>;
  /** The medicaldrugclass description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The medicaldrugclass external identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The medicaldrugclass geo-location. */
  location?: InputMaybe<PointInput>;
  /** The name of the medicaldrugclass. */
  name: Scalars['String']['input'];
  /** The medicaldrugclass URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents medical drug class query results. */
export type MedicalDrugClassResults = {
  __typename?: 'MedicalDrugClassResults';
  /** The medical drug class facets. */
  facets?: Maybe<Array<Maybe<MedicalDrugClassFacet>>>;
  /** The medical drug class results. */
  results?: Maybe<Array<Maybe<MedicalDrugClass>>>;
};

/** Represents a medical drug class. */
export type MedicalDrugClassUpdateInput = {
  /** The medicaldrugclass geo-boundary, as GeoJSON Feature with Polygon geometry. */
  boundary?: InputMaybe<Scalars['String']['input']>;
  /** The medicaldrugclass description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the medicaldrugclass to update. */
  id: Scalars['ID']['input'];
  /** The medicaldrugclass external identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The medicaldrugclass geo-location. */
  location?: InputMaybe<PointInput>;
  /** The name of the medicaldrugclass. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The medicaldrugclass URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents a medical drug facet. */
export type MedicalDrugFacet = {
  __typename?: 'MedicalDrugFacet';
  /** The facet count. */
  count?: Maybe<Scalars['Long']['output']>;
  /** The medical drug facet type. */
  facet?: Maybe<MedicalDrugFacetTypes>;
  /** The facet value range. */
  range?: Maybe<StringRange>;
  /** The facet value type. */
  type?: Maybe<FacetValueTypes>;
  /** The facet value. */
  value?: Maybe<Scalars['String']['output']>;
};

/** Represents the configuration for medical drug facets. */
export type MedicalDrugFacetInput = {
  /** The medical drug facet type. */
  facet?: InputMaybe<MedicalDrugFacetTypes>;
  /** The facet time interval. */
  timeInterval?: InputMaybe<TimeIntervalTypes>;
  /** The facet time offset (in hours). */
  timeOffset?: InputMaybe<Scalars['Int']['input']>;
};

/** Medical Drug facet types */
export enum MedicalDrugFacetTypes {
  /** Creation Date */
  CreationDate = 'CREATION_DATE'
}

/** Represents a filter for medical drugs. */
export type MedicalDrugFilter = {
  /** Filter by observable physical address. */
  address?: InputMaybe<AddressFilter>;
  /** Filter by observable geo-boundaries, as GeoJSON Feature with Polygon geometry. */
  boundaries?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Filter by creation date recent timespan. For example, a timespan of one day will return medicaldrug(s) created in the last 24 hours. */
  createdInLast?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** Filter medicaldrug(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter by observable H3 index. */
  h3?: InputMaybe<H3Filter>;
  /** Filter medicaldrug(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of medicaldrug(s) to be returned. Defaults to 100. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter by observable geo-location. */
  location?: InputMaybe<PointFilter>;
  /** Filter medicaldrug(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** When using similarity search, the number of similar items to be returned. Defaults to 100. */
  numberSimilar?: InputMaybe<Scalars['Int']['input']>;
  /** Skip the specified number of medicaldrug(s) from the beginning of the result set. Only supported on keyword search. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** The query syntax for the search text. Defaults to Simple. */
  queryType?: InputMaybe<SearchQueryTypes>;
  /** Filter medicaldrug(s) by searching for similar text. */
  search?: InputMaybe<Scalars['String']['input']>;
  /** The type of search to be used. Defaults to Vector. */
  searchType?: InputMaybe<SearchTypes>;
  /** Filter by similar medical drugs. */
  similarDrugs?: InputMaybe<Array<EntityReferenceFilter>>;
  /** Filter medicaldrug(s) by their states. */
  states?: InputMaybe<Array<EntityState>>;
};

/** Represents a medical drug. */
export type MedicalDrugInput = {
  /** The medicaldrug geo-boundary, as GeoJSON Feature with Polygon geometry. */
  boundary?: InputMaybe<Scalars['String']['input']>;
  /** The medicaldrug description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The medicaldrug external identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The medicaldrug geo-location. */
  location?: InputMaybe<PointInput>;
  /** The name of the medicaldrug. */
  name: Scalars['String']['input'];
  /** The medicaldrug URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents medical drug query results. */
export type MedicalDrugResults = {
  __typename?: 'MedicalDrugResults';
  /** The medical drug facets. */
  facets?: Maybe<Array<Maybe<MedicalDrugFacet>>>;
  /** The medical drug results. */
  results?: Maybe<Array<Maybe<MedicalDrug>>>;
};

/** Represents a medical drug. */
export type MedicalDrugUpdateInput = {
  /** The medicaldrug geo-boundary, as GeoJSON Feature with Polygon geometry. */
  boundary?: InputMaybe<Scalars['String']['input']>;
  /** The medicaldrug description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the medicaldrug to update. */
  id: Scalars['ID']['input'];
  /** The medicaldrug external identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The medicaldrug geo-location. */
  location?: InputMaybe<PointInput>;
  /** The name of the medicaldrug. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The medicaldrug URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents a medical guideline. */
export type MedicalGuideline = {
  __typename?: 'MedicalGuideline';
  /** The alternate names of the medicalguideline. */
  alternateNames?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The geo-boundary of the medicalguideline, as GeoJSON Feature with Polygon geometry. */
  boundary?: Maybe<Scalars['String']['output']>;
  /** The creation date of the medicalguideline. */
  creationDate: Scalars['DateTime']['output'];
  /** The medicalguideline description. */
  description?: Maybe<Scalars['String']['output']>;
  /** The EPSG code for spatial reference of the medicalguideline. */
  epsgCode?: Maybe<Scalars['Int']['output']>;
  /** The H3 index of the medicalguideline. */
  h3?: Maybe<H3>;
  /** The ID of the medicalguideline. */
  id: Scalars['ID']['output'];
  /** The medicalguideline external identifier. */
  identifier?: Maybe<Scalars['String']['output']>;
  /** The extracted hyperlinks. */
  links?: Maybe<Array<Maybe<LinkReference>>>;
  /** The geo-location of the medicalguideline. */
  location?: Maybe<Point>;
  /** The modified date of the medicalguideline. */
  modifiedDate?: Maybe<Scalars['DateTime']['output']>;
  /** The name of the medicalguideline. */
  name: Scalars['String']['output'];
  /** The relevance score of the medicalguideline. */
  relevance?: Maybe<Scalars['Float']['output']>;
  /** The state of the medicalguideline (i.e. created, enabled). */
  state: EntityState;
  /** The JSON-LD value of the medicalguideline. */
  thing?: Maybe<Scalars['String']['output']>;
  /** The medicalguideline URI. */
  uri?: Maybe<Scalars['URL']['output']>;
};

/** Represents a medical guideline facet. */
export type MedicalGuidelineFacet = {
  __typename?: 'MedicalGuidelineFacet';
  /** The facet count. */
  count?: Maybe<Scalars['Long']['output']>;
  /** The medical guideline facet type. */
  facet?: Maybe<MedicalGuidelineFacetTypes>;
  /** The facet value range. */
  range?: Maybe<StringRange>;
  /** The facet value type. */
  type?: Maybe<FacetValueTypes>;
  /** The facet value. */
  value?: Maybe<Scalars['String']['output']>;
};

/** Represents the configuration for medical guideline facets. */
export type MedicalGuidelineFacetInput = {
  /** The medical guideline facet type. */
  facet?: InputMaybe<MedicalGuidelineFacetTypes>;
  /** The facet time interval. */
  timeInterval?: InputMaybe<TimeIntervalTypes>;
  /** The facet time offset (in hours). */
  timeOffset?: InputMaybe<Scalars['Int']['input']>;
};

/** Medical Guideline facet types */
export enum MedicalGuidelineFacetTypes {
  /** Creation Date */
  CreationDate = 'CREATION_DATE'
}

/** Represents a filter for medical guidelines. */
export type MedicalGuidelineFilter = {
  /** Filter by observable physical address. */
  address?: InputMaybe<AddressFilter>;
  /** Filter by observable geo-boundaries, as GeoJSON Feature with Polygon geometry. */
  boundaries?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Filter by creation date recent timespan. For example, a timespan of one day will return medicalguideline(s) created in the last 24 hours. */
  createdInLast?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** Filter medicalguideline(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter by observable H3 index. */
  h3?: InputMaybe<H3Filter>;
  /** Filter medicalguideline(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of medicalguideline(s) to be returned. Defaults to 100. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter by observable geo-location. */
  location?: InputMaybe<PointFilter>;
  /** Filter medicalguideline(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** When using similarity search, the number of similar items to be returned. Defaults to 100. */
  numberSimilar?: InputMaybe<Scalars['Int']['input']>;
  /** Skip the specified number of medicalguideline(s) from the beginning of the result set. Only supported on keyword search. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** The query syntax for the search text. Defaults to Simple. */
  queryType?: InputMaybe<SearchQueryTypes>;
  /** Filter medicalguideline(s) by searching for similar text. */
  search?: InputMaybe<Scalars['String']['input']>;
  /** The type of search to be used. Defaults to Vector. */
  searchType?: InputMaybe<SearchTypes>;
  /** Filter by similar medical guidelines. */
  similarGuidelines?: InputMaybe<Array<EntityReferenceFilter>>;
  /** Filter medicalguideline(s) by their states. */
  states?: InputMaybe<Array<EntityState>>;
};

/** Represents a medical guideline. */
export type MedicalGuidelineInput = {
  /** The medicalguideline geo-boundary, as GeoJSON Feature with Polygon geometry. */
  boundary?: InputMaybe<Scalars['String']['input']>;
  /** The medicalguideline description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The medicalguideline external identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The medicalguideline geo-location. */
  location?: InputMaybe<PointInput>;
  /** The name of the medicalguideline. */
  name: Scalars['String']['input'];
  /** The medicalguideline URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents medical guideline query results. */
export type MedicalGuidelineResults = {
  __typename?: 'MedicalGuidelineResults';
  /** The medical guideline facets. */
  facets?: Maybe<Array<Maybe<MedicalGuidelineFacet>>>;
  /** The medical guideline results. */
  results?: Maybe<Array<Maybe<MedicalGuideline>>>;
};

/** Represents a medical guideline. */
export type MedicalGuidelineUpdateInput = {
  /** The medicalguideline geo-boundary, as GeoJSON Feature with Polygon geometry. */
  boundary?: InputMaybe<Scalars['String']['input']>;
  /** The medicalguideline description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the medicalguideline to update. */
  id: Scalars['ID']['input'];
  /** The medicalguideline external identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The medicalguideline geo-location. */
  location?: InputMaybe<PointInput>;
  /** The name of the medicalguideline. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The medicalguideline URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents a medical indication. */
export type MedicalIndication = {
  __typename?: 'MedicalIndication';
  /** The alternate names of the medicalindication. */
  alternateNames?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The geo-boundary of the medicalindication, as GeoJSON Feature with Polygon geometry. */
  boundary?: Maybe<Scalars['String']['output']>;
  /** The creation date of the medicalindication. */
  creationDate: Scalars['DateTime']['output'];
  /** The medicalindication description. */
  description?: Maybe<Scalars['String']['output']>;
  /** The EPSG code for spatial reference of the medicalindication. */
  epsgCode?: Maybe<Scalars['Int']['output']>;
  /** The H3 index of the medicalindication. */
  h3?: Maybe<H3>;
  /** The ID of the medicalindication. */
  id: Scalars['ID']['output'];
  /** The medicalindication external identifier. */
  identifier?: Maybe<Scalars['String']['output']>;
  /** The extracted hyperlinks. */
  links?: Maybe<Array<Maybe<LinkReference>>>;
  /** The geo-location of the medicalindication. */
  location?: Maybe<Point>;
  /** The modified date of the medicalindication. */
  modifiedDate?: Maybe<Scalars['DateTime']['output']>;
  /** The name of the medicalindication. */
  name: Scalars['String']['output'];
  /** The relevance score of the medicalindication. */
  relevance?: Maybe<Scalars['Float']['output']>;
  /** The state of the medicalindication (i.e. created, enabled). */
  state: EntityState;
  /** The JSON-LD value of the medicalindication. */
  thing?: Maybe<Scalars['String']['output']>;
  /** The medicalindication URI. */
  uri?: Maybe<Scalars['URL']['output']>;
};

/** Represents a medical indication facet. */
export type MedicalIndicationFacet = {
  __typename?: 'MedicalIndicationFacet';
  /** The facet count. */
  count?: Maybe<Scalars['Long']['output']>;
  /** The medical indication facet type. */
  facet?: Maybe<MedicalIndicationFacetTypes>;
  /** The facet value range. */
  range?: Maybe<StringRange>;
  /** The facet value type. */
  type?: Maybe<FacetValueTypes>;
  /** The facet value. */
  value?: Maybe<Scalars['String']['output']>;
};

/** Represents the configuration for medical indication facets. */
export type MedicalIndicationFacetInput = {
  /** The medical indication facet type. */
  facet?: InputMaybe<MedicalIndicationFacetTypes>;
  /** The facet time interval. */
  timeInterval?: InputMaybe<TimeIntervalTypes>;
  /** The facet time offset (in hours). */
  timeOffset?: InputMaybe<Scalars['Int']['input']>;
};

/** Medical Indication facet types */
export enum MedicalIndicationFacetTypes {
  /** Creation Date */
  CreationDate = 'CREATION_DATE'
}

/** Represents a filter for medical indications. */
export type MedicalIndicationFilter = {
  /** Filter by observable physical address. */
  address?: InputMaybe<AddressFilter>;
  /** Filter by observable geo-boundaries, as GeoJSON Feature with Polygon geometry. */
  boundaries?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Filter by creation date recent timespan. For example, a timespan of one day will return medicalindication(s) created in the last 24 hours. */
  createdInLast?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** Filter medicalindication(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter by observable H3 index. */
  h3?: InputMaybe<H3Filter>;
  /** Filter medicalindication(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of medicalindication(s) to be returned. Defaults to 100. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter by observable geo-location. */
  location?: InputMaybe<PointFilter>;
  /** Filter medicalindication(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** When using similarity search, the number of similar items to be returned. Defaults to 100. */
  numberSimilar?: InputMaybe<Scalars['Int']['input']>;
  /** Skip the specified number of medicalindication(s) from the beginning of the result set. Only supported on keyword search. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** The query syntax for the search text. Defaults to Simple. */
  queryType?: InputMaybe<SearchQueryTypes>;
  /** Filter medicalindication(s) by searching for similar text. */
  search?: InputMaybe<Scalars['String']['input']>;
  /** The type of search to be used. Defaults to Vector. */
  searchType?: InputMaybe<SearchTypes>;
  /** Filter by similar medical indications. */
  similarIndications?: InputMaybe<Array<EntityReferenceFilter>>;
  /** Filter medicalindication(s) by their states. */
  states?: InputMaybe<Array<EntityState>>;
};

/** Represents a medical indication. */
export type MedicalIndicationInput = {
  /** The medicalindication geo-boundary, as GeoJSON Feature with Polygon geometry. */
  boundary?: InputMaybe<Scalars['String']['input']>;
  /** The medicalindication description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The medicalindication external identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The medicalindication geo-location. */
  location?: InputMaybe<PointInput>;
  /** The name of the medicalindication. */
  name: Scalars['String']['input'];
  /** The medicalindication URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents medical indication query results. */
export type MedicalIndicationResults = {
  __typename?: 'MedicalIndicationResults';
  /** The medical indication facets. */
  facets?: Maybe<Array<Maybe<MedicalIndicationFacet>>>;
  /** The medical indication results. */
  results?: Maybe<Array<Maybe<MedicalIndication>>>;
};

/** Represents a medical indication. */
export type MedicalIndicationUpdateInput = {
  /** The medicalindication geo-boundary, as GeoJSON Feature with Polygon geometry. */
  boundary?: InputMaybe<Scalars['String']['input']>;
  /** The medicalindication description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the medicalindication to update. */
  id: Scalars['ID']['input'];
  /** The medicalindication external identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The medicalindication geo-location. */
  location?: InputMaybe<PointInput>;
  /** The name of the medicalindication. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The medicalindication URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents a medical procedure. */
export type MedicalProcedure = {
  __typename?: 'MedicalProcedure';
  /** The alternate names of the medicalprocedure. */
  alternateNames?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The geo-boundary of the medicalprocedure, as GeoJSON Feature with Polygon geometry. */
  boundary?: Maybe<Scalars['String']['output']>;
  /** The creation date of the medicalprocedure. */
  creationDate: Scalars['DateTime']['output'];
  /** The medicalprocedure description. */
  description?: Maybe<Scalars['String']['output']>;
  /** The EPSG code for spatial reference of the medicalprocedure. */
  epsgCode?: Maybe<Scalars['Int']['output']>;
  /** The H3 index of the medicalprocedure. */
  h3?: Maybe<H3>;
  /** The ID of the medicalprocedure. */
  id: Scalars['ID']['output'];
  /** The medicalprocedure external identifier. */
  identifier?: Maybe<Scalars['String']['output']>;
  /** The extracted hyperlinks. */
  links?: Maybe<Array<Maybe<LinkReference>>>;
  /** The geo-location of the medicalprocedure. */
  location?: Maybe<Point>;
  /** The modified date of the medicalprocedure. */
  modifiedDate?: Maybe<Scalars['DateTime']['output']>;
  /** The name of the medicalprocedure. */
  name: Scalars['String']['output'];
  /** The relevance score of the medicalprocedure. */
  relevance?: Maybe<Scalars['Float']['output']>;
  /** The state of the medicalprocedure (i.e. created, enabled). */
  state: EntityState;
  /** The JSON-LD value of the medicalprocedure. */
  thing?: Maybe<Scalars['String']['output']>;
  /** The medicalprocedure URI. */
  uri?: Maybe<Scalars['URL']['output']>;
};

/** Represents a medical procedure facet. */
export type MedicalProcedureFacet = {
  __typename?: 'MedicalProcedureFacet';
  /** The facet count. */
  count?: Maybe<Scalars['Long']['output']>;
  /** The medical procedure facet type. */
  facet?: Maybe<MedicalProcedureFacetTypes>;
  /** The facet value range. */
  range?: Maybe<StringRange>;
  /** The facet value type. */
  type?: Maybe<FacetValueTypes>;
  /** The facet value. */
  value?: Maybe<Scalars['String']['output']>;
};

/** Represents the configuration for medical procedure facets. */
export type MedicalProcedureFacetInput = {
  /** The medical procedure facet type. */
  facet?: InputMaybe<MedicalProcedureFacetTypes>;
  /** The facet time interval. */
  timeInterval?: InputMaybe<TimeIntervalTypes>;
  /** The facet time offset (in hours). */
  timeOffset?: InputMaybe<Scalars['Int']['input']>;
};

/** Medical Procedure facet types */
export enum MedicalProcedureFacetTypes {
  /** Creation Date */
  CreationDate = 'CREATION_DATE'
}

/** Represents a filter for medical procedures. */
export type MedicalProcedureFilter = {
  /** Filter by observable physical address. */
  address?: InputMaybe<AddressFilter>;
  /** Filter by observable geo-boundaries, as GeoJSON Feature with Polygon geometry. */
  boundaries?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Filter by creation date recent timespan. For example, a timespan of one day will return medicalprocedure(s) created in the last 24 hours. */
  createdInLast?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** Filter medicalprocedure(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter by observable H3 index. */
  h3?: InputMaybe<H3Filter>;
  /** Filter medicalprocedure(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of medicalprocedure(s) to be returned. Defaults to 100. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter by observable geo-location. */
  location?: InputMaybe<PointFilter>;
  /** Filter medicalprocedure(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** When using similarity search, the number of similar items to be returned. Defaults to 100. */
  numberSimilar?: InputMaybe<Scalars['Int']['input']>;
  /** Skip the specified number of medicalprocedure(s) from the beginning of the result set. Only supported on keyword search. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** The query syntax for the search text. Defaults to Simple. */
  queryType?: InputMaybe<SearchQueryTypes>;
  /** Filter medicalprocedure(s) by searching for similar text. */
  search?: InputMaybe<Scalars['String']['input']>;
  /** The type of search to be used. Defaults to Vector. */
  searchType?: InputMaybe<SearchTypes>;
  /** Filter by similar medical procedures. */
  similarProcedures?: InputMaybe<Array<EntityReferenceFilter>>;
  /** Filter medicalprocedure(s) by their states. */
  states?: InputMaybe<Array<EntityState>>;
};

/** Represents a medical procedure. */
export type MedicalProcedureInput = {
  /** The medicalprocedure geo-boundary, as GeoJSON Feature with Polygon geometry. */
  boundary?: InputMaybe<Scalars['String']['input']>;
  /** The medicalprocedure description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The medicalprocedure external identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The medicalprocedure geo-location. */
  location?: InputMaybe<PointInput>;
  /** The name of the medicalprocedure. */
  name: Scalars['String']['input'];
  /** The medicalprocedure URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents medical procedure query results. */
export type MedicalProcedureResults = {
  __typename?: 'MedicalProcedureResults';
  /** The medical procedure facets. */
  facets?: Maybe<Array<Maybe<MedicalProcedureFacet>>>;
  /** The medical procedure results. */
  results?: Maybe<Array<Maybe<MedicalProcedure>>>;
};

/** Represents a medical procedure. */
export type MedicalProcedureUpdateInput = {
  /** The medicalprocedure geo-boundary, as GeoJSON Feature with Polygon geometry. */
  boundary?: InputMaybe<Scalars['String']['input']>;
  /** The medicalprocedure description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the medicalprocedure to update. */
  id: Scalars['ID']['input'];
  /** The medicalprocedure external identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The medicalprocedure geo-location. */
  location?: InputMaybe<PointInput>;
  /** The name of the medicalprocedure. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The medicalprocedure URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents a medical study. */
export type MedicalStudy = {
  __typename?: 'MedicalStudy';
  /** The physical address of the medical study. */
  address?: Maybe<Address>;
  /** The alternate names of the medicalstudy. */
  alternateNames?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The geo-boundary of the medicalstudy, as GeoJSON Feature with Polygon geometry. */
  boundary?: Maybe<Scalars['String']['output']>;
  /** The creation date of the medicalstudy. */
  creationDate: Scalars['DateTime']['output'];
  /** The medicalstudy description. */
  description?: Maybe<Scalars['String']['output']>;
  /** The EPSG code for spatial reference of the medicalstudy. */
  epsgCode?: Maybe<Scalars['Int']['output']>;
  /** The H3 index of the medicalstudy. */
  h3?: Maybe<H3>;
  /** The ID of the medicalstudy. */
  id: Scalars['ID']['output'];
  /** The medicalstudy external identifier. */
  identifier?: Maybe<Scalars['String']['output']>;
  /** The extracted hyperlinks. */
  links?: Maybe<Array<Maybe<LinkReference>>>;
  /** The geo-location of the medicalstudy. */
  location?: Maybe<Point>;
  /** The modified date of the medicalstudy. */
  modifiedDate?: Maybe<Scalars['DateTime']['output']>;
  /** The name of the medicalstudy. */
  name: Scalars['String']['output'];
  /** The relevance score of the medicalstudy. */
  relevance?: Maybe<Scalars['Float']['output']>;
  /** The state of the medicalstudy (i.e. created, enabled). */
  state: EntityState;
  /** The JSON-LD value of the medicalstudy. */
  thing?: Maybe<Scalars['String']['output']>;
  /** The medicalstudy URI. */
  uri?: Maybe<Scalars['URL']['output']>;
};

/** Represents a medical study facet. */
export type MedicalStudyFacet = {
  __typename?: 'MedicalStudyFacet';
  /** The facet count. */
  count?: Maybe<Scalars['Long']['output']>;
  /** The medical study facet type. */
  facet?: Maybe<MedicalStudyFacetTypes>;
  /** The facet value range. */
  range?: Maybe<StringRange>;
  /** The facet value type. */
  type?: Maybe<FacetValueTypes>;
  /** The facet value. */
  value?: Maybe<Scalars['String']['output']>;
};

/** Represents the configuration for medical study facets. */
export type MedicalStudyFacetInput = {
  /** The medical study facet type. */
  facet?: InputMaybe<MedicalStudyFacetTypes>;
  /** The facet time interval. */
  timeInterval?: InputMaybe<TimeIntervalTypes>;
  /** The facet time offset (in hours). */
  timeOffset?: InputMaybe<Scalars['Int']['input']>;
};

/** Medical Study facet types */
export enum MedicalStudyFacetTypes {
  /** Creation Date */
  CreationDate = 'CREATION_DATE'
}

/** Represents a filter for medical studies. */
export type MedicalStudyFilter = {
  /** Filter by observable physical address. */
  address?: InputMaybe<AddressFilter>;
  /** Filter by observable geo-boundaries, as GeoJSON Feature with Polygon geometry. */
  boundaries?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Filter by creation date recent timespan. For example, a timespan of one day will return medicalstudy(s) created in the last 24 hours. */
  createdInLast?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** Filter medicalstudy(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter by observable H3 index. */
  h3?: InputMaybe<H3Filter>;
  /** Filter medicalstudy(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of medicalstudy(s) to be returned. Defaults to 100. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter by observable geo-location. */
  location?: InputMaybe<PointFilter>;
  /** Filter medicalstudy(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** When using similarity search, the number of similar items to be returned. Defaults to 100. */
  numberSimilar?: InputMaybe<Scalars['Int']['input']>;
  /** Skip the specified number of medicalstudy(s) from the beginning of the result set. Only supported on keyword search. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** The query syntax for the search text. Defaults to Simple. */
  queryType?: InputMaybe<SearchQueryTypes>;
  /** Filter medicalstudy(s) by searching for similar text. */
  search?: InputMaybe<Scalars['String']['input']>;
  /** The type of search to be used. Defaults to Vector. */
  searchType?: InputMaybe<SearchTypes>;
  /** Filter by similar medical studies. */
  similarStudies?: InputMaybe<Array<EntityReferenceFilter>>;
  /** Filter medicalstudy(s) by their states. */
  states?: InputMaybe<Array<EntityState>>;
};

/** Represents a medical study. */
export type MedicalStudyInput = {
  /** The physical address of the medical study. */
  address?: InputMaybe<AddressInput>;
  /** The medicalstudy geo-boundary, as GeoJSON Feature with Polygon geometry. */
  boundary?: InputMaybe<Scalars['String']['input']>;
  /** The medicalstudy description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The medicalstudy external identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The medicalstudy geo-location. */
  location?: InputMaybe<PointInput>;
  /** The name of the medicalstudy. */
  name: Scalars['String']['input'];
  /** The medicalstudy URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents medical study query results. */
export type MedicalStudyResults = {
  __typename?: 'MedicalStudyResults';
  /** The medical study facets. */
  facets?: Maybe<Array<Maybe<MedicalStudyFacet>>>;
  /** The medical study H3 facets. */
  h3?: Maybe<H3Facets>;
  /** The medical study results. */
  results?: Maybe<Array<Maybe<MedicalStudy>>>;
};

/** Represents a medical study. */
export type MedicalStudyUpdateInput = {
  /** The physical address of the medical study. */
  address?: InputMaybe<AddressInput>;
  /** The medicalstudy geo-boundary, as GeoJSON Feature with Polygon geometry. */
  boundary?: InputMaybe<Scalars['String']['input']>;
  /** The medicalstudy description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the medicalstudy to update. */
  id: Scalars['ID']['input'];
  /** The medicalstudy external identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The medicalstudy geo-location. */
  location?: InputMaybe<PointInput>;
  /** The name of the medicalstudy. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The medicalstudy URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents a medical test. */
export type MedicalTest = {
  __typename?: 'MedicalTest';
  /** The alternate names of the medicaltest. */
  alternateNames?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The geo-boundary of the medicaltest, as GeoJSON Feature with Polygon geometry. */
  boundary?: Maybe<Scalars['String']['output']>;
  /** The creation date of the medicaltest. */
  creationDate: Scalars['DateTime']['output'];
  /** The medicaltest description. */
  description?: Maybe<Scalars['String']['output']>;
  /** The EPSG code for spatial reference of the medicaltest. */
  epsgCode?: Maybe<Scalars['Int']['output']>;
  /** The H3 index of the medicaltest. */
  h3?: Maybe<H3>;
  /** The ID of the medicaltest. */
  id: Scalars['ID']['output'];
  /** The medicaltest external identifier. */
  identifier?: Maybe<Scalars['String']['output']>;
  /** The extracted hyperlinks. */
  links?: Maybe<Array<Maybe<LinkReference>>>;
  /** The geo-location of the medicaltest. */
  location?: Maybe<Point>;
  /** The modified date of the medicaltest. */
  modifiedDate?: Maybe<Scalars['DateTime']['output']>;
  /** The name of the medicaltest. */
  name: Scalars['String']['output'];
  /** The relevance score of the medicaltest. */
  relevance?: Maybe<Scalars['Float']['output']>;
  /** The state of the medicaltest (i.e. created, enabled). */
  state: EntityState;
  /** The JSON-LD value of the medicaltest. */
  thing?: Maybe<Scalars['String']['output']>;
  /** The medicaltest URI. */
  uri?: Maybe<Scalars['URL']['output']>;
};

/** Represents a medical test facet. */
export type MedicalTestFacet = {
  __typename?: 'MedicalTestFacet';
  /** The facet count. */
  count?: Maybe<Scalars['Long']['output']>;
  /** The medical test facet type. */
  facet?: Maybe<MedicalTestFacetTypes>;
  /** The facet value range. */
  range?: Maybe<StringRange>;
  /** The facet value type. */
  type?: Maybe<FacetValueTypes>;
  /** The facet value. */
  value?: Maybe<Scalars['String']['output']>;
};

/** Represents the configuration for medical test facets. */
export type MedicalTestFacetInput = {
  /** The medical test facet type. */
  facet?: InputMaybe<MedicalTestFacetTypes>;
  /** The facet time interval. */
  timeInterval?: InputMaybe<TimeIntervalTypes>;
  /** The facet time offset (in hours). */
  timeOffset?: InputMaybe<Scalars['Int']['input']>;
};

/** Medical Test facet types */
export enum MedicalTestFacetTypes {
  /** Creation Date */
  CreationDate = 'CREATION_DATE'
}

/** Represents a filter for medical tests. */
export type MedicalTestFilter = {
  /** Filter by observable physical address. */
  address?: InputMaybe<AddressFilter>;
  /** Filter by observable geo-boundaries, as GeoJSON Feature with Polygon geometry. */
  boundaries?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Filter by creation date recent timespan. For example, a timespan of one day will return medicaltest(s) created in the last 24 hours. */
  createdInLast?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** Filter medicaltest(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter by observable H3 index. */
  h3?: InputMaybe<H3Filter>;
  /** Filter medicaltest(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of medicaltest(s) to be returned. Defaults to 100. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter by observable geo-location. */
  location?: InputMaybe<PointFilter>;
  /** Filter medicaltest(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** When using similarity search, the number of similar items to be returned. Defaults to 100. */
  numberSimilar?: InputMaybe<Scalars['Int']['input']>;
  /** Skip the specified number of medicaltest(s) from the beginning of the result set. Only supported on keyword search. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** The query syntax for the search text. Defaults to Simple. */
  queryType?: InputMaybe<SearchQueryTypes>;
  /** Filter medicaltest(s) by searching for similar text. */
  search?: InputMaybe<Scalars['String']['input']>;
  /** The type of search to be used. Defaults to Vector. */
  searchType?: InputMaybe<SearchTypes>;
  /** Filter by similar medical tests. */
  similarTests?: InputMaybe<Array<EntityReferenceFilter>>;
  /** Filter medicaltest(s) by their states. */
  states?: InputMaybe<Array<EntityState>>;
};

/** Represents a medical test. */
export type MedicalTestInput = {
  /** The medicaltest geo-boundary, as GeoJSON Feature with Polygon geometry. */
  boundary?: InputMaybe<Scalars['String']['input']>;
  /** The medicaltest description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The medicaltest external identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The medicaltest geo-location. */
  location?: InputMaybe<PointInput>;
  /** The name of the medicaltest. */
  name: Scalars['String']['input'];
  /** The medicaltest URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents medical test query results. */
export type MedicalTestResults = {
  __typename?: 'MedicalTestResults';
  /** The medical test facets. */
  facets?: Maybe<Array<Maybe<MedicalTestFacet>>>;
  /** The medical test results. */
  results?: Maybe<Array<Maybe<MedicalTest>>>;
};

/** Represents a medical test. */
export type MedicalTestUpdateInput = {
  /** The medicaltest geo-boundary, as GeoJSON Feature with Polygon geometry. */
  boundary?: InputMaybe<Scalars['String']['input']>;
  /** The medicaltest description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the medicaltest to update. */
  id: Scalars['ID']['input'];
  /** The medicaltest external identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The medicaltest geo-location. */
  location?: InputMaybe<PointInput>;
  /** The name of the medicaltest. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The medicaltest URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents a medical therapy. */
export type MedicalTherapy = {
  __typename?: 'MedicalTherapy';
  /** The alternate names of the medicaltherapy. */
  alternateNames?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The geo-boundary of the medicaltherapy, as GeoJSON Feature with Polygon geometry. */
  boundary?: Maybe<Scalars['String']['output']>;
  /** The creation date of the medicaltherapy. */
  creationDate: Scalars['DateTime']['output'];
  /** The medicaltherapy description. */
  description?: Maybe<Scalars['String']['output']>;
  /** The EPSG code for spatial reference of the medicaltherapy. */
  epsgCode?: Maybe<Scalars['Int']['output']>;
  /** The H3 index of the medicaltherapy. */
  h3?: Maybe<H3>;
  /** The ID of the medicaltherapy. */
  id: Scalars['ID']['output'];
  /** The medicaltherapy external identifier. */
  identifier?: Maybe<Scalars['String']['output']>;
  /** The extracted hyperlinks. */
  links?: Maybe<Array<Maybe<LinkReference>>>;
  /** The geo-location of the medicaltherapy. */
  location?: Maybe<Point>;
  /** The modified date of the medicaltherapy. */
  modifiedDate?: Maybe<Scalars['DateTime']['output']>;
  /** The name of the medicaltherapy. */
  name: Scalars['String']['output'];
  /** The relevance score of the medicaltherapy. */
  relevance?: Maybe<Scalars['Float']['output']>;
  /** The state of the medicaltherapy (i.e. created, enabled). */
  state: EntityState;
  /** The JSON-LD value of the medicaltherapy. */
  thing?: Maybe<Scalars['String']['output']>;
  /** The medicaltherapy URI. */
  uri?: Maybe<Scalars['URL']['output']>;
};

/** Represents a medical therapy facet. */
export type MedicalTherapyFacet = {
  __typename?: 'MedicalTherapyFacet';
  /** The facet count. */
  count?: Maybe<Scalars['Long']['output']>;
  /** The medical therapy facet type. */
  facet?: Maybe<MedicalTherapyFacetTypes>;
  /** The facet value range. */
  range?: Maybe<StringRange>;
  /** The facet value type. */
  type?: Maybe<FacetValueTypes>;
  /** The facet value. */
  value?: Maybe<Scalars['String']['output']>;
};

/** Represents the configuration for medical therapy facets. */
export type MedicalTherapyFacetInput = {
  /** The medical therapy facet type. */
  facet?: InputMaybe<MedicalTherapyFacetTypes>;
  /** The facet time interval. */
  timeInterval?: InputMaybe<TimeIntervalTypes>;
  /** The facet time offset (in hours). */
  timeOffset?: InputMaybe<Scalars['Int']['input']>;
};

/** Medical Therapy facet types */
export enum MedicalTherapyFacetTypes {
  /** Creation Date */
  CreationDate = 'CREATION_DATE'
}

/** Represents a filter for medical therapies. */
export type MedicalTherapyFilter = {
  /** Filter by observable physical address. */
  address?: InputMaybe<AddressFilter>;
  /** Filter by observable geo-boundaries, as GeoJSON Feature with Polygon geometry. */
  boundaries?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Filter by creation date recent timespan. For example, a timespan of one day will return medicaltherapy(s) created in the last 24 hours. */
  createdInLast?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** Filter medicaltherapy(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter by observable H3 index. */
  h3?: InputMaybe<H3Filter>;
  /** Filter medicaltherapy(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of medicaltherapy(s) to be returned. Defaults to 100. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter by observable geo-location. */
  location?: InputMaybe<PointFilter>;
  /** Filter medicaltherapy(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** When using similarity search, the number of similar items to be returned. Defaults to 100. */
  numberSimilar?: InputMaybe<Scalars['Int']['input']>;
  /** Skip the specified number of medicaltherapy(s) from the beginning of the result set. Only supported on keyword search. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** The query syntax for the search text. Defaults to Simple. */
  queryType?: InputMaybe<SearchQueryTypes>;
  /** Filter medicaltherapy(s) by searching for similar text. */
  search?: InputMaybe<Scalars['String']['input']>;
  /** The type of search to be used. Defaults to Vector. */
  searchType?: InputMaybe<SearchTypes>;
  /** Filter by similar medical therapies. */
  similarTherapies?: InputMaybe<Array<EntityReferenceFilter>>;
  /** Filter medicaltherapy(s) by their states. */
  states?: InputMaybe<Array<EntityState>>;
};

/** Represents a medical therapy. */
export type MedicalTherapyInput = {
  /** The medicaltherapy geo-boundary, as GeoJSON Feature with Polygon geometry. */
  boundary?: InputMaybe<Scalars['String']['input']>;
  /** The medicaltherapy description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The medicaltherapy external identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The medicaltherapy geo-location. */
  location?: InputMaybe<PointInput>;
  /** The name of the medicaltherapy. */
  name: Scalars['String']['input'];
  /** The medicaltherapy URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents medical therapy query results. */
export type MedicalTherapyResults = {
  __typename?: 'MedicalTherapyResults';
  /** The medical therapy facets. */
  facets?: Maybe<Array<Maybe<MedicalTherapyFacet>>>;
  /** The medical therapy results. */
  results?: Maybe<Array<Maybe<MedicalTherapy>>>;
};

/** Represents a medical therapy. */
export type MedicalTherapyUpdateInput = {
  /** The medicaltherapy geo-boundary, as GeoJSON Feature with Polygon geometry. */
  boundary?: InputMaybe<Scalars['String']['input']>;
  /** The medicaltherapy description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the medicaltherapy to update. */
  id: Scalars['ID']['input'];
  /** The medicaltherapy external identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The medicaltherapy geo-location. */
  location?: InputMaybe<PointInput>;
  /** The name of the medicaltherapy. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The medicaltherapy URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents metadata. */
export type Metadata = {
  __typename?: 'Metadata';
  /** The parent content. */
  content?: Maybe<Content>;
  /** The creation date of the metadata. */
  creationDate: Scalars['DateTime']['output'];
  /** The ID of the metadata. */
  id: Scalars['ID']['output'];
  /** The metadata length. */
  length?: Maybe<Scalars['Long']['output']>;
  /** The metadata MIME type. */
  mimeType?: Maybe<Scalars['String']['output']>;
  /** The modified date of the metadata. */
  modifiedDate?: Maybe<Scalars['DateTime']['output']>;
  /** The name of the metadata. */
  name: Scalars['String']['output'];
  /** The owner of the metadata. */
  owner: Owner;
  /** The relevance score of the metadata. */
  relevance?: Maybe<Scalars['Float']['output']>;
  /** The state of the metadata (i.e. created, finished). */
  state: EntityState;
  /** The metadata type. */
  type?: Maybe<MetadataTypes>;
  /** The metadata value. */
  value?: Maybe<Scalars['String']['output']>;
  /** The metadata value type. */
  valueType?: Maybe<Scalars['String']['output']>;
};

/** Represents a filter for metadata. */
export type MetadataFilter = {
  /** Filter by parent content. */
  content?: InputMaybe<EntityReferenceFilter>;
  /** Filter by creation date recent timespan. For example, a timespan of one day will return metadata(s) created in the last 24 hours. */
  createdInLast?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** Filter metadata(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter metadata(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of metadata(s) to be returned. Defaults to 100. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter by metadata types. */
  metadataTypes?: InputMaybe<Array<InputMaybe<MetadataTypes>>>;
  /** Filter metadata(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Skip the specified number of metadata(s) from the beginning of the result set. Only supported on keyword search. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** Filter metadata(s) by searching for similar text. */
  search?: InputMaybe<Scalars['String']['input']>;
  /** Filter metadata(s) by their states. */
  states?: InputMaybe<Array<EntityState>>;
};

/** Represents metadata. */
export type MetadataInput = {
  /** The parent content. */
  content?: InputMaybe<EntityReferenceInput>;
  /** The metadata MIME type. */
  mimeType?: InputMaybe<Scalars['String']['input']>;
  /** The name of the metadata. */
  name: Scalars['String']['input'];
  /** The metadata value. */
  value?: InputMaybe<Scalars['String']['input']>;
};

/** Metadata type */
export enum MetadataTypes {
  /** Content metadata */
  Content = 'CONTENT'
}

/** Represents metadata. */
export type MetadataUpdateInput = {
  /** The parent content. */
  content?: InputMaybe<EntityReferenceInput>;
  /** The ID of the metadata to update. */
  id: Scalars['ID']['input'];
  /** The metadata MIME type. */
  mimeType?: InputMaybe<Scalars['String']['input']>;
  /** The name of the metadata. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The metadata value. */
  value?: InputMaybe<Scalars['String']['input']>;
};

/** Represents Microsoft authentication properties. */
export type MicrosoftAuthenticationProperties = {
  __typename?: 'MicrosoftAuthenticationProperties';
  /** Microsoft Entra ID client ID. */
  clientId: Scalars['String']['output'];
  /** Microsoft Entra ID client secret. */
  clientSecret: Scalars['String']['output'];
  /** Microsoft Entra ID tenant ID. */
  tenantId: Scalars['ID']['output'];
};

/** Represents Microsoft authentication properties. */
export type MicrosoftAuthenticationPropertiesInput = {
  /** Microsoft Entra ID client ID. */
  clientId: Scalars['String']['input'];
  /** Microsoft Entra ID client secret. */
  clientSecret: Scalars['String']['input'];
  /** Microsoft Entra ID tenant ID. */
  tenantId: Scalars['ID']['input'];
};

/** Represents Microsoft Email feed properties. */
export type MicrosoftEmailFeedProperties = {
  __typename?: 'MicrosoftEmailFeedProperties';
  /** Microsoft Email client identifier. */
  clientId: Scalars['String']['output'];
  /** Microsoft Email client secret. */
  clientSecret: Scalars['String']['output'];
  /** Whether to exclude Sent messages in email listing. Default is False. */
  excludeSentItems?: Maybe<Scalars['Boolean']['output']>;
  /** Whether to only read past emails from Inbox. Default is False. */
  inboxOnly?: Maybe<Scalars['Boolean']['output']>;
  /** Whether to include Deleted messages in email listing. Default is False. */
  includeDeletedItems?: Maybe<Scalars['Boolean']['output']>;
  /** Whether to include Spam messages in email listing. Default is False. */
  includeSpam?: Maybe<Scalars['Boolean']['output']>;
  /** Microsoft Email refresh token. */
  refreshToken: Scalars['String']['output'];
  /** Email listing type, i.e. past or new emails. */
  type?: Maybe<EmailListingTypes>;
};

/** Represents Microsoft Email feed properties. */
export type MicrosoftEmailFeedPropertiesInput = {
  /** Microsoft Email client identifier. */
  clientId: Scalars['String']['input'];
  /** Microsoft Email client secret. */
  clientSecret: Scalars['String']['input'];
  /** Whether to exclude Sent messages in email listing. Default is False. */
  excludeSentItems?: InputMaybe<Scalars['Boolean']['input']>;
  /** Whether to only read past emails from Inbox. Default is False. */
  inboxOnly?: InputMaybe<Scalars['Boolean']['input']>;
  /** Whether to include Deleted messages in email listing. Default is False. */
  includeDeletedItems?: InputMaybe<Scalars['Boolean']['input']>;
  /** Whether to include Spam messages in email listing. Default is False. */
  includeSpam?: InputMaybe<Scalars['Boolean']['input']>;
  /** Microsoft Email refresh token. */
  refreshToken: Scalars['String']['input'];
  /** Email listing type, i.e. past or new emails. */
  type?: InputMaybe<EmailListingTypes>;
};

/** Represents Microsoft Email feed properties. */
export type MicrosoftEmailFeedPropertiesUpdateInput = {
  /** Microsoft Email client identifier. */
  clientId?: InputMaybe<Scalars['String']['input']>;
  /** Microsoft Email client secret. */
  clientSecret?: InputMaybe<Scalars['String']['input']>;
  /** Whether to exclude Sent messages in email listing. Default is False. */
  excludeSentItems?: InputMaybe<Scalars['Boolean']['input']>;
  /** Whether to only read past emails from Inbox. Default is False. */
  inboxOnly?: InputMaybe<Scalars['Boolean']['input']>;
  /** Whether to include Deleted messages in email listing. Default is False. */
  includeDeletedItems?: InputMaybe<Scalars['Boolean']['input']>;
  /** Whether to include Spam messages in email listing. Default is False. */
  includeSpam?: InputMaybe<Scalars['Boolean']['input']>;
  /** Microsoft Email refresh token. */
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  /** Email listing type, i.e. past or new emails. */
  type?: InputMaybe<EmailListingTypes>;
};

/** Represents a Microsoft Teams channel. */
export type MicrosoftTeamsChannelResult = {
  __typename?: 'MicrosoftTeamsChannelResult';
  /** The Microsoft Teams channel identifier. */
  channelId?: Maybe<Scalars['ID']['output']>;
  /** The Microsoft Teams channel name. */
  channelName?: Maybe<Scalars['String']['output']>;
};

/** Represents Microsoft Teams channels. */
export type MicrosoftTeamsChannelResults = {
  __typename?: 'MicrosoftTeamsChannelResults';
  /** The Microsoft Teams channels. */
  results?: Maybe<Array<Maybe<MicrosoftTeamsChannelResult>>>;
};

/** Represents Microsoft Teams team channels properties. */
export type MicrosoftTeamsChannelsInput = {
  /** Microsoft Teams refresh token. */
  refreshToken: Scalars['String']['input'];
};

/** Represents Microsoft Teams feed properties. */
export type MicrosoftTeamsFeedProperties = {
  __typename?: 'MicrosoftTeamsFeedProperties';
  /** Microsoft Teams channel identifier. */
  channelId: Scalars['String']['output'];
  /** Microsoft Teams client identifier. */
  clientId: Scalars['String']['output'];
  /** Microsoft Teams client secret. */
  clientSecret: Scalars['String']['output'];
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: Maybe<Scalars['Int']['output']>;
  /** Microsoft Teams refresh token. */
  refreshToken: Scalars['String']['output'];
  /** Microsoft Teams team identifier. */
  teamId: Scalars['String']['output'];
  /** Feed listing type, i.e. past or new messages. */
  type?: Maybe<FeedListingTypes>;
};

/** Represents Microsoft Teams feed properties. */
export type MicrosoftTeamsFeedPropertiesInput = {
  /** Microsoft Teams channel identifier. */
  channelId: Scalars['String']['input'];
  /** Microsoft Teams client identifier. */
  clientId: Scalars['String']['input'];
  /** Microsoft Teams client secret. */
  clientSecret: Scalars['String']['input'];
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: InputMaybe<Scalars['Int']['input']>;
  /** Microsoft Teams refresh token. */
  refreshToken: Scalars['String']['input'];
  /** Microsoft Teams team identifier. */
  teamId: Scalars['String']['input'];
  /** Feed listing type, i.e. past or new messages. */
  type?: InputMaybe<FeedListingTypes>;
};

/** Represents Microsoft Teams feed properties. */
export type MicrosoftTeamsFeedPropertiesUpdateInput = {
  /** Microsoft Teams channel identifier. */
  channelId: Scalars['String']['input'];
  /** Microsoft Teams client identifier. */
  clientId?: InputMaybe<Scalars['String']['input']>;
  /** Microsoft Teams client secret. */
  clientSecret?: InputMaybe<Scalars['String']['input']>;
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: InputMaybe<Scalars['Int']['input']>;
  /** Microsoft Teams refresh token. */
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  /** Microsoft Teams team identifier. */
  teamId: Scalars['String']['input'];
  /** Feed listing type, i.e. past or new messages. */
  type?: InputMaybe<FeedListingTypes>;
};

/** Represents a Microsoft Teams team. */
export type MicrosoftTeamsTeamResult = {
  __typename?: 'MicrosoftTeamsTeamResult';
  /** The Microsoft Teams team identifier. */
  teamId?: Maybe<Scalars['ID']['output']>;
  /** The Microsoft Teams team name. */
  teamName?: Maybe<Scalars['String']['output']>;
};

/** Represents Microsoft Teams teams. */
export type MicrosoftTeamsTeamResults = {
  __typename?: 'MicrosoftTeamsTeamResults';
  /** The Microsoft Teams teams. */
  results?: Maybe<Array<Maybe<MicrosoftTeamsTeamResult>>>;
};

/** Represents Microsoft Teams teams properties. */
export type MicrosoftTeamsTeamsInput = {
  /** Microsoft Teams refresh token. */
  refreshToken: Scalars['String']['input'];
};

/** Represents the Mistral document preparation properties. */
export type MistralDocumentPreparationProperties = {
  __typename?: 'MistralDocumentPreparationProperties';
  /** The Mistral API key, optional. */
  key?: Maybe<Scalars['String']['output']>;
};

/** Represents the Mistral document preparation properties. */
export type MistralDocumentPreparationPropertiesInput = {
  /** The Mistral API key, optional. */
  key?: InputMaybe<Scalars['String']['input']>;
};

/** Represents Mistral model properties. */
export type MistralModelProperties = {
  __typename?: 'MistralModelProperties';
  /** The limit of tokens per embedded text chunk, defaults to 600. */
  chunkTokenLimit?: Maybe<Scalars['Int']['output']>;
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: Maybe<Scalars['Int']['output']>;
  /** The Mistral API endpoint, if using developer's own account. */
  endpoint?: Maybe<Scalars['URL']['output']>;
  /** The Mistral API key, if using developer's own account. */
  key?: Maybe<Scalars['String']['output']>;
  /** The Mistral model, or custom, when using developer's own account. */
  model: MistralModels;
  /** The Mistral model name, if using developer's own account. */
  modelName?: Maybe<Scalars['String']['output']>;
  /** The model token probability. */
  probability?: Maybe<Scalars['Float']['output']>;
  /** The model temperature. */
  temperature?: Maybe<Scalars['Float']['output']>;
  /** The number of tokens which can provided to the Mistral model, if using developer's own account. */
  tokenLimit?: Maybe<Scalars['Int']['output']>;
};

/** Represents Mistral model properties. */
export type MistralModelPropertiesInput = {
  /** The limit of tokens per embedded text chunk, defaults to 600. */
  chunkTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The Mistral API endpoint, if using developer's own account. */
  endpoint?: InputMaybe<Scalars['URL']['input']>;
  /** The Mistral API key, if using developer's own account. */
  key?: InputMaybe<Scalars['String']['input']>;
  /** The Mistral model, or custom, when using developer's own account. */
  model: MistralModels;
  /** The Mistral model name, if using developer's own account. */
  modelName?: InputMaybe<Scalars['String']['input']>;
  /** The model token probability. */
  probability?: InputMaybe<Scalars['Float']['input']>;
  /** The model temperature. */
  temperature?: InputMaybe<Scalars['Float']['input']>;
  /** The number of tokens which can provided to the Mistral model, if using developer's own account. */
  tokenLimit?: InputMaybe<Scalars['Int']['input']>;
};

/** Represents Mistral model properties. */
export type MistralModelPropertiesUpdateInput = {
  /** The limit of tokens per embedded text chunk, defaults to 600. */
  chunkTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The Mistral API endpoint, if using developer's own account. */
  endpoint?: InputMaybe<Scalars['URL']['input']>;
  /** The Mistral API key, if using developer's own account. */
  key?: InputMaybe<Scalars['String']['input']>;
  /** The Mistral model, or custom, when using developer's own account. */
  model?: InputMaybe<MistralModels>;
  /** The Mistral model name, if using developer's own account. */
  modelName?: InputMaybe<Scalars['String']['input']>;
  /** The model token probability. */
  probability?: InputMaybe<Scalars['Float']['input']>;
  /** The model temperature. */
  temperature?: InputMaybe<Scalars['Float']['input']>;
  /** The number of tokens which can provided to the Mistral model, if using developer's own account. */
  tokenLimit?: InputMaybe<Scalars['Int']['input']>;
};

/** Mistral model type */
export enum MistralModels {
  /** Developer-specified model */
  Custom = 'CUSTOM',
  /** Mistral Embed */
  MistralEmbed = 'MISTRAL_EMBED',
  /** Mistral Large */
  MistralLarge = 'MISTRAL_LARGE',
  /** Mistral Medium */
  MistralMedium = 'MISTRAL_MEDIUM',
  /** Mistral Nemo */
  MistralNemo = 'MISTRAL_NEMO',
  /** Mistral Small */
  MistralSmall = 'MISTRAL_SMALL',
  /** Mixtral 8x7b Instruct */
  Mixtral_8X7BInstruct = 'MIXTRAL_8X7B_INSTRUCT',
  /** Pixtral 12b (2024-09 version) */
  Pixtral_12B_2409 = 'PIXTRAL_12B_2409',
  /** Pixtral Large */
  PixtralLarge = 'PIXTRAL_LARGE'
}

/** Represents a model card. */
export type ModelCard = {
  __typename?: 'ModelCard';
  /** The platforms where the model is available. */
  availableOn?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The model description. */
  description?: Maybe<Scalars['String']['output']>;
  /** The features of the model. */
  features?: Maybe<ModelFeatures>;
  /** The model metadata, including pricing information per million tokens. */
  metadata?: Maybe<ModelMetadata>;
  /** The model enum to use with the specification, i.e. GPT4O_128K. */
  model?: Maybe<Scalars['String']['output']>;
  /** The model enum type to use with the specification, i.e. OpenAIModels. */
  modelType?: Maybe<Scalars['String']['output']>;
  /** The model name. */
  name: Scalars['String']['output'];
  /** The model service type. */
  serviceType?: Maybe<ModelServiceTypes>;
  /** The type of model, i.e. completion, text embedding, reranking. */
  type?: Maybe<ModelTypes>;
  /** The model card URI. */
  uri?: Maybe<Scalars['URL']['output']>;
};

/** Represents a list of model card results. */
export type ModelCardResults = {
  __typename?: 'ModelCardResults';
  /** The list of model cards. */
  results?: Maybe<Array<ModelCard>>;
};

/** Represents the model content classification properties. */
export type ModelContentClassificationProperties = {
  __typename?: 'ModelContentClassificationProperties';
  /** The LLM prompt content classification rules. */
  rules?: Maybe<Array<Maybe<PromptClassificationRule>>>;
  /** The LLM specification used for content classification. */
  specification?: Maybe<EntityReference>;
};

/** Represents the model content classification properties. */
export type ModelContentClassificationPropertiesInput = {
  /** The LLM prompt content classification rules. */
  rules?: InputMaybe<Array<InputMaybe<PromptClassificationRuleInput>>>;
  /** The LLM specification used for content classification. */
  specification?: InputMaybe<EntityReferenceInput>;
};

/** Represents the LLM document preparation properties. */
export type ModelDocumentPreparationProperties = {
  __typename?: 'ModelDocumentPreparationProperties';
  /** The LLM specification, optional. */
  specification?: Maybe<EntityReference>;
};

/** Represents the LLM document preparation properties. */
export type ModelDocumentPreparationPropertiesInput = {
  /** The LLM specification, optional. */
  specification?: InputMaybe<EntityReferenceInput>;
};

/** Represents model features. */
export type ModelFeatures = {
  __typename?: 'ModelFeatures';
  /** Key features of the model. */
  keyFeatures?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Strengths of the model. */
  strengths?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Potential use cases for the model. */
  useCases?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

/** Represents a filter for LLM models. */
export type ModelFilter = {
  /** Filter by LLM service types. */
  serviceTypes?: InputMaybe<Array<InputMaybe<ModelServiceTypes>>>;
  /** Filter by LLM model types. */
  types?: InputMaybe<Array<InputMaybe<ModelTypes>>>;
};

/** Represents an LLM image entity extraction connector. */
export type ModelImageExtractionProperties = {
  __typename?: 'ModelImageExtractionProperties';
  /** The LLM specification used for entity extraction. */
  specification?: Maybe<EntityReference>;
};

/** Represents an LLM image entity extraction connector. */
export type ModelImageExtractionPropertiesInput = {
  /** The LLM specification used for entity extraction. */
  specification?: InputMaybe<EntityReferenceInput>;
};

/** Represents model metadata. */
export type ModelMetadata = {
  __typename?: 'ModelMetadata';
  /** The completion cost per-million tokens. */
  completionCostPerMillion?: Maybe<Scalars['Float']['output']>;
  /** The context window of the model in tokens. */
  contextWindowTokens?: Maybe<Scalars['Int']['output']>;
  /** The embedding cost per-million tokens. */
  embeddingsCostPerMillion?: Maybe<Scalars['Float']['output']>;
  /** The knowledge cutoff date of the model. */
  knowledgeCutoff?: Maybe<Scalars['Date']['output']>;
  /** The maximum number of output tokens that can be returned by the model. */
  maxOutputTokens?: Maybe<Scalars['Int']['output']>;
  /** Whether the model supports multilingual input. */
  multilingual?: Maybe<Scalars['Boolean']['output']>;
  /** Whether the model supports multimodal input. */
  multimodal?: Maybe<Scalars['Boolean']['output']>;
  /** The prompt cost per-million tokens. */
  promptCostPerMillion?: Maybe<Scalars['Float']['output']>;
  /** The reranking cost per-million tokens. */
  rerankingCostPerMillion?: Maybe<Scalars['Float']['output']>;
};

/** Model service type */
export enum ModelServiceTypes {
  /** Anthropic */
  Anthropic = 'ANTHROPIC',
  /** Azure AI */
  AzureAi = 'AZURE_AI',
  /** Azure OpenAI */
  AzureOpenAi = 'AZURE_OPEN_AI',
  /** Bedrock */
  Bedrock = 'BEDROCK',
  /** Cerebras */
  Cerebras = 'CEREBRAS',
  /** Cohere */
  Cohere = 'COHERE',
  /** Deepseek */
  Deepseek = 'DEEPSEEK',
  /** Google */
  Google = 'GOOGLE',
  /** Groq */
  Groq = 'GROQ',
  /** Jina */
  Jina = 'JINA',
  /** Mistral */
  Mistral = 'MISTRAL',
  /** OpenAI */
  OpenAi = 'OPEN_AI',
  /** Replicate */
  Replicate = 'REPLICATE',
  /** Voyage */
  Voyage = 'VOYAGE'
}

/** Represents an LLM text entity extraction connector. */
export type ModelTextExtractionProperties = {
  __typename?: 'ModelTextExtractionProperties';
  /** The LLM specification used for entity extraction. */
  specification?: Maybe<EntityReference>;
};

/** Represents an LLM text entity extraction connector. */
export type ModelTextExtractionPropertiesInput = {
  /** The LLM specification used for entity extraction. */
  specification?: InputMaybe<EntityReferenceInput>;
};

/** Model type */
export enum ModelTypes {
  /** Prompt completion */
  Completion = 'COMPLETION',
  /** Image embedding */
  ImageEmbedding = 'IMAGE_EMBEDDING',
  /** Multimodal embedding */
  MultimodalEmbedding = 'MULTIMODAL_EMBEDDING',
  /** Content reranking */
  Reranking = 'RERANKING',
  /** Text embedding */
  TextEmbedding = 'TEXT_EMBEDDING'
}

export type Mutation = {
  __typename?: 'Mutation';
  /**
   * Adds contents to a collection.
   * @deprecated Use addContentsToCollections instead.
   */
  addCollectionContents?: Maybe<Collection>;
  /** Adds contents to one or more collections. */
  addContentsToCollections?: Maybe<Array<Maybe<Collection>>>;
  /** Ask questions about the Graphlit API or SDKs. Can create code samples for any API call. */
  askGraphlit?: Maybe<AskGraphlit>;
  /** Clears an existing conversation. */
  clearConversation?: Maybe<Conversation>;
  /** Closes an existing collection. */
  closeCollection?: Maybe<Collection>;
  /** Closes an existing conversation. */
  closeConversation?: Maybe<Conversation>;
  /** Complete a conversation with LLM assistant message. */
  completeConversation?: Maybe<PromptConversation>;
  /** Provide responses to called tools which continues prompted conversation. */
  continueConversation?: Maybe<PromptConversation>;
  /** Creates a new alert. */
  createAlert?: Maybe<Alert>;
  /** Creates a new category. */
  createCategory?: Maybe<Category>;
  /** Creates a new collection. */
  createCollection?: Maybe<Collection>;
  /** Creates a new connector. */
  createConnector?: Maybe<Connector>;
  /** Creates a new conversation. */
  createConversation?: Maybe<Conversation>;
  /** Creates a new event. */
  createEvent?: Maybe<Event>;
  /** Creates a new feed. */
  createFeed?: Maybe<Feed>;
  /** Creates a new label. */
  createLabel?: Maybe<Label>;
  /** Creates a new medical condition. */
  createMedicalCondition?: Maybe<MedicalCondition>;
  /** Creates a new medical contraindication. */
  createMedicalContraindication?: Maybe<MedicalContraindication>;
  /** Creates a new medical device. */
  createMedicalDevice?: Maybe<MedicalDevice>;
  /** Creates a new medical drug. */
  createMedicalDrug?: Maybe<MedicalDrug>;
  /** Creates a new medical drug class. */
  createMedicalDrugClass?: Maybe<MedicalDrugClass>;
  /** Creates a new medical guideline. */
  createMedicalGuideline?: Maybe<MedicalGuideline>;
  /** Creates a new medical indication. */
  createMedicalIndication?: Maybe<MedicalIndication>;
  /** Creates a new medical procedure. */
  createMedicalProcedure?: Maybe<MedicalProcedure>;
  /** Creates a new medical study. */
  createMedicalStudy?: Maybe<MedicalStudy>;
  /** Creates a new medical test. */
  createMedicalTest?: Maybe<MedicalTest>;
  /** Creates a new medical therapy. */
  createMedicalTherapy?: Maybe<MedicalTherapy>;
  /** Creates a new observation. */
  createObservation?: Maybe<Observation>;
  /** Creates a new organization. */
  createOrganization?: Maybe<Organization>;
  /** Creates a new person. */
  createPerson?: Maybe<Person>;
  /** Creates a new place. */
  createPlace?: Maybe<Place>;
  /** Creates a new product. */
  createProduct?: Maybe<Product>;
  /** Creates a new repo. */
  createRepo?: Maybe<Repo>;
  /** Creates a new software. */
  createSoftware?: Maybe<Software>;
  /** Creates a new LLM specification. */
  createSpecification?: Maybe<Specification>;
  /** Creates a new user. */
  createUser?: Maybe<User>;
  /** Creates a new content workflow. */
  createWorkflow?: Maybe<Workflow>;
  /** Deletes an alert. */
  deleteAlert?: Maybe<Alert>;
  /** Bulk deletes alerts. */
  deleteAlerts?: Maybe<Array<Maybe<Alert>>>;
  /** Bulk deletes alerts based on the provided filter criteria. */
  deleteAllAlerts?: Maybe<Array<Maybe<Alert>>>;
  /** Bulk deletes categories based on the provided filter criteria. */
  deleteAllCategories?: Maybe<Array<Maybe<Category>>>;
  /** Bulk deletes collections based on the provided filter criteria. */
  deleteAllCollections?: Maybe<Array<Maybe<Collection>>>;
  /** Bulk deletes content based on the provided filter criteria. */
  deleteAllContents?: Maybe<Array<Maybe<Content>>>;
  /** Bulk deletes conversations based on the provided filter criteria. */
  deleteAllConversations?: Maybe<Array<Maybe<Conversation>>>;
  /** Bulk deletes events based on the provided filter criteria. */
  deleteAllEvents?: Maybe<Array<Maybe<Event>>>;
  /** Bulk deletes feeds based on the provided filter criteria. */
  deleteAllFeeds?: Maybe<Array<Maybe<Feed>>>;
  /** Bulk deletes labels based on the provided filter criteria. */
  deleteAllLabels?: Maybe<Array<Maybe<Label>>>;
  /** Bulk deletes medical conditions based on the provided filter criteria. */
  deleteAllMedicalConditions?: Maybe<Array<Maybe<MedicalCondition>>>;
  /** Bulk deletes medical contraindications based on the provided filter criteria. */
  deleteAllMedicalContraindications?: Maybe<Array<Maybe<MedicalContraindication>>>;
  /** Bulk deletes medical devices based on the provided filter criteria. */
  deleteAllMedicalDevices?: Maybe<Array<Maybe<MedicalDevice>>>;
  /** Bulk deletes medical drug classes based on the provided filter criteria. */
  deleteAllMedicalDrugClasses?: Maybe<Array<Maybe<MedicalDrugClass>>>;
  /** Bulk deletes medical drugs based on the provided filter criteria. */
  deleteAllMedicalDrugs?: Maybe<Array<Maybe<MedicalDrug>>>;
  /** Bulk deletes medical guidelines based on the provided filter criteria. */
  deleteAllMedicalGuidelines?: Maybe<Array<Maybe<MedicalGuideline>>>;
  /** Bulk deletes medical indications based on the provided filter criteria. */
  deleteAllMedicalIndications?: Maybe<Array<Maybe<MedicalIndication>>>;
  /** Bulk deletes medical procedures based on the provided filter criteria. */
  deleteAllMedicalProcedures?: Maybe<Array<Maybe<MedicalProcedure>>>;
  /** Bulk deletes medical studies based on the provided filter criteria. */
  deleteAllMedicalStudies?: Maybe<Array<Maybe<MedicalStudy>>>;
  /** Bulk deletes medical tests based on the provided filter criteria. */
  deleteAllMedicalTests?: Maybe<Array<Maybe<MedicalTest>>>;
  /** Bulk deletes medical therapies based on the provided filter criteria. */
  deleteAllMedicalTherapies?: Maybe<Array<Maybe<MedicalTherapy>>>;
  /** Bulk deletes organizations based on the provided filter criteria. */
  deleteAllOrganizations?: Maybe<Array<Maybe<Organization>>>;
  /** Bulk deletes persons based on the provided filter criteria. */
  deleteAllPersons?: Maybe<Array<Maybe<Person>>>;
  /** Bulk deletes places based on the provided filter criteria. */
  deleteAllPlaces?: Maybe<Array<Maybe<Place>>>;
  /** Bulk deletes products based on the provided filter criteria. */
  deleteAllProducts?: Maybe<Array<Maybe<Product>>>;
  /** Bulk deletes repos based on the provided filter criteria. */
  deleteAllRepos?: Maybe<Array<Maybe<Repo>>>;
  /** Bulk deletes software based on the provided filter criteria. */
  deleteAllSoftwares?: Maybe<Array<Maybe<Software>>>;
  /** Bulk deletes specifications based on the provided filter criteria. */
  deleteAllSpecifications?: Maybe<Array<Maybe<Specification>>>;
  /** Bulk deletes workflows based on the provided filter criteria. */
  deleteAllWorkflows?: Maybe<Array<Maybe<Workflow>>>;
  /** Bulk deletes categories. */
  deleteCategories?: Maybe<Array<Maybe<Category>>>;
  /** Deletes a category. */
  deleteCategory?: Maybe<Category>;
  /** Deletes a collection. */
  deleteCollection?: Maybe<Collection>;
  /** Bulk deletes collections. */
  deleteCollections?: Maybe<Array<Maybe<Collection>>>;
  /** Deletes a connector. */
  deleteConnector?: Maybe<Connector>;
  /** Deletes content. */
  deleteContent?: Maybe<Content>;
  /** Deletes multiple contents given their IDs. */
  deleteContents?: Maybe<Array<Maybe<Content>>>;
  /** Deletes a conversation. */
  deleteConversation?: Maybe<Conversation>;
  /** Bulk deletes conversations. */
  deleteConversations?: Maybe<Array<Maybe<Conversation>>>;
  /** Deletes an event. */
  deleteEvent?: Maybe<Event>;
  /** Bulk deletes events. */
  deleteEvents?: Maybe<Array<Maybe<Event>>>;
  /** Deletes a feed. */
  deleteFeed?: Maybe<Feed>;
  /** Bulk deletes feeds. */
  deleteFeeds?: Maybe<Array<Maybe<Feed>>>;
  /** Deletes a label. */
  deleteLabel?: Maybe<Label>;
  /** Bulk deletes labels. */
  deleteLabels?: Maybe<Array<Maybe<Label>>>;
  /** Deletes a medical condition. */
  deleteMedicalCondition?: Maybe<MedicalCondition>;
  /** Bulk deletes medical conditions. */
  deleteMedicalConditions?: Maybe<Array<Maybe<MedicalCondition>>>;
  /** Deletes a medical contraindication. */
  deleteMedicalContraindication?: Maybe<MedicalContraindication>;
  /** Bulk deletes medical contraindications. */
  deleteMedicalContraindications?: Maybe<Array<Maybe<MedicalContraindication>>>;
  /** Deletes a medical device. */
  deleteMedicalDevice?: Maybe<MedicalDevice>;
  /** Bulk deletes medical devices. */
  deleteMedicalDevices?: Maybe<Array<Maybe<MedicalDevice>>>;
  /** Deletes a medical drug. */
  deleteMedicalDrug?: Maybe<MedicalDrug>;
  /** Deletes a medical drug class. */
  deleteMedicalDrugClass?: Maybe<MedicalDrugClass>;
  /** Bulk deletes medical drug classes. */
  deleteMedicalDrugClasses?: Maybe<Array<Maybe<MedicalDrugClass>>>;
  /** Bulk deletes medical drugs. */
  deleteMedicalDrugs?: Maybe<Array<Maybe<MedicalDrug>>>;
  /** Deletes a medical guideline. */
  deleteMedicalGuideline?: Maybe<MedicalGuideline>;
  /** Bulk deletes medical guidelines. */
  deleteMedicalGuidelines?: Maybe<Array<Maybe<MedicalGuideline>>>;
  /** Deletes a medical indication. */
  deleteMedicalIndication?: Maybe<MedicalIndication>;
  /** Bulk deletes medical indications. */
  deleteMedicalIndications?: Maybe<Array<Maybe<MedicalIndication>>>;
  /** Deletes a medical procedure. */
  deleteMedicalProcedure?: Maybe<MedicalProcedure>;
  /** Bulk deletes medical procedures. */
  deleteMedicalProcedures?: Maybe<Array<Maybe<MedicalProcedure>>>;
  /** Bulk deletes medical studies. */
  deleteMedicalStudies?: Maybe<Array<Maybe<MedicalStudy>>>;
  /** Deletes a medical study. */
  deleteMedicalStudy?: Maybe<MedicalStudy>;
  /** Deletes a medical test. */
  deleteMedicalTest?: Maybe<MedicalTest>;
  /** Bulk deletes medical tests. */
  deleteMedicalTests?: Maybe<Array<Maybe<MedicalTest>>>;
  /** Bulk deletes medical therapies. */
  deleteMedicalTherapies?: Maybe<Array<Maybe<MedicalTherapy>>>;
  /** Deletes a medical therapy. */
  deleteMedicalTherapy?: Maybe<MedicalTherapy>;
  /** Deletes an observation. */
  deleteObservation?: Maybe<Observation>;
  /** Deletes an organization. */
  deleteOrganization?: Maybe<Organization>;
  /** Bulk deletes organizations. */
  deleteOrganizations?: Maybe<Array<Maybe<Organization>>>;
  /** Deletes a person. */
  deletePerson?: Maybe<Person>;
  /** Bulk deletes persons. */
  deletePersons?: Maybe<Array<Maybe<Person>>>;
  /** Deletes a place. */
  deletePlace?: Maybe<Place>;
  /** Bulk deletes places. */
  deletePlaces?: Maybe<Array<Maybe<Place>>>;
  /** Deletes a product. */
  deleteProduct?: Maybe<Product>;
  /** Bulk deletes products. */
  deleteProducts?: Maybe<Array<Maybe<Product>>>;
  /** Deletes a repo. */
  deleteRepo?: Maybe<Repo>;
  /** Bulk deletes repos. */
  deleteRepos?: Maybe<Array<Maybe<Repo>>>;
  /** Deletes a software. */
  deleteSoftware?: Maybe<Software>;
  /** Bulk deletes software. */
  deleteSoftwares?: Maybe<Array<Maybe<Software>>>;
  /** Deletes a LLM specification. */
  deleteSpecification?: Maybe<Specification>;
  /** Deletes multiple specifications given their IDs. */
  deleteSpecifications?: Maybe<Array<Maybe<Specification>>>;
  /** Deletes a user. */
  deleteUser?: Maybe<User>;
  /** Deletes a content workflow. */
  deleteWorkflow?: Maybe<Workflow>;
  /** Deletes multiple workflows given their IDs. */
  deleteWorkflows?: Maybe<Array<Maybe<Workflow>>>;
  /** Describes Base64-encoded image using LLM via prompt. */
  describeEncodedImage?: Maybe<ConversationMessage>;
  /** Describes image using LLM via prompt. */
  describeImage?: Maybe<ConversationMessage>;
  /** Disables an alert. */
  disableAlert?: Maybe<Alert>;
  /** Disables a feed. */
  disableFeed?: Maybe<Feed>;
  /** Disables a user. */
  disableUser?: Maybe<User>;
  /** Enables an alert. */
  enableAlert?: Maybe<Alert>;
  /** Enables a feed. */
  enableFeed?: Maybe<Feed>;
  /** Enables a user. */
  enableUser?: Maybe<User>;
  /** Extracts data using tool calling, from contents resulting from the provided filter criteria. */
  extractContents?: Maybe<Array<Maybe<ExtractCompletion>>>;
  /** Extracts data using tool calling, from text. */
  extractText?: Maybe<Array<Maybe<ExtractCompletion>>>;
  /** Format a conversation LLM user prompt. */
  formatConversation?: Maybe<PromptConversation>;
  /** Ingests a batch of content by URI. Supports files and webpages. */
  ingestBatch?: Maybe<Array<Maybe<Content>>>;
  /** Ingests a file from Base64-encoded data. */
  ingestEncodedFile?: Maybe<Content>;
  /**
   * Ingests a file by URI.
   * @deprecated Use ingestUri instead.
   */
  ingestFile?: Maybe<Content>;
  /** Ingests user or agent memory. */
  ingestMemory?: Maybe<Content>;
  /**
   * Ingests a webpage by URI.
   * @deprecated Use ingestUri instead.
   */
  ingestPage?: Maybe<Content>;
  /** Ingests text. */
  ingestText?: Maybe<Content>;
  ingestTextBatch?: Maybe<Array<Maybe<Content>>>;
  /** Ingests content by URI. Supports files and webpages. */
  ingestUri?: Maybe<Content>;
  /** Opens an existing collection. */
  openCollection?: Maybe<Collection>;
  /** Opens an existing conversation. */
  openConversation?: Maybe<Conversation>;
  /** Prompts LLM without content retrieval. You can provide a list of conversation messages to be completed, an LLM user prompt and optional Base64-encoded image, or both. If both are provided, the LLM prompt (and optional image) will be appended as an additional User message to the conversation. */
  prompt?: Maybe<PromptCompletion>;
  /** Prompts a conversation. */
  promptConversation?: Maybe<PromptConversation>;
  /** Prompts one or more LLM specifications, 10 maximum. */
  promptSpecifications?: Maybe<Array<Maybe<PromptCompletion>>>;
  /** Publish contents based on the provided filter criteria into different content format. */
  publishContents?: Maybe<PublishContents>;
  /** Publish conversation. */
  publishConversation?: Maybe<PublishContents>;
  /** Publish text into different content format. */
  publishText?: Maybe<PublishContents>;
  /**
   * Removes contents from a collection.
   * @deprecated Use removeContentsFromCollection instead.
   */
  removeCollectionContents?: Maybe<Collection>;
  /** Removes contents from a collection. */
  removeContentsFromCollection?: Maybe<Collection>;
  /** Restarts workflow on contents based on the provided filter criteria. */
  restartAllContents?: Maybe<Array<Maybe<Content>>>;
  /** Restarts workflow on content. */
  restartContent?: Maybe<Content>;
  /** Retrieve content sources. */
  retrieveSources?: Maybe<ContentSourceResults>;
  /** Revise content via prompted conversation. */
  reviseContent?: Maybe<ReviseContent>;
  /** Revise encoded image via prompted conversation. */
  reviseEncodedImage?: Maybe<ReviseContent>;
  /** Revise image via prompted conversation. */
  reviseImage?: Maybe<ReviseContent>;
  /** Revise text via prompted conversation. */
  reviseText?: Maybe<ReviseContent>;
  /** Screenshot web page by URI. */
  screenshotPage?: Maybe<Content>;
  /** Sends a notification. */
  sendNotification?: Maybe<BooleanResult>;
  /** Suggest prompts for a conversation. */
  suggestConversation?: Maybe<PromptSuggestion>;
  /** Summarizes contents based on the provided filter criteria. */
  summarizeContents?: Maybe<Array<Maybe<PromptSummarization>>>;
  /** Summarizes text. */
  summarizeText?: Maybe<PromptSummarization>;
  /** Undo an existing conversation. */
  undoConversation?: Maybe<Conversation>;
  /** Updates an existing alert. */
  updateAlert?: Maybe<Alert>;
  /** Updates a category. */
  updateCategory?: Maybe<Category>;
  /** Updates an existing collection. */
  updateCollection?: Maybe<Collection>;
  /** Updates an existing connector. */
  updateConnector?: Maybe<Connector>;
  /** Updates existing content. */
  updateContent?: Maybe<Content>;
  /** Updates an existing conversation. */
  updateConversation?: Maybe<Conversation>;
  /** Updates an event. */
  updateEvent?: Maybe<Event>;
  /** Updates an existing feed. */
  updateFeed?: Maybe<Feed>;
  /** Updates a label. */
  updateLabel?: Maybe<Label>;
  /** Updates a medical condition. */
  updateMedicalCondition?: Maybe<MedicalCondition>;
  /** Updates a medical contraindication. */
  updateMedicalContraindication?: Maybe<MedicalContraindication>;
  /** Updates a medical device. */
  updateMedicalDevice?: Maybe<MedicalDevice>;
  /** Updates a medical drug. */
  updateMedicalDrug?: Maybe<MedicalDrug>;
  /** Updates a medical drug class. */
  updateMedicalDrugClass?: Maybe<MedicalDrugClass>;
  /** Updates a medical guideline. */
  updateMedicalGuideline?: Maybe<MedicalGuideline>;
  /** Updates a medical indication. */
  updateMedicalIndication?: Maybe<MedicalIndication>;
  /** Updates a medical procedure. */
  updateMedicalProcedure?: Maybe<MedicalProcedure>;
  /** Updates a medical study. */
  updateMedicalStudy?: Maybe<MedicalStudy>;
  /** Updates a medical test. */
  updateMedicalTest?: Maybe<MedicalTest>;
  /** Updates a medical therapy. */
  updateMedicalTherapy?: Maybe<MedicalTherapy>;
  /** Updates an observation. */
  updateObservation?: Maybe<Observation>;
  /** Updates an organization. */
  updateOrganization?: Maybe<Organization>;
  /** Updates a person. */
  updatePerson?: Maybe<Person>;
  /** Updates a place. */
  updatePlace?: Maybe<Place>;
  /** Updates a product. */
  updateProduct?: Maybe<Product>;
  /** Updates project. */
  updateProject?: Maybe<Project>;
  /** Updates a repo. */
  updateRepo?: Maybe<Repo>;
  /** Updates a software. */
  updateSoftware?: Maybe<Software>;
  /** Updates an existing LLM specification. */
  updateSpecification?: Maybe<Specification>;
  /** Updates an existing user. */
  updateUser?: Maybe<User>;
  /** Updates an existing content workflow. */
  updateWorkflow?: Maybe<Workflow>;
  /** Upserts a category. */
  upsertCategory?: Maybe<Category>;
  /** Upserts a label. */
  upsertLabel?: Maybe<Label>;
  /** Upserts an LLM specification. */
  upsertSpecification?: Maybe<Specification>;
  /** Upserts a content workflow. */
  upsertWorkflow?: Maybe<Workflow>;
};


export type MutationAddCollectionContentsArgs = {
  contents: Array<EntityReferenceInput>;
  id: Scalars['ID']['input'];
};


export type MutationAddContentsToCollectionsArgs = {
  collections: Array<EntityReferenceInput>;
  contents: Array<EntityReferenceInput>;
};


export type MutationAskGraphlitArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  prompt: Scalars['String']['input'];
  specification?: InputMaybe<EntityReferenceInput>;
  type?: InputMaybe<SdkTypes>;
};


export type MutationClearConversationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCloseCollectionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCloseConversationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCompleteConversationArgs = {
  completion: Scalars['String']['input'];
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type MutationContinueConversationArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  includeDetails?: InputMaybe<Scalars['Boolean']['input']>;
  responses: Array<ConversationToolResponseInput>;
};


export type MutationCreateAlertArgs = {
  alert: AlertInput;
  correlationId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateCategoryArgs = {
  category: CategoryInput;
};


export type MutationCreateCollectionArgs = {
  collection: CollectionInput;
};


export type MutationCreateConnectorArgs = {
  connector: ConnectorInput;
};


export type MutationCreateConversationArgs = {
  conversation: ConversationInput;
  correlationId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateEventArgs = {
  event: EventInput;
};


export type MutationCreateFeedArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  feed: FeedInput;
};


export type MutationCreateLabelArgs = {
  label: LabelInput;
};


export type MutationCreateMedicalConditionArgs = {
  medicalCondition: MedicalConditionInput;
};


export type MutationCreateMedicalContraindicationArgs = {
  medicalContraindication: MedicalContraindicationInput;
};


export type MutationCreateMedicalDeviceArgs = {
  medicalDevice: MedicalDeviceInput;
};


export type MutationCreateMedicalDrugArgs = {
  medicalDrug: MedicalDrugInput;
};


export type MutationCreateMedicalDrugClassArgs = {
  medicalDrugClass: MedicalDrugClassInput;
};


export type MutationCreateMedicalGuidelineArgs = {
  medicalGuideline: MedicalGuidelineInput;
};


export type MutationCreateMedicalIndicationArgs = {
  medicalIndication: MedicalIndicationInput;
};


export type MutationCreateMedicalProcedureArgs = {
  medicalProcedure: MedicalProcedureInput;
};


export type MutationCreateMedicalStudyArgs = {
  medicalStudy: MedicalStudyInput;
};


export type MutationCreateMedicalTestArgs = {
  medicalTest: MedicalTestInput;
};


export type MutationCreateMedicalTherapyArgs = {
  medicalTherapy: MedicalTherapyInput;
};


export type MutationCreateObservationArgs = {
  observation: ObservationInput;
};


export type MutationCreateOrganizationArgs = {
  organization: OrganizationInput;
};


export type MutationCreatePersonArgs = {
  person: PersonInput;
};


export type MutationCreatePlaceArgs = {
  place: PlaceInput;
};


export type MutationCreateProductArgs = {
  product: ProductInput;
};


export type MutationCreateRepoArgs = {
  repo: RepoInput;
};


export type MutationCreateSoftwareArgs = {
  software: SoftwareInput;
};


export type MutationCreateSpecificationArgs = {
  specification: SpecificationInput;
};


export type MutationCreateUserArgs = {
  user: UserInput;
};


export type MutationCreateWorkflowArgs = {
  workflow: WorkflowInput;
};


export type MutationDeleteAlertArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteAlertsArgs = {
  ids: Array<Scalars['ID']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteAllAlertsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<AlertFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteAllCategoriesArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<CategoryFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteAllCollectionsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<CollectionFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteAllContentsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<ContentFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteAllConversationsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<ConversationFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteAllEventsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<EventFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteAllFeedsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<FeedFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteAllLabelsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<LabelFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteAllMedicalConditionsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<MedicalConditionFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteAllMedicalContraindicationsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<MedicalContraindicationFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteAllMedicalDevicesArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<MedicalDeviceFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteAllMedicalDrugClassesArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<MedicalDrugClassFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteAllMedicalDrugsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<MedicalDrugFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteAllMedicalGuidelinesArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<MedicalGuidelineFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteAllMedicalIndicationsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<MedicalIndicationFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteAllMedicalProceduresArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<MedicalProcedureFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteAllMedicalStudiesArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<MedicalStudyFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteAllMedicalTestsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<MedicalTestFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteAllMedicalTherapiesArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<MedicalTherapyFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteAllOrganizationsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<OrganizationFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteAllPersonsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<PersonFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteAllPlacesArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<PlaceFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteAllProductsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<ProductFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteAllReposArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<RepoFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteAllSoftwaresArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<SoftwareFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteAllSpecificationsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<SpecificationFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteAllWorkflowsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<WorkflowFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteCategoriesArgs = {
  ids: Array<Scalars['ID']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCollectionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCollectionsArgs = {
  ids: Array<Scalars['ID']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteConnectorArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteContentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteContentsArgs = {
  ids: Array<Scalars['ID']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteConversationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteConversationsArgs = {
  ids: Array<Scalars['ID']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteEventArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteEventsArgs = {
  ids: Array<Scalars['ID']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteFeedArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteFeedsArgs = {
  ids: Array<Scalars['ID']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteLabelArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteLabelsArgs = {
  ids: Array<Scalars['ID']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteMedicalConditionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteMedicalConditionsArgs = {
  ids: Array<Scalars['ID']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteMedicalContraindicationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteMedicalContraindicationsArgs = {
  ids: Array<Scalars['ID']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteMedicalDeviceArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteMedicalDevicesArgs = {
  ids: Array<Scalars['ID']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteMedicalDrugArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteMedicalDrugClassArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteMedicalDrugClassesArgs = {
  ids: Array<Scalars['ID']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteMedicalDrugsArgs = {
  ids: Array<Scalars['ID']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteMedicalGuidelineArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteMedicalGuidelinesArgs = {
  ids: Array<Scalars['ID']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteMedicalIndicationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteMedicalIndicationsArgs = {
  ids: Array<Scalars['ID']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteMedicalProcedureArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteMedicalProceduresArgs = {
  ids: Array<Scalars['ID']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteMedicalStudiesArgs = {
  ids: Array<Scalars['ID']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteMedicalStudyArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteMedicalTestArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteMedicalTestsArgs = {
  ids: Array<Scalars['ID']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteMedicalTherapiesArgs = {
  ids: Array<Scalars['ID']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteMedicalTherapyArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteObservationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteOrganizationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteOrganizationsArgs = {
  ids: Array<Scalars['ID']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeletePersonArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePersonsArgs = {
  ids: Array<Scalars['ID']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeletePlaceArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePlacesArgs = {
  ids: Array<Scalars['ID']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteProductArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProductsArgs = {
  ids: Array<Scalars['ID']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteRepoArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteReposArgs = {
  ids: Array<Scalars['ID']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteSoftwareArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSoftwaresArgs = {
  ids: Array<Scalars['ID']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteSpecificationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSpecificationsArgs = {
  ids: Array<Scalars['ID']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteWorkflowArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteWorkflowsArgs = {
  ids: Array<Scalars['ID']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDescribeEncodedImageArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  data: Scalars['String']['input'];
  mimeType: Scalars['String']['input'];
  prompt: Scalars['String']['input'];
  specification?: InputMaybe<EntityReferenceInput>;
};


export type MutationDescribeImageArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  prompt: Scalars['String']['input'];
  specification?: InputMaybe<EntityReferenceInput>;
  uri: Scalars['URL']['input'];
};


export type MutationDisableAlertArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDisableFeedArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDisableUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationEnableAlertArgs = {
  id: Scalars['ID']['input'];
};


export type MutationEnableFeedArgs = {
  id: Scalars['ID']['input'];
};


export type MutationEnableUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationExtractContentsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<ContentFilter>;
  prompt: Scalars['String']['input'];
  specification?: InputMaybe<EntityReferenceInput>;
  tools: Array<ToolDefinitionInput>;
};


export type MutationExtractTextArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  prompt: Scalars['String']['input'];
  specification?: InputMaybe<EntityReferenceInput>;
  text: Scalars['String']['input'];
  textType?: InputMaybe<TextTypes>;
  tools: Array<ToolDefinitionInput>;
};


export type MutationFormatConversationArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  includeDetails?: InputMaybe<Scalars['Boolean']['input']>;
  prompt: Scalars['String']['input'];
  specification?: InputMaybe<EntityReferenceInput>;
};


export type MutationIngestBatchArgs = {
  collections?: InputMaybe<Array<EntityReferenceInput>>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
  observations?: InputMaybe<Array<ObservationReferenceInput>>;
  uris: Array<Scalars['URL']['input']>;
  workflow?: InputMaybe<EntityReferenceInput>;
};


export type MutationIngestEncodedFileArgs = {
  collections?: InputMaybe<Array<EntityReferenceInput>>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
  data: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  mimeType: Scalars['String']['input'];
  name: Scalars['String']['input'];
  observations?: InputMaybe<Array<ObservationReferenceInput>>;
  workflow?: InputMaybe<EntityReferenceInput>;
};


export type MutationIngestFileArgs = {
  collections?: InputMaybe<Array<EntityReferenceInput>>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  uri: Scalars['URL']['input'];
  workflow?: InputMaybe<EntityReferenceInput>;
};


export type MutationIngestMemoryArgs = {
  collections?: InputMaybe<Array<EntityReferenceInput>>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  text: Scalars['String']['input'];
  textType?: InputMaybe<TextTypes>;
};


export type MutationIngestPageArgs = {
  collections?: InputMaybe<Array<EntityReferenceInput>>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  uri: Scalars['URL']['input'];
  workflow?: InputMaybe<EntityReferenceInput>;
};


export type MutationIngestTextArgs = {
  collections?: InputMaybe<Array<EntityReferenceInput>>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  observations?: InputMaybe<Array<ObservationReferenceInput>>;
  text: Scalars['String']['input'];
  textType?: InputMaybe<TextTypes>;
  uri?: InputMaybe<Scalars['URL']['input']>;
  workflow?: InputMaybe<EntityReferenceInput>;
};


export type MutationIngestTextBatchArgs = {
  batch: Array<TextContentInput>;
  collections?: InputMaybe<Array<EntityReferenceInput>>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
  observations?: InputMaybe<Array<ObservationReferenceInput>>;
  textType?: InputMaybe<TextTypes>;
  workflow?: InputMaybe<EntityReferenceInput>;
};


export type MutationIngestUriArgs = {
  collections?: InputMaybe<Array<EntityReferenceInput>>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  mimeType?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  observations?: InputMaybe<Array<ObservationReferenceInput>>;
  uri: Scalars['URL']['input'];
  workflow?: InputMaybe<EntityReferenceInput>;
};


export type MutationOpenCollectionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationOpenConversationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationPromptArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  data?: InputMaybe<Scalars['String']['input']>;
  messages?: InputMaybe<Array<ConversationMessageInput>>;
  mimeType?: InputMaybe<Scalars['String']['input']>;
  prompt?: InputMaybe<Scalars['String']['input']>;
  specification?: InputMaybe<EntityReferenceInput>;
};


export type MutationPromptConversationArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  data?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  includeDetails?: InputMaybe<Scalars['Boolean']['input']>;
  mimeType?: InputMaybe<Scalars['String']['input']>;
  prompt: Scalars['String']['input'];
  requireTool?: InputMaybe<Scalars['Boolean']['input']>;
  specification?: InputMaybe<EntityReferenceInput>;
  tools?: InputMaybe<Array<ToolDefinitionInput>>;
};


export type MutationPromptSpecificationsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  ids: Array<Scalars['ID']['input']>;
  prompt: Scalars['String']['input'];
};


export type MutationPublishContentsArgs = {
  connector: ContentPublishingConnectorInput;
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<ContentFilter>;
  includeDetails?: InputMaybe<Scalars['Boolean']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  publishPrompt: Scalars['String']['input'];
  publishSpecification?: InputMaybe<EntityReferenceInput>;
  summaryPrompt?: InputMaybe<Scalars['String']['input']>;
  summarySpecification?: InputMaybe<EntityReferenceInput>;
  workflow?: InputMaybe<EntityReferenceInput>;
};


export type MutationPublishConversationArgs = {
  connector: ContentPublishingConnectorInput;
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  includeDetails?: InputMaybe<Scalars['Boolean']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  publishPrompt?: InputMaybe<Scalars['String']['input']>;
  publishSpecification?: InputMaybe<EntityReferenceInput>;
  workflow?: InputMaybe<EntityReferenceInput>;
};


export type MutationPublishTextArgs = {
  connector: ContentPublishingConnectorInput;
  correlationId?: InputMaybe<Scalars['String']['input']>;
  includeDetails?: InputMaybe<Scalars['Boolean']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  text: Scalars['String']['input'];
  textType?: InputMaybe<TextTypes>;
  workflow?: InputMaybe<EntityReferenceInput>;
};


export type MutationRemoveCollectionContentsArgs = {
  contents: Array<EntityReferenceInput>;
  id: Scalars['ID']['input'];
};


export type MutationRemoveContentsFromCollectionArgs = {
  collection: EntityReferenceInput;
  contents: Array<EntityReferenceInput>;
};


export type MutationRestartAllContentsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<ContentFilter>;
};


export type MutationRestartContentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRetrieveSourcesArgs = {
  augmentedFilter?: InputMaybe<ContentFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<ContentFilter>;
  prompt: Scalars['String']['input'];
  rerankingStrategy?: InputMaybe<RerankingStrategyInput>;
  retrievalStrategy?: InputMaybe<RetrievalStrategyInput>;
};


export type MutationReviseContentArgs = {
  content: EntityReferenceInput;
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  prompt: Scalars['String']['input'];
  specification?: InputMaybe<EntityReferenceInput>;
};


export type MutationReviseEncodedImageArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  data: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  mimeType: Scalars['String']['input'];
  prompt: Scalars['String']['input'];
  specification?: InputMaybe<EntityReferenceInput>;
};


export type MutationReviseImageArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  prompt: Scalars['String']['input'];
  specification?: InputMaybe<EntityReferenceInput>;
  uri?: InputMaybe<Scalars['URL']['input']>;
};


export type MutationReviseTextArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  prompt: Scalars['String']['input'];
  specification?: InputMaybe<EntityReferenceInput>;
  text: Scalars['String']['input'];
};


export type MutationScreenshotPageArgs = {
  collections?: InputMaybe<Array<EntityReferenceInput>>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  maximumHeight?: InputMaybe<Scalars['Int']['input']>;
  uri: Scalars['URL']['input'];
  workflow?: InputMaybe<EntityReferenceInput>;
};


export type MutationSendNotificationArgs = {
  connector: IntegrationConnectorInput;
  text: Scalars['String']['input'];
  textType?: InputMaybe<TextTypes>;
};


export type MutationSuggestConversationArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  count?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['ID']['input'];
  prompt?: InputMaybe<Scalars['String']['input']>;
};


export type MutationSummarizeContentsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<ContentFilter>;
  summarizations: Array<InputMaybe<SummarizationStrategyInput>>;
};


export type MutationSummarizeTextArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  summarization: SummarizationStrategyInput;
  text: Scalars['String']['input'];
  textType?: InputMaybe<TextTypes>;
};


export type MutationUndoConversationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateAlertArgs = {
  alert: AlertUpdateInput;
};


export type MutationUpdateCategoryArgs = {
  category: CategoryUpdateInput;
};


export type MutationUpdateCollectionArgs = {
  collection: CollectionUpdateInput;
};


export type MutationUpdateConnectorArgs = {
  connector: ConnectorUpdateInput;
};


export type MutationUpdateContentArgs = {
  content: ContentUpdateInput;
};


export type MutationUpdateConversationArgs = {
  conversation: ConversationUpdateInput;
};


export type MutationUpdateEventArgs = {
  event: EventUpdateInput;
};


export type MutationUpdateFeedArgs = {
  feed: FeedUpdateInput;
};


export type MutationUpdateLabelArgs = {
  label: LabelUpdateInput;
};


export type MutationUpdateMedicalConditionArgs = {
  medicalCondition: MedicalConditionUpdateInput;
};


export type MutationUpdateMedicalContraindicationArgs = {
  medicalContraindication: MedicalContraindicationUpdateInput;
};


export type MutationUpdateMedicalDeviceArgs = {
  medicalDevice: MedicalDeviceUpdateInput;
};


export type MutationUpdateMedicalDrugArgs = {
  medicalDrug: MedicalDrugUpdateInput;
};


export type MutationUpdateMedicalDrugClassArgs = {
  medicalDrugClass: MedicalDrugClassUpdateInput;
};


export type MutationUpdateMedicalGuidelineArgs = {
  medicalGuideline: MedicalGuidelineUpdateInput;
};


export type MutationUpdateMedicalIndicationArgs = {
  medicalIndication: MedicalIndicationUpdateInput;
};


export type MutationUpdateMedicalProcedureArgs = {
  medicalProcedure: MedicalProcedureUpdateInput;
};


export type MutationUpdateMedicalStudyArgs = {
  medicalStudy: MedicalStudyUpdateInput;
};


export type MutationUpdateMedicalTestArgs = {
  medicalTest: MedicalTestUpdateInput;
};


export type MutationUpdateMedicalTherapyArgs = {
  medicalTherapy: MedicalTherapyUpdateInput;
};


export type MutationUpdateObservationArgs = {
  observation: ObservationUpdateInput;
};


export type MutationUpdateOrganizationArgs = {
  organization: OrganizationUpdateInput;
};


export type MutationUpdatePersonArgs = {
  person: PersonUpdateInput;
};


export type MutationUpdatePlaceArgs = {
  place: PlaceUpdateInput;
};


export type MutationUpdateProductArgs = {
  product: ProductUpdateInput;
};


export type MutationUpdateProjectArgs = {
  project: ProjectUpdateInput;
};


export type MutationUpdateRepoArgs = {
  repo: RepoUpdateInput;
};


export type MutationUpdateSoftwareArgs = {
  software: SoftwareUpdateInput;
};


export type MutationUpdateSpecificationArgs = {
  specification: SpecificationUpdateInput;
};


export type MutationUpdateUserArgs = {
  user: UserUpdateInput;
};


export type MutationUpdateWorkflowArgs = {
  workflow: WorkflowUpdateInput;
};


export type MutationUpsertCategoryArgs = {
  category: CategoryInput;
};


export type MutationUpsertLabelArgs = {
  label: LabelInput;
};


export type MutationUpsertSpecificationArgs = {
  specification: SpecificationInput;
};


export type MutationUpsertWorkflowArgs = {
  workflow: WorkflowInput;
};

/** Represents a named entity reference. */
export type NamedEntityReference = {
  __typename?: 'NamedEntityReference';
  /** The ID of the entity. */
  id: Scalars['ID']['output'];
  /** The name of the entity. */
  name?: Maybe<Scalars['String']['output']>;
};

/** Represents a named entity reference. */
export type NamedEntityReferenceInput = {
  /** The ID of the entity. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** The name of the entity. */
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Represents Notion databases properties. */
export type NotionDatabasesInput = {
  /** Notion integration token. */
  token: Scalars['String']['input'];
};

/** Represents Notion feed properties. */
export type NotionFeedProperties = {
  __typename?: 'NotionFeedProperties';
  /** The Notion identifiers. */
  identifiers: Array<Scalars['String']['output']>;
  /** Should the feed enumerate Notion pages and databases recursively. */
  isRecursive?: Maybe<Scalars['Boolean']['output']>;
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: Maybe<Scalars['Int']['output']>;
  /** The Notion integration token. */
  token: Scalars['String']['output'];
  /** The Notion object type, i.e. page or database. */
  type: NotionTypes;
};

/** Represents Notion feed properties. */
export type NotionFeedPropertiesInput = {
  /** Notion identifiers. */
  identifiers: Array<Scalars['String']['input']>;
  /** Should the feed enumerate Notion pages and databases recursively. */
  isRecursive?: InputMaybe<Scalars['Boolean']['input']>;
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: InputMaybe<Scalars['Int']['input']>;
  /** Notion integration token. */
  token: Scalars['String']['input'];
  /** Notion object type, i.e. page or database. */
  type: NotionTypes;
};

/** Represents Notion feed properties. */
export type NotionFeedPropertiesUpdateInput = {
  /** Notion identifiers. */
  identifiers?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Should the feed enumerate Notion pages and databases recursively. */
  isRecursive?: InputMaybe<Scalars['Boolean']['input']>;
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: InputMaybe<Scalars['Int']['input']>;
  /** Notion integration token. */
  token: Scalars['String']['input'];
  /** Notion object type, i.e. page or database. */
  type?: InputMaybe<NotionTypes>;
};

/** Represents Notion pages properties. */
export type NotionPagesInput = {
  /** Notion integration token. */
  token: Scalars['String']['input'];
};

export enum NotionTypes {
  /** Notion Database */
  Database = 'DATABASE',
  /** Notion Page */
  Page = 'PAGE'
}

/** Represents an observable facet. */
export type ObservableFacet = {
  __typename?: 'ObservableFacet';
  /** The observable entity. */
  observable?: Maybe<NamedEntityReference>;
  /** The observed entity type. */
  type?: Maybe<ObservableTypes>;
};

/** Observable type */
export enum ObservableTypes {
  /** Category */
  Category = 'CATEGORY',
  /** Event */
  Event = 'EVENT',
  /** Label */
  Label = 'LABEL',
  /** Medical condition */
  MedicalCondition = 'MEDICAL_CONDITION',
  /** Medical contraindication */
  MedicalContraindication = 'MEDICAL_CONTRAINDICATION',
  /** Medical device */
  MedicalDevice = 'MEDICAL_DEVICE',
  /** Medical drug */
  MedicalDrug = 'MEDICAL_DRUG',
  /** Medical drug class */
  MedicalDrugClass = 'MEDICAL_DRUG_CLASS',
  /** Medical guideline */
  MedicalGuideline = 'MEDICAL_GUIDELINE',
  /** Medical indication */
  MedicalIndication = 'MEDICAL_INDICATION',
  /** Medical procedure */
  MedicalProcedure = 'MEDICAL_PROCEDURE',
  /** Medical study */
  MedicalStudy = 'MEDICAL_STUDY',
  /** Medical test */
  MedicalTest = 'MEDICAL_TEST',
  /** Medical therapy */
  MedicalTherapy = 'MEDICAL_THERAPY',
  /** Organization */
  Organization = 'ORGANIZATION',
  /** Person */
  Person = 'PERSON',
  /** Place */
  Place = 'PLACE',
  /** Product */
  Product = 'PRODUCT',
  /** Code repository */
  Repo = 'REPO',
  /** Software */
  Software = 'SOFTWARE'
}

/** Represents an observation. */
export type Observation = {
  __typename?: 'Observation';
  /** The content where the entity was observed. */
  content?: Maybe<Content>;
  /** The creation date of the observation. */
  creationDate: Scalars['DateTime']['output'];
  /** The ID of the observation. */
  id: Scalars['ID']['output'];
  /** The modified date of the observation. */
  modifiedDate?: Maybe<Scalars['DateTime']['output']>;
  /** The observed entity. */
  observable: NamedEntityReference;
  /** The observation occurrences. */
  occurrences?: Maybe<Array<Maybe<ObservationOccurrence>>>;
  /** The owner of the observation. */
  owner: Owner;
  /** The related entity, optional. */
  related?: Maybe<NamedEntityReference>;
  /** The related entity type, optional. */
  relatedType?: Maybe<ObservableTypes>;
  /** The relationship between the observed entity and related entity, optional. */
  relation?: Maybe<Scalars['String']['output']>;
  /** The relevance score of the observation. */
  relevance?: Maybe<Scalars['Float']['output']>;
  /** The state of the observation (i.e. created, finished). */
  state: EntityState;
  /** The observed entity type. */
  type: ObservableTypes;
};

/** Represents an observation filter. */
export type ObservationCriteria = {
  __typename?: 'ObservationCriteria';
  /** The observed entity. */
  observable: EntityReference;
  /** The observation states. */
  states?: Maybe<Array<Maybe<EntityState>>>;
  /** The observed entity type. */
  type: ObservableTypes;
};

/** Represents an observation filter. */
export type ObservationCriteriaInput = {
  /** The observed entity. */
  observable?: InputMaybe<EntityReferenceInput>;
  /** The observation states. */
  states?: InputMaybe<Array<InputMaybe<EntityState>>>;
  /** The observed entity type. */
  type?: InputMaybe<ObservableTypes>;
};

/** Represents an observation. */
export type ObservationInput = {
  /** The content where the entity was observed. */
  content: EntityReferenceInput;
  /** The observed entity. */
  observable: NamedEntityReferenceInput;
  /** The observation occurrences. */
  occurrences: Array<ObservationOccurrenceInput>;
  /** The related entity, optional. */
  related?: InputMaybe<NamedEntityReferenceInput>;
  /** The related entity type. */
  relatedType?: InputMaybe<ObservableTypes>;
  /** The relationship between the observed entity and related entity, optional. */
  relation?: InputMaybe<Scalars['String']['input']>;
  /** The observed entity type. */
  type: ObservableTypes;
};

/** Represents an observation occurrence. */
export type ObservationOccurrence = {
  __typename?: 'ObservationOccurrence';
  /** The observation occurrence image bounding box. */
  boundingBox?: Maybe<BoundingBox>;
  /** The observation occurrence confidence. */
  confidence?: Maybe<Scalars['Float']['output']>;
  /** The end time of the observation occurrence. */
  endTime?: Maybe<Scalars['TimeSpan']['output']>;
  /** The page index of the observation occurrence. */
  pageIndex?: Maybe<Scalars['Int']['output']>;
  /** The start time of the observation occurrence. */
  startTime?: Maybe<Scalars['TimeSpan']['output']>;
  /** The observation occurrence type. */
  type?: Maybe<OccurrenceTypes>;
};

/** Represents an observation occurrence. */
export type ObservationOccurrenceInput = {
  /** The observation occurrence image bounding box. */
  boundingBox?: InputMaybe<BoundingBoxInput>;
  /** The observation occurrence confidence. */
  confidence?: InputMaybe<Scalars['Float']['input']>;
  /** The end time of the observation occurrence. */
  endTime?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** The page index of the observation occurrence. */
  pageIndex?: InputMaybe<Scalars['Int']['input']>;
  /** The start time of the observation occurrence. */
  startTime?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** The observation occurrence type. */
  type: OccurrenceTypes;
};

/** Represents an observation reference. */
export type ObservationReference = {
  __typename?: 'ObservationReference';
  /** The observed entity. */
  observable: NamedEntityReference;
  /** The observed entity type. */
  type: ObservableTypes;
};

/** Represents a filter for observations. */
export type ObservationReferenceFilter = {
  /** Filter by observed entity. */
  observable: EntityReferenceFilter;
  /** Filter observation(s) by their states. */
  states?: InputMaybe<Array<InputMaybe<EntityState>>>;
  /** Filter by observed entity type. */
  type: ObservableTypes;
};

/** Represents an observation reference. */
export type ObservationReferenceInput = {
  /** The observed entity. */
  observable: NamedEntityReferenceInput;
  /** The observed entity type. */
  type: ObservableTypes;
};

/** Represents an observation. */
export type ObservationUpdateInput = {
  /** The ID of the observation to update. */
  id: Scalars['ID']['input'];
  /** The observed entity. */
  observable?: InputMaybe<NamedEntityReferenceInput>;
  /** The observation occurrences. */
  occurrences?: InputMaybe<Array<ObservationOccurrenceInput>>;
  /** The related entity, optional. */
  related?: InputMaybe<NamedEntityReferenceInput>;
  /** The related entity type. */
  relatedType?: InputMaybe<ObservableTypes>;
  /** The relationship between the observed entity and related entity, optional. */
  relation?: InputMaybe<Scalars['String']['input']>;
  /** The observed entity type. */
  type?: InputMaybe<ObservableTypes>;
};

export enum OccurrenceTypes {
  Image = 'IMAGE',
  Text = 'TEXT',
  Time = 'TIME'
}

/** Represents OneDrive properties. */
export type OneDriveFeedProperties = {
  __typename?: 'OneDriveFeedProperties';
  /** OneDrive client identifier. */
  clientId: Scalars['String']['output'];
  /** OneDrive client secret. */
  clientSecret: Scalars['String']['output'];
  /** OneDrive file identifiers. Takes precedence over folder identifier. */
  files?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  /** OneDrive folder identifier. */
  folderId?: Maybe<Scalars['ID']['output']>;
  /** OneDrive refresh token. */
  refreshToken: Scalars['String']['output'];
};

/** Represents OneDrive properties. */
export type OneDriveFeedPropertiesInput = {
  /** OneDrive client identifier. */
  clientId: Scalars['String']['input'];
  /** OneDrive client secret. */
  clientSecret: Scalars['String']['input'];
  /** OneDrive file identifiers. Takes precedence over folder identifier. */
  files?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  /** OneDrive folder identifier. */
  folderId?: InputMaybe<Scalars['ID']['input']>;
  /** OneDrive refresh token. */
  refreshToken: Scalars['String']['input'];
};

/** Represents OneDrive properties. */
export type OneDriveFeedPropertiesUpdateInput = {
  /** OneDrive client identifier. */
  clientId?: InputMaybe<Scalars['String']['input']>;
  /** OneDrive client secret. */
  clientSecret?: InputMaybe<Scalars['String']['input']>;
  /** OneDrive file identifiers. Takes precedence over folder identifier. */
  files?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  /** OneDrive folder identifier. */
  folderId?: InputMaybe<Scalars['ID']['input']>;
  /** OneDrive refresh token. */
  refreshToken?: InputMaybe<Scalars['String']['input']>;
};

/** Represents a OneDrive folder. */
export type OneDriveFolderResult = {
  __typename?: 'OneDriveFolderResult';
  /** The OneDrive folder identifier. */
  folderId?: Maybe<Scalars['ID']['output']>;
  /** The OneDrive folder name. */
  folderName?: Maybe<Scalars['String']['output']>;
};

/** Represents OneDrive folders. */
export type OneDriveFolderResults = {
  __typename?: 'OneDriveFolderResults';
  /** The OneDrive folders. */
  results?: Maybe<Array<Maybe<OneDriveFolderResult>>>;
};

/** Represents OneDrive folders properties. */
export type OneDriveFoldersInput = {
  /** OneDrive refresh token. */
  refreshToken: Scalars['String']['input'];
};

/** Represents an OpenAI image entity extraction connector. */
export type OpenAiImageExtractionProperties = {
  __typename?: 'OpenAIImageExtractionProperties';
  /** The confidence threshold for entity extraction. */
  confidenceThreshold?: Maybe<Scalars['Float']['output']>;
  /** Custom instructions which are injected into the LLM prompt. */
  customInstructions?: Maybe<Scalars['String']['output']>;
  /** The OpenAI vision detail mode. */
  detailLevel?: Maybe<OpenAiVisionDetailLevels>;
};

/** OpenAI Image model type */
export enum OpenAiImageModels {
  /** Developer-specified model */
  Custom = 'CUSTOM',
  /** GPT Image-1 */
  GptImage_1 = 'GPT_IMAGE_1'
}

/** Represents the OpenAI Image publishing properties. */
export type OpenAiImagePublishingProperties = {
  __typename?: 'OpenAIImagePublishingProperties';
  /** The number of images to generate, optional. Defaults to 1. */
  count?: Maybe<Scalars['Int']['output']>;
  /** The OpenAI Image model. */
  model?: Maybe<OpenAiImageModels>;
  /** The seed image reference to use when generating image(s). */
  seed?: Maybe<EntityReference>;
};

/** Represents the OpenAI Image publishing properties. */
export type OpenAiImagePublishingPropertiesInput = {
  /** The number of images to generate, optional. Defaults to 1. */
  count?: InputMaybe<Scalars['Int']['input']>;
  /** The OpenAI Image model. */
  model?: InputMaybe<OpenAiImageModels>;
  /** The seed image reference to use when generating image(s). */
  seed?: InputMaybe<EntityReferenceInput>;
};

/** Represents OpenAI model properties. */
export type OpenAiModelProperties = {
  __typename?: 'OpenAIModelProperties';
  /** The limit of tokens per embedded text chunk, defaults to 600. */
  chunkTokenLimit?: Maybe<Scalars['Int']['output']>;
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: Maybe<Scalars['Int']['output']>;
  /** The OpenAI vision detail mode. Only applies when using OpenAI for image completion. */
  detailLevel?: Maybe<OpenAiVisionDetailLevels>;
  /** The OpenAI-compatible API endpoint, if using developer's own account. */
  endpoint?: Maybe<Scalars['URL']['output']>;
  /** The OpenAI-compatible API key, if using developer's own account. */
  key?: Maybe<Scalars['String']['output']>;
  /** The OpenAI model, or custom, when using developer's own account. */
  model: OpenAiModels;
  /** The OpenAI-compatible model name, if using developer's own account. */
  modelName?: Maybe<Scalars['String']['output']>;
  /** The model token probability. */
  probability?: Maybe<Scalars['Float']['output']>;
  /** The OpenAI reasoning effort level. Only applies when using OpenAI o1 or newer reasoning models. */
  reasoningEffort?: Maybe<OpenAiReasoningEffortLevels>;
  /** The model temperature. */
  temperature?: Maybe<Scalars['Float']['output']>;
  /** The number of tokens which can provided to the OpenAI-compatible model, if using developer's own account. */
  tokenLimit?: Maybe<Scalars['Int']['output']>;
};

/** Represents OpenAI model properties. */
export type OpenAiModelPropertiesInput = {
  /** The limit of tokens per embedded text chunk, defaults to 600. */
  chunkTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The OpenAI vision detail mode. Only applies when using OpenAI for image completion. */
  detailLevel?: InputMaybe<OpenAiVisionDetailLevels>;
  /** The OpenAI-compatible API endpoint, if using developer's own account. */
  endpoint?: InputMaybe<Scalars['URL']['input']>;
  /** The OpenAI-compatible API key, if using developer's own account. */
  key?: InputMaybe<Scalars['String']['input']>;
  /** The OpenAI model, or custom, when using developer's own account. */
  model: OpenAiModels;
  /** The OpenAI-compatible model name, if using developer's own account. */
  modelName?: InputMaybe<Scalars['String']['input']>;
  /** The model token probability. */
  probability?: InputMaybe<Scalars['Float']['input']>;
  /** The OpenAI reasoning effort level. Only applies when using OpenAI o1 or newer reasoning models. */
  reasoningEffort?: InputMaybe<OpenAiReasoningEffortLevels>;
  /** The model temperature. */
  temperature?: InputMaybe<Scalars['Float']['input']>;
  /** The number of tokens which can provided to the OpenAI-compatible model, if using developer's own account. */
  tokenLimit?: InputMaybe<Scalars['Int']['input']>;
};

/** Represents OpenAI model properties. */
export type OpenAiModelPropertiesUpdateInput = {
  /** The limit of tokens per embedded text chunk, defaults to 600. */
  chunkTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The OpenAI vision detail mode. Only applies when using OpenAI for image completion. */
  detailLevel?: InputMaybe<OpenAiVisionDetailLevels>;
  /** The OpenAI-compatible API endpoint, if using developer's own account. */
  endpoint?: InputMaybe<Scalars['URL']['input']>;
  /** The OpenAI-compatible API key, if using developer's own account. */
  key?: InputMaybe<Scalars['String']['input']>;
  /** The Azure OpenAI model, or custom, when using developer's own account. */
  model?: InputMaybe<OpenAiModels>;
  /** The OpenAI-compatible model name, if using developer's own account. */
  modelName?: InputMaybe<Scalars['String']['input']>;
  /** The model token probability. */
  probability?: InputMaybe<Scalars['Float']['input']>;
  /** The OpenAI reasoning effort level. Only applies when using OpenAI o1 or newer reasoning models. */
  reasoningEffort?: InputMaybe<OpenAiReasoningEffortLevels>;
  /** The model temperature. */
  temperature?: InputMaybe<Scalars['Float']['input']>;
  /** The number of tokens which can provided to the OpenAI-compatible model, if using developer's own account. */
  tokenLimit?: InputMaybe<Scalars['Int']['input']>;
};

/** OpenAI model type */
export enum OpenAiModels {
  /** Embedding Ada-002 */
  Ada_002 = 'ADA_002',
  /** Developer-specified model */
  Custom = 'CUSTOM',
  /** Embedding 3 Large */
  Embedding_3Large = 'EMBEDDING_3_LARGE',
  /** Embedding 3 Small */
  Embedding_3Small = 'EMBEDDING_3_SMALL',
  /**
   * GPT-4 (Latest)
   * @deprecated OpenAI has deprecated this model. Use the GPT-4o model instead.
   */
  Gpt4 = 'GPT4',
  /** GPT-4o 128k (Latest) */
  Gpt4O_128K = 'GPT4O_128K',
  /** GPT-4o 128k (2024-05-13 version) */
  Gpt4O_128K_20240513 = 'GPT4O_128K_20240513',
  /** GPT-4o 128k (2024-08-06 version) */
  Gpt4O_128K_20240806 = 'GPT4O_128K_20240806',
  /** GPT-4o 128k (2024-11-20 version) */
  Gpt4O_128K_20241120 = 'GPT4O_128K_20241120',
  /** ChatGPT-4o 128k (Latest) */
  Gpt4OChat_128K = 'GPT4O_CHAT_128K',
  /** GPT-4o Mini 128k (Latest) */
  Gpt4OMini_128K = 'GPT4O_MINI_128K',
  /** GPT-4o Mini 128k (2024-07-18 version) */
  Gpt4OMini_128K_20240718 = 'GPT4O_MINI_128K_20240718',
  /**
   * GPT-4 (0613 version)
   * @deprecated OpenAI has deprecated this model. Use the GPT-4o model instead.
   */
  Gpt4_0613 = 'GPT4_0613',
  /**
   * GPT-4 32k (Latest)
   * @deprecated OpenAI has deprecated this model. Use the GPT-4o model instead.
   */
  Gpt4_32K = 'GPT4_32K',
  /**
   * GPT-4 32k (0613 version)
   * @deprecated OpenAI has deprecated this model. Use the GPT-4o model instead.
   */
  Gpt4_32K_0613 = 'GPT4_32K_0613',
  /** GPT-4 Turbo 128k (Latest) */
  Gpt4Turbo_128K = 'GPT4_TURBO_128K',
  /** GPT-4 Turbo 128k (0125 version) */
  Gpt4Turbo_128K_0125 = 'GPT4_TURBO_128K_0125',
  /** GPT-4 Turbo 128k (1106 version) */
  Gpt4Turbo_128K_1106 = 'GPT4_TURBO_128K_1106',
  /** GPT-4 Turbo 128k (2024-04-09 version) */
  Gpt4Turbo_128K_20240409 = 'GPT4_TURBO_128K_20240409',
  /**
   * GPT-4 Turbo Vision 128k (Latest)
   * @deprecated OpenAI has deprecated this model. Use the GPT-4o model instead.
   */
  Gpt4TurboVision_128K = 'GPT4_TURBO_VISION_128K',
  /**
   * GPT-4 Turbo Vision 128k (1106 version)
   * @deprecated OpenAI has deprecated this model. Use the GPT-4o model instead.
   */
  Gpt4TurboVision_128K_1106 = 'GPT4_TURBO_VISION_128K_1106',
  /**
   * GPT-3.5 Turbo (Latest)
   * @deprecated OpenAI has deprecated this model. Use the GPT-4o Mini model instead.
   */
  Gpt35Turbo = 'GPT35_TURBO',
  /**
   * GPT-3.5 Turbo (0613 version)
   * @deprecated OpenAI has deprecated this model. Use the GPT-4o Mini model instead.
   */
  Gpt35Turbo_0613 = 'GPT35_TURBO_0613',
  /**
   * GPT-3.5 Turbo 16k (Latest)
   * @deprecated OpenAI has deprecated this model. Use the GPT-4o Mini model instead.
   */
  Gpt35Turbo_16K = 'GPT35_TURBO_16K',
  /**
   * GPT-3.5 Turbo 16k (0125 version)
   * @deprecated OpenAI has deprecated this model. Use the GPT-4o Mini model instead.
   */
  Gpt35Turbo_16K_0125 = 'GPT35_TURBO_16K_0125',
  /**
   * GPT-3.5 Turbo 16k (0613 version)
   * @deprecated OpenAI has deprecated this model. Use the GPT-4o Mini model instead.
   */
  Gpt35Turbo_16K_0613 = 'GPT35_TURBO_16K_0613',
  /**
   * GPT-3.5 Turbo 16k (1106 version)
   * @deprecated OpenAI has deprecated this model. Use the GPT-4o Mini model instead.
   */
  Gpt35Turbo_16K_1106 = 'GPT35_TURBO_16K_1106',
  /** GPT 4.1 1024k (Latest) */
  Gpt41_1024K = 'GPT41_1024K',
  /** GPT 4.1 1024k (2025-04-14 version) */
  Gpt41_1024K_20250414 = 'GPT41_1024K_20250414',
  /** GPT 4.1 Mini 1024k (Latest) */
  Gpt41Mini_1024K = 'GPT41_MINI_1024K',
  /** GPT 4.1 Mini 1024k (2025-04-14 version) */
  Gpt41Mini_1024K_20250414 = 'GPT41_MINI_1024K_20250414',
  /** GPT Nano 4.1 1024k (Latest) */
  Gpt41Nano_1024K = 'GPT41_NANO_1024K',
  /** GPT 4.1 Nano 1024k (2025-04-14 version) */
  Gpt41Nano_1024K_20250414 = 'GPT41_NANO_1024K_20250414',
  /**
   * GPT 4.5 Preview 128k (Latest)
   * @deprecated OpenAI has deprecated this model. Use the GPT 4.1 model instead.
   */
  Gpt45Preview_128K = 'GPT45_PREVIEW_128K',
  /**
   * GPT 4.5 Preview 128k (2025-02-27 version)
   * @deprecated OpenAI has deprecated this model. Use the GPT 4.1 model instead.
   */
  Gpt45Preview_128K_20250227 = 'GPT45_PREVIEW_128K_20250227',
  /** o1 200k (Latest) */
  O1_200K = 'O1_200K',
  /** o1 200k (2024-12-17 version) */
  O1_200K_20241217 = 'O1_200K_20241217',
  /** o1 Mini 128k (Latest) */
  O1Mini_128K = 'O1_MINI_128K',
  /** o1 Mini 128k (2024-09-12 version) */
  O1Mini_128K_20240912 = 'O1_MINI_128K_20240912',
  /** o1 Preview 128k (Latest) */
  O1Preview_128K = 'O1_PREVIEW_128K',
  /** o1 Preview 128k (2024-09-12 version) */
  O1Preview_128K_20240912 = 'O1_PREVIEW_128K_20240912',
  /** o3 200k (Latest) */
  O3_200K = 'O3_200K',
  /** o3 200k (2025-04-16 version) */
  O3_200K_20250416 = 'O3_200K_20250416',
  /** o3 Mini 200k (Latest) */
  O3Mini_200K = 'O3_MINI_200K',
  /** o3 Mini 200k (2025-01-31 version) */
  O3Mini_200K_20250131 = 'O3_MINI_200K_20250131',
  /** o4 Mini 200k (Latest) */
  O4Mini_200K = 'O4_MINI_200K',
  /** o4 Mini 200k (2025-04-16 version) */
  O4Mini_200K_20250416 = 'O4_MINI_200K_20250416'
}

/** OpenAI reasoning effort levels */
export enum OpenAiReasoningEffortLevels {
  /** High effort */
  High = 'HIGH',
  /** Low effort */
  Low = 'LOW',
  /** Medium effort */
  Medium = 'MEDIUM'
}

/** OpenAI vision model detail levels */
export enum OpenAiVisionDetailLevels {
  /** High */
  High = 'HIGH',
  /** Low */
  Low = 'LOW'
}

export enum OperationTypes {
  /** GraphQL Mutation */
  Mutation = 'MUTATION',
  /** GraphQL Query */
  Query = 'QUERY'
}

/** Order by type */
export enum OrderByTypes {
  /** Order by creation date */
  CreationDate = 'CREATION_DATE',
  /** Order by name */
  Name = 'NAME',
  /** Order by original date */
  OriginalDate = 'ORIGINAL_DATE',
  /** Order by relevance */
  Relevance = 'RELEVANCE'
}

/** Order direction type */
export enum OrderDirectionTypes {
  /** Order ascending */
  Ascending = 'ASCENDING',
  /** Order descending */
  Descending = 'DESCENDING'
}

/** Represents an organization. */
export type Organization = {
  __typename?: 'Organization';
  /** The physical address of the organization. */
  address?: Maybe<Address>;
  /** The alternate names of the organization. */
  alternateNames?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The geo-boundary of the organization, as GeoJSON Feature with Polygon geometry. */
  boundary?: Maybe<Scalars['String']['output']>;
  /** The creation date of the organization. */
  creationDate: Scalars['DateTime']['output'];
  /** The organization description. */
  description?: Maybe<Scalars['String']['output']>;
  /** The EPSG code for spatial reference of the organization. */
  epsgCode?: Maybe<Scalars['Int']['output']>;
  /** The founding date of the organization. */
  foundingDate?: Maybe<Scalars['DateTime']['output']>;
  /** The H3 index of the organization. */
  h3?: Maybe<H3>;
  /** The ID of the organization. */
  id: Scalars['ID']['output'];
  /** The organization external identifier. */
  identifier?: Maybe<Scalars['String']['output']>;
  /** The industries where the organization does business. */
  industries?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The investment into the organization. */
  investment?: Maybe<Scalars['Decimal']['output']>;
  /** The currency of the investment into the organization. */
  investmentCurrency?: Maybe<Scalars['String']['output']>;
  /** The extracted hyperlinks. */
  links?: Maybe<Array<Maybe<LinkReference>>>;
  /** The geo-location of the organization. */
  location?: Maybe<Point>;
  /** The modified date of the organization. */
  modifiedDate?: Maybe<Scalars['DateTime']['output']>;
  /** The name of the organization. */
  name: Scalars['String']['output'];
  /** The relevance score of the organization. */
  relevance?: Maybe<Scalars['Float']['output']>;
  /** The revenue of the organization. */
  revenue?: Maybe<Scalars['Decimal']['output']>;
  /** The currency of the revenue of the organization. */
  revenueCurrency?: Maybe<Scalars['String']['output']>;
  /** The state of the organization (i.e. created, enabled). */
  state: EntityState;
  /** The JSON-LD value of the organization. */
  thing?: Maybe<Scalars['String']['output']>;
  /** The organization URI. */
  uri?: Maybe<Scalars['URL']['output']>;
};

/** Represents an organization facet. */
export type OrganizationFacet = {
  __typename?: 'OrganizationFacet';
  /** The facet count. */
  count?: Maybe<Scalars['Long']['output']>;
  /** The organization facet type. */
  facet?: Maybe<OrganizationFacetTypes>;
  /** The facet value range. */
  range?: Maybe<StringRange>;
  /** The facet value type. */
  type?: Maybe<FacetValueTypes>;
  /** The facet value. */
  value?: Maybe<Scalars['String']['output']>;
};

/** Represents the configuration for organization facets. */
export type OrganizationFacetInput = {
  /** The organization facet type. */
  facet?: InputMaybe<OrganizationFacetTypes>;
  /** The facet time interval. */
  timeInterval?: InputMaybe<TimeIntervalTypes>;
  /** The facet time offset (in hours). */
  timeOffset?: InputMaybe<Scalars['Int']['input']>;
};

/** Organization facet types */
export enum OrganizationFacetTypes {
  /** Creation Date */
  CreationDate = 'CREATION_DATE'
}

/** Represents a filter for organizations. */
export type OrganizationFilter = {
  /** Filter by observable physical address. */
  address?: InputMaybe<AddressFilter>;
  /** Filter by observable geo-boundaries, as GeoJSON Feature with Polygon geometry. */
  boundaries?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Filter by creation date recent timespan. For example, a timespan of one day will return organization(s) created in the last 24 hours. */
  createdInLast?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** Filter organization(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter by observable H3 index. */
  h3?: InputMaybe<H3Filter>;
  /** Filter organization(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of organization(s) to be returned. Defaults to 100. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter by observable geo-location. */
  location?: InputMaybe<PointFilter>;
  /** Filter organization(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** When using similarity search, the number of similar items to be returned. Defaults to 100. */
  numberSimilar?: InputMaybe<Scalars['Int']['input']>;
  /** Skip the specified number of organization(s) from the beginning of the result set. Only supported on keyword search. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** The query syntax for the search text. Defaults to Simple. */
  queryType?: InputMaybe<SearchQueryTypes>;
  /** Filter organization(s) by searching for similar text. */
  search?: InputMaybe<Scalars['String']['input']>;
  /** The type of search to be used. Defaults to Vector. */
  searchType?: InputMaybe<SearchTypes>;
  /** Filter by similar organizations. */
  similarOrganizations?: InputMaybe<Array<EntityReferenceFilter>>;
  /** Filter organization(s) by their states. */
  states?: InputMaybe<Array<EntityState>>;
  /** Filter by organization URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents an organization. */
export type OrganizationInput = {
  /** The physical address of the organization. */
  address?: InputMaybe<AddressInput>;
  /** The organization geo-boundary, as GeoJSON Feature with Polygon geometry. */
  boundary?: InputMaybe<Scalars['String']['input']>;
  /** The organization description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The founding date of the organization. */
  foundingDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** The organization external identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The industries where the organization does business. */
  industries?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** The investment into the organization. */
  investment?: InputMaybe<Scalars['Decimal']['input']>;
  /** The currency of the investment into the organization. */
  investmentCurrency?: InputMaybe<Scalars['String']['input']>;
  /** The organization geo-location. */
  location?: InputMaybe<PointInput>;
  /** The name of the organization. */
  name: Scalars['String']['input'];
  /** The revenue of the organization. */
  revenue?: InputMaybe<Scalars['Decimal']['input']>;
  /** The currency of the revenue of the organization. */
  revenueCurrency?: InputMaybe<Scalars['String']['input']>;
  /** The organization URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents organization query results. */
export type OrganizationResults = {
  __typename?: 'OrganizationResults';
  /** The organization facets. */
  facets?: Maybe<Array<Maybe<OrganizationFacet>>>;
  /** The organization H3 facets. */
  h3?: Maybe<H3Facets>;
  /** The organization results. */
  results?: Maybe<Array<Maybe<Organization>>>;
};

/** Represents an organization. */
export type OrganizationUpdateInput = {
  /** The physical address of the organization. */
  address?: InputMaybe<AddressInput>;
  /** The organization geo-boundary, as GeoJSON Feature with Polygon geometry. */
  boundary?: InputMaybe<Scalars['String']['input']>;
  /** The organization description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The founding date of the organization. */
  foundingDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** The ID of the organization to update. */
  id: Scalars['ID']['input'];
  /** The organization external identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The industries where the organization does business. */
  industries?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** The investment into the organization. */
  investment?: InputMaybe<Scalars['Decimal']['input']>;
  /** The currency of the investment into the organization. */
  investmentCurrency?: InputMaybe<Scalars['String']['input']>;
  /** The organization geo-location. */
  location?: InputMaybe<PointInput>;
  /** The name of the organization. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The revenue of the organization. */
  revenue?: InputMaybe<Scalars['Decimal']['input']>;
  /** The currency of the revenue of the organization. */
  revenueCurrency?: InputMaybe<Scalars['String']['input']>;
  /** The organization URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Orientation types */
export enum OrientationTypes {
  /** Bottom left orientation */
  BottomLeft = 'BOTTOM_LEFT',
  /** Bottom right orientation */
  BottomRight = 'BOTTOM_RIGHT',
  /** Left bottom orientation */
  LeftBottom = 'LEFT_BOTTOM',
  /** Left top orientation */
  LeftTop = 'LEFT_TOP',
  /** Right bottom orientation */
  RightBottom = 'RIGHT_BOTTOM',
  /** Right top orientation */
  RightTop = 'RIGHT_TOP',
  /** Top left orientation */
  TopLeft = 'TOP_LEFT',
  /** Top right orientation */
  TopRight = 'TOP_RIGHT'
}

/** Represents an entity owner. */
export type Owner = {
  __typename?: 'Owner';
  /** The tenant identifier. */
  id: Scalars['ID']['output'];
};

/** Represents package metadata. */
export type PackageMetadata = {
  __typename?: 'PackageMetadata';
  /** The package file count. */
  fileCount?: Maybe<Scalars['Int']['output']>;
  /** The package folder count. */
  folderCount?: Maybe<Scalars['Int']['output']>;
  /** Whether the package is encrypted or not. */
  isEncrypted?: Maybe<Scalars['Boolean']['output']>;
};

/** Represents package metadata. */
export type PackageMetadataInput = {
  /** The metadata creation date. */
  creationDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** The package file count. */
  fileCount?: InputMaybe<Scalars['Int']['input']>;
  /** The package folder count. */
  folderCount?: InputMaybe<Scalars['Int']['input']>;
  /** The metadata geo-location. */
  location?: InputMaybe<PointInput>;
  /** The metadata modified date. */
  modifiedDate?: InputMaybe<Scalars['DateTime']['input']>;
};

/** Represents a person. */
export type Person = {
  __typename?: 'Person';
  /** The physical address of the person. */
  address?: Maybe<Address>;
  /** The alternate names of the person. */
  alternateNames?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The birth date of the person. */
  birthDate?: Maybe<Scalars['Date']['output']>;
  /** The geo-boundary of the person, as GeoJSON Feature with Polygon geometry. */
  boundary?: Maybe<Scalars['String']['output']>;
  /** The creation date of the person. */
  creationDate: Scalars['DateTime']['output'];
  /** The person description. */
  description?: Maybe<Scalars['String']['output']>;
  /** The education of the person. */
  education?: Maybe<Scalars['String']['output']>;
  /** The email address of the person. */
  email?: Maybe<Scalars['String']['output']>;
  /** The EPSG code for spatial reference of the person. */
  epsgCode?: Maybe<Scalars['Int']['output']>;
  /** The family name of the person. */
  familyName?: Maybe<Scalars['String']['output']>;
  /** The given name of the person. */
  givenName?: Maybe<Scalars['String']['output']>;
  /** The H3 index of the person. */
  h3?: Maybe<H3>;
  /** The ID of the person. */
  id: Scalars['ID']['output'];
  /** The person external identifier. */
  identifier?: Maybe<Scalars['String']['output']>;
  /** The extracted hyperlinks. */
  links?: Maybe<Array<Maybe<LinkReference>>>;
  /** The geo-location of the person. */
  location?: Maybe<Point>;
  /** The modified date of the person. */
  modifiedDate?: Maybe<Scalars['DateTime']['output']>;
  /** The name of the person. */
  name: Scalars['String']['output'];
  /** The occupation of the person. */
  occupation?: Maybe<Scalars['String']['output']>;
  /** The phone number of the person. */
  phoneNumber?: Maybe<Scalars['String']['output']>;
  /** The relevance score of the person. */
  relevance?: Maybe<Scalars['Float']['output']>;
  /** The state of the person (i.e. created, enabled). */
  state: EntityState;
  /** The JSON-LD value of the person. */
  thing?: Maybe<Scalars['String']['output']>;
  /** The job title of the person. */
  title?: Maybe<Scalars['String']['output']>;
  /** The person URI. */
  uri?: Maybe<Scalars['URL']['output']>;
};

/** Represents a person facet. */
export type PersonFacet = {
  __typename?: 'PersonFacet';
  /** The facet count. */
  count?: Maybe<Scalars['Long']['output']>;
  /** The person facet type. */
  facet?: Maybe<PersonFacetTypes>;
  /** The facet value range. */
  range?: Maybe<StringRange>;
  /** The facet value type. */
  type?: Maybe<FacetValueTypes>;
  /** The facet value. */
  value?: Maybe<Scalars['String']['output']>;
};

/** Represents the configuration for person facets. */
export type PersonFacetInput = {
  /** The person facet type. */
  facet?: InputMaybe<PersonFacetTypes>;
  /** The facet time interval. */
  timeInterval?: InputMaybe<TimeIntervalTypes>;
  /** The facet time offset (in hours). */
  timeOffset?: InputMaybe<Scalars['Int']['input']>;
};

/** Person facet types */
export enum PersonFacetTypes {
  /** Creation Date */
  CreationDate = 'CREATION_DATE'
}

/** Represents a filter for persons. */
export type PersonFilter = {
  /** Filter by observable physical address. */
  address?: InputMaybe<AddressFilter>;
  /** Filter by observable geo-boundaries, as GeoJSON Feature with Polygon geometry. */
  boundaries?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Filter by creation date recent timespan. For example, a timespan of one day will return person(s) created in the last 24 hours. */
  createdInLast?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** Filter person(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter by the email address of the person. */
  email?: InputMaybe<Scalars['String']['input']>;
  /** Filter by the family name of the person. */
  familyName?: InputMaybe<Scalars['String']['input']>;
  /** Filter by the given name of the person. */
  givenName?: InputMaybe<Scalars['String']['input']>;
  /** Filter by observable H3 index. */
  h3?: InputMaybe<H3Filter>;
  /** Filter person(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of person(s) to be returned. Defaults to 100. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter by observable geo-location. */
  location?: InputMaybe<PointFilter>;
  /** Filter person(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** When using similarity search, the number of similar items to be returned. Defaults to 100. */
  numberSimilar?: InputMaybe<Scalars['Int']['input']>;
  /** Skip the specified number of person(s) from the beginning of the result set. Only supported on keyword search. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** Filter by the phone number of the person. */
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  /** The query syntax for the search text. Defaults to Simple. */
  queryType?: InputMaybe<SearchQueryTypes>;
  /** Filter person(s) by searching for similar text. */
  search?: InputMaybe<Scalars['String']['input']>;
  /** The type of search to be used. Defaults to Vector. */
  searchType?: InputMaybe<SearchTypes>;
  /** Filter by similar persons. */
  similarPersons?: InputMaybe<Array<EntityReferenceFilter>>;
  /** Filter person(s) by their states. */
  states?: InputMaybe<Array<EntityState>>;
  /** Filter by person URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents a person. */
export type PersonInput = {
  /** The physical address of the person. */
  address?: InputMaybe<AddressInput>;
  /** The birth date of the person. */
  birthDate?: InputMaybe<Scalars['Date']['input']>;
  /** The person geo-boundary, as GeoJSON Feature with Polygon geometry. */
  boundary?: InputMaybe<Scalars['String']['input']>;
  /** The person description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The education of the person. */
  education?: InputMaybe<Scalars['String']['input']>;
  /** The email address of the person. */
  email?: InputMaybe<Scalars['String']['input']>;
  /** The family name of the person. */
  familyName?: InputMaybe<Scalars['String']['input']>;
  /** The given name of the person. */
  givenName?: InputMaybe<Scalars['String']['input']>;
  /** The person external identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The person geo-location. */
  location?: InputMaybe<PointInput>;
  /** The name of the person. */
  name: Scalars['String']['input'];
  /** The occupation of the person. */
  occupation?: InputMaybe<Scalars['String']['input']>;
  /** The phone number of the person. */
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  /** The job title of the person. */
  title?: InputMaybe<Scalars['String']['input']>;
  /** The person URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents a person reference. */
export type PersonReference = {
  __typename?: 'PersonReference';
  /** The email address of the person. */
  email?: Maybe<Scalars['String']['output']>;
  /** The family name of the person. */
  familyName?: Maybe<Scalars['String']['output']>;
  /** The given name of the person. */
  givenName?: Maybe<Scalars['String']['output']>;
  /** The name of the person. */
  name?: Maybe<Scalars['String']['output']>;
};

/** Represents person query results. */
export type PersonResults = {
  __typename?: 'PersonResults';
  /** The person facets. */
  facets?: Maybe<Array<Maybe<PersonFacet>>>;
  /** The person H3 facets. */
  h3?: Maybe<H3Facets>;
  /** The person results. */
  results?: Maybe<Array<Maybe<Person>>>;
};

/** Represents a person. */
export type PersonUpdateInput = {
  /** The physical address of the person. */
  address?: InputMaybe<AddressInput>;
  /** The birth date of the person. */
  birthDate?: InputMaybe<Scalars['Date']['input']>;
  /** The person geo-boundary, as GeoJSON Feature with Polygon geometry. */
  boundary?: InputMaybe<Scalars['String']['input']>;
  /** The person description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The education of the person. */
  education?: InputMaybe<Scalars['String']['input']>;
  /** The email address of the person. */
  email?: InputMaybe<Scalars['String']['input']>;
  /** The family name of the person. */
  familyName?: InputMaybe<Scalars['String']['input']>;
  /** The given name of the person. */
  givenName?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the person to update. */
  id: Scalars['ID']['input'];
  /** The person external identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The person geo-location. */
  location?: InputMaybe<PointInput>;
  /** The name of the person. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The occupation of the person. */
  occupation?: InputMaybe<Scalars['String']['input']>;
  /** The phone number of the person. */
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  /** The job title of the person. */
  title?: InputMaybe<Scalars['String']['input']>;
  /** The person URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents a place. */
export type Place = {
  __typename?: 'Place';
  /** The physical address of the place. */
  address?: Maybe<Address>;
  /** The alternate names of the place. */
  alternateNames?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The geo-boundary of the place, as GeoJSON Feature with Polygon geometry. */
  boundary?: Maybe<Scalars['String']['output']>;
  /** The creation date of the place. */
  creationDate: Scalars['DateTime']['output'];
  /** The place description. */
  description?: Maybe<Scalars['String']['output']>;
  /** The EPSG code for spatial reference of the place. */
  epsgCode?: Maybe<Scalars['Int']['output']>;
  /** The H3 index of the place. */
  h3?: Maybe<H3>;
  /** The ID of the place. */
  id: Scalars['ID']['output'];
  /** The place external identifier. */
  identifier?: Maybe<Scalars['String']['output']>;
  /** The extracted hyperlinks. */
  links?: Maybe<Array<Maybe<LinkReference>>>;
  /** The geo-location of the place. */
  location?: Maybe<Point>;
  /** The modified date of the place. */
  modifiedDate?: Maybe<Scalars['DateTime']['output']>;
  /** The name of the place. */
  name: Scalars['String']['output'];
  /** The relevance score of the place. */
  relevance?: Maybe<Scalars['Float']['output']>;
  /** The state of the place (i.e. created, enabled). */
  state: EntityState;
  /** The JSON-LD value of the place. */
  thing?: Maybe<Scalars['String']['output']>;
  /** The place URI. */
  uri?: Maybe<Scalars['URL']['output']>;
};

/** Represents a place facet. */
export type PlaceFacet = {
  __typename?: 'PlaceFacet';
  /** The facet count. */
  count?: Maybe<Scalars['Long']['output']>;
  /** The place facet type. */
  facet?: Maybe<PlaceFacetTypes>;
  /** The facet value range. */
  range?: Maybe<StringRange>;
  /** The facet value type. */
  type?: Maybe<FacetValueTypes>;
  /** The facet value. */
  value?: Maybe<Scalars['String']['output']>;
};

/** Represents the configuration for place facet. */
export type PlaceFacetInput = {
  /** The place facet type. */
  facet?: InputMaybe<PlaceFacetTypes>;
  /** The facet time interval. */
  timeInterval?: InputMaybe<TimeIntervalTypes>;
  /** The facet time offset (in hours). */
  timeOffset?: InputMaybe<Scalars['Int']['input']>;
};

/** Place facet types */
export enum PlaceFacetTypes {
  /** Creation Date */
  CreationDate = 'CREATION_DATE'
}

/** Represents a filter for places. */
export type PlaceFilter = {
  /** Filter by observable physical address. */
  address?: InputMaybe<AddressFilter>;
  /** Filter by observable geo-boundaries, as GeoJSON Feature with Polygon geometry. */
  boundaries?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Filter by creation date recent timespan. For example, a timespan of one day will return place(s) created in the last 24 hours. */
  createdInLast?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** Filter place(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter by observable H3 index. */
  h3?: InputMaybe<H3Filter>;
  /** Filter place(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of place(s) to be returned. Defaults to 100. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter by observable geo-location. */
  location?: InputMaybe<PointFilter>;
  /** Filter place(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** When using similarity search, the number of similar items to be returned. Defaults to 100. */
  numberSimilar?: InputMaybe<Scalars['Int']['input']>;
  /** Skip the specified number of place(s) from the beginning of the result set. Only supported on keyword search. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** The query syntax for the search text. Defaults to Simple. */
  queryType?: InputMaybe<SearchQueryTypes>;
  /** Filter place(s) by searching for similar text. */
  search?: InputMaybe<Scalars['String']['input']>;
  /** The type of search to be used. Defaults to Vector. */
  searchType?: InputMaybe<SearchTypes>;
  /** Filter by similar places. */
  similarPlaces?: InputMaybe<Array<EntityReferenceFilter>>;
  /** Filter place(s) by their states. */
  states?: InputMaybe<Array<EntityState>>;
};

/** Represents a place. */
export type PlaceInput = {
  /** The physical address of the place. */
  address?: InputMaybe<AddressInput>;
  /** The place geo-boundary, as GeoJSON Feature with Polygon geometry. */
  boundary?: InputMaybe<Scalars['String']['input']>;
  /** The place description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The place external identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The place geo-location. */
  location?: InputMaybe<PointInput>;
  /** The name of the place. */
  name: Scalars['String']['input'];
  /** The place URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents place query results. */
export type PlaceResults = {
  __typename?: 'PlaceResults';
  /** The place facets. */
  facets?: Maybe<Array<Maybe<PlaceFacet>>>;
  /** The place H3 facets. */
  h3?: Maybe<H3Facets>;
  /** The place results. */
  results?: Maybe<Array<Maybe<Place>>>;
};

/** Represents a place. */
export type PlaceUpdateInput = {
  /** The physical address of the place. */
  address?: InputMaybe<AddressInput>;
  /** The place geo-boundary, as GeoJSON Feature with Polygon geometry. */
  boundary?: InputMaybe<Scalars['String']['input']>;
  /** The place description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the place to update. */
  id: Scalars['ID']['input'];
  /** The place external identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The place geo-location. */
  location?: InputMaybe<PointInput>;
  /** The name of the place. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The place URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents a geospatial point (i.e. latitude, longitude). */
export type Point = {
  __typename?: 'Point';
  /** The latitude. */
  latitude?: Maybe<Scalars['Float']['output']>;
  /** The longitude. */
  longitude?: Maybe<Scalars['Float']['output']>;
};

/** Represents point cloud metadata. */
export type PointCloudMetadata = {
  __typename?: 'PointCloudMetadata';
  /** The point cloud description. */
  description?: Maybe<Scalars['String']['output']>;
  /** The point cloud device identifier. */
  identifier?: Maybe<Scalars['String']['output']>;
  /** The point cloud point count. */
  pointCount?: Maybe<Scalars['Long']['output']>;
  /** The point cloud device software. */
  software?: Maybe<Scalars['String']['output']>;
};

/** Represents point cloud metadata. */
export type PointCloudMetadataInput = {
  /** The metadata creation date. */
  creationDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** The point cloud description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The point cloud device identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The metadata geo-location. */
  location?: InputMaybe<PointInput>;
  /** The metadata modified date. */
  modifiedDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** The point cloud point count. */
  pointCount?: InputMaybe<Scalars['Long']['input']>;
  /** The point cloud device software. */
  software?: InputMaybe<Scalars['String']['input']>;
};

/** Filter by geospatial point (i.e. latitude, longitude) and distance radius. */
export type PointFilter = {
  /** The distance radius (in meters). */
  distance?: InputMaybe<Scalars['Float']['input']>;
  /** The latitude. */
  latitude: Scalars['Float']['input'];
  /** The longitude. */
  longitude: Scalars['Float']['input'];
};

/** Represents a geospatial point (i.e. latitude, longitude). */
export type PointInput = {
  /** The distance (in meters). */
  distance?: InputMaybe<Scalars['Float']['input']>;
  /** The latitude. */
  latitude: Scalars['Float']['input'];
  /** The longitude. */
  longitude: Scalars['Float']['input'];
};

/** Time type for policies */
export enum PolicyTimeTypes {
  /** Absolute time */
  AbsoluteTime = 'ABSOLUTE_TIME',
  /** Relative time */
  RelativeTime = 'RELATIVE_TIME'
}

/** Represents a preparation workflow job. */
export type PreparationWorkflowJob = {
  __typename?: 'PreparationWorkflowJob';
  /** The file preparation connector. */
  connector?: Maybe<FilePreparationConnector>;
};

/** Represents a preparation workflow job. */
export type PreparationWorkflowJobInput = {
  /** The file preparation connector. */
  connector?: InputMaybe<FilePreparationConnectorInput>;
};

/** Represents the preparation workflow stage. */
export type PreparationWorkflowStage = {
  __typename?: 'PreparationWorkflowStage';
  /** Whether to disable smart HTML capture of web pages. Enabled by default for better support of dynamic HTML pages, but can be disabled for better performance. */
  disableSmartCapture?: Maybe<Scalars['Boolean']['output']>;
  /** Whether to enable unblocked HTML capture of web pages. Disabled by default, but can be enabled to get around Cloudflare blocking. Enabling will incur 10x cost per web page capture. */
  enableUnblockedCapture?: Maybe<Scalars['Boolean']['output']>;
  /** The jobs for the preparation workflow stage. */
  jobs?: Maybe<Array<Maybe<PreparationWorkflowJob>>>;
  /** The list of prepared content summaries. */
  summarizations?: Maybe<Array<Maybe<SummarizationStrategy>>>;
};

/** Represents the preparation workflow stage. */
export type PreparationWorkflowStageInput = {
  /** Whether to disable smart HTML capture of web pages.  Enabled by default for better support of dynamic HTML pages, but can be disabled for better performance. */
  disableSmartCapture?: InputMaybe<Scalars['Boolean']['input']>;
  /** Whether to enable unblocked HTML capture of web pages. Disabled by default, but can be enabled to get around Cloudflare blocking. Enabling will incur 10x cost per web page capture. */
  enableUnblockedCapture?: InputMaybe<Scalars['Boolean']['input']>;
  /** The jobs for the preparation workflow stage. */
  jobs?: InputMaybe<Array<InputMaybe<PreparationWorkflowJobInput>>>;
  /** The list of prepared content summaries. */
  summarizations?: InputMaybe<Array<InputMaybe<SummarizationStrategyInput>>>;
};

/** Represents a product. */
export type Product = {
  __typename?: 'Product';
  /** The physical address of the product. */
  address?: Maybe<Address>;
  /** The alternate names of the product. */
  alternateNames?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The geo-boundary of the product, as GeoJSON Feature with Polygon geometry. */
  boundary?: Maybe<Scalars['String']['output']>;
  /** The product brand. */
  brand?: Maybe<Scalars['String']['output']>;
  /** The creation date of the product. */
  creationDate: Scalars['DateTime']['output'];
  /** The product description. */
  description?: Maybe<Scalars['String']['output']>;
  /** The EPSG code for spatial reference of the product. */
  epsgCode?: Maybe<Scalars['Int']['output']>;
  /** The H3 index of the product. */
  h3?: Maybe<H3>;
  /** The ID of the product. */
  id: Scalars['ID']['output'];
  /** The product external identifier. */
  identifier?: Maybe<Scalars['String']['output']>;
  /** The extracted hyperlinks. */
  links?: Maybe<Array<Maybe<LinkReference>>>;
  /** The geo-location of the product. */
  location?: Maybe<Point>;
  /** The product manufacturer. */
  manufacturer?: Maybe<Scalars['String']['output']>;
  /** The product model. */
  model?: Maybe<Scalars['String']['output']>;
  /** The modified date of the product. */
  modifiedDate?: Maybe<Scalars['DateTime']['output']>;
  /** The name of the product. */
  name: Scalars['String']['output'];
  /** The production date. */
  productionDate?: Maybe<Scalars['DateTime']['output']>;
  /** The product release date. */
  releaseDate?: Maybe<Scalars['DateTime']['output']>;
  /** The relevance score of the product. */
  relevance?: Maybe<Scalars['Float']['output']>;
  /** The product SKU. */
  sku?: Maybe<Scalars['String']['output']>;
  /** The state of the product (i.e. created, enabled). */
  state: EntityState;
  /** The JSON-LD value of the product. */
  thing?: Maybe<Scalars['String']['output']>;
  /** The product UPC. */
  upc?: Maybe<Scalars['String']['output']>;
  /** The product URI. */
  uri?: Maybe<Scalars['URL']['output']>;
};

/** Represents a product facet. */
export type ProductFacet = {
  __typename?: 'ProductFacet';
  /** The facet count. */
  count?: Maybe<Scalars['Long']['output']>;
  /** The product facet type. */
  facet?: Maybe<ProductFacetTypes>;
  /** The facet value range. */
  range?: Maybe<StringRange>;
  /** The facet value type. */
  type?: Maybe<FacetValueTypes>;
  /** The facet value. */
  value?: Maybe<Scalars['String']['output']>;
};

/** Represents the configuration for product facets. */
export type ProductFacetInput = {
  /** The product facet type. */
  facet?: InputMaybe<ProductFacetTypes>;
  /** The facet time interval. */
  timeInterval?: InputMaybe<TimeIntervalTypes>;
  /** The facet time offset (in hours). */
  timeOffset?: InputMaybe<Scalars['Int']['input']>;
};

/** Product facet types */
export enum ProductFacetTypes {
  /** Creation Date */
  CreationDate = 'CREATION_DATE'
}

/** Represents a filter for products. */
export type ProductFilter = {
  /** Filter by observable physical address. */
  address?: InputMaybe<AddressFilter>;
  /** Filter by observable geo-boundaries, as GeoJSON Feature with Polygon geometry. */
  boundaries?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Filter by product brand. */
  brand?: InputMaybe<Scalars['String']['input']>;
  /** Filter by creation date recent timespan. For example, a timespan of one day will return product(s) created in the last 24 hours. */
  createdInLast?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** Filter product(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter by observable H3 index. */
  h3?: InputMaybe<H3Filter>;
  /** Filter product(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of product(s) to be returned. Defaults to 100. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter by observable geo-location. */
  location?: InputMaybe<PointFilter>;
  /** Filter by product manufacturer. */
  manufacturer?: InputMaybe<Scalars['String']['input']>;
  /** Filter by product model. */
  model?: InputMaybe<Scalars['String']['input']>;
  /** Filter product(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** When using similarity search, the number of similar items to be returned. Defaults to 100. */
  numberSimilar?: InputMaybe<Scalars['Int']['input']>;
  /** Skip the specified number of product(s) from the beginning of the result set. Only supported on keyword search. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** Filter by production date range. */
  productionDateRange?: InputMaybe<DateRangeFilter>;
  /** The query syntax for the search text. Defaults to Simple. */
  queryType?: InputMaybe<SearchQueryTypes>;
  /** Filter by release date range. */
  releaseDateRange?: InputMaybe<DateRangeFilter>;
  /** Filter product(s) by searching for similar text. */
  search?: InputMaybe<Scalars['String']['input']>;
  /** The type of search to be used. Defaults to Vector. */
  searchType?: InputMaybe<SearchTypes>;
  /** Filter by similar products. */
  similarProducts?: InputMaybe<Array<EntityReferenceFilter>>;
  /** Filter by product SKU. */
  sku?: InputMaybe<Scalars['String']['input']>;
  /** Filter product(s) by their states. */
  states?: InputMaybe<Array<EntityState>>;
  /** Filter by product UPC. */
  upc?: InputMaybe<Scalars['String']['input']>;
};

/** Represents a product. */
export type ProductInput = {
  /** The physical address of the product. */
  address?: InputMaybe<AddressInput>;
  /** The product geo-boundary, as GeoJSON Feature with Polygon geometry. */
  boundary?: InputMaybe<Scalars['String']['input']>;
  /** The product brand. */
  brand?: InputMaybe<Scalars['String']['input']>;
  /** The product description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The product external identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The product geo-location. */
  location?: InputMaybe<PointInput>;
  /** The product manufacturer. */
  manufacturer?: InputMaybe<Scalars['String']['input']>;
  /** The product model. */
  model?: InputMaybe<Scalars['String']['input']>;
  /** The name of the product. */
  name: Scalars['String']['input'];
  /** The production date. */
  productionDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** The release date. */
  releaseDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** The product SKU. */
  sku?: InputMaybe<Scalars['String']['input']>;
  /** The product UPC. */
  upc?: InputMaybe<Scalars['String']['input']>;
  /** The product URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents product query results. */
export type ProductResults = {
  __typename?: 'ProductResults';
  /** The product facets. */
  facets?: Maybe<Array<Maybe<ProductFacet>>>;
  /** The product results. */
  results?: Maybe<Array<Maybe<Product>>>;
};

/** Represents a product. */
export type ProductUpdateInput = {
  /** The physical address of the product. */
  address?: InputMaybe<AddressInput>;
  /** The product geo-boundary, as GeoJSON Feature with Polygon geometry. */
  boundary?: InputMaybe<Scalars['String']['input']>;
  /** The product brand. */
  brand?: InputMaybe<Scalars['String']['input']>;
  /** The product description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the product to update. */
  id: Scalars['ID']['input'];
  /** The product external identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The product geo-location. */
  location?: InputMaybe<PointInput>;
  /** The product manufacturer. */
  manufacturer?: InputMaybe<Scalars['String']['input']>;
  /** The product model. */
  model?: InputMaybe<Scalars['String']['input']>;
  /** The name of the product. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The production date. */
  productionDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** The release date. */
  releaseDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** The product SKU. */
  sku?: InputMaybe<Scalars['String']['input']>;
  /** The product UPC. */
  upc?: InputMaybe<Scalars['String']['input']>;
  /** The product URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents a project. */
export type Project = {
  __typename?: 'Project';
  /** The project callback URI, optional. The platform will callback to this webhook upon credit charges. */
  callbackUri?: Maybe<Scalars['URL']['output']>;
  /** The creation date of the project. */
  creationDate: Scalars['DateTime']['output'];
  /** The project credit usage. */
  credits?: Maybe<Scalars['Long']['output']>;
  /** The project vector storage embeddings strategy. */
  embeddings?: Maybe<EmbeddingsStrategy>;
  /** The project environment type. */
  environmentType?: Maybe<EnvironmentTypes>;
  /** The ID of the project. */
  id: Scalars['ID']['output'];
  /** The project JWT signing secret. */
  jwtSecret?: Maybe<Scalars['String']['output']>;
  /** The last date that project credit usage was synchronized. */
  lastCreditsDate?: Maybe<Scalars['DateTime']['output']>;
  /** The modified date of the project. */
  modifiedDate?: Maybe<Scalars['DateTime']['output']>;
  /** The name of the project. */
  name: Scalars['String']['output'];
  /** The project cloud platform. */
  platform?: Maybe<ResourceConnectorTypes>;
  /** The project quota. */
  quota?: Maybe<ProjectQuota>;
  /** The project region. */
  region?: Maybe<Scalars['String']['output']>;
  /** The default project specification. */
  specification?: Maybe<Specification>;
  /** The state of the project (created, enabled). */
  state: EntityState;
  /** The project storage. */
  storage?: Maybe<ProjectStorage>;
  /** The project storage details. */
  storageDetails?: Maybe<ProjectStorageDetails>;
  /** The project tenants. */
  tenants?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  /** The default project workflow. */
  workflow?: Maybe<Workflow>;
};

/** Represents correlated project credits. */
export type ProjectCredits = {
  __typename?: 'ProjectCredits';
  /** The content classification ratio of credits. */
  classificationRatio?: Maybe<Scalars['Decimal']['output']>;
  /** The LLM completion ratio of credits, includes conversation, preparation and extraction LLM usage. */
  completionRatio?: Maybe<Scalars['Decimal']['output']>;
  /** The compute ratio of credits. */
  computeRatio?: Maybe<Scalars['Decimal']['output']>;
  /** The conversations ratio of credits. */
  conversationRatio?: Maybe<Scalars['Decimal']['output']>;
  /** The tenant correlation identifier. */
  correlationId?: Maybe<Scalars['String']['output']>;
  /** The credits used. */
  credits?: Maybe<Scalars['Decimal']['output']>;
  /** The LLM embedding ratio of credits. */
  embeddingRatio?: Maybe<Scalars['Decimal']['output']>;
  /** The content enrichment ratio of credits. */
  enrichmentRatio?: Maybe<Scalars['Decimal']['output']>;
  /** The content extraction ratio of credits. */
  extractionRatio?: Maybe<Scalars['Decimal']['output']>;
  /** The LLM generation ratio of credits. */
  generationRatio?: Maybe<Scalars['Decimal']['output']>;
  /** The content indexing ratio of credits. */
  indexingRatio?: Maybe<Scalars['Decimal']['output']>;
  /** The content ingestion ratio of credits. */
  ingestionRatio?: Maybe<Scalars['Decimal']['output']>;
  /** The tenant identifier. */
  ownerId?: Maybe<Scalars['ID']['output']>;
  /** The content preparation ratio of credits. */
  preparationRatio?: Maybe<Scalars['Decimal']['output']>;
  /** The content publishing ratio of credits. */
  publishingRatio?: Maybe<Scalars['Decimal']['output']>;
  /** The content search ratio of credits. */
  searchRatio?: Maybe<Scalars['Decimal']['output']>;
  /** The content storage ratio of credits. */
  storageRatio?: Maybe<Scalars['Decimal']['output']>;
};

/** Represents a filter for projects. */
export type ProjectFilter = {
  /** Filter by creation date recent timespan. For example, a timespan of one day will return project(s) created in the last 24 hours. */
  createdInLast?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** Filter project(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter project(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of project(s) to be returned. Defaults to 100. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter project(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Skip the specified number of project(s) from the beginning of the result set. Only supported on keyword search. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** Filter project(s) by searching for similar text. */
  search?: InputMaybe<Scalars['String']['input']>;
  /** Filter project(s) by their states. */
  states?: InputMaybe<Array<EntityState>>;
};

/** Represents a project. */
export type ProjectInput = {
  /** The project callback URI, optional. The platform will callback to this webhook upon credit charges. */
  callbackUri?: InputMaybe<Scalars['URL']['input']>;
  /** The project environment type. */
  environmentType: EnvironmentTypes;
  /** The project JWT signing secret. */
  jwtSecret: Scalars['String']['input'];
  /** The name of the project. */
  name: Scalars['String']['input'];
  /** The project cloud platform. */
  platform: ResourceConnectorTypes;
  /** The project quota. */
  quota?: InputMaybe<ProjectQuotaInput>;
  /** The project region. */
  region: Scalars['String']['input'];
};

/** Represents the project quota. */
export type ProjectQuota = {
  __typename?: 'ProjectQuota';
  /** The maximum number of contents which can be ingested. */
  contents?: Maybe<Scalars['Int']['output']>;
  /** The maximum number of conversations which can be created. */
  conversations?: Maybe<Scalars['Int']['output']>;
  /** The maximum number of credits which can be accrued. */
  credits?: Maybe<Scalars['Int']['output']>;
  /** The maximum number of feeds which can be created. */
  feeds?: Maybe<Scalars['Int']['output']>;
  /** The maximum number of posts which can be read by feeds. */
  posts?: Maybe<Scalars['Int']['output']>;
  /** The storage quota, in bytes. */
  storage?: Maybe<Scalars['Long']['output']>;
};

/** Represents the project quota. */
export type ProjectQuotaInput = {
  /** The maximum number of contents which can be ingested. */
  contents?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum number of conversations which can be created. */
  conversations?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum number of feeds which can be created. */
  feeds?: InputMaybe<Scalars['Int']['input']>;
  /** The maximum number of posts which can be read by feeds. */
  posts?: InputMaybe<Scalars['Int']['input']>;
  /** The storage quota, in bytes. */
  storage?: InputMaybe<Scalars['Long']['input']>;
};

/** Represents project query results. */
export type ProjectResults = {
  __typename?: 'ProjectResults';
  /** The project results. */
  results?: Maybe<Array<Maybe<Project>>>;
};

/** Represents the storage usage of a project. */
export type ProjectStorage = {
  __typename?: 'ProjectStorage';
  /** The count of stored content for this facet. */
  count?: Maybe<Scalars['Long']['output']>;
  /** The email content type storage facet. */
  email?: Maybe<ProjectStorageContentFacet>;
  /** The event content type storage facet. */
  event?: Maybe<ProjectStorageContentFacet>;
  /** The file content type storage facet. */
  file?: Maybe<ProjectStorageFileContentFacet>;
  /** The issue content type storage facet. */
  issue?: Maybe<ProjectStorageContentFacet>;
  /** The memory content type storage facet. */
  memory?: Maybe<ProjectStorageContentFacet>;
  /** The message content type storage facet. */
  message?: Maybe<ProjectStorageContentFacet>;
  /** The page content type storage facet. */
  page?: Maybe<ProjectStorageContentFacet>;
  /** The post content type storage facet. */
  post?: Maybe<ProjectStorageContentFacet>;
  /** The text content type storage facet. */
  text?: Maybe<ProjectStorageContentFacet>;
  /** The total size of stored content for this facet, including all renditions. */
  totalRenditionSize?: Maybe<Scalars['Long']['output']>;
  /** The total size of stored content for this facet, only including master renditions. */
  totalSize?: Maybe<Scalars['Long']['output']>;
};

/** Represents a project storage content facet. */
export type ProjectStorageContentFacet = {
  __typename?: 'ProjectStorageContentFacet';
  /** The count of stored content for this facet. */
  count?: Maybe<Scalars['Long']['output']>;
  /** The total size of stored content for this facet, including all renditions. */
  totalRenditionSize?: Maybe<Scalars['Long']['output']>;
  /** The total size of stored content for this facet, only including master renditions. */
  totalSize?: Maybe<Scalars['Long']['output']>;
  /** The content type for this facet. */
  type?: Maybe<ContentTypes>;
};

/** Represents a project storage details facet. */
export type ProjectStorageDetails = {
  __typename?: 'ProjectStorageDetails';
  /** The first creation date of stored content. */
  firstCreationDate?: Maybe<Scalars['DateTime']['output']>;
  /** The first original date of stored content. */
  firstOriginalDate?: Maybe<Scalars['DateTime']['output']>;
  /** The last creation date of stored content. */
  lastCreationDate?: Maybe<Scalars['DateTime']['output']>;
  /** The last original date of stored content. */
  lastOriginalDate?: Maybe<Scalars['DateTime']['output']>;
};

/** Represents a project storage file content facet. */
export type ProjectStorageFileContentFacet = {
  __typename?: 'ProjectStorageFileContentFacet';
  /** The animation file type storage facet. */
  animation?: Maybe<ProjectStorageFileFacet>;
  /** The audio file type storage facet. */
  audio?: Maybe<ProjectStorageFileFacet>;
  /** The code file type storage facet. */
  code?: Maybe<ProjectStorageFileFacet>;
  /** The count of stored content for this facet. */
  count?: Maybe<Scalars['Long']['output']>;
  /** The data file type storage facet. */
  data?: Maybe<ProjectStorageFileFacet>;
  /** The document file type storage facet. */
  document?: Maybe<ProjectStorageFileFacet>;
  /** The drawing file type storage facet. */
  drawing?: Maybe<ProjectStorageFileFacet>;
  /** The email file type storage facet. */
  email?: Maybe<ProjectStorageFileFacet>;
  /** The geometry file type storage facet. */
  geometry?: Maybe<ProjectStorageFileFacet>;
  /** The image file type storage facet. */
  image?: Maybe<ProjectStorageFileFacet>;
  /** The package file type storage facet. */
  package?: Maybe<ProjectStorageFileFacet>;
  /** The point cloud file type storage facet. */
  pointCloud?: Maybe<ProjectStorageFileFacet>;
  /** The shape file type storage facet. */
  shape?: Maybe<ProjectStorageFileFacet>;
  /** The total size of stored content for this facet, including all renditions. */
  totalRenditionSize?: Maybe<Scalars['Long']['output']>;
  /** The total size of stored content for this facet, only including master renditions. */
  totalSize?: Maybe<Scalars['Long']['output']>;
  /** The content type for this facet. */
  type?: Maybe<ContentTypes>;
  /** The unknown file type storage facet. */
  unknown?: Maybe<ProjectStorageFileFacet>;
  /** The video file type storage facet. */
  video?: Maybe<ProjectStorageFileFacet>;
};

/** Represents a project storage file facet. */
export type ProjectStorageFileFacet = {
  __typename?: 'ProjectStorageFileFacet';
  /** The count of stored content for this facet. */
  count?: Maybe<Scalars['Long']['output']>;
  /** The file type for this facet. */
  fileType?: Maybe<FileTypes>;
  /** The total size of stored content for this facet, including all renditions. */
  totalRenditionSize?: Maybe<Scalars['Long']['output']>;
  /** The total size of stored content for this facet, only including master renditions. */
  totalSize?: Maybe<Scalars['Long']['output']>;
  /** The content type for this facet. */
  type?: Maybe<ContentTypes>;
};

/** Represents correlated project tokens. */
export type ProjectTokens = {
  __typename?: 'ProjectTokens';
  /** The LLM completion input tokens used. */
  completionInputTokens?: Maybe<Scalars['Int']['output']>;
  /** The LLM completion model services used. */
  completionModelServices?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The LLM completion output tokens used. */
  completionOutputTokens?: Maybe<Scalars['Int']['output']>;
  /** The tenant correlation identifier. */
  correlationId?: Maybe<Scalars['String']['output']>;
  /** The LLM embedding input tokens used. */
  embeddingInputTokens?: Maybe<Scalars['Int']['output']>;
  /** The LLM embedding model services used. */
  embeddingModelServices?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The LLM extraction input tokens used. */
  extractionInputTokens?: Maybe<Scalars['Int']['output']>;
  /** The LLM extraction model services used. */
  extractionModelServices?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The LLM extraction output tokens used. */
  extractionOutputTokens?: Maybe<Scalars['Int']['output']>;
  /** The LLM generation input tokens used. */
  generationInputTokens?: Maybe<Scalars['Int']['output']>;
  /** The LLM generation model services used. */
  generationModelServices?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The LLM generation output tokens used. */
  generationOutputTokens?: Maybe<Scalars['Int']['output']>;
  /** The tenant identifier. */
  ownerId?: Maybe<Scalars['ID']['output']>;
  /** The LLM preparation input tokens used. */
  preparationInputTokens?: Maybe<Scalars['Int']['output']>;
  /** The LLM preparation model services used. */
  preparationModelServices?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The LLM preparation output tokens used. */
  preparationOutputTokens?: Maybe<Scalars['Int']['output']>;
};

/** Represents a project. */
export type ProjectUpdateInput = {
  /** The project callback URI, optional. The platform will callback to this webhook upon credit charges. */
  callbackUri?: InputMaybe<Scalars['URL']['input']>;
  /** The project vector storage embeddings strategy. */
  embeddings?: InputMaybe<EmbeddingsStrategyInput>;
  /** The default LLM specification for conversations. */
  specification?: InputMaybe<EntityReferenceInput>;
  /** The default content workflow. */
  workflow?: InputMaybe<EntityReferenceInput>;
};

/** Represents a usage record. */
export type ProjectUsageRecord = {
  __typename?: 'ProjectUsageRecord';
  /** The LLM completion, if billable metric is 'Tokens'. */
  completion?: Maybe<Scalars['String']['output']>;
  /** The token count of the LLM completion, if billable metric is 'Tokens'. */
  completionTokens?: Maybe<Scalars['Int']['output']>;
  /** The content type, if content usage record. */
  contentType?: Maybe<ContentTypes>;
  /** The tenant correlation identifier. */
  correlationId?: Maybe<Scalars['ID']['output']>;
  /** The count of processed units. */
  count?: Maybe<Scalars['Int']['output']>;
  /** The credits used. */
  credits?: Maybe<Scalars['Decimal']['output']>;
  /** The usage record generated date. */
  date: Scalars['DateTime']['output'];
  /** The duration of the operation associated with the usage record, i.e. elapsed time for LLM completion. */
  duration?: Maybe<Scalars['TimeSpan']['output']>;
  /** The entity identifier associated with the usage record. */
  entityId?: Maybe<Scalars['ID']['output']>;
  /** The entity type associated with the usage record. */
  entityType?: Maybe<EntityTypes>;
  /** The file type, if content usage record. */
  fileType?: Maybe<FileTypes>;
  /** The usage record identifier. */
  id?: Maybe<Scalars['ID']['output']>;
  /** The billable metric type of the usage record, i.e. 'Tokens' or 'Units'. */
  metric?: Maybe<BillableMetrics>;
  /** For LLM operations, the LLM model name. Or, for transcription operations, the transcription model name. */
  modelName?: Maybe<Scalars['String']['output']>;
  /** For LLM operations, the LLM model service. Or, for transcription operations, the transcription service. */
  modelService?: Maybe<Scalars['String']['output']>;
  /** Descriptive name associated with the usage record, i.e. 'Prompt completion' or 'Search entities'. */
  name: Scalars['String']['output'];
  /** The GraphQL operation name, if billable metric is 'Request'. */
  operation?: Maybe<Scalars['String']['output']>;
  /** The GraphQL operation type, if billable metric is 'Request'. */
  operationType?: Maybe<OperationTypes>;
  /** The tenant identifier associated with the usage record. */
  ownerId: Scalars['ID']['output'];
  /** The service name when processing by external APIs. */
  processorName?: Maybe<Scalars['String']['output']>;
  /** The project identifier associated with the usage record. */
  projectId: Scalars['ID']['output'];
  /** The LLM user prompt or embedded text, if billable metric is 'Tokens'. */
  prompt?: Maybe<Scalars['String']['output']>;
  /** The token count of the LLM prompt, if billable metric is 'Tokens'. */
  promptTokens?: Maybe<Scalars['Int']['output']>;
  /** The GraphQL request, if billable metric is 'Request'. */
  request?: Maybe<Scalars['String']['output']>;
  /** The GraphQL response, if billable metric is 'Request'. */
  response?: Maybe<Scalars['String']['output']>;
  /** The throughput of the operation associated with the usage record, i.e. tokens/sec for LLM completion. */
  throughput?: Maybe<Scalars['Float']['output']>;
  /** The total LLM token count, if billable metric is 'Tokens'. */
  tokens?: Maybe<Scalars['Int']['output']>;
  /** The content URI, if content usage record. */
  uri?: Maybe<Scalars['ID']['output']>;
  /** The GraphQL variables, if billable metric is 'Request'. */
  variables?: Maybe<Scalars['String']['output']>;
  /** The workflow stage associated with the usage record, i.e. 'Preparation' or 'Enrichment'. */
  workflow?: Maybe<Scalars['String']['output']>;
};

/** Represents the LLM prompt content classification rule. */
export type PromptClassificationRule = {
  __typename?: 'PromptClassificationRule';
  /** The LLM prompt for content classification. Treat as 'If content ...'. */
  if?: Maybe<Scalars['String']['output']>;
  /** The label name to be assigned upon content classification. Treat as 'Then label as ...'. */
  then?: Maybe<Scalars['String']['output']>;
};

/** Represents the LLM prompt content classification rule. */
export type PromptClassificationRuleInput = {
  /** The LLM prompt for content classification. Treat as 'If content ...'. */
  if?: InputMaybe<Scalars['String']['input']>;
  /** The label name to be assigned upon content classification. Treat as 'Then label as ...'. */
  then?: InputMaybe<Scalars['String']['input']>;
};

/** Represents a prompted LLM completion. */
export type PromptCompletion = {
  __typename?: 'PromptCompletion';
  /** If prompt completion failed, the error message. */
  error?: Maybe<Scalars['String']['output']>;
  /** The completed messages. */
  messages?: Maybe<Array<Maybe<ConversationMessage>>>;
  /** The LLM specification used for prompt completion, optional. */
  specification?: Maybe<EntityReference>;
};

/** Represents a prompted conversation. */
export type PromptConversation = {
  __typename?: 'PromptConversation';
  /** The completed conversation. */
  conversation?: Maybe<EntityReference>;
  /** The RAG pipeline details for debugging purposes. */
  details?: Maybe<ConversationDetails>;
  /** The content facets referenced by the completed conversation message. */
  facets?: Maybe<Array<Maybe<ContentFacet>>>;
  /** The knowledge graph generated from the retrieved contents. */
  graph?: Maybe<Graph>;
  /** The completed conversation message. */
  message?: Maybe<ConversationMessage>;
  /** The conversation message count, after completion. */
  messageCount?: Maybe<Scalars['Int']['output']>;
};

/** Represents a prompt strategy. */
export type PromptStrategy = {
  __typename?: 'PromptStrategy';
  /** The prompt strategy type. */
  type: PromptStrategyTypes;
};

/** Represents a prompt strategy. */
export type PromptStrategyInput = {
  /** The prompt strategy type. */
  type?: InputMaybe<PromptStrategyTypes>;
};

/** Prompt strategies */
export enum PromptStrategyTypes {
  /** Use original prompt */
  None = 'NONE',
  /** Convert prompt to keywords to optimize semantic search */
  OptimizeSearch = 'OPTIMIZE_SEARCH',
  /** Rewrite prompt */
  Rewrite = 'REWRITE'
}

/** Represents a prompt strategy. */
export type PromptStrategyUpdateInput = {
  /** The prompt strategy type. */
  type?: InputMaybe<PromptStrategyTypes>;
};

/** Represents suggested LLM prompts. */
export type PromptSuggestion = {
  __typename?: 'PromptSuggestion';
  /** The suggested prompts. */
  prompts?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

/** Represents an LLM summarization. */
export type PromptSummarization = {
  __typename?: 'PromptSummarization';
  /** The summarized content. Not assigned when summarizing text */
  content?: Maybe<EntityReference>;
  /** If summarization failed, the error message. */
  error?: Maybe<Scalars['String']['output']>;
  /** The summarized items. */
  items?: Maybe<Array<Summarized>>;
  /** The LLM specification, optional. */
  specification?: Maybe<EntityReference>;
  /** The summarization type. */
  type: SummarizationTypes;
};

/** Represents a publish contents result. */
export type PublishContents = {
  __typename?: 'PublishContents';
  /**
   * The published content.
   * @deprecated Use Contents field instead.
   */
  content?: Maybe<Content>;
  /** The published contents. */
  contents?: Maybe<Array<Maybe<Content>>>;
  /** The publishing details for debugging purposes. */
  details?: Maybe<PublishingDetails>;
};

/** Represents the publishing details. */
export type PublishingDetails = {
  __typename?: 'PublishingDetails';
  /** The retrieved contents. */
  contents?: Maybe<Array<EntityReference>>;
  /** JSON representation of the LLM publish specification. */
  publishSpecification?: Maybe<Scalars['String']['output']>;
  /** The time to publish the summaries. */
  publishTime?: Maybe<Scalars['TimeSpan']['output']>;
  /** The list of content summaries. */
  summaries?: Maybe<Array<Scalars['String']['output']>>;
  /** JSON representation of the LLM summary specification. */
  summarySpecification?: Maybe<Scalars['String']['output']>;
  /** The time to summarize the retrieved contents. */
  summaryTime?: Maybe<Scalars['TimeSpan']['output']>;
  /** The published text. */
  text?: Maybe<Scalars['String']['output']>;
  /** The published text type. */
  textType?: Maybe<TextTypes>;
};

export type Query = {
  __typename?: 'Query';
  /** Lookup an alert given its ID. */
  alert?: Maybe<Alert>;
  /** Retrieves alerts based on the provided filter criteria. */
  alerts?: Maybe<AlertResults>;
  /** Retrieves categories based on the provided filter criteria. */
  categories?: Maybe<CategoryResults>;
  /** Lookup a category given its ID. */
  category?: Maybe<Category>;
  /** Lookup a collection given its ID. */
  collection?: Maybe<Collection>;
  /** Retrieves collections based on the provided filter criteria. */
  collections?: Maybe<CollectionResults>;
  /** Lookup a connector given its ID. */
  connector?: Maybe<Connector>;
  /** Retrieves connectors based on the provided filter criteria. */
  connectors?: Maybe<ConnectorResults>;
  /** Lookup content given its ID. */
  content?: Maybe<Content>;
  /** Retrieves contents based on the provided filter criteria. */
  contents?: Maybe<ContentResults>;
  /** Lookup a conversation given its ID. */
  conversation?: Maybe<Conversation>;
  /** Retrieves conversations based on the provided filter criteria. */
  conversations?: Maybe<ConversationResults>;
  /** Counts alerts based on the provided filter criteria. */
  countAlerts?: Maybe<CountResult>;
  /** Counts categories based on the provided filter criteria. */
  countCategories?: Maybe<CountResult>;
  /** Counts collections based on the provided filter criteria. */
  countCollections?: Maybe<CountResult>;
  /** Counts contents based on the provided filter criteria. */
  countContents?: Maybe<CountResult>;
  /** Counts conversations based on the provided filter criteria. */
  countConversations?: Maybe<CountResult>;
  /** Counts events based on the provided filter criteria. */
  countEvents?: Maybe<CountResult>;
  /** Counts feeds based on the provided filter criteria. */
  countFeeds?: Maybe<CountResult>;
  /** Counts labels based on the provided filter criteria. */
  countLabels?: Maybe<CountResult>;
  /** Counts medical conditions based on the provided filter criteria. */
  countMedicalConditions?: Maybe<CountResult>;
  /** Counts medical contraindications based on the provided filter criteria. */
  countMedicalContraindications?: Maybe<CountResult>;
  /** Counts medical devices based on the provided filter criteria. */
  countMedicalDevices?: Maybe<CountResult>;
  /** Counts medical drug classes based on the provided filter criteria. */
  countMedicalDrugClasses?: Maybe<CountResult>;
  /** Counts medical drugs based on the provided filter criteria. */
  countMedicalDrugs?: Maybe<CountResult>;
  /** Counts medical guidelines based on the provided filter criteria. */
  countMedicalGuidelines?: Maybe<CountResult>;
  /** Counts medical Indications based on the provided filter criteria. */
  countMedicalIndications?: Maybe<CountResult>;
  /** Counts medical procedures based on the provided filter criteria. */
  countMedicalProcedures?: Maybe<CountResult>;
  /** Counts medical studies based on the provided filter criteria. */
  countMedicalStudies?: Maybe<CountResult>;
  /** Counts medical tests based on the provided filter criteria. */
  countMedicalTests?: Maybe<CountResult>;
  /** Counts medical therapies based on the provided filter criteria. */
  countMedicalTherapies?: Maybe<CountResult>;
  /** Counts organizations based on the provided filter criteria. */
  countOrganizations?: Maybe<CountResult>;
  /** Counts persons based on the provided filter criteria. */
  countPersons?: Maybe<CountResult>;
  /** Counts places based on the provided filter criteria. */
  countPlaces?: Maybe<CountResult>;
  /** Counts products based on the provided filter criteria. */
  countProducts?: Maybe<CountResult>;
  /** Counts repos based on the provided filter criteria. */
  countRepos?: Maybe<CountResult>;
  /** Counts software based on the provided filter criteria. */
  countSoftwares?: Maybe<CountResult>;
  /** Counts specifications based on the provided filter criteria. */
  countSpecifications?: Maybe<CountResult>;
  /** Counts users based on the provided filter criteria. */
  countUsers?: Maybe<CountResult>;
  /** Counts workflows based on the provided filter criteria. */
  countWorkflows?: Maybe<CountResult>;
  /** Retrieves project credits. */
  credits?: Maybe<ProjectCredits>;
  /** Lookup an event given its ID. */
  event?: Maybe<Event>;
  /** Retrieves events based on the provided filter criteria. */
  events?: Maybe<EventResults>;
  /** Lookup a feed given its ID. */
  feed?: Maybe<Feed>;
  /** Returns whether any feed exists based on the provided filter criteria. */
  feedExists?: Maybe<BooleanResult>;
  /** Retrieves feeds based on the provided filter criteria. */
  feeds?: Maybe<FeedResults>;
  /** Returns if ingested content has finished (or errored). */
  isContentDone?: Maybe<BooleanResult>;
  /** Returns if all the contents ingested from a feed have finished (or errored). */
  isFeedDone?: Maybe<BooleanResult>;
  /** Lookup a label given its ID. */
  label?: Maybe<Label>;
  /** Retrieves labels based on the provided filter criteria. */
  labels?: Maybe<LabelResults>;
  /** Retrieves available Linear projects. */
  linearProjects?: Maybe<StringResults>;
  /** Lookup multiple contents given their IDs. */
  lookupContents?: Maybe<LookupContentsResults>;
  /** Lookup credit usage given tenant correlation identifier. */
  lookupCredits?: Maybe<ProjectCredits>;
  /** Lookup usage records given tenant correlation identifier. */
  lookupUsage?: Maybe<Array<Maybe<ProjectUsageRecord>>>;
  /** Enumerates the web pages at or beneath the provided URL using web sitemap. */
  mapWeb?: Maybe<UriResults>;
  /** Lookup a medical condition given its ID. */
  medicalCondition?: Maybe<MedicalCondition>;
  /** Retrieves medical conditions based on the provided filter criteria. */
  medicalConditions?: Maybe<MedicalConditionResults>;
  /** Lookup a medical contraindication given its ID. */
  medicalContraindication?: Maybe<MedicalContraindication>;
  /** Retrieves medical contraindications based on the provided filter criteria. */
  medicalContraindications?: Maybe<MedicalContraindicationResults>;
  /** Lookup a medical device given its ID. */
  medicalDevice?: Maybe<MedicalDevice>;
  /** Retrieves medical devices based on the provided filter criteria. */
  medicalDevices?: Maybe<MedicalDeviceResults>;
  /** Lookup a medical drug given its ID. */
  medicalDrug?: Maybe<MedicalDrug>;
  /** Lookup a medical drug class given its ID. */
  medicalDrugClass?: Maybe<MedicalDrugClass>;
  /** Retrieves medical drug classes based on the provided filter criteria. */
  medicalDrugClasses?: Maybe<MedicalDrugClassResults>;
  /** Retrieves medical drugs based on the provided filter criteria. */
  medicalDrugs?: Maybe<MedicalDrugResults>;
  /** Lookup a medical guideline given its ID. */
  medicalGuideline?: Maybe<MedicalGuideline>;
  /** Retrieves medical guidelines based on the provided filter criteria. */
  medicalGuidelines?: Maybe<MedicalGuidelineResults>;
  /** Lookup a medical Indication given its ID. */
  medicalIndication?: Maybe<MedicalIndication>;
  /** Retrieves medical Indications based on the provided filter criteria. */
  medicalIndications?: Maybe<MedicalIndicationResults>;
  /** Lookup a medical procedure given its ID. */
  medicalProcedure?: Maybe<MedicalProcedure>;
  /** Retrieves medical procedures based on the provided filter criteria. */
  medicalProcedures?: Maybe<MedicalProcedureResults>;
  /** Retrieves medical studies based on the provided filter criteria. */
  medicalStudies?: Maybe<MedicalStudyResults>;
  /** Lookup a medical study given its ID. */
  medicalStudy?: Maybe<MedicalStudy>;
  /** Lookup a medical test given its ID. */
  medicalTest?: Maybe<MedicalTest>;
  /** Retrieves medical tests based on the provided filter criteria. */
  medicalTests?: Maybe<MedicalTestResults>;
  /** Retrieves medical therapies based on the provided filter criteria. */
  medicalTherapies?: Maybe<MedicalTherapyResults>;
  /** Lookup a medical therapy given its ID. */
  medicalTherapy?: Maybe<MedicalTherapy>;
  /** Retrieves available Microsoft Teams team channels. */
  microsoftTeamsChannels?: Maybe<MicrosoftTeamsChannelResults>;
  /** Retrieves available Microsoft Teams teams. */
  microsoftTeamsTeams?: Maybe<MicrosoftTeamsTeamResults>;
  /** Retrieves available LLMs, embedding models and reranker models. */
  models?: Maybe<ModelCardResults>;
  /** Retrieves available Notion databases. */
  notionDatabases?: Maybe<StringResults>;
  /** Retrieves available Notion pages within Notion database, non-recursive. */
  notionPages?: Maybe<StringResults>;
  /** Lookup a observation given its ID. */
  observation?: Maybe<Observation>;
  /** Retrieves available OneDrive folders. */
  oneDriveFolders?: Maybe<OneDriveFolderResults>;
  /** Lookup an organization given its ID. */
  organization?: Maybe<Organization>;
  /** Retrieves organizations based on the provided filter criteria. */
  organizations?: Maybe<OrganizationResults>;
  /** Lookup an person given its ID. */
  person?: Maybe<Person>;
  /** Retrieves persons based on the provided filter criteria. */
  persons?: Maybe<PersonResults>;
  /** Lookup an place given its ID. */
  place?: Maybe<Place>;
  /** Retrieves places based on the provided filter criteria. */
  places?: Maybe<PlaceResults>;
  /** Lookup an product given its ID. */
  product?: Maybe<Product>;
  /** Retrieves products based on the provided filter criteria. */
  products?: Maybe<ProductResults>;
  /** Fetch current project. */
  project?: Maybe<Project>;
  /** Retrieves projects based on the provided filter criteria. */
  projects?: Maybe<ProjectResults>;
  /** Lookup a code repository given its ID. */
  repo?: Maybe<Repo>;
  /** Retrieves code repositories based on the provided filter criteria. */
  repos?: Maybe<RepoResults>;
  /** Searches the web based on the provided properties. */
  searchWeb?: Maybe<WebSearchResults>;
  /** Retrieves Microsoft SharePoint consent URI. Visit URI to provide administrator consent for feeds which use the Microsoft Graph API. */
  sharePointConsentUri?: Maybe<UriResult>;
  /** Retrieves available SharePoint document library folders. */
  sharePointFolders?: Maybe<SharePointFolderResults>;
  /** Retrieves available SharePoint document libraries. */
  sharePointLibraries?: Maybe<SharePointLibraryResults>;
  /** Retrieves available Slack channels. */
  slackChannels?: Maybe<StringResults>;
  /** Lookup software given its ID. */
  software?: Maybe<Software>;
  /** Retrieves software based on the provided filter criteria. */
  softwares?: Maybe<SoftwareResults>;
  /** Lookup a specification given its ID. */
  specification?: Maybe<Specification>;
  /** Returns whether any specification exists based on the provided filter criteria. */
  specificationExists?: Maybe<BooleanResult>;
  /** Retrieves specifications based on the provided filter criteria. */
  specifications?: Maybe<SpecificationResults>;
  /** Retrieves project tokens. */
  tokens?: Maybe<ProjectTokens>;
  /** Retrieves project usage. */
  usage?: Maybe<Array<Maybe<ProjectUsageRecord>>>;
  /** Fetch current user. */
  user?: Maybe<User>;
  /** Lookup a user given its external identifier. */
  userByIdentifier?: Maybe<User>;
  /** Retrieves users based on the provided filter criteria. */
  users?: Maybe<UserResults>;
  /** Lookup a workflow given its ID. */
  workflow?: Maybe<Workflow>;
  /** Returns whether any workflow exists based on the provided filter criteria. */
  workflowExists?: Maybe<BooleanResult>;
  /** Retrieves workflows based on the provided filter criteria. */
  workflows?: Maybe<WorkflowResults>;
};


export type QueryAlertArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type QueryAlertsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<AlertFilter>;
};


export type QueryCategoriesArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  facets?: InputMaybe<Array<InputMaybe<CategoryFacetInput>>>;
  filter?: InputMaybe<CategoryFilter>;
};


export type QueryCategoryArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type QueryCollectionArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type QueryCollectionsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<CollectionFilter>;
};


export type QueryConnectorArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type QueryConnectorsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<ConnectorFilter>;
};


export type QueryContentArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type QueryContentsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  facets?: InputMaybe<Array<ContentFacetInput>>;
  filter?: InputMaybe<ContentFilter>;
  graph?: InputMaybe<ContentGraphInput>;
};


export type QueryConversationArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type QueryConversationsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<ConversationFilter>;
};


export type QueryCountAlertsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<AlertFilter>;
};


export type QueryCountCategoriesArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<CategoryFilter>;
};


export type QueryCountCollectionsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<CollectionFilter>;
};


export type QueryCountContentsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<ContentFilter>;
};


export type QueryCountConversationsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<ConversationFilter>;
};


export type QueryCountEventsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<EventFilter>;
};


export type QueryCountFeedsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<FeedFilter>;
};


export type QueryCountLabelsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<LabelFilter>;
};


export type QueryCountMedicalConditionsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<MedicalConditionFilter>;
};


export type QueryCountMedicalContraindicationsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<MedicalContraindicationFilter>;
};


export type QueryCountMedicalDevicesArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<MedicalDeviceFilter>;
};


export type QueryCountMedicalDrugClassesArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<MedicalDrugClassFilter>;
};


export type QueryCountMedicalDrugsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<MedicalDrugFilter>;
};


export type QueryCountMedicalGuidelinesArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<MedicalGuidelineFilter>;
};


export type QueryCountMedicalIndicationsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<MedicalIndicationFilter>;
};


export type QueryCountMedicalProceduresArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<MedicalProcedureFilter>;
};


export type QueryCountMedicalStudiesArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<MedicalStudyFilter>;
};


export type QueryCountMedicalTestsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<MedicalTestFilter>;
};


export type QueryCountMedicalTherapiesArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<MedicalTherapyFilter>;
};


export type QueryCountOrganizationsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<OrganizationFilter>;
};


export type QueryCountPersonsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<PersonFilter>;
};


export type QueryCountPlacesArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<PlaceFilter>;
};


export type QueryCountProductsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<ProductFilter>;
};


export type QueryCountReposArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<RepoFilter>;
};


export type QueryCountSoftwaresArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<SoftwareFilter>;
};


export type QueryCountSpecificationsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<SpecificationFilter>;
};


export type QueryCountUsersArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<UserFilter>;
};


export type QueryCountWorkflowsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<WorkflowFilter>;
};


export type QueryCreditsArgs = {
  duration: Scalars['TimeSpan']['input'];
  startDate: Scalars['DateTime']['input'];
};


export type QueryEventArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type QueryEventsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  facets?: InputMaybe<Array<EventFacetInput>>;
  filter?: InputMaybe<EventFilter>;
};


export type QueryFeedArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type QueryFeedExistsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<FeedFilter>;
};


export type QueryFeedsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<FeedFilter>;
};


export type QueryIsContentDoneArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type QueryIsFeedDoneArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type QueryLabelArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type QueryLabelsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  facets?: InputMaybe<Array<LabelFacetInput>>;
  filter?: InputMaybe<LabelFilter>;
};


export type QueryLinearProjectsArgs = {
  properties: LinearProjectsInput;
};


export type QueryLookupContentsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  ids: Array<Scalars['ID']['input']>;
};


export type QueryLookupCreditsArgs = {
  correlationId: Scalars['String']['input'];
};


export type QueryLookupUsageArgs = {
  correlationId: Scalars['String']['input'];
};


export type QueryMapWebArgs = {
  allowedPaths?: InputMaybe<Array<Scalars['String']['input']>>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
  excludedPaths?: InputMaybe<Array<Scalars['String']['input']>>;
  uri: Scalars['URL']['input'];
};


export type QueryMedicalConditionArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type QueryMedicalConditionsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  facets?: InputMaybe<Array<MedicalConditionFacetInput>>;
  filter?: InputMaybe<MedicalConditionFilter>;
};


export type QueryMedicalContraindicationArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type QueryMedicalContraindicationsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  facets?: InputMaybe<Array<MedicalContraindicationFacetInput>>;
  filter?: InputMaybe<MedicalContraindicationFilter>;
};


export type QueryMedicalDeviceArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type QueryMedicalDevicesArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  facets?: InputMaybe<Array<MedicalDeviceFacetInput>>;
  filter?: InputMaybe<MedicalDeviceFilter>;
};


export type QueryMedicalDrugArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type QueryMedicalDrugClassArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type QueryMedicalDrugClassesArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  facets?: InputMaybe<Array<MedicalDrugClassFacetInput>>;
  filter?: InputMaybe<MedicalDrugClassFilter>;
};


export type QueryMedicalDrugsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  facets?: InputMaybe<Array<MedicalDrugFacetInput>>;
  filter?: InputMaybe<MedicalDrugFilter>;
};


export type QueryMedicalGuidelineArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type QueryMedicalGuidelinesArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  facets?: InputMaybe<Array<MedicalGuidelineFacetInput>>;
  filter?: InputMaybe<MedicalGuidelineFilter>;
};


export type QueryMedicalIndicationArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type QueryMedicalIndicationsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  facets?: InputMaybe<Array<MedicalIndicationFacetInput>>;
  filter?: InputMaybe<MedicalIndicationFilter>;
};


export type QueryMedicalProcedureArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type QueryMedicalProceduresArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  facets?: InputMaybe<Array<MedicalProcedureFacetInput>>;
  filter?: InputMaybe<MedicalProcedureFilter>;
};


export type QueryMedicalStudiesArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  facets?: InputMaybe<Array<MedicalStudyFacetInput>>;
  filter?: InputMaybe<MedicalStudyFilter>;
};


export type QueryMedicalStudyArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type QueryMedicalTestArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type QueryMedicalTestsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  facets?: InputMaybe<Array<MedicalTestFacetInput>>;
  filter?: InputMaybe<MedicalTestFilter>;
};


export type QueryMedicalTherapiesArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  facets?: InputMaybe<Array<MedicalTherapyFacetInput>>;
  filter?: InputMaybe<MedicalTherapyFilter>;
};


export type QueryMedicalTherapyArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type QueryMicrosoftTeamsChannelsArgs = {
  properties: MicrosoftTeamsChannelsInput;
  teamId: Scalars['ID']['input'];
};


export type QueryMicrosoftTeamsTeamsArgs = {
  properties: MicrosoftTeamsTeamsInput;
};


export type QueryModelsArgs = {
  filter?: InputMaybe<ModelFilter>;
};


export type QueryNotionDatabasesArgs = {
  properties: NotionDatabasesInput;
};


export type QueryNotionPagesArgs = {
  identifier: Scalars['String']['input'];
  properties: NotionPagesInput;
};


export type QueryObservationArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type QueryOneDriveFoldersArgs = {
  folderId?: InputMaybe<Scalars['ID']['input']>;
  properties: OneDriveFoldersInput;
};


export type QueryOrganizationArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type QueryOrganizationsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  facets?: InputMaybe<Array<OrganizationFacetInput>>;
  filter?: InputMaybe<OrganizationFilter>;
};


export type QueryPersonArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type QueryPersonsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  facets?: InputMaybe<Array<PersonFacetInput>>;
  filter?: InputMaybe<PersonFilter>;
};


export type QueryPlaceArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type QueryPlacesArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  facets?: InputMaybe<Array<PlaceFacetInput>>;
  filter?: InputMaybe<PlaceFilter>;
};


export type QueryProductArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type QueryProductsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  facets?: InputMaybe<Array<ProductFacetInput>>;
  filter?: InputMaybe<ProductFilter>;
};


export type QueryProjectArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryProjectsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<ProjectFilter>;
};


export type QueryRepoArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type QueryReposArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  facets?: InputMaybe<Array<RepoFacetInput>>;
  filter?: InputMaybe<RepoFilter>;
};


export type QuerySearchWebArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  service?: InputMaybe<SearchServiceTypes>;
  text: Scalars['String']['input'];
};


export type QuerySharePointConsentUriArgs = {
  tenantId: Scalars['ID']['input'];
};


export type QuerySharePointFoldersArgs = {
  folderId?: InputMaybe<Scalars['ID']['input']>;
  libraryId: Scalars['ID']['input'];
  properties: SharePointFoldersInput;
};


export type QuerySharePointLibrariesArgs = {
  properties: SharePointLibrariesInput;
};


export type QuerySlackChannelsArgs = {
  properties: SlackChannelsInput;
};


export type QuerySoftwareArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type QuerySoftwaresArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  facets?: InputMaybe<Array<SoftwareFacetInput>>;
  filter?: InputMaybe<SoftwareFilter>;
};


export type QuerySpecificationArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type QuerySpecificationExistsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<SpecificationFilter>;
};


export type QuerySpecificationsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<SpecificationFilter>;
};


export type QueryTokensArgs = {
  duration: Scalars['TimeSpan']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  startDate: Scalars['DateTime']['input'];
};


export type QueryUsageArgs = {
  duration: Scalars['TimeSpan']['input'];
  excludedNames?: InputMaybe<Array<Scalars['String']['input']>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  names?: InputMaybe<Array<Scalars['String']['input']>>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  startDate: Scalars['DateTime']['input'];
};


export type QueryUserArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUserByIdentifierArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  identifier: Scalars['String']['input'];
};


export type QueryUsersArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<UserFilter>;
};


export type QueryWorkflowArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type QueryWorkflowExistsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<WorkflowFilter>;
};


export type QueryWorkflowsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<WorkflowFilter>;
};

/** Represents RSS feed properties. */
export type RssFeedProperties = {
  __typename?: 'RSSFeedProperties';
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: Maybe<Scalars['Int']['output']>;
  /** The RSS URI. */
  uri: Scalars['URL']['output'];
};

/** Represents RSS feed properties. */
export type RssFeedPropertiesInput = {
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The RSS URI. */
  uri: Scalars['URL']['input'];
};

/** Represents RSS feed properties. */
export type RssFeedPropertiesUpdateInput = {
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: InputMaybe<Scalars['Int']['input']>;
};

/** Represents Reddit feed properties. */
export type RedditFeedProperties = {
  __typename?: 'RedditFeedProperties';
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: Maybe<Scalars['Int']['output']>;
  /** The subreddit name. */
  subredditName: Scalars['String']['output'];
};

/** Represents Reddit feed properties. */
export type RedditFeedPropertiesInput = {
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The subreddit name. */
  subredditName: Scalars['String']['input'];
};

/** Represents Reddit feed properties. */
export type RedditFeedPropertiesUpdateInput = {
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: InputMaybe<Scalars['Int']['input']>;
};

/** Represents the regex prompt content classification rule. */
export type RegexClassificationRule = {
  __typename?: 'RegexClassificationRule';
  /** The regex pattern for content classification. Treat as 'If property at path matches ...'. */
  matches?: Maybe<Scalars['String']['output']>;
  /** The JSONPath of the JSON property to match with regex pattern. Used only with metadata sources. Treat as 'If property at ... matches regex pattern'. */
  path?: Maybe<Scalars['String']['output']>;
  /** The label name to be assigned upon content classification. Treat as 'Then label as ...'. */
  then?: Maybe<Scalars['String']['output']>;
  /** The content classification source type. */
  type?: Maybe<RegexSourceTypes>;
};

/** Represents the regex prompt content classification rule. */
export type RegexClassificationRuleInput = {
  /** The regex pattern for content classification. Treat as 'If property at path matches ...'. */
  matches?: InputMaybe<Scalars['String']['input']>;
  /** The JSONPath of the JSON property to match with regex pattern. Used only with metadata sources. Treat as 'If property at ... matches regex pattern'. */
  path?: InputMaybe<Scalars['String']['input']>;
  /** The label name to be assigned upon content classification. Treat as 'Then label as ...'. */
  then?: InputMaybe<Scalars['String']['input']>;
  /** The content classification source type. */
  type?: InputMaybe<RegexSourceTypes>;
};

/** Represents the regex content classification properties. */
export type RegexContentClassificationProperties = {
  __typename?: 'RegexContentClassificationProperties';
  /** The regex content classification rules. */
  rules?: Maybe<Array<Maybe<RegexClassificationRule>>>;
};

/** Represents the regex content classification properties. */
export type RegexContentClassificationPropertiesInput = {
  /** The regex content classification rules. */
  rules?: InputMaybe<Array<InputMaybe<RegexClassificationRuleInput>>>;
};

/** Regex classification source type */
export enum RegexSourceTypes {
  /** Content markdown text */
  Markdown = 'MARKDOWN',
  /** Content metadata */
  Metadata = 'METADATA'
}

/** Represents a rendition. */
export type Rendition = {
  __typename?: 'Rendition';
  /** The rendition C4ID hash. */
  c4id?: Maybe<Scalars['String']['output']>;
  /** The parent content. */
  content?: Maybe<Content>;
  /** The content type. */
  contentType?: Maybe<ContentTypes>;
  /** The creation date of the rendition. */
  creationDate: Scalars['DateTime']['output'];
  /** The rendition ETag. */
  etag?: Maybe<Scalars['String']['output']>;
  /** The rendition file creation date. */
  fileCreationDate?: Maybe<Scalars['DateTime']['output']>;
  /** The rendition file extension. */
  fileExtension?: Maybe<Scalars['String']['output']>;
  /** The rendition file modified date. */
  fileModifiedDate?: Maybe<Scalars['DateTime']['output']>;
  /** The rendition file name. */
  fileName?: Maybe<Scalars['String']['output']>;
  /** The rendition file size. */
  fileSize?: Maybe<Scalars['Long']['output']>;
  /** The rendition file type. */
  fileType?: Maybe<FileTypes>;
  /** The rendition file format. */
  format?: Maybe<Scalars['String']['output']>;
  /** The rendition file format name. */
  formatName?: Maybe<Scalars['String']['output']>;
  /** The ID of the rendition. */
  id: Scalars['ID']['output'];
  /** The rendition MIME type. */
  mimeType?: Maybe<Scalars['String']['output']>;
  /** The modified date of the rendition. */
  modifiedDate?: Maybe<Scalars['DateTime']['output']>;
  /** The name of the rendition. */
  name: Scalars['String']['output'];
  /** The owner of the rendition. */
  owner: Owner;
  /** The rendition relative path. */
  relativePath?: Maybe<Scalars['String']['output']>;
  /** The relevance score of the rendition. */
  relevance?: Maybe<Scalars['Float']['output']>;
  /** The state of the rendition (i.e. created, finished). */
  state: EntityState;
  /** The rendition type. */
  type?: Maybe<RenditionTypes>;
  /** The rendition URI. */
  uri?: Maybe<Scalars['URL']['output']>;
};

/** Rendition type */
export enum RenditionTypes {
  /** Content rendition */
  Content = 'CONTENT'
}

/** Represents Replicate model properties. */
export type ReplicateModelProperties = {
  __typename?: 'ReplicateModelProperties';
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: Maybe<Scalars['Int']['output']>;
  /** The Replicate API key, if using developer's own account. */
  key?: Maybe<Scalars['String']['output']>;
  /** The Replicate model, or custom, when using developer's own account. */
  model: ReplicateModels;
  /** The Replicate model name, if using developer's own account. */
  modelName?: Maybe<Scalars['String']['output']>;
  /** The model token probability. */
  probability?: Maybe<Scalars['Float']['output']>;
  /** The model temperature. */
  temperature?: Maybe<Scalars['Float']['output']>;
  /** The number of tokens which can provided to the Replicate model, if using developer's own account. */
  tokenLimit?: Maybe<Scalars['Int']['output']>;
};

/** Represents Replicate model properties. */
export type ReplicateModelPropertiesInput = {
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The Replicate API key, if using developer's own account. */
  key?: InputMaybe<Scalars['String']['input']>;
  /** The Replicate model, or custom, when using developer's own account. */
  model: ReplicateModels;
  /** The Replicate model name, if using developer's own account. */
  modelName?: InputMaybe<Scalars['String']['input']>;
  /** The model token probability. */
  probability?: InputMaybe<Scalars['Float']['input']>;
  /** The model temperature. */
  temperature?: InputMaybe<Scalars['Float']['input']>;
  /** The number of tokens which can provided to the Replicate model, if using developer's own account. */
  tokenLimit?: InputMaybe<Scalars['Int']['input']>;
};

/** Represents Replicate model properties. */
export type ReplicateModelPropertiesUpdateInput = {
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The Replicate API key, if using developer's own account. */
  key?: InputMaybe<Scalars['String']['input']>;
  /** The Replicate model, or custom, when using developer's own account. */
  model?: InputMaybe<ReplicateModels>;
  /** The Replicate model name, if using developer's own account. */
  modelName?: InputMaybe<Scalars['String']['input']>;
  /** The model token probability. */
  probability?: InputMaybe<Scalars['Float']['input']>;
  /** The model temperature. */
  temperature?: InputMaybe<Scalars['Float']['input']>;
  /** The number of tokens which can provided to the Replicate model, if using developer's own account. */
  tokenLimit?: InputMaybe<Scalars['Int']['input']>;
};

/** Replicate model type */
export enum ReplicateModels {
  /** Developer-specified model */
  Custom = 'CUSTOM',
  /** Llama 2 7b */
  Llama_2_7B = 'LLAMA_2_7B',
  /** Llama 2 7b Chat */
  Llama_2_7BChat = 'LLAMA_2_7B_CHAT',
  /** Llama 2 13b */
  Llama_2_13B = 'LLAMA_2_13B',
  /** Llama 2 13b Chat */
  Llama_2_13BChat = 'LLAMA_2_13B_CHAT',
  /** Llama 2 70b */
  Llama_2_70B = 'LLAMA_2_70B',
  /** Llama 2 70b Chat */
  Llama_2_70BChat = 'LLAMA_2_70B_CHAT',
  /** Mistral 7b */
  Mistral_7B = 'MISTRAL_7B',
  /** Mistral 7b Instruct */
  Mistral_7BInstruct = 'MISTRAL_7B_INSTRUCT'
}

/** Represents a code repository. */
export type Repo = {
  __typename?: 'Repo';
  /** The alternate names of the repo. */
  alternateNames?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The creation date of the repo. */
  creationDate: Scalars['DateTime']['output'];
  /** The repo description. */
  description?: Maybe<Scalars['String']['output']>;
  /** The ID of the repo. */
  id: Scalars['ID']['output'];
  /** The repo external identifier. */
  identifier?: Maybe<Scalars['String']['output']>;
  /** The modified date of the repo. */
  modifiedDate?: Maybe<Scalars['DateTime']['output']>;
  /** The name of the repo. */
  name: Scalars['String']['output'];
  /** The relevance score of the repo. */
  relevance?: Maybe<Scalars['Float']['output']>;
  /** The state of the repo (i.e. created, enabled). */
  state: EntityState;
  /** The JSON-LD value of the repo. */
  thing?: Maybe<Scalars['String']['output']>;
  /** The repo URI. */
  uri?: Maybe<Scalars['URL']['output']>;
};

/** Represents a repo facet. */
export type RepoFacet = {
  __typename?: 'RepoFacet';
  /** The facet count. */
  count?: Maybe<Scalars['Long']['output']>;
  /** The repo facet type. */
  facet?: Maybe<RepoFacetTypes>;
  /** The facet value range. */
  range?: Maybe<StringRange>;
  /** The facet value type. */
  type?: Maybe<FacetValueTypes>;
  /** The facet value. */
  value?: Maybe<Scalars['String']['output']>;
};

/** Represents the configuration for repo facets. */
export type RepoFacetInput = {
  /** The repo facet type. */
  facet?: InputMaybe<RepoFacetTypes>;
  /** The facet time interval. */
  timeInterval?: InputMaybe<TimeIntervalTypes>;
  /** The facet time offset (in hours). */
  timeOffset?: InputMaybe<Scalars['Int']['input']>;
};

/** Repo facet types */
export enum RepoFacetTypes {
  /** Creation Date */
  CreationDate = 'CREATION_DATE'
}

/** Represents a filter for code repositories. */
export type RepoFilter = {
  /** Filter by observable physical address. */
  address?: InputMaybe<AddressFilter>;
  /** Filter by observable geo-boundaries, as GeoJSON Feature with Polygon geometry. */
  boundaries?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Filter by creation date recent timespan. For example, a timespan of one day will return repo(s) created in the last 24 hours. */
  createdInLast?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** Filter repo(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter by observable H3 index. */
  h3?: InputMaybe<H3Filter>;
  /** Filter repo(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of repo(s) to be returned. Defaults to 100. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter by observable geo-location. */
  location?: InputMaybe<PointFilter>;
  /** Filter repo(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** When using similarity search, the number of similar items to be returned. Defaults to 100. */
  numberSimilar?: InputMaybe<Scalars['Int']['input']>;
  /** Skip the specified number of repo(s) from the beginning of the result set. Only supported on keyword search. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** The query syntax for the search text. Defaults to Simple. */
  queryType?: InputMaybe<SearchQueryTypes>;
  /** Filter repo(s) by searching for similar text. */
  search?: InputMaybe<Scalars['String']['input']>;
  /** The type of search to be used. Defaults to Vector. */
  searchType?: InputMaybe<SearchTypes>;
  /** Filter by similar code repositories. */
  similarRepos?: InputMaybe<Array<EntityReferenceFilter>>;
  /** Filter repo(s) by their states. */
  states?: InputMaybe<Array<EntityState>>;
};

/** Represents a code repository. */
export type RepoInput = {
  /** The repo description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The repo external identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The name of the repo. */
  name: Scalars['String']['input'];
  /** The repo URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents repo query results. */
export type RepoResults = {
  __typename?: 'RepoResults';
  /** The repo facets. */
  facets?: Maybe<Array<Maybe<RepoFacet>>>;
  /** The repo results. */
  results?: Maybe<Array<Maybe<Repo>>>;
};

/** Represents a code repository. */
export type RepoUpdateInput = {
  /** The repo description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the repo to update. */
  id: Scalars['ID']['input'];
  /** The repo external identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The name of the repo. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The repo URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Reranking model service type */
export enum RerankingModelServiceTypes {
  /** Cohere */
  Cohere = 'COHERE',
  /** Jina */
  Jina = 'JINA',
  /** Voyage */
  Voyage = 'VOYAGE'
}

/** Represents a reranking strategy. */
export type RerankingStrategy = {
  __typename?: 'RerankingStrategy';
  /** The content reranking service type. */
  serviceType: RerankingModelServiceTypes;
  /** The content reranking threshold, optional. */
  threshold?: Maybe<Scalars['Float']['output']>;
};

/** Represents a reranking strategy. */
export type RerankingStrategyInput = {
  /** The content reranking service type. */
  serviceType: RerankingModelServiceTypes;
  /** The content reranking threshold, optional. */
  threshold?: InputMaybe<Scalars['Float']['input']>;
};

/** Represents a reranking strategy. */
export type RerankingStrategyUpdateInput = {
  /** The content reranking service type. */
  serviceType?: InputMaybe<RerankingModelServiceTypes>;
  /** The content reranking threshold, optional. */
  threshold?: InputMaybe<Scalars['Float']['input']>;
};

/** Resource connector type */
export enum ResourceConnectorTypes {
  /** Amazon Web Services */
  Amazon = 'AMAZON',
  /** Microsoft Azure */
  Azure = 'AZURE',
  /** Google Cloud */
  Google = 'GOOGLE'
}

/** Represents a retrieval strategy. */
export type RetrievalStrategy = {
  __typename?: 'RetrievalStrategy';
  /** The maximum number of content sources to provide with prompt context. Defaults to 25. */
  contentLimit?: Maybe<Scalars['Int']['output']>;
  /** Whether to disable fallback to previous contents, when no contents are found by semantic search. Defaults to false. */
  disableFallback?: Maybe<Scalars['Boolean']['output']>;
  /** The retrieval strategy type. */
  type: RetrievalStrategyTypes;
};

/** Represents a retrieval strategy. */
export type RetrievalStrategyInput = {
  /** The maximum number of content sources to provide with prompt context. Defaults to 25. */
  contentLimit?: InputMaybe<Scalars['Int']['input']>;
  /** Whether to disable fallback to previous contents, when no contents are found by semantic search. Defaults to false. */
  disableFallback?: InputMaybe<Scalars['Boolean']['input']>;
  /** The retrieval strategy type. */
  type: RetrievalStrategyTypes;
};

/** Retrieval strategies */
export enum RetrievalStrategyTypes {
  /** Chunk-level retrieval */
  Chunk = 'CHUNK',
  /** Content-level retrieval */
  Content = 'CONTENT',
  /** Section-level retrieval, or page-level or segment-level retrieval, if no sections */
  Section = 'SECTION'
}

/** Represents a retrieval strategy. */
export type RetrievalStrategyUpdateInput = {
  /** The maximum number of content sources to provide with prompt context. Defaults to 25. */
  contentLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The retrieval strategy type. */
  type?: InputMaybe<RetrievalStrategyTypes>;
};

/** Represents a prompted content revision. */
export type ReviseContent = {
  __typename?: 'ReviseContent';
  /** The completed conversation. */
  conversation?: Maybe<EntityReference>;
  /** The completed conversation message. */
  message?: Maybe<ConversationMessage>;
  /** The conversation message count, after completion. */
  messageCount?: Maybe<Scalars['Int']['output']>;
};

/** Represents a revision strategy. */
export type RevisionStrategy = {
  __typename?: 'RevisionStrategy';
  /** The number of times LLM should revise the completion, defaults to 1. */
  count?: Maybe<Scalars['Int']['output']>;
  /** The custom revision prompt, if using custom strategy type. */
  customRevision?: Maybe<Scalars['String']['output']>;
  /** The revision strategy type. */
  type: RevisionStrategyTypes;
};

/** Represents a revision strategy. */
export type RevisionStrategyInput = {
  /** The number of times LLM should revise the completion, defaults to 1. */
  count?: InputMaybe<Scalars['Int']['input']>;
  /** The custom revision prompt, if using custom strategy type. */
  customRevision?: InputMaybe<Scalars['String']['input']>;
  /** The revision strategy type. */
  type?: InputMaybe<RevisionStrategyTypes>;
};

/** Revision strategies */
export enum RevisionStrategyTypes {
  /** Provide custom prompt for LLM to revise completion, and provide updated response */
  Custom = 'CUSTOM',
  /** Use LLM completion */
  None = 'NONE',
  /** Prompt LLM to revise completion, and provide updated response */
  Revise = 'REVISE'
}

/** Represents a revision strategy. */
export type RevisionStrategyUpdateInput = {
  /** The number of times LLM should revise the completion, defaults to 1. */
  count?: InputMaybe<Scalars['Int']['input']>;
  /** The custom revision prompt, if using custom strategy type. */
  customRevision?: InputMaybe<Scalars['String']['input']>;
  /** The revision strategy type. */
  type?: InputMaybe<RevisionStrategyTypes>;
};

/** SDK type */
export enum SdkTypes {
  /** .NET SDK */
  Dotnet = 'DOTNET',
  /** Node.JS SDK */
  NodeJs = 'NODE_JS',
  /** Python SDK */
  Python = 'PYTHON'
}

/** Represents web search feed properties. */
export type SearchFeedProperties = {
  __typename?: 'SearchFeedProperties';
  /** The limit of items to be read from feed, defaults to 10. */
  readLimit?: Maybe<Scalars['Int']['output']>;
  /** The web search text. */
  text: Scalars['String']['output'];
  /** Search service type, defaults to Tavily. */
  type?: Maybe<SearchServiceTypes>;
};

/** Represents web search feed properties. */
export type SearchFeedPropertiesInput = {
  /** The limit of items to be read from feed, defaults to 10. */
  readLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The web search text. */
  text: Scalars['String']['input'];
  /** Web search service type, defaults to Tavily. */
  type?: InputMaybe<SearchServiceTypes>;
};

/** Represents web search feed properties. */
export type SearchFeedPropertiesUpdateInput = {
  /** The limit of items to be read from feed, defaults to 10. */
  readLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The web search text. */
  text?: InputMaybe<Scalars['String']['input']>;
  /** Search service type, defaults to Tavily. */
  type?: InputMaybe<SearchServiceTypes>;
};

/** Search query type */
export enum SearchQueryTypes {
  /** Full (Lucene syntax) */
  Full = 'FULL',
  /** Simple */
  Simple = 'SIMPLE'
}

/** Search feed service type */
export enum SearchServiceTypes {
  /** Exa search feed service */
  Exa = 'EXA',
  /** Podscan search feed service */
  Podscan = 'PODSCAN',
  /** Tavily search feed service */
  Tavily = 'TAVILY'
}

/** Search type */
export enum SearchTypes {
  /** Hybrid (Vector similarity using search text) */
  Hybrid = 'HYBRID',
  /** Keyword */
  Keyword = 'KEYWORD',
  /** Vector similarity */
  Vector = 'VECTOR'
}

/** Represents shape metadata. */
export type ShapeMetadata = {
  __typename?: 'ShapeMetadata';
  /** The shape attribute count. */
  attributeCount?: Maybe<Scalars['Int']['output']>;
  /** The shape EPSG code for spatial reference. */
  epsgCode?: Maybe<Scalars['Int']['output']>;
  /** The shape feature count. */
  featureCount?: Maybe<Scalars['Int']['output']>;
  /** The shape WKT (well-known text) specification. */
  wkt?: Maybe<Scalars['String']['output']>;
};

/** Represents shape metadata. */
export type ShapeMetadataInput = {
  /** The shape attribute count. */
  attributeCount?: InputMaybe<Scalars['Int']['input']>;
  /** The metadata creation date. */
  creationDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** The shape feature count. */
  featureCount?: InputMaybe<Scalars['Int']['input']>;
  /** The metadata geo-location. */
  location?: InputMaybe<PointInput>;
  /** The metadata modified date. */
  modifiedDate?: InputMaybe<Scalars['DateTime']['input']>;
};

export enum SharePointAuthenticationTypes {
  Application = 'APPLICATION',
  User = 'USER'
}

/** Represents SharePoint properties. */
export type SharePointFeedProperties = {
  __typename?: 'SharePointFeedProperties';
  /** SharePoint account name. */
  accountName: Scalars['String']['output'];
  /** SharePoint authentication type. */
  authenticationType: SharePointAuthenticationTypes;
  /** Microsoft Entra ID client identifier, requires User authentication type. */
  clientId?: Maybe<Scalars['String']['output']>;
  /** Microsoft Entra ID client secret, requires User authentication type. */
  clientSecret?: Maybe<Scalars['String']['output']>;
  /** SharePoint folder identifier. */
  folderId?: Maybe<Scalars['ID']['output']>;
  /** SharePoint library identifier. */
  libraryId: Scalars['ID']['output'];
  /** Microsoft Entra ID refresh token, requires User authentication type. */
  refreshToken?: Maybe<Scalars['String']['output']>;
  /** Microsoft Entra ID tenant identifier, requires Application authentication type. */
  tenantId?: Maybe<Scalars['ID']['output']>;
};

/** Represents SharePoint properties. */
export type SharePointFeedPropertiesInput = {
  /** SharePoint account name. */
  accountName: Scalars['String']['input'];
  /** SharePoint authentication type. */
  authenticationType: SharePointAuthenticationTypes;
  /** Microsoft Entra ID client identifier, requires user authentication type. */
  clientId?: InputMaybe<Scalars['String']['input']>;
  /** Microsoft Entra ID client secret, requires user authentication type. */
  clientSecret?: InputMaybe<Scalars['String']['input']>;
  /** SharePoint folder identifier. */
  folderId?: InputMaybe<Scalars['ID']['input']>;
  /** SharePoint library identifier. */
  libraryId: Scalars['ID']['input'];
  /** Microsoft Entra ID refresh token, requires user authentication type. */
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  /** Microsoft Entra ID tenant identifier, requires application authentication type. */
  tenantId?: InputMaybe<Scalars['ID']['input']>;
};

/** Represents SharePoint properties. */
export type SharePointFeedPropertiesUpdateInput = {
  /** SharePoint account name. */
  accountName?: InputMaybe<Scalars['String']['input']>;
  /** SharePoint authentication type. */
  authenticationType?: InputMaybe<SharePointAuthenticationTypes>;
  /** SharePoint folder identifier. */
  folderId?: InputMaybe<Scalars['ID']['input']>;
  /** SharePoint library identifier. */
  libraryId?: InputMaybe<Scalars['ID']['input']>;
  /** Microsoft Entra ID refresh token, requires user authentication type. */
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  /** Microsoft Entra ID tenant identifier, requires application authentication type. */
  tenantId?: InputMaybe<Scalars['ID']['input']>;
};

/** Represents a SharePoint folder. */
export type SharePointFolderResult = {
  __typename?: 'SharePointFolderResult';
  /** The SharePoint folder identifier. */
  folderId?: Maybe<Scalars['ID']['output']>;
  /** The SharePoint folder name. */
  folderName?: Maybe<Scalars['String']['output']>;
};

/** Represents SharePoint folders. */
export type SharePointFolderResults = {
  __typename?: 'SharePointFolderResults';
  /** The SharePoint account name. */
  accountName?: Maybe<Scalars['String']['output']>;
  /** The SharePoint folders. */
  results?: Maybe<Array<Maybe<SharePointFolderResult>>>;
};

/** Represents SharePoint library folders properties. */
export type SharePointFoldersInput = {
  /** SharePoint authentication type. */
  authenticationType: SharePointAuthenticationTypes;
  /** Microsoft Entra ID client identifier, requires User authentication type. */
  clientId?: InputMaybe<Scalars['String']['input']>;
  /** Microsoft Entra ID client secret, requires User authentication type. */
  clientSecret?: InputMaybe<Scalars['String']['input']>;
  /** Microsoft Entra ID refresh token, requires User authentication type. */
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  /** Microsoft Entra ID tenant identifier, requires Application authentication type. */
  tenantId?: InputMaybe<Scalars['ID']['input']>;
};

/** Represents SharePoint libraries properties. */
export type SharePointLibrariesInput = {
  /** SharePoint authentication type. */
  authenticationType: SharePointAuthenticationTypes;
  /** Microsoft Entra ID client identifier, requires User authentication type. */
  clientId?: InputMaybe<Scalars['String']['input']>;
  /** Microsoft Entra ID client secret, requires User authentication type. */
  clientSecret?: InputMaybe<Scalars['String']['input']>;
  /** Microsoft Entra ID refresh token, requires User authentication type. */
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  /** Microsoft Entra ID tenant identifier, requires Application authentication type. */
  tenantId?: InputMaybe<Scalars['ID']['input']>;
};

/** Represents a SharePoint library. */
export type SharePointLibraryResult = {
  __typename?: 'SharePointLibraryResult';
  /** The SharePoint library identifier. */
  libraryId?: Maybe<Scalars['ID']['output']>;
  /** The SharePoint library name. */
  libraryName?: Maybe<Scalars['String']['output']>;
  /** The SharePoint site identifier. */
  siteId?: Maybe<Scalars['ID']['output']>;
  /** The SharePoint site name. */
  siteName?: Maybe<Scalars['String']['output']>;
};

/** Represents SharePoint libraries. */
export type SharePointLibraryResults = {
  __typename?: 'SharePointLibraryResults';
  /** The SharePoint account name. */
  accountName?: Maybe<Scalars['String']['output']>;
  /** The SharePoint libraries. */
  results?: Maybe<Array<Maybe<SharePointLibraryResult>>>;
};

/** Represents site feed properties. */
export type SiteFeedProperties = {
  __typename?: 'SiteFeedProperties';
  /** Microsoft Azure blob properties. */
  azureBlob?: Maybe<AzureBlobFeedProperties>;
  /** Microsoft Azure file share properties. */
  azureFile?: Maybe<AzureFileFeedProperties>;
  /** Box properties. */
  box?: Maybe<BoxFeedProperties>;
  /** Feed connector type. */
  connectorType: FeedConnectorTypes;
  /** Dropbox properties. */
  dropbox?: Maybe<DropboxFeedProperties>;
  /** GitHub properties. */
  github?: Maybe<GitHubFeedProperties>;
  /** Google Cloud blob properties. */
  google?: Maybe<GoogleFeedProperties>;
  /** Google Drive properties. */
  googleDrive?: Maybe<GoogleDriveFeedProperties>;
  /** Should the feed enumerate files recursively via folders. */
  isRecursive?: Maybe<Scalars['Boolean']['output']>;
  /** OneDrive properties. */
  oneDrive?: Maybe<OneDriveFeedProperties>;
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: Maybe<Scalars['Int']['output']>;
  /** AWS S3 properties. */
  s3?: Maybe<AmazonFeedProperties>;
  /** SharePoint properties. */
  sharePoint?: Maybe<SharePointFeedProperties>;
  /** The method for ingesting from cloud storage site, i.e. Watch, Sweep. */
  siteType: SiteTypes;
  /** Feed service type. */
  type: FeedServiceTypes;
};

/** Represents site feed properties. */
export type SiteFeedPropertiesInput = {
  /** Microsoft Azure blob properties. */
  azureBlob?: InputMaybe<AzureBlobFeedPropertiesInput>;
  /** Microsoft Azure file share properties. */
  azureFile?: InputMaybe<AzureFileFeedPropertiesInput>;
  /** Box properties. */
  box?: InputMaybe<BoxFeedPropertiesInput>;
  /** Dropbox properties. */
  dropbox?: InputMaybe<DropboxFeedPropertiesInput>;
  /** GitHub properties. */
  github?: InputMaybe<GitHubFeedPropertiesInput>;
  /** Google Cloud blob properties. */
  google?: InputMaybe<GoogleFeedPropertiesInput>;
  /** Google Drive properties. */
  googleDrive?: InputMaybe<GoogleDriveFeedPropertiesInput>;
  /** Should the feed enumerate files recursively via folders. */
  isRecursive?: InputMaybe<Scalars['Boolean']['input']>;
  /** OneDrive properties. */
  oneDrive?: InputMaybe<OneDriveFeedPropertiesInput>;
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: InputMaybe<Scalars['Int']['input']>;
  /** AWS S3 properties. */
  s3?: InputMaybe<AmazonFeedPropertiesInput>;
  /** SharePoint properties. */
  sharePoint?: InputMaybe<SharePointFeedPropertiesInput>;
  /** Feed service type. */
  type: FeedServiceTypes;
};

/** Represents site feed properties. */
export type SiteFeedPropertiesUpdateInput = {
  /** Microsoft Azure blob properties. */
  azureBlob?: InputMaybe<AzureBlobFeedPropertiesUpdateInput>;
  /** Microsoft Azure file share properties. */
  azureFile?: InputMaybe<AzureFileFeedPropertiesUpdateInput>;
  /** Box properties. */
  box?: InputMaybe<BoxFeedPropertiesUpdateInput>;
  /** Dropbox properties. */
  dropbox?: InputMaybe<DropboxFeedPropertiesUpdateInput>;
  /** GitHub properties. */
  github?: InputMaybe<GitHubFeedPropertiesUpdateInput>;
  /** Google Cloud blob properties. */
  google?: InputMaybe<GoogleFeedPropertiesUpdateInput>;
  /** Google Drive properties. */
  googleDrive?: InputMaybe<GoogleDriveFeedPropertiesUpdateInput>;
  /** Should the feed enumerate files recursively via folders. */
  isRecursive?: InputMaybe<Scalars['Boolean']['input']>;
  /** OneDrive properties. */
  oneDrive?: InputMaybe<OneDriveFeedPropertiesUpdateInput>;
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: InputMaybe<Scalars['Int']['input']>;
  /** AWS S3 properties. */
  s3?: InputMaybe<AmazonFeedPropertiesUpdateInput>;
  /** SharePoint properties. */
  sharePoint?: InputMaybe<SharePointFeedPropertiesUpdateInput>;
};

/** Site type */
export enum SiteTypes {
  /** Cloud storage site */
  Storage = 'STORAGE',
  /** Sweep cloud storage site */
  Sweep = 'SWEEP',
  /** Watch cloud storage site */
  Watch = 'WATCH'
}

/** Represents Slack channels properties. */
export type SlackChannelsInput = {
  /** Slack authentication token. */
  token: Scalars['String']['input'];
};

/** Represents Slack feed properties. */
export type SlackFeedProperties = {
  __typename?: 'SlackFeedProperties';
  /** The Slack channel name. */
  channel: Scalars['String']['output'];
  /** Should the Slack feed include attachments. */
  includeAttachments?: Maybe<Scalars['Boolean']['output']>;
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: Maybe<Scalars['Int']['output']>;
  /** The Slack bot token. */
  token: Scalars['String']['output'];
  /** Feed listing type, i.e. past or new messages. */
  type?: Maybe<FeedListingTypes>;
};

/** Represents Slack feed properties. */
export type SlackFeedPropertiesInput = {
  /** The Slack channel name. */
  channel: Scalars['String']['input'];
  /** Should the Slack feed include attachments. */
  includeAttachments?: InputMaybe<Scalars['Boolean']['input']>;
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The Slack bot token. */
  token: Scalars['String']['input'];
  /** Feed listing type, i.e. past or new messages. */
  type?: InputMaybe<FeedListingTypes>;
};

/** Represents Slack feed properties. */
export type SlackFeedPropertiesUpdateInput = {
  /** The Slack channel name. */
  channel?: InputMaybe<Scalars['String']['input']>;
  /** Should the Slack feed include attachments. */
  includeAttachments?: InputMaybe<Scalars['Boolean']['input']>;
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The Slack bot token. */
  token?: InputMaybe<Scalars['String']['input']>;
  /** Feed listing type, i.e. past or new messages. */
  type?: InputMaybe<FeedListingTypes>;
};

/** Represents Slack integration properties. */
export type SlackIntegrationProperties = {
  __typename?: 'SlackIntegrationProperties';
  /** Slack channel. */
  channel: Scalars['String']['output'];
  /** Slack authentication token. */
  token: Scalars['String']['output'];
};

/** Represents Slack integration properties. */
export type SlackIntegrationPropertiesInput = {
  /** Slack channel. */
  channel: Scalars['String']['input'];
  /** Slack authentication token. */
  token: Scalars['String']['input'];
};

/** Represents software. */
export type Software = {
  __typename?: 'Software';
  /** The alternate names of the software. */
  alternateNames?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The creation date of the software. */
  creationDate: Scalars['DateTime']['output'];
  /** The software description. */
  description?: Maybe<Scalars['String']['output']>;
  /** The software developer. */
  developer?: Maybe<Scalars['String']['output']>;
  /** The ID of the software. */
  id: Scalars['ID']['output'];
  /** The software external identifier. */
  identifier?: Maybe<Scalars['String']['output']>;
  /** The modified date of the software. */
  modifiedDate?: Maybe<Scalars['DateTime']['output']>;
  /** The name of the software. */
  name: Scalars['String']['output'];
  /** The software release date. */
  releaseDate?: Maybe<Scalars['DateTime']['output']>;
  /** The relevance score of the software. */
  relevance?: Maybe<Scalars['Float']['output']>;
  /** The state of the software (i.e. created, enabled). */
  state: EntityState;
  /** The JSON-LD value of the software. */
  thing?: Maybe<Scalars['String']['output']>;
  /** The software URI. */
  uri?: Maybe<Scalars['URL']['output']>;
};

/** Represents a software facet. */
export type SoftwareFacet = {
  __typename?: 'SoftwareFacet';
  /** The facet count. */
  count?: Maybe<Scalars['Long']['output']>;
  /** The software facet type. */
  facet?: Maybe<SoftwareFacetTypes>;
  /** The facet value range. */
  range?: Maybe<StringRange>;
  /** The facet value type. */
  type?: Maybe<FacetValueTypes>;
  /** The facet value. */
  value?: Maybe<Scalars['String']['output']>;
};

/** Represents the configuration for software facets. */
export type SoftwareFacetInput = {
  /** The software facet type. */
  facet?: InputMaybe<SoftwareFacetTypes>;
  /** The facet time interval. */
  timeInterval?: InputMaybe<TimeIntervalTypes>;
  /** The facet time offset (in hours). */
  timeOffset?: InputMaybe<Scalars['Int']['input']>;
};

/** Software facet types */
export enum SoftwareFacetTypes {
  /** Creation Date */
  CreationDate = 'CREATION_DATE'
}

/** Represents a filter for software. */
export type SoftwareFilter = {
  /** Filter by observable physical address. */
  address?: InputMaybe<AddressFilter>;
  /** Filter by observable geo-boundaries, as GeoJSON Feature with Polygon geometry. */
  boundaries?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Filter by creation date recent timespan. For example, a timespan of one day will return software(s) created in the last 24 hours. */
  createdInLast?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** Filter software(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter by observable H3 index. */
  h3?: InputMaybe<H3Filter>;
  /** Filter software(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of software(s) to be returned. Defaults to 100. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter by observable geo-location. */
  location?: InputMaybe<PointFilter>;
  /** Filter software(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** When using similarity search, the number of similar items to be returned. Defaults to 100. */
  numberSimilar?: InputMaybe<Scalars['Int']['input']>;
  /** Skip the specified number of software(s) from the beginning of the result set. Only supported on keyword search. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** The query syntax for the search text. Defaults to Simple. */
  queryType?: InputMaybe<SearchQueryTypes>;
  /** Filter software(s) by searching for similar text. */
  search?: InputMaybe<Scalars['String']['input']>;
  /** The type of search to be used. Defaults to Vector. */
  searchType?: InputMaybe<SearchTypes>;
  /** Filter by similar software. */
  similarSoftwares?: InputMaybe<Array<EntityReferenceFilter>>;
  /** Filter software(s) by their states. */
  states?: InputMaybe<Array<EntityState>>;
};

/** Represents software. */
export type SoftwareInput = {
  /** The software description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The software developer. */
  developer?: InputMaybe<Scalars['String']['input']>;
  /** The software external identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The name of the software. */
  name: Scalars['String']['input'];
  /** The software release date. */
  releaseDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** The software URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents software query results. */
export type SoftwareResults = {
  __typename?: 'SoftwareResults';
  /** The software facets. */
  facets?: Maybe<Array<Maybe<SoftwareFacet>>>;
  /** The software results. */
  results?: Maybe<Array<Maybe<Software>>>;
};

/** Represents software. */
export type SoftwareUpdateInput = {
  /** The software description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The software developer. */
  developer?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the software to update. */
  id: Scalars['ID']['input'];
  /** The software external identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The name of the software. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The software release date. */
  releaseDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** The software URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents an LLM specification. */
export type Specification = {
  __typename?: 'Specification';
  /** The Anthropic model properties. */
  anthropic?: Maybe<AnthropicModelProperties>;
  /** The Azure AI model properties. */
  azureAI?: Maybe<AzureAiModelProperties>;
  /** The Azure OpenAI model properties. */
  azureOpenAI?: Maybe<AzureOpenAiModelProperties>;
  /** The Amazon Bedrock model properties. */
  bedrock?: Maybe<BedrockModelProperties>;
  /** The Cerebras model properties. */
  cerebras?: Maybe<CerebrasModelProperties>;
  /** The Cohere model properties. */
  cohere?: Maybe<CohereModelProperties>;
  /** The creation date of the specification. */
  creationDate: Scalars['DateTime']['output'];
  /** Custom guidance which is injected into the LLM prompt. */
  customGuidance?: Maybe<Scalars['String']['output']>;
  /** Custom instructions which are injected into the LLM prompt. */
  customInstructions?: Maybe<Scalars['String']['output']>;
  /** The Deepseek model properties. */
  deepseek?: Maybe<DeepseekModelProperties>;
  /** The Google model properties. */
  google?: Maybe<GoogleModelProperties>;
  /** The strategy for GraphRAG retrieval. */
  graphStrategy?: Maybe<GraphStrategy>;
  /** The Groq model properties. */
  groq?: Maybe<GroqModelProperties>;
  /** The ID of the specification. */
  id: Scalars['ID']['output'];
  /** The Jina model properties. */
  jina?: Maybe<JinaModelProperties>;
  /** The Mistral model properties. */
  mistral?: Maybe<MistralModelProperties>;
  /** The modified date of the specification. */
  modifiedDate?: Maybe<Scalars['DateTime']['output']>;
  /** The name of the specification. */
  name: Scalars['String']['output'];
  /** The number of similar items to be returned from content search. Defaults to 100. */
  numberSimilar?: Maybe<Scalars['Int']['output']>;
  /** The OpenAI model properties. */
  openAI?: Maybe<OpenAiModelProperties>;
  /** The owner of the specification. */
  owner: Owner;
  /** The strategy for formatting the LLM user prompt. */
  promptStrategy?: Maybe<PromptStrategy>;
  /** The relevance score of the specification. */
  relevance?: Maybe<Scalars['Float']['output']>;
  /** The Replicate model properties. */
  replicate?: Maybe<ReplicateModelProperties>;
  /** The strategy for reranking the relevant content for the RAG conversation. */
  rerankingStrategy?: Maybe<RerankingStrategy>;
  /** The strategy for retrieving the relevant content for the RAG conversation. */
  retrievalStrategy?: Maybe<RetrievalStrategy>;
  /** The strategy for revising the LLM completion during a RAG conversation. */
  revisionStrategy?: Maybe<RevisionStrategy>;
  /** The content search type. */
  searchType?: Maybe<ConversationSearchTypes>;
  /** The LLM service type. */
  serviceType?: Maybe<ModelServiceTypes>;
  /** The state of the specification (i.e. created, finished). */
  state: EntityState;
  /** The strategy for providing the conversation message history to the LLM prompt. */
  strategy?: Maybe<ConversationStrategy>;
  /** The LLM system prompt. */
  systemPrompt?: Maybe<Scalars['String']['output']>;
  /** @deprecated The tool definitions have been removed. Tools are now provided to the promptConversation or extractContents mutations. */
  tools?: Maybe<Array<ToolDefinition>>;
  /** The specification type. */
  type?: Maybe<SpecificationTypes>;
  /** The Voyage model properties. */
  voyage?: Maybe<VoyageModelProperties>;
};

/** Represents a filter for LLM specifications. */
export type SpecificationFilter = {
  /** Filter by creation date recent timespan. For example, a timespan of one day will return specification(s) created in the last 24 hours. */
  createdInLast?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** Filter specification(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter specification(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of specification(s) to be returned. Defaults to 100. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter specification(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Skip the specified number of specification(s) from the beginning of the result set. Only supported on keyword search. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** Filter specification(s) by searching for similar text. */
  search?: InputMaybe<Scalars['String']['input']>;
  /** Filter by LLM service types. */
  serviceTypes?: InputMaybe<Array<InputMaybe<ModelServiceTypes>>>;
  /** Filter specification(s) by their states. */
  states?: InputMaybe<Array<EntityState>>;
  /** Filter by LLM specification types. */
  types?: InputMaybe<Array<InputMaybe<SpecificationTypes>>>;
};

/** Represents an LLM specification. */
export type SpecificationInput = {
  /** The Anthropic model properties. */
  anthropic?: InputMaybe<AnthropicModelPropertiesInput>;
  /** The Azure AI model properties. */
  azureAI?: InputMaybe<AzureAiModelPropertiesInput>;
  /** The Azure OpenAI model properties. */
  azureOpenAI?: InputMaybe<AzureOpenAiModelPropertiesInput>;
  /** The Amazon Bedrock model properties. */
  bedrock?: InputMaybe<BedrockModelPropertiesInput>;
  /** The Cerebras model properties. */
  cerebras?: InputMaybe<CerebrasModelPropertiesInput>;
  /** The Cohere model properties. */
  cohere?: InputMaybe<CohereModelPropertiesInput>;
  /** Custom guidance which is injected into the LLM prompt. */
  customGuidance?: InputMaybe<Scalars['String']['input']>;
  /** Custom instructions which are injected into the LLM prompt. */
  customInstructions?: InputMaybe<Scalars['String']['input']>;
  /** The Deepseek model properties. */
  deepseek?: InputMaybe<DeepseekModelPropertiesInput>;
  /** The Google model properties. */
  google?: InputMaybe<GoogleModelPropertiesInput>;
  /** The strategy for GraphRAG retrieval. */
  graphStrategy?: InputMaybe<GraphStrategyInput>;
  /** The Groq model properties. */
  groq?: InputMaybe<GroqModelPropertiesInput>;
  /** The Jina model properties. */
  jina?: InputMaybe<JinaModelPropertiesInput>;
  /** The Mistral model properties. */
  mistral?: InputMaybe<MistralModelPropertiesInput>;
  /** The name of the specification. */
  name: Scalars['String']['input'];
  /** The number of similar items to be returned from content search. Defaults to 100. */
  numberSimilar?: InputMaybe<Scalars['Int']['input']>;
  /** The OpenAI model properties. */
  openAI?: InputMaybe<OpenAiModelPropertiesInput>;
  /** The strategy for formatting the LLM user prompt. */
  promptStrategy?: InputMaybe<PromptStrategyInput>;
  /** The Replicate model properties. */
  replicate?: InputMaybe<ReplicateModelPropertiesInput>;
  /** The strategy for reranking the relevant content for the RAG conversation. */
  rerankingStrategy?: InputMaybe<RerankingStrategyInput>;
  /** The strategy for retrieving the relevant content for the RAG conversation. */
  retrievalStrategy?: InputMaybe<RetrievalStrategyInput>;
  /** The strategy for revising the LLM completion during a RAG conversation. */
  revisionStrategy?: InputMaybe<RevisionStrategyInput>;
  /** The content search type. */
  searchType?: InputMaybe<ConversationSearchTypes>;
  /** The LLM service type. */
  serviceType: ModelServiceTypes;
  /** The strategy for providing the conversation message history to the LLM prompt. */
  strategy?: InputMaybe<ConversationStrategyInput>;
  /** The LLM system prompt. */
  systemPrompt?: InputMaybe<Scalars['String']['input']>;
  /** The specification type. */
  type?: InputMaybe<SpecificationTypes>;
  /** The Voyage model properties. */
  voyage?: InputMaybe<VoyageModelPropertiesInput>;
};

/** Represents LLM specification query results. */
export type SpecificationResults = {
  __typename?: 'SpecificationResults';
  /** The list of specification query results. */
  results?: Maybe<Array<Maybe<Specification>>>;
};

/** Specification type */
export enum SpecificationTypes {
  /** Content classification */
  Classification = 'CLASSIFICATION',
  /** Prompt completion */
  Completion = 'COMPLETION',
  /** Data extraction */
  Extraction = 'EXTRACTION',
  /** Image embedding */
  ImageEmbedding = 'IMAGE_EMBEDDING',
  /** Document preparation */
  Preparation = 'PREPARATION',
  /** Text embedding */
  TextEmbedding = 'TEXT_EMBEDDING'
}

/** Represents an LLM specification. */
export type SpecificationUpdateInput = {
  /** The Anthropic model properties. */
  anthropic?: InputMaybe<AnthropicModelPropertiesUpdateInput>;
  /** The Azure AI model properties. */
  azureAI?: InputMaybe<AzureAiModelPropertiesUpdateInput>;
  /** The Azure OpenAI model properties. */
  azureOpenAI?: InputMaybe<AzureOpenAiModelPropertiesUpdateInput>;
  /** The Amazon Bedrock model properties. */
  bedrock?: InputMaybe<BedrockModelPropertiesUpdateInput>;
  /** The Cerebras model properties. */
  cerebras?: InputMaybe<CerebrasModelPropertiesUpdateInput>;
  /** The Cohere model properties. */
  cohere?: InputMaybe<CohereModelPropertiesUpdateInput>;
  /** Custom guidance which is injected into the LLM prompt. */
  customGuidance?: InputMaybe<Scalars['String']['input']>;
  /** Custom instructions which are injected into the LLM prompt. */
  customInstructions?: InputMaybe<Scalars['String']['input']>;
  /** The Deepseek model properties. */
  deepseek?: InputMaybe<DeepseekModelPropertiesUpdateInput>;
  /** The Google model properties. */
  google?: InputMaybe<GoogleModelPropertiesUpdateInput>;
  /** The strategy for GraphRAG retrieval. */
  graphStrategy?: InputMaybe<GraphStrategyUpdateInput>;
  /** The Groq model properties. */
  groq?: InputMaybe<GroqModelPropertiesUpdateInput>;
  /** The ID of the specification to update. */
  id: Scalars['ID']['input'];
  /** The Jina model properties. */
  jina?: InputMaybe<JinaModelPropertiesUpdateInput>;
  /** The Mistral model properties. */
  mistral?: InputMaybe<MistralModelPropertiesUpdateInput>;
  /** The name of the specification. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The number of similar items to be returned from content search. Defaults to 100. */
  numberSimilar?: InputMaybe<Scalars['Int']['input']>;
  /** The OpenAI model properties. */
  openAI?: InputMaybe<OpenAiModelPropertiesUpdateInput>;
  /** The strategy for formatting the LLM user prompt. */
  promptStrategy?: InputMaybe<PromptStrategyUpdateInput>;
  /** The Replicate model properties. */
  replicate?: InputMaybe<ReplicateModelPropertiesUpdateInput>;
  /** The strategy for reranking the relevant content for the RAG conversation. */
  rerankingStrategy?: InputMaybe<RerankingStrategyUpdateInput>;
  /** The strategy for retrieving the relevant content for the RAG conversation. */
  retrievalStrategy?: InputMaybe<RetrievalStrategyUpdateInput>;
  /** The strategy for revising the LLM completion during a RAG conversation. */
  revisionStrategy?: InputMaybe<RevisionStrategyUpdateInput>;
  /** The content search type. */
  searchType?: InputMaybe<ConversationSearchTypes>;
  /** The LLM service type. */
  serviceType: ModelServiceTypes;
  /** The strategy for providing the conversation message history to the LLM prompt. */
  strategy?: InputMaybe<ConversationStrategyUpdateInput>;
  /** The LLM system prompt. */
  systemPrompt?: InputMaybe<Scalars['String']['input']>;
  /** The specification type. */
  type?: InputMaybe<SpecificationTypes>;
  /** The Voyage model properties. */
  voyage?: InputMaybe<VoyageModelPropertiesUpdateInput>;
};

/** Represents the storage policy. */
export type StoragePolicy = {
  __typename?: 'StoragePolicy';
  /** Whether duplicate content (by URI, eTag, etc.) will be allowed upon ingestion, defaults to False. When disabled, content will be reingested in-place. */
  allowDuplicates?: Maybe<Scalars['Boolean']['output']>;
  /** The storage policy type. */
  type?: Maybe<StoragePolicyTypes>;
};

/** Represents the storage policy. */
export type StoragePolicyInput = {
  /** Whether duplicate content (by URI, eTag, etc.) will be allowed upon ingestion, defaults to False. When disabled, content will be reingested in-place. */
  allowDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
  /** The storage policy type. */
  type?: InputMaybe<StoragePolicyTypes>;
};

/** Storage policy types */
export enum StoragePolicyTypes {
  /** Archive content indefinitely */
  Archive = 'ARCHIVE',
  /** Minimize content storage, by removing master rendition upon workflow completion */
  Minimize = 'MINIMIZE'
}

/** Represents the storage workflow stage. */
export type StorageWorkflowStage = {
  __typename?: 'StorageWorkflowStage';
  /** The storage policy. */
  policy?: Maybe<StoragePolicy>;
};

/** Represents the storage workflow stage. */
export type StorageWorkflowStageInput = {
  /** The storage policy. */
  policy?: InputMaybe<StoragePolicyInput>;
};

/** Represents a range of string values. */
export type StringRange = {
  __typename?: 'StringRange';
  /** Starting value of string range. */
  from?: Maybe<Scalars['String']['output']>;
  /** Ending value of string range. */
  to?: Maybe<Scalars['String']['output']>;
};

/** Represents a list of string reults. */
export type StringResults = {
  __typename?: 'StringResults';
  /** The list of strings result. */
  results?: Maybe<Array<Scalars['String']['output']>>;
};

/** Represents the summarization strategy. */
export type SummarizationStrategy = {
  __typename?: 'SummarizationStrategy';
  /** The number of summarized items, i.e. bullet points. */
  items?: Maybe<Scalars['Int']['output']>;
  /** The LLM prompt, for custom summarization. */
  prompt?: Maybe<Scalars['String']['output']>;
  /** The LLM specification used by the summarization. */
  specification?: Maybe<EntityReference>;
  /** The token limit for the summarization. */
  tokens?: Maybe<Scalars['Int']['output']>;
  /** The summarization type. */
  type: SummarizationTypes;
};

/** Represents the summarization strategy. */
export type SummarizationStrategyInput = {
  /** The number of summarized items, i.e. bullet points. */
  items?: InputMaybe<Scalars['Int']['input']>;
  /** The LLM prompt, for custom summarization. */
  prompt?: InputMaybe<Scalars['String']['input']>;
  /** The LLM specification used by the summarization. */
  specification?: InputMaybe<EntityReferenceInput>;
  /** The token limit for the summarization. */
  tokens?: InputMaybe<Scalars['Int']['input']>;
  /** The summarization type. */
  type: SummarizationTypes;
};

/** Summarization type */
export enum SummarizationTypes {
  /** Bullet Points */
  Bullets = 'BULLETS',
  /** Transcript Chapters */
  Chapters = 'CHAPTERS',
  /** Custom prompt */
  Custom = 'CUSTOM',
  /** Headlines */
  Headlines = 'HEADLINES',
  /** Keywords */
  Keywords = 'KEYWORDS',
  /** Social Media Posts */
  Posts = 'POSTS',
  /** Questions */
  Questions = 'QUESTIONS',
  /** Summary */
  Summary = 'SUMMARY'
}

/** Represents an LLM summarized item. */
export type Summarized = {
  __typename?: 'Summarized';
  /** The elapsed time for the model to complete the summarization. */
  summarizationTime?: Maybe<Scalars['TimeSpan']['output']>;
  /** The summarized text. */
  text?: Maybe<Scalars['String']['output']>;
  /** The summarization token usage. */
  tokens: Scalars['Int']['output'];
};

/** Represents a chunk of text. */
export type TextChunk = {
  __typename?: 'TextChunk';
  /** The column index of text chunk, if within table. */
  columnIndex?: Maybe<Scalars['Int']['output']>;
  /** The confidence of the extracted text chunk. */
  confidence?: Maybe<Scalars['Float']['output']>;
  /** The text chunk index. */
  index?: Maybe<Scalars['Int']['output']>;
  /** The text chunk language. May be assigned for code chunks. */
  language?: Maybe<Scalars['String']['output']>;
  /** The page index of chunk, if within section. */
  pageIndex?: Maybe<Scalars['Int']['output']>;
  /** The relevance score of the text chunk. */
  relevance?: Maybe<Scalars['Float']['output']>;
  /** The text chunk role. */
  role?: Maybe<TextRoles>;
  /** The row index of text chunk, if within table. */
  rowIndex?: Maybe<Scalars['Int']['output']>;
  /** The text chunk. */
  text?: Maybe<Scalars['String']['output']>;
};

/** Represents text content. */
export type TextContentInput = {
  /** The content name. */
  name: Scalars['String']['input'];
  /** The content text. */
  text: Scalars['String']['input'];
};

/** Represents a frame of image or video. */
export type TextFrame = {
  __typename?: 'TextFrame';
  /** The text which describes the frame. */
  description?: Maybe<Scalars['String']['output']>;
  /** The frame index. */
  index?: Maybe<Scalars['Int']['output']>;
  /** The relevance score of the frame. */
  relevance?: Maybe<Scalars['Float']['output']>;
  /** The text extracted from the frame. */
  text?: Maybe<Scalars['String']['output']>;
};

/** Represents a page of text. */
export type TextPage = {
  __typename?: 'TextPage';
  /** The text page chunks. */
  chunks?: Maybe<Array<Maybe<TextChunk>>>;
  /** The text page images. */
  images?: Maybe<Array<Maybe<ImageChunk>>>;
  /** The text page index. */
  index?: Maybe<Scalars['Int']['output']>;
  /** The text page hyperlinks. */
  links?: Maybe<Array<Maybe<LinkReference>>>;
  /** The relevance score of the text page. */
  relevance?: Maybe<Scalars['Float']['output']>;
  /** The text page. */
  text?: Maybe<Scalars['String']['output']>;
};

/** Text Roles */
export enum TextRoles {
  /** Button */
  Button = 'BUTTON',
  /** Checkbox */
  Checkbox = 'CHECKBOX',
  /** Code Block */
  Code = 'CODE',
  /** @deprecated Use 'TableColumnHeader' instead. */
  ColumnHeader = 'COLUMN_HEADER',
  /** @deprecated Use 'TableCornerHeader' instead. */
  CornerHeader = 'CORNER_HEADER',
  /** Diagram */
  Diagram = 'DIAGRAM',
  /** Diagram Caption */
  DiagramCaption = 'DIAGRAM_CAPTION',
  /** Equation */
  Equation = 'EQUATION',
  /** Figure */
  Figure = 'FIGURE',
  /** Figure Caption */
  FigureCaption = 'FIGURE_CAPTION',
  /** Footnote */
  Footnote = 'FOOTNOTE',
  /** Heading 1 */
  Heading1 = 'HEADING1',
  /** Heading 2 */
  Heading2 = 'HEADING2',
  /** Heading 3 */
  Heading3 = 'HEADING3',
  /** Heading 4 */
  Heading4 = 'HEADING4',
  /** Heading 5 */
  Heading5 = 'HEADING5',
  /** Heading 6 */
  Heading6 = 'HEADING6',
  /** Image */
  Image = 'IMAGE',
  /** Image Caption */
  ImageCaption = 'IMAGE_CAPTION',
  /** List Item */
  ListItem = 'LIST_ITEM',
  /** Page Footer */
  PageFooter = 'PAGE_FOOTER',
  /** Page Header */
  PageHeader = 'PAGE_HEADER',
  /** Page Number */
  PageNumber = 'PAGE_NUMBER',
  /** Paragraph */
  Paragraph = 'PARAGRAPH',
  /** RadioButton */
  RadioButton = 'RADIO_BUTTON',
  /** @deprecated Use 'TableRowHeader' instead. */
  RowHeader = 'ROW_HEADER',
  /** Section Heading */
  SectionHeading = 'SECTION_HEADING',
  /** Table */
  Table = 'TABLE',
  /** Table Caption */
  TableCaption = 'TABLE_CAPTION',
  /** Table Cell */
  TableCell = 'TABLE_CELL',
  /** Table Column Header */
  TableColumnHeader = 'TABLE_COLUMN_HEADER',
  /** Table Corner Header */
  TableCornerHeader = 'TABLE_CORNER_HEADER',
  /** Table Header */
  TableHeader = 'TABLE_HEADER',
  /** Table Row Header */
  TableRowHeader = 'TABLE_ROW_HEADER',
  /** Title */
  Title = 'TITLE',
  /** Watermark */
  Watermark = 'WATERMARK'
}

/** Represents a segment of an audio transcript. */
export type TextSegment = {
  __typename?: 'TextSegment';
  /** The end time of the audio transcript segment. */
  endTime?: Maybe<Scalars['TimeSpan']['output']>;
  /** The relevance score of the audio transcript segment. */
  relevance?: Maybe<Scalars['Float']['output']>;
  /** The start time of the audio transcript segment. */
  startTime?: Maybe<Scalars['TimeSpan']['output']>;
  /** The audio transcript segment. */
  text?: Maybe<Scalars['String']['output']>;
};

/** Text type */
export enum TextTypes {
  /** HTML */
  Html = 'HTML',
  /** Markdown */
  Markdown = 'MARKDOWN',
  /** Plain Text */
  Plain = 'PLAIN'
}

/** Time interval type */
export enum TimeIntervalTypes {
  /** By day */
  Day = 'DAY',
  /** By hour */
  Hour = 'HOUR',
  /** By minute */
  Minute = 'MINUTE',
  /** By month */
  Month = 'MONTH',
  /** By quarter */
  Quarter = 'QUARTER',
  /** By week */
  Week = 'WEEK',
  /** By year */
  Year = 'YEAR'
}

/** Recurrent type for timed policies */
export enum TimedPolicyRecurrenceTypes {
  /** Execute once */
  Once = 'ONCE',
  /** Repeat until disabled */
  Repeat = 'REPEAT'
}

/** Represents a tool definition. */
export type ToolDefinition = {
  __typename?: 'ToolDefinition';
  /** The tool description. */
  description?: Maybe<Scalars['String']['output']>;
  /** The tool name. */
  name: Scalars['String']['output'];
  /** The tool schema. */
  schema: Scalars['String']['output'];
};

/** Represents a tool definition. */
export type ToolDefinitionInput = {
  /** The tool description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The tool name. */
  name: Scalars['String']['input'];
  /** The tool schema. */
  schema: Scalars['String']['input'];
};

/** Represents Trello feed properties. */
export type TrelloFeedProperties = {
  __typename?: 'TrelloFeedProperties';
  /** The Trello identifiers. */
  identifiers: Array<Scalars['String']['output']>;
  /** The Trello API key. */
  key: Scalars['String']['output'];
  /** The Trello integration token. */
  token: Scalars['String']['output'];
  /** The Trello object type, i.e. card or board. */
  type: TrelloTypes;
};

/** Represents Trello feed properties. */
export type TrelloFeedPropertiesInput = {
  /** The Trello identifiers. */
  identifiers: Array<Scalars['String']['input']>;
  /** The Trello API key. */
  key: Scalars['String']['input'];
  /** The Trello integration token. */
  token: Scalars['String']['input'];
  /** The Trello object type, i.e. card or board. */
  type: TrelloTypes;
};

/** Represents Trello feed properties. */
export type TrelloFeedPropertiesUpdateInput = {
  /** The Trello identifiers. */
  identifiers?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The Trello API key. */
  key?: InputMaybe<Scalars['String']['input']>;
  /** The Trello integration token. */
  token?: InputMaybe<Scalars['String']['input']>;
  /** The Trello object type, i.e. card or board. */
  type?: InputMaybe<TrelloTypes>;
};

export enum TrelloTypes {
  /** Trello Board */
  Board = 'BOARD',
  /** Trello Card */
  Card = 'CARD'
}

/** Represents Twitter feed properties. */
export type TwitterFeedProperties = {
  __typename?: 'TwitterFeedProperties';
  /** Should the Twitter feed include attachments. */
  includeAttachments?: Maybe<Scalars['Boolean']['output']>;
  /** Search query for Twitter API, ex: '(from:twitterdev -is:retweet) OR #twitterdev'. */
  query?: Maybe<Scalars['String']['output']>;
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: Maybe<Scalars['Int']['output']>;
  /** The Twitter bearer token. */
  token: Scalars['String']['output'];
  /** Twitter listing type, i.e. posts, mentions, recent search. Defaults to posts by username. */
  type?: Maybe<TwitterListingTypes>;
  /** Twitter username. */
  userName?: Maybe<Scalars['String']['output']>;
};

/** Represents Twitter feed properties. */
export type TwitterFeedPropertiesInput = {
  /** Should the Twitter feed include attachments. */
  includeAttachments?: InputMaybe<Scalars['Boolean']['input']>;
  /** Search query for Twitter API, ex: '(from:twitterdev -is:retweet) OR #twitterdev'. */
  query?: InputMaybe<Scalars['String']['input']>;
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The Twitter bearer token. */
  token: Scalars['String']['input'];
  /** Twitter listing type, i.e. posts, mentions, recent search. Defaults to posts by username. */
  type?: InputMaybe<TwitterListingTypes>;
  /** Twitter username. */
  userName?: InputMaybe<Scalars['String']['input']>;
};

/** Represents Twitter feed properties. */
export type TwitterFeedPropertiesUpdateInput = {
  /** Should the Twitter feed include attachments. */
  includeAttachments?: InputMaybe<Scalars['Boolean']['input']>;
  /** Search query for Twitter API, ex: '(from:twitterdev -is:retweet) OR #twitterdev'. */
  query?: InputMaybe<Scalars['String']['input']>;
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The Twitter bearer token. */
  token?: InputMaybe<Scalars['String']['input']>;
  /** Twitter listing type, i.e. posts, mentions, recent search. Defaults to posts by username. */
  type?: InputMaybe<TwitterListingTypes>;
  /** Twitter username. */
  userName?: InputMaybe<Scalars['String']['input']>;
};

/** Represents Twitter integration properties. */
export type TwitterIntegrationProperties = {
  __typename?: 'TwitterIntegrationProperties';
  /** Twitter access token key. */
  accessTokenKey: Scalars['String']['output'];
  /** Twitter access token secret. */
  accessTokenSecret: Scalars['String']['output'];
  /** Twitter consumer key. */
  consumerKey: Scalars['String']['output'];
  /** Twitter consumer secret. */
  consumerSecret: Scalars['String']['output'];
};

/** Represents Twitter integration properties. */
export type TwitterIntegrationPropertiesInput = {
  /** Twitter access token key. */
  accessTokenKey: Scalars['String']['input'];
  /** Twitter access token secret. */
  accessTokenSecret: Scalars['String']['input'];
  /** Twitter consumer key. */
  consumerKey: Scalars['String']['input'];
  /** Twitter consumer secret. */
  consumerSecret: Scalars['String']['input'];
};

export enum TwitterListingTypes {
  Mentions = 'MENTIONS',
  Posts = 'POSTS',
  RecentSearch = 'RECENT_SEARCH'
}

/** Unit types */
export enum UnitTypes {
  /** Angstrom */
  Angstrom = 'ANGSTROM',
  /** Astronomical unit */
  AstronomicalUnit = 'ASTRONOMICAL_UNIT',
  /** Centimeter */
  Centimeter = 'CENTIMETER',
  /** Custom */
  Custom = 'CUSTOM',
  /** Decameter */
  Decameter = 'DECAMETER',
  /** Decimeter */
  Decimeter = 'DECIMETER',
  /** Foot */
  Foot = 'FOOT',
  /** Gigameter */
  Gigameter = 'GIGAMETER',
  /** Hectometer */
  Hectometer = 'HECTOMETER',
  /** Inch */
  Inch = 'INCH',
  /** Kilometer */
  Kilometer = 'KILOMETER',
  /** Light-year */
  LightYear = 'LIGHT_YEAR',
  /** Meter */
  Meter = 'METER',
  /** Micrometer */
  Micrometer = 'MICROMETER',
  /** Microinch */
  MicroInch = 'MICRO_INCH',
  /** Mil */
  Mil = 'MIL',
  /** Mile */
  Mile = 'MILE',
  /** Millimeter */
  Millimeter = 'MILLIMETER',
  /** Nanometer */
  Nanometer = 'NANOMETER',
  /** Parsec */
  Parsec = 'PARSEC',
  /** Unitless */
  Unitless = 'UNITLESS',
  /** Yard */
  Yard = 'YARD'
}

/** Represents a URI result. */
export type UriResult = {
  __typename?: 'UriResult';
  /** The URI result. */
  uri?: Maybe<Scalars['URL']['output']>;
};

/** Represents URI results. */
export type UriResults = {
  __typename?: 'UriResults';
  /** The URI results. */
  results?: Maybe<Array<Maybe<Scalars['URL']['output']>>>;
};

/** Represents a user. */
export type User = {
  __typename?: 'User';
  /** The reference to the connectors that the user has created. */
  connectors?: Maybe<Array<Maybe<Connector>>>;
  /** The creation date of the user. */
  creationDate: Scalars['DateTime']['output'];
  /** The description of the user. */
  description?: Maybe<Scalars['String']['output']>;
  /** The ID of the user. */
  id: Scalars['ID']['output'];
  /** The external identifier of the user. */
  identifier: Scalars['String']['output'];
  /** The modified date of the user. */
  modifiedDate?: Maybe<Scalars['DateTime']['output']>;
  /** The name of the user. */
  name: Scalars['String']['output'];
  /** The owner of the user. */
  owner: Owner;
  /** The relevance score of the user. */
  relevance?: Maybe<Scalars['Float']['output']>;
  /** The state of the user (i.e. created, finished). */
  state: EntityState;
  /** The user type, i.e. human or agent. */
  type?: Maybe<UserTypes>;
};

/** Represents a filter for users. */
export type UserFilter = {
  /** Filter by creation date recent timespan. For example, a timespan of one day will return user(s) created in the last 24 hours. */
  createdInLast?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** Filter user(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter user(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Filter users by their external identifier. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** Limit the number of user(s) to be returned. Defaults to 100. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter user(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Skip the specified number of user(s) from the beginning of the result set. Only supported on keyword search. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** Filter user(s) by searching for similar text. */
  search?: InputMaybe<Scalars['String']['input']>;
  /** Filter user(s) by their states. */
  states?: InputMaybe<Array<EntityState>>;
};

/** Represents a user. */
export type UserInput = {
  /** The description of the user. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The external identifier of the user. */
  identifier: Scalars['String']['input'];
  /** The name of the user. */
  name: Scalars['String']['input'];
  /** The user type, i.e. human or agent. */
  type?: InputMaybe<UserTypes>;
};

/** Represents user query results. */
export type UserResults = {
  __typename?: 'UserResults';
  /** The list of user query results. */
  results?: Maybe<Array<Maybe<User>>>;
};

/** User type */
export enum UserTypes {
  /** Agent user */
  Agent = 'AGENT',
  /** Human user */
  Human = 'HUMAN'
}

/** Represents a user. */
export type UserUpdateInput = {
  /** The description of the user. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the user to update. */
  id: Scalars['ID']['input'];
  /** The external identifier of the user. */
  identifier?: InputMaybe<Scalars['String']['input']>;
  /** The name of the user. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The user type, i.e. human or agent. */
  type?: InputMaybe<UserTypes>;
};

/** Represents video metadata. */
export type VideoMetadata = {
  __typename?: 'VideoMetadata';
  /** The episode author, if podcast episode. */
  author?: Maybe<Scalars['String']['output']>;
  /** The audio description. */
  description?: Maybe<Scalars['String']['output']>;
  /** The video duration. */
  duration?: Maybe<Scalars['TimeSpan']['output']>;
  /** The video height. */
  height?: Maybe<Scalars['Int']['output']>;
  /** The episode keywords, if podcast episode. */
  keywords?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The video device make. */
  make?: Maybe<Scalars['String']['output']>;
  /** The video device model. */
  model?: Maybe<Scalars['String']['output']>;
  /** The video device software. */
  software?: Maybe<Scalars['String']['output']>;
  /** The audio title. */
  title?: Maybe<Scalars['String']['output']>;
  /** The video width. */
  width?: Maybe<Scalars['Int']['output']>;
};

/** Represents video metadata. */
export type VideoMetadataInput = {
  /** The metadata creation date. */
  creationDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** The video duration. */
  duration?: InputMaybe<Scalars['String']['input']>;
  /** The video height. */
  height?: InputMaybe<Scalars['Int']['input']>;
  /** The metadata geo-location. */
  location?: InputMaybe<PointInput>;
  /** The video device make. */
  make?: InputMaybe<Scalars['String']['input']>;
  /** The video device model. */
  model?: InputMaybe<Scalars['String']['input']>;
  /** The metadata modified date. */
  modifiedDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** The video device software. */
  software?: InputMaybe<Scalars['String']['input']>;
  /** The video width. */
  width?: InputMaybe<Scalars['Int']['input']>;
};

/** Represents Voyage model properties. */
export type VoyageModelProperties = {
  __typename?: 'VoyageModelProperties';
  /** The limit of tokens per embedded text chunk, defaults to 600. */
  chunkTokenLimit?: Maybe<Scalars['Int']['output']>;
  /** The Voyage API key, if using developer's own account. */
  key?: Maybe<Scalars['String']['output']>;
  /** The Voyage model, or custom, when using developer's own account. */
  model: VoyageModels;
  /** The Voyage model name, if using developer's own account. */
  modelName?: Maybe<Scalars['String']['output']>;
};

/** Represents Voyage model properties. */
export type VoyageModelPropertiesInput = {
  /** The limit of tokens per embedded text chunk, defaults to 600. */
  chunkTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The Voyage API key, if using developer's own account. */
  key?: InputMaybe<Scalars['String']['input']>;
  /** The Voyage model, or custom, when using developer's own account. */
  model: VoyageModels;
  /** The Voyage model name, if using developer's own account. */
  modelName?: InputMaybe<Scalars['String']['input']>;
};

/** Represents Voyage model properties. */
export type VoyageModelPropertiesUpdateInput = {
  /** The limit of tokens per embedded text chunk, defaults to 600. */
  chunkTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The Voyage API key, if using developer's own account. */
  key?: InputMaybe<Scalars['String']['input']>;
  /** The Voyage model, or custom, when using developer's own account. */
  model?: InputMaybe<VoyageModels>;
  /** The Voyage model name, if using developer's own account. */
  modelName?: InputMaybe<Scalars['String']['input']>;
};

/** Voyage model type */
export enum VoyageModels {
  /** Developer-specified model */
  Custom = 'CUSTOM',
  /** Voyage (Latest) */
  Voyage = 'VOYAGE',
  /** Voyage 3.0 */
  Voyage_3_0 = 'VOYAGE_3_0',
  /** Voyage 3.0 Large */
  Voyage_3_0Large = 'VOYAGE_3_0_LARGE',
  /** Voyage Code 2.0 */
  VoyageCode_2_0 = 'VOYAGE_CODE_2_0',
  /** Voyage Code 3.0 */
  VoyageCode_3_0 = 'VOYAGE_CODE_3_0',
  /** Voyage Finance 2.0 */
  VoyageFinance_2_0 = 'VOYAGE_FINANCE_2_0',
  /** Voyage Law 2.0 */
  VoyageLaw_2_0 = 'VOYAGE_LAW_2_0',
  /** Voyage Lite 3.0 */
  VoyageLite_3_0 = 'VOYAGE_LITE_3_0',
  /** Voyage Multilingual 2.0 */
  VoyageMultilingual_2_0 = 'VOYAGE_MULTILINGUAL_2_0'
}

/** Represents web feed properties. */
export type WebFeedProperties = {
  __typename?: 'WebFeedProperties';
  /** The list of regular expressions for URL paths to be crawled, i.e. "^/public/blogs/.*". */
  allowedPaths?: Maybe<Array<Scalars['String']['output']>>;
  /** The list of regular expressions for URL paths to not be crawled, i.e. "^/internal/private/.*". */
  excludedPaths?: Maybe<Array<Scalars['String']['output']>>;
  /** Whether to include files referenced by the web sitemap, defaults to false. */
  includeFiles?: Maybe<Scalars['Boolean']['output']>;
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: Maybe<Scalars['Int']['output']>;
  /** The web URI. */
  uri: Scalars['URL']['output'];
};

/** Represents web feed properties. */
export type WebFeedPropertiesInput = {
  /** The list of regular expressions for URL paths to be crawled, i.e. "^/public/blogs/.*". */
  allowedPaths?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The list of regular expressions for URL paths to not be crawled, i.e. "^/internal/private/.*". */
  excludedPaths?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Whether to include files referenced by the web sitemap, defaults to false. */
  includeFiles?: InputMaybe<Scalars['Boolean']['input']>;
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The web URI. */
  uri: Scalars['URL']['input'];
};

/** Represents web feed properties. */
export type WebFeedPropertiesUpdateInput = {
  /** The list of regular expressions for URL paths to be crawled, i.e. "^/public/blogs/.*". */
  allowedPaths?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The list of regular expressions for URL paths to not be crawled, i.e. "^/internal/private/.*". */
  excludedPaths?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Whether to include files referenced by the web sitemap, defaults to false. */
  includeFiles?: InputMaybe<Scalars['Boolean']['input']>;
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The web URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents web search result. */
export type WebSearchResult = {
  __typename?: 'WebSearchResult';
  /** The search relevance score. */
  score?: Maybe<Scalars['Float']['output']>;
  /** The relevant web page text. */
  text?: Maybe<Scalars['String']['output']>;
  /** The content title. */
  title?: Maybe<Scalars['String']['output']>;
  /** The web search result URI, may be a web page or podcast episode. */
  uri: Scalars['URL']['output'];
};

/** Represents web search results. */
export type WebSearchResults = {
  __typename?: 'WebSearchResults';
  /** The list of web search results. */
  results?: Maybe<Array<WebSearchResult>>;
};

/** Represents a workflow. */
export type Workflow = {
  __typename?: 'Workflow';
  /** The workflow actions. */
  actions?: Maybe<Array<Maybe<WorkflowAction>>>;
  /** The classification stage of the content workflow. */
  classification?: Maybe<ClassificationWorkflowStage>;
  /** The creation date of the workflow. */
  creationDate: Scalars['DateTime']['output'];
  /** The enrichment stage of the content workflow. */
  enrichment?: Maybe<EnrichmentWorkflowStage>;
  /** The extraction stage of the content workflow. */
  extraction?: Maybe<ExtractionWorkflowStage>;
  /** The ID of the workflow. */
  id: Scalars['ID']['output'];
  /** The indexing stage of the content workflow. */
  indexing?: Maybe<IndexingWorkflowStage>;
  /** The ingestion stage of the content workflow. */
  ingestion?: Maybe<IngestionWorkflowStage>;
  /** The modified date of the workflow. */
  modifiedDate?: Maybe<Scalars['DateTime']['output']>;
  /** The name of the workflow. */
  name: Scalars['String']['output'];
  /** The owner of the workflow. */
  owner: Owner;
  /** The preparation stage of the content workflow. */
  preparation?: Maybe<PreparationWorkflowStage>;
  /** The relevance score of the workflow. */
  relevance?: Maybe<Scalars['Float']['output']>;
  /** The state of the workflow (i.e. created, finished). */
  state: EntityState;
  /** The storage stage of the content workflow. */
  storage?: Maybe<StorageWorkflowStage>;
};

/** Represents the workflow action. */
export type WorkflowAction = {
  __typename?: 'WorkflowAction';
  /** The integration connector used by the action. */
  connector?: Maybe<IntegrationConnector>;
};

/** Represents the workflow action. */
export type WorkflowActionInput = {
  /** The integration connector used by the action. */
  connector?: InputMaybe<IntegrationConnectorInput>;
};

/** Represents a filter for workflows. */
export type WorkflowFilter = {
  /** Filter by creation date recent timespan. For example, a timespan of one day will return workflow(s) created in the last 24 hours. */
  createdInLast?: InputMaybe<Scalars['TimeSpan']['input']>;
  /** Filter workflow(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter workflow(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of workflow(s) to be returned. Defaults to 100. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter workflow(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Skip the specified number of workflow(s) from the beginning of the result set. Only supported on keyword search. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** Filter workflow(s) by searching for similar text. */
  search?: InputMaybe<Scalars['String']['input']>;
  /** Filter workflow(s) by their states. */
  states?: InputMaybe<Array<EntityState>>;
};

/** Represents a workflow. */
export type WorkflowInput = {
  /** The workflow actions. */
  actions?: InputMaybe<Array<InputMaybe<WorkflowActionInput>>>;
  /** The classification stage of the content workflow. */
  classification?: InputMaybe<ClassificationWorkflowStageInput>;
  /** The enrichment stage of the content workflow. */
  enrichment?: InputMaybe<EnrichmentWorkflowStageInput>;
  /** The extraction stage of the content workflow. */
  extraction?: InputMaybe<ExtractionWorkflowStageInput>;
  /** The indexing stage of the content workflow. */
  indexing?: InputMaybe<IndexingWorkflowStageInput>;
  /** The ingestion stage of the content workflow. */
  ingestion?: InputMaybe<IngestionWorkflowStageInput>;
  /** The name of the workflow. */
  name: Scalars['String']['input'];
  /** The preparation stage of the content workflow. */
  preparation?: InputMaybe<PreparationWorkflowStageInput>;
  /** The storage stage of the content workflow. */
  storage?: InputMaybe<StorageWorkflowStageInput>;
};

/** Represents workflow query results. */
export type WorkflowResults = {
  __typename?: 'WorkflowResults';
  /** The list of workflow query results. */
  results?: Maybe<Array<Maybe<Workflow>>>;
};

/** Represents a workflow. */
export type WorkflowUpdateInput = {
  /** The workflow actions. */
  actions?: InputMaybe<Array<InputMaybe<WorkflowActionInput>>>;
  /** The classification stage of the content workflow. */
  classification?: InputMaybe<ClassificationWorkflowStageInput>;
  /** The enrichment stage of the content workflow. */
  enrichment?: InputMaybe<EnrichmentWorkflowStageInput>;
  /** The extraction stage of the content workflow. */
  extraction?: InputMaybe<ExtractionWorkflowStageInput>;
  /** The ID of the workflow to update. */
  id: Scalars['ID']['input'];
  /** The indexing stage of the content workflow. */
  indexing?: InputMaybe<IndexingWorkflowStageInput>;
  /** The ingestion stage of the content workflow. */
  ingestion?: InputMaybe<IngestionWorkflowStageInput>;
  /** The name of the workflow. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The preparation stage of the content workflow. */
  preparation?: InputMaybe<PreparationWorkflowStageInput>;
  /** The storage stage of the content workflow. */
  storage?: InputMaybe<StorageWorkflowStageInput>;
};

/** Represents YouTube feed properties. */
export type YouTubeFeedProperties = {
  __typename?: 'YouTubeFeedProperties';
  /** The YouTube channel identifier, when using channel type. */
  channelIdentifier?: Maybe<Scalars['String']['output']>;
  /** The YouTube playlist identifier, when using playlist type. */
  playlistIdentifier?: Maybe<Scalars['String']['output']>;
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: Maybe<Scalars['Int']['output']>;
  /** The YouTube type, i.e. video, playlist or channel. */
  type: YouTubeTypes;
  /** The YouTube video identifiers, when using video type. */
  videoIdentifiers?: Maybe<Array<Scalars['String']['output']>>;
  /** The YouTube video name to search, when using videos type. */
  videoName?: Maybe<Scalars['String']['output']>;
};

/** Represents YouTube feed properties. */
export type YouTubeFeedPropertiesInput = {
  /** The YouTube channel identifier, requires channel type. */
  channelIdentifier?: InputMaybe<Scalars['String']['input']>;
  /** The YouTube playlist identifier, requires playlist type. */
  playlistIdentifier?: InputMaybe<Scalars['String']['input']>;
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The YouTube type, i.e. video, playlist or channel. */
  type: YouTubeTypes;
  /** The YouTube video identifiers, requires video type. */
  videoIdentifiers?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The YouTube video name to search, requires videos type. */
  videoName?: InputMaybe<Scalars['String']['input']>;
};

/** Represents YouTube feed properties. */
export type YouTubeFeedPropertiesUpdateInput = {
  /** The YouTube channel identifier, requires channel type. */
  channelIdentifier?: InputMaybe<Scalars['String']['input']>;
  /** The YouTube playlist identifier, requires playlist type. */
  playlistIdentifier?: InputMaybe<Scalars['String']['input']>;
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The YouTube type, i.e. video, playlist or channel. */
  type?: InputMaybe<YouTubeTypes>;
  /** The YouTube video identifiers, requires video type. */
  videoIdentifiers?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The YouTube video name to search, requires videos type. */
  videoName?: InputMaybe<Scalars['String']['input']>;
};

export enum YouTubeTypes {
  /** YouTube Channel */
  Channel = 'CHANNEL',
  /** YouTube Playlist */
  Playlist = 'PLAYLIST',
  /** YouTube Video */
  Video = 'VIDEO',
  /** YouTube Videos */
  Videos = 'VIDEOS'
}

/** Represents Zendesk feed properties. */
export type ZendeskFeedProperties = {
  __typename?: 'ZendeskFeedProperties';
  /** Zendesk access token. */
  accessToken: Scalars['String']['output'];
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: Maybe<Scalars['Int']['output']>;
  /** Zendesk subdomain. */
  subdomain: Scalars['String']['output'];
};

/** Represents Zendesk feed properties. */
export type ZendeskFeedPropertiesInput = {
  /** Zendesk access token. */
  accessToken: Scalars['String']['input'];
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: InputMaybe<Scalars['Int']['input']>;
  /** Zendesk subdomain. */
  subdomain: Scalars['String']['input'];
};

/** Represents Zendesk feed properties. */
export type ZendeskFeedPropertiesUpdateInput = {
  /** Zendesk access token. */
  accessToken?: InputMaybe<Scalars['String']['input']>;
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: InputMaybe<Scalars['Int']['input']>;
  /** Zendesk subdomain. */
  subdomain?: InputMaybe<Scalars['String']['input']>;
};

/** Represents Zendesk Tickets feed properties. */
export type ZendeskTicketsFeedProperties = {
  __typename?: 'ZendeskTicketsFeedProperties';
  /** Zendesk access token. */
  accessToken: Scalars['String']['output'];
  /** Zendesk subdomain. */
  subdomain: Scalars['String']['output'];
};

/** Represents Zendesk Tickets feed properties. */
export type ZendeskTicketsFeedPropertiesInput = {
  /** Zendesk access token. */
  accessToken: Scalars['String']['input'];
  /** Zendesk subdomain. */
  subdomain: Scalars['String']['input'];
};

/** Represents Zendesk Tickets feed properties. */
export type ZendeskTicketsFeedPropertiesUpdateInput = {
  /** Zendesk access token. */
  accessToken?: InputMaybe<Scalars['String']['input']>;
  /** Zendesk subdomain. */
  subdomain?: InputMaybe<Scalars['String']['input']>;
};

export type CountAlertsQueryVariables = Exact<{
  filter?: InputMaybe<AlertFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CountAlertsQuery = { __typename?: 'Query', countAlerts?: { __typename?: 'CountResult', count?: any | null } | null };

export type CreateAlertMutationVariables = Exact<{
  alert: AlertInput;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateAlertMutation = { __typename?: 'Mutation', createAlert?: { __typename?: 'Alert', id: string, name: string, state: EntityState, type: AlertTypes } | null };

export type DeleteAlertMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteAlertMutation = { __typename?: 'Mutation', deleteAlert?: { __typename?: 'Alert', id: string, state: EntityState } | null };

export type DeleteAlertsMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type DeleteAlertsMutation = { __typename?: 'Mutation', deleteAlerts?: Array<{ __typename?: 'Alert', id: string, state: EntityState } | null> | null };

export type DeleteAllAlertsMutationVariables = Exact<{
  filter?: InputMaybe<AlertFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type DeleteAllAlertsMutation = { __typename?: 'Mutation', deleteAllAlerts?: Array<{ __typename?: 'Alert', id: string, state: EntityState } | null> | null };

export type DisableAlertMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DisableAlertMutation = { __typename?: 'Mutation', disableAlert?: { __typename?: 'Alert', id: string, state: EntityState } | null };

export type EnableAlertMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type EnableAlertMutation = { __typename?: 'Mutation', enableAlert?: { __typename?: 'Alert', id: string, state: EntityState } | null };

export type GetAlertQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAlertQuery = { __typename?: 'Query', alert?: { __typename?: 'Alert', id: string, name: string, creationDate: any, relevance?: number | null, state: EntityState, correlationId?: string | null, type: AlertTypes, summaryPrompt?: string | null, publishPrompt: string, lastAlertDate?: any | null, owner: { __typename?: 'Owner', id: string }, filter?: { __typename?: 'ContentCriteria', inLast?: any | null, createdInLast?: any | null, types?: Array<ContentTypes> | null, fileTypes?: Array<FileTypes | null> | null, formats?: Array<string | null> | null, fileExtensions?: Array<string> | null, dateRange?: { __typename?: 'DateRange', from?: any | null, to?: any | null } | null, creationDateRange?: { __typename?: 'DateRange', from?: any | null, to?: any | null } | null, similarContents?: Array<{ __typename?: 'EntityReference', id: string }> | null, contents?: Array<{ __typename?: 'EntityReference', id: string }> | null, feeds?: Array<{ __typename?: 'EntityReference', id: string }> | null, workflows?: Array<{ __typename?: 'EntityReference', id: string }> | null, collections?: Array<{ __typename?: 'EntityReference', id: string }> | null, users?: Array<{ __typename?: 'EntityReference', id: string }> | null, observations?: Array<{ __typename?: 'ObservationCriteria', type: ObservableTypes, states?: Array<EntityState | null> | null, observable: { __typename?: 'EntityReference', id: string } }> | null, or?: Array<{ __typename?: 'ContentCriteriaLevel', feeds?: Array<{ __typename?: 'EntityReference', id: string }> | null, workflows?: Array<{ __typename?: 'EntityReference', id: string }> | null, collections?: Array<{ __typename?: 'EntityReference', id: string }> | null, users?: Array<{ __typename?: 'EntityReference', id: string }> | null, observations?: Array<{ __typename?: 'ObservationCriteria', type: ObservableTypes, states?: Array<EntityState | null> | null, observable: { __typename?: 'EntityReference', id: string } }> | null }> | null, and?: Array<{ __typename?: 'ContentCriteriaLevel', feeds?: Array<{ __typename?: 'EntityReference', id: string }> | null, workflows?: Array<{ __typename?: 'EntityReference', id: string }> | null, collections?: Array<{ __typename?: 'EntityReference', id: string }> | null, users?: Array<{ __typename?: 'EntityReference', id: string }> | null, observations?: Array<{ __typename?: 'ObservationCriteria', type: ObservableTypes, states?: Array<EntityState | null> | null, observable: { __typename?: 'EntityReference', id: string } }> | null }> | null } | null, integration: { __typename?: 'IntegrationConnector', type: IntegrationServiceTypes, uri?: string | null, slack?: { __typename?: 'SlackIntegrationProperties', token: string, channel: string } | null, email?: { __typename?: 'EmailIntegrationProperties', from: string, subject: string, to: Array<string> } | null, twitter?: { __typename?: 'TwitterIntegrationProperties', consumerKey: string, consumerSecret: string, accessTokenKey: string, accessTokenSecret: string } | null }, publishing: { __typename?: 'ContentPublishingConnector', type: ContentPublishingServiceTypes, elevenLabs?: { __typename?: 'ElevenLabsPublishingProperties', model?: ElevenLabsModels | null, voice?: string | null } | null, openAIImage?: { __typename?: 'OpenAIImagePublishingProperties', model?: OpenAiImageModels | null, count?: number | null, seed?: { __typename?: 'EntityReference', id: string } | null } | null }, summarySpecification?: { __typename?: 'EntityReference', id: string } | null, publishSpecification?: { __typename?: 'EntityReference', id: string } | null } | null };

export type QueryAlertsQueryVariables = Exact<{
  filter?: InputMaybe<AlertFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type QueryAlertsQuery = { __typename?: 'Query', alerts?: { __typename?: 'AlertResults', results?: Array<{ __typename?: 'Alert', id: string, name: string, creationDate: any, relevance?: number | null, state: EntityState, correlationId?: string | null, type: AlertTypes, summaryPrompt?: string | null, publishPrompt: string, lastAlertDate?: any | null, owner: { __typename?: 'Owner', id: string }, filter?: { __typename?: 'ContentCriteria', inLast?: any | null, createdInLast?: any | null, types?: Array<ContentTypes> | null, fileTypes?: Array<FileTypes | null> | null, formats?: Array<string | null> | null, fileExtensions?: Array<string> | null, dateRange?: { __typename?: 'DateRange', from?: any | null, to?: any | null } | null, creationDateRange?: { __typename?: 'DateRange', from?: any | null, to?: any | null } | null, similarContents?: Array<{ __typename?: 'EntityReference', id: string }> | null, contents?: Array<{ __typename?: 'EntityReference', id: string }> | null, feeds?: Array<{ __typename?: 'EntityReference', id: string }> | null, workflows?: Array<{ __typename?: 'EntityReference', id: string }> | null, collections?: Array<{ __typename?: 'EntityReference', id: string }> | null, users?: Array<{ __typename?: 'EntityReference', id: string }> | null, observations?: Array<{ __typename?: 'ObservationCriteria', type: ObservableTypes, states?: Array<EntityState | null> | null, observable: { __typename?: 'EntityReference', id: string } }> | null, or?: Array<{ __typename?: 'ContentCriteriaLevel', feeds?: Array<{ __typename?: 'EntityReference', id: string }> | null, workflows?: Array<{ __typename?: 'EntityReference', id: string }> | null, collections?: Array<{ __typename?: 'EntityReference', id: string }> | null, users?: Array<{ __typename?: 'EntityReference', id: string }> | null, observations?: Array<{ __typename?: 'ObservationCriteria', type: ObservableTypes, states?: Array<EntityState | null> | null, observable: { __typename?: 'EntityReference', id: string } }> | null }> | null, and?: Array<{ __typename?: 'ContentCriteriaLevel', feeds?: Array<{ __typename?: 'EntityReference', id: string }> | null, workflows?: Array<{ __typename?: 'EntityReference', id: string }> | null, collections?: Array<{ __typename?: 'EntityReference', id: string }> | null, users?: Array<{ __typename?: 'EntityReference', id: string }> | null, observations?: Array<{ __typename?: 'ObservationCriteria', type: ObservableTypes, states?: Array<EntityState | null> | null, observable: { __typename?: 'EntityReference', id: string } }> | null }> | null } | null, integration: { __typename?: 'IntegrationConnector', type: IntegrationServiceTypes, uri?: string | null, slack?: { __typename?: 'SlackIntegrationProperties', token: string, channel: string } | null, email?: { __typename?: 'EmailIntegrationProperties', from: string, subject: string, to: Array<string> } | null, twitter?: { __typename?: 'TwitterIntegrationProperties', consumerKey: string, consumerSecret: string, accessTokenKey: string, accessTokenSecret: string } | null }, publishing: { __typename?: 'ContentPublishingConnector', type: ContentPublishingServiceTypes, elevenLabs?: { __typename?: 'ElevenLabsPublishingProperties', model?: ElevenLabsModels | null, voice?: string | null } | null, openAIImage?: { __typename?: 'OpenAIImagePublishingProperties', model?: OpenAiImageModels | null, count?: number | null, seed?: { __typename?: 'EntityReference', id: string } | null } | null }, summarySpecification?: { __typename?: 'EntityReference', id: string } | null, publishSpecification?: { __typename?: 'EntityReference', id: string } | null } | null> | null } | null };

export type UpdateAlertMutationVariables = Exact<{
  alert: AlertUpdateInput;
}>;


export type UpdateAlertMutation = { __typename?: 'Mutation', updateAlert?: { __typename?: 'Alert', id: string, name: string, state: EntityState, type: AlertTypes } | null };

export type CountCategoriesQueryVariables = Exact<{
  filter?: InputMaybe<CategoryFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CountCategoriesQuery = { __typename?: 'Query', countCategories?: { __typename?: 'CountResult', count?: any | null } | null };

export type CreateCategoryMutationVariables = Exact<{
  category: CategoryInput;
}>;


export type CreateCategoryMutation = { __typename?: 'Mutation', createCategory?: { __typename?: 'Category', id: string, name: string } | null };

export type DeleteAllCategoriesMutationVariables = Exact<{
  filter?: InputMaybe<CategoryFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type DeleteAllCategoriesMutation = { __typename?: 'Mutation', deleteAllCategories?: Array<{ __typename?: 'Category', id: string, state: EntityState } | null> | null };

export type DeleteCategoriesMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type DeleteCategoriesMutation = { __typename?: 'Mutation', deleteCategories?: Array<{ __typename?: 'Category', id: string, state: EntityState } | null> | null };

export type DeleteCategoryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteCategoryMutation = { __typename?: 'Mutation', deleteCategory?: { __typename?: 'Category', id: string, state: EntityState } | null };

export type GetCategoryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetCategoryQuery = { __typename?: 'Query', category?: { __typename?: 'Category', id: string, name: string, description?: string | null, creationDate: any, relevance?: number | null } | null };

export type QueryCategoriesQueryVariables = Exact<{
  filter?: InputMaybe<CategoryFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type QueryCategoriesQuery = { __typename?: 'Query', categories?: { __typename?: 'CategoryResults', results?: Array<{ __typename?: 'Category', id: string, name: string, description?: string | null, creationDate: any, relevance?: number | null } | null> | null } | null };

export type UpdateCategoryMutationVariables = Exact<{
  category: CategoryUpdateInput;
}>;


export type UpdateCategoryMutation = { __typename?: 'Mutation', updateCategory?: { __typename?: 'Category', id: string, name: string } | null };

export type UpsertCategoryMutationVariables = Exact<{
  category: CategoryInput;
}>;


export type UpsertCategoryMutation = { __typename?: 'Mutation', upsertCategory?: { __typename?: 'Category', id: string, name: string } | null };

export type AddContentsToCollectionsMutationVariables = Exact<{
  contents: Array<EntityReferenceInput> | EntityReferenceInput;
  collections: Array<EntityReferenceInput> | EntityReferenceInput;
}>;


export type AddContentsToCollectionsMutation = { __typename?: 'Mutation', addContentsToCollections?: Array<{ __typename?: 'Collection', id: string, name: string, state: EntityState, type?: CollectionTypes | null, contents?: Array<{ __typename?: 'Content', id: string, name: string } | null> | null } | null> | null };

export type CountCollectionsQueryVariables = Exact<{
  filter?: InputMaybe<CollectionFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CountCollectionsQuery = { __typename?: 'Query', countCollections?: { __typename?: 'CountResult', count?: any | null } | null };

export type CreateCollectionMutationVariables = Exact<{
  collection: CollectionInput;
}>;


export type CreateCollectionMutation = { __typename?: 'Mutation', createCollection?: { __typename?: 'Collection', id: string, name: string, state: EntityState, type?: CollectionTypes | null } | null };

export type DeleteAllCollectionsMutationVariables = Exact<{
  filter?: InputMaybe<CollectionFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type DeleteAllCollectionsMutation = { __typename?: 'Mutation', deleteAllCollections?: Array<{ __typename?: 'Collection', id: string, state: EntityState } | null> | null };

export type DeleteCollectionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteCollectionMutation = { __typename?: 'Mutation', deleteCollection?: { __typename?: 'Collection', id: string, state: EntityState } | null };

export type DeleteCollectionsMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type DeleteCollectionsMutation = { __typename?: 'Mutation', deleteCollections?: Array<{ __typename?: 'Collection', id: string, state: EntityState } | null> | null };

export type GetCollectionQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetCollectionQuery = { __typename?: 'Query', collection?: { __typename?: 'Collection', id: string, name: string, creationDate: any, relevance?: number | null, state: EntityState, type?: CollectionTypes | null, owner: { __typename?: 'Owner', id: string }, contents?: Array<{ __typename?: 'Content', id: string, name: string } | null> | null } | null };

export type QueryCollectionsQueryVariables = Exact<{
  filter?: InputMaybe<CollectionFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type QueryCollectionsQuery = { __typename?: 'Query', collections?: { __typename?: 'CollectionResults', results?: Array<{ __typename?: 'Collection', id: string, name: string, creationDate: any, relevance?: number | null, state: EntityState, type?: CollectionTypes | null, owner: { __typename?: 'Owner', id: string }, contents?: Array<{ __typename?: 'Content', id: string, name: string } | null> | null } | null> | null } | null };

export type RemoveContentsFromCollectionMutationVariables = Exact<{
  contents: Array<EntityReferenceInput> | EntityReferenceInput;
  collection: EntityReferenceInput;
}>;


export type RemoveContentsFromCollectionMutation = { __typename?: 'Mutation', removeContentsFromCollection?: { __typename?: 'Collection', id: string, name: string, state: EntityState, type?: CollectionTypes | null, contents?: Array<{ __typename?: 'Content', id: string, name: string } | null> | null } | null };

export type UpdateCollectionMutationVariables = Exact<{
  collection: CollectionUpdateInput;
}>;


export type UpdateCollectionMutation = { __typename?: 'Mutation', updateCollection?: { __typename?: 'Collection', id: string, name: string, state: EntityState, type?: CollectionTypes | null } | null };

export type CountContentsQueryVariables = Exact<{
  filter?: InputMaybe<ContentFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CountContentsQuery = { __typename?: 'Query', countContents?: { __typename?: 'CountResult', count?: any | null } | null };

export type DeleteAllContentsMutationVariables = Exact<{
  filter?: InputMaybe<ContentFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type DeleteAllContentsMutation = { __typename?: 'Mutation', deleteAllContents?: Array<{ __typename?: 'Content', id: string, state: EntityState } | null> | null };

export type DeleteContentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteContentMutation = { __typename?: 'Mutation', deleteContent?: { __typename?: 'Content', id: string, state: EntityState } | null };

export type DeleteContentsMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type DeleteContentsMutation = { __typename?: 'Mutation', deleteContents?: Array<{ __typename?: 'Content', id: string, state: EntityState } | null> | null };

export type DescribeEncodedImageMutationVariables = Exact<{
  prompt: Scalars['String']['input'];
  mimeType: Scalars['String']['input'];
  data: Scalars['String']['input'];
  specification?: InputMaybe<EntityReferenceInput>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type DescribeEncodedImageMutation = { __typename?: 'Mutation', describeEncodedImage?: { __typename?: 'ConversationMessage', role: ConversationRoleTypes, author?: string | null, message?: string | null, tokens?: number | null, throughput?: number | null, completionTime?: any | null, timestamp?: any | null, modelService?: ModelServiceTypes | null, model?: string | null, data?: string | null, mimeType?: string | null, citations?: Array<{ __typename?: 'ConversationCitation', index?: number | null, text: string, startTime?: any | null, endTime?: any | null, pageNumber?: number | null, frameNumber?: number | null, content?: { __typename?: 'Content', id: string, name: string, state: EntityState, originalDate?: any | null, identifier?: string | null, uri?: any | null, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, format?: string | null, formatName?: string | null, fileExtension?: string | null, fileName?: string | null, fileSize?: any | null, masterUri?: any | null, imageUri?: any | null, textUri?: any | null, audioUri?: any | null, transcriptUri?: any | null, summary?: string | null, customSummary?: string | null, keywords?: Array<string> | null, bullets?: Array<string> | null, headlines?: Array<string> | null, posts?: Array<string> | null, chapters?: Array<string> | null, questions?: Array<string> | null, video?: { __typename?: 'VideoMetadata', width?: number | null, height?: number | null, duration?: any | null, make?: string | null, model?: string | null, software?: string | null, title?: string | null, description?: string | null, keywords?: Array<string | null> | null, author?: string | null } | null, audio?: { __typename?: 'AudioMetadata', keywords?: Array<string | null> | null, author?: string | null, series?: string | null, episode?: string | null, episodeType?: string | null, season?: string | null, publisher?: string | null, copyright?: string | null, genre?: string | null, title?: string | null, description?: string | null, bitrate?: number | null, channels?: number | null, sampleRate?: number | null, bitsPerSample?: number | null, duration?: any | null } | null, image?: { __typename?: 'ImageMetadata', width?: number | null, height?: number | null, resolutionX?: number | null, resolutionY?: number | null, bitsPerComponent?: number | null, components?: number | null, projectionType?: ImageProjectionTypes | null, orientation?: OrientationTypes | null, description?: string | null, make?: string | null, model?: string | null, software?: string | null, lens?: string | null, focalLength?: number | null, exposureTime?: string | null, fNumber?: string | null, iso?: string | null, heading?: number | null, pitch?: number | null } | null, document?: { __typename?: 'DocumentMetadata', title?: string | null, subject?: string | null, summary?: string | null, author?: string | null, publisher?: string | null, description?: string | null, keywords?: Array<string | null> | null, pageCount?: number | null, worksheetCount?: number | null, slideCount?: number | null, wordCount?: number | null, lineCount?: number | null, paragraphCount?: number | null, isEncrypted?: boolean | null, hasDigitalSignature?: boolean | null } | null } | null } | null> | null, toolCalls?: Array<{ __typename?: 'ConversationToolCall', id: string, name: string, arguments: string } | null> | null } | null };

export type DescribeImageMutationVariables = Exact<{
  prompt: Scalars['String']['input'];
  uri: Scalars['URL']['input'];
  specification?: InputMaybe<EntityReferenceInput>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type DescribeImageMutation = { __typename?: 'Mutation', describeImage?: { __typename?: 'ConversationMessage', role: ConversationRoleTypes, author?: string | null, message?: string | null, tokens?: number | null, throughput?: number | null, completionTime?: any | null, timestamp?: any | null, modelService?: ModelServiceTypes | null, model?: string | null, data?: string | null, mimeType?: string | null, citations?: Array<{ __typename?: 'ConversationCitation', index?: number | null, text: string, startTime?: any | null, endTime?: any | null, pageNumber?: number | null, frameNumber?: number | null, content?: { __typename?: 'Content', id: string, name: string, state: EntityState, originalDate?: any | null, identifier?: string | null, uri?: any | null, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, format?: string | null, formatName?: string | null, fileExtension?: string | null, fileName?: string | null, fileSize?: any | null, masterUri?: any | null, imageUri?: any | null, textUri?: any | null, audioUri?: any | null, transcriptUri?: any | null, summary?: string | null, customSummary?: string | null, keywords?: Array<string> | null, bullets?: Array<string> | null, headlines?: Array<string> | null, posts?: Array<string> | null, chapters?: Array<string> | null, questions?: Array<string> | null, video?: { __typename?: 'VideoMetadata', width?: number | null, height?: number | null, duration?: any | null, make?: string | null, model?: string | null, software?: string | null, title?: string | null, description?: string | null, keywords?: Array<string | null> | null, author?: string | null } | null, audio?: { __typename?: 'AudioMetadata', keywords?: Array<string | null> | null, author?: string | null, series?: string | null, episode?: string | null, episodeType?: string | null, season?: string | null, publisher?: string | null, copyright?: string | null, genre?: string | null, title?: string | null, description?: string | null, bitrate?: number | null, channels?: number | null, sampleRate?: number | null, bitsPerSample?: number | null, duration?: any | null } | null, image?: { __typename?: 'ImageMetadata', width?: number | null, height?: number | null, resolutionX?: number | null, resolutionY?: number | null, bitsPerComponent?: number | null, components?: number | null, projectionType?: ImageProjectionTypes | null, orientation?: OrientationTypes | null, description?: string | null, make?: string | null, model?: string | null, software?: string | null, lens?: string | null, focalLength?: number | null, exposureTime?: string | null, fNumber?: string | null, iso?: string | null, heading?: number | null, pitch?: number | null } | null, document?: { __typename?: 'DocumentMetadata', title?: string | null, subject?: string | null, summary?: string | null, author?: string | null, publisher?: string | null, description?: string | null, keywords?: Array<string | null> | null, pageCount?: number | null, worksheetCount?: number | null, slideCount?: number | null, wordCount?: number | null, lineCount?: number | null, paragraphCount?: number | null, isEncrypted?: boolean | null, hasDigitalSignature?: boolean | null } | null } | null } | null> | null, toolCalls?: Array<{ __typename?: 'ConversationToolCall', id: string, name: string, arguments: string } | null> | null } | null };

export type ExtractContentsMutationVariables = Exact<{
  prompt: Scalars['String']['input'];
  filter?: InputMaybe<ContentFilter>;
  specification?: InputMaybe<EntityReferenceInput>;
  tools: Array<ToolDefinitionInput> | ToolDefinitionInput;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type ExtractContentsMutation = { __typename?: 'Mutation', extractContents?: Array<{ __typename?: 'ExtractCompletion', name: string, value: string, startTime?: any | null, endTime?: any | null, pageNumber?: number | null, error?: string | null, specification?: { __typename?: 'EntityReference', id: string } | null, content?: { __typename?: 'EntityReference', id: string } | null } | null> | null };

export type ExtractTextMutationVariables = Exact<{
  prompt: Scalars['String']['input'];
  text: Scalars['String']['input'];
  textType?: InputMaybe<TextTypes>;
  specification?: InputMaybe<EntityReferenceInput>;
  tools: Array<ToolDefinitionInput> | ToolDefinitionInput;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type ExtractTextMutation = { __typename?: 'Mutation', extractText?: Array<{ __typename?: 'ExtractCompletion', name: string, value: string, startTime?: any | null, endTime?: any | null, pageNumber?: number | null, error?: string | null, specification?: { __typename?: 'EntityReference', id: string } | null, content?: { __typename?: 'EntityReference', id: string } | null } | null> | null };

export type GetContentQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetContentQuery = { __typename?: 'Query', content?: { __typename?: 'Content', id: string, name: string, creationDate: any, state: EntityState, originalDate?: any | null, finishedDate?: any | null, workflowDuration?: any | null, uri?: any | null, description?: string | null, identifier?: string | null, markdown?: string | null, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, fileName?: string | null, fileSize?: any | null, masterUri?: any | null, imageUri?: any | null, textUri?: any | null, audioUri?: any | null, transcriptUri?: any | null, summary?: string | null, customSummary?: string | null, keywords?: Array<string> | null, bullets?: Array<string> | null, headlines?: Array<string> | null, posts?: Array<string> | null, chapters?: Array<string> | null, questions?: Array<string> | null, error?: string | null, owner: { __typename?: 'Owner', id: string }, address?: { __typename?: 'Address', streetAddress?: string | null, city?: string | null, region?: string | null, country?: string | null, postalCode?: string | null } | null, location?: { __typename?: 'Point', latitude?: number | null, longitude?: number | null } | null, video?: { __typename?: 'VideoMetadata', width?: number | null, height?: number | null, duration?: any | null, make?: string | null, model?: string | null, software?: string | null, title?: string | null, description?: string | null, keywords?: Array<string | null> | null, author?: string | null } | null, audio?: { __typename?: 'AudioMetadata', keywords?: Array<string | null> | null, author?: string | null, series?: string | null, episode?: string | null, episodeType?: string | null, season?: string | null, publisher?: string | null, copyright?: string | null, genre?: string | null, title?: string | null, description?: string | null, bitrate?: number | null, channels?: number | null, sampleRate?: number | null, bitsPerSample?: number | null, duration?: any | null } | null, image?: { __typename?: 'ImageMetadata', width?: number | null, height?: number | null, resolutionX?: number | null, resolutionY?: number | null, bitsPerComponent?: number | null, components?: number | null, projectionType?: ImageProjectionTypes | null, orientation?: OrientationTypes | null, description?: string | null, make?: string | null, model?: string | null, software?: string | null, lens?: string | null, focalLength?: number | null, exposureTime?: string | null, fNumber?: string | null, iso?: string | null, heading?: number | null, pitch?: number | null } | null, document?: { __typename?: 'DocumentMetadata', title?: string | null, subject?: string | null, summary?: string | null, author?: string | null, publisher?: string | null, description?: string | null, keywords?: Array<string | null> | null, pageCount?: number | null, worksheetCount?: number | null, slideCount?: number | null, wordCount?: number | null, lineCount?: number | null, paragraphCount?: number | null, isEncrypted?: boolean | null, hasDigitalSignature?: boolean | null } | null, email?: { __typename?: 'EmailMetadata', identifier?: string | null, threadIdentifier?: string | null, subject?: string | null, labels?: Array<string | null> | null, sensitivity?: MailSensitivity | null, priority?: MailPriority | null, importance?: MailImportance | null, from?: Array<{ __typename?: 'PersonReference', name?: string | null, email?: string | null, givenName?: string | null, familyName?: string | null } | null> | null, to?: Array<{ __typename?: 'PersonReference', name?: string | null, email?: string | null, givenName?: string | null, familyName?: string | null } | null> | null, cc?: Array<{ __typename?: 'PersonReference', name?: string | null, email?: string | null, givenName?: string | null, familyName?: string | null } | null> | null, bcc?: Array<{ __typename?: 'PersonReference', name?: string | null, email?: string | null, givenName?: string | null, familyName?: string | null } | null> | null } | null, issue?: { __typename?: 'IssueMetadata', identifier?: string | null, title?: string | null, project?: string | null, team?: string | null, status?: string | null, priority?: string | null, type?: string | null, labels?: Array<string | null> | null } | null, package?: { __typename?: 'PackageMetadata', fileCount?: number | null, folderCount?: number | null, isEncrypted?: boolean | null } | null, language?: { __typename?: 'LanguageMetadata', languages?: Array<string | null> | null } | null, parent?: { __typename?: 'Content', id: string, name: string } | null, children?: Array<{ __typename?: 'Content', id: string, name: string } | null> | null, feed?: { __typename?: 'Feed', id: string, name: string } | null, collections?: Array<{ __typename?: 'Collection', id: string, name: string } | null> | null, links?: Array<{ __typename?: 'LinkReference', uri?: any | null, linkType?: LinkTypes | null }> | null, observations?: Array<{ __typename?: 'Observation', id: string, type: ObservableTypes, relatedType?: ObservableTypes | null, relation?: string | null, state: EntityState, observable: { __typename?: 'NamedEntityReference', id: string, name?: string | null }, related?: { __typename?: 'NamedEntityReference', id: string, name?: string | null } | null, occurrences?: Array<{ __typename?: 'ObservationOccurrence', type?: OccurrenceTypes | null, confidence?: number | null, startTime?: any | null, endTime?: any | null, pageIndex?: number | null, boundingBox?: { __typename?: 'BoundingBox', left?: number | null, top?: number | null, width?: number | null, height?: number | null } | null } | null> | null } | null> | null, workflow?: { __typename?: 'Workflow', id: string, name: string } | null, pages?: Array<{ __typename?: 'TextPage', index?: number | null, text?: string | null, relevance?: number | null, images?: Array<{ __typename?: 'ImageChunk', id?: string | null, mimeType?: string | null, data?: string | null, left?: number | null, right?: number | null, top?: number | null, bottom?: number | null } | null> | null, chunks?: Array<{ __typename?: 'TextChunk', index?: number | null, pageIndex?: number | null, rowIndex?: number | null, columnIndex?: number | null, confidence?: number | null, text?: string | null, role?: TextRoles | null, language?: string | null, relevance?: number | null } | null> | null }> | null, segments?: Array<{ __typename?: 'TextSegment', startTime?: any | null, endTime?: any | null, text?: string | null, relevance?: number | null }> | null, frames?: Array<{ __typename?: 'TextFrame', index?: number | null, description?: string | null, text?: string | null, relevance?: number | null }> | null } | null };

export type IngestBatchMutationVariables = Exact<{
  uris: Array<Scalars['URL']['input']> | Scalars['URL']['input'];
  workflow?: InputMaybe<EntityReferenceInput>;
  collections?: InputMaybe<Array<EntityReferenceInput> | EntityReferenceInput>;
  observations?: InputMaybe<Array<ObservationReferenceInput> | ObservationReferenceInput>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type IngestBatchMutation = { __typename?: 'Mutation', ingestBatch?: Array<{ __typename?: 'Content', id: string, name: string, state: EntityState, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, uri?: any | null, collections?: Array<{ __typename?: 'Collection', id: string, name: string } | null> | null, observations?: Array<{ __typename?: 'Observation', id: string, type: ObservableTypes, relatedType?: ObservableTypes | null, relation?: string | null, state: EntityState, observable: { __typename?: 'NamedEntityReference', id: string, name?: string | null }, related?: { __typename?: 'NamedEntityReference', id: string, name?: string | null } | null, occurrences?: Array<{ __typename?: 'ObservationOccurrence', type?: OccurrenceTypes | null, confidence?: number | null, startTime?: any | null, endTime?: any | null, pageIndex?: number | null, boundingBox?: { __typename?: 'BoundingBox', left?: number | null, top?: number | null, width?: number | null, height?: number | null } | null } | null> | null } | null> | null } | null> | null };

export type IngestEncodedFileMutationVariables = Exact<{
  name: Scalars['String']['input'];
  data: Scalars['String']['input'];
  mimeType: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  collections?: InputMaybe<Array<EntityReferenceInput> | EntityReferenceInput>;
  observations?: InputMaybe<Array<ObservationReferenceInput> | ObservationReferenceInput>;
  workflow?: InputMaybe<EntityReferenceInput>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type IngestEncodedFileMutation = { __typename?: 'Mutation', ingestEncodedFile?: { __typename?: 'Content', id: string, name: string, state: EntityState, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, uri?: any | null, collections?: Array<{ __typename?: 'Collection', id: string, name: string } | null> | null, observations?: Array<{ __typename?: 'Observation', id: string, type: ObservableTypes, relatedType?: ObservableTypes | null, relation?: string | null, state: EntityState, observable: { __typename?: 'NamedEntityReference', id: string, name?: string | null }, related?: { __typename?: 'NamedEntityReference', id: string, name?: string | null } | null, occurrences?: Array<{ __typename?: 'ObservationOccurrence', type?: OccurrenceTypes | null, confidence?: number | null, startTime?: any | null, endTime?: any | null, pageIndex?: number | null, boundingBox?: { __typename?: 'BoundingBox', left?: number | null, top?: number | null, width?: number | null, height?: number | null } | null } | null> | null } | null> | null } | null };

export type IngestMemoryMutationVariables = Exact<{
  text: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  textType?: InputMaybe<TextTypes>;
  collections?: InputMaybe<Array<EntityReferenceInput> | EntityReferenceInput>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type IngestMemoryMutation = { __typename?: 'Mutation', ingestMemory?: { __typename?: 'Content', id: string, name: string, state: EntityState, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, uri?: any | null, collections?: Array<{ __typename?: 'Collection', id: string, name: string } | null> | null, observations?: Array<{ __typename?: 'Observation', id: string, type: ObservableTypes, relatedType?: ObservableTypes | null, relation?: string | null, state: EntityState, observable: { __typename?: 'NamedEntityReference', id: string, name?: string | null }, related?: { __typename?: 'NamedEntityReference', id: string, name?: string | null } | null, occurrences?: Array<{ __typename?: 'ObservationOccurrence', type?: OccurrenceTypes | null, confidence?: number | null, startTime?: any | null, endTime?: any | null, pageIndex?: number | null, boundingBox?: { __typename?: 'BoundingBox', left?: number | null, top?: number | null, width?: number | null, height?: number | null } | null } | null> | null } | null> | null } | null };

export type IngestTextMutationVariables = Exact<{
  text: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  textType?: InputMaybe<TextTypes>;
  uri?: InputMaybe<Scalars['URL']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  workflow?: InputMaybe<EntityReferenceInput>;
  collections?: InputMaybe<Array<EntityReferenceInput> | EntityReferenceInput>;
  observations?: InputMaybe<Array<ObservationReferenceInput> | ObservationReferenceInput>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type IngestTextMutation = { __typename?: 'Mutation', ingestText?: { __typename?: 'Content', id: string, name: string, state: EntityState, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, uri?: any | null, collections?: Array<{ __typename?: 'Collection', id: string, name: string } | null> | null, observations?: Array<{ __typename?: 'Observation', id: string, type: ObservableTypes, relatedType?: ObservableTypes | null, relation?: string | null, state: EntityState, observable: { __typename?: 'NamedEntityReference', id: string, name?: string | null }, related?: { __typename?: 'NamedEntityReference', id: string, name?: string | null } | null, occurrences?: Array<{ __typename?: 'ObservationOccurrence', type?: OccurrenceTypes | null, confidence?: number | null, startTime?: any | null, endTime?: any | null, pageIndex?: number | null, boundingBox?: { __typename?: 'BoundingBox', left?: number | null, top?: number | null, width?: number | null, height?: number | null } | null } | null> | null } | null> | null } | null };

export type IngestTextBatchMutationVariables = Exact<{
  batch: Array<TextContentInput> | TextContentInput;
  textType?: InputMaybe<TextTypes>;
  workflow?: InputMaybe<EntityReferenceInput>;
  collections?: InputMaybe<Array<EntityReferenceInput> | EntityReferenceInput>;
  observations?: InputMaybe<Array<ObservationReferenceInput> | ObservationReferenceInput>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type IngestTextBatchMutation = { __typename?: 'Mutation', ingestTextBatch?: Array<{ __typename?: 'Content', id: string, name: string, state: EntityState, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, uri?: any | null, collections?: Array<{ __typename?: 'Collection', id: string, name: string } | null> | null, observations?: Array<{ __typename?: 'Observation', id: string, type: ObservableTypes, relatedType?: ObservableTypes | null, relation?: string | null, state: EntityState, observable: { __typename?: 'NamedEntityReference', id: string, name?: string | null }, related?: { __typename?: 'NamedEntityReference', id: string, name?: string | null } | null, occurrences?: Array<{ __typename?: 'ObservationOccurrence', type?: OccurrenceTypes | null, confidence?: number | null, startTime?: any | null, endTime?: any | null, pageIndex?: number | null, boundingBox?: { __typename?: 'BoundingBox', left?: number | null, top?: number | null, width?: number | null, height?: number | null } | null } | null> | null } | null> | null } | null> | null };

export type IngestUriMutationVariables = Exact<{
  name?: InputMaybe<Scalars['String']['input']>;
  uri: Scalars['URL']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  mimeType?: InputMaybe<Scalars['String']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  workflow?: InputMaybe<EntityReferenceInput>;
  collections?: InputMaybe<Array<EntityReferenceInput> | EntityReferenceInput>;
  observations?: InputMaybe<Array<ObservationReferenceInput> | ObservationReferenceInput>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type IngestUriMutation = { __typename?: 'Mutation', ingestUri?: { __typename?: 'Content', id: string, name: string, state: EntityState, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, uri?: any | null, collections?: Array<{ __typename?: 'Collection', id: string, name: string } | null> | null, observations?: Array<{ __typename?: 'Observation', id: string, type: ObservableTypes, relatedType?: ObservableTypes | null, relation?: string | null, state: EntityState, observable: { __typename?: 'NamedEntityReference', id: string, name?: string | null }, related?: { __typename?: 'NamedEntityReference', id: string, name?: string | null } | null, occurrences?: Array<{ __typename?: 'ObservationOccurrence', type?: OccurrenceTypes | null, confidence?: number | null, startTime?: any | null, endTime?: any | null, pageIndex?: number | null, boundingBox?: { __typename?: 'BoundingBox', left?: number | null, top?: number | null, width?: number | null, height?: number | null } | null } | null> | null } | null> | null } | null };

export type IsContentDoneQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type IsContentDoneQuery = { __typename?: 'Query', isContentDone?: { __typename?: 'BooleanResult', result?: boolean | null } | null };

export type PublishContentsMutationVariables = Exact<{
  summaryPrompt?: InputMaybe<Scalars['String']['input']>;
  publishPrompt: Scalars['String']['input'];
  connector: ContentPublishingConnectorInput;
  filter?: InputMaybe<ContentFilter>;
  includeDetails?: InputMaybe<Scalars['Boolean']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  summarySpecification?: InputMaybe<EntityReferenceInput>;
  publishSpecification?: InputMaybe<EntityReferenceInput>;
  workflow?: InputMaybe<EntityReferenceInput>;
}>;


export type PublishContentsMutation = { __typename?: 'Mutation', publishContents?: { __typename?: 'PublishContents', contents?: Array<{ __typename?: 'Content', id: string, name: string, state: EntityState, originalDate?: any | null, identifier?: string | null, markdown?: string | null, uri?: any | null, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, format?: string | null, formatName?: string | null, fileExtension?: string | null, fileName?: string | null, fileSize?: any | null, masterUri?: any | null, imageUri?: any | null, textUri?: any | null, audioUri?: any | null, transcriptUri?: any | null, summary?: string | null, customSummary?: string | null, keywords?: Array<string> | null, bullets?: Array<string> | null, headlines?: Array<string> | null, posts?: Array<string> | null, chapters?: Array<string> | null, questions?: Array<string> | null, video?: { __typename?: 'VideoMetadata', width?: number | null, height?: number | null, duration?: any | null, make?: string | null, model?: string | null, software?: string | null, title?: string | null, description?: string | null, keywords?: Array<string | null> | null, author?: string | null } | null, audio?: { __typename?: 'AudioMetadata', keywords?: Array<string | null> | null, author?: string | null, series?: string | null, episode?: string | null, episodeType?: string | null, season?: string | null, publisher?: string | null, copyright?: string | null, genre?: string | null, title?: string | null, description?: string | null, bitrate?: number | null, channels?: number | null, sampleRate?: number | null, bitsPerSample?: number | null, duration?: any | null } | null, image?: { __typename?: 'ImageMetadata', width?: number | null, height?: number | null, resolutionX?: number | null, resolutionY?: number | null, bitsPerComponent?: number | null, components?: number | null, projectionType?: ImageProjectionTypes | null, orientation?: OrientationTypes | null, description?: string | null, make?: string | null, model?: string | null, software?: string | null, lens?: string | null, focalLength?: number | null, exposureTime?: string | null, fNumber?: string | null, iso?: string | null, heading?: number | null, pitch?: number | null } | null, document?: { __typename?: 'DocumentMetadata', title?: string | null, subject?: string | null, summary?: string | null, author?: string | null, publisher?: string | null, description?: string | null, keywords?: Array<string | null> | null, pageCount?: number | null, worksheetCount?: number | null, slideCount?: number | null, wordCount?: number | null, lineCount?: number | null, paragraphCount?: number | null, isEncrypted?: boolean | null, hasDigitalSignature?: boolean | null } | null } | null> | null, details?: { __typename?: 'PublishingDetails', summaries?: Array<string> | null, text?: string | null, textType?: TextTypes | null, summarySpecification?: string | null, publishSpecification?: string | null, summaryTime?: any | null, publishTime?: any | null, contents?: Array<{ __typename?: 'EntityReference', id: string }> | null } | null } | null };

export type PublishTextMutationVariables = Exact<{
  text: Scalars['String']['input'];
  textType?: InputMaybe<TextTypes>;
  connector: ContentPublishingConnectorInput;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  workflow?: InputMaybe<EntityReferenceInput>;
}>;


export type PublishTextMutation = { __typename?: 'Mutation', publishText?: { __typename?: 'PublishContents', contents?: Array<{ __typename?: 'Content', id: string, name: string, state: EntityState, originalDate?: any | null, identifier?: string | null, markdown?: string | null, uri?: any | null, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, format?: string | null, formatName?: string | null, fileExtension?: string | null, fileName?: string | null, fileSize?: any | null, masterUri?: any | null, imageUri?: any | null, textUri?: any | null, audioUri?: any | null, transcriptUri?: any | null, summary?: string | null, customSummary?: string | null, keywords?: Array<string> | null, bullets?: Array<string> | null, headlines?: Array<string> | null, posts?: Array<string> | null, chapters?: Array<string> | null, questions?: Array<string> | null, video?: { __typename?: 'VideoMetadata', width?: number | null, height?: number | null, duration?: any | null, make?: string | null, model?: string | null, software?: string | null, title?: string | null, description?: string | null, keywords?: Array<string | null> | null, author?: string | null } | null, audio?: { __typename?: 'AudioMetadata', keywords?: Array<string | null> | null, author?: string | null, series?: string | null, episode?: string | null, episodeType?: string | null, season?: string | null, publisher?: string | null, copyright?: string | null, genre?: string | null, title?: string | null, description?: string | null, bitrate?: number | null, channels?: number | null, sampleRate?: number | null, bitsPerSample?: number | null, duration?: any | null } | null, image?: { __typename?: 'ImageMetadata', width?: number | null, height?: number | null, resolutionX?: number | null, resolutionY?: number | null, bitsPerComponent?: number | null, components?: number | null, projectionType?: ImageProjectionTypes | null, orientation?: OrientationTypes | null, description?: string | null, make?: string | null, model?: string | null, software?: string | null, lens?: string | null, focalLength?: number | null, exposureTime?: string | null, fNumber?: string | null, iso?: string | null, heading?: number | null, pitch?: number | null } | null, document?: { __typename?: 'DocumentMetadata', title?: string | null, subject?: string | null, summary?: string | null, author?: string | null, publisher?: string | null, description?: string | null, keywords?: Array<string | null> | null, pageCount?: number | null, worksheetCount?: number | null, slideCount?: number | null, wordCount?: number | null, lineCount?: number | null, paragraphCount?: number | null, isEncrypted?: boolean | null, hasDigitalSignature?: boolean | null } | null } | null> | null, details?: { __typename?: 'PublishingDetails', summaries?: Array<string> | null, text?: string | null, textType?: TextTypes | null, summarySpecification?: string | null, publishSpecification?: string | null, summaryTime?: any | null, publishTime?: any | null, contents?: Array<{ __typename?: 'EntityReference', id: string }> | null } | null } | null };

export type QueryContentsQueryVariables = Exact<{
  filter?: InputMaybe<ContentFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type QueryContentsQuery = { __typename?: 'Query', contents?: { __typename?: 'ContentResults', results?: Array<{ __typename?: 'Content', id: string, name: string, creationDate: any, relevance?: number | null, state: EntityState, originalDate?: any | null, finishedDate?: any | null, workflowDuration?: any | null, uri?: any | null, description?: string | null, identifier?: string | null, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, fileName?: string | null, fileSize?: any | null, masterUri?: any | null, imageUri?: any | null, textUri?: any | null, audioUri?: any | null, transcriptUri?: any | null, summary?: string | null, customSummary?: string | null, keywords?: Array<string> | null, bullets?: Array<string> | null, headlines?: Array<string> | null, posts?: Array<string> | null, chapters?: Array<string> | null, questions?: Array<string> | null, error?: string | null, owner: { __typename?: 'Owner', id: string }, address?: { __typename?: 'Address', streetAddress?: string | null, city?: string | null, region?: string | null, country?: string | null, postalCode?: string | null } | null, location?: { __typename?: 'Point', latitude?: number | null, longitude?: number | null } | null, video?: { __typename?: 'VideoMetadata', width?: number | null, height?: number | null, duration?: any | null, make?: string | null, model?: string | null, software?: string | null, title?: string | null, description?: string | null, keywords?: Array<string | null> | null, author?: string | null } | null, audio?: { __typename?: 'AudioMetadata', keywords?: Array<string | null> | null, author?: string | null, series?: string | null, episode?: string | null, episodeType?: string | null, season?: string | null, publisher?: string | null, copyright?: string | null, genre?: string | null, title?: string | null, description?: string | null, bitrate?: number | null, channels?: number | null, sampleRate?: number | null, bitsPerSample?: number | null, duration?: any | null } | null, image?: { __typename?: 'ImageMetadata', width?: number | null, height?: number | null, resolutionX?: number | null, resolutionY?: number | null, bitsPerComponent?: number | null, components?: number | null, projectionType?: ImageProjectionTypes | null, orientation?: OrientationTypes | null, description?: string | null, make?: string | null, model?: string | null, software?: string | null, lens?: string | null, focalLength?: number | null, exposureTime?: string | null, fNumber?: string | null, iso?: string | null, heading?: number | null, pitch?: number | null } | null, document?: { __typename?: 'DocumentMetadata', title?: string | null, subject?: string | null, summary?: string | null, author?: string | null, publisher?: string | null, description?: string | null, keywords?: Array<string | null> | null, pageCount?: number | null, worksheetCount?: number | null, slideCount?: number | null, wordCount?: number | null, lineCount?: number | null, paragraphCount?: number | null, isEncrypted?: boolean | null, hasDigitalSignature?: boolean | null } | null, email?: { __typename?: 'EmailMetadata', identifier?: string | null, threadIdentifier?: string | null, subject?: string | null, labels?: Array<string | null> | null, sensitivity?: MailSensitivity | null, priority?: MailPriority | null, importance?: MailImportance | null, from?: Array<{ __typename?: 'PersonReference', name?: string | null, email?: string | null, givenName?: string | null, familyName?: string | null } | null> | null, to?: Array<{ __typename?: 'PersonReference', name?: string | null, email?: string | null, givenName?: string | null, familyName?: string | null } | null> | null, cc?: Array<{ __typename?: 'PersonReference', name?: string | null, email?: string | null, givenName?: string | null, familyName?: string | null } | null> | null, bcc?: Array<{ __typename?: 'PersonReference', name?: string | null, email?: string | null, givenName?: string | null, familyName?: string | null } | null> | null } | null, issue?: { __typename?: 'IssueMetadata', identifier?: string | null, title?: string | null, project?: string | null, team?: string | null, status?: string | null, priority?: string | null, type?: string | null, labels?: Array<string | null> | null } | null, package?: { __typename?: 'PackageMetadata', fileCount?: number | null, folderCount?: number | null, isEncrypted?: boolean | null } | null, language?: { __typename?: 'LanguageMetadata', languages?: Array<string | null> | null } | null, feed?: { __typename?: 'Feed', id: string, name: string } | null, collections?: Array<{ __typename?: 'Collection', id: string, name: string } | null> | null, links?: Array<{ __typename?: 'LinkReference', uri?: any | null, linkType?: LinkTypes | null }> | null, observations?: Array<{ __typename?: 'Observation', id: string, type: ObservableTypes, relatedType?: ObservableTypes | null, relation?: string | null, state: EntityState, observable: { __typename?: 'NamedEntityReference', id: string, name?: string | null }, related?: { __typename?: 'NamedEntityReference', id: string, name?: string | null } | null, occurrences?: Array<{ __typename?: 'ObservationOccurrence', type?: OccurrenceTypes | null, confidence?: number | null, startTime?: any | null, endTime?: any | null, pageIndex?: number | null, boundingBox?: { __typename?: 'BoundingBox', left?: number | null, top?: number | null, width?: number | null, height?: number | null } | null } | null> | null } | null> | null, workflow?: { __typename?: 'Workflow', id: string, name: string } | null, pages?: Array<{ __typename?: 'TextPage', index?: number | null, text?: string | null, relevance?: number | null, images?: Array<{ __typename?: 'ImageChunk', id?: string | null, mimeType?: string | null, data?: string | null, left?: number | null, right?: number | null, top?: number | null, bottom?: number | null } | null> | null, chunks?: Array<{ __typename?: 'TextChunk', index?: number | null, pageIndex?: number | null, rowIndex?: number | null, columnIndex?: number | null, confidence?: number | null, text?: string | null, role?: TextRoles | null, language?: string | null, relevance?: number | null } | null> | null }> | null, segments?: Array<{ __typename?: 'TextSegment', startTime?: any | null, endTime?: any | null, text?: string | null, relevance?: number | null }> | null, frames?: Array<{ __typename?: 'TextFrame', index?: number | null, description?: string | null, text?: string | null, relevance?: number | null }> | null } | null> | null } | null };

export type QueryContentsFacetsQueryVariables = Exact<{
  filter?: InputMaybe<ContentFilter>;
  facets?: InputMaybe<Array<ContentFacetInput> | ContentFacetInput>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type QueryContentsFacetsQuery = { __typename?: 'Query', contents?: { __typename?: 'ContentResults', facets?: Array<{ __typename?: 'ContentFacet', facet?: ContentFacetTypes | null, count?: any | null, type?: FacetValueTypes | null, value?: string | null, range?: { __typename?: 'StringRange', from?: string | null, to?: string | null } | null, observable?: { __typename?: 'ObservableFacet', type?: ObservableTypes | null, observable?: { __typename?: 'NamedEntityReference', id: string, name?: string | null } | null } | null } | null> | null } | null };

export type QueryContentsGraphQueryVariables = Exact<{
  filter?: InputMaybe<ContentFilter>;
  graph?: InputMaybe<ContentGraphInput>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type QueryContentsGraphQuery = { __typename?: 'Query', contents?: { __typename?: 'ContentResults', graph?: { __typename?: 'Graph', nodes?: Array<{ __typename?: 'GraphNode', id: string, name: string, type: EntityTypes, metadata?: string | null } | null> | null, edges?: Array<{ __typename?: 'GraphEdge', from: string, to: string, relation?: string | null } | null> | null } | null } | null };

export type ScreenshotPageMutationVariables = Exact<{
  uri: Scalars['URL']['input'];
  maximumHeight?: InputMaybe<Scalars['Int']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  workflow?: InputMaybe<EntityReferenceInput>;
  collections?: InputMaybe<Array<EntityReferenceInput> | EntityReferenceInput>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type ScreenshotPageMutation = { __typename?: 'Mutation', screenshotPage?: { __typename?: 'Content', id: string, name: string, state: EntityState, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, uri?: any | null, collections?: Array<{ __typename?: 'Collection', id: string, name: string } | null> | null, observations?: Array<{ __typename?: 'Observation', id: string, type: ObservableTypes, relatedType?: ObservableTypes | null, relation?: string | null, state: EntityState, observable: { __typename?: 'NamedEntityReference', id: string, name?: string | null }, related?: { __typename?: 'NamedEntityReference', id: string, name?: string | null } | null, occurrences?: Array<{ __typename?: 'ObservationOccurrence', type?: OccurrenceTypes | null, confidence?: number | null, startTime?: any | null, endTime?: any | null, pageIndex?: number | null, boundingBox?: { __typename?: 'BoundingBox', left?: number | null, top?: number | null, width?: number | null, height?: number | null } | null } | null> | null } | null> | null } | null };

export type SummarizeContentsMutationVariables = Exact<{
  summarizations: Array<SummarizationStrategyInput> | SummarizationStrategyInput;
  filter?: InputMaybe<ContentFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type SummarizeContentsMutation = { __typename?: 'Mutation', summarizeContents?: Array<{ __typename?: 'PromptSummarization', type: SummarizationTypes, error?: string | null, specification?: { __typename?: 'EntityReference', id: string } | null, content?: { __typename?: 'EntityReference', id: string } | null, items?: Array<{ __typename?: 'Summarized', text?: string | null, tokens: number, summarizationTime?: any | null }> | null } | null> | null };

export type SummarizeTextMutationVariables = Exact<{
  summarization: SummarizationStrategyInput;
  text: Scalars['String']['input'];
  textType?: InputMaybe<TextTypes>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type SummarizeTextMutation = { __typename?: 'Mutation', summarizeText?: { __typename?: 'PromptSummarization', type: SummarizationTypes, error?: string | null, specification?: { __typename?: 'EntityReference', id: string } | null, content?: { __typename?: 'EntityReference', id: string } | null, items?: Array<{ __typename?: 'Summarized', text?: string | null, tokens: number, summarizationTime?: any | null }> | null } | null };

export type UpdateContentMutationVariables = Exact<{
  content: ContentUpdateInput;
}>;


export type UpdateContentMutation = { __typename?: 'Mutation', updateContent?: { __typename?: 'Content', id: string, name: string, state: EntityState, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, uri?: any | null, collections?: Array<{ __typename?: 'Collection', id: string, name: string } | null> | null, observations?: Array<{ __typename?: 'Observation', id: string, type: ObservableTypes, relatedType?: ObservableTypes | null, relation?: string | null, state: EntityState, observable: { __typename?: 'NamedEntityReference', id: string, name?: string | null }, related?: { __typename?: 'NamedEntityReference', id: string, name?: string | null } | null, occurrences?: Array<{ __typename?: 'ObservationOccurrence', type?: OccurrenceTypes | null, confidence?: number | null, startTime?: any | null, endTime?: any | null, pageIndex?: number | null, boundingBox?: { __typename?: 'BoundingBox', left?: number | null, top?: number | null, width?: number | null, height?: number | null } | null } | null> | null } | null> | null } | null };

export type AskGraphlitMutationVariables = Exact<{
  prompt: Scalars['String']['input'];
  type?: InputMaybe<SdkTypes>;
  id?: InputMaybe<Scalars['ID']['input']>;
  specification?: InputMaybe<EntityReferenceInput>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type AskGraphlitMutation = { __typename?: 'Mutation', askGraphlit?: { __typename?: 'AskGraphlit', messageCount?: number | null, conversation?: { __typename?: 'EntityReference', id: string } | null, message?: { __typename?: 'ConversationMessage', role: ConversationRoleTypes, author?: string | null, message?: string | null, tokens?: number | null, throughput?: number | null, completionTime?: any | null, timestamp?: any | null, modelService?: ModelServiceTypes | null, model?: string | null, data?: string | null, mimeType?: string | null, citations?: Array<{ __typename?: 'ConversationCitation', index?: number | null, text: string, startTime?: any | null, endTime?: any | null, pageNumber?: number | null, frameNumber?: number | null, content?: { __typename?: 'Content', id: string, name: string, state: EntityState, originalDate?: any | null, identifier?: string | null, uri?: any | null, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, format?: string | null, formatName?: string | null, fileExtension?: string | null, fileName?: string | null, fileSize?: any | null, masterUri?: any | null, imageUri?: any | null, textUri?: any | null, audioUri?: any | null, transcriptUri?: any | null, summary?: string | null, customSummary?: string | null, keywords?: Array<string> | null, bullets?: Array<string> | null, headlines?: Array<string> | null, posts?: Array<string> | null, chapters?: Array<string> | null, questions?: Array<string> | null, video?: { __typename?: 'VideoMetadata', width?: number | null, height?: number | null, duration?: any | null, make?: string | null, model?: string | null, software?: string | null, title?: string | null, description?: string | null, keywords?: Array<string | null> | null, author?: string | null } | null, audio?: { __typename?: 'AudioMetadata', keywords?: Array<string | null> | null, author?: string | null, series?: string | null, episode?: string | null, episodeType?: string | null, season?: string | null, publisher?: string | null, copyright?: string | null, genre?: string | null, title?: string | null, description?: string | null, bitrate?: number | null, channels?: number | null, sampleRate?: number | null, bitsPerSample?: number | null, duration?: any | null } | null, image?: { __typename?: 'ImageMetadata', width?: number | null, height?: number | null, resolutionX?: number | null, resolutionY?: number | null, bitsPerComponent?: number | null, components?: number | null, projectionType?: ImageProjectionTypes | null, orientation?: OrientationTypes | null, description?: string | null, make?: string | null, model?: string | null, software?: string | null, lens?: string | null, focalLength?: number | null, exposureTime?: string | null, fNumber?: string | null, iso?: string | null, heading?: number | null, pitch?: number | null } | null, document?: { __typename?: 'DocumentMetadata', title?: string | null, subject?: string | null, summary?: string | null, author?: string | null, publisher?: string | null, description?: string | null, keywords?: Array<string | null> | null, pageCount?: number | null, worksheetCount?: number | null, slideCount?: number | null, wordCount?: number | null, lineCount?: number | null, paragraphCount?: number | null, isEncrypted?: boolean | null, hasDigitalSignature?: boolean | null } | null } | null } | null> | null, toolCalls?: Array<{ __typename?: 'ConversationToolCall', id: string, name: string, arguments: string } | null> | null } | null } | null };

export type ClearConversationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ClearConversationMutation = { __typename?: 'Mutation', clearConversation?: { __typename?: 'Conversation', id: string, name: string, state: EntityState, type?: ConversationTypes | null } | null };

export type CloseConversationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type CloseConversationMutation = { __typename?: 'Mutation', closeConversation?: { __typename?: 'Conversation', id: string, name: string, state: EntityState, type?: ConversationTypes | null } | null };

export type CompleteConversationMutationVariables = Exact<{
  completion: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CompleteConversationMutation = { __typename?: 'Mutation', completeConversation?: { __typename?: 'PromptConversation', messageCount?: number | null, conversation?: { __typename?: 'EntityReference', id: string } | null, message?: { __typename?: 'ConversationMessage', role: ConversationRoleTypes, author?: string | null, message?: string | null, tokens?: number | null, throughput?: number | null, completionTime?: any | null, timestamp?: any | null, modelService?: ModelServiceTypes | null, model?: string | null, data?: string | null, mimeType?: string | null, citations?: Array<{ __typename?: 'ConversationCitation', index?: number | null, text: string, startTime?: any | null, endTime?: any | null, pageNumber?: number | null, frameNumber?: number | null, content?: { __typename?: 'Content', id: string, name: string, state: EntityState, originalDate?: any | null, identifier?: string | null, uri?: any | null, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, format?: string | null, formatName?: string | null, fileExtension?: string | null, fileName?: string | null, fileSize?: any | null, masterUri?: any | null, imageUri?: any | null, textUri?: any | null, audioUri?: any | null, transcriptUri?: any | null, summary?: string | null, customSummary?: string | null, keywords?: Array<string> | null, bullets?: Array<string> | null, headlines?: Array<string> | null, posts?: Array<string> | null, chapters?: Array<string> | null, questions?: Array<string> | null, video?: { __typename?: 'VideoMetadata', width?: number | null, height?: number | null, duration?: any | null, make?: string | null, model?: string | null, software?: string | null, title?: string | null, description?: string | null, keywords?: Array<string | null> | null, author?: string | null } | null, audio?: { __typename?: 'AudioMetadata', keywords?: Array<string | null> | null, author?: string | null, series?: string | null, episode?: string | null, episodeType?: string | null, season?: string | null, publisher?: string | null, copyright?: string | null, genre?: string | null, title?: string | null, description?: string | null, bitrate?: number | null, channels?: number | null, sampleRate?: number | null, bitsPerSample?: number | null, duration?: any | null } | null, image?: { __typename?: 'ImageMetadata', width?: number | null, height?: number | null, resolutionX?: number | null, resolutionY?: number | null, bitsPerComponent?: number | null, components?: number | null, projectionType?: ImageProjectionTypes | null, orientation?: OrientationTypes | null, description?: string | null, make?: string | null, model?: string | null, software?: string | null, lens?: string | null, focalLength?: number | null, exposureTime?: string | null, fNumber?: string | null, iso?: string | null, heading?: number | null, pitch?: number | null } | null, document?: { __typename?: 'DocumentMetadata', title?: string | null, subject?: string | null, summary?: string | null, author?: string | null, publisher?: string | null, description?: string | null, keywords?: Array<string | null> | null, pageCount?: number | null, worksheetCount?: number | null, slideCount?: number | null, wordCount?: number | null, lineCount?: number | null, paragraphCount?: number | null, isEncrypted?: boolean | null, hasDigitalSignature?: boolean | null } | null } | null } | null> | null, toolCalls?: Array<{ __typename?: 'ConversationToolCall', id: string, name: string, arguments: string } | null> | null } | null, facets?: Array<{ __typename?: 'ContentFacet', type?: FacetValueTypes | null, value?: string | null, count?: any | null, facet?: ContentFacetTypes | null, range?: { __typename?: 'StringRange', from?: string | null, to?: string | null } | null, observable?: { __typename?: 'ObservableFacet', type?: ObservableTypes | null, observable?: { __typename?: 'NamedEntityReference', id: string, name?: string | null } | null } | null } | null> | null, graph?: { __typename?: 'Graph', nodes?: Array<{ __typename?: 'GraphNode', id: string, name: string, type: EntityTypes, metadata?: string | null } | null> | null, edges?: Array<{ __typename?: 'GraphEdge', from: string, to: string, relation?: string | null } | null> | null } | null, details?: { __typename?: 'ConversationDetails', modelService?: ModelServiceTypes | null, model?: string | null, supportsToolCalling?: boolean | null, sourceCount?: number | null, observableCount?: number | null, toolCount?: number | null, renderedSourceCount?: number | null, renderedObservableCount?: number | null, renderedToolCount?: number | null, rankedSourceCount?: number | null, rankedObservableCount?: number | null, rankedToolCount?: number | null, tokenLimit?: number | null, completionTokenLimit?: number | null, sources?: string | null, formattedSources?: string | null, formattedObservables?: string | null, formattedInstructions?: string | null, formattedTools?: string | null, specification?: string | null, messages?: Array<{ __typename?: 'ConversationMessage', role: ConversationRoleTypes, author?: string | null, message?: string | null, tokens?: number | null, throughput?: number | null, completionTime?: any | null, timestamp?: any | null, modelService?: ModelServiceTypes | null, model?: string | null, data?: string | null, mimeType?: string | null, citations?: Array<{ __typename?: 'ConversationCitation', index?: number | null, text: string, startTime?: any | null, endTime?: any | null, pageNumber?: number | null, frameNumber?: number | null, content?: { __typename?: 'Content', id: string, name: string, state: EntityState, originalDate?: any | null, identifier?: string | null, uri?: any | null, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, format?: string | null, formatName?: string | null, fileExtension?: string | null, fileName?: string | null, fileSize?: any | null, masterUri?: any | null, imageUri?: any | null, textUri?: any | null, audioUri?: any | null, transcriptUri?: any | null, summary?: string | null, customSummary?: string | null, keywords?: Array<string> | null, bullets?: Array<string> | null, headlines?: Array<string> | null, posts?: Array<string> | null, chapters?: Array<string> | null, questions?: Array<string> | null, video?: { __typename?: 'VideoMetadata', width?: number | null, height?: number | null, duration?: any | null, make?: string | null, model?: string | null, software?: string | null, title?: string | null, description?: string | null, keywords?: Array<string | null> | null, author?: string | null } | null, audio?: { __typename?: 'AudioMetadata', keywords?: Array<string | null> | null, author?: string | null, series?: string | null, episode?: string | null, episodeType?: string | null, season?: string | null, publisher?: string | null, copyright?: string | null, genre?: string | null, title?: string | null, description?: string | null, bitrate?: number | null, channels?: number | null, sampleRate?: number | null, bitsPerSample?: number | null, duration?: any | null } | null, image?: { __typename?: 'ImageMetadata', width?: number | null, height?: number | null, resolutionX?: number | null, resolutionY?: number | null, bitsPerComponent?: number | null, components?: number | null, projectionType?: ImageProjectionTypes | null, orientation?: OrientationTypes | null, description?: string | null, make?: string | null, model?: string | null, software?: string | null, lens?: string | null, focalLength?: number | null, exposureTime?: string | null, fNumber?: string | null, iso?: string | null, heading?: number | null, pitch?: number | null } | null, document?: { __typename?: 'DocumentMetadata', title?: string | null, subject?: string | null, summary?: string | null, author?: string | null, publisher?: string | null, description?: string | null, keywords?: Array<string | null> | null, pageCount?: number | null, worksheetCount?: number | null, slideCount?: number | null, wordCount?: number | null, lineCount?: number | null, paragraphCount?: number | null, isEncrypted?: boolean | null, hasDigitalSignature?: boolean | null } | null } | null } | null> | null, toolCalls?: Array<{ __typename?: 'ConversationToolCall', id: string, name: string, arguments: string } | null> | null } | null> | null } | null } | null };

export type ContinueConversationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  responses: Array<ConversationToolResponseInput> | ConversationToolResponseInput;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type ContinueConversationMutation = { __typename?: 'Mutation', continueConversation?: { __typename?: 'PromptConversation', messageCount?: number | null, conversation?: { __typename?: 'EntityReference', id: string } | null, message?: { __typename?: 'ConversationMessage', role: ConversationRoleTypes, author?: string | null, message?: string | null, tokens?: number | null, throughput?: number | null, completionTime?: any | null, timestamp?: any | null, modelService?: ModelServiceTypes | null, model?: string | null, data?: string | null, mimeType?: string | null, citations?: Array<{ __typename?: 'ConversationCitation', index?: number | null, text: string, startTime?: any | null, endTime?: any | null, pageNumber?: number | null, frameNumber?: number | null, content?: { __typename?: 'Content', id: string, name: string, state: EntityState, originalDate?: any | null, identifier?: string | null, uri?: any | null, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, format?: string | null, formatName?: string | null, fileExtension?: string | null, fileName?: string | null, fileSize?: any | null, masterUri?: any | null, imageUri?: any | null, textUri?: any | null, audioUri?: any | null, transcriptUri?: any | null, summary?: string | null, customSummary?: string | null, keywords?: Array<string> | null, bullets?: Array<string> | null, headlines?: Array<string> | null, posts?: Array<string> | null, chapters?: Array<string> | null, questions?: Array<string> | null, video?: { __typename?: 'VideoMetadata', width?: number | null, height?: number | null, duration?: any | null, make?: string | null, model?: string | null, software?: string | null, title?: string | null, description?: string | null, keywords?: Array<string | null> | null, author?: string | null } | null, audio?: { __typename?: 'AudioMetadata', keywords?: Array<string | null> | null, author?: string | null, series?: string | null, episode?: string | null, episodeType?: string | null, season?: string | null, publisher?: string | null, copyright?: string | null, genre?: string | null, title?: string | null, description?: string | null, bitrate?: number | null, channels?: number | null, sampleRate?: number | null, bitsPerSample?: number | null, duration?: any | null } | null, image?: { __typename?: 'ImageMetadata', width?: number | null, height?: number | null, resolutionX?: number | null, resolutionY?: number | null, bitsPerComponent?: number | null, components?: number | null, projectionType?: ImageProjectionTypes | null, orientation?: OrientationTypes | null, description?: string | null, make?: string | null, model?: string | null, software?: string | null, lens?: string | null, focalLength?: number | null, exposureTime?: string | null, fNumber?: string | null, iso?: string | null, heading?: number | null, pitch?: number | null } | null, document?: { __typename?: 'DocumentMetadata', title?: string | null, subject?: string | null, summary?: string | null, author?: string | null, publisher?: string | null, description?: string | null, keywords?: Array<string | null> | null, pageCount?: number | null, worksheetCount?: number | null, slideCount?: number | null, wordCount?: number | null, lineCount?: number | null, paragraphCount?: number | null, isEncrypted?: boolean | null, hasDigitalSignature?: boolean | null } | null } | null } | null> | null, toolCalls?: Array<{ __typename?: 'ConversationToolCall', id: string, name: string, arguments: string } | null> | null } | null, facets?: Array<{ __typename?: 'ContentFacet', type?: FacetValueTypes | null, value?: string | null, count?: any | null, facet?: ContentFacetTypes | null, range?: { __typename?: 'StringRange', from?: string | null, to?: string | null } | null, observable?: { __typename?: 'ObservableFacet', type?: ObservableTypes | null, observable?: { __typename?: 'NamedEntityReference', id: string, name?: string | null } | null } | null } | null> | null, graph?: { __typename?: 'Graph', nodes?: Array<{ __typename?: 'GraphNode', id: string, name: string, type: EntityTypes, metadata?: string | null } | null> | null, edges?: Array<{ __typename?: 'GraphEdge', from: string, to: string, relation?: string | null } | null> | null } | null, details?: { __typename?: 'ConversationDetails', modelService?: ModelServiceTypes | null, model?: string | null, supportsToolCalling?: boolean | null, sourceCount?: number | null, observableCount?: number | null, toolCount?: number | null, renderedSourceCount?: number | null, renderedObservableCount?: number | null, renderedToolCount?: number | null, rankedSourceCount?: number | null, rankedObservableCount?: number | null, rankedToolCount?: number | null, tokenLimit?: number | null, completionTokenLimit?: number | null, sources?: string | null, formattedSources?: string | null, formattedObservables?: string | null, formattedInstructions?: string | null, formattedTools?: string | null, specification?: string | null, messages?: Array<{ __typename?: 'ConversationMessage', role: ConversationRoleTypes, author?: string | null, message?: string | null, tokens?: number | null, throughput?: number | null, completionTime?: any | null, timestamp?: any | null, modelService?: ModelServiceTypes | null, model?: string | null, data?: string | null, mimeType?: string | null, citations?: Array<{ __typename?: 'ConversationCitation', index?: number | null, text: string, startTime?: any | null, endTime?: any | null, pageNumber?: number | null, frameNumber?: number | null, content?: { __typename?: 'Content', id: string, name: string, state: EntityState, originalDate?: any | null, identifier?: string | null, uri?: any | null, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, format?: string | null, formatName?: string | null, fileExtension?: string | null, fileName?: string | null, fileSize?: any | null, masterUri?: any | null, imageUri?: any | null, textUri?: any | null, audioUri?: any | null, transcriptUri?: any | null, summary?: string | null, customSummary?: string | null, keywords?: Array<string> | null, bullets?: Array<string> | null, headlines?: Array<string> | null, posts?: Array<string> | null, chapters?: Array<string> | null, questions?: Array<string> | null, video?: { __typename?: 'VideoMetadata', width?: number | null, height?: number | null, duration?: any | null, make?: string | null, model?: string | null, software?: string | null, title?: string | null, description?: string | null, keywords?: Array<string | null> | null, author?: string | null } | null, audio?: { __typename?: 'AudioMetadata', keywords?: Array<string | null> | null, author?: string | null, series?: string | null, episode?: string | null, episodeType?: string | null, season?: string | null, publisher?: string | null, copyright?: string | null, genre?: string | null, title?: string | null, description?: string | null, bitrate?: number | null, channels?: number | null, sampleRate?: number | null, bitsPerSample?: number | null, duration?: any | null } | null, image?: { __typename?: 'ImageMetadata', width?: number | null, height?: number | null, resolutionX?: number | null, resolutionY?: number | null, bitsPerComponent?: number | null, components?: number | null, projectionType?: ImageProjectionTypes | null, orientation?: OrientationTypes | null, description?: string | null, make?: string | null, model?: string | null, software?: string | null, lens?: string | null, focalLength?: number | null, exposureTime?: string | null, fNumber?: string | null, iso?: string | null, heading?: number | null, pitch?: number | null } | null, document?: { __typename?: 'DocumentMetadata', title?: string | null, subject?: string | null, summary?: string | null, author?: string | null, publisher?: string | null, description?: string | null, keywords?: Array<string | null> | null, pageCount?: number | null, worksheetCount?: number | null, slideCount?: number | null, wordCount?: number | null, lineCount?: number | null, paragraphCount?: number | null, isEncrypted?: boolean | null, hasDigitalSignature?: boolean | null } | null } | null } | null> | null, toolCalls?: Array<{ __typename?: 'ConversationToolCall', id: string, name: string, arguments: string } | null> | null } | null> | null } | null } | null };

export type CountConversationsQueryVariables = Exact<{
  filter?: InputMaybe<ConversationFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CountConversationsQuery = { __typename?: 'Query', countConversations?: { __typename?: 'CountResult', count?: any | null } | null };

export type CreateConversationMutationVariables = Exact<{
  conversation: ConversationInput;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateConversationMutation = { __typename?: 'Mutation', createConversation?: { __typename?: 'Conversation', id: string, name: string, state: EntityState, type?: ConversationTypes | null } | null };

export type DeleteAllConversationsMutationVariables = Exact<{
  filter?: InputMaybe<ConversationFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type DeleteAllConversationsMutation = { __typename?: 'Mutation', deleteAllConversations?: Array<{ __typename?: 'Conversation', id: string, state: EntityState } | null> | null };

export type DeleteConversationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteConversationMutation = { __typename?: 'Mutation', deleteConversation?: { __typename?: 'Conversation', id: string, state: EntityState } | null };

export type DeleteConversationsMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type DeleteConversationsMutation = { __typename?: 'Mutation', deleteConversations?: Array<{ __typename?: 'Conversation', id: string, state: EntityState } | null> | null };

export type FormatConversationMutationVariables = Exact<{
  prompt: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  specification?: InputMaybe<EntityReferenceInput>;
  includeDetails?: InputMaybe<Scalars['Boolean']['input']>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type FormatConversationMutation = { __typename?: 'Mutation', formatConversation?: { __typename?: 'PromptConversation', messageCount?: number | null, conversation?: { __typename?: 'EntityReference', id: string } | null, message?: { __typename?: 'ConversationMessage', role: ConversationRoleTypes, author?: string | null, message?: string | null, tokens?: number | null, throughput?: number | null, completionTime?: any | null, timestamp?: any | null, modelService?: ModelServiceTypes | null, model?: string | null, data?: string | null, mimeType?: string | null, citations?: Array<{ __typename?: 'ConversationCitation', index?: number | null, text: string, startTime?: any | null, endTime?: any | null, pageNumber?: number | null, frameNumber?: number | null, content?: { __typename?: 'Content', id: string, name: string, state: EntityState, originalDate?: any | null, identifier?: string | null, uri?: any | null, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, format?: string | null, formatName?: string | null, fileExtension?: string | null, fileName?: string | null, fileSize?: any | null, masterUri?: any | null, imageUri?: any | null, textUri?: any | null, audioUri?: any | null, transcriptUri?: any | null, summary?: string | null, customSummary?: string | null, keywords?: Array<string> | null, bullets?: Array<string> | null, headlines?: Array<string> | null, posts?: Array<string> | null, chapters?: Array<string> | null, questions?: Array<string> | null, video?: { __typename?: 'VideoMetadata', width?: number | null, height?: number | null, duration?: any | null, make?: string | null, model?: string | null, software?: string | null, title?: string | null, description?: string | null, keywords?: Array<string | null> | null, author?: string | null } | null, audio?: { __typename?: 'AudioMetadata', keywords?: Array<string | null> | null, author?: string | null, series?: string | null, episode?: string | null, episodeType?: string | null, season?: string | null, publisher?: string | null, copyright?: string | null, genre?: string | null, title?: string | null, description?: string | null, bitrate?: number | null, channels?: number | null, sampleRate?: number | null, bitsPerSample?: number | null, duration?: any | null } | null, image?: { __typename?: 'ImageMetadata', width?: number | null, height?: number | null, resolutionX?: number | null, resolutionY?: number | null, bitsPerComponent?: number | null, components?: number | null, projectionType?: ImageProjectionTypes | null, orientation?: OrientationTypes | null, description?: string | null, make?: string | null, model?: string | null, software?: string | null, lens?: string | null, focalLength?: number | null, exposureTime?: string | null, fNumber?: string | null, iso?: string | null, heading?: number | null, pitch?: number | null } | null, document?: { __typename?: 'DocumentMetadata', title?: string | null, subject?: string | null, summary?: string | null, author?: string | null, publisher?: string | null, description?: string | null, keywords?: Array<string | null> | null, pageCount?: number | null, worksheetCount?: number | null, slideCount?: number | null, wordCount?: number | null, lineCount?: number | null, paragraphCount?: number | null, isEncrypted?: boolean | null, hasDigitalSignature?: boolean | null } | null } | null } | null> | null, toolCalls?: Array<{ __typename?: 'ConversationToolCall', id: string, name: string, arguments: string } | null> | null } | null, facets?: Array<{ __typename?: 'ContentFacet', type?: FacetValueTypes | null, value?: string | null, count?: any | null, facet?: ContentFacetTypes | null, range?: { __typename?: 'StringRange', from?: string | null, to?: string | null } | null, observable?: { __typename?: 'ObservableFacet', type?: ObservableTypes | null, observable?: { __typename?: 'NamedEntityReference', id: string, name?: string | null } | null } | null } | null> | null, graph?: { __typename?: 'Graph', nodes?: Array<{ __typename?: 'GraphNode', id: string, name: string, type: EntityTypes, metadata?: string | null } | null> | null, edges?: Array<{ __typename?: 'GraphEdge', from: string, to: string, relation?: string | null } | null> | null } | null, details?: { __typename?: 'ConversationDetails', modelService?: ModelServiceTypes | null, model?: string | null, supportsToolCalling?: boolean | null, sourceCount?: number | null, observableCount?: number | null, toolCount?: number | null, renderedSourceCount?: number | null, renderedObservableCount?: number | null, renderedToolCount?: number | null, rankedSourceCount?: number | null, rankedObservableCount?: number | null, rankedToolCount?: number | null, tokenLimit?: number | null, completionTokenLimit?: number | null, sources?: string | null, formattedSources?: string | null, formattedObservables?: string | null, formattedInstructions?: string | null, formattedTools?: string | null, specification?: string | null, messages?: Array<{ __typename?: 'ConversationMessage', role: ConversationRoleTypes, author?: string | null, message?: string | null, tokens?: number | null, throughput?: number | null, completionTime?: any | null, timestamp?: any | null, modelService?: ModelServiceTypes | null, model?: string | null, data?: string | null, mimeType?: string | null, citations?: Array<{ __typename?: 'ConversationCitation', index?: number | null, text: string, startTime?: any | null, endTime?: any | null, pageNumber?: number | null, frameNumber?: number | null, content?: { __typename?: 'Content', id: string, name: string, state: EntityState, originalDate?: any | null, identifier?: string | null, uri?: any | null, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, format?: string | null, formatName?: string | null, fileExtension?: string | null, fileName?: string | null, fileSize?: any | null, masterUri?: any | null, imageUri?: any | null, textUri?: any | null, audioUri?: any | null, transcriptUri?: any | null, summary?: string | null, customSummary?: string | null, keywords?: Array<string> | null, bullets?: Array<string> | null, headlines?: Array<string> | null, posts?: Array<string> | null, chapters?: Array<string> | null, questions?: Array<string> | null, video?: { __typename?: 'VideoMetadata', width?: number | null, height?: number | null, duration?: any | null, make?: string | null, model?: string | null, software?: string | null, title?: string | null, description?: string | null, keywords?: Array<string | null> | null, author?: string | null } | null, audio?: { __typename?: 'AudioMetadata', keywords?: Array<string | null> | null, author?: string | null, series?: string | null, episode?: string | null, episodeType?: string | null, season?: string | null, publisher?: string | null, copyright?: string | null, genre?: string | null, title?: string | null, description?: string | null, bitrate?: number | null, channels?: number | null, sampleRate?: number | null, bitsPerSample?: number | null, duration?: any | null } | null, image?: { __typename?: 'ImageMetadata', width?: number | null, height?: number | null, resolutionX?: number | null, resolutionY?: number | null, bitsPerComponent?: number | null, components?: number | null, projectionType?: ImageProjectionTypes | null, orientation?: OrientationTypes | null, description?: string | null, make?: string | null, model?: string | null, software?: string | null, lens?: string | null, focalLength?: number | null, exposureTime?: string | null, fNumber?: string | null, iso?: string | null, heading?: number | null, pitch?: number | null } | null, document?: { __typename?: 'DocumentMetadata', title?: string | null, subject?: string | null, summary?: string | null, author?: string | null, publisher?: string | null, description?: string | null, keywords?: Array<string | null> | null, pageCount?: number | null, worksheetCount?: number | null, slideCount?: number | null, wordCount?: number | null, lineCount?: number | null, paragraphCount?: number | null, isEncrypted?: boolean | null, hasDigitalSignature?: boolean | null } | null } | null } | null> | null, toolCalls?: Array<{ __typename?: 'ConversationToolCall', id: string, name: string, arguments: string } | null> | null } | null> | null } | null } | null };

export type GetConversationQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetConversationQuery = { __typename?: 'Query', conversation?: { __typename?: 'Conversation', id: string, name: string, creationDate: any, relevance?: number | null, state: EntityState, correlationId?: string | null, type?: ConversationTypes | null, owner: { __typename?: 'Owner', id: string }, messages?: Array<{ __typename?: 'ConversationMessage', role: ConversationRoleTypes, author?: string | null, message?: string | null, tokens?: number | null, throughput?: number | null, completionTime?: any | null, timestamp?: any | null, modelService?: ModelServiceTypes | null, model?: string | null, data?: string | null, mimeType?: string | null, citations?: Array<{ __typename?: 'ConversationCitation', index?: number | null, text: string, startTime?: any | null, endTime?: any | null, pageNumber?: number | null, frameNumber?: number | null, content?: { __typename?: 'Content', id: string, name: string, state: EntityState, originalDate?: any | null, identifier?: string | null, uri?: any | null, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, format?: string | null, formatName?: string | null, fileExtension?: string | null, fileName?: string | null, fileSize?: any | null, masterUri?: any | null, imageUri?: any | null, textUri?: any | null, audioUri?: any | null, transcriptUri?: any | null, summary?: string | null, customSummary?: string | null, keywords?: Array<string> | null, bullets?: Array<string> | null, headlines?: Array<string> | null, posts?: Array<string> | null, chapters?: Array<string> | null, questions?: Array<string> | null, video?: { __typename?: 'VideoMetadata', width?: number | null, height?: number | null, duration?: any | null, make?: string | null, model?: string | null, software?: string | null, title?: string | null, description?: string | null, keywords?: Array<string | null> | null, author?: string | null } | null, audio?: { __typename?: 'AudioMetadata', keywords?: Array<string | null> | null, author?: string | null, series?: string | null, episode?: string | null, episodeType?: string | null, season?: string | null, publisher?: string | null, copyright?: string | null, genre?: string | null, title?: string | null, description?: string | null, bitrate?: number | null, channels?: number | null, sampleRate?: number | null, bitsPerSample?: number | null, duration?: any | null } | null, image?: { __typename?: 'ImageMetadata', width?: number | null, height?: number | null, resolutionX?: number | null, resolutionY?: number | null, bitsPerComponent?: number | null, components?: number | null, projectionType?: ImageProjectionTypes | null, orientation?: OrientationTypes | null, description?: string | null, make?: string | null, model?: string | null, software?: string | null, lens?: string | null, focalLength?: number | null, exposureTime?: string | null, fNumber?: string | null, iso?: string | null, heading?: number | null, pitch?: number | null } | null, document?: { __typename?: 'DocumentMetadata', title?: string | null, subject?: string | null, summary?: string | null, author?: string | null, publisher?: string | null, description?: string | null, keywords?: Array<string | null> | null, pageCount?: number | null, worksheetCount?: number | null, slideCount?: number | null, wordCount?: number | null, lineCount?: number | null, paragraphCount?: number | null, isEncrypted?: boolean | null, hasDigitalSignature?: boolean | null } | null } | null } | null> | null, toolCalls?: Array<{ __typename?: 'ConversationToolCall', id: string, name: string, arguments: string } | null> | null } | null> | null, specification?: { __typename?: 'Specification', id: string, name: string } | null, fallbacks?: Array<{ __typename?: 'Specification', id: string, name: string } | null> | null, filter?: { __typename?: 'ContentCriteria', inLast?: any | null, createdInLast?: any | null, types?: Array<ContentTypes> | null, fileTypes?: Array<FileTypes | null> | null, formats?: Array<string | null> | null, fileExtensions?: Array<string> | null, dateRange?: { __typename?: 'DateRange', from?: any | null, to?: any | null } | null, creationDateRange?: { __typename?: 'DateRange', from?: any | null, to?: any | null } | null, similarContents?: Array<{ __typename?: 'EntityReference', id: string }> | null, contents?: Array<{ __typename?: 'EntityReference', id: string }> | null, feeds?: Array<{ __typename?: 'EntityReference', id: string }> | null, workflows?: Array<{ __typename?: 'EntityReference', id: string }> | null, collections?: Array<{ __typename?: 'EntityReference', id: string }> | null, users?: Array<{ __typename?: 'EntityReference', id: string }> | null, observations?: Array<{ __typename?: 'ObservationCriteria', type: ObservableTypes, states?: Array<EntityState | null> | null, observable: { __typename?: 'EntityReference', id: string } }> | null, or?: Array<{ __typename?: 'ContentCriteriaLevel', feeds?: Array<{ __typename?: 'EntityReference', id: string }> | null, workflows?: Array<{ __typename?: 'EntityReference', id: string }> | null, collections?: Array<{ __typename?: 'EntityReference', id: string }> | null, users?: Array<{ __typename?: 'EntityReference', id: string }> | null, observations?: Array<{ __typename?: 'ObservationCriteria', type: ObservableTypes, states?: Array<EntityState | null> | null, observable: { __typename?: 'EntityReference', id: string } }> | null }> | null, and?: Array<{ __typename?: 'ContentCriteriaLevel', feeds?: Array<{ __typename?: 'EntityReference', id: string }> | null, workflows?: Array<{ __typename?: 'EntityReference', id: string }> | null, collections?: Array<{ __typename?: 'EntityReference', id: string }> | null, users?: Array<{ __typename?: 'EntityReference', id: string }> | null, observations?: Array<{ __typename?: 'ObservationCriteria', type: ObservableTypes, states?: Array<EntityState | null> | null, observable: { __typename?: 'EntityReference', id: string } }> | null }> | null } | null, augmentedFilter?: { __typename?: 'ContentCriteria', inLast?: any | null, createdInLast?: any | null, types?: Array<ContentTypes> | null, fileTypes?: Array<FileTypes | null> | null, formats?: Array<string | null> | null, fileExtensions?: Array<string> | null, dateRange?: { __typename?: 'DateRange', from?: any | null, to?: any | null } | null, creationDateRange?: { __typename?: 'DateRange', from?: any | null, to?: any | null } | null, similarContents?: Array<{ __typename?: 'EntityReference', id: string }> | null, contents?: Array<{ __typename?: 'EntityReference', id: string }> | null, feeds?: Array<{ __typename?: 'EntityReference', id: string }> | null, workflows?: Array<{ __typename?: 'EntityReference', id: string }> | null, collections?: Array<{ __typename?: 'EntityReference', id: string }> | null, users?: Array<{ __typename?: 'EntityReference', id: string }> | null, observations?: Array<{ __typename?: 'ObservationCriteria', type: ObservableTypes, states?: Array<EntityState | null> | null, observable: { __typename?: 'EntityReference', id: string } }> | null, or?: Array<{ __typename?: 'ContentCriteriaLevel', feeds?: Array<{ __typename?: 'EntityReference', id: string }> | null, workflows?: Array<{ __typename?: 'EntityReference', id: string }> | null, collections?: Array<{ __typename?: 'EntityReference', id: string }> | null, users?: Array<{ __typename?: 'EntityReference', id: string }> | null, observations?: Array<{ __typename?: 'ObservationCriteria', type: ObservableTypes, states?: Array<EntityState | null> | null, observable: { __typename?: 'EntityReference', id: string } }> | null }> | null, and?: Array<{ __typename?: 'ContentCriteriaLevel', feeds?: Array<{ __typename?: 'EntityReference', id: string }> | null, workflows?: Array<{ __typename?: 'EntityReference', id: string }> | null, collections?: Array<{ __typename?: 'EntityReference', id: string }> | null, users?: Array<{ __typename?: 'EntityReference', id: string }> | null, observations?: Array<{ __typename?: 'ObservationCriteria', type: ObservableTypes, states?: Array<EntityState | null> | null, observable: { __typename?: 'EntityReference', id: string } }> | null }> | null } | null } | null };

export type PromptMutationVariables = Exact<{
  prompt?: InputMaybe<Scalars['String']['input']>;
  mimeType?: InputMaybe<Scalars['String']['input']>;
  data?: InputMaybe<Scalars['String']['input']>;
  specification?: InputMaybe<EntityReferenceInput>;
  messages?: InputMaybe<Array<ConversationMessageInput> | ConversationMessageInput>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type PromptMutation = { __typename?: 'Mutation', prompt?: { __typename?: 'PromptCompletion', error?: string | null, specification?: { __typename?: 'EntityReference', id: string } | null, messages?: Array<{ __typename?: 'ConversationMessage', role: ConversationRoleTypes, author?: string | null, message?: string | null, tokens?: number | null, throughput?: number | null, completionTime?: any | null, timestamp?: any | null, modelService?: ModelServiceTypes | null, model?: string | null, data?: string | null, mimeType?: string | null, citations?: Array<{ __typename?: 'ConversationCitation', index?: number | null, text: string, startTime?: any | null, endTime?: any | null, pageNumber?: number | null, frameNumber?: number | null, content?: { __typename?: 'Content', id: string, name: string, state: EntityState, originalDate?: any | null, identifier?: string | null, uri?: any | null, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, format?: string | null, formatName?: string | null, fileExtension?: string | null, fileName?: string | null, fileSize?: any | null, masterUri?: any | null, imageUri?: any | null, textUri?: any | null, audioUri?: any | null, transcriptUri?: any | null, summary?: string | null, customSummary?: string | null, keywords?: Array<string> | null, bullets?: Array<string> | null, headlines?: Array<string> | null, posts?: Array<string> | null, chapters?: Array<string> | null, questions?: Array<string> | null, video?: { __typename?: 'VideoMetadata', width?: number | null, height?: number | null, duration?: any | null, make?: string | null, model?: string | null, software?: string | null, title?: string | null, description?: string | null, keywords?: Array<string | null> | null, author?: string | null } | null, audio?: { __typename?: 'AudioMetadata', keywords?: Array<string | null> | null, author?: string | null, series?: string | null, episode?: string | null, episodeType?: string | null, season?: string | null, publisher?: string | null, copyright?: string | null, genre?: string | null, title?: string | null, description?: string | null, bitrate?: number | null, channels?: number | null, sampleRate?: number | null, bitsPerSample?: number | null, duration?: any | null } | null, image?: { __typename?: 'ImageMetadata', width?: number | null, height?: number | null, resolutionX?: number | null, resolutionY?: number | null, bitsPerComponent?: number | null, components?: number | null, projectionType?: ImageProjectionTypes | null, orientation?: OrientationTypes | null, description?: string | null, make?: string | null, model?: string | null, software?: string | null, lens?: string | null, focalLength?: number | null, exposureTime?: string | null, fNumber?: string | null, iso?: string | null, heading?: number | null, pitch?: number | null } | null, document?: { __typename?: 'DocumentMetadata', title?: string | null, subject?: string | null, summary?: string | null, author?: string | null, publisher?: string | null, description?: string | null, keywords?: Array<string | null> | null, pageCount?: number | null, worksheetCount?: number | null, slideCount?: number | null, wordCount?: number | null, lineCount?: number | null, paragraphCount?: number | null, isEncrypted?: boolean | null, hasDigitalSignature?: boolean | null } | null } | null } | null> | null, toolCalls?: Array<{ __typename?: 'ConversationToolCall', id: string, name: string, arguments: string } | null> | null } | null> | null } | null };

export type PromptConversationMutationVariables = Exact<{
  prompt: Scalars['String']['input'];
  mimeType?: InputMaybe<Scalars['String']['input']>;
  data?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  specification?: InputMaybe<EntityReferenceInput>;
  tools?: InputMaybe<Array<ToolDefinitionInput> | ToolDefinitionInput>;
  requireTool?: InputMaybe<Scalars['Boolean']['input']>;
  includeDetails?: InputMaybe<Scalars['Boolean']['input']>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type PromptConversationMutation = { __typename?: 'Mutation', promptConversation?: { __typename?: 'PromptConversation', messageCount?: number | null, conversation?: { __typename?: 'EntityReference', id: string } | null, message?: { __typename?: 'ConversationMessage', role: ConversationRoleTypes, author?: string | null, message?: string | null, tokens?: number | null, throughput?: number | null, completionTime?: any | null, timestamp?: any | null, modelService?: ModelServiceTypes | null, model?: string | null, data?: string | null, mimeType?: string | null, citations?: Array<{ __typename?: 'ConversationCitation', index?: number | null, text: string, startTime?: any | null, endTime?: any | null, pageNumber?: number | null, frameNumber?: number | null, content?: { __typename?: 'Content', id: string, name: string, state: EntityState, originalDate?: any | null, identifier?: string | null, uri?: any | null, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, format?: string | null, formatName?: string | null, fileExtension?: string | null, fileName?: string | null, fileSize?: any | null, masterUri?: any | null, imageUri?: any | null, textUri?: any | null, audioUri?: any | null, transcriptUri?: any | null, summary?: string | null, customSummary?: string | null, keywords?: Array<string> | null, bullets?: Array<string> | null, headlines?: Array<string> | null, posts?: Array<string> | null, chapters?: Array<string> | null, questions?: Array<string> | null, video?: { __typename?: 'VideoMetadata', width?: number | null, height?: number | null, duration?: any | null, make?: string | null, model?: string | null, software?: string | null, title?: string | null, description?: string | null, keywords?: Array<string | null> | null, author?: string | null } | null, audio?: { __typename?: 'AudioMetadata', keywords?: Array<string | null> | null, author?: string | null, series?: string | null, episode?: string | null, episodeType?: string | null, season?: string | null, publisher?: string | null, copyright?: string | null, genre?: string | null, title?: string | null, description?: string | null, bitrate?: number | null, channels?: number | null, sampleRate?: number | null, bitsPerSample?: number | null, duration?: any | null } | null, image?: { __typename?: 'ImageMetadata', width?: number | null, height?: number | null, resolutionX?: number | null, resolutionY?: number | null, bitsPerComponent?: number | null, components?: number | null, projectionType?: ImageProjectionTypes | null, orientation?: OrientationTypes | null, description?: string | null, make?: string | null, model?: string | null, software?: string | null, lens?: string | null, focalLength?: number | null, exposureTime?: string | null, fNumber?: string | null, iso?: string | null, heading?: number | null, pitch?: number | null } | null, document?: { __typename?: 'DocumentMetadata', title?: string | null, subject?: string | null, summary?: string | null, author?: string | null, publisher?: string | null, description?: string | null, keywords?: Array<string | null> | null, pageCount?: number | null, worksheetCount?: number | null, slideCount?: number | null, wordCount?: number | null, lineCount?: number | null, paragraphCount?: number | null, isEncrypted?: boolean | null, hasDigitalSignature?: boolean | null } | null } | null } | null> | null, toolCalls?: Array<{ __typename?: 'ConversationToolCall', id: string, name: string, arguments: string } | null> | null } | null, facets?: Array<{ __typename?: 'ContentFacet', type?: FacetValueTypes | null, value?: string | null, count?: any | null, facet?: ContentFacetTypes | null, range?: { __typename?: 'StringRange', from?: string | null, to?: string | null } | null, observable?: { __typename?: 'ObservableFacet', type?: ObservableTypes | null, observable?: { __typename?: 'NamedEntityReference', id: string, name?: string | null } | null } | null } | null> | null, graph?: { __typename?: 'Graph', nodes?: Array<{ __typename?: 'GraphNode', id: string, name: string, type: EntityTypes, metadata?: string | null } | null> | null, edges?: Array<{ __typename?: 'GraphEdge', from: string, to: string, relation?: string | null } | null> | null } | null, details?: { __typename?: 'ConversationDetails', modelService?: ModelServiceTypes | null, model?: string | null, supportsToolCalling?: boolean | null, sourceCount?: number | null, observableCount?: number | null, toolCount?: number | null, renderedSourceCount?: number | null, renderedObservableCount?: number | null, renderedToolCount?: number | null, rankedSourceCount?: number | null, rankedObservableCount?: number | null, rankedToolCount?: number | null, tokenLimit?: number | null, completionTokenLimit?: number | null, sources?: string | null, formattedSources?: string | null, formattedObservables?: string | null, formattedInstructions?: string | null, formattedTools?: string | null, specification?: string | null, messages?: Array<{ __typename?: 'ConversationMessage', role: ConversationRoleTypes, author?: string | null, message?: string | null, tokens?: number | null, throughput?: number | null, completionTime?: any | null, timestamp?: any | null, modelService?: ModelServiceTypes | null, model?: string | null, data?: string | null, mimeType?: string | null, citations?: Array<{ __typename?: 'ConversationCitation', index?: number | null, text: string, startTime?: any | null, endTime?: any | null, pageNumber?: number | null, frameNumber?: number | null, content?: { __typename?: 'Content', id: string, name: string, state: EntityState, originalDate?: any | null, identifier?: string | null, uri?: any | null, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, format?: string | null, formatName?: string | null, fileExtension?: string | null, fileName?: string | null, fileSize?: any | null, masterUri?: any | null, imageUri?: any | null, textUri?: any | null, audioUri?: any | null, transcriptUri?: any | null, summary?: string | null, customSummary?: string | null, keywords?: Array<string> | null, bullets?: Array<string> | null, headlines?: Array<string> | null, posts?: Array<string> | null, chapters?: Array<string> | null, questions?: Array<string> | null, video?: { __typename?: 'VideoMetadata', width?: number | null, height?: number | null, duration?: any | null, make?: string | null, model?: string | null, software?: string | null, title?: string | null, description?: string | null, keywords?: Array<string | null> | null, author?: string | null } | null, audio?: { __typename?: 'AudioMetadata', keywords?: Array<string | null> | null, author?: string | null, series?: string | null, episode?: string | null, episodeType?: string | null, season?: string | null, publisher?: string | null, copyright?: string | null, genre?: string | null, title?: string | null, description?: string | null, bitrate?: number | null, channels?: number | null, sampleRate?: number | null, bitsPerSample?: number | null, duration?: any | null } | null, image?: { __typename?: 'ImageMetadata', width?: number | null, height?: number | null, resolutionX?: number | null, resolutionY?: number | null, bitsPerComponent?: number | null, components?: number | null, projectionType?: ImageProjectionTypes | null, orientation?: OrientationTypes | null, description?: string | null, make?: string | null, model?: string | null, software?: string | null, lens?: string | null, focalLength?: number | null, exposureTime?: string | null, fNumber?: string | null, iso?: string | null, heading?: number | null, pitch?: number | null } | null, document?: { __typename?: 'DocumentMetadata', title?: string | null, subject?: string | null, summary?: string | null, author?: string | null, publisher?: string | null, description?: string | null, keywords?: Array<string | null> | null, pageCount?: number | null, worksheetCount?: number | null, slideCount?: number | null, wordCount?: number | null, lineCount?: number | null, paragraphCount?: number | null, isEncrypted?: boolean | null, hasDigitalSignature?: boolean | null } | null } | null } | null> | null, toolCalls?: Array<{ __typename?: 'ConversationToolCall', id: string, name: string, arguments: string } | null> | null } | null> | null } | null } | null };

export type PublishConversationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  connector: ContentPublishingConnectorInput;
  name?: InputMaybe<Scalars['String']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  workflow?: InputMaybe<EntityReferenceInput>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type PublishConversationMutation = { __typename?: 'Mutation', publishConversation?: { __typename?: 'PublishContents', contents?: Array<{ __typename?: 'Content', id: string, name: string, state: EntityState, originalDate?: any | null, identifier?: string | null, markdown?: string | null, uri?: any | null, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, format?: string | null, formatName?: string | null, fileExtension?: string | null, fileName?: string | null, fileSize?: any | null, masterUri?: any | null, imageUri?: any | null, textUri?: any | null, audioUri?: any | null, transcriptUri?: any | null, summary?: string | null, customSummary?: string | null, keywords?: Array<string> | null, bullets?: Array<string> | null, headlines?: Array<string> | null, posts?: Array<string> | null, chapters?: Array<string> | null, questions?: Array<string> | null, video?: { __typename?: 'VideoMetadata', width?: number | null, height?: number | null, duration?: any | null, make?: string | null, model?: string | null, software?: string | null, title?: string | null, description?: string | null, keywords?: Array<string | null> | null, author?: string | null } | null, audio?: { __typename?: 'AudioMetadata', keywords?: Array<string | null> | null, author?: string | null, series?: string | null, episode?: string | null, episodeType?: string | null, season?: string | null, publisher?: string | null, copyright?: string | null, genre?: string | null, title?: string | null, description?: string | null, bitrate?: number | null, channels?: number | null, sampleRate?: number | null, bitsPerSample?: number | null, duration?: any | null } | null, image?: { __typename?: 'ImageMetadata', width?: number | null, height?: number | null, resolutionX?: number | null, resolutionY?: number | null, bitsPerComponent?: number | null, components?: number | null, projectionType?: ImageProjectionTypes | null, orientation?: OrientationTypes | null, description?: string | null, make?: string | null, model?: string | null, software?: string | null, lens?: string | null, focalLength?: number | null, exposureTime?: string | null, fNumber?: string | null, iso?: string | null, heading?: number | null, pitch?: number | null } | null, document?: { __typename?: 'DocumentMetadata', title?: string | null, subject?: string | null, summary?: string | null, author?: string | null, publisher?: string | null, description?: string | null, keywords?: Array<string | null> | null, pageCount?: number | null, worksheetCount?: number | null, slideCount?: number | null, wordCount?: number | null, lineCount?: number | null, paragraphCount?: number | null, isEncrypted?: boolean | null, hasDigitalSignature?: boolean | null } | null } | null> | null, details?: { __typename?: 'PublishingDetails', summaries?: Array<string> | null, text?: string | null, textType?: TextTypes | null, summarySpecification?: string | null, publishSpecification?: string | null, summaryTime?: any | null, publishTime?: any | null, contents?: Array<{ __typename?: 'EntityReference', id: string }> | null } | null } | null };

export type QueryConversationsQueryVariables = Exact<{
  filter?: InputMaybe<ConversationFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type QueryConversationsQuery = { __typename?: 'Query', conversations?: { __typename?: 'ConversationResults', results?: Array<{ __typename?: 'Conversation', id: string, name: string, creationDate: any, relevance?: number | null, state: EntityState, correlationId?: string | null, type?: ConversationTypes | null, owner: { __typename?: 'Owner', id: string }, messages?: Array<{ __typename?: 'ConversationMessage', role: ConversationRoleTypes, author?: string | null, message?: string | null, tokens?: number | null, throughput?: number | null, completionTime?: any | null, timestamp?: any | null, modelService?: ModelServiceTypes | null, model?: string | null, data?: string | null, mimeType?: string | null, citations?: Array<{ __typename?: 'ConversationCitation', index?: number | null, text: string, startTime?: any | null, endTime?: any | null, pageNumber?: number | null, frameNumber?: number | null, content?: { __typename?: 'Content', id: string, name: string, state: EntityState, originalDate?: any | null, identifier?: string | null, uri?: any | null, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, format?: string | null, formatName?: string | null, fileExtension?: string | null, fileName?: string | null, fileSize?: any | null, masterUri?: any | null, imageUri?: any | null, textUri?: any | null, audioUri?: any | null, transcriptUri?: any | null, summary?: string | null, customSummary?: string | null, keywords?: Array<string> | null, bullets?: Array<string> | null, headlines?: Array<string> | null, posts?: Array<string> | null, chapters?: Array<string> | null, questions?: Array<string> | null, video?: { __typename?: 'VideoMetadata', width?: number | null, height?: number | null, duration?: any | null, make?: string | null, model?: string | null, software?: string | null, title?: string | null, description?: string | null, keywords?: Array<string | null> | null, author?: string | null } | null, audio?: { __typename?: 'AudioMetadata', keywords?: Array<string | null> | null, author?: string | null, series?: string | null, episode?: string | null, episodeType?: string | null, season?: string | null, publisher?: string | null, copyright?: string | null, genre?: string | null, title?: string | null, description?: string | null, bitrate?: number | null, channels?: number | null, sampleRate?: number | null, bitsPerSample?: number | null, duration?: any | null } | null, image?: { __typename?: 'ImageMetadata', width?: number | null, height?: number | null, resolutionX?: number | null, resolutionY?: number | null, bitsPerComponent?: number | null, components?: number | null, projectionType?: ImageProjectionTypes | null, orientation?: OrientationTypes | null, description?: string | null, make?: string | null, model?: string | null, software?: string | null, lens?: string | null, focalLength?: number | null, exposureTime?: string | null, fNumber?: string | null, iso?: string | null, heading?: number | null, pitch?: number | null } | null, document?: { __typename?: 'DocumentMetadata', title?: string | null, subject?: string | null, summary?: string | null, author?: string | null, publisher?: string | null, description?: string | null, keywords?: Array<string | null> | null, pageCount?: number | null, worksheetCount?: number | null, slideCount?: number | null, wordCount?: number | null, lineCount?: number | null, paragraphCount?: number | null, isEncrypted?: boolean | null, hasDigitalSignature?: boolean | null } | null } | null } | null> | null, toolCalls?: Array<{ __typename?: 'ConversationToolCall', id: string, name: string, arguments: string } | null> | null } | null> | null, specification?: { __typename?: 'Specification', id: string, name: string } | null, fallbacks?: Array<{ __typename?: 'Specification', id: string, name: string } | null> | null, filter?: { __typename?: 'ContentCriteria', inLast?: any | null, createdInLast?: any | null, types?: Array<ContentTypes> | null, fileTypes?: Array<FileTypes | null> | null, formats?: Array<string | null> | null, fileExtensions?: Array<string> | null, dateRange?: { __typename?: 'DateRange', from?: any | null, to?: any | null } | null, creationDateRange?: { __typename?: 'DateRange', from?: any | null, to?: any | null } | null, similarContents?: Array<{ __typename?: 'EntityReference', id: string }> | null, contents?: Array<{ __typename?: 'EntityReference', id: string }> | null, feeds?: Array<{ __typename?: 'EntityReference', id: string }> | null, workflows?: Array<{ __typename?: 'EntityReference', id: string }> | null, collections?: Array<{ __typename?: 'EntityReference', id: string }> | null, users?: Array<{ __typename?: 'EntityReference', id: string }> | null, observations?: Array<{ __typename?: 'ObservationCriteria', type: ObservableTypes, states?: Array<EntityState | null> | null, observable: { __typename?: 'EntityReference', id: string } }> | null, or?: Array<{ __typename?: 'ContentCriteriaLevel', feeds?: Array<{ __typename?: 'EntityReference', id: string }> | null, workflows?: Array<{ __typename?: 'EntityReference', id: string }> | null, collections?: Array<{ __typename?: 'EntityReference', id: string }> | null, users?: Array<{ __typename?: 'EntityReference', id: string }> | null, observations?: Array<{ __typename?: 'ObservationCriteria', type: ObservableTypes, states?: Array<EntityState | null> | null, observable: { __typename?: 'EntityReference', id: string } }> | null }> | null, and?: Array<{ __typename?: 'ContentCriteriaLevel', feeds?: Array<{ __typename?: 'EntityReference', id: string }> | null, workflows?: Array<{ __typename?: 'EntityReference', id: string }> | null, collections?: Array<{ __typename?: 'EntityReference', id: string }> | null, users?: Array<{ __typename?: 'EntityReference', id: string }> | null, observations?: Array<{ __typename?: 'ObservationCriteria', type: ObservableTypes, states?: Array<EntityState | null> | null, observable: { __typename?: 'EntityReference', id: string } }> | null }> | null } | null, augmentedFilter?: { __typename?: 'ContentCriteria', inLast?: any | null, createdInLast?: any | null, types?: Array<ContentTypes> | null, fileTypes?: Array<FileTypes | null> | null, formats?: Array<string | null> | null, fileExtensions?: Array<string> | null, dateRange?: { __typename?: 'DateRange', from?: any | null, to?: any | null } | null, creationDateRange?: { __typename?: 'DateRange', from?: any | null, to?: any | null } | null, similarContents?: Array<{ __typename?: 'EntityReference', id: string }> | null, contents?: Array<{ __typename?: 'EntityReference', id: string }> | null, feeds?: Array<{ __typename?: 'EntityReference', id: string }> | null, workflows?: Array<{ __typename?: 'EntityReference', id: string }> | null, collections?: Array<{ __typename?: 'EntityReference', id: string }> | null, users?: Array<{ __typename?: 'EntityReference', id: string }> | null, observations?: Array<{ __typename?: 'ObservationCriteria', type: ObservableTypes, states?: Array<EntityState | null> | null, observable: { __typename?: 'EntityReference', id: string } }> | null, or?: Array<{ __typename?: 'ContentCriteriaLevel', feeds?: Array<{ __typename?: 'EntityReference', id: string }> | null, workflows?: Array<{ __typename?: 'EntityReference', id: string }> | null, collections?: Array<{ __typename?: 'EntityReference', id: string }> | null, users?: Array<{ __typename?: 'EntityReference', id: string }> | null, observations?: Array<{ __typename?: 'ObservationCriteria', type: ObservableTypes, states?: Array<EntityState | null> | null, observable: { __typename?: 'EntityReference', id: string } }> | null }> | null, and?: Array<{ __typename?: 'ContentCriteriaLevel', feeds?: Array<{ __typename?: 'EntityReference', id: string }> | null, workflows?: Array<{ __typename?: 'EntityReference', id: string }> | null, collections?: Array<{ __typename?: 'EntityReference', id: string }> | null, users?: Array<{ __typename?: 'EntityReference', id: string }> | null, observations?: Array<{ __typename?: 'ObservationCriteria', type: ObservableTypes, states?: Array<EntityState | null> | null, observable: { __typename?: 'EntityReference', id: string } }> | null }> | null } | null } | null> | null } | null };

export type RetrieveSourcesMutationVariables = Exact<{
  prompt: Scalars['String']['input'];
  filter?: InputMaybe<ContentFilter>;
  augmentedFilter?: InputMaybe<ContentFilter>;
  retrievalStrategy?: InputMaybe<RetrievalStrategyInput>;
  rerankingStrategy?: InputMaybe<RerankingStrategyInput>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type RetrieveSourcesMutation = { __typename?: 'Mutation', retrieveSources?: { __typename?: 'ContentSourceResults', results?: Array<{ __typename?: 'ContentSource', type?: ContentSourceTypes | null, text: string, metadata?: string | null, relevance: number, startTime?: any | null, endTime?: any | null, pageNumber?: number | null, frameNumber?: number | null, content: { __typename?: 'EntityReference', id: string } } | null> | null } | null };

export type ReviseContentMutationVariables = Exact<{
  prompt: Scalars['String']['input'];
  content: EntityReferenceInput;
  id?: InputMaybe<Scalars['ID']['input']>;
  specification?: InputMaybe<EntityReferenceInput>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type ReviseContentMutation = { __typename?: 'Mutation', reviseContent?: { __typename?: 'ReviseContent', messageCount?: number | null, conversation?: { __typename?: 'EntityReference', id: string } | null, message?: { __typename?: 'ConversationMessage', role: ConversationRoleTypes, author?: string | null, message?: string | null, tokens?: number | null, throughput?: number | null, completionTime?: any | null, timestamp?: any | null, modelService?: ModelServiceTypes | null, model?: string | null, data?: string | null, mimeType?: string | null, citations?: Array<{ __typename?: 'ConversationCitation', index?: number | null, text: string, startTime?: any | null, endTime?: any | null, pageNumber?: number | null, frameNumber?: number | null, content?: { __typename?: 'Content', id: string, name: string, state: EntityState, originalDate?: any | null, identifier?: string | null, uri?: any | null, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, format?: string | null, formatName?: string | null, fileExtension?: string | null, fileName?: string | null, fileSize?: any | null, masterUri?: any | null, imageUri?: any | null, textUri?: any | null, audioUri?: any | null, transcriptUri?: any | null, summary?: string | null, customSummary?: string | null, keywords?: Array<string> | null, bullets?: Array<string> | null, headlines?: Array<string> | null, posts?: Array<string> | null, chapters?: Array<string> | null, questions?: Array<string> | null, video?: { __typename?: 'VideoMetadata', width?: number | null, height?: number | null, duration?: any | null, make?: string | null, model?: string | null, software?: string | null, title?: string | null, description?: string | null, keywords?: Array<string | null> | null, author?: string | null } | null, audio?: { __typename?: 'AudioMetadata', keywords?: Array<string | null> | null, author?: string | null, series?: string | null, episode?: string | null, episodeType?: string | null, season?: string | null, publisher?: string | null, copyright?: string | null, genre?: string | null, title?: string | null, description?: string | null, bitrate?: number | null, channels?: number | null, sampleRate?: number | null, bitsPerSample?: number | null, duration?: any | null } | null, image?: { __typename?: 'ImageMetadata', width?: number | null, height?: number | null, resolutionX?: number | null, resolutionY?: number | null, bitsPerComponent?: number | null, components?: number | null, projectionType?: ImageProjectionTypes | null, orientation?: OrientationTypes | null, description?: string | null, make?: string | null, model?: string | null, software?: string | null, lens?: string | null, focalLength?: number | null, exposureTime?: string | null, fNumber?: string | null, iso?: string | null, heading?: number | null, pitch?: number | null } | null, document?: { __typename?: 'DocumentMetadata', title?: string | null, subject?: string | null, summary?: string | null, author?: string | null, publisher?: string | null, description?: string | null, keywords?: Array<string | null> | null, pageCount?: number | null, worksheetCount?: number | null, slideCount?: number | null, wordCount?: number | null, lineCount?: number | null, paragraphCount?: number | null, isEncrypted?: boolean | null, hasDigitalSignature?: boolean | null } | null } | null } | null> | null, toolCalls?: Array<{ __typename?: 'ConversationToolCall', id: string, name: string, arguments: string } | null> | null } | null } | null };

export type ReviseEncodedImageMutationVariables = Exact<{
  prompt: Scalars['String']['input'];
  mimeType: Scalars['String']['input'];
  data: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  specification?: InputMaybe<EntityReferenceInput>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type ReviseEncodedImageMutation = { __typename?: 'Mutation', reviseEncodedImage?: { __typename?: 'ReviseContent', messageCount?: number | null, conversation?: { __typename?: 'EntityReference', id: string } | null, message?: { __typename?: 'ConversationMessage', role: ConversationRoleTypes, author?: string | null, message?: string | null, tokens?: number | null, throughput?: number | null, completionTime?: any | null, timestamp?: any | null, modelService?: ModelServiceTypes | null, model?: string | null, data?: string | null, mimeType?: string | null, citations?: Array<{ __typename?: 'ConversationCitation', index?: number | null, text: string, startTime?: any | null, endTime?: any | null, pageNumber?: number | null, frameNumber?: number | null, content?: { __typename?: 'Content', id: string, name: string, state: EntityState, originalDate?: any | null, identifier?: string | null, uri?: any | null, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, format?: string | null, formatName?: string | null, fileExtension?: string | null, fileName?: string | null, fileSize?: any | null, masterUri?: any | null, imageUri?: any | null, textUri?: any | null, audioUri?: any | null, transcriptUri?: any | null, summary?: string | null, customSummary?: string | null, keywords?: Array<string> | null, bullets?: Array<string> | null, headlines?: Array<string> | null, posts?: Array<string> | null, chapters?: Array<string> | null, questions?: Array<string> | null, video?: { __typename?: 'VideoMetadata', width?: number | null, height?: number | null, duration?: any | null, make?: string | null, model?: string | null, software?: string | null, title?: string | null, description?: string | null, keywords?: Array<string | null> | null, author?: string | null } | null, audio?: { __typename?: 'AudioMetadata', keywords?: Array<string | null> | null, author?: string | null, series?: string | null, episode?: string | null, episodeType?: string | null, season?: string | null, publisher?: string | null, copyright?: string | null, genre?: string | null, title?: string | null, description?: string | null, bitrate?: number | null, channels?: number | null, sampleRate?: number | null, bitsPerSample?: number | null, duration?: any | null } | null, image?: { __typename?: 'ImageMetadata', width?: number | null, height?: number | null, resolutionX?: number | null, resolutionY?: number | null, bitsPerComponent?: number | null, components?: number | null, projectionType?: ImageProjectionTypes | null, orientation?: OrientationTypes | null, description?: string | null, make?: string | null, model?: string | null, software?: string | null, lens?: string | null, focalLength?: number | null, exposureTime?: string | null, fNumber?: string | null, iso?: string | null, heading?: number | null, pitch?: number | null } | null, document?: { __typename?: 'DocumentMetadata', title?: string | null, subject?: string | null, summary?: string | null, author?: string | null, publisher?: string | null, description?: string | null, keywords?: Array<string | null> | null, pageCount?: number | null, worksheetCount?: number | null, slideCount?: number | null, wordCount?: number | null, lineCount?: number | null, paragraphCount?: number | null, isEncrypted?: boolean | null, hasDigitalSignature?: boolean | null } | null } | null } | null> | null, toolCalls?: Array<{ __typename?: 'ConversationToolCall', id: string, name: string, arguments: string } | null> | null } | null } | null };

export type ReviseImageMutationVariables = Exact<{
  prompt: Scalars['String']['input'];
  uri: Scalars['URL']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  specification?: InputMaybe<EntityReferenceInput>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type ReviseImageMutation = { __typename?: 'Mutation', reviseImage?: { __typename?: 'ReviseContent', messageCount?: number | null, conversation?: { __typename?: 'EntityReference', id: string } | null, message?: { __typename?: 'ConversationMessage', role: ConversationRoleTypes, author?: string | null, message?: string | null, tokens?: number | null, throughput?: number | null, completionTime?: any | null, timestamp?: any | null, modelService?: ModelServiceTypes | null, model?: string | null, data?: string | null, mimeType?: string | null, citations?: Array<{ __typename?: 'ConversationCitation', index?: number | null, text: string, startTime?: any | null, endTime?: any | null, pageNumber?: number | null, frameNumber?: number | null, content?: { __typename?: 'Content', id: string, name: string, state: EntityState, originalDate?: any | null, identifier?: string | null, uri?: any | null, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, format?: string | null, formatName?: string | null, fileExtension?: string | null, fileName?: string | null, fileSize?: any | null, masterUri?: any | null, imageUri?: any | null, textUri?: any | null, audioUri?: any | null, transcriptUri?: any | null, summary?: string | null, customSummary?: string | null, keywords?: Array<string> | null, bullets?: Array<string> | null, headlines?: Array<string> | null, posts?: Array<string> | null, chapters?: Array<string> | null, questions?: Array<string> | null, video?: { __typename?: 'VideoMetadata', width?: number | null, height?: number | null, duration?: any | null, make?: string | null, model?: string | null, software?: string | null, title?: string | null, description?: string | null, keywords?: Array<string | null> | null, author?: string | null } | null, audio?: { __typename?: 'AudioMetadata', keywords?: Array<string | null> | null, author?: string | null, series?: string | null, episode?: string | null, episodeType?: string | null, season?: string | null, publisher?: string | null, copyright?: string | null, genre?: string | null, title?: string | null, description?: string | null, bitrate?: number | null, channels?: number | null, sampleRate?: number | null, bitsPerSample?: number | null, duration?: any | null } | null, image?: { __typename?: 'ImageMetadata', width?: number | null, height?: number | null, resolutionX?: number | null, resolutionY?: number | null, bitsPerComponent?: number | null, components?: number | null, projectionType?: ImageProjectionTypes | null, orientation?: OrientationTypes | null, description?: string | null, make?: string | null, model?: string | null, software?: string | null, lens?: string | null, focalLength?: number | null, exposureTime?: string | null, fNumber?: string | null, iso?: string | null, heading?: number | null, pitch?: number | null } | null, document?: { __typename?: 'DocumentMetadata', title?: string | null, subject?: string | null, summary?: string | null, author?: string | null, publisher?: string | null, description?: string | null, keywords?: Array<string | null> | null, pageCount?: number | null, worksheetCount?: number | null, slideCount?: number | null, wordCount?: number | null, lineCount?: number | null, paragraphCount?: number | null, isEncrypted?: boolean | null, hasDigitalSignature?: boolean | null } | null } | null } | null> | null, toolCalls?: Array<{ __typename?: 'ConversationToolCall', id: string, name: string, arguments: string } | null> | null } | null } | null };

export type ReviseTextMutationVariables = Exact<{
  prompt: Scalars['String']['input'];
  text: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  specification?: InputMaybe<EntityReferenceInput>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type ReviseTextMutation = { __typename?: 'Mutation', reviseText?: { __typename?: 'ReviseContent', messageCount?: number | null, conversation?: { __typename?: 'EntityReference', id: string } | null, message?: { __typename?: 'ConversationMessage', role: ConversationRoleTypes, author?: string | null, message?: string | null, tokens?: number | null, throughput?: number | null, completionTime?: any | null, timestamp?: any | null, modelService?: ModelServiceTypes | null, model?: string | null, data?: string | null, mimeType?: string | null, citations?: Array<{ __typename?: 'ConversationCitation', index?: number | null, text: string, startTime?: any | null, endTime?: any | null, pageNumber?: number | null, frameNumber?: number | null, content?: { __typename?: 'Content', id: string, name: string, state: EntityState, originalDate?: any | null, identifier?: string | null, uri?: any | null, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, format?: string | null, formatName?: string | null, fileExtension?: string | null, fileName?: string | null, fileSize?: any | null, masterUri?: any | null, imageUri?: any | null, textUri?: any | null, audioUri?: any | null, transcriptUri?: any | null, summary?: string | null, customSummary?: string | null, keywords?: Array<string> | null, bullets?: Array<string> | null, headlines?: Array<string> | null, posts?: Array<string> | null, chapters?: Array<string> | null, questions?: Array<string> | null, video?: { __typename?: 'VideoMetadata', width?: number | null, height?: number | null, duration?: any | null, make?: string | null, model?: string | null, software?: string | null, title?: string | null, description?: string | null, keywords?: Array<string | null> | null, author?: string | null } | null, audio?: { __typename?: 'AudioMetadata', keywords?: Array<string | null> | null, author?: string | null, series?: string | null, episode?: string | null, episodeType?: string | null, season?: string | null, publisher?: string | null, copyright?: string | null, genre?: string | null, title?: string | null, description?: string | null, bitrate?: number | null, channels?: number | null, sampleRate?: number | null, bitsPerSample?: number | null, duration?: any | null } | null, image?: { __typename?: 'ImageMetadata', width?: number | null, height?: number | null, resolutionX?: number | null, resolutionY?: number | null, bitsPerComponent?: number | null, components?: number | null, projectionType?: ImageProjectionTypes | null, orientation?: OrientationTypes | null, description?: string | null, make?: string | null, model?: string | null, software?: string | null, lens?: string | null, focalLength?: number | null, exposureTime?: string | null, fNumber?: string | null, iso?: string | null, heading?: number | null, pitch?: number | null } | null, document?: { __typename?: 'DocumentMetadata', title?: string | null, subject?: string | null, summary?: string | null, author?: string | null, publisher?: string | null, description?: string | null, keywords?: Array<string | null> | null, pageCount?: number | null, worksheetCount?: number | null, slideCount?: number | null, wordCount?: number | null, lineCount?: number | null, paragraphCount?: number | null, isEncrypted?: boolean | null, hasDigitalSignature?: boolean | null } | null } | null } | null> | null, toolCalls?: Array<{ __typename?: 'ConversationToolCall', id: string, name: string, arguments: string } | null> | null } | null } | null };

export type SuggestConversationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  count?: InputMaybe<Scalars['Int']['input']>;
  prompt?: InputMaybe<Scalars['String']['input']>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type SuggestConversationMutation = { __typename?: 'Mutation', suggestConversation?: { __typename?: 'PromptSuggestion', prompts?: Array<string | null> | null } | null };

export type UpdateConversationMutationVariables = Exact<{
  conversation: ConversationUpdateInput;
}>;


export type UpdateConversationMutation = { __typename?: 'Mutation', updateConversation?: { __typename?: 'Conversation', id: string, name: string, state: EntityState, type?: ConversationTypes | null } | null };

export type CountEventsQueryVariables = Exact<{
  filter?: InputMaybe<EventFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CountEventsQuery = { __typename?: 'Query', countEvents?: { __typename?: 'CountResult', count?: any | null } | null };

export type CreateEventMutationVariables = Exact<{
  event: EventInput;
}>;


export type CreateEventMutation = { __typename?: 'Mutation', createEvent?: { __typename?: 'Event', id: string, name: string } | null };

export type DeleteAllEventsMutationVariables = Exact<{
  filter?: InputMaybe<EventFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type DeleteAllEventsMutation = { __typename?: 'Mutation', deleteAllEvents?: Array<{ __typename?: 'Event', id: string, state: EntityState } | null> | null };

export type DeleteEventMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteEventMutation = { __typename?: 'Mutation', deleteEvent?: { __typename?: 'Event', id: string, state: EntityState } | null };

export type DeleteEventsMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type DeleteEventsMutation = { __typename?: 'Mutation', deleteEvents?: Array<{ __typename?: 'Event', id: string, state: EntityState } | null> | null };

export type GetEventQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetEventQuery = { __typename?: 'Query', event?: { __typename?: 'Event', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, uri?: any | null, description?: string | null, identifier?: string | null, thing?: string | null, relevance?: number | null, startDate?: any | null, endDate?: any | null, availabilityStartDate?: any | null, availabilityEndDate?: any | null, price?: any | null, minPrice?: any | null, maxPrice?: any | null, priceCurrency?: string | null, isAccessibleForFree?: boolean | null, typicalAgeRange?: string | null, address?: { __typename?: 'Address', streetAddress?: string | null, city?: string | null, region?: string | null, country?: string | null, postalCode?: string | null } | null } | null };

export type QueryEventsQueryVariables = Exact<{
  filter?: InputMaybe<EventFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type QueryEventsQuery = { __typename?: 'Query', events?: { __typename?: 'EventResults', results?: Array<{ __typename?: 'Event', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, uri?: any | null, description?: string | null, identifier?: string | null, thing?: string | null, relevance?: number | null, startDate?: any | null, endDate?: any | null, availabilityStartDate?: any | null, availabilityEndDate?: any | null, price?: any | null, minPrice?: any | null, maxPrice?: any | null, priceCurrency?: string | null, isAccessibleForFree?: boolean | null, typicalAgeRange?: string | null, address?: { __typename?: 'Address', streetAddress?: string | null, city?: string | null, region?: string | null, country?: string | null, postalCode?: string | null } | null } | null> | null } | null };

export type UpdateEventMutationVariables = Exact<{
  event: EventUpdateInput;
}>;


export type UpdateEventMutation = { __typename?: 'Mutation', updateEvent?: { __typename?: 'Event', id: string, name: string } | null };

export type CountFeedsQueryVariables = Exact<{
  filter?: InputMaybe<FeedFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CountFeedsQuery = { __typename?: 'Query', countFeeds?: { __typename?: 'CountResult', count?: any | null } | null };

export type CreateFeedMutationVariables = Exact<{
  feed: FeedInput;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateFeedMutation = { __typename?: 'Mutation', createFeed?: { __typename?: 'Feed', id: string, name: string, state: EntityState, type: FeedTypes } | null };

export type DeleteAllFeedsMutationVariables = Exact<{
  filter?: InputMaybe<FeedFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type DeleteAllFeedsMutation = { __typename?: 'Mutation', deleteAllFeeds?: Array<{ __typename?: 'Feed', id: string, state: EntityState } | null> | null };

export type DeleteFeedMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteFeedMutation = { __typename?: 'Mutation', deleteFeed?: { __typename?: 'Feed', id: string, state: EntityState } | null };

export type DeleteFeedsMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type DeleteFeedsMutation = { __typename?: 'Mutation', deleteFeeds?: Array<{ __typename?: 'Feed', id: string, state: EntityState } | null> | null };

export type DisableFeedMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DisableFeedMutation = { __typename?: 'Mutation', disableFeed?: { __typename?: 'Feed', id: string, state: EntityState } | null };

export type EnableFeedMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type EnableFeedMutation = { __typename?: 'Mutation', enableFeed?: { __typename?: 'Feed', id: string, state: EntityState } | null };

export type FeedExistsQueryVariables = Exact<{
  filter?: InputMaybe<FeedFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type FeedExistsQuery = { __typename?: 'Query', feedExists?: { __typename?: 'BooleanResult', result?: boolean | null } | null };

export type GetFeedQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetFeedQuery = { __typename?: 'Query', feed?: { __typename?: 'Feed', id: string, name: string, creationDate: any, relevance?: number | null, state: EntityState, correlationId?: string | null, type: FeedTypes, error?: string | null, lastPostDate?: any | null, lastReadDate?: any | null, readCount?: number | null, owner: { __typename?: 'Owner', id: string }, site?: { __typename?: 'SiteFeedProperties', siteType: SiteTypes, type: FeedServiceTypes, isRecursive?: boolean | null, readLimit?: number | null, s3?: { __typename?: 'AmazonFeedProperties', accessKey?: string | null, secretAccessKey?: string | null, bucketName?: string | null, prefix?: string | null, region?: string | null } | null, azureBlob?: { __typename?: 'AzureBlobFeedProperties', storageAccessKey?: string | null, accountName?: string | null, containerName?: string | null, prefix?: string | null } | null, azureFile?: { __typename?: 'AzureFileFeedProperties', storageAccessKey?: string | null, accountName?: string | null, shareName?: string | null, prefix?: string | null } | null, google?: { __typename?: 'GoogleFeedProperties', credentials?: string | null, containerName?: string | null, prefix?: string | null } | null, sharePoint?: { __typename?: 'SharePointFeedProperties', authenticationType: SharePointAuthenticationTypes, accountName: string, libraryId: string, folderId?: string | null, tenantId?: string | null, clientId?: string | null, clientSecret?: string | null, refreshToken?: string | null } | null, oneDrive?: { __typename?: 'OneDriveFeedProperties', folderId?: string | null, files?: Array<string | null> | null, clientId: string, clientSecret: string, refreshToken: string } | null, googleDrive?: { __typename?: 'GoogleDriveFeedProperties', authenticationType?: GoogleDriveAuthenticationTypes | null, folderId?: string | null, files?: Array<string | null> | null, refreshToken?: string | null, clientId?: string | null, clientSecret?: string | null, serviceAccountJson?: string | null } | null, dropbox?: { __typename?: 'DropboxFeedProperties', path?: string | null, appKey: string, appSecret: string, refreshToken: string, redirectUri: string } | null, box?: { __typename?: 'BoxFeedProperties', folderId?: string | null, clientId: string, clientSecret: string, refreshToken: string, redirectUri: string } | null, github?: { __typename?: 'GitHubFeedProperties', uri?: any | null, repositoryOwner: string, repositoryName: string, refreshToken?: string | null, personalAccessToken?: string | null } | null } | null, email?: { __typename?: 'EmailFeedProperties', type: FeedServiceTypes, includeAttachments?: boolean | null, readLimit?: number | null, google?: { __typename?: 'GoogleEmailFeedProperties', type?: EmailListingTypes | null, includeSpam?: boolean | null, excludeSentItems?: boolean | null, includeDeletedItems?: boolean | null, inboxOnly?: boolean | null, refreshToken?: string | null, clientId: string, clientSecret: string } | null, microsoft?: { __typename?: 'MicrosoftEmailFeedProperties', type?: EmailListingTypes | null, includeSpam?: boolean | null, excludeSentItems?: boolean | null, includeDeletedItems?: boolean | null, inboxOnly?: boolean | null, refreshToken: string, clientId: string, clientSecret: string } | null } | null, issue?: { __typename?: 'IssueFeedProperties', type: FeedServiceTypes, includeAttachments?: boolean | null, readLimit?: number | null, jira?: { __typename?: 'AtlassianJiraFeedProperties', uri: any, project: string, email: string, token: string, offset?: any | null } | null, linear?: { __typename?: 'LinearFeedProperties', key: string, project: string } | null, github?: { __typename?: 'GitHubIssuesFeedProperties', uri?: any | null, repositoryOwner: string, repositoryName: string, refreshToken?: string | null, personalAccessToken?: string | null } | null, intercom?: { __typename?: 'IntercomTicketsFeedProperties', accessToken: string } | null, zendesk?: { __typename?: 'ZendeskTicketsFeedProperties', subdomain: string, accessToken: string } | null, trello?: { __typename?: 'TrelloFeedProperties', key: string, token: string, identifiers: Array<string>, type: TrelloTypes } | null } | null, rss?: { __typename?: 'RSSFeedProperties', readLimit?: number | null, uri: any } | null, web?: { __typename?: 'WebFeedProperties', readLimit?: number | null, uri: any, includeFiles?: boolean | null, allowedPaths?: Array<string> | null, excludedPaths?: Array<string> | null } | null, search?: { __typename?: 'SearchFeedProperties', readLimit?: number | null, type?: SearchServiceTypes | null, text: string } | null, reddit?: { __typename?: 'RedditFeedProperties', readLimit?: number | null, subredditName: string } | null, notion?: { __typename?: 'NotionFeedProperties', readLimit?: number | null, token: string, identifiers: Array<string>, type: NotionTypes } | null, intercom?: { __typename?: 'IntercomFeedProperties', readLimit?: number | null, accessToken: string } | null, zendesk?: { __typename?: 'ZendeskFeedProperties', readLimit?: number | null, subdomain: string, accessToken: string } | null, youtube?: { __typename?: 'YouTubeFeedProperties', readLimit?: number | null, type: YouTubeTypes, videoName?: string | null, videoIdentifiers?: Array<string> | null, channelIdentifier?: string | null, playlistIdentifier?: string | null } | null, twitter?: { __typename?: 'TwitterFeedProperties', readLimit?: number | null, token: string, type?: TwitterListingTypes | null, userName?: string | null, query?: string | null, includeAttachments?: boolean | null } | null, slack?: { __typename?: 'SlackFeedProperties', readLimit?: number | null, type?: FeedListingTypes | null, token: string, channel: string, includeAttachments?: boolean | null } | null, microsoftTeams?: { __typename?: 'MicrosoftTeamsFeedProperties', readLimit?: number | null, type?: FeedListingTypes | null, clientId: string, clientSecret: string, refreshToken: string, teamId: string, channelId: string } | null, discord?: { __typename?: 'DiscordFeedProperties', readLimit?: number | null, type?: FeedListingTypes | null, token: string, channel: string, includeAttachments?: boolean | null } | null, workflow?: { __typename?: 'Workflow', id: string, name: string } | null, schedulePolicy?: { __typename?: 'FeedSchedulePolicy', recurrenceType?: TimedPolicyRecurrenceTypes | null, repeatInterval?: any | null } | null } | null };

export type GetSharePointConsentUriQueryVariables = Exact<{
  tenantId: Scalars['ID']['input'];
}>;


export type GetSharePointConsentUriQuery = { __typename?: 'Query', sharePointConsentUri?: { __typename?: 'UriResult', uri?: any | null } | null };

export type IsFeedDoneQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type IsFeedDoneQuery = { __typename?: 'Query', isFeedDone?: { __typename?: 'BooleanResult', result?: boolean | null } | null };

export type QueryFeedsQueryVariables = Exact<{
  filter?: InputMaybe<FeedFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type QueryFeedsQuery = { __typename?: 'Query', feeds?: { __typename?: 'FeedResults', results?: Array<{ __typename?: 'Feed', id: string, name: string, creationDate: any, relevance?: number | null, state: EntityState, correlationId?: string | null, type: FeedTypes, error?: string | null, lastPostDate?: any | null, lastReadDate?: any | null, readCount?: number | null, owner: { __typename?: 'Owner', id: string }, site?: { __typename?: 'SiteFeedProperties', siteType: SiteTypes, type: FeedServiceTypes, isRecursive?: boolean | null, readLimit?: number | null, s3?: { __typename?: 'AmazonFeedProperties', accessKey?: string | null, secretAccessKey?: string | null, bucketName?: string | null, prefix?: string | null, region?: string | null } | null, azureBlob?: { __typename?: 'AzureBlobFeedProperties', storageAccessKey?: string | null, accountName?: string | null, containerName?: string | null, prefix?: string | null } | null, azureFile?: { __typename?: 'AzureFileFeedProperties', storageAccessKey?: string | null, accountName?: string | null, shareName?: string | null, prefix?: string | null } | null, google?: { __typename?: 'GoogleFeedProperties', credentials?: string | null, containerName?: string | null, prefix?: string | null } | null, sharePoint?: { __typename?: 'SharePointFeedProperties', authenticationType: SharePointAuthenticationTypes, accountName: string, libraryId: string, folderId?: string | null, tenantId?: string | null, clientId?: string | null, clientSecret?: string | null, refreshToken?: string | null } | null, oneDrive?: { __typename?: 'OneDriveFeedProperties', folderId?: string | null, files?: Array<string | null> | null, clientId: string, clientSecret: string, refreshToken: string } | null, googleDrive?: { __typename?: 'GoogleDriveFeedProperties', authenticationType?: GoogleDriveAuthenticationTypes | null, folderId?: string | null, files?: Array<string | null> | null, refreshToken?: string | null, clientId?: string | null, clientSecret?: string | null, serviceAccountJson?: string | null } | null, dropbox?: { __typename?: 'DropboxFeedProperties', path?: string | null, appKey: string, appSecret: string, refreshToken: string, redirectUri: string } | null, box?: { __typename?: 'BoxFeedProperties', folderId?: string | null, clientId: string, clientSecret: string, refreshToken: string, redirectUri: string } | null, github?: { __typename?: 'GitHubFeedProperties', uri?: any | null, repositoryOwner: string, repositoryName: string, refreshToken?: string | null, personalAccessToken?: string | null } | null } | null, email?: { __typename?: 'EmailFeedProperties', type: FeedServiceTypes, includeAttachments?: boolean | null, readLimit?: number | null, google?: { __typename?: 'GoogleEmailFeedProperties', type?: EmailListingTypes | null, includeSpam?: boolean | null, excludeSentItems?: boolean | null, includeDeletedItems?: boolean | null, inboxOnly?: boolean | null, refreshToken?: string | null, clientId: string, clientSecret: string } | null, microsoft?: { __typename?: 'MicrosoftEmailFeedProperties', type?: EmailListingTypes | null, includeSpam?: boolean | null, excludeSentItems?: boolean | null, includeDeletedItems?: boolean | null, inboxOnly?: boolean | null, refreshToken: string, clientId: string, clientSecret: string } | null } | null, issue?: { __typename?: 'IssueFeedProperties', type: FeedServiceTypes, includeAttachments?: boolean | null, readLimit?: number | null, jira?: { __typename?: 'AtlassianJiraFeedProperties', uri: any, project: string, email: string, token: string, offset?: any | null } | null, linear?: { __typename?: 'LinearFeedProperties', key: string, project: string } | null, github?: { __typename?: 'GitHubIssuesFeedProperties', uri?: any | null, repositoryOwner: string, repositoryName: string, refreshToken?: string | null, personalAccessToken?: string | null } | null, intercom?: { __typename?: 'IntercomTicketsFeedProperties', accessToken: string } | null, zendesk?: { __typename?: 'ZendeskTicketsFeedProperties', subdomain: string, accessToken: string } | null, trello?: { __typename?: 'TrelloFeedProperties', key: string, token: string, identifiers: Array<string>, type: TrelloTypes } | null } | null, rss?: { __typename?: 'RSSFeedProperties', readLimit?: number | null, uri: any } | null, web?: { __typename?: 'WebFeedProperties', readLimit?: number | null, uri: any, includeFiles?: boolean | null, allowedPaths?: Array<string> | null, excludedPaths?: Array<string> | null } | null, search?: { __typename?: 'SearchFeedProperties', readLimit?: number | null, type?: SearchServiceTypes | null, text: string } | null, reddit?: { __typename?: 'RedditFeedProperties', readLimit?: number | null, subredditName: string } | null, notion?: { __typename?: 'NotionFeedProperties', readLimit?: number | null, token: string, identifiers: Array<string>, type: NotionTypes } | null, intercom?: { __typename?: 'IntercomFeedProperties', readLimit?: number | null, accessToken: string } | null, zendesk?: { __typename?: 'ZendeskFeedProperties', readLimit?: number | null, subdomain: string, accessToken: string } | null, youtube?: { __typename?: 'YouTubeFeedProperties', readLimit?: number | null, type: YouTubeTypes, videoName?: string | null, videoIdentifiers?: Array<string> | null, channelIdentifier?: string | null, playlistIdentifier?: string | null } | null, twitter?: { __typename?: 'TwitterFeedProperties', readLimit?: number | null, token: string, type?: TwitterListingTypes | null, userName?: string | null, query?: string | null, includeAttachments?: boolean | null } | null, slack?: { __typename?: 'SlackFeedProperties', readLimit?: number | null, type?: FeedListingTypes | null, token: string, channel: string, includeAttachments?: boolean | null } | null, microsoftTeams?: { __typename?: 'MicrosoftTeamsFeedProperties', readLimit?: number | null, type?: FeedListingTypes | null, clientId: string, clientSecret: string, refreshToken: string, teamId: string, channelId: string } | null, discord?: { __typename?: 'DiscordFeedProperties', readLimit?: number | null, type?: FeedListingTypes | null, token: string, channel: string, includeAttachments?: boolean | null } | null, workflow?: { __typename?: 'Workflow', id: string, name: string } | null, schedulePolicy?: { __typename?: 'FeedSchedulePolicy', recurrenceType?: TimedPolicyRecurrenceTypes | null, repeatInterval?: any | null } | null } | null> | null } | null };

export type QueryLinearProjectsQueryVariables = Exact<{
  properties: LinearProjectsInput;
}>;


export type QueryLinearProjectsQuery = { __typename?: 'Query', linearProjects?: { __typename?: 'StringResults', results?: Array<string> | null } | null };

export type QueryMicrosoftTeamsChannelsQueryVariables = Exact<{
  properties: MicrosoftTeamsChannelsInput;
  teamId: Scalars['ID']['input'];
}>;


export type QueryMicrosoftTeamsChannelsQuery = { __typename?: 'Query', microsoftTeamsChannels?: { __typename?: 'MicrosoftTeamsChannelResults', results?: Array<{ __typename?: 'MicrosoftTeamsChannelResult', channelName?: string | null, channelId?: string | null } | null> | null } | null };

export type QueryMicrosoftTeamsTeamsQueryVariables = Exact<{
  properties: MicrosoftTeamsTeamsInput;
}>;


export type QueryMicrosoftTeamsTeamsQuery = { __typename?: 'Query', microsoftTeamsTeams?: { __typename?: 'MicrosoftTeamsTeamResults', results?: Array<{ __typename?: 'MicrosoftTeamsTeamResult', teamName?: string | null, teamId?: string | null } | null> | null } | null };

export type QueryNotionDatabasesQueryVariables = Exact<{
  properties: NotionDatabasesInput;
}>;


export type QueryNotionDatabasesQuery = { __typename?: 'Query', notionDatabases?: { __typename?: 'StringResults', results?: Array<string> | null } | null };

export type QueryNotionPagesQueryVariables = Exact<{
  properties: NotionPagesInput;
  identifier: Scalars['String']['input'];
}>;


export type QueryNotionPagesQuery = { __typename?: 'Query', notionPages?: { __typename?: 'StringResults', results?: Array<string> | null } | null };

export type QueryOneDriveFoldersQueryVariables = Exact<{
  properties: OneDriveFoldersInput;
  folderId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type QueryOneDriveFoldersQuery = { __typename?: 'Query', oneDriveFolders?: { __typename?: 'OneDriveFolderResults', results?: Array<{ __typename?: 'OneDriveFolderResult', folderName?: string | null, folderId?: string | null } | null> | null } | null };

export type QuerySharePointFoldersQueryVariables = Exact<{
  properties: SharePointFoldersInput;
  libraryId: Scalars['ID']['input'];
  folderId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type QuerySharePointFoldersQuery = { __typename?: 'Query', sharePointFolders?: { __typename?: 'SharePointFolderResults', accountName?: string | null, results?: Array<{ __typename?: 'SharePointFolderResult', folderName?: string | null, folderId?: string | null } | null> | null } | null };

export type QuerySharePointLibrariesQueryVariables = Exact<{
  properties: SharePointLibrariesInput;
}>;


export type QuerySharePointLibrariesQuery = { __typename?: 'Query', sharePointLibraries?: { __typename?: 'SharePointLibraryResults', accountName?: string | null, results?: Array<{ __typename?: 'SharePointLibraryResult', libraryName?: string | null, libraryId?: string | null, siteName?: string | null, siteId?: string | null } | null> | null } | null };

export type QuerySlackChannelsQueryVariables = Exact<{
  properties: SlackChannelsInput;
}>;


export type QuerySlackChannelsQuery = { __typename?: 'Query', slackChannels?: { __typename?: 'StringResults', results?: Array<string> | null } | null };

export type UpdateFeedMutationVariables = Exact<{
  feed: FeedUpdateInput;
}>;


export type UpdateFeedMutation = { __typename?: 'Mutation', updateFeed?: { __typename?: 'Feed', id: string, name: string, state: EntityState, type: FeedTypes } | null };

export type CountLabelsQueryVariables = Exact<{
  filter?: InputMaybe<LabelFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CountLabelsQuery = { __typename?: 'Query', countLabels?: { __typename?: 'CountResult', count?: any | null } | null };

export type CreateLabelMutationVariables = Exact<{
  label: LabelInput;
}>;


export type CreateLabelMutation = { __typename?: 'Mutation', createLabel?: { __typename?: 'Label', id: string, name: string } | null };

export type DeleteAllLabelsMutationVariables = Exact<{
  filter?: InputMaybe<LabelFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type DeleteAllLabelsMutation = { __typename?: 'Mutation', deleteAllLabels?: Array<{ __typename?: 'Label', id: string, state: EntityState } | null> | null };

export type DeleteLabelMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteLabelMutation = { __typename?: 'Mutation', deleteLabel?: { __typename?: 'Label', id: string, state: EntityState } | null };

export type DeleteLabelsMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type DeleteLabelsMutation = { __typename?: 'Mutation', deleteLabels?: Array<{ __typename?: 'Label', id: string, state: EntityState } | null> | null };

export type GetLabelQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetLabelQuery = { __typename?: 'Query', label?: { __typename?: 'Label', id: string, name: string, description?: string | null, creationDate: any, relevance?: number | null } | null };

export type QueryLabelsQueryVariables = Exact<{
  filter?: InputMaybe<LabelFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type QueryLabelsQuery = { __typename?: 'Query', labels?: { __typename?: 'LabelResults', results?: Array<{ __typename?: 'Label', id: string, name: string, description?: string | null, creationDate: any, relevance?: number | null } | null> | null } | null };

export type UpdateLabelMutationVariables = Exact<{
  label: LabelUpdateInput;
}>;


export type UpdateLabelMutation = { __typename?: 'Mutation', updateLabel?: { __typename?: 'Label', id: string, name: string } | null };

export type UpsertLabelMutationVariables = Exact<{
  label: LabelInput;
}>;


export type UpsertLabelMutation = { __typename?: 'Mutation', upsertLabel?: { __typename?: 'Label', id: string, name: string } | null };

export type CountMedicalConditionsQueryVariables = Exact<{
  filter?: InputMaybe<MedicalConditionFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CountMedicalConditionsQuery = { __typename?: 'Query', countMedicalConditions?: { __typename?: 'CountResult', count?: any | null } | null };

export type CreateMedicalConditionMutationVariables = Exact<{
  medicalCondition: MedicalConditionInput;
}>;


export type CreateMedicalConditionMutation = { __typename?: 'Mutation', createMedicalCondition?: { __typename?: 'MedicalCondition', id: string, name: string } | null };

export type DeleteAllMedicalConditionsMutationVariables = Exact<{
  filter?: InputMaybe<MedicalConditionFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type DeleteAllMedicalConditionsMutation = { __typename?: 'Mutation', deleteAllMedicalConditions?: Array<{ __typename?: 'MedicalCondition', id: string, state: EntityState } | null> | null };

export type DeleteMedicalConditionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteMedicalConditionMutation = { __typename?: 'Mutation', deleteMedicalCondition?: { __typename?: 'MedicalCondition', id: string, state: EntityState } | null };

export type DeleteMedicalConditionsMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type DeleteMedicalConditionsMutation = { __typename?: 'Mutation', deleteMedicalConditions?: Array<{ __typename?: 'MedicalCondition', id: string, state: EntityState } | null> | null };

export type GetMedicalConditionQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetMedicalConditionQuery = { __typename?: 'Query', medicalCondition?: { __typename?: 'MedicalCondition', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, uri?: any | null, description?: string | null, identifier?: string | null, thing?: string | null, relevance?: number | null } | null };

export type QueryMedicalConditionsQueryVariables = Exact<{
  filter?: InputMaybe<MedicalConditionFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type QueryMedicalConditionsQuery = { __typename?: 'Query', medicalConditions?: { __typename?: 'MedicalConditionResults', results?: Array<{ __typename?: 'MedicalCondition', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, uri?: any | null, description?: string | null, identifier?: string | null, thing?: string | null, relevance?: number | null } | null> | null } | null };

export type UpdateMedicalConditionMutationVariables = Exact<{
  medicalCondition: MedicalConditionUpdateInput;
}>;


export type UpdateMedicalConditionMutation = { __typename?: 'Mutation', updateMedicalCondition?: { __typename?: 'MedicalCondition', id: string, name: string } | null };

export type CountMedicalContraindicationsQueryVariables = Exact<{
  filter?: InputMaybe<MedicalContraindicationFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CountMedicalContraindicationsQuery = { __typename?: 'Query', countMedicalContraindications?: { __typename?: 'CountResult', count?: any | null } | null };

export type CreateMedicalContraindicationMutationVariables = Exact<{
  medicalContraindication: MedicalContraindicationInput;
}>;


export type CreateMedicalContraindicationMutation = { __typename?: 'Mutation', createMedicalContraindication?: { __typename?: 'MedicalContraindication', id: string, name: string } | null };

export type DeleteAllMedicalContraindicationsMutationVariables = Exact<{
  filter?: InputMaybe<MedicalContraindicationFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type DeleteAllMedicalContraindicationsMutation = { __typename?: 'Mutation', deleteAllMedicalContraindications?: Array<{ __typename?: 'MedicalContraindication', id: string, state: EntityState } | null> | null };

export type DeleteMedicalContraindicationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteMedicalContraindicationMutation = { __typename?: 'Mutation', deleteMedicalContraindication?: { __typename?: 'MedicalContraindication', id: string, state: EntityState } | null };

export type DeleteMedicalContraindicationsMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type DeleteMedicalContraindicationsMutation = { __typename?: 'Mutation', deleteMedicalContraindications?: Array<{ __typename?: 'MedicalContraindication', id: string, state: EntityState } | null> | null };

export type GetMedicalContraindicationQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetMedicalContraindicationQuery = { __typename?: 'Query', medicalContraindication?: { __typename?: 'MedicalContraindication', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, uri?: any | null, description?: string | null, identifier?: string | null, thing?: string | null, relevance?: number | null } | null };

export type QueryMedicalContraindicationsQueryVariables = Exact<{
  filter?: InputMaybe<MedicalContraindicationFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type QueryMedicalContraindicationsQuery = { __typename?: 'Query', medicalContraindications?: { __typename?: 'MedicalContraindicationResults', results?: Array<{ __typename?: 'MedicalContraindication', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, uri?: any | null, description?: string | null, identifier?: string | null, thing?: string | null, relevance?: number | null } | null> | null } | null };

export type UpdateMedicalContraindicationMutationVariables = Exact<{
  medicalContraindication: MedicalContraindicationUpdateInput;
}>;


export type UpdateMedicalContraindicationMutation = { __typename?: 'Mutation', updateMedicalContraindication?: { __typename?: 'MedicalContraindication', id: string, name: string } | null };

export type CountMedicalDevicesQueryVariables = Exact<{
  filter?: InputMaybe<MedicalDeviceFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CountMedicalDevicesQuery = { __typename?: 'Query', countMedicalDevices?: { __typename?: 'CountResult', count?: any | null } | null };

export type CreateMedicalDeviceMutationVariables = Exact<{
  medicalDevice: MedicalDeviceInput;
}>;


export type CreateMedicalDeviceMutation = { __typename?: 'Mutation', createMedicalDevice?: { __typename?: 'MedicalDevice', id: string, name: string } | null };

export type DeleteAllMedicalDevicesMutationVariables = Exact<{
  filter?: InputMaybe<MedicalDeviceFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type DeleteAllMedicalDevicesMutation = { __typename?: 'Mutation', deleteAllMedicalDevices?: Array<{ __typename?: 'MedicalDevice', id: string, state: EntityState } | null> | null };

export type DeleteMedicalDeviceMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteMedicalDeviceMutation = { __typename?: 'Mutation', deleteMedicalDevice?: { __typename?: 'MedicalDevice', id: string, state: EntityState } | null };

export type DeleteMedicalDevicesMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type DeleteMedicalDevicesMutation = { __typename?: 'Mutation', deleteMedicalDevices?: Array<{ __typename?: 'MedicalDevice', id: string, state: EntityState } | null> | null };

export type GetMedicalDeviceQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetMedicalDeviceQuery = { __typename?: 'Query', medicalDevice?: { __typename?: 'MedicalDevice', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, uri?: any | null, description?: string | null, identifier?: string | null, thing?: string | null, relevance?: number | null } | null };

export type QueryMedicalDevicesQueryVariables = Exact<{
  filter?: InputMaybe<MedicalDeviceFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type QueryMedicalDevicesQuery = { __typename?: 'Query', medicalDevices?: { __typename?: 'MedicalDeviceResults', results?: Array<{ __typename?: 'MedicalDevice', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, uri?: any | null, description?: string | null, identifier?: string | null, thing?: string | null, relevance?: number | null } | null> | null } | null };

export type UpdateMedicalDeviceMutationVariables = Exact<{
  medicalDevice: MedicalDeviceUpdateInput;
}>;


export type UpdateMedicalDeviceMutation = { __typename?: 'Mutation', updateMedicalDevice?: { __typename?: 'MedicalDevice', id: string, name: string } | null };

export type CountMedicalDrugsQueryVariables = Exact<{
  filter?: InputMaybe<MedicalDrugFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CountMedicalDrugsQuery = { __typename?: 'Query', countMedicalDrugs?: { __typename?: 'CountResult', count?: any | null } | null };

export type CreateMedicalDrugMutationVariables = Exact<{
  medicalDrug: MedicalDrugInput;
}>;


export type CreateMedicalDrugMutation = { __typename?: 'Mutation', createMedicalDrug?: { __typename?: 'MedicalDrug', id: string, name: string } | null };

export type DeleteAllMedicalDrugsMutationVariables = Exact<{
  filter?: InputMaybe<MedicalDrugFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type DeleteAllMedicalDrugsMutation = { __typename?: 'Mutation', deleteAllMedicalDrugs?: Array<{ __typename?: 'MedicalDrug', id: string, state: EntityState } | null> | null };

export type DeleteMedicalDrugMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteMedicalDrugMutation = { __typename?: 'Mutation', deleteMedicalDrug?: { __typename?: 'MedicalDrug', id: string, state: EntityState } | null };

export type DeleteMedicalDrugsMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type DeleteMedicalDrugsMutation = { __typename?: 'Mutation', deleteMedicalDrugs?: Array<{ __typename?: 'MedicalDrug', id: string, state: EntityState } | null> | null };

export type GetMedicalDrugQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetMedicalDrugQuery = { __typename?: 'Query', medicalDrug?: { __typename?: 'MedicalDrug', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, uri?: any | null, description?: string | null, identifier?: string | null, thing?: string | null, relevance?: number | null } | null };

export type QueryMedicalDrugsQueryVariables = Exact<{
  filter?: InputMaybe<MedicalDrugFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type QueryMedicalDrugsQuery = { __typename?: 'Query', medicalDrugs?: { __typename?: 'MedicalDrugResults', results?: Array<{ __typename?: 'MedicalDrug', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, uri?: any | null, description?: string | null, identifier?: string | null, thing?: string | null, relevance?: number | null } | null> | null } | null };

export type UpdateMedicalDrugMutationVariables = Exact<{
  medicalDrug: MedicalDrugUpdateInput;
}>;


export type UpdateMedicalDrugMutation = { __typename?: 'Mutation', updateMedicalDrug?: { __typename?: 'MedicalDrug', id: string, name: string } | null };

export type CountMedicalDrugClassesQueryVariables = Exact<{
  filter?: InputMaybe<MedicalDrugClassFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CountMedicalDrugClassesQuery = { __typename?: 'Query', countMedicalDrugClasses?: { __typename?: 'CountResult', count?: any | null } | null };

export type CreateMedicalDrugClassMutationVariables = Exact<{
  medicalDrugClass: MedicalDrugClassInput;
}>;


export type CreateMedicalDrugClassMutation = { __typename?: 'Mutation', createMedicalDrugClass?: { __typename?: 'MedicalDrugClass', id: string, name: string } | null };

export type DeleteAllMedicalDrugClassesMutationVariables = Exact<{
  filter?: InputMaybe<MedicalDrugClassFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type DeleteAllMedicalDrugClassesMutation = { __typename?: 'Mutation', deleteAllMedicalDrugClasses?: Array<{ __typename?: 'MedicalDrugClass', id: string, state: EntityState } | null> | null };

export type DeleteMedicalDrugClassMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteMedicalDrugClassMutation = { __typename?: 'Mutation', deleteMedicalDrugClass?: { __typename?: 'MedicalDrugClass', id: string, state: EntityState } | null };

export type DeleteMedicalDrugClassesMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type DeleteMedicalDrugClassesMutation = { __typename?: 'Mutation', deleteMedicalDrugClasses?: Array<{ __typename?: 'MedicalDrugClass', id: string, state: EntityState } | null> | null };

export type GetMedicalDrugClassQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetMedicalDrugClassQuery = { __typename?: 'Query', medicalDrugClass?: { __typename?: 'MedicalDrugClass', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, uri?: any | null, description?: string | null, identifier?: string | null, thing?: string | null, relevance?: number | null } | null };

export type QueryMedicalDrugClassesQueryVariables = Exact<{
  filter?: InputMaybe<MedicalDrugClassFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type QueryMedicalDrugClassesQuery = { __typename?: 'Query', medicalDrugClasses?: { __typename?: 'MedicalDrugClassResults', results?: Array<{ __typename?: 'MedicalDrugClass', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, uri?: any | null, description?: string | null, identifier?: string | null, thing?: string | null, relevance?: number | null } | null> | null } | null };

export type UpdateMedicalDrugClassMutationVariables = Exact<{
  medicalDrugClass: MedicalDrugClassUpdateInput;
}>;


export type UpdateMedicalDrugClassMutation = { __typename?: 'Mutation', updateMedicalDrugClass?: { __typename?: 'MedicalDrugClass', id: string, name: string } | null };

export type CountMedicalGuidelinesQueryVariables = Exact<{
  filter?: InputMaybe<MedicalGuidelineFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CountMedicalGuidelinesQuery = { __typename?: 'Query', countMedicalGuidelines?: { __typename?: 'CountResult', count?: any | null } | null };

export type CreateMedicalGuidelineMutationVariables = Exact<{
  medicalGuideline: MedicalGuidelineInput;
}>;


export type CreateMedicalGuidelineMutation = { __typename?: 'Mutation', createMedicalGuideline?: { __typename?: 'MedicalGuideline', id: string, name: string } | null };

export type DeleteAllMedicalGuidelinesMutationVariables = Exact<{
  filter?: InputMaybe<MedicalGuidelineFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type DeleteAllMedicalGuidelinesMutation = { __typename?: 'Mutation', deleteAllMedicalGuidelines?: Array<{ __typename?: 'MedicalGuideline', id: string, state: EntityState } | null> | null };

export type DeleteMedicalGuidelineMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteMedicalGuidelineMutation = { __typename?: 'Mutation', deleteMedicalGuideline?: { __typename?: 'MedicalGuideline', id: string, state: EntityState } | null };

export type DeleteMedicalGuidelinesMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type DeleteMedicalGuidelinesMutation = { __typename?: 'Mutation', deleteMedicalGuidelines?: Array<{ __typename?: 'MedicalGuideline', id: string, state: EntityState } | null> | null };

export type GetMedicalGuidelineQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetMedicalGuidelineQuery = { __typename?: 'Query', medicalGuideline?: { __typename?: 'MedicalGuideline', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, uri?: any | null, description?: string | null, identifier?: string | null, thing?: string | null, relevance?: number | null } | null };

export type QueryMedicalGuidelinesQueryVariables = Exact<{
  filter?: InputMaybe<MedicalGuidelineFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type QueryMedicalGuidelinesQuery = { __typename?: 'Query', medicalGuidelines?: { __typename?: 'MedicalGuidelineResults', results?: Array<{ __typename?: 'MedicalGuideline', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, uri?: any | null, description?: string | null, identifier?: string | null, thing?: string | null, relevance?: number | null } | null> | null } | null };

export type UpdateMedicalGuidelineMutationVariables = Exact<{
  medicalGuideline: MedicalGuidelineUpdateInput;
}>;


export type UpdateMedicalGuidelineMutation = { __typename?: 'Mutation', updateMedicalGuideline?: { __typename?: 'MedicalGuideline', id: string, name: string } | null };

export type CountMedicalIndicationsQueryVariables = Exact<{
  filter?: InputMaybe<MedicalIndicationFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CountMedicalIndicationsQuery = { __typename?: 'Query', countMedicalIndications?: { __typename?: 'CountResult', count?: any | null } | null };

export type CreateMedicalIndicationMutationVariables = Exact<{
  medicalIndication: MedicalIndicationInput;
}>;


export type CreateMedicalIndicationMutation = { __typename?: 'Mutation', createMedicalIndication?: { __typename?: 'MedicalIndication', id: string, name: string } | null };

export type DeleteAllMedicalIndicationsMutationVariables = Exact<{
  filter?: InputMaybe<MedicalIndicationFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type DeleteAllMedicalIndicationsMutation = { __typename?: 'Mutation', deleteAllMedicalIndications?: Array<{ __typename?: 'MedicalIndication', id: string, state: EntityState } | null> | null };

export type DeleteMedicalIndicationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteMedicalIndicationMutation = { __typename?: 'Mutation', deleteMedicalIndication?: { __typename?: 'MedicalIndication', id: string, state: EntityState } | null };

export type DeleteMedicalIndicationsMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type DeleteMedicalIndicationsMutation = { __typename?: 'Mutation', deleteMedicalIndications?: Array<{ __typename?: 'MedicalIndication', id: string, state: EntityState } | null> | null };

export type GetMedicalIndicationQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetMedicalIndicationQuery = { __typename?: 'Query', medicalIndication?: { __typename?: 'MedicalIndication', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, uri?: any | null, description?: string | null, identifier?: string | null, thing?: string | null, relevance?: number | null } | null };

export type QueryMedicalIndicationsQueryVariables = Exact<{
  filter?: InputMaybe<MedicalIndicationFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type QueryMedicalIndicationsQuery = { __typename?: 'Query', medicalIndications?: { __typename?: 'MedicalIndicationResults', results?: Array<{ __typename?: 'MedicalIndication', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, uri?: any | null, description?: string | null, identifier?: string | null, thing?: string | null, relevance?: number | null } | null> | null } | null };

export type UpdateMedicalIndicationMutationVariables = Exact<{
  medicalIndication: MedicalIndicationUpdateInput;
}>;


export type UpdateMedicalIndicationMutation = { __typename?: 'Mutation', updateMedicalIndication?: { __typename?: 'MedicalIndication', id: string, name: string } | null };

export type CountMedicalProceduresQueryVariables = Exact<{
  filter?: InputMaybe<MedicalProcedureFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CountMedicalProceduresQuery = { __typename?: 'Query', countMedicalProcedures?: { __typename?: 'CountResult', count?: any | null } | null };

export type CreateMedicalProcedureMutationVariables = Exact<{
  medicalProcedure: MedicalProcedureInput;
}>;


export type CreateMedicalProcedureMutation = { __typename?: 'Mutation', createMedicalProcedure?: { __typename?: 'MedicalProcedure', id: string, name: string } | null };

export type DeleteAllMedicalProceduresMutationVariables = Exact<{
  filter?: InputMaybe<MedicalProcedureFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type DeleteAllMedicalProceduresMutation = { __typename?: 'Mutation', deleteAllMedicalProcedures?: Array<{ __typename?: 'MedicalProcedure', id: string, state: EntityState } | null> | null };

export type DeleteMedicalProcedureMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteMedicalProcedureMutation = { __typename?: 'Mutation', deleteMedicalProcedure?: { __typename?: 'MedicalProcedure', id: string, state: EntityState } | null };

export type DeleteMedicalProceduresMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type DeleteMedicalProceduresMutation = { __typename?: 'Mutation', deleteMedicalProcedures?: Array<{ __typename?: 'MedicalProcedure', id: string, state: EntityState } | null> | null };

export type GetMedicalProcedureQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetMedicalProcedureQuery = { __typename?: 'Query', medicalProcedure?: { __typename?: 'MedicalProcedure', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, uri?: any | null, description?: string | null, identifier?: string | null, thing?: string | null, relevance?: number | null } | null };

export type QueryMedicalProceduresQueryVariables = Exact<{
  filter?: InputMaybe<MedicalProcedureFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type QueryMedicalProceduresQuery = { __typename?: 'Query', medicalProcedures?: { __typename?: 'MedicalProcedureResults', results?: Array<{ __typename?: 'MedicalProcedure', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, uri?: any | null, description?: string | null, identifier?: string | null, thing?: string | null, relevance?: number | null } | null> | null } | null };

export type UpdateMedicalProcedureMutationVariables = Exact<{
  medicalProcedure: MedicalProcedureUpdateInput;
}>;


export type UpdateMedicalProcedureMutation = { __typename?: 'Mutation', updateMedicalProcedure?: { __typename?: 'MedicalProcedure', id: string, name: string } | null };

export type CountMedicalStudiesQueryVariables = Exact<{
  filter?: InputMaybe<MedicalStudyFilter>;
}>;


export type CountMedicalStudiesQuery = { __typename?: 'Query', countMedicalStudies?: { __typename?: 'CountResult', count?: any | null } | null };

export type CreateMedicalStudyMutationVariables = Exact<{
  medicalStudy: MedicalStudyInput;
}>;


export type CreateMedicalStudyMutation = { __typename?: 'Mutation', createMedicalStudy?: { __typename?: 'MedicalStudy', id: string, name: string } | null };

export type DeleteAllMedicalStudiesMutationVariables = Exact<{
  filter?: InputMaybe<MedicalStudyFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type DeleteAllMedicalStudiesMutation = { __typename?: 'Mutation', deleteAllMedicalStudies?: Array<{ __typename?: 'MedicalStudy', id: string, state: EntityState } | null> | null };

export type DeleteMedicalStudiesMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type DeleteMedicalStudiesMutation = { __typename?: 'Mutation', deleteMedicalStudies?: Array<{ __typename?: 'MedicalStudy', id: string, state: EntityState } | null> | null };

export type DeleteMedicalStudyMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteMedicalStudyMutation = { __typename?: 'Mutation', deleteMedicalStudy?: { __typename?: 'MedicalStudy', id: string, state: EntityState } | null };

export type GetMedicalStudyQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetMedicalStudyQuery = { __typename?: 'Query', medicalStudy?: { __typename?: 'MedicalStudy', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, uri?: any | null, description?: string | null, identifier?: string | null, thing?: string | null, relevance?: number | null, address?: { __typename?: 'Address', streetAddress?: string | null, city?: string | null, region?: string | null, country?: string | null, postalCode?: string | null } | null } | null };

export type QueryMedicalStudiesQueryVariables = Exact<{
  filter?: InputMaybe<MedicalStudyFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type QueryMedicalStudiesQuery = { __typename?: 'Query', medicalStudies?: { __typename?: 'MedicalStudyResults', results?: Array<{ __typename?: 'MedicalStudy', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, uri?: any | null, description?: string | null, identifier?: string | null, thing?: string | null, relevance?: number | null, address?: { __typename?: 'Address', streetAddress?: string | null, city?: string | null, region?: string | null, country?: string | null, postalCode?: string | null } | null } | null> | null } | null };

export type UpdateMedicalStudyMutationVariables = Exact<{
  medicalStudy: MedicalStudyUpdateInput;
}>;


export type UpdateMedicalStudyMutation = { __typename?: 'Mutation', updateMedicalStudy?: { __typename?: 'MedicalStudy', id: string, name: string } | null };

export type CountMedicalTestsQueryVariables = Exact<{
  filter?: InputMaybe<MedicalTestFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CountMedicalTestsQuery = { __typename?: 'Query', countMedicalTests?: { __typename?: 'CountResult', count?: any | null } | null };

export type CreateMedicalTestMutationVariables = Exact<{
  medicalTest: MedicalTestInput;
}>;


export type CreateMedicalTestMutation = { __typename?: 'Mutation', createMedicalTest?: { __typename?: 'MedicalTest', id: string, name: string } | null };

export type DeleteAllMedicalTestsMutationVariables = Exact<{
  filter?: InputMaybe<MedicalTestFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type DeleteAllMedicalTestsMutation = { __typename?: 'Mutation', deleteAllMedicalTests?: Array<{ __typename?: 'MedicalTest', id: string, state: EntityState } | null> | null };

export type DeleteMedicalTestMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteMedicalTestMutation = { __typename?: 'Mutation', deleteMedicalTest?: { __typename?: 'MedicalTest', id: string, state: EntityState } | null };

export type DeleteMedicalTestsMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type DeleteMedicalTestsMutation = { __typename?: 'Mutation', deleteMedicalTests?: Array<{ __typename?: 'MedicalTest', id: string, state: EntityState } | null> | null };

export type GetMedicalTestQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetMedicalTestQuery = { __typename?: 'Query', medicalTest?: { __typename?: 'MedicalTest', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, uri?: any | null, description?: string | null, identifier?: string | null, thing?: string | null, relevance?: number | null } | null };

export type QueryMedicalTestsQueryVariables = Exact<{
  filter?: InputMaybe<MedicalTestFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type QueryMedicalTestsQuery = { __typename?: 'Query', medicalTests?: { __typename?: 'MedicalTestResults', results?: Array<{ __typename?: 'MedicalTest', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, uri?: any | null, description?: string | null, identifier?: string | null, thing?: string | null, relevance?: number | null } | null> | null } | null };

export type UpdateMedicalTestMutationVariables = Exact<{
  medicalTest: MedicalTestUpdateInput;
}>;


export type UpdateMedicalTestMutation = { __typename?: 'Mutation', updateMedicalTest?: { __typename?: 'MedicalTest', id: string, name: string } | null };

export type CountMedicalTherapiesQueryVariables = Exact<{
  filter?: InputMaybe<MedicalTherapyFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CountMedicalTherapiesQuery = { __typename?: 'Query', countMedicalTherapies?: { __typename?: 'CountResult', count?: any | null } | null };

export type CreateMedicalTherapyMutationVariables = Exact<{
  medicalTherapy: MedicalTherapyInput;
}>;


export type CreateMedicalTherapyMutation = { __typename?: 'Mutation', createMedicalTherapy?: { __typename?: 'MedicalTherapy', id: string, name: string } | null };

export type DeleteAllMedicalTherapiesMutationVariables = Exact<{
  filter?: InputMaybe<MedicalTherapyFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type DeleteAllMedicalTherapiesMutation = { __typename?: 'Mutation', deleteAllMedicalTherapies?: Array<{ __typename?: 'MedicalTherapy', id: string, state: EntityState } | null> | null };

export type DeleteMedicalTherapiesMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type DeleteMedicalTherapiesMutation = { __typename?: 'Mutation', deleteMedicalTherapies?: Array<{ __typename?: 'MedicalTherapy', id: string, state: EntityState } | null> | null };

export type DeleteMedicalTherapyMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteMedicalTherapyMutation = { __typename?: 'Mutation', deleteMedicalTherapy?: { __typename?: 'MedicalTherapy', id: string, state: EntityState } | null };

export type GetMedicalTherapyQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetMedicalTherapyQuery = { __typename?: 'Query', medicalTherapy?: { __typename?: 'MedicalTherapy', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, uri?: any | null, description?: string | null, identifier?: string | null, thing?: string | null, relevance?: number | null } | null };

export type QueryMedicalTherapiesQueryVariables = Exact<{
  filter?: InputMaybe<MedicalTherapyFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type QueryMedicalTherapiesQuery = { __typename?: 'Query', medicalTherapies?: { __typename?: 'MedicalTherapyResults', results?: Array<{ __typename?: 'MedicalTherapy', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, uri?: any | null, description?: string | null, identifier?: string | null, thing?: string | null, relevance?: number | null } | null> | null } | null };

export type UpdateMedicalTherapyMutationVariables = Exact<{
  medicalTherapy: MedicalTherapyUpdateInput;
}>;


export type UpdateMedicalTherapyMutation = { __typename?: 'Mutation', updateMedicalTherapy?: { __typename?: 'MedicalTherapy', id: string, name: string } | null };

export type SendNotificationMutationVariables = Exact<{
  connector: IntegrationConnectorInput;
  text: Scalars['String']['input'];
  textType?: InputMaybe<TextTypes>;
}>;


export type SendNotificationMutation = { __typename?: 'Mutation', sendNotification?: { __typename?: 'BooleanResult', result?: boolean | null } | null };

export type CreateObservationMutationVariables = Exact<{
  observation: ObservationInput;
}>;


export type CreateObservationMutation = { __typename?: 'Mutation', createObservation?: { __typename?: 'Observation', id: string, state: EntityState } | null };

export type DeleteObservationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteObservationMutation = { __typename?: 'Mutation', deleteObservation?: { __typename?: 'Observation', id: string, state: EntityState } | null };

export type UpdateObservationMutationVariables = Exact<{
  observation: ObservationUpdateInput;
}>;


export type UpdateObservationMutation = { __typename?: 'Mutation', updateObservation?: { __typename?: 'Observation', id: string, state: EntityState } | null };

export type CountOrganizationsQueryVariables = Exact<{
  filter?: InputMaybe<OrganizationFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CountOrganizationsQuery = { __typename?: 'Query', countOrganizations?: { __typename?: 'CountResult', count?: any | null } | null };

export type CreateOrganizationMutationVariables = Exact<{
  organization: OrganizationInput;
}>;


export type CreateOrganizationMutation = { __typename?: 'Mutation', createOrganization?: { __typename?: 'Organization', id: string, name: string } | null };

export type DeleteAllOrganizationsMutationVariables = Exact<{
  filter?: InputMaybe<OrganizationFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type DeleteAllOrganizationsMutation = { __typename?: 'Mutation', deleteAllOrganizations?: Array<{ __typename?: 'Organization', id: string, state: EntityState } | null> | null };

export type DeleteOrganizationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteOrganizationMutation = { __typename?: 'Mutation', deleteOrganization?: { __typename?: 'Organization', id: string, state: EntityState } | null };

export type DeleteOrganizationsMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type DeleteOrganizationsMutation = { __typename?: 'Mutation', deleteOrganizations?: Array<{ __typename?: 'Organization', id: string, state: EntityState } | null> | null };

export type GetOrganizationQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetOrganizationQuery = { __typename?: 'Query', organization?: { __typename?: 'Organization', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, uri?: any | null, description?: string | null, identifier?: string | null, thing?: string | null, relevance?: number | null, foundingDate?: any | null, industries?: Array<string | null> | null, revenue?: any | null, revenueCurrency?: string | null, investment?: any | null, investmentCurrency?: string | null, address?: { __typename?: 'Address', streetAddress?: string | null, city?: string | null, region?: string | null, country?: string | null, postalCode?: string | null } | null } | null };

export type QueryOrganizationsQueryVariables = Exact<{
  filter?: InputMaybe<OrganizationFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type QueryOrganizationsQuery = { __typename?: 'Query', organizations?: { __typename?: 'OrganizationResults', results?: Array<{ __typename?: 'Organization', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, uri?: any | null, description?: string | null, identifier?: string | null, thing?: string | null, relevance?: number | null, foundingDate?: any | null, industries?: Array<string | null> | null, revenue?: any | null, revenueCurrency?: string | null, investment?: any | null, investmentCurrency?: string | null, address?: { __typename?: 'Address', streetAddress?: string | null, city?: string | null, region?: string | null, country?: string | null, postalCode?: string | null } | null } | null> | null } | null };

export type UpdateOrganizationMutationVariables = Exact<{
  organization: OrganizationUpdateInput;
}>;


export type UpdateOrganizationMutation = { __typename?: 'Mutation', updateOrganization?: { __typename?: 'Organization', id: string, name: string } | null };

export type CountPersonsQueryVariables = Exact<{
  filter?: InputMaybe<PersonFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CountPersonsQuery = { __typename?: 'Query', countPersons?: { __typename?: 'CountResult', count?: any | null } | null };

export type CreatePersonMutationVariables = Exact<{
  person: PersonInput;
}>;


export type CreatePersonMutation = { __typename?: 'Mutation', createPerson?: { __typename?: 'Person', id: string, name: string } | null };

export type DeleteAllPersonsMutationVariables = Exact<{
  filter?: InputMaybe<PersonFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type DeleteAllPersonsMutation = { __typename?: 'Mutation', deleteAllPersons?: Array<{ __typename?: 'Person', id: string, state: EntityState } | null> | null };

export type DeletePersonMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeletePersonMutation = { __typename?: 'Mutation', deletePerson?: { __typename?: 'Person', id: string, state: EntityState } | null };

export type DeletePersonsMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type DeletePersonsMutation = { __typename?: 'Mutation', deletePersons?: Array<{ __typename?: 'Person', id: string, state: EntityState } | null> | null };

export type GetPersonQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetPersonQuery = { __typename?: 'Query', person?: { __typename?: 'Person', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, uri?: any | null, description?: string | null, identifier?: string | null, thing?: string | null, relevance?: number | null, email?: string | null, givenName?: string | null, familyName?: string | null, phoneNumber?: string | null, birthDate?: any | null, title?: string | null, occupation?: string | null, education?: string | null, address?: { __typename?: 'Address', streetAddress?: string | null, city?: string | null, region?: string | null, country?: string | null, postalCode?: string | null } | null } | null };

export type QueryPersonsQueryVariables = Exact<{
  filter?: InputMaybe<PersonFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type QueryPersonsQuery = { __typename?: 'Query', persons?: { __typename?: 'PersonResults', results?: Array<{ __typename?: 'Person', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, uri?: any | null, description?: string | null, identifier?: string | null, thing?: string | null, relevance?: number | null, email?: string | null, givenName?: string | null, familyName?: string | null, phoneNumber?: string | null, birthDate?: any | null, title?: string | null, occupation?: string | null, education?: string | null, address?: { __typename?: 'Address', streetAddress?: string | null, city?: string | null, region?: string | null, country?: string | null, postalCode?: string | null } | null } | null> | null } | null };

export type UpdatePersonMutationVariables = Exact<{
  person: PersonUpdateInput;
}>;


export type UpdatePersonMutation = { __typename?: 'Mutation', updatePerson?: { __typename?: 'Person', id: string, name: string } | null };

export type CountPlacesQueryVariables = Exact<{
  filter?: InputMaybe<PlaceFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CountPlacesQuery = { __typename?: 'Query', countPlaces?: { __typename?: 'CountResult', count?: any | null } | null };

export type CreatePlaceMutationVariables = Exact<{
  place: PlaceInput;
}>;


export type CreatePlaceMutation = { __typename?: 'Mutation', createPlace?: { __typename?: 'Place', id: string, name: string } | null };

export type DeleteAllPlacesMutationVariables = Exact<{
  filter?: InputMaybe<PlaceFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type DeleteAllPlacesMutation = { __typename?: 'Mutation', deleteAllPlaces?: Array<{ __typename?: 'Place', id: string, state: EntityState } | null> | null };

export type DeletePlaceMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeletePlaceMutation = { __typename?: 'Mutation', deletePlace?: { __typename?: 'Place', id: string, state: EntityState } | null };

export type DeletePlacesMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type DeletePlacesMutation = { __typename?: 'Mutation', deletePlaces?: Array<{ __typename?: 'Place', id: string, state: EntityState } | null> | null };

export type GetPlaceQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetPlaceQuery = { __typename?: 'Query', place?: { __typename?: 'Place', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, uri?: any | null, description?: string | null, identifier?: string | null, thing?: string | null, relevance?: number | null, address?: { __typename?: 'Address', streetAddress?: string | null, city?: string | null, region?: string | null, country?: string | null, postalCode?: string | null } | null } | null };

export type QueryPlacesQueryVariables = Exact<{
  filter?: InputMaybe<PlaceFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type QueryPlacesQuery = { __typename?: 'Query', places?: { __typename?: 'PlaceResults', results?: Array<{ __typename?: 'Place', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, uri?: any | null, description?: string | null, identifier?: string | null, thing?: string | null, relevance?: number | null, address?: { __typename?: 'Address', streetAddress?: string | null, city?: string | null, region?: string | null, country?: string | null, postalCode?: string | null } | null } | null> | null } | null };

export type UpdatePlaceMutationVariables = Exact<{
  place: PlaceUpdateInput;
}>;


export type UpdatePlaceMutation = { __typename?: 'Mutation', updatePlace?: { __typename?: 'Place', id: string, name: string } | null };

export type CountProductsQueryVariables = Exact<{
  filter?: InputMaybe<ProductFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CountProductsQuery = { __typename?: 'Query', countProducts?: { __typename?: 'CountResult', count?: any | null } | null };

export type CreateProductMutationVariables = Exact<{
  product: ProductInput;
}>;


export type CreateProductMutation = { __typename?: 'Mutation', createProduct?: { __typename?: 'Product', id: string, name: string } | null };

export type DeleteAllProductsMutationVariables = Exact<{
  filter?: InputMaybe<ProductFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type DeleteAllProductsMutation = { __typename?: 'Mutation', deleteAllProducts?: Array<{ __typename?: 'Product', id: string, state: EntityState } | null> | null };

export type DeleteProductMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteProductMutation = { __typename?: 'Mutation', deleteProduct?: { __typename?: 'Product', id: string, state: EntityState } | null };

export type DeleteProductsMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type DeleteProductsMutation = { __typename?: 'Mutation', deleteProducts?: Array<{ __typename?: 'Product', id: string, state: EntityState } | null> | null };

export type GetProductQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetProductQuery = { __typename?: 'Query', product?: { __typename?: 'Product', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, uri?: any | null, description?: string | null, identifier?: string | null, thing?: string | null, relevance?: number | null, manufacturer?: string | null, model?: string | null, brand?: string | null, upc?: string | null, sku?: string | null, releaseDate?: any | null, productionDate?: any | null, address?: { __typename?: 'Address', streetAddress?: string | null, city?: string | null, region?: string | null, country?: string | null, postalCode?: string | null } | null } | null };

export type QueryProductsQueryVariables = Exact<{
  filter?: InputMaybe<ProductFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type QueryProductsQuery = { __typename?: 'Query', products?: { __typename?: 'ProductResults', results?: Array<{ __typename?: 'Product', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, uri?: any | null, description?: string | null, identifier?: string | null, thing?: string | null, relevance?: number | null, manufacturer?: string | null, model?: string | null, brand?: string | null, upc?: string | null, sku?: string | null, releaseDate?: any | null, productionDate?: any | null, address?: { __typename?: 'Address', streetAddress?: string | null, city?: string | null, region?: string | null, country?: string | null, postalCode?: string | null } | null } | null> | null } | null };

export type UpdateProductMutationVariables = Exact<{
  product: ProductUpdateInput;
}>;


export type UpdateProductMutation = { __typename?: 'Mutation', updateProduct?: { __typename?: 'Product', id: string, name: string } | null };

export type GetProjectQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProjectQuery = { __typename?: 'Query', project?: { __typename?: 'Project', id: string, name: string, creationDate: any, modifiedDate?: any | null, state: EntityState, environmentType?: EnvironmentTypes | null, platform?: ResourceConnectorTypes | null, region?: string | null, credits?: any | null, lastCreditsDate?: any | null, callbackUri?: any | null, workflow?: { __typename?: 'Workflow', id: string, name: string } | null, specification?: { __typename?: 'Specification', id: string, name: string } | null, embeddings?: { __typename?: 'EmbeddingsStrategy', textSpecification?: { __typename?: 'EntityReference', id: string } | null, imageSpecification?: { __typename?: 'EntityReference', id: string } | null } | null, quota?: { __typename?: 'ProjectQuota', storage?: any | null, contents?: number | null, credits?: number | null, feeds?: number | null, posts?: number | null, conversations?: number | null } | null } | null };

export type LookupCreditsQueryVariables = Exact<{
  correlationId: Scalars['String']['input'];
}>;


export type LookupCreditsQuery = { __typename?: 'Query', lookupCredits?: { __typename?: 'ProjectCredits', correlationId?: string | null, ownerId?: string | null, credits?: any | null, storageRatio?: any | null, computeRatio?: any | null, embeddingRatio?: any | null, completionRatio?: any | null, generationRatio?: any | null, ingestionRatio?: any | null, indexingRatio?: any | null, preparationRatio?: any | null, extractionRatio?: any | null, classificationRatio?: any | null, enrichmentRatio?: any | null, publishingRatio?: any | null, searchRatio?: any | null, conversationRatio?: any | null } | null };

export type LookupUsageQueryVariables = Exact<{
  correlationId: Scalars['String']['input'];
}>;


export type LookupUsageQuery = { __typename?: 'Query', lookupUsage?: Array<{ __typename?: 'ProjectUsageRecord', id?: string | null, correlationId?: string | null, date: any, credits?: any | null, name: string, metric?: BillableMetrics | null, workflow?: string | null, entityType?: EntityTypes | null, entityId?: string | null, projectId: string, ownerId: string, uri?: string | null, duration?: any | null, throughput?: number | null, contentType?: ContentTypes | null, fileType?: FileTypes | null, modelService?: string | null, modelName?: string | null, processorName?: string | null, prompt?: string | null, promptTokens?: number | null, completion?: string | null, completionTokens?: number | null, tokens?: number | null, count?: number | null, operation?: string | null, operationType?: OperationTypes | null, request?: string | null, variables?: string | null, response?: string | null } | null> | null };

export type QueryCreditsQueryVariables = Exact<{
  startDate: Scalars['DateTime']['input'];
  duration: Scalars['TimeSpan']['input'];
}>;


export type QueryCreditsQuery = { __typename?: 'Query', credits?: { __typename?: 'ProjectCredits', correlationId?: string | null, ownerId?: string | null, credits?: any | null, storageRatio?: any | null, computeRatio?: any | null, embeddingRatio?: any | null, completionRatio?: any | null, generationRatio?: any | null, ingestionRatio?: any | null, indexingRatio?: any | null, preparationRatio?: any | null, extractionRatio?: any | null, classificationRatio?: any | null, enrichmentRatio?: any | null, publishingRatio?: any | null, searchRatio?: any | null, conversationRatio?: any | null } | null };

export type QueryTokensQueryVariables = Exact<{
  startDate: Scalars['DateTime']['input'];
  duration: Scalars['TimeSpan']['input'];
}>;


export type QueryTokensQuery = { __typename?: 'Query', tokens?: { __typename?: 'ProjectTokens', correlationId?: string | null, ownerId?: string | null, embeddingInputTokens?: number | null, embeddingModelServices?: Array<string | null> | null, completionInputTokens?: number | null, completionOutputTokens?: number | null, completionModelServices?: Array<string | null> | null, preparationInputTokens?: number | null, preparationOutputTokens?: number | null, preparationModelServices?: Array<string | null> | null, extractionInputTokens?: number | null, extractionOutputTokens?: number | null, extractionModelServices?: Array<string | null> | null, generationInputTokens?: number | null, generationOutputTokens?: number | null, generationModelServices?: Array<string | null> | null } | null };

export type QueryUsageQueryVariables = Exact<{
  startDate: Scalars['DateTime']['input'];
  duration: Scalars['TimeSpan']['input'];
  names?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  excludedNames?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type QueryUsageQuery = { __typename?: 'Query', usage?: Array<{ __typename?: 'ProjectUsageRecord', id?: string | null, correlationId?: string | null, date: any, credits?: any | null, name: string, metric?: BillableMetrics | null, workflow?: string | null, entityType?: EntityTypes | null, entityId?: string | null, projectId: string, ownerId: string, uri?: string | null, duration?: any | null, throughput?: number | null, contentType?: ContentTypes | null, fileType?: FileTypes | null, modelService?: string | null, modelName?: string | null, processorName?: string | null, prompt?: string | null, promptTokens?: number | null, completion?: string | null, completionTokens?: number | null, tokens?: number | null, count?: number | null, operation?: string | null, operationType?: OperationTypes | null, request?: string | null, variables?: string | null, response?: string | null } | null> | null };

export type UpdateProjectMutationVariables = Exact<{
  project: ProjectUpdateInput;
}>;


export type UpdateProjectMutation = { __typename?: 'Mutation', updateProject?: { __typename?: 'Project', id: string, name: string } | null };

export type CountReposQueryVariables = Exact<{
  filter?: InputMaybe<RepoFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CountReposQuery = { __typename?: 'Query', countRepos?: { __typename?: 'CountResult', count?: any | null } | null };

export type CreateRepoMutationVariables = Exact<{
  repo: RepoInput;
}>;


export type CreateRepoMutation = { __typename?: 'Mutation', createRepo?: { __typename?: 'Repo', id: string, name: string } | null };

export type DeleteAllReposMutationVariables = Exact<{
  filter?: InputMaybe<RepoFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type DeleteAllReposMutation = { __typename?: 'Mutation', deleteAllRepos?: Array<{ __typename?: 'Repo', id: string, state: EntityState } | null> | null };

export type DeleteRepoMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteRepoMutation = { __typename?: 'Mutation', deleteRepo?: { __typename?: 'Repo', id: string, state: EntityState } | null };

export type DeleteReposMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type DeleteReposMutation = { __typename?: 'Mutation', deleteRepos?: Array<{ __typename?: 'Repo', id: string, state: EntityState } | null> | null };

export type GetRepoQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetRepoQuery = { __typename?: 'Query', repo?: { __typename?: 'Repo', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, uri?: any | null, description?: string | null, identifier?: string | null, thing?: string | null, relevance?: number | null } | null };

export type QueryReposQueryVariables = Exact<{
  filter?: InputMaybe<RepoFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type QueryReposQuery = { __typename?: 'Query', repos?: { __typename?: 'RepoResults', results?: Array<{ __typename?: 'Repo', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, uri?: any | null, description?: string | null, identifier?: string | null, thing?: string | null, relevance?: number | null } | null> | null } | null };

export type UpdateRepoMutationVariables = Exact<{
  repo: RepoUpdateInput;
}>;


export type UpdateRepoMutation = { __typename?: 'Mutation', updateRepo?: { __typename?: 'Repo', id: string, name: string } | null };

export type MapWebQueryVariables = Exact<{
  uri: Scalars['URL']['input'];
  allowedPaths?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  excludedPaths?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type MapWebQuery = { __typename?: 'Query', mapWeb?: { __typename?: 'UriResults', results?: Array<any | null> | null } | null };

export type SearchWebQueryVariables = Exact<{
  text: Scalars['String']['input'];
  service?: InputMaybe<SearchServiceTypes>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type SearchWebQuery = { __typename?: 'Query', searchWeb?: { __typename?: 'WebSearchResults', results?: Array<{ __typename?: 'WebSearchResult', uri: any, text?: string | null, title?: string | null, score?: number | null }> | null } | null };

export type CountSoftwaresQueryVariables = Exact<{
  filter?: InputMaybe<SoftwareFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CountSoftwaresQuery = { __typename?: 'Query', countSoftwares?: { __typename?: 'CountResult', count?: any | null } | null };

export type CreateSoftwareMutationVariables = Exact<{
  software: SoftwareInput;
}>;


export type CreateSoftwareMutation = { __typename?: 'Mutation', createSoftware?: { __typename?: 'Software', id: string, name: string } | null };

export type DeleteAllSoftwaresMutationVariables = Exact<{
  filter?: InputMaybe<SoftwareFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type DeleteAllSoftwaresMutation = { __typename?: 'Mutation', deleteAllSoftwares?: Array<{ __typename?: 'Software', id: string, state: EntityState } | null> | null };

export type DeleteSoftwareMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteSoftwareMutation = { __typename?: 'Mutation', deleteSoftware?: { __typename?: 'Software', id: string, state: EntityState } | null };

export type DeleteSoftwaresMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type DeleteSoftwaresMutation = { __typename?: 'Mutation', deleteSoftwares?: Array<{ __typename?: 'Software', id: string, state: EntityState } | null> | null };

export type GetSoftwareQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetSoftwareQuery = { __typename?: 'Query', software?: { __typename?: 'Software', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, uri?: any | null, description?: string | null, identifier?: string | null, thing?: string | null, relevance?: number | null, releaseDate?: any | null, developer?: string | null } | null };

export type QuerySoftwaresQueryVariables = Exact<{
  filter?: InputMaybe<SoftwareFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type QuerySoftwaresQuery = { __typename?: 'Query', softwares?: { __typename?: 'SoftwareResults', results?: Array<{ __typename?: 'Software', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, uri?: any | null, description?: string | null, identifier?: string | null, thing?: string | null, relevance?: number | null, releaseDate?: any | null, developer?: string | null } | null> | null } | null };

export type UpdateSoftwareMutationVariables = Exact<{
  software: SoftwareUpdateInput;
}>;


export type UpdateSoftwareMutation = { __typename?: 'Mutation', updateSoftware?: { __typename?: 'Software', id: string, name: string } | null };

export type CountSpecificationsQueryVariables = Exact<{
  filter?: InputMaybe<SpecificationFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CountSpecificationsQuery = { __typename?: 'Query', countSpecifications?: { __typename?: 'CountResult', count?: any | null } | null };

export type CreateSpecificationMutationVariables = Exact<{
  specification: SpecificationInput;
}>;


export type CreateSpecificationMutation = { __typename?: 'Mutation', createSpecification?: { __typename?: 'Specification', id: string, name: string, state: EntityState, type?: SpecificationTypes | null, serviceType?: ModelServiceTypes | null } | null };

export type DeleteAllSpecificationsMutationVariables = Exact<{
  filter?: InputMaybe<SpecificationFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type DeleteAllSpecificationsMutation = { __typename?: 'Mutation', deleteAllSpecifications?: Array<{ __typename?: 'Specification', id: string, state: EntityState } | null> | null };

export type DeleteSpecificationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteSpecificationMutation = { __typename?: 'Mutation', deleteSpecification?: { __typename?: 'Specification', id: string, state: EntityState } | null };

export type DeleteSpecificationsMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type DeleteSpecificationsMutation = { __typename?: 'Mutation', deleteSpecifications?: Array<{ __typename?: 'Specification', id: string, state: EntityState } | null> | null };

export type GetSpecificationQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetSpecificationQuery = { __typename?: 'Query', specification?: { __typename?: 'Specification', id: string, name: string, creationDate: any, relevance?: number | null, state: EntityState, type?: SpecificationTypes | null, serviceType?: ModelServiceTypes | null, systemPrompt?: string | null, customGuidance?: string | null, customInstructions?: string | null, searchType?: ConversationSearchTypes | null, numberSimilar?: number | null, owner: { __typename?: 'Owner', id: string }, strategy?: { __typename?: 'ConversationStrategy', type?: ConversationStrategyTypes | null, messageLimit?: number | null, embedCitations?: boolean | null, flattenCitations?: boolean | null, enableFacets?: boolean | null, messagesWeight?: number | null, contentsWeight?: number | null } | null, promptStrategy?: { __typename?: 'PromptStrategy', type: PromptStrategyTypes } | null, retrievalStrategy?: { __typename?: 'RetrievalStrategy', type: RetrievalStrategyTypes, contentLimit?: number | null, disableFallback?: boolean | null } | null, rerankingStrategy?: { __typename?: 'RerankingStrategy', serviceType: RerankingModelServiceTypes, threshold?: number | null } | null, graphStrategy?: { __typename?: 'GraphStrategy', type: GraphStrategyTypes, generateGraph?: boolean | null, observableLimit?: number | null } | null, revisionStrategy?: { __typename?: 'RevisionStrategy', type: RevisionStrategyTypes, customRevision?: string | null, count?: number | null } | null, azureAI?: { __typename?: 'AzureAIModelProperties', tokenLimit: number, completionTokenLimit?: number | null, key: string, endpoint: any, temperature?: number | null, probability?: number | null, chunkTokenLimit?: number | null } | null, openAI?: { __typename?: 'OpenAIModelProperties', tokenLimit?: number | null, completionTokenLimit?: number | null, model: OpenAiModels, key?: string | null, endpoint?: any | null, modelName?: string | null, temperature?: number | null, probability?: number | null, chunkTokenLimit?: number | null, detailLevel?: OpenAiVisionDetailLevels | null, reasoningEffort?: OpenAiReasoningEffortLevels | null } | null, azureOpenAI?: { __typename?: 'AzureOpenAIModelProperties', tokenLimit?: number | null, completionTokenLimit?: number | null, model: AzureOpenAiModels, key?: string | null, endpoint?: any | null, deploymentName?: string | null, temperature?: number | null, probability?: number | null, chunkTokenLimit?: number | null } | null, cohere?: { __typename?: 'CohereModelProperties', tokenLimit?: number | null, completionTokenLimit?: number | null, model: CohereModels, key?: string | null, modelName?: string | null, temperature?: number | null, probability?: number | null, chunkTokenLimit?: number | null } | null, anthropic?: { __typename?: 'AnthropicModelProperties', tokenLimit?: number | null, completionTokenLimit?: number | null, model: AnthropicModels, key?: string | null, modelName?: string | null, temperature?: number | null, probability?: number | null, enableThinking?: boolean | null, thinkingTokenLimit?: number | null } | null, google?: { __typename?: 'GoogleModelProperties', tokenLimit?: number | null, completionTokenLimit?: number | null, model: GoogleModels, key?: string | null, modelName?: string | null, temperature?: number | null, probability?: number | null, chunkTokenLimit?: number | null, enableThinking?: boolean | null, thinkingTokenLimit?: number | null } | null, replicate?: { __typename?: 'ReplicateModelProperties', tokenLimit?: number | null, completionTokenLimit?: number | null, model: ReplicateModels, key?: string | null, modelName?: string | null, temperature?: number | null, probability?: number | null } | null, mistral?: { __typename?: 'MistralModelProperties', tokenLimit?: number | null, completionTokenLimit?: number | null, model: MistralModels, key?: string | null, modelName?: string | null, endpoint?: any | null, temperature?: number | null, probability?: number | null, chunkTokenLimit?: number | null } | null, bedrock?: { __typename?: 'BedrockModelProperties', tokenLimit?: number | null, completionTokenLimit?: number | null, model: BedrockModels, accessKey?: string | null, secretAccessKey?: string | null, modelName?: string | null, temperature?: number | null, probability?: number | null } | null, groq?: { __typename?: 'GroqModelProperties', tokenLimit?: number | null, completionTokenLimit?: number | null, model: GroqModels, key?: string | null, modelName?: string | null, endpoint?: any | null, temperature?: number | null, probability?: number | null } | null, cerebras?: { __typename?: 'CerebrasModelProperties', tokenLimit?: number | null, completionTokenLimit?: number | null, model: CerebrasModels, key?: string | null, modelName?: string | null, endpoint?: any | null, temperature?: number | null, probability?: number | null } | null, deepseek?: { __typename?: 'DeepseekModelProperties', tokenLimit?: number | null, completionTokenLimit?: number | null, model: DeepseekModels, key?: string | null, modelName?: string | null, temperature?: number | null, probability?: number | null } | null, jina?: { __typename?: 'JinaModelProperties', model: JinaModels, key?: string | null, modelName?: string | null, chunkTokenLimit?: number | null } | null, voyage?: { __typename?: 'VoyageModelProperties', model: VoyageModels, key?: string | null, modelName?: string | null, chunkTokenLimit?: number | null } | null } | null };

export type PromptSpecificationsMutationVariables = Exact<{
  prompt: Scalars['String']['input'];
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type PromptSpecificationsMutation = { __typename?: 'Mutation', promptSpecifications?: Array<{ __typename?: 'PromptCompletion', error?: string | null, specification?: { __typename?: 'EntityReference', id: string } | null, messages?: Array<{ __typename?: 'ConversationMessage', role: ConversationRoleTypes, author?: string | null, message?: string | null, tokens?: number | null, throughput?: number | null, completionTime?: any | null, timestamp?: any | null, modelService?: ModelServiceTypes | null, model?: string | null, data?: string | null, mimeType?: string | null, citations?: Array<{ __typename?: 'ConversationCitation', index?: number | null, text: string, startTime?: any | null, endTime?: any | null, pageNumber?: number | null, frameNumber?: number | null, content?: { __typename?: 'Content', id: string, name: string, state: EntityState, originalDate?: any | null, identifier?: string | null, uri?: any | null, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, format?: string | null, formatName?: string | null, fileExtension?: string | null, fileName?: string | null, fileSize?: any | null, masterUri?: any | null, imageUri?: any | null, textUri?: any | null, audioUri?: any | null, transcriptUri?: any | null, summary?: string | null, customSummary?: string | null, keywords?: Array<string> | null, bullets?: Array<string> | null, headlines?: Array<string> | null, posts?: Array<string> | null, chapters?: Array<string> | null, questions?: Array<string> | null, video?: { __typename?: 'VideoMetadata', width?: number | null, height?: number | null, duration?: any | null, make?: string | null, model?: string | null, software?: string | null, title?: string | null, description?: string | null, keywords?: Array<string | null> | null, author?: string | null } | null, audio?: { __typename?: 'AudioMetadata', keywords?: Array<string | null> | null, author?: string | null, series?: string | null, episode?: string | null, episodeType?: string | null, season?: string | null, publisher?: string | null, copyright?: string | null, genre?: string | null, title?: string | null, description?: string | null, bitrate?: number | null, channels?: number | null, sampleRate?: number | null, bitsPerSample?: number | null, duration?: any | null } | null, image?: { __typename?: 'ImageMetadata', width?: number | null, height?: number | null, resolutionX?: number | null, resolutionY?: number | null, bitsPerComponent?: number | null, components?: number | null, projectionType?: ImageProjectionTypes | null, orientation?: OrientationTypes | null, description?: string | null, make?: string | null, model?: string | null, software?: string | null, lens?: string | null, focalLength?: number | null, exposureTime?: string | null, fNumber?: string | null, iso?: string | null, heading?: number | null, pitch?: number | null } | null, document?: { __typename?: 'DocumentMetadata', title?: string | null, subject?: string | null, summary?: string | null, author?: string | null, publisher?: string | null, description?: string | null, keywords?: Array<string | null> | null, pageCount?: number | null, worksheetCount?: number | null, slideCount?: number | null, wordCount?: number | null, lineCount?: number | null, paragraphCount?: number | null, isEncrypted?: boolean | null, hasDigitalSignature?: boolean | null } | null } | null } | null> | null, toolCalls?: Array<{ __typename?: 'ConversationToolCall', id: string, name: string, arguments: string } | null> | null } | null> | null } | null> | null };

export type QueryModelsQueryVariables = Exact<{
  filter?: InputMaybe<ModelFilter>;
}>;


export type QueryModelsQuery = { __typename?: 'Query', models?: { __typename?: 'ModelCardResults', results?: Array<{ __typename?: 'ModelCard', uri?: any | null, name: string, type?: ModelTypes | null, serviceType?: ModelServiceTypes | null, model?: string | null, modelType?: string | null, description?: string | null, availableOn?: Array<string | null> | null, features?: { __typename?: 'ModelFeatures', keyFeatures?: Array<string | null> | null, strengths?: Array<string | null> | null, useCases?: Array<string | null> | null } | null, metadata?: { __typename?: 'ModelMetadata', multilingual?: boolean | null, multimodal?: boolean | null, knowledgeCutoff?: any | null, promptCostPerMillion?: number | null, completionCostPerMillion?: number | null, embeddingsCostPerMillion?: number | null, rerankingCostPerMillion?: number | null, contextWindowTokens?: number | null, maxOutputTokens?: number | null } | null }> | null } | null };

export type QuerySpecificationsQueryVariables = Exact<{
  filter?: InputMaybe<SpecificationFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type QuerySpecificationsQuery = { __typename?: 'Query', specifications?: { __typename?: 'SpecificationResults', results?: Array<{ __typename?: 'Specification', id: string, name: string, creationDate: any, relevance?: number | null, state: EntityState, type?: SpecificationTypes | null, serviceType?: ModelServiceTypes | null, systemPrompt?: string | null, customGuidance?: string | null, customInstructions?: string | null, searchType?: ConversationSearchTypes | null, numberSimilar?: number | null, owner: { __typename?: 'Owner', id: string }, strategy?: { __typename?: 'ConversationStrategy', type?: ConversationStrategyTypes | null, messageLimit?: number | null, embedCitations?: boolean | null, flattenCitations?: boolean | null, enableFacets?: boolean | null, messagesWeight?: number | null, contentsWeight?: number | null } | null, promptStrategy?: { __typename?: 'PromptStrategy', type: PromptStrategyTypes } | null, retrievalStrategy?: { __typename?: 'RetrievalStrategy', type: RetrievalStrategyTypes, contentLimit?: number | null, disableFallback?: boolean | null } | null, rerankingStrategy?: { __typename?: 'RerankingStrategy', serviceType: RerankingModelServiceTypes, threshold?: number | null } | null, graphStrategy?: { __typename?: 'GraphStrategy', type: GraphStrategyTypes, generateGraph?: boolean | null, observableLimit?: number | null } | null, revisionStrategy?: { __typename?: 'RevisionStrategy', type: RevisionStrategyTypes, customRevision?: string | null, count?: number | null } | null, azureAI?: { __typename?: 'AzureAIModelProperties', tokenLimit: number, completionTokenLimit?: number | null, key: string, endpoint: any, temperature?: number | null, probability?: number | null, chunkTokenLimit?: number | null } | null, openAI?: { __typename?: 'OpenAIModelProperties', tokenLimit?: number | null, completionTokenLimit?: number | null, model: OpenAiModels, key?: string | null, endpoint?: any | null, modelName?: string | null, temperature?: number | null, probability?: number | null, chunkTokenLimit?: number | null, detailLevel?: OpenAiVisionDetailLevels | null, reasoningEffort?: OpenAiReasoningEffortLevels | null } | null, azureOpenAI?: { __typename?: 'AzureOpenAIModelProperties', tokenLimit?: number | null, completionTokenLimit?: number | null, model: AzureOpenAiModels, key?: string | null, endpoint?: any | null, deploymentName?: string | null, temperature?: number | null, probability?: number | null, chunkTokenLimit?: number | null } | null, cohere?: { __typename?: 'CohereModelProperties', tokenLimit?: number | null, completionTokenLimit?: number | null, model: CohereModels, key?: string | null, modelName?: string | null, temperature?: number | null, probability?: number | null, chunkTokenLimit?: number | null } | null, anthropic?: { __typename?: 'AnthropicModelProperties', tokenLimit?: number | null, completionTokenLimit?: number | null, model: AnthropicModels, key?: string | null, modelName?: string | null, temperature?: number | null, probability?: number | null, enableThinking?: boolean | null, thinkingTokenLimit?: number | null } | null, google?: { __typename?: 'GoogleModelProperties', tokenLimit?: number | null, completionTokenLimit?: number | null, model: GoogleModels, key?: string | null, modelName?: string | null, temperature?: number | null, probability?: number | null, chunkTokenLimit?: number | null, enableThinking?: boolean | null, thinkingTokenLimit?: number | null } | null, replicate?: { __typename?: 'ReplicateModelProperties', tokenLimit?: number | null, completionTokenLimit?: number | null, model: ReplicateModels, key?: string | null, modelName?: string | null, temperature?: number | null, probability?: number | null } | null, mistral?: { __typename?: 'MistralModelProperties', tokenLimit?: number | null, completionTokenLimit?: number | null, model: MistralModels, key?: string | null, modelName?: string | null, endpoint?: any | null, temperature?: number | null, probability?: number | null, chunkTokenLimit?: number | null } | null, bedrock?: { __typename?: 'BedrockModelProperties', tokenLimit?: number | null, completionTokenLimit?: number | null, model: BedrockModels, accessKey?: string | null, secretAccessKey?: string | null, modelName?: string | null, temperature?: number | null, probability?: number | null } | null, groq?: { __typename?: 'GroqModelProperties', tokenLimit?: number | null, completionTokenLimit?: number | null, model: GroqModels, key?: string | null, modelName?: string | null, endpoint?: any | null, temperature?: number | null, probability?: number | null } | null, cerebras?: { __typename?: 'CerebrasModelProperties', tokenLimit?: number | null, completionTokenLimit?: number | null, model: CerebrasModels, key?: string | null, modelName?: string | null, endpoint?: any | null, temperature?: number | null, probability?: number | null } | null, deepseek?: { __typename?: 'DeepseekModelProperties', tokenLimit?: number | null, completionTokenLimit?: number | null, model: DeepseekModels, key?: string | null, modelName?: string | null, temperature?: number | null, probability?: number | null } | null, jina?: { __typename?: 'JinaModelProperties', model: JinaModels, key?: string | null, modelName?: string | null, chunkTokenLimit?: number | null } | null, voyage?: { __typename?: 'VoyageModelProperties', model: VoyageModels, key?: string | null, modelName?: string | null, chunkTokenLimit?: number | null } | null } | null> | null } | null };

export type SpecificationExistsQueryVariables = Exact<{
  filter?: InputMaybe<SpecificationFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type SpecificationExistsQuery = { __typename?: 'Query', specificationExists?: { __typename?: 'BooleanResult', result?: boolean | null } | null };

export type UpdateSpecificationMutationVariables = Exact<{
  specification: SpecificationUpdateInput;
}>;


export type UpdateSpecificationMutation = { __typename?: 'Mutation', updateSpecification?: { __typename?: 'Specification', id: string, name: string, state: EntityState, type?: SpecificationTypes | null, serviceType?: ModelServiceTypes | null } | null };

export type UpsertSpecificationMutationVariables = Exact<{
  specification: SpecificationInput;
}>;


export type UpsertSpecificationMutation = { __typename?: 'Mutation', upsertSpecification?: { __typename?: 'Specification', id: string, name: string, state: EntityState, type?: SpecificationTypes | null, serviceType?: ModelServiceTypes | null } | null };

export type CountUsersQueryVariables = Exact<{
  filter?: InputMaybe<UserFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CountUsersQuery = { __typename?: 'Query', countUsers?: { __typename?: 'CountResult', count?: any | null } | null };

export type CreateUserMutationVariables = Exact<{
  user: UserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser?: { __typename?: 'User', id: string, name: string, state: EntityState, type?: UserTypes | null, identifier: string } | null };

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser?: { __typename?: 'User', id: string, state: EntityState } | null };

export type DisableUserMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DisableUserMutation = { __typename?: 'Mutation', disableUser?: { __typename?: 'User', id: string, state: EntityState } | null };

export type EnableUserMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type EnableUserMutation = { __typename?: 'Mutation', enableUser?: { __typename?: 'User', id: string, state: EntityState } | null };

export type GetUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: string, name: string, creationDate: any, relevance?: number | null, state: EntityState, type?: UserTypes | null, identifier: string, owner: { __typename?: 'Owner', id: string }, connectors?: Array<{ __typename?: 'Connector', id: string, name: string, state: EntityState, type?: ConnectorTypes | null, authentication?: { __typename?: 'AuthenticationConnector', type: AuthenticationServiceTypes, microsoft?: { __typename?: 'MicrosoftAuthenticationProperties', tenantId: string, clientId: string, clientSecret: string } | null, google?: { __typename?: 'GoogleAuthenticationProperties', clientId: string, clientSecret: string } | null } | null, integration?: { __typename?: 'IntegrationConnector', type: IntegrationServiceTypes, uri?: string | null, slack?: { __typename?: 'SlackIntegrationProperties', token: string, channel: string } | null, email?: { __typename?: 'EmailIntegrationProperties', from: string, subject: string, to: Array<string> } | null, twitter?: { __typename?: 'TwitterIntegrationProperties', consumerKey: string, consumerSecret: string, accessTokenKey: string, accessTokenSecret: string } | null } | null } | null> | null } | null };

export type QueryUsersQueryVariables = Exact<{
  filter?: InputMaybe<UserFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type QueryUsersQuery = { __typename?: 'Query', users?: { __typename?: 'UserResults', results?: Array<{ __typename?: 'User', id: string, name: string, creationDate: any, relevance?: number | null, state: EntityState, type?: UserTypes | null, identifier: string, owner: { __typename?: 'Owner', id: string }, connectors?: Array<{ __typename?: 'Connector', id: string, name: string, state: EntityState, type?: ConnectorTypes | null, authentication?: { __typename?: 'AuthenticationConnector', type: AuthenticationServiceTypes, microsoft?: { __typename?: 'MicrosoftAuthenticationProperties', tenantId: string, clientId: string, clientSecret: string } | null, google?: { __typename?: 'GoogleAuthenticationProperties', clientId: string, clientSecret: string } | null } | null, integration?: { __typename?: 'IntegrationConnector', type: IntegrationServiceTypes, uri?: string | null, slack?: { __typename?: 'SlackIntegrationProperties', token: string, channel: string } | null, email?: { __typename?: 'EmailIntegrationProperties', from: string, subject: string, to: Array<string> } | null, twitter?: { __typename?: 'TwitterIntegrationProperties', consumerKey: string, consumerSecret: string, accessTokenKey: string, accessTokenSecret: string } | null } | null } | null> | null } | null> | null } | null };

export type UpdateUserMutationVariables = Exact<{
  user: UserUpdateInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser?: { __typename?: 'User', id: string, name: string, state: EntityState, type?: UserTypes | null, identifier: string } | null };

export type CountWorkflowsQueryVariables = Exact<{
  filter?: InputMaybe<WorkflowFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CountWorkflowsQuery = { __typename?: 'Query', countWorkflows?: { __typename?: 'CountResult', count?: any | null } | null };

export type CreateWorkflowMutationVariables = Exact<{
  workflow: WorkflowInput;
}>;


export type CreateWorkflowMutation = { __typename?: 'Mutation', createWorkflow?: { __typename?: 'Workflow', id: string, name: string, state: EntityState, ingestion?: { __typename?: 'IngestionWorkflowStage', enableEmailCollections?: boolean | null, if?: { __typename?: 'IngestionContentFilter', types?: Array<ContentTypes> | null, fileTypes?: Array<FileTypes> | null, formats?: Array<string | null> | null, fileExtensions?: Array<string> | null, allowedPaths?: Array<string> | null, excludedPaths?: Array<string> | null } | null, collections?: Array<{ __typename?: 'EntityReference', id: string } | null> | null, observations?: Array<{ __typename?: 'ObservationReference', type: ObservableTypes, observable: { __typename?: 'NamedEntityReference', id: string, name?: string | null } } | null> | null } | null, indexing?: { __typename?: 'IndexingWorkflowStage', jobs?: Array<{ __typename?: 'IndexingWorkflowJob', connector?: { __typename?: 'ContentIndexingConnector', type?: ContentIndexingServiceTypes | null, contentType?: ContentTypes | null, fileType?: FileTypes | null } | null } | null> | null } | null, preparation?: { __typename?: 'PreparationWorkflowStage', enableUnblockedCapture?: boolean | null, disableSmartCapture?: boolean | null, summarizations?: Array<{ __typename?: 'SummarizationStrategy', type: SummarizationTypes, tokens?: number | null, items?: number | null, prompt?: string | null, specification?: { __typename?: 'EntityReference', id: string } | null } | null> | null, jobs?: Array<{ __typename?: 'PreparationWorkflowJob', connector?: { __typename?: 'FilePreparationConnector', type: FilePreparationServiceTypes, fileTypes?: Array<FileTypes> | null, azureDocument?: { __typename?: 'AzureDocumentPreparationProperties', version?: AzureDocumentIntelligenceVersions | null, model?: AzureDocumentIntelligenceModels | null, endpoint?: any | null, key?: string | null } | null, deepgram?: { __typename?: 'DeepgramAudioPreparationProperties', model?: DeepgramModels | null, key?: string | null, enableRedaction?: boolean | null, enableSpeakerDiarization?: boolean | null, detectLanguage?: boolean | null, language?: string | null } | null, assemblyAI?: { __typename?: 'AssemblyAIAudioPreparationProperties', model?: AssemblyAiModels | null, key?: string | null, enableRedaction?: boolean | null, enableSpeakerDiarization?: boolean | null, detectLanguage?: boolean | null, language?: string | null } | null, document?: { __typename?: 'DocumentPreparationProperties', includeImages?: boolean | null } | null, email?: { __typename?: 'EmailPreparationProperties', includeAttachments?: boolean | null } | null, modelDocument?: { __typename?: 'ModelDocumentPreparationProperties', specification?: { __typename?: 'EntityReference', id: string } | null } | null, mistral?: { __typename?: 'MistralDocumentPreparationProperties', key?: string | null } | null } | null } | null> | null } | null, extraction?: { __typename?: 'ExtractionWorkflowStage', jobs?: Array<{ __typename?: 'ExtractionWorkflowJob', connector?: { __typename?: 'EntityExtractionConnector', type: EntityExtractionServiceTypes, contentTypes?: Array<ContentTypes> | null, fileTypes?: Array<FileTypes> | null, extractedTypes?: Array<ObservableTypes> | null, extractedCount?: number | null, azureText?: { __typename?: 'AzureTextExtractionProperties', confidenceThreshold?: number | null, enablePII?: boolean | null } | null, azureImage?: { __typename?: 'AzureImageExtractionProperties', confidenceThreshold?: number | null } | null, modelImage?: { __typename?: 'ModelImageExtractionProperties', specification?: { __typename?: 'EntityReference', id: string } | null } | null, modelText?: { __typename?: 'ModelTextExtractionProperties', specification?: { __typename?: 'EntityReference', id: string } | null } | null } | null } | null> | null } | null, classification?: { __typename?: 'ClassificationWorkflowStage', jobs?: Array<{ __typename?: 'ClassificationWorkflowJob', connector?: { __typename?: 'ContentClassificationConnector', type: ContentClassificationServiceTypes, contentType?: ContentTypes | null, fileType?: FileTypes | null, model?: { __typename?: 'ModelContentClassificationProperties', specification?: { __typename?: 'EntityReference', id: string } | null, rules?: Array<{ __typename?: 'PromptClassificationRule', then?: string | null, if?: string | null } | null> | null } | null, regex?: { __typename?: 'RegexContentClassificationProperties', rules?: Array<{ __typename?: 'RegexClassificationRule', then?: string | null, type?: RegexSourceTypes | null, path?: string | null, matches?: string | null } | null> | null } | null } | null } | null> | null } | null, enrichment?: { __typename?: 'EnrichmentWorkflowStage', link?: { __typename?: 'LinkStrategy', enableCrawling?: boolean | null, allowedDomains?: Array<string> | null, excludedDomains?: Array<string> | null, allowedPaths?: Array<string> | null, excludedPaths?: Array<string> | null, allowedLinks?: Array<LinkTypes> | null, excludedLinks?: Array<LinkTypes> | null, allowedFiles?: Array<FileTypes> | null, excludedFiles?: Array<FileTypes> | null, allowContentDomain?: boolean | null, maximumLinks?: number | null } | null, jobs?: Array<{ __typename?: 'EnrichmentWorkflowJob', connector?: { __typename?: 'EntityEnrichmentConnector', type?: EntityEnrichmentServiceTypes | null, enrichedTypes?: Array<ObservableTypes | null> | null, fhir?: { __typename?: 'FHIREnrichmentProperties', endpoint?: any | null } | null, diffbot?: { __typename?: 'DiffbotEnrichmentProperties', key?: any | null } | null } | null } | null> | null } | null, storage?: { __typename?: 'StorageWorkflowStage', policy?: { __typename?: 'StoragePolicy', type?: StoragePolicyTypes | null, allowDuplicates?: boolean | null } | null } | null, actions?: Array<{ __typename?: 'WorkflowAction', connector?: { __typename?: 'IntegrationConnector', type: IntegrationServiceTypes, uri?: string | null, slack?: { __typename?: 'SlackIntegrationProperties', token: string, channel: string } | null, email?: { __typename?: 'EmailIntegrationProperties', from: string, subject: string, to: Array<string> } | null, twitter?: { __typename?: 'TwitterIntegrationProperties', consumerKey: string, consumerSecret: string, accessTokenKey: string, accessTokenSecret: string } | null } | null } | null> | null } | null };

export type DeleteAllWorkflowsMutationVariables = Exact<{
  filter?: InputMaybe<WorkflowFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type DeleteAllWorkflowsMutation = { __typename?: 'Mutation', deleteAllWorkflows?: Array<{ __typename?: 'Workflow', id: string, state: EntityState } | null> | null };

export type DeleteWorkflowMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteWorkflowMutation = { __typename?: 'Mutation', deleteWorkflow?: { __typename?: 'Workflow', id: string, state: EntityState } | null };

export type DeleteWorkflowsMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type DeleteWorkflowsMutation = { __typename?: 'Mutation', deleteWorkflows?: Array<{ __typename?: 'Workflow', id: string, state: EntityState } | null> | null };

export type GetWorkflowQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetWorkflowQuery = { __typename?: 'Query', workflow?: { __typename?: 'Workflow', id: string, name: string, creationDate: any, relevance?: number | null, state: EntityState, owner: { __typename?: 'Owner', id: string }, ingestion?: { __typename?: 'IngestionWorkflowStage', enableEmailCollections?: boolean | null, if?: { __typename?: 'IngestionContentFilter', types?: Array<ContentTypes> | null, fileTypes?: Array<FileTypes> | null, formats?: Array<string | null> | null, fileExtensions?: Array<string> | null, allowedPaths?: Array<string> | null, excludedPaths?: Array<string> | null } | null, collections?: Array<{ __typename?: 'EntityReference', id: string } | null> | null, observations?: Array<{ __typename?: 'ObservationReference', type: ObservableTypes, observable: { __typename?: 'NamedEntityReference', id: string, name?: string | null } } | null> | null } | null, indexing?: { __typename?: 'IndexingWorkflowStage', jobs?: Array<{ __typename?: 'IndexingWorkflowJob', connector?: { __typename?: 'ContentIndexingConnector', type?: ContentIndexingServiceTypes | null, contentType?: ContentTypes | null, fileType?: FileTypes | null } | null } | null> | null } | null, preparation?: { __typename?: 'PreparationWorkflowStage', enableUnblockedCapture?: boolean | null, disableSmartCapture?: boolean | null, summarizations?: Array<{ __typename?: 'SummarizationStrategy', type: SummarizationTypes, tokens?: number | null, items?: number | null, prompt?: string | null, specification?: { __typename?: 'EntityReference', id: string } | null } | null> | null, jobs?: Array<{ __typename?: 'PreparationWorkflowJob', connector?: { __typename?: 'FilePreparationConnector', type: FilePreparationServiceTypes, fileTypes?: Array<FileTypes> | null, azureDocument?: { __typename?: 'AzureDocumentPreparationProperties', version?: AzureDocumentIntelligenceVersions | null, model?: AzureDocumentIntelligenceModels | null, endpoint?: any | null, key?: string | null } | null, deepgram?: { __typename?: 'DeepgramAudioPreparationProperties', model?: DeepgramModels | null, key?: string | null, enableRedaction?: boolean | null, enableSpeakerDiarization?: boolean | null, detectLanguage?: boolean | null, language?: string | null } | null, assemblyAI?: { __typename?: 'AssemblyAIAudioPreparationProperties', model?: AssemblyAiModels | null, key?: string | null, enableRedaction?: boolean | null, enableSpeakerDiarization?: boolean | null, detectLanguage?: boolean | null, language?: string | null } | null, document?: { __typename?: 'DocumentPreparationProperties', includeImages?: boolean | null } | null, email?: { __typename?: 'EmailPreparationProperties', includeAttachments?: boolean | null } | null, modelDocument?: { __typename?: 'ModelDocumentPreparationProperties', specification?: { __typename?: 'EntityReference', id: string } | null } | null, mistral?: { __typename?: 'MistralDocumentPreparationProperties', key?: string | null } | null } | null } | null> | null } | null, extraction?: { __typename?: 'ExtractionWorkflowStage', jobs?: Array<{ __typename?: 'ExtractionWorkflowJob', connector?: { __typename?: 'EntityExtractionConnector', type: EntityExtractionServiceTypes, contentTypes?: Array<ContentTypes> | null, fileTypes?: Array<FileTypes> | null, extractedTypes?: Array<ObservableTypes> | null, extractedCount?: number | null, azureText?: { __typename?: 'AzureTextExtractionProperties', confidenceThreshold?: number | null, enablePII?: boolean | null } | null, azureImage?: { __typename?: 'AzureImageExtractionProperties', confidenceThreshold?: number | null } | null, modelImage?: { __typename?: 'ModelImageExtractionProperties', specification?: { __typename?: 'EntityReference', id: string } | null } | null, modelText?: { __typename?: 'ModelTextExtractionProperties', specification?: { __typename?: 'EntityReference', id: string } | null } | null } | null } | null> | null } | null, classification?: { __typename?: 'ClassificationWorkflowStage', jobs?: Array<{ __typename?: 'ClassificationWorkflowJob', connector?: { __typename?: 'ContentClassificationConnector', type: ContentClassificationServiceTypes, contentType?: ContentTypes | null, fileType?: FileTypes | null, model?: { __typename?: 'ModelContentClassificationProperties', specification?: { __typename?: 'EntityReference', id: string } | null, rules?: Array<{ __typename?: 'PromptClassificationRule', then?: string | null, if?: string | null } | null> | null } | null, regex?: { __typename?: 'RegexContentClassificationProperties', rules?: Array<{ __typename?: 'RegexClassificationRule', then?: string | null, type?: RegexSourceTypes | null, path?: string | null, matches?: string | null } | null> | null } | null } | null } | null> | null } | null, enrichment?: { __typename?: 'EnrichmentWorkflowStage', link?: { __typename?: 'LinkStrategy', enableCrawling?: boolean | null, allowedDomains?: Array<string> | null, excludedDomains?: Array<string> | null, allowedPaths?: Array<string> | null, excludedPaths?: Array<string> | null, allowedLinks?: Array<LinkTypes> | null, excludedLinks?: Array<LinkTypes> | null, allowedFiles?: Array<FileTypes> | null, excludedFiles?: Array<FileTypes> | null, allowContentDomain?: boolean | null, maximumLinks?: number | null } | null, jobs?: Array<{ __typename?: 'EnrichmentWorkflowJob', connector?: { __typename?: 'EntityEnrichmentConnector', type?: EntityEnrichmentServiceTypes | null, enrichedTypes?: Array<ObservableTypes | null> | null, fhir?: { __typename?: 'FHIREnrichmentProperties', endpoint?: any | null } | null, diffbot?: { __typename?: 'DiffbotEnrichmentProperties', key?: any | null } | null } | null } | null> | null } | null, storage?: { __typename?: 'StorageWorkflowStage', policy?: { __typename?: 'StoragePolicy', type?: StoragePolicyTypes | null, allowDuplicates?: boolean | null } | null } | null, actions?: Array<{ __typename?: 'WorkflowAction', connector?: { __typename?: 'IntegrationConnector', type: IntegrationServiceTypes, uri?: string | null, slack?: { __typename?: 'SlackIntegrationProperties', token: string, channel: string } | null, email?: { __typename?: 'EmailIntegrationProperties', from: string, subject: string, to: Array<string> } | null, twitter?: { __typename?: 'TwitterIntegrationProperties', consumerKey: string, consumerSecret: string, accessTokenKey: string, accessTokenSecret: string } | null } | null } | null> | null } | null };

export type QueryWorkflowsQueryVariables = Exact<{
  filter?: InputMaybe<WorkflowFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type QueryWorkflowsQuery = { __typename?: 'Query', workflows?: { __typename?: 'WorkflowResults', results?: Array<{ __typename?: 'Workflow', id: string, name: string, creationDate: any, relevance?: number | null, state: EntityState, owner: { __typename?: 'Owner', id: string }, ingestion?: { __typename?: 'IngestionWorkflowStage', enableEmailCollections?: boolean | null, if?: { __typename?: 'IngestionContentFilter', types?: Array<ContentTypes> | null, fileTypes?: Array<FileTypes> | null, formats?: Array<string | null> | null, fileExtensions?: Array<string> | null, allowedPaths?: Array<string> | null, excludedPaths?: Array<string> | null } | null, collections?: Array<{ __typename?: 'EntityReference', id: string } | null> | null, observations?: Array<{ __typename?: 'ObservationReference', type: ObservableTypes, observable: { __typename?: 'NamedEntityReference', id: string, name?: string | null } } | null> | null } | null, indexing?: { __typename?: 'IndexingWorkflowStage', jobs?: Array<{ __typename?: 'IndexingWorkflowJob', connector?: { __typename?: 'ContentIndexingConnector', type?: ContentIndexingServiceTypes | null, contentType?: ContentTypes | null, fileType?: FileTypes | null } | null } | null> | null } | null, preparation?: { __typename?: 'PreparationWorkflowStage', enableUnblockedCapture?: boolean | null, disableSmartCapture?: boolean | null, summarizations?: Array<{ __typename?: 'SummarizationStrategy', type: SummarizationTypes, tokens?: number | null, items?: number | null, prompt?: string | null, specification?: { __typename?: 'EntityReference', id: string } | null } | null> | null, jobs?: Array<{ __typename?: 'PreparationWorkflowJob', connector?: { __typename?: 'FilePreparationConnector', type: FilePreparationServiceTypes, fileTypes?: Array<FileTypes> | null, azureDocument?: { __typename?: 'AzureDocumentPreparationProperties', version?: AzureDocumentIntelligenceVersions | null, model?: AzureDocumentIntelligenceModels | null, endpoint?: any | null, key?: string | null } | null, deepgram?: { __typename?: 'DeepgramAudioPreparationProperties', model?: DeepgramModels | null, key?: string | null, enableRedaction?: boolean | null, enableSpeakerDiarization?: boolean | null, detectLanguage?: boolean | null, language?: string | null } | null, assemblyAI?: { __typename?: 'AssemblyAIAudioPreparationProperties', model?: AssemblyAiModels | null, key?: string | null, enableRedaction?: boolean | null, enableSpeakerDiarization?: boolean | null, detectLanguage?: boolean | null, language?: string | null } | null, document?: { __typename?: 'DocumentPreparationProperties', includeImages?: boolean | null } | null, email?: { __typename?: 'EmailPreparationProperties', includeAttachments?: boolean | null } | null, modelDocument?: { __typename?: 'ModelDocumentPreparationProperties', specification?: { __typename?: 'EntityReference', id: string } | null } | null, mistral?: { __typename?: 'MistralDocumentPreparationProperties', key?: string | null } | null } | null } | null> | null } | null, extraction?: { __typename?: 'ExtractionWorkflowStage', jobs?: Array<{ __typename?: 'ExtractionWorkflowJob', connector?: { __typename?: 'EntityExtractionConnector', type: EntityExtractionServiceTypes, contentTypes?: Array<ContentTypes> | null, fileTypes?: Array<FileTypes> | null, extractedTypes?: Array<ObservableTypes> | null, extractedCount?: number | null, azureText?: { __typename?: 'AzureTextExtractionProperties', confidenceThreshold?: number | null, enablePII?: boolean | null } | null, azureImage?: { __typename?: 'AzureImageExtractionProperties', confidenceThreshold?: number | null } | null, modelImage?: { __typename?: 'ModelImageExtractionProperties', specification?: { __typename?: 'EntityReference', id: string } | null } | null, modelText?: { __typename?: 'ModelTextExtractionProperties', specification?: { __typename?: 'EntityReference', id: string } | null } | null } | null } | null> | null } | null, classification?: { __typename?: 'ClassificationWorkflowStage', jobs?: Array<{ __typename?: 'ClassificationWorkflowJob', connector?: { __typename?: 'ContentClassificationConnector', type: ContentClassificationServiceTypes, contentType?: ContentTypes | null, fileType?: FileTypes | null, model?: { __typename?: 'ModelContentClassificationProperties', specification?: { __typename?: 'EntityReference', id: string } | null, rules?: Array<{ __typename?: 'PromptClassificationRule', then?: string | null, if?: string | null } | null> | null } | null, regex?: { __typename?: 'RegexContentClassificationProperties', rules?: Array<{ __typename?: 'RegexClassificationRule', then?: string | null, type?: RegexSourceTypes | null, path?: string | null, matches?: string | null } | null> | null } | null } | null } | null> | null } | null, enrichment?: { __typename?: 'EnrichmentWorkflowStage', link?: { __typename?: 'LinkStrategy', enableCrawling?: boolean | null, allowedDomains?: Array<string> | null, excludedDomains?: Array<string> | null, allowedPaths?: Array<string> | null, excludedPaths?: Array<string> | null, allowedLinks?: Array<LinkTypes> | null, excludedLinks?: Array<LinkTypes> | null, allowedFiles?: Array<FileTypes> | null, excludedFiles?: Array<FileTypes> | null, allowContentDomain?: boolean | null, maximumLinks?: number | null } | null, jobs?: Array<{ __typename?: 'EnrichmentWorkflowJob', connector?: { __typename?: 'EntityEnrichmentConnector', type?: EntityEnrichmentServiceTypes | null, enrichedTypes?: Array<ObservableTypes | null> | null, fhir?: { __typename?: 'FHIREnrichmentProperties', endpoint?: any | null } | null, diffbot?: { __typename?: 'DiffbotEnrichmentProperties', key?: any | null } | null } | null } | null> | null } | null, storage?: { __typename?: 'StorageWorkflowStage', policy?: { __typename?: 'StoragePolicy', type?: StoragePolicyTypes | null, allowDuplicates?: boolean | null } | null } | null, actions?: Array<{ __typename?: 'WorkflowAction', connector?: { __typename?: 'IntegrationConnector', type: IntegrationServiceTypes, uri?: string | null, slack?: { __typename?: 'SlackIntegrationProperties', token: string, channel: string } | null, email?: { __typename?: 'EmailIntegrationProperties', from: string, subject: string, to: Array<string> } | null, twitter?: { __typename?: 'TwitterIntegrationProperties', consumerKey: string, consumerSecret: string, accessTokenKey: string, accessTokenSecret: string } | null } | null } | null> | null } | null> | null } | null };

export type UpdateWorkflowMutationVariables = Exact<{
  workflow: WorkflowUpdateInput;
}>;


export type UpdateWorkflowMutation = { __typename?: 'Mutation', updateWorkflow?: { __typename?: 'Workflow', id: string, name: string, state: EntityState, ingestion?: { __typename?: 'IngestionWorkflowStage', enableEmailCollections?: boolean | null, if?: { __typename?: 'IngestionContentFilter', types?: Array<ContentTypes> | null, fileTypes?: Array<FileTypes> | null, formats?: Array<string | null> | null, fileExtensions?: Array<string> | null, allowedPaths?: Array<string> | null, excludedPaths?: Array<string> | null } | null, collections?: Array<{ __typename?: 'EntityReference', id: string } | null> | null, observations?: Array<{ __typename?: 'ObservationReference', type: ObservableTypes, observable: { __typename?: 'NamedEntityReference', id: string, name?: string | null } } | null> | null } | null, indexing?: { __typename?: 'IndexingWorkflowStage', jobs?: Array<{ __typename?: 'IndexingWorkflowJob', connector?: { __typename?: 'ContentIndexingConnector', type?: ContentIndexingServiceTypes | null, contentType?: ContentTypes | null, fileType?: FileTypes | null } | null } | null> | null } | null, preparation?: { __typename?: 'PreparationWorkflowStage', enableUnblockedCapture?: boolean | null, disableSmartCapture?: boolean | null, summarizations?: Array<{ __typename?: 'SummarizationStrategy', type: SummarizationTypes, tokens?: number | null, items?: number | null, prompt?: string | null, specification?: { __typename?: 'EntityReference', id: string } | null } | null> | null, jobs?: Array<{ __typename?: 'PreparationWorkflowJob', connector?: { __typename?: 'FilePreparationConnector', type: FilePreparationServiceTypes, fileTypes?: Array<FileTypes> | null, azureDocument?: { __typename?: 'AzureDocumentPreparationProperties', version?: AzureDocumentIntelligenceVersions | null, model?: AzureDocumentIntelligenceModels | null, endpoint?: any | null, key?: string | null } | null, deepgram?: { __typename?: 'DeepgramAudioPreparationProperties', model?: DeepgramModels | null, key?: string | null, enableRedaction?: boolean | null, enableSpeakerDiarization?: boolean | null, detectLanguage?: boolean | null, language?: string | null } | null, assemblyAI?: { __typename?: 'AssemblyAIAudioPreparationProperties', model?: AssemblyAiModels | null, key?: string | null, enableRedaction?: boolean | null, enableSpeakerDiarization?: boolean | null, detectLanguage?: boolean | null, language?: string | null } | null, document?: { __typename?: 'DocumentPreparationProperties', includeImages?: boolean | null } | null, email?: { __typename?: 'EmailPreparationProperties', includeAttachments?: boolean | null } | null, modelDocument?: { __typename?: 'ModelDocumentPreparationProperties', specification?: { __typename?: 'EntityReference', id: string } | null } | null, mistral?: { __typename?: 'MistralDocumentPreparationProperties', key?: string | null } | null } | null } | null> | null } | null, extraction?: { __typename?: 'ExtractionWorkflowStage', jobs?: Array<{ __typename?: 'ExtractionWorkflowJob', connector?: { __typename?: 'EntityExtractionConnector', type: EntityExtractionServiceTypes, contentTypes?: Array<ContentTypes> | null, fileTypes?: Array<FileTypes> | null, extractedTypes?: Array<ObservableTypes> | null, extractedCount?: number | null, azureText?: { __typename?: 'AzureTextExtractionProperties', confidenceThreshold?: number | null, enablePII?: boolean | null } | null, azureImage?: { __typename?: 'AzureImageExtractionProperties', confidenceThreshold?: number | null } | null, modelImage?: { __typename?: 'ModelImageExtractionProperties', specification?: { __typename?: 'EntityReference', id: string } | null } | null, modelText?: { __typename?: 'ModelTextExtractionProperties', specification?: { __typename?: 'EntityReference', id: string } | null } | null } | null } | null> | null } | null, classification?: { __typename?: 'ClassificationWorkflowStage', jobs?: Array<{ __typename?: 'ClassificationWorkflowJob', connector?: { __typename?: 'ContentClassificationConnector', type: ContentClassificationServiceTypes, contentType?: ContentTypes | null, fileType?: FileTypes | null, model?: { __typename?: 'ModelContentClassificationProperties', specification?: { __typename?: 'EntityReference', id: string } | null, rules?: Array<{ __typename?: 'PromptClassificationRule', then?: string | null, if?: string | null } | null> | null } | null, regex?: { __typename?: 'RegexContentClassificationProperties', rules?: Array<{ __typename?: 'RegexClassificationRule', then?: string | null, type?: RegexSourceTypes | null, path?: string | null, matches?: string | null } | null> | null } | null } | null } | null> | null } | null, enrichment?: { __typename?: 'EnrichmentWorkflowStage', link?: { __typename?: 'LinkStrategy', enableCrawling?: boolean | null, allowedDomains?: Array<string> | null, excludedDomains?: Array<string> | null, allowedPaths?: Array<string> | null, excludedPaths?: Array<string> | null, allowedLinks?: Array<LinkTypes> | null, excludedLinks?: Array<LinkTypes> | null, allowedFiles?: Array<FileTypes> | null, excludedFiles?: Array<FileTypes> | null, allowContentDomain?: boolean | null, maximumLinks?: number | null } | null, jobs?: Array<{ __typename?: 'EnrichmentWorkflowJob', connector?: { __typename?: 'EntityEnrichmentConnector', type?: EntityEnrichmentServiceTypes | null, enrichedTypes?: Array<ObservableTypes | null> | null, fhir?: { __typename?: 'FHIREnrichmentProperties', endpoint?: any | null } | null, diffbot?: { __typename?: 'DiffbotEnrichmentProperties', key?: any | null } | null } | null } | null> | null } | null, storage?: { __typename?: 'StorageWorkflowStage', policy?: { __typename?: 'StoragePolicy', type?: StoragePolicyTypes | null, allowDuplicates?: boolean | null } | null } | null, actions?: Array<{ __typename?: 'WorkflowAction', connector?: { __typename?: 'IntegrationConnector', type: IntegrationServiceTypes, uri?: string | null, slack?: { __typename?: 'SlackIntegrationProperties', token: string, channel: string } | null, email?: { __typename?: 'EmailIntegrationProperties', from: string, subject: string, to: Array<string> } | null, twitter?: { __typename?: 'TwitterIntegrationProperties', consumerKey: string, consumerSecret: string, accessTokenKey: string, accessTokenSecret: string } | null } | null } | null> | null } | null };

export type UpsertWorkflowMutationVariables = Exact<{
  workflow: WorkflowInput;
}>;


export type UpsertWorkflowMutation = { __typename?: 'Mutation', upsertWorkflow?: { __typename?: 'Workflow', id: string, name: string, state: EntityState, ingestion?: { __typename?: 'IngestionWorkflowStage', enableEmailCollections?: boolean | null, if?: { __typename?: 'IngestionContentFilter', types?: Array<ContentTypes> | null, fileTypes?: Array<FileTypes> | null, formats?: Array<string | null> | null, fileExtensions?: Array<string> | null, allowedPaths?: Array<string> | null, excludedPaths?: Array<string> | null } | null, collections?: Array<{ __typename?: 'EntityReference', id: string } | null> | null, observations?: Array<{ __typename?: 'ObservationReference', type: ObservableTypes, observable: { __typename?: 'NamedEntityReference', id: string, name?: string | null } } | null> | null } | null, indexing?: { __typename?: 'IndexingWorkflowStage', jobs?: Array<{ __typename?: 'IndexingWorkflowJob', connector?: { __typename?: 'ContentIndexingConnector', type?: ContentIndexingServiceTypes | null, contentType?: ContentTypes | null, fileType?: FileTypes | null } | null } | null> | null } | null, preparation?: { __typename?: 'PreparationWorkflowStage', enableUnblockedCapture?: boolean | null, disableSmartCapture?: boolean | null, summarizations?: Array<{ __typename?: 'SummarizationStrategy', type: SummarizationTypes, tokens?: number | null, items?: number | null, prompt?: string | null, specification?: { __typename?: 'EntityReference', id: string } | null } | null> | null, jobs?: Array<{ __typename?: 'PreparationWorkflowJob', connector?: { __typename?: 'FilePreparationConnector', type: FilePreparationServiceTypes, fileTypes?: Array<FileTypes> | null, azureDocument?: { __typename?: 'AzureDocumentPreparationProperties', version?: AzureDocumentIntelligenceVersions | null, model?: AzureDocumentIntelligenceModels | null, endpoint?: any | null, key?: string | null } | null, deepgram?: { __typename?: 'DeepgramAudioPreparationProperties', model?: DeepgramModels | null, key?: string | null, enableRedaction?: boolean | null, enableSpeakerDiarization?: boolean | null, detectLanguage?: boolean | null, language?: string | null } | null, assemblyAI?: { __typename?: 'AssemblyAIAudioPreparationProperties', model?: AssemblyAiModels | null, key?: string | null, enableRedaction?: boolean | null, enableSpeakerDiarization?: boolean | null, detectLanguage?: boolean | null, language?: string | null } | null, document?: { __typename?: 'DocumentPreparationProperties', includeImages?: boolean | null } | null, email?: { __typename?: 'EmailPreparationProperties', includeAttachments?: boolean | null } | null, modelDocument?: { __typename?: 'ModelDocumentPreparationProperties', specification?: { __typename?: 'EntityReference', id: string } | null } | null, mistral?: { __typename?: 'MistralDocumentPreparationProperties', key?: string | null } | null } | null } | null> | null } | null, extraction?: { __typename?: 'ExtractionWorkflowStage', jobs?: Array<{ __typename?: 'ExtractionWorkflowJob', connector?: { __typename?: 'EntityExtractionConnector', type: EntityExtractionServiceTypes, contentTypes?: Array<ContentTypes> | null, fileTypes?: Array<FileTypes> | null, extractedTypes?: Array<ObservableTypes> | null, extractedCount?: number | null, azureText?: { __typename?: 'AzureTextExtractionProperties', confidenceThreshold?: number | null, enablePII?: boolean | null } | null, azureImage?: { __typename?: 'AzureImageExtractionProperties', confidenceThreshold?: number | null } | null, modelImage?: { __typename?: 'ModelImageExtractionProperties', specification?: { __typename?: 'EntityReference', id: string } | null } | null, modelText?: { __typename?: 'ModelTextExtractionProperties', specification?: { __typename?: 'EntityReference', id: string } | null } | null } | null } | null> | null } | null, classification?: { __typename?: 'ClassificationWorkflowStage', jobs?: Array<{ __typename?: 'ClassificationWorkflowJob', connector?: { __typename?: 'ContentClassificationConnector', type: ContentClassificationServiceTypes, contentType?: ContentTypes | null, fileType?: FileTypes | null, model?: { __typename?: 'ModelContentClassificationProperties', specification?: { __typename?: 'EntityReference', id: string } | null, rules?: Array<{ __typename?: 'PromptClassificationRule', then?: string | null, if?: string | null } | null> | null } | null, regex?: { __typename?: 'RegexContentClassificationProperties', rules?: Array<{ __typename?: 'RegexClassificationRule', then?: string | null, type?: RegexSourceTypes | null, path?: string | null, matches?: string | null } | null> | null } | null } | null } | null> | null } | null, enrichment?: { __typename?: 'EnrichmentWorkflowStage', link?: { __typename?: 'LinkStrategy', enableCrawling?: boolean | null, allowedDomains?: Array<string> | null, excludedDomains?: Array<string> | null, allowedPaths?: Array<string> | null, excludedPaths?: Array<string> | null, allowedLinks?: Array<LinkTypes> | null, excludedLinks?: Array<LinkTypes> | null, allowedFiles?: Array<FileTypes> | null, excludedFiles?: Array<FileTypes> | null, allowContentDomain?: boolean | null, maximumLinks?: number | null } | null, jobs?: Array<{ __typename?: 'EnrichmentWorkflowJob', connector?: { __typename?: 'EntityEnrichmentConnector', type?: EntityEnrichmentServiceTypes | null, enrichedTypes?: Array<ObservableTypes | null> | null, fhir?: { __typename?: 'FHIREnrichmentProperties', endpoint?: any | null } | null, diffbot?: { __typename?: 'DiffbotEnrichmentProperties', key?: any | null } | null } | null } | null> | null } | null, storage?: { __typename?: 'StorageWorkflowStage', policy?: { __typename?: 'StoragePolicy', type?: StoragePolicyTypes | null, allowDuplicates?: boolean | null } | null } | null, actions?: Array<{ __typename?: 'WorkflowAction', connector?: { __typename?: 'IntegrationConnector', type: IntegrationServiceTypes, uri?: string | null, slack?: { __typename?: 'SlackIntegrationProperties', token: string, channel: string } | null, email?: { __typename?: 'EmailIntegrationProperties', from: string, subject: string, to: Array<string> } | null, twitter?: { __typename?: 'TwitterIntegrationProperties', consumerKey: string, consumerSecret: string, accessTokenKey: string, accessTokenSecret: string } | null } | null } | null> | null } | null };

export type WorkflowExistsQueryVariables = Exact<{
  filter?: InputMaybe<WorkflowFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type WorkflowExistsQuery = { __typename?: 'Query', workflowExists?: { __typename?: 'BooleanResult', result?: boolean | null } | null };

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
  JSON: { input: any; output: any; }
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
  /** Filter alert(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter alert(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of alert(s) to be returned. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter alert(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Skip the specified number of alert(s) from the beginning of the result set. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** Filter alert(s) by searching for specific text. */
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
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: Maybe<Scalars['Int']['output']>;
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
  /** The number of tokens which can provided to the Anthropic model, if using developer's own account. */
  tokenLimit?: Maybe<Scalars['Int']['output']>;
};

/** Represents Anthropic model properties. */
export type AnthropicModelPropertiesInput = {
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: InputMaybe<Scalars['Int']['input']>;
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
  /** The number of tokens which can provided to the Anthropic model, if using developer's own account. */
  tokenLimit?: InputMaybe<Scalars['Int']['input']>;
};

/** Represents Anthropic model properties. */
export type AnthropicModelPropertiesUpdateInput = {
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: InputMaybe<Scalars['Int']['input']>;
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
  /** The number of tokens which can provided to the Anthropic model, if using developer's own account. */
  tokenLimit?: InputMaybe<Scalars['Int']['input']>;
};

/** Anthropic model type */
export enum AnthropicModels {
  /** Claude 2 (Latest) */
  Claude_2 = 'CLAUDE_2',
  /** Claude 2.0 */
  Claude_2_0 = 'CLAUDE_2_0',
  /** Claude 2.1 */
  Claude_2_1 = 'CLAUDE_2_1',
  /** Claude 3 Haiku (Latest) */
  Claude_3Haiku = 'CLAUDE_3_HAIKU',
  /** Claude 3 Opus (Latest) */
  Claude_3Opus = 'CLAUDE_3_OPUS',
  /** Claude 3 Sonnet (Latest) */
  Claude_3Sonnet = 'CLAUDE_3_SONNET',
  /** Claude Instant 1 (Latest) */
  ClaudeInstant_1 = 'CLAUDE_INSTANT_1',
  /** Claude Instant 1.2 */
  ClaudeInstant_1_2 = 'CLAUDE_INSTANT_1_2',
  /** Developer-specified model */
  Custom = 'CUSTOM'
}

export enum ApplyPolicy {
  AfterResolver = 'AFTER_RESOLVER',
  BeforeResolver = 'BEFORE_RESOLVER',
  Validation = 'VALIDATION'
}

/** Represents Atlassian Jira feed properties. */
export type AtlassianJiraFeedProperties = {
  __typename?: 'AtlassianJiraFeedProperties';
  /** Atlassian account email address. */
  email: Scalars['String']['output'];
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
  duration?: Maybe<Scalars['String']['output']>;
  /** The episode name, if podcast episode. */
  episode?: Maybe<Scalars['String']['output']>;
  /** The episode type, if podcast episode. */
  episodeType?: Maybe<Scalars['String']['output']>;
  /** The audio genre. */
  genre?: Maybe<Scalars['String']['output']>;
  /** The episode keywords, if podcast episode. */
  keywords?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The audio language. */
  language?: Maybe<Scalars['String']['output']>;
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
  /** The audio language. */
  language?: InputMaybe<Scalars['String']['input']>;
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

/** Represents the Azure Document Intelligence preparation properties. */
export type AzureDocumentPreparationProperties = {
  __typename?: 'AzureDocumentPreparationProperties';
  /** The Azure Document Intelligence model. */
  model?: Maybe<AzureDocumentIntelligenceModels>;
};

/** Represents the Azure Document Intelligence preparation properties. */
export type AzureDocumentPreparationPropertiesInput = {
  /** The Azure Document Intelligence model. */
  model?: InputMaybe<AzureDocumentIntelligenceModels>;
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
  /** The number of tokens which can provided to the OpenAI model, if using developer's own account. */
  tokenLimit?: Maybe<Scalars['Int']['output']>;
};

/** Represents Azure OpenAI model properties. */
export type AzureOpenAiModelPropertiesInput = {
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

/** Azure OpenAI model type */
export enum AzureOpenAiModels {
  /** Developer-specified deployment */
  Custom = 'CUSTOM',
  /** GPT-4 (Latest version) */
  Gpt4 = 'GPT4',
  /** GPT-4 Turbo 128k (Latest version) */
  Gpt4Turbo_128K = 'GPT4_TURBO_128K',
  /** GPT-3.5 Turbo 16k (Latest version) */
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
  /** Filter category(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter category(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of category(s) to be returned. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter category(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Skip the specified number of category(s) from the beginning of the result set. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** Filter category(s) by searching for specific text. */
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

/** Represents Cohere model properties. */
export type CohereModelProperties = {
  __typename?: 'CohereModelProperties';
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

/** Cohere model type */
export enum CohereModels {
  /** Command R */
  CommandR = 'COMMAND_R',
  /** Command R+ */
  CommandRPlus = 'COMMAND_R_PLUS',
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
  /** The state of the collection (i.e. created, finished). */
  state: EntityState;
  /** The collection type. */
  type?: Maybe<CollectionTypes>;
};

/** Represents a filter for collections. */
export type CollectionFilter = {
  /** Filter collection(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter collection(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of collection(s) to be returned. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter collection(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Skip the specified number of collection(s) from the beginning of the result set. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** Filter collection(s) by searching for specific text. */
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
  Collection = 'COLLECTION'
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
  boundary?: Maybe<Scalars['JSON']['output']>;
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
  /** The content image metadata. */
  image?: Maybe<ImageMetadata>;
  /** The image rendition URI of the content. For web pages, this will contain a PNG screenshot of the website. For images, this will contain a rescaled JPEG rendition of the content. */
  imageUri?: Maybe<Scalars['URL']['output']>;
  /** The content issue metadata. */
  issue?: Maybe<IssueMetadata>;
  /** The extracted hyperlinks. */
  links?: Maybe<Array<LinkReferenceType>>;
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

/** Represents a content filter. */
export type ContentCriteria = {
  __typename?: 'ContentCriteria';
  /** Filter by collections. */
  collections?: Maybe<Array<EntityReference>>;
  /** Filter by similar contents. */
  contents?: Maybe<Array<EntityReference>>;
  /** Filter by creation date range. */
  creationDateRange?: Maybe<DateRange>;
  /** Filter by original date range. */
  dateRange?: Maybe<DateRange>;
  /** Filter by feeds. */
  feeds?: Maybe<Array<EntityReference>>;
  /** Filter by file types. */
  fileTypes?: Maybe<Array<Maybe<FileTypes>>>;
  /** Filter by observations. */
  observations?: Maybe<Array<ObservationCriteria>>;
  /** Filter by content types. */
  types?: Maybe<Array<ContentTypes>>;
  /** Filter by workflows. */
  workflows?: Maybe<Array<EntityReference>>;
};

/** Represents a content filter. */
export type ContentCriteriaInput = {
  /** Filter by collections. */
  collections?: InputMaybe<Array<EntityReferenceInput>>;
  /** Filter by similar contents. */
  contents?: InputMaybe<Array<EntityReferenceInput>>;
  /** Filter by creation date range. */
  creationDateRange?: InputMaybe<DateRangeInput>;
  /** Filter by original date range. */
  dateRange?: InputMaybe<DateRangeInput>;
  /** Filter by feeds. */
  feeds?: InputMaybe<Array<EntityReferenceInput>>;
  /** Filter by file types. */
  fileTypes?: InputMaybe<Array<FileTypes>>;
  /** Filter by observations. */
  observations?: InputMaybe<Array<ObservationCriteriaInput>>;
  /** Filter by content types. */
  types?: InputMaybe<Array<ContentTypes>>;
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
  /** Filter by geo-boundaries, as GeoJSON Feature with Polygon geometry. */
  boundaries?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
  /** Filter by collections. */
  collections?: InputMaybe<Array<EntityReferenceFilter>>;
  /** Filter by similar contents. */
  contents?: InputMaybe<Array<EntityReferenceFilter>>;
  /** Filter content(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
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
  /** Limit the number of content(s) to be returned. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter by geo-location. */
  location?: InputMaybe<PointFilter>;
  /** Filter content(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** When using similarity search, the number of similar items to be returned. Defaults to 10. */
  numberSimilar?: InputMaybe<Scalars['Int']['input']>;
  /** Filter by observations. */
  observations?: InputMaybe<Array<ObservationReferenceFilter>>;
  /** Skip the specified number of content(s) from the beginning of the result set. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** Filter by original date range. */
  originalDateRange?: InputMaybe<DateRangeFilter>;
  /** The query syntax for the search text. Defaults to Simple. */
  queryType?: InputMaybe<SearchQueryTypes>;
  /** Filter content(s) by searching for specific text. */
  search?: InputMaybe<Scalars['String']['input']>;
  /** The type of search to be used. Defaults to Vector. */
  searchType?: InputMaybe<SearchTypes>;
  /** Filter content(s) by their states. */
  states?: InputMaybe<Array<EntityState>>;
  /** Filter by content types. */
  types?: InputMaybe<Array<ContentTypes>>;
  /** The content URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
  /** Filter by workflows. */
  workflows?: InputMaybe<Array<EntityReferenceFilter>>;
};

/** Represents the configuration for retrieving the knowledge graph. */
export type ContentGraphInput = {
  /** The observable types. */
  types?: InputMaybe<Array<InputMaybe<ObservableTypes>>>;
};

/** Represents content. */
export type ContentInput = {
  /** The content description. */
  description?: InputMaybe<Scalars['String']['input']>;
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
  /** The specific properties for ElevenLabs publishing. */
  elevenLabs?: Maybe<ElevenLabsPublishingProperties>;
  /** The content publishing format, i.e. MP3, Markdown. */
  format: ContentPublishingFormats;
  /** The content publishing service type. */
  type: ContentPublishingServiceTypes;
};

/** Represents a content publishing connector. */
export type ContentPublishingConnectorInput = {
  /** The specific properties for ElevenLabs publishing. */
  elevenLabs?: InputMaybe<ElevenLabsPublishingPropertiesInput>;
  /** The content publishing format, i.e. MP3, Markdown. */
  format: ContentPublishingFormats;
  /** The content publishing service type. */
  type: ContentPublishingServiceTypes;
};

/** Represents a content publishing connector. */
export type ContentPublishingConnectorUpdateInput = {
  /** The specific properties for ElevenLabs publishing. */
  elevenLabs?: InputMaybe<ElevenLabsPublishingPropertiesInput>;
  /** The content publishing format, i.e. MP3, Markdown. */
  format?: InputMaybe<ContentPublishingFormats>;
  /** The content publishing service type. */
  type?: InputMaybe<ContentPublishingServiceTypes>;
};

export enum ContentPublishingFormats {
  /** HTML */
  Html = 'HTML',
  /** Markdown */
  Markdown = 'MARKDOWN',
  /** MP3 */
  Mp3 = 'MP3',
  /** Plain Text */
  Text = 'TEXT'
}

/** Content publishing service type */
export enum ContentPublishingServiceTypes {
  /** ElevenLabs Audio publishing */
  ElevenLabsAudio = 'ELEVEN_LABS_AUDIO',
  /** Text publishing */
  Text = 'TEXT'
}

/** Represents content query results. */
export type ContentResults = {
  __typename?: 'ContentResults';
  /** The content facets. */
  facets?: Maybe<Array<Maybe<ContentFacet>>>;
  /** The knowledge graph generated from the content results. */
  graph?: Maybe<Graph>;
  /** The content H3 facets. */
  h3?: Maybe<H3Facets>;
  /** The content results. */
  results?: Maybe<Array<Maybe<Content>>>;
};

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
  /** The ID of the content to update. */
  id: Scalars['ID']['input'];
  /** The content image metadata. */
  image?: InputMaybe<ImageMetadataInput>;
  /** The content issue metadata. */
  issue?: InputMaybe<IssueMetadataInput>;
  /** The name of the content. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The content package metadata. */
  package?: InputMaybe<PackageMetadataInput>;
  /** The content point cloud metadata. */
  pointCloud?: InputMaybe<PointCloudMetadataInput>;
  /** The content shape metadata. */
  shape?: InputMaybe<ShapeMetadataInput>;
  /** The content video metadata. */
  video?: InputMaybe<VideoMetadataInput>;
};

/** Represents a conversation. */
export type Conversation = {
  __typename?: 'Conversation';
  /** The contents referenced by the conversation. */
  contents?: Maybe<Array<Maybe<Content>>>;
  /** The tenant correlation identifier. */
  correlationId?: Maybe<Scalars['String']['output']>;
  /** The creation date of the conversation. */
  creationDate: Scalars['DateTime']['output'];
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
  text?: Maybe<Scalars['String']['output']>;
};

/** Represents a filter for conversations. */
export type ConversationFilter = {
  /** Filter by similar conversations. */
  conversations?: InputMaybe<Array<EntityReferenceFilter>>;
  /** Filter conversation(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter conversation(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of conversation(s) to be returned. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter conversation(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** When using similarity search, the number of similar items to be returned. Defaults to 10. */
  numberSimilar?: InputMaybe<Scalars['Int']['input']>;
  /** Skip the specified number of conversation(s) from the beginning of the result set. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** The query syntax for the search text. Defaults to Simple. */
  queryType?: InputMaybe<SearchQueryTypes>;
  /** Filter conversation(s) by searching for specific text. */
  search?: InputMaybe<Scalars['String']['input']>;
  /** The type of search to be used. Defaults to Vector. */
  searchType?: InputMaybe<SearchTypes>;
  /** Filter conversation(s) by their states. */
  states?: InputMaybe<Array<EntityState>>;
  /** Filter by conversation types. */
  types?: InputMaybe<Array<ConversationTypes>>;
};

/** Represents a conversation. */
export type ConversationInput = {
  /** Filter content for conversation. */
  filter?: InputMaybe<ContentCriteriaInput>;
  /** The name of the conversation. */
  name: Scalars['String']['input'];
  /** The LLM specification used by this conversation. */
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
  /** The conversation message. */
  message: Scalars['String']['output'];
  /** The LLM description, only provided with assistant role. */
  model?: Maybe<Scalars['String']['output']>;
  /** The LLM service type, only provided with assistant role. */
  modelService?: Maybe<ModelServiceTypes>;
  /** The conversation message role. */
  role: ConversationRoleTypes;
  /** The LLM completion throughput in tokens/second, only provided with assistant role. */
  throughput?: Maybe<Scalars['Float']['output']>;
  /** The conversation message timestamp. */
  timestamp: Scalars['DateTime']['output'];
  /** The conversation message token usage, not including RAG context tokens. */
  tokens: Scalars['Int']['output'];
};

/** Represents conversation query results. */
export type ConversationResults = {
  __typename?: 'ConversationResults';
  /** The list of conversation query results. */
  results?: Maybe<Array<Maybe<Conversation>>>;
};

export enum ConversationRoleTypes {
  Assistant = 'ASSISTANT',
  Function = 'FUNCTION',
  System = 'SYSTEM',
  User = 'USER'
}

/** Conversation search type */
export enum ConversationSearchTypes {
  /** Hybrid (Vector similarity using search text) */
  Hybrid = 'HYBRID',
  /** Vector similarity */
  Vector = 'VECTOR'
}

/** Represents a conversation strategy. */
export type ConversationStrategy = {
  __typename?: 'ConversationStrategy';
  /** @deprecated Moved to retrieval strategy. */
  contentLimit?: Maybe<Scalars['Int']['output']>;
  /** The weight of contents within prompt context, in range [0.0 - 1.0]. */
  contentsWeight?: Maybe<Scalars['Float']['output']>;
  /** Embed content citations into completed converation messages. */
  embedCitations?: Maybe<Scalars['Boolean']['output']>;
  /** @deprecated Moved to retrieval strategy. */
  enableExpandedRetrieval?: Maybe<Scalars['Boolean']['output']>;
  /** Provide content facets with completed conversation. */
  enableFacets?: Maybe<Scalars['Boolean']['output']>;
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
  /** The maximum number of retrieval user messages to provide with prompt context. Defaults to 5. */
  messageLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The weight of conversation messages within prompt context, in range [0.0 - 1.0]. */
  messagesWeight?: InputMaybe<Scalars['Float']['input']>;
  /** The conversation strategy type. */
  type?: InputMaybe<ConversationStrategyTypes>;
};

/** Conversation type */
export enum ConversationTypes {
  /** Conversation over content */
  Content = 'CONTENT'
}

/** Represents a conversation. */
export type ConversationUpdateInput = {
  /** Filter content for conversation. */
  filter?: InputMaybe<ContentCriteriaInput>;
  /** The ID of the conversation to update. */
  id: Scalars['ID']['input'];
  /** The name of the conversation. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The LLM specification used by this conversation. */
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
  /** Whether to enable redaction during Deepgram audio transcription. */
  enableRedaction?: Maybe<Scalars['Boolean']['output']>;
  /** Whether to enable speaker diarization during Deepgram audio transcription. */
  enableSpeakerDiarization?: Maybe<Scalars['Boolean']['output']>;
  /** The Deepgram API key. */
  key?: Maybe<Scalars['String']['output']>;
  /** The Deepgram transcription model. */
  model?: Maybe<DeepgramModels>;
};

/** Represents the Deepgram preparation properties. */
export type DeepgramAudioPreparationPropertiesInput = {
  /** Whether to enable redaction during Deepgram audio transcription. */
  enableRedaction?: InputMaybe<Scalars['Boolean']['input']>;
  /** Whether to enable speaker diarization during Deepgram audio transcription. */
  enableSpeakerDiarization?: InputMaybe<Scalars['Boolean']['input']>;
  /** The Deepgram API key. */
  key?: InputMaybe<Scalars['String']['input']>;
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

/** ElevenLabs models */
export enum ElevenLabsModels {
  /** Eleven English v1 */
  EnglishV1 = 'ENGLISH_V1',
  /** Eleven Multilingual v1 */
  MultilingualV1 = 'MULTILINGUAL_V1',
  /** Eleven Multilingual v2 */
  MultilingualV2 = 'MULTILINGUAL_V2',
  /** Eleven Turbo v2 */
  TurboV2 = 'TURBO_V2'
}

/** Represents the ElevenLabs publishing properties. */
export type ElevenLabsPublishingProperties = {
  __typename?: 'ElevenLabsPublishingProperties';
  /** The ElevenLabs model. */
  model?: Maybe<ElevenLabsModels>;
  /** The ElevenLabs voice identifier. */
  voice?: Maybe<Scalars['String']['output']>;
};

/** Represents the ElevenLabs publishing properties. */
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
  /** The observable entity types to be enriched. */
  enrichedTypes?: Maybe<Array<Maybe<ObservableTypes>>>;
  /** The entity enrichment service type. */
  type?: Maybe<EntityEnrichmentServiceTypes>;
};

/** Represents an entity enrichment connector. */
export type EntityEnrichmentConnectorInput = {
  /** The observable entity types to be enriched. */
  enrichedTypes?: InputMaybe<Array<InputMaybe<ObservableTypes>>>;
  /** The entity enrichment service type. */
  type: EntityEnrichmentServiceTypes;
};

/** Entity enrichment service types */
export enum EntityEnrichmentServiceTypes {
  /** Crunchbase */
  Crunchbase = 'CRUNCHBASE',
  /** Diffbot */
  Diffbot = 'DIFFBOT',
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
  /** The observable entity types to be extracted, defaults to all observables. */
  extractedTypes?: Maybe<Array<ObservableTypes>>;
  /** The file types to allow for entity extraction. */
  fileTypes?: Maybe<Array<FileTypes>>;
  /** The specific properties for LLM text entity extraction. */
  modelText?: Maybe<ModelTextExtractionProperties>;
  /** The specific properties for OpenAI image entity extraction. */
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
  /** The observable entity types to be extracted, defaults to all observables. */
  extractedTypes?: InputMaybe<Array<ObservableTypes>>;
  /** The file types to allow for entity extraction. */
  fileTypes?: InputMaybe<Array<FileTypes>>;
  /** The specific properties for LLM text entity extraction. */
  modelText?: InputMaybe<ModelTextExtractionPropertiesInput>;
  /** The specific properties for OpenAI image entity extraction. */
  openAIImage?: InputMaybe<OpenAiImageExtractionPropertiesInput>;
  /** The entity extraction service type. */
  type: EntityExtractionServiceTypes;
};

/** Entity extraction service type */
export enum EntityExtractionServiceTypes {
  /** Azure Cognitive Services Image */
  AzureCognitiveServicesImage = 'AZURE_COGNITIVE_SERVICES_IMAGE',
  /** Azure Cognitive Services Text */
  AzureCognitiveServicesText = 'AZURE_COGNITIVE_SERVICES_TEXT',
  /** LLM Text */
  ModelText = 'MODEL_TEXT',
  /** OpenAI Image */
  OpenAiImage = 'OPEN_AI_IMAGE',
  /** Roboflow Image */
  RoboflowImage = 'ROBOFLOW_IMAGE'
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
  boundary?: Maybe<Scalars['JSON']['output']>;
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
  links?: Maybe<Array<Maybe<LinkReferenceType>>>;
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
  /** The event start date. */
  startDate?: Maybe<Scalars['DateTime']['output']>;
  /** The state of the event (i.e. created, enabled). */
  state: EntityState;
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
  boundaries?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
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
  /** Limit the number of event(s) to be returned. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter by observable geo-location. */
  location?: InputMaybe<PointFilter>;
  /** Filter by the event maximum price. */
  maxPrice?: InputMaybe<Scalars['Decimal']['input']>;
  /** Filter by the event minimum price. */
  minPrice?: InputMaybe<Scalars['Decimal']['input']>;
  /** Filter event(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Skip the specified number of event(s) from the beginning of the result set. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** Filter by the event price. */
  price?: InputMaybe<Scalars['Decimal']['input']>;
  /** Filter by the currency of the event price. */
  priceCurrency?: InputMaybe<Scalars['String']['input']>;
  /** Filter event(s) by searching for specific text. */
  search?: InputMaybe<Scalars['String']['input']>;
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
  boundary?: InputMaybe<Scalars['JSON']['input']>;
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
  boundary?: InputMaybe<Scalars['JSON']['input']>;
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

/** Represents an prompted LLM extraction. */
export type ExtractCompletion = {
  __typename?: 'ExtractCompletion';
  /** The content. */
  content?: Maybe<EntityReference>;
  /** The end time of the audio transcript segment. */
  endTime?: Maybe<Scalars['TimeSpan']['output']>;
  /** If prompt extraction failed, the error message. */
  error?: Maybe<Scalars['String']['output']>;
  /** The page index of the text document. */
  pageNumber?: Maybe<Scalars['Int']['output']>;
  /** The LLM specification. */
  specification?: Maybe<EntityReference>;
  /** The start time of the audio transcript segment. */
  startTime?: Maybe<Scalars['TimeSpan']['output']>;
  /** The extracted JSON value. */
  value?: Maybe<Scalars['String']['output']>;
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
  /** The RSS feed properties. */
  rss?: Maybe<RssFeedProperties>;
  /** The feed schedule policy. */
  schedulePolicy?: Maybe<FeedSchedulePolicy>;
  /** The site feed properties. */
  site?: Maybe<SiteFeedProperties>;
  /** The Slack feed properties. */
  slack?: Maybe<SlackFeedProperties>;
  /** The state of the feed (i.e. created, finished). */
  state: EntityState;
  /** The feed type. */
  type: FeedTypes;
  /** The web feed properties. */
  web?: Maybe<WebFeedProperties>;
  workflow?: Maybe<Workflow>;
  /** The YouTube feed properties. */
  youtube?: Maybe<YouTubeFeedProperties>;
};

/** Feed connector type */
export enum FeedConnectorTypes {
  /** Amazon Web Services feed connector */
  Amazon = 'AMAZON',
  /** Atlassian feed connector */
  Atlassian = 'ATLASSIAN',
  /** Microsoft Azure feed connector */
  Azure = 'AZURE',
  /** GitHub feed connector */
  GitHub = 'GIT_HUB',
  /** Google Cloud feed connector */
  Google = 'GOOGLE',
  /** Google Drive feed connector */
  GoogleDrive = 'GOOGLE_DRIVE',
  /** Google Mail feed connector */
  GoogleEmail = 'GOOGLE_EMAIL',
  /** Linear feed connector */
  Linear = 'LINEAR',
  /** Microsoft Outlook Email feed connector */
  MicrosoftEmail = 'MICROSOFT_EMAIL',
  /** Microsoft OneDrive feed connector */
  OneDrive = 'ONE_DRIVE',
  /** Microsoft SharePoint feed connector */
  SharePoint = 'SHARE_POINT'
}

/** Represents a filter for feeds. */
export type FeedFilter = {
  /** Filter feed(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter feed(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of feed(s) to be returned. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter feed(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Skip the specified number of feed(s) from the beginning of the result set. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** Filter feed(s) by searching for specific text. */
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
  /** The site feed properties. */
  site?: InputMaybe<SiteFeedPropertiesInput>;
  /** The Slack feed properties. */
  slack?: InputMaybe<SlackFeedPropertiesInput>;
  /** The feed type. */
  type: FeedTypes;
  /** The web feed properties. */
  web?: InputMaybe<WebFeedPropertiesInput>;
  /** The content workflow applied to the feed. */
  workflow?: InputMaybe<EntityReferenceInput>;
  /** The YouTube feed properties. */
  youtube?: InputMaybe<YouTubeFeedPropertiesInput>;
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
  /** GitHub Issues feed service */
  GitHubIssues = 'GIT_HUB_ISSUES',
  /** Google Cloud Blob feed service */
  GoogleBlob = 'GOOGLE_BLOB',
  /** Google Drive feed service */
  GoogleDrive = 'GOOGLE_DRIVE',
  /** Google Mail feed service */
  GoogleEmail = 'GOOGLE_EMAIL',
  /** Linear feed service */
  Linear = 'LINEAR',
  /** Microsoft Outlook Email feed service */
  MicrosoftEmail = 'MICROSOFT_EMAIL',
  /** Microsoft OneDrive feed service */
  OneDrive = 'ONE_DRIVE',
  /** AWS S3 Blob feed service */
  S3Blob = 'S3_BLOB',
  /** Microsoft SharePoint feed service */
  SharePoint = 'SHARE_POINT'
}

/** Feed type */
export enum FeedTypes {
  /** Discord channel feed */
  Discord = 'DISCORD',
  /** Email feed */
  Email = 'EMAIL',
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
  /** Cloud storage site feed */
  Site = 'SITE',
  /** Slack channel feed */
  Slack = 'SLACK',
  /** Web feed */
  Web = 'WEB',
  /** YouTube audio feed */
  YouTube = 'YOU_TUBE'
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
  /** The site feed properties. */
  site?: InputMaybe<SiteFeedPropertiesUpdateInput>;
  /** The Slack feed properties. */
  slack?: InputMaybe<SlackFeedPropertiesUpdateInput>;
  /** The feed type. */
  type?: InputMaybe<FeedTypes>;
  /** The web feed properties. */
  web?: InputMaybe<WebFeedPropertiesUpdateInput>;
  /** The content workflow applied to the feed. */
  workflow?: InputMaybe<EntityReferenceInput>;
  /** The YouTube feed properties. */
  youtube?: InputMaybe<YouTubeFeedPropertiesUpdateInput>;
};

/** Represents a file preparation connector. */
export type FilePreparationConnector = {
  __typename?: 'FilePreparationConnector';
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
  /** The file preparation service type. */
  type: FilePreparationServiceTypes;
};

/** Represents a file preparation connector. */
export type FilePreparationConnectorInput = {
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
  /** The file preparation service type. */
  type: FilePreparationServiceTypes;
};

/** File preparation service type */
export enum FilePreparationServiceTypes {
  /** Azure Document Intelligence */
  AzureDocumentIntelligence = 'AZURE_DOCUMENT_INTELLIGENCE',
  /** Deepgram Audio Transcription */
  Deepgram = 'DEEPGRAM',
  /** Document */
  Document = 'DOCUMENT',
  /** Email */
  Email = 'EMAIL'
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

/** Represents Google Drive properties. */
export type GoogleDriveFeedProperties = {
  __typename?: 'GoogleDriveFeedProperties';
  /** Google Drive folder identifier. */
  folderId?: Maybe<Scalars['String']['output']>;
  /** Google Drive refresh token. */
  refreshToken: Scalars['String']['output'];
};

/** Represents Google Drive properties. */
export type GoogleDriveFeedPropertiesInput = {
  /** Google Drive folder identifier. */
  folderId?: InputMaybe<Scalars['String']['input']>;
  /** Google Drive refresh token. */
  refreshToken: Scalars['String']['input'];
};

/** Represents Google Drive properties. */
export type GoogleDriveFeedPropertiesUpdateInput = {
  /** Google Drive folder identifier. */
  folderId?: InputMaybe<Scalars['String']['input']>;
  /** Google Drive refresh token. */
  refreshToken?: InputMaybe<Scalars['String']['input']>;
};

/** Represents Google Email feed properties. */
export type GoogleEmailFeedProperties = {
  __typename?: 'GoogleEmailFeedProperties';
  /** Google refresh token. */
  refreshToken?: Maybe<Scalars['String']['output']>;
  /** Email listing type, i.e. past or new emails. */
  type?: Maybe<EmailListingTypes>;
};

/** Represents Google Email feed properties. */
export type GoogleEmailFeedPropertiesInput = {
  /** Google refresh token. */
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  /** Email listing type, i.e. past or new emails. */
  type?: InputMaybe<EmailListingTypes>;
};

/** Represents Google Email feed properties. */
export type GoogleEmailFeedPropertiesUpdateInput = {
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

/** Groq model type */
export enum GroqModels {
  /** Developer-specified model */
  Custom = 'CUSTOM',
  /** LLaMA3 8b */
  Llama_3_8B = 'LLAMA_3_8B',
  /** LLaMA3 70b */
  Llama_3_70B = 'LLAMA_3_70B',
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

/** Represents an ingestion content filter. */
export type IngestionContentFilter = {
  __typename?: 'IngestionContentFilter';
  /** Filter by file types. */
  fileTypes?: Maybe<Array<Maybe<FileTypes>>>;
  /** Filter by content types. */
  types?: Maybe<Array<Maybe<ContentTypes>>>;
};

/** Represents an ingestion content filter. */
export type IngestionContentFilterInput = {
  /** Filter by file types. */
  fileTypes?: InputMaybe<Array<InputMaybe<FileTypes>>>;
  /** Filter by content types. */
  types?: InputMaybe<Array<InputMaybe<ContentTypes>>>;
};

/** Represents the ingestion workflow stage. */
export type IngestionWorkflowStage = {
  __typename?: 'IngestionWorkflowStage';
  /** The collections to be assigned to ingested content. */
  collections?: Maybe<Array<Maybe<EntityReference>>>;
  /** The ingestion filter. */
  if?: Maybe<IngestionContentFilter>;
};

/** Represents the ingestion workflow stage. */
export type IngestionWorkflowStageInput = {
  /** The collections to be assigned to ingested content. */
  collections?: InputMaybe<Array<InputMaybe<EntityReferenceInput>>>;
  /** The ingestion filter. */
  if?: InputMaybe<IngestionContentFilterInput>;
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
  /** Slack integration properties. */
  slack?: Maybe<SlackIntegrationProperties>;
  /** Integration service type. */
  type: IntegrationServiceTypes;
  /** The URI for the integration, i.e. webhook URI. */
  uri?: Maybe<Scalars['String']['output']>;
};

/** Represents an integration connector. */
export type IntegrationConnectorInput = {
  /** Slack integration properties. */
  slack?: InputMaybe<SlackIntegrationPropertiesInput>;
  /** Integration service type. */
  type: IntegrationServiceTypes;
  /** The URI for the integration, i.e. webhook URI. */
  uri?: InputMaybe<Scalars['String']['input']>;
};

/** Represents an integration connector. */
export type IntegrationConnectorUpdateInput = {
  /** Slack integration properties. */
  slack?: InputMaybe<SlackIntegrationPropertiesInput>;
  /** The URI for the integration, i.e. webhook URI. */
  uri?: InputMaybe<Scalars['String']['input']>;
};

/** Integration service type */
export enum IntegrationServiceTypes {
  /** Slack */
  Slack = 'SLACK',
  /** HTTP WebHook integration service */
  WebHook = 'WEB_HOOK'
}

/** Represents issue feed properties. */
export type IssueFeedProperties = {
  __typename?: 'IssueFeedProperties';
  /** Feed connector type. */
  connectorType: FeedConnectorTypes;
  /** GitHub Issues properties. */
  github?: Maybe<GitHubIssuesFeedProperties>;
  /** Should the issue feed include attachments. */
  includeAttachments?: Maybe<Scalars['Boolean']['output']>;
  /** Atlassian Jira properties. */
  jira?: Maybe<AtlassianJiraFeedProperties>;
  /** Linear properties. */
  linear?: Maybe<LinearFeedProperties>;
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: Maybe<Scalars['Int']['output']>;
  /** Feed service type. */
  type: FeedServiceTypes;
};

/** Represents issue feed properties. */
export type IssueFeedPropertiesInput = {
  /** GitHub Issues properties. */
  github?: InputMaybe<GitHubIssuesFeedPropertiesInput>;
  /** Should the issue feed include attachments. */
  includeAttachments?: InputMaybe<Scalars['Boolean']['input']>;
  /** Atlassian Jira properties. */
  jira?: InputMaybe<AtlassianJiraFeedPropertiesInput>;
  /** Linear properties. */
  linear?: InputMaybe<LinearFeedPropertiesInput>;
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: InputMaybe<Scalars['Int']['input']>;
  /** Feed service type. */
  type: FeedServiceTypes;
};

/** Represents issue feed properties. */
export type IssueFeedPropertiesUpdateInput = {
  /** GitHub Issues properties. */
  github?: InputMaybe<GitHubIssuesFeedPropertiesUpdateInput>;
  /** Should the issue feed include attachments. */
  includeAttachments?: InputMaybe<Scalars['Boolean']['input']>;
  /** Atlassian Jira properties. */
  jira?: InputMaybe<AtlassianJiraFeedPropertiesUpdateInput>;
  /** Linear properties. */
  linear?: InputMaybe<LinearFeedPropertiesUpdateInput>;
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: InputMaybe<Scalars['Int']['input']>;
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
  /** Filter label(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter label(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of label(s) to be returned. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter label(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Skip the specified number of label(s) from the beginning of the result set. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** Filter label(s) by searching for specific text. */
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

/** Represents a hyperlink. */
export type LinkReferenceType = {
  __typename?: 'LinkReferenceType';
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
  /** Whether link crawling is enabled. */
  enableCrawling?: Maybe<Scalars['Boolean']['output']>;
  /** The list of DNS domains to not be crawled, i.e. example.com. */
  excludedDomains?: Maybe<Array<Scalars['String']['output']>>;
  /** The excluded link types. */
  excludedFiles?: Maybe<Array<FileTypes>>;
  /** The excluded link types. */
  excludedLinks?: Maybe<Array<LinkTypes>>;
  /** The maximum number of links to be crawled. */
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
  /** Whether link crawling is enabled. */
  enableCrawling?: InputMaybe<Scalars['Boolean']['input']>;
  /** The list of DNS domains to not be crawled, i.e. example.com. */
  excludedDomains?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The excluded link types. */
  excludedFiles?: InputMaybe<Array<FileTypes>>;
  /** The excluded link types. */
  excludedLinks?: InputMaybe<Array<LinkTypes>>;
  /** The maximum number of links to be crawled. */
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
  /** Filter metadata(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter metadata(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of metadata(s) to be returned. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter by metadata types. */
  metadataTypes?: InputMaybe<Array<InputMaybe<MetadataTypes>>>;
  /** Filter metadata(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Skip the specified number of metadata(s) from the beginning of the result set. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** Filter metadata(s) by searching for specific text. */
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

/** Represents Microsoft Email feed properties. */
export type MicrosoftEmailFeedProperties = {
  __typename?: 'MicrosoftEmailFeedProperties';
  /** Microsoft refresh token. */
  refreshToken?: Maybe<Scalars['String']['output']>;
  /** Azure Active Directory tenant identifier. */
  tenantId?: Maybe<Scalars['String']['output']>;
  /** Email listing type, i.e. past or new emails. */
  type?: Maybe<EmailListingTypes>;
};

/** Represents Microsoft Email feed properties. */
export type MicrosoftEmailFeedPropertiesInput = {
  /** Microsoft refresh token. */
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  /** Azure Active Directory tenant identifier. */
  tenantId?: InputMaybe<Scalars['String']['input']>;
  /** Email listing type, i.e. past or new emails. */
  type?: InputMaybe<EmailListingTypes>;
};

/** Represents Microsoft Email feed properties. */
export type MicrosoftEmailFeedPropertiesUpdateInput = {
  /** Microsoft refresh token. */
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  /** Azure Active Directory tenant identifier. */
  tenantId?: InputMaybe<Scalars['String']['input']>;
  /** Email listing type, i.e. past or new emails. */
  type?: InputMaybe<EmailListingTypes>;
};

/** Represents Microsoft Teams feed properties. */
export type MicrosoftTeamsFeedProperties = {
  __typename?: 'MicrosoftTeamsFeedProperties';
  /** The Microsoft Teams channel identifier. */
  channel: Scalars['String']['output'];
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: Maybe<Scalars['Int']['output']>;
  /** The Microsoft Graph refresh token. */
  refreshToken: Scalars['String']['output'];
  /** The Microsoft Teams team identifier. */
  team: Scalars['String']['output'];
  /** Azure Active Directory tenant identifier. */
  tenantId: Scalars['String']['output'];
  /** Feed listing type, i.e. past or new messages. */
  type?: Maybe<FeedListingTypes>;
};

/** Represents Microsoft Teams feed properties. */
export type MicrosoftTeamsFeedPropertiesInput = {
  /** The Microsoft Teams channel identifier. */
  channel: Scalars['String']['input'];
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The Microsoft Graph refresh token. */
  refreshToken: Scalars['String']['input'];
  /** The Microsoft Teams team identifier. */
  team: Scalars['String']['input'];
  /** Azure Active Directory tenant identifier. */
  tenantId: Scalars['String']['input'];
  /** Feed listing type, i.e. past or new messages. */
  type?: InputMaybe<FeedListingTypes>;
};

/** Represents Microsoft Teams feed properties. */
export type MicrosoftTeamsFeedPropertiesUpdateInput = {
  /** The Microsoft Teams channel identifier. */
  channel: Scalars['String']['input'];
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The Microsoft Graph refresh token. */
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  /** The Microsoft Teams team identifier. */
  team: Scalars['String']['input'];
  /** Azure Active Directory tenant identifier. */
  tenantId?: InputMaybe<Scalars['String']['input']>;
  /** Feed listing type, i.e. past or new messages. */
  type?: InputMaybe<FeedListingTypes>;
};

/** Represents Mistral model properties. */
export type MistralModelProperties = {
  __typename?: 'MistralModelProperties';
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

/** Mistral model type */
export enum MistralModels {
  /** Developer-specified model */
  Custom = 'CUSTOM',
  /** Mistral Large */
  MistralLarge = 'MISTRAL_LARGE',
  /** Mistral Medium */
  MistralMedium = 'MISTRAL_MEDIUM',
  /** Mistral Small */
  MistralSmall = 'MISTRAL_SMALL',
  /** Mixtral 8x7b Instruct */
  Mixtral_8X7BInstruct = 'MIXTRAL_8X7B_INSTRUCT'
}

/** Model service type */
export enum ModelServiceTypes {
  /** Anthropic */
  Anthropic = 'ANTHROPIC',
  /** Azure OpenAI */
  AzureOpenAi = 'AZURE_OPEN_AI',
  /** Cohere */
  Cohere = 'COHERE',
  /** Groq */
  Groq = 'GROQ',
  /** Mistral */
  Mistral = 'MISTRAL',
  /** OpenAI */
  OpenAi = 'OPEN_AI',
  /** Replicate */
  Replicate = 'REPLICATE',
  /** TogetherAI */
  TogetherAi = 'TOGETHER_AI'
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

export type Mutation = {
  __typename?: 'Mutation';
  /**
   * Adds contents to a collection.
   * @deprecated Use addContentsToCollections instead.
   */
  addCollectionContents?: Maybe<Collection>;
  /** Adds contents to one or more collections. */
  addContentsToCollections?: Maybe<Array<Maybe<Collection>>>;
  /** Clears an existing conversation. */
  clearConversation?: Maybe<Conversation>;
  /** Closes an existing collection. */
  closeCollection?: Maybe<Collection>;
  /** Closes an existing conversation. */
  closeConversation?: Maybe<Conversation>;
  /** Creates a new alert. */
  createAlert?: Maybe<Alert>;
  /** Creates a new category. */
  createCategory?: Maybe<Category>;
  /** Creates a new collection. */
  createCollection?: Maybe<Collection>;
  /** Creates a new conversation. */
  createConversation?: Maybe<Conversation>;
  /** Creates a new event. */
  createEvent?: Maybe<Event>;
  /** Creates a new feed. */
  createFeed?: Maybe<Feed>;
  /** Creates a new label. */
  createLabel?: Maybe<Label>;
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
  /** Deletes a content workflow. */
  deleteWorkflow?: Maybe<Workflow>;
  /** Deletes multiple workflows given their IDs. */
  deleteWorkflows?: Maybe<Array<Maybe<Workflow>>>;
  /** Disables an alert. */
  disableAlert?: Maybe<Alert>;
  /** Disables a feed. */
  disableFeed?: Maybe<Feed>;
  /** Enables an alert. */
  enableAlert?: Maybe<Alert>;
  /** Enables a feed. */
  enableFeed?: Maybe<Feed>;
  /** Extracts data from contents based on the provided filter criteria. */
  extractContents?: Maybe<Array<Maybe<ExtractCompletion>>>;
  /** Ingests a file from Base64-encoded data. */
  ingestEncodedFile?: Maybe<Content>;
  /**
   * Ingests a file by URI.
   * @deprecated Use ingestUri instead.
   */
  ingestFile?: Maybe<Content>;
  /**
   * Ingests a webpage by URI.
   * @deprecated Use ingestUri instead.
   */
  ingestPage?: Maybe<Content>;
  /** Ingests text. */
  ingestText?: Maybe<Content>;
  /** Ingests content by URI. Supports files and webpages. */
  ingestUri?: Maybe<Content>;
  /** Opens an existing collection. */
  openCollection?: Maybe<Collection>;
  /** Opens an existing conversation. */
  openConversation?: Maybe<Conversation>;
  /** Prompts a conversation. */
  promptConversation?: Maybe<PromptConversation>;
  /** Prompts one or more LLM specifications, 10 maximum. */
  promptSpecifications?: Maybe<Array<Maybe<PromptCompletion>>>;
  /** Publish contents based on the provided filter criteria into different content format. */
  publishContents?: Maybe<Content>;
  /** Publish conversation. */
  publishConversation?: Maybe<Content>;
  /** Publish text into different content format. */
  publishText?: Maybe<Content>;
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
  /** Suggest prompts for a conversation. */
  suggestConversation?: Maybe<PromptSuggestion>;
  /** Summarizes contents based on the provided filter criteria. */
  summarizeContents?: Maybe<Array<Maybe<PromptSummarization>>>;
  /** Undo an existing conversation. */
  undoConversation?: Maybe<Conversation>;
  /** Updates an existing alert. */
  updateAlert?: Maybe<Alert>;
  /** Updates a category. */
  updateCategory?: Maybe<Category>;
  /** Updates an existing collection. */
  updateCollection?: Maybe<Collection>;
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
  /** Updates an existing content workflow. */
  updateWorkflow?: Maybe<Workflow>;
};


export type MutationAddCollectionContentsArgs = {
  contents: Array<EntityReferenceInput>;
  id: Scalars['ID']['input'];
};


export type MutationAddContentsToCollectionsArgs = {
  collections: Array<EntityReferenceInput>;
  contents: Array<EntityReferenceInput>;
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


export type MutationDeleteWorkflowArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteWorkflowsArgs = {
  ids: Array<Scalars['ID']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDisableAlertArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDisableFeedArgs = {
  id: Scalars['ID']['input'];
};


export type MutationEnableAlertArgs = {
  id: Scalars['ID']['input'];
};


export type MutationEnableFeedArgs = {
  id: Scalars['ID']['input'];
};


export type MutationExtractContentsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<ContentFilter>;
  prompt: Scalars['String']['input'];
  specification: EntityReferenceInput;
};


export type MutationIngestEncodedFileArgs = {
  collections?: InputMaybe<Array<EntityReferenceInput>>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
  data: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  mimeType: Scalars['String']['input'];
  name: Scalars['String']['input'];
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
  name: Scalars['String']['input'];
  text: Scalars['String']['input'];
  textType?: InputMaybe<TextTypes>;
  uri?: InputMaybe<Scalars['URL']['input']>;
  workflow?: InputMaybe<EntityReferenceInput>;
};


export type MutationIngestUriArgs = {
  collections?: InputMaybe<Array<EntityReferenceInput>>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  uri: Scalars['URL']['input'];
  workflow?: InputMaybe<EntityReferenceInput>;
};


export type MutationOpenCollectionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationOpenConversationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationPromptConversationArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  prompt: Scalars['String']['input'];
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
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  workflow?: InputMaybe<EntityReferenceInput>;
};


export type MutationPublishTextArgs = {
  connector: ContentPublishingConnectorInput;
  correlationId?: InputMaybe<Scalars['String']['input']>;
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


export type MutationSuggestConversationArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  count?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['ID']['input'];
};


export type MutationSummarizeContentsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<ContentFilter>;
  summarizations: Array<InputMaybe<SummarizationStrategyInput>>;
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


export type MutationUpdateWorkflowArgs = {
  workflow: WorkflowUpdateInput;
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
  /** The Notion identifiers. */
  identifiers: Array<Scalars['String']['input']>;
  /** Should the feed enumerate Notion pages and databases recursively. */
  isRecursive?: InputMaybe<Scalars['Boolean']['input']>;
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The Notion integration token. */
  token: Scalars['String']['input'];
  /** The Notion object type, i.e. page or database. */
  type: NotionTypes;
};

/** Represents Notion feed properties. */
export type NotionFeedPropertiesUpdateInput = {
  /** The Notion identifiers. */
  identifiers?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Should the feed enumerate Notion pages and databases recursively. */
  isRecursive?: InputMaybe<Scalars['Boolean']['input']>;
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The Notion integration token. */
  token: Scalars['String']['input'];
  /** The Notion object type, i.e. page or database. */
  type?: InputMaybe<NotionTypes>;
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

/** Represents a filter for observations. */
export type ObservationReferenceFilter = {
  /** Filter by observed entity. */
  observable: EntityReferenceFilter;
  /** Filter observation(s) by their states. */
  states?: InputMaybe<Array<InputMaybe<EntityState>>>;
  /** Filter by observed entity type. */
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
  /** OneDrive folder identifier. */
  folderId?: Maybe<Scalars['String']['output']>;
  /** OneDrive refresh token. */
  refreshToken: Scalars['String']['output'];
};

/** Represents OneDrive properties. */
export type OneDriveFeedPropertiesInput = {
  /** OneDrive folder identifier. */
  folderId?: InputMaybe<Scalars['String']['input']>;
  /** OneDrive refresh token. */
  refreshToken: Scalars['String']['input'];
};

/** Represents OneDrive properties. */
export type OneDriveFeedPropertiesUpdateInput = {
  /** OneDrive folder identifier. */
  folderId?: InputMaybe<Scalars['String']['input']>;
  /** OneDrive refresh token. */
  refreshToken?: InputMaybe<Scalars['String']['input']>;
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

/** Represents an OpenAI image entity extraction connector. */
export type OpenAiImageExtractionPropertiesInput = {
  /** The confidence threshold for entity extraction. */
  confidenceThreshold?: InputMaybe<Scalars['Float']['input']>;
  /** Custom instructions which are injected into the LLM prompt. */
  customInstructions?: InputMaybe<Scalars['String']['input']>;
  /** The OpenAI vision detail mode. */
  detailLevel?: InputMaybe<OpenAiVisionDetailLevels>;
};

/** Represents OpenAI model properties. */
export type OpenAiModelProperties = {
  __typename?: 'OpenAIModelProperties';
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: Maybe<Scalars['Int']['output']>;
  /** The OpenAI API key, if using developer's own account. */
  key?: Maybe<Scalars['String']['output']>;
  /** The OpenAI model, or custom, when using developer's own account. */
  model: OpenAiModels;
  /** The OpenAI model name, if using developer's own account. */
  modelName?: Maybe<Scalars['String']['output']>;
  /** The model token probability. */
  probability?: Maybe<Scalars['Float']['output']>;
  /** The model temperature. */
  temperature?: Maybe<Scalars['Float']['output']>;
  /** The number of tokens which can provided to the OpenAI model, if using developer's own account. */
  tokenLimit?: Maybe<Scalars['Int']['output']>;
};

/** Represents OpenAI model properties. */
export type OpenAiModelPropertiesInput = {
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The OpenAI API key, if using developer's own account. */
  key?: InputMaybe<Scalars['String']['input']>;
  /** The OpenAI model, or custom, when using developer's own account. */
  model: OpenAiModels;
  /** The OpenAI model name, if using developer's own account. */
  modelName?: InputMaybe<Scalars['String']['input']>;
  /** The model token probability. */
  probability?: InputMaybe<Scalars['Float']['input']>;
  /** The model temperature. */
  temperature?: InputMaybe<Scalars['Float']['input']>;
  /** The number of tokens which can provided to the OpenAI model, if using developer's own account. */
  tokenLimit?: InputMaybe<Scalars['Int']['input']>;
};

/** Represents OpenAI model properties. */
export type OpenAiModelPropertiesUpdateInput = {
  /** The limit of tokens generated by prompt completion. */
  completionTokenLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The OpenAI API key, if using developer's own account. */
  key?: InputMaybe<Scalars['String']['input']>;
  /** The Azure OpenAI model, or custom, when using developer's own account. */
  model: OpenAiModels;
  /** The OpenAI model name, if using developer's own account. */
  modelName?: InputMaybe<Scalars['String']['input']>;
  /** The model token probability. */
  probability?: InputMaybe<Scalars['Float']['input']>;
  /** The model temperature. */
  temperature?: InputMaybe<Scalars['Float']['input']>;
  /** The number of tokens which can provided to the OpenAI model, if using developer's own account. */
  tokenLimit?: InputMaybe<Scalars['Int']['input']>;
};

/** OpenAI model type */
export enum OpenAiModels {
  /** Developer-specified model */
  Custom = 'CUSTOM',
  /** GPT-4 (Latest version) */
  Gpt4 = 'GPT4',
  /** GPT-4 (0613 version) */
  Gpt4_0613 = 'GPT4_0613',
  /** GPT-4 32k (Latest version) */
  Gpt4_32K = 'GPT4_32K',
  /** GPT-4 32k (0613 version) */
  Gpt4_32K_0613 = 'GPT4_32K_0613',
  /** GPT-4 Turbo 128k (Latest version) */
  Gpt4Turbo_128K = 'GPT4_TURBO_128K',
  /** GPT-4 Turbo 128k (0125 version) */
  Gpt4Turbo_128K_0125 = 'GPT4_TURBO_128K_0125',
  /** GPT-4 Turbo 128k (1106 version) */
  Gpt4Turbo_128K_1106 = 'GPT4_TURBO_128K_1106',
  /** GPT-4 Turbo 128k (2024-04-09 version) */
  Gpt4Turbo_128K_20240409 = 'GPT4_TURBO_128K_20240409',
  /** @deprecated Use GPT4_Turbo_128k instead. */
  Gpt4TurboVision_128K = 'GPT4_TURBO_VISION_128K',
  /** GPT-4 Turbo Vision 128k (1106 version) */
  Gpt4TurboVision_128K_1106 = 'GPT4_TURBO_VISION_128K_1106',
  /**
   * GPT-3.5 Turbo (Latest version)
   * @deprecated OpenAI is deprecating this model. Use the GPT-3.5 Turbo 16k model instead.
   */
  Gpt35Turbo = 'GPT35_TURBO',
  /**
   * GPT-3.5 Turbo (0613 version)
   * @deprecated OpenAI is deprecating this model. Use the GPT-3.5 Turbo 16k model instead.
   */
  Gpt35Turbo_0613 = 'GPT35_TURBO_0613',
  /** GPT-3.5 Turbo 16k (Latest version) */
  Gpt35Turbo_16K = 'GPT35_TURBO_16K',
  /** GPT-3.5 Turbo 16k (0125 version) */
  Gpt35Turbo_16K_0125 = 'GPT35_TURBO_16K_0125',
  /** GPT-3.5 Turbo 16k (0613 version) */
  Gpt35Turbo_16K_0613 = 'GPT35_TURBO_16K_0613',
  /** GPT-3.5 Turbo 16k (1106 version) */
  Gpt35Turbo_16K_1106 = 'GPT35_TURBO_16K_1106'
}

/** OpenAI vision model detail levels */
export enum OpenAiVisionDetailLevels {
  /** High */
  High = 'HIGH',
  /** Low */
  Low = 'LOW'
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
  boundary?: Maybe<Scalars['JSON']['output']>;
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
  links?: Maybe<Array<Maybe<LinkReferenceType>>>;
  /** The geo-location of the organization. */
  location?: Maybe<Point>;
  /** The modified date of the organization. */
  modifiedDate?: Maybe<Scalars['DateTime']['output']>;
  /** The name of the organization. */
  name: Scalars['String']['output'];
  /** The revenue of the organization. */
  revenue?: Maybe<Scalars['Decimal']['output']>;
  /** The currency of the revenue of the organization. */
  revenueCurrency?: Maybe<Scalars['String']['output']>;
  /** The state of the organization (i.e. created, enabled). */
  state: EntityState;
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
  boundaries?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
  /** Filter organization(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter by observable H3 index. */
  h3?: InputMaybe<H3Filter>;
  /** Filter organization(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of organization(s) to be returned. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter by observable geo-location. */
  location?: InputMaybe<PointFilter>;
  /** Filter organization(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Skip the specified number of organization(s) from the beginning of the result set. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** Filter organization(s) by searching for specific text. */
  search?: InputMaybe<Scalars['String']['input']>;
  /** Filter organization(s) by their states. */
  states?: InputMaybe<Array<EntityState>>;
};

/** Represents an organization. */
export type OrganizationInput = {
  /** The physical address of the organization. */
  address?: InputMaybe<AddressInput>;
  /** The organization geo-boundary, as GeoJSON Feature with Polygon geometry. */
  boundary?: InputMaybe<Scalars['JSON']['input']>;
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
  boundary?: InputMaybe<Scalars['JSON']['input']>;
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
  boundary?: Maybe<Scalars['JSON']['output']>;
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
  links?: Maybe<Array<Maybe<LinkReferenceType>>>;
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
  /** The state of the person (i.e. created, enabled). */
  state: EntityState;
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
  boundaries?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
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
  /** Limit the number of person(s) to be returned. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter by observable geo-location. */
  location?: InputMaybe<PointFilter>;
  /** Filter person(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Skip the specified number of person(s) from the beginning of the result set. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** Filter by the phone number of the person. */
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  /** Filter person(s) by searching for specific text. */
  search?: InputMaybe<Scalars['String']['input']>;
  /** Filter person(s) by their states. */
  states?: InputMaybe<Array<EntityState>>;
};

/** Represents a person. */
export type PersonInput = {
  /** The physical address of the person. */
  address?: InputMaybe<AddressInput>;
  /** The birth date of the person. */
  birthDate?: InputMaybe<Scalars['Date']['input']>;
  /** The person geo-boundary, as GeoJSON Feature with Polygon geometry. */
  boundary?: InputMaybe<Scalars['JSON']['input']>;
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
  boundary?: InputMaybe<Scalars['JSON']['input']>;
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
  boundary?: Maybe<Scalars['JSON']['output']>;
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
  links?: Maybe<Array<Maybe<LinkReferenceType>>>;
  /** The geo-location of the place. */
  location?: Maybe<Point>;
  /** The modified date of the place. */
  modifiedDate?: Maybe<Scalars['DateTime']['output']>;
  /** The name of the place. */
  name: Scalars['String']['output'];
  /** The state of the place (i.e. created, enabled). */
  state: EntityState;
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
  boundaries?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
  /** Filter place(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter by observable H3 index. */
  h3?: InputMaybe<H3Filter>;
  /** Filter place(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of place(s) to be returned. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter by observable geo-location. */
  location?: InputMaybe<PointFilter>;
  /** Filter place(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Skip the specified number of place(s) from the beginning of the result set. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** Filter place(s) by searching for specific text. */
  search?: InputMaybe<Scalars['String']['input']>;
  /** Filter place(s) by their states. */
  states?: InputMaybe<Array<EntityState>>;
};

/** Represents a place. */
export type PlaceInput = {
  /** The physical address of the place. */
  address?: InputMaybe<AddressInput>;
  /** The place geo-boundary, as GeoJSON Feature with Polygon geometry. */
  boundary?: InputMaybe<Scalars['JSON']['input']>;
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
  boundary?: InputMaybe<Scalars['JSON']['input']>;
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
  /** Whether to disable smart HTML capture of web pages.  Enabled by default for better support of dynamic HTML pages, but can be disabled for better performance. */
  disableSmartCapture?: Maybe<Scalars['Boolean']['output']>;
  /** The jobs for the preparation workflow stage. */
  jobs?: Maybe<Array<Maybe<PreparationWorkflowJob>>>;
  /** The list of prepared content summaries. */
  summarizations?: Maybe<Array<Maybe<SummarizationStrategy>>>;
};

/** Represents the preparation workflow stage. */
export type PreparationWorkflowStageInput = {
  /** Whether to disable smart HTML capture of web pages.  Enabled by default for better support of dynamic HTML pages, but can be disabled for better performance. */
  disableSmartCapture?: InputMaybe<Scalars['Boolean']['input']>;
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
  boundary?: Maybe<Scalars['JSON']['output']>;
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
  links?: Maybe<Array<Maybe<LinkReferenceType>>>;
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
  /** The product SKU. */
  sku?: Maybe<Scalars['String']['output']>;
  /** The state of the product (i.e. created, enabled). */
  state: EntityState;
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
  boundaries?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
  /** Filter by product brand. */
  brand?: InputMaybe<Scalars['String']['input']>;
  /** Filter product(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter by observable H3 index. */
  h3?: InputMaybe<H3Filter>;
  /** Filter product(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of product(s) to be returned. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter by observable geo-location. */
  location?: InputMaybe<PointFilter>;
  /** Filter by product manufacturer. */
  manufacturer?: InputMaybe<Scalars['String']['input']>;
  /** Filter by product model. */
  model?: InputMaybe<Scalars['String']['input']>;
  /** Filter product(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Skip the specified number of product(s) from the beginning of the result set. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** Filter by production date range. */
  productionDateRange?: InputMaybe<DateRangeFilter>;
  /** Filter by release date range. */
  releaseDateRange?: InputMaybe<DateRangeFilter>;
  /** Filter product(s) by searching for specific text. */
  search?: InputMaybe<Scalars['String']['input']>;
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
  boundary?: InputMaybe<Scalars['JSON']['input']>;
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
  boundary?: InputMaybe<Scalars['JSON']['input']>;
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
  /** The project environment type. */
  environmentType?: Maybe<EnvironmentTypes>;
  /** The ID of the project. */
  id: Scalars['ID']['output'];
  /** The project JWT signing secret. */
  jwtSecret?: Maybe<Scalars['String']['output']>;
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
  /** The compute ratio of credits. */
  computeRatio?: Maybe<Scalars['Decimal']['output']>;
  /** The conversations ratio of credits. */
  conversationRatio?: Maybe<Scalars['Decimal']['output']>;
  /** The tenant correlation identifier. */
  correlationId?: Maybe<Scalars['String']['output']>;
  /** The credits used. */
  credits?: Maybe<Scalars['Long']['output']>;
  /** The content enrichment ratio of credits. */
  enrichmentRatio?: Maybe<Scalars['Decimal']['output']>;
  /** The content extraction ratio of credits. */
  extractionRatio?: Maybe<Scalars['Decimal']['output']>;
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
  /** Filter project(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter project(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of project(s) to be returned. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter project(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Skip the specified number of project(s) from the beginning of the result set. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** Filter project(s) by searching for specific text. */
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
  /** The maximum number of feeds which can be created. */
  feeds?: Maybe<Scalars['Int']['output']>;
  /** The maximum number of posts which can be read by feeds. */
  posts?: Maybe<Scalars['Int']['output']>;
  /** The storage quota, in megabytes. */
  storage?: Maybe<Scalars['Int']['output']>;
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
  /** The storage quota, in megabytes. */
  storage?: InputMaybe<Scalars['Int']['input']>;
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

/** Represents a project. */
export type ProjectUpdateInput = {
  /** The project callback URI, optional. The platform will callback to this webhook upon credit charges. */
  callbackUri?: InputMaybe<Scalars['URL']['input']>;
  /** The default LLM specification for conversations. */
  specification?: InputMaybe<EntityReferenceInput>;
  /** The default content workflow. */
  workflow?: InputMaybe<EntityReferenceInput>;
};

/** Represents a correlated usage record. */
export type ProjectUsageRecord = {
  __typename?: 'ProjectUsageRecord';
  /** The LLM completion, if billable metric is 'Tokens'. */
  completion?: Maybe<Scalars['String']['output']>;
  /** The token count of the LLM completion, if billable metric is 'Tokens'. */
  completionTokens?: Maybe<Scalars['Int']['output']>;
  /** The content type, if content usage record. */
  contentType?: Maybe<ContentTypes>;
  /** The tenant correlation identifier. */
  correlationId?: Maybe<Scalars['String']['output']>;
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
  /** The billable metric type of the usage record, i.e. 'Tokens' or 'Units'. */
  metric?: Maybe<BillableMetrics>;
  /** For LLM operations, the LLM model name. Or, for transcription operations, the transcription model name. */
  modelName?: Maybe<Scalars['String']['output']>;
  /** For LLM operations, the LLM model service. Or, for transcription operations, the transcription service. */
  modelService?: Maybe<Scalars['String']['output']>;
  /** Descriptive name associated with the usage record, i.e. 'Prompt completion' or 'Search entities'. */
  name: Scalars['String']['output'];
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

/** Represents a prompted LLM completion. */
export type PromptCompletion = {
  __typename?: 'PromptCompletion';
  /** If prompt completion failed, the error message. */
  error?: Maybe<Scalars['String']['output']>;
  /** The completed messages. */
  messages?: Maybe<Array<Maybe<ConversationMessage>>>;
  /** The LLM specification. */
  specification?: Maybe<EntityReference>;
};

/** Represents a prompted conversation. */
export type PromptConversation = {
  __typename?: 'PromptConversation';
  /** The completed conversation. */
  conversation?: Maybe<EntityReference>;
  /** The content facets referenced by the completed conversation message. */
  facets?: Maybe<Array<Maybe<ContentFacet>>>;
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
  Rewrite = 'REWRITE',
  /** Rewrite prompt as multiple sub-prompts */
  RewriteMultiple = 'REWRITE_MULTIPLE',
  /** Rewrite prompt as question requiring detailed response with example */
  RewriteQuestion = 'REWRITE_QUESTION'
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
  /** The summarized content. */
  content: EntityReference;
  /** If summarization failed, the error message. */
  error?: Maybe<Scalars['String']['output']>;
  /** The summarized items. */
  items?: Maybe<Array<Summarized>>;
  /** The LLM specification. */
  specification?: Maybe<EntityReference>;
  /** The summarization type. */
  type: SummarizationTypes;
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
  /** Counts workflows based on the provided filter criteria. */
  countWorkflows?: Maybe<CountResult>;
  /** Retrieves correlated project credits. */
  credits?: Maybe<Array<Maybe<ProjectCredits>>>;
  /** Lookup an event given its ID. */
  event?: Maybe<Event>;
  /** Retrieves events based on the provided filter criteria. */
  events?: Maybe<EventResults>;
  /** Lookup a feed given its ID. */
  feed?: Maybe<Feed>;
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
  /** Lookup multiple contents given their IDs. */
  lookupContents?: Maybe<LookupContentsResults>;
  /** Lookup credit usage given tenant correlation identifier. */
  lookupCredits?: Maybe<ProjectCredits>;
  /** Lookup usage records given tenant correlation identifier. */
  lookupUsage?: Maybe<Array<Maybe<ProjectUsageRecord>>>;
  /** Retrieves Microsoft Graph consent URI. Visit URI to provide administrator consent for feeds which use the Microsoft Graph API, such as SharePoint and Microsoft Teams. */
  microsoftGraphConsentUri?: Maybe<UriResult>;
  /** Lookup a observation given its ID. */
  observation?: Maybe<Observation>;
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
  /** Retrieves available SharePoint document libraries. */
  sharePointLibraries?: Maybe<SharePointLibraryResults>;
  /** Lookup software given its ID. */
  software?: Maybe<Software>;
  /** Retrieves software based on the provided filter criteria. */
  softwares?: Maybe<SoftwareResults>;
  /** Lookup a specification given its ID. */
  specification?: Maybe<Specification>;
  /** Retrieves specifications based on the provided filter criteria. */
  specifications?: Maybe<SpecificationResults>;
  /** Retrieves project usage. */
  usage?: Maybe<Array<Maybe<ProjectUsageRecord>>>;
  /** Lookup a workflow given its ID. */
  workflow?: Maybe<Workflow>;
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


export type QueryMicrosoftGraphConsentUriArgs = {
  tenantId: Scalars['ID']['input'];
};


export type QueryObservationArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
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


export type QuerySharePointLibrariesArgs = {
  properties: SharePointLibrariesInput;
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


export type QuerySpecificationsArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<SpecificationFilter>;
};


export type QueryUsageArgs = {
  duration: Scalars['TimeSpan']['input'];
  startDate: Scalars['DateTime']['input'];
};


export type QueryWorkflowArgs = {
  correlationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
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
  /** The state of the repo (i.e. created, enabled). */
  state: EntityState;
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
  boundaries?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
  /** Filter repo(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter by observable H3 index. */
  h3?: InputMaybe<H3Filter>;
  /** Filter repo(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of repo(s) to be returned. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter by observable geo-location. */
  location?: InputMaybe<PointFilter>;
  /** Filter repo(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Skip the specified number of repo(s) from the beginning of the result set. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** Filter repo(s) by searching for specific text. */
  search?: InputMaybe<Scalars['String']['input']>;
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
  /** Pongo */
  Pongo = 'PONGO'
}

/** Represents a reranking strategy. */
export type RerankingStrategy = {
  __typename?: 'RerankingStrategy';
  /** The content reranking service type. */
  serviceType: RerankingModelServiceTypes;
};

/** Represents a reranking strategy. */
export type RerankingStrategyInput = {
  /** The content reranking service type, optional. */
  serviceType: RerankingModelServiceTypes;
};

/** Represents a reranking strategy. */
export type RerankingStrategyUpdateInput = {
  /** The content reranking service type, optional. */
  serviceType?: InputMaybe<RerankingModelServiceTypes>;
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
  /** The retrieval strategy type. */
  type: RetrievalStrategyTypes;
};

/** Represents a retrieval strategy. */
export type RetrievalStrategyInput = {
  /** The maximum number of content sources to provide with prompt context. Defaults to 25. */
  contentLimit?: InputMaybe<Scalars['Int']['input']>;
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

/** Search query type */
export enum SearchQueryTypes {
  /** Full (Lucene syntax) */
  Full = 'FULL',
  /** Simple */
  Simple = 'SIMPLE'
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
  accountName?: Maybe<Scalars['String']['output']>;
  /** SharePoint authentication type. */
  authenticationType?: Maybe<SharePointAuthenticationTypes>;
  /** SharePoint library identifier. */
  libraryId?: Maybe<Scalars['ID']['output']>;
  /** Azure Active Directory refresh token, when using user authentication type. */
  refreshToken?: Maybe<Scalars['String']['output']>;
  /** Azure Active Directory tenant identifier, when using application authentication type. */
  tenantId?: Maybe<Scalars['ID']['output']>;
};

/** Represents SharePoint properties. */
export type SharePointFeedPropertiesInput = {
  /** SharePoint account name. */
  accountName: Scalars['String']['input'];
  /** SharePoint authentication type. */
  authenticationType: SharePointAuthenticationTypes;
  /** SharePoint library identifier. */
  libraryId: Scalars['ID']['input'];
  /** Azure Active Directory refresh token, when using user authentication type. */
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  /** Azure Active Directory tenant identifier, when using application authentication type. */
  tenantId?: InputMaybe<Scalars['ID']['input']>;
};

/** Represents SharePoint properties. */
export type SharePointFeedPropertiesUpdateInput = {
  /** SharePoint account name. */
  accountName?: InputMaybe<Scalars['String']['input']>;
  /** SharePoint authentication type. */
  authenticationType?: InputMaybe<SharePointAuthenticationTypes>;
  /** SharePoint library identifier. */
  libraryId?: InputMaybe<Scalars['ID']['input']>;
  /** Azure Active Directory refresh token, when using user authentication type. */
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  /** Azure Active Directory tenant identifier, when using application authentication type. */
  tenantId?: InputMaybe<Scalars['ID']['input']>;
};

/** Represents SharePoint libraries properties. */
export type SharePointLibrariesInput = {
  /** SharePoint authentication type. */
  authenticationType: SharePointAuthenticationTypes;
  /** Azure Active Directory refresh token, when using user authentication type. */
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  /** Azure Active Directory tenant identifier, when using application authentication type. */
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
  /** Feed connector type. */
  connectorType: FeedConnectorTypes;
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
  /** The site type. */
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
  /** The state of the software (i.e. created, enabled). */
  state: EntityState;
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
  boundaries?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
  /** Filter software(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter by observable H3 index. */
  h3?: InputMaybe<H3Filter>;
  /** Filter software(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of software(s) to be returned. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter by observable geo-location. */
  location?: InputMaybe<PointFilter>;
  /** Filter software(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Skip the specified number of software(s) from the beginning of the result set. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** Filter software(s) by searching for specific text. */
  search?: InputMaybe<Scalars['String']['input']>;
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
  /** The Azure OpenAI model properties. */
  azureOpenAI?: Maybe<AzureOpenAiModelProperties>;
  /** The Cohere model properties. */
  cohere?: Maybe<CohereModelProperties>;
  /** The creation date of the specification. */
  creationDate: Scalars['DateTime']['output'];
  /** Custom guidance which is injected into the LLM conversation prompt. */
  customGuidance?: Maybe<Scalars['String']['output']>;
  /** Custom instructions which are injected into the LLM conversation prompt. */
  customInstructions?: Maybe<Scalars['String']['output']>;
  /** The Groq model properties. */
  groq?: Maybe<GroqModelProperties>;
  /** The ID of the specification. */
  id: Scalars['ID']['output'];
  /** The Mistral model properties. */
  mistral?: Maybe<MistralModelProperties>;
  /** The modified date of the specification. */
  modifiedDate?: Maybe<Scalars['DateTime']['output']>;
  /** The name of the specification. */
  name: Scalars['String']['output'];
  /** The number of similar items to be returned from content search. Defaults to 1000. */
  numberSimilar?: Maybe<Scalars['Int']['output']>;
  /** The OpenAI model properties. */
  openAI?: Maybe<OpenAiModelProperties>;
  /** The owner of the specification. */
  owner: Owner;
  /** The strategy for formatting the LLM user prompt. */
  promptStrategy?: Maybe<PromptStrategy>;
  /** The Replicate model properties. */
  replicate?: Maybe<ReplicateModelProperties>;
  /** The strategy for reranking the relevant content for the RAG conversation. */
  rerankingStrategy?: Maybe<RerankingStrategy>;
  /** The strategy for retrieving the relevant content for the RAG conversation. */
  retrievalStrategy?: Maybe<RetrievalStrategy>;
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
  /** The tool definitions. */
  tools?: Maybe<Array<ToolDefinition>>;
  /** The specification type. */
  type?: Maybe<SpecificationTypes>;
};

/** Represents a filter for LLM specifications. */
export type SpecificationFilter = {
  /** Filter specification(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter specification(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of specification(s) to be returned. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter specification(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Skip the specified number of specification(s) from the beginning of the result set. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** Filter specification(s) by searching for specific text. */
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
  /** The Azure OpenAI model properties. */
  azureOpenAI?: InputMaybe<AzureOpenAiModelPropertiesInput>;
  /** The Cohere model properties. */
  cohere?: InputMaybe<CohereModelPropertiesInput>;
  /** Custom guidance which is injected into the LLM conversation prompt. */
  customGuidance?: InputMaybe<Scalars['String']['input']>;
  /** Custom instructions which are injected into the LLM conversation prompt. */
  customInstructions?: InputMaybe<Scalars['String']['input']>;
  /** The Groq model properties. */
  groq?: InputMaybe<GroqModelPropertiesInput>;
  /** The Mistral model properties. */
  mistral?: InputMaybe<MistralModelPropertiesInput>;
  /** The name of the specification. */
  name: Scalars['String']['input'];
  /** The number of similar items to be returned from content search. Defaults to 1000. */
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
  /** The content search type. */
  searchType?: InputMaybe<ConversationSearchTypes>;
  /** The LLM service type. */
  serviceType: ModelServiceTypes;
  /** The strategy for providing the conversation message history to the LLM prompt. */
  strategy?: InputMaybe<ConversationStrategyInput>;
  /** The LLM system prompt. */
  systemPrompt?: InputMaybe<Scalars['String']['input']>;
  /** The tool definitions. */
  tools?: InputMaybe<Array<ToolDefinitionInput>>;
  /** The specification type. */
  type?: InputMaybe<SpecificationTypes>;
};

/** Represents LLM specification query results. */
export type SpecificationResults = {
  __typename?: 'SpecificationResults';
  /** The list of specification query results. */
  results?: Maybe<Array<Maybe<Specification>>>;
};

/** Specification type */
export enum SpecificationTypes {
  /** Prompt completion */
  Completion = 'COMPLETION',
  /** Data extraction */
  Extraction = 'EXTRACTION'
}

/** Represents an LLM specification. */
export type SpecificationUpdateInput = {
  /** The Anthropic model properties. */
  anthropic?: InputMaybe<AnthropicModelPropertiesUpdateInput>;
  /** The Azure OpenAI model properties. */
  azureOpenAI?: InputMaybe<AzureOpenAiModelPropertiesUpdateInput>;
  /** The Cohere model properties. */
  cohere?: InputMaybe<CohereModelPropertiesUpdateInput>;
  /** Custom guidance which is injected into the LLM conversation prompt. */
  customGuidance?: InputMaybe<Scalars['String']['input']>;
  /** Custom instructions which are injected into the LLM conversation prompt. */
  customInstructions?: InputMaybe<Scalars['String']['input']>;
  /** The Groq model properties. */
  groq?: InputMaybe<GroqModelPropertiesUpdateInput>;
  /** The ID of the specification to update. */
  id: Scalars['ID']['input'];
  /** The Mistral model properties. */
  mistral?: InputMaybe<MistralModelPropertiesUpdateInput>;
  /** The name of the specification. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The number of similar items to be returned from content search. Defaults to 1000. */
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
  /** The content search type. */
  searchType?: InputMaybe<ConversationSearchTypes>;
  /** The LLM service type. */
  serviceType: ModelServiceTypes;
  /** The strategy for providing the conversation message history to the LLM prompt. */
  strategy?: InputMaybe<ConversationStrategyUpdateInput>;
  /** The LLM system prompt. */
  systemPrompt?: InputMaybe<Scalars['String']['input']>;
  /** The tool definitions. */
  tools?: InputMaybe<Array<ToolDefinitionUpdateInput>>;
  /** The specification type. */
  type?: InputMaybe<SpecificationTypes>;
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
  /** The text page index. */
  index?: Maybe<Scalars['Int']['output']>;
  /** The relevance score of the text page. */
  relevance?: Maybe<Scalars['Float']['output']>;
  /** The text page. */
  text?: Maybe<Scalars['String']['output']>;
};

/** Text Roles */
export enum TextRoles {
  /** Code Block */
  Code = 'CODE',
  /** @deprecated Use 'TableColumnHeader' instead. */
  ColumnHeader = 'COLUMN_HEADER',
  /** @deprecated Use 'TableCornerHeader' instead. */
  CornerHeader = 'CORNER_HEADER',
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
  /** List Item */
  ListItem = 'LIST_ITEM',
  /** Page Footer */
  PageFooter = 'PAGE_FOOTER',
  /** Page Header */
  PageHeader = 'PAGE_HEADER',
  /** Page Number */
  PageNumber = 'PAGE_NUMBER',
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
  /** Table Row Header */
  TableRowHeader = 'TABLE_ROW_HEADER',
  /** Title */
  Title = 'TITLE'
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
  /** The tool callback URI. */
  uri?: Maybe<Scalars['URL']['output']>;
};

/** Represents a tool definition. */
export type ToolDefinitionInput = {
  /** The tool description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The tool name. */
  name: Scalars['String']['input'];
  /** The tool schema. */
  schema: Scalars['String']['input'];
  /** The tool callback URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents a tool definition. */
export type ToolDefinitionUpdateInput = {
  /** The tool description. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The tool name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The tool schema. */
  schema?: InputMaybe<Scalars['String']['input']>;
  /** The tool callback URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

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

/** Represents video metadata. */
export type VideoMetadata = {
  __typename?: 'VideoMetadata';
  /** The episode author, if podcast episode. */
  author?: Maybe<Scalars['String']['output']>;
  /** The audio description. */
  description?: Maybe<Scalars['String']['output']>;
  /** The video duration. */
  duration?: Maybe<Scalars['String']['output']>;
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

/** Represents web feed properties. */
export type WebFeedProperties = {
  __typename?: 'WebFeedProperties';
  /** Whether to include files referenced by the web sitemap, defaults to false. */
  includeFiles?: Maybe<Scalars['Boolean']['output']>;
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: Maybe<Scalars['Int']['output']>;
  /** The web URI. */
  uri: Scalars['URL']['output'];
};

/** Represents web feed properties. */
export type WebFeedPropertiesInput = {
  /** Whether to include files referenced by the web sitemap, defaults to false. */
  includeFiles?: InputMaybe<Scalars['Boolean']['input']>;
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The web URI. */
  uri: Scalars['URL']['input'];
};

/** Represents web feed properties. */
export type WebFeedPropertiesUpdateInput = {
  /** Whether to include files referenced by the web sitemap, defaults to false. */
  includeFiles?: InputMaybe<Scalars['Boolean']['input']>;
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The web URI. */
  uri?: InputMaybe<Scalars['URL']['input']>;
};

/** Represents a workflow. */
export type Workflow = {
  __typename?: 'Workflow';
  /** The workflow actions. */
  actions?: Maybe<Array<Maybe<WorkflowAction>>>;
  /** The creation date of the workflow. */
  creationDate: Scalars['DateTime']['output'];
  /** The enrichment stage of the content workflow. */
  enrichment?: Maybe<EnrichmentWorkflowStage>;
  /** The extraction stage of the content workflow. */
  extraction?: Maybe<ExtractionWorkflowStage>;
  /** The ID of the workflow. */
  id: Scalars['ID']['output'];
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
  /** The state of the workflow (i.e. created, finished). */
  state: EntityState;
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
  /** Filter workflow(s) by their creation date range. */
  creationDateRange?: InputMaybe<DateRangeFilter>;
  /** The sort direction for query results. */
  direction?: InputMaybe<OrderDirectionTypes>;
  /** Filter workflow(s) by their unique ID. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** Limit the number of workflow(s) to be returned. */
  limit?: InputMaybe<Scalars['Int']['input']>;
  /** Filter workflow(s) by their name. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Skip the specified number of workflow(s) from the beginning of the result set. */
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** The sort order for query results. */
  orderBy?: InputMaybe<OrderByTypes>;
  /** Filter workflow(s) by searching for specific text. */
  search?: InputMaybe<Scalars['String']['input']>;
  /** Filter workflow(s) by their states. */
  states?: InputMaybe<Array<EntityState>>;
};

/** Represents a workflow. */
export type WorkflowInput = {
  /** The workflow actions. */
  actions?: InputMaybe<Array<InputMaybe<WorkflowActionInput>>>;
  /** The enrichment stage of the content workflow. */
  enrichment?: InputMaybe<EnrichmentWorkflowStageInput>;
  /** The extraction stage of the content workflow. */
  extraction?: InputMaybe<ExtractionWorkflowStageInput>;
  /** The ingestion stage of the content workflow. */
  ingestion?: InputMaybe<IngestionWorkflowStageInput>;
  /** The name of the workflow. */
  name: Scalars['String']['input'];
  /** The preparation stage of the content workflow. */
  preparation?: InputMaybe<PreparationWorkflowStageInput>;
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
  /** The enrichment stage of the content workflow. */
  enrichment?: InputMaybe<EnrichmentWorkflowStageInput>;
  /** The extraction stage of the content workflow. */
  extraction?: InputMaybe<ExtractionWorkflowStageInput>;
  /** The ID of the workflow to update. */
  id: Scalars['ID']['input'];
  /** The ingestion stage of the content workflow. */
  ingestion?: InputMaybe<IngestionWorkflowStageInput>;
  /** The name of the workflow. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The preparation stage of the content workflow. */
  preparation?: InputMaybe<PreparationWorkflowStageInput>;
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
  /** The YouTube channel identifier, when using channel type. */
  channelIdentifier?: InputMaybe<Scalars['String']['input']>;
  /** The YouTube playlist identifier, when using playlist type. */
  playlistIdentifier?: InputMaybe<Scalars['String']['input']>;
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The YouTube type, i.e. video, playlist or channel. */
  type: YouTubeTypes;
  /** The YouTube video identifiers, when using video type. */
  videoIdentifiers?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The YouTube video name to search, when using videos type. */
  videoName?: InputMaybe<Scalars['String']['input']>;
};

/** Represents YouTube feed properties. */
export type YouTubeFeedPropertiesUpdateInput = {
  /** The YouTube channel identifier, when using channel type. */
  channelIdentifier?: InputMaybe<Scalars['String']['input']>;
  /** The YouTube playlist identifier, when using playlist type. */
  playlistIdentifier?: InputMaybe<Scalars['String']['input']>;
  /** The limit of items to be read from feed, defaults to 100. */
  readLimit?: InputMaybe<Scalars['Int']['input']>;
  /** The YouTube type, i.e. video, playlist or channel. */
  type?: InputMaybe<YouTubeTypes>;
  /** The YouTube video identifiers, when using video type. */
  videoIdentifiers?: InputMaybe<Array<Scalars['String']['input']>>;
  /** The YouTube video name to search, when using videos type. */
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

export type CountAlertsQueryVariables = Exact<{
  filter?: InputMaybe<AlertFilter>;
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
}>;


export type GetAlertQuery = { __typename?: 'Query', alert?: { __typename?: 'Alert', id: string, name: string, creationDate: any, state: EntityState, correlationId?: string | null, type: AlertTypes, summaryPrompt?: string | null, publishPrompt: string, lastAlertDate?: any | null, owner: { __typename?: 'Owner', id: string }, filter?: { __typename?: 'ContentCriteria', types?: Array<ContentTypes> | null, fileTypes?: Array<FileTypes | null> | null, dateRange?: { __typename?: 'DateRange', from?: any | null, to?: any | null } | null, creationDateRange?: { __typename?: 'DateRange', from?: any | null, to?: any | null } | null, contents?: Array<{ __typename?: 'EntityReference', id: string }> | null, feeds?: Array<{ __typename?: 'EntityReference', id: string }> | null, workflows?: Array<{ __typename?: 'EntityReference', id: string }> | null, collections?: Array<{ __typename?: 'EntityReference', id: string }> | null, observations?: Array<{ __typename?: 'ObservationCriteria', type: ObservableTypes, states?: Array<EntityState | null> | null, observable: { __typename?: 'EntityReference', id: string } }> | null } | null, integration: { __typename?: 'IntegrationConnector', type: IntegrationServiceTypes, uri?: string | null, slack?: { __typename?: 'SlackIntegrationProperties', token: string, channel: string } | null }, publishing: { __typename?: 'ContentPublishingConnector', type: ContentPublishingServiceTypes, elevenLabs?: { __typename?: 'ElevenLabsPublishingProperties', model?: ElevenLabsModels | null, voice?: string | null } | null }, summarySpecification?: { __typename?: 'EntityReference', id: string } | null, publishSpecification?: { __typename?: 'EntityReference', id: string } | null } | null };

export type QueryAlertsQueryVariables = Exact<{
  filter?: InputMaybe<AlertFilter>;
}>;


export type QueryAlertsQuery = { __typename?: 'Query', alerts?: { __typename?: 'AlertResults', results?: Array<{ __typename?: 'Alert', id: string, name: string, creationDate: any, state: EntityState, correlationId?: string | null, type: AlertTypes, summaryPrompt?: string | null, publishPrompt: string, lastAlertDate?: any | null, owner: { __typename?: 'Owner', id: string }, filter?: { __typename?: 'ContentCriteria', types?: Array<ContentTypes> | null, fileTypes?: Array<FileTypes | null> | null, dateRange?: { __typename?: 'DateRange', from?: any | null, to?: any | null } | null, creationDateRange?: { __typename?: 'DateRange', from?: any | null, to?: any | null } | null, contents?: Array<{ __typename?: 'EntityReference', id: string }> | null, feeds?: Array<{ __typename?: 'EntityReference', id: string }> | null, workflows?: Array<{ __typename?: 'EntityReference', id: string }> | null, collections?: Array<{ __typename?: 'EntityReference', id: string }> | null, observations?: Array<{ __typename?: 'ObservationCriteria', type: ObservableTypes, states?: Array<EntityState | null> | null, observable: { __typename?: 'EntityReference', id: string } }> | null } | null, integration: { __typename?: 'IntegrationConnector', type: IntegrationServiceTypes, uri?: string | null, slack?: { __typename?: 'SlackIntegrationProperties', token: string, channel: string } | null }, publishing: { __typename?: 'ContentPublishingConnector', type: ContentPublishingServiceTypes, elevenLabs?: { __typename?: 'ElevenLabsPublishingProperties', model?: ElevenLabsModels | null, voice?: string | null } | null }, summarySpecification?: { __typename?: 'EntityReference', id: string } | null, publishSpecification?: { __typename?: 'EntityReference', id: string } | null } | null> | null } | null };

export type UpdateAlertMutationVariables = Exact<{
  alert: AlertUpdateInput;
}>;


export type UpdateAlertMutation = { __typename?: 'Mutation', updateAlert?: { __typename?: 'Alert', id: string, name: string, state: EntityState, type: AlertTypes } | null };

export type CountCategoriesQueryVariables = Exact<{
  filter?: InputMaybe<CategoryFilter>;
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
}>;


export type GetCategoryQuery = { __typename?: 'Query', category?: { __typename?: 'Category', id: string, name: string, description?: string | null, creationDate: any } | null };

export type QueryCategoriesQueryVariables = Exact<{
  filter?: InputMaybe<CategoryFilter>;
}>;


export type QueryCategoriesQuery = { __typename?: 'Query', categories?: { __typename?: 'CategoryResults', results?: Array<{ __typename?: 'Category', id: string, name: string, description?: string | null, creationDate: any } | null> | null } | null };

export type UpdateCategoryMutationVariables = Exact<{
  category: CategoryUpdateInput;
}>;


export type UpdateCategoryMutation = { __typename?: 'Mutation', updateCategory?: { __typename?: 'Category', id: string, name: string } | null };

export type AddContentsToCollectionsMutationVariables = Exact<{
  contents: Array<EntityReferenceInput> | EntityReferenceInput;
  collections: Array<EntityReferenceInput> | EntityReferenceInput;
}>;


export type AddContentsToCollectionsMutation = { __typename?: 'Mutation', addContentsToCollections?: Array<{ __typename?: 'Collection', id: string, name: string, state: EntityState, type?: CollectionTypes | null, contents?: Array<{ __typename?: 'Content', id: string, name: string } | null> | null } | null> | null };

export type CountCollectionsQueryVariables = Exact<{
  filter?: InputMaybe<CollectionFilter>;
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
}>;


export type GetCollectionQuery = { __typename?: 'Query', collection?: { __typename?: 'Collection', id: string, name: string, creationDate: any, state: EntityState, type?: CollectionTypes | null, owner: { __typename?: 'Owner', id: string }, contents?: Array<{ __typename?: 'Content', id: string, name: string } | null> | null } | null };

export type QueryCollectionsQueryVariables = Exact<{
  filter?: InputMaybe<CollectionFilter>;
}>;


export type QueryCollectionsQuery = { __typename?: 'Query', collections?: { __typename?: 'CollectionResults', results?: Array<{ __typename?: 'Collection', id: string, name: string, creationDate: any, state: EntityState, type?: CollectionTypes | null, owner: { __typename?: 'Owner', id: string }, contents?: Array<{ __typename?: 'Content', id: string, name: string } | null> | null } | null> | null } | null };

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

export type ExtractContentsMutationVariables = Exact<{
  prompt: Scalars['String']['input'];
  filter?: InputMaybe<ContentFilter>;
  specification: EntityReferenceInput;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type ExtractContentsMutation = { __typename?: 'Mutation', extractContents?: Array<{ __typename?: 'ExtractCompletion', value?: string | null, startTime?: any | null, endTime?: any | null, pageNumber?: number | null, error?: string | null, specification?: { __typename?: 'EntityReference', id: string } | null, content?: { __typename?: 'EntityReference', id: string } | null } | null> | null };

export type GetContentQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetContentQuery = { __typename?: 'Query', content?: { __typename?: 'Content', id: string, name: string, creationDate: any, state: EntityState, originalDate?: any | null, finishedDate?: any | null, workflowDuration?: any | null, uri?: any | null, description?: string | null, markdown?: string | null, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, fileName?: string | null, fileSize?: any | null, masterUri?: any | null, imageUri?: any | null, textUri?: any | null, audioUri?: any | null, transcriptUri?: any | null, error?: string | null, owner: { __typename?: 'Owner', id: string }, address?: { __typename?: 'Address', streetAddress?: string | null, city?: string | null, region?: string | null, country?: string | null, postalCode?: string | null } | null, location?: { __typename?: 'Point', latitude?: number | null, longitude?: number | null } | null, video?: { __typename?: 'VideoMetadata', width?: number | null, height?: number | null, duration?: string | null, make?: string | null, model?: string | null, software?: string | null, title?: string | null, description?: string | null, keywords?: Array<string | null> | null, author?: string | null } | null, audio?: { __typename?: 'AudioMetadata', keywords?: Array<string | null> | null, author?: string | null, series?: string | null, episode?: string | null, episodeType?: string | null, season?: string | null, publisher?: string | null, copyright?: string | null, language?: string | null, genre?: string | null, title?: string | null, description?: string | null, bitrate?: number | null, channels?: number | null, sampleRate?: number | null, bitsPerSample?: number | null, duration?: string | null } | null, image?: { __typename?: 'ImageMetadata', width?: number | null, height?: number | null, resolutionX?: number | null, resolutionY?: number | null, bitsPerComponent?: number | null, components?: number | null, projectionType?: ImageProjectionTypes | null, orientation?: OrientationTypes | null, description?: string | null, make?: string | null, model?: string | null, software?: string | null, lens?: string | null, focalLength?: number | null, exposureTime?: string | null, fNumber?: string | null, iso?: string | null, heading?: number | null, pitch?: number | null } | null, document?: { __typename?: 'DocumentMetadata', title?: string | null, subject?: string | null, summary?: string | null, author?: string | null, publisher?: string | null, description?: string | null, keywords?: Array<string | null> | null, pageCount?: number | null, worksheetCount?: number | null, slideCount?: number | null, wordCount?: number | null, lineCount?: number | null, paragraphCount?: number | null, isEncrypted?: boolean | null, hasDigitalSignature?: boolean | null } | null, email?: { __typename?: 'EmailMetadata', identifier?: string | null, subject?: string | null, labels?: Array<string | null> | null, sensitivity?: MailSensitivity | null, priority?: MailPriority | null, importance?: MailImportance | null, from?: Array<{ __typename?: 'PersonReference', name?: string | null, email?: string | null, givenName?: string | null, familyName?: string | null } | null> | null, to?: Array<{ __typename?: 'PersonReference', name?: string | null, email?: string | null, givenName?: string | null, familyName?: string | null } | null> | null, cc?: Array<{ __typename?: 'PersonReference', name?: string | null, email?: string | null, givenName?: string | null, familyName?: string | null } | null> | null, bcc?: Array<{ __typename?: 'PersonReference', name?: string | null, email?: string | null, givenName?: string | null, familyName?: string | null } | null> | null } | null, issue?: { __typename?: 'IssueMetadata', identifier?: string | null, title?: string | null, project?: string | null, team?: string | null, status?: string | null, priority?: string | null, type?: string | null, labels?: Array<string | null> | null } | null, package?: { __typename?: 'PackageMetadata', fileCount?: number | null, folderCount?: number | null, isEncrypted?: boolean | null } | null, parent?: { __typename?: 'Content', id: string, name: string } | null, children?: Array<{ __typename?: 'Content', id: string, name: string } | null> | null, feed?: { __typename?: 'Feed', id: string, name: string } | null, collections?: Array<{ __typename?: 'Collection', id: string, name: string } | null> | null, links?: Array<{ __typename?: 'LinkReferenceType', uri?: any | null, linkType?: LinkTypes | null }> | null, observations?: Array<{ __typename?: 'Observation', id: string, type: ObservableTypes, state: EntityState, observable: { __typename?: 'NamedEntityReference', id: string, name?: string | null }, occurrences?: Array<{ __typename?: 'ObservationOccurrence', type?: OccurrenceTypes | null, confidence?: number | null, startTime?: any | null, endTime?: any | null, pageIndex?: number | null, boundingBox?: { __typename?: 'BoundingBox', left?: number | null, top?: number | null, width?: number | null, height?: number | null } | null } | null> | null } | null> | null, workflow?: { __typename?: 'Workflow', id: string, name: string } | null, pages?: Array<{ __typename?: 'TextPage', index?: number | null, chunks?: Array<{ __typename?: 'TextChunk', index?: number | null, pageIndex?: number | null, rowIndex?: number | null, columnIndex?: number | null, confidence?: number | null, text?: string | null, role?: TextRoles | null, relevance?: number | null } | null> | null }> | null, segments?: Array<{ __typename?: 'TextSegment', startTime?: any | null, endTime?: any | null, text?: string | null, relevance?: number | null }> | null } | null };

export type IngestEncodedFileMutationVariables = Exact<{
  name: Scalars['String']['input'];
  data: Scalars['String']['input'];
  mimeType: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  collections?: InputMaybe<Array<EntityReferenceInput> | EntityReferenceInput>;
  workflow?: InputMaybe<EntityReferenceInput>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type IngestEncodedFileMutation = { __typename?: 'Mutation', ingestEncodedFile?: { __typename?: 'Content', id: string, name: string, state: EntityState, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, uri?: any | null, collections?: Array<{ __typename?: 'Collection', id: string, name: string } | null> | null } | null };

export type IngestTextMutationVariables = Exact<{
  name: Scalars['String']['input'];
  text: Scalars['String']['input'];
  textType?: InputMaybe<TextTypes>;
  uri?: InputMaybe<Scalars['URL']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  workflow?: InputMaybe<EntityReferenceInput>;
  collections?: InputMaybe<Array<EntityReferenceInput> | EntityReferenceInput>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type IngestTextMutation = { __typename?: 'Mutation', ingestText?: { __typename?: 'Content', id: string, name: string, state: EntityState, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, uri?: any | null, collections?: Array<{ __typename?: 'Collection', id: string, name: string } | null> | null } | null };

export type IngestUriMutationVariables = Exact<{
  name?: InputMaybe<Scalars['String']['input']>;
  uri: Scalars['URL']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  workflow?: InputMaybe<EntityReferenceInput>;
  collections?: InputMaybe<Array<EntityReferenceInput> | EntityReferenceInput>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type IngestUriMutation = { __typename?: 'Mutation', ingestUri?: { __typename?: 'Content', id: string, name: string, state: EntityState, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, uri?: any | null, collections?: Array<{ __typename?: 'Collection', id: string, name: string } | null> | null } | null };

export type IsContentDoneQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type IsContentDoneQuery = { __typename?: 'Query', isContentDone?: { __typename?: 'BooleanResult', result?: boolean | null } | null };

export type PublishContentsMutationVariables = Exact<{
  summaryPrompt?: InputMaybe<Scalars['String']['input']>;
  publishPrompt: Scalars['String']['input'];
  connector: ContentPublishingConnectorInput;
  filter?: InputMaybe<ContentFilter>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  summarySpecification?: InputMaybe<EntityReferenceInput>;
  publishSpecification?: InputMaybe<EntityReferenceInput>;
  workflow?: InputMaybe<EntityReferenceInput>;
}>;


export type PublishContentsMutation = { __typename?: 'Mutation', publishContents?: { __typename?: 'Content', id: string, name: string, state: EntityState, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, uri?: any | null, textUri?: any | null, audioUri?: any | null, markdown?: string | null, collections?: Array<{ __typename?: 'Collection', id: string, name: string } | null> | null } | null };

export type PublishTextMutationVariables = Exact<{
  text: Scalars['String']['input'];
  textType?: InputMaybe<TextTypes>;
  connector: ContentPublishingConnectorInput;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  workflow?: InputMaybe<EntityReferenceInput>;
}>;


export type PublishTextMutation = { __typename?: 'Mutation', publishText?: { __typename?: 'Content', id: string, name: string, state: EntityState, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, uri?: any | null, textUri?: any | null, audioUri?: any | null, markdown?: string | null, collections?: Array<{ __typename?: 'Collection', id: string, name: string } | null> | null } | null };

export type QueryContentsQueryVariables = Exact<{
  filter: ContentFilter;
}>;


export type QueryContentsQuery = { __typename?: 'Query', contents?: { __typename?: 'ContentResults', results?: Array<{ __typename?: 'Content', id: string, name: string, creationDate: any, state: EntityState, originalDate?: any | null, finishedDate?: any | null, workflowDuration?: any | null, uri?: any | null, description?: string | null, markdown?: string | null, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, fileName?: string | null, fileSize?: any | null, masterUri?: any | null, imageUri?: any | null, textUri?: any | null, audioUri?: any | null, transcriptUri?: any | null, error?: string | null, owner: { __typename?: 'Owner', id: string }, address?: { __typename?: 'Address', streetAddress?: string | null, city?: string | null, region?: string | null, country?: string | null, postalCode?: string | null } | null, location?: { __typename?: 'Point', latitude?: number | null, longitude?: number | null } | null, video?: { __typename?: 'VideoMetadata', width?: number | null, height?: number | null, duration?: string | null, make?: string | null, model?: string | null, software?: string | null, title?: string | null, description?: string | null, keywords?: Array<string | null> | null, author?: string | null } | null, audio?: { __typename?: 'AudioMetadata', keywords?: Array<string | null> | null, author?: string | null, series?: string | null, episode?: string | null, episodeType?: string | null, season?: string | null, publisher?: string | null, copyright?: string | null, language?: string | null, genre?: string | null, title?: string | null, description?: string | null, bitrate?: number | null, channels?: number | null, sampleRate?: number | null, bitsPerSample?: number | null, duration?: string | null } | null, image?: { __typename?: 'ImageMetadata', width?: number | null, height?: number | null, resolutionX?: number | null, resolutionY?: number | null, bitsPerComponent?: number | null, components?: number | null, projectionType?: ImageProjectionTypes | null, orientation?: OrientationTypes | null, description?: string | null, make?: string | null, model?: string | null, software?: string | null, lens?: string | null, focalLength?: number | null, exposureTime?: string | null, fNumber?: string | null, iso?: string | null, heading?: number | null, pitch?: number | null } | null, document?: { __typename?: 'DocumentMetadata', title?: string | null, subject?: string | null, summary?: string | null, author?: string | null, publisher?: string | null, description?: string | null, keywords?: Array<string | null> | null, pageCount?: number | null, worksheetCount?: number | null, slideCount?: number | null, wordCount?: number | null, lineCount?: number | null, paragraphCount?: number | null, isEncrypted?: boolean | null, hasDigitalSignature?: boolean | null } | null, email?: { __typename?: 'EmailMetadata', identifier?: string | null, subject?: string | null, labels?: Array<string | null> | null, sensitivity?: MailSensitivity | null, priority?: MailPriority | null, importance?: MailImportance | null, from?: Array<{ __typename?: 'PersonReference', name?: string | null, email?: string | null, givenName?: string | null, familyName?: string | null } | null> | null, to?: Array<{ __typename?: 'PersonReference', name?: string | null, email?: string | null, givenName?: string | null, familyName?: string | null } | null> | null, cc?: Array<{ __typename?: 'PersonReference', name?: string | null, email?: string | null, givenName?: string | null, familyName?: string | null } | null> | null, bcc?: Array<{ __typename?: 'PersonReference', name?: string | null, email?: string | null, givenName?: string | null, familyName?: string | null } | null> | null } | null, issue?: { __typename?: 'IssueMetadata', identifier?: string | null, title?: string | null, project?: string | null, team?: string | null, status?: string | null, priority?: string | null, type?: string | null, labels?: Array<string | null> | null } | null, package?: { __typename?: 'PackageMetadata', fileCount?: number | null, folderCount?: number | null, isEncrypted?: boolean | null } | null, parent?: { __typename?: 'Content', id: string, name: string } | null, children?: Array<{ __typename?: 'Content', id: string, name: string } | null> | null, feed?: { __typename?: 'Feed', id: string, name: string } | null, collections?: Array<{ __typename?: 'Collection', id: string, name: string } | null> | null, links?: Array<{ __typename?: 'LinkReferenceType', uri?: any | null, linkType?: LinkTypes | null }> | null, observations?: Array<{ __typename?: 'Observation', id: string, type: ObservableTypes, state: EntityState, observable: { __typename?: 'NamedEntityReference', id: string, name?: string | null }, occurrences?: Array<{ __typename?: 'ObservationOccurrence', type?: OccurrenceTypes | null, confidence?: number | null, startTime?: any | null, endTime?: any | null, pageIndex?: number | null, boundingBox?: { __typename?: 'BoundingBox', left?: number | null, top?: number | null, width?: number | null, height?: number | null } | null } | null> | null } | null> | null, workflow?: { __typename?: 'Workflow', id: string, name: string } | null, pages?: Array<{ __typename?: 'TextPage', index?: number | null, chunks?: Array<{ __typename?: 'TextChunk', index?: number | null, pageIndex?: number | null, rowIndex?: number | null, columnIndex?: number | null, confidence?: number | null, text?: string | null, role?: TextRoles | null, relevance?: number | null } | null> | null }> | null, segments?: Array<{ __typename?: 'TextSegment', startTime?: any | null, endTime?: any | null, text?: string | null, relevance?: number | null }> | null } | null> | null } | null };

export type QueryContentsFacetsQueryVariables = Exact<{
  filter: ContentFilter;
  facets?: InputMaybe<Array<ContentFacetInput> | ContentFacetInput>;
}>;


export type QueryContentsFacetsQuery = { __typename?: 'Query', contents?: { __typename?: 'ContentResults', results?: Array<{ __typename?: 'Content', id: string, name: string, creationDate: any, state: EntityState, originalDate?: any | null, finishedDate?: any | null, workflowDuration?: any | null, uri?: any | null, description?: string | null, markdown?: string | null, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, fileName?: string | null, fileSize?: any | null, masterUri?: any | null, imageUri?: any | null, textUri?: any | null, audioUri?: any | null, transcriptUri?: any | null, error?: string | null, owner: { __typename?: 'Owner', id: string }, address?: { __typename?: 'Address', streetAddress?: string | null, city?: string | null, region?: string | null, country?: string | null, postalCode?: string | null } | null, location?: { __typename?: 'Point', latitude?: number | null, longitude?: number | null } | null, video?: { __typename?: 'VideoMetadata', width?: number | null, height?: number | null, duration?: string | null, make?: string | null, model?: string | null, software?: string | null, title?: string | null, description?: string | null, keywords?: Array<string | null> | null, author?: string | null } | null, audio?: { __typename?: 'AudioMetadata', keywords?: Array<string | null> | null, author?: string | null, series?: string | null, episode?: string | null, episodeType?: string | null, season?: string | null, publisher?: string | null, copyright?: string | null, language?: string | null, genre?: string | null, title?: string | null, description?: string | null, bitrate?: number | null, channels?: number | null, sampleRate?: number | null, bitsPerSample?: number | null, duration?: string | null } | null, image?: { __typename?: 'ImageMetadata', width?: number | null, height?: number | null, resolutionX?: number | null, resolutionY?: number | null, bitsPerComponent?: number | null, components?: number | null, projectionType?: ImageProjectionTypes | null, orientation?: OrientationTypes | null, description?: string | null, make?: string | null, model?: string | null, software?: string | null, lens?: string | null, focalLength?: number | null, exposureTime?: string | null, fNumber?: string | null, iso?: string | null, heading?: number | null, pitch?: number | null } | null, document?: { __typename?: 'DocumentMetadata', title?: string | null, subject?: string | null, summary?: string | null, author?: string | null, publisher?: string | null, description?: string | null, keywords?: Array<string | null> | null, pageCount?: number | null, worksheetCount?: number | null, slideCount?: number | null, wordCount?: number | null, lineCount?: number | null, paragraphCount?: number | null, isEncrypted?: boolean | null, hasDigitalSignature?: boolean | null } | null, email?: { __typename?: 'EmailMetadata', identifier?: string | null, subject?: string | null, labels?: Array<string | null> | null, sensitivity?: MailSensitivity | null, priority?: MailPriority | null, importance?: MailImportance | null, from?: Array<{ __typename?: 'PersonReference', name?: string | null, email?: string | null, givenName?: string | null, familyName?: string | null } | null> | null, to?: Array<{ __typename?: 'PersonReference', name?: string | null, email?: string | null, givenName?: string | null, familyName?: string | null } | null> | null, cc?: Array<{ __typename?: 'PersonReference', name?: string | null, email?: string | null, givenName?: string | null, familyName?: string | null } | null> | null, bcc?: Array<{ __typename?: 'PersonReference', name?: string | null, email?: string | null, givenName?: string | null, familyName?: string | null } | null> | null } | null, issue?: { __typename?: 'IssueMetadata', identifier?: string | null, title?: string | null, project?: string | null, team?: string | null, status?: string | null, priority?: string | null, type?: string | null, labels?: Array<string | null> | null } | null, package?: { __typename?: 'PackageMetadata', fileCount?: number | null, folderCount?: number | null, isEncrypted?: boolean | null } | null, parent?: { __typename?: 'Content', id: string, name: string } | null, children?: Array<{ __typename?: 'Content', id: string, name: string } | null> | null, feed?: { __typename?: 'Feed', id: string, name: string } | null, collections?: Array<{ __typename?: 'Collection', id: string, name: string } | null> | null, links?: Array<{ __typename?: 'LinkReferenceType', uri?: any | null, linkType?: LinkTypes | null }> | null, observations?: Array<{ __typename?: 'Observation', id: string, type: ObservableTypes, state: EntityState, observable: { __typename?: 'NamedEntityReference', id: string, name?: string | null }, occurrences?: Array<{ __typename?: 'ObservationOccurrence', type?: OccurrenceTypes | null, confidence?: number | null, startTime?: any | null, endTime?: any | null, pageIndex?: number | null, boundingBox?: { __typename?: 'BoundingBox', left?: number | null, top?: number | null, width?: number | null, height?: number | null } | null } | null> | null } | null> | null, workflow?: { __typename?: 'Workflow', id: string, name: string } | null, pages?: Array<{ __typename?: 'TextPage', index?: number | null, chunks?: Array<{ __typename?: 'TextChunk', index?: number | null, pageIndex?: number | null, rowIndex?: number | null, columnIndex?: number | null, confidence?: number | null, text?: string | null, role?: TextRoles | null, relevance?: number | null } | null> | null }> | null, segments?: Array<{ __typename?: 'TextSegment', startTime?: any | null, endTime?: any | null, text?: string | null, relevance?: number | null }> | null } | null> | null, facets?: Array<{ __typename?: 'ContentFacet', facet?: ContentFacetTypes | null, count?: any | null, type?: FacetValueTypes | null, value?: string | null, range?: { __typename?: 'StringRange', from?: string | null, to?: string | null } | null, observable?: { __typename?: 'ObservableFacet', type?: ObservableTypes | null, observable?: { __typename?: 'NamedEntityReference', id: string, name?: string | null } | null } | null } | null> | null } | null };

export type QueryContentsGraphQueryVariables = Exact<{
  filter: ContentFilter;
  graph?: InputMaybe<ContentGraphInput>;
}>;


export type QueryContentsGraphQuery = { __typename?: 'Query', contents?: { __typename?: 'ContentResults', graph?: { __typename?: 'Graph', nodes?: Array<{ __typename?: 'GraphNode', id: string, name: string, type: EntityTypes, metadata?: string | null } | null> | null, edges?: Array<{ __typename?: 'GraphEdge', from: string, to: string } | null> | null } | null } | null };

export type SummarizeContentsMutationVariables = Exact<{
  summarizations: Array<SummarizationStrategyInput> | SummarizationStrategyInput;
  filter?: InputMaybe<ContentFilter>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type SummarizeContentsMutation = { __typename?: 'Mutation', summarizeContents?: Array<{ __typename?: 'PromptSummarization', type: SummarizationTypes, error?: string | null, specification?: { __typename?: 'EntityReference', id: string } | null, content: { __typename?: 'EntityReference', id: string }, items?: Array<{ __typename?: 'Summarized', text?: string | null, tokens: number, summarizationTime?: any | null }> | null } | null> | null };

export type UpdateContentMutationVariables = Exact<{
  content: ContentUpdateInput;
}>;


export type UpdateContentMutation = { __typename?: 'Mutation', updateContent?: { __typename?: 'Content', id: string, name: string, state: EntityState, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, uri?: any | null, collections?: Array<{ __typename?: 'Collection', id: string, name: string } | null> | null } | null };

export type ClearConversationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ClearConversationMutation = { __typename?: 'Mutation', clearConversation?: { __typename?: 'Conversation', id: string, name: string, state: EntityState, type?: ConversationTypes | null } | null };

export type CloseConversationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type CloseConversationMutation = { __typename?: 'Mutation', closeConversation?: { __typename?: 'Conversation', id: string, name: string, state: EntityState, type?: ConversationTypes | null } | null };

export type CountConversationsQueryVariables = Exact<{
  filter?: InputMaybe<ConversationFilter>;
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

export type GetConversationQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetConversationQuery = { __typename?: 'Query', conversation?: { __typename?: 'Conversation', id: string, name: string, creationDate: any, state: EntityState, correlationId?: string | null, type?: ConversationTypes | null, owner: { __typename?: 'Owner', id: string }, messages?: Array<{ __typename?: 'ConversationMessage', role: ConversationRoleTypes, author?: string | null, message: string, tokens: number, throughput?: number | null, completionTime?: any | null, timestamp: any, modelService?: ModelServiceTypes | null, model?: string | null, citations?: Array<{ __typename?: 'ConversationCitation', index?: number | null, text?: string | null, startTime?: any | null, endTime?: any | null, pageNumber?: number | null, frameNumber?: number | null, content?: { __typename?: 'Content', id: string, name: string, state: EntityState, type?: ContentTypes | null, fileType?: FileTypes | null, fileName?: string | null, originalDate?: any | null, uri?: any | null } | null } | null> | null } | null> | null, specification?: { __typename?: 'Specification', id: string, name: string } | null, filter?: { __typename?: 'ContentCriteria', types?: Array<ContentTypes> | null, fileTypes?: Array<FileTypes | null> | null, dateRange?: { __typename?: 'DateRange', from?: any | null, to?: any | null } | null, creationDateRange?: { __typename?: 'DateRange', from?: any | null, to?: any | null } | null, contents?: Array<{ __typename?: 'EntityReference', id: string }> | null, feeds?: Array<{ __typename?: 'EntityReference', id: string }> | null, workflows?: Array<{ __typename?: 'EntityReference', id: string }> | null, collections?: Array<{ __typename?: 'EntityReference', id: string }> | null, observations?: Array<{ __typename?: 'ObservationCriteria', type: ObservableTypes, states?: Array<EntityState | null> | null, observable: { __typename?: 'EntityReference', id: string } }> | null } | null } | null };

export type PromptConversationMutationVariables = Exact<{
  prompt: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type PromptConversationMutation = { __typename?: 'Mutation', promptConversation?: { __typename?: 'PromptConversation', messageCount?: number | null, conversation?: { __typename?: 'EntityReference', id: string } | null, message?: { __typename?: 'ConversationMessage', role: ConversationRoleTypes, author?: string | null, message: string, tokens: number, throughput?: number | null, completionTime?: any | null, timestamp: any, modelService?: ModelServiceTypes | null, model?: string | null, citations?: Array<{ __typename?: 'ConversationCitation', index?: number | null, text?: string | null, startTime?: any | null, endTime?: any | null, pageNumber?: number | null, frameNumber?: number | null, content?: { __typename?: 'Content', id: string, name: string, state: EntityState, type?: ContentTypes | null, fileType?: FileTypes | null, fileName?: string | null, originalDate?: any | null, uri?: any | null } | null } | null> | null } | null, facets?: Array<{ __typename?: 'ContentFacet', type?: FacetValueTypes | null, value?: string | null, count?: any | null, facet?: ContentFacetTypes | null, range?: { __typename?: 'StringRange', from?: string | null, to?: string | null } | null, observable?: { __typename?: 'ObservableFacet', type?: ObservableTypes | null, observable?: { __typename?: 'NamedEntityReference', id: string, name?: string | null } | null } | null } | null> | null } | null };

export type PublishConversationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  connector: ContentPublishingConnectorInput;
  name?: InputMaybe<Scalars['String']['input']>;
  isSynchronous?: InputMaybe<Scalars['Boolean']['input']>;
  workflow?: InputMaybe<EntityReferenceInput>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type PublishConversationMutation = { __typename?: 'Mutation', publishConversation?: { __typename?: 'Content', id: string, name: string, state: EntityState, type?: ContentTypes | null, fileType?: FileTypes | null, mimeType?: string | null, uri?: any | null, textUri?: any | null, audioUri?: any | null, markdown?: string | null, collections?: Array<{ __typename?: 'Collection', id: string, name: string } | null> | null } | null };

export type QueryConversationsQueryVariables = Exact<{
  filter?: InputMaybe<ConversationFilter>;
}>;


export type QueryConversationsQuery = { __typename?: 'Query', conversations?: { __typename?: 'ConversationResults', results?: Array<{ __typename?: 'Conversation', id: string, name: string, creationDate: any, state: EntityState, correlationId?: string | null, type?: ConversationTypes | null, owner: { __typename?: 'Owner', id: string }, messages?: Array<{ __typename?: 'ConversationMessage', role: ConversationRoleTypes, author?: string | null, message: string, tokens: number, throughput?: number | null, completionTime?: any | null, timestamp: any, modelService?: ModelServiceTypes | null, model?: string | null, citations?: Array<{ __typename?: 'ConversationCitation', index?: number | null, text?: string | null, startTime?: any | null, endTime?: any | null, pageNumber?: number | null, frameNumber?: number | null, content?: { __typename?: 'Content', id: string, name: string, state: EntityState, type?: ContentTypes | null, fileType?: FileTypes | null, fileName?: string | null, originalDate?: any | null, uri?: any | null } | null } | null> | null } | null> | null, specification?: { __typename?: 'Specification', id: string, name: string } | null, filter?: { __typename?: 'ContentCriteria', types?: Array<ContentTypes> | null, fileTypes?: Array<FileTypes | null> | null, dateRange?: { __typename?: 'DateRange', from?: any | null, to?: any | null } | null, creationDateRange?: { __typename?: 'DateRange', from?: any | null, to?: any | null } | null, contents?: Array<{ __typename?: 'EntityReference', id: string }> | null, feeds?: Array<{ __typename?: 'EntityReference', id: string }> | null, workflows?: Array<{ __typename?: 'EntityReference', id: string }> | null, collections?: Array<{ __typename?: 'EntityReference', id: string }> | null, observations?: Array<{ __typename?: 'ObservationCriteria', type: ObservableTypes, states?: Array<EntityState | null> | null, observable: { __typename?: 'EntityReference', id: string } }> | null } | null } | null> | null } | null };

export type SuggestConversationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  count?: InputMaybe<Scalars['Int']['input']>;
  correlationId?: InputMaybe<Scalars['String']['input']>;
}>;


export type SuggestConversationMutation = { __typename?: 'Mutation', suggestConversation?: { __typename?: 'PromptSuggestion', prompts?: Array<string | null> | null } | null };

export type UpdateConversationMutationVariables = Exact<{
  conversation: ConversationUpdateInput;
}>;


export type UpdateConversationMutation = { __typename?: 'Mutation', updateConversation?: { __typename?: 'Conversation', id: string, name: string, state: EntityState, type?: ConversationTypes | null } | null };

export type CountEventsQueryVariables = Exact<{
  filter?: InputMaybe<EventFilter>;
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
}>;


export type GetEventQuery = { __typename?: 'Query', event?: { __typename?: 'Event', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, startDate?: any | null, endDate?: any | null, availabilityStartDate?: any | null, availabilityEndDate?: any | null, price?: any | null, minPrice?: any | null, maxPrice?: any | null, priceCurrency?: string | null, isAccessibleForFree?: boolean | null, typicalAgeRange?: string | null, address?: { __typename?: 'Address', streetAddress?: string | null, city?: string | null, region?: string | null, country?: string | null, postalCode?: string | null } | null } | null };

export type QueryEventsQueryVariables = Exact<{
  filter?: InputMaybe<EventFilter>;
}>;


export type QueryEventsQuery = { __typename?: 'Query', events?: { __typename?: 'EventResults', results?: Array<{ __typename?: 'Event', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, startDate?: any | null, endDate?: any | null, availabilityStartDate?: any | null, availabilityEndDate?: any | null, price?: any | null, minPrice?: any | null, maxPrice?: any | null, priceCurrency?: string | null, isAccessibleForFree?: boolean | null, typicalAgeRange?: string | null, address?: { __typename?: 'Address', streetAddress?: string | null, city?: string | null, region?: string | null, country?: string | null, postalCode?: string | null } | null } | null> | null } | null };

export type UpdateEventMutationVariables = Exact<{
  event: EventUpdateInput;
}>;


export type UpdateEventMutation = { __typename?: 'Mutation', updateEvent?: { __typename?: 'Event', id: string, name: string } | null };

export type CountFeedsQueryVariables = Exact<{
  filter?: InputMaybe<FeedFilter>;
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

export type GetFeedQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetFeedQuery = { __typename?: 'Query', feed?: { __typename?: 'Feed', id: string, name: string, creationDate: any, state: EntityState, correlationId?: string | null, type: FeedTypes, error?: string | null, lastPostDate?: any | null, lastReadDate?: any | null, readCount?: number | null, owner: { __typename?: 'Owner', id: string }, site?: { __typename?: 'SiteFeedProperties', siteType: SiteTypes, type: FeedServiceTypes, isRecursive?: boolean | null, s3?: { __typename?: 'AmazonFeedProperties', accessKey?: string | null, secretAccessKey?: string | null, bucketName?: string | null, prefix?: string | null, region?: string | null } | null, azureBlob?: { __typename?: 'AzureBlobFeedProperties', storageAccessKey?: string | null, accountName?: string | null, containerName?: string | null, prefix?: string | null } | null, azureFile?: { __typename?: 'AzureFileFeedProperties', storageAccessKey?: string | null, accountName?: string | null, shareName?: string | null, prefix?: string | null } | null, google?: { __typename?: 'GoogleFeedProperties', credentials?: string | null, containerName?: string | null, prefix?: string | null } | null, sharePoint?: { __typename?: 'SharePointFeedProperties', authenticationType?: SharePointAuthenticationTypes | null, accountName?: string | null, libraryId?: string | null, tenantId?: string | null, refreshToken?: string | null } | null, oneDrive?: { __typename?: 'OneDriveFeedProperties', folderId?: string | null, refreshToken: string } | null, googleDrive?: { __typename?: 'GoogleDriveFeedProperties', folderId?: string | null, refreshToken: string } | null } | null, email?: { __typename?: 'EmailFeedProperties', type: FeedServiceTypes, includeAttachments?: boolean | null, google?: { __typename?: 'GoogleEmailFeedProperties', type?: EmailListingTypes | null, refreshToken?: string | null } | null, microsoft?: { __typename?: 'MicrosoftEmailFeedProperties', type?: EmailListingTypes | null, tenantId?: string | null, refreshToken?: string | null } | null } | null, issue?: { __typename?: 'IssueFeedProperties', type: FeedServiceTypes, includeAttachments?: boolean | null, jira?: { __typename?: 'AtlassianJiraFeedProperties', uri: any, project: string, email: string, token: string } | null, linear?: { __typename?: 'LinearFeedProperties', key: string, project: string } | null, github?: { __typename?: 'GitHubIssuesFeedProperties', uri?: any | null, repositoryOwner: string, repositoryName: string, refreshToken?: string | null, personalAccessToken?: string | null } | null } | null, rss?: { __typename?: 'RSSFeedProperties', readLimit?: number | null, uri: any } | null, web?: { __typename?: 'WebFeedProperties', readLimit?: number | null, uri: any, includeFiles?: boolean | null } | null, reddit?: { __typename?: 'RedditFeedProperties', readLimit?: number | null, subredditName: string } | null, notion?: { __typename?: 'NotionFeedProperties', readLimit?: number | null, token: string, identifiers: Array<string>, type: NotionTypes } | null, youtube?: { __typename?: 'YouTubeFeedProperties', readLimit?: number | null, type: YouTubeTypes, videoName?: string | null, videoIdentifiers?: Array<string> | null, channelIdentifier?: string | null, playlistIdentifier?: string | null } | null, slack?: { __typename?: 'SlackFeedProperties', readLimit?: number | null, type?: FeedListingTypes | null, token: string, channel: string, includeAttachments?: boolean | null } | null, discord?: { __typename?: 'DiscordFeedProperties', readLimit?: number | null, type?: FeedListingTypes | null, token: string, channel: string, includeAttachments?: boolean | null } | null, workflow?: { __typename?: 'Workflow', id: string, name: string } | null, schedulePolicy?: { __typename?: 'FeedSchedulePolicy', recurrenceType?: TimedPolicyRecurrenceTypes | null, repeatInterval?: any | null } | null } | null };

export type IsFeedDoneQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type IsFeedDoneQuery = { __typename?: 'Query', isFeedDone?: { __typename?: 'BooleanResult', result?: boolean | null } | null };

export type QueryFeedsQueryVariables = Exact<{
  filter?: InputMaybe<FeedFilter>;
}>;


export type QueryFeedsQuery = { __typename?: 'Query', feeds?: { __typename?: 'FeedResults', results?: Array<{ __typename?: 'Feed', id: string, name: string, creationDate: any, state: EntityState, correlationId?: string | null, type: FeedTypes, error?: string | null, lastPostDate?: any | null, lastReadDate?: any | null, readCount?: number | null, owner: { __typename?: 'Owner', id: string }, site?: { __typename?: 'SiteFeedProperties', siteType: SiteTypes, type: FeedServiceTypes, isRecursive?: boolean | null, s3?: { __typename?: 'AmazonFeedProperties', accessKey?: string | null, secretAccessKey?: string | null, bucketName?: string | null, prefix?: string | null, region?: string | null } | null, azureBlob?: { __typename?: 'AzureBlobFeedProperties', storageAccessKey?: string | null, accountName?: string | null, containerName?: string | null, prefix?: string | null } | null, azureFile?: { __typename?: 'AzureFileFeedProperties', storageAccessKey?: string | null, accountName?: string | null, shareName?: string | null, prefix?: string | null } | null, google?: { __typename?: 'GoogleFeedProperties', credentials?: string | null, containerName?: string | null, prefix?: string | null } | null, sharePoint?: { __typename?: 'SharePointFeedProperties', authenticationType?: SharePointAuthenticationTypes | null, accountName?: string | null, libraryId?: string | null, tenantId?: string | null, refreshToken?: string | null } | null, oneDrive?: { __typename?: 'OneDriveFeedProperties', folderId?: string | null, refreshToken: string } | null, googleDrive?: { __typename?: 'GoogleDriveFeedProperties', folderId?: string | null, refreshToken: string } | null } | null, email?: { __typename?: 'EmailFeedProperties', type: FeedServiceTypes, includeAttachments?: boolean | null, google?: { __typename?: 'GoogleEmailFeedProperties', type?: EmailListingTypes | null, refreshToken?: string | null } | null, microsoft?: { __typename?: 'MicrosoftEmailFeedProperties', type?: EmailListingTypes | null, tenantId?: string | null, refreshToken?: string | null } | null } | null, issue?: { __typename?: 'IssueFeedProperties', type: FeedServiceTypes, includeAttachments?: boolean | null, jira?: { __typename?: 'AtlassianJiraFeedProperties', uri: any, project: string, email: string, token: string } | null, linear?: { __typename?: 'LinearFeedProperties', key: string, project: string } | null, github?: { __typename?: 'GitHubIssuesFeedProperties', uri?: any | null, repositoryOwner: string, repositoryName: string, refreshToken?: string | null, personalAccessToken?: string | null } | null } | null, rss?: { __typename?: 'RSSFeedProperties', readLimit?: number | null, uri: any } | null, web?: { __typename?: 'WebFeedProperties', readLimit?: number | null, uri: any, includeFiles?: boolean | null } | null, reddit?: { __typename?: 'RedditFeedProperties', readLimit?: number | null, subredditName: string } | null, notion?: { __typename?: 'NotionFeedProperties', readLimit?: number | null, token: string, identifiers: Array<string>, type: NotionTypes } | null, youtube?: { __typename?: 'YouTubeFeedProperties', readLimit?: number | null, type: YouTubeTypes, videoName?: string | null, videoIdentifiers?: Array<string> | null, channelIdentifier?: string | null, playlistIdentifier?: string | null } | null, slack?: { __typename?: 'SlackFeedProperties', readLimit?: number | null, type?: FeedListingTypes | null, token: string, channel: string, includeAttachments?: boolean | null } | null, discord?: { __typename?: 'DiscordFeedProperties', readLimit?: number | null, type?: FeedListingTypes | null, token: string, channel: string, includeAttachments?: boolean | null } | null, workflow?: { __typename?: 'Workflow', id: string, name: string } | null, schedulePolicy?: { __typename?: 'FeedSchedulePolicy', recurrenceType?: TimedPolicyRecurrenceTypes | null, repeatInterval?: any | null } | null } | null> | null } | null };

export type UpdateFeedMutationVariables = Exact<{
  feed: FeedUpdateInput;
}>;


export type UpdateFeedMutation = { __typename?: 'Mutation', updateFeed?: { __typename?: 'Feed', id: string, name: string, state: EntityState, type: FeedTypes } | null };

export type CountLabelsQueryVariables = Exact<{
  filter?: InputMaybe<LabelFilter>;
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
}>;


export type GetLabelQuery = { __typename?: 'Query', label?: { __typename?: 'Label', id: string, name: string, description?: string | null, creationDate: any } | null };

export type QueryLabelsQueryVariables = Exact<{
  filter?: InputMaybe<LabelFilter>;
}>;


export type QueryLabelsQuery = { __typename?: 'Query', labels?: { __typename?: 'LabelResults', results?: Array<{ __typename?: 'Label', id: string, name: string, description?: string | null, creationDate: any } | null> | null } | null };

export type UpdateLabelMutationVariables = Exact<{
  label: LabelUpdateInput;
}>;


export type UpdateLabelMutation = { __typename?: 'Mutation', updateLabel?: { __typename?: 'Label', id: string, name: string } | null };

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
}>;


export type GetOrganizationQuery = { __typename?: 'Query', organization?: { __typename?: 'Organization', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, foundingDate?: any | null, industries?: Array<string | null> | null, revenue?: any | null, revenueCurrency?: string | null, investment?: any | null, investmentCurrency?: string | null, address?: { __typename?: 'Address', streetAddress?: string | null, city?: string | null, region?: string | null, country?: string | null, postalCode?: string | null } | null } | null };

export type QueryOrganizationsQueryVariables = Exact<{
  filter?: InputMaybe<OrganizationFilter>;
}>;


export type QueryOrganizationsQuery = { __typename?: 'Query', organizations?: { __typename?: 'OrganizationResults', results?: Array<{ __typename?: 'Organization', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, foundingDate?: any | null, industries?: Array<string | null> | null, revenue?: any | null, revenueCurrency?: string | null, investment?: any | null, investmentCurrency?: string | null, address?: { __typename?: 'Address', streetAddress?: string | null, city?: string | null, region?: string | null, country?: string | null, postalCode?: string | null } | null } | null> | null } | null };

export type UpdateOrganizationMutationVariables = Exact<{
  organization: OrganizationUpdateInput;
}>;


export type UpdateOrganizationMutation = { __typename?: 'Mutation', updateOrganization?: { __typename?: 'Organization', id: string, name: string } | null };

export type CountPersonsQueryVariables = Exact<{
  filter?: InputMaybe<PersonFilter>;
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
}>;


export type GetPersonQuery = { __typename?: 'Query', person?: { __typename?: 'Person', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, email?: string | null, givenName?: string | null, familyName?: string | null, phoneNumber?: string | null, birthDate?: any | null, title?: string | null, occupation?: string | null, education?: string | null, address?: { __typename?: 'Address', streetAddress?: string | null, city?: string | null, region?: string | null, country?: string | null, postalCode?: string | null } | null } | null };

export type QueryPersonsQueryVariables = Exact<{
  filter?: InputMaybe<PersonFilter>;
}>;


export type QueryPersonsQuery = { __typename?: 'Query', persons?: { __typename?: 'PersonResults', results?: Array<{ __typename?: 'Person', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, email?: string | null, givenName?: string | null, familyName?: string | null, phoneNumber?: string | null, birthDate?: any | null, title?: string | null, occupation?: string | null, education?: string | null, address?: { __typename?: 'Address', streetAddress?: string | null, city?: string | null, region?: string | null, country?: string | null, postalCode?: string | null } | null } | null> | null } | null };

export type UpdatePersonMutationVariables = Exact<{
  person: PersonUpdateInput;
}>;


export type UpdatePersonMutation = { __typename?: 'Mutation', updatePerson?: { __typename?: 'Person', id: string, name: string } | null };

export type CountPlacesQueryVariables = Exact<{
  filter?: InputMaybe<PlaceFilter>;
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
}>;


export type GetPlaceQuery = { __typename?: 'Query', place?: { __typename?: 'Place', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, address?: { __typename?: 'Address', streetAddress?: string | null, city?: string | null, region?: string | null, country?: string | null, postalCode?: string | null } | null } | null };

export type QueryPlacesQueryVariables = Exact<{
  filter?: InputMaybe<PlaceFilter>;
}>;


export type QueryPlacesQuery = { __typename?: 'Query', places?: { __typename?: 'PlaceResults', results?: Array<{ __typename?: 'Place', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, address?: { __typename?: 'Address', streetAddress?: string | null, city?: string | null, region?: string | null, country?: string | null, postalCode?: string | null } | null } | null> | null } | null };

export type UpdatePlaceMutationVariables = Exact<{
  place: PlaceUpdateInput;
}>;


export type UpdatePlaceMutation = { __typename?: 'Mutation', updatePlace?: { __typename?: 'Place', id: string, name: string } | null };

export type CountProductsQueryVariables = Exact<{
  filter?: InputMaybe<ProductFilter>;
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
}>;


export type GetProductQuery = { __typename?: 'Query', product?: { __typename?: 'Product', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, manufacturer?: string | null, model?: string | null, brand?: string | null, upc?: string | null, sku?: string | null, releaseDate?: any | null, productionDate?: any | null, address?: { __typename?: 'Address', streetAddress?: string | null, city?: string | null, region?: string | null, country?: string | null, postalCode?: string | null } | null } | null };

export type QueryProductsQueryVariables = Exact<{
  filter?: InputMaybe<ProductFilter>;
}>;


export type QueryProductsQuery = { __typename?: 'Query', products?: { __typename?: 'ProductResults', results?: Array<{ __typename?: 'Product', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, manufacturer?: string | null, model?: string | null, brand?: string | null, upc?: string | null, sku?: string | null, releaseDate?: any | null, productionDate?: any | null, address?: { __typename?: 'Address', streetAddress?: string | null, city?: string | null, region?: string | null, country?: string | null, postalCode?: string | null } | null } | null> | null } | null };

export type UpdateProductMutationVariables = Exact<{
  product: ProductUpdateInput;
}>;


export type UpdateProductMutation = { __typename?: 'Mutation', updateProduct?: { __typename?: 'Product', id: string, name: string } | null };

export type GetProjectQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProjectQuery = { __typename?: 'Query', project?: { __typename?: 'Project', id: string, name: string, creationDate: any, modifiedDate?: any | null, state: EntityState, environmentType?: EnvironmentTypes | null, platform?: ResourceConnectorTypes | null, region?: string | null, callbackUri?: any | null, workflow?: { __typename?: 'Workflow', id: string, name: string } | null, specification?: { __typename?: 'Specification', id: string, name: string } | null, quota?: { __typename?: 'ProjectQuota', storage?: number | null, contents?: number | null, feeds?: number | null, posts?: number | null, conversations?: number | null } | null } | null };

export type LookupCreditsQueryVariables = Exact<{
  correlationId: Scalars['String']['input'];
}>;


export type LookupCreditsQuery = { __typename?: 'Query', lookupCredits?: { __typename?: 'ProjectCredits', correlationId?: string | null, ownerId?: string | null, credits?: any | null, storageRatio?: any | null, computeRatio?: any | null, preparationRatio?: any | null, extractionRatio?: any | null, enrichmentRatio?: any | null, publishingRatio?: any | null, searchRatio?: any | null, conversationRatio?: any | null } | null };

export type LookupUsageQueryVariables = Exact<{
  correlationId: Scalars['String']['input'];
}>;


export type LookupUsageQuery = { __typename?: 'Query', lookupUsage?: Array<{ __typename?: 'ProjectUsageRecord', correlationId?: string | null, date: any, credits?: any | null, name: string, metric?: BillableMetrics | null, workflow?: string | null, entityType?: EntityTypes | null, entityId?: string | null, projectId: string, ownerId: string, uri?: string | null, duration?: any | null, throughput?: number | null, contentType?: ContentTypes | null, fileType?: FileTypes | null, modelService?: string | null, modelName?: string | null, processorName?: string | null, prompt?: string | null, promptTokens?: number | null, completion?: string | null, completionTokens?: number | null, tokens?: number | null, count?: number | null, request?: string | null, variables?: string | null, response?: string | null } | null> | null };

export type QueryCreditsQueryVariables = Exact<{
  startDate: Scalars['DateTime']['input'];
  duration: Scalars['TimeSpan']['input'];
}>;


export type QueryCreditsQuery = { __typename?: 'Query', credits?: Array<{ __typename?: 'ProjectCredits', correlationId?: string | null, ownerId?: string | null, credits?: any | null, storageRatio?: any | null, computeRatio?: any | null, preparationRatio?: any | null, extractionRatio?: any | null, enrichmentRatio?: any | null, publishingRatio?: any | null, searchRatio?: any | null, conversationRatio?: any | null } | null> | null };

export type QueryUsageQueryVariables = Exact<{
  startDate: Scalars['DateTime']['input'];
  duration: Scalars['TimeSpan']['input'];
}>;


export type QueryUsageQuery = { __typename?: 'Query', usage?: Array<{ __typename?: 'ProjectUsageRecord', correlationId?: string | null, date: any, credits?: any | null, name: string, metric?: BillableMetrics | null, workflow?: string | null, entityType?: EntityTypes | null, entityId?: string | null, projectId: string, ownerId: string, uri?: string | null, duration?: any | null, throughput?: number | null, contentType?: ContentTypes | null, fileType?: FileTypes | null, modelService?: string | null, modelName?: string | null, processorName?: string | null, prompt?: string | null, promptTokens?: number | null, completion?: string | null, completionTokens?: number | null, tokens?: number | null, count?: number | null, request?: string | null, variables?: string | null, response?: string | null } | null> | null };

export type UpdateProjectMutationVariables = Exact<{
  project: ProjectUpdateInput;
}>;


export type UpdateProjectMutation = { __typename?: 'Mutation', updateProject?: { __typename?: 'Project', id: string, name: string } | null };

export type CountReposQueryVariables = Exact<{
  filter?: InputMaybe<RepoFilter>;
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
}>;


export type GetRepoQuery = { __typename?: 'Query', repo?: { __typename?: 'Repo', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any } | null };

export type QueryReposQueryVariables = Exact<{
  filter?: InputMaybe<RepoFilter>;
}>;


export type QueryReposQuery = { __typename?: 'Query', repos?: { __typename?: 'RepoResults', results?: Array<{ __typename?: 'Repo', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any } | null> | null } | null };

export type UpdateRepoMutationVariables = Exact<{
  repo: RepoUpdateInput;
}>;


export type UpdateRepoMutation = { __typename?: 'Mutation', updateRepo?: { __typename?: 'Repo', id: string, name: string } | null };

export type CountSoftwaresQueryVariables = Exact<{
  filter?: InputMaybe<SoftwareFilter>;
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
}>;


export type GetSoftwareQuery = { __typename?: 'Query', software?: { __typename?: 'Software', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, releaseDate?: any | null, developer?: string | null } | null };

export type QuerySoftwaresQueryVariables = Exact<{
  filter?: InputMaybe<SoftwareFilter>;
}>;


export type QuerySoftwaresQuery = { __typename?: 'Query', softwares?: { __typename?: 'SoftwareResults', results?: Array<{ __typename?: 'Software', id: string, name: string, alternateNames?: Array<string | null> | null, creationDate: any, releaseDate?: any | null, developer?: string | null } | null> | null } | null };

export type UpdateSoftwareMutationVariables = Exact<{
  software: SoftwareUpdateInput;
}>;


export type UpdateSoftwareMutation = { __typename?: 'Mutation', updateSoftware?: { __typename?: 'Software', id: string, name: string } | null };

export type CountSpecificationsQueryVariables = Exact<{
  filter?: InputMaybe<SpecificationFilter>;
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
}>;


export type GetSpecificationQuery = { __typename?: 'Query', specification?: { __typename?: 'Specification', id: string, name: string, creationDate: any, state: EntityState, type?: SpecificationTypes | null, serviceType?: ModelServiceTypes | null, systemPrompt?: string | null, customGuidance?: string | null, customInstructions?: string | null, searchType?: ConversationSearchTypes | null, numberSimilar?: number | null, owner: { __typename?: 'Owner', id: string }, strategy?: { __typename?: 'ConversationStrategy', type?: ConversationStrategyTypes | null, messageLimit?: number | null, embedCitations?: boolean | null, enableFacets?: boolean | null, messagesWeight?: number | null, contentsWeight?: number | null } | null, promptStrategy?: { __typename?: 'PromptStrategy', type: PromptStrategyTypes } | null, retrievalStrategy?: { __typename?: 'RetrievalStrategy', type: RetrievalStrategyTypes, contentLimit?: number | null } | null, rerankingStrategy?: { __typename?: 'RerankingStrategy', serviceType: RerankingModelServiceTypes } | null, openAI?: { __typename?: 'OpenAIModelProperties', tokenLimit?: number | null, completionTokenLimit?: number | null, model: OpenAiModels, key?: string | null, modelName?: string | null, temperature?: number | null, probability?: number | null } | null, azureOpenAI?: { __typename?: 'AzureOpenAIModelProperties', tokenLimit?: number | null, completionTokenLimit?: number | null, model: AzureOpenAiModels, key?: string | null, endpoint?: any | null, deploymentName?: string | null, temperature?: number | null, probability?: number | null } | null, cohere?: { __typename?: 'CohereModelProperties', tokenLimit?: number | null, completionTokenLimit?: number | null, model: CohereModels, key?: string | null, modelName?: string | null, temperature?: number | null, probability?: number | null } | null, anthropic?: { __typename?: 'AnthropicModelProperties', tokenLimit?: number | null, completionTokenLimit?: number | null, model: AnthropicModels, key?: string | null, modelName?: string | null, temperature?: number | null, probability?: number | null } | null, replicate?: { __typename?: 'ReplicateModelProperties', tokenLimit?: number | null, completionTokenLimit?: number | null, model: ReplicateModels, key?: string | null, modelName?: string | null, temperature?: number | null, probability?: number | null } | null, tools?: Array<{ __typename?: 'ToolDefinition', name: string, description?: string | null, schema: string, uri?: any | null }> | null } | null };

export type PromptSpecificationsMutationVariables = Exact<{
  prompt: Scalars['String']['input'];
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type PromptSpecificationsMutation = { __typename?: 'Mutation', promptSpecifications?: Array<{ __typename?: 'PromptCompletion', error?: string | null, specification?: { __typename?: 'EntityReference', id: string } | null, messages?: Array<{ __typename?: 'ConversationMessage', role: ConversationRoleTypes, author?: string | null, message: string, tokens: number, throughput?: number | null, completionTime?: any | null, timestamp: any, modelService?: ModelServiceTypes | null, model?: string | null, citations?: Array<{ __typename?: 'ConversationCitation', index?: number | null, text?: string | null, startTime?: any | null, endTime?: any | null, pageNumber?: number | null, frameNumber?: number | null, content?: { __typename?: 'Content', id: string, name: string, state: EntityState, type?: ContentTypes | null, fileType?: FileTypes | null, fileName?: string | null, originalDate?: any | null, uri?: any | null } | null } | null> | null } | null> | null } | null> | null };

export type QuerySpecificationsQueryVariables = Exact<{
  filter?: InputMaybe<SpecificationFilter>;
}>;


export type QuerySpecificationsQuery = { __typename?: 'Query', specifications?: { __typename?: 'SpecificationResults', results?: Array<{ __typename?: 'Specification', id: string, name: string, creationDate: any, state: EntityState, type?: SpecificationTypes | null, serviceType?: ModelServiceTypes | null, systemPrompt?: string | null, customGuidance?: string | null, customInstructions?: string | null, searchType?: ConversationSearchTypes | null, numberSimilar?: number | null, owner: { __typename?: 'Owner', id: string }, strategy?: { __typename?: 'ConversationStrategy', type?: ConversationStrategyTypes | null, messageLimit?: number | null, embedCitations?: boolean | null, enableFacets?: boolean | null, messagesWeight?: number | null, contentsWeight?: number | null } | null, promptStrategy?: { __typename?: 'PromptStrategy', type: PromptStrategyTypes } | null, retrievalStrategy?: { __typename?: 'RetrievalStrategy', type: RetrievalStrategyTypes, contentLimit?: number | null } | null, rerankingStrategy?: { __typename?: 'RerankingStrategy', serviceType: RerankingModelServiceTypes } | null, openAI?: { __typename?: 'OpenAIModelProperties', tokenLimit?: number | null, completionTokenLimit?: number | null, model: OpenAiModels, key?: string | null, modelName?: string | null, temperature?: number | null, probability?: number | null } | null, azureOpenAI?: { __typename?: 'AzureOpenAIModelProperties', tokenLimit?: number | null, completionTokenLimit?: number | null, model: AzureOpenAiModels, key?: string | null, endpoint?: any | null, deploymentName?: string | null, temperature?: number | null, probability?: number | null } | null, cohere?: { __typename?: 'CohereModelProperties', tokenLimit?: number | null, completionTokenLimit?: number | null, model: CohereModels, key?: string | null, modelName?: string | null, temperature?: number | null, probability?: number | null } | null, anthropic?: { __typename?: 'AnthropicModelProperties', tokenLimit?: number | null, completionTokenLimit?: number | null, model: AnthropicModels, key?: string | null, modelName?: string | null, temperature?: number | null, probability?: number | null } | null, replicate?: { __typename?: 'ReplicateModelProperties', tokenLimit?: number | null, completionTokenLimit?: number | null, model: ReplicateModels, key?: string | null, modelName?: string | null, temperature?: number | null, probability?: number | null } | null, tools?: Array<{ __typename?: 'ToolDefinition', name: string, description?: string | null, schema: string, uri?: any | null }> | null } | null> | null } | null };

export type UpdateSpecificationMutationVariables = Exact<{
  specification: SpecificationUpdateInput;
}>;


export type UpdateSpecificationMutation = { __typename?: 'Mutation', updateSpecification?: { __typename?: 'Specification', id: string, name: string, state: EntityState, type?: SpecificationTypes | null, serviceType?: ModelServiceTypes | null } | null };

export type CountWorkflowsQueryVariables = Exact<{
  filter?: InputMaybe<WorkflowFilter>;
}>;


export type CountWorkflowsQuery = { __typename?: 'Query', countWorkflows?: { __typename?: 'CountResult', count?: any | null } | null };

export type CreateWorkflowMutationVariables = Exact<{
  workflow: WorkflowInput;
}>;


export type CreateWorkflowMutation = { __typename?: 'Mutation', createWorkflow?: { __typename?: 'Workflow', id: string, name: string, state: EntityState, ingestion?: { __typename?: 'IngestionWorkflowStage', if?: { __typename?: 'IngestionContentFilter', types?: Array<ContentTypes | null> | null, fileTypes?: Array<FileTypes | null> | null } | null, collections?: Array<{ __typename?: 'EntityReference', id: string } | null> | null } | null, preparation?: { __typename?: 'PreparationWorkflowStage', disableSmartCapture?: boolean | null, summarizations?: Array<{ __typename?: 'SummarizationStrategy', type: SummarizationTypes, tokens?: number | null, items?: number | null, specification?: { __typename?: 'EntityReference', id: string } | null } | null> | null, jobs?: Array<{ __typename?: 'PreparationWorkflowJob', connector?: { __typename?: 'FilePreparationConnector', type: FilePreparationServiceTypes, fileTypes?: Array<FileTypes> | null, azureDocument?: { __typename?: 'AzureDocumentPreparationProperties', model?: AzureDocumentIntelligenceModels | null } | null, deepgram?: { __typename?: 'DeepgramAudioPreparationProperties', model?: DeepgramModels | null, key?: string | null, enableRedaction?: boolean | null, enableSpeakerDiarization?: boolean | null } | null, document?: { __typename?: 'DocumentPreparationProperties', includeImages?: boolean | null } | null, email?: { __typename?: 'EmailPreparationProperties', includeAttachments?: boolean | null } | null } | null } | null> | null } | null, extraction?: { __typename?: 'ExtractionWorkflowStage', jobs?: Array<{ __typename?: 'ExtractionWorkflowJob', connector?: { __typename?: 'EntityExtractionConnector', type: EntityExtractionServiceTypes, contentTypes?: Array<ContentTypes> | null, fileTypes?: Array<FileTypes> | null, extractedTypes?: Array<ObservableTypes> | null, azureText?: { __typename?: 'AzureTextExtractionProperties', confidenceThreshold?: number | null, enablePII?: boolean | null } | null, azureImage?: { __typename?: 'AzureImageExtractionProperties', confidenceThreshold?: number | null } | null, openAIImage?: { __typename?: 'OpenAIImageExtractionProperties', confidenceThreshold?: number | null, detailLevel?: OpenAiVisionDetailLevels | null, customInstructions?: string | null } | null, modelText?: { __typename?: 'ModelTextExtractionProperties', specification?: { __typename?: 'EntityReference', id: string } | null } | null } | null } | null> | null } | null, enrichment?: { __typename?: 'EnrichmentWorkflowStage', link?: { __typename?: 'LinkStrategy', enableCrawling?: boolean | null, allowedDomains?: Array<string> | null, excludedDomains?: Array<string> | null, allowedLinks?: Array<LinkTypes> | null, excludedLinks?: Array<LinkTypes> | null, allowedFiles?: Array<FileTypes> | null, excludedFiles?: Array<FileTypes> | null, allowContentDomain?: boolean | null, maximumLinks?: number | null } | null, jobs?: Array<{ __typename?: 'EnrichmentWorkflowJob', connector?: { __typename?: 'EntityEnrichmentConnector', type?: EntityEnrichmentServiceTypes | null, enrichedTypes?: Array<ObservableTypes | null> | null } | null } | null> | null } | null, actions?: Array<{ __typename?: 'WorkflowAction', connector?: { __typename?: 'IntegrationConnector', type: IntegrationServiceTypes, uri?: string | null, slack?: { __typename?: 'SlackIntegrationProperties', token: string, channel: string } | null } | null } | null> | null } | null };

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
}>;


export type GetWorkflowQuery = { __typename?: 'Query', workflow?: { __typename?: 'Workflow', id: string, name: string, creationDate: any, state: EntityState, owner: { __typename?: 'Owner', id: string }, ingestion?: { __typename?: 'IngestionWorkflowStage', if?: { __typename?: 'IngestionContentFilter', types?: Array<ContentTypes | null> | null, fileTypes?: Array<FileTypes | null> | null } | null, collections?: Array<{ __typename?: 'EntityReference', id: string } | null> | null } | null, preparation?: { __typename?: 'PreparationWorkflowStage', disableSmartCapture?: boolean | null, summarizations?: Array<{ __typename?: 'SummarizationStrategy', type: SummarizationTypes, tokens?: number | null, items?: number | null, specification?: { __typename?: 'EntityReference', id: string } | null } | null> | null, jobs?: Array<{ __typename?: 'PreparationWorkflowJob', connector?: { __typename?: 'FilePreparationConnector', type: FilePreparationServiceTypes, fileTypes?: Array<FileTypes> | null, azureDocument?: { __typename?: 'AzureDocumentPreparationProperties', model?: AzureDocumentIntelligenceModels | null } | null, deepgram?: { __typename?: 'DeepgramAudioPreparationProperties', model?: DeepgramModels | null, key?: string | null, enableRedaction?: boolean | null, enableSpeakerDiarization?: boolean | null } | null, document?: { __typename?: 'DocumentPreparationProperties', includeImages?: boolean | null } | null, email?: { __typename?: 'EmailPreparationProperties', includeAttachments?: boolean | null } | null } | null } | null> | null } | null, extraction?: { __typename?: 'ExtractionWorkflowStage', jobs?: Array<{ __typename?: 'ExtractionWorkflowJob', connector?: { __typename?: 'EntityExtractionConnector', type: EntityExtractionServiceTypes, contentTypes?: Array<ContentTypes> | null, fileTypes?: Array<FileTypes> | null, extractedTypes?: Array<ObservableTypes> | null, azureText?: { __typename?: 'AzureTextExtractionProperties', confidenceThreshold?: number | null, enablePII?: boolean | null } | null, azureImage?: { __typename?: 'AzureImageExtractionProperties', confidenceThreshold?: number | null } | null, openAIImage?: { __typename?: 'OpenAIImageExtractionProperties', confidenceThreshold?: number | null, detailLevel?: OpenAiVisionDetailLevels | null, customInstructions?: string | null } | null, modelText?: { __typename?: 'ModelTextExtractionProperties', specification?: { __typename?: 'EntityReference', id: string } | null } | null } | null } | null> | null } | null, enrichment?: { __typename?: 'EnrichmentWorkflowStage', link?: { __typename?: 'LinkStrategy', enableCrawling?: boolean | null, allowedDomains?: Array<string> | null, excludedDomains?: Array<string> | null, allowedLinks?: Array<LinkTypes> | null, excludedLinks?: Array<LinkTypes> | null, allowedFiles?: Array<FileTypes> | null, excludedFiles?: Array<FileTypes> | null, allowContentDomain?: boolean | null, maximumLinks?: number | null } | null, jobs?: Array<{ __typename?: 'EnrichmentWorkflowJob', connector?: { __typename?: 'EntityEnrichmentConnector', type?: EntityEnrichmentServiceTypes | null, enrichedTypes?: Array<ObservableTypes | null> | null } | null } | null> | null } | null, actions?: Array<{ __typename?: 'WorkflowAction', connector?: { __typename?: 'IntegrationConnector', type: IntegrationServiceTypes, uri?: string | null, slack?: { __typename?: 'SlackIntegrationProperties', token: string, channel: string } | null } | null } | null> | null } | null };

export type QueryWorkflowsQueryVariables = Exact<{
  filter?: InputMaybe<WorkflowFilter>;
}>;


export type QueryWorkflowsQuery = { __typename?: 'Query', workflows?: { __typename?: 'WorkflowResults', results?: Array<{ __typename?: 'Workflow', id: string, name: string, creationDate: any, state: EntityState, owner: { __typename?: 'Owner', id: string }, ingestion?: { __typename?: 'IngestionWorkflowStage', if?: { __typename?: 'IngestionContentFilter', types?: Array<ContentTypes | null> | null, fileTypes?: Array<FileTypes | null> | null } | null, collections?: Array<{ __typename?: 'EntityReference', id: string } | null> | null } | null, preparation?: { __typename?: 'PreparationWorkflowStage', disableSmartCapture?: boolean | null, summarizations?: Array<{ __typename?: 'SummarizationStrategy', type: SummarizationTypes, tokens?: number | null, items?: number | null, specification?: { __typename?: 'EntityReference', id: string } | null } | null> | null, jobs?: Array<{ __typename?: 'PreparationWorkflowJob', connector?: { __typename?: 'FilePreparationConnector', type: FilePreparationServiceTypes, fileTypes?: Array<FileTypes> | null, azureDocument?: { __typename?: 'AzureDocumentPreparationProperties', model?: AzureDocumentIntelligenceModels | null } | null, deepgram?: { __typename?: 'DeepgramAudioPreparationProperties', model?: DeepgramModels | null, key?: string | null, enableRedaction?: boolean | null, enableSpeakerDiarization?: boolean | null } | null, document?: { __typename?: 'DocumentPreparationProperties', includeImages?: boolean | null } | null, email?: { __typename?: 'EmailPreparationProperties', includeAttachments?: boolean | null } | null } | null } | null> | null } | null, extraction?: { __typename?: 'ExtractionWorkflowStage', jobs?: Array<{ __typename?: 'ExtractionWorkflowJob', connector?: { __typename?: 'EntityExtractionConnector', type: EntityExtractionServiceTypes, contentTypes?: Array<ContentTypes> | null, fileTypes?: Array<FileTypes> | null, extractedTypes?: Array<ObservableTypes> | null, azureText?: { __typename?: 'AzureTextExtractionProperties', confidenceThreshold?: number | null, enablePII?: boolean | null } | null, azureImage?: { __typename?: 'AzureImageExtractionProperties', confidenceThreshold?: number | null } | null, openAIImage?: { __typename?: 'OpenAIImageExtractionProperties', confidenceThreshold?: number | null, detailLevel?: OpenAiVisionDetailLevels | null, customInstructions?: string | null } | null, modelText?: { __typename?: 'ModelTextExtractionProperties', specification?: { __typename?: 'EntityReference', id: string } | null } | null } | null } | null> | null } | null, enrichment?: { __typename?: 'EnrichmentWorkflowStage', link?: { __typename?: 'LinkStrategy', enableCrawling?: boolean | null, allowedDomains?: Array<string> | null, excludedDomains?: Array<string> | null, allowedLinks?: Array<LinkTypes> | null, excludedLinks?: Array<LinkTypes> | null, allowedFiles?: Array<FileTypes> | null, excludedFiles?: Array<FileTypes> | null, allowContentDomain?: boolean | null, maximumLinks?: number | null } | null, jobs?: Array<{ __typename?: 'EnrichmentWorkflowJob', connector?: { __typename?: 'EntityEnrichmentConnector', type?: EntityEnrichmentServiceTypes | null, enrichedTypes?: Array<ObservableTypes | null> | null } | null } | null> | null } | null, actions?: Array<{ __typename?: 'WorkflowAction', connector?: { __typename?: 'IntegrationConnector', type: IntegrationServiceTypes, uri?: string | null, slack?: { __typename?: 'SlackIntegrationProperties', token: string, channel: string } | null } | null } | null> | null } | null> | null } | null };

export type UpdateWorkflowMutationVariables = Exact<{
  workflow: WorkflowUpdateInput;
}>;


export type UpdateWorkflowMutation = { __typename?: 'Mutation', updateWorkflow?: { __typename?: 'Workflow', id: string, name: string, state: EntityState, ingestion?: { __typename?: 'IngestionWorkflowStage', if?: { __typename?: 'IngestionContentFilter', types?: Array<ContentTypes | null> | null, fileTypes?: Array<FileTypes | null> | null } | null, collections?: Array<{ __typename?: 'EntityReference', id: string } | null> | null } | null, preparation?: { __typename?: 'PreparationWorkflowStage', disableSmartCapture?: boolean | null, summarizations?: Array<{ __typename?: 'SummarizationStrategy', type: SummarizationTypes, tokens?: number | null, items?: number | null, specification?: { __typename?: 'EntityReference', id: string } | null } | null> | null, jobs?: Array<{ __typename?: 'PreparationWorkflowJob', connector?: { __typename?: 'FilePreparationConnector', type: FilePreparationServiceTypes, fileTypes?: Array<FileTypes> | null, azureDocument?: { __typename?: 'AzureDocumentPreparationProperties', model?: AzureDocumentIntelligenceModels | null } | null, deepgram?: { __typename?: 'DeepgramAudioPreparationProperties', model?: DeepgramModels | null, key?: string | null, enableRedaction?: boolean | null, enableSpeakerDiarization?: boolean | null } | null, document?: { __typename?: 'DocumentPreparationProperties', includeImages?: boolean | null } | null, email?: { __typename?: 'EmailPreparationProperties', includeAttachments?: boolean | null } | null } | null } | null> | null } | null, extraction?: { __typename?: 'ExtractionWorkflowStage', jobs?: Array<{ __typename?: 'ExtractionWorkflowJob', connector?: { __typename?: 'EntityExtractionConnector', type: EntityExtractionServiceTypes, contentTypes?: Array<ContentTypes> | null, fileTypes?: Array<FileTypes> | null, extractedTypes?: Array<ObservableTypes> | null, azureText?: { __typename?: 'AzureTextExtractionProperties', confidenceThreshold?: number | null, enablePII?: boolean | null } | null, azureImage?: { __typename?: 'AzureImageExtractionProperties', confidenceThreshold?: number | null } | null, openAIImage?: { __typename?: 'OpenAIImageExtractionProperties', confidenceThreshold?: number | null, detailLevel?: OpenAiVisionDetailLevels | null, customInstructions?: string | null } | null, modelText?: { __typename?: 'ModelTextExtractionProperties', specification?: { __typename?: 'EntityReference', id: string } | null } | null } | null } | null> | null } | null, enrichment?: { __typename?: 'EnrichmentWorkflowStage', link?: { __typename?: 'LinkStrategy', enableCrawling?: boolean | null, allowedDomains?: Array<string> | null, excludedDomains?: Array<string> | null, allowedLinks?: Array<LinkTypes> | null, excludedLinks?: Array<LinkTypes> | null, allowedFiles?: Array<FileTypes> | null, excludedFiles?: Array<FileTypes> | null, allowContentDomain?: boolean | null, maximumLinks?: number | null } | null, jobs?: Array<{ __typename?: 'EnrichmentWorkflowJob', connector?: { __typename?: 'EntityEnrichmentConnector', type?: EntityEnrichmentServiceTypes | null, enrichedTypes?: Array<ObservableTypes | null> | null } | null } | null> | null } | null, actions?: Array<{ __typename?: 'WorkflowAction', connector?: { __typename?: 'IntegrationConnector', type: IntegrationServiceTypes, uri?: string | null, slack?: { __typename?: 'SlackIntegrationProperties', token: string, channel: string } | null } | null } | null> | null } | null };

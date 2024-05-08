import * as jwt from 'jsonwebtoken';
import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink, NormalizedCacheObject, OperationVariables, ApolloQueryResult, FetchResult, ApolloError } from '@apollo/client/core';
import { DocumentNode } from 'graphql';
import * as Types from './generated/graphql-types';
import * as Documents from './generated/graphql-documents';
import * as dotenv from 'dotenv';

// Define the Graphlit class
class Graphlit {
  public client: ApolloClient<NormalizedCacheObject> | undefined;
  public token: string | undefined;

  private apiUri: string;
  private organizationId: string | undefined;
  private environmentId: string | undefined;
  private ownerId: string | undefined;
  private jwtSecret: string | undefined;

  constructor(organizationId?: string, environmentId?: string, jwtSecret?: string, ownerId?: string, apiUri?: string) {
    this.apiUri = apiUri || "https://data-scus.graphlit.io/api/v1/graphql";

    if (typeof process !== 'undefined') {
      dotenv.config();

      this.organizationId = organizationId || process.env.GRAPHLIT_ORGANIZATION_ID;
      this.environmentId = environmentId || process.env.GRAPHLIT_ENVIRONMENT_ID;
      this.jwtSecret = jwtSecret || process.env.GRAPHLIT_JWT_SECRET;

      // optional: for multi-tenant support
      this.ownerId = ownerId || process.env.GRAPHLIT_OWNER_ID;
    }
    else {
      this.organizationId = organizationId;
      this.environmentId = environmentId;
      this.jwtSecret = jwtSecret;

      // optional: for multi-tenant support
      this.ownerId = ownerId;
    }

    if (!this.organizationId) {
      throw new Error("Graphlit organization identifier is required.");
    }

    if (!this.environmentId) {
      throw new Error("Graphlit environment identifier is required.");
    }

    if (!this.jwtSecret) {
      throw new Error("Graphlit environment JWT secret is required.");
    }

    this.refreshClient();
  }

  public refreshClient() {
    this.client = undefined;
    this.generateToken();

    const httpLink = createHttpLink({
      uri: this.apiUri,
    });

    const authLink = new ApolloLink((operation, forward) => {
      operation.setContext({
        headers: {
          Authorization: this.token ? `Bearer ${this.token}` : "",
        }
      });

      return forward(operation);
    });

    this.client = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          errorPolicy: 'all',
        },
        query: {
          errorPolicy: 'all',
        },
        mutate: {
          errorPolicy: 'all',
        }
      }
    });
  }

  private generateToken() {
    if (!this.jwtSecret) {
      throw new Error("Graphlit environment JWT secret is required.");
    }

    const expiration = Math.floor(Date.now() / 1000) + (24 * 60 * 60); // one day from now

    const payload = {
      "https://graphlit.io/jwt/claims": {
        "x-graphlit-organization-id": this.organizationId,
        "x-graphlit-environment-id": this.environmentId,
        ...(this.ownerId && { "x-graphlit-owner-id": this.ownerId }),
        "x-graphlit-role": "Owner",
      },
      exp: expiration,
      iss: "graphlit",
      aud: "https://portal.graphlit.io",
    };

    this.token = jwt.sign(payload, this.jwtSecret, { algorithm: 'HS256' });
  }

  public async getProject(): Promise<Types.GetProjectQuery> {
    return this.queryAndCheckError<Types.GetProjectQuery, {}>(
      Documents.GetProject,
      {}
    );
  }

  public async updateProject(project: Types.ProjectUpdateInput): Promise<Types.UpdateProjectMutation> {
    return this.mutateAndCheckError<Types.UpdateProjectMutation, { project: Types.ProjectUpdateInput }>(
      Documents.UpdateProject,
      { project: project }
    );
  }

  public async lookupProjectUsage(correlationId: string): Promise<Types.LookupUsageQuery> {
    return this.queryAndCheckError<Types.LookupUsageQuery, { correlationId: string }>(
      Documents.LookupUsage,
      { correlationId: correlationId }
    );
  }

  public async lookupProjectCredits(correlationId: string): Promise<Types.LookupCreditsQuery> {
    return this.queryAndCheckError<Types.LookupCreditsQuery, { correlationId: string }>(
      Documents.LookupCredits,
      { correlationId: correlationId }
    );
  }

  public async queryProjectUsage(startDate: Types.Scalars['DateTime'], duration: Types.Scalars['TimeSpan']): Promise<Types.QueryUsageQuery> {
    return this.queryAndCheckError<Types.QueryUsageQuery, { startDate: Types.Scalars['DateTime'], duration: Types.Scalars['TimeSpan'] }>(
      Documents.QueryUsage,
      { startDate: startDate, duration: duration }
    );
  }

  public async queryProjectCredits(startDate: Types.Scalars['DateTime'], duration: Types.Scalars['TimeSpan']): Promise<Types.QueryCreditsQuery> {
    return this.queryAndCheckError<Types.QueryCreditsQuery, { startDate: Types.Scalars['DateTime'], duration: Types.Scalars['TimeSpan'] }>(
      Documents.QueryCredits,
      { startDate: startDate, duration: duration }
    );
  }

  public async createAlert(alert: Types.AlertInput, correlationId?: string): Promise<Types.CreateAlertMutation> {
    return this.mutateAndCheckError<Types.CreateAlertMutation, { alert: Types.AlertInput, correlationId?: string }>(
      Documents.CreateAlert,
      { alert: alert, correlationId: correlationId }
    );
  }

  public async updateAlert(alert: Types.AlertUpdateInput): Promise<Types.UpdateAlertMutation> {
    return this.mutateAndCheckError<Types.UpdateAlertMutation, { alert: Types.AlertUpdateInput }>(
      Documents.UpdateAlert,
      { alert: alert }
    );
  }

  public async deleteAlert(id: string): Promise<Types.DeleteAlertMutation> {
    return this.mutateAndCheckError<Types.DeleteAlertMutation, { id: string }>(
      Documents.DeleteAlert,
      { id: id }
    );
  }

  public async deleteAlerts(): Promise<Types.DeleteAlertsMutation> {
    return this.mutateAndCheckError<Types.DeleteAlertsMutation>(
      Documents.DeleteAlerts
    );
  }

  public async deleteAllAlerts(): Promise<Types.DeleteAllAlertsMutation> {
    return this.mutateAndCheckError<Types.DeleteAllAlertsMutation>(
      Documents.DeleteAllAlerts
    );
  }

  public async enableAlert(id: string): Promise<Types.EnableAlertMutation> {
    return this.mutateAndCheckError<Types.EnableAlertMutation, { id: string }>(
      Documents.EnableAlert,
      { id: id }
    );
  }

  public async disableAlert(id: string): Promise<Types.DisableAlertMutation> {
    return this.mutateAndCheckError<Types.DisableAlertMutation, { id: string }>(
      Documents.DisableAlert,
      { id: id }
    );
  }

  public async getAlert(id: string): Promise<Types.GetAlertQuery> {
    return this.queryAndCheckError<Types.GetAlertQuery, { id: string }>(
      Documents.GetAlert,
      { id: id }
    );
  }

  public async queryAlerts(filter?: Types.AlertFilter): Promise<Types.QueryAlertsQuery> {
    return this.queryAndCheckError<Types.QueryAlertsQuery, { filter?: Types.AlertFilter }>(
      Documents.QueryAlerts,
      { filter: filter }
    );
  }

  public async createCollection(collection: Types.CollectionInput): Promise<Types.CreateCollectionMutation> {
    return this.mutateAndCheckError<Types.CreateCollectionMutation, { collection: Types.CollectionInput }>(
      Documents.CreateCollection,
      { collection: collection }
    );
  }

  public async updateCollection(collection: Types.CollectionUpdateInput): Promise<Types.UpdateCollectionMutation> {
    return this.mutateAndCheckError<Types.UpdateCollectionMutation, { collection: Types.CollectionUpdateInput }>(
      Documents.UpdateCollection,
      { collection: collection }
    );
  }

  public async deleteCollection(id: string): Promise<Types.DeleteCollectionMutation> {
    return this.mutateAndCheckError<Types.DeleteCollectionMutation, { id: string }>(
      Documents.DeleteCollection,
      { id: id }
    );
  }

  public async deleteCollections(): Promise<Types.DeleteCollectionsMutation> {
    return this.mutateAndCheckError<Types.DeleteCollectionsMutation>(
      Documents.DeleteCollections
    );
  }

  public async deleteAllCollections(): Promise<Types.DeleteAllCollectionsMutation> {
    return this.mutateAndCheckError<Types.DeleteAllCollectionsMutation>(
      Documents.DeleteAllCollections
    );
  }

  public async addContentsToCollections(contents: Types.EntityReferenceInput[], collections: Types.EntityReferenceInput[]): Promise<Types.AddContentsToCollectionsMutation> {
    return this.mutateAndCheckError<Types.AddContentsToCollectionsMutation, { contents: Types.EntityReferenceInput[], collections: Types.EntityReferenceInput[] }>(
      Documents.AddContentsToCollections,
      { contents: contents, collections: collections }
    );
  }

  public async removeContentsFromCollection(contents: Types.EntityReferenceInput[], collection: Types.EntityReferenceInput): Promise<Types.RemoveContentsFromCollectionMutation> {
    return this.mutateAndCheckError<Types.RemoveContentsFromCollectionMutation, { contents: Types.EntityReferenceInput[], collection: Types.EntityReferenceInput }>(
      Documents.RemoveContentsFromCollection,
      { contents: contents, collection: collection }
    );
  }

  public async getCollection(id: string): Promise<Types.GetCollectionQuery> {
    return this.queryAndCheckError<Types.GetCollectionQuery, { id: string }>(
      Documents.GetCollection,
      { id: id }
    );
  }

  public async queryCollections(filter?: Types.CollectionFilter): Promise<Types.QueryCollectionsQuery> {
    return this.queryAndCheckError<Types.QueryCollectionsQuery, { filter?: Types.CollectionFilter }>(
      Documents.QueryCollections,
      { filter: filter }
    );
  }

  public async ingestUri(uri: string, name?: string, id?: string, isSynchronous?: boolean, workflow?: Types.EntityReferenceInput, correlationId?: string): Promise<Types.IngestUriMutation> {
    return this.mutateAndCheckError<Types.IngestUriMutation, { uri: string, name?: string, id?: string, isSynchronous?: boolean, workflow?: Types.EntityReferenceInput, correlationId?: string }>(
      Documents.IngestUri,
      { uri: uri, name: name, id: id, isSynchronous: isSynchronous, workflow: workflow, correlationId: correlationId }
    );
  }

  public async ingestText(name: string, text: string, textType?: Types.TextTypes, uri?: string, id?: string, isSynchronous?: boolean, workflow?: Types.EntityReferenceInput, correlationId?: string): Promise<Types.IngestTextMutation> {
    return this.mutateAndCheckError<Types.IngestTextMutation, { name: string, text: string, textType?: Types.TextTypes, uri?: string, id?: string, isSynchronous?: boolean, workflow?: Types.EntityReferenceInput, correlationId?: string }>(
      Documents.IngestText,
      { name: name, text: text, textType: textType, uri: uri, id: id, isSynchronous: isSynchronous, workflow: workflow, correlationId: correlationId }
    );
  }

  public async ingestEncodedFile(name: string, data: string, mimeType: string, id?: string, isSynchronous?: boolean, workflow?: Types.EntityReferenceInput, correlationId?: string): Promise<Types.IngestEncodedFileMutation> {
    return this.mutateAndCheckError<Types.IngestEncodedFileMutation, { name: string, data: string, mimeType: string, id?: string, isSynchronous?: boolean, workflow?: Types.EntityReferenceInput, correlationId?: string }>(
      Documents.IngestEncodedFile,
      { name: name, data: data, mimeType: mimeType, id: id, isSynchronous: isSynchronous, workflow: workflow, correlationId: correlationId }
    );
  }

  public async updateContent(content: Types.ContentUpdateInput): Promise<Types.UpdateContentMutation> {
    return this.mutateAndCheckError<Types.UpdateContentMutation, { content: Types.ContentUpdateInput }>(
      Documents.UpdateContent,
      { content: content }
    );
  }

  public async deleteContent(id: string): Promise<Types.DeleteContentMutation> {
    return this.mutateAndCheckError<Types.DeleteContentMutation, { id: string }>(
      Documents.DeleteContent,
      { id: id }
    );
  }

  public async deleteContents(): Promise<Types.DeleteContentsMutation> {
    return this.mutateAndCheckError<Types.DeleteContentsMutation>(
      Documents.DeleteContents
    );
  }

  public async deleteAllContents(): Promise<Types.DeleteAllContentsMutation> {
    return this.mutateAndCheckError<Types.DeleteAllContentsMutation>(
      Documents.DeleteAllContents
    );
  }

  public async summarizeContents(summarizations: [Types.SummarizationStrategyInput], filter?: Types.ContentFilter, correlationId?: string): Promise<Types.SummarizeContentsMutation> {
    return this.mutateAndCheckError<Types.SummarizeContentsMutation, { summarizations: [Types.SummarizationStrategyInput], filter?: Types.ContentFilter, correlationId?: string }>(
      Documents.SummarizeContents,
      { summarizations: summarizations, filter: filter, correlationId: correlationId }
    );
  }

  public async extractContents(prompt: string, filter?: Types.ContentFilter, specification?: Types.EntityReferenceInput, correlationId?: string): Promise<Types.ExtractContentsMutation> {
    return this.mutateAndCheckError<Types.ExtractContentsMutation, { prompt: string, filter?: Types.ContentFilter, specification?: Types.EntityReferenceInput, correlationId?: string }>(
      Documents.ExtractContents,
      { prompt: prompt, filter: filter, specification: specification, correlationId: correlationId }
    );
  }

  public async publishContents(summaryPrompt: string, summarySpecification: Types.EntityReferenceInput, connector: Types.ContentPublishingConnectorInput,
    publishPrompt?: string, publishSpecification?: Types.EntityReferenceInput,
    name?: string, filter?: Types.ContentFilter, workflow?: Types.EntityReferenceInput, correlationId?: string): Promise<Types.PublishContentsMutation> {
    return this.mutateAndCheckError<Types.PublishContentsMutation, {
      summaryPrompt: string, summarySpecification: Types.EntityReferenceInput, connector: Types.ContentPublishingConnectorInput, publishPrompt?: string, publishSpecification?: Types.EntityReferenceInput,
      name?: string, filter?: Types.ContentFilter, workflow?: Types.EntityReferenceInput, correlationId?: string
    }>(
      Documents.PublishContents,
      { summaryPrompt: summaryPrompt, summarySpecification: summarySpecification, connector: connector, publishPrompt: publishPrompt, publishSpecification: publishSpecification, name: name, filter: filter, workflow: workflow, correlationId: correlationId }
    );
  }

  public async publishText(text: string, textType: Types.TextTypes, connector: Types.ContentPublishingConnectorInput,
    name?: string, workflow?: Types.EntityReferenceInput, correlationId?: string): Promise<Types.PublishTextMutation> {
    return this.mutateAndCheckError<Types.PublishTextMutation, {
      text: string, textType: Types.TextTypes, connector: Types.ContentPublishingConnectorInput,
      name?: string, workflow?: Types.EntityReferenceInput, correlationId?: string
    }>(
      Documents.PublishText,
      { text: text, textType: textType, connector: connector, name: name, workflow: workflow, correlationId: correlationId }
    );
  }

  public async getContent(id: string): Promise<Types.GetContentQuery> {
    return this.queryAndCheckError<Types.GetContentQuery, { id: string }>(
      Documents.GetContent,
      { id: id }
    );
  }

  public async queryContents(filter?: Types.ContentFilter): Promise<Types.QueryContentsQuery> {
    return this.queryAndCheckError<Types.QueryContentsQuery, { filter?: Types.ContentFilter }>(
      Documents.QueryContents,
      { filter: filter }
    );
  }

  public async queryContentsFacets(filter?: Types.ContentFilter): Promise<Types.QueryContentsFacetsQuery> {
    return this.queryAndCheckError<Types.QueryContentsFacetsQuery, { filter?: Types.ContentFilter }>(
      Documents.QueryContentsFacets,
      { filter: filter }
    );
  }

  public async queryContentsGraph(filter?: Types.ContentFilter): Promise<Types.QueryContentsGraphQuery> {
    return this.queryAndCheckError<Types.QueryContentsGraphQuery, { filter?: Types.ContentFilter }>(
      Documents.QueryContentsGraph,
      { filter: filter }
    );
  }

  public async isContentDone(id: string): Promise<Types.IsContentDoneQuery> {
    return this.queryAndCheckError<Types.IsContentDoneQuery, { id: string }>(
      Documents.IsContentDone,
      { id: id }
    );
  }

  public async createConversation(conversation: Types.ConversationInput, correlationId?: string): Promise<Types.CreateConversationMutation> {
    return this.mutateAndCheckError<Types.CreateConversationMutation, { conversation: Types.ConversationInput, correlationId?: string }>(
      Documents.CreateConversation,
      { conversation: conversation, correlationId: correlationId }
    );
  }

  public async updateConversation(conversation: Types.ConversationUpdateInput): Promise<Types.UpdateConversationMutation> {
    return this.mutateAndCheckError<Types.UpdateConversationMutation, { conversation: Types.ConversationUpdateInput }>(
      Documents.UpdateConversation,
      { conversation: conversation }
    );
  }

  public async deleteConversation(id: string): Promise<Types.DeleteConversationMutation> {
    return this.mutateAndCheckError<Types.DeleteConversationMutation, { id: string }>(
      Documents.DeleteConversation,
      { id: id }
    );
  }

  public async deleteConversations(): Promise<Types.DeleteConversationsMutation> {
    return this.mutateAndCheckError<Types.DeleteConversationsMutation>(
      Documents.DeleteConversations
    );
  }

  public async deleteAllConversations(): Promise<Types.DeleteAllConversationsMutation> {
    return this.mutateAndCheckError<Types.DeleteAllConversationsMutation>(
      Documents.DeleteAllConversations
    );
  }

  public async clearConversation(id: string): Promise<Types.ClearConversationMutation> {
    return this.mutateAndCheckError<Types.ClearConversationMutation, { id: string }>(
      Documents.ClearConversation,
      { id: id }
    );
  }

  public async closeConversation(id: string): Promise<Types.CloseConversationMutation> {
    return this.mutateAndCheckError<Types.CloseConversationMutation, { id: string }>(
      Documents.CloseConversation,
      { id: id }
    );
  }

  public async getConversation(id: string): Promise<Types.GetConversationQuery> {
    return this.queryAndCheckError<Types.GetConversationQuery, { id: string }>(
      Documents.GetConversation,
      { id: id }
    );
  }

  public async queryConversations(filter?: Types.ConversationFilter): Promise<Types.QueryConversationsQuery> {
    return this.queryAndCheckError<Types.QueryConversationsQuery, { filter?: Types.ConversationFilter }>(
      Documents.QueryConversations,
      { filter: filter }
    );
  }

  public async promptConversation(prompt: string, id?: string, correlationId?: string): Promise<Types.PromptConversationMutation> {
    return this.mutateAndCheckError<Types.PromptConversationMutation, { prompt: string, id?: string, correlationId?: string }>(
      Documents.PromptConversation,
      { prompt: prompt, id: id, correlationId: correlationId }
    );
  }

  public async publishConversation(id: string, connector: Types.ContentPublishingConnectorInput, name?: string, workflow?: Types.EntityReferenceInput, correlationId?: string): Promise<Types.PublishConversationMutation> {
    return this.mutateAndCheckError<Types.PublishConversationMutation, { id: string, connector: Types.ContentPublishingConnectorInput, name?: string, workflow?: Types.EntityReferenceInput, correlationId?: string }>(
      Documents.PublishConversation,
      { id: id, connector: connector, name: name, workflow: workflow, correlationId: correlationId }
    );
  }

  public async suggestConversation(id: string, count?: number, correlationId?: string): Promise<Types.SuggestConversationMutation> {
    return this.mutateAndCheckError<Types.SuggestConversationMutation, { id: string, count?: number, correlationId?: string }>(
      Documents.SuggestConversation,
      { id: id, count: count, correlationId: correlationId }
    );
  }

  public async createFeed(feed: Types.FeedInput, correlationId?: string): Promise<Types.CreateFeedMutation> {
    return this.mutateAndCheckError<Types.CreateFeedMutation, { feed: Types.FeedInput, correlationId?: string }>(
      Documents.CreateFeed,
      { feed: feed, correlationId: correlationId }
    );
  }

  public async updateFeed(feed: Types.FeedUpdateInput): Promise<Types.UpdateFeedMutation> {
    return this.mutateAndCheckError<Types.UpdateFeedMutation, { feed: Types.FeedUpdateInput }>(
      Documents.UpdateFeed,
      { feed: feed }
    );
  }

  public async deleteFeed(id: string): Promise<Types.DeleteFeedMutation> {
    return this.mutateAndCheckError<Types.DeleteFeedMutation, { id: string }>(
      Documents.DeleteFeed,
      { id: id }
    );
  }

  public async deleteFeeds(): Promise<Types.DeleteFeedsMutation> {
    return this.mutateAndCheckError<Types.DeleteFeedsMutation>(
      Documents.DeleteFeeds
    );
  }

  public async deleteAllFeeds(): Promise<Types.DeleteAllFeedsMutation> {
    return this.mutateAndCheckError<Types.DeleteAllFeedsMutation>(
      Documents.DeleteAllFeeds
    );
  }

  public async enableFeed(id: string): Promise<Types.EnableFeedMutation> {
    return this.mutateAndCheckError<Types.EnableFeedMutation, { id: string }>(
      Documents.EnableFeed,
      { id: id }
    );
  }

  public async disableFeed(id: string): Promise<Types.DeleteFeedMutation> {
    return this.mutateAndCheckError<Types.DeleteFeedMutation, { id: string }>(
      Documents.DisableFeed,
      { id: id }
    );
  }

  public async getFeed(id: string): Promise<Types.GetFeedQuery> {
    return this.queryAndCheckError<Types.GetFeedQuery, { id: string }>(
      Documents.GetFeed,
      { id: id }
    );
  }

  public async queryFeeds(filter?: Types.FeedFilter): Promise<Types.QueryFeedsQuery> {
    return this.queryAndCheckError<Types.QueryFeedsQuery, { filter?: Types.FeedFilter }>(
      Documents.QueryFeeds,
      { filter: filter }
    );
  }

  public async isFeedDone(id: string): Promise<Types.IsFeedDoneQuery> {
    return this.queryAndCheckError<Types.IsFeedDoneQuery, { id: string }>(
      Documents.IsFeedDone,
      { id: id }
    );
  }

  public async promptSpecifications(prompt: string, ids: [string]): Promise<Types.PromptSpecificationsMutation> {
    return this.mutateAndCheckError<Types.PromptSpecificationsMutation, { prompt: string, ids: [string] }>(
      Documents.PromptSpecifications,
      { prompt: prompt, ids: ids }
    );
  }

  public async createSpecification(specification: Types.SpecificationInput): Promise<Types.CreateSpecificationMutation> {
    return this.mutateAndCheckError<Types.CreateSpecificationMutation, { specification: Types.SpecificationInput }>(
      Documents.CreateSpecification,
      { specification: specification }
    );
  }

  public async updateSpecification(specification: Types.SpecificationUpdateInput): Promise<Types.UpdateSpecificationMutation> {
    return this.mutateAndCheckError<Types.UpdateSpecificationMutation, { specification: Types.SpecificationUpdateInput }>(
      Documents.UpdateSpecification,
      { specification: specification }
    );
  }

  public async deleteSpecification(id: string): Promise<Types.DeleteSpecificationMutation> {
    return this.mutateAndCheckError<Types.DeleteSpecificationMutation, { id: string }>(
      Documents.DeleteSpecification,
      { id: id }
    );
  }

  public async deleteSpecifications(): Promise<Types.DeleteSpecificationsMutation> {
    return this.mutateAndCheckError<Types.DeleteSpecificationsMutation>(
      Documents.DeleteSpecifications
    );
  }

  public async deleteAllSpecifications(): Promise<Types.DeleteAllSpecificationsMutation> {
    return this.mutateAndCheckError<Types.DeleteAllSpecificationsMutation>(
      Documents.DeleteAllSpecifications
    );
  }

  public async getSpecification(id: string): Promise<Types.GetSpecificationQuery> {
    return this.queryAndCheckError<Types.GetSpecificationQuery, { id: string }>(
      Documents.GetSpecification,
      { id: id }
    );
  }

  public async querySpecifications(filter?: Types.SpecificationFilter): Promise<Types.QuerySpecificationsQuery> {
    return this.queryAndCheckError<Types.QuerySpecificationsQuery, { filter?: Types.SpecificationFilter }>(
      Documents.QuerySpecifications,
      { filter: filter }
    );
  }

  public async createWorkflow(workflow: Types.WorkflowInput): Promise<Types.CreateWorkflowMutation> {
    return this.mutateAndCheckError<Types.CreateWorkflowMutation, { workflow: Types.WorkflowInput }>(
      Documents.CreateWorkflow,
      { workflow: workflow }
    );
  }

  public async updateWorkflow(workflow: Types.WorkflowUpdateInput): Promise<Types.UpdateWorkflowMutation> {
    return this.mutateAndCheckError<Types.UpdateWorkflowMutation, { workflow: Types.WorkflowUpdateInput }>(
      Documents.UpdateWorkflow,
      { workflow: workflow }
    );
  }

  public async deleteWorkflow(id: string): Promise<Types.DeleteWorkflowMutation> {
    return this.mutateAndCheckError<Types.DeleteWorkflowMutation, { id: string }>(
      Documents.DeleteWorkflow,
      { id: id }
    );
  }

  public async deleteWorkflows(): Promise<Types.DeleteWorkflowsMutation> {
    return this.mutateAndCheckError<Types.DeleteWorkflowsMutation>(
      Documents.DeleteWorkflows
    );
  }

  public async deleteAllWorkflows(): Promise<Types.DeleteAllWorkflowsMutation> {
    return this.mutateAndCheckError<Types.DeleteAllWorkflowsMutation>(
      Documents.DeleteAllWorkflows
    );
  }

  public async getWorkflow(id: string): Promise<Types.GetWorkflowQuery> {
    return this.queryAndCheckError<Types.GetWorkflowQuery, { id: string }>(
      Documents.GetWorkflow,
      { id: id }
    );
  }

  public async queryWorkflows(filter?: Types.WorkflowFilter): Promise<Types.QueryWorkflowsQuery> {
    return this.queryAndCheckError<Types.QueryWorkflowsQuery, { filter?: Types.WorkflowFilter }>(
      Documents.QueryWorkflows,
      { filter: filter }
    );
  }

  public async createCategory(category: Types.CategoryInput): Promise<Types.CreateCategoryMutation> {
    return this.mutateAndCheckError<Types.CreateCategoryMutation, { category: Types.CategoryInput }>(
      Documents.CreateCategory,
      { category: category }
    );
  }

  public async updateCategory(category: Types.CategoryUpdateInput): Promise<Types.UpdateCategoryMutation> {
    return this.mutateAndCheckError<Types.UpdateCategoryMutation, { category: Types.CategoryUpdateInput }>(
      Documents.UpdateCategory,
      { category: category }
    );
  }

  public async deleteCategory(id: string): Promise<Types.DeleteCategoryMutation> {
    return this.mutateAndCheckError<Types.DeleteCategoryMutation, { id: string }>(
      Documents.DeleteCategory,
      { id: id }
    );
  }

  public async deleteCategories(): Promise<Types.DeleteCategoriesMutation> {
    return this.mutateAndCheckError<Types.DeleteCategoriesMutation>(
      Documents.DeleteCategories
    );
  }

  public async deleteAllCategories(): Promise<Types.DeleteAllCategoriesMutation> {
    return this.mutateAndCheckError<Types.DeleteAllCategoriesMutation>(
      Documents.DeleteAllCategories
    );
  }

  public async getCategory(id: string): Promise<Types.GetCategoryQuery> {
    return this.queryAndCheckError<Types.GetCategoryQuery, { id: string }>(
      Documents.GetCategory,
      { id: id }
    );
  }

  public async queryCategories(filter?: Types.CategoryFilter): Promise<Types.QueryCategoriesQuery> {
    return this.queryAndCheckError<Types.QueryCategoriesQuery, { filter?: Types.CategoryFilter }>(
      Documents.QueryCategories,
      { filter: filter }
    );
  }

  public async createLabel(label: Types.LabelInput): Promise<Types.CreateLabelMutation> {
    return this.mutateAndCheckError<Types.CreateLabelMutation, { label: Types.LabelInput }>(
      Documents.CreateLabel,
      { label: label }
    );
  }

  public async updateLabel(label: Types.LabelUpdateInput): Promise<Types.UpdateLabelMutation> {
    return this.mutateAndCheckError<Types.UpdateLabelMutation, { label: Types.LabelUpdateInput }>(
      Documents.UpdateLabel,
      { label: label }
    );
  }

  public async deleteLabel(id: string): Promise<Types.DeleteLabelMutation> {
    return this.mutateAndCheckError<Types.DeleteLabelMutation, { id: string }>(
      Documents.DeleteLabel,
      { id: id }
    );
  }

  public async deleteLabels(): Promise<Types.DeleteLabelsMutation> {
    return this.mutateAndCheckError<Types.DeleteLabelsMutation>(
      Documents.DeleteLabels
    );
  }

  public async deleteAllLabels(): Promise<Types.DeleteAllLabelsMutation> {
    return this.mutateAndCheckError<Types.DeleteAllLabelsMutation>(
      Documents.DeleteAllLabels
    );
  }

  public async getLabel(id: string): Promise<Types.GetLabelQuery> {
    return this.queryAndCheckError<Types.GetLabelQuery, { id: string }>(
      Documents.GetLabel,
      { id: id }
    );
  }

  public async queryLabels(filter?: Types.LabelFilter): Promise<Types.QueryLabelsQuery> {
    return this.queryAndCheckError<Types.QueryLabelsQuery, { filter?: Types.LabelFilter }>(
      Documents.QueryLabels,
      { filter: filter }
    );
  }

  public async createPerson(person: Types.PersonInput): Promise<Types.CreatePersonMutation> {
    return this.mutateAndCheckError<Types.CreatePersonMutation, { person: Types.PersonInput }>(
      Documents.CreatePerson,
      { person: person }
    );
  }

  public async updatePerson(person: Types.PersonUpdateInput): Promise<Types.UpdatePersonMutation> {
    return this.mutateAndCheckError<Types.UpdatePersonMutation, { person: Types.PersonUpdateInput }>(
      Documents.UpdatePerson,
      { person: person }
    );
  }

  public async deletePerson(id: string): Promise<Types.DeletePersonMutation> {
    return this.mutateAndCheckError<Types.DeletePersonMutation, { id: string }>(
      Documents.DeletePerson,
      { id: id }
    );
  }

  public async deletePersons(): Promise<Types.DeletePersonsMutation> {
    return this.mutateAndCheckError<Types.DeletePersonsMutation>(
      Documents.DeletePersons
    );
  }

  public async deleteAllPersons(): Promise<Types.DeleteAllPersonsMutation> {
    return this.mutateAndCheckError<Types.DeleteAllPersonsMutation>(
      Documents.DeleteAllPersons
    );
  }

  public async getPerson(id: string): Promise<Types.GetPersonQuery> {
    return this.queryAndCheckError<Types.GetPersonQuery, { id: string }>(
      Documents.GetPerson,
      { id: id }
    );
  }

  public async queryPersons(filter?: Types.PersonFilter): Promise<Types.QueryPersonsQuery> {
    return this.queryAndCheckError<Types.QueryPersonsQuery, { filter?: Types.PersonFilter }>(
      Documents.QueryPersons,
      { filter: filter }
    );
  }

  public async createOrganization(organization: Types.OrganizationInput): Promise<Types.CreateOrganizationMutation> {
    return this.mutateAndCheckError<Types.CreateOrganizationMutation, { organization: Types.OrganizationInput }>(
      Documents.CreateOrganization,
      { organization: organization }
    );
  }

  public async updateOrganization(organization: Types.OrganizationUpdateInput): Promise<Types.UpdateOrganizationMutation> {
    return this.mutateAndCheckError<Types.UpdateOrganizationMutation, { organization: Types.OrganizationUpdateInput }>(
      Documents.UpdateOrganization,
      { organization: organization }
    );
  }

  public async deleteOrganization(id: string): Promise<Types.DeleteOrganizationMutation> {
    return this.mutateAndCheckError<Types.DeleteOrganizationMutation, { id: string }>(
      Documents.DeleteOrganization,
      { id: id }
    );
  }

  public async deleteOrganizations(): Promise<Types.DeleteOrganizationsMutation> {
    return this.mutateAndCheckError<Types.DeleteOrganizationsMutation>(
      Documents.DeleteOrganizations
    );
  }

  public async deleteAllOrganizations(): Promise<Types.DeleteAllOrganizationsMutation> {
    return this.mutateAndCheckError<Types.DeleteAllOrganizationsMutation>(
      Documents.DeleteAllOrganizations
    );
  }

  public async getOrganization(id: string): Promise<Types.GetOrganizationQuery> {
    return this.queryAndCheckError<Types.GetOrganizationQuery, { id: string }>(
      Documents.GetOrganization,
      { id: id }
    );
  }

  public async queryOrganizations(filter?: Types.OrganizationFilter): Promise<Types.QueryOrganizationsQuery> {
    return this.queryAndCheckError<Types.QueryOrganizationsQuery, { filter?: Types.OrganizationFilter }>(
      Documents.QueryOrganizations,
      { filter: filter }
    );
  }

  public async createPlace(place: Types.PlaceInput): Promise<Types.CreatePlaceMutation> {
    return this.mutateAndCheckError<Types.CreatePlaceMutation, { place: Types.PlaceInput }>(
      Documents.CreatePlace,
      { place: place }
    );
  }

  public async updatePlace(place: Types.PlaceUpdateInput): Promise<Types.UpdatePlaceMutation> {
    return this.mutateAndCheckError<Types.UpdatePlaceMutation, { place: Types.PlaceUpdateInput }>(
      Documents.UpdatePlace,
      { place: place }
    );
  }

  public async deletePlace(id: string): Promise<Types.DeletePlaceMutation> {
    return this.mutateAndCheckError<Types.DeletePlaceMutation, { id: string }>(
      Documents.DeletePlace,
      { id: id }
    );
  }

  public async deletePlaces(): Promise<Types.DeletePlacesMutation> {
    return this.mutateAndCheckError<Types.DeletePlacesMutation>(
      Documents.DeletePlaces
    );
  }

  public async deleteAllPlaces(): Promise<Types.DeleteAllPlacesMutation> {
    return this.mutateAndCheckError<Types.DeleteAllPlacesMutation>(
      Documents.DeleteAllPlaces
    );
  }

  public async getPlace(id: string): Promise<Types.GetPlaceQuery> {
    return this.queryAndCheckError<Types.GetPlaceQuery, { id: string }>(
      Documents.GetPlace,
      { id: id }
    );
  }

  public async queryPlaces(filter?: Types.PlaceFilter): Promise<Types.QueryPlacesQuery> {
    return this.queryAndCheckError<Types.QueryPlacesQuery, { filter?: Types.PlaceFilter }>(
      Documents.QueryPlaces,
      { filter: filter }
    );
  }

  public async createEvent(event: Types.EventInput): Promise<Types.CreateEventMutation> {
    return this.mutateAndCheckError<Types.CreateEventMutation, { event: Types.EventInput }>(
      Documents.CreateEvent,
      { event: event }
    );
  }

  public async updateEvent(event: Types.EventUpdateInput): Promise<Types.UpdateEventMutation> {
    return this.mutateAndCheckError<Types.UpdateEventMutation, { event: Types.EventUpdateInput }>(
      Documents.UpdateEvent,
      { event: event }
    );
  }

  public async deleteEvent(id: string): Promise<Types.DeleteEventMutation> {
    return this.mutateAndCheckError<Types.DeleteEventMutation, { id: string }>(
      Documents.DeleteEvent,
      { id: id }
    );
  }

  public async deleteEvents(): Promise<Types.DeleteEventsMutation> {
    return this.mutateAndCheckError<Types.DeleteEventsMutation>(
      Documents.DeleteEvents
    );
  }

  public async deleteAllEvents(): Promise<Types.DeleteAllEventsMutation> {
    return this.mutateAndCheckError<Types.DeleteAllEventsMutation>(
      Documents.DeleteAllEvents
    );
  }

  public async getEvent(id: string): Promise<Types.GetEventQuery> {
    return this.queryAndCheckError<Types.GetEventQuery, { id: string }>(
      Documents.GetEvent,
      { id: id }
    );
  }

  public async queryEvents(filter?: Types.EventFilter): Promise<Types.QueryEventsQuery> {
    return this.queryAndCheckError<Types.QueryEventsQuery, { filter?: Types.EventFilter }>(
      Documents.QueryEvents,
      { filter: filter }
    );
  }

  public async createProduct(product: Types.ProductInput): Promise<Types.CreateProductMutation> {
    return this.mutateAndCheckError<Types.CreateProductMutation, { product: Types.ProductInput }>(
      Documents.CreateProduct,
      { product: product }
    );
  }

  public async updateProduct(product: Types.ProductUpdateInput): Promise<Types.UpdateProductMutation> {
    return this.mutateAndCheckError<Types.UpdateProductMutation, { product: Types.ProductUpdateInput }>(
      Documents.UpdateProduct,
      { product: product }
    );
  }

  public async deleteProduct(id: string): Promise<Types.DeleteProductMutation> {
    return this.mutateAndCheckError<Types.DeleteProductMutation, { id: string }>(
      Documents.DeleteProduct,
      { id: id }
    );
  }

  public async deleteProducts(): Promise<Types.DeleteProductsMutation> {
    return this.mutateAndCheckError<Types.DeleteProductsMutation>(
      Documents.DeleteProducts
    );
  }

  public async deleteAllProducts(): Promise<Types.DeleteAllProductsMutation> {
    return this.mutateAndCheckError<Types.DeleteAllProductsMutation>(
      Documents.DeleteAllProducts
    );
  }

  public async getProduct(id: string): Promise<Types.GetProductQuery> {
    return this.queryAndCheckError<Types.GetProductQuery, { id: string }>(
      Documents.GetProduct,
      { id: id }
    );
  }

  public async queryProducts(filter?: Types.ProductFilter): Promise<Types.QueryProductsQuery> {
    return this.queryAndCheckError<Types.QueryProductsQuery, { filter?: Types.ProductFilter }>(
      Documents.QueryProducts,
      { filter: filter }
    );
  }

  public async createRepo(repo: Types.RepoInput): Promise<Types.CreateRepoMutation> {
    return this.mutateAndCheckError<Types.CreateRepoMutation, { repo: Types.RepoInput }>(
      Documents.CreateRepo,
      { repo: repo }
    );
  }

  public async updateRepo(repo: Types.RepoUpdateInput): Promise<Types.UpdateRepoMutation> {
    return this.mutateAndCheckError<Types.UpdateRepoMutation, { repo: Types.RepoUpdateInput }>(
      Documents.UpdateRepo,
      { repo: repo }
    );
  }

  public async deleteRepo(id: string): Promise<Types.DeleteRepoMutation> {
    return this.mutateAndCheckError<Types.DeleteRepoMutation, { id: string }>(
      Documents.DeleteRepo,
      { id: id }
    );
  }

  public async deleteRepos(): Promise<Types.DeleteReposMutation> {
    return this.mutateAndCheckError<Types.DeleteReposMutation>(
      Documents.DeleteRepos
    );
  }

  public async deleteAllRepos(): Promise<Types.DeleteAllReposMutation> {
    return this.mutateAndCheckError<Types.DeleteAllReposMutation>(
      Documents.DeleteAllRepos
    );
  }

  public async getRepo(id: string): Promise<Types.GetRepoQuery> {
    return this.queryAndCheckError<Types.GetRepoQuery, { id: string }>(
      Documents.GetRepo,
      { id: id }
    );
  }

  public async queryRepos(filter?: Types.RepoFilter): Promise<Types.QueryReposQuery> {
    return this.queryAndCheckError<Types.QueryReposQuery, { filter?: Types.RepoFilter }>(
      Documents.QueryRepos,
      { filter: filter }
    );
  }

  public async createSoftware(software: Types.SoftwareInput): Promise<Types.CreateSoftwareMutation> {
    return this.mutateAndCheckError<Types.CreateSoftwareMutation, { software: Types.SoftwareInput }>(
      Documents.CreateSoftware,
      { software: software }
    );
  }

  public async updateSoftware(software: Types.SoftwareUpdateInput): Promise<Types.UpdateSoftwareMutation> {
    return this.mutateAndCheckError<Types.UpdateSoftwareMutation, { software: Types.SoftwareUpdateInput }>(
      Documents.UpdateSoftware,
      { software: software }
    );
  }

  public async deleteSoftware(id: string): Promise<Types.DeleteSoftwareMutation> {
    return this.mutateAndCheckError<Types.DeleteSoftwareMutation, { id: string }>(
      Documents.DeleteSoftware,
      { id: id }
    );
  }

  public async deleteSoftwares(): Promise<Types.DeleteSoftwaresMutation> {
    return this.mutateAndCheckError<Types.DeleteSoftwaresMutation>(
      Documents.DeleteSoftwares
    );
  }

  public async deleteAllSoftwares(): Promise<Types.DeleteAllSoftwaresMutation> {
    return this.mutateAndCheckError<Types.DeleteAllSoftwaresMutation>(
      Documents.DeleteAllSoftwares
    );
  }

  public async getSoftware(id: string): Promise<Types.GetSoftwareQuery> {
    return this.queryAndCheckError<Types.GetSoftwareQuery, { id: string }>(
      Documents.GetSoftware,
      { id: id }
    );
  }

  public async querySoftwares(filter?: Types.SoftwareFilter): Promise<Types.QuerySoftwaresQuery> {
    return this.queryAndCheckError<Types.QuerySoftwaresQuery, { filter?: Types.SoftwareFilter }>(
      Documents.QuerySoftwares,
      { filter: filter }
    );
  }

  public async createObservation(observation: Types.ObservationInput): Promise<Types.CreateObservationMutation> {
    return this.mutateAndCheckError<Types.CreateObservationMutation, { observation: Types.ObservationInput }>(
      Documents.CreateObservation,
      { observation: observation }
    );
  }

  public async updateObservation(observation: Types.ObservationUpdateInput): Promise<Types.UpdateObservationMutation> {
    return this.mutateAndCheckError<Types.UpdateObservationMutation, { observation: Types.ObservationUpdateInput }>(
      Documents.UpdateObservation,
      { observation: observation }
    );
  }

  public async deleteObservation(id: string): Promise<Types.DeleteObservationMutation> {
    return this.mutateAndCheckError<Types.DeleteObservationMutation, { id: string }>(
      Documents.DeleteObservation,
      { id: id }
    );
  }

  // helper functions
  private async mutateAndCheckError<TData, TVariables extends OperationVariables = OperationVariables>(
    mutation: DocumentNode,
    variables?: TVariables
  ): Promise<TData> {
    if (this.client === undefined)
      throw new Error("Apollo Client not configured.");

    try {
      const result: FetchResult<TData> = await this.client.mutate<TData, TVariables>({
        mutation,
        variables: variables || {} as TVariables
      });

      if (result.errors) {
        const errorMessage = result.errors.map(err => err.message).join("\n");
        throw new Error(errorMessage);
      }

      if (!result.data) {
        throw new Error('No data returned from mutation.');
      }

      return result.data;
    } catch (error) {
      if (error instanceof ApolloError && error.graphQLErrors.length > 0) {
        const errorMessage = error.graphQLErrors.map(err => err.message).join("\n");
        console.error(errorMessage);
        throw new Error(errorMessage);
      } if (error instanceof Error) {
        console.error(error.message);
        throw error;
      }
      else {
        throw error;
      }
    }
  }

  private async queryAndCheckError<TData, TVariables extends OperationVariables = OperationVariables>(
    query: DocumentNode,
    variables?: TVariables
  ): Promise<TData> {
    if (this.client === undefined)
      throw new Error("Apollo Client not configured.");

    try {
      const result: ApolloQueryResult<TData> = await this.client.query<TData, TVariables>({
        query,
        variables: variables || {} as TVariables
      });

      if (result.errors) {
        const errorMessage = result.errors.map(err => err.message).join("\n");
        throw new Error(errorMessage);
      }

      if (!result.data) {
        throw new Error('No data returned from query.');
      }

      return result.data;
    } catch (error: unknown) {
      if (error instanceof ApolloError && error.graphQLErrors.length > 0) {
        const errorMessage = error.graphQLErrors.map(err => err.message).join("\n");
        console.error(errorMessage);
        throw new Error(errorMessage);
      } if (error instanceof Error) {
        console.error(error.message);
        throw error;
      }
      else {
        throw error;
      }
    }
  }
}

export { Graphlit };
export * as Types from './generated/graphql-types';

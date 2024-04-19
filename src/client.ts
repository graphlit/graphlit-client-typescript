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
  public correlationId: string | undefined;

  private apiUri: string;
  private organizationId: string | undefined;
  private environmentId: string | undefined;
  private ownerId: string | undefined;
  private jwtSecret: string | undefined;

  constructor(organizationId?: string, environmentId?: string, jwtSecret?: string, ownerId?: string, apiUri?: string, correlationId?: string) {
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

    // optional: for billing correlation of multiple operations
    this.correlationId = correlationId || undefined

    if (!this.organizationId) {
      throw new Error("Graphlit organization identifier is required.");
    }

    if (!this.environmentId) {
      throw new Error("Graphlit environment identifier is required.");
    }

    if (!this.jwtSecret) {
      throw new Error("Graphlit environment JWT secret is required.");
    }

    const expiration = Math.floor(Date.now() / 1000) + (60 * 60); // one hour from now

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

  public async createAlert(alert: Types.AlertInput): Promise<Types.CreateAlertMutation> {
    return this.mutateAndCheckError<Types.CreateAlertMutation, { alert: Types.AlertInput, correlationId?: string }>(
      Documents.CreateAlert,
      { alert: alert, correlationId: this.correlationId }
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

  public async createCollection(Collection: Types.CollectionInput): Promise<Types.CreateCollectionMutation> {
    return this.mutateAndCheckError<Types.CreateCollectionMutation, { Collection: Types.CollectionInput }>(
      Documents.CreateCollection,
      { Collection: Collection }
    );
  }

  public async updateCollection(Collection: Types.CollectionUpdateInput): Promise<Types.UpdateCollectionMutation> {
    return this.mutateAndCheckError<Types.UpdateCollectionMutation, { Collection: Types.CollectionUpdateInput }>(
      Documents.UpdateCollection,
      { Collection: Collection }
    );
  }

  public async deleteCollection(id: string): Promise<Types.DeleteCollectionMutation> {
    return this.mutateAndCheckError<Types.DeleteCollectionMutation, { id: string }>(
      Documents.DeleteCollection,
      { id: id }
    );
  }

  /*
  public async deleteAllCollections(): Promise<Types.DeleteAllCollectionsMutation> {
    return this.mutateAndCheckError<Types.DeleteAllCollectionsMutation>(
      Documents.DeleteAllCollections
    );
  }
  */

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

  public async ingestUri(uri: string, name?: string, id?: string, isSynchronous?: boolean, workflow?: Types.EntityReferenceInput): Promise<Types.IngestUriMutation> {
    return this.mutateAndCheckError<Types.IngestUriMutation, { uri: string, name?: string, id?: string, isSynchronous?: boolean, workflow?: Types.EntityReferenceInput, correlationId?: string }>(
      Documents.IngestUri,
      { uri: uri, name: name, id: id, isSynchronous: isSynchronous, workflow: workflow, correlationId: this.correlationId }
    );
  }

  public async ingestText(name: string, text: string, textType?: Types.TextTypes, uri?: string, id?: string, isSynchronous?: boolean, workflow?: Types.EntityReferenceInput): Promise<Types.IngestTextMutation> {
    return this.mutateAndCheckError<Types.IngestTextMutation, { name: string, text: string, textType?: Types.TextTypes, uri?: string, id?: string, isSynchronous?: boolean, workflow?: Types.EntityReferenceInput, correlationId?: string }>(
      Documents.IngestText,
      { name: name, text: text, textType: textType, uri: uri, id: id, isSynchronous: isSynchronous, workflow: workflow, correlationId: this.correlationId }
    );
  }

  public async ingestEncodedFile(name: string, data: string, mimeType: string, id?: string, isSynchronous?: boolean, workflow?: Types.EntityReferenceInput): Promise<Types.IngestEncodedFileMutation> {
    return this.mutateAndCheckError<Types.IngestEncodedFileMutation, { name: string, data: string, mimeType: string, id?: string, isSynchronous?: boolean, workflow?: Types.EntityReferenceInput, correlationId?: string }>(
      Documents.IngestEncodedFile,
      { name: name, data: data, mimeType: mimeType, id: id, isSynchronous: isSynchronous, workflow: workflow, correlationId: this.correlationId }
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

  public async deleteAllContents(): Promise<Types.DeleteAllContentsMutation> {
    return this.mutateAndCheckError<Types.DeleteAllContentsMutation>(
      Documents.DeleteAllContents
    );
  }

  public async summarizeContents(summarizations: [Types.SummarizationStrategyInput], filter?: Types.ContentFilter): Promise<Types.SummarizeContentsMutation> {
    return this.mutateAndCheckError<Types.SummarizeContentsMutation, { summarizations: [Types.SummarizationStrategyInput], filter?: Types.ContentFilter, correlationId?: string }>(
      Documents.SummarizeContents,
      { summarizations: summarizations, filter: filter, correlationId: this.correlationId }
    );
  }

  public async extractContents(prompt: string, filter?: Types.ContentFilter, specification?: Types.EntityReferenceInput): Promise<Types.ExtractContentsMutation> {
    return this.mutateAndCheckError<Types.ExtractContentsMutation, { prompt: string, filter?: Types.ContentFilter, specification?: Types.EntityReferenceInput, correlationId?: string }>(
      Documents.ExtractContents,
      { prompt: prompt, filter: filter, specification: specification, correlationId: this.correlationId }
    );
  }

  public async publishContents(summaryPrompt: string, summarySpecification: Types.EntityReferenceInput, connector: Types.ContentPublishingConnectorInput,
    publishPrompt?: string, publishSpecification?: Types.EntityReferenceInput,
    name?: string, filter?: Types.ContentFilter, workflow?: Types.EntityReferenceInput): Promise<Types.PublishContentsMutation> {
    return this.mutateAndCheckError<Types.PublishContentsMutation, {
      summaryPrompt: string, summarySpecification: Types.EntityReferenceInput, connector: Types.ContentPublishingConnectorInput, publishPrompt?: string, publishSpecification?: Types.EntityReferenceInput,
      name?: string, filter?: Types.ContentFilter, workflow?: Types.EntityReferenceInput, correlationId?: string
    }>(
      Documents.PublishContents,
      { summaryPrompt: summaryPrompt, summarySpecification: summarySpecification, connector: connector, publishPrompt: publishPrompt, publishSpecification: publishSpecification, name: name, filter: filter, workflow: workflow, correlationId: this.correlationId }
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

  public async createConversation(conversation: Types.ConversationInput): Promise<Types.CreateConversationMutation> {
    return this.mutateAndCheckError<Types.CreateConversationMutation, { conversation: Types.ConversationInput, correlationId?: string }>(
      Documents.CreateConversation,
      { conversation: conversation, correlationId: this.correlationId }
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

  public async promptConversation(prompt: string, id?: string): Promise<Types.PromptConversationMutation> {
    return this.mutateAndCheckError<Types.PromptConversationMutation, { prompt: string, id?: string, correlationId?: string }>(
      Documents.PromptConversation,
      { prompt: prompt, id: id, correlationId: this.correlationId }
    );
  }

  public async publishConversation(id: string, connector: Types.ContentPublishingConnectorInput, name?: string, workflow?: Types.EntityReferenceInput): Promise<Types.PublishConversationMutation> {
    return this.mutateAndCheckError<Types.PublishConversationMutation, { id: string, connector: Types.ContentPublishingConnectorInput, name?: string, workflow?: Types.EntityReferenceInput, correlationId?: string }>(
      Documents.PublishConversation,
      { id: id, connector: connector, name: name, workflow: workflow, correlationId: this.correlationId }
    );
  }

  public async suggestConversation(id: string, count?: number): Promise<Types.SuggestConversationMutation> {
    return this.mutateAndCheckError<Types.SuggestConversationMutation, { id: string, count?: number, correlationId?: string }>(
      Documents.SuggestConversation,
      { id: id, count: count, correlationId: this.correlationId }
    );
  }

  public async createFeed(feed: Types.FeedInput): Promise<Types.CreateFeedMutation> {
    return this.mutateAndCheckError<Types.CreateFeedMutation, { feed: Types.FeedInput, correlationId?: string }>(
      Documents.CreateFeed,
      { feed: feed, correlationId: this.correlationId }
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

  // TODO: project credits, usage, etc.

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

  /*
  public async deleteAllSpecifications(): Promise<Types.DeleteAllSpecificationsMutation> {
    return this.mutateAndCheckError<Types.DeleteAllSpecificationsMutation>(
      Documents.DeleteAllSpecifications
    );
  }
  */

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
        throw new Error(errorMessage);
      } else {
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
        throw new Error('No data returned from query');
      }

      return result.data;
    } catch (error) {
      if (error instanceof ApolloError && error.graphQLErrors.length > 0) {
        const errorMessage = error.graphQLErrors.map(err => err.message).join("\n");
        throw new Error(errorMessage);
      } else {
        throw error;
      }
    }
  }
}

export { Graphlit };
export * as Types from './generated/graphql-types';

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
  private correlationId: string | undefined;

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

    if (!this.jwtSecret) {
      throw new Error("JWT secret is required.");
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
    });
  }

  public async createAlert(alert: Types.AlertInput): Promise<Types.Alert> {
    return this.mutateAndCheckError<Types.Alert, { alert: Types.AlertInput, correlationId?: string }>(
      Documents.CreateAlert,
      { alert: alert, correlationId: this.correlationId }
    );
  }

  public async updateAlert(alert: Types.AlertUpdateInput): Promise<Types.Alert> {
    return this.mutateAndCheckError<Types.Alert, { alert: Types.AlertUpdateInput }>(
      Documents.UpdateAlert,
      { alert: alert }
    );
  }

  public async deleteAlert(id: string): Promise<Types.Alert> {
    return this.mutateAndCheckError<Types.Alert, { id: string }>(
      Documents.DeleteAlert,
      { id: id }
    );
  }

  public async deleteAllAlerts(): Promise<void> {
    return this.mutateAndCheckError<void>(
      Documents.DeleteAllAlerts
    );
  }

  public async enableAlert(id: string): Promise<Types.Alert> {
    return this.mutateAndCheckError<Types.Alert, { id: string }>(
      Documents.EnableAlert,
      { id: id }
    );
  }

  public async disableAlert(id: string): Promise<Types.Alert> {
    return this.mutateAndCheckError<Types.Alert, { id: string }>(
      Documents.DisableAlert,
      { id: id }
    );
  }

  public async getAlert(id: string): Promise<Types.Alert> {
    return this.queryAndCheckError<Types.Alert, { id: string }>(
      Documents.GetAlert,
      { id: id }
    );
  }

  public async queryAlerts(filter: Types.AlertFilter): Promise<Types.AlertResults> {
    return this.queryAndCheckError<Types.AlertResults, { filter: Types.AlertFilter }>(
      Documents.QueryAlerts,
      { filter: filter }
    );
  }

  public async createCollection(Collection: Types.CollectionInput): Promise<Types.Collection> {
    return this.mutateAndCheckError<Types.Collection, { Collection: Types.CollectionInput }>(
      Documents.CreateCollection,
      { Collection: Collection }
    );
  }

  public async updateCollection(Collection: Types.CollectionUpdateInput): Promise<Types.Collection> {
    return this.mutateAndCheckError<Types.Collection, { Collection: Types.CollectionUpdateInput }>(
      Documents.UpdateCollection,
      { Collection: Collection }
    );
  }

  public async deleteCollection(id: string): Promise<Types.Collection> {
    return this.mutateAndCheckError<Types.Collection, { id: string }>(
      Documents.DeleteCollection,
      { id: id }
    );
  }

  /*
  public async deleteAllCollections(): Promise<void> {
    return this.mutateAndCheckError<void>(
      Documents.DeleteAllCollections
    );
  }
  */

  public async addContentsToCollections(contents: Types.EntityReferenceInput[], collections: Types.EntityReferenceInput[]): Promise<Types.Collection[]> {
    return this.mutateAndCheckError<Types.Collection[], { contents: Types.EntityReferenceInput[], collections: Types.EntityReferenceInput[] }>(
      Documents.AddContentsToCollections,
      { contents: contents, collections: collections }
    );
  }

  public async removeContentsFromCollection(contents: Types.EntityReferenceInput[], collection: Types.EntityReferenceInput): Promise<Types.Collection> {
    return this.mutateAndCheckError<Types.Collection, { contents: Types.EntityReferenceInput[], collection: Types.EntityReferenceInput }>(
      Documents.RemoveContentsFromCollection,
      { contents: contents, collection: collection }
    );
  }

  public async getCollection(id: string): Promise<Types.Collection> {
    return this.queryAndCheckError<Types.Collection, { id: string }>(
      Documents.GetCollection,
      { id: id }
    );
  }

  public async queryCollections(filter: Types.CollectionFilter): Promise<Types.CollectionResults> {
    return this.queryAndCheckError<Types.CollectionResults, { filter: Types.CollectionFilter }>(
      Documents.QueryCollections,
      { filter: filter }
    );
  }

  public async ingestUri(uri: string, name?: string, id?: string, isSynchronous?: boolean, workflow?: Types.EntityReferenceInput): Promise<Types.Content> {
    return this.mutateAndCheckError<Types.Content, { uri: string, name?: string, id?: string, isSynchronous?: boolean, workflow?: Types.EntityReferenceInput, correlationId?: string }>(
      Documents.IngestUri,
      { uri: uri, name: name, id: id, isSynchronous: isSynchronous, workflow: workflow, correlationId: this.correlationId }
    );
  }

  public async ingestText(name: string, text: string, textType?: Types.TextTypes, uri?: string, id?: string, isSynchronous?: boolean, workflow?: Types.EntityReferenceInput): Promise<Types.Content> {
    return this.mutateAndCheckError<Types.Content, { name: string, text: string, textType?: Types.TextTypes, uri?: string, id?: string, isSynchronous?: boolean, workflow?: Types.EntityReferenceInput, correlationId?: string }>(
      Documents.IngestText,
      { name: name, text: text, textType: textType, uri: uri, id: id, isSynchronous: isSynchronous, workflow: workflow, correlationId: this.correlationId }
    );
  }

  public async ingestEncodedFile(name: string, data: string, mimeType: string, id?: string, isSynchronous?: boolean, workflow?: Types.EntityReferenceInput): Promise<Types.Content> {
    return this.mutateAndCheckError<Types.Content, { name: string, data: string, mimeType: string, id?: string, isSynchronous?: boolean, workflow?: Types.EntityReferenceInput, correlationId?: string }>(
      Documents.IngestEncodedFile,
      { name: name, data: data, mimeType: mimeType, id: id, isSynchronous: isSynchronous, workflow: workflow, correlationId: this.correlationId }
    );
  }

  public async updateContent(content: Types.ContentUpdateInput): Promise<Types.Content> {
    return this.mutateAndCheckError<Types.Content, { content: Types.ContentUpdateInput }>(
      Documents.UpdateContent,
      { content: content }
    );
  }

  public async deleteContent(id: string): Promise<Types.Content> {
    return this.mutateAndCheckError<Types.Content, { id: string }>(
      Documents.DeleteContent,
      { id: id }
    );
  }

  public async deleteAllContents(): Promise<void> {
    return this.mutateAndCheckError<void>(
      Documents.DeleteAllContents
    );
  }

  public async summarizeContents(summarizations: [Types.SummarizationStrategyInput], filter?: Types.ContentFilter): Promise<Types.PromptSummarization[]> {
    return this.mutateAndCheckError<Types.PromptSummarization[], { summarizations: [Types.SummarizationStrategyInput], filter?: Types.ContentFilter, correlationId?: string }>(
      Documents.SummarizeContents,
      { summarizations: summarizations, filter: filter, correlationId: this.correlationId }
    );
  }

  public async extractContents(prompt: string, filter?: Types.ContentFilter, specification?: Types.EntityReferenceInput): Promise<Types.ExtractCompletion[]> {
    return this.mutateAndCheckError<Types.ExtractCompletion[], { prompt: string, filter?: Types.ContentFilter, specification?: Types.EntityReferenceInput, correlationId?: string }>(
      Documents.ExtractContents,
      { prompt: prompt, filter: filter, specification: specification, correlationId: this.correlationId }
    );
  }

  public async publishContents(summaryPrompt: string, summarySpecification: Types.EntityReferenceInput, connector: Types.ContentPublishingConnectorInput,
    publishPrompt?: string, publishSpecification?: Types.EntityReferenceInput,
    name?: string, filter?: Types.ContentFilter, workflow?: Types.EntityReferenceInput): Promise<Types.Content> {
    return this.mutateAndCheckError<Types.Content, {
      summaryPrompt: string, summarySpecification: Types.EntityReferenceInput, connector: Types.ContentPublishingConnectorInput, publishPrompt?: string, publishSpecification?: Types.EntityReferenceInput,
      name?: string, filter?: Types.ContentFilter, workflow?: Types.EntityReferenceInput, correlationId?: string
    }>(
      Documents.PublishContents,
      { summaryPrompt: summaryPrompt, summarySpecification: summarySpecification, connector: connector, publishPrompt: publishPrompt, publishSpecification: publishSpecification, name: name, filter: filter, workflow: workflow, correlationId: this.correlationId }
    );
  }

  public async getContent(id: string): Promise<Types.Content> {
    return this.queryAndCheckError<Types.Content, { id: string }>(
      Documents.GetContent,
      { id: id }
    );
  }

  public async queryContents(filter: Types.ContentFilter): Promise<Types.ContentResults> {
    return this.queryAndCheckError<Types.ContentResults, { filter: Types.ContentFilter }>(
      Documents.QueryContents,
      { filter: filter }
    );
  }

  public async createConversation(conversation: Types.ConversationInput): Promise<Types.Conversation> {
    return this.mutateAndCheckError<Types.Conversation, { conversation: Types.ConversationInput, correlationId?: string }>(
      Documents.CreateConversation,
      { conversation: conversation, correlationId: this.correlationId }
    );
  }

  public async updateConversation(conversation: Types.ConversationUpdateInput): Promise<Types.Conversation> {
    return this.mutateAndCheckError<Types.Conversation, { conversation: Types.ConversationUpdateInput }>(
      Documents.UpdateConversation,
      { conversation: conversation }
    );
  }

  public async deleteConversation(id: string): Promise<Types.Conversation> {
    return this.mutateAndCheckError<Types.Conversation, { id: string }>(
      Documents.DeleteConversation,
      { id: id }
    );
  }

  public async deleteAllConversations(): Promise<void> {
    return this.mutateAndCheckError<void>(
      Documents.DeleteAllConversations
    );
  }

  public async clearConversation(id: string): Promise<Types.Conversation> {
    return this.mutateAndCheckError<Types.Conversation, { id: string }>(
      Documents.ClearConversation,
      { id: id }
    );
  }

  public async closeConversation(id: string): Promise<Types.Conversation> {
    return this.mutateAndCheckError<Types.Conversation, { id: string }>(
      Documents.CloseConversation,
      { id: id }
    );
  }

  public async getConversation(id: string): Promise<Types.Conversation> {
    return this.queryAndCheckError<Types.Conversation, { id: string }>(
      Documents.GetConversation,
      { id: id }
    );
  }

  public async queryConversations(filter: Types.ConversationFilter): Promise<Types.ConversationResults> {
    return this.queryAndCheckError<Types.ConversationResults, { filter: Types.ConversationFilter }>(
      Documents.QueryConversations,
      { filter: filter }
    );
  }

  public async promptConversation(prompt: string, id?: string): Promise<Types.PromptConversation> {
    return this.mutateAndCheckError<Types.PromptConversation, { prompt: string, id?: string, correlationId?: string }>(
      Documents.PromptConversation,
      { prompt: prompt, id: id, correlationId: this.correlationId }
    );
  }

  public async publishConversation(id: string, connector: Types.ContentPublishingConnectorInput, name?: string, workflow?: Types.EntityReferenceInput): Promise<Types.Content> {
    return this.mutateAndCheckError<Types.Content, { id: string, connector: Types.ContentPublishingConnectorInput, name?: string, workflow?: Types.EntityReferenceInput, correlationId?: string }>(
      Documents.PublishConversation,
      { id: id, connector: connector, name: name, workflow: workflow, correlationId: this.correlationId }
    );
  }

  public async suggestConversation(id: string, count?: number): Promise<Types.PromptSuggestion> {
    return this.mutateAndCheckError<Types.PromptSuggestion, { id: string, count?: number, correlationId?: string }>(
      Documents.SuggestConversation,
      { id: id, count: count, correlationId: this.correlationId }
    );
  }

  public async createFeed(feed: Types.FeedInput): Promise<Types.Feed> {
    return this.mutateAndCheckError<Types.Feed, { feed: Types.FeedInput, correlationId?: string }>(
      Documents.CreateFeed,
      { feed: feed, correlationId: this.correlationId }
    );
  }

  public async updateFeed(feed: Types.FeedUpdateInput): Promise<Types.Feed> {
    return this.mutateAndCheckError<Types.Feed, { feed: Types.FeedUpdateInput }>(
      Documents.UpdateFeed,
      { feed: feed }
    );
  }

  public async deleteFeed(id: string): Promise<Types.Feed> {
    return this.mutateAndCheckError<Types.Feed, { id: string }>(
      Documents.DeleteFeed,
      { id: id }
    );
  }

  public async deleteAllFeeds(): Promise<void> {
    return this.mutateAndCheckError<void>(
      Documents.DeleteAllFeeds
    );
  }

  public async enableFeed(id: string): Promise<Types.Feed> {
    return this.mutateAndCheckError<Types.Feed, { id: string }>(
      Documents.EnableFeed,
      { id: id }
    );
  }

  public async disableFeed(id: string): Promise<Types.Feed> {
    return this.mutateAndCheckError<Types.Feed, { id: string }>(
      Documents.DisableFeed,
      { id: id }
    );
  }

  public async getFeed(id: string): Promise<Types.Feed> {
    return this.queryAndCheckError<Types.Feed, { id: string }>(
      Documents.GetFeed,
      { id: id }
    );
  }

  public async queryFeeds(filter: Types.FeedFilter): Promise<Types.FeedResults> {
    return this.queryAndCheckError<Types.FeedResults, { filter: Types.FeedFilter }>(
      Documents.QueryFeeds,
      { filter: filter }
    );
  }

  // TODO: project credits, usage, etc.

  public async promptSpecifications(prompt: string, ids: [string]): Promise<Types.PromptCompletion[]> {
    return this.mutateAndCheckError<Types.PromptCompletion[], { prompt: string, ids: [string] }>(
      Documents.PromptSpecifications,
      { prompt: prompt, ids: ids }
    );
  }

  public async createSpecification(specification: Types.SpecificationInput): Promise<Types.Specification> {
    return this.mutateAndCheckError<Types.Specification, { specification: Types.SpecificationInput }>(
      Documents.CreateSpecification,
      { specification: specification }
    );
  }

  public async updateSpecification(specification: Types.SpecificationUpdateInput): Promise<Types.Specification> {
    return this.mutateAndCheckError<Types.Specification, { specification: Types.SpecificationUpdateInput }>(
      Documents.UpdateSpecification,
      { specification: specification }
    );
  }

  public async deleteSpecification(id: string): Promise<Types.Specification> {
    return this.mutateAndCheckError<Types.Specification, { id: string }>(
      Documents.DeleteSpecification,
      { id: id }
    );
  }

  /*
  public async deleteAllSpecifications(): Promise<void> {
    return this.mutateAndCheckError<void>(
      Documents.DeleteAllSpecifications
    );
  }
  */

  public async getSpecification(id: string): Promise<Types.Specification> {
    return this.queryAndCheckError<Types.Specification, { id: string }>(
      Documents.GetSpecification,
      { id: id }
    );
  }

  public async querySpecifications(filter: Types.SpecificationFilter): Promise<Types.SpecificationResults> {
    return this.queryAndCheckError<Types.SpecificationResults, { filter: Types.SpecificationFilter }>(
      Documents.QuerySpecifications,
      { filter: filter }
    );
  }

  public async createWorkflow(workflow: Types.WorkflowInput): Promise<Types.Workflow> {
    return this.mutateAndCheckError<Types.Workflow, { workflow: Types.WorkflowInput }>(
      Documents.CreateWorkflow,
      { workflow: workflow }
    );
  }

  public async updateWorkflow(workflow: Types.WorkflowUpdateInput): Promise<Types.Workflow> {
    return this.mutateAndCheckError<Types.Workflow, { workflow: Types.WorkflowUpdateInput }>(
      Documents.UpdateWorkflow,
      { workflow: workflow }
    );
  }

  public async deleteWorkflow(id: string): Promise<Types.Workflow> {
    return this.mutateAndCheckError<Types.Workflow, { id: string }>(
      Documents.DeleteWorkflow,
      { id: id }
    );
  }

  public async deleteAllWorkflows(): Promise<void> {
    return this.mutateAndCheckError<void>(
      Documents.DeleteAllWorkflows
    );
  }

  public async getWorkflow(id: string): Promise<Types.Workflow> {
    return this.queryAndCheckError<Types.Workflow, { id: string }>(
      Documents.GetWorkflow,
      { id: id }
    );
  }

  public async queryWorkflows(filter: Types.WorkflowFilter): Promise<Types.WorkflowResults> {
    return this.queryAndCheckError<Types.WorkflowResults, { filter: Types.WorkflowFilter }>(
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

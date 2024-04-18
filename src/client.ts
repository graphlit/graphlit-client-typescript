import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink, NormalizedCacheObject } from '@apollo/client';
import * as Types from './generated/graphql-types';
import * as Documents from './generated/graphql-documents';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

// Initialize dotenv to use environment variables
dotenv.config();

// Define the Graphlit class
class Graphlit {
  public client: ApolloClient<NormalizedCacheObject>;

  private apiUri: string;
  private environmentId: string | undefined;
  private organizationId: string | undefined;
  private ownerId: string | undefined;
  private jwtSecret: string | undefined;
  private correlationId: string | undefined;
  private token: string;

  constructor(organizationId?: string, environmentId?: string, jwtSecret?: string, ownerId?: string, apiUri?: string, correlationId?: string) {
    this.apiUri = apiUri || "https://data-scus.graphlit.io/api/v1";

    this.organizationId = organizationId || process.env.GRAPHLIT_ORGANIZATION_ID;
    this.environmentId = environmentId || process.env.GRAPHLIT_ENVIRONMENT_ID;
    this.jwtSecret = jwtSecret || process.env.GRAPHLIT_JWT_SECRET;

    // optional: for multi-tenant support
    this.ownerId = ownerId || process.env.GRAPHLIT_OWNER_ID;

    // optional: for billing correlation of multiple operations
    this.correlationId = correlationId || undefined

    // Set token expiration to one hour from now
    const expiration = Math.floor(Date.now() / 1000) + (60 * 60);

    const payload: any = {
      "https://graphlit.io/jwt/claims": {
        "x-graphlit-environment-id": this.environmentId,
        "x-graphlit-organization-id": this.organizationId,
        ...(this.ownerId && { "x-graphlit-owner-id": this.ownerId }),
        "x-graphlit-role": "Owner",
      },
      exp: expiration,
      iss: "graphlit",
      aud: "https://portal.graphlit.io",
    };

    if (!this.jwtSecret) {
      throw new Error("JWT secret is required.");
    }

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

  public async createAlert(alert: Types.AlertInput) {
    return this.mutateAndCheckError(Documents.CreateAlert, { alert: alert, correlationId: this.correlationId });
  }

  public async updateAlert(alert: Types.AlertUpdateInput) {
    return this.mutateAndCheckError(Documents.UpdateAlert, { alert: alert });
  }

  public async deleteAlert(id: string) {
    return this.mutateAndCheckError(Documents.DeleteAlert, { id: id });
  }

  public async deleteAllAlerts() {
    return this.mutateAndCheckError(Documents.DeleteAllAlerts);
  }

  public async enableAlert(id: string) {
    return this.mutateAndCheckError(Documents.EnableAlert, { id: id });
  }

  public async disableAlert(id: string) {
    return this.mutateAndCheckError(Documents.DisableAlert, { id: id });
  }

  public async getAlert(id: string) {
    return this.queryAndCheckError(Documents.GetAlert, { id: id });
  }

  public async queryAlerts(filter: Types.AlertFilter) {
    return this.queryAndCheckError(Documents.QueryAlerts, { filter: filter });
  }

  public async createCollection(collection: Types.CollectionInput) {
    return this.mutateAndCheckError(Documents.CreateCollection, { collection: collection });
  }

  public async updateCollection(collection: Types.CollectionUpdateInput) {
    return this.mutateAndCheckError(Documents.UpdateCollection, { collection: collection });
  }

  public async deleteCollection(id: string) {
    return this.mutateAndCheckError(Documents.DeleteCollection, { id: id });
  }

  /*
  public async deleteAllCollections() {
    return this.mutateAndCheckError(Documents.DeleteAllCollections);
  }
  */

  public async addContentsToCollections(contents: Types.EntityReferenceInput[], collections: Types.EntityReferenceInput[]) {
    return this.mutateAndCheckError(Documents.AddContentsToCollections, { contents: contents, collections: collections });
  }

  public async removeContentsFromCollection(contents: Types.EntityReferenceInput[], collection: Types.EntityReferenceInput) {
    return this.mutateAndCheckError(Documents.RemoveContentsFromCollection, { contents: contents, collection: collection });
  }

  public async getCollection(id: string) {
    return this.queryAndCheckError(Documents.GetCollection, { id: id });
  }

  public async queryCollections(filter: Types.CollectionFilter) {
    return this.queryAndCheckError(Documents.QueryCollections, { filter: filter });
  }

  public async ingestUri(uri: string, name?: string, id?: string, isSynchronous?: boolean, workflow?: Types.EntityReferenceInput) {
    return this.mutateAndCheckError(Documents.IngestUri, { uri: uri, name: name, id: id, isSynchronous: isSynchronous, workflow: workflow, correlationId: this.correlationId });
  }

  public async ingestText(name: string, text: string, textType?: Types.TextTypes, uri?: string, id?: string, isSynchronous?: boolean, workflow?: Types.EntityReferenceInput) {
    return this.mutateAndCheckError(Documents.IngestText, { name: name, text: text, textType: textType, uri: uri, id: id, isSynchronous: isSynchronous, workflow: workflow, correlationId: this.correlationId });
  }

  public async ingestEncodedFile(name: string, data: string, mimeType: string, id?: string, isSynchronous?: boolean, workflow?: Types.EntityReferenceInput) {
    return this.mutateAndCheckError(Documents.IngestEncodedFile, { name: name, data: data, mimeType: mimeType, id: id, isSynchronous: isSynchronous, workflow: workflow, correlationId: this.correlationId });
  }

  public async updateContent(content: Types.ContentUpdateInput) {
    return this.mutateAndCheckError(Documents.UpdateContent, { content: content });
  }

  public async deleteContent(id: string) {
    return this.mutateAndCheckError(Documents.DeleteContent, { id: id });
  }

  public async deleteAllContents() {
    return this.mutateAndCheckError(Documents.DeleteAllContents);
  }

  public async summarizeContents(summarizations: [Types.SummarizationStrategyInput], filter?: Types.ContentFilter) {
    return this.mutateAndCheckError(Documents.SummarizeContents, { summarizations: summarizations, filter: filter, correlationId: this.correlationId });
  }

  public async extractContents(prompt: string, filter?: Types.ContentFilter, specification?: Types.EntityReferenceInput) {
    return this.mutateAndCheckError(Documents.ExtractContents, { prompt: prompt, filter: filter, specification: specification, correlationId: this.correlationId });
  }

  public async publishContents(summaryPrompt: string, summarySpecification: Types.EntityReferenceInput, connector: Types.ContentPublishingConnectorInput,
    publishPrompt?: string, publishSpecification?: Types.EntityReferenceInput,
    name?: string, filter?: Types.ContentFilter, workflow?: Types.EntityReferenceInput) {
    return this.mutateAndCheckError(Documents.PublishContents,
      { summaryPrompt: summaryPrompt, summarySpecification: summarySpecification, connector: connector, publishPrompt: publishPrompt, publishSpecification: publishSpecification, name: name, filter: filter, workflow: workflow, correlationId: this.correlationId });
  }

  public async getContent(id: string) {
    return this.queryAndCheckError(Documents.GetContent, { id: id });
  }

  public async queryContents(filter: Types.ContentFilter) {
    return this.queryAndCheckError(Documents.QueryContents, { filter: filter });
  }

  public async createConversation(conversation: Types.ConversationInput) {
    return this.mutateAndCheckError(Documents.CreateConversation, { conversation: conversation, correlationId: this.correlationId });
  }

  public async updateConversation(conversation: Types.ConversationUpdateInput) {
    return this.mutateAndCheckError(Documents.UpdateConversation, { conversation: conversation });
  }

  public async deleteConversation(id: string) {
    return this.mutateAndCheckError(Documents.DeleteConversation, { id: id });
  }

  public async deleteAllConversations() {
    return this.mutateAndCheckError(Documents.DeleteAllConversations);
  }

  public async clearConversation(id: string) {
    return this.mutateAndCheckError(Documents.ClearConversation, { id: id });
  }

  public async closeConversation(id: string) {
    return this.mutateAndCheckError(Documents.CloseConversation, { id: id });
  }

  public async promptConversation(prompt: string, id?: string) {
    return this.mutateAndCheckError(Documents.PromptConversation, { prompt: prompt, id: id, correlationId: this.correlationId });
  }

  public async publishConversation(id: string, connector: Types.ContentPublishingConnectorInput, name?: string, workflow?: Types.EntityReferenceInput) {
    return this.mutateAndCheckError(Documents.PublishConversation, { id: id, connector: connector, name: name, workflow: workflow, correlationId: this.correlationId });
  }

  public async suggestConversation(id: string, count?: number) {
    return this.mutateAndCheckError(Documents.SuggestConversation, { id: id, count: count, correlationId: this.correlationId });
  }

  public async getConversation(id: string) {
    return this.queryAndCheckError(Documents.GetConversation, { id: id });
  }

  public async queryConversations(filter: Types.ConversationFilter) {
    return this.queryAndCheckError(Documents.QueryConversations, { filter: filter });
  }

  public async createFeed(feed: Types.FeedInput) {
    return this.mutateAndCheckError(Documents.CreateFeed, { feed: feed, correlationId: this.correlationId });
  }

  public async updateFeed(feed: Types.FeedUpdateInput) {
    return this.mutateAndCheckError(Documents.UpdateFeed, { feed: feed });
  }

  public async deleteFeed(id: string) {
    return this.mutateAndCheckError(Documents.DeleteFeed, { id: id });
  }

  public async deleteAllFeeds() {
    return this.mutateAndCheckError(Documents.DeleteAllFeeds);
  }

  public async enableFeed(id: string) {
    return this.mutateAndCheckError(Documents.EnableFeed, { id: id });
  }

  public async disableFeed(id: string) {
    return this.mutateAndCheckError(Documents.DisableFeed, { id: id });
  }

  public async getFeed(id: string) {
    return this.queryAndCheckError(Documents.GetFeed, { id: id });
  }

  public async queryFeeds(filter: Types.FeedFilter) {
    return this.queryAndCheckError(Documents.QueryFeeds, { filter: filter });
  }

  // TODO: project credits, usage, etc.

  public async createSpecification(specification: Types.SpecificationInput) {
    return this.mutateAndCheckError(Documents.CreateSpecification, { specification: specification });
  }

  public async updateSpecification(specification: Types.SpecificationUpdateInput) {
    return this.mutateAndCheckError(Documents.UpdateSpecification, { specification: specification });
  }

  public async deleteSpecification(id: string) {
    return this.mutateAndCheckError(Documents.DeleteSpecification, { id: id });
  }

  /*
  public async deleteAllSpecifications() {
    return this.mutateAndCheckError(Documents.DeleteAllSpecifications);
  }
  */

  public async promptSpecifications(prompt: string, ids: [string]) {
    return this.mutateAndCheckError(Documents.PromptSpecifications, { prompt: prompt, ids: ids });
  }

  public async getSpecification(id: string) {
    return this.queryAndCheckError(Documents.GetSpecification, { id: id });
  }

  public async querySpecifications(filter: Types.SpecificationFilter) {
    return this.queryAndCheckError(Documents.QuerySpecifications, { filter: filter });
  }

  public async createWorkflow(workflow: Types.WorkflowInput) {
    return this.mutateAndCheckError(Documents.CreateWorkflow, { workflow: workflow });
  }

  public async updateWorkflow(workflow: Types.WorkflowUpdateInput) {
    return this.mutateAndCheckError(Documents.UpdateWorkflow, { workflow: workflow });
  }

  public async deleteWorkflow(id: string) {
    return this.mutateAndCheckError(Documents.DeleteWorkflow, { id: id });
  }

  public async deleteAllWorkflows() {
    return this.mutateAndCheckError(Documents.DeleteAllWorkflows);
  }

  public async getWorkflow(id: string) {
    return this.queryAndCheckError(Documents.GetWorkflow, { id: id });
  }

  public async queryWorkflows(filter: Types.WorkflowFilter) {
    return this.queryAndCheckError(Documents.QueryWorkflows, { filter: filter });
  }

  // helper functions
  private async mutateAndCheckError(mutation: any, variables?: any) {
    const result = await this.client.mutate({
      mutation,
      variables,
    });

    if (result.errors && result.errors.length > 0) {
      const errorMessage = result.errors.map(error => error.message).join("\n");
      throw new Error(errorMessage);
    }

    return result.data;
  }

  private async queryAndCheckError(query: any, variables?: any) {
    const result = await this.client.query({
      query,
      variables,
    });

    if (result.errors && result.errors.length > 0) {
      const errorMessage = result.errors.map(error => error.message).join("\n");
      throw new Error(errorMessage);
    }

    return result.data;
  }
}

export { Graphlit };
export * as Types from './generated/graphql-types';

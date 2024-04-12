import gql from 'graphql-tag';

export const CreateAlert = gql`
    mutation CreateAlert($alert: AlertInput!, $correlationId: String) {
  createAlert(alert: $alert, correlationId: $correlationId) {
    id
    name
    state
    type
  }
}
    `;
export const DeleteAlert = gql`
    mutation DeleteAlert($id: ID!) {
  deleteAlert(id: $id) {
    id
    state
  }
}
    `;
export const DeleteAlerts = gql`
    mutation DeleteAlerts($ids: [ID!]!) {
  deleteAlerts(ids: $ids) {
    id
    state
  }
}
    `;
export const DeleteAllAlerts = gql`
    mutation DeleteAllAlerts {
  deleteAllAlerts {
    id
    state
  }
}
    `;
export const DisableAlert = gql`
    mutation DisableAlert($id: ID!) {
  disableAlert(id: $id) {
    id
    state
  }
}
    `;
export const EnableAlert = gql`
    mutation EnableAlert($id: ID!) {
  enableAlert(id: $id) {
    id
    state
  }
}
    `;
export const GetAlert = gql`
    query GetAlert($id: ID!) {
  alert(id: $id) {
    id
    name
    creationDate
    owner {
      id
    }
    state
    correlationId
    type
    summaryPrompt
    publishPrompt
    filter {
      dateRange {
        from
        to
      }
      creationDateRange {
        from
        to
      }
      types
      fileTypes
      contents {
        id
      }
      feeds {
        id
      }
      workflows {
        id
      }
      collections {
        id
      }
      observations {
        type
        observable {
          id
        }
        states
      }
    }
    integration {
      type
      uri
      slack {
        token
        channel
      }
    }
    publishing {
      type
      elevenLabs {
        model
        voice
      }
    }
    summarySpecification {
      id
    }
    publishSpecification {
      id
    }
    lastAlertDate
  }
}
    `;
export const QueryAlerts = gql`
    query QueryAlerts($filter: AlertFilter!) {
  alerts(filter: $filter) {
    results {
      id
      name
      creationDate
      owner {
        id
      }
      state
      correlationId
      type
      summaryPrompt
      publishPrompt
      filter {
        dateRange {
          from
          to
        }
        creationDateRange {
          from
          to
        }
        types
        fileTypes
        contents {
          id
        }
        feeds {
          id
        }
        workflows {
          id
        }
        collections {
          id
        }
        observations {
          type
          observable {
            id
          }
          states
        }
      }
      integration {
        type
        uri
        slack {
          token
          channel
        }
      }
      publishing {
        type
        elevenLabs {
          model
          voice
        }
      }
      summarySpecification {
        id
      }
      publishSpecification {
        id
      }
      lastAlertDate
    }
  }
}
    `;
export const UpdateAlert = gql`
    mutation UpdateAlert($alert: AlertUpdateInput!) {
  updateAlert(alert: $alert) {
    id
    name
    state
    type
  }
}
    `;
export const AddContentsToCollections = gql`
    mutation AddContentsToCollections($contents: [EntityReferenceInput!]!, $collections: [EntityReferenceInput!]!) {
  addContentsToCollections(contents: $contents, collections: $collections) {
    id
    name
    state
    type
    contents {
      id
      name
    }
  }
}
    `;
export const CreateCollection = gql`
    mutation CreateCollection($collection: CollectionInput!) {
  createCollection(collection: $collection) {
    id
    name
    state
    type
  }
}
    `;
export const DeleteCollection = gql`
    mutation DeleteCollection($id: ID!) {
  deleteCollection(id: $id) {
    id
    state
  }
}
    `;
export const DeleteCollections = gql`
    mutation DeleteCollections($ids: [ID!]!) {
  deleteCollections(ids: $ids) {
    id
    state
  }
}
    `;
export const GetCollection = gql`
    query GetCollection($id: ID!) {
  collection(id: $id) {
    id
    name
    creationDate
    owner {
      id
    }
    state
    type
    contents {
      id
      name
    }
  }
}
    `;
export const QueryCollections = gql`
    query QueryCollections($filter: CollectionFilter!) {
  collections(filter: $filter) {
    results {
      id
      name
      creationDate
      owner {
        id
      }
      state
      type
      contents {
        id
        name
      }
    }
  }
}
    `;
export const RemoveContentsFromCollection = gql`
    mutation RemoveContentsFromCollection($contents: [EntityReferenceInput!]!, $collection: EntityReferenceInput!) {
  removeContentsFromCollection(contents: $contents, collection: $collection) {
    id
    name
    state
    type
    contents {
      id
      name
    }
  }
}
    `;
export const UpdateCollection = gql`
    mutation UpdateCollection($collection: CollectionUpdateInput!) {
  updateCollection(collection: $collection) {
    id
    name
    state
    type
  }
}
    `;
export const DeleteAllContents = gql`
    mutation DeleteAllContents {
  deleteAllContents {
    id
    state
  }
}
    `;
export const DeleteContent = gql`
    mutation DeleteContent($id: ID!) {
  deleteContent(id: $id) {
    id
    state
  }
}
    `;
export const DeleteContents = gql`
    mutation DeleteContents($ids: [ID!]!) {
  deleteContents(ids: $ids) {
    id
    state
  }
}
    `;
export const ExtractContents = gql`
    mutation ExtractContents($prompt: String!, $filter: ContentFilter, $specification: EntityReferenceInput!, $correlationId: String) {
  extractContents(
    prompt: $prompt
    filter: $filter
    specification: $specification
    correlationId: $correlationId
  ) {
    specification {
      id
    }
    content {
      id
    }
    value
    startTime
    endTime
    pageNumber
    error
  }
}
    `;
export const GetContent = gql`
    query GetContent($id: ID!) {
  content(id: $id) {
    id
    name
    creationDate
    owner {
      id
    }
    state
    originalDate
    finishedDate
    workflowDuration
    uri
    type
    fileType
    mimeType
    fileName
    fileSize
    masterUri
    imageUri
    textUri
    audioUri
    transcriptUri
    links {
      uri
      linkType
    }
  }
}
    `;
export const IngestEncodedFile = gql`
    mutation IngestEncodedFile($name: String!, $data: String!, $mimeType: String!, $id: ID, $isSynchronous: Boolean, $workflow: EntityReferenceInput, $correlationId: String) {
  ingestEncodedFile(
    name: $name
    data: $data
    mimeType: $mimeType
    id: $id
    isSynchronous: $isSynchronous
    workflow: $workflow
    correlationId: $correlationId
  ) {
    id
    name
    state
    type
    fileType
    mimeType
    uri
  }
}
    `;
export const IngestText = gql`
    mutation IngestText($name: String!, $text: String!, $textType: TextTypes, $uri: URL, $id: ID, $isSynchronous: Boolean, $workflow: EntityReferenceInput, $correlationId: String) {
  ingestText(
    name: $name
    text: $text
    textType: $textType
    uri: $uri
    id: $id
    isSynchronous: $isSynchronous
    workflow: $workflow
    correlationId: $correlationId
  ) {
    id
    name
    state
    type
    fileType
    mimeType
    uri
  }
}
    `;
export const IngestUri = gql`
    mutation IngestUri($name: String, $uri: URL!, $id: ID, $isSynchronous: Boolean, $workflow: EntityReferenceInput, $correlationId: String) {
  ingestUri(
    name: $name
    uri: $uri
    id: $id
    workflow: $workflow
    isSynchronous: $isSynchronous
    correlationId: $correlationId
  ) {
    id
    name
    state
    type
    fileType
    mimeType
    uri
  }
}
    `;
export const IsContentDone = gql`
    query IsContentDone($id: ID!) {
  isContentDone(id: $id) {
    result
  }
}
    `;
export const PublishContents = gql`
    mutation PublishContents($summaryPrompt: String, $publishPrompt: String!, $connector: ContentPublishingConnectorInput!, $filter: ContentFilter, $correlationId: String, $name: String, $summarySpecification: EntityReferenceInput, $publishSpecification: EntityReferenceInput, $workflow: EntityReferenceInput) {
  publishContents(
    summaryPrompt: $summaryPrompt
    publishPrompt: $publishPrompt
    connector: $connector
    filter: $filter
    correlationId: $correlationId
    name: $name
    summarySpecification: $summarySpecification
    publishSpecification: $publishSpecification
    workflow: $workflow
  ) {
    id
    name
    state
    type
    fileType
    mimeType
    uri
  }
}
    `;
export const QueryContents = gql`
    query QueryContents($filter: ContentFilter!) {
  contents(filter: $filter) {
    results {
      id
      name
      creationDate
      owner {
        id
      }
      state
      originalDate
      finishedDate
      workflowDuration
      uri
      type
      fileType
      mimeType
      fileName
      fileSize
      masterUri
      imageUri
      textUri
      audioUri
      transcriptUri
      links {
        uri
        linkType
      }
    }
  }
}
    `;
export const SummarizeContents = gql`
    mutation SummarizeContents($summarizations: [SummarizationStrategyInput!]!, $filter: ContentFilter, $correlationId: String) {
  summarizeContents(
    summarizations: $summarizations
    filter: $filter
    correlationId: $correlationId
  ) {
    specification {
      id
    }
    content {
      id
    }
    type
    items {
      text
      tokens
      summarizationTime
    }
    error
  }
}
    `;
export const UpdateContent = gql`
    mutation UpdateContent($content: ContentUpdateInput!) {
  updateContent(content: $content) {
    id
    name
    state
    type
    fileType
    mimeType
    uri
  }
}
    `;
export const ClearConversation = gql`
    mutation ClearConversation($id: ID!) {
  clearConversation(id: $id) {
    id
    name
    state
    type
  }
}
    `;
export const CloseConversation = gql`
    mutation CloseConversation($id: ID!) {
  closeConversation(id: $id) {
    id
    name
    state
    type
  }
}
    `;
export const CreateConversation = gql`
    mutation CreateConversation($conversation: ConversationInput!, $correlationId: String) {
  createConversation(conversation: $conversation, correlationId: $correlationId) {
    id
    name
    state
    type
  }
}
    `;
export const DeleteAllConversations = gql`
    mutation DeleteAllConversations {
  deleteAllConversations {
    id
    state
  }
}
    `;
export const DeleteConversation = gql`
    mutation DeleteConversation($id: ID!) {
  deleteConversation(id: $id) {
    id
    state
  }
}
    `;
export const DeleteConversations = gql`
    mutation DeleteConversations($ids: [ID!]!) {
  deleteConversations(ids: $ids) {
    id
    state
  }
}
    `;
export const GetConversation = gql`
    query GetConversation($id: ID!) {
  conversation(id: $id) {
    id
    name
    creationDate
    owner {
      id
    }
    state
    correlationId
    type
    messages {
      role
      author
      message
      citations {
        content {
          id
        }
        index
        text
        startTime
        endTime
        pageNumber
        frameNumber
      }
      tokens
      throughput
      completionTime
      timestamp
      modelService
      model
    }
    specification {
      id
      name
    }
    filter {
      dateRange {
        from
        to
      }
      creationDateRange {
        from
        to
      }
      types
      fileTypes
      contents {
        id
      }
      feeds {
        id
      }
      workflows {
        id
      }
      collections {
        id
      }
      observations {
        type
        observable {
          id
        }
        states
      }
    }
  }
}
    `;
export const PromptConversation = gql`
    mutation PromptConversation($prompt: String!, $id: ID, $correlationId: String) {
  promptConversation(prompt: $prompt, id: $id, correlationId: $correlationId) {
    conversation {
      id
    }
    message {
      role
      author
      message
      citations {
        content {
          id
        }
        index
        text
        startTime
        endTime
        pageNumber
        frameNumber
      }
      tokens
      throughput
      completionTime
      timestamp
      modelService
      model
    }
    messageCount
    facets {
      type
      value
      range {
        from
        to
      }
      count
      facet
      observable {
        type
        observable {
          id
          name
        }
      }
    }
  }
}
    `;
export const PublishConversation = gql`
    mutation PublishConversation($id: ID!, $connector: ContentPublishingConnectorInput!, $name: String, $workflow: EntityReferenceInput, $correlationId: String) {
  publishConversation(
    id: $id
    connector: $connector
    name: $name
    workflow: $workflow
    correlationId: $correlationId
  ) {
    id
    name
    state
    type
    fileType
    mimeType
    uri
  }
}
    `;
export const QueryConversations = gql`
    query QueryConversations($filter: ConversationFilter!) {
  conversations(filter: $filter) {
    results {
      id
      name
      creationDate
      owner {
        id
      }
      state
      correlationId
      type
      messages {
        role
        author
        message
        citations {
          content {
            id
          }
          index
          text
          startTime
          endTime
          pageNumber
          frameNumber
        }
        tokens
        throughput
        completionTime
        timestamp
        modelService
        model
      }
      specification {
        id
        name
      }
      filter {
        dateRange {
          from
          to
        }
        creationDateRange {
          from
          to
        }
        types
        fileTypes
        contents {
          id
        }
        feeds {
          id
        }
        workflows {
          id
        }
        collections {
          id
        }
        observations {
          type
          observable {
            id
          }
          states
        }
      }
    }
  }
}
    `;
export const SuggestConversation = gql`
    mutation SuggestConversation($id: ID!, $count: Int, $correlationId: String) {
  suggestConversation(id: $id, count: $count, correlationId: $correlationId) {
    prompts
  }
}
    `;
export const UpdateConversation = gql`
    mutation UpdateConversation($conversation: ConversationUpdateInput!) {
  updateConversation(conversation: $conversation) {
    id
    name
    state
    type
  }
}
    `;
export const CreateFeed = gql`
    mutation CreateFeed($feed: FeedInput!, $correlationId: String) {
  createFeed(feed: $feed, correlationId: $correlationId) {
    id
    name
    state
    type
  }
}
    `;
export const DeleteAllFeeds = gql`
    mutation DeleteAllFeeds {
  deleteAllFeeds {
    id
    state
  }
}
    `;
export const DeleteFeed = gql`
    mutation DeleteFeed($id: ID!) {
  deleteFeed(id: $id) {
    id
    state
  }
}
    `;
export const DeleteFeeds = gql`
    mutation DeleteFeeds($ids: [ID!]!) {
  deleteFeeds(ids: $ids) {
    id
    state
  }
}
    `;
export const DisableFeed = gql`
    mutation DisableFeed($id: ID!) {
  disableFeed(id: $id) {
    id
    state
  }
}
    `;
export const EnableFeed = gql`
    mutation EnableFeed($id: ID!) {
  enableFeed(id: $id) {
    id
    state
  }
}
    `;
export const GetFeed = gql`
    query GetFeed($id: ID!) {
  feed(id: $id) {
    id
    name
    creationDate
    owner {
      id
    }
    state
    correlationId
    type
    site {
      siteType
      type
      isRecursive
      s3 {
        accessKey
        secretAccessKey
        bucketName
        prefix
        region
      }
      azureBlob {
        storageAccessKey
        accountName
        containerName
        prefix
      }
      azureFile {
        storageAccessKey
        accountName
        shareName
        prefix
      }
      google {
        credentials
        containerName
        prefix
      }
      sharePoint {
        authenticationType
        accountName
        libraryId
        tenantId
        refreshToken
      }
      oneDrive {
        folderId
        refreshToken
      }
      googleDrive {
        folderId
        refreshToken
      }
    }
    email {
      type
      includeAttachments
      google {
        type
        refreshToken
      }
      microsoft {
        type
        tenantId
        refreshToken
      }
    }
    issue {
      type
      includeAttachments
      jira {
        uri
        project
        email
        token
      }
      linear {
        key
        project
      }
      github {
        uri
        repositoryOwner
        repositoryName
        refreshToken
        personalAccessToken
      }
    }
    rss {
      readLimit
      uri
    }
    web {
      readLimit
      uri
      includeFiles
    }
    reddit {
      readLimit
      subredditName
    }
    notion {
      readLimit
      token
      identifiers
      type
    }
    youtube {
      readLimit
      type
      videoName
      videoIdentifiers
      channelIdentifier
      playlistIdentifier
    }
    slack {
      readLimit
      type
      token
      channel
      includeAttachments
    }
    discord {
      readLimit
      type
      token
      channel
      includeAttachments
    }
    error
    lastPostDate
    lastReadDate
    readCount
    workflow {
      id
      name
    }
    schedulePolicy {
      recurrenceType
      repeatInterval
    }
  }
}
    `;
export const IsFeedDone = gql`
    query IsFeedDone($id: ID!) {
  isFeedDone(id: $id) {
    result
  }
}
    `;
export const QueryFeeds = gql`
    query QueryFeeds($filter: FeedFilter!) {
  feeds(filter: $filter) {
    results {
      id
      name
      creationDate
      owner {
        id
      }
      state
      correlationId
      type
      site {
        siteType
        type
        isRecursive
        s3 {
          accessKey
          secretAccessKey
          bucketName
          prefix
          region
        }
        azureBlob {
          storageAccessKey
          accountName
          containerName
          prefix
        }
        azureFile {
          storageAccessKey
          accountName
          shareName
          prefix
        }
        google {
          credentials
          containerName
          prefix
        }
        sharePoint {
          authenticationType
          accountName
          libraryId
          tenantId
          refreshToken
        }
        oneDrive {
          folderId
          refreshToken
        }
        googleDrive {
          folderId
          refreshToken
        }
      }
      email {
        type
        includeAttachments
        google {
          type
          refreshToken
        }
        microsoft {
          type
          tenantId
          refreshToken
        }
      }
      issue {
        type
        includeAttachments
        jira {
          uri
          project
          email
          token
        }
        linear {
          key
          project
        }
        github {
          uri
          repositoryOwner
          repositoryName
          refreshToken
          personalAccessToken
        }
      }
      rss {
        readLimit
        uri
      }
      web {
        readLimit
        uri
        includeFiles
      }
      reddit {
        readLimit
        subredditName
      }
      notion {
        readLimit
        token
        identifiers
        type
      }
      youtube {
        readLimit
        type
        videoName
        videoIdentifiers
        channelIdentifier
        playlistIdentifier
      }
      slack {
        readLimit
        type
        token
        channel
        includeAttachments
      }
      discord {
        readLimit
        type
        token
        channel
        includeAttachments
      }
      error
      lastPostDate
      lastReadDate
      readCount
      workflow {
        id
        name
      }
      schedulePolicy {
        recurrenceType
        repeatInterval
      }
    }
  }
}
    `;
export const UpdateFeed = gql`
    mutation UpdateFeed($feed: FeedUpdateInput!) {
  updateFeed(feed: $feed) {
    id
    name
    state
    type
  }
}
    `;
export const Credits = gql`
    query Credits($startDate: DateTime!, $duration: TimeSpan!) {
  credits(startDate: $startDate, duration: $duration) {
    correlationId
    ownerId
    credits
    storageRatio
    computeRatio
    preparationRatio
    extractionRatio
    enrichmentRatio
    publishingRatio
    searchRatio
    conversationRatio
  }
}
    `;
export const LookupCredits = gql`
    query LookupCredits($correlationId: String!) {
  lookupCredits(correlationId: $correlationId) {
    correlationId
    ownerId
    credits
    storageRatio
    computeRatio
    preparationRatio
    extractionRatio
    enrichmentRatio
    publishingRatio
    searchRatio
    conversationRatio
  }
}
    `;
export const LookupUsage = gql`
    query LookupUsage($correlationId: String!) {
  lookupUsage(correlationId: $correlationId) {
    correlationId
    date
    credits
    name
    metric
    workflow
    entityType
    entityId
    projectId
    ownerId
    uri
    duration
    throughput
    contentType
    fileType
    modelService
    modelName
    processorName
    prompt
    promptTokens
    completion
    completionTokens
    tokens
    count
    request
    variables
    response
  }
}
    `;
export const Project = gql`
    query Project {
  project {
    id
    name
    creationDate
    modifiedDate
    state
    environmentType
    platform
    region
    workflow {
      id
      name
    }
    specification {
      id
      name
    }
    quota {
      storage
      contents
      feeds
      posts
      conversations
    }
    callbackUri
  }
}
    `;
export const UpdateProject = gql`
    mutation UpdateProject($project: ProjectUpdateInput!) {
  updateProject(project: $project) {
    id
    name
  }
}
    `;
export const Usage = gql`
    query Usage($startDate: DateTime!, $duration: TimeSpan!) {
  usage(startDate: $startDate, duration: $duration) {
    correlationId
    date
    credits
    name
    metric
    workflow
    entityType
    entityId
    projectId
    ownerId
    uri
    duration
    throughput
    contentType
    fileType
    modelService
    modelName
    processorName
    prompt
    promptTokens
    completion
    completionTokens
    tokens
    count
    request
    variables
    response
  }
}
    `;
export const CreateSpecification = gql`
    mutation CreateSpecification($specification: SpecificationInput!) {
  createSpecification(specification: $specification) {
    id
    name
    state
    type
    serviceType
  }
}
    `;
export const DeleteSpecification = gql`
    mutation DeleteSpecification($id: ID!) {
  deleteSpecification(id: $id) {
    id
    state
  }
}
    `;
export const GetSpecification = gql`
    query GetSpecification($id: ID!) {
  specification(id: $id) {
    id
    name
    creationDate
    owner {
      id
    }
    state
    type
    serviceType
    systemPrompt
    customGuidance
    strategy {
      type
      messageLimit
      embedCitations
      enableFacets
      messagesWeight
      contentsWeight
    }
    promptStrategy {
      type
    }
    retrievalStrategy {
      type
      contentLimit
    }
    rerankingStrategy {
      serviceType
    }
    openAI {
      tokenLimit
      completionTokenLimit
      model
      key
      modelName
      temperature
      probability
    }
    azureOpenAI {
      tokenLimit
      completionTokenLimit
      model
      key
      endpoint
      deploymentName
      temperature
      probability
    }
    anthropic {
      tokenLimit
      completionTokenLimit
      model
      key
      modelName
      temperature
      probability
    }
    replicate {
      tokenLimit
      completionTokenLimit
      model
      key
      modelName
      temperature
      probability
    }
    tools {
      name
      description
      schema
      uri
    }
  }
}
    `;
export const PromptSpecifications = gql`
    mutation PromptSpecifications($prompt: String!, $ids: [ID!]!) {
  promptSpecifications(prompt: $prompt, ids: $ids) {
    specification {
      id
    }
    messages {
      role
      author
      message
      citations {
        content {
          id
        }
        index
        text
        startTime
        endTime
        pageNumber
        frameNumber
      }
      tokens
      throughput
      completionTime
      timestamp
      modelService
      model
    }
    error
  }
}
    `;
export const QuerySpecifications = gql`
    query QuerySpecifications($filter: SpecificationFilter!) {
  specifications(filter: $filter) {
    results {
      id
      name
      creationDate
      owner {
        id
      }
      state
      type
      serviceType
      systemPrompt
      customGuidance
      strategy {
        type
        messageLimit
        embedCitations
        enableFacets
        messagesWeight
        contentsWeight
      }
      promptStrategy {
        type
      }
      retrievalStrategy {
        type
        contentLimit
      }
      rerankingStrategy {
        serviceType
      }
      openAI {
        tokenLimit
        completionTokenLimit
        model
        key
        modelName
        temperature
        probability
      }
      azureOpenAI {
        tokenLimit
        completionTokenLimit
        model
        key
        endpoint
        deploymentName
        temperature
        probability
      }
      anthropic {
        tokenLimit
        completionTokenLimit
        model
        key
        modelName
        temperature
        probability
      }
      replicate {
        tokenLimit
        completionTokenLimit
        model
        key
        modelName
        temperature
        probability
      }
      tools {
        name
        description
        schema
        uri
      }
    }
  }
}
    `;
export const UpdateSpecification = gql`
    mutation UpdateSpecification($specification: SpecificationUpdateInput!) {
  updateSpecification(specification: $specification) {
    id
    name
    state
    type
    serviceType
  }
}
    `;
export const CreateWorkflow = gql`
    mutation CreateWorkflow($workflow: WorkflowInput!) {
  createWorkflow(workflow: $workflow) {
    id
    name
    state
    ingestion {
      if {
        types
        fileTypes
      }
      collections {
        id
      }
    }
    preparation {
      disableSmartCapture
      summarizations {
        type
        specification {
          id
        }
        tokens
        items
      }
      jobs {
        connector {
          type
          fileTypes
          azureDocument {
            model
          }
          deepgram {
            model
            key
            enableRedaction
            enableSpeakerDiarization
          }
          document {
            includeImages
          }
          email {
            includeAttachments
          }
        }
      }
    }
    extraction {
      jobs {
        connector {
          type
          contentTypes
          fileTypes
          extractedTypes
          azureText {
            confidenceThreshold
            enablePII
          }
          azureImage {
            confidenceThreshold
          }
          openAIImage {
            confidenceThreshold
            detailLevel
          }
          modelText {
            specification {
              id
            }
          }
        }
      }
    }
    enrichment {
      link {
        enableCrawling
        allowedDomains
        excludedDomains
        allowedLinks
        excludedLinks
        allowedFiles
        excludedFiles
        allowContentDomain
        maximumLinks
      }
      jobs {
        connector {
          type
          enrichedTypes
        }
      }
    }
    actions {
      connector {
        type
        uri
        slack {
          token
          channel
        }
      }
    }
  }
}
    `;
export const DeleteAllWorkflows = gql`
    mutation DeleteAllWorkflows {
  deleteAllWorkflows {
    id
    state
  }
}
    `;
export const DeleteWorkflow = gql`
    mutation DeleteWorkflow($id: ID!) {
  deleteWorkflow(id: $id) {
    id
    state
  }
}
    `;
export const DeleteWorkflows = gql`
    mutation DeleteWorkflows($ids: [ID!]!) {
  deleteWorkflows(ids: $ids) {
    id
    state
  }
}
    `;
export const GetWorkflow = gql`
    query GetWorkflow($id: ID!) {
  workflow(id: $id) {
    id
    name
    creationDate
    owner {
      id
    }
    state
    ingestion {
      if {
        types
        fileTypes
      }
      collections {
        id
      }
    }
    preparation {
      disableSmartCapture
      summarizations {
        type
        specification {
          id
        }
        tokens
        items
      }
      jobs {
        connector {
          type
          fileTypes
          azureDocument {
            model
          }
          deepgram {
            model
            key
            enableRedaction
            enableSpeakerDiarization
          }
          document {
            includeImages
          }
          email {
            includeAttachments
          }
        }
      }
    }
    extraction {
      jobs {
        connector {
          type
          contentTypes
          fileTypes
          extractedTypes
          azureText {
            confidenceThreshold
            enablePII
          }
          azureImage {
            confidenceThreshold
          }
          openAIImage {
            confidenceThreshold
            detailLevel
          }
          modelText {
            specification {
              id
            }
          }
        }
      }
    }
    enrichment {
      link {
        enableCrawling
        allowedDomains
        excludedDomains
        allowedLinks
        excludedLinks
        allowedFiles
        excludedFiles
        allowContentDomain
        maximumLinks
      }
      jobs {
        connector {
          type
          enrichedTypes
        }
      }
    }
    actions {
      connector {
        type
        uri
        slack {
          token
          channel
        }
      }
    }
  }
}
    `;
export const QueryWorkflows = gql`
    query QueryWorkflows($filter: WorkflowFilter!) {
  workflows(filter: $filter) {
    results {
      id
      name
      creationDate
      owner {
        id
      }
      state
      ingestion {
        if {
          types
          fileTypes
        }
        collections {
          id
        }
      }
      preparation {
        disableSmartCapture
        summarizations {
          type
          specification {
            id
          }
          tokens
          items
        }
        jobs {
          connector {
            type
            fileTypes
            azureDocument {
              model
            }
            deepgram {
              model
              key
              enableRedaction
              enableSpeakerDiarization
            }
            document {
              includeImages
            }
            email {
              includeAttachments
            }
          }
        }
      }
      extraction {
        jobs {
          connector {
            type
            contentTypes
            fileTypes
            extractedTypes
            azureText {
              confidenceThreshold
              enablePII
            }
            azureImage {
              confidenceThreshold
            }
            openAIImage {
              confidenceThreshold
              detailLevel
            }
            modelText {
              specification {
                id
              }
            }
          }
        }
      }
      enrichment {
        link {
          enableCrawling
          allowedDomains
          excludedDomains
          allowedLinks
          excludedLinks
          allowedFiles
          excludedFiles
          allowContentDomain
          maximumLinks
        }
        jobs {
          connector {
            type
            enrichedTypes
          }
        }
      }
      actions {
        connector {
          type
          uri
          slack {
            token
            channel
          }
        }
      }
    }
  }
}
    `;
export const UpdateWorkflow = gql`
    mutation UpdateWorkflow($workflow: WorkflowUpdateInput!) {
  updateWorkflow(workflow: $workflow) {
    id
    name
    state
    ingestion {
      if {
        types
        fileTypes
      }
      collections {
        id
      }
    }
    preparation {
      disableSmartCapture
      summarizations {
        type
        specification {
          id
        }
        tokens
        items
      }
      jobs {
        connector {
          type
          fileTypes
          azureDocument {
            model
          }
          deepgram {
            model
            key
            enableRedaction
            enableSpeakerDiarization
          }
          document {
            includeImages
          }
          email {
            includeAttachments
          }
        }
      }
    }
    extraction {
      jobs {
        connector {
          type
          contentTypes
          fileTypes
          extractedTypes
          azureText {
            confidenceThreshold
            enablePII
          }
          azureImage {
            confidenceThreshold
          }
          openAIImage {
            confidenceThreshold
            detailLevel
          }
          modelText {
            specification {
              id
            }
          }
        }
      }
    }
    enrichment {
      link {
        enableCrawling
        allowedDomains
        excludedDomains
        allowedLinks
        excludedLinks
        allowedFiles
        excludedFiles
        allowContentDomain
        maximumLinks
      }
      jobs {
        connector {
          type
          enrichedTypes
        }
      }
    }
    actions {
      connector {
        type
        uri
        slack {
          token
          channel
        }
      }
    }
  }
}
    `;
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
    query QueryAlerts($filter: AlertFilter) {
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
export const CreateCategory = gql`
    mutation CreateCategory($category: CategoryInput!) {
  createCategory(category: $category) {
    id
    name
  }
}
    `;
export const DeleteAllCategories = gql`
    mutation DeleteAllCategories($filter: CategoryFilter!) {
  deleteAllCategories(filter: $filter) {
    id
    state
  }
}
    `;
export const DeleteCategories = gql`
    mutation DeleteCategories($ids: [ID!]!) {
  deleteCategories(ids: $ids) {
    id
    state
  }
}
    `;
export const DeleteCategory = gql`
    mutation DeleteCategory($id: ID!) {
  deleteCategory(id: $id) {
    id
    state
  }
}
    `;
export const GetCategory = gql`
    query GetCategory($id: ID!) {
  category(id: $id) {
    id
    name
    description
    creationDate
  }
}
    `;
export const QueryCategories = gql`
    query QueryCategories($filter: CategoryFilter!) {
  categories(filter: $filter) {
    results {
      id
      name
      description
      creationDate
    }
  }
}
    `;
export const UpdateCategory = gql`
    mutation UpdateCategory($category: CategoryUpdateInput!) {
  updateCategory(category: $category) {
    id
    name
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
export const DeleteAllCollections = gql`
    mutation DeleteAllCollections {
  deleteAllCollections {
    id
    state
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
    query QueryCollections($filter: CollectionFilter) {
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
    description
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
    video {
      width
      height
      duration
      software
      make
      model
    }
    audio {
      keywords
      author
      series
      episode
      episodeType
      season
      publisher
      copyright
      language
      genre
      title
      bitrate
      channels
      sampleRate
      bitsPerSample
      duration
    }
    image {
      width
      height
      description
      software
      identifier
      make
      model
    }
    document {
      title
      subject
      author
      software
      publisher
      description
      summary
      keywords
      pageCount
      worksheetCount
      slideCount
      wordCount
      lineCount
      paragraphCount
      characterCount
      isEncrypted
      hasDigitalSignature
    }
    email {
      subject
      identifier
      sensitivity
      priority
      importance
      labels
      from {
        name
        familyName
        givenName
        email
      }
      to {
        name
        familyName
        givenName
        email
      }
      cc {
        name
        familyName
        givenName
        email
      }
      bcc {
        name
        familyName
        givenName
        email
      }
    }
    issue {
      title
      project
      team
      status
      priority
      type
      identifier
      labels
    }
    observations {
      type
      observable {
        id
        name
      }
      occurrences {
        type
        confidence
        boundingBox {
          left
          top
          width
          height
        }
        pageIndex
        startTime
        endTime
      }
    }
    parent {
      id
    }
    children {
      id
    }
    collections {
      id
    }
    feed {
      id
    }
    workflow {
      id
    }
    markdown
    links {
      uri
      linkType
    }
    error
  }
}
    `;
export const IngestEncodedFile = gql`
    mutation IngestEncodedFile($name: String!, $data: String!, $mimeType: String!, $id: ID, $isSynchronous: Boolean, $collections: [EntityReferenceInput!], $workflow: EntityReferenceInput, $correlationId: String) {
  ingestEncodedFile(
    name: $name
    data: $data
    mimeType: $mimeType
    id: $id
    isSynchronous: $isSynchronous
    collections: $collections
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
    mutation IngestText($name: String!, $text: String!, $textType: TextTypes, $uri: URL, $id: ID, $isSynchronous: Boolean, $collections: [EntityReferenceInput!], $workflow: EntityReferenceInput, $correlationId: String) {
  ingestText(
    name: $name
    text: $text
    textType: $textType
    uri: $uri
    id: $id
    isSynchronous: $isSynchronous
    collections: $collections
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
    mutation IngestUri($name: String, $uri: URL!, $id: ID, $isSynchronous: Boolean, $collections: [EntityReferenceInput!], $workflow: EntityReferenceInput, $correlationId: String) {
  ingestUri(
    name: $name
    uri: $uri
    id: $id
    collections: $collections
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
    mutation PublishContents($summaryPrompt: String, $publishPrompt: String!, $connector: ContentPublishingConnectorInput!, $filter: ContentFilter, $correlationId: String, $name: String, $summarySpecification: EntityReferenceInput, $publishSpecification: EntityReferenceInput, $workflow: EntityReferenceInput, $isSynchronous: Boolean!) {
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
    isSynchronous: $isSynchronous
  ) {
    id
    name
    state
    type
    fileType
    mimeType
    uri
    textUri
    audioUri
    markdown
  }
}
    `;
export const PublishText = gql`
    mutation PublishText($text: String!, $textType: TextTypes, $connector: ContentPublishingConnectorInput!, $correlationId: String, $name: String, $workflow: EntityReferenceInput, $isSynchronous: Boolean!) {
  publishText(
    text: $text
    textType: $textType
    connector: $connector
    correlationId: $correlationId
    name: $name
    workflow: $workflow
    isSynchronous: $isSynchronous
  ) {
    id
    name
    state
    type
    fileType
    mimeType
    uri
    textUri
    audioUri
    markdown
  }
}
    `;
export const QueryContentFacets = gql`
    query QueryContentFacets($filter: ContentFilter, $facets: [ContentFacetInput!]) {
  contents(filter: $filter, facets: $facets) {
    facets {
      facet
      type
      observable {
        type
        observable {
          id
          name
        }
      }
      count
    }
  }
}
    `;
export const QueryContents = gql`
    query QueryContents($filter: ContentFilter) {
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
      pages {
        index
        chunks {
          index
          pageIndex
          rowIndex
          columnIndex
          confidence
          text
          role
          relevance
        }
      }
      segments {
        startTime
        endTime
        text
        relevance
      }
      video {
        width
        height
        duration
        software
        make
        model
      }
      audio {
        keywords
        author
        series
        episode
        episodeType
        season
        publisher
        copyright
        language
        genre
        title
        bitrate
        channels
        sampleRate
        bitsPerSample
        duration
      }
      image {
        width
        height
        description
        software
        identifier
        make
        model
      }
      document {
        title
        subject
        author
        software
        publisher
        description
        summary
        keywords
        pageCount
        worksheetCount
        slideCount
        wordCount
        lineCount
        paragraphCount
        characterCount
        isEncrypted
        hasDigitalSignature
      }
      email {
        subject
        identifier
        sensitivity
        priority
        importance
        labels
        from {
          name
          familyName
          givenName
          email
        }
        to {
          name
          familyName
          givenName
          email
        }
        cc {
          name
          familyName
          givenName
          email
        }
        bcc {
          name
          familyName
          givenName
          email
        }
      }
      issue {
        title
        project
        team
        status
        priority
        type
        identifier
        labels
      }
      observations {
        type
        observable {
          id
          name
        }
        occurrences {
          type
          confidence
          boundingBox {
            left
            top
            width
            height
          }
          pageIndex
          startTime
          endTime
        }
      }
      parent {
        id
      }
      children {
        id
      }
      collections {
        id
      }
      feed {
        id
      }
      workflow {
        id
      }
      markdown
      links {
        uri
        linkType
      }
      error
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
          name
          type
          fileType
          fileName
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
    textUri
    audioUri
    markdown
  }
}
    `;
export const QueryConversations = gql`
    query QueryConversations($filter: ConversationFilter) {
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
export const CreateEvent = gql`
    mutation CreateEvent($event: EventInput!) {
  createEvent(event: $event) {
    id
    name
  }
}
    `;
export const DeleteAllEvents = gql`
    mutation DeleteAllEvents($filter: EventFilter!) {
  deleteAllEvents(filter: $filter) {
    id
    state
  }
}
    `;
export const DeleteEvent = gql`
    mutation DeleteEvent($id: ID!) {
  deleteEvent(id: $id) {
    id
    state
  }
}
    `;
export const DeleteEvents = gql`
    mutation DeleteEvents($ids: [ID!]!) {
  deleteEvents(ids: $ids) {
    id
    state
  }
}
    `;
export const GetEvent = gql`
    query GetEvent($id: ID!) {
  event(id: $id) {
    id
    name
    alternateNames
    creationDate
    address {
      streetAddress
      city
      region
      country
      postalCode
    }
    startDate
    endDate
    availabilityStartDate
    availabilityEndDate
    price
    minPrice
    maxPrice
    priceCurrency
    isAccessibleForFree
    typicalAgeRange
  }
}
    `;
export const QueryEvents = gql`
    query QueryEvents($filter: EventFilter!) {
  events(filter: $filter) {
    results {
      id
      name
      alternateNames
      creationDate
      address {
        streetAddress
        city
        region
        country
        postalCode
      }
      startDate
      endDate
      availabilityStartDate
      availabilityEndDate
      price
      minPrice
      maxPrice
      priceCurrency
      isAccessibleForFree
      typicalAgeRange
    }
  }
}
    `;
export const UpdateEvent = gql`
    mutation UpdateEvent($event: EventUpdateInput!) {
  updateEvent(event: $event) {
    id
    name
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
    query QueryFeeds($filter: FeedFilter) {
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
export const CreateLabel = gql`
    mutation CreateLabel($label: LabelInput!) {
  createLabel(label: $label) {
    id
    name
  }
}
    `;
export const DeleteAllLabels = gql`
    mutation DeleteAllLabels($filter: LabelFilter!) {
  deleteAllLabels(filter: $filter) {
    id
    state
  }
}
    `;
export const DeleteLabel = gql`
    mutation DeleteLabel($id: ID!) {
  deleteLabel(id: $id) {
    id
    state
  }
}
    `;
export const DeleteLabels = gql`
    mutation DeleteLabels($ids: [ID!]!) {
  deleteLabels(ids: $ids) {
    id
    state
  }
}
    `;
export const GetLabel = gql`
    query GetLabel($id: ID!) {
  label(id: $id) {
    id
    name
    description
    creationDate
  }
}
    `;
export const QueryLabels = gql`
    query QueryLabels($filter: LabelFilter!) {
  labels(filter: $filter) {
    results {
      id
      name
      description
      creationDate
    }
  }
}
    `;
export const UpdateLabel = gql`
    mutation UpdateLabel($label: LabelUpdateInput!) {
  updateLabel(label: $label) {
    id
    name
  }
}
    `;
export const CreateObservation = gql`
    mutation CreateObservation($observation: ObservationInput!) {
  createObservation(observation: $observation) {
    id
    state
  }
}
    `;
export const DeleteObservation = gql`
    mutation DeleteObservation($id: ID!) {
  deleteObservation(id: $id) {
    id
    state
  }
}
    `;
export const UpdateObservation = gql`
    mutation UpdateObservation($observation: ObservationUpdateInput!) {
  updateObservation(observation: $observation) {
    id
    state
  }
}
    `;
export const CreateOrganization = gql`
    mutation CreateOrganization($organization: OrganizationInput!) {
  createOrganization(organization: $organization) {
    id
    name
  }
}
    `;
export const DeleteAllOrganizations = gql`
    mutation DeleteAllOrganizations($filter: OrganizationFilter!) {
  deleteAllOrganizations(filter: $filter) {
    id
    state
  }
}
    `;
export const DeleteOrganization = gql`
    mutation DeleteOrganization($id: ID!) {
  deleteOrganization(id: $id) {
    id
    state
  }
}
    `;
export const DeleteOrganizations = gql`
    mutation DeleteOrganizations($ids: [ID!]!) {
  deleteOrganizations(ids: $ids) {
    id
    state
  }
}
    `;
export const GetOrganization = gql`
    query GetOrganization($id: ID!) {
  organization(id: $id) {
    id
    name
    alternateNames
    creationDate
    address {
      streetAddress
      city
      region
      country
      postalCode
    }
    foundingDate
    industries
    revenue
    revenueCurrency
    investment
    investmentCurrency
  }
}
    `;
export const QueryOrganizations = gql`
    query QueryOrganizations($filter: OrganizationFilter!) {
  organizations(filter: $filter) {
    results {
      id
      name
      alternateNames
      creationDate
      address {
        streetAddress
        city
        region
        country
        postalCode
      }
      foundingDate
      industries
      revenue
      revenueCurrency
      investment
      investmentCurrency
    }
  }
}
    `;
export const UpdateOrganization = gql`
    mutation UpdateOrganization($organization: OrganizationUpdateInput!) {
  updateOrganization(organization: $organization) {
    id
    name
  }
}
    `;
export const CreatePerson = gql`
    mutation CreatePerson($person: PersonInput!) {
  createPerson(person: $person) {
    id
    name
  }
}
    `;
export const DeleteAllPersons = gql`
    mutation DeleteAllPersons($filter: PersonFilter!) {
  deleteAllPersons(filter: $filter) {
    id
    state
  }
}
    `;
export const DeletePerson = gql`
    mutation DeletePerson($id: ID!) {
  deletePerson(id: $id) {
    id
    state
  }
}
    `;
export const DeletePersons = gql`
    mutation DeletePersons($ids: [ID!]!) {
  deletePersons(ids: $ids) {
    id
    state
  }
}
    `;
export const GetPerson = gql`
    query GetPerson($id: ID!) {
  person(id: $id) {
    id
    name
    alternateNames
    creationDate
    address {
      streetAddress
      city
      region
      country
      postalCode
    }
    email
    givenName
    familyName
    phoneNumber
    birthDate
    title
    occupation
    education
  }
}
    `;
export const QueryPersons = gql`
    query QueryPersons($filter: PersonFilter!) {
  persons(filter: $filter) {
    results {
      id
      name
      alternateNames
      creationDate
      address {
        streetAddress
        city
        region
        country
        postalCode
      }
      email
      givenName
      familyName
      phoneNumber
      birthDate
      title
      occupation
      education
    }
  }
}
    `;
export const UpdatePerson = gql`
    mutation UpdatePerson($person: PersonUpdateInput!) {
  updatePerson(person: $person) {
    id
    name
  }
}
    `;
export const CreatePlace = gql`
    mutation CreatePlace($place: PlaceInput!) {
  createPlace(place: $place) {
    id
    name
  }
}
    `;
export const DeleteAllPlaces = gql`
    mutation DeleteAllPlaces($filter: PlaceFilter!) {
  deleteAllPlaces(filter: $filter) {
    id
    state
  }
}
    `;
export const DeletePlace = gql`
    mutation DeletePlace($id: ID!) {
  deletePlace(id: $id) {
    id
    state
  }
}
    `;
export const DeletePlaces = gql`
    mutation DeletePlaces($ids: [ID!]!) {
  deletePlaces(ids: $ids) {
    id
    state
  }
}
    `;
export const GetPlace = gql`
    query GetPlace($id: ID!) {
  place(id: $id) {
    id
    name
    alternateNames
    creationDate
    address {
      streetAddress
      city
      region
      country
      postalCode
    }
  }
}
    `;
export const QueryPlaces = gql`
    query QueryPlaces($filter: PlaceFilter!) {
  places(filter: $filter) {
    results {
      id
      name
      alternateNames
      creationDate
      address {
        streetAddress
        city
        region
        country
        postalCode
      }
    }
  }
}
    `;
export const UpdatePlace = gql`
    mutation UpdatePlace($place: PlaceUpdateInput!) {
  updatePlace(place: $place) {
    id
    name
  }
}
    `;
export const CreateProduct = gql`
    mutation CreateProduct($product: ProductInput!) {
  createProduct(product: $product) {
    id
    name
  }
}
    `;
export const DeleteAllProducts = gql`
    mutation DeleteAllProducts($filter: ProductFilter!) {
  deleteAllProducts(filter: $filter) {
    id
    state
  }
}
    `;
export const DeleteProduct = gql`
    mutation DeleteProduct($id: ID!) {
  deleteProduct(id: $id) {
    id
    state
  }
}
    `;
export const DeleteProducts = gql`
    mutation DeleteProducts($ids: [ID!]!) {
  deleteProducts(ids: $ids) {
    id
    state
  }
}
    `;
export const GetProduct = gql`
    query GetProduct($id: ID!) {
  product(id: $id) {
    id
    name
    alternateNames
    creationDate
    address {
      streetAddress
      city
      region
      country
      postalCode
    }
    manufacturer
    model
    brand
    upc
    sku
    releaseDate
    productionDate
  }
}
    `;
export const QueryProducts = gql`
    query QueryProducts($filter: ProductFilter!) {
  products(filter: $filter) {
    results {
      id
      name
      alternateNames
      creationDate
      address {
        streetAddress
        city
        region
        country
        postalCode
      }
      manufacturer
      model
      brand
      upc
      sku
      releaseDate
      productionDate
    }
  }
}
    `;
export const UpdateProduct = gql`
    mutation UpdateProduct($product: ProductUpdateInput!) {
  updateProduct(product: $product) {
    id
    name
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
export const GetProject = gql`
    query GetProject {
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
export const CreateRepo = gql`
    mutation CreateRepo($repo: RepoInput!) {
  createRepo(repo: $repo) {
    id
    name
  }
}
    `;
export const DeleteAllRepos = gql`
    mutation DeleteAllRepos($filter: RepoFilter!) {
  deleteAllRepos(filter: $filter) {
    id
    state
  }
}
    `;
export const DeleteRepo = gql`
    mutation DeleteRepo($id: ID!) {
  deleteRepo(id: $id) {
    id
    state
  }
}
    `;
export const DeleteRepos = gql`
    mutation DeleteRepos($ids: [ID!]!) {
  deleteRepos(ids: $ids) {
    id
    state
  }
}
    `;
export const GetRepo = gql`
    query GetRepo($id: ID!) {
  repo(id: $id) {
    id
    name
    alternateNames
    creationDate
  }
}
    `;
export const QueryRepos = gql`
    query QueryRepos($filter: RepoFilter!) {
  repos(filter: $filter) {
    results {
      id
      name
      alternateNames
      creationDate
    }
  }
}
    `;
export const UpdateRepo = gql`
    mutation UpdateRepo($repo: RepoUpdateInput!) {
  updateRepo(repo: $repo) {
    id
    name
  }
}
    `;
export const CreateSoftware = gql`
    mutation CreateSoftware($software: SoftwareInput!) {
  createSoftware(software: $software) {
    id
    name
  }
}
    `;
export const DeleteAllSoftwares = gql`
    mutation DeleteAllSoftwares($filter: SoftwareFilter!) {
  deleteAllSoftwares(filter: $filter) {
    id
    state
  }
}
    `;
export const DeleteSoftware = gql`
    mutation DeleteSoftware($id: ID!) {
  deleteSoftware(id: $id) {
    id
    state
  }
}
    `;
export const DeleteSoftwares = gql`
    mutation DeleteSoftwares($ids: [ID!]!) {
  deleteSoftwares(ids: $ids) {
    id
    state
  }
}
    `;
export const GetSoftware = gql`
    query GetSoftware($id: ID!) {
  software(id: $id) {
    id
    name
    alternateNames
    creationDate
    releaseDate
    developer
  }
}
    `;
export const QuerySoftwares = gql`
    query QuerySoftwares($filter: SoftwareFilter!) {
  softwares(filter: $filter) {
    results {
      id
      name
      alternateNames
      creationDate
      releaseDate
      developer
    }
  }
}
    `;
export const UpdateSoftware = gql`
    mutation UpdateSoftware($software: SoftwareUpdateInput!) {
  updateSoftware(software: $software) {
    id
    name
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
    query QuerySpecifications($filter: SpecificationFilter) {
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
    query QueryWorkflows($filter: WorkflowFilter) {
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
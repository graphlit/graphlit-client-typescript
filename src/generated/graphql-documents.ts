import gql from 'graphql-tag';

export const CountAlerts = gql`
    query CountAlerts($filter: AlertFilter, $correlationId: String) {
  countAlerts(filter: $filter, correlationId: $correlationId) {
    count
  }
}
    `;
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
    mutation DeleteAlerts($ids: [ID!]!, $isSynchronous: Boolean) {
  deleteAlerts(ids: $ids, isSynchronous: $isSynchronous) {
    id
    state
  }
}
    `;
export const DeleteAllAlerts = gql`
    mutation DeleteAllAlerts($filter: AlertFilter, $isSynchronous: Boolean, $correlationId: String) {
  deleteAllAlerts(
    filter: $filter
    isSynchronous: $isSynchronous
    correlationId: $correlationId
  ) {
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
    query GetAlert($id: ID!, $correlationId: String) {
  alert(id: $id, correlationId: $correlationId) {
    id
    name
    creationDate
    modifiedDate
    owner {
      id
    }
    state
    correlationId
    type
    summaryPrompt
    publishPrompt
    view {
      id
    }
    filter {
      dateRange {
        from
        to
      }
      inLast
      creationDateRange {
        from
        to
      }
      createdInLast
      types
      fileTypes
      formats
      fileExtensions
      fileSizeRange {
        from
        to
      }
      similarContents {
        id
      }
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
      users {
        id
      }
      observations {
        type
        observable {
          id
        }
        states
      }
      or {
        feeds {
          id
        }
        workflows {
          id
        }
        collections {
          id
        }
        users {
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
      and {
        feeds {
          id
        }
        workflows {
          id
        }
        collections {
          id
        }
        users {
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
      hasObservations
      hasFeeds
      hasCollections
      hasWorkflows
      collectionMode
      observationMode
    }
    integration {
      type
      uri
      slack {
        token
        channel
      }
      email {
        from
        subject
        to
      }
      twitter {
        consumerKey
        consumerSecret
        accessTokenKey
        accessTokenSecret
      }
      mcp {
        token
        type
      }
    }
    publishing {
      type
      elevenLabs {
        model
        voice
      }
      openAIImage {
        model
        count
        seed {
          id
        }
      }
      googleImage {
        model
        count
        seed {
          id
        }
      }
      openAIVideo {
        model
        seconds
        size
        seed {
          id
        }
      }
      parallel {
        processor
      }
    }
    summarySpecification {
      id
    }
    publishSpecification {
      id
    }
    schedulePolicy {
      recurrenceType
      repeatInterval
      cron
      timeZoneId
    }
    lastAlertDate
  }
}
    `;
export const QueryAlerts = gql`
    query QueryAlerts($filter: AlertFilter, $correlationId: String) {
  alerts(filter: $filter, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      correlationId
      type
      summaryPrompt
      publishPrompt
      view {
        id
      }
      filter {
        dateRange {
          from
          to
        }
        inLast
        creationDateRange {
          from
          to
        }
        createdInLast
        types
        fileTypes
        formats
        fileExtensions
        fileSizeRange {
          from
          to
        }
        similarContents {
          id
        }
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
        users {
          id
        }
        observations {
          type
          observable {
            id
          }
          states
        }
        or {
          feeds {
            id
          }
          workflows {
            id
          }
          collections {
            id
          }
          users {
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
        and {
          feeds {
            id
          }
          workflows {
            id
          }
          collections {
            id
          }
          users {
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
        hasObservations
        hasFeeds
        hasCollections
        hasWorkflows
        collectionMode
        observationMode
      }
      integration {
        type
        uri
        slack {
          token
          channel
        }
        email {
          from
          subject
          to
        }
        twitter {
          consumerKey
          consumerSecret
          accessTokenKey
          accessTokenSecret
        }
        mcp {
          token
          type
        }
      }
      publishing {
        type
        elevenLabs {
          model
          voice
        }
        openAIImage {
          model
          count
          seed {
            id
          }
        }
        googleImage {
          model
          count
          seed {
            id
          }
        }
        openAIVideo {
          model
          seconds
          size
          seed {
            id
          }
        }
        parallel {
          processor
        }
      }
      summarySpecification {
        id
      }
      publishSpecification {
        id
      }
      schedulePolicy {
        recurrenceType
        repeatInterval
        cron
        timeZoneId
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
export const UpsertAlert = gql`
    mutation UpsertAlert($alert: AlertInput!) {
  upsertAlert(alert: $alert) {
    id
    name
    state
    type
  }
}
    `;
export const CountCategories = gql`
    query CountCategories($filter: CategoryFilter, $correlationId: String) {
  countCategories(filter: $filter, correlationId: $correlationId) {
    count
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
    mutation DeleteAllCategories($filter: CategoryFilter, $isSynchronous: Boolean, $correlationId: String) {
  deleteAllCategories(
    filter: $filter
    isSynchronous: $isSynchronous
    correlationId: $correlationId
  ) {
    id
    state
  }
}
    `;
export const DeleteCategories = gql`
    mutation DeleteCategories($ids: [ID!]!, $isSynchronous: Boolean) {
  deleteCategories(ids: $ids, isSynchronous: $isSynchronous) {
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
    query GetCategory($id: ID!, $correlationId: String) {
  category(id: $id, correlationId: $correlationId) {
    id
    name
    description
    creationDate
    feeds {
      id
      name
    }
  }
}
    `;
export const QueryCategories = gql`
    query QueryCategories($filter: CategoryFilter, $correlationId: String) {
  categories(filter: $filter, correlationId: $correlationId) {
    results {
      id
      name
      description
      creationDate
      relevance
      feeds {
        id
        name
      }
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
export const UpsertCategory = gql`
    mutation UpsertCategory($category: CategoryInput!) {
  upsertCategory(category: $category) {
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
export const CountCollections = gql`
    query CountCollections($filter: CollectionFilter, $correlationId: String) {
  countCollections(filter: $filter, correlationId: $correlationId) {
    count
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
    mutation DeleteAllCollections($filter: CollectionFilter, $isSynchronous: Boolean, $correlationId: String) {
  deleteAllCollections(
    filter: $filter
    isSynchronous: $isSynchronous
    correlationId: $correlationId
  ) {
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
    mutation DeleteCollections($ids: [ID!]!, $isSynchronous: Boolean) {
  deleteCollections(ids: $ids, isSynchronous: $isSynchronous) {
    id
    state
  }
}
    `;
export const GetCollection = gql`
    query GetCollection($id: ID!, $correlationId: String) {
  collection(id: $id, correlationId: $correlationId) {
    id
    name
    creationDate
    modifiedDate
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
    query QueryCollections($filter: CollectionFilter, $correlationId: String) {
  collections(filter: $filter, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      type
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
export const CountConnectors = gql`
    query CountConnectors($filter: ConnectorFilter, $correlationId: String) {
  countConnectors(filter: $filter, correlationId: $correlationId) {
    count
  }
}
    `;
export const CreateConnector = gql`
    mutation CreateConnector($connector: ConnectorInput!) {
  createConnector(connector: $connector) {
    id
    name
    state
    type
  }
}
    `;
export const DeleteConnector = gql`
    mutation DeleteConnector($id: ID!) {
  deleteConnector(id: $id) {
    id
    state
  }
}
    `;
export const GetConnector = gql`
    query GetConnector($id: ID!, $correlationId: String) {
  connector(id: $id, correlationId: $correlationId) {
    id
    name
    creationDate
    modifiedDate
    owner {
      id
    }
    state
    type
    authentication {
      type
      microsoft {
        tenantId
        clientId
        clientSecret
      }
      google {
        clientId
        clientSecret
      }
      oauth {
        provider
        clientId
        clientSecret
        refreshToken
        redirectUri
        metadata
      }
      arcade {
        authorizationId
        provider
        metadata
      }
    }
    integration {
      type
      uri
      slack {
        token
        channel
      }
      email {
        from
        subject
        to
      }
      twitter {
        consumerKey
        consumerSecret
        accessTokenKey
        accessTokenSecret
      }
      mcp {
        token
        type
      }
    }
  }
}
    `;
export const QueryConnectors = gql`
    query QueryConnectors($filter: ConnectorFilter, $correlationId: String) {
  connectors(filter: $filter, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      type
      authentication {
        type
        microsoft {
          tenantId
          clientId
          clientSecret
        }
        google {
          clientId
          clientSecret
        }
        oauth {
          provider
          clientId
          clientSecret
          refreshToken
          redirectUri
          metadata
        }
        arcade {
          authorizationId
          provider
          metadata
        }
      }
      integration {
        type
        uri
        slack {
          token
          channel
        }
        email {
          from
          subject
          to
        }
        twitter {
          consumerKey
          consumerSecret
          accessTokenKey
          accessTokenSecret
        }
        mcp {
          token
          type
        }
      }
    }
  }
}
    `;
export const UpdateConnector = gql`
    mutation UpdateConnector($connector: ConnectorUpdateInput!) {
  updateConnector(connector: $connector) {
    id
    name
    state
    type
  }
}
    `;
export const ApproveContent = gql`
    mutation ApproveContent($id: ID!) {
  approveContent(id: $id) {
    id
    state
  }
}
    `;
export const CountContents = gql`
    query CountContents($filter: ContentFilter, $correlationId: String) {
  countContents(filter: $filter, correlationId: $correlationId) {
    count
  }
}
    `;
export const DeleteAllContents = gql`
    mutation DeleteAllContents($filter: ContentFilter, $isSynchronous: Boolean, $correlationId: String) {
  deleteAllContents(
    filter: $filter
    isSynchronous: $isSynchronous
    correlationId: $correlationId
  ) {
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
    mutation DeleteContents($ids: [ID!]!, $isSynchronous: Boolean) {
  deleteContents(ids: $ids, isSynchronous: $isSynchronous) {
    id
    state
  }
}
    `;
export const DescribeEncodedImage = gql`
    mutation DescribeEncodedImage($prompt: String!, $mimeType: String!, $data: String!, $specification: EntityReferenceInput, $correlationId: String) {
  describeEncodedImage(
    prompt: $prompt
    mimeType: $mimeType
    data: $data
    specification: $specification
    correlationId: $correlationId
  ) {
    role
    author
    message
    citations {
      content {
        id
        name
        state
        originalDate
        identifier
        uri
        type
        fileType
        mimeType
        format
        formatName
        fileExtension
        fileName
        fileSize
        fileMetadata
        relativeFolderPath
        masterUri
        imageUri
        textUri
        audioUri
        transcriptUri
        snapshotsUri
        snapshotCount
        summary
        customSummary
        keywords
        bullets
        headlines
        posts
        chapters
        questions
        quotes
        video {
          width
          height
          duration
          make
          model
          software
          title
          description
          keywords
          author
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
          genre
          title
          description
          bitrate
          channels
          sampleRate
          bitsPerSample
          duration
        }
        image {
          width
          height
          resolutionX
          resolutionY
          bitsPerComponent
          components
          projectionType
          orientation
          description
          make
          model
          software
          lens
          focalLength
          exposureTime
          fNumber
          iso
          heading
          pitch
        }
        document {
          title
          subject
          summary
          author
          lastModifiedBy
          publisher
          description
          keywords
          pageCount
          worksheetCount
          slideCount
          wordCount
          lineCount
          paragraphCount
          isEncrypted
          hasDigitalSignature
        }
      }
      index
      text
      startTime
      endTime
      pageNumber
      frameNumber
    }
    toolCalls {
      id
      name
      arguments
    }
    tokens
    throughput
    ttft
    completionTime
    timestamp
    modelService
    model
    data
    mimeType
    toolCallId
    toolCallResponse
  }
}
    `;
export const DescribeImage = gql`
    mutation DescribeImage($prompt: String!, $uri: URL!, $specification: EntityReferenceInput, $correlationId: String) {
  describeImage(
    prompt: $prompt
    uri: $uri
    specification: $specification
    correlationId: $correlationId
  ) {
    role
    author
    message
    citations {
      content {
        id
        name
        state
        originalDate
        identifier
        uri
        type
        fileType
        mimeType
        format
        formatName
        fileExtension
        fileName
        fileSize
        fileMetadata
        relativeFolderPath
        masterUri
        imageUri
        textUri
        audioUri
        transcriptUri
        snapshotsUri
        snapshotCount
        summary
        customSummary
        keywords
        bullets
        headlines
        posts
        chapters
        questions
        quotes
        video {
          width
          height
          duration
          make
          model
          software
          title
          description
          keywords
          author
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
          genre
          title
          description
          bitrate
          channels
          sampleRate
          bitsPerSample
          duration
        }
        image {
          width
          height
          resolutionX
          resolutionY
          bitsPerComponent
          components
          projectionType
          orientation
          description
          make
          model
          software
          lens
          focalLength
          exposureTime
          fNumber
          iso
          heading
          pitch
        }
        document {
          title
          subject
          summary
          author
          lastModifiedBy
          publisher
          description
          keywords
          pageCount
          worksheetCount
          slideCount
          wordCount
          lineCount
          paragraphCount
          isEncrypted
          hasDigitalSignature
        }
      }
      index
      text
      startTime
      endTime
      pageNumber
      frameNumber
    }
    toolCalls {
      id
      name
      arguments
    }
    tokens
    throughput
    ttft
    completionTime
    timestamp
    modelService
    model
    data
    mimeType
    toolCallId
    toolCallResponse
  }
}
    `;
export const ExtractContents = gql`
    mutation ExtractContents($prompt: String!, $filter: ContentFilter, $specification: EntityReferenceInput, $tools: [ToolDefinitionInput!]!, $correlationId: String) {
  extractContents(
    prompt: $prompt
    filter: $filter
    specification: $specification
    tools: $tools
    correlationId: $correlationId
  ) {
    specification {
      id
    }
    content {
      id
    }
    name
    value
    startTime
    endTime
    pageNumber
    error
  }
}
    `;
export const ExtractObservables = gql`
    mutation ExtractObservables($text: String!, $textType: TextTypes, $specification: EntityReferenceInput, $observableTypes: [ObservableTypes!], $correlationId: String) {
  extractObservables(
    text: $text
    textType: $textType
    specification: $specification
    observableTypes: $observableTypes
    correlationId: $correlationId
  ) {
    labels {
      name
      metadata
    }
    categories {
      name
      metadata
    }
    emotions {
      name
      metadata
    }
    persons {
      name
      metadata
    }
    organizations {
      name
      metadata
    }
    places {
      name
      metadata
    }
    events {
      name
      metadata
    }
    products {
      name
      metadata
    }
    softwares {
      name
      metadata
    }
    repos {
      name
      metadata
    }
    investments {
      name
      metadata
    }
    investmentFunds {
      name
      metadata
    }
    medicalStudies {
      name
      metadata
    }
    medicalConditions {
      name
      metadata
    }
    medicalGuidelines {
      name
      metadata
    }
    medicalDrugs {
      name
      metadata
    }
    medicalDrugClasses {
      name
      metadata
    }
    medicalIndications {
      name
      metadata
    }
    medicalContraindications {
      name
      metadata
    }
    medicalProcedures {
      name
      metadata
    }
    medicalTherapies {
      name
      metadata
    }
    medicalDevices {
      name
      metadata
    }
    medicalTests {
      name
      metadata
    }
  }
}
    `;
export const ExtractText = gql`
    mutation ExtractText($prompt: String!, $text: String!, $textType: TextTypes, $specification: EntityReferenceInput, $tools: [ToolDefinitionInput!]!, $correlationId: String) {
  extractText(
    prompt: $prompt
    text: $text
    textType: $textType
    specification: $specification
    tools: $tools
    correlationId: $correlationId
  ) {
    specification {
      id
    }
    content {
      id
    }
    name
    value
    startTime
    endTime
    pageNumber
    error
  }
}
    `;
export const GetContent = gql`
    query GetContent($id: ID!, $correlationId: String) {
  content(id: $id, correlationId: $correlationId) {
    id
    name
    creationDate
    modifiedDate
    owner {
      id
    }
    state
    originalDate
    finishedDate
    fileCreationDate
    fileModifiedDate
    workflowDuration
    uri
    description
    identifier
    markdown
    html
    address {
      streetAddress
      city
      region
      country
      postalCode
    }
    location {
      latitude
      longitude
    }
    h3 {
      h3r0
      h3r1
      h3r2
      h3r3
      h3r4
      h3r5
      h3r6
      h3r7
      h3r8
      h3r9
      h3r10
      h3r11
      h3r12
      h3r13
      h3r14
      h3r15
    }
    boundary
    epsgCode
    path
    features
    c4id
    type
    fileType
    mimeType
    format
    formatName
    fileExtension
    fileName
    fileSize
    fileMetadata
    relativeFolderPath
    masterUri
    imageUri
    textUri
    audioUri
    transcriptUri
    snapshotsUri
    snapshotCount
    summary
    customSummary
    keywords
    bullets
    headlines
    posts
    chapters
    questions
    quotes
    video {
      width
      height
      duration
      make
      model
      software
      title
      description
      keywords
      author
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
      genre
      title
      description
      bitrate
      channels
      sampleRate
      bitsPerSample
      duration
    }
    image {
      width
      height
      resolutionX
      resolutionY
      bitsPerComponent
      components
      projectionType
      orientation
      description
      make
      model
      software
      lens
      focalLength
      exposureTime
      fNumber
      iso
      heading
      pitch
    }
    document {
      title
      subject
      summary
      author
      lastModifiedBy
      publisher
      description
      keywords
      pageCount
      worksheetCount
      slideCount
      wordCount
      lineCount
      paragraphCount
      isEncrypted
      hasDigitalSignature
    }
    email {
      identifier
      threadIdentifier
      subject
      labels
      sensitivity
      priority
      importance
      unsubscribeUrl
      publicationName
      publicationUrl
      attachmentCount
      from {
        name
        email
        givenName
        familyName
      }
      to {
        name
        email
        givenName
        familyName
      }
      cc {
        name
        email
        givenName
        familyName
      }
      bcc {
        name
        email
        givenName
        familyName
      }
    }
    event {
      eventIdentifier
      calendarIdentifier
      subject
      startDateTime
      endDateTime
      isAllDay
      timezone
      status
      visibility
      meetingLink
      organizer {
        name
        email
        isOptional
        isOrganizer
        responseStatus
      }
      attendees {
        name
        email
        isOptional
        isOrganizer
        responseStatus
      }
      categories
      reminders {
        minutesBefore
        method
      }
      recurrence {
        pattern
        interval
        count
        until
        daysOfWeek
        dayOfMonth
        monthOfYear
      }
      recurringEventIdentifier
      isRecurring
    }
    issue {
      identifier
      title
      project
      team
      status
      priority
      type
      labels
    }
    commit {
      sha
      message
      project
      team
      branch
      parentShas
      filesChanged
      additions
      deletions
      pullRequestNumber
      authorDate
      committerDate
      authors {
        name
        email
        givenName
        familyName
      }
      committers {
        name
        email
        givenName
        familyName
      }
      labels
      links
    }
    pullRequest {
      identifier
      title
      description
      project
      team
      status
      type
      baseBranch
      headBranch
      isDraft
      isMergeable
      mergeCommitSha
      mergedAt
      filesChanged
      additions
      deletions
      authors {
        name
        email
        givenName
        familyName
      }
      reviewers {
        name
        email
        givenName
        familyName
      }
      labels
      links
    }
    message {
      identifier
      conversationIdentifier
      channelIdentifier
      channelName
      attachmentCount
      links
      author {
        name
        email
        givenName
        familyName
      }
      mentions {
        name
        email
        givenName
        familyName
      }
    }
    post {
      identifier
      title
      author {
        name
        email
        givenName
        familyName
      }
      upvotes
      downvotes
      commentCount
      links
    }
    package {
      fileCount
      folderCount
      isEncrypted
    }
    meeting {
      title
      duration
      summary
      actionItems
      keywords
      organizer {
        name
        email
        givenName
        familyName
      }
      participants {
        name
        email
        givenName
        familyName
      }
      source
      externalId
    }
    transcript {
      duration
      segmentCount
      speakerCount
    }
    language {
      languages
    }
    parent {
      id
      name
    }
    children {
      id
      name
    }
    feed {
      id
      name
    }
    collections {
      id
      name
    }
    links {
      uri
      linkType
      excerpts
    }
    observations {
      id
      type
      observable {
        id
        name
      }
      related {
        id
        name
      }
      relatedType
      relation
      occurrences {
        type
        confidence
        startTime
        endTime
        pageIndex
        turnIndex
        boundingBox {
          left
          top
          width
          height
        }
      }
      state
    }
    facts {
      id
      text
      validAt
      invalidAt
      state
      category
      confidence
    }
    workflow {
      id
      name
    }
    pages {
      index
      text
      relevance
      images {
        id
        mimeType
        data
        left
        right
        top
        bottom
      }
      chunks {
        index
        pageIndex
        rowIndex
        columnIndex
        confidence
        text
        role
        language
        relevance
      }
    }
    segments {
      startTime
      endTime
      text
      relevance
    }
    frames {
      index
      description
      text
      relevance
    }
    error
  }
}
    `;
export const IngestBatch = gql`
    mutation IngestBatch($uris: [URL!]!, $workflow: EntityReferenceInput, $collections: [EntityReferenceInput!], $observations: [ObservationReferenceInput!], $correlationId: String) {
  ingestBatch(
    uris: $uris
    workflow: $workflow
    collections: $collections
    observations: $observations
    correlationId: $correlationId
  ) {
    id
    name
    state
    type
    fileType
    mimeType
    uri
    identifier
    collections {
      id
      name
    }
    observations {
      id
      type
      observable {
        id
        name
      }
      related {
        id
        name
      }
      relatedType
      relation
      occurrences {
        type
        confidence
        startTime
        endTime
        pageIndex
        turnIndex
        boundingBox {
          left
          top
          width
          height
        }
      }
      state
    }
  }
}
    `;
export const IngestEncodedFile = gql`
    mutation IngestEncodedFile($name: String!, $data: String!, $mimeType: String!, $id: ID, $identifier: String, $fileCreationDate: DateTime, $fileModifiedDate: DateTime, $isSynchronous: Boolean, $collections: [EntityReferenceInput!], $observations: [ObservationReferenceInput!], $workflow: EntityReferenceInput, $correlationId: String) {
  ingestEncodedFile(
    name: $name
    data: $data
    mimeType: $mimeType
    id: $id
    identifier: $identifier
    fileCreationDate: $fileCreationDate
    fileModifiedDate: $fileModifiedDate
    isSynchronous: $isSynchronous
    collections: $collections
    observations: $observations
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
    identifier
    collections {
      id
      name
    }
    observations {
      id
      type
      observable {
        id
        name
      }
      related {
        id
        name
      }
      relatedType
      relation
      occurrences {
        type
        confidence
        startTime
        endTime
        pageIndex
        turnIndex
        boundingBox {
          left
          top
          width
          height
        }
      }
      state
    }
  }
}
    `;
export const IngestEvent = gql`
    mutation IngestEvent($markdown: String!, $name: String, $description: String, $eventDate: DateTime, $id: ID, $identifier: String, $collections: [EntityReferenceInput!], $correlationId: String) {
  ingestEvent(
    name: $name
    description: $description
    eventDate: $eventDate
    markdown: $markdown
    id: $id
    identifier: $identifier
    collections: $collections
    correlationId: $correlationId
  ) {
    id
    name
    state
    type
    fileType
    mimeType
    uri
    identifier
    collections {
      id
      name
    }
    observations {
      id
      type
      observable {
        id
        name
      }
      related {
        id
        name
      }
      relatedType
      relation
      occurrences {
        type
        confidence
        startTime
        endTime
        pageIndex
        turnIndex
        boundingBox {
          left
          top
          width
          height
        }
      }
      state
    }
  }
}
    `;
export const IngestMemory = gql`
    mutation IngestMemory($text: String!, $name: String, $textType: TextTypes, $id: ID, $identifier: String, $collections: [EntityReferenceInput!], $correlationId: String) {
  ingestMemory(
    name: $name
    text: $text
    textType: $textType
    id: $id
    identifier: $identifier
    collections: $collections
    correlationId: $correlationId
  ) {
    id
    name
    state
    type
    fileType
    mimeType
    uri
    identifier
    collections {
      id
      name
    }
    observations {
      id
      type
      observable {
        id
        name
      }
      related {
        id
        name
      }
      relatedType
      relation
      occurrences {
        type
        confidence
        startTime
        endTime
        pageIndex
        turnIndex
        boundingBox {
          left
          top
          width
          height
        }
      }
      state
    }
  }
}
    `;
export const IngestText = gql`
    mutation IngestText($text: String!, $name: String, $textType: TextTypes, $uri: URL, $id: ID, $identifier: String, $isSynchronous: Boolean, $workflow: EntityReferenceInput, $collections: [EntityReferenceInput!], $observations: [ObservationReferenceInput!], $correlationId: String) {
  ingestText(
    name: $name
    text: $text
    textType: $textType
    uri: $uri
    id: $id
    isSynchronous: $isSynchronous
    workflow: $workflow
    identifier: $identifier
    collections: $collections
    observations: $observations
    correlationId: $correlationId
  ) {
    id
    name
    state
    type
    fileType
    mimeType
    uri
    identifier
    collections {
      id
      name
    }
    observations {
      id
      type
      observable {
        id
        name
      }
      related {
        id
        name
      }
      relatedType
      relation
      occurrences {
        type
        confidence
        startTime
        endTime
        pageIndex
        turnIndex
        boundingBox {
          left
          top
          width
          height
        }
      }
      state
    }
  }
}
    `;
export const IngestTextBatch = gql`
    mutation IngestTextBatch($batch: [TextContentInput!]!, $textType: TextTypes, $workflow: EntityReferenceInput, $collections: [EntityReferenceInput!], $observations: [ObservationReferenceInput!], $correlationId: String) {
  ingestTextBatch(
    batch: $batch
    workflow: $workflow
    textType: $textType
    collections: $collections
    observations: $observations
    correlationId: $correlationId
  ) {
    id
    name
    state
    type
    fileType
    mimeType
    uri
    identifier
    collections {
      id
      name
    }
    observations {
      id
      type
      observable {
        id
        name
      }
      related {
        id
        name
      }
      relatedType
      relation
      occurrences {
        type
        confidence
        startTime
        endTime
        pageIndex
        turnIndex
        boundingBox {
          left
          top
          width
          height
        }
      }
      state
    }
  }
}
    `;
export const IngestUri = gql`
    mutation IngestUri($name: String, $uri: URL!, $id: ID, $mimeType: String, $identifier: String, $isSynchronous: Boolean, $workflow: EntityReferenceInput, $collections: [EntityReferenceInput!], $observations: [ObservationReferenceInput!], $correlationId: String) {
  ingestUri(
    name: $name
    uri: $uri
    id: $id
    mimeType: $mimeType
    workflow: $workflow
    collections: $collections
    observations: $observations
    identifier: $identifier
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
    identifier
    collections {
      id
      name
    }
    observations {
      id
      type
      observable {
        id
        name
      }
      related {
        id
        name
      }
      relatedType
      relation
      occurrences {
        type
        confidence
        startTime
        endTime
        pageIndex
        turnIndex
        boundingBox {
          left
          top
          width
          height
        }
      }
      state
    }
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
export const LookupContents = gql`
    query LookupContents($ids: [ID!]!, $correlationId: String) {
  lookupContents(ids: $ids, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      owner {
        id
      }
      state
      originalDate
      finishedDate
      fileCreationDate
      fileModifiedDate
      workflowDuration
      uri
      description
      identifier
      markdown
      html
      address {
        streetAddress
        city
        region
        country
        postalCode
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
      boundary
      epsgCode
      path
      features
      c4id
      type
      fileType
      mimeType
      format
      formatName
      fileExtension
      fileName
      fileSize
      fileMetadata
      relativeFolderPath
      masterUri
      imageUri
      textUri
      audioUri
      transcriptUri
      snapshotsUri
      snapshotCount
      summary
      customSummary
      keywords
      bullets
      headlines
      posts
      chapters
      questions
      quotes
      video {
        width
        height
        duration
        make
        model
        software
        title
        description
        keywords
        author
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
        genre
        title
        description
        bitrate
        channels
        sampleRate
        bitsPerSample
        duration
      }
      image {
        width
        height
        resolutionX
        resolutionY
        bitsPerComponent
        components
        projectionType
        orientation
        description
        make
        model
        software
        lens
        focalLength
        exposureTime
        fNumber
        iso
        heading
        pitch
      }
      document {
        title
        subject
        summary
        author
        lastModifiedBy
        publisher
        description
        keywords
        pageCount
        worksheetCount
        slideCount
        wordCount
        lineCount
        paragraphCount
        isEncrypted
        hasDigitalSignature
      }
      email {
        identifier
        threadIdentifier
        subject
        labels
        sensitivity
        priority
        importance
        unsubscribeUrl
        publicationName
        publicationUrl
        attachmentCount
        from {
          name
          email
          givenName
          familyName
        }
        to {
          name
          email
          givenName
          familyName
        }
        cc {
          name
          email
          givenName
          familyName
        }
        bcc {
          name
          email
          givenName
          familyName
        }
      }
      event {
        eventIdentifier
        calendarIdentifier
        subject
        startDateTime
        endDateTime
        isAllDay
        timezone
        status
        visibility
        meetingLink
        organizer {
          name
          email
          isOptional
          isOrganizer
          responseStatus
        }
        attendees {
          name
          email
          isOptional
          isOrganizer
          responseStatus
        }
        categories
        reminders {
          minutesBefore
          method
        }
        recurrence {
          pattern
          interval
          count
          until
          daysOfWeek
          dayOfMonth
          monthOfYear
        }
        recurringEventIdentifier
        isRecurring
      }
      issue {
        identifier
        title
        project
        team
        status
        priority
        type
        labels
      }
      commit {
        sha
        message
        project
        team
        branch
        parentShas
        filesChanged
        additions
        deletions
        pullRequestNumber
        authorDate
        committerDate
        authors {
          name
          email
          givenName
          familyName
        }
        committers {
          name
          email
          givenName
          familyName
        }
        labels
        links
      }
      pullRequest {
        identifier
        title
        description
        project
        team
        status
        type
        baseBranch
        headBranch
        isDraft
        isMergeable
        mergeCommitSha
        mergedAt
        filesChanged
        additions
        deletions
        authors {
          name
          email
          givenName
          familyName
        }
        reviewers {
          name
          email
          givenName
          familyName
        }
        labels
        links
      }
      message {
        identifier
        conversationIdentifier
        channelIdentifier
        channelName
        attachmentCount
        links
        author {
          name
          email
          givenName
          familyName
        }
        mentions {
          name
          email
          givenName
          familyName
        }
      }
      post {
        identifier
        title
        author {
          name
          email
          givenName
          familyName
        }
        upvotes
        downvotes
        commentCount
        links
      }
      package {
        fileCount
        folderCount
        isEncrypted
      }
      meeting {
        title
        duration
        summary
        actionItems
        keywords
        organizer {
          name
          email
          givenName
          familyName
        }
        participants {
          name
          email
          givenName
          familyName
        }
        source
        externalId
      }
      transcript {
        duration
        segmentCount
        speakerCount
      }
      language {
        languages
      }
      feed {
        id
        name
      }
      collections {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      observations {
        id
        type
        observable {
          id
          name
        }
        related {
          id
          name
        }
        relatedType
        relation
        occurrences {
          type
          confidence
          startTime
          endTime
          pageIndex
          turnIndex
          boundingBox {
            left
            top
            width
            height
          }
        }
        state
      }
      facts {
        id
        text
        validAt
        invalidAt
        state
        category
        confidence
      }
      workflow {
        id
        name
      }
      pages {
        index
        text
        relevance
        images {
          id
          mimeType
          data
          left
          right
          top
          bottom
        }
        chunks {
          index
          pageIndex
          rowIndex
          columnIndex
          confidence
          text
          role
          language
          relevance
        }
      }
      segments {
        startTime
        endTime
        text
        relevance
      }
      frames {
        index
        description
        text
        relevance
      }
      error
    }
  }
}
    `;
export const LookupEntity = gql`
    query LookupEntity($filter: EntityRelationshipsFilter!, $correlationId: String) {
  lookupEntity(filter: $filter, correlationId: $correlationId) {
    entity {
      id
      name
      type
      metadata
    }
    relationships {
      relation
      direction
      entity {
        id
        name
        type
        metadata
      }
    }
    totalCount
  }
}
    `;
export const PublishContents = gql`
    mutation PublishContents($summaryPrompt: String, $publishPrompt: String!, $connector: ContentPublishingConnectorInput!, $filter: ContentFilter, $includeDetails: Boolean, $isSynchronous: Boolean, $correlationId: String, $name: String, $summarySpecification: EntityReferenceInput, $publishSpecification: EntityReferenceInput, $workflow: EntityReferenceInput) {
  publishContents(
    summaryPrompt: $summaryPrompt
    publishPrompt: $publishPrompt
    connector: $connector
    filter: $filter
    includeDetails: $includeDetails
    isSynchronous: $isSynchronous
    correlationId: $correlationId
    name: $name
    summarySpecification: $summarySpecification
    publishSpecification: $publishSpecification
    workflow: $workflow
  ) {
    contents {
      id
      name
      state
      originalDate
      identifier
      markdown
      uri
      type
      fileType
      mimeType
      format
      formatName
      fileExtension
      fileName
      fileSize
      fileMetadata
      relativeFolderPath
      masterUri
      imageUri
      textUri
      audioUri
      transcriptUri
      snapshotsUri
      snapshotCount
      summary
      customSummary
      keywords
      bullets
      headlines
      posts
      chapters
      questions
      quotes
      video {
        width
        height
        duration
        make
        model
        software
        title
        description
        keywords
        author
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
        genre
        title
        description
        bitrate
        channels
        sampleRate
        bitsPerSample
        duration
      }
      image {
        width
        height
        resolutionX
        resolutionY
        bitsPerComponent
        components
        projectionType
        orientation
        description
        make
        model
        software
        lens
        focalLength
        exposureTime
        fNumber
        iso
        heading
        pitch
      }
      document {
        title
        subject
        summary
        author
        lastModifiedBy
        publisher
        description
        keywords
        pageCount
        worksheetCount
        slideCount
        wordCount
        lineCount
        paragraphCount
        isEncrypted
        hasDigitalSignature
      }
    }
    details {
      contents {
        id
      }
      summaries
      text
      textType
      summarySpecification
      publishSpecification
      summaryTime
      publishTime
    }
  }
}
    `;
export const PublishText = gql`
    mutation PublishText($text: String!, $textType: TextTypes, $connector: ContentPublishingConnectorInput!, $isSynchronous: Boolean, $correlationId: String, $name: String, $workflow: EntityReferenceInput) {
  publishText(
    text: $text
    textType: $textType
    connector: $connector
    isSynchronous: $isSynchronous
    correlationId: $correlationId
    name: $name
    workflow: $workflow
  ) {
    contents {
      id
      name
      state
      originalDate
      identifier
      markdown
      uri
      type
      fileType
      mimeType
      format
      formatName
      fileExtension
      fileName
      fileSize
      fileMetadata
      relativeFolderPath
      masterUri
      imageUri
      textUri
      audioUri
      transcriptUri
      snapshotsUri
      snapshotCount
      summary
      customSummary
      keywords
      bullets
      headlines
      posts
      chapters
      questions
      quotes
      video {
        width
        height
        duration
        make
        model
        software
        title
        description
        keywords
        author
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
        genre
        title
        description
        bitrate
        channels
        sampleRate
        bitsPerSample
        duration
      }
      image {
        width
        height
        resolutionX
        resolutionY
        bitsPerComponent
        components
        projectionType
        orientation
        description
        make
        model
        software
        lens
        focalLength
        exposureTime
        fNumber
        iso
        heading
        pitch
      }
      document {
        title
        subject
        summary
        author
        lastModifiedBy
        publisher
        description
        keywords
        pageCount
        worksheetCount
        slideCount
        wordCount
        lineCount
        paragraphCount
        isEncrypted
        hasDigitalSignature
      }
    }
    details {
      contents {
        id
      }
      summaries
      text
      textType
      summarySpecification
      publishSpecification
      summaryTime
      publishTime
    }
  }
}
    `;
export const QueryContents = gql`
    query QueryContents($filter: ContentFilter, $correlationId: String) {
  contents(filter: $filter, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      originalDate
      finishedDate
      workflowDuration
      uri
      description
      identifier
      address {
        streetAddress
        city
        region
        country
        postalCode
      }
      location {
        latitude
        longitude
      }
      features
      type
      fileType
      mimeType
      format
      formatName
      fileExtension
      fileName
      fileSize
      relativeFolderPath
      masterUri
      imageUri
      textUri
      audioUri
      transcriptUri
      snapshotsUri
      snapshotCount
      summary
      customSummary
      quotes
      video {
        width
        height
        duration
        make
        model
        software
        title
        description
        keywords
        author
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
        genre
        title
        description
        bitrate
        channels
        sampleRate
        bitsPerSample
        duration
      }
      image {
        width
        height
        resolutionX
        resolutionY
        bitsPerComponent
        components
        projectionType
        orientation
        description
        make
        model
        software
        lens
        focalLength
        exposureTime
        fNumber
        iso
        heading
        pitch
      }
      document {
        title
        subject
        summary
        author
        lastModifiedBy
        publisher
        description
        keywords
        pageCount
        worksheetCount
        slideCount
        wordCount
        lineCount
        paragraphCount
        isEncrypted
        hasDigitalSignature
      }
      email {
        identifier
        threadIdentifier
        subject
        labels
        sensitivity
        priority
        importance
        unsubscribeUrl
        publicationName
        publicationUrl
        attachmentCount
        from {
          name
          email
          givenName
          familyName
        }
        to {
          name
          email
          givenName
          familyName
        }
        cc {
          name
          email
          givenName
          familyName
        }
        bcc {
          name
          email
          givenName
          familyName
        }
      }
      event {
        eventIdentifier
        calendarIdentifier
        subject
        startDateTime
        endDateTime
        isAllDay
        timezone
        status
        visibility
        meetingLink
        organizer {
          name
          email
          isOptional
          isOrganizer
          responseStatus
        }
        attendees {
          name
          email
          isOptional
          isOrganizer
          responseStatus
        }
        categories
        reminders {
          minutesBefore
          method
        }
        recurrence {
          pattern
          interval
          count
          until
          daysOfWeek
          dayOfMonth
          monthOfYear
        }
        recurringEventIdentifier
        isRecurring
      }
      issue {
        identifier
        title
        project
        team
        status
        priority
        type
        labels
      }
      commit {
        sha
        message
        project
        team
        branch
        parentShas
        filesChanged
        additions
        deletions
        pullRequestNumber
        authorDate
        committerDate
        authors {
          name
          email
          givenName
          familyName
        }
        committers {
          name
          email
          givenName
          familyName
        }
        labels
        links
      }
      pullRequest {
        identifier
        title
        description
        project
        team
        status
        type
        baseBranch
        headBranch
        isDraft
        isMergeable
        mergeCommitSha
        mergedAt
        filesChanged
        additions
        deletions
        authors {
          name
          email
          givenName
          familyName
        }
        reviewers {
          name
          email
          givenName
          familyName
        }
        labels
        links
      }
      message {
        identifier
        conversationIdentifier
        channelIdentifier
        channelName
        attachmentCount
        links
        author {
          name
          email
          givenName
          familyName
        }
        mentions {
          name
          email
          givenName
          familyName
        }
      }
      post {
        identifier
        title
        author {
          name
          email
          givenName
          familyName
        }
        upvotes
        downvotes
        commentCount
        links
      }
      package {
        fileCount
        folderCount
        isEncrypted
      }
      meeting {
        title
        duration
        summary
        actionItems
        keywords
        organizer {
          name
          email
          givenName
          familyName
        }
        participants {
          name
          email
          givenName
          familyName
        }
        source
        externalId
      }
      transcript {
        duration
        segmentCount
        speakerCount
      }
      language {
        languages
      }
      feed {
        id
        name
      }
      workflow {
        id
        name
      }
      pages {
        index
        text
        relevance
        images {
          id
          mimeType
          data
          left
          right
          top
          bottom
        }
        chunks {
          index
          pageIndex
          rowIndex
          columnIndex
          confidence
          text
          role
          language
          relevance
        }
      }
      segments {
        startTime
        endTime
        text
        relevance
      }
      frames {
        index
        description
        text
        relevance
      }
      error
    }
  }
}
    `;
export const QueryContentsFacets = gql`
    query QueryContentsFacets($filter: ContentFilter, $facets: [ContentFacetInput!], $correlationId: String) {
  contents(filter: $filter, facets: $facets, correlationId: $correlationId) {
    facets {
      facet
      count
      type
      value
      range {
        from
        to
      }
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
export const QueryContentsGraph = gql`
    query QueryContentsGraph($filter: ContentFilter, $graph: ContentGraphInput, $correlationId: String) {
  contents(filter: $filter, graph: $graph, correlationId: $correlationId) {
    graph {
      nodes {
        id
        name
        type
        metadata
      }
      edges {
        from
        to
        relation
      }
    }
  }
}
    `;
export const QueryContentsObservations = gql`
    query QueryContentsObservations($filter: ContentFilter, $correlationId: String) {
  contents(filter: $filter, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      originalDate
      finishedDate
      workflowDuration
      uri
      description
      identifier
      address {
        streetAddress
        city
        region
        country
        postalCode
      }
      location {
        latitude
        longitude
      }
      features
      type
      fileType
      mimeType
      format
      formatName
      fileExtension
      fileName
      fileSize
      relativeFolderPath
      masterUri
      imageUri
      textUri
      audioUri
      transcriptUri
      snapshotsUri
      snapshotCount
      summary
      customSummary
      quotes
      video {
        width
        height
        duration
        make
        model
        software
        title
        description
        keywords
        author
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
        genre
        title
        description
        bitrate
        channels
        sampleRate
        bitsPerSample
        duration
      }
      image {
        width
        height
        resolutionX
        resolutionY
        bitsPerComponent
        components
        projectionType
        orientation
        description
        make
        model
        software
        lens
        focalLength
        exposureTime
        fNumber
        iso
        heading
        pitch
      }
      document {
        title
        subject
        summary
        author
        lastModifiedBy
        publisher
        description
        keywords
        pageCount
        worksheetCount
        slideCount
        wordCount
        lineCount
        paragraphCount
        isEncrypted
        hasDigitalSignature
      }
      email {
        identifier
        threadIdentifier
        subject
        labels
        sensitivity
        priority
        importance
        unsubscribeUrl
        publicationName
        publicationUrl
        attachmentCount
        from {
          name
          email
          givenName
          familyName
        }
        to {
          name
          email
          givenName
          familyName
        }
        cc {
          name
          email
          givenName
          familyName
        }
        bcc {
          name
          email
          givenName
          familyName
        }
      }
      event {
        eventIdentifier
        calendarIdentifier
        subject
        startDateTime
        endDateTime
        isAllDay
        timezone
        status
        visibility
        meetingLink
        organizer {
          name
          email
          isOptional
          isOrganizer
          responseStatus
        }
        attendees {
          name
          email
          isOptional
          isOrganizer
          responseStatus
        }
        categories
        reminders {
          minutesBefore
          method
        }
        recurrence {
          pattern
          interval
          count
          until
          daysOfWeek
          dayOfMonth
          monthOfYear
        }
        recurringEventIdentifier
        isRecurring
      }
      issue {
        identifier
        title
        project
        team
        status
        priority
        type
        labels
      }
      commit {
        sha
        message
        project
        team
        branch
        parentShas
        filesChanged
        additions
        deletions
        pullRequestNumber
        authorDate
        committerDate
        authors {
          name
          email
          givenName
          familyName
        }
        committers {
          name
          email
          givenName
          familyName
        }
        labels
        links
      }
      pullRequest {
        identifier
        title
        description
        project
        team
        status
        type
        baseBranch
        headBranch
        isDraft
        isMergeable
        mergeCommitSha
        mergedAt
        filesChanged
        additions
        deletions
        authors {
          name
          email
          givenName
          familyName
        }
        reviewers {
          name
          email
          givenName
          familyName
        }
        labels
        links
      }
      message {
        identifier
        conversationIdentifier
        channelIdentifier
        channelName
        attachmentCount
        links
        author {
          name
          email
          givenName
          familyName
        }
        mentions {
          name
          email
          givenName
          familyName
        }
      }
      post {
        identifier
        title
        author {
          name
          email
          givenName
          familyName
        }
        upvotes
        downvotes
        commentCount
        links
      }
      package {
        fileCount
        folderCount
        isEncrypted
      }
      meeting {
        title
        duration
        summary
        actionItems
        keywords
        organizer {
          name
          email
          givenName
          familyName
        }
        participants {
          name
          email
          givenName
          familyName
        }
        source
        externalId
      }
      transcript {
        duration
        segmentCount
        speakerCount
      }
      language {
        languages
      }
      feed {
        id
        name
      }
      workflow {
        id
        name
      }
      pages {
        index
        text
        relevance
        images {
          id
          mimeType
          data
          left
          right
          top
          bottom
        }
        chunks {
          index
          pageIndex
          rowIndex
          columnIndex
          confidence
          text
          role
          language
          relevance
        }
      }
      segments {
        startTime
        endTime
        text
        relevance
      }
      frames {
        index
        description
        text
        relevance
      }
      error
      markdown
      observations {
        id
        type
        observable {
          id
          name
        }
        related {
          id
          name
        }
        relatedType
        relation
        occurrences {
          type
          confidence
          startTime
          endTime
          pageIndex
          turnIndex
          boundingBox {
            left
            top
            width
            height
          }
        }
        state
      }
    }
  }
}
    `;
export const QueryGraph = gql`
    query QueryGraph($filter: GraphFilter, $graph: GraphInput, $correlationId: String) {
  graph(filter: $filter, graph: $graph, correlationId: $correlationId) {
    nodes {
      id
      name
      type
      metadata
    }
    edges {
      from
      to
      relation
    }
  }
}
    `;
export const QueryObservables = gql`
    query QueryObservables($filter: ContentFilter, $correlationId: String) {
  observables(filter: $filter, correlationId: $correlationId) {
    results {
      type
      observable {
        id
        name
      }
    }
  }
}
    `;
export const RejectContent = gql`
    mutation RejectContent($id: ID!, $reason: String) {
  rejectContent(id: $id, reason: $reason) {
    id
    state
  }
}
    `;
export const ResearchContents = gql`
    mutation ResearchContents($connector: ContentPublishingConnectorInput!, $filter: ContentFilter, $name: String, $summarySpecification: EntityReferenceInput, $publishSpecification: EntityReferenceInput, $workflow: EntityReferenceInput, $correlationId: String) {
  researchContents(
    connector: $connector
    filter: $filter
    name: $name
    summarySpecification: $summarySpecification
    publishSpecification: $publishSpecification
    workflow: $workflow
    correlationId: $correlationId
  ) {
    result
  }
}
    `;
export const RestartContent = gql`
    mutation RestartContent($id: ID!) {
  restartContent(id: $id) {
    id
    state
  }
}
    `;
export const ScreenshotPage = gql`
    mutation ScreenshotPage($uri: URL!, $maximumHeight: Int, $isSynchronous: Boolean, $workflow: EntityReferenceInput, $collections: [EntityReferenceInput!], $correlationId: String) {
  screenshotPage(
    uri: $uri
    maximumHeight: $maximumHeight
    workflow: $workflow
    collections: $collections
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
    identifier
    collections {
      id
      name
    }
    observations {
      id
      type
      observable {
        id
        name
      }
      related {
        id
        name
      }
      relatedType
      relation
      occurrences {
        type
        confidence
        startTime
        endTime
        pageIndex
        turnIndex
        boundingBox {
          left
          top
          width
          height
        }
      }
      state
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
export const SummarizeText = gql`
    mutation SummarizeText($summarization: SummarizationStrategyInput!, $text: String!, $textType: TextTypes, $correlationId: String) {
  summarizeText(
    summarization: $summarization
    text: $text
    textType: $textType
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
    identifier
    collections {
      id
      name
    }
    observations {
      id
      type
      observable {
        id
        name
      }
      related {
        id
        name
      }
      relatedType
      relation
      occurrences {
        type
        confidence
        startTime
        endTime
        pageIndex
        turnIndex
        boundingBox {
          left
          top
          width
          height
        }
      }
      state
    }
  }
}
    `;
export const AskGraphlit = gql`
    mutation AskGraphlit($prompt: String!, $type: SdkTypes, $id: ID, $specification: EntityReferenceInput, $correlationId: String) {
  askGraphlit(
    prompt: $prompt
    type: $type
    id: $id
    specification: $specification
    correlationId: $correlationId
  ) {
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
          state
          originalDate
          identifier
          uri
          type
          fileType
          mimeType
          format
          formatName
          fileExtension
          fileName
          fileSize
          fileMetadata
          relativeFolderPath
          masterUri
          imageUri
          textUri
          audioUri
          transcriptUri
          snapshotsUri
          snapshotCount
          summary
          customSummary
          keywords
          bullets
          headlines
          posts
          chapters
          questions
          quotes
          video {
            width
            height
            duration
            make
            model
            software
            title
            description
            keywords
            author
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
            genre
            title
            description
            bitrate
            channels
            sampleRate
            bitsPerSample
            duration
          }
          image {
            width
            height
            resolutionX
            resolutionY
            bitsPerComponent
            components
            projectionType
            orientation
            description
            make
            model
            software
            lens
            focalLength
            exposureTime
            fNumber
            iso
            heading
            pitch
          }
          document {
            title
            subject
            summary
            author
            lastModifiedBy
            publisher
            description
            keywords
            pageCount
            worksheetCount
            slideCount
            wordCount
            lineCount
            paragraphCount
            isEncrypted
            hasDigitalSignature
          }
        }
        index
        text
        startTime
        endTime
        pageNumber
        frameNumber
      }
      toolCalls {
        id
        name
        arguments
      }
      tokens
      throughput
      ttft
      completionTime
      timestamp
      modelService
      model
      data
      mimeType
      toolCallId
      toolCallResponse
    }
    messageCount
  }
}
    `;
export const BranchConversation = gql`
    mutation BranchConversation($id: ID!) {
  branchConversation(id: $id) {
    id
    name
    state
    type
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
export const CompleteConversation = gql`
    mutation CompleteConversation($completion: String!, $id: ID!, $completionTime: TimeSpan, $ttft: TimeSpan, $throughput: Float, $correlationId: String) {
  completeConversation(
    completion: $completion
    id: $id
    completionTime: $completionTime
    ttft: $ttft
    throughput: $throughput
    correlationId: $correlationId
  ) {
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
          state
          originalDate
          identifier
          uri
          type
          fileType
          mimeType
          format
          formatName
          fileExtension
          fileName
          fileSize
          fileMetadata
          relativeFolderPath
          masterUri
          imageUri
          textUri
          audioUri
          transcriptUri
          snapshotsUri
          snapshotCount
          summary
          customSummary
          keywords
          bullets
          headlines
          posts
          chapters
          questions
          quotes
          video {
            width
            height
            duration
            make
            model
            software
            title
            description
            keywords
            author
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
            genre
            title
            description
            bitrate
            channels
            sampleRate
            bitsPerSample
            duration
          }
          image {
            width
            height
            resolutionX
            resolutionY
            bitsPerComponent
            components
            projectionType
            orientation
            description
            make
            model
            software
            lens
            focalLength
            exposureTime
            fNumber
            iso
            heading
            pitch
          }
          document {
            title
            subject
            summary
            author
            lastModifiedBy
            publisher
            description
            keywords
            pageCount
            worksheetCount
            slideCount
            wordCount
            lineCount
            paragraphCount
            isEncrypted
            hasDigitalSignature
          }
        }
        index
        text
        startTime
        endTime
        pageNumber
        frameNumber
      }
      toolCalls {
        id
        name
        arguments
      }
      tokens
      throughput
      ttft
      completionTime
      timestamp
      modelService
      model
      data
      mimeType
      toolCallId
      toolCallResponse
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
    graph {
      nodes {
        id
        name
        type
        metadata
      }
      edges {
        from
        to
        relation
      }
    }
    details {
      modelService
      model
      supportsToolCalling
      sourceCount
      observableCount
      toolCount
      renderedSourceCount
      renderedObservableCount
      renderedToolCount
      rankedSourceCount
      rankedObservableCount
      rankedToolCount
      tokenLimit
      completionTokenLimit
      sources
      formattedSources
      formattedObservables
      formattedInstructions
      formattedTools
      specification
      messages {
        role
        author
        message
        citations {
          content {
            id
            name
            state
            originalDate
            identifier
            uri
            type
            fileType
            mimeType
            format
            formatName
            fileExtension
            fileName
            fileSize
            fileMetadata
            relativeFolderPath
            masterUri
            imageUri
            textUri
            audioUri
            transcriptUri
            snapshotsUri
            snapshotCount
            summary
            customSummary
            keywords
            bullets
            headlines
            posts
            chapters
            questions
            quotes
            video {
              width
              height
              duration
              make
              model
              software
              title
              description
              keywords
              author
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
              genre
              title
              description
              bitrate
              channels
              sampleRate
              bitsPerSample
              duration
            }
            image {
              width
              height
              resolutionX
              resolutionY
              bitsPerComponent
              components
              projectionType
              orientation
              description
              make
              model
              software
              lens
              focalLength
              exposureTime
              fNumber
              iso
              heading
              pitch
            }
            document {
              title
              subject
              summary
              author
              lastModifiedBy
              publisher
              description
              keywords
              pageCount
              worksheetCount
              slideCount
              wordCount
              lineCount
              paragraphCount
              isEncrypted
              hasDigitalSignature
            }
          }
          index
          text
          startTime
          endTime
          pageNumber
          frameNumber
        }
        toolCalls {
          id
          name
          arguments
        }
        tokens
        throughput
        ttft
        completionTime
        timestamp
        modelService
        model
        data
        mimeType
        toolCallId
        toolCallResponse
      }
    }
  }
}
    `;
export const ContinueConversation = gql`
    mutation ContinueConversation($id: ID!, $responses: [ConversationToolResponseInput!]!, $correlationId: String) {
  continueConversation(
    id: $id
    responses: $responses
    correlationId: $correlationId
  ) {
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
          state
          originalDate
          identifier
          uri
          type
          fileType
          mimeType
          format
          formatName
          fileExtension
          fileName
          fileSize
          fileMetadata
          relativeFolderPath
          masterUri
          imageUri
          textUri
          audioUri
          transcriptUri
          snapshotsUri
          snapshotCount
          summary
          customSummary
          keywords
          bullets
          headlines
          posts
          chapters
          questions
          quotes
          video {
            width
            height
            duration
            make
            model
            software
            title
            description
            keywords
            author
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
            genre
            title
            description
            bitrate
            channels
            sampleRate
            bitsPerSample
            duration
          }
          image {
            width
            height
            resolutionX
            resolutionY
            bitsPerComponent
            components
            projectionType
            orientation
            description
            make
            model
            software
            lens
            focalLength
            exposureTime
            fNumber
            iso
            heading
            pitch
          }
          document {
            title
            subject
            summary
            author
            lastModifiedBy
            publisher
            description
            keywords
            pageCount
            worksheetCount
            slideCount
            wordCount
            lineCount
            paragraphCount
            isEncrypted
            hasDigitalSignature
          }
        }
        index
        text
        startTime
        endTime
        pageNumber
        frameNumber
      }
      toolCalls {
        id
        name
        arguments
      }
      tokens
      throughput
      ttft
      completionTime
      timestamp
      modelService
      model
      data
      mimeType
      toolCallId
      toolCallResponse
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
    graph {
      nodes {
        id
        name
        type
        metadata
      }
      edges {
        from
        to
        relation
      }
    }
    details {
      modelService
      model
      supportsToolCalling
      sourceCount
      observableCount
      toolCount
      renderedSourceCount
      renderedObservableCount
      renderedToolCount
      rankedSourceCount
      rankedObservableCount
      rankedToolCount
      tokenLimit
      completionTokenLimit
      sources
      formattedSources
      formattedObservables
      formattedInstructions
      formattedTools
      specification
      messages {
        role
        author
        message
        citations {
          content {
            id
            name
            state
            originalDate
            identifier
            uri
            type
            fileType
            mimeType
            format
            formatName
            fileExtension
            fileName
            fileSize
            fileMetadata
            relativeFolderPath
            masterUri
            imageUri
            textUri
            audioUri
            transcriptUri
            snapshotsUri
            snapshotCount
            summary
            customSummary
            keywords
            bullets
            headlines
            posts
            chapters
            questions
            quotes
            video {
              width
              height
              duration
              make
              model
              software
              title
              description
              keywords
              author
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
              genre
              title
              description
              bitrate
              channels
              sampleRate
              bitsPerSample
              duration
            }
            image {
              width
              height
              resolutionX
              resolutionY
              bitsPerComponent
              components
              projectionType
              orientation
              description
              make
              model
              software
              lens
              focalLength
              exposureTime
              fNumber
              iso
              heading
              pitch
            }
            document {
              title
              subject
              summary
              author
              lastModifiedBy
              publisher
              description
              keywords
              pageCount
              worksheetCount
              slideCount
              wordCount
              lineCount
              paragraphCount
              isEncrypted
              hasDigitalSignature
            }
          }
          index
          text
          startTime
          endTime
          pageNumber
          frameNumber
        }
        toolCalls {
          id
          name
          arguments
        }
        tokens
        throughput
        ttft
        completionTime
        timestamp
        modelService
        model
        data
        mimeType
        toolCallId
        toolCallResponse
      }
    }
  }
}
    `;
export const CountConversations = gql`
    query CountConversations($filter: ConversationFilter, $correlationId: String) {
  countConversations(filter: $filter, correlationId: $correlationId) {
    count
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
    mutation DeleteAllConversations($filter: ConversationFilter, $isSynchronous: Boolean, $correlationId: String) {
  deleteAllConversations(
    filter: $filter
    isSynchronous: $isSynchronous
    correlationId: $correlationId
  ) {
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
    mutation DeleteConversations($ids: [ID!]!, $isSynchronous: Boolean) {
  deleteConversations(ids: $ids, isSynchronous: $isSynchronous) {
    id
    state
  }
}
    `;
export const FormatConversation = gql`
    mutation FormatConversation($prompt: String!, $id: ID, $specification: EntityReferenceInput, $tools: [ToolDefinitionInput!], $systemPrompt: String, $includeDetails: Boolean, $correlationId: String) {
  formatConversation(
    prompt: $prompt
    id: $id
    specification: $specification
    tools: $tools
    systemPrompt: $systemPrompt
    includeDetails: $includeDetails
    correlationId: $correlationId
  ) {
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
          state
          originalDate
          identifier
          uri
          type
          fileType
          mimeType
          format
          formatName
          fileExtension
          fileName
          fileSize
          fileMetadata
          relativeFolderPath
          masterUri
          imageUri
          textUri
          audioUri
          transcriptUri
          snapshotsUri
          snapshotCount
          summary
          customSummary
          keywords
          bullets
          headlines
          posts
          chapters
          questions
          quotes
          video {
            width
            height
            duration
            make
            model
            software
            title
            description
            keywords
            author
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
            genre
            title
            description
            bitrate
            channels
            sampleRate
            bitsPerSample
            duration
          }
          image {
            width
            height
            resolutionX
            resolutionY
            bitsPerComponent
            components
            projectionType
            orientation
            description
            make
            model
            software
            lens
            focalLength
            exposureTime
            fNumber
            iso
            heading
            pitch
          }
          document {
            title
            subject
            summary
            author
            lastModifiedBy
            publisher
            description
            keywords
            pageCount
            worksheetCount
            slideCount
            wordCount
            lineCount
            paragraphCount
            isEncrypted
            hasDigitalSignature
          }
        }
        index
        text
        startTime
        endTime
        pageNumber
        frameNumber
      }
      toolCalls {
        id
        name
        arguments
      }
      tokens
      throughput
      ttft
      completionTime
      timestamp
      modelService
      model
      data
      mimeType
      toolCallId
      toolCallResponse
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
    graph {
      nodes {
        id
        name
        type
        metadata
      }
      edges {
        from
        to
        relation
      }
    }
    details {
      modelService
      model
      supportsToolCalling
      sourceCount
      observableCount
      toolCount
      renderedSourceCount
      renderedObservableCount
      renderedToolCount
      rankedSourceCount
      rankedObservableCount
      rankedToolCount
      tokenLimit
      completionTokenLimit
      sources
      formattedSources
      formattedObservables
      formattedInstructions
      formattedTools
      specification
      messages {
        role
        author
        message
        citations {
          content {
            id
            name
            state
            originalDate
            identifier
            uri
            type
            fileType
            mimeType
            format
            formatName
            fileExtension
            fileName
            fileSize
            fileMetadata
            relativeFolderPath
            masterUri
            imageUri
            textUri
            audioUri
            transcriptUri
            snapshotsUri
            snapshotCount
            summary
            customSummary
            keywords
            bullets
            headlines
            posts
            chapters
            questions
            quotes
            video {
              width
              height
              duration
              make
              model
              software
              title
              description
              keywords
              author
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
              genre
              title
              description
              bitrate
              channels
              sampleRate
              bitsPerSample
              duration
            }
            image {
              width
              height
              resolutionX
              resolutionY
              bitsPerComponent
              components
              projectionType
              orientation
              description
              make
              model
              software
              lens
              focalLength
              exposureTime
              fNumber
              iso
              heading
              pitch
            }
            document {
              title
              subject
              summary
              author
              lastModifiedBy
              publisher
              description
              keywords
              pageCount
              worksheetCount
              slideCount
              wordCount
              lineCount
              paragraphCount
              isEncrypted
              hasDigitalSignature
            }
          }
          index
          text
          startTime
          endTime
          pageNumber
          frameNumber
        }
        toolCalls {
          id
          name
          arguments
        }
        tokens
        throughput
        ttft
        completionTime
        timestamp
        modelService
        model
        data
        mimeType
        toolCallId
        toolCallResponse
      }
    }
  }
}
    `;
export const GetConversation = gql`
    query GetConversation($id: ID!, $correlationId: String) {
  conversation(id: $id, correlationId: $correlationId) {
    id
    name
    creationDate
    modifiedDate
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
          name
          state
          originalDate
          identifier
          uri
          type
          fileType
          mimeType
          format
          formatName
          fileExtension
          fileName
          fileSize
          fileMetadata
          relativeFolderPath
          masterUri
          imageUri
          textUri
          audioUri
          transcriptUri
          snapshotsUri
          snapshotCount
          summary
          customSummary
          keywords
          bullets
          headlines
          posts
          chapters
          questions
          quotes
          video {
            width
            height
            duration
            make
            model
            software
            title
            description
            keywords
            author
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
            genre
            title
            description
            bitrate
            channels
            sampleRate
            bitsPerSample
            duration
          }
          image {
            width
            height
            resolutionX
            resolutionY
            bitsPerComponent
            components
            projectionType
            orientation
            description
            make
            model
            software
            lens
            focalLength
            exposureTime
            fNumber
            iso
            heading
            pitch
          }
          document {
            title
            subject
            summary
            author
            lastModifiedBy
            publisher
            description
            keywords
            pageCount
            worksheetCount
            slideCount
            wordCount
            lineCount
            paragraphCount
            isEncrypted
            hasDigitalSignature
          }
        }
        index
        text
        startTime
        endTime
        pageNumber
        frameNumber
      }
      toolCalls {
        id
        name
        arguments
      }
      tokens
      throughput
      ttft
      completionTime
      timestamp
      modelService
      model
      data
      mimeType
      toolCallId
      toolCallResponse
    }
    transcriptUri
    turns {
      index
      messages {
        role
        author
        message
        tokens
        timestamp
      }
      tokens
      timestamp
      text
      relevance
    }
    specification {
      id
      name
    }
    fallbacks {
      id
      name
    }
    filter {
      dateRange {
        from
        to
      }
      inLast
      creationDateRange {
        from
        to
      }
      createdInLast
      types
      fileTypes
      formats
      fileExtensions
      fileSizeRange {
        from
        to
      }
      similarContents {
        id
      }
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
      users {
        id
      }
      observations {
        type
        observable {
          id
        }
        states
      }
      or {
        feeds {
          id
        }
        workflows {
          id
        }
        collections {
          id
        }
        users {
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
      and {
        feeds {
          id
        }
        workflows {
          id
        }
        collections {
          id
        }
        users {
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
      hasObservations
      hasFeeds
      hasCollections
      hasWorkflows
      collectionMode
      observationMode
    }
    augmentedFilter {
      dateRange {
        from
        to
      }
      inLast
      creationDateRange {
        from
        to
      }
      createdInLast
      types
      fileTypes
      formats
      fileExtensions
      fileSizeRange {
        from
        to
      }
      similarContents {
        id
      }
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
      users {
        id
      }
      observations {
        type
        observable {
          id
        }
        states
      }
      or {
        feeds {
          id
        }
        workflows {
          id
        }
        collections {
          id
        }
        users {
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
      and {
        feeds {
          id
        }
        workflows {
          id
        }
        collections {
          id
        }
        users {
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
      hasObservations
      hasFeeds
      hasCollections
      hasWorkflows
      collectionMode
      observationMode
    }
    observations {
      id
      type
      observable {
        id
        name
      }
      related {
        id
        name
      }
      relatedType
      relation
      occurrences {
        type
        confidence
        startTime
        endTime
        pageIndex
        turnIndex
        boundingBox {
          left
          top
          width
          height
        }
      }
      state
    }
    facts {
      id
      text
      validAt
      invalidAt
      state
      category
      confidence
    }
    summary
  }
}
    `;
export const Prompt = gql`
    mutation Prompt($prompt: String, $mimeType: String, $data: String, $specification: EntityReferenceInput, $messages: [ConversationMessageInput!], $tools: [ToolDefinitionInput!], $requireTool: Boolean, $correlationId: String) {
  prompt(
    prompt: $prompt
    mimeType: $mimeType
    data: $data
    specification: $specification
    messages: $messages
    tools: $tools
    requireTool: $requireTool
    correlationId: $correlationId
  ) {
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
          name
          state
          originalDate
          identifier
          uri
          type
          fileType
          mimeType
          format
          formatName
          fileExtension
          fileName
          fileSize
          fileMetadata
          relativeFolderPath
          masterUri
          imageUri
          textUri
          audioUri
          transcriptUri
          snapshotsUri
          snapshotCount
          summary
          customSummary
          keywords
          bullets
          headlines
          posts
          chapters
          questions
          quotes
          video {
            width
            height
            duration
            make
            model
            software
            title
            description
            keywords
            author
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
            genre
            title
            description
            bitrate
            channels
            sampleRate
            bitsPerSample
            duration
          }
          image {
            width
            height
            resolutionX
            resolutionY
            bitsPerComponent
            components
            projectionType
            orientation
            description
            make
            model
            software
            lens
            focalLength
            exposureTime
            fNumber
            iso
            heading
            pitch
          }
          document {
            title
            subject
            summary
            author
            lastModifiedBy
            publisher
            description
            keywords
            pageCount
            worksheetCount
            slideCount
            wordCount
            lineCount
            paragraphCount
            isEncrypted
            hasDigitalSignature
          }
        }
        index
        text
        startTime
        endTime
        pageNumber
        frameNumber
      }
      toolCalls {
        id
        name
        arguments
      }
      tokens
      throughput
      ttft
      completionTime
      timestamp
      modelService
      model
      data
      mimeType
      toolCallId
      toolCallResponse
    }
    error
  }
}
    `;
export const PromptConversation = gql`
    mutation PromptConversation($prompt: String!, $mimeType: String, $data: String, $id: ID, $specification: EntityReferenceInput, $systemPrompt: String, $tools: [ToolDefinitionInput!], $requireTool: Boolean, $includeDetails: Boolean, $correlationId: String) {
  promptConversation(
    prompt: $prompt
    id: $id
    mimeType: $mimeType
    data: $data
    specification: $specification
    tools: $tools
    systemPrompt: $systemPrompt
    requireTool: $requireTool
    includeDetails: $includeDetails
    correlationId: $correlationId
  ) {
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
          state
          originalDate
          identifier
          uri
          type
          fileType
          mimeType
          format
          formatName
          fileExtension
          fileName
          fileSize
          fileMetadata
          relativeFolderPath
          masterUri
          imageUri
          textUri
          audioUri
          transcriptUri
          snapshotsUri
          snapshotCount
          summary
          customSummary
          keywords
          bullets
          headlines
          posts
          chapters
          questions
          quotes
          video {
            width
            height
            duration
            make
            model
            software
            title
            description
            keywords
            author
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
            genre
            title
            description
            bitrate
            channels
            sampleRate
            bitsPerSample
            duration
          }
          image {
            width
            height
            resolutionX
            resolutionY
            bitsPerComponent
            components
            projectionType
            orientation
            description
            make
            model
            software
            lens
            focalLength
            exposureTime
            fNumber
            iso
            heading
            pitch
          }
          document {
            title
            subject
            summary
            author
            lastModifiedBy
            publisher
            description
            keywords
            pageCount
            worksheetCount
            slideCount
            wordCount
            lineCount
            paragraphCount
            isEncrypted
            hasDigitalSignature
          }
        }
        index
        text
        startTime
        endTime
        pageNumber
        frameNumber
      }
      toolCalls {
        id
        name
        arguments
      }
      tokens
      throughput
      ttft
      completionTime
      timestamp
      modelService
      model
      data
      mimeType
      toolCallId
      toolCallResponse
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
    graph {
      nodes {
        id
        name
        type
        metadata
      }
      edges {
        from
        to
        relation
      }
    }
    details {
      modelService
      model
      supportsToolCalling
      sourceCount
      observableCount
      toolCount
      renderedSourceCount
      renderedObservableCount
      renderedToolCount
      rankedSourceCount
      rankedObservableCount
      rankedToolCount
      tokenLimit
      completionTokenLimit
      sources
      formattedSources
      formattedObservables
      formattedInstructions
      formattedTools
      specification
      messages {
        role
        author
        message
        citations {
          content {
            id
            name
            state
            originalDate
            identifier
            uri
            type
            fileType
            mimeType
            format
            formatName
            fileExtension
            fileName
            fileSize
            fileMetadata
            relativeFolderPath
            masterUri
            imageUri
            textUri
            audioUri
            transcriptUri
            snapshotsUri
            snapshotCount
            summary
            customSummary
            keywords
            bullets
            headlines
            posts
            chapters
            questions
            quotes
            video {
              width
              height
              duration
              make
              model
              software
              title
              description
              keywords
              author
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
              genre
              title
              description
              bitrate
              channels
              sampleRate
              bitsPerSample
              duration
            }
            image {
              width
              height
              resolutionX
              resolutionY
              bitsPerComponent
              components
              projectionType
              orientation
              description
              make
              model
              software
              lens
              focalLength
              exposureTime
              fNumber
              iso
              heading
              pitch
            }
            document {
              title
              subject
              summary
              author
              lastModifiedBy
              publisher
              description
              keywords
              pageCount
              worksheetCount
              slideCount
              wordCount
              lineCount
              paragraphCount
              isEncrypted
              hasDigitalSignature
            }
          }
          index
          text
          startTime
          endTime
          pageNumber
          frameNumber
        }
        toolCalls {
          id
          name
          arguments
        }
        tokens
        throughput
        ttft
        completionTime
        timestamp
        modelService
        model
        data
        mimeType
        toolCallId
        toolCallResponse
      }
    }
  }
}
    `;
export const PublishConversation = gql`
    mutation PublishConversation($id: ID!, $connector: ContentPublishingConnectorInput!, $name: String, $isSynchronous: Boolean, $workflow: EntityReferenceInput, $correlationId: String) {
  publishConversation(
    id: $id
    connector: $connector
    name: $name
    isSynchronous: $isSynchronous
    workflow: $workflow
    correlationId: $correlationId
  ) {
    contents {
      id
      name
      state
      originalDate
      identifier
      markdown
      uri
      type
      fileType
      mimeType
      format
      formatName
      fileExtension
      fileName
      fileSize
      fileMetadata
      relativeFolderPath
      masterUri
      imageUri
      textUri
      audioUri
      transcriptUri
      snapshotsUri
      snapshotCount
      summary
      customSummary
      keywords
      bullets
      headlines
      posts
      chapters
      questions
      quotes
      video {
        width
        height
        duration
        make
        model
        software
        title
        description
        keywords
        author
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
        genre
        title
        description
        bitrate
        channels
        sampleRate
        bitsPerSample
        duration
      }
      image {
        width
        height
        resolutionX
        resolutionY
        bitsPerComponent
        components
        projectionType
        orientation
        description
        make
        model
        software
        lens
        focalLength
        exposureTime
        fNumber
        iso
        heading
        pitch
      }
      document {
        title
        subject
        summary
        author
        lastModifiedBy
        publisher
        description
        keywords
        pageCount
        worksheetCount
        slideCount
        wordCount
        lineCount
        paragraphCount
        isEncrypted
        hasDigitalSignature
      }
    }
    details {
      contents {
        id
      }
      summaries
      text
      textType
      summarySpecification
      publishSpecification
      summaryTime
      publishTime
    }
  }
}
    `;
export const QueryConversations = gql`
    query QueryConversations($filter: ConversationFilter, $correlationId: String) {
  conversations(filter: $filter, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
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
            name
            state
            originalDate
            identifier
            uri
            type
            fileType
            mimeType
            format
            formatName
            fileExtension
            fileName
            fileSize
            fileMetadata
            relativeFolderPath
            masterUri
            imageUri
            textUri
            audioUri
            transcriptUri
            snapshotsUri
            snapshotCount
            summary
            customSummary
            keywords
            bullets
            headlines
            posts
            chapters
            questions
            quotes
            video {
              width
              height
              duration
              make
              model
              software
              title
              description
              keywords
              author
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
              genre
              title
              description
              bitrate
              channels
              sampleRate
              bitsPerSample
              duration
            }
            image {
              width
              height
              resolutionX
              resolutionY
              bitsPerComponent
              components
              projectionType
              orientation
              description
              make
              model
              software
              lens
              focalLength
              exposureTime
              fNumber
              iso
              heading
              pitch
            }
            document {
              title
              subject
              summary
              author
              lastModifiedBy
              publisher
              description
              keywords
              pageCount
              worksheetCount
              slideCount
              wordCount
              lineCount
              paragraphCount
              isEncrypted
              hasDigitalSignature
            }
          }
          index
          text
          startTime
          endTime
          pageNumber
          frameNumber
        }
        toolCalls {
          id
          name
          arguments
        }
        tokens
        throughput
        ttft
        completionTime
        timestamp
        modelService
        model
        data
        mimeType
        toolCallId
        toolCallResponse
      }
      transcriptUri
      turns {
        index
        messages {
          role
          author
          message
          tokens
          timestamp
        }
        tokens
        timestamp
        text
        relevance
      }
      specification {
        id
        name
      }
      fallbacks {
        id
        name
      }
      filter {
        dateRange {
          from
          to
        }
        inLast
        creationDateRange {
          from
          to
        }
        createdInLast
        types
        fileTypes
        formats
        fileExtensions
        fileSizeRange {
          from
          to
        }
        similarContents {
          id
        }
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
        users {
          id
        }
        observations {
          type
          observable {
            id
          }
          states
        }
        or {
          feeds {
            id
          }
          workflows {
            id
          }
          collections {
            id
          }
          users {
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
        and {
          feeds {
            id
          }
          workflows {
            id
          }
          collections {
            id
          }
          users {
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
        hasObservations
        hasFeeds
        hasCollections
        hasWorkflows
        collectionMode
        observationMode
      }
      augmentedFilter {
        dateRange {
          from
          to
        }
        inLast
        creationDateRange {
          from
          to
        }
        createdInLast
        types
        fileTypes
        formats
        fileExtensions
        fileSizeRange {
          from
          to
        }
        similarContents {
          id
        }
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
        users {
          id
        }
        observations {
          type
          observable {
            id
          }
          states
        }
        or {
          feeds {
            id
          }
          workflows {
            id
          }
          collections {
            id
          }
          users {
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
        and {
          feeds {
            id
          }
          workflows {
            id
          }
          collections {
            id
          }
          users {
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
        hasObservations
        hasFeeds
        hasCollections
        hasWorkflows
        collectionMode
        observationMode
      }
      summary
    }
  }
}
    `;
export const QueryConversationsClusters = gql`
    query QueryConversationsClusters($filter: ConversationFilter, $clusters: EntityClustersInput, $correlationId: String) {
  conversations(
    filter: $filter
    clusters: $clusters
    correlationId: $correlationId
  ) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
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
            name
            state
            originalDate
            identifier
            uri
            type
            fileType
            mimeType
            format
            formatName
            fileExtension
            fileName
            fileSize
            fileMetadata
            relativeFolderPath
            masterUri
            imageUri
            textUri
            audioUri
            transcriptUri
            snapshotsUri
            snapshotCount
            summary
            customSummary
            keywords
            bullets
            headlines
            posts
            chapters
            questions
            quotes
            video {
              width
              height
              duration
              make
              model
              software
              title
              description
              keywords
              author
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
              genre
              title
              description
              bitrate
              channels
              sampleRate
              bitsPerSample
              duration
            }
            image {
              width
              height
              resolutionX
              resolutionY
              bitsPerComponent
              components
              projectionType
              orientation
              description
              make
              model
              software
              lens
              focalLength
              exposureTime
              fNumber
              iso
              heading
              pitch
            }
            document {
              title
              subject
              summary
              author
              lastModifiedBy
              publisher
              description
              keywords
              pageCount
              worksheetCount
              slideCount
              wordCount
              lineCount
              paragraphCount
              isEncrypted
              hasDigitalSignature
            }
          }
          index
          text
          startTime
          endTime
          pageNumber
          frameNumber
        }
        toolCalls {
          id
          name
          arguments
        }
        tokens
        throughput
        ttft
        completionTime
        timestamp
        modelService
        model
        data
        mimeType
        toolCallId
        toolCallResponse
      }
      transcriptUri
      turns {
        index
        messages {
          role
          author
          message
          tokens
          timestamp
        }
        tokens
        timestamp
        text
        relevance
      }
      specification {
        id
        name
      }
      fallbacks {
        id
        name
      }
      filter {
        dateRange {
          from
          to
        }
        inLast
        creationDateRange {
          from
          to
        }
        createdInLast
        types
        fileTypes
        formats
        fileExtensions
        fileSizeRange {
          from
          to
        }
        similarContents {
          id
        }
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
        users {
          id
        }
        observations {
          type
          observable {
            id
          }
          states
        }
        or {
          feeds {
            id
          }
          workflows {
            id
          }
          collections {
            id
          }
          users {
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
        and {
          feeds {
            id
          }
          workflows {
            id
          }
          collections {
            id
          }
          users {
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
        hasObservations
        hasFeeds
        hasCollections
        hasWorkflows
        collectionMode
        observationMode
      }
      augmentedFilter {
        dateRange {
          from
          to
        }
        inLast
        creationDateRange {
          from
          to
        }
        createdInLast
        types
        fileTypes
        formats
        fileExtensions
        fileSizeRange {
          from
          to
        }
        similarContents {
          id
        }
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
        users {
          id
        }
        observations {
          type
          observable {
            id
          }
          states
        }
        or {
          feeds {
            id
          }
          workflows {
            id
          }
          collections {
            id
          }
          users {
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
        and {
          feeds {
            id
          }
          workflows {
            id
          }
          collections {
            id
          }
          users {
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
        hasObservations
        hasFeeds
        hasCollections
        hasWorkflows
        collectionMode
        observationMode
      }
      summary
    }
    clusters {
      entities {
        id
        name
      }
      similarity
    }
  }
}
    `;
export const QueryConversationsGraph = gql`
    query QueryConversationsGraph($filter: ConversationFilter, $graph: ConversationGraphInput, $correlationId: String) {
  conversations(filter: $filter, graph: $graph, correlationId: $correlationId) {
    graph {
      nodes {
        id
        name
        type
        metadata
      }
      edges {
        from
        to
        relation
      }
    }
  }
}
    `;
export const RetrieveEntities = gql`
    mutation RetrieveEntities($prompt: String!, $types: [ObservableTypes!], $searchType: SearchTypes, $limit: Int, $correlationId: String) {
  retrieveEntities(
    prompt: $prompt
    types: $types
    searchType: $searchType
    limit: $limit
    correlationId: $correlationId
  ) {
    results {
      id
      name
      type
      relevance
      metadata
    }
  }
}
    `;
export const RetrieveFacts = gql`
    mutation RetrieveFacts($prompt: String!, $filter: FactFilter, $correlationId: String) {
  retrieveFacts(prompt: $prompt, filter: $filter, correlationId: $correlationId) {
    results {
      fact {
        id
        creationDate
        owner {
          id
        }
        state
        text
        validAt
        invalidAt
        relevance
        mentions {
          type
          observable {
            id
            name
          }
          start
          end
        }
        assertions {
          text
          mentions {
            type
            observable {
              id
              name
            }
            start
            end
          }
        }
        feeds {
          id
          name
        }
        content {
          id
          name
        }
        conversation {
          id
          name
        }
        sourceType
        category
        confidence
      }
      relevance
      content {
        id
      }
    }
  }
}
    `;
export const RetrieveSources = gql`
    mutation RetrieveSources($prompt: String!, $filter: ContentFilter, $augmentedFilter: ContentFilter, $retrievalStrategy: RetrievalStrategyInput, $rerankingStrategy: RerankingStrategyInput, $correlationId: String) {
  retrieveSources(
    prompt: $prompt
    filter: $filter
    augmentedFilter: $augmentedFilter
    retrievalStrategy: $retrievalStrategy
    rerankingStrategy: $rerankingStrategy
    correlationId: $correlationId
  ) {
    results {
      type
      content {
        id
      }
      text
      metadata
      relevance
      startTime
      endTime
      pageNumber
      frameNumber
    }
  }
}
    `;
export const RetrieveView = gql`
    mutation RetrieveView($prompt: String!, $id: ID!, $retrievalStrategy: RetrievalStrategyInput, $rerankingStrategy: RerankingStrategyInput, $correlationId: String) {
  retrieveView(
    prompt: $prompt
    id: $id
    retrievalStrategy: $retrievalStrategy
    rerankingStrategy: $rerankingStrategy
    correlationId: $correlationId
  ) {
    results {
      type
      content {
        id
      }
      text
      metadata
      relevance
      startTime
      endTime
      pageNumber
      frameNumber
    }
  }
}
    `;
export const ReviseContent = gql`
    mutation ReviseContent($prompt: String!, $content: EntityReferenceInput!, $id: ID, $specification: EntityReferenceInput, $correlationId: String) {
  reviseContent(
    prompt: $prompt
    content: $content
    id: $id
    specification: $specification
    correlationId: $correlationId
  ) {
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
          state
          originalDate
          identifier
          uri
          type
          fileType
          mimeType
          format
          formatName
          fileExtension
          fileName
          fileSize
          fileMetadata
          relativeFolderPath
          masterUri
          imageUri
          textUri
          audioUri
          transcriptUri
          snapshotsUri
          snapshotCount
          summary
          customSummary
          keywords
          bullets
          headlines
          posts
          chapters
          questions
          quotes
          video {
            width
            height
            duration
            make
            model
            software
            title
            description
            keywords
            author
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
            genre
            title
            description
            bitrate
            channels
            sampleRate
            bitsPerSample
            duration
          }
          image {
            width
            height
            resolutionX
            resolutionY
            bitsPerComponent
            components
            projectionType
            orientation
            description
            make
            model
            software
            lens
            focalLength
            exposureTime
            fNumber
            iso
            heading
            pitch
          }
          document {
            title
            subject
            summary
            author
            lastModifiedBy
            publisher
            description
            keywords
            pageCount
            worksheetCount
            slideCount
            wordCount
            lineCount
            paragraphCount
            isEncrypted
            hasDigitalSignature
          }
        }
        index
        text
        startTime
        endTime
        pageNumber
        frameNumber
      }
      toolCalls {
        id
        name
        arguments
      }
      tokens
      throughput
      ttft
      completionTime
      timestamp
      modelService
      model
      data
      mimeType
      toolCallId
      toolCallResponse
    }
    messageCount
  }
}
    `;
export const ReviseEncodedImage = gql`
    mutation ReviseEncodedImage($prompt: String!, $mimeType: String!, $data: String!, $id: ID, $specification: EntityReferenceInput, $correlationId: String) {
  reviseEncodedImage(
    prompt: $prompt
    mimeType: $mimeType
    data: $data
    id: $id
    specification: $specification
    correlationId: $correlationId
  ) {
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
          state
          originalDate
          identifier
          uri
          type
          fileType
          mimeType
          format
          formatName
          fileExtension
          fileName
          fileSize
          fileMetadata
          relativeFolderPath
          masterUri
          imageUri
          textUri
          audioUri
          transcriptUri
          snapshotsUri
          snapshotCount
          summary
          customSummary
          keywords
          bullets
          headlines
          posts
          chapters
          questions
          quotes
          video {
            width
            height
            duration
            make
            model
            software
            title
            description
            keywords
            author
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
            genre
            title
            description
            bitrate
            channels
            sampleRate
            bitsPerSample
            duration
          }
          image {
            width
            height
            resolutionX
            resolutionY
            bitsPerComponent
            components
            projectionType
            orientation
            description
            make
            model
            software
            lens
            focalLength
            exposureTime
            fNumber
            iso
            heading
            pitch
          }
          document {
            title
            subject
            summary
            author
            lastModifiedBy
            publisher
            description
            keywords
            pageCount
            worksheetCount
            slideCount
            wordCount
            lineCount
            paragraphCount
            isEncrypted
            hasDigitalSignature
          }
        }
        index
        text
        startTime
        endTime
        pageNumber
        frameNumber
      }
      toolCalls {
        id
        name
        arguments
      }
      tokens
      throughput
      ttft
      completionTime
      timestamp
      modelService
      model
      data
      mimeType
      toolCallId
      toolCallResponse
    }
    messageCount
  }
}
    `;
export const ReviseImage = gql`
    mutation ReviseImage($prompt: String!, $uri: URL!, $id: ID, $specification: EntityReferenceInput, $correlationId: String) {
  reviseImage(
    prompt: $prompt
    uri: $uri
    id: $id
    specification: $specification
    correlationId: $correlationId
  ) {
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
          state
          originalDate
          identifier
          uri
          type
          fileType
          mimeType
          format
          formatName
          fileExtension
          fileName
          fileSize
          fileMetadata
          relativeFolderPath
          masterUri
          imageUri
          textUri
          audioUri
          transcriptUri
          snapshotsUri
          snapshotCount
          summary
          customSummary
          keywords
          bullets
          headlines
          posts
          chapters
          questions
          quotes
          video {
            width
            height
            duration
            make
            model
            software
            title
            description
            keywords
            author
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
            genre
            title
            description
            bitrate
            channels
            sampleRate
            bitsPerSample
            duration
          }
          image {
            width
            height
            resolutionX
            resolutionY
            bitsPerComponent
            components
            projectionType
            orientation
            description
            make
            model
            software
            lens
            focalLength
            exposureTime
            fNumber
            iso
            heading
            pitch
          }
          document {
            title
            subject
            summary
            author
            lastModifiedBy
            publisher
            description
            keywords
            pageCount
            worksheetCount
            slideCount
            wordCount
            lineCount
            paragraphCount
            isEncrypted
            hasDigitalSignature
          }
        }
        index
        text
        startTime
        endTime
        pageNumber
        frameNumber
      }
      toolCalls {
        id
        name
        arguments
      }
      tokens
      throughput
      ttft
      completionTime
      timestamp
      modelService
      model
      data
      mimeType
      toolCallId
      toolCallResponse
    }
    messageCount
  }
}
    `;
export const ReviseText = gql`
    mutation ReviseText($prompt: String!, $text: String!, $id: ID, $specification: EntityReferenceInput, $correlationId: String) {
  reviseText(
    prompt: $prompt
    text: $text
    id: $id
    specification: $specification
    correlationId: $correlationId
  ) {
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
          state
          originalDate
          identifier
          uri
          type
          fileType
          mimeType
          format
          formatName
          fileExtension
          fileName
          fileSize
          fileMetadata
          relativeFolderPath
          masterUri
          imageUri
          textUri
          audioUri
          transcriptUri
          snapshotsUri
          snapshotCount
          summary
          customSummary
          keywords
          bullets
          headlines
          posts
          chapters
          questions
          quotes
          video {
            width
            height
            duration
            make
            model
            software
            title
            description
            keywords
            author
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
            genre
            title
            description
            bitrate
            channels
            sampleRate
            bitsPerSample
            duration
          }
          image {
            width
            height
            resolutionX
            resolutionY
            bitsPerComponent
            components
            projectionType
            orientation
            description
            make
            model
            software
            lens
            focalLength
            exposureTime
            fNumber
            iso
            heading
            pitch
          }
          document {
            title
            subject
            summary
            author
            lastModifiedBy
            publisher
            description
            keywords
            pageCount
            worksheetCount
            slideCount
            wordCount
            lineCount
            paragraphCount
            isEncrypted
            hasDigitalSignature
          }
        }
        index
        text
        startTime
        endTime
        pageNumber
        frameNumber
      }
      toolCalls {
        id
        name
        arguments
      }
      tokens
      throughput
      ttft
      completionTime
      timestamp
      modelService
      model
      data
      mimeType
      toolCallId
      toolCallResponse
    }
    messageCount
  }
}
    `;
export const SuggestConversation = gql`
    mutation SuggestConversation($id: ID!, $count: Int, $prompt: String, $correlationId: String) {
  suggestConversation(
    id: $id
    count: $count
    prompt: $prompt
    correlationId: $correlationId
  ) {
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
export const CountEmotions = gql`
    query CountEmotions($filter: EmotionFilter, $correlationId: String) {
  countEmotions(filter: $filter, correlationId: $correlationId) {
    count
  }
}
    `;
export const CreateEmotion = gql`
    mutation CreateEmotion($emotion: EmotionInput!) {
  createEmotion(emotion: $emotion) {
    id
    name
  }
}
    `;
export const DeleteAllEmotions = gql`
    mutation DeleteAllEmotions($filter: EmotionFilter, $isSynchronous: Boolean, $correlationId: String) {
  deleteAllEmotions(
    filter: $filter
    isSynchronous: $isSynchronous
    correlationId: $correlationId
  ) {
    id
    state
  }
}
    `;
export const DeleteEmotion = gql`
    mutation DeleteEmotion($id: ID!) {
  deleteEmotion(id: $id) {
    id
    state
  }
}
    `;
export const DeleteEmotions = gql`
    mutation DeleteEmotions($ids: [ID!]!, $isSynchronous: Boolean) {
  deleteEmotions(ids: $ids, isSynchronous: $isSynchronous) {
    id
    state
  }
}
    `;
export const GetEmotion = gql`
    query GetEmotion($id: ID!, $correlationId: String) {
  emotion(id: $id, correlationId: $correlationId) {
    id
    name
    description
    creationDate
    feeds {
      id
      name
    }
  }
}
    `;
export const QueryEmotions = gql`
    query QueryEmotions($filter: EmotionFilter, $correlationId: String) {
  emotions(filter: $filter, correlationId: $correlationId) {
    results {
      id
      name
      description
      creationDate
      relevance
      feeds {
        id
        name
      }
    }
  }
}
    `;
export const UpdateEmotion = gql`
    mutation UpdateEmotion($emotion: EmotionUpdateInput!) {
  updateEmotion(emotion: $emotion) {
    id
    name
  }
}
    `;
export const CountEvents = gql`
    query CountEvents($filter: EventFilter, $correlationId: String) {
  countEvents(filter: $filter, correlationId: $correlationId) {
    count
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
    mutation DeleteAllEvents($filter: EventFilter, $isSynchronous: Boolean, $correlationId: String) {
  deleteAllEvents(
    filter: $filter
    isSynchronous: $isSynchronous
    correlationId: $correlationId
  ) {
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
    mutation DeleteEvents($ids: [ID!]!, $isSynchronous: Boolean) {
  deleteEvents(ids: $ids, isSynchronous: $isSynchronous) {
    id
    state
  }
}
    `;
export const GetEvent = gql`
    query GetEvent($id: ID!, $correlationId: String) {
  event(id: $id, correlationId: $correlationId) {
    id
    name
    creationDate
    modifiedDate
    owner {
      id
    }
    state
    alternateNames
    uri
    description
    identifier
    thing
    feeds {
      id
      name
    }
    links {
      uri
      linkType
      excerpts
    }
    workflow {
      id
      name
    }
    location {
      latitude
      longitude
    }
    h3 {
      h3r0
      h3r1
      h3r2
      h3r3
      h3r4
      h3r5
      h3r6
      h3r7
      h3r8
      h3r9
      h3r10
      h3r11
      h3r12
      h3r13
      h3r14
      h3r15
    }
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
    organizer
    performer
    sponsor
    eventStatus
  }
}
    `;
export const QueryEvents = gql`
    query QueryEvents($filter: EventFilter, $correlationId: String) {
  events(filter: $filter, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
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
      organizer
      performer
      sponsor
      eventStatus
    }
  }
}
    `;
export const QueryEventsClusters = gql`
    query QueryEventsClusters($filter: EventFilter, $clusters: EntityClustersInput, $correlationId: String) {
  events(filter: $filter, clusters: $clusters, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
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
      organizer
      performer
      sponsor
      eventStatus
    }
    clusters {
      clusters {
        entities {
          id
          name
        }
        similarity
      }
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
export const CountFacts = gql`
    query CountFacts($filter: FactFilter, $correlationId: String) {
  countFacts(filter: $filter, correlationId: $correlationId) {
    count
  }
}
    `;
export const CreateFact = gql`
    mutation CreateFact($fact: FactInput!) {
  createFact(fact: $fact) {
    id
    state
  }
}
    `;
export const DeleteAllFacts = gql`
    mutation DeleteAllFacts($filter: FactFilter, $isSynchronous: Boolean, $correlationId: String) {
  deleteAllFacts(
    filter: $filter
    isSynchronous: $isSynchronous
    correlationId: $correlationId
  ) {
    id
    state
  }
}
    `;
export const DeleteFact = gql`
    mutation DeleteFact($id: ID!) {
  deleteFact(id: $id) {
    id
    state
  }
}
    `;
export const DeleteFacts = gql`
    mutation DeleteFacts($ids: [ID!]!, $isSynchronous: Boolean) {
  deleteFacts(ids: $ids, isSynchronous: $isSynchronous) {
    id
    state
  }
}
    `;
export const GetFact = gql`
    query GetFact($id: ID!, $correlationId: String) {
  fact(id: $id, correlationId: $correlationId) {
    id
    creationDate
    owner {
      id
    }
    state
    text
    validAt
    invalidAt
    relevance
    mentions {
      type
      observable {
        id
        name
      }
      start
      end
    }
    assertions {
      text
      mentions {
        type
        observable {
          id
          name
        }
        start
        end
      }
    }
    feeds {
      id
      name
    }
    content {
      id
      name
    }
    conversation {
      id
      name
    }
    sourceType
    category
    confidence
  }
}
    `;
export const QueryFacts = gql`
    query QueryFacts($filter: FactFilter, $correlationId: String) {
  facts(filter: $filter, correlationId: $correlationId) {
    results {
      id
      creationDate
      owner {
        id
      }
      state
      text
      validAt
      invalidAt
      relevance
      mentions {
        type
        observable {
          id
          name
        }
        start
        end
      }
      assertions {
        text
        mentions {
          type
          observable {
            id
            name
          }
          start
          end
        }
      }
      feeds {
        id
        name
      }
      content {
        id
        name
      }
      conversation {
        id
        name
      }
      sourceType
      category
      confidence
    }
  }
}
    `;
export const QueryFactsClusters = gql`
    query QueryFactsClusters($filter: FactFilter, $clusters: EntityClustersInput, $correlationId: String) {
  facts(filter: $filter, clusters: $clusters, correlationId: $correlationId) {
    results {
      id
      creationDate
      owner {
        id
      }
      state
      text
      validAt
      invalidAt
      relevance
      mentions {
        type
        observable {
          id
          name
        }
        start
        end
      }
      assertions {
        text
        mentions {
          type
          observable {
            id
            name
          }
          start
          end
        }
      }
      feeds {
        id
        name
      }
      content {
        id
        name
      }
      conversation {
        id
        name
      }
      sourceType
      category
      confidence
    }
    clusters {
      entities {
        id
        name
      }
      similarity
    }
  }
}
    `;
export const QueryFactsGraph = gql`
    query QueryFactsGraph($filter: FactFilter, $graph: FactGraphInput, $correlationId: String) {
  facts(filter: $filter, graph: $graph, correlationId: $correlationId) {
    graph {
      nodes {
        id
        name
        type
        metadata
      }
      edges {
        from
        to
        relation
      }
    }
  }
}
    `;
export const UpdateFact = gql`
    mutation UpdateFact($fact: FactUpdateInput!) {
  updateFact(fact: $fact) {
    id
    state
  }
}
    `;
export const CountFeeds = gql`
    query CountFeeds($filter: FeedFilter, $correlationId: String) {
  countFeeds(filter: $filter, correlationId: $correlationId) {
    count
  }
}
    `;
export const CreateFeed = gql`
    mutation CreateFeed($feed: FeedInput!, $correlationId: String) {
  createFeed(feed: $feed, correlationId: $correlationId) {
    id
    name
    state
    identifier
    type
  }
}
    `;
export const DeleteAllFeeds = gql`
    mutation DeleteAllFeeds($filter: FeedFilter, $isSynchronous: Boolean, $correlationId: String) {
  deleteAllFeeds(
    filter: $filter
    isSynchronous: $isSynchronous
    correlationId: $correlationId
  ) {
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
    mutation DeleteFeeds($ids: [ID!]!, $isSynchronous: Boolean) {
  deleteFeeds(ids: $ids, isSynchronous: $isSynchronous) {
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
export const FeedExists = gql`
    query FeedExists($filter: FeedFilter, $correlationId: String) {
  feedExists(filter: $filter, correlationId: $correlationId) {
    result
  }
}
    `;
export const GetFeed = gql`
    query GetFeed($id: ID!, $correlationId: String) {
  feed(id: $id, correlationId: $correlationId) {
    id
    name
    creationDate
    modifiedDate
    owner {
      id
    }
    state
    identifier
    description
    correlationId
    type
    syncMode
    site {
      siteType
      type
      isRecursive
      allowedPaths
      excludedPaths
      s3 {
        accessKey
        secretAccessKey
        bucketName
        prefix
        region
        customEndpoint
      }
      azureBlob {
        storageAccessKey
        accountName
        containerName
        prefix
        listType
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
        folderId
        tenantId
        clientId
        clientSecret
        refreshToken
        connector {
          id
        }
      }
      oneDrive {
        authenticationType
        folderId
        files
        clientId
        clientSecret
        refreshToken
        connector {
          id
        }
      }
      googleDrive {
        authenticationType
        folderId
        files
        refreshToken
        clientId
        clientSecret
        serviceAccountJson
        connector {
          id
        }
      }
      dropbox {
        authenticationType
        path
        appKey
        appSecret
        refreshToken
        connector {
          id
        }
      }
      box {
        authenticationType
        folderId
        clientId
        clientSecret
        refreshToken
        redirectUri
        connector {
          id
        }
      }
      github {
        authenticationType
        uri
        repositoryOwner
        repositoryName
        clientId
        clientSecret
        refreshToken
        personalAccessToken
        connector {
          id
        }
      }
      readLimit
    }
    email {
      type
      includeAttachments
      google {
        type
        filter
        includeSpam
        excludeSentItems
        includeDeletedItems
        inboxOnly
        authenticationType
        refreshToken
        clientId
        clientSecret
        connector {
          id
        }
      }
      microsoft {
        type
        filter
        includeSpam
        excludeSentItems
        includeDeletedItems
        inboxOnly
        authenticationType
        refreshToken
        clientId
        clientSecret
        connector {
          id
        }
      }
      readLimit
    }
    issue {
      type
      includeAttachments
      jira {
        authenticationType
        uri
        project
        email
        token
        offset
        clientId
        clientSecret
        refreshToken
        connector {
          id
        }
        cloudId
      }
      linear {
        key
        project
      }
      github {
        authenticationType
        uri
        repositoryOwner
        repositoryName
        clientId
        clientSecret
        refreshToken
        personalAccessToken
        connector {
          id
        }
      }
      intercom {
        authenticationType
        accessToken
        clientId
        clientSecret
        refreshToken
        connector {
          id
        }
      }
      zendesk {
        authenticationType
        subdomain
        accessToken
        clientId
        clientSecret
        refreshToken
        connector {
          id
        }
      }
      trello {
        key
        token
        identifiers
        type
      }
      attio {
        authenticationType
        apiKey
        clientId
        clientSecret
        refreshToken
        connector {
          id
        }
      }
      salesforce {
        authenticationType
        isSandbox
        clientId
        clientSecret
        refreshToken
        connector {
          id
        }
      }
      hubSpot {
        authenticationType
        clientId
        accessToken
        connector {
          id
        }
      }
      asana {
        authenticationType
        personalAccessToken
        clientId
        clientSecret
        refreshToken
        workspaceId
        projectId
      }
      monday {
        apiToken
        boardId
      }
      readLimit
    }
    commit {
      type
      github {
        authenticationType
        uri
        repositoryOwner
        repositoryName
        clientId
        clientSecret
        refreshToken
        personalAccessToken
        connector {
          id
        }
      }
      readLimit
    }
    pullRequest {
      type
      github {
        authenticationType
        uri
        repositoryOwner
        repositoryName
        clientId
        clientSecret
        refreshToken
        personalAccessToken
        connector {
          id
        }
      }
      readLimit
    }
    crm {
      type
      attio {
        authenticationType
        apiKey
        clientId
        clientSecret
        refreshToken
        connector {
          id
        }
        type
      }
      googleContacts {
        authenticationType
        clientId
        clientSecret
        refreshToken
        connector {
          id
        }
        type
      }
      microsoftContacts {
        authenticationType
        clientId
        clientSecret
        refreshToken
        tenantId
        connector {
          id
        }
        type
      }
      salesforce {
        authenticationType
        instanceUrl
        isSandbox
        clientId
        clientSecret
        refreshToken
        connector {
          id
        }
        type
      }
      hubSpot {
        authenticationType
        clientId
        clientSecret
        refreshToken
        accessToken
        connector {
          id
        }
        type
      }
      readLimit
    }
    hris {
      type
      bambooHR {
        authenticationType
        apiKey
        companyDomain
      }
      gusto {
        authenticationType
        clientId
        clientSecret
        refreshToken
        companyId
      }
      readLimit
    }
    calendar {
      type
      includeAttachments
      enableMeetingRecording
      meetingBotName
      google {
        type
        calendarId
        beforeDate
        afterDate
        authenticationType
        refreshToken
        clientId
        clientSecret
        connector {
          id
        }
      }
      microsoft {
        type
        calendarId
        beforeDate
        afterDate
        authenticationType
        refreshToken
        clientId
        clientSecret
        connector {
          id
        }
      }
      readLimit
    }
    meeting {
      type
      contentType
      readLimit
      fireflies {
        apiKey
        beforeDate
        afterDate
        type
      }
      attio {
        authenticationType
        apiKey
        clientId
        clientSecret
        refreshToken
        connector {
          id
        }
        afterDate
        beforeDate
        type
      }
      fathom {
        apiKey
        afterDate
        beforeDate
        type
      }
      hubSpot {
        authenticationType
        clientId
        accessToken
        includeTranscripts
        afterDate
        beforeDate
        readLimit
        connector {
          id
        }
        type
      }
      krisp {
        authToken
        type
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
      allowedPaths
      excludedPaths
    }
    search {
      readLimit
      type
      text
    }
    reddit {
      readLimit
      subredditName
    }
    notion {
      readLimit
      authenticationType
      token
      clientId
      clientSecret
      refreshToken
      connector {
        id
      }
      identifiers
      type
    }
    confluence {
      readLimit
      authenticationType
      uri
      email
      token
      clientId
      clientSecret
      refreshToken
      connector {
        id
      }
      cloudId
      spaceKeys
      identifiers
      type
      includeAttachments
    }
    intercom {
      readLimit
      authenticationType
      accessToken
      clientId
      clientSecret
      refreshToken
      connector {
        id
      }
    }
    zendesk {
      readLimit
      authenticationType
      subdomain
      accessToken
      clientId
      clientSecret
      refreshToken
      connector {
        id
      }
    }
    youtube {
      readLimit
      type
      videoName
      videoIdentifiers
      channelIdentifier
      playlistIdentifier
    }
    twitter {
      readLimit
      token
      type
      userName
      query
      includeAttachments
    }
    slack {
      readLimit
      type
      authenticationType
      token
      clientId
      clientSecret
      refreshToken
      connector {
        id
      }
      channel
      includeAttachments
    }
    microsoftTeams {
      readLimit
      type
      authenticationType
      clientId
      clientSecret
      refreshToken
      connector {
        id
      }
      teamId
      channelId
      includeAttachments
    }
    discord {
      readLimit
      type
      token
      channel
      includeAttachments
    }
    attio {
      readLimit
      authenticationType
      apiKey
      clientId
      clientSecret
      refreshToken
      connector {
        id
      }
    }
    salesforce {
      readLimit
      authenticationType
      isSandbox
      clientId
      clientSecret
      refreshToken
      connector {
        id
      }
    }
    hubSpotConversations {
      readLimit
      authenticationType
      clientId
      accessToken
      inboxId
      includeClosedThreads
      includeAttachments
      connector {
        id
      }
    }
    intercomConversations {
      readLimit
      authenticationType
      accessToken
      clientId
      clientSecret
      refreshToken
      connector {
        id
      }
      state
      includeNotes
      includeAttachments
    }
    research {
      readLimit
      type
      query
      parallel {
        processor
      }
    }
    entity {
      type
      query
      readLimit
      parallel {
        generator
      }
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
export const GetSharePointConsentUri = gql`
    query GetSharePointConsentUri($tenantId: ID!) {
  sharePointConsentUri(tenantId: $tenantId) {
    uri
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
export const QueryAsanaProjects = gql`
    query QueryAsanaProjects($properties: AsanaProjectsInput!) {
  asanaProjects(properties: $properties) {
    results
  }
}
    `;
export const QueryAsanaWorkspaces = gql`
    query QueryAsanaWorkspaces($properties: AsanaWorkspacesInput!) {
  asanaWorkspaces(properties: $properties) {
    results
  }
}
    `;
export const QueryAtlassianSites = gql`
    query QueryAtlassianSites($properties: AtlassianSitesInput!) {
  atlassianSites(properties: $properties) {
    results {
      identifier
      name
      url
    }
  }
}
    `;
export const QueryBambooHrDepartments = gql`
    query QueryBambooHRDepartments($properties: BambooHROptionsInput!) {
  bambooHRDepartments(properties: $properties) {
    results {
      name
      identifier
    }
  }
}
    `;
export const QueryBambooHrDivisions = gql`
    query QueryBambooHRDivisions($properties: BambooHROptionsInput!) {
  bambooHRDivisions(properties: $properties) {
    results {
      name
      identifier
    }
  }
}
    `;
export const QueryBambooHrEmploymentStatuses = gql`
    query QueryBambooHREmploymentStatuses($properties: BambooHROptionsInput!) {
  bambooHREmploymentStatuses(properties: $properties) {
    results {
      name
      identifier
    }
  }
}
    `;
export const QueryBambooHrLocations = gql`
    query QueryBambooHRLocations($properties: BambooHROptionsInput!) {
  bambooHRLocations(properties: $properties) {
    results {
      name
      identifier
    }
  }
}
    `;
export const QueryBoxFolders = gql`
    query QueryBoxFolders($properties: BoxFoldersInput!, $folderId: ID) {
  boxFolders(properties: $properties, folderId: $folderId) {
    results {
      folderName
      folderId
    }
  }
}
    `;
export const QueryConfluenceSpaces = gql`
    query QueryConfluenceSpaces($properties: ConfluenceSpacesInput!) {
  confluenceSpaces(properties: $properties) {
    results {
      name
      identifier
      key
    }
  }
}
    `;
export const QueryDiscordChannels = gql`
    query QueryDiscordChannels($properties: DiscordChannelsInput!) {
  discordChannels(properties: $properties) {
    results {
      channelName
      channelId
    }
  }
}
    `;
export const QueryDiscordGuilds = gql`
    query QueryDiscordGuilds($properties: DiscordGuildsInput!) {
  discordGuilds(properties: $properties) {
    results {
      guildName
      guildId
    }
  }
}
    `;
export const QueryDropboxFolders = gql`
    query QueryDropboxFolders($properties: DropboxFoldersInput!, $folderPath: String) {
  dropboxFolders(properties: $properties, folderPath: $folderPath) {
    results {
      folderName
      folderId
    }
  }
}
    `;
export const QueryFeeds = gql`
    query QueryFeeds($filter: FeedFilter, $correlationId: String) {
  feeds(filter: $filter, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      identifier
      description
      correlationId
      type
      syncMode
      site {
        siteType
        type
        isRecursive
        allowedPaths
        excludedPaths
        s3 {
          accessKey
          secretAccessKey
          bucketName
          prefix
          region
          customEndpoint
        }
        azureBlob {
          storageAccessKey
          accountName
          containerName
          prefix
          listType
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
          folderId
          tenantId
          clientId
          clientSecret
          refreshToken
          connector {
            id
          }
        }
        oneDrive {
          authenticationType
          folderId
          files
          clientId
          clientSecret
          refreshToken
          connector {
            id
          }
        }
        googleDrive {
          authenticationType
          folderId
          files
          refreshToken
          clientId
          clientSecret
          serviceAccountJson
          connector {
            id
          }
        }
        dropbox {
          authenticationType
          path
          appKey
          appSecret
          refreshToken
          connector {
            id
          }
        }
        box {
          authenticationType
          folderId
          clientId
          clientSecret
          refreshToken
          redirectUri
          connector {
            id
          }
        }
        github {
          authenticationType
          uri
          repositoryOwner
          repositoryName
          clientId
          clientSecret
          refreshToken
          personalAccessToken
          connector {
            id
          }
        }
        readLimit
      }
      email {
        type
        includeAttachments
        google {
          type
          filter
          includeSpam
          excludeSentItems
          includeDeletedItems
          inboxOnly
          authenticationType
          refreshToken
          clientId
          clientSecret
          connector {
            id
          }
        }
        microsoft {
          type
          filter
          includeSpam
          excludeSentItems
          includeDeletedItems
          inboxOnly
          authenticationType
          refreshToken
          clientId
          clientSecret
          connector {
            id
          }
        }
        readLimit
      }
      issue {
        type
        includeAttachments
        jira {
          authenticationType
          uri
          project
          email
          token
          offset
          clientId
          clientSecret
          refreshToken
          connector {
            id
          }
          cloudId
        }
        linear {
          key
          project
        }
        github {
          authenticationType
          uri
          repositoryOwner
          repositoryName
          clientId
          clientSecret
          refreshToken
          personalAccessToken
          connector {
            id
          }
        }
        intercom {
          authenticationType
          accessToken
          clientId
          clientSecret
          refreshToken
          connector {
            id
          }
        }
        zendesk {
          authenticationType
          subdomain
          accessToken
          clientId
          clientSecret
          refreshToken
          connector {
            id
          }
        }
        trello {
          key
          token
          identifiers
          type
        }
        attio {
          authenticationType
          apiKey
          clientId
          clientSecret
          refreshToken
          connector {
            id
          }
        }
        salesforce {
          authenticationType
          isSandbox
          clientId
          clientSecret
          refreshToken
          connector {
            id
          }
        }
        hubSpot {
          authenticationType
          clientId
          accessToken
          connector {
            id
          }
        }
        asana {
          authenticationType
          personalAccessToken
          clientId
          clientSecret
          refreshToken
          workspaceId
          projectId
        }
        monday {
          apiToken
          boardId
        }
        readLimit
      }
      commit {
        type
        github {
          authenticationType
          uri
          repositoryOwner
          repositoryName
          clientId
          clientSecret
          refreshToken
          personalAccessToken
          connector {
            id
          }
        }
        readLimit
      }
      pullRequest {
        type
        github {
          authenticationType
          uri
          repositoryOwner
          repositoryName
          clientId
          clientSecret
          refreshToken
          personalAccessToken
          connector {
            id
          }
        }
        readLimit
      }
      crm {
        type
        attio {
          authenticationType
          apiKey
          clientId
          clientSecret
          refreshToken
          connector {
            id
          }
          type
        }
        googleContacts {
          authenticationType
          clientId
          clientSecret
          refreshToken
          connector {
            id
          }
          type
        }
        microsoftContacts {
          authenticationType
          clientId
          clientSecret
          refreshToken
          tenantId
          connector {
            id
          }
          type
        }
        salesforce {
          authenticationType
          instanceUrl
          isSandbox
          clientId
          clientSecret
          refreshToken
          connector {
            id
          }
          type
        }
        hubSpot {
          authenticationType
          clientId
          clientSecret
          refreshToken
          accessToken
          connector {
            id
          }
          type
        }
        readLimit
      }
      hris {
        type
        bambooHR {
          authenticationType
          apiKey
          companyDomain
        }
        gusto {
          authenticationType
          clientId
          clientSecret
          refreshToken
          companyId
        }
        readLimit
      }
      calendar {
        type
        includeAttachments
        enableMeetingRecording
        meetingBotName
        google {
          type
          calendarId
          beforeDate
          afterDate
          authenticationType
          refreshToken
          clientId
          clientSecret
          connector {
            id
          }
        }
        microsoft {
          type
          calendarId
          beforeDate
          afterDate
          authenticationType
          refreshToken
          clientId
          clientSecret
          connector {
            id
          }
        }
        readLimit
      }
      meeting {
        type
        contentType
        readLimit
        fireflies {
          apiKey
          beforeDate
          afterDate
          type
        }
        attio {
          authenticationType
          apiKey
          clientId
          clientSecret
          refreshToken
          connector {
            id
          }
          afterDate
          beforeDate
          type
        }
        fathom {
          apiKey
          afterDate
          beforeDate
          type
        }
        hubSpot {
          authenticationType
          clientId
          accessToken
          includeTranscripts
          afterDate
          beforeDate
          readLimit
          connector {
            id
          }
          type
        }
        krisp {
          authToken
          type
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
        allowedPaths
        excludedPaths
      }
      search {
        readLimit
        type
        text
      }
      reddit {
        readLimit
        subredditName
      }
      notion {
        readLimit
        authenticationType
        token
        clientId
        clientSecret
        refreshToken
        connector {
          id
        }
        identifiers
        type
      }
      confluence {
        readLimit
        authenticationType
        uri
        email
        token
        clientId
        clientSecret
        refreshToken
        connector {
          id
        }
        cloudId
        spaceKeys
        identifiers
        type
        includeAttachments
      }
      intercom {
        readLimit
        authenticationType
        accessToken
        clientId
        clientSecret
        refreshToken
        connector {
          id
        }
      }
      zendesk {
        readLimit
        authenticationType
        subdomain
        accessToken
        clientId
        clientSecret
        refreshToken
        connector {
          id
        }
      }
      youtube {
        readLimit
        type
        videoName
        videoIdentifiers
        channelIdentifier
        playlistIdentifier
      }
      twitter {
        readLimit
        token
        type
        userName
        query
        includeAttachments
      }
      slack {
        readLimit
        type
        authenticationType
        token
        clientId
        clientSecret
        refreshToken
        connector {
          id
        }
        channel
        includeAttachments
      }
      microsoftTeams {
        readLimit
        type
        authenticationType
        clientId
        clientSecret
        refreshToken
        connector {
          id
        }
        teamId
        channelId
        includeAttachments
      }
      discord {
        readLimit
        type
        token
        channel
        includeAttachments
      }
      attio {
        readLimit
        authenticationType
        apiKey
        clientId
        clientSecret
        refreshToken
        connector {
          id
        }
      }
      salesforce {
        readLimit
        authenticationType
        isSandbox
        clientId
        clientSecret
        refreshToken
        connector {
          id
        }
      }
      hubSpotConversations {
        readLimit
        authenticationType
        clientId
        accessToken
        inboxId
        includeClosedThreads
        includeAttachments
        connector {
          id
        }
      }
      intercomConversations {
        readLimit
        authenticationType
        accessToken
        clientId
        clientSecret
        refreshToken
        connector {
          id
        }
        state
        includeNotes
        includeAttachments
      }
      research {
        readLimit
        type
        query
        parallel {
          processor
        }
      }
      entity {
        type
        query
        readLimit
        parallel {
          generator
        }
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
export const QueryGitHubRepositories = gql`
    query QueryGitHubRepositories($properties: GitHubRepositoriesInput!, $sortBy: GitHubRepositorySortTypes) {
  gitHubRepositories(properties: $properties, sortBy: $sortBy) {
    results {
      repositoryOwner
      repositoryName
      repositoryFullName
      description
      isPrivate
      stargazersCount
      forksCount
      pushedAt
      createdAt
      isOwner
      language
    }
  }
}
    `;
export const QueryGoogleCalendars = gql`
    query QueryGoogleCalendars($properties: GoogleCalendarsInput!) {
  googleCalendars(properties: $properties) {
    results {
      calendarName
      calendarId
    }
  }
}
    `;
export const QueryGoogleDriveFolders = gql`
    query QueryGoogleDriveFolders($properties: GoogleDriveFoldersInput!, $folderId: ID) {
  googleDriveFolders(properties: $properties, folderId: $folderId) {
    results {
      folderName
      folderId
      folderPath
    }
  }
}
    `;
export const QueryGustoCompanies = gql`
    query QueryGustoCompanies($properties: GustoCompaniesInput!) {
  gustoCompanies(properties: $properties) {
    results {
      name
      identifier
      ein
    }
  }
}
    `;
export const QueryGustoDepartments = gql`
    query QueryGustoDepartments($properties: GustoOptionsInput!) {
  gustoDepartments(properties: $properties) {
    results {
      name
      identifier
    }
  }
}
    `;
export const QueryGustoLocations = gql`
    query QueryGustoLocations($properties: GustoOptionsInput!) {
  gustoLocations(properties: $properties) {
    results {
      identifier
      street1
      street2
      city
      state
      zip
      country
    }
  }
}
    `;
export const QueryJiraProjects = gql`
    query QueryJiraProjects($properties: JiraProjectsInput!) {
  jiraProjects(properties: $properties) {
    results {
      identifier
      name
      key
    }
  }
}
    `;
export const QueryLinearProjects = gql`
    query QueryLinearProjects($properties: LinearProjectsInput!) {
  linearProjects(properties: $properties) {
    results
  }
}
    `;
export const QueryMicrosoftCalendars = gql`
    query QueryMicrosoftCalendars($properties: MicrosoftCalendarsInput!) {
  microsoftCalendars(properties: $properties) {
    results {
      calendarName
      calendarId
    }
  }
}
    `;
export const QueryMicrosoftTeamsChannels = gql`
    query QueryMicrosoftTeamsChannels($properties: MicrosoftTeamsChannelsInput!, $teamId: ID!) {
  microsoftTeamsChannels(properties: $properties, teamId: $teamId) {
    results {
      channelName
      channelId
    }
  }
}
    `;
export const QueryMicrosoftTeamsTeams = gql`
    query QueryMicrosoftTeamsTeams($properties: MicrosoftTeamsTeamsInput!) {
  microsoftTeamsTeams(properties: $properties) {
    results {
      teamName
      teamId
    }
  }
}
    `;
export const QueryMondayBoards = gql`
    query QueryMondayBoards($properties: MondayBoardsInput!) {
  mondayBoards(properties: $properties) {
    results
  }
}
    `;
export const QueryNotionDatabases = gql`
    query QueryNotionDatabases($properties: NotionDatabasesInput!) {
  notionDatabases(properties: $properties) {
    results {
      name
      identifier
    }
  }
}
    `;
export const QueryNotionPages = gql`
    query QueryNotionPages($properties: NotionPagesInput!, $identifier: String!) {
  notionPages(properties: $properties, identifier: $identifier) {
    results {
      name
      identifier
    }
  }
}
    `;
export const QueryOneDriveFolders = gql`
    query QueryOneDriveFolders($properties: OneDriveFoldersInput!, $folderId: ID) {
  oneDriveFolders(properties: $properties, folderId: $folderId) {
    results {
      folderName
      folderId
      folderPath
    }
  }
}
    `;
export const QuerySharePointFolders = gql`
    query QuerySharePointFolders($properties: SharePointFoldersInput!, $libraryId: ID!, $folderId: ID) {
  sharePointFolders(
    properties: $properties
    libraryId: $libraryId
    folderId: $folderId
  ) {
    accountName
    results {
      folderName
      folderId
      folderPath
    }
  }
}
    `;
export const QuerySharePointLibraries = gql`
    query QuerySharePointLibraries($properties: SharePointLibrariesInput!) {
  sharePointLibraries(properties: $properties) {
    accountName
    results {
      libraryName
      libraryId
      siteName
      siteId
    }
  }
}
    `;
export const QuerySlackChannels = gql`
    query QuerySlackChannels($properties: SlackChannelsInput!) {
  slackChannels(properties: $properties) {
    results
  }
}
    `;
export const TriggerFeed = gql`
    mutation TriggerFeed($id: ID!) {
  triggerFeed(id: $id) {
    id
    state
  }
}
    `;
export const UpdateFeed = gql`
    mutation UpdateFeed($feed: FeedUpdateInput!) {
  updateFeed(feed: $feed) {
    id
    name
    state
    identifier
    type
  }
}
    `;
export const CountInvestments = gql`
    query CountInvestments($filter: InvestmentFilter, $correlationId: String) {
  countInvestments(filter: $filter, correlationId: $correlationId) {
    count
  }
}
    `;
export const CreateInvestment = gql`
    mutation CreateInvestment($investment: InvestmentInput!) {
  createInvestment(investment: $investment) {
    id
    name
  }
}
    `;
export const DeleteAllInvestments = gql`
    mutation DeleteAllInvestments($filter: InvestmentFilter, $isSynchronous: Boolean, $correlationId: String) {
  deleteAllInvestments(
    filter: $filter
    isSynchronous: $isSynchronous
    correlationId: $correlationId
  ) {
    id
    state
  }
}
    `;
export const DeleteInvestment = gql`
    mutation DeleteInvestment($id: ID!) {
  deleteInvestment(id: $id) {
    id
    state
  }
}
    `;
export const DeleteInvestments = gql`
    mutation DeleteInvestments($ids: [ID!]!, $isSynchronous: Boolean) {
  deleteInvestments(ids: $ids, isSynchronous: $isSynchronous) {
    id
    state
  }
}
    `;
export const GetInvestment = gql`
    query GetInvestment($id: ID!, $correlationId: String) {
  investment(id: $id, correlationId: $correlationId) {
    id
    name
    creationDate
    modifiedDate
    owner {
      id
    }
    state
    alternateNames
    uri
    description
    identifier
    thing
    feeds {
      id
      name
    }
    links {
      uri
      linkType
      excerpts
    }
    workflow {
      id
      name
    }
    location {
      latitude
      longitude
    }
    h3 {
      h3r0
      h3r1
      h3r2
      h3r3
      h3r4
      h3r5
      h3r6
      h3r7
      h3r8
      h3r9
      h3r10
      h3r11
      h3r12
      h3r13
      h3r14
      h3r15
    }
    amount
    amountCurrency
    status
    stage
    investmentDate
    roundSize
    roundSizeCurrency
    postValuation
    postValuationCurrency
    sharesOwned
    vehicle
    entryPricePerShare
    currentPricePerShare
    discountPercent
    proRataRights
    investor {
      id
      name
    }
    organization {
      id
      name
    }
  }
}
    `;
export const QueryInvestments = gql`
    query QueryInvestments($filter: InvestmentFilter, $correlationId: String) {
  investments(filter: $filter, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
      amount
      amountCurrency
      status
      stage
      investmentDate
      roundSize
      roundSizeCurrency
      postValuation
      postValuationCurrency
      sharesOwned
      vehicle
      entryPricePerShare
      currentPricePerShare
      discountPercent
      proRataRights
    }
  }
}
    `;
export const QueryInvestmentsClusters = gql`
    query QueryInvestmentsClusters($filter: InvestmentFilter, $clusters: EntityClustersInput, $correlationId: String) {
  investments(filter: $filter, clusters: $clusters, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
      amount
      amountCurrency
      status
      stage
      investmentDate
      roundSize
      roundSizeCurrency
      postValuation
      postValuationCurrency
      sharesOwned
      vehicle
      entryPricePerShare
      currentPricePerShare
      discountPercent
      proRataRights
      investor {
        id
        name
      }
      organization {
        id
        name
      }
    }
    clusters {
      clusters {
        entities {
          id
          name
        }
        similarity
      }
    }
  }
}
    `;
export const QueryInvestmentsExpanded = gql`
    query QueryInvestmentsExpanded($filter: InvestmentFilter, $correlationId: String) {
  investments(filter: $filter, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
      amount
      amountCurrency
      status
      stage
      investmentDate
      roundSize
      roundSizeCurrency
      postValuation
      postValuationCurrency
      sharesOwned
      vehicle
      entryPricePerShare
      currentPricePerShare
      discountPercent
      proRataRights
      investor {
        id
        name
      }
      organization {
        id
        name
      }
    }
  }
}
    `;
export const UpdateInvestment = gql`
    mutation UpdateInvestment($investment: InvestmentUpdateInput!) {
  updateInvestment(investment: $investment) {
    id
    name
  }
}
    `;
export const CountInvestmentFunds = gql`
    query CountInvestmentFunds($filter: InvestmentFundFilter, $correlationId: String) {
  countInvestmentFunds(filter: $filter, correlationId: $correlationId) {
    count
  }
}
    `;
export const CreateInvestmentFund = gql`
    mutation CreateInvestmentFund($investmentFund: InvestmentFundInput!) {
  createInvestmentFund(investmentFund: $investmentFund) {
    id
    name
  }
}
    `;
export const DeleteAllInvestmentFunds = gql`
    mutation DeleteAllInvestmentFunds($filter: InvestmentFundFilter, $isSynchronous: Boolean, $correlationId: String) {
  deleteAllInvestmentFunds(
    filter: $filter
    isSynchronous: $isSynchronous
    correlationId: $correlationId
  ) {
    id
    state
  }
}
    `;
export const DeleteInvestmentFund = gql`
    mutation DeleteInvestmentFund($id: ID!) {
  deleteInvestmentFund(id: $id) {
    id
    state
  }
}
    `;
export const DeleteInvestmentFunds = gql`
    mutation DeleteInvestmentFunds($ids: [ID!]!, $isSynchronous: Boolean) {
  deleteInvestmentFunds(ids: $ids, isSynchronous: $isSynchronous) {
    id
    state
  }
}
    `;
export const GetInvestmentFund = gql`
    query GetInvestmentFund($id: ID!, $correlationId: String) {
  investmentFund(id: $id, correlationId: $correlationId) {
    id
    name
    creationDate
    modifiedDate
    owner {
      id
    }
    state
    alternateNames
    uri
    description
    identifier
    thing
    feeds {
      id
      name
    }
    links {
      uri
      linkType
      excerpts
    }
    workflow {
      id
      name
    }
    location {
      latitude
      longitude
    }
    h3 {
      h3r0
      h3r1
      h3r2
      h3r3
      h3r4
      h3r5
      h3r6
      h3r7
      h3r8
      h3r9
      h3r10
      h3r11
      h3r12
      h3r13
      h3r14
      h3r15
    }
    amount
    amountCurrency
    fundType
    vintage
    targetSize
    targetSizeCurrency
    organizations {
      id
      name
    }
    investments {
      id
      name
    }
    parentFund {
      id
      name
    }
    childFunds {
      id
      name
    }
  }
}
    `;
export const QueryInvestmentFunds = gql`
    query QueryInvestmentFunds($filter: InvestmentFundFilter, $correlationId: String) {
  investmentFunds(filter: $filter, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
      amount
      amountCurrency
      fundType
      vintage
      targetSize
      targetSizeCurrency
    }
  }
}
    `;
export const QueryInvestmentFundsClusters = gql`
    query QueryInvestmentFundsClusters($filter: InvestmentFundFilter, $clusters: EntityClustersInput, $correlationId: String) {
  investmentFunds(
    filter: $filter
    clusters: $clusters
    correlationId: $correlationId
  ) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
      amount
      amountCurrency
      fundType
      vintage
      targetSize
      targetSizeCurrency
      organizations {
        id
        name
      }
      investments {
        id
        name
      }
      parentFund {
        id
        name
      }
      childFunds {
        id
        name
      }
    }
    clusters {
      clusters {
        entities {
          id
          name
        }
        similarity
      }
    }
  }
}
    `;
export const QueryInvestmentFundsExpanded = gql`
    query QueryInvestmentFundsExpanded($filter: InvestmentFundFilter, $correlationId: String) {
  investmentFunds(filter: $filter, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
      amount
      amountCurrency
      fundType
      vintage
      targetSize
      targetSizeCurrency
      organizations {
        id
        name
      }
      investments {
        id
        name
      }
      parentFund {
        id
        name
      }
      childFunds {
        id
        name
      }
    }
  }
}
    `;
export const UpdateInvestmentFund = gql`
    mutation UpdateInvestmentFund($investmentFund: InvestmentFundUpdateInput!) {
  updateInvestmentFund(investmentFund: $investmentFund) {
    id
    name
  }
}
    `;
export const CountLabels = gql`
    query CountLabels($filter: LabelFilter, $correlationId: String) {
  countLabels(filter: $filter, correlationId: $correlationId) {
    count
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
    mutation DeleteAllLabels($filter: LabelFilter, $isSynchronous: Boolean, $correlationId: String) {
  deleteAllLabels(
    filter: $filter
    isSynchronous: $isSynchronous
    correlationId: $correlationId
  ) {
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
    mutation DeleteLabels($ids: [ID!]!, $isSynchronous: Boolean) {
  deleteLabels(ids: $ids, isSynchronous: $isSynchronous) {
    id
    state
  }
}
    `;
export const GetLabel = gql`
    query GetLabel($id: ID!, $correlationId: String) {
  label(id: $id, correlationId: $correlationId) {
    id
    name
    description
    creationDate
    feeds {
      id
      name
    }
  }
}
    `;
export const QueryLabels = gql`
    query QueryLabels($filter: LabelFilter, $correlationId: String) {
  labels(filter: $filter, correlationId: $correlationId) {
    results {
      id
      name
      description
      creationDate
      relevance
      feeds {
        id
        name
      }
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
export const UpsertLabel = gql`
    mutation UpsertLabel($label: LabelInput!) {
  upsertLabel(label: $label) {
    id
    name
  }
}
    `;
export const CountMedicalConditions = gql`
    query CountMedicalConditions($filter: MedicalConditionFilter, $correlationId: String) {
  countMedicalConditions(filter: $filter, correlationId: $correlationId) {
    count
  }
}
    `;
export const CreateMedicalCondition = gql`
    mutation CreateMedicalCondition($medicalCondition: MedicalConditionInput!) {
  createMedicalCondition(medicalCondition: $medicalCondition) {
    id
    name
  }
}
    `;
export const DeleteAllMedicalConditions = gql`
    mutation DeleteAllMedicalConditions($filter: MedicalConditionFilter, $isSynchronous: Boolean, $correlationId: String) {
  deleteAllMedicalConditions(
    filter: $filter
    isSynchronous: $isSynchronous
    correlationId: $correlationId
  ) {
    id
    state
  }
}
    `;
export const DeleteMedicalCondition = gql`
    mutation DeleteMedicalCondition($id: ID!) {
  deleteMedicalCondition(id: $id) {
    id
    state
  }
}
    `;
export const DeleteMedicalConditions = gql`
    mutation DeleteMedicalConditions($ids: [ID!]!, $isSynchronous: Boolean) {
  deleteMedicalConditions(ids: $ids, isSynchronous: $isSynchronous) {
    id
    state
  }
}
    `;
export const GetMedicalCondition = gql`
    query GetMedicalCondition($id: ID!, $correlationId: String) {
  medicalCondition(id: $id, correlationId: $correlationId) {
    id
    name
    creationDate
    modifiedDate
    owner {
      id
    }
    state
    alternateNames
    uri
    description
    identifier
    thing
    feeds {
      id
      name
    }
    links {
      uri
      linkType
      excerpts
    }
    workflow {
      id
      name
    }
    location {
      latitude
      longitude
    }
    h3 {
      h3r0
      h3r1
      h3r2
      h3r3
      h3r4
      h3r5
      h3r6
      h3r7
      h3r8
      h3r9
      h3r10
      h3r11
      h3r12
      h3r13
      h3r14
      h3r15
    }
  }
}
    `;
export const QueryMedicalConditions = gql`
    query QueryMedicalConditions($filter: MedicalConditionFilter, $correlationId: String) {
  medicalConditions(filter: $filter, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
    }
  }
}
    `;
export const QueryMedicalConditionsClusters = gql`
    query QueryMedicalConditionsClusters($filter: MedicalConditionFilter, $clusters: EntityClustersInput, $correlationId: String) {
  medicalConditions(
    filter: $filter
    clusters: $clusters
    correlationId: $correlationId
  ) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
    }
    clusters {
      clusters {
        entities {
          id
          name
        }
        similarity
      }
    }
  }
}
    `;
export const UpdateMedicalCondition = gql`
    mutation UpdateMedicalCondition($medicalCondition: MedicalConditionUpdateInput!) {
  updateMedicalCondition(medicalCondition: $medicalCondition) {
    id
    name
  }
}
    `;
export const CountMedicalContraindications = gql`
    query CountMedicalContraindications($filter: MedicalContraindicationFilter, $correlationId: String) {
  countMedicalContraindications(filter: $filter, correlationId: $correlationId) {
    count
  }
}
    `;
export const CreateMedicalContraindication = gql`
    mutation CreateMedicalContraindication($medicalContraindication: MedicalContraindicationInput!) {
  createMedicalContraindication(medicalContraindication: $medicalContraindication) {
    id
    name
  }
}
    `;
export const DeleteAllMedicalContraindications = gql`
    mutation DeleteAllMedicalContraindications($filter: MedicalContraindicationFilter, $isSynchronous: Boolean, $correlationId: String) {
  deleteAllMedicalContraindications(
    filter: $filter
    isSynchronous: $isSynchronous
    correlationId: $correlationId
  ) {
    id
    state
  }
}
    `;
export const DeleteMedicalContraindication = gql`
    mutation DeleteMedicalContraindication($id: ID!) {
  deleteMedicalContraindication(id: $id) {
    id
    state
  }
}
    `;
export const DeleteMedicalContraindications = gql`
    mutation DeleteMedicalContraindications($ids: [ID!]!, $isSynchronous: Boolean) {
  deleteMedicalContraindications(ids: $ids, isSynchronous: $isSynchronous) {
    id
    state
  }
}
    `;
export const GetMedicalContraindication = gql`
    query GetMedicalContraindication($id: ID!, $correlationId: String) {
  medicalContraindication(id: $id, correlationId: $correlationId) {
    id
    name
    creationDate
    modifiedDate
    owner {
      id
    }
    state
    alternateNames
    uri
    description
    identifier
    thing
    feeds {
      id
      name
    }
    links {
      uri
      linkType
      excerpts
    }
    workflow {
      id
      name
    }
    location {
      latitude
      longitude
    }
    h3 {
      h3r0
      h3r1
      h3r2
      h3r3
      h3r4
      h3r5
      h3r6
      h3r7
      h3r8
      h3r9
      h3r10
      h3r11
      h3r12
      h3r13
      h3r14
      h3r15
    }
  }
}
    `;
export const QueryMedicalContraindications = gql`
    query QueryMedicalContraindications($filter: MedicalContraindicationFilter, $correlationId: String) {
  medicalContraindications(filter: $filter, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
    }
  }
}
    `;
export const QueryMedicalContraindicationsClusters = gql`
    query QueryMedicalContraindicationsClusters($filter: MedicalContraindicationFilter, $clusters: EntityClustersInput, $correlationId: String) {
  medicalContraindications(
    filter: $filter
    clusters: $clusters
    correlationId: $correlationId
  ) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
    }
    clusters {
      clusters {
        entities {
          id
          name
        }
        similarity
      }
    }
  }
}
    `;
export const UpdateMedicalContraindication = gql`
    mutation UpdateMedicalContraindication($medicalContraindication: MedicalContraindicationUpdateInput!) {
  updateMedicalContraindication(medicalContraindication: $medicalContraindication) {
    id
    name
  }
}
    `;
export const CountMedicalDevices = gql`
    query CountMedicalDevices($filter: MedicalDeviceFilter, $correlationId: String) {
  countMedicalDevices(filter: $filter, correlationId: $correlationId) {
    count
  }
}
    `;
export const CreateMedicalDevice = gql`
    mutation CreateMedicalDevice($medicalDevice: MedicalDeviceInput!) {
  createMedicalDevice(medicalDevice: $medicalDevice) {
    id
    name
  }
}
    `;
export const DeleteAllMedicalDevices = gql`
    mutation DeleteAllMedicalDevices($filter: MedicalDeviceFilter, $isSynchronous: Boolean, $correlationId: String) {
  deleteAllMedicalDevices(
    filter: $filter
    isSynchronous: $isSynchronous
    correlationId: $correlationId
  ) {
    id
    state
  }
}
    `;
export const DeleteMedicalDevice = gql`
    mutation DeleteMedicalDevice($id: ID!) {
  deleteMedicalDevice(id: $id) {
    id
    state
  }
}
    `;
export const DeleteMedicalDevices = gql`
    mutation DeleteMedicalDevices($ids: [ID!]!, $isSynchronous: Boolean) {
  deleteMedicalDevices(ids: $ids, isSynchronous: $isSynchronous) {
    id
    state
  }
}
    `;
export const GetMedicalDevice = gql`
    query GetMedicalDevice($id: ID!, $correlationId: String) {
  medicalDevice(id: $id, correlationId: $correlationId) {
    id
    name
    creationDate
    modifiedDate
    owner {
      id
    }
    state
    alternateNames
    uri
    description
    identifier
    thing
    feeds {
      id
      name
    }
    links {
      uri
      linkType
      excerpts
    }
    workflow {
      id
      name
    }
    location {
      latitude
      longitude
    }
    h3 {
      h3r0
      h3r1
      h3r2
      h3r3
      h3r4
      h3r5
      h3r6
      h3r7
      h3r8
      h3r9
      h3r10
      h3r11
      h3r12
      h3r13
      h3r14
      h3r15
    }
  }
}
    `;
export const QueryMedicalDevices = gql`
    query QueryMedicalDevices($filter: MedicalDeviceFilter, $correlationId: String) {
  medicalDevices(filter: $filter, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
    }
  }
}
    `;
export const QueryMedicalDevicesClusters = gql`
    query QueryMedicalDevicesClusters($filter: MedicalDeviceFilter, $clusters: EntityClustersInput, $correlationId: String) {
  medicalDevices(
    filter: $filter
    clusters: $clusters
    correlationId: $correlationId
  ) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
    }
    clusters {
      clusters {
        entities {
          id
          name
        }
        similarity
      }
    }
  }
}
    `;
export const UpdateMedicalDevice = gql`
    mutation UpdateMedicalDevice($medicalDevice: MedicalDeviceUpdateInput!) {
  updateMedicalDevice(medicalDevice: $medicalDevice) {
    id
    name
  }
}
    `;
export const CountMedicalDrugs = gql`
    query CountMedicalDrugs($filter: MedicalDrugFilter, $correlationId: String) {
  countMedicalDrugs(filter: $filter, correlationId: $correlationId) {
    count
  }
}
    `;
export const CreateMedicalDrug = gql`
    mutation CreateMedicalDrug($medicalDrug: MedicalDrugInput!) {
  createMedicalDrug(medicalDrug: $medicalDrug) {
    id
    name
  }
}
    `;
export const DeleteAllMedicalDrugs = gql`
    mutation DeleteAllMedicalDrugs($filter: MedicalDrugFilter, $isSynchronous: Boolean, $correlationId: String) {
  deleteAllMedicalDrugs(
    filter: $filter
    isSynchronous: $isSynchronous
    correlationId: $correlationId
  ) {
    id
    state
  }
}
    `;
export const DeleteMedicalDrug = gql`
    mutation DeleteMedicalDrug($id: ID!) {
  deleteMedicalDrug(id: $id) {
    id
    state
  }
}
    `;
export const DeleteMedicalDrugs = gql`
    mutation DeleteMedicalDrugs($ids: [ID!]!, $isSynchronous: Boolean) {
  deleteMedicalDrugs(ids: $ids, isSynchronous: $isSynchronous) {
    id
    state
  }
}
    `;
export const GetMedicalDrug = gql`
    query GetMedicalDrug($id: ID!, $correlationId: String) {
  medicalDrug(id: $id, correlationId: $correlationId) {
    id
    name
    creationDate
    modifiedDate
    owner {
      id
    }
    state
    alternateNames
    uri
    description
    identifier
    thing
    feeds {
      id
      name
    }
    links {
      uri
      linkType
      excerpts
    }
    workflow {
      id
      name
    }
    location {
      latitude
      longitude
    }
    h3 {
      h3r0
      h3r1
      h3r2
      h3r3
      h3r4
      h3r5
      h3r6
      h3r7
      h3r8
      h3r9
      h3r10
      h3r11
      h3r12
      h3r13
      h3r14
      h3r15
    }
  }
}
    `;
export const QueryMedicalDrugs = gql`
    query QueryMedicalDrugs($filter: MedicalDrugFilter, $correlationId: String) {
  medicalDrugs(filter: $filter, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
    }
  }
}
    `;
export const QueryMedicalDrugsClusters = gql`
    query QueryMedicalDrugsClusters($filter: MedicalDrugFilter, $clusters: EntityClustersInput, $correlationId: String) {
  medicalDrugs(
    filter: $filter
    clusters: $clusters
    correlationId: $correlationId
  ) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
    }
    clusters {
      clusters {
        entities {
          id
          name
        }
        similarity
      }
    }
  }
}
    `;
export const UpdateMedicalDrug = gql`
    mutation UpdateMedicalDrug($medicalDrug: MedicalDrugUpdateInput!) {
  updateMedicalDrug(medicalDrug: $medicalDrug) {
    id
    name
  }
}
    `;
export const CountMedicalDrugClasses = gql`
    query CountMedicalDrugClasses($filter: MedicalDrugClassFilter, $correlationId: String) {
  countMedicalDrugClasses(filter: $filter, correlationId: $correlationId) {
    count
  }
}
    `;
export const CreateMedicalDrugClass = gql`
    mutation CreateMedicalDrugClass($medicalDrugClass: MedicalDrugClassInput!) {
  createMedicalDrugClass(medicalDrugClass: $medicalDrugClass) {
    id
    name
  }
}
    `;
export const DeleteAllMedicalDrugClasses = gql`
    mutation DeleteAllMedicalDrugClasses($filter: MedicalDrugClassFilter, $isSynchronous: Boolean, $correlationId: String) {
  deleteAllMedicalDrugClasses(
    filter: $filter
    isSynchronous: $isSynchronous
    correlationId: $correlationId
  ) {
    id
    state
  }
}
    `;
export const DeleteMedicalDrugClass = gql`
    mutation DeleteMedicalDrugClass($id: ID!) {
  deleteMedicalDrugClass(id: $id) {
    id
    state
  }
}
    `;
export const DeleteMedicalDrugClasses = gql`
    mutation DeleteMedicalDrugClasses($ids: [ID!]!, $isSynchronous: Boolean) {
  deleteMedicalDrugClasses(ids: $ids, isSynchronous: $isSynchronous) {
    id
    state
  }
}
    `;
export const GetMedicalDrugClass = gql`
    query GetMedicalDrugClass($id: ID!, $correlationId: String) {
  medicalDrugClass(id: $id, correlationId: $correlationId) {
    id
    name
    creationDate
    modifiedDate
    owner {
      id
    }
    state
    alternateNames
    uri
    description
    identifier
    thing
    feeds {
      id
      name
    }
    links {
      uri
      linkType
      excerpts
    }
    workflow {
      id
      name
    }
    location {
      latitude
      longitude
    }
    h3 {
      h3r0
      h3r1
      h3r2
      h3r3
      h3r4
      h3r5
      h3r6
      h3r7
      h3r8
      h3r9
      h3r10
      h3r11
      h3r12
      h3r13
      h3r14
      h3r15
    }
  }
}
    `;
export const QueryMedicalDrugClasses = gql`
    query QueryMedicalDrugClasses($filter: MedicalDrugClassFilter, $correlationId: String) {
  medicalDrugClasses(filter: $filter, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
    }
  }
}
    `;
export const QueryMedicalDrugClassesClusters = gql`
    query QueryMedicalDrugClassesClusters($filter: MedicalDrugClassFilter, $clusters: EntityClustersInput, $correlationId: String) {
  medicalDrugClasses(
    filter: $filter
    clusters: $clusters
    correlationId: $correlationId
  ) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
    }
    clusters {
      clusters {
        entities {
          id
          name
        }
        similarity
      }
    }
  }
}
    `;
export const UpdateMedicalDrugClass = gql`
    mutation UpdateMedicalDrugClass($medicalDrugClass: MedicalDrugClassUpdateInput!) {
  updateMedicalDrugClass(medicalDrugClass: $medicalDrugClass) {
    id
    name
  }
}
    `;
export const CountMedicalGuidelines = gql`
    query CountMedicalGuidelines($filter: MedicalGuidelineFilter, $correlationId: String) {
  countMedicalGuidelines(filter: $filter, correlationId: $correlationId) {
    count
  }
}
    `;
export const CreateMedicalGuideline = gql`
    mutation CreateMedicalGuideline($medicalGuideline: MedicalGuidelineInput!) {
  createMedicalGuideline(medicalGuideline: $medicalGuideline) {
    id
    name
  }
}
    `;
export const DeleteAllMedicalGuidelines = gql`
    mutation DeleteAllMedicalGuidelines($filter: MedicalGuidelineFilter, $isSynchronous: Boolean, $correlationId: String) {
  deleteAllMedicalGuidelines(
    filter: $filter
    isSynchronous: $isSynchronous
    correlationId: $correlationId
  ) {
    id
    state
  }
}
    `;
export const DeleteMedicalGuideline = gql`
    mutation DeleteMedicalGuideline($id: ID!) {
  deleteMedicalGuideline(id: $id) {
    id
    state
  }
}
    `;
export const DeleteMedicalGuidelines = gql`
    mutation DeleteMedicalGuidelines($ids: [ID!]!, $isSynchronous: Boolean) {
  deleteMedicalGuidelines(ids: $ids, isSynchronous: $isSynchronous) {
    id
    state
  }
}
    `;
export const GetMedicalGuideline = gql`
    query GetMedicalGuideline($id: ID!, $correlationId: String) {
  medicalGuideline(id: $id, correlationId: $correlationId) {
    id
    name
    creationDate
    modifiedDate
    owner {
      id
    }
    state
    alternateNames
    uri
    description
    identifier
    thing
    feeds {
      id
      name
    }
    links {
      uri
      linkType
      excerpts
    }
    workflow {
      id
      name
    }
    location {
      latitude
      longitude
    }
    h3 {
      h3r0
      h3r1
      h3r2
      h3r3
      h3r4
      h3r5
      h3r6
      h3r7
      h3r8
      h3r9
      h3r10
      h3r11
      h3r12
      h3r13
      h3r14
      h3r15
    }
  }
}
    `;
export const QueryMedicalGuidelines = gql`
    query QueryMedicalGuidelines($filter: MedicalGuidelineFilter, $correlationId: String) {
  medicalGuidelines(filter: $filter, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
    }
  }
}
    `;
export const QueryMedicalGuidelinesClusters = gql`
    query QueryMedicalGuidelinesClusters($filter: MedicalGuidelineFilter, $clusters: EntityClustersInput, $correlationId: String) {
  medicalGuidelines(
    filter: $filter
    clusters: $clusters
    correlationId: $correlationId
  ) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
    }
    clusters {
      clusters {
        entities {
          id
          name
        }
        similarity
      }
    }
  }
}
    `;
export const UpdateMedicalGuideline = gql`
    mutation UpdateMedicalGuideline($medicalGuideline: MedicalGuidelineUpdateInput!) {
  updateMedicalGuideline(medicalGuideline: $medicalGuideline) {
    id
    name
  }
}
    `;
export const CountMedicalIndications = gql`
    query CountMedicalIndications($filter: MedicalIndicationFilter, $correlationId: String) {
  countMedicalIndications(filter: $filter, correlationId: $correlationId) {
    count
  }
}
    `;
export const CreateMedicalIndication = gql`
    mutation CreateMedicalIndication($medicalIndication: MedicalIndicationInput!) {
  createMedicalIndication(medicalIndication: $medicalIndication) {
    id
    name
  }
}
    `;
export const DeleteAllMedicalIndications = gql`
    mutation DeleteAllMedicalIndications($filter: MedicalIndicationFilter, $isSynchronous: Boolean, $correlationId: String) {
  deleteAllMedicalIndications(
    filter: $filter
    isSynchronous: $isSynchronous
    correlationId: $correlationId
  ) {
    id
    state
  }
}
    `;
export const DeleteMedicalIndication = gql`
    mutation DeleteMedicalIndication($id: ID!) {
  deleteMedicalIndication(id: $id) {
    id
    state
  }
}
    `;
export const DeleteMedicalIndications = gql`
    mutation DeleteMedicalIndications($ids: [ID!]!, $isSynchronous: Boolean) {
  deleteMedicalIndications(ids: $ids, isSynchronous: $isSynchronous) {
    id
    state
  }
}
    `;
export const GetMedicalIndication = gql`
    query GetMedicalIndication($id: ID!, $correlationId: String) {
  medicalIndication(id: $id, correlationId: $correlationId) {
    id
    name
    creationDate
    modifiedDate
    owner {
      id
    }
    state
    alternateNames
    uri
    description
    identifier
    thing
    feeds {
      id
      name
    }
    links {
      uri
      linkType
      excerpts
    }
    workflow {
      id
      name
    }
    location {
      latitude
      longitude
    }
    h3 {
      h3r0
      h3r1
      h3r2
      h3r3
      h3r4
      h3r5
      h3r6
      h3r7
      h3r8
      h3r9
      h3r10
      h3r11
      h3r12
      h3r13
      h3r14
      h3r15
    }
  }
}
    `;
export const QueryMedicalIndications = gql`
    query QueryMedicalIndications($filter: MedicalIndicationFilter, $correlationId: String) {
  medicalIndications(filter: $filter, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
    }
  }
}
    `;
export const QueryMedicalIndicationsClusters = gql`
    query QueryMedicalIndicationsClusters($filter: MedicalIndicationFilter, $clusters: EntityClustersInput, $correlationId: String) {
  medicalIndications(
    filter: $filter
    clusters: $clusters
    correlationId: $correlationId
  ) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
    }
    clusters {
      clusters {
        entities {
          id
          name
        }
        similarity
      }
    }
  }
}
    `;
export const UpdateMedicalIndication = gql`
    mutation UpdateMedicalIndication($medicalIndication: MedicalIndicationUpdateInput!) {
  updateMedicalIndication(medicalIndication: $medicalIndication) {
    id
    name
  }
}
    `;
export const CountMedicalProcedures = gql`
    query CountMedicalProcedures($filter: MedicalProcedureFilter, $correlationId: String) {
  countMedicalProcedures(filter: $filter, correlationId: $correlationId) {
    count
  }
}
    `;
export const CreateMedicalProcedure = gql`
    mutation CreateMedicalProcedure($medicalProcedure: MedicalProcedureInput!) {
  createMedicalProcedure(medicalProcedure: $medicalProcedure) {
    id
    name
  }
}
    `;
export const DeleteAllMedicalProcedures = gql`
    mutation DeleteAllMedicalProcedures($filter: MedicalProcedureFilter, $isSynchronous: Boolean, $correlationId: String) {
  deleteAllMedicalProcedures(
    filter: $filter
    isSynchronous: $isSynchronous
    correlationId: $correlationId
  ) {
    id
    state
  }
}
    `;
export const DeleteMedicalProcedure = gql`
    mutation DeleteMedicalProcedure($id: ID!) {
  deleteMedicalProcedure(id: $id) {
    id
    state
  }
}
    `;
export const DeleteMedicalProcedures = gql`
    mutation DeleteMedicalProcedures($ids: [ID!]!, $isSynchronous: Boolean) {
  deleteMedicalProcedures(ids: $ids, isSynchronous: $isSynchronous) {
    id
    state
  }
}
    `;
export const GetMedicalProcedure = gql`
    query GetMedicalProcedure($id: ID!, $correlationId: String) {
  medicalProcedure(id: $id, correlationId: $correlationId) {
    id
    name
    creationDate
    modifiedDate
    owner {
      id
    }
    state
    alternateNames
    uri
    description
    identifier
    thing
    feeds {
      id
      name
    }
    links {
      uri
      linkType
      excerpts
    }
    workflow {
      id
      name
    }
    location {
      latitude
      longitude
    }
    h3 {
      h3r0
      h3r1
      h3r2
      h3r3
      h3r4
      h3r5
      h3r6
      h3r7
      h3r8
      h3r9
      h3r10
      h3r11
      h3r12
      h3r13
      h3r14
      h3r15
    }
  }
}
    `;
export const QueryMedicalProcedures = gql`
    query QueryMedicalProcedures($filter: MedicalProcedureFilter, $correlationId: String) {
  medicalProcedures(filter: $filter, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
    }
  }
}
    `;
export const QueryMedicalProceduresClusters = gql`
    query QueryMedicalProceduresClusters($filter: MedicalProcedureFilter, $clusters: EntityClustersInput, $correlationId: String) {
  medicalProcedures(
    filter: $filter
    clusters: $clusters
    correlationId: $correlationId
  ) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
    }
    clusters {
      clusters {
        entities {
          id
          name
        }
        similarity
      }
    }
  }
}
    `;
export const UpdateMedicalProcedure = gql`
    mutation UpdateMedicalProcedure($medicalProcedure: MedicalProcedureUpdateInput!) {
  updateMedicalProcedure(medicalProcedure: $medicalProcedure) {
    id
    name
  }
}
    `;
export const CountMedicalStudies = gql`
    query CountMedicalStudies($filter: MedicalStudyFilter, $correlationId: String) {
  countMedicalStudies(filter: $filter, correlationId: $correlationId) {
    count
  }
}
    `;
export const CreateMedicalStudy = gql`
    mutation CreateMedicalStudy($medicalStudy: MedicalStudyInput!) {
  createMedicalStudy(medicalStudy: $medicalStudy) {
    id
    name
  }
}
    `;
export const DeleteAllMedicalStudies = gql`
    mutation DeleteAllMedicalStudies($filter: MedicalStudyFilter, $isSynchronous: Boolean, $correlationId: String) {
  deleteAllMedicalStudies(
    filter: $filter
    isSynchronous: $isSynchronous
    correlationId: $correlationId
  ) {
    id
    state
  }
}
    `;
export const DeleteMedicalStudies = gql`
    mutation DeleteMedicalStudies($ids: [ID!]!, $isSynchronous: Boolean) {
  deleteMedicalStudies(ids: $ids, isSynchronous: $isSynchronous) {
    id
    state
  }
}
    `;
export const DeleteMedicalStudy = gql`
    mutation DeleteMedicalStudy($id: ID!) {
  deleteMedicalStudy(id: $id) {
    id
    state
  }
}
    `;
export const GetMedicalStudy = gql`
    query GetMedicalStudy($id: ID!, $correlationId: String) {
  medicalStudy(id: $id, correlationId: $correlationId) {
    id
    name
    creationDate
    modifiedDate
    owner {
      id
    }
    state
    alternateNames
    uri
    description
    identifier
    thing
    feeds {
      id
      name
    }
    links {
      uri
      linkType
      excerpts
    }
    workflow {
      id
      name
    }
    location {
      latitude
      longitude
    }
    h3 {
      h3r0
      h3r1
      h3r2
      h3r3
      h3r4
      h3r5
      h3r6
      h3r7
      h3r8
      h3r9
      h3r10
      h3r11
      h3r12
      h3r13
      h3r14
      h3r15
    }
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
export const QueryMedicalStudies = gql`
    query QueryMedicalStudies($filter: MedicalStudyFilter, $correlationId: String) {
  medicalStudies(filter: $filter, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
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
export const QueryMedicalStudiesClusters = gql`
    query QueryMedicalStudiesClusters($filter: MedicalStudyFilter, $clusters: EntityClustersInput, $correlationId: String) {
  medicalStudies(
    filter: $filter
    clusters: $clusters
    correlationId: $correlationId
  ) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
      address {
        streetAddress
        city
        region
        country
        postalCode
      }
    }
    clusters {
      clusters {
        entities {
          id
          name
        }
        similarity
      }
    }
  }
}
    `;
export const UpdateMedicalStudy = gql`
    mutation UpdateMedicalStudy($medicalStudy: MedicalStudyUpdateInput!) {
  updateMedicalStudy(medicalStudy: $medicalStudy) {
    id
    name
  }
}
    `;
export const CountMedicalTests = gql`
    query CountMedicalTests($filter: MedicalTestFilter, $correlationId: String) {
  countMedicalTests(filter: $filter, correlationId: $correlationId) {
    count
  }
}
    `;
export const CreateMedicalTest = gql`
    mutation CreateMedicalTest($medicalTest: MedicalTestInput!) {
  createMedicalTest(medicalTest: $medicalTest) {
    id
    name
  }
}
    `;
export const DeleteAllMedicalTests = gql`
    mutation DeleteAllMedicalTests($filter: MedicalTestFilter, $isSynchronous: Boolean, $correlationId: String) {
  deleteAllMedicalTests(
    filter: $filter
    isSynchronous: $isSynchronous
    correlationId: $correlationId
  ) {
    id
    state
  }
}
    `;
export const DeleteMedicalTest = gql`
    mutation DeleteMedicalTest($id: ID!) {
  deleteMedicalTest(id: $id) {
    id
    state
  }
}
    `;
export const DeleteMedicalTests = gql`
    mutation DeleteMedicalTests($ids: [ID!]!, $isSynchronous: Boolean) {
  deleteMedicalTests(ids: $ids, isSynchronous: $isSynchronous) {
    id
    state
  }
}
    `;
export const GetMedicalTest = gql`
    query GetMedicalTest($id: ID!, $correlationId: String) {
  medicalTest(id: $id, correlationId: $correlationId) {
    id
    name
    creationDate
    modifiedDate
    owner {
      id
    }
    state
    alternateNames
    uri
    description
    identifier
    thing
    feeds {
      id
      name
    }
    links {
      uri
      linkType
      excerpts
    }
    workflow {
      id
      name
    }
    location {
      latitude
      longitude
    }
    h3 {
      h3r0
      h3r1
      h3r2
      h3r3
      h3r4
      h3r5
      h3r6
      h3r7
      h3r8
      h3r9
      h3r10
      h3r11
      h3r12
      h3r13
      h3r14
      h3r15
    }
  }
}
    `;
export const QueryMedicalTests = gql`
    query QueryMedicalTests($filter: MedicalTestFilter, $correlationId: String) {
  medicalTests(filter: $filter, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
    }
  }
}
    `;
export const QueryMedicalTestsClusters = gql`
    query QueryMedicalTestsClusters($filter: MedicalTestFilter, $clusters: EntityClustersInput, $correlationId: String) {
  medicalTests(
    filter: $filter
    clusters: $clusters
    correlationId: $correlationId
  ) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
    }
    clusters {
      clusters {
        entities {
          id
          name
        }
        similarity
      }
    }
  }
}
    `;
export const UpdateMedicalTest = gql`
    mutation UpdateMedicalTest($medicalTest: MedicalTestUpdateInput!) {
  updateMedicalTest(medicalTest: $medicalTest) {
    id
    name
  }
}
    `;
export const CountMedicalTherapies = gql`
    query CountMedicalTherapies($filter: MedicalTherapyFilter, $correlationId: String) {
  countMedicalTherapies(filter: $filter, correlationId: $correlationId) {
    count
  }
}
    `;
export const CreateMedicalTherapy = gql`
    mutation CreateMedicalTherapy($medicalTherapy: MedicalTherapyInput!) {
  createMedicalTherapy(medicalTherapy: $medicalTherapy) {
    id
    name
  }
}
    `;
export const DeleteAllMedicalTherapies = gql`
    mutation DeleteAllMedicalTherapies($filter: MedicalTherapyFilter, $isSynchronous: Boolean, $correlationId: String) {
  deleteAllMedicalTherapies(
    filter: $filter
    isSynchronous: $isSynchronous
    correlationId: $correlationId
  ) {
    id
    state
  }
}
    `;
export const DeleteMedicalTherapies = gql`
    mutation DeleteMedicalTherapies($ids: [ID!]!, $isSynchronous: Boolean) {
  deleteMedicalTherapies(ids: $ids, isSynchronous: $isSynchronous) {
    id
    state
  }
}
    `;
export const DeleteMedicalTherapy = gql`
    mutation DeleteMedicalTherapy($id: ID!) {
  deleteMedicalTherapy(id: $id) {
    id
    state
  }
}
    `;
export const GetMedicalTherapy = gql`
    query GetMedicalTherapy($id: ID!, $correlationId: String) {
  medicalTherapy(id: $id, correlationId: $correlationId) {
    id
    name
    creationDate
    modifiedDate
    owner {
      id
    }
    state
    alternateNames
    uri
    description
    identifier
    thing
    feeds {
      id
      name
    }
    links {
      uri
      linkType
      excerpts
    }
    workflow {
      id
      name
    }
    location {
      latitude
      longitude
    }
    h3 {
      h3r0
      h3r1
      h3r2
      h3r3
      h3r4
      h3r5
      h3r6
      h3r7
      h3r8
      h3r9
      h3r10
      h3r11
      h3r12
      h3r13
      h3r14
      h3r15
    }
  }
}
    `;
export const QueryMedicalTherapies = gql`
    query QueryMedicalTherapies($filter: MedicalTherapyFilter, $correlationId: String) {
  medicalTherapies(filter: $filter, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
    }
  }
}
    `;
export const QueryMedicalTherapiesClusters = gql`
    query QueryMedicalTherapiesClusters($filter: MedicalTherapyFilter, $clusters: EntityClustersInput, $correlationId: String) {
  medicalTherapies(
    filter: $filter
    clusters: $clusters
    correlationId: $correlationId
  ) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
    }
    clusters {
      clusters {
        entities {
          id
          name
        }
        similarity
      }
    }
  }
}
    `;
export const UpdateMedicalTherapy = gql`
    mutation UpdateMedicalTherapy($medicalTherapy: MedicalTherapyUpdateInput!) {
  updateMedicalTherapy(medicalTherapy: $medicalTherapy) {
    id
    name
  }
}
    `;
export const SendNotification = gql`
    mutation SendNotification($connector: IntegrationConnectorInput!, $text: String!, $textType: TextTypes) {
  sendNotification(connector: $connector, text: $text, textType: $textType) {
    result
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
export const MatchEntity = gql`
    mutation MatchEntity($observable: ObservableInput!, $candidates: [EntityReferenceInput!]!, $specification: EntityReferenceInput, $correlationId: String) {
  matchEntity(
    observable: $observable
    candidates: $candidates
    specification: $specification
    correlationId: $correlationId
  ) {
    reference {
      type
      observable {
        id
        name
      }
    }
    relevance
    reasoning
  }
}
    `;
export const ResolveEntities = gql`
    mutation ResolveEntities($type: ObservableTypes!, $entities: [EntityReferenceInput!]!, $threshold: Float, $specification: EntityReferenceInput, $correlationId: String) {
  resolveEntities(
    type: $type
    entities: $entities
    threshold: $threshold
    specification: $specification
    correlationId: $correlationId
  ) {
    type
    primary {
      id
    }
    resolved {
      id
    }
    relevance
    reasoning
    primaryCluster {
      entities {
        id
        name
      }
      similarity
    }
    outlierClusters {
      entities {
        id
        name
      }
      similarity
    }
  }
}
    `;
export const ResolveEntity = gql`
    mutation ResolveEntity($type: ObservableTypes!, $source: EntityReferenceInput!, $target: EntityReferenceInput!, $specification: EntityReferenceInput, $correlationId: String) {
  resolveEntity(
    type: $type
    source: $source
    target: $target
    specification: $specification
    correlationId: $correlationId
  ) {
    reference {
      type
      observable {
        id
        name
      }
    }
    relevance
    reasoning
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
export const CountOrganizations = gql`
    query CountOrganizations($filter: OrganizationFilter, $correlationId: String) {
  countOrganizations(filter: $filter, correlationId: $correlationId) {
    count
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
    mutation DeleteAllOrganizations($filter: OrganizationFilter, $isSynchronous: Boolean, $correlationId: String) {
  deleteAllOrganizations(
    filter: $filter
    isSynchronous: $isSynchronous
    correlationId: $correlationId
  ) {
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
    mutation DeleteOrganizations($ids: [ID!]!, $isSynchronous: Boolean) {
  deleteOrganizations(ids: $ids, isSynchronous: $isSynchronous) {
    id
    state
  }
}
    `;
export const EnrichOrganizations = gql`
    mutation EnrichOrganizations($filter: OrganizationFilter, $connector: EntityEnrichmentConnectorInput!, $correlationId: String) {
  enrichOrganizations(
    filter: $filter
    connector: $connector
    correlationId: $correlationId
  ) {
    id
    name
  }
}
    `;
export const GetOrganization = gql`
    query GetOrganization($id: ID!, $correlationId: String) {
  organization(id: $id, correlationId: $correlationId) {
    id
    name
    creationDate
    modifiedDate
    owner {
      id
    }
    state
    alternateNames
    uri
    description
    identifier
    thing
    feeds {
      id
      name
    }
    links {
      uri
      linkType
      excerpts
    }
    workflow {
      id
      name
    }
    location {
      latitude
      longitude
    }
    h3 {
      h3r0
      h3r1
      h3r2
      h3r3
      h3r4
      h3r5
      h3r6
      h3r7
      h3r8
      h3r9
      h3r10
      h3r11
      h3r12
      h3r13
      h3r14
      h3r15
    }
    address {
      streetAddress
      city
      region
      country
      postalCode
    }
    foundingDate
    email
    telephone
    legalName
    industries
    revenue
    revenueCurrency
    investment
    investmentCurrency
    founders {
      id
      name
    }
    employees {
      id
      name
    }
    members {
      id
      name
    }
    parentOrganization {
      id
      name
    }
    memberOf {
      id
      name
    }
    subOrganizations {
      id
      name
    }
    locations {
      id
      name
    }
    investmentsReceived {
      id
      name
    }
    investorFunds {
      id
      name
    }
  }
}
    `;
export const QueryOrganizations = gql`
    query QueryOrganizations($filter: OrganizationFilter, $correlationId: String) {
  organizations(filter: $filter, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
      address {
        streetAddress
        city
        region
        country
        postalCode
      }
      foundingDate
      email
      telephone
      legalName
      industries
      revenue
      revenueCurrency
      investment
      investmentCurrency
    }
  }
}
    `;
export const QueryOrganizationsClusters = gql`
    query QueryOrganizationsClusters($filter: OrganizationFilter, $clusters: EntityClustersInput, $correlationId: String) {
  organizations(
    filter: $filter
    clusters: $clusters
    correlationId: $correlationId
  ) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
      address {
        streetAddress
        city
        region
        country
        postalCode
      }
      foundingDate
      email
      telephone
      legalName
      industries
      revenue
      revenueCurrency
      investment
      investmentCurrency
      founders {
        id
        name
      }
      employees {
        id
        name
      }
      members {
        id
        name
      }
      parentOrganization {
        id
        name
      }
      memberOf {
        id
        name
      }
      subOrganizations {
        id
        name
      }
      locations {
        id
        name
      }
      investmentsReceived {
        id
        name
      }
      investorFunds {
        id
        name
      }
    }
    clusters {
      clusters {
        entities {
          id
          name
        }
        similarity
      }
    }
  }
}
    `;
export const QueryOrganizationsExpanded = gql`
    query QueryOrganizationsExpanded($filter: OrganizationFilter, $correlationId: String) {
  organizations(filter: $filter, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
      address {
        streetAddress
        city
        region
        country
        postalCode
      }
      foundingDate
      email
      telephone
      legalName
      industries
      revenue
      revenueCurrency
      investment
      investmentCurrency
      founders {
        id
        name
      }
      employees {
        id
        name
      }
      members {
        id
        name
      }
      parentOrganization {
        id
        name
      }
      memberOf {
        id
        name
      }
      subOrganizations {
        id
        name
      }
      locations {
        id
        name
      }
      investmentsReceived {
        id
        name
      }
      investorFunds {
        id
        name
      }
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
export const CountPersons = gql`
    query CountPersons($filter: PersonFilter, $correlationId: String) {
  countPersons(filter: $filter, correlationId: $correlationId) {
    count
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
    mutation DeleteAllPersons($filter: PersonFilter, $isSynchronous: Boolean, $correlationId: String) {
  deleteAllPersons(
    filter: $filter
    isSynchronous: $isSynchronous
    correlationId: $correlationId
  ) {
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
    mutation DeletePersons($ids: [ID!]!, $isSynchronous: Boolean) {
  deletePersons(ids: $ids, isSynchronous: $isSynchronous) {
    id
    state
  }
}
    `;
export const EnrichPersons = gql`
    mutation EnrichPersons($filter: PersonFilter, $connector: EntityEnrichmentConnectorInput!, $correlationId: String) {
  enrichPersons(
    filter: $filter
    connector: $connector
    correlationId: $correlationId
  ) {
    id
    name
  }
}
    `;
export const GetPerson = gql`
    query GetPerson($id: ID!, $correlationId: String) {
  person(id: $id, correlationId: $correlationId) {
    id
    name
    creationDate
    modifiedDate
    owner {
      id
    }
    state
    alternateNames
    uri
    description
    identifier
    thing
    feeds {
      id
      name
    }
    links {
      uri
      linkType
      excerpts
    }
    workflow {
      id
      name
    }
    location {
      latitude
      longitude
    }
    h3 {
      h3r0
      h3r1
      h3r2
      h3r3
      h3r4
      h3r5
      h3r6
      h3r7
      h3r8
      h3r9
      h3r10
      h3r11
      h3r12
      h3r13
      h3r14
      h3r15
    }
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
    worksFor {
      id
      name
    }
    affiliation {
      id
      name
    }
    memberOf {
      id
      name
    }
    alumniOf {
      id
      name
    }
    birthPlace {
      id
      name
    }
    deathPlace {
      id
      name
    }
    homeLocation {
      id
      name
    }
    workLocation {
      id
      name
    }
  }
}
    `;
export const QueryPersons = gql`
    query QueryPersons($filter: PersonFilter, $correlationId: String) {
  persons(filter: $filter, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
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
export const QueryPersonsClusters = gql`
    query QueryPersonsClusters($filter: PersonFilter, $clusters: EntityClustersInput, $correlationId: String) {
  persons(filter: $filter, clusters: $clusters, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
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
      worksFor {
        id
        name
      }
      affiliation {
        id
        name
      }
      memberOf {
        id
        name
      }
      alumniOf {
        id
        name
      }
      birthPlace {
        id
        name
      }
      deathPlace {
        id
        name
      }
      homeLocation {
        id
        name
      }
      workLocation {
        id
        name
      }
    }
    clusters {
      clusters {
        entities {
          id
          name
        }
        similarity
      }
    }
  }
}
    `;
export const QueryPersonsExpanded = gql`
    query QueryPersonsExpanded($filter: PersonFilter, $correlationId: String) {
  persons(filter: $filter, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
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
      worksFor {
        id
        name
      }
      affiliation {
        id
        name
      }
      memberOf {
        id
        name
      }
      alumniOf {
        id
        name
      }
      birthPlace {
        id
        name
      }
      deathPlace {
        id
        name
      }
      homeLocation {
        id
        name
      }
      workLocation {
        id
        name
      }
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
export const CountPlaces = gql`
    query CountPlaces($filter: PlaceFilter, $correlationId: String) {
  countPlaces(filter: $filter, correlationId: $correlationId) {
    count
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
    mutation DeleteAllPlaces($filter: PlaceFilter, $isSynchronous: Boolean, $correlationId: String) {
  deleteAllPlaces(
    filter: $filter
    isSynchronous: $isSynchronous
    correlationId: $correlationId
  ) {
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
    mutation DeletePlaces($ids: [ID!]!, $isSynchronous: Boolean) {
  deletePlaces(ids: $ids, isSynchronous: $isSynchronous) {
    id
    state
  }
}
    `;
export const EnrichPlaces = gql`
    mutation EnrichPlaces($filter: PlaceFilter, $connector: EntityEnrichmentConnectorInput!, $correlationId: String) {
  enrichPlaces(
    filter: $filter
    connector: $connector
    correlationId: $correlationId
  ) {
    id
    name
  }
}
    `;
export const GetPlace = gql`
    query GetPlace($id: ID!, $correlationId: String) {
  place(id: $id, correlationId: $correlationId) {
    id
    name
    creationDate
    modifiedDate
    owner {
      id
    }
    state
    alternateNames
    uri
    description
    identifier
    thing
    feeds {
      id
      name
    }
    links {
      uri
      linkType
      excerpts
    }
    workflow {
      id
      name
    }
    location {
      latitude
      longitude
    }
    h3 {
      h3r0
      h3r1
      h3r2
      h3r3
      h3r4
      h3r5
      h3r6
      h3r7
      h3r8
      h3r9
      h3r10
      h3r11
      h3r12
      h3r13
      h3r14
      h3r15
    }
    address {
      streetAddress
      city
      region
      country
      postalCode
    }
    telephone
    openingHours
    priceRange
  }
}
    `;
export const QueryPlaces = gql`
    query QueryPlaces($filter: PlaceFilter, $correlationId: String) {
  places(filter: $filter, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
      address {
        streetAddress
        city
        region
        country
        postalCode
      }
      telephone
      openingHours
      priceRange
    }
  }
}
    `;
export const QueryPlacesClusters = gql`
    query QueryPlacesClusters($filter: PlaceFilter, $clusters: EntityClustersInput, $correlationId: String) {
  places(filter: $filter, clusters: $clusters, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
      address {
        streetAddress
        city
        region
        country
        postalCode
      }
      telephone
      openingHours
      priceRange
    }
    clusters {
      clusters {
        entities {
          id
          name
        }
        similarity
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
export const CountProducts = gql`
    query CountProducts($filter: ProductFilter, $correlationId: String) {
  countProducts(filter: $filter, correlationId: $correlationId) {
    count
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
    mutation DeleteAllProducts($filter: ProductFilter, $isSynchronous: Boolean, $correlationId: String) {
  deleteAllProducts(
    filter: $filter
    isSynchronous: $isSynchronous
    correlationId: $correlationId
  ) {
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
    mutation DeleteProducts($ids: [ID!]!, $isSynchronous: Boolean) {
  deleteProducts(ids: $ids, isSynchronous: $isSynchronous) {
    id
    state
  }
}
    `;
export const EnrichProducts = gql`
    mutation EnrichProducts($filter: ProductFilter, $connector: EntityEnrichmentConnectorInput!, $correlationId: String) {
  enrichProducts(
    filter: $filter
    connector: $connector
    correlationId: $correlationId
  ) {
    id
    name
  }
}
    `;
export const GetProduct = gql`
    query GetProduct($id: ID!, $correlationId: String) {
  product(id: $id, correlationId: $correlationId) {
    id
    name
    creationDate
    modifiedDate
    owner {
      id
    }
    state
    alternateNames
    uri
    description
    identifier
    thing
    feeds {
      id
      name
    }
    links {
      uri
      linkType
      excerpts
    }
    workflow {
      id
      name
    }
    location {
      latitude
      longitude
    }
    h3 {
      h3r0
      h3r1
      h3r2
      h3r3
      h3r4
      h3r5
      h3r6
      h3r7
      h3r8
      h3r9
      h3r10
      h3r11
      h3r12
      h3r13
      h3r14
      h3r15
    }
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
    gtin
    mpn
    releaseDate
    productionDate
  }
}
    `;
export const QueryProducts = gql`
    query QueryProducts($filter: ProductFilter, $correlationId: String) {
  products(filter: $filter, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
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
      gtin
      mpn
      releaseDate
      productionDate
    }
  }
}
    `;
export const QueryProductsClusters = gql`
    query QueryProductsClusters($filter: ProductFilter, $clusters: EntityClustersInput, $correlationId: String) {
  products(filter: $filter, clusters: $clusters, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
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
      gtin
      mpn
      releaseDate
      productionDate
    }
    clusters {
      clusters {
        entities {
          id
          name
        }
        similarity
      }
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
    credits
    lastCreditsDate
    workflow {
      id
      name
    }
    specification {
      id
      name
    }
    embeddings {
      textSpecification {
        id
      }
      imageSpecification {
        id
      }
    }
    quota {
      storage
      contents
      credits
      feeds
      posts
      conversations
    }
    callbackUri
  }
}
    `;
export const LookupCredits = gql`
    query LookupCredits($correlationId: String!, $startDate: DateTime, $duration: TimeSpan) {
  lookupCredits(
    correlationId: $correlationId
    startDate: $startDate
    duration: $duration
  ) {
    correlationId
    ownerId
    credits
    storageRatio
    computeRatio
    embeddingRatio
    completionRatio
    generationRatio
    ingestionRatio
    indexingRatio
    preparationRatio
    extractionRatio
    classificationRatio
    enrichmentRatio
    publishingRatio
    searchRatio
    conversationRatio
  }
}
    `;
export const LookupUsage = gql`
    query LookupUsage($correlationId: String!, $startDate: DateTime, $duration: TimeSpan) {
  lookupUsage(
    correlationId: $correlationId
    startDate: $startDate
    duration: $duration
  ) {
    id
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
    promptTokens
    completionTokens
    tokens
    count
    operation
    operationType
  }
}
    `;
export const QueryCredits = gql`
    query QueryCredits($startDate: DateTime!, $duration: TimeSpan!) {
  credits(startDate: $startDate, duration: $duration) {
    correlationId
    ownerId
    credits
    storageRatio
    computeRatio
    embeddingRatio
    completionRatio
    generationRatio
    ingestionRatio
    indexingRatio
    preparationRatio
    extractionRatio
    classificationRatio
    enrichmentRatio
    publishingRatio
    searchRatio
    conversationRatio
  }
}
    `;
export const QueryTokens = gql`
    query QueryTokens($startDate: DateTime!, $duration: TimeSpan!) {
  tokens(startDate: $startDate, duration: $duration) {
    correlationId
    ownerId
    embeddingInputTokens
    embeddingModelServices
    completionInputTokens
    completionOutputTokens
    completionModelServices
    preparationInputTokens
    preparationOutputTokens
    preparationModelServices
    extractionInputTokens
    extractionOutputTokens
    extractionModelServices
    generationInputTokens
    generationOutputTokens
    generationModelServices
  }
}
    `;
export const QueryUsage = gql`
    query QueryUsage($startDate: DateTime!, $duration: TimeSpan!, $names: [String!], $excludedNames: [String!], $offset: Int, $limit: Int) {
  usage(
    startDate: $startDate
    duration: $duration
    names: $names
    excludedNames: $excludedNames
    offset: $offset
    limit: $limit
  ) {
    id
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
    promptTokens
    completionTokens
    tokens
    count
    operation
    operationType
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
export const CountRepos = gql`
    query CountRepos($filter: RepoFilter, $correlationId: String) {
  countRepos(filter: $filter, correlationId: $correlationId) {
    count
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
    mutation DeleteAllRepos($filter: RepoFilter, $isSynchronous: Boolean, $correlationId: String) {
  deleteAllRepos(
    filter: $filter
    isSynchronous: $isSynchronous
    correlationId: $correlationId
  ) {
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
    mutation DeleteRepos($ids: [ID!]!, $isSynchronous: Boolean) {
  deleteRepos(ids: $ids, isSynchronous: $isSynchronous) {
    id
    state
  }
}
    `;
export const GetRepo = gql`
    query GetRepo($id: ID!, $correlationId: String) {
  repo(id: $id, correlationId: $correlationId) {
    id
    name
    creationDate
    modifiedDate
    owner {
      id
    }
    state
    alternateNames
    uri
    description
    identifier
    thing
    feeds {
      id
      name
    }
    links {
      uri
      linkType
      excerpts
    }
    workflow {
      id
      name
    }
    location {
      latitude
      longitude
    }
    h3 {
      h3r0
      h3r1
      h3r2
      h3r3
      h3r4
      h3r5
      h3r6
      h3r7
      h3r8
      h3r9
      h3r10
      h3r11
      h3r12
      h3r13
      h3r14
      h3r15
    }
  }
}
    `;
export const QueryRepos = gql`
    query QueryRepos($filter: RepoFilter, $correlationId: String) {
  repos(filter: $filter, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
    }
  }
}
    `;
export const QueryReposClusters = gql`
    query QueryReposClusters($filter: RepoFilter, $clusters: EntityClustersInput, $correlationId: String) {
  repos(filter: $filter, clusters: $clusters, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
    }
    clusters {
      clusters {
        entities {
          id
          name
        }
        similarity
      }
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
export const MapWeb = gql`
    query MapWeb($uri: URL!, $allowedPaths: [String!], $excludedPaths: [String!], $correlationId: String) {
  mapWeb(
    uri: $uri
    allowedPaths: $allowedPaths
    excludedPaths: $excludedPaths
    correlationId: $correlationId
  ) {
    results
  }
}
    `;
export const SearchWeb = gql`
    query SearchWeb($text: String!, $service: SearchServiceTypes, $limit: Int, $correlationId: String) {
  searchWeb(
    text: $text
    service: $service
    limit: $limit
    correlationId: $correlationId
  ) {
    results {
      uri
      text
      title
      score
    }
  }
}
    `;
export const CountSoftwares = gql`
    query CountSoftwares($filter: SoftwareFilter, $correlationId: String) {
  countSoftwares(filter: $filter, correlationId: $correlationId) {
    count
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
    mutation DeleteAllSoftwares($filter: SoftwareFilter, $isSynchronous: Boolean, $correlationId: String) {
  deleteAllSoftwares(
    filter: $filter
    isSynchronous: $isSynchronous
    correlationId: $correlationId
  ) {
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
    mutation DeleteSoftwares($ids: [ID!]!, $isSynchronous: Boolean) {
  deleteSoftwares(ids: $ids, isSynchronous: $isSynchronous) {
    id
    state
  }
}
    `;
export const GetSoftware = gql`
    query GetSoftware($id: ID!, $correlationId: String) {
  software(id: $id, correlationId: $correlationId) {
    id
    name
    creationDate
    modifiedDate
    owner {
      id
    }
    state
    alternateNames
    uri
    description
    identifier
    thing
    feeds {
      id
      name
    }
    links {
      uri
      linkType
      excerpts
    }
    workflow {
      id
      name
    }
    location {
      latitude
      longitude
    }
    h3 {
      h3r0
      h3r1
      h3r2
      h3r3
      h3r4
      h3r5
      h3r6
      h3r7
      h3r8
      h3r9
      h3r10
      h3r11
      h3r12
      h3r13
      h3r14
      h3r15
    }
    releaseDate
    developer
  }
}
    `;
export const QuerySoftwares = gql`
    query QuerySoftwares($filter: SoftwareFilter, $correlationId: String) {
  softwares(filter: $filter, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
      releaseDate
      developer
    }
  }
}
    `;
export const QuerySoftwaresClusters = gql`
    query QuerySoftwaresClusters($filter: SoftwareFilter, $clusters: EntityClustersInput, $correlationId: String) {
  softwares(filter: $filter, clusters: $clusters, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      alternateNames
      uri
      description
      identifier
      thing
      feeds {
        id
        name
      }
      links {
        uri
        linkType
        excerpts
      }
      workflow {
        id
        name
      }
      location {
        latitude
        longitude
      }
      h3 {
        h3r0
        h3r1
        h3r2
        h3r3
        h3r4
        h3r5
        h3r6
        h3r7
        h3r8
        h3r9
        h3r10
        h3r11
        h3r12
        h3r13
        h3r14
        h3r15
      }
      releaseDate
      developer
    }
    clusters {
      clusters {
        entities {
          id
          name
        }
        similarity
      }
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
export const CountSpecifications = gql`
    query CountSpecifications($filter: SpecificationFilter, $correlationId: String) {
  countSpecifications(filter: $filter, correlationId: $correlationId) {
    count
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
export const DeleteAllSpecifications = gql`
    mutation DeleteAllSpecifications($filter: SpecificationFilter, $isSynchronous: Boolean, $correlationId: String) {
  deleteAllSpecifications(
    filter: $filter
    isSynchronous: $isSynchronous
    correlationId: $correlationId
  ) {
    id
    state
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
export const DeleteSpecifications = gql`
    mutation DeleteSpecifications($ids: [ID!]!, $isSynchronous: Boolean) {
  deleteSpecifications(ids: $ids, isSynchronous: $isSynchronous) {
    id
    state
  }
}
    `;
export const GetSpecification = gql`
    query GetSpecification($id: ID!, $correlationId: String) {
  specification(id: $id, correlationId: $correlationId) {
    id
    name
    creationDate
    modifiedDate
    owner {
      id
    }
    state
    type
    serviceType
    systemPrompt
    customGuidance
    customInstructions
    searchType
    numberSimilar
    strategy {
      type
      messageLimit
      embedCitations
      flattenCitations
      enableFacets
      enableSummarization
      enableEntityExtraction
      enableFactExtraction
      entityExtractionLimit
      factExtractionLimit
      messagesWeight
      contentsWeight
    }
    promptStrategy {
      type
    }
    retrievalStrategy {
      type
      contentLimit
      disableFallback
    }
    rerankingStrategy {
      serviceType
      threshold
    }
    graphStrategy {
      type
      generateGraph
      observableLimit
    }
    factStrategy {
      factLimit
    }
    revisionStrategy {
      type
      customRevision
      count
    }
    azureAI {
      tokenLimit
      completionTokenLimit
      key
      endpoint
      temperature
      probability
      chunkTokenLimit
    }
    openAI {
      tokenLimit
      completionTokenLimit
      model
      key
      endpoint
      modelName
      temperature
      probability
      chunkTokenLimit
      detailLevel
      reasoningEffort
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
      chunkTokenLimit
    }
    cohere {
      tokenLimit
      completionTokenLimit
      model
      key
      modelName
      temperature
      probability
      chunkTokenLimit
    }
    anthropic {
      tokenLimit
      completionTokenLimit
      model
      key
      modelName
      temperature
      probability
      enableThinking
      thinkingTokenLimit
      effort
    }
    google {
      tokenLimit
      completionTokenLimit
      model
      key
      modelName
      temperature
      probability
      chunkTokenLimit
      enableThinking
      thinkingTokenLimit
      thinkingLevel
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
    mistral {
      tokenLimit
      completionTokenLimit
      model
      key
      modelName
      endpoint
      temperature
      probability
      chunkTokenLimit
    }
    bedrock {
      tokenLimit
      completionTokenLimit
      model
      accessKey
      secretAccessKey
      endpoint
      region
      modelName
      temperature
      probability
    }
    xai {
      tokenLimit
      completionTokenLimit
      model
      key
      modelName
      endpoint
      temperature
      probability
    }
    groq {
      tokenLimit
      completionTokenLimit
      model
      key
      modelName
      endpoint
      temperature
      probability
    }
    cerebras {
      tokenLimit
      completionTokenLimit
      model
      key
      modelName
      endpoint
      temperature
      probability
    }
    deepseek {
      tokenLimit
      completionTokenLimit
      model
      key
      modelName
      temperature
      probability
    }
    jina {
      model
      key
      modelName
      chunkTokenLimit
    }
    voyage {
      model
      key
      modelName
      chunkTokenLimit
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
          name
          state
          originalDate
          identifier
          uri
          type
          fileType
          mimeType
          format
          formatName
          fileExtension
          fileName
          fileSize
          fileMetadata
          relativeFolderPath
          masterUri
          imageUri
          textUri
          audioUri
          transcriptUri
          snapshotsUri
          snapshotCount
          summary
          customSummary
          keywords
          bullets
          headlines
          posts
          chapters
          questions
          quotes
          video {
            width
            height
            duration
            make
            model
            software
            title
            description
            keywords
            author
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
            genre
            title
            description
            bitrate
            channels
            sampleRate
            bitsPerSample
            duration
          }
          image {
            width
            height
            resolutionX
            resolutionY
            bitsPerComponent
            components
            projectionType
            orientation
            description
            make
            model
            software
            lens
            focalLength
            exposureTime
            fNumber
            iso
            heading
            pitch
          }
          document {
            title
            subject
            summary
            author
            lastModifiedBy
            publisher
            description
            keywords
            pageCount
            worksheetCount
            slideCount
            wordCount
            lineCount
            paragraphCount
            isEncrypted
            hasDigitalSignature
          }
        }
        index
        text
        startTime
        endTime
        pageNumber
        frameNumber
      }
      toolCalls {
        id
        name
        arguments
      }
      tokens
      throughput
      ttft
      completionTime
      timestamp
      modelService
      model
      data
      mimeType
      toolCallId
      toolCallResponse
    }
    error
  }
}
    `;
export const QueryModels = gql`
    query QueryModels($filter: ModelFilter) {
  models(filter: $filter) {
    results {
      uri
      name
      type
      serviceType
      model
      modelType
      description
      availableOn
      features {
        keyFeatures
        strengths
        useCases
      }
      metadata {
        reasoning
        multilingual
        multimodal
        knowledgeCutoff
        promptCostPerMillion
        completionCostPerMillion
        embeddingsCostPerMillion
        rerankingCostPerMillion
        contextWindowTokens
        maxOutputTokens
      }
    }
  }
}
    `;
export const QuerySpecifications = gql`
    query QuerySpecifications($filter: SpecificationFilter, $correlationId: String) {
  specifications(filter: $filter, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      type
      serviceType
      systemPrompt
      customGuidance
      customInstructions
      searchType
      numberSimilar
      strategy {
        type
        messageLimit
        embedCitations
        flattenCitations
        enableFacets
        enableSummarization
        enableEntityExtraction
        enableFactExtraction
        entityExtractionLimit
        factExtractionLimit
        messagesWeight
        contentsWeight
      }
      promptStrategy {
        type
      }
      retrievalStrategy {
        type
        contentLimit
        disableFallback
      }
      rerankingStrategy {
        serviceType
        threshold
      }
      graphStrategy {
        type
        generateGraph
        observableLimit
      }
      factStrategy {
        factLimit
      }
      revisionStrategy {
        type
        customRevision
        count
      }
      azureAI {
        tokenLimit
        completionTokenLimit
        key
        endpoint
        temperature
        probability
        chunkTokenLimit
      }
      openAI {
        tokenLimit
        completionTokenLimit
        model
        key
        endpoint
        modelName
        temperature
        probability
        chunkTokenLimit
        detailLevel
        reasoningEffort
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
        chunkTokenLimit
      }
      cohere {
        tokenLimit
        completionTokenLimit
        model
        key
        modelName
        temperature
        probability
        chunkTokenLimit
      }
      anthropic {
        tokenLimit
        completionTokenLimit
        model
        key
        modelName
        temperature
        probability
        enableThinking
        thinkingTokenLimit
        effort
      }
      google {
        tokenLimit
        completionTokenLimit
        model
        key
        modelName
        temperature
        probability
        chunkTokenLimit
        enableThinking
        thinkingTokenLimit
        thinkingLevel
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
      mistral {
        tokenLimit
        completionTokenLimit
        model
        key
        modelName
        endpoint
        temperature
        probability
        chunkTokenLimit
      }
      bedrock {
        tokenLimit
        completionTokenLimit
        model
        accessKey
        secretAccessKey
        endpoint
        region
        modelName
        temperature
        probability
      }
      xai {
        tokenLimit
        completionTokenLimit
        model
        key
        modelName
        endpoint
        temperature
        probability
      }
      groq {
        tokenLimit
        completionTokenLimit
        model
        key
        modelName
        endpoint
        temperature
        probability
      }
      cerebras {
        tokenLimit
        completionTokenLimit
        model
        key
        modelName
        endpoint
        temperature
        probability
      }
      deepseek {
        tokenLimit
        completionTokenLimit
        model
        key
        modelName
        temperature
        probability
      }
      jina {
        model
        key
        modelName
        chunkTokenLimit
      }
      voyage {
        model
        key
        modelName
        chunkTokenLimit
      }
    }
  }
}
    `;
export const SpecificationExists = gql`
    query SpecificationExists($filter: SpecificationFilter, $correlationId: String) {
  specificationExists(filter: $filter, correlationId: $correlationId) {
    result
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
export const UpsertSpecification = gql`
    mutation UpsertSpecification($specification: SpecificationInput!) {
  upsertSpecification(specification: $specification) {
    id
    name
    state
    type
    serviceType
  }
}
    `;
export const CountUsers = gql`
    query CountUsers($filter: UserFilter, $correlationId: String) {
  countUsers(filter: $filter, correlationId: $correlationId) {
    count
  }
}
    `;
export const CreateUser = gql`
    mutation CreateUser($user: UserInput!) {
  createUser(user: $user) {
    id
    name
    state
    type
    description
    identifier
  }
}
    `;
export const DeleteUser = gql`
    mutation DeleteUser($id: ID!) {
  deleteUser(id: $id) {
    id
    state
  }
}
    `;
export const DisableUser = gql`
    mutation DisableUser($id: ID!) {
  disableUser(id: $id) {
    id
    state
  }
}
    `;
export const EnableUser = gql`
    mutation EnableUser($id: ID!) {
  enableUser(id: $id) {
    id
    state
  }
}
    `;
export const GetUser = gql`
    query GetUser {
  user {
    id
    name
    creationDate
    modifiedDate
    relevance
    owner {
      id
    }
    state
    type
    identifier
    description
    connectors {
      id
      name
      state
      type
      authentication {
        type
        microsoft {
          tenantId
          clientId
          clientSecret
        }
        google {
          clientId
          clientSecret
        }
        oauth {
          provider
          clientId
          clientSecret
          refreshToken
          redirectUri
          metadata
        }
        arcade {
          authorizationId
          provider
          metadata
        }
      }
      integration {
        type
        uri
        slack {
          token
          channel
        }
        email {
          from
          subject
          to
        }
        twitter {
          consumerKey
          consumerSecret
          accessTokenKey
          accessTokenSecret
        }
        mcp {
          token
          type
        }
      }
    }
  }
}
    `;
export const GetUserByIdentifier = gql`
    query GetUserByIdentifier($identifier: String!) {
  userByIdentifier(identifier: $identifier) {
    id
    name
    creationDate
    modifiedDate
    relevance
    owner {
      id
    }
    state
    type
    identifier
    description
    connectors {
      id
      name
      state
      type
      authentication {
        type
        microsoft {
          tenantId
          clientId
          clientSecret
        }
        google {
          clientId
          clientSecret
        }
        oauth {
          provider
          clientId
          clientSecret
          refreshToken
          redirectUri
          metadata
        }
        arcade {
          authorizationId
          provider
          metadata
        }
      }
      integration {
        type
        uri
        slack {
          token
          channel
        }
        email {
          from
          subject
          to
        }
        twitter {
          consumerKey
          consumerSecret
          accessTokenKey
          accessTokenSecret
        }
        mcp {
          token
          type
        }
      }
    }
  }
}
    `;
export const QueryUsers = gql`
    query QueryUsers($filter: UserFilter, $correlationId: String) {
  users(filter: $filter, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      type
      identifier
      description
      connectors {
        id
        name
        state
        type
        authentication {
          type
          microsoft {
            tenantId
            clientId
            clientSecret
          }
          google {
            clientId
            clientSecret
          }
          oauth {
            provider
            clientId
            clientSecret
            refreshToken
            redirectUri
            metadata
          }
          arcade {
            authorizationId
            provider
            metadata
          }
        }
        integration {
          type
          uri
          slack {
            token
            channel
          }
          email {
            from
            subject
            to
          }
          twitter {
            consumerKey
            consumerSecret
            accessTokenKey
            accessTokenSecret
          }
          mcp {
            token
            type
          }
        }
      }
    }
  }
}
    `;
export const UpdateUser = gql`
    mutation UpdateUser($user: UserUpdateInput!) {
  updateUser(user: $user) {
    id
    name
    state
    type
    description
    identifier
  }
}
    `;
export const CountViews = gql`
    query CountViews($filter: ViewFilter, $correlationId: String) {
  countViews(filter: $filter, correlationId: $correlationId) {
    count
  }
}
    `;
export const CreateView = gql`
    mutation CreateView($view: ViewInput!) {
  createView(view: $view) {
    id
    name
    state
    type
    filter {
      dateRange {
        from
        to
      }
      inLast
      creationDateRange {
        from
        to
      }
      createdInLast
      types
      fileTypes
      formats
      fileExtensions
      fileSizeRange {
        from
        to
      }
      similarContents {
        id
      }
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
      users {
        id
      }
      observations {
        type
        observable {
          id
        }
        states
      }
      or {
        feeds {
          id
        }
        workflows {
          id
        }
        collections {
          id
        }
        users {
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
      and {
        feeds {
          id
        }
        workflows {
          id
        }
        collections {
          id
        }
        users {
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
      hasObservations
      hasFeeds
      hasCollections
      hasWorkflows
      collectionMode
      observationMode
    }
    augmentedFilter {
      dateRange {
        from
        to
      }
      inLast
      creationDateRange {
        from
        to
      }
      createdInLast
      types
      fileTypes
      formats
      fileExtensions
      fileSizeRange {
        from
        to
      }
      similarContents {
        id
      }
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
      users {
        id
      }
      observations {
        type
        observable {
          id
        }
        states
      }
      or {
        feeds {
          id
        }
        workflows {
          id
        }
        collections {
          id
        }
        users {
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
      and {
        feeds {
          id
        }
        workflows {
          id
        }
        collections {
          id
        }
        users {
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
      hasObservations
      hasFeeds
      hasCollections
      hasWorkflows
      collectionMode
      observationMode
    }
  }
}
    `;
export const DeleteAllViews = gql`
    mutation DeleteAllViews($filter: ViewFilter, $isSynchronous: Boolean, $correlationId: String) {
  deleteAllViews(
    filter: $filter
    isSynchronous: $isSynchronous
    correlationId: $correlationId
  ) {
    id
    state
  }
}
    `;
export const DeleteView = gql`
    mutation DeleteView($id: ID!) {
  deleteView(id: $id) {
    id
    state
  }
}
    `;
export const DeleteViews = gql`
    mutation DeleteViews($ids: [ID!]!, $isSynchronous: Boolean) {
  deleteViews(ids: $ids, isSynchronous: $isSynchronous) {
    id
    state
  }
}
    `;
export const GetView = gql`
    query GetView($id: ID!, $correlationId: String) {
  view(id: $id, correlationId: $correlationId) {
    id
    name
    creationDate
    modifiedDate
    owner {
      id
    }
    state
    type
    filter {
      dateRange {
        from
        to
      }
      inLast
      creationDateRange {
        from
        to
      }
      createdInLast
      types
      fileTypes
      formats
      fileExtensions
      fileSizeRange {
        from
        to
      }
      similarContents {
        id
      }
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
      users {
        id
      }
      observations {
        type
        observable {
          id
        }
        states
      }
      or {
        feeds {
          id
        }
        workflows {
          id
        }
        collections {
          id
        }
        users {
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
      and {
        feeds {
          id
        }
        workflows {
          id
        }
        collections {
          id
        }
        users {
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
      hasObservations
      hasFeeds
      hasCollections
      hasWorkflows
      collectionMode
      observationMode
    }
    augmentedFilter {
      dateRange {
        from
        to
      }
      inLast
      creationDateRange {
        from
        to
      }
      createdInLast
      types
      fileTypes
      formats
      fileExtensions
      fileSizeRange {
        from
        to
      }
      similarContents {
        id
      }
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
      users {
        id
      }
      observations {
        type
        observable {
          id
        }
        states
      }
      or {
        feeds {
          id
        }
        workflows {
          id
        }
        collections {
          id
        }
        users {
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
      and {
        feeds {
          id
        }
        workflows {
          id
        }
        collections {
          id
        }
        users {
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
      hasObservations
      hasFeeds
      hasCollections
      hasWorkflows
      collectionMode
      observationMode
    }
  }
}
    `;
export const QueryViews = gql`
    query QueryViews($filter: ViewFilter, $correlationId: String) {
  views(filter: $filter, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      type
      filter {
        dateRange {
          from
          to
        }
        inLast
        creationDateRange {
          from
          to
        }
        createdInLast
        types
        fileTypes
        formats
        fileExtensions
        fileSizeRange {
          from
          to
        }
        similarContents {
          id
        }
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
        users {
          id
        }
        observations {
          type
          observable {
            id
          }
          states
        }
        or {
          feeds {
            id
          }
          workflows {
            id
          }
          collections {
            id
          }
          users {
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
        and {
          feeds {
            id
          }
          workflows {
            id
          }
          collections {
            id
          }
          users {
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
        hasObservations
        hasFeeds
        hasCollections
        hasWorkflows
        collectionMode
        observationMode
      }
      augmentedFilter {
        dateRange {
          from
          to
        }
        inLast
        creationDateRange {
          from
          to
        }
        createdInLast
        types
        fileTypes
        formats
        fileExtensions
        fileSizeRange {
          from
          to
        }
        similarContents {
          id
        }
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
        users {
          id
        }
        observations {
          type
          observable {
            id
          }
          states
        }
        or {
          feeds {
            id
          }
          workflows {
            id
          }
          collections {
            id
          }
          users {
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
        and {
          feeds {
            id
          }
          workflows {
            id
          }
          collections {
            id
          }
          users {
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
        hasObservations
        hasFeeds
        hasCollections
        hasWorkflows
        collectionMode
        observationMode
      }
    }
  }
}
    `;
export const UpdateView = gql`
    mutation UpdateView($view: ViewUpdateInput!) {
  updateView(view: $view) {
    id
    name
    state
    type
    filter {
      dateRange {
        from
        to
      }
      inLast
      creationDateRange {
        from
        to
      }
      createdInLast
      types
      fileTypes
      formats
      fileExtensions
      fileSizeRange {
        from
        to
      }
      similarContents {
        id
      }
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
      users {
        id
      }
      observations {
        type
        observable {
          id
        }
        states
      }
      or {
        feeds {
          id
        }
        workflows {
          id
        }
        collections {
          id
        }
        users {
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
      and {
        feeds {
          id
        }
        workflows {
          id
        }
        collections {
          id
        }
        users {
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
      hasObservations
      hasFeeds
      hasCollections
      hasWorkflows
      collectionMode
      observationMode
    }
    augmentedFilter {
      dateRange {
        from
        to
      }
      inLast
      creationDateRange {
        from
        to
      }
      createdInLast
      types
      fileTypes
      formats
      fileExtensions
      fileSizeRange {
        from
        to
      }
      similarContents {
        id
      }
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
      users {
        id
      }
      observations {
        type
        observable {
          id
        }
        states
      }
      or {
        feeds {
          id
        }
        workflows {
          id
        }
        collections {
          id
        }
        users {
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
      and {
        feeds {
          id
        }
        workflows {
          id
        }
        collections {
          id
        }
        users {
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
      hasObservations
      hasFeeds
      hasCollections
      hasWorkflows
      collectionMode
      observationMode
    }
  }
}
    `;
export const UpsertView = gql`
    mutation UpsertView($view: ViewInput!) {
  upsertView(view: $view) {
    id
    name
    state
    type
    filter {
      dateRange {
        from
        to
      }
      inLast
      creationDateRange {
        from
        to
      }
      createdInLast
      types
      fileTypes
      formats
      fileExtensions
      fileSizeRange {
        from
        to
      }
      similarContents {
        id
      }
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
      users {
        id
      }
      observations {
        type
        observable {
          id
        }
        states
      }
      or {
        feeds {
          id
        }
        workflows {
          id
        }
        collections {
          id
        }
        users {
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
      and {
        feeds {
          id
        }
        workflows {
          id
        }
        collections {
          id
        }
        users {
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
      hasObservations
      hasFeeds
      hasCollections
      hasWorkflows
      collectionMode
      observationMode
    }
    augmentedFilter {
      dateRange {
        from
        to
      }
      inLast
      creationDateRange {
        from
        to
      }
      createdInLast
      types
      fileTypes
      formats
      fileExtensions
      fileSizeRange {
        from
        to
      }
      similarContents {
        id
      }
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
      users {
        id
      }
      observations {
        type
        observable {
          id
        }
        states
      }
      or {
        feeds {
          id
        }
        workflows {
          id
        }
        collections {
          id
        }
        users {
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
      and {
        feeds {
          id
        }
        workflows {
          id
        }
        collections {
          id
        }
        users {
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
      hasObservations
      hasFeeds
      hasCollections
      hasWorkflows
      collectionMode
      observationMode
    }
  }
}
    `;
export const ViewExists = gql`
    query ViewExists($filter: ViewFilter, $correlationId: String) {
  viewExists(filter: $filter, correlationId: $correlationId) {
    result
  }
}
    `;
export const CountWorkflows = gql`
    query CountWorkflows($filter: WorkflowFilter, $correlationId: String) {
  countWorkflows(filter: $filter, correlationId: $correlationId) {
    count
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
        formats
        fileExtensions
        allowedPaths
        excludedPaths
      }
      collections {
        id
      }
      observations {
        type
        observable {
          id
          name
        }
      }
      enableEmailCollections
      enableFolderCollections
      enableMessageCollections
    }
    indexing {
      jobs {
        connector {
          type
          contentType
          fileType
        }
      }
    }
    preparation {
      enableUnblockedCapture
      disableSmartCapture
      summarizations {
        type
        specification {
          id
        }
        tokens
        items
        prompt
      }
      jobs {
        connector {
          type
          fileTypes
          azureDocument {
            version
            model
            endpoint
            key
          }
          deepgram {
            model
            key
            enableRedaction
            enableSpeakerDiarization
            detectLanguage
            language
          }
          assemblyAI {
            model
            key
            enableRedaction
            enableSpeakerDiarization
            detectLanguage
            language
          }
          elevenLabsScribe {
            model
            key
            enableSpeakerDiarization
            detectLanguage
            language
            tagAudioEvents
          }
          page {
            enableScreenshot
          }
          document {
            includeImages
          }
          email {
            includeAttachments
          }
          modelDocument {
            specification {
              id
            }
          }
          reducto {
            ocrMode
            ocrSystem
            extractionMode
            enableEnrichment
            enrichmentMode
            key
          }
          mistral {
            key
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
          extractedCount
          azureText {
            confidenceThreshold
            enablePII
          }
          azureImage {
            confidenceThreshold
          }
          modelImage {
            specification {
              id
            }
          }
          modelText {
            specification {
              id
            }
            tokenThreshold
            timeBudget
            entityBudget
            extractionType
          }
          hume {
            confidenceThreshold
          }
        }
      }
    }
    classification {
      jobs {
        connector {
          type
          contentType
          fileType
          model {
            specification {
              id
            }
            rules {
              then
              if
            }
          }
          regex {
            rules {
              then
              type
              path
              matches
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
        allowedPaths
        excludedPaths
        allowedLinks
        excludedLinks
        allowedFiles
        excludedFiles
        allowedContentTypes
        excludedContentTypes
        allowContentDomain
        maximumLinks
      }
      jobs {
        connector {
          type
          enrichedTypes
          fhir {
            endpoint
          }
          diffbot {
            key
          }
          parallel {
            processor
            isSynchronous
          }
        }
      }
      entityResolution {
        strategy
        threshold
        specification {
          id
        }
      }
    }
    storage {
      policy {
        type
        allowDuplicates
        embeddingTypes
        enableSnapshots
        snapshotCount
      }
      gate {
        type
        specification {
          id
        }
        rules {
          if
        }
        uri
        onReject
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
        email {
          from
          subject
          to
        }
        twitter {
          consumerKey
          consumerSecret
          accessTokenKey
          accessTokenSecret
        }
        mcp {
          token
          type
        }
      }
    }
  }
}
    `;
export const DeleteAllWorkflows = gql`
    mutation DeleteAllWorkflows($filter: WorkflowFilter, $isSynchronous: Boolean, $correlationId: String) {
  deleteAllWorkflows(
    filter: $filter
    isSynchronous: $isSynchronous
    correlationId: $correlationId
  ) {
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
    mutation DeleteWorkflows($ids: [ID!]!, $isSynchronous: Boolean) {
  deleteWorkflows(ids: $ids, isSynchronous: $isSynchronous) {
    id
    state
  }
}
    `;
export const GetWorkflow = gql`
    query GetWorkflow($id: ID!, $correlationId: String) {
  workflow(id: $id, correlationId: $correlationId) {
    id
    name
    creationDate
    modifiedDate
    owner {
      id
    }
    state
    ingestion {
      if {
        types
        fileTypes
        formats
        fileExtensions
        allowedPaths
        excludedPaths
      }
      collections {
        id
      }
      observations {
        type
        observable {
          id
          name
        }
      }
      enableEmailCollections
      enableFolderCollections
      enableMessageCollections
    }
    indexing {
      jobs {
        connector {
          type
          contentType
          fileType
        }
      }
    }
    preparation {
      enableUnblockedCapture
      disableSmartCapture
      summarizations {
        type
        specification {
          id
        }
        tokens
        items
        prompt
      }
      jobs {
        connector {
          type
          fileTypes
          azureDocument {
            version
            model
            endpoint
            key
          }
          deepgram {
            model
            key
            enableRedaction
            enableSpeakerDiarization
            detectLanguage
            language
          }
          assemblyAI {
            model
            key
            enableRedaction
            enableSpeakerDiarization
            detectLanguage
            language
          }
          elevenLabsScribe {
            model
            key
            enableSpeakerDiarization
            detectLanguage
            language
            tagAudioEvents
          }
          page {
            enableScreenshot
          }
          document {
            includeImages
          }
          email {
            includeAttachments
          }
          modelDocument {
            specification {
              id
            }
          }
          reducto {
            ocrMode
            ocrSystem
            extractionMode
            enableEnrichment
            enrichmentMode
            key
          }
          mistral {
            key
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
          extractedCount
          azureText {
            confidenceThreshold
            enablePII
          }
          azureImage {
            confidenceThreshold
          }
          modelImage {
            specification {
              id
            }
          }
          modelText {
            specification {
              id
            }
            tokenThreshold
            timeBudget
            entityBudget
            extractionType
          }
          hume {
            confidenceThreshold
          }
        }
      }
    }
    classification {
      jobs {
        connector {
          type
          contentType
          fileType
          model {
            specification {
              id
            }
            rules {
              then
              if
            }
          }
          regex {
            rules {
              then
              type
              path
              matches
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
        allowedPaths
        excludedPaths
        allowedLinks
        excludedLinks
        allowedFiles
        excludedFiles
        allowedContentTypes
        excludedContentTypes
        allowContentDomain
        maximumLinks
      }
      jobs {
        connector {
          type
          enrichedTypes
          fhir {
            endpoint
          }
          diffbot {
            key
          }
          parallel {
            processor
            isSynchronous
          }
        }
      }
      entityResolution {
        strategy
        threshold
        specification {
          id
        }
      }
    }
    storage {
      policy {
        type
        allowDuplicates
        embeddingTypes
        enableSnapshots
        snapshotCount
      }
      gate {
        type
        specification {
          id
        }
        rules {
          if
        }
        uri
        onReject
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
        email {
          from
          subject
          to
        }
        twitter {
          consumerKey
          consumerSecret
          accessTokenKey
          accessTokenSecret
        }
        mcp {
          token
          type
        }
      }
    }
  }
}
    `;
export const QueryWorkflows = gql`
    query QueryWorkflows($filter: WorkflowFilter, $correlationId: String) {
  workflows(filter: $filter, correlationId: $correlationId) {
    results {
      id
      name
      creationDate
      modifiedDate
      relevance
      owner {
        id
      }
      state
      ingestion {
        if {
          types
          fileTypes
          formats
          fileExtensions
          allowedPaths
          excludedPaths
        }
        collections {
          id
        }
        observations {
          type
          observable {
            id
            name
          }
        }
        enableEmailCollections
        enableFolderCollections
        enableMessageCollections
      }
      indexing {
        jobs {
          connector {
            type
            contentType
            fileType
          }
        }
      }
      preparation {
        enableUnblockedCapture
        disableSmartCapture
        summarizations {
          type
          specification {
            id
          }
          tokens
          items
          prompt
        }
        jobs {
          connector {
            type
            fileTypes
            azureDocument {
              version
              model
              endpoint
              key
            }
            deepgram {
              model
              key
              enableRedaction
              enableSpeakerDiarization
              detectLanguage
              language
            }
            assemblyAI {
              model
              key
              enableRedaction
              enableSpeakerDiarization
              detectLanguage
              language
            }
            elevenLabsScribe {
              model
              key
              enableSpeakerDiarization
              detectLanguage
              language
              tagAudioEvents
            }
            page {
              enableScreenshot
            }
            document {
              includeImages
            }
            email {
              includeAttachments
            }
            modelDocument {
              specification {
                id
              }
            }
            reducto {
              ocrMode
              ocrSystem
              extractionMode
              enableEnrichment
              enrichmentMode
              key
            }
            mistral {
              key
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
            extractedCount
            azureText {
              confidenceThreshold
              enablePII
            }
            azureImage {
              confidenceThreshold
            }
            modelImage {
              specification {
                id
              }
            }
            modelText {
              specification {
                id
              }
              tokenThreshold
              timeBudget
              entityBudget
              extractionType
            }
            hume {
              confidenceThreshold
            }
          }
        }
      }
      classification {
        jobs {
          connector {
            type
            contentType
            fileType
            model {
              specification {
                id
              }
              rules {
                then
                if
              }
            }
            regex {
              rules {
                then
                type
                path
                matches
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
          allowedPaths
          excludedPaths
          allowedLinks
          excludedLinks
          allowedFiles
          excludedFiles
          allowedContentTypes
          excludedContentTypes
          allowContentDomain
          maximumLinks
        }
        jobs {
          connector {
            type
            enrichedTypes
            fhir {
              endpoint
            }
            diffbot {
              key
            }
            parallel {
              processor
              isSynchronous
            }
          }
        }
        entityResolution {
          strategy
          threshold
          specification {
            id
          }
        }
      }
      storage {
        policy {
          type
          allowDuplicates
          embeddingTypes
          enableSnapshots
          snapshotCount
        }
        gate {
          type
          specification {
            id
          }
          rules {
            if
          }
          uri
          onReject
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
          email {
            from
            subject
            to
          }
          twitter {
            consumerKey
            consumerSecret
            accessTokenKey
            accessTokenSecret
          }
          mcp {
            token
            type
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
        formats
        fileExtensions
        allowedPaths
        excludedPaths
      }
      collections {
        id
      }
      observations {
        type
        observable {
          id
          name
        }
      }
      enableEmailCollections
      enableFolderCollections
      enableMessageCollections
    }
    indexing {
      jobs {
        connector {
          type
          contentType
          fileType
        }
      }
    }
    preparation {
      enableUnblockedCapture
      disableSmartCapture
      summarizations {
        type
        specification {
          id
        }
        tokens
        items
        prompt
      }
      jobs {
        connector {
          type
          fileTypes
          azureDocument {
            version
            model
            endpoint
            key
          }
          deepgram {
            model
            key
            enableRedaction
            enableSpeakerDiarization
            detectLanguage
            language
          }
          assemblyAI {
            model
            key
            enableRedaction
            enableSpeakerDiarization
            detectLanguage
            language
          }
          elevenLabsScribe {
            model
            key
            enableSpeakerDiarization
            detectLanguage
            language
            tagAudioEvents
          }
          page {
            enableScreenshot
          }
          document {
            includeImages
          }
          email {
            includeAttachments
          }
          modelDocument {
            specification {
              id
            }
          }
          reducto {
            ocrMode
            ocrSystem
            extractionMode
            enableEnrichment
            enrichmentMode
            key
          }
          mistral {
            key
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
          extractedCount
          azureText {
            confidenceThreshold
            enablePII
          }
          azureImage {
            confidenceThreshold
          }
          modelImage {
            specification {
              id
            }
          }
          modelText {
            specification {
              id
            }
            tokenThreshold
            timeBudget
            entityBudget
            extractionType
          }
          hume {
            confidenceThreshold
          }
        }
      }
    }
    classification {
      jobs {
        connector {
          type
          contentType
          fileType
          model {
            specification {
              id
            }
            rules {
              then
              if
            }
          }
          regex {
            rules {
              then
              type
              path
              matches
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
        allowedPaths
        excludedPaths
        allowedLinks
        excludedLinks
        allowedFiles
        excludedFiles
        allowedContentTypes
        excludedContentTypes
        allowContentDomain
        maximumLinks
      }
      jobs {
        connector {
          type
          enrichedTypes
          fhir {
            endpoint
          }
          diffbot {
            key
          }
          parallel {
            processor
            isSynchronous
          }
        }
      }
      entityResolution {
        strategy
        threshold
        specification {
          id
        }
      }
    }
    storage {
      policy {
        type
        allowDuplicates
        embeddingTypes
        enableSnapshots
        snapshotCount
      }
      gate {
        type
        specification {
          id
        }
        rules {
          if
        }
        uri
        onReject
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
        email {
          from
          subject
          to
        }
        twitter {
          consumerKey
          consumerSecret
          accessTokenKey
          accessTokenSecret
        }
        mcp {
          token
          type
        }
      }
    }
  }
}
    `;
export const UpsertWorkflow = gql`
    mutation UpsertWorkflow($workflow: WorkflowInput!) {
  upsertWorkflow(workflow: $workflow) {
    id
    name
    state
    ingestion {
      if {
        types
        fileTypes
        formats
        fileExtensions
        allowedPaths
        excludedPaths
      }
      collections {
        id
      }
      observations {
        type
        observable {
          id
          name
        }
      }
      enableEmailCollections
      enableFolderCollections
      enableMessageCollections
    }
    indexing {
      jobs {
        connector {
          type
          contentType
          fileType
        }
      }
    }
    preparation {
      enableUnblockedCapture
      disableSmartCapture
      summarizations {
        type
        specification {
          id
        }
        tokens
        items
        prompt
      }
      jobs {
        connector {
          type
          fileTypes
          azureDocument {
            version
            model
            endpoint
            key
          }
          deepgram {
            model
            key
            enableRedaction
            enableSpeakerDiarization
            detectLanguage
            language
          }
          assemblyAI {
            model
            key
            enableRedaction
            enableSpeakerDiarization
            detectLanguage
            language
          }
          elevenLabsScribe {
            model
            key
            enableSpeakerDiarization
            detectLanguage
            language
            tagAudioEvents
          }
          page {
            enableScreenshot
          }
          document {
            includeImages
          }
          email {
            includeAttachments
          }
          modelDocument {
            specification {
              id
            }
          }
          reducto {
            ocrMode
            ocrSystem
            extractionMode
            enableEnrichment
            enrichmentMode
            key
          }
          mistral {
            key
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
          extractedCount
          azureText {
            confidenceThreshold
            enablePII
          }
          azureImage {
            confidenceThreshold
          }
          modelImage {
            specification {
              id
            }
          }
          modelText {
            specification {
              id
            }
            tokenThreshold
            timeBudget
            entityBudget
            extractionType
          }
          hume {
            confidenceThreshold
          }
        }
      }
    }
    classification {
      jobs {
        connector {
          type
          contentType
          fileType
          model {
            specification {
              id
            }
            rules {
              then
              if
            }
          }
          regex {
            rules {
              then
              type
              path
              matches
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
        allowedPaths
        excludedPaths
        allowedLinks
        excludedLinks
        allowedFiles
        excludedFiles
        allowedContentTypes
        excludedContentTypes
        allowContentDomain
        maximumLinks
      }
      jobs {
        connector {
          type
          enrichedTypes
          fhir {
            endpoint
          }
          diffbot {
            key
          }
          parallel {
            processor
            isSynchronous
          }
        }
      }
      entityResolution {
        strategy
        threshold
        specification {
          id
        }
      }
    }
    storage {
      policy {
        type
        allowDuplicates
        embeddingTypes
        enableSnapshots
        snapshotCount
      }
      gate {
        type
        specification {
          id
        }
        rules {
          if
        }
        uri
        onReject
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
        email {
          from
          subject
          to
        }
        twitter {
          consumerKey
          consumerSecret
          accessTokenKey
          accessTokenSecret
        }
        mcp {
          token
          type
        }
      }
    }
  }
}
    `;
export const WorkflowExists = gql`
    query WorkflowExists($filter: WorkflowFilter, $correlationId: String) {
  workflowExists(filter: $filter, correlationId: $correlationId) {
    result
  }
}
    `;
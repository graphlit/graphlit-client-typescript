import gql from 'graphql-tag';

export const CountAlerts = gql`
    query CountAlerts($filter: AlertFilter) {
  countAlerts(filter: $filter) {
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
    query GetAlert($id: ID!) {
  alert(id: $id) {
    id
    name
    creationDate
    relevance
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
        observations {
          type
          observable {
            id
          }
          states
        }
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
      relevance
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
          observations {
            type
            observable {
              id
            }
            states
          }
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
export const CountCategories = gql`
    query CountCategories($filter: CategoryFilter) {
  countCategories(filter: $filter) {
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
    query GetCategory($id: ID!) {
  category(id: $id) {
    id
    name
    description
    creationDate
    relevance
  }
}
    `;
export const QueryCategories = gql`
    query QueryCategories($filter: CategoryFilter) {
  categories(filter: $filter) {
    results {
      id
      name
      description
      creationDate
      relevance
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
export const CountCollections = gql`
    query CountCollections($filter: CollectionFilter) {
  countCollections(filter: $filter) {
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
    query GetCollection($id: ID!) {
  collection(id: $id) {
    id
    name
    creationDate
    relevance
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
      relevance
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
export const CountContents = gql`
    query CountContents($filter: ContentFilter) {
  countContents(filter: $filter) {
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
        masterUri
        imageUri
        textUri
        audioUri
        transcriptUri
        summary
        customSummary
        keywords
        bullets
        headlines
        posts
        chapters
        questions
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
    completionTime
    timestamp
    modelService
    model
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
        masterUri
        imageUri
        textUri
        audioUri
        transcriptUri
        summary
        customSummary
        keywords
        bullets
        headlines
        posts
        chapters
        questions
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
    completionTime
    timestamp
    modelService
    model
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
    query GetContent($id: ID!) {
  content(id: $id) {
    id
    name
    creationDate
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
    markdown
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
    summary
    customSummary
    keywords
    bullets
    headlines
    posts
    chapters
    questions
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
      subject
      labels
      sensitivity
      priority
      importance
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
    package {
      fileCount
      folderCount
      isEncrypted
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
        boundingBox {
          left
          top
          width
          height
        }
      }
      state
    }
    workflow {
      id
      name
    }
    pages {
      index
      relevance
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
    error
  }
}
    `;
export const IngestBatch = gql`
    mutation IngestBatch($uris: [URL!]!, $workflow: EntityReferenceInput, $collections: [EntityReferenceInput!], $correlationId: String) {
  ingestBatch(
    uris: $uris
    workflow: $workflow
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
    collections {
      id
      name
    }
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
    collections {
      id
      name
    }
  }
}
    `;
export const IngestText = gql`
    mutation IngestText($name: String!, $text: String!, $textType: TextTypes, $uri: URL, $id: ID, $isSynchronous: Boolean, $workflow: EntityReferenceInput, $collections: [EntityReferenceInput!], $correlationId: String) {
  ingestText(
    name: $name
    text: $text
    textType: $textType
    uri: $uri
    id: $id
    isSynchronous: $isSynchronous
    workflow: $workflow
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
    collections {
      id
      name
    }
  }
}
    `;
export const IngestTextBatch = gql`
    mutation IngestTextBatch($batch: [TextContentInput!]!, $textType: TextTypes, $workflow: EntityReferenceInput, $collections: [EntityReferenceInput!], $correlationId: String) {
  ingestTextBatch(
    batch: $batch
    workflow: $workflow
    textType: $textType
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
    collections {
      id
      name
    }
  }
}
    `;
export const IngestUri = gql`
    mutation IngestUri($name: String, $uri: URL!, $id: ID, $isSynchronous: Boolean, $workflow: EntityReferenceInput, $collections: [EntityReferenceInput!], $correlationId: String) {
  ingestUri(
    name: $name
    uri: $uri
    id: $id
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
    collections {
      id
      name
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
export const PublishContents = gql`
    mutation PublishContents($summaryPrompt: String, $publishPrompt: String!, $connector: ContentPublishingConnectorInput!, $filter: ContentFilter, $isSynchronous: Boolean, $correlationId: String, $name: String, $summarySpecification: EntityReferenceInput, $publishSpecification: EntityReferenceInput, $workflow: EntityReferenceInput) {
  publishContents(
    summaryPrompt: $summaryPrompt
    publishPrompt: $publishPrompt
    connector: $connector
    filter: $filter
    isSynchronous: $isSynchronous
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
    collections {
      id
      name
    }
    textUri
    audioUri
    markdown
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
    id
    name
    state
    type
    fileType
    mimeType
    uri
    collections {
      id
      name
    }
    textUri
    audioUri
    markdown
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
      markdown
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
      summary
      customSummary
      keywords
      bullets
      headlines
      posts
      chapters
      questions
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
        subject
        labels
        sensitivity
        priority
        importance
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
      package {
        fileCount
        folderCount
        isEncrypted
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
          boundingBox {
            left
            top
            width
            height
          }
        }
        state
      }
      workflow {
        id
        name
      }
      pages {
        index
        relevance
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
      error
    }
  }
}
    `;
export const QueryContentsFacets = gql`
    query QueryContentsFacets($filter: ContentFilter, $facets: [ContentFacetInput!]) {
  contents(filter: $filter, facets: $facets) {
    results {
      id
      name
      creationDate
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
      markdown
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
      summary
      customSummary
      keywords
      bullets
      headlines
      posts
      chapters
      questions
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
        subject
        labels
        sensitivity
        priority
        importance
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
      package {
        fileCount
        folderCount
        isEncrypted
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
          boundingBox {
            left
            top
            width
            height
          }
        }
        state
      }
      workflow {
        id
        name
      }
      pages {
        index
        relevance
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
      error
    }
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
    query QueryContentsGraph($filter: ContentFilter, $graph: ContentGraphInput) {
  contents(filter: $filter, graph: $graph) {
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
    collections {
      id
      name
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
    collections {
      id
      name
    }
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
    mutation CompleteConversation($completion: String!, $id: ID!, $correlationId: String) {
  completeConversation(
    completion: $completion
    id: $id
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
          masterUri
          imageUri
          textUri
          audioUri
          transcriptUri
          summary
          customSummary
          keywords
          bullets
          headlines
          posts
          chapters
          questions
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
          masterUri
          imageUri
          textUri
          audioUri
          transcriptUri
          summary
          customSummary
          keywords
          bullets
          headlines
          posts
          chapters
          questions
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
export const CountConversations = gql`
    query CountConversations($filter: ConversationFilter) {
  countConversations(filter: $filter) {
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
    mutation FormatConversation($prompt: String!, $id: ID, $specification: EntityReferenceInput, $correlationId: String) {
  formatConversation(
    prompt: $prompt
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
          masterUri
          imageUri
          textUri
          audioUri
          transcriptUri
          summary
          customSummary
          keywords
          bullets
          headlines
          posts
          chapters
          questions
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
export const GetConversation = gql`
    query GetConversation($id: ID!) {
  conversation(id: $id) {
    id
    name
    creationDate
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
          masterUri
          imageUri
          textUri
          audioUri
          transcriptUri
          summary
          customSummary
          keywords
          bullets
          headlines
          posts
          chapters
          questions
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
        observations {
          type
          observable {
            id
          }
          states
        }
      }
    }
    augmentedFilter {
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
export const Prompt = gql`
    mutation Prompt($prompt: String!, $specification: EntityReferenceInput, $messages: [ConversationMessageInput!], $correlationId: String) {
  prompt(
    prompt: $prompt
    specification: $specification
    messages: $messages
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
          masterUri
          imageUri
          textUri
          audioUri
          transcriptUri
          summary
          customSummary
          keywords
          bullets
          headlines
          posts
          chapters
          questions
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
      completionTime
      timestamp
      modelService
      model
    }
    error
  }
}
    `;
export const PromptConversation = gql`
    mutation PromptConversation($prompt: String!, $id: ID, $specification: EntityReferenceInput, $tools: [ToolDefinitionInput!], $requireTool: Boolean, $correlationId: String) {
  promptConversation(
    prompt: $prompt
    id: $id
    specification: $specification
    tools: $tools
    requireTool: $requireTool
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
          masterUri
          imageUri
          textUri
          audioUri
          transcriptUri
          summary
          customSummary
          keywords
          bullets
          headlines
          posts
          chapters
          questions
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
    id
    name
    state
    type
    fileType
    mimeType
    uri
    collections {
      id
      name
    }
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
            masterUri
            imageUri
            textUri
            audioUri
            transcriptUri
            summary
            customSummary
            keywords
            bullets
            headlines
            posts
            chapters
            questions
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
          observations {
            type
            observable {
              id
            }
            states
          }
        }
      }
      augmentedFilter {
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
          masterUri
          imageUri
          textUri
          audioUri
          transcriptUri
          summary
          customSummary
          keywords
          bullets
          headlines
          posts
          chapters
          questions
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
      completionTime
      timestamp
      modelService
      model
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
          masterUri
          imageUri
          textUri
          audioUri
          transcriptUri
          summary
          customSummary
          keywords
          bullets
          headlines
          posts
          chapters
          questions
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
      completionTime
      timestamp
      modelService
      model
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
          masterUri
          imageUri
          textUri
          audioUri
          transcriptUri
          summary
          customSummary
          keywords
          bullets
          headlines
          posts
          chapters
          questions
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
      completionTime
      timestamp
      modelService
      model
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
          masterUri
          imageUri
          textUri
          audioUri
          transcriptUri
          summary
          customSummary
          keywords
          bullets
          headlines
          posts
          chapters
          questions
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
      completionTime
      timestamp
      modelService
      model
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
export const CountEvents = gql`
    query CountEvents($filter: EventFilter) {
  countEvents(filter: $filter) {
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
    query GetEvent($id: ID!) {
  event(id: $id) {
    id
    name
    alternateNames
    creationDate
    thing
    relevance
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
    query QueryEvents($filter: EventFilter) {
  events(filter: $filter) {
    results {
      id
      name
      alternateNames
      creationDate
      thing
      relevance
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
export const CountFeeds = gql`
    query CountFeeds($filter: FeedFilter) {
  countFeeds(filter: $filter) {
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
export const GetFeed = gql`
    query GetFeed($id: ID!) {
  feed(id: $id) {
    id
    name
    creationDate
    relevance
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
        folderId
        tenantId
        clientId
        clientSecret
        refreshToken
      }
      oneDrive {
        folderId
        clientId
        clientSecret
        refreshToken
      }
      googleDrive {
        folderId
        refreshToken
        clientId
        clientSecret
      }
      github {
        uri
        repositoryOwner
        repositoryName
        refreshToken
        personalAccessToken
      }
      readLimit
    }
    email {
      type
      includeAttachments
      google {
        type
        refreshToken
        clientId
        clientSecret
      }
      microsoft {
        type
        refreshToken
        clientId
        clientSecret
      }
      readLimit
    }
    issue {
      type
      includeAttachments
      jira {
        uri
        project
        email
        token
        offset
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
      readLimit
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
    microsoftTeams {
      readLimit
      type
      clientId
      clientSecret
      refreshToken
      teamId
      channelId
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
export const QueryFeeds = gql`
    query QueryFeeds($filter: FeedFilter) {
  feeds(filter: $filter) {
    results {
      id
      name
      creationDate
      relevance
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
          folderId
          tenantId
          clientId
          clientSecret
          refreshToken
        }
        oneDrive {
          folderId
          clientId
          clientSecret
          refreshToken
        }
        googleDrive {
          folderId
          refreshToken
          clientId
          clientSecret
        }
        github {
          uri
          repositoryOwner
          repositoryName
          refreshToken
          personalAccessToken
        }
        readLimit
      }
      email {
        type
        includeAttachments
        google {
          type
          refreshToken
          clientId
          clientSecret
        }
        microsoft {
          type
          refreshToken
          clientId
          clientSecret
        }
        readLimit
      }
      issue {
        type
        includeAttachments
        jira {
          uri
          project
          email
          token
          offset
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
        readLimit
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
      microsoftTeams {
        readLimit
        type
        clientId
        clientSecret
        refreshToken
        teamId
        channelId
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
export const QueryOneDriveFolders = gql`
    query QueryOneDriveFolders($properties: OneDriveFoldersInput!, $folderId: ID) {
  oneDriveFolders(properties: $properties, folderId: $folderId) {
    results {
      folderName
      folderId
    }
  }
}
    `;
export const QuerySharePointFolders = gql`
    query QuerySharePointFolders($properties: SharePointFoldersInput!, $driveId: ID!, $folderId: ID) {
  sharePointFolders(
    properties: $properties
    driveId: $driveId
    folderId: $folderId
  ) {
    accountName
    results {
      folderName
      folderId
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
export const CountLabels = gql`
    query CountLabels($filter: LabelFilter) {
  countLabels(filter: $filter) {
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
    query GetLabel($id: ID!) {
  label(id: $id) {
    id
    name
    description
    creationDate
    relevance
  }
}
    `;
export const QueryLabels = gql`
    query QueryLabels($filter: LabelFilter) {
  labels(filter: $filter) {
    results {
      id
      name
      description
      creationDate
      relevance
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
export const CountMedicalConditions = gql`
    query CountMedicalConditions($filter: MedicalConditionFilter) {
  countMedicalConditions(filter: $filter) {
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
    query GetMedicalCondition($id: ID!) {
  medicalCondition(id: $id) {
    id
    name
    alternateNames
    creationDate
    thing
    relevance
  }
}
    `;
export const QueryMedicalConditions = gql`
    query QueryMedicalConditions($filter: MedicalConditionFilter) {
  medicalConditions(filter: $filter) {
    results {
      id
      name
      alternateNames
      creationDate
      thing
      relevance
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
    query CountMedicalContraindications($filter: MedicalContraindicationFilter) {
  countMedicalContraindications(filter: $filter) {
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
    query GetMedicalContraindication($id: ID!) {
  medicalContraindication(id: $id) {
    id
    name
    alternateNames
    creationDate
    thing
    relevance
  }
}
    `;
export const QueryMedicalContraindications = gql`
    query QueryMedicalContraindications($filter: MedicalContraindicationFilter) {
  medicalContraindications(filter: $filter) {
    results {
      id
      name
      alternateNames
      creationDate
      thing
      relevance
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
    query CountMedicalDevices($filter: MedicalDeviceFilter) {
  countMedicalDevices(filter: $filter) {
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
    query GetMedicalDevice($id: ID!) {
  medicalDevice(id: $id) {
    id
    name
    alternateNames
    creationDate
    thing
    relevance
  }
}
    `;
export const QueryMedicalDevices = gql`
    query QueryMedicalDevices($filter: MedicalDeviceFilter) {
  medicalDevices(filter: $filter) {
    results {
      id
      name
      alternateNames
      creationDate
      thing
      relevance
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
    query CountMedicalDrugs($filter: MedicalDrugFilter) {
  countMedicalDrugs(filter: $filter) {
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
    query GetMedicalDrug($id: ID!) {
  medicalDrug(id: $id) {
    id
    name
    alternateNames
    creationDate
    thing
    relevance
  }
}
    `;
export const QueryMedicalDrugs = gql`
    query QueryMedicalDrugs($filter: MedicalDrugFilter) {
  medicalDrugs(filter: $filter) {
    results {
      id
      name
      alternateNames
      creationDate
      thing
      relevance
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
    query CountMedicalDrugClasses($filter: MedicalDrugClassFilter) {
  countMedicalDrugClasses(filter: $filter) {
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
    query GetMedicalDrugClass($id: ID!) {
  medicalDrugClass(id: $id) {
    id
    name
    alternateNames
    creationDate
    thing
    relevance
  }
}
    `;
export const QueryMedicalDrugClasses = gql`
    query QueryMedicalDrugClasses($filter: MedicalDrugClassFilter) {
  medicalDrugClasses(filter: $filter) {
    results {
      id
      name
      alternateNames
      creationDate
      thing
      relevance
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
    query CountMedicalGuidelines($filter: MedicalGuidelineFilter) {
  countMedicalGuidelines(filter: $filter) {
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
    query GetMedicalGuideline($id: ID!) {
  medicalGuideline(id: $id) {
    id
    name
    alternateNames
    creationDate
    thing
    relevance
  }
}
    `;
export const QueryMedicalGuidelines = gql`
    query QueryMedicalGuidelines($filter: MedicalGuidelineFilter) {
  medicalGuidelines(filter: $filter) {
    results {
      id
      name
      alternateNames
      creationDate
      thing
      relevance
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
    query CountMedicalIndications($filter: MedicalIndicationFilter) {
  countMedicalIndications(filter: $filter) {
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
    query GetMedicalIndication($id: ID!) {
  medicalIndication(id: $id) {
    id
    name
    alternateNames
    creationDate
    thing
    relevance
  }
}
    `;
export const QueryMedicalIndications = gql`
    query QueryMedicalIndications($filter: MedicalIndicationFilter) {
  medicalIndications(filter: $filter) {
    results {
      id
      name
      alternateNames
      creationDate
      thing
      relevance
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
    query CountMedicalProcedures($filter: MedicalProcedureFilter) {
  countMedicalProcedures(filter: $filter) {
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
    query GetMedicalProcedure($id: ID!) {
  medicalProcedure(id: $id) {
    id
    name
    alternateNames
    creationDate
    thing
    relevance
  }
}
    `;
export const QueryMedicalProcedures = gql`
    query QueryMedicalProcedures($filter: MedicalProcedureFilter) {
  medicalProcedures(filter: $filter) {
    results {
      id
      name
      alternateNames
      creationDate
      thing
      relevance
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
    query CountMedicalStudies($filter: MedicalStudyFilter) {
  countMedicalStudies(filter: $filter) {
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
    query GetMedicalStudy($id: ID!) {
  medicalStudy(id: $id) {
    id
    name
    alternateNames
    creationDate
    thing
    relevance
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
    query QueryMedicalStudies($filter: MedicalStudyFilter) {
  medicalStudies(filter: $filter) {
    results {
      id
      name
      alternateNames
      creationDate
      thing
      relevance
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
export const UpdateMedicalStudy = gql`
    mutation UpdateMedicalStudy($medicalStudy: MedicalStudyUpdateInput!) {
  updateMedicalStudy(medicalStudy: $medicalStudy) {
    id
    name
  }
}
    `;
export const CountMedicalTests = gql`
    query CountMedicalTests($filter: MedicalTestFilter) {
  countMedicalTests(filter: $filter) {
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
    query GetMedicalTest($id: ID!) {
  medicalTest(id: $id) {
    id
    name
    alternateNames
    creationDate
    thing
    relevance
  }
}
    `;
export const QueryMedicalTests = gql`
    query QueryMedicalTests($filter: MedicalTestFilter) {
  medicalTests(filter: $filter) {
    results {
      id
      name
      alternateNames
      creationDate
      thing
      relevance
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
    query CountMedicalTherapies($filter: MedicalTherapyFilter) {
  countMedicalTherapies(filter: $filter) {
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
    query GetMedicalTherapy($id: ID!) {
  medicalTherapy(id: $id) {
    id
    name
    alternateNames
    creationDate
    thing
    relevance
  }
}
    `;
export const QueryMedicalTherapies = gql`
    query QueryMedicalTherapies($filter: MedicalTherapyFilter) {
  medicalTherapies(filter: $filter) {
    results {
      id
      name
      alternateNames
      creationDate
      thing
      relevance
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
export const CountOrganizations = gql`
    query CountOrganizations($filter: OrganizationFilter) {
  countOrganizations(filter: $filter) {
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
export const GetOrganization = gql`
    query GetOrganization($id: ID!) {
  organization(id: $id) {
    id
    name
    alternateNames
    creationDate
    thing
    relevance
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
    query QueryOrganizations($filter: OrganizationFilter) {
  organizations(filter: $filter) {
    results {
      id
      name
      alternateNames
      creationDate
      thing
      relevance
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
export const CountPersons = gql`
    query CountPersons($filter: PersonFilter) {
  countPersons(filter: $filter) {
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
export const GetPerson = gql`
    query GetPerson($id: ID!) {
  person(id: $id) {
    id
    name
    alternateNames
    creationDate
    thing
    relevance
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
    query QueryPersons($filter: PersonFilter) {
  persons(filter: $filter) {
    results {
      id
      name
      alternateNames
      creationDate
      thing
      relevance
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
export const CountPlaces = gql`
    query CountPlaces($filter: PlaceFilter) {
  countPlaces(filter: $filter) {
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
export const GetPlace = gql`
    query GetPlace($id: ID!) {
  place(id: $id) {
    id
    name
    alternateNames
    creationDate
    thing
    relevance
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
    query QueryPlaces($filter: PlaceFilter) {
  places(filter: $filter) {
    results {
      id
      name
      alternateNames
      creationDate
      thing
      relevance
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
export const CountProducts = gql`
    query CountProducts($filter: ProductFilter) {
  countProducts(filter: $filter) {
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
export const GetProduct = gql`
    query GetProduct($id: ID!) {
  product(id: $id) {
    id
    name
    alternateNames
    creationDate
    thing
    relevance
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
    query QueryProducts($filter: ProductFilter) {
  products(filter: $filter) {
    results {
      id
      name
      alternateNames
      creationDate
      thing
      relevance
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
    query LookupCredits($correlationId: String!) {
  lookupCredits(correlationId: $correlationId) {
    correlationId
    ownerId
    credits
    storageRatio
    computeRatio
    embeddingRatio
    completionRatio
    ingestionRatio
    indexingRatio
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
    prompt
    promptTokens
    completion
    completionTokens
    tokens
    count
    operation
    operationType
    request
    variables
    response
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
    ingestionRatio
    indexingRatio
    preparationRatio
    extractionRatio
    enrichmentRatio
    publishingRatio
    searchRatio
    conversationRatio
  }
}
    `;
export const QueryUsage = gql`
    query QueryUsage($startDate: DateTime!, $duration: TimeSpan!, $names: [String!], $offset: Int, $limit: Int) {
  usage(
    startDate: $startDate
    duration: $duration
    names: $names
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
    prompt
    promptTokens
    completion
    completionTokens
    tokens
    count
    operation
    operationType
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
export const CountRepos = gql`
    query CountRepos($filter: RepoFilter) {
  countRepos(filter: $filter) {
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
    query GetRepo($id: ID!) {
  repo(id: $id) {
    id
    name
    alternateNames
    creationDate
    thing
    relevance
  }
}
    `;
export const QueryRepos = gql`
    query QueryRepos($filter: RepoFilter) {
  repos(filter: $filter) {
    results {
      id
      name
      alternateNames
      creationDate
      thing
      relevance
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
    query CountSoftwares($filter: SoftwareFilter) {
  countSoftwares(filter: $filter) {
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
    query GetSoftware($id: ID!) {
  software(id: $id) {
    id
    name
    alternateNames
    creationDate
    thing
    relevance
    releaseDate
    developer
  }
}
    `;
export const QuerySoftwares = gql`
    query QuerySoftwares($filter: SoftwareFilter) {
  softwares(filter: $filter) {
    results {
      id
      name
      alternateNames
      creationDate
      thing
      relevance
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
export const CountSpecifications = gql`
    query CountSpecifications($filter: SpecificationFilter) {
  countSpecifications(filter: $filter) {
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
    query GetSpecification($id: ID!) {
  specification(id: $id) {
    id
    name
    creationDate
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
      modelName
      temperature
      probability
      chunkTokenLimit
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
          masterUri
          imageUri
          textUri
          audioUri
          transcriptUri
          summary
          customSummary
          keywords
          bullets
          headlines
          posts
          chapters
          questions
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
        modelName
        temperature
        probability
        chunkTokenLimit
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
export const CountWorkflows = gql`
    query CountWorkflows($filter: WorkflowFilter) {
  countWorkflows(filter: $filter) {
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
        allowedPaths
        excludedPaths
      }
      collections {
        id
      }
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
    query GetWorkflow($id: ID!) {
  workflow(id: $id) {
    id
    name
    creationDate
    relevance
    owner {
      id
    }
    state
    ingestion {
      if {
        types
        fileTypes
        allowedPaths
        excludedPaths
      }
      collections {
        id
      }
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
      relevance
      owner {
        id
      }
      state
      ingestion {
        if {
          types
          fileTypes
          allowedPaths
          excludedPaths
        }
        collections {
          id
        }
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
        allowedPaths
        excludedPaths
      }
      collections {
        id
      }
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
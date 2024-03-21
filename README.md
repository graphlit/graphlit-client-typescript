# TypeScript Client for Graphlit Platform
## Overview

The Graphlit Client for Node.js enables straightforward interactions with the Graphlit API, allowing developers to execute GraphQL queries and mutations against the Graphlit service. This document outlines the setup process and provides a basic example of using the client.

## Prerequisites

Before you begin, ensure you have the following:

- Node.js installed on your system (recommended version 12.x or higher).
- An active account on [graphlit.com](https://portal.graphlit.dev) with access to the API settings dashboard.

## Installation

To install the Graphlit Client, use npm or yarn:

```bash
npm install graphlit-client
```
or
```bash
yarn add graphlit-client
```

## Configuration

The Graphlit Client requires certain environment variables to be set for authentication and configuration:

- `ENVIRONMENT_ID`: Your environment ID.
- `ORGANIZATION_ID`: Your organization ID.
- `SECRET_KEY`: Your secret key for API access.

You can find these values in the API settings dashboard on [graphlit.com](https://portal.graphlit.dev).

### Setting Environment Variables

To set these environment variables on your system, you can place them in a `.env` file at the root of your project:

```env
ENVIRONMENT_ID=your_environment_id_value
ORGANIZATION_ID=your_organization_id_value
SECRET_KEY=your_secret_key_value
```

Ensure your project uses the `dotenv` package to load these variables:

```bash
npm install dotenv
```

Then, at the start of your application, add:

```javascript
require('dotenv').config();
```

## Usage Example

Here's a simple example of how to use the Graphlit Client to make a query.

```typescript
// Import the Graphlit class from your package
import Graphlit from 'graphlit-client';

// Assuming your environment variables are set,
// Initialize the Graphlit client
const client = new Graphlit(process.env.ENVIRONMENT_ID, process.env.ORGANIZATION_ID, process.env.SECRET_KEY);

// Define your GraphQL query (mutation in this case) and variables
const query = `
mutation CreateFeed($feed: FeedInput!) {
  createFeed(feed: $feed) {
    id
    name
    state
    type
  }
}`;

const variables = {
  feed: {
    type: "WEB",
    web: {
      uri: "https://openai.com/blog"
    },
    name: "OpenAI Blog"
  }
};

// Use an async function to send the request, as the `request` method returns a Promise
async function createFeed() {
  try {
    const response = await client.request(query, variables);
    console.log("Response:", response);
  } catch (error) {
    console.error("Error creating feed:", error);
  }
}

// Call the function
createFeed();
```

## Support

For issues and support with the Graphlit Client or API,  
please refer to the [documentation](https://docs.graphlit.dev/) and  
join our [Discord](https://discord.gg/ygFmfjy3Qx) community.
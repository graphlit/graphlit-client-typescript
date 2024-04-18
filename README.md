# TypeScript Client for Graphlit Platform
## Overview

The Graphlit Client for Node.js enables straightforward interactions with the Graphlit API, allowing developers to execute GraphQL queries and mutations against the Graphlit service. This document outlines the setup process and provides a basic example of using the client.

## Prerequisites

Before you begin, ensure you have the following:

- Node.js installed on your system (recommended version 20.x or higher).
- An active account on the [Graphlit Platform](https://portal.graphlit.dev) with access to the API settings dashboard.

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

The Graphlit Client supports environment variables to be set for authentication and configuration:

- `GRAPHLIT_ENVIRONMENT_ID`: Your environment ID.
- `GRAPHLIT_ORGANIZATION_ID`: Your organization ID.
- `GRAPHLIT_JWT_SECRET`: Your JWT secret for signing the JWT token.

Alternately, you can pass these values with the constructor of the Graphlit client.

You can find these values in the API settings dashboard on the [Graphlit Platform](https://portal.graphlit.dev).

### Setting Environment Variables

To set these environment variables on your system, you can place them in a `.env` file at the root of your project:

```env
GRAPHLIT_ENVIRONMENT_ID=your_environment_id_value
GRAPHLIT_ORGANIZATION_ID=your_organization_id_value
GRAPHLIT_JWT_SECRET=your_jwt_secret_value
```

## Support

Please refer to the [Graphlit API Documentation](https://docs.graphlit.dev/).

For support with the Graphlit Client, please submit a [GitHub Issue](https://github.com/graphlit/graphlit-client-typescript/issues).  

For further support with the Graphlit Platform, please join our [Discord](https://discord.gg/ygFmfjy3Qx) community.

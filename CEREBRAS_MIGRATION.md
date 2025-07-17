# Cerebras SDK Migration Guide

This guide explains how to migrate from using the OpenAI client for Cerebras to the native Cerebras SDK in the Graphlit TypeScript client.

## Overview

The Graphlit TypeScript client has been updated to use the native Cerebras SDK (`@cerebras/cerebras_cloud_sdk`) instead of routing Cerebras requests through the OpenAI client. This provides better compatibility, improved error handling, and access to Cerebras-specific features.

## Breaking Changes

### 1. Peer Dependency Update

**Before:**
```json
{
  "peerDependencies": {
    "openai": "^4.0.0"
  }
}
```

**After:**
```json
{
  "peerDependencies": {
    "@cerebras/cerebras_cloud_sdk": "^1.35.0"
  }
}
```

### 2. Client Instantiation

**Before:**
```typescript
import OpenAI from 'openai';

// Manual Cerebras client setup
const cerebrasClient = new OpenAI({
  apiKey: process.env.CEREBRAS_API_KEY,
  baseURL: "https://api.cerebras.ai/v1",
});

client.setCerebrasClient(cerebrasClient);
```

**After:**
```typescript
import Cerebras from '@cerebras/cerebras_cloud_sdk';

// Option 1: Let Graphlit create the client automatically
// Just ensure CEREBRAS_API_KEY is set in environment

// Option 2: Provide your own Cerebras client
const cerebrasClient = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY,
});

client.setCerebrasClient(cerebrasClient);
```

## Migration Steps

### 1. Update Dependencies

Remove the OpenAI dependency if it's only used for Cerebras:
```bash
npm uninstall openai
```

Install the Cerebras SDK:
```bash
npm install @cerebras/cerebras_cloud_sdk@latest
```

### 2. Update Your Code

#### If You're Using Automatic Client Creation

No code changes needed! The Graphlit client will automatically use the Cerebras SDK when available.

```typescript
// This continues to work as before
const result = await client.streamAgent({
  specification: cerebrasSpec,
  message: "Hello, world!",
  onEvent: (event) => console.log(event),
});
```

#### If You're Providing a Custom Client

Update your client instantiation:

**Before:**
```typescript
import OpenAI from 'openai';
import { Graphlit } from 'graphlit-client';

const graphlit = new Graphlit({ 
  organization: "YOUR_ORG_ID" 
});

const cerebrasClient = new OpenAI({
  apiKey: "YOUR_CEREBRAS_KEY",
  baseURL: "https://api.cerebras.ai/v1",
  maxRetries: 3,
  timeout: 60000,
});

graphlit.setCerebrasClient(cerebrasClient);
```

**After:**
```typescript
import Cerebras from '@cerebras/cerebras_cloud_sdk';
import { Graphlit } from 'graphlit-client';

const graphlit = new Graphlit({ 
  organization: "YOUR_ORG_ID" 
});

const cerebrasClient = new Cerebras({
  apiKey: "YOUR_CEREBRAS_KEY",
  maxRetries: 3,
  timeout: 60000,
});

graphlit.setCerebrasClient(cerebrasClient);
```

### 3. Environment Variables

The environment variable remains the same:
```bash
export CEREBRAS_API_KEY="your-api-key-here"
```

## Benefits of Native SDK

1. **Better Type Safety**: Native TypeScript types from Cerebras
2. **Improved Error Handling**: Cerebras-specific error types and messages
3. **Future Features**: Direct access to new Cerebras features as they're released
4. **Reduced Complexity**: No need to configure baseURL manually

## Compatibility

- The API interface remains the same for `streamAgent` and other methods
- All existing Cerebras models continue to work
- Tool calling support remains limited to `qwen-3-32b` model

## Troubleshooting

### Error: "Cerebras client not available"

Ensure the Cerebras SDK is installed:
```bash
npm install @cerebras/cerebras_cloud_sdk@latest
```

### TypeScript Errors

If you see TypeScript errors, ensure you're importing from the correct package:
```typescript
// Correct
import Cerebras from '@cerebras/cerebras_cloud_sdk';

// Incorrect (old way)
import OpenAI from 'openai';
```

### Rate Limiting

The native SDK provides better rate limit handling. The client will properly surface 429 errors with appropriate retry behavior.

## Example: Complete Migration

Here's a complete before/after example:

**Before (OpenAI Client):**
```typescript
import OpenAI from 'openai';
import { Graphlit } from 'graphlit-client';

async function main() {
  const graphlit = new Graphlit({
    organization: process.env.GRAPHLIT_ORGANIZATION_ID,
  });

  // Manual Cerebras setup with OpenAI client
  const cerebrasClient = new OpenAI({
    apiKey: process.env.CEREBRAS_API_KEY,
    baseURL: "https://api.cerebras.ai/v1",
  });
  
  graphlit.setCerebrasClient(cerebrasClient);

  const result = await graphlit.streamAgent({
    specification: { id: "your-cerebras-spec-id" },
    message: "Explain quantum computing",
    onEvent: (event) => {
      if (event.type === 'token') {
        process.stdout.write(event.token);
      }
    },
  });
}
```

**After (Native Cerebras SDK):**
```typescript
import Cerebras from '@cerebras/cerebras_cloud_sdk';
import { Graphlit } from 'graphlit-client';

async function main() {
  const graphlit = new Graphlit({
    organization: process.env.GRAPHLIT_ORGANIZATION_ID,
  });

  // Option 1: Automatic (recommended)
  // Just ensure CEREBRAS_API_KEY is set

  // Option 2: Manual setup with native SDK
  const cerebrasClient = new Cerebras({
    apiKey: process.env.CEREBRAS_API_KEY,
  });
  
  graphlit.setCerebrasClient(cerebrasClient);

  // Same API usage
  const result = await graphlit.streamAgent({
    specification: { id: "your-cerebras-spec-id" },
    message: "Explain quantum computing",
    onEvent: (event) => {
      if (event.type === 'token') {
        process.stdout.write(event.token);
      }
    },
  });
}
```

## Support

If you encounter any issues during migration, please:
1. Check that you're using the latest version of `graphlit-client`
2. Ensure all peer dependencies are installed
3. Review the error messages for specific guidance
4. Open an issue on the GitHub repository if needed
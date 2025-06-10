# Graphlit Tests

This is the complete test suite for the Graphlit TypeScript client, including both core functionality and streaming capabilities. It's separated from the main SDK to avoid any build conflicts and provides clean ES module testing.

## Features

- ✅ **ES Module Support** - Pure ES modules without CommonJS conflicts
- 🌊 **Streaming Tests** - Tests for real-time token streaming
- 🤖 **Multi-LLM Support** - Tests OpenAI, Anthropic, and Google clients
- 🛠️ **Tool Integration** - Tests tool calling with streaming
- 📦 **Optional Dependencies** - Graceful handling of missing LLM SDKs

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment variables (optional for real testing):**

   ```bash
   export GRAPHLIT_ORGANIZATION_ID="your-org-id"
   export GRAPHLIT_ENVIRONMENT_ID="your-env-id"
   export GRAPHLIT_JWT_SECRET="your-jwt-secret"

   # Optional: For native LLM streaming
   export OPENAI_API_KEY="your-openai-key"
   export ANTHROPIC_API_KEY="your-anthropic-key"
   export GOOGLE_API_KEY="your-google-key"
   ```

## Running Tests

### Basic Tests (No API keys required)

```bash
npm test
```

This runs the basic test runner that validates:

- Client instantiation
- Method availability
- Type interfaces
- LLM SDK detection (if installed)

### Streaming Example (Requires API keys)

```bash
node streaming-example.js
```

This demonstrates:

- Real-time token streaming
- Event handling
- Tool calling integration
- Multiple LLM provider support

## Test Structure

### test-runner.js

- **Purpose**: Basic functionality testing without API calls
- **Tests**: Client creation, method existence, type checking
- **Requirements**: None (works offline)

### streaming-example.js

- **Purpose**: Real streaming demonstration with live APIs
- **Features**: Token streaming, tool calling, multi-provider support
- **Requirements**: Valid Graphlit credentials + optional LLM API keys

## Expected Output

### Basic Tests

```
🧪 Graphlit Streaming Test Runner

📦 Basic Client Tests
🔍 Testing: Client creation with valid credentials
   ✅ PASSED

🌊 Streaming Tests
🔍 Testing: streamConversation method exists
   ✅ PASSED

🤖 LLM Provider Tests
🔍 Testing: OpenAI integration (if installed)
   📦 OpenAI SDK detected
   ✅ OpenAI client creation works
   ✅ PASSED

📊 Test Summary
✅ Passed: 8
❌ Failed: 0
📈 Total: 8

🎉 All tests passed!
```

### Streaming Example

```
🌊 Graphlit Streaming Examples

🔄 Basic Streaming Example
✅ OpenAI client configured

🚀 Starting streaming conversation...

🎬 Conversation started
   Conversation ID: conv_123

Once upon a time, in a small art studio...
[real-time streaming tokens]

🎉 Conversation completed!
   Final conversation ID: conv_123

📊 Final message buffer length: 245 characters
```

## Troubleshooting

### Module Import Errors

- ✅ **Solved**: This test project uses ES modules (`"type": "module"`)
- ✅ **Solved**: All imports use ES module syntax
- ✅ **Solved**: No mixing of CommonJS and ES modules

### Missing Dependencies

- The tests gracefully handle missing LLM SDKs
- Only install the LLM SDKs you actually plan to use
- The core Graphlit functionality works without any LLM SDKs

### API Credential Issues

- Basic tests don't require real API credentials
- Use placeholder values for basic testing
- Real streaming requires valid Graphlit + LLM credentials

## Integration with Main SDK

This test project imports the main SDK as a dependency:

```json
{
  "dependencies": {
    "graphlit-client": "file:../"
  }
}
```

Any changes to the main SDK (`../src/`) will be reflected after running:

```bash
cd ..
npm run build
cd test-project
npm install
```

## Next Steps

1. **Run basic tests**: `npm test`
2. **Configure credentials**: Set environment variables
3. **Try streaming**: `node streaming-example.js`
4. **Customize**: Modify examples for your use case
5. **Integrate**: Use patterns in your own applications

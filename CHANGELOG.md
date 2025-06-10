# Changelog

All notable changes to the Graphlit TypeScript Client will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-01-06

### Added
- **Real-time streaming support** with the new `streamAgent` method
  - Native streaming integration with OpenAI, Anthropic, and Google Gemini models
  - Automatic fallback to regular API calls when streaming providers are not available
  - UI-optimized event stream with automatic message accumulation
  - Support for tool calling during streaming conversations
  - Configurable chunking strategies (character, word, sentence)
  - Smooth streaming with configurable delays to prevent UI flicker

- **Custom LLM client support**
  - `setOpenAIClient()` method to use custom OpenAI instances
  - `setAnthropicClient()` method to use custom Anthropic instances  
  - `setGoogleClient()` method to use custom Google Generative AI instances
  - Support for proxy configurations and custom endpoints

- **Enhanced streaming features**
  - AbortController support for cancelling ongoing streams
  - Conversation continuity - continue streaming in existing conversations
  - Comprehensive error handling with recoverable error detection
  - Tool execution with streaming responses
  - Real-time token-by-token updates

- **New TypeScript types**
  - `UIStreamEvent` - High-level streaming events for UI integration
  - `StreamEvent` - Low-level streaming events for fine control
  - `StreamAgentOptions` - Configuration options for streaming
  - `ToolHandler` - Type-safe tool handler functions
  - `AgentResult`, `ToolCallResult`, `UsageInfo` - Supporting types

### Changed
- LLM client libraries (openai, @anthropic-ai/sdk, @google/generative-ai) are now optional peer dependencies
- Improved TypeScript typing throughout the codebase
- Enhanced error messages for better debugging

### Fixed
- Message formatting issues with trailing whitespace
- Tool calling message role assignment
- Conversation history handling in streaming mode
- Pre-aborted signal handling
- Google Gemini streaming text completeness

### Technical Improvements
- Queue-based chunk emission for consistent streaming behavior
- Unicode-aware text segmentation using Intl.Segmenter
- Proper cleanup of resources in test suites
- Comprehensive test coverage for streaming functionality

## [1.0.0] - Previous Release

### Initial Features
- GraphQL client for Graphlit API
- Support for all Graphlit operations (content, conversations, specifications, etc.)
- JWT-based authentication
- Environment variable configuration
- TypeScript support with generated types
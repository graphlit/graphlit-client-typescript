# Tool Calling Fixes Summary

## Issues Fixed

### 1. Cohere Tool Calling (400 Bad Request)
**Problem**: Cohere was rejecting tool schemas because of incorrect type mapping from JSON Schema to Cohere's expected format.

**Solution**: 
- Added proper type mapping in `providers.ts`:
  - `"number"/"integer"` → `"float"`
  - `"boolean"` → `"bool"`
  - `"array"` → `"list"`
  - `"object"` → `"dict"`
  - Default → `"str"`

### 2. Mistral Tool Calling (Multi-turn Issues)
**Problem**: "Not the same number of function calls and responses" error indicating a mismatch in tool call tracking.

**Solution**: 
- Added better error logging for invalid JSON in tool arguments
- The formatter already properly handles tool calls with `tool_call_id` for multi-turn conversations

### 3. Groq Tool Calling (Limited Support)
**Problem**: Some Groq models (especially LLaMA variants) have limited or no tool calling support.

**Solution**:
- Instead of completely disabling tools, now simplifies schemas more aggressively for problematic models
- Maintains a list of models with known issues: `llama-3.3`, `llama3-groq-70b`, `llama3-groq-8b`
- Uses simplified schemas that only include basic properties

### 4. Cerebras Tool Calling (Limited Support)
**Problem**: Only the qwen-3-32b model supports multi-turn tool use. Other models will error if you include a non-empty tool_calls array on an assistant turn.

**Solution**:
- Added detection for the qwen-3-32b model (only model that supports tools)
- For all other Cerebras models:
  - Disables tool definitions
  - Filters out any `tool_calls` from assistant messages to prevent errors
- Provides appropriate warning logs when tools are disabled

## Testing Recommendations

1. Run the comprehensive integration tests with `DEBUG_GRAPHLIT_SDK_STREAMING=1` to see detailed logs
2. Monitor for:
   - Cohere: Should now accept the calculator tool schema
   - Mistral: Should handle multi-turn tool responses correctly
   - Groq: May still not call tools but should not error
   - Cerebras: Will skip tool calling entirely

## Future Improvements

1. Add enum value support for Cohere by including them in the description field
2. Implement tool calling fallback strategies for models with limited support
3. Consider adding a capability matrix for which models support which features
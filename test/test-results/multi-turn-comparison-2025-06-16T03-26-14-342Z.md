# Multi-turn Conversation Performance Comparison

## Test Scenario
A 4-turn conversation about planning a trip to Tokyo, covering:
1. General travel tips
2. Transportation system details
3. Dietary restrictions and food
4. Creating a 3-day itinerary

## Summary Statistics
- **Total Providers Tested**: 22
- **Providers with Errors**: 3 (13.6%)
- **Total Errors**: 17
- **Average Errors per Provider**: 0.8

## Performance Metrics

### Overall Performance Ranking

| Rank | Provider | Model | Avg TPS | Avg TTFT (ms) | Total Time (s) | Total Tokens | Errors |
|------|----------|-------|---------|---------------|----------------|--------------|--------|
| 1 | OpenAI GPT-4o Mini | GPT4O_MINI_128K | 22.5 | 2542 | 39.5 | 889 | 0 |
| 2 | Bedrock Nova Pro | NOVA_PRO | 21.8 | 2158 | 15.4 | 335 | 0 |
| 3 | OpenAI GPT-4.1 Mini | GPT41_MINI_1024K | 21.7 | 2273 | 30.1 | 653 | 0 |
| 4 | Claude 4 Sonnet | CLAUDE_4_SONNET | 19.3 | 5447 | 56.5 | 1089 | 0 |
| 5 | Claude 3.7 Sonnet | CLAUDE_3_7_SONNET | 17.1 | 4696 | 44.9 | 767 | 0 |
| 6 | Claude 3.5 Haiku | CLAUDE_3_5_HAIKU | 16.6 | 4523 | 45.3 | 751 | 0 |
| 7 | OpenAI GPT-4o | GPT4O_128K | 16.2 | 3473 | 54.1 | 874 | 0 |
| 8 | OpenAI GPT-4.1 | GPT41_1024K | 14.2 | 3353 | 49.8 | 708 | 0 |
| 9 | Deepseek Chat | CHAT | 13.8 | 7379 | 72.9 | 1003 | 0 |
| 10 | Groq Llama 4 Scout 17B | LLAMA_4_SCOUT_17B | 13.4 | 1314 | 8.7 | 117 | 0 |
| 11 | Cohere Command A | COMMAND_A | 11.5 | 3028 | 23.8 | 273 | 0 |
| 12 | Mistral Large | MISTRAL_LARGE | 10.5 | 7099 | 94.3 | 989 | 0 |
| 13 | OpenAI o4 Mini | O4_MINI_200K | 8.4 | 7226 | 41.6 | 350 | 0 |
| 14 | Cerebras Llama 3.3 70B | LLAMA_3_3_70B | 8.2 | 1329 | 6.9 | 57 | 0 |
| 15 | Groq LLlama 3.3 70B | LLAMA_3_3_70B | 7.8 | 2975 | 15.5 | 121 | 0 |
| 16 | Claude 4 Opus | CLAUDE_4_OPUS | 7.5 | 4539 | 60.5 | 455 | 2 |
| 17 | Bedrock Nova Premier | NOVA_PREMIER | 6.7 | 1246 | 16.6 | 111 | 6 |
| 18 | OpenAI o3 Mini | O3_MINI_200K | 4.8 | 7369 | 34.4 | 166 | 0 |
| 19 | Cohere Command R+ | COMMAND_R_PLUS | 4.6 | 4596 | 30.2 | 139 | 0 |
| 20 | Gemini 2.5 Flash | GEMINI_2_5_FLASH_PREVIEW | 3.2 | 2719 | 12.0 | 38 | 0 |
| 21 | Bedrock Claude 3.7 | CLAUDE_3_7_SONNET | 3.1 | 2408 | 24.8 | 77 | 9 |
| 22 | Gemini 2.5 Pro | GEMINI_2_5_PRO_PREVIEW | 2.1 | 13390 | 57.4 | 122 | 0 |

### Time to First Token (TTFT) Ranking

| Rank | Provider | Avg TTFT (ms) | Min TTFT | Max TTFT |
|------|----------|---------------|----------|----------|
| 1 | Bedrock Nova Premier | 1246 | 0 | 2504 |
| 2 | Groq Llama 4 Scout 17B | 1314 | 1232 | 1461 |
| 3 | Cerebras Llama 3.3 70B | 1329 | 1135 | 1521 |
| 4 | Bedrock Nova Pro | 2158 | 1423 | 3244 |
| 5 | OpenAI GPT-4.1 Mini | 2273 | 1692 | 2666 |
| 6 | Bedrock Claude 3.7 | 2408 | 0 | 9631 |
| 7 | OpenAI GPT-4o Mini | 2542 | 1625 | 3916 |
| 8 | Gemini 2.5 Flash | 2719 | 2134 | 3350 |
| 9 | Groq LLlama 3.3 70B | 2975 | 1565 | 4934 |
| 10 | Cohere Command A | 3028 | 1688 | 3887 |
| 11 | OpenAI GPT-4.1 | 3353 | 2763 | 4004 |
| 12 | OpenAI GPT-4o | 3473 | 2230 | 4856 |
| 13 | Claude 3.5 Haiku | 4523 | 3656 | 5707 |
| 14 | Claude 4 Opus | 4539 | 0 | 7754 |
| 15 | Cohere Command R+ | 4596 | 4426 | 4754 |
| 16 | Claude 3.7 Sonnet | 4696 | 2341 | 6195 |
| 17 | Claude 4 Sonnet | 5447 | 4488 | 6279 |
| 18 | Mistral Large | 7099 | 1903 | 14574 |
| 19 | OpenAI o4 Mini | 7226 | 4584 | 9408 |
| 20 | OpenAI o3 Mini | 7369 | 5469 | 10188 |
| 21 | Deepseek Chat | 7379 | 3542 | 10995 |
| 22 | Gemini 2.5 Pro | 13390 | 10931 | 15726 |

### Per-Turn Performance Details

#### Turn 1: Hi! I'm planning a trip to Tokyo. What are the top...

| Provider | Tokens | Time (ms) | TPS | TTFT (ms) |
|----------|--------|-----------|-----|-----------|
| OpenAI GPT-4o | 192 | 15857 | 12.1 | 4856 |
| OpenAI GPT-4o Mini | 133 | 6452 | 20.6 | 2464 |
| OpenAI o3 Mini | 46 | 11573 | 4.0 | 10188 |
| OpenAI o4 Mini | 65 | 11246 | 5.8 | 9310 |
| OpenAI GPT-4.1 | 159 | 19341 | 8.2 | 3858 |
| OpenAI GPT-4.1 Mini | 96 | 5169 | 18.6 | 2291 |
| Claude 4 Opus | 0 | 0 | 0.0 | 0 |
| Claude 4 Sonnet | 218 | 12554 | 17.4 | 5970 |
| Claude 3.7 Sonnet | 160 | 11009 | 14.5 | 6195 |
| Claude 3.5 Haiku | 179 | 9264 | 19.3 | 3879 |
| Gemini 2.5 Flash | 11 | 3665 | 3.0 | 3350 |
| Gemini 2.5 Pro | 29 | 16756 | 1.7 | 15726 |
| Groq Llama 4 Scout 17B | 21 | 2079 | 10.1 | 1461 |
| Groq LLlama 3.3 70B | 24 | 3417 | 7.0 | 2698 |
| Cerebras Llama 3.3 70B | 14 | 1918 | 7.3 | 1521 |
| Cohere Command R+ | 17 | 6372 | 2.7 | 4426 |
| Cohere Command A | 49 | 4627 | 10.6 | 2984 |
| Mistral Large | 175 | 12531 | 14.0 | 6368 |
| Bedrock Claude 3.7 | 77 | 15163 | 5.1 | 9631 |
| Bedrock Nova Pro | 62 | 4528 | 13.7 | 3244 |
| Bedrock Nova Premier | 0 | 0 | 0.0 | 0 |
| Deepseek Chat | 189 | 15107 | 12.5 | 6225 |

#### Turn 2: That's helpful! Can you elaborate on the transport...

| Provider | Tokens | Time (ms) | TPS | TTFT (ms) |
|----------|--------|-----------|-----|-----------|
| OpenAI GPT-4o | 247 | 11845 | 20.9 | 3600 |
| OpenAI GPT-4o Mini | 252 | 12030 | 20.9 | 2162 |
| OpenAI o3 Mini | 35 | 7015 | 5.0 | 5972 |
| OpenAI o4 Mini | 87 | 8217 | 10.6 | 5600 |
| OpenAI GPT-4.1 | 157 | 7547 | 20.8 | 2763 |
| OpenAI GPT-4.1 Mini | 175 | 7707 | 22.7 | 2443 |
| Claude 4 Opus | 123 | 11973 | 10.3 | 6115 |
| Claude 4 Sonnet | 270 | 13497 | 20.0 | 5052 |
| Claude 3.7 Sonnet | 184 | 10534 | 17.5 | 4877 |
| Claude 3.5 Haiku | 197 | 11037 | 17.8 | 4850 |
| Gemini 2.5 Flash | 10 | 2660 | 3.8 | 2371 |
| Gemini 2.5 Pro | 29 | 16073 | 1.8 | 15214 |
| Groq Llama 4 Scout 17B | 22 | 1881 | 11.7 | 1232 |
| Groq LLlama 3.3 70B | 27 | 5745 | 4.7 | 4934 |
| Cerebras Llama 3.3 70B | 13 | 1564 | 8.3 | 1196 |
| Cohere Command R+ | 22 | 9756 | 2.3 | 4596 |
| Cohere Command A | 83 | 7308 | 11.4 | 3887 |
| Mistral Large | 261 | 32571 | 8.0 | 14574 |
| Bedrock Claude 3.7 | 0 | 0 | 0.0 | 0 |
| Bedrock Nova Pro | 96 | 3311 | 29.0 | 1423 |
| Bedrock Nova Premier | 62 | 5550 | 11.2 | 2504 |
| Deepseek Chat | 252 | 19669 | 12.8 | 8754 |

#### Turn 3: What about food allergies? I'm vegetarian and have...

| Provider | Tokens | Time (ms) | TPS | TTFT (ms) |
|----------|--------|-----------|-----|-----------|
| OpenAI GPT-4o | 178 | 12542 | 14.2 | 2230 |
| OpenAI GPT-4o Mini | 165 | 6579 | 25.1 | 1625 |
| OpenAI o3 Mini | 38 | 6587 | 5.8 | 5469 |
| OpenAI o4 Mini | 90 | 7271 | 12.4 | 4584 |
| OpenAI GPT-4.1 | 119 | 8652 | 13.8 | 2788 |
| OpenAI GPT-4.1 Mini | 113 | 6401 | 17.7 | 1692 |
| Claude 4 Opus | 181 | 12935 | 14.0 | 4285 |
| Claude 4 Sonnet | 258 | 14912 | 17.3 | 6279 |
| Claude 3.7 Sonnet | 166 | 7492 | 22.2 | 2341 |
| Claude 3.5 Haiku | 175 | 12794 | 13.7 | 3656 |
| Gemini 2.5 Flash | 8 | 2376 | 3.4 | 2134 |
| Gemini 2.5 Pro | 28 | 12532 | 2.2 | 11688 |
| Groq Llama 4 Scout 17B | 22 | 1891 | 11.6 | 1232 |
| Groq LLlama 3.3 70B | 30 | 2455 | 12.2 | 1565 |
| Cerebras Llama 3.3 70B | 13 | 1512 | 8.6 | 1135 |
| Cohere Command R+ | 55 | 7288 | 7.5 | 4606 |
| Cohere Command A | 61 | 3519 | 17.3 | 1688 |
| Mistral Large | 158 | 6649 | 23.8 | 1903 |
| Bedrock Claude 3.7 | 0 | 0 | 0.0 | 0 |
| Bedrock Nova Pro | 82 | 3360 | 24.4 | 1545 |
| Bedrock Nova Premier | 49 | 4653 | 10.5 | 2479 |
| Deepseek Chat | 226 | 13269 | 17.0 | 3542 |

#### Turn 4: Based on everything we've discussed, can you creat...

| Provider | Tokens | Time (ms) | TPS | TTFT (ms) |
|----------|--------|-----------|-----|-----------|
| OpenAI GPT-4o | 257 | 13807 | 18.6 | 3204 |
| OpenAI GPT-4o Mini | 339 | 14450 | 23.5 | 3916 |
| OpenAI o3 Mini | 47 | 9266 | 5.1 | 7848 |
| OpenAI o4 Mini | 108 | 14862 | 7.3 | 9408 |
| OpenAI GPT-4.1 | 273 | 14258 | 19.1 | 4004 |
| OpenAI GPT-4.1 Mini | 269 | 10855 | 24.8 | 2666 |
| Claude 4 Opus | 151 | 19555 | 7.7 | 7754 |
| Claude 4 Sonnet | 343 | 15534 | 22.1 | 4488 |
| Claude 3.7 Sonnet | 257 | 15892 | 16.2 | 5370 |
| Claude 3.5 Haiku | 200 | 12182 | 16.4 | 5707 |
| Gemini 2.5 Flash | 9 | 3279 | 2.7 | 3022 |
| Gemini 2.5 Pro | 36 | 12010 | 3.0 | 10931 |
| Groq Llama 4 Scout 17B | 52 | 2883 | 18.0 | 1332 |
| Groq LLlama 3.3 70B | 40 | 3901 | 10.3 | 2704 |
| Cerebras Llama 3.3 70B | 17 | 1950 | 8.7 | 1464 |
| Cohere Command R+ | 45 | 6767 | 6.6 | 4754 |
| Cohere Command A | 80 | 8376 | 9.6 | 3552 |
| Mistral Large | 395 | 42583 | 9.3 | 5551 |
| Bedrock Claude 3.7 | 0 | 0 | 0.0 | 0 |
| Bedrock Nova Pro | 95 | 4200 | 22.6 | 2420 |
| Bedrock Nova Premier | 0 | 0 | 0.0 | 0 |
| Deepseek Chat | 336 | 24898 | 13.5 | 10995 |


### Error Summary

3 provider(s) experienced errors during testing:

| Provider | Model | Total Errors | Error Rate | Failed Turns |
|----------|-------|--------------|------------|--------------|
| Bedrock Claude 3.7 | CLAUDE_3_7_SONNET | 9 | 225.0% | 2, 2, 2, 3, 3, 3, 4, 4, 4 |
| Bedrock Nova Premier | NOVA_PREMIER | 6 | 150.0% | 1, 1, 1, 4, 4, 4 |
| Claude 4 Opus | CLAUDE_4_OPUS | 2 | 50.0% | 1, 1 |

### Detailed Error Messages

**Bedrock Claude 3.7** (CLAUDE_3_7_SONNET):
- Turn 2: Bedrock rate limit: Too many tokens, please wait before trying again.
- Turn 2: Too many tokens, please wait before trying again.
- Turn 2: Too many tokens, please wait before trying again.
- Turn 3: Bedrock rate limit: Too many tokens, please wait before trying again.
- Turn 3: Too many tokens, please wait before trying again.
- Turn 3: Too many tokens, please wait before trying again.
- Turn 4: Bedrock rate limit: Too many tokens, please wait before trying again.
- Turn 4: Too many tokens, please wait before trying again.
- Turn 4: Too many tokens, please wait before trying again.

**Bedrock Nova Premier** (NOVA_PREMIER):
- Turn 1: Bedrock rate limit: Too many requests to model, please wait before trying again.
- Turn 1: Too many requests to model, please wait before trying again.
- Turn 1: Too many requests to model, please wait before trying again.
- Turn 4: Bedrock rate limit: Too many requests to model, please wait before trying again.
- Turn 4: Too many requests to model, please wait before trying again.
- Turn 4: Too many requests to model, please wait before trying again.

**Claude 4 Opus** (CLAUDE_4_OPUS):
- Turn 1: Anthropic service overloaded
- Turn 1: Anthropic service overloaded


**Common Error Patterns:**
- **AWS Bedrock**: 15 errors across 2 model(s) - likely authentication or region issues
- **Other Providers**: 2 errors across 1 model(s)

**Note**: Errors may be due to:
- Rate limiting (429)
- Authentication issues
- Network timeouts
- Model-specific API incompatibilities
- Insufficient context or token limits

Consider running failed providers individually with debug logging enabled for detailed error analysis.
## Key Insights

### Speed Leaders (Tokens Per Second)
1. **OpenAI GPT-4o Mini** - 22.5 TPS
2. **Bedrock Nova Pro** - 21.8 TPS
3. **OpenAI GPT-4.1 Mini** - 21.7 TPS

### Responsiveness Leaders (Time to First Token)
1. **Bedrock Nova Premier** - 1246ms average TTFT
2. **Groq Llama 4 Scout 17B** - 1314ms average TTFT
3. **Cerebras Llama 3.3 70B** - 1329ms average TTFT

### Token Efficiency
Some models generated significantly different token counts for the same prompts:

| Provider | Total Tokens | Tokens per Turn |
|----------|--------------|-----------------|
| Gemini 2.5 Flash | 38 | 10 |
| Cerebras Llama 3.3 70B | 57 | 14 |
| Bedrock Claude 3.7 | 77 | 19 |
| Bedrock Nova Premier | 111 | 28 |
| Groq Llama 4 Scout 17B | 117 | 29 |
| Groq LLlama 3.3 70B | 121 | 30 |
| Gemini 2.5 Pro | 122 | 31 |
| Cohere Command R+ | 139 | 35 |
| OpenAI o3 Mini | 166 | 42 |
| Cohere Command A | 273 | 68 |
| Bedrock Nova Pro | 335 | 84 |
| OpenAI o4 Mini | 350 | 88 |
| Claude 4 Opus | 455 | 114 |
| OpenAI GPT-4.1 Mini | 653 | 163 |
| OpenAI GPT-4.1 | 708 | 177 |
| Claude 3.5 Haiku | 751 | 188 |
| Claude 3.7 Sonnet | 767 | 192 |
| OpenAI GPT-4o | 874 | 219 |
| OpenAI GPT-4o Mini | 889 | 222 |
| Mistral Large | 989 | 247 |
| Deepseek Chat | 1003 | 251 |
| Claude 4 Sonnet | 1089 | 272 |

## Test Environment
- Date: 2025-06-16T03:26:14.342Z
- Region: us-east-1 (for AWS Bedrock)
- Connection: Streaming enabled for all providers
- Temperature: 0.7 (consistent across all models)

## Methodology
- Each provider ran the same 4-turn conversation
- Metrics collected include tokens per second (TPS), time to first token (TTFT), and total processing time
- All tests run sequentially to avoid network congestion
- Error handling included to capture failed turns

---
*Generated by Graphlit TypeScript SDK Multi-turn Comparison Test*

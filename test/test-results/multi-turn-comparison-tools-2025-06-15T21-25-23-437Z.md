# Multi-turn Conversation Performance Comparison (WITH TOOLS)

## Test Scenario
A 4-turn conversation about planning a trip to Tokyo, using tools for:
1. Weather lookup
2. Restaurant search (vegetarian with nut allergy)
3. Tourist attractions and opening hours
4. Creating a detailed 3-day itinerary

## Summary Statistics
- **Total Providers Tested**: 22
- **Providers with Errors**: 6 (27.3%)
- **Total Errors**: 45
- **Average Errors per Provider**: 2.0

## Performance Metrics

### Overall Performance Ranking

| Rank | Provider | Model | Avg TPS | Avg TTFT (ms) | Total Time (s) | Total Tokens | Tool Calls | Avg Tool Time (ms) | Errors |
|------|----------|-------|---------|---------------|----------------|--------------|------------|-------------------|--------|
| 1 | Bedrock Nova Pro | NOVA_PRO | 25.1 | 2785 | 20.1 | 506 | 1 | 1 | 0 |
| 2 | Bedrock Nova Premier | NOVA_PREMIER | 18.1 | 7150 | 102.1 | 1853 | 1 | 1 | 0 |
| 3 | OpenAI GPT-4o Mini | GPT4O_MINI_128K | 16.4 | 3331 | 33.6 | 551 | 8 | 0 | 0 |
| 4 | OpenAI GPT-4.1 | GPT41_1024K | 15.8 | 3874 | 34.3 | 542 | 8 | 0 | 0 |
| 5 | OpenAI GPT-4o | GPT4O_128K | 15.7 | 3693 | 32.6 | 513 | 14 | 0 | 0 |
| 6 | Claude 3.7 Sonnet | CLAUDE_3_7_SONNET | 14.0 | 4112 | 75.5 | 1056 | 10 | 24 | 0 |
| 7 | Claude 4 Sonnet | CLAUDE_4_SONNET | 13.4 | 7479 | 79.1 | 1061 | 11 | 19 | 0 |
| 8 | Deepseek Chat | CHAT | 13.0 | 9423 | 87.7 | 1136 | 8 | 532 | 0 |
| 9 | Claude 3.5 Haiku | CLAUDE_3_5_HAIKU | 11.8 | 3524 | 65.9 | 776 | 12 | 25 | 0 |
| 10 | OpenAI GPT-4.1 Mini | GPT41_MINI_1024K | 10.2 | 5310 | 55.0 | 561 | 11 | 1 | 0 |
| 11 | Groq Llama 4 Scout 17B | LLAMA_4_SCOUT_17B | 9.7 | 1761 | 9.9 | 96 | 2 | 0 | 0 |
| 12 | Claude 4 Opus | CLAUDE_4_OPUS | 9.5 | 6376 | 74.3 | 706 | 2 | 17 | 0 |
| 13 | Cohere Command R+ | COMMAND_R_PLUS | 5.0 | 9779 | 64.5 | 324 | 11 | 68 | 0 |
| 14 | Groq LLlama 3.3 70B | LLAMA_3_3_70B | 4.6 | 1263 | 10.8 | 50 | 4 | 0 | 4 |
| 15 | OpenAI o4 Mini | O4_MINI_200K | 4.5 | 18046 | 83.4 | 375 | 8 | 0 | 0 |
| 16 | OpenAI o3 Mini | O3_MINI_200K | 3.7 | 13924 | 65.1 | 238 | 2 | 0 | 0 |
| 17 | Bedrock Claude 3.7 | CLAUDE_3_7_SONNET | 2.3 | 917 | 27.6 | 63 | 4 | 1 | 9 |
| 18 | Gemini 2.5 Flash | GEMINI_2_5_FLASH_PREVIEW | 0.0 | 0 | 5.8 | 0 | 0 | 0 | 8 |
| 19 | Gemini 2.5 Pro | GEMINI_2_5_PRO_PREVIEW | 0.0 | 0 | 7.2 | 0 | 0 | 0 | 8 |
| 20 | Cerebras Llama 3.3 70B | LLAMA_3_3_70B | 0.0 | 0 | 14.7 | 0 | 3 | 1 | 8 |
| 21 | Cohere Command A | COMMAND_A | 0.0 | 0 | 5.1 | 0 | 0 | 0 | 8 |
| 22 | Mistral Large | MISTRAL_LARGE | 0.0 | 0 | 20.5 | 0 | 0 | 0 | 0 |

### Time to First Token (TTFT) Ranking

| Rank | Provider | Avg TTFT (ms) | Min TTFT | Max TTFT |
|------|----------|---------------|----------|----------|
| 1 | Gemini 2.5 Flash | 0 | 0 | 0 |
| 2 | Gemini 2.5 Pro | 0 | 0 | 0 |
| 3 | Cerebras Llama 3.3 70B | 0 | 0 | 0 |
| 4 | Cohere Command A | 0 | 0 | 0 |
| 5 | Mistral Large | 0 | 0 | 0 |
| 6 | Bedrock Claude 3.7 | 917 | 0 | 3669 |
| 7 | Groq LLlama 3.3 70B | 1263 | 0 | 3367 |
| 8 | Groq Llama 4 Scout 17B | 1761 | 1462 | 2025 |
| 9 | Bedrock Nova Pro | 2785 | 1832 | 4803 |
| 10 | OpenAI GPT-4o Mini | 3331 | 1957 | 4594 |
| 11 | Claude 3.5 Haiku | 3524 | 2608 | 3988 |
| 12 | OpenAI GPT-4o | 3693 | 2500 | 4447 |
| 13 | OpenAI GPT-4.1 | 3874 | 2443 | 6804 |
| 14 | Claude 3.7 Sonnet | 4112 | 3119 | 5661 |
| 15 | OpenAI GPT-4.1 Mini | 5310 | 2669 | 8726 |
| 16 | Claude 4 Opus | 6376 | 3868 | 10768 |
| 17 | Bedrock Nova Premier | 7150 | 3011 | 11377 |
| 18 | Claude 4 Sonnet | 7479 | 3330 | 11307 |
| 19 | Deepseek Chat | 9423 | 5453 | 15579 |
| 20 | Cohere Command R+ | 9779 | 7017 | 16211 |
| 21 | OpenAI o3 Mini | 13924 | 9759 | 18456 |
| 22 | OpenAI o4 Mini | 18046 | 5282 | 33418 |

### Tool Calling Performance

| Rank | Provider | Tool Calls | Avg Tool Time (ms) | Min Tool Time | Max Tool Time |
|------|----------|------------|-------------------|---------------|---------------|
| 1 | OpenAI o3 Mini | 2 | 0 | 0 | 0 |
| 2 | Groq Llama 4 Scout 17B | 2 | 0 | 0 | 0 |
| 3 | Groq LLlama 3.3 70B | 4 | 0 | 0 | 0 |
| 4 | OpenAI GPT-4o | 14 | 0 | 0 | 1 |
| 5 | OpenAI GPT-4o Mini | 8 | 0 | 0 | 1 |
| 6 | OpenAI GPT-4.1 | 8 | 0 | 0 | 1 |
| 7 | OpenAI o4 Mini | 8 | 0 | 0 | 1 |
| 8 | Bedrock Claude 3.7 | 4 | 1 | 0 | 1 |
| 9 | Cerebras Llama 3.3 70B | 3 | 1 | 0 | 1 |
| 10 | OpenAI GPT-4.1 Mini | 11 | 1 | 0 | 2 |
| 11 | Bedrock Nova Pro | 1 | 1 | 1 | 1 |
| 12 | Bedrock Nova Premier | 1 | 1 | 1 | 1 |
| 13 | Claude 4 Opus | 2 | 17 | 14 | 20 |
| 14 | Claude 4 Sonnet | 11 | 19 | 7 | 45 |
| 15 | Claude 3.7 Sonnet | 10 | 24 | 14 | 39 |
| 16 | Claude 3.5 Haiku | 12 | 25 | 13 | 54 |
| 17 | Cohere Command R+ | 11 | 68 | 5 | 95 |
| 18 | Deepseek Chat | 8 | 532 | 460 | 966 |

### Per-Turn Performance Details

#### Turn 1: Hi! I'm planning a trip to Tokyo next month. What'...
Expected tools: Weather

| Provider | Tokens | Time (ms) | TPS | TTFT (ms) | Tools Used |
|----------|--------|-----------|-----|-----------|------------|
| OpenAI GPT-4o | 47 | 3904 | 12.0 | 2500 | Weather |
| OpenAI GPT-4o Mini | 76 | 7468 | 10.2 | 4594 | Weather |
| OpenAI o3 Mini | 21 | 12625 | 1.7 | 12020 | Weather |
| OpenAI o4 Mini | 57 | 10540 | 5.4 | 8834 | Weather |
| OpenAI GPT-4.1 | 51 | 4359 | 11.7 | 2852 | Weather |
| OpenAI GPT-4.1 Mini | 54 | 4317 | 12.5 | 2669 | Weather |
| Claude 4 Opus | 186 | 13685 | 13.6 | 3868 | Weather |
| Claude 4 Sonnet | 156 | 10530 | 14.8 | 3330 | Weather |
| Claude 3.7 Sonnet | 173 | 9579 | 18.1 | 3119 | Weather |
| Claude 3.5 Haiku | 175 | 13078 | 13.4 | 2608 | Weather, AttractionsSearch |
| Gemini 2.5 Flash | 0 | 0 | 0.0 | 0 | None |
| Gemini 2.5 Pro | 0 | 0 | 0.0 | 0 | None |
| Groq Llama 4 Scout 17B | 13 | 2343 | 5.5 | 1965 | Weather |
| Groq LLlama 3.3 70B | 0 | 0 | 0.0 | 0 | None |
| Cerebras Llama 3.3 70B | 0 | 0 | 0.0 | 0 | None |
| Cohere Command R+ | 25 | 9697 | 2.6 | 7890 | Weather |
| Cohere Command A | 0 | 0 | 0.0 | 0 | None |
| Mistral Large | 0 | 3772 | 0.0 | 0 | None |
| Bedrock Claude 3.7 | 0 | 0 | 0.0 | 0 | None |
| Bedrock Nova Pro | 168 | 4719 | 35.6 | 1832 | Weather |
| Bedrock Nova Premier | 446 | 22476 | 19.8 | 3011 | Weather |
| Deepseek Chat | 108 | 12709 | 8.5 | 8011 | Weather |

#### Turn 2: Great! Can you find me some highly-rated vegetaria...
Expected tools: RestaurantSearch

| Provider | Tokens | Time (ms) | TPS | TTFT (ms) | Tools Used |
|----------|--------|-----------|-----|-----------|------------|
| OpenAI GPT-4o | 62 | 5668 | 10.9 | 3722 | RestaurantSearch |
| OpenAI GPT-4o Mini | 69 | 5265 | 13.1 | 2539 | RestaurantSearch |
| OpenAI o3 Mini | 50 | 16937 | 3.0 | 15459 | RestaurantSearch |
| OpenAI o4 Mini | 47 | 6688 | 7.0 | 5282 | RestaurantSearch |
| OpenAI GPT-4.1 | 82 | 6252 | 13.1 | 3395 | RestaurantSearch |
| OpenAI GPT-4.1 Mini | 78 | 13836 | 5.6 | 4427 | RestaurantSearch |
| Claude 4 Opus | 186 | 26252 | 7.1 | 5330 | RestaurantSearch |
| Claude 4 Sonnet | 207 | 17159 | 12.1 | 7818 | RestaurantSearch |
| Claude 3.7 Sonnet | 144 | 12551 | 11.5 | 5661 | RestaurantSearch |
| Claude 3.5 Haiku | 149 | 11768 | 12.7 | 3988 | RestaurantSearch |
| Gemini 2.5 Flash | 0 | 0 | 0.0 | 0 | None |
| Gemini 2.5 Pro | 0 | 0 | 0.0 | 0 | None |
| Groq Llama 4 Scout 17B | 21 | 2201 | 9.5 | 1591 | RestaurantSearch |
| Groq LLlama 3.3 70B | 24 | 2385 | 10.1 | 1684 | RestaurantSearch |
| Cerebras Llama 3.3 70B | 0 | 0 | 0.0 | 0 | None |
| Cohere Command R+ | 33 | 11190 | 2.9 | 7999 | RestaurantSearch |
| Cohere Command A | 0 | 0 | 0.0 | 0 | None |
| Mistral Large | 0 | 2190 | 0.0 | 0 | None |
| Bedrock Claude 3.7 | 0 | 0 | 0.0 | 0 | None |
| Bedrock Nova Pro | 165 | 4945 | 33.4 | 2147 | None |
| Bedrock Nova Premier | 297 | 20840 | 14.3 | 11377 | None |
| Deepseek Chat | 177 | 19342 | 9.2 | 8647 | RestaurantSearch |

#### Turn 3: What are the top tourist attractions I should visi...
Expected tools: AttractionsSearch, OpeningHours

| Provider | Tokens | Time (ms) | TPS | TTFT (ms) | Tools Used |
|----------|--------|-----------|-----|-----------|------------|
| OpenAI GPT-4o | 113 | 7498 | 15.1 | 4102 | AttractionsSearch, OpeningHours |
| OpenAI GPT-4o Mini | 155 | 8999 | 17.2 | 4232 | AttractionsSearch, OpeningHours |
| OpenAI o3 Mini | 72 | 20598 | 3.5 | 18456 | None |
| OpenAI o4 Mini | 60 | 26445 | 2.3 | 24648 | AttractionsSearch, OpeningHours |
| OpenAI GPT-4.1 | 125 | 11167 | 11.2 | 6804 | AttractionsSearch, OpeningHours |
| OpenAI GPT-4.1 Mini | 153 | 15889 | 9.6 | 8726 | AttractionsSearch, OpeningHours |
| Claude 4 Opus | 74 | 7845 | 9.4 | 5538 | None |
| Claude 4 Sonnet | 284 | 31298 | 9.1 | 11307 | Weather, RestaurantSearch, AttractionsSearch, OpeningHours |
| Claude 3.7 Sonnet | 294 | 30105 | 9.8 | 3860 | AttractionsSearch, OpeningHours |
| Claude 3.5 Haiku | 203 | 20782 | 9.8 | 3655 | AttractionsSearch, OpeningHours |
| Gemini 2.5 Flash | 0 | 0 | 0.0 | 0 | None |
| Gemini 2.5 Pro | 0 | 0 | 0.0 | 0 | None |
| Groq Llama 4 Scout 17B | 25 | 2195 | 11.4 | 1462 | None |
| Groq LLlama 3.3 70B | 26 | 4135 | 6.3 | 3367 | AttractionsSearch, OpeningHours |
| Cerebras Llama 3.3 70B | 0 | 0 | 0.0 | 0 | None |
| Cohere Command R+ | 74 | 22372 | 3.3 | 16211 | AttractionsSearch, OpeningHours |
| Cohere Command A | 0 | 0 | 0.0 | 0 | None |
| Mistral Large | 0 | 4813 | 0.0 | 0 | None |
| Bedrock Claude 3.7 | 63 | 6381 | 9.9 | 3669 | None |
| Bedrock Nova Pro | 79 | 6142 | 12.9 | 4803 | None |
| Bedrock Nova Premier | 448 | 23173 | 19.3 | 4775 | None |
| Deepseek Chat | 327 | 30760 | 10.6 | 15579 | AttractionsSearch, OpeningHours |

#### Turn 4: Based on the weather, restaurants, and attractions...

| Provider | Tokens | Time (ms) | TPS | TTFT (ms) | Tools Used |
|----------|--------|-----------|-----|-----------|------------|
| OpenAI GPT-4o | 291 | 15538 | 18.7 | 4447 | AttractionsSearch, OpeningHours |
| OpenAI GPT-4o Mini | 251 | 11832 | 21.2 | 1957 | None |
| OpenAI o3 Mini | 95 | 14933 | 6.4 | 9759 | None |
| OpenAI o4 Mini | 211 | 39767 | 5.3 | 33418 | None |
| OpenAI GPT-4.1 | 284 | 12480 | 22.8 | 2443 | None |
| OpenAI GPT-4.1 Mini | 276 | 20934 | 13.2 | 5418 | Weather, RestaurantSearch, AttractionsSearch |
| Claude 4 Opus | 260 | 26531 | 9.8 | 10768 | None |
| Claude 4 Sonnet | 414 | 20130 | 20.6 | 7461 | Weather |
| Claude 3.7 Sonnet | 445 | 23223 | 19.2 | 3809 | Weather, AttractionsSearch |
| Claude 3.5 Haiku | 249 | 20247 | 12.3 | 3843 | Weather, AttractionsSearch, RestaurantSearch |
| Gemini 2.5 Flash | 0 | 0 | 0.0 | 0 | None |
| Gemini 2.5 Pro | 0 | 0 | 0.0 | 0 | None |
| Groq Llama 4 Scout 17B | 37 | 3118 | 11.9 | 2025 | None |
| Groq LLlama 3.3 70B | 0 | 0 | 0.0 | 0 | None |
| Cerebras Llama 3.3 70B | 0 | 0 | 0.0 | 0 | None |
| Cohere Command R+ | 192 | 21228 | 9.0 | 7017 | None |
| Cohere Command A | 0 | 0 | 0.0 | 0 | None |
| Mistral Large | 0 | 9690 | 0.0 | 0 | None |
| Bedrock Claude 3.7 | 0 | 0 | 0.0 | 0 | None |
| Bedrock Nova Pro | 94 | 4317 | 21.8 | 2357 | None |
| Bedrock Nova Premier | 662 | 35617 | 18.6 | 9438 | None |
| Deepseek Chat | 524 | 24883 | 21.1 | 5453 | None |


### Error Summary

6 provider(s) experienced errors during testing:

| Provider | Model | Total Errors | Error Rate | Failed Turns |
|----------|-------|--------------|------------|--------------|
| Bedrock Claude 3.7 | CLAUDE_3_7_SONNET | 9 | 225.0% | 1, 1, 1, 2, 2, 2, 4, 4, 4 |
| Gemini 2.5 Flash | GEMINI_2_5_FLASH_PREVIEW | 8 | 200.0% | 1, 1, 2, 2, 3, 3, 4, 4 |
| Gemini 2.5 Pro | GEMINI_2_5_PRO_PREVIEW | 8 | 200.0% | 1, 1, 2, 2, 3, 3, 4, 4 |
| Cerebras Llama 3.3 70B | LLAMA_3_3_70B | 8 | 200.0% | 1, 1, 2, 2, 3, 3, 4, 4 |
| Cohere Command A | COMMAND_A | 8 | 200.0% | 1, 1, 2, 2, 3, 3, 4, 4 |
| Groq LLlama 3.3 70B | LLAMA_3_3_70B | 4 | 100.0% | 1, 1, 4, 4 |

### Detailed Error Messages

**Bedrock Claude 3.7** (CLAUDE_3_7_SONNET):
- Turn 1: Bedrock streaming error: ThrottlingException: Too many requests, please wait before trying again.
- Turn 1: Too many requests, please wait before trying again.
- Turn 1: Too many requests, please wait before trying again.
- Turn 2: Bedrock streaming error: ThrottlingException: Too many requests, please wait before trying again.
- Turn 2: Too many requests, please wait before trying again.
- Turn 2: Too many requests, please wait before trying again.
- Turn 4: Bedrock streaming error: ThrottlingException: Too many tokens, please wait before trying again.
- Turn 4: Too many tokens, please wait before trying again.
- Turn 4: Too many tokens, please wait before trying again.

**Gemini 2.5 Flash** (GEMINI_2_5_FLASH_PREVIEW):
- Turn 1: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:streamGenerateContent?alt=sse: [400 Bad Request] * GenerateContentRequest.tools[0].function_declarations[3].parameters.properties[date].format: only 'enum' and 'date-time' are supported for STRING type

- Turn 1: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:streamGenerateContent?alt=sse: [400 Bad Request] * GenerateContentRequest.tools[0].function_declarations[3].parameters.properties[date].format: only 'enum' and 'date-time' are supported for STRING type

- Turn 2: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:streamGenerateContent?alt=sse: [400 Bad Request] * GenerateContentRequest.tools[0].function_declarations[3].parameters.properties[date].format: only 'enum' and 'date-time' are supported for STRING type

- Turn 2: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:streamGenerateContent?alt=sse: [400 Bad Request] * GenerateContentRequest.tools[0].function_declarations[3].parameters.properties[date].format: only 'enum' and 'date-time' are supported for STRING type

- Turn 3: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:streamGenerateContent?alt=sse: [400 Bad Request] * GenerateContentRequest.tools[0].function_declarations[3].parameters.properties[date].format: only 'enum' and 'date-time' are supported for STRING type

- Turn 3: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:streamGenerateContent?alt=sse: [400 Bad Request] * GenerateContentRequest.tools[0].function_declarations[3].parameters.properties[date].format: only 'enum' and 'date-time' are supported for STRING type

- Turn 4: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:streamGenerateContent?alt=sse: [400 Bad Request] * GenerateContentRequest.tools[0].function_declarations[3].parameters.properties[date].format: only 'enum' and 'date-time' are supported for STRING type

- Turn 4: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:streamGenerateContent?alt=sse: [400 Bad Request] * GenerateContentRequest.tools[0].function_declarations[3].parameters.properties[date].format: only 'enum' and 'date-time' are supported for STRING type


**Gemini 2.5 Pro** (GEMINI_2_5_PRO_PREVIEW):
- Turn 1: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-preview-06-05:streamGenerateContent?alt=sse: [400 Bad Request] * GenerateContentRequest.tools[0].function_declarations[3].parameters.properties[date].format: only 'enum' and 'date-time' are supported for STRING type

- Turn 1: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-preview-06-05:streamGenerateContent?alt=sse: [400 Bad Request] * GenerateContentRequest.tools[0].function_declarations[3].parameters.properties[date].format: only 'enum' and 'date-time' are supported for STRING type

- Turn 2: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-preview-06-05:streamGenerateContent?alt=sse: [400 Bad Request] * GenerateContentRequest.tools[0].function_declarations[3].parameters.properties[date].format: only 'enum' and 'date-time' are supported for STRING type

- Turn 2: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-preview-06-05:streamGenerateContent?alt=sse: [400 Bad Request] * GenerateContentRequest.tools[0].function_declarations[3].parameters.properties[date].format: only 'enum' and 'date-time' are supported for STRING type

- Turn 3: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-preview-06-05:streamGenerateContent?alt=sse: [400 Bad Request] * GenerateContentRequest.tools[0].function_declarations[3].parameters.properties[date].format: only 'enum' and 'date-time' are supported for STRING type

- Turn 3: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-preview-06-05:streamGenerateContent?alt=sse: [400 Bad Request] * GenerateContentRequest.tools[0].function_declarations[3].parameters.properties[date].format: only 'enum' and 'date-time' are supported for STRING type

- Turn 4: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-preview-06-05:streamGenerateContent?alt=sse: [400 Bad Request] * GenerateContentRequest.tools[0].function_declarations[3].parameters.properties[date].format: only 'enum' and 'date-time' are supported for STRING type

- Turn 4: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-preview-06-05:streamGenerateContent?alt=sse: [400 Bad Request] * GenerateContentRequest.tools[0].function_declarations[3].parameters.properties[date].format: only 'enum' and 'date-time' are supported for STRING type


**Cerebras Llama 3.3 70B** (LLAMA_3_3_70B):
- Turn 1: 429 status code (no body)
- Turn 1: 429 status code (no body)
- Turn 2: 429 status code (no body)
- Turn 2: 429 status code (no body)
- Turn 3: 429 status code (no body)
- Turn 3: 429 status code (no body)
- Turn 4: 429 status code (no body)
- Turn 4: 429 status code (no body)

**Cohere Command A** (COMMAND_A):
- Turn 1: BadRequestError
Status code: 400
Body: {}
- Turn 1: BadRequestError
Status code: 400
Body: {}
- Turn 2: BadRequestError
Status code: 400
Body: {}
- Turn 2: BadRequestError
Status code: 400
Body: {}
- Turn 3: BadRequestError
Status code: 400
Body: {}
- Turn 3: BadRequestError
Status code: 400
Body: {}
- Turn 4: BadRequestError
Status code: 400
Body: {}
- Turn 4: BadRequestError
Status code: 400
Body: {}

**Groq LLlama 3.3 70B** (LLAMA_3_3_70B):
- Turn 1: 400 Failed to call a function. Please adjust your prompt. See 'failed_generation' for more details.
- Turn 1: 400 Failed to call a function. Please adjust your prompt. See 'failed_generation' for more details.
- Turn 4: 400 Failed to call a function. Please adjust your prompt. See 'failed_generation' for more details.
- Turn 4: 400 Failed to call a function. Please adjust your prompt. See 'failed_generation' for more details.


**Common Error Patterns:**
- **AWS Bedrock**: 9 errors across 1 model(s) - likely authentication or region issues
- **Cohere**: 8 errors across 1 model(s) - possible tool schema compatibility issues
- **Tool-related**: 16 errors across 2 model(s) - tool execution or formatting issues
- **Other Providers**: 12 errors across 2 model(s)

**Note**: Errors may be due to:
- Rate limiting (429)
- Authentication issues
- Network timeouts
- Tool schema incompatibilities
- Model-specific tool calling limitations
- Insufficient context or token limits

Consider running failed providers individually with debug logging enabled for detailed error analysis.
## Key Insights

### Speed Leaders (Tokens Per Second)
1. **Bedrock Nova Pro** - 25.1 TPS
2. **Bedrock Nova Premier** - 18.1 TPS
3. **OpenAI GPT-4o Mini** - 16.4 TPS

### Responsiveness Leaders (Time to First Token)
1. **Gemini 2.5 Flash** - 0ms average TTFT
2. **Gemini 2.5 Pro** - 0ms average TTFT
3. **Cerebras Llama 3.3 70B** - 0ms average TTFT

### Tool Calling Champions
1. **OpenAI o3 Mini** - 0ms average tool execution
2. **Groq Llama 4 Scout 17B** - 0ms average tool execution
3. **Groq LLlama 3.3 70B** - 0ms average tool execution

### Tool Usage Patterns

| Provider | Total Tool Calls | Unique Tools Used |
|----------|-----------------|-------------------|
| OpenAI GPT-4o | 14 | 4 |
| Claude 3.5 Haiku | 12 | 4 |
| OpenAI GPT-4.1 Mini | 11 | 4 |
| Claude 4 Sonnet | 11 | 4 |
| Cohere Command R+ | 11 | 4 |
| Claude 3.7 Sonnet | 10 | 4 |
| OpenAI GPT-4o Mini | 8 | 4 |
| OpenAI o4 Mini | 8 | 4 |
| OpenAI GPT-4.1 | 8 | 4 |
| Deepseek Chat | 8 | 4 |
| Groq LLlama 3.3 70B | 4 | 3 |
| Bedrock Claude 3.7 | 4 | 0 |
| Cerebras Llama 3.3 70B | 3 | 0 |
| OpenAI o3 Mini | 2 | 2 |
| Claude 4 Opus | 2 | 2 |
| Groq Llama 4 Scout 17B | 2 | 2 |
| Bedrock Nova Pro | 1 | 1 |
| Bedrock Nova Premier | 1 | 1 |

## Test Environment
- Date: 2025-06-15T21:25:23.437Z
- Region: us-east-1 (for AWS Bedrock)
- Connection: Streaming enabled for all providers
- Temperature: 0.7 (consistent across all models)
- Tools: 4 custom tools (Weather, RestaurantSearch, AttractionsSearch, OpeningHours)

## Methodology
- Each provider ran the same 4-turn conversation with tool calling
- Metrics collected include tokens per second (TPS), time to first token (TTFT), tool execution time, and total processing time
- All tests run sequentially to avoid network congestion
- Tool calls are mocked but still go through the full execution pipeline
- Error handling included to capture failed turns and tool calls

---
*Generated by Graphlit TypeScript SDK Multi-turn Comparison Test with Tools*

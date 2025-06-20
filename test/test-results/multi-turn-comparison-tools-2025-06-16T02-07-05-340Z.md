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
- **Total Errors**: 32
- **Average Errors per Provider**: 1.5

## Performance Metrics

### Overall Performance Ranking

| Rank | Provider               | Model                    | Avg TPS | Avg TTFT (ms) | Total Time (s) | Total Tokens | Tool Calls | Avg Tool Time (ms) | Errors |
| ---- | ---------------------- | ------------------------ | ------- | ------------- | -------------- | ------------ | ---------- | ------------------ | ------ |
| 1    | Bedrock Nova Pro       | NOVA_PRO                 | 26.4    | 1469          | 31.5           | 832          | 2          | 1                  | 2      |
| 2    | OpenAI GPT-4o Mini     | GPT4O_MINI_128K          | 17.0    | 3128          | 32.3           | 551          | 8          | 0                  | 0      |
| 3    | Groq Llama 4 Scout 17B | LLAMA_4_SCOUT_17B        | 14.9    | 1568          | 11.3           | 168          | 1          | 1                  | 0      |
| 4    | OpenAI GPT-4o          | GPT4O_128K               | 13.6    | 5390          | 40.5           | 550          | 14         | 0                  | 0      |
| 5    | Bedrock Nova Premier   | NOVA_PREMIER             | 12.7    | 9727          | 109.5          | 1386         | 2          | 1                  | 0      |
| 6    | OpenAI GPT-4.1         | GPT41_1024K              | 11.7    | 7139          | 55.2           | 645          | 8          | 0                  | 0      |
| 7    | Deepseek Chat          | CHAT                     | 11.0    | 14677         | 109.1          | 1198         | 8          | 685                | 0      |
| 8    | OpenAI GPT-4.1 Mini    | GPT41_MINI_1024K         | 10.9    | 5325          | 32.2           | 351          | 11         | 0                  | 0      |
| 9    | Claude 4 Opus          | CLAUDE_4_OPUS            | 10.5    | 6707          | 110.1          | 1160         | 9          | 28                 | 0      |
| 10   | Claude 3.7 Sonnet      | CLAUDE_3_7_SONNET        | 9.8     | 6099          | 109.9          | 1077         | 9          | 32                 | 0      |
| 11   | Claude 3.5 Haiku       | CLAUDE_3_5_HAIKU         | 9.3     | 7526          | 88.5           | 827          | 6          | 23                 | 0      |
| 12   | Claude 4 Sonnet        | CLAUDE_4_SONNET          | 7.8     | 20731         | 117.8          | 921          | 7          | 25                 | 0      |
| 13   | Mistral Large          | MISTRAL_LARGE            | 6.0     | 5957          | 75.4           | 453          | 0          | 0                  | 0      |
| 14   | Groq LLlama 3.3 70B    | LLAMA_3_3_70B            | 5.8     | 2106          | 16.1           | 94           | 1          | 0                  | 4      |
| 15   | Gemini 2.5 Flash       | GEMINI_2_5_FLASH_PREVIEW | 4.6     | 8577          | 42.8           | 196          | 12         | 5                  | 0      |
| 16   | OpenAI o3 Mini         | O3_MINI_200K             | 4.4     | 22863         | 105.2          | 459          | 2          | 0                  | 0      |
| 17   | Gemini 2.5 Pro         | GEMINI_2_5_PRO_PREVIEW   | 4.3     | 17040         | 79.0           | 343          | 6          | 9                  | 0      |
| 18   | OpenAI o4 Mini         | O4_MINI_200K             | 3.9     | 33956         | 176.8          | 693          | 8          | 0                  | 0      |
| 19   | Cohere Command A       | COMMAND_A                | 1.5     | 2460          | 19.2           | 28           | 2          | 7                  | 4      |
| 20   | Cerebras Llama 3.3 70B | LLAMA_3_3_70B            | 0.7     | 1894          | 47.4           | 34           | 60         | 0                  | 2      |
| 21   | Cohere Command R+      | COMMAND_R_PLUS           | 0.0     | 0             | 32.8           | 0            | 6          | 244                | 8      |
| 22   | Bedrock Claude 3.7     | CLAUDE_3_7_SONNET        | 0.0     | 0             | 31.4           | 0            | 5          | 1                  | 12     |

### Time to First Token (TTFT) Ranking

| Rank | Provider               | Avg TTFT (ms) | Min TTFT | Max TTFT |
| ---- | ---------------------- | ------------- | -------- | -------- |
| 1    | Cohere Command R+      | 0             | 0        | 0        |
| 2    | Bedrock Claude 3.7     | 0             | 0        | 0        |
| 3    | Bedrock Nova Pro       | 1469          | 0        | 2109     |
| 4    | Groq Llama 4 Scout 17B | 1568          | 1215     | 2039     |
| 5    | Cerebras Llama 3.3 70B | 1894          | 0        | 4469     |
| 6    | Groq LLlama 3.3 70B    | 2106          | 0        | 6879     |
| 7    | Cohere Command A       | 2460          | 0        | 5241     |
| 8    | OpenAI GPT-4o Mini     | 3128          | 2071     | 4636     |
| 9    | OpenAI GPT-4.1 Mini    | 5325          | 2647     | 10042    |
| 10   | OpenAI GPT-4o          | 5390          | 2780     | 6945     |
| 11   | Mistral Large          | 5957          | 0        | 14551    |
| 12   | Claude 3.7 Sonnet      | 6099          | 2450     | 8458     |
| 13   | Claude 4 Opus          | 6707          | 4197     | 12314    |
| 14   | OpenAI GPT-4.1         | 7139          | 3530     | 9461     |
| 15   | Claude 3.5 Haiku       | 7526          | 2430     | 10471    |
| 16   | Gemini 2.5 Flash       | 8577          | 7131     | 9745     |
| 17   | Bedrock Nova Premier   | 9727          | 6864     | 13041    |
| 18   | Deepseek Chat          | 14677         | 6450     | 20847    |
| 19   | Gemini 2.5 Pro         | 17040         | 10766    | 26688    |
| 20   | Claude 4 Sonnet        | 20731         | 2755     | 43869    |
| 21   | OpenAI o3 Mini         | 22863         | 12758    | 33461    |
| 22   | OpenAI o4 Mini         | 33956         | 8409     | 61879    |

### Tool Calling Performance

| Rank | Provider               | Tool Calls | Avg Tool Time (ms) | Min Tool Time | Max Tool Time |
| ---- | ---------------------- | ---------- | ------------------ | ------------- | ------------- |
| 1    | OpenAI o3 Mini         | 2          | 0                  | 0             | 0             |
| 2    | OpenAI GPT-4.1 Mini    | 11         | 0                  | 0             | 0             |
| 3    | Groq LLlama 3.3 70B    | 1          | 0                  | 0             | 0             |
| 4    | OpenAI GPT-4o Mini     | 8          | 0                  | 0             | 1             |
| 5    | OpenAI o4 Mini         | 8          | 0                  | 0             | 1             |
| 6    | OpenAI GPT-4.1         | 8          | 0                  | 0             | 1             |
| 7    | OpenAI GPT-4o          | 14         | 0                  | 0             | 1             |
| 8    | Cerebras Llama 3.3 70B | 60         | 0                  | 0             | 1             |
| 9    | Bedrock Claude 3.7     | 5          | 1                  | 0             | 2             |
| 10   | Groq Llama 4 Scout 17B | 1          | 1                  | 1             | 1             |
| 11   | Bedrock Nova Pro       | 2          | 1                  | 1             | 1             |
| 12   | Bedrock Nova Premier   | 2          | 1                  | 1             | 1             |
| 13   | Gemini 2.5 Flash       | 12         | 5                  | 1             | 9             |
| 14   | Cohere Command A       | 2          | 7                  | 3             | 11            |
| 15   | Gemini 2.5 Pro         | 6          | 9                  | 7             | 14            |
| 16   | Claude 3.5 Haiku       | 6          | 23                 | 6             | 36            |
| 17   | Claude 4 Sonnet        | 7          | 25                 | 14            | 30            |
| 18   | Claude 4 Opus          | 9          | 28                 | 10            | 97            |
| 19   | Claude 3.7 Sonnet      | 9          | 32                 | 16            | 68            |
| 20   | Cohere Command R+      | 6          | 244                | 3             | 367           |
| 21   | Deepseek Chat          | 8          | 685                | 407           | 865           |

### Per-Turn Performance Details

#### Turn 1: Hi! I'm planning a trip to Tokyo next month. What'...

Expected tools: Weather

| Provider               | Tokens | Time (ms) | TPS  | TTFT (ms) | Tools Used |
| ---------------------- | ------ | --------- | ---- | --------- | ---------- |
| OpenAI GPT-4o          | 60     | 4570      | 13.1 | 2780      | Weather    |
| OpenAI GPT-4o Mini     | 60     | 3888      | 15.4 | 2071      | Weather    |
| OpenAI o3 Mini         | 44     | 14080     | 3.1  | 12758     | Weather    |
| OpenAI o4 Mini         | 103    | 23164     | 4.4  | 19221     | Weather    |
| OpenAI GPT-4.1         | 52     | 5067      | 10.3 | 3530      | Weather    |
| OpenAI GPT-4.1 Mini    | 69     | 4709      | 14.7 | 2647      | Weather    |
| Claude 4 Opus          | 202    | 15342     | 13.2 | 4197      | Weather    |
| Claude 4 Sonnet        | 168    | 10413     | 16.1 | 2755      | Weather    |
| Claude 3.7 Sonnet      | 177    | 8948      | 19.8 | 2450      | Weather    |
| Claude 3.5 Haiku       | 160    | 9169      | 17.5 | 2430      | Weather    |
| Gemini 2.5 Flash       | 28     | 9624      | 2.9  | 8768      | Weather    |
| Gemini 2.5 Pro         | 20     | 12759     | 1.6  | 12167     | Weather    |
| Groq Llama 4 Scout 17B | 89     | 4358      | 20.4 | 1701      | None       |
| Groq LLlama 3.3 70B    | 0      | 0         | 0.0  | 0         | None       |
| Cerebras Llama 3.3 70B | 13     | 2251      | 5.8  | 1866      | Weather    |
| Cohere Command R+      | 0      | 0         | 0.0  | 0         | None       |
| Cohere Command A       | 0      | 0         | 0.0  | 0         | None       |
| Mistral Large          | 0      | 6516      | 0.0  | 0         | None       |
| Bedrock Claude 3.7     | 0      | 0         | 0.0  | 0         | None       |
| Bedrock Nova Pro       | 184    | 5274      | 34.9 | 1901      | Weather    |
| Bedrock Nova Premier   | 303    | 23566     | 12.9 | 11623     | Weather    |
| Deepseek Chat          | 115    | 11011     | 10.4 | 6450      | Weather    |

#### Turn 2: Great! Can you find me some highly-rated vegetaria...

Expected tools: RestaurantSearch

| Provider               | Tokens | Time (ms) | TPS  | TTFT (ms) | Tools Used       |
| ---------------------- | ------ | --------- | ---- | --------- | ---------------- |
| OpenAI GPT-4o          | 96     | 8151      | 11.8 | 5259      | RestaurantSearch |
| OpenAI GPT-4o Mini     | 76     | 6238      | 12.2 | 3014      | RestaurantSearch |
| OpenAI o3 Mini         | 63     | 22929     | 2.7  | 21052     | RestaurantSearch |
| OpenAI o4 Mini         | 89     | 12350     | 7.2  | 8409      | RestaurantSearch |
| OpenAI GPT-4.1         | 77     | 11757     | 6.5  | 9461      | RestaurantSearch |
| OpenAI GPT-4.1 Mini    | 59     | 5652      | 10.4 | 3589      | RestaurantSearch |
| Claude 4 Opus          | 231    | 25387     | 9.1  | 5482      | RestaurantSearch |
| Claude 4 Sonnet        | 191    | 24062     | 7.9  | 17643     | RestaurantSearch |
| Claude 3.7 Sonnet      | 182    | 18102     | 10.1 | 6179      | RestaurantSearch |
| Claude 3.5 Haiku       | 152    | 24877     | 6.1  | 8921      | RestaurantSearch |
| Gemini 2.5 Flash       | 37     | 8235      | 4.5  | 7131      | RestaurantSearch |
| Gemini 2.5 Pro         | 63     | 12994     | 4.8  | 10766     | RestaurantSearch |
| Groq Llama 4 Scout 17B | 19     | 2585      | 7.4  | 2039      | RestaurantSearch |
| Groq LLlama 3.3 70B    | 22     | 2181      | 10.1 | 1543      | RestaurantSearch |
| Cerebras Llama 3.3 70B | 10     | 1519      | 6.6  | 1239      | None             |
| Cohere Command R+      | 0      | 0         | 0.0  | 0         | None             |
| Cohere Command A       | 0      | 0         | 0.0  | 0         | None             |
| Mistral Large          | 0      | 6253      | 0.0  | 0         | None             |
| Bedrock Claude 3.7     | 0      | 0         | 0.0  | 0         | None             |
| Bedrock Nova Pro       | 228    | 6249      | 36.5 | 1866      | RestaurantSearch |
| Bedrock Nova Premier   | 370    | 34215     | 10.8 | 6864      | RestaurantSearch |
| Deepseek Chat          | 181    | 25566     | 7.1  | 18131     | RestaurantSearch |

#### Turn 3: What are the top tourist attractions I should visi...

Expected tools: AttractionsSearch, OpeningHours

| Provider               | Tokens | Time (ms) | TPS  | TTFT (ms) | Tools Used                                        |
| ---------------------- | ------ | --------- | ---- | --------- | ------------------------------------------------- |
| OpenAI GPT-4o          | 119    | 12957     | 9.2  | 6945      | AttractionsSearch, OpeningHours                   |
| OpenAI GPT-4o Mini     | 145    | 11295     | 12.8 | 4636      | AttractionsSearch, OpeningHours                   |
| OpenAI o3 Mini         | 121    | 37101     | 3.3  | 33461     | None                                              |
| OpenAI o4 Mini         | 110    | 53907     | 2.0  | 46313     | AttractionsSearch, OpeningHours                   |
| OpenAI GPT-4.1         | 88     | 11807     | 7.5  | 9083      | AttractionsSearch, OpeningHours                   |
| OpenAI GPT-4.1 Mini    | 80     | 7424      | 10.8 | 5020      | AttractionsSearch, OpeningHours                   |
| Claude 4 Opus          | 256    | 30149     | 8.5  | 4834      | AttractionsSearch, OpeningHours                   |
| Claude 4 Sonnet        | 193    | 25471     | 7.6  | 18655     | RestaurantSearch                                  |
| Claude 3.7 Sonnet      | 248    | 51363     | 4.8  | 8458      | AttractionsSearch, OpeningHours                   |
| Claude 3.5 Haiku       | 202    | 33086     | 6.1  | 8283      | AttractionsSearch, OpeningHours                   |
| Gemini 2.5 Flash       | 38     | 9798      | 3.9  | 8662      | AttractionsSearch, OpeningHours                   |
| Gemini 2.5 Pro         | 74     | 28902     | 2.6  | 26688     | AttractionsSearch, OpeningHours                   |
| Groq Llama 4 Scout 17B | 20     | 1793      | 11.2 | 1215      | None                                              |
| Groq LLlama 3.3 70B    | 0      | 0         | 0.0  | 0         | None                                              |
| Cerebras Llama 3.3 70B | 11     | 4800      | 2.3  | 4469      | AttractionsSearch, OpeningHours, RestaurantSearch |
| Cohere Command R+      | 0      | 0         | 0.0  | 0         | None                                              |
| Cohere Command A       | 14     | 5745      | 2.4  | 4597      | None                                              |
| Mistral Large          | 33     | 12598     | 2.6  | 9277      | None                                              |
| Bedrock Claude 3.7     | 0      | 0         | 0.0  | 0         | None                                              |
| Bedrock Nova Pro       | 0      | 0         | 0.0  | 0         | None                                              |
| Bedrock Nova Premier   | 286    | 20412     | 14.0 | 7379      | None                                              |
| Deepseek Chat          | 299    | 34639     | 8.6  | 20847     | AttractionsSearch, OpeningHours                   |

#### Turn 4: Based on the weather, restaurants, and attractions...

| Provider               | Tokens | Time (ms) | TPS  | TTFT (ms) | Tools Used                                   |
| ---------------------- | ------ | --------- | ---- | --------- | -------------------------------------------- |
| OpenAI GPT-4o          | 275    | 14854     | 18.5 | 6575      | AttractionsSearch, OpeningHours              |
| OpenAI GPT-4o Mini     | 270    | 10925     | 24.7 | 2790      | None                                         |
| OpenAI o3 Mini         | 231    | 31128     | 7.4  | 24181     | None                                         |
| OpenAI o4 Mini         | 391    | 87340     | 4.5  | 61879     | None                                         |
| OpenAI GPT-4.1         | 428    | 26553     | 16.1 | 6480      | None                                         |
| OpenAI GPT-4.1 Mini    | 143    | 14369     | 10.0 | 10042     | Weather, RestaurantSearch, AttractionsSearch |
| Claude 4 Opus          | 471    | 39263     | 12.0 | 12314     | Weather                                      |
| Claude 4 Sonnet        | 369    | 57839     | 6.4  | 43869     | AttractionsSearch, OpeningHours              |
| Claude 3.7 Sonnet      | 470    | 31467     | 14.9 | 7307      | Weather                                      |
| Claude 3.5 Haiku       | 313    | 21349     | 14.7 | 10471     | None                                         |
| Gemini 2.5 Flash       | 93     | 15138     | 6.1  | 9745      | None                                         |
| Gemini 2.5 Pro         | 186    | 24333     | 7.6  | 18539     | None                                         |
| Groq Llama 4 Scout 17B | 40     | 2515      | 15.9 | 1316      | None                                         |
| Groq LLlama 3.3 70B    | 72     | 9028      | 8.0  | 6879      | None                                         |
| Cerebras Llama 3.3 70B | 0      | 0         | 0.0  | 0         | None                                         |
| Cohere Command R+      | 0      | 0         | 0.0  | 0         | None                                         |
| Cohere Command A       | 14     | 8944      | 1.6  | 5241      | None                                         |
| Mistral Large          | 420    | 50061     | 8.4  | 14551     | None                                         |
| Bedrock Claude 3.7     | 0      | 0         | 0.0  | 0         | None                                         |
| Bedrock Nova Pro       | 420    | 10008     | 42.0 | 2109      | None                                         |
| Bedrock Nova Premier   | 427    | 31273     | 13.7 | 13041     | None                                         |
| Deepseek Chat          | 603    | 37853     | 15.9 | 13278     | None                                         |

### Error Summary

6 provider(s) experienced errors during testing:

| Provider               | Model             | Total Errors | Error Rate | Failed Turns                       |
| ---------------------- | ----------------- | ------------ | ---------- | ---------------------------------- |
| Bedrock Claude 3.7     | CLAUDE_3_7_SONNET | 12           | 300.0%     | 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4 |
| Cohere Command R+      | COMMAND_R_PLUS    | 8            | 200.0%     | 1, 1, 2, 2, 3, 3, 4, 4             |
| Groq LLlama 3.3 70B    | LLAMA_3_3_70B     | 4            | 100.0%     | 1, 1, 3, 3                         |
| Cohere Command A       | COMMAND_A         | 4            | 100.0%     | 1, 1, 2, 2                         |
| Cerebras Llama 3.3 70B | LLAMA_3_3_70B     | 2            | 50.0%      | 4, 4                               |
| Bedrock Nova Pro       | NOVA_PRO          | 2            | 50.0%      | 3, 3                               |

### Detailed Error Messages

**Bedrock Claude 3.7** (CLAUDE_3_7_SONNET):

- Turn 1: Bedrock rate limit: Too many requests, please wait before trying again.
- Turn 1: Too many requests, please wait before trying again.
- Turn 1: Too many requests, please wait before trying again.
- Turn 2: Bedrock rate limit: Too many requests, please wait before trying again.
- Turn 2: Too many requests, please wait before trying again.
- Turn 2: Too many requests, please wait before trying again.
- Turn 3: Bedrock rate limit: Too many requests, please wait before trying again.
- Turn 3: Too many requests, please wait before trying again.
- Turn 3: Too many requests, please wait before trying again.
- Turn 4: Bedrock rate limit: Too many requests, please wait before trying again.
- Turn 4: Too many requests, please wait before trying again.
- Turn 4: Too many requests, please wait before trying again.

**Cohere Command R+** (COMMAND_R_PLUS):

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

- Turn 1: Groq tool calling error: 400 Failed to call a function. Please adjust your prompt. See 'failed_generation' for more details.. The model may not support the provided tool schema format.
- Turn 1: Groq tool calling error: 400 Failed to call a function. Please adjust your prompt. See 'failed_generation' for more details.. The model may not support the provided tool schema format.
- Turn 3: Groq tool calling error: 400 Failed to call a function. Please adjust your prompt. See 'failed_generation' for more details.. The model may not support the provided tool schema format.
- Turn 3: Groq tool calling error: 400 Failed to call a function. Please adjust your prompt. See 'failed_generation' for more details.. The model may not support the provided tool schema format.

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

**Cerebras Llama 3.3 70B** (LLAMA_3_3_70B):

- Turn 4: 400 status code (no body)
- Turn 4: 400 status code (no body)

**Bedrock Nova Pro** (NOVA_PRO):

- Turn 3: fetch failed
- Turn 3: fetch failed

**Common Error Patterns:**

- **AWS Bedrock**: 14 errors across 2 model(s) - likely authentication or region issues
- **Cohere**: 12 errors across 2 model(s) - possible tool schema compatibility issues
- **Tool-related**: 4 errors across 1 model(s) - tool execution or formatting issues
- **Other Providers**: 2 errors across 1 model(s)

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

1. **Bedrock Nova Pro** - 26.4 TPS
2. **OpenAI GPT-4o Mini** - 17.0 TPS
3. **Groq Llama 4 Scout 17B** - 14.9 TPS

### Responsiveness Leaders (Time to First Token)

1. **Cohere Command R+** - 0ms average TTFT
2. **Bedrock Claude 3.7** - 0ms average TTFT
3. **Bedrock Nova Pro** - 1469ms average TTFT

### Tool Calling Champions

1. **OpenAI o3 Mini** - 0ms average tool execution
2. **OpenAI GPT-4.1 Mini** - 0ms average tool execution
3. **Groq LLlama 3.3 70B** - 0ms average tool execution

### Tool Usage Patterns

| Provider               | Total Tool Calls | Unique Tools Used |
| ---------------------- | ---------------- | ----------------- |
| Cerebras Llama 3.3 70B | 60               | 4                 |
| OpenAI GPT-4o          | 14               | 4                 |
| Gemini 2.5 Flash       | 12               | 4                 |
| OpenAI GPT-4.1 Mini    | 11               | 4                 |
| Claude 4 Opus          | 9                | 4                 |
| Claude 3.7 Sonnet      | 9                | 4                 |
| OpenAI GPT-4o Mini     | 8                | 4                 |
| OpenAI o4 Mini         | 8                | 4                 |
| OpenAI GPT-4.1         | 8                | 4                 |
| Deepseek Chat          | 8                | 4                 |
| Claude 4 Sonnet        | 7                | 4                 |
| Claude 3.5 Haiku       | 6                | 4                 |
| Gemini 2.5 Pro         | 6                | 4                 |
| Cohere Command R+      | 6                | 0                 |
| Bedrock Claude 3.7     | 5                | 0                 |
| OpenAI o3 Mini         | 2                | 2                 |
| Cohere Command A       | 2                | 0                 |
| Bedrock Nova Pro       | 2                | 2                 |
| Bedrock Nova Premier   | 2                | 2                 |
| Groq Llama 4 Scout 17B | 1                | 1                 |
| Groq LLlama 3.3 70B    | 1                | 1                 |

## Test Environment

- Date: 2025-06-16T02:07:05.340Z
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

_Generated by Graphlit TypeScript SDK Multi-turn Comparison Test with Tools_

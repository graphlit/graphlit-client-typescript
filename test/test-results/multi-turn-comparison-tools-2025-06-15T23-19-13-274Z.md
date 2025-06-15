# Multi-turn Conversation Performance Comparison (WITH TOOLS)

## Test Scenario

A 4-turn conversation about planning a trip to Tokyo, using tools for:

1. Weather lookup
2. Restaurant search (vegetarian with nut allergy)
3. Tourist attractions and opening hours
4. Creating a detailed 3-day itinerary

## Summary Statistics

- **Total Providers Tested**: 22
- **Providers with Errors**: 8 (36.4%)
- **Total Errors**: 48
- **Average Errors per Provider**: 2.2

## Performance Metrics

### Overall Performance Ranking

| Rank | Provider               | Model                    | Avg TPS | Avg TTFT (ms) | Total Time (s) | Total Tokens | Tool Calls | Avg Tool Time (ms) | Errors |
| ---- | ---------------------- | ------------------------ | ------- | ------------- | -------------- | ------------ | ---------- | ------------------ | ------ |
| 1    | Bedrock Nova Pro       | NOVA_PRO                 | 32.3    | 2150          | 23.0           | 743          | 2          | 0                  | 0      |
| 2    | OpenAI GPT-4o Mini     | GPT4O_MINI_128K          | 16.3    | 3350          | 30.9           | 502          | 8          | 0                  | 0      |
| 3    | OpenAI GPT-4o          | GPT4O_128K               | 14.4    | 5271          | 37.4           | 537          | 12         | 1                  | 0      |
| 4    | Bedrock Nova Premier   | NOVA_PREMIER             | 13.3    | 2112          | 52.4           | 699          | 2          | 1                  | 3      |
| 5    | Deepseek Chat          | CHAT                     | 11.8    | 12582         | 97.7           | 1149         | 8          | 561                | 0      |
| 6    | Groq Llama 4 Scout 17B | LLAMA_4_SCOUT_17B        | 10.1    | 1442          | 8.1            | 82           | 2          | 0                  | 0      |
| 7    | Claude 3.7 Sonnet      | CLAUDE_3_7_SONNET        | 9.7     | 6122          | 99.8           | 968          | 9          | 20                 | 0      |
| 8    | OpenAI GPT-4.1         | GPT41_1024K              | 9.0     | 7849          | 57.6           | 517          | 8          | 1                  | 0      |
| 9    | OpenAI GPT-4.1 Mini    | GPT41_MINI_1024K         | 8.3     | 7694          | 64.4           | 537          | 14         | 0                  | 0      |
| 10   | Claude 4 Sonnet        | CLAUDE_4_SONNET          | 8.2     | 19978         | 116.2          | 955          | 10         | 25                 | 0      |
| 11   | Bedrock Claude 3.7     | CLAUDE_3_7_SONNET        | 7.2     | 511           | 29.9           | 216          | 2          | 1                  | 9      |
| 12   | Claude 3.5 Haiku       | CLAUDE_3_5_HAIKU         | 7.1     | 6035          | 99.7           | 703          | 10         | 19                 | 0      |
| 13   | Gemini 2.5 Flash       | GEMINI_2_5_FLASH_PREVIEW | 5.9     | 8692          | 43.9           | 258          | 15         | 4                  | 0      |
| 14   | Gemini 2.5 Pro         | GEMINI_2_5_PRO_PREVIEW   | 5.6     | 18880         | 95.5           | 534          | 7          | 1                  | 0      |
| 15   | OpenAI o3 Mini         | O3_MINI_200K             | 4.8     | 16918         | 79.2           | 384          | 2          | 0                  | 0      |
| 16   | Claude 4 Opus          | CLAUDE_4_OPUS            | 2.4     | 3831          | 151.3          | 369          | 3          | 26                 | 4      |
| 17   | Groq LLlama 3.3 70B    | LLAMA_3_3_70B            | 1.8     | 419           | 13.1           | 23           | 1          | 0                  | 6      |
| 18   | OpenAI o4 Mini         | O4_MINI_200K             | 1.7     | 9470          | 90.3           | 157          | 8          | 0                  | 2      |
| 19   | Mistral Large          | MISTRAL_LARGE            | 1.0     | 6036          | 96.6           | 99           | 0          | 0                  | 0      |
| 20   | Cerebras Llama 3.3 70B | LLAMA_3_3_70B            | 0.0     | 0             | 10.3           | 0            | 0          | 0                  | 8      |
| 21   | Cohere Command R+      | COMMAND_R_PLUS           | 0.0     | 0             | 4.6            | 0            | 0          | 0                  | 8      |
| 22   | Cohere Command A       | COMMAND_A                | 0.0     | 0             | 4.2            | 0            | 0          | 0                  | 8      |

### Time to First Token (TTFT) Ranking

| Rank | Provider               | Avg TTFT (ms) | Min TTFT | Max TTFT |
| ---- | ---------------------- | ------------- | -------- | -------- |
| 1    | Cerebras Llama 3.3 70B | 0             | 0        | 0        |
| 2    | Cohere Command R+      | 0             | 0        | 0        |
| 3    | Cohere Command A       | 0             | 0        | 0        |
| 4    | Groq LLlama 3.3 70B    | 419           | 0        | 1675     |
| 5    | Bedrock Claude 3.7     | 511           | 0        | 2043     |
| 6    | Groq Llama 4 Scout 17B | 1442          | 1183     | 1778     |
| 7    | Bedrock Nova Premier   | 2112          | 0        | 3982     |
| 8    | Bedrock Nova Pro       | 2150          | 1686     | 2966     |
| 9    | OpenAI GPT-4o Mini     | 3350          | 2562     | 5094     |
| 10   | Claude 4 Opus          | 3831          | 0        | 10056    |
| 11   | OpenAI GPT-4o          | 5271          | 3054     | 7545     |
| 12   | Claude 3.5 Haiku       | 6035          | 2013     | 8667     |
| 13   | Mistral Large          | 6036          | 0        | 14879    |
| 14   | Claude 3.7 Sonnet      | 6122          | 1740     | 9192     |
| 15   | OpenAI GPT-4.1 Mini    | 7694          | 3703     | 12736    |
| 16   | OpenAI GPT-4.1         | 7849          | 3371     | 16109    |
| 17   | Gemini 2.5 Flash       | 8692          | 4440     | 15771    |
| 18   | OpenAI o4 Mini         | 9470          | 0        | 22891    |
| 19   | Deepseek Chat          | 12582         | 6850     | 20349    |
| 20   | OpenAI o3 Mini         | 16918         | 12981    | 21030    |
| 21   | Gemini 2.5 Pro         | 18880         | 6157     | 29500    |
| 22   | Claude 4 Sonnet        | 19978         | 2814     | 44993    |

### Tool Calling Performance

| Rank | Provider               | Tool Calls | Avg Tool Time (ms) | Min Tool Time | Max Tool Time |
| ---- | ---------------------- | ---------- | ------------------ | ------------- | ------------- |
| 1    | OpenAI o3 Mini         | 2          | 0                  | 0             | 0             |
| 2    | Groq Llama 4 Scout 17B | 2          | 0                  | 0             | 0             |
| 3    | Groq LLlama 3.3 70B    | 1          | 0                  | 0             | 0             |
| 4    | Bedrock Nova Pro       | 2          | 0                  | 0             | 0             |
| 5    | OpenAI GPT-4.1 Mini    | 14         | 0                  | 0             | 1             |
| 6    | OpenAI GPT-4o Mini     | 8          | 0                  | 0             | 1             |
| 7    | OpenAI o4 Mini         | 8          | 0                  | 0             | 1             |
| 8    | OpenAI GPT-4.1         | 8          | 1                  | 0             | 1             |
| 9    | Bedrock Claude 3.7     | 2          | 1                  | 0             | 1             |
| 10   | OpenAI GPT-4o          | 12         | 1                  | 0             | 1             |
| 11   | Bedrock Nova Premier   | 2          | 1                  | 1             | 1             |
| 12   | Gemini 2.5 Pro         | 7          | 1                  | 0             | 5             |
| 13   | Gemini 2.5 Flash       | 15         | 4                  | 2             | 6             |
| 14   | Claude 3.5 Haiku       | 10         | 19                 | 13            | 30            |
| 15   | Claude 3.7 Sonnet      | 9          | 20                 | 8             | 34            |
| 16   | Claude 4 Sonnet        | 10         | 25                 | 0             | 48            |
| 17   | Claude 4 Opus          | 3          | 26                 | 16            | 34            |
| 18   | Deepseek Chat          | 8          | 561                | 514           | 889           |

### Per-Turn Performance Details

#### Turn 1: Hi! I'm planning a trip to Tokyo next month. What'...

Expected tools: Weather

| Provider               | Tokens | Time (ms) | TPS  | TTFT (ms) | Tools Used                 |
| ---------------------- | ------ | --------- | ---- | --------- | -------------------------- |
| OpenAI GPT-4o          | 81     | 5477      | 14.8 | 3054      | Weather                    |
| OpenAI GPT-4o Mini     | 49     | 4242      | 11.6 | 2785      | Weather                    |
| OpenAI o3 Mini         | 45     | 14340     | 3.1  | 12981     | Weather                    |
| OpenAI o4 Mini         | 40     | 9782      | 4.1  | 8596      | Weather                    |
| OpenAI GPT-4.1         | 72     | 5820      | 12.4 | 3677      | Weather                    |
| OpenAI GPT-4.1 Mini    | 49     | 5923      | 8.3  | 4470      | Weather                    |
| Claude 4 Opus          | 168    | 20823     | 8.1  | 10056     | Weather                    |
| Claude 4 Sonnet        | 152    | 9783      | 15.5 | 2814      | Weather                    |
| Claude 3.7 Sonnet      | 177    | 9057      | 19.5 | 1740      | Weather                    |
| Claude 3.5 Haiku       | 175    | 10622     | 16.5 | 2013      | Weather, AttractionsSearch |
| Gemini 2.5 Flash       | 87     | 10423     | 8.3  | 7555      | Weather                    |
| Gemini 2.5 Pro         | 204    | 16133     | 12.6 | 6157      | Weather                    |
| Groq Llama 4 Scout 17B | 14     | 1991      | 7.0  | 1588      | Weather                    |
| Groq LLlama 3.3 70B    | 0      | 0         | 0.0  | 0         | None                       |
| Cerebras Llama 3.3 70B | 0      | 0         | 0.0  | 0         | None                       |
| Cohere Command R+      | 0      | 0         | 0.0  | 0         | None                       |
| Cohere Command A       | 0      | 0         | 0.0  | 0         | None                       |
| Mistral Large          | 0      | 4475      | 0.0  | 0         | None                       |
| Bedrock Claude 3.7     | 216    | 11297     | 19.1 | 2043      | Weather                    |
| Bedrock Nova Pro       | 339    | 6609      | 51.3 | 1686      | Weather                    |
| Bedrock Nova Premier   | 211    | 12126     | 17.4 | 2057      | Weather                    |
| Deepseek Chat          | 111    | 11832     | 9.4  | 6850      | Weather                    |

#### Turn 2: Great! Can you find me some highly-rated vegetaria...

Expected tools: RestaurantSearch

| Provider               | Tokens | Time (ms) | TPS  | TTFT (ms) | Tools Used                |
| ---------------------- | ------ | --------- | ---- | --------- | ------------------------- |
| OpenAI GPT-4o          | 70     | 6777      | 10.3 | 4498      | RestaurantSearch          |
| OpenAI GPT-4o Mini     | 71     | 5081      | 14.0 | 2960      | RestaurantSearch          |
| OpenAI o3 Mini         | 45     | 19603     | 2.3  | 18264     | RestaurantSearch          |
| OpenAI o4 Mini         | 49     | 7874      | 6.2  | 6394      | RestaurantSearch          |
| OpenAI GPT-4.1         | 100    | 29762     | 3.4  | 16109     | RestaurantSearch          |
| OpenAI GPT-4.1 Mini    | 95     | 6570      | 14.5 | 3703      | RestaurantSearch          |
| Claude 4 Opus          | 201    | 64887     | 3.1  | 5266      | RestaurantSearch          |
| Claude 4 Sonnet        | 171    | 26637     | 6.4  | 19136     | Weather, RestaurantSearch |
| Claude 3.7 Sonnet      | 164    | 18228     | 9.0  | 7977      | RestaurantSearch          |
| Claude 3.5 Haiku       | 133    | 18619     | 7.1  | 8667      | RestaurantSearch          |
| Gemini 2.5 Flash       | 31     | 5435      | 5.7  | 4440      | RestaurantSearch          |
| Gemini 2.5 Pro         | 38     | 12724     | 3.0  | 11601     | RestaurantSearch          |
| Groq Llama 4 Scout 17B | 16     | 2233      | 7.2  | 1778      | RestaurantSearch          |
| Groq LLlama 3.3 70B    | 23     | 2354      | 9.8  | 1675      | RestaurantSearch          |
| Cerebras Llama 3.3 70B | 0      | 0         | 0.0  | 0         | None                      |
| Cohere Command R+      | 0      | 0         | 0.0  | 0         | None                      |
| Cohere Command A       | 0      | 0         | 0.0  | 0         | None                      |
| Mistral Large          | 0      | 50102     | 0.0  | 0         | None                      |
| Bedrock Claude 3.7     | 0      | 0         | 0.0  | 0         | None                      |
| Bedrock Nova Pro       | 247    | 6586      | 37.5 | 1992      | RestaurantSearch          |
| Bedrock Nova Premier   | 0      | 0         | 0.0  | 0         | None                      |
| Deepseek Chat          | 173    | 21621     | 8.0  | 14834     | RestaurantSearch          |

#### Turn 3: What are the top tourist attractions I should visi...

Expected tools: AttractionsSearch, OpeningHours

| Provider               | Tokens | Time (ms) | TPS  | TTFT (ms) | Tools Used                      |
| ---------------------- | ------ | --------- | ---- | --------- | ------------------------------- |
| OpenAI GPT-4o          | 121    | 9625      | 12.6 | 5987      | AttractionsSearch, OpeningHours |
| OpenAI GPT-4o Mini     | 112    | 9228      | 12.1 | 5094      | AttractionsSearch, OpeningHours |
| OpenAI o3 Mini         | 103    | 24136     | 4.3  | 21030     | None                            |
| OpenAI o4 Mini         | 68     | 24926     | 2.7  | 22891     | AttractionsSearch, OpeningHours |
| OpenAI GPT-4.1         | 97     | 11166     | 8.7  | 8239      | AttractionsSearch, OpeningHours |
| OpenAI GPT-4.1 Mini    | 127    | 19392     | 6.5  | 9865      | AttractionsSearch, OpeningHours |
| Claude 4 Opus          | 0      | 0         | 0.0  | 0         | None                            |
| Claude 4 Sonnet        | 281    | 54202     | 5.2  | 44993     | AttractionsSearch, OpeningHours |
| Claude 3.7 Sonnet      | 242    | 46087     | 5.3  | 5580      | AttractionsSearch, OpeningHours |
| Claude 3.5 Haiku       | 192    | 32858     | 5.8  | 7662      | AttractionsSearch, OpeningHours |
| Gemini 2.5 Flash       | 63     | 9932      | 6.3  | 7003      | AttractionsSearch, OpeningHours |
| Gemini 2.5 Pro         | 86     | 30992     | 2.8  | 28260     | AttractionsSearch, OpeningHours |
| Groq Llama 4 Scout 17B | 16     | 1673      | 9.6  | 1220      | None                            |
| Groq LLlama 3.3 70B    | 0      | 0         | 0.0  | 0         | None                            |
| Cerebras Llama 3.3 70B | 0      | 0         | 0.0  | 0         | None                            |
| Cohere Command R+      | 0      | 0         | 0.0  | 0         | None                            |
| Cohere Command A       | 0      | 0         | 0.0  | 0         | None                            |
| Mistral Large          | 29     | 17144     | 1.7  | 9263      | None                            |
| Bedrock Claude 3.7     | 0      | 0         | 0.0  | 0         | None                            |
| Bedrock Nova Pro       | 76     | 4159      | 18.3 | 2966      | None                            |
| Bedrock Nova Premier   | 121    | 10373     | 11.7 | 2407      | None                            |
| Deepseek Chat          | 296    | 31887     | 9.3  | 20349     | AttractionsSearch, OpeningHours |

#### Turn 4: Based on the weather, restaurants, and attractions...

| Provider               | Tokens | Time (ms) | TPS  | TTFT (ms) | Tools Used                                   |
| ---------------------- | ------ | --------- | ---- | --------- | -------------------------------------------- |
| OpenAI GPT-4o          | 265    | 15532     | 17.1 | 7545      | AttractionsSearch, OpeningHours              |
| OpenAI GPT-4o Mini     | 270    | 12322     | 21.9 | 2562      | None                                         |
| OpenAI o3 Mini         | 191    | 21152     | 9.0  | 15396     | None                                         |
| OpenAI o4 Mini         | 0      | 0         | 0.0  | 0         | None                                         |
| OpenAI GPT-4.1         | 248    | 10879     | 22.8 | 3371      | None                                         |
| OpenAI GPT-4.1 Mini    | 266    | 32542     | 8.2  | 12736     | AttractionsSearch, OpeningHours              |
| Claude 4 Opus          | 0      | 0         | 0.0  | 0         | None                                         |
| Claude 4 Sonnet        | 351    | 25555     | 13.7 | 12968     | Weather                                      |
| Claude 3.7 Sonnet      | 385    | 26426     | 14.6 | 9192      | Weather                                      |
| Claude 3.5 Haiku       | 203    | 37571     | 5.4  | 5797      | Weather, AttractionsSearch, RestaurantSearch |
| Gemini 2.5 Flash       | 77     | 18075     | 4.3  | 15771     | OpeningHours                                 |
| Gemini 2.5 Pro         | 206    | 35688     | 5.8  | 29500     | Weather                                      |
| Groq Llama 4 Scout 17B | 36     | 2244      | 16.0 | 1183      | None                                         |
| Groq LLlama 3.3 70B    | 0      | 0         | 0.0  | 0         | None                                         |
| Cerebras Llama 3.3 70B | 0      | 0         | 0.0  | 0         | None                                         |
| Cohere Command R+      | 0      | 0         | 0.0  | 0         | None                                         |
| Cohere Command A       | 0      | 0         | 0.0  | 0         | None                                         |
| Mistral Large          | 70     | 24839     | 2.8  | 14879     | None                                         |
| Bedrock Claude 3.7     | 0      | 0         | 0.0  | 0         | None                                         |
| Bedrock Nova Pro       | 81     | 5664      | 14.3 | 1957      | None                                         |
| Bedrock Nova Premier   | 367    | 15631     | 23.5 | 3982      | None                                         |
| Deepseek Chat          | 569    | 32318     | 17.6 | 8293      | None                                         |

### Error Summary

8 provider(s) experienced errors during testing:

| Provider               | Model             | Total Errors | Error Rate | Failed Turns              |
| ---------------------- | ----------------- | ------------ | ---------- | ------------------------- |
| Bedrock Claude 3.7     | CLAUDE_3_7_SONNET | 9            | 225.0%     | 2, 2, 2, 3, 3, 3, 4, 4, 4 |
| Cerebras Llama 3.3 70B | LLAMA_3_3_70B     | 8            | 200.0%     | 1, 1, 2, 2, 3, 3, 4, 4    |
| Cohere Command R+      | COMMAND_R_PLUS    | 8            | 200.0%     | 1, 1, 2, 2, 3, 3, 4, 4    |
| Cohere Command A       | COMMAND_A         | 8            | 200.0%     | 1, 1, 2, 2, 3, 3, 4, 4    |
| Groq LLlama 3.3 70B    | LLAMA_3_3_70B     | 6            | 150.0%     | 1, 1, 3, 3, 4, 4          |
| Claude 4 Opus          | CLAUDE_4_OPUS     | 4            | 100.0%     | 3, 3, 4, 4                |
| Bedrock Nova Premier   | NOVA_PREMIER      | 3            | 75.0%      | 2, 2, 2                   |
| OpenAI o4 Mini         | O4_MINI_200K      | 2            | 50.0%      | 4, 4                      |

### Detailed Error Messages

**Bedrock Claude 3.7** (CLAUDE_3_7_SONNET):

- Turn 2: Bedrock streaming error: ThrottlingException: Too many tokens, please wait before trying again.
- Turn 2: Too many tokens, please wait before trying again.
- Turn 2: Too many tokens, please wait before trying again.
- Turn 3: Bedrock streaming error: ThrottlingException: Too many tokens, please wait before trying again.
- Turn 3: Too many tokens, please wait before trying again.
- Turn 3: Too many tokens, please wait before trying again.
- Turn 4: Bedrock streaming error: ThrottlingException: Too many tokens, please wait before trying again.
- Turn 4: Too many tokens, please wait before trying again.
- Turn 4: Too many tokens, please wait before trying again.

**Cerebras Llama 3.3 70B** (LLAMA_3_3_70B):

- Turn 1: 429 status code (no body)
- Turn 1: 429 status code (no body)
- Turn 2: 429 status code (no body)
- Turn 2: 429 status code (no body)
- Turn 3: 429 status code (no body)
- Turn 3: 429 status code (no body)
- Turn 4: 429 status code (no body)
- Turn 4: 429 status code (no body)

**Cohere Command R+** (COMMAND_R_PLUS):

- Turn 1: Missing required key "message"
- Turn 1: Missing required key "message"
- Turn 2: Missing required key "message"
- Turn 2: Missing required key "message"
- Turn 3: Missing required key "message"
- Turn 3: Missing required key "message"
- Turn 4: Missing required key "message"
- Turn 4: Missing required key "message"

**Cohere Command A** (COMMAND_A):

- Turn 1: Missing required key "message"
- Turn 1: Missing required key "message"
- Turn 2: Missing required key "message"
- Turn 2: Missing required key "message"
- Turn 3: Missing required key "message"
- Turn 3: Missing required key "message"
- Turn 4: Missing required key "message"
- Turn 4: Missing required key "message"

**Groq LLlama 3.3 70B** (LLAMA_3_3_70B):

- Turn 1: 400 Failed to call a function. Please adjust your prompt. See 'failed_generation' for more details.
- Turn 1: 400 Failed to call a function. Please adjust your prompt. See 'failed_generation' for more details.
- Turn 3: 400 Failed to call a function. Please adjust your prompt. See 'failed_generation' for more details.
- Turn 3: 400 Failed to call a function. Please adjust your prompt. See 'failed_generation' for more details.
- Turn 4: 400 Failed to call a function. Please adjust your prompt. See 'failed_generation' for more details.
- Turn 4: 400 Failed to call a function. Please adjust your prompt. See 'failed_generation' for more details.

**Claude 4 Opus** (CLAUDE_4_OPUS):

- Turn 3: {"type":"error","error":{"details":null,"type":"overloaded_error","message":"Overloaded"}}
- Turn 3: {"type":"error","error":{"details":null,"type":"overloaded_error","message":"Overloaded"}}
- Turn 4: {"type":"error","error":{"details":null,"type":"overloaded_error","message":"Overloaded"}}
- Turn 4: {"type":"error","error":{"details":null,"type":"overloaded_error","message":"Overloaded"}}

**Bedrock Nova Premier** (NOVA_PREMIER):

- Turn 2: Bedrock streaming error: ServiceUnavailableException: Too many requests to model, please wait before trying again.
- Turn 2: Too many requests to model, please wait before trying again.
- Turn 2: Too many requests to model, please wait before trying again.

**OpenAI o4 Mini** (O4_MINI_200K):

- Turn 4: fetch failed
- Turn 4: fetch failed

**Common Error Patterns:**

- **AWS Bedrock**: 12 errors across 2 model(s) - likely authentication or region issues
- **Cohere**: 16 errors across 2 model(s) - possible tool schema compatibility issues
- **Other Providers**: 20 errors across 4 model(s)

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

1. **Bedrock Nova Pro** - 32.3 TPS
2. **OpenAI GPT-4o Mini** - 16.3 TPS
3. **OpenAI GPT-4o** - 14.4 TPS

### Responsiveness Leaders (Time to First Token)

1. **Cerebras Llama 3.3 70B** - 0ms average TTFT
2. **Cohere Command R+** - 0ms average TTFT
3. **Cohere Command A** - 0ms average TTFT

### Tool Calling Champions

1. **OpenAI o3 Mini** - 0ms average tool execution
2. **Groq Llama 4 Scout 17B** - 0ms average tool execution
3. **Groq LLlama 3.3 70B** - 0ms average tool execution

### Tool Usage Patterns

| Provider               | Total Tool Calls | Unique Tools Used |
| ---------------------- | ---------------- | ----------------- |
| Gemini 2.5 Flash       | 15               | 4                 |
| OpenAI GPT-4.1 Mini    | 14               | 4                 |
| OpenAI GPT-4o          | 12               | 4                 |
| Claude 4 Sonnet        | 10               | 4                 |
| Claude 3.5 Haiku       | 10               | 4                 |
| Claude 3.7 Sonnet      | 9                | 4                 |
| OpenAI GPT-4o Mini     | 8                | 4                 |
| OpenAI o4 Mini         | 8                | 4                 |
| OpenAI GPT-4.1         | 8                | 4                 |
| Deepseek Chat          | 8                | 4                 |
| Gemini 2.5 Pro         | 7                | 4                 |
| Claude 4 Opus          | 3                | 2                 |
| OpenAI o3 Mini         | 2                | 2                 |
| Groq Llama 4 Scout 17B | 2                | 2                 |
| Bedrock Claude 3.7     | 2                | 1                 |
| Bedrock Nova Pro       | 2                | 2                 |
| Bedrock Nova Premier   | 2                | 1                 |
| Groq LLlama 3.3 70B    | 1                | 1                 |

## Test Environment

- Date: 2025-06-15T23:19:13.274Z
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

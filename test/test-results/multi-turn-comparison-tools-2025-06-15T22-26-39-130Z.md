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
- **Total Errors**: 33
- **Average Errors per Provider**: 1.5

## Performance Metrics

### Overall Performance Ranking

| Rank | Provider               | Model                    | Avg TPS | Avg TTFT (ms) | Total Time (s) | Total Tokens | Tool Calls | Avg Tool Time (ms) | Errors |
| ---- | ---------------------- | ------------------------ | ------- | ------------- | -------------- | ------------ | ---------- | ------------------ | ------ |
| 1    | Bedrock Nova Pro       | NOVA_PRO                 | 40.8    | 2101          | 21.3           | 869          | 1          | 0                  | 0      |
| 2    | OpenAI GPT-4o Mini     | GPT4O_MINI_128K          | 17.1    | 3453          | 34.3           | 585          | 8          | 1                  | 0      |
| 3    | OpenAI GPT-4o          | GPT4O_128K               | 14.5    | 3988          | 32.8           | 475          | 14         | 0                  | 0      |
| 4    | Deepseek Chat          | CHAT                     | 13.3    | 11888         | 104.4          | 1388         | 8          | 522                | 0      |
| 5    | Bedrock Nova Premier   | NOVA_PREMIER             | 12.6    | 10116         | 109.6          | 1381         | 1          | 1                  | 0      |
| 6    | Claude 3.7 Sonnet      | CLAUDE_3_7_SONNET        | 12.3    | 5005          | 93.0           | 1143         | 9          | 33                 | 0      |
| 7    | Claude 3.5 Haiku       | CLAUDE_3_5_HAIKU         | 10.9    | 5995          | 67.3           | 733          | 8          | 27                 | 0      |
| 8    | Claude 4 Opus          | CLAUDE_4_OPUS            | 10.1    | 7966          | 115.8          | 1170         | 8          | 19                 | 0      |
| 9    | OpenAI GPT-4.1 Mini    | GPT41_MINI_1024K         | 9.9     | 5878          | 33.4           | 329          | 11         | 1                  | 0      |
| 10   | Claude 4 Sonnet        | CLAUDE_4_SONNET          | 9.5     | 15343         | 99.5           | 940          | 9          | 39                 | 0      |
| 11   | Groq Llama 4 Scout 17B | LLAMA_4_SCOUT_17B        | 9.4     | 1635          | 9.1            | 85           | 2          | 1                  | 0      |
| 12   | Gemini 2.5 Flash       | GEMINI_2_5_FLASH_PREVIEW | 8.2     | 7362          | 39.1           | 322          | 10         | 2                  | 0      |
| 13   | Cohere Command A       | COMMAND_A                | 7.8     | 2623          | 20.2           | 158          | 6          | 174                | 2      |
| 14   | OpenAI o4 Mini         | O4_MINI_200K             | 6.0     | 9792          | 47.8           | 289          | 8          | 0                  | 0      |
| 15   | Groq LLlama 3.3 70B    | LLAMA_3_3_70B            | 5.4     | 1773          | 13.0           | 70           | 4          | 1                  | 4      |
| 16   | OpenAI GPT-4.1         | GPT41_1024K              | 5.3     | 4023          | 45.1           | 241          | 8          | 0                  | 2      |
| 17   | Gemini 2.5 Pro         | GEMINI_2_5_PRO_PREVIEW   | 4.9     | 17329         | 83.0           | 405          | 7          | 1                  | 0      |
| 18   | OpenAI o3 Mini         | O3_MINI_200K             | 4.2     | 15117         | 69.3           | 294          | 2          | 1                  | 0      |
| 19   | Bedrock Claude 3.7     | CLAUDE_3_7_SONNET        | 2.7     | 1577          | 30.2           | 82           | 4          | 1                  | 9      |
| 20   | Mistral Large          | MISTRAL_LARGE            | 0.3     | 2177          | 122.7          | 31           | 0          | 0                  | 0      |
| 21   | Cerebras Llama 3.3 70B | LLAMA_3_3_70B            | 0.0     | 0             | 12.4           | 0            | 0          | 0                  | 8      |
| 22   | Cohere Command R+      | COMMAND_R_PLUS           | 0.0     | 0             | 25.0           | 0            | 7          | 192                | 8      |

### Time to First Token (TTFT) Ranking

| Rank | Provider               | Avg TTFT (ms) | Min TTFT | Max TTFT |
| ---- | ---------------------- | ------------- | -------- | -------- |
| 1    | Cerebras Llama 3.3 70B | 0             | 0        | 0        |
| 2    | Cohere Command R+      | 0             | 0        | 0        |
| 3    | Bedrock Claude 3.7     | 1577          | 0        | 6306     |
| 4    | Groq Llama 4 Scout 17B | 1635          | 1486     | 1798     |
| 5    | Groq LLlama 3.3 70B    | 1773          | 0        | 5776     |
| 6    | Bedrock Nova Pro       | 2101          | 1892     | 2533     |
| 7    | Mistral Large          | 2177          | 0        | 8707     |
| 8    | Cohere Command A       | 2623          | 0        | 3760     |
| 9    | OpenAI GPT-4o Mini     | 3453          | 2079     | 5682     |
| 10   | OpenAI GPT-4o          | 3988          | 2512     | 5421     |
| 11   | OpenAI GPT-4.1         | 4023          | 0        | 9099     |
| 12   | Claude 3.7 Sonnet      | 5005          | 4539     | 5812     |
| 13   | OpenAI GPT-4.1 Mini    | 5878          | 2560     | 10087    |
| 14   | Claude 3.5 Haiku       | 5995          | 4847     | 8703     |
| 15   | Gemini 2.5 Flash       | 7362          | 4213     | 9857     |
| 16   | Claude 4 Opus          | 7966          | 4540     | 12831    |
| 17   | OpenAI o4 Mini         | 9792          | 6022     | 19096    |
| 18   | Bedrock Nova Premier   | 10116         | 2658     | 21707    |
| 19   | Deepseek Chat          | 11888         | 6264     | 17983    |
| 20   | OpenAI o3 Mini         | 15117         | 10429    | 23120    |
| 21   | Claude 4 Sonnet        | 15343         | 2690     | 37040    |
| 22   | Gemini 2.5 Pro         | 17329         | 11211    | 22120    |

### Tool Calling Performance

| Rank | Provider               | Tool Calls | Avg Tool Time (ms) | Min Tool Time | Max Tool Time |
| ---- | ---------------------- | ---------- | ------------------ | ------------- | ------------- |
| 1    | OpenAI GPT-4o          | 14         | 0                  | 0             | 0             |
| 2    | Bedrock Nova Pro       | 1          | 0                  | 0             | 0             |
| 3    | OpenAI GPT-4.1         | 8          | 0                  | 0             | 1             |
| 4    | OpenAI o4 Mini         | 8          | 0                  | 0             | 1             |
| 5    | OpenAI o3 Mini         | 2          | 1                  | 0             | 1             |
| 6    | Groq Llama 4 Scout 17B | 2          | 1                  | 0             | 1             |
| 7    | Groq LLlama 3.3 70B    | 4          | 1                  | 0             | 1             |
| 8    | OpenAI GPT-4.1 Mini    | 11         | 1                  | 0             | 1             |
| 9    | OpenAI GPT-4o Mini     | 8          | 1                  | 0             | 1             |
| 10   | Bedrock Claude 3.7     | 4          | 1                  | 0             | 2             |
| 11   | Bedrock Nova Premier   | 1          | 1                  | 1             | 1             |
| 12   | Gemini 2.5 Pro         | 7          | 1                  | 1             | 3             |
| 13   | Gemini 2.5 Flash       | 10         | 2                  | 1             | 4             |
| 14   | Claude 4 Opus          | 8          | 19                 | 12            | 30            |
| 15   | Claude 3.5 Haiku       | 8          | 27                 | 18            | 30            |
| 16   | Claude 3.7 Sonnet      | 9          | 33                 | 15            | 66            |
| 17   | Claude 4 Sonnet        | 9          | 39                 | 25            | 58            |
| 18   | Cohere Command A       | 6          | 174                | 173           | 174           |
| 19   | Cohere Command R+      | 7          | 192                | 4             | 275           |
| 20   | Deepseek Chat          | 8          | 522                | 457           | 924           |

### Per-Turn Performance Details

#### Turn 1: Hi! I'm planning a trip to Tokyo next month. What'...

Expected tools: Weather

| Provider               | Tokens | Time (ms) | TPS  | TTFT (ms) | Tools Used |
| ---------------------- | ------ | --------- | ---- | --------- | ---------- |
| OpenAI GPT-4o          | 37     | 3624      | 10.2 | 2512      | Weather    |
| OpenAI GPT-4o Mini     | 46     | 3453      | 13.3 | 2079      | Weather    |
| OpenAI o3 Mini         | 56     | 14392     | 3.9  | 12734     | Weather    |
| OpenAI o4 Mini         | 51     | 8709      | 5.9  | 7175      | Weather    |
| OpenAI GPT-4.1         | 58     | 4540      | 12.8 | 2799      | Weather    |
| OpenAI GPT-4.1 Mini    | 45     | 6723      | 6.7  | 5379      | Weather    |
| Claude 4 Opus          | 159    | 18821     | 8.4  | 8451      | Weather    |
| Claude 4 Sonnet        | 137    | 9049      | 15.1 | 2690      | Weather    |
| Claude 3.7 Sonnet      | 167    | 12184     | 13.7 | 5812      | Weather    |
| Claude 3.5 Haiku       | 159    | 11927     | 13.3 | 4847      | Weather    |
| Gemini 2.5 Flash       | 42     | 11101     | 3.8  | 9857      | Weather    |
| Gemini 2.5 Pro         | 39     | 23297     | 1.7  | 22120     | Weather    |
| Groq Llama 4 Scout 17B | 14     | 2212      | 6.3  | 1798      | Weather    |
| Groq LLlama 3.3 70B    | 0      | 0         | 0.0  | 0         | None       |
| Cerebras Llama 3.3 70B | 0      | 0         | 0.0  | 0         | None       |
| Cohere Command R+      | 0      | 0         | 0.0  | 0         | None       |
| Cohere Command A       | 26     | 4210      | 6.2  | 3434      | None       |
| Mistral Large          | 0      | 47461     | 0.0  | 0         | None       |
| Bedrock Claude 3.7     | 0      | 0         | 0.0  | 0         | None       |
| Bedrock Nova Pro       | 273    | 6133      | 44.5 | 1892      | Weather    |
| Bedrock Nova Premier   | 302    | 29228     | 10.3 | 2658      | Weather    |
| Deepseek Chat          | 109    | 11233     | 9.7  | 6264      | Weather    |

#### Turn 2: Great! Can you find me some highly-rated vegetaria...

Expected tools: RestaurantSearch

| Provider               | Tokens | Time (ms) | TPS  | TTFT (ms) | Tools Used       |
| ---------------------- | ------ | --------- | ---- | --------- | ---------------- |
| OpenAI GPT-4o          | 62     | 4818      | 12.9 | 2950      | RestaurantSearch |
| OpenAI GPT-4o Mini     | 71     | 8344      | 8.5  | 5682      | RestaurantSearch |
| OpenAI o3 Mini         | 42     | 11684     | 3.6  | 10429     | RestaurantSearch |
| OpenAI o4 Mini         | 36     | 7945      | 4.5  | 6875      | RestaurantSearch |
| OpenAI GPT-4.1         | 93     | 7211      | 12.9 | 4192      | RestaurantSearch |
| OpenAI GPT-4.1 Mini    | 68     | 4586      | 14.8 | 2560      | RestaurantSearch |
| Claude 4 Opus          | 206    | 21910     | 9.4  | 4540      | RestaurantSearch |
| Claude 4 Sonnet        | 199    | 18938     | 10.5 | 9433      | RestaurantSearch |
| Claude 3.7 Sonnet      | 179    | 16152     | 11.1 | 4539      | RestaurantSearch |
| Claude 3.5 Haiku       | 152    | 13931     | 10.9 | 5214      | RestaurantSearch |
| Gemini 2.5 Flash       | 103    | 7301      | 14.1 | 4213      | RestaurantSearch |
| Gemini 2.5 Pro         | 54     | 12823     | 4.2  | 11211     | RestaurantSearch |
| Groq Llama 4 Scout 17B | 21     | 2335      | 9.0  | 1701      | RestaurantSearch |
| Groq LLlama 3.3 70B    | 25     | 2073      | 12.1 | 1317      | RestaurantSearch |
| Cerebras Llama 3.3 70B | 0      | 0         | 0.0  | 0         | None             |
| Cohere Command R+      | 0      | 0         | 0.0  | 0         | None             |
| Cohere Command A       | 35     | 4336      | 8.1  | 3299      | None             |
| Mistral Large          | 0      | 49866     | 0.0  | 0         | None             |
| Bedrock Claude 3.7     | 0      | 0         | 0.0  | 0         | None             |
| Bedrock Nova Pro       | 157    | 4692      | 33.5 | 2533      | None             |
| Bedrock Nova Premier   | 280    | 20416     | 13.7 | 8435      | None             |
| Deepseek Chat          | 170    | 19950     | 8.5  | 12685     | RestaurantSearch |

#### Turn 3: What are the top tourist attractions I should visi...

Expected tools: AttractionsSearch, OpeningHours

| Provider               | Tokens | Time (ms) | TPS  | TTFT (ms) | Tools Used                      |
| ---------------------- | ------ | --------- | ---- | --------- | ------------------------------- |
| OpenAI GPT-4o          | 109    | 8343      | 13.1 | 5067      | AttractionsSearch, OpeningHours |
| OpenAI GPT-4o Mini     | 149    | 8336      | 17.9 | 3854      | AttractionsSearch, OpeningHours |
| OpenAI o3 Mini         | 67     | 25139     | 2.7  | 23120     | None                            |
| OpenAI o4 Mini         | 56     | 20777     | 2.7  | 19096     | AttractionsSearch, OpeningHours |
| OpenAI GPT-4.1         | 90     | 11787     | 7.6  | 9099      | AttractionsSearch, OpeningHours |
| OpenAI GPT-4.1 Mini    | 88     | 12742     | 6.9  | 10087     | AttractionsSearch, OpeningHours |
| Claude 4 Opus          | 207    | 37412     | 5.5  | 12831     | AttractionsSearch, OpeningHours |
| Claude 4 Sonnet        | 246    | 44509     | 5.5  | 37040     | AttractionsSearch, OpeningHours |
| Claude 3.7 Sonnet      | 293    | 39491     | 7.4  | 4698      | AttractionsSearch, OpeningHours |
| Claude 3.5 Haiku       | 228    | 24344     | 9.4  | 5216      | AttractionsSearch, OpeningHours |
| Gemini 2.5 Flash       | 41     | 7930      | 5.2  | 6692      | AttractionsSearch, OpeningHours |
| Gemini 2.5 Pro         | 75     | 21256     | 3.5  | 19004     | AttractionsSearch, OpeningHours |
| Groq Llama 4 Scout 17B | 22     | 2219      | 9.9  | 1554      | None                            |
| Groq LLlama 3.3 70B    | 0      | 0         | 0.0  | 0         | None                            |
| Cerebras Llama 3.3 70B | 0      | 0         | 0.0  | 0         | None                            |
| Cohere Command R+      | 0      | 0         | 0.0  | 0         | None                            |
| Cohere Command A       | 0      | 0         | 0.0  | 0         | None                            |
| Mistral Large          | 31     | 11506     | 2.7  | 8707      | None                            |
| Bedrock Claude 3.7     | 82     | 9210      | 8.9  | 6306      | None                            |
| Bedrock Nova Pro       | 67     | 3275      | 20.5 | 1944      | None                            |
| Bedrock Nova Premier   | 222    | 31690     | 7.0  | 21707     | None                            |
| Deepseek Chat          | 277    | 29008     | 9.5  | 17983     | AttractionsSearch, OpeningHours |

#### Turn 4: Based on the weather, restaurants, and attractions...

| Provider               | Tokens | Time (ms) | TPS  | TTFT (ms) | Tools Used                                   |
| ---------------------- | ------ | --------- | ---- | --------- | -------------------------------------------- |
| OpenAI GPT-4o          | 267    | 16034     | 16.7 | 5421      | AttractionsSearch, OpeningHours              |
| OpenAI GPT-4o Mini     | 319    | 14118     | 22.6 | 2195      | None                                         |
| OpenAI o3 Mini         | 129    | 18067     | 7.1  | 14184     | None                                         |
| OpenAI o4 Mini         | 146    | 10405     | 14.0 | 6022      | None                                         |
| OpenAI GPT-4.1         | 0      | 0         | 0.0  | 0         | None                                         |
| OpenAI GPT-4.1 Mini    | 128    | 9331      | 13.7 | 5486      | Weather, RestaurantSearch, AttractionsSearch |
| Claude 4 Opus          | 598    | 37666     | 15.9 | 6040      | None                                         |
| Claude 4 Sonnet        | 358    | 26967     | 13.3 | 12208     | Weather                                      |
| Claude 3.7 Sonnet      | 504    | 25205     | 20.0 | 4972      | AttractionsSearch                            |
| Claude 3.5 Haiku       | 194    | 17104     | 11.3 | 8703      | None                                         |
| Gemini 2.5 Flash       | 136    | 12807     | 10.6 | 8684      | None                                         |
| Gemini 2.5 Pro         | 237    | 25655     | 9.2  | 16982     | None                                         |
| Groq Llama 4 Scout 17B | 28     | 2307      | 12.1 | 1486      | None                                         |
| Groq LLlama 3.3 70B    | 45     | 7123      | 6.3  | 5776      | RestaurantSearch, AttractionsSearch, Weather |
| Cerebras Llama 3.3 70B | 0      | 0         | 0.0  | 0         | None                                         |
| Cohere Command R+      | 0      | 0         | 0.0  | 0         | None                                         |
| Cohere Command A       | 97     | 6671      | 14.5 | 3760      | None                                         |
| Mistral Large          | 0      | 13915     | 0.0  | 0         | None                                         |
| Bedrock Claude 3.7     | 0      | 0         | 0.0  | 0         | None                                         |
| Bedrock Nova Pro       | 372    | 7183      | 51.8 | 2033      | None                                         |
| Bedrock Nova Premier   | 577    | 28301     | 20.4 | 7664      | None                                         |
| Deepseek Chat          | 832    | 44193     | 18.8 | 10619     | None                                         |

### Error Summary

6 provider(s) experienced errors during testing:

| Provider               | Model             | Total Errors | Error Rate | Failed Turns              |
| ---------------------- | ----------------- | ------------ | ---------- | ------------------------- |
| Bedrock Claude 3.7     | CLAUDE_3_7_SONNET | 9            | 225.0%     | 1, 1, 1, 2, 2, 2, 4, 4, 4 |
| Cerebras Llama 3.3 70B | LLAMA_3_3_70B     | 8            | 200.0%     | 1, 1, 2, 2, 3, 3, 4, 4    |
| Cohere Command R+      | COMMAND_R_PLUS    | 8            | 200.0%     | 1, 1, 2, 2, 3, 3, 4, 4    |
| Groq LLlama 3.3 70B    | LLAMA_3_3_70B     | 4            | 100.0%     | 1, 1, 3, 3                |
| OpenAI GPT-4.1         | GPT41_1024K       | 2            | 50.0%      | 4, 4                      |
| Cohere Command A       | COMMAND_A         | 2            | 50.0%      | 3, 3                      |

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

- Turn 1: No valid last message found for Cohere streaming
- Turn 1: No valid last message found for Cohere streaming
- Turn 2: No valid last message found for Cohere streaming
- Turn 2: No valid last message found for Cohere streaming
- Turn 3: No valid last message found for Cohere streaming
- Turn 3: No valid last message found for Cohere streaming
- Turn 4: No valid last message found for Cohere streaming
- Turn 4: No valid last message found for Cohere streaming

**Groq LLlama 3.3 70B** (LLAMA_3_3_70B):

- Turn 1: 400 Failed to call a function. Please adjust your prompt. See 'failed_generation' for more details.
- Turn 1: 400 Failed to call a function. Please adjust your prompt. See 'failed_generation' for more details.
- Turn 3: 400 Failed to call a function. Please adjust your prompt. See 'failed_generation' for more details.
- Turn 3: 400 Failed to call a function. Please adjust your prompt. See 'failed_generation' for more details.

**OpenAI GPT-4.1** (GPT41_1024K):

- Turn 4: fetch failed
- Turn 4: fetch failed

**Cohere Command A** (COMMAND_A):

- Turn 3: No valid last message found for Cohere streaming
- Turn 3: No valid last message found for Cohere streaming

**Common Error Patterns:**

- **AWS Bedrock**: 9 errors across 1 model(s) - likely authentication or region issues
- **Cohere**: 10 errors across 2 model(s) - possible tool schema compatibility issues
- **Other Providers**: 14 errors across 3 model(s)

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

1. **Bedrock Nova Pro** - 40.8 TPS
2. **OpenAI GPT-4o Mini** - 17.1 TPS
3. **OpenAI GPT-4o** - 14.5 TPS

### Responsiveness Leaders (Time to First Token)

1. **Cerebras Llama 3.3 70B** - 0ms average TTFT
2. **Cohere Command R+** - 0ms average TTFT
3. **Bedrock Claude 3.7** - 1577ms average TTFT

### Tool Calling Champions

1. **OpenAI GPT-4o** - 0ms average tool execution
2. **Bedrock Nova Pro** - 0ms average tool execution
3. **OpenAI GPT-4.1** - 0ms average tool execution

### Tool Usage Patterns

| Provider               | Total Tool Calls | Unique Tools Used |
| ---------------------- | ---------------- | ----------------- |
| OpenAI GPT-4o          | 14               | 4                 |
| OpenAI GPT-4.1 Mini    | 11               | 4                 |
| Gemini 2.5 Flash       | 10               | 4                 |
| Claude 4 Sonnet        | 9                | 4                 |
| Claude 3.7 Sonnet      | 9                | 4                 |
| OpenAI GPT-4o Mini     | 8                | 4                 |
| OpenAI o4 Mini         | 8                | 4                 |
| OpenAI GPT-4.1         | 8                | 4                 |
| Claude 4 Opus          | 8                | 4                 |
| Claude 3.5 Haiku       | 8                | 4                 |
| Deepseek Chat          | 8                | 4                 |
| Gemini 2.5 Pro         | 7                | 4                 |
| Cohere Command R+      | 7                | 0                 |
| Cohere Command A       | 6                | 0                 |
| Groq LLlama 3.3 70B    | 4                | 3                 |
| Bedrock Claude 3.7     | 4                | 0                 |
| OpenAI o3 Mini         | 2                | 2                 |
| Groq Llama 4 Scout 17B | 2                | 2                 |
| Bedrock Nova Pro       | 1                | 1                 |
| Bedrock Nova Premier   | 1                | 1                 |

## Test Environment

- Date: 2025-06-15T22:26:39.130Z
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

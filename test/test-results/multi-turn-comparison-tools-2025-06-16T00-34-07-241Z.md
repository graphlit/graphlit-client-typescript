# Multi-turn Conversation Performance Comparison (WITH TOOLS)

## Test Scenario

A 4-turn conversation about planning a trip to Tokyo, using tools for:

1. Weather lookup
2. Restaurant search (vegetarian with nut allergy)
3. Tourist attractions and opening hours
4. Creating a detailed 3-day itinerary

## Summary Statistics

- **Total Providers Tested**: 22
- **Providers with Errors**: 5 (22.7%)
- **Total Errors**: 34
- **Average Errors per Provider**: 1.5

## Performance Metrics

### Overall Performance Ranking

| Rank | Provider               | Model                    | Avg TPS | Avg TTFT (ms) | Total Time (s) | Total Tokens | Tool Calls | Avg Tool Time (ms) | Errors |
| ---- | ---------------------- | ------------------------ | ------- | ------------- | -------------- | ------------ | ---------- | ------------------ | ------ |
| 1    | Bedrock Nova Pro       | NOVA_PRO                 | 31.6    | 3106          | 26.1           | 825          | 1          | 0                  | 0      |
| 2    | Bedrock Nova Premier   | NOVA_PREMIER             | 17.1    | 9005          | 104.7          | 1786         | 1          | 0                  | 0      |
| 3    | OpenAI GPT-4o Mini     | GPT4O_MINI_128K          | 16.3    | 4503          | 41.8           | 683          | 8          | 0                  | 0      |
| 4    | OpenAI GPT-4o          | GPT4O_128K               | 13.4    | 5314          | 39.5           | 530          | 15         | 1                  | 0      |
| 5    | Claude 4 Opus          | CLAUDE_4_OPUS            | 11.0    | 6041          | 118.0          | 1293         | 8          | 35                 | 0      |
| 6    | Groq Llama 4 Scout 17B | LLAMA_4_SCOUT_17B        | 10.3    | 2897          | 17.3           | 179          | 5          | 0                  | 0      |
| 7    | OpenAI GPT-4.1 Mini    | GPT41_MINI_1024K         | 10.0    | 7037          | 55.5           | 556          | 14         | 0                  | 0      |
| 8    | OpenAI GPT-4.1         | GPT41_1024K              | 9.7     | 8683          | 49.1           | 479          | 8          | 0                  | 0      |
| 9    | Claude 3.7 Sonnet      | CLAUDE_3_7_SONNET        | 9.5     | 6510          | 124.2          | 1180         | 10         | 44                 | 0      |
| 10   | Claude 4 Sonnet        | CLAUDE_4_SONNET          | 8.8     | 20000         | 135.6          | 1197         | 10         | 30                 | 0      |
| 11   | Deepseek Chat          | CHAT                     | 7.4     | 26060         | 179.0          | 1333         | 8          | 919                | 0      |
| 12   | Claude 3.5 Haiku       | CLAUDE_3_5_HAIKU         | 7.1     | 7955          | 106.0          | 757          | 10         | 26                 | 0      |
| 13   | Gemini 2.5 Pro         | GEMINI_2_5_PRO_PREVIEW   | 5.8     | 16984         | 83.5           | 485          | 5          | 4                  | 0      |
| 14   | Gemini 2.5 Flash       | GEMINI_2_5_FLASH_PREVIEW | 5.3     | 9302          | 44.3           | 235          | 7          | 5                  | 0      |
| 15   | OpenAI o3 Mini         | O3_MINI_200K             | 4.6     | 10288         | 50.1           | 232          | 2          | 1                  | 0      |
| 16   | Mistral Large          | MISTRAL_LARGE            | 4.6     | 5764          | 59.4           | 272          | 0          | 0                  | 0      |
| 17   | OpenAI o4 Mini         | O4_MINI_200K             | 4.2     | 19960         | 91.2           | 380          | 8          | 0                  | 0      |
| 18   | Cohere Command A       | COMMAND_A                | 2.1     | 3212          | 21.2           | 44           | 2          | 10                 | 4      |
| 19   | Groq LLlama 3.3 70B    | LLAMA_3_3_70B            | 1.6     | 483           | 17.9           | 28           | 1          | 0                  | 6      |
| 20   | Cerebras Llama 3.3 70B | LLAMA_3_3_70B            | 0.6     | 4242          | 179.0          | 116          | 89         | 0                  | 4      |
| 21   | Cohere Command R+      | COMMAND_R_PLUS           | 0.0     | 0             | 37.2           | 0            | 6          | 186                | 8      |
| 22   | Bedrock Claude 3.7     | CLAUDE_3_7_SONNET        | 0.0     | 0             | 31.8           | 0            | 5          | 1                  | 12     |

### Time to First Token (TTFT) Ranking

| Rank | Provider               | Avg TTFT (ms) | Min TTFT | Max TTFT |
| ---- | ---------------------- | ------------- | -------- | -------- |
| 1    | Cohere Command R+      | 0             | 0        | 0        |
| 2    | Bedrock Claude 3.7     | 0             | 0        | 0        |
| 3    | Groq LLlama 3.3 70B    | 483           | 0        | 1932     |
| 4    | Groq Llama 4 Scout 17B | 2897          | 1709     | 4921     |
| 5    | Bedrock Nova Pro       | 3106          | 1931     | 5174     |
| 6    | Cohere Command A       | 3212          | 0        | 8202     |
| 7    | Cerebras Llama 3.3 70B | 4242          | 0        | 11812    |
| 8    | OpenAI GPT-4o Mini     | 4503          | 3164     | 6164     |
| 9    | OpenAI GPT-4o          | 5314          | 2584     | 7605     |
| 10   | Mistral Large          | 5764          | 0        | 12021    |
| 11   | Claude 4 Opus          | 6041          | 4369     | 7248     |
| 12   | Claude 3.7 Sonnet      | 6510          | 2596     | 9677     |
| 13   | OpenAI GPT-4.1 Mini    | 7037          | 2727     | 10115    |
| 14   | Claude 3.5 Haiku       | 7955          | 4616     | 9419     |
| 15   | OpenAI GPT-4.1         | 8683          | 2599     | 23589    |
| 16   | Bedrock Nova Premier   | 9005          | 2691     | 15964    |
| 17   | Gemini 2.5 Flash       | 9302          | 8466     | 11024    |
| 18   | OpenAI o3 Mini         | 10288         | 8175     | 14761    |
| 19   | Gemini 2.5 Pro         | 16984         | 8331     | 29033    |
| 20   | OpenAI o4 Mini         | 19960         | 8000     | 40983    |
| 21   | Claude 4 Sonnet        | 20000         | 3872     | 55225    |
| 22   | Deepseek Chat          | 26060         | 15636    | 35740    |

### Tool Calling Performance

| Rank | Provider               | Tool Calls | Avg Tool Time (ms) | Min Tool Time | Max Tool Time |
| ---- | ---------------------- | ---------- | ------------------ | ------------- | ------------- |
| 1    | OpenAI GPT-4o Mini     | 8          | 0                  | 0             | 0             |
| 2    | Groq Llama 4 Scout 17B | 5          | 0                  | 0             | 0             |
| 3    | Groq LLlama 3.3 70B    | 1          | 0                  | 0             | 0             |
| 4    | Bedrock Nova Pro       | 1          | 0                  | 0             | 0             |
| 5    | Bedrock Nova Premier   | 1          | 0                  | 0             | 0             |
| 6    | OpenAI GPT-4.1         | 8          | 0                  | 0             | 1             |
| 7    | Cerebras Llama 3.3 70B | 89         | 0                  | 0             | 1             |
| 8    | OpenAI o4 Mini         | 8          | 0                  | 0             | 1             |
| 9    | OpenAI GPT-4.1 Mini    | 14         | 0                  | 0             | 1             |
| 10   | OpenAI o3 Mini         | 2          | 1                  | 0             | 1             |
| 11   | OpenAI GPT-4o          | 15         | 1                  | 0             | 1             |
| 12   | Bedrock Claude 3.7     | 5          | 1                  | 0             | 4             |
| 13   | Gemini 2.5 Pro         | 5          | 4                  | 1             | 18            |
| 14   | Gemini 2.5 Flash       | 7          | 5                  | 0             | 28            |
| 15   | Cohere Command A       | 2          | 10                 | 6             | 14            |
| 16   | Claude 3.5 Haiku       | 10         | 26                 | 20            | 30            |
| 17   | Claude 4 Sonnet        | 10         | 30                 | 14            | 61            |
| 18   | Claude 4 Opus          | 8          | 35                 | 9             | 46            |
| 19   | Claude 3.7 Sonnet      | 10         | 44                 | 12            | 201           |
| 20   | Cohere Command R+      | 6          | 186                | 4             | 277           |
| 21   | Deepseek Chat          | 8          | 919                | 526           | 3641          |

### Per-Turn Performance Details

#### Turn 1: Hi! I'm planning a trip to Tokyo next month. What'...

Expected tools: Weather

| Provider               | Tokens | Time (ms) | TPS  | TTFT (ms) | Tools Used                 |
| ---------------------- | ------ | --------- | ---- | --------- | -------------------------- |
| OpenAI GPT-4o          | 48     | 4007      | 12.0 | 2584      | Weather                    |
| OpenAI GPT-4o Mini     | 71     | 6944      | 10.2 | 4820      | Weather                    |
| OpenAI o3 Mini         | 34     | 9172      | 3.7  | 8175      | Weather                    |
| OpenAI o4 Mini         | 43     | 9266      | 4.6  | 8000      | Weather                    |
| OpenAI GPT-4.1         | 51     | 4132      | 12.3 | 2599      | Weather                    |
| OpenAI GPT-4.1 Mini    | 81     | 5368      | 15.1 | 2727      | Weather                    |
| Claude 4 Opus          | 182    | 15802     | 11.5 | 4369      | Weather                    |
| Claude 4 Sonnet        | 170    | 14551     | 11.7 | 3872      | Weather                    |
| Claude 3.7 Sonnet      | 206    | 10025     | 20.5 | 2596      | Weather                    |
| Claude 3.5 Haiku       | 180    | 15659     | 11.5 | 4616      | Weather, AttractionsSearch |
| Gemini 2.5 Flash       | 36     | 9561      | 3.8  | 8503      | Weather                    |
| Gemini 2.5 Pro         | 29     | 9212      | 3.1  | 8331      | None                       |
| Groq Llama 4 Scout 17B | 24     | 3332      | 7.2  | 2623      | Weather                    |
| Groq LLlama 3.3 70B    | 0      | 0         | 0.0  | 0         | None                       |
| Cerebras Llama 3.3 70B | 53     | 13393     | 4.0  | 11812     | Weather                    |
| Cohere Command R+      | 0      | 0         | 0.0  | 0         | None                       |
| Cohere Command A       | 0      | 0         | 0.0  | 0         | None                       |
| Mistral Large          | 0      | 6247      | 0.0  | 0         | None                       |
| Bedrock Claude 3.7     | 0      | 0         | 0.0  | 0         | None                       |
| Bedrock Nova Pro       | 154    | 8438      | 18.3 | 5174      | Weather                    |
| Bedrock Nova Premier   | 476    | 21609     | 22.0 | 2691      | Weather                    |
| Deepseek Chat          | 111    | 21493     | 5.2  | 15636     | Weather                    |

#### Turn 2: Great! Can you find me some highly-rated vegetaria...

Expected tools: RestaurantSearch

| Provider               | Tokens | Time (ms) | TPS  | TTFT (ms) | Tools Used       |
| ---------------------- | ------ | --------- | ---- | --------- | ---------------- |
| OpenAI GPT-4o          | 69     | 8455      | 8.2  | 4191      | RestaurantSearch |
| OpenAI GPT-4o Mini     | 83     | 7046      | 11.8 | 3865      | RestaurantSearch |
| OpenAI o3 Mini         | 22     | 9014      | 2.4  | 8369      | RestaurantSearch |
| OpenAI o4 Mini         | 63     | 10866     | 5.8  | 8991      | RestaurantSearch |
| OpenAI GPT-4.1         | 95     | 7910      | 12.0 | 5050      | RestaurantSearch |
| OpenAI GPT-4.1 Mini    | 85     | 11810     | 7.2  | 7407      | RestaurantSearch |
| Claude 4 Opus          | 211    | 27785     | 7.6  | 5902      | RestaurantSearch |
| Claude 4 Sonnet        | 211    | 18469     | 11.4 | 5881      | RestaurantSearch |
| Claude 3.7 Sonnet      | 180    | 21414     | 8.4  | 9677      | RestaurantSearch |
| Claude 3.5 Haiku       | 160    | 25637     | 6.2  | 9167      | RestaurantSearch |
| Gemini 2.5 Flash       | 50     | 10733     | 4.7  | 9216      | RestaurantSearch |
| Gemini 2.5 Pro         | 46     | 16185     | 2.8  | 14703     | RestaurantSearch |
| Groq Llama 4 Scout 17B | 72     | 4908      | 14.7 | 2335      | RestaurantSearch |
| Groq LLlama 3.3 70B    | 28     | 2772      | 10.1 | 1932      | RestaurantSearch |
| Cerebras Llama 3.3 70B | 0      | 0         | 0.0  | 0         | None             |
| Cohere Command R+      | 0      | 0         | 0.0  | 0         | None             |
| Cohere Command A       | 0      | 0         | 0.0  | 0         | None             |
| Mistral Large          | 0      | 4111      | 0.0  | 0         | None             |
| Bedrock Claude 3.7     | 0      | 0         | 0.0  | 0         | None             |
| Bedrock Nova Pro       | 184    | 5885      | 31.3 | 2541      | None             |
| Bedrock Nova Premier   | 296    | 21230     | 13.9 | 9815      | None             |
| Deepseek Chat          | 174    | 44870     | 3.9  | 35740     | RestaurantSearch |

#### Turn 3: What are the top tourist attractions I should visi...

Expected tools: AttractionsSearch, OpeningHours

| Provider               | Tokens | Time (ms) | TPS  | TTFT (ms) | Tools Used                      |
| ---------------------- | ------ | --------- | ---- | --------- | ------------------------------- |
| OpenAI GPT-4o          | 118    | 10533     | 11.2 | 6874      | AttractionsSearch, OpeningHours |
| OpenAI GPT-4o Mini     | 168    | 11345     | 14.8 | 6164      | AttractionsSearch, OpeningHours |
| OpenAI o3 Mini         | 54     | 13541     | 4.0  | 9848      | None                            |
| OpenAI o4 Mini         | 67     | 23862     | 2.8  | 21865     | AttractionsSearch, OpeningHours |
| OpenAI GPT-4.1         | 93     | 26392     | 3.5  | 23589     | AttractionsSearch, OpeningHours |
| OpenAI GPT-4.1 Mini    | 99     | 12394     | 8.0  | 7897      | AttractionsSearch, OpeningHours |
| Claude 4 Opus          | 277    | 36835     | 7.5  | 6645      | AttractionsSearch, OpeningHours |
| Claude 4 Sonnet        | 249    | 28381     | 8.8  | 15022     | Weather, RestaurantSearch       |
| Claude 3.7 Sonnet      | 308    | 54467     | 5.7  | 6272      | AttractionsSearch, OpeningHours |
| Claude 3.5 Haiku       | 205    | 35771     | 5.7  | 8616      | AttractionsSearch, OpeningHours |
| Gemini 2.5 Flash       | 57     | 12728     | 4.5  | 11024     | AttractionsSearch               |
| Gemini 2.5 Pro         | 218    | 35632     | 6.1  | 29033     | AttractionsSearch, OpeningHours |
| Groq Llama 4 Scout 17B | 38     | 6042      | 6.3  | 4921      | OpeningHours                    |
| Groq LLlama 3.3 70B    | 0      | 0         | 0.0  | 0         | None                            |
| Cerebras Llama 3.3 70B | 63     | 7800      | 8.1  | 5157      | AttractionsSearch, OpeningHours |
| Cohere Command R+      | 0      | 0         | 0.0  | 0         | None                            |
| Cohere Command A       | 24     | 6363      | 3.8  | 4644      | None                            |
| Mistral Large          | 40     | 18959     | 2.1  | 11036     | None                            |
| Bedrock Claude 3.7     | 0      | 0         | 0.0  | 0         | None                            |
| Bedrock Nova Pro       | 81     | 4281      | 18.9 | 2776      | None                            |
| Bedrock Nova Premier   | 371    | 29429     | 12.6 | 15964     | None                            |
| Deepseek Chat          | 327    | 59058     | 5.5  | 33427     | AttractionsSearch, OpeningHours |

#### Turn 4: Based on the weather, restaurants, and attractions...

| Provider               | Tokens | Time (ms) | TPS  | TTFT (ms) | Tools Used                               |
| ---------------------- | ------ | --------- | ---- | --------- | ---------------------------------------- |
| OpenAI GPT-4o          | 295    | 16485     | 17.9 | 7605      | Weather, AttractionsSearch, OpeningHours |
| OpenAI GPT-4o Mini     | 361    | 16494     | 21.9 | 3164      | None                                     |
| OpenAI o3 Mini         | 122    | 18419     | 6.6  | 14761     | None                                     |
| OpenAI o4 Mini         | 207    | 47194     | 4.4  | 40983     | None                                     |
| OpenAI GPT-4.1         | 240    | 10715     | 22.4 | 3493      | None                                     |
| OpenAI GPT-4.1 Mini    | 291    | 25916     | 11.2 | 10115     | AttractionsSearch, OpeningHours          |
| Claude 4 Opus          | 623    | 37540     | 16.6 | 7248      | None                                     |
| Claude 4 Sonnet        | 567    | 74207     | 7.6  | 55225     | AttractionsSearch, OpeningHours          |
| Claude 3.7 Sonnet      | 486    | 38262     | 12.7 | 7494      | Weather, AttractionsSearch               |
| Claude 3.5 Haiku       | 212    | 28941     | 7.3  | 9419      | Weather                                  |
| Gemini 2.5 Flash       | 92     | 11243     | 8.2  | 8466      | None                                     |
| Gemini 2.5 Pro         | 192    | 22519     | 8.5  | 15868     | None                                     |
| Groq Llama 4 Scout 17B | 45     | 3061      | 14.7 | 1709      | None                                     |
| Groq LLlama 3.3 70B    | 0      | 0         | 0.0  | 0         | None                                     |
| Cerebras Llama 3.3 70B | 0      | 0         | 0.0  | 0         | None                                     |
| Cohere Command R+      | 0      | 0         | 0.0  | 0         | None                                     |
| Cohere Command A       | 20     | 9608      | 2.1  | 8202      | None                                     |
| Mistral Large          | 232    | 30043     | 7.7  | 12021     | None                                     |
| Bedrock Claude 3.7     | 0      | 0         | 0.0  | 0         | None                                     |
| Bedrock Nova Pro       | 406    | 7485      | 54.2 | 1931      | None                                     |
| Bedrock Nova Premier   | 643    | 32435     | 19.8 | 7551      | None                                     |
| Deepseek Chat          | 721    | 53600     | 13.5 | 19437     | None                                     |

### Error Summary

5 provider(s) experienced errors during testing:

| Provider               | Model             | Total Errors | Error Rate | Failed Turns                       |
| ---------------------- | ----------------- | ------------ | ---------- | ---------------------------------- |
| Bedrock Claude 3.7     | CLAUDE_3_7_SONNET | 12           | 300.0%     | 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4 |
| Cohere Command R+      | COMMAND_R_PLUS    | 8            | 200.0%     | 1, 1, 2, 2, 3, 3, 4, 4             |
| Groq LLlama 3.3 70B    | LLAMA_3_3_70B     | 6            | 150.0%     | 1, 1, 3, 3, 4, 4                   |
| Cerebras Llama 3.3 70B | LLAMA_3_3_70B     | 4            | 100.0%     | 2, 2, 4, 4                         |
| Cohere Command A       | COMMAND_A         | 4            | 100.0%     | 1, 1, 2, 2                         |

### Detailed Error Messages

**Bedrock Claude 3.7** (CLAUDE_3_7_SONNET):

- Turn 1: Bedrock rate limit: Too many tokens, please wait before trying again.
- Turn 1: Too many tokens, please wait before trying again.
- Turn 1: Too many tokens, please wait before trying again.
- Turn 2: Bedrock rate limit: Too many tokens, please wait before trying again.
- Turn 2: Too many tokens, please wait before trying again.
- Turn 2: Too many tokens, please wait before trying again.
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
- Turn 4: Groq tool calling error: 400 Failed to call a function. Please adjust your prompt. See 'failed_generation' for more details.. The model may not support the provided tool schema format.
- Turn 4: Groq tool calling error: 400 Failed to call a function. Please adjust your prompt. See 'failed_generation' for more details.. The model may not support the provided tool schema format.

**Cerebras Llama 3.3 70B** (LLAMA_3_3_70B):

- Turn 2: 400 status code (no body)
- Turn 2: 400 status code (no body)
- Turn 4: 400 status code (no body)
- Turn 4: 400 status code (no body)

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

**Common Error Patterns:**

- **AWS Bedrock**: 12 errors across 1 model(s) - likely authentication or region issues
- **Cohere**: 12 errors across 2 model(s) - possible tool schema compatibility issues
- **Tool-related**: 6 errors across 1 model(s) - tool execution or formatting issues
- **Other Providers**: 4 errors across 1 model(s)

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

1. **Bedrock Nova Pro** - 31.6 TPS
2. **Bedrock Nova Premier** - 17.1 TPS
3. **OpenAI GPT-4o Mini** - 16.3 TPS

### Responsiveness Leaders (Time to First Token)

1. **Cohere Command R+** - 0ms average TTFT
2. **Bedrock Claude 3.7** - 0ms average TTFT
3. **Groq LLlama 3.3 70B** - 483ms average TTFT

### Tool Calling Champions

1. **OpenAI GPT-4o Mini** - 0ms average tool execution
2. **Groq Llama 4 Scout 17B** - 0ms average tool execution
3. **Groq LLlama 3.3 70B** - 0ms average tool execution

### Tool Usage Patterns

| Provider               | Total Tool Calls | Unique Tools Used |
| ---------------------- | ---------------- | ----------------- |
| Cerebras Llama 3.3 70B | 89               | 3                 |
| OpenAI GPT-4o          | 15               | 4                 |
| OpenAI GPT-4.1 Mini    | 14               | 4                 |
| Claude 4 Sonnet        | 10               | 4                 |
| Claude 3.7 Sonnet      | 10               | 4                 |
| Claude 3.5 Haiku       | 10               | 4                 |
| OpenAI GPT-4o Mini     | 8                | 4                 |
| OpenAI o4 Mini         | 8                | 4                 |
| OpenAI GPT-4.1         | 8                | 4                 |
| Claude 4 Opus          | 8                | 4                 |
| Deepseek Chat          | 8                | 4                 |
| Gemini 2.5 Flash       | 7                | 3                 |
| Cohere Command R+      | 6                | 0                 |
| Gemini 2.5 Pro         | 5                | 3                 |
| Groq Llama 4 Scout 17B | 5                | 3                 |
| Bedrock Claude 3.7     | 5                | 0                 |
| OpenAI o3 Mini         | 2                | 2                 |
| Cohere Command A       | 2                | 0                 |
| Groq LLlama 3.3 70B    | 1                | 1                 |
| Bedrock Nova Pro       | 1                | 1                 |
| Bedrock Nova Premier   | 1                | 1                 |

## Test Environment

- Date: 2025-06-16T00:34:07.241Z
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

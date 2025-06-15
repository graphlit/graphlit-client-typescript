# Multi-turn Conversation Performance Comparison

## Test Scenario

A 4-turn conversation about planning a trip to Tokyo, covering:

1. General travel tips
2. Transportation system details
3. Dietary restrictions and food
4. Creating a 3-day itinerary

## Performance Metrics

### Overall Performance Ranking

| Rank | Provider               | Model                    | Avg TPS | Avg TTFT (ms) | Total Time (s) | Total Tokens | Errors |
| ---- | ---------------------- | ------------------------ | ------- | ------------- | -------------- | ------------ | ------ |
| 1    | Cohere Command R+      | COMMAND_R_PLUS           | 24.7    | 2433          | 38.8           | 957          | 0      |
| 2    | OpenAI GPT-4.1         | GPT41_1024K              | 24.3    | 1874          | 28.4           | 691          | 0      |
| 3    | OpenAI GPT-4.1 Mini    | GPT41_MINI_1024K         | 23.1    | 1868          | 24.8           | 573          | 0      |
| 4    | OpenAI GPT-4o          | GPT4O_128K               | 22.5    | 2556          | 32.0           | 719          | 0      |
| 5    | Bedrock Nova Pro       | NOVA_PRO                 | 22.3    | 1860          | 15.3           | 340          | 0      |
| 6    | OpenAI GPT-4o Mini     | GPT4O_MINI_128K          | 22.0    | 1855          | 24.0           | 528          | 0      |
| 7    | Claude 3.7 Sonnet      | CLAUDE_3_7_SONNET        | 21.9    | 2492          | 36.5           | 799          | 0      |
| 8    | Mistral Large          | MISTRAL_LARGE            | 20.3    | 2114          | 29.4           | 596          | 0      |
| 9    | Claude 3.5 Haiku       | CLAUDE_3_5_HAIKU         | 18.5    | 2597          | 30.0           | 555          | 0      |
| 10   | Claude 4 Sonnet        | CLAUDE_4_SONNET          | 18.0    | 3271          | 33.0           | 595          | 0      |
| 11   | Deepseek Chat          | CHAT                     | 17.3    | 3444          | 61.2           | 1056         | 0      |
| 12   | Groq LLlama 3.3 70B    | LLAMA_3_3_70B            | 14.6    | 1418          | 10.0           | 146          | 0      |
| 13   | Claude 4 Opus          | CLAUDE_4_OPUS            | 13.7    | 4322          | 76.9           | 1053         | 0      |
| 14   | Groq Llama 4 Scout 17B | LLAMA_4_SCOUT_17B        | 11.7    | 1463          | 9.0            | 105          | 0      |
| 15   | Bedrock Nova Premier   | NOVA_PREMIER             | 10.5    | 3006          | 26.8           | 282          | 0      |
| 16   | Cohere Command A       | COMMAND_A                | 10.5    | 1702          | 9.6            | 101          | 2      |
| 17   | OpenAI o4 Mini         | O4_MINI_200K             | 8.4     | 6622          | 35.4           | 297          | 0      |
| 18   | Cerebras Llama 3.3 70B | LLAMA_3_3_70B            | 8.2     | 1285          | 6.7            | 55           | 0      |
| 19   | Bedrock Claude 3.7     | CLAUDE_3_7_SONNET        | 8.1     | 3261          | 30.6           | 249          | 6      |
| 20   | OpenAI o3 Mini         | O3_MINI_200K             | 6.2     | 6226          | 31.4           | 195          | 0      |
| 21   | Gemini 2.5 Flash       | GEMINI_2_5_FLASH_PREVIEW | 3.6     | 2696          | 12.0           | 43           | 0      |
| 22   | Gemini 2.5 Pro         | GEMINI_2_5_PRO_PREVIEW   | 2.6     | 10582         | 46.0           | 121          | 0      |

### Time to First Token (TTFT) Ranking

| Rank | Provider               | Avg TTFT (ms) | Min TTFT | Max TTFT |
| ---- | ---------------------- | ------------- | -------- | -------- |
| 1    | Cerebras Llama 3.3 70B | 1285          | 1178     | 1472     |
| 2    | Groq LLlama 3.3 70B    | 1418          | 1258     | 1629     |
| 3    | Groq Llama 4 Scout 17B | 1463          | 1127     | 2113     |
| 4    | Cohere Command A       | 1702          | 1160     | 2428     |
| 5    | OpenAI GPT-4o Mini     | 1855          | 1409     | 2346     |
| 6    | Bedrock Nova Pro       | 1860          | 1728     | 1963     |
| 7    | OpenAI GPT-4.1 Mini    | 1868          | 1512     | 2150     |
| 8    | OpenAI GPT-4.1         | 1874          | 1575     | 2212     |
| 9    | Mistral Large          | 2114          | 1832     | 2722     |
| 10   | Cohere Command R+      | 2433          | 1843     | 2955     |
| 11   | Claude 3.7 Sonnet      | 2492          | 2020     | 2969     |
| 12   | OpenAI GPT-4o          | 2556          | 2037     | 3509     |
| 13   | Claude 3.5 Haiku       | 2597          | 2288     | 2811     |
| 14   | Gemini 2.5 Flash       | 2696          | 1848     | 3587     |
| 15   | Bedrock Nova Premier   | 3006          | 2568     | 3698     |
| 16   | Bedrock Claude 3.7     | 3261          | 2495     | 4027     |
| 17   | Claude 4 Sonnet        | 3271          | 2809     | 3620     |
| 18   | Deepseek Chat          | 3444          | 3219     | 4037     |
| 19   | Claude 4 Opus          | 4322          | 3544     | 5725     |
| 20   | OpenAI o3 Mini         | 6226          | 4434     | 9486     |
| 21   | OpenAI o4 Mini         | 6622          | 4907     | 8737     |
| 22   | Gemini 2.5 Pro         | 10582         | 8471     | 12492    |

### Per-Turn Performance Details

#### Turn 1: Hi! I'm planning a trip to Tokyo. What are the top...

| Provider               | Tokens | Time (ms) | TPS  | TTFT (ms) |
| ---------------------- | ------ | --------- | ---- | --------- |
| OpenAI GPT-4o          | 171    | 7687      | 22.2 | 2423      |
| OpenAI GPT-4o Mini     | 71     | 4495      | 15.8 | 2346      |
| OpenAI o3 Mini         | 39     | 10653     | 3.7  | 9486      |
| OpenAI o4 Mini         | 33     | 7742      | 4.3  | 6761      |
| OpenAI GPT-4.1         | 88     | 4498      | 19.6 | 1831      |
| OpenAI GPT-4.1 Mini    | 106    | 5280      | 20.1 | 2085      |
| Claude 4 Opus          | 203    | 13492     | 15.0 | 3734      |
| Claude 4 Sonnet        | 111    | 7335      | 15.1 | 3620      |
| Claude 3.7 Sonnet      | 155    | 7616      | 20.4 | 2383      |
| Claude 3.5 Haiku       | 184    | 8736      | 21.1 | 2698      |
| Gemini 2.5 Flash       | 10     | 3879      | 2.6  | 3587      |
| Gemini 2.5 Pro         | 26     | 9237      | 2.8  | 8471      |
| Groq Llama 4 Scout 17B | 22     | 2764      | 8.0  | 2113      |
| Groq LLlama 3.3 70B    | 37     | 2530      | 14.6 | 1423      |
| Cerebras Llama 3.3 70B | 13     | 1849      | 7.0  | 1472      |
| Cohere Command R+      | 137    | 5965      | 23.0 | 1843      |
| Cohere Command A       | 9      | 2870      | 3.1  | 2428      |
| Mistral Large          | 137    | 7807      | 17.5 | 1832      |
| Bedrock Claude 3.7     | 101    | 10269     | 9.8  | 2495      |
| Bedrock Nova Pro       | 71     | 3736      | 19.0 | 1884      |
| Bedrock Nova Premier   | 62     | 6258      | 9.9  | 3186      |
| Deepseek Chat          | 152    | 11711     | 13.0 | 4037      |

#### Turn 2: That's helpful! Can you elaborate on the transport...

| Provider               | Tokens | Time (ms) | TPS  | TTFT (ms) |
| ---------------------- | ------ | --------- | ---- | --------- |
| OpenAI GPT-4o          | 172    | 7438      | 23.1 | 2254      |
| OpenAI GPT-4o Mini     | 83     | 4592      | 18.1 | 2099      |
| OpenAI o3 Mini         | 40     | 6303      | 6.3  | 5100      |
| OpenAI o4 Mini         | 65     | 8036      | 8.1  | 6084      |
| OpenAI GPT-4.1         | 165    | 6925      | 23.8 | 1876      |
| OpenAI GPT-4.1 Mini    | 135    | 6241      | 21.6 | 2150      |
| Claude 4 Opus          | 273    | 20471     | 13.3 | 5725      |
| Claude 4 Sonnet        | 136    | 8005      | 17.0 | 3492      |
| Claude 3.7 Sonnet      | 187    | 8291      | 22.6 | 2596      |
| Claude 3.5 Haiku       | 92     | 6122      | 15.0 | 2811      |
| Gemini 2.5 Flash       | 10     | 2141      | 4.7  | 1848      |
| Gemini 2.5 Pro         | 25     | 10850     | 2.3  | 10036     |
| Groq Llama 4 Scout 17B | 28     | 1954      | 14.3 | 1127      |
| Groq LLlama 3.3 70B    | 32     | 2568      | 12.5 | 1629      |
| Cerebras Llama 3.3 70B | 14     | 1586      | 8.8  | 1178      |
| Cohere Command R+      | 202    | 9040      | 22.3 | 2955      |
| Cohere Command A       | 76     | 3451      | 22.0 | 1160      |
| Mistral Large          | 115    | 6185      | 18.6 | 2722      |
| Bedrock Claude 3.7     | 148    | 13485     | 11.0 | 4027      |
| Bedrock Nova Pro       | 70     | 3538      | 19.8 | 1864      |
| Bedrock Nova Premier   | 66     | 8067      | 8.2  | 3698      |
| Deepseek Chat          | 208    | 13053     | 15.9 | 3247      |

#### Turn 3: What about food allergies? I'm vegetarian and have...

| Provider               | Tokens | Time (ms) | TPS  | TTFT (ms) |
| ---------------------- | ------ | --------- | ---- | --------- |
| OpenAI GPT-4o          | 100    | 5035      | 19.9 | 2037      |
| OpenAI GPT-4o Mini     | 79     | 3938      | 20.1 | 1564      |
| OpenAI o3 Mini         | 33     | 5407      | 6.1  | 4434      |
| OpenAI o4 Mini         | 94     | 7734      | 12.2 | 4907      |
| OpenAI GPT-4.1         | 200    | 8227      | 24.3 | 2212      |
| OpenAI GPT-4.1 Mini    | 94     | 4558      | 20.6 | 1726      |
| Claude 4 Opus          | 293    | 20944     | 14.0 | 3544      |
| Claude 4 Sonnet        | 160    | 8328      | 19.2 | 3163      |
| Claude 3.7 Sonnet      | 189    | 7974      | 23.7 | 2020      |
| Claude 3.5 Haiku       | 112    | 6090      | 18.4 | 2288      |
| Gemini 2.5 Flash       | 12     | 3467      | 3.5  | 3124      |
| Gemini 2.5 Pro         | 30     | 12224     | 2.5  | 11330     |
| Groq Llama 4 Scout 17B | 22     | 1982      | 11.1 | 1326      |
| Groq LLlama 3.3 70B    | 33     | 2328      | 14.2 | 1362      |
| Cerebras Llama 3.3 70B | 13     | 1559      | 8.3  | 1191      |
| Cohere Command R+      | 304    | 11336     | 26.8 | 2188      |
| Cohere Command A       | 16     | 2078      | 7.7  | 1518      |
| Mistral Large          | 139    | 6636      | 20.9 | 2063      |
| Bedrock Nova Pro       | 74     | 3613      | 20.5 | 1963      |
| Bedrock Nova Premier   | 61     | 5366      | 11.4 | 2570      |
| Deepseek Chat          | 271    | 15060     | 18.0 | 3219      |

#### Turn 4: Based on everything we've discussed, can you creat...

| Provider               | Tokens | Time (ms) | TPS  | TTFT (ms) |
| ---------------------- | ------ | --------- | ---- | --------- |
| OpenAI GPT-4o          | 276    | 11821     | 23.3 | 3509      |
| OpenAI GPT-4o Mini     | 295    | 10949     | 26.9 | 1409      |
| OpenAI o3 Mini         | 83     | 9067      | 9.2  | 5883      |
| OpenAI o4 Mini         | 105    | 11905     | 8.8  | 8737      |
| OpenAI GPT-4.1         | 238    | 8734      | 27.2 | 1575      |
| OpenAI GPT-4.1 Mini    | 238    | 8704      | 27.3 | 1512      |
| Claude 4 Opus          | 284    | 21948     | 12.9 | 4283      |
| Claude 4 Sonnet        | 188    | 9339      | 20.1 | 2809      |
| Claude 3.7 Sonnet      | 268    | 12634     | 21.2 | 2969      |
| Claude 3.5 Haiku       | 167    | 9028      | 18.5 | 2590      |
| Gemini 2.5 Flash       | 11     | 2543      | 4.3  | 2225      |
| Gemini 2.5 Pro         | 40     | 13689     | 2.9  | 12492     |
| Groq Llama 4 Scout 17B | 33     | 2261      | 14.6 | 1287      |
| Groq LLlama 3.3 70B    | 44     | 2557      | 17.2 | 1258      |
| Cerebras Llama 3.3 70B | 15     | 1753      | 8.6  | 1298      |
| Cohere Command R+      | 314    | 12418     | 25.3 | 2744      |
| Mistral Large          | 205    | 8744      | 23.4 | 1839      |
| Bedrock Nova Pro       | 125    | 4375      | 28.6 | 1728      |
| Bedrock Nova Premier   | 93     | 7145      | 13.0 | 2568      |
| Deepseek Chat          | 425    | 21372     | 19.9 | 3271      |

## Key Insights

### Speed Leaders (Tokens Per Second)

1. **Cohere Command R+** - 24.7 TPS
2. **OpenAI GPT-4.1** - 24.3 TPS
3. **OpenAI GPT-4.1 Mini** - 23.1 TPS

### Responsiveness Leaders (Time to First Token)

1. **Cerebras Llama 3.3 70B** - 1285ms average TTFT
2. **Groq LLlama 3.3 70B** - 1418ms average TTFT
3. **Groq Llama 4 Scout 17B** - 1463ms average TTFT

### Token Efficiency

Some models generated significantly different token counts for the same prompts:

| Provider               | Total Tokens | Tokens per Turn |
| ---------------------- | ------------ | --------------- |
| Gemini 2.5 Flash       | 43           | 11              |
| Cerebras Llama 3.3 70B | 55           | 14              |
| Cohere Command A       | 101          | 25              |
| Groq Llama 4 Scout 17B | 105          | 26              |
| Gemini 2.5 Pro         | 121          | 30              |
| Groq LLlama 3.3 70B    | 146          | 37              |
| OpenAI o3 Mini         | 195          | 49              |
| Bedrock Claude 3.7     | 249          | 62              |
| Bedrock Nova Premier   | 282          | 71              |
| OpenAI o4 Mini         | 297          | 74              |
| Bedrock Nova Pro       | 340          | 85              |
| OpenAI GPT-4o Mini     | 528          | 132             |
| Claude 3.5 Haiku       | 555          | 139             |
| OpenAI GPT-4.1 Mini    | 573          | 143             |
| Claude 4 Sonnet        | 595          | 149             |
| Mistral Large          | 596          | 149             |
| OpenAI GPT-4.1         | 691          | 173             |
| OpenAI GPT-4o          | 719          | 180             |
| Claude 3.7 Sonnet      | 799          | 200             |
| Cohere Command R+      | 957          | 239             |
| Claude 4 Opus          | 1053         | 263             |
| Deepseek Chat          | 1056         | 264             |

## Test Environment

- Date: 2025-06-15T08:40:44.216Z
- Region: us-east-1 (for AWS Bedrock)
- Connection: Streaming enabled for all providers
- Temperature: 0.7 (consistent across all models)

## Methodology

- Each provider ran the same 4-turn conversation
- Metrics collected include tokens per second (TPS), time to first token (TTFT), and total processing time
- All tests run sequentially to avoid network congestion
- Error handling included to capture failed turns

---

_Generated by Graphlit TypeScript SDK Multi-turn Comparison Test_

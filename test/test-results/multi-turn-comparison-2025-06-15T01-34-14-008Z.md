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
| 1    | Cohere Command R+      | COMMAND_R_PLUS           | 26.2    | 1883          | 46.9           | 1226         | 0      |
| 2    | OpenAI GPT-4o          | GPT4O_128K               | 23.2    | 2035          | 27.1           | 628          | 0      |
| 3    | Deepseek Chat          | CHAT                     | 22.2    | 2925          | 56.7           | 1258         | 0      |
| 4    | Claude 3.7 Sonnet      | CLAUDE_3_7_SONNET        | 22.0    | 2557          | 32.9           | 724          | 0      |
| 5    | Mistral Large          | MISTRAL_LARGE            | 21.8    | 2457          | 38.9           | 848          | 0      |
| 6    | OpenAI GPT-4.1         | GPT41_1024K              | 20.8    | 1714          | 25.5           | 530          | 0      |
| 7    | OpenAI GPT-4.1 Mini    | GPT41_MINI_1024K         | 20.0    | 1424          | 14.2           | 284          | 0      |
| 8    | OpenAI GPT-4o Mini     | GPT4O_MINI_128K          | 20.0    | 2340          | 23.5           | 471          | 0      |
| 9    | Claude 3.5 Haiku       | CLAUDE_3_5_HAIKU         | 16.9    | 2517          | 32.5           | 549          | 0      |
| 10   | Claude 4 Sonnet        | CLAUDE_4_SONNET          | 16.8    | 2862          | 33.5           | 561          | 0      |
| 11   | Claude 4 Opus          | CLAUDE_4_OPUS            | 15.3    | 3435          | 71.0           | 1085         | 0      |
| 12   | Cohere Command A       | COMMAND_A                | 11.7    | 2189          | 11.5           | 135          | 2      |
| 13   | Groq Llama 4 Scout 17B | LLAMA_4_SCOUT_17B        | 11.1    | 1233          | 7.3            | 81           | 0      |
| 14   | Groq LLlama 3.3 70B    | LLAMA_3_3_70B            | 11.0    | 1511          | 12.7           | 140          | 0      |
| 15   | Cerebras Llama 3.3 70B | LLAMA_3_3_70B            | 9.0     | 1232          | 6.7            | 60           | 0      |
| 16   | Bedrock Claude 3.7     | CLAUDE_3_7_SONNET        | 7.5     | 2639          | 27.7           | 207          | 6      |
| 17   | OpenAI o4 Mini         | O4_MINI_200K             | 7.0     | 7756          | 39.3           | 276          | 0      |
| 18   | OpenAI o3 Mini         | O3_MINI_200K             | 5.8     | 5821          | 28.2           | 164          | 0      |
| 19   | Gemini 2.5 Pro         | GEMINI_2_5_PRO_PREVIEW   | 2.8     | 11860         | 51.8           | 144          | 0      |
| 20   | Gemini 2.5 Flash       | GEMINI_2_5_FLASH_PREVIEW | 2.5     | 3538          | 15.4           | 38           | 0      |

### Time to First Token (TTFT) Ranking

| Rank | Provider               | Avg TTFT (ms) | Min TTFT | Max TTFT |
| ---- | ---------------------- | ------------- | -------- | -------- |
| 1    | Cerebras Llama 3.3 70B | 1232          | 1061     | 1397     |
| 2    | Groq Llama 4 Scout 17B | 1233          | 961      | 1769     |
| 3    | OpenAI GPT-4.1 Mini    | 1424          | 1250     | 1864     |
| 4    | Groq LLlama 3.3 70B    | 1511          | 1347     | 1672     |
| 5    | OpenAI GPT-4.1         | 1714          | 1608     | 1771     |
| 6    | Cohere Command R+      | 1883          | 1597     | 2099     |
| 7    | OpenAI GPT-4o          | 2035          | 1887     | 2259     |
| 8    | Cohere Command A       | 2189          | 1077     | 3748     |
| 9    | OpenAI GPT-4o Mini     | 2340          | 1616     | 4339     |
| 10   | Mistral Large          | 2457          | 1942     | 3634     |
| 11   | Claude 3.5 Haiku       | 2517          | 2311     | 2672     |
| 12   | Claude 3.7 Sonnet      | 2557          | 1743     | 4954     |
| 13   | Bedrock Claude 3.7     | 2639          | 2528     | 2750     |
| 14   | Claude 4 Sonnet        | 2862          | 2675     | 3073     |
| 15   | Deepseek Chat          | 2925          | 2812     | 3035     |
| 16   | Claude 4 Opus          | 3435          | 3145     | 3828     |
| 17   | Gemini 2.5 Flash       | 3538          | 2298     | 5438     |
| 18   | OpenAI o3 Mini         | 5821          | 4791     | 7816     |
| 19   | OpenAI o4 Mini         | 7756          | 3799     | 11608    |
| 20   | Gemini 2.5 Pro         | 11860         | 8902     | 13767    |

### Per-Turn Performance Details

#### Turn 1: Hi! I'm planning a trip to Tokyo. What are the top...

| Provider               | Tokens | Time (ms) | TPS  | TTFT (ms) |
| ---------------------- | ------ | --------- | ---- | --------- |
| OpenAI GPT-4o          | 111    | 5610      | 19.8 | 2259      |
| OpenAI GPT-4o Mini     | 71     | 6470      | 11.0 | 4339      |
| OpenAI o3 Mini         | 23     | 6446      | 3.6  | 5763      |
| OpenAI o4 Mini         | 46     | 5184      | 8.9  | 3799      |
| OpenAI GPT-4.1         | 52     | 3163      | 16.4 | 1608      |
| OpenAI GPT-4.1 Mini    | 23     | 2534      | 9.1  | 1864      |
| Claude 4 Opus          | 218    | 15246     | 14.3 | 3145      |
| Claude 4 Sonnet        | 100    | 8570      | 11.7 | 2909      |
| Claude 3.7 Sonnet      | 156    | 6527      | 23.9 | 1765      |
| Claude 3.5 Haiku       | 174    | 11937     | 14.6 | 2572      |
| Gemini 2.5 Flash       | 7      | 4006      | 1.7  | 3794      |
| Gemini 2.5 Pro         | 31     | 9819      | 3.2  | 8902      |
| Groq Llama 4 Scout 17B | 17     | 2276      | 7.5  | 1769      |
| Groq LLlama 3.3 70B    | 31     | 2544      | 12.2 | 1638      |
| Cerebras Llama 3.3 70B | 16     | 1877      | 8.5  | 1397      |
| Cohere Command R+      | 102    | 5018      | 20.3 | 1958      |
| Cohere Command A       | 31     | 2665      | 11.6 | 1741      |
| Mistral Large          | 155    | 6763      | 22.9 | 2068      |
| Bedrock Claude 3.7     | 96     | 9411      | 10.2 | 2528      |
| Deepseek Chat          | 164    | 9041      | 18.1 | 2812      |

#### Turn 2: That's helpful! Can you elaborate on the transport...

| Provider               | Tokens | Time (ms) | TPS  | TTFT (ms) |
| ---------------------- | ------ | --------- | ---- | --------- |
| OpenAI GPT-4o          | 179    | 7445      | 24.0 | 2060      |
| OpenAI GPT-4o Mini     | 89     | 4301      | 20.7 | 1616      |
| OpenAI o3 Mini         | 40     | 9025      | 4.4  | 7816      |
| OpenAI o4 Mini         | 81     | 6604      | 12.3 | 4173      |
| OpenAI GPT-4.1         | 125    | 5511      | 22.7 | 1749      |
| OpenAI GPT-4.1 Mini    | 68     | 3306      | 20.6 | 1268      |
| Claude 4 Opus          | 298    | 17816     | 16.7 | 3412      |
| Claude 4 Sonnet        | 148    | 8470      | 17.5 | 3073      |
| Claude 3.7 Sonnet      | 143    | 9318      | 15.3 | 4954      |
| Claude 3.5 Haiku       | 89     | 5896      | 15.1 | 2672      |
| Gemini 2.5 Flash       | 9      | 2541      | 3.5  | 2298      |
| Gemini 2.5 Pro         | 34     | 14860     | 2.3  | 13767     |
| Groq Llama 4 Scout 17B | 15     | 1575      | 9.5  | 1140      |
| Groq LLlama 3.3 70B    | 28     | 5026      | 5.6  | 1672      |
| Cerebras Llama 3.3 70B | 13     | 1431      | 9.1  | 1061      |
| Cohere Command R+      | 407    | 16801     | 24.2 | 2099      |
| Cohere Command A       | 36     | 2153      | 16.7 | 1077      |
| Mistral Large          | 231    | 10590     | 21.8 | 3634      |
| Bedrock Claude 3.7     | 111    | 10559     | 10.5 | 2750      |
| Deepseek Chat          | 215    | 10861     | 19.8 | 3035      |

#### Turn 3: What about food allergies? I'm vegetarian and have...

| Provider               | Tokens | Time (ms) | TPS  | TTFT (ms) |
| ---------------------- | ------ | --------- | ---- | --------- |
| OpenAI GPT-4o          | 158    | 6630      | 23.8 | 1887      |
| OpenAI GPT-4o Mini     | 119    | 5382      | 22.1 | 1790      |
| OpenAI o3 Mini         | 41     | 6008      | 6.8  | 4791      |
| OpenAI o4 Mini         | 68     | 13493     | 5.0  | 11444     |
| OpenAI GPT-4.1         | 114    | 7845      | 14.5 | 1771      |
| OpenAI GPT-4.1 Mini    | 72     | 3456      | 20.8 | 1315      |
| Claude 4 Opus          | 256    | 18272     | 14.0 | 3356      |
| Claude 4 Sonnet        | 164    | 8435      | 19.4 | 2790      |
| Claude 3.7 Sonnet      | 164    | 6671      | 24.6 | 1743      |
| Claude 3.5 Haiku       | 136    | 6842      | 19.9 | 2311      |
| Gemini 2.5 Flash       | 12     | 2981      | 4.0  | 2620      |
| Gemini 2.5 Pro         | 43     | 14743     | 2.9  | 13453     |
| Groq Llama 4 Scout 17B | 26     | 1742      | 14.9 | 961       |
| Groq LLlama 3.3 70B    | 32     | 2286      | 14.0 | 1347      |
| Cerebras Llama 3.3 70B | 14     | 1730      | 8.1  | 1323      |
| Cohere Command R+      | 294    | 10436     | 28.2 | 1597      |
| Cohere Command A       | 68     | 5819      | 11.7 | 3748      |
| Mistral Large          | 184    | 7751      | 23.7 | 2184      |
| Deepseek Chat          | 327    | 16667     | 19.6 | 2893      |

#### Turn 4: Based on everything we've discussed, can you creat...

| Provider               | Tokens | Time (ms) | TPS  | TTFT (ms) |
| ---------------------- | ------ | --------- | ---- | --------- |
| OpenAI GPT-4o          | 180    | 7364      | 24.4 | 1935      |
| OpenAI GPT-4o Mini     | 192    | 7392      | 26.0 | 1616      |
| OpenAI o3 Mini         | 60     | 6712      | 8.9  | 4912      |
| OpenAI o4 Mini         | 81     | 14051     | 5.8  | 11608     |
| OpenAI GPT-4.1         | 239    | 8936      | 26.7 | 1729      |
| OpenAI GPT-4.1 Mini    | 121    | 4883      | 24.8 | 1250      |
| Claude 4 Opus          | 313    | 19653     | 15.9 | 3828      |
| Claude 4 Sonnet        | 149    | 7977      | 18.7 | 2675      |
| Claude 3.7 Sonnet      | 261    | 10425     | 25.0 | 1765      |
| Claude 3.5 Haiku       | 150    | 7863      | 19.1 | 2514      |
| Gemini 2.5 Flash       | 10     | 5836      | 1.7  | 5438      |
| Gemini 2.5 Pro         | 36     | 12391     | 2.9  | 11318     |
| Groq Llama 4 Scout 17B | 23     | 1733      | 13.3 | 1062      |
| Groq LLlama 3.3 70B    | 49     | 2864      | 17.1 | 1388      |
| Cerebras Llama 3.3 70B | 17     | 1641      | 10.4 | 1146      |
| Cohere Command R+      | 423    | 14599     | 29.0 | 1879      |
| Mistral Large          | 278    | 13760     | 20.2 | 1942      |
| Deepseek Chat          | 552    | 20162     | 27.4 | 2960      |

## Key Insights

### Speed Leaders (Tokens Per Second)

1. **Cohere Command R+** - 26.2 TPS
2. **OpenAI GPT-4o** - 23.2 TPS
3. **Deepseek Chat** - 22.2 TPS

### Responsiveness Leaders (Time to First Token)

1. **Cerebras Llama 3.3 70B** - 1232ms average TTFT
2. **Groq Llama 4 Scout 17B** - 1233ms average TTFT
3. **OpenAI GPT-4.1 Mini** - 1424ms average TTFT

### Token Efficiency

Some models generated significantly different token counts for the same prompts:

| Provider               | Total Tokens | Tokens per Turn |
| ---------------------- | ------------ | --------------- |
| Gemini 2.5 Flash       | 38           | 10              |
| Cerebras Llama 3.3 70B | 60           | 15              |
| Groq Llama 4 Scout 17B | 81           | 20              |
| Cohere Command A       | 135          | 34              |
| Groq LLlama 3.3 70B    | 140          | 35              |
| Gemini 2.5 Pro         | 144          | 36              |
| OpenAI o3 Mini         | 164          | 41              |
| Bedrock Claude 3.7     | 207          | 52              |
| OpenAI o4 Mini         | 276          | 69              |
| OpenAI GPT-4.1 Mini    | 284          | 71              |
| OpenAI GPT-4o Mini     | 471          | 118             |
| OpenAI GPT-4.1         | 530          | 133             |
| Claude 3.5 Haiku       | 549          | 137             |
| Claude 4 Sonnet        | 561          | 140             |
| OpenAI GPT-4o          | 628          | 157             |
| Claude 3.7 Sonnet      | 724          | 181             |
| Mistral Large          | 848          | 212             |
| Claude 4 Opus          | 1085         | 271             |
| Cohere Command R+      | 1226         | 307             |
| Deepseek Chat          | 1258         | 315             |

## Test Environment

- Date: 2025-06-15T01:34:14.008Z
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

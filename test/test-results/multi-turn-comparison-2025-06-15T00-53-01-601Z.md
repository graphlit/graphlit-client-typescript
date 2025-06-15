# Multi-turn Conversation Performance Comparison

## Test Scenario

A 4-turn conversation about planning a trip to Tokyo, covering:

1. General travel tips
2. Transportation system details
3. Dietary restrictions and food
4. Creating a 3-day itinerary

## Performance Metrics

### Overall Performance Ranking

| Rank | Provider               | Model             | Avg TPS | Avg TTFT (ms) | Total Time (s) | Total Tokens | Errors |
| ---- | ---------------------- | ----------------- | ------- | ------------- | -------------- | ------------ | ------ |
| 1    | Cohere Command R+      | COMMAND_R_PLUS    | 22.3    | 1675          | 29.7           | 663          | 0      |
| 2    | Gemini 1.5 Pro         | GEMINI_1_5_PRO    | 21.7    | 2050          | 24.4           | 529          | 0      |
| 3    | Deepseek Chat          | CHAT              | 20.7    | 2880          | 51.4           | 1063         | 0      |
| 4    | Claude 3.5 Sonnet      | CLAUDE_3_5_SONNET | 20.4    | 1952          | 20.2           | 413          | 0      |
| 5    | OpenAI GPT-4o          | GPT4O_128K        | 19.8    | 1997          | 29.5           | 584          | 0      |
| 6    | OpenAI GPT-4o Mini     | GPT4O_MINI_128K   | 19.6    | 1710          | 24.1           | 473          | 0      |
| 7    | Claude 3.5 Haiku       | CLAUDE_3_5_HAIKU  | 18.0    | 2866          | 36.8           | 662          | 0      |
| 8    | Bedrock Claude 3.7     | CLAUDE_3_7_SONNET | 16.7    | 3514          | 25.4           | 423          | 6      |
| 9    | Mistral Large          | MISTRAL_LARGE     | 15.7    | 2643          | 55.6           | 871          | 0      |
| 10   | Groq Llama 3.3 70B     | LLAMA_3_3_70B     | 10.3    | 2227          | 12.9           | 133          | 0      |
| 11   | Cerebras Llama 3.3 70B | LLAMA_3_3_70B     | 7.8     | 1229          | 6.4            | 50           | 0      |
| 12   | Gemini 2.0 Flash       | GEMINI_2_0_FLASH  | 5.8     | 2234          | 10.8           | 63           | 0      |

### Time to First Token (TTFT) Ranking

| Rank | Provider               | Avg TTFT (ms) | Min TTFT | Max TTFT |
| ---- | ---------------------- | ------------- | -------- | -------- |
| 1    | Cerebras Llama 3.3 70B | 1229          | 1070     | 1350     |
| 2    | Cohere Command R+      | 1675          | 1429     | 2041     |
| 3    | OpenAI GPT-4o Mini     | 1710          | 1513     | 1899     |
| 4    | Claude 3.5 Sonnet      | 1952          | 1594     | 2351     |
| 5    | OpenAI GPT-4o          | 1997          | 1707     | 2619     |
| 6    | Gemini 1.5 Pro         | 2050          | 1767     | 2573     |
| 7    | Groq Llama 3.3 70B     | 2227          | 1276     | 4712     |
| 8    | Gemini 2.0 Flash       | 2234          | 1180     | 4752     |
| 9    | Mistral Large          | 2643          | 1802     | 3467     |
| 10   | Claude 3.5 Haiku       | 2866          | 2147     | 3975     |
| 11   | Deepseek Chat          | 2880          | 2046     | 3462     |
| 12   | Bedrock Claude 3.7     | 3514          | 3474     | 3553     |

### Per-Turn Performance Details

#### Turn 1: Hi! I'm planning a trip to Tokyo. What are the top...

| Provider               | Tokens | Time (ms) | TPS  | TTFT (ms) |
| ---------------------- | ------ | --------- | ---- | --------- |
| OpenAI GPT-4o          | 95     | 5476      | 17.3 | 2619      |
| OpenAI GPT-4o Mini     | 99     | 4580      | 21.6 | 1614      |
| Claude 3.5 Sonnet      | 102    | 4802      | 21.2 | 1733      |
| Claude 3.5 Haiku       | 188    | 12575     | 15.0 | 2374      |
| Gemini 2.0 Flash       | 18     | 5297      | 3.4  | 4752      |
| Gemini 1.5 Pro         | 47     | 3327      | 14.1 | 1866      |
| Groq Llama 3.3 70B     | 34     | 5732      | 5.9  | 4712      |
| Cerebras Llama 3.3 70B | 12     | 1698      | 7.1  | 1347      |
| Cohere Command R+      | 104    | 4760      | 21.8 | 1663      |
| Mistral Large          | 123    | 6995      | 17.6 | 3288      |
| Bedrock Claude 3.7     | 193    | 9203      | 21.0 | 3474      |
| Deepseek Chat          | 161    | 10954     | 14.7 | 3032      |

#### Turn 2: That's helpful! Can you elaborate on the transport...

| Provider               | Tokens | Time (ms) | TPS  | TTFT (ms) |
| ---------------------- | ------ | --------- | ---- | --------- |
| OpenAI GPT-4o          | 167    | 10856     | 15.4 | 1905      |
| OpenAI GPT-4o Mini     | 106    | 4993      | 21.2 | 1814      |
| Claude 3.5 Sonnet      | 70     | 4231      | 16.5 | 2129      |
| Claude 3.5 Haiku       | 158    | 8995      | 17.6 | 3975      |
| Gemini 2.0 Flash       | 17     | 2024      | 8.4  | 1535      |
| Gemini 1.5 Pro         | 76     | 4344      | 17.5 | 1994      |
| Groq Llama 3.3 70B     | 27     | 2382      | 11.3 | 1577      |
| Cerebras Llama 3.3 70B | 13     | 1740      | 7.5  | 1350      |
| Cohere Command R+      | 172    | 7214      | 23.8 | 2041      |
| Mistral Large          | 253    | 28374     | 8.9  | 3467      |
| Bedrock Claude 3.7     | 230    | 9815      | 23.4 | 3553      |
| Deepseek Chat          | 223    | 11644     | 19.2 | 3462      |

#### Turn 3: What about food allergies? I'm vegetarian and have...

| Provider               | Tokens | Time (ms) | TPS  | TTFT (ms) |
| ---------------------- | ------ | --------- | ---- | --------- |
| OpenAI GPT-4o          | 148    | 6160      | 24.0 | 1707      |
| OpenAI GPT-4o Mini     | 94     | 7786      | 12.1 | 1899      |
| Claude 3.5 Sonnet      | 92     | 4360      | 21.1 | 1594      |
| Claude 3.5 Haiku       | 139    | 6557      | 21.2 | 2147      |
| Gemini 2.0 Flash       | 12     | 1513      | 7.9  | 1180      |
| Gemini 1.5 Pro         | 115    | 5409      | 21.3 | 1767      |
| Groq Llama 3.3 70B     | 30     | 2246      | 13.4 | 1344      |
| Cerebras Llama 3.3 70B | 12     | 1509      | 8.0  | 1149      |
| Cohere Command R+      | 200    | 10465     | 19.1 | 1429      |
| Mistral Large          | 208    | 9072      | 22.9 | 1802      |
| Deepseek Chat          | 270    | 12673     | 21.3 | 2979      |

#### Turn 4: Based on everything we've discussed, can you creat...

| Provider               | Tokens | Time (ms) | TPS  | TTFT (ms) |
| ---------------------- | ------ | --------- | ---- | --------- |
| OpenAI GPT-4o          | 174    | 7005      | 24.8 | 1757      |
| OpenAI GPT-4o Mini     | 174    | 6754      | 25.8 | 1513      |
| Claude 3.5 Sonnet      | 149    | 6830      | 21.8 | 2351      |
| Claude 3.5 Haiku       | 177    | 8634      | 20.5 | 2967      |
| Gemini 2.0 Flash       | 16     | 1947      | 8.2  | 1469      |
| Gemini 1.5 Pro         | 291    | 11345     | 25.7 | 2573      |
| Groq Llama 3.3 70B     | 42     | 2520      | 16.7 | 1276      |
| Cerebras Llama 3.3 70B | 13     | 1443      | 9.0  | 1070      |
| Cohere Command R+      | 187    | 7290      | 25.7 | 1567      |
| Mistral Large          | 287    | 11146     | 25.7 | 2015      |
| Deepseek Chat          | 409    | 16100     | 25.4 | 2046      |

## Key Insights

### Speed Leaders (Tokens Per Second)

1. **Cohere Command R+** - 22.3 TPS
2. **Gemini 1.5 Pro** - 21.7 TPS
3. **Deepseek Chat** - 20.7 TPS

### Responsiveness Leaders (Time to First Token)

1. **Cerebras Llama 3.3 70B** - 1229ms average TTFT
2. **Cohere Command R+** - 1675ms average TTFT
3. **OpenAI GPT-4o Mini** - 1710ms average TTFT

### Token Efficiency

Some models generated significantly different token counts for the same prompts:

| Provider               | Total Tokens | Tokens per Turn |
| ---------------------- | ------------ | --------------- |
| Cerebras Llama 3.3 70B | 50           | 13              |
| Gemini 2.0 Flash       | 63           | 16              |
| Groq Llama 3.3 70B     | 133          | 33              |
| Claude 3.5 Sonnet      | 413          | 103             |
| Bedrock Claude 3.7     | 423          | 106             |
| OpenAI GPT-4o Mini     | 473          | 118             |
| Gemini 1.5 Pro         | 529          | 132             |
| OpenAI GPT-4o          | 584          | 146             |
| Claude 3.5 Haiku       | 662          | 166             |
| Cohere Command R+      | 663          | 166             |
| Mistral Large          | 871          | 218             |
| Deepseek Chat          | 1063         | 266             |

## Test Environment

- Date: 2025-06-15T00:53:01.601Z
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

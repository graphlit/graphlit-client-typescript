# Multi-turn Conversation Performance Comparison (WITH TOOLS)

## Test Scenario

A 4-turn conversation about planning a trip to Tokyo, using tools for:

1. Weather lookup
2. Restaurant search (vegetarian with nut allergy)
3. Tourist attractions and opening hours
4. Creating a detailed 3-day itinerary

## Performance Metrics

### Overall Performance Ranking

| Rank | Provider               | Model             | Avg TPS | Avg TTFT (ms) | Total Time (s) | Total Tokens | Tool Calls | Avg Tool Time (ms) | Errors |
| ---- | ---------------------- | ----------------- | ------- | ------------- | -------------- | ------------ | ---------- | ------------------ | ------ |
| 1    | Claude 3.5 Sonnet      | CLAUDE_3_5_SONNET | 17.4    | 2161          | 40.6           | 707          | 5          | 20                 | 0      |
| 2    | Deepseek Chat          | CHAT              | 17.4    | 5385          | 55.5           | 965          | 2          | 692                | 0      |
| 3    | OpenAI GPT-4o Mini     | GPT4O_MINI_128K   | 16.5    | 3317          | 26.3           | 435          | 11         | 0                  | 0      |
| 4    | OpenAI GPT-4o          | GPT4O_128K        | 14.2    | 3722          | 26.0           | 370          | 12         | 1                  | 0      |
| 5    | Claude 3.5 Haiku       | CLAUDE_3_5_HAIKU  | 12.1    | 2920          | 62.3           | 756          | 12         | 26                 | 0      |
| 6    | Groq Llama 3.3 70B     | LLAMA_3_3_70B     | 3.1     | 3837          | 12.0           | 37           | 3          | 0                  | 4      |
| 7    | Mistral Large          | MISTRAL_LARGE     | 2.2     | 439           | 13.9           | 30           | 0          | 0                  | 0      |
| 8    | Cerebras Llama 3.3 70B | LLAMA_3_3_70B     | 0.6     | 25612         | 104.5          | 59           | 43         | 0                  | 0      |
| 9    | Gemini 2.0 Flash       | GEMINI_2_0_FLASH  | 0.0     | NaN           | 4.1            | 0            | 0          | 0                  | 8      |
| 10   | Gemini 1.5 Pro         | GEMINI_1_5_PRO    | 0.0     | NaN           | 3.9            | 0            | 0          | 0                  | 8      |
| 11   | Cohere Command R+      | COMMAND_R_PLUS    | 0.0     | NaN           | 3.8            | 0            | 0          | 0                  | 8      |
| 12   | Bedrock Claude 3.7     | CLAUDE_3_7_SONNET | 0.0     | NaN           | 25.6           | 0            | 0          | 0                  | 16     |

### Time to First Token (TTFT) Ranking

| Rank | Provider               | Avg TTFT (ms) | Min TTFT | Max TTFT  |
| ---- | ---------------------- | ------------- | -------- | --------- |
| 1    | Claude 3.5 Sonnet      | 2161          | 1749     | 2451      |
| 2    | Claude 3.5 Haiku       | 2920          | 2516     | 3386      |
| 3    | OpenAI GPT-4o Mini     | 3317          | 2015     | 4493      |
| 4    | OpenAI GPT-4o          | 3722          | 2704     | 5605      |
| 5    | Gemini 2.0 Flash       | NaN           | Infinity | -Infinity |
| 6    | Gemini 1.5 Pro         | NaN           | Infinity | -Infinity |
| 7    | Mistral Large          | 439           | 0        | 1754      |
| 8    | Groq Llama 3.3 70B     | 3837          | 2917     | 4757      |
| 9    | Deepseek Chat          | 5385          | 2890     | 8944      |
| 10   | Cerebras Llama 3.3 70B | 25612         | 1000     | 59181     |
| 11   | Cohere Command R+      | NaN           | Infinity | -Infinity |
| 12   | Bedrock Claude 3.7     | NaN           | Infinity | -Infinity |

### Tool Calling Performance

| Rank | Provider               | Tool Calls | Avg Tool Time (ms) | Min Tool Time | Max Tool Time |
| ---- | ---------------------- | ---------- | ------------------ | ------------- | ------------- |
| 1    | OpenAI GPT-4o Mini     | 11         | 0                  | 0             | 1             |
| 2    | Cerebras Llama 3.3 70B | 43         | 0                  | 0             | 1             |
| 3    | Groq Llama 3.3 70B     | 3          | 0                  | 0             | 1             |
| 4    | OpenAI GPT-4o          | 12         | 1                  | 0             | 1             |
| 5    | Claude 3.5 Sonnet      | 5          | 20                 | 15            | 32            |
| 6    | Claude 3.5 Haiku       | 12         | 26                 | 17            | 42            |
| 7    | Deepseek Chat          | 2          | 692                | 585           | 798           |

### Per-Turn Performance Details

#### Turn 1: Hi! I'm planning a trip to Tokyo next month. What'...

Expected tools: Weather

| Provider               | Tokens | Time (ms) | TPS  | TTFT (ms) | Tools Used                 |
| ---------------------- | ------ | --------- | ---- | --------- | -------------------------- |
| OpenAI GPT-4o          | 51     | 7130      | 7.2  | 5605      | Weather                    |
| OpenAI GPT-4o Mini     | 42     | 5749      | 7.3  | 4493      | Weather                    |
| Claude 3.5 Sonnet      | 143    | 7205      | 19.8 | 1749      | Weather                    |
| Claude 3.5 Haiku       | 136    | 15389     | 8.8  | 3142      | Weather, AttractionsSearch |
| Groq Llama 3.3 70B     | 21     | 5389      | 3.9  | 4757      | RestaurantSearch           |
| Cerebras Llama 3.3 70B | 24     | 41260     | 0.6  | 40552     | Weather                    |
| Mistral Large          | 0      | 2399      | 0.0  | 0         | None                       |
| Deepseek Chat          | 115    | 10506     | 10.9 | 6216      | Weather                    |

#### Turn 2: Great! Can you find me some highly-rated vegetaria...

Expected tools: RestaurantSearch

| Provider               | Tokens | Time (ms) | TPS  | TTFT (ms) | Tools Used                      |
| ---------------------- | ------ | --------- | ---- | --------- | ------------------------------- |
| OpenAI GPT-4o          | 51     | 4211      | 12.1 | 2704      | RestaurantSearch                |
| OpenAI GPT-4o Mini     | 69     | 4093      | 16.9 | 2015      | RestaurantSearch                |
| Claude 3.5 Sonnet      | 151    | 10729     | 14.1 | 2198      | RestaurantSearch                |
| Claude 3.5 Haiku       | 192    | 13764     | 13.9 | 2634      | RestaurantSearch                |
| Groq Llama 3.3 70B     | 16     | 3388      | 4.7  | 2917      | AttractionsSearch, OpeningHours |
| Cerebras Llama 3.3 70B | 9      | 59767     | 0.2  | 59181     | RestaurantSearch                |
| Mistral Large          | 0      | 5136      | 0.0  | 0         | None                            |
| Deepseek Chat          | 157    | 14068     | 11.2 | 8944      | RestaurantSearch                |

#### Turn 3: What are the top tourist attractions I should visi...

Expected tools: AttractionsSearch, OpeningHours

| Provider               | Tokens | Time (ms) | TPS  | TTFT (ms) | Tools Used                      |
| ---------------------- | ------ | --------- | ---- | --------- | ------------------------------- |
| OpenAI GPT-4o          | 87     | 5565      | 15.6 | 2944      | AttractionsSearch, OpeningHours |
| OpenAI GPT-4o Mini     | 105    | 6563      | 16.0 | 3421      | AttractionsSearch, OpeningHours |
| Claude 3.5 Sonnet      | 195    | 13419     | 14.5 | 2451      | AttractionsSearch, OpeningHours |
| Claude 3.5 Haiku       | 219    | 19657     | 11.1 | 3386      | AttractionsSearch, OpeningHours |
| Cerebras Llama 3.3 70B | 13     | 2102      | 6.2  | 1713      | None                            |
| Mistral Large          | 30     | 2994      | 10.0 | 1754      | None                            |
| Deepseek Chat          | 177    | 9766      | 18.1 | 3488      | None                            |

#### Turn 4: Based on the weather, restaurants, and attractions...

| Provider               | Tokens | Time (ms) | TPS  | TTFT (ms) | Tools Used                                   |
| ---------------------- | ------ | --------- | ---- | --------- | -------------------------------------------- |
| OpenAI GPT-4o          | 181    | 9087      | 19.9 | 3634      | AttractionsSearch, OpeningHours              |
| OpenAI GPT-4o Mini     | 219    | 9933      | 22.0 | 3339      | Weather, RestaurantSearch, AttractionsSearch |
| Claude 3.5 Sonnet      | 218    | 9255      | 23.6 | 2244      | None                                         |
| Claude 3.5 Haiku       | 209    | 13535     | 15.4 | 2516      | Weather, AttractionsSearch, RestaurantSearch |
| Cerebras Llama 3.3 70B | 13     | 1381      | 9.4  | 1000      | None                                         |
| Mistral Large          | 0      | 3346      | 0.0  | 0         | None                                         |
| Deepseek Chat          | 516    | 21127     | 24.4 | 2890      | None                                         |

## Key Insights

### Speed Leaders (Tokens Per Second)

1. **Claude 3.5 Sonnet** - 17.4 TPS
2. **Deepseek Chat** - 17.4 TPS
3. **OpenAI GPT-4o Mini** - 16.5 TPS

### Responsiveness Leaders (Time to First Token)

1. **Claude 3.5 Sonnet** - 2161ms average TTFT
2. **Claude 3.5 Haiku** - 2920ms average TTFT
3. **OpenAI GPT-4o Mini** - 3317ms average TTFT

### Tool Calling Champions

1. **OpenAI GPT-4o Mini** - 0ms average tool execution
2. **Cerebras Llama 3.3 70B** - 0ms average tool execution
3. **Groq Llama 3.3 70B** - 0ms average tool execution

### Tool Usage Patterns

| Provider               | Total Tool Calls | Unique Tools Used |
| ---------------------- | ---------------- | ----------------- |
| Cerebras Llama 3.3 70B | 43               | 2                 |
| OpenAI GPT-4o          | 12               | 4                 |
| Claude 3.5 Haiku       | 12               | 4                 |
| OpenAI GPT-4o Mini     | 11               | 4                 |
| Claude 3.5 Sonnet      | 5                | 4                 |
| Groq Llama 3.3 70B     | 3                | 3                 |
| Deepseek Chat          | 2                | 2                 |

## Test Environment

- Date: 2025-06-15T01:15:57.054Z
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

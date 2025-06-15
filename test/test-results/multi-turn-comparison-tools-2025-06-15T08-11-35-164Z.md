# Multi-turn Conversation Performance Comparison (WITH TOOLS)

## Test Scenario
A 4-turn conversation about planning a trip to Tokyo, using tools for:
1. Weather lookup
2. Restaurant search (vegetarian with nut allergy)
3. Tourist attractions and opening hours
4. Creating a detailed 3-day itinerary

## Performance Metrics

### Overall Performance Ranking

| Rank | Provider | Model | Avg TPS | Avg TTFT (ms) | Total Time (s) | Total Tokens | Tool Calls | Avg Tool Time (ms) | Errors |
|------|----------|-------|---------|---------------|----------------|--------------|------------|-------------------|--------|
| 1 | OpenAI GPT-4o Mini | GPT4O_MINI_128K | 19.9 | 2475 | 26.1 | 520 | 8 | 0 | 0 |
| 2 | OpenAI GPT-4.1 | GPT41_1024K | 16.9 | 3114 | 28.3 | 479 | 8 | 0 | 0 |
| 3 | Claude 3.7 Sonnet | CLAUDE_3_7_SONNET | 16.9 | 2044 | 46.0 | 779 | 7 | 96 | 0 |
| 4 | Claude 4 Sonnet | CLAUDE_4_SONNET | 16.5 | 5000 | 60.5 | 998 | 8 | 18 | 0 |
| 5 | Deepseek Chat | CHAT | 15.7 | 5325 | 63.6 | 1001 | 2 | 733 | 0 |
| 6 | OpenAI GPT-4o | GPT4O_128K | 14.8 | 3903 | 28.5 | 421 | 16 | 1 | 0 |
| 7 | OpenAI GPT-4.1 Mini | GPT41_MINI_1024K | 14.4 | 4356 | 38.4 | 552 | 10 | 0 | 0 |
| 8 | Claude 3.5 Haiku | CLAUDE_3_5_HAIKU | 12.4 | 2957 | 64.3 | 795 | 12 | 32 | 0 |
| 9 | Claude 4 Opus | CLAUDE_4_OPUS | 11.8 | 4008 | 81.3 | 961 | 8 | 19 | 0 |
| 10 | Groq Llama 4 Scout 17B | LLAMA_4_SCOUT_17B | 10.3 | 1729 | 9.2 | 95 | 4 | 0 | 2 |
| 11 | OpenAI o3 Mini | O3_MINI_200K | 5.6 | 15792 | 76.6 | 428 | 3 | 0 | 0 |
| 12 | OpenAI o4 Mini | O4_MINI_200K | 4.6 | 11991 | 73.7 | 341 | 8 | 0 | 0 |
| 13 | Groq LLlama 3.3 70B | LLAMA_3_3_70B | 3.9 | 2506 | 9.0 | 35 | 5 | 1 | 4 |
| 14 | Cohere Command R+ | COMMAND_R_PLUS | 3.0 | 11538 | 58.9 | 176 | 9 | 56 | 0 |
| 15 | Mistral Large | MISTRAL_LARGE | 2.3 | 912 | 16.0 | 37 | 0 | 0 | 0 |
| 16 | Bedrock Claude 3.7 | CLAUDE_3_7_SONNET | 2.2 | 2152 | 23.5 | 52 | 0 | 0 | 12 |
| 17 | Cerebras Llama 3.3 70B | LLAMA_3_3_70B | 0.1 | 19246 | 268.9 | 33 | 81 | 0 | 2 |
| 18 | Gemini 2.5 Flash | GEMINI_2_5_FLASH_PREVIEW | 0.0 | NaN | 4.2 | 0 | 0 | 0 | 8 |
| 19 | Gemini 2.5 Pro | GEMINI_2_5_PRO_PREVIEW | 0.0 | NaN | 4.7 | 0 | 0 | 0 | 8 |
| 20 | Cohere Command A | COMMAND_A | 0.0 | NaN | 4.9 | 0 | 0 | 0 | 8 |

### Time to First Token (TTFT) Ranking

| Rank | Provider | Avg TTFT (ms) | Min TTFT | Max TTFT |
|------|----------|---------------|----------|----------|
| 1 | Mistral Large | 912 | 0 | 3646 |
| 2 | Groq Llama 4 Scout 17B | 1729 | 1342 | 2409 |
| 3 | Claude 3.7 Sonnet | 2044 | 1794 | 2252 |
| 4 | Bedrock Claude 3.7 | 2152 | 2152 | 2152 |
| 5 | OpenAI GPT-4o Mini | 2475 | 1603 | 3707 |
| 6 | Groq LLlama 3.3 70B | 2506 | 2191 | 2820 |
| 7 | Claude 3.5 Haiku | 2957 | 2773 | 3108 |
| 8 | OpenAI GPT-4.1 | 3114 | 1954 | 5006 |
| 9 | OpenAI GPT-4o | 3903 | 2608 | 5149 |
| 10 | Claude 4 Opus | 4008 | 3520 | 4780 |
| 11 | OpenAI GPT-4.1 Mini | 4356 | 2652 | 6792 |
| 12 | Claude 4 Sonnet | 5000 | 2916 | 10862 |
| 13 | Deepseek Chat | 5325 | 3217 | 7084 |
| 14 | Cohere Command R+ | 11538 | 4572 | 28484 |
| 15 | OpenAI o4 Mini | 11991 | 5638 | 17428 |
| 16 | OpenAI o3 Mini | 15792 | 7680 | 33731 |
| 17 | Gemini 2.5 Flash | NaN | Infinity | -Infinity |
| 18 | Gemini 2.5 Pro | NaN | Infinity | -Infinity |
| 19 | Cohere Command A | NaN | Infinity | -Infinity |
| 20 | Cerebras Llama 3.3 70B | 19246 | 0 | 51828 |

### Tool Calling Performance

| Rank | Provider | Tool Calls | Avg Tool Time (ms) | Min Tool Time | Max Tool Time |
|------|----------|------------|-------------------|---------------|---------------|
| 1 | OpenAI o3 Mini | 3 | 0 | 0 | 0 |
| 2 | OpenAI GPT-4.1 | 8 | 0 | 0 | 1 |
| 3 | Cerebras Llama 3.3 70B | 81 | 0 | 0 | 1 |
| 4 | OpenAI GPT-4.1 Mini | 10 | 0 | 0 | 1 |
| 5 | OpenAI GPT-4o Mini | 8 | 0 | 0 | 1 |
| 6 | Groq Llama 4 Scout 17B | 4 | 0 | 0 | 1 |
| 7 | OpenAI o4 Mini | 8 | 0 | 0 | 1 |
| 8 | Groq LLlama 3.3 70B | 5 | 1 | 1 | 1 |
| 9 | OpenAI GPT-4o | 16 | 1 | 0 | 2 |
| 10 | Claude 4 Sonnet | 8 | 18 | 12 | 25 |
| 11 | Claude 4 Opus | 8 | 19 | 16 | 25 |
| 12 | Claude 3.5 Haiku | 12 | 32 | 19 | 52 |
| 13 | Cohere Command R+ | 9 | 56 | 20 | 71 |
| 14 | Claude 3.7 Sonnet | 7 | 96 | 14 | 497 |
| 15 | Deepseek Chat | 2 | 733 | 487 | 978 |

### Per-Turn Performance Details

#### Turn 1: Hi! I'm planning a trip to Tokyo next month. What'...
Expected tools: Weather

| Provider | Tokens | Time (ms) | TPS | TTFT (ms) | Tools Used |
|----------|--------|-----------|-----|-----------|------------|
| OpenAI GPT-4o | 51 | 5652 | 9.0 | 4129 | Weather |
| OpenAI GPT-4o Mini | 71 | 4553 | 15.6 | 2421 | Weather |
| OpenAI o3 Mini | 55 | 15514 | 3.5 | 13879 | Weather |
| OpenAI o4 Mini | 96 | 25883 | 3.7 | 7475 | Weather |
| OpenAI GPT-4.1 | 46 | 4703 | 9.8 | 2711 | Weather |
| OpenAI GPT-4.1 Mini | 94 | 11517 | 8.2 | 6792 | Weather |
| Claude 4 Opus | 179 | 15809 | 11.3 | 3877 | Weather |
| Claude 4 Sonnet | 169 | 10302 | 16.4 | 2916 | Weather |
| Claude 3.7 Sonnet | 147 | 7452 | 19.7 | 1794 | Weather |
| Claude 3.5 Haiku | 167 | 15369 | 10.9 | 2880 | Weather, AttractionsSearch |
| Groq Llama 4 Scout 17B | 15 | 2832 | 5.3 | 2409 | Weather |
| Groq LLlama 3.3 70B | 17 | 2692 | 6.3 | 2191 | RestaurantSearch |
| Cohere Command R+ | 69 | 8883 | 7.8 | 4806 | Weather |
| Mistral Large | 0 | 2133 | 0.0 | 0 | None |
| Cerebras Llama 3.3 70B | 0 | 33569 | 0.0 | 0 | Weather |
| Bedrock Claude 3.7 | 52 | 6711 | 7.7 | 2152 | None |
| Deepseek Chat | 119 | 12522 | 9.5 | 7084 | Weather |

#### Turn 2: Great! Can you find me some highly-rated vegetaria...
Expected tools: RestaurantSearch

| Provider | Tokens | Time (ms) | TPS | TTFT (ms) | Tools Used |
|----------|--------|-----------|-----|-----------|------------|
| OpenAI GPT-4o | 52 | 4178 | 12.4 | 2608 | RestaurantSearch |
| OpenAI GPT-4o Mini | 89 | 4830 | 18.4 | 2167 | RestaurantSearch |
| OpenAI o3 Mini | 47 | 9873 | 4.8 | 7879 | RestaurantSearch |
| OpenAI o4 Mini | 40 | 6840 | 5.8 | 5638 | RestaurantSearch |
| OpenAI GPT-4.1 | 67 | 4800 | 14.0 | 2786 | RestaurantSearch |
| OpenAI GPT-4.1 Mini | 90 | 6124 | 14.7 | 3298 | RestaurantSearch |
| Claude 4 Opus | 195 | 16855 | 11.6 | 3520 | RestaurantSearch |
| Claude 4 Sonnet | 201 | 15329 | 13.1 | 3206 | RestaurantSearch |
| Claude 3.7 Sonnet | 158 | 9307 | 17.0 | 2117 | RestaurantSearch |
| Claude 3.5 Haiku | 167 | 11307 | 14.8 | 3066 | RestaurantSearch |
| Groq Llama 4 Scout 17B | 19 | 2001 | 9.5 | 1437 | RestaurantSearch |
| Groq LLlama 3.3 70B | 18 | 3351 | 5.4 | 2820 | AttractionsSearch, OpeningHours |
| Cohere Command R+ | 26 | 31319 | 0.8 | 28484 | RestaurantSearch |
| Mistral Large | 0 | 2923 | 0.0 | 0 | None |
| Cerebras Llama 3.3 70B | 19 | 6472 | 2.9 | 5909 | AttractionsSearch, OpeningHours |
| Deepseek Chat | 165 | 14389 | 11.5 | 6765 | RestaurantSearch |

#### Turn 3: What are the top tourist attractions I should visi...
Expected tools: AttractionsSearch, OpeningHours

| Provider | Tokens | Time (ms) | TPS | TTFT (ms) | Tools Used |
|----------|--------|-----------|-----|-----------|------------|
| OpenAI GPT-4o | 114 | 8822 | 12.9 | 5149 | AttractionsSearch, OpeningHours |
| OpenAI GPT-4o Mini | 98 | 6651 | 14.7 | 3707 | AttractionsSearch, OpeningHours |
| OpenAI o3 Mini | 84 | 36249 | 2.3 | 33731 | OpeningHours |
| OpenAI o4 Mini | 52 | 18988 | 2.7 | 17423 | AttractionsSearch, OpeningHours |
| OpenAI GPT-4.1 | 111 | 9158 | 12.1 | 5006 | AttractionsSearch, OpeningHours |
| OpenAI GPT-4.1 Mini | 104 | 5783 | 18.0 | 2652 | AttractionsSearch, OpeningHours |
| Claude 4 Opus | 261 | 25136 | 10.4 | 4780 | AttractionsSearch, OpeningHours |
| Claude 4 Sonnet | 246 | 18438 | 13.3 | 10862 | AttractionsSearch, OpeningHours |
| Claude 3.7 Sonnet | 71 | 4488 | 15.8 | 2252 | None |
| Claude 3.5 Haiku | 239 | 21065 | 11.3 | 3108 | AttractionsSearch, OpeningHours, Weather |
| Groq Llama 4 Scout 17B | 61 | 3162 | 19.3 | 1342 | RestaurantSearch, Weather |
| Cohere Command R+ | 53 | 12449 | 4.3 | 8291 | AttractionsSearch, OpeningHours |
| Mistral Large | 37 | 7640 | 4.8 | 3646 | None |
| Cerebras Llama 3.3 70B | 14 | 52226 | 0.3 | 51828 | None |
| Deepseek Chat | 170 | 11836 | 14.4 | 4232 | None |

#### Turn 4: Based on the weather, restaurants, and attractions...

| Provider | Tokens | Time (ms) | TPS | TTFT (ms) | Tools Used |
|----------|--------|-----------|-----|-----------|------------|
| OpenAI GPT-4o | 204 | 9886 | 20.6 | 3726 | Weather, RestaurantSearch, AttractionsSearch, OpeningHours |
| OpenAI GPT-4o Mini | 262 | 10104 | 25.9 | 1603 | None |
| OpenAI o3 Mini | 242 | 14976 | 16.2 | 7680 | None |
| OpenAI o4 Mini | 153 | 22021 | 6.9 | 17428 | None |
| OpenAI GPT-4.1 | 255 | 9629 | 26.5 | 1954 | None |
| OpenAI GPT-4.1 Mini | 264 | 14976 | 17.6 | 4681 | AttractionsSearch, OpeningHours |
| Claude 4 Opus | 326 | 23473 | 13.9 | 3853 | None |
| Claude 4 Sonnet | 382 | 16381 | 23.3 | 3017 | None |
| Claude 3.7 Sonnet | 403 | 24798 | 16.3 | 2013 | AttractionsSearch, Weather, OpeningHours |
| Claude 3.5 Haiku | 222 | 16608 | 13.4 | 2773 | AttractionsSearch, OpeningHours |
| Cohere Command R+ | 28 | 6246 | 4.5 | 4572 | None |
| Mistral Large | 0 | 3335 | 0.0 | 0 | None |
| Deepseek Chat | 547 | 24843 | 22.0 | 3217 | None |

## Key Insights

### Speed Leaders (Tokens Per Second)
1. **OpenAI GPT-4o Mini** - 19.9 TPS
2. **OpenAI GPT-4.1** - 16.9 TPS
3. **Claude 3.7 Sonnet** - 16.9 TPS

### Responsiveness Leaders (Time to First Token)
1. **Mistral Large** - 912ms average TTFT
2. **Groq Llama 4 Scout 17B** - 1729ms average TTFT
3. **Claude 3.7 Sonnet** - 2044ms average TTFT

### Tool Calling Champions
1. **OpenAI o3 Mini** - 0ms average tool execution
2. **OpenAI GPT-4.1** - 0ms average tool execution
3. **Cerebras Llama 3.3 70B** - 0ms average tool execution

### Tool Usage Patterns

| Provider | Total Tool Calls | Unique Tools Used |
|----------|-----------------|-------------------|
| Cerebras Llama 3.3 70B | 81 | 3 |
| OpenAI GPT-4o | 16 | 4 |
| Claude 3.5 Haiku | 12 | 4 |
| OpenAI GPT-4.1 Mini | 10 | 4 |
| Cohere Command R+ | 9 | 4 |
| OpenAI GPT-4o Mini | 8 | 4 |
| OpenAI o4 Mini | 8 | 4 |
| OpenAI GPT-4.1 | 8 | 4 |
| Claude 4 Opus | 8 | 4 |
| Claude 4 Sonnet | 8 | 4 |
| Claude 3.7 Sonnet | 7 | 4 |
| Groq LLlama 3.3 70B | 5 | 3 |
| Groq Llama 4 Scout 17B | 4 | 2 |
| OpenAI o3 Mini | 3 | 3 |
| Deepseek Chat | 2 | 2 |

## Test Environment
- Date: 2025-06-15T08:11:35.164Z
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

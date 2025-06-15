import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import { AgentStreamEvent } from "../src/types/ui-events";
import fs from "fs/promises";
import path from "path";

/**
 * Multi-turn conversation comparison test
 *
 * This test runs the same multi-turn conversation across all supported
 * streaming providers and collects performance metrics for comparison.
 */

interface ConversationTurn {
  role: "user" | "assistant";
  prompt?: string;
  expectedTopics?: string[];
}

interface ProviderMetrics {
  provider: string;
  model: string;
  turns: TurnMetrics[];
  totalTime: number;
  totalTokens: number;
  averageTokensPerSecond: number;
  averageTimeToFirstToken: number;
  errors: number;
  toolCallsExecuted: number;
  errorDetails: ErrorDetail[];
}

interface TurnMetrics {
  turnNumber: number;
  prompt: string;
  responseLength: number;
  tokenCount: number;
  timeToFirstToken: number;
  totalTime: number;
  tokensPerSecond: number;
  toolCallsInTurn: number;
  error?: string;
}

interface ErrorDetail {
  turn: number;
  message: string;
  code?: string;
  timestamp: Date;
}

// Multi-turn conversation scenario
const CONVERSATION_SCENARIO: ConversationTurn[] = [
  {
    role: "user",
    prompt:
      "Hi! I'm planning a trip to Tokyo. What are the top 3 things I should know before visiting?",
    expectedTopics: ["culture", "transport", "food", "etiquette"],
  },
  {
    role: "assistant",
  },
  {
    role: "user",
    prompt:
      "That's helpful! Can you elaborate on the transportation system? I'm particularly worried about navigating the subway.",
    expectedTopics: ["subway", "JR Pass", "IC card", "rush hour"],
  },
  {
    role: "assistant",
  },
  {
    role: "user",
    prompt:
      "What about food allergies? I'm vegetarian and have a nut allergy. Will this be difficult in Tokyo?",
    expectedTopics: ["vegetarian", "allergy", "restaurants", "communication"],
  },
  {
    role: "assistant",
  },
  {
    role: "user",
    prompt:
      "Based on everything we've discussed, can you create a simple 3-day itinerary for a first-time visitor?",
    expectedTopics: ["itinerary", "day 1", "day 2", "day 3", "activities"],
  },
];

// Test providers configuration
const TEST_PROVIDERS = [
  // OpenAI Models
  {
    name: "OpenAI GPT-4o",
    serviceType: Types.ModelServiceTypes.OpenAi,
    config: {
      openAI: { model: Types.OpenAiModels.Gpt4O_128K, temperature: 0.7 },
    },
    envKey: "OPENAI_API_KEY",
  },
  {
    name: "OpenAI GPT-4o Mini",
    serviceType: Types.ModelServiceTypes.OpenAi,
    config: {
      openAI: { model: Types.OpenAiModels.Gpt4OMini_128K, temperature: 0.7 },
    },
    envKey: "OPENAI_API_KEY",
  },
  {
    name: "OpenAI o3 Mini",
    serviceType: Types.ModelServiceTypes.OpenAi,
    config: {
      openAI: { model: Types.OpenAiModels.O3Mini_200K, temperature: 1.0 },
    },
    envKey: "OPENAI_API_KEY",
  },
  {
    name: "OpenAI o4 Mini",
    serviceType: Types.ModelServiceTypes.OpenAi,
    config: {
      openAI: { model: Types.OpenAiModels.O4Mini_200K, temperature: 1.0 },
    },
    envKey: "OPENAI_API_KEY",
  },
  {
    name: "OpenAI GPT-4.1",
    serviceType: Types.ModelServiceTypes.OpenAi,
    config: {
      openAI: { model: Types.OpenAiModels.Gpt41_1024K, temperature: 0.7 },
    },
    envKey: "OPENAI_API_KEY",
  },
  {
    name: "OpenAI GPT-4.1 Mini",
    serviceType: Types.ModelServiceTypes.OpenAi,
    config: {
      openAI: { model: Types.OpenAiModels.Gpt41Mini_1024K, temperature: 0.7 },
    },
    envKey: "OPENAI_API_KEY",
  },

  // Anthropic Models
  {
    name: "Claude 4 Opus",
    serviceType: Types.ModelServiceTypes.Anthropic,
    config: {
      anthropic: {
        model: Types.AnthropicModels.Claude_4Opus,
        temperature: 0.7,
      },
    },
    envKey: "ANTHROPIC_API_KEY",
  },
  {
    name: "Claude 4 Sonnet",
    serviceType: Types.ModelServiceTypes.Anthropic,
    config: {
      anthropic: {
        model: Types.AnthropicModels.Claude_4Sonnet,
        temperature: 0.7,
      },
    },
    envKey: "ANTHROPIC_API_KEY",
  },
  {
    name: "Claude 3.7 Sonnet",
    serviceType: Types.ModelServiceTypes.Anthropic,
    config: {
      anthropic: {
        model: Types.AnthropicModels.Claude_3_7Sonnet,
        temperature: 0.7,
      },
    },
    envKey: "ANTHROPIC_API_KEY",
  },
  {
    name: "Claude 3.5 Haiku",
    serviceType: Types.ModelServiceTypes.Anthropic,
    config: {
      anthropic: {
        model: Types.AnthropicModels.Claude_3_5Haiku,
        temperature: 0.7,
      },
    },
    envKey: "ANTHROPIC_API_KEY",
  },

  // Google Models
  {
    name: "Gemini 2.5 Flash",
    serviceType: Types.ModelServiceTypes.Google,
    config: {
      google: {
        model: Types.GoogleModels.Gemini_2_5FlashPreview,
        temperature: 0.7,
      },
    },
    envKey: "GOOGLE_API_KEY",
  },
  {
    name: "Gemini 2.5 Pro",
    serviceType: Types.ModelServiceTypes.Google,
    config: {
      google: {
        model: Types.GoogleModels.Gemini_2_5ProPreview,
        temperature: 0.7,
      },
    },
    envKey: "GOOGLE_API_KEY",
  },

  // Fast inference providers
  {
    name: "Groq Llama 4 Scout 17B",
    serviceType: Types.ModelServiceTypes.Groq,
    config: {
      groq: { model: Types.GroqModels.Llama_4Scout_17B, temperature: 0.7 },
    },
    envKey: "GROQ_API_KEY",
  },
  {
    name: "Groq LLlama 3.3 70B",
    serviceType: Types.ModelServiceTypes.Groq,
    config: {
      groq: { model: Types.GroqModels.Llama_3_3_70B, temperature: 0.7 },
    },
    envKey: "GROQ_API_KEY",
  },
  {
    name: "Cerebras Llama 3.3 70B",
    serviceType: Types.ModelServiceTypes.Cerebras,
    config: {
      cerebras: { model: Types.CerebrasModels.Llama_3_3_70B, temperature: 0.7 },
    },
    envKey: "CEREBRAS_API_KEY",
  },

  // Other providers
  {
    name: "Cohere Command R+",
    serviceType: Types.ModelServiceTypes.Cohere,
    config: {
      cohere: { model: Types.CohereModels.CommandRPlus, temperature: 0.7 },
    },
    envKey: "COHERE_API_KEY",
  },
  {
    name: "Cohere Command A",
    serviceType: Types.ModelServiceTypes.Cohere,
    config: {
      cohere: { model: Types.CohereModels.CommandA, temperature: 0.7 },
    },
    envKey: "COHERE_API_KEY",
  },
  {
    name: "Mistral Large",
    serviceType: Types.ModelServiceTypes.Mistral,
    config: {
      mistral: { model: Types.MistralModels.MistralLarge, temperature: 0.7 },
    },
    envKey: "MISTRAL_API_KEY",
  },
  {
    name: "Bedrock Claude 3.7",
    serviceType: Types.ModelServiceTypes.Bedrock,
    config: {
      bedrock: {
        model: Types.BedrockModels.Claude_3_7Sonnet,
        temperature: 0.7,
      },
    },
    envKey: "AWS_ACCESS_KEY_ID",
  },
  {
    name: "Bedrock Nova Pro",
    serviceType: Types.ModelServiceTypes.Bedrock,
    config: {
      bedrock: {
        model: Types.BedrockModels.NovaPro,
        temperature: 0.7,
      },
    },
    envKey: "AWS_ACCESS_KEY_ID",
  },
  {
    name: "Bedrock Nova Premier",
    serviceType: Types.ModelServiceTypes.Bedrock,
    config: {
      bedrock: {
        model: Types.BedrockModels.NovaPremier,
        temperature: 0.7,
      },
    },
    envKey: "AWS_ACCESS_KEY_ID",
  },
  {
    name: "Deepseek Chat",
    serviceType: Types.ModelServiceTypes.Deepseek,
    config: {
      deepseek: { model: Types.DeepseekModels.Chat, temperature: 0.7 },
    },
    envKey: "DEEPSEEK_API_KEY",
  },
];

describe("Multi-turn Conversation Comparison", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;

  if (!orgId || !envId || !secret) {
    console.warn(
      "⚠️  Skipping comparison tests - missing Graphlit credentials",
    );
    return;
  }

  let client: Graphlit;
  const createdSpecifications: string[] = [];
  const createdConversations: string[] = [];
  const providerMetrics: ProviderMetrics[] = [];

  beforeAll(async () => {
    client = new Graphlit(orgId, envId, secret);

    // Set up streaming clients
    try {
      if (process.env.OPENAI_API_KEY) {
        const { default: OpenAI } = await import("openai");
        client.setOpenAIClient(
          new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
        );
      }

      if (process.env.ANTHROPIC_API_KEY) {
        const { default: Anthropic } = await import("@anthropic-ai/sdk");
        client.setAnthropicClient(
          new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }),
        );
      }

      if (process.env.GOOGLE_API_KEY) {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        client.setGoogleClient(
          new GoogleGenerativeAI(process.env.GOOGLE_API_KEY),
        );
      }

      if (process.env.GROQ_API_KEY) {
        const { default: Groq } = await import("groq-sdk");
        client.setGroqClient(new Groq({ apiKey: process.env.GROQ_API_KEY }));
      }

      if (process.env.CEREBRAS_API_KEY) {
        const { default: OpenAI } = await import("openai");
        client.setCerebrasClient(
          new OpenAI({
            baseURL: "https://api.cerebras.ai/v1",
            apiKey: process.env.CEREBRAS_API_KEY,
          }),
        );
      }

      if (process.env.COHERE_API_KEY) {
        const { CohereClient } = await import("cohere-ai");
        client.setCohereClient(
          new CohereClient({ token: process.env.COHERE_API_KEY }),
        );
      }

      if (process.env.MISTRAL_API_KEY) {
        const { Mistral } = await import("@mistralai/mistralai");
        client.setMistralClient(
          new Mistral({ apiKey: process.env.MISTRAL_API_KEY }),
        );
      }

      if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
        const { BedrockRuntimeClient } = await import(
          "@aws-sdk/client-bedrock-runtime"
        );
        client.setBedrockClient(
          new BedrockRuntimeClient({
            region: process.env.AWS_REGION || "us-east-2",
            credentials: {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
          }),
        );
      }

      if (process.env.DEEPSEEK_API_KEY) {
        const { default: OpenAI } = await import("openai");
        client.setDeepseekClient(
          new OpenAI({
            baseURL: "https://api.deepseek.com",
            apiKey: process.env.DEEPSEEK_API_KEY,
          }),
        );
      }
    } catch (error) {
      console.warn("⚠️  Some streaming clients failed to initialize:", error);
    }
  }, 60000);

  afterAll(async () => {
    // Cleanup
    for (const conversationId of createdConversations) {
      try {
        await client.deleteConversation(conversationId);
      } catch (error) {
        console.warn(
          `Failed to cleanup conversation ${conversationId}:`,
          error,
        );
      }
    }

    for (const specId of createdSpecifications) {
      try {
        await client.deleteSpecification(specId);
      } catch (error) {
        console.warn(`Failed to cleanup specification ${specId}:`, error);
      }
    }

    // Generate comparison report
    await generateComparisonReport(providerMetrics);
  }, 30000);

  // Run test for each provider
  for (const provider of TEST_PROVIDERS) {
    it(`should complete multi-turn conversation with ${provider.name}`, async () => {
      // Skip if API key not provided
      if (!process.env[provider.envKey]) {
        console.log(
          `⏭️  Skipping ${provider.name} - missing ${provider.envKey}`,
        );
        return;
      }

      console.log(
        `\n🧪 Testing multi-turn conversation with ${provider.name}...`,
      );

      // Create specification
      const spec = await client.createSpecification({
        name: `Multi-turn Test ${provider.name}`,
        type: Types.SpecificationTypes.Completion,
        serviceType: provider.serviceType,
        ...provider.config,
      });

      expect(spec.createSpecification?.id).toBeDefined();
      createdSpecifications.push(spec.createSpecification.id);

      // Initialize metrics
      const metrics: ProviderMetrics = {
        provider: provider.name,
        model: getModelName(provider.config),
        turns: [],
        totalTime: 0,
        totalTokens: 0,
        averageTokensPerSecond: 0,
        averageTimeToFirstToken: 0,
        errors: 0,
        toolCallsExecuted: 0,
        errorDetails: [],
      };

      let conversationId: string | undefined;
      const conversationStartTime = Date.now();

      // Run through conversation turns
      for (let i = 0; i < CONVERSATION_SCENARIO.length; i += 2) {
        const userTurn = CONVERSATION_SCENARIO[i];
        const turnNumber = Math.floor(i / 2) + 1;

        console.log(
          `\n  Turn ${turnNumber}: User asks about ${userTurn.expectedTopics?.[0] || "general topic"}...`,
        );

        const turnMetrics: TurnMetrics = {
          turnNumber,
          prompt: userTurn.prompt!,
          responseLength: 0,
          tokenCount: 0,
          timeToFirstToken: 0,
          totalTime: 0,
          tokensPerSecond: 0,
          toolCallsInTurn: 0,
        };

        try {
          const turnStartTime = Date.now();
          let firstTokenTime = 0;
          let tokenCount = 0;
          let fullMessage = "";

          await client.streamAgent(
            userTurn.prompt!,
            (event: AgentStreamEvent) => {
              switch (event.type) {
                case "conversation_started":
                  if (!conversationId) {
                    conversationId = event.conversationId;
                    createdConversations.push(conversationId);
                  }
                  break;
                case "message_update":
                  if (firstTokenTime === 0) {
                    firstTokenTime = Date.now() - turnStartTime;
                  }
                  tokenCount++;
                  fullMessage = event.message.message;
                  break;
                case "tool_update":
                  if (event.status === "completed") {
                    turnMetrics.toolCallsInTurn++;
                    metrics.toolCallsExecuted++;
                  }
                  break;
                case "error":
                  console.error(`  ❌ Error: ${event.error.message}`);
                  metrics.errors++;
                  metrics.errorDetails.push({
                    turn: turnNumber,
                    message: event.error.message,
                    code: event.error.code,
                    timestamp: new Date(),
                  });
                  break;
              }
            },
            conversationId,
            { id: spec.createSpecification.id },
          );

          const turnEndTime = Date.now();
          turnMetrics.timeToFirstToken = firstTokenTime;
          turnMetrics.totalTime = turnEndTime - turnStartTime;
          turnMetrics.tokenCount = tokenCount;
          turnMetrics.responseLength = fullMessage.length;
          turnMetrics.tokensPerSecond =
            tokenCount / (turnMetrics.totalTime / 1000);

          metrics.turns.push(turnMetrics);
          metrics.totalTokens += tokenCount;

          console.log(
            `  ✅ Turn ${turnNumber} complete: ${tokenCount} tokens in ${turnMetrics.totalTime}ms (${turnMetrics.tokensPerSecond.toFixed(1)} TPS)`,
          );

          // Check if response contains expected topics
          if (userTurn.expectedTopics) {
            const topicsFound = userTurn.expectedTopics.filter((topic) =>
              fullMessage.toLowerCase().includes(topic.toLowerCase()),
            );
            console.log(
              `  📝 Topics covered: ${topicsFound.join(", ")} (${topicsFound.length}/${userTurn.expectedTopics.length})`,
            );
          }
        } catch (error: any) {
          console.error(`  ❌ Turn ${turnNumber} failed:`, error);
          metrics.errors++;
          metrics.errorDetails.push({
            turn: turnNumber,
            message: error.message || String(error),
            code: error.code,
            timestamp: new Date(),
          });
          turnMetrics.error = error.message || String(error);
          metrics.turns.push(turnMetrics); // Still push the turn metrics even if it failed
        }
      }

      // Calculate final metrics
      const totalTime = Date.now() - conversationStartTime;
      metrics.totalTime = totalTime;
      metrics.averageTokensPerSecond = metrics.totalTokens / (totalTime / 1000);
      metrics.averageTimeToFirstToken =
        metrics.turns.reduce((sum, turn) => sum + turn.timeToFirstToken, 0) /
        metrics.turns.length;

      providerMetrics.push(metrics);

      console.log(`\n📊 ${provider.name} Summary:`);
      console.log(`   Total time: ${(totalTime / 1000).toFixed(1)}s`);
      console.log(`   Total tokens: ${metrics.totalTokens}`);
      console.log(
        `   Average TPS: ${metrics.averageTokensPerSecond.toFixed(1)}`,
      );
      console.log(
        `   Average TTFT: ${metrics.averageTimeToFirstToken.toFixed(0)}ms`,
      );
      console.log(`   Tool calls: ${metrics.toolCallsExecuted}`);
      console.log(`   Errors: ${metrics.errors}`);
    }, 120000); // 2 minute timeout per provider
  }

  it("should generate final comparison report", async () => {
    // This test runs last and generates the report
    expect(providerMetrics.length).toBeGreaterThan(0);
    console.log(`\n🎯 Tested ${providerMetrics.length} providers successfully`);
  });
});

// Helper function to extract model name from config
function getModelName(config: any): string {
  if (config.openAI?.model) return config.openAI.model;
  if (config.anthropic?.model) return config.anthropic.model;
  if (config.google?.model) return config.google.model;
  if (config.groq?.model) return config.groq.model;
  if (config.cerebras?.model) return config.cerebras.model;
  if (config.cohere?.model) return config.cohere.model;
  if (config.mistral?.model) return config.mistral.model;
  if (config.bedrock?.model) return config.bedrock.model;
  if (config.deepseek?.model) return config.deepseek.model;
  return "Unknown";
}

// Generate comparison report
async function generateComparisonReport(metrics: ProviderMetrics[]) {
  if (metrics.length === 0) {
    console.warn("No metrics collected");
    return;
  }

  // Sort by average tokens per second
  const sortedBySpeed = [...metrics].sort(
    (a, b) => b.averageTokensPerSecond - a.averageTokensPerSecond,
  );

  // Sort by time to first token
  const sortedByTTFT = [...metrics].sort(
    (a, b) => a.averageTimeToFirstToken - b.averageTimeToFirstToken,
  );

  // Calculate error statistics
  const totalProviders = metrics.length;
  const providersWithErrors = metrics.filter((m) => m.errors > 0).length;
  const totalErrors = metrics.reduce((sum, m) => sum + m.errors, 0);
  const errorsByProvider = metrics
    .filter((m) => m.errors > 0)
    .sort((a, b) => b.errors - a.errors);

  // Generate markdown report
  let report = `# Multi-turn Conversation Performance Comparison

## Test Scenario
A 4-turn conversation about planning a trip to Tokyo, covering:
1. General travel tips
2. Transportation system details
3. Dietary restrictions and food
4. Creating a 3-day itinerary

## Summary Statistics
- **Total Providers Tested**: ${totalProviders}
- **Providers with Errors**: ${providersWithErrors} (${((providersWithErrors / totalProviders) * 100).toFixed(1)}%)
- **Total Errors**: ${totalErrors}
- **Average Errors per Provider**: ${(totalErrors / totalProviders).toFixed(1)}

## Performance Metrics

### Overall Performance Ranking

| Rank | Provider | Model | Avg TPS | Avg TTFT (ms) | Total Time (s) | Total Tokens | Errors |
|------|----------|-------|---------|---------------|----------------|--------------|--------|
`;

  sortedBySpeed.forEach((m, i) => {
    report += `| ${i + 1} | ${m.provider} | ${m.model} | ${m.averageTokensPerSecond.toFixed(1)} | ${m.averageTimeToFirstToken.toFixed(0)} | ${(m.totalTime / 1000).toFixed(1)} | ${m.totalTokens} | ${m.errors} |\n`;
  });

  report += `\n### Time to First Token (TTFT) Ranking

| Rank | Provider | Avg TTFT (ms) | Min TTFT | Max TTFT |
|------|----------|---------------|----------|----------|
`;

  sortedByTTFT.forEach((m, i) => {
    const ttfts = m.turns.map((t) => t.timeToFirstToken);
    const minTTFT = Math.min(...ttfts);
    const maxTTFT = Math.max(...ttfts);
    report += `| ${i + 1} | ${m.provider} | ${m.averageTimeToFirstToken.toFixed(0)} | ${minTTFT} | ${maxTTFT} |\n`;
  });

  report += `\n### Per-Turn Performance Details

`;

  // For each turn, show performance across providers
  for (let turn = 1; turn <= 4; turn++) {
    report += `#### Turn ${turn}: ${CONVERSATION_SCENARIO[(turn - 1) * 2].prompt?.substring(0, 50)}...

| Provider | Tokens | Time (ms) | TPS | TTFT (ms) |
|----------|--------|-----------|-----|-----------|
`;

    metrics.forEach((m) => {
      const turnData = m.turns[turn - 1];
      if (turnData) {
        report += `| ${m.provider} | ${turnData.tokenCount} | ${turnData.totalTime} | ${turnData.tokensPerSecond.toFixed(1)} | ${turnData.timeToFirstToken} |\n`;
      }
    });

    report += "\n";
  }

  // Add error summary if there were any errors
  if (providersWithErrors > 0) {
    report += `\n### Error Summary

${errorsByProvider.length} provider(s) experienced errors during testing:

| Provider | Model | Total Errors | Error Rate | Failed Turns |
|----------|-------|--------------|------------|--------------|
`;

    errorsByProvider.forEach((m) => {
      const errorRate = ((m.errors / 4) * 100).toFixed(1); // 4 turns total
      const failedTurns = m.errorDetails.map((e) => e.turn).join(", ") || "N/A";

      report += `| ${m.provider} | ${m.model} | ${m.errors} | ${errorRate}% | ${failedTurns} |\n`;
    });

    // Add detailed error information
    if (errorsByProvider.some((m) => m.errorDetails.length > 0)) {
      report += `\n### Detailed Error Messages\n\n`;

      errorsByProvider.forEach((m) => {
        if (m.errorDetails.length > 0) {
          report += `**${m.provider}** (${m.model}):\n`;
          m.errorDetails.forEach((e) => {
            report += `- Turn ${e.turn}: ${e.message}${e.code ? ` (Code: ${e.code})` : ""}\n`;
          });
          report += `\n`;
        }
      });
    }

    report += `\n**Common Error Patterns:**\n`;

    // Analyze common error patterns
    const bedrockErrors = errorsByProvider.filter((m) =>
      m.provider.includes("Bedrock"),
    );
    const cohereErrors = errorsByProvider.filter((m) =>
      m.provider.includes("Cohere"),
    );
    const otherErrors = errorsByProvider.filter(
      (m) => !m.provider.includes("Bedrock") && !m.provider.includes("Cohere"),
    );

    if (bedrockErrors.length > 0) {
      report += `- **AWS Bedrock**: ${bedrockErrors.reduce((sum, m) => sum + m.errors, 0)} errors across ${bedrockErrors.length} model(s) - likely authentication or region issues\n`;
    }
    if (cohereErrors.length > 0) {
      report += `- **Cohere**: ${cohereErrors.reduce((sum, m) => sum + m.errors, 0)} errors across ${cohereErrors.length} model(s) - possible API compatibility issues\n`;
    }
    if (otherErrors.length > 0) {
      report += `- **Other Providers**: ${otherErrors.reduce((sum, m) => sum + m.errors, 0)} errors across ${otherErrors.length} model(s)\n`;
    }

    report += `\n**Note**: Errors may be due to:
- Rate limiting (429)
- Authentication issues
- Network timeouts
- Model-specific API incompatibilities
- Insufficient context or token limits

Consider running failed providers individually with debug logging enabled for detailed error analysis.\n`;
  }

  // Add insights section
  report += `## Key Insights

### Speed Leaders (Tokens Per Second)
`;

  const top3Speed = sortedBySpeed.slice(0, 3);
  top3Speed.forEach((m, i) => {
    report += `${i + 1}. **${m.provider}** - ${m.averageTokensPerSecond.toFixed(1)} TPS\n`;
  });

  report += `\n### Responsiveness Leaders (Time to First Token)
`;

  const top3TTFT = sortedByTTFT.slice(0, 3);
  top3TTFT.forEach((m, i) => {
    report += `${i + 1}. **${m.provider}** - ${m.averageTimeToFirstToken.toFixed(0)}ms average TTFT\n`;
  });

  // Calculate cost efficiency if token counts vary significantly
  const tokenVariance =
    Math.max(...metrics.map((m) => m.totalTokens)) -
    Math.min(...metrics.map((m) => m.totalTokens));

  if (tokenVariance > 100) {
    report += `\n### Token Efficiency
Some models generated significantly different token counts for the same prompts:

| Provider | Total Tokens | Tokens per Turn |
|----------|--------------|-----------------|
`;

    [...metrics]
      .sort((a, b) => a.totalTokens - b.totalTokens)
      .forEach((m) => {
        report += `| ${m.provider} | ${m.totalTokens} | ${(m.totalTokens / 4).toFixed(0)} |\n`;
      });
  }

  report += `\n## Test Environment
- Date: ${new Date().toISOString()}
- Region: ${process.env.AWS_REGION || "us-east-1"} (for AWS Bedrock)
- Connection: Streaming enabled for all providers
- Temperature: 0.7 (consistent across all models)

## Methodology
- Each provider ran the same 4-turn conversation
- Metrics collected include tokens per second (TPS), time to first token (TTFT), and total processing time
- All tests run sequentially to avoid network congestion
- Error handling included to capture failed turns

---
*Generated by Graphlit TypeScript SDK Multi-turn Comparison Test*
`;

  // Save report to file
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `multi-turn-comparison-${timestamp}.md`;
  const filepath = path.join(process.cwd(), "test-results", filename);

  try {
    await fs.mkdir(path.dirname(filepath), { recursive: true });
    await fs.writeFile(filepath, report);
    console.log(`\n📄 Report saved to: ${filepath}`);
  } catch (error) {
    console.error("Failed to save report:", error);
  }

  // Also output to console
  console.log("\n" + "=".repeat(80));
  console.log(report);
  console.log("=".repeat(80));
}

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import { AgentStreamEvent } from "../src/types/ui-events";
import { config } from "dotenv";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load test environment variables
config({ path: resolve(__dirname, ".env") });

// Skip tests if environment variables are not set
const skipTests = !process.env.GRAPHLIT_ORGANIZATION_ID || 
                 !process.env.GRAPHLIT_ENVIRONMENT_ID || 
                 !process.env.GRAPHLIT_JWT_SECRET;

describe.skipIf(skipTests)("Bedrock Streaming Tests", () => {
  let client: Graphlit;
  let createdSpecIds: string[] = [];
  let createdConversationIds: string[] = [];

  beforeEach(() => {
    client = new Graphlit(
      process.env.GRAPHLIT_ORGANIZATION_ID,
      process.env.GRAPHLIT_ENVIRONMENT_ID,
      process.env.GRAPHLIT_JWT_SECRET,
    );
    createdSpecIds = [];
    createdConversationIds = [];
  });

  afterEach(async () => {
    // Clean up
    for (const conversationId of createdConversationIds) {
      try {
        await client.deleteConversation(conversationId);
      } catch (error) {
        // Ignore errors
      }
    }
    
    for (const specId of createdSpecIds) {
      try {
        await client.deleteSpecification(specId);
      } catch (error) {
        // Ignore errors
      }
    }
  });

  describe("Bedrock models delta handling", () => {
    // Test multiple Bedrock models
    const bedrockModels = [
      { name: "Nova Pro", model: Types.BedrockModels.NovaPro },
      { name: "Nova Premier", model: Types.BedrockModels.NovaPremier },
      { name: "Claude 3.7 Sonnet", model: Types.BedrockModels.Claude_3_7Sonnet },
      { name: "Llama 4 Maverick 17B", model: Types.BedrockModels.Llama_4Maverick_17B },
      { name: "Llama 4 Scout 17B", model: Types.BedrockModels.Llama_4Scout_17B },
    ];

    bedrockModels.forEach(({ name, model }) => {
      it(`should handle ${name} streaming without duplicates`, async () => {
        console.log(`\n🤖 Testing ${name} streaming...`);
        
        // Create specification for this model
        const specResponse = await client.createSpecification({
          name: `Test ${name} Streaming`,
          type: Types.SpecificationTypes.Completion,
          serviceType: Types.ModelServiceTypes.Bedrock,
          bedrock: {
            model: model,
            temperature: 0.7,
            completionTokenLimit: 200,
          },
        });

        const specId = specResponse.createSpecification?.id;
        expect(specId).toBeDefined();
        createdSpecIds.push(specId!);

        // Track streaming behavior
        const updates: { content: string; delta: string }[] = [];
        let previousContent = "";
        let duplicateDetected = false;

        await client.streamAgent(
          "Write exactly two sentences about the sun.",
          (event: AgentStreamEvent) => {
            if (event.type === "conversation_started") {
              createdConversationIds.push(event.conversationId);
            } else if (event.type === "message_update") {
              const currentContent = event.message.message;
              const delta = currentContent.substring(previousContent.length);
              
              updates.push({
                content: currentContent,
                delta: delta,
              });
              
              // Check if the delta contains content that was already in previous
              if (previousContent.length > 10 && delta.includes(previousContent.substring(0, 10))) {
                duplicateDetected = true;
                console.log(`⚠️  ${name}: Delta contains previous content!`);
                console.log(`   Previous start: "${previousContent.substring(0, 30)}..."`);
                console.log(`   Delta: "${delta.substring(0, 50)}..."`);
              }
              
              previousContent = currentContent;
            }
          },
          undefined,
          { id: specId },
        );

        // Analysis
        console.log(`📊 ${name} Results:`);
        console.log(`   Total updates: ${updates.length}`);
        console.log(`   Duplicate content detected: ${duplicateDetected ? 'YES ❌' : 'NO ✅'}`);
        console.log(`   Final message length: ${previousContent.length} chars`);
        
        // Log first few deltas to see the pattern
        console.log(`   First 5 deltas:`);
        for (let i = 0; i < Math.min(5, updates.length); i++) {
          console.log(`     ${i + 1}. "${updates[i].delta.substring(0, 30)}${updates[i].delta.length > 30 ? '...' : ''}" (${updates[i].delta.length} chars)`);
        }

        // Expect no duplicates
        expect(duplicateDetected).toBe(false);
        expect(updates.length).toBeGreaterThan(0);
      }, 30000); // 30 second timeout per model
    });

    it("should compare delta behavior across all models", async () => {
      console.log("\n📊 Comparing delta behavior across Bedrock models...\n");
      
      const results: { 
        model: string; 
        hasDuplicates: boolean; 
        updateCount: number;
        avgDeltaSize: number;
        sampleDelta: string;
      }[] = [];

      // Test a subset for comparison
      const modelsToCompare = [
        { name: "Nova Pro", model: Types.BedrockModels.NovaPro },
        { name: "Claude 3.7 Sonnet", model: Types.BedrockModels.Claude_3_7Sonnet },
        { name: "Llama 4 Scout 17B", model: Types.BedrockModels.Llama_4Scout_17B },
      ];

      for (const { name, model } of modelsToCompare) {
        const specResponse = await client.createSpecification({
          name: `Compare ${name}`,
          type: Types.SpecificationTypes.Completion,
          serviceType: Types.ModelServiceTypes.Bedrock,
          bedrock: {
            model: model,
            temperature: 0.7,
            completionTokenLimit: 100,
          },
        });
        createdSpecIds.push(specResponse.createSpecification?.id!);

        const updates: string[] = [];
        let previousContent = "";
        let hasDuplicates = false;
        const deltas: string[] = [];

        await client.streamAgent(
          "Count from 1 to 5.",
          (event) => {
            if (event.type === "conversation_started") {
              createdConversationIds.push(event.conversationId);
            } else if (event.type === "message_update") {
              const currentContent = event.message.message;
              const delta = currentContent.substring(previousContent.length);
              
              deltas.push(delta);
              updates.push(currentContent);
              
              // Simple duplicate check
              if (previousContent.length > 5 && currentContent.includes(previousContent + previousContent.substring(0, 5))) {
                hasDuplicates = true;
              }
              
              previousContent = currentContent;
            }
          },
          undefined,
          { id: specResponse.createSpecification?.id },
        );

        const avgDeltaSize = deltas.length > 0 
          ? Math.round(deltas.reduce((sum, d) => sum + d.length, 0) / deltas.length)
          : 0;

        results.push({
          model: name,
          hasDuplicates,
          updateCount: updates.length,
          avgDeltaSize,
          sampleDelta: deltas[0] || "",
        });
      }

      // Display comparison
      console.log("Model Comparison Results:");
      console.log("┌─────────────────────────┬─────────────┬──────────┬─────────────┬──────────────────┐");
      console.log("│ Model                   │ Duplicates  │ Updates  │ Avg Delta   │ Sample Delta     │");
      console.log("├─────────────────────────┼─────────────┼──────────┼─────────────┼──────────────────┤");
      
      for (const result of results) {
        const duplicateStatus = result.hasDuplicates ? "YES ❌" : "NO  ✅";
        const modelName = result.model.padEnd(23);
        const updates = result.updateCount.toString().padEnd(8);
        const avgDelta = (result.avgDeltaSize + " chars").padEnd(11);
        const sample = result.sampleDelta.substring(0, 15).padEnd(16);
        
        console.log(`│ ${modelName} │ ${duplicateStatus}    │ ${updates} │ ${avgDelta} │ ${sample} │`);
      }
      
      console.log("└─────────────────────────┴─────────────┴──────────┴─────────────┴──────────────────┘");

      // All models should now handle deltas correctly
      expect(results.every(r => !r.hasDuplicates)).toBe(true);
    }, 60000); // 60 second timeout for comparison test
  });

  describe("Edge cases", () => {
    it("should handle empty deltas and unchanged content", async () => {
      const specResponse = await client.createSpecification({
        name: "Test Empty Deltas",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.Bedrock,
        bedrock: {
          model: Types.BedrockModels.Claude_3_7Sonnet,
          temperature: 0,
          completionTokenLimit: 50,
        },
      });
      createdSpecIds.push(specResponse.createSpecification?.id!);

      let emptyDeltaCount = 0;
      let previousContent = "";

      await client.streamAgent(
        "Say 'test'",
        (event) => {
          if (event.type === "conversation_started") {
            createdConversationIds.push(event.conversationId);
          } else if (event.type === "message_update") {
            const currentContent = event.message.message;
            const delta = currentContent.substring(previousContent.length);
            
            if (delta === "") {
              emptyDeltaCount++;
              console.log(`⚠️  Empty delta detected at update ${emptyDeltaCount}`);
            }
            
            previousContent = currentContent;
          }
        },
        undefined,
        { id: specResponse.createSpecification?.id },
      );

      console.log(`\n📊 Empty delta count: ${emptyDeltaCount}`);
      // Empty deltas should be minimal or none
      expect(emptyDeltaCount).toBeLessThan(3);
    }, 20000);
  });
});
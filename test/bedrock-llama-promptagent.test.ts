import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";

/**
 * Test Bedrock Llama models with promptAgent to verify tool support
 */
describe("Bedrock Llama PromptAgent Tool Test", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;

  if (!orgId || !envId || !secret) {
    console.warn("⚠️  Skipping Bedrock tests - missing Graphlit credentials");
    return;
  }

  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.warn("⚠️  Skipping Bedrock tests - missing AWS credentials");
    return;
  }

  let client: Graphlit;
  let createdSpecId: string | null = null;
  let conversationId: string | null = null;

  beforeAll(async () => {
    client = new Graphlit(orgId, envId, secret);

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
  });

  afterAll(async () => {
    // Clean up
    if (conversationId) {
      try {
        await client.deleteConversation(conversationId);
      } catch (e) {
        // Ignore
      }
    }
    if (createdSpecId) {
      try {
        await client.deleteSpecification(createdSpecId);
      } catch (e) {
        // Ignore
      }
    }
  });

  it("should test if Bedrock Llama supports tools via promptAgent", async () => {
    // Create specification
    const spec = await client.createSpecification({
      name: "Bedrock Llama PromptAgent Test",
      type: Types.SpecificationTypes.Completion,
      serviceType: Types.ModelServiceTypes.Bedrock,
      bedrock: {
        model: Types.BedrockModels.Llama_4Maverick_17B,
        temperature: 0.7,
      },
    });

    expect(spec.createSpecification?.id).toBeDefined();
    createdSpecId = spec.createSpecification!.id;

    // Define a tool that provides information the model can't know
    const tools: Types.ToolDefinitionInput[] = [
      {
        name: "getRandomNumber",
        description: "Generate a random number between 1 and 100",
        schema: JSON.stringify({
          type: "object",
          properties: {},
        }),
      },
    ];

    let toolCallCount = 0;
    let randomNumber = 0;
    const toolHandlers = {
      getRandomNumber: async () => {
        toolCallCount++;
        randomNumber = Math.floor(Math.random() * 100) + 1;
        console.log(
          `🔧 getRandomNumber tool called, returned: ${randomNumber}`,
        );
        return { number: randomNumber };
      },
    };

    console.log(
      "\n🧪 Testing Bedrock Llama with promptAgent (non-streaming)...",
    );

    try {
      const result = await client.promptAgent(
        "Please use the getRandomNumber tool to generate a random number for me. You MUST use the tool - do not make up a number yourself.",
        undefined, // no existing conversation
        { id: createdSpecId },
        tools,
        toolHandlers,
        {
          maxToolRounds: 3,
        },
      );

      conversationId = result.conversationId;

      console.log("\n📊 PromptAgent Result:");
      console.log("- Message:", result.message);
      console.log("- Tool calls made:", result.toolCalls?.length || 0);
      console.log("- Tool results:", result.toolResults?.length || 0);
      console.log("- Tool handler invocations:", toolCallCount);

      if (result.toolCalls && result.toolCalls.length > 0) {
        console.log("\n🔧 Tool calls details:");
        result.toolCalls.forEach((tc, i) => {
          console.log(`  ${i + 1}. ${tc.name}: ${tc.arguments}`);
        });
      }

      // If no tools were called, the model doesn't support them
      if (toolCallCount === 0) {
        console.log(
          "\n⚠️  Bedrock Llama model did not call any tools - likely not supported",
        );

        // Check if the model mentioned it can't use tools
        if (
          result.message.toLowerCase().includes("tool") ||
          result.message.toLowerCase().includes("function") ||
          result.message.toLowerCase().includes("cannot") ||
          result.message.toLowerCase().includes("unable")
        ) {
          console.log(
            "📝 Model response suggests it knows about tools but can't use them",
          );
        }
      } else {
        // Verify the random number appears in the response
        if (
          randomNumber > 0 &&
          result.message.includes(randomNumber.toString())
        ) {
          console.log(
            `✅ Model correctly used tool and returned: ${randomNumber}`,
          );
        }
      }

      // Don't fail the test - just report the findings
      expect(result.message).toBeTruthy();
      console.log(
        `\n✅ Test complete. Tool support: ${toolCallCount > 0 ? "YES" : "NO"}`,
      );
    } catch (error: any) {
      console.error("\n❌ Error:", error.message);

      // Check if it's a model-specific error about tool support
      if (
        error.message?.includes("tool") ||
        error.message?.includes("function")
      ) {
        console.log(
          "\n⚠️  Error suggests model doesn't support tools:",
          error.message,
        );
      }

      throw error;
    }
  }, 60000);
});

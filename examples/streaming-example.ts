import { Graphlit, AgentStreamEvent, Types } from "graphlit-client";

// Initialize the client
const client = new Graphlit(
  process.env.GRAPHLIT_ORGANIZATION_ID,
  process.env.GRAPHLIT_ENVIRONMENT_ID,
  process.env.GRAPHLIT_JWT_SECRET,
);

async function basicStreamingExample() {
  console.log("🚀 Basic Streaming Example\n");

  await client.streamAgent(
    "Tell me a joke about programming",
    (event: AgentStreamEvent) => {
      switch (event.type) {
        case "conversation_started":
          console.log(`📝 Conversation started: ${event.conversationId}`);
          break;

        case "message_update":
          // Clear console and show current message
          process.stdout.write("\r" + " ".repeat(80) + "\r");
          process.stdout.write(`Assistant: ${event.message.message}`);
          break;

        case "conversation_completed":
          console.log("\n✅ Conversation completed");
          break;

        case "error":
          console.error(`\n❌ Error: ${event.error.message}`);
          break;
      }
    },
  );
}

async function toolCallingExample() {
  console.log("\n🔧 Tool Calling Example\n");

  // Define a simple calculator tool
  const calculatorTool: Types.ToolDefinitionInput = {
    name: "calculator",
    description: "Perform basic arithmetic operations",
    schema: JSON.stringify({
      type: "object",
      properties: {
        operation: {
          type: "string",
          enum: ["add", "subtract", "multiply", "divide"],
          description: "The arithmetic operation to perform",
        },
        a: { type: "number", description: "First number" },
        b: { type: "number", description: "Second number" },
      },
      required: ["operation", "a", "b"],
    }),
  };

  // Tool handler
  const toolHandlers = {
    calculator: async (args: { operation: string; a: number; b: number }) => {
      console.log(
        `\n🧮 Calculator called: ${args.a} ${args.operation} ${args.b}`,
      );

      switch (args.operation) {
        case "add":
          return { result: args.a + args.b };
        case "subtract":
          return { result: args.a - args.b };
        case "multiply":
          return { result: args.a * args.b };
        case "divide":
          if (args.b === 0) throw new Error("Division by zero");
          return { result: args.a / args.b };
        default:
          throw new Error(`Unknown operation: ${args.operation}`);
      }
    },
  };

  // Create a specification for tool calling
  const specResponse = await client.createSpecification({
    name: "Calculator Assistant",
    type: Types.SpecificationTypes.Completion,
    serviceType: Types.ModelServiceTypes.OpenAi,
    openAI: {
      model: Types.OpenAiModels.Gpt4O_128K,
      temperature: 0.7,
      completionTokenLimit: 500,
    },
  });

  const specId = specResponse.createSpecification?.id!;

  try {
    await client.streamAgent(
      "What is 42 multiplied by 17? Then add 123 to the result.",
      (event: AgentStreamEvent) => {
        switch (event.type) {
          case "conversation_started":
            console.log(`📝 Started conversation: ${event.conversationId}`);
            break;

          case "tool_update":
            console.log(`🔧 Tool ${event.toolCall.name}: ${event.status}`);
            if (event.result) {
              console.log(`   Result: ${JSON.stringify(event.result)}`);
            }
            break;

          case "message_update":
            process.stdout.write("\r" + " ".repeat(80) + "\r");
            process.stdout.write(`Assistant: ${event.message.message}`);
            break;

          case "conversation_completed":
            console.log("\n✅ Completed with tools");
            break;

          case "error":
            console.error(`\n❌ Error: ${event.error.message}`);
            break;
        }
      },
      undefined, // conversationId
      { id: specId }, // specification
      [calculatorTool], // tools
      toolHandlers, // tool handlers
    );
  } finally {
    // Clean up
    await client.deleteSpecification(specId);
  }
}

async function conversationContinuityExample() {
  console.log("\n💬 Conversation Continuity Example\n");

  let conversationId: string | undefined;

  // First message
  await client.streamAgent(
    "My name is Alice and I love TypeScript",
    (event: AgentStreamEvent) => {
      if (event.type === "conversation_started") {
        conversationId = event.conversationId;
        console.log(`📝 Started conversation: ${conversationId}`);
      } else if (event.type === "conversation_completed") {
        console.log(`Assistant: ${event.message.message}`);
      }
    },
  );

  console.log("\n... continuing conversation ...\n");

  // Continue the conversation
  await client.streamAgent(
    "What's my name and what programming language do I like?",
    (event: AgentStreamEvent) => {
      if (event.type === "conversation_completed") {
        console.log(`Assistant: ${event.message.message}`);
      }
    },
    conversationId, // Continue the same conversation
  );
}

async function customClientExample() {
  console.log("\n🔧 Custom Client Example\n");

  // Only run if OpenAI is available
  try {
    const { default: OpenAI } = await import("openai");

    // Create a custom OpenAI client with proxy
    const customOpenAI = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
      // baseURL: "https://your-proxy.com/v1", // Optional: Use a proxy
      defaultHeaders: {
        "X-Custom-Header": "CustomValue",
      },
    });

    // Set the custom client
    client.setOpenAIClient(customOpenAI);

    await client.streamAgent(
      "Say 'Hello from custom client!'",
      (event: AgentStreamEvent) => {
        if (event.type === "conversation_completed") {
          console.log(`Assistant: ${event.message.message}`);
        }
      },
    );
  } catch (e) {
    console.log("⚠️  OpenAI SDK not available for custom client example");
  }
}

// Run examples
async function runExamples() {
  try {
    await basicStreamingExample();
    await toolCallingExample();
    await conversationContinuityExample();
    await customClientExample();
  } catch (error) {
    console.error("Example failed:", error);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runExamples();
}

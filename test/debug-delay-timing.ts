import { Graphlit, UIStreamEvent } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import { SmoothChunkingStrategy } from "../src/types/streaming";

async function debugDelayTiming() {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;

  if (!orgId || !envId || !secret) {
    console.error("Missing credentials");
    return;
  }

  const client = new Graphlit(orgId, envId, secret);

  // Create a simple specification
  const createResponse = await client.createSpecification({
    name: "Debug Delay Timing",
    type: Types.SpecificationTypes.Completion,
    serviceType: Types.ModelServiceTypes.OpenAi,
    openAI: {
      model: Types.OpenAiModels.Gpt4OMini_128K,
      temperature: 0.1,
    },
  });

  const specId = createResponse.createSpecification?.id;
  if (!specId) {
    console.error("Failed to create specification");
    return;
  }

  console.log("Testing delay timing with different configurations...\n");

  const configs = [
    { name: "Fast (10ms)", delay: 10 },
    { name: "Medium (50ms)", delay: 50 },
    { name: "Slow (200ms)", delay: 200 },
  ];

  for (const config of configs) {
    console.log(`\n=== Testing ${config.name} ===`);

    const chunks: { text: string; timestamp: number }[] = [];
    let prevText = "";
    let startTime = 0;

    await client.streamAgent(
      "Count exactly: one two three four five",
      (event: UIStreamEvent) => {
        const now = Date.now();

        if (event.type === "conversation_started") {
          startTime = now;
          console.log("Conversation started");
        } else if (event.type === "message_update") {
          const newChunk = event.message.message.substring(prevText.length);
          if (newChunk) {
            const relativeTime = now - startTime;
            chunks.push({ text: newChunk, timestamp: relativeTime });
            console.log(`[${relativeTime}ms] Chunk: "${newChunk}"`);
          }
          prevText = event.message.message;
        }
      },
      undefined,
      { id: specId }
    );

    // Calculate inter-chunk delays
    const delays: number[] = [];
    for (let i = 1; i < chunks.length; i++) {
      delays.push(chunks[i].timestamp - chunks[i - 1].timestamp);
    }

    console.log(`\nTotal chunks: ${chunks.length}`);
    console.log(`Configured delay: ${config.delay}ms`);
    if (delays.length > 0) {
      console.log(
        `Actual delays: ${delays.slice(0, 10).join(", ")}${delays.length > 10 ? "..." : ""}`
      );
      console.log(
        `Average delay: ${(delays.reduce((a, b) => a + b, 0) / delays.length).toFixed(1)}ms`
      );

      // Check how many delays are close to the target
      const closeToTarget = delays.filter(
        (d) => d >= config.delay * 0.8 && d <= config.delay * 1.2
      ).length;
      console.log(
        `Delays within 20% of target: ${closeToTarget}/${delays.length} (${((closeToTarget / delays.length) * 100).toFixed(0)}%)`
      );
    }
  }

  // Clean up
  await client.deleteSpecification(specId);
  console.log("\n\nDebug complete!");
}

debugDelayTiming().catch(console.error);

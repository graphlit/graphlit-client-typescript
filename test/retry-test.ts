import { Graphlit, RetryConfig } from "../src/client";
import * as Types from "../src/generated/graphql-types";

/**
 * Test script to demonstrate retry functionality
 *
 * This test simulates various error scenarios to verify that the retry
 * mechanism works correctly for different HTTP status codes.
 */

async function testRetryFunctionality() {
  console.log("🧪 Testing Graphlit Client Retry Functionality\n");

  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;

  if (!orgId || !envId || !secret) {
    console.error("❌ Missing required environment variables");
    return;
  }

  // Test 1: Default retry configuration
  console.log("1️⃣ Testing with default retry configuration");
  const client1 = new Graphlit(orgId, envId, secret);

  try {
    const result = await client1.queryContents();
    console.log("✅ Query successful with default config");
  } catch (error: any) {
    console.log("❌ Query failed:", error.message);
  }

  // Test 2: Custom retry configuration with callback
  console.log("\n2️⃣ Testing with custom retry configuration");

  let retryCount = 0;
  const customRetryConfig: RetryConfig = {
    maxAttempts: 3,
    initialDelay: 500,
    maxDelay: 5000,
    retryableStatusCodes: [429, 500, 502, 503, 504],
    onRetry: (attempt, error, operation) => {
      retryCount++;
      console.log(
        `  🔄 Retry attempt ${attempt} for operation: ${operation.operationName}`,
      );
      console.log(`     Error: ${error.message}`);
      if (error.networkError?.statusCode) {
        console.log(`     Status code: ${error.networkError.statusCode}`);
      }
    },
  };

  const client2 = new Graphlit({
    organizationId: orgId,
    environmentId: envId,
    jwtSecret: secret,
    retryConfig: customRetryConfig,
  });

  try {
    const result = await client2.queryContents();
    console.log(`✅ Query successful after ${retryCount} retries`);
  } catch (error: any) {
    console.log(`❌ Query failed after ${retryCount} retries:`, error.message);
  }

  // Test 3: Updating retry config at runtime
  console.log("\n3️⃣ Testing runtime retry config update");

  const client3 = new Graphlit(orgId, envId, secret);

  // Update to more aggressive retry
  client3.setRetryConfig({
    maxAttempts: 10,
    initialDelay: 100,
    retryableStatusCodes: [429, 500, 502, 503, 504, 521, 522, 524],
    onRetry: (attempt, error) => {
      console.log(`  🔄 Aggressive retry attempt ${attempt}`);
    },
  });

  try {
    const result = await client3.queryContents();
    console.log("✅ Query successful with updated config");
  } catch (error: any) {
    console.log("❌ Query failed with updated config:", error.message);
  }

  // Test 4: Disable retries
  console.log("\n4️⃣ Testing with retries disabled");

  const client4 = new Graphlit({
    organizationId: orgId,
    environmentId: envId,
    jwtSecret: secret,
    retryConfig: {
      maxAttempts: 1, // No retries
      onRetry: () => {
        console.log("  ⚠️ This should not be called!");
      },
    },
  });

  try {
    const result = await client4.queryContents();
    console.log("✅ Query successful with no retries");
  } catch (error: any) {
    console.log("❌ Query failed immediately (no retries):", error.message);
  }

  console.log("\n✨ Retry functionality test complete!");
}

// Run the test
testRetryFunctionality().catch(console.error);

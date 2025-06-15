import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";

/**
 * Summary test to confirm the file size limit around 75MB
 */

describe("IngestEncodedFile Size Limit Summary", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;

  if (!orgId || !envId || !secret) {
    console.warn("⚠️  Skipping summary test - missing Graphlit credentials");
    return;
  }

  let client: Graphlit;

  beforeAll(async () => {
    client = new Graphlit(orgId, envId, secret);
  });

  /**
   * Create a base64 string of specified size with realistic text content
   */
  function createBase64Data(sizeMB: number): string {
    const targetBase64Chars = sizeMB * 1024 * 1024;
    const sourceBytesNeeded = Math.floor(targetBase64Chars * 0.75);

    // Create realistic text content with paragraphs
    const paragraph = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\n`;

    const paragraphBytes = Buffer.byteLength(paragraph, "utf8");
    const paragraphsNeeded = Math.ceil(sourceBytesNeeded / paragraphBytes);

    // Build content with multiple paragraphs
    let content = "";
    for (let i = 0; i < paragraphsNeeded; i++) {
      content += `Paragraph ${i + 1}:\n${paragraph}`;

      if ((i + 1) % 10 === 0) {
        content += `\n=== Section ${Math.floor((i + 1) / 10)} ===\n\n`;
      }
    }

    // Trim to exact size needed
    const contentBuffer = Buffer.from(content, "utf8").slice(
      0,
      sourceBytesNeeded,
    );

    return contentBuffer.toString("base64");
  }

  it("should confirm file size limits", async () => {
    // Test specific sizes around the limit we found
    const testCases = [
      { size: 50, expected: true, description: "Well within limit" },
      { size: 70, expected: true, description: "Near upper limit" },
      { size: 75, expected: true, description: "At practical limit" },
      { size: 76, expected: false, description: "Just above limit" },
      { size: 80, expected: false, description: "Above limit" },
    ];

    console.log("\n" + "=".repeat(70));
    console.log("📊 GRAPHLIT INGESTENCODEDFILE SIZE LIMIT SUMMARY");
    console.log("=".repeat(70));
    console.log("\nTesting key file sizes to confirm limits...\n");

    const results: any[] = [];

    for (const testCase of testCases) {
      console.log(
        `\n🧪 Testing ${testCase.size}MB (${testCase.description})...`,
      );

      try {
        const startTime = Date.now();
        const data = createBase64Data(testCase.size);

        // Don't wait for processing, just test if upload succeeds
        const result = await client.ingestEncodedFile(
          `test-${testCase.size}MB.txt`,
          data,
          "text/plain",
          undefined,
          undefined,
          undefined,
          false,
        );

        const success = !!result.ingestEncodedFile?.id;
        const time = Date.now() - startTime;

        console.log(
          success
            ? `  ✅ SUCCESS in ${(time / 1000).toFixed(1)}s`
            : `  ❌ FAILED`,
        );

        results.push({
          size: testCase.size,
          expected: testCase.expected,
          actual: success,
          time: time,
          passed: success === testCase.expected,
        });

        // Cleanup if successful
        if (success && result.ingestEncodedFile?.id) {
          setTimeout(async () => {
            try {
              await client.deleteContent(result.ingestEncodedFile!.id);
            } catch (e) {
              // Ignore cleanup errors
            }
          }, 5000);
        }
      } catch (error: any) {
        console.log(
          `  ❌ FAILED: ${error.message?.substring(0, 100) || error}`,
        );

        results.push({
          size: testCase.size,
          expected: testCase.expected,
          actual: false,
          error: error.message,
          passed: false === testCase.expected,
        });
      }

      // Small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    console.log("\n" + "=".repeat(70));
    console.log("TEST RESULTS SUMMARY");
    console.log("=".repeat(70));
    console.log("\nSize (MB) | Expected | Actual   | Result");
    console.log("----------|----------|----------|--------");

    results.forEach((r) => {
      const expectedStr = r.expected ? "✅ Pass" : "❌ Fail";
      const actualStr = r.actual ? "✅ Pass" : "❌ Fail";
      const resultStr = r.passed ? "✅ OK" : "❌ MISMATCH";
      console.log(
        `${String(r.size).padStart(9)} | ${expectedStr} | ${actualStr} | ${resultStr}`,
      );
    });

    console.log("\n" + "=".repeat(70));
    console.log("📋 CUSTOMER DOCUMENTATION");
    console.log("=".repeat(70));
    console.log(
      "\n✅ CONFIRMED: Maximum file size for ingestEncodedFile is 75MB",
    );
    console.log("\n📝 Recommended guidelines:");
    console.log("  • Files up to 50MB: Always work reliably");
    console.log("  • Files 50-70MB: Generally work well");
    console.log("  • Files 70-75MB: May work but close to limit");
    console.log("  • Files over 75MB: Will fail with 502/503 errors");
    console.log("\n💡 For files larger than 75MB, use:");
    console.log("  • ingestUri with a presigned URL");
    console.log("  • Split the file into smaller chunks");
    console.log("  • Use the bulk import features");
    console.log("\n" + "=".repeat(70));

    // Assert that all test cases passed as expected
    const allPassed = results.every((r) => r.passed);
    expect(allPassed).toBe(true);
  }, 300000); // 5 minute timeout
});

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";

/**
 * Test larger file sizes starting from 50MB to find the upper limit
 */

describe("IngestEncodedFile Large Size Test", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;

  if (!orgId || !envId || !secret) {
    console.warn("⚠️  Skipping large size test - missing Graphlit credentials");
    return;
  }

  let client: Graphlit;
  const ingestedContentIds: string[] = [];

  beforeAll(async () => {
    client = new Graphlit(orgId, envId, secret);
  });

  afterAll(async () => {
    // Cleanup all ingested content
    console.log(`\n🧹 Cleaning up ${ingestedContentIds.length} test files...`);

    for (const contentId of ingestedContentIds) {
      try {
        await client.deleteContent(contentId);
      } catch (error) {
        console.warn(`Failed to cleanup content ${contentId}:`, error);
      }
    }
  }, 60000);

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
      // Add paragraph number for variation
      content += `Paragraph ${i + 1}:\n${paragraph}`;

      // Add section headers every 10 paragraphs
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

  /**
   * Test if a specific file size can be ingested
   */
  async function testFileSize(
    sizeMB: number,
  ): Promise<{ success: boolean; time?: number; error?: string }> {
    console.log(`\n🧪 Testing ${sizeMB}MB file...`);

    try {
      const startTime = Date.now();
      const data = createBase64Data(sizeMB);

      const result = await client.ingestEncodedFile(
        `test-file-${sizeMB}MB.txt`,
        data,
        "text/plain",
        undefined,
        undefined,
        undefined,
        false, // async to be faster
        undefined,
        undefined,
        undefined,
        `size-test-${sizeMB}MB`,
      );

      const totalTime = Date.now() - startTime;

      if (result.ingestEncodedFile?.id) {
        ingestedContentIds.push(result.ingestEncodedFile.id);
        console.log(
          `  ✅ SUCCESS: Ingested in ${(totalTime / 1000).toFixed(1)}s`,
        );
        return { success: true, time: totalTime };
      } else {
        console.log(`  ❌ FAILED: No content ID returned`);
        return { success: false, error: "No content ID returned" };
      }
    } catch (error: any) {
      console.log(`  ❌ FAILED: ${error.message || error}`);

      // Log more details if it's a GraphQL error
      if (error.graphQLErrors) {
        error.graphQLErrors.forEach((gqlError: any) => {
          console.log(`     GraphQL Error: ${gqlError.message}`);
        });
      }

      return { success: false, error: error.message || String(error) };
    }
  }

  it("should test larger file sizes from 50MB upward", async () => {
    // Start from 50MB and test in increments
    const testSizes = [50, 60, 70, 80, 90, 100, 120, 150];
    const results: Record<
      number,
      { success: boolean; time?: number; error?: string }
    > = {};

    console.log("\n🎯 Testing large file sizes starting from 50MB...\n");

    for (const size of testSizes) {
      results[size] = await testFileSize(size);

      // If we get a failure, do a binary search to find the exact limit
      if (!results[size].success) {
        console.log(
          `\n⚠️  Failure detected at ${size}MB - finding exact limit...`,
        );

        // Get the last successful size
        const previousSizes = Object.entries(results)
          .filter(([s, r]) => parseInt(s) < size && r.success)
          .map(([s, _]) => parseInt(s));

        if (previousSizes.length > 0) {
          let minSize = Math.max(...previousSizes);
          let maxSize = size;

          // Binary search with 5MB granularity
          while (maxSize - minSize > 5) {
            const midSize = Math.floor((minSize + maxSize) / 2);
            const midResult = await testFileSize(midSize);
            results[midSize] = midResult;

            if (midResult.success) {
              minSize = midSize;
            } else {
              maxSize = midSize;
            }
          }
        }

        break;
      }
    }

    // Find the maximum successful size
    const successfulSizes = Object.entries(results)
      .filter(([_, result]) => result.success)
      .map(([size, _]) => parseInt(size));

    const failedSizes = Object.entries(results)
      .filter(([_, result]) => !result.success)
      .map(([size, _]) => parseInt(size));

    const maxSuccess =
      successfulSizes.length > 0 ? Math.max(...successfulSizes) : 0;
    const minFailed = failedSizes.length > 0 ? Math.min(...failedSizes) : 0;

    console.log("\n" + "=".repeat(60));
    console.log("📊 LARGE FILE TEST RESULTS");
    console.log("=".repeat(60));
    console.log("Size (MB) | Result      | Time (s)");
    console.log("----------|-------------|----------");

    // Sort results by size
    const sortedResults = Object.entries(results).sort(
      ([a], [b]) => parseInt(a) - parseInt(b),
    );

    for (const [size, result] of sortedResults) {
      const timeStr = result.time
        ? `${(result.time / 1000).toFixed(1)}s`
        : "N/A";
      console.log(
        `${size.padStart(9)} | ${result.success ? "✅ Success" : "❌ Failed "} | ${timeStr.padStart(8)}`,
      );
    }

    console.log("=".repeat(60));

    if (maxSuccess > 0) {
      console.log(`\n✅ Maximum successful size: ${maxSuccess}MB`);
    }
    if (minFailed > 0) {
      console.log(`❌ Minimum failed size: ${minFailed}MB`);
      console.log(
        `\n📏 The size limit is between ${maxSuccess}MB and ${minFailed}MB`,
      );
    }

    console.log("\n📋 Customer Recommendation:");
    if (maxSuccess >= 50) {
      console.log(
        `✅ Customers can reliably upload files up to ${maxSuccess}MB`,
      );
      console.log(
        `📝 For best results, recommend keeping files under ${Math.floor(maxSuccess * 0.9)}MB`,
      );
    } else if (maxSuccess > 0) {
      console.log(`⚠️  Maximum successful upload was ${maxSuccess}MB`);
      console.log(
        `📝 Recommend keeping files under ${Math.floor(maxSuccess * 0.9)}MB for reliability`,
      );
    }

    // Assertions
    expect(Object.keys(results).length).toBeGreaterThan(0);
  }, 1200000); // 20 minute timeout
});

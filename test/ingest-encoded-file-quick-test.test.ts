import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";

/**
 * Quick test to check specific file sizes for ingestEncodedFile
 * This is faster than the binary search version
 */

describe("IngestEncodedFile Quick Size Test", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;

  if (!orgId || !envId || !secret) {
    console.warn("⚠️  Skipping size test - missing Graphlit credentials");
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
    
    const paragraphBytes = Buffer.byteLength(paragraph, 'utf8');
    const paragraphsNeeded = Math.ceil(sourceBytesNeeded / paragraphBytes);
    
    // Build content with multiple paragraphs
    let content = '';
    for (let i = 0; i < paragraphsNeeded; i++) {
      // Add paragraph number for variation
      content += `Paragraph ${i + 1}:\n${paragraph}`;
      
      // Add section headers every 10 paragraphs
      if ((i + 1) % 10 === 0) {
        content += `\n=== Section ${Math.floor((i + 1) / 10)} ===\n\n`;
      }
    }
    
    // Trim to exact size needed
    const contentBuffer = Buffer.from(content, 'utf8').slice(0, sourceBytesNeeded);
    
    return contentBuffer.toString('base64');
  }

  /**
   * Test if a specific file size can be ingested
   */
  async function testFileSize(sizeMB: number): Promise<{ success: boolean; time?: number; error?: string }> {
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
        `size-test-${sizeMB}MB`
      );
      
      const totalTime = Date.now() - startTime;
      
      if (result.ingestEncodedFile?.id) {
        ingestedContentIds.push(result.ingestEncodedFile.id);
        console.log(`  ✅ SUCCESS: Ingested in ${(totalTime / 1000).toFixed(1)}s`);
        return { success: true, time: totalTime };
      } else {
        console.log(`  ❌ FAILED: No content ID returned`);
        return { success: false, error: "No content ID returned" };
      }
    } catch (error: any) {
      console.log(`  ❌ FAILED: ${error.message || error}`);
      return { success: false, error: error.message || String(error) };
    }
  }

  it("should test common file sizes", async () => {
    // Test sizes: 5MB, 10MB, 15MB, 20MB, 25MB, 30MB, 40MB, 50MB
    const testSizes = [5, 10, 15, 20, 25, 30, 40, 50];
    const results: Record<number, { success: boolean; time?: number; error?: string }> = {};
    
    console.log("\n🎯 Testing common file sizes...\n");
    
    for (const size of testSizes) {
      results[size] = await testFileSize(size);
      
      // If we get a failure, stop testing larger sizes
      if (!results[size].success && 
          (results[size].error?.includes('too large') || 
           results[size].error?.includes('size limit') ||
           results[size].error?.includes('payload') ||
           results[size].error?.includes('413'))) {
        console.log(`\n⚠️  Stopping tests - size limit reached at ${size}MB`);
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
    
    const maxSuccess = successfulSizes.length > 0 ? Math.max(...successfulSizes) : 0;
    const minFailed = failedSizes.length > 0 ? Math.min(...failedSizes) : 0;
    
    console.log("\n" + "=".repeat(60));
    console.log("📊 TEST RESULTS");
    console.log("=".repeat(60));
    console.log("Size (MB) | Result      | Time (s)");
    console.log("----------|-------------|----------");
    
    for (const [size, result] of Object.entries(results)) {
      const timeStr = result.time ? `${(result.time / 1000).toFixed(1)}s` : "N/A";
      console.log(`${size.padStart(9)} | ${result.success ? '✅ Success' : '❌ Failed '} | ${timeStr.padStart(8)}`);
    }
    
    console.log("=".repeat(60));
    
    if (maxSuccess > 0) {
      console.log(`\n✅ Maximum successful size: ${maxSuccess}MB`);
    }
    if (minFailed > 0) {
      console.log(`❌ Minimum failed size: ${minFailed}MB`);
    }
    
    console.log("\n📋 Recommendation:");
    if (maxSuccess >= 10) {
      console.log(`✅ You can safely tell customers they can upload files up to ${maxSuccess}MB`);
    }
    if (minFailed > 0 && minFailed <= 50) {
      console.log(`⚠️  Files larger than ${maxSuccess}MB may fail`);
    }
    
    // Assertions
    expect(Object.keys(results).length).toBeGreaterThan(0);
    if (maxSuccess > 0) {
      expect(maxSuccess).toBeGreaterThanOrEqual(10); // We expect at least 10MB to work
    }
    
  }, 900000); // 15 minute timeout
});
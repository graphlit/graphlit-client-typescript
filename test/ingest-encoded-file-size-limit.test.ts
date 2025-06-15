import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";

/**
 * Test to determine the maximum base64 file size that can be handled by ingestEncodedFile
 * Uses binary search to find the exact limit with 1MB granularity
 */

describe("IngestEncodedFile Size Limit Test", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;

  if (!orgId || !envId || !secret) {
    console.warn("⚠️  Skipping size limit test - missing Graphlit credentials");
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
   * @param sizeMB Size in megabytes
   * @returns Base64 encoded string
   */
  function createBase64Data(sizeMB: number): string {
    // Calculate the number of bytes needed
    // Base64 encoding increases size by ~33%, so we need to account for that
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
    const base64 = contentBuffer.toString('base64');
    
    // Verify size is close to target
    const actualSizeMB = base64.length / (1024 * 1024);
    console.log(`📏 Created base64 data: target=${sizeMB}MB, actual=${actualSizeMB.toFixed(2)}MB`);
    
    return base64;
  }

  /**
   * Test if a specific file size can be ingested
   * @param sizeMB Size in megabytes
   * @returns true if successful, false if failed
   */
  async function testFileSize(sizeMB: number): Promise<boolean> {
    console.log(`\n🧪 Testing ${sizeMB}MB file...`);
    
    try {
      const startTime = Date.now();
      const data = createBase64Data(sizeMB);
      const prepTime = Date.now() - startTime;
      
      console.log(`  ⏱️  Data preparation took ${prepTime}ms`);
      
      const ingestStartTime = Date.now();
      const result = await client.ingestEncodedFile(
        `test-file-${sizeMB}MB.txt`,
        data,
        "text/plain",
        undefined,
        undefined,
        undefined,
        true, // synchronous to ensure it fully processes
        undefined,
        undefined,
        undefined,
        `size-test-${sizeMB}MB`
      );
      
      const ingestTime = Date.now() - ingestStartTime;
      
      if (result.ingestEncodedFile?.id) {
        ingestedContentIds.push(result.ingestEncodedFile.id);
        console.log(`  ✅ SUCCESS: Ingested in ${(ingestTime / 1000).toFixed(1)}s`);
        console.log(`  📄 Content ID: ${result.ingestEncodedFile.id}`);
        return true;
      } else {
        console.log(`  ❌ FAILED: No content ID returned`);
        return false;
      }
    } catch (error: any) {
      console.log(`  ❌ FAILED: ${error.message || error}`);
      
      // Check if it's a size-related error
      if (error.message?.includes('too large') || 
          error.message?.includes('size limit') ||
          error.message?.includes('payload') ||
          error.message?.includes('413')) {
        console.log(`  💡 Size limit error detected`);
      }
      
      return false;
    }
  }

  it("should find maximum file size using binary search", async () => {
    console.log("\n🎯 Starting binary search for maximum file size...\n");
    
    // Start with reasonable bounds
    let minSize = 1;   // 1MB minimum (we know this works)
    let maxSize = 100; // 100MB maximum (likely to fail)
    let lastSuccessfulSize = 0;
    let lastFailedSize = 0;
    
    // First, find a working upper bound by testing powers of 2
    console.log("📊 Phase 1: Finding upper bound...");
    let testSize = 1;
    while (testSize <= maxSize) {
      const success = await testFileSize(testSize);
      if (success) {
        lastSuccessfulSize = testSize;
        minSize = testSize;
        testSize *= 2;
      } else {
        lastFailedSize = testSize;
        maxSize = testSize;
        break;
      }
    }
    
    console.log(`\n📊 Phase 2: Binary search between ${minSize}MB and ${maxSize}MB...\n`);
    
    // Binary search with 1MB granularity
    while (maxSize - minSize > 1) {
      const midSize = Math.floor((minSize + maxSize) / 2);
      const success = await testFileSize(midSize);
      
      if (success) {
        minSize = midSize;
        lastSuccessfulSize = midSize;
      } else {
        maxSize = midSize;
        lastFailedSize = midSize;
      }
      
      console.log(`  🔍 Search range now: ${minSize}MB - ${maxSize}MB`);
    }
    
    // Test the edge case if we haven't already
    if (lastSuccessfulSize < maxSize - 1) {
      const edgeSize = lastSuccessfulSize + 1;
      console.log(`\n🔍 Testing edge case: ${edgeSize}MB...`);
      const edgeSuccess = await testFileSize(edgeSize);
      if (edgeSuccess) {
        lastSuccessfulSize = edgeSize;
      } else {
        lastFailedSize = edgeSize;
      }
    }
    
    console.log("\n" + "=".repeat(60));
    console.log("📊 FINAL RESULTS");
    console.log("=".repeat(60));
    console.log(`✅ Maximum successful size: ${lastSuccessfulSize}MB`);
    console.log(`❌ Minimum failed size: ${lastFailedSize}MB`);
    console.log(`📏 Size limit is between ${lastSuccessfulSize}MB and ${lastFailedSize}MB`);
    console.log("=".repeat(60));
    
    // Create a summary report
    const report = {
      maxSuccessfulSizeMB: lastSuccessfulSize,
      minFailedSizeMB: lastFailedSize,
      recommendedMaxSizeMB: lastSuccessfulSize,
      testDate: new Date().toISOString(),
      environment: {
        orgId: orgId.substring(0, 8) + "...",
        envId: envId.substring(0, 8) + "..."
      }
    };
    
    console.log("\n📋 Summary Report (JSON):");
    console.log(JSON.stringify(report, null, 2));
    
    // Assertions
    expect(lastSuccessfulSize).toBeGreaterThan(0);
    expect(lastSuccessfulSize).toBeLessThan(lastFailedSize);
    
  }, 1800000); // 30 minute timeout for the entire test

  // Optional: Test specific sizes directly
  it.skip("should test specific file sizes", async () => {
    const testSizes = [5, 10, 15, 20, 25, 30]; // MB
    const results: Record<number, boolean> = {};
    
    for (const size of testSizes) {
      results[size] = await testFileSize(size);
    }
    
    console.log("\n📊 Specific Size Test Results:");
    console.log("Size (MB) | Result");
    console.log("----------|--------");
    for (const [size, success] of Object.entries(results)) {
      console.log(`${size.padStart(9)} | ${success ? '✅ Pass' : '❌ Fail'}`);
    }
  });
});
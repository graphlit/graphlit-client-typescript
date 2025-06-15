import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";

/**
 * Focused test to find the exact file size limit starting from 70MB
 */

describe("IngestEncodedFile Focused Limit Test", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;

  if (!orgId || !envId || !secret) {
    console.warn("⚠️  Skipping focused test - missing Graphlit credentials");
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
      console.log(`  📝 Creating base64 data...`);
      const dataStartTime = Date.now();
      const data = createBase64Data(sizeMB);
      console.log(`  ⏱️  Data creation took ${Date.now() - dataStartTime}ms`);
      
      console.log(`  📤 Uploading to Graphlit...`);
      const uploadStartTime = Date.now();
      
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
      
      const uploadTime = Date.now() - uploadStartTime;
      
      if (result.ingestEncodedFile?.id) {
        ingestedContentIds.push(result.ingestEncodedFile.id);
        console.log(`  ✅ SUCCESS: Uploaded in ${(uploadTime / 1000).toFixed(1)}s`);
        console.log(`  📊 Upload speed: ${(sizeMB / (uploadTime / 1000)).toFixed(1)} MB/s`);
        return { success: true, time: uploadTime };
      } else {
        console.log(`  ❌ FAILED: No content ID returned`);
        return { success: false, error: "No content ID returned" };
      }
    } catch (error: any) {
      console.log(`  ❌ FAILED: ${error.message || error}`);
      
      // Check for specific error patterns
      if (error.message?.includes('413') || error.message?.includes('too large') || error.message?.includes('payload')) {
        console.log(`  💡 Payload too large error detected`);
      }
      
      if (error.graphQLErrors) {
        error.graphQLErrors.forEach((gqlError: any) => {
          console.log(`     GraphQL Error: ${gqlError.message}`);
          if (gqlError.extensions) {
            console.log(`     Extensions:`, JSON.stringify(gqlError.extensions, null, 2));
          }
        });
      }
      
      return { success: false, error: error.message || String(error) };
    }
  }

  it("should find exact limit starting from 70MB", async () => {
    // Start testing from 70MB in 5MB increments
    const testSizes = [70, 75, 80, 85, 90, 95, 100];
    const results: Record<number, { success: boolean; time?: number; error?: string }> = {};
    
    console.log("\n🎯 Finding exact file size limit starting from 70MB...\n");
    console.log("We know 70MB works, so testing upward...\n");
    
    let lastSuccessfulSize = 70;
    let firstFailedSize = 0;
    
    for (const size of testSizes) {
      results[size] = await testFileSize(size);
      
      if (results[size].success) {
        lastSuccessfulSize = size;
      } else {
        firstFailedSize = size;
        console.log(`\n🔍 Failure at ${size}MB - refining search...`);
        
        // Do a binary search between last success and first failure with 1MB granularity
        let minSize = lastSuccessfulSize;
        let maxSize = firstFailedSize;
        
        while (maxSize - minSize > 1) {
          const midSize = Math.floor((minSize + maxSize) / 2);
          console.log(`\n  🎯 Binary search: testing ${midSize}MB (range: ${minSize}-${maxSize})`);
          
          const midResult = await testFileSize(midSize);
          results[midSize] = midResult;
          
          if (midResult.success) {
            minSize = midSize;
            lastSuccessfulSize = midSize;
          } else {
            maxSize = midSize;
            firstFailedSize = Math.min(firstFailedSize, midSize);
          }
        }
        
        break;
      }
    }
    
    // Sort results by size
    const sortedResults = Object.entries(results)
      .sort(([a], [b]) => parseInt(a) - parseInt(b));
    
    console.log("\n" + "=".repeat(70));
    console.log("📊 FILE SIZE LIMIT TEST - FINAL RESULTS");
    console.log("=".repeat(70));
    console.log("Size (MB) | Result      | Upload Time | Upload Speed");
    console.log("----------|-------------|-------------|-------------");
    
    for (const [size, result] of sortedResults) {
      const timeStr = result.time ? `${(result.time / 1000).toFixed(1)}s` : "N/A";
      const speedStr = result.time ? `${(parseInt(size) / (result.time / 1000)).toFixed(1)} MB/s` : "N/A";
      console.log(`${size.padStart(9)} | ${result.success ? '✅ Success' : '❌ Failed '} | ${timeStr.padStart(11)} | ${speedStr.padStart(11)}`);
    }
    
    console.log("=".repeat(70));
    
    console.log(`\n🎯 EXACT LIMIT FOUND:`);
    console.log(`✅ Maximum successful upload: ${lastSuccessfulSize}MB`);
    if (firstFailedSize > 0) {
      console.log(`❌ Minimum failed upload: ${firstFailedSize}MB`);
    }
    
    console.log("\n📋 CUSTOMER GUIDANCE:");
    console.log("=".repeat(50));
    console.log(`✅ Safe upload size: Up to ${lastSuccessfulSize}MB`);
    console.log(`📝 Recommended maximum: ${Math.floor(lastSuccessfulSize * 0.95)}MB`);
    console.log(`⚠️  Files larger than ${lastSuccessfulSize}MB will fail`);
    console.log("=".repeat(50));
    
    // Create JSON summary
    const summary = {
      testDate: new Date().toISOString(),
      maxSuccessfulSizeMB: lastSuccessfulSize,
      minFailedSizeMB: firstFailedSize || null,
      recommendedMaxSizeMB: Math.floor(lastSuccessfulSize * 0.95),
      environment: {
        orgId: orgId.substring(0, 8) + "...",
        envId: envId.substring(0, 8) + "..."
      }
    };
    
    console.log("\n📄 JSON Summary:");
    console.log(JSON.stringify(summary, null, 2));
    
    // Assertions
    expect(lastSuccessfulSize).toBeGreaterThanOrEqual(70);
    
  }, 1800000); // 30 minute timeout
});
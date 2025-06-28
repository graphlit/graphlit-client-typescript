import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { GraphlitClient } from "../src/index.js";
import * as Types from "../src/generated/graphql-types.js";
import { clearEnvironment, getEnvironment } from "./setup.js";
import * as fs from "fs";
import * as path from "path";

describe("Ingestion Test Suite", () => {
  let client: GraphlitClient;

  beforeAll(async () => {
    await clearEnvironment();
    client = new GraphlitClient();
  });

  afterAll(async () => {
    await clearEnvironment();
  });

  function generateTestData(sizeInMB: number): string {
    const chunkSize = 1024 * 1024; // 1MB
    const chunks = Math.ceil(sizeInMB);
    let data = "";
    
    for (let i = 0; i < chunks; i++) {
      // Generate 1MB of text data
      const chunk = `[Chunk ${i + 1}/${chunks}] `.padEnd(100, "x").repeat(10240);
      data += chunk;
    }
    
    return data.substring(0, sizeInMB * 1024 * 1024);
  }

  describe("File Size Limits", () => {
    it("should handle small files (< 1MB)", async () => {
      const smallData = "This is a small test file content.";
      const base64Data = Buffer.from(smallData).toString("base64");

      const result = await client.ingestEncodedFile({
        name: "small-test.txt",
        data: base64Data,
        mimeType: "text/plain",
        isSynchronous: true,
      });

      expect(result.id).toBeTruthy();
      expect(result.state).toBe(Types.EntityState.Enabled);
    });

    it("should handle medium files (10MB)", async () => {
      const mediumData = generateTestData(10);
      const base64Data = Buffer.from(mediumData).toString("base64");

      const result = await client.ingestEncodedFile({
        name: "medium-test.txt",
        data: base64Data,
        mimeType: "text/plain",
        isSynchronous: true,
      });

      expect(result.id).toBeTruthy();
      expect(result.state).toBe(Types.EntityState.Enabled);
    });

    it("should determine exact file size limit", async () => {
      // Test files around the expected limit (testing 95MB, 100MB, 105MB)
      const testSizes = [95, 100, 105];
      let maxSuccessfulSize = 0;
      let minFailedSize = Infinity;

      for (const size of testSizes) {
        try {
          const data = generateTestData(size);
          const base64Data = Buffer.from(data).toString("base64");

          const result = await client.ingestEncodedFile({
            name: `test-${size}mb.txt`,
            data: base64Data,
            mimeType: "text/plain",
            isSynchronous: true,
          });

          if (result.id && result.state === Types.EntityState.Enabled) {
            maxSuccessfulSize = Math.max(maxSuccessfulSize, size);
          }
        } catch (error: any) {
          minFailedSize = Math.min(minFailedSize, size);
          console.log(`Failed at ${size}MB: ${error.message}`);
        }
      }

      console.log(`Max successful size: ${maxSuccessfulSize}MB`);
      console.log(`Min failed size: ${minFailedSize}MB`);
      
      expect(maxSuccessfulSize).toBeGreaterThan(0);
    }, { timeout: 300000 });
  });

  describe("File Types", () => {
    it("should handle text files", async () => {
      const textContent = "Sample text content\nWith multiple lines\nAnd special characters: !@#$%";
      const base64Data = Buffer.from(textContent).toString("base64");

      const result = await client.ingestEncodedFile({
        name: "sample.txt",
        data: base64Data,
        mimeType: "text/plain",
        isSynchronous: true,
      });

      expect(result.id).toBeTruthy();
      expect(result.textUri).toBeTruthy();
    });

    it("should handle JSON files", async () => {
      const jsonContent = JSON.stringify({
        name: "Test",
        value: 123,
        nested: { key: "value" },
        array: [1, 2, 3],
      }, null, 2);
      const base64Data = Buffer.from(jsonContent).toString("base64");

      const result = await client.ingestEncodedFile({
        name: "data.json",
        data: base64Data,
        mimeType: "application/json",
        isSynchronous: true,
      });

      expect(result.id).toBeTruthy();
      expect(result.textUri).toBeTruthy();
    });

    it("should handle CSV files", async () => {
      const csvContent = `Name,Age,City
John Doe,30,New York
Jane Smith,25,Los Angeles
Bob Johnson,35,Chicago`;
      const base64Data = Buffer.from(csvContent).toString("base64");

      const result = await client.ingestEncodedFile({
        name: "data.csv",
        data: base64Data,
        mimeType: "text/csv",
        isSynchronous: true,
      });

      expect(result.id).toBeTruthy();
      expect(result.textUri).toBeTruthy();
    });
  });

  describe("Async vs Sync Ingestion", () => {
    it("should handle synchronous ingestion", async () => {
      const data = "Synchronous test data";
      const base64Data = Buffer.from(data).toString("base64");

      const startTime = Date.now();
      const result = await client.ingestEncodedFile({
        name: "sync-test.txt",
        data: base64Data,
        mimeType: "text/plain",
        isSynchronous: true,
      });
      const duration = Date.now() - startTime;

      expect(result.id).toBeTruthy();
      expect(result.state).toBe(Types.EntityState.Enabled);
      console.log(`Sync ingestion took ${duration}ms`);
    });

    it("should handle asynchronous ingestion", async () => {
      const data = "Asynchronous test data";
      const base64Data = Buffer.from(data).toString("base64");

      const result = await client.ingestEncodedFile({
        name: "async-test.txt",
        data: base64Data,
        mimeType: "text/plain",
        isSynchronous: false,
      });

      expect(result.id).toBeTruthy();
      // For async, the file might still be processing
      expect([Types.EntityState.Enabled, Types.EntityState.Pending]).toContain(result.state);
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid base64 data", async () => {
      await expect(
        client.ingestEncodedFile({
          name: "invalid.txt",
          data: "not-valid-base64!@#$",
          mimeType: "text/plain",
          isSynchronous: true,
        })
      ).rejects.toThrow();
    });

    it("should handle empty data", async () => {
      await expect(
        client.ingestEncodedFile({
          name: "empty.txt",
          data: "",
          mimeType: "text/plain",
          isSynchronous: true,
        })
      ).rejects.toThrow();
    });

    it("should handle missing mime type", async () => {
      const data = Buffer.from("test").toString("base64");
      
      // Should still work, but might use a default mime type
      const result = await client.ingestEncodedFile({
        name: "no-mime.txt",
        data,
        mimeType: "",
        isSynchronous: true,
      });

      expect(result.id).toBeTruthy();
    });
  });

  describe("Special Characters and Encoding", () => {
    it("should handle Unicode characters", async () => {
      const unicodeContent = "Hello 世界! 🌍 Emoji test: 😀😁😂 Special: ñáéíóú";
      const base64Data = Buffer.from(unicodeContent, "utf8").toString("base64");

      const result = await client.ingestEncodedFile({
        name: "unicode-test.txt",
        data: base64Data,
        mimeType: "text/plain; charset=utf-8",
        isSynchronous: true,
      });

      expect(result.id).toBeTruthy();
      expect(result.state).toBe(Types.EntityState.Enabled);
    });

    it("should handle special characters in filenames", async () => {
      const data = Buffer.from("test content").toString("base64");
      const specialNames = [
        "file with spaces.txt",
        "file_with_underscores.txt",
        "file-with-dashes.txt",
        "file.multiple.dots.txt",
      ];

      for (const name of specialNames) {
        const result = await client.ingestEncodedFile({
          name,
          data,
          mimeType: "text/plain",
          isSynchronous: true,
        });

        expect(result.id).toBeTruthy();
        expect(result.name).toBe(name);
      }
    });
  });
});
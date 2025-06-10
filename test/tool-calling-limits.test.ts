import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import { TOOL_LIMIT_TEST_MODELS } from "./test-models";
import { AgentStreamEvent } from "../src/types/ui-events";

/**
 * Tool calling limits test suite
 * Tests how many tool calls each model can generate in a single conversation turn
 */
describe("Tool Calling Limits", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;

  if (!orgId || !envId || !secret) {
    console.warn(
      "⚠️  Skipping tool calling limits tests - missing Graphlit credentials"
    );
    return;
  }

  let client: Graphlit;
  const createdSpecifications: string[] = [];
  const createdConversations: string[] = [];

  // Track tool call statistics across models
  const modelStatistics: {
    model: string;
    totalCalls: number;
    chapters: number;
    pages: number;
    paragraphs: number;
    duration: number;
    tokenCount?: number;
  }[] = [];

  beforeAll(async () => {
    client = new Graphlit(orgId, envId, secret);

    // Set up conditional streaming - use native if available, fallback otherwise
    if (process.env.OPENAI_API_KEY) {
      try {
        const { default: OpenAI } = await import("openai");
        const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        console.log(
          "✅ Using native OpenAI streaming for tool calling limits tests"
        );

        client.setOpenAIClient(openaiClient);
      } catch (e) {
        console.log("⚠️ OpenAI SDK not available, using fallback streaming");
      }
    } else {
      console.log("⚠️ No OpenAI API key, using fallback streaming");
    }
  });

  afterAll(async () => {
    // Clean up conversations
    console.log(
      `\n🧹 Cleaning up ${createdConversations.length} test conversations...`
    );
    for (const convId of createdConversations) {
      try {
        await client.deleteConversation(convId);
      } catch (error) {
        console.warn(`⚠️  Failed to delete conversation ${convId}`);
      }
    }

    // Clean up specifications
    console.log(
      `🧹 Cleaning up ${createdSpecifications.length} test specifications...`
    );
    for (const specId of createdSpecifications) {
      try {
        await client.deleteSpecification(specId);
      } catch (error) {
        console.warn(`⚠️  Failed to delete specification ${specId}`);
      }
    }

    // Display results summary
    if (modelStatistics.length > 0) {
      console.log("\n📊 TOOL CALLING LIMITS LEADERBOARD");
      console.log("=".repeat(80));

      const sorted = [...modelStatistics].sort(
        (a, b) => b.totalCalls - a.totalCalls
      );

      console.log("\n🏆 Most Tool Calls in Single Turn:");
      sorted.forEach((stat, idx) => {
        console.log(`  ${idx + 1}. ${stat.model}: ${stat.totalCalls} calls`);
        console.log(
          `     📚 ${stat.chapters} chapters, 📄 ${stat.pages} pages, 📝 ${stat.paragraphs} paragraphs`
        );
        console.log(`     ⏱️ ${(stat.duration / 1000).toFixed(1)}s`);
      });

      console.log("\n📈 Tool Call Breakdown:");
      const totalByType = sorted.reduce(
        (acc, stat) => ({
          chapters: acc.chapters + stat.chapters,
          pages: acc.pages + stat.pages,
          paragraphs: acc.paragraphs + stat.paragraphs,
        }),
        { chapters: 0, pages: 0, paragraphs: 0 }
      );

      console.log(`  Total chapters written: ${totalByType.chapters}`);
      console.log(`  Total pages written: ${totalByType.pages}`);
      console.log(`  Total paragraphs written: ${totalByType.paragraphs}`);
      console.log("=".repeat(80));
    }
  }, 120000);

  // Book writing tools
  const createBookTool: Types.ToolDefinitionInput = {
    name: "createBook",
    description: "Create a new book with title and metadata",
    schema: JSON.stringify({
      type: "object",
      properties: {
        title: { type: "string" },
        author: { type: "string" },
        genre: { type: "string" },
        targetChapters: { type: "integer", minimum: 1 },
        targetPagesPerChapter: { type: "integer", minimum: 1 },
      },
      required: ["title", "author", "targetChapters"],
    }),
  };

  const writeChapterTool: Types.ToolDefinitionInput = {
    name: "writeChapter",
    description: "Write a new chapter for the book",
    schema: JSON.stringify({
      type: "object",
      properties: {
        chapterNumber: { type: "integer", minimum: 1 },
        title: { type: "string" },
        summary: { type: "string", maxLength: 200 },
        targetPages: { type: "integer", minimum: 1, default: 5 },
      },
      required: ["chapterNumber", "title"],
    }),
  };

  const writePageTool: Types.ToolDefinitionInput = {
    name: "writePage",
    description: "Write a page of content for a specific chapter",
    schema: JSON.stringify({
      type: "object",
      properties: {
        chapterNumber: { type: "integer", minimum: 1 },
        pageNumber: { type: "integer", minimum: 1 },
        content: { type: "string", minLength: 100, maxLength: 500 },
        targetParagraphs: { type: "integer", minimum: 1, default: 3 },
      },
      required: ["chapterNumber", "pageNumber"],
    }),
  };

  const writeParagraphTool: Types.ToolDefinitionInput = {
    name: "writeParagraph",
    description: "Write a paragraph for a specific page",
    schema: JSON.stringify({
      type: "object",
      properties: {
        chapterNumber: { type: "integer", minimum: 1 },
        pageNumber: { type: "integer", minimum: 1 },
        paragraphNumber: { type: "integer", minimum: 1 },
        content: { type: "string", minLength: 50, maxLength: 300 },
        style: {
          type: "string",
          enum: ["narrative", "dialogue", "description", "action"],
          default: "narrative",
        },
      },
      required: ["chapterNumber", "pageNumber", "paragraphNumber", "content"],
    }),
  };

  const finalizeBookTool: Types.ToolDefinitionInput = {
    name: "finalizeBook",
    description: "Finalize the book and generate summary statistics",
    schema: JSON.stringify({
      type: "object",
      properties: {
        generateTableOfContents: { type: "boolean", default: true },
        generateSummary: { type: "boolean", default: true },
      },
    }),
  };

  describe("Model Tool Calling Limits", () => {
    // Use shared model configurations
    const testModels = TOOL_LIMIT_TEST_MODELS;

    for (const model of testModels) {
      it(`should test tool calling limits for ${model.name}`, async () => {
        console.log(`\n📚 Testing ${model.name} book writing capabilities...`);

        let specId: string;
        try {
          // Create specification
          const createResponse = await client.createSpecification(
            model.config as Types.SpecificationInput
          );
          specId = createResponse.createSpecification?.id!;

          if (!specId) {
            console.log(
              `⚠️ Skipping ${model.name} - failed to create specification`
            );
            return;
          }

          createdSpecifications.push(specId);
        } catch (error) {
          console.log(
            `⚠️ Skipping ${model.name} - specification creation failed: ${error}`
          );
          return;
        }

        // Track tool calls
        const toolCalls: { name: string; args: any; timestamp: number }[] = [];
        const bookStructure = {
          title: "",
          author: "",
          chapters: new Map<
            number,
            { title: string; pages: Map<number, string[]> }
          >(),
        };

        // Tool handlers
        const createBookHandler = async (args: any) => {
          console.log(`📖 Creating book: "${args.title}" by ${args.author}`);
          bookStructure.title = args.title;
          bookStructure.author = args.author;
          toolCalls.push({ name: "createBook", args, timestamp: Date.now() });
          return {
            success: true,
            bookId: `book-${Date.now()}`,
            message: `Book "${args.title}" created with target of ${args.targetChapters} chapters`,
          };
        };

        const writeChapterHandler = async (args: any) => {
          console.log(
            `📑 Writing chapter ${args.chapterNumber}: "${args.title}"`
          );
          bookStructure.chapters.set(args.chapterNumber, {
            title: args.title,
            pages: new Map(),
          });
          toolCalls.push({ name: "writeChapter", args, timestamp: Date.now() });
          return {
            success: true,
            chapterId: `ch-${args.chapterNumber}`,
            message: `Chapter ${args.chapterNumber} "${args.title}" created`,
          };
        };

        const writePageHandler = async (args: any) => {
          const chapter = bookStructure.chapters.get(args.chapterNumber);
          if (chapter) {
            if (!chapter.pages.has(args.pageNumber)) {
              chapter.pages.set(args.pageNumber, []);
            }
          }
          toolCalls.push({ name: "writePage", args, timestamp: Date.now() });
          return {
            success: true,
            pageId: `ch${args.chapterNumber}-p${args.pageNumber}`,
            wordCount: args.content?.length || 0,
          };
        };

        const writeParagraphHandler = async (args: any) => {
          const chapter = bookStructure.chapters.get(args.chapterNumber);
          if (chapter) {
            const page = chapter.pages.get(args.pageNumber);
            if (page) {
              page.push(args.content);
            }
          }
          toolCalls.push({
            name: "writeParagraph",
            args,
            timestamp: Date.now(),
          });
          return {
            success: true,
            paragraphId: `ch${args.chapterNumber}-p${args.pageNumber}-para${args.paragraphNumber}`,
            wordCount: args.content.split(" ").length,
          };
        };

        const finalizeBookHandler = async (args: any) => {
          console.log("📕 Finalizing book...");
          toolCalls.push({ name: "finalizeBook", args, timestamp: Date.now() });

          const stats = {
            title: bookStructure.title,
            author: bookStructure.author,
            totalChapters: bookStructure.chapters.size,
            totalPages: Array.from(bookStructure.chapters.values()).reduce(
              (sum, ch) => sum + ch.pages.size,
              0
            ),
            totalParagraphs: Array.from(bookStructure.chapters.values()).reduce(
              (sum, ch) =>
                Array.from(ch.pages.values()).reduce(
                  (pageSum, paragraphs) => pageSum + paragraphs.length,
                  sum
                ),
              0
            ),
          };

          return { success: true, statistics: stats };
        };

        const events: AgentStreamEvent[] = [];
        const startTime = Date.now();
        let conversationId: string | undefined;

        // Helper to calculate tool call counts
        const getToolCallCounts = () =>
          toolCalls.reduce(
            (acc, call) => {
              acc[call.name] = (acc[call.name] || 0) + 1;
              return acc;
            },
            {} as Record<string, number>
          );

        // Encourage maximum tool usage
        const prompt = `You are a prolific author who writes very quickly. I want you to write a complete book about "The Adventures of AI" with EXACTLY 3 chapters. 

CRITICAL: This is a test of how many tool calls you can make in a single response. The goal is to make as many tool calls as possible!

Requirements:
1. First use createBook to create the book with 3 chapters
2. For EACH chapter (1, 2, and 3):
   - Use writeChapter to create the chapter
   - Use writePage to create 5-10 pages per chapter (MORE pages = better!)
   - Use writeParagraph to write 3-5 paragraphs per page (MORE paragraphs = better!)
3. Finally use finalizeBook to complete the book

IMPORTANT: 
- Aim for 50-100+ total tool calls if possible
- Each chapter should be substantial (5+ pages)
- Each page should have multiple paragraphs (3-5)
- Write detailed, rich content - this is not a short story but a full book
- Do NOT stop early - use as many tool calls as the system allows
- The more content you write, the better the test result!

Start writing immediately and don't stop until you've written a complete, detailed book!`;

        // Check if streaming is supported
        if (!client.supportsStreaming()) {
          console.log("⚠️  Skipping test - streaming not supported");
          return;
        }

        try {
          await client.streamAgent(
            prompt,
            (event: AgentStreamEvent) => {
              events.push(event);

              console.log(`📝 Model event: "${event.type}"`);

              if (event.type === "conversation_started") {
                conversationId = event.conversationId;
                createdConversations.push(event.conversationId);
              } else if (event.type === "tool_update") {
                if (event.status === "completed") {
                  console.log(`  ✅ ${event.toolCall.name} completed`);
                } else if (event.status === "failed") {
                  console.log(
                    `  ❌ ${event.toolCall.name} failed: ${event.error}`
                  );
                }
              } else if (event.type === "conversation_completed") {
                console.log(`\n💬 Book writing completed!`);
              } else if (event.type === "error") {
                console.error(`❌ Error: ${event.error}`);
              }
            },
            undefined, // conversationId
            { id: specId }, // specification
            [
              // tools
              createBookTool,
              writeChapterTool,
              writePageTool,
              writeParagraphTool,
              finalizeBookTool,
            ],
            {
              // toolHandlers
              createBook: createBookHandler,
              writeChapter: writeChapterHandler,
              writePage: writePageHandler,
              writeParagraph: writeParagraphHandler,
              finalizeBook: finalizeBookHandler,
            }
          );
        } catch (error) {
          console.log(`❌ ${model.name} streaming failed: ${error}`);

          // Calculate tool call counts for error case
          const errorToolCallCounts = getToolCallCounts();

          // Still save basic statistics
          modelStatistics.push({
            model: model.name,
            totalCalls: toolCalls.length,
            chapters: errorToolCallCounts.writeChapter || 0,
            pages: errorToolCallCounts.writePage || 0,
            paragraphs: errorToolCallCounts.writeParagraph || 0,
            duration: Date.now() - startTime,
          });

          // Make sure we have at least a conversation ID to clean up
          if (conversationId) {
            createdConversations.push(conversationId);
          }

          // Check if we got partial results
          if (toolCalls.length > 0) {
            console.log(
              `📊 Partial results collected: ${toolCalls.length} tool calls before error`
            );
          }

          // Fail the test but with a descriptive message
          throw new Error(
            `${model.name} failed to complete tool calling test: ${error}`
          );
        }

        const endTime = Date.now();
        const duration = endTime - startTime;

        // Analyze results
        const toolCallCounts = getToolCallCounts();

        console.log(`\n📊 ${model.name} Results:`);
        console.log(`  Total tool calls: ${toolCalls.length}`);
        console.log(`  Breakdown:`);
        console.log(`    - createBook: ${toolCallCounts.createBook || 0}`);
        console.log(`    - writeChapter: ${toolCallCounts.writeChapter || 0}`);
        console.log(`    - writePage: ${toolCallCounts.writePage || 0}`);
        console.log(
          `    - writeParagraph: ${toolCallCounts.writeParagraph || 0}`
        );
        console.log(`    - finalizeBook: ${toolCallCounts.finalizeBook || 0}`);
        console.log(`  Duration: ${(duration / 1000).toFixed(1)}s`);

        // Book structure summary
        console.log(`\n📖 Book Structure:`);
        console.log(`  Title: "${bookStructure.title}"`);
        console.log(`  Chapters: ${bookStructure.chapters.size}`);
        for (const [chNum, chapter] of bookStructure.chapters) {
          console.log(
            `    Chapter ${chNum}: "${chapter.title}" - ${chapter.pages.size} pages`
          );
        }

        // Save statistics
        modelStatistics.push({
          model: model.name,
          totalCalls: toolCalls.length,
          chapters: toolCallCounts.writeChapter || 0,
          pages: toolCallCounts.writePage || 0,
          paragraphs: toolCallCounts.writeParagraph || 0,
          duration: duration,
        });

        // Assertions
        expect(toolCalls.length).toBeGreaterThan(0);
        expect(toolCallCounts.createBook).toBe(1); // Should create exactly one book
        expect(toolCallCounts.writeChapter || 0).toBeGreaterThanOrEqual(1); // At least one chapter

        console.log(`✅ ${model.name} completed book writing test`);
      }, 180000); // 3 minute timeout per model
    }
  });

  describe("Stress Test - Maximum Tool Calls", () => {
    it("should push GPT-4o to its tool calling limits", async () => {
      console.log("\n🚀 Stress testing GPT-4o with maximum tool calls...");

      // Create specification with high token limit
      const createResponse = await client.createSpecification({
        name: "Stress Test GPT-4o",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4O_128K,
          temperature: 0.8,
          completionTokenLimit: 8000, // Very high limit
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      // Simple counter tool for maximum calls
      const incrementTool: Types.ToolDefinitionInput = {
        name: "increment",
        description: "Increment a counter by a specified amount",
        schema: JSON.stringify({
          type: "object",
          properties: {
            value: { type: "integer", minimum: 1, default: 1 },
            label: { type: "string" },
          },
        }),
      };

      let totalIncrements = 0;
      const incrementCalls: {
        value: number;
        label?: string;
        timestamp: number;
      }[] = [];

      const incrementHandler = async (args: any) => {
        const value = args.value || 1;
        totalIncrements += value;
        incrementCalls.push({
          value,
          label: args.label,
          timestamp: Date.now(),
        });
        return {
          newTotal: totalIncrements,
          increment: value,
          callNumber: incrementCalls.length,
        };
      };

      const startTime = Date.now();
      let conversationId: string | undefined;

      // Check if streaming is supported
      if (!client.supportsStreaming()) {
        console.log("⚠️  Skipping test - streaming not supported");
        return;
      }

      await client.streamAgent(
        `You are testing the limits of tool calling. Use the increment tool as many times as possible in a single response. 

CHALLENGE: Try to make at least 50 tool calls! Be creative with the labels. You could:
- Count from 1 to 50
- Count by different increments (1s, 5s, 10s)
- Count different categories (animals, colors, numbers, etc.)
- Just keep calling the tool with different labels

The goal is to see how many tool calls you can make in one turn. Don't explain, just call the tool repeatedly!`,
        (event: AgentStreamEvent) => {
          if (event.type === "conversation_started") {
            conversationId = event.conversationId;
            createdConversations.push(event.conversationId);
          } else if (
            event.type === "tool_update" &&
            event.status === "completed"
          ) {
            if (incrementCalls.length % 10 === 0) {
              console.log(
                `  📊 ${incrementCalls.length} tool calls completed...`
              );
            }
          } else if (event.type === "conversation_completed") {
            console.log(`\n🏁 Stress test completed!`);
          }
        },
        undefined, // conversationId
        { id: specId }, // specification
        [incrementTool], // tools
        { increment: incrementHandler } // toolHandlers
      );

      const duration = Date.now() - startTime;

      console.log(`\n📊 Stress Test Results:`);
      console.log(`  Total tool calls: ${incrementCalls.length}`);
      console.log(`  Total increment value: ${totalIncrements}`);
      console.log(`  Duration: ${(duration / 1000).toFixed(1)}s`);
      console.log(
        `  Calls per second: ${(incrementCalls.length / (duration / 1000)).toFixed(2)}`
      );

      // Show sample of calls
      if (incrementCalls.length > 0) {
        console.log(`\n  First 5 calls:`);
        incrementCalls.slice(0, 5).forEach((call, idx) => {
          console.log(
            `    ${idx + 1}. +${call.value} ${call.label ? `(${call.label})` : ""}`
          );
        });

        if (incrementCalls.length > 5) {
          console.log(`  ...`);
          console.log(`  Last 5 calls:`);
          incrementCalls.slice(-5).forEach((call, idx) => {
            console.log(
              `    ${incrementCalls.length - 4 + idx}. +${call.value} ${call.label ? `(${call.label})` : ""}`
            );
          });
        }
      }

      expect(incrementCalls.length).toBeGreaterThan(10); // Should make many calls
      console.log(
        `\n✅ GPT-4o stress test completed with ${incrementCalls.length} tool calls`
      );
    }, 240000); // 4 minute timeout
  });
});

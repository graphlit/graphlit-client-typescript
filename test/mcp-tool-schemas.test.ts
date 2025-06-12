import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import { AgentStreamEvent } from "../src/types/ui-events";

// Type definitions for tool handlers
interface TreeNode {
  id: string;
  name: string;
  type: string;
  metadata?: {
    size?: number;
    created?: string;
    modified?: string;
    permissions?: string;
    owner?: string;
    tags?: string[];
  };
  children?: TreeNode[];
}

/**
 * MCP-style complex tool schema test suite
 * Tests various JSON Schema features that MCP tools might use
 */
describe("MCP-Style Complex Tool Schemas", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;

  if (!orgId || !envId || !secret) {
    console.warn(
      "⚠️  Skipping MCP tool schema tests - missing Graphlit credentials",
    );
    return;
  }

  let client: Graphlit;
  const createdSpecifications: string[] = [];
  const createdConversations: string[] = [];

  beforeAll(async () => {
    client = new Graphlit(orgId, envId, secret);

    // Set up conditional streaming - use native if available, fallback otherwise
    if (process.env.OPENAI_API_KEY) {
      try {
        const { default: OpenAI } = await import("openai");
        const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        console.log(
          "✅ Using native OpenAI streaming for MCP tool schema tests",
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
      `\n🧹 Cleaning up ${createdConversations.length} test conversations...`,
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
      `🧹 Cleaning up ${createdSpecifications.length} test specifications...`,
    );
    for (const specId of createdSpecifications) {
      try {
        await client.deleteSpecification(specId);
      } catch (error) {
        console.warn(`⚠️  Failed to delete specification ${specId}`);
      }
    }
  }, 90000);

  describe("Nested Object Schemas", () => {
    it("should handle deeply nested object structures", async () => {
      console.log("🎯 Testing deeply nested object schemas...");

      // Create specification
      const createResponse = await client.createSpecification({
        name: "Nested Schema Test",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4O_128K,
          temperature: 0.3,
          completionTokenLimit: 800,
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      // Complex nested schema like MCP file system operations
      const fileSystemTool: Types.ToolDefinitionInput = {
        name: "fileSystem",
        description: "Perform file system operations with detailed metadata",
        schema: JSON.stringify({
          type: "object",
          properties: {
            operation: {
              type: "string",
              enum: ["read", "write", "delete", "move", "copy", "list"],
              description: "The file operation to perform",
            },
            path: {
              type: "string",
              pattern: "^(/[^/]+)+/?$",
              description: "Unix-style absolute path",
            },
            options: {
              type: "object",
              properties: {
                recursive: {
                  type: "boolean",
                  default: false,
                  description: "Apply operation recursively",
                },
                permissions: {
                  type: "object",
                  properties: {
                    owner: {
                      type: "object",
                      properties: {
                        read: { type: "boolean" },
                        write: { type: "boolean" },
                        execute: { type: "boolean" },
                      },
                      required: ["read", "write", "execute"],
                    },
                    group: {
                      type: "object",
                      properties: {
                        read: { type: "boolean" },
                        write: { type: "boolean" },
                        execute: { type: "boolean" },
                      },
                      required: ["read", "write", "execute"],
                    },
                    others: {
                      type: "object",
                      properties: {
                        read: { type: "boolean" },
                        write: { type: "boolean" },
                        execute: { type: "boolean" },
                      },
                      required: ["read", "write", "execute"],
                    },
                  },
                  required: ["owner", "group", "others"],
                },
                metadata: {
                  type: "object",
                  properties: {
                    tags: {
                      type: "array",
                      items: { type: "string" },
                      minItems: 0,
                      maxItems: 10,
                    },
                    attributes: {
                      type: "object",
                      additionalProperties: {
                        type: "string",
                      },
                    },
                    timestamps: {
                      type: "object",
                      properties: {
                        created: { type: "string", format: "date-time" },
                        modified: { type: "string", format: "date-time" },
                        accessed: { type: "string", format: "date-time" },
                      },
                    },
                  },
                },
              },
            },
            content: {
              type: "string",
              description: "File content for write operations",
            },
          },
          required: ["operation", "path"],
          additionalProperties: false,
        }),
      };

      const toolHandler = async (args: {
        operation: string;
        path: string;
        options?: {
          recursive?: boolean;
          permissions?: {
            owner: { read: boolean; write: boolean; execute: boolean };
            group: { read: boolean; write: boolean; execute: boolean };
            others: { read: boolean; write: boolean; execute: boolean };
          };
          metadata?: {
            tags?: string[];
            attributes?: Record<string, string>;
            timestamps?: {
              created?: string;
              modified?: string;
              accessed?: string;
            };
          };
        };
        content?: string;
      }) => {
        console.log("📁 File system operation:", JSON.stringify(args, null, 2));

        // Validate nested structure was preserved
        if (args.options?.permissions) {
          expect(args.options.permissions).toHaveProperty("owner");
          expect(args.options.permissions).toHaveProperty("group");
          expect(args.options.permissions).toHaveProperty("others");
        }

        return {
          success: true,
          operation: args.operation,
          path: args.path,
          details: "Operation completed successfully",
          metadata: args.options?.metadata || {},
        };
      };

      const events: AgentStreamEvent[] = [];

      // Check if streaming is supported
      if (!client.supportsStreaming()) {
        console.log("⚠️  Skipping test - streaming not supported");
        return;
      }

      await client.streamAgent(
        `Please create a new file at /home/user/documents/report.txt with the content "Hello World". 
         Set permissions to: owner (read: true, write: true, execute: false), 
         group (read: true, write: false, execute: false), 
         others (read: false, write: false, execute: false).
         Add tags: ["important", "draft"] and set a custom attribute "department" to "engineering".`,
        (event: AgentStreamEvent) => {
          events.push(event);
          if (event.type === "conversation_started") {
            createdConversations.push(event.conversationId);
          } else if (event.type === "tool_update") {
            console.log(`🔧 Tool ${event.toolCall.name}: ${event.status}`);
          }
        },
        undefined,
        { id: specId },
        [fileSystemTool],
        { fileSystem: toolHandler },
      );

      const toolEvents = events.filter((e) => e.type === "tool_update");
      expect(toolEvents.length).toBeGreaterThan(0);
      console.log("✅ Deeply nested object schema handled successfully");
    }, 90000);
  });

  describe("Union Types (oneOf/anyOf)", () => {
    it("should handle union type schemas with oneOf", async () => {
      console.log("\n🔀 Testing union type schemas with oneOf...");

      // Create specification
      const createResponse = await client.createSpecification({
        name: "Union Type Test",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4O_128K,
          temperature: 0.3,
          completionTokenLimit: 600,
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      // MCP-style tool with union types for different data sources
      const dataSourceTool: Types.ToolDefinitionInput = {
        name: "dataSource",
        description:
          "Fetch data from various sources with type-specific configurations",
        schema: JSON.stringify({
          type: "object",
          properties: {
            source: {
              oneOf: [
                {
                  type: "object",
                  properties: {
                    type: { type: "string", const: "database" },
                    connectionString: {
                      type: "string",
                      pattern: "^(postgresql|mysql|mongodb)://.*",
                    },
                    query: { type: "string" },
                    parameters: {
                      type: "array",
                      items: {
                        oneOf: [
                          { type: "string" },
                          { type: "number" },
                          { type: "boolean" },
                          { type: "null" },
                        ],
                      },
                    },
                    timeout: {
                      type: "integer",
                      minimum: 1000,
                      maximum: 30000,
                    },
                  },
                  required: ["type", "connectionString", "query"],
                },
                {
                  type: "object",
                  properties: {
                    type: { type: "string", const: "http" },
                    url: {
                      type: "string",
                      format: "uri",
                      pattern: "^https?://",
                    },
                    method: {
                      type: "string",
                      enum: ["GET", "POST", "PUT", "DELETE", "PATCH"],
                    },
                    headers: {
                      type: "object",
                      additionalProperties: { type: "string" },
                    },
                    body: {
                      oneOf: [
                        { type: "string" },
                        { type: "object" },
                        { type: "array", items: { type: "object" } },
                      ],
                    },
                    auth: {
                      oneOf: [
                        {
                          type: "object",
                          properties: {
                            type: { type: "string", const: "bearer" },
                            token: { type: "string" },
                          },
                          required: ["type", "token"],
                        },
                        {
                          type: "object",
                          properties: {
                            type: { type: "string", const: "basic" },
                            username: { type: "string" },
                            password: { type: "string" },
                          },
                          required: ["type", "username", "password"],
                        },
                      ],
                    },
                  },
                  required: ["type", "url", "method"],
                },
                {
                  type: "object",
                  properties: {
                    type: { type: "string", const: "file" },
                    path: { type: "string" },
                    encoding: {
                      type: "string",
                      enum: ["utf8", "base64", "hex", "binary"],
                      default: "utf8",
                    },
                    format: {
                      type: "string",
                      enum: ["json", "csv", "xml", "yaml", "text"],
                    },
                  },
                  required: ["type", "path"],
                },
              ],
            },
            transform: {
              type: "object",
              properties: {
                filter: {
                  type: "string",
                  description: "JSONPath or XPath expression",
                },
                map: {
                  type: "string",
                  description: "Transformation expression",
                },
                limit: { type: "integer", minimum: 1 },
              },
            },
          },
          required: ["source"],
        }),
      };

      const toolHandler = async (args: {
        source: {
          type: string;
          connectionString?: string;
          query?: string;
          parameters?: (string | number | boolean | null)[];
          timeout?: number;
          url?: string;
          method?: string;
          headers?: Record<string, string>;
          body?: string | object | object[];
          auth?: {
            type: string;
            token?: string;
            username?: string;
            password?: string;
          };
          path?: string;
          encoding?: string;
          format?: string;
        };
        transform?: {
          filter?: string;
          map?: string;
          limit?: number;
        };
      }) => {
        console.log("🔌 Data source access:", JSON.stringify(args, null, 2));

        // Validate the union type was correctly resolved
        expect(args.source).toHaveProperty("type");
        expect(["database", "http", "file"]).toContain(args.source.type);

        // Return mock data based on source type
        switch (args.source.type) {
          case "database":
            return {
              rows: [
                { id: 1, name: "Item 1", value: 100 },
                { id: 2, name: "Item 2", value: 200 },
              ],
              count: 2,
              source: "database",
            };
          case "http":
            return {
              status: 200,
              data: { message: "Success", items: [] },
              source: "http",
            };
          case "file":
            return {
              content: "File content here",
              size: 1024,
              source: "file",
            };
          default:
            throw new Error("Unknown source type");
        }
      };

      const events: AgentStreamEvent[] = [];

      // Check if streaming is supported
      if (!client.supportsStreaming()) {
        console.log("⚠️  Skipping test - streaming not supported");
        return;
      }

      await client.streamAgent(
        `I need to fetch data from three different sources:
         1. Query a PostgreSQL database at postgresql://localhost:5432/mydb with "SELECT * FROM users LIMIT 10"
         2. Make an HTTP GET request to https://api.example.com/data with bearer token "abc123"
         3. Read a JSON file from /data/config.json
         Please fetch from all three sources.`,
        (event: AgentStreamEvent) => {
          events.push(event);
          if (event.type === "conversation_started") {
            createdConversations.push(event.conversationId);
          } else if (event.type === "tool_update") {
            console.log(`🔧 Tool ${event.toolCall.name}: ${event.status}`);
          }
        },
        undefined,
        { id: specId },
        [dataSourceTool],
        { dataSource: toolHandler },
      );

      const toolEvents = events.filter((e) => e.type === "tool_update");
      expect(toolEvents.length).toBeGreaterThan(0);
      console.log("✅ Union type schemas handled successfully");
    }, 90000);
  });

  describe("Complex Array Schemas", () => {
    it("should handle arrays with complex item schemas and constraints", async () => {
      console.log("\n📋 Testing complex array schemas...");

      // Create specification
      const createResponse = await client.createSpecification({
        name: "Array Schema Test",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4O_128K,
          temperature: 0.3,
          completionTokenLimit: 800,
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      // MCP-style batch processing tool with complex array validation
      const batchProcessorTool: Types.ToolDefinitionInput = {
        name: "batchProcessor",
        description: "Process batches of items with complex validation rules",
        schema: JSON.stringify({
          type: "object",
          properties: {
            items: {
              type: "array",
              minItems: 1,
              maxItems: 100,
              uniqueItems: true,
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                    pattern: "^[A-Z]{2}-\\d{6}$",
                    description: "ID format: XX-123456",
                  },
                  priority: {
                    type: "integer",
                    minimum: 1,
                    maximum: 10,
                  },
                  tags: {
                    type: "array",
                    items: {
                      type: "string",
                      pattern: "^[a-z]+(-[a-z]+)*$",
                      minLength: 3,
                      maxLength: 20,
                    },
                    minItems: 1,
                    maxItems: 5,
                    uniqueItems: true,
                  },
                  data: {
                    type: "object",
                    properties: {
                      value: {
                        type: "number",
                        multipleOf: 0.01,
                        minimum: 0,
                        exclusiveMaximum: 1000000,
                      },
                      metadata: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            key: {
                              type: "string",
                              enum: ["category", "source", "version", "status"],
                            },
                            value: {
                              type: "string",
                            },
                            confidence: {
                              type: "number",
                              minimum: 0,
                              maximum: 1,
                            },
                          },
                          required: ["key", "value"],
                          additionalProperties: false,
                        },
                        minItems: 0,
                        maxItems: 10,
                      },
                    },
                    required: ["value"],
                  },
                  schedule: {
                    type: "object",
                    properties: {
                      startDate: {
                        type: "string",
                        format: "date",
                      },
                      endDate: {
                        type: "string",
                        format: "date",
                      },
                      recurrence: {
                        type: "object",
                        properties: {
                          frequency: {
                            type: "string",
                            enum: ["daily", "weekly", "monthly", "yearly"],
                          },
                          interval: {
                            type: "integer",
                            minimum: 1,
                            maximum: 365,
                          },
                          daysOfWeek: {
                            type: "array",
                            items: {
                              type: "integer",
                              minimum: 0,
                              maximum: 6,
                            },
                            uniqueItems: true,
                          },
                        },
                        required: ["frequency"],
                      },
                    },
                    required: ["startDate"],
                  },
                },
                required: ["id", "priority", "tags", "data"],
                additionalProperties: false,
              },
            },
            processingOptions: {
              type: "object",
              properties: {
                parallel: {
                  type: "boolean",
                  default: false,
                },
                batchSize: {
                  type: "integer",
                  minimum: 1,
                  maximum: 50,
                  default: 10,
                },
                errorHandling: {
                  type: "string",
                  enum: ["stop", "continue", "retry"],
                  default: "continue",
                },
                transformations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      field: { type: "string" },
                      operation: {
                        type: "string",
                        enum: [
                          "uppercase",
                          "lowercase",
                          "trim",
                          "normalize",
                          "hash",
                        ],
                      },
                    },
                    required: ["field", "operation"],
                  },
                },
              },
            },
          },
          required: ["items"],
        }),
      };

      const toolHandler = async (args: {
        items: Array<{
          id: string;
          priority: number;
          tags: string[];
          data: {
            value: number;
            metadata?: Array<{
              key: string;
              value: string;
              confidence?: number;
            }>;
          };
          schedule?: {
            startDate: string;
            endDate?: string;
            recurrence?: {
              frequency: string;
              interval?: number;
              daysOfWeek?: number[];
            };
          };
        }>;
        processingOptions?: {
          parallel?: boolean;
          batchSize?: number;
          errorHandling?: string;
          transformations?: Array<{
            field: string;
            operation: string;
          }>;
        };
      }) => {
        console.log("🔄 Batch processing:", JSON.stringify(args, null, 2));

        // Validate array constraints were applied
        expect(args.items).toBeInstanceOf(Array);
        expect(args.items.length).toBeGreaterThanOrEqual(1);

        // Process each item
        const results = args.items.map((item) => {
          // Validate item structure
          expect(item.id).toMatch(/^[A-Z]{2}-\d{6}$/);
          expect(item.priority).toBeGreaterThanOrEqual(1);
          expect(item.priority).toBeLessThanOrEqual(10);
          expect(item.tags).toBeInstanceOf(Array);

          return {
            id: item.id,
            processed: true,
            result: item.data.value * 2,
            timestamp: new Date().toISOString(),
          };
        });

        return {
          processed: results.length,
          successful: results.length,
          failed: 0,
          results: results,
        };
      };

      const events: AgentStreamEvent[] = [];

      // Check if streaming is supported
      if (!client.supportsStreaming()) {
        console.log("⚠️  Skipping test - streaming not supported");
        return;
      }

      await client.streamAgent(
        `Process a batch of 3 items:
         1. ID: "US-123456", priority: 5, tags: ["urgent", "customer-request"], value: 99.99
         2. ID: "UK-789012", priority: 3, tags: ["standard"], value: 50.00
         3. ID: "CA-345678", priority: 8, tags: ["high-value", "premium", "vip"], value: 750.50
         
         Use parallel processing with a batch size of 2.`,
        (event: AgentStreamEvent) => {
          events.push(event);
          if (event.type === "conversation_started") {
            createdConversations.push(event.conversationId);
          } else if (event.type === "tool_update") {
            console.log(`🔧 Tool ${event.toolCall.name}: ${event.status}`);
          }
        },
        undefined,
        { id: specId },
        [batchProcessorTool],
        { batchProcessor: toolHandler },
      );

      const toolEvents = events.filter((e) => e.type === "tool_update");
      expect(toolEvents.length).toBeGreaterThan(0);
      console.log("✅ Complex array schemas handled successfully");
    }, 90000);
  });

  describe("String Pattern and Format Validation", () => {
    it("should handle complex string patterns and formats", async () => {
      console.log("\n🔤 Testing string pattern and format validation...");

      // Create specification
      const createResponse = await client.createSpecification({
        name: "String Validation Test",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4O_128K,
          temperature: 0.3,
          completionTokenLimit: 600,
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      // MCP-style validation tool with various string formats
      const validationTool: Types.ToolDefinitionInput = {
        name: "validator",
        description: "Validate various data formats and patterns",
        schema: JSON.stringify({
          type: "object",
          properties: {
            email: {
              type: "string",
              format: "email",
              pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
            },
            phone: {
              type: "string",
              pattern: "^\\+?[1-9]\\d{1,14}$",
              description: "E.164 format phone number",
            },
            ipAddress: {
              oneOf: [
                {
                  type: "string",
                  format: "ipv4",
                  pattern:
                    "^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$",
                },
                {
                  type: "string",
                  format: "ipv6",
                  pattern:
                    "^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$",
                },
              ],
            },
            url: {
              type: "string",
              format: "uri",
              pattern:
                "^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$",
            },
            uuid: {
              type: "string",
              format: "uuid",
              pattern:
                "^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$",
            },
            creditCard: {
              type: "string",
              pattern:
                "^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\\d{3})\\d{11})$",
              description: "Major credit card formats",
            },
            postalCode: {
              type: "object",
              properties: {
                country: {
                  type: "string",
                  enum: ["US", "UK", "CA", "DE", "JP"],
                },
                code: {
                  type: "string",
                },
              },
              required: ["country", "code"],
              allOf: [
                {
                  if: {
                    properties: { country: { const: "US" } },
                  },
                  then: {
                    properties: {
                      code: { pattern: "^\\d{5}(-\\d{4})?$" },
                    },
                  },
                },
                {
                  if: {
                    properties: { country: { const: "UK" } },
                  },
                  then: {
                    properties: {
                      code: {
                        pattern: "^[A-Z]{1,2}\\d[A-Z\\d]? ?\\d[A-Z]{2}$",
                      },
                    },
                  },
                },
                {
                  if: {
                    properties: { country: { const: "CA" } },
                  },
                  then: {
                    properties: {
                      code: { pattern: "^[A-Z]\\d[A-Z] ?\\d[A-Z]\\d$" },
                    },
                  },
                },
              ],
            },
            customId: {
              type: "string",
              minLength: 10,
              maxLength: 20,
              pattern: "^[A-Z]{3}-\\d{4}-[a-z]{3,10}$",
              description: "Custom ID format: XXX-0000-xxxxx",
            },
          },
          required: ["email"],
          additionalProperties: false,
        }),
      };

      const toolHandler = async (args: {
        email: string;
        phone?: string;
        ipAddress?: string;
        url?: string;
        uuid?: string;
        creditCard?: string;
        postalCode?: {
          country: string;
          code: string;
        };
        customId?: string;
      }) => {
        console.log("✅ Validation input:", JSON.stringify(args, null, 2));

        const results: {
          valid: Array<{ field: string; value: unknown; message: string }>;
          invalid: Array<{ field: string; value: unknown; message: string }>;
        } = {
          valid: [],
          invalid: [],
        };

        // Validate each provided field
        Object.entries(args).forEach(([field, value]) => {
          results.valid.push({
            field,
            value,
            message: `${field} is valid`,
          });
        });

        return {
          summary: `Validated ${Object.keys(args).length} fields`,
          results,
        };
      };

      const events: AgentStreamEvent[] = [];

      // Check if streaming is supported
      if (!client.supportsStreaming()) {
        console.log("⚠️  Skipping test - streaming not supported");
        return;
      }

      await client.streamAgent(
        `Please validate the following data:
         - Email: john.doe@example.com
         - Phone: +14155552671
         - IP Address: 192.168.1.1
         - URL: https://www.example.com/path/to/page
         - UUID: 550e8400-e29b-41d4-a716-446655440000
         - US Postal Code: 94105-1234
         - Custom ID: ABC-1234-testing`,
        (event: AgentStreamEvent) => {
          events.push(event);
          if (event.type === "conversation_started") {
            createdConversations.push(event.conversationId);
          } else if (event.type === "tool_update") {
            console.log(`🔧 Tool ${event.toolCall.name}: ${event.status}`);
          }
        },
        undefined,
        { id: specId },
        [validationTool],
        { validator: toolHandler },
      );

      const toolEvents = events.filter((e) => e.type === "tool_update");
      expect(toolEvents.length).toBeGreaterThan(0);
      console.log(
        "✅ String pattern and format validation handled successfully",
      );
    }, 90000);
  });

  describe("Conditional Schemas (if/then/else)", () => {
    it("should handle conditional schema validation", async () => {
      console.log("\n🎯 Testing conditional schema validation...");

      // Create specification
      const createResponse = await client.createSpecification({
        name: "Conditional Schema Test",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4O_128K,
          temperature: 0.3,
          completionTokenLimit: 700,
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      // MCP-style payment processing - simplified for OpenAI compatibility
      const paymentTool: Types.ToolDefinitionInput = {
        name: "payment",
        description:
          "Process payments with method-specific validation. Details object should contain method-specific fields: credit_card needs cardNumber, expiryMonth, expiryYear, cvv, billingAddress; bank_transfer needs accountType, routingNumber, accountNumber, bankName; crypto needs cryptocurrency, walletAddress, network; paypal needs email or phoneNumber",
        schema: JSON.stringify({
          type: "object",
          properties: {
            amount: {
              type: "number",
              minimum: 0.01,
              multipleOf: 0.01,
            },
            currency: {
              type: "string",
              enum: ["USD", "EUR", "GBP", "JPY"],
            },
            method: {
              type: "string",
              enum: ["credit_card", "bank_transfer", "crypto", "paypal"],
            },
            details: {
              type: "object",
              description: "Method-specific payment details",
              properties: {
                // Credit card fields
                cardNumber: { type: "string", pattern: "^[0-9]{13,19}$" },
                expiryMonth: { type: "integer", minimum: 1, maximum: 12 },
                expiryYear: { type: "integer", minimum: 2024, maximum: 2050 },
                cvv: { type: "string", pattern: "^[0-9]{3,4}$" },
                billingAddress: {
                  type: "object",
                  properties: {
                    street: { type: "string" },
                    city: { type: "string" },
                    state: { type: "string" },
                    country: { type: "string" },
                    postalCode: { type: "string" },
                  },
                },
                // Bank transfer fields
                accountType: { type: "string", enum: ["checking", "savings"] },
                routingNumber: { type: "string", pattern: "^[0-9]{9}$" },
                accountNumber: { type: "string", pattern: "^[0-9]{4,17}$" },
                bankName: { type: "string" },
                swift: {
                  type: "string",
                  pattern: "^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$",
                },
                // Crypto fields
                cryptocurrency: {
                  type: "string",
                  enum: ["BTC", "ETH", "USDT", "USDC"],
                },
                walletAddress: { type: "string", minLength: 26, maxLength: 62 },
                network: {
                  type: "string",
                  enum: ["mainnet", "testnet", "polygon", "bsc"],
                },
                // PayPal fields
                email: { type: "string", format: "email" },
                phoneNumber: {
                  type: "string",
                  pattern: "^\\+?[1-9]\\d{1,14}$",
                },
              },
              additionalProperties: false,
            },
          },
          required: ["amount", "currency", "method", "details"],
          additionalProperties: false,
        }),
      };

      const toolHandler = async (args: {
        amount: number;
        currency: string;
        method: string;
        details: {
          cardNumber?: string;
          expiryMonth?: number;
          expiryYear?: number;
          cvv?: string;
          billingAddress?: {
            street: string;
            city: string;
            state: string;
            country: string;
            postalCode: string;
          };
          accountType?: string;
          routingNumber?: string;
          accountNumber?: string;
          bankName?: string;
          swift?: string;
          cryptocurrency?: string;
          walletAddress?: string;
          network?: string;
          email?: string;
          phoneNumber?: string;
        };
      }) => {
        console.log("💳 Payment processing:", JSON.stringify(args, null, 2));

        // Validate method-specific details were provided
        expect(args.method).toBeDefined();
        expect(args.details).toBeDefined();

        // Method-specific validation
        switch (args.method) {
          case "credit_card":
            expect(args.details).toHaveProperty("cardNumber");
            expect(args.details).toHaveProperty("billingAddress");
            break;
          case "bank_transfer":
            expect(args.details).toHaveProperty("routingNumber");
            expect(args.details).toHaveProperty("accountNumber");
            break;
          case "crypto":
            expect(args.details).toHaveProperty("cryptocurrency");
            expect(args.details).toHaveProperty("walletAddress");
            break;
          case "paypal":
            expect(args.details.email || args.details.phoneNumber).toBeTruthy();
            break;
        }

        return {
          transactionId: `TXN-${Date.now()}`,
          status: "approved",
          amount: args.amount,
          currency: args.currency,
          method: args.method,
          timestamp: new Date().toISOString(),
        };
      };

      const events: AgentStreamEvent[] = [];

      // Check if streaming is supported
      if (!client.supportsStreaming()) {
        console.log("⚠️  Skipping test - streaming not supported");
        return;
      }

      await client.streamAgent(
        `Process two payments:
         1. Credit card payment of $150.00 USD with card number 4532015112830366, expiry month 12, expiry year 2025, CVV 123, billing address: street "123 Main St", city "San Francisco", state "CA", country "USA", postalCode "94105"
         2. Crypto payment of 0.005 BTC to wallet address 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa on mainnet network`,
        (event: AgentStreamEvent) => {
          events.push(event);
          if (event.type === "conversation_started") {
            createdConversations.push(event.conversationId);
          } else if (event.type === "tool_update") {
            console.log(`🔧 Tool ${event.toolCall.name}: ${event.status}`);
          }
        },
        undefined,
        { id: specId },
        [paymentTool],
        { payment: toolHandler },
      );

      const toolEvents = events.filter((e) => e.type === "tool_update");
      expect(toolEvents.length).toBeGreaterThan(0);
      console.log("✅ Conditional schema validation handled successfully");
    }, 90000);
  });

  describe("Recursive Schemas", () => {
    it("should handle recursive schema definitions", async () => {
      console.log("\n🔄 Testing recursive schema definitions...");

      // Create specification
      const createResponse = await client.createSpecification({
        name: "Recursive Schema Test",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4O_128K,
          temperature: 0.3,
          completionTokenLimit: 600,
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      // MCP-style file tree or nested comment system
      const treeTool: Types.ToolDefinitionInput = {
        name: "tree",
        description: "Build or process hierarchical tree structures",
        schema: JSON.stringify({
          type: "object",
          properties: {
            operation: {
              type: "string",
              enum: ["create", "search", "analyze", "modify"],
            },
            tree: {
              $ref: "#/definitions/node",
            },
          },
          required: ["operation", "tree"],
          definitions: {
            node: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                type: {
                  type: "string",
                  enum: ["folder", "file", "link", "special"],
                },
                metadata: {
                  type: "object",
                  properties: {
                    size: { type: "integer", minimum: 0 },
                    created: { type: "string", format: "date-time" },
                    modified: { type: "string", format: "date-time" },
                    permissions: { type: "string" },
                    owner: { type: "string" },
                    tags: {
                      type: "array",
                      items: { type: "string" },
                    },
                  },
                },
                children: {
                  type: "array",
                  items: { $ref: "#/definitions/node" },
                },
              },
              required: ["id", "name", "type"],
            },
          },
        }),
      };

      const toolHandler = async (args: {
        operation: string;
        tree: TreeNode;
      }) => {
        console.log("🌳 Tree operation:", JSON.stringify(args, null, 2));

        // Validate recursive structure
        expect(args.tree).toHaveProperty("id");
        expect(args.tree).toHaveProperty("name");
        expect(args.tree).toHaveProperty("type");

        // Count nodes recursively
        const countNodes = (node: TreeNode): number => {
          let count = 1;
          if (node.children && Array.isArray(node.children)) {
            for (const child of node.children) {
              count += countNodes(child);
            }
          }
          return count;
        };

        const totalNodes = countNodes(args.tree);

        return {
          operation: args.operation,
          result: "success",
          statistics: {
            totalNodes,
            rootNode: args.tree.name,
            depth: calculateDepth(args.tree),
          },
        };

        function calculateDepth(node: TreeNode): number {
          if (!node.children || node.children.length === 0) return 1;
          return 1 + Math.max(...node.children.map(calculateDepth));
        }
      };

      const events: AgentStreamEvent[] = [];

      // Check if streaming is supported
      if (!client.supportsStreaming()) {
        console.log("⚠️  Skipping test - streaming not supported");
        return;
      }

      await client.streamAgent(
        `Create a file system tree structure:
         - Root folder "project" containing:
           - Folder "src" with files "main.ts" and "utils.ts"
           - Folder "tests" with file "main.test.ts"
           - File "README.md"
           - File "package.json"`,
        (event: AgentStreamEvent) => {
          events.push(event);
          if (event.type === "conversation_started") {
            createdConversations.push(event.conversationId);
          } else if (event.type === "tool_update") {
            console.log(`🔧 Tool ${event.toolCall.name}: ${event.status}`);
          }
        },
        undefined,
        { id: specId },
        [treeTool],
        { tree: toolHandler },
      );

      const toolEvents = events.filter((e) => e.type === "tool_update");
      expect(toolEvents.length).toBeGreaterThan(0);
      console.log("✅ Recursive schema definitions handled successfully");
    }, 90000);
  });
});

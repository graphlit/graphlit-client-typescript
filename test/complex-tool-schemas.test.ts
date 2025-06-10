import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Graphlit } from "../src/client";
import * as Types from "../src/generated/graphql-types";
import { AgentStreamEvent } from "../src/types/ui-events";

/**
 * Complex tool schema test suite
 * Tests advanced JSON Schema features that MCP tools might use
 */
describe("Complex Tool Schemas", () => {
  const orgId = process.env.GRAPHLIT_ORGANIZATION_ID;
  const envId = process.env.GRAPHLIT_ENVIRONMENT_ID;
  const secret = process.env.GRAPHLIT_JWT_SECRET;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!orgId || !envId || !secret) {
    console.warn(
      "⚠️  Skipping complex schema tests - missing Graphlit credentials"
    );
    return;
  }

  let client: Graphlit;
  const createdSpecifications: string[] = [];
  const createdConversations: string[] = [];

  beforeAll(async () => {
    client = new Graphlit(orgId, envId, secret);

    // Set up conditional streaming - use native if available, fallback otherwise
    if (openaiKey) {
      try {
        const { default: OpenAI } = await import("openai");
        const openaiClient = new OpenAI({ apiKey: openaiKey });
      } catch (e) {}
    } else {
    }
  });

  afterAll(async () => {
    // Clean up
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
  }, 90000);

  describe("Nested Object Schemas", () => {
    it("should handle deeply nested object structures", async () => {
      console.log("🏗️ Testing deeply nested object schemas...");

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

      // Complex nested schema like an MCP file system tool
      const fileSystemTool: Types.ToolDefinitionInput = {
        name: "fileSystem",
        description: "Interact with a virtual file system",
        schema: JSON.stringify({
          type: "object",
          properties: {
            operation: {
              type: "string",
              enum: ["read", "write", "delete", "move", "copy", "mkdir", "ls"],
              description: "The file system operation to perform",
            },
            path: {
              type: "string",
              pattern: "^(/[^/]+)+/?$|^/$",
              description: "Absolute path starting with /",
            },
            options: {
              type: "object",
              properties: {
                recursive: {
                  type: "boolean",
                  default: false,
                  description: "Apply operation recursively",
                },
                force: {
                  type: "boolean",
                  default: false,
                  description: "Force operation without confirmation",
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
                  additionalProperties: false,
                },
                encoding: {
                  type: "string",
                  enum: ["utf8", "utf16", "ascii", "base64"],
                  default: "utf8",
                },
              },
              additionalProperties: false,
            },
            content: {
              type: "string",
              description: "Content for write operations",
            },
            destination: {
              type: "string",
              pattern: "^(/[^/]+)+/?$|^/$",
              description: "Destination path for move/copy operations",
            },
          },
          required: ["operation", "path"],
          additionalProperties: false,
          // Conditional requirements based on operation
          if: {
            properties: { operation: { const: "write" } },
          },
          then: {
            required: ["content"],
          },
          else: {
            if: {
              properties: { operation: { enum: ["move", "copy"] } },
            },
            then: {
              required: ["destination"],
            },
          },
        }),
      };

      const toolCalls: any[] = [];
      const fileSystemHandler = async (args: any) => {
        console.log(`📁 File system operation:`, JSON.stringify(args, null, 2));
        toolCalls.push(args);

        // Simulate file system response
        switch (args.operation) {
          case "ls":
            return {
              path: args.path,
              entries: [
                { name: "file1.txt", type: "file", size: 1024 },
                { name: "dir1", type: "directory", size: 0 },
                { name: "file2.json", type: "file", size: 2048 },
              ],
            };
          case "read":
            return {
              path: args.path,
              content: "Sample file content",
              encoding: args.options?.encoding || "utf8",
            };
          case "write":
            return {
              path: args.path,
              written: args.content.length,
              success: true,
            };
          case "mkdir":
            return {
              path: args.path,
              created: true,
              permissions: args.options?.permissions,
            };
          default:
            return { operation: args.operation, success: true };
        }
      };

      // Check if streaming is supported
      if (!client.supportsStreaming()) {
        console.log("⚠️  Skipping test - streaming not supported");
        return;
      }

      await client.streamAgent(
        `Please help me organize my files:
1. List the contents of /home/user/documents
2. Create a new directory /home/user/documents/archive with full permissions for owner only
3. Write a README.md file in /home/user/documents with content "# My Documents\nOrganized files"
4. Move any .txt files to the archive directory`,
        (event: AgentStreamEvent) => {
          if (event.type === "conversation_started") {
            createdConversations.push(event.conversationId);
          } else if (event.type === "tool_update") {
            console.log(`🔧 Tool ${event.toolCall.name}: ${event.status}`);
          }
        },
        undefined,
        { id: specId },
        [fileSystemTool],
        { fileSystem: fileSystemHandler }
      );

      // Validate complex nested calls
      expect(toolCalls.length).toBeGreaterThan(0);

      // Check for different operation types
      const operations = toolCalls.map((call) => call.operation);
      console.log(`\n📊 Operations performed: ${operations.join(", ")}`);

      // Check for nested options usage
      const withOptions = toolCalls.filter((call) => call.options);
      console.log(
        `📊 Calls with options: ${withOptions.length}/${toolCalls.length}`
      );

      console.log("✅ Nested object schema test completed");
    }, 90000);
  });

  describe("Array and Union Type Schemas", () => {
    it("should handle complex array schemas with constraints", async () => {
      console.log("\n📚 Testing complex array schemas...");

      // Create specification
      const createResponse = await client.createSpecification({
        name: "Array Schema Test",
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

      // Database query tool with complex array handling
      const databaseTool: Types.ToolDefinitionInput = {
        name: "database",
        description: "Execute database operations with complex filters",
        schema: JSON.stringify({
          type: "object",
          properties: {
            operation: {
              type: "string",
              enum: ["query", "insert", "update", "delete", "aggregate"],
            },
            table: {
              type: "string",
              pattern: "^[a-zA-Z_][a-zA-Z0-9_]*$",
            },
            // Complex array of conditions
            conditions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string" },
                  operator: {
                    type: "string",
                    enum: [
                      "=",
                      "!=",
                      ">",
                      "<",
                      ">=",
                      "<=",
                      "IN",
                      "NOT IN",
                      "LIKE",
                      "BETWEEN",
                    ],
                  },
                  value: {
                    oneOf: [
                      { type: "string" },
                      { type: "number" },
                      { type: "boolean" },
                      { type: "null" },
                      {
                        type: "array",
                        items: {
                          oneOf: [{ type: "string" }, { type: "number" }],
                        },
                      },
                    ],
                  },
                  // For BETWEEN operator
                  value2: {
                    oneOf: [{ type: "string" }, { type: "number" }],
                  },
                },
                required: ["field", "operator", "value"],
                if: {
                  properties: { operator: { const: "BETWEEN" } },
                },
                then: {
                  required: ["value2"],
                },
              },
              minItems: 0,
              maxItems: 10,
            },
            // Fields to select/update with mixed types
            fields: {
              type: "array",
              items: {
                oneOf: [
                  { type: "string" }, // Simple field name
                  {
                    // Field with alias
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      alias: { type: "string" },
                    },
                    required: ["name"],
                  },
                  {
                    // Aggregate function
                    type: "object",
                    properties: {
                      function: {
                        type: "string",
                        enum: ["COUNT", "SUM", "AVG", "MIN", "MAX"],
                      },
                      field: { type: "string" },
                      alias: { type: "string" },
                    },
                    required: ["function", "field"],
                  },
                ],
              },
              uniqueItems: true,
            },
            // Sorting with array validation
            orderBy: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string" },
                  direction: { type: "string", enum: ["ASC", "DESC"] },
                },
                required: ["field", "direction"],
                additionalProperties: false,
              },
            },
            limit: {
              type: "integer",
              minimum: 1,
              maximum: 1000,
            },
            offset: {
              type: "integer",
              minimum: 0,
            },
          },
          required: ["operation", "table"],
          additionalProperties: false,
        }),
      };

      const dbCalls: any[] = [];
      const databaseHandler = async (args: any) => {
        console.log(`🗄️ Database operation:`, JSON.stringify(args, null, 2));
        dbCalls.push(args);

        return {
          operation: args.operation,
          table: args.table,
          rowsAffected: Math.floor(Math.random() * 100),
          results:
            args.operation === "query"
              ? [
                  { id: 1, name: "Item 1", value: 100 },
                  { id: 2, name: "Item 2", value: 200 },
                ]
              : undefined,
        };
      };

      // Check if streaming is supported
      if (!client.supportsStreaming()) {
        console.log("⚠️  Skipping test - streaming not supported");
        return;
      }

      await client.streamAgent(
        `I need to query our user database:
1. Find all active users (status = 'active') with age between 25 and 40
2. Select their id, name, email, and calculate the average of their scores
3. Order by registration date descending, limit to 50 results
4. Also count the total number of users grouped by country`,
        (event: AgentStreamEvent) => {
          if (event.type === "conversation_started") {
            createdConversations.push(event.conversationId);
          } else if (event.type === "tool_update") {
            console.log(`🔧 Database tool: ${event.status}`);
          }
        },
        undefined,
        { id: specId },
        [databaseTool],
        { database: databaseHandler }
      );

      // Validate complex array handling
      expect(dbCalls.length).toBeGreaterThan(0);

      // Check for complex conditions
      const withConditions = dbCalls.filter(
        (call) => call.conditions && call.conditions.length > 0
      );
      console.log(`\n📊 Calls with conditions: ${withConditions.length}`);

      if (withConditions.length > 0) {
        const firstConditions = withConditions[0].conditions;
        console.log(
          `📊 First query conditions:`,
          JSON.stringify(firstConditions, null, 2)
        );
      }

      console.log("✅ Complex array schema test completed");
    }, 90000);
  });

  describe("Polymorphic and Dynamic Schemas", () => {
    it("should handle anyOf/oneOf schemas with discriminators", async () => {
      console.log("\n🔀 Testing polymorphic schemas...");

      // Create specification
      const createResponse = await client.createSpecification({
        name: "Polymorphic Schema Test",
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

      // Notification tool with polymorphic content types
      const notificationTool: Types.ToolDefinitionInput = {
        name: "notification",
        description: "Send notifications through various channels",
        schema: JSON.stringify({
          type: "object",
          properties: {
            recipient: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: ["user", "group", "channel", "webhook"],
                },
                // Polymorphic recipient data based on type
                data: {
                  oneOf: [
                    {
                      // User recipient
                      type: "object",
                      properties: {
                        userId: { type: "string", format: "uuid" },
                        preferredChannel: {
                          type: "string",
                          enum: ["email", "sms", "push", "in-app"],
                        },
                      },
                      required: ["userId"],
                    },
                    {
                      // Group recipient
                      type: "object",
                      properties: {
                        groupId: { type: "string", format: "uuid" },
                        excludeUsers: {
                          type: "array",
                          items: { type: "string", format: "uuid" },
                        },
                      },
                      required: ["groupId"],
                    },
                    {
                      // Channel recipient
                      type: "object",
                      properties: {
                        channelName: { type: "string" },
                        platform: {
                          type: "string",
                          enum: ["slack", "discord", "teams", "telegram"],
                        },
                      },
                      required: ["channelName", "platform"],
                    },
                    {
                      // Webhook recipient
                      type: "object",
                      properties: {
                        url: { type: "string", format: "uri" },
                        headers: {
                          type: "object",
                          additionalProperties: { type: "string" },
                        },
                        retryPolicy: {
                          type: "object",
                          properties: {
                            maxRetries: {
                              type: "integer",
                              minimum: 0,
                              maximum: 5,
                            },
                            backoffMultiplier: {
                              type: "number",
                              minimum: 1,
                              maximum: 10,
                            },
                          },
                        },
                      },
                      required: ["url"],
                    },
                  ],
                },
              },
              required: ["type", "data"],
            },
            message: {
              type: "object",
              properties: {
                format: {
                  type: "string",
                  enum: ["text", "markdown", "html", "template", "card"],
                },
                content: {
                  anyOf: [
                    {
                      // Simple text
                      type: "string",
                      minLength: 1,
                      maxLength: 5000,
                    },
                    {
                      // Template with variables
                      type: "object",
                      properties: {
                        templateId: { type: "string" },
                        variables: {
                          type: "object",
                          additionalProperties: true,
                        },
                      },
                      required: ["templateId"],
                    },
                    {
                      // Rich card
                      type: "object",
                      properties: {
                        title: { type: "string", maxLength: 100 },
                        body: { type: "string", maxLength: 1000 },
                        image: { type: "string", format: "uri" },
                        actions: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              type: {
                                type: "string",
                                enum: ["button", "link"],
                              },
                              label: { type: "string" },
                              value: { type: "string" },
                            },
                            required: ["type", "label", "value"],
                          },
                          maxItems: 5,
                        },
                      },
                      required: ["title"],
                    },
                  ],
                },
                priority: {
                  type: "string",
                  enum: ["low", "normal", "high", "urgent"],
                  default: "normal",
                },
                metadata: {
                  type: "object",
                  properties: {
                    category: { type: "string" },
                    tags: {
                      type: "array",
                      items: { type: "string" },
                      uniqueItems: true,
                    },
                    expiresAt: { type: "string", format: "date-time" },
                    deduplicationKey: { type: "string" },
                  },
                  additionalProperties: true,
                },
              },
              required: ["format", "content"],
            },
            scheduling: {
              type: "object",
              oneOf: [
                {
                  // Send immediately
                  properties: {
                    type: { const: "immediate" },
                  },
                  required: ["type"],
                },
                {
                  // Schedule for later
                  properties: {
                    type: { const: "scheduled" },
                    sendAt: { type: "string", format: "date-time" },
                  },
                  required: ["type", "sendAt"],
                },
                {
                  // Recurring schedule
                  properties: {
                    type: { const: "recurring" },
                    cron: { type: "string" },
                    timezone: { type: "string" },
                    endDate: { type: "string", format: "date-time" },
                  },
                  required: ["type", "cron"],
                },
              ],
            },
          },
          required: ["recipient", "message"],
          additionalProperties: false,
        }),
      };

      const notificationCalls: any[] = [];
      const notificationHandler = async (args: any) => {
        console.log(`📬 Notification:`, JSON.stringify(args, null, 2));
        notificationCalls.push(args);

        return {
          notificationId: `notif-${Date.now()}`,
          recipient: args.recipient.type,
          status: "queued",
          estimatedDelivery: new Date(Date.now() + 60000).toISOString(),
        };
      };

      // Check if streaming is supported
      if (!client.supportsStreaming()) {
        console.log("⚠️  Skipping test - streaming not supported");
        return;
      }

      await client.streamAgent(
        `Please send the following notifications:
1. Send an urgent email to user 123e4567-e89b-12d3-a456-426614174000 about system maintenance
2. Post a message to the #announcements Slack channel with a card format including title "Scheduled Maintenance" and two action buttons
3. Schedule a recurring reminder every Monday at 9 AM to the engineering group (group-456) excluding user-789`,
        (event: AgentStreamEvent) => {
          if (event.type === "conversation_started") {
            createdConversations.push(event.conversationId);
          } else if (event.type === "tool_update") {
            console.log(`🔧 Notification tool: ${event.status}`);
          }
        },
        undefined,
        { id: specId },
        [notificationTool],
        { notification: notificationHandler }
      );

      // Validate polymorphic handling
      expect(notificationCalls.length).toBeGreaterThan(0);

      // Check recipient types
      const recipientTypes = notificationCalls.map(
        (call) => call.recipient?.type
      );
      console.log(`\n📊 Recipient types: ${recipientTypes.join(", ")}`);

      // Check message formats
      const messageFormats = notificationCalls.map(
        (call) => call.message?.format
      );
      console.log(`📊 Message formats: ${messageFormats.join(", ")}`);

      console.log("✅ Polymorphic schema test completed");
    }, 90000);
  });

  describe("Validation Constraints and Patterns", () => {
    it("should handle complex validation rules", async () => {
      console.log("\n✅ Testing complex validation constraints...");

      // Create specification
      const createResponse = await client.createSpecification({
        name: "Validation Test",
        type: Types.SpecificationTypes.Completion,
        serviceType: Types.ModelServiceTypes.OpenAi,
        openAI: {
          model: Types.OpenAiModels.Gpt4O_128K,
          temperature: 0.3,
          completionTokenLimit: 500,
        },
      });

      const specId = createResponse.createSpecification?.id!;
      createdSpecifications.push(specId);

      // Configuration management tool with extensive validation
      const configTool: Types.ToolDefinitionInput = {
        name: "configuration",
        description: "Manage application configuration with validation",
        schema: JSON.stringify({
          type: "object",
          properties: {
            action: {
              type: "string",
              enum: ["get", "set", "validate", "reset"],
            },
            namespace: {
              type: "string",
              pattern: "^[a-z][a-z0-9]*(?:\\.[a-z][a-z0-9]*)*$",
              description:
                "Dot-separated namespace (e.g., 'app.database.primary')",
            },
            config: {
              type: "object",
              properties: {
                // String validations
                appName: {
                  type: "string",
                  minLength: 3,
                  maxLength: 50,
                  pattern: "^[A-Za-z][A-Za-z0-9 -]*$",
                },
                // Number validations
                port: {
                  type: "integer",
                  minimum: 1024,
                  maximum: 65535,
                  multipleOf: 1,
                },
                // String with format validations
                apiUrl: {
                  type: "string",
                  format: "uri",
                  pattern: "^https?://",
                },
                email: {
                  type: "string",
                  format: "email",
                },
                // Complex string patterns
                version: {
                  type: "string",
                  pattern:
                    "^\\d+\\.\\d+\\.\\d+(?:-[a-zA-Z0-9]+(?:\\.[a-zA-Z0-9]+)*)?$",
                  description:
                    "Semantic version (e.g., '1.2.3' or '1.2.3-beta.1')",
                },
                // Array with constraints
                allowedOrigins: {
                  type: "array",
                  items: {
                    type: "string",
                    format: "uri",
                  },
                  minItems: 1,
                  maxItems: 10,
                  uniqueItems: true,
                },
                // Object with property constraints
                rateLimits: {
                  type: "object",
                  properties: {
                    global: {
                      type: "object",
                      properties: {
                        requests: {
                          type: "integer",
                          minimum: 1,
                          maximum: 10000,
                        },
                        window: { type: "integer", minimum: 1, maximum: 3600 },
                      },
                      required: ["requests", "window"],
                    },
                    perUser: {
                      type: "object",
                      properties: {
                        requests: {
                          type: "integer",
                          minimum: 1,
                          maximum: 1000,
                        },
                        window: { type: "integer", minimum: 1, maximum: 3600 },
                      },
                      required: ["requests", "window"],
                    },
                  },
                  additionalProperties: false,
                },
                // Dependent schemas
                authentication: {
                  type: "object",
                  properties: {
                    type: {
                      type: "string",
                      enum: ["none", "basic", "oauth", "jwt"],
                    },
                  },
                  required: ["type"],
                  allOf: [
                    {
                      if: {
                        properties: { type: { const: "basic" } },
                      },
                      then: {
                        properties: {
                          realm: { type: "string", minLength: 1 },
                        },
                        required: ["realm"],
                      },
                    },
                    {
                      if: {
                        properties: { type: { const: "oauth" } },
                      },
                      then: {
                        properties: {
                          clientId: { type: "string", minLength: 10 },
                          clientSecret: { type: "string", minLength: 20 },
                          scopes: {
                            type: "array",
                            items: { type: "string" },
                            minItems: 1,
                          },
                        },
                        required: ["clientId", "clientSecret", "scopes"],
                      },
                    },
                    {
                      if: {
                        properties: { type: { const: "jwt" } },
                      },
                      then: {
                        properties: {
                          issuer: { type: "string", format: "uri" },
                          audience: { type: "string", minLength: 1 },
                          algorithm: {
                            type: "string",
                            enum: [
                              "RS256",
                              "RS384",
                              "RS512",
                              "HS256",
                              "HS384",
                              "HS512",
                            ],
                          },
                        },
                        required: ["issuer", "audience", "algorithm"],
                      },
                    },
                  ],
                },
                // Numeric constraints with relationships
                performance: {
                  type: "object",
                  properties: {
                    minWorkers: { type: "integer", minimum: 1 },
                    maxWorkers: { type: "integer", maximum: 100 },
                    targetCpu: { type: "number", minimum: 0.1, maximum: 0.95 },
                    memoryLimit: {
                      type: "integer",
                      minimum: 134217728, // 128MB
                      maximum: 8589934592, // 8GB
                      multipleOf: 1048576, // 1MB increments
                    },
                  },
                  // Cross-field validation
                  dependencies: {
                    minWorkers: ["maxWorkers"],
                  },
                },
              },
              additionalProperties: false,
            },
          },
          required: ["action", "namespace"],
          if: {
            properties: { action: { const: "set" } },
          },
          then: {
            required: ["config"],
          },
        }),
      };

      const configCalls: any[] = [];
      const configHandler = async (args: any) => {
        console.log(`⚙️ Configuration:`, JSON.stringify(args, null, 2));
        configCalls.push(args);

        return {
          action: args.action,
          namespace: args.namespace,
          success: true,
          validation:
            args.action === "validate"
              ? {
                  valid: true,
                  errors: [],
                }
              : undefined,
        };
      };

      // Check if streaming is supported
      if (!client.supportsStreaming()) {
        console.log("⚠️  Skipping test - streaming not supported");
        return;
      }

      await client.streamAgent(
        `Please help me configure the application:
1. Set the app.server configuration with:
   - appName: "My Awesome App"
   - port: 8080
   - apiUrl: "https://api.example.com"
   - version: "2.1.0-beta.1"
2. Configure authentication for OAuth with clientId "abc123def456" and scopes ["read", "write"]
3. Set rate limits with 1000 requests per 60 seconds globally and 100 per user
4. Configure performance with min 2 workers, max 10 workers, and 4GB memory limit`,
        (event: AgentStreamEvent) => {
          if (event.type === "conversation_started") {
            createdConversations.push(event.conversationId);
          } else if (event.type === "tool_update") {
            console.log(`🔧 Config tool: ${event.status}`);
          }
        },
        undefined,
        { id: specId },
        [configTool],
        { configuration: configHandler }
      );

      // Validate constraint handling
      expect(configCalls.length).toBeGreaterThan(0);

      // Check config complexity
      const setActions = configCalls.filter((call) => call.action === "set");
      console.log(`\n📊 Set configuration calls: ${setActions.length}`);

      if (setActions.length > 0) {
        const firstConfig = setActions[0].config;
        if (firstConfig) {
          console.log(`📊 Config properties:`, Object.keys(firstConfig));
        }
      }

      console.log("✅ Validation constraints test completed");
    }, 90000);
  });

  describe("Dynamic Schema Generation", () => {
    it("should handle schemas with dynamic properties", async () => {
      console.log("\n🔄 Testing dynamic schema properties...");

      // Create specification
      const createResponse = await client.createSpecification({
        name: "Dynamic Schema Test",
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

      // API builder tool with dynamic schema capabilities
      const apiBuilderTool: Types.ToolDefinitionInput = {
        name: "apiBuilder",
        description: "Build and test APIs with dynamic schemas",
        schema: JSON.stringify({
          type: "object",
          properties: {
            action: {
              type: "string",
              enum: ["define", "call", "mock", "validate"],
            },
            endpoint: {
              type: "object",
              properties: {
                method: {
                  type: "string",
                  enum: ["GET", "POST", "PUT", "PATCH", "DELETE"],
                },
                path: {
                  type: "string",
                  pattern: "^/[a-zA-Z0-9/_-]*$",
                },
                // Dynamic path parameters
                pathParams: {
                  type: "object",
                  patternProperties: {
                    "^[a-zA-Z][a-zA-Z0-9_]*$": {
                      type: "object",
                      properties: {
                        type: {
                          type: "string",
                          enum: ["string", "integer", "uuid", "date"],
                        },
                        required: { type: "boolean", default: true },
                        pattern: { type: "string" },
                        example: { type: "string" },
                      },
                      required: ["type"],
                    },
                  },
                  additionalProperties: false,
                },
                // Dynamic query parameters
                queryParams: {
                  type: "object",
                  patternProperties: {
                    "^[a-zA-Z][a-zA-Z0-9_]*$": {
                      type: "object",
                      properties: {
                        type: {
                          type: "string",
                          enum: [
                            "string",
                            "integer",
                            "number",
                            "boolean",
                            "array",
                          ],
                        },
                        required: { type: "boolean", default: false },
                        default: {},
                        enum: { type: "array", items: {} },
                        minLength: { type: "integer" },
                        maxLength: { type: "integer" },
                        minimum: { type: "number" },
                        maximum: { type: "number" },
                      },
                      required: ["type"],
                    },
                  },
                  additionalProperties: false,
                },
                // Dynamic headers
                headers: {
                  type: "object",
                  patternProperties: {
                    "^[A-Za-z][A-Za-z0-9-]*$": {
                      oneOf: [
                        { type: "string" },
                        {
                          type: "object",
                          properties: {
                            value: { type: "string" },
                            required: { type: "boolean" },
                            pattern: { type: "string" },
                          },
                          required: ["value"],
                        },
                      ],
                    },
                  },
                },
                // Dynamic request body schema
                requestBody: {
                  type: "object",
                  properties: {
                    contentType: {
                      type: "string",
                      enum: [
                        "application/json",
                        "application/xml",
                        "multipart/form-data",
                        "application/x-www-form-urlencoded",
                      ],
                    },
                    schema: {
                      // Recursive schema definition
                      $ref: "#/definitions/jsonSchema",
                    },
                  },
                  required: ["contentType"],
                },
                // Dynamic response schemas by status code
                responses: {
                  type: "object",
                  patternProperties: {
                    "^[1-5][0-9][0-9]$": {
                      type: "object",
                      properties: {
                        description: { type: "string" },
                        schema: {
                          $ref: "#/definitions/jsonSchema",
                        },
                      },
                      required: ["description"],
                    },
                  },
                },
              },
              required: ["method", "path"],
            },
            // Test data for API calls
            testData: {
              type: "object",
              additionalProperties: true,
            },
          },
          required: ["action"],
          definitions: {
            jsonSchema: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: [
                    "string",
                    "number",
                    "integer",
                    "boolean",
                    "array",
                    "object",
                    "null",
                  ],
                },
                properties: {
                  type: "object",
                  additionalProperties: {
                    $ref: "#/definitions/jsonSchema",
                  },
                },
                items: {
                  $ref: "#/definitions/jsonSchema",
                },
                required: {
                  type: "array",
                  items: { type: "string" },
                },
                enum: {
                  type: "array",
                  items: {}, // Can be any type
                },
                minimum: { type: "number" },
                maximum: { type: "number" },
                minLength: { type: "integer" },
                maxLength: { type: "integer" },
              },
            },
          },
        }),
      };

      const apiCalls: any[] = [];
      const apiHandler = async (args: any) => {
        console.log(`🔌 API Builder:`, JSON.stringify(args, null, 2));
        apiCalls.push(args);

        return {
          action: args.action,
          success: true,
          apiDefinition:
            args.action === "define"
              ? {
                  endpoint: args.endpoint.path,
                  method: args.endpoint.method,
                  parameters:
                    Object.keys(args.endpoint.pathParams || {}).length +
                    Object.keys(args.endpoint.queryParams || {}).length,
                }
              : undefined,
        };
      };

      // Check if streaming is supported
      if (!client.supportsStreaming()) {
        console.log("⚠️  Skipping test - streaming not supported");
        return;
      }

      await client.streamAgent(
        `Please help me define a REST API:
1. Create a GET endpoint /api/v1/users/{userId} where userId is a UUID
2. Add query parameters: limit (integer, max 100), offset (integer), filter (string)
3. Add required header "X-API-Key" with pattern "^[A-Za-z0-9]{32}$"
4. Define 200 response with array of user objects (id, name, email, createdAt)
5. Define 404 response with error message`,
        (event: AgentStreamEvent) => {
          if (event.type === "conversation_started") {
            createdConversations.push(event.conversationId);
          } else if (event.type === "tool_update") {
            console.log(`🔧 API Builder: ${event.status}`);
          }
        },
        undefined,
        { id: specId },
        [apiBuilderTool],
        { apiBuilder: apiHandler }
      );

      // Validate dynamic schema handling
      expect(apiCalls.length).toBeGreaterThan(0);

      const defineActions = apiCalls.filter((call) => call.action === "define");
      console.log(`\n📊 API definitions created: ${defineActions.length}`);

      if (defineActions.length > 0) {
        const firstDef = defineActions[0];
        console.log(
          `📊 Endpoint: ${firstDef.endpoint?.method} ${firstDef.endpoint?.path}`
        );
        console.log(
          `📊 Path params:`,
          Object.keys(firstDef.endpoint?.pathParams || {})
        );
        console.log(
          `📊 Query params:`,
          Object.keys(firstDef.endpoint?.queryParams || {})
        );
        console.log(
          `📊 Response codes:`,
          Object.keys(firstDef.endpoint?.responses || {})
        );
      }

      console.log("✅ Dynamic schema test completed");
    }, 90000);
  });
});

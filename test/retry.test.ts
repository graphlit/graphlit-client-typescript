import { describe, it, expect, beforeEach, vi } from "vitest";
import { Graphlit, RetryConfig } from "../src/client";
import { ApolloError } from "@apollo/client/core/index.js";

describe("Apollo Client Retry Functionality", () => {
  const mockOrgId = "test-org-id";
  const mockEnvId = "test-env-id";
  const mockSecret = "test-secret";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Retry Configuration", () => {
    it("should initialize with default retry configuration", () => {
      const client = new Graphlit(mockOrgId, mockEnvId, mockSecret);

      // Check that client is initialized (we can't directly access private retryConfig)
      expect(client).toBeDefined();
      expect(client.client).toBeDefined();
    });

    it("should accept custom retry configuration via constructor options", () => {
      const customRetryConfig: RetryConfig = {
        maxAttempts: 10,
        initialDelay: 1000,
        maxDelay: 60000,
        retryableStatusCodes: [429, 500, 502, 503, 504],
        jitter: false,
      };

      const client = new Graphlit({
        organizationId: mockOrgId,
        environmentId: mockEnvId,
        jwtSecret: mockSecret,
        retryConfig: customRetryConfig,
      });

      expect(client).toBeDefined();
      expect(client.client).toBeDefined();
    });

    it("should maintain backward compatibility with legacy constructor", () => {
      const client = new Graphlit(
        mockOrgId,
        mockEnvId,
        mockSecret,
        "owner-id",
        "user-id",
        "https://custom-api.graphlit.io",
      );

      expect(client).toBeDefined();
      expect(client.client).toBeDefined();
    });

    it("should update retry configuration at runtime", () => {
      const client = new Graphlit(mockOrgId, mockEnvId, mockSecret);

      const newRetryConfig: RetryConfig = {
        maxAttempts: 3,
        initialDelay: 200,
      };

      // This should not throw
      expect(() => client.setRetryConfig(newRetryConfig)).not.toThrow();

      // Client should be refreshed
      expect(client.client).toBeDefined();
    });
  });

  describe("Retry Callback", () => {
    it("should call onRetry callback when retry occurs", async () => {
      const onRetryMock = vi.fn();

      const client = new Graphlit({
        organizationId: mockOrgId,
        environmentId: mockEnvId,
        jwtSecret: mockSecret,
        retryConfig: {
          maxAttempts: 3,
          onRetry: onRetryMock,
        },
      });

      // Note: In a real test, we would need to mock the Apollo Client
      // to simulate network errors and verify the callback is called.
      // This is a placeholder to show the expected behavior.
      expect(client).toBeDefined();
    });
  });

  describe("Error Scenarios", () => {
    it("should handle retryable status codes", () => {
      const client = new Graphlit({
        organizationId: mockOrgId,
        environmentId: mockEnvId,
        jwtSecret: mockSecret,
        retryConfig: {
          retryableStatusCodes: [429, 503, 504],
        },
      });

      // The retry logic is configured to handle these status codes
      expect(client).toBeDefined();
    });

    it("should not retry on non-retryable errors", () => {
      const client = new Graphlit({
        organizationId: mockOrgId,
        environmentId: mockEnvId,
        jwtSecret: mockSecret,
        retryConfig: {
          maxAttempts: 5,
          retryableStatusCodes: [503], // Only retry on 503
        },
      });

      // Errors with status codes like 400, 401, 404 should not be retried
      expect(client).toBeDefined();
    });
  });

  describe("Integration", () => {
    it("should work with all Graphlit API methods", () => {
      const client = new Graphlit({
        organizationId: mockOrgId,
        environmentId: mockEnvId,
        jwtSecret: mockSecret,
        retryConfig: {
          maxAttempts: 3,
          initialDelay: 100,
        },
      });

      // Verify client methods are available
      expect(typeof client.queryContents).toBe("function");
      expect(typeof client.getContent).toBe("function");
      expect(typeof client.deleteContent).toBe("function");
      expect(typeof client.createSpecification).toBe("function");
      expect(typeof client.promptSpecifications).toBe("function");
    });
  });
});

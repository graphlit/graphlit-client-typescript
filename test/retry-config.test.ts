import { describe, expect, it } from "vitest";

import {
  getErrorStatusCode,
  isRetryableGraphQLTransportError,
} from "../src/types/internal.js";

describe("GraphQL transport retry behavior", () => {
  it("retries raw Apollo ServerError 503 responses", () => {
    const error = {
      name: "ServerError",
      statusCode: 503,
      response: {
        status: 503,
      },
      result: "The service is unavailable.",
    };

    expect(getErrorStatusCode(error)).toBe(503);
    expect(isRetryableGraphQLTransportError(error)).toBe(true);
  });

  it("retries ApolloError networkError 503 responses", () => {
    const error = {
      networkError: {
        statusCode: 503,
        response: {
          status: 503,
        },
      },
    };

    expect(getErrorStatusCode(error)).toBe(503);
    expect(isRetryableGraphQLTransportError(error)).toBe(true);
  });

  it("does not retry plain GraphQL execution errors", () => {
    const error = {
      graphQLErrors: [{ message: "Validation failed" }],
    };

    expect(isRetryableGraphQLTransportError(error)).toBe(false);
  });

  it("extracts nested cause status codes", () => {
    const error = {
      cause: {
        response: {
          status: 504,
        },
      },
    };

    expect(getErrorStatusCode(error)).toBe(504);
    expect(isRetryableGraphQLTransportError(error)).toBe(true);
  });
});

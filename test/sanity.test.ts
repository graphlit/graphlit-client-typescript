import { describe, it, expect } from "vitest";

describe("Sanity Check", () => {
  it("should run a basic test", () => {
    expect(1 + 1).toBe(2);
  });

  it("should have env vars loaded", () => {
    console.log("ORG:", process.env.GRAPHLIT_ORGANIZATION_ID);
    expect(process.env.GRAPHLIT_ORGANIZATION_ID).toBeDefined();
  });
});

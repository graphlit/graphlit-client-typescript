import { describe, expect, it } from "vitest";
import * as Types from "../src/generated/graphql-types";
import { getModelName } from "../src/model-mapping";

describe("model mapping", () => {
  it("maps Gemini 3.5 Flash to the Google model name", () => {
    expect(
      getModelName({
        serviceType: Types.ModelServiceTypes.Google,
        google: { model: Types.GoogleModels.Gemini_3_5Flash },
      }),
    ).toBe("gemini-3.5-flash");
  });
});

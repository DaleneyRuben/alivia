import { describe, expect, it } from "vitest";

import { generateResetToken } from "./generateResetToken";

describe("generateResetToken", () => {
  it("returns a url-safe string", () => {
    expect(generateResetToken()).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it("returns a token with enough entropy to be unguessable", () => {
    expect(generateResetToken().length).toBeGreaterThanOrEqual(40);
  });

  it("returns a different token on each call", () => {
    const tokens = new Set(
      Array.from({ length: 20 }, () => generateResetToken()),
    );

    expect(tokens.size).toBe(20);
  });
});

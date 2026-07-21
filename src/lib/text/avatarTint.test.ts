import { describe, expect, it } from "vitest";
import { avatarTint } from "./avatarTint";

describe("avatarTint", () => {
  it("returns a bg/text color pair", () => {
    expect(avatarTint("doctor-1")).toEqual({
      bg: expect.any(String),
      text: expect.any(String),
    });
  });

  it("is deterministic for the same id", () => {
    expect(avatarTint("doctor-1")).toEqual(avatarTint("doctor-1"));
  });

  it("cycles through the three tints across different ids", () => {
    const tints = new Set(
      ["a", "b", "c", "d", "e", "f"].map((id) => avatarTint(id).bg),
    );
    expect(tints.size).toBe(3);
  });
});

import { describe, expect, it } from "vitest";
import { isVacationRemovable } from "./isVacationRemovable";

describe("isVacationRemovable", () => {
  it("allows removal while the period is still in the future", () => {
    expect(isVacationRemovable("2026-07-22", "2026-07-20")).toBe(true);
  });

  it("blocks removal once the period has started", () => {
    expect(isVacationRemovable("2026-07-20", "2026-07-20")).toBe(false);
  });

  it("blocks removal once the period is in the past", () => {
    expect(isVacationRemovable("2026-07-15", "2026-07-20")).toBe(false);
  });
});

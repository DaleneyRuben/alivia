import { describe, expect, it } from "vitest";
import { formatMonthYearLabel } from "./formatMonthYearLabel";

describe("formatMonthYearLabel", () => {
  it("formats a date as lowercase spanish month and year", () => {
    expect(formatMonthYearLabel("2026-07-20")).toBe("julio 2026");
  });

  it("formats a different month correctly", () => {
    expect(formatMonthYearLabel("2026-08-03")).toBe("agosto 2026");
  });
});

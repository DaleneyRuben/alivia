import { describe, expect, it } from "vitest";
import { formatLongSpanishDate } from "./formatLongSpanishDate";

describe("formatLongSpanishDate", () => {
  it("formats a date as day, full month, and year", () => {
    expect(formatLongSpanishDate("2026-08-01")).toBe("1 de agosto de 2026");
  });

  it("formats a date from a different month correctly", () => {
    expect(formatLongSpanishDate("1988-03-14")).toBe("14 de marzo de 1988");
  });
});

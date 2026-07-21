import { describe, expect, it } from "vitest";
import { formatShortSpanishDate } from "./formatShortSpanishDate";

describe("formatShortSpanishDate", () => {
  it("formats a date as day, abbreviated month, and year", () => {
    expect(formatShortSpanishDate("2026-07-15")).toBe("15 jul 2026");
  });

  it("formats a date from a different month correctly", () => {
    expect(formatShortSpanishDate("1988-03-14")).toBe("14 mar 1988");
  });
});

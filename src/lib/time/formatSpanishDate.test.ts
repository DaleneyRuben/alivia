import { describe, expect, it } from "vitest";
import { formatSpanishDate } from "./formatSpanishDate";

// 2026-07-20 is a Monday
describe("formatSpanishDate", () => {
  it("formats as capitalized weekday + day + lowercase month", () => {
    expect(formatSpanishDate("2026-07-20")).toBe("Lunes 20 de julio");
  });

  it("formats a different month correctly", () => {
    expect(formatSpanishDate("2026-01-05")).toBe("Lunes 5 de enero");
  });
});

import { describe, expect, it } from "vitest";
import { formatVacationRange } from "./formatVacationRange";

describe("formatVacationRange", () => {
  it("formats a same-month range sharing the month and year once", () => {
    expect(formatVacationRange("2026-07-15", "2026-07-22")).toBe(
      "15–22 jul 2026",
    );
  });

  it("formats a cross-month range within the same year", () => {
    expect(formatVacationRange("2026-07-28", "2026-08-02")).toBe(
      "28 jul – 2 ago 2026",
    );
  });

  it("formats a cross-year range with both years shown", () => {
    expect(formatVacationRange("2026-12-24", "2027-01-02")).toBe(
      "24 dic 2026 – 2 ene 2027",
    );
  });

  it("formats a single-day period without a range dash", () => {
    expect(formatVacationRange("2026-07-15", "2026-07-15")).toBe("15 jul 2026");
  });
});

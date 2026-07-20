import { describe, expect, it } from "vitest";

import { isDateOnVacation, type VacationInput } from "./isDateOnVacation";

function vacation(overrides: Partial<VacationInput> = {}): VacationInput {
  return {
    locationId: null,
    startDate: "2026-07-20",
    endDate: "2026-07-24",
    ...overrides,
  };
}

describe("isDateOnVacation", () => {
  it("matches a date inside a practice-wide vacation for any location", () => {
    expect(isDateOnVacation("2026-07-22", "loc-1", [vacation()])).toBe(true);
  });

  it("includes the start and end dates of the period", () => {
    expect(isDateOnVacation("2026-07-20", "loc-1", [vacation()])).toBe(true);
    expect(isDateOnVacation("2026-07-24", "loc-1", [vacation()])).toBe(true);
  });

  it("does not match a date outside the period", () => {
    expect(isDateOnVacation("2026-07-19", "loc-1", [vacation()])).toBe(false);
    expect(isDateOnVacation("2026-07-25", "loc-1", [vacation()])).toBe(false);
  });

  it("matches a location-scoped vacation at that location", () => {
    const scoped = vacation({ locationId: "loc-1" });

    expect(isDateOnVacation("2026-07-22", "loc-1", [scoped])).toBe(true);
  });

  it("does not match a location-scoped vacation at a different location", () => {
    const scoped = vacation({ locationId: "loc-1" });

    expect(isDateOnVacation("2026-07-22", "loc-2", [scoped])).toBe(false);
  });

  it("returns false when there are no vacations", () => {
    expect(isDateOnVacation("2026-07-22", "loc-1", [])).toBe(false);
  });
});

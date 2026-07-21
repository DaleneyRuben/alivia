import { describe, expect, it } from "vitest";
import { isValidVacationInput } from "./isValidVacationInput";

describe("isValidVacationInput", () => {
  it("accepts a whole-practice period (locationId null) with a valid range", () => {
    expect(
      isValidVacationInput({
        locationId: null,
        startDate: "2026-07-15",
        endDate: "2026-07-22",
      }),
    ).toBe(true);
  });

  it("accepts a period scoped to one Location", () => {
    expect(
      isValidVacationInput({
        locationId: "loc-1",
        startDate: "2026-07-15",
        endDate: "2026-07-22",
      }),
    ).toBe(true);
  });

  it("accepts a single-day period", () => {
    expect(
      isValidVacationInput({
        locationId: null,
        startDate: "2026-07-15",
        endDate: "2026-07-15",
      }),
    ).toBe(true);
  });

  it("rejects an end date before the start date", () => {
    expect(
      isValidVacationInput({
        locationId: null,
        startDate: "2026-07-22",
        endDate: "2026-07-15",
      }),
    ).toBe(false);
  });

  it("rejects an empty start date", () => {
    expect(
      isValidVacationInput({
        locationId: null,
        startDate: "",
        endDate: "2026-07-22",
      }),
    ).toBe(false);
  });

  it("rejects an empty end date", () => {
    expect(
      isValidVacationInput({
        locationId: null,
        startDate: "2026-07-15",
        endDate: "",
      }),
    ).toBe(false);
  });
});

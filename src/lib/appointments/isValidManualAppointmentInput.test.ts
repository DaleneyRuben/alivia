import { describe, expect, it } from "vitest";
import { isValidManualAppointmentInput } from "./isValidManualAppointmentInput";

function input(overrides = {}) {
  return {
    patientName: "Juana Pérez",
    patientPhone: "+591 7XX XXX XX",
    locationId: "loc-1",
    date: "2026-07-20",
    startMinutes: 540,
    endMinutes: 600,
    ...overrides,
  };
}

describe("isValidManualAppointmentInput", () => {
  it("accepts a well-formed input", () => {
    expect(isValidManualAppointmentInput(input())).toBe(true);
  });

  it("rejects an empty patient name", () => {
    expect(isValidManualAppointmentInput(input({ patientName: "  " }))).toBe(
      false,
    );
  });

  it("rejects an empty patient phone", () => {
    expect(isValidManualAppointmentInput(input({ patientPhone: "  " }))).toBe(
      false,
    );
  });

  it("rejects a missing location", () => {
    expect(isValidManualAppointmentInput(input({ locationId: "" }))).toBe(
      false,
    );
  });

  it("rejects a missing date (no slot selected)", () => {
    expect(isValidManualAppointmentInput(input({ date: "" }))).toBe(false);
  });

  it("rejects an end time not after the start time", () => {
    expect(
      isValidManualAppointmentInput(
        input({ startMinutes: 600, endMinutes: 600 }),
      ),
    ).toBe(false);
  });
});

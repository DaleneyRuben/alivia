import { describe, expect, it } from "vitest";
import { compareDoctorsByAvailability } from "./compareDoctorsByAvailability";

function withSlot(date: string | null, startMinutes = 0) {
  return { soonestSlot: date ? { date, startMinutes } : null };
}

describe("compareDoctorsByAvailability", () => {
  it("ranks today's slot before tomorrow's", () => {
    const a = withSlot("2026-07-21", 900);
    const b = withSlot("2026-07-22", 0);
    expect(compareDoctorsByAvailability(a, b)).toBeLessThan(0);
  });

  it("ranks an earlier time before a later time on the same day", () => {
    const a = withSlot("2026-07-21", 480);
    const b = withSlot("2026-07-21", 900);
    expect(compareDoctorsByAvailability(a, b)).toBeLessThan(0);
  });

  it("ranks a doctor with no availability last", () => {
    const a = withSlot("2026-07-21", 480);
    const b = withSlot(null);
    expect(compareDoctorsByAvailability(a, b)).toBeLessThan(0);
    expect(compareDoctorsByAvailability(b, a)).toBeGreaterThan(0);
  });

  it("treats two doctors with no availability as equal", () => {
    expect(compareDoctorsByAvailability(withSlot(null), withSlot(null))).toBe(
      0,
    );
  });
});

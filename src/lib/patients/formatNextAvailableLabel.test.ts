import { describe, expect, it } from "vitest";
import { formatNextAvailableLabel } from "./formatNextAvailableLabel";

describe("formatNextAvailableLabel", () => {
  it("labels a today slot as Hoy", () => {
    expect(
      formatNextAvailableLabel(
        { date: "2026-07-21", startMinutes: 930 },
        "2026-07-21",
        "2026-07-22",
      ),
    ).toBe("Hoy 15:30");
  });

  it("labels a tomorrow slot as Mañana", () => {
    expect(
      formatNextAvailableLabel(
        { date: "2026-07-22", startMinutes: 540 },
        "2026-07-21",
        "2026-07-22",
      ),
    ).toBe("Mañana 09:00");
  });

  it("labels a slot further out by weekday", () => {
    expect(
      formatNextAvailableLabel(
        { date: "2026-07-23", startMinutes: 600 },
        "2026-07-21",
        "2026-07-22",
      ),
    ).toBe("Jueves 10:00");
  });

  it("returns a fallback for no availability", () => {
    expect(formatNextAvailableLabel(null, "2026-07-21", "2026-07-22")).toBe(
      "Sin cupos por ahora",
    );
  });
});

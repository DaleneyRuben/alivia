import { describe, expect, it } from "vitest";
import { laPazDateTimeToUtc } from "./laPazDateTimeToUtc";

// La Paz is a fixed UTC-4 offset, no DST (ADR-0001)
describe("laPazDateTimeToUtc", () => {
  it("converts a La Paz calendar date and minutes-of-day to the matching UTC instant", () => {
    // 2026-07-20 09:00 La Paz = 2026-07-20 13:00 UTC
    expect(laPazDateTimeToUtc("2026-07-20", 540).toISOString()).toBe(
      "2026-07-20T13:00:00.000Z",
    );
  });

  it("rolls into the next UTC day for a late La Paz evening", () => {
    // 2026-07-20 23:30 La Paz = 2026-07-21 03:30 UTC
    expect(laPazDateTimeToUtc("2026-07-20", 1410).toISOString()).toBe(
      "2026-07-21T03:30:00.000Z",
    );
  });
});

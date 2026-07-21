import { describe, expect, it } from "vitest";
import { getLaPazDateString } from "./getLaPazDateString";

// La Paz is a fixed UTC-4 offset, no DST (ADR-0001)
describe("getLaPazDateString", () => {
  it("returns the same date when well within the La Paz day", () => {
    expect(getLaPazDateString(new Date("2026-07-20T15:00:00Z"))).toBe(
      "2026-07-20",
    );
  });

  it("still reads as the previous La Paz date just after UTC midnight", () => {
    expect(getLaPazDateString(new Date("2026-07-21T02:00:00Z"))).toBe(
      "2026-07-20",
    );
  });

  it("rolls over to the next La Paz date at 04:00 UTC", () => {
    expect(getLaPazDateString(new Date("2026-07-21T04:00:00Z"))).toBe(
      "2026-07-21",
    );
  });
});

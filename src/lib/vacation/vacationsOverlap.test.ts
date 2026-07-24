import { describe, expect, it } from "vitest";
import { vacationsOverlap } from "./vacationsOverlap";

const winterBreak = {
  locationId: "loc-1",
  startDate: "2026-07-10",
  endDate: "2026-07-20",
};

describe("vacationsOverlap", () => {
  it("detects overlapping date ranges at the same location", () => {
    expect(
      vacationsOverlap(winterBreak, {
        locationId: "loc-1",
        startDate: "2026-07-15",
        endDate: "2026-07-25",
      }),
    ).toBe(true);
  });

  it("allows non-overlapping date ranges at the same location", () => {
    expect(
      vacationsOverlap(winterBreak, {
        locationId: "loc-1",
        startDate: "2026-07-21",
        endDate: "2026-07-25",
      }),
    ).toBe(false);
  });

  it("allows overlapping date ranges at different locations", () => {
    expect(
      vacationsOverlap(winterBreak, {
        locationId: "loc-2",
        startDate: "2026-07-15",
        endDate: "2026-07-25",
      }),
    ).toBe(false);
  });

  it("treats a null locationId as a wildcard against a specific location", () => {
    expect(
      vacationsOverlap(winterBreak, {
        locationId: null,
        startDate: "2026-07-15",
        endDate: "2026-07-25",
      }),
    ).toBe(true);
  });

  it("treats a null locationId as a wildcard on either side", () => {
    expect(
      vacationsOverlap(
        { locationId: null, startDate: "2026-07-15", endDate: "2026-07-25" },
        winterBreak,
      ),
    ).toBe(true);
  });

  it("treats two null-locationId periods as overlapping when dates intersect", () => {
    expect(
      vacationsOverlap(
        { locationId: null, startDate: "2026-07-10", endDate: "2026-07-20" },
        { locationId: null, startDate: "2026-07-15", endDate: "2026-07-25" },
      ),
    ).toBe(true);
  });

  it("allows touching ranges where one ends the day the other starts (inclusive) as overlapping", () => {
    expect(
      vacationsOverlap(winterBreak, {
        locationId: "loc-1",
        startDate: "2026-07-20",
        endDate: "2026-07-25",
      }),
    ).toBe(true);
  });
});

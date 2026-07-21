import { describe, expect, it } from "vitest";
import { addDaysToIsoDate } from "./addDaysToIsoDate";

describe("addDaysToIsoDate", () => {
  it("adds a day within the same month", () => {
    expect(addDaysToIsoDate("2026-07-20", 1)).toBe("2026-07-21");
  });

  it("rolls over into the next month", () => {
    expect(addDaysToIsoDate("2026-07-31", 1)).toBe("2026-08-01");
  });

  it("supports zero days", () => {
    expect(addDaysToIsoDate("2026-07-20", 0)).toBe("2026-07-20");
  });
});

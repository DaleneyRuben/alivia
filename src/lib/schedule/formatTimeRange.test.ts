import { describe, expect, it } from "vitest";
import { formatTimeRange } from "./formatTimeRange";

describe("formatTimeRange", () => {
  it("formats minutes from midnight as zero-padded HH:MM", () => {
    expect(formatTimeRange(9 * 60, 12 * 60)).toBe("09:00-12:00");
  });

  it("formats a range spanning into the afternoon", () => {
    expect(formatTimeRange(14 * 60, 18 * 60 + 30)).toBe("14:00-18:30");
  });

  it("formats midnight as 00:00", () => {
    expect(formatTimeRange(0, 60)).toBe("00:00-01:00");
  });
});

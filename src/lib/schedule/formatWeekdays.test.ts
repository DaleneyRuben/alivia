import { describe, expect, it } from "vitest";
import { formatWeekdays } from "./formatWeekdays";

describe("formatWeekdays", () => {
  it("collapses a contiguous weekday range into a dash range", () => {
    expect(formatWeekdays([1, 2, 3, 4, 5])).toBe("Lun-Vie");
  });

  it("formats a single day", () => {
    expect(formatWeekdays([6])).toBe("Sáb");
  });

  it("formats non-contiguous days as a comma list", () => {
    expect(formatWeekdays([1, 3, 5])).toBe("Lun, Mié, Vie");
  });

  it("groups multiple contiguous runs separated by commas", () => {
    expect(formatWeekdays([1, 2, 6, 0])).toBe("Lun-Mar, Sáb-Dom");
  });

  it("sorts days into week order regardless of input order", () => {
    expect(formatWeekdays([5, 1, 3])).toBe("Lun, Mié, Vie");
  });
});

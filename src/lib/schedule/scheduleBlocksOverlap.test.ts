import { describe, expect, it } from "vitest";
import { scheduleBlocksOverlap } from "./scheduleBlocksOverlap";

const morning = {
  weekdays: [1, 2, 3],
  startMinutes: 8 * 60,
  endMinutes: 12 * 60,
};

describe("scheduleBlocksOverlap", () => {
  it("detects overlapping time ranges on a shared weekday", () => {
    expect(
      scheduleBlocksOverlap(morning, {
        weekdays: [1],
        startMinutes: 10 * 60,
        endMinutes: 14 * 60,
      }),
    ).toBe(true);
  });

  it("allows the same time range on non-overlapping weekdays", () => {
    expect(
      scheduleBlocksOverlap(morning, {
        weekdays: [4, 5],
        startMinutes: 8 * 60,
        endMinutes: 12 * 60,
      }),
    ).toBe(false);
  });

  it("allows back-to-back blocks on the same weekday (end equals start)", () => {
    expect(
      scheduleBlocksOverlap(morning, {
        weekdays: [1],
        startMinutes: 12 * 60,
        endMinutes: 14 * 60,
      }),
    ).toBe(false);
  });

  it("allows a fully separate time range on a shared weekday", () => {
    expect(
      scheduleBlocksOverlap(morning, {
        weekdays: [2],
        startMinutes: 14 * 60,
        endMinutes: 18 * 60,
      }),
    ).toBe(false);
  });

  it("detects a block fully contained inside another", () => {
    expect(
      scheduleBlocksOverlap(morning, {
        weekdays: [3],
        startMinutes: 9 * 60,
        endMinutes: 10 * 60,
      }),
    ).toBe(true);
  });
});

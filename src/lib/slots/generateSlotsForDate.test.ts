import { describe, expect, it } from "vitest";

import {
  generateSlotsForDate,
  type ScheduleBlockInput,
} from "./generateSlotsForDate";

function block(
  overrides: Partial<ScheduleBlockInput> = {},
): ScheduleBlockInput {
  return {
    locationId: "loc-1",
    weekdays: [1, 2, 3, 4, 5],
    startMinutes: 540,
    endMinutes: 720,
    slotDurationMinutes: 60,
    slotCapacity: 3,
    ...overrides,
  };
}

// 2026-07-20 is a Monday, 2026-07-19 a Sunday
describe("generateSlotsForDate", () => {
  it("generates consecutive slots for a date matching the block's weekdays", () => {
    expect(generateSlotsForDate([block()], "2026-07-20")).toEqual([
      {
        locationId: "loc-1",
        date: "2026-07-20",
        startMinutes: 540,
        endMinutes: 600,
        capacity: 3,
      },
      {
        locationId: "loc-1",
        date: "2026-07-20",
        startMinutes: 600,
        endMinutes: 660,
        capacity: 3,
      },
      {
        locationId: "loc-1",
        date: "2026-07-20",
        startMinutes: 660,
        endMinutes: 720,
        capacity: 3,
      },
    ]);
  });

  it("returns no slots when the date's weekday is not in the block", () => {
    expect(generateSlotsForDate([block()], "2026-07-19")).toEqual([]);
  });

  it("drops a trailing partial slot that does not fit the duration", () => {
    const slots = generateSlotsForDate(
      [block({ endMinutes: 630 })],
      "2026-07-20",
    );

    expect(slots).toEqual([
      {
        locationId: "loc-1",
        date: "2026-07-20",
        startMinutes: 540,
        endMinutes: 600,
        capacity: 3,
      },
    ]);
  });

  it("returns no slots when the duration is longer than the block", () => {
    expect(
      generateSlotsForDate([block({ endMinutes: 570 })], "2026-07-20"),
    ).toEqual([]);
  });

  it("returns no slots for a non-positive duration", () => {
    expect(
      generateSlotsForDate([block({ slotDurationMinutes: 0 })], "2026-07-20"),
    ).toEqual([]);
  });

  it("combines slots from multiple blocks with their own duration and capacity", () => {
    const morning = block({ endMinutes: 660 });
    const afternoon = block({
      startMinutes: 840,
      endMinutes: 900,
      slotDurationMinutes: 30,
      slotCapacity: 2,
    });

    expect(generateSlotsForDate([morning, afternoon], "2026-07-20")).toEqual([
      {
        locationId: "loc-1",
        date: "2026-07-20",
        startMinutes: 540,
        endMinutes: 600,
        capacity: 3,
      },
      {
        locationId: "loc-1",
        date: "2026-07-20",
        startMinutes: 600,
        endMinutes: 660,
        capacity: 3,
      },
      {
        locationId: "loc-1",
        date: "2026-07-20",
        startMinutes: 840,
        endMinutes: 870,
        capacity: 2,
      },
      {
        locationId: "loc-1",
        date: "2026-07-20",
        startMinutes: 870,
        endMinutes: 900,
        capacity: 2,
      },
    ]);
  });
});

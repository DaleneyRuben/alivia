import { describe, expect, it } from "vitest";

import { getAvailableSlots, type AppointmentInput } from "./getAvailableSlots";
import { type ScheduleBlockInput } from "./generateSlotsForDate";

function block(
  overrides: Partial<ScheduleBlockInput> = {},
): ScheduleBlockInput {
  return {
    locationId: "loc-1",
    weekdays: [1, 2, 3, 4, 5],
    startMinutes: 540,
    endMinutes: 660,
    slotDurationMinutes: 60,
    slotCapacity: 2,
    ...overrides,
  };
}

function appointment(
  overrides: Partial<AppointmentInput> = {},
): AppointmentInput {
  return {
    locationId: "loc-1",
    date: "2026-07-20",
    startMinutes: 540,
    status: "SCHEDULED",
    ...overrides,
  };
}

// 2026-07-20 is a Monday
describe("getAvailableSlots", () => {
  it("generates slots for each matching date in the range, sorted by date and time", () => {
    const slots = getAvailableSlots({
      blocks: [block()],
      vacations: [],
      appointments: [],
      from: "2026-07-19",
      to: "2026-07-21",
    });

    expect(
      slots.map(({ date, startMinutes }) => ({ date, startMinutes })),
    ).toEqual([
      { date: "2026-07-20", startMinutes: 540 },
      { date: "2026-07-20", startMinutes: 600 },
      { date: "2026-07-21", startMinutes: 540 },
      { date: "2026-07-21", startMinutes: 600 },
    ]);
  });

  it("marks empty slots available with a zero booked count", () => {
    const [slot] = getAvailableSlots({
      blocks: [block()],
      vacations: [],
      appointments: [],
      from: "2026-07-20",
      to: "2026-07-20",
    });

    expect(slot).toEqual({
      locationId: "loc-1",
      date: "2026-07-20",
      startMinutes: 540,
      endMinutes: 600,
      capacity: 2,
      bookedCount: 0,
      availableToPatients: true,
    });
  });

  it("skips dates covered by a practice-wide vacation", () => {
    const slots = getAvailableSlots({
      blocks: [block()],
      vacations: [
        { locationId: null, startDate: "2026-07-20", endDate: "2026-07-20" },
      ],
      appointments: [],
      from: "2026-07-20",
      to: "2026-07-21",
    });

    expect(slots.map(({ date }) => date)).toEqual(["2026-07-21", "2026-07-21"]);
  });

  it("removes only the affected location's slots for a location-scoped vacation", () => {
    const slots = getAvailableSlots({
      blocks: [block(), block({ locationId: "loc-2" })],
      vacations: [
        { locationId: "loc-1", startDate: "2026-07-20", endDate: "2026-07-20" },
      ],
      appointments: [],
      from: "2026-07-20",
      to: "2026-07-20",
    });

    expect(slots.map(({ locationId }) => locationId)).toEqual([
      "loc-2",
      "loc-2",
    ]);
  });

  it("counts non-cancelled appointments in the slot's booked count", () => {
    const [slot] = getAvailableSlots({
      blocks: [block()],
      vacations: [],
      appointments: [
        appointment(),
        appointment({ status: "CANCELLED" }),
        appointment({ startMinutes: 600 }),
        appointment({ date: "2026-07-21" }),
        appointment({ locationId: "loc-2" }),
      ],
      from: "2026-07-20",
      to: "2026-07-20",
    });

    expect(slot.bookedCount).toBe(1);
    expect(slot.availableToPatients).toBe(true);
  });

  it("keeps a slot at capacity in the list but unavailable to patients", () => {
    const [slot] = getAvailableSlots({
      blocks: [block()],
      vacations: [],
      appointments: [appointment(), appointment()],
      from: "2026-07-20",
      to: "2026-07-20",
    });

    expect(slot.bookedCount).toBe(2);
    expect(slot.availableToPatients).toBe(false);
  });

  it("keeps a slot pushed over capacity by staff unavailable to patients", () => {
    const [slot] = getAvailableSlots({
      blocks: [block()],
      vacations: [],
      appointments: [appointment(), appointment(), appointment()],
      from: "2026-07-20",
      to: "2026-07-20",
    });

    expect(slot.bookedCount).toBe(3);
    expect(slot.availableToPatients).toBe(false);
  });

  it("returns no slots when the range is inverted", () => {
    const slots = getAvailableSlots({
      blocks: [block()],
      vacations: [],
      appointments: [],
      from: "2026-07-21",
      to: "2026-07-20",
    });

    expect(slots).toEqual([]);
  });
});

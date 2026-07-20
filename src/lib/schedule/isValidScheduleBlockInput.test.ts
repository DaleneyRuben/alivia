import { describe, expect, it } from "vitest";
import { isValidScheduleBlockInput } from "./isValidScheduleBlockInput";

const validInput = {
  weekdays: [1, 2, 3, 4, 5],
  startMinutes: 9 * 60,
  endMinutes: 12 * 60,
  slotDurationMinutes: 30,
  slotCapacity: 3,
};

describe("isValidScheduleBlockInput", () => {
  it("accepts a well-formed block", () => {
    expect(isValidScheduleBlockInput(validInput)).toBe(true);
  });

  it("rejects an empty weekday selection", () => {
    expect(isValidScheduleBlockInput({ ...validInput, weekdays: [] })).toBe(
      false,
    );
  });

  it("rejects an end time before or equal to the start time", () => {
    expect(
      isValidScheduleBlockInput({ ...validInput, endMinutes: 9 * 60 }),
    ).toBe(false);
    expect(
      isValidScheduleBlockInput({ ...validInput, endMinutes: 8 * 60 }),
    ).toBe(false);
  });

  it("rejects a non-positive slot duration", () => {
    expect(
      isValidScheduleBlockInput({ ...validInput, slotDurationMinutes: 0 }),
    ).toBe(false);
  });

  it("rejects a slot duration longer than the block itself", () => {
    expect(
      isValidScheduleBlockInput({ ...validInput, slotDurationMinutes: 200 }),
    ).toBe(false);
  });

  it("rejects a capacity below 1", () => {
    expect(isValidScheduleBlockInput({ ...validInput, slotCapacity: 0 })).toBe(
      false,
    );
  });
});

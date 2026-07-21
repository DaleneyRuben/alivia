import { describe, expect, it } from "vitest";
import { isValidGuestBookingInput } from "./isValidGuestBookingInput";

describe("isValidGuestBookingInput", () => {
  it("accepts a well-formed guest name and phone", () => {
    expect(
      isValidGuestBookingInput({ name: "María Quispe", phone: "71234567" }),
    ).toBe(true);
  });

  it("rejects a name of one character or fewer", () => {
    expect(isValidGuestBookingInput({ name: "M", phone: "71234567" })).toBe(
      false,
    );
  });

  it("rejects a phone shorter than 6 characters", () => {
    expect(
      isValidGuestBookingInput({ name: "María Quispe", phone: "712" }),
    ).toBe(false);
  });

  it("ignores surrounding whitespace when measuring length", () => {
    expect(
      isValidGuestBookingInput({ name: "  M  ", phone: "  71234567  " }),
    ).toBe(false);
  });

  it("accepts a phone of exactly 6 characters", () => {
    expect(
      isValidGuestBookingInput({ name: "María Quispe", phone: "712345" }),
    ).toBe(true);
  });
});

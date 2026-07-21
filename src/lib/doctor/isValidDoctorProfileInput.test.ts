import { describe, expect, it } from "vitest";
import { isValidDoctorProfileInput } from "./isValidDoctorProfileInput";

const validInput = {
  name: "Dr. Luis Fernández",
  specialty: "Pediatría",
  yearsExperience: 14,
  bio: "Pediatra con enfoque en el control del niño sano.",
};

describe("isValidDoctorProfileInput", () => {
  it("accepts a well-formed profile", () => {
    expect(isValidDoctorProfileInput(validInput)).toBe(true);
  });

  it("rejects an empty name", () => {
    expect(isValidDoctorProfileInput({ ...validInput, name: "" })).toBe(false);
  });

  it("rejects a name that is only whitespace", () => {
    expect(isValidDoctorProfileInput({ ...validInput, name: "   " })).toBe(
      false,
    );
  });

  it("rejects an empty specialty", () => {
    expect(isValidDoctorProfileInput({ ...validInput, specialty: "" })).toBe(
      false,
    );
  });

  it("accepts a null yearsExperience", () => {
    expect(
      isValidDoctorProfileInput({ ...validInput, yearsExperience: null }),
    ).toBe(true);
  });

  it("rejects a negative yearsExperience", () => {
    expect(
      isValidDoctorProfileInput({ ...validInput, yearsExperience: -1 }),
    ).toBe(false);
  });

  it("rejects a non-integer yearsExperience", () => {
    expect(
      isValidDoctorProfileInput({ ...validInput, yearsExperience: 2.5 }),
    ).toBe(false);
  });

  it("accepts an empty bio", () => {
    expect(isValidDoctorProfileInput({ ...validInput, bio: "" })).toBe(true);
  });
});

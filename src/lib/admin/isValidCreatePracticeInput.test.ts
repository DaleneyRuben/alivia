import { describe, expect, it } from "vitest";
import { isValidCreatePracticeInput } from "./isValidCreatePracticeInput";

const validDoctor = {
  name: "Dra. Carla Mendoza",
  specialty: "Cardiología",
  email: "carla@consulta.bo",
  phone: "+591 71234567",
};

const validAssistant = {
  name: "Andrea López",
  email: "andrea@consulta.bo",
  phone: "+591 76543210",
};

describe("isValidCreatePracticeInput", () => {
  it("accepts a doctor-only submission with all fields filled", () => {
    expect(
      isValidCreatePracticeInput({ doctor: validDoctor, assistant: null }),
    ).toBe(true);
  });

  it("accepts a submission with a valid assistant account", () => {
    expect(
      isValidCreatePracticeInput({
        doctor: validDoctor,
        assistant: validAssistant,
      }),
    ).toBe(true);
  });

  it("rejects a doctor with an empty name", () => {
    expect(
      isValidCreatePracticeInput({
        doctor: { ...validDoctor, name: "  " },
        assistant: null,
      }),
    ).toBe(false);
  });

  it("rejects a doctor with an empty specialty", () => {
    expect(
      isValidCreatePracticeInput({
        doctor: { ...validDoctor, specialty: "" },
        assistant: null,
      }),
    ).toBe(false);
  });

  it("rejects a doctor email missing an @", () => {
    expect(
      isValidCreatePracticeInput({
        doctor: { ...validDoctor, email: "carla-consulta.bo" },
        assistant: null,
      }),
    ).toBe(false);
  });

  it("rejects a doctor phone shorter than 6 characters", () => {
    expect(
      isValidCreatePracticeInput({
        doctor: { ...validDoctor, phone: "123" },
        assistant: null,
      }),
    ).toBe(false);
  });

  it("rejects an incomplete assistant even when the doctor is valid", () => {
    expect(
      isValidCreatePracticeInput({
        doctor: validDoctor,
        assistant: { ...validAssistant, email: "" },
      }),
    ).toBe(false);
  });
});

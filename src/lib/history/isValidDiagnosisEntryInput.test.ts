import { describe, expect, it } from "vitest";
import { isValidDiagnosisEntryInput } from "./isValidDiagnosisEntryInput";

describe("isValidDiagnosisEntryInput", () => {
  it("accepts a non-empty diagnosis and treatment", () => {
    expect(
      isValidDiagnosisEntryInput({
        diagnosis: "Migraña tensional",
        treatment: "Reposo e hidratación",
      }),
    ).toBe(true);
  });

  it("rejects an empty diagnosis", () => {
    expect(
      isValidDiagnosisEntryInput({ diagnosis: "  ", treatment: "Reposo" }),
    ).toBe(false);
  });

  it("rejects an empty treatment", () => {
    expect(
      isValidDiagnosisEntryInput({ diagnosis: "Migraña", treatment: "" }),
    ).toBe(false);
  });
});

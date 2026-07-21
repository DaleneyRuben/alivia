import { describe, expect, it } from "vitest";
import { describePatientHistoryTag } from "./describePatientHistoryTag";

describe("describePatientHistoryTag", () => {
  it("tags a patient with no Medical Profile as Nueva", () => {
    expect(
      describePatientHistoryTag({ hasMedicalProfile: false, visitCount: 0 }),
    ).toEqual({ tag: "Nueva", sub: "Sin historia — primera visita" });
  });

  it("tags a patient with a Medical Profile as Con historia, singular visit", () => {
    expect(
      describePatientHistoryTag({ hasMedicalProfile: true, visitCount: 1 }),
    ).toEqual({ tag: "Con historia", sub: "1 visita registradas" });
  });

  it("tags a patient with a Medical Profile as Con historia, plural visits", () => {
    expect(
      describePatientHistoryTag({ hasMedicalProfile: true, visitCount: 3 }),
    ).toEqual({ tag: "Con historia", sub: "3 visitas registradas" });
  });
});

import { describe, expect, it } from "vitest";
import { matchesDoctorQuery } from "./matchesDoctorQuery";

const doctor = { name: "Dra. Carla Mendoza", specialty: "Cardiología" };

describe("matchesDoctorQuery", () => {
  it("matches a case-insensitive substring of the specialty", () => {
    expect(matchesDoctorQuery(doctor, "cardio")).toBe(true);
  });

  it("matches a case-insensitive substring of the doctor name", () => {
    expect(matchesDoctorQuery(doctor, "MENDOZA")).toBe(true);
  });

  it("returns false when neither field contains the query", () => {
    expect(matchesDoctorQuery(doctor, "pediatría")).toBe(false);
  });

  it("matches everything for an empty query", () => {
    expect(matchesDoctorQuery(doctor, "")).toBe(true);
  });

  it("ignores surrounding whitespace in the query", () => {
    expect(matchesDoctorQuery(doctor, "  cardio  ")).toBe(true);
  });
});

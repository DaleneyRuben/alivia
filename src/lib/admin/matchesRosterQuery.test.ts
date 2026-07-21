import { describe, expect, it } from "vitest";
import { matchesRosterQuery } from "./matchesRosterQuery";

const practice = {
  doctorName: "Dra. Carla Mendoza",
  practiceLabel: "Cardio Miraflores",
};

describe("matchesRosterQuery", () => {
  it("matches a case-insensitive substring of the doctor name", () => {
    expect(matchesRosterQuery(practice, "MENDOZA")).toBe(true);
  });

  it("matches a case-insensitive substring of the practice label", () => {
    expect(matchesRosterQuery(practice, "miraflores")).toBe(true);
  });

  it("returns false when neither field contains the query", () => {
    expect(matchesRosterQuery(practice, "pediatría")).toBe(false);
  });

  it("matches everything for an empty query", () => {
    expect(matchesRosterQuery(practice, "")).toBe(true);
  });

  it("ignores surrounding whitespace in the query", () => {
    expect(matchesRosterQuery(practice, "  mendoza  ")).toBe(true);
  });
});

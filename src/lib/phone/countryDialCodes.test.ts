import { describe, expect, it } from "vitest";
import { COUNTRY_DIAL_CODES } from "./countryDialCodes";

describe("COUNTRY_DIAL_CODES", () => {
  it("lists the full global set of countries", () => {
    expect(COUNTRY_DIAL_CODES).toHaveLength(195);
  });

  it("has Bolivia preselected as the first entry", () => {
    expect(COUNTRY_DIAL_CODES[0]).toEqual({ flag: "🇧🇴", dial: "+591" });
  });

  it("gives every entry a dial code starting with +", () => {
    expect(
      COUNTRY_DIAL_CODES.every((country) => country.dial.startsWith("+")),
    ).toBe(true);
  });

  it("gives every entry a unique flag", () => {
    const flags = new Set(COUNTRY_DIAL_CODES.map((country) => country.flag));
    expect(flags.size).toBe(COUNTRY_DIAL_CODES.length);
  });
});

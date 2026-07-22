import { describe, expect, it } from "vitest";
import { toE164 } from "./toE164";

describe("toE164", () => {
  it("combines a dial code and national number into E.164", () => {
    expect(toE164("+591", "71234567")).toBe("+59171234567");
  });

  it("strips non-digit characters from the national number", () => {
    expect(toE164("+591", "712-345 67")).toBe("+59171234567");
  });

  it("returns an empty string when no national number is entered", () => {
    expect(toE164("+591", "")).toBe("");
    expect(toE164("+591", "   ")).toBe("");
  });
});

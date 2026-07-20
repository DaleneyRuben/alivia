import { describe, expect, it } from "vitest";
import { isValidLocationInput } from "./isValidLocationInput";

describe("isValidLocationInput", () => {
  it("accepts a well-formed location", () => {
    expect(
      isValidLocationInput({
        name: "Clínica Los Andes",
        address: "Av. 6 de Agosto",
      }),
    ).toBe(true);
  });

  it("rejects an empty name", () => {
    expect(isValidLocationInput({ name: "", address: "Av. 6 de Agosto" })).toBe(
      false,
    );
  });

  it("rejects a name that is only whitespace", () => {
    expect(
      isValidLocationInput({ name: "   ", address: "Av. 6 de Agosto" }),
    ).toBe(false);
  });

  it("rejects an empty address", () => {
    expect(
      isValidLocationInput({ name: "Clínica Los Andes", address: "" }),
    ).toBe(false);
  });

  it("rejects an address that is only whitespace", () => {
    expect(
      isValidLocationInput({ name: "Clínica Los Andes", address: "   " }),
    ).toBe(false);
  });
});

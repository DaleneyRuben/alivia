import { describe, expect, it } from "vitest";
import { initials } from "./initials";

describe("initials", () => {
  it("takes the first letter of the first two words", () => {
    expect(initials("Juana Pérez")).toBe("JP");
  });

  it("uppercases the result", () => {
    expect(initials("mario soto")).toBe("MS");
  });

  it("caps at two letters for longer names", () => {
    expect(initials("Ana María Vargas Rojas")).toBe("AM");
  });

  it("handles a single word name", () => {
    expect(initials("Cher")).toBe("C");
  });

  it("trims surrounding whitespace", () => {
    expect(initials("  Juana Pérez  ")).toBe("JP");
  });
});

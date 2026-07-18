import { describe, expect, it } from "vitest";
import { postLoginPath } from "./postLoginPath";

describe("postLoginPath", () => {
  it("sends an admin to the admin roster", () => {
    expect(postLoginPath({ role: "ADMIN" })).toBe("/admin");
  });

  it("sends a doctor on first login to onboarding", () => {
    expect(postLoginPath({ role: "DOCTOR", doctorOnboarded: false })).toBe(
      "/panel/onboarding",
    );
  });

  it("sends a returning doctor to appointments", () => {
    expect(postLoginPath({ role: "DOCTOR", doctorOnboarded: true })).toBe(
      "/panel/appointments",
    );
  });

  it("sends an assistant to appointments", () => {
    expect(postLoginPath({ role: "ASSISTANT" })).toBe("/panel/appointments");
  });
});

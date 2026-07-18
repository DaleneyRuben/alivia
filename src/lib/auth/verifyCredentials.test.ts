import { describe, expect, it } from "vitest";
import bcrypt from "bcryptjs";
import { verifyCredentials } from "./verify-credentials";

const passwordHash = bcrypt.hashSync("correct-password", 10);

const user = {
  id: "user-1",
  passwordHash,
  active: true,
};

describe("verifyCredentials", () => {
  it("accepts an active user with the right password", async () => {
    await expect(verifyCredentials(user, "correct-password")).resolves.toBe(
      true,
    );
  });

  it("rejects a wrong password", async () => {
    await expect(verifyCredentials(user, "wrong-password")).resolves.toBe(
      false,
    );
  });

  it("rejects when the user does not exist", async () => {
    await expect(verifyCredentials(null, "correct-password")).resolves.toBe(
      false,
    );
  });

  it("rejects a deactivated account", async () => {
    await expect(
      verifyCredentials({ ...user, active: false }, "correct-password"),
    ).resolves.toBe(false);
  });

  it("rejects an account that has not set a password yet", async () => {
    await expect(
      verifyCredentials({ ...user, passwordHash: null }, "correct-password"),
    ).resolves.toBe(false);
  });
});

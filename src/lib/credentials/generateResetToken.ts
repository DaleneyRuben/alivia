import { randomBytes } from "node:crypto";

// single active resetToken per account, reused for setup and admin-driven resets (ADR-0015)
export function generateResetToken(): string {
  return randomBytes(32).toString("base64url");
}

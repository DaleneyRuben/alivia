import { describe, expect, it, vi, beforeEach } from "vitest";
import { getDoctorIdForUser } from "./getDoctorIdForUser";

const doctorFindUnique = vi.fn();
const assistantFindUnique = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    doctor: { findUnique: (...a: unknown[]) => doctorFindUnique(...a) },
    assistant: { findUnique: (...a: unknown[]) => assistantFindUnique(...a) },
  },
}));

describe("getDoctorIdForUser", () => {
  beforeEach(() => {
    doctorFindUnique.mockReset();
    assistantFindUnique.mockReset();
  });

  it("resolves a DOCTOR session to their own doctor id", async () => {
    doctorFindUnique.mockResolvedValue({ id: "doctor-1" });

    await expect(getDoctorIdForUser("user-1", "DOCTOR")).resolves.toBe(
      "doctor-1",
    );
    expect(assistantFindUnique).not.toHaveBeenCalled();
  });

  it("resolves an ASSISTANT session to the linked doctor's id — manages on the Doctor's behalf", async () => {
    assistantFindUnique.mockResolvedValue({ doctorId: "doctor-1" });

    await expect(getDoctorIdForUser("user-2", "ASSISTANT")).resolves.toBe(
      "doctor-1",
    );
    expect(doctorFindUnique).not.toHaveBeenCalled();
  });

  it("returns null for an ADMIN session — not a practice-scoped role", async () => {
    await expect(getDoctorIdForUser("user-3", "ADMIN")).resolves.toBeNull();
    expect(doctorFindUnique).not.toHaveBeenCalled();
    expect(assistantFindUnique).not.toHaveBeenCalled();
  });
});

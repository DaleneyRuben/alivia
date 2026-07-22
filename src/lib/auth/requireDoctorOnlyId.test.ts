import { describe, expect, it, vi, beforeEach } from "vitest";
import { requireDoctorOnlyId } from "./requireDoctorOnlyId";

const authMock = vi.fn();
const doctorFindUnique = vi.fn();

vi.mock("@/lib/auth", () => ({ auth: () => authMock() }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    doctor: { findUnique: (...a: unknown[]) => doctorFindUnique(...a) },
  },
}));

describe("requireDoctorOnlyId", () => {
  beforeEach(() => {
    authMock.mockReset();
    doctorFindUnique.mockReset();
  });

  it("throws when there is no session", async () => {
    authMock.mockResolvedValue(null);

    await expect(requireDoctorOnlyId()).rejects.toThrow("Not authenticated");
  });

  it("rejects an Assistant session — Medical History is Doctor-only", async () => {
    authMock.mockResolvedValue({ user: { id: "user-1", role: "ASSISTANT" } });

    await expect(requireDoctorOnlyId()).rejects.toThrow("Not authorized");
    expect(doctorFindUnique).not.toHaveBeenCalled();
  });

  it("resolves the doctorId for a DOCTOR session", async () => {
    authMock.mockResolvedValue({ user: { id: "user-1", role: "DOCTOR" } });
    doctorFindUnique.mockResolvedValue({ id: "doctor-1" });

    await expect(requireDoctorOnlyId()).resolves.toBe("doctor-1");
  });
});

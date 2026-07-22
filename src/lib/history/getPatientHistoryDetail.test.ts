import { describe, expect, it, vi, beforeEach } from "vitest";
import { getPatientHistoryDetail } from "./getPatientHistoryDetail";

const patientFindUnique = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    patient: { findUnique: (...a: unknown[]) => patientFindUnique(...a) },
  },
}));

describe("getPatientHistoryDetail", () => {
  beforeEach(() => {
    patientFindUnique.mockReset();
  });

  it("returns null when the patient belongs to a different doctor — Medical History is siloed per Doctor-Patient pair", async () => {
    patientFindUnique.mockResolvedValue({
      id: "patient-1",
      doctorId: "other-doctor",
      name: "Ana Rojas",
      phone: "71234567",
      medicalProfile: null,
      diagnosisEntries: [],
    });

    await expect(
      getPatientHistoryDetail("doctor-1", "patient-1"),
    ).resolves.toBeNull();
  });

  it("returns null when the patient doesn't exist", async () => {
    patientFindUnique.mockResolvedValue(null);

    await expect(
      getPatientHistoryDetail("doctor-1", "patient-1"),
    ).resolves.toBeNull();
  });

  it("returns the history for the owning doctor", async () => {
    patientFindUnique.mockResolvedValue({
      id: "patient-1",
      doctorId: "doctor-1",
      name: "Ana Rojas",
      phone: "71234567",
      medicalProfile: {
        dateOfBirth: new Date("1990-05-01"),
        bloodType: "O+",
        allergiesAndHistory: "Ninguna",
      },
      diagnosisEntries: [
        {
          id: "entry-1",
          createdAt: new Date("2026-07-01"),
          diagnosis: "Gripe",
          treatment: "Reposo",
        },
      ],
    });

    const detail = await getPatientHistoryDetail("doctor-1", "patient-1");

    expect(detail?.id).toBe("patient-1");
    expect(detail?.diagnosisEntries).toHaveLength(1);
  });
});

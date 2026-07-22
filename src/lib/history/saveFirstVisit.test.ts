import { describe, expect, it, vi, beforeEach } from "vitest";
import { saveFirstVisit } from "./saveFirstVisit";

const DOCTOR_ID = "doctor-1";

const revalidatePath = vi.fn();
const patientFindUnique = vi.fn();
const transaction = vi.fn();
const hasAttendedAppointment = vi.fn();

vi.mock("next/cache", () => ({
  revalidatePath: (...a: unknown[]) => revalidatePath(...a),
}));
vi.mock("@/lib/auth/requireDoctorOnlyId", () => ({
  requireDoctorOnlyId: () => Promise.resolve(DOCTOR_ID),
}));
vi.mock("./hasAttendedAppointment", () => ({
  hasAttendedAppointment: (...a: unknown[]) => hasAttendedAppointment(...a),
}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    patient: { findUnique: (...a: unknown[]) => patientFindUnique(...a) },
    $transaction: (...a: unknown[]) => transaction(...a),
    medicalProfile: { create: vi.fn() },
    diagnosisEntry: { create: vi.fn() },
  },
}));

const input = {
  patientId: "patient-1",
  dateOfBirth: null,
  bloodType: "O+",
  allergiesAndHistory: "Ninguna",
  diagnosis: "Gripe",
  treatment: "Reposo",
};

describe("saveFirstVisit", () => {
  beforeEach(() => {
    revalidatePath.mockReset();
    patientFindUnique.mockReset();
    transaction.mockReset();
    hasAttendedAppointment.mockReset();
    patientFindUnique.mockResolvedValue({
      id: "patient-1",
      doctorId: DOCTOR_ID,
      medicalProfile: null,
    });
  });

  it("rejects a patient with no Attended appointment — first Attended visit gates the Medical Profile", async () => {
    hasAttendedAppointment.mockResolvedValue(false);

    await expect(saveFirstVisit(input)).rejects.toThrow(
      "Patient has no Attended appointment yet",
    );
    expect(transaction).not.toHaveBeenCalled();
  });

  it("creates the Medical Profile and first Diagnosis Entry once the patient has been Attended", async () => {
    hasAttendedAppointment.mockResolvedValue(true);

    await saveFirstVisit(input);

    expect(transaction).toHaveBeenCalled();
  });
});

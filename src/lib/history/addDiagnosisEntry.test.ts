import { describe, expect, it, vi, beforeEach } from "vitest";
import { addDiagnosisEntry } from "./addDiagnosisEntry";

const DOCTOR_ID = "doctor-1";

const revalidatePath = vi.fn();
const patientFindUnique = vi.fn();
const diagnosisEntryCreate = vi.fn();
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
    diagnosisEntry: { create: (...a: unknown[]) => diagnosisEntryCreate(...a) },
  },
}));

const input = {
  patientId: "patient-1",
  diagnosis: "Migraña",
  treatment: "Analgésico",
};

describe("addDiagnosisEntry", () => {
  beforeEach(() => {
    revalidatePath.mockReset();
    patientFindUnique.mockReset();
    diagnosisEntryCreate.mockReset();
    hasAttendedAppointment.mockReset();
  });

  it("rejects a patient with no Medical Profile yet", async () => {
    patientFindUnique.mockResolvedValue({
      id: "patient-1",
      doctorId: DOCTOR_ID,
      medicalProfile: null,
    });

    await expect(addDiagnosisEntry(input)).rejects.toThrow(
      "Patient has no Medical History yet",
    );
    expect(diagnosisEntryCreate).not.toHaveBeenCalled();
  });

  it("rejects a patient with no Attended appointment — each entry gates on an Attended visit", async () => {
    patientFindUnique.mockResolvedValue({
      id: "patient-1",
      doctorId: DOCTOR_ID,
      medicalProfile: { id: "profile-1" },
    });
    hasAttendedAppointment.mockResolvedValue(false);

    await expect(addDiagnosisEntry(input)).rejects.toThrow(
      "Patient has no Attended appointment yet",
    );
    expect(diagnosisEntryCreate).not.toHaveBeenCalled();
  });

  it("appends a Diagnosis Entry once the patient has Medical History and an Attended visit", async () => {
    patientFindUnique.mockResolvedValue({
      id: "patient-1",
      doctorId: DOCTOR_ID,
      medicalProfile: { id: "profile-1" },
    });
    hasAttendedAppointment.mockResolvedValue(true);

    await addDiagnosisEntry(input);

    expect(diagnosisEntryCreate).toHaveBeenCalledWith({
      data: {
        patientId: "patient-1",
        diagnosis: "Migraña",
        treatment: "Analgésico",
      },
    });
  });
});

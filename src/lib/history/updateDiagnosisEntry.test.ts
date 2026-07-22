import { describe, expect, it, vi, beforeEach } from "vitest";
import { updateDiagnosisEntry } from "./updateDiagnosisEntry";

const DOCTOR_ID = "doctor-1";

const revalidatePath = vi.fn();
const diagnosisEntryFindUnique = vi.fn();
const diagnosisEntryUpdate = vi.fn();

vi.mock("next/cache", () => ({
  revalidatePath: (...a: unknown[]) => revalidatePath(...a),
}));
vi.mock("@/lib/auth/requireDoctorOnlyId", () => ({
  requireDoctorOnlyId: () => Promise.resolve(DOCTOR_ID),
}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    diagnosisEntry: {
      findUnique: (...a: unknown[]) => diagnosisEntryFindUnique(...a),
      update: (...a: unknown[]) => diagnosisEntryUpdate(...a),
    },
  },
}));

const input = {
  entryId: "entry-1",
  diagnosis: "Gripe",
  treatment: "Reposo e hidratación",
};

describe("updateDiagnosisEntry", () => {
  beforeEach(() => {
    revalidatePath.mockReset();
    diagnosisEntryFindUnique.mockReset();
    diagnosisEntryUpdate.mockReset();
  });

  it("edits an entry belonging to the doctor's own patient — entries are editable", async () => {
    diagnosisEntryFindUnique.mockResolvedValue({
      id: "entry-1",
      patientId: "patient-1",
      patient: { doctorId: DOCTOR_ID },
    });

    await updateDiagnosisEntry(input);

    expect(diagnosisEntryUpdate).toHaveBeenCalledWith({
      where: { id: "entry-1" },
      data: { diagnosis: "Gripe", treatment: "Reposo e hidratación" },
    });
  });

  it("rejects editing an entry belonging to another doctor's patient — siloed per Doctor-Patient pair", async () => {
    diagnosisEntryFindUnique.mockResolvedValue({
      id: "entry-1",
      patientId: "patient-1",
      patient: { doctorId: "other-doctor" },
    });

    await expect(updateDiagnosisEntry(input)).rejects.toThrow("Not authorized");
    expect(diagnosisEntryUpdate).not.toHaveBeenCalled();
  });
});

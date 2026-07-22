"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireDoctorOnlyId } from "@/lib/auth/requireDoctorOnlyId";
import { hasAttendedAppointment } from "./hasAttendedAppointment";
import { isValidDiagnosisEntryInput } from "./isValidDiagnosisEntryInput";

export interface SaveFirstVisitInput {
  patientId: string;
  dateOfBirth: string | null;
  bloodType: string;
  allergiesAndHistory: string;
  diagnosis: string;
  treatment: string;
}

export async function saveFirstVisit(input: SaveFirstVisitInput) {
  const doctorId = await requireDoctorOnlyId();
  if (!isValidDiagnosisEntryInput(input)) {
    throw new Error("Invalid diagnosis entry");
  }

  const patient = await prisma.patient.findUnique({
    where: { id: input.patientId },
    include: { medicalProfile: true },
  });
  if (!patient || patient.doctorId !== doctorId) {
    throw new Error("Not authorized");
  }
  if (patient.medicalProfile) {
    throw new Error("Medical profile already exists for this patient");
  }
  if (!(await hasAttendedAppointment(doctorId, patient.id))) {
    throw new Error("Patient has no Attended appointment yet");
  }

  await prisma.$transaction([
    prisma.medicalProfile.create({
      data: {
        patientId: patient.id,
        dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : null,
        bloodType: input.bloodType.trim() || null,
        allergiesAndHistory: input.allergiesAndHistory.trim() || null,
      },
    }),
    prisma.diagnosisEntry.create({
      data: {
        patientId: patient.id,
        diagnosis: input.diagnosis.trim(),
        treatment: input.treatment.trim(),
      },
    }),
  ]);

  revalidatePath(`/panel/history/${patient.id}`);
  revalidatePath("/panel/history");
}

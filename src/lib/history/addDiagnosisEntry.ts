"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireDoctorOnlyId } from "@/lib/auth/requireDoctorOnlyId";
import {
  isValidDiagnosisEntryInput,
  type DiagnosisEntryInput,
} from "./isValidDiagnosisEntryInput";

export interface AddDiagnosisEntryInput extends DiagnosisEntryInput {
  patientId: string;
}

export async function addDiagnosisEntry(input: AddDiagnosisEntryInput) {
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
  if (!patient.medicalProfile) {
    throw new Error("Patient has no Medical History yet");
  }

  await prisma.diagnosisEntry.create({
    data: {
      patientId: patient.id,
      diagnosis: input.diagnosis.trim(),
      treatment: input.treatment.trim(),
    },
  });

  revalidatePath(`/panel/history/${patient.id}`);
  revalidatePath("/panel/history");
}

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireDoctorOnlyId } from "@/lib/auth/requireDoctorOnlyId";
import {
  isValidDiagnosisEntryInput,
  type DiagnosisEntryInput,
} from "./isValidDiagnosisEntryInput";

export interface UpdateDiagnosisEntryInput extends DiagnosisEntryInput {
  entryId: string;
}

export async function updateDiagnosisEntry(input: UpdateDiagnosisEntryInput) {
  const doctorId = await requireDoctorOnlyId();
  if (!isValidDiagnosisEntryInput(input)) {
    throw new Error("Invalid diagnosis entry");
  }

  const entry = await prisma.diagnosisEntry.findUnique({
    where: { id: input.entryId },
    include: { patient: true },
  });
  if (!entry || entry.patient.doctorId !== doctorId) {
    throw new Error("Not authorized");
  }

  await prisma.diagnosisEntry.update({
    where: { id: input.entryId },
    data: {
      diagnosis: input.diagnosis.trim(),
      treatment: input.treatment.trim(),
    },
  });

  revalidatePath(`/panel/history/${entry.patientId}`);
}

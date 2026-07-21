"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireDoctorOnlyId } from "@/lib/auth/requireDoctorOnlyId";

export interface UpdateMedicalProfileInput {
  patientId: string;
  dateOfBirth: string | null;
  bloodType: string;
  allergiesAndHistory: string;
}

export async function updateMedicalProfile(input: UpdateMedicalProfileInput) {
  const doctorId = await requireDoctorOnlyId();

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

  await prisma.medicalProfile.update({
    where: { patientId: patient.id },
    data: {
      dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : null,
      bloodType: input.bloodType.trim() || null,
      allergiesAndHistory: input.allergiesAndHistory.trim() || null,
    },
  });

  revalidatePath(`/panel/history/${patient.id}`);
}

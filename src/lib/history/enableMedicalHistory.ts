"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireDoctorOnlyId } from "@/lib/auth/requireDoctorOnlyId";

export async function enableMedicalHistory() {
  const doctorId = await requireDoctorOnlyId();

  await prisma.doctor.update({
    where: { id: doctorId },
    data: { medicalHistoryEnabled: true },
  });

  revalidatePath("/panel/history");
}

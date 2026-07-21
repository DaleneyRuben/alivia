import { prisma } from "@/lib/prisma";

export async function getMedicalHistoryStatus(doctorId: string) {
  const doctor = await prisma.doctor.findUniqueOrThrow({
    where: { id: doctorId },
    select: { medicalHistoryEnabled: true },
  });
  return doctor.medicalHistoryEnabled;
}

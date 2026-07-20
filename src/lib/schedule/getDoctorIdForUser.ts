import { prisma } from "@/lib/prisma";
import type { SessionRole } from "@/lib/auth";

// Locations/Schedule are owned by the Doctor; an Assistant manages them on the linked Doctor's behalf
export async function getDoctorIdForUser(
  userId: string,
  role: SessionRole,
): Promise<string | null> {
  if (role === "DOCTOR") {
    const doctor = await prisma.doctor.findUnique({ where: { userId } });
    return doctor?.id ?? null;
  }

  if (role === "ASSISTANT") {
    const assistant = await prisma.assistant.findUnique({ where: { userId } });
    return assistant?.doctorId ?? null;
  }

  return null;
}

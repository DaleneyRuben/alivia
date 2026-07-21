import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Locations are structural/sensitive: Doctor-only, unlike Schedule which an Assistant can also manage
export async function requireDoctorOnlyId(): Promise<string> {
  const session = await auth();
  if (!session) throw new Error("Not authenticated");
  if (session.user.role !== "DOCTOR") throw new Error("Not authorized");

  const doctor = await prisma.doctor.findUnique({
    where: { userId: session.user.id },
  });
  if (!doctor) throw new Error("Not authorized");

  return doctor.id;
}

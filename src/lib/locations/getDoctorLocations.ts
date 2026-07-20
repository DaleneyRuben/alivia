import { prisma } from "@/lib/prisma";

export async function getDoctorLocations(doctorId: string) {
  return prisma.location.findMany({
    where: { doctorId, deletedAt: null },
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { scheduleBlocks: true } } },
  });
}

export type DoctorLocation = Awaited<
  ReturnType<typeof getDoctorLocations>
>[number];

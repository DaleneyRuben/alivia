import { prisma } from "@/lib/prisma";

export async function getLocationsWithSchedule(doctorId: string) {
  return prisma.location.findMany({
    where: { doctorId, deletedAt: null },
    orderBy: { createdAt: "asc" },
    include: { scheduleBlocks: { orderBy: { startMinutes: "asc" } } },
  });
}

export type LocationWithSchedule = Awaited<
  ReturnType<typeof getLocationsWithSchedule>
>[number];

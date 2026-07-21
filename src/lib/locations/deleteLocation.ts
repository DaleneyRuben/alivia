"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireDoctorOnlyId } from "@/lib/auth/requireDoctorOnlyId";

// Removing a Location stops it generating availability: its Schedule blocks are
// deleted outright, while the Location itself is only soft-deleted so past
// Appointments still resolve to it.
export async function deleteLocation(locationId: string) {
  const doctorId = await requireDoctorOnlyId();

  const location = await prisma.location.findUnique({
    where: { id: locationId },
  });
  if (!location || location.doctorId !== doctorId) {
    throw new Error("Not authorized");
  }

  await prisma.$transaction([
    prisma.scheduleBlock.deleteMany({ where: { locationId } }),
    prisma.location.update({
      where: { id: locationId },
      data: { deletedAt: new Date() },
    }),
  ]);

  revalidatePath("/panel/locations");
  revalidatePath("/panel/schedule");
}

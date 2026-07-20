"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireDoctorId } from "./requireDoctorId";

export async function deleteScheduleBlock(blockId: string) {
  const doctorId = await requireDoctorId();

  const block = await prisma.scheduleBlock.findUnique({
    where: { id: blockId },
    include: { location: true },
  });
  if (!block || block.location.doctorId !== doctorId) {
    throw new Error("Not authorized");
  }

  await prisma.scheduleBlock.delete({ where: { id: blockId } });

  revalidatePath("/panel/schedule");
}

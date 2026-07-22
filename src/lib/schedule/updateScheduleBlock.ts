"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireDoctorId } from "./requireDoctorId";
import {
  isValidScheduleBlockInput,
  type ScheduleBlockInput,
} from "./isValidScheduleBlockInput";
import { scheduleBlocksOverlap } from "./scheduleBlocksOverlap";

export interface UpdateScheduleBlockInput extends ScheduleBlockInput {
  blockId: string;
}

export async function updateScheduleBlock(input: UpdateScheduleBlockInput) {
  const doctorId = await requireDoctorId();
  if (!isValidScheduleBlockInput(input)) throw new Error("Invalid block");

  const block = await prisma.scheduleBlock.findUnique({
    where: { id: input.blockId },
    include: { location: true },
  });
  if (!block || block.location.doctorId !== doctorId) {
    throw new Error("Not authorized");
  }

  const otherBlocks = await prisma.scheduleBlock.findMany({
    where: { location: { doctorId }, id: { not: input.blockId } },
    include: { location: true },
  });
  const conflict = otherBlocks.find((other) =>
    scheduleBlocksOverlap(input, other),
  );
  if (conflict) {
    throw new Error(
      `Ya tienes un horario en ${conflict.location.name} que se cruza con este bloque.`,
    );
  }

  await prisma.scheduleBlock.update({
    where: { id: input.blockId },
    data: {
      weekdays: input.weekdays,
      startMinutes: input.startMinutes,
      endMinutes: input.endMinutes,
      slotDurationMinutes: input.slotDurationMinutes,
      slotCapacity: input.slotCapacity,
    },
  });

  revalidatePath("/panel/schedule");
}

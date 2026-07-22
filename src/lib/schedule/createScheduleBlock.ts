"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireDoctorId } from "./requireDoctorId";
import {
  isValidScheduleBlockInput,
  type ScheduleBlockInput,
} from "./isValidScheduleBlockInput";
import { scheduleBlocksOverlap } from "./scheduleBlocksOverlap";

export interface CreateScheduleBlockInput extends ScheduleBlockInput {
  locationId: string;
}

export async function createScheduleBlock(input: CreateScheduleBlockInput) {
  const doctorId = await requireDoctorId();
  if (!isValidScheduleBlockInput(input)) throw new Error("Invalid block");

  const location = await prisma.location.findUnique({
    where: { id: input.locationId },
  });
  if (!location || location.doctorId !== doctorId) {
    throw new Error("Not authorized");
  }

  const otherBlocks = await prisma.scheduleBlock.findMany({
    where: { location: { doctorId } },
    include: { location: true },
  });
  const conflict = otherBlocks.find((block) =>
    scheduleBlocksOverlap(input, block),
  );
  if (conflict) {
    throw new Error(
      `Ya tienes un horario en ${conflict.location.name} que se cruza con este bloque.`,
    );
  }

  await prisma.scheduleBlock.create({
    data: {
      locationId: input.locationId,
      weekdays: input.weekdays,
      startMinutes: input.startMinutes,
      endMinutes: input.endMinutes,
      slotDurationMinutes: input.slotDurationMinutes,
      slotCapacity: input.slotCapacity,
    },
  });

  revalidatePath("/panel/schedule");
}

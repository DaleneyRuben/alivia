"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireDoctorId } from "./requireDoctorId";
import {
  isValidScheduleBlockInput,
  type ScheduleBlockInput,
} from "./isValidScheduleBlockInput";

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

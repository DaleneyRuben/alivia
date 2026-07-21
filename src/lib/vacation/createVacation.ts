"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireDoctorId } from "@/lib/schedule/requireDoctorId";
import {
  isValidVacationInput,
  type VacationInput,
} from "@/lib/vacation/isValidVacationInput";

export async function createVacation(input: VacationInput) {
  const doctorId = await requireDoctorId();

  if (!isValidVacationInput(input)) {
    throw new Error("Invalid vacation input");
  }

  if (input.locationId) {
    const location = await prisma.location.findUnique({
      where: { id: input.locationId },
    });
    if (!location || location.doctorId !== doctorId || location.deletedAt) {
      throw new Error("Not authorized");
    }
  }

  await prisma.vacation.create({
    data: {
      doctorId,
      locationId: input.locationId,
      startDate: new Date(`${input.startDate}T00:00:00.000Z`),
      endDate: new Date(`${input.endDate}T00:00:00.000Z`),
    },
  });

  revalidatePath("/panel/vacation");
}

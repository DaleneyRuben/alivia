"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireDoctorId } from "@/lib/schedule/requireDoctorId";
import {
  isValidVacationInput,
  type VacationInput,
} from "@/lib/vacation/isValidVacationInput";
import { vacationsOverlap } from "@/lib/vacation/vacationsOverlap";

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

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

  const otherVacations = await prisma.vacation.findMany({
    where: { doctorId },
    include: { location: true },
  });
  const conflict = otherVacations.find((vacation) =>
    vacationsOverlap(input, {
      locationId: vacation.locationId,
      startDate: toIsoDate(vacation.startDate),
      endDate: toIsoDate(vacation.endDate),
    }),
  );
  if (conflict) {
    const locationLabel = conflict.location?.name ?? "todas las ubicaciones";
    throw new Error(
      `Ya tienes vacaciones registradas en ${locationLabel} que se cruzan con este periodo.`,
    );
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

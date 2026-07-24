"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireDoctorId } from "@/lib/schedule/requireDoctorId";
import { getLaPazDateString } from "@/lib/time/getLaPazDateString";
import {
  isValidVacationInput,
  type VacationInput,
} from "@/lib/vacation/isValidVacationInput";
import { isVacationRemovable } from "@/lib/vacation/isVacationRemovable";
import { vacationsOverlap } from "@/lib/vacation/vacationsOverlap";

export interface UpdateVacationInput extends VacationInput {
  vacationId: string;
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export async function updateVacation(input: UpdateVacationInput) {
  const doctorId = await requireDoctorId();

  if (!isValidVacationInput(input)) {
    throw new Error("Invalid vacation input");
  }

  const vacation = await prisma.vacation.findUnique({
    where: { id: input.vacationId },
  });
  if (!vacation || vacation.doctorId !== doctorId) {
    throw new Error("Not authorized");
  }

  const today = getLaPazDateString();
  if (!isVacationRemovable(toIsoDate(vacation.startDate), today)) {
    throw new Error("Vacation period has already started");
  }

  const otherVacations = await prisma.vacation.findMany({
    where: { doctorId, id: { not: input.vacationId } },
    include: { location: true },
  });
  const conflict = otherVacations.find((other) =>
    vacationsOverlap(input, {
      locationId: other.locationId,
      startDate: toIsoDate(other.startDate),
      endDate: toIsoDate(other.endDate),
    }),
  );
  if (conflict) {
    const locationLabel = conflict.location?.name ?? "todas las ubicaciones";
    throw new Error(
      `Ya tienes vacaciones registradas en ${locationLabel} que se cruzan con este periodo.`,
    );
  }

  await prisma.vacation.update({
    where: { id: input.vacationId },
    data: {
      locationId: input.locationId,
      startDate: new Date(`${input.startDate}T00:00:00.000Z`),
      endDate: new Date(`${input.endDate}T00:00:00.000Z`),
    },
  });

  revalidatePath("/panel/vacation");
}

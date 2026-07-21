"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireDoctorId } from "@/lib/schedule/requireDoctorId";
import { getLaPazDateString } from "@/lib/time/getLaPazDateString";
import { isVacationRemovable } from "@/lib/vacation/isVacationRemovable";

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// "Quitar (before it starts)" (docs/flows/doctor-assistant-panel.md §7)
export async function deleteVacation(vacationId: string) {
  const doctorId = await requireDoctorId();

  const vacation = await prisma.vacation.findUnique({
    where: { id: vacationId },
  });
  if (!vacation || vacation.doctorId !== doctorId) {
    throw new Error("Not authorized");
  }

  const today = getLaPazDateString();
  if (!isVacationRemovable(toIsoDate(vacation.startDate), today)) {
    throw new Error("Vacation period has already started");
  }

  await prisma.vacation.delete({ where: { id: vacationId } });

  revalidatePath("/panel/vacation");
}

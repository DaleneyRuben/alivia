"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireDoctorId } from "@/lib/schedule/requireDoctorId";

// day-before check, only meaningful while the Appointment is still SCHEDULED
// (docs/flows/domain-lifecycles.md §1: Confirmation is a sub-state of Scheduled)
export async function confirmAppointment(appointmentId: string) {
  const doctorId = await requireDoctorId();

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });
  if (!appointment || appointment.doctorId !== doctorId) {
    throw new Error("Not authorized");
  }
  if (appointment.status !== "SCHEDULED") {
    throw new Error("Appointment is no longer pending");
  }

  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { confirmation: "CONFIRMED" },
  });

  revalidatePath("/panel/confirmations");
}

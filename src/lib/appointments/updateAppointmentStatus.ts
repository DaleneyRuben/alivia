"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireDoctorId } from "@/lib/schedule/requireDoctorId";
import { laPazDateTimeToUtc } from "@/lib/time/laPazDateTimeToUtc";

type TerminalStatus = "ATTENDED" | "NO_SHOW" | "CANCELLED";

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// Asistió / No asistió / Cancelar — only valid while the Appointment is still
// SCHEDULED (docs/flows/domain-lifecycles.md §1: these are final states).
export async function updateAppointmentStatus(
  appointmentId: string,
  status: TerminalStatus,
) {
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
  // Cancelar is unaffected — cancelling a future appointment is normal
  // (a patient calling ahead), unlike Asistió/No asistió which describe
  // what happened at a visit that hasn't occurred yet.
  if (status !== "CANCELLED") {
    const hasPassed =
      laPazDateTimeToUtc(
        toIsoDate(appointment.date),
        appointment.startMinutes,
      ).getTime() <= Date.now();
    if (!hasPassed) {
      throw new Error("Appointment time hasn't passed yet");
    }
  }

  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status },
  });

  revalidatePath("/panel/appointments");
  revalidatePath("/panel/confirmations");
}

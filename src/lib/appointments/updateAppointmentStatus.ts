"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireDoctorId } from "@/lib/schedule/requireDoctorId";

type TerminalStatus = "ATTENDED" | "NO_SHOW" | "CANCELLED";

// Atendió / No asistió / Cancelar — only valid while the Appointment is still
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

  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status },
  });

  revalidatePath("/panel/appointments");
  revalidatePath("/panel/confirmations");
}

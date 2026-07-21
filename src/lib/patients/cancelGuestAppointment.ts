"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

// Reached from the patient's own cancel link — token-scoped, no login
// (ADR-0006). Frees the Slot by moving the Appointment to CANCELLED.
export async function cancelGuestAppointment(cancelToken: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { cancelToken },
  });
  if (!appointment) throw new Error("Not found");

  if (appointment.status === "SCHEDULED") {
    await prisma.appointment.update({
      where: { cancelToken },
      data: { status: "CANCELLED" },
    });
  }

  revalidatePath(`/cancel/${cancelToken}`);
}

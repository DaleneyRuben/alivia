"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireDoctorId } from "@/lib/schedule/requireDoctorId";
import {
  isValidManualAppointmentInput,
  type ManualAppointmentInput,
} from "./isValidManualAppointmentInput";

// Manual add — for patients who called or walked in outside the platform
// (docs/flows/doctor-assistant-panel.md §4). May exceed the Slot's capacity;
// that override is decided client-side, this action just records it.
export async function createManualAppointment(input: ManualAppointmentInput) {
  const doctorId = await requireDoctorId();

  if (!isValidManualAppointmentInput(input)) {
    throw new Error("Invalid input");
  }

  const location = await prisma.location.findUnique({
    where: { id: input.locationId },
  });
  if (!location || location.doctorId !== doctorId || location.deletedAt) {
    throw new Error("Not authorized");
  }

  const name = input.patientName.trim();
  const phone = input.patientPhone.trim();

  const patient = await prisma.patient.upsert({
    where: { doctorId_phone: { doctorId, phone } },
    update: { name },
    create: { doctorId, name, phone },
  });

  await prisma.appointment.create({
    data: {
      doctorId,
      locationId: input.locationId,
      patientId: patient.id,
      date: new Date(`${input.date}T00:00:00.000Z`),
      startMinutes: input.startMinutes,
      endMinutes: input.endMinutes,
      source: "STAFF",
    },
  });

  revalidatePath("/panel/appointments");
}

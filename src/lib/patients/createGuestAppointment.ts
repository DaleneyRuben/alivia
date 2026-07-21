"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getBookingSummary } from "./getBookingSummary";
import {
  isValidGuestBookingInput,
  type GuestBookingInput,
} from "./isValidGuestBookingInput";

export interface CreateGuestAppointmentInput extends GuestBookingInput {
  doctorId: string;
  locationId: string;
  date: string;
  startMinutes: number;
}

// Guest booking — no account, just name + phone (ADR-0006). Re-checks the
// Slot's capacity server-side since the profile page's copy can be stale.
export async function createGuestAppointment(
  input: CreateGuestAppointmentInput,
) {
  if (!isValidGuestBookingInput(input)) {
    throw new Error("Invalid input");
  }

  const summary = await getBookingSummary(input);
  if (!summary || !summary.isAvailable) {
    throw new Error("Slot is no longer available");
  }

  const name = input.name.trim();
  const phone = input.phone.trim();

  const patient = await prisma.patient.upsert({
    where: { doctorId_phone: { doctorId: input.doctorId, phone } },
    update: { name },
    create: { doctorId: input.doctorId, name, phone },
  });

  const appointment = await prisma.appointment.create({
    data: {
      doctorId: input.doctorId,
      locationId: input.locationId,
      patientId: patient.id,
      date: new Date(`${input.date}T00:00:00.000Z`),
      startMinutes: input.startMinutes,
      endMinutes: summary.endMinutes,
      source: "PATIENT",
    },
  });

  redirect(`/confirmation/${appointment.cancelToken}`);
}

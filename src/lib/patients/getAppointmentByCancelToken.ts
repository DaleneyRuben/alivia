import { prisma } from "@/lib/prisma";
import type { AppointmentStatus } from "@/generated/prisma/client";

export interface TokenAppointment {
  id: string;
  cancelToken: string;
  status: AppointmentStatus;
  date: string;
  startMinutes: number;
  endMinutes: number;
  doctorName: string;
  specialty: string;
  locationName: string;
  patientName: string;
  patientPhone: string;
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// Public, token-scoped lookup — reached from the guest's WhatsApp confirmation
// link, no login (ADR-0006). Confirmation + cancel pages both use this.
export async function getAppointmentByCancelToken(
  cancelToken: string,
): Promise<TokenAppointment | null> {
  const appointment = await prisma.appointment.findUnique({
    where: { cancelToken },
    include: { doctor: true, location: true, patient: true },
  });
  if (!appointment) return null;

  return {
    id: appointment.id,
    cancelToken: appointment.cancelToken,
    status: appointment.status,
    date: toIsoDate(appointment.date),
    startMinutes: appointment.startMinutes,
    endMinutes: appointment.endMinutes,
    doctorName: appointment.doctor.name,
    specialty: appointment.doctor.specialty,
    locationName: appointment.location.name,
    patientName: appointment.patient.name,
    patientPhone: appointment.patient.phone,
  };
}

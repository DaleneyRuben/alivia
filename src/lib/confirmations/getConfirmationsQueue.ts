import { prisma } from "@/lib/prisma";
import type {
  AppointmentStatus,
  ConfirmationStatus,
} from "@/generated/prisma/client";
import { getLaPazDateString } from "@/lib/time/getLaPazDateString";
import { addDaysToIsoDate } from "@/lib/time/addDaysToIsoDate";
import { buildConfirmationMessage } from "@/lib/confirmations/buildConfirmationMessage";
import { buildWhatsAppLink } from "@/lib/whatsapp/buildWhatsAppLink";

export interface ConfirmationRow {
  id: string;
  startMinutes: number;
  patientName: string;
  patientPhone: string;
  status: AppointmentStatus;
  confirmationStatus: ConfirmationStatus;
  whatsAppUrl: string;
}

export interface ConfirmationsQueueData {
  tomorrow: string;
  confirmations: ConfirmationRow[];
}

// Confirmations only ever cover tomorrow, across all Locations (docs/flows/doctor-assistant-panel.md §5)
export async function getConfirmationsQueue(
  doctorId: string,
): Promise<ConfirmationsQueueData> {
  const tomorrow = addDaysToIsoDate(getLaPazDateString(), 1);

  const [doctor, appointmentRows] = await Promise.all([
    prisma.doctor.findUniqueOrThrow({ where: { id: doctorId } }),
    prisma.appointment.findMany({
      where: { doctorId, date: new Date(`${tomorrow}T00:00:00.000Z`) },
      include: { patient: true },
      orderBy: { startMinutes: "asc" },
    }),
  ]);

  const confirmations: ConfirmationRow[] = appointmentRows.map(
    (appointment) => ({
      id: appointment.id,
      startMinutes: appointment.startMinutes,
      patientName: appointment.patient.name,
      patientPhone: appointment.patient.phone,
      status: appointment.status,
      confirmationStatus: appointment.confirmation,
      whatsAppUrl: buildWhatsAppLink({
        phone: appointment.patient.phone,
        message: buildConfirmationMessage({
          doctorName: doctor.name,
          patientName: appointment.patient.name,
          date: tomorrow,
          startMinutes: appointment.startMinutes,
        }),
      }),
    }),
  );

  return { tomorrow, confirmations };
}

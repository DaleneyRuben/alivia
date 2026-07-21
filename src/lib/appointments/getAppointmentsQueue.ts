import { prisma } from "@/lib/prisma";
import type {
  AppointmentSource,
  AppointmentStatus,
} from "@/generated/prisma/client";
import { getLocationsWithSchedule } from "@/lib/schedule/getLocationsWithSchedule";
import { getAvailableSlots } from "@/lib/slots/getAvailableSlots";
import { getLaPazDateString } from "@/lib/time/getLaPazDateString";
import { addDaysToIsoDate } from "@/lib/time/addDaysToIsoDate";

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export interface QueueAppointment {
  id: string;
  locationId: string;
  date: string;
  startMinutes: number;
  endMinutes: number;
  status: AppointmentStatus;
  source: AppointmentSource;
  patientName: string;
  patientPhone: string;
}

export interface QueueSlot {
  locationId: string;
  date: string;
  startMinutes: number;
  endMinutes: number;
  capacity: number;
  bookedCount: number;
  availableToPatients: boolean;
}

export interface AppointmentsQueueData {
  today: string;
  tomorrow: string;
  locations: { id: string; name: string }[];
  appointments: QueueAppointment[];
  slots: QueueSlot[];
}

// Today/tomorrow — the only two days the Citas queue shows (docs/flows/doctor-assistant-panel.md §4)
export async function getAppointmentsQueue(
  doctorId: string,
): Promise<AppointmentsQueueData> {
  const today = getLaPazDateString();
  const tomorrow = addDaysToIsoDate(today, 1);

  const locations = await getLocationsWithSchedule(doctorId);

  const [appointmentRows, vacationRows] = await Promise.all([
    prisma.appointment.findMany({
      where: {
        doctorId,
        date: {
          gte: new Date(`${today}T00:00:00.000Z`),
          lte: new Date(`${tomorrow}T00:00:00.000Z`),
        },
      },
      include: { patient: true },
      orderBy: { startMinutes: "asc" },
    }),
    prisma.vacation.findMany({ where: { doctorId } }),
  ]);

  const appointments: QueueAppointment[] = appointmentRows.map(
    (appointment) => ({
      id: appointment.id,
      locationId: appointment.locationId,
      date: toIsoDate(appointment.date),
      startMinutes: appointment.startMinutes,
      endMinutes: appointment.endMinutes,
      status: appointment.status,
      source: appointment.source,
      patientName: appointment.patient.name,
      patientPhone: appointment.patient.phone,
    }),
  );

  const blocks = locations.flatMap((location) =>
    location.scheduleBlocks.map((block) => ({
      locationId: location.id,
      weekdays: block.weekdays,
      startMinutes: block.startMinutes,
      endMinutes: block.endMinutes,
      slotDurationMinutes: block.slotDurationMinutes,
      slotCapacity: block.slotCapacity,
    })),
  );

  const vacations = vacationRows.map((vacation) => ({
    locationId: vacation.locationId,
    startDate: toIsoDate(vacation.startDate),
    endDate: toIsoDate(vacation.endDate),
  }));

  const slots: QueueSlot[] = getAvailableSlots({
    blocks,
    vacations,
    appointments: appointments.map((appointment) => ({
      locationId: appointment.locationId,
      date: appointment.date,
      startMinutes: appointment.startMinutes,
      status: appointment.status,
    })),
    from: today,
    to: tomorrow,
  });

  return {
    today,
    tomorrow,
    locations: locations.map((location) => ({
      id: location.id,
      name: location.name,
    })),
    appointments,
    slots,
  };
}

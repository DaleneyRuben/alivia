import {
  generateSlotsForDate,
  type GeneratedSlot,
  type ScheduleBlockInput,
} from "./generateSlotsForDate";
import { isDateOnVacation, type VacationInput } from "./isDateOnVacation";

export interface AppointmentInput {
  locationId: string;
  // ISO date string (YYYY-MM-DD)
  date: string;
  startMinutes: number;
  status: "SCHEDULED" | "ATTENDED" | "NO_SHOW" | "CANCELLED";
}

export interface AvailableSlot extends GeneratedSlot {
  bookedCount: number;
  // capacity is a hard cap for patient self-booking only (ADR-0009) —
  // full slots stay in the list so the UI can show them struck-through
  availableToPatients: boolean;
}

interface GetAvailableSlotsParams {
  blocks: ScheduleBlockInput[];
  vacations: VacationInput[];
  appointments: AppointmentInput[];
  from: string;
  to: string;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function eachDateInRange(from: string, to: string): string[] {
  const dates: string[] = [];
  for (
    let ms = Date.parse(`${from}T00:00:00Z`);
    ms <= Date.parse(`${to}T00:00:00Z`);
    ms += DAY_MS
  ) {
    dates.push(new Date(ms).toISOString().slice(0, 10));
  }
  return dates;
}

export function getAvailableSlots({
  blocks,
  vacations,
  appointments,
  from,
  to,
}: GetAvailableSlotsParams): AvailableSlot[] {
  const slots: AvailableSlot[] = [];

  for (const date of eachDateInRange(from, to)) {
    for (const slot of generateSlotsForDate(blocks, date)) {
      if (isDateOnVacation(date, slot.locationId, vacations)) continue;

      const bookedCount = appointments.filter(
        (appointment) =>
          appointment.status !== "CANCELLED" &&
          appointment.locationId === slot.locationId &&
          appointment.date === slot.date &&
          appointment.startMinutes === slot.startMinutes,
      ).length;

      slots.push({
        ...slot,
        bookedCount,
        availableToPatients: bookedCount < slot.capacity,
      });
    }
  }

  return slots.sort(
    (a, b) =>
      a.date.localeCompare(b.date) ||
      a.startMinutes - b.startMinutes ||
      a.locationId.localeCompare(b.locationId),
  );
}

import {
  generateSlotsForDate,
  type GeneratedSlot,
  type ScheduleBlockInput,
} from "./generateSlotsForDate";
import { isDateOnVacation, type VacationInput } from "./isDateOnVacation";
import { laPazDateTimeToUtc } from "@/lib/time/laPazDateTimeToUtc";

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
  // starts inside minLeadMinutes of `now` — distinct from a full slot so the
  // UI can style each reason differently (finding #4)
  tooSoon: boolean;
}

interface GetAvailableSlotsParams {
  blocks: ScheduleBlockInput[];
  vacations: VacationInput[];
  appointments: AppointmentInput[];
  from: string;
  to: string;
  // when omitted, no lead-time cutoff is applied — used by staff's
  // ManualAppointmentForm path, which must stay unaffected (finding #4)
  minLeadMinutes?: number;
  now?: Date;
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
  minLeadMinutes,
  now,
}: GetAvailableSlotsParams): AvailableSlot[] {
  const slots: AvailableSlot[] = [];
  const cutoffMs =
    minLeadMinutes === undefined
      ? null
      : (now ?? new Date()).getTime() + minLeadMinutes * 60 * 1000;

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

      const tooSoon =
        cutoffMs !== null &&
        laPazDateTimeToUtc(slot.date, slot.startMinutes).getTime() < cutoffMs;

      slots.push({
        ...slot,
        bookedCount,
        tooSoon,
        availableToPatients: !tooSoon && bookedCount < slot.capacity,
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

import { formatSpanishDate } from "@/lib/time/formatSpanishDate";
import { formatMinutes } from "@/lib/schedule/formatTimeRange";

export interface BuildBookingConfirmationMessageInput {
  doctorName: string;
  locationName: string;
  date: string;
  startMinutes: number;
}

function lowercaseFirst(text: string): string {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

// self-send confirmation — a manual wa.me link, no automation (ADR-0003)
export function buildBookingConfirmationMessage({
  doctorName,
  locationName,
  date,
  startMinutes,
}: BuildBookingConfirmationMessageInput): string {
  const dateLabel = lowercaseFirst(formatSpanishDate(date));
  const time = formatMinutes(startMinutes);

  return `Hola, confirmo mi cita con ${doctorName} el ${dateLabel} a las ${time} en ${locationName}.`;
}

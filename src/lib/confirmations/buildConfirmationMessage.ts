import { formatSpanishDate } from "@/lib/time/formatSpanishDate";
import { formatMinutes } from "@/lib/schedule/formatTimeRange";

export interface BuildConfirmationMessageInput {
  doctorName: string;
  patientName: string;
  date: string;
  startMinutes: number;
}

function lowercaseFirst(text: string): string {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

// day-before reminder, sent as a manual wa.me link (ADR-0003)
export function buildConfirmationMessage({
  doctorName,
  patientName,
  date,
  startMinutes,
}: BuildConfirmationMessageInput): string {
  const firstName = patientName.trim().split(/\s+/)[0];
  const dateLabel = lowercaseFirst(formatSpanishDate(date));
  const time = formatMinutes(startMinutes);

  return `Hola ${firstName}, le recordamos su cita con ${doctorName} mañana ${dateLabel} a las ${time}. ¿Podrá asistir?`;
}

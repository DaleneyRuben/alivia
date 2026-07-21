import { formatMinutes } from "@/lib/schedule/formatTimeRange";
import { formatSpanishDate } from "@/lib/time/formatSpanishDate";

export function formatNextAvailableLabel(
  slot: { date: string; startMinutes: number } | null,
  today: string,
  tomorrow: string,
): string {
  if (!slot) return "Sin cupos por ahora";
  const day =
    slot.date === today
      ? "Hoy"
      : slot.date === tomorrow
        ? "Mañana"
        : formatSpanishDate(slot.date).split(" ")[0];
  return `${day} ${formatMinutes(slot.startMinutes)}`;
}

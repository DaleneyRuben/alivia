import {
  formatShortSpanishDate,
  shortSpanishDateParts,
} from "./formatShortSpanishDate";

// "15–22 jul 2026" style range for the Vacaciones list (design/Alivia Panel Prototype.dc.html)
export function formatVacationRange(
  startDate: string,
  endDate: string,
): string {
  const start = shortSpanishDateParts(startDate);
  const end = shortSpanishDateParts(endDate);

  if (startDate === endDate) {
    return formatShortSpanishDate(startDate);
  }

  if (start.year !== end.year) {
    return `${start.day} ${start.month} ${start.year} – ${end.day} ${end.month} ${end.year}`;
  }

  if (start.month !== end.month) {
    return `${start.day} ${start.month} – ${end.day} ${end.month} ${end.year}`;
  }

  return `${start.day}–${end.day} ${end.month} ${end.year}`;
}

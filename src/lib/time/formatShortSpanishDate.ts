const SHORT_MONTHS = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

export function shortSpanishDateParts(date: string) {
  const d = new Date(`${date}T00:00:00Z`);
  return {
    day: d.getUTCDate(),
    month: SHORT_MONTHS[d.getUTCMonth()],
    year: d.getUTCFullYear(),
  };
}

// "15 jul 2026" style single-date label, shared by Vacaciones and Historia clínica
export function formatShortSpanishDate(date: string): string {
  const { day, month, year } = shortSpanishDateParts(date);
  return `${day} ${month} ${year}`;
}

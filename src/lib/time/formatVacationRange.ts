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

function parts(date: string) {
  const d = new Date(`${date}T00:00:00Z`);
  return {
    day: d.getUTCDate(),
    month: SHORT_MONTHS[d.getUTCMonth()],
    year: d.getUTCFullYear(),
  };
}

// "15–22 jul 2026" style range for the Vacaciones list (design/Alivia Panel Prototype.dc.html)
export function formatVacationRange(
  startDate: string,
  endDate: string,
): string {
  const start = parts(startDate);
  const end = parts(endDate);

  if (startDate === endDate) {
    return `${start.day} ${start.month} ${start.year}`;
  }

  if (start.year !== end.year) {
    return `${start.day} ${start.month} ${start.year} – ${end.day} ${end.month} ${end.year}`;
  }

  if (start.month !== end.month) {
    return `${start.day} ${start.month} – ${end.day} ${end.month} ${end.year}`;
  }

  return `${start.day}–${end.day} ${end.month} ${end.year}`;
}

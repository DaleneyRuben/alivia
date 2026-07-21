const LONG_MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

// "1 de agosto de 2026" style label for the Subscription renewal date
export function formatLongSpanishDate(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  const day = d.getUTCDate();
  const month = LONG_MONTHS[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  return `${day} de ${month} de ${year}`;
}

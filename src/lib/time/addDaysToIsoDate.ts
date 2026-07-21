const DAY_MS = 24 * 60 * 60 * 1000;

export function addDaysToIsoDate(date: string, days: number): string {
  const ms = Date.parse(`${date}T00:00:00Z`) + days * DAY_MS;
  return new Date(ms).toISOString().slice(0, 10);
}

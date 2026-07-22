const LA_PAZ_OFFSET_MINUTES = 4 * 60;

// Mirrors src/lib/time/getLaPazDateString.ts — duplicated because the seed
// script runs outside the app's module graph (separate tsx entrypoint).
export function laPazToday(now: Date = new Date()): string {
  const laPazMs = now.getTime() - LA_PAZ_OFFSET_MINUTES * 60 * 1000;
  return new Date(laPazMs).toISOString().slice(0, 10);
}

export function addDaysIso(iso: string, days: number): string {
  const date = new Date(`${iso}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function isoToDate(iso: string): Date {
  return new Date(`${iso}T00:00:00.000Z`);
}

export function monthsAgo(n: number): Date {
  const date = new Date();
  date.setMonth(date.getMonth() - n);
  return date;
}

export function daysFromNow(n: number): Date {
  return new Date(Date.now() + n * 24 * 60 * 60 * 1000);
}

export function toMinutes(hours: number, minutes = 0): number {
  return hours * 60 + minutes;
}

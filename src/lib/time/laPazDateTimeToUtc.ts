const LA_PAZ_OFFSET_MINUTES = 4 * 60;

export function laPazDateTimeToUtc(date: string, minutesOfDay: number): Date {
  const utcMs =
    Date.parse(`${date}T00:00:00.000Z`) +
    LA_PAZ_OFFSET_MINUTES * 60 * 1000 +
    minutesOfDay * 60 * 1000;
  return new Date(utcMs);
}

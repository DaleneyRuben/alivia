export function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

export function formatTimeRange(
  startMinutes: number,
  endMinutes: number,
): string {
  return `${formatMinutes(startMinutes)}-${formatMinutes(endMinutes)}`;
}

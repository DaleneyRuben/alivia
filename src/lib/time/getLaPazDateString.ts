const LA_PAZ_OFFSET_MINUTES = 4 * 60;

export function getLaPazDateString(now: Date = new Date()): string {
  const laPazMs = now.getTime() - LA_PAZ_OFFSET_MINUTES * 60 * 1000;
  return new Date(laPazMs).toISOString().slice(0, 10);
}

export interface AvailabilityRankedDoctor {
  soonestSlot: { date: string; startMinutes: number } | null;
}

function rank(doctor: AvailabilityRankedDoctor): number | null {
  if (!doctor.soonestSlot) return null;
  const { date, startMinutes } = doctor.soonestSlot;
  const days = Math.floor(Date.parse(`${date}T00:00:00Z`) / 86_400_000);
  return days * 10_000 + startMinutes;
}

// Ascending by soonest available Slot — today's before tomorrow's (ADR-0008)
export function compareDoctorsByAvailability(
  a: AvailabilityRankedDoctor,
  b: AvailabilityRankedDoctor,
): number {
  const rankA = rank(a);
  const rankB = rank(b);
  if (rankA === null && rankB === null) return 0;
  if (rankA === null) return 1;
  if (rankB === null) return -1;
  return rankA - rankB;
}

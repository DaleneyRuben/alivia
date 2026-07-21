export interface VacationInput {
  // null = the whole practice is away, matching the Vacation model
  locationId: string | null;
  startDate: string;
  endDate: string;
}

export function isValidVacationInput({
  startDate,
  endDate,
}: VacationInput): boolean {
  if (startDate.trim().length === 0) return false;
  if (endDate.trim().length === 0) return false;
  return startDate <= endDate;
}

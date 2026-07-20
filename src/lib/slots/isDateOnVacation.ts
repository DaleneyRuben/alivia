export interface VacationInput {
  // null = the whole practice is away, matching the Vacation model
  locationId: string | null;
  // ISO date strings (YYYY-MM-DD), inclusive on both ends
  startDate: string;
  endDate: string;
}

export function isDateOnVacation(
  date: string,
  locationId: string,
  vacations: VacationInput[],
): boolean {
  return vacations.some(
    (vacation) =>
      (vacation.locationId === null || vacation.locationId === locationId) &&
      vacation.startDate <= date &&
      date <= vacation.endDate,
  );
}

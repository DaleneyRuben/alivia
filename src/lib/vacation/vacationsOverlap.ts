export interface OverlapCheckVacation {
  // null = the whole practice, matching the Vacation model
  locationId: string | null;
  startDate: string;
  endDate: string;
}

export function vacationsOverlap(
  a: OverlapCheckVacation,
  b: OverlapCheckVacation,
): boolean {
  const sharesLocation =
    a.locationId === null ||
    b.locationId === null ||
    a.locationId === b.locationId;
  if (!sharesLocation) return false;

  return a.startDate <= b.endDate && b.startDate <= a.endDate;
}

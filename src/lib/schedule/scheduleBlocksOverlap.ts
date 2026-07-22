export interface OverlapCheckBlock {
  weekdays: number[];
  startMinutes: number;
  endMinutes: number;
}

export function scheduleBlocksOverlap(
  a: OverlapCheckBlock,
  b: OverlapCheckBlock,
): boolean {
  const sharesWeekday = a.weekdays.some((day) => b.weekdays.includes(day));
  if (!sharesWeekday) return false;

  return a.startMinutes < b.endMinutes && b.startMinutes < a.endMinutes;
}

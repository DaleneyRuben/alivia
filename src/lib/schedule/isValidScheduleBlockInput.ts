export interface ScheduleBlockInput {
  weekdays: number[];
  startMinutes: number;
  endMinutes: number;
  slotDurationMinutes: number;
  slotCapacity: number;
}

export function isValidScheduleBlockInput({
  weekdays,
  startMinutes,
  endMinutes,
  slotDurationMinutes,
  slotCapacity,
}: ScheduleBlockInput): boolean {
  if (weekdays.length === 0) return false;
  if (endMinutes <= startMinutes) return false;
  if (slotDurationMinutes <= 0) return false;
  if (slotDurationMinutes > endMinutes - startMinutes) return false;
  if (slotCapacity < 1) return false;
  return true;
}

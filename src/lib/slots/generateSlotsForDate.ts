export interface ScheduleBlockInput {
  locationId: string;
  // 0 = Sunday … 6 = Saturday, matching the ScheduleBlock model
  weekdays: number[];
  startMinutes: number;
  endMinutes: number;
  slotDurationMinutes: number;
  slotCapacity: number;
}

export interface GeneratedSlot {
  locationId: string;
  // ISO date string (YYYY-MM-DD)
  date: string;
  startMinutes: number;
  endMinutes: number;
  capacity: number;
}

export function generateSlotsForDate(
  blocks: ScheduleBlockInput[],
  date: string,
): GeneratedSlot[] {
  const weekday = new Date(`${date}T00:00:00Z`).getUTCDay();

  return blocks
    .filter(
      (block) =>
        block.weekdays.includes(weekday) && block.slotDurationMinutes > 0,
    )
    .flatMap((block) => {
      const slots: GeneratedSlot[] = [];
      for (
        let start = block.startMinutes;
        start + block.slotDurationMinutes <= block.endMinutes;
        start += block.slotDurationMinutes
      ) {
        slots.push({
          locationId: block.locationId,
          date,
          startMinutes: start,
          endMinutes: start + block.slotDurationMinutes,
          capacity: block.slotCapacity,
        });
      }
      return slots;
    });
}

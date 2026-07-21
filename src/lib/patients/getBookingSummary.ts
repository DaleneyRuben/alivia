import { prisma } from "@/lib/prisma";
import { generateSlotsForDate } from "@/lib/slots/generateSlotsForDate";
import { isDateOnVacation } from "@/lib/slots/isDateOnVacation";

export interface BookingSummaryInput {
  doctorId: string;
  locationId: string;
  date: string;
  startMinutes: number;
}

export interface BookingSummary {
  doctorId: string;
  doctorName: string;
  locationId: string;
  locationName: string;
  date: string;
  startMinutes: number;
  endMinutes: number;
  isAvailable: boolean;
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// Re-derives the Slot from the Schedule (not stored) and re-checks capacity —
// the booking page's read of a Slot the patient picked on the profile page.
export async function getBookingSummary({
  doctorId,
  locationId,
  date,
  startMinutes,
}: BookingSummaryInput): Promise<BookingSummary | null> {
  const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
  if (!doctor || !doctor.onboardedAt) return null;

  const location = await prisma.location.findUnique({
    where: { id: locationId },
    include: { scheduleBlocks: true },
  });
  if (!location || location.doctorId !== doctorId || location.deletedAt) {
    return null;
  }

  const blocks = location.scheduleBlocks.map((block) => ({
    locationId: location.id,
    weekdays: block.weekdays,
    startMinutes: block.startMinutes,
    endMinutes: block.endMinutes,
    slotDurationMinutes: block.slotDurationMinutes,
    slotCapacity: block.slotCapacity,
  }));

  const generated = generateSlotsForDate(blocks, date).find(
    (slot) => slot.startMinutes === startMinutes,
  );
  if (!generated) return null;

  const vacationRows = await prisma.vacation.findMany({
    where: { doctorId, OR: [{ locationId: null }, { locationId }] },
  });
  const onVacation = isDateOnVacation(
    date,
    locationId,
    vacationRows.map((vacation) => ({
      locationId: vacation.locationId,
      startDate: toIsoDate(vacation.startDate),
      endDate: toIsoDate(vacation.endDate),
    })),
  );

  const bookedCount = await prisma.appointment.count({
    where: {
      locationId,
      date: new Date(`${date}T00:00:00.000Z`),
      startMinutes,
      status: { not: "CANCELLED" },
    },
  });

  return {
    doctorId,
    doctorName: doctor.name,
    locationId: location.id,
    locationName: location.name,
    date,
    startMinutes,
    endMinutes: generated.endMinutes,
    isAvailable: !onVacation && bookedCount < generated.capacity,
  };
}

import { prisma } from "@/lib/prisma";
import { getAvailableSlots } from "@/lib/slots/getAvailableSlots";
import { getLaPazDateString } from "@/lib/time/getLaPazDateString";
import { addDaysToIsoDate } from "@/lib/time/addDaysToIsoDate";

const SEARCH_WINDOW_DAYS = 14;

export interface ProfileLocation {
  id: string;
  name: string;
  address: string;
}

export interface ProfileSlot {
  locationId: string;
  locationName: string;
  date: string;
  startMinutes: number;
  endMinutes: number;
  availableToPatients: boolean;
}

export interface PublicDoctorProfile {
  id: string;
  name: string;
  specialty: string;
  bio: string | null;
  yearsExperience: number | null;
  university: string | null;
  locations: ProfileLocation[];
  // the earliest date (today or later) that has any generated Slot
  slotsDate: string | null;
  slots: ProfileSlot[];
  soonestSlot: { date: string; startMinutes: number } | null;
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export async function getPublicDoctorProfile(
  doctorId: string,
): Promise<PublicDoctorProfile | null> {
  const doctor = await prisma.doctor.findUnique({
    where: { id: doctorId },
    include: {
      locations: {
        where: { deletedAt: null },
        orderBy: { createdAt: "asc" },
        include: { scheduleBlocks: true },
      },
    },
  });
  if (!doctor || !doctor.onboardedAt) return null;

  const today = getLaPazDateString();
  const to = addDaysToIsoDate(today, SEARCH_WINDOW_DAYS);
  const locationIds = doctor.locations.map((location) => location.id);

  const [appointmentRows, vacationRows] = await Promise.all([
    prisma.appointment.findMany({
      where: {
        locationId: { in: locationIds },
        date: {
          gte: new Date(`${today}T00:00:00.000Z`),
          lte: new Date(`${to}T00:00:00.000Z`),
        },
      },
    }),
    prisma.vacation.findMany({ where: { doctorId } }),
  ]);

  const blocks = doctor.locations.flatMap((location) =>
    location.scheduleBlocks.map((block) => ({
      locationId: location.id,
      weekdays: block.weekdays,
      startMinutes: block.startMinutes,
      endMinutes: block.endMinutes,
      slotDurationMinutes: block.slotDurationMinutes,
      slotCapacity: block.slotCapacity,
    })),
  );

  const vacations = vacationRows.map((vacation) => ({
    locationId: vacation.locationId,
    startDate: toIsoDate(vacation.startDate),
    endDate: toIsoDate(vacation.endDate),
  }));

  const appointments = appointmentRows.map((appointment) => ({
    locationId: appointment.locationId,
    date: toIsoDate(appointment.date),
    startMinutes: appointment.startMinutes,
    status: appointment.status,
  }));

  const allSlots = getAvailableSlots({
    blocks,
    vacations,
    appointments,
    from: today,
    to,
  });
  const soonestAvailable =
    allSlots.find((slot) => slot.availableToPatients) ?? null;
  const slotsDate = allSlots[0]?.date ?? null;
  const slotsForDate = slotsDate
    ? allSlots.filter((slot) => slot.date === slotsDate)
    : [];
  const locationNameById = new Map(
    doctor.locations.map((location) => [location.id, location.name]),
  );

  return {
    id: doctor.id,
    name: doctor.name,
    specialty: doctor.specialty,
    bio: doctor.bio,
    yearsExperience: doctor.yearsExperience,
    university: doctor.university,
    locations: doctor.locations.map((location) => ({
      id: location.id,
      name: location.name,
      address: location.address,
    })),
    slotsDate,
    slots: slotsForDate.map((slot) => ({
      locationId: slot.locationId,
      locationName: locationNameById.get(slot.locationId) ?? "",
      date: slot.date,
      startMinutes: slot.startMinutes,
      endMinutes: slot.endMinutes,
      availableToPatients: slot.availableToPatients,
    })),
    soonestSlot: soonestAvailable
      ? {
          date: soonestAvailable.date,
          startMinutes: soonestAvailable.startMinutes,
        }
      : null,
  };
}

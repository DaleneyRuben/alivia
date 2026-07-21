import { prisma } from "@/lib/prisma";
import { getAvailableSlots } from "@/lib/slots/getAvailableSlots";
import { getLaPazDateString } from "@/lib/time/getLaPazDateString";
import { addDaysToIsoDate } from "@/lib/time/addDaysToIsoDate";
import { compareDoctorsByAvailability } from "./compareDoctorsByAvailability";

// how far ahead to look for a doctor's soonest open Slot (docs/flows/patient-site.md §2)
const SEARCH_WINDOW_DAYS = 14;

export interface DirectoryDoctor {
  id: string;
  name: string;
  specialty: string;
  yearsExperience: number | null;
  locationName: string;
  soonestSlot: { date: string; startMinutes: number } | null;
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// Onboarded doctors only, ranked by soonest available Slot (ADR-0008)
export async function getDoctorDirectory(): Promise<DirectoryDoctor[]> {
  const today = getLaPazDateString();
  const to = addDaysToIsoDate(today, SEARCH_WINDOW_DAYS);

  const doctors = await prisma.doctor.findMany({
    where: { onboardedAt: { not: null } },
    include: {
      locations: {
        where: { deletedAt: null },
        orderBy: { createdAt: "asc" },
        include: { scheduleBlocks: true },
      },
    },
  });

  const doctorIds = doctors.map((doctor) => doctor.id);
  const [appointmentRows, vacationRows] = await Promise.all([
    prisma.appointment.findMany({
      where: {
        doctorId: { in: doctorIds },
        date: {
          gte: new Date(`${today}T00:00:00.000Z`),
          lte: new Date(`${to}T00:00:00.000Z`),
        },
      },
    }),
    prisma.vacation.findMany({ where: { doctorId: { in: doctorIds } } }),
  ]);

  return doctors
    .map((doctor) => {
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

      const vacations = vacationRows
        .filter((vacation) => vacation.doctorId === doctor.id)
        .map((vacation) => ({
          locationId: vacation.locationId,
          startDate: toIsoDate(vacation.startDate),
          endDate: toIsoDate(vacation.endDate),
        }));

      const appointments = appointmentRows
        .filter((appointment) => appointment.doctorId === doctor.id)
        .map((appointment) => ({
          locationId: appointment.locationId,
          date: toIsoDate(appointment.date),
          startMinutes: appointment.startMinutes,
          status: appointment.status,
        }));

      const soonest =
        getAvailableSlots({
          blocks,
          vacations,
          appointments,
          from: today,
          to,
        }).find((slot) => slot.availableToPatients) ?? null;

      return {
        id: doctor.id,
        name: doctor.name,
        specialty: doctor.specialty,
        yearsExperience: doctor.yearsExperience,
        locationName: doctor.locations[0]?.name ?? "",
        soonestSlot: soonest
          ? { date: soonest.date, startMinutes: soonest.startMinutes }
          : null,
      };
    })
    .sort(compareDoctorsByAvailability);
}

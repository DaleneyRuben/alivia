import { prisma } from "@/lib/prisma";
import { getLaPazDateString } from "@/lib/time/getLaPazDateString";
import { getDoctorLocations } from "@/lib/locations/getDoctorLocations";

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export interface VacationRow {
  id: string;
  locationId: string | null;
  locationName: string | null;
  startDate: string;
  endDate: string;
}

export interface VacationEditorData {
  today: string;
  locations: { id: string; name: string }[];
  vacations: VacationRow[];
}

// "Próximas vacaciones" — periods that haven't fully elapsed yet (docs/flows/doctor-assistant-panel.md §7)
export async function getVacationEditorData(
  doctorId: string,
): Promise<VacationEditorData> {
  const today = getLaPazDateString();

  const [locations, vacationRows] = await Promise.all([
    getDoctorLocations(doctorId),
    prisma.vacation.findMany({
      where: { doctorId, endDate: { gte: new Date(`${today}T00:00:00.000Z`) } },
      include: { location: true },
      orderBy: { startDate: "asc" },
    }),
  ]);

  const vacations: VacationRow[] = vacationRows.map((vacation) => ({
    id: vacation.id,
    locationId: vacation.locationId,
    locationName: vacation.location?.name ?? null,
    startDate: toIsoDate(vacation.startDate),
    endDate: toIsoDate(vacation.endDate),
  }));

  return {
    today,
    locations: locations.map((location) => ({
      id: location.id,
      name: location.name,
    })),
    vacations,
  };
}

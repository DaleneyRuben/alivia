import { prisma } from "@/lib/prisma";

export interface PracticeRosterEntry {
  id: string;
  practiceLabel: string;
  doctorName: string;
  specialty: string;
  hasAssistant: boolean;
  active: boolean;
}

export async function getPracticeRoster(): Promise<PracticeRosterEntry[]> {
  const doctors = await prisma.doctor.findMany({
    include: { user: true, assistants: true },
    orderBy: { name: "asc" },
  });

  return doctors.map((doctor) => ({
    id: doctor.id,
    practiceLabel: doctor.practiceName ?? doctor.name,
    doctorName: doctor.name,
    specialty: doctor.specialty,
    hasAssistant: doctor.assistants.length > 0,
    active: doctor.user.active,
  }));
}

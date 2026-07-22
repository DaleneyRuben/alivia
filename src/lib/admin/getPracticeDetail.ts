import { prisma } from "@/lib/prisma";

export interface PracticeDetailAccount {
  userId: string;
  name: string;
  role: "Doctor" | "Asistente";
  email: string;
  active: boolean;
}

export interface PracticeDetail {
  id: string;
  practiceLabel: string;
  doctorName: string;
  specialty: string;
  active: boolean;
  accounts: PracticeDetailAccount[];
}

export async function getPracticeDetail(
  practiceId: string,
): Promise<PracticeDetail | null> {
  const doctor = await prisma.doctor.findUnique({
    where: { id: practiceId },
    include: { user: true, assistants: { include: { user: true } } },
  });
  if (!doctor) return null;

  const accounts: PracticeDetailAccount[] = [
    {
      userId: doctor.userId,
      name: doctor.name,
      role: "Doctor",
      email: doctor.user.email,
      active: doctor.user.active,
    },
    ...doctor.assistants.map((assistant) => ({
      userId: assistant.userId,
      name: assistant.name,
      role: "Asistente" as const,
      email: assistant.user.email,
      active: assistant.user.active,
    })),
  ];

  return {
    id: doctor.id,
    practiceLabel: doctor.practiceName ?? doctor.name,
    doctorName: doctor.name,
    specialty: doctor.specialty,
    active: doctor.user.active,
    accounts,
  };
}

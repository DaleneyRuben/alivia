import { prisma } from "@/lib/prisma";

export async function getHistoryPatients(doctorId: string) {
  const patients = await prisma.patient.findMany({
    where: { doctorId },
    orderBy: { name: "asc" },
    include: {
      medicalProfile: true,
      _count: { select: { diagnosisEntries: true } },
    },
  });

  return patients.map((patient) => ({
    id: patient.id,
    name: patient.name,
    phone: patient.phone,
    hasMedicalProfile: patient.medicalProfile !== null,
    visitCount: patient._count.diagnosisEntries,
  }));
}

export type HistoryPatient = Awaited<
  ReturnType<typeof getHistoryPatients>
>[number];

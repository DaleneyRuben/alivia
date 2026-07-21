import { prisma } from "@/lib/prisma";

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export async function getPatientHistoryDetail(
  doctorId: string,
  patientId: string,
) {
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
    include: {
      medicalProfile: true,
      diagnosisEntries: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!patient || patient.doctorId !== doctorId) return null;

  return {
    id: patient.id,
    name: patient.name,
    phone: patient.phone,
    medicalProfile: patient.medicalProfile
      ? {
          dateOfBirth: patient.medicalProfile.dateOfBirth
            ? toIsoDate(patient.medicalProfile.dateOfBirth)
            : null,
          bloodType: patient.medicalProfile.bloodType,
          allergiesAndHistory: patient.medicalProfile.allergiesAndHistory,
        }
      : null,
    diagnosisEntries: patient.diagnosisEntries.map((entry) => ({
      id: entry.id,
      date: toIsoDate(entry.createdAt),
      diagnosis: entry.diagnosis,
      treatment: entry.treatment,
    })),
  };
}

export type PatientHistoryDetail = Awaited<
  ReturnType<typeof getPatientHistoryDetail>
>;

import { prisma } from "@/lib/prisma";

// Gate for docs/flows/domain-lifecycles.md §4: a Medical Profile / Diagnosis
// Entry can only be recorded once the Patient has an Attended appointment
// with this Doctor.
export async function hasAttendedAppointment(
  doctorId: string,
  patientId: string,
): Promise<boolean> {
  const count = await prisma.appointment.count({
    where: { doctorId, patientId, status: "ATTENDED" },
  });
  return count > 0;
}

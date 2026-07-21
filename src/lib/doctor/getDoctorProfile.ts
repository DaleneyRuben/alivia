import { prisma } from "@/lib/prisma";
import type { DoctorProfileInput } from "./isValidDoctorProfileInput";

export async function getDoctorProfile(
  doctorId: string,
): Promise<DoctorProfileInput> {
  const doctor = await prisma.doctor.findUniqueOrThrow({
    where: { id: doctorId },
  });

  return {
    name: doctor.name,
    specialty: doctor.specialty,
    yearsExperience: doctor.yearsExperience,
    bio: doctor.bio ?? "",
  };
}

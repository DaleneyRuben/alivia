"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireDoctorOnlyId } from "@/lib/auth/requireDoctorOnlyId";
import {
  isValidDoctorProfileInput,
  type DoctorProfileInput,
} from "./isValidDoctorProfileInput";

export async function updateDoctorProfile(input: DoctorProfileInput) {
  const doctorId = await requireDoctorOnlyId();
  if (!isValidDoctorProfileInput(input)) throw new Error("Invalid profile");

  await prisma.doctor.update({
    where: { id: doctorId },
    data: {
      name: input.name.trim(),
      specialty: input.specialty.trim(),
      yearsExperience: input.yearsExperience,
      bio: input.bio.trim().length > 0 ? input.bio.trim() : null,
    },
  });

  revalidatePath("/panel/onboarding");
}

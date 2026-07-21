"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireDoctorOnlyId } from "@/lib/auth/requireDoctorOnlyId";

// Gates the doctor's appearance in patient search (CONTEXT.md: Onboarding, domain-lifecycles §3)
export async function completeOnboarding() {
  const doctorId = await requireDoctorOnlyId();

  await prisma.doctor.update({
    where: { id: doctorId },
    data: { onboardedAt: new Date() },
  });

  revalidatePath("/panel/onboarding");
}

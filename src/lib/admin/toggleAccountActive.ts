"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminId } from "@/lib/auth/requireAdminId";

// Deactivating blocks panel login without deleting anything (docs/flows/admin.md §3)
export async function toggleAccountActive(
  userId: string,
  practiceId: string,
): Promise<void> {
  await requireAdminId();

  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  await prisma.user.update({
    where: { id: userId },
    data: { active: !user.active },
  });

  revalidatePath(`/admin/${practiceId}`);
}

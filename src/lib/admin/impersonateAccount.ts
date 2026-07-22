"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdminId } from "@/lib/auth/requireAdminId";
import { signIn } from "@/lib/auth";
import { postLoginPath } from "@/lib/auth/postLoginPath";

// Full access incl. Medical History, logged (ADR-0014, docs/flows/admin.md §3).
// The "impersonation" provider re-verifies the caller is an admin from their own
// session token — requireAdminId() here is defense-in-depth, not the real gate.
export async function impersonateAccount(targetUserId: string): Promise<void> {
  await requireAdminId();

  const target = await prisma.user.findUniqueOrThrow({
    where: { id: targetUserId },
    include: { doctor: { select: { onboardedAt: true } } },
  });

  await signIn("impersonation", { targetUserId, redirect: false });

  redirect(
    postLoginPath({
      role: target.role,
      doctorOnboarded: target.doctor
        ? target.doctor.onboardedAt !== null
        : undefined,
    }),
  );
}

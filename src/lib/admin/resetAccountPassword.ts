"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminId } from "@/lib/auth/requireAdminId";
import { generateResetToken } from "@/lib/credentials/generateResetToken";
import { buildCredentialSetupLink } from "@/lib/credentials/buildCredentialSetupLink";
import { getRequestBaseUrl } from "@/lib/credentials/getRequestBaseUrl";

// Admin-driven reset reuses the single resetToken mechanism (ADR-0015), delivered
// as a new wa.me link rather than email (ADR-0016, docs/flows/admin.md §3)
export async function resetAccountPassword(userId: string): Promise<string> {
  await requireAdminId();

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    include: { doctor: true, assistant: true },
  });
  const name = user.doctor?.name ?? user.assistant?.name;
  const phone = user.doctor?.phone ?? user.assistant?.phone;
  if (!name || !phone) throw new Error("Account has no linked profile");

  const token = generateResetToken();
  await prisma.user.update({
    where: { id: userId },
    data: { resetToken: token },
  });

  const baseUrl = await getRequestBaseUrl();
  return buildCredentialSetupLink({
    recipientName: name,
    phone,
    token,
    baseUrl,
    kind: "reset",
  });
}

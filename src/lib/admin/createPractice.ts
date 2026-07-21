"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminId } from "@/lib/auth/requireAdminId";
import { generateResetToken } from "@/lib/credentials/generateResetToken";
import { buildCredentialSetupLink } from "@/lib/credentials/buildCredentialSetupLink";
import { getRequestBaseUrl } from "@/lib/credentials/getRequestBaseUrl";
import {
  isValidCreatePracticeInput,
  type CreatePracticeInput,
} from "./isValidCreatePracticeInput";

export interface SetupLink {
  name: string;
  role: "Doctor" | "Asistente";
  link: string;
}

// Bare concierge accounts (ADR-0005) — the Doctor completes Onboarding themselves.
// Each account gets a pre-filled wa.me setup link, never emailed (ADR-0016).
export async function createPractice(
  input: CreatePracticeInput,
): Promise<SetupLink[]> {
  await requireAdminId();
  if (!isValidCreatePracticeInput(input)) throw new Error("Invalid input");

  const baseUrl = await getRequestBaseUrl();
  const setupLinks: SetupLink[] = [];

  const doctorName = input.doctor.name.trim();
  const doctorPhone = input.doctor.phone.trim();
  const doctorToken = generateResetToken();

  const doctorUser = await prisma.user.create({
    data: {
      email: input.doctor.email.trim().toLowerCase(),
      role: "DOCTOR",
      resetToken: doctorToken,
    },
  });

  const doctor = await prisma.doctor.create({
    data: {
      userId: doctorUser.id,
      name: doctorName,
      specialty: input.doctor.specialty.trim(),
      phone: doctorPhone,
      subscription: { create: { status: "ACTIVE" } },
    },
  });

  setupLinks.push({
    name: doctorName,
    role: "Doctor",
    link: buildCredentialSetupLink({
      recipientName: doctorName,
      phone: doctorPhone,
      token: doctorToken,
      baseUrl,
      kind: "setup",
    }),
  });

  if (input.assistant) {
    const assistantName = input.assistant.name.trim();
    const assistantPhone = input.assistant.phone.trim();
    const assistantToken = generateResetToken();

    const assistantUser = await prisma.user.create({
      data: {
        email: input.assistant.email.trim().toLowerCase(),
        role: "ASSISTANT",
        resetToken: assistantToken,
      },
    });

    await prisma.assistant.create({
      data: {
        userId: assistantUser.id,
        doctorId: doctor.id,
        name: assistantName,
        phone: assistantPhone,
      },
    });

    setupLinks.push({
      name: assistantName,
      role: "Asistente",
      link: buildCredentialSetupLink({
        recipientName: assistantName,
        phone: assistantPhone,
        token: assistantToken,
        baseUrl,
        kind: "setup",
      }),
    });
  }

  revalidatePath("/admin");
  return setupLinks;
}

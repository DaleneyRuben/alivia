import { prisma } from "@/lib/prisma";

export interface SubscriptionSummary {
  status: "ACTIVE" | "INACTIVE";
  renewsAt: string | null;
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export async function getSubscription(
  doctorId: string,
): Promise<SubscriptionSummary | null> {
  const subscription = await prisma.subscription.findUnique({
    where: { doctorId },
  });
  if (!subscription) return null;

  return {
    status: subscription.status,
    renewsAt: subscription.renewsAt ? toIsoDate(subscription.renewsAt) : null,
  };
}

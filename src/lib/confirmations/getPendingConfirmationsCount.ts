import { prisma } from "@/lib/prisma";
import { getLaPazDateString } from "@/lib/time/getLaPazDateString";
import { addDaysToIsoDate } from "@/lib/time/addDaysToIsoDate";

// feeds the Confirmaciones nav badge (docs/flows/doctor-assistant-panel.md §5)
export async function getPendingConfirmationsCount(
  doctorId: string,
): Promise<number> {
  const tomorrow = addDaysToIsoDate(getLaPazDateString(), 1);

  return prisma.appointment.count({
    where: {
      doctorId,
      date: new Date(`${tomorrow}T00:00:00.000Z`),
      status: "SCHEDULED",
      confirmation: "PENDING",
    },
  });
}

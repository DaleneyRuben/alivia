import { prisma } from "@/lib/prisma";

export interface AssistantSummary {
  id: string;
  name: string;
  email: string;
}

export async function getAssistants(
  doctorId: string,
): Promise<AssistantSummary[]> {
  const assistants = await prisma.assistant.findMany({
    where: { doctorId },
    include: { user: true },
    orderBy: { name: "asc" },
  });

  return assistants.map((assistant) => ({
    id: assistant.id,
    name: assistant.name,
    email: assistant.user.email,
  }));
}

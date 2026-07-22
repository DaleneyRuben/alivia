import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdminId } from "@/lib/auth/requireAdminId";
import { getPracticeDetail } from "@/lib/admin/getPracticeDetail";
import { PracticeDetail } from "@/components/admin/PracticeDetail";

export const metadata: Metadata = { title: "Consulta · Alivia" };

export default async function PracticeDetailPage({
  params,
}: {
  params: Promise<{ practiceId: string }>;
}) {
  await requireAdminId();
  const { practiceId } = await params;

  const practice = await getPracticeDetail(practiceId);
  if (!practice) notFound();

  return <PracticeDetail practice={practice} />;
}

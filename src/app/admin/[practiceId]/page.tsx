import type { Metadata } from "next";
import { requireAdminId } from "@/lib/auth/requireAdminId";

export const metadata: Metadata = { title: "Consulta · Alivia" };

export default async function PracticeDetailPage() {
  await requireAdminId();

  return (
    <main className="mx-auto max-w-[680px] p-8">
      <h1 className="text-xl font-extrabold">Detalle de la consulta</h1>
      <p className="text-sm text-muted">Próximamente.</p>
    </main>
  );
}

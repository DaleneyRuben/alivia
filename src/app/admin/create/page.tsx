import type { Metadata } from "next";
import { CreatePracticeForm } from "@/components/admin/CreatePracticeForm";
import { requireAdminId } from "@/lib/auth/requireAdminId";

export const metadata: Metadata = { title: "Crear consulta · Alivia" };

export default async function CreatePracticePage() {
  await requireAdminId();

  return <CreatePracticeForm />;
}

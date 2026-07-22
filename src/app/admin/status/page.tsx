import type { Metadata } from "next";
import { SystemStatus } from "@/components/admin/SystemStatus";
import { getSystemStatus } from "@/lib/admin/getSystemStatus";
import { requireAdminId } from "@/lib/auth/requireAdminId";

export const metadata: Metadata = { title: "Estado del sistema · Alivia" };

export default async function SystemStatusPage() {
  await requireAdminId();
  const status = await getSystemStatus();

  return <SystemStatus status={status} />;
}

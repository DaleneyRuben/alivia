import type { Metadata } from "next";
import { Analytics } from "@/components/admin/Analytics";
import { getAnalytics } from "@/lib/admin/getAnalytics";
import { requireAdminId } from "@/lib/auth/requireAdminId";

export const metadata: Metadata = { title: "Analytics · Alivia" };

export default async function AnalyticsPage() {
  await requireAdminId();
  const analytics = await getAnalytics();

  return <Analytics analytics={analytics} />;
}

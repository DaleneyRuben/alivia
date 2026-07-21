import type { Metadata } from "next";
import { RosterList } from "@/components/admin/RosterList";
import { getPracticeRoster } from "@/lib/admin/getPracticeRoster";
import { requireAdminId } from "@/lib/auth/requireAdminId";

export const metadata: Metadata = { title: "Roster · Alivia" };

export default async function AdminPage() {
  await requireAdminId();
  const practices = await getPracticeRoster();

  return <RosterList practices={practices} />;
}

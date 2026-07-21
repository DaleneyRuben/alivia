import type { Metadata } from "next";
import { requireDoctorId } from "@/lib/schedule/requireDoctorId";
import { getConfirmationsQueue } from "@/lib/confirmations/getConfirmationsQueue";
import { ConfirmationsEditor } from "@/components/panel/confirmations/ConfirmationsEditor";

export const metadata: Metadata = { title: "Confirmaciones · Alivia" };

export default async function ConfirmationsPage() {
  const doctorId = await requireDoctorId();
  const { tomorrow, confirmations } = await getConfirmationsQueue(doctorId);

  return (
    <main className="flex-1 p-8">
      <ConfirmationsEditor tomorrow={tomorrow} confirmations={confirmations} />
    </main>
  );
}

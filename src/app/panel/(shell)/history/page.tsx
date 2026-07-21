import type { Metadata } from "next";
import { requireDoctorOnlyId } from "@/lib/auth/requireDoctorOnlyId";
import { getMedicalHistoryStatus } from "@/lib/history/getMedicalHistoryStatus";
import { getHistoryPatients } from "@/lib/history/getHistoryPatients";
import { HistoryOptIn } from "@/components/panel/history/HistoryOptIn";
import { HistoryPatientList } from "@/components/panel/history/HistoryPatientList";

export const metadata: Metadata = { title: "Historial · Alivia" };

export default async function HistoryPage() {
  const doctorId = await requireDoctorOnlyId();
  const enabled = await getMedicalHistoryStatus(doctorId);

  if (!enabled) {
    return (
      <main className="flex-1 p-8">
        <HistoryOptIn />
      </main>
    );
  }

  const patients = await getHistoryPatients(doctorId);

  return (
    <main className="flex-1 p-8">
      <HistoryPatientList patients={patients} />
    </main>
  );
}

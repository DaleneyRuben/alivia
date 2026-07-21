import type { Metadata } from "next";
import { requireDoctorId } from "@/lib/schedule/requireDoctorId";
import { getVacationEditorData } from "@/lib/vacation/getVacationEditorData";
import { VacationEditor } from "@/components/panel/vacation/VacationEditor";

export const metadata: Metadata = { title: "Vacaciones · Alivia" };

export default async function VacationPage() {
  const doctorId = await requireDoctorId();
  const { today, locations, vacations } = await getVacationEditorData(doctorId);

  return (
    <main className="flex-1 p-8">
      <VacationEditor
        today={today}
        locations={locations}
        vacations={vacations}
      />
    </main>
  );
}

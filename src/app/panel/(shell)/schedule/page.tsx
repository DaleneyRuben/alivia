import type { Metadata } from "next";
import { requireDoctorId } from "@/lib/schedule/requireDoctorId";
import { getLocationsWithSchedule } from "@/lib/schedule/getLocationsWithSchedule";
import { ScheduleEditor } from "@/components/panel/schedule/ScheduleEditor";

export const metadata: Metadata = { title: "Horarios · Alivia" };

export default async function SchedulePage() {
  const doctorId = await requireDoctorId();
  const locations = await getLocationsWithSchedule(doctorId);

  return (
    <main className="flex-1 p-8">
      <h1 className="mb-5 text-xl font-extrabold">Horarios</h1>
      <ScheduleEditor locations={locations} />
    </main>
  );
}

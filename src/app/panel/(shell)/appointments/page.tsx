import type { Metadata } from "next";
import { requireDoctorId } from "@/lib/schedule/requireDoctorId";
import { getAppointmentsQueue } from "@/lib/appointments/getAppointmentsQueue";
import { AppointmentsEditor } from "@/components/panel/appointments/AppointmentsEditor";

export const metadata: Metadata = { title: "Citas · Alivia" };

export default async function AppointmentsPage() {
  const doctorId = await requireDoctorId();
  const { locations, today, tomorrow, appointments, slots } =
    await getAppointmentsQueue(doctorId);

  return (
    <main className="flex-1 p-8">
      <AppointmentsEditor
        locations={locations}
        today={today}
        tomorrow={tomorrow}
        appointments={appointments}
        slots={slots}
      />
    </main>
  );
}

import type { Metadata } from "next";
import { requireDoctorOnlyId } from "@/lib/locations/requireDoctorOnlyId";
import { getDoctorLocations } from "@/lib/locations/getDoctorLocations";
import { LocationEditor } from "@/components/panel/locations/LocationEditor";

export const metadata: Metadata = { title: "Ubicaciones · Alivia" };

export default async function LocationsPage() {
  const doctorId = await requireDoctorOnlyId();
  const locations = await getDoctorLocations(doctorId);

  return (
    <main className="flex-1 p-8">
      <h1 className="mb-5 text-xl font-extrabold">Ubicaciones</h1>
      <LocationEditor
        locations={locations.map((location) => ({
          id: location.id,
          name: location.name,
          address: location.address,
          scheduleBlockCount: location._count.scheduleBlocks,
        }))}
      />
    </main>
  );
}

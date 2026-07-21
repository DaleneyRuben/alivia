import type { Metadata } from "next";
import { SpecialtySearch } from "@/components/patient/SpecialtySearch";
import { PatientHeader } from "@/components/patient/PatientHeader";
import { FeaturedDoctorsSection } from "@/components/patient/FeaturedDoctorsSection";
import { getDoctorDirectory } from "@/lib/patients/getDoctorDirectory";
import { getLaPazDateString } from "@/lib/time/getLaPazDateString";
import { addDaysToIsoDate } from "@/lib/time/addDaysToIsoDate";

export const metadata: Metadata = { title: "Alivia" };

export default async function HomePage() {
  const directory = await getDoctorDirectory();
  const today = getLaPazDateString();
  const tomorrow = addDaysToIsoDate(today, 1);

  return (
    <div className="flex flex-1 flex-col">
      <PatientHeader />
      <main className="mx-auto w-full max-w-[640px] px-6 pt-2 pb-8 text-center">
        <SpecialtySearch />
      </main>
      <FeaturedDoctorsSection
        doctors={directory.slice(0, 3)}
        today={today}
        tomorrow={tomorrow}
      />
    </div>
  );
}

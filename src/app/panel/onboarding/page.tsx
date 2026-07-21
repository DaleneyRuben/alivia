import type { Metadata } from "next";
import { requireDoctorOnlyId } from "@/lib/auth/requireDoctorOnlyId";
import { getDoctorProfile } from "@/lib/doctor/getDoctorProfile";
import { getLocationsWithSchedule } from "@/lib/schedule/getLocationsWithSchedule";
import { OnboardingWizard } from "@/components/panel/onboarding/OnboardingWizard";

export const metadata: Metadata = { title: "Configura tu consulta · Alivia" };

export default async function OnboardingPage() {
  const doctorId = await requireDoctorOnlyId();
  const [profile, locations] = await Promise.all([
    getDoctorProfile(doctorId),
    getLocationsWithSchedule(doctorId),
  ]);

  return (
    <main className="flex-1 p-8">
      <div className="mb-6 text-center">
        <div className="text-[13px] font-semibold text-muted">Alivia</div>
        <h1 className="mt-0.5 text-xl font-extrabold">Configura tu consulta</h1>
      </div>
      <OnboardingWizard initialProfile={profile} locations={locations} />
    </main>
  );
}

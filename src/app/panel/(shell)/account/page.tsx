import type { Metadata } from "next";
import { requireDoctorOnlyId } from "@/lib/auth/requireDoctorOnlyId";
import { getDoctorProfile } from "@/lib/doctor/getDoctorProfile";
import { getSubscription } from "@/lib/doctor/getSubscription";
import { getAssistants } from "@/lib/doctor/getAssistants";
import { ProfileEditor } from "@/components/panel/account/ProfileEditor";
import { SubscriptionCard } from "@/components/panel/account/SubscriptionCard";
import { AssistantList } from "@/components/panel/account/AssistantList";

export const metadata: Metadata = { title: "Cuenta · Alivia" };

export default async function AccountPage() {
  const doctorId = await requireDoctorOnlyId();
  const [profile, subscription, assistants] = await Promise.all([
    getDoctorProfile(doctorId),
    getSubscription(doctorId),
    getAssistants(doctorId),
  ]);

  return (
    <main className="flex-1 p-8">
      <div className="mx-auto flex max-w-[680px] flex-col gap-3.5">
        <div className="mb-1">
          <div className="text-[13px] font-semibold text-muted">Tu cuenta</div>
          <h1 className="mt-0.5 text-[26px] font-extrabold tracking-tight">
            Ajustes
          </h1>
        </div>
        <ProfileEditor profile={profile} />
        {subscription && <SubscriptionCard subscription={subscription} />}
        <AssistantList assistants={assistants} />
      </div>
    </main>
  );
}

import { auth } from "@/lib/auth";
import { PanelNav } from "@/components/panel/PanelNav";
import { getDoctorIdForUser } from "@/lib/schedule/getDoctorIdForUser";
import { getPendingConfirmationsCount } from "@/lib/confirmations/getPendingConfirmationsCount";

export default async function PanelShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const doctorId = await getDoctorIdForUser(
    session!.user.id,
    session!.user.role,
  );
  const pendingConfirmations = doctorId
    ? await getPendingConfirmationsCount(doctorId)
    : 0;

  return (
    <>
      <PanelNav
        role={session!.user.role as "DOCTOR" | "ASSISTANT"}
        email={session!.user.email}
        pendingConfirmations={pendingConfirmations}
      />
      {children}
    </>
  );
}

import { auth } from "@/lib/auth";
import { PanelNav } from "@/components/panel/PanelNav";

export default async function PanelShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <>
      <PanelNav
        role={session!.user.role as "DOCTOR" | "ASSISTANT"}
        email={session!.user.email}
      />
      {children}
    </>
  );
}

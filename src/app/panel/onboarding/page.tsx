import type { Metadata } from "next";

export const metadata: Metadata = { title: "Configura tu consulta · Alivia" };

export default function OnboardingPage() {
  return (
    <main className="flex-1 p-8">
      <h1 className="text-xl font-extrabold">Configura tu consulta</h1>
      <p className="text-sm text-muted">Próximamente.</p>
    </main>
  );
}

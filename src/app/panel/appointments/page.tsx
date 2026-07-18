import type { Metadata } from "next";

export const metadata: Metadata = { title: "Citas · Alivia" };

export default function AppointmentsPage() {
  return (
    <main className="flex-1 p-8">
      <h1 className="text-xl font-extrabold">Citas</h1>
      <p className="text-sm text-muted">Próximamente.</p>
    </main>
  );
}

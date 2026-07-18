import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin · Alivia" };

export default function AdminPage() {
  return (
    <main className="flex-1 p-8">
      <h1 className="text-xl font-extrabold">Consultorios</h1>
      <p className="text-sm text-muted">Próximamente.</p>
    </main>
  );
}

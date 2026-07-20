import type { Metadata } from "next";
import { SpecialtySearch } from "@/components/patient/SpecialtySearch";

export const metadata: Metadata = { title: "Alivia" };

export default function HomePage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-[640px]">
        <SpecialtySearch />
      </div>
    </main>
  );
}

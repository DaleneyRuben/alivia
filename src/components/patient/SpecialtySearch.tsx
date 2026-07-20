"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SPECIALTY_CHIPS = [
  "Cardiología",
  "Pediatría",
  "Dermatología",
  "Medicina general",
];

export function SpecialtySearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function goToResults(specialty: string) {
    router.push(`/results?specialty=${encodeURIComponent(specialty)}`);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!query.trim()) return;
    goToResults(query.trim());
  }

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <div>
        <h1 className="text-[34px] font-extrabold tracking-[-0.8px]">
          ¿Qué especialista necesitas?
        </h1>
        <p className="mt-2 text-[15px] text-muted">
          Encuentra un especialista y reserva tu cita en minutos.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-[480px] items-center gap-2 rounded-full border border-input-border bg-white p-1.5 shadow-[0_4px_16px_rgba(42,37,33,.05)]"
      >
        <label htmlFor="specialty-query" className="sr-only">
          Buscar especialista
        </label>
        <input
          id="specialty-query"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Especialidad o nombre del doctor"
          className="min-w-0 flex-1 border-none bg-transparent px-3.5 py-2 text-sm outline-none"
        />
        <button
          type="submit"
          disabled={!query.trim()}
          className="shrink-0 rounded-full bg-terracotta px-5 py-2.5 text-[14px] font-bold text-white disabled:bg-terracotta-disabled cursor-pointer disabled:cursor-not-allowed"
        >
          Buscar
        </button>
      </form>
      <div className="flex flex-wrap justify-center gap-2">
        {SPECIALTY_CHIPS.map((specialty) => (
          <button
            key={specialty}
            type="button"
            onClick={() => goToResults(specialty)}
            className="rounded-full border border-input-border bg-white px-4 py-2 text-[13px] font-medium text-body-soft cursor-pointer hover:border-terracotta"
          >
            {specialty}
          </button>
        ))}
      </div>
    </div>
  );
}

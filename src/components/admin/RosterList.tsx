"use client";

import { useState } from "react";
import Link from "next/link";
import { initials } from "@/lib/text/initials";
import { avatarTint } from "@/lib/text/avatarTint";
import { matchesRosterQuery } from "@/lib/admin/matchesRosterQuery";
import type { PracticeRosterEntry } from "@/lib/admin/getPracticeRoster";

export interface RosterListProps {
  practices: PracticeRosterEntry[];
}

export function RosterList({ practices }: RosterListProps) {
  const [query, setQuery] = useState("");
  const filtered = practices.filter((practice) =>
    matchesRosterQuery(practice, query),
  );

  return (
    <div className="mx-auto max-w-[860px] px-6 py-6 pb-12">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2.5">
        <div>
          <div className="text-[13px] font-semibold text-muted">
            Consultas en la plataforma
          </div>
          <h1 className="mt-0.5 text-[26px] font-extrabold tracking-tight">
            Roster
          </h1>
        </div>
        <Link
          href="/admin/create"
          className="rounded-full bg-terracotta px-5 py-2.5 text-[13.5px] font-bold text-white no-underline"
        >
          + Crear consulta
        </Link>
      </div>
      <div className="mb-4 flex max-w-[420px] items-center gap-2 rounded-full border border-input-border bg-white py-1.5 pr-1.5 pl-4.5">
        <span className="text-placeholder">⌕</span>
        <label htmlFor="roster-query" className="sr-only">
          Buscar por doctor o consulta
        </label>
        <input
          id="roster-query"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar por doctor o consulta"
          className="w-full min-w-0 flex-1 border-none bg-transparent text-sm outline-none"
        />
      </div>
      <div className="flex flex-col gap-2.5">
        {filtered.map((practice) => {
          const tint = avatarTint(practice.id);
          return (
            <Link
              key={practice.id}
              href={`/admin/${practice.id}`}
              className="flex flex-wrap items-center gap-3.5 rounded-2xl border border-card-border bg-white p-4 no-underline"
            >
              <div
                className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full text-[17px] font-bold"
                style={{ background: tint.bg, color: tint.text }}
              >
                {initials(practice.doctorName)}
              </div>
              <div className="min-w-[150px] flex-1">
                <div className="text-[15px] font-bold text-ink">
                  {practice.practiceLabel}
                </div>
                <div className="text-[12.5px] text-muted">
                  {practice.doctorName} · {practice.specialty}
                </div>
              </div>
              <span
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${
                  practice.hasAssistant
                    ? "bg-[#F7F2EA] text-body-soft"
                    : "bg-[#F3ECE1] text-muted"
                }`}
              >
                {practice.hasAssistant ? "Con asistente" : "Sin asistente"}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold ${
                  practice.active
                    ? "bg-success-bg text-success"
                    : "bg-[#F5E0D8] text-terracotta-deep"
                }`}
              >
                <span
                  className="h-1.75 w-1.75 rounded-full"
                  style={{
                    backgroundColor: practice.active ? "#4F9C82" : "#C15A3E",
                  }}
                />
                {practice.active ? "Activa" : "Inactiva"}
              </span>
              <span className="text-lg text-sand-dot">›</span>
            </Link>
          );
        })}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-[15px] text-muted">
            No encontramos consultas para esa búsqueda.
          </p>
        )}
      </div>
    </div>
  );
}

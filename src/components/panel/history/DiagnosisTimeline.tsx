"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addDiagnosisEntry } from "@/lib/history/addDiagnosisEntry";
import { updateDiagnosisEntry } from "@/lib/history/updateDiagnosisEntry";
import { isValidDiagnosisEntryInput } from "@/lib/history/isValidDiagnosisEntryInput";
import { formatShortSpanishDate } from "@/lib/time/formatShortSpanishDate";

export interface DiagnosisTimelineEntry {
  id: string;
  date: string;
  diagnosis: string;
  treatment: string;
}

export interface DiagnosisTimelineProps {
  patientId: string;
  entries: DiagnosisTimelineEntry[];
}

type FormState =
  { mode: "closed" } | { mode: "add" } | { mode: "edit"; entryId: string };

export function DiagnosisTimeline({
  patientId,
  entries,
}: DiagnosisTimelineProps) {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>({ mode: "closed" });
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [isPending, startTransition] = useTransition();

  const canSubmit = isValidDiagnosisEntryInput({ diagnosis, treatment });

  function openAdd() {
    setDiagnosis("");
    setTreatment("");
    setFormState({ mode: "add" });
  }

  function openEdit(entry: DiagnosisTimelineEntry) {
    setDiagnosis(entry.diagnosis);
    setTreatment(entry.treatment);
    setFormState({ mode: "edit", entryId: entry.id });
  }

  function handleSubmit() {
    startTransition(async () => {
      if (formState.mode === "edit") {
        await updateDiagnosisEntry({
          entryId: formState.entryId,
          diagnosis,
          treatment,
        });
      } else if (formState.mode === "add") {
        await addDiagnosisEntry({ patientId, diagnosis, treatment });
      }
      setFormState({ mode: "closed" });
      router.refresh();
    });
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[15px] font-bold">Historial de visitas</span>
        <button
          type="button"
          onClick={openAdd}
          className="cursor-pointer rounded-full border border-terracotta bg-white px-4 py-2 text-[12.5px] font-bold text-terracotta-deep"
        >
          + Nueva nota
        </button>
      </div>

      {formState.mode !== "closed" && (
        <div className="mb-3 flex flex-col gap-3 rounded-[16px] border border-card-border bg-white p-4">
          <div>
            <label
              htmlFor="entry-diagnosis"
              className="mb-1.5 block text-[12.5px] font-semibold"
            >
              Diagnóstico
            </label>
            <input
              id="entry-diagnosis"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="Motivo y diagnóstico"
              className="w-full rounded-xl border border-input-border bg-white px-3.5 py-2.75 text-sm outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="entry-treatment"
              className="mb-1.5 block text-[12.5px] font-semibold"
            >
              Tratamiento
            </label>
            <textarea
              id="entry-treatment"
              rows={2}
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
              placeholder="Indicaciones…"
              className="w-full resize-none rounded-xl border border-input-border bg-white px-3.5 py-2.75 text-sm outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit || isPending}
              className="cursor-pointer rounded-full bg-terracotta px-4 py-2 text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:bg-terracotta-disabled"
            >
              Guardar nota
            </button>
            <button
              type="button"
              onClick={() => setFormState({ mode: "closed" })}
              className="cursor-pointer rounded-full px-4 py-2 text-[13px] font-semibold text-muted"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex gap-3.5 rounded-[16px] border border-card-border bg-white p-4"
          >
            <div className="flex shrink-0 flex-col items-center">
              <span className="mt-1 h-2.75 w-2.75 rounded-full bg-terracotta" />
              <span className="mt-1 w-0.5 flex-1 bg-card-border" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <span className="text-[12.5px] font-semibold text-muted">
                  {formatShortSpanishDate(entry.date)}
                </span>
                <button
                  type="button"
                  onClick={() => openEdit(entry)}
                  className="cursor-pointer rounded-full border border-input-border bg-white px-2.75 py-1.25 text-[11.5px] font-semibold text-ink"
                >
                  Editar
                </button>
              </div>
              <div className="mt-1 mb-0.75 text-[14.5px] font-bold">
                {entry.diagnosis}
              </div>
              <div className="text-[13px] leading-relaxed text-body-soft">
                {entry.treatment}
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-muted">
        Las notas anteriores se pueden editar, pero nunca eliminar.
      </p>
    </div>
  );
}

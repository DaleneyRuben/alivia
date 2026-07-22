"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveFirstVisit } from "@/lib/history/saveFirstVisit";
import { isValidDiagnosisEntryInput } from "@/lib/history/isValidDiagnosisEntryInput";

export interface FirstVisitFormProps {
  patientId: string;
}

export function FirstVisitForm({ patientId }: FirstVisitFormProps) {
  const router = useRouter();
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [allergiesAndHistory, setAllergiesAndHistory] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(false);

  const canSubmit = isValidDiagnosisEntryInput({ diagnosis, treatment });

  function handleSubmit() {
    setError(false);
    startTransition(async () => {
      try {
        await saveFirstVisit({
          patientId,
          dateOfBirth: dateOfBirth || null,
          bloodType,
          allergiesAndHistory,
          diagnosis,
          treatment,
        });
        router.refresh();
      } catch {
        setError(true);
      }
    });
  }

  return (
    <div className="rounded-[18px] border border-terracotta bg-white p-5">
      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-warning-bg px-2.75 py-1.25 text-[11px] font-bold text-warning">
        PRIMERA VISITA
      </div>
      <div className="mb-1 text-[16px] font-bold">Crear historia clínica</div>
      <p className="mb-4 text-[13px] text-muted">
        El perfil base y la primera nota se registran juntos en la primera
        visita atendida.
      </p>
      {error && (
        <div
          role="alert"
          className="mb-4 flex items-center gap-2 rounded-[13px] border border-error-border bg-error-bg px-3.5 py-[11px] text-[13px] font-semibold text-terracotta-dark"
        >
          ⚠ No se pudo guardar. Esta paciente todavía no tiene una cita
          atendida.
        </div>
      )}

      <div className="mb-2.5 text-xs font-bold tracking-wide text-muted uppercase">
        Perfil base
      </div>
      <div className="mb-4 flex flex-wrap gap-2.5">
        <div className="min-w-[130px] flex-1">
          <label
            htmlFor="dateOfBirth"
            className="mb-1.5 block text-[12.5px] font-semibold"
          >
            Fecha de nacimiento
          </label>
          <input
            id="dateOfBirth"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="w-full rounded-xl border border-input-border bg-white px-3.5 py-2.75 text-sm outline-none"
          />
        </div>
        <div className="min-w-[130px] flex-1">
          <label
            htmlFor="bloodType"
            className="mb-1.5 block text-[12.5px] font-semibold"
          >
            Tipo de sangre
          </label>
          <input
            id="bloodType"
            value={bloodType}
            onChange={(e) => setBloodType(e.target.value)}
            placeholder="O+"
            className="w-full rounded-xl border border-input-border bg-white px-3.5 py-2.75 text-sm outline-none"
          />
        </div>
      </div>
      <div className="mb-4.5">
        <label
          htmlFor="allergiesAndHistory"
          className="mb-1.5 block text-[12.5px] font-semibold"
        >
          Alergias y antecedentes
        </label>
        <textarea
          id="allergiesAndHistory"
          rows={2}
          value={allergiesAndHistory}
          onChange={(e) => setAllergiesAndHistory(e.target.value)}
          placeholder="Ninguna conocida…"
          className="w-full resize-none rounded-xl border border-input-border bg-white px-3.5 py-2.75 text-sm outline-none"
        />
      </div>

      <div className="my-4.5 h-px bg-card-border" />

      <div className="mb-2.5 text-xs font-bold tracking-wide text-muted uppercase">
        Primera nota de visita
      </div>
      <div className="flex flex-col gap-3">
        <div>
          <label
            htmlFor="diagnosis"
            className="mb-1.5 block text-[12.5px] font-semibold"
          >
            Diagnóstico
          </label>
          <input
            id="diagnosis"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="Motivo y diagnóstico"
            className="w-full rounded-xl border border-input-border bg-white px-3.5 py-2.75 text-sm outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="treatment"
            className="mb-1.5 block text-[12.5px] font-semibold"
          >
            Tratamiento
          </label>
          <textarea
            id="treatment"
            rows={2}
            value={treatment}
            onChange={(e) => setTreatment(e.target.value)}
            placeholder="Indicaciones…"
            className="w-full resize-none rounded-xl border border-input-border bg-white px-3.5 py-2.75 text-sm outline-none"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit || isPending}
        className="mt-4 cursor-pointer rounded-full bg-terracotta px-6 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-terracotta-disabled"
      >
        Guardar historia clínica
      </button>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateMedicalProfile } from "@/lib/history/updateMedicalProfile";
import { formatShortSpanishDate } from "@/lib/time/formatShortSpanishDate";

export interface MedicalProfileCardProps {
  patientId: string;
  dateOfBirth: string | null;
  bloodType: string | null;
  allergiesAndHistory: string | null;
}

export function MedicalProfileCard({
  patientId,
  dateOfBirth,
  bloodType,
  allergiesAndHistory,
}: MedicalProfileCardProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [dobInput, setDobInput] = useState(dateOfBirth ?? "");
  const [bloodTypeInput, setBloodTypeInput] = useState(bloodType ?? "");
  const [allergiesInput, setAllergiesInput] = useState(
    allergiesAndHistory ?? "",
  );
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await updateMedicalProfile({
        patientId,
        dateOfBirth: dobInput || null,
        bloodType: bloodTypeInput,
        allergiesAndHistory: allergiesInput,
      });
      setIsEditing(false);
      router.refresh();
    });
  }

  return (
    <div className="mb-4.5 rounded-[18px] border border-card-border bg-white p-4.5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[15px] font-bold">Perfil base</span>
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="cursor-pointer rounded-full border border-input-border bg-white px-3.25 py-1.75 text-xs font-semibold text-ink"
          >
            Editar
          </button>
        )}
      </div>
      {isEditing ? (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2.5">
            <div className="min-w-[130px] flex-1">
              <label
                htmlFor="edit-dateOfBirth"
                className="mb-1.5 block text-[12.5px] font-semibold"
              >
                Fecha de nacimiento
              </label>
              <input
                id="edit-dateOfBirth"
                type="date"
                value={dobInput}
                onChange={(e) => setDobInput(e.target.value)}
                className="w-full rounded-xl border border-input-border bg-white px-3.5 py-2.75 text-sm outline-none"
              />
            </div>
            <div className="min-w-[130px] flex-1">
              <label
                htmlFor="edit-bloodType"
                className="mb-1.5 block text-[12.5px] font-semibold"
              >
                Tipo de sangre
              </label>
              <input
                id="edit-bloodType"
                value={bloodTypeInput}
                onChange={(e) => setBloodTypeInput(e.target.value)}
                className="w-full rounded-xl border border-input-border bg-white px-3.5 py-2.75 text-sm outline-none"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="edit-allergiesAndHistory"
              className="mb-1.5 block text-[12.5px] font-semibold"
            >
              Alergias y antecedentes
            </label>
            <textarea
              id="edit-allergiesAndHistory"
              rows={2}
              value={allergiesInput}
              onChange={(e) => setAllergiesInput(e.target.value)}
              className="w-full resize-none rounded-xl border border-input-border bg-white px-3.5 py-2.75 text-sm outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className="cursor-pointer rounded-full bg-terracotta px-4 py-2 text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:bg-terracotta-disabled"
            >
              Guardar cambios
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="cursor-pointer rounded-full px-4 py-2 text-[13px] font-semibold text-muted"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3">
          <div>
            <div className="text-[11.5px] font-semibold text-muted">
              Nacimiento
            </div>
            <div className="text-sm font-semibold">
              {dateOfBirth ? formatShortSpanishDate(dateOfBirth) : "—"}
            </div>
          </div>
          <div>
            <div className="text-[11.5px] font-semibold text-muted">
              Tipo de sangre
            </div>
            <div className="text-sm font-semibold">{bloodType || "—"}</div>
          </div>
          <div>
            <div className="text-[11.5px] font-semibold text-muted">
              Alergias
            </div>
            <div className="text-sm font-semibold">
              {allergiesAndHistory || "—"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

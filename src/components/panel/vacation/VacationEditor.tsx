"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createVacation } from "@/lib/vacation/createVacation";
import { updateVacation } from "@/lib/vacation/updateVacation";
import { deleteVacation } from "@/lib/vacation/deleteVacation";
import type { VacationInput } from "@/lib/vacation/isValidVacationInput";
import { VacationForm } from "./VacationForm";
import { VacationList, type Vacation } from "./VacationList";

export interface VacationEditorProps {
  today: string;
  locations: { id: string; name: string }[];
  vacations: Vacation[];
}

type FormState = { mode: "create" } | { mode: "edit"; vacation: Vacation };

export function VacationEditor({
  today,
  locations,
  vacations,
}: VacationEditorProps) {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>({ mode: "create" });
  const [formError, setFormError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function handleSubmit(input: VacationInput) {
    startTransition(async () => {
      try {
        if (formState.mode === "edit") {
          await updateVacation({
            vacationId: formState.vacation.id,
            ...input,
          });
        } else {
          await createVacation(input);
        }
        setFormError(null);
        setFormState({ mode: "create" });
        router.refresh();
      } catch (error) {
        setFormError(
          error instanceof Error
            ? error.message
            : "No se pudo guardar el periodo.",
        );
      }
    });
  }

  function handleRemove(id: string) {
    startTransition(async () => {
      await deleteVacation(id);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-[13px] font-semibold text-muted">
          Periodos sin atención
        </div>
        <h1 className="mt-0.5 text-xl font-extrabold">Vacaciones</h1>
      </div>

      <VacationForm
        key={formState.mode === "edit" ? formState.vacation.id : "create"}
        locations={locations}
        initialValue={
          formState.mode === "edit" ? formState.vacation : undefined
        }
        onSubmit={handleSubmit}
        onCancel={
          formState.mode === "edit"
            ? () => {
                setFormState({ mode: "create" });
                setFormError(null);
              }
            : undefined
        }
        error={formError}
      />

      <div>
        <div className="mb-2.5 text-[15px] font-bold">Próximas vacaciones</div>
        <VacationList
          vacations={vacations}
          today={today}
          onEdit={(vacation) => {
            setFormState({ mode: "edit", vacation });
            setFormError(null);
          }}
          onRemove={handleRemove}
        />
      </div>
    </div>
  );
}

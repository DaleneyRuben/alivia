"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createVacation } from "@/lib/vacation/createVacation";
import { deleteVacation } from "@/lib/vacation/deleteVacation";
import type { VacationInput } from "@/lib/vacation/isValidVacationInput";
import { VacationForm } from "./VacationForm";
import { VacationList, type Vacation } from "./VacationList";

export interface VacationEditorProps {
  today: string;
  locations: { id: string; name: string }[];
  vacations: Vacation[];
}

export function VacationEditor({
  today,
  locations,
  vacations,
}: VacationEditorProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  function handleSubmit(input: VacationInput) {
    startTransition(async () => {
      await createVacation(input);
      router.refresh();
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

      <VacationForm locations={locations} onSubmit={handleSubmit} />

      <div>
        <div className="mb-2.5 text-[15px] font-bold">Próximas vacaciones</div>
        <VacationList
          vacations={vacations}
          today={today}
          onRemove={handleRemove}
        />
      </div>
    </div>
  );
}

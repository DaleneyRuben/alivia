"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LocationSwitcher } from "./LocationSwitcher";
import { ScheduleBlockList, type ScheduleBlock } from "./ScheduleBlockList";
import { ScheduleBlockForm } from "./ScheduleBlockForm";
import { createScheduleBlock } from "@/lib/schedule/createScheduleBlock";
import { updateScheduleBlock } from "@/lib/schedule/updateScheduleBlock";
import { deleteScheduleBlock } from "@/lib/schedule/deleteScheduleBlock";
import type { ScheduleBlockInput } from "@/lib/schedule/isValidScheduleBlockInput";

export interface ScheduleLocation {
  id: string;
  name: string;
  scheduleBlocks: ScheduleBlock[];
}

export interface ScheduleEditorProps {
  locations: ScheduleLocation[];
}

type FormState =
  { mode: "closed" } | { mode: "add" } | { mode: "edit"; block: ScheduleBlock };

export function ScheduleEditor({ locations }: ScheduleEditorProps) {
  const router = useRouter();
  const [activeLocationId, setActiveLocationId] = useState(
    locations[0]?.id ?? "",
  );
  const [formState, setFormState] = useState<FormState>({ mode: "closed" });
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const activeLocation = locations.find((l) => l.id === activeLocationId);

  function handleSubmit(input: ScheduleBlockInput) {
    startTransition(async () => {
      try {
        if (formState.mode === "edit") {
          await updateScheduleBlock({ blockId: formState.block.id, ...input });
        } else {
          await createScheduleBlock({ locationId: activeLocationId, ...input });
        }
        setFormError(null);
        setFormState({ mode: "closed" });
        router.refresh();
      } catch (error) {
        setFormError(
          error instanceof Error
            ? error.message
            : "No se pudo guardar el horario.",
        );
      }
    });
  }

  function handleRemove(blockId: string) {
    startTransition(async () => {
      await deleteScheduleBlock(blockId);
      router.refresh();
    });
  }

  if (!activeLocation) {
    return (
      <p className="text-sm text-muted">
        No hay ubicaciones registradas todavía.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <LocationSwitcher
        locations={locations}
        activeId={activeLocationId}
        onSelect={(id) => {
          setActiveLocationId(id);
          setFormState({ mode: "closed" });
          setFormError(null);
        }}
      />
      <ScheduleBlockList
        blocks={activeLocation.scheduleBlocks}
        onEdit={(block) => {
          setFormState({ mode: "edit", block });
          setFormError(null);
        }}
        onRemove={handleRemove}
      />
      {formState.mode === "closed" ? (
        <button
          type="button"
          onClick={() => setFormState({ mode: "add" })}
          className="cursor-pointer self-start rounded-full border border-terracotta px-4 py-2 text-[13px] font-semibold text-terracotta-deep"
        >
          + Agregar bloque
        </button>
      ) : (
        <ScheduleBlockForm
          initialValue={formState.mode === "edit" ? formState.block : undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setFormState({ mode: "closed" });
            setFormError(null);
          }}
          error={formError}
        />
      )}
      {isPending && <p className="text-xs text-muted">Guardando…</p>}
    </div>
  );
}

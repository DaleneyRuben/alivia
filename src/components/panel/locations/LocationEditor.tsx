"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LocationList, type Location } from "./LocationList";
import { LocationForm } from "./LocationForm";
import { createLocation } from "@/lib/locations/createLocation";
import { updateLocation } from "@/lib/locations/updateLocation";
import { deleteLocation } from "@/lib/locations/deleteLocation";
import type { LocationInput } from "@/lib/locations/isValidLocationInput";

export interface LocationEditorProps {
  locations: Location[];
}

type FormState =
  { mode: "closed" } | { mode: "add" } | { mode: "edit"; location: Location };

export function LocationEditor({ locations }: LocationEditorProps) {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>({ mode: "closed" });
  const [isPending, startTransition] = useTransition();

  function handleSubmit(input: LocationInput) {
    startTransition(async () => {
      if (formState.mode === "edit") {
        await updateLocation({ locationId: formState.location.id, ...input });
      } else {
        await createLocation(input);
      }
      setFormState({ mode: "closed" });
      router.refresh();
    });
  }

  function handleRemove(locationId: string) {
    startTransition(async () => {
      await deleteLocation(locationId);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <LocationList
        locations={locations}
        onEdit={(location) => setFormState({ mode: "edit", location })}
        onRemove={handleRemove}
      />
      {formState.mode === "closed" ? (
        <button
          type="button"
          onClick={() => setFormState({ mode: "add" })}
          className="cursor-pointer self-start rounded-full border border-terracotta px-4 py-2 text-[13px] font-semibold text-terracotta-deep"
        >
          + Nueva ubicación
        </button>
      ) : (
        <LocationForm
          initialValue={
            formState.mode === "edit"
              ? {
                  name: formState.location.name,
                  address: formState.location.address,
                }
              : undefined
          }
          onSubmit={handleSubmit}
          onCancel={() => setFormState({ mode: "closed" })}
        />
      )}
      {isPending && <p className="text-xs text-muted">Guardando…</p>}
    </div>
  );
}

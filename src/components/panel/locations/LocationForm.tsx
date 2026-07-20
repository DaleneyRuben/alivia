"use client";

import { useState } from "react";
import {
  isValidLocationInput,
  type LocationInput,
} from "@/lib/locations/isValidLocationInput";

export interface LocationFormProps {
  initialValue?: LocationInput;
  onSubmit: (input: LocationInput) => void;
  onCancel?: () => void;
}

export function LocationForm({
  initialValue,
  onSubmit,
  onCancel,
}: LocationFormProps) {
  const [name, setName] = useState(initialValue?.name ?? "");
  const [address, setAddress] = useState(initialValue?.address ?? "");

  const input: LocationInput = { name, address };
  const valid = isValidLocationInput(input);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!valid) return;
    onSubmit(input);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3.5 rounded-[16px] border border-terracotta bg-white p-4"
    >
      <div>
        <label
          htmlFor="name"
          className="mb-1.5 block text-[13px] font-semibold"
        >
          Nombre
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-[14px] border border-input-border px-3 py-2 text-sm outline-none focus:border-terracotta"
        />
      </div>
      <div>
        <label
          htmlFor="address"
          className="mb-1.5 block text-[13px] font-semibold"
        >
          Dirección
        </label>
        <input
          id="address"
          type="text"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          className="w-full rounded-[14px] border border-input-border px-3 py-2 text-sm outline-none focus:border-terracotta"
        />
      </div>
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={!valid}
          className="cursor-pointer rounded-full bg-terracotta px-5 py-2.5 text-[14px] font-bold text-white disabled:cursor-not-allowed disabled:bg-terracotta-disabled"
        >
          {initialValue ? "Guardar cambios" : "Agregar ubicación"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded-full px-4 py-2.5 text-[14px] font-semibold text-muted"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

"use client";

import { useId, useState } from "react";
import {
  isValidVacationInput,
  type VacationInput,
} from "@/lib/vacation/isValidVacationInput";

export interface VacationFormProps {
  locations: { id: string; name: string }[];
  onSubmit: (input: VacationInput) => void;
}

const ALL_LOCATIONS = "";

export function VacationForm({ locations, onSubmit }: VacationFormProps) {
  const locationFieldId = useId();
  const startFieldId = useId();
  const endFieldId = useId();

  const [locationId, setLocationId] = useState(ALL_LOCATIONS);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const input: VacationInput = {
    locationId: locationId || null,
    startDate,
    endDate,
  };
  const valid = isValidVacationInput(input);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!valid) return;
    onSubmit(input);
    setStartDate("");
    setEndDate("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[18px] border border-card-border bg-white p-4.5"
    >
      <div className="mb-3 text-[15px] font-bold">
        Marcar periodo no disponible
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[130px] flex-1">
          <label
            htmlFor={locationFieldId}
            className="mb-1.5 block text-[12.5px] font-semibold"
          >
            Ubicación
          </label>
          <select
            id={locationFieldId}
            value={locationId}
            onChange={(event) => setLocationId(event.target.value)}
            className="w-full rounded-[12px] border border-input-border bg-white px-3.5 py-[11px] text-sm outline-none focus:border-terracotta"
          >
            <option value={ALL_LOCATIONS}>Todas las ubicaciones</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-[130px] flex-1">
          <label
            htmlFor={startFieldId}
            className="mb-1.5 block text-[12.5px] font-semibold"
          >
            Desde
          </label>
          <input
            id={startFieldId}
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            className="w-full rounded-[12px] border border-input-border bg-white px-3.5 py-[11px] text-sm outline-none focus:border-terracotta"
          />
        </div>
        <div className="min-w-[130px] flex-1">
          <label
            htmlFor={endFieldId}
            className="mb-1.5 block text-[12.5px] font-semibold"
          >
            Hasta
          </label>
          <input
            id={endFieldId}
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
            className="w-full rounded-[12px] border border-input-border bg-white px-3.5 py-[11px] text-sm outline-none focus:border-terracotta"
          />
        </div>
        <button
          type="submit"
          disabled={!valid}
          className="cursor-pointer rounded-full bg-terracotta px-5 py-3 text-[13.5px] font-bold text-white disabled:cursor-not-allowed disabled:bg-terracotta-disabled"
        >
          Agregar
        </button>
      </div>
    </form>
  );
}

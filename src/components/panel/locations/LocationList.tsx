"use client";

import { useState } from "react";

export interface Location {
  id: string;
  name: string;
  address: string;
  scheduleBlockCount: number;
}

export interface LocationListProps {
  locations: Location[];
  onEdit: (location: Location) => void;
  onRemove: (locationId: string) => void;
}

function blocksNote(count: number): string {
  if (count === 0) return "Sin bloques de horario";
  return `${count} ${count === 1 ? "bloque" : "bloques"} de horario ${count === 1 ? "activo" : "activos"}`;
}

export function LocationList({
  locations,
  onEdit,
  onRemove,
}: LocationListProps) {
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  if (locations.length === 0) {
    return (
      <p className="text-sm text-muted">
        No hay ubicaciones registradas todavía.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {locations.map((location) => (
        <div
          key={location.id}
          className="flex flex-col gap-3 rounded-[16px] border border-card-border bg-white p-4"
        >
          <div className="flex flex-wrap items-center gap-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[#F7F2EA] text-terracotta-deep">
              ⌂
            </span>
            <div className="min-w-[150px] flex-1">
              <div className="text-[15px] font-bold">{location.name}</div>
              <div className="text-[13px] text-muted">{location.address}</div>
              <div className="mt-1 text-xs text-body-soft">
                {blocksNote(location.scheduleBlockCount)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEdit(location)}
                className="cursor-pointer rounded-full border border-input-border px-3.5 py-1.5 text-[13px] font-semibold text-ink"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() =>
                  location.scheduleBlockCount > 0
                    ? setConfirmingId(location.id)
                    : onRemove(location.id)
                }
                className="cursor-pointer rounded-full border border-terracotta px-3.5 py-1.5 text-[13px] font-semibold text-terracotta-deep"
              >
                Quitar
              </button>
            </div>
          </div>
          {confirmingId === location.id && (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-[12px] bg-error-bg p-3">
              <p className="text-[13px] text-terracotta-deep">
                Esta ubicación tiene horarios activos. Si la quitas, sus bloques
                de horario se eliminarán y dejará de generar cupos futuros.
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setConfirmingId(null);
                    onRemove(location.id);
                  }}
                  className="cursor-pointer rounded-full bg-terracotta-deep px-3.5 py-1.5 text-[13px] font-semibold text-white"
                >
                  Confirmar
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingId(null)}
                  className="cursor-pointer rounded-full px-3.5 py-1.5 text-[13px] font-semibold text-muted"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

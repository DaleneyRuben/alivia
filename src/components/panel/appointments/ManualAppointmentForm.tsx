"use client";

import { useState } from "react";
import { formatMinutes } from "@/lib/schedule/formatTimeRange";
import {
  isValidManualAppointmentInput,
  type ManualAppointmentInput,
} from "@/lib/appointments/isValidManualAppointmentInput";
import { PhoneInput } from "@/components/ui/PhoneInput";

export interface AvailableSlotOption {
  startMinutes: number;
  endMinutes: number;
  full: boolean;
}

export interface ManualAppointmentFormProps {
  locationId: string;
  date: string;
  slots: AvailableSlotOption[];
  onSubmit: (input: ManualAppointmentInput) => void;
  onCancel: () => void;
}

export function ManualAppointmentForm({
  locationId,
  date,
  slots,
  onSubmit,
  onCancel,
}: ManualAppointmentFormProps) {
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [selected, setSelected] = useState<AvailableSlotOption | null>(null);

  const input: ManualAppointmentInput = {
    patientName,
    patientPhone,
    locationId,
    date,
    startMinutes: selected?.startMinutes ?? 0,
    endMinutes: selected?.endMinutes ?? 0,
  };
  const valid = isValidManualAppointmentInput(input);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!valid) return;
    onSubmit(input);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3.5 rounded-[18px] border border-terracotta bg-white p-4.5"
    >
      <div>
        <div className="mb-1 text-[15px] font-bold">Agregar cita manual</div>
        <p className="mb-3.5 text-xs text-muted">
          Para pacientes que llegan sin cita o llaman por teléfono.
        </p>
        <div className="mb-3 flex flex-wrap gap-2.5">
          <input
            value={patientName}
            onChange={(event) => setPatientName(event.target.value)}
            placeholder="Nombre del paciente"
            className="min-w-[150px] flex-1 rounded-[12px] border border-input-border bg-white px-3.5 py-[11px] text-sm outline-none focus:border-terracotta"
          />
          <div className="min-w-[150px] flex-1">
            <PhoneInput
              id="manual-patient-phone"
              onChange={setPatientPhone}
              placeholder="7XX XXX XX"
              variant="compact"
            />
          </div>
        </div>
        <div className="mb-2 text-xs font-semibold text-muted">
          Elige el cupo
        </div>
        <div className="mb-3 flex flex-wrap gap-2">
          {slots.map((slot) => {
            const active = selected?.startMinutes === slot.startMinutes;
            const label = slot.full
              ? `${formatMinutes(slot.startMinutes)} · lleno`
              : formatMinutes(slot.startMinutes);
            const className = active
              ? "bg-terracotta text-white border border-terracotta"
              : slot.full
                ? "bg-warning-bg text-warning border border-warning-border"
                : "bg-white text-ink border border-input-border";
            return (
              <button
                key={slot.startMinutes}
                type="button"
                onClick={() => setSelected(slot)}
                className={`cursor-pointer rounded-full px-3.5 py-2 text-[13px] font-semibold ${className}`}
              >
                {label}
              </button>
            );
          })}
        </div>
        {selected?.full && (
          <div className="mb-3 flex items-start gap-2 rounded-[12px] border border-warning-border bg-warning-bg p-3 text-[12.5px] font-semibold text-warning">
            ⚠ Este cupo ya alcanzó su capacidad para pacientes. Puedes
            sobrecuparlo como excepción del personal — el paciente se sumará a
            la cola.
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={!valid}
          className="cursor-pointer rounded-full bg-terracotta px-5 py-2.5 text-[13.5px] font-bold text-white disabled:cursor-not-allowed disabled:bg-terracotta-disabled"
        >
          Agregar a la cola
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer rounded-full border border-input-border px-4.5 py-2.5 text-[13.5px] font-semibold text-body-soft"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

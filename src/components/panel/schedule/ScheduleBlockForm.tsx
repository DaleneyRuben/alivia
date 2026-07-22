"use client";

import { useState } from "react";
import { formatMinutes } from "@/lib/schedule/formatTimeRange";
import {
  isValidScheduleBlockInput,
  type ScheduleBlockInput,
} from "@/lib/schedule/isValidScheduleBlockInput";

const DAY_OPTIONS = [
  { value: 1, label: "Lun" },
  { value: 2, label: "Mar" },
  { value: 3, label: "Mié" },
  { value: 4, label: "Jue" },
  { value: 5, label: "Vie" },
  { value: 6, label: "Sáb" },
  { value: 0, label: "Dom" },
];

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export interface ScheduleBlockFormProps {
  initialValue?: ScheduleBlockInput;
  onSubmit: (input: ScheduleBlockInput) => void;
  onCancel?: () => void;
  error?: string | null;
}

export function ScheduleBlockForm({
  initialValue,
  onSubmit,
  onCancel,
  error,
}: ScheduleBlockFormProps) {
  const [weekdays, setWeekdays] = useState<number[]>(
    initialValue?.weekdays ?? [],
  );
  const [startTime, setStartTime] = useState(
    initialValue ? formatMinutes(initialValue.startMinutes) : "",
  );
  const [endTime, setEndTime] = useState(
    initialValue ? formatMinutes(initialValue.endMinutes) : "",
  );
  const [duration, setDuration] = useState(
    initialValue ? String(initialValue.slotDurationMinutes) : "",
  );
  const [capacity, setCapacity] = useState(
    initialValue ? String(initialValue.slotCapacity) : "",
  );

  function toggleDay(day: number) {
    setWeekdays((current) =>
      current.includes(day)
        ? current.filter((d) => d !== day)
        : [...current, day].sort((a, b) => a - b),
    );
  }

  const input: ScheduleBlockInput = {
    weekdays,
    startMinutes: startTime ? toMinutes(startTime) : 0,
    endMinutes: endTime ? toMinutes(endTime) : 0,
    slotDurationMinutes: Number(duration) || 0,
    slotCapacity: Number(capacity) || 0,
  };
  const valid = isValidScheduleBlockInput(input);

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
      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-[13px] border border-error-border bg-error-bg px-3.5 py-[11px] text-[13px] font-semibold text-terracotta-dark"
        >
          ⚠ {error}
        </div>
      )}
      <div>
        <span className="mb-1.5 block text-[13px] font-semibold">Días</span>
        <div className="flex flex-wrap gap-1.5">
          {DAY_OPTIONS.map((day) => {
            const active = weekdays.includes(day.value);
            return (
              <button
                key={day.value}
                type="button"
                aria-pressed={active}
                onClick={() => toggleDay(day.value)}
                className={`cursor-pointer rounded-full px-3 py-1.5 text-[13px] font-semibold ${
                  active
                    ? "bg-ink text-white"
                    : "border border-input-border bg-white text-ink"
                }`}
              >
                {day.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <div>
          <label
            htmlFor="startTime"
            className="mb-1.5 block text-[13px] font-semibold"
          >
            Hora de inicio
          </label>
          <input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
            className="rounded-[12px] border border-input-border bg-white px-[13px] py-[10px] text-[13.5px] outline-none focus:border-terracotta"
          />
        </div>
        <div>
          <label
            htmlFor="endTime"
            className="mb-1.5 block text-[13px] font-semibold"
          >
            Hora de fin
          </label>
          <input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(event) => setEndTime(event.target.value)}
            className="rounded-[12px] border border-input-border bg-white px-[13px] py-[10px] text-[13.5px] outline-none focus:border-terracotta"
          />
        </div>
        <div>
          <label
            htmlFor="duration"
            className="mb-1.5 block text-[13px] font-semibold"
          >
            Duración del turno (min)
          </label>
          <input
            id="duration"
            type="number"
            min={1}
            value={duration}
            onChange={(event) => setDuration(event.target.value)}
            className="w-[110px] rounded-[12px] border border-input-border bg-white px-[13px] py-[10px] text-[13.5px] outline-none focus:border-terracotta"
          />
        </div>
        <div>
          <label
            htmlFor="capacity"
            className="mb-1.5 block text-[13px] font-semibold"
          >
            Capacidad
          </label>
          <input
            id="capacity"
            type="number"
            min={1}
            value={capacity}
            onChange={(event) => setCapacity(event.target.value)}
            className="w-[90px] rounded-[12px] border border-input-border bg-white px-[13px] py-[10px] text-[13.5px] outline-none focus:border-terracotta"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={!valid}
          className="cursor-pointer rounded-full bg-terracotta px-5 py-2.5 text-[14px] font-bold text-white disabled:cursor-not-allowed disabled:bg-terracotta-disabled"
        >
          {initialValue ? "Guardar cambios" : "Agregar bloque"}
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

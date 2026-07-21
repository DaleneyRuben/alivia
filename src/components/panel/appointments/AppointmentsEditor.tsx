"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LocationSwitcher } from "@/components/panel/schedule/LocationSwitcher";
import { formatSpanishDate } from "@/lib/time/formatSpanishDate";
import { createManualAppointment } from "@/lib/appointments/createManualAppointment";
import { updateAppointmentStatus } from "@/lib/appointments/updateAppointmentStatus";
import { AppointmentList, type Appointment } from "./AppointmentList";
import { ManualAppointmentForm } from "./ManualAppointmentForm";

export interface EditorAppointment extends Appointment {
  locationId: string;
  date: string;
}

export interface EditorSlot {
  locationId: string;
  date: string;
  startMinutes: number;
  endMinutes: number;
  availableToPatients: boolean;
}

export interface AppointmentsEditorProps {
  locations: { id: string; name: string }[];
  today: string;
  tomorrow: string;
  appointments: EditorAppointment[];
  slots: EditorSlot[];
}

type Day = "hoy" | "manana";

export function AppointmentsEditor({
  locations,
  today,
  tomorrow,
  appointments,
  slots,
}: AppointmentsEditorProps) {
  const router = useRouter();
  const [activeDay, setActiveDay] = useState<Day>("hoy");
  const [activeLocationId, setActiveLocationId] = useState(
    locations[0]?.id ?? "",
  );
  const [formOpen, setFormOpen] = useState(false);
  const [, startTransition] = useTransition();

  const selectedDate = activeDay === "hoy" ? today : tomorrow;
  const activeLocation = locations.find((l) => l.id === activeLocationId);

  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.locationId === activeLocationId &&
      appointment.date === selectedDate,
  );

  const pickerSlots = slots
    .filter(
      (slot) =>
        slot.locationId === activeLocationId && slot.date === selectedDate,
    )
    .sort((a, b) => a.startMinutes - b.startMinutes)
    .map((slot) => ({
      startMinutes: slot.startMinutes,
      endMinutes: slot.endMinutes,
      full: !slot.availableToPatients,
    }));

  function handleAttend(id: string) {
    startTransition(async () => {
      await updateAppointmentStatus(id, "ATTENDED");
      router.refresh();
    });
  }

  function handleNoShow(id: string) {
    startTransition(async () => {
      await updateAppointmentStatus(id, "NO_SHOW");
      router.refresh();
    });
  }

  function handleCancel(id: string) {
    startTransition(async () => {
      await updateAppointmentStatus(id, "CANCELLED");
      router.refresh();
    });
  }

  function handleManualSubmit(
    input: Parameters<typeof createManualAppointment>[0],
  ) {
    startTransition(async () => {
      await createManualAppointment(input);
      setFormOpen(false);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-2.5">
        <div>
          <div className="text-[13px] font-semibold text-muted">Agenda</div>
          <h1 className="mt-0.5 text-xl font-extrabold">Citas</h1>
        </div>
        <button
          type="button"
          onClick={() => setFormOpen((open) => !open)}
          className="cursor-pointer rounded-full bg-terracotta px-5 py-2.5 text-[13.5px] font-bold text-white"
        >
          + Agregar cita
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div>
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
            Día
          </div>
          <div className="flex gap-1.5">
            {[
              { key: "hoy" as const, label: "Hoy" },
              { key: "manana" as const, label: "Mañana" },
            ].map((day) => (
              <button
                key={day.key}
                type="button"
                aria-current={activeDay === day.key ? "true" : undefined}
                onClick={() => setActiveDay(day.key)}
                className={`cursor-pointer rounded-full px-3.5 py-2 text-[12.5px] font-semibold ${
                  activeDay === day.key
                    ? "bg-ink text-white"
                    : "border border-input-border bg-white text-ink"
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
            Ubicación
          </div>
          <LocationSwitcher
            locations={locations}
            activeId={activeLocationId}
            onSelect={setActiveLocationId}
          />
        </div>
      </div>

      {formOpen && (
        <ManualAppointmentForm
          locationId={activeLocationId}
          date={selectedDate}
          slots={pickerSlots}
          onSubmit={handleManualSubmit}
          onCancel={() => setFormOpen(false)}
        />
      )}

      <AppointmentList
        appointments={filteredAppointments}
        onAttend={handleAttend}
        onNoShow={handleNoShow}
        onCancel={handleCancel}
        header={
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F0E9DE] px-4.5 py-3.5">
            <span className="text-[15px] font-bold">
              {formatSpanishDate(selectedDate)}
            </span>
            <span className="text-[12.5px] font-medium text-muted">
              {activeLocation?.name}
            </span>
          </div>
        }
      />
    </div>
  );
}

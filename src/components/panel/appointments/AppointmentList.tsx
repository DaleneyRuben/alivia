import type { ReactNode } from "react";
import { formatMinutes } from "@/lib/schedule/formatTimeRange";
import { initials } from "@/lib/text/initials";
import { laPazDateTimeToUtc } from "@/lib/time/laPazDateTimeToUtc";

export interface Appointment {
  id: string;
  date: string;
  startMinutes: number;
  patientName: string;
  patientPhone: string;
  status: "SCHEDULED" | "ATTENDED" | "NO_SHOW" | "CANCELLED";
  source: "PATIENT" | "STAFF";
}

export interface AppointmentListProps {
  appointments: Appointment[];
  onAttend: (id: string) => void;
  onNoShow: (id: string) => void;
  onCancel: (id: string) => void;
  header?: ReactNode;
  now?: Date;
}

function statusPill(status: Appointment["status"]) {
  if (status === "ATTENDED") {
    return { text: "Asistió", className: "bg-success-bg text-success" };
  }
  if (status === "NO_SHOW") {
    return {
      text: "No asistió",
      className: "bg-error-bg text-terracotta-deep",
    };
  }
  if (status === "CANCELLED") {
    return { text: "Cancelada", className: "bg-[#F7F2EA] text-muted" };
  }
  return null;
}

export function AppointmentList({
  appointments,
  onAttend,
  onNoShow,
  onCancel,
  header,
  now,
}: AppointmentListProps) {
  const effectiveNow = now ?? new Date();
  const nextId = appointments.find((a) => a.status === "SCHEDULED")?.id;

  return (
    <div className="overflow-hidden rounded-[18px] border border-card-border bg-white">
      {header}
      {appointments.length === 0 && (
        <p className="p-4.5 text-sm text-muted">
          No hay citas para este día y ubicación.
        </p>
      )}
      {appointments.map((appointment) => {
        const pending = appointment.status === "SCHEDULED";
        const hasPassed =
          laPazDateTimeToUtc(
            appointment.date,
            appointment.startMinutes,
          ).getTime() <= effectiveNow.getTime();
        const isNext = appointment.id === nextId;
        const tag = isNext
          ? "Siguiente"
          : appointment.source === "STAFF"
            ? "Walk-in"
            : null;
        const pill = statusPill(appointment.status);

        return (
          <div
            key={appointment.id}
            className={`flex flex-wrap items-center gap-3.5 border-b border-[#F7F2EA] p-3.5 last:border-b-0 ${
              isNext ? "bg-[#FCF8F2]" : ""
            }`}
          >
            <span className="w-[52px] text-sm font-extrabold">
              {formatMinutes(appointment.startMinutes)}
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F7F2EA] text-[13px] font-bold text-body-soft">
              {initials(appointment.patientName)}
            </div>
            <div className="min-w-[120px] flex-1">
              <div className="flex flex-wrap items-center gap-1.5 text-sm font-semibold">
                {appointment.patientName}
                {tag && (
                  <span className="rounded-full bg-[#F3ECE1] px-2 py-0.5 text-[11px] font-semibold text-muted">
                    {tag}
                  </span>
                )}
              </div>
              <div className="text-xs text-muted">
                {appointment.patientPhone}
              </div>
            </div>
            {pending ? (
              <div className="flex flex-wrap gap-1.5">
                {hasPassed && (
                  <>
                    <button
                      type="button"
                      onClick={() => onAttend(appointment.id)}
                      className="cursor-pointer rounded-full bg-success px-3.5 py-2 text-xs font-bold text-white"
                    >
                      Asistió
                    </button>
                    <button
                      type="button"
                      onClick={() => onNoShow(appointment.id)}
                      className="cursor-pointer rounded-full border border-input-border px-3.5 py-2 text-xs font-semibold text-muted"
                    >
                      No asistió
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => onCancel(appointment.id)}
                  className="cursor-pointer rounded-full border border-error-border px-3.5 py-2 text-xs font-semibold text-terracotta-deep"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              pill && (
                <span
                  className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold ${pill.className}`}
                >
                  {pill.text}
                </span>
              )
            )}
          </div>
        );
      })}
    </div>
  );
}

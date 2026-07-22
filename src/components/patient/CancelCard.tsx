"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { initials } from "@/lib/text/initials";
import { avatarTint } from "@/lib/text/avatarTint";
import { formatMinutes } from "@/lib/schedule/formatTimeRange";
import { cancelGuestAppointment } from "@/lib/patients/cancelGuestAppointment";
import type { TokenAppointment } from "@/lib/patients/getAppointmentByCancelToken";

export interface CancelCardProps {
  appointment: TokenAppointment;
}

export function CancelCard({ appointment }: CancelCardProps) {
  const [cancelled, setCancelled] = useState(
    appointment.status === "CANCELLED",
  );
  const [isPending, startTransition] = useTransition();
  const tint = avatarTint(appointment.doctorName);

  function handleCancel() {
    startTransition(async () => {
      await cancelGuestAppointment(appointment.cancelToken);
      setCancelled(true);
    });
  }

  if (cancelled) {
    return (
      <div className="mx-auto w-full max-w-[440px] px-6 py-9 pb-11 text-center">
        <div className="mx-auto mb-4 flex h-15 w-15 items-center justify-center rounded-full bg-[#F5E0D8] text-2xl text-terracotta-deep">
          ✕
        </div>
        <h1 className="m-0 mb-1.5 text-[22px] font-extrabold tracking-[-0.4px]">
          Tu cita fue cancelada
        </h1>
        <p className="mb-5.5 text-sm leading-normal text-muted">
          Liberamos tu cupo. Puedes reservar otra cuando lo necesites.
        </p>
        <Link
          href="/"
          className="inline-block rounded-full bg-terracotta px-6.5 py-3.5 text-[15px] font-bold text-white no-underline"
        >
          Buscar otro horario
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[440px] px-6 py-9 pb-11 text-center">
      <h1 className="m-0 mb-1.5 text-[22px] font-extrabold tracking-[-0.4px]">
        ¿Cancelar tu cita?
      </h1>
      <p className="mb-5.5 text-sm leading-normal text-muted">
        Si cancelas, tu cupo quedará libre para otra persona.
      </p>
      <div className="mb-5.5 rounded-2xl border border-card-border bg-white p-4 text-left">
        <div className="mb-3 flex items-center gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold"
            style={{ backgroundColor: tint.bg, color: tint.text }}
          >
            {initials(appointment.doctorName)}
          </div>
          <div>
            <div className="text-sm font-bold">{appointment.doctorName}</div>
            <div className="text-[11.5px] text-muted">
              {appointment.specialty}
            </div>
          </div>
        </div>
        <div className="flex justify-between border-t border-[#F0E9DE] pt-3 text-[13px]">
          <span className="text-muted">Tu cita</span>
          <span className="font-bold">
            {formatMinutes(appointment.startMinutes)}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={handleCancel}
        disabled={isPending}
        className="mb-2.5 w-full cursor-pointer rounded-full bg-terracotta py-3.5 text-[15px] font-bold text-white disabled:cursor-not-allowed disabled:bg-terracotta-disabled"
      >
        Sí, cancelar cita
      </button>
      <Link
        href={`/confirmation/${appointment.cancelToken}`}
        className="block w-full rounded-full border border-input-border bg-white py-3 text-center text-sm font-semibold text-ink no-underline"
      >
        Mantener mi cita
      </Link>
    </div>
  );
}

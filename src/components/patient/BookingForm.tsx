"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { initials } from "@/lib/text/initials";
import { avatarTint } from "@/lib/text/avatarTint";
import { formatMinutes } from "@/lib/schedule/formatTimeRange";
import { formatSpanishDate } from "@/lib/time/formatSpanishDate";
import { isValidGuestBookingInput } from "@/lib/patients/isValidGuestBookingInput";
import { createGuestAppointment } from "@/lib/patients/createGuestAppointment";
import type { BookingSummary } from "@/lib/patients/getBookingSummary";
import { PhoneInput } from "@/components/ui/PhoneInput";

export interface BookingFormProps {
  summary: BookingSummary;
}

export function BookingForm({ summary }: BookingFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isPending, startTransition] = useTransition();
  const tint = avatarTint(summary.doctorId);
  const canConfirm = isValidGuestBookingInput({ name, phone });

  function handleSubmit() {
    if (!canConfirm) return;
    startTransition(async () => {
      await createGuestAppointment({
        doctorId: summary.doctorId,
        locationId: summary.locationId,
        date: summary.date,
        startMinutes: summary.startMinutes,
        name,
        phone,
      });
    });
  }

  return (
    <div className="mx-auto w-full max-w-[560px] px-6 py-5 pb-11">
      <Link
        href={`/doctors/${summary.doctorId}`}
        className="mb-4 inline-block text-sm font-semibold text-muted no-underline"
      >
        ← Cambiar horario
      </Link>
      <h1 className="m-0 mb-1 text-[26px] font-extrabold tracking-[-0.5px]">
        Confirma tu cita
      </h1>
      <p className="mb-5 text-sm text-muted">
        Falta poco. Solo necesitamos tus datos de contacto.
      </p>

      <div className="mb-5.5 flex flex-wrap items-center gap-3.5 rounded-[18px] border border-card-border bg-white p-4.5">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[17px] font-bold"
          style={{ backgroundColor: tint.bg, color: tint.text }}
        >
          {initials(summary.doctorName)}
        </div>
        <div className="min-w-[150px] flex-1">
          <div className="text-base font-bold">{summary.doctorName}</div>
          <div className="text-[13px] text-muted">{summary.locationName}</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-extrabold text-success">
            {formatMinutes(summary.startMinutes)}
          </div>
          <div className="text-xs text-muted">
            {formatSpanishDate(summary.date)}
          </div>
        </div>
      </div>

      {!summary.isAvailable ? (
        <p className="text-sm text-muted">
          Este horario ya no está disponible.
        </p>
      ) : (
        <div className="flex flex-col gap-3.5">
          <div>
            <label
              htmlFor="guest-name"
              className="mb-1.5 block text-[13px] font-semibold"
            >
              Nombre completo
            </label>
            <input
              id="guest-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-[14px] border border-input-border px-4 py-3 text-sm outline-none focus:border-terracotta"
            />
          </div>
          <div>
            <label
              htmlFor="guest-phone"
              className="mb-1.5 block text-[13px] font-semibold"
            >
              Número de teléfono (WhatsApp)
            </label>
            <PhoneInput id="guest-phone" onChange={setPhone} />
            <div className="mt-1.5 text-xs text-muted">
              Te enviaremos la confirmación a este número.
            </div>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canConfirm || isPending}
            className="cursor-pointer rounded-full bg-terracotta px-6 py-3.5 text-[15px] font-bold text-white disabled:cursor-not-allowed disabled:bg-terracotta-disabled"
          >
            Confirmar reserva
          </button>
        </div>
      )}
    </div>
  );
}

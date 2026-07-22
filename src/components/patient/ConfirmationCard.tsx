import Link from "next/link";
import { initials } from "@/lib/text/initials";
import { avatarTint } from "@/lib/text/avatarTint";
import { formatMinutes } from "@/lib/schedule/formatTimeRange";
import { formatSpanishDate } from "@/lib/time/formatSpanishDate";
import { buildWhatsAppLink } from "@/lib/whatsapp/buildWhatsAppLink";
import { buildBookingConfirmationMessage } from "@/lib/patients/buildBookingConfirmationMessage";
import type { TokenAppointment } from "@/lib/patients/getAppointmentByCancelToken";

export interface ConfirmationCardProps {
  appointment: TokenAppointment;
}

export function ConfirmationCard({ appointment }: ConfirmationCardProps) {
  const tint = avatarTint(appointment.doctorName);
  const firstName = appointment.patientName.trim().split(/\s+/)[0];
  const whatsAppUrl = buildWhatsAppLink({
    phone: appointment.patientPhone,
    message: buildBookingConfirmationMessage({
      doctorName: appointment.doctorName,
      locationName: appointment.locationName,
      date: appointment.date,
      startMinutes: appointment.startMinutes,
    }),
  });

  return (
    <div className="mx-auto w-full max-w-[520px] px-6 py-8 pb-11 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-bg text-3xl text-success">
        ✓
      </div>
      <h1 className="m-0 mb-1.5 text-[26px] font-extrabold tracking-[-0.5px]">
        ¡Tu cita está reservada!
      </h1>
      <p className="mb-5.5 text-sm text-muted">
        {firstName}, te esperamos en tu cita.
      </p>

      <div className="mb-5 rounded-[18px] border border-card-border bg-white p-5 text-left">
        <div className="mb-4 flex items-center gap-3.5">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[17px] font-bold"
            style={{ backgroundColor: tint.bg, color: tint.text }}
          >
            {initials(appointment.doctorName)}
          </div>
          <div>
            <div className="text-base font-bold">{appointment.doctorName}</div>
            <div className="text-[13px] text-muted">
              {appointment.specialty}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2.5 border-t border-[#F0E9DE] pt-3.5">
          <div className="flex justify-between text-sm">
            <span className="text-muted">Fecha y hora</span>
            <span className="font-bold">
              {formatSpanishDate(appointment.date)} ·{" "}
              {formatMinutes(appointment.startMinutes)}
            </span>
          </div>
          <div className="flex flex-wrap justify-between gap-4 text-sm">
            <span className="text-muted">Ubicación</span>
            <span className="min-w-0 text-right font-bold">
              {appointment.locationName}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">A nombre de</span>
            <span className="font-bold">{appointment.patientName}</span>
          </div>
        </div>
      </div>

      <a
        href={whatsAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-3 flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp py-3.5 text-[15px] font-bold text-white no-underline"
      >
        ✆ Enviarme la confirmación por WhatsApp
      </a>
      <Link
        href={`/cancel/${appointment.cancelToken}`}
        className="text-[13.5px] font-medium text-muted underline"
      >
        Cancelar esta cita
      </Link>
    </div>
  );
}

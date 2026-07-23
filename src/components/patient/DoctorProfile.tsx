import Link from "next/link";
import { initials } from "@/lib/text/initials";
import { avatarTint } from "@/lib/text/avatarTint";
import { formatNextAvailableLabel } from "@/lib/patients/formatNextAvailableLabel";
import { formatSpanishDate } from "@/lib/time/formatSpanishDate";
import type { PublicDoctorProfile } from "@/lib/patients/getPublicDoctorProfile";
import { SlotPicker } from "./SlotPicker";
import { DoctorProfileCalendar } from "./DoctorProfileCalendar";

export interface DoctorProfileProps {
  doctor: PublicDoctorProfile;
  today: string;
  tomorrow: string;
}

function selectedDateLabel(
  selectedDate: string,
  today: string,
  tomorrow: string,
): string {
  if (selectedDate === today) return "Hoy";
  if (selectedDate === tomorrow) return "Mañana";
  return formatSpanishDate(selectedDate);
}

export function DoctorProfile({ doctor, today, tomorrow }: DoctorProfileProps) {
  const tint = avatarTint(doctor.id);
  const isToday = doctor.soonestSlot?.date === today;

  return (
    <div className="mx-auto w-full max-w-[840px] px-6 py-5 pb-11">
      <Link
        href={`/results?specialty=${encodeURIComponent(doctor.specialty)}`}
        className="mb-4 inline-block text-sm font-semibold text-muted no-underline"
      >
        ← Volver a resultados
      </Link>

      <div className="mb-5.5 flex flex-wrap items-start gap-5">
        <div
          className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full text-[36px] font-bold"
          style={{ backgroundColor: tint.bg, color: tint.text }}
        >
          {initials(doctor.name)}
        </div>
        <div className="min-w-[220px] flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="m-0 text-[26px] font-extrabold tracking-[-0.5px]">
              {doctor.name}
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-success-bg px-2.5 py-1 text-xs font-semibold text-success">
              ✓ Colegio Médico verificado
            </span>
          </div>
          <div className="mt-1 mb-2.5 text-[15px] font-semibold text-terracotta-deep">
            {doctor.specialty}
          </div>
          <div className="flex flex-wrap gap-2">
            {doctor.yearsExperience !== null && (
              <span className="rounded-full border border-card-border bg-white px-3 py-1.5 text-[12.5px] font-medium text-body-soft">
                {doctor.yearsExperience} años de experiencia
              </span>
            )}
            {doctor.university && (
              <span className="rounded-full border border-card-border bg-white px-3 py-1.5 text-[12.5px] font-medium text-body-soft">
                {doctor.university}
              </span>
            )}
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-bold ${
            isToday ? "bg-success-bg text-success" : "bg-[#F3ECE1] text-muted"
          }`}
        >
          Próxima cita:{" "}
          {formatNextAvailableLabel(doctor.soonestSlot, today, tomorrow)}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-7 rounded-[22px] border border-card-border bg-white p-6 sm:grid-cols-2">
        <div>
          {doctor.bio && (
            <>
              <div className="mb-2 text-[15px] font-bold">Sobre el doctor</div>
              <p className="mb-5.5 text-sm leading-[1.65] text-body-soft">
                {doctor.bio}
              </p>
            </>
          )}
        </div>
        <div>
          <DoctorProfileCalendar
            doctorId={doctor.id}
            windowStart={doctor.windowStart}
            windowEnd={doctor.windowEnd}
            selectedDate={doctor.selectedDate}
          />
          <div className="mb-3 text-[15px] font-bold">
            Elige un horario ·{" "}
            {selectedDateLabel(doctor.selectedDate, today, tomorrow)}
          </div>
          <SlotPicker
            doctorId={doctor.id}
            slots={doctor.slots}
            soonestSlot={doctor.soonestSlot}
            multiLocation={doctor.locations.length > 1}
          />
        </div>
      </div>
    </div>
  );
}

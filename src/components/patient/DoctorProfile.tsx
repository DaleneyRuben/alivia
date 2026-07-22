import Link from "next/link";
import { initials } from "@/lib/text/initials";
import { avatarTint } from "@/lib/text/avatarTint";
import { formatNextAvailableLabel } from "@/lib/patients/formatNextAvailableLabel";
import { formatSpanishDate } from "@/lib/time/formatSpanishDate";
import type { PublicDoctorProfile } from "@/lib/patients/getPublicDoctorProfile";
import { SlotPicker } from "./SlotPicker";

export interface DoctorProfileProps {
  doctor: PublicDoctorProfile;
  today: string;
  tomorrow: string;
}

function slotsDateLabel(
  slotsDate: string | null,
  today: string,
  tomorrow: string,
): string {
  if (!slotsDate) return "";
  if (slotsDate === today) return "Hoy";
  if (slotsDate === tomorrow) return "Mañana";
  return formatSpanishDate(slotsDate);
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
          <div className="mb-2.5 text-[15px] font-bold">Ubicaciones</div>
          <div className="flex flex-col gap-2.5">
            {doctor.locations.map((location) => (
              <div
                key={location.id}
                className="flex items-center gap-3 rounded-2xl border border-card-border p-3.5"
              >
                <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[11px] bg-[#F7F2EA] text-terracotta-deep">
                  ⌂
                </span>
                <div>
                  <div className="text-sm font-semibold">{location.name}</div>
                  <div className="text-[12.5px] text-muted">
                    {location.address}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-3 text-[15px] font-bold">
            Elige un horario ·{" "}
            {slotsDateLabel(doctor.slotsDate, today, tomorrow)}
          </div>
          <SlotPicker doctorId={doctor.id} slots={doctor.slots} />
        </div>
      </div>
    </div>
  );
}

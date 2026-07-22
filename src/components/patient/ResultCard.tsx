import Link from "next/link";
import { initials } from "@/lib/text/initials";
import { avatarTint } from "@/lib/text/avatarTint";
import { formatNextAvailableLabel } from "@/lib/patients/formatNextAvailableLabel";

export interface ResultCardDoctor {
  id: string;
  name: string;
  specialty: string;
  locationName: string;
  yearsExperience: number | null;
  soonestSlot: { date: string; startMinutes: number } | null;
}

export interface ResultCardProps {
  doctor: ResultCardDoctor;
  today: string;
  tomorrow: string;
}

export function ResultCard({ doctor, today, tomorrow }: ResultCardProps) {
  const tint = avatarTint(doctor.id);
  const isToday = doctor.soonestSlot?.date === today;
  const hasSlot = doctor.soonestSlot !== null;

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-[20px] border border-card-border bg-white p-4.5 text-ink">
      <div
        className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full text-[22px] font-bold"
        style={{ backgroundColor: tint.bg, color: tint.text }}
      >
        {initials(doctor.name)}
      </div>
      <div className="min-w-[160px] flex-1">
        <div className="text-base font-bold">{doctor.name}</div>
        <div className="mt-0.5 mb-2 text-[13px] text-muted">
          {doctor.specialty} · {doctor.locationName}
        </div>
        <div className="flex flex-wrap gap-2">
          {doctor.yearsExperience !== null && (
            <span className="rounded-full bg-[#F7F2EA] px-2.5 py-1 text-xs font-medium text-body-soft">
              {doctor.yearsExperience} años de experiencia
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full bg-success-bg px-2.5 py-1 text-xs font-semibold text-success">
            ✓ Verificado
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <span
          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-bold ${
            isToday ? "bg-success-bg text-success" : "bg-[#F3ECE1] text-muted"
          }`}
        >
          {hasSlot && (
            <span
              className={`h-2 w-2 rounded-full ${isToday ? "bg-[#4F9C82]" : "bg-sand-dot"}`}
            />
          )}
          {formatNextAvailableLabel(doctor.soonestSlot, today, tomorrow)}
        </span>
        <Link
          href={`/doctors/${doctor.id}`}
          className="rounded-full bg-terracotta px-6 py-2.5 text-sm font-bold text-white no-underline"
        >
          Reservar
        </Link>
      </div>
    </div>
  );
}

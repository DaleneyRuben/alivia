import { formatWeekdays } from "@/lib/schedule/formatWeekdays";
import { formatTimeRange } from "@/lib/schedule/formatTimeRange";
import type { DoctorProfileInput } from "@/lib/doctor/isValidDoctorProfileInput";

export interface ReviewScheduleBlock {
  id: string;
  weekdays: number[];
  startMinutes: number;
  endMinutes: number;
  slotDurationMinutes: number;
  slotCapacity: number;
}

export interface ReviewLocation {
  id: string;
  name: string;
  address: string;
  scheduleBlocks: ReviewScheduleBlock[];
}

export interface ReviewStepProps {
  profile: DoctorProfileInput;
  locations: ReviewLocation[];
}

export function ReviewStep({ profile, locations }: ReviewStepProps) {
  const totalBlocks = locations.reduce(
    (sum, location) => sum + location.scheduleBlocks.length,
    0,
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-[16px] border border-card-border p-4">
        <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
          Perfil
        </div>
        <div className="text-[15px] font-bold">{profile.name}</div>
        <div className="text-[13px] text-muted">
          {profile.specialty}
          {profile.yearsExperience !== null &&
            ` · ${profile.yearsExperience} años de experiencia`}
        </div>
      </div>

      <div className="rounded-[16px] border border-card-border p-4">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
          Ubicaciones ({locations.length})
        </div>
        {locations.map((location) => (
          <div key={location.id} className="py-0.5 text-[13.5px] text-muted">
            • {location.name} — {location.address}
          </div>
        ))}
      </div>

      <div className="rounded-[16px] border border-card-border p-4">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
          Horarios
        </div>
        {totalBlocks === 0 ? (
          <div className="text-[13.5px] text-muted">
            Sin bloques de horario todavía.
          </div>
        ) : (
          locations.flatMap((location) =>
            location.scheduleBlocks.map((block) => (
              <div key={block.id} className="py-0.5 text-[13.5px] text-muted">
                {location.name}: {formatWeekdays(block.weekdays)}{" "}
                {formatTimeRange(block.startMinutes, block.endMinutes)} ·{" "}
                {block.slotDurationMinutes} min · {block.slotCapacity} pacientes
              </div>
            )),
          )
        )}
      </div>
    </div>
  );
}

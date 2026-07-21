import Link from "next/link";
import { formatMinutes } from "@/lib/schedule/formatTimeRange";

export interface ProfileSlot {
  locationId: string;
  locationName: string;
  date: string;
  startMinutes: number;
  endMinutes: number;
  availableToPatients: boolean;
}

export interface SlotPickerProps {
  doctorId: string;
  slots: ProfileSlot[];
}

// Slot buttons: soonest available (green outline), available (white),
// taken (struck-through, disabled) — patients never see queue capacity
// (ADR-0009), only open/closed.
export function SlotPicker({ doctorId, slots }: SlotPickerProps) {
  if (slots.length === 0) {
    return (
      <p className="text-sm text-muted">
        No hay horarios disponibles por ahora.
      </p>
    );
  }

  const soonestStart = slots.find(
    (slot) => slot.availableToPatients,
  )?.startMinutes;

  return (
    <div>
      <div className="grid grid-cols-3 gap-2.5">
        {slots.map((slot) => {
          const time = formatMinutes(slot.startMinutes);
          if (!slot.availableToPatients) {
            return (
              <span
                key={`${slot.locationId}-${slot.startMinutes}`}
                className="rounded-[13px] border border-card-border bg-[#F7F2EA] py-2.5 text-center text-[13px] font-bold text-[#C2B9AB] line-through"
              >
                {time}
              </span>
            );
          }

          const isSoonest = slot.startMinutes === soonestStart;

          return (
            <Link
              key={`${slot.locationId}-${slot.startMinutes}`}
              href={`/booking?doctorId=${doctorId}&locationId=${slot.locationId}&date=${slot.date}&start=${slot.startMinutes}`}
              className={`rounded-[13px] py-2.5 text-center text-[13px] font-bold no-underline ${
                isSoonest
                  ? "border-[1.5px] border-[#4F9C82] bg-success-bg text-success"
                  : "border border-input-border bg-white text-ink"
              }`}
            >
              {time}
            </Link>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-[11.5px] text-muted">
        <span className="inline-block h-2.5 w-2.5 rounded-[3px] border-[1.5px] border-[#4F9C82] bg-success-bg" />
        Cupo más próximo disponible
      </div>
    </div>
  );
}

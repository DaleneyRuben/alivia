import Link from "next/link";
import { formatMinutes } from "@/lib/schedule/formatTimeRange";

export interface ProfileSlot {
  locationId: string;
  locationName: string;
  date: string;
  startMinutes: number;
  endMinutes: number;
  availableToPatients: boolean;
  tooSoon: boolean;
}

export interface SlotPickerProps {
  doctorId: string;
  slots: ProfileSlot[];
  soonestSlot: { date: string; startMinutes: number } | null;
  // whether to show a location label under each time — only meaningful
  // once a doctor has more than one Location (CONTEXT.md: Location)
  multiLocation: boolean;
}

const locationLabelClass = "block text-[9.5px] font-semibold";

// Slot buttons: soonest available (green outline), available (white),
// too soon (dashed, inside the 2-hour lead time), taken (struck-through,
// disabled) — patients never see queue capacity (ADR-0009), only open/closed.
export function SlotPicker({
  doctorId,
  slots,
  soonestSlot,
  multiLocation,
}: SlotPickerProps) {
  if (slots.length === 0) {
    return (
      <p className="text-sm text-muted">
        No hay horarios disponibles por ahora.
      </p>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-2.5">
        {slots.map((slot) => {
          const time = formatMinutes(slot.startMinutes);
          const key = `${slot.locationId}-${slot.startMinutes}`;

          if (slot.tooSoon) {
            return (
              <span
                key={key}
                className="rounded-[13px] border border-dashed border-input-border bg-cream py-2.5 text-center text-[13px] font-bold text-[#C2B9AB]"
              >
                <span className="block">{time}</span>
                {multiLocation && (
                  <span className={`${locationLabelClass} text-sand-dot`}>
                    {slot.locationName}
                  </span>
                )}
              </span>
            );
          }

          if (!slot.availableToPatients) {
            return (
              <span
                key={key}
                className="rounded-[13px] border border-card-border bg-[#F7F2EA] py-2.5 text-center text-[13px] font-bold text-[#C2B9AB] line-through"
              >
                <span className="block">{time}</span>
                {multiLocation && (
                  <span className={`${locationLabelClass} text-[#C2B9AB]`}>
                    {slot.locationName}
                  </span>
                )}
              </span>
            );
          }

          const isSoonest =
            slot.date === soonestSlot?.date &&
            slot.startMinutes === soonestSlot?.startMinutes;

          return (
            <Link
              key={key}
              href={`/booking?doctorId=${doctorId}&locationId=${slot.locationId}&date=${slot.date}&start=${slot.startMinutes}`}
              className={`rounded-[13px] py-2.5 text-center text-[13px] font-bold no-underline ${
                isSoonest
                  ? "border-[1.5px] border-[#4F9C82] bg-success-bg text-success"
                  : "border border-input-border bg-white text-ink"
              }`}
            >
              <span className="block">{time}</span>
              {multiLocation && (
                <span
                  className={`${locationLabelClass} ${isSoonest ? "text-[#3E6B5C]" : "text-muted"}`}
                >
                  {slot.locationName}
                </span>
              )}
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

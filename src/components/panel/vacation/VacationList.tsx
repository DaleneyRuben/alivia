import { formatVacationRange } from "@/lib/time/formatVacationRange";
import { isVacationRemovable } from "@/lib/vacation/isVacationRemovable";

export interface Vacation {
  id: string;
  locationId: string | null;
  locationName: string | null;
  startDate: string;
  endDate: string;
}

export interface VacationListProps {
  vacations: Vacation[];
  today: string;
  onEdit: (vacation: Vacation) => void;
  onRemove: (id: string) => void;
}

export function VacationList({
  vacations,
  today,
  onEdit,
  onRemove,
}: VacationListProps) {
  if (vacations.length === 0) {
    return <p className="text-sm text-muted">No hay vacaciones próximas.</p>;
  }

  return (
    <div className="flex flex-col gap-2.5">
      {vacations.map((vacation) => {
        const removable = isVacationRemovable(vacation.startDate, today);

        return (
          <div
            key={vacation.id}
            className="flex items-center gap-3 rounded-2xl border border-card-border bg-white p-3.5"
          >
            <span className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[11px] bg-[#F7F2EA] text-[15px] text-terracotta-deep">
              ▦
            </span>
            <div className="flex-1">
              <div className="text-sm font-semibold">
                {formatVacationRange(vacation.startDate, vacation.endDate)}
              </div>
              <div className="text-[12.5px] text-muted">
                {vacation.locationName ?? "Todas las ubicaciones"}
              </div>
            </div>
            {removable && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onEdit(vacation)}
                  className="cursor-pointer rounded-full border border-input-border px-3.5 py-2 text-xs font-semibold text-body-soft"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(vacation.id)}
                  className="cursor-pointer rounded-full border border-error-border px-3.5 py-2 text-xs font-semibold text-terracotta-deep"
                >
                  Quitar
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

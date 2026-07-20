import { formatTimeRange } from "@/lib/schedule/formatTimeRange";
import { formatWeekdays } from "@/lib/schedule/formatWeekdays";

export interface ScheduleBlock {
  id: string;
  weekdays: number[];
  startMinutes: number;
  endMinutes: number;
  slotDurationMinutes: number;
  slotCapacity: number;
}

export interface ScheduleBlockListProps {
  blocks: ScheduleBlock[];
  onEdit: (block: ScheduleBlock) => void;
  onRemove: (blockId: string) => void;
}

export function ScheduleBlockList({
  blocks,
  onEdit,
  onRemove,
}: ScheduleBlockListProps) {
  if (blocks.length === 0) {
    return (
      <p className="text-sm text-muted">
        No hay bloques de horario en esta ubicación todavía.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {blocks.map((block) => (
        <div
          key={block.id}
          className="flex flex-wrap items-center justify-between gap-3 rounded-[16px] border border-card-border bg-white p-4"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold">
              {formatWeekdays(block.weekdays)}
            </span>
            <span className="text-sm text-body-soft">
              {formatTimeRange(block.startMinutes, block.endMinutes)}
            </span>
            <span className="rounded-full bg-[#F7F2EA] px-3 py-1 text-xs font-semibold text-body-soft">
              {block.slotDurationMinutes} min
            </span>
            <span className="rounded-full bg-[#F7F2EA] px-3 py-1 text-xs font-semibold text-body-soft">
              Hasta {block.slotCapacity} pacientes
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(block)}
              className="cursor-pointer rounded-full border border-input-border px-3.5 py-1.5 text-[13px] font-semibold text-ink"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={() => onRemove(block.id)}
              className="cursor-pointer rounded-full border border-terracotta px-3.5 py-1.5 text-[13px] font-semibold text-terracotta-deep"
            >
              Quitar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

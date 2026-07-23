import Link from "next/link";
import { formatMonthYearLabel } from "@/lib/time/formatMonthYearLabel";

export interface DoctorProfileCalendarProps {
  doctorId: string;
  // inclusive bounds of the bookable window (getPublicDoctorProfile)
  windowStart: string;
  windowEnd: string;
  selectedDate: string;
}

const WEEKDAY_LABELS = ["L", "M", "M", "J", "V", "S", "D"];

function dateHref(doctorId: string, date: string): string {
  return `/doctors/${doctorId}?date=${date}`;
}

// monday-first weekday index for a YYYY-MM-DD date (0=Monday..6=Sunday)
function mondayFirstWeekday(year: number, month: number, day: number): number {
  const jsDay = new Date(Date.UTC(year, month, day)).getUTCDay();
  return (jsDay + 6) % 7;
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

function toIsoDate(year: number, month: number, day: number): string {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

// Real calendar/date-picker widget (a deliberate departure from Alivia's usual
// pill-based style, finding #4) over the 14-day booking window. The window can
// span at most two calendar months, so month navigation only ever needs a
// single prev/next step rather than arbitrary paging.
export function DoctorProfileCalendar({
  doctorId,
  windowStart,
  windowEnd,
  selectedDate,
}: DoctorProfileCalendarProps) {
  const viewed = new Date(`${selectedDate}T00:00:00Z`);
  const year = viewed.getUTCFullYear();
  const month = viewed.getUTCMonth();

  const firstOfMonth = toIsoDate(year, month, 1);
  const lastOfMonth = toIsoDate(year, month, daysInMonth(year, month));
  const firstOfNextMonth = toIsoDate(
    month === 11 ? year + 1 : year,
    month === 11 ? 0 : month + 1,
    1,
  );

  const canGoPrev = windowStart < firstOfMonth;
  const canGoNext = windowEnd >= firstOfNextMonth && lastOfMonth < windowEnd;

  const leadingBlanks = mondayFirstWeekday(year, month, 1);
  const cells: { day: number; date: string }[] = [];
  for (let day = 1; day <= daysInMonth(year, month); day++) {
    cells.push({ day, date: toIsoDate(year, month, day) });
  }

  return (
    <div className="mb-4 rounded-2xl border border-card-border p-3.5">
      <div className="mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {canGoPrev && (
            <Link
              href={dateHref(doctorId, windowStart)}
              aria-label="Mes anterior"
              className="font-bold text-muted no-underline"
            >
              ‹
            </Link>
          )}
          <span className="text-sm font-bold">
            {formatMonthYearLabel(selectedDate)}
          </span>
          {canGoNext && (
            <Link
              href={dateHref(doctorId, firstOfNextMonth)}
              aria-label="Mes siguiente"
              className="font-bold text-muted no-underline"
            >
              ›
            </Link>
          )}
        </div>
        <span className="text-[11.5px] text-muted">Próximos 14 días</span>
      </div>
      <div className="mb-1 grid grid-cols-7 gap-1">
        {WEEKDAY_LABELS.map((label, index) => (
          <span
            key={index}
            className="text-center text-[10.5px] font-semibold text-placeholder"
          >
            {label}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: leadingBlanks }).map((_, index) => (
          <span key={`blank-${index}`} className="invisible" />
        ))}
        {cells.map(({ day, date }) => {
          const enabled = date >= windowStart && date <= windowEnd;
          const isSelected = date === selectedDate;
          const isToday = date === windowStart;
          const cellClass =
            "flex h-8 items-center justify-center rounded-[9px] border border-transparent text-[12.5px] font-semibold";

          if (!enabled) {
            return (
              <span
                key={date}
                className={`${cellClass} bg-transparent text-[#D8CBB4]`}
              >
                {day}
              </span>
            );
          }

          if (isSelected) {
            return (
              <Link
                key={date}
                href={dateHref(doctorId, date)}
                className={`${cellClass} bg-terracotta text-white no-underline`}
              >
                {day}
              </Link>
            );
          }

          if (isToday) {
            return (
              <Link
                key={date}
                href={dateHref(doctorId, date)}
                className={`${cellClass} border-[#4F9C82] bg-success-bg text-success no-underline`}
              >
                {day}
              </Link>
            );
          }

          return (
            <Link
              key={date}
              href={dateHref(doctorId, date)}
              className={`${cellClass} bg-white text-ink no-underline`}
            >
              {day}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

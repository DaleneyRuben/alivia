import { formatMinutes } from "@/lib/schedule/formatTimeRange";
import { initials } from "@/lib/text/initials";

export interface Confirmation {
  id: string;
  startMinutes: number;
  patientName: string;
  patientPhone: string;
  status: "SCHEDULED" | "ATTENDED" | "NO_SHOW" | "CANCELLED";
  confirmationStatus: "PENDING" | "CONFIRMED";
  whatsAppUrl: string;
}

export interface ConfirmationListProps {
  confirmations: Confirmation[];
  onConfirm: (id: string) => void;
  onCancel: (id: string) => void;
}

export function ConfirmationList({
  confirmations,
  onConfirm,
  onCancel,
}: ConfirmationListProps) {
  const pendingCount = confirmations.filter(
    (c) => c.status === "SCHEDULED" && c.confirmationStatus === "PENDING",
  ).length;

  return (
    <div className="overflow-hidden rounded-[18px] border border-card-border bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F0E9DE] px-4.5 py-3.5">
        <span className="text-[15px] font-bold">Por confirmar</span>
        <span className="rounded-full bg-success-bg px-3 py-1.5 text-xs font-bold text-success">
          {pendingCount} pendientes
        </span>
      </div>
      {confirmations.length === 0 && (
        <p className="p-4.5 text-sm text-muted">No hay citas para mañana.</p>
      )}
      {confirmations.map((confirmation) => {
        const pending =
          confirmation.status === "SCHEDULED" &&
          confirmation.confirmationStatus === "PENDING";
        const cancelled = confirmation.status === "CANCELLED";
        const confirmed = confirmation.confirmationStatus === "CONFIRMED";

        return (
          <div
            key={confirmation.id}
            className="flex flex-wrap items-center gap-3.5 border-b border-[#F7F2EA] p-3.5 last:border-b-0"
          >
            <span className="w-[52px] text-sm font-extrabold">
              {formatMinutes(confirmation.startMinutes)}
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F7F2EA] text-[13px] font-bold text-body-soft">
              {initials(confirmation.patientName)}
            </div>
            <div className="min-w-[130px] flex-1">
              <div className="text-sm font-semibold">
                {confirmation.patientName}
              </div>
              <div className="text-xs text-muted">
                {confirmation.patientPhone}
              </div>
            </div>
            {pending ? (
              <div className="flex flex-wrap items-center gap-1.5">
                <a
                  href={confirmation.whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-whatsapp px-3.5 py-2 text-xs font-bold text-white no-underline"
                >
                  ✆ WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => onConfirm(confirmation.id)}
                  className="cursor-pointer rounded-full bg-success-bg px-3.5 py-2 text-xs font-bold text-success"
                >
                  Confirmó
                </button>
                <button
                  type="button"
                  onClick={() => onCancel(confirmation.id)}
                  className="cursor-pointer rounded-full border border-error-border px-3.5 py-2 text-xs font-semibold text-terracotta-deep"
                >
                  Canceló
                </button>
              </div>
            ) : (
              <span
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold ${
                  cancelled
                    ? "bg-error-bg text-terracotta-deep"
                    : "bg-success-bg text-success"
                }`}
              >
                {cancelled ? "Canceló" : confirmed ? "✓ Confirmó" : null}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

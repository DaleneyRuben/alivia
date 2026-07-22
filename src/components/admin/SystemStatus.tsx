import type { SystemStatus as SystemStatusData } from "@/lib/admin/getSystemStatus";

export interface SystemStatusProps {
  status: SystemStatusData;
}

const STATE_LABEL: Record<string, string> = {
  ok: "Operativo",
  degraded: "Degradado",
  down: "Caído",
};

const STATE_DOT_COLOR: Record<string, string> = {
  ok: "#4F9C82",
  degraded: "#E8785A",
  down: "#C15A3E",
};

const STATE_BADGE_CLASS: Record<string, string> = {
  ok: "bg-success-bg text-success",
  degraded: "bg-warning-bg text-warning",
  down: "bg-[#F5E0D8] text-terracotta-deep",
};

export function SystemStatus({ status }: SystemStatusProps) {
  return (
    <div className="mx-auto w-full max-w-[680px] px-6 py-6 pb-12">
      <div className="mb-4">
        <div className="text-[13px] font-semibold text-muted">
          Salud técnica
        </div>
        <h1 className="mt-0.5 text-[26px] font-extrabold tracking-tight">
          Estado del sistema
        </h1>
      </div>
      <div
        className={`mb-4 flex items-center gap-2.5 rounded-2xl border px-4.5 py-4 ${
          status.allOperational
            ? "border-[#C9E0D2] bg-success-bg"
            : "border-error-border bg-[#F5E0D8]"
        }`}
      >
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{
            backgroundColor: status.allOperational ? "#4F9C82" : "#C15A3E",
          }}
        />
        <span
          className={`text-[15px] font-bold ${
            status.allOperational ? "text-success" : "text-terracotta-deep"
          }`}
        >
          {status.allOperational
            ? "Todos los sistemas operativos"
            : "Algunos sistemas presentan problemas"}
        </span>
      </div>
      <div className="flex flex-col gap-2.5">
        {status.rows.map((row) => (
          <div
            key={row.name}
            className="flex items-center gap-3 rounded-2xl border border-card-border bg-white p-4"
          >
            <span
              className="h-2.75 w-2.75 shrink-0 rounded-full"
              style={{ backgroundColor: STATE_DOT_COLOR[row.state] }}
            />
            <div className="flex-1">
              <div className="text-[14.5px] font-bold">{row.name}</div>
              <div className="text-[12.5px] text-muted">{row.detail}</div>
            </div>
            <span
              className={`rounded-full px-3 py-1.5 text-xs font-bold ${STATE_BADGE_CLASS[row.state]}`}
            >
              {STATE_LABEL[row.state]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

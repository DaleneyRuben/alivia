import type { Analytics as AnalyticsData } from "@/lib/admin/getAnalytics";

export interface AnalyticsProps {
  analytics: AnalyticsData;
}

export function Analytics({ analytics }: AnalyticsProps) {
  const maxValue = Math.max(1, ...analytics.chart.map((bar) => bar.value));

  return (
    <div className="mx-auto max-w-[860px] px-6 py-6 pb-12">
      <div className="mb-4">
        <div className="text-[13px] font-semibold text-muted">
          Métricas del negocio
        </div>
        <h1 className="mt-0.5 text-[26px] font-extrabold tracking-tight">
          Analytics
        </h1>
      </div>
      <div className="mb-4.5 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
        {analytics.stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-card-border bg-white p-4"
          >
            <div className="text-xs font-semibold text-muted">{stat.label}</div>
            <div
              className={`text-[28px] font-extrabold tracking-tight ${
                stat.label === "Citas reservadas" ? "text-success" : ""
              }`}
            >
              {stat.value}
            </div>
            <div
              className={`text-xs font-semibold ${
                stat.tone === "positive" ? "text-success" : "text-muted"
              }`}
            >
              {stat.delta}
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-[18px] border border-card-border bg-white p-5">
        <div className="mb-4 text-[15px] font-bold">
          Consultas incorporadas por mes
        </div>
        <div className="flex h-[180px] items-end gap-2.5">
          {analytics.chart.map((bar) => (
            <div
              key={bar.label}
              className="flex h-full flex-1 flex-col items-center justify-end gap-2"
            >
              <div
                className={`w-full max-w-[42px] rounded-t-lg ${
                  bar.highlighted ? "bg-terracotta" : "bg-[#D8CBB4]"
                }`}
                style={{
                  height: `${Math.round((bar.value / maxValue) * 100)}%`,
                }}
              />
              <span className="text-[11px] font-semibold text-muted">
                {bar.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

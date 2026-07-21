import { formatLongSpanishDate } from "@/lib/time/formatLongSpanishDate";
import type { SubscriptionSummary } from "@/lib/doctor/getSubscription";

export interface SubscriptionCardProps {
  subscription: SubscriptionSummary;
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const active = subscription.status === "ACTIVE";

  return (
    <div className="rounded-[18px] border border-card-border bg-white p-5">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[15px] font-bold">Suscripción</span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.25 text-xs font-bold ${
            active ? "bg-success-bg text-success" : "bg-warning-bg text-warning"
          }`}
        >
          <span
            className="h-1.75 w-1.75 rounded-full"
            style={{ backgroundColor: active ? "#4F9C82" : "#9A7B3E" }}
          />
          {active ? "Activa" : "Inactiva"}
        </span>
      </div>
      <div className="text-[13.5px] text-body-soft">
        Plan mensual
        {subscription.renewsAt && (
          <>
            {" "}
            · se renueva el{" "}
            <b>{formatLongSpanishDate(subscription.renewsAt)}</b>
          </>
        )}
      </div>
      <p className="mt-2.5 text-xs text-muted">
        El pago se gestiona fuera de la app. Para cambios de plan, contacta a tu
        administrador.
      </p>
    </div>
  );
}

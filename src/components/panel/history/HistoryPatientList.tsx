import Link from "next/link";
import { initials } from "@/lib/text/initials";
import { avatarTint } from "@/lib/text/avatarTint";
import { describePatientHistoryTag } from "@/lib/history/describePatientHistoryTag";

export interface HistoryPatientListItem {
  id: string;
  name: string;
  hasMedicalProfile: boolean;
  visitCount: number;
}

export interface HistoryPatientListProps {
  patients: HistoryPatientListItem[];
}

export function HistoryPatientList({ patients }: HistoryPatientListProps) {
  return (
    <div>
      <div className="mb-4">
        <div className="text-[13px] font-semibold text-muted">
          Registro clínico privado
        </div>
        <h1 className="mt-0.5 text-[26px] font-extrabold tracking-tight">
          Historia clínica
        </h1>
      </div>
      {patients.length === 0 ? (
        <p className="text-sm text-muted">
          No hay pacientes registrados todavía.
        </p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {patients.map((patient) => {
            const { tag, sub } = describePatientHistoryTag(patient);
            const tint = avatarTint(patient.id);
            const tagClassName =
              tag === "Con historia"
                ? "bg-success-bg text-success"
                : "bg-warning-bg text-warning";
            return (
              <Link
                key={patient.id}
                href={`/panel/history/${patient.id}`}
                className="flex flex-wrap items-center gap-3.5 rounded-[16px] border border-card-border bg-white p-[15px] no-underline"
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                  style={{ backgroundColor: tint.bg, color: tint.text }}
                >
                  {initials(patient.name)}
                </span>
                <div className="min-w-[140px] flex-1">
                  <div className="text-[15px] font-bold text-ink">
                    {patient.name}
                  </div>
                  <div className="text-[12.5px] text-muted">{sub}</div>
                </div>
                <span
                  className={`rounded-full px-2.75 py-1.25 text-[11.5px] font-semibold ${tagClassName}`}
                >
                  {tag}
                </span>
                <span className="text-lg text-sand-dot">›</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

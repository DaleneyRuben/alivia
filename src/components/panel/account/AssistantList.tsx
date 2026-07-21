import { initials } from "@/lib/text/initials";
import { avatarTint } from "@/lib/text/avatarTint";
import type { AssistantSummary } from "@/lib/doctor/getAssistants";

export interface AssistantListProps {
  assistants: AssistantSummary[];
}

export function AssistantList({ assistants }: AssistantListProps) {
  return (
    <div className="rounded-[18px] border border-card-border bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[15px] font-bold">Asistentes</span>
        <span className="text-xs font-medium text-muted">
          Gestionadas por tu administrador
        </span>
      </div>
      {assistants.length === 0 ? (
        <p className="text-sm text-muted">Todavía no tienes asistentes.</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {assistants.map((assistant) => {
            const tint = avatarTint(assistant.id);
            return (
              <div
                key={assistant.id}
                className="flex items-center gap-3 rounded-[14px] border border-card-border p-3"
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                  style={{ backgroundColor: tint.bg, color: tint.text }}
                >
                  {initials(assistant.name)}
                </span>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{assistant.name}</div>
                  <div className="text-[12.5px] text-muted">
                    {assistant.email}
                  </div>
                </div>
                <span className="rounded-full bg-success-bg px-2.75 py-1.25 text-xs font-semibold text-success">
                  Activa
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

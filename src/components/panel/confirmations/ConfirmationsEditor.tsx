"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { formatSpanishDate } from "@/lib/time/formatSpanishDate";
import { confirmAppointment } from "@/lib/confirmations/confirmAppointment";
import { updateAppointmentStatus } from "@/lib/appointments/updateAppointmentStatus";
import { ConfirmationList, type Confirmation } from "./ConfirmationList";

export interface ConfirmationsEditorProps {
  tomorrow: string;
  confirmations: Confirmation[];
}

export function ConfirmationsEditor({
  tomorrow,
  confirmations,
}: ConfirmationsEditorProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  function handleConfirm(id: string) {
    startTransition(async () => {
      await confirmAppointment(id);
      router.refresh();
    });
  }

  function handleCancel(id: string) {
    startTransition(async () => {
      await updateAppointmentStatus(id, "CANCELLED");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="mb-2">
        <div className="text-[13px] font-semibold text-muted">
          Mañana · {formatSpanishDate(tomorrow)}
        </div>
        <h1 className="mt-0.5 text-xl font-extrabold">Confirmaciones</h1>
        <p className="mt-2 text-sm text-muted">
          Envía un WhatsApp a cada paciente y marca su respuesta. El envío es
          manual: tú tocas &quot;enviar&quot;.
        </p>
      </div>

      <ConfirmationList
        confirmations={confirmations}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}

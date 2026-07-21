"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { enableMedicalHistory } from "@/lib/history/enableMedicalHistory";

export function HistoryOptIn() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleEnable() {
    startTransition(async () => {
      await enableMedicalHistory();
      router.refresh();
    });
  }

  return (
    <div className="mx-auto mt-10 max-w-[440px] text-center">
      <div className="mx-auto mb-4 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#F7F2EA] text-[28px] text-terracotta-deep">
        ✚
      </div>
      <h1 className="mb-2 text-[22px] font-extrabold tracking-tight">
        Historia clínica
      </h1>
      <p className="mb-5.5 text-sm leading-relaxed text-muted">
        Lleva un registro clínico privado de cada paciente: perfil base y las
        notas de cada visita. Solo tú puedes verlo — nunca se comparte con
        secretarias ni otros doctores.
      </p>
      <button
        type="button"
        onClick={handleEnable}
        disabled={isPending}
        className="cursor-pointer rounded-full bg-terracotta px-6.5 py-3.5 text-[15px] font-bold text-white disabled:cursor-not-allowed disabled:bg-terracotta-disabled"
      >
        Activar historia clínica
      </button>
    </div>
  );
}

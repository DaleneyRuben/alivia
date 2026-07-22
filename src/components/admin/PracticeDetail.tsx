"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { initials } from "@/lib/text/initials";
import { avatarTint } from "@/lib/text/avatarTint";
import { toggleAccountActive } from "@/lib/admin/toggleAccountActive";
import { resetAccountPassword } from "@/lib/admin/resetAccountPassword";
import { impersonateAccount } from "@/lib/admin/impersonateAccount";
import type { PracticeDetail as PracticeDetailData } from "@/lib/admin/getPracticeDetail";

export interface PracticeDetailProps {
  practice: PracticeDetailData;
}

const statusPillClass = (active: boolean) =>
  `inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-bold ${
    active ? "bg-success-bg text-success" : "bg-[#F5E0D8] text-terracotta-deep"
  }`;

export function PracticeDetail({ practice }: PracticeDetailProps) {
  const [isPending, startTransition] = useTransition();
  const [resetLinks, setResetLinks] = useState<Record<string, string>>({});
  const [impersonateTarget, setImpersonateTarget] = useState<{
    userId: string;
    name: string;
  } | null>(null);

  function handleToggleActive(userId: string) {
    startTransition(async () => {
      await toggleAccountActive(userId, practice.id);
    });
  }

  function handleResetPassword(userId: string) {
    startTransition(async () => {
      const link = await resetAccountPassword(userId);
      setResetLinks((links) => ({ ...links, [userId]: link }));
    });
  }

  function handleConfirmImpersonate() {
    if (!impersonateTarget) return;
    const { userId } = impersonateTarget;
    startTransition(async () => {
      await impersonateAccount(userId);
    });
  }

  const headerTint = avatarTint(practice.id);

  return (
    <div className="mx-auto w-full max-w-[680px] px-6 py-6 pb-12">
      <Link
        href="/admin"
        className="mb-3.5 inline-block text-sm font-semibold text-muted no-underline"
      >
        ← Volver al roster
      </Link>
      <div className="mb-5 flex flex-wrap items-center gap-3.5">
        <div
          className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full text-[19px] font-bold"
          style={{ background: headerTint.bg, color: headerTint.text }}
        >
          {initials(practice.doctorName)}
        </div>
        <div className="flex-1">
          <h1 className="m-0 text-2xl font-extrabold tracking-tight">
            {practice.practiceLabel}
          </h1>
          <div className="text-[13.5px] text-muted">
            {practice.doctorName} · {practice.specialty}
          </div>
        </div>
        <span className={statusPillClass(practice.active)}>
          <span
            className="h-1.75 w-1.75 rounded-full"
            style={{
              backgroundColor: practice.active ? "#4F9C82" : "#C15A3E",
            }}
          />
          {practice.active ? "Activa" : "Inactiva"}
        </span>
      </div>

      <div className="mb-2.5 text-[15px] font-bold">Cuentas</div>
      <div className="flex flex-col gap-3">
        {practice.accounts.map((account) => {
          const tint = avatarTint(account.userId);
          const resetLink = resetLinks[account.userId];
          return (
            <div
              key={account.userId}
              className="rounded-[18px] border border-card-border bg-white p-4.5"
            >
              <div className="mb-3.5 flex flex-wrap items-center gap-3">
                <div
                  className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full text-[15px] font-bold"
                  style={{ background: tint.bg, color: tint.text }}
                >
                  {initials(account.name)}
                </div>
                <div className="min-w-[130px] flex-1">
                  <div className="text-[15px] font-bold">{account.name}</div>
                  <div className="text-[12.5px] text-muted">
                    {account.role} · {account.email}
                  </div>
                </div>
                <span className={statusPillClass(account.active)}>
                  {account.active ? "Activa" : "Inactiva"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 border-t border-[#F0E9DE] pt-3.5">
                <button
                  type="button"
                  onClick={() => handleToggleActive(account.userId)}
                  disabled={isPending}
                  className={`cursor-pointer rounded-full border px-3.75 py-2.25 text-[12.5px] font-bold disabled:cursor-not-allowed ${
                    account.active
                      ? "border-error-border bg-white text-terracotta-deep"
                      : "border-[#C9E0D2] bg-success-bg text-success"
                  }`}
                >
                  {account.active ? "Desactivar" : "Reactivar"}
                </button>
                <button
                  type="button"
                  onClick={() => handleResetPassword(account.userId)}
                  disabled={isPending}
                  className="cursor-pointer rounded-full border border-input-border bg-white px-3.75 py-2.25 text-[12.5px] font-semibold text-body-soft disabled:cursor-not-allowed"
                >
                  Restablecer contraseña
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setImpersonateTarget({
                      userId: account.userId,
                      name: account.name,
                    })
                  }
                  disabled={isPending}
                  className="cursor-pointer rounded-full border border-warning-border bg-warning-bg px-3.75 py-2.25 text-[12.5px] font-bold text-warning disabled:cursor-not-allowed"
                >
                  Iniciar sesión como…
                </button>
              </div>
              {resetLink && (
                <a
                  href={resetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-whatsapp px-3.5 py-2 text-xs font-bold text-white no-underline"
                >
                  ✆ Enviar enlace por WhatsApp
                </a>
              )}
            </div>
          );
        })}
      </div>

      {impersonateTarget && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/55 p-6">
          <div className="w-full max-w-[420px] rounded-[22px] bg-white p-6.5 shadow-2xl">
            <div className="mb-4 flex h-13 w-13 items-center justify-center rounded-[15px] bg-warning-bg text-2xl text-warning">
              ⚠
            </div>
            <h2 className="mb-2 text-xl font-extrabold tracking-tight">
              Iniciar sesión como {impersonateTarget.name}
            </h2>
            <p className="mb-4 text-[13.5px] leading-relaxed text-body-soft">
              Entrarás al panel con <b>acceso completo</b> de esta cuenta,
              incluida su <b>historia clínica</b>. Esta acción queda registrada.
              Úsala solo para dar soporte.
            </p>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={handleConfirmImpersonate}
                disabled={isPending}
                className="flex-1 cursor-pointer rounded-full bg-terracotta px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed"
              >
                Sí, continuar como {impersonateTarget.name}
              </button>
              <button
                type="button"
                onClick={() => setImpersonateTarget(null)}
                disabled={isPending}
                className="cursor-pointer rounded-full border border-input-border bg-white px-4.5 py-3 text-sm font-semibold text-body-soft disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { createPractice, type SetupLink } from "@/lib/admin/createPractice";
import { isValidCreatePracticeInput } from "@/lib/admin/isValidCreatePracticeInput";

const inputClass =
  "w-full rounded-xl border border-input-border bg-white px-3.5 py-2.75 text-sm outline-none";
const labelClass = "mb-1.5 block text-xs font-semibold";

export function CreatePracticeForm() {
  const [doctor, setDoctor] = useState({
    name: "",
    specialty: "",
    email: "",
    phone: "",
  });
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistant, setAssistant] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isPending, startTransition] = useTransition();
  const [setupLinks, setSetupLinks] = useState<SetupLink[] | null>(null);

  const input = { doctor, assistant: assistantOpen ? assistant : null };
  const canSubmit = isValidCreatePracticeInput(input);

  function handleSubmit() {
    startTransition(async () => {
      const links = await createPractice(input);
      setSetupLinks(links);
    });
  }

  if (setupLinks) {
    return (
      <div className="mx-auto max-w-[600px] px-6 py-6 pb-12">
        <h1 className="mb-1 text-[26px] font-extrabold tracking-tight">
          Cuentas creadas
        </h1>
        <p className="mb-5 text-sm text-muted">
          Envía cada enlace por WhatsApp para que puedan crear su contraseña.
        </p>
        <div className="mb-5 flex flex-col gap-3">
          {setupLinks.map((setupLink) => (
            <div
              key={setupLink.link}
              className="rounded-2xl border border-card-border bg-white p-4"
            >
              <div className="mb-2.5 text-sm font-bold">
                {setupLink.name} · {setupLink.role}
              </div>
              <a
                href={setupLink.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-whatsapp px-3.5 py-2 text-xs font-bold text-white no-underline"
              >
                ✆ Enviar por WhatsApp
              </a>
            </div>
          ))}
        </div>
        <Link
          href="/admin"
          className="text-sm font-semibold text-muted no-underline"
        >
          ← Volver al roster
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[600px] px-6 py-6 pb-12">
      <Link
        href="/admin"
        className="mb-3.5 inline-block text-sm font-semibold text-muted no-underline"
      >
        ← Volver al roster
      </Link>
      <h1 className="mb-1 text-[26px] font-extrabold tracking-tight">
        Crear consulta
      </h1>
      <p className="mb-5 text-sm text-muted">
        Se crean cuentas base. El doctor completa su propia configuración al
        ingresar.
      </p>

      <div className="mb-3.5 rounded-[18px] border border-card-border bg-white p-5">
        <div className="mb-3.5 text-[15px] font-bold">Cuenta del doctor</div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-3">
            <div className="min-w-[150px] flex-1">
              <label htmlFor="doctor-name" className={labelClass}>
                Nombre
              </label>
              <input
                id="doctor-name"
                value={doctor.name}
                onChange={(event) =>
                  setDoctor({ ...doctor, name: event.target.value })
                }
                placeholder="Dra. Nombre Apellido"
                className={inputClass}
              />
            </div>
            <div className="min-w-[150px] flex-1">
              <label htmlFor="doctor-specialty" className={labelClass}>
                Especialidad
              </label>
              <input
                id="doctor-specialty"
                value={doctor.specialty}
                onChange={(event) =>
                  setDoctor({ ...doctor, specialty: event.target.value })
                }
                placeholder="Especialidad"
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label htmlFor="doctor-email" className={labelClass}>
              Correo
            </label>
            <input
              id="doctor-email"
              value={doctor.email}
              onChange={(event) =>
                setDoctor({ ...doctor, email: event.target.value })
              }
              placeholder="doctor@consulta.bo"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="doctor-phone" className={labelClass}>
              Teléfono
            </label>
            <input
              id="doctor-phone"
              value={doctor.phone}
              onChange={(event) =>
                setDoctor({ ...doctor, phone: event.target.value })
              }
              placeholder="+591 71234567"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="mb-4 rounded-[18px] border border-card-border bg-white p-5">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[15px] font-bold">Cuenta de asistente</span>
          <button
            type="button"
            onClick={() => setAssistantOpen(!assistantOpen)}
            className="cursor-pointer rounded-full border border-terracotta px-3.5 py-1.5 text-[13px] font-semibold text-terracotta-deep"
          >
            {assistantOpen ? "Quitar" : "+ Agregar"}
          </button>
        </div>
        <p className="text-xs text-muted">
          Opcional — puedes agregarla ahora o después.
        </p>
        {assistantOpen && (
          <div className="mt-3.5 flex flex-col gap-3">
            <div className="flex flex-wrap gap-3">
              <div className="min-w-[150px] flex-1">
                <label htmlFor="assistant-name" className={labelClass}>
                  Nombre
                </label>
                <input
                  id="assistant-name"
                  value={assistant.name}
                  onChange={(event) =>
                    setAssistant({ ...assistant, name: event.target.value })
                  }
                  placeholder="Nombre Apellido"
                  className={inputClass}
                />
              </div>
              <div className="min-w-[150px] flex-1">
                <label htmlFor="assistant-email" className={labelClass}>
                  Correo
                </label>
                <input
                  id="assistant-email"
                  value={assistant.email}
                  onChange={(event) =>
                    setAssistant({ ...assistant, email: event.target.value })
                  }
                  placeholder="asistente@consulta.bo"
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label htmlFor="assistant-phone" className={labelClass}>
                Teléfono
              </label>
              <input
                id="assistant-phone"
                value={assistant.phone}
                onChange={(event) =>
                  setAssistant({ ...assistant, phone: event.target.value })
                }
                placeholder="+591 71234567"
                className={inputClass}
              />
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit || isPending}
        className="w-full cursor-pointer rounded-full bg-terracotta px-5 py-3.5 text-[15px] font-bold text-white disabled:cursor-not-allowed disabled:bg-terracotta-disabled"
      >
        Crear cuentas
      </button>
    </div>
  );
}

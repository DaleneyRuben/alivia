"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { postLoginPath } from "@/lib/auth/postLoginPath";
import { PasswordInput } from "@/components/ui/PasswordInput";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(false);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(true);
      setSubmitting(false);
      return;
    }

    const session = await getSession();
    router.push(session ? postLoginPath(session.user) : "/login");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-card-border rounded-[22px] p-6 shadow-[0_18px_50px_rgba(42,37,33,.08)]"
    >
      {error && (
        <div
          role="alert"
          className="bg-error-bg border border-error-border text-terracotta-dark text-[13px] font-semibold px-3.5 py-[11px] rounded-[13px] mb-4 flex items-center gap-2"
        >
          ⚠ Correo o contraseña incorrectos. Intenta de nuevo.
        </div>
      )}
      <div className="flex flex-col gap-3.5">
        <div>
          <label
            htmlFor="email"
            className="block text-[13px] font-semibold mb-1.5"
          >
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="doctor@consulta.bo"
            className="w-full border border-input-border bg-white rounded-[14px] px-4 py-[13px] text-sm outline-none focus:border-terracotta"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-[13px] font-semibold mb-1.5"
          >
            Contraseña
          </label>
          <PasswordInput
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-terracotta text-white rounded-full py-3.5 font-bold text-[15px] mt-0.5 cursor-pointer disabled:opacity-60"
        >
          Ingresar
        </button>
        <p className="m-0 text-center text-[12.5px] text-muted leading-normal">
          ¿Olvidaste tu contraseña? Los accesos los gestiona tu administrador —
          contáctalo para restablecerla.
        </p>
      </div>
    </form>
  );
}

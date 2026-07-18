import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Ingresar · Alivia" };

export default function LoginPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-[400px]">
        <div className="flex flex-col items-center gap-2.5 mb-[22px]">
          <div className="w-[46px] h-[46px] rounded-[14px] bg-terracotta flex items-center justify-center text-white font-extrabold text-2xl">
            A
          </div>
          <div className="text-center">
            <h1 className="font-extrabold text-[22px] tracking-[-.4px]">
              Bienvenido de nuevo
            </h1>
            <p className="text-[13.5px] text-muted">
              Ingresa para administrar tu consulta
            </p>
          </div>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserMenu } from "@/components/ui/UserMenu";

export interface PanelNavProps {
  role: "DOCTOR" | "ASSISTANT";
  email: string;
  pendingConfirmations?: number;
}

const SHARED_ITEMS = [
  { href: "/panel/appointments", label: "Citas" },
  { href: "/panel/confirmations", label: "Confirmaciones" },
  { href: "/panel/schedule", label: "Horarios" },
  { href: "/panel/vacation", label: "Vacaciones" },
];

const DOCTOR_ONLY_ITEMS = [
  { href: "/panel/locations", label: "Ubicaciones" },
  { href: "/panel/history", label: "Historial" },
  { href: "/panel/account", label: "Cuenta" },
];

export function PanelNav({ role, email, pendingConfirmations }: PanelNavProps) {
  const pathname = usePathname();
  const items =
    role === "DOCTOR" ? [...SHARED_ITEMS, ...DOCTOR_ONLY_ITEMS] : SHARED_ITEMS;

  return (
    <nav className="flex flex-wrap items-center justify-between gap-3 bg-ink px-6 py-3">
      <div className="flex shrink-0 items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-terracotta text-sm font-extrabold text-white">
          A
        </div>
        <span className="text-sm font-extrabold text-white">Alivia</span>
      </div>
      <div className="flex flex-wrap items-center gap-1">
        {items.map((item) => {
          const active = pathname.startsWith(item.href);
          const badge =
            item.href === "/panel/confirmations" && pendingConfirmations
              ? pendingConfirmations
              : null;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold ${
                active ? "bg-white/14 text-white" : "text-sand-dot"
              }`}
            >
              {item.label}
              {badge !== null && (
                <>
                  {" "}
                  <span className="rounded-full bg-terracotta px-1.5 py-0.5 text-[11px] font-bold text-white">
                    {badge}
                  </span>
                </>
              )}
            </Link>
          );
        })}
      </div>
      <UserMenu
        avatar={
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-bold uppercase text-white">
            {email.charAt(0)}
          </div>
        }
        label={
          <span className="text-xs text-sand-dot">
            {role === "DOCTOR" ? "Doctor" : "Asistente"}
          </span>
        }
      />
    </nav>
  );
}

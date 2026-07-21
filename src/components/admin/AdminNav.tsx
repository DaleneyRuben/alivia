"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Roster" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/status", label: "Estado del sistema" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-terracotta bg-ink px-5 py-3">
      <div className="flex shrink-0 items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-white text-[15px] font-extrabold text-terracotta">
          A
        </div>
        <span className="text-[17px] font-extrabold text-white">Alivia</span>
        <span className="rounded-full bg-terracotta px-2 py-0.5 text-[10.5px] font-bold tracking-wide text-ink">
          ADMIN
        </span>
      </div>
      <div className="flex flex-1 flex-wrap gap-1">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`rounded-full px-3.5 py-2 text-[13px] font-semibold ${
                active ? "bg-white/14 text-white" : "text-sand-dot"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
      <div className="flex shrink-0 items-center gap-2.5">
        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#F5E0D8] text-xs font-bold text-terracotta-deep">
          FN
        </div>
        <span className="text-[13px] font-semibold text-white">Fundador</span>
      </div>
    </nav>
  );
}

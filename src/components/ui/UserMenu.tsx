"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { signOut } from "next-auth/react";

export interface UserMenuProps {
  avatar: ReactNode;
  label: ReactNode;
}

export function UserMenu({ avatar, label }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="-m-1 flex items-center gap-2 rounded-[10px] p-1 font-inherit hover:bg-white/8"
      >
        {avatar}
        {label}
        <span className="ml-px text-[10px] text-sand-dot">▾</span>
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-90 min-w-[158px] rounded-[14px] border border-card-border bg-white p-1.5 shadow-[0_18px_50px_rgba(42,37,33,.18)]">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-2 rounded-[9px] px-3 py-2.5 text-left text-[13.5px] font-semibold text-terracotta-deep hover:bg-error-bg"
          >
            <span className="text-sm">⎋</span>
            Salir
          </button>
        </div>
      )}
    </div>
  );
}

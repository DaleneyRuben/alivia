"use client";

import { useState } from "react";

export interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
}: PasswordInputProps) {
  const [revealed, setRevealed] = useState(false);
  const toggleLabel = revealed ? "Ocultar contraseña" : "Mostrar contraseña";

  return (
    <div className="relative">
      <input
        id={id}
        type={revealed ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-[14px] border border-input-border bg-white py-[13px] pr-[46px] pl-4 text-sm outline-none focus:border-terracotta"
      />
      <button
        type="button"
        onClick={() => setRevealed((current) => !current)}
        aria-label={toggleLabel}
        title={toggleLabel}
        className="absolute top-1/2 right-1.5 -translate-y-1/2 cursor-pointer border-none bg-transparent px-[9px] py-1.5 text-[15px] leading-none text-muted"
      >
        {revealed ? "⊘" : "◉"}
      </button>
    </div>
  );
}

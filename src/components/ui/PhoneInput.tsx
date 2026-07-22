"use client";

import { useState } from "react";
import { COUNTRY_DIAL_CODES } from "@/lib/phone/countryDialCodes";
import { toE164 } from "@/lib/phone/toE164";

export interface PhoneInputProps {
  id: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const selectClass =
  "flex-none max-w-[132px] rounded-[14px] border border-input-border bg-white px-3 py-[13px] text-sm outline-none focus:border-terracotta";
const inputClass =
  "min-w-0 flex-1 rounded-[14px] border border-input-border bg-white px-4 py-[13px] text-sm outline-none focus:border-terracotta";

export function PhoneInput({ id, onChange, placeholder }: PhoneInputProps) {
  const [countryIndex, setCountryIndex] = useState(0);
  const [national, setNational] = useState("");
  const dial = COUNTRY_DIAL_CODES[countryIndex].dial;

  function handleCountryChange(newIndex: number) {
    setCountryIndex(newIndex);
    onChange(toE164(COUNTRY_DIAL_CODES[newIndex].dial, national));
  }

  function handleNationalChange(newNational: string) {
    setNational(newNational);
    onChange(toE164(dial, newNational));
  }

  return (
    <div className="flex gap-2">
      <select
        aria-label="Código de país"
        value={countryIndex}
        onChange={(event) => handleCountryChange(Number(event.target.value))}
        className={selectClass}
      >
        {COUNTRY_DIAL_CODES.map((country, index) => (
          <option key={country.flag} value={index}>
            {country.flag} {country.dial}
          </option>
        ))}
      </select>
      <input
        id={id}
        type="tel"
        value={national}
        onChange={(event) => handleNationalChange(event.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

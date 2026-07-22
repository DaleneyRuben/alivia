"use client";

import type { DoctorProfileInput } from "@/lib/doctor/isValidDoctorProfileInput";

export interface ProfileFormProps {
  value: DoctorProfileInput;
  onChange: (value: DoctorProfileInput) => void;
}

export function ProfileForm({ value, onChange }: ProfileFormProps) {
  return (
    <div className="flex flex-col gap-3.5">
      <div>
        <label
          htmlFor="doctor-name"
          className="mb-1.5 block text-[13px] font-semibold"
        >
          Nombre completo
        </label>
        <input
          id="doctor-name"
          type="text"
          value={value.name}
          onChange={(event) => onChange({ ...value, name: event.target.value })}
          className="w-full rounded-[14px] border border-input-border bg-white px-[15px] py-3 text-sm outline-none focus:border-terracotta"
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <div className="min-w-[150px] flex-1">
          <label
            htmlFor="doctor-specialty"
            className="mb-1.5 block text-[13px] font-semibold"
          >
            Especialidad
          </label>
          <input
            id="doctor-specialty"
            type="text"
            value={value.specialty}
            onChange={(event) =>
              onChange({ ...value, specialty: event.target.value })
            }
            className="w-full rounded-[14px] border border-input-border bg-white px-[15px] py-3 text-sm outline-none focus:border-terracotta"
          />
        </div>
        <div className="min-w-[150px] flex-1">
          <label
            htmlFor="doctor-years"
            className="mb-1.5 block text-[13px] font-semibold"
          >
            Años de experiencia
          </label>
          <input
            id="doctor-years"
            type="number"
            min={0}
            value={value.yearsExperience ?? ""}
            onChange={(event) =>
              onChange({
                ...value,
                yearsExperience:
                  event.target.value === "" ? null : Number(event.target.value),
              })
            }
            className="w-full rounded-[14px] border border-input-border bg-white px-[15px] py-3 text-sm outline-none focus:border-terracotta"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="doctor-bio"
          className="mb-1.5 block text-[13px] font-semibold"
        >
          Biografía breve
        </label>
        <textarea
          id="doctor-bio"
          rows={3}
          value={value.bio}
          onChange={(event) => onChange({ ...value, bio: event.target.value })}
          className="w-full resize-none rounded-[14px] border border-input-border bg-white px-[15px] py-3 text-sm outline-none focus:border-terracotta"
        />
      </div>
    </div>
  );
}

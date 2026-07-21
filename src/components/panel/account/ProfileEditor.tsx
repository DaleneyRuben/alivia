"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ProfileForm } from "@/components/panel/onboarding/ProfileForm";
import { updateDoctorProfile } from "@/lib/doctor/updateDoctorProfile";
import { isValidDoctorProfileInput } from "@/lib/doctor/isValidDoctorProfileInput";
import type { DoctorProfileInput } from "@/lib/doctor/isValidDoctorProfileInput";

export interface ProfileEditorProps {
  profile: DoctorProfileInput;
}

export function ProfileEditor({ profile }: ProfileEditorProps) {
  const router = useRouter();
  const [value, setValue] = useState(profile);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await updateDoctorProfile(value);
      router.refresh();
    });
  }

  return (
    <div className="rounded-[18px] border border-card-border bg-white p-5">
      <div className="mb-3.5 text-[15px] font-bold">Perfil</div>
      <ProfileForm value={value} onChange={setValue} />
      <button
        type="button"
        onClick={handleSave}
        disabled={isPending || !isValidDoctorProfileInput(value)}
        className="mt-3.5 cursor-pointer rounded-full bg-terracotta px-5 py-2.5 text-[13.5px] font-bold text-white disabled:cursor-not-allowed disabled:bg-terracotta-disabled"
      >
        Guardar cambios
      </button>
    </div>
  );
}

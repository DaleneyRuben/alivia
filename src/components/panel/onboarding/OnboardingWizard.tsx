"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { OnboardingStepper } from "./OnboardingStepper";
import { ProfileForm } from "./ProfileForm";
import { ReviewStep, type ReviewLocation } from "./ReviewStep";
import { LocationEditor } from "@/components/panel/locations/LocationEditor";
import { ScheduleEditor } from "@/components/panel/schedule/ScheduleEditor";
import { updateDoctorProfile } from "@/lib/doctor/updateDoctorProfile";
import { completeOnboarding } from "@/lib/onboarding/completeOnboarding";
import {
  isValidDoctorProfileInput,
  type DoctorProfileInput,
} from "@/lib/doctor/isValidDoctorProfileInput";

const STEP_COUNT = 4;

export interface OnboardingWizardProps {
  initialProfile: DoctorProfileInput;
  locations: ReviewLocation[];
}

export function OnboardingWizard({
  initialProfile,
  locations,
}: OnboardingWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState(initialProfile);
  const [isPending, startTransition] = useTransition();

  const canAdvance =
    step === 1
      ? isValidDoctorProfileInput(profile)
      : step === 2
        ? locations.length > 0
        : true;

  function handleNext() {
    if (!canAdvance) return;

    if (step === 1) {
      startTransition(async () => {
        await updateDoctorProfile(profile);
        setStep(2);
      });
      return;
    }

    if (step === STEP_COUNT) {
      startTransition(async () => {
        await completeOnboarding();
        router.push("/panel/appointments");
      });
      return;
    }

    setStep((current) => current + 1);
  }

  function handleBack() {
    setStep((current) => Math.max(1, current - 1));
  }

  return (
    <div className="mx-auto max-w-[640px]">
      <OnboardingStepper currentStep={step} />
      <div className="rounded-[22px] border border-card-border bg-white p-6 shadow-[0_18px_50px_rgba(42,37,33,.08)]">
        {step === 1 && <ProfileForm value={profile} onChange={setProfile} />}
        {step === 2 && (
          <LocationEditor
            locations={locations.map((location) => ({
              id: location.id,
              name: location.name,
              address: location.address,
              scheduleBlockCount: location.scheduleBlocks.length,
            }))}
          />
        )}
        {step === 3 && (
          <ScheduleEditor
            locations={locations.map((location) => ({
              id: location.id,
              name: location.name,
              scheduleBlocks: location.scheduleBlocks,
            }))}
          />
        )}
        {step === 4 && <ReviewStep profile={profile} locations={locations} />}

        <div className="mt-5 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="cursor-pointer rounded-full px-4 py-2.5 text-[14px] font-semibold text-muted"
            >
              ← Atrás
            </button>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={handleNext}
            disabled={!canAdvance || isPending}
            className="cursor-pointer rounded-full bg-terracotta px-6.5 py-3 text-[14px] font-bold text-white disabled:cursor-not-allowed disabled:bg-terracotta-disabled"
          >
            {step === STEP_COUNT ? "Entrar al panel" : "Siguiente"}
          </button>
        </div>
      </div>
    </div>
  );
}

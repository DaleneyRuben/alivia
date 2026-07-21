const STEP_LABELS = ["Perfil", "Ubicaciones", "Horarios", "Revisar"];

export interface OnboardingStepperProps {
  currentStep: number;
}

export function OnboardingStepper({ currentStep }: OnboardingStepperProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-center gap-1.5">
      {STEP_LABELS.map((label, index) => {
        const stepNumber = index + 1;
        const active = stepNumber === currentStep;
        return (
          <div key={label} className="flex items-center gap-1.5">
            <span
              aria-current={active ? "step" : undefined}
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[13px] font-bold ${
                active ? "bg-terracotta text-white" : "bg-[#F7F2EA] text-muted"
              }`}
            >
              {stepNumber}
            </span>
            <span
              className={`text-[13px] font-semibold ${active ? "text-ink" : "text-muted"}`}
            >
              {label}
            </span>
            {index < STEP_LABELS.length - 1 && (
              <span className="text-muted">·</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

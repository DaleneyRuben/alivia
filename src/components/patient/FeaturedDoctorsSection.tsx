import { ResultCard, type ResultCardDoctor } from "./ResultCard";

export interface FeaturedDoctorsSectionProps {
  doctors: ResultCardDoctor[];
  today: string;
  tomorrow: string;
}

export function FeaturedDoctorsSection({
  doctors,
  today,
  tomorrow,
}: FeaturedDoctorsSectionProps) {
  if (doctors.length === 0) return null;

  return (
    <div className="border-t border-black/5 bg-white px-6 py-9">
      <div className="mx-auto max-w-[720px]">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-base font-bold">Disponibles ahora</span>
          <span className="rounded-full bg-[#F3ECE1] px-3.5 py-1.5 text-[13px] font-medium text-body-soft">
            ↓ Ordenado por disponibilidad
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {doctors.map((doctor) => (
            <ResultCard
              key={doctor.id}
              doctor={doctor}
              today={today}
              tomorrow={tomorrow}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

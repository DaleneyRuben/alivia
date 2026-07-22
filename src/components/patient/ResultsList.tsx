import Link from "next/link";
import { ResultCard, type ResultCardDoctor } from "./ResultCard";

export interface ResultsListProps {
  specialty: string | null;
  doctors: ResultCardDoctor[];
  today: string;
  tomorrow: string;
}

export function ResultsList({
  specialty,
  doctors,
  today,
  tomorrow,
}: ResultsListProps) {
  const title = specialty || "Todos los especialistas";
  const count = doctors.length;
  const countLabel = `${count} ${count === 1 ? "especialista disponible" : "especialistas disponibles"} en La Paz`;

  return (
    <div className="mx-auto w-full max-w-[760px] px-6 py-5 pb-11">
      <Link
        href="/"
        className="mb-3.5 inline-block text-sm font-semibold text-muted no-underline"
      >
        ← Volver a inicio
      </Link>
      <div className="mb-1.5 flex flex-wrap items-end justify-between gap-2">
        <h1 className="m-0 text-[26px] font-extrabold tracking-[-0.5px]">
          {title}
        </h1>
        <span className="rounded-full bg-[#F3ECE1] px-3.5 py-1.5 text-[13px] font-medium text-body-soft">
          ↓ Ordenado por disponibilidad
        </span>
      </div>
      <p className="mb-4.5 text-sm text-muted">{countLabel}</p>
      <div className="flex flex-col gap-3">
        {doctors.map((doctor) => (
          <ResultCard
            key={doctor.id}
            doctor={doctor}
            today={today}
            tomorrow={tomorrow}
          />
        ))}
        {count === 0 && (
          <p className="py-10 text-center text-[15px] text-muted">
            No encontramos especialistas para esa búsqueda.
          </p>
        )}
      </div>
    </div>
  );
}

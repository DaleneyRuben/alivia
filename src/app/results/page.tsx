import type { Metadata } from "next";
import { ResultsList } from "@/components/patient/ResultsList";
import { getDoctorDirectory } from "@/lib/patients/getDoctorDirectory";
import { matchesDoctorQuery } from "@/lib/patients/matchesDoctorQuery";
import { getLaPazDateString } from "@/lib/time/getLaPazDateString";
import { addDaysToIsoDate } from "@/lib/time/addDaysToIsoDate";

export const metadata: Metadata = { title: "Resultados · Alivia" };

interface ResultsPageProps {
  searchParams: Promise<{ specialty?: string }>;
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const { specialty } = await searchParams;
  const directory = await getDoctorDirectory();
  const today = getLaPazDateString();
  const tomorrow = addDaysToIsoDate(today, 1);

  const doctors = specialty
    ? directory.filter((doctor) => matchesDoctorQuery(doctor, specialty))
    : directory;

  return (
    <ResultsList
      specialty={specialty ?? null}
      doctors={doctors}
      today={today}
      tomorrow={tomorrow}
    />
  );
}

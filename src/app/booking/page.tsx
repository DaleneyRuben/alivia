import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookingForm } from "@/components/patient/BookingForm";
import { getBookingSummary } from "@/lib/patients/getBookingSummary";

export const metadata: Metadata = { title: "Confirma tu cita · Alivia" };

interface BookingPageProps {
  searchParams: Promise<{
    doctorId?: string;
    locationId?: string;
    date?: string;
    start?: string;
  }>;
}

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const { doctorId, locationId, date, start } = await searchParams;
  const startMinutes = Number(start);

  if (!doctorId || !locationId || !date || !Number.isFinite(startMinutes)) {
    notFound();
  }

  const summary = await getBookingSummary({
    doctorId,
    locationId,
    date,
    startMinutes,
  });
  if (!summary) notFound();

  return <BookingForm summary={summary} />;
}

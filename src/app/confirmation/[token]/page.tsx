import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConfirmationCard } from "@/components/patient/ConfirmationCard";
import { getAppointmentByCancelToken } from "@/lib/patients/getAppointmentByCancelToken";

export const metadata: Metadata = { title: "Cita reservada · Alivia" };

interface ConfirmationPageProps {
  params: Promise<{ token: string }>;
}

export default async function ConfirmationPage({
  params,
}: ConfirmationPageProps) {
  const { token } = await params;
  const appointment = await getAppointmentByCancelToken(token);
  if (!appointment) notFound();

  return <ConfirmationCard appointment={appointment} />;
}

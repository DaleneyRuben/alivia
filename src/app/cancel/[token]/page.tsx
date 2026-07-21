import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CancelCard } from "@/components/patient/CancelCard";
import { getAppointmentByCancelToken } from "@/lib/patients/getAppointmentByCancelToken";

export const metadata: Metadata = { title: "Cancelar cita · Alivia" };

interface CancelPageProps {
  params: Promise<{ token: string }>;
}

export default async function CancelPage({ params }: CancelPageProps) {
  const { token } = await params;
  const appointment = await getAppointmentByCancelToken(token);
  if (!appointment) notFound();

  return <CancelCard appointment={appointment} />;
}

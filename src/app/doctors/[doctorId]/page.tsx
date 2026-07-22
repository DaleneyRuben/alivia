import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DoctorProfile } from "@/components/patient/DoctorProfile";
import { getPublicDoctorProfile } from "@/lib/patients/getPublicDoctorProfile";
import { getLaPazDateString } from "@/lib/time/getLaPazDateString";
import { addDaysToIsoDate } from "@/lib/time/addDaysToIsoDate";

export const metadata: Metadata = { title: "Perfil del doctor · Alivia" };

interface DoctorProfilePageProps {
  params: Promise<{ doctorId: string }>;
  searchParams: Promise<{ date?: string }>;
}

export default async function DoctorProfilePage({
  params,
  searchParams,
}: DoctorProfilePageProps) {
  const { doctorId } = await params;
  const { date } = await searchParams;
  const doctor = await getPublicDoctorProfile(doctorId, date);
  if (!doctor) notFound();

  const today = getLaPazDateString();
  const tomorrow = addDaysToIsoDate(today, 1);

  return <DoctorProfile doctor={doctor} today={today} tomorrow={tomorrow} />;
}

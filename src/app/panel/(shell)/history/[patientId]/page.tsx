import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireDoctorOnlyId } from "@/lib/auth/requireDoctorOnlyId";
import { getPatientHistoryDetail } from "@/lib/history/getPatientHistoryDetail";
import { initials } from "@/lib/text/initials";
import { avatarTint } from "@/lib/text/avatarTint";
import { FirstVisitForm } from "@/components/panel/history/FirstVisitForm";
import { MedicalProfileCard } from "@/components/panel/history/MedicalProfileCard";
import { DiagnosisTimeline } from "@/components/panel/history/DiagnosisTimeline";

export const metadata: Metadata = { title: "Historial del paciente · Alivia" };

interface PatientHistoryPageProps {
  params: Promise<{ patientId: string }>;
}

export default async function PatientHistoryPage({
  params,
}: PatientHistoryPageProps) {
  const { patientId } = await params;
  const doctorId = await requireDoctorOnlyId();
  const patient = await getPatientHistoryDetail(doctorId, patientId);
  if (!patient) notFound();

  const tint = avatarTint(patient.id);

  return (
    <main className="mx-auto max-w-[760px] flex-1 p-8">
      <Link
        href="/panel/history"
        className="mb-3.5 inline-block text-sm font-semibold text-muted no-underline"
      >
        ← Volver a pacientes
      </Link>
      <div className="mb-4.5 flex flex-wrap items-center gap-3.5">
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-base font-bold"
          style={{ backgroundColor: tint.bg, color: tint.text }}
        >
          {initials(patient.name)}
        </span>
        <div className="flex-1">
          <h1 className="m-0 text-[22px] font-extrabold tracking-tight">
            {patient.name}
          </h1>
          <div className="text-[13px] text-muted">{patient.phone}</div>
        </div>
      </div>

      {patient.medicalProfile ? (
        <>
          <MedicalProfileCard
            patientId={patient.id}
            dateOfBirth={patient.medicalProfile.dateOfBirth}
            bloodType={patient.medicalProfile.bloodType}
            allergiesAndHistory={patient.medicalProfile.allergiesAndHistory}
          />
          <DiagnosisTimeline
            patientId={patient.id}
            entries={patient.diagnosisEntries}
          />
        </>
      ) : (
        <FirstVisitForm patientId={patient.id} />
      )}
    </main>
  );
}

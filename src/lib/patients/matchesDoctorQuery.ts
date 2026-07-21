export interface DoctorQueryFields {
  name: string;
  specialty: string;
}

// Case-insensitive substring match on specialty OR name (docs/flows/patient-site.md §2)
export function matchesDoctorQuery(
  doctor: DoctorQueryFields,
  query: string,
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    doctor.specialty.toLowerCase().includes(q) ||
    doctor.name.toLowerCase().includes(q)
  );
}

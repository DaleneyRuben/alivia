export interface DoctorProfileInput {
  name: string;
  specialty: string;
  yearsExperience: number | null;
  bio: string;
}

export function isValidDoctorProfileInput({
  name,
  specialty,
  yearsExperience,
}: DoctorProfileInput): boolean {
  if (name.trim().length === 0) return false;
  if (specialty.trim().length === 0) return false;
  if (
    yearsExperience !== null &&
    (!Number.isInteger(yearsExperience) || yearsExperience < 0)
  ) {
    return false;
  }
  return true;
}

export interface DiagnosisEntryInput {
  diagnosis: string;
  treatment: string;
}

export function isValidDiagnosisEntryInput({
  diagnosis,
  treatment,
}: DiagnosisEntryInput): boolean {
  return diagnosis.trim().length > 0 && treatment.trim().length > 0;
}

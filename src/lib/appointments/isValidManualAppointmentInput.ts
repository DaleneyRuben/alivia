export interface ManualAppointmentInput {
  patientName: string;
  patientPhone: string;
  locationId: string;
  date: string;
  startMinutes: number;
  endMinutes: number;
}

export function isValidManualAppointmentInput({
  patientName,
  patientPhone,
  locationId,
  date,
  startMinutes,
  endMinutes,
}: ManualAppointmentInput): boolean {
  if (patientName.trim().length === 0) return false;
  if (patientPhone.trim().length === 0) return false;
  if (locationId.length === 0) return false;
  if (date.length === 0) return false;
  if (endMinutes <= startMinutes) return false;
  return true;
}

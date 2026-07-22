export interface ScheduleBlockConfig {
  weekdays: number[];
  startMinutes: number;
  endMinutes: number;
  slotDurationMinutes: number;
  slotCapacity: number;
}

export interface LocationConfig {
  name: string;
  address: string;
  scheduleBlocks: ScheduleBlockConfig[];
}

export interface DiagnosisEntryConfig {
  diagnosis: string;
  treatment: string;
  createdAt: Date;
}

export interface MedicalHistoryConfig {
  dateOfBirth?: string;
  bloodType?: string;
  allergiesAndHistory?: string;
  entries: DiagnosisEntryConfig[];
}

export interface AppointmentConfig {
  locationName: string;
  dayOffset: number;
  startHour: number;
  startMinute?: number;
  durationMinutes: number;
  status: "SCHEDULED" | "ATTENDED" | "NO_SHOW" | "CANCELLED";
  confirmation?: "PENDING" | "CONFIRMED";
  source: "PATIENT" | "STAFF";
}

export interface PatientConfig {
  name: string;
  phone: string;
  appointments: AppointmentConfig[];
  history?: MedicalHistoryConfig;
}

export interface VacationConfig {
  locationName: string | null;
  startDayOffset: number;
  endDayOffset: number;
}

export interface AssistantConfig {
  email: string;
  name: string;
  phone: string;
}

export interface DoctorConfig {
  email: string;
  name: string;
  phone: string;
  specialty: string;
  practiceName?: string;
  yearsExperience?: number;
  university?: string;
  bio?: string;
  onboardedAt: Date | null;
  medicalHistoryEnabled: boolean;
  accountActive: boolean;
  subscriptionStatus: "ACTIVE" | "INACTIVE";
  assistant?: AssistantConfig;
  locations: LocationConfig[];
  vacations?: VacationConfig[];
  patients: PatientConfig[];
}

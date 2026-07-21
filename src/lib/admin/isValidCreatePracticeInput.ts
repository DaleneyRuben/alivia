export interface DoctorAccountInput {
  name: string;
  specialty: string;
  email: string;
  phone: string;
}

export interface AssistantAccountInput {
  name: string;
  email: string;
  phone: string;
}

export interface CreatePracticeInput {
  doctor: DoctorAccountInput;
  assistant: AssistantAccountInput | null;
}

function isValidAccount({
  name,
  email,
  phone,
}: {
  name: string;
  email: string;
  phone: string;
}): boolean {
  return (
    name.trim().length > 0 &&
    email.trim().includes("@") &&
    phone.trim().length >= 6
  );
}

// Phone is mandatory for both accounts — the founder's only channel to send
// the WhatsApp setup link, since there's no email delivery (ADR-0016)
export function isValidCreatePracticeInput({
  doctor,
  assistant,
}: CreatePracticeInput): boolean {
  if (doctor.specialty.trim().length === 0) return false;
  if (!isValidAccount(doctor)) return false;
  if (assistant && !isValidAccount(assistant)) return false;
  return true;
}

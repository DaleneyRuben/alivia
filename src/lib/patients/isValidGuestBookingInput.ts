export interface GuestBookingInput {
  name: string;
  phone: string;
}

// docs/flows/patient-site.md §4: name length > 1 AND phone length >= 6
export function isValidGuestBookingInput({
  name,
  phone,
}: GuestBookingInput): boolean {
  return name.trim().length > 1 && phone.trim().length >= 6;
}

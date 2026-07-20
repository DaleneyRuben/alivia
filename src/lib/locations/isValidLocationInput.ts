export interface LocationInput {
  name: string;
  address: string;
}

export function isValidLocationInput({
  name,
  address,
}: LocationInput): boolean {
  if (name.trim().length === 0) return false;
  if (address.trim().length === 0) return false;
  return true;
}

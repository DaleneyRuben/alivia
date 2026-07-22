export function toE164(dial: string, national: string): string {
  const digits = national.replace(/\D/g, "");
  if (digits.length === 0) return "";
  return `${dial}${digits}`;
}

export interface WhatsAppLinkInput {
  phone: string;
  message: string;
}

// manual wa.me links only — no WhatsApp Business API automation (ADR-0003)
export function buildWhatsAppLink({
  phone,
  message,
}: WhatsAppLinkInput): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

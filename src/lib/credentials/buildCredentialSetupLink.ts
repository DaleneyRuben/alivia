import { buildWhatsAppLink } from "../whatsapp/buildWhatsAppLink";

export type CredentialLinkKind = "setup" | "reset";

export interface BuildCredentialSetupLinkInput {
  recipientName: string;
  phone: string;
  token: string;
  baseUrl: string;
  kind: CredentialLinkKind;
}

const MESSAGE_BY_KIND: Record<
  CredentialLinkKind,
  (name: string, url: string) => string
> = {
  setup: (name, url) =>
    `Hola ${name}, bienvenido/a a Alivia. Crea tu contraseña de acceso aquí: ${url}`,
  reset: (name, url) =>
    `Hola ${name}, aquí tienes tu enlace para restablecer tu contraseña de Alivia: ${url}`,
};

// reuses the same token mechanism for first-time setup and admin-driven resets (ADR-0015),
// delivered as a manual wa.me link instead of email (ADR-0016)
export function buildCredentialSetupLink({
  recipientName,
  phone,
  token,
  baseUrl,
  kind,
}: BuildCredentialSetupLinkInput): string {
  const url = `${baseUrl}/set-password?token=${token}`;
  const message = MESSAGE_BY_KIND[kind](recipientName, url);
  return buildWhatsAppLink({ phone, message });
}

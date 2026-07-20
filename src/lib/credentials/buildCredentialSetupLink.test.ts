import { describe, expect, it } from "vitest";

import { buildCredentialSetupLink } from "./buildCredentialSetupLink";

describe("buildCredentialSetupLink", () => {
  it("builds a whatsapp link with a setup message for a new account", () => {
    const link = buildCredentialSetupLink({
      recipientName: "Dra. Valeria Rojas",
      phone: "+591 71234567",
      token: "abc123",
      baseUrl: "https://alivia.bo",
      kind: "setup",
    });

    expect(link).toBe(
      `https://wa.me/59171234567?text=${encodeURIComponent(
        "Hola Dra. Valeria Rojas, bienvenido/a a Alivia. Crea tu contraseña de acceso aquí: https://alivia.bo/set-password?token=abc123",
      )}`,
    );
  });

  it("builds a whatsapp link with a reset message for an existing account", () => {
    const link = buildCredentialSetupLink({
      recipientName: "María Fernanda Quispe",
      phone: "+591 76543210",
      token: "xyz789",
      baseUrl: "https://alivia.bo",
      kind: "reset",
    });

    expect(link).toBe(
      `https://wa.me/59176543210?text=${encodeURIComponent(
        "Hola María Fernanda Quispe, aquí tienes tu enlace para restablecer tu contraseña de Alivia: https://alivia.bo/set-password?token=xyz789",
      )}`,
    );
  });
});

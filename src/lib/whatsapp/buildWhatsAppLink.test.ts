import { describe, expect, it } from "vitest";

import { buildWhatsAppLink } from "./buildWhatsAppLink";

describe("buildWhatsAppLink", () => {
  it("strips non-digit characters from the phone number", () => {
    expect(
      buildWhatsAppLink({ phone: "+591 712-34567", message: "hola" }),
    ).toBe("https://wa.me/59171234567?text=hola");
  });

  it("url-encodes the message", () => {
    const link = buildWhatsAppLink({
      phone: "59171234567",
      message: "Hola, ¿cómo estás?",
    });

    expect(link).toBe(
      `https://wa.me/59171234567?text=${encodeURIComponent("Hola, ¿cómo estás?")}`,
    );
  });
});

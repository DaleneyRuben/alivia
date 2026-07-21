import { describe, expect, it } from "vitest";
import { buildConfirmationMessage } from "./buildConfirmationMessage";

describe("buildConfirmationMessage", () => {
  it("builds the day-before reminder in neutral Spanish", () => {
    const message = buildConfirmationMessage({
      doctorName: "Dra. Valeria Rojas",
      patientName: "Juana Pérez",
      date: "2026-07-21",
      startMinutes: 540,
    });

    expect(message).toBe(
      "Hola Juana, le recordamos su cita con Dra. Valeria Rojas mañana martes 21 de julio a las 09:00. ¿Podrá asistir?",
    );
  });

  it("uses only the patient's first name", () => {
    const message = buildConfirmationMessage({
      doctorName: "Dr. Marco Antonio Salazar",
      patientName: "Ana María Vargas Rojas",
      date: "2026-01-05",
      startMinutes: 930,
    });

    expect(message).toContain("Hola Ana,");
    expect(message).not.toContain("Vargas");
  });
});

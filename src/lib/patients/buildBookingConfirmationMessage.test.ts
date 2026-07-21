import { describe, expect, it } from "vitest";
import { buildBookingConfirmationMessage } from "./buildBookingConfirmationMessage";

describe("buildBookingConfirmationMessage", () => {
  it("builds the self-send confirmation message", () => {
    const message = buildBookingConfirmationMessage({
      doctorName: "Dra. Carla Mendoza",
      locationName: "Centro Médico Miraflores",
      date: "2026-07-23",
      startMinutes: 930,
    });

    expect(message).toBe(
      "Hola, confirmo mi cita con Dra. Carla Mendoza el jueves 23 de julio a las 15:30 en Centro Médico Miraflores.",
    );
  });
});

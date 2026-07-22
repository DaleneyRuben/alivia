import { describe, expect, it, vi, beforeEach } from "vitest";
import { hasAttendedAppointment } from "./hasAttendedAppointment";

const appointmentCount = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    appointment: { count: (...a: unknown[]) => appointmentCount(...a) },
  },
}));

describe("hasAttendedAppointment", () => {
  beforeEach(() => {
    appointmentCount.mockReset();
  });

  it("is true when the patient has at least one ATTENDED appointment with this doctor", async () => {
    appointmentCount.mockResolvedValue(1);

    await expect(hasAttendedAppointment("doctor-1", "patient-1")).resolves.toBe(
      true,
    );
    expect(appointmentCount).toHaveBeenCalledWith({
      where: {
        doctorId: "doctor-1",
        patientId: "patient-1",
        status: "ATTENDED",
      },
    });
  });

  it("is false when there is no ATTENDED appointment", async () => {
    appointmentCount.mockResolvedValue(0);

    await expect(hasAttendedAppointment("doctor-1", "patient-1")).resolves.toBe(
      false,
    );
  });
});

import { describe, expect, it, vi, beforeEach } from "vitest";
import { updateAppointmentStatus } from "./updateAppointmentStatus";

const DOCTOR_ID = "doctor-1";

const findUnique = vi.fn();
const update = vi.fn();

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/schedule/requireDoctorId", () => ({
  requireDoctorId: () => Promise.resolve(DOCTOR_ID),
}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    appointment: {
      findUnique: (...a: unknown[]) => findUnique(...a),
      update: (...a: unknown[]) => update(...a),
    },
  },
}));

describe("updateAppointmentStatus", () => {
  beforeEach(() => {
    findUnique.mockReset();
    update.mockReset();
  });

  it("throws if the appointment belongs to a different doctor", async () => {
    findUnique.mockResolvedValue({
      id: "a1",
      doctorId: "other-doctor",
      status: "SCHEDULED",
    });

    await expect(updateAppointmentStatus("a1", "ATTENDED")).rejects.toThrow(
      "Not authorized",
    );
    expect(update).not.toHaveBeenCalled();
  });

  it.each(["ATTENDED", "NO_SHOW", "CANCELLED"] as const)(
    "updates a SCHEDULED appointment to %s",
    async (status) => {
      findUnique.mockResolvedValue({
        id: "a1",
        doctorId: DOCTOR_ID,
        status: "SCHEDULED",
      });

      await updateAppointmentStatus("a1", status);

      expect(update).toHaveBeenCalledWith({
        where: { id: "a1" },
        data: { status },
      });
    },
  );

  it.each(["ATTENDED", "NO_SHOW", "CANCELLED"] as const)(
    "rejects transitioning an appointment already in the final state %s",
    async (finalStatus) => {
      findUnique.mockResolvedValue({
        id: "a1",
        doctorId: DOCTOR_ID,
        status: finalStatus,
      });

      await expect(updateAppointmentStatus("a1", "ATTENDED")).rejects.toThrow(
        "Appointment is no longer pending",
      );
      expect(update).not.toHaveBeenCalled();
    },
  );
});

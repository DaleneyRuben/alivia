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

// 16:00 La Paz on 2026-07-20 (20:00 UTC)
const NOW = new Date("2026-07-20T20:00:00.000Z");
const pastAppointment = {
  id: "a1",
  doctorId: DOCTOR_ID,
  status: "SCHEDULED",
  date: new Date("2026-07-20T00:00:00.000Z"),
  startMinutes: 540, // 09:00 La Paz — already passed relative to NOW
};
const futureAppointment = {
  id: "a1",
  doctorId: DOCTOR_ID,
  status: "SCHEDULED",
  date: new Date("2026-07-20T00:00:00.000Z"),
  startMinutes: 18 * 60, // 18:00 La Paz — hasn't passed relative to NOW
};

describe("updateAppointmentStatus", () => {
  beforeEach(() => {
    findUnique.mockReset();
    update.mockReset();
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  it("throws if the appointment belongs to a different doctor", async () => {
    findUnique.mockResolvedValue({ ...pastAppointment, doctorId: "other" });

    await expect(updateAppointmentStatus("a1", "ATTENDED")).rejects.toThrow(
      "Not authorized",
    );
    expect(update).not.toHaveBeenCalled();
  });

  it.each(["ATTENDED", "NO_SHOW", "CANCELLED"] as const)(
    "updates a SCHEDULED appointment to %s once its time has passed",
    async (status) => {
      findUnique.mockResolvedValue(pastAppointment);

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
      findUnique.mockResolvedValue({ ...pastAppointment, status: finalStatus });

      await expect(updateAppointmentStatus("a1", "ATTENDED")).rejects.toThrow(
        "Appointment is no longer pending",
      );
      expect(update).not.toHaveBeenCalled();
    },
  );

  it.each(["ATTENDED", "NO_SHOW"] as const)(
    "rejects marking %s before the appointment's scheduled time has passed",
    async (status) => {
      findUnique.mockResolvedValue(futureAppointment);

      await expect(updateAppointmentStatus("a1", status)).rejects.toThrow(
        "Appointment time hasn't passed yet",
      );
      expect(update).not.toHaveBeenCalled();
    },
  );

  it("allows cancelling an appointment before its scheduled time has passed", async () => {
    findUnique.mockResolvedValue(futureAppointment);

    await updateAppointmentStatus("a1", "CANCELLED");

    expect(update).toHaveBeenCalledWith({
      where: { id: "a1" },
      data: { status: "CANCELLED" },
    });
  });
});

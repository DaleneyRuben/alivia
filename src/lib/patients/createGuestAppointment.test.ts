import { describe, expect, it, vi, beforeEach } from "vitest";
import { createGuestAppointment } from "./createGuestAppointment";

const redirect = vi.fn();
const getBookingSummary = vi.fn();
const patientUpsert = vi.fn();
const appointmentCreate = vi.fn();

vi.mock("next/navigation", () => ({
  redirect: (...a: unknown[]) => redirect(...a),
}));
vi.mock("./getBookingSummary", () => ({
  getBookingSummary: (...a: unknown[]) => getBookingSummary(...a),
}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    patient: { upsert: (...a: unknown[]) => patientUpsert(...a) },
    appointment: { create: (...a: unknown[]) => appointmentCreate(...a) },
  },
}));

const input = {
  doctorId: "doctor-1",
  locationId: "loc-1",
  date: "2026-07-20",
  startMinutes: 480,
  name: "Ana Rojas",
  phone: "71234567",
};

describe("createGuestAppointment", () => {
  beforeEach(() => {
    redirect.mockReset();
    getBookingSummary.mockReset();
    patientUpsert.mockReset();
    appointmentCreate.mockReset();
  });

  it("rejects booking when the slot is no longer available — hard cap for patient self-booking", async () => {
    getBookingSummary.mockResolvedValue({
      isAvailable: false,
      endMinutes: 510,
    });

    await expect(createGuestAppointment(input)).rejects.toThrow(
      "Slot is no longer available",
    );
    expect(patientUpsert).not.toHaveBeenCalled();
    expect(appointmentCreate).not.toHaveBeenCalled();
  });

  it("upserts the patient by doctorId+phone instead of creating a duplicate", async () => {
    getBookingSummary.mockResolvedValue({ isAvailable: true, endMinutes: 510 });
    patientUpsert.mockResolvedValue({ id: "patient-1" });
    appointmentCreate.mockResolvedValue({ cancelToken: "token-1" });

    await createGuestAppointment(input);

    expect(patientUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { doctorId_phone: { doctorId: "doctor-1", phone: "71234567" } },
      }),
    );
    expect(redirect).toHaveBeenCalledWith("/confirmation/token-1");
  });
});

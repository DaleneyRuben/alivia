import { describe, expect, it, vi, beforeEach } from "vitest";
import { createManualAppointment } from "./createManualAppointment";

const DOCTOR_ID = "doctor-1";

const revalidatePath = vi.fn();
const locationFindUnique = vi.fn();
const patientUpsert = vi.fn();
const appointmentCreate = vi.fn();

vi.mock("next/cache", () => ({
  revalidatePath: (...a: unknown[]) => revalidatePath(...a),
}));
vi.mock("@/lib/schedule/requireDoctorId", () => ({
  requireDoctorId: () => Promise.resolve(DOCTOR_ID),
}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    location: { findUnique: (...a: unknown[]) => locationFindUnique(...a) },
    patient: { upsert: (...a: unknown[]) => patientUpsert(...a) },
    appointment: { create: (...a: unknown[]) => appointmentCreate(...a) },
  },
}));

const location = { id: "loc-1", doctorId: DOCTOR_ID, deletedAt: null };
const input = {
  patientName: "Carla Vega",
  patientPhone: "77654321",
  locationId: "loc-1",
  date: "2026-07-20",
  startMinutes: 480,
  endMinutes: 510,
};

describe("createManualAppointment", () => {
  beforeEach(() => {
    revalidatePath.mockReset();
    locationFindUnique.mockReset();
    patientUpsert.mockReset();
    appointmentCreate.mockReset();
    locationFindUnique.mockResolvedValue(location);
    patientUpsert.mockResolvedValue({ id: "patient-1" });
  });

  it("allows a staff override past the slot's capacity — no capacity check for the manual add path", async () => {
    await createManualAppointment(input);

    expect(appointmentCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ source: "STAFF" }),
      }),
    );
  });

  it("upserts the patient by doctorId+phone instead of creating a duplicate", async () => {
    await createManualAppointment(input);

    expect(patientUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { doctorId_phone: { doctorId: DOCTOR_ID, phone: "77654321" } },
      }),
    );
  });

  it("rejects a location belonging to a different doctor", async () => {
    locationFindUnique.mockResolvedValue({
      ...location,
      doctorId: "other-doctor",
    });

    await expect(createManualAppointment(input)).rejects.toThrow(
      "Not authorized",
    );
    expect(appointmentCreate).not.toHaveBeenCalled();
  });
});

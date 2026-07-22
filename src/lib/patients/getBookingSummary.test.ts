import { describe, expect, it, vi, beforeEach } from "vitest";
import { getBookingSummary } from "./getBookingSummary";

const doctorFindUnique = vi.fn();
const locationFindUnique = vi.fn();
const vacationFindMany = vi.fn();
const appointmentCount = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    doctor: { findUnique: (...a: unknown[]) => doctorFindUnique(...a) },
    location: { findUnique: (...a: unknown[]) => locationFindUnique(...a) },
    vacation: { findMany: (...a: unknown[]) => vacationFindMany(...a) },
    appointment: { count: (...a: unknown[]) => appointmentCount(...a) },
  },
}));

const doctor = {
  id: "doctor-1",
  name: "Dra. Paz",
  onboardedAt: new Date("2026-01-01"),
};
const location = {
  id: "loc-1",
  doctorId: "doctor-1",
  name: "Consultorio Central",
  deletedAt: null,
  scheduleBlocks: [
    {
      weekdays: [0, 1, 2, 3, 4, 5, 6],
      startMinutes: 480,
      endMinutes: 600,
      slotDurationMinutes: 30,
      slotCapacity: 2,
    },
  ],
};
const input = {
  doctorId: "doctor-1",
  locationId: "loc-1",
  date: "2026-07-20",
  startMinutes: 480,
};

describe("getBookingSummary", () => {
  beforeEach(() => {
    doctorFindUnique.mockReset();
    locationFindUnique.mockReset();
    vacationFindMany.mockReset();
    appointmentCount.mockReset();
    doctorFindUnique.mockResolvedValue(doctor);
    locationFindUnique.mockResolvedValue(location);
    vacationFindMany.mockResolvedValue([]);
  });

  it("is available when booked appointments are below capacity", async () => {
    appointmentCount.mockResolvedValue(1);

    const summary = await getBookingSummary(input);

    expect(summary?.isAvailable).toBe(true);
  });

  it("is not available once booked appointments reach capacity — hard cap for patient self-booking", async () => {
    appointmentCount.mockResolvedValue(2);

    const summary = await getBookingSummary(input);

    expect(summary?.isAvailable).toBe(false);
  });

  it("counts only non-cancelled appointments toward capacity — cancelling reopens the slot", async () => {
    appointmentCount.mockResolvedValue(0);

    await getBookingSummary(input);

    expect(appointmentCount).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: { not: "CANCELLED" } }),
      }),
    );
  });
});

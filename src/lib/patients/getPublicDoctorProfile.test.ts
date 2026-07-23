import { describe, expect, it, vi, beforeEach } from "vitest";
import { getPublicDoctorProfile } from "./getPublicDoctorProfile";

const doctorFindUnique = vi.fn();
const appointmentFindMany = vi.fn();
const vacationFindMany = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    doctor: { findUnique: (...a: unknown[]) => doctorFindUnique(...a) },
    appointment: { findMany: (...a: unknown[]) => appointmentFindMany(...a) },
    vacation: { findMany: (...a: unknown[]) => vacationFindMany(...a) },
  },
}));

// prototype "now" fixed at 2026-07-20 14:00 La Paz (18:00 UTC)
const NOW = new Date("2026-07-20T18:00:00.000Z");

const doctor = {
  id: "doctor-1",
  name: "Dra. Paz",
  specialty: "Cardiología",
  bio: "Bio",
  yearsExperience: 10,
  university: "UMSA",
  onboardedAt: new Date("2026-01-01"),
  locations: [
    {
      id: "loc-1",
      name: "Consultorio Central",
      address: "Av. Busch",
      scheduleBlocks: [
        {
          weekdays: [0, 1, 2, 3, 4, 5, 6],
          startMinutes: 480, // 08:00
          endMinutes: 1200, // 20:00
          slotDurationMinutes: 30,
          slotCapacity: 2,
        },
      ],
    },
  ],
};

describe("getPublicDoctorProfile", () => {
  beforeEach(() => {
    doctorFindUnique.mockReset();
    appointmentFindMany.mockReset();
    vacationFindMany.mockReset();
    doctorFindUnique.mockResolvedValue(doctor);
    appointmentFindMany.mockResolvedValue([]);
    vacationFindMany.mockResolvedValue([]);
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  it("returns null for a doctor who hasn't completed onboarding", async () => {
    doctorFindUnique.mockResolvedValue({ ...doctor, onboardedAt: null });

    expect(await getPublicDoctorProfile("doctor-1")).toBeNull();
  });

  it("defaults to today's slots when no date is requested", async () => {
    const profile = await getPublicDoctorProfile("doctor-1");

    expect(profile?.selectedDate).toBe("2026-07-20");
    expect(profile?.slots.every((slot) => slot.date === "2026-07-20")).toBe(
      true,
    );
  });

  it("returns the requested date's slots when it falls inside the booking window", async () => {
    const profile = await getPublicDoctorProfile("doctor-1", "2026-07-22");

    expect(profile?.selectedDate).toBe("2026-07-22");
    expect(profile?.slots.every((slot) => slot.date === "2026-07-22")).toBe(
      true,
    );
  });

  it("falls back to today when the requested date is outside the booking window", async () => {
    const profile = await getPublicDoctorProfile("doctor-1", "2026-08-15");

    expect(profile?.selectedDate).toBe("2026-07-20");
  });

  it("excludes slots starting inside the 2-hour lead time from being bookable", async () => {
    const profile = await getPublicDoctorProfile("doctor-1");

    // now is 14:00 La Paz; 14:00-16:00 slots start inside the lead time
    const tooSoon = profile?.slots.filter((slot) => slot.startMinutes < 960);
    expect(tooSoon?.every((slot) => !slot.availableToPatients)).toBe(true);

    const bookable = profile?.slots.find((slot) => slot.startMinutes === 960);
    expect(bookable?.availableToPatients).toBe(true);
  });

  it("reports the 14-day booking window bounds", async () => {
    const profile = await getPublicDoctorProfile("doctor-1");

    expect(profile?.windowStart).toBe("2026-07-20");
    expect(profile?.windowEnd).toBe("2026-08-03");
  });
});

import { describe, expect, it, vi, beforeEach } from "vitest";
import { getDoctorDirectory } from "./getDoctorDirectory";

const doctorFindMany = vi.fn();
const appointmentFindMany = vi.fn();
const vacationFindMany = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    doctor: { findMany: (...a: unknown[]) => doctorFindMany(...a) },
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
  yearsExperience: 10,
  locations: [
    {
      id: "loc-1",
      name: "Consultorio Central",
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

describe("getDoctorDirectory", () => {
  beforeEach(() => {
    doctorFindMany.mockReset();
    appointmentFindMany.mockReset();
    vacationFindMany.mockReset();
    doctorFindMany.mockResolvedValue([doctor]);
    appointmentFindMany.mockResolvedValue([]);
    vacationFindMany.mockResolvedValue([]);
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  it("skips a soonest slot that starts inside the 2-hour lead time", async () => {
    const [directoryDoctor] = await getDoctorDirectory();

    // now is 14:00 La Paz — the 14:00 slot is inside the lead time, 16:00 is not
    expect(directoryDoctor.soonestSlot).toEqual({
      date: "2026-07-20",
      startMinutes: 960,
    });
  });
});

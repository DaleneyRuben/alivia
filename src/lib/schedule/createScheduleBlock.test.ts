import { describe, expect, it, vi, beforeEach } from "vitest";
import { createScheduleBlock } from "./createScheduleBlock";

const DOCTOR_ID = "doctor-1";

const revalidatePath = vi.fn();
const locationFindUnique = vi.fn();
const scheduleBlockFindMany = vi.fn();
const scheduleBlockCreate = vi.fn();

vi.mock("next/cache", () => ({
  revalidatePath: (...a: unknown[]) => revalidatePath(...a),
}));
vi.mock("./requireDoctorId", () => ({
  requireDoctorId: () => Promise.resolve(DOCTOR_ID),
}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    location: { findUnique: (...a: unknown[]) => locationFindUnique(...a) },
    scheduleBlock: {
      findMany: (...a: unknown[]) => scheduleBlockFindMany(...a),
      create: (...a: unknown[]) => scheduleBlockCreate(...a),
    },
  },
}));

const location = { id: "loc-1", doctorId: DOCTOR_ID };
const input = {
  locationId: "loc-1",
  weekdays: [1, 2, 3],
  startMinutes: 8 * 60,
  endMinutes: 12 * 60,
  slotDurationMinutes: 30,
  slotCapacity: 3,
};

describe("createScheduleBlock", () => {
  beforeEach(() => {
    revalidatePath.mockReset();
    locationFindUnique.mockReset();
    scheduleBlockFindMany.mockReset();
    scheduleBlockCreate.mockReset();
    locationFindUnique.mockResolvedValue(location);
    scheduleBlockFindMany.mockResolvedValue([]);
  });

  it("creates the block when there is no overlap", async () => {
    await createScheduleBlock(input);

    expect(scheduleBlockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ locationId: "loc-1" }),
      }),
    );
    expect(revalidatePath).toHaveBeenCalledWith("/panel/schedule");
  });

  it("rejects a block that overlaps an existing one at a different location", async () => {
    scheduleBlockFindMany.mockResolvedValue([
      {
        id: "block-other",
        weekdays: [1],
        startMinutes: 10 * 60,
        endMinutes: 11 * 60,
        location: { name: "Consultorio San Miguel" },
      },
    ]);

    await expect(createScheduleBlock(input)).rejects.toThrow(
      "Ya tienes un horario en Consultorio San Miguel que se cruza con este bloque.",
    );
    expect(scheduleBlockCreate).not.toHaveBeenCalled();
  });

  it("rejects a location belonging to a different doctor", async () => {
    locationFindUnique.mockResolvedValue({ ...location, doctorId: "other" });

    await expect(createScheduleBlock(input)).rejects.toThrow("Not authorized");
    expect(scheduleBlockCreate).not.toHaveBeenCalled();
  });
});

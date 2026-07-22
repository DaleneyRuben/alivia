import { describe, expect, it, vi, beforeEach } from "vitest";
import { updateScheduleBlock } from "./updateScheduleBlock";

const DOCTOR_ID = "doctor-1";

const revalidatePath = vi.fn();
const scheduleBlockFindUnique = vi.fn();
const scheduleBlockFindMany = vi.fn();
const scheduleBlockUpdate = vi.fn();

vi.mock("next/cache", () => ({
  revalidatePath: (...a: unknown[]) => revalidatePath(...a),
}));
vi.mock("./requireDoctorId", () => ({
  requireDoctorId: () => Promise.resolve(DOCTOR_ID),
}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    scheduleBlock: {
      findUnique: (...a: unknown[]) => scheduleBlockFindUnique(...a),
      findMany: (...a: unknown[]) => scheduleBlockFindMany(...a),
      update: (...a: unknown[]) => scheduleBlockUpdate(...a),
    },
  },
}));

const block = {
  id: "block-1",
  location: { id: "loc-1", doctorId: DOCTOR_ID, name: "Clínica del Corazón" },
};
const input = {
  blockId: "block-1",
  weekdays: [1, 2, 3],
  startMinutes: 8 * 60,
  endMinutes: 12 * 60,
  slotDurationMinutes: 30,
  slotCapacity: 3,
};

describe("updateScheduleBlock", () => {
  beforeEach(() => {
    revalidatePath.mockReset();
    scheduleBlockFindUnique.mockReset();
    scheduleBlockFindMany.mockReset();
    scheduleBlockUpdate.mockReset();
    scheduleBlockFindUnique.mockResolvedValue(block);
    scheduleBlockFindMany.mockResolvedValue([]);
  });

  it("updates the block when there is no overlap", async () => {
    await updateScheduleBlock(input);

    expect(scheduleBlockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "block-1" } }),
    );
    expect(revalidatePath).toHaveBeenCalledWith("/panel/schedule");
  });

  it("excludes the block itself from the overlap check", async () => {
    await updateScheduleBlock(input);

    expect(scheduleBlockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: { not: "block-1" } }),
      }),
    );
  });

  it("rejects an edit that now overlaps another of the doctor's blocks", async () => {
    scheduleBlockFindMany.mockResolvedValue([
      {
        id: "block-other",
        weekdays: [2],
        startMinutes: 9 * 60,
        endMinutes: 10 * 60,
        location: { name: "Consultorio San Miguel" },
      },
    ]);

    await expect(updateScheduleBlock(input)).rejects.toThrow(
      "Ya tienes un horario en Consultorio San Miguel que se cruza con este bloque.",
    );
    expect(scheduleBlockUpdate).not.toHaveBeenCalled();
  });

  it("rejects a block belonging to a different doctor", async () => {
    scheduleBlockFindUnique.mockResolvedValue({
      ...block,
      location: { ...block.location, doctorId: "other" },
    });

    await expect(updateScheduleBlock(input)).rejects.toThrow("Not authorized");
    expect(scheduleBlockUpdate).not.toHaveBeenCalled();
  });
});

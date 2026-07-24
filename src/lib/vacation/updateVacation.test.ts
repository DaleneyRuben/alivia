import { describe, expect, it, vi, beforeEach } from "vitest";
import { updateVacation } from "./updateVacation";

const DOCTOR_ID = "doctor-1";
const TODAY = "2026-07-01";

const revalidatePath = vi.fn();
const vacationFindUnique = vi.fn();
const vacationFindMany = vi.fn();
const vacationUpdate = vi.fn();

vi.mock("next/cache", () => ({
  revalidatePath: (...a: unknown[]) => revalidatePath(...a),
}));
vi.mock("@/lib/schedule/requireDoctorId", () => ({
  requireDoctorId: () => Promise.resolve(DOCTOR_ID),
}));
vi.mock("@/lib/time/getLaPazDateString", () => ({
  getLaPazDateString: () => TODAY,
}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    vacation: {
      findUnique: (...a: unknown[]) => vacationFindUnique(...a),
      findMany: (...a: unknown[]) => vacationFindMany(...a),
      update: (...a: unknown[]) => vacationUpdate(...a),
    },
  },
}));

const vacation = {
  id: "vacation-1",
  doctorId: DOCTOR_ID,
  locationId: "loc-1",
  startDate: new Date("2026-07-10T00:00:00.000Z"),
  endDate: new Date("2026-07-20T00:00:00.000Z"),
};
const input = {
  vacationId: "vacation-1",
  locationId: "loc-1",
  startDate: "2026-07-12",
  endDate: "2026-07-22",
};

describe("updateVacation", () => {
  beforeEach(() => {
    revalidatePath.mockReset();
    vacationFindUnique.mockReset();
    vacationFindMany.mockReset();
    vacationUpdate.mockReset();
    vacationFindUnique.mockResolvedValue(vacation);
    vacationFindMany.mockResolvedValue([]);
  });

  it("updates the vacation when there is no overlap", async () => {
    await updateVacation(input);

    expect(vacationUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "vacation-1" } }),
    );
    expect(revalidatePath).toHaveBeenCalledWith("/panel/vacation");
  });

  it("excludes the vacation itself from the overlap check", async () => {
    await updateVacation(input);

    expect(vacationFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: { not: "vacation-1" } }),
      }),
    );
  });

  it("rejects an edit that now overlaps another of the doctor's vacations", async () => {
    vacationFindMany.mockResolvedValue([
      {
        id: "vacation-other",
        locationId: "loc-1",
        startDate: new Date("2026-07-21T00:00:00.000Z"),
        endDate: new Date("2026-07-25T00:00:00.000Z"),
        location: { name: "Consultorio San Miguel" },
      },
    ]);

    await expect(updateVacation(input)).rejects.toThrow(
      "Ya tienes vacaciones registradas en Consultorio San Miguel que se cruzan con este periodo.",
    );
    expect(vacationUpdate).not.toHaveBeenCalled();
  });

  it("rejects a vacation belonging to a different doctor", async () => {
    vacationFindUnique.mockResolvedValue({ ...vacation, doctorId: "other" });

    await expect(updateVacation(input)).rejects.toThrow("Not authorized");
    expect(vacationUpdate).not.toHaveBeenCalled();
  });

  it("rejects editing a vacation that has already started", async () => {
    vacationFindUnique.mockResolvedValue({
      ...vacation,
      startDate: new Date("2026-06-01T00:00:00.000Z"),
    });

    await expect(updateVacation(input)).rejects.toThrow(
      "Vacation period has already started",
    );
    expect(vacationUpdate).not.toHaveBeenCalled();
  });
});

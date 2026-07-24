import { describe, expect, it, vi, beforeEach } from "vitest";
import { createVacation } from "./createVacation";

const DOCTOR_ID = "doctor-1";

const revalidatePath = vi.fn();
const locationFindUnique = vi.fn();
const vacationFindMany = vi.fn();
const vacationCreate = vi.fn();

vi.mock("next/cache", () => ({
  revalidatePath: (...a: unknown[]) => revalidatePath(...a),
}));
vi.mock("@/lib/schedule/requireDoctorId", () => ({
  requireDoctorId: () => Promise.resolve(DOCTOR_ID),
}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    location: { findUnique: (...a: unknown[]) => locationFindUnique(...a) },
    vacation: {
      findMany: (...a: unknown[]) => vacationFindMany(...a),
      create: (...a: unknown[]) => vacationCreate(...a),
    },
  },
}));

const location = { id: "loc-1", doctorId: DOCTOR_ID };
const input = {
  locationId: "loc-1",
  startDate: "2026-07-10",
  endDate: "2026-07-20",
};

describe("createVacation", () => {
  beforeEach(() => {
    revalidatePath.mockReset();
    locationFindUnique.mockReset();
    vacationFindMany.mockReset();
    vacationCreate.mockReset();
    locationFindUnique.mockResolvedValue(location);
    vacationFindMany.mockResolvedValue([]);
  });

  it("creates the vacation when there is no overlap", async () => {
    await createVacation(input);

    expect(vacationCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ locationId: "loc-1" }),
      }),
    );
    expect(revalidatePath).toHaveBeenCalledWith("/panel/vacation");
  });

  it("rejects a period that overlaps an existing one at the same location", async () => {
    vacationFindMany.mockResolvedValue([
      {
        id: "vacation-other",
        locationId: "loc-1",
        startDate: new Date("2026-07-15T00:00:00.000Z"),
        endDate: new Date("2026-07-25T00:00:00.000Z"),
        location: { name: "Consultorio San Miguel" },
      },
    ]);

    await expect(createVacation(input)).rejects.toThrow(
      "Ya tienes vacaciones registradas en Consultorio San Miguel que se cruzan con este periodo.",
    );
    expect(vacationCreate).not.toHaveBeenCalled();
  });

  it("rejects a period that overlaps an existing all-locations period", async () => {
    vacationFindMany.mockResolvedValue([
      {
        id: "vacation-other",
        locationId: null,
        startDate: new Date("2026-07-15T00:00:00.000Z"),
        endDate: new Date("2026-07-25T00:00:00.000Z"),
        location: null,
      },
    ]);

    await expect(createVacation(input)).rejects.toThrow(
      "Ya tienes vacaciones registradas en todas las ubicaciones que se cruzan con este periodo.",
    );
    expect(vacationCreate).not.toHaveBeenCalled();
  });

  it("rejects an all-locations period that overlaps an existing specific-location period", async () => {
    vacationFindMany.mockResolvedValue([
      {
        id: "vacation-other",
        locationId: "loc-2",
        startDate: new Date("2026-07-15T00:00:00.000Z"),
        endDate: new Date("2026-07-25T00:00:00.000Z"),
        location: { name: "Clínica del Corazón" },
      },
    ]);

    await expect(
      createVacation({ ...input, locationId: null }),
    ).rejects.toThrow(
      "Ya tienes vacaciones registradas en Clínica del Corazón que se cruzan con este periodo.",
    );
    expect(vacationCreate).not.toHaveBeenCalled();
  });

  it("rejects a location belonging to a different doctor", async () => {
    locationFindUnique.mockResolvedValue({ ...location, doctorId: "other" });

    await expect(createVacation(input)).rejects.toThrow("Not authorized");
    expect(vacationCreate).not.toHaveBeenCalled();
  });
});

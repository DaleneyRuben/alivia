import { describe, expect, it, vi, beforeEach } from "vitest";
import { getHistoryPatients } from "./getHistoryPatients";

const patientFindMany = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: { patient: { findMany: (...a: unknown[]) => patientFindMany(...a) } },
}));

describe("getHistoryPatients", () => {
  beforeEach(() => {
    patientFindMany.mockReset();
  });

  it("scopes the query to the given doctor — Medical History is siloed per Doctor-Patient pair", async () => {
    patientFindMany.mockResolvedValue([]);

    await getHistoryPatients("doctor-1");

    expect(patientFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { doctorId: "doctor-1" } }),
    );
  });
});

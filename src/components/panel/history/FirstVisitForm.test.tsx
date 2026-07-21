import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { refreshMock, saveFirstVisitMock } = vi.hoisted(() => ({
  refreshMock: vi.fn(),
  saveFirstVisitMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));

vi.mock("@/lib/history/saveFirstVisit", () => ({
  saveFirstVisit: saveFirstVisitMock,
}));

import { FirstVisitForm } from "./FirstVisitForm";

describe("FirstVisitForm", () => {
  beforeEach(() => {
    refreshMock.mockClear();
    saveFirstVisitMock.mockClear();
    saveFirstVisitMock.mockResolvedValue(undefined);
  });

  it("disables submit until diagnosis and treatment are filled", async () => {
    const user = userEvent.setup();
    render(<FirstVisitForm patientId="p1" />);

    const submit = screen.getByRole("button", {
      name: "Guardar historia clínica",
    });
    expect(submit).toBeDisabled();

    await user.type(screen.getByLabelText("Diagnóstico"), "Migraña tensional");
    expect(submit).toBeDisabled();

    await user.type(screen.getByLabelText("Tratamiento"), "Reposo");
    expect(submit).toBeEnabled();
  });

  it("submits the combined profile and first entry", async () => {
    const user = userEvent.setup();
    render(<FirstVisitForm patientId="p1" />);

    await user.type(screen.getByLabelText("Tipo de sangre"), "O+");
    await user.type(screen.getByLabelText("Diagnóstico"), "Migraña");
    await user.type(screen.getByLabelText("Tratamiento"), "Reposo");
    await user.click(
      screen.getByRole("button", { name: "Guardar historia clínica" }),
    );

    expect(saveFirstVisitMock).toHaveBeenCalledWith({
      patientId: "p1",
      dateOfBirth: null,
      bloodType: "O+",
      allergiesAndHistory: "",
      diagnosis: "Migraña",
      treatment: "Reposo",
    });
    expect(refreshMock).toHaveBeenCalled();
  });
});

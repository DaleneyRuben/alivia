import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { refreshMock, addDiagnosisEntryMock, updateDiagnosisEntryMock } =
  vi.hoisted(() => ({
    refreshMock: vi.fn(),
    addDiagnosisEntryMock: vi.fn(),
    updateDiagnosisEntryMock: vi.fn(),
  }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));

vi.mock("@/lib/history/addDiagnosisEntry", () => ({
  addDiagnosisEntry: addDiagnosisEntryMock,
}));
vi.mock("@/lib/history/updateDiagnosisEntry", () => ({
  updateDiagnosisEntry: updateDiagnosisEntryMock,
}));

import { DiagnosisTimeline } from "./DiagnosisTimeline";

const entries = [
  {
    id: "e1",
    date: "2026-01-10",
    diagnosis: "Primera consulta — control general",
    treatment: "Examen general normal.",
  },
];

describe("DiagnosisTimeline", () => {
  beforeEach(() => {
    refreshMock.mockClear();
    addDiagnosisEntryMock.mockClear();
    updateDiagnosisEntryMock.mockClear();
    addDiagnosisEntryMock.mockResolvedValue(undefined);
    updateDiagnosisEntryMock.mockResolvedValue(undefined);
  });

  it("renders entries reverse-chronologically as given, with no delete affordance", () => {
    render(<DiagnosisTimeline patientId="p1" entries={entries} />);
    expect(
      screen.getByText("Primera consulta — control general"),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /eliminar/i }),
    ).not.toBeInTheDocument();
  });

  it("appends a new entry via + Nueva nota", async () => {
    const user = userEvent.setup();
    render(<DiagnosisTimeline patientId="p1" entries={entries} />);

    await user.click(screen.getByRole("button", { name: "+ Nueva nota" }));
    await user.type(screen.getByLabelText("Diagnóstico"), "Seguimiento");
    await user.type(screen.getByLabelText("Tratamiento"), "Continuar plan");
    await user.click(screen.getByRole("button", { name: "Guardar nota" }));

    expect(addDiagnosisEntryMock).toHaveBeenCalledWith({
      patientId: "p1",
      diagnosis: "Seguimiento",
      treatment: "Continuar plan",
    });
    expect(refreshMock).toHaveBeenCalled();
  });

  it("edits an existing entry rather than deleting it", async () => {
    const user = userEvent.setup();
    render(<DiagnosisTimeline patientId="p1" entries={entries} />);

    await user.click(screen.getByRole("button", { name: "Editar" }));
    const diagnosisInput = screen.getByLabelText("Diagnóstico");
    await user.clear(diagnosisInput);
    await user.type(diagnosisInput, "Diagnóstico corregido");
    await user.click(screen.getByRole("button", { name: "Guardar nota" }));

    expect(updateDiagnosisEntryMock).toHaveBeenCalledWith({
      entryId: "e1",
      diagnosis: "Diagnóstico corregido",
      treatment: "Examen general normal.",
    });
    expect(refreshMock).toHaveBeenCalled();
  });

  it("shows an error and keeps the form open when the patient has no Attended appointment yet", async () => {
    addDiagnosisEntryMock.mockRejectedValue(
      new Error("Patient has no Attended appointment yet"),
    );
    const user = userEvent.setup();
    render(<DiagnosisTimeline patientId="p1" entries={entries} />);

    await user.click(screen.getByRole("button", { name: "+ Nueva nota" }));
    await user.type(screen.getByLabelText("Diagnóstico"), "Seguimiento");
    await user.type(screen.getByLabelText("Tratamiento"), "Continuar plan");
    await user.click(screen.getByRole("button", { name: "Guardar nota" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "todavía no tiene una cita atendida",
    );
    expect(refreshMock).not.toHaveBeenCalled();
  });
});

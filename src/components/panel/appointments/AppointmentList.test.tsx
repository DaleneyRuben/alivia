import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppointmentList } from "./AppointmentList";

const appointments = [
  {
    id: "a1",
    startMinutes: 540,
    patientName: "Juana Pérez",
    patientPhone: "+591 71234567",
    status: "SCHEDULED" as const,
    source: "PATIENT" as const,
  },
  {
    id: "a2",
    startMinutes: 600,
    patientName: "Mario Soto",
    patientPhone: "+591 76543210",
    status: "SCHEDULED" as const,
    source: "STAFF" as const,
  },
  {
    id: "a3",
    startMinutes: 660,
    patientName: "Ana Vargas",
    patientPhone: "+591 79988776",
    status: "ATTENDED" as const,
    source: "PATIENT" as const,
  },
];

describe("AppointmentList", () => {
  it("shows an empty state when there are no appointments", () => {
    render(
      <AppointmentList
        appointments={[]}
        onAttend={vi.fn()}
        onNoShow={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(
      screen.getByText("No hay citas para este día y ubicación."),
    ).toBeInTheDocument();
  });

  it("renders each row with formatted time and patient info", () => {
    render(
      <AppointmentList
        appointments={appointments}
        onAttend={vi.fn()}
        onNoShow={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByText("09:00")).toBeInTheDocument();
    expect(screen.getByText("Juana Pérez")).toBeInTheDocument();
    expect(screen.getByText("+591 76543210")).toBeInTheDocument();
  });

  it("tags the first pending row as Siguiente, not Walk-in", () => {
    render(
      <AppointmentList
        appointments={appointments}
        onAttend={vi.fn()}
        onNoShow={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByText("Siguiente")).toBeInTheDocument();
  });

  it("tags a later staff-entered pending row as Walk-in", () => {
    render(
      <AppointmentList
        appointments={appointments}
        onAttend={vi.fn()}
        onNoShow={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByText("Walk-in")).toBeInTheDocument();
  });

  it("shows pending actions only for scheduled rows", async () => {
    const user = userEvent.setup();
    const onAttend = vi.fn();
    render(
      <AppointmentList
        appointments={appointments}
        onAttend={onAttend}
        onNoShow={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    const attendButtons = screen.getAllByRole("button", { name: "Asistió" });
    expect(attendButtons).toHaveLength(2);

    await user.click(attendButtons[0]);
    expect(onAttend).toHaveBeenCalledWith("a1");
  });

  it("shows a status pill instead of actions for a decided row", () => {
    render(
      <AppointmentList
        appointments={appointments}
        onAttend={vi.fn()}
        onNoShow={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Asistió", { selector: "span" }),
    ).toBeInTheDocument();
  });
});

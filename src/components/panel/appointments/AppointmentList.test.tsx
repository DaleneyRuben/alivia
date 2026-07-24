import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppointmentList } from "./AppointmentList";

// 16:00 La Paz on 2026-07-20 — after every SCHEDULED fixture's startMinutes below
const NOW = new Date("2026-07-20T20:00:00.000Z");

const appointments = [
  {
    id: "a1",
    date: "2026-07-20",
    startMinutes: 540,
    patientName: "Juana Pérez",
    patientPhone: "+591 71234567",
    status: "SCHEDULED" as const,
    source: "PATIENT" as const,
  },
  {
    id: "a2",
    date: "2026-07-20",
    startMinutes: 600,
    patientName: "Mario Soto",
    patientPhone: "+591 76543210",
    status: "SCHEDULED" as const,
    source: "STAFF" as const,
  },
  {
    id: "a3",
    date: "2026-07-20",
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
        now={NOW}
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
        now={NOW}
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
        now={NOW}
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
        now={NOW}
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
        now={NOW}
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
        now={NOW}
      />,
    );

    expect(
      screen.getByText("Asistió", { selector: "span" }),
    ).toBeInTheDocument();
  });

  it("hides Asistió/No asistió for an appointment whose time hasn't passed yet", () => {
    render(
      <AppointmentList
        appointments={[
          {
            id: "future",
            date: "2026-07-21",
            startMinutes: 540,
            patientName: "Pedro Gómez",
            patientPhone: "+591 70011223",
            status: "SCHEDULED" as const,
            source: "PATIENT" as const,
          },
        ]}
        onAttend={vi.fn()}
        onNoShow={vi.fn()}
        onCancel={vi.fn()}
        now={NOW}
      />,
    );

    expect(
      screen.queryByRole("button", { name: "Asistió" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "No asistió" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Cancelar" }),
    ).toBeInTheDocument();
  });

  it("shows Asistió/No asistió once the appointment's time has passed", () => {
    render(
      <AppointmentList
        appointments={[
          {
            id: "past",
            date: "2026-07-20",
            startMinutes: 540,
            patientName: "Pedro Gómez",
            patientPhone: "+591 70011223",
            status: "SCHEDULED" as const,
            source: "PATIENT" as const,
          },
        ]}
        onAttend={vi.fn()}
        onNoShow={vi.fn()}
        onCancel={vi.fn()}
        now={NOW}
      />,
    );

    expect(screen.getByRole("button", { name: "Asistió" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "No asistió" }),
    ).toBeInTheDocument();
  });
});

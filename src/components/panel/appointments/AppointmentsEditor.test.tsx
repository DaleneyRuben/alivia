import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppointmentsEditor } from "./AppointmentsEditor";

const { refresh, createManualAppointment, updateAppointmentStatus } =
  vi.hoisted(() => ({
    refresh: vi.fn(),
    createManualAppointment: vi.fn().mockResolvedValue(undefined),
    updateAppointmentStatus: vi.fn().mockResolvedValue(undefined),
  }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh }),
}));
vi.mock("@/lib/appointments/createManualAppointment", () => ({
  createManualAppointment,
}));
vi.mock("@/lib/appointments/updateAppointmentStatus", () => ({
  updateAppointmentStatus,
}));

const locations = [
  { id: "loc-1", name: "Consultorio Zabala" },
  { id: "loc-2", name: "Clínica Sur" },
];

const appointments = [
  {
    id: "a1",
    locationId: "loc-1",
    date: "2026-07-20",
    startMinutes: 540,
    endMinutes: 600,
    status: "SCHEDULED" as const,
    source: "PATIENT" as const,
    patientName: "Juana Pérez",
    patientPhone: "+591 71234567",
  },
  {
    id: "a2",
    locationId: "loc-2",
    date: "2026-07-20",
    startMinutes: 570,
    endMinutes: 630,
    status: "SCHEDULED" as const,
    source: "PATIENT" as const,
    patientName: "Mario Soto",
    patientPhone: "+591 76543210",
  },
  {
    id: "a3",
    locationId: "loc-1",
    date: "2026-07-21",
    startMinutes: 540,
    endMinutes: 600,
    status: "SCHEDULED" as const,
    source: "PATIENT" as const,
    patientName: "Ana Vargas",
    patientPhone: "+591 79988776",
  },
];

const slots = [
  {
    locationId: "loc-1",
    date: "2026-07-20",
    startMinutes: 930,
    endMinutes: 960,
    availableToPatients: true,
  },
];

function renderEditor() {
  return render(
    <AppointmentsEditor
      locations={locations}
      today="2026-07-20"
      tomorrow="2026-07-21"
      appointments={appointments}
      slots={slots}
    />,
  );
}

describe("AppointmentsEditor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows today's queue for the first location by default", () => {
    renderEditor();

    expect(screen.getByText("Juana Pérez")).toBeInTheDocument();
    expect(screen.queryByText("Mario Soto")).not.toBeInTheDocument();
    expect(screen.queryByText("Ana Vargas")).not.toBeInTheDocument();
  });

  it("filters by location", async () => {
    const user = userEvent.setup();
    renderEditor();

    await user.click(screen.getByRole("button", { name: "Clínica Sur" }));

    expect(screen.getByText("Mario Soto")).toBeInTheDocument();
    expect(screen.queryByText("Juana Pérez")).not.toBeInTheDocument();
  });

  it("filters by day", async () => {
    const user = userEvent.setup();
    renderEditor();

    await user.click(screen.getByRole("button", { name: "Mañana" }));

    expect(screen.getByText("Ana Vargas")).toBeInTheDocument();
    expect(screen.queryByText("Juana Pérez")).not.toBeInTheDocument();
  });

  it("marks an appointment attended and refreshes", async () => {
    const user = userEvent.setup();
    renderEditor();

    await user.click(screen.getByRole("button", { name: "Asistió" }));

    expect(updateAppointmentStatus).toHaveBeenCalledWith("a1", "ATTENDED");
    expect(refresh).toHaveBeenCalled();
  });

  it("creates a manual appointment for the active day and location", async () => {
    const user = userEvent.setup();
    renderEditor();

    await user.click(screen.getByRole("button", { name: "+ Agregar cita" }));
    await user.type(
      screen.getByPlaceholderText("Nombre del paciente"),
      "Pedro Gómez",
    );
    await user.type(screen.getByPlaceholderText("7XX XXX XX"), "71112222");
    await user.click(screen.getByRole("button", { name: "15:30" }));
    await user.click(screen.getByRole("button", { name: "Agregar a la cola" }));

    expect(createManualAppointment).toHaveBeenCalledWith({
      patientName: "Pedro Gómez",
      patientPhone: "+59171112222",
      locationId: "loc-1",
      date: "2026-07-20",
      startMinutes: 930,
      endMinutes: 960,
    });
    expect(refresh).toHaveBeenCalled();
  });
});

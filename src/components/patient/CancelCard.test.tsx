import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CancelCard } from "./CancelCard";

const { cancelGuestAppointment } = vi.hoisted(() => ({
  cancelGuestAppointment: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/patients/cancelGuestAppointment", () => ({
  cancelGuestAppointment,
}));

const appointment = {
  id: "appt-1",
  cancelToken: "token-123",
  status: "SCHEDULED" as const,
  date: "2026-07-23",
  startMinutes: 930,
  endMinutes: 960,
  doctorName: "Dra. Carla Mendoza",
  specialty: "Cardiología",
  locationName: "Centro Médico Miraflores",
  patientName: "María Quispe",
  patientPhone: "71234567",
};

describe("CancelCard", () => {
  it("asks for confirmation before cancelling", () => {
    render(<CancelCard appointment={appointment} />);
    expect(screen.getByText("¿Cancelar tu cita?")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sí, cancelar cita" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Mantener mi cita" }),
    ).toHaveAttribute("href", "/confirmation/token-123");
  });

  it("cancels the appointment and shows the cancelled state", async () => {
    const user = userEvent.setup();
    render(<CancelCard appointment={appointment} />);

    await user.click(screen.getByRole("button", { name: "Sí, cancelar cita" }));

    expect(cancelGuestAppointment).toHaveBeenCalledWith("token-123");
    expect(
      await screen.findByText("Tu cita fue cancelada"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Buscar otro horario" }),
    ).toHaveAttribute("href", "/");
  });

  it("starts in the cancelled state when the appointment is already cancelled", () => {
    render(
      <CancelCard appointment={{ ...appointment, status: "CANCELLED" }} />,
    );
    expect(screen.getByText("Tu cita fue cancelada")).toBeInTheDocument();
  });
});

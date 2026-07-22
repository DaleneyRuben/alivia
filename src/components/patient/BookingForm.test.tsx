import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookingForm } from "./BookingForm";

const { createGuestAppointment } = vi.hoisted(() => ({
  createGuestAppointment: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/patients/createGuestAppointment", () => ({
  createGuestAppointment,
}));

const summary = {
  doctorId: "doc-1",
  doctorName: "Dra. Carla Mendoza",
  locationId: "loc-1",
  locationName: "Centro Médico Miraflores",
  date: "2026-07-21",
  startMinutes: 930,
  endMinutes: 960,
  isAvailable: true,
};

describe("BookingForm", () => {
  it("renders the summary card", () => {
    render(<BookingForm summary={summary} />);
    expect(screen.getByText("Dra. Carla Mendoza")).toBeInTheDocument();
    expect(screen.getByText("Centro Médico Miraflores")).toBeInTheDocument();
  });

  it("disables submit until name and phone are valid", async () => {
    const user = userEvent.setup();
    render(<BookingForm summary={summary} />);

    expect(
      screen.getByRole("button", { name: "Confirmar reserva" }),
    ).toBeDisabled();

    await user.type(screen.getByLabelText("Nombre completo"), "María Quispe");
    await user.type(
      screen.getByLabelText("Número de teléfono (WhatsApp)"),
      "71234567",
    );

    expect(
      screen.getByRole("button", { name: "Confirmar reserva" }),
    ).toBeEnabled();
  });

  it("submits the guest booking with trimmed name and phone", async () => {
    const user = userEvent.setup();
    render(<BookingForm summary={summary} />);

    await user.type(screen.getByLabelText("Nombre completo"), "María Quispe");
    await user.type(
      screen.getByLabelText("Número de teléfono (WhatsApp)"),
      "71234567",
    );
    await user.click(screen.getByRole("button", { name: "Confirmar reserva" }));

    expect(createGuestAppointment).toHaveBeenCalledWith({
      doctorId: "doc-1",
      locationId: "loc-1",
      date: "2026-07-21",
      startMinutes: 930,
      name: "María Quispe",
      phone: "+59171234567",
    });
  });

  it("has no reassurance copy or placeholder text", () => {
    render(<BookingForm summary={summary} />);
    expect(
      screen.queryByText(
        "Sin cuenta ni contraseña. Podrás cancelar cuando quieras.",
      ),
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText("Nombre completo")).not.toHaveAttribute(
      "placeholder",
    );
    expect(
      screen.getByLabelText("Número de teléfono (WhatsApp)"),
    ).not.toHaveAttribute("placeholder");
  });

  it("shows an unavailable message instead of the form when the slot is gone", () => {
    render(<BookingForm summary={{ ...summary, isAvailable: false }} />);
    expect(
      screen.getByText("Este horario ya no está disponible."),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("Nombre completo")).not.toBeInTheDocument();
  });
});

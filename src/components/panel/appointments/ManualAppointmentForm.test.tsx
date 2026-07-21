import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ManualAppointmentForm } from "./ManualAppointmentForm";

const slots = [
  { startMinutes: 930, endMinutes: 960, full: false },
  { startMinutes: 960, endMinutes: 990, full: true },
];

describe("ManualAppointmentForm", () => {
  it("disables submit until name, phone, and a slot are chosen", async () => {
    const user = userEvent.setup();
    render(
      <ManualAppointmentForm
        locationId="loc-1"
        date="2026-07-20"
        slots={slots}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    const submit = screen.getByRole("button", { name: "Agregar a la cola" });
    expect(submit).toBeDisabled();

    await user.type(
      screen.getByPlaceholderText("Nombre del paciente"),
      "Juana Pérez",
    );
    await user.type(screen.getByPlaceholderText("+591 7XX XXX XX"), "71234567");
    expect(submit).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "15:30" }));
    expect(submit).toBeEnabled();
  });

  it("shows an over-capacity notice only when the chosen slot is full", async () => {
    const user = userEvent.setup();
    render(
      <ManualAppointmentForm
        locationId="loc-1"
        date="2026-07-20"
        slots={slots}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(
      screen.queryByText(/ya alcanzó su capacidad/),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "16:00 · lleno" }));
    expect(screen.getByText(/ya alcanzó su capacidad/)).toBeInTheDocument();
  });

  it("submits the composed manual appointment input", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <ManualAppointmentForm
        locationId="loc-1"
        date="2026-07-20"
        slots={slots}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    );

    await user.type(
      screen.getByPlaceholderText("Nombre del paciente"),
      "Juana Pérez",
    );
    await user.type(screen.getByPlaceholderText("+591 7XX XXX XX"), "71234567");
    await user.click(screen.getByRole("button", { name: "15:30" }));
    await user.click(screen.getByRole("button", { name: "Agregar a la cola" }));

    expect(onSubmit).toHaveBeenCalledWith({
      patientName: "Juana Pérez",
      patientPhone: "71234567",
      locationId: "loc-1",
      date: "2026-07-20",
      startMinutes: 930,
      endMinutes: 960,
    });
  });

  it("calls onCancel when the cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(
      <ManualAppointmentForm
        locationId="loc-1"
        date="2026-07-20"
        slots={slots}
        onSubmit={vi.fn()}
        onCancel={onCancel}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(onCancel).toHaveBeenCalled();
  });
});

import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ScheduleBlockForm } from "./ScheduleBlockForm";

describe("ScheduleBlockForm", () => {
  it("renders a toggle for each day of the week", () => {
    render(<ScheduleBlockForm onSubmit={vi.fn()} />);

    ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].forEach((label) => {
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
    });
  });

  it("disables submit until the block is valid", async () => {
    const user = userEvent.setup();
    render(<ScheduleBlockForm onSubmit={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: "Agregar bloque" }),
    ).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Lun" }));
    await user.type(screen.getByLabelText("Hora de inicio"), "09:00");
    await user.type(screen.getByLabelText("Hora de fin"), "12:00");
    await user.clear(screen.getByLabelText("Duración del turno (min)"));
    await user.type(screen.getByLabelText("Duración del turno (min)"), "30");
    await user.clear(screen.getByLabelText("Capacidad"));
    await user.type(screen.getByLabelText("Capacidad"), "3");

    expect(
      screen.getByRole("button", { name: "Agregar bloque" }),
    ).toBeEnabled();
  });

  it("submits the composed block input", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ScheduleBlockForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "Lun" }));
    await user.click(screen.getByRole("button", { name: "Mar" }));
    await user.type(screen.getByLabelText("Hora de inicio"), "09:00");
    await user.type(screen.getByLabelText("Hora de fin"), "12:00");
    await user.clear(screen.getByLabelText("Duración del turno (min)"));
    await user.type(screen.getByLabelText("Duración del turno (min)"), "30");
    await user.clear(screen.getByLabelText("Capacidad"));
    await user.type(screen.getByLabelText("Capacidad"), "3");
    await user.click(screen.getByRole("button", { name: "Agregar bloque" }));

    expect(onSubmit).toHaveBeenCalledWith({
      weekdays: [1, 2],
      startMinutes: 9 * 60,
      endMinutes: 12 * 60,
      slotDurationMinutes: 30,
      slotCapacity: 3,
    });
  });

  it("pre-fills fields and shows a save label when editing", () => {
    render(
      <ScheduleBlockForm
        onSubmit={vi.fn()}
        initialValue={{
          weekdays: [1, 2, 3, 4, 5],
          startMinutes: 9 * 60,
          endMinutes: 12 * 60,
          slotDurationMinutes: 60,
          slotCapacity: 3,
        }}
      />,
    );

    expect(screen.getByRole("button", { name: "Lun" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByLabelText("Hora de inicio")).toHaveValue("09:00");
    expect(
      screen.getByRole("button", { name: "Guardar cambios" }),
    ).toBeInTheDocument();
  });

  it("calls onCancel when the cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<ScheduleBlockForm onSubmit={vi.fn()} onCancel={onCancel} />);

    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(onCancel).toHaveBeenCalled();
  });

  it("shows the error message when one is passed", () => {
    render(
      <ScheduleBlockForm
        onSubmit={vi.fn()}
        error="Ya tienes un horario en Consultorio San Miguel que se cruza con este bloque."
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Ya tienes un horario en Consultorio San Miguel que se cruza con este bloque.",
    );
  });

  it("renders no error banner when error is absent", () => {
    render(<ScheduleBlockForm onSubmit={vi.fn()} />);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});

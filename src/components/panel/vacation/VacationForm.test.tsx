import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VacationForm } from "./VacationForm";

const locations = [
  { id: "loc-1", name: "Consultorio Zabala" },
  { id: "loc-2", name: "Clínica Sur" },
];

describe("VacationForm", () => {
  it("defaults the location to all locations", () => {
    render(<VacationForm locations={locations} onSubmit={vi.fn()} />);

    expect(
      screen.getByRole("option", { name: "Todas las ubicaciones" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Consultorio Zabala" }),
    ).toBeInTheDocument();
  });

  it("disables Agregar until both dates are filled", async () => {
    const user = userEvent.setup();
    render(<VacationForm locations={locations} onSubmit={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Agregar" })).toBeDisabled();

    await user.type(screen.getByLabelText("Desde"), "2026-07-15");
    expect(screen.getByRole("button", { name: "Agregar" })).toBeDisabled();

    await user.type(screen.getByLabelText("Hasta"), "2026-07-22");
    expect(screen.getByRole("button", { name: "Agregar" })).not.toBeDisabled();
  });

  it("submits with locationId null for the whole practice", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<VacationForm locations={locations} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Desde"), "2026-07-15");
    await user.type(screen.getByLabelText("Hasta"), "2026-07-22");
    await user.click(screen.getByRole("button", { name: "Agregar" }));

    expect(onSubmit).toHaveBeenCalledWith({
      locationId: null,
      startDate: "2026-07-15",
      endDate: "2026-07-22",
    });
  });

  it("submits with the selected Location id when one is chosen", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<VacationForm locations={locations} onSubmit={onSubmit} />);

    await user.selectOptions(screen.getByLabelText("Ubicación"), "loc-2");
    await user.type(screen.getByLabelText("Desde"), "2026-07-15");
    await user.type(screen.getByLabelText("Hasta"), "2026-07-22");
    await user.click(screen.getByRole("button", { name: "Agregar" }));

    expect(onSubmit).toHaveBeenCalledWith({
      locationId: "loc-2",
      startDate: "2026-07-15",
      endDate: "2026-07-22",
    });
  });

  it("clears the date fields after a successful submit", async () => {
    const user = userEvent.setup();
    render(<VacationForm locations={locations} onSubmit={vi.fn()} />);

    await user.type(screen.getByLabelText("Desde"), "2026-07-15");
    await user.type(screen.getByLabelText("Hasta"), "2026-07-22");
    await user.click(screen.getByRole("button", { name: "Agregar" }));

    expect(screen.getByLabelText("Desde")).toHaveValue("");
    expect(screen.getByLabelText("Hasta")).toHaveValue("");
  });
});

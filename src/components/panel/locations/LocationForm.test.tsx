import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LocationForm } from "./LocationForm";

describe("LocationForm", () => {
  it("disables submit until name and address are filled", async () => {
    const user = userEvent.setup();
    render(<LocationForm onSubmit={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: "Agregar ubicación" }),
    ).toBeDisabled();

    await user.type(screen.getByLabelText("Nombre"), "Clínica Los Andes");
    await user.type(
      screen.getByLabelText("Dirección"),
      "Av. 6 de Agosto, Sopocachi",
    );

    expect(
      screen.getByRole("button", { name: "Agregar ubicación" }),
    ).toBeEnabled();
  });

  it("submits the composed location input", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<LocationForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Nombre"), "Clínica Los Andes");
    await user.type(
      screen.getByLabelText("Dirección"),
      "Av. 6 de Agosto, Sopocachi",
    );
    await user.click(screen.getByRole("button", { name: "Agregar ubicación" }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: "Clínica Los Andes",
      address: "Av. 6 de Agosto, Sopocachi",
    });
  });

  it("pre-fills fields and shows a save label when editing", () => {
    render(
      <LocationForm
        onSubmit={vi.fn()}
        initialValue={{ name: "Clínica Los Andes", address: "Av. 6 de Agosto" }}
      />,
    );

    expect(screen.getByLabelText("Nombre")).toHaveValue("Clínica Los Andes");
    expect(
      screen.getByRole("button", { name: "Guardar cambios" }),
    ).toBeInTheDocument();
  });

  it("calls onCancel when the cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<LocationForm onSubmit={vi.fn()} onCancel={onCancel} />);

    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(onCancel).toHaveBeenCalled();
  });
});

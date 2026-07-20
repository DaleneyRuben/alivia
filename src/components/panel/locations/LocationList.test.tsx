import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LocationList } from "./LocationList";

const locations = [
  {
    id: "loc-1",
    name: "Clínica Los Andes",
    address: "Av. 6 de Agosto, Sopocachi",
    scheduleBlockCount: 2,
  },
  {
    id: "loc-2",
    name: "Consultorio Miraflores",
    address: "Calle Fernando Guachalla",
    scheduleBlockCount: 0,
  },
];

describe("LocationList", () => {
  it("renders a card per location with name, address and block count", () => {
    render(
      <LocationList
        locations={locations}
        onEdit={vi.fn()}
        onRemove={vi.fn()}
      />,
    );

    expect(screen.getByText("Clínica Los Andes")).toBeInTheDocument();
    expect(screen.getByText("Av. 6 de Agosto, Sopocachi")).toBeInTheDocument();
    expect(
      screen.getByText("2 bloques de horario activos"),
    ).toBeInTheDocument();
    expect(screen.getByText("Consultorio Miraflores")).toBeInTheDocument();
  });

  it("shows an empty state when there are no locations", () => {
    render(<LocationList locations={[]} onEdit={vi.fn()} onRemove={vi.fn()} />);

    expect(
      screen.getByText(/No hay ubicaciones registradas/),
    ).toBeInTheDocument();
  });

  it("calls onEdit with the location when Editar is clicked", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(
      <LocationList locations={locations} onEdit={onEdit} onRemove={vi.fn()} />,
    );

    await user.click(screen.getAllByRole("button", { name: "Editar" })[0]);

    expect(onEdit).toHaveBeenCalledWith(locations[0]);
  });

  it("removes immediately when the location has no schedule blocks", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(
      <LocationList
        locations={locations}
        onEdit={vi.fn()}
        onRemove={onRemove}
      />,
    );

    await user.click(screen.getAllByRole("button", { name: "Quitar" })[1]);

    expect(onRemove).toHaveBeenCalledWith("loc-2");
  });

  it("warns before removing a location that has schedule blocks", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(
      <LocationList
        locations={locations}
        onEdit={vi.fn()}
        onRemove={onRemove}
      />,
    );

    await user.click(screen.getAllByRole("button", { name: "Quitar" })[0]);

    expect(onRemove).not.toHaveBeenCalled();
    expect(
      screen.getByText(/sus bloques de horario se eliminarán/i),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Confirmar" }));

    expect(onRemove).toHaveBeenCalledWith("loc-1");
  });

  it("cancels the warning without removing", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(
      <LocationList
        locations={locations}
        onEdit={vi.fn()}
        onRemove={onRemove}
      />,
    );

    await user.click(screen.getAllByRole("button", { name: "Quitar" })[0]);
    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(onRemove).not.toHaveBeenCalled();
    expect(
      screen.queryByText(/sus bloques de horario se eliminarán/i),
    ).not.toBeInTheDocument();
  });
});

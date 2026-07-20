import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LocationEditor } from "./LocationEditor";

const { refresh, createLocation, updateLocation, deleteLocation } = vi.hoisted(
  () => ({
    refresh: vi.fn(),
    createLocation: vi.fn().mockResolvedValue(undefined),
    updateLocation: vi.fn().mockResolvedValue(undefined),
    deleteLocation: vi.fn().mockResolvedValue(undefined),
  }),
);

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh }),
}));
vi.mock("@/lib/locations/createLocation", () => ({ createLocation }));
vi.mock("@/lib/locations/updateLocation", () => ({ updateLocation }));
vi.mock("@/lib/locations/deleteLocation", () => ({ deleteLocation }));

const locations = [
  {
    id: "loc-1",
    name: "Consultorio Zabala",
    address: "Av. Arce 123",
    scheduleBlockCount: 2,
  },
  {
    id: "loc-2",
    name: "Clínica Sur",
    address: "Calle Landaeta 456",
    scheduleBlockCount: 0,
  },
];

describe("LocationEditor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the location list", () => {
    render(<LocationEditor locations={locations} />);

    expect(screen.getByText("Consultorio Zabala")).toBeInTheDocument();
    expect(screen.getByText("Clínica Sur")).toBeInTheDocument();
  });

  it("creates a location and refreshes", async () => {
    const user = userEvent.setup();
    render(<LocationEditor locations={locations} />);

    await user.click(screen.getByRole("button", { name: "+ Nueva ubicación" }));
    await user.type(screen.getByLabelText("Nombre"), "Clínica Norte");
    await user.type(screen.getByLabelText("Dirección"), "Av. Busch 789");
    await user.click(screen.getByRole("button", { name: "Agregar ubicación" }));

    expect(createLocation).toHaveBeenCalledWith({
      name: "Clínica Norte",
      address: "Av. Busch 789",
    });
    expect(refresh).toHaveBeenCalled();
  });

  it("updates an existing location when edited", async () => {
    const user = userEvent.setup();
    render(<LocationEditor locations={locations} />);

    await user.click(screen.getAllByRole("button", { name: "Editar" })[0]);
    await user.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect(updateLocation).toHaveBeenCalledWith({
      locationId: "loc-1",
      name: "Consultorio Zabala",
      address: "Av. Arce 123",
    });
    expect(refresh).toHaveBeenCalled();
  });

  it("removes a location without blocks immediately and refreshes", async () => {
    const user = userEvent.setup();
    render(<LocationEditor locations={locations} />);

    await user.click(screen.getAllByRole("button", { name: "Quitar" })[1]);

    expect(deleteLocation).toHaveBeenCalledWith("loc-2");
    expect(refresh).toHaveBeenCalled();
  });
});

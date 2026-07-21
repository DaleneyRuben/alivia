import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VacationEditor } from "./VacationEditor";

const { refresh, createVacation, deleteVacation } = vi.hoisted(() => ({
  refresh: vi.fn(),
  createVacation: vi.fn().mockResolvedValue(undefined),
  deleteVacation: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh }),
}));
vi.mock("@/lib/vacation/createVacation", () => ({ createVacation }));
vi.mock("@/lib/vacation/deleteVacation", () => ({ deleteVacation }));

const locations = [{ id: "loc-1", name: "Consultorio Zabala" }];

const vacations = [
  {
    id: "v1",
    locationId: null,
    locationName: null,
    startDate: "2026-07-25",
    endDate: "2026-07-28",
  },
];

function renderEditor() {
  return render(
    <VacationEditor
      today="2026-07-20"
      locations={locations}
      vacations={vacations}
    />,
  );
}

describe("VacationEditor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the title and existing vacations", () => {
    renderEditor();

    expect(
      screen.getByRole("heading", { name: "Vacaciones" }),
    ).toBeInTheDocument();
    expect(screen.getByText("25–28 jul 2026")).toBeInTheDocument();
  });

  it("adds a vacation and refreshes", async () => {
    const user = userEvent.setup();
    renderEditor();

    await user.type(screen.getByLabelText("Desde"), "2026-08-01");
    await user.type(screen.getByLabelText("Hasta"), "2026-08-05");
    await user.click(screen.getByRole("button", { name: "Agregar" }));

    expect(createVacation).toHaveBeenCalledWith({
      locationId: null,
      startDate: "2026-08-01",
      endDate: "2026-08-05",
    });
    expect(refresh).toHaveBeenCalled();
  });

  it("removes a vacation and refreshes", async () => {
    const user = userEvent.setup();
    renderEditor();

    await user.click(screen.getByRole("button", { name: "Quitar" }));

    expect(deleteVacation).toHaveBeenCalledWith("v1");
    expect(refresh).toHaveBeenCalled();
  });
});

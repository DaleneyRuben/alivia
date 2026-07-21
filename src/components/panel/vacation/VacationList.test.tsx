import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VacationList } from "./VacationList";

const vacations = [
  {
    id: "v1",
    locationId: null,
    locationName: null,
    startDate: "2026-07-25",
    endDate: "2026-07-28",
  },
  {
    id: "v2",
    locationId: "loc-1",
    locationName: "Consultorio Zabala",
    startDate: "2026-07-15",
    endDate: "2026-07-22",
  },
];

describe("VacationList", () => {
  it("shows an empty state when there are no vacations", () => {
    render(
      <VacationList vacations={[]} today="2026-07-20" onRemove={vi.fn()} />,
    );

    expect(screen.getByText("No hay vacaciones próximas.")).toBeInTheDocument();
  });

  it("renders the formatted range and whole-practice label", () => {
    render(
      <VacationList
        vacations={vacations}
        today="2026-07-20"
        onRemove={vi.fn()}
      />,
    );

    expect(screen.getByText("25–28 jul 2026")).toBeInTheDocument();
    expect(screen.getByText("Todas las ubicaciones")).toBeInTheDocument();
  });

  it("renders the Location name for a scoped period", () => {
    render(
      <VacationList
        vacations={vacations}
        today="2026-07-20"
        onRemove={vi.fn()}
      />,
    );

    expect(screen.getByText("Consultorio Zabala")).toBeInTheDocument();
  });

  it("allows removing an upcoming period", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(
      <VacationList
        vacations={vacations}
        today="2026-07-20"
        onRemove={onRemove}
      />,
    );

    await user.click(screen.getAllByRole("button", { name: "Quitar" })[0]);
    expect(onRemove).toHaveBeenCalledWith("v1");
  });

  it("hides the remove action once a period has already started", () => {
    render(
      <VacationList
        vacations={vacations}
        today="2026-07-20"
        onRemove={vi.fn()}
      />,
    );

    expect(screen.getAllByRole("button", { name: "Quitar" })).toHaveLength(1);
  });
});

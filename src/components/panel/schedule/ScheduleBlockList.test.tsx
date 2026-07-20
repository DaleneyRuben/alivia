import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ScheduleBlockList } from "./ScheduleBlockList";

const blocks = [
  {
    id: "block-1",
    weekdays: [1, 2, 3, 4, 5],
    startMinutes: 9 * 60,
    endMinutes: 12 * 60,
    slotDurationMinutes: 60,
    slotCapacity: 3,
  },
  {
    id: "block-2",
    weekdays: [1, 2, 3, 4, 5],
    startMinutes: 14 * 60,
    endMinutes: 18 * 60,
    slotDurationMinutes: 30,
    slotCapacity: 2,
  },
];

describe("ScheduleBlockList", () => {
  it("renders a card per block with days, time range, duration and capacity", () => {
    render(
      <ScheduleBlockList blocks={blocks} onEdit={vi.fn()} onRemove={vi.fn()} />,
    );

    expect(screen.getAllByText("Lun-Vie")).toHaveLength(2);
    expect(screen.getByText("09:00-12:00")).toBeInTheDocument();
    expect(screen.getByText("30 min")).toBeInTheDocument();
    expect(screen.getByText("Hasta 3 pacientes")).toBeInTheDocument();
  });

  it("shows an empty state when there are no blocks", () => {
    render(
      <ScheduleBlockList blocks={[]} onEdit={vi.fn()} onRemove={vi.fn()} />,
    );

    expect(screen.getByText(/No hay bloques de horario/)).toBeInTheDocument();
  });

  it("calls onEdit with the block when Editar is clicked", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(
      <ScheduleBlockList blocks={blocks} onEdit={onEdit} onRemove={vi.fn()} />,
    );

    await user.click(screen.getAllByRole("button", { name: "Editar" })[0]);

    expect(onEdit).toHaveBeenCalledWith(blocks[0]);
  });

  it("calls onRemove with the block id when Quitar is clicked", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(
      <ScheduleBlockList
        blocks={blocks}
        onEdit={vi.fn()}
        onRemove={onRemove}
      />,
    );

    await user.click(screen.getAllByRole("button", { name: "Quitar" })[1]);

    expect(onRemove).toHaveBeenCalledWith("block-2");
  });
});

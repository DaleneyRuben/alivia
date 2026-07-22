import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ScheduleEditor } from "./ScheduleEditor";

const {
  push,
  refresh,
  createScheduleBlock,
  updateScheduleBlock,
  deleteScheduleBlock,
} = vi.hoisted(() => ({
  push: vi.fn(),
  refresh: vi.fn(),
  createScheduleBlock: vi.fn().mockResolvedValue(undefined),
  updateScheduleBlock: vi.fn().mockResolvedValue(undefined),
  deleteScheduleBlock: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, refresh }),
}));
vi.mock("@/lib/schedule/createScheduleBlock", () => ({ createScheduleBlock }));
vi.mock("@/lib/schedule/updateScheduleBlock", () => ({ updateScheduleBlock }));
vi.mock("@/lib/schedule/deleteScheduleBlock", () => ({ deleteScheduleBlock }));

const locations = [
  {
    id: "loc-1",
    name: "Consultorio Zabala",
    scheduleBlocks: [
      {
        id: "block-1",
        weekdays: [1, 2, 3, 4, 5],
        startMinutes: 9 * 60,
        endMinutes: 12 * 60,
        slotDurationMinutes: 60,
        slotCapacity: 3,
      },
    ],
  },
  {
    id: "loc-2",
    name: "Clínica Sur",
    scheduleBlocks: [],
  },
];

async function fillForm(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: "Lun" }));
  await user.type(screen.getByLabelText("Hora de inicio"), "09:00");
  await user.type(screen.getByLabelText("Hora de fin"), "12:00");
  await user.clear(screen.getByLabelText("Duración del turno (min)"));
  await user.type(screen.getByLabelText("Duración del turno (min)"), "30");
  await user.clear(screen.getByLabelText("Capacidad"));
  await user.type(screen.getByLabelText("Capacidad"), "2");
}

describe("ScheduleEditor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows blocks for the initially active location", () => {
    render(<ScheduleEditor locations={locations} />);

    expect(screen.getByText("09:00-12:00")).toBeInTheDocument();
  });

  it("switches the visible blocks when a different location is selected", async () => {
    const user = userEvent.setup();
    render(<ScheduleEditor locations={locations} />);

    await user.click(screen.getByRole("button", { name: "Clínica Sur" }));

    expect(screen.queryByText("09:00-12:00")).not.toBeInTheDocument();
    expect(screen.getByText(/No hay bloques de horario/)).toBeInTheDocument();
  });

  it("creates a block in the active location and refreshes", async () => {
    const user = userEvent.setup();
    render(<ScheduleEditor locations={locations} />);

    await user.click(screen.getByRole("button", { name: "+ Agregar bloque" }));
    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Agregar bloque" }));

    expect(createScheduleBlock).toHaveBeenCalledWith({
      locationId: "loc-1",
      weekdays: [1],
      startMinutes: 9 * 60,
      endMinutes: 12 * 60,
      slotDurationMinutes: 30,
      slotCapacity: 2,
    });
    expect(refresh).toHaveBeenCalled();
  });

  it("updates an existing block when edited", async () => {
    const user = userEvent.setup();
    render(<ScheduleEditor locations={locations} />);

    await user.click(screen.getByRole("button", { name: "Editar" }));
    await user.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect(updateScheduleBlock).toHaveBeenCalledWith({
      blockId: "block-1",
      weekdays: [1, 2, 3, 4, 5],
      startMinutes: 9 * 60,
      endMinutes: 12 * 60,
      slotDurationMinutes: 60,
      slotCapacity: 3,
    });
    expect(refresh).toHaveBeenCalled();
  });

  it("removes a block and refreshes", async () => {
    const user = userEvent.setup();
    render(<ScheduleEditor locations={locations} />);

    await user.click(screen.getByRole("button", { name: "Quitar" }));

    expect(deleteScheduleBlock).toHaveBeenCalledWith("block-1");
    expect(refresh).toHaveBeenCalled();
  });

  it("shows the server's overlap error and keeps the form open", async () => {
    createScheduleBlock.mockRejectedValueOnce(
      new Error(
        "Ya tienes un horario en Clínica Sur que se cruza con este bloque.",
      ),
    );
    const user = userEvent.setup();
    render(<ScheduleEditor locations={locations} />);

    await user.click(screen.getByRole("button", { name: "+ Agregar bloque" }));
    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Agregar bloque" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Ya tienes un horario en Clínica Sur que se cruza con este bloque.",
    );
    expect(refresh).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: "Agregar bloque" }),
    ).toBeInTheDocument();
  });
});

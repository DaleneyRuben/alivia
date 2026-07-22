import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreatePracticeForm } from "./CreatePracticeForm";

const { createPractice } = vi.hoisted(() => ({
  createPractice: vi.fn(),
}));

vi.mock("@/lib/admin/createPractice", () => ({ createPractice }));

async function fillDoctorFields(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Nombre"), "Dra. Carla Mendoza");
  await user.type(screen.getByLabelText("Especialidad"), "Cardiología");
  await user.type(screen.getByLabelText("Correo"), "carla@consulta.bo");
  await user.type(screen.getByLabelText("Teléfono"), "71234567");
}

describe("CreatePracticeForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("disables the submit button until the doctor fields are complete", async () => {
    const user = userEvent.setup();
    render(<CreatePracticeForm />);

    expect(
      screen.getByRole("button", { name: "Crear cuentas" }),
    ).toBeDisabled();

    await fillDoctorFields(user);

    expect(
      screen.getByRole("button", { name: "Crear cuentas" }),
    ).not.toBeDisabled();
  });

  it("hides the assistant fields until the toggle is opened", () => {
    render(<CreatePracticeForm />);

    expect(screen.getAllByLabelText("Nombre")).toHaveLength(1);
  });

  it("submits the doctor-only input when no assistant is added", async () => {
    createPractice.mockResolvedValue([
      { name: "Dra. Carla Mendoza", role: "Doctor", link: "https://wa.me/1" },
    ]);
    const user = userEvent.setup();
    render(<CreatePracticeForm />);

    await fillDoctorFields(user);
    await user.click(screen.getByRole("button", { name: "Crear cuentas" }));

    expect(createPractice).toHaveBeenCalledWith({
      doctor: {
        name: "Dra. Carla Mendoza",
        specialty: "Cardiología",
        email: "carla@consulta.bo",
        phone: "+59171234567",
      },
      assistant: null,
    });
  });

  it("shows the setup links after a successful submission", async () => {
    createPractice.mockResolvedValue([
      { name: "Dra. Carla Mendoza", role: "Doctor", link: "https://wa.me/1" },
    ]);
    const user = userEvent.setup();
    render(<CreatePracticeForm />);

    await fillDoctorFields(user);
    await user.click(screen.getByRole("button", { name: "Crear cuentas" }));

    expect(await screen.findByText("Cuentas creadas")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "✆ Enviar por WhatsApp" }),
    ).toHaveAttribute("href", "https://wa.me/1");
  });

  it("includes the assistant fields when the toggle is opened and filled", async () => {
    createPractice.mockResolvedValue([]);
    const user = userEvent.setup();
    render(<CreatePracticeForm />);

    await fillDoctorFields(user);
    await user.click(screen.getByRole("button", { name: "+ Agregar" }));
    await user.type(screen.getAllByLabelText("Nombre")[1], "Andrea López");
    await user.type(
      screen.getAllByLabelText("Correo")[1],
      "andrea@consulta.bo",
    );
    await user.type(screen.getAllByLabelText("Teléfono")[1], "76543210");
    await user.click(screen.getByRole("button", { name: "Crear cuentas" }));

    expect(createPractice).toHaveBeenCalledWith({
      doctor: {
        name: "Dra. Carla Mendoza",
        specialty: "Cardiología",
        email: "carla@consulta.bo",
        phone: "+59171234567",
      },
      assistant: {
        name: "Andrea López",
        email: "andrea@consulta.bo",
        phone: "+59176543210",
      },
    });
  });
});

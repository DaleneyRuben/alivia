import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PracticeDetail } from "./PracticeDetail";
import type { PracticeDetail as PracticeDetailData } from "@/lib/admin/getPracticeDetail";

const { toggleAccountActive, resetAccountPassword, impersonateAccount } =
  vi.hoisted(() => ({
    toggleAccountActive: vi.fn(),
    resetAccountPassword: vi.fn(),
    impersonateAccount: vi.fn(),
  }));

vi.mock("@/lib/admin/toggleAccountActive", () => ({ toggleAccountActive }));
vi.mock("@/lib/admin/resetAccountPassword", () => ({ resetAccountPassword }));
vi.mock("@/lib/admin/impersonateAccount", () => ({ impersonateAccount }));

const practice: PracticeDetailData = {
  id: "doc-1",
  practiceLabel: "Cardio Miraflores",
  doctorName: "Dra. Carla Mendoza",
  specialty: "Cardiología",
  active: true,
  accounts: [
    {
      userId: "user-doctor",
      name: "Dra. Carla Mendoza",
      role: "Doctor",
      email: "carla@consulta.bo",
      active: true,
    },
    {
      userId: "user-assistant",
      name: "Andrea López",
      role: "Asistente",
      email: "andrea@consulta.bo",
      active: false,
    },
  ],
};

describe("PracticeDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders an account card per account with its role and status", () => {
    render(<PracticeDetail practice={practice} />);

    expect(screen.getByText("Dra. Carla Mendoza")).toBeInTheDocument();
    expect(screen.getByText("Doctor · carla@consulta.bo")).toBeInTheDocument();
    expect(
      screen.getByText("Asistente · andrea@consulta.bo"),
    ).toBeInTheDocument();
  });

  it("labels the toggle button Desactivar for an active account and Reactivar for an inactive one", () => {
    render(<PracticeDetail practice={practice} />);

    expect(screen.getAllByRole("button", { name: "Desactivar" })).toHaveLength(
      1,
    );
    expect(screen.getAllByRole("button", { name: "Reactivar" })).toHaveLength(
      1,
    );
  });

  it("calls toggleAccountActive with the account and practice id", async () => {
    const user = userEvent.setup();
    render(<PracticeDetail practice={practice} />);

    await user.click(screen.getByRole("button", { name: "Desactivar" }));

    expect(toggleAccountActive).toHaveBeenCalledWith("user-doctor", "doc-1");
  });

  it("shows the WhatsApp reset link after resetting a password", async () => {
    resetAccountPassword.mockResolvedValue("https://wa.me/1?text=reset");
    const user = userEvent.setup();
    render(<PracticeDetail practice={practice} />);

    await user.click(
      screen.getAllByRole("button", { name: "Restablecer contraseña" })[0],
    );

    expect(resetAccountPassword).toHaveBeenCalledWith("user-doctor");
    expect(
      await screen.findByRole("link", { name: "✆ Enviar enlace por WhatsApp" }),
    ).toHaveAttribute("href", "https://wa.me/1?text=reset");
  });

  it("opens a confirmation modal before impersonating and cancels without calling the action", async () => {
    const user = userEvent.setup();
    render(<PracticeDetail practice={practice} />);

    await user.click(
      screen.getAllByRole("button", { name: "Iniciar sesión como…" })[0],
    );

    expect(
      screen.getByText("Iniciar sesión como Dra. Carla Mendoza"),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(
      screen.queryByText("Iniciar sesión como Dra. Carla Mendoza"),
    ).not.toBeInTheDocument();
    expect(impersonateAccount).not.toHaveBeenCalled();
  });

  it("calls impersonateAccount when the modal is confirmed", async () => {
    const user = userEvent.setup();
    render(<PracticeDetail practice={practice} />);

    await user.click(
      screen.getAllByRole("button", { name: "Iniciar sesión como…" })[0],
    );
    await user.click(
      screen.getByRole("button", {
        name: "Sí, continuar como Dra. Carla Mendoza",
      }),
    );

    expect(impersonateAccount).toHaveBeenCalledWith("user-doctor");
  });
});

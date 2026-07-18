import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "./login-form";

const { signIn, getSession, push, refresh } = vi.hoisted(() => ({
  signIn: vi.fn(),
  getSession: vi.fn(),
  push: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock("next-auth/react", () => ({ signIn, getSession }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, refresh }),
}));

async function submitLogin(email: string, password: string) {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Correo electrónico"), email);
  await user.type(screen.getByLabelText("Contraseña"), password);
  await user.click(screen.getByRole("button", { name: "Ingresar" }));
}

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders email and password fields", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText("Correo electrónico")).toBeInTheDocument();
    expect(screen.getByLabelText("Contraseña")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Ingresar" }),
    ).toBeInTheDocument();
  });

  it("shows the error banner on invalid credentials", async () => {
    signIn.mockResolvedValue({ error: "CredentialsSignin" });
    render(<LoginForm />);

    await submitLogin("doctor@consulta.bo", "wrong");

    expect(
      screen.getByText(/Correo o contraseña incorrectos/),
    ).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });

  it("routes a first login doctor to onboarding", async () => {
    signIn.mockResolvedValue({ ok: true, error: null });
    getSession.mockResolvedValue({
      user: { role: "DOCTOR", doctorOnboarded: false },
    });
    render(<LoginForm />);

    await submitLogin("doctor@consulta.bo", "correct");

    expect(push).toHaveBeenCalledWith("/panel/onboarding");
  });

  it("routes a returning doctor to appointments", async () => {
    signIn.mockResolvedValue({ ok: true, error: null });
    getSession.mockResolvedValue({
      user: { role: "DOCTOR", doctorOnboarded: true },
    });
    render(<LoginForm />);

    await submitLogin("doctor@consulta.bo", "correct");

    expect(push).toHaveBeenCalledWith("/panel/appointments");
  });

  it("clears a previous error on a successful retry", async () => {
    signIn.mockResolvedValueOnce({ error: "CredentialsSignin" });
    signIn.mockResolvedValue({ ok: true, error: null });
    getSession.mockResolvedValue({ user: { role: "ASSISTANT" } });
    render(<LoginForm />);

    await submitLogin("asistente@consulta.bo", "wrong");
    expect(
      screen.getByText(/Correo o contraseña incorrectos/),
    ).toBeInTheDocument();

    await submitLogin("", "correct");
    expect(
      screen.queryByText(/Correo o contraseña incorrectos/),
    ).not.toBeInTheDocument();
    expect(push).toHaveBeenCalledWith("/panel/appointments");
  });
});

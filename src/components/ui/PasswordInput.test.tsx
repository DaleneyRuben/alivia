import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PasswordInput } from "./PasswordInput";

describe("PasswordInput", () => {
  it("renders as a masked password field by default", () => {
    render(
      <PasswordInput
        id="password"
        value=""
        onChange={vi.fn()}
        placeholder="••••••••"
      />,
    );

    expect(
      screen.getByRole("button", { name: "Mostrar contraseña" }),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toHaveAttribute(
      "type",
      "password",
    );
  });

  it("calls onChange with the typed value", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <PasswordInput
        id="password"
        value=""
        onChange={onChange}
        placeholder="••••••••"
      />,
    );

    await user.type(screen.getByPlaceholderText("••••••••"), "a");

    expect(onChange).toHaveBeenCalled();
  });

  it("toggles between masked and revealed on click", async () => {
    const user = userEvent.setup();
    render(
      <PasswordInput id="password" value="secret123" onChange={vi.fn()} />,
    );

    const input = screen.getByDisplayValue("secret123");
    expect(input).toHaveAttribute("type", "password");

    await user.click(
      screen.getByRole("button", { name: "Mostrar contraseña" }),
    );

    expect(input).toHaveAttribute("type", "text");
    expect(
      screen.getByRole("button", { name: "Ocultar contraseña" }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Ocultar contraseña" }),
    );

    expect(input).toHaveAttribute("type", "password");
    expect(
      screen.getByRole("button", { name: "Mostrar contraseña" }),
    ).toBeInTheDocument();
  });
});

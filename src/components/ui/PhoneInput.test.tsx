import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PhoneInput } from "./PhoneInput";

describe("PhoneInput", () => {
  it("defaults to Bolivia and emits E.164 as the national number is typed", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <div>
        <label htmlFor="phone">Teléfono</label>
        <PhoneInput id="phone" onChange={onChange} />
      </div>,
    );

    await user.type(screen.getByLabelText("Teléfono"), "71234567");

    expect(onChange).toHaveBeenLastCalledWith("+59171234567");
  });

  it("uses the newly selected country's dial code once changed", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <div>
        <label htmlFor="phone">Teléfono</label>
        <PhoneInput id="phone" onChange={onChange} />
      </div>,
    );

    await user.selectOptions(screen.getByLabelText("Código de país"), "🇦🇷 +54");
    await user.type(screen.getByLabelText("Teléfono"), "91123456789");

    expect(onChange).toHaveBeenLastCalledWith("+5491123456789");
  });

  it("strips non-digit characters from the typed national number", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <div>
        <label htmlFor="phone">Teléfono</label>
        <PhoneInput id="phone" onChange={onChange} />
      </div>,
    );

    await user.type(screen.getByLabelText("Teléfono"), "712-345 67");

    expect(onChange).toHaveBeenLastCalledWith("+59171234567");
  });

  it("passes the placeholder through to the national number field", () => {
    render(
      <PhoneInput id="phone" onChange={vi.fn()} placeholder="7XX XXX XX" />,
    );
    expect(screen.getByPlaceholderText("7XX XXX XX")).toBeInTheDocument();
  });
});

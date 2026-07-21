import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProfileForm } from "./ProfileForm";

const value = {
  name: "Dr. Luis Fernández",
  specialty: "Pediatría",
  yearsExperience: 14,
  bio: "Pediatra con enfoque en el control del niño sano.",
};

describe("ProfileForm", () => {
  it("renders the current profile values", () => {
    render(<ProfileForm value={value} onChange={vi.fn()} />);

    expect(screen.getByLabelText("Nombre completo")).toHaveValue(value.name);
    expect(screen.getByLabelText("Especialidad")).toHaveValue(value.specialty);
    expect(screen.getByLabelText("Años de experiencia")).toHaveValue(14);
    expect(screen.getByLabelText("Biografía breve")).toHaveValue(value.bio);
  });

  it("calls onChange with the updated name", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ProfileForm value={value} onChange={onChange} />);

    await user.type(screen.getByLabelText("Nombre completo"), "!");

    expect(onChange).toHaveBeenLastCalledWith({
      ...value,
      name: `${value.name}!`,
    });
  });

  it("calls onChange with a null yearsExperience when cleared", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ProfileForm value={value} onChange={onChange} />);

    await user.clear(screen.getByLabelText("Años de experiencia"));

    expect(onChange).toHaveBeenLastCalledWith({
      ...value,
      yearsExperience: null,
    });
  });
});

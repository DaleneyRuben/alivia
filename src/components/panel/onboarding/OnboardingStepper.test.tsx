import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { OnboardingStepper } from "./OnboardingStepper";

describe("OnboardingStepper", () => {
  it("renders all four step labels", () => {
    render(<OnboardingStepper currentStep={1} />);

    expect(screen.getByText("Perfil")).toBeInTheDocument();
    expect(screen.getByText("Ubicaciones")).toBeInTheDocument();
    expect(screen.getByText("Horarios")).toBeInTheDocument();
    expect(screen.getByText("Revisar")).toBeInTheDocument();
  });

  it("marks the current step number", () => {
    render(<OnboardingStepper currentStep={3} />);

    expect(screen.getByText("3")).toHaveAttribute("aria-current", "step");
    expect(screen.getByText("2")).not.toHaveAttribute("aria-current");
  });
});

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PatientHeader } from "./PatientHeader";

describe("PatientHeader", () => {
  it("shows the Alivia logo", () => {
    render(<PatientHeader />);
    expect(screen.getByText("Alivia")).toBeInTheDocument();
  });

  it("does not show an Ingresar link", () => {
    render(<PatientHeader />);
    expect(
      screen.queryByRole("link", { name: "Ingresar" }),
    ).not.toBeInTheDocument();
  });
});

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PatientHeader } from "./PatientHeader";

describe("PatientHeader", () => {
  it("shows the Alivia logo", () => {
    render(<PatientHeader />);
    expect(screen.getByText("Alivia")).toBeInTheDocument();
  });

  it("links Ingresar to the panel login", () => {
    render(<PatientHeader />);
    expect(screen.getByRole("link", { name: "Ingresar" })).toHaveAttribute(
      "href",
      "/login",
    );
  });
});

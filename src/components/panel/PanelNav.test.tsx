import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PanelNav } from "./PanelNav";

vi.mock("next/navigation", () => ({
  usePathname: () => "/panel/appointments",
}));

describe("PanelNav", () => {
  it("renders the shared nav items for a doctor", () => {
    render(<PanelNav role="DOCTOR" email="doctor@consulta.bo" />);

    expect(screen.getByRole("link", { name: "Citas" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Confirmaciones" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Horarios" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Vacaciones" }),
    ).toBeInTheDocument();
  });

  it("renders the doctor-only items for a doctor", () => {
    render(<PanelNav role="DOCTOR" email="doctor@consulta.bo" />);

    expect(
      screen.getByRole("link", { name: "Ubicaciones" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Historial" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Cuenta" })).toBeInTheDocument();
  });

  it("omits the doctor-only items from the DOM for an assistant", () => {
    render(<PanelNav role="ASSISTANT" email="asistente@consulta.bo" />);

    expect(screen.getByRole("link", { name: "Citas" })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Ubicaciones" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Historial" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Cuenta" }),
    ).not.toBeInTheDocument();
  });

  it("marks the item matching the current route as active", () => {
    render(<PanelNav role="DOCTOR" email="doctor@consulta.bo" />);

    expect(screen.getByRole("link", { name: "Citas" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Horarios" })).not.toHaveAttribute(
      "aria-current",
    );
  });
});

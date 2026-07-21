import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AdminNav } from "./AdminNav";

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin",
}));

describe("AdminNav", () => {
  it("renders the admin nav items", () => {
    render(<AdminNav />);

    expect(screen.getByRole("link", { name: "Roster" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Analytics" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Estado del sistema" }),
    ).toBeInTheDocument();
  });

  it("marks Roster as active on the /admin route", () => {
    render(<AdminNav />);

    expect(screen.getByRole("link", { name: "Roster" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Analytics" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("shows the ADMIN badge and Fundador user badge", () => {
    render(<AdminNav />);

    expect(screen.getByText("ADMIN")).toBeInTheDocument();
    expect(screen.getByText("Fundador")).toBeInTheDocument();
  });
});

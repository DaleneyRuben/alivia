import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdminNav } from "./AdminNav";

const { signOut } = vi.hoisted(() => ({ signOut: vi.fn() }));
vi.mock("next-auth/react", () => ({ signOut }));
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

  it("signs out and redirects to /login from the user menu", async () => {
    const user = userEvent.setup();
    render(<AdminNav />);

    await user.click(screen.getByRole("button", { name: /Fundador/ }));
    await user.click(screen.getByRole("button", { name: /Salir/ }));

    expect(signOut).toHaveBeenCalledWith({ callbackUrl: "/login" });
  });
});

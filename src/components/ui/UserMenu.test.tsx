import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserMenu } from "./UserMenu";

const { signOut } = vi.hoisted(() => ({ signOut: vi.fn() }));
vi.mock("next-auth/react", () => ({ signOut }));

describe("UserMenu", () => {
  it("does not show the dropdown until the trigger is clicked", () => {
    render(<UserMenu avatar={<span>DR</span>} label={<span>Doctor</span>} />);

    expect(
      screen.queryByRole("button", { name: /Salir/ }),
    ).not.toBeInTheDocument();
  });

  it("shows the Salir option after clicking the trigger", async () => {
    const user = userEvent.setup();
    render(<UserMenu avatar={<span>DR</span>} label={<span>Doctor</span>} />);

    await user.click(screen.getByRole("button", { name: /Doctor/ }));

    expect(screen.getByRole("button", { name: /Salir/ })).toBeInTheDocument();
  });

  it("signs out and redirects to /login when Salir is clicked", async () => {
    const user = userEvent.setup();
    render(<UserMenu avatar={<span>DR</span>} label={<span>Doctor</span>} />);

    await user.click(screen.getByRole("button", { name: /Doctor/ }));
    await user.click(screen.getByRole("button", { name: /Salir/ }));

    expect(signOut).toHaveBeenCalledWith({ callbackUrl: "/login" });
  });

  it("closes the dropdown when clicking outside", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <UserMenu avatar={<span>DR</span>} label={<span>Doctor</span>} />
        <button>outside</button>
      </div>,
    );

    await user.click(screen.getByRole("button", { name: /Doctor/ }));
    expect(screen.getByRole("button", { name: /Salir/ })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "outside" }));

    expect(
      screen.queryByRole("button", { name: /Salir/ }),
    ).not.toBeInTheDocument();
  });
});

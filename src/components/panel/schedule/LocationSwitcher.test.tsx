import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LocationSwitcher } from "./LocationSwitcher";

const locations = [
  { id: "loc-1", name: "Consultorio Zabala" },
  { id: "loc-2", name: "Clínica Sur" },
];

describe("LocationSwitcher", () => {
  it("renders a pill for each location", () => {
    render(
      <LocationSwitcher
        locations={locations}
        activeId="loc-1"
        onSelect={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Consultorio Zabala" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Clínica Sur" }),
    ).toBeInTheDocument();
  });

  it("marks the active location's pill", () => {
    render(
      <LocationSwitcher
        locations={locations}
        activeId="loc-2"
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Clínica Sur" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(
      screen.getByRole("button", { name: "Consultorio Zabala" }),
    ).not.toHaveAttribute("aria-current");
  });

  it("calls onSelect with the clicked location's id", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <LocationSwitcher
        locations={locations}
        activeId="loc-1"
        onSelect={onSelect}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Clínica Sur" }));

    expect(onSelect).toHaveBeenCalledWith("loc-2");
  });
});

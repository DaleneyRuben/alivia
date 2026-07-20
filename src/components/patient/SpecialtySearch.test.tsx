import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SpecialtySearch } from "./SpecialtySearch";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

describe("SpecialtySearch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the search input and specialty chips", () => {
    render(<SpecialtySearch />);

    expect(screen.getByLabelText("Buscar especialista")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Cardiología" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Pediatría" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Dermatología" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Medicina general" }),
    ).toBeInTheDocument();
  });

  it("disables the submit button until a query is typed", async () => {
    const user = userEvent.setup();
    render(<SpecialtySearch />);

    expect(screen.getByRole("button", { name: "Buscar" })).toBeDisabled();

    await user.type(
      screen.getByLabelText("Buscar especialista"),
      "cardiología",
    );

    expect(screen.getByRole("button", { name: "Buscar" })).toBeEnabled();
  });

  it("navigates to results with the typed query on submit", async () => {
    const user = userEvent.setup();
    render(<SpecialtySearch />);

    await user.type(screen.getByLabelText("Buscar especialista"), "Dra. Rojas");
    await user.click(screen.getByRole("button", { name: "Buscar" }));

    expect(push).toHaveBeenCalledWith("/results?specialty=Dra.%20Rojas");
  });

  it("navigates to results when a specialty chip is clicked", async () => {
    const user = userEvent.setup();
    render(<SpecialtySearch />);

    await user.click(screen.getByRole("button", { name: "Pediatría" }));

    expect(push).toHaveBeenCalledWith("/results?specialty=Pediatr%C3%ADa");
  });
});

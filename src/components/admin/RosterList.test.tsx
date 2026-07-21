import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RosterList } from "./RosterList";
import type { PracticeRosterEntry } from "@/lib/admin/getPracticeRoster";

const practices: PracticeRosterEntry[] = [
  {
    id: "doc-1",
    practiceLabel: "Cardio Miraflores",
    doctorName: "Dra. Carla Mendoza",
    specialty: "Cardiología",
    hasAssistant: true,
    active: true,
  },
  {
    id: "doc-2",
    practiceLabel: "Dr. Marco Antonio Salazar",
    doctorName: "Dr. Marco Antonio Salazar",
    specialty: "Medicina General",
    hasAssistant: false,
    active: false,
  },
];

describe("RosterList", () => {
  it("renders a card per practice with its status and assistant chip", () => {
    render(<RosterList practices={practices} />);

    expect(screen.getByText("Cardio Miraflores")).toBeInTheDocument();
    expect(screen.getByText("Con asistente")).toBeInTheDocument();
    expect(screen.getByText("Activa")).toBeInTheDocument();
    expect(screen.getByText("Sin asistente")).toBeInTheDocument();
    expect(screen.getByText("Inactiva")).toBeInTheDocument();
  });

  it("links each card to its practice detail route", () => {
    render(<RosterList practices={practices} />);

    expect(screen.getByText("Cardio Miraflores").closest("a")).toHaveAttribute(
      "href",
      "/admin/doc-1",
    );
  });

  it("filters live by doctor or practice name as the user types", async () => {
    const user = userEvent.setup();
    render(<RosterList practices={practices} />);

    await user.type(
      screen.getByPlaceholderText("Buscar por doctor o consulta"),
      "salazar",
    );

    expect(screen.queryByText("Cardio Miraflores")).not.toBeInTheDocument();
    expect(screen.getByText("Dr. Marco Antonio Salazar")).toBeInTheDocument();
  });

  it("shows an empty state when nothing matches the search", async () => {
    const user = userEvent.setup();
    render(<RosterList practices={practices} />);

    await user.type(
      screen.getByPlaceholderText("Buscar por doctor o consulta"),
      "pediatría",
    );

    expect(
      screen.getByText("No encontramos consultas para esa búsqueda."),
    ).toBeInTheDocument();
  });
});

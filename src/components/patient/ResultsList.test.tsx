import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ResultsList } from "./ResultsList";

const doctor = {
  id: "doc-1",
  name: "Dra. Carla Mendoza",
  specialty: "Cardiología",
  locationName: "Centro Médico Miraflores",
  yearsExperience: 12,
  soonestSlot: { date: "2026-07-21", startMinutes: 930 },
};

describe("ResultsList", () => {
  it("shows the specialty as the title when one is given", () => {
    render(
      <ResultsList
        specialty="Cardiología"
        doctors={[doctor]}
        today="2026-07-21"
        tomorrow="2026-07-22"
      />,
    );
    expect(
      screen.getByRole("heading", { name: "Cardiología" }),
    ).toBeInTheDocument();
  });

  it("falls back to a generic title when there is no specialty", () => {
    render(
      <ResultsList
        specialty={null}
        doctors={[doctor]}
        today="2026-07-21"
        tomorrow="2026-07-22"
      />,
    );
    expect(
      screen.getByRole("heading", { name: "Todos los especialistas" }),
    ).toBeInTheDocument();
  });

  it("shows a singular count for one result", () => {
    render(
      <ResultsList
        specialty="Cardiología"
        doctors={[doctor]}
        today="2026-07-21"
        tomorrow="2026-07-22"
      />,
    );
    expect(
      screen.getByText("1 especialista disponible en La Paz"),
    ).toBeInTheDocument();
  });

  it("shows a plural count for several results", () => {
    render(
      <ResultsList
        specialty="Cardiología"
        doctors={[doctor, { ...doctor, id: "doc-2" }]}
        today="2026-07-21"
        tomorrow="2026-07-22"
      />,
    );
    expect(
      screen.getByText("2 especialistas disponibles en La Paz"),
    ).toBeInTheDocument();
  });

  it("shows the empty state when there are no matches", () => {
    render(
      <ResultsList
        specialty="Oncología"
        doctors={[]}
        today="2026-07-21"
        tomorrow="2026-07-22"
      />,
    );
    expect(
      screen.getByText("No encontramos especialistas para esa búsqueda."),
    ).toBeInTheDocument();
  });

  it("links back to home", () => {
    render(
      <ResultsList
        specialty="Cardiología"
        doctors={[doctor]}
        today="2026-07-21"
        tomorrow="2026-07-22"
      />,
    );
    expect(
      screen.getByRole("link", { name: "← Volver a inicio" }),
    ).toHaveAttribute("href", "/");
  });
});

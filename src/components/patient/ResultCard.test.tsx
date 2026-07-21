import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ResultCard } from "./ResultCard";

const baseDoctor = {
  id: "doc-1",
  name: "Dra. Carla Mendoza",
  specialty: "Cardiología",
  locationName: "Centro Médico Miraflores",
  yearsExperience: 12,
  soonestSlot: { date: "2026-07-21", startMinutes: 930 },
};

describe("ResultCard", () => {
  it("renders the doctor's name, specialty, and location", () => {
    render(
      <ResultCard
        doctor={baseDoctor}
        today="2026-07-21"
        tomorrow="2026-07-22"
      />,
    );

    expect(screen.getByText("Dra. Carla Mendoza")).toBeInTheDocument();
    expect(
      screen.getByText("Cardiología · Centro Médico Miraflores"),
    ).toBeInTheDocument();
  });

  it("shows the experience chip when yearsExperience is set", () => {
    render(
      <ResultCard
        doctor={baseDoctor}
        today="2026-07-21"
        tomorrow="2026-07-22"
      />,
    );
    expect(screen.getByText("12 años de experiencia")).toBeInTheDocument();
  });

  it("hides the experience chip when yearsExperience is null", () => {
    render(
      <ResultCard
        doctor={{ ...baseDoctor, yearsExperience: null }}
        today="2026-07-21"
        tomorrow="2026-07-22"
      />,
    );
    expect(screen.queryByText(/años de experiencia/)).not.toBeInTheDocument();
  });

  it("labels a today slot as Hoy", () => {
    render(
      <ResultCard
        doctor={baseDoctor}
        today="2026-07-21"
        tomorrow="2026-07-22"
      />,
    );
    expect(screen.getByText("Hoy 15:30")).toBeInTheDocument();
  });

  it("labels a tomorrow slot as Mañana", () => {
    render(
      <ResultCard
        doctor={{
          ...baseDoctor,
          soonestSlot: { date: "2026-07-22", startMinutes: 540 },
        }}
        today="2026-07-21"
        tomorrow="2026-07-22"
      />,
    );
    expect(screen.getByText("Mañana 09:00")).toBeInTheDocument();
  });

  it("shows a fallback label when there is no availability in the window", () => {
    render(
      <ResultCard
        doctor={{ ...baseDoctor, soonestSlot: null }}
        today="2026-07-21"
        tomorrow="2026-07-22"
      />,
    );
    expect(screen.getByText("Sin cupos por ahora")).toBeInTheDocument();
  });

  it("links the whole card to the doctor's profile", () => {
    render(
      <ResultCard
        doctor={baseDoctor}
        today="2026-07-21"
        tomorrow="2026-07-22"
      />,
    );
    expect(screen.getByRole("link")).toHaveAttribute("href", "/doctors/doc-1");
  });
});

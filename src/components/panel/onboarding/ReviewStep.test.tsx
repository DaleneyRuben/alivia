import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReviewStep } from "./ReviewStep";

const profile = {
  name: "Dr. Luis Fernández",
  specialty: "Pediatría",
  yearsExperience: 14,
  bio: "",
};

describe("ReviewStep", () => {
  it("shows the profile summary", () => {
    render(<ReviewStep profile={profile} locations={[]} />);

    expect(screen.getByText("Dr. Luis Fernández")).toBeInTheDocument();
    expect(
      screen.getByText("Pediatría · 14 años de experiencia"),
    ).toBeInTheDocument();
  });

  it("lists each location", () => {
    render(
      <ReviewStep
        profile={profile}
        locations={[
          {
            id: "loc-1",
            name: "Consultorio Zabala",
            address: "Av. Arce 123",
            scheduleBlocks: [],
          },
        ]}
      />,
    );

    expect(screen.getByText("Ubicaciones (1)")).toBeInTheDocument();
    expect(
      screen.getByText("• Consultorio Zabala — Av. Arce 123"),
    ).toBeInTheDocument();
  });

  it("shows an empty state when there are no schedule blocks", () => {
    render(
      <ReviewStep
        profile={profile}
        locations={[
          {
            id: "loc-1",
            name: "Consultorio Zabala",
            address: "Av. Arce 123",
            scheduleBlocks: [],
          },
        ]}
      />,
    );

    expect(
      screen.getByText("Sin bloques de horario todavía."),
    ).toBeInTheDocument();
  });

  it("summarizes schedule blocks per location", () => {
    render(
      <ReviewStep
        profile={profile}
        locations={[
          {
            id: "loc-1",
            name: "Consultorio Zabala",
            address: "Av. Arce 123",
            scheduleBlocks: [
              {
                id: "block-1",
                weekdays: [1, 2, 3, 4, 5],
                startMinutes: 8 * 60,
                endMinutes: 12 * 60,
                slotDurationMinutes: 30,
                slotCapacity: 3,
              },
            ],
          },
        ]}
      />,
    );

    expect(
      screen.getByText(
        "Consultorio Zabala: Lun-Vie 08:00-12:00 · 30 min · 3 pacientes",
      ),
    ).toBeInTheDocument();
  });
});

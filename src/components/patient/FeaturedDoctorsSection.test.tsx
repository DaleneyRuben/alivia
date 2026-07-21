import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeaturedDoctorsSection } from "./FeaturedDoctorsSection";

const doctors = [
  {
    id: "doc-1",
    name: "Dra. Carla Mendoza",
    specialty: "Cardiología",
    locationName: "Centro Médico Miraflores",
    yearsExperience: 12,
    soonestSlot: { date: "2026-07-21", startMinutes: 930 },
  },
  {
    id: "doc-2",
    name: "Dr. Luis Fernández",
    specialty: "Pediatría",
    locationName: "Clínica Los Andes",
    yearsExperience: 14,
    soonestSlot: null,
  },
];

describe("FeaturedDoctorsSection", () => {
  it("renders the section heading and every featured doctor", () => {
    render(
      <FeaturedDoctorsSection
        doctors={doctors}
        today="2026-07-21"
        tomorrow="2026-07-22"
      />,
    );

    expect(screen.getByText("Disponibles ahora")).toBeInTheDocument();
    expect(screen.getByText("Dra. Carla Mendoza")).toBeInTheDocument();
    expect(screen.getByText("Dr. Luis Fernández")).toBeInTheDocument();
  });

  it("renders nothing when there are no doctors yet", () => {
    const { container } = render(
      <FeaturedDoctorsSection
        doctors={[]}
        today="2026-07-21"
        tomorrow="2026-07-22"
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SlotPicker } from "./SlotPicker";

const slots = [
  {
    locationId: "loc-1",
    locationName: "Centro Médico Miraflores",
    date: "2026-07-21",
    startMinutes: 930,
    endMinutes: 960,
    availableToPatients: true,
  },
  {
    locationId: "loc-1",
    locationName: "Centro Médico Miraflores",
    date: "2026-07-21",
    startMinutes: 960,
    endMinutes: 990,
    availableToPatients: false,
  },
  {
    locationId: "loc-1",
    locationName: "Centro Médico Miraflores",
    date: "2026-07-21",
    startMinutes: 990,
    endMinutes: 1020,
    availableToPatients: true,
  },
];

describe("SlotPicker", () => {
  it("renders every slot's time", () => {
    render(<SlotPicker doctorId="doc-1" slots={slots} />);

    expect(screen.getByText("15:30")).toBeInTheDocument();
    expect(screen.getByText("16:00")).toBeInTheDocument();
    expect(screen.getByText("16:30")).toBeInTheDocument();
  });

  it("links an available slot to the booking page with its slot params", () => {
    render(<SlotPicker doctorId="doc-1" slots={slots} />);

    expect(screen.getByText("15:30").closest("a")).toHaveAttribute(
      "href",
      "/booking?doctorId=doc-1&locationId=loc-1&date=2026-07-21&start=930",
    );
  });

  it("renders a taken slot as non-interactive", () => {
    render(<SlotPicker doctorId="doc-1" slots={slots} />);
    expect(screen.getByText("16:00").closest("a")).toBeNull();
  });

  it("shows the soonest-available legend", () => {
    render(<SlotPicker doctorId="doc-1" slots={slots} />);
    expect(screen.getByText("Cupo más próximo disponible")).toBeInTheDocument();
  });

  it("shows an empty message when there are no slots", () => {
    render(<SlotPicker doctorId="doc-1" slots={[]} />);
    expect(
      screen.getByText("No hay horarios disponibles por ahora."),
    ).toBeInTheDocument();
  });
});

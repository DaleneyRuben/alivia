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
    tooSoon: false,
  },
  {
    locationId: "loc-1",
    locationName: "Centro Médico Miraflores",
    date: "2026-07-21",
    startMinutes: 960,
    endMinutes: 990,
    availableToPatients: false,
    tooSoon: false,
  },
  {
    locationId: "loc-1",
    locationName: "Centro Médico Miraflores",
    date: "2026-07-21",
    startMinutes: 990,
    endMinutes: 1020,
    availableToPatients: true,
    tooSoon: false,
  },
];

const soonestSlot = { date: "2026-07-21", startMinutes: 930 };

describe("SlotPicker", () => {
  it("renders every slot's time", () => {
    render(
      <SlotPicker
        doctorId="doc-1"
        slots={slots}
        soonestSlot={soonestSlot}
        multiLocation={false}
      />,
    );

    expect(screen.getByText("15:30")).toBeInTheDocument();
    expect(screen.getByText("16:00")).toBeInTheDocument();
    expect(screen.getByText("16:30")).toBeInTheDocument();
  });

  it("links an available slot to the booking page with its slot params", () => {
    render(
      <SlotPicker
        doctorId="doc-1"
        slots={slots}
        soonestSlot={soonestSlot}
        multiLocation={false}
      />,
    );

    expect(screen.getByText("15:30").closest("a")).toHaveAttribute(
      "href",
      "/booking?doctorId=doc-1&locationId=loc-1&date=2026-07-21&start=930",
    );
  });

  it("renders a taken slot as non-interactive and struck through", () => {
    render(
      <SlotPicker
        doctorId="doc-1"
        slots={slots}
        soonestSlot={soonestSlot}
        multiLocation={false}
      />,
    );
    const takenSlot = screen.getByText("16:00");
    expect(takenSlot.closest("a")).toBeNull();
    expect(takenSlot.parentElement?.className).toContain("line-through");
  });

  it("renders a too-soon slot as non-interactive but not struck through, styled distinctly from a full slot", () => {
    render(
      <SlotPicker
        doctorId="doc-1"
        slots={[{ ...slots[0], availableToPatients: false, tooSoon: true }]}
        soonestSlot={null}
        multiLocation={false}
      />,
    );
    const tooSoonSlot = screen.getByText("15:30");
    expect(tooSoonSlot.closest("a")).toBeNull();
    expect(tooSoonSlot.parentElement?.className).not.toContain("line-through");
  });

  it("shows the soonest-available legend", () => {
    render(
      <SlotPicker
        doctorId="doc-1"
        slots={slots}
        soonestSlot={soonestSlot}
        multiLocation={false}
      />,
    );
    expect(screen.getByText("Cupo más próximo disponible")).toBeInTheDocument();
  });

  it("shows an empty message when there are no slots", () => {
    render(
      <SlotPicker
        doctorId="doc-1"
        slots={[]}
        soonestSlot={null}
        multiLocation={false}
      />,
    );
    expect(
      screen.getByText("No hay horarios disponibles por ahora."),
    ).toBeInTheDocument();
  });

  it("shows a per-slot location label when the doctor has more than one location", () => {
    render(
      <SlotPicker
        doctorId="doc-1"
        slots={slots}
        soonestSlot={soonestSlot}
        multiLocation={true}
      />,
    );
    expect(
      screen.getAllByText("Centro Médico Miraflores").length,
    ).toBeGreaterThan(0);
  });

  it("hides the per-slot location label when the doctor has a single location", () => {
    render(
      <SlotPicker
        doctorId="doc-1"
        slots={slots}
        soonestSlot={soonestSlot}
        multiLocation={false}
      />,
    );
    expect(
      screen.queryByText("Centro Médico Miraflores"),
    ).not.toBeInTheDocument();
  });

  it("only highlights the slot matching the passed-in soonestSlot, not just the first available slot shown", () => {
    // browsing a date that doesn't contain the doctor's actual soonest slot
    render(
      <SlotPicker
        doctorId="doc-1"
        slots={slots}
        soonestSlot={{ date: "2026-07-25", startMinutes: 540 }}
        multiLocation={false}
      />,
    );
    expect(screen.getByText("15:30").closest("a")?.className).not.toContain(
      "border-[#4F9C82]",
    );
  });
});

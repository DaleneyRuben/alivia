import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { DoctorProfile } from "./DoctorProfile";

const doctor = {
  id: "doc-1",
  name: "Dra. Carla Mendoza",
  specialty: "Cardiología",
  bio: "Cardióloga con enfoque en prevención.",
  yearsExperience: 12,
  university: "Universidad Mayor de San Andrés",
  locations: [
    { id: "loc-1", name: "Centro Médico Miraflores", address: "Av. Busch" },
  ],
  windowStart: "2026-07-21",
  windowEnd: "2026-08-04",
  selectedDate: "2026-07-21",
  slots: [
    {
      locationId: "loc-1",
      locationName: "Centro Médico Miraflores",
      date: "2026-07-21",
      startMinutes: 930,
      endMinutes: 960,
      availableToPatients: true,
      tooSoon: false,
    },
  ],
  soonestSlot: { date: "2026-07-21", startMinutes: 930 },
};

describe("DoctorProfile", () => {
  it("renders the doctor's name, specialty, and bio", () => {
    render(
      <DoctorProfile
        doctor={doctor}
        today="2026-07-21"
        tomorrow="2026-07-22"
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Dra. Carla Mendoza" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Cardiología")).toBeInTheDocument();
    expect(
      screen.getByText("Cardióloga con enfoque en prevención."),
    ).toBeInTheDocument();
  });

  it("renders the experience and university chips", () => {
    render(
      <DoctorProfile
        doctor={doctor}
        today="2026-07-21"
        tomorrow="2026-07-22"
      />,
    );
    expect(screen.getByText("12 años de experiencia")).toBeInTheDocument();
    expect(
      screen.getByText("Universidad Mayor de San Andrés"),
    ).toBeInTheDocument();
  });

  it("does not render a standalone locations list — location is only surfaced per-slot (finding #4)", () => {
    render(
      <DoctorProfile
        doctor={doctor}
        today="2026-07-21"
        tomorrow="2026-07-22"
      />,
    );
    expect(screen.queryByText("Ubicaciones")).not.toBeInTheDocument();
    expect(screen.queryByText("Av. Busch")).not.toBeInTheDocument();
  });

  it("shows a per-slot location label once the doctor has more than one location", () => {
    const multiLocationDoctor = {
      ...doctor,
      locations: [
        ...doctor.locations,
        { id: "loc-2", name: "Clínica Los Andes", address: "Av. 6 de Agosto" },
      ],
    };
    render(
      <DoctorProfile
        doctor={multiLocationDoctor}
        today="2026-07-21"
        tomorrow="2026-07-22"
      />,
    );
    expect(screen.getByText("Centro Médico Miraflores")).toBeInTheDocument();
  });

  it("renders the date-picker calendar", () => {
    render(
      <DoctorProfile
        doctor={doctor}
        today="2026-07-21"
        tomorrow="2026-07-22"
      />,
    );
    expect(screen.getByText("Próximos 14 días")).toBeInTheDocument();
  });

  it("shows the hero next-available pill", () => {
    render(
      <DoctorProfile
        doctor={doctor}
        today="2026-07-21"
        tomorrow="2026-07-22"
      />,
    );
    expect(screen.getByText("Próxima cita: Hoy 15:30")).toBeInTheDocument();
  });

  it("labels the slot grid with Hoy when the shown date is today", () => {
    render(
      <DoctorProfile
        doctor={doctor}
        today="2026-07-21"
        tomorrow="2026-07-22"
      />,
    );
    expect(screen.getByText("Elige un horario · Hoy")).toBeInTheDocument();
  });

  it("renders the slot picker's times", () => {
    render(
      <DoctorProfile
        doctor={doctor}
        today="2026-07-21"
        tomorrow="2026-07-22"
      />,
    );
    expect(screen.getByText("15:30")).toBeInTheDocument();
  });

  it("links back to results filtered by this doctor's specialty", () => {
    render(
      <DoctorProfile
        doctor={doctor}
        today="2026-07-21"
        tomorrow="2026-07-22"
      />,
    );
    expect(
      screen.getByRole("link", { name: "← Volver a resultados" }),
    ).toHaveAttribute("href", "/results?specialty=Cardiolog%C3%ADa");
  });

  it("omits the bio paragraph when there is none", () => {
    render(
      <DoctorProfile
        doctor={{ ...doctor, bio: null }}
        today="2026-07-21"
        tomorrow="2026-07-22"
      />,
    );
    expect(
      screen.queryByText("Cardióloga con enfoque en prevención."),
    ).not.toBeInTheDocument();
  });
});

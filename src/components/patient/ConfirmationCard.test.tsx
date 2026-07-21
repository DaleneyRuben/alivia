import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ConfirmationCard } from "./ConfirmationCard";

const appointment = {
  id: "appt-1",
  cancelToken: "token-123",
  status: "SCHEDULED" as const,
  date: "2026-07-23",
  startMinutes: 930,
  endMinutes: 960,
  doctorName: "Dra. Carla Mendoza",
  specialty: "Cardiología",
  locationName: "Centro Médico Miraflores",
  patientName: "María Quispe",
  patientPhone: "71234567",
};

describe("ConfirmationCard", () => {
  it("shows a personalized subtitle with the patient's first name", () => {
    render(<ConfirmationCard appointment={appointment} />);
    expect(screen.getByText(/María,/)).toBeInTheDocument();
  });

  it("shows the doctor, specialty, and location", () => {
    render(<ConfirmationCard appointment={appointment} />);
    expect(screen.getByText("Dra. Carla Mendoza")).toBeInTheDocument();
    expect(screen.getByText("Cardiología")).toBeInTheDocument();
    expect(screen.getByText("Centro Médico Miraflores")).toBeInTheDocument();
  });

  it("shows the patient's name under A nombre de", () => {
    render(<ConfirmationCard appointment={appointment} />);
    expect(screen.getByText("María Quispe")).toBeInTheDocument();
  });

  it("links the WhatsApp button to the patient's own number with a prefilled message", () => {
    render(<ConfirmationCard appointment={appointment} />);
    const link = screen.getByRole("link", {
      name: /Enviarme la confirmación/,
    });
    expect(link).toHaveAttribute(
      "href",
      expect.stringContaining("https://wa.me/71234567?text="),
    );
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("links Cancelar esta cita to the token-scoped cancel page", () => {
    render(<ConfirmationCard appointment={appointment} />);
    expect(
      screen.getByRole("link", { name: "Cancelar esta cita" }),
    ).toHaveAttribute("href", "/cancel/token-123");
  });
});

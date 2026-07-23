import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { DoctorProfileCalendar } from "./DoctorProfileCalendar";

describe("DoctorProfileCalendar", () => {
  it("shows the month and year of the selected date", () => {
    render(
      <DoctorProfileCalendar
        doctorId="doc-1"
        windowStart="2026-07-20"
        windowEnd="2026-08-03"
        selectedDate="2026-07-20"
      />,
    );
    expect(screen.getByText("julio 2026")).toBeInTheDocument();
  });

  it("shows the 14-day window caption", () => {
    render(
      <DoctorProfileCalendar
        doctorId="doc-1"
        windowStart="2026-07-20"
        windowEnd="2026-08-03"
        selectedDate="2026-07-20"
      />,
    );
    expect(screen.getByText("Próximos 14 días")).toBeInTheDocument();
  });

  it("renders the monday-first spanish weekday header", () => {
    render(
      <DoctorProfileCalendar
        doctorId="doc-1"
        windowStart="2026-07-20"
        windowEnd="2026-08-03"
        selectedDate="2026-07-20"
      />,
    );
    ["L", "M", "M", "J", "V", "S", "D"].forEach((label) => {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    });
  });

  it("links an in-window day to that date", () => {
    render(
      <DoctorProfileCalendar
        doctorId="doc-1"
        windowStart="2026-07-20"
        windowEnd="2026-08-03"
        selectedDate="2026-07-20"
      />,
    );
    expect(screen.getByRole("link", { name: "25" })).toHaveAttribute(
      "href",
      "/doctors/doc-1?date=2026-07-25",
    );
  });

  it("does not link a day before the window start", () => {
    render(
      <DoctorProfileCalendar
        doctorId="doc-1"
        windowStart="2026-07-20"
        windowEnd="2026-08-03"
        selectedDate="2026-07-20"
      />,
    );
    expect(screen.queryByRole("link", { name: "10" })).not.toBeInTheDocument();
  });

  it("does not link a day after the window end when it falls in the viewed month", () => {
    render(
      <DoctorProfileCalendar
        doctorId="doc-1"
        windowStart="2026-07-01"
        windowEnd="2026-07-10"
        selectedDate="2026-07-01"
      />,
    );
    expect(screen.queryByRole("link", { name: "15" })).not.toBeInTheDocument();
  });

  it("marks the selected day distinctly", () => {
    render(
      <DoctorProfileCalendar
        doctorId="doc-1"
        windowStart="2026-07-20"
        windowEnd="2026-08-03"
        selectedDate="2026-07-25"
      />,
    );
    expect(screen.getByRole("link", { name: "25" }).className).toContain(
      "bg-terracotta",
    );
  });

  it("offers a next-month link when the window spans into the following month", () => {
    render(
      <DoctorProfileCalendar
        doctorId="doc-1"
        windowStart="2026-07-20"
        windowEnd="2026-08-03"
        selectedDate="2026-07-20"
      />,
    );
    expect(screen.getByRole("link", { name: "Mes siguiente" })).toHaveAttribute(
      "href",
      "/doctors/doc-1?date=2026-08-01",
    );
  });

  it("omits the next-month link when the window fits inside a single month", () => {
    render(
      <DoctorProfileCalendar
        doctorId="doc-1"
        windowStart="2026-07-01"
        windowEnd="2026-07-10"
        selectedDate="2026-07-01"
      />,
    );
    expect(
      screen.queryByRole("link", { name: "Mes siguiente" }),
    ).not.toBeInTheDocument();
  });

  it("offers a prev-month link back to the window start when viewing the later month", () => {
    render(
      <DoctorProfileCalendar
        doctorId="doc-1"
        windowStart="2026-07-20"
        windowEnd="2026-08-03"
        selectedDate="2026-08-01"
      />,
    );
    expect(screen.getByRole("link", { name: "Mes anterior" })).toHaveAttribute(
      "href",
      "/doctors/doc-1?date=2026-07-20",
    );
  });
});

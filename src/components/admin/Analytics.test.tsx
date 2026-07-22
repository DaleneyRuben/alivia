import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Analytics } from "./Analytics";
import type { Analytics as AnalyticsData } from "@/lib/admin/getAnalytics";

const analytics: AnalyticsData = {
  stats: [
    {
      label: "Consultas activas",
      value: "38",
      delta: "+5 este mes",
      tone: "positive",
    },
    {
      label: "Citas reservadas",
      value: "2.914",
      delta: "+312 este mes",
      tone: "positive",
    },
    {
      label: "Tasa de asistencia",
      value: "86%",
      delta: "últimos 30 días",
      tone: "neutral",
    },
    {
      label: "Asistentes",
      value: "21",
      delta: "en la plataforma",
      tone: "neutral",
    },
  ],
  chart: [
    { label: "feb", value: 18, highlighted: false },
    { label: "mar", value: 23, highlighted: false },
    { label: "jul", value: 38, highlighted: true },
  ],
};

describe("Analytics", () => {
  it("renders each stat tile with its value and delta", () => {
    render(<Analytics analytics={analytics} />);

    expect(screen.getByText("Consultas activas")).toBeInTheDocument();
    expect(screen.getByText("38")).toBeInTheDocument();
    expect(screen.getByText("+5 este mes")).toBeInTheDocument();
    expect(screen.getByText("2.914")).toBeInTheDocument();
    expect(screen.getByText("86%")).toBeInTheDocument();
    expect(screen.getByText("últimos 30 días")).toBeInTheDocument();
    expect(screen.getByText("21")).toBeInTheDocument();
  });

  it("renders a chart bar per month with its label", () => {
    render(<Analytics analytics={analytics} />);

    expect(screen.getByText("feb")).toBeInTheDocument();
    expect(screen.getByText("mar")).toBeInTheDocument();
    expect(screen.getByText("jul")).toBeInTheDocument();
  });
});

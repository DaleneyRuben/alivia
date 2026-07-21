import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { HistoryPatientList } from "./HistoryPatientList";

describe("HistoryPatientList", () => {
  it("shows an empty state when there are no patients", () => {
    render(<HistoryPatientList patients={[]} />);
    expect(
      screen.getByText("No hay pacientes registrados todavía."),
    ).toBeInTheDocument();
  });

  it("tags a patient with a Medical Profile as Con historia", () => {
    render(
      <HistoryPatientList
        patients={[
          {
            id: "p1",
            name: "Ana Quispe",
            hasMedicalProfile: true,
            visitCount: 2,
          },
        ]}
      />,
    );
    expect(screen.getByText("Ana Quispe")).toBeInTheDocument();
    expect(screen.getByText("Con historia")).toBeInTheDocument();
    expect(screen.getByText("2 visitas registradas")).toBeInTheDocument();
  });

  it("tags a patient with no Medical Profile as Nueva and links to their detail page", () => {
    render(
      <HistoryPatientList
        patients={[
          {
            id: "p2",
            name: "Beto Fernández",
            hasMedicalProfile: false,
            visitCount: 0,
          },
        ]}
      />,
    );
    expect(screen.getByText("Nueva")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Beto Fernández/ }),
    ).toHaveAttribute("href", "/panel/history/p2");
  });
});

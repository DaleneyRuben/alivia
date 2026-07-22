import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SystemStatus } from "./SystemStatus";
import type { SystemStatus as SystemStatusData } from "@/lib/admin/getSystemStatus";

const operational: SystemStatusData = {
  allOperational: true,
  rows: [
    {
      name: "Base de datos",
      detail: "PostgreSQL · latencia 12 ms",
      state: "ok",
    },
    { name: "Despliegue de la app", detail: "desarrollo", state: "ok" },
    {
      name: "Envío de WhatsApp (enlaces)",
      detail: "Generación de enlaces wa.me",
      state: "ok",
    },
    {
      name: "Trabajos programados",
      detail: "Sin trabajos configurados en v1",
      state: "ok",
    },
  ],
};

describe("SystemStatus", () => {
  it("shows the all-operational banner and each row as Operativo", () => {
    render(<SystemStatus status={operational} />);

    expect(
      screen.getByText("Todos los sistemas operativos"),
    ).toBeInTheDocument();
    expect(screen.getByText("Base de datos")).toBeInTheDocument();
    expect(screen.getAllByText("Operativo")).toHaveLength(4);
  });

  it("shows a degraded row with its own label when a system isn't ok", () => {
    const degraded: SystemStatusData = {
      allOperational: false,
      rows: [
        ...operational.rows.slice(0, 3),
        {
          name: "Trabajos programados",
          detail: "Generación de cupos · degradado",
          state: "degraded",
        },
      ],
    };
    render(<SystemStatus status={degraded} />);

    expect(
      screen.getByText("Algunos sistemas presentan problemas"),
    ).toBeInTheDocument();
    expect(screen.getByText("Degradado")).toBeInTheDocument();
  });
});

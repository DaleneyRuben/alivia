import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmationList } from "./ConfirmationList";

const confirmations = [
  {
    id: "c1",
    startMinutes: 540,
    patientName: "Juana Pérez",
    patientPhone: "+591 71234567",
    status: "SCHEDULED" as const,
    confirmationStatus: "PENDING" as const,
    whatsAppUrl: "https://wa.me/59171234567?text=hola",
  },
  {
    id: "c2",
    startMinutes: 600,
    patientName: "Mario Soto",
    patientPhone: "+591 76543210",
    status: "SCHEDULED" as const,
    confirmationStatus: "CONFIRMED" as const,
    whatsAppUrl: "https://wa.me/59176543210?text=hola",
  },
  {
    id: "c3",
    startMinutes: 660,
    patientName: "Ana Vargas",
    patientPhone: "+591 79988776",
    status: "CANCELLED" as const,
    confirmationStatus: "PENDING" as const,
    whatsAppUrl: "https://wa.me/59179988776?text=hola",
  },
];

describe("ConfirmationList", () => {
  it("shows an empty state when there are no confirmations", () => {
    render(
      <ConfirmationList
        confirmations={[]}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByText("No hay citas para mañana.")).toBeInTheDocument();
  });

  it("shows the pending count", () => {
    render(
      <ConfirmationList
        confirmations={confirmations}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByText("1 pendientes")).toBeInTheDocument();
  });

  it("renders a pending row with a WhatsApp link and formatted time", () => {
    render(
      <ConfirmationList
        confirmations={confirmations}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByText("09:00")).toBeInTheDocument();
    expect(screen.getByText("Juana Pérez")).toBeInTheDocument();
    const link = screen.getByRole("link", { name: "✆ WhatsApp" });
    expect(link).toHaveAttribute("href", "https://wa.me/59171234567?text=hola");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("confirms a pending row", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <ConfirmationList
        confirmations={confirmations}
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Confirmó" }));
    expect(onConfirm).toHaveBeenCalledWith("c1");
  });

  it("cancels a pending row", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(
      <ConfirmationList
        confirmations={confirmations}
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Canceló" }));
    expect(onCancel).toHaveBeenCalledWith("c1");
  });

  it("shows a confirmed pill instead of actions for a confirmed row", () => {
    render(
      <ConfirmationList
        confirmations={confirmations}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByText("✓ Confirmó")).toBeInTheDocument();
  });

  it("shows a cancelled pill instead of actions for a cancelled row", () => {
    render(
      <ConfirmationList
        confirmations={confirmations}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    const matches = screen.getAllByText("Canceló");
    expect(matches).toHaveLength(2);
    expect(matches.find((el) => el.tagName === "SPAN")).toBeInTheDocument();
  });
});

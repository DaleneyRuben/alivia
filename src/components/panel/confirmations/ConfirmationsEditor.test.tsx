import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmationsEditor } from "./ConfirmationsEditor";

const { refresh, confirmAppointment, updateAppointmentStatus } = vi.hoisted(
  () => ({
    refresh: vi.fn(),
    confirmAppointment: vi.fn().mockResolvedValue(undefined),
    updateAppointmentStatus: vi.fn().mockResolvedValue(undefined),
  }),
);

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh }),
}));
vi.mock("@/lib/confirmations/confirmAppointment", () => ({
  confirmAppointment,
}));
vi.mock("@/lib/appointments/updateAppointmentStatus", () => ({
  updateAppointmentStatus,
}));

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
];

function renderEditor() {
  return render(
    <ConfirmationsEditor tomorrow="2026-07-22" confirmations={confirmations} />,
  );
}

describe("ConfirmationsEditor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the tomorrow header and title", () => {
    renderEditor();

    expect(
      screen.getByText("Mañana · Miércoles 22 de julio"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Confirmaciones" }),
    ).toBeInTheDocument();
  });

  it("renders the confirmations queue", () => {
    renderEditor();

    expect(screen.getByText("Juana Pérez")).toBeInTheDocument();
  });

  it("confirms a row and refreshes", async () => {
    const user = userEvent.setup();
    renderEditor();

    await user.click(screen.getByRole("button", { name: "Confirmó" }));

    expect(confirmAppointment).toHaveBeenCalledWith("c1");
    expect(refresh).toHaveBeenCalled();
  });

  it("cancels a row and refreshes", async () => {
    const user = userEvent.setup();
    renderEditor();

    await user.click(screen.getByRole("button", { name: "Canceló" }));

    expect(updateAppointmentStatus).toHaveBeenCalledWith("c1", "CANCELLED");
    expect(refresh).toHaveBeenCalled();
  });
});

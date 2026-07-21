import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { refreshMock, enableMedicalHistoryMock } = vi.hoisted(() => ({
  refreshMock: vi.fn(),
  enableMedicalHistoryMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));

vi.mock("@/lib/history/enableMedicalHistory", () => ({
  enableMedicalHistory: enableMedicalHistoryMock,
}));

import { HistoryOptIn } from "./HistoryOptIn";

describe("HistoryOptIn", () => {
  beforeEach(() => {
    refreshMock.mockClear();
    enableMedicalHistoryMock.mockClear();
    enableMedicalHistoryMock.mockResolvedValue(undefined);
  });

  it("shows the CTA copy", () => {
    render(<HistoryOptIn />);
    expect(
      screen.getByRole("button", { name: "Activar historia clínica" }),
    ).toBeInTheDocument();
  });

  it("enables Medical History and refreshes on click", async () => {
    const user = userEvent.setup();
    render(<HistoryOptIn />);

    await user.click(
      screen.getByRole("button", { name: "Activar historia clínica" }),
    );

    expect(enableMedicalHistoryMock).toHaveBeenCalled();
    expect(refreshMock).toHaveBeenCalled();
  });
});

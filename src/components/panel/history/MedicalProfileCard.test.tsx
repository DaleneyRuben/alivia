import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { refreshMock, updateMedicalProfileMock } = vi.hoisted(() => ({
  refreshMock: vi.fn(),
  updateMedicalProfileMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));

vi.mock("@/lib/history/updateMedicalProfile", () => ({
  updateMedicalProfile: updateMedicalProfileMock,
}));

import { MedicalProfileCard } from "./MedicalProfileCard";

describe("MedicalProfileCard", () => {
  beforeEach(() => {
    refreshMock.mockClear();
    updateMedicalProfileMock.mockClear();
    updateMedicalProfileMock.mockResolvedValue(undefined);
  });

  it("shows the baseline fields read-only by default", () => {
    render(
      <MedicalProfileCard
        patientId="p1"
        dateOfBirth="1988-03-14"
        bloodType="O+"
        allergiesAndHistory="Penicilina"
      />,
    );
    expect(screen.getByText("14 mar 1988")).toBeInTheDocument();
    expect(screen.getByText("O+")).toBeInTheDocument();
    expect(screen.getByText("Penicilina")).toBeInTheDocument();
  });

  it("shows a dash for unset fields", () => {
    render(
      <MedicalProfileCard
        patientId="p1"
        dateOfBirth={null}
        bloodType={null}
        allergiesAndHistory={null}
      />,
    );
    expect(screen.getAllByText("—")).toHaveLength(3);
  });

  it("saves edits and refreshes", async () => {
    const user = userEvent.setup();
    render(
      <MedicalProfileCard
        patientId="p1"
        dateOfBirth={null}
        bloodType={null}
        allergiesAndHistory={null}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Editar" }));
    await user.type(screen.getByLabelText("Tipo de sangre"), "A+");
    await user.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect(updateMedicalProfileMock).toHaveBeenCalledWith({
      patientId: "p1",
      dateOfBirth: null,
      bloodType: "A+",
      allergiesAndHistory: "",
    });
    expect(refreshMock).toHaveBeenCalled();
  });
});

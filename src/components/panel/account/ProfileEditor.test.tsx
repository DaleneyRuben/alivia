import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProfileEditor } from "./ProfileEditor";

const { refresh, updateDoctorProfile } = vi.hoisted(() => ({
  refresh: vi.fn(),
  updateDoctorProfile: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh }),
}));
vi.mock("@/lib/doctor/updateDoctorProfile", () => ({ updateDoctorProfile }));

const profile = {
  name: "Dr. Luis Fernández",
  specialty: "Pediatría",
  yearsExperience: 8,
  bio: "",
};

describe("ProfileEditor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the current profile values", () => {
    render(<ProfileEditor profile={profile} />);

    expect(screen.getByLabelText("Nombre completo")).toHaveValue(
      "Dr. Luis Fernández",
    );
    expect(screen.getByLabelText("Especialidad")).toHaveValue("Pediatría");
  });

  it("saves the edited profile and refreshes", async () => {
    const user = userEvent.setup();
    render(<ProfileEditor profile={profile} />);

    await user.clear(screen.getByLabelText("Especialidad"));
    await user.type(screen.getByLabelText("Especialidad"), "Cardiología");
    await user.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect(updateDoctorProfile).toHaveBeenCalledWith({
      ...profile,
      specialty: "Cardiología",
    });
    expect(refresh).toHaveBeenCalled();
  });

  it("disables the save button when the profile is invalid", async () => {
    const user = userEvent.setup();
    render(<ProfileEditor profile={profile} />);

    await user.clear(screen.getByLabelText("Nombre completo"));

    expect(
      screen.getByRole("button", { name: "Guardar cambios" }),
    ).toBeDisabled();
  });
});

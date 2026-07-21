import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OnboardingWizard } from "./OnboardingWizard";

const { push, updateDoctorProfile, completeOnboarding } = vi.hoisted(() => ({
  push: vi.fn(),
  updateDoctorProfile: vi.fn().mockResolvedValue(undefined),
  completeOnboarding: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));
vi.mock("@/lib/doctor/updateDoctorProfile", () => ({ updateDoctorProfile }));
vi.mock("@/lib/onboarding/completeOnboarding", () => ({ completeOnboarding }));
vi.mock("@/components/panel/locations/LocationEditor", () => ({
  LocationEditor: ({ locations }: { locations: { id: string }[] }) => (
    <div data-testid="location-editor">{locations.length} ubicaciones</div>
  ),
}));
vi.mock("@/components/panel/schedule/ScheduleEditor", () => ({
  ScheduleEditor: () => <div data-testid="schedule-editor" />,
}));

const profile = {
  name: "Dr. Luis Fernández",
  specialty: "Pediatría",
  yearsExperience: 14,
  bio: "",
};

const locationWithBlocks = {
  id: "loc-1",
  name: "Consultorio Zabala",
  address: "Av. Arce 123",
  scheduleBlocks: [],
};

describe("OnboardingWizard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("starts on the profile step with Atrás hidden", () => {
    render(
      <OnboardingWizard
        initialProfile={profile}
        locations={[locationWithBlocks]}
      />,
    );

    expect(screen.getByLabelText("Nombre completo")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "← Atrás" }),
    ).not.toBeInTheDocument();
  });

  it("disables Siguiente until the profile is valid", async () => {
    const user = userEvent.setup();
    render(
      <OnboardingWizard
        initialProfile={profile}
        locations={[locationWithBlocks]}
      />,
    );

    await user.clear(screen.getByLabelText("Nombre completo"));
    expect(screen.getByRole("button", { name: "Siguiente" })).toBeDisabled();

    await user.type(screen.getByLabelText("Nombre completo"), "Dra. Ana Ríos");
    expect(screen.getByRole("button", { name: "Siguiente" })).toBeEnabled();
  });

  it("saves the profile and advances to locations", async () => {
    const user = userEvent.setup();
    render(
      <OnboardingWizard
        initialProfile={profile}
        locations={[locationWithBlocks]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Siguiente" }));

    expect(updateDoctorProfile).toHaveBeenCalledWith(profile);
    expect(screen.getByTestId("location-editor")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "← Atrás" })).toBeInTheDocument();
  });

  it("disables Siguiente on the locations step when there are no locations", async () => {
    const user = userEvent.setup();
    render(<OnboardingWizard initialProfile={profile} locations={[]} />);

    await user.click(screen.getByRole("button", { name: "Siguiente" }));

    expect(screen.getByRole("button", { name: "Siguiente" })).toBeDisabled();
  });

  it("advances through schedule to the review step", async () => {
    const user = userEvent.setup();
    render(
      <OnboardingWizard
        initialProfile={profile}
        locations={[locationWithBlocks]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Siguiente" }));
    await user.click(screen.getByRole("button", { name: "Siguiente" }));
    expect(screen.getByTestId("schedule-editor")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Siguiente" }));

    expect(screen.getByText("Dr. Luis Fernández")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Entrar al panel" }),
    ).toBeInTheDocument();
  });

  it("completes onboarding and navigates to appointments", async () => {
    const user = userEvent.setup();
    render(
      <OnboardingWizard
        initialProfile={profile}
        locations={[locationWithBlocks]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Siguiente" }));
    await user.click(screen.getByRole("button", { name: "Siguiente" }));
    await user.click(screen.getByRole("button", { name: "Siguiente" }));
    await user.click(screen.getByRole("button", { name: "Entrar al panel" }));

    expect(completeOnboarding).toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith("/panel/appointments");
  });

  it("returns to the previous step with Atrás", async () => {
    const user = userEvent.setup();
    render(
      <OnboardingWizard
        initialProfile={profile}
        locations={[locationWithBlocks]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Siguiente" }));
    await user.click(screen.getByRole("button", { name: "← Atrás" }));

    expect(screen.getByLabelText("Nombre completo")).toBeInTheDocument();
  });
});

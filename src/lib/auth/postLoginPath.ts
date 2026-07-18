type SessionInfo = {
  role: "ADMIN" | "DOCTOR" | "ASSISTANT";
  doctorOnboarded?: boolean;
};

export function postLoginPath({ role, doctorOnboarded }: SessionInfo): string {
  if (role === "ADMIN") return "/admin";
  if (role === "DOCTOR" && !doctorOnboarded) return "/panel/onboarding";
  return "/panel/appointments";
}

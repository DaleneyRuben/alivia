import { postLoginPath } from "./post-login-path";

type GuardSession = {
  role: "ADMIN" | "DOCTOR" | "ASSISTANT";
  doctorOnboarded?: boolean;
};

const DOCTOR_ONLY_PANEL_ROUTES = [
  "/panel/locations",
  "/panel/history",
  "/panel/account",
  "/panel/onboarding",
];

export function routeGuard(
  pathname: string,
  session: GuardSession | null,
): string | null {
  const isPanel = pathname.startsWith("/panel");
  const isAdmin = pathname.startsWith("/admin");
  const isLogin = pathname === "/login";

  if (!session) {
    return isPanel || isAdmin ? "/login" : null;
  }

  if (isLogin) return postLoginPath(session);

  if (isAdmin && session.role !== "ADMIN") return postLoginPath(session);

  if (isPanel && session.role === "ADMIN") return "/admin";

  if (
    session.role === "ASSISTANT" &&
    DOCTOR_ONLY_PANEL_ROUTES.some((route) => pathname.startsWith(route))
  ) {
    return "/panel/appointments";
  }

  return null;
}

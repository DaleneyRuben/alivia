import { NextResponse, type NextRequest } from "next/server";
import { auth, type SessionRole } from "@/lib/auth";
import { routeGuard } from "@/lib/auth/route-guard";

export default async function proxy(request: NextRequest) {
  const session = await auth();
  const guardSession = session
    ? {
        role: session.user.role as SessionRole,
        doctorOnboarded: session.user.doctorOnboarded,
      }
    : null;

  const redirect = routeGuard(request.nextUrl.pathname, guardSession);
  if (redirect) {
    return NextResponse.redirect(new URL(redirect, request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/panel/:path*", "/admin/:path*", "/login"],
};

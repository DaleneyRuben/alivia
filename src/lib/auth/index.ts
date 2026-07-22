import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { verifyCredentials } from "./verifyCredentials";

export type SessionRole = "ADMIN" | "DOCTOR" | "ASSISTANT";

declare module "next-auth" {
  interface User {
    role: SessionRole;
    doctorOnboarded?: boolean;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      role: SessionRole;
      doctorOnboarded?: boolean;
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string") {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase().trim() },
          include: { doctor: { select: { onboardedAt: true } } },
        });

        if (!(await verifyCredentials(user, password))) return null;

        return {
          id: user!.id,
          email: user!.email,
          role: user!.role,
          doctorOnboarded: user!.doctor
            ? user!.doctor.onboardedAt !== null
            : undefined,
        };
      },
    }),
    // admin-only impersonation (docs/flows/admin.md §3, ADR-0014) — the calling admin's
    // identity is read from their existing session token, never trusted from the client
    Credentials({
      id: "impersonation",
      name: "impersonation",
      credentials: { targetUserId: {} },
      async authorize(credentials, request) {
        const targetUserId = credentials?.targetUserId;
        if (typeof targetUserId !== "string") return null;

        const adminToken = await getToken({
          req: request,
          secret: process.env.AUTH_SECRET,
        });
        if (!adminToken || adminToken.role !== "ADMIN") return null;

        const target = await prisma.user.findUnique({
          where: { id: targetUserId },
          include: { doctor: { select: { onboardedAt: true } } },
        });
        if (!target || !target.active) return null;

        await prisma.impersonationLog.create({
          data: { adminUserId: adminToken.sub as string, targetUserId },
        });

        return {
          id: target.id,
          email: target.email,
          role: target.role,
          doctorOnboarded: target.doctor
            ? target.doctor.onboardedAt !== null
            : undefined,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.doctorOnboarded = user.doctorOnboarded;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub as string;
      session.user.role = token.role as SessionRole;
      session.user.doctorOnboarded = token.doctorOnboarded as
        boolean | undefined;
      return session;
    },
  },
});

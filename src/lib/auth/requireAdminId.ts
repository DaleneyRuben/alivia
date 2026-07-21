import { auth } from "@/lib/auth";

export async function requireAdminId(): Promise<string> {
  const session = await auth();
  if (!session) throw new Error("Not authenticated");
  if (session.user.role !== "ADMIN") throw new Error("Not authorized");

  return session.user.id;
}

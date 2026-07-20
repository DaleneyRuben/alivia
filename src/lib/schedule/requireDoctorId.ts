import { auth } from "@/lib/auth";
import { getDoctorIdForUser } from "./getDoctorIdForUser";

export async function requireDoctorId(): Promise<string> {
  const session = await auth();
  if (!session) throw new Error("Not authenticated");

  const doctorId = await getDoctorIdForUser(session.user.id, session.user.role);
  if (!doctorId) throw new Error("Not authorized");

  return doctorId;
}

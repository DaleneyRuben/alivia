import bcrypt from "bcryptjs";

type CredentialUser = {
  id: string;
  passwordHash: string | null;
  active: boolean;
};

export async function verifyCredentials(
  user: CredentialUser | null,
  password: string,
): Promise<boolean> {
  if (!user || !user.active || !user.passwordHash) return false;
  return bcrypt.compare(password, user.passwordHash);
}

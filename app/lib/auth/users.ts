/**
 * Mock user store for development/demo.
 * No database — seed data lives here.
 * Swap this module for a real DB query (e.g. Prisma) when ready.
 *
 * Caveat: Credentials provider does not include CSRF protection by default.
 * The login action must be called from a server action (POST-only form) to
 * prevent CSRF. Do not expose the authorize endpoint directly to the client.
 */
import bcryptjs from "bcryptjs";

export type UserRole = "regular" | "admin";

interface StoredUser {
  id: string;
  email: string;
  /** bcrypt hash */
  passwordHash: string;
  name: string;
  role: UserRole;
}

// Dev mock credentials — these are not real secrets.
// Replace with real hashed passwords from env/DB for production.
const SEED_USERS: StoredUser[] = [
  {
    id: "1",
    email: "user@sun.example",
    passwordHash: bcryptjs.hashSync("user1234", 10),
    name: "Regular User",
    role: "regular",
  },
  {
    id: "2",
    email: "admin@sun.example",
    passwordHash: bcryptjs.hashSync("admin1234", 10),
    name: "Admin User",
    role: "admin",
  },
];

export interface PublicUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export function findUserByEmail(email: string): StoredUser | undefined {
  return SEED_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

/**
 * Verifies email + password against the mock store.
 * Returns the public user shape (no hash) on success, null on failure.
 */
export async function verifyCredentials(
  email: string,
  password: string
): Promise<PublicUser | null> {
  if (!email || !password) return null;

  const user = findUserByEmail(email);
  if (!user) return null;

  const passwordValid = await bcryptjs.compare(password, user.passwordHash);
  if (!passwordValid) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

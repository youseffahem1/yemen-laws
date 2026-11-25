import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import type { SessionUser, UserRole } from "./roles";
export { ROLE_LABELS_AR, ROLE_PERMISSIONS, hasPermission } from "./roles";
export type { SessionUser, UserRole } from "./roles";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "yemen-legal-encyclopedia-dev-secret-2026-change-in-prod"
);

export const SESSION_COOKIE_NAME = "yle_session";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    title: user.title || "",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return {
      id: Number(payload.id),
      name: String(payload.name),
      email: String(payload.email),
      role: payload.role as UserRole,
      status: String(payload.status || "active"),
      title: payload.title ? String(payload.title) : undefined,
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    const session = await verifySessionToken(token);
    if (!session || session.status !== "active") return null;
    return session;
  } catch {
    return null;
  }
}

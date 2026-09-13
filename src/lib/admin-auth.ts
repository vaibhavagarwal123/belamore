import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { signSession, verifySession } from "@/lib/session";
import { db } from "@/lib/db";

export const ADMIN_COOKIE = "belamore_admin_session";
const ADMIN_SESSION_SECONDS = 60 * 60 * 24 * 7; // 7 days

type AdminSessionPayload = { adminId: string; email: string };

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createAdminSession(adminId: string, email: string) {
  const token = await signSession<AdminSessionPayload>({ adminId, email }, ADMIN_SESSION_SECONDS);
  cookies().set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_SECONDS,
  });
}

export function clearAdminSession() {
  cookies().delete(ADMIN_COOKIE);
}

export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return verifySession<AdminSessionPayload>(token);
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) return null;
  const admin = await db.adminUser.findUnique({ where: { id: session.adminId } });
  return admin;
}

export async function anyAdminExists() {
  const count = await db.adminUser.count();
  return count > 0;
}

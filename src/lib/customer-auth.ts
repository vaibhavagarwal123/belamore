import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { signSession, verifySession } from "@/lib/session";
import { db } from "@/lib/db";

export const CUSTOMER_COOKIE = "belamore_customer_session";
const CUSTOMER_SESSION_SECONDS = 60 * 60 * 24 * 30; // 30 days

type CustomerSessionPayload = { customerId: string; email: string };

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createCustomerSession(customerId: string, email: string) {
  const token = await signSession<CustomerSessionPayload>(
    { customerId, email },
    CUSTOMER_SESSION_SECONDS,
  );
  cookies().set(CUSTOMER_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CUSTOMER_SESSION_SECONDS,
  });
}

export function clearCustomerSession() {
  cookies().delete(CUSTOMER_COOKIE);
}

export async function getCustomerSession(): Promise<CustomerSessionPayload | null> {
  const token = cookies().get(CUSTOMER_COOKIE)?.value;
  if (!token) return null;
  return verifySession<CustomerSessionPayload>(token);
}

export async function requireCustomer() {
  const session = await getCustomerSession();
  if (!session) return null;
  return db.customer.findUnique({ where: { id: session.customerId } });
}

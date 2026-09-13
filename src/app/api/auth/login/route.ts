import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { verifyPassword, createCustomerSession } from "@/lib/customer-auth";

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter your email and password." }, { status: 400 });
  }
  const email = parsed.data.email.toLowerCase().trim();
  const customer = await db.customer.findUnique({ where: { email } });
  if (!customer || !(await verifyPassword(parsed.data.password, customer.passwordHash))) {
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  }
  await createCustomerSession(customer.id, customer.email);
  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { sendMail } from "@/lib/email";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
  }

  const submission = await db.contactSubmission.create({ data: parsed.data });

  await sendMail({
    to: process.env.SMTP_FROM || "hello@belamoregifts.com",
    subject: `New enquiry from ${parsed.data.name}`,
    text: `${parsed.data.message}\n\nFrom: ${parsed.data.name} <${parsed.data.email}> ${parsed.data.phone ?? ""}`,
  }).catch(() => {});

  return NextResponse.json({ ok: true, id: submission.id });
}

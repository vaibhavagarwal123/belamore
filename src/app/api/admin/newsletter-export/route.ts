import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const subscribers = await db.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } });
  const csv = ["email,subscribed_at", ...subscribers.map((s) => `${s.email},${s.createdAt.toISOString()}`)].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=belamore-newsletter-subscribers.csv",
    },
  });
}

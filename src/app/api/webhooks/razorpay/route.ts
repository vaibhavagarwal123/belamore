import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });

  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

  if (signature !== expected) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const event = JSON.parse(rawBody);
  if (event.event === "payment.captured") {
    const orderId = event.payload?.payment?.entity?.notes?.orderId;
    const paymentId = event.payload?.payment?.entity?.id;
    if (orderId) {
      await db.order.update({
        where: { id: orderId },
        data: { status: "PAID", paymentRef: paymentId },
      });
    }
  }

  return NextResponse.json({ received: true });
}

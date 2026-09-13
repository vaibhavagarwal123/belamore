import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req
    .json()
    .catch(() => ({}));

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return NextResponse.json({ error: "Razorpay is not configured." }, { status: 503 });

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expected !== razorpay_signature) {
    return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
  }

  await db.order.update({
    where: { id: orderId },
    data: { status: "PAID", paymentRef: razorpay_payment_id },
  });

  return NextResponse.json({ ok: true });
}

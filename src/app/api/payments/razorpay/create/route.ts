import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getRazorpayClient, isRazorpayConfigured } from "@/lib/payments/razorpay";

export async function POST(req: NextRequest) {
  if (!isRazorpayConfigured()) {
    return NextResponse.json({ error: "Razorpay is not configured yet." }, { status: 503 });
  }
  const { orderId } = await req.json().catch(() => ({}));
  const order = await db.order.findUnique({ where: { id: orderId } });
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  const razorpay = getRazorpayClient()!;
  const rpOrder = await razorpay.orders.create({
    amount: order.totalPaise,
    currency: "INR",
    receipt: order.orderNumber,
    notes: { orderId: order.id },
  });

  return NextResponse.json({
    keyId: process.env.RAZORPAY_KEY_ID,
    razorpayOrderId: rpOrder.id,
    amount: order.totalPaise,
    orderNumber: order.orderNumber,
  });
}

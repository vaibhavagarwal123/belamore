import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getStripeClient, isStripeConfigured } from "@/lib/payments/stripe";

export async function POST(req: NextRequest) {
  if (!isStripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe webhook not configured." }, { status: 503 });
  }
  const stripe = getStripeClient()!;
  const signature = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature!, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return NextResponse.json({ error: `Webhook signature invalid: ${err}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as { metadata?: { orderId?: string }; payment_intent?: string };
    const orderId = session.metadata?.orderId;
    if (orderId) {
      await db.order.update({
        where: { id: orderId },
        data: { status: "PAID", paymentRef: session.payment_intent ?? undefined },
      });
    }
  }

  return NextResponse.json({ received: true });
}

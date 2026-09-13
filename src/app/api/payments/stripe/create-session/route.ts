import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getStripeClient, isStripeConfigured } from "@/lib/payments/stripe";

export async function POST(req: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Stripe is not configured yet." }, { status: 503 });
  }
  const { orderId } = await req.json().catch(() => ({}));
  const order = await db.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  const stripe = getStripeClient()!;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  let discounts: { coupon: string }[] | undefined;
  if (order.discountPaise > 0) {
    const coupon = await stripe.coupons.create({
      amount_off: order.discountPaise,
      currency: "inr",
      duration: "once",
      name: "Belamore discount",
    });
    discounts = [{ coupon: coupon.id }];
  }

  const session = await stripe.checkout.sessions.create({
    discounts,
    mode: "payment",
    payment_method_types: ["card"],
    line_items: order.items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "inr",
        unit_amount: item.unitPricePaise,
        product_data: { name: item.nameSnapshot },
      },
    })),
    shipping_options:
      order.shippingPaise > 0
        ? [
            {
              shipping_rate_data: {
                type: "fixed_amount",
                fixed_amount: { amount: order.shippingPaise, currency: "inr" },
                display_name: "Shipping",
              },
            },
          ]
        : undefined,
    metadata: { orderId: order.id },
    success_url: `${siteUrl}/checkout/success?order=${order.id}`,
    cancel_url: `${siteUrl}/checkout?cancelled=1`,
  });

  return NextResponse.json({ url: session.url });
}

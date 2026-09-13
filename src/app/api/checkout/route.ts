import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { generateOrderNumber } from "@/lib/orders";
import { evaluateDiscountCode } from "@/lib/discount";
import { evaluateGiftCard } from "@/lib/gift-card";
import { getCustomerSession } from "@/lib/customer-auth";
import { FLAT_SHIPPING_PAISE, FREE_SHIPPING_THRESHOLD_PAISE } from "@/lib/constants";

const schema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        variantId: z.string().optional(),
        quantity: z.number().int().min(1).max(50),
      }),
    )
    .min(1),
  shipping: z.object({
    fullName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(6),
    line1: z.string().min(1),
    line2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    postalCode: z.string().min(3),
    country: z.string().min(1).default("India"),
  }),
  discountCode: z.string().optional(),
  giftCardCode: z.string().optional(),
  paymentProvider: z.enum(["RAZORPAY", "STRIPE", "COD"]),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checkout data.", details: parsed.error.flatten() }, { status: 400 });
  }
  const { items, shipping, discountCode, giftCardCode, paymentProvider } = parsed.data;

  const products = await db.product.findMany({
    where: { id: { in: items.map((i) => i.productId) } },
    include: { images: { take: 1, orderBy: { sortOrder: "asc" } }, variants: true },
  });

  let subtotalPaise = 0;
  const orderItemsData: {
    productId: string;
    variantLabel?: string;
    nameSnapshot: string;
    imageSnapshot?: string;
    unitPricePaise: number;
    quantity: number;
  }[] = [];
  const stockUpdates: { type: "product" | "variant"; id: string; quantity: number }[] = [];

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product || !product.isActive) {
      return NextResponse.json({ error: `A product in your bag is no longer available.` }, { status: 400 });
    }
    let unitPrice = product.priceInPaise;
    let stock = product.stock;
    let variantLabel: string | undefined;

    if (item.variantId) {
      const variant = product.variants.find((v) => v.id === item.variantId);
      if (!variant) {
        return NextResponse.json({ error: `Selected option is unavailable.` }, { status: 400 });
      }
      unitPrice = variant.priceInPaise;
      stock = variant.stock;
      variantLabel = variant.label;
    }

    if (stock < item.quantity) {
      return NextResponse.json(
        { error: `Only ${stock} left of "${product.name}". Please adjust the quantity.` },
        { status: 400 },
      );
    }

    subtotalPaise += unitPrice * item.quantity;
    orderItemsData.push({
      productId: product.id,
      variantLabel,
      nameSnapshot: product.name,
      imageSnapshot: product.images[0]?.url,
      unitPricePaise: unitPrice,
      quantity: item.quantity,
    });
    stockUpdates.push(
      item.variantId
        ? { type: "variant", id: item.variantId, quantity: item.quantity }
        : { type: "product", id: product.id, quantity: item.quantity },
    );
  }

  let discountPaise = 0;
  let discountCodeId: string | undefined;
  if (discountCode) {
    const result = await evaluateDiscountCode(discountCode, subtotalPaise);
    if (!result.valid) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    discountPaise = result.amountOffPaise;
    discountCodeId = result.discount.id;
  }

  const shippingPaise =
    subtotalPaise - discountPaise >= FREE_SHIPPING_THRESHOLD_PAISE ? 0 : FLAT_SHIPPING_PAISE;
  const preGiftCardTotal = Math.max(0, subtotalPaise - discountPaise) + shippingPaise;

  let giftCardPaise = 0;
  let giftCardId: string | undefined;
  if (giftCardCode) {
    const result = await evaluateGiftCard(giftCardCode);
    if (!result.valid) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    giftCardPaise = Math.min(result.card.balancePaise, preGiftCardTotal);
    giftCardId = result.card.id;
  }

  const totalPaise = preGiftCardTotal - giftCardPaise;

  const customerSession = await getCustomerSession();

  const order = await db.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerId: customerSession?.customerId,
        guestEmail: shipping.email,
        guestName: shipping.fullName,
        guestPhone: shipping.phone,
        shippingLine1: shipping.line1,
        shippingLine2: shipping.line2,
        shippingCity: shipping.city,
        shippingState: shipping.state,
        shippingPostal: shipping.postalCode,
        shippingCountry: shipping.country,
        subtotalPaise,
        discountPaise,
        shippingPaise,
        totalPaise,
        discountCodeId,
        giftCardPaise,
        giftCardId,
        paymentProvider,
        status: totalPaise === 0 || paymentProvider === "COD" ? "PROCESSING" : "PENDING_PAYMENT",
        items: { create: orderItemsData },
      },
    });

    for (const update of stockUpdates) {
      if (update.type === "product") {
        await tx.product.update({
          where: { id: update.id },
          data: { stock: { decrement: update.quantity } },
        });
      } else {
        await tx.productVariant.update({
          where: { id: update.id },
          data: { stock: { decrement: update.quantity } },
        });
      }
    }

    if (discountCodeId) {
      await tx.discountCode.update({
        where: { id: discountCodeId },
        data: { timesUsed: { increment: 1 } },
      });
    }

    if (giftCardId && giftCardPaise > 0) {
      await tx.giftCard.update({
        where: { id: giftCardId },
        data: { balancePaise: { decrement: giftCardPaise } },
      });
    }

    return created;
  });

  return NextResponse.json({
    orderId: order.id,
    orderNumber: order.orderNumber,
    totalPaise: order.totalPaise,
    status: order.status,
  });
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { InfinityMark } from "@/components/logo";
import { formatPaise } from "@/lib/money";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/constants";

export const metadata = { title: "Order Confirmed" };

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  if (!searchParams.order) notFound();
  const order = await db.order.findUnique({
    where: { id: searchParams.order },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <div className="pt-32 pb-24">
      <Container className="max-w-2xl text-center">
        <InfinityMark className="mx-auto mb-6 h-10 w-24" />
        <h1 className="font-display text-3xl text-ink-700 sm:text-4xl">
          Thank You, Your Order is Confirmed
        </h1>
        <p className="mt-4 text-ink-500">
          Order <span className="font-medium text-ink-700">{order.orderNumber}</span> —{" "}
          {ORDER_STATUS_LABELS[order.status as OrderStatus]}. A confirmation has been sent to your
          email.
        </p>

        <div className="mt-10 rounded-2xl bg-beige-100/60 p-6 text-left">
          <ul className="divide-y divide-ink-600/10">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between py-3 text-sm">
                <span>
                  {item.nameSnapshot} {item.variantLabel ? `(${item.variantLabel})` : ""} ×{" "}
                  {item.quantity}
                </span>
                <span>{formatPaise(item.unitPricePaise * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-ink-600/10 pt-3 font-display text-lg text-ink-700">
            <span>Total Paid</span>
            <span>{formatPaise(order.totalPaise)}</span>
          </div>
        </div>

        <Button href="/collections" variant="gold" className="mt-10">
          Continue Exploring the Palace
        </Button>
      </Container>
    </div>
  );
}

import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatPaise } from "@/lib/money";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/constants";
import { updateOrderStatusAction } from "@/lib/admin-orders-actions";

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const order = await db.order.findUnique({
    where: { id: params.id },
    include: { items: true, discountCode: true, customer: true },
  });
  if (!order) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="mb-2 font-display text-3xl text-ink-700">{order.orderNumber}</h1>
      <p className="mb-8 text-sm text-ink-400">
        Placed {new Date(order.createdAt).toLocaleString("en-IN")}
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-ink-600/10 bg-white p-5">
          <h2 className="mb-3 font-display text-lg text-ink-700">Customer</h2>
          <p className="text-sm text-ink-600">{order.guestName}</p>
          <p className="text-sm text-ink-500">{order.guestEmail}</p>
          <p className="text-sm text-ink-500">{order.guestPhone}</p>
        </div>
        <div className="rounded-2xl border border-ink-600/10 bg-white p-5">
          <h2 className="mb-3 font-display text-lg text-ink-700">Shipping Address</h2>
          <p className="text-sm text-ink-600">{order.shippingLine1}</p>
          {order.shippingLine2 && <p className="text-sm text-ink-600">{order.shippingLine2}</p>}
          <p className="text-sm text-ink-600">
            {order.shippingCity}, {order.shippingState} {order.shippingPostal}
          </p>
          <p className="text-sm text-ink-600">{order.shippingCountry}</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-ink-600/10 bg-white p-5">
        <h2 className="mb-3 font-display text-lg text-ink-700">Items</h2>
        <ul className="divide-y divide-ink-600/10">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between py-3 text-sm">
              <span>{item.nameSnapshot} {item.variantLabel ? `(${item.variantLabel})` : ""} × {item.quantity}</span>
              <span>{formatPaise(item.unitPricePaise * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 space-y-1 border-t border-ink-600/10 pt-3 text-sm text-ink-600">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatPaise(order.subtotalPaise)}</span></div>
          {order.discountPaise > 0 && (
            <div className="flex justify-between text-gold-600">
              <span>Discount {order.discountCode ? `(${order.discountCode.code})` : ""}</span>
              <span>−{formatPaise(order.discountPaise)}</span>
            </div>
          )}
          <div className="flex justify-between"><span>Shipping</span><span>{order.shippingPaise === 0 ? "Free" : formatPaise(order.shippingPaise)}</span></div>
          {order.giftCardPaise > 0 && (
            <div className="flex justify-between text-gold-600">
              <span>Gift Card</span>
              <span>−{formatPaise(order.giftCardPaise)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-ink-600/10 pt-2 font-display text-lg text-ink-700">
            <span>Total</span><span>{formatPaise(order.totalPaise)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-ink-600/10 bg-white p-5">
        <h2 className="mb-3 font-display text-lg text-ink-700">Order Status</h2>
        <p className="mb-3 text-sm text-ink-500">
          Payment method: {order.paymentProvider} {order.paymentRef ? `· Ref: ${order.paymentRef}` : ""}
        </p>
        <form action={updateOrderStatusAction} className="flex items-center gap-3">
          <input type="hidden" name="id" value={order.id} />
          <select name="status" defaultValue={order.status} className="input w-auto">
            {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <button className="rounded-full bg-gold-500 px-5 py-2.5 text-sm text-white hover:bg-gold-600">
            Update Status
          </button>
        </form>
        {order.status === "CANCELLED" && (
          <p className="mt-2 text-xs text-ink-400">Cancelling an order automatically restocks its items.</p>
        )}
      </div>
    </div>
  );
}

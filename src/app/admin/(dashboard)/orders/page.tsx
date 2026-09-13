import Link from "next/link";
import { db } from "@/lib/db";
import { formatPaise } from "@/lib/money";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/constants";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const orders = await db.order.findMany({
    where: searchParams.status ? { status: searchParams.status } : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const statuses = Object.keys(ORDER_STATUS_LABELS);

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-ink-700">Orders</h1>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link href="/admin/orders" className={`rounded-full px-3 py-1 text-xs ${!searchParams.status ? "bg-gold-100 text-ink-700" : "bg-beige-100 text-ink-500"}`}>
          All
        </Link>
        {statuses.map((s) => (
          <Link key={s} href={`/admin/orders?status=${s}`} className={`rounded-full px-3 py-1 text-xs ${searchParams.status === s ? "bg-gold-100 text-ink-700" : "bg-beige-100 text-ink-500"}`}>
            {ORDER_STATUS_LABELS[s as OrderStatus]}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-ink-600/10 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-600/10 text-left text-xs uppercase tracking-wide text-ink-400">
              <th className="p-4">Order</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Date</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-ink-600/5 last:border-0">
                <td className="p-4">
                  <Link href={`/admin/orders/${o.id}`} className="text-ink-700 hover:text-gold-600">{o.orderNumber}</Link>
                </td>
                <td className="p-4 text-ink-500">{o.guestName}</td>
                <td className="p-4 text-ink-500">
                  {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td className="p-4 text-ink-600">{formatPaise(o.totalPaise)}</td>
                <td className="p-4">
                  <span className="rounded-full bg-beige-100 px-2.5 py-1 text-xs text-ink-600">
                    {ORDER_STATUS_LABELS[o.status as OrderStatus]}
                  </span>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-ink-400">No orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

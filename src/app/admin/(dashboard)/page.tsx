import Link from "next/link";
import { getDashboardStats } from "@/lib/admin-analytics";
import { SalesChart } from "@/components/admin/sales-chart";
import { formatPaise } from "@/lib/money";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { label: "Revenue (This Month)", value: formatPaise(stats.thisMonthRevenuePaise) },
    { label: "Revenue (Last 365 Days)", value: formatPaise(stats.totalRevenuePaise) },
    { label: "Orders (Last 365 Days)", value: stats.totalOrders.toString() },
    { label: "Average Order Value", value: formatPaise(stats.avgOrderValuePaise) },
  ];

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl text-ink-700">Dashboard</h1>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-ink-600/10 bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-ink-400">{c.label}</p>
            <p className="mt-2 font-display text-2xl text-ink-700">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <SalesChart series={stats.series} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-ink-600/10 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg text-ink-700">Low Stock Alerts</h2>
            <Link href="/admin/products" className="text-xs text-gold-600 hover:underline">
              Manage products →
            </Link>
          </div>
          {stats.lowStock.length === 0 ? (
            <p className="text-sm text-ink-400">Everything is well stocked.</p>
          ) : (
            <ul className="space-y-2">
              {stats.lowStock.map((p) => (
                <li key={p.id} className="flex justify-between text-sm">
                  <Link href={`/admin/products/${p.id}`} className="text-ink-600 hover:text-gold-600">
                    {p.name}
                  </Link>
                  <span className="text-blush-300">{p.stock} left</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-ink-600/10 bg-white p-6">
          <h2 className="mb-4 font-display text-lg text-ink-700">Quick Stats</h2>
          <ul className="space-y-3 text-sm text-ink-600">
            <li className="flex justify-between"><span>Active Products</span><span>{stats.productCount}</span></li>
            <li className="flex justify-between"><span>Newsletter Subscribers</span><span>{stats.subscriberCount}</span></li>
            <li className="flex justify-between">
              <span>Orders Awaiting Payment</span>
              <Link href="/admin/orders" className="text-gold-600 hover:underline">{stats.pendingOrders}</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

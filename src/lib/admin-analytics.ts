import { db } from "@/lib/db";

const REVENUE_STATUSES = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"];

export async function getDashboardStats() {
  const since = new Date();
  since.setDate(since.getDate() - 365);

  const [orders, productCount, lowStock, subscriberCount, pendingOrders] = await Promise.all([
    db.order.findMany({
      where: { createdAt: { gte: since }, status: { in: REVENUE_STATUSES } },
      select: { createdAt: true, totalPaise: true },
      orderBy: { createdAt: "asc" },
    }),
    db.product.count({ where: { isActive: true } }),
    db.product.findMany({
      where: { isActive: true, stock: { lte: 5 } },
      select: { id: true, name: true, stock: true },
      take: 10,
      orderBy: { stock: "asc" },
    }),
    db.newsletterSubscriber.count(),
    db.order.count({ where: { status: "PENDING_PAYMENT" } }),
  ]);

  const byDay = new Map<string, { revenuePaise: number; orders: number }>();
  for (const order of orders) {
    const key = order.createdAt.toISOString().slice(0, 10);
    const existing = byDay.get(key) ?? { revenuePaise: 0, orders: 0 };
    existing.revenuePaise += order.totalPaise;
    existing.orders += 1;
    byDay.set(key, existing);
  }

  const series = Array.from(byDay.entries())
    .map(([date, v]) => ({ date, ...v }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const totalRevenuePaise = orders.reduce((sum, o) => sum + o.totalPaise, 0);
  const totalOrders = orders.length;
  const avgOrderValuePaise = totalOrders > 0 ? Math.round(totalRevenuePaise / totalOrders) : 0;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const thisMonthRevenue = orders
    .filter((o) => o.createdAt >= startOfMonth)
    .reduce((sum, o) => sum + o.totalPaise, 0);

  return {
    series,
    totalRevenuePaise,
    totalOrders,
    avgOrderValuePaise,
    thisMonthRevenuePaise: thisMonthRevenue,
    productCount,
    lowStock,
    subscriberCount,
    pendingOrders,
  };
}

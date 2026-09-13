import { requireCustomer } from "@/lib/customer-auth";
import { db } from "@/lib/db";
import { Container } from "@/components/ui/container";
import { AuthForms } from "@/components/account/auth-forms";
import { LogoutButton } from "@/components/account/logout-button";
import { formatPaise } from "@/lib/money";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/constants";

export const metadata = { title: "My Account" };

export default async function AccountPage() {
  const customer = await requireCustomer();

  if (!customer) {
    return (
      <div className="pt-32 pb-24">
        <Container>
          <h1 className="mb-10 text-center font-display text-4xl text-ink-700">My Account</h1>
          <AuthForms />
        </Container>
      </div>
    );
  }

  const orders = await db.order.findMany({
    where: { customerId: customer.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div className="pt-32 pb-24">
      <Container>
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl text-ink-700">Welcome, {customer.name}</h1>
            <p className="mt-1 text-ink-500">{customer.email}</p>
          </div>
          <LogoutButton />
        </div>

        <h2 className="mb-4 font-display text-xl text-ink-700">Order History</h2>
        {orders.length === 0 ? (
          <p className="text-ink-400">You haven&rsquo;t placed an order yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-ink-600/10 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-ink-700">{order.orderNumber}</span>
                  <span className="rounded-full bg-beige-100 px-3 py-1 text-xs text-ink-600">
                    {ORDER_STATUS_LABELS[order.status as OrderStatus]}
                  </span>
                  <span className="text-sm text-ink-500">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="font-display text-lg text-ink-700">{formatPaise(order.totalPaise)}</span>
                </div>
                <ul className="mt-3 text-sm text-ink-500">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.nameSnapshot} × {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

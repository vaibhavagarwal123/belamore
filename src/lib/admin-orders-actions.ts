"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdminOrRedirect } from "@/lib/admin-actions";
import type { OrderStatus } from "@/lib/constants";

export async function updateOrderStatusAction(formData: FormData) {
  await requireAdminOrRedirect();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "") as OrderStatus;
  const order = await db.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) return;

  if (status === "CANCELLED" && order.status !== "CANCELLED") {
    // Restock cancelled orders so inventory stays accurate.
    for (const item of order.items) {
      await db.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      }).catch(() => {});
    }
  }

  await db.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}

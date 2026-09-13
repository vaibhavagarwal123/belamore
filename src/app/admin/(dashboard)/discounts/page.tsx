import { db } from "@/lib/db";
import { DiscountsManager } from "@/components/admin/discounts-manager";

export default async function AdminDiscountsPage() {
  const discounts = await db.discountCode.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="mb-8 font-display text-3xl text-ink-700">Discounts & Offers</h1>
      <DiscountsManager discounts={discounts} />
    </div>
  );
}

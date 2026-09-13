import { db } from "@/lib/db";
import { CategoriesManager } from "@/components/admin/categories-manager";

export default async function AdminCategoriesPage() {
  const categories = await db.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl text-ink-700">Categories</h1>
      <CategoriesManager categories={categories} />
    </div>
  );
}

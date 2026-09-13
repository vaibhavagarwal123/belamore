import { db } from "@/lib/db";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  const categories = await db.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });
  return (
    <div>
      <h1 className="mb-8 font-display text-3xl text-ink-700">Add Product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}

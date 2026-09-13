import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProductForm } from "@/components/admin/product-form";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, categories] = await Promise.all([
    db.product.findUnique({
      where: { id: params.id },
      include: { images: { orderBy: { sortOrder: "asc" } }, variants: true },
    }),
    db.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl text-ink-700">Edit Product</h1>
      <ProductForm categories={categories} product={product} />
    </div>
  );
}

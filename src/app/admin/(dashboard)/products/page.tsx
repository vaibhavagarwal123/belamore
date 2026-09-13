import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { formatPaise } from "@/lib/money";
import { deleteProductAction } from "@/lib/admin-catalog-actions";

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, images: { take: 1, orderBy: { sortOrder: "asc" } } },
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink-700">Products ({products.length})</h1>
        <Link href="/admin/products/new" className="rounded-full bg-gold-500 px-5 py-2.5 text-sm text-white hover:bg-gold-600">
          + Add Product
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-ink-600/10 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-600/10 text-left text-xs uppercase tracking-wide text-ink-400">
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-ink-600/5 last:border-0">
                <td className="flex items-center gap-3 p-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-marble-100">
                    {p.images[0] && <Image src={p.images[0].url} alt={p.name} fill className="object-cover" />}
                  </div>
                  <Link href={`/admin/products/${p.id}`} className="text-ink-700 hover:text-gold-600">
                    {p.name}
                  </Link>
                </td>
                <td className="p-4 text-ink-500">{p.category.name}</td>
                <td className="p-4 text-ink-600">{formatPaise(p.priceInPaise)}</td>
                <td className={`p-4 ${p.stock <= 5 ? "text-blush-300" : "text-ink-600"}`}>{p.stock}</td>
                <td className="p-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs ${p.isActive ? "bg-sage-100 text-ink-700" : "bg-beige-100 text-ink-400"}`}>
                    {p.isActive ? "Active" : "Hidden"}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Link href={`/admin/products/${p.id}`} className="mr-3 text-xs text-gold-600 hover:underline">Edit</Link>
                  <form action={deleteProductAction} className="inline">
                    <input type="hidden" name="id" value={p.id} />
                    <button className="text-xs text-blush-300 hover:underline">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { CategoryForm } from "@/components/admin/category-form";
import { deleteCategoryAction } from "@/lib/admin-catalog-actions";

type Category = {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  heroImage: string | null;
  sortOrder: number;
  isActive: boolean;
  _count: { products: number };
};

export function CategoriesManager({ categories }: { categories: Category[] }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setCreating((v) => !v)}
          className="rounded-full bg-gold-500 px-5 py-2.5 text-sm text-white hover:bg-gold-600"
        >
          {creating ? "Close" : "+ Add Category"}
        </button>
      </div>

      {creating && <CategoryForm onDone={() => setCreating(false)} />}

      {categories.map((cat) =>
        editing === cat.id ? (
          <CategoryForm key={cat.id} category={cat} onDone={() => setEditing(null)} />
        ) : (
          <div key={cat.id} className="flex items-center justify-between rounded-2xl border border-ink-600/10 bg-white p-5">
            <div>
              <p className="font-display text-lg text-ink-700">{cat.name}</p>
              <p className="text-sm text-ink-500">{cat.tagline}</p>
              <p className="mt-1 text-xs text-ink-400">
                {cat._count.products} products · {cat.isActive ? "Active" : "Hidden"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setEditing(cat.id)} className="text-sm text-gold-600 hover:underline">
                Edit
              </button>
              <form action={deleteCategoryAction}>
                <input type="hidden" name="id" value={cat.id} />
                <button
                  className="text-sm text-blush-300 hover:underline disabled:opacity-40"
                  disabled={cat._count.products > 0}
                  title={cat._count.products > 0 ? "Move or delete products in this category first" : ""}
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        ),
      )}
    </div>
  );
}

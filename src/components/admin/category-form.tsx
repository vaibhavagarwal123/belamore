"use client";

import { useFormState } from "react-dom";
import { upsertCategoryAction } from "@/lib/admin-catalog-actions";
import type { ActionState } from "@/lib/admin-actions";
import { SubmitButton } from "@/components/admin/form-status";

export function CategoryForm({
  category,
  onDone,
}: {
  category?: {
    id: string;
    name: string;
    tagline: string | null;
    description: string | null;
    heroImage: string | null;
    sortOrder: number;
    isActive: boolean;
  };
  onDone?: () => void;
}) {
  const [state, formAction] = useFormState<ActionState, FormData>(upsertCategoryAction, null);

  return (
    <form action={formAction} className="space-y-3 rounded-2xl border border-ink-600/10 bg-white p-5">
      {category && <input type="hidden" name="id" value={category.id} />}
      <input name="name" required defaultValue={category?.name} placeholder="Category name" className="input" />
      <input name="tagline" defaultValue={category?.tagline ?? ""} placeholder="Tagline" className="input" />
      <textarea name="description" rows={2} defaultValue={category?.description ?? ""} placeholder="Description" className="input" />
      <input name="heroImage" defaultValue={category?.heroImage ?? ""} placeholder="Hero image URL (e.g. /products/img-002.jpg)" className="input" />
      <div className="flex items-center gap-4">
        <input name="sortOrder" type="number" defaultValue={category?.sortOrder ?? 0} placeholder="Sort order" className="input w-32" />
        <label className="flex items-center gap-2 text-sm text-ink-600">
          <input type="checkbox" name="isActive" defaultChecked={category?.isActive ?? true} /> Active
        </label>
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-gold-600">{state.success}</p>}
      <div className="flex gap-3">
        <SubmitButton>{category ? "Save Category" : "Add Category"}</SubmitButton>
        {onDone && (
          <button type="button" onClick={onDone} className="text-sm text-ink-400 hover:underline">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

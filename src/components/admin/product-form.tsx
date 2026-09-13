"use client";

import { useRef, useState } from "react";
import { useFormState } from "react-dom";
import { upsertProductAction } from "@/lib/admin-catalog-actions";
import type { ActionState } from "@/lib/admin-actions";
import { SubmitButton } from "@/components/admin/form-status";

type Variant = { label: string; price: string; stock: string };

export function ProductForm({
  categories,
  product,
}: {
  categories: { id: string; name: string }[];
  product?: {
    id: string;
    name: string;
    categoryId: string;
    priceInPaise: number;
    compareAtPaise: number | null;
    sku: string;
    stock: number;
    material: string | null;
    shortDescription: string | null;
    description: string;
    careInstructions: string | null;
    isFeatured: boolean;
    isActive: boolean;
    images: { url: string }[];
    variants: { label: string; priceInPaise: number; stock: number }[];
  };
}) {
  const [state, formAction] = useFormState<ActionState, FormData>(upsertProductAction, null);
  const [variants, setVariants] = useState<Variant[]>(
    product?.variants.map((v) => ({
      label: v.label,
      price: (v.priceInPaise / 100).toString(),
      stock: v.stock.toString(),
    })) ?? [],
  );
  const [uploading, setUploading] = useState(false);
  const imagesRef = useRef<HTMLTextAreaElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok && imagesRef.current) {
        imagesRef.current.value = imagesRef.current.value
          ? `${imagesRef.current.value}\n${data.url}`
          : data.url;
      }
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <form action={formAction} className="max-w-3xl space-y-8">
      {product && <input type="hidden" name="id" value={product.id} />}
      <input
        type="hidden"
        name="variantsJson"
        value={JSON.stringify(variants.filter((v) => v.label))}
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input name="name" required defaultValue={product?.name} placeholder="Product name" className="input sm:col-span-2" />
        <select name="categoryId" required defaultValue={product?.categoryId} className="input">
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input name="sku" required defaultValue={product?.sku} placeholder="SKU (unique)" className="input" />
        <input name="price" type="number" step="0.01" required defaultValue={product ? product.priceInPaise / 100 : ""} placeholder="Price (₹)" className="input" />
        <input name="compareAt" type="number" step="0.01" defaultValue={product?.compareAtPaise ? product.compareAtPaise / 100 : ""} placeholder="Compare-at price (₹, optional)" className="input" />
        <input name="stock" type="number" required defaultValue={product?.stock ?? 25} placeholder="Stock quantity" className="input" />
        <input name="material" defaultValue={product?.material ?? ""} placeholder="Material (e.g. White Marble)" className="input" />
      </section>

      <section className="space-y-4">
        <input name="shortDescription" defaultValue={product?.shortDescription ?? ""} placeholder="Short description (shown on product cards)" className="input" />
        <textarea name="description" required rows={4} defaultValue={product?.description} placeholder="Full description" className="input" />
        <textarea name="careInstructions" rows={3} defaultValue={product?.careInstructions ?? ""} placeholder="Care instructions" className="input" />
      </section>

      <section>
        <label className="mb-2 block text-sm font-medium text-ink-700">Images (one URL per line, first = main image)</label>
        <textarea
          ref={imagesRef}
          name="images"
          rows={4}
          defaultValue={product?.images.map((i) => i.url).join("\n")}
          placeholder={"/products/img-000.jpg\n/uploads/your-photo.jpg"}
          className="input font-mono text-xs"
        />
        <div className="mt-2 flex items-center gap-3">
          <label className="cursor-pointer rounded-full border border-ink-600/20 px-4 py-2 text-xs text-ink-600 hover:border-gold-500">
            {uploading ? "Uploading..." : "Upload an image"}
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
          <span className="text-xs text-ink-400">Uploads are saved on this server — for production hosting, consider an image CDN.</span>
        </div>
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-ink-700">Variants (e.g. sizes) — optional</label>
          <button
            type="button"
            onClick={() => setVariants((v) => [...v, { label: "", price: "", stock: "20" }])}
            className="text-xs text-gold-600 hover:underline"
          >
            + Add variant
          </button>
        </div>
        <div className="space-y-2">
          {variants.map((v, i) => (
            <div key={i} className="flex gap-2">
              <input
                placeholder="Label (e.g. Small)"
                value={v.label}
                onChange={(e) => setVariants((vs) => vs.map((x, idx) => (idx === i ? { ...x, label: e.target.value } : x)))}
                className="input"
              />
              <input
                placeholder="Price (₹)"
                type="number"
                step="0.01"
                value={v.price}
                onChange={(e) => setVariants((vs) => vs.map((x, idx) => (idx === i ? { ...x, price: e.target.value } : x)))}
                className="input"
              />
              <input
                placeholder="Stock"
                type="number"
                value={v.stock}
                onChange={(e) => setVariants((vs) => vs.map((x, idx) => (idx === i ? { ...x, stock: e.target.value } : x)))}
                className="input"
              />
              <button type="button" onClick={() => setVariants((vs) => vs.filter((_, idx) => idx !== i))} className="text-blush-300">
                ✕
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-ink-600">
          <input type="checkbox" name="isFeatured" defaultChecked={product?.isFeatured} /> Featured on homepage
        </label>
        <label className="flex items-center gap-2 text-sm text-ink-600">
          <input type="checkbox" name="isActive" defaultChecked={product?.isActive ?? true} /> Visible on storefront
        </label>
      </section>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton>{product ? "Save Changes" : "Create Product"}</SubmitButton>
    </form>
  );
}

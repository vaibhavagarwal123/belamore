"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { formatPaise } from "@/lib/money";
import { Button } from "@/components/ui/button";

export type VariantOption = {
  id: string;
  label: string;
  priceInPaise: number;
  stock: number;
};

export function AddToCart({
  productId,
  slug,
  name,
  image,
  basePriceInPaise,
  baseStock,
  variants,
}: {
  productId: string;
  slug: string;
  name: string;
  image: string;
  basePriceInPaise: number;
  baseStock: number;
  variants: VariantOption[];
}) {
  const [variantId, setVariantId] = useState<string | undefined>(variants[0]?.id);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const selectedVariant = variants.find((v) => v.id === variantId);
  const price = selectedVariant?.priceInPaise ?? basePriceInPaise;
  const stock = selectedVariant?.stock ?? baseStock;
  const outOfStock = stock <= 0;

  function handleAdd() {
    addItem({
      productId,
      slug,
      name,
      image,
      unitPricePaise: price,
      quantity,
      variantLabel: selectedVariant?.label,
      variantId: selectedVariant?.id,
      maxStock: stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div>
      <div className="text-3xl font-display text-ink-700">{formatPaise(price)}</div>

      {variants.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 text-xs uppercase tracking-widest text-ink-500">Choose an option</p>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setVariantId(v.id)}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  v.id === variantId
                    ? "border-gold-500 bg-gold-50 text-ink-700"
                    : "border-ink-600/20 text-ink-500 hover:border-gold-400"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center gap-4">
        <div className="flex items-center rounded-full border border-ink-600/20">
          <button
            className="px-3.5 py-2 text-ink-600"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            −
          </button>
          <span className="w-8 text-center text-sm">{quantity}</span>
          <button
            className="px-3.5 py-2 text-ink-600"
            onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
          >
            +
          </button>
        </div>
        <span className="text-xs text-ink-400">
          {outOfStock ? "Out of stock" : `${stock} in stock`}
        </span>
      </div>

      <Button
        variant="gold"
        className="mt-6 w-full sm:w-auto"
        disabled={outOfStock}
        onClick={handleAdd}
      >
        {added ? "Added to Bag ✓" : outOfStock ? "Out of Stock" : "Add to Bag"}
      </Button>
    </div>
  );
}

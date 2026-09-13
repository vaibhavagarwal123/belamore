"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore, cartSubtotal } from "@/lib/cart-store";
import { formatPaise } from "@/lib/money";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCartStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="pt-32 pb-24">
      <Container>
        <h1 className="mb-10 font-display text-4xl text-ink-700">Your Bag</h1>

        {items.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-ink-500">
              Your bag is empty. The palace has a great deal more to show you.
            </p>
            <Button href="/collections" variant="outline" className="mt-6">
              Explore Collections
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ul className="divide-y divide-ink-600/10">
                {items.map((item) => (
                  <li key={item.productId + (item.variantId ?? "")} className="flex gap-5 py-6">
                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-marble-100">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <Link href={`/products/${item.slug}`} className="font-display text-lg text-ink-700 hover:text-gold-600">
                          {item.name}
                        </Link>
                        {item.variantLabel && (
                          <p className="text-sm text-ink-400">{item.variantLabel}</p>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-ink-600/20">
                          <button
                            className="px-3 py-1.5 text-ink-600"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <button
                            className="px-3 py-1.5 text-ink-600"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId, item.variantId)}
                          className="text-xs text-ink-400 underline hover:text-blush-300"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="text-right font-medium text-ink-700">
                      {formatPaise(item.unitPricePaise * item.quantity)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-beige-100/60 p-6 h-fit">
              <div className="flex items-center justify-between text-ink-700">
                <span>Subtotal</span>
                <span className="font-display text-xl">{formatPaise(cartSubtotal(items))}</span>
              </div>
              <p className="mt-2 text-xs text-ink-400">Shipping & discounts calculated at checkout.</p>
              <Button href="/checkout" variant="gold" className="mt-6 w-full">
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

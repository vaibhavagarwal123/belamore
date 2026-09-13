"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCartStore, cartSubtotal } from "@/lib/cart-store";
import { formatPaise } from "@/lib/money";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const { items, isOpen, setOpen, removeItem, updateQuantity } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(false), [pathname, setOpen]);

  if (!mounted) return null;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink-800/30 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md transform bg-beige-50 shadow-2xl transition-transform duration-500 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-ink-600/10 px-6 py-5">
            <h2 className="font-display text-xl text-ink-700">Your Bag</h2>
            <button
              onClick={() => setOpen(false)}
              className="text-ink-500 hover:text-gold-600"
              aria-label="Close cart"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <p className="mt-10 text-center text-ink-400">
                Your bag is empty — the palace has much more to show you.
              </p>
            ) : (
              <ul className="space-y-5">
                {items.map((item) => (
                  <li key={item.productId + (item.variantId ?? "")} className="flex gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-marble-100">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={() => setOpen(false)}
                        className="font-display text-sm text-ink-700 hover:text-gold-600"
                      >
                        {item.name}
                      </Link>
                      {item.variantLabel && (
                        <p className="text-xs text-ink-400">{item.variantLabel}</p>
                      )}
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex items-center rounded-full border border-ink-600/15">
                          <button
                            className="px-2.5 py-1 text-ink-600"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1, item.variantId)
                            }
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <button
                            className="px-2.5 py-1 text-ink-600"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1, item.variantId)
                            }
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
                    <div className="text-sm font-medium text-ink-700">
                      {formatPaise(item.unitPricePaise * item.quantity)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-ink-600/10 px-6 py-5">
              <div className="mb-4 flex items-center justify-between text-ink-700">
                <span>Subtotal</span>
                <span className="font-display text-lg">{formatPaise(cartSubtotal(items))}</span>
              </div>
              <Button href="/checkout" variant="gold" className="w-full" onClick={() => setOpen(false)}>
                Proceed to Checkout
              </Button>
              <p className="mt-3 text-center text-xs text-ink-400">
                Shipping & taxes calculated at checkout
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

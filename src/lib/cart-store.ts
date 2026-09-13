import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  unitPricePaise: number;
  quantity: number;
  variantLabel?: string;
  variantId?: string;
  maxStock: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
};

function sameLine(a: CartItem, productId: string, variantId?: string) {
  return a.productId === productId && a.variantId === variantId;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item) => {
        const items = get().items;
        const existing = items.find((i) => sameLine(i, item.productId, item.variantId));
        if (existing) {
          set({
            items: items.map((i) =>
              sameLine(i, item.productId, item.variantId)
                ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.maxStock) }
                : i,
            ),
          });
        } else {
          set({ items: [...items, item] });
        }
        set({ isOpen: true });
      },
      removeItem: (productId, variantId) => {
        set({ items: get().items.filter((i) => !sameLine(i, productId, variantId)) });
      },
      updateQuantity: (productId, quantity, variantId) => {
        set({
          items: get()
            .items.map((i) =>
              sameLine(i, productId, variantId)
                ? { ...i, quantity: Math.max(1, Math.min(quantity, i.maxStock)) }
                : i,
            )
            .filter((i) => i.quantity > 0),
        });
      },
      clear: () => set({ items: [] }),
      setOpen: (open) => set({ isOpen: open }),
    }),
    { name: "belamore-cart", partialize: (state) => ({ items: state.items }) },
  ),
);

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.unitPricePaise * i.quantity, 0);
}

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

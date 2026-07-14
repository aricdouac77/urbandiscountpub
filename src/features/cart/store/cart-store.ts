import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  imageUrl: string;
  price: number;
  size: string | null;
  quantity: number;
};

export type AppliedCoupon = {
  code: string;
  type: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
  value: number;
};

type CartState = {
  items: CartItem[];
  coupon: AppliedCoupon | null;
  buyNowItem: CartItem | null;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
  clear: () => void;
  setBuyNow: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  clearBuyNow: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      coupon: null,
      buyNowItem: null,
      addItem: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.variantId === item.variantId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.variantId === item.variantId ? { ...i, quantity: i.quantity + quantity } : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity }] };
        }),
      removeItem: (variantId) =>
        set((state) => ({ items: state.items.filter((i) => i.variantId !== variantId) })),
      updateQuantity: (variantId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.variantId !== variantId)
              : state.items.map((i) => (i.variantId === variantId ? { ...i, quantity } : i)),
        })),
      applyCoupon: (coupon) => set({ coupon }),
      removeCoupon: () => set({ coupon: null }),
      clear: () => set({ items: [], coupon: null }),
      setBuyNow: (item, quantity = 1) => set({ buyNowItem: { ...item, quantity } }),
      clearBuyNow: () => set({ buyNowItem: null }),
    }),
    {
      name: "urbandiscount-cart",
      partialize: (state) => ({ items: state.items, coupon: state.coupon }),
    },
  ),
);

export function useCartTotalQuantity() {
  return useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
}

const FREE_SHIPPING_THRESHOLD = 50;
const STANDARD_SHIPPING_COST = 4.9;

export function computeCartTotals(items: CartItem[], coupon: AppliedCoupon | null) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discount = 0;
  if (coupon) {
    if (coupon.type === "PERCENTAGE") {
      discount = subtotal * (coupon.value / 100);
    } else if (coupon.type === "FIXED_AMOUNT") {
      discount = Math.min(coupon.value, subtotal);
    }
  }

  const discountedSubtotal = subtotal - discount;
  const freeShipping =
    coupon?.type === "FREE_SHIPPING" || discountedSubtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = items.length === 0 || freeShipping ? 0 : STANDARD_SHIPPING_COST;
  const total = discountedSubtotal + shipping;

  return { subtotal, discount, shipping, total, freeShipping };
}

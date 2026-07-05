import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_ITEMS = 8;

type RecentlyViewedState = {
  productIds: string[];
  addProduct: (productId: string) => void;
};

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      productIds: [],
      addProduct: (productId) =>
        set((state) => ({
          productIds: [productId, ...state.productIds.filter((id) => id !== productId)].slice(
            0,
            MAX_ITEMS,
          ),
        })),
    }),
    { name: "urbandiscount-recently-viewed" },
  ),
);

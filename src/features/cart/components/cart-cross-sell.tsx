"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { ProductGridSection } from "@/features/catalog/components/product-grid-section";
import { useCartStore } from "@/features/cart/store/cart-store";
import type { ProductCardData } from "@/features/catalog/types/product-card";

export function CartCrossSell({ suggestions }: { suggestions: ProductCardData[] }) {
  // Select the raw array (stable reference unless items actually change) and
  // derive the Set in a memo instead of inside the selector — a selector that
  // returns a new object/Set on every call defeats Zustand's reference-equality
  // check and causes an infinite render loop.
  const items = useCartStore((state) => state.items);
  const cartProductIds = useMemo(() => new Set(items.map((item) => item.productId)), [items]);
  const t = useTranslations("cart");

  const filtered = suggestions.filter((product) => !cartProductIds.has(product.id)).slice(0, 4);

  return (
    <ProductGridSection
      title={t("youMayAlsoLike")}
      subtitle={t("completeCart")}
      products={filtered}
    />
  );
}

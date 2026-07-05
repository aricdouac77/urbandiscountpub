"use client";

import { ProductGridSection } from "@/features/catalog/components/product-grid-section";
import { useCartStore } from "@/features/cart/store/cart-store";
import type { ProductCardData } from "@/features/catalog/types/product-card";

export function CartCrossSell({ suggestions }: { suggestions: ProductCardData[] }) {
  const cartProductIds = useCartStore(
    (state) => new Set(state.items.map((item) => item.productId)),
  );

  const filtered = suggestions.filter((product) => !cartProductIds.has(product.id)).slice(0, 4);

  return (
    <ProductGridSection
      title="Vous pourriez aussi aimer"
      subtitle="Complétez votre panier"
      products={filtered}
    />
  );
}

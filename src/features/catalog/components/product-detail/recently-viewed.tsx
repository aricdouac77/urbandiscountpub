"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRecentlyViewedStore } from "@/features/catalog/store/recently-viewed-store";
import { ProductCard } from "@/features/catalog/components/product-card";
import type { ProductCardData } from "@/features/catalog/types/product-card";

export function RecentlyViewed({ currentProductId }: { currentProductId: string }) {
  const addProduct = useRecentlyViewedStore((state) => state.addProduct);
  const productIds = useRecentlyViewedStore((state) => state.productIds);
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const locale = useLocale();
  const t = useTranslations("product");

  useEffect(() => {
    addProduct(currentProductId);
  }, [addProduct, currentProductId]);

  useEffect(() => {
    const otherIds = productIds.filter((id) => id !== currentProductId);
    if (otherIds.length === 0) {
      setProducts([]);
      return;
    }

    const controller = new AbortController();
    fetch(`/api/products/by-ids?ids=${otherIds.join(",")}&locale=${locale}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data: { products: ProductCardData[] }) => setProducts(data.products))
      .catch(() => {});

    return () => controller.abort();
  }, [productIds, currentProductId, locale]);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="mb-8 text-2xl font-semibold sm:text-3xl">{t("recentlyViewed")}</h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { CartItemRow } from "@/features/cart/components/cart-item-row";
import { CartSummary } from "@/features/cart/components/cart-summary";
import { computeCartTotals, useCartStore } from "@/features/cart/store/cart-store";

export function CartView() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const coupon = useCartStore((state) => state.coupon);
  const t = useTranslations("cart");

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-muted-foreground text-sm">{t("empty")}</p>
        <Button className="mt-6" asChild>
          <Link href="/">{t("continueShopping")}</Link>
        </Button>
      </div>
    );
  }

  const totals = computeCartTotals(items, coupon);

  return (
    <div className="grid gap-10 lg:grid-cols-3">
      <div className="lg:col-span-2">
        {items.map((item) => (
          <CartItemRow key={item.variantId} item={item} />
        ))}
      </div>

      <div className="space-y-6">
        <CartSummary
          subtotal={totals.subtotal}
          discount={totals.discount}
          shipping={totals.shipping}
          total={totals.total}
          freeShipping={totals.freeShipping}
        />
        <Button size="lg" className="w-full" asChild>
          <Link href="/checkout">{t("checkout")}</Link>
        </Button>
      </div>
    </div>
  );
}

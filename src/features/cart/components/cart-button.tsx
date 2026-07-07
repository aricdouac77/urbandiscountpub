"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ShoppingBag } from "lucide-react";
import { HeaderIconLink } from "@/components/layout/header-icon-link";
import { useCartTotalQuantity } from "@/features/cart/store/cart-store";

export function CartButton() {
  const [mounted, setMounted] = useState(false);
  const totalQuantity = useCartTotalQuantity();
  const t = useTranslations("nav");

  useEffect(() => setMounted(true), []);

  return (
    <HeaderIconLink href="/panier" label={t("cart")} count={mounted ? totalQuantity : 0}>
      <ShoppingBag className="size-5" />
    </HeaderIconLink>
  );
}

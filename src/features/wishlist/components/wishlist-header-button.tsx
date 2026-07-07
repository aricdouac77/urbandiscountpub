"use client";

import { useTranslations } from "next-intl";
import { Heart } from "lucide-react";
import { HeaderIconLink } from "@/components/layout/header-icon-link";
import { useWishlistIds } from "@/features/wishlist/hooks/use-wishlist";

export function WishlistHeaderButton() {
  const { data: wishlistIds } = useWishlistIds();
  const t = useTranslations("nav");

  return (
    <HeaderIconLink href="/wishlist" label={t("wishlist")} count={wishlistIds?.length ?? 0}>
      <Heart className="size-5" />
    </HeaderIconLink>
  );
}

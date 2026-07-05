"use client";

import { Heart } from "lucide-react";
import { HeaderIconLink } from "@/components/layout/header-icon-link";
import { useWishlistIds } from "@/features/wishlist/hooks/use-wishlist";

export function WishlistHeaderButton() {
  const { data: wishlistIds } = useWishlistIds();

  return (
    <HeaderIconLink href="/wishlist" label="Ma liste d'envies" count={wishlistIds?.length ?? 0}>
      <Heart className="size-5" />
    </HeaderIconLink>
  );
}

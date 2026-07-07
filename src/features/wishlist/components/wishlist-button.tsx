"use client";

import { useTranslations } from "next-intl";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToggleWishlist, useWishlistIds } from "@/features/wishlist/hooks/use-wishlist";

type WishlistButtonProps = {
  productId: string;
  className?: string;
  variant?: "overlay" | "inline";
};

export function WishlistButton({ productId, className, variant = "overlay" }: WishlistButtonProps) {
  const { data: wishlistIds } = useWishlistIds();
  const toggle = useToggleWishlist();
  const t = useTranslations("wishlist");

  const isWishlisted = wishlistIds?.includes(productId) ?? false;

  function handleClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    toggle.mutate(productId);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isWishlisted ? t("remove") : t("add")}
      aria-pressed={isWishlisted}
      className={cn(
        variant === "overlay" &&
          "bg-background/90 flex size-9 items-center justify-center rounded-full shadow-sm transition-transform hover:scale-105",
        variant === "inline" &&
          "hover:border-foreground/50 flex items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium",
        className,
      )}
    >
      <Heart
        className={cn(
          "size-4 transition-colors",
          isWishlisted ? "fill-brand text-brand" : "text-foreground",
        )}
      />
      {variant === "inline" && (isWishlisted ? t("inWishlist") : t("add"))}
    </button>
  );
}

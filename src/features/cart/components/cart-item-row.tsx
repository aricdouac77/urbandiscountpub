"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore, type CartItem } from "@/features/cart/store/cart-store";

export function CartItemRow({ item }: { item: CartItem }) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const t = useTranslations("cart");
  const locale = useLocale();

  function formatPrice(value: number) {
    return new Intl.NumberFormat(locale === "en" ? "en-US" : "fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  }

  return (
    <div className="flex gap-4 border-b py-6">
      <Link
        href={`/produits/${item.slug}`}
        className="bg-muted relative size-24 shrink-0 overflow-hidden rounded-md"
      >
        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link href={`/produits/${item.slug}`} className="text-sm font-medium hover:underline">
              {item.name}
            </Link>
            {item.size && (
              <p className="text-muted-foreground mt-1 text-xs">{t("size", { size: item.size })}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.variantId)}
            aria-label={t("removeItem")}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex items-center rounded-md border">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
              aria-label={t("decreaseQuantity")}
            >
              <Minus className="size-3.5" />
            </Button>
            <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
              aria-label={t("increaseQuantity")}
            >
              <Plus className="size-3.5" />
            </Button>
          </div>
          <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
        </div>
      </div>
    </div>
  );
}

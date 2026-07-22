"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/navigation";
import { useCartStore } from "@/features/cart/store/cart-store";
import { useProductColor } from "@/features/catalog/components/product-detail/product-color-context";
import type { ProductVariantData } from "@/features/catalog/types/product-detail";

type AddToCartFormProps = {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string;
  price: number;
  variants: ProductVariantData[];
};

export function AddToCartForm({
  productId,
  slug,
  name,
  imageUrl,
  price,
  variants,
}: AddToCartFormProps) {
  const defaultVariant = variants.find((v) => v.isDefault) ?? variants[0];

  const colors = useMemo(() => {
    const seen = new Map<string, string | null>();
    for (const variant of variants) {
      if (variant.color && !seen.has(variant.color)) {
        seen.set(variant.color, variant.colorHex);
      }
    }
    return Array.from(seen, ([name, hex]) => ({ name, hex }));
  }, [variants]);

  const { selectedColor, setSelectedColor } = useProductColor();
  const [selectedSize, setSelectedSize] = useState<string | null>(defaultVariant?.size ?? null);
  const [selectedSize2, setSelectedSize2] = useState<string | null>(defaultVariant?.size2 ?? null);
  const [quantity, setQuantity] = useState(1);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const setBuyNow = useCartStore((state) => state.setBuyNow);
  const router = useRouter();
  const t = useTranslations("product");

  const hasSize2 = variants.some((v) => v.size2);

  const colorVariants = useMemo(
    () => (selectedColor ? variants.filter((v) => v.color === selectedColor) : variants),
    [variants, selectedColor],
  );

  const sizeVariants = useMemo(() => {
    const seen = new Set<string>();
    return colorVariants.filter((v) => {
      if (!v.size || seen.has(v.size)) return false;
      seen.add(v.size);
      return true;
    });
  }, [colorVariants]);

  const size2Variants = useMemo(() => {
    if (!hasSize2) return [];
    const forSize = selectedSize
      ? colorVariants.filter((v) => v.size === selectedSize)
      : colorVariants;
    const seen = new Set<string>();
    return forSize.filter((v) => {
      if (!v.size2 || seen.has(v.size2)) return false;
      seen.add(v.size2);
      return true;
    });
  }, [colorVariants, selectedSize, hasSize2]);

  const selectedVariant = useMemo(() => {
    const match = colorVariants.find(
      (v) => v.size === selectedSize && (!hasSize2 || v.size2 === selectedSize2),
    );
    return match ?? colorVariants[0] ?? null;
  }, [colorVariants, selectedSize, selectedSize2, hasSize2]);

  const hasSizes = variants.some((v) => v.size && v.size !== "Unique");
  const outOfStock = selectedVariant ? selectedVariant.stock <= 0 : false;
  const lowStock = selectedVariant
    ? selectedVariant.stock > 0 && selectedVariant.stock <= 5
    : false;

  function handleSelectColor(colorName: string) {
    setSelectedColor(colorName);
    const stillAvailable = variants.find(
      (v) =>
        v.color === colorName &&
        v.size === selectedSize &&
        (!hasSize2 || v.size2 === selectedSize2),
    );
    if (!stillAvailable) {
      const firstForColor = variants.find((v) => v.color === colorName);
      setSelectedSize(firstForColor?.size ?? null);
      setSelectedSize2(firstForColor?.size2 ?? null);
    }
  }

  function handleSelectSize(size: string) {
    setSelectedSize(size);
    if (hasSize2) {
      const stillAvailable = colorVariants.find(
        (v) => v.size === size && v.size2 === selectedSize2,
      );
      if (!stillAvailable) {
        const firstForSize = colorVariants.find((v) => v.size === size);
        setSelectedSize2(firstForSize?.size2 ?? null);
      }
    }
  }

  function variantSizeLabel(variant: ProductVariantData) {
    return variant.size2 ? `${variant.size} / ${variant.size2}` : variant.size;
  }

  function handleAddToCart() {
    if (!selectedVariant) return;

    addItem(
      {
        productId,
        variantId: selectedVariant.id,
        slug,
        name,
        imageUrl,
        price,
        size: variantSizeLabel(selectedVariant),
      },
      quantity,
    );

    toast.success(t("addedToCartToast", { name }));
  }

  function handleBuyNow() {
    if (!selectedVariant) return;
    setIsBuyingNow(true);

    setBuyNow(
      {
        productId,
        variantId: selectedVariant.id,
        slug,
        name,
        imageUrl,
        price,
        size: variantSizeLabel(selectedVariant),
      },
      quantity,
    );

    router.push("/checkout");
  }

  return (
    <div className="space-y-6">
      {colors.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium">
            {t("colorLabel", { color: selectedColor ? ` — ${selectedColor}` : "" })}
          </p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => handleSelectColor(color.name)}
                aria-label={color.name}
                aria-pressed={color.name === selectedColor}
                className={cn(
                  "size-8 rounded-full border-2 transition-transform",
                  color.name === selectedColor
                    ? "border-foreground scale-110"
                    : "border-transparent hover:scale-105",
                )}
                style={{ backgroundColor: color.hex ?? undefined }}
              />
            ))}
          </div>
        </div>
      )}

      {hasSizes && (
        <div>
          <p className="mb-2 text-sm font-medium">{hasSize2 ? t("sizeTop") : t("size")}</p>
          <div className="flex flex-wrap gap-2">
            {sizeVariants.map((variant) => {
              const sizeInStock = colorVariants.some((v) => v.size === variant.size && v.stock > 0);
              return (
                <button
                  key={variant.id}
                  type="button"
                  disabled={!sizeInStock}
                  onClick={() => handleSelectSize(variant.size!)}
                  className={cn(
                    "min-w-11 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                    variant.size === selectedSize
                      ? "border-foreground bg-foreground text-background"
                      : "hover:border-foreground/50",
                    !sizeInStock && "cursor-not-allowed line-through opacity-40",
                  )}
                >
                  {variant.size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {hasSize2 && (
        <div>
          <p className="mb-2 text-sm font-medium">{t("sizeBottom")}</p>
          <div className="flex flex-wrap gap-2">
            {size2Variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                disabled={variant.stock <= 0}
                onClick={() => setSelectedSize2(variant.size2)}
                className={cn(
                  "min-w-11 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                  variant.size2 === selectedSize2
                    ? "border-foreground bg-foreground text-background"
                    : "hover:border-foreground/50",
                  variant.stock <= 0 && "cursor-not-allowed line-through opacity-40",
                )}
              >
                {variant.size2}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        {outOfStock && <p className="text-destructive text-sm">{t("outOfStockForSize")}</p>}
        {lowStock && (
          <p className="text-brand text-sm">
            {t("lowStock", { count: selectedVariant?.stock ?? 0 })}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-md border">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label={t("decreaseQuantity")}
          >
            <Minus className="size-4" />
          </Button>
          <span className="w-8 text-center text-sm font-medium">{quantity}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setQuantity((q) => Math.min(10, q + 1))}
            aria-label={t("increaseQuantity")}
          >
            <Plus className="size-4" />
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="flex-1"
          disabled={!selectedVariant || outOfStock}
          onClick={handleAddToCart}
        >
          {outOfStock ? t("unavailable") : t("addToCart")}
        </Button>
      </div>

      <Button
        type="button"
        size="lg"
        className="w-full"
        disabled={!selectedVariant || outOfStock || isBuyingNow}
        onClick={handleBuyNow}
      >
        {t("buyNow")}
      </Button>
    </div>
  );
}

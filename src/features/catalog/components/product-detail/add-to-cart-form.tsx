"use client";

import { useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/features/cart/store/cart-store";
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

  const [selectedColor, setSelectedColor] = useState<string | null>(
    defaultVariant?.color ?? colors[0]?.name ?? null,
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(defaultVariant?.size ?? null);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const sizeVariants = useMemo(
    () => (selectedColor ? variants.filter((v) => v.color === selectedColor) : variants),
    [variants, selectedColor],
  );

  const selectedVariant = useMemo(
    () => sizeVariants.find((v) => v.size === selectedSize) ?? sizeVariants[0] ?? null,
    [sizeVariants, selectedSize],
  );

  const hasSizes = variants.some((v) => v.size && v.size !== "Unique");
  const outOfStock = selectedVariant ? selectedVariant.stock <= 0 : false;
  const lowStock = selectedVariant
    ? selectedVariant.stock > 0 && selectedVariant.stock <= 5
    : false;

  function handleSelectColor(colorName: string) {
    setSelectedColor(colorName);
    const stillAvailable = variants.find((v) => v.color === colorName && v.size === selectedSize);
    if (!stillAvailable) {
      const firstForColor = variants.find((v) => v.color === colorName);
      setSelectedSize(firstForColor?.size ?? null);
    }
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
        size: selectedVariant.size,
      },
      quantity,
    );

    toast.success(`${name} ajouté au panier`);
  }

  return (
    <div className="space-y-6">
      {colors.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium">
            Couleur{selectedColor ? ` — ${selectedColor}` : ""}
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
          <p className="mb-2 text-sm font-medium">Taille</p>
          <div className="flex flex-wrap gap-2">
            {sizeVariants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                disabled={variant.stock <= 0}
                onClick={() => setSelectedSize(variant.size)}
                className={cn(
                  "min-w-11 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                  variant.size === selectedSize
                    ? "border-foreground bg-foreground text-background"
                    : "hover:border-foreground/50",
                  variant.stock <= 0 && "cursor-not-allowed line-through opacity-40",
                )}
              >
                {variant.size}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        {outOfStock && (
          <p className="text-destructive text-sm">Rupture de stock pour cette taille.</p>
        )}
        {lowStock && (
          <p className="text-brand text-sm">
            Plus que {selectedVariant?.stock} en stock — dépêchez-vous.
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
            aria-label="Diminuer la quantité"
          >
            <Minus className="size-4" />
          </Button>
          <span className="w-8 text-center text-sm font-medium">{quantity}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setQuantity((q) => Math.min(10, q + 1))}
            aria-label="Augmenter la quantité"
          >
            <Plus className="size-4" />
          </Button>
        </div>

        <Button
          type="button"
          size="lg"
          className="flex-1"
          disabled={!selectedVariant || outOfStock}
          onClick={handleAddToCart}
        >
          {outOfStock ? "Indisponible" : "Ajouter au panier"}
        </Button>
      </div>
    </div>
  );
}

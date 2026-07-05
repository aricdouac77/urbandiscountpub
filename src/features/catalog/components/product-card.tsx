import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { WishlistButton } from "@/features/wishlist/components/wishlist-button";
import type { ProductCardData } from "@/features/catalog/types/product-card";

function formatPrice(value: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const hasDiscount = product.compareAtPrice !== null && product.compareAtPrice > product.price;

  return (
    <Link href={`/produits/${product.slug}`} className="group block">
      <div className="bg-muted relative aspect-[4/5] overflow-hidden rounded-lg">
        <Image
          src={product.imageUrl}
          alt={product.imageAlt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNewArrival && (
            <Badge className="bg-brand text-brand-foreground border-0">Nouveau</Badge>
          )}
          {hasDiscount && (
            <Badge variant="destructive" className="border-0">
              Promo
            </Badge>
          )}
        </div>
        <WishlistButton productId={product.id} className="absolute top-3 right-3" />
      </div>
      <div className="mt-3 space-y-1">
        {product.brand && (
          <p className="text-muted-foreground text-xs tracking-wide uppercase">{product.brand}</p>
        )}
        <h3 className="text-sm font-medium">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{formatPrice(product.price)}</span>
          {hasDiscount && (
            <span className="text-muted-foreground text-sm line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

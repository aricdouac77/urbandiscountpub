import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/features/catalog/components/product-card";
import type { ProductCardData } from "@/features/catalog/types/product-card";

type ProductGridSectionProps = {
  title: string;
  subtitle?: string;
  href?: string;
  products: ProductCardData[];
};

export function ProductGridSection({ title, subtitle, href, products }: ProductGridSectionProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2>
          {subtitle && <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>}
        </div>
        {href && (
          <Link
            href={href}
            className="group hidden shrink-0 items-center gap-1 text-sm font-medium sm:flex"
          >
            Voir tout
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

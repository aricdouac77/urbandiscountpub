import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SiteBreadcrumb } from "@/components/layout/site-breadcrumb";
import { ProductGallery } from "@/features/catalog/components/product-detail/product-gallery";
import { AddToCartForm } from "@/features/catalog/components/product-detail/add-to-cart-form";
import { WishlistButton } from "@/features/wishlist/components/wishlist-button";
import { ProductInfoAccordion } from "@/features/catalog/components/product-detail/product-info-accordion";
import { ReviewsSection } from "@/features/catalog/components/product-detail/reviews-section";
import { RecentlyViewed } from "@/features/catalog/components/product-detail/recently-viewed";
import { ProductGridSection } from "@/features/catalog/components/product-grid-section";
import {
  getProductBySlug,
  getSimilarProducts,
} from "@/features/catalog/queries/get-product-detail";
import { prisma } from "@/lib/prisma";
import { safeJsonLd } from "@/lib/json-ld";

export const revalidate = 300;

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    select: { slug: true },
  });
  return products.map((product) => ({ slug: product.slug }));
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {};
  }

  return {
    title: product.name,
    description: product.description.slice(0, 160),
    alternates: { canonical: `/produits/${slug}` },
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: product.images[0] ? [product.images[0].url] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const similarProducts = await getSimilarProducts(product.categorySlug, product.id);
  const hasDiscount = product.compareAtPrice !== null && product.compareAtPrice > product.price;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: product.brand ?? undefined,
    image: product.images.map((image) => image.url),
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: product.price,
      availability: product.variants.some((v) => v.stock > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    ...(product.reviewCount > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.averageRating.toFixed(1),
        reviewCount: product.reviewCount,
      },
    }),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />

      <SiteBreadcrumb
        items={[
          ...(product.categoryName && product.categorySlug
            ? [{ label: product.categoryName, href: `/categories/${product.categorySlug}` }]
            : []),
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} productName={product.name} />

        <div>
          {product.brand && (
            <p className="text-muted-foreground text-sm tracking-wide uppercase">{product.brand}</p>
          )}
          <h1 className="font-heading mt-1 text-3xl font-semibold tracking-tight">
            {product.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            {product.isNewArrival && (
              <Badge className="bg-brand text-brand-foreground border-0">Nouveau</Badge>
            )}
            {hasDiscount && (
              <Badge variant="destructive" className="border-0">
                Promo
              </Badge>
            )}
            {product.reviewCount > 0 && (
              <Link href="#avis" className="flex items-center gap-1 text-sm">
                <Star className="fill-brand text-brand size-4" />
                {product.averageRating.toFixed(1)} ({product.reviewCount} avis)
              </Link>
            )}
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-semibold">{formatPrice(product.price)}</span>
            {hasDiscount && (
              <span className="text-muted-foreground text-lg line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </div>

          <div className="mt-8 space-y-3">
            <AddToCartForm
              productId={product.id}
              slug={product.slug}
              name={product.name}
              imageUrl={product.images[0]?.url ?? ""}
              price={product.price}
              variants={product.variants}
            />
            <WishlistButton
              productId={product.id}
              variant="inline"
              className="w-full justify-center"
            />
          </div>

          <div className="mt-10">
            <ProductInfoAccordion
              description={product.description}
              materials={product.materials}
              careInstructions={product.careInstructions}
            />
          </div>
        </div>
      </div>

      <ProductGridSection title="Vous aimerez aussi" products={similarProducts} />

      <ReviewsSection
        averageRating={product.averageRating}
        reviewCount={product.reviewCount}
        reviews={product.reviews}
      />

      <RecentlyViewed currentProductId={product.id} />
    </div>
  );
}

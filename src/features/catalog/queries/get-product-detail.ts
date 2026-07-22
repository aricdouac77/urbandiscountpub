import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { localize, localizeNullable } from "@/lib/locale-content";
import type { Locale } from "@/i18n/routing";
import type { ProductDetailData } from "@/features/catalog/types/product-detail";
import type { ProductCardData } from "@/features/catalog/types/product-card";

export const getProductBySlug = unstable_cache(
  async (slug: string, locale: Locale): Promise<ProductDetailData | null> => {
    const product = await prisma.product.findUnique({
      where: { slug, status: "ACTIVE" },
      include: {
        category: { select: { slug: true, name: true, nameEn: true } },
        images: { orderBy: { position: "asc" } },
        variants: {
          orderBy: { createdAt: "asc" },
          include: { images: { take: 1 } },
        },
        reviews: {
          where: { status: "APPROVED" },
          orderBy: { createdAt: "desc" },
          take: 20,
          include: { user: { select: { name: true } } },
        },
      },
    });

    if (!product) return null;

    const reviewCount = product.reviews.length;
    const averageRating =
      reviewCount > 0
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
        : 0;

    const colorImages: Record<string, string> = {};
    for (const variant of product.variants) {
      if (variant.color && variant.images[0] && !colorImages[variant.color]) {
        colorImages[variant.color] = variant.images[0].url;
      }
    }

    return {
      id: product.id,
      slug: product.slug,
      name: localize(product.name, product.nameEn, locale),
      brand: product.brand,
      description: localize(product.description, product.descriptionEn, locale),
      materials: localizeNullable(product.materials, product.materialsEn, locale),
      careInstructions: localizeNullable(
        product.careInstructions,
        product.careInstructionsEn,
        locale,
      ),
      videoUrl: product.videoUrl,
      price: Number(product.basePrice),
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
      isNewArrival: product.isNewArrival,
      isBestSeller: product.isBestSeller,
      categorySlug: product.category?.slug ?? null,
      categoryName: product.category
        ? localize(product.category.name, product.category.nameEn, locale)
        : null,
      images: product.images.map((image) => ({ id: image.id, url: image.url, alt: image.alt })),
      colorImages,
      variants: product.variants.map((variant) => ({
        id: variant.id,
        sku: variant.sku,
        size: variant.size,
        size2: variant.size2,
        color: variant.color,
        colorHex: variant.colorHex,
        stock: variant.stock,
        isDefault: variant.isDefault,
      })),
      reviews: product.reviews.map((review) => ({
        id: review.id,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        isVerifiedPurchase: review.isVerifiedPurchase,
        authorName: review.user.name,
        createdAt: review.createdAt.toISOString(),
      })),
      averageRating,
      reviewCount,
    };
  },
  ["product-detail"],
  { revalidate: 300, tags: ["products"] },
);

export const getSimilarProducts = unstable_cache(
  async (
    categorySlug: string | null,
    excludeProductId: string,
    locale: Locale,
    limit = 4,
  ): Promise<ProductCardData[]> => {
    if (!categorySlug) return [];

    const products = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        id: { not: excludeProductId },
        category: { slug: categorySlug },
      },
      include: { images: { orderBy: { position: "asc" }, take: 1 } },
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return products.map((product) => {
      const name = localize(product.name, product.nameEn, locale);
      return {
        id: product.id,
        slug: product.slug,
        name,
        brand: product.brand,
        imageUrl:
          product.images[0]?.url ?? "https://picsum.photos/seed/urbandiscount-fallback/900/1125",
        imageAlt: product.images[0]?.alt ?? name,
        price: Number(product.basePrice),
        compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
        isNewArrival: product.isNewArrival,
        isBestSeller: product.isBestSeller,
      };
    });
  },
  ["similar-products"],
  { revalidate: 300, tags: ["products"] },
);

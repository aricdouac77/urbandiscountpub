import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { ProductDetailData } from "@/features/catalog/types/product-detail";
import type { ProductCardData } from "@/features/catalog/types/product-card";

export const getProductBySlug = unstable_cache(
  async (slug: string): Promise<ProductDetailData | null> => {
    const product = await prisma.product.findUnique({
      where: { slug, status: "ACTIVE" },
      include: {
        category: { select: { slug: true, name: true } },
        images: { orderBy: { position: "asc" } },
        variants: { orderBy: { createdAt: "asc" } },
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

    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      description: product.description,
      materials: product.materials,
      careInstructions: product.careInstructions,
      videoUrl: product.videoUrl,
      price: Number(product.basePrice),
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
      isNewArrival: product.isNewArrival,
      isBestSeller: product.isBestSeller,
      categorySlug: product.category?.slug ?? null,
      categoryName: product.category?.name ?? null,
      images: product.images.map((image) => ({ id: image.id, url: image.url, alt: image.alt })),
      variants: product.variants.map((variant) => ({
        id: variant.id,
        sku: variant.sku,
        size: variant.size,
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

    return products.map((product) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      imageUrl:
        product.images[0]?.url ?? "https://picsum.photos/seed/urbandiscount-fallback/900/1125",
      imageAlt: product.images[0]?.alt ?? product.name,
      price: Number(product.basePrice),
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
      isNewArrival: product.isNewArrival,
      isBestSeller: product.isBestSeller,
    }));
  },
  ["similar-products"],
  { revalidate: 300, tags: ["products"] },
);

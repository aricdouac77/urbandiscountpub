import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { ProductCardData } from "@/features/catalog/types/product-card";
import type { Product, ProductImage } from "@/generated/prisma/client";

const PLACEHOLDER_IMAGE = "https://picsum.photos/seed/urbandiscount-fallback/900/1125";

function toProductCard(product: Product & { images: ProductImage[] }): ProductCardData {
  const primaryImage = product.images[0];

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    imageUrl: primaryImage?.url ?? PLACEHOLDER_IMAGE,
    imageAlt: primaryImage?.alt ?? product.name,
    price: Number(product.basePrice),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    isNewArrival: product.isNewArrival,
    isBestSeller: product.isBestSeller,
  };
}

const CARD_IMAGE_SELECT = {
  images: { orderBy: { position: "asc" as const }, take: 1 },
};

export const getFeaturedProducts = unstable_cache(
  async (limit = 8): Promise<ProductCardData[]> => {
    const products = await prisma.product.findMany({
      where: { status: "ACTIVE", isFeatured: true },
      include: CARD_IMAGE_SELECT,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
    return products.map(toProductCard);
  },
  ["home-featured-products"],
  { revalidate: 300, tags: ["products"] },
);

export const getBestSellers = unstable_cache(
  async (limit = 8): Promise<ProductCardData[]> => {
    const products = await prisma.product.findMany({
      where: { status: "ACTIVE", isBestSeller: true },
      include: CARD_IMAGE_SELECT,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
    return products.map(toProductCard);
  },
  ["home-best-sellers"],
  { revalidate: 300, tags: ["products"] },
);

export const getNewArrivals = unstable_cache(
  async (limit = 8): Promise<ProductCardData[]> => {
    const products = await prisma.product.findMany({
      where: { status: "ACTIVE", isNewArrival: true },
      include: CARD_IMAGE_SELECT,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
    return products.map(toProductCard);
  },
  ["home-new-arrivals"],
  { revalidate: 300, tags: ["products"] },
);

export type CollectionCardData = {
  id: string;
  slug: string;
  name: string;
  imageUrl: string;
};

export const getFeaturedCollections = unstable_cache(
  async (limit = 4): Promise<CollectionCardData[]> => {
    const collections = await prisma.collection.findMany({
      where: { isFeatured: true },
      take: limit,
      orderBy: { createdAt: "asc" },
    });
    return collections.map((collection) => ({
      id: collection.id,
      slug: collection.slug,
      name: collection.name,
      imageUrl: collection.image ?? PLACEHOLDER_IMAGE,
    }));
  },
  ["home-featured-collections"],
  { revalidate: 300, tags: ["collections"] },
);

export type CategoryNavData = {
  id: string;
  slug: string;
  name: string;
};

export const getNavCategories = unstable_cache(
  async (): Promise<CategoryNavData[]> => {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      orderBy: { position: "asc" },
      select: { id: true, slug: true, name: true },
    });
    return categories;
  },
  ["nav-categories"],
  { revalidate: 300, tags: ["categories"] },
);

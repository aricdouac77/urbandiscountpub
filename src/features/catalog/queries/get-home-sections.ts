import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { localize } from "@/lib/locale-content";
import type { Locale } from "@/i18n/routing";
import type { ProductCardData } from "@/features/catalog/types/product-card";
import type { Product, ProductImage } from "@/generated/prisma/client";

const PLACEHOLDER_IMAGE = "https://picsum.photos/seed/urbandiscount-fallback/900/1125";

function toProductCard(
  product: Product & { images: ProductImage[] },
  locale: Locale,
): ProductCardData {
  const primaryImage = product.images[0];
  const name = localize(product.name, product.nameEn, locale);

  return {
    id: product.id,
    slug: product.slug,
    name,
    brand: product.brand,
    imageUrl: primaryImage?.url ?? PLACEHOLDER_IMAGE,
    imageAlt: primaryImage?.alt ?? name,
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
  async (locale: Locale, limit = 8): Promise<ProductCardData[]> => {
    const products = await prisma.product.findMany({
      where: { status: "ACTIVE", isFeatured: true },
      include: CARD_IMAGE_SELECT,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
    return products.map((product) => toProductCard(product, locale));
  },
  ["home-featured-products"],
  { revalidate: 300, tags: ["products"] },
);

export const getBestSellers = unstable_cache(
  async (locale: Locale, limit = 8): Promise<ProductCardData[]> => {
    const products = await prisma.product.findMany({
      where: { status: "ACTIVE", isBestSeller: true },
      include: CARD_IMAGE_SELECT,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
    return products.map((product) => toProductCard(product, locale));
  },
  ["home-best-sellers"],
  { revalidate: 300, tags: ["products"] },
);

export const getNewArrivals = unstable_cache(
  async (locale: Locale, limit = 8): Promise<ProductCardData[]> => {
    const products = await prisma.product.findMany({
      where: { status: "ACTIVE", isNewArrival: true },
      include: CARD_IMAGE_SELECT,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
    return products.map((product) => toProductCard(product, locale));
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
  async (locale: Locale, limit = 4): Promise<CollectionCardData[]> => {
    const collections = await prisma.collection.findMany({
      where: { isFeatured: true },
      take: limit,
      orderBy: { createdAt: "asc" },
    });
    return collections.map((collection) => ({
      id: collection.id,
      slug: collection.slug,
      name: localize(collection.name, collection.nameEn, locale),
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
  async (locale: Locale): Promise<CategoryNavData[]> => {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      orderBy: { position: "asc" },
      select: { id: true, slug: true, name: true, nameEn: true },
    });
    return categories.map((category) => ({
      id: category.id,
      slug: category.slug,
      name: localize(category.name, category.nameEn, locale),
    }));
  },
  ["nav-categories"],
  { revalidate: 300, tags: ["categories"] },
);

"use server";

import { getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { getRedis } from "@/services/redis";
import { localize } from "@/lib/locale-content";
import type { Locale } from "@/i18n/routing";
import type { ProductCardData } from "@/features/catalog/types/product-card";

const PLACEHOLDER_IMAGE = "https://picsum.photos/seed/urbandiscount-fallback/900/1125";
const TRENDING_KEY = "search:trending";

export async function searchProductsPreview(query: string): Promise<ProductCardData[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const locale = (await getLocale()) as Locale;

  const [products] = await Promise.all([
    prisma.product.findMany({
      where: {
        status: "ACTIVE",
        OR: [
          { name: { contains: trimmed, mode: "insensitive" } },
          { nameEn: { contains: trimmed, mode: "insensitive" } },
          { brand: { contains: trimmed, mode: "insensitive" } },
          { shortDescription: { contains: trimmed, mode: "insensitive" } },
        ],
      },
      include: { images: { orderBy: { position: "asc" }, take: 1 } },
      take: 6,
    }),
    recordSearchTerm(trimmed),
  ]);

  return products.map((product) => {
    const name = localize(product.name, product.nameEn, locale);
    return {
      id: product.id,
      slug: product.slug,
      name,
      brand: product.brand,
      imageUrl: product.images[0]?.url ?? PLACEHOLDER_IMAGE,
      imageAlt: product.images[0]?.alt ?? name,
      price: Number(product.basePrice),
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
      isNewArrival: product.isNewArrival,
      isBestSeller: product.isBestSeller,
    };
  });
}

async function recordSearchTerm(term: string) {
  const redis = getRedis();
  if (!redis || term.length < 2) return;

  // Sorted set: score = number of times this term (lowercased) was searched.
  await redis.zincrby(TRENDING_KEY, 1, term.toLowerCase());
}

export async function getTrendingSearches(limit = 5): Promise<string[]> {
  const redis = getRedis();
  if (!redis) return [];

  const results = await redis.zrange<string[]>(TRENDING_KEY, 0, limit - 1, { rev: true });
  return results;
}

"use server";

import { getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth-guards";
import { localize } from "@/lib/locale-content";
import type { Locale } from "@/i18n/routing";
import type { ProductCardData } from "@/features/catalog/types/product-card";

const PLACEHOLDER_IMAGE = "https://picsum.photos/seed/urbandiscount-fallback/900/1125";

export async function getWishlistIds(): Promise<string[]> {
  const session = await getCurrentSession();
  if (!session) return [];

  const items = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    select: { productId: true },
  });

  return items.map((item) => item.productId);
}

export type ToggleWishlistResult = {
  ok: boolean;
  wishlisted?: boolean;
  requiresAuth?: boolean;
};

export async function toggleWishlistItem(productId: string): Promise<ToggleWishlistResult> {
  const session = await getCurrentSession();
  if (!session) {
    return { ok: false, requiresAuth: true };
  }

  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId: session.user.id, productId } },
  });

  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
    return { ok: true, wishlisted: false };
  }

  await prisma.wishlistItem.create({ data: { userId: session.user.id, productId } });
  return { ok: true, wishlisted: true };
}

export async function getWishlistProducts(): Promise<ProductCardData[]> {
  const session = await getCurrentSession();
  if (!session) return [];

  const locale = (await getLocale()) as Locale;

  const items = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        include: { images: { orderBy: { position: "asc" }, take: 1 } },
      },
    },
  });

  return items
    .filter((item) => item.product.status === "ACTIVE")
    .map(({ product }) => {
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

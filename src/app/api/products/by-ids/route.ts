import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { localize } from "@/lib/locale-content";
import { routing } from "@/i18n/routing";
import type { ProductCardData } from "@/features/catalog/types/product-card";

const PLACEHOLDER_IMAGE = "https://picsum.photos/seed/urbandiscount-fallback/900/1125";
const MAX_IDS = 12;

export async function GET(request: NextRequest) {
  const idsParam = request.nextUrl.searchParams.get("ids") ?? "";
  const ids = idsParam
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, MAX_IDS);

  const localeParam = request.nextUrl.searchParams.get("locale");
  const locale = (routing.locales as readonly string[]).includes(localeParam ?? "")
    ? (localeParam as (typeof routing.locales)[number])
    : routing.defaultLocale;

  if (ids.length === 0) {
    return NextResponse.json({ products: [] });
  }

  const products = await prisma.product.findMany({
    where: { id: { in: ids }, status: "ACTIVE" },
    include: { images: { orderBy: { position: "asc" }, take: 1 } },
  });

  const byId = new Map(products.map((product) => [product.id, product]));

  const ordered: ProductCardData[] = ids
    .map((id) => byId.get(id))
    .filter((product): product is NonNullable<typeof product> => Boolean(product))
    .map((product) => {
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

  return NextResponse.json({ products: ordered });
}

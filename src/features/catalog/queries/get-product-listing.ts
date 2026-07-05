import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { ProductCardData } from "@/features/catalog/types/product-card";
import type { Prisma } from "@/generated/prisma/client";

const PLACEHOLDER_IMAGE = "https://picsum.photos/seed/urbandiscount-fallback/900/1125";
const PAGE_SIZE = 12;

export type SortOption = "newest" | "price-asc" | "price-desc";

const SORT_ORDER_BY: Record<SortOption, Prisma.ProductOrderByWithRelationInput> = {
  newest: { createdAt: "desc" },
  "price-asc": { basePrice: "asc" },
  "price-desc": { basePrice: "desc" },
};

export type ProductListingResult = {
  products: ProductCardData[];
  totalCount: number;
  totalPages: number;
  page: number;
};

async function listProducts(
  where: Prisma.ProductWhereInput,
  page: number,
  sort: SortOption,
): Promise<ProductListingResult> {
  const safePage = Math.max(1, page);

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { images: { orderBy: { position: "asc" }, take: 1 } },
      orderBy: SORT_ORDER_BY[sort],
      skip: (safePage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: products.map((product) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      imageUrl: product.images[0]?.url ?? PLACEHOLDER_IMAGE,
      imageAlt: product.images[0]?.alt ?? product.name,
      price: Number(product.basePrice),
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
      isNewArrival: product.isNewArrival,
      isBestSeller: product.isBestSeller,
    })),
    totalCount,
    totalPages: Math.max(1, Math.ceil(totalCount / PAGE_SIZE)),
    page: safePage,
  };
}

export const getCategoryBySlug = unstable_cache(
  async (slug: string) => {
    return prisma.category.findUnique({ where: { slug } });
  },
  ["category-by-slug"],
  { revalidate: 300, tags: ["categories"] },
);

export const getCollectionBySlug = unstable_cache(
  async (slug: string) => {
    return prisma.collection.findUnique({ where: { slug } });
  },
  ["collection-by-slug"],
  { revalidate: 300, tags: ["collections"] },
);

export const getProductsByCategory = unstable_cache(
  async (categorySlug: string, page: number, sort: SortOption): Promise<ProductListingResult> => {
    // A category page also shows products from its subcategories (e.g. "Sneakers"
    // includes "Running" and "Lifestyle"), since products are assigned to leaf
    // categories only.
    return listProducts(
      {
        status: "ACTIVE",
        category: { OR: [{ slug: categorySlug }, { parent: { slug: categorySlug } }] },
      },
      page,
      sort,
    );
  },
  ["products-by-category"],
  { revalidate: 300, tags: ["products"] },
);

export const getProductsByCollection = unstable_cache(
  async (collectionSlug: string, page: number, sort: SortOption): Promise<ProductListingResult> => {
    return listProducts(
      { status: "ACTIVE", collections: { some: { collection: { slug: collectionSlug } } } },
      page,
      sort,
    );
  },
  ["products-by-collection"],
  { revalidate: 300, tags: ["products"] },
);

// Not wrapped in unstable_cache: free-text queries are effectively unique per
// search, so caching would grow unbounded for negligible benefit.
export async function getProductsBySearch(
  query: string,
  page: number,
  sort: SortOption,
): Promise<ProductListingResult> {
  const trimmed = query.trim();
  if (!trimmed) {
    return { products: [], totalCount: 0, totalPages: 1, page: 1 };
  }

  return listProducts(
    {
      status: "ACTIVE",
      OR: [
        { name: { contains: trimmed, mode: "insensitive" } },
        { brand: { contains: trimmed, mode: "insensitive" } },
        { shortDescription: { contains: trimmed, mode: "insensitive" } },
      ],
    },
    page,
    sort,
  );
}

"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guards";
import { productSchema, type ProductInput } from "@/features/admin/schemas/product.schema";
import type { ActionResult } from "@/actions/account.actions";

const PAGE_SIZE = 20;

export async function getProductsAdmin(page = 1, search = "") {
  await requireAdmin();

  const where = search ? { name: { contains: search, mode: "insensitive" as const } } : {};

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: { select: { name: true } },
        images: { orderBy: { position: "asc" as const }, take: 1 },
        variants: { select: { stock: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    totalCount,
    totalPages: Math.max(1, Math.ceil(totalCount / PAGE_SIZE)),
    page,
  };
}

export async function getProductForEdit(id: string) {
  await requireAdmin();

  return prisma.product.findUnique({
    where: { id },
    include: {
      variants: { orderBy: { createdAt: "asc" } },
      images: { orderBy: { position: "asc" } },
      collections: { select: { collectionId: true } },
    },
  });
}

export async function getCategoriesForSelect() {
  await requireAdmin();
  return prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });
}

export async function getCollectionsForSelect() {
  await requireAdmin();
  return prisma.collection.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });
}

function revalidateStorefront() {
  revalidateTag("products");
  revalidateTag("categories");
  revalidateTag("collections");
}

export async function createProduct(input: ProductInput): Promise<ActionResult & { id?: string }> {
  await requireAdmin();
  const parsed = productSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Données invalides." };
  }

  const data = parsed.data;

  const existingSlug = await prisma.product.findUnique({ where: { slug: data.slug } });
  if (existingSlug) {
    return { ok: false, message: "Ce slug est déjà utilisé par un autre produit." };
  }

  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      shortDescription: data.shortDescription || null,
      brand: data.brand || null,
      status: data.status,
      basePrice: data.basePrice,
      compareAtPrice: data.compareAtPrice || null,
      categoryId: data.categoryId || null,
      isFeatured: data.isFeatured ?? false,
      isBestSeller: data.isBestSeller ?? false,
      isNewArrival: data.isNewArrival ?? false,
      materials: data.materials || null,
      careInstructions: data.careInstructions || null,
      videoUrl: data.videoUrl || null,
      variants: {
        create: data.variants.map((v) => ({
          sku: v.sku,
          size: v.size || null,
          color: v.color || null,
          colorHex: v.colorHex || null,
          stock: v.stock,
          isDefault: v.isDefault ?? false,
        })),
      },
      images: {
        create: data.images.map((img, index) => ({
          url: img.url,
          alt: img.alt || null,
          position: index,
        })),
      },
      collections: {
        create: data.collectionIds.map((collectionId) => ({ collectionId })),
      },
    },
  });

  revalidateStorefront();
  revalidatePath("/admin/produits");

  return { ok: true, id: product.id };
}

export async function updateProduct(id: string, input: ProductInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = productSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Données invalides." };
  }

  const data = parsed.data;

  const existingSlug = await prisma.product.findUnique({ where: { slug: data.slug } });
  if (existingSlug && existingSlug.id !== id) {
    return { ok: false, message: "Ce slug est déjà utilisé par un autre produit." };
  }

  const existingVariantIds = data.variants.filter((v) => v.id).map((v) => v.id!);
  const existingImageIds = data.images.filter((img) => img.id).map((img) => img.id!);

  await prisma.$transaction([
    prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        shortDescription: data.shortDescription || null,
        brand: data.brand || null,
        status: data.status,
        basePrice: data.basePrice,
        compareAtPrice: data.compareAtPrice || null,
        categoryId: data.categoryId || null,
        isFeatured: data.isFeatured ?? false,
        isBestSeller: data.isBestSeller ?? false,
        isNewArrival: data.isNewArrival ?? false,
        materials: data.materials || null,
        careInstructions: data.careInstructions || null,
        videoUrl: data.videoUrl || null,
      },
    }),
    // Remove variants/images no longer present in the submitted form.
    prisma.productVariant.deleteMany({
      where: { productId: id, id: { notIn: existingVariantIds } },
    }),
    prisma.productImage.deleteMany({
      where: { productId: id, id: { notIn: existingImageIds } },
    }),
    prisma.productCollection.deleteMany({ where: { productId: id } }),
    ...(data.collectionIds.length > 0
      ? [
          prisma.productCollection.createMany({
            data: data.collectionIds.map((collectionId) => ({ productId: id, collectionId })),
          }),
        ]
      : []),
  ]);

  await Promise.all([
    ...data.variants.map((v) =>
      v.id
        ? prisma.productVariant.update({
            where: { id: v.id },
            data: {
              sku: v.sku,
              size: v.size || null,
              color: v.color || null,
              colorHex: v.colorHex || null,
              stock: v.stock,
              isDefault: v.isDefault ?? false,
            },
          })
        : prisma.productVariant.create({
            data: {
              productId: id,
              sku: v.sku,
              size: v.size || null,
              color: v.color || null,
              colorHex: v.colorHex || null,
              stock: v.stock,
              isDefault: v.isDefault ?? false,
            },
          }),
    ),
    ...data.images.map((img, index) =>
      img.id
        ? prisma.productImage.update({
            where: { id: img.id },
            data: { url: img.url, alt: img.alt || null, position: index },
          })
        : prisma.productImage.create({
            data: { productId: id, url: img.url, alt: img.alt || null, position: index },
          }),
    ),
  ]);

  revalidateStorefront();
  revalidatePath("/admin/produits");
  revalidatePath(`/produits/${data.slug}`);

  return { ok: true };
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });

  revalidateStorefront();
  revalidatePath("/admin/produits");

  return { ok: true };
}

"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guards";
import {
  categorySchema,
  collectionSchema,
  type CategoryInput,
  type CollectionInput,
} from "@/features/admin/schemas/category.schema";
import type { ActionResult } from "@/actions/account.actions";

export async function getCategoriesAdmin() {
  await requireAdmin();
  return prisma.category.findMany({
    orderBy: { position: "asc" },
    include: { _count: { select: { products: true } } },
  });
}

export async function createCategory(input: CategoryInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Données invalides." };
  }

  const existing = await prisma.category.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return { ok: false, message: "Ce slug est déjà utilisé." };
  }

  await prisma.category.create({
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description || null,
      image: parsed.data.image || null,
    },
  });

  revalidateTag("categories");
  revalidatePath("/admin/categories");
  return { ok: true };
}

export async function updateCategory(id: string, input: CategoryInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Données invalides." };
  }

  const existing = await prisma.category.findUnique({ where: { slug: parsed.data.slug } });
  if (existing && existing.id !== id) {
    return { ok: false, message: "Ce slug est déjà utilisé." };
  }

  await prisma.category.update({
    where: { id },
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description || null,
      image: parsed.data.image || null,
    },
  });

  revalidateTag("categories");
  revalidatePath("/admin/categories");
  return { ok: true };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.category.delete({ where: { id } });
  revalidateTag("categories");
  revalidatePath("/admin/categories");
  return { ok: true };
}

export async function getCollectionsAdmin() {
  await requireAdmin();
  return prisma.collection.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { products: true } } },
  });
}

export async function createCollection(input: CollectionInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = collectionSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Données invalides." };
  }

  const existing = await prisma.collection.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return { ok: false, message: "Ce slug est déjà utilisé." };
  }

  await prisma.collection.create({
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description || null,
      image: parsed.data.image || null,
      isFeatured: parsed.data.isFeatured ?? false,
    },
  });

  revalidateTag("collections");
  revalidatePath("/admin/collections");
  return { ok: true };
}

export async function updateCollection(id: string, input: CollectionInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = collectionSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Données invalides." };
  }

  const existing = await prisma.collection.findUnique({ where: { slug: parsed.data.slug } });
  if (existing && existing.id !== id) {
    return { ok: false, message: "Ce slug est déjà utilisé." };
  }

  await prisma.collection.update({
    where: { id },
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description || null,
      image: parsed.data.image || null,
      isFeatured: parsed.data.isFeatured ?? false,
    },
  });

  revalidateTag("collections");
  revalidatePath("/admin/collections");
  return { ok: true };
}

export async function deleteCollection(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.collection.delete({ where: { id } });
  revalidateTag("collections");
  revalidatePath("/admin/collections");
  return { ok: true };
}

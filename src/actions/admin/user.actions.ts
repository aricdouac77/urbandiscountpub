"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guards";
import type { ActionResult } from "@/actions/account.actions";
import type { Role } from "@/generated/prisma/client";

const PAGE_SIZE = 20;

export async function getUsersAdmin(page = 1, search = "") {
  await requireAdmin();

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { _count: { select: { orders: true } } },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    totalCount,
    totalPages: Math.max(1, Math.ceil(totalCount / PAGE_SIZE)),
    page,
  };
}

export async function getUserAdminDetail(id: string) {
  await requireAdmin();

  return prisma.user.findUnique({
    where: { id },
    include: {
      orders: { orderBy: { createdAt: "desc" }, take: 10 },
      addresses: true,
      _count: { select: { orders: true, reviews: true } },
    },
  });
}

export async function updateUserRole(id: string, role: Role): Promise<ActionResult> {
  const session = await requireAdmin();

  if (session.user.id === id) {
    return { ok: false, message: "Vous ne pouvez pas modifier votre propre rôle." };
  }

  await prisma.user.update({ where: { id }, data: { role } });

  revalidatePath("/admin/clients");
  revalidatePath(`/admin/clients/${id}`);
  return { ok: true };
}

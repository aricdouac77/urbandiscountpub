"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guards";
import { couponSchema, type CouponInput } from "@/features/admin/schemas/coupon.schema";
import type { ActionResult } from "@/actions/account.actions";

export async function getCouponsAdmin() {
  await requireAdmin();
  return prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createCoupon(input: CouponInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = couponSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Données invalides." };
  }

  const code = parsed.data.code.toUpperCase();
  const existing = await prisma.coupon.findUnique({ where: { code } });
  if (existing) {
    return { ok: false, message: "Ce code existe déjà." };
  }

  await prisma.coupon.create({
    data: {
      code,
      type: parsed.data.type,
      value: parsed.data.value,
      minOrderTotal: parsed.data.minOrderTotal ?? null,
      maxUses: parsed.data.maxUses ?? null,
      isActive: parsed.data.isActive ?? true,
    },
  });

  revalidatePath("/admin/coupons");
  return { ok: true };
}

export async function updateCoupon(id: string, input: CouponInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = couponSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Données invalides." };
  }

  const code = parsed.data.code.toUpperCase();
  const existing = await prisma.coupon.findUnique({ where: { code } });
  if (existing && existing.id !== id) {
    return { ok: false, message: "Ce code existe déjà." };
  }

  await prisma.coupon.update({
    where: { id },
    data: {
      code,
      type: parsed.data.type,
      value: parsed.data.value,
      minOrderTotal: parsed.data.minOrderTotal ?? null,
      maxUses: parsed.data.maxUses ?? null,
      isActive: parsed.data.isActive ?? true,
    },
  });

  revalidatePath("/admin/coupons");
  return { ok: true };
}

export async function deleteCoupon(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.coupon.delete({ where: { id } });
  revalidatePath("/admin/coupons");
  return { ok: true };
}

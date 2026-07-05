"use server";

import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

export type ValidateCouponResult =
  | { ok: true; code: string; type: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING"; value: number }
  | { ok: false; message: string };

export async function validateCoupon(
  code: string,
  subtotal: number,
): Promise<ValidateCouponResult> {
  const limited = await rateLimit("coupon", { requests: 10, windowSeconds: 60 });
  if (!limited.success) {
    return { ok: false, message: limited.message };
  }

  const trimmed = code.trim().toUpperCase();
  if (!trimmed) {
    return { ok: false, message: "Merci de saisir un code." };
  }

  const coupon = await prisma.coupon.findUnique({ where: { code: trimmed } });

  if (!coupon || !coupon.isActive) {
    return { ok: false, message: "Ce code promo n'existe pas ou n'est plus actif." };
  }

  const now = new Date();
  if (coupon.startsAt && coupon.startsAt > now) {
    return { ok: false, message: "Ce code promo n'est pas encore actif." };
  }
  if (coupon.expiresAt && coupon.expiresAt < now) {
    return { ok: false, message: "Ce code promo a expiré." };
  }
  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    return { ok: false, message: "Ce code promo a atteint sa limite d'utilisation." };
  }
  if (coupon.minOrderTotal && subtotal < Number(coupon.minOrderTotal)) {
    return {
      ok: false,
      message: `Ce code nécessite un minimum de commande de ${Number(coupon.minOrderTotal).toFixed(2)}€.`,
    };
  }

  return { ok: true, code: coupon.code, type: coupon.type, value: Number(coupon.value) };
}

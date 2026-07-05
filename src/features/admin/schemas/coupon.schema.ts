import { z } from "zod";

export const couponSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3, "3 caractères minimum")
    .regex(/^[A-Za-z0-9_-]+$/, "Lettres, chiffres, tirets uniquement"),
  type: z.enum(["PERCENTAGE", "FIXED_AMOUNT", "FREE_SHIPPING"]),
  value: z.coerce.number().min(0),
  minOrderTotal: z.coerce.number().min(0).optional().nullable(),
  maxUses: z.coerce.number().int().min(1).optional().nullable(),
  isActive: z.boolean().optional(),
});

export type CouponFormValues = z.input<typeof couponSchema>;
export type CouponInput = z.output<typeof couponSchema>;

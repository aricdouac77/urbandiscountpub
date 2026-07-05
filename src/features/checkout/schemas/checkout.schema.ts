import { z } from "zod";

export const shippingAddressSchema = z.object({
  email: z.email("Adresse e-mail invalide"),
  fullName: z.string().trim().min(2, "Nom complet requis"),
  line1: z.string().trim().min(3, "Adresse requise"),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(1, "Ville requise"),
  postalCode: z.string().trim().min(3, "Code postal requis"),
  country: z.string().trim().min(2, "Pays requis"),
  phone: z.string().trim().optional(),
});

export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;

export const createOrderSchema = z.object({
  shipping: shippingAddressSchema,
  items: z
    .array(
      z.object({
        variantId: z.string().min(1),
        quantity: z.number().int().min(1).max(10),
      }),
    )
    .min(1, "Le panier est vide"),
  couponCode: z.string().trim().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

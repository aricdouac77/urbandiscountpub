import { z } from "zod";

export const shippingAddressSchema = z.object({
  email: z.email("Adresse e-mail invalide"),
  firstName: z.string().trim().optional(),
  lastName: z.string().trim().min(2, "Nom requis"),
  line1: z.string().trim().min(3, "Adresse requise"),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(1, "Ville requise"),
  province: z.string().trim().optional(),
  postalCode: z.string().trim().min(3, "Code postal requis"),
  country: z.string().trim().min(2, "Pays requis"),
  phone: z.string().trim().optional(),
  marketingOptIn: z.boolean().optional(),
});

export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;

// Captured only for internal QA of the checkout flow before the payments
// team wires up the real Stripe card element — never used to charge anyone.
export const testCardSchema = z.object({
  cardNumber: z.string().trim().optional(),
  cardholderName: z.string().trim().optional(),
  expiry: z.string().trim().optional(),
  cvv: z.string().trim().optional(),
});

export type TestCardInput = z.infer<typeof testCardSchema>;

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
  testCard: testCardSchema.optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "2 caractères minimum").max(100),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const addressSchema = z.object({
  fullName: z.string().trim().min(2, "Nom complet requis"),
  company: z.string().trim().optional().or(z.literal("")),
  line1: z.string().trim().min(3, "Adresse requise"),
  line2: z.string().trim().optional().or(z.literal("")),
  city: z.string().trim().min(1, "Ville requise"),
  postalCode: z.string().trim().min(3, "Code postal requis"),
  country: z.string().trim().min(2, "Pays requis"),
  phone: z.string().trim().optional().or(z.literal("")),
  isDefault: z.boolean().optional(),
});

export type AddressInput = z.infer<typeof addressSchema>;

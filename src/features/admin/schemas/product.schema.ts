import { z } from "zod";

export const productVariantSchema = z.object({
  id: z.string().optional(),
  sku: z.string().trim().min(1, "SKU requis"),
  size: z.string().trim().optional().or(z.literal("")),
  color: z.string().trim().optional().or(z.literal("")),
  colorHex: z.string().trim().optional().or(z.literal("")),
  stock: z.coerce.number().int().min(0),
  isDefault: z.boolean().optional(),
});

export type ProductVariantInput = z.infer<typeof productVariantSchema>;

export const productImageSchema = z.object({
  id: z.string().optional(),
  url: z.url("URL invalide"),
  alt: z.string().trim().optional().or(z.literal("")),
});

export type ProductImageInput = z.infer<typeof productImageSchema>;

export const productSchema = z.object({
  name: z.string().trim().min(2, "Nom requis"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug requis")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Format : minuscules et tirets uniquement"),
  description: z.string().trim().min(10, "Description requise"),
  shortDescription: z.string().trim().max(200).optional().or(z.literal("")),
  brand: z.string().trim().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]),
  basePrice: z.coerce.number().min(0),
  compareAtPrice: z.coerce.number().min(0).optional().nullable(),
  categoryId: z.string().optional().or(z.literal("")),
  collectionIds: z.array(z.string()).default([]),
  isFeatured: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  materials: z.string().trim().optional().or(z.literal("")),
  careInstructions: z.string().trim().optional().or(z.literal("")),
  videoUrl: z.url().optional().or(z.literal("")),
  variants: z.array(productVariantSchema).min(1, "Au moins une variante requise"),
  images: z.array(productImageSchema).default([]),
});

// z.coerce fields (price/stock) make the schema's input type (raw form
// strings) diverge from its output type (parsed numbers). useForm must be
// typed with the input shape; server actions receive the parsed output.
export type ProductFormValues = z.input<typeof productSchema>;
export type ProductInput = z.output<typeof productSchema>;

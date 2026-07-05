import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Nom requis"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug requis")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Format : minuscules et tirets uniquement"),
  description: z.string().trim().optional().or(z.literal("")),
  image: z.url().optional().or(z.literal("")),
});

export type CategoryInput = z.infer<typeof categorySchema>;

export const collectionSchema = z.object({
  name: z.string().trim().min(2, "Nom requis"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug requis")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Format : minuscules et tirets uniquement"),
  description: z.string().trim().optional().or(z.literal("")),
  image: z.url().optional().or(z.literal("")),
  isFeatured: z.boolean().optional(),
});

export type CollectionInput = z.infer<typeof collectionSchema>;
